import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { prospects, LOTTERY_TEAMS, PICKS_15_30 } from '../data/prospects'
import { getPlayerCutoutImage } from '../utils/playerImages'
import { calculateDraftFit, getPlayerDraftAttributes } from '../utils/draftFitAlgorithm.js'
import { getTeamProfile } from '../data/teamProfiles.js'
import TeamLogoGlass from '../components/TeamLogoGlass'
import DraftFitBreakdown, { getDraftFitStatus } from '../components/DraftFitBreakdown'

const TRADE_MAP = {
  NOP: () => ({ ownerAbbr: 'ATL', ownerName: 'Atlanta Hawks', ownerColor: '#C8102E', viaAbbr: 'NOP', viaName: 'New Orleans Pelicans' }),
  LAC: () => ({ ownerAbbr: 'OKC', ownerName: 'Oklahoma City Thunder', ownerColor: '#007AC1', viaAbbr: 'LAC', viaName: 'LA Clippers' }),
  IND: finalPosition => {
    if (finalPosition <= 4 || finalPosition >= 11) return { ownerAbbr: 'IND', ownerName: 'Indiana Pacers', ownerColor: '#002D62', viaAbbr: null, viaName: null }
    return { ownerAbbr: 'LAC', ownerName: 'LA Clippers', ownerColor: '#C8102E', viaAbbr: 'IND', viaName: 'Indiana Pacers' }
  },
}

const COMBOS = [140, 140, 140, 125, 105, 90, 75, 60, 45, 30, 20, 15, 10, 5]
const PHASE = { IDLE: 'idle', ANIMATING: 'animating', DONE: 'done', DRAFTING: 'drafting' }
const SCENE = { LOTTERY_INTRO: 'lotteryIntro', LOTTERY_REVEAL: 'lotteryReveal', DRAFT_ORDER: 'draftOrder', WAR_ROOM: 'warRoom', PICK_CONFIRM: 'pickConfirm', NEXT_PICK: 'nextPickTransition', DRAFT_RESULTS: 'draftResults' }
const TOTAL_PICKS = 30
const TRADE_MAP_LABELS = { IND: 'PROT. 1-4 / 11-14', NOP: 'via ATL', LAC: 'via OKC' }

const TIER_STYLES = {
  ELITE: { label: 'ELITE', color: '#7c5ccf', bg: '#eee9fb', text: '#5d46a3', glow: 'rgba(124,92,207,.26)' },
  LOTTERY: { label: 'LOTTERY', color: '#5aaed6', bg: '#edf7fd', text: '#3f7fa0', glow: 'rgba(90,174,214,.24)' },
  MID_1ST: { label: 'MID 1ST', color: '#c9a941', bg: '#fbf4d2', text: '#8a7023', glow: 'rgba(201,169,65,.24)' },
  SLEEPER: { label: 'SLEEPER', color: '#e6a06f', bg: '#faeee5', text: '#a8663b', glow: 'rgba(230,160,111,.22)' },
}

const normalizeTierKey = tier => ({ ALL_STAR: 'LOTTERY', STARTER: 'MID_1ST', FRINGE: 'MID_1ST', ROLE_PLAYER: 'SLEEPER' }[tier] || tier)

const FILTERS = [
  ['best', 'Best Available'],
  ['guards', 'Guards'],
  ['wings', 'Wings'],
  ['bigs', 'Bigs'],
  ['shooters', 'Shooters'],
  ['defenders', 'Defenders'],
  ['upside', 'Upside'],
  ['safe', 'Safe Picks'],
]

const motionPresets = {
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

function applyTradeRules(team, finalPosition) {
  const rule = TRADE_MAP[team.abbr]
  if (rule) return rule(finalPosition)
  return { ownerAbbr: team.abbr, ownerName: team.name, ownerColor: team.color, viaAbbr: null, viaName: null }
}

function buildPool() {
  const pool = []
  LOTTERY_TEAMS.forEach((team, i) => {
    for (let c = 0; c < COMBOS[i]; c++) pool.push(team.id)
  })
  return pool
}

function pickOne(pool, exclude) {
  const eligible = pool.filter(id => !exclude.includes(id))
  return eligible[Math.floor(Math.random() * eligible.length)]
}

function runLottery() {
  const pool = buildPool()
  const top4 = []
  for (let i = 0; i < 4; i++) {
    const winner = pickOne(pool, top4)
    if (winner != null) top4.push(winner)
  }
  const rest = LOTTERY_TEAMS.filter(t => !top4.includes(t.id)).sort((a, b) => a.slotOrder - b.slotOrder).map(t => t.id)
  return [...top4, ...rest]
}

const teamById = id => LOTTERY_TEAMS.find(t => t.id === id)

function getSceneFromState(phase, draftFinished) {
  if (draftFinished) return SCENE.DRAFT_RESULTS
  if (phase === PHASE.IDLE) return SCENE.LOTTERY_INTRO
  if (phase === PHASE.ANIMATING) return SCENE.LOTTERY_REVEAL
  if (phase === PHASE.DONE) return SCENE.DRAFT_ORDER
  if (phase === PHASE.DRAFTING) return SCENE.WAR_ROOM
  return SCENE.LOTTERY_INTRO
}
function buildProjectedLotteryPicks() {
  return LOTTERY_TEAMS.map((team, i) => ({ pick: i + 1, isLottery: true, isTop4: i < 4, ownerName: team.name, ownerAbbr: team.abbr, ownerColor: team.color, originalTeam: team }))
}

function getTeamTimelineLabel(teamId) {
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

function getTeamPriorityLabel(teamId) {
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
const clamp = value => Math.min(100, Math.max(0, value))
const num = value => (typeof value === 'number' ? value.toFixed(1) : '-')
const getTierStyles = tier => TIER_STYLES[normalizeTierKey(tier)] || TIER_STYLES.SLEEPER
const initials = name => String(name || '').split(' ').filter(Boolean).slice(0, 2).map(x => x[0]).join('').toUpperCase()

function getLotteryMovement(pick) {
  if (!pick?.originalTeam) return { delta: 0, label: 'Manteve posicao', tone: '#a09891' }
  const delta = pick.originalTeam.slotOrder - pick.pick
  if (delta > 0) return { delta, label: 'Subiu +' + delta, tone: '#7c5ccf' }
  if (delta < 0) return { delta, label: 'Caiu ' + delta, tone: '#d96f7d' }
  return { delta: 0, label: 'Manteve posicao', tone: '#4f86ad' }
}

function getBiggestWinner(results) {
  return results.filter(p => p.isLottery).map(p => ({ ...p, movement: getLotteryMovement(p) })).sort((a, b) => b.movement.delta - a.movement.delta)[0]
}

function getBiggestDrop(results) {
  return results.filter(p => p.isLottery).map(p => ({ ...p, movement: getLotteryMovement(p) })).sort((a, b) => a.movement.delta - b.movement.delta)[0]
}

function getProspectArchetype(p) {
  const s = p.stats || {}
  if ((s.threep || 0) >= 37) return 'Movement Shooter'
  if ((s.apg || 0) >= 4 || (s.astTo || 0) >= 2) return 'Creator / Connector'
  if ((s.rpg || 0) >= 8 || (s.blkPct || 0) >= 4) return 'Interior Anchor'
  if ((s.ppg || 0) >= 18) return 'Primary Scorer'
  return 'Two-Way Prospect'
}

function getProspectAttributes(p) {
  const s = p.stats || {}
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

function getWarRoomAttributes(p) {
  const s = p?.stats || {}
  const attrs = p?.scouting?.attributes || {}
  return [
    ['Scoring', clamp(((s.ppg || 0) / 28) * 100)],
    ['Shooting', clamp(Math.max(((s.threep || 0) / 45) * 100, ((s.ts || 0) / 70) * 100, (attrs.Shooting || 0) * 10))],
    ['Creation', clamp(Math.max(((s.apg || 0) / 8) * 100, ((s.astTo || 0) / 3.2) * 100, (attrs.Playmaking || 0) * 10))],
    ['Defense', clamp(Math.max((s.stlPct || 0) * 18, (s.blkPct || 0) * 11, (attrs.Defense || 0) * 10))],
    ['Athleticism', clamp((attrs.Athleticism || 6) * 10)],
  ].sort((a, b) => b[1] - a[1])
}

function getTopMetrics(p) {
  const s = p?.stats || {}
  return [
    ['PPG', num(s.ppg)],
    ['TS%', typeof s.ts === 'number' ? s.ts.toFixed(1) : '-'],
    ['3P%', typeof s.threep === 'number' ? s.threep.toFixed(1) : '-'],
    ['AST', num(s.apg)],
  ]
}

function getPlayerDecisionMeta(p) {
  const attrs = getWarRoomAttributes(p)
  const best = attrs[0]?.[0] || 'Scoring'
  const weak = attrs[attrs.length - 1]?.[0] || 'Defense'
  const primary = getProspectArchetype(p)
  const secondary = attrs.find(([label]) => label !== best)?.[0] || 'Connector'
  return { primary, secondary, best, weak }
}

function getDraftContextBullets(draftFit, prospect) {
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

function getProspectListBadge(prospect, fit, isBest) {
  let attrs = { floor: 0, ceiling: 0 }
  try { attrs = getPlayerDraftAttributes(prospect) || attrs } catch { attrs = { floor: 0, ceiling: 0 } }
  if (fit?.score >= 82 && fit?.realism !== 'Blocked') return { label: 'Best Fit', color: '#7c5ccf', bg: '#eee9fb' }
  if ((attrs.ceiling || 0) - (attrs.floor || 0) >= 18 || (attrs.ceiling || 0) >= 84) return { label: 'Upside', color: '#9b6a2f', bg: '#fbf4d2' }
  if ((attrs.floor || 0) >= 72 || isBest) return { label: 'Safe', color: '#4f9577', bg: '#e5f4ec' }
  return null
}

function getComparisonRows(playerA, playerB) {
  if (!playerA || !playerB) return []
  try {
    const attrsA = Object.fromEntries(getWarRoomAttributes(playerA))
    const attrsB = Object.fromEntries(getWarRoomAttributes(playerB))
    return ['Scoring', 'Shooting', 'Creation', 'Defense', 'Athleticism'].map(label => [label, attrsA[label] || 0, attrsB[label] || 0])
  } catch {
    return []
  }
}

function getTeamDecisionContext(owner) {
  const profile = getTeamProfile(owner?.ownerAbbr)
  const needs = getTeamNeedChips(owner?.ownerAbbr)
  const strategy = profile?.editorial?.strategy || 'Priorizar valor de board sem perder encaixe de elenco.'
  const range = owner?.pick ? (owner.pick <= 4 ? 'Top 4 / pick premium' : owner.pick <= 14 ? 'Lottery range' : 'First round range') : 'Range em aberto'
  return { needs, strategy, range }
}

function getFitScore(team, prospect) {
  if (!team || !prospect) return 72
  const pos = prospect.position || ''
  const base = 68 + Math.min(14, Math.max(0, 31 - prospect.rank) / 2)
  const needBonus = team.pick <= 6 ? 8 : team.pick <= 14 ? 4 : 2
  const balance = /PG|SG/.test(pos) ? 4 : /SF|PF/.test(pos) ? 5 : 3
  return Math.round(clamp(base + needBonus + balance))
}

function getTeamDraftFit(owner, prospect, order) {
  if (!owner?.ownerAbbr || !prospect) return null
  const profile = getTeamProfile(owner.ownerAbbr)
  if (!profile) return null
  try { return calculateDraftFit(prospect, profile, Array.isArray(order) ? order : []) } catch { return null }
}

function realismRank(realism) {
  return { High: 0, Medium: 1, Low: 2, Blocked: 3 }[realism] ?? 4
}

function sortProspectsForMode(list, filter, owner, order) {
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

function getDraftRecommendations(owner, available, order, limit = 3) {
  if (!owner?.ownerAbbr) return []
  return available.map(player => ({ player, fit: getTeamDraftFit(owner, player, order) })).filter(item => item.fit).sort((a, b) => realismRank(a.fit.realism) - realismRank(b.fit.realism) || b.fit.score - a.fit.score || a.player.rank - b.player.rank).slice(0, limit)
}

function getTeamNeedChips(teamId) {
  const profile = getTeamProfile(teamId)
  if (!profile) return ['Board value', 'Fit', 'Upside']
  const labels = { shooting: 'Spacing', creation: 'Criacao', defense: 'Defesa', rebounding: 'Rebote', athleticism: 'Atletismo', size: 'Tamanho', floor: 'Piso', ceiling: 'Teto' }
  return Object.entries(profile.needs).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([key]) => labels[key] || key)
}
function filterProspects(list, filter) {
  if (filter === 'guards') return list.filter(p => /PG|SG/.test(p.position))
  if (filter === 'wings') return list.filter(p => /SG|SF|PF/.test(p.position))
  if (filter === 'bigs') return list.filter(p => /PF|C/.test(p.position))
  if (filter === 'shooters') return list.filter(p => (p.stats?.threep || 0) >= 35)
  if (filter === 'defenders') return list.filter(p => (p.stats?.stlPct || 0) >= 1.8 || (p.stats?.blkPct || 0) >= 2.5)
  if (filter === 'upside') return list.filter(p => p.tier === 'ELITE' || p.age <= 19)
  if (filter === 'safe') return list.filter(p => (p.stats?.ts || 0) >= 57 || (p.stats?.per || 0) >= 22)
  return list
}

export default function MockDraft() {
  const [phase, setPhase] = useState(PHASE.IDLE)
  const [lotteryOrder, setLotteryOrder] = useState([])
  const [resolvedPicks, setResolved] = useState([])
  const [picks, setPicks] = useState({})
  const [selecting, setSelecting] = useState(null)
  const [revealed, setRevealed] = useState([])
  const [previewId, setPreviewId] = useState(null)
  const [filter, setFilter] = useState('best')
  const [toast, setToast] = useState(null)
  const [draftFinished, setDraftFinished] = useState(false)
  const [isSelecting, setIsSelecting] = useState(false)
  const [pickOverlay, setPickOverlay] = useState(null)
  const [selectedLotteryPick, setSelectedLotteryPick] = useState(1)
  const lotteryTimersRef = useRef([])

  const clearLotteryTimers = useCallback(() => {
    lotteryTimersRef.current.forEach(timer => clearTimeout(timer))
    lotteryTimersRef.current = []
  }, [])

  useEffect(() => clearLotteryTimers, [clearLotteryTimers])

  const buildAllPicks = useCallback((lotteryResult) => {
    const lottery14 = lotteryResult.map((teamId, idx) => {
      const finalPos = idx + 1
      const team = teamById(teamId)
      const trade = applyTradeRules(team, finalPos)
      return { pick: finalPos, isLottery: true, isTop4: finalPos <= 4, originalTeam: team, ...trade }
    })
    const fixed16 = PICKS_15_30.map(p => ({ pick: p.pick, isLottery: false, isTop4: false, originalTeam: null, ownerAbbr: p.ownerAbbr, ownerName: p.owner, ownerColor: p.color, viaAbbr: p.viaAbbr, viaName: p.via }))
    return [...lottery14, ...fixed16]
  }, [])

  const runSimulation = useCallback(() => {
    clearLotteryTimers()
    setPhase(PHASE.ANIMATING)
    setRevealed([])
    setPicks({})
    setSelecting(null)
    setPreviewId(null)
    setToast(null)
    setIsSelecting(false)
    setPickOverlay(null)
    setDraftFinished(false)
    setSelectedLotteryPick(1)

    const order = runLottery()
    const all = buildAllPicks(order)
    setLotteryOrder(order)
    setResolved(all)

    const scheduleLotteryStep = (callback, delay) => {
      const timer = setTimeout(callback, delay)
      lotteryTimersRef.current.push(timer)
    }

    const revealSequence = Array.from({ length: 14 }, (_, step) => 13 - step)
    revealSequence.forEach((pickIndex, step) => {
      const pickNumber = pickIndex + 1
      const revealDelay = pickNumber > 4
        ? step * 380 + 420
        : 5200 + (4 - pickNumber) * 1550

      scheduleLotteryStep(() => {
        setRevealed(prev => prev.includes(pickIndex) ? prev : [...prev, pickIndex])
      }, revealDelay)
    })

    scheduleLotteryStep(() => {
      setRevealed(Array.from({ length: 14 }, (_, i) => i))
      setPhase(PHASE.DONE)
      lotteryTimersRef.current = []
    }, 10650)
  }, [buildAllPicks, clearLotteryTimers])

  const startDrafting = () => {
    setPhase(PHASE.DRAFTING)
    setDraftFinished(false)
    setSelectedLotteryPick(1)
    setSelecting(0)
    setPreviewId(null)
    setPickOverlay(null)
    setFilter('best')
  }

  const assignPick = (pickIdx, prospectId) => {
    const picked = prospects.find(p => p.id === prospectId)
    const selectedPick = resolvedPicks[pickIdx]
    const nextPick = resolvedPicks[pickIdx + 1]
    const selectedTeam = selectedPick?.ownerName || 'Time no relógio'
    const next = pickIdx + 1

    setIsSelecting(true)
    setPickOverlay({ stage: 'confirm', pickNo: pickIdx + 1, team: selectedPick, nextTeam: nextPick, prospect: picked })
    setPicks(prev => ({ ...prev, [pickIdx]: prospectId }))
    setToast(picked ? { pick: pickIdx + 1, name: picked.name, team: selectedTeam } : { pick: pickIdx + 1, name: 'Pick pulado', team: selectedTeam })
    setTimeout(() => setToast(null), 1800)

    setTimeout(() => {
      if (next < TOTAL_PICKS) setPickOverlay({ stage: 'next', pickNo: next + 1, team: nextPick })
    }, 1250)

    setTimeout(() => {
      setIsSelecting(false)
      setPickOverlay(null)
      if (next < TOTAL_PICKS) {
        setSelecting(next)
        setPreviewId(null)
      } else {
        setSelecting(null)
        setPreviewId(null)
        setDraftFinished(true)
      }
    }, next < TOTAL_PICKS ? 2200 : 1700)
  }

  const resetAll = () => {
    clearLotteryTimers()
    setPhase(PHASE.IDLE)
    setLotteryOrder([])
    setResolved([])
    setPicks({})
    setSelecting(null)
    setRevealed([])
    setPreviewId(null)
    setToast(null)
    setDraftFinished(false)
    setSelectedLotteryPick(1)
  }

  const draftedIds = Object.values(picks).filter(Boolean)
  const available = prospects.filter(p => !draftedIds.includes(p.id)).sort((a, b) => a.rank - b.rank)
  const currentOwner = selecting !== null && resolvedPicks[selecting] ? resolvedPicks[selecting] : null
  const filteredPool = filterProspects(available, filter)
  const filteredAvailable = sortProspectsForMode(filteredPool, filter, currentOwner, resolvedPicks)
  const selectedProspect = available.find(p => p.id === previewId) || filteredAvailable[0] || available[0]
  const activeScene = getSceneFromState(phase, draftFinished)
  const backdropTeam = pickOverlay?.team || currentOwner || resolvedPicks[0] || null

  return (
    <div className="relative min-h-full overflow-hidden bg-[#edeae4]">
      <DynamicTeamBackdrop team={backdropTeam} intensity={phase === PHASE.DRAFTING || pickOverlay ? .14 : .08} />
      <header className="sticky top-0 z-40 border-b border-white/60 bg-white/55 px-6 py-4 shadow-[0_4px_30px_rgb(0,0,0,0.05)] backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="font-display text-3xl font-black tracking-tight text-slate-800">Mock Draft Simulator</div>
            <div className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[.24em] text-muted">NBA Draft 2026 / Lottery Event / War Room Mode</div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {phase !== PHASE.IDLE && <PremiumButton onClick={resetAll} color="#a09891">Reset</PremiumButton>}
            {phase === PHASE.IDLE && <PremiumButton onClick={runSimulation} color="#7c5ccf" strong>Simular Loteria</PremiumButton>}
            {phase === PHASE.DONE && <PremiumButton onClick={startDrafting} color="#4f9577" strong>Seguir para o Draft</PremiumButton>}
            {draftFinished && <StatusPill>Draft finalizado</StatusPill>}
            {!draftFinished && phase === PHASE.DRAFTING && <StatusPill>{selecting !== null ? 'Pick ' + (selecting + 1) + ' / ' + TOTAL_PICKS : 'Draft concluido'}</StatusPill>}
          </div>
        </div>
      </header>

      <main className="relative z-10 p-6">
        <AnimatePresence mode="wait">
          <motion.div key={activeScene} {...motionPresets.page}>
            {draftFinished ? (
              <DraftResultsScreen picks={picks} resolvedPicks={resolvedPicks} onReset={resetAll} onHome={resetAll} />
            ) : (
              <>
                {phase === PHASE.IDLE && <LotteryPanel onRun={runSimulation} selectedPick={selectedLotteryPick} onSelectPick={setSelectedLotteryPick} />}
                {phase === PHASE.ANIMATING && <LotteryReveal picks={resolvedPicks} revealed={revealed} topProspects={prospects.slice(0, 5)} />}
                {phase === PHASE.DONE && <LotteryResultSummary picks={resolvedPicks} revealed={revealed} onDraft={startDrafting} />}
                {phase === PHASE.DRAFTING && (
                  <ProspectSelectionScreen
                    currentOwner={currentOwner}
                    selecting={selecting}
                    available={filteredAvailable}
                    rawAvailable={available}
                    selectedProspect={selectedProspect}
                    filter={filter}
                    setFilter={setFilter}
                    setPreviewId={setPreviewId}
                    onPick={id => assignPick(selecting, id)}
                    picks={picks}
                    resolvedPicks={resolvedPicks}
                    toast={toast}
                    isSelecting={isSelecting}
                  />
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
        <PickCinematicOverlay overlay={pickOverlay} />
      </main>
    </div>
  )
}

function LotteryPanel({ onRun, selectedPick = 1, onSelectPick = () => {} }) {
  const topProspects = prospects.slice(0, 5)
  const projectedOrder = buildProjectedLotteryPicks()
  const selected = projectedOrder.find(p => p.pick === selectedPick) || projectedOrder[0]
  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_360px]">
      <GlassPanel className="relative min-h-[680px] overflow-hidden p-8">
        <span className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-200/35 blur-3xl" />
        <span className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-cyan-100/45 blur-3xl" />
        <div className="relative grid min-h-[600px] gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="flex flex-col justify-center">
            <motion.div initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: .55, ease: [0.22, 1, 0.36, 1] }}>
              <div className="font-mono text-[10px] font-black uppercase tracking-[.32em] text-[#7c5ccf]">Lottery Room</div>
              <h2 className="mt-3 max-w-3xl font-display text-7xl font-black leading-[.92] tracking-tight text-slate-800">A ordem do Draft será definida</h2>
              <p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-muted">Entre na sala da loteria: probabilidades, tensão e o primeiro grande ponto de virada da classe de 2026.</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <PremiumButton onClick={onRun} color="#7c5ccf" strong>Revelar ordem</PremiumButton>
                <span className="rounded-full border border-white/35 bg-white/30 px-4 py-2 font-mono text-[9px] font-black uppercase tracking-[.16em] text-muted backdrop-blur-md">14 lottery teams</span>
              </div>
            </motion.div>
            <motion.div variants={motionPresets.cardStagger} initial="hidden" animate="show" className="mt-9 grid grid-cols-4 gap-3 sm:grid-cols-7">
              {projectedOrder.map((pick, index) => {
                const active = selectedPick === pick.pick
                return (
                  <motion.button
                    type="button"
                    key={pick.ownerAbbr}
                    variants={motionPresets.cardItem}
                    onClick={() => onSelectPick(pick.pick)}
                    whileHover={{ y: -4, scale: 1.035 }}
                    whileTap={{ scale: .98 }}
                    className="flex h-[106px] min-w-0 flex-col items-center justify-center rounded-[22px] border border-white/30 bg-white/25 p-3 text-center backdrop-blur-md transition-colors"
                    style={{
                      boxShadow: active ? '0 16px 34px ' + pick.ownerColor + '22, inset 0 0 0 1px rgba(255,255,255,.65)' : '0 8px 22px rgba(0,0,0,.035)',
                      background: active ? 'rgba(255,255,255,.44)' : 'rgba(255,255,255,.25)'
                    }}
                  >
                    <TeamLogoGlass teamId={pick.ownerAbbr} size="sm" showGlow={active || index < 4}/>
                    <div className="mt-2 h-4 text-center font-mono text-[8px] font-black uppercase tracking-[.12em] text-muted">{pick.ownerAbbr}</div>
                  </motion.button>
                )
              })}
            </motion.div>
          </div>
          <div className="flex w-full items-stretch"><ProjectedPickHero pick={selected} onRun={onRun} /></div>
        </div>
      </GlassPanel>
      <SideIntel prospects={topProspects} activePick={selectedPick} />
    </section>
  )
}
function OddsRow({ team, index }) {
  const oddsColor = index < 3 ? '#7c5ccf' : index < 8 ? '#5aaed6' : '#a89f95'
  const width = (COMBOS[index] / 140) * 100
  return (
    <motion.div whileHover={{ y: -3, scale: 1.01 }} className="rounded-[26px] border border-white/60 bg-white/42 p-4 backdrop-blur-md" style={{ boxShadow: '0 8px 24px rgba(0,0,0,.035)' }}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="font-mono text-xs font-black text-lo">#{index + 1}</span>
          <TeamLogoGlass teamId={team.abbr} size="sm" showGlow={index < 4} />
          <div className="min-w-0">
            <div className="truncate font-sans text-sm font-black text-slate-800">{team.name}</div>
            <div className="font-mono text-[9px] font-bold uppercase tracking-[.18em] text-muted">{team.record}</div>
          </div>
        </div>
        <span className="rounded-full px-3 py-1 font-mono text-[10px] font-black" style={{ background: oddsColor + '18', color: oddsColor }}>{team.prob}% #1</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/60">
        <motion.div initial={{ width: 0 }} animate={{ width: width + '%' }} transition={{ duration: .8, delay: index * .025 }} className="h-full rounded-full" style={{ background: oddsColor, boxShadow: '0 0 16px ' + oddsColor + '66' }} />
      </div>
      <div className="mt-2 flex justify-between font-mono text-[8px] font-bold uppercase tracking-[.14em] text-lo">
        <span>{TRADE_MAP_LABELS[team.abbr] || 'Own pick'}</span>
        <span>Top 4 draw</span>
      </div>
    </motion.div>
  )
}

function ProjectedPickHero({ pick, onRun }) {
  return (
    <motion.div whileHover={{ y: -3, scale: 1.01 }} className="relative flex min-h-[340px] w-full flex-col justify-center overflow-hidden rounded-[32px] border border-white/45 bg-white/30 p-5 text-center backdrop-blur-xl" style={{ boxShadow: '0 18px 48px ' + (pick?.ownerColor || '#7c5ccf') + '20' }}>
      <span className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full blur-3xl" style={{ background: pick?.ownerColor || '#7c5ccf', opacity: .18 }} />
      <div className="relative font-mono text-[8px] font-black uppercase tracking-[.24em] text-lo">Projected #1 Pick</div>
      <div className="relative mt-3 flex justify-center"><TeamLogoGlass teamId={pick?.ownerAbbr} size="xl" showGlow /></div>
      <div className="relative mt-3 font-display text-4xl font-black leading-none" style={{ color: pick?.ownerColor || '#7c5ccf' }}>#{pick?.pick}</div>
      <div className="relative mx-auto mt-2 flex h-16 max-w-[300px] items-center justify-center text-balance font-display text-2xl font-black leading-tight text-slate-800">{pick?.ownerName}</div>
      <div className="relative mt-3 flex flex-wrap justify-center gap-2">
        <span className="rounded-full border border-white/35 bg-white/35 px-3 py-1 font-mono text-[8px] font-black uppercase tracking-[.14em] text-muted">{getTeamTimelineLabel(pick?.ownerAbbr)}</span>
        <span className="rounded-full border border-white/35 bg-white/35 px-3 py-1 font-mono text-[8px] font-black uppercase tracking-[.14em] text-muted">{getTeamPriorityLabel(pick?.ownerAbbr)}</span>
      </div>
      <button type="button" onClick={onRun} className="relative mt-4 rounded-full px-5 py-2.5 font-mono text-[9px] font-black uppercase tracking-[.18em] text-white transition-transform hover:-translate-y-0.5 active:scale-95" style={{ background: pick?.ownerColor || '#7c5ccf', boxShadow: '0 14px 30px ' + (pick?.ownerColor || '#7c5ccf') + '30' }}>Sortear ordem</button>
    </motion.div>
  )
}

function DraftOrderStrip({ picks, activePick = 1, onSelect = () => {} }) {
  return (
    <section className="relative -mx-2 overflow-hidden rounded-[30px] border border-white/35 bg-white/20 p-3 backdrop-blur-md">
      <div className="mb-3 flex items-center justify-between gap-3 px-2">
        <div>
          <div className="font-mono text-[9px] font-black uppercase tracking-[.26em] text-lo">Draft Order Strip</div>
          <div className="mt-1 text-xs font-semibold text-muted">Clique em uma pick para destacar o contexto antes da simulação.</div>
        </div>
        <span className="hidden rounded-full border border-white/30 bg-white/30 px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[.16em] text-muted sm:inline-flex">Lottery #1-#14</span>
      </div>
      <div className="flex gap-3 overflow-x-auto px-2 pb-2 [scrollbar-width:thin]">
        {picks.slice(0, 14).map(pick => {
          const top4 = pick.pick <= 4
          const active = pick.pick === activePick
          const size = top4 ? 'min-w-[148px] p-4' : 'min-w-[118px] p-3'
          return (
            <motion.button
              type="button"
              key={pick.pick}
              onClick={() => onSelect(pick.pick)}
              whileHover={{ y: -5, scale: 1.035 }}
              whileTap={{ scale: .98 }}
              title={`${pick.ownerName} / ${getTeamTimelineLabel(pick.ownerAbbr)} / ${getTeamPriorityLabel(pick.ownerAbbr)}`}
              className={size + ' group relative overflow-hidden rounded-[24px] border text-left backdrop-blur-md transition-all duration-300'}
              style={{
                background: active ? 'rgba(255,255,255,.54)' : top4 ? 'rgba(255,255,255,.38)' : 'rgba(255,255,255,.25)',
                borderColor: active ? 'rgba(255,255,255,.86)' : 'rgba(255,255,255,.32)',
                boxShadow: active || top4 ? '0 18px 42px ' + pick.ownerColor + '22' : '0 10px 26px rgba(0,0,0,.035)'
              }}
            >
              <span className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full blur-2xl transition-opacity" style={{ background: pick.ownerColor, opacity: active || top4 ? .18 : .08 }} />
              <div className="relative flex items-start justify-between gap-2">
                <span className={(top4 ? 'text-3xl' : 'text-2xl') + ' font-display font-black leading-none'} style={{ color: pick.pick <= 4 ? '#7c5ccf' : '#5aaed6' }}>#{pick.pick}</span>
                {active && <span className="rounded-full bg-white/45 px-2 py-1 font-mono text-[7px] font-black uppercase tracking-[.12em] text-muted">ativo</span>}
              </div>
              <div className="relative mt-3 flex items-center gap-3">
                <TeamLogoGlass teamId={pick.ownerAbbr} size={top4 ? 'md' : 'sm'} showGlow={top4 || active} />
                <div className="min-w-0">
                  <div className={(top4 ? 'text-lg' : 'text-sm') + ' font-black text-slate-800'}>{pick.ownerAbbr}</div>
                  <div className="truncate font-mono text-[7px] font-black uppercase tracking-[.14em] text-lo">{top4 ? 'Top 4 draw' : 'Lottery'}</div>
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>
    </section>
  )
}
function LotteryReveal({ picks, revealed, topProspects }) {
  const currentIndex = revealed[revealed.length - 1]
  const currentPick = typeof currentIndex === 'number' ? picks[currentIndex] : null
  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_360px]">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45, ease: [0.22, 1, 0.36, 1] }}>
        <GlassPanel className="relative min-h-[680px] overflow-hidden p-7">
          <span className="pointer-events-none absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-violet-200/35 blur-3xl" />
          <div className="relative mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="font-mono text-[10px] font-black uppercase tracking-[.32em] text-[#7c5ccf]">Live Reveal</div>
              <h2 className="mt-2 font-display text-5xl font-black tracking-tight text-slate-800">Lottery Reveal</h2>
              <p className="mt-2 text-sm font-semibold text-muted">Revelando picks de #14 ate #1 com pausa dramatica no Top 4.</p>
            </div>
            <div className="rounded-full border border-white/40 bg-white/35 px-4 py-2 font-mono text-[9px] font-black uppercase tracking-[.18em] text-muted backdrop-blur-md">{revealed.length}/14 picks</div>
          </div>
          <AnimatePresence mode="wait">
            {currentPick && (
              <motion.div
                key={currentPick.pick}
                initial={{ opacity: 0, y: 18, scale: .96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: .98 }}
                transition={{ duration: .5, ease: [0.22, 1, 0.36, 1] }}
                className="relative mb-6 overflow-hidden rounded-[32px] border border-white/55 bg-white/35 p-5 backdrop-blur-xl"
                style={{ boxShadow: '0 22px 56px ' + (currentPick.ownerColor || '#7c5ccf') + '24' }}
              >
                <span className="pointer-events-none absolute -right-10 -top-16 h-36 w-36 rounded-full blur-3xl" style={{ background: currentPick.ownerColor || '#7c5ccf', opacity: .18 }} />
                <div className="relative flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <TeamLogoGlass teamId={currentPick.ownerAbbr} size={currentPick.pick <= 4 ? 'xl' : 'lg'} showGlow />
                    <div>
                      <div className="font-mono text-[9px] font-black uppercase tracking-[.24em] text-lo">Agora revelando</div>
                      <div className="mt-1 font-display text-4xl font-black text-slate-800">Pick #{currentPick.pick}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-3xl font-black" style={{ color: currentPick.ownerColor || '#7c5ccf' }}>{currentPick.ownerName}</div>
                    <div className="mt-1 font-mono text-[9px] font-black uppercase tracking-[.16em] text-muted">{currentPick.viaAbbr ? 'via ' + currentPick.viaAbbr : currentPick.originalTeam?.record}</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="relative max-h-[720px] space-y-3 overflow-y-auto pr-2 [scrollbar-width:thin]">
            {picks.slice(0, 14).map((pick, index) => {
              const isRevealed = revealed.includes(index)
              return <RevealPick key={pick.pick} pick={pick} visible={isRevealed} index={index} />
            })}
          </div>
        </GlassPanel>
      </motion.div>
      <SideIntel prospects={topProspects} picks={picks} activePick={revealed?.length ? Math.max(1, 14 - revealed.length + 1) : 14} />
    </section>
  )
}

function RevealPick({ pick, visible, index = 0 }) {
  const movement = getLotteryMovement(pick)
  const isTop4 = pick.pick <= 4
  const isFirst = pick.pick === 1
  const delay = visible ? (isTop4 ? .18 + (4 - pick.pick) * .12 : index * .02) : 0
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: .94 }}
      animate={{ opacity: visible ? 1 : .16, y: visible ? 0 : 24, scale: visible ? (isFirst ? 1.045 : 1) : .95 }}
      transition={{ duration: .72, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={visible ? { y: -5, scale: isFirst ? 1.055 : 1.018 } : { scale: .97 }}
      className={(isFirst ? 'ring-1 ring-violet-200/80 ' : '') + 'will-change-transform relative overflow-hidden rounded-[26px] border border-white/60 bg-white/44 p-4 backdrop-blur-md'}
      style={{ boxShadow: visible ? (isFirst ? '0 26px 68px rgba(124,92,207,.30)' : isTop4 ? '0 20px 52px rgba(124,92,207,.18)' : '0 14px 34px rgba(124,92,207,.10)') : 'inset 1px 1px 0 rgba(255,255,255,.8)' }}
    >
      {visible && <motion.span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/45 to-transparent" initial={{ x: '-20%' }} animate={{ x: '330%' }} transition={{ duration: 1.15, delay: delay + .12, ease: 'easeOut' }} />}
      <div className="relative flex items-center justify-between gap-3">
        <motion.div animate={visible && isFirst ? { scale: [1, 1.08, 1] } : { scale: 1 }} transition={{ duration: 1.2, repeat: visible && isFirst ? 1 : 0 }} className="font-display text-3xl font-black" style={{ color: pick.pick <= 4 ? '#7c5ccf' : '#5aaed6' }}>#{pick.pick}</motion.div>
        {visible ? <MovementBadge movement={movement} /> : <span className="font-mono text-[9px] font-bold uppercase tracking-[.18em] text-lo">awaiting</span>}
      </div>
      <div className="relative mt-3 min-h-[54px]">
        <AnimatePresence mode="wait">
          {visible ? (
            <motion.div key="revealed" initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0 }} transition={{ duration: .46, delay: delay + .1, ease: [0.22, 1, 0.36, 1] }} className="flex items-center gap-3">
              <TeamLogoGlass teamId={pick.ownerAbbr} size={isTop4 ? 'md' : 'sm'} showGlow={isTop4} />
              <div className="min-w-0">
                <div className="truncate font-sans text-sm font-black text-slate-800">{pick.ownerName}</div>
                <div className="font-mono text-[9px] font-bold uppercase tracking-[.16em] text-muted">{pick.viaAbbr ? 'via ' + pick.viaAbbr : pick.originalTeam?.record}</div>
              </div>
            </motion.div>
          ) : <motion.div key="locked" initial={{ opacity: .35 }} animate={{ opacity: .75 }} exit={{ opacity: 0 }}><Skeleton /></motion.div>}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function LotteryWinnerHero({ pick, onDraft }) {
  const movement = getLotteryMovement(pick)
  return (
    <div className="relative overflow-hidden rounded-[34px] border border-white/70 p-7 text-center" style={{ background: 'radial-gradient(circle at 50% 10%, rgba(124,92,207,.24), transparent 38%), rgba(255,255,255,.36)', boxShadow: '0 24px 62px ' + (pick?.ownerColor || '#7c5ccf') + '20' }}>
      <span className="pointer-events-none absolute -left-12 -top-16 h-44 w-44 rounded-full blur-3xl" style={{ background: pick?.ownerColor || '#7c5ccf', opacity: .16 }} />
      <div className="relative font-mono text-[10px] font-black uppercase tracking-[.32em] text-[#7c5ccf]">Draft Order Locked</div>
      <div className="relative mt-4 flex justify-center"><TeamLogoGlass teamId={pick?.ownerAbbr} size="xl" showGlow /></div>
      <div className="relative mt-4 font-display text-7xl font-black leading-none text-slate-800">#{pick?.pick}</div>
      <div className="relative mt-3 font-display text-4xl font-black" style={{ color: pick?.ownerColor }}>{pick?.ownerName}</div>
      {pick?.viaAbbr && <div className="relative mt-2 font-mono text-[10px] font-bold uppercase tracking-[.18em] text-muted">via {pick.viaAbbr}</div>}
      <div className="relative mt-4 flex flex-wrap justify-center gap-2">
        <MovementBadge movement={movement} />
        <span className="rounded-full border border-white/35 bg-white/35 px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[.14em] text-muted">{getTeamTimelineLabel(pick?.ownerAbbr)}</span>
        <span className="rounded-full border border-white/35 bg-white/35 px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[.14em] text-muted">{getTeamPriorityLabel(pick?.ownerAbbr)}</span>
      </div>
      <div className="relative mt-6 flex justify-center"><PremiumButton onClick={onDraft} color="#4f9577" strong>Entrar na War Room</PremiumButton></div>
    </div>
  )
}

function LotteryResultSummary({ picks, onDraft }) {
  const [selectedPick, setSelectedPick] = useState(1)
  const winner = getBiggestWinner(picks)
  const drop = getBiggestDrop(picks)
  const flat = picks.filter(p => p.isLottery && getLotteryMovement(p).delta === 0)
  const first = picks[0]
  const selected = picks.find(p => p.pick === selectedPick) || first
  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_360px]">
      <GlassPanel className="p-7">
        <LotteryWinnerHero pick={first} onDraft={onDraft} />
        <div className="mt-6">
          <DraftOrderStrip picks={picks} activePick={selectedPick} onSelect={setSelectedPick} />
        </div>
        <div className="mt-5 rounded-[28px] border border-white/45 bg-white/28 p-5 backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <TeamLogoGlass teamId={selected?.ownerAbbr} size="lg" showGlow />
              <div className="min-w-0">
                <div className="font-mono text-[9px] font-black uppercase tracking-[.24em] text-lo">Pick selecionada</div>
                <div className="mt-1 truncate font-display text-3xl font-black text-slate-800">#{selected?.pick} / {selected?.ownerName}</div>
                <div className="mt-1 font-mono text-[8px] font-black uppercase tracking-[.16em] text-muted">{selected?.viaAbbr ? 'via ' + selected.viaAbbr : getTeamPriorityLabel(selected?.ownerAbbr)}</div>
              </div>
            </div>
            <MovementBadge movement={getLotteryMovement(selected)} />
          </div>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <ResultSpot title="Biggest Winner" pick={winner} />
          <ResultSpot title="Biggest Drop" pick={drop} />
          <div className="rounded-[28px] border border-white/60 bg-white/38 p-5 backdrop-blur-md">
            <div className="font-mono text-[9px] font-black uppercase tracking-[.22em] text-lo">Stayed Flat</div>
            <div className="mt-3 font-display text-4xl font-black text-slate-800">{flat.length}</div>
            <p className="mt-2 text-xs font-semibold leading-5 text-muted">Times mantidos na posicao esperada.</p>
          </div>
        </div>
      </GlassPanel>
      <SideIntel prospects={prospects.slice(0, 5)} picks={picks} activePick={selectedPick} />
    </section>
  )
}

function ResultSpot({ title, pick }) {
  const movement = getLotteryMovement(pick)
  return (
    <div className="rounded-[28px] border border-white/60 bg-white/38 p-5 backdrop-blur-md">
      <div className="font-mono text-[9px] font-black uppercase tracking-[.22em] text-lo">{title}</div>
      <div className="mt-3 truncate font-display text-2xl font-black text-slate-800">{pick?.ownerAbbr}</div>
      <div className="mt-1 truncate text-sm font-bold text-muted">{pick?.ownerName}</div>
      <div className="mt-4"><MovementBadge movement={movement} /></div>
    </div>
  )
}

function ProspectSelectionScreen({ currentOwner, selecting, available, rawAvailable, selectedProspect, filter, setFilter, setPreviewId, onPick, picks, resolvedPicks, toast, isSelecting }) {
  const selectedFit = getTeamDraftFit(currentOwner, selectedProspect, resolvedPicks)
  const recommendations = getDraftRecommendations(currentOwner, rawAvailable, resolvedPicks)
  return (
    <section className="relative grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)_360px]">
      <div className="xl:col-span-3"><WarRoomHeader owner={currentOwner} selecting={selecting} /></div>
      <ProspectListPanel available={available} rawAvailable={rawAvailable} selectedId={selectedProspect?.id} owner={currentOwner} order={resolvedPicks} onHover={setPreviewId} onSelect={setPreviewId} />
      <div className="xl:sticky xl:top-24 xl:h-[calc(100vh-112px)] xl:self-start xl:overflow-y-auto xl:overscroll-contain xl:pr-1 [scrollbar-gutter:stable]">
        <ProspectHeroCard prospect={selectedProspect} owner={currentOwner} draftFit={selectedFit} isSelecting={isSelecting} onPick={() => selectedProspect && onPick(selectedProspect.id)} />
      </div>
      <div className="xl:sticky xl:top-24 xl:h-[calc(100vh-112px)] xl:self-start xl:overflow-y-scroll xl:overscroll-contain xl:pr-2 [scrollbar-gutter:stable]">
        <TeamOnTheClockPanel owner={currentOwner} prospect={selectedProspect} draftFit={selectedFit} recommendations={recommendations} selecting={selecting} picks={picks} resolvedPicks={resolvedPicks} onPreview={setPreviewId} onRecommendPick={id => onPick(id)} onAutoPick={() => recommendations[0]?.player ? onPick(recommendations[0].player.id) : selectedProspect && onPick(selectedProspect.id)} />
      </div>
      <div className="xl:col-span-3"><DraftFilterChips active={filter} setActive={setFilter} /></div>
      <PickConfirmationToast toast={toast} />
    </section>
  )
}

function ProspectListPanel({ available, rawAvailable, selectedId, owner, order, onHover, onSelect }) {
  return (
    <GlassPanel className="max-h-[calc(100vh-190px)] overflow-hidden p-4">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div><div className="font-mono text-[9px] font-black uppercase tracking-[.24em] text-lo">Available</div><h3 className="font-display text-2xl font-black text-slate-800">Prospect Pool</h3></div>
        <span className="rounded-full bg-white/45 px-3 py-1 font-mono text-[10px] font-black text-muted">{available.length}/{rawAvailable.length}</span>
      </div>
      <div className="space-y-2 overflow-y-auto pr-1" style={{ maxHeight: 'calc(100vh - 285px)' }}>
        {available.map((p, idx) => <ProspectOption key={p.id} prospect={p} fit={getTeamDraftFit(owner, p, order)} isBest={idx === 0} active={selectedId === p.id} onHover={() => onHover(p.id)} onClick={() => onSelect(p.id)} />)}
      </div>
    </GlassPanel>
  )
}

function ProspectOption({ prospect, fit, active, isBest, onHover, onClick }) {
  const tier = getTierStyles(prospect.tier)
  const image = getPlayerCutoutImage(prospect)
  const badge = getProspectListBadge(prospect, fit, isBest)
  const fitScore = fit?.score ? Math.round(fit.score) : null
  return (
    <motion.button type="button" onMouseEnter={onHover} onClick={onClick} whileHover={{ x: 4, scale: 1.01 }} className="flex w-full items-center gap-3 rounded-[22px] border px-3 py-3 text-left transition-all" style={{ background: active ? tier.bg : 'rgba(255,255,255,.34)', borderColor: active ? tier.color + '66' : 'rgba(255,255,255,.5)', boxShadow: active ? '0 10px 26px ' + tier.glow : 'none' }}>
      <span className="w-8 font-mono text-xs font-black" style={{ color: tier.color }}>#{prospect.rank}</span>
      <span className="flex h-12 w-12 shrink-0 items-end justify-center overflow-visible rounded-full">{image ? <img src={image} alt={prospect.name} className="player-cutout player-profile-cutout h-full w-full object-contain object-bottom" draggable="false" /> : <span className="mb-2 font-display text-sm font-black" style={{ color: tier.color }}>{initials(prospect.name)}</span>}</span>
      <span className="min-w-0 flex-1"><span className="block truncate text-sm font-black text-slate-800">{prospect.name}</span><span className="mt-0.5 block truncate font-mono text-[8px] font-bold uppercase tracking-[.16em] text-muted">{prospect.position} / {prospect.team}</span><span className="mt-1 flex flex-wrap gap-1.5">{badge && <span className="rounded-full px-2 py-0.5 font-mono text-[7px] font-black uppercase tracking-[.12em]" style={{ background: badge.bg, color: badge.color }}>{badge.label}</span>}{isBest && <span className="rounded-full bg-white/45 px-2 py-0.5 font-mono text-[7px] font-black uppercase tracking-[.12em] text-[#7c5ccf]">Best Avail.</span>}</span></span>
      <span className="flex shrink-0 flex-col items-end gap-1"><span className="rounded-full px-2 py-0.5 font-mono text-[7px] font-black uppercase tracking-[.12em]" style={{ background: tier.bg, color: tier.text }}>{tier.label}</span><span className="font-numeric text-2xl font-extrabold leading-none tracking-tight" style={{ color: fitScore ? tier.color : '#a09891' }}>{fitScore || '-'}</span><span className="font-mono text-[7px] font-black uppercase tracking-[.12em] text-lo">Fit</span></span>
    </motion.button>
  )
}

function ProspectHeroCard({ prospect, owner, draftFit, isSelecting = false, onPick }) {
  if (!prospect) return <GlassPanel className="min-h-[620px] p-7" />
  const tier = getTierStyles(prospect.tier)
  const image = getPlayerCutoutImage(prospect)
  const bars = getWarRoomAttributes(prospect)
  const fit = Math.round(draftFit?.score || getFitScore(owner, prospect))
  const metrics = getTopMetrics(prospect)
  const meta = getPlayerDecisionMeta(prospect)
  const contextBullets = getDraftContextBullets(draftFit, prospect)
  const status = getDraftFitStatus(draftFit)
  const badge = getProspectListBadge(prospect, draftFit, false)
  const note = prospect.scouting?.notes || prospect.scouting?.strengths?.[0] || 'Scout report completo disponivel no perfil.'

  return (
    <AnimatePresence mode="wait">
      <motion.div key={prospect.id} initial={{ opacity: 0, y: 18, scale: .96 }} animate={{ opacity: isSelecting ? .48 : 1, y: 0, scale: isSelecting ? .975 : 1 }} exit={{ opacity: 0, y: -12, scale: .96 }} transition={{ duration: .3, ease: [0.22, 1, 0.36, 1] }} className="will-change-transform">
        <GlassPanel className="relative min-h-[620px] overflow-hidden p-6" style={{ background: 'radial-gradient(circle at 50% 0%, ' + tier.glow + ', transparent 34%), linear-gradient(145deg, rgba(255,255,255,.66), ' + tier.bg + 'c4)' }}>
          <span className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full blur-3xl" style={{ background: tier.color, opacity: .14 }} />
          <span className="pointer-events-none absolute -left-20 bottom-20 h-44 w-44 rounded-full bg-white/70 blur-3xl" />
          <div className="relative space-y-7">
            <DecisionHeader prospect={prospect} tier={tier} fit={fit} badge={badge} status={status} bullets={contextBullets} onPick={onPick} />
            <QuickStatsRow metrics={metrics} color={tier.color} />

            <div className="grid gap-6 lg:grid-cols-[minmax(210px,.68fr)_minmax(0,1fr)]">
              <div className="flex flex-col items-center text-center">
                <div className="relative flex h-72 w-full max-w-[340px] items-end justify-center overflow-visible rounded-[40px] bg-white/18 backdrop-blur-md">
                  <span className="pointer-events-none absolute inset-x-10 bottom-5 h-20 rounded-full blur-2xl" style={{ background: tier.color, opacity: .12 }} />
                  {image ? <img src={image} alt={prospect.name} className="player-cutout player-profile-cutout relative z-10 h-full w-full object-contain object-bottom" draggable="false" /> : <span className="relative z-10 mb-20 font-display text-7xl font-black" style={{ color: tier.color }}>{initials(prospect.name)}</span>}
                </div>
                <div className="mt-3 grid w-full gap-2 sm:grid-cols-2 lg:grid-cols-1">
                  <DecisionChip label="Primary" value={meta.primary} color={tier.color} />
                  <DecisionChip label="Secondary" value={meta.secondary} color="#5aaed6" />
                  <DecisionChip label="Best Trait" value={meta.best} color="#4f9577" />
                  <DecisionChip label="Weakness" value={meta.weak} color="#d96f7d" />
                </div>
              </div>

              <div className="space-y-6">
                <DraftDecisionPanel fit={draftFit} fallbackScore={fit} color={tier.color} status={status} />
                <ArchetypeBars bars={bars} color={tier.color} />
              </div>
            </div>

            <div className="pt-2">
              <div className="font-mono text-[9px] font-black uppercase tracking-[.22em] text-lo">Contexto de scout</div>
              <p className="mt-3 max-w-4xl text-xs font-semibold leading-6 text-slate-600/70">{note}</p>
            </div>

          </div>
        </GlassPanel>
      </motion.div>
    </AnimatePresence>
  )
}

function DecisionHeader({ prospect, tier, fit, badge, status, bullets, onPick }) {
  return (
    <div className="relative rounded-[30px] border border-white/35 bg-white/22 p-5 backdrop-blur-xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[.16em]" style={{ background: tier.bg, color: tier.text }}>{tier.label}</span>
            <span className="rounded-full bg-white/35 px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[.16em] text-muted">#{prospect.rank} / {prospect.position}</span>
            <span className="rounded-full bg-white/35 px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[.16em] text-muted">{prospect.team}</span>
            {badge && <span className="rounded-full px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[.16em]" style={{ background: badge.bg, color: badge.color }}>{badge.label}</span>}
            {status?.label && <span className="rounded-full px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[.16em]" style={{ background: status.bg, color: status.tone }}>{status.label}</span>}
          </div>
          <h2 className="mt-4 font-display text-5xl font-black leading-none tracking-tight text-slate-800 md:text-6xl">{prospect.name}</h2>
          <div className="mt-3 text-sm font-bold text-slate-600/75">{prospect.age} anos / {prospect.height || '-'} / {prospect.weight || '-'}</div>
        </div>
        <div className="shrink-0 rounded-[28px] border border-white/45 bg-white/30 p-4 text-center backdrop-blur-md shadow-[0_14px_34px_rgba(0,0,0,.05)]">
          <div className="font-mono text-[8px] font-black uppercase tracking-[.2em] text-lo">Draft Fit</div>
          <div className="mt-1 font-numeric text-6xl font-extrabold leading-none tracking-tight" style={{ color: tier.color }}>{fit}</div>
          <div className="mt-1 font-mono text-[8px] font-black uppercase tracking-[.16em] text-muted">Score</div>
          <button type="button" onClick={onPick} className="group mt-4 flex w-full min-w-[210px] items-center justify-center gap-2 rounded-full px-5 py-3.5 font-mono text-[10px] font-black uppercase tracking-[.18em] text-white transition-all duration-200 hover:-translate-y-0.5 active:scale-[.98]" style={{ background: 'linear-gradient(135deg, ' + tier.color + ', ' + tier.color + 'dd)', boxShadow: '0 16px 34px ' + tier.glow }}>
            Selecionar
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </button>
        </div>
      </div>
      <div className="mt-5 grid gap-2 md:grid-cols-3">
        {bullets.slice(0, 3).map((bullet, idx) => <div key={idx} className="flex gap-2 rounded-2xl bg-white/24 px-3 py-3 text-xs font-bold leading-5 text-slate-600/85"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: tier.color }} />{bullet}</div>)}
      </div>
    </div>
  )
}

function QuickStatsRow({ metrics, color }) {
  return (
    <div className="flex flex-wrap items-center gap-x-7 gap-y-3 rounded-[24px] border border-white/25 bg-transparent px-2 py-1">
      {metrics.map(([label, value]) => <div key={label} className="flex items-baseline gap-2"><span className="font-numeric text-3xl font-extrabold leading-none tracking-tight text-slate-800" style={{ color }}>{value}</span><span className="font-mono text-[9px] font-black uppercase tracking-[.18em] text-lo">{label}</span></div>)}
    </div>
  )
}

function DraftDecisionPanel({ fit, fallbackScore, color, status }) {
  const components = fit?.components || {}
  const rows = [
    ['Draft Range', components.draftRangeFit ?? fallbackScore, 'Valor da escolha vs range esperado'],
    ['Availability', components.availabilityFit ?? fallbackScore, 'Chance real de estar disponível'],
    ['Team Need', components.teamNeedFit ?? fallbackScore, 'Necessidade do elenco'],
    ['Strategy Fit', components.teamStrategyFit ?? fallbackScore, 'Timeline e filosofia da equipe'],
  ]
  return (
    <div className="rounded-[32px] border border-white/45 bg-white/35 p-5 shadow-[0_22px_58px_rgba(0,0,0,.08)] backdrop-blur-xl">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-mono text-[10px] font-black uppercase tracking-[.28em] text-lo">Draft Decision</div>
          <p className="mt-1 text-xs font-semibold text-muted">Score calculado por range da escolha, disponibilidade, necessidade e estrategia editorial.</p>
        </div>
        {status?.label && <span className="rounded-full px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[.14em]" style={{ background: status.bg, color: status.tone }}>{status.copy || status.label}</span>}
      </div>
      <div className="space-y-4">
        {rows.map(([label, value, copy], idx) => <DecisionBar key={label} label={label} value={value} copy={copy} color={idx < 2 ? color : '#5aaed6'} strong={idx < 2} />)}
      </div>
    </div>
  )
}

function DecisionBar({ label, value, copy, color, strong = false }) {
  const safe = clamp(Number(value) || 0)
  return (
    <div>
      <div className="mb-2 flex items-end justify-between gap-3">
        <div>
          <div className={(strong ? 'text-[11px] text-slate-700' : 'text-[9px] text-lo') + ' font-mono font-black uppercase tracking-[.18em]'}>{label}</div>
          <div className="mt-0.5 text-[11px] font-semibold text-slate-500/80">{copy}</div>
        </div>
        <span className="font-numeric text-3xl font-extrabold leading-none tracking-tight" style={{ color }}>{Math.round(safe)}</span>
      </div>
      <div className={(strong ? 'h-4' : 'h-3') + ' overflow-hidden rounded-full border border-white/30 bg-white/38 shadow-inner'}>
        <motion.div initial={{ width: 0 }} animate={{ width: safe + '%' }} transition={{ duration: .75, ease: [0.22, 1, 0.36, 1] }} className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, ' + color + 'cc, ' + color + ')' }} />
      </div>
    </div>
  )
}

function ArchetypeBars({ bars, color }) {
  return (
    <div className="rounded-[28px] border border-white/35 bg-white/20 p-5 backdrop-blur-md">
      <div className="mb-5 flex flex-wrap justify-between gap-2"><span className="font-mono text-[9px] font-black uppercase tracking-[.22em] text-lo">Archetype Bars</span><span className="text-xs font-bold text-slate-500/80">perfil em 5 areas</span></div>
      <div className="space-y-5">
        {bars.map(([label, value]) => {
          const featured = label === 'Scoring' || label === 'Shooting'
          return <AttributeBar key={label} label={label} value={value} color={featured ? color : '#7caec5'} featured={featured} />
        })}
      </div>
    </div>
  )
}

function DecisionChip({ label, value, color }) {
  return <div className="rounded-[20px] border border-white/30 bg-white/20 px-3 py-3 backdrop-blur-md"><div className="font-mono text-[8px] font-black uppercase tracking-[.18em] text-lo">{label}</div><div className="mt-1 truncate text-sm font-black text-slate-800" style={{ color }}>{value || '-'}</div></div>
}

function TeamOnTheClockPanel({ owner, prospect, draftFit, recommendations, selecting, picks, resolvedPicks, onPreview, onRecommendPick, onAutoPick }) {
  const fit = draftFit?.score || getFitScore(owner, prospect)
  const remaining = resolvedPicks.filter((p, idx) => idx >= (selecting || 0) && p.ownerAbbr === owner?.ownerAbbr).length
  const needs = getTeamNeedChips(owner?.ownerAbbr)
  const glow = owner?.ownerColor || '#7c5ccf'
  return (
    <motion.div
      animate={{ scale: [1, 1.012, 1], boxShadow: ['0 8px 30px rgba(0,0,0,.04)', '0 18px 48px ' + glow + '24', '0 8px 30px rgba(0,0,0,.04)'] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      className="will-change-transform rounded-[34px] border border-white/60 bg-white/48 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl"
      style={{ background: owner?.ownerColor ? 'radial-gradient(circle at 50% 0%, '+owner.ownerColor+'1f, transparent 40%), rgba(255,255,255,.48)' : undefined }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="font-mono text-[9px] font-black uppercase tracking-[.24em] text-lo">On The Clock</div>
        <TeamLogoGlass teamId={owner?.ownerAbbr} size="lg" showGlow />
      </div>
      <div className="mt-3 rounded-[30px] border border-white/45 bg-white/30 p-5 backdrop-blur-md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="font-numeric text-5xl font-extrabold tracking-tight" style={{ color: owner?.ownerColor }}>#{owner?.pick}</div>
            <div className="mt-2 font-display text-2xl font-black text-slate-800">{owner?.ownerName}</div>
            <div className="mt-1 font-mono text-[9px] font-bold uppercase tracking-[.18em] text-muted">{owner?.viaAbbr ? 'via ' + owner.viaAbbr : owner?.originalTeam?.record || 'First round'}</div>
          </div>
          <motion.span animate={{ opacity: [.75, 1, .75] }} transition={{ duration: 1.8, repeat: Infinity }} className="rounded-full bg-white/45 px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[.16em] text-muted">On the Clock</motion.span>
        </div>
        <p className="mt-4 text-xs font-semibold leading-5 text-muted">Escolha baseada em board, estrategia e necessidade.</p>
      </div>
      <div className="mt-5 grid gap-3">
        <InfoLine label="Status" value={selecting !== null ? 'Escolhendo agora' : 'Draft completo'} />
        <InfoLine label="Picks restantes" value={remaining || 0} />
        <InfoLine label="Fit selecionado" value={fit} accent={fit >= 82 ? '#7c5ccf' : '#5aaed6'} />
      </div>
      <div className="mt-5 rounded-[24px] border border-white/55 bg-white/30 p-4">
        <div className="font-mono text-[9px] font-black uppercase tracking-[.2em] text-lo">Team Needs</div>
        <div className="mt-3 flex flex-wrap gap-2">{needs.map(x => <span key={x} className="rounded-full bg-white/45 px-3 py-1 font-mono text-[8px] font-black uppercase tracking-[.12em] text-muted">{x}</span>)}</div>
      </div>
      <DecisionContextCard owner={owner} />
      <DraftRecommendationsPanel owner={owner} recommendations={recommendations} onPreview={onPreview} onPick={onRecommendPick} />
      <button type="button" onClick={onAutoPick} className="mt-5 w-full rounded-full px-5 py-3 font-mono text-[10px] font-black uppercase tracking-[.18em] text-slate-700" style={{ background: '#edeae4', boxShadow: '4px 4px 10px #d4d0ca, -4px -4px 10px #fff' }}>Auto pick melhor fit</button>
      <DraftSummary picks={picks} resolvedPicks={resolvedPicks} />
    </motion.div>
  )
}


function DecisionContextCard({ owner }) {
  const ctx = getTeamDecisionContext(owner)
  return (
    <div className="mt-4 rounded-[24px] border border-white/55 bg-white/28 p-4 backdrop-blur-md">
      <div className="font-mono text-[9px] font-black uppercase tracking-[.2em] text-lo">Decision Context</div>
      <div className="mt-3 space-y-2">
        <InfoLine label="Needs" value={ctx.needs.slice(0, 2).join(' / ')} accent={owner?.ownerColor || '#7c5ccf'} />
        <InfoLine label="Strategy" value={ctx.strategy.length > 34 ? ctx.strategy.slice(0, 34) + '...' : ctx.strategy} />
        <InfoLine label="Pick Range" value={ctx.range} accent="#5aaed6" />
      </div>
    </div>
  )
}

function DraftRecommendationsPanel({ owner, recommendations, onPreview, onPick }) {
  return (
    <div className="mt-5 rounded-[28px] border border-white/55 bg-white/28 p-4 backdrop-blur-md">
      <div className="font-mono text-[9px] font-black uppercase tracking-[.22em] text-lo">Recomendacoes para {owner?.ownerAbbr}</div>
      <p className="mt-1 text-xs font-semibold leading-5 text-muted">Baseado em pick, disponibilidade, estrategia e necessidades do elenco.</p>
      <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: .07, delayChildren: .05 } } }} className="mt-4 grid gap-3">
        {recommendations.length ? recommendations.map((item, index) => <DraftRecommendationCard key={item.player.id} item={item} index={index} onPreview={onPreview} onPick={onPick} />) : <div className="rounded-[22px] bg-white/35 p-4 text-sm font-bold text-muted">Sem encaixe forte por range de escolha; exibindo melhores disponiveis.</div>}
      </motion.div>
    </div>
  )
}

function DraftRecommendationCard({ item, index, onPreview, onPick }) {
  const { player, fit } = item
  const tier = getTierStyles(player.tier)
  const status = getDraftFitStatus(fit)
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: .28, ease: [0.22, 1, 0.36, 1] } } }} onMouseEnter={() => onPreview(player.id)} whileHover={{ y: -4, scale: 1.02 }} className="will-change-transform rounded-[24px] border border-white/45 bg-white/34 p-3 backdrop-blur-md transition-shadow duration-200 hover:shadow-[0_16px_42px_rgba(124,92,207,.14)]">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-black" style={{ background: index === 0 ? '#eee9fb' : 'rgba(255,255,255,.45)', color: index === 0 ? '#5d46a3' : '#8b837c' }}>#{index + 1}</div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2"><div className="truncate text-sm font-black text-slate-800">{player.name}</div><span className="font-numeric text-2xl font-extrabold tracking-tight" style={{ color: tier.color }}>{Math.round(fit.score)}</span></div>
          <div className="mt-1 font-mono text-[8px] font-bold uppercase tracking-[.15em] text-muted">rank #{player.rank} / {player.position} / {fit.label}</div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/40 px-2 py-1 font-mono text-[7px] font-black uppercase tracking-[.12em]" style={{background:status.bg,color:status.tone}}>{status.label}</span>
            <span className="font-mono text-[7px] font-black uppercase tracking-[.12em] text-lo">{status.copy}</span>
          </div>
          <p className="mt-2 text-xs font-semibold leading-5 text-slate-600">{fit.pickContext}</p>
          <DraftFitBreakdown fit={fit} color={tier.color} compact />
          <div className="mt-2 space-y-1">{fit.reasons?.slice(0,3).map((reason,i)=><p key={i} className="text-xs font-semibold leading-5 text-muted">{reason}</p>)}</div>
          <div className="mt-2 flex flex-wrap gap-1.5">{fit.flags?.slice(0,3).map(flag => <span key={flag} className="rounded-full bg-white/45 px-2 py-1 font-mono text-[7px] font-black uppercase tracking-[.12em] text-muted">{flag}</span>)}</div>
        </div>
      </div>
      <button type="button" onClick={() => onPick(player.id)} className="mt-3 w-full rounded-full px-4 py-2 font-mono text-[8px] font-black uppercase tracking-[.16em] transition-transform hover:-translate-y-0.5" style={{ background: tier.color, color: 'white', boxShadow: '0 12px 24px ' + tier.glow }}>{index === 0 ? 'Selecionar melhor encaixe' : 'Selecionar'}</button>
    </motion.div>
  )
}
function DraftFilterChips({ active, setActive }) {
  return (
    <GlassPanel className="flex flex-wrap items-center gap-2 p-4">
      {FILTERS.map(([id, label]) => <button key={id} type="button" onClick={() => setActive(id)} className="rounded-full px-4 py-2 font-mono text-[9px] font-black uppercase tracking-[.16em] transition-transform hover:-translate-y-0.5" style={{ background: active === id ? '#eee9fb' : 'rgba(255,255,255,.36)', color: active === id ? '#5d46a3' : '#8b837c', boxShadow: active === id ? '3px 3px 8px #d4d0ca, -3px -3px 8px #fff' : 'none' }}>{label}</button>)}
    </GlassPanel>
  )
}

function DraftOrderMini({ picks, activePick = 1 }) {
  return (
    <GlassPanel className="p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="font-mono text-[9px] font-black uppercase tracking-[.24em] text-lo">Draft Order</div>
        <span className="rounded-full border border-white/30 bg-white/30 px-2.5 py-1 font-mono text-[7px] font-black uppercase tracking-[.14em] text-muted">pick #{activePick}</span>
      </div>
      <div className="space-y-2">{picks.slice(0, 14).map(p => {
        const active = p.pick === activePick
        return (
          <motion.div key={p.pick} whileHover={{ x: 4, scale: 1.01 }} className={(active?'bg-white/56 shadow-[0_12px_28px_rgba(124,92,207,.12)] ':'bg-white/30 ')+'flex items-center gap-3 rounded-2xl border border-white/20 px-3 py-2 transition-all'}>
            <span className="w-8 font-mono text-xs font-black" style={{ color: p.pick <= 4 ? '#7c5ccf' : '#5aaed6' }}>#{p.pick}</span>
            <TeamLogoGlass teamId={p.ownerAbbr} size={active ? 'md' : 'sm'} showGlow={active || p.pick <= 4} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold text-slate-700">{p.ownerName}</span>
              {active && <span className="block truncate font-mono text-[7px] font-black uppercase tracking-[.14em] text-lo">{getTeamPriorityLabel(p.ownerAbbr)}</span>}
            </span>
          </motion.div>
        )
      })}</div>
    </GlassPanel>
  )
}
function SideIntel({ prospects }) {
  return (
    <div className="grid gap-5">
      <GlassPanel className="p-5">
        <div className="mb-4 font-mono text-[9px] font-black uppercase tracking-[.24em] text-lo">Top Prospects</div>
        <p className="mb-4 text-xs font-semibold leading-5 text-muted">Melhores nomes disponíveis enquanto a ordem da loteria é revelada.</p>
        <div className="space-y-2">{prospects.map((p, index) => { const tier = getTierStyles(p.tier); return <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .04, duration: .25 }} whileHover={{ x: 4, scale: 1.01 }} className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/30 px-3 py-2 transition-all"><span className="w-8 font-mono text-xs font-black" style={{ color: tier.color }}>#{p.rank}</span><span className="min-w-0 flex-1 truncate text-sm font-bold text-slate-700">{p.name}</span><span className="rounded-full px-2 py-0.5 font-mono text-[7px] font-black" style={{ background: tier.bg, color: tier.text }}>{tier.label}</span></motion.div> })}</div>
      </GlassPanel>
    </div>
  )
}

function DraftSummary({ picks, resolvedPicks }) {
  const entries = Object.entries(picks).filter(([, v]) => v != null)
  if (entries.length === 0) return null
  return (
    <div className="mt-5">
      <div className="mb-2 font-mono text-[9px] font-black uppercase tracking-[.22em] text-lo">Resumo / {entries.length} picks</div>
      <div className="max-h-56 space-y-2 overflow-y-auto">{entries.map(([idx, prospectId]) => { const rp = resolvedPicks[parseInt(idx)]; const pickedP = prospects.find(p => p.id === prospectId); const tier = getTierStyles(pickedP?.tier); return <div key={idx} className="flex items-center gap-2 rounded-2xl bg-white/34 px-3 py-2"><span className="w-7 font-mono text-xs font-black" style={{ color: tier.color }}>{parseInt(idx) + 1}</span><span className="min-w-0 flex-1"><span className="block truncate font-mono text-[8px] text-muted">{rp?.ownerAbbr}</span><span className="block truncate text-xs font-bold text-slate-800">{pickedP?.name}</span></span></div> })}</div>
    </div>
  )
}

function DynamicTeamBackdrop({ team, intensity = .1 }) {
  const color = team?.ownerColor || '#7c5ccf'
  return (
    <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden" animate={{ opacity: 1 }}>
      <motion.span className="absolute -right-28 top-24 h-96 w-96 rounded-full blur-3xl" animate={{ backgroundColor: color, opacity: intensity }} transition={{ duration: .55 }} />
      <motion.span className="absolute -left-28 bottom-20 h-96 w-96 rounded-full bg-sky-100/50 blur-3xl" animate={{ opacity: intensity * 1.4 }} transition={{ duration: .55 }} />
    </motion.div>
  )
}

function WarRoomHeader({ owner, selecting }) {
  if (!owner) return null
  return (
    <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .38, ease: [0.22, 1, 0.36, 1] }} className="relative overflow-hidden rounded-[34px] border border-white/50 bg-white/36 p-5 backdrop-blur-xl" style={{ boxShadow: '0 20px 58px ' + (owner.ownerColor || '#7c5ccf') + '18' }}>
      <span className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full blur-3xl" style={{ background: owner.ownerColor || '#7c5ccf', opacity: .18 }} />
      <div className="relative flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <TeamLogoGlass teamId={owner.ownerAbbr} size="lg" showGlow />
          <div>
            <div className="font-mono text-[9px] font-black uppercase tracking-[.26em] text-lo">War Room</div>
            <h2 className="mt-1 font-display text-4xl font-black tracking-tight text-slate-800">Pick #{(selecting ?? 0) + 1} / {owner.ownerName} is on the clock</h2>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/40 bg-white/30 px-4 py-2 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full" style={{ background: owner.ownerColor || '#7c5ccf', boxShadow: '0 0 16px ' + (owner.ownerColor || '#7c5ccf') }} />
          <span className="font-mono text-[9px] font-black uppercase tracking-[.18em] text-muted">Decision window</span>
        </div>
      </div>
    </motion.div>
  )
}

function PickCinematicOverlay({ overlay }) {
  return (
    <AnimatePresence>
      {overlay && <motion.div {...motionPresets.overlayConfirm} className="fixed inset-0 z-[80] flex items-center justify-center bg-[#edeae4]/55 p-6 backdrop-blur-xl">
        <DynamicTeamBackdrop team={overlay.team} intensity={.18} />
        {overlay.stage === 'confirm' ? <PickConfirmScene overlay={overlay} /> : <NextPickScene overlay={overlay} />}
      </motion.div>}
    </AnimatePresence>
  )
}

function PickConfirmScene({ overlay }) {
  const prospect = overlay.prospect
  const team = overlay.team
  const tier = getTierStyles(prospect?.tier)
  const image = prospect ? getPlayerCutoutImage(prospect) : null
  return (
    <motion.div {...motionPresets.heroReveal} className="relative z-10 w-full max-w-5xl overflow-hidden rounded-[42px] border border-white/55 bg-white/45 p-8 text-center shadow-[0_30px_90px_rgba(0,0,0,.12)] backdrop-blur-2xl">
      <span className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl" style={{ background: team?.ownerColor || '#7c5ccf', opacity: .18 }} />
      <div className="relative font-mono text-[10px] font-black uppercase tracking-[.32em] text-lo">Pick #{overlay.pickNo}</div>
      <div className="relative mt-3 flex flex-wrap items-center justify-center gap-5"><TeamLogoGlass teamId={team?.ownerAbbr} size="xl" showGlow />{image && <div className="flex h-44 w-44 items-end justify-center overflow-visible rounded-[34px]"><img src={image} alt={prospect.name} className="player-cutout player-profile-cutout h-full w-full object-contain object-bottom" draggable="false" /></div>}</div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .18 }} className="relative mt-5 font-mono text-[10px] font-black uppercase tracking-[.24em]" style={{ color: team?.ownerColor || '#7c5ccf' }}>{team?.ownerName} seleciona</motion.div>
      <motion.h2 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .28 }} className="relative mt-2 font-display text-7xl font-black leading-none tracking-tight text-slate-800">{prospect?.name || 'Pick confirmado'}</motion.h2>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .4 }} className="relative mt-5 flex flex-wrap justify-center gap-2"><span className="rounded-full bg-white/45 px-4 py-2 font-mono text-[9px] font-black uppercase tracking-[.16em] text-muted">{prospect?.position || '-'}</span><span className="rounded-full px-4 py-2 font-mono text-[9px] font-black uppercase tracking-[.16em]" style={{ background: tier.bg, color: tier.text }}>{tier.label}</span><span className="rounded-full bg-white/45 px-4 py-2 font-mono text-[9px] font-black uppercase tracking-[.16em] text-muted">{prospect?.team || '-'}</span></motion.div>
    </motion.div>
  )
}

function NextPickScene({ overlay }) {
  const team = overlay.team
  return (
    <motion.div {...motionPresets.heroReveal} className="relative z-10 w-full max-w-3xl overflow-hidden rounded-[38px] border border-white/55 bg-white/45 p-8 text-center shadow-[0_30px_90px_rgba(0,0,0,.10)] backdrop-blur-2xl">
      <div className="font-mono text-[10px] font-black uppercase tracking-[.32em] text-lo">Next on the clock</div>
      <div className="mt-5 flex justify-center"><TeamLogoGlass teamId={team?.ownerAbbr} size="xl" showGlow /></div>
      <div className="mt-5 font-display text-6xl font-black text-slate-800">Pick #{overlay.pickNo}</div>
      <div className="mt-2 font-display text-4xl font-black" style={{ color: team?.ownerColor || '#7c5ccf' }}>{team?.ownerName}</div>
    </motion.div>
  )
}

function PickConfirmationToast({ toast }) {
  return <AnimatePresence>{toast && <motion.div initial={{ opacity: 0, y: 18, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: .96 }} transition={{ duration: .26, ease: [0.22, 1, 0.36, 1] }} className="fixed bottom-7 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/70 bg-white/75 px-6 py-3 font-mono text-[10px] font-black uppercase tracking-[.18em] text-slate-700 shadow-[0_18px_40px_rgba(0,0,0,.10)] backdrop-blur-xl">
    Pick #{toast.pick} confirmado / {toast.name}
    {toast.team && <span className="ml-2 text-[#7c5ccf]">Selected by {toast.team}</span>}
  </motion.div>}</AnimatePresence>
}

function getDraftRows(picks, resolvedPicks) {
  return resolvedPicks.slice(0, TOTAL_PICKS).map((pick, idx) => {
    const prospect = prospects.find(p => p.id === picks[idx]) || null
    return { pickNo: idx + 1, pick, prospect }
  })
}

function getValueDelta(row) {
  if (!row?.prospect?.rank) return 0
  return row.pickNo - row.prospect.rank
}

function getTeamDraftGrade(rows) {
  if (!rows.length) return 'C'
  const totalValue = rows.reduce((sum, row) => sum + getValueDelta(row), 0)
  const bestPick = Math.max(...rows.map(row => getValueDelta(row)))
  const avg = totalValue / rows.length
  if (avg >= 12 || bestPick >= 18) return 'A+'
  if (avg >= 6 || bestPick >= 12) return 'A'
  if (avg >= 0) return 'B+'
  if (avg >= -6) return 'B'
  return 'C'
}

function getDraftInsights(rows) {
  const picked = rows.filter(row => row.prospect)
  const steal = picked.filter(row => getValueDelta(row) >= 6).sort((a, b) => getValueDelta(b) - getValueDelta(a))[0]
  const reach = picked.filter(row => getValueDelta(row) <= -6).sort((a, b) => getValueDelta(a) - getValueDelta(b))[0]
  const teamGroups = groupDraftByTeam(picked)
  const bestTeam = teamGroups.slice().sort((a, b) => {
    const av = a.rows.reduce((sum, row) => sum + getValueDelta(row), 0)
    const bv = b.rows.reduce((sum, row) => sum + getValueDelta(row), 0)
    return bv - av
  })[0]

  return [
    {
      title: 'Melhor pick',
      main: picked[0]?.prospect?.name || '-',
      detail: picked[0] ? picked[0].pick.ownerName + ' abriu o draft com o prospecto de maior impacto imediato.' : 'Complete o draft para gerar este insight.',
      color: '#7c5ccf',
    },
    {
      title: 'Steal of the Draft',
      main: steal?.prospect?.name || '-',
      detail: steal ? 'Caiu ' + getValueDelta(steal) + ' posições: saiu apenas na #' + steal.pickNo + ' mesmo projetado como #' + steal.prospect.rank + ', gerando valor real para ' + steal.pick.ownerName + '.' : 'Nenhum jogador caiu pelo menos 6 posições em relação ao board.' ,
      color: '#4f9577',
    },
    {
      title: 'Reach monitorado',
      main: reach?.prospect?.name || '-',
      detail: reach ? 'Saiu ' + Math.abs(getValueDelta(reach)) + ' posições antes do projetado: pick #' + reach.pickNo + ' para um jogador ranqueado como #' + reach.prospect.rank + '.' : 'Nenhuma escolha ficou 6+ posições acima do board.' ,
      color: '#d96f7d',
    },
    {
      title: 'Melhor war room',
      main: bestTeam?.team || '-',
      detail: bestTeam ? 'Nota ' + getTeamDraftGrade(bestTeam.rows) + ' combinando valor de board e qualidade das escolhas.' : 'Sem dados suficientes.',
      color: '#5aaed6',
    },
  ]
}

function groupDraftByTeam(rows) {
  const map = new Map()
  rows.forEach(row => {
    const key = row.pick.ownerAbbr || row.pick.ownerName
    if (!map.has(key)) map.set(key, { key, team: row.pick.ownerName, color: row.pick.ownerColor, rows: [] })
    map.get(key).rows.push(row)
  })
  return Array.from(map.values()).sort((a, b) => a.rows[0].pickNo - b.rows[0].pickNo)
}

function DraftResultsScreen({ picks, resolvedPicks, onReset, onHome }) {
  const rows = getDraftRows(picks, resolvedPicks)
  const first = rows[0]
  const firstTier = getTierStyles(first?.prospect?.tier)
  const insights = getDraftInsights(rows)
  return (
    <motion.section initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55, ease: 'easeOut' }} className="mx-auto max-w-7xl space-y-6">
      <GlassPanel className="relative overflow-hidden p-8 text-center" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(124,92,207,.18), transparent 36%), linear-gradient(145deg, rgba(255,255,255,.66), rgba(238,233,251,.52))' }}>
        <div className="absolute left-8 top-8 rounded-full bg-white/45 px-4 py-2 font-mono text-[9px] font-black uppercase tracking-[.2em] text-muted">Draft Results</div>
        <div className="font-mono text-[10px] font-black uppercase tracking-[.28em]" style={{ color: firstTier.color }}>Pick #1</div>
        <h1 className="mt-3 font-display text-5xl font-black tracking-tight text-slate-800 md:text-7xl">Draft Finalizado</h1>
        <div className="mx-auto mt-6 max-w-3xl rounded-[34px] border border-white/65 bg-white/45 p-6 shadow-[0_18px_50px_rgb(0,0,0,0.05)] backdrop-blur-xl">
          <div className="font-mono text-[10px] font-black uppercase tracking-[.22em] text-muted">{first?.pick?.ownerName || '-'}</div>
          <div className="mt-2 font-display text-4xl font-black tracking-tight text-slate-800">{first?.prospect?.name || 'Pick nao registrado'}</div>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-full px-4 py-1.5 font-mono text-[9px] font-black uppercase tracking-[.16em]" style={{ background: firstTier.bg, color: firstTier.text }}>{firstTier.label}</span>
            <span className="rounded-full bg-white/55 px-4 py-1.5 font-mono text-[9px] font-black uppercase tracking-[.16em] text-muted">{first?.prospect?.position || '-'}</span>
            <span className="rounded-full bg-white/55 px-4 py-1.5 font-mono text-[9px] font-black uppercase tracking-[.16em] text-muted">{first?.prospect?.team || '-'}</span>
          </div>
        </div>
      </GlassPanel>

      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12, duration: .45 }} className="grid gap-4 md:grid-cols-4">
        {insights.map(item => <DraftInsightCard key={item.title} {...item} />)}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2, duration: .45 }}>
        <DraftPickList rows={rows} />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .28, duration: .45 }}>
        <GlassPanel className="p-5">
          <div className="mb-4 font-mono text-[9px] font-black uppercase tracking-[.24em] text-lo">Acoes finais</div>
          <div className="grid gap-3 sm:grid-cols-3">
            <PremiumButton onClick={onReset} color="#7c5ccf" strong>Simular novamente</PremiumButton>
            <PremiumButton onClick={onHome} color="#5aaed6">Voltar ao inicio</PremiumButton>
            <button type="button" onClick={() => navigator?.clipboard?.writeText('Meu Mock Draft 2026 foi finalizado no Rookies Brasil.')} className="rounded-full bg-white/44 px-6 py-3 font-mono text-[10px] font-black uppercase tracking-[.18em] text-muted transition-transform hover:-translate-y-0.5">Compartilhar resultado</button>
          </div>
        </GlassPanel>
      </motion.div>
    </motion.section>
  )
}

function DraftPickList({ rows }) {
  const teamGrades = groupDraftByTeam(rows.filter(row => row.prospect)).reduce((acc, team) => {
    acc[team.key] = getTeamDraftGrade(team.rows)
    return acc
  }, {})

  return (
    <GlassPanel className="p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="font-mono text-[9px] font-black uppercase tracking-[.24em] text-lo">Lista completa do draft</div>
          <div className="mt-1 text-sm font-semibold text-muted">Cada escolha ja traz a nota simples do time baseada no valor do board.</div>
        </div>
        <div className="rounded-full bg-white/45 px-3 py-1 font-mono text-[8px] font-black uppercase tracking-[.14em] text-muted">30 picks</div>
      </div>
      <div className="space-y-2">
        {rows.map(row => {
          const tier = getTierStyles(row.prospect?.tier)
          const band = row.pickNo <= 5 ? 'rgba(124,92,207,.12)' : row.pickNo <= 14 ? 'rgba(90,174,214,.10)' : 'rgba(255,255,255,.28)'
          const grade = teamGrades[row.pick.ownerAbbr || row.pick.ownerName] || 'C'
          return (
            <motion.div key={row.pickNo} whileHover={{ x: 4, scale: 1.006 }} className="grid items-center gap-3 rounded-[24px] border border-white/45 px-4 py-3 transition-all md:grid-cols-[64px_48px_1fr_1.15fr_92px_76px]" style={{ background: band }}>
              <div className="font-numeric text-2xl font-extrabold tracking-tight" style={{ color: row.pickNo <= 5 ? '#7c5ccf' : '#4f86ad' }}>#{row.pickNo}</div>
              <TeamLogoGlass teamId={row.pick.ownerAbbr} size="md" showGlow={row.pickNo <= 14} />
              <div className="min-w-0"><div className="truncate text-sm font-black text-slate-800">{row.pick.ownerName}</div><div className="mt-0.5 font-mono text-[8px] font-bold uppercase tracking-[.16em] text-muted">{row.pick.viaAbbr ? 'via ' + row.pick.viaAbbr : row.pick.originalTeam?.record || 'First round'}</div></div>
              <div className="min-w-0"><div className="truncate text-sm font-black text-slate-800">{row.prospect?.name || 'Sem escolha'}</div><div className="mt-0.5 font-mono text-[8px] font-bold uppercase tracking-[.16em] text-muted">{row.prospect?.position || '-'} / rank #{row.prospect?.rank || '-'}</div></div>
              <div className="justify-self-start rounded-full px-3 py-1 font-mono text-[8px] font-black uppercase tracking-[.13em] md:justify-self-end" style={{ background: tier.bg, color: tier.text }}>{tier.label}</div>
              <div className="justify-self-start rounded-full bg-white/50 px-3 py-1 font-mono text-[8px] font-black uppercase tracking-[.13em] text-slate-700 md:justify-self-end">Nota {grade}</div>
            </motion.div>
          )
        })}
      </div>
    </GlassPanel>
  )
}

function DraftInsightCard({ title, main, detail, color }) {
  return (
    <GlassPanel className="p-5">
      <div className="h-1.5 w-12 rounded-full" style={{ background: color }} />
      <div className="mt-4 font-mono text-[9px] font-black uppercase tracking-[.2em] text-lo">{title}</div>
      <div className="mt-2 min-h-[56px] font-display text-2xl font-black leading-tight text-slate-800">{main}</div>
      <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{detail}</p>
    </GlassPanel>
  )
}

function TeamDraftSummaryCard({ team, color, rows }) {
  const best = rows.slice().sort((a, b) => (a.prospect?.rank || 99) - (b.prospect?.rank || 99))[0]
  const grade = getTeamDraftGrade(rows)
  return (
    <div className="rounded-[24px] border border-white/45 bg-white/34 p-4 transition-all hover:bg-white/50">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0"><div className="truncate text-sm font-black text-slate-800">{team}</div><div className="mt-1 font-mono text-[8px] font-bold uppercase tracking-[.16em] text-muted">{rows.map(r => '#' + r.pickNo).join(' / ')}</div></div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full font-numeric text-xl font-extrabold tracking-tight" style={{ color, background: color + '18' }}>{grade}</div>
      </div>
      <div className="mt-3 rounded-2xl bg-white/35 px-3 py-2"><div className="font-mono text-[8px] font-black uppercase tracking-[.16em] text-lo">Melhor jogador</div><div className="mt-1 text-sm font-black text-slate-700">{best?.prospect?.name || '-'}</div></div>
    </div>
  )
}

function HeroMeta({ label, value, color }) { return <div className="rounded-2xl bg-white/35 px-3 py-3 text-center"><div className="font-mono text-[9px] font-black uppercase tracking-[.18em] text-lo">{label}</div><div className="mt-1 font-mono text-sm font-black" style={{ color }}>{value || '-'}</div></div> }
function AttributeBar({ label, value, color, featured = false }) { return <div><div className="mb-2 flex justify-between font-mono font-black uppercase tracking-[.14em]"><span className={featured ? 'text-[10px] text-slate-700' : 'text-[8px] text-lo'}>{label}</span><span className={featured ? 'text-[11px] text-slate-800' : 'text-[9px] text-slate-600'}>{Math.round(value)}</span></div><div className={(featured ? 'h-3.5' : 'h-2.5') + ' overflow-hidden rounded-full bg-white/50 shadow-inner'}><motion.div initial={{ width: 0 }} animate={{ width: clamp(value) + '%' }} transition={{ duration: .75, ease: [0.22, 1, 0.36, 1] }} className="h-full rounded-full" style={{ background: color, opacity: featured ? 1 : .72 }} /></div></div> }
function InfoLine({ label, value, accent }) { return <div className="flex items-center justify-between rounded-2xl bg-white/32 px-3 py-2"><span className="font-mono text-[9px] font-black uppercase tracking-[.16em] text-lo">{label}</span><span className="font-mono text-xs font-black" style={{ color: accent || '#3f3a36' }}>{value}</span></div> }
function MovementBadge({ movement }) { return <span className="rounded-full px-3 py-1 font-mono text-[9px] font-black uppercase tracking-[.14em]" style={{ background: movement.tone + '18', color: movement.tone }}>{movement.label}</span> }
function GlassPanel({ children, className = '', style }) { return <div className={'rounded-[34px] border border-white/60 bg-white/48 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl ' + className} style={style}>{children}</div> }
function PremiumButton({ onClick, color, children, strong }) { return <button onClick={onClick} className="rounded-full px-6 py-3 font-mono text-[10px] font-black uppercase tracking-[.18em] transition-transform hover:-translate-y-0.5 active:scale-95" style={{ background: '#edeae4', color, fontWeight: strong ? 900 : 700, boxShadow: '5px 5px 13px #d4d0ca, -5px -5px 13px #ffffff, inset 0 0 0 1px ' + color + '33' }}>{children}</button> }
function StatusPill({ children }) { return <div className="rounded-full bg-white/44 px-4 py-2 font-mono text-[10px] font-black uppercase tracking-[.18em] text-muted backdrop-blur-md">{children}</div> }
function Skeleton({ w = '75%' }) { return <div className="h-2 rounded-full" style={{ width: w, background: '#d8d4ce', animation: 'pulse 1.5s ease infinite' }} /> }






