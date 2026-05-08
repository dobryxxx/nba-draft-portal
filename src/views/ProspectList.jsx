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
import { Eye, LayoutGrid, List as ListIcon, Moon, Plus, Search, SlidersHorizontal, Sun } from 'lucide-react'
import { getPlayerCutoutImage } from '../utils/playerImages'

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
  const image = getPlayerCutoutImage(prospect)

  return (
    <div
      className="prospect-photo-frame flex h-16 w-12 shrink-0 items-end justify-center overflow-hidden rounded-[20px]"
      style={{
        background: '#edeae4',
        color: accent,
        boxShadow: isDragging
          ? '7px 7px 14px #c9c4bd, -7px -7px 14px #ffffff'
          : 'inset 3px 3px 7px #d4d0ca, inset -3px -3px 7px #ffffff',
      }}
    >
      {image ? (
        <img src={image} alt={prospect.name} className="player-cutout h-full w-full object-contain object-bottom" draggable="false" />
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
  const tierKey = normalizeTierKey(prospect.tier)
  const stats = prospect.stats || {}
  const rowBackground = prospect.tier === 'ELITE'
    ? 'radial-gradient(circle at 3% 18%, rgba(124,92,207,.16), transparent 22%), radial-gradient(circle at 72% 120%, rgba(183,166,232,.18), transparent 28%), linear-gradient(145deg, rgba(255,255,255,.58), ' + tier.bg + 'cf)'
    : 'radial-gradient(circle at 4% 16%, ' + tier.wash + ', transparent 24%), linear-gradient(145deg, rgba(255,255,255,.58), ' + tier.bg + 'bb)'

  return (
    <motion.div
      ref={setNodeRef}
      layout
      className={`prospect-list-row prospect-tier-${tierKey} group relative grid cursor-pointer items-center gap-3 overflow-hidden rounded-[28px] border border-white/55 px-4 py-3 backdrop-blur-md transition-all duration-200`}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        background: rowBackground,
        boxShadow: isDragging ? '0 22px 44px rgba(120,112,102,.17), inset 1px 1px 0 rgba(255,255,255,.9)' : '0 8px 26px rgba(0,0,0,.035), inset 1px 1px 0 rgba(255,255,255,.82)',
        gridTemplateColumns: '50px 62px minmax(210px,1.25fr) minmax(170px,.8fr) minmax(190px,.9fr) minmax(160px,.8fr) 104px',
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
        className="prospect-soft-chip rounded-full py-2 font-mono text-[11px] font-black transition-transform active:scale-95"
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
            className="prospect-tier-select rounded-full px-3 py-1 font-mono text-[9px] font-black uppercase tracking-[.16em] outline-none"
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
        <span className="hidden pl-1 font-sans text-xs font-black transition-transform duration-200 group-hover:translate-x-1 xl:block" style={{ color: tier.color }}>Perfil</span>
      </div>
    </motion.div>
  )
}

export default function ProspectList({ prospects, onReorder, onTierChange, onSelectProspect, onOpenBoard, time = '--:--:--', isDark = false, onToggleTheme }) {
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
      <div className="prospect-db-toolbar sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
        <div className={
          'relative overflow-hidden rounded-[30px] border backdrop-blur-xl ring-1 transition-all duration-300 ' +
          (isDark
            ? 'border-white/10 bg-slate-950/50 text-white shadow-2xl shadow-black/30 ring-white/10'
            : 'border-white/50 bg-white/60 text-slate-950 shadow-xl shadow-black/5 ring-white/50')
        }>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(124,92,207,.18),transparent_34%),radial-gradient(circle_at_84%_12%,rgba(90,174,214,.14),transparent_32%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/45 to-transparent opacity-50" />

          <div className="relative flex flex-col gap-5 px-4 py-4 sm:px-5 lg:px-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                  <span>NBA Draft</span>
                  <span className="h-1 w-1 rounded-full bg-violet-400/70" />
                  <span>Database</span>
                </div>
                <div className="mt-1 flex flex-wrap items-end gap-x-4 gap-y-2">
                  <h1 className="font-headline text-4xl font-black tracking-tight text-slate-950 dark:text-white md:text-5xl">
                    Prospect DB
                  </h1>
                  <p className="pb-1 font-sans text-sm font-semibold text-slate-500 dark:text-slate-400">
                    Board analítico da classe, scouting e filtros de decisão.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 xl:justify-end">
                {[
                  ['Draft', '2026', 'rgba(124,92,207,.14)', '#7c5ccf'],
                  ['Classe', prospects.length + ' picks', 'rgba(90,174,214,.14)', '#4f86ad'],
                  ['Modo', 'Custom', 'rgba(139,207,180,.16)', '#4f9577'],
                ].map(([label, value, bg, color]) => (
                  <div
                    key={label}
                    className="inline-flex h-9 items-center gap-2 rounded-full border border-white/40 px-3.5 font-mono text-[10px] font-black uppercase tracking-[0.16em] shadow-sm backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 dark:border-white/10"
                    style={{ background: bg, color }}
                  >
                    <span className="opacity-60">{label}</span>
                    <span>{value}</span>
                  </div>
                ))}

                <div className="inline-flex h-9 items-center rounded-full border border-white/40 bg-white/35 px-3.5 font-mono text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/10 dark:text-slate-300">
                  {time}
                </div>

                <button
                  type="button"
                  onClick={onToggleTheme}
                  className="inline-flex h-9 items-center gap-2 rounded-full border border-white/40 bg-white/35 px-3.5 font-mono text-[10px] font-black uppercase tracking-[0.16em] text-slate-600 shadow-sm backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/50 focus:outline-none focus:ring-2 focus:ring-violet-300/60 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
                  aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo noturno'}
                  aria-pressed={isDark}
                >
                  {isDark ? <Sun size={14} strokeWidth={2.4} /> : <Moon size={14} strokeWidth={2.4} />}
                  <span>{isDark ? 'Light' : 'Dark'}</span>
                </button>
              </div>
            </div>

            <div className="rounded-[26px] border border-white/45 bg-white/45 p-3 shadow-[0_18px_50px_rgba(0,0,0,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] dark:shadow-black/20">
              <div className="flex flex-col gap-3 2xl:flex-row 2xl:items-center">
                <div className="relative min-w-[240px] flex-1 2xl:max-w-md">
                  <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} strokeWidth={2.4} aria-hidden="true" />
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Buscar jogador ou escola..."
                    className="h-12 w-full rounded-2xl border border-white/40 bg-white/55 pl-11 pr-4 font-sans text-sm font-semibold text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,.65),0_10px_26px_rgba(0,0,0,.04)] outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-violet-300/70 focus:ring-4 focus:ring-violet-300/15 dark:border-white/10 dark:bg-slate-950/35 dark:text-white dark:placeholder:text-slate-500"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex h-12 items-center gap-1 rounded-2xl border border-white/40 bg-white/35 p-1 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/[0.06]">
                    {[
                      { id: 'cards', label: 'Cards', Icon: LayoutGrid },
                      { id: 'list', label: 'Lista', Icon: ListIcon },
                    ].map(mode => {
                      const isActive = viewMode === mode.id
                      const Icon = mode.Icon
                      return (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => setViewMode(mode.id)}
                          className={
                            'inline-flex h-10 items-center gap-2 rounded-xl px-3 font-mono text-[10px] font-black uppercase tracking-[0.16em] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-300/50 ' +
                            (isActive
                              ? 'bg-white text-violet-600 shadow-[0_10px_24px_rgba(124,92,207,.16)] dark:bg-white/15 dark:text-violet-200'
                              : 'text-slate-500 hover:bg-white/45 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white')
                          }
                        >
                          <Icon size={14} strokeWidth={2.4} />
                          {mode.label}
                        </button>
                      )
                    })}
                  </div>

                  <div className="hidden h-8 w-px bg-white/45 dark:bg-white/10 xl:block" />

                  <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-white/35 bg-white/25 px-2 py-2 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.04]">
                    <span className="px-1 font-mono text-[9px] font-black uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Tier</span>
                    {['ALL', ...Object.keys(TIER_CONFIG)].map(t => {
                      const cfg = TIER_CONFIG[t]
                      const isActive = tierFilter === t
                      const label = t === 'ALL' ? 'ALL' : cfg?.label || t
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTier(t)}
                          className={
                            'rounded-full border px-3 py-1.5 font-mono text-[9px] font-black uppercase tracking-[0.16em] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-300/50 ' +
                            (isActive
                              ? 'border-white/70 bg-white text-slate-900 shadow-[0_10px_22px_rgba(0,0,0,.06)] dark:border-white/15 dark:bg-white/15 dark:text-white'
                              : 'border-transparent text-slate-500 hover:border-white/50 hover:bg-white/40 hover:text-slate-800 dark:text-slate-400 dark:hover:border-white/10 dark:hover:bg-white/10 dark:hover:text-white')
                          }
                          style={isActive && cfg ? { color: cfg.text, boxShadow: '0 10px 24px ' + cfg.color + '22' } : undefined}
                        >
                          {label}
                        </button>
                      )
                    })}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-white/35 bg-white/25 px-2 py-2 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.04]">
                    <span className="px-1 font-mono text-[9px] font-black uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Pos</span>
                    {positions.map(pos => {
                      const isActive = posFilter === pos
                      return (
                        <button
                          key={pos}
                          type="button"
                          onClick={() => setPos(pos)}
                          className={
                            'rounded-full border px-3 py-1.5 font-mono text-[9px] font-black uppercase tracking-[0.16em] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-300/50 ' +
                            (isActive
                              ? 'border-sky-200/60 bg-sky-100/60 text-sky-700 shadow-[0_10px_22px_rgba(90,174,214,.16)] dark:border-sky-300/20 dark:bg-sky-300/10 dark:text-sky-200'
                              : 'border-transparent text-slate-500 hover:border-white/50 hover:bg-white/40 hover:text-slate-800 dark:text-slate-400 dark:hover:border-white/10 dark:hover:bg-white/10 dark:hover:text-white')
                          }
                        >
                          {pos}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 2xl:ml-auto 2xl:justify-end">
                  <div className="inline-flex h-12 items-center gap-3 rounded-2xl border border-white/35 bg-white/35 px-4 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05]">
                    <SlidersHorizontal size={15} className="text-violet-400" strokeWidth={2.4} />
                    <div className="min-w-[118px]">
                      <div className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Exibindo</div>
                      <div className="font-data text-sm font-black text-slate-900 dark:text-white">
                        {filtered.length}<span className="text-slate-400 dark:text-slate-500"> / {prospects.length}</span>
                      </div>
                    </div>
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-200/70 dark:bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-400 to-sky-300 transition-all duration-300"
                        style={{ width: prospects.length ? Math.max(6, (filtered.length / prospects.length) * 100) + '%' : '0%' }}
                      />
                    </div>
                  </div>

                  <label className="inline-flex h-12 items-center gap-2 rounded-2xl border border-white/35 bg-white/35 px-3 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05]">
                    <span className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Sort</span>
                    <select
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value)}
                      className="h-9 rounded-xl border border-white/40 bg-white/55 px-3 font-sans text-xs font-black text-slate-800 outline-none transition-all duration-200 focus:ring-2 focus:ring-violet-300/40 dark:border-white/10 dark:bg-slate-950/40 dark:text-white"
                    >
                      {SORT_OPTIONS.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="prospect-db-content p-4 3xl:p-6">
        {filtered.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full"
              style={{ boxShadow: 'inset 4px 4px 10px #d4d0ca, inset -4px -4px 10px #ffffff', background: '#edeae4' }}
            >
              <span className="text-2xl text-lo">0</span>
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
                <motion.div layout className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
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
                  <div className="prospect-list-table min-w-[1080px] space-y-3">
                    <div className="grid gap-3 px-4 font-mono text-[9px] font-bold uppercase tracking-widest text-lo" style={{ gridTemplateColumns: '50px 62px minmax(210px,1.25fr) minmax(170px,.8fr) minmax(190px,.9fr) minmax(160px,.8fr) 104px' }}>
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
