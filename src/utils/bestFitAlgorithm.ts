import { getAllTeamProfiles } from '../data/teamProfiles.js'
import { mergeProspectWithManualIntelligence } from '../data/prospectDraftIntelligence.ts'
import { resolveTeamDraftIntelligence } from '../data/teamDraftManualIntelligence.ts'
import { getTeamPicks } from './draftPickAdapter.js'
import { getPlayerDraftAttributes, getPlayerExpectedRange } from './draftFitAlgorithm.js'

export type FitTier = 'Perfect Fit' | 'Elite Fit' | 'Strong Fit' | 'Good Fit' | 'Situational Fit' | 'Risky Fit' | 'Poor Fit'

export interface BestFitInput {
  teamNeedFit: number
  roleFit: number
  developmentFit: number
  timelineFit: number
  schemeFit: number
  draftRangeFit: number
  riskFit: number
}

export interface BestFitBreakdown extends BestFitInput {}

export interface BestFitResult {
  teamId: string
  teamName: string
  score: number
  tier: FitTier
  description: string
  primaryReason: string
  flags: string[]
  warnings: string[]
  breakdown: BestFitBreakdown
  pickContext: string
  isRealistic: boolean
}

export interface BestFitOptions {
  limit?: number
  includeUnlikelyFits?: boolean
  currentOrder?: any[]
}

const WEIGHTS = {
  teamNeedFit: 0.24,
  roleFit: 0.20,
  developmentFit: 0.16,
  timelineFit: 0.12,
  schemeFit: 0.10,
  draftRangeFit: 0.10,
  riskFit: 0.08,
}

export function clamp(value: number, min = 0, max = 100): number {
  if (!Number.isFinite(value)) return min
  return Math.min(max, Math.max(min, value))
}

const round = (value: number) => Math.round(clamp(value))
const safe = (value: unknown, fallback = 0) => typeof value === 'number' && Number.isFinite(value) ? value : fallback
const avg = (values: number[], fallback = 50) => {
  const valid = values.filter(Number.isFinite)
  return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : fallback
}

const playerRole = (player: any) => {
  const pos = String(player?.position || '').toUpperCase()
  if (pos.includes('C')) return 'big'
  if (pos.includes('PF') || pos.includes('SF')) return 'wing'
  return 'guard'
}

const riskLevel = (player: any) => {
  const manual = String(player?.scouting?.evaluation?.risk?.level || player?.risk || '').toLowerCase()
  if (manual.includes('high')) return 'high'
  if (manual.includes('moderate') || manual.includes('medium')) return 'medium'
  if (manual.includes('low')) return 'low'
  const floor = safe(player?.scouting?.evaluation?.floor?.score, 52)
  const ceiling = safe(player?.scouting?.evaluation?.ceiling?.score, floor + 18)
  if (floor < 50 || ceiling - floor >= 28) return 'high'
  if (floor < 60 || ceiling - floor >= 18) return 'medium'
  return 'low'
}

const rankOf = (player: any) => clamp(Number(player?.rank || 45), 1, 75)
const isWinNow = (profile: any) =>
  ['contender', 'aging_contender', 'playoff_core'].includes(profile?.timeline) ||
  String(profile?.draftMode || '').includes('contender') ||
  String(profile?.draftMode || '').includes('win_now')
const isRebuild = (profile: any) =>
  ['deep_rebuild', 'early_rebuild', 'development_core', 'rising_core', 'rebuild', 'young_core', 'retool'].includes(profile?.timeline) ||
  String(profile?.draftMode || '').includes('rebuild') ||
  String(profile?.draftMode || '').includes('development')
function applyManualTeamProfile(teamProfile: any) {
  const resolved = resolveTeamDraftIntelligence(teamProfile?.id || teamProfile?.teamId || teamProfile?.abbreviation)
  if (!resolved?.hasManualOverride) return teamProfile
  const needs = resolved.needs || {}
  const manualPriority = resolved.strategicPriorities?.[0]
  const priorityMap: Record<string, string> = {
    SHOOTING: 'shooting',
    CREATION: 'creation',
    SECONDARY_CREATION: 'creation',
    DEFENSE: 'defense',
    SIZE: 'size',
    REBOUNDING: 'rebounding',
    UPSIDE: 'upside',
    SAFE_FLOOR: 'floor',
    IMMEDIATE_ROTATION: 'floor',
  }
  return {
    ...teamProfile,
    timeline: resolved.timeline || teamProfile?.timeline,
    riskTolerance: resolved.riskTolerance || teamProfile?.riskTolerance,
    priority: priorityMap[String(manualPriority || '')] || teamProfile?.priority,
    needs: {
      ...(teamProfile?.needs || {}),
      shooting: safe(needs.shooting, 50) / 100,
      creation: Math.max(safe(needs.primaryCreation, 50), safe(needs.secondaryCreation, 50)) / 100,
      defense: Math.max(safe(needs.pointOfAttackDefense, 50), safe(needs.wingDefense, 50), safe(needs.rimProtection, 50)) / 100,
      rebounding: safe(needs.rebounding, 50) / 100,
      athleticism: safe(needs.athleticism, 50) / 100,
      size: safe(needs.size, 50) / 100,
    },
    editorial: {
      ...(teamProfile?.editorial || {}),
      strategy: resolved.notes?.idealPickLogic || teamProfile?.editorial?.strategy,
    },
  }
}
export function calculateBestFitScore(input: BestFitInput) {
  const score =
    input.teamNeedFit * WEIGHTS.teamNeedFit +
    input.roleFit * WEIGHTS.roleFit +
    input.developmentFit * WEIGHTS.developmentFit +
    input.timelineFit * WEIGHTS.timelineFit +
    input.schemeFit * WEIGHTS.schemeFit +
    input.draftRangeFit * WEIGHTS.draftRangeFit +
    input.riskFit * WEIGHTS.riskFit
  return round(score)
}

export function getBestFitTier(score: number): FitTier {
  if (score >= 90) return 'Perfect Fit'
  if (score >= 80) return 'Elite Fit'
  if (score >= 70) return 'Strong Fit'
  if (score >= 60) return 'Good Fit'
  if (score >= 50) return 'Situational Fit'
  if (score >= 40) return 'Risky Fit'
  return 'Poor Fit'
}

export function getBestFitColor(score: number) {
  if (score >= 90) return '#7c5ccf'
  if (score >= 80) return '#8f78e6'
  if (score >= 70) return '#5aaed6'
  if (score >= 60) return '#6fbf9c'
  if (score >= 50) return '#c9a941'
  if (score >= 40) return '#e6a06f'
  return '#e8a6a6'
}

export function getBestFitDescription(score: number) {
  if (score >= 90) return 'Contexto quase ideal entre necessidade, papel, desenvolvimento e faixa de escolha.'
  if (score >= 80) return 'Excelente encaixe de contexto, com caminho claro para maximizar o jogador.'
  if (score >= 70) return 'Fit forte: resolve necessidade real e conversa com a timeline da franquia.'
  if (score >= 60) return 'Bom contexto, embora dependa de papel e desenvolvimento bem definidos.'
  if (score >= 50) return 'Fit situacional: faz sentido em cenarios especificos de board e disponibilidade.'
  if (score >= 40) return 'Fit arriscado, com atritos relevantes de range, papel ou tolerancia a risco.'
  return 'Contexto pouco recomendado para este prospecto.'
}

export function calculateTeamNeedFit(player: any, teamProfile: any) {
  const attrs = getPlayerDraftAttributes(player)
  const needs = teamProfile?.needs || {}
  const weights = teamProfile?.playerAttributeWeights || {}
  const keys = ['shooting', 'creation', 'defense', 'rebounding', 'athleticism', 'size', 'floor', 'ceiling']
  let totalWeight = 0
  let weighted = 0
  keys.forEach(key => {
    const need = safe(needs[key], 0.45)
    const weight = safe(weights[key], 0.1)
    const value = safe((attrs as any)[key], 50)
    weighted += value * need * weight
    totalWeight += need * weight
  })
  return round(totalWeight ? weighted / totalWeight : 55)
}

export function calculateRoleFit(player: any, teamProfile: any) {
  const attrs = getPlayerDraftAttributes(player)
  const role = playerRole(player)
  const priority = String(teamProfile?.priority || '')
  let score = 58
  if (priority === 'creation') score += attrs.creation * 0.22
  else if (priority === 'spacing' || priority === 'shooting') score += attrs.shooting * 0.22
  else if (priority === 'defense') score += attrs.defense * 0.22
  else if (priority === 'size') score += attrs.size * 0.20
  else if (priority === 'rebounding') score += attrs.rebounding * 0.20
  else if (priority === 'upside') score += attrs.ceiling * 0.20
  else if (priority === 'floor') score += attrs.floor * 0.20
  else score += avg([attrs.shooting, attrs.creation, attrs.defense], 55) * 0.15

  if (isWinNow(teamProfile)) score += attrs.floor * 0.12 - Math.max(0, attrs.ceiling - attrs.floor - 18) * 0.25
  if (isRebuild(teamProfile)) score += attrs.ceiling * 0.12
  if (role === 'big' && safe(teamProfile?.needs?.size, 0) > 0.65) score += 8
  if (role === 'guard' && safe(teamProfile?.needs?.size, 0) > 0.75) score -= 8
  return round(score)
}

export function calculateDevelopmentFit(player: any, teamProfile: any) {
  const attrs = getPlayerDraftAttributes(player)
  const risk = riskLevel(player)
  let score = 58
  if (isRebuild(teamProfile)) score += 16
  if (teamProfile?.timeline === 'young_core') score += 10
  if (isWinNow(teamProfile)) score -= risk === 'high' ? 18 : risk === 'medium' ? 8 : 0
  score += attrs.ceiling * 0.12 + attrs.floor * 0.08
  if (safe(player?.age, 19.5) <= 19) score += 6
  if (safe(player?.age, 19.5) >= 22 && isRebuild(teamProfile)) score -= 5
  return round(score)
}

export function calculateTimelineFit(player: any, teamProfile: any) {
  const attrs = getPlayerDraftAttributes(player)
  const risk = riskLevel(player)
  let score = 55
  if (isRebuild(teamProfile)) score += attrs.ceiling * 0.26 + (risk === 'high' ? 6 : 0)
  else if (isWinNow(teamProfile)) score += attrs.floor * 0.28 - (risk === 'high' ? 16 : 0)
  else score += avg([attrs.floor, attrs.ceiling], 55) * 0.20
  return round(score)
}

export function calculateSchemeFit(player: any, teamProfile: any) {
  const attrs = getPlayerDraftAttributes(player)
  const priority = String(teamProfile?.priority || '')
  const notes = [teamProfile?.editorial?.strategy, teamProfile?.editorial?.frontOfficeTendency, ...(teamProfile?.editorial?.notes || [])].join(' ').toLowerCase()
  let score = avg([attrs.shooting, attrs.creation, attrs.defense, attrs.size], 55) * 0.45 + 35
  if ((priority === 'spacing' || notes.includes('arremesso') || notes.includes('spacing')) && attrs.shooting >= 64) score += 10
  if ((priority === 'creation' || notes.includes('cria')) && attrs.creation >= 64) score += 10
  if ((priority === 'defense' || notes.includes('defesa')) && attrs.defense >= 64) score += 10
  if ((notes.includes('versatil') || notes.includes('switch')) && attrs.size >= 60 && attrs.defense >= 58) score += 8
  if (attrs.shooting < 38 && (priority === 'spacing' || notes.includes('spacing'))) score -= 12
  return round(score)
}

export function calculateDraftRangeFit(player: any, teamPicks: any[] = []) {
  const rank = rankOf(player)
  if (!teamPicks.length) return 20
  const bestDiff = Math.min(...teamPicks.map(pick => Math.abs(safe(pick.pick, 99) - rank)))
  if (bestDiff <= 2) return 100
  if (bestDiff <= 5) return 88
  if (bestDiff <= 8) return 75
  if (bestDiff <= 12) return 62
  if (bestDiff <= 18) return 48
  return 30
}

export function calculateRiskFit(player: any, teamProfile: any) {
  const risk = riskLevel(player)
  const tolerance = String(teamProfile?.riskTolerance || 'medium').toLowerCase()
  if (risk === 'low') return tolerance === 'low' ? 92 : 86
  if (risk === 'medium') return tolerance === 'high' ? 86 : tolerance === 'medium' ? 78 : 58
  return tolerance === 'high' ? 76 : tolerance === 'medium' ? 52 : 30
}

function pickContextFor(player: any, teamPicks: any[]) {
  const range = getPlayerExpectedRange(player)
  if (!teamPicks.length) return { text: 'Sem escolha de primeira rodada compatível.', realistic: false, bestPick: undefined }
  const sorted = [...teamPicks].sort((a, b) => Math.abs(a.pick - range.expectedPick) - Math.abs(b.pick - range.expectedPick))
  const bestPick = sorted[0]
  const pick = bestPick.pick
  const realistic = pick >= range.minPick - 5 && pick <= range.maxPick + 8
  if (pick >= range.minPick && pick <= range.maxPick) return { text: 'Pick #' + pick + ' dentro do range esperado (#' + range.minPick + '-#' + range.maxPick + ').', realistic, bestPick }
  if (pick < range.minPick) return { text: 'Pick #' + pick + ' seria cedo para o range esperado (#' + range.minPick + '-#' + range.maxPick + ').', realistic, bestPick }
  return { text: 'Pick #' + pick + ' fica tarde para o range esperado (#' + range.minPick + '-#' + range.maxPick + ').', realistic, bestPick }
}

function generateFitNarrative(player: any, teamProfile: any, breakdown: BestFitBreakdown, pickContext: string, realistic: boolean) {
  const attrs = getPlayerDraftAttributes(player)
  const flags: string[] = []
  const warnings: string[] = []
  if (breakdown.draftRangeFit >= 75) flags.push('Pick range match')
  else warnings.push(realistic ? 'Range exige decisao de board' : 'Faixa de pick pouco realista')
  if (attrs.shooting >= 65 && safe(teamProfile?.needs?.shooting, 0) >= 0.65) flags.push('Shooting need')
  if (attrs.creation >= 65 && safe(teamProfile?.needs?.creation, 0) >= 0.6) flags.push('Creation need')
  if (attrs.defense >= 65 && safe(teamProfile?.needs?.defense, 0) >= 0.6) flags.push('Defensive fit')
  if (isRebuild(teamProfile) && attrs.ceiling >= 65) flags.push('Development runway')
  if (isWinNow(teamProfile) && attrs.floor >= 62) flags.push('Early role clarity')
  if (riskLevel(player) === 'high' && String(teamProfile?.riskTolerance || '').toLowerCase() === 'low') warnings.push('Risco acima da tolerância do time')
  if (breakdown.schemeFit < 50) warnings.push('Encaixe tático exige ajuste')

  const needText = breakdown.teamNeedFit >= 72 ? 'necessidade do elenco' : breakdown.roleFit >= 72 ? 'papel disponível' : 'contexto de desenvolvimento'
  const primaryReason = realistic
    ? 'Melhor combinação entre ' + needText + ', timeline e faixa de escolha.'
    : 'Contexto interessante, mas a faixa de pick reduz o realismo.'
  const description = teamProfile?.editorial?.strategy || getBestFitDescription(calculateBestFitScore(breakdown))

  return { primaryReason, description, flags: flags.slice(0, 4), warnings: warnings.slice(0, 3), pickContext }
}

export function calculateBestFitForTeam(player: any, teamProfile: any, teamPicks: any[] = []): BestFitResult {
  player = mergeProspectWithManualIntelligence(player || {})
  teamProfile = applyManualTeamProfile(teamProfile)
  const breakdown: BestFitBreakdown = {
    teamNeedFit: calculateTeamNeedFit(player, teamProfile),
    roleFit: calculateRoleFit(player, teamProfile),
    developmentFit: calculateDevelopmentFit(player, teamProfile),
    timelineFit: calculateTimelineFit(player, teamProfile),
    schemeFit: calculateSchemeFit(player, teamProfile),
    draftRangeFit: calculateDraftRangeFit(player, teamPicks),
    riskFit: calculateRiskFit(player, teamProfile),
  }
  const pick = pickContextFor(player, teamPicks)
  let score = calculateBestFitScore(breakdown)
  if (!pick.realistic) score = Math.min(score, 58)
  if (!teamPicks.length) score = Math.min(score, 40)
  const narrative = generateFitNarrative(player, teamProfile, breakdown, pick.text, pick.realistic)
  return {
    teamId: teamProfile.id,
    teamName: teamProfile.name,
    score,
    tier: getBestFitTier(score),
    description: narrative.description,
    primaryReason: narrative.primaryReason,
    flags: narrative.flags,
    warnings: narrative.warnings,
    breakdown,
    pickContext: pick.text,
    isRealistic: pick.realistic,
  }
}

export function getBestFitsForPlayer(player: any, options: BestFitOptions = {}): BestFitResult[] {
  player = mergeProspectWithManualIntelligence(player || {})
  const limit = options.limit ?? 5
  return getAllTeamProfiles()
    .map(profile => calculateBestFitForTeam(player, profile, getTeamPicks(profile.id, options.currentOrder)))
    .filter(result => options.includeUnlikelyFits || result.isRealistic)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}
