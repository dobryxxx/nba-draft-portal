import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { toPng } from 'html-to-image'
import { prospects, PICKS_15_30 } from '../data/prospects'
import { getPlayerCutoutImage } from '../utils/playerImages'
import TeamLogoGlass from '../components/TeamLogoGlass'
import { getTeamLogo } from '../utils/teamAssets.js'
import { getDraftFitStatus } from '../components/DraftFitBreakdown'
import { AttributeBar, GlassPanel, InfoLine, MovementBadge, PremiumButton, Skeleton, StatusPill } from '../components/mockDraft/MockDraftPrimitives.jsx'
import { getTeamProfile } from '../data/teamProfiles.js'
import { getManualRosterOverride, hasManualRosterOverride, normalizeManualRosterOverride, sortRosterPlayersByStatus } from '../data/manualRosterOverrides.ts'
import { getTeamPicks } from '../utils/draftPickAdapter.js'
import { calculateBestFitForTeam, getBestFitColor } from '../utils/bestFitAlgorithm'
import { calculateDraftDecision, getDraftDecisionAudit, rankAvailablePlayersForTeam } from '../utils/draftDecisionAlgorithm.ts'
import { analyzeRosterContext } from '../utils/rosterContextAlgorithm.ts'
import {
  FILTERS,
  PHASE,
  TOTAL_PICKS,
  TRADE_MAP_LABELS,
  applyTradeRules,
  buildProjectedLotteryPicks,
  clamp,
  filterProspects,
  getBiggestDrop,
  getBiggestWinner,
  getDraftContextBullets,
  getFitScore,
  getLotteryMovement,
  getPlayerDecisionMeta,
  getProspectListBadge,
  getSceneFromState,
  getTeamDecisionContext,
  getTeamDraftFit,
  getTeamNeedChips,
  getTeamPriorityLabel,
  getTeamTimelineLabel,
  getTierStyles,
  getTopMetrics,
  getWarRoomAttributes,
  initials,
  motionPresets,
  runLottery,
  sortProspectsForMode,
  teamById,
} from '../utils/mockDraftLogic.js'
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
  const [pickNotes, setPickNotes] = useState({})
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
    setRevealed([])
    setPicks({})
    setPickNotes({})
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
    setRevealed(Array.from({ length: 14 }, (_, i) => i))
    setPhase(PHASE.DONE)
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
    const next = pickIdx + 1
    const displayMs = next < TOTAL_PICKS ? 1720 : 1820

    setIsSelecting(true)
    setPreviewId(null)
    setPickOverlay({ stage: 'confirm', pickNo: pickIdx + 1, team: selectedPick, nextTeam: nextPick, prospect: picked })
    setToast(null)

    setTimeout(() => {
      setPickOverlay(null)
    }, displayMs)

    setTimeout(() => {
      setPicks(prev => ({ ...prev, [pickIdx]: prospectId }))
      setIsSelecting(false)
      if (next < TOTAL_PICKS) {
        setSelecting(next)
        setPreviewId(null)
      } else {
        setSelecting(null)
        setPreviewId(null)
        setDraftFinished(true)
      }
    }, displayMs + 260)
  }

  const resetAll = () => {
    clearLotteryTimers()
    setPhase(PHASE.IDLE)
    setLotteryOrder([])
    setResolved([])
    setPicks({})
    setPickNotes({})
    setSelecting(null)
    setRevealed([])
    setPreviewId(null)
    setToast(null)
    setDraftFinished(false)
    setSelectedLotteryPick(1)
  }

  const draftedIds = useMemo(() => Object.values(picks).filter(Boolean), [picks])
  const draftedIdSet = useMemo(() => new Set(draftedIds), [draftedIds])
  const available = useMemo(
    () => prospects
      .filter(p => !draftedIdSet.has(p.id))
      .sort((a, b) => Number(a.rank || 999) - Number(b.rank || 999)),
    [draftedIdSet],
  )
  const currentOwner = useMemo(
    () => selecting !== null && resolvedPicks[selecting] ? resolvedPicks[selecting] : null,
    [resolvedPicks, selecting],
  )
  const filteredPool = useMemo(() => filterProspects(available, filter), [available, filter])
  const filteredAvailable = useMemo(
    () => sortProspectsForMode(filteredPool, filter, currentOwner, resolvedPicks),
    [filteredPool, filter, currentOwner, resolvedPicks],
  )
  const selectedProspect = useMemo(
    () => available.find(p => p.id === previewId) || filteredAvailable[0] || available[0],
    [available, filteredAvailable, previewId],
  )
  const setSafePreviewId = useCallback((id) => {
    if (!id) {
      setPreviewId(null)
      return
    }
    setPreviewId(available.some(p => p.id === id) ? id : null)
  }, [available])

  useEffect(() => {
    if (previewId && !available.some(p => p.id === previewId)) setPreviewId(null)
  }, [available, previewId])
  const activeScene = getSceneFromState(phase, draftFinished)
  const backdropTeam = pickOverlay?.team || currentOwner || resolvedPicks[0] || null

  return (
    <div className="mock-draft-root relative min-h-full overflow-hidden bg-[#edeae4]">
      <DynamicTeamBackdrop team={backdropTeam} intensity={phase === PHASE.DRAFTING || pickOverlay ? .14 : .08} />
      <header className="mock-draft-header sticky top-0 z-40 border-b border-white/60 bg-white/55 px-5 py-3 shadow-[0_4px_30px_rgb(0,0,0,0.05)] backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="font-display text-2xl font-black tracking-tight text-slate-800">Mock Draft Simulator</div>
            <div className="mt-0.5 font-mono text-[9px] font-bold uppercase tracking-[.22em] text-muted">NBA Draft 2026 / Ordem definida / War Room Mode</div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {phase !== PHASE.IDLE && <PremiumButton onClick={resetAll} color="#a09891">Reset</PremiumButton>}
            {phase === PHASE.IDLE && <PremiumButton onClick={runSimulation} color="#7c5ccf" strong>Carregar ordem oficial</PremiumButton>}
            {phase === PHASE.DONE && <PremiumButton onClick={startDrafting} color="#4f9577" strong>Seguir para o Draft</PremiumButton>}
            {draftFinished && <StatusPill>Draft finalizado</StatusPill>}
            {!draftFinished && phase === PHASE.DRAFTING && <StatusPill>{selecting !== null ? 'Pick ' + (selecting + 1) + ' / ' + TOTAL_PICKS : 'Draft concluido'}</StatusPill>}
            {!draftFinished && phase === PHASE.DRAFTING && <StatusPill>Decision Window</StatusPill>}
          </div>
        </div>
      </header>

      <main className="relative z-10 p-4 3xl:p-5">
        <AnimatePresence mode="wait">
          <motion.div key={activeScene} {...motionPresets.page}>
            {draftFinished ? (
              <DraftResultsScreen picks={picks} resolvedPicks={resolvedPicks} pickNotes={pickNotes} onReset={resetAll} onHome={resetAll} />
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
                    setPreviewId={setSafePreviewId}
                    onPick={id => assignPick(selecting, id)}
                    pickNotes={pickNotes}
                    setPickNotes={setPickNotes}
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
    <section className="grid gap-4 3xl:gap-5 xl:grid-cols-[minmax(0,1.18fr)_300px] 3xl:grid-cols-[minmax(0,1.35fr)_350px]">
      <GlassPanel className="relative min-h-[500px] overflow-hidden p-4 2xl:p-5 3xl:min-h-[620px] 3xl:p-6">
        <span className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-200/35 blur-3xl" />
        <span className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-cyan-100/45 blur-3xl" />
        <div className="relative grid min-h-[440px] gap-4 3xl:min-h-[560px] 3xl:gap-6 xl:grid-cols-[minmax(0,1fr)_320px] 3xl:grid-cols-[minmax(0,1fr)_370px]">
          <div className="flex flex-col justify-center">
            <motion.div initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: .55, ease: [0.22, 1, 0.36, 1] }}>
              <div className="font-mono text-[10px] font-black uppercase tracking-[.32em] text-[#7c5ccf]">Draft Order Locked</div>
              <h2 className="mt-3 max-w-3xl font-display text-4xl font-black 2xl:text-5xl 3xl:text-6xl leading-[.94] tracking-tight text-slate-800">A loteria está definida. Agora começa a War Room.</h2>
              <p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-muted">A ordem oficial das 14 primeiras escolhas já está travada, incluindo Clippers via Pacers, Hawks via Pelicans e Thunder via Clippers.</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <PremiumButton onClick={onRun} color="#7c5ccf" strong>Carregar ordem oficial</PremiumButton>
                <span className="rounded-full border border-white/35 bg-white/30 px-4 py-2 font-mono text-[9px] font-black uppercase tracking-[.16em] text-muted backdrop-blur-md">14 picks definidas</span>
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
                    className="mock-lottery-team-card flex h-[108px] 3xl:h-[126px] min-w-0 flex-col items-center justify-center rounded-[24px] border border-white/30 bg-white/25 p-3 text-center backdrop-blur-md transition-colors"
                    style={{
                      boxShadow: active ? '0 16px 34px ' + pick.ownerColor + '22, inset 0 0 0 1px rgba(255,255,255,.65)' : '0 8px 22px rgba(0,0,0,.035)',
                      background: active ? 'rgba(255,255,255,.44)' : 'rgba(255,255,255,.25)'
                    }}
                  >
                    <TeamLogoGlass teamId={pick.ownerAbbr} size="lg" showGlow={active || index < 4} className="mock-lottery-team-logo" />
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
function ProjectedPickHero({ pick, onRun }) {
  return (
    <motion.div whileHover={{ y: -3, scale: 1.01 }} className="relative flex min-h-[340px] w-full flex-col justify-center overflow-hidden rounded-[32px] border border-white/45 bg-white/30 p-5 text-center backdrop-blur-xl" style={{ boxShadow: '0 18px 48px ' + (pick?.ownerColor || '#7c5ccf') + '20' }}>
      <span className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full blur-3xl" style={{ background: pick?.ownerColor || '#7c5ccf', opacity: .18 }} />
      <div className="relative font-mono text-[8px] font-black uppercase tracking-[.24em] text-lo">Official #1 Pick</div>
      <div className="relative mt-3 flex justify-center"><TeamLogoGlass teamId={pick?.ownerAbbr} size="xl" showGlow /></div>
      <div className="relative mt-3 font-display text-3xl font-black 3xl:text-4xl leading-none" style={{ color: pick?.ownerColor || '#7c5ccf' }}>#{pick?.pick}</div>
      <div className="relative mx-auto mt-2 flex h-16 max-w-[300px] items-center justify-center text-balance font-display text-2xl font-black leading-tight text-slate-800">{pick?.ownerName}</div>
      <div className="relative mt-3 flex flex-wrap justify-center gap-2">
        <span className="rounded-full border border-white/35 bg-white/35 px-3 py-1 font-mono text-[8px] font-black uppercase tracking-[.14em] text-muted">{getTeamTimelineLabel(pick?.ownerAbbr)}</span>
        <span className="rounded-full border border-white/35 bg-white/35 px-3 py-1 font-mono text-[8px] font-black uppercase tracking-[.14em] text-muted">{getTeamPriorityLabel(pick?.ownerAbbr)}</span>
      </div>
      <button type="button" onClick={onRun} className="relative mt-4 rounded-full px-5 py-2.5 font-mono text-[9px] font-black uppercase tracking-[.18em] text-white transition-transform hover:-translate-y-0.5 active:scale-95" style={{ background: pick?.ownerColor || '#7c5ccf', boxShadow: '0 14px 30px ' + (pick?.ownerColor || '#7c5ccf') + '30' }}>Ver ordem oficial</button>
    </motion.div>
  )
}

function DraftOrderStrip({ picks, activePick = 1, onSelect = () => {} }) {
  return (
    <section className="relative -mx-2 overflow-hidden rounded-[30px] border border-white/35 bg-white/20 p-3 backdrop-blur-md">
      <div className="mb-3 flex items-center justify-between gap-3 px-2">
        <div>
          <div className="font-mono text-[9px] font-black uppercase tracking-[.26em] text-lo">Ordem oficial da loteria</div>
          <div className="mt-1 text-xs font-semibold text-muted">Clique em uma pick para destacar o contexto antes do draft.</div>
        </div>
        <span className="hidden rounded-full border border-white/30 bg-white/30 px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[.16em] text-muted sm:inline-flex">Picks #1-#14</span>
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
                  <div className="truncate font-mono text-[7px] font-black uppercase tracking-[.14em] text-lo">{top4 ? 'Top 4 definido' : 'Loteria'}</div>
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
    <section className="grid gap-4 3xl:gap-5 xl:grid-cols-[minmax(0,1.18fr)_300px] 3xl:grid-cols-[minmax(0,1.35fr)_350px]">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45, ease: [0.22, 1, 0.36, 1] }}>
        <GlassPanel className="relative min-h-[560px] overflow-hidden p-5 3xl:min-h-[680px] 3xl:p-7">
          <span className="pointer-events-none absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-violet-200/35 blur-3xl" />
          <div className="relative mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="font-mono text-[10px] font-black uppercase tracking-[.32em] text-[#7c5ccf]">Live Reveal</div>
              <h2 className="mt-2 font-display text-4xl font-black 3xl:text-5xl tracking-tight text-slate-800">Lottery Reveal</h2>
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
                      <div className="mt-1 font-display text-3xl font-black 3xl:text-4xl text-slate-800">Pick #{currentPick.pick}</div>
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
      <div className="relative mt-4 font-display text-5xl font-black 3xl:text-7xl leading-none text-slate-800">#{pick?.pick}</div>
      <div className="relative mt-3 font-display text-3xl font-black 3xl:text-4xl" style={{ color: pick?.ownerColor }}>{pick?.ownerName}</div>
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
    <section className="grid gap-4 3xl:gap-5 xl:grid-cols-[minmax(0,1.18fr)_300px] 3xl:grid-cols-[minmax(0,1.35fr)_350px]">
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
          <ResultSpot title="Maior salto" pick={winner} />
          <ResultSpot title="Maior queda" pick={drop} />
          <div className="rounded-[28px] border border-white/60 bg-white/38 p-5 backdrop-blur-md">
            <div className="font-mono text-[9px] font-black uppercase tracking-[.22em] text-lo">Sem movimento</div>
            <div className="mt-3 font-display text-3xl font-black 3xl:text-4xl text-slate-800">{flat.length}</div>
            <p className="mt-2 text-xs font-semibold leading-5 text-muted">Times mantidos na posição projetada.</p>
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

function getWarRoomBestFit(owner, prospect, resolvedPicks) {
  if (!owner?.ownerAbbr || !prospect) return null
  const profile = getTeamProfile(owner.ownerAbbr)
  if (!profile) return null
  try {
    return calculateBestFitForTeam(prospect, profile, getTeamPicks(owner.ownerAbbr, resolvedPicks || []))
  } catch {
    return null
  }
}

function getWarRoomRecommendations(owner, available, resolvedPicks, limit = 3) {
  if (!owner?.ownerAbbr || !available?.length) return []
  const pickNo = Number(owner.pick || 30)
  const tierValue = player => ({ ELITE: 100, LOTTERY: 86, ALL_STAR: 82, MID_1ST: 68, STARTER: 64, FRINGE: 56, SLEEPER: 42 }[player?.tier] || 50)
  const boardValue = player => {
    const rank = Number(player?.rank || 60)
    const rankScore = Math.max(0, 100 - Math.max(0, rank - pickNo) * (pickNo <= 4 ? 13 : pickNo <= 10 ? 8 : 4))
    return Math.round(rankScore * .58 + tierValue(player) * .42)
  }
  const rows = available
    .map(player => ({ player, fit: getWarRoomBestFit(owner, player, resolvedPicks) }))
    .filter(item => item.fit)
    .sort((a, b) => {
      const av = boardValue(a.player)
      const bv = boardValue(b.player)
      const aScore = a.fit.score * (pickNo <= 10 ? .58 : .72) + av * (pickNo <= 10 ? .42 : .28)
      const bScore = b.fit.score * (pickNo <= 10 ? .58 : .72) + bv * (pickNo <= 10 ? .42 : .28)
      const realism = Number(b.fit.isRealistic) - Number(a.fit.isRealistic)
      return realism || bScore - aScore || a.player.rank - b.player.rank
    })
  const realistic = rows.filter(item => {
    if (!item.fit.isRealistic) return false
    if (pickNo <= 4) return item.player.rank <= 8 || ['ELITE', 'LOTTERY', 'ALL_STAR'].includes(item.player.tier)
    if (pickNo <= 10) return item.player.rank <= 16 || ['ELITE', 'LOTTERY', 'ALL_STAR'].includes(item.player.tier)
    return true
  })
  return (realistic.length >= limit ? realistic : rows).slice(0, limit)
}

function getDraftDecisionColor(scoreOrGrade) {
  const value = typeof scoreOrGrade === 'number' ? scoreOrGrade : 0
  const grade = typeof scoreOrGrade === 'string' ? scoreOrGrade : ''
  if (value >= 90 || grade === 'Ideal Decision') return '#4f9577'
  if (value >= 80 || grade === 'Strong Decision') return '#7c5ccf'
  if (value >= 70 || grade === 'Good Decision') return '#5aaed6'
  if (value >= 60 || grade === 'Acceptable Decision') return '#5ab6c8'
  if (value >= 50 || grade === 'Situational Decision') return '#c9a941'
  if (value >= 40 || grade === 'Risky Decision') return '#d88754'
  return '#d96f7d'
}

function getWarRoomDraftDecision(owner, prospect, available) {
  if (!owner?.ownerAbbr || !prospect) return null
  try {
    return calculateDraftDecision({
      player: prospect,
      teamId: owner.ownerAbbr,
      currentPick: Number(owner.pick || 30),
      availablePlayers: available || [],
    })
  } catch {
    return null
  }
}

function getWarRoomDecisionRecommendations(owner, available, limit = 3) {
  if (!owner?.ownerAbbr || !available?.length) return []
  try {
    const pickNo = Number(owner.pick || 30)
    const boardWindow = getDecisionBoardWindow(available, pickNo, limit)
    const ranked = rankAvailablePlayersForTeam(boardWindow, owner.ownerAbbr, pickNo, { limit })
    return ranked?.length ? ranked : getFallbackRecommendations(owner, available, limit)
  } catch {
    return getFallbackRecommendations(owner, available, limit)
  }
}

function getDecisionBoardWindow(available, pickNo, limit = 3) {
  const buffer = pickNo <= 4 ? 24 : pickNo <= 14 ? 34 : 44
  const minSize = Math.max(limit * 8, 18)
  return [...(available || [])]
    .sort((a, b) => Number(a?.rank || 999) - Number(b?.rank || 999))
    .filter(player => Number(player?.rank || 999) <= pickNo + buffer)
    .slice(0, Math.max(minSize, 36))
}

function getFallbackRecommendations(owner, available, limit = 3) {
  const pickNo = Number(owner?.pick || 30)
  return [...(available || [])]
    .sort((a, b) => Number(a?.rank || 99) - Number(b?.rank || 99))
    .slice(0, limit)
    .map(player => ({
      player,
      decision: getWarRoomDraftDecision(owner, player, available) || {
        score: Math.max(45, 78 - Math.max(0, Number(player?.rank || pickNo) - pickNo) * 2),
        grade: 'Acceptable Decision',
        recommendationType: 'Best Available Fallback',
        summary: 'Fallback por ranking de board enquanto a recomendacao completa fica indisponivel.',
        positives: ['Melhor disponivel por ranking.'],
        warnings: [],
        breakdown: { needFit: 55, roleFit: 55, draftRange: 55, strategyFit: 55, boardValue: 65, riskFit: 55, positionDepthFit: 55 },
      },
    }))
}

function getWarRoomDraftDecisionAudit(owner, prospect, available) {
  if (!owner?.ownerAbbr || !prospect) return null
  try {
    return getDraftDecisionAudit({
      player: prospect,
      teamId: owner.ownerAbbr,
      currentPick: Number(owner.pick || 30),
      availablePlayers: available || [],
    })
  } catch {
    return null
  }
}

function isDraftDebugEnabled() {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('debugDraft') === '1'
}

function ProspectSelectionScreen({ currentOwner, selecting, available, rawAvailable, selectedProspect, filter, setFilter, setPreviewId, onPick, pickNotes = {}, setPickNotes, picks, resolvedPicks, toast, isSelecting }) {
  const showDraftDebug = useMemo(() => isDraftDebugEnabled(), [])
  const [miniProfileId, setMiniProfileId] = useState(null)
  const currentPickNote = pickNotes?.[selecting] || ''
  const handlePickNoteChange = useCallback((value) => {
    if (selecting == null || !setPickNotes) return
    setPickNotes(prev => ({ ...prev, [selecting]: value }))
  }, [selecting, setPickNotes])
  const handlePick = useCallback((id) => {
    setMiniProfileId(null)
    setPreviewId(null)
    onPick(id)
  }, [onPick, setPreviewId])
  const miniProfileProspect = useMemo(
    () => rawAvailable.find(p => p.id === miniProfileId) || null,
    [rawAvailable, miniProfileId],
  )
  const miniProfileDecision = useMemo(
    () => getWarRoomDraftDecision(currentOwner, miniProfileProspect, rawAvailable),
    [currentOwner, miniProfileProspect, rawAvailable],
  )
  const selectedDecision = useMemo(
    () => getWarRoomDraftDecision(currentOwner, selectedProspect, rawAvailable),
    [currentOwner, selectedProspect, rawAvailable],
  )
  const selectedAudit = useMemo(
    () => showDraftDebug ? getWarRoomDraftDecisionAudit(currentOwner, selectedProspect, rawAvailable) : null,
    [showDraftDebug, currentOwner, selectedProspect, rawAvailable],
  )
  const recommendations = useMemo(
    () => getWarRoomDecisionRecommendations(currentOwner, rawAvailable, 5),
    [currentOwner, rawAvailable],
  )
  const currentRosterContext = useMemo(
    () => currentOwner?.ownerAbbr ? analyzeRosterContext(currentOwner.ownerAbbr) : null,
    [currentOwner?.ownerAbbr],
  )
  const poolDecisionMap = useMemo(() => {
    if (!currentOwner?.ownerAbbr || !available?.length) return new Map()
    const visibleWindow = available.slice(0, 32)
    const ranked = getWarRoomDecisionRecommendations(currentOwner, visibleWindow, 12)
    return new Map(ranked.map(item => [item.player.id, item.decision]))
  }, [currentOwner, available])
  const madePicks = useMemo(
    () => getDraftRows(picks, resolvedPicks).filter(row => row.prospect),
    [picks, resolvedPicks],
  )
  const nextPicks = useMemo(
    () => resolvedPicks.slice(selecting + 1, selecting + 9),
    [resolvedPicks, selecting],
  )
  return (
    <section className="mock-war-room mock-war-room-fixed relative overflow-hidden">
      <div className="grid h-full min-h-0 gap-3 xl:grid-cols-[minmax(288px,27%)_minmax(0,56%)_minmax(178px,17%)]">
        <div className="order-2 min-h-0 xl:order-1">
          <ProspectListPanel
            available={available}
            rawAvailable={rawAvailable}
            selectedId={miniProfileId}
            owner={currentOwner}
            decisionMap={poolDecisionMap}
            filter={filter}
            setFilter={(nextFilter) => { setFilter(nextFilter); setPreviewId(null) }}
            onPreview={(id) => {
              setMiniProfileId(id)
              setPreviewId(id)
            }}
            onPick={handlePick}
          />
        </div>
        <div className="relative order-1 flex h-full min-h-0 min-w-0 flex-col gap-3 xl:order-2">
          <div className="min-h-0 flex-1">
            <TeamCommandCenter
              owner={currentOwner}
              selectedProspect={selectedProspect}
              selectedDecision={selectedDecision}
              recommendations={recommendations}
              selecting={selecting}
              picks={picks}
              resolvedPicks={resolvedPicks}
              rosterContext={currentRosterContext}
              nextPicks={nextPicks}
              onPreview={(id) => {
                setMiniProfileId(id)
                setPreviewId(id)
              }}
              onPick={handlePick}
              onAutoPick={() => recommendations[0]?.player ? handlePick(recommendations[0].player.id) : selectedProspect && handlePick(selectedProspect.id)}
            />
          </div>
          <AnimatePresence>
            {miniProfileProspect && (
              <MiniPlayerProfile
                prospect={miniProfileProspect}
                owner={currentOwner}
                decision={miniProfileDecision}
                isSelecting={isSelecting}
                pickNote={currentPickNote}
                onPickNoteChange={handlePickNoteChange}
                onClose={() => setMiniProfileId(null)}
                onPick={() => handlePick(miniProfileProspect.id)}
              />
            )}
          </AnimatePresence>
          {showDraftDebug && <DraftDecisionAuditPanel audit={selectedAudit} accent={currentOwner?.ownerColor || '#7c5ccf'} />}
        </div>
        <div className="order-4 min-h-0 xl:order-3">
          <MadePicksRail rows={madePicks} />
        </div>
      </div>
      <PickConfirmationToast toast={toast} />
    </section>
  )
}

function DraftProgressRail({ picks, selections, activePick = 1 }) {
  if (!picks?.length) return null
  return (
    <GlassPanel className="mock-draft-progress overflow-hidden p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-mono text-[9px] font-black uppercase tracking-[.24em] text-lo">Draft Board Timeline</div>
          <div className="mt-1 text-xs font-semibold text-muted">Fluxo das 30 escolhas, com lottery, trades e picks ja confirmadas.</div>
        </div>
        <span className="rounded-full border border-white/35 bg-white/32 px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[.15em] text-muted">Pick #{activePick}</span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
        {picks.slice(0, TOTAL_PICKS).map((pick, index) => {
          const no = index + 1
          const active = no === activePick
          const done = Boolean(selections[index])
          return (
            <div
              key={pick.pick}
              className={(active ? 'is-active ' : '') + (done ? 'is-done ' : '') + 'mock-draft-progress-pick relative flex min-w-[82px] flex-col items-center rounded-[20px] border px-3 py-2 text-center'}
              style={{ '--team-color': pick.ownerColor || '#7c5ccf' }}
            >
              <span className="font-numeric text-xl font-extrabold leading-none">#{no}</span>
              <TeamLogoGlass teamId={pick.ownerAbbr} size="sm" showGlow={active || no <= 4} className="mock-draft-timeline-logo" />
              <span className="mt-1 max-w-full truncate font-mono text-[7px] font-black uppercase tracking-[.12em]">{pick.ownerAbbr}</span>
            </div>
          )
        })}
      </div>
    </GlassPanel>
  )
}

function getDecisionLabel(decision, prospect, currentPick) {
  const score = Number(decision?.score || 0)
  const rank = Number(prospect?.rank || 99)
  const pick = Number(currentPick || 30)
  if (rank - pick > 8) return { label: 'Reach', color: '#d88754', bg: 'rgba(251,228,207,.66)' }
  if (score >= 82) return { label: 'Best Fit', color: '#4f9577', bg: 'rgba(229,244,236,.78)' }
  if (score >= 68) return { label: 'Good Fit', color: '#3f7fa0', bg: 'rgba(237,247,253,.82)' }
  if (score >= 52) return { label: 'Situational', color: '#8a7023', bg: 'rgba(251,244,210,.76)' }
  return { label: 'Reach', color: '#b66246', bg: 'rgba(250,238,229,.76)' }
}

function ProspectListPanel({ available, rawAvailable, selectedId, owner, decisionMap, filter, setFilter, onPreview, onPick }) {
  return (
    <GlassPanel className="mock-prospect-pool flex h-full min-h-0 flex-col overflow-hidden p-3">
      <div className="mb-2 flex items-end justify-between gap-3">
        <div><div className="font-mono text-[10px] font-black uppercase tracking-[.24em] text-lo">Available</div><h3 className="font-display text-2xl font-black text-slate-800">Prospect Pool</h3></div>
        <span className="rounded-full bg-white/45 px-3 py-1 font-mono text-[10px] font-black text-muted">{available.length}/{rawAvailable.length}</span>
      </div>
      <DraftFilterChips active={filter} setActive={setFilter} compact />
      <div className="mt-2 min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1 [scrollbar-width:thin]">
        {available.map((p, idx) => (
          <ProspectOption
            key={p.id}
            prospect={p}
            decision={decisionMap?.get(p.id)}
            currentPick={owner?.pick}
            isBest={idx === 0}
            active={selectedId === p.id}
            onOpen={() => onPreview(p.id)}
            onDraft={() => onPick(p.id)}
          />
        ))}
      </div>
    </GlassPanel>
  )
}

function ProspectOption({ prospect, decision, currentPick, active, isBest, onOpen, onDraft }) {
  const tier = getTierStyles(prospect.tier)
  const fitScore = Math.round(decision?.score || Math.max(45, 82 - Math.max(0, Number(prospect.rank || 60) - Number(currentPick || 30)) * 2))
  const fitMeta = getDecisionLabel(decision, prospect, currentPick)
  return (
    <motion.div whileHover={{ x: 2 }} transition={{ duration: .12 }} className="mock-prospect-option group grid grid-cols-[34px_minmax(0,1fr)_52px] items-center gap-2 rounded-[19px] border px-2.5 py-2.5 text-left transition-colors" style={{ '--tier-color': tier.color, background: active ? tier.bg : 'rgba(255,255,255,.34)', borderColor: active ? tier.color + '66' : 'rgba(255,255,255,.5)', boxShadow: active ? '0 10px 24px ' + tier.glow : 'none' }}>
      <span className="self-start pt-0.5 font-mono text-[11px] font-black tabular-nums" style={{ color: tier.color }}>#{prospect.rank}</span>
      <button type="button" onClick={onOpen} className="min-w-0 text-left">
        <span className="block whitespace-normal text-[13px] font-black leading-[1.15] text-slate-800 underline-offset-4 hover:underline dark:text-slate-100">{prospect.name}</span>
        <span className="mt-1 block truncate font-mono text-[7px] font-bold uppercase tracking-[.15em] text-muted">{prospect.position} / {prospect.team}</span>
        <span className="mt-1.5 inline-flex rounded-full px-2 py-0.5 font-mono text-[7px] font-black uppercase tracking-[.12em]" style={{ background: fitMeta.bg, color: fitMeta.color }}>{fitMeta.label}</span>
      </button>
      <div className="flex flex-col items-end gap-2">
        <span className="text-right font-numeric text-2xl font-extrabold leading-none tracking-tight tabular-nums" style={{ color: fitMeta.color }}>{fitScore}</span>
        <button type="button" onClick={onDraft} className="rounded-full border border-white/45 bg-white/35 px-2.5 py-1.5 font-mono text-[7px] font-black uppercase tracking-[.12em] text-slate-600 opacity-80 transition-all hover:-translate-y-0.5 hover:opacity-100 group-hover:bg-white/58 active:scale-95 dark:border-white/10 dark:bg-white/10 dark:text-slate-200" style={{ color: active ? tier.color : undefined }}>
          Draft
        </button>
      </div>
    </motion.div>
  )
}

function ProspectHeroCard({ prospect, owner, draftFit, bestFit, draftDecision, draftAudit, showDraftDebug = false, isSelecting = false, onPick }) {
  const [showDetails, setShowDetails] = useState(false)
  if (!prospect) return <GlassPanel className="min-h-[620px] p-7" />
  const tier = getTierStyles(prospect.tier)
  const image = getPlayerCutoutImage(prospect)
  const bars = getWarRoomAttributes(prospect)
  const fit = Math.round(draftDecision?.score || bestFit?.score || draftFit?.score || getFitScore(owner, prospect))
  const metrics = getTopMetrics(prospect)
  const meta = getPlayerDecisionMeta(prospect)
  const contextBullets = getDraftContextBullets(draftFit, prospect)
  const status = getDraftFitStatus(draftFit)
  const badge = getProspectListBadge(prospect, draftFit, false)
  const note = prospect.scouting?.notes || prospect.scouting?.strengths?.[0] || 'Scout report completo disponivel no perfil.'

  return (
    <AnimatePresence mode="wait">
      <motion.div key={prospect.id} initial={{ opacity: 0, y: 18, scale: .96 }} animate={{ opacity: isSelecting ? .48 : 1, y: 0, scale: isSelecting ? .975 : 1 }} exit={{ opacity: 0, y: -12, scale: .96 }} transition={{ duration: .3, ease: [0.22, 1, 0.36, 1] }} className="will-change-transform">
        <GlassPanel className="mock-prospect-hero relative min-h-[520px] overflow-hidden p-4 2xl:p-5" style={{ '--tier-color': tier.color, background: 'radial-gradient(circle at 50% 0%, ' + tier.glow + ', transparent 34%), linear-gradient(145deg, rgba(255,255,255,.66), ' + tier.bg + 'c4)' }}>
          <span className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full blur-3xl" style={{ background: tier.color, opacity: .14 }} />
          <span className="pointer-events-none absolute -left-20 bottom-20 h-44 w-44 rounded-full bg-white/70 blur-3xl" />
          <div className="relative space-y-4">
            <DecisionHeader prospect={prospect} tier={tier} fit={fit} badge={badge} status={status} bullets={contextBullets} onPick={onPick} />
            <QuickStatsRow metrics={metrics} color={tier.color} />

            <DraftDecisionPanel decision={draftDecision} fit={bestFit} draftFit={draftFit} fallbackScore={fit} color={getDraftDecisionColor(draftDecision?.score || fit)} status={status} />
            {showDraftDebug && <DraftDecisionAuditPanel audit={draftAudit} accent={tier.color} />}

            <div className="rounded-[24px] border border-white/35 bg-white/20 backdrop-blur-md">
              <button
                type="button"
                onClick={() => setShowDetails(prev => !prev)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-white/20"
              >
                <span>
                  <span className="block font-mono text-[9px] font-black uppercase tracking-[.22em] text-lo">Detalhes avancados</span>
                  <span className="mt-1 block text-xs font-semibold text-muted">traits, barras de archetype e contexto de scout</span>
                </span>
                <span className="rounded-full bg-white/40 px-3 py-1 font-mono text-[10px] font-black uppercase tracking-[.14em]" style={{ color: tier.color }}>
                  {showDetails ? 'Fechar ↑' : 'Abrir ↓'}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: .28, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="grid gap-4 border-t border-white/30 p-4 lg:grid-cols-[minmax(170px,.56fr)_minmax(0,1fr)]">
                      <div className="flex flex-col items-center text-center">
                        <div className="mt-3 grid w-full gap-2 sm:grid-cols-2">
                          <DecisionChip label="Primary" value={meta.primary} color={tier.color} />
                          <DecisionChip label="Secondary" value={meta.secondary} color="#5aaed6" />
                          <DecisionChip label="Best Trait" value={meta.best} color="#4f9577" />
                          <DecisionChip label="Weakness" value={meta.weak} color="#d96f7d" />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <ArchetypeBars bars={bars} color={tier.color} />
                        <div className="pt-1">
                          <div className="font-mono text-[9px] font-black uppercase tracking-[.22em] text-lo">Contexto de scout</div>
                          <p className="mt-2 max-w-4xl text-xs font-semibold leading-5 text-slate-600/70">{note}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={onPick}
              className="group flex w-full items-center justify-center gap-2 rounded-full px-5 py-4 font-mono text-[11px] font-black uppercase tracking-[.2em] text-white transition-all duration-200 hover:-translate-y-0.5 active:scale-[.98]"
              style={{ background: 'linear-gradient(135deg, ' + tier.color + ', ' + tier.color + 'dd)', boxShadow: '0 18px 38px ' + tier.glow }}
            >
              Selecionar jogador
              <span className="transition-transform duration-200 group-hover:translate-x-1">{'->'}</span>
            </button>

          </div>
        </GlassPanel>
      </motion.div>
    </AnimatePresence>
  )
}

function DecisionHeader({ prospect, tier, fit, badge, status, bullets, onPick }) {
  const image = getPlayerCutoutImage(prospect)
  return (
    <div className="relative rounded-[28px] border border-white/35 bg-white/22 p-4 backdrop-blur-xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[.16em]" style={{ background: tier.bg, color: tier.text }}>{tier.label}</span>
            <span className="rounded-full bg-white/35 px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[.16em] text-muted">#{prospect.rank} / {prospect.position}</span>
            <span className="rounded-full bg-white/35 px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[.16em] text-muted">{prospect.team}</span>
            {badge && <span className="rounded-full px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[.16em]" style={{ background: badge.bg, color: badge.color }}>{badge.label}</span>}
            {status?.label && <span className="rounded-full px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[.16em]" style={{ background: status.bg, color: status.tone }}>{status.label}</span>}
          </div>
          <h2 className="mt-3 font-display text-3xl font-black leading-none tracking-tight text-slate-800 md:text-5xl 3xl:text-5xl">{prospect.name}</h2>
          <div className="mt-2 text-xs font-bold text-slate-600/75">{prospect.age} anos / {prospect.height || '-'} / {prospect.weight || '-'} / {prospect.wingspan || '-'}</div>
        </div>
        <div className="mock-prospect-stage relative flex h-40 w-36 shrink-0 items-end justify-center overflow-visible rounded-[26px] border border-white/45 bg-white/22 p-2 text-center backdrop-blur-md shadow-[0_14px_34px_rgba(0,0,0,.05)] 3xl:h-48 3xl:w-44">
          <span className="pointer-events-none absolute inset-x-6 bottom-4 h-14 rounded-full blur-2xl" style={{ background: tier.color, opacity: .14 }} />
          <span className="absolute left-3 top-3 rounded-full bg-white/45 px-2 py-1 font-mono text-[7px] font-black uppercase tracking-[.12em]" style={{ color: getBestFitColor(fit) }}>{fit} fit</span>
          {image ? <img src={image} alt={prospect.name} className="player-cutout player-profile-cutout relative z-10 h-full w-full object-contain object-bottom" draggable="false" /> : <span className="relative z-10 mb-14 font-display text-4xl font-black" style={{ color: tier.color }}>{initials(prospect.name)}</span>}
        </div>
      </div>
      <div className="mt-3 grid gap-2 md:grid-cols-3">
        {bullets.slice(0, 3).map((bullet, idx) => <div key={idx} className="flex gap-2 rounded-2xl bg-white/24 px-3 py-2 text-[11px] font-bold leading-4 text-slate-600/85"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: tier.color }} />{bullet}</div>)}
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

function DraftDecisionPanel({ decision, fit, draftFit, fallbackScore, color, status }) {
  const breakdown = fit?.breakdown || {}
  const draftComponents = draftFit?.components || {}
  const decisionBreakdown = decision?.breakdown || {}
  const rows = [
    ['Need Fit', decisionBreakdown.needFit ?? breakdown.teamNeedFit ?? draftComponents.teamNeedFit ?? fallbackScore, 'Necessidade real do elenco'],
    ['Role Fit', decisionBreakdown.roleFit ?? breakdown.roleFit ?? fallbackScore, 'Papel disponivel no contexto'],
    ['Draft Range', decisionBreakdown.draftRange ?? breakdown.draftRangeFit ?? draftComponents.draftRangeFit ?? fallbackScore, 'Valor da escolha vs range esperado'],
    ['Strategy Fit', decisionBreakdown.strategyFit ?? breakdown.timelineFit ?? fallbackScore, 'Aderencia ao plano da franquia'],
    ['Board Value', decisionBreakdown.boardValue ?? fallbackScore, 'Valor contra jogadores disponiveis'],
    ['Risk Fit', decisionBreakdown.riskFit ?? breakdown.riskFit ?? fallbackScore, 'Tolerancia de risco do time'],
  ]
  const score = Math.round(decision?.score || fallbackScore || 0)
  const grade = decision?.grade || fit?.tier || status?.copy || status?.label || 'Draft Fit'
  return (
    <div className="rounded-[28px] border border-white/45 bg-white/35 p-4 shadow-[0_18px_46px_rgba(0,0,0,.07)] backdrop-blur-xl">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="font-mono text-[10px] font-black uppercase tracking-[.28em] text-lo">Draft Decision</div>
          <p className="mt-1 text-[11px] font-semibold text-muted">{decision?.summary || fit?.primaryReason || 'Score por contexto, papel, range e risco.'}</p>
          {decision?.recommendationType && <div className="mt-2 inline-flex rounded-full bg-white/40 px-3 py-1 font-mono text-[8px] font-black uppercase tracking-[.14em] text-muted">{decision.recommendationType}</div>}
        </div>
        <div className="text-right">
          <div className="font-numeric text-5xl font-extrabold leading-none tracking-tight tabular-nums" style={{ color }}>{score}</div>
          <span className="mt-2 inline-flex rounded-full px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[.14em]" style={{ background: color + '18', color }}>{grade}</span>
        </div>
      </div>
      <div className="space-y-3">
        {rows.map(([label, value, copy], idx) => <DecisionBar key={label} label={label} value={value} copy={copy} color={idx < 2 ? color : '#5aaed6'} strong={idx < 2} />)}
      </div>
      <RosterContextPanel decision={decision} accent={color} />
      {(decision?.positives?.length || decision?.warnings?.length) && (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <DecisionNotes title="Positives" items={decision?.positives || []} color="#4f9577" />
          <DecisionNotes title="Warnings" items={decision?.warnings || []} color="#d88754" />
        </div>
      )}
    </div>
  )
}

function RosterContextPanel({ decision, accent }) {
  const context = decision?.debug?.rosterContext
  if (!context) return null

  const corePlayers = (context.corePlayers || decision?.debug?.corePlayers || []).slice(0, 3)
  const injuredCore = context.injuredCore || []
  const matchedNeeds = (context.matchedNeeds || decision?.debug?.matchedNeeds || []).slice(0, 2)
  const missedNeeds = (context.missedNeeds || decision?.debug?.missedNeeds || []).slice(0, 2)
  const shootingProfile = context.shootingProfile
  const overlap = getOverlapRiskMeta(context.overlapRisk)
  const shooting = getShootingProfileMeta(shootingProfile)
  const rotationPath = context.notes?.rotationPath || getRotationPathFallback(context.roleAvailability)
  const overlapCopy = context.notes?.overlap || overlap.copy
  const hasContent = corePlayers.length || injuredCore.length || matchedNeeds.length || missedNeeds.length || shootingProfile

  if (!hasContent) {
    return (
      <div className="mt-4 rounded-[22px] border border-white/50 bg-white/32 p-3 text-xs font-semibold text-muted shadow-black/5 backdrop-blur-xl ring-1 ring-white/40 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-400 dark:ring-white/10">
        Contexto de elenco indisponivel para esta decisao.
      </div>
    )
  }

  return (
    <div className="mt-4 rounded-[24px] border border-white/55 bg-white/42 p-3.5 shadow-[0_12px_34px_rgba(0,0,0,.05)] backdrop-blur-xl ring-1 ring-white/45 dark:border-white/10 dark:bg-slate-950/55 dark:ring-white/10">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="font-mono text-[8px] font-black uppercase tracking-[.22em] text-lo">Roster Context</div>
          <p className="mt-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">Elenco real, core considerado e caminho de minutos.</p>
        </div>
        {context.rosterFitScore != null && (
          <span className="rounded-full bg-white/50 px-3 py-1 font-mono text-[8px] font-black uppercase tracking-[.14em] tabular-nums dark:bg-white/10" style={{ color: accent }}>
            Roster Fit {Math.round(context.rosterFitScore)}
          </span>
        )}
      </div>

      <div className="grid gap-2.5 md:grid-cols-2">
        <div className="rounded-[20px] border border-white/35 bg-white/24 p-3 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
          <ContextLabel label="Core Context" />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {corePlayers.length ? corePlayers.map(name => <ContextChip key={name} label={name} tone="core" />) : <ContextChip label="Core neutro" tone="neutral" />}
          </div>
          {injuredCore.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {injuredCore.slice(0, 2).map(name => <ContextChip key={name} label={name + ' / contextual core'} tone="injured" />)}
            </div>
          )}
        </div>

        <div className="rounded-[20px] border border-white/35 bg-white/24 p-3 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
          <ContextLabel label="Rotation Path" />
          <p className="mt-2 text-[11px] font-semibold leading-4 text-slate-600/85 dark:text-slate-300/80">{rotationPath}</p>
        </div>

        <div className="rounded-[20px] border border-white/35 bg-white/24 p-3 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center justify-between gap-2">
            <ContextLabel label="Overlap Risk" />
            <span className="rounded-full px-2.5 py-1 font-mono text-[8px] font-black uppercase tracking-[.13em]" style={{ background: overlap.bg, color: overlap.color }}>{overlap.label}</span>
          </div>
          <p className="mt-2 text-[11px] font-semibold leading-4 text-slate-600/85 dark:text-slate-300/80">{overlapCopy}</p>
        </div>

        <div className="rounded-[20px] border border-white/35 bg-white/24 p-3 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
          <ContextLabel label="Shooting Profile" />
          {shootingProfile ? (
            <>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <ContextChip label={shooting.label} tone={shooting.tone} />
                <ContextChip label={shootingProfile.confidence + ' confidence'} tone="neutral" />
              </div>
              <p className="mt-2 text-[11px] font-semibold leading-4 text-slate-600/85 dark:text-slate-300/80">{shooting.copy}</p>
            </>
          ) : (
            <p className="mt-2 text-[11px] font-semibold leading-4 text-muted">Perfil de arremesso sem amostra suficiente.</p>
          )}
        </div>
      </div>

      {(matchedNeeds.length || missedNeeds.length) && (
        <div className="mt-2.5 grid gap-2 md:grid-cols-2">
          <NeedChipGroup title="Matched Needs" items={matchedNeeds} tone="matched" />
          <NeedChipGroup title="Missed Needs" items={missedNeeds} tone="missed" />
        </div>
      )}
    </div>
  )
}

function DraftDecisionAuditPanel({ audit, accent }) {
  if (!audit?.decision) {
    return (
      <div className="rounded-[24px] border border-dashed border-white/50 bg-white/26 p-4 text-xs font-semibold text-muted backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/40">
        Debug ativo, mas a auditoria desta decisao ainda nao esta disponivel.
      </div>
    )
  }

  const { decision, playerTraits = {}, teamNeeds = {}, rosterContext, rosterFit, shootingProfile, weights = {}, debug = {} } = audit
  const rosterDebug = debug.rosterContext || {}
  const breakdownRows = {
    ...decision.breakdown,
    rosterFit: debug.rosterFitScore ?? rosterFit?.rosterFitScore,
  }

  return (
    <details className="rounded-[24px] border border-violet-200/60 bg-violet-50/35 p-3.5 shadow-[0_12px_34px_rgba(124,92,207,.08)] backdrop-blur-xl ring-1 ring-white/45 dark:border-violet-300/15 dark:bg-violet-400/10 dark:ring-white/10">
      <summary className="cursor-pointer list-none">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="font-mono text-[8px] font-black uppercase tracking-[.22em] text-violet-600 dark:text-violet-200">Algorithm Audit / Dev</div>
            <p className="mt-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">Visivel apenas com ?debugDraft=1.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white/55 px-3 py-1 font-mono text-[8px] font-black uppercase tracking-[.14em] tabular-nums dark:bg-white/10" style={{ color: accent }}>
              {Math.round(decision.score)} / {decision.grade}
            </span>
            <span className="rounded-full bg-white/45 px-3 py-1 font-mono text-[8px] font-black uppercase tracking-[.14em] text-muted dark:bg-white/10">abrir</span>
          </div>
        </div>
      </summary>

      <div className="mt-4 space-y-3">
        <AuditSection title="Decision">
          <div className="grid gap-2 md:grid-cols-2">
            <AuditLine label="Grade" value={decision.grade} />
            <AuditLine label="Type" value={decision.recommendationType} />
            <AuditLine label="Summary" value={decision.summary} wide />
          </div>
        </AuditSection>

        <AuditSection title="Breakdown">
          <AuditMetricGrid data={breakdownRows} color={accent} />
        </AuditSection>

        <div className="grid gap-3 md:grid-cols-2">
          <AuditSection title="Positives">
            <AuditList items={decision.positives} tone="matched" />
          </AuditSection>
          <AuditSection title="Warnings">
            <AuditList items={decision.warnings} tone="missed" />
          </AuditSection>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <AuditSection title="Needs">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {(debug.matchedNeeds || []).slice(0, 5).map(item => <ContextChip key={item} label={'match: ' + item} tone="matched" />)}
              {(debug.missedNeeds || []).slice(0, 5).map(item => <ContextChip key={item} label={'miss: ' + item} tone="missed" />)}
            </div>
            <AuditMetricGrid data={teamNeeds} color="#5aaed6" compact />
          </AuditSection>
          <AuditSection title="Roster">
            <div className="flex flex-wrap gap-1.5">
              {(rosterDebug.corePlayers || debug.corePlayers || []).slice(0, 6).map(name => <ContextChip key={name} label={name} tone="core" />)}
              {(rosterDebug.injuredCore || []).slice(0, 3).map(name => <ContextChip key={name} label={name + ' / injured'} tone="injured" />)}
            </div>
            <div className="mt-3 grid gap-2">
              <AuditLine label="Overlap" value={debug.overlapRisk ?? rosterDebug.overlapRisk} />
              <AuditLine label="Role Availability" value={debug.roleAvailability ?? rosterDebug.roleAvailability} />
              <AuditLine label="Roster Strengths" value={(debug.rosterStrengths || rosterContext?.rosterStrengths || []).slice(0, 3).join(' / ')} />
              <AuditLine label="Roster Weaknesses" value={(debug.rosterWeaknesses || rosterContext?.rosterWeaknesses || []).slice(0, 3).join(' / ')} />
            </div>
          </AuditSection>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <AuditSection title="Shooting Profile">
            <div className="flex flex-wrap gap-1.5">
              <ContextChip label={shootingProfile?.label || rosterDebug.shootingProfile?.label || 'unknown'} tone={getShootingProfileMeta(shootingProfile || rosterDebug.shootingProfile).tone} />
              <ContextChip label={(shootingProfile?.confidence || rosterDebug.shootingProfile?.confidence || 'low') + ' confidence'} tone="neutral" />
              <ContextChip label={'score ' + Math.round(shootingProfile?.score ?? rosterDebug.shootingProfile?.score ?? 0)} tone="neutral" />
            </div>
            <AuditList items={[...(shootingProfile?.indicators || rosterDebug.shootingProfile?.indicators || []), ...(shootingProfile?.warnings || rosterDebug.shootingProfile?.warnings || [])].slice(0, 5)} tone="neutral" />
          </AuditSection>
          <AuditSection title="Bonuses / Penalties">
            <AuditList items={(debug.appliedBonuses || []).map(item => '+ ' + item)} tone="matched" />
            <AuditList items={(debug.appliedPenalties || []).map(item => '- ' + item)} tone="missed" />
          </AuditSection>
        </div>

        <AuditSection title="Player Traits">
          <AuditMetricGrid data={playerTraits} color={accent} compact />
        </AuditSection>

        <AuditSection title="Algorithm Weights">
          <AuditMetricGrid data={weights} color="#7c5ccf" compact />
        </AuditSection>

        <details className="rounded-[18px] border border-white/30 bg-white/22 p-3 dark:border-white/10 dark:bg-white/5">
          <summary className="cursor-pointer font-mono text-[8px] font-black uppercase tracking-[.18em] text-lo">Raw Audit JSON</summary>
          <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-2xl bg-slate-950/90 p-3 font-mono text-[10px] leading-4 text-slate-100">{JSON.stringify(audit, null, 2)}</pre>
        </details>
      </div>
    </details>
  )
}

function DecisionNotes({ title, items, color }) {
  if (!items.length) return null
  return (
    <div className="rounded-[20px] border border-white/30 bg-white/22 p-3 backdrop-blur-md">
      <div className="font-mono text-[8px] font-black uppercase tracking-[.18em]" style={{ color }}>{title}</div>
      <div className="mt-2 space-y-1.5">
        {items.slice(0, 3).map((item, index) => (
          <div key={index} className="flex gap-2 text-[11px] font-semibold leading-4 text-slate-600/85">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: color }} />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ContextLabel({ label }) {
  return <div className="font-mono text-[8px] font-black uppercase tracking-[.18em] text-lo">{label}</div>
}

function ContextChip({ label, tone = 'neutral' }) {
  const styles = {
    core: 'bg-sky-100/60 text-sky-800 dark:bg-sky-400/15 dark:text-sky-200',
    injured: 'bg-violet-100/65 text-violet-800 dark:bg-violet-400/15 dark:text-violet-200',
    matched: 'bg-emerald-100/65 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200',
    missed: 'bg-amber-100/70 text-amber-800 dark:bg-amber-400/15 dark:text-amber-200',
    warning: 'bg-orange-100/70 text-orange-800 dark:bg-orange-400/15 dark:text-orange-200',
    neutral: 'bg-white/48 text-slate-600 dark:bg-white/10 dark:text-slate-300',
  }
  return <span className={(styles[tone] || styles.neutral) + ' rounded-full px-2.5 py-1 font-mono text-[7px] font-black uppercase tracking-[.12em]'}>{label}</span>
}

function NeedChipGroup({ title, items, tone }) {
  if (!items.length) return null
  return (
    <div className="rounded-[18px] border border-white/30 bg-white/20 p-2.5 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
      <ContextLabel label={title} />
      <div className="mt-2 flex flex-wrap gap-1.5">
        {items.slice(0, 2).map(item => <ContextChip key={item} label={item} tone={tone} />)}
      </div>
    </div>
  )
}

function AuditSection({ title, children }) {
  return (
    <div className="rounded-[20px] border border-white/35 bg-white/24 p-3 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
      <ContextLabel label={title} />
      <div className="mt-2">{children}</div>
    </div>
  )
}

function AuditLine({ label, value, wide = false }) {
  const display = Array.isArray(value) ? value.join(' / ') : value
  return (
    <div className={(wide ? 'md:col-span-2 ' : '') + 'rounded-[16px] bg-white/28 px-3 py-2 dark:bg-white/5'}>
      <div className="font-mono text-[7px] font-black uppercase tracking-[.14em] text-lo">{label}</div>
      <div className="mt-1 break-words text-[11px] font-semibold leading-4 text-slate-600 dark:text-slate-300">{display || '-'}</div>
    </div>
  )
}

function AuditList({ items = [], tone = 'neutral' }) {
  if (!items.length) return <div className="text-[11px] font-semibold text-muted">Sem dados nesta categoria.</div>
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.slice(0, 8).map((item, index) => <ContextChip key={String(item) + index} label={String(item)} tone={tone} />)}
    </div>
  )
}

function AuditMetricGrid({ data = {}, color = '#7c5ccf', compact = false }) {
  const entries = Object.entries(data || {}).filter(([, value]) => value !== undefined && value !== null && value !== '')
  if (!entries.length) return <div className="text-[11px] font-semibold text-muted">Sem metricas disponiveis.</div>
  return (
    <div className={(compact ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 md:grid-cols-3') + ' grid gap-2'}>
      {entries.map(([key, value]) => {
        const numeric = Number(value)
        const isNumeric = Number.isFinite(numeric)
        const shown = isNumeric ? (Math.abs(numeric) <= 1 ? numeric.toFixed(2) : Math.round(numeric)) : String(value)
        const width = isNumeric ? clamp(Math.abs(numeric) <= 1 ? numeric * 100 : numeric) : 0
        return (
          <div key={key} className="rounded-[16px] bg-white/28 px-3 py-2 dark:bg-white/5">
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <span className="truncate font-mono text-[7px] font-black uppercase tracking-[.12em] text-lo">{formatAuditKey(key)}</span>
              <span className="font-mono text-[10px] font-black tabular-nums" style={{ color }}>{shown}</span>
            </div>
            {isNumeric && (
              <div className="h-1.5 overflow-hidden rounded-full bg-white/45 dark:bg-white/10">
                <span className="block h-full rounded-full" style={{ width: width + '%', background: color }} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function formatAuditKey(key) {
  return String(key).replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim()
}

function getOverlapRiskMeta(value = 45) {
  const safe = clamp(Number(value) || 0)
  if (safe >= 68) return { label: 'High', color: '#c75f45', bg: 'rgba(251,146,60,.18)', copy: 'Risco alto de sobreposicao com papeis ja ocupados no elenco.' }
  if (safe >= 46) return { label: 'Medium', color: '#b9832e', bg: 'rgba(245,158,11,.18)', copy: 'Risco medio: o papel inicial precisa ser bem definido para evitar redundancia.' }
  return { label: 'Low', color: '#3f8f72', bg: 'rgba(16,185,129,.16)', copy: 'Baixo risco de sobreposicao funcional relevante.' }
}

function getRotationPathFallback(value = 55) {
  const safe = clamp(Number(value) || 0)
  if (safe >= 70) return 'Caminho de rotacao limpo para assumir papel complementar cedo.'
  if (safe >= 48) return 'Caminho de rotacao viavel, mas dependente de funcao bem definida.'
  return 'Caminho de minutos inicial mais congestionado pela composicao atual.'
}

function getShootingProfileMeta(profile) {
  if (!profile) return { label: 'unknown shooter', tone: 'neutral', copy: 'Perfil de arremesso sem amostra suficiente.' }
  const label = (profile.label || 'questionable').replace('-', ' ')
  const indicator = profile.indicators?.[0]
  if (profile.label === 'elite' || profile.label === 'strong') {
    return { label: label + ' shooter', tone: 'matched', copy: indicator ? `Ajuda o espacamento: ${indicator}.` : 'Ajuda a lacuna de spacing da rotacao.' }
  }
  if (profile.label === 'solid') {
    return { label: 'solid shooter', tone: 'core', copy: indicator ? `Arremesso funcional: ${indicator}.` : 'Oferece spacing funcional sem precisar de alto uso.' }
  }
  if (profile.label === 'questionable') {
    return { label: 'questionable shooter', tone: 'missed', copy: profile.warnings?.[0] || 'O arremesso ainda exige contexto e volume para ganhar confianca.' }
  }
  return { label: 'non shooter', tone: 'warning', copy: profile.warnings?.[0] || 'Nao projeta como solucao primaria de spacing neste momento.' }
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
      <div className={(strong ? 'h-3.5' : 'h-2.5') + ' overflow-hidden rounded-full border border-white/30 bg-white/38 shadow-inner'}>
        <motion.div initial={{ width: 0 }} animate={{ width: safe + '%' }} transition={{ duration: .75, ease: [0.22, 1, 0.36, 1] }} className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, ' + color + 'cc, ' + color + ')' }} />
      </div>
    </div>
  )
}

function ArchetypeBars({ bars, color }) {
  return (
    <div className="rounded-[24px] border border-white/35 bg-white/20 p-4 backdrop-blur-md">
      <div className="mb-4 flex flex-wrap justify-between gap-2"><span className="font-mono text-[9px] font-black uppercase tracking-[.22em] text-lo">Archetype Bars</span><span className="text-xs font-bold text-slate-500/80">perfil em 5 areas</span></div>
      <div className="space-y-3.5">
        {bars.map(([label, value]) => {
          const featured = label === 'Scoring' || label === 'Shooting'
          return <AttributeBar key={label} label={label} value={value} color={featured ? color : '#7caec5'} featured={featured} />
        })}
      </div>
    </div>
  )
}

function DecisionChip({ label, value, color }) {
  return <div className="rounded-[18px] border border-white/30 bg-white/20 px-3 py-2 backdrop-blur-md"><div className="font-mono text-[8px] font-black uppercase tracking-[.18em] text-lo">{label}</div><div className="mt-1 truncate text-xs font-black text-slate-800" style={{ color }}>{value || '-'}</div></div>
}

function TeamCommandCenter({ owner, rosterContext, recommendations = [], nextPicks = [], onPreview }) {
  const needs = getTeamNeedChips(owner?.ownerAbbr)
  const ctx = getTeamDecisionContext(owner)
  const glow = owner?.ownerColor || '#7c5ccf'
  const strategy = ctx?.strategy || getTeamPriorityLabel(owner?.ownerAbbr) || getTeamTimelineLabel(owner?.ownerAbbr)

  return (
    <GlassPanel className="mock-team-clock relative flex h-full min-h-0 flex-col overflow-hidden p-3" style={{ background: owner?.ownerColor ? 'radial-gradient(circle at 50% 0%, ' + owner.ownerColor + '20, transparent 42%), rgba(255,255,255,.52)' : undefined }}>
      <span className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full blur-3xl" style={{ background: glow, opacity: .16 }} />
      <div className="relative shrink-0">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <TeamLogoGlass teamId={owner?.ownerAbbr} size="md" showGlow />
            <div className="min-w-0">
              <div className="font-mono text-[9px] font-black uppercase tracking-[.26em] text-lo">Team Command</div>
              <h2 className="mt-0.5 truncate font-display text-2xl font-black leading-none text-slate-800 dark:text-slate-50">#{owner?.pick} / {owner?.ownerName}</h2>
              <div className="mt-1 font-mono text-[8px] font-black uppercase tracking-[.18em] text-muted">{owner?.viaAbbr ? 'via ' + owner.viaAbbr : owner?.originalTeam?.record || 'First round'}</div>
            </div>
          </div>
          <span className="rounded-full border border-white/45 bg-white/45 px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[.16em] text-muted">
            On the clock
          </span>
        </div>

        <div className="mt-2 rounded-[22px] border border-white/50 bg-white/30 p-2.5 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-mono text-[9px] font-black uppercase tracking-[.2em] text-lo">Team Needs / Strategy</div>
            {needs.slice(0, 5).map(x => <span key={x} className="rounded-full border border-white/45 bg-white/52 px-3 py-1 font-mono text-[8px] font-black uppercase tracking-[.12em] text-slate-600 shadow-[inset_1px_1px_0_rgba(255,255,255,.45)] dark:border-white/10 dark:bg-white/10 dark:text-slate-300">{x}</span>)}
            <span className="ml-auto min-w-[220px] max-w-[42%] truncate text-right text-xs font-semibold text-muted">{strategy}</span>
          </div>
        </div>
      </div>

      <RosterShelves rosterContext={rosterContext} teamId={owner?.ownerAbbr} accent={glow} />
      <MinimalBestFits recommendations={recommendations} onPreview={onPreview} />
      <NextPicksStrip picks={nextPicks} />
    </GlassPanel>
  )
}

function getTopFitTag(player, decision) {
  const text = [player?.archetype, player?.projectedRole, decision?.recommendationType, ...(decision?.positives || [])].filter(Boolean).join(' ').toLowerCase()
  if (/imperdivel|elite|franchise|bpa|best player/.test(text) || Number(player?.rank) <= 3) return 'Best Fit'
  if (/creator|creation|cria|primary|guard/.test(text)) return 'Creator'
  if (/frontcourt|big|center|rim|rebound|pf|c/.test(text) || /PF|C/.test(player?.position || '')) return 'Frontcourt'
  if (/defense|two-way|wing|size|switch/.test(text)) return 'Two-Way'
  if (/upside|teto|swing|talent/.test(text)) return 'Upside'
  return decision?.grade?.replace(' Decision', '') || 'Good Fit'
}

function getMinimalFitReason(item) {
  const summary = item?.decision?.summary || item?.decision?.positives?.[0] || item?.decision?.recommendationType
  return summary || 'Encaixe forte pelo valor de board e contexto do time.'
}

function formatStat(value, suffix = '') {
  const number = Number(value)
  if (!Number.isFinite(number)) return '-'
  return `${number.toFixed(number % 1 ? 1 : 0)}${suffix}`
}

function getBasicFitStats(player) {
  const stats = player?.stats || {}
  return [
    ['PPG', formatStat(stats.ppg)],
    ['RPG', formatStat(stats.rpg)],
    ['APG', formatStat(stats.apg)],
    ['3P%', formatStat(stats.threep, '%')],
    [stats.ts ? 'TS%' : 'FG%', formatStat(stats.ts || stats.fgp, '%')],
  ].filter(([, value]) => value !== '-')
}

function MinimalBestFits({ recommendations = [], onPreview }) {
  const fits = recommendations.slice(0, 3)
  if (!fits.length) return null
  return (
    <div className="mt-2 shrink-0 rounded-[22px] border border-white/50 bg-white/28 p-2 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
      <div className="mb-1 flex items-center justify-between gap-2 px-1">
        <div className="font-mono text-[8px] font-black uppercase tracking-[.2em] text-lo">Best Fit</div>
        <span className="rounded-full bg-white/35 px-2.5 py-1 font-mono text-[7px] font-black uppercase tracking-[.14em] text-muted dark:bg-white/10">top 3</span>
      </div>
      <div className="grid gap-2 lg:grid-cols-3">
        {fits.map((item, index) => {
          const score = Math.round(item.decision?.score || 0)
          const color = getDraftDecisionColor(score)
          const tag = getTopFitTag(item.player, item.decision)
          const image = getPlayerCutoutImage(item.player)
          const stats = getBasicFitStats(item.player).slice(0, 5)
          return (
            <button key={item.player.id} type="button" onClick={() => onPreview?.(item.player.id)} className="min-h-[112px] rounded-[20px] border p-2 text-left backdrop-blur-md transition-colors" style={{ borderColor: color + '42', background: color + '12' }}>
              <div className="flex items-start gap-2.5">
                <span className="flex h-10 w-10 shrink-0 items-end justify-center overflow-hidden rounded-full bg-white/35 dark:bg-white/10">
                  {image ? <img src={image} alt={item.player.name} className="h-[118%] w-[118%] object-contain object-bottom" draggable="false" /> : <span className="mb-3 font-display text-xs font-black" style={{ color }}>{initials(item.player.name)}</span>}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[12px] font-black leading-tight text-slate-800 dark:text-slate-100">{item.player.name}</span>
                  <span className="mt-0.5 block truncate font-mono text-[7px] font-black uppercase tracking-[.12em] text-muted">{item.player.position} / {item.player.team}</span>
                  <span className="mt-1 inline-flex rounded-full px-2 py-0.5 font-mono text-[7px] font-black uppercase tracking-[.12em]" style={{ background: color + '18', color }}>{tag}</span>
                </span>
                <span className="ml-auto shrink-0 text-right font-numeric text-2xl font-extrabold leading-none tabular-nums" style={{ color }}>{score}</span>
              </div>
              <div className="mt-1.5 flex flex-wrap gap-x-2 gap-y-0.5">
                {stats.map(([label, value]) => <span key={label} className="font-mono text-[7px] font-black uppercase tracking-[.12em] text-muted"><b className="font-numeric text-[11px] text-slate-700 dark:text-slate-200">{value}</b> {label}</span>)}
              </div>
              <p className="mt-1.5 line-clamp-2 text-[10px] font-semibold leading-4 text-muted">{getMinimalFitReason(item)}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function getManualRosterShelfRows(teamId) {
  if (!hasManualRosterOverride(teamId)) return null
  const manual = normalizeManualRosterOverride(getManualRosterOverride(teamId))
  if (!manual) return null
  return [
    ['Guards', manual.guards],
    ['Wings / Forwards', manual.wingsForwards],
    ['Bigs', manual.bigs],
  ].map(([label, players]) => [label, players || []])
}

function getRosterShelfRows(rosterContext, teamId) {
  const manualRows = getManualRosterShelfRows(teamId)
  if (manualRows) return manualRows
  if (!rosterContext) return []
  const uniqueByName = players => {
    const localTaken = new Set()
    return (players || []).filter(player => {
      const key = player?.name
      if (!key || localTaken.has(key)) return false
      localTaken.add(key)
      return true
    })
  }
  const assigned = new Set()
  const take = players => uniqueByName(players).filter(player => {
    const key = player?.name
    if (!key || assigned.has(key)) return false
    assigned.add(key)
    return true
  })
  const wingForwardPool = [
    ...(rosterContext.wings || []),
    ...(rosterContext.rotationPlayers || []).filter(p => /forward|sf|pf|wing/i.test(p.position || p.roleTags?.join(' ') || '')),
  ]
  return [
    ['Guards', take(rosterContext.guards || [])],
    ['Wings / Forwards', take(wingForwardPool)],
    ['Bigs', take(rosterContext.bigs || [])],
  ].map(([label, players]) => [label, players || []])
}

function getRosterPlayerStatusMeta(status, accent) {
  if (status === 'core') {
    return {
      className: '',
      style: { borderColor: accent + '66', background: accent + '18', color: accent },
    }
  }
  if (status === 'injured') {
    return {
      className: 'border-red-500/60 bg-red-200/80 text-red-950 shadow-[inset_1px_1px_0_rgba(255,255,255,.45)] dark:border-red-300/50 dark:bg-red-500/20 dark:text-red-200',
      style: {},
    }
  }
  if (status === 'uncertain') {
    return {
      className: 'border-amber-500/60 bg-amber-200/80 text-amber-950 shadow-[inset_1px_1px_0_rgba(255,255,255,.45)] dark:border-amber-300/50 dark:bg-amber-400/20 dark:text-amber-200',
      style: {},
    }
  }
  return {
    className: 'border-white/40 bg-white/38 text-slate-700 dark:border-white/10 dark:bg-white/8 dark:text-slate-200',
    style: {},
  }
}

function RosterShelves({ rosterContext, teamId, accent }) {
  const rows = getRosterShelfRows(rosterContext, teamId)
  const manualActive = hasManualRosterOverride(teamId)
  const coreNames = new Set((rosterContext?.corePlayers || []).map(p => p.name))
  const contextByLabel = {
    Guards: 'Need: criação secundária e defesa no ponto de ataque',
    'Wings / Forwards': 'Need: tamanho, shooting e criação de vantagem',
    Bigs: 'Need: rebote, proteção de aro ou spacing',
  }
  if (!rosterContext && !manualActive) return null
  return (
    <div className="relative mt-2 flex h-[clamp(280px,35vh,390px)] shrink-0 flex-col overflow-visible rounded-[24px] border border-white/50 bg-white/28 p-3 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
      <div className="mb-2 flex shrink-0 flex-wrap items-center justify-between gap-2">
        <div className="font-mono text-[9px] font-black uppercase tracking-[.22em] text-lo">Roster Shelves</div>
        <span className="rounded-full bg-white/40 px-3 py-1 font-mono text-[8px] font-black uppercase tracking-[.14em] text-muted dark:bg-white/10">{manualActive ? 'manual' : `${rosterContext?.rotationPlayers?.length || 0} rotation`}</span>
      </div>
      <div className="grid min-h-0 flex-1 overflow-visible rounded-[20px] border border-white/30 bg-white/14 dark:border-white/10 dark:bg-white/5 lg:grid-cols-3">
      {rows.map(([label, players], index) => {
        const sortedPlayers = sortRosterPlayersByStatus(players.map(player => ({
          ...player,
          status: player.status || (player.roleTags?.includes('injured core') ? 'injured' : coreNames.has(player.name) ? 'core' : 'normal'),
        })))
        return (
        <div key={label} className={(index > 0 ? 'lg:border-l lg:border-white/30 lg:dark:border-white/10 ' : '') + 'flex min-h-0 flex-col p-3'}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="font-mono text-[9px] font-black uppercase tracking-[.18em] text-lo">{label}</div>
            <span className="rounded-full bg-white/36 px-2.5 py-1 font-mono text-[7px] font-black uppercase tracking-[.12em] text-muted dark:bg-white/10">{sortedPlayers.length}</span>
          </div>
          <div className="mt-2 flex min-h-0 flex-1 flex-wrap content-start items-start gap-1.5 overflow-visible">
            {sortedPlayers.length ? sortedPlayers.map(player => {
              const status = player.status || 'normal'
              const statusMeta = getRosterPlayerStatusMeta(status, accent)
              const title = player.note || player.roleTags?.join(' / ') || (status !== 'normal' ? status : undefined)
              return (
                <div key={player.name} title={title} className={'rounded-[14px] border px-3 py-1.5 text-[12px] font-black leading-tight ' + statusMeta.className} style={statusMeta.style}>
                  {player.name}
                </div>
              )
            }) : <span className="text-xs font-semibold text-muted">Sem peça clara</span>}
            {sortedPlayers.length < 3 && (
              <div className="rounded-[14px] border border-dashed border-white/45 bg-white/16 px-3 py-1.5 text-[12px] font-black leading-tight text-muted dark:border-white/10 dark:bg-white/5">
                + Necessidade
              </div>
            )}
          </div>
          <div className="mt-2 shrink-0 rounded-[14px] border border-white/30 bg-white/22 px-3 py-2 text-[10px] font-semibold leading-4 text-muted dark:border-white/10 dark:bg-white/5">
            {contextByLabel[label]}
          </div>
        </div>
      )})}
      </div>
    </div>
  )
}

function NextPicksStrip({ picks }) {
  if (!picks?.length) return null
  return (
    <GlassPanel className="mock-next-picks-strip mt-2 overflow-hidden p-2">
      <div className="mb-1.5 flex items-center justify-between gap-3 px-1">
        <div className="font-mono text-[9px] font-black uppercase tracking-[.22em] text-lo">Próximas escolhas</div>
        <span className="rounded-full bg-white/35 px-2.5 py-1 font-mono text-[7px] font-black uppercase tracking-[.14em] text-muted">{picks.length} picks</span>
      </div>
      <div className="relative overflow-hidden rounded-[18px] border border-white/40 bg-white/24 px-2.5 py-2 shadow-[inset_1px_1px_0_rgba(255,255,255,.34)] dark:border-white/10 dark:bg-white/5">
        <div className="relative flex items-center gap-2 overflow-x-auto pb-0.5 [scrollbar-width:thin]">
          {picks.map((pick, index) => (
            <div key={pick.pick} className={(index === 0 ? 'min-w-[76px] border-white/60 bg-white/56 shadow-[0_8px_18px_rgba(15,23,42,.06)]' : 'min-w-[68px] border-white/38 bg-white/34') + ' flex items-center justify-center gap-1.5 rounded-full border px-2.5 py-1.5 backdrop-blur-md dark:border-white/10 dark:bg-white/5'}>
              <span className="font-numeric text-[11px] font-extrabold leading-none tabular-nums" style={{ color: pick.ownerColor || '#7c5ccf' }}>#{pick.pick}</span>
              <span className="font-mono text-[8px] font-black uppercase tracking-[.12em] text-slate-700 dark:text-slate-200">{pick.ownerAbbr}</span>
            </div>
          ))}
        </div>
      </div>
    </GlassPanel>
  )
}

function MiniPlayerProfile({ prospect, owner, decision, isSelecting, pickNote = '', onPickNoteChange, onClose, onPick }) {
  const tier = getTierStyles(prospect.tier)
  const image = getPlayerCutoutImage(prospect)
  const metrics = getTopMetrics(prospect)
  const fitScore = Math.round(decision?.score || getFitScore(owner, prospect))
  const fitMeta = getDecisionLabel(decision, prospect, owner?.pick)
  const context = decision?.debug?.rosterContext
  const matched = (context?.matchedNeeds || decision?.debug?.matchedNeeds || []).slice(0, 2)
  const missed = (context?.missedNeeds || decision?.debug?.missedNeeds || []).slice(0, 2)
  const rosterSummary = context?.notes?.rotationPath || decision?.summary || 'Seleção analisada pelo contexto do time no relógio.'

  return (
    <motion.div className="fixed inset-0 z-[120] flex items-center justify-center overflow-x-hidden bg-slate-950/[.78] p-4 backdrop-blur-[18px]" initial={{ opacity: 0 }} animate={{ opacity: isSelecting ? .72 : 1 }} exit={{ opacity: 0 }} transition={{ duration: .24, ease: [0.22, 1, 0.36, 1] }} onClick={onClose}>
      <motion.div className="mx-auto w-full max-w-4xl overflow-x-hidden" initial={{ opacity: 0, y: 18, scale: .975 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .975 }} transition={{ duration: .28, ease: [0.22, 1, 0.36, 1] }} onClick={event => event.stopPropagation()}>
        <GlassPanel className="relative max-h-[calc(100vh-3rem)] overflow-y-auto overflow-x-hidden border-white/45 bg-white/[.92] p-4 shadow-[0_30px_90px_rgba(0,0,0,.35)] [scrollbar-width:thin] dark:border-white/10 dark:bg-slate-950/[.94]">
          <span className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full blur-3xl" style={{ background: tier.color, opacity: .14 }} />
          <div className="relative flex flex-wrap items-start justify-between gap-4">
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <span className="relative flex h-24 w-24 shrink-0 items-end justify-center overflow-hidden rounded-[28px] border border-white/40 bg-white/32 dark:border-white/10 dark:bg-white/10">
                {image ? <img src={image} alt={prospect.name} className="h-[116%] w-[116%] object-contain object-bottom" draggable="false" /> : <span className="mb-8 font-display text-2xl font-black" style={{ color: tier.color }}>{initials(prospect.name)}</span>}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full px-3 py-1 font-mono text-[8px] font-black uppercase tracking-[.14em]" style={{ background: tier.bg, color: tier.text }}>#{prospect.rank} / {prospect.position}</span>
                  <span className="rounded-full px-3 py-1 font-mono text-[8px] font-black uppercase tracking-[.14em]" style={{ background: fitMeta.bg, color: fitMeta.color }}>{fitMeta.label}</span>
                  <span className="rounded-full bg-white/40 px-3 py-1 font-mono text-[8px] font-black uppercase tracking-[.14em] text-muted dark:bg-white/10">{prospect.team}</span>
                </div>
                <h3 className="mt-3 font-display text-3xl font-black leading-none text-slate-800 dark:text-slate-50">{prospect.name}</h3>
                <div className="mt-2 text-xs font-bold text-muted">{prospect.age || '-'} anos / {prospect.height || '-'} / {prospect.weight || '-'} / {prospect.wingspan || '-'}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-numeric text-5xl font-extrabold leading-none tabular-nums" style={{ color: getDraftDecisionColor(fitScore) }}>{fitScore}</div>
              <div className="mt-1 font-mono text-[8px] font-black uppercase tracking-[.15em] text-lo">Fit Score</div>
            </div>
          </div>

          <div className="relative mt-4 grid gap-3 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-3">
              <QuickStatsRow metrics={metrics} color={tier.color} />
              <div className="rounded-[22px] border border-white/40 bg-white/26 p-3 dark:border-white/10 dark:bg-white/5">
                <div className="font-mono text-[8px] font-black uppercase tracking-[.2em] text-lo">Draft Decision</div>
                <p className="mt-2 text-xs font-semibold leading-5 text-muted">{decision?.summary || 'Leitura baseada em necessidade, range, board value e risco.'}</p>
              </div>
            </div>
            <div className="rounded-[22px] border border-white/40 bg-white/26 p-3 dark:border-white/10 dark:bg-white/5">
              <div className="font-mono text-[8px] font-black uppercase tracking-[.2em] text-lo">Roster Context</div>
              <p className="mt-2 text-xs font-semibold leading-5 text-muted">{rosterSummary}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <NeedMiniGroup title="Matched" items={matched} color="#4f9577" />
                <NeedMiniGroup title="Missed" items={missed} color="#d88754" />
              </div>
              <div className="mt-3 rounded-[18px] border border-white/40 bg-white/36 p-3 shadow-[inset_1px_1px_0_rgba(255,255,255,.55)] dark:border-white/10 dark:bg-white/8">
                <label className="font-mono text-[7px] font-black uppercase tracking-[.18em] text-lo" htmlFor={`pick-note-${prospect.id}`}>
                  Sua anotação sobre a escolha
                </label>
                <textarea
                  id={`pick-note-${prospect.id}`}
                  value={pickNote}
                  onChange={event => onPickNoteChange?.(event.target.value)}
                  maxLength={260}
                  rows={3}
                  placeholder="Ex: boa escolha pelo encaixe defensivo, mas eu preferiria mais criação com bola."
                  className="mt-2 min-h-[76px] w-full resize-none rounded-[16px] border border-white/45 bg-white/62 px-3 py-2 text-xs font-semibold leading-5 text-slate-700 outline-none placeholder:text-slate-400 focus:border-sky-300/70 focus:ring-2 focus:ring-sky-200/40 dark:border-white/10 dark:bg-slate-950/55 dark:text-slate-100 dark:placeholder:text-slate-500"
                />
                <div className="mt-1 text-right font-mono text-[7px] font-black uppercase tracking-[.12em] text-muted">{pickNote.length}/260</div>
              </div>
            </div>
          </div>

          <div className="relative mt-4 grid gap-3 md:grid-cols-2">
            <DecisionNotes title="Positives" items={decision?.positives?.slice(0, 3) || []} color="#4f9577" />
            <DecisionNotes title="Warnings" items={decision?.warnings?.slice(0, 3) || []} color="#d88754" />
          </div>

          <div className="relative mt-4 flex flex-wrap justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-full border border-white/45 bg-white/35 px-4 py-2.5 font-mono text-[8px] font-black uppercase tracking-[.16em] text-muted backdrop-blur-md transition-transform hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5">Fechar</button>
            <button type="button" onClick={onPick} className="rounded-full px-5 py-2.5 font-mono text-[8px] font-black uppercase tracking-[.16em] text-white transition-transform hover:-translate-y-0.5 active:scale-95" style={{ background: tier.color, boxShadow: '0 14px 30px ' + tier.glow }}>Draftar jogador</button>
          </div>
        </GlassPanel>
      </motion.div>
    </motion.div>
  )
}

function NeedMiniGroup({ title, items, color }) {
  return (
    <div>
      <div className="font-mono text-[7px] font-black uppercase tracking-[.16em] text-lo">{title}</div>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {items?.length ? items.map(item => <span key={item} className="rounded-full px-2 py-1 font-mono text-[7px] font-black uppercase tracking-[.1em]" style={{ background: color + '16', color }}>{item}</span>) : <span className="text-[11px] font-semibold text-muted">-</span>}
      </div>
    </div>
  )
}

function MadePicksRail({ rows }) {
  return (
    <GlassPanel className="mock-made-picks h-full overflow-hidden p-3">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <div className="font-mono text-[9px] font-black uppercase tracking-[.22em] text-lo">Escolhas feitas</div>
          <div className="mt-1 text-[11px] font-semibold text-muted">Board confirmado</div>
        </div>
        <span className="rounded-full bg-white/40 px-2.5 py-1 font-mono text-[8px] font-black uppercase tracking-[.14em] text-muted dark:bg-white/10">{rows.length}</span>
      </div>
      {rows.length ? (
        <div className="space-y-2 overflow-y-auto pr-1 [scrollbar-width:thin]" style={{ maxHeight: 'calc(100vh - 13rem)' }}>
          {rows.map(row => {
            const tier = getTierStyles(row.prospect.tier)
            const fit = Math.round(getFitScore(row.pick, row.prospect))
            return (
              <div key={row.pickNo} className="rounded-[20px] border border-white/35 bg-white/32 p-3 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-numeric text-lg font-extrabold" style={{ color: row.pick.ownerColor || tier.color }}>#{row.pickNo}</span>
                  <TeamLogoGlass teamId={row.pick.ownerAbbr} size="sm" showGlow={row.pickNo <= 4} />
                </div>
                <div className="mt-2 font-mono text-[7px] font-black uppercase tracking-[.14em] text-muted">{row.pick.ownerName}</div>
                <div className="mt-1 text-sm font-black leading-tight text-slate-800 dark:text-slate-100">{row.prospect.name}</div>
                <div className="mt-1 font-mono text-[7px] font-black uppercase tracking-[.12em] text-muted">{row.prospect.position} / {row.prospect.team} / Fit {fit}</div>
                <p className="mt-2 text-[11px] font-semibold leading-4 text-muted">{fit >= 78 ? 'Talento e contexto alinham uma decisão de alto valor.' : 'Escolha registrada no histórico da noite.'}</p>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="rounded-[22px] border border-dashed border-white/45 bg-white/22 p-4 text-xs font-semibold leading-5 text-muted dark:border-white/10 dark:bg-white/5">
          <div className="font-display text-lg font-black text-slate-800 dark:text-slate-100">Nenhuma escolha feita ainda.</div>
          <p className="mt-2">Quando o board começar, esta área vira o histórico editorial da noite: pick, time, jogador, fit score e lógica da decisão.</p>
        </div>
      )}
    </GlassPanel>
  )
}

function TeamOnTheClockPanel({ owner, prospect, draftFit, bestFit, draftDecision, recommendations, selecting, picks, resolvedPicks, onPreview, onRecommendPick, onAutoPick }) {
  const fit = draftDecision?.score || bestFit?.score || draftFit?.score || getFitScore(owner, prospect)
  const remaining = resolvedPicks.filter((p, idx) => idx >= (selecting || 0) && p.ownerAbbr === owner?.ownerAbbr).length
  const madePicks = resolvedPicks
    .map((pick, idx) => ({ pickNo: idx + 1, pick, prospect: prospects.find(p => p.id === picks[idx]) }))
    .filter(row => row.pick.ownerAbbr === owner?.ownerAbbr && row.prospect)
  const needs = getTeamNeedChips(owner?.ownerAbbr)
  const glow = owner?.ownerColor || '#7c5ccf'
  return (
    <motion.div
      animate={{ scale: [1, 1.012, 1], boxShadow: ['0 8px 30px rgba(0,0,0,.04)', '0 18px 48px ' + glow + '24', '0 8px 30px rgba(0,0,0,.04)'] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      className="mock-team-clock will-change-transform rounded-[30px] border border-white/60 bg-white/48 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl"
      style={{ background: owner?.ownerColor ? 'radial-gradient(circle at 50% 0%, '+owner.ownerColor+'1f, transparent 40%), rgba(255,255,255,.48)' : undefined }}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-mono text-[10px] font-black uppercase tracking-[.24em] text-lo">On The Clock</div>
          <div className="mt-1 font-display text-2xl font-black text-slate-800">Team Command Panel</div>
        </div>
        <TeamLogoGlass teamId={owner?.ownerAbbr} size="lg" showGlow />
      </div>
      <div className="mt-3 rounded-[26px] border border-white/45 bg-white/30 p-4 backdrop-blur-md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="font-numeric text-3xl font-extrabold tracking-tight 3xl:text-4xl" style={{ color: owner?.ownerColor }}>#{owner?.pick}</div>
            <div className="mt-1 font-display text-xl font-black text-slate-800">{owner?.ownerName}</div>
            <div className="mt-1 font-mono text-[9px] font-bold uppercase tracking-[.18em] text-muted">{owner?.viaAbbr ? 'via ' + owner.viaAbbr : owner?.originalTeam?.record || 'First round'}</div>
          </div>
          <motion.span animate={{ opacity: [.75, 1, .75] }} transition={{ duration: 1.8, repeat: Infinity }} className="rounded-full bg-white/45 px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[.16em] text-muted">On the Clock</motion.span>
        </div>
        <p className="mt-3 text-xs font-semibold leading-5 text-muted">Escolha baseada em board, estrategia e necessidade.</p>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <InfoLine label="Status" value={selecting !== null ? 'Escolhendo agora' : 'Draft completo'} />
        <InfoLine label="Picks restantes" value={remaining || 0} />
        <InfoLine label="Decision" value={Math.round(fit)} accent={getDraftDecisionColor(fit)} />
      </div>
      <TeamPreviousPicks rows={madePicks} color={owner?.ownerColor || '#7c5ccf'} />
      <div className="mt-4 rounded-[22px] border border-white/55 bg-white/30 p-3">
        <div className="font-mono text-[9px] font-black uppercase tracking-[.2em] text-lo">Team Needs</div>
        <div className="mt-3 flex flex-wrap gap-2">{needs.map(x => <span key={x} className="rounded-full bg-white/45 px-3 py-1 font-mono text-[8px] font-black uppercase tracking-[.12em] text-muted">{x}</span>)}</div>
      </div>
      <DecisionContextCard owner={owner} />
      <DraftRecommendationsPanel owner={owner} recommendations={recommendations} onPreview={onPreview} onPick={onRecommendPick} />
      <button type="button" onClick={onAutoPick} className="mt-4 w-full rounded-full px-5 py-3 font-mono text-[10px] font-black uppercase tracking-[.18em] text-slate-700" style={{ background: '#edeae4', boxShadow: '4px 4px 10px #d4d0ca, -4px -4px 10px #fff' }}>Auto pick melhor decisao</button>
      <DraftSummary picks={picks} resolvedPicks={resolvedPicks} />
    </motion.div>
  )
}

function TeamPreviousPicks({ rows, color }) {
  return (
    <div className="mock-team-picks-made mt-5 rounded-[24px] border border-white/55 bg-white/30 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="font-mono text-[9px] font-black uppercase tracking-[.2em] text-lo">Escolhas do time</div>
        <span className="rounded-full bg-white/38 px-2.5 py-1 font-mono text-[8px] font-black uppercase tracking-[.14em] text-muted">{rows.length}</span>
      </div>
      {rows.length ? (
        <div className="mt-3 grid gap-2">
          {rows.map(row => {
            const tier = getTierStyles(row.prospect.tier)
            return (
              <div key={row.pickNo} className="flex items-center gap-3 rounded-[18px] bg-white/28 px-3 py-2">
                <span className="w-8 shrink-0 font-numeric text-lg font-extrabold leading-none" style={{ color }}>#{row.pickNo}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-black text-slate-800">{row.prospect.name}</span>
                  <span className="block truncate font-mono text-[7px] font-black uppercase tracking-[.14em] text-muted">{row.prospect.position} / rank #{row.prospect.rank}</span>
                </span>
                <span className="rounded-full px-2 py-1 font-mono text-[7px] font-black uppercase tracking-[.12em]" style={{ background: tier.bg, color: tier.text }}>{tier.label}</span>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="mt-3 text-xs font-semibold leading-5 text-muted">Este time ainda nao fez nenhuma escolha neste mock.</p>
      )}
    </div>
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
    <div className="mt-4 rounded-[26px] border border-white/55 bg-white/28 p-3 backdrop-blur-md">
      <div className="font-mono text-[9px] font-black uppercase tracking-[.22em] text-lo">Recommendation for {owner?.ownerAbbr}</div>
      <p className="mt-1 text-[11px] font-semibold leading-4 text-muted">Draft Decision por necessidade, papel, range, board value e risco.</p>
      <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: .06, delayChildren: .04 } } }} className="mt-3 grid gap-2.5">
        {recommendations.length ? recommendations.map((item, index) => <DraftRecommendationCard key={item.player.id} item={item} index={index} onPreview={onPreview} onPick={onPick} />) : <div className="rounded-[22px] bg-white/35 p-4 text-sm font-bold text-muted">Selecione um prospecto para gerar a decisao da war room.</div>}
      </motion.div>
    </div>
  )
}

function DraftRecommendationCard({ item, index, onPreview, onPick }) {
  const { player, decision } = item
  const tier = getTierStyles(player.tier)
  const scoreColor = getDraftDecisionColor(decision.score)
  const bars = [
    ['Need', decision.breakdown?.needFit],
    ['Board', decision.breakdown?.boardValue],
    ['Range', decision.breakdown?.draftRange],
    ['Role', decision.breakdown?.roleFit],
    ['Risk', decision.breakdown?.riskFit],
  ]
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: .25, ease: [0.22, 1, 0.36, 1] } } }} onPointerEnter={() => onPreview(player.id)} whileHover={{ y: -3, scale: 1.012 }} className="will-change-transform rounded-[22px] border border-white/45 bg-white/34 p-3 backdrop-blur-md transition-shadow duration-200 hover:shadow-[0_16px_42px_rgba(124,92,207,.14)]">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-black" style={{ background: index === 0 ? '#eee9fb' : 'rgba(255,255,255,.45)', color: index === 0 ? '#5d46a3' : '#8b837c' }}>#{index + 1}</div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2"><div className="truncate text-sm font-black text-slate-800">{player.name}</div><span className="font-numeric text-2xl font-extrabold tracking-tight tabular-nums" style={{ color: scoreColor }}>{Math.round(decision.score)}</span></div>
          <div className="mt-1 font-mono text-[8px] font-bold uppercase tracking-[.15em] text-muted">rank #{player.rank} / {player.position} / {decision.grade}</div>
          <p className="mt-2 text-[11px] font-semibold leading-4 text-slate-600">{decision.recommendationType}</p>
          <p className="mt-1 text-[11px] font-semibold leading-4 text-muted">{decision.summary}</p>
          <div className="mt-2 grid gap-1.5">
            {bars.map(([label, value]) => <CompactFitBar key={label} label={label} value={value} color={scoreColor} />)}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">{decision.positives?.slice(0,2).map(flag => <span key={flag} className="rounded-full bg-white/45 px-2 py-1 font-mono text-[7px] font-black uppercase tracking-[.12em] text-muted">{flag}</span>)}{decision.warnings?.slice(0,1).map(flag => <span key={flag} className="rounded-full bg-amber-100/50 px-2 py-1 font-mono text-[7px] font-black uppercase tracking-[.12em] text-amber-700">{flag}</span>)}</div>
        </div>
      </div>
      <button type="button" onClick={() => onPick(player.id)} className="mt-3 w-full rounded-full px-4 py-2 font-mono text-[8px] font-black uppercase tracking-[.16em] transition-transform hover:-translate-y-0.5" style={{ background: tier.color, color: 'white', boxShadow: '0 12px 24px ' + tier.glow }}>{index === 0 ? 'Selecionar melhor decisao' : 'Selecionar'}</button>
    </motion.div>
  )
}

function CompactFitBar({ label, value, color }) {
  const safe = clamp(Number(value) || 0)
  return (
    <div className="grid grid-cols-[72px_1fr_28px] items-center gap-2">
      <span className="truncate font-mono text-[7px] font-black uppercase tracking-[.12em] text-muted">{label}</span>
      <span className="h-1.5 overflow-hidden rounded-full bg-white/38">
        <span className="block h-full rounded-full" style={{ width: safe + '%', background: color }} />
      </span>
      <span className="text-right font-numeric text-[10px] font-black tabular-nums text-slate-700">{Math.round(safe)}</span>
    </div>
  )
}
function DraftFilterChips({ active, setActive, compact = false }) {
  return (
    <div className={(compact ? 'mock-draft-filters mock-draft-filters-compact' : 'mock-draft-filters')}>
      <span className="mock-draft-filter-label">Board Mode</span>
      <span className="mock-draft-filter-list">
        {FILTERS.map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setActive(id)}
            className="mock-draft-filter-chip"
            data-active={active === id ? 'true' : 'false'}
          >
            {label}
          </button>
        ))}
      </span>
    </div>
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
      <motion.span className="absolute -right-28 top-24 h-96 w-96 rounded-full blur-3xl" animate={{ backgroundColor: color, opacity: intensity }} transition={{ duration: .16 }} />
      <motion.span className="absolute -left-28 bottom-20 h-96 w-96 rounded-full bg-sky-100/50 blur-3xl" animate={{ opacity: intensity * 1.4 }} transition={{ duration: .16 }} />
    </motion.div>
  )
}

function WarRoomHeader({ owner, selecting }) {
  if (!owner) return null
  return (
    <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .38, ease: [0.22, 1, 0.36, 1] }} className="relative overflow-hidden rounded-[28px] border border-white/50 bg-white/36 p-4 backdrop-blur-xl" style={{ boxShadow: '0 18px 46px ' + (owner.ownerColor || '#7c5ccf') + '18' }}>
      <span className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full blur-3xl" style={{ background: owner.ownerColor || '#7c5ccf', opacity: .18 }} />
      <div className="relative flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <TeamLogoGlass teamId={owner.ownerAbbr} size="md" showGlow />
          <div>
            <div className="font-mono text-[9px] font-black uppercase tracking-[.26em] text-lo">War Room</div>
            <h2 className="mt-1 font-display text-2xl font-black tracking-tight text-slate-800 3xl:text-3xl">Pick #{(selecting ?? 0) + 1} / {owner.ownerName} is on the clock</h2>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/40 bg-white/30 px-3 py-2 backdrop-blur-md">
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
      {overlay && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .22, ease: [0.22, 1, 0.36, 1] }} className="mock-pick-overlay fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/68 p-4 backdrop-blur-[2px]">
        <PickConfirmScene overlay={overlay} />
      </motion.div>}
    </AnimatePresence>
  )
}

function PickConfirmScene({ overlay }) {
  const prospect = overlay.prospect
  const team = overlay.team
  const tier = getTierStyles(prospect?.tier)
  const image = prospect ? getPlayerCutoutImage(prospect) : null
  const color = team?.ownerColor || '#7c5ccf'
  const logo = getTeamLogo(team?.ownerAbbr)
  return (
    <motion.div initial={{ opacity: 0, scale: .985 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .992 }} transition={{ duration: .3, ease: [0.16, 1, 0.3, 1] }} className="mock-pick-card relative z-10 w-full max-w-4xl overflow-hidden rounded-[42px] border border-white/70 bg-white/[.97] p-5 text-left shadow-[0_24px_66px_rgba(0,0,0,.32)] dark:border-white/15 dark:bg-slate-950/[.97] sm:p-6">
      <span className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full opacity-20" style={{ background: `radial-gradient(circle, ${color} 0%, ${color}66 38%, transparent 70%)` }} />
      <div className="relative grid items-center gap-5 md:grid-cols-[190px_minmax(0,1fr)]">
        <div className="flex items-center justify-center md:justify-start">
          <div className="relative flex h-44 w-44 items-center justify-center rounded-[36px] border border-white/60 bg-white/72 shadow-[inset_1px_1px_0_rgba(255,255,255,.72),0_16px_36px_rgba(15,23,42,.14)] dark:border-white/10 dark:bg-white/10">
            <span className="absolute -left-3 -top-3 z-0 flex h-24 w-24 items-center justify-center rounded-[30%] border border-white/55 bg-white/85 shadow-[0_12px_26px_rgba(0,0,0,.13)] dark:border-white/10 dark:bg-slate-900/88">
              {logo ? <img src={logo} alt={team?.ownerAbbr || 'Team'} className="h-16 w-16 object-contain" draggable="false" /> : <span className="font-mono text-sm font-black" style={{ color }}>{team?.ownerAbbr || '--'}</span>}
            </span>
            {image && <img src={image} alt={prospect.name} className="mock-pick-player-image relative z-10 h-40 w-40 object-contain object-bottom" draggable="false" />}
          </div>
        </div>
        <div className="min-w-0 text-center md:text-left">
          <div className="font-mono text-[10px] font-black uppercase tracking-[.28em] text-lo">Pick #{overlay.pickNo}</div>
          <div className="mt-3 font-mono text-[10px] font-black uppercase tracking-[.22em]" style={{ color }}>{team?.ownerName} seleciona</div>
          <h2 className="mt-2 text-balance font-display text-5xl font-black leading-[.92] tracking-tight text-slate-900 dark:text-white sm:text-6xl">{prospect?.name || 'Pick confirmado'}</h2>
          <div className="mt-5 flex flex-wrap justify-center gap-2 md:justify-start">
            <span className="rounded-full bg-white/65 px-4 py-2 font-mono text-[9px] font-black uppercase tracking-[.14em] text-muted dark:bg-white/10">{prospect?.position || '-'}</span>
            <span className="rounded-full px-4 py-2 font-mono text-[9px] font-black uppercase tracking-[.14em]" style={{ background: tier.bg, color: tier.text }}>{tier.label}</span>
            <span className="rounded-full bg-white/65 px-4 py-2 font-mono text-[9px] font-black uppercase tracking-[.14em] text-muted dark:bg-white/10">{prospect?.team || '-'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function NextPickScene({ overlay }) {
  const team = overlay.team
  return (
    <motion.div {...motionPresets.heroReveal} className="relative z-10 w-full max-w-3xl overflow-hidden rounded-[38px] border border-white/55 bg-white/45 p-5 text-center 3xl:p-8 shadow-[0_30px_90px_rgba(0,0,0,.10)] backdrop-blur-2xl">
      <div className="font-mono text-[10px] font-black uppercase tracking-[.32em] text-lo">Next on the clock</div>
      <div className="mt-5 flex justify-center"><TeamLogoGlass teamId={team?.ownerAbbr} size="xl" showGlow /></div>
      <div className="mt-5 font-display text-4xl font-black 3xl:text-5xl 3xl:text-6xl text-slate-800">Pick #{overlay.pickNo}</div>
      <div className="mt-2 font-display text-3xl font-black 3xl:text-4xl" style={{ color: team?.ownerColor || '#7c5ccf' }}>{team?.ownerName}</div>
    </motion.div>
  )
}

function PickConfirmationToast({ toast }) {
  return <AnimatePresence>{toast && <motion.div initial={{ opacity: 0, y: 18, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: .96 }} transition={{ duration: .26, ease: [0.22, 1, 0.36, 1] }} className="fixed bottom-7 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/70 bg-white/75 px-6 py-3 font-mono text-[10px] font-black uppercase tracking-[.18em] text-slate-700 shadow-[0_18px_40px_rgba(0,0,0,.10)] backdrop-blur-xl">
    Pick #{toast.pick} confirmado / {toast.name}
    {toast.team && <span className="ml-2 text-[#7c5ccf]">Selected by {toast.team}</span>}
  </motion.div>}</AnimatePresence>
}

function getDraftRows(picks, resolvedPicks, pickNotes = {}) {
  return resolvedPicks.slice(0, TOTAL_PICKS).map((pick, idx) => {
    const prospect = prospects.find(p => p.id === picks[idx]) || null
    return { pickNo: idx + 1, pick, prospect, note: String(pickNotes[idx] || '').trim() }
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
      detail: steal ? 'Caiu ' + getValueDelta(steal) + ' posicoes: saiu apenas na #' + steal.pickNo + ' mesmo projetado como #' + steal.prospect.rank + ', gerando valor real para ' + steal.pick.ownerName + '.' : 'Nenhum jogador caiu pelo menos 6 posicoes em relacao ao board.' ,
      color: '#4f9577',
    },
    {
      title: 'Reach monitorado',
      main: reach?.prospect?.name || '-',
      detail: reach ? 'Saiu ' + Math.abs(getValueDelta(reach)) + ' posicoes antes do projetado: pick #' + reach.pickNo + ' para um jogador ranqueado como #' + reach.prospect.rank + '.' : 'Nenhuma escolha ficou 6+ posicoes acima do board.' ,
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

function DraftResultsScreen({ picks, resolvedPicks, pickNotes = {}, onReset, onHome }) {
  const rows = getDraftRows(picks, resolvedPicks, pickNotes)
  const first = rows[0]
  const firstTier = getTierStyles(first?.prospect?.tier)
  const insights = getDraftInsights(rows)
  const shareRef = useRef(null)
  const [exporting, setExporting] = useState(false)

  const exportImage = async () => {
    if (!shareRef.current || exporting) return
    setExporting(true)
    await new Promise(resolve => window.requestAnimationFrame(() => window.requestAnimationFrame(resolve)))
    try {
      if (document.fonts?.ready) await document.fonts.ready
      const dataUrl = await toPng(shareRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        width: 1080,
        height: 1350,
        canvasWidth: 1080,
        canvasHeight: 1350,
        backgroundColor: document.documentElement.classList.contains('theme-dark') ? '#101722' : '#edeae4',
      })
      const link = document.createElement('a')
      link.download = 'nba-draft-2026-mock-draft.png'
      link.href = dataUrl
      link.click()
    } finally {
      setExporting(false)
    }
  }

  return (
    <motion.section initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55, ease: 'easeOut' }} className="mx-auto max-w-[1480px] space-y-5 3xl:max-w-7xl 3xl:space-y-6">
      <GlassPanel className="mock-results-hero relative overflow-hidden p-5 text-center 3xl:p-8" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(124,92,207,.18), transparent 36%), linear-gradient(145deg, rgba(255,255,255,.66), rgba(238,233,251,.52))' }}>
        <div className="absolute left-8 top-8 rounded-full bg-white/45 px-4 py-2 font-mono text-[9px] font-black uppercase tracking-[.2em] text-muted">Draft Results</div>
        <div className="font-mono text-[10px] font-black uppercase tracking-[.28em]" style={{ color: firstTier.color }}>Pick #1</div>
        <h1 className="mt-3 font-display text-4xl font-black 3xl:text-5xl tracking-tight text-slate-800 3xl:text-7xl">Draft Finalizado</h1>
        <div className="mx-auto mt-6 max-w-2xl rounded-[30px] 3xl:max-w-3xl 3xl:rounded-[34px] border border-white/65 bg-white/45 p-5 3xl:p-6 shadow-[0_18px_50px_rgb(0,0,0,0.05)] backdrop-blur-xl">
          <div className="font-mono text-[10px] font-black uppercase tracking-[.22em] text-muted">{first?.pick?.ownerName || '-'}</div>
          <div className="mt-2 font-display text-3xl font-black 3xl:text-4xl tracking-tight text-slate-800">{first?.prospect?.name || 'Pick nao registrado'}</div>
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
            <button type="button" onClick={exportImage} className="rounded-full bg-white/44 px-6 py-3 font-mono text-[10px] font-black uppercase tracking-[.18em] text-muted transition-transform hover:-translate-y-0.5">{exporting ? 'Gerando imagem...' : 'Exportar imagem'}</button>
          </div>
        </GlassPanel>
      </motion.div>
      <div className="mock-draft-share-capture" aria-hidden="true">
        <div ref={shareRef}>
          <MockDraftShareCard rows={rows} insights={insights} />
        </div>
      </div>
    </motion.section>
  )
}

function MockDraftShareCard({ rows, insights }) {
  const top = rows.slice(0, 30)
  const columns = [top.slice(0, 10), top.slice(10, 20), top.slice(20, 30)]
  const date = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date())
  const headlinePick = top.find(row => row.prospect) || top[0]
  return (
    <section className="mock-draft-share-card">
      <header className="mock-share-header">
        <div>
          <div className="mock-share-kicker">Rookies Brasil / Mock Draft Simulator</div>
          <h1>2026 NBA Mock Draft</h1>
          <p>1st Round Draft / 30 picks / War Room Board</p>
        </div>
        <div className="mock-share-badge">
          <span>Round</span>
          <strong>01</strong>
          <small>{date}</small>
        </div>
      </header>

      <main className="mock-share-board">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="mock-share-column">
            {column.map(row => {
              const tier = getTierStyles(row.prospect?.tier)
              const image = row.prospect ? getPlayerCutoutImage(row.prospect) : null
              const note = String(row.note || '').trim()
              return (
                <div key={row.pickNo} className={'mock-share-pick-card ' + (note ? 'has-note' : '')} style={{ '--row-color': row.pick.ownerColor || tier.color }}>
                  <div className="mock-share-pick-number">#{String(row.pickNo).padStart(2, '0')}</div>
                  <div className="mock-share-photo" style={{ '--photo-color': tier.color }}>
                    {image ? <img src={image} alt={row.prospect?.name || 'Player'} draggable="false" /> : <span>{initials(row.prospect?.name || 'SP')}</span>}
                  </div>
                  <div className="mock-share-pick-main">
                    <div className="mock-share-player-name">{row.prospect?.name || 'Sem escolha'}</div>
                    <div className="mock-share-meta">
                      <span>{row.prospect?.position || '-'}</span>
                      <span>{row.prospect?.height || '-'}</span>
                      <span>{row.prospect?.team || '-'}</span>
                    </div>
                    <div className="mock-share-team-line">
                      <span>{row.pick.ownerAbbr}</span>
                      <small>{row.pick.viaAbbr ? 'via ' + row.pick.viaAbbr : 'pick owner'}</small>
                    </div>
                    {note && <div className="mock-share-note">Nota: {note}</div>}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </main>

      <footer className="mock-share-footer">
        <div className="mock-share-footer-cell mock-share-footer-primary">
          <span>#{String(headlinePick?.pickNo || 1).padStart(2, '0')}</span>
          <strong>{headlinePick?.prospect?.name || 'Mock Draft Board'}</strong>
        </div>
        <div className="mock-share-footer-cell mock-share-footer-center">
          <strong>{headlinePick?.pick?.ownerName || insights?.[3]?.main || 'War Room'}</strong>
        </div>
        <div className="mock-share-footer-cell mock-share-footer-brand">
          <span>Rookies Brasil</span>
          <strong>Mock Draft Board</strong>
        </div>
      </footer>
    </section>
  )
}

function DraftPickList({ rows }) {
  const teamGrades = groupDraftByTeam(rows.filter(row => row.prospect)).reduce((acc, team) => {
    acc[team.key] = getTeamDraftGrade(team.rows)
    return acc
  }, {})

  return (
    <GlassPanel className="mock-draft-results p-5">
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
            <motion.div key={row.pickNo} whileHover={{ x: 4, scale: 1.006 }} className="mock-draft-result-row rounded-[24px] border border-white/45 px-4 py-3 transition-all" style={{ '--pick-color': row.pickNo <= 5 ? '#7c5ccf' : '#4f86ad', background: band }}>
              <div className="grid items-center gap-3 md:grid-cols-[64px_48px_1fr_1.15fr_92px_76px]">
                <div className="font-numeric text-2xl font-extrabold tracking-tight" style={{ color: row.pickNo <= 5 ? '#7c5ccf' : '#4f86ad' }}>#{row.pickNo}</div>
                <TeamLogoGlass teamId={row.pick.ownerAbbr} size="md" showGlow={row.pickNo <= 14} />
                <div className="min-w-0"><div className="truncate text-sm font-black text-slate-800">{row.pick.ownerName}</div><div className="mt-0.5 font-mono text-[8px] font-bold uppercase tracking-[.16em] text-muted">{row.pick.viaAbbr ? 'via ' + row.pick.viaAbbr : row.pick.originalTeam?.record || 'First round'}</div></div>
                <div className="min-w-0"><div className="truncate text-sm font-black text-slate-800">{row.prospect?.name || 'Sem escolha'}</div><div className="mt-0.5 font-mono text-[8px] font-bold uppercase tracking-[.16em] text-muted">{row.prospect?.position || '-'} / rank #{row.prospect?.rank || '-'}</div></div>
                <div className="justify-self-start rounded-full px-3 py-1 font-mono text-[8px] font-black uppercase tracking-[.13em] md:justify-self-end" style={{ background: tier.bg, color: tier.text }}>{tier.label}</div>
                <div className="justify-self-start rounded-full bg-white/50 px-3 py-1 font-mono text-[8px] font-black uppercase tracking-[.13em] text-slate-700 md:justify-self-end">Nota {grade}</div>
              </div>
              {row.note && (
                <div className="mt-3 rounded-[18px] border border-white/40 bg-white/38 px-4 py-3 text-xs font-semibold leading-5 text-slate-600 shadow-[inset_1px_1px_0_rgba(255,255,255,.48)]">
                  <span className="mr-2 font-mono text-[8px] font-black uppercase tracking-[.16em] text-lo">Sua nota</span>
                  {row.note}
                </div>
              )}
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
