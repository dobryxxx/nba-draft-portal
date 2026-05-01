// ============================================================
// Prospect Validation Engine
// ============================================================
// Produces reviewable suggestions for prospect data quality.
// It never mutates the prospects database automatically.
// ============================================================

import { externalProspectReferences, type ExternalProspectReference } from '../data/externalProspectReferences';
import {
  MEASUREMENT_TOLERANCES,
  clamp,
  labelFromScore,
  measurementSeverity,
  parseHeightInches,
  parseWeightPounds,
  recommendedTierForRank,
  roleFromPosition,
  safeNumber,
  tierDistanceScore,
  type Confidence,
  type Severity,
} from '../data/prospectValidationRules';

export interface ProspectCorrectionSuggestion {
  field: string;
  currentValue: unknown;
  suggestedValue: unknown;
  confidence: Confidence;
  severity: Severity;
  reason: string;
  evidence: string[];
  sources?: string[];
}

export interface ProspectValidationReport {
  playerId: string;
  playerName: string;
  overallHealth: 'clean' | 'needs_review' | 'problematic';
  suggestions: ProspectCorrectionSuggestion[];
  summary: string;
}

export interface DerivedProspectGrades {
  shootingGrade: number;
  creationGrade: number;
  defenseGrade: number;
  reboundingGrade: number;
  efficiencyGrade: number;
  floorScore: number;
  ceilingScore: number;
  riskScore: number;
  primaryStrength: string;
  primaryRisk: string;
}

export interface ProspectCorrectionPatch {
  playerId: string;
  suggestedChanges: Record<string, unknown>;
  suggestions: ProspectCorrectionSuggestion[];
}

type ProspectLike = {
  id?: string | number;
  name?: string;
  position?: string;
  team?: string;
  age?: number;
  height?: string;
  weight?: string;
  wingspan?: string;
  tier?: string;
  rank?: number;
  stats?: Record<string, number | null | undefined>;
  scouting?: {
    strengths?: string[];
    weaknesses?: string[];
    notes?: string;
    attributes?: Record<string, number | null | undefined>;
  };
};

const SUFFIXES = new Set(['jr', 'sr', 'ii', 'iii', 'iv']);

export function normalizePlayerName(name = ''): string {
  return String(name)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[.'"]/g, '')
    .replace(/-/g, ' ')
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .filter(part => !SUFFIXES.has(part))
    .join(' ')
    .trim();
}

function levenshtein(a: string, b: string): number {
  const matrix = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j += 1) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      matrix[i][j] = a[i - 1] === b[j - 1]
        ? matrix[i - 1][j - 1]
        : Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
    }
  }
  return matrix[a.length][b.length];
}

function nameMatchScore(a: string, b: string): number {
  if (!a || !b) return 0;
  if (a === b) return 1;
  if (a.includes(b) || b.includes(a)) return 0.9;

  const aTokens = new Set(a.split(' '));
  const bTokens = new Set(b.split(' '));
  const shared = [...aTokens].filter(token => bTokens.has(token)).length;
  const tokenScore = shared / Math.max(aTokens.size, bTokens.size, 1);
  const editScore = 1 - levenshtein(a, b) / Math.max(a.length, b.length, 1);
  return Math.max(tokenScore, editScore);
}

export function findExternalReferencesForPlayer(
  player: ProspectLike,
  references: ExternalProspectReference[] = externalProspectReferences,
): ExternalProspectReference[] {
  const normalized = normalizePlayerName(player.name || '');
  return references
    .map(reference => ({
      reference,
      score: nameMatchScore(normalized, reference.normalizedName || normalizePlayerName(reference.name)),
    }))
    .filter(item => item.score >= 0.72)
    .sort((a, b) => b.score - a.score)
    .map(item => item.reference);
}

function stat(player: ProspectLike, key: string): number {
  return safeNumber(player.stats?.[key], 0);
}

function average(values: number[]): number {
  const valid = values.filter(value => Number.isFinite(value));
  return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : 0;
}

function mostCommon<T extends string | number | undefined>(values: T[]): T | undefined {
  const counts = new Map<T, number>();
  values.filter(Boolean).forEach(value => counts.set(value, (counts.get(value) || 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
}

function sourceList(references: ExternalProspectReference[]): string[] {
  return [...new Set(references.map(reference => reference.source))];
}

function suggestion(input: ProspectCorrectionSuggestion): ProspectCorrectionSuggestion {
  return input;
}

export function validatePosition(player: ProspectLike, references = findExternalReferencesForPlayer(player)): ProspectCorrectionSuggestion[] {
  const suggestions: ProspectCorrectionSuggestion[] = [];
  const current = player.position;
  const externalPositions = references.map(reference => reference.position).filter(Boolean) as string[];
  const externalConsensus = mostCommon(externalPositions);
  const consensusCount = externalConsensus ? externalPositions.filter(position => position === externalConsensus).length : 0;

  if (externalConsensus && current && externalConsensus !== current && consensusCount >= 2) {
    suggestions.push(suggestion({
      field: 'position',
      currentValue: current,
      suggestedValue: externalConsensus,
      confidence: 'high',
      severity: 'warning',
      reason: 'Duas ou mais fontes externas concordam em uma posição diferente da base atual.',
      evidence: references.filter(reference => reference.position === externalConsensus).map(reference => reference.source + ': ' + reference.position),
      sources: sourceList(references),
    }));
  }

  const height = parseHeightInches(player.height);
  const position = String(current || '').toUpperCase();
  const stats = player.stats || {};

  if (height && height >= 81 && position.includes('PG')) {
    suggestions.push(suggestion({
      field: 'position',
      currentValue: current,
      suggestedValue: stat(player, 'rpg') >= 6.5 || stat(player, 'blkPct') >= 2 ? 'SF/PF' : 'SG/SF',
      confidence: 'medium',
      severity: 'critical',
      reason: 'Altura de 6 pés e 9 polegadas ou mais contradiz listagem principal como PG.',
      evidence: ['Altura atual: ' + player.height, 'RPG: ' + (stats.rpg ?? 'n/a'), 'BLK%: ' + (stats.blkPct ?? 'n/a')],
    }));
  }

  if (position.includes('C') && stat(player, 'apg') >= 3.5 && stat(player, 'threepa') >= 3 && stat(player, 'blkPct') < 2) {
    suggestions.push(suggestion({
      field: 'position',
      currentValue: current,
      suggestedValue: 'PF/C',
      confidence: 'medium',
      severity: 'warning',
      reason: 'Perfil estatístico sugere big de habilidade/face-up, não apenas center tradicional.',
      evidence: ['APG: ' + stat(player, 'apg'), '3PA: ' + stat(player, 'threepa'), 'BLK%: ' + stat(player, 'blkPct')],
    }));
  }

  if (height && height <= 75 && stat(player, 'apg') >= 4 && !position.includes('PG')) {
    suggestions.push(suggestion({
      field: 'position',
      currentValue: current,
      suggestedValue: 'PG/SG',
      confidence: 'medium',
      severity: 'warning',
      reason: 'Altura e volume de assistências sugerem função primária de guard.',
      evidence: ['Altura atual: ' + player.height, 'APG: ' + stat(player, 'apg')],
    }));
  }

  return suggestions;
}

export function validateMeasurements(player: ProspectLike, references = findExternalReferencesForPlayer(player)): ProspectCorrectionSuggestion[] {
  const suggestions: ProspectCorrectionSuggestion[] = [];
  const checks = [
    { field: 'height', parser: parseHeightInches, thresholds: MEASUREMENT_TOLERANCES.heightInches, label: 'altura' },
    { field: 'weight', parser: parseWeightPounds, thresholds: MEASUREMENT_TOLERANCES.weightPounds, label: 'peso' },
    { field: 'wingspan', parser: parseHeightInches, thresholds: MEASUREMENT_TOLERANCES.wingspanInches, label: 'envergadura' },
  ] as const;

  for (const check of checks) {
    const currentRaw = player[check.field];
    const current = check.parser(currentRaw);
    const referencedValues = references.map(reference => reference[check.field]).filter(Boolean) as string[];
    const consensus = mostCommon(referencedValues);
    const consensusParsed = check.parser(consensus);

    if (!currentRaw) {
      suggestions.push(suggestion({
        field: check.field,
        currentValue: currentRaw,
        suggestedValue: consensus || null,
        confidence: consensus ? 'medium' : 'low',
        severity: 'info',
        reason: 'Campo de ' + check.label + ' está vazio e deve ser revisado.',
        evidence: consensus ? ['Valor mais comum em referências: ' + consensus] : ['Sem referência externa disponível ainda.'],
        sources: sourceList(references),
      }));
      continue;
    }

    if (String(currentRaw).toLowerCase().includes('est')) {
      suggestions.push(suggestion({
        field: check.field,
        currentValue: currentRaw,
        suggestedValue: consensus || currentRaw,
        confidence: consensus ? 'medium' : 'low',
        severity: 'info',
        reason: 'Valor marcado ou descrito como estimado, precisa de revisão manual.',
        evidence: ['Valor atual: ' + currentRaw],
        sources: sourceList(references),
      }));
    }

    if (current && consensusParsed) {
      const diff = Math.abs(current - consensusParsed);
      if (diff >= check.thresholds.info) {
        const severity = measurementSeverity(diff, check.thresholds);
        suggestions.push(suggestion({
          field: check.field,
          currentValue: currentRaw,
          suggestedValue: consensus,
          confidence: severity === 'critical' ? 'high' : 'medium',
          severity,
          reason: 'Diferença relevante entre a base atual e o valor mais comum nas referências.',
          evidence: ['Atual: ' + currentRaw, 'Referência comum: ' + consensus, 'Diferença normalizada: ' + diff.toFixed(1)],
          sources: sourceList(references),
        }));
      }
    }
  }

  return suggestions;
}

export function validateRankAndTier(player: ProspectLike, references = findExternalReferencesForPlayer(player)): ProspectCorrectionSuggestion[] {
  const suggestions: ProspectCorrectionSuggestion[] = [];
  const currentRank = safeNumber(player.rank, 0);
  const externalRanks = references.map(reference => reference.rank).filter((rank): rank is number => typeof rank === 'number' && Number.isFinite(rank));

  if (currentRank && externalRanks.length) {
    const averageRank = Math.round(average(externalRanks));
    const diff = Math.abs(currentRank - averageRank);
    if (diff > 8) {
      suggestions.push(suggestion({
        field: 'rank',
        currentValue: player.rank,
        suggestedValue: averageRank,
        confidence: externalRanks.length >= 3 ? 'high' : 'medium',
        severity: diff > 15 ? 'critical' : 'warning',
        reason: 'Rank da base está distante do consenso externo médio.',
        evidence: ['Rank atual: #' + currentRank, 'Consenso externo médio: #' + averageRank, 'Diferença: ' + diff + ' posições'],
        sources: sourceList(references),
      }));
    }
  }

  const expectedTier = recommendedTierForRank(currentRank || undefined);
  const tierDistance = tierDistanceScore(player.tier, expectedTier);
  if (player.tier && tierDistance > 0) {
    suggestions.push(suggestion({
      field: 'tier',
      currentValue: player.tier,
      suggestedValue: expectedTier,
      confidence: tierDistance > 1 ? 'high' : 'medium',
      severity: tierDistance > 1 ? 'warning' : 'info',
      reason: 'Tier atual não acompanha a faixa aproximada do rank.',
      evidence: ['Rank atual: #' + (currentRank || 'n/a'), 'Tier esperado pela regra: ' + expectedTier],
    }));
  }

  return suggestions;
}

export function validateStatGrades(player: ProspectLike): DerivedProspectGrades {
  const role = roleFromPosition(player.position);
  const ppg = stat(player, 'ppg');
  const rpg = stat(player, 'rpg');
  const apg = stat(player, 'apg');
  const threep = stat(player, 'threep');
  const threepa = stat(player, 'threepa');
  const ftp = stat(player, 'ftp');
  const ts = stat(player, 'ts');
  const per = stat(player, 'per');
  const usg = stat(player, 'usg');
  const astTo = stat(player, 'astTo');
  const blkPct = stat(player, 'blkPct');
  const stlPct = stat(player, 'stlPct');
  const age = safeNumber(player.age, 20);
  const rank = safeNumber(player.rank, 40);

  const shootingGrade = clamp(average([
    (threep - 27) * 5.2,
    (ftp - 58) * 2.2,
    (ts - 49) * 4.8,
    threepa >= 4 ? 72 : threepa >= 2 ? 58 : 42,
  ]));

  const creationGrade = clamp(average([
    (apg / 6.5) * 100,
    (astTo / 2.6) * 100,
    (usg - 14) * 4.7,
    (ppg / 24) * 92,
  ]));

  const defenseGrade = clamp(average([
    (stlPct / 4) * 100,
    (blkPct / (role === 'big' ? 7 : 3.5)) * 100,
    role === 'big' && rpg >= 8 ? 68 : 52,
  ]));

  const reboundingTarget = role === 'big' ? 10.5 : role === 'wing' ? 7 : 5.2;
  const reboundingGrade = clamp((rpg / reboundingTarget) * 100);
  const efficiencyGrade = clamp(average([(ts - 48) * 5.4, per * 3.2, ppg >= 16 && ts >= 58 ? 82 : 55]));
  const floorScore = clamp(average([efficiencyGrade, shootingGrade * 0.75, defenseGrade * 0.65, Math.max(40, 100 - rank * 1.3)]));
  const ceilingScore = clamp(average([(100 - Math.min(rank, 60)) + 20, creationGrade, ppg * 3.5, age <= 19 ? 84 : 66, usg >= 25 ? 78 : 58]));
  const riskScore = clamp(100 - floorScore * 0.62 + Math.max(0, ceilingScore - floorScore) * 0.55 + (threep && threep < 31 ? 14 : 0));

  const gradeMap = {
    shooting: shootingGrade,
    creation: creationGrade,
    defense: defenseGrade,
    rebounding: reboundingGrade,
    efficiency: efficiencyGrade,
  };
  const sorted = Object.entries(gradeMap).sort((a, b) => b[1] - a[1]);

  return {
    shootingGrade: Math.round(shootingGrade),
    creationGrade: Math.round(creationGrade),
    defenseGrade: Math.round(defenseGrade),
    reboundingGrade: Math.round(reboundingGrade),
    efficiencyGrade: Math.round(efficiencyGrade),
    floorScore: Math.round(floorScore),
    ceilingScore: Math.round(ceilingScore),
    riskScore: Math.round(riskScore),
    primaryStrength: sorted[0]?.[0] || 'efficiency',
    primaryRisk: sorted[sorted.length - 1]?.[0] || 'creation',
  };
}

function archetypeFromGrades(player: ProspectLike, grades: DerivedProspectGrades, references: ExternalProspectReference[]): string {
  const referenceArchetype = references.find(reference => reference.archetype)?.archetype;
  if (referenceArchetype) return referenceArchetype;
  const role = roleFromPosition(player.position);
  if (grades.creationGrade >= 72 && stat(player, 'ppg') >= 16) return role === 'guard' ? 'Primary Shot Creator' : 'Creator Wing';
  if (grades.shootingGrade >= 72) return role === 'big' ? 'Stretch Big' : 'Movement Shooter';
  if (grades.defenseGrade >= 72) return role === 'big' ? 'Defensive Anchor' : 'Two-Way Defender';
  if (role === 'big') return 'Frontcourt Connector';
  if (role === 'wing') return 'Versatile Wing';
  return 'Combo Guard';
}

function strengthCopy(key: string, player: ProspectLike, grades: DerivedProspectGrades): string {
  if (key === 'shooting') return 'Arremesso confiável: ' + stat(player, 'threep').toFixed(1) + '% de 3 e ' + stat(player, 'ftp').toFixed(1) + '% nos lances livres.';
  if (key === 'creation') return 'Criação funcional: ' + stat(player, 'apg').toFixed(1) + ' APG com USG% de ' + stat(player, 'usg').toFixed(1) + '.';
  if (key === 'defense') return 'Atividade defensiva: ' + stat(player, 'stlPct').toFixed(1) + ' STL% e ' + stat(player, 'blkPct').toFixed(1) + ' BLK%.';
  if (key === 'rebounding') return 'Impacto no vidro: ' + stat(player, 'rpg').toFixed(1) + ' RPG para a posição.';
  return 'Eficiência sustentada: TS% de ' + stat(player, 'ts').toFixed(1) + ' e PER de ' + stat(player, 'per').toFixed(1) + '.';
}

function riskCopy(key: string, player: ProspectLike): string {
  if (key === 'shooting') return 'Arremesso exige revisão: ' + stat(player, 'threep').toFixed(1) + '% de 3 pode limitar espaçamento.';
  if (key === 'creation') return 'Criação para terceiros ainda instável: AST/TO de ' + stat(player, 'astTo').toFixed(1) + '.';
  if (key === 'defense') return 'Impacto defensivo pouco evidente nos stocks: ' + stat(player, 'stlPct').toFixed(1) + ' STL% e ' + stat(player, 'blkPct').toFixed(1) + ' BLK%.';
  if (key === 'rebounding') return 'Rebote abaixo do ideal para o papel: ' + stat(player, 'rpg').toFixed(1) + ' RPG.';
  return 'Eficiência precisa de contexto: TS% de ' + stat(player, 'ts').toFixed(1) + ' sob volume atual.';
}

export function generateScoutingSummary(
  player: ProspectLike,
  derivedGrades = validateStatGrades(player),
  references = findExternalReferencesForPlayer(player),
): string {
  const archetype = archetypeFromGrades(player, derivedGrades, references);
  const strength = strengthCopy(derivedGrades.primaryStrength, player, derivedGrades);
  const risk = riskCopy(derivedGrades.primaryRisk, player);
  const draftContext = derivedGrades.floorScore >= 70
    ? 'Perfil com piso relativamente seguro para a faixa do draft.'
    : derivedGrades.ceilingScore >= 78
      ? 'Perfil de aposta em teto, mais dependente de desenvolvimento.'
      : 'Perfil que precisa de papel bem definido para justificar a escolha.';

  return [
    (player.name || 'O prospecto') + ' projeta como ' + archetype + '.',
    strength,
    risk,
    draftContext,
  ].join(' ');
}

export function generateStrengthsAndWeaknesses(
  player: ProspectLike,
  derivedGrades = validateStatGrades(player),
): { strengths: string[]; weaknesses: string[] } {
  const gradeEntries = [
    ['shooting', derivedGrades.shootingGrade],
    ['creation', derivedGrades.creationGrade],
    ['defense', derivedGrades.defenseGrade],
    ['rebounding', derivedGrades.reboundingGrade],
    ['efficiency', derivedGrades.efficiencyGrade],
  ].sort((a, b) => Number(b[1]) - Number(a[1]));

  const strengths = gradeEntries.slice(0, 3).map(([key]) => strengthCopy(String(key), player, derivedGrades));
  const weaknesses = gradeEntries.slice(-2).reverse().map(([key]) => riskCopy(String(key), player));

  return { strengths, weaknesses };
}

function maybeSuggestScouting(player: ProspectLike, grades: DerivedProspectGrades, references: ExternalProspectReference[]): ProspectCorrectionSuggestion[] {
  const suggestions: ProspectCorrectionSuggestion[] = [];
  const generatedSummary = generateScoutingSummary(player, grades, references);
  const generated = generateStrengthsAndWeaknesses(player, grades);
  const currentNotes = player.scouting?.notes || '';
  const currentStrengths = player.scouting?.strengths || [];
  const currentWeaknesses = player.scouting?.weaknesses || [];

  if (!currentNotes || currentNotes.length < 90 || /gen[eé]rico|placeholder|tbd/i.test(currentNotes)) {
    suggestions.push(suggestion({
      field: 'scouting.notes',
      currentValue: currentNotes,
      suggestedValue: generatedSummary,
      confidence: 'medium',
      severity: 'info',
      reason: 'Resumo atual está ausente, curto ou genérico; o motor gerou uma versão baseada em estatísticas e contexto.',
      evidence: ['Primary strength: ' + grades.primaryStrength, 'Primary risk: ' + grades.primaryRisk],
      sources: sourceList(references),
    }));
  }

  if (currentStrengths.length < 3) {
    suggestions.push(suggestion({
      field: 'scouting.strengths',
      currentValue: currentStrengths,
      suggestedValue: generated.strengths,
      confidence: 'medium',
      severity: 'info',
      reason: 'Lista de forças tem menos de três itens revisáveis.',
      evidence: generated.strengths,
    }));
  }

  if (currentWeaknesses.length < 2) {
    suggestions.push(suggestion({
      field: 'scouting.weaknesses',
      currentValue: currentWeaknesses,
      suggestedValue: generated.weaknesses,
      confidence: 'medium',
      severity: 'info',
      reason: 'Lista de pontos de atenção tem menos de dois itens revisáveis.',
      evidence: generated.weaknesses,
    }));
  }

  suggestions.push(suggestion({
    field: 'scouting.evaluation',
    currentValue: undefined,
    suggestedValue: {
      floorScore: grades.floorScore,
      ceilingScore: grades.ceilingScore,
      riskScore: grades.riskScore,
      shootingGrade: grades.shootingGrade,
      creationGrade: grades.creationGrade,
      defenseGrade: grades.defenseGrade,
      reboundingGrade: grades.reboundingGrade,
      efficiencyGrade: grades.efficiencyGrade,
    },
    confidence: 'medium',
    severity: 'info',
    reason: 'Pontuações derivadas para revisão editorial de floor, ceiling, risco e ferramentas principais.',
    evidence: [
      'Floor: ' + grades.floorScore,
      'Ceiling: ' + grades.ceilingScore,
      'Risk: ' + grades.riskScore,
      'Primary strength: ' + grades.primaryStrength + ' (' + labelFromScore(Math.max(grades.shootingGrade, grades.creationGrade, grades.defenseGrade, grades.reboundingGrade, grades.efficiencyGrade)) + ')',
    ],
  }));

  return suggestions;
}

export function validateProspect(player: ProspectLike): ProspectValidationReport {
  const references = findExternalReferencesForPlayer(player);
  const grades = validateStatGrades(player);
  const suggestions = [
    ...validatePosition(player, references),
    ...validateMeasurements(player, references),
    ...validateRankAndTier(player, references),
    ...maybeSuggestScouting(player, grades, references),
  ];

  const criticalCount = suggestions.filter(item => item.severity === 'critical').length;
  const warningCount = suggestions.filter(item => item.severity === 'warning').length;
  const overallHealth = criticalCount ? 'problematic' : warningCount || suggestions.length ? 'needs_review' : 'clean';

  return {
    playerId: String(player.id ?? player.name ?? 'unknown'),
    playerName: player.name || 'Unknown prospect',
    overallHealth,
    suggestions,
    summary: criticalCount
      ? 'Revisão prioritária: há inconsistências críticas nos dados.'
      : warningCount
        ? 'Precisa de revisão: há alertas relevantes para validar.'
        : suggestions.length
          ? 'Dados utilizáveis, com sugestões editoriais opcionais.'
          : 'Dados limpos pelas regras atuais.',
  };
}

export function validateAllProspects(players: ProspectLike[]): ProspectValidationReport[] {
  return players.map(validateProspect).sort((a, b) => {
    const healthOrder = { problematic: 0, needs_review: 1, clean: 2 };
    return healthOrder[a.overallHealth] - healthOrder[b.overallHealth] || b.suggestions.length - a.suggestions.length;
  });
}

function setNestedValue(target: Record<string, unknown>, path: string, value: unknown): void {
  const parts = path.split('.');
  let cursor: Record<string, unknown> = target;
  parts.forEach((part, index) => {
    if (index === parts.length - 1) {
      cursor[part] = value;
      return;
    }
    cursor[part] = (cursor[part] && typeof cursor[part] === 'object') ? cursor[part] : {};
    cursor = cursor[part] as Record<string, unknown>;
  });
}

export function generateCorrectionPatch(report: ProspectValidationReport): ProspectCorrectionPatch {
  const suggestedChanges: Record<string, unknown> = {};
  report.suggestions
    .filter(item => item.confidence !== 'low')
    .forEach(item => setNestedValue(suggestedChanges, item.field, item.suggestedValue));

  return {
    playerId: report.playerId,
    suggestedChanges,
    suggestions: report.suggestions,
  };
}
