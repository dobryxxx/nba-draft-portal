import { motion } from 'framer-motion'
import { getPlayerCutoutImage } from '../utils/playerImages'
import { normalizeProspectStats, formatStat, formatPercent } from '../utils/prospectStats'
import { mergeProspectWithManualIntelligence } from '../data/prospectDraftIntelligence.ts'

const TIER_STYLES = {
  CORNERSTONE: { label: 'CORNERSTONE', color: '#7c3aed', bg: '#eee9fb', text: '#5b21b6', glow: 'rgba(124,58,237,.26)', wash: 'rgba(124,58,237,.13)', accent: 'rgba(196,181,253,.28)' },
  ELITE: { label: 'ELITE', color: '#d4af37', bg: '#fff4c2', text: '#8a6a00', glow: 'rgba(212,175,55,.25)', wash: 'rgba(212,175,55,.14)', accent: 'rgba(255,231,128,.34)' },
  LOTTERY: { label: 'LOTERIA', color: '#10b981', bg: '#dff8ed', text: '#047857', glow: 'rgba(16,185,129,.22)', wash: 'rgba(16,185,129,.13)', accent: 'rgba(167,243,208,.34)' },
  MID_1ST: { label: 'MID 1ST', color: '#3b82f6', bg: '#e0efff', text: '#1d4ed8', glow: 'rgba(59,130,246,.22)', wash: 'rgba(59,130,246,.13)', accent: 'rgba(191,219,254,.38)' },
  FRINGE: { label: 'FRINGE', color: '#f97316', bg: '#ffedd5', text: '#c2410c', glow: 'rgba(249,115,22,.23)', wash: 'rgba(249,115,22,.14)', accent: 'rgba(254,215,170,.36)' },
  SLEEPER: { label: 'SLEEPER', color: '#8b5e34', bg: '#f4eadc', text: '#5f3f20', glow: 'rgba(139,94,52,.22)', wash: 'rgba(139,94,52,.14)', accent: 'rgba(222,184,135,.34)' },
}

const normalizeTierKey = tier => ({ ALL_STAR: 'LOTTERY', STARTER: 'MID_1ST', FRINGE_FIRST: 'FRINGE', ROLE_PLAYER: 'SLEEPER' }[tier] || tier)
const getTierLiquidClass = tier => `tier-${String(normalizeTierKey(tier)).toLowerCase().replace(/_/g, '-')}`

const ADVANCED_SNAPSHOT = [
  { key: 'ts', label: 'TS%', min: 45, max: 70, suffix: '%' },
  { key: 'collegeRts', label: 'C-RTS', min: -12, max: 14 },
  { key: 'usg', label: 'USG%', min: 12, max: 38, suffix: '%' },
  { key: 'threep', label: '3P%', min: 24, max: 45, suffix: '%' },
  { key: 'ftp', label: 'FT%', min: 55, max: 92, suffix: '%' },
]

const clamp = value => Math.min(100, Math.max(0, value))
const normalize = (value, min, max) => (typeof value === 'number' ?clamp(((value - min) / (max - min)) * 100) : 0)

function getTierStyles(tier) {
  return TIER_STYLES[normalizeTierKey(tier)] || TIER_STYLES.SLEEPER
}

function formatTierLabel(tier) {
  return getTierStyles(tier).label
}

function getStatBarValue(stat, value) {
  return normalize(value, stat.min, stat.max)
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

const getInitials = (name = '') => name.split(' ').filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase()

function getScoutingTeaser(prospect) {
  const resolved = mergeProspectWithManualIntelligence(prospect || {})
  const scouting = resolved.scouting || {}
  const manualSummary = resolved.resolvedIntelligence?.scouting?.translationSummary
  const notes = Array.isArray(scouting.notes) ? scouting.notes.join(' ') : scouting.notes
  const candidates = [
    manualSummary,
    scouting.translationSummary,
    notes,
    scouting.strengths?.[0],
    'Perfil completo disponível com leitura de scout, forças, riscos e contexto estatístico.',
  ]
  const text = candidates.find(value => typeof value === 'string' && value.trim() && !/[Ã�]/.test(value)) || candidates.find(value => typeof value === 'string' && value.trim()) || ''
  return text.length > 150 ? text.slice(0, 147).trim() + '...' : text
}

function PhysicalChip({ label, value, color }) {
  return (
    <div className="rounded-2xl border border-white/50 bg-white/35 px-3 py-2 backdrop-blur-sm">
      <div className="font-mono text-[9px] font-bold uppercase tracking-[.18em] text-lo">{label}</div>
      <div className="mt-1 font-mono text-[12px] font-black text-slate-800" style={{ color }}>{value || '-'}</div>
    </div>
  )
}

function CoreStat({ label, value, suffix = '' }) {
  const shown = suffix === '%' ? formatPercent(value) : formatStat(value)
  return (
    <div className="rounded-[20px] bg-white/42 px-3 py-3 text-center backdrop-blur-sm">
      <div className="font-mono text-[10px] font-bold uppercase tracking-[.16em] text-lo">{label}</div>
      <div className="mt-1 font-sans text-2xl font-black leading-none tabular-nums text-slate-800">
        {shown}
      </div>
    </div>
  )
}

function AdvancedMetric({ stat, value, color }) {
  const pct = getStatBarValue(stat, value)
  const shown = stat.suffix === '%' ? formatPercent(value) : formatStat(value)

  return (
    <div className="rounded-2xl bg-white/28 px-3 py-2 backdrop-blur-sm">
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="font-mono text-[9px] font-bold uppercase tracking-[.14em] text-lo" title={stat.label === 'C-RTS' ? 'College Relative True Shooting' : stat.label}>{stat.label}</span>
        <span className="font-mono text-[11px] font-black tabular-nums text-slate-800">{shown}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/55">
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{ width: pct + '%', background: color }}
        />
      </div>
    </div>
  )
}

export default function ProspectCard({ prospect, onClick, onTierChange, dragHandleProps, isDragging = false, animateOnMount = true }) {
  const tier = getTierStyles(prospect.tier)
  const tierKey = normalizeTierKey(prospect.tier)
  const tierLiquidClass = getTierLiquidClass(prospect.tier)
  const isPrimeLiquid = Number(prospect.rank || 99) <= 3
  const accent = tier.color
  const stats = normalizeProspectStats(prospect)
  const playerImage = getPlayerCutoutImage(prospect)
  const teaser = getScoutingTeaser(prospect)
  const cardBackground = prospect.tier === 'CORNERSTONE'
    ?'radial-gradient(circle at 18% 16%, rgba(124,92,207,.20), transparent 25%), radial-gradient(circle at 82% 22%, rgba(80,62,150,.13), transparent 24%), radial-gradient(circle at 55% 84%, rgba(183,166,232,.22), transparent 31%), linear-gradient(145deg, rgba(255,255,255,.76), ' + tier.bg + 'e6)'
    : 'radial-gradient(circle at 18% 18%, ' + tier.wash + ', transparent 28%), radial-gradient(circle at 86% 80%, ' + tier.accent + ', transparent 30%), linear-gradient(145deg, rgba(255,255,255,.74), ' + tier.bg + 'dd)'

  return (
    <motion.article
      layout
      onClick={onClick ?() => onClick(prospect) : undefined}
      className={`prospect-card-shell prospect-tier-${tierKey} tier-liquid-card ${tierLiquidClass} ${isPrimeLiquid ? 'tier-liquid-prime' : 'tier-liquid-standard'} group relative isolate flex cursor-pointer flex-col overflow-hidden rounded-[32px] border border-white/60 bg-white/50 backdrop-blur-md`}
      initial={animateOnMount ?{ opacity: 0, y: 10, scale: 0.99 } : false}
      animate={{ opacity: 1, y: 0, scale: isDragging ?1.018 : 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.975 }}
      whileHover={{ y: -6, scale: 1.012 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: cardBackground,
        boxShadow: isDragging
          ?'0 24px 48px rgba(120,112,102,.18), 0 0 0 1px ' + tier.glow + ', inset 1px 1px 0 rgba(255,255,255,.9)'
          : '0 8px 30px rgba(0,0,0,.04), inset 1px 1px 0 rgba(255,255,255,.86)',
      }}
    >
      <div className="tierLiquid" aria-hidden="true" />
      <div className="tierLiquidSheen" aria-hidden="true" />
      <div className="absolute left-0 top-0 h-full w-1.5" style={{ background: 'linear-gradient(180deg, ' + accent + ', transparent)' }} />

      <div className="flex items-start gap-4 p-5 pb-4">
        <motion.button
          type="button"
          aria-label="Arrastar jogador"
          whileHover={{ scale: 1.06, rotate: -1 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 340, damping: 18 }}
          className="prospect-photo-frame flex h-20 w-16 shrink-0 items-end justify-center overflow-hidden rounded-[24px] transition-transform active:scale-95"
          style={{
            background: '#edeae4',
            color: accent,
            boxShadow: isDragging ?'8px 8px 16px #c9c4bd, -8px -8px 16px #ffffff' : 'inset 3px 3px 7px #d4d0ca, inset -3px -3px 7px #ffffff',
            cursor: 'grab',
          }}
          onClick={e => e.stopPropagation()}
          {...dragHandleProps}
        >
          {playerImage ?(
            <img src={playerImage} alt={prospect.name} className="player-cutout h-full w-full object-contain object-bottom transition-transform duration-300 group-hover:scale-[1.04]" draggable="false" />
          ) : (
            <span className="font-display text-xl font-bold leading-none">{getInitials(prospect.name)}</span>
          )}
        </motion.button>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="prospect-soft-chip rounded-full px-3 py-1 font-mono text-[11px] font-black tabular-nums" style={{ color: accent, background: '#edeae4', boxShadow: '2px 2px 5px #d4d0ca, -2px -2px 5px #ffffff' }}>
              #{String(prospect.rank).padStart(2, '0')}
            </span>

            {onTierChange ?(
              <select
                value={prospect.tier}
                onClick={e => e.stopPropagation()}
                onPointerDown={e => e.stopPropagation()}
                onChange={e => onTierChange(prospect.id, e.target.value)}
                className="prospect-tier-select rounded-full px-3 py-1 font-mono text-[9px] font-black uppercase tracking-[.16em] outline-none"
                style={{ background: tier.bg, color: tier.text, boxShadow: '2px 2px 5px #d4d0ca, -2px -2px 5px #ffffff' }}
              >
                {Object.keys(TIER_STYLES).map(tierKey => (
                  <option key={tierKey} value={tierKey}>{formatTierLabel(tierKey)}</option>
                ))}
              </select>
            ) : (
              <span className="rounded-full px-3 py-1 font-mono text-[9px] font-black uppercase tracking-[.16em]" style={{ background: tier.bg, color: tier.text }}>
                {formatTierLabel(prospect.tier)}
              </span>
            )}
          </div>

          <h2 className="truncate font-display text-2xl font-black leading-tight tracking-tight text-slate-800">{prospect.name}</h2>

          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-muted">
            <span className="rounded-full bg-white/42 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[.14em]" style={{ color: tier.text }}>{prospect.position}</span>
            <span className="rounded-full bg-white/35 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[.14em] text-slate-600">{prospect.team}</span>
            <span className="font-semibold">{prospect.age} anos</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 px-5 pb-4">
        <PhysicalChip label="Altura" value={formatLengthMetric(prospect.height)} color={accent} />
        <PhysicalChip label="Peso" value={formatWeightMetric(prospect.weight)} color={accent} />
        <PhysicalChip label="Enverg." value={formatLengthCm(prospect.wingspan)} color={accent} />
      </div>

      <div className="grid grid-cols-4 gap-2 px-5 pb-4">
        <CoreStat label="PPG" value={stats.ppg} />
        <CoreStat label="RPG" value={stats.rpg} />
        <CoreStat label="APG" value={stats.apg} />
        <CoreStat label="FG%" value={stats.fgp} suffix="%" />
      </div>

      <section className="mx-5 mb-4 rounded-[24px] border border-white/50 bg-white/25 p-3 backdrop-blur-sm">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-[10px] font-black uppercase tracking-[.2em] text-lo">Advanced Snapshot</span>
          <span className="h-2 w-2 rounded-full" style={{ background: accent, boxShadow: '0 0 14px ' + tier.glow }} />
        </div>
        <div className="grid gap-2">
          {ADVANCED_SNAPSHOT.map(stat => (
            <AdvancedMetric key={stat.key} stat={stat} value={stats[stat.key]} color={accent} />
          ))}
        </div>
      </section>

      <section className="mx-5 mb-4 rounded-[24px] border border-white/50 bg-white/30 px-4 py-3 backdrop-blur-sm">
        <div className="mb-1 font-mono text-[10px] font-black uppercase tracking-[.2em]" style={{ color: tier.text }}>Scout Teaser</div>
        <p className="line-clamp-2 font-sans text-sm font-semibold leading-6 text-slate-600">{teaser}</p>
      </section>

      <div className="mt-auto flex items-center justify-between border-t border-white/45 px-5 py-4">
        <span className="font-mono text-[10px] font-black uppercase tracking-[.18em] text-lo">Dossier completo</span>
        <span className="font-sans text-sm font-black transition-transform duration-200 group-hover:translate-x-1" style={{ color: accent }}>Ver perfil completo →</span>
      </div>
    </motion.article>
  )
}
