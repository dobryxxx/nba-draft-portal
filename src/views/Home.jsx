import { motion } from 'framer-motion'
import { BarChart3, Database, Gauge, Layers, Sparkles, Target, TrendingDown, TrendingUp, Zap } from 'lucide-react'
import { getPlayerCutoutImage } from '../utils/playerImages'

const TIER_STYLES = {
  CORNERSTONE: { label: 'CORNERSTONE', color: '#7c3aed', bg: '#eee9fb', text: '#5b21b6', glow: 'rgba(124,58,237,.26)', wash: 'rgba(124,58,237,.13)', accent: 'rgba(196,181,253,.28)' },
  ELITE: { label: 'ELITE', color: '#d4af37', bg: '#fff4c2', text: '#8a6a00', glow: 'rgba(212,175,55,.25)', wash: 'rgba(212,175,55,.14)', accent: 'rgba(255,231,128,.34)' },
  LOTTERY: { label: 'LOTERIA', color: '#10b981', bg: '#dff8ed', text: '#047857', glow: 'rgba(16,185,129,.22)', wash: 'rgba(16,185,129,.13)', accent: 'rgba(167,243,208,.34)' },
  MID_1ST: { label: 'MID 1ST', color: '#3b82f6', bg: '#e0efff', text: '#1d4ed8', glow: 'rgba(59,130,246,.22)', wash: 'rgba(59,130,246,.13)', accent: 'rgba(191,219,254,.38)' },
  FRINGE: { label: 'FRINGE', color: '#f97316', bg: '#ffedd5', text: '#c2410c', glow: 'rgba(249,115,22,.23)', wash: 'rgba(249,115,22,.14)', accent: 'rgba(254,215,170,.36)' },
  SLEEPER: { label: 'SLEEPER', color: '#8b5e34', bg: '#f4eadc', text: '#5f3f20', glow: 'rgba(139,94,52,.22)', wash: 'rgba(139,94,52,.14)', accent: 'rgba(222,184,135,.34)' },
}

const normalizeTierKey = tier => ({ ALL_STAR: 'LOTTERY', STARTER: 'MID_1ST', FRINGE_FIRST: 'FRINGE', ROLE_PLAYER: 'SLEEPER' }[tier] || tier)

const sectionMotion = {
  hidden: { opacity: 0, y: 18, scale: .985 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: .45, ease: [0.22, 1, 0.36, 1] } },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: .08, delayChildren: .04 } },
}

function getTierStyle(tier) {
  return TIER_STYLES[normalizeTierKey(tier)] || TIER_STYLES.LOTTERY
}

function getArchetype(prospect) {
  const pos = String(prospect?.position || '').toUpperCase()
  const s = prospect?.stats || {}
  if ((s.ppg || 0) >= 20 && (s.apg || 0) >= 4) return 'Primary Creator'
  if ((s.threep || 0) >= 38 || (s.ts || 0) >= 62) return 'Shot Maker'
  if (pos.includes('C') && ((s.blkPct || 0) >= 5 || (s.rpg || 0) >= 8)) return 'Interior Anchor'
  if ((s.apg || 0) >= 5) return 'Playmaker'
  if ((s.stlPct || 0) >= 2.5 || (s.blkPct || 0) >= 4) return 'Two-Way Tool'
  if (pos.includes('F')) return 'Modern Forward'
  return 'Scoring Guard'
}

function getClassIntel(prospects) {
  const sorted = [...prospects].sort((a, b) => (a.rank || 99) - (b.rank || 99))
  const topFive = sorted.slice(0, 5)
  const wings = prospects.filter(p => /SF|PF|W|F/i.test(p.position || '')).length
  const shooters = prospects.filter(p => (p.stats?.threep || 0) >= 37).length
  const avgTopTs = topFive.length ? topFive.reduce((sum, p) => sum + (p.stats?.ts || 0), 0) / topFive.length : 0
  return [
    { icon: Sparkles, title: 'Top 5 de alto impacto', body: topFive.map(p => p.name.split(' ').slice(-1)[0]).join(', ') || 'Board carregando', color: '#7c5ccf' },
    { icon: Layers, title: 'Wings criadores em alta', body: wings + ' forwards/wings mapeados para cenarios de fit.', color: '#5aaed6' },
    { icon: Gauge, title: 'Eficiencia no topo', body: avgTopTs ? 'TS medio do top 5 em ' + avgTopTs.toFixed(1) + '%.' : 'Sem dados suficientes.', color: '#4f9577' },
    { icon: TrendingDown, title: 'Queda apos lottery', body: 'Valor do board muda forte depois da faixa 10-14.', color: '#d96fa0' },
    { icon: Target, title: 'Spacing monitor', body: shooters + ' jogadores acima de 37% de 3PT.', color: '#b9912f' },
  ]
}

function StatusBadge({ children, color = '#7c5ccf', bg = 'rgba(238,233,251,.75)' }) {
  return (
    <span className="home-status-badge inline-flex items-center gap-2 rounded-full border border-white/35 px-3 py-2 font-mono text-[9px] font-black uppercase tracking-[.16em] backdrop-blur-md" style={{ color, background: bg }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color, boxShadow: '0 0 14px ' + color + '88' }} />
      {children}
    </span>
  )
}

function PlayerAvatar({ prospect, size = 'md' }) {
  const img = getPlayerCutoutImage(prospect)
  const initials = String(prospect.name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase()
  const dimension = size === 'lg' ? 'h-16 w-12' : 'h-12 w-9'

  return (
    <div 
      className={dimension + ' home-avatar-frame flex shrink-0 items-end justify-center overflow-hidden rounded-[18px] border border-white/35 font-sans text-lg font-extrabold backdrop-blur-md'} 
      style={{ 
        color: prospect.accentColor || '#7c5ccf',
        background: '#edeae4',
        boxShadow: 'inset 3px 3px 7px #d4d0ca, inset -3px -3px 7px #ffffff'
      }}
    >
      {img ? <img src={img} alt={prospect.name} className="player-cutout h-full w-full object-contain object-bottom" draggable="false" /> : initials}
    </div>
  )
}

function CommandHero({ onNavigate, prospectCount }) {
  return (
    <motion.header
      variants={sectionMotion}
      initial="hidden"
      animate="show"
      className="home-hero relative overflow-hidden rounded-[36px] border border-white/40 bg-white/35 px-5 py-6 shadow-[0_24px_70px_rgba(0,0,0,.08)] backdrop-blur-xl md:px-6 md:py-7 3xl:rounded-[42px] 3xl:px-8 3xl:py-8"
    >
      <motion.span animate={{ x: [0, 12, 0], y: [0, -8, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} className="home-ambient pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#eee9fb] blur-3xl" />
      <motion.span animate={{ x: [0, -10, 0], y: [0, 10, 0] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} className="home-ambient pointer-events-none absolute -bottom-24 left-12 h-72 w-72 rounded-full bg-[#edf7fd] blur-3xl" />
      <span className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/45 to-transparent" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between 3xl:gap-8">
        <div className="max-w-4xl">
          <div className="flex flex-wrap gap-2">
            <StatusBadge color="#4f9577" bg="rgba(229,244,236,.7)">Draft Engine Active</StatusBadge>
            <StatusBadge color="#7c5ccf" bg="rgba(238,233,251,.76)">2026 Class Loaded</StatusBadge>
          </div>
          <h1 className="mt-5 font-brand text-5xl font-extrabold leading-none tracking-tight text-slate-800 2xl:text-6xl 3xl:text-7xl">
            Draft Command Center
          </h1>
          <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-slate-600/80 3xl:text-lg 3xl:leading-8">
            Simule o Draft. Analise cenários. Tome decisões como um front office.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <motion.button
              type="button"
              onClick={() => onNavigate('mockdraft')}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: .98 }}
              className="rounded-full px-5 py-3 font-mono text-[11px] font-black uppercase tracking-[.2em] text-white shadow-[0_18px_42px_rgba(124,92,207,.22)]"
              style={{ background: 'linear-gradient(135deg, #7c5ccf, #5d7fcf)' }}
            >
              Entrar na War Room
            </motion.button>
            <motion.button
              type="button"
              onClick={() => onNavigate('bigboard')}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: .98 }}
              className="rounded-full border border-white/45 bg-white/30 px-5 py-3 font-mono text-[11px] font-black uppercase tracking-[.2em] text-slate-700 shadow-[0_12px_30px_rgba(0,0,0,.05)] backdrop-blur-md"
            >
              Explorar Big Board
            </motion.button>
          </div>
        </div>

        <div className="home-subcard grid min-w-[240px] gap-3 rounded-[30px] border border-white/35 bg-white/24 p-4 backdrop-blur-md">
          <HeroMetric label="Prospects" value={prospectCount || 0} color="#7c5ccf" />
          <HeroMetric label="Board" value="Custom" color="#5aaed6" />
          <HeroMetric label="Mode" value="Active" color="#4f9577" />
        </div>
      </div>
    </motion.header>
  )
}

function HeroMetric({ label, value, color }) {
  return (
    <div className="home-subcard flex items-center justify-between gap-5 rounded-2xl bg-white/28 px-4 py-3">
      <span className="font-mono text-[9px] font-black uppercase tracking-[.2em] text-lo">{label}</span>
      <span className="font-numeric text-xl font-extrabold tracking-tight" style={{ color }}>{value}</span>
    </div>
  )
}

function QuickActions({ onNavigate }) {
  const actions = [
    { id: 'mockdraft', title: 'Mock Draft', icon: Target, color: '#7c5ccf', description: 'Entre na War Room com a ordem da loteria definida e tome decisões pick a pick.' },
    { id: 'bigboard', title: 'Big Board', icon: BarChart3, color: '#5aaed6', description: 'Organize tiers, reordene jogadores e construa seu ranking customizado.' },
    { id: 'prospects', title: 'Prospect Database', icon: Database, color: '#4f9577', description: 'Explore perfis, stats, scouting e contexto de cada prospecto.' },
  ]

  return (
    <motion.section variants={stagger} initial="hidden" animate="show" className="grid gap-5 md:grid-cols-3">
      {actions.map(action => <QuickActionCard key={action.id} {...action} onNavigate={onNavigate} />)}
    </motion.section>
  )
}

function QuickActionCard({ id, title, description, icon: Icon, color, onNavigate }) {
  return (
    <motion.button
      type="button"
      variants={sectionMotion}
      onClick={() => onNavigate(id)}
      whileHover={{ y: -6, scale: 1.018 }}
      whileTap={{ scale: .985 }}
      className="home-action-card group relative min-h-[178px] overflow-hidden rounded-[30px] border border-white/35 bg-white/30 p-5 text-left shadow-[0_16px_48px_rgba(0,0,0,.06)] backdrop-blur-xl transition-all duration-300 3xl:min-h-[210px] 3xl:rounded-[34px] 3xl:p-6"
    >
      <span className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full blur-3xl transition-opacity duration-300 group-hover:opacity-80" style={{ background: color + '33' }} />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/35 bg-white/30 shadow-[0_12px_28px_rgba(0,0,0,.05)] backdrop-blur-md" style={{ color }}>
            <Icon size={24} strokeWidth={2.4} />
          </span>
          <span className="rounded-full bg-white/30 px-3 py-1 font-mono text-[8px] font-black uppercase tracking-[.16em] text-muted">Abrir</span>
        </div>
        <div className="mt-7">
          <h2 className="font-headline text-2xl font-extrabold tracking-tight text-slate-800">{title}</h2>
          <p className="mt-3 text-sm font-semibold leading-6 text-slate-600/75">{description}</p>
        </div>
      </div>
    </motion.button>
  )
}

function DraftIntel({ prospects = [] }) {
  const insights = getClassIntel(prospects).slice(0, 4)
  return (
    <motion.section variants={sectionMotion} initial="hidden" animate="show" className="home-panel rounded-[32px] border border-white/35 bg-white/24 p-5 shadow-[0_18px_56px_rgba(0,0,0,.06)] backdrop-blur-xl 3xl:rounded-[36px] 3xl:p-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="font-mono text-[9px] font-black uppercase tracking-[.28em] text-lo">INTEL</div>
          <h2 className="mt-1 font-headline text-3xl font-extrabold tracking-tight text-slate-800">Draft Intel</h2>
        </div>
        <span className="rounded-full border border-white/35 bg-white/25 px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[.16em] text-muted">live board signals</span>
      </div>
      <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {insights.map(item => <IntelCard key={item.title} {...item} />)}
      </motion.div>
    </motion.section>
  )
}

function IntelCard({ icon: Icon, title, body, color }) {
  return (
    <motion.div variants={sectionMotion} whileHover={{ y: -3, scale: 1.01 }} className="home-subcard rounded-[26px] border border-white/25 bg-white/22 p-4 backdrop-blur-md transition-all duration-300 hover:bg-white/32 hover:shadow-[0_14px_34px_rgba(0,0,0,.06)]">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/32" style={{ color }}><Icon size={18} strokeWidth={2.4} /></span>
        <div className="font-mono text-[8px] font-black uppercase tracking-[.18em] text-lo">Insight</div>
      </div>
      <h3 className="mt-4 font-headline text-lg font-extrabold text-slate-800">{title}</h3>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-600/75">{body}</p>
    </motion.div>
  )
}

function TopBoardPreview({ prospects = [], onNavigate }) {
  const topFive = [...prospects].sort((a, b) => (a.rank || 99) - (b.rank || 99)).slice(0, 5)
  return (
    <motion.section variants={sectionMotion} initial="hidden" animate="show" className="home-panel rounded-[32px] border border-white/35 bg-white/30 p-5 shadow-[0_18px_56px_rgba(0,0,0,.06)] backdrop-blur-xl 3xl:rounded-[36px] 3xl:p-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="font-mono text-[9px] font-black uppercase tracking-[.28em] text-lo">BOARD</div>
          <h2 className="mt-1 font-headline text-3xl font-extrabold tracking-tight text-slate-800">Top Board Preview</h2>
        </div>
        <motion.button type="button" onClick={() => onNavigate('prospects')} whileHover={{ y: -2, scale: 1.02 }} className="rounded-full border border-white/35 bg-white/30 px-4 py-2 font-mono text-[9px] font-black uppercase tracking-[.18em] text-[#7c5ccf] backdrop-blur-md">
          Abrir Database
        </motion.button>
      </div>
      <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-3">
        {topFive.map((prospect, index) => <BoardRow key={prospect.id} prospect={prospect} index={index} onNavigate={onNavigate} />)}
      </motion.div>
    </motion.section>
  )
}

function BoardRow({ prospect, index, onNavigate }) {
  const tier = getTierStyle(prospect.tier)
  const ppg = prospect.stats?.ppg
  return (
    <motion.button
      type="button"
      variants={sectionMotion}
      onClick={() => onNavigate('prospects')}
      whileHover={{ x: 5, scale: 1.006 }}
      whileTap={{ scale: .99 }}
      className="home-board-row grid items-center gap-4 rounded-[26px] border border-white/25 bg-white/20 p-4 text-left backdrop-blur-md transition-all duration-300 hover:bg-white/34 hover:shadow-[0_14px_34px_rgba(0,0,0,.055)] md:grid-cols-[58px_56px_minmax(0,1fr)_140px_130px]"
      style={{ boxShadow: index === 0 ? '0 16px 42px ' + tier.glow : undefined }}
    >
      <div className="font-numeric text-2xl font-extrabold tracking-tight" style={{ color: tier.color }}>#{prospect.rank || index + 1}</div>
      <PlayerAvatar prospect={prospect} />
      <div className="min-w-0">
        <div className="truncate text-lg font-extrabold tracking-tight text-slate-800">{prospect.name}</div>
        <div className="mt-1 truncate text-xs font-bold text-muted">{prospect.position} / {prospect.team}</div>
      </div>
      <div className="min-w-0">
        <span className="inline-flex max-w-full rounded-full px-3 py-1 font-mono text-[8px] font-black uppercase tracking-[.14em]" style={{ color: tier.color, background: tier.bg }}>{tier.label}</span>
      </div>
      <div className="min-w-0 text-left md:text-right">
        <div className="truncate text-sm font-extrabold text-slate-700">{getArchetype(prospect)}</div>
        <div className="mt-1 font-mono text-[8px] font-black uppercase tracking-[.14em] text-lo">{typeof ppg === 'number' ? ppg.toFixed(1) + ' PPG' : 'Fit tag'}</div>
      </div>
    </motion.button>
  )
}

export default function Home({ onNavigate, prospectCount, prospects = [] }) {
  return (
    <div className="home-root relative min-h-full overflow-hidden px-6 py-8" style={{ background: 'var(--color-bg-app)' }}>
      <span className="home-ambient pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-[#eee9fb]/70 blur-3xl" />
      <span className="home-ambient pointer-events-none absolute bottom-16 left-0 h-96 w-96 rounded-full bg-[#edf7fd]/70 blur-3xl" />
    <section className="relative mx-auto flex max-w-[1320px] flex-col gap-4 3xl:max-w-[1500px] 3xl:gap-5">
        <CommandHero onNavigate={onNavigate} prospectCount={prospectCount} />
        <QuickActions onNavigate={onNavigate} />
        <DraftIntel prospects={prospects} />
        <TopBoardPreview prospects={prospects} onNavigate={onNavigate} />
      </section>
    </div>
  )
}
