import { mergeProspectWithManualIntelligence } from '../data/prospectDraftIntelligence.ts'

export type ProjectionTier =
  | 'MVP'
  | 'Franchise Player'
  | 'All-Star'
  | 'Starter'
  | 'Rotacao'
  | 'Fundo de banco'
  | 'G-League'

export interface ProspectProjectionInput {
  baseTalent: number
  production: number
  efficiency: number
  creation: number
  physicalTools: number
  defense: number
  ageCurve: number
  nbaTranslation: number
  riskPenalty: number
}

export interface ProspectProjectionResult {
  score: number
  tier: ProjectionTier
  description: string
  rangePosition: number
  color: string
  factors: ProspectProjectionInput
  debug?: {
    rawScore: number
    cappedScore: number
    appliedCaps: string[]
    eliteTraits: number
    limitingFactors: string[]
    manualOverrideUsed?: boolean
    manualFieldsUsed?: string[]
    fallbackFieldsUsed?: string[]
  }
}

export function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min
  return Math.min(max, Math.max(min, value))
}

const safeNumber = (value: unknown, fallback = 0): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback

const normalize = (value: number, min: number, max: number): number =>
  clamp(((value - min) / (max - min)) * 100, 0, 100)

const average = (values: number[], fallback = 55): number => {
  const valid = values.filter(value => Number.isFinite(value))
  return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : fallback
}

const floorTierScore = (value?: string): number | undefined => ({
  STARTER: 66,
  ROTATION: 56,
  BENCH: 46,
  TWO_WAY: 40,
  G_LEAGUE: 36,
  OVERSEAS: 35,
} as Record<string, number>)[String(value || '').toUpperCase()]

const outcomeTierScore = (value?: string): number | undefined => ({
  MVP: 92,
  FRANCHISE_PLAYER: 84,
  ALL_STAR: 74,
  STARTER: 64,
  ROTATION: 54,
  BENCH: 44,
  G_LEAGUE: 36,
} as Record<string, number>)[String(value || '').toUpperCase()]

const outcomeTierLabel = (value?: string): ProjectionTier | undefined => ({
  MVP: 'MVP',
  FRANCHISE_PLAYER: 'Franchise Player',
  ALL_STAR: 'All-Star',
  STARTER: 'Starter',
  ROTATION: 'Rotacao',
  BENCH: 'Fundo de banco',
  G_LEAGUE: 'G-League',
} as Record<string, ProjectionTier>)[String(value || '').toUpperCase()]

const parseFeetInches = (value?: string): number | null => {
  const match = String(value || '').match(/(\d+)\s*'\s*(\d+(?:\.\d+)?)?/)
  if (!match) return null
  return Number(match[1]) * 12 + Number(match[2] || 0)
}

const toolGradeToScore = (value: unknown): number | null => {
  if (typeof value === 'number') return clamp(value * 10, 0, 100)
  const key = String(value || '').toLowerCase()
  if (key.includes('elite')) return 86
  if (key.includes('plus')) return 72
  if (key.includes('solid')) return 58
  if (key.includes('question')) return 34
  return null
}

export function getProjectionTier(score: number): ProjectionTier {
  if (score >= 90) return 'MVP'
  if (score >= 80) return 'Franchise Player'
  if (score >= 70) return 'All-Star'
  if (score >= 60) return 'Starter'
  if (score >= 50) return 'Rotacão'
  if (score >= 40) return 'Fundo de banco'
  return 'G-League'
}

export function getProjectionDescription(score: number): string {
  if (score >= 90) return 'Outcome extremamente raro. Exige criação de elite, tradução clara e impacto capaz de mudar uma franquia.'
  if (score >= 80) return 'Cenário alto, reservado para prospectos com caminho realista para protagonismo ofensivo ou impacto two-way de elite.'
  if (score >= 70) return 'Cenário positivo de alto impacto, dependente de evolução em áreas-chave e tradução consistente.'
  if (score >= 60) return 'Projeção forte e realista de titular, com função clara e impacto em rotação NBA.'
  if (score >= 50) return 'Caminho realista para rotação NBA, geralmente dependente de função específica e consistência.'
  if (score >= 40) return 'Perfil de fim de rotacão, dependente de contexto, especialização ou desenvolvimento.'
  return 'Perfil que ainda precisa provar traducão NBA antes de projetar minutos consistentes.'
}

export function getProjectionColor(score: number): string {
  if (score >= 90) return '#7c5ccf'
  if (score >= 80) return '#9b7be8'
  if (score >= 70) return '#5aaed6'
  if (score >= 60) return '#6fbf9c'
  if (score >= 50) return '#c9a941'
  if (score >= 40) return '#e6a06f'
  return '#e8a6a6'
}

export function getProjectionRangePosition(score: number): number {
  return clamp(((score - 35) / 65) * 100, 0, 100)
}

export function countEliteTraits(input: ProspectProjectionInput): number {
  return [
    input.production >= 80,
    input.creation >= 80,
    input.efficiency >= 78,
    input.physicalTools >= 82,
    input.defense >= 80,
    input.nbaTranslation >= 80,
  ].filter(Boolean).length
}

export function hasStarPathException(prospect: any, input: ProspectProjectionInput): boolean {
  const position = String(prospect?.position || '').toUpperCase()
  const archetype = String(prospect?.archetype || prospect?.scouting?.archetype || prospect?.scouting?.evaluation?.archetype || '').toLowerCase()
  const notes = [
    prospect?.scouting?.notes,
    ...(prospect?.scouting?.strengths || []),
    ...(prospect?.scouting?.weaknesses || []),
  ].join(' ').toLowerCase()
  const big = position.includes('C') || position.includes('PF')
  const wing = position.includes('SF') || position.includes('PF')
  const creatorText = archetype.includes('creator') || notes.includes('criador') || notes.includes('creator')
  const defensiveBig = big && input.defense >= 82 && input.physicalTools >= 78 && input.nbaTranslation >= 70
  const twoWayWing = wing && input.defense >= 76 && input.creation >= 68 && input.physicalTools >= 74
  const movementShooter = input.efficiency >= 80 && input.production >= 72 && notes.includes('arremess')
  const jumboCreator = input.creation >= 78 && input.physicalTools >= 76 && creatorText
  return defensiveBig || twoWayWing || movementShooter || jumboCreator
}

export function applyRealismCaps(score: number, input: ProspectProjectionInput, prospect?: any) {
  let cappedScore = clamp(score, 35, 100)
  const appliedCaps: string[] = []
  const limitingFactors: string[] = []
  const eliteTraits = countEliteTraits(input)
  const rank = safeNumber(prospect?.rank, 45)
  const tier = String(prospect?.tier || '').toUpperCase()
  const starException = hasStarPathException(prospect, input)
  const hasEliteTier = ['CORNERSTONE', 'ELITE'].includes(tier)
  const hasLotteryTier = ['CORNERSTONE', 'ELITE', 'LOTTERY', 'ALL_STAR'].includes(tier)
  const highRisk = input.riskPenalty >= 68
  const extremeRisk = input.riskPenalty >= 82

  const cap = (max: number, reason: string) => {
    if (cappedScore > max) {
      cappedScore = max
      appliedCaps.push(reason)
    }
  }

  if (input.baseTalent < 60) cap(59, 'base talent abaixo de Rotacao alta')
  if (input.baseTalent < 70) cap(69, 'base talent abaixo de teto All-Star')
  if (input.nbaTranslation < 65) cap(69, 'traducao NBA abaixo de teto All-Star')
  if (input.creation < 65 && !starException) cap(69, 'criacao limitada sem excecao de estrela')
  if (input.creation < 55 && input.production < 75 && !starException) cap(59, 'sem criacao propria nem producao elite')
  if (input.efficiency < 55 && input.production < 80) cap(69, 'eficiencia baixa sem volume elite')
  if (eliteTraits === 0) cap(69, 'sem pilar elite claro')
  if (rank > 35 && !starException) cap(59, 'rank fora do top 35')
  if (rank > 20 && !starException) cap(69, 'rank fora do top 20')
  if (highRisk && !starException) cap(69, 'risco alto limita teto realista')
  if (extremeRisk) cap(59, 'risco extremo limita outcome')

  const mvpEligible =
    cappedScore >= 90 &&
    hasEliteTier &&
    rank <= 3 &&
    input.baseTalent >= 92 &&
    input.nbaTranslation >= 85 &&
    input.riskPenalty <= 25 &&
    (input.creation >= 88 || (input.physicalTools >= 88 && input.defense >= 84)) &&
    eliteTraits >= 4

  const franchiseEligible =
    cappedScore >= 80 &&
    (rank <= 8 || hasEliteTier) &&
    input.baseTalent >= 84 &&
    input.nbaTranslation >= 78 &&
    input.riskPenalty <= 38 &&
    (input.creation >= 78 || starException) &&
    eliteTraits >= 3

  const allStarEligible =
    cappedScore >= 70 &&
    (rank <= 18 || hasLotteryTier) &&
    input.baseTalent >= 74 &&
    input.riskPenalty < 68 &&
    eliteTraits >= 2

  if (cappedScore >= 90 && !mvpEligible) cap(89, 'MVP exige perfil top 3, criacao/traducao elite e risco baixo')
  if (cappedScore >= 80 && !franchiseEligible) cap(79, 'Franchise exige caminho real para protagonismo')
  if (cappedScore >= 70 && !allStarEligible) cap(69, 'All-Star exige dois pilares elite e risco controlado')

  if (input.creation < 65) limitingFactors.push('creation')
  if (input.nbaTranslation < 65) limitingFactors.push('translation')
  if (input.efficiency < 55) limitingFactors.push('efficiency')
  if (input.riskPenalty >= 68) limitingFactors.push('risk')
  if (eliteTraits === 0) limitingFactors.push('elite traits')

  return {
    score: Math.round(clamp(cappedScore, 35, 100)),
    rawScore: Math.round(clamp(score, 35, 100)),
    cappedScore: Math.round(clamp(cappedScore, 35, 100)),
    appliedCaps,
    eliteTraits,
    limitingFactors,
  }
}

export function calculateProspectProjectionScore(input: ProspectProjectionInput, prospect?: any): ProspectProjectionResult {
  const resolvedProspect = prospect ? mergeProspectWithManualIntelligence(prospect) : undefined
  const manualProjection = resolvedProspect?.resolvedIntelligence?.projection
  const manualScore = typeof manualProjection?.projectionScoreOverride === 'number'
    ? clamp(manualProjection.projectionScoreOverride, 35, 100)
    : undefined

  const factors: ProspectProjectionInput = {
    baseTalent: clamp(input.baseTalent, 0, 100),
    production: clamp(input.production, 0, 100),
    efficiency: clamp(input.efficiency, 0, 100),
    creation: clamp(input.creation, 0, 100),
    physicalTools: clamp(input.physicalTools, 0, 100),
    defense: clamp(input.defense, 0, 100),
    ageCurve: clamp(input.ageCurve, 0, 100),
    nbaTranslation: clamp(input.nbaTranslation, 0, 100),
    riskPenalty: clamp(input.riskPenalty, 0, 100),
  }

  const rawScore =
    factors.baseTalent * 0.26 +
    factors.production * 0.14 +
    factors.efficiency * 0.11 +
    factors.creation * 0.16 +
    factors.physicalTools * 0.09 +
    factors.defense * 0.07 +
    factors.ageCurve * 0.04 +
    factors.nbaTranslation * 0.16 -
    factors.riskPenalty * 0.18

  const realism = applyRealismCaps(rawScore, factors, resolvedProspect || prospect)
  const score = typeof manualScore === 'number' ? Math.round(manualScore) : realism.score
  const manualTier = outcomeTierLabel(manualProjection?.realisticOutcome)

  return {
    score,
    tier: manualTier || getProjectionTier(score),
    description: manualTier ? 'Leitura editorial manual-first baseada em piso, teto plausivel, traits e risco definidos no scouting.' : getProjectionDescription(score),
    rangePosition: getProjectionRangePosition(score),
    color: getProjectionColor(score),
    factors,
    debug: {
      rawScore: realism.rawScore,
      cappedScore: realism.cappedScore,
      appliedCaps: realism.appliedCaps,
      eliteTraits: realism.eliteTraits,
      limitingFactors: realism.limitingFactors,
      manualOverrideUsed: Boolean(resolvedProspect?.resolvedIntelligence?.hasManualOverride),
      manualFieldsUsed: resolvedProspect?.resolvedIntelligence?.manualFieldsUsed || [],
      fallbackFieldsUsed: resolvedProspect?.resolvedIntelligence?.fallbackFieldsUsed || [],
    },
  }
}

export function buildProjectionInputFromProspect(prospect: any, overrides: { floor?: number; ceiling?: number } = {}): ProspectProjectionInput {
  prospect = mergeProspectWithManualIntelligence(prospect || {})
  const manualTraits = prospect?.resolvedIntelligence?.manualTraits || {}
  const manualProjection = prospect?.resolvedIntelligence?.projection
  const stats = prospect?.stats || {}
  const scouting = prospect?.scouting || {}
  const evaluation = scouting?.evaluation || {}
  const tools = evaluation?.tools || {}
  const attrs = scouting?.attributes || {}
  const rank = safeNumber(prospect?.rank, 45)
  const age = safeNumber(prospect?.age, 19.5)
  const manualFloorScore = floorTierScore(manualProjection?.floor)
  const manualCeilingScore = outcomeTierScore(manualProjection?.ceiling)
  const ceiling = safeNumber(overrides.ceiling, safeNumber(manualCeilingScore, safeNumber(evaluation?.ceiling?.score, rank <= 3 ? 84 : rank <= 14 ? 72 : rank <= 30 ? 62 : 52)))
  const floor = safeNumber(overrides.floor, safeNumber(manualFloorScore, safeNumber(evaluation?.floor?.score, rank <= 3 ? 64 : rank <= 14 ? 54 : rank <= 30 ? 46 : 38)))

  const tierBoost = {
    CORNERSTONE: 94,
    ELITE: 88,
    LOTTERY: 70,
    MID_1ST: 58,
    FRINGE: 52,
    SLEEPER: 43,
    ALL_STAR: 70,
    STARTER: 58,
  }[String(prospect?.tier || '').toUpperCase()] || 48

  const baseTalent = average([
    normalize(58 - rank, 0, 57),
    tierBoost,
    normalize(ceiling, 45, 98) * 0.92,
    (safeNumber(scouting?.scoutGrade, 0) || safeNumber(prospect?.scoutGrade, 0)) * 0.92,
  ].filter(Boolean), tierBoost)

  const position = String(prospect?.position || '').toUpperCase()
  const isGuard = /PG|SG/.test(position)
  const isBig = /PF|C/.test(position)
  const usage = safeNumber(stats.usg, 18)
  const ppg = safeNumber(stats.ppg)
  const ts = safeNumber(stats.ts, 55)
  const three = safeNumber(stats.threep, 32)
  const ft = safeNumber(stats.ftp, 68)
  const astTo = safeNumber(stats.astTo, 1.2)
  const volumeEfficiencyDrag = usage >= 26 && ts < 54 ? 8 : usage >= 24 && ts < 56 ? 4 : 0
  const lowVolumeGuardDrag = isGuard && usage < 18 && ppg < 12 ? 6 : 0

  const production = average([
    normalize(ppg, 7, 26),
    normalize(safeNumber(stats.rpg), isBig ? 4 : 2, isBig ? 13 : 9),
    normalize(safeNumber(stats.apg), 0.8, 7.5),
    normalize(safeNumber(stats.per), 12, 34),
    normalize(usage, 14, 34) * 0.78,
  ], 50) - lowVolumeGuardDrag

  const efficiency = average([
    normalize(ts, 50, 70),
    normalize(safeNumber(stats.efg), 47, 67),
    normalize(safeNumber(stats.fgp), 40, 64),
    normalize(three, 28, 44),
    normalize(ft, 60, 90),
    toolGradeToScore(tools.efficiency) ?? NaN,
  ], 52) - volumeEfficiencyDrag - (three < 30 && ft < 68 ? 6 : 0)

  const creation = average([
    normalize(safeNumber(stats.apg), 0.8, 7.5),
    normalize(astTo, 0.8, 3.8),
    normalize(usage, 14, 34) * 0.82,
    toolGradeToScore(tools.creation) ?? NaN,
    toolGradeToScore(attrs.Playmaking) ?? NaN,
  ], 48) - (astTo < 1.0 && isGuard ? 10 : 0)

  const height = parseFeetInches(prospect?.height)
  const wingspan = parseFeetInches(prospect?.wingspan)
  const sizeScore = average([
    height ? normalize(height, 73, 86) : NaN,
    wingspan ? normalize(wingspan, 76, 91) : NaN,
  ], 50)

  const physicalTools = average([
    sizeScore,
    toolGradeToScore(tools.athleticism) ?? NaN,
    toolGradeToScore(attrs.Athleticism) ?? NaN,
    normalize(ceiling - floor, 8, 40) * 0.82,
  ], 52)

  const defense = average([
    normalize(safeNumber(stats.stlPct), 0.8, 4),
    normalize(safeNumber(stats.blkPct), isBig ? 1.5 : 0.5, isBig ? 9 : 5),
    normalize(safeNumber(stats.rpg), isBig ? 4 : 2, isBig ? 13 : 9) * 0.72,
    toolGradeToScore(tools.defense) ?? NaN,
    toolGradeToScore(attrs.Defense) ?? NaN,
  ], 50)

  const ageCurve = clamp(80 - Math.max(0, age - 18) * 10 + (rank <= 8 ? 4 : 0), 35, 92)

  const positiveSignals = Math.min(8, (scouting?.strengths || []).length * 2)
  const weaknessDrag = (scouting?.weaknesses || []).length * 5
  const nbaTranslation = clamp(average([
    normalize(ceiling, 52, 96) * 0.88,
    normalize(floor, 38, 78),
    baseTalent,
    efficiency,
    creation,
  ], 52) + positiveSignals - weaknessDrag - (three < 30 && !isBig ? 7 : 0) - (astTo < 1.0 && isGuard ? 6 : 0), 35, 100)

  const manualRisk = String(evaluation?.risk?.level || scouting?.risk || '').toLowerCase()
  const riskPenalty = clamp(
    (manualRisk.includes('high') ? 78 : manualRisk.includes('moderate') || manualRisk.includes('medium') ? 54 : manualRisk.includes('low') ? 24 : 42) +
    Math.max(0, ceiling - floor - 18) * 1.45 +
    (ts < 53 ? 12 : 0) +
    (usage >= 25 && ts < 55 ? 8 : 0) +
    (three < 30 ? 7 : 0) +
    (ft < 65 ? 6 : 0) +
    (age >= 22 && rank > 20 ? 8 : 0),
    0,
    100
  )

  const manualPhysicalTools = average([manualTraits.size, manualTraits.athleticism].filter(Number.isFinite) as number[], NaN)

  return {
    baseTalent: clamp(manualTraits.upside ?? baseTalent, 0, 100),
    production: clamp(production, 0, 100),
    efficiency: clamp(manualTraits.nbaReadiness ?? efficiency, 0, 100),
    creation: clamp(manualTraits.creation ?? creation, 0, 100),
    physicalTools: clamp(Number.isFinite(manualPhysicalTools) ? manualPhysicalTools : physicalTools, 0, 100),
    defense: clamp(manualTraits.defense ?? defense, 0, 100),
    ageCurve,
    nbaTranslation: clamp(manualTraits.nbaReadiness ?? nbaTranslation, 0, 100),
    riskPenalty: clamp(manualTraits.risk ?? riskPenalty, 0, 100),
  }
}
