import { LOTTERY_TEAMS, PICKS_15_30 } from '../data/prospects'
import { calculateDraftFit, getPlayerDraftAttributes } from './draftFitAlgorithm.js'
import { getTeamProfile } from '../data/teamProfiles.js'
import { mergeProspectWithManualIntelligence } from '../data/prospectDraftIntelligence.ts'
import { formatStat, normalizeProspectStats } from './prospectStats.js'

export const TRADE_MAP = {
  NOP: () => ({ ownerAbbr: 'ATL', ownerName: 'Atlanta Hawks', ownerColor: '#C8102E', viaAbbr: 'NOP', viaName: 'New Orleans Pelicans' }),
  LAC: () => ({ ownerAbbr: 'OKC', ownerName: 'Oklahoma City Thunder', ownerColor: '#007AC1', viaAbbr: 'LAC', viaName: 'LA Clippers' }),
  IND: finalPosition => {
    if (finalPosition <= 4 || finalPosition >= 11) return { ownerAbbr: 'IND', ownerName: 'Indiana Pacers', ownerColor: '#002D62', viaAbbr: null, viaName: null }
    return { ownerAbbr: 'LAC', ownerName: 'LA Clippers', ownerColor: '#C8102E', viaAbbr: 'IND', viaName: 'Indiana Pacers' }
  },
}

export const COMBOS = [140, 140, 140, 125, 105, 90, 75, 60, 45, 30, 20, 15, 10, 5]
export const OFFICIAL_LOTTERY_ORDER = ['WAS', 'UTA', 'MEM', 'CHI', 'IND', 'BKN', 'SAC', 'NOP', 'DAL', 'MIL', 'GSW', 'LAC', 'MIA', 'CHA']
export const PHASE = { IDLE: 'idle', ANIMATING: 'animating', DONE: 'done', DRAFTING: 'drafting' }
export const SCENE = { LOTTERY_INTRO: 'lotteryIntro', LOTTERY_REVEAL: 'lotteryReveal', DRAFT_ORDER: 'draftOrder', WAR_ROOM: 'warRoom', PICK_CONFIRM: 'pickConfirm', NEXT_PICK: 'nextPickTransition', DRAFT_RESULTS: 'draftResults' }
export const TOTAL_PICKS = 30
export const TRADE_MAP_LABELS = { IND: 'PROT. 1-4 / 11-14', NOP: 'via ATL', LAC: 'via OKC' }

export const TIER_STYLES = {
  CORNERSTONE: { label: 'CORNERSTONE', color: '#7c3aed', bg: '#eee9fb', text: '#5b21b6', glow: 'rgba(124,58,237,.26)', wash: 'rgba(124,58,237,.13)', accent: 'rgba(196,181,253,.28)' },
  ELITE: { label: 'ELITE', color: '#d4af37', bg: '#fff4c2', text: '#8a6a00', glow: 'rgba(212,175,55,.25)', wash: 'rgba(212,175,55,.14)', accent: 'rgba(255,231,128,.34)' },
  LOTTERY: { label: 'LOTERIA', color: '#10b981', bg: '#dff8ed', text: '#047857', glow: 'rgba(16,185,129,.22)', wash: 'rgba(16,185,129,.13)', accent: 'rgba(167,243,208,.34)' },
  MID_1ST: { label: 'MID 1ST', color: '#3b82f6', bg: '#e0efff', text: '#1d4ed8', glow: 'rgba(59,130,246,.22)', wash: 'rgba(59,130,246,.13)', accent: 'rgba(191,219,254,.38)' },
  FRINGE: { label: 'FRINGE', color: '#f97316', bg: '#ffedd5', text: '#c2410c', glow: 'rgba(249,115,22,.23)', wash: 'rgba(249,115,22,.14)', accent: 'rgba(254,215,170,.36)' },
  SLEEPER: { label: 'SLEEPER', color: '#8b5e34', bg: '#f4eadc', text: '#5f3f20', glow: 'rgba(139,94,52,.22)', wash: 'rgba(139,94,52,.14)', accent: 'rgba(222,184,135,.34)' },
}

export const normalizeTierKey = tier => ({ ALL_STAR: 'LOTTERY', STARTER: 'MID_1ST', FRINGE_FIRST: 'FRINGE', ROLE_PLAYER: 'SLEEPER' }[tier] || tier)

export const FILTERS = [
  ['best', 'Best Available'],
  ['guards', 'Guards'],
  ['wings', 'Wings'],
  ['bigs', 'Bigs'],
  ['shooters', 'Shooters'],
  ['defenders', 'Defenders'],
  ['upside', 'Upside'],
  ['safe', 'Safe Picks'],
]

export const motionPresets = {
  page: {
    initial: { opacity: 0, y: 24, filter: 'blur(10px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, y: -16, filter: 'blur(8px)' },
    transition: { duration: .48, ease: [0.22, 1, 0.36, 1] }
  },
  cardStagger: {
    hidden: {},
    show: { transition: { staggerChildren: .075, delayChildren: .08 } }
  },
  cardItem: {
    hidden: { opacity: 0, y: 20, scale: .98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: .36, ease: [0.22, 1, 0.36, 1] } }
  },
  heroReveal: {
    initial: { opacity: 0, scale: .94, filter: 'blur(10px)' },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, scale: .98, filter: 'blur(6px)' },
    transition: { duration: .55, ease: [0.22, 1, 0.36, 1] }
  },
  overlayConfirm: {
    initial: { opacity: 0, scale: .96, filter: 'blur(12px)' },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, scale: 1.02, filter: 'blur(8px)' },
    transition: { duration: .42, ease: [0.22, 1, 0.36, 1] }
  }
}

export function applyTradeRules(team, finalPosition) {
  const rule = TRADE_MAP[team.abbr]
  if (rule) return rule(finalPosition)
  return { ownerAbbr: team.abbr, ownerName: team.name, ownerColor: team.color, viaAbbr: null, viaName: null }
}

export function buildPool() {
  const pool = []
  LOTTERY_TEAMS.forEach((team, i) => {
    for (let c = 0; c < COMBOS[i]; c++) pool.push(team.id)
  })
  return pool
}

export function pickOne(pool, exclude) {
  const eligible = pool.filter(id => !exclude.includes(id))
  return eligible[Math.floor(Math.random() * eligible.length)]
}

export function runLottery() {
  return OFFICIAL_LOTTERY_ORDER
    .map(abbr => LOTTERY_TEAMS.find(team => team.abbr === abbr)?.id)
    .filter(Boolean)
}

export const teamById = id => LOTTERY_TEAMS.find(t => t.id === id)

export function getSceneFromState(phase, draftFinished) {
  if (draftFinished) return SCENE.DRAFT_RESULTS
  if (phase === PHASE.IDLE) return SCENE.LOTTERY_INTRO
  if (phase === PHASE.ANIMATING) return SCENE.LOTTERY_REVEAL
  if (phase === PHASE.DONE) return SCENE.DRAFT_ORDER
  if (phase === PHASE.DRAFTING) return SCENE.WAR_ROOM
  return SCENE.LOTTERY_INTRO
}
export function buildProjectedLotteryPicks() {
  return runLottery().map((teamId, i) => {
    const team = teamById(teamId)
    const trade = applyTradeRules(team, i + 1)
    return { pick: i + 1, isLottery: true, isTop4: i < 4, originalTeam: team, ...trade }
  })
}

export function getTeamTimelineLabel(teamId) {
  const timeline = getTeamProfile(teamId)?.timeline
  const labels = {
    rebuild: 'Reconstrução',
    young_core: 'Núcleo jovem',
    playoff_core: 'Core de playoff',
    contender: 'Contender',
    retool: 'Retool'
  }
  return labels[timeline] || 'Timeline em avaliação'
}

export function getTeamPriorityLabel(teamId) {
  const priority = getTeamProfile(teamId)?.priority
  const labels = {
    spacing: 'Prioridade: spacing',
    creation: 'Prioridade: criação',
    defense: 'Prioridade: defesa',
    size: 'Prioridade: tamanho',
    upside: 'Prioridade: upside',
    floor: 'Prioridade: piso',
    rebounding: 'Prioridade: rebote',
    athleticism: 'Prioridade: atletismo'
  }
  return labels[priority] || 'Prioridade: melhor valor'
}
export const clamp = value => Math.min(100, Math.max(0, value))
export const num = value => formatStat(value)
export const getTierStyles = tier => TIER_STYLES[normalizeTierKey(tier)] || TIER_STYLES.SLEEPER
export const initials = name => String(name || '').split(' ').filter(Boolean).slice(0, 2).map(x => x[0]).join('').toUpperCase()

export function getLotteryMovement(pick) {
  if (!pick?.originalTeam) return { delta: 0, label: 'Manteve posicao', tone: '#a09891' }
  const delta = pick.originalTeam.slotOrder - pick.pick
  if (delta > 0) return { delta, label: 'Subiu +' + delta, tone: '#7c5ccf' }
  if (delta < 0) return { delta, label: 'Caiu ' + delta, tone: '#d96f7d' }
  return { delta: 0, label: 'Manteve posicao', tone: '#4f86ad' }
}

export function getBiggestWinner(results) {
  return results.filter(p => p.isLottery).map(p => ({ ...p, movement: getLotteryMovement(p) })).sort((a, b) => b.movement.delta - a.movement.delta)[0]
}

export function getBiggestDrop(results) {
  return results.filter(p => p.isLottery).map(p => ({ ...p, movement: getLotteryMovement(p) })).sort((a, b) => a.movement.delta - b.movement.delta)[0]
}

export function getProspectArchetype(p) {
  const s = normalizeProspectStats(p)
  if ((s.threep || 0) >= 37) return 'Movement Shooter'
  if ((s.apg || 0) >= 4 || (s.astTo || 0) >= 2) return 'Creator / Connector'
  if ((s.rpg || 0) >= 8 || (s.blkPct || 0) >= 4) return 'Interior Anchor'
  if ((s.ppg || 0) >= 18) return 'Primary Scorer'
  return 'Two-Way Prospect'
}

export function getProspectAttributes(p) {
  const s = normalizeProspectStats(p)
  const attrs = p.scouting?.attributes || {}
  return [
    ['Scoring', clamp(((s.ppg || 0) / 28) * 100)],
    ['Shooting', clamp(((s.threep || attrs.Shooting || 0) / 45) * 100)],
    ['Playmaking', clamp(((s.apg || attrs.Playmaking || 0) / 8) * 100)],
    ['Defense', clamp(Math.max((s.stlPct || 0) * 18, (s.blkPct || 0) * 11, (attrs.Defense || 0) * 10))],
    ['Rebounding', clamp(((s.rpg || attrs.Rebounding || 0) / 12) * 100)],
    ['Athleticism', clamp((attrs.Athleticism || 6) * 10)],
  ]
}

export function getWarRoomAttributes(p) {
  const resolved = getResolvedArchetypeBars(p)
  return [
    ['Scoring', resolved.scoring],
    ['Shooting', resolved.shooting],
    ['Creation', resolved.creation],
    ['Defense', resolved.defense],
    ['Athleticism', resolved.athleticism],
  ].sort((a, b) => b[1] - a[1])
}

function traitValue(manualTraits, key) {
  const value = manualTraits?.[key]
  return typeof value === 'number' && Number.isFinite(value) ? clamp(value) : null
}

function resolvedBarValue(manualTraits, key, derivedValue, fallbackValue = 55) {
  const manualValue = traitValue(manualTraits, key)
  if (manualValue !== null) return { value: manualValue, source: 'manual' }
  if (typeof derivedValue === 'number' && Number.isFinite(derivedValue)) return { value: clamp(derivedValue), source: 'derived' }
  return { value: clamp(fallbackValue), source: 'fallback' }
}

export function getResolvedArchetypeBars(p) {
  const resolved = mergeProspectWithManualIntelligence(p || {})
  const manualTraits = resolved?.resolvedIntelligence?.manualTraits || {}
  const s = normalizeProspectStats(p)
  const attrs = p?.scouting?.attributes || {}
  const scoringDerived = Math.max(
    ((s.ppg || 0) / 28) * 100,
    ((s.usg || 0) / 32) * 100,
    (attrs.Scoring || 0) * 10,
  )
  const shootingDerived = Math.max(((s.threep || 0) / 45) * 100, ((s.ts || 0) / 70) * 100, (attrs.Shooting || 0) * 10)
  const creationDerived = Math.max(((s.apg || 0) / 8) * 100, ((s.astTo || 0) / 3.2) * 100, (attrs.Playmaking || 0) * 10)
  const defenseDerived = Math.max((s.stlPct || 0) * 18, (s.blkPct || 0) * 11, (attrs.Defense || 0) * 10)
  const athleticismDerived = (attrs.Athleticism || 6) * 10
  const defense = resolvedBarValue(manualTraits, 'defense', defenseDerived)
  const shooting = resolvedBarValue(manualTraits, 'shooting', shootingDerived)
  const athleticism = resolvedBarValue(manualTraits, 'athleticism', athleticismDerived)
  const scoring = resolvedBarValue(manualTraits, 'scoring', scoringDerived)
  const creation = resolvedBarValue(manualTraits, 'creation', creationDerived)
  return {
    defense: defense.value,
    shooting: shooting.value,
    athleticism: athleticism.value,
    scoring: scoring.value,
    creation: creation.value,
    source: {
      defense: defense.source,
      shooting: shooting.source,
      athleticism: athleticism.source,
      scoring: scoring.source,
      creation: creation.source,
    },
  }
}

export function getTopMetrics(p) {
  const s = normalizeProspectStats(p)
  return [
    ['PPG', num(s.ppg)],
    ['TS%', formatStat(s.ts)],
    ['3P%', formatStat(s.threep)],
    ['AST', num(s.apg)],
  ]
}

export function getPlayerDecisionMeta(p) {
  const attrs = getWarRoomAttributes(p)
  const best = attrs[0]?.[0] || 'Scoring'
  const weak = attrs[attrs.length - 1]?.[0] || 'Defense'
  const primary = getProspectArchetype(p)
  const secondary = attrs.find(([label]) => label !== best)?.[0] || 'Connector'
  return { primary, secondary, best, weak }
}

export function getDraftContextBullets(draftFit, prospect) {
  let attr = { floor: 0, ceiling: 0 }
  try { attr = getPlayerDraftAttributes(prospect) || attr } catch { attr = { floor: 0, ceiling: 0 } }
  const bullets = []
  if (draftFit?.pickContext) bullets.push(draftFit.pickContext)
  if (draftFit?.realism === 'High') bullets.push('Alta probabilidade de disponibilidade no range da pick.')
  else if (draftFit?.realism === 'Medium') bullets.push('Disponibilidade realista, mas exige atenção ao board.')
  else if (draftFit?.realism === 'Low') bullets.push('Disponibilidade baixa ou encaixe dependente do mercado.')
  else if (draftFit?.realism === 'Blocked') bullets.push('Fit bloqueado pelo draft capital atual.')
  if ((attr.ceiling || 0) >= 82) bullets.push('Perfil de alto teto para esta faixa do draft.')
  if ((attr.floor || 0) >= 70) bullets.push('Piso funcional para contribuir cedo.')
  if (!bullets.length) bullets.push('Compare produção, fit e contexto antes de confirmar a escolha.')
  return bullets.slice(0, 3)
}

export function getProspectListBadge(prospect, fit, isBest) {
  let attrs = { floor: 0, ceiling: 0 }
  try { attrs = getPlayerDraftAttributes(prospect) || attrs } catch { attrs = { floor: 0, ceiling: 0 } }
  if (fit?.score >= 82 && fit?.realism !== 'Blocked') return { label: 'Best Fit', color: '#7c5ccf', bg: '#eee9fb' }
  if ((attrs.ceiling || 0) - (attrs.floor || 0) >= 18 || (attrs.ceiling || 0) >= 84) return { label: 'Upside', color: '#9b6a2f', bg: '#fbf4d2' }
  if ((attrs.floor || 0) >= 72 || isBest) return { label: 'Safe', color: '#4f9577', bg: '#e5f4ec' }
  return null
}

export function getComparisonRows(playerA, playerB) {
  if (!playerA || !playerB) return []
  try {
    const attrsA = Object.fromEntries(getWarRoomAttributes(playerA))
    const attrsB = Object.fromEntries(getWarRoomAttributes(playerB))
    return ['Scoring', 'Shooting', 'Creation', 'Defense', 'Athleticism'].map(label => [label, attrsA[label] || 0, attrsB[label] || 0])
  } catch {
    return []
  }
}

export function getTeamDecisionContext(owner) {
  const profile = getTeamProfile(owner?.ownerAbbr)
  const needs = getTeamNeedChips(owner?.ownerAbbr)
  const strategy = profile?.editorial?.strategy || 'Priorizar valor de board sem perder encaixe de elenco.'
  const range = owner?.pick ? (owner.pick <= 4 ? 'Top 4 / pick premium' : owner.pick <= 14 ? 'Lottery range' : 'First round range') : 'Range em aberto'
  return { needs, strategy, range }
}

export function getFitScore(team, prospect) {
  if (!team || !prospect) return 72
  const pos = prospect.position || ''
  const base = 68 + Math.min(14, Math.max(0, 31 - prospect.rank) / 2)
  const needBonus = team.pick <= 6 ? 8 : team.pick <= 14 ? 4 : 2
  const balance = /PG|SG/.test(pos) ? 4 : /SF|PF/.test(pos) ? 5 : 3
  return Math.round(clamp(base + needBonus + balance))
}

export function getTeamDraftFit(owner, prospect, order) {
  if (!owner?.ownerAbbr || !prospect) return null
  const profile = getTeamProfile(owner.ownerAbbr)
  if (!profile) return null
  try { return calculateDraftFit(prospect, profile, Array.isArray(order) ? order : []) } catch { return null }
}

export function realismRank(realism) {
  return { High: 0, Medium: 1, Low: 2, Blocked: 3 }[realism] ?? 4
}

export function sortProspectsForMode(list, filter, owner, order) {
  const copy = [...list]
  if (filter === 'fit') return copy.sort((a, b) => {
    const fa = getTeamDraftFit(owner, a, order)
    const fb = getTeamDraftFit(owner, b, order)
    return realismRank(fa?.realism) - realismRank(fb?.realism) || (fb?.score || 0) - (fa?.score || 0) || a.rank - b.rank
  })
  if (filter === 'upside') return copy.sort((a, b) => {
    const fa = getTeamDraftFit(owner, a, order), fb = getTeamDraftFit(owner, b, order)
    const aa = getPlayerDraftAttributes(a), ab = getPlayerDraftAttributes(b)
    return ((fb?.score || 0) + ab.ceiling) - ((fa?.score || 0) + aa.ceiling) || a.rank - b.rank
  })
  if (filter === 'safe') return copy.sort((a, b) => {
    const fa = getTeamDraftFit(owner, a, order), fb = getTeamDraftFit(owner, b, order)
    const aa = getPlayerDraftAttributes(a), ab = getPlayerDraftAttributes(b)
    const va = Math.max(0, aa.ceiling - aa.floor), vb = Math.max(0, ab.ceiling - ab.floor)
    return ((fb?.score || 0) + ab.floor - vb * .35) - ((fa?.score || 0) + aa.floor - va * .35) || a.rank - b.rank
  })
  return copy.sort((a, b) => a.rank - b.rank)
}

export function getDraftRecommendations(owner, available, order, limit = 3) {
  if (!owner?.ownerAbbr) return []
  return available.map(player => ({ player, fit: getTeamDraftFit(owner, player, order) })).filter(item => item.fit).sort((a, b) => realismRank(a.fit.realism) - realismRank(b.fit.realism) || b.fit.score - a.fit.score || a.player.rank - b.player.rank).slice(0, limit)
}

export function getTeamNeedChips(teamId) {
  const profile = getTeamProfile(teamId)
  if (!profile) return ['Board value', 'Fit', 'Upside']
  const labels = { shooting: 'Spacing', creation: 'Criacao', defense: 'Defesa', rebounding: 'Rebote', athleticism: 'Atletismo', size: 'Tamanho', floor: 'Piso', ceiling: 'Teto' }
  return Object.entries(profile.needs).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([key]) => labels[key] || key)
}
export function filterProspects(list, filter) {
  if (filter === 'guards') return list.filter(p => /PG|SG/.test(p.position))
  if (filter === 'wings') return list.filter(p => /SG|SF|PF/.test(p.position))
  if (filter === 'bigs') return list.filter(p => /PF|C/.test(p.position))
  if (filter === 'shooters') return list.filter(p => (normalizeProspectStats(p).threep || 0) >= 35)
  if (filter === 'defenders') return list.filter(p => (normalizeProspectStats(p).stlPct || 0) >= 1.8 || (normalizeProspectStats(p).blkPct || 0) >= 2.5)
  if (filter === 'upside') return list.filter(p => ['CORNERSTONE', 'ELITE'].includes(p.tier) || p.age <= 19)
  if (filter === 'safe') return list.filter(p => (normalizeProspectStats(p).ts || 0) >= 57 || (normalizeProspectStats(p).per || 0) >= 22)
  return list
}
