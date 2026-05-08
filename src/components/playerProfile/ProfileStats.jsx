import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Crosshair,
  Gauge,
  LineChart,
  Map,
  Scale,
  Search,
  Shield,
  Target,
  TrendingUp,
  X,
  Zap,
} from 'lucide-react'
import { prospects as ALL_PROSPECTS } from '../../data/prospects'
import { glass as dsGlass, typography as dsTypography, cn, glassCard } from '../../styles/designSystem'
import { ADV, clamp, metricNote, num, quality, role } from '../../utils/playerProfileLogic'

const EASE = [0.22, 1, 0.36, 1]

const glass = {
  inner: cn(dsGlass.inner, 'stats-room-inner transition-all duration-300'),
  chip: cn(dsGlass.chip, 'stats-room-chip transition-all duration-300'),
}

function Shell({ children, className = '', glow = '#ffffff', open = false }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: EASE }}
      whileHover={{ y: -1 }}
      className={open
        ? cn('relative overflow-visible transition-all duration-300', className)
        : glassCard('primary', cn('stats-room-panel relative overflow-hidden rounded-[28px] border-white/45 bg-white/34 p-4 shadow-[0_18px_54px_rgba(40,36,32,.07),inset_1px_1px_0_rgba(255,255,255,.68)] backdrop-blur-2xl transition-all duration-300 3xl:p-5', className))}
    >
      {!open && <span className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/60 to-transparent opacity-70" />}
      <span className={cn('pointer-events-none absolute rounded-full blur-3xl', open ? '-right-16 -top-10 h-52 w-52' : '-right-20 -top-20 h-60 w-60')} style={{ background: glow, opacity: open ? 0.1 : 0.13 }} />
      <div className="relative">{children}</div>
    </motion.section>
  )
}

const STAT_COPY = {
  ppg: 'Pressao de volume e responsabilidade ofensiva.',
  rpg: 'Fechamento de posse, motor e presenca fisica.',
  apg: 'Criacao para terceiros e leitura de vantagem.',
  ts: 'Eficiencia real ajustada por 2PT, 3PT e FT.',
  fgp: 'Conversao geral dentro do pacote de arremessos.',
  threep: 'Termometro de spacing e punicao no perimetro.',
  ftp: 'Toque, repeticao mecanica e confianca na linha.',
  efg: 'Eficiencia de quadra com peso extra para 3PT.',
  usg: 'Quanto do ataque passa pelas maos do jogador.',
  astTo: 'Controle entre criacao e perdas.',
  blkPct: 'Protecao de aro e impacto vertical.',
  stlPct: 'Atividade defensiva, maos e antecipacao.',
  per: 'Resumo de produtividade por minuto.',
}

const MAX = {
  ppg: 32,
  rpg: 13,
  apg: 9,
  ts: 72,
  fgp: 65,
  threep: 45,
  ftp: 90,
  efg: 68,
  usg: 36,
  astTo: 4,
  blkPct: 7,
  stlPct: 5,
  per: 34,
}

function metricValues(key) {
  return ALL_PROSPECTS.map(p => p.stats?.[key]).filter(v => typeof v === 'number')
}

function classRank(key, value) {
  if (typeof value !== 'number') return null
  const sorted = metricValues(key).sort((a, b) => b - a)
  const index = sorted.findIndex(v => v <= value)
  return index < 0 ? sorted.length : index + 1
}

function percentile(key, value) {
  if (typeof value !== 'number') return { label: 'Sem dado', pct: 0, rank: null }
  const values = metricValues(key).sort((a, b) => a - b)
  const below = values.filter(v => v <= value).length
  const pct = Math.round((below / Math.max(values.length, 1)) * 100)
  const rank = classRank(key, value)
  return {
    label: rank <= 10 ? `Top ${rank}` : `P${pct}`,
    pct,
    rank,
  }
}

function average(values) {
  const valid = values.filter(v => typeof v === 'number')
  return valid.length ? valid.reduce((sum, v) => sum + v, 0) / valid.length : null
}

function classAverage(key) {
  return average(metricValues(key))
}

function positionAverage(player, key) {
  const r = role(player.position)
  return average(ALL_PROSPECTS.filter(p => role(p.position) === r).map(p => p.stats?.[key]))
}

function statusFor(key, value, player, max = MAX[key] || 100) {
  if (typeof value !== 'number') {
    return { label: 'Sem dado', tone: '#9b948c', type: 'neutral', Icon: AlertTriangle }
  }
  const color = quality(key, value, player)
  const note = metricNote(key, value, player, max)
  if (note.includes('nivel alto')) return { label: 'Forca', tone: color, type: 'strong', Icon: CheckCircle2 }
  if (note.includes('media')) return { label: 'Neutro+', tone: color, type: 'neutral', Icon: Activity }
  return { label: 'Alerta', tone: color, type: 'watch', Icon: AlertTriangle }
}

function formatValue(value, suffix = '') {
  return typeof value === 'number' ? `${num(value)}${suffix}` : '-'
}

function shortName(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length <= 1) return parts[0] || 'Jogador'
  return `${parts[0][0]}. ${parts[parts.length - 1]}`
}

function statDelta(a, b, suffix = '') {
  if (typeof a !== 'number' || typeof b !== 'number') return '-'
  const diff = a - b
  return `${diff > 0 ? '+' : ''}${num(diff)}${suffix}`
}

function StatTitle({ children }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/30 px-3 py-1.5 font-mono text-[11px] font-black uppercase leading-none tracking-[.18em] text-ink shadow-[inset_1px_1px_0_rgba(255,255,255,.55)]">
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {children}
    </div>
  )
}

function CompareMiniPanel({ player, compare, value, other, suffix, better, color }) {
  if (!compare) return null
  const hasNumbers = typeof value === 'number' && typeof other === 'number'
  const total = hasNumbers ? Math.max(Math.abs(value) + Math.abs(other), 1) : 1
  const playerPct = hasNumbers ? clamp((Math.abs(value) / total) * 100, 8, 92) : 50
  const comparePct = hasNumbers ? clamp((Math.abs(other) / total) * 100, 8, 92) : 50
  const compareColor = '#8aa0b8'

  return (
    <div className="relative mt-3 overflow-hidden rounded-2xl border border-white/25 bg-white/20 p-3">
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/50" />
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="font-mono text-[7px] font-black uppercase tracking-[.18em] text-lo">Head-to-head</span>
        <span className="rounded-full border border-white/25 bg-white/20 px-2 py-0.5 font-mono text-[7px] font-black uppercase tracking-[.14em]" style={{ color }}>
          {hasNumbers ? (better ? shortName(player.name) : shortName(compare.name)) : 'Sem dado'}
        </span>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: color }} />
            <div className="truncate font-mono text-[7px] font-black uppercase tracking-[.14em] text-lo">{shortName(player.name)}</div>
          </div>
          <div className={cn('mt-1 font-mono text-sm font-black', better ? 'text-ink' : 'text-muted')}>{formatValue(value, suffix)}</div>
        </div>
        <span className="mt-5 font-mono text-[8px] font-black text-lo">VS</span>
        <div className="min-w-0 text-right">
          <div className="flex items-center justify-end gap-1.5">
            <div className="truncate font-mono text-[7px] font-black uppercase tracking-[.14em] text-lo">{shortName(compare.name)}</div>
            <span className="h-2 w-2 rounded-full" style={{ background: compareColor }} />
          </div>
          <div className={cn('mt-1 font-mono text-sm font-black', !better ? 'text-ink' : 'text-muted')}>{formatValue(other, suffix)}</div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-[1fr_1fr] gap-1.5">
        <div className="flex h-2 justify-end rounded-full bg-white/18">
          <motion.span
            initial={{ width: 0 }}
            whileInView={{ width: `${playerPct}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: EASE }}
            className="rounded-full"
            style={{ background: color }}
          />
        </div>
        <div className="flex h-2 justify-start rounded-full bg-white/18">
          <motion.span
            initial={{ width: 0 }}
            whileInView={{ width: `${comparePct}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: EASE }}
            className="rounded-full"
            style={{ background: compareColor }}
          />
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2 font-mono text-[8px] font-black uppercase tracking-[.16em]">
        <span className="text-lo">Delta</span>
        <span style={{ color }}>{statDelta(value, other, suffix)}</span>
      </div>
    </div>
  )
}

function sparkPoints(value, avg, max) {
  const base = clamp(((value || 0) / max) * 100, 8, 96)
  const avgPct = clamp(((avg || max * 0.48) / max) * 100, 8, 92)
  return [avgPct * 0.72, base * 0.62, avgPct * 0.9, base * 0.82, base].map((v, i) => {
    const x = 6 + i * 21
    const y = 52 - clamp(v, 8, 96) * 0.44
    return `${x},${y}`
  }).join(' ')
}

function Sparkline({ value, avg, max, color }) {
  return (
    <svg viewBox="0 0 96 56" className="h-14 w-full overflow-visible" aria-hidden="true">
      <path d="M6 44H90" stroke="currentColor" strokeOpacity=".16" strokeWidth="1.5" />
      <path d="M6 30H90" stroke="currentColor" strokeOpacity=".10" strokeWidth="1.5" />
      <motion.polyline
        points={sparkPoints(value, avg, max)}
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, ease: EASE }}
      />
    </svg>
  )
}

function DistributionBars({ keyName, value, color }) {
  const values = metricValues(keyName).sort((a, b) => a - b)
  const buckets = Array.from({ length: 7 }, (_, i) => values[Math.floor((values.length - 1) * (i / 6))] || 0)
  const maxBucket = Math.max(...buckets, 1)
  return (
    <div className="mt-3 flex h-10 items-end gap-1.5">
      {buckets.map((bucket, index) => {
        const active = typeof value === 'number' && value >= bucket
        return (
          <span
            key={`${bucket}-${index}`}
            className="flex-1 rounded-t-full bg-white/28"
            style={{
              height: `${28 + (bucket / maxBucket) * 64}%`,
              background: active ? color : undefined,
              opacity: active ? 0.72 : 0.55,
            }}
          />
        )
      })}
    </div>
  )
}

function MetricBar({ value, avg, max, color }) {
  const valuePct = clamp(((value || 0) / max) * 100, 0, 100)
  const avgPct = clamp(((avg || 0) / max) * 100, 0, 100)
  return (
    <div className="relative mt-4 h-2 rounded-full bg-white/28 shadow-inner">
      <motion.span
        className="absolute inset-y-0 left-0 rounded-full"
        initial={{ width: 0 }}
        whileInView={{ width: `${valuePct}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, ease: EASE }}
        style={{ background: color }}
      />
      <span
        className="absolute top-1/2 h-4 w-px -translate-y-1/2 bg-slate-700/35"
        style={{ left: `${avgPct}%` }}
        title="Media da classe/posicao"
      />
    </div>
  )
}

function StatusBadge({ status }) {
  const Icon = status.Icon
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/28 px-2.5 py-1 font-mono text-[7px] font-black uppercase tracking-[.14em]"
      style={{ color: status.tone }}
      title={`Estado visual: ${status.label}`}
    >
      <Icon size={11} />
      {status.label}
    </span>
  )
}

function KpiCard({ player, compare, stat, label, suffix = '', max, Icon, featured = false }) {
  const value = player.stats?.[stat]
  const other = compare?.stats?.[stat]
  const status = statusFor(stat, value, player, max)
  const rank = percentile(stat, value)
  const avg = classAverage(stat)
  const posAvg = positionAverage(player, stat)
  const better = compare && typeof value === 'number' && typeof other === 'number' ? value >= other : false

  return (
    <motion.article
      whileHover={{ y: -4, scale: 1.006 }}
      className={cn('stats-room-kpi relative overflow-hidden rounded-[26px] border border-white/40 bg-white/30 p-3.5 backdrop-blur-2xl', featured && 'xl:col-span-1')}
      style={{ '--metric-color': status.tone }}
      title={STAT_COPY[stat]}
    >
      <span className="pointer-events-none absolute -right-14 -top-16 h-40 w-40 rounded-full blur-3xl" style={{ background: status.tone, opacity: featured ? 0.22 : 0.14 }} />
      <div className="relative flex items-start justify-between gap-3">
        <span className={cn('flex shrink-0 items-center justify-center rounded-2xl border border-white/35 bg-white/30', featured ? 'h-10 w-10' : 'h-9 w-9')} style={{ color: status.tone }}>
          <Icon size={featured ? 19 : 16} />
        </span>
        <div className="flex flex-wrap justify-end gap-1.5">
          <StatusBadge status={status} />
          <span className="rounded-full border border-white/30 bg-white/24 px-2.5 py-1 font-mono text-[7px] font-black uppercase tracking-[.14em]" style={{ color: status.tone }}>
            {rank.label}
          </span>
        </div>
      </div>

      <div className="relative mt-4">
        <StatTitle>{label}</StatTitle>
        <div className={cn('mt-1 font-numeric font-black leading-none tracking-tight', featured ? 'text-5xl 3xl:text-6xl' : 'text-4xl 3xl:text-5xl')} style={{ color: status.tone }}>
          {formatValue(value, suffix)}
        </div>
        <p className="mt-2 text-[11px] font-bold leading-5 text-muted">{STAT_COPY[stat]}</p>
      </div>

      <Sparkline value={value} avg={avg} max={max} color={status.tone} />

      <div className="relative mt-2 grid grid-cols-2 gap-2">
        <div className="rounded-2xl border border-white/25 bg-white/20 px-3 py-2">
          <div className="font-mono text-[7px] font-black uppercase tracking-[.16em] text-lo">Classe</div>
          <div className="mt-1 font-mono text-xs font-black text-ink">{formatValue(avg, suffix)}</div>
        </div>
        <div className="rounded-2xl border border-white/25 bg-white/20 px-3 py-2">
          <div className="font-mono text-[7px] font-black uppercase tracking-[.16em] text-lo">Posicao</div>
          <div className="mt-1 font-mono text-xs font-black text-ink">{formatValue(posAvg, suffix)}</div>
        </div>
      </div>

      <CompareMiniPanel player={player} compare={compare} value={value} other={other} suffix={suffix} better={better} color={status.tone} />
    </motion.article>
  )
}

function getDecisionNotes(player) {
  const s = player.stats || {}
  const candidates = [
    ['Principal forca numerica', s.ppg, 'ppg', 'Volume de pontuacao pressiona defesas e muda cobertura.', TrendingUp],
    ['Principal forca numerica', s.ts, 'ts', 'Eficiencia sustenta o volume sem punir a posse.', Gauge],
    ['Principal forca numerica', s.threep, 'threep', 'Arremesso exterior abre caminho simples de traducao.', Target],
    ['Principal forca numerica', s.astTo, 'astTo', 'Controle de criacao reduz risco de papel secundario.', Crosshair],
    ['Principal forca numerica', Math.max(s.stlPct || 0, s.blkPct || 0), 'stlPct', 'Atividade defensiva aparece nos eventos.', Shield],
  ].filter(([, value]) => typeof value === 'number')
  const best = candidates.sort((a, b) => (classRank(a[2], a[1]) || 99) - (classRank(b[2], b[1]) || 99))[0]
  const alert = typeof s.threep === 'number' && s.threep < 32
    ? 'Bola de 3 ainda limita spacing e margem de erro.'
    : typeof s.astTo === 'number' && s.astTo < 1.2
      ? 'AST/TO pede cuidado antes de escalar criacao.'
      : typeof s.ts === 'number' && s.ts < 54
        ? 'Eficiencia precisa subir para sustentar volume NBA.'
        : 'Sem alerta estatistico gritante no painel principal.'
  const efficiency = typeof s.ts === 'number'
    ? s.ts >= 60
      ? 'Eficiencia acima da media para o volume.'
      : s.ts >= 55
        ? 'Eficiencia funcional, sensivel ao contexto.'
        : 'Eficiencia ainda em desenvolvimento.'
    : 'Eficiencia sem amostra confiavel.'

  return [
    { label: best?.[0] || 'Principal forca numerica', copy: best ? best[3] : 'Amostra ainda em avaliacao.', color: '#a79be8', Icon: best?.[4] || TrendingUp },
    { label: 'Alerta estatistico', copy: alert, color: alert.startsWith('Sem') ? '#6fbf9c' : '#e0b66f', Icon: AlertTriangle },
    { label: 'Leitura de eficiencia', copy: efficiency, color: '#8bbfe8', Icon: Gauge },
  ]
}

function DecisionReadout({ player }) {
  return (
    <section className="grid gap-3 lg:grid-cols-3">
      {getDecisionNotes(player).map(({ label, copy, color, Icon }, index) => (
        <motion.article
          key={label}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05, duration: 0.35, ease: EASE }}
          className="stats-room-note flex gap-3 rounded-[24px] border border-white/35 bg-white/24 px-4 py-3 backdrop-blur-2xl"
        >
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-white/30 bg-white/24" style={{ color }}>
            <Icon size={17} />
          </span>
          <div>
            <div className="font-mono text-[8px] font-black uppercase tracking-[.18em]" style={{ color }}>{label}</div>
            <p className="mt-1 text-sm font-bold leading-6 text-muted">{copy}</p>
          </div>
        </motion.article>
      ))}
    </section>
  )
}

function ComparePlayerSelector({ player, selected, onSelect, onClose, accent }) {
  const [query, setQuery] = useState('')
  const list = ALL_PROSPECTS
    .filter(x => x.id !== player.id)
    .filter(x => [x.name, x.position, x.team].join(' ').toLowerCase().includes(query.toLowerCase()))
    .slice(0, 12)

  return createPortal(
    <div className="fixed inset-0 z-[2147483647] pointer-events-none">
      <button aria-label="Fechar comparacao" onClick={onClose} className="absolute inset-0 cursor-default bg-transparent pointer-events-auto" />
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        className="stats-compare-modal pointer-events-auto absolute right-4 top-[112px] w-[min(500px,calc(100vw-32px))] overflow-hidden rounded-[30px] border border-white/80 bg-[#f8f6f1]/[.98] p-4 shadow-[0_44px_140px_rgba(33,30,27,.34),0_0_0_1px_rgba(255,255,255,.86),inset_1px_1px_0_rgba(255,255,255,.95)] backdrop-blur-3xl md:right-8 md:top-[128px]"
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="font-mono text-[9px] font-black uppercase tracking-[.24em] text-lo">Compare Mode</div>
            <div className="mt-1 font-display text-2xl font-black leading-none text-ink">Escolha um jogador</div>
            <p className="mt-1 text-xs font-bold leading-5 text-[#5f5852]">Compare producao, eficiencia e contexto contra outro prospecto.</p>
          </div>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/60 bg-white/70 text-mid shadow-sm">
            <X size={16} />
          </button>
        </div>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-lo" size={16} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar por nome, posicao ou time"
            className="w-full rounded-[22px] border border-white/60 bg-white/85 py-3 pl-9 pr-4 text-sm font-bold text-ink outline-none backdrop-blur-xl placeholder:text-muted"
          />
        </div>
        <div className="grid max-h-[min(390px,calc(100vh-300px))] gap-2 overflow-auto pr-1">
          {list.map(x => (
            <button
              key={x.id}
              onClick={() => onSelect(x)}
              className={cn('group flex items-center gap-3 rounded-[22px] border border-white/50 px-3 py-3 text-left transition-all duration-200 hover:-translate-y-[1px]', selected?.id === x.id ? 'bg-white/90' : 'bg-white/72')}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/60 font-mono text-xs font-black" style={{ color: accent }}>#{x.rank}</div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-display text-lg font-black text-ink">{x.name}</div>
                <div className="truncate text-xs font-bold text-muted">{x.position} - {x.team}</div>
              </div>
              <span className="rounded-full bg-white/55 px-2.5 py-1 font-mono text-[8px] font-black uppercase tracking-wider text-mid">{x.tier}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>,
    document.body,
  )
}

function CompareBanner({ player, compare, accent, onClear }) {
  if (!compare) return null
  const keys = ['ppg', 'rpg', 'apg', 'ts', 'efg', 'usg', 'astTo', 'per', 'fgp', 'threep', 'ftp']
  const score = keys.reduce((sum, key) => {
    const a = player.stats?.[key]
    const b = compare.stats?.[key]
    if (typeof a !== 'number' || typeof b !== 'number') return sum
    return sum + (a > b ? 1 : a < b ? -1 : 0)
  }, 0)
  const label = Math.abs(score) <= 1 ? 'Comparacao equilibrada' : score > 0 ? `${player.name} leva vantagem` : `${compare.name} leva vantagem`

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="stats-room-note flex flex-wrap items-center justify-between gap-3 rounded-[28px] border border-white/40 bg-white/24 p-4 backdrop-blur-2xl">
      <div>
        <div className="font-mono text-[9px] font-black uppercase tracking-[.24em] text-lo">Compare Readout</div>
        <div className="mt-1 font-display text-2xl font-black text-ink">{label}</div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-white/28 px-3 py-1.5 font-mono text-[9px] font-black uppercase tracking-[.18em] text-muted">{player.name} vs {compare.name}</span>
        <button onClick={onClear} className="rounded-full border border-white/35 bg-white/28 px-3 py-1.5 font-mono text-[9px] font-black uppercase tracking-[.18em]" style={{ color: accent }}>
          Remover
        </button>
      </div>
    </motion.div>
  )
}

function ShootingMetricCard({ player, compare, stat, label, volume, max, suffix = '%' }) {
  const value = player.stats?.[stat]
  const other = compare?.stats?.[stat]
  const status = statusFor(stat, value, player, max)
  const avg = classAverage(stat)
  const posAvg = positionAverage(player, stat)
  const better = compare && typeof value === 'number' && typeof other === 'number' ? value >= other : false

  return (
    <motion.article whileHover={{ y: -3, scale: 1.006 }} className="stats-room-card relative overflow-hidden rounded-[24px] border border-white/35 bg-white/24 p-3.5 backdrop-blur-2xl" title={STAT_COPY[stat]}>
      <span className="pointer-events-none absolute -right-10 -top-14 h-28 w-28 rounded-full blur-3xl" style={{ background: status.tone, opacity: 0.13 }} />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <StatTitle>{label}</StatTitle>
          <div className="mt-1.5 font-numeric text-4xl font-black leading-none tracking-tight" style={{ color: status.tone }}>{formatValue(value, suffix)}</div>
        </div>
        <StatusBadge status={status} />
      </div>
      <MetricBar value={value} avg={posAvg || avg} max={max} color={status.tone} />
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-2xl border border-white/25 bg-white/18 px-3 py-2">
          <div className="font-mono text-[7px] font-black uppercase tracking-[.16em] text-lo">Volume</div>
          <div className="mt-1 truncate font-mono text-xs font-black text-ink">{volume}</div>
        </div>
        <div className="rounded-2xl border border-white/25 bg-white/18 px-3 py-2">
          <div className="font-mono text-[7px] font-black uppercase tracking-[.16em] text-lo">Pos Avg</div>
          <div className="mt-1 font-mono text-xs font-black text-ink">{formatValue(posAvg, suffix)}</div>
        </div>
      </div>
      <CompareMiniPanel player={player} compare={compare} value={value} other={other} suffix={suffix} better={better} color={status.tone} />
      <p className="mt-2 line-clamp-2 text-[11px] font-semibold leading-5 text-muted">{metricNote(stat, value, player, max)}</p>
    </motion.article>
  )
}

function AdvancedMetricCard({ player, compare, stat, label, value, max, suffix = '' }) {
  const status = statusFor(stat, value, player, max)
  const avg = classAverage(stat)
  const other = compare?.stats?.[stat]
  const better = compare && typeof value === 'number' && typeof other === 'number' ? value >= other : false

  return (
    <motion.article whileHover={{ y: -2, scale: 1.005 }} className="stats-room-card rounded-[22px] border border-white/35 bg-white/22 p-3 backdrop-blur-2xl" title={STAT_COPY[stat]}>
      <div className="flex items-center justify-between gap-2">
        <StatTitle>{label}</StatTitle>
        <StatusBadge status={status} />
      </div>
      <div className="mt-2 font-numeric text-3xl font-black leading-none tracking-tight" style={{ color: status.tone }}>{formatValue(value, suffix)}</div>
      <MetricBar value={value} avg={avg} max={max} color={status.tone} />
      <CompareMiniPanel player={player} compare={compare} value={value} other={other} suffix={suffix} better={better} color={status.tone} />
      <p className="mt-2 line-clamp-2 text-[11px] font-semibold leading-5 text-muted">{metricNote(stat, value, player, max)}</p>
    </motion.article>
  )
}

function AdvancedContextPanel({ player, compare, accent }) {
  const s = player.stats || {}
  const stats = ['ts', 'efg', 'usg', 'astTo', 'blkPct', 'stlPct', 'per']
  const labels = Object.fromEntries(ADV.map(([key, label, max, suffix]) => [key, { label, max, suffix }]))

  return (
    <Shell className="p-4" glow={accent}>
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <div className={cn(dsTypography.sectionLabel, 'text-lo')}>ADVANCED CONTEXT</div>
          <h3 className="mt-1 font-sans text-xl font-extrabold tracking-tight text-slate-950 3xl:text-2xl">Painel de decisao</h3>
        </div>
        <LineChart size={22} style={{ color: accent }} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {stats.map(key => (
          <AdvancedMetricCard key={key} player={player} compare={compare} stat={key} label={labels[key]?.label || key} max={labels[key]?.max || MAX[key] || 100} value={s[key]} suffix={labels[key]?.suffix || ''} />
        ))}
      </div>
    </Shell>
  )
}

function ShootingProfilePanel({ player, compare, accent }) {
  const s = player.stats || {}
  const fgVol = typeof s.fgm === 'number' && typeof s.fga === 'number' ? `${num(s.fgm)}/${num(s.fga)} por jogo` : 'volume nao informado'
  const threeVol = typeof s.threepm === 'number' && typeof s.threepa === 'number' ? `${num(s.threepm)}/${num(s.threepa)} por jogo` : 'volume nao informado'
  const ftVol = typeof s.ftm === 'number' && typeof s.fta === 'number' ? `${num(s.ftm)}/${num(s.fta)} por jogo` : 'lances livres'

  return (
    <Shell className="p-4" glow="#8bbfe8">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className={cn(dsTypography.sectionLabel, 'text-lo')}>SHOOTING PROFILE / SHOT ECONOMY</div>
          <h3 className="mt-1 font-sans text-xl font-extrabold tracking-tight text-slate-950 3xl:text-2xl">Arremesso e volume</h3>
        </div>
        <span className="rounded-full border border-white/35 bg-white/24 px-4 py-2 font-mono text-[9px] font-black uppercase tracking-[.18em]" style={{ color: accent }}>
          {typeof s.games === 'number' ? `${s.games} jogos` : 'jogos -'}
        </span>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <ShootingMetricCard player={player} compare={compare} stat="fgp" label="FG%" volume={fgVol} max={MAX.fgp} />
        <ShootingMetricCard player={player} compare={compare} stat="threep" label="3PT%" volume={threeVol} max={MAX.threep} />
        <ShootingMetricCard player={player} compare={compare} stat="ftp" label="FT%" volume={ftVol} max={MAX.ftp} />
      </div>
    </Shell>
  )
}

function ShotMapPlaceholder({ compare, accent }) {
  return (
    <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} className="stats-room-panel relative overflow-hidden rounded-[36px] border border-white/35 bg-white/20 p-5 backdrop-blur-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className={dsTypography.sectionLabel}>SHOT MAP / SPATIAL PROFILE</div>
          <h3 className="mt-1 font-sans text-2xl font-extrabold tracking-tight text-slate-900">Mapa de arremessos</h3>
        </div>
        <div className="flex rounded-full border border-white/25 bg-white/22 p-1">
          <span className="rounded-full bg-white/38 px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[.18em]" style={{ color: accent }}>Shot chart</span>
          <span className="px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[.18em] text-muted">Heat map</span>
        </div>
      </div>
      <div className="relative mt-5 min-h-[210px] overflow-hidden rounded-[30px] border border-dashed border-white/45 bg-white/14 backdrop-blur-md">
        <span className="absolute left-1/2 top-[46%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30" />
        <span className="absolute bottom-0 left-1/2 h-24 w-48 -translate-x-1/2 rounded-t-full border border-b-0 border-white/30" />
        <span className="absolute bottom-0 left-1/2 h-14 w-28 -translate-x-1/2 rounded-t-full border border-b-0 border-white/30" />
        <span className="absolute bottom-0 left-1/2 h-7 w-7 -translate-x-1/2 rounded-full border border-white/30" />
        <span className="absolute bottom-0 left-1/2 h-28 w-px -translate-x-1/2 bg-white/22" />
        <div className="relative z-10 flex min-h-[210px] items-center justify-center p-6 text-center">
          <div>
            <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/35 bg-white/22" style={{ color: accent }}><Map size={20} /></span>
            <div className="font-display text-xl font-black text-ink">Dados de localizacao em breve</div>
            <p className="mt-2 max-w-md text-xs font-semibold leading-5 text-muted">Espaco preparado para zonas de arremesso confiaveis sem dominar o dashboard.</p>
            {compare && <p className="mt-3 font-mono text-[8px] font-black uppercase tracking-[.2em]" style={{ color: accent }}>Comparacao ativa preparada para overlay duplo</p>}
          </div>
        </div>
      </div>
    </motion.section>
  )
}

function DataNotesPanel({ accent }) {
  return (
    <motion.section initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="stats-room-note relative overflow-hidden rounded-[30px] border border-white/30 bg-white/18 p-4 backdrop-blur-2xl">
      <span className="pointer-events-none absolute -right-16 -top-20 h-40 w-40 rounded-full blur-3xl" style={{ background: accent, opacity: 0.1 }} />
      <div className="relative flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className={cn(dsTypography.sectionLabel, 'text-lo')}>DATA NOTES</div>
          <p className="mt-1 max-w-3xl text-xs font-semibold leading-5 text-[#6f6a64]">Fonte numerica principal: DraftBallr. Dados ausentes ficam em branco ate termos confirmacao limpa, sem estimativa escondida.</p>
        </div>
        <span className="rounded-full border border-white/30 bg-white/22 px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[.18em]" style={{ color: accent }}>Clean data first</span>
      </div>
    </motion.section>
  )
}

export default function ProfileStats({ p, accent }) {
  const [compareOpen, setCompareOpen] = useState(false)
  const [compare, setCompare] = useState(null)
  const s = p.stats || {}
  const kpis = useMemo(() => [
    { stat: 'ppg', label: 'PPG', suffix: '', max: MAX.ppg, Icon: TrendingUp, featured: true },
    { stat: 'rpg', label: 'RPG', suffix: '', max: MAX.rpg, Icon: Activity },
    { stat: 'apg', label: 'APG', suffix: '', max: MAX.apg, Icon: Crosshair },
    { stat: 'ts', label: 'TS%', suffix: '%', max: MAX.ts, Icon: Gauge },
  ], [])

  return (
    <div className="stats-command-center grid gap-4 3xl:gap-5">
      <Shell open className="overflow-visible p-0" glow={accent}>
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className={cn(dsTypography.sectionLabel, 'text-lo')}>WAR ROOM ANALYTICS</div>
            <h2 className="mt-1 font-sans text-2xl font-extrabold leading-tight tracking-tight text-slate-950 md:text-4xl 3xl:text-5xl">Producao e eficiencia</h2>
            <p className="mt-2 text-sm font-bold text-[#5f5852]">Numeros por jogo - {typeof s.games === 'number' ? `${s.games} jogos analisados` : 'jogos analisados nao informados'}</p>
          </div>
          <div className="relative z-[999]">
            <button
              onClick={() => setCompareOpen(value => !value)}
              className={cn(glass.chip, 'flex items-center gap-2 rounded-full px-5 py-3 font-mono text-[10px] font-black uppercase tracking-[.18em]')}
              style={{ color: accent }}
            >
              <Scale size={15} />
              {compare ? 'Trocar comparacao' : 'Comparar jogador'}
            </button>
            <AnimatePresence>
              {compareOpen && (
                <ComparePlayerSelector
                  player={p}
                  selected={compare}
                  accent={accent}
                  onClose={() => setCompareOpen(false)}
                  onSelect={value => {
                    setCompare(value)
                    setCompareOpen(false)
                  }}
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        <CompareBanner player={p} compare={compare} accent={accent} onClear={() => setCompare(null)} />

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-[1.15fr_1fr_1fr_1fr]">
          {kpis.map(item => (
            <KpiCard key={item.stat} player={p} compare={compare} {...item} />
          ))}
        </div>
      </Shell>

      <DecisionReadout player={p} />

      <section className="grid gap-4 3xl:gap-5">
        <ShootingProfilePanel player={p} compare={compare} accent={accent} />
        <AdvancedContextPanel player={p} compare={compare} accent={accent} />
      </section>

      <ShotMapPlaceholder compare={compare} accent={accent} />
      <DataNotesPanel accent={accent} />
    </div>
  )
}
