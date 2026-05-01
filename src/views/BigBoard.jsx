import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { DndContext, DragOverlay, PointerSensor, closestCenter, useDraggable, useDroppable, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ArrowDown, ArrowUp, Plus, Search } from 'lucide-react'
import { getPlayerCutoutImage } from '../utils/playerImages'

const BOARD_TIERS = [
  { id: 'ELITE', label: 'Elite', color: '#7c5ccf', bg: '#eee9fb', glass: 'rgba(238,233,251,.72)' },
  { id: 'LOTTERY', label: 'Lottery', color: '#5aaed6', bg: '#edf7fd', glass: 'rgba(237,247,253,.68)' },
  { id: 'MID_1ST', label: 'Mid 1st', color: '#c9a941', bg: '#fbf4d2', glass: 'rgba(251,244,210,.68)' },
  { id: 'SLEEPER', label: 'Sleeper', color: '#e6a06f', bg: '#faeee5', glass: 'rgba(250,238,229,.70)' },
]

const emptyBoard = () => BOARD_TIERS.reduce((acc, tier) => ({ ...acc, [tier.id]: [] }), {})
const fmt = value => (typeof value === 'number' ? value.toFixed(1) : '-')

const snapOverlayToCursor = ({ activatorEvent, draggingNodeRect, transform }) => {
  if (!activatorEvent || !draggingNodeRect || !('clientX' in activatorEvent)) return transform

  return {
    ...transform,
    x: transform.x + activatorEvent.clientX - draggingNodeRect.left - draggingNodeRect.width / 2,
    y: transform.y + activatorEvent.clientY - draggingNodeRect.top - draggingNodeRect.height / 2,
  }
}

function GlassCard({ children, className = '', style }) {
  return (
    <div className={'rounded-[32px] border border-white/60 bg-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl ' + className} style={style}>
      {children}
    </div>
  )
}

function initials(name = '') {
  return String(name)
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase()
}

function PlayerAvatar({ prospect, color, size = 'md' }) {
  const image = getPlayerCutoutImage(prospect)
  const dims = size === 'sm' ? 'h-12 w-12' : 'h-16 w-16'

  return (
    <div
      className={'relative flex shrink-0 items-end justify-center overflow-hidden rounded-full ' + dims}
      style={{ background: '#edeae4', boxShadow: 'inset 3px 3px 8px #d4d0ca, inset -3px -3px 8px #fff' }}
    >
      {image ? (
        <img src={image} alt={prospect.name} className="player-cutout h-full w-full object-contain object-bottom" draggable="false" />
      ) : (
        <span className="mb-3 font-display text-xl font-black" style={{ color }}>{initials(prospect.name)}</span>
      )}
    </div>
  )
}

function TierMenu({ onPick, onClose }) {
  return (
    <motion.div
      className="absolute right-0 top-11 z-[120] w-44 rounded-xl border border-white bg-white/90 p-2 shadow-lg backdrop-blur-xl"
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
          onClick={e => { e.stopPropagation(); onPick(tier.id); onClose(); }}
          className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left font-mono text-[9px] font-black uppercase tracking-[.16em] transition-colors"
          style={{ color: tier.color }}
          onMouseEnter={e => { e.currentTarget.style.background = tier.bg }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
        >
          {tier.label}
          <span className="h-2 w-2 rounded-full" style={{ background: tier.color }} />
        </button>
      ))}
    </motion.div>
  )
}

function PoolItem({ prospect, onAdd }) {
  const [open, setOpen] = useState(false)
  const tier = BOARD_TIERS[0]
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: prospect.id,
    data: { source: 'pool' },
  })

  return (
    <motion.div
      ref={setNodeRef}
      layout
      className={(open ? 'z-[110] ' : 'z-0 ') + 'relative flex w-full cursor-grab items-center gap-3 rounded-[24px] p-3 text-left active:cursor-grabbing'}
      style={{ opacity: isDragging ? 0.35 : 1, background: 'rgba(255,255,255,.42)', boxShadow: open ? '0 14px 34px rgba(0,0,0,.08), inset 1px 1px 0 rgba(255,255,255,.9)' : '0 6px 18px rgba(0,0,0,.025), inset 1px 1px 0 rgba(255,255,255,.8)' }}
      whileHover={{ y: -2, scale: 1.01 }}
      {...attributes}
      {...listeners}
    >
      <PlayerAvatar prospect={prospect} color={tier.color} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="truncate font-sans text-sm font-extrabold text-slate-800">{prospect.name}</div>
        <div className="mt-0.5 truncate font-mono text-[8px] font-bold uppercase tracking-[.18em] text-lo">#{prospect.rank} · {prospect.position} · {prospect.team}</div>
      </div>
      <button
        type="button"
        onPointerDown={e => e.stopPropagation()}
        onClick={e => { e.stopPropagation(); setOpen(v => !v); }}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
        style={{ color: tier.color, background: tier.bg, boxShadow: '3px 3px 8px #d4d0ca, -3px -3px 8px #fff' }}
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

function ProspectPool({ prospects, boardIds, onAdd }) {
  const [query, setQuery] = useState('')
  const available = prospects
    .filter(p => !boardIds.has(p.id))
    .filter(p => {
      const q = query.trim().toLowerCase()
      return !q || p.name.toLowerCase().includes(q) || p.team.toLowerCase().includes(q) || p.position.toLowerCase().includes(q)
    })
    .sort((a, b) => a.rank - b.rank)

  return (
    <GlassCard className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-hidden p-5">
      <div className="mb-4">
        <div className="font-mono text-[9px] font-black uppercase tracking-[0.28em] text-lo">The Pool</div>
        <h2 className="mt-1 font-sans text-2xl font-extrabold tracking-tight text-slate-800">Prospect Pool</h2>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-lo" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar no pool..."
          className="w-full rounded-pill py-2.5 pl-9 pr-4 text-sm outline-none"
          style={{ background: '#edeae4', boxShadow: 'inset 4px 4px 10px #d4d0ca, inset -4px -4px 10px #fff' }}
        />
      </div>

      <div className="mt-4 max-h-[calc(100vh-18rem)] space-y-3 overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {available.map(prospect => (
            <PoolItem key={prospect.id} prospect={prospect} onAdd={onAdd} />
          ))}
        </AnimatePresence>
        {available.length === 0 && (
          <div className="rounded-[24px] px-4 py-8 text-center text-sm font-semibold text-muted" style={{ background: 'rgba(255,255,255,.34)' }}>
            Pool vazio por enquanto.
          </div>
        )}
      </div>
    </GlassCard>
  )
}

function BoardCard({ prospect, rank, tier, onMove, onOpenProfile }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: prospect.id,
    data: { tierId: tier.id },
  })

  return (
    <motion.article
      ref={setNodeRef}
      layout
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: isDragging ? 0.28 : 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 210, damping: 24 }}
      className="group relative min-w-0 cursor-grab overflow-hidden rounded-[22px] p-3 pr-12 active:cursor-grabbing"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 60 : 'auto',
        background: 'rgba(255,255,255,.52)',
        boxShadow: '0 8px 22px rgba(0,0,0,.035), inset 1px 1px 0 rgba(255,255,255,.86)',
      }}
      {...attributes}
      {...listeners}
    >
      <div className="flex min-w-0 items-center gap-3">
        <button type="button" onPointerDown={e => e.stopPropagation()} onClick={() => onOpenProfile?.(prospect.id)} className="shrink-0">
          <PlayerAvatar prospect={prospect} color={tier.color} size="sm" />
        </button>

        <button type="button" onPointerDown={e => e.stopPropagation()} onClick={() => onOpenProfile?.(prospect.id)} className="min-w-0 flex-1 text-left">
          <div className="font-mono text-[8px] font-black uppercase tracking-[.18em]" style={{ color: tier.color }}>Rank #{String(rank).padStart(2, '0')}</div>
          <div className="mt-0.5 truncate font-sans text-sm font-extrabold text-slate-800">{prospect.name}</div>
          <div className="mt-0.5 truncate text-[11px] font-semibold text-muted">{prospect.position} · {prospect.team}</div>
        </button>
      </div>

      <div className="absolute right-2 top-1/2 flex -translate-y-1/2 flex-col items-center justify-center gap-1 opacity-60 transition-opacity group-hover:opacity-100">
        <button type="button" onPointerDown={e => e.stopPropagation()} onClick={() => onMove(-1)} aria-label="Subir" className="flex h-7 w-7 items-center justify-center rounded-full transition-transform hover:-translate-y-0.5" style={{ color: tier.color, background: 'rgba(255,255,255,.58)', boxShadow: '2px 2px 5px rgba(170,162,152,.28), -2px -2px 5px rgba(255,255,255,.72)' }}><ArrowUp size={13} strokeWidth={2.4} /></button>
        <button type="button" onPointerDown={e => e.stopPropagation()} onClick={() => onMove(1)} aria-label="Descer" className="flex h-7 w-7 items-center justify-center rounded-full transition-transform hover:translate-y-0.5" style={{ color: tier.color, background: 'rgba(255,255,255,.58)', boxShadow: '2px 2px 5px rgba(170,162,152,.28), -2px -2px 5px rgba(255,255,255,.72)' }}><ArrowDown size={13} strokeWidth={2.4} /></button>
      </div>
    </motion.article>
  )
}

function BoardCardOverlay({ prospect, rank, tier }) {
  return (
    <motion.article
      className="relative min-w-[240px] overflow-hidden rounded-[22px] p-3 pr-12"
      initial={{ scale: .98 }}
      animate={{ scale: 1.03 }}
      style={{
        background: 'rgba(255,255,255,.82)',
        boxShadow: '0 24px 54px rgba(95,86,76,.22), inset 1px 1px 0 rgba(255,255,255,.92)',
        backdropFilter: 'blur(18px)',
      }}
    >
      <div className="flex min-w-0 items-center gap-3">
        <PlayerAvatar prospect={prospect} color={tier.color} size="sm" />
        <div className="min-w-0 flex-1 text-left">
          <div className="font-mono text-[8px] font-black uppercase tracking-[.18em]" style={{ color: tier.color }}>Rank #{String(rank).padStart(2, '0')}</div>
          <div className="mt-0.5 truncate font-sans text-sm font-extrabold text-slate-800">{prospect.name}</div>
          <div className="mt-0.5 truncate text-[11px] font-semibold text-muted">{prospect.position} · {prospect.team}</div>
        </div>
      </div>
    </motion.article>
  )
}

function TierColumn({ tier, players, rankMap, onMove, onOpenProfile }) {
  const { setNodeRef, isOver } = useDroppable({ id: tier.id })

  return (
    <GlassCard className="min-h-[360px] min-w-0 overflow-hidden p-4" style={{ background: 'linear-gradient(145deg, ' + tier.glass + ', rgba(255,255,255,.42))' }}>
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <div className="font-mono text-[8px] font-black uppercase tracking-[0.28em] text-lo">Tier Stack</div>
          <h3 className="mt-1 font-sans text-2xl font-extrabold tracking-tight text-slate-800">{tier.label}</h3>
        </div>
        <span className="rounded-pill px-3 py-1.5 font-mono text-[9px] font-black uppercase tracking-[.16em]" style={{ color: tier.color, background: tier.bg, boxShadow: '3px 3px 8px #d4d0ca, -3px -3px 8px #fff' }}>{players.length}</span>
      </div>

      <div ref={setNodeRef} className="grid min-w-0 gap-3 rounded-[26px] p-1 transition-colors" style={{ background: isOver ? 'rgba(255,255,255,.34)' : 'transparent' }}>
        <SortableContext items={players.map(p => p.id)} strategy={verticalListSortingStrategy}>
          <AnimatePresence initial={false}>
            {players.map(prospect => (
              <BoardCard
                key={prospect.id}
                prospect={prospect}
                rank={rankMap.get(prospect.id)}
                tier={tier}
                onMove={direction => onMove(tier.id, prospect.id, direction)}
                onOpenProfile={onOpenProfile}
              />
            ))}
          </AnimatePresence>
        </SortableContext>
        {players.length === 0 && (
          <div className="flex min-h-[190px] flex-col items-center justify-center rounded-[26px] text-center text-sm font-semibold text-muted/70" style={{ background: 'rgba(255,255,255,.28)', boxShadow: 'inset 1px 1px 0 rgba(255,255,255,.75)' }}>
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-dashed border-[#b9b2aa]/60 text-lo/60">
              <Plus size={22} strokeWidth={1.5} />
            </div>
            <span className="max-w-[180px] leading-6">Arraste ou adicione do Pool</span>
          </div>
        )}
      </div>
    </GlassCard>
  )
}

export default function BigBoard({ prospects, onSelectProspect }) {
  const [board, setBoard] = useState(emptyBoard)
  const [activeDragId, setActiveDragId] = useState(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 7 } })
  )

  const boardIds = useMemo(() => new Set(Object.values(board).flat()), [board])
  const prospectsById = useMemo(() => new Map(prospects.map(p => [p.id, p])), [prospects])
  const flatBoardIds = BOARD_TIERS.flatMap(tier => board[tier.id] || [])
  const rankMap = new Map(flatBoardIds.map((id, index) => [id, index + 1]))

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
      return { ...current, [tierId]: [...current[tierId], id] }
    })
  }

  const removeFromBoard = id => {
    setBoard(current => BOARD_TIERS.reduce((acc, tier) => ({ ...acc, [tier.id]: current[tier.id].filter(item => item !== id) }), {}))
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

  const handleDragStart = ({ active }) => {
    setActiveDragId(active.id)
  }

  const handleDragOver = ({ active, over }) => {
    if (!over || active.id === over.id) return

    setBoard(current => {
      const activeTier = findTier(active.id, current)
      const overTier = findTier(over.id, current)
      if (!activeTier || !overTier || activeTier === overTier) return current

      const activeItems = current[activeTier].filter(id => id !== active.id)
      const overItems = [...current[overTier]]
      const overIndex = overItems.indexOf(over.id)
      const insertAt = overIndex >= 0 ? overIndex : overItems.length
      overItems.splice(insertAt, 0, active.id)

      return { ...current, [activeTier]: activeItems, [overTier]: overItems }
    })
  }

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
        return { ...current, [overTier]: overItems }
      }

      if (activeTier !== overTier) {
        const activeItems = current[activeTier].filter(id => id !== active.id)
        if (overItems.includes(active.id)) return { ...current, [activeTier]: activeItems, [overTier]: overItems }
        overItems.splice(insertAt, 0, active.id)
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
    <div className="min-h-full px-6 py-6">
      <header className="sticky top-0 z-50 -mx-6 mb-6 border-b border-white/60 bg-white/60 px-6 py-5 shadow-[0_4px_30px_rgb(0,0,0,0.05)] backdrop-blur-md">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[9px] font-black uppercase tracking-[0.3em] text-lo">Builder Mode</div>
            <h1 className="mt-1 font-sans text-4xl font-extrabold tracking-tight text-slate-800">Big Board Studio</h1>
            <p className="mt-1 text-sm font-semibold text-muted">Use o menu + no Pool para escolher o destino, arraste cards entre tiers ou ajuste a ordem com setas.</p>
          </div>
        </div>
      </header>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd} onDragCancel={() => setActiveDragId(null)}>
        <div className="mx-auto grid max-w-[1500px] gap-5 xl:grid-cols-[360px_1fr]">
          <ProspectPool prospects={prospects} boardIds={boardIds} onAdd={addToBoard} />

          <div className="grid min-w-0 gap-5 lg:grid-cols-2 2xl:grid-cols-4">
            {BOARD_TIERS.map(tier => (
              <TierColumn
                key={tier.id}
                tier={tier}
                players={(board[tier.id] || []).map(id => prospectsById.get(id)).filter(Boolean)}
                rankMap={rankMap}
                onMove={moveWithinTier}
                onOpenProfile={onSelectProspect}
              />
            ))}
          </div>
        </div>

        <DragOverlay adjustScale={false} modifiers={[snapOverlayToCursor]} dropAnimation={{ duration: 220, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }}>
          {activeDragProspect ? <BoardCardOverlay prospect={activeDragProspect} rank={rankMap.get(activeDragProspect.id) || activeDragProspect.rank || 1} tier={activeDragTier} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
