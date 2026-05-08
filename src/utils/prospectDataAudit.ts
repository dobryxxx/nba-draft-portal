import {
  type AuditSeverity,
  type EnrichedProspectData,
  type MatchConfidence,
  type ProspectAuditIssue,
  enrichAllProspects,
  normalizePlayerName,
  normalizeSchoolName,
} from './prospectDataEnrichment.ts';
import type { ProspectExternalData } from './prospectExternalDataLoaders.ts';

export type ProspectAuditResult = {
  playerId?: string;
  name: string;
  rank?: number;
  position?: string;
  tier?: string;
  auditScore: number;
  severity: AuditSeverity;
  matchConfidence: MatchConfidence;
  matchedSources: string[];
  issues: ProspectAuditIssue[];
  suggestions: {
    position?: string;
    tier?: string;
    archetype?: string;
    projectedRole?: string;
    risk?: string;
    ceiling?: string;
    scoutGrade?: number;
    stats?: Record<string, any>;
    notes?: string[];
  };
};

export type ProspectAuditSummary = {
  totalProspects: number;
  matchedHighConfidence: number;
  matchedMediumConfidence: number;
  matchedLowConfidence: number;
  unmatched: number;
  cleanProspects: number;
  warningProspects: number;
  criticalProspects: number;
  results: ProspectAuditResult[];
};

const clamp = (value: number, min = 0, max = 100) => {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
};

const num = (value: any, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const pct = (value: any, fallback = 0) => {
  const parsed = num(value, fallback);
  if (parsed > 1000) return parsed / 100;
  if (parsed > 0 && parsed <= 1) return parsed * 100;
  return parsed;
};

const issue = (
  type: string,
  severity: AuditSeverity,
  message: string,
  field?: string,
  evidence: string[] = [],
  suggestion?: string,
): ProspectAuditIssue => ({ type, severity, field, message, evidence, suggestion });

const latestLine = (enriched: EnrichedProspectData) =>
  [...(enriched.externalStats.seasonLines?.lines || [])].sort((a, b) => num(b.yr) - num(a.yr))[0];

const externalValue = (enriched: EnrichedProspectData, keys: string[]) => {
  const sources = [enriched.externalStats.profile, enriched.externalStats.barttorvik, latestLine(enriched), enriched.externalStats.shotCreation];
  for (const source of sources) {
    for (const key of keys) {
      if (source?.[key] !== undefined && source?.[key] !== '') return source[key];
    }
  }
  return undefined;
};

export function validateIdentityConsistency(enriched: EnrichedProspectData): ProspectAuditIssue[] {
  const prospect = enriched.originalProspect;
  const issues: ProspectAuditIssue[] = [];
  if (enriched.matchConfidence === 'none') {
    issues.push(issue('identity', 'warning', 'Jogador nao encontrado nas fontes externas.', 'name', [], 'Revisar nome/escola ou adicionar alias manual.'));
    return issues;
  }

  const externalSchool = externalValue(enriched, ['team']);
  if (externalSchool && normalizeSchoolName(externalSchool) && normalizeSchoolName(prospect.team) !== normalizeSchoolName(externalSchool)) {
    issues.push(issue('identity', 'info', 'Escola/time externo diferente da base interna.', 'team', [`Interno: ${prospect.team}`, `Externo: ${externalSchool}`], 'Revisar se houve transferencia ou alias de escola.'));
  }
  return issues;
}

export function validateMeasurementConsistency(enriched: EnrichedProspectData): ProspectAuditIssue[] {
  const prospect = enriched.originalProspect;
  const profile = enriched.externalStats.profile;
  const issues: ProspectAuditIssue[] = [];
  const externalHeight = num(profile?.ht);
  const internalHeight = parseHeight(prospect.height);
  if (externalHeight && internalHeight && Math.abs(externalHeight - internalHeight) >= 2) {
    issues.push(issue('measurements', 'warning', 'Altura interna diverge da fonte externa.', 'height', [`Interno: ${prospect.height}`, `Externo: ${externalHeight} in`], `Considerar ${formatHeight(externalHeight)}.`));
  }
  if (!prospect.weight) issues.push(issue('missing_data', 'info', 'Peso ausente na base interna.', 'weight'));
  if (!prospect.wingspan) issues.push(issue('missing_data', 'info', 'Envergadura ausente na base interna.', 'wingspan'));
  return issues;
}

function parseHeight(value: any) {
  const text = String(value || '');
  const feet = text.match(/(\d+)'(\d+)/);
  const dash = text.match(/(\d+)-(\d+)/);
  const match = feet || dash;
  return match ? Number(match[1]) * 12 + Number(match[2]) : 0;
}

function formatHeight(inches: number) {
  return `${Math.floor(inches / 12)}'${inches % 12}"`;
}

export function validateRankTierConsistency(enriched: EnrichedProspectData): ProspectAuditIssue[] {
  const { rank, tier } = enriched.originalProspect;
  const issues: ProspectAuditIssue[] = [];
  const expected =
    rank <= 3 ? 'ELITE' :
    rank <= 14 ? 'LOTTERY' :
    rank <= 30 ? 'MID_1ST' :
    'SLEEPER';
  if (rank <= 5 && !['ELITE', 'LOTTERY'].includes(String(tier))) {
    issues.push(issue('rank_tier', 'critical', 'Rank alto com tier baixo.', 'tier', [`Rank #${rank}`, `Tier ${tier}`], `Considerar ${expected}.`));
  } else if (rank > 30 && ['ELITE', 'LOTTERY'].includes(String(tier))) {
    issues.push(issue('rank_tier', 'warning', 'Tier alto para rank fora da primeira rodada alta.', 'tier', [`Rank #${rank}`, `Tier ${tier}`], `Considerar ${expected}.`));
  }
  return issues;
}

export function validateStatsConsistency(enriched: EnrichedProspectData): ProspectAuditIssue[] {
  const stats = enriched.originalProspect.stats || {};
  const traits = enriched.derivedTraits;
  const issues: ProspectAuditIssue[] = [];
  const extThree = pct(externalValue(enriched, ['tp_pct', 'TP_per', 'tp_pct']));
  const extTs = pct(externalValue(enriched, ['ts', 'TS_per']));
  const extUsg = num(externalValue(enriched, ['usg']));
  const extBpm = num(externalValue(enriched, ['bpm', 'BPM']));
  const shot = enriched.externalStats.shotCreation;

  if (extThree && stats.threep && Math.abs(extThree - stats.threep) >= 7) {
    issues.push(issue('stats', 'warning', '3PT% interno diverge bastante da fonte externa.', 'stats.threep', [`Interno: ${stats.threep}`, `Externo: ${extThree}`], `Revisar 3PT% para ${extThree}.`));
  }
  if (extTs && stats.ts && Math.abs(extTs - stats.ts) >= 6) {
    issues.push(issue('stats', 'warning', 'TS% interno diverge da fonte externa.', 'stats.ts', [`Interno: ${stats.ts}`, `Externo: ${extTs}`], `Revisar TS% para ${extTs}.`));
  }
  if (extUsg >= 28 && num(stats.ppg) < 10 && extTs < 52) {
    issues.push(issue('stats', 'warning', 'Uso alto externo com baixa eficiencia/producao interna.', 'stats.usg', [`USG externo: ${extUsg}`, `TS externo: ${extTs}`, `PPG interno: ${stats.ppg}`], 'Revisar papel ofensivo e risco.'));
  }
  if (extBpm >= 7 && enriched.originalProspect.rank > 35) {
    issues.push(issue('stats', 'info', 'BPM externo alto para rank baixo.', 'rank', [`BPM externo: ${extBpm}`, `Rank: #${enriched.originalProspect.rank}`], 'Revisar se o board esta subestimando impacto.'));
  }
  if (shot && num(shot.overall_self_creation) < 25 && num(stats.ppg) >= 16) {
    issues.push(issue('shot_creation', 'warning', 'PPG alto, mas criacao propria externa baixa.', 'scouting.archetype', [`Self creation: ${shot.overall_self_creation}`, `PPG: ${stats.ppg}`], 'Evitar classificar como primary creator sem contexto.'));
  }
  if (traits.shooting >= 75 && /non-shooter|arremesso limitado|shooting/i.test(String(enriched.originalProspect.scouting?.weaknesses || ''))) {
    issues.push(issue('scouting', 'warning', 'Dados externos sugerem arremesso forte, mas scouting cita shooting como fraqueza.', 'scouting.weaknesses', [`Shooting trait: ${traits.shooting}`], 'Revisar weakness de shooting.'));
  }
  return issues;
}

export function validatePositionFit(enriched: EnrichedProspectData): ProspectAuditIssue[] {
  const prospect = enriched.originalProspect;
  const traits = enriched.derivedTraits;
  const pos = String(prospect.position || '').toUpperCase();
  const issues: ProspectAuditIssue[] = [];
  if (pos.includes('PG') && traits.playmaking < 45 && traits.creation < 50) {
    issues.push(issue('position', 'warning', 'PG com baixa criacao/playmaking externo.', 'position', [`Creation: ${traits.creation}`, `Playmaking: ${traits.playmaking}`], 'Considerar SG/combo guard ou revisar stats.'));
  }
  if ((pos.includes('C') || pos.includes('PF')) && traits.rebounding < 45 && traits.rimProtection < 45) {
    issues.push(issue('position', 'warning', 'Big sem indicadores externos claros de rebote/protecao de aro.', 'position', [`Rebounding: ${traits.rebounding}`, `Rim protection: ${traits.rimProtection}`], 'Revisar posicao ou papel projetado.'));
  }
  return issues;
}

export function validateScoutingConsistency(enriched: EnrichedProspectData): ProspectAuditIssue[] {
  const prospect = enriched.originalProspect;
  const traits = enriched.derivedTraits;
  const text = [
    prospect.archetype,
    prospect.projectedRole,
    prospect.scouting?.notes,
    ...(prospect.scouting?.strengths || []),
  ].join(' ').toLowerCase();
  const issues: ProspectAuditIssue[] = [];
  if (/primary creator|shot creator|criador/.test(text) && traits.creation < 45) {
    issues.push(issue('scouting', 'warning', 'Arquetipo de criador sem sustentacao externa forte.', 'archetype', [`Creation trait: ${traits.creation}`], 'Revisar archetype/projetedRole.'));
  }
  if (/shooter|arremessador|spacing/.test(text) && traits.shooting < 42) {
    issues.push(issue('scouting', 'warning', 'Scouting destaca arremesso, mas dados externos nao sustentam.', 'scouting.strengths', [`Shooting trait: ${traits.shooting}`], 'Revisar strength de shooting.'));
  }
  if (/rim protector|prote[cç][aã]o de aro|tocos/.test(text) && traits.rimProtection < 45) {
    issues.push(issue('scouting', 'warning', 'Scouting indica protecao de aro sem indicador externo forte.', 'scouting.strengths', [`Rim protection: ${traits.rimProtection}`], 'Revisar papel defensivo.'));
  }
  return issues;
}

export function validateProjectionConsistency(enriched: EnrichedProspectData): ProspectAuditIssue[] {
  const evalData = enriched.originalProspect.scouting?.evaluation || {};
  const ceiling = num(evalData.ceiling?.score);
  const floor = num(evalData.floor?.score);
  const issues: ProspectAuditIssue[] = [];
  if (ceiling >= 80 && enriched.originalProspect.rank > 25 && enriched.derivedTraits.upside < 70) {
    issues.push(issue('projection', 'warning', 'Teto alto para rank baixo sem suporte externo claro de upside.', 'scouting.evaluation.ceiling', [`Ceiling: ${ceiling}`, `Rank: #${enriched.originalProspect.rank}`, `Upside externo: ${enriched.derivedTraits.upside}`], 'Revisar ceiling.'));
  }
  if (floor >= 65 && enriched.derivedTraits.nbaReadiness < 45) {
    issues.push(issue('projection', 'warning', 'Piso alto com baixa prontidao externa.', 'scouting.evaluation.floor', [`Floor: ${floor}`, `NBA readiness externo: ${enriched.derivedTraits.nbaReadiness}`], 'Revisar floor.'));
  }
  return issues;
}

export function calculateAuditScore(issues: ProspectAuditIssue[]): number {
  const penalty = issues.reduce((sum, current) => sum + (current.severity === 'critical' ? 30 : current.severity === 'warning' ? 14 : 5), 0);
  return Math.round(clamp(100 - penalty));
}

export function getProspectAuditSeverity(issues: ProspectAuditIssue[]): AuditSeverity {
  if (issues.some((item) => item.severity === 'critical')) return 'critical';
  if (issues.some((item) => item.severity === 'warning')) return 'warning';
  return 'info';
}

function suggestionsFromIssues(issues: ProspectAuditIssue[]) {
  const suggestions: ProspectAuditResult['suggestions'] = { notes: [] };
  for (const item of issues) {
    if (item.field === 'position') suggestions.position = item.suggestion;
    if (item.field === 'tier') suggestions.tier = item.suggestion;
    if (item.field?.startsWith('stats.')) {
      suggestions.stats = suggestions.stats || {};
      suggestions.stats[item.field.replace('stats.', '')] = item.suggestion;
    }
    if (item.suggestion) suggestions.notes?.push(`${item.type}: ${item.suggestion}`);
  }
  return suggestions;
}

export function auditProspectData(enriched: EnrichedProspectData): ProspectAuditResult {
  const prospect = enriched.originalProspect;
  const missing = ['name', 'age', 'height', 'weight', 'wingspan', 'position', 'rank', 'tier', 'team', 'stats', 'scouting']
    .filter((key) => prospect[key] === undefined || prospect[key] === null || prospect[key] === '')
    .map((key) => issue('missing_data', key === 'name' || key === 'rank' ? 'critical' : 'info', `Campo ausente: ${key}.`, key));
  const issues = [
    ...enriched.auditFlags,
    ...missing,
    ...validateIdentityConsistency(enriched),
    ...validateMeasurementConsistency(enriched),
    ...validateRankTierConsistency(enriched),
    ...validateStatsConsistency(enriched),
    ...validatePositionFit(enriched),
    ...validateScoutingConsistency(enriched),
    ...validateProjectionConsistency(enriched),
  ];
  return {
    playerId: enriched.prospectId,
    name: enriched.name,
    rank: prospect.rank,
    position: prospect.position,
    tier: prospect.tier,
    auditScore: calculateAuditScore(issues),
    severity: issues.some((item) => item.severity === 'critical') ? 'critical' : issues.some((item) => item.severity === 'warning') ? 'warning' : 'info',
    matchConfidence: enriched.matchConfidence,
    matchedSources: enriched.matchedSources,
    issues,
    suggestions: suggestionsFromIssues(issues),
  };
}

export function auditAllProspects(prospects: any[], externalData: ProspectExternalData): ProspectAuditSummary {
  const enriched = enrichAllProspects(prospects, externalData);
  const results = enriched.map(auditProspectData).sort((a, b) => a.auditScore - b.auditScore);
  return {
    totalProspects: results.length,
    matchedHighConfidence: results.filter((item) => item.matchConfidence === 'high').length,
    matchedMediumConfidence: results.filter((item) => item.matchConfidence === 'medium').length,
    matchedLowConfidence: results.filter((item) => item.matchConfidence === 'low').length,
    unmatched: results.filter((item) => item.matchConfidence === 'none').length,
    cleanProspects: results.filter((item) => item.severity === 'info' && item.issues.length === 0).length,
    warningProspects: results.filter((item) => item.severity === 'warning').length,
    criticalProspects: results.filter((item) => item.severity === 'critical').length,
    results,
  };
}

export function generateProspectAuditReport(prospects: any[], externalData: ProspectExternalData): ProspectAuditSummary {
  return auditAllProspects(prospects, externalData);
}
