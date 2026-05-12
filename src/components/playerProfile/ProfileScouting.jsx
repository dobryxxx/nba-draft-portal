import { motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BadgeCheck,
  Brain,
  Crosshair,
  Flame,
  Layers,
  Puzzle,
  Quote,
  Route,
  Shield,
  ShieldCheck,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
  User,
  Wrench,
  Zap,
} from 'lucide-react'
import TeamLogoGlass from '../TeamLogoGlass'
import { mergeProspectWithManualIntelligence } from '../../data/prospectDraftIntelligence.ts'
import DraftFitBreakdown, { getDraftFitStatus } from '../DraftFitBreakdown'
import { getBestDraftFits } from '../../utils/draftFitAlgorithm.js'
import { glass as dsGlass, typography as dsTypography, cn, glassCard, motionPresets } from '../../styles/designSystem'
import {
  clamp,
  role,
  manualEvaluation,
  resolveOutcomeScores,
  getPlayerArchetype,
  getPlayerComp,
  getOverviewCopy,
  getStoryTags,
  getNBATranslation,
  getFloorLabel,
  getCeilingLabel,
  attrValue,
  getAttributeGrade,
} from '../../utils/playerProfileLogic'
import { normalizeProspectStats } from '../../utils/prospectStats'

const glass = {
  inner: cn(
    dsGlass.inner,
    'border-white/40 bg-white/30 shadow-[0_14px_40px_rgba(40,36,32,.055),inset_1px_1px_0_rgba(255,255,255,.62)] transition-all duration-300'
  ),
  chip: cn(
    dsGlass.chip,
    'border-white/40 bg-white/34 shadow-[0_8px_22px_rgba(40,36,32,.045),inset_1px_1px_0_rgba(255,255,255,.58)] transition-all duration-300 hover:-translate-y-[1px] hover:bg-white/55'
  ),
}

function Shell({ children, className = '' }) {
  return (
    <motion.section
      whileHover={{ y: -1 }}
      className={glassCard(
        'primary',
        'relative overflow-hidden rounded-[34px] border-white/45 bg-white/38 p-4 3xl:rounded-[36px] shadow-[0_24px_72px_rgba(40,36,32,.075),inset_1px_1px_0_rgba(255,255,255,.70)] backdrop-blur-2xl transition-all duration-300 3xl:p-6 ' + className
      )}
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/60 to-transparent opacity-70" />
      <span className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/26 blur-3xl" />
      <div className="relative">{children}</div>
    </motion.section>
  )
}

function scoutHeadline(p) {
  const s = normalizeProspectStats(p)
  const r = role(p.position)
  if ((s.ppg || 0) >= 20) return 'Criador ofensivo capaz de mudar o teto de um ataque'
  if ((s.threep || 0) >= 37) return 'Peça de spacing com tradução ofensiva clara'
  if (Math.max(s.stlPct || 0, s.blkPct || 0) >= 3) return 'Ferramenta defensiva que pode acelerar minutos NBA'
  if (r === 'big') return 'Big moderno com valor ligado a papel e contexto'
  return 'Prospecto de tradução contextual e margem de desenvolvimento'
}

function scoutVerdict(p) {
  const s = normalizeProspectStats(p)
  if ((s.ts || 0) >= 60 && (s.ppg || 0) >= 16) {
    return 'Perfil com boa relação entre volume e eficiência, o que reduz parte do risco de tradução.'
  }
  if ((s.threep || 0) < 31) {
    return 'O arremesso é o principal ponto de decisão: se estabilizar, o resto do pacote ganha muito mais valor.'
  }
  if ((s.astTo || 2) < 1.1 && (s.usg || 0) >= 24) {
    return 'A tomada de decisão sob volume precisa evoluir para sustentar papel maior.'
  }
  return 'O valor está em encaixar suas melhores ferramentas dentro de um papel NBA simples e repetivel.'
}

function getExecutiveSummary(p) {
  const copy = getOverviewCopy(p)
  return {
    headline: scoutHeadline(p),
    verdict: scoutVerdict(p),
    body: copy.body,
    tags: getStoryTags(p).slice(0, 4),
  }
}

function getNBAProjection(p) {
  const s = normalizeProspectStats(p)
  const r = role(p.position)
  const ideal = (s.ppg || 0) >= 18 ? 'Scorer secundário' : (s.apg || 0) >= 4 ? 'Conector ofensivo' : r === 'big' ? 'Big de rotação' : 'Peca de rotação'
  const context = (s.threep || 0) >= 36
    ? 'Ataques com espaçamento e criador primário ao lado'
    : Math.max(s.stlPct || 0, s.blkPct || 0) >= 3
      ? 'Times que valorizam pressão defensiva e transição'
      : r === 'big'
        ? 'Lineups com arremessadores ao redor'
        : 'Ambiente de desenvolvimento com papel bem definido'
  const limit = (s.threep || 0) < 32
    ? 'Consistência do arremesso'
    : (s.astTo || 2) < 1.2
      ? 'Tomada de decisão sob pressão'
      : (s.ts || 60) < 54
        ? 'Eficiência contra fisicalidade NBA'
        : 'Definir função sem perder agressividade'

  return [
    { label: 'Papel ideal', value: ideal, copy: 'Onde ele deve iniciar a carreira para gerar valor sem carregar peso excessivo.', Icon: User, color: '#a79be8' },
    { label: 'Contexto ideal', value: context, copy: 'Tipo de ecossistema que potencializa suas melhores ferramentas.', Icon: Puzzle, color: '#7ab8e8' },
    { label: 'Limitação crítica', value: limit, copy: 'O ponto que mais pode comprimir minutos, teto ou confiança no encaixe.', Icon: AlertTriangle, color: '#e8a6a6' },
  ]
}

function getScoutGrade(p) {
  if (p.scouting?.evaluation) {
    const { floor, ceiling } = resolveOutcomeScores(p)
    return Math.round(clamp((floor + ceiling) / 2, 35, 98))
  }
  const s = normalizeProspectStats(p)
  const rankBonus = clamp(34 - (p.rank || 30) * .55, 0, 34)
  const production = clamp((s.ppg || 10) * .9, 0, 24)
  const efficiency = clamp(((s.ts || 54) - 48) * 1.15, 0, 18)
  const tools = clamp(Math.max(s.stlPct || 0, s.blkPct || 0) * 2.2, 0, 12)
  const age = (p.age || 20) <= 19 ? 6 : 3
  return Math.round(clamp(48 + rankBonus + production + efficiency + tools + age, 58, 98))
}

function getScoutRisk(p) {
  const manualRisk = manualEvaluation(p)?.risk?.level
  if (manualRisk) return manualRisk
  const s = normalizeProspectStats(p)
  if ((s.threep || 36) < 31 || (s.astTo || 2) < 1.05 || (s.ts || 60) < 52) return 'High'
  if ((s.threep || 36) < 34 || (s.ts || 60) < 55 || (p.rank || 99) > 24) return 'Moderate'
  return 'Low'
}

function scoutItemTitle(text, type) {
  const t = String(text || '').trim()
  if (!t) return type === 'strength' ? 'Ferramenta positiva' : 'Ponto de atencao'
  const clean = t.split(/[.:;]/)[0].replace(/^[-\s]+/, '')
  return clean.length > 38 ? clean.slice(0, 36).trim() + '...' : clean
}

function scoutImpact(text, type, index) {
  if (type === 'weakness') return index === 0 ? 'Risk' : 'Development'
  const t = String(text || '').toLowerCase()
  if (index === 0 || t.includes('elite') || t.includes('alto') || t.includes('forte')) return 'Elite'
  if (index <= 2) return 'Plus'
  return 'Solid'
}

function scoutCategory(text = '', type = 'strength') {
  const t = String(text).toLowerCase()
  if (t.includes('defens') || t.includes('toco') || t.includes('aro') || t.includes('stl') || t.includes('blk')) return 'Defense'
  if (t.includes('arremesso') || t.includes('shoot') || t.includes('3') || t.includes('spacing')) return 'Shooting'
  if (t.includes('cria') || t.includes('passe') || t.includes('play') || t.includes('turnover')) return 'Creation'
  if (t.includes('fisic') || t.includes('atlet') || t.includes('forca') || t.includes('explos')) return 'Physical'
  if (t.includes('qi') || t.includes('leitura') || t.includes('instint')) return 'Feel'
  return type === 'strength' ? 'Translation' : 'Development'
}

function nbaTranslationForTake(text = '', type = 'strength') {
  const category = scoutCategory(text, type)
  if (type === 'weakness') {
    if (category === 'Shooting') return 'Pode reduzir spacing e confiança de minutos.'
    if (category === 'Creation') return 'Pode limitar escala de uso e decisão no P&R.'
    if (category === 'Physical') return 'Pode aumentar risco médico ou de contato NBA.'
    if (category === 'Defense') return 'Pode comprimir matchups em playoff.'
    return 'Precisa de plano de desenvolvimento claro.'
  }
  if (category === 'Shooting') return 'Cria spacing, punição nas defesas e caminho simples de encaixe.'
  if (category === 'Creation') return 'Gera vantagem inicial e pressiona cobertura.'
  if (category === 'Defense') return 'Eleva piso de rotação e tolerância a erro ofensivo.'
  if (category === 'Physical') return 'Traduz para pressão, contato e separação.'
  if (category === 'Feel') return 'Ajuda a sobreviver em papel menor.'
  return 'Ferramenta com tradução direta para papel NBA.'
}

function riskSeverity(text = '', index = 0) {
  const t = String(text).toLowerCase()
  if (index === 0 || t.includes('histor') || t.includes('fisic') || t.includes('medic') || t.includes('arremesso')) return { label: 'Medium', value: 66, color: '#d77878' }
  if (t.includes('volume') || t.includes('jogos') || t.includes('turnover')) return { label: 'Moderate', value: 56, color: '#d6a44f' }
  return { label: 'Low', value: 42, color: '#c28a5a' }
}

function getScoutVerdictItems(p) {
  const s = normalizeProspectStats(p)
  const projection = getNBAProjection(p)
  const swing = (s.threep || 0) < 34 ? '3PT consistency' : (s.astTo || 0) < 1.3 ? 'Decision speed' : 'Role scaling'
  const concern = (p.scouting?.weaknesses || [])[0] || scoutVerdict(p)
  return [
    { label: 'NBA Role', value: projection[0]?.value || 'Rotation piece', Icon: User, color: '#a79be8' },
    { label: 'Translation', value: (s.ts || 0) >= 58 ? 'Clean path' : (s.threep || 0) >= 36 ? 'Spacing path' : 'Context dependent', Icon: BadgeCheck, color: '#8bbfe8' },
    { label: 'Swing Skill', value: swing, Icon: Crosshair, color: '#e0b66f' },
    { label: 'Main Concern', value: scoutItemTitle(concern, 'weakness'), Icon: AlertTriangle, color: '#e8a6a6' },
  ]
}

function matrixScore(p, key) {
  const s = normalizeProspectStats(p)
  const attrs = p.scouting?.attributes || {}
  const base = {
    scoring: clamp((s.ppg || 10) * 3.2 + (s.usg || 18) * .45, 35, 96),
    shot: clamp((s.threep || 30) * 1.45 + (s.ftp || 70) * .35, 35, 96),
    rim: clamp((s.fgp || 42) * .85 + (s.fta || 3) * 3 + (attrs.Athleticism || 6) * 5, 35, 94),
    playmaking: clamp((s.apg || 1.5) * 8.5 + (s.astTo || 1) * 13 + (attrs.Playmaking || 5) * 5, 32, 94),
    defense: clamp(Math.max(s.stlPct || 0, s.blkPct || 0) * 9 + (attrs.Defense || 5) * 7.2, 35, 95),
    feel: clamp((attrs.BBIQ || 5) * 8.4 + (s.astTo || 1) * 8, 35, 94),
    physical: clamp((attrs.Athleticism || 6) * 8.5 + (p.age && p.age <= 19 ? 6 : 2), 35, 95),
    readiness: clamp(getScoutGrade(p) * .76 + ((p.rank || 40) <= 14 ? 14 : 7), 40, 96),
    risk: clamp(100 - (getScoutRisk(p) === 'High' ? 34 : getScoutRisk(p) === 'Moderate' ? 22 : 10), 35, 92),
    offball: clamp((s.threep || 30) * 1.08 + (s.ts || 54) * .48 + Math.max(s.stlPct || 0, s.blkPct || 0) * 3.8, 38, 94),
  }
  return Math.round(base[key] || 60)
}

function scoreStatus(score) {
  if (score >= 84) return { label: 'Elite', color: '#8b6fe8' }
  if (score >= 72) return { label: 'Good', color: '#5faedc' }
  if (score >= 58) return { label: 'Developing', color: '#d6a44f' }
  return { label: 'Concern', color: '#d77878' }
}

function getScoutingMatrix(p) {
  return [
    ['scoring', 'Scoring Creation', Flame],
    ['shot', 'Shot Making', Target],
    ['rim', 'Rim Pressure', Zap],
    ['playmaking', 'Playmaking', Crosshair],
    ['defense', 'Defensive Tools', ShieldCheck],
    ['feel', 'Feel / IQ', Brain],
    ['physical', 'Physical Tools', ActivityIcon],
    ['readiness', 'NBA Readiness', Timer],
    ['risk', 'Risk Control', Shield],
    ['offball', 'Off-ball Value', Route],
  ].map(([key, label, Icon]) => ({ key, label, Icon, score: matrixScore(p, key) }))
}

function ActivityIcon(props) {
  return <TrendingUp {...props} />
}

function SkillBar({ item, index }) {
  const status = scoreStatus(item.score)
  const Icon = item.Icon
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: .4 }}
      whileHover={{ y: -2 }}
      transition={{ delay: index * .025, duration: .35 }}
      className="scout-skill-row rounded-[24px] border border-white/35 bg-white/24 p-3.5 backdrop-blur-xl"
      title={`${item.label}: ${item.score}/100`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-white/35 bg-white/28" style={{ color: status.color }}>
            <Icon size={16} />
          </span>
          <div className="min-w-0">
            <div className="truncate font-display text-sm font-black text-ink">{item.label}</div>
            <div className="mt-0.5 font-mono text-[7px] font-black uppercase tracking-[.16em]" style={{ color: status.color }}>{status.label}</div>
          </div>
        </div>
        <div className="font-numeric text-2xl font-black leading-none" style={{ color: status.color }}>{item.score}</div>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/32">
        <motion.span
          initial={{ width: 0 }}
          whileInView={{ width: `${item.score}%` }}
          viewport={{ once: true }}
          transition={{ duration: .55, ease: [0.22, 1, 0.36, 1] }}
          className="block h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${status.color}, rgba(255,255,255,.58))` }}
        />
      </div>
    </motion.article>
  )
}

function ScoutingMatrix({ p, accent }) {
  const matrix = getScoutingMatrix(p)
  const top = matrix.slice().sort((a, b) => b.score - a.score)[0]
  const watch = matrix.slice().sort((a, b) => a.score - b.score)[0]

  return (
    <Shell className="scout-matrix-panel">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className={cn(dsTypography.sectionLabel, 'text-lo')}>SCOUTING MATRIX</div>
          <h3 className="mt-1 font-headline text-3xl font-extrabold tracking-tight text-slate-950">Player Skill Matrix</h3>
          <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[#625c55]">
            Leitura visual derivada de atributos, stats e avaliação manual da Rookies Brasil.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-white/40 bg-white/34 px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[.16em]" style={{ color: accent }}>
            Peak: {top.label}
          </span>
          <span className="rounded-full border border-white/40 bg-white/34 px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[.16em] text-amber-700">
            Watch: {watch.label}
          </span>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-5">
        {matrix.map((item, index) => <SkillBar key={item.key} item={item} index={index} />)}
      </div>
    </Shell>
  )
}

function getTranslationPath(p) {
  const translation = getNBATranslation(p)
  const s = normalizeProspectStats(p)
  return [
    { label: 'Immediate NBA Skill', value: scoutItemTitle((p.scouting?.strengths || [])[0], 'strength'), Icon: BadgeCheck, color: '#62ad88' },
    { label: 'Swing Skill', value: (s.threep || 0) < 34 ? '3PT consistency' : (s.astTo || 0) < 1.3 ? 'Decision speed' : 'Role scaling', Icon: Crosshair, color: '#d6a44f' },
    { label: 'Role Stabilizer', value: translation[0]?.[1] || 'Rotation role', Icon: User, color: '#8b6fe8' },
    { label: 'Development Key', value: scoutItemTitle((p.scouting?.weaknesses || [])[0], 'weakness'), Icon: Wrench, color: '#d77878' },
    { label: 'Long-term Upside', value: getPlayerComp(p)[0]?.replace('Ceiling: ', '') || 'starter upside', Icon: Award, color: '#6daee8' },
  ]
}

function TranslationPath({ p }) {
  const path = getTranslationPath(p)
  return (
    <Shell className="scout-translation-path">
      <div className="mb-5">
        <div className={cn(dsTypography.sectionLabel, 'text-lo')}>NBA TRANSLATION PATH</div>
        <h3 className="mt-1 font-sans text-3xl font-extrabold tracking-tight text-slate-950">Caminho de traducao NBA</h3>
      </div>
      <div className="grid gap-3 lg:grid-cols-5">
        {path.map(({ label, value, Icon, color }, index) => (
          <motion.article
            key={label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -3 }}
            transition={{ delay: index * .04, duration: .35 }}
            className="translation-step relative rounded-[26px] border border-white/35 bg-white/24 p-4 backdrop-blur-xl"
          >
            {index < path.length - 1 && <ArrowRight className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 text-lo lg:block" size={20} />}
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/35 bg-white/28" style={{ color }}><Icon size={17} /></span>
            <div className="mt-4 font-mono text-[8px] font-black uppercase tracking-[.18em] text-lo">{label}</div>
            <div className="mt-2 line-clamp-3 font-display text-lg font-black leading-tight text-ink">{value}</div>
          </motion.article>
        ))}
      </div>
    </Shell>
  )
}

function ScoutReportHero({ p, accent }) {
  const sum = getExecutiveSummary(p)
  const grade = getScoutGrade(p)
  const projection = getNBAProjection(p)

  return (
    <motion.section
      variants={motionPresets.card}
      initial="initial"
      animate="animate"
      className={glassCard('primary', 'relative overflow-hidden rounded-[34px] border-white/45 bg-white/40 p-5 3xl:rounded-[38px] shadow-[0_28px_86px_rgba(40,36,32,.09),inset_1px_1px_0_rgba(255,255,255,.72)] backdrop-blur-2xl 3xl:p-7')}
      style={{ boxShadow: '0 28px 86px rgba(40,36,32,.09), 0 0 60px ' + accent + '14' }}
    >
      <Quote className="pointer-events-none absolute -right-5 -top-12 h-44 w-44 opacity-[.06]" style={{ color: accent }} />
      <span className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full blur-3xl" style={{ background: accent, opacity: .14 }} />
      <span className="pointer-events-none absolute left-0 top-0 h-full w-1/2 bg-gradient-to-br from-white/50 to-transparent opacity-70" />

      <div className="relative grid gap-4 3xl:gap-5 xl:grid-cols-[minmax(0,1.08fr)_minmax(290px,.92fr)] 3xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,.65fr)]">
        <div className="min-w-0">
          <div className={cn(dsTypography.sectionLabel, 'text-lo')}>FRONT OFFICE SCOUTING REPORT</div>
          <h3 className="mt-3 max-w-5xl font-headline text-[clamp(2rem,2.4vw,3.6rem)] 3xl:text-[clamp(2.25rem,3.2vw,4.8rem)] font-extrabold leading-[.96] tracking-tight text-slate-950">
            {sum.headline}
          </h3>
          <p className="mt-5 max-w-4xl font-sans text-[clamp(.92rem,.9vw,1.05rem)] 3xl:text-[clamp(.98rem,1.05vw,1.18rem)] font-medium leading-8 text-[#4f4943]">
            {sum.body}
          </p>
          <div className="mt-5 rounded-[28px] border border-white/35 bg-white/30 p-4 shadow-[inset_1px_1px_0_rgba(255,255,255,.58)] backdrop-blur-xl">
            <div className={dsTypography.metricLabel}>Executive veredict</div>
            <p className="mt-2 text-sm font-bold leading-6 text-[#5f5852]">{sum.verdict}</p>
          </div>
        </div>

        <aside className={cn(glass.inner, 'scout-grade-card grid content-start gap-4 rounded-[32px] p-5')}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className={dsTypography.metricLabel}>Scout Grade</div>
              <div className="mt-1 font-numeric text-[clamp(2.8rem,3vw,4.4rem)] 3xl:text-[clamp(3.2rem,4vw,5.6rem)] font-extrabold leading-none" style={{ color: accent }}>
                {grade}
              </div>
            </div>
            <span className="rounded-full border border-white/40 bg-white/42 px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[.16em]" style={{ color: accent }}>
              Report
            </span>
          </div>

          <div className="grid gap-3">
            {projection.map((item, index) => (
              <MetricMini
                key={item.label}
                label={index === 0 ? 'Papel Inicial' : index === 1 ? 'Encaixe Ideal' : 'Principal Risco'}
                value={item.value}
                copy={item.copy}
                color={item.color}
              />
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {sum.tags.map(tag => (
              <span key={tag} className={glass.chip + ' font-mono text-[8px] font-black uppercase tracking-[.14em]'} style={{ color: accent }}>
                {tag}
              </span>
            ))}
          </div>
        </aside>
      </div>
    </motion.section>
  )
}

function MetricMini({ label, value, copy, color }) {
  return (
    <div className="scout-grade-mini rounded-[24px] border border-white/30 bg-white/28 p-3.5 shadow-[inset_1px_1px_0_rgba(255,255,255,.50)]">
      <div className={dsTypography.metricLabel}>{label}</div>
      <div className="mt-1 font-display text-base font-black leading-tight text-ink" style={color ? { color } : undefined}>
        {value}
      </div>
      {copy && <p className="mt-2 line-clamp-2 text-[11px] font-semibold leading-5 text-muted">{copy}</p>}
    </div>
  )
}

function ScoutVerdictBar({ p }) {
  return (
    <section className={glassCard('secondary', 'rounded-[34px] border-white/35 bg-white/28 p-4 md:p-5')}>
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <div className={cn(dsTypography.sectionLabel, 'text-lo')}>SCOUT VERDICT</div>
          <h3 className="mt-1 font-headline text-2xl font-extrabold tracking-tight text-slate-950">Leitura rápida de tradução</h3>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {getScoutVerdictItems(p).map(({ label, value, Icon, color }) => (
          <motion.article key={label} whileHover={{ y: -2, scale: 1.004 }} className={cn(glass.inner, 'flex min-h-[108px] items-center gap-3 rounded-[28px] p-4')}>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/38" style={{ color }}>
              <Icon size={19} />
            </span>
            <div className="min-w-0">
              <div className={dsTypography.metricLabel}>{label}</div>
              <div className="mt-1 line-clamp-2 font-display text-lg font-black leading-tight text-ink">{value}</div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

function ScoutIcon({ type, index }) {
  const icons = type === 'strength'
    ? [BadgeCheck, Zap, Target, ShieldCheck, Sparkles]
    : [AlertTriangle, Shield, Crosshair, TrendingUp, Target]
  const Icon = icons[index % icons.length]
  return <Icon size={21} />
}

function ScoutTakeCard({ text, type, index, featured = false }) {
  const good = type === 'strength'
  const color = good ? '#55a979' : '#d77878'
  const tint = good
    ? 'border-emerald-200/45 bg-gradient-to-br from-emerald-50/58 via-white/34 to-white/18'
    : 'border-rose-200/45 bg-gradient-to-br from-rose-50/58 via-white/34 to-white/18'
  const impact = scoutImpact(text, type, index)
  const category = scoutCategory(text, type)
  const severity = riskSeverity(text, index)
  const score = good ? (impact === 'Elite' ? 88 : impact === 'Plus' ? 76 : 64) : severity.value

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: .35 }}
      whileHover={{ y: -4, scale: 1.008 }}
      transition={{ type: 'spring', stiffness: 130, damping: 22, delay: index * .035 }}
      className={cn(
        featured ? '' : '',
        tint,
        'scout-take-card relative overflow-hidden rounded-[24px] border p-3.5 shadow-[0_14px_34px_rgba(40,36,32,.05),inset_1px_1px_0_rgba(255,255,255,.58)] backdrop-blur-xl',
        good ? 'scout-take-strength' : 'scout-take-weakness'
      )}
    >
      <span className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-2xl" style={{ background: color, opacity: .16 }} />
      <div className="relative flex gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/45 bg-white/45" style={{ color }}>
          <ScoutIcon type={type} index={index} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[8px] font-black uppercase tracking-[.18em] text-lo">{String(index + 1).padStart(2, '0')}</span>
            <span className="rounded-full border border-white/40 bg-white/45 px-2 py-0.5 font-mono text-[7px] font-black uppercase tracking-[.12em]" style={{ color }}>
              {impact}
            </span>
          </div>
          <div className="mt-2 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(160px,.46fr)]">
            <div>
              <h4 className="font-display text-lg font-black leading-tight text-ink">
                {scoutItemTitle(text, type)}
              </h4>
              <p className="mt-1.5 line-clamp-3 text-xs font-semibold leading-5 text-[#625c55]">
                {text}
              </p>
            </div>
            <div className="rounded-2xl border border-white/30 bg-white/28 px-3 py-2">
              <div className="font-mono text-[7px] font-black uppercase tracking-[.16em] text-lo">{good ? 'NBA Translation' : 'Mitigation'}</div>
              <div className="mt-1 line-clamp-3 text-xs font-bold leading-5 text-muted">{nbaTranslationForTake(text, type)}</div>
            </div>
          </div>
          <div className="mt-3">
            <div className="mb-1.5 flex items-center justify-between gap-2 font-mono text-[7px] font-black uppercase tracking-[.16em] text-lo">
              <span>{good ? category : severity.label}</span>
              <span style={{ color: good ? color : severity.color }}>{score}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/34">
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: `${score}%` }}
                viewport={{ once: true }}
                transition={{ duration: .5, ease: [0.22, 1, 0.36, 1] }}
                className="block h-full rounded-full"
                style={{ background: good ? color : severity.color }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

function ScoutTakePanel({ title, items = [], type }) {
  const list = items?.length ? items : ['Sem dados cadastrados.']
  const good = type === 'strength'
  const color = good ? '#55a979' : '#d77878'

  return (
    <section className={glassCard('secondary', 'scout-take-panel rounded-[34px] border-white/35 bg-white/28 p-5 ' + (good ? 'scout-strength-panel' : 'scout-concern-panel'))}>
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <div className={cn(dsTypography.sectionLabel, 'text-lo')}>{good ? 'STRENGTH BOARD' : 'CONCERN BOARD'}</div>
          <h3 className="mt-1 font-headline text-3xl font-extrabold tracking-tight text-slate-950">{title}</h3>
        </div>
        <span className="rounded-full border border-white/40 bg-white/40 px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[.18em]" style={{ color }}>
          {list.length} notas
        </span>
      </div>
      <div className="grid gap-3">
        {list.map((it, i) => (
          <ScoutTakeCard key={i} text={it} type={type} index={i} featured={false} />
        ))}
      </div>
    </section>
  )
}

function ScoutComparisonBoard({ p }) {
  const sc = p.scouting || {}
  return (
    <div className="grid gap-4 xl:grid-cols-2 3xl:gap-5">
      <ScoutTakePanel title="Forças" items={sc.strengths} type="strength" />
      <ScoutTakePanel title="Fraquezas" items={sc.weaknesses} type="weakness" />
    </div>
  )
}

function ProjectionCard({ item, index }) {
  const Icon = item.Icon
  const labels = ['Role', 'Ideal Ecosystem', 'Critical Risk']

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: .45 }}
      whileHover={{ y: -4, scale: 1.008 }}
      transition={{ type: 'spring', stiffness: 130, damping: 22, delay: index * .04 }}
      className={cn(glass.inner, 'relative min-h-[220px] overflow-hidden rounded-[30px] p-5')}
      style={{ boxShadow: '0 18px 44px ' + item.color + '14' }}
    >
      <span className="absolute bottom-0 left-0 h-1 w-full" style={{ background: 'linear-gradient(90deg,' + item.color + ',transparent)' }} />
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/42" style={{ color: item.color }}>
          <Icon size={21} />
        </span>
        <div className="min-w-0">
          <div className={dsTypography.metricLabel}>{labels[index] || item.label}</div>
          <div className="mt-2 font-display text-2xl font-black leading-tight text-ink">{item.value}</div>
          <p className="mt-3 text-sm font-semibold leading-6 text-[#625c55]">{item.copy}</p>
          <span className="mt-4 inline-flex rounded-full border border-white/40 bg-white/38 px-3 py-1 font-mono text-[8px] font-black uppercase tracking-[.14em]" style={{ color: item.color }}>
            {item.label}
          </span>
        </div>
      </div>
    </motion.article>
  )
}

function NBAProjection({ p, accent }) {
  const data = getNBAProjection(p)
  return (
    <Shell>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className={cn(dsTypography.sectionLabel, 'text-lo')}>NBA PROJECTION</div>
          <h3 className="mt-1 font-sans text-4xl font-extrabold tracking-tight text-slate-950">NBA Projection</h3>
        </div>
        <span className="rounded-full border border-white/40 bg-white/34 px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[.18em] text-lo">
          Role / Ecosystem / Risk
        </span>
      </div>
      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_minmax(320px,.42fr)]">
        <div className="grid gap-4 lg:grid-cols-3">
          {data.map((item, i) => (
            <ProjectionCard key={item.label} item={item} index={i} />
          ))}
        </div>
        <DraftFitAside p={p} accent={accent} />
      </div>
    </Shell>
  )
}

function DraftFitAside({ p, accent }) {
  const draftFits = getBestDraftFits(p, { limit: 3, includeBlocked: true })
  return (
    <aside className="draft-fit-aside rounded-[32px] border border-white/35 bg-white/24 p-4 backdrop-blur-xl">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className={cn(dsTypography.sectionLabel, 'text-lo')}>DRAFT FIT</div>
          <h4 className="mt-1 font-display text-2xl font-black leading-tight text-ink">Resumo de encaixe</h4>
        </div>
        <span className="rounded-full border border-white/35 bg-white/28 px-2.5 py-1 font-mono text-[7px] font-black uppercase tracking-[.14em]" style={{ color: accent }}>
          Top 3
        </span>
      </div>
      <div className="grid gap-3">
        {draftFits.map((fit, index) => (
          <MiniDraftFitCard key={fit.teamId} fit={fit} index={index} accent={accent} />
        ))}
      </div>
    </aside>
  )
}

function MiniDraftFitCard({ fit, index, accent }) {
  const tone = draftFitTone(fit, accent)
  const status = getDraftFitStatus(fit)
  const blocked = fit.realism === 'Blocked' || fit.label === 'Blocked Fit'
  const reason = fit.reasons?.[0] || fit.pickContext

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -2 }}
      transition={{ delay: index * .04, duration: .35 }}
      className={cn('draft-fit-card relative overflow-hidden rounded-[24px] border border-white/35 bg-white/24 p-3.5 backdrop-blur-xl', blocked && 'draft-fit-card-blocked opacity-80')}
    >
      <span className="pointer-events-none absolute -right-10 -top-12 h-28 w-28 rounded-full blur-2xl" style={{ background: tone.color, opacity: .14 }} />
      <div className="relative flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <TeamLogoGlass teamId={fit.teamId} size="sm" showGlow muted={blocked} className="draft-fit-team-logo" />
          <div className="min-w-0">
            <div className="font-mono text-[7px] font-black uppercase tracking-[.16em] text-lo">#{index + 1} Fit</div>
            <div className="mt-1 truncate font-display text-lg font-black text-ink">{fit.teamName}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-numeric text-3xl font-black leading-none" style={{ color: tone.color }}>{Math.round(fit.score)}</div>
          <div className="mt-0.5 font-mono text-[7px] font-black uppercase tracking-[.14em] text-lo">score</div>
        </div>
      </div>
      <div className="relative mt-3 flex flex-wrap gap-2">
        <span className="rounded-full border border-white/35 bg-white/30 px-2.5 py-1 font-mono text-[7px] font-black uppercase tracking-[.12em]" style={{ color: tone.color }}>
          {fit.label}
        </span>
        <span className="rounded-full border border-white/35 px-2.5 py-1 font-mono text-[7px] font-black uppercase tracking-[.12em]" style={{ background: status.bg, color: status.tone }}>
          {status.label}
        </span>
      </div>
      <p className="relative mt-3 line-clamp-2 text-xs font-semibold leading-5 text-[#625c55]">{reason}</p>
      <div className="relative mt-3">
        <CompactDraftFitMetrics fit={fit} color={tone.color} />
      </div>
    </motion.article>
  )
}

function OutcomeRange({ p }) {
  const { floor, ceiling } = resolveOutcomeScores(p)
  const median = Math.round((floor + ceiling) / 2)
  const risk = getScoutRisk(p)
  const items = [
    { label: 'Floor', value: floor, title: getFloorLabel(floor), color: '#8bbfe8' },
    { label: 'Median', value: median, title: getFloorLabel(median), color: '#a79be8' },
    { label: 'Ceiling', value: ceiling, title: getCeilingLabel(ceiling), color: '#62ad88' },
  ]
  return (
    <div className="rounded-[32px] border border-white/35 bg-white/24 p-5 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className={dsTypography.metricLabel}>Outcome Range</div>
          <div className="mt-2 font-display text-2xl font-black text-ink">Range de resultado projetado</div>
        </div>
        <span className="rounded-full border border-white/35 bg-white/30 px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[.16em] text-lo">
          Risk: {risk}
        </span>
      </div>
      <div className="relative mt-8 h-3 rounded-full bg-white/30">
        <motion.span
          initial={{ left: `${floor}%`, width: 0 }}
          whileInView={{ left: `${floor}%`, width: `${Math.max(ceiling - floor, 4)}%` }}
          viewport={{ once: true }}
          transition={{ duration: .65, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-y-0 rounded-full"
          style={{ background: 'linear-gradient(90deg,#8bbfe8,#a79be8,#62ad88)' }}
        />
        {items.map(item => (
          <span key={item.label} className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-sm" style={{ left: `${item.value}%`, background: item.color }} />
        ))}
      </div>
      <div className="mt-7 grid gap-3 md:grid-cols-3">
        {items.map(item => (
          <div key={item.label} className="rounded-[24px] border border-white/30 bg-white/28 p-4">
            <div className="font-mono text-[8px] font-black uppercase tracking-[.18em] text-lo">{item.label}</div>
            <div className="mt-2 font-numeric text-3xl font-black leading-none" style={{ color: item.color }}>{item.value}</div>
            <div className="mt-2 line-clamp-2 text-sm font-black text-ink">{item.title}</div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm font-semibold leading-6 text-[#625c55]">
        A leitura combina piso, mediana e teto para separar papel provavel de upside real. Quanto maior a distancia entre piso e teto, maior a dependencia de contexto e desenvolvimento.
      </p>
    </div>
  )
}

function draftFitTone(fit, accent) {
  if (fit.realism === 'Blocked' || fit.label === 'Blocked Fit') return { color: '#a8844f', bg: 'rgba(246,231,168,.30)', glow: 'rgba(168,132,79,.12)' }
  if (fit.label === 'Elite Draft Fit') return { color: accent, bg: 'rgba(255,255,255,.46)', glow: accent + '24' }
  if (fit.label === 'Strong Draft Fit') return { color: '#6daee8', bg: 'rgba(237,247,253,.48)', glow: 'rgba(109,174,232,.16)' }
  if (fit.label === 'Good Draft Fit') return { color: '#69b894', bg: 'rgba(238,248,241,.44)', glow: 'rgba(105,184,148,.14)' }
  return { color: '#9f968d', bg: 'rgba(255,255,255,.28)', glow: 'rgba(0,0,0,.05)' }
}

function CompactDraftFitMetrics({ fit, color }) {
  const riskFit = fit.realism === 'Blocked' ? 18 : fit.realism === 'Low' ? 42 : fit.realism === 'Medium' ? 66 : 84
  const rows = [
    ['teamNeedFit', 'Need Fit', fit.components?.teamNeedFit],
    ['teamStrategyFit', 'Role Fit', fit.components?.teamStrategyFit],
    ['availabilityFit', 'Dev Fit', fit.components?.availabilityFit],
    ['riskFit', 'Risk Fit', riskFit],
  ]

  return (
    <div className="grid grid-cols-2 gap-2">
      {rows.map(([key, label, raw]) => {
        const value = Math.round(raw || 0)
        return (
          <div key={key} className="draft-fit-metric-cell rounded-2xl border border-white/30 bg-white/30 px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[7px] font-black uppercase tracking-[.12em] text-lo">{label}</span>
              <span className="font-mono text-[10px] font-black" style={{ color }}>{value}</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/40">
              <span className="block h-full rounded-full" style={{ width: clamp(value) + '%', background: color }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function DraftFitCard({ fit, index, accent, featured = false }) {
  const tone = draftFitTone(fit, accent)
  const status = getDraftFitStatus(fit)
  const blocked = fit.realism === 'Blocked' || fit.label === 'Blocked Fit'

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: .35 }}
      whileHover={{ y: blocked ? -1 : -5, scale: blocked ? 1 : 1.008 }}
      transition={{ type: 'spring', stiffness: 130, damping: 22, delay: index * .05 }}
      className={cn(
        blocked ? 'opacity-75' : '',
        'draft-fit-card relative overflow-hidden rounded-[34px] border border-white/40 backdrop-blur-xl',
        blocked ? 'draft-fit-card-blocked' : '',
        featured ? 'min-h-[390px] p-5 md:p-6' : 'p-5'
      )}
      style={{ background: tone.bg, boxShadow: featured && !blocked ? '0 24px 62px ' + tone.glow : '0 16px 42px rgba(40,36,32,.055)' }}
    >
      <span className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full blur-3xl" style={{ background: tone.color, opacity: blocked ? .10 : .18 }} />
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <TeamLogoGlass teamId={fit.teamId} size={featured ? 'xl' : 'md'} showGlow muted={blocked} className="draft-fit-team-logo" />
          <div className="min-w-0">
            <div className="font-mono text-[9px] font-black uppercase tracking-[.24em] text-lo">{featured ? 'Top Draft Fit' : 'Draft Fit #' + (index + 1)}</div>
            <h3 className={(featured ? 'text-4xl' : 'text-2xl') + ' mt-2 truncate font-display font-black leading-tight text-ink'}>{fit.teamName}</h3>
          </div>
        </div>
        <div className="text-right">
          <div className={(featured ? 'text-[clamp(2.8rem,3.6vw,4.4rem)]' : 'text-4xl') + ' font-numeric font-extrabold leading-none'} style={{ color: tone.color }}>
            {Math.round(fit.score)}
          </div>
          <div className="mt-1 font-mono text-[8px] font-black uppercase tracking-[.18em] text-lo">score</div>
        </div>
      </div>

      <div className="relative mt-4 flex flex-wrap gap-2">
        <span className="rounded-full border border-white/40 bg-white/42 px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[.16em]" style={{ color: tone.color }}>
          {fit.label}
        </span>
        <span className="rounded-full border border-white/40 px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[.16em]" style={{ background: status.bg, color: status.tone }}>
          {status.label}
        </span>
        {blocked && (
          <span className="rounded-full border border-amber-200/50 bg-amber-100/40 px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[.14em] text-amber-700">
            Bloqueado
          </span>
        )}
      </div>

      <div className="draft-fit-context relative mt-4 rounded-[28px] border border-white/30 bg-white/28 p-4">
        <div className={dsTypography.metricLabel}>Pick context</div>
        <p className="mt-2 text-sm font-bold leading-6 text-[#5f5852]">{fit.pickContext}</p>
      </div>

      <div className="relative mt-4">
        <CompactDraftFitMetrics fit={fit} color={tone.color} />
      </div>

      <div className="relative mt-4 space-y-2">
        {fit.reasons.slice(0, 2).map((reason, i) => (
          <div key={i} className="flex gap-2 text-sm font-semibold leading-6 text-[#625c55]">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: tone.color }} />
            <span>{reason}</span>
          </div>
        ))}
      </div>

      {featured && (
        <div className="relative mt-4">
          <DraftFitBreakdown fit={fit} color={tone.color} compact />
        </div>
      )}
    </motion.article>
  )
}

function DraftFitSection({ p, accent }) {
  const draftFits = getBestDraftFits(p, { limit: 3, includeBlocked: true })
  const top = draftFits[0]
  const rest = draftFits.slice(1)

  return (
    <Shell className="scout-draft-fit-section">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className={cn(dsTypography.sectionLabel, 'text-lo')}>DRAFT FIT</div>
          <h3 className="mt-1 font-sans text-4xl font-extrabold tracking-tight text-slate-950">Draft Fit</h3>
          <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[#625c55]">
            Times que deveriam considerar este jogador no contexto real do draft: necessidade, estrategia, range da pick e disponibilidade.
          </p>
        </div>
        <span className="rounded-full border border-white/40 bg-white/38 px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[.18em] text-lo">
          top 3 recomendacoes
        </span>
      </div>
      <div className="grid gap-4 2xl:grid-cols-[minmax(340px,.82fr)_minmax(0,1.18fr)]">
        {top && <DraftFitCard fit={top} index={0} accent={accent} featured />}
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-1">
          {rest.map((fit, i) => (
            <DraftFitCard key={fit.teamId} fit={fit} index={i + 1} accent={accent} />
          ))}
        </div>
      </div>
    </Shell>
  )
}

export default function ProfileScouting({ p, accent }) {
  const player = mergeProspectWithManualIntelligence(p || {})
  return (
    <div className="scouting-command-center grid gap-4 3xl:gap-6">
      <ScoutReportHero p={player} accent={accent} />
      <ScoutVerdictBar p={player} />
      <ScoutingMatrix p={player} accent={accent} />
      <ScoutComparisonBoard p={player} />
    </div>
  )
}
