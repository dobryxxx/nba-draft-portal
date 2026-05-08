import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { DndContext, DragOverlay, PointerSensor, pointerWithin, rectIntersection, useDraggable, useDroppable, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ArrowDown, ArrowUp, BarChart3, Download, Eye, GripVertical, Plus, RotateCcw, Search, Sparkles, X } from 'lucide-react'
import { toPng } from 'html-to-image'
import { getPlayerCutoutImage } from '../utils/playerImages'

const BOARD_TIERS = [
  { id: 'ELITE', label: 'Elite', range: 'Top 1-5', color: '#7c5ccf', bg: '#eee9fb', text: '#5d46a3', glass: 'rgba(238,233,251,.72)' },
  { id: 'LOTTERY', label: 'Lottery', range: 'Top 6-14', color: '#5aaed6', bg: '#edf7fd', text: '#3f7fa0', glass: 'rgba(237,247,253,.68)' },
  { id: 'MID_1ST', label: 'Mid 1st', range: '15-30', color: '#c9a941', bg: '#fbf4d2', text: '#8a7023', glass: 'rgba(251,244,210,.68)' },
  { id: 'SLEEPER', label: 'Sleeper', range: 'Value plays', color: '#e6a06f', bg: '#faeee5', text: '#a8663b', glass: 'rgba(250,238,229,.70)' },
]

const normalizeTier = tier => ({ ALL_STAR: 'LOTTERY', STARTER: 'MID_1ST', FRINGE: 'MID_1ST', ROLE_PLAYER: 'SLEEPER' }[tier] || tier)
const emptyBoard = () => BOARD_TIERS.reduce((acc, tier) => ({ ...acc, [tier.id]: [] }), {})
const fmt = value => (typeof value === 'number' ? value.toFixed(1) : '-')
const pct = value => (typeof value === 'number' ? Math.max(0, Math.min(100, value)) : 0)
const EXPORT_LIMIT = 30

function cleanBoard(current, prospects = []) {
  const knownIds = new Set(prospects.map(p => p.id))
  return BOARD_TIERS.reduce((acc, tier) => ({
    ...acc,
    [tier.id]: (current[tier.id] || []).filter(id => knownIds.has(id)),
  }), {})
}

function boardCollisionDetection(args) {
  const pointerCollisions = pointerWithin(args)
  return pointerCollisions.length ? pointerCollisions : rectIntersection(args)
}

const snapOverlayToCursor = ({ activatorEvent, draggingNodeRect, transform }) => {
  if (!activatorEvent || !draggingNodeRect || !('clientX' in activatorEvent)) return transform
  return {
    ...transform,
    x: transform.x + activatorEvent.clientX - draggingNodeRect.left - draggingNodeRect.width / 2,
    y: transform.y + activatorEvent.clientY - draggingNodeRect.top - draggingNodeRect.height / 2,
  }
}

function initials(name = '') {
  return String(name).split(' ').filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase()
}

function getArchetype(prospect) {
  const s = prospect.stats || {}
  const pos = String(prospect.position || '').toUpperCase()
  if ((s.ppg || 0) >= 20 && (s.ts || 0) >= 58) return 'Primary scorer'
  if ((s.apg || 0) >= 5) return 'Advantage creator'
  if ((s.threep || 0) >= 37) return 'Spacing swing'
  if (Math.max(s.stlPct || 0, s.blkPct || 0) >= 3.5) return 'Defensive tool'
  if (pos.includes('C')) return 'Interior anchor'
  if (pos.includes('F')) return 'Modern forward'
  return 'Rotation bet'
}

function getScore(prospect) {
  const s = prospect.stats || {}
  const rankBase = Math.max(0, 100 - ((prospect.rank || 45) - 1) * 1.25)
  const production = Math.min(14, (s.ppg || 0) * .45)
  const efficiency = Math.min(10, Math.max(0, (s.ts || 52) - 52) * .75)
  const play = Math.min(6, (s.apg || 0) * .75)
  return Math.round(Math.max(45, Math.min(99, rankBase * .76 + production + efficiency + play)))
}

function GlassCard({ children, className = '', style }) {
  return (
    <div className={'big-board-surface rounded-[32px] border border-white/60 bg-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl ' + className} style={style}>
      {children}
    </div>
  )
}

function PlayerAvatar({ prospect, color, size = 'md' }) {
  const image = getPlayerCutoutImage(prospect)
  const dims = size === 'sm' ? 'h-12 w-12' : 'h-16 w-16'

  return (
    <div className={'big-board-avatar relative flex shrink-0 items-end justify-center overflow-hidden rounded-[24px] ' + dims}>
      {image ? (
        <img src={image} alt={prospect.name} className="player-cutout h-full w-full object-contain object-bottom" draggable="false" />
      ) : (
        <span className="mb-3 font-display text-xl font-black" style={{ color }}>{initials(prospect.name)}</span>
      )}
    </div>
  )
}

function BoardMetric({ label, value, color }) {
  return (
    <div className="big-board-metric rounded-[24px] border border-white/35 bg-white/28 px-4 py-3 backdrop-blur-xl">
      <div className="font-mono text-[8px] font-black uppercase tracking-[.2em] text-lo">{label}</div>
      <div className="mt-1 font-numeric text-3xl font-extrabold leading-none" style={{ color }}>{value}</div>
    </div>
  )
}

function ExportButton({ loading, onClick }) {
  return (
    <button type="button" onClick={onClick} disabled={loading} className="big-board-export-btn rounded-[24px] border border-white/35 bg-white/28 px-4 py-3 text-left backdrop-blur-xl">
      <div className="flex items-center gap-2 font-mono text-[8px] font-black uppercase tracking-[.2em] text-lo">
        <Download size={13} />
        Exportar
      </div>
      <div className="mt-1 font-sans text-sm font-black text-slate-800">{loading ? 'Gerando imagem...' : 'Imagem PNG'}</div>
    </button>
  )
}

function TierMenu({ onPick, onClose }) {
  return (
    <motion.div
      className="big-board-menu absolute right-0 top-11 z-[120] w-48 rounded-2xl border border-white/50 bg-white/90 p-2 shadow-lg backdrop-blur-xl"
      initial={{ opacity: 0, y: -6, scale: .96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: .96 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      onPointerDown={e => e.stopPropagation()}
      onClick={e => e.stopPropagation()}
    >
      <div className="mb-1 px-2 py-1 font-mono text-[8px] font-black uppercase tracking-[.2em] text-lo">Adicionar em</div>
      {BOARD_TIERS.map(tier => (
        <button
          key={tier.id}
          type="button"
          onPointerDown={e => e.stopPropagation()}
          onClick={e => { e.stopPropagation(); onPick(tier.id); onClose() }}
          className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left font-mono text-[9px] font-black uppercase tracking-[.16em] transition-colors"
          style={{ color: tier.color }}
        >
          {tier.label}
          <span className="h-2 w-2 rounded-full" style={{ background: tier.color }} />
        </button>
      ))}
    </motion.div>
  )
}

function PoolItem({ prospect, onAdd, onOpenProfile }) {
  const [open, setOpen] = useState(false)
  const tier = BOARD_TIERS.find(item => item.id === normalizeTier(prospect.tier)) || BOARD_TIERS[0]
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: prospect.id,
    data: { source: 'pool' },
  })

  return (
    <motion.div
      ref={setNodeRef}
      layout
      className={(open ? 'z-[110] ' : 'z-0 ') + 'big-board-pool-item relative flex w-full items-center gap-3 rounded-[24px] p-3 text-left'}
      style={{ opacity: isDragging ? 0.35 : 1 }}
      whileHover={{ y: -2, scale: 1.01 }}
    >
      <button
        type="button"
        aria-label="Arrastar jogador"
        className="cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <PlayerAvatar prospect={prospect} color={tier.color} size="sm" />
      </button>
      <button type="button" onPointerDown={e => e.stopPropagation()} onClick={() => onOpenProfile?.(prospect.id)} className="min-w-0 flex-1 text-left">
        <div className="truncate font-sans text-sm font-extrabold text-slate-800">{prospect.name}</div>
        <div className="mt-0.5 truncate font-mono text-[8px] font-bold uppercase tracking-[.18em] text-lo">#{prospect.rank} / {prospect.position} / {prospect.team}</div>
      </button>
      <button
        type="button"
        onPointerDown={e => e.stopPropagation()}
        onClick={e => { e.stopPropagation(); setOpen(v => !v) }}
        className="big-board-icon-btn flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
        style={{ color: tier.color }}
        aria-label="Escolher tier"
      >
        <Plus size={15} />
      </button>
      <AnimatePresence>
        {open && <TierMenu onPick={tierId => onAdd(prospect.id, tierId)} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </motion.div>
  )
}

function ProspectPool({ prospects, boardIds, onAdd, onOpenProfile }) {
  const [query, setQuery] = useState('')
  const available = prospects
    .filter(p => !boardIds.has(p.id))
    .filter(p => {
      const q = query.trim().toLowerCase()
      return !q || p.name.toLowerCase().includes(q) || p.team.toLowerCase().includes(q) || p.position.toLowerCase().includes(q)
    })
    .sort((a, b) => a.rank - b.rank)

  return (
    <GlassCard className="big-board-pool sticky top-24 max-h-[calc(100vh-8rem)] overflow-hidden p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="font-mono text-[9px] font-black uppercase tracking-[0.28em] text-lo">Available</div>
          <h2 className="mt-1 font-headline text-2xl font-extrabold tracking-tight text-slate-800">Prospect Pool</h2>
        </div>
        <span className="rounded-full border border-white/35 bg-white/30 px-3 py-1.5 font-mono text-[9px] font-black text-lo">{available.length}</span>
      </div>

      <label className="big-board-search relative block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-lo" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar jogador, escola, posicao..."
          className="w-full rounded-pill py-3 pl-9 pr-4 text-sm outline-none"
        />
      </label>

      <div className="mt-4 max-h-[calc(100vh-18rem)] space-y-3 overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {available.map(prospect => (
            <PoolItem key={prospect.id} prospect={prospect} onAdd={onAdd} onOpenProfile={onOpenProfile} />
          ))}
        </AnimatePresence>
        {available.length === 0 && (
          <div className="big-board-empty rounded-[24px] px-4 py-8 text-center text-sm font-semibold text-muted">
            Todos os prospects filtrados ja estao no board.
          </div>
        )}
      </div>
    </GlassCard>
  )
}

function BoardCard({ prospect, rank, tier, onMove, onRemove, onOpenProfile }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: prospect.id,
    data: { tierId: tier.id },
  })
  const stats = prospect.stats || {}
  const score = getScore(prospect)

  return (
    <motion.article
      ref={setNodeRef}
      layout
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: isDragging ? 0.28 : 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 210, damping: 24 }}
      className="big-board-card group relative min-w-0 overflow-hidden rounded-[24px] p-3"
      style={{ transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 60 : 'auto' }}
    >
      <span className="absolute inset-y-0 left-0 w-1.5" style={{ background: 'linear-gradient(180deg,' + tier.color + ', transparent)' }} />
      <div className="flex min-w-0 items-center gap-3 pl-1">
        <button
          type="button"
          aria-label="Arrastar jogador"
          className="flex h-8 w-7 shrink-0 cursor-grab items-center justify-center rounded-full text-lo opacity-65 transition-opacity active:cursor-grabbing group-hover:opacity-100"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 shrink-0" />
        </button>
        <button type="button" onPointerDown={e => e.stopPropagation()} onClick={() => onOpenProfile?.(prospect.id)} className="shrink-0">
          <PlayerAvatar prospect={prospect} color={tier.color} size="sm" />
        </button>

        <button type="button" onPointerDown={e => e.stopPropagation()} onClick={() => onOpenProfile?.(prospect.id)} className="min-w-0 flex-1 text-left">
          <div className="font-mono text-[8px] font-black uppercase tracking-[.18em]" style={{ color: tier.color }}>Board #{String(rank || prospect.rank).padStart(2, '0')}</div>
          <div className="mt-0.5 truncate font-sans text-sm font-extrabold text-slate-800">{prospect.name}</div>
          <div className="mt-0.5 truncate text-[11px] font-semibold text-muted">{prospect.position} / {prospect.team} / {getArchetype(prospect)}</div>
        </button>

        <div className="shrink-0 text-right">
          <div className="font-numeric text-3xl font-extrabold leading-none" style={{ color: tier.color }}>{score}</div>
          <div className="mt-0.5 font-mono text-[7px] font-black uppercase tracking-[.14em] text-lo">score</div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 pl-7">
        <MiniStat label="PPG" value={fmt(stats.ppg)} color={tier.color} />
        <MiniStat label="TS%" value={typeof stats.ts === 'number' ? fmt(stats.ts) : '-'} color="#8bbfe8" />
        <MiniStat label="3P%" value={typeof stats.threep === 'number' ? fmt(stats.threep) : '-'} color="#6fbf9c" />
      </div>

      <div className="mt-3 flex items-center gap-2 pl-7">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/35">
          <span className="block h-full rounded-full" style={{ width: pct(score) + '%', background: tier.color }} />
        </div>
        <button type="button" onPointerDown={e => e.stopPropagation()} onClick={() => onOpenProfile?.(prospect.id)} className="big-board-tiny-btn" aria-label="Abrir perfil">
          <Eye size={13} />
        </button>
        <button type="button" onPointerDown={e => e.stopPropagation()} onClick={() => onRemove(prospect.id)} className="big-board-tiny-btn" aria-label="Remover do board">
          <X size={13} />
        </button>
        <button type="button" onPointerDown={e => e.stopPropagation()} onClick={() => onMove(-1)} className="big-board-tiny-btn" aria-label="Subir">
          <ArrowUp size={13} />
        </button>
        <button type="button" onPointerDown={e => e.stopPropagation()} onClick={() => onMove(1)} className="big-board-tiny-btn" aria-label="Descer">
          <ArrowDown size={13} />
        </button>
      </div>
    </motion.article>
  )
}

function MiniStat({ label, value, color }) {
  return (
    <div className="big-board-mini-stat rounded-2xl px-3 py-2">
      <div className="font-mono text-[7px] font-black uppercase tracking-[.16em] text-lo">{label}</div>
      <div className="mt-0.5 font-numeric text-base font-extrabold leading-none" style={{ color }}>{value}</div>
    </div>
  )
}

function BoardCardOverlay({ prospect, rank, tier }) {
  return (
    <motion.article className="big-board-card min-w-[260px] overflow-hidden rounded-[24px] p-3" initial={{ scale: .98 }} animate={{ scale: 1.03 }}>
      <div className="flex min-w-0 items-center gap-3">
        <PlayerAvatar prospect={prospect} color={tier.color} size="sm" />
        <div className="min-w-0 flex-1 text-left">
          <div className="font-mono text-[8px] font-black uppercase tracking-[.18em]" style={{ color: tier.color }}>Board #{String(rank || prospect.rank).padStart(2, '0')}</div>
          <div className="mt-0.5 truncate font-sans text-sm font-extrabold text-slate-800">{prospect.name}</div>
          <div className="mt-0.5 truncate text-[11px] font-semibold text-muted">{prospect.position} / {prospect.team}</div>
        </div>
      </div>
    </motion.article>
  )
}

function TierColumn({ tier, players, rankMap, onMove, onRemove, onOpenProfile }) {
  const { setNodeRef, isOver } = useDroppable({ id: tier.id })
  const averageScore = players.length ? Math.round(players.reduce((sum, p) => sum + getScore(p), 0) / players.length) : '-'

  return (
    <GlassCard className="big-board-tier min-h-[420px] min-w-0 overflow-hidden p-4" style={{ '--tier-color': tier.color, background: 'linear-gradient(145deg, ' + tier.glass + ', rgba(255,255,255,.42))' }}>
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <div className="font-mono text-[8px] font-black uppercase tracking-[0.28em] text-lo">{tier.range}</div>
          <h3 className="mt-1 font-headline text-2xl font-extrabold tracking-tight text-slate-800">{tier.label}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-pill px-3 py-1.5 font-mono text-[9px] font-black uppercase tracking-[.16em]" style={{ color: tier.color, background: tier.bg }}>{players.length}</span>
          <span className="hidden rounded-pill px-3 py-1.5 font-mono text-[9px] font-black uppercase tracking-[.16em] text-lo min-[1500px]:inline-flex">avg {averageScore}</span>
        </div>
      </div>

      <div ref={setNodeRef} className={'grid min-w-0 gap-3 rounded-[26px] p-1 transition-colors ' + (isOver ? 'big-board-drop-active' : '')}>
        <SortableContext items={players.map(p => p.id)} strategy={verticalListSortingStrategy}>
          <AnimatePresence initial={false}>
            {players.map(prospect => (
              <BoardCard
                key={prospect.id}
                prospect={prospect}
                rank={rankMap.get(prospect.id)}
                tier={tier}
                onMove={direction => onMove(tier.id, prospect.id, direction)}
                onRemove={onRemove}
                onOpenProfile={onOpenProfile}
              />
            ))}
          </AnimatePresence>
        </SortableContext>
        {players.length === 0 && (
          <div className="big-board-empty flex min-h-[220px] flex-col items-center justify-center rounded-[26px] text-center text-sm font-semibold text-muted/80">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-dashed border-current text-lo/60">
              <Plus size={22} strokeWidth={1.5} />
            </div>
            <span className="max-w-[180px] leading-6">Arraste ou adicione jogadores do Pool</span>
          </div>
        )}
      </div>
    </GlassCard>
  )
}

function ShareRow({ prospect, rank, tier }) {
  const score = getScore(prospect)
  return (
    <div className="share-row">
      <div className="share-rank" style={{ color: tier.color }}>#{String(rank).padStart(2, '0')}</div>
      <div className="share-player">
        <div className="share-name">{prospect.name}</div>
        <div className="share-meta">{prospect.position} / {prospect.team} / {getArchetype(prospect)}</div>
      </div>
      <div className="share-score" style={{ color: tier.color }}>{score}</div>
    </div>
  )
}

function ShareTierColumn({ tier, players }) {
  return (
    <section className="share-tier-column" style={{ '--share-tier': tier.color }}>
      <header>
        <span>{tier.label}</span>
        <strong>{players.length}</strong>
      </header>
      <div className="share-tier-list">
        {players.map(({ prospect, rank }) => (
          <ShareRow key={prospect.id} prospect={prospect} rank={rank} tier={tier} />
        ))}
      </div>
    </section>
  )
}

function BigBoardShareCard({ players, theme = 'dark', limit = EXPORT_LIMIT }) {
  const shown = players.slice(0, limit).map((prospect, index) => ({ prospect, rank: index + 1 }))
  const date = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date())
  const grouped = BOARD_TIERS.map(tier => ({
    tier,
    players: shown.filter(item => normalizeTier(item.prospect.tier) === tier.id),
  }))
  return (
    <section className={'big-board-share-card ' + (theme === 'dark' ? 'is-dark' : 'is-light')}>
      <div className="share-bg-mark">2026</div>
      <header className="share-header">
        <div>
          <div className="share-kicker">Rookies Brasil / Draft Command Center</div>
          <h1>NBA Draft 2026 Big Board</h1>
          <p>Lottery board editorial com tiers, score interno e leitura de valor para o topo da classe.</p>
        </div>
        <div className="share-badge">
          <span>Top</span>
          <strong>{shown.length}</strong>
        </div>
      </header>

      <div className="share-tier-strip">
        {BOARD_TIERS.map(tier => (
          <div key={tier.id} style={{ '--share-tier': tier.color }}>
            <span>{tier.label}</span>
            <strong>{shown.filter(item => normalizeTier(item.prospect.tier) === tier.id).length}</strong>
          </div>
        ))}
      </div>

      <main className="share-list">
        {grouped.map(({ tier, players }) => (
          <ShareTierColumn key={tier.id} tier={tier} players={players} />
        ))}
      </main>

      <footer className="share-footer">
        <span>NBA Draft 2026 scouting board</span>
        <span>{date}</span>
        <strong>rookies brasil</strong>
      </footer>
    </section>
  )
}

export default function BigBoard({ prospects, onSelectProspect, onTierChange }) {
  const [board, setBoard] = useState(emptyBoard)
  const [activeDragId, setActiveDragId] = useState(null)
  const [exporting, setExporting] = useState(false)
  const [shareTheme, setShareTheme] = useState('dark')
  const shareRef = useRef(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 7 } }))

  useEffect(() => {
    setBoard(current => cleanBoard(current, prospects))
  }, [prospects])

  const boardIds = useMemo(() => new Set(Object.values(board).flat()), [board])
  const prospectsById = useMemo(() => new Map(prospects.map(p => [p.id, p])), [prospects])
  const flatBoardIds = BOARD_TIERS.flatMap(tier => board[tier.id] || [])
  const flatBoardPlayers = flatBoardIds.map(id => prospectsById.get(id)).filter(Boolean)
  const rankMap = new Map(flatBoardIds.map((id, index) => [id, index + 1]))
  const draftedCount = flatBoardIds.length
  const topScore = flatBoardIds.length ? Math.max(...flatBoardIds.map(id => getScore(prospectsById.get(id) || {}))) : '-'

  const findTier = (id, source = board) => {
    if (BOARD_TIERS.some(tier => tier.id === id)) return id
    return BOARD_TIERS.find(tier => source[tier.id]?.includes(id))?.id
  }

  const activeDragProspect = activeDragId ? prospectsById.get(activeDragId) : null
  const activeDragTierId = activeDragId ? findTier(activeDragId) : null
  const activeDragTier = BOARD_TIERS.find(tier => tier.id === activeDragTierId) || BOARD_TIERS[0]

  const addToBoard = (id, tierId) => {
    setBoard(current => {
      if (Object.values(current).some(ids => ids.includes(id))) return current
      onTierChange?.(id, tierId)
      return { ...current, [tierId]: [...current[tierId], id] }
    })
  }

  const removeFromBoard = id => {
    setBoard(current => BOARD_TIERS.reduce((acc, tier) => ({ ...acc, [tier.id]: current[tier.id].filter(item => item !== id) }), {}))
  }

  const resetBoard = () => setBoard(emptyBoard())

  const exportImage = async () => {
    if (!shareRef.current || exporting) return
    const nextTheme = document.documentElement.classList.contains('theme-dark') ? 'dark' : 'light'
    setExporting(true)
    setShareTheme(nextTheme)
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
        backgroundColor: nextTheme === 'dark' ? '#101722' : '#edeae4',
      })
      const link = document.createElement('a')
      link.download = 'nba-draft-2026-big-board.png'
      link.href = dataUrl
      link.click()
    } finally {
      setExporting(false)
    }
  }

  const moveWithinTier = (tierId, id, direction) => {
    setBoard(current => {
      const ids = [...current[tierId]]
      const from = ids.indexOf(id)
      const to = from + direction
      if (from < 0 || to < 0 || to >= ids.length) return current
      const [item] = ids.splice(from, 1)
      ids.splice(to, 0, item)
      return { ...current, [tierId]: ids }
    })
  }

  const handleDragStart = ({ active }) => setActiveDragId(active.id)

  const handleDragOver = () => {}

  const handleDragEnd = ({ active, over }) => {
    setActiveDragId(null)
    if (!over || active.id === over.id) return

    setBoard(current => {
      const activeTier = findTier(active.id, current)
      const overTier = findTier(over.id, current)
      if (!overTier) return current

      const overItems = [...current[overTier]]
      const overIndex = overItems.indexOf(over.id)
      const insertAt = overIndex >= 0 ? overIndex : overItems.length

      if (!activeTier) {
        if (Object.values(current).some(ids => ids.includes(active.id))) return current
        overItems.splice(insertAt, 0, active.id)
        onTierChange?.(active.id, overTier)
        return { ...current, [overTier]: overItems }
      }

      if (activeTier !== overTier) {
        const activeItems = current[activeTier].filter(id => id !== active.id)
        if (!overItems.includes(active.id)) overItems.splice(insertAt, 0, active.id)
        onTierChange?.(active.id, overTier)
        return { ...current, [activeTier]: activeItems, [overTier]: overItems }
      }

      if (BOARD_TIERS.some(tier => tier.id === over.id)) return current

      const ids = [...current[activeTier]]
      const from = ids.indexOf(active.id)
      const to = ids.indexOf(over.id)
      if (from < 0 || to < 0 || from === to) return current
      const [item] = ids.splice(from, 1)
      ids.splice(to, 0, item)
      return { ...current, [activeTier]: ids }
    })
  }

  return (
    <div className="big-board-root min-h-full px-6 py-6">
      <header className="big-board-hero sticky top-0 z-50 -mx-6 mb-6 border-b border-white/60 bg-white/60 px-6 py-5 shadow-[0_4px_30px_rgb(0,0,0,0.05)] backdrop-blur-md">
        <div className="mx-auto grid max-w-[1400px] gap-4 3xl:max-w-[1680px] uw:max-w-[1800px] xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="big-board-pill"><Sparkles size={13} /> Builder Mode</span>
              <span className="big-board-pill"><BarChart3 size={13} /> Custom class board</span>
            </div>
            <h1 className="mt-3 font-brand text-5xl font-extrabold tracking-tight text-slate-800 3xl:text-5xl">Big Board Studio</h1>
            <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-muted">
              Organize tiers, compare características e crie do zero o seu próprio Big Board. Mova os cards para as tiers desejadas ou use os controles manuais.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <BoardMetric label="No board" value={draftedCount} color="#a79be8" />
            <BoardMetric label="Top score" value={topScore} color="#8bbfe8" />
            <ExportButton loading={exporting} onClick={exportImage} />
            <button type="button" onClick={resetBoard} className="big-board-reset rounded-[24px] border border-white/35 bg-white/28 px-4 py-3 text-left backdrop-blur-xl">
              <div className="flex items-center gap-2 font-mono text-[8px] font-black uppercase tracking-[.2em] text-lo"><RotateCcw size={13} /> Reset</div>
              <div className="mt-1 font-sans text-sm font-black text-slate-800">Limpar board</div>
            </button>
          </div>
        </div>
      </header>

      <DndContext sensors={sensors} collisionDetection={boardCollisionDetection} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd} onDragCancel={() => setActiveDragId(null)}>
        <div className="mx-auto grid max-w-[1400px] gap-4 3xl:max-w-[1680px] uw:max-w-[1800px] xl:grid-cols-[290px_1fr] 3xl:grid-cols-[330px_1fr]">
          <ProspectPool prospects={prospects} boardIds={boardIds} onAdd={addToBoard} onOpenProfile={onSelectProspect} />

          <div className="grid min-w-0 gap-4 lg:grid-cols-2 min-[1780px]:grid-cols-3 3xl:grid-cols-4">
            {BOARD_TIERS.map(tier => (
              <TierColumn
                key={tier.id}
                tier={tier}
                players={(board[tier.id] || []).map(id => prospectsById.get(id)).filter(Boolean)}
                rankMap={rankMap}
                onMove={moveWithinTier}
                onRemove={removeFromBoard}
                onOpenProfile={onSelectProspect}
              />
            ))}
          </div>
        </div>

        <DragOverlay adjustScale={false} modifiers={[snapOverlayToCursor]} dropAnimation={{ duration: 220, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }}>
          {activeDragProspect ? <BoardCardOverlay prospect={activeDragProspect} rank={rankMap.get(activeDragProspect.id) || activeDragProspect.rank || 1} tier={activeDragTier} /> : null}
        </DragOverlay>
      </DndContext>

      <div className="big-board-share-capture" aria-hidden="true">
        <div ref={shareRef}>
          <BigBoardShareCard players={flatBoardPlayers} theme={shareTheme} limit={EXPORT_LIMIT} />
        </div>
      </div>
    </div>
  )
}

