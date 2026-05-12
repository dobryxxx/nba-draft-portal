// ============================================================
// Prospect Validation Engine - JS runtime
// ============================================================
// Runtime companion for the TypeScript source. The app imports this
// file because the current Vite native loader setup does not parse
// TypeScript type-only syntax in UI imports.
// ============================================================

import { externalProspectReferences } from '../data/externalProspectReferences.js'
export { externalProspectReferences }

const MEASUREMENT_TOLERANCES = {
  heightInches: { info: 1, warning: 2, critical: 3 },
  wingspanInches: { info: 1.5, warning: 3, critical: 4.5 },
  weightPounds: { info: 8, warning: 16, critical: 25 },
}

const SUFFIXES = new Set(['jr', 'sr', 'ii', 'iii', 'iv'])

export function normalizePlayerName(name = '') {
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
    .trim()
}

const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, value))
const safeNumber = (value, fallback = 0) => typeof value === 'number' && Number.isFinite(value) ? value : fallback
const stat = (player, key) => safeNumber(player?.stats?.[key], 0)
const average = values => {
  const valid = values.filter(value => Number.isFinite(value))
  return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : 0
}

function levenshtein(a, b) {
  const matrix = Array.from({ length: a.length + 1 }, (_, i) => [i])
  for (let j = 1; j <= b.length; j += 1) matrix[0][j] = j
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      matrix[i][j] = a[i - 1] === b[j - 1]
        ? matrix[i - 1][j - 1]
        : Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
    }
  }
  return matrix[a.length][b.length]
}

function nameMatchScore(a, b) {
  if (!a || !b) return 0
  if (a === b) return 1
  if (a.includes(b) || b.includes(a)) return 0.9
  const aTokens = new Set(a.split(' '))
  const bTokens = new Set(b.split(' '))
  const shared = [...aTokens].filter(token => bTokens.has(token)).length
  const tokenScore = shared / Math.max(aTokens.size, bTokens.size, 1)
  const editScore = 1 - levenshtein(a, b) / Math.max(a.length, b.length, 1)
  return Math.max(tokenScore, editScore)
}

export function findExternalReferencesForPlayer(player, references = externalProspectReferences) {
  const normalized = normalizePlayerName(player?.name || '')
  return references
    .map(reference => ({
      reference,
      score: nameMatchScore(normalized, reference.normalizedName || normalizePlayerName(reference.name)),
    }))
    .filter(item => item.score >= 0.72)
    .sort((a, b) => b.score - a.score)
    .map(item => item.reference)
}

function parseHeightInches(value) {
  const match = String(value || '').match(/(\d+)\s*'\s*(\d+(?:\.\d+)?)?/)
  if (!match) return undefined
  return Number(match[1]) * 12 + Number(match[2] || 0)
}

function parseWeightPounds(value) {
  const match = String(value || '').match(/(\d+(?:\.\d+)?)/)
  return match ? Number(match[1]) : undefined
}

function roleFromPosition(position = '') {
  const value = String(position).toUpperCase()
  if (value.includes('C') || value.includes('PF')) return 'big'
  if (value.includes('SF') || value.includes('W')) return 'wing'
  return 'guard'
}

function recommendedTierForRank(rank) {
  if (!rank || !Number.isFinite(rank)) return 'SLEEPER'
  if (rank <= 3) return 'CORNERSTONE'
  if (rank <= 6) return 'ELITE'
  if (rank <= 14) return 'LOTTERY'
  if (rank <= 24) return 'MID_1ST'
  if (rank <= 32) return 'FRINGE'
  return 'SLEEPER'
}

function tierDistanceScore(current, expected) {
  const order = ['CORNERSTONE', 'ELITE', 'LOTTERY', 'MID_1ST', 'FRINGE', 'SLEEPER']
  const a = order.indexOf(String(current || '').toUpperCase())
  const b = order.indexOf(String(expected || '').toUpperCase())
  if (a < 0 || b < 0) return 0
  return Math.abs(a - b)
}

function measurementSeverity(diff, thresholds) {
  if (diff >= thresholds.critical) return 'critical'
  if (diff >= thresholds.warning) return 'warning'
  return 'info'
}

function mostCommon(values) {
  const counts = new Map()
  values.filter(Boolean).forEach(value => counts.set(value, (counts.get(value) || 0) + 1))
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]
}

const sourceList = references => [...new Set(references.map(reference => reference.source))]

export function validatePosition(player, references = findExternalReferencesForPlayer(player)) {
  const suggestions = []
  const current = player?.position
  const externalPositions = references.map(reference => reference.position).filter(Boolean)
  const externalConsensus = mostCommon(externalPositions)
  const consensusCount = externalConsensus ? externalPositions.filter(position => position === externalConsensus).length : 0

  if (externalConsensus && current && externalConsensus !== current && consensusCount >= 2) {
    suggestions.push({
      field: 'position',
      currentValue: current,
      suggestedValue: externalConsensus,
      confidence: 'high',
      severity: 'warning',
      reason: 'Duas ou mais fontes externas concordam em uma posição diferente da base atual.',
      evidence: references.filter(reference => reference.position === externalConsensus).map(reference => reference.source + ': ' + reference.position),
      sources: sourceList(references),
    })
  }

  const height = parseHeightInches(player?.height)
  const position = String(current || '').toUpperCase()

  if (height && height >= 81 && position.includes('PG')) {
    suggestions.push({
      field: 'position',
      currentValue: current,
      suggestedValue: stat(player, 'rpg') >= 6.5 || stat(player, 'blkPct') >= 2 ? 'SF/PF' : 'SG/SF',
      confidence: 'medium',
      severity: 'critical',
      reason: 'Altura de 6 pés e 9 polegadas ou mais contradiz listagem principal como PG.',
      evidence: ['Altura atual: ' + player.height, 'RPG: ' + stat(player, 'rpg'), 'BLK%: ' + stat(player, 'blkPct')],
    })
  }

  if (position.includes('C') && stat(player, 'apg') >= 3.5 && stat(player, 'threepa') >= 3 && stat(player, 'blkPct') < 2) {
    suggestions.push({
      field: 'position',
      currentValue: current,
      suggestedValue: 'PF/C',
      confidence: 'medium',
      severity: 'warning',
      reason: 'Perfil estatístico sugere big de habilidade/face-up, não apenas center tradicional.',
      evidence: ['APG: ' + stat(player, 'apg'), '3PA: ' + stat(player, 'threepa'), 'BLK%: ' + stat(player, 'blkPct')],
    })
  }

  if (height && height <= 75 && stat(player, 'apg') >= 4 && !position.includes('PG')) {
    suggestions.push({
      field: 'position',
      currentValue: current,
      suggestedValue: 'PG/SG',
      confidence: 'medium',
      severity: 'warning',
      reason: 'Altura e volume de assistências sugerem função primária de guard.',
      evidence: ['Altura atual: ' + player.height, 'APG: ' + stat(player, 'apg')],
    })
  }

  return suggestions
}

export function validateMeasurements(player, references = findExternalReferencesForPlayer(player)) {
  const suggestions = []
  const checks = [
    { field: 'height', parser: parseHeightInches, thresholds: MEASUREMENT_TOLERANCES.heightInches, label: 'altura' },
    { field: 'weight', parser: parseWeightPounds, thresholds: MEASUREMENT_TOLERANCES.weightPounds, label: 'peso' },
    { field: 'wingspan', parser: parseHeightInches, thresholds: MEASUREMENT_TOLERANCES.wingspanInches, label: 'envergadura' },
  ]

  for (const check of checks) {
    const currentRaw = player?.[check.field]
    const current = check.parser(currentRaw)
    const referencedValues = references.map(reference => reference[check.field]).filter(Boolean)
    const consensus = mostCommon(referencedValues)
    const consensusParsed = check.parser(consensus)

    if (!currentRaw) {
      suggestions.push({
        field: check.field,
        currentValue: currentRaw,
        suggestedValue: consensus || null,
        confidence: consensus ? 'medium' : 'low',
        severity: 'info',
        reason: 'Campo de ' + check.label + ' está vazio e deve ser revisado.',
        evidence: consensus ? ['Valor mais comum em referências: ' + consensus] : ['Sem referência externa disponível ainda.'],
        sources: sourceList(references),
      })
      continue
    }

    if (String(currentRaw).toLowerCase().includes('est')) {
      suggestions.push({
        field: check.field,
        currentValue: currentRaw,
        suggestedValue: consensus || currentRaw,
        confidence: consensus ? 'medium' : 'low',
        severity: 'info',
        reason: 'Valor marcado ou descrito como estimado, precisa de revisão manual.',
        evidence: ['Valor atual: ' + currentRaw],
        sources: sourceList(references),
      })
    }

    if (current && consensusParsed) {
      const diff = Math.abs(current - consensusParsed)
      if (diff >= check.thresholds.info) {
        const severity = measurementSeverity(diff, check.thresholds)
        suggestions.push({
          field: check.field,
          currentValue: currentRaw,
          suggestedValue: consensus,
          confidence: severity === 'critical' ? 'high' : 'medium',
          severity,
          reason: 'Diferença relevante entre a base atual e o valor mais comum nas referências.',
          evidence: ['Atual: ' + currentRaw, 'Referência comum: ' + consensus, 'Diferença normalizada: ' + diff.toFixed(1)],
          sources: sourceList(references),
        })
      }
    }
  }

  return suggestions
}

export function validateRankAndTier(player, references = findExternalReferencesForPlayer(player)) {
  const suggestions = []
  const currentRank = safeNumber(player?.rank, 0)
  const externalRanks = references.map(reference => reference.rank).filter(rank => typeof rank === 'number' && Number.isFinite(rank))

  if (currentRank && externalRanks.length) {
    const averageRank = Math.round(average(externalRanks))
    const diff = Math.abs(currentRank - averageRank)
    if (diff > 8) {
      suggestions.push({
        field: 'rank',
        currentValue: player.rank,
        suggestedValue: averageRank,
        confidence: externalRanks.length >= 3 ? 'high' : 'medium',
        severity: diff > 15 ? 'critical' : 'warning',
        reason: 'Rank da base está distante do consenso externo médio.',
        evidence: ['Rank atual: #' + currentRank, 'Consenso externo médio: #' + averageRank, 'Diferença: ' + diff + ' posições'],
        sources: sourceList(references),
      })
    }
  }

  const expectedTier = recommendedTierForRank(currentRank || undefined)
  const tierDistance = tierDistanceScore(player?.tier, expectedTier)
  if (player?.tier && tierDistance > 0) {
    suggestions.push({
      field: 'tier',
      currentValue: player.tier,
      suggestedValue: expectedTier,
      confidence: tierDistance > 1 ? 'high' : 'medium',
      severity: tierDistance > 1 ? 'warning' : 'info',
      reason: 'Tier atual não acompanha a faixa aproximada do rank.',
      evidence: ['Rank atual: #' + (currentRank || 'n/a'), 'Tier esperado pela regra: ' + expectedTier],
    })
  }

  return suggestions
}

export function validateStatGrades(player) {
  const role = roleFromPosition(player?.position)
  const stats = player?.stats || {}
  const has = key => typeof stats[key] === 'number' && Number.isFinite(stats[key])
  const value = (key, fallback) => has(key) ? Number(stats[key]) : fallback

  const ppg = value('ppg', role === 'guard' ? 12 : role === 'wing' ? 11 : 10)
  const rpg = value('rpg', role === 'big' ? 6.2 : role === 'wing' ? 4.6 : 3.2)
  const apg = value('apg', role === 'guard' ? 3.2 : role === 'wing' ? 2.1 : 1.4)
  const threep = value('threep', 33)
  const threepa = value('threepa', role === 'big' ? 1.2 : 3.2)
  const ftp = value('ftp', 72)
  const ts = value('ts', 55)
  const per = value('per', 18)
  const usg = value('usg', 21)
  const astTo = value('astTo', role === 'guard' ? 1.55 : 1.2)
  const blkPct = value('blkPct', role === 'big' ? 3.8 : 1.2)
  const stlPct = value('stlPct', 1.7)
  const age = safeNumber(player?.age, 20)
  const rank = safeNumber(player?.rank, 40)

  const rankPedigree = rank <= 3 ? 92 : rank <= 5 ? 88 : rank <= 10 ? 82 : rank <= 14 ? 76 : rank <= 20 ? 70 : rank <= 30 ? 62 : 54
  const ageDevelopment = age <= 18.8 ? 82 : age <= 19.6 ? 75 : age <= 20.8 ? 66 : age <= 22.5 ? 56 : 48
  const roleVolumeTarget = role === 'guard' ? 19 : role === 'wing' ? 17 : 15
  const reboundTarget = role === 'big' ? 10.2 : role === 'wing' ? 6.7 : 4.8
  const assistTarget = role === 'guard' ? 5.8 : role === 'wing' ? 3.8 : 2.8
  const blockTarget = role === 'big' ? 7 : role === 'wing' ? 3.2 : 2.3

  const shootingInputs = [
    threepa >= 3 ? clamp((threep - 28) * 5.4) : clamp((threep - 30) * 3.4 + 42),
    clamp((ftp - 62) * 2.05),
    clamp((ts - 50) * 4.6),
    threepa >= 5 ? 76 : threepa >= 3 ? 66 : threepa >= 1.5 ? 54 : 44,
  ]
  const shootingGrade = clamp(average(shootingInputs))

  const creationGrade = clamp(average([
    clamp((apg / assistTarget) * 82),
    clamp((astTo / (role === 'guard' ? 2.35 : 1.8)) * 78),
    clamp((usg - 15) * 4.6 + 36),
    clamp((ppg / roleVolumeTarget) * 82),
  ]))

  const defenseGrade = clamp(average([
    clamp((stlPct / 3.6) * 86),
    clamp((blkPct / blockTarget) * 86),
    role === 'big' && rpg >= 8 ? 70 : role === 'wing' && rpg >= 5.5 ? 62 : 54,
  ]))

  const reboundingGrade = clamp((rpg / reboundTarget) * 82)
  const efficiencyGrade = clamp(average([
    clamp((ts - 50) * 4.8),
    clamp(per * 3.05),
    ppg >= roleVolumeTarget * 0.8 && ts >= 58 ? 78 : 56,
  ]))

  const floorScore = clamp(average([
    efficiencyGrade * 0.34,
    shootingGrade * 0.18,
    defenseGrade * 0.18,
    reboundingGrade * (role === 'big' ? 0.14 : 0.07),
    rankPedigree * 0.16,
    age <= 20.5 ? 64 : 58,
  ]) * 1.18)

  const ceilingScore = clamp(average([
    rankPedigree * 0.30,
    ageDevelopment * 0.18,
    creationGrade * 0.20,
    clamp((ppg / roleVolumeTarget) * 88) * 0.16,
    clamp((usg - 16) * 4 + 48) * 0.10,
    Math.max(shootingGrade, defenseGrade) * 0.06,
  ]) * 1.28)

  const variance = Math.max(0, ceilingScore - floorScore)
  const redFlags = [
    has('threep') && threep < 31 && threepa >= 2.5 ? 10 : 0,
    has('ts') && ts < 52 ? 9 : 0,
    has('astTo') && astTo < 1.05 && role !== 'big' ? 7 : 0,
    age >= 22.5 && rank > 18 ? 7 : 0,
  ].reduce((sum, item) => sum + item, 0)
  const riskScore = clamp(32 + variance * 0.55 + redFlags - floorScore * 0.22)

  const gradeMap = { shooting: shootingGrade, creation: creationGrade, defense: defenseGrade, rebounding: reboundingGrade, efficiency: efficiencyGrade }
  const sorted = Object.entries(gradeMap).sort((a, b) => b[1] - a[1])

  return {
    shootingGrade: Math.round(shootingGrade),
    creationGrade: Math.round(creationGrade),
    defenseGrade: Math.round(defenseGrade),
    reboundingGrade: Math.round(reboundingGrade),
    efficiencyGrade: Math.round(efficiencyGrade),
    floorScore: Math.round(floorScore),
    ceilingScore: Math.round(ceilingScore),
    riskScore: Math.round(riskScore),
    floorLabel: outcomeLabel(floorScore),
    ceilingLabel: outcomeLabel(ceilingScore),
    riskLabel: riskLabel(riskScore, floorScore),
    primaryStrength: sorted[0]?.[0] || 'efficiency',
    primaryRisk: sorted[sorted.length - 1]?.[0] || 'creation',
  }
}

function outcomeLabel(score) {
  if (score >= 90) return 'MVP / franchise outlier'
  if (score >= 85) return 'Franchise player'
  if (score >= 75) return 'All-Star'
  if (score >= 65) return 'Starter'
  if (score >= 55) return 'Rotation'
  if (score >= 45) return 'Deep bench'
  return 'G-League / two-way'
}

function riskLabel(score, floorScore) {
  if (floorScore >= 65 && score < 70) return 'Low'
  if (floorScore >= 55 && score < 78) return 'Moderate'
  if (score >= 72) return 'High'
  if (score >= 48) return 'Moderate'
  return 'Low'
}

function toolLabel(score) {
  if (score >= 82) return 'Elite'
  if (score >= 68) return 'Plus'
  if (score >= 52) return 'Solid'
  return 'Question'
}

function buildEvaluationSuggestion(player, grades, references) {
  const sourceNotes = references.flatMap(reference => reference.notes || []).slice(0, 3)
  return {
    version: 'v2_review_bands',
    methodology: 'Faixas editoriais derivadas de produção, eficiência, idade, posição, rank e consenso externo. Não é dado oficial.',
    floor: {
      score: grades.floorScore,
      label: grades.floorLabel,
      confidence: grades.floorScore >= 65 ? 'medium' : 'low',
    },
    ceiling: {
      score: grades.ceilingScore,
      label: grades.ceilingLabel,
      confidence: grades.ceilingScore >= 75 ? 'medium' : 'low',
    },
    risk: {
      score: grades.riskScore,
      label: grades.riskLabel,
      confidence: 'medium',
    },
    tools: {
      shooting: { score: grades.shootingGrade, label: toolLabel(grades.shootingGrade) },
      creation: { score: grades.creationGrade, label: toolLabel(grades.creationGrade) },
      defense: { score: grades.defenseGrade, label: toolLabel(grades.defenseGrade) },
      rebounding: { score: grades.reboundingGrade, label: toolLabel(grades.reboundingGrade) },
      efficiency: { score: grades.efficiencyGrade, label: toolLabel(grades.efficiencyGrade) },
    },
    primaryStrength: grades.primaryStrength,
    primaryRisk: grades.primaryRisk,
    externalContext: sourceNotes,
  }
}

function archetypeFromGrades(player, grades, references) {
  const referenceArchetype = references.find(reference => reference.archetype)?.archetype
  if (referenceArchetype) return referenceArchetype
  const role = roleFromPosition(player?.position)
  if (grades.creationGrade >= 72 && stat(player, 'ppg') >= 16) return role === 'guard' ? 'Primary Shot Creator' : 'Creator Wing'
  if (grades.shootingGrade >= 72) return role === 'big' ? 'Stretch Big' : 'Movement Shooter'
  if (grades.defenseGrade >= 72) return role === 'big' ? 'Defensive Anchor' : 'Two-Way Defender'
  if (role === 'big') return 'Frontcourt Connector'
  if (role === 'wing') return 'Versatile Wing'
  return 'Combo Guard'
}

function strengthCopy(key, player) {
  if (key === 'shooting') return 'Arremesso confiável: ' + stat(player, 'threep').toFixed(1) + '% de 3 e ' + stat(player, 'ftp').toFixed(1) + '% nos lances livres.'
  if (key === 'creation') return 'Criação funcional: ' + stat(player, 'apg').toFixed(1) + ' APG com USG% de ' + stat(player, 'usg').toFixed(1) + '.'
  if (key === 'defense') return 'Atividade defensiva: ' + stat(player, 'stlPct').toFixed(1) + ' STL% e ' + stat(player, 'blkPct').toFixed(1) + ' BLK%.'
  if (key === 'rebounding') return 'Impacto no vidro: ' + stat(player, 'rpg').toFixed(1) + ' RPG para a posição.'
  return 'Eficiência sustentada: TS% de ' + stat(player, 'ts').toFixed(1) + ' e PER de ' + stat(player, 'per').toFixed(1) + '.'
}

function riskCopy(key, player) {
  if (key === 'shooting') return 'Arremesso exige revisão: ' + stat(player, 'threep').toFixed(1) + '% de 3 pode limitar espaçamento.'
  if (key === 'creation') return 'Criação para terceiros ainda instável: AST/TO de ' + stat(player, 'astTo').toFixed(1) + '.'
  if (key === 'defense') return 'Impacto defensivo pouco evidente nos stocks: ' + stat(player, 'stlPct').toFixed(1) + ' STL% e ' + stat(player, 'blkPct').toFixed(1) + ' BLK%.'
  if (key === 'rebounding') return 'Rebote abaixo do ideal para o papel: ' + stat(player, 'rpg').toFixed(1) + ' RPG.'
  return 'Eficiência precisa de contexto: TS% de ' + stat(player, 'ts').toFixed(1) + ' sob volume atual.'
}

export function generateScoutingSummary(player, derivedGrades = validateStatGrades(player), references = findExternalReferencesForPlayer(player)) {
  const archetype = archetypeFromGrades(player, derivedGrades, references)
  const strength = strengthCopy(derivedGrades.primaryStrength, player)
  const risk = riskCopy(derivedGrades.primaryRisk, player)
  const draftContext = derivedGrades.floorScore >= 70
    ? 'Perfil com piso relativamente seguro para a faixa do draft.'
    : derivedGrades.ceilingScore >= 78
      ? 'Perfil de aposta em teto, mais dependente de desenvolvimento.'
      : 'Perfil que precisa de papel bem definido para justificar a escolha.'
  const externalNotes = references.flatMap(reference => reference.notes || []).slice(0, 2)
  const externalContext = externalNotes.length ? 'Leitura externa: ' + externalNotes.join(' ') : draftContext
  return [(player?.name || 'O prospecto') + ' projeta como ' + archetype + '.', strength, risk, externalContext].join(' ')
}

export function generateStrengthsAndWeaknesses(player, derivedGrades = validateStatGrades(player)) {
  const gradeEntries = [
    ['shooting', derivedGrades.shootingGrade],
    ['creation', derivedGrades.creationGrade],
    ['defense', derivedGrades.defenseGrade],
    ['rebounding', derivedGrades.reboundingGrade],
    ['efficiency', derivedGrades.efficiencyGrade],
  ].sort((a, b) => Number(b[1]) - Number(a[1]))
  return {
    strengths: gradeEntries.slice(0, 3).map(([key]) => strengthCopy(String(key), player)),
    weaknesses: gradeEntries.slice(-2).reverse().map(([key]) => riskCopy(String(key), player)),
  }
}

function maybeSuggestScouting(player, grades, references) {
  const suggestions = []
  const generatedSummary = generateScoutingSummary(player, grades, references)
  const generated = generateStrengthsAndWeaknesses(player, grades)
  const currentNotes = player?.scouting?.notes || ''
  const currentStrengths = player?.scouting?.strengths || []
  const currentWeaknesses = player?.scouting?.weaknesses || []

  if (!currentNotes || currentNotes.length < 90 || /gen[eé]rico|placeholder|tbd/i.test(currentNotes)) {
    suggestions.push({
      field: 'scouting.notes',
      currentValue: currentNotes,
      suggestedValue: generatedSummary,
      confidence: 'medium',
      severity: 'info',
      reason: 'Resumo atual está ausente, curto ou genérico; o motor gerou uma versão baseada em estatísticas e contexto.',
      evidence: ['Primary strength: ' + grades.primaryStrength, 'Primary risk: ' + grades.primaryRisk],
      sources: sourceList(references),
    })
  }

  if (currentStrengths.length < 3) {
    suggestions.push({
      field: 'scouting.strengths',
      currentValue: currentStrengths,
      suggestedValue: generated.strengths,
      confidence: 'medium',
      severity: 'info',
      reason: 'Lista de forças tem menos de três itens revisáveis.',
      evidence: generated.strengths,
    })
  }

  if (currentWeaknesses.length < 2) {
    suggestions.push({
      field: 'scouting.weaknesses',
      currentValue: currentWeaknesses,
      suggestedValue: generated.weaknesses,
      confidence: 'medium',
      severity: 'info',
      reason: 'Lista de pontos de atenção tem menos de dois itens revisáveis.',
      evidence: generated.weaknesses,
    })
  }


  return suggestions
}

export function validateProspect(player) {
  const references = findExternalReferencesForPlayer(player)
  const grades = validateStatGrades(player)
  const suggestions = [
    ...validatePosition(player, references),
    ...validateMeasurements(player, references),
    ...validateRankAndTier(player, references),
    ...maybeSuggestScouting(player, grades, references),
  ]
  const criticalCount = suggestions.filter(item => item.severity === 'critical').length
  const warningCount = suggestions.filter(item => item.severity === 'warning').length
  const overallHealth = criticalCount ? 'problematic' : warningCount || suggestions.length ? 'needs_review' : 'clean'
  return {
    playerId: String(player?.id ?? player?.name ?? 'unknown'),
    playerName: player?.name || 'Unknown prospect',
    overallHealth,
    suggestions,
    summary: criticalCount
      ? 'Revisão prioritária: há inconsistências críticas nos dados.'
      : warningCount
        ? 'Precisa de revisão: há alertas relevantes para validar.'
        : suggestions.length
          ? 'Dados utilizáveis, com sugestões editoriais opcionais.'
          : 'Dados limpos pelas regras atuais.',
  }
}

export function validateAllProspects(players) {
  const healthOrder = { problematic: 0, needs_review: 1, clean: 2 }
  return players.map(validateProspect).sort((a, b) => healthOrder[a.overallHealth] - healthOrder[b.overallHealth] || b.suggestions.length - a.suggestions.length)
}

function setNestedValue(target, path, value) {
  const parts = path.split('.')
  let cursor = target
  parts.forEach((part, index) => {
    if (index === parts.length - 1) {
      cursor[part] = value
      return
    }
    cursor[part] = cursor[part] && typeof cursor[part] === 'object' ? cursor[part] : {}
    cursor = cursor[part]
  })
}

export function generateCorrectionPatch(report) {
  const suggestedChanges = {}
  report.suggestions
    .filter(item => item.confidence !== 'low')
    .forEach(item => setNestedValue(suggestedChanges, item.field, item.suggestedValue))
  return {
    playerId: report.playerId,
    suggestedChanges,
    suggestions: report.suggestions,
  }
}
