import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  rectSortingStrategy,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { TIER_CONFIG } from '../data/prospects'
import ProspectCard from '../components/ProspectCard'
import { Eye, Plus } from 'lucide-react'
import { getPlayerImage } from '../utils/playerImages'

const SORT_OPTIONS = [
  { value: 'rank', label: 'Rank' },
  { value: 'ppg', label: 'PPG' },
  { value: 'rpg', label: 'RPG' },
  { value: 'apg', label: 'APG' },
  { value: 'per', label: 'PER' },
  { value: 'ts', label: 'TS%' },
]

const LIST_STATS = [
  { key: 'ppg', label: 'PPG', min: 8, max: 26 },
  { key: 'rpg', label: 'RPG', min: 1, max: 12 },
  { key: 'apg', label: 'APG', min: 0, max: 8 },
  { key: 'per', label: 'PER', min: 10, max: 32 },
  { key: 'ts', label: 'TS%', min: 48, max: 70 },
]

const formatNumber = value => (typeof value === 'number' ? value.toFixed(1) : '-')
const normalize = (value, min, max) => {
  if (typeof value !== 'number') return 0
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))
}


const TIER_STYLES = {
  ELITE: { label: 'ELITE', color: '#7c5ccf', bg: '#eee9fb', text: '#5d46a3', glow: 'rgba(124,92,207,.24)', wash: 'rgba(124,92,207,.13)', accent: 'rgba(183,166,232,.26)' },
  LOTTERY: { label: 'LOTTERY', color: '#5aaed6', bg: '#edf7fd', text: '#3f7fa0', glow: 'rgba(90,174,214,.22)', wash: 'rgba(139,191,232,.16)', accent: 'rgba(213,239,252,.46)' },
  MID_1ST: { label: 'MID 1ST', color: '#c9a941', bg: '#fbf4d2', text: '#8a7023', glow: 'rgba(201,169,65,.24)', wash: 'rgba(246,222,126,.18)', accent: 'rgba(255,246,198,.45)' },
  SLEEPER: { label: 'SLEEPER', color: '#e6a06f', bg: '#faeee5', text: '#a8663b', glow: 'rgba(230,160,111,.22)', wash: 'rgba(242,191,160,.18)', accent: 'rgba(250,238,229,.54)' },
}

const normalizeTierKey = tier => ({ ALL_STAR: 'LOTTERY', STARTER: 'MID_1ST', FRINGE: 'MID_1ST', ROLE_PLAYER: 'SLEEPER' }[tier] || tier)

const LIST_CORE_STATS = [
  { key: 'ppg', label: 'PPG' },
  { key: 'rpg', label: 'RPG' },
  { key: 'apg', label: 'APG' },
  { key: 'fgp', label: 'FG%' },
]

const LIST_ADVANCED_STATS = [
  { key: 'ts', label: 'TS%', min: 45, max: 70, suffix: '%' },
  { key: 'per', label: 'PER', min: 10, max: 35 },
  { key: 'usg', label: 'USG%', min: 12, max: 38, suffix: '%' },
]

function getTierStyles(tier) {
  return TIER_STYLES[normalizeTierKey(tier)] || TIER_STYLES.SLEEPER
}

function formatTierLabel(tier) {
  return getTierStyles(tier).label
}

const parseFeetInches = (value = '') => {
  const match = String(value).match(/(\d+)'(?:([\d.]+))?/)
  if (!match) return null
  return Number(match[1]) * 12 + Number(match[2] || 0)
}

const formatLengthMetric = value => {
  const inches = parseFeetInches(value)
  if (inches === null) return value || '-'
  const cm = Math.round(inches * 2.54)
  return (cm / 100).toFixed(2).replace('.', ',') + ' m'
}

const formatLengthCm = value => {
  const inches = parseFeetInches(value)
  if (inches === null) return value || '-'
  return Math.round(inches * 2.54) + ' cm'
}

const formatWeightMetric = (value = '') => {
  const match = String(value).match(/[\d.]+/)
  if (!match) return value || '-'
  return Math.round(Number(match[0]) * 0.45359237) + ' kg'
}

const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase()

function MiniBar({ value, min, max, color }) {
  return (
    <div
      className="h-[5px] w-full overflow-hidden rounded-pill"
      style={{ background: '#e0ddd7', boxShadow: 'inset 1px 1px 3px #ccc9c2, inset -1px -1px 2px #ffffff' }}
    >
      <div
        className="h-full rounded-pill"
        style={{
          width: `${normalize(value, min, max)}%`,
          background: typeof value === 'number' ? color : '#c5bfb5',
          opacity: typeof value === 'number' ? 1 : 0.35,
          transition: 'width 700ms cubic-bezier(0.4,0,0.2,1)',
        }}
      />
    </div>
  )
}

function PlayerAvatar({ prospect, accent, isDragging }) {
  const image = getPlayerImage(prospect)

  return (
    <div
      className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full"
      style={{
        background: '#edeae4',
        color: accent,
        boxShadow: isDragging
          ? '7px 7px 14px #c9c4bd, -7px -7px 14px #ffffff'
          : 'inset 3px 3px 7px #d4d0ca, inset -3px -3px 7px #ffffff',
      }}
    >
      {image ? (
        <img src={image} alt={prospect.name} className="player-photo h-full w-full object-cover" draggable="false" />
      ) : (
        <span className="font-display text-lg font-bold leading-none">{getInitials(prospect.name)}</span>
      )}
    </div>
  )
}

function SortableProspectCard({ prospect, index, introActive, onTierChange, onSelectProspect }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: prospect.id })

  return (
    <motion.div
      ref={setNodeRef}
      layout
      initial={introActive && index < 12 ? { opacity: 0, y: 18, scale: 0.985 } : false}
      animate={{ opacity: 1, y: 0, scale: isDragging ? 1.015 : 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.975 }}
      transition={{ duration: 0.34, delay: introActive && index < 12 ? index * 0.025 : 0, ease: [0.22, 1, 0.36, 1] }}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 30 : 'auto',
        opacity: isDragging ? 0.98 : 1,
      }}
    >
      <ProspectCard
        prospect={prospect}
        onClick={player => onSelectProspect(player.id)}
        onTierChange={onTierChange}
        isDragging={isDragging}
        dragHandleProps={{ ...attributes, ...listeners }}
        animateOnMount={false}
      />
    </motion.div>
  )
}

function ActionButton({ children, label, color, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onPointerDown={e => e.stopPropagation()}
      onClick={e => { e.stopPropagation(); onClick?.() }}
      className="flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
      style={{ color, background: '#edeae4', boxShadow: '3px 3px 8px #d4d0ca, -3px -3px 8px #ffffff' }}
    >
      {children}
    </button>
  )
}

function PhysicalMini({ label, value, color }) {
  return (
    <div className="rounded-2xl bg-white/32 px-2.5 py-2 backdrop-blur-sm">
      <div className="font-mono text-[8px] font-bold uppercase tracking-[.16em] text-lo">{label}</div>
      <div className="mt-0.5 font-mono text-[11px] font-black tabular-nums" style={{ color }}>{value}</div>
    </div>
  )
}

function CoreMini({ label, value, suffix = '' }) {
  return (
    <div className="rounded-2xl bg-white/36 px-2.5 py-2 text-center backdrop-blur-sm">
      <div className="font-mono text-[8px] font-bold uppercase tracking-[.16em] text-lo">{label}</div>
      <div className="mt-0.5 font-mono text-[13px] font-black tabular-nums text-slate-800">
        {formatNumber(value)}{typeof value === 'number' ? suffix : ''}
      </div>
    </div>
  )
}

function AdvancedMini({ stat, value, color }) {
  return (
    <div className="min-w-0">
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="font-mono text-[8px] font-bold uppercase tracking-[.14em] text-lo">{stat.label}</span>
        <span className="font-mono text-[10px] font-black text-slate-800">{typeof value === 'number' ? formatNumber(value) + (stat.suffix || '') : '-'}</span>
      </div>
      <MiniBar value={value} min={stat.min} max={stat.max} color={color} />
    </div>
  )
}

function SortableListRow({ prospect, index, introActive, onTierChange, onSelectProspect, onOpenBoard }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: prospect.id })
  const tier = getTierStyles(prospect.tier)
  const stats = prospect.stats || {}
  const rowBackground = prospect.tier === 'ELITE'
    ? 'radial-gradient(circle at 3% 18%, rgba(124,92,207,.16), transparent 22%), radial-gradient(circle at 72% 120%, rgba(183,166,232,.18), transparent 28%), linear-gradient(145deg, rgba(255,255,255,.58), ' + tier.bg + 'cf)'
    : 'radial-gradient(circle at 4% 16%, ' + tier.wash + ', transparent 24%), linear-gradient(145deg, rgba(255,255,255,.58), ' + tier.bg + 'bb)'

  return (
    <motion.div
      ref={setNodeRef}
      layout
      className="group relative grid cursor-pointer items-center gap-3 overflow-hidden rounded-[28px] border border-white/55 px-4 py-3 backdrop-blur-md transition-all duration-200"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        background: rowBackground,
        boxShadow: isDragging ? '0 22px 44px rgba(120,112,102,.17), inset 1px 1px 0 rgba(255,255,255,.9)' : '0 8px 26px rgba(0,0,0,.035), inset 1px 1px 0 rgba(255,255,255,.82)',
        gridTemplateColumns: '58px 72px minmax(230px,1.25fr) minmax(190px,.8fr) minmax(220px,.9fr) minmax(180px,.8fr) 116px',
        zIndex: isDragging ? 30 : 'auto',
      }}
      initial={introActive && index < 16 ? { opacity: 0, y: 12, scale: 0.99 } : false}
      animate={{ opacity: 1, y: 0, scale: isDragging ? 1.01 : 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.985 }}
      whileHover={{ y: -3, boxShadow: '0 16px 36px rgba(120,112,102,.10), inset 1px 1px 0 rgba(255,255,255,.9)' }}
      transition={{ duration: 0.3, delay: introActive && index < 16 ? index * 0.018 : 0, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onSelectProspect(prospect.id)}
    >
      <div className="absolute left-0 top-0 h-full w-1.5" style={{ background: 'linear-gradient(180deg, ' + tier.color + ', transparent)' }} />

      <button
        type="button"
        aria-label="Arrastar jogador"
        className="rounded-full py-2 font-mono text-[11px] font-black transition-transform active:scale-95"
        style={{ color: tier.color, background: '#edeae4', boxShadow: '2px 2px 5px #d4d0ca, -2px -2px 5px #ffffff', cursor: 'grab' }}
        onClick={e => e.stopPropagation()}
        {...attributes}
        {...listeners}
      >
        #{String(prospect.rank).padStart(2, '0')}
      </button>

      <PlayerAvatar prospect={prospect} accent={tier.color} isDragging={isDragging} />

      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <select
            value={prospect.tier}
            onPointerDown={e => e.stopPropagation()}
            onClick={e => e.stopPropagation()}
            onChange={e => onTierChange(prospect.id, e.target.value)}
            className="rounded-full px-3 py-1 font-mono text-[9px] font-black uppercase tracking-[.16em] outline-none"
            style={{ background: tier.bg, color: tier.text, boxShadow: '2px 2px 5px #d4d0ca, -2px -2px 5px #ffffff' }}
          >
            {Object.keys(TIER_STYLES).map(tierKey => (
              <option key={tierKey} value={tierKey}>{formatTierLabel(tierKey)}</option>
            ))}
          </select>
          <span className="text-[11px] font-semibold text-muted">{prospect.age} anos</span>
        </div>
        <div className="truncate font-display text-xl font-black tracking-tight text-slate-800">{prospect.name}</div>
        <div className="mt-1 flex min-w-0 flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-white/42 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[.14em]" style={{ color: tier.text }}>{prospect.position}</span>
          <span className="rounded-full bg-white/35 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[.14em] text-slate-600">{prospect.team}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <PhysicalMini label="Altura" value={formatLengthMetric(prospect.height)} color={tier.color} />
        <PhysicalMini label="Peso" value={formatWeightMetric(prospect.weight)} color={tier.color} />
        <PhysicalMini label="Enverg." value={formatLengthCm(prospect.wingspan)} color={tier.color} />
      </div>

      <div className="grid grid-cols-4 gap-2">
        {LIST_CORE_STATS.map(stat => (
          <CoreMini key={stat.key} label={stat.label} value={stats[stat.key]} suffix={stat.key === 'fgp' ? '%' : ''} />
        ))}
      </div>

      <div className="grid gap-2">
        {LIST_ADVANCED_STATS.map(stat => (
          <AdvancedMini key={stat.key} stat={stat} value={stats[stat.key]} color={tier.color} />
        ))}
      </div>

      <div className="flex items-center justify-end gap-2">
        <ActionButton label="Ver perfil" color={tier.color} onClick={() => onSelectProspect(prospect.id)}>
          <Eye size={16} strokeWidth={2.4} />
        </ActionButton>
        <ActionButton label="Ir para o Big Board" color={tier.color} onClick={onOpenBoard}>
          <Plus size={16} strokeWidth={2.4} />
        </ActionButton>
        <span className="hidden pl-1 font-sans text-xs font-black transition-transform duration-200 group-hover:translate-x-1 xl:block" style={{ color: tier.color }}>Perfil →</span>
      </div>
    </motion.div>
  )
}

export default function ProspectList({ prospects, onReorder, onTierChange, onSelectProspect, onOpenBoard }) {
  const [search, setSearch] = useState('')
  const [tierFilter, setTier] = useState('ALL')
  const [sortBy, setSortBy] = useState('rank')
  const [posFilter, setPos] = useState('ALL')
  const [viewMode, setViewMode] = useState('cards')
  const [introActive, setIntroActive] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setIntroActive(false), 520)
    return () => window.clearTimeout(timer)
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const positions = useMemo(() => {
    const raw = prospects.flatMap(p => p.position.split('/'))
    return ['ALL', ...Array.from(new Set(raw)).sort()]
  }, [prospects])

  const filtered = useMemo(() => {
    return [...prospects]
      .filter(p => {
        const query = search.toLowerCase()
        const matchSearch = p.name.toLowerCase().includes(query) ||
                            p.team.toLowerCase().includes(query)
        const matchTier = tierFilter === 'ALL' || p.tier === tierFilter
        const matchPos = posFilter === 'ALL' || p.position.includes(posFilter)
        return matchSearch && matchTier && matchPos
      })
      .sort((a, b) => {
        if (sortBy === 'rank') return a.rank - b.rank
        if (['ppg', 'rpg', 'apg', 'per', 'ts'].includes(sortBy)) {
          return (b.stats?.[sortBy] ?? 0) - (a.stats?.[sortBy] ?? 0)
        }
        return 0
      })
  }, [prospects, search, tierFilter, sortBy, posFilter])

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return
    onReorder(active.id, over.id)
    setSortBy('rank')
  }

  return (
    <div className="min-h-full">
      <div className="sticky top-0 z-50 border-b border-white/60 bg-white/60 px-6 py-4 shadow-[0_4px_30px_rgb(0,0,0,0.05)] backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] max-w-xs flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 select-none text-sm text-muted">⌕</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar jogador ou escola..."
              className="neu-input w-full py-2 pl-8 pr-3 font-sans text-sm"
            />
          </div>

          <div className="flex items-center gap-1.5 rounded-pill p-1" style={{ boxShadow: 'inset 2px 2px 5px #d4d0ca, inset -2px -2px 5px #ffffff' }}>
            {[
              { id: 'cards', label: 'Cards' },
              { id: 'list', label: 'Lista' },
            ].map(mode => {
              const isActive = viewMode === mode.id
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setViewMode(mode.id)}
                  className="rounded-pill px-3 py-1.5 font-mono text-[9px] font-bold tracking-widest"
                  style={{
                    background: isActive ? '#f1effc' : 'transparent',
                    color: isActive ? '#6c61aa' : '#a09891',
                    boxShadow: isActive ? '2px 2px 5px #d4d0ca, -2px -2px 5px #ffffff' : 'none',
                  }}
                >
                  {mode.label}
                </button>
              )
            })}
          </div>

          <div className="h-5 w-px bg-border" />

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[9px] tracking-widest text-lo">TIER</span>
            {['ALL', ...Object.keys(TIER_CONFIG)].map(t => {
              const cfg = TIER_CONFIG[t]
              const isActive = tierFilter === t
              return (
                <button
                  key={t}
                  onClick={() => setTier(t)}
                  className="rounded-pill px-2.5 py-1 font-mono text-[9px] tracking-widest transition-all duration-150"
                  style={{
                    background: isActive ? (cfg?.bg || '#e8e5df') : '#edeae4',
                    color: isActive ? (cfg?.text || '#555') : '#a09891',
                    boxShadow: isActive
                      ? 'inset 2px 2px 5px #d4d0ca, inset -2px -2px 5px #ffffff'
                      : '2px 2px 5px #d4d0ca, -2px -2px 5px #ffffff',
                  }}
                >
                  {t}
                </button>
              )
            })}
          </div>

          <div className="hidden h-5 w-px bg-border md:block" />

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[9px] tracking-widest text-lo">POS</span>
            {positions.map(pos => {
              const isActive = posFilter === pos
              return (
                <button
                  key={pos}
                  onClick={() => setPos(pos)}
                  className="rounded-pill px-2.5 py-1 font-mono text-[9px] tracking-widest transition-all duration-150"
                  style={{
                    background: '#edeae4',
                    color: isActive ? '#8bbfe8' : '#a09891',
                    boxShadow: isActive
                      ? 'inset 2px 2px 5px #d4d0ca, inset -2px -2px 5px #ffffff'
                      : '2px 2px 5px #d4d0ca, -2px -2px 5px #ffffff',
                  }}
                >
                  {pos}
                </button>
              )
            })}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="font-mono text-[9px] tracking-widest text-lo">SORT</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="neu-input px-3 py-2 font-sans text-xs text-ink"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className="font-sans text-xs text-muted">
            Exibindo <strong className="text-ink">{filtered.length}</strong> de{' '}
            <strong className="text-ink">{prospects.length}</strong> prospects
          </span>
          <div className="stat-bar max-w-[100px] flex-1">
            <div
              className="stat-bar__fill"
              style={{ '--target-width': `${(filtered.length / prospects.length) * 100}%`, background: '#a79be8' }}
            />
          </div>
        </div>
      </div>

      <div className="p-6">
        {filtered.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full"
              style={{ boxShadow: 'inset 4px 4px 10px #d4d0ca, inset -4px -4px 10px #ffffff', background: '#edeae4' }}
            >
              <span className="text-2xl text-lo">∅</span>
            </div>
            <div className="font-display text-xl text-muted">Sem resultados</div>
            <div className="font-sans text-xs text-lo">Tente outros filtros</div>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <LayoutGroup id="prospect-db-layout">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={viewMode}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                >
                  <SortableContext
                    items={filtered.map(p => p.id)}
                    strategy={viewMode === 'cards' ? rectSortingStrategy : verticalListSortingStrategy}
                  >
              {viewMode === 'cards' ? (
                <motion.div layout className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))' }}>
                  {filtered.map((p, index) => (
                    <SortableProspectCard
                      key={p.id}
                      prospect={p}
                      index={index}
                      introActive={introActive}
                      onTierChange={onTierChange}
                      onSelectProspect={onSelectProspect}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div layout className="overflow-x-auto pb-2">
                  <div className="min-w-[1180px] space-y-3">
                    <div className="grid gap-3 px-4 font-mono text-[9px] font-bold uppercase tracking-widest text-lo" style={{ gridTemplateColumns: '58px 72px minmax(230px,1.25fr) minmax(190px,.8fr) minmax(220px,.9fr) minmax(180px,.8fr) 116px' }}>
                      <span>Rank</span>
                      <span>Foto</span>
                      <span>Prospecto</span>
                      <span>Medidas</span>
                      <span>Core</span>
                      <span>Advanced</span>
                      <span className="text-right">Perfil</span>
                    </div>
                    <div className="flex flex-col gap-3">
                      {filtered.map((p, index) => (
                        <SortableListRow
                          key={p.id}
                          prospect={p}
                          index={index}
                          introActive={introActive}
                          onTierChange={onTierChange}
                          onSelectProspect={onSelectProspect}
                          onOpenBoard={onOpenBoard}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
                  </SortableContext>
                </motion.div>
              </AnimatePresence>
            </LayoutGroup>
          </DndContext>
        )}
      </div>
    </div>
  )
}
