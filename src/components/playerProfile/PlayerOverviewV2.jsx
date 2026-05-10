import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  BadgeCheck,
  BarChart3,
  Brain,
  Gem,
  LineChart,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react'
import TeamLogoGlass from '../TeamLogoGlass'
import { mergeProspectWithManualIntelligence } from '../../data/prospectDraftIntelligence.ts'
import { getBestFitsForPlayer, getBestFitColor } from '../../utils/bestFitAlgorithm'
import {
  buildProjectionInputFromProspect,
  calculateProspectProjectionScore,
} from '../../utils/prospectProjection'
import {
  glass as dsGlass,
  typography as dsTypography,
  cn,
  glassCard,
  motionPresets,
} from '../../styles/designSystem'
import {
  attrValue,
  clamp,
  getAttributeGrade,
  getCeilingLabel,
  getFloorLabel,
  getNBATranslation,
  getOverviewCopy,
  getPlayerArchetype,
  getResolvedCeilingLabel,
  getResolvedFloorLabel,
  num,
  resolveOutcomeScores,
} from '../../utils/playerProfileLogic'

const EASE = [0.22, 1, 0.36, 1]
const OUTCOME_LABELS = [
  ['G-League', 38],
  ['Rotation', 52],
  ['Starter', 66],
  ['All-Star', 80],
  ['Franchise', 90],
  ['MVP', 96],
]

const sectionMotion = {
  initial: { opacity: 0, y: 22, filter: 'blur(10px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.55, ease: EASE },
}

function toneAlpha(color, alpha = '22') {
  return `${color}${alpha}`
}

function scoreToTrack(score) {
  return clamp(((score - 35) / 64) * 100, 0, 100)
}

function riskProfile(floor, ceiling) {
  const delta = ceiling - floor
  if (floor < 50) return ['High Upside', 'High variance profile', '#e8a6a6']
  if (delta >= 24) return ['Swing Skill', 'Wide outcome band', '#e0b66f']
  if (floor >= 62) return ['Safe Floor', 'Stable early role', '#6fbf9c']
  return ['High Upside', 'Development bet', '#8bbfe8']
}

function outcomeRelationCopy(floor, ceiling) {
  const floorText = floor < 50
    ? 'Exige desenvolvimento forte antes de confiar em minutos NBA'
    : floor < 60
      ? 'Precisa ser testado em contextos com menos pressao para garantir rotação'
      : floor < 70
        ? 'Já consegue impactar cedo se o papel for limpo'
        : 'Entra na liga com base forte para minutos relevantes'

  const ceilingText = ceiling < 60
    ? 'mas dificilmente vira diferencial em jogos importantes.'
    : ceiling < 70
      ? 'e pode se tornar uma peca funcional de rotação.'
      : ceiling < 80
        ? 'e pode virar diferencial real em uma equipe vencedora.'
        : ceiling < 90
          ? 'e pode se tornar segunda opcao forte em time vencedor.'
          : 'e tem caminho para ser o principal jogador do seu time.'

  return `${floorText}, ${ceilingText}`
}

function getStyleTags(player) {
  const s = player.stats || {}
  const tags = [getPlayerArchetype(player)]
  if ((s.ppg || 0) >= 18) tags.push('Advantage scorer')
  if ((s.threep || 0) >= 37) tags.push('Spacing value')
  if ((s.apg || 0) >= 4 || (s.astTo || 0) >= 1.8) tags.push('Decision maker')
  if (Math.max(s.stlPct || 0, s.blkPct || 0) >= 3) tags.push('Defensive playmaker')
  if ((player.rank || 99) <= 10) tags.push('Premium draft asset')
  return Array.from(new Set(tags)).slice(0, 5)
}

function executiveBullets(player) {
  const copy = getOverviewCopy(player)
  const strengths = player.scouting?.strengths || []
  const stats = player.stats || {}
  const generated = [
    typeof stats.ppg === 'number' ? `${num(stats.ppg)} PPG define volume e responsabilidade ofensiva.` : null,
    typeof stats.ts === 'number' ? `${num(stats.ts)}% TS coloca eficiencia dentro do contexto.` : null,
    typeof stats.threep === 'number' ? `${num(stats.threep)}% de 3PT e o termometro de spacing.` : null,
  ].filter(Boolean)
  return [...strengths, ...generated, copy.body].slice(0, 3)
}

function getDNA(player) {
  const stats = player.stats || {}
  const attrs = player.scouting?.attributes || {}
  return [
    ['Scoring', attrValue(player, 'Scorer'), typeof stats.ppg === 'number' ? `${num(stats.ppg)} PPG como base de volume.` : 'Volume e pressao no aro definem o pacote.', Zap],
    ['Shooting', attrValue(player, 'Shooter'), typeof stats.threep === 'number' ? `${num(stats.threep)}% 3PT como swing de traducao.` : 'Toque, volume e confianca sustentam o spacing.', Target],
    ['Creation', attrs.Playmaking || attrValue(player, 'Playmaker'), typeof stats.apg === 'number' ? `${num(stats.apg)} APG indicam criacao para terceiros.` : 'Cria vantagem quando forca ajuda chega.', Brain],
    ['Defense', attrs.Defense || attrValue(player, 'Defender'), 'Atividade e ferramentas elevam o piso sem bola.', Shield],
    ['Rebounding', attrs.Rebounding || attrValue(player, 'Rebounder'), typeof stats.rpg === 'number' ? `${num(stats.rpg)} RPG contextualizam motor e contato.` : 'Fecha posses e ajuda a sustentar minutos.', BarChart3],
    ['Athleticism', attrs.Athleticism || 6.6, 'Explosao, tamanho funcional e recuperacao fisica.', TrendingUp],
    ['Feel / BBIQ', attrs.BBIQ || 6.4, 'Processamento, leitura e timing dentro do papel.', Sparkles],
  ].map(([label, value, copy, Icon]) => ({ label, value: clamp(value, 1, 10), copy, Icon }))
}

function SectionLabel({ children }) {
  return <div className={cn(dsTypography.sectionLabel, 'text-lo')}>{children}</div>
}

function GlassShell({ children, className = '', style }) {
  return (
    <motion.section
      {...sectionMotion}
      className={cn('overview-v2-glass relative overflow-hidden', glassCard('primary', className))}
      style={style}
    >
      <span className="overview-v2-shine pointer-events-none absolute inset-x-0 top-0 h-28" />
      {children}
    </motion.section>
  )
}

function MiniGlassCard({ label, value, sub, color, Icon }) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.015 }}
      transition={{ duration: 0.25, ease: EASE }}
      className={cn('overview-v2-inner relative overflow-hidden rounded-[26px] p-4', dsGlass.inner)}
    >
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <div className={dsTypography.metricLabel}>{label}</div>
          <div className="mt-1 font-sans text-xl font-black leading-tight text-slate-950">{value}</div>
          {sub && <p className="mt-1 text-xs font-bold leading-5 text-muted">{sub}</p>}
        </div>
        {Icon && (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/35 bg-white/35" style={{ color }}>
            <Icon size={18} />
          </span>
        )}
      </div>
    </motion.div>
  )
}

function HeroMetricPanel({ metric }) {
  const Icon = metric.Icon
  return (
    <motion.article
      whileHover={{ y: -4, scale: 1.015 }}
      className="overview-v2-hero-metric relative min-h-[188px] overflow-hidden rounded-[32px] border border-white/45 bg-white/34 p-5 shadow-[inset_1px_1px_0_rgba(255,255,255,.68),0_18px_46px_rgba(40,36,32,.06)] backdrop-blur-2xl"
    >
      <span className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full blur-2xl" style={{ background: metric.color, opacity: .16 }} />
      <div className="relative flex h-full flex-col justify-between gap-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className={dsTypography.metricLabel}>{metric.label}</div>
            <h3 className="mt-2 max-w-[220px] font-headline text-2xl font-black leading-[1.02] text-slate-950">{metric.value}</h3>
          </div>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[20px] border border-white/40 bg-white/42" style={{ color: metric.color }}>
            <Icon size={22} strokeWidth={2.5} />
          </span>
        </div>
        <div className="flex items-end justify-between gap-4">
          <p className="text-xs font-bold leading-5 text-muted">{metric.sub}</p>
          <div className="font-numeric text-5xl font-black leading-none" style={{ color: metric.color }}>{metric.score}</div>
        </div>
      </div>
    </motion.article>
  )
}

function tagTone(tag, accent) {
  const lower = tag.toLowerCase()
  if (lower.includes('scorer') || lower.includes('creator') || lower.includes('premium')) {
    return { color: accent, bg: toneAlpha(accent, '20'), border: toneAlpha(accent, '42') }
  }
  if (lower.includes('spacing') || lower.includes('decision') || lower.includes('playmaker')) {
    return { color: '#b48a26', bg: 'rgba(224,182,111,.22)', border: 'rgba(224,182,111,.46)' }
  }
  return { color: '#7c5ccf', bg: 'rgba(124,92,207,.16)', border: 'rgba(124,92,207,.36)' }
}

function CinematicProspectHero({ player, accent, tier, floor, ceiling }) {
  const tags = getStyleTags(player)
  const metrics = [
    { label: 'Piso', value: getResolvedFloorLabel(player, floor), score: floor, color: '#e8a6a6', Icon: Shield, sub: 'Base funcional de minutos NBA.' },
    { label: 'Teto', value: getResolvedCeilingLabel(player, ceiling), score: ceiling, color: accent, Icon: TrendingUp, sub: 'Se o desenvolvimento bater.' },
    { label: 'Overall', value: 'Draft Grade', score: Math.round((floor + ceiling) / 2), color: '#6fbf9c', Icon: BadgeCheck, sub: 'Média entre piso e teto. Quanto maior, melhor.' },
    { label: 'Risco', value: riskProfile(floor, ceiling)[0], score: ceiling - floor, color: riskProfile(floor, ceiling)[2], Icon: AlertTriangle, sub: 'Distância entre piso e teto. Quanto menor, melhor.' },
  ]

  return (
    <motion.section
      {...motionPresets.heroReveal}
      whileHover="hover"
      className="overview-v2-hero relative overflow-hidden rounded-[42px] border border-white/45 bg-white/42 p-5 shadow-[0_34px_100px_rgba(40,36,32,.11),inset_1px_1px_0_rgba(255,255,255,.75)] backdrop-blur-2xl md:p-7"
      style={{ '--overview-accent': accent, boxShadow: `0 34px 100px rgba(40,36,32,.11), inset 1px 1px 0 rgba(255,255,255,.75), 0 0 72px ${toneAlpha(accent, '18')}` }}
    >
      <span className="overview-v2-shine pointer-events-none absolute inset-x-0 top-0 h-36" />
      <span className="pointer-events-none absolute -right-28 top-10 h-80 w-80 rounded-full blur-3xl" style={{ background: accent, opacity: 0.18 }} />
      <span className="pointer-events-none absolute left-[46%] top-12 h-72 w-72 rounded-full bg-white/50 blur-3xl" />
      <div className="relative grid gap-7 xl:grid-cols-[minmax(0,.92fr)_minmax(420px,1.08fr)] 3xl:grid-cols-[minmax(0,.84fr)_minmax(520px,1.16fr)]">
        <div className="flex min-h-[390px] flex-col justify-between">
          <div>
            <h1 className="max-w-4xl font-brand text-5xl font-black leading-[.9] tracking-tight text-slate-950 md:text-6xl 3xl:text-7xl">
              {player.name}
            </h1>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                `#${player.rank}`,
                player.tier,
                `${player.age} anos`,
                player.position,
              ].map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="rounded-full border border-white/40 bg-white/28 px-3 py-1.5 font-mono text-[9px] font-black uppercase tracking-[.16em] text-muted backdrop-blur-2xl"
                  style={index === 1 ? { color: tier.text, background: tier.bg } : undefined}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {tags.map((tag, index) => (
              (() => {
                const tone = tagTone(tag, accent)
                return (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 + index * 0.06, duration: 0.35, ease: EASE }}
                    className="rounded-full border px-4 py-2 font-mono text-[9px] font-black uppercase tracking-[.16em] shadow-[inset_1px_1px_0_rgba(255,255,255,.52)] backdrop-blur-2xl"
                    style={{ color: tone.color, background: tone.bg, borderColor: tone.border }}
                  >
                    {tag}
                  </motion.span>
                )
              })()
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {metrics.map(metric => <HeroMetricPanel key={metric.label} metric={metric} />)}
        </div>
      </div>
    </motion.section>
  )
}

function ExecutiveDraftRead({ player, accent, floor, ceiling }) {
  const copy = getOverviewCopy(player)
  const bullets = executiveBullets(player)

  return (
    <GlassShell className="h-full rounded-[38px] p-5 md:p-6" style={{ boxShadow: `0 26px 82px rgba(40,36,32,.08), inset 1px 1px 0 rgba(255,255,255,.72), 0 0 46px ${toneAlpha(accent, '12')}` }}>
      <div className="relative flex h-full flex-col">
        <SectionLabel>Executive Draft Read</SectionLabel>
        <h2 className="mt-2 max-w-3xl font-headline text-3xl font-black leading-[1.02] tracking-tight text-slate-950 md:text-4xl">
          {copy.headline}
        </h2>
        <p className="mt-3 max-w-3xl text-sm font-bold leading-7 text-[#4f4943]">{copy.body}</p>
        <div className="mt-5 grid flex-1 content-end gap-3">
          {bullets.map((bullet, index) => (
            <motion.div
              key={bullet}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07, duration: 0.4, ease: EASE }}
              className="flex gap-3 rounded-[24px] border border-white/35 bg-white/28 px-4 py-3 text-sm font-bold leading-6 text-muted backdrop-blur-xl"
            >
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full" style={{ background: accent }} />
              {bullet}
            </motion.div>
          ))}
        </div>
      </div>
    </GlassShell>
  )
}

function AnimatedTraitBar({ trait, accent, dominant, warning }) {
  const pct = clamp(trait.value * 10, 0, 100)
  const color = warning ? '#e8a6a6' : dominant ? accent : '#8bbfe8'
  const Icon = trait.Icon
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn('overview-v2-dna-row rounded-[26px] border p-4', dominant ? 'border-white/60 bg-white/42' : 'border-white/35 bg-white/26')}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/35 bg-white/35" style={{ color }}>
            <Icon size={18} />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-sans text-lg font-black leading-tight text-slate-950">{trait.label}</h3>
              {dominant && <span className="rounded-full bg-white/45 px-2 py-1 font-mono text-[7px] font-black uppercase tracking-[.14em]" style={{ color }}>Dominant</span>}
              {warning && <span className="rounded-full bg-white/45 px-2 py-1 font-mono text-[7px] font-black uppercase tracking-[.14em] text-rose-500">Watch</span>}
            </div>
            <p className="mt-1 text-xs font-bold leading-5 text-muted">{trait.copy}</p>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="font-numeric text-3xl font-black leading-none" style={{ color }}>{num(trait.value)}</div>
          <div className={dsTypography.metricLabel}>{getAttributeGrade(trait.value)}</div>
        </div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#d8d3cc]/55 shadow-[inset_2px_2px_5px_rgba(160,150,140,.26)]">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, ease: EASE }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${toneAlpha(color, '88')}, ${color})` }}
        />
      </div>
    </motion.div>
  )
}

function PlayerDNASection({ player, accent }) {
  const traits = getDNA(player)
  const sorted = [...traits].sort((a, b) => b.value - a.value)
  const dominant = sorted[0]?.label
  const warning = sorted[sorted.length - 1]?.label

  return (
    <GlassShell className="rounded-[38px] p-5 md:p-6">
      <div className="relative">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <SectionLabel>Player DNA</SectionLabel>
            <h2 className="mt-1 font-headline text-3xl font-black tracking-tight text-slate-950">Pontos de Observação</h2>
          </div>
        </div>
        <div className="grid gap-3 xl:grid-cols-2">
          {traits.map(trait => (
            <AnimatedTraitBar key={trait.label} trait={trait} accent={accent} dominant={trait.label === dominant} warning={trait.label === warning} />
          ))}
        </div>
      </div>
    </GlassShell>
  )
}

function OutcomeVisualizer({ player, floor, ceiling, setFloor, setCeiling, accent }) {
  const delta = ceiling - floor
  const [risk, , riskColor] = riskProfile(floor, ceiling)
  const floorPct = scoreToTrack(floor)
  const ceilingPct = scoreToTrack(ceiling)

  return (
    <GlassShell className="rounded-[42px] p-5 md:p-7" style={{ boxShadow: `0 30px 92px rgba(40,36,32,.09), inset 1px 1px 0 rgba(255,255,255,.72), 0 0 58px ${toneAlpha(accent, '14')}` }}>
      <div className="relative">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionLabel>Outcome Visualizer</SectionLabel>
            <h2 className="mt-1 font-headline text-3xl font-black tracking-tight text-slate-950 md:text-4xl">Floor-to-ceiling range</h2>
            <p className="mt-2 max-w-3xl text-sm font-bold leading-6 text-muted">
              {outcomeRelationCopy(floor, ceiling)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className={cn(dsGlass.chip, 'font-mono text-[8px] font-black uppercase tracking-[.16em] text-muted')}>Delta {delta}</span>
            <span className={cn(dsGlass.chip, 'font-mono text-[8px] font-black uppercase tracking-[.16em]')} style={{ color: riskColor }}>{risk}</span>
          </div>
        </div>

        <div className="relative rounded-[32px] border border-white/35 bg-white/24 p-5 shadow-[inset_1px_1px_0_rgba(255,255,255,.58)] backdrop-blur-xl">
          <div className="relative h-20">
            <div className="absolute left-0 right-0 top-10 h-3 rounded-full bg-[#d8d3cc]/60 shadow-[inset_2px_2px_6px_rgba(150,140,130,.28)]" />
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ left: `${floorPct}%`, width: `${Math.max(2, ceilingPct - floorPct)}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE }}
              className="absolute top-10 h-3 rounded-full"
              style={{ background: `linear-gradient(90deg, #e8a6a6, ${accent})`, boxShadow: `0 0 28px ${toneAlpha(accent, '44')}` }}
            />
            <input
              aria-label="Ajustar piso"
              type="range"
              min="35"
              max="99"
              value={floor}
              onChange={e => setFloor(Math.min(Number(e.target.value), ceiling - 1))}
              className="overview-v2-range-input absolute left-0 right-0 top-[28px] z-20 w-full"
            />
            <input
              aria-label="Ajustar teto"
              type="range"
              min="35"
              max="99"
              value={ceiling}
              onChange={e => setCeiling(Math.max(Number(e.target.value), floor + 1))}
              className="overview-v2-range-input absolute left-0 right-0 top-[28px] z-20 w-full"
            />
            <Marker label="Piso" value={floor} pct={floorPct} color="#e8a6a6" title={getResolvedFloorLabel(player, floor)} />
            <Marker label="Teto" value={ceiling} pct={ceilingPct} color={accent} title={getResolvedCeilingLabel(player, ceiling)} />
          </div>
          <div className="mt-2 grid grid-cols-6 gap-2">
            {OUTCOME_LABELS.map(([label]) => (
              <span key={label} className="text-center font-mono text-[8px] font-black uppercase tracking-[.12em] text-lo">{label}</span>
            ))}
          </div>
        </div>

      </div>
    </GlassShell>
  )
}

function Marker({ label, value, pct, color, title }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, scale: 1.04 }}
      title={`${label}: ${title} (${value})`}
      className="absolute top-[18px] z-10 -translate-x-1/2 text-center"
      style={{ left: `${pct}%` }}
    >
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/50 bg-white/55 font-mono text-[10px] font-black backdrop-blur-2xl" style={{ color, boxShadow: `0 12px 28px ${toneAlpha(color, '30')}` }}>
        {value}
      </div>
      <div className="mt-1 whitespace-nowrap font-mono text-[8px] font-black uppercase tracking-[.14em]" style={{ color }}>{label}</div>
    </motion.div>
  )
}

function ProjectionOutcomePanel({ player, floor, ceiling, accent }) {
  const projection = useMemo(() => {
    const input = buildProjectionInputFromProspect(player, { floor, ceiling })
    return calculateProspectProjectionScore(input, player)
  }, [player, floor, ceiling])

  const factorRows = [
    ['Talent', projection.factors.baseTalent],
    ['Production', projection.factors.production],
    ['Efficiency', projection.factors.efficiency],
    ['Creation', projection.factors.creation],
    ['Tools', projection.factors.physicalTools],
    ['Defense', projection.factors.defense],
    ['Translation', projection.factors.nbaTranslation],
    ['Risk', projection.factors.riskPenalty],
  ]

  const scale = [
    ['G-League', 35],
    ['Fundo', 40],
    ['Rotação', 50],
    ['Starter', 60],
    ['All-Star', 70],
    ['Franchise', 80],
    ['MVP', 90],
  ]

  return (
    <motion.section
      {...sectionMotion}
      title="Projection score estimates the player's realistic NBA outcome range based on production, creation, efficiency, tools, translation and risk."
      className="relative overflow-hidden rounded-[42px] border border-white/60 bg-white/65 p-5 shadow-[0_24px_70px_rgba(0,0,0,.05)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_30px_90px_rgba(0,0,0,.08)] dark:border-white/10 dark:bg-slate-950/60 dark:shadow-black/30 md:p-7"
      style={{ boxShadow: '0 28px 78px rgba(40,36,32,.08), inset 1px 1px 0 rgba(255,255,255,.68), 0 0 54px ' + toneAlpha(accent, '12') }}
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/45 to-transparent opacity-60 dark:from-white/10" />
      <span className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full blur-3xl" style={{ background: toneAlpha(projection.color, '22') }} />

      <div className="relative grid gap-6 xl:grid-cols-[minmax(0,.9fr)_minmax(340px,1.1fr)] xl:items-center">
        <div>
          <SectionLabel>Projected NBA Outcome</SectionLabel>
          <div className="mt-3 flex flex-wrap items-end gap-4">
            <div className="font-numeric text-7xl font-black leading-none tracking-tight text-slate-950 dark:text-white md:text-8xl" style={{ color: projection.color }}>
              {projection.score}
            </div>
            <div className="pb-2">
              <div className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Projection tier</div>
              <h2 className="mt-1 font-headline text-3xl font-black tracking-tight text-slate-950 dark:text-white">{projection.tier}</h2>
            </div>
          </div>
          <p className="mt-4 max-w-xl font-sans text-sm font-bold leading-6 text-slate-500 dark:text-slate-400">
            {projection.description}
          </p>
          <p className="mt-3 max-w-xl font-sans text-xs font-semibold leading-5 text-slate-400 dark:text-slate-500">
            Conservative projection based on production, creation, efficiency, tools, translation and risk. It is a realistic outcome range, not an optimistic ceiling.
          </p>
          {projection.debug?.appliedCaps?.length > 0 && (
            <p className="mt-2 max-w-xl font-mono text-[9px] font-black uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
              Capped by {projection.debug.limitingFactors.slice(0, 3).join(' / ') || 'realism checks'}
            </p>
          )}
        </div>

        <div className="rounded-[32px] border border-white/45 bg-white/35 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] md:p-5">
          <div className="relative pb-8 pt-5">
            <div className="h-4 overflow-hidden rounded-full bg-slate-200/70 shadow-[inset_2px_2px_8px_rgba(120,112,102,.16)] dark:bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-rose-200 via-sky-200 to-violet-400" />
            </div>
            <motion.div
              initial={{ left: '0%' }}
              animate={{ left: projection.rangePosition + '%' }}
              transition={{ duration: 0.65, ease: EASE }}
              className="absolute top-2 z-10 -translate-x-1/2"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/75 font-mono text-[10px] font-black shadow-[0_16px_34px_rgba(0,0,0,.10)] backdrop-blur-xl dark:border-white/15 dark:bg-slate-900/80" style={{ color: projection.color }}>
                {projection.score}
              </div>
            </motion.div>
            <div className="mt-3 grid grid-cols-7 gap-1">
              {scale.map(([label]) => (
                <span key={label} className="text-center font-mono text-[8px] font-black uppercase tracking-[.10em] text-slate-400 dark:text-slate-500">{label}</span>
              ))}
            </div>
          </div>

          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {factorRows.map(([label, value]) => {
              const isRisk = label === 'Risk'
              const width = Math.round(value)
              return (
                <div key={label} className="rounded-2xl border border-white/35 bg-white/30 px-3 py-2 dark:border-white/10 dark:bg-white/[0.05]">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-[9px] font-black uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">{label}</span>
                    <span className="font-numeric text-xs font-black" style={{ color: isRisk ? '#e8a6a6' : projection.color }}>{width}</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200/70 dark:bg-white/10">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: width + '%', background: isRisk ? '#e8a6a6' : projection.color }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
function DraftDecisionPanel({ player, accent }) {
  const fits = useMemo(() => {
    const realistic = getBestFitsForPlayer(player, { limit: 3 })
    return realistic.length >= 3
      ? realistic
      : getBestFitsForPlayer(player, { limit: 3, includeUnlikelyFits: true })
  }, [player])

  return (
    <GlassShell className="rounded-[40px] p-5 md:p-6">
      <div className="relative">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <SectionLabel>War Room Recommendation</SectionLabel>
            <h2 className="mt-1 font-headline text-3xl font-black tracking-tight text-slate-950 dark:text-white">Melhores Encaixes</h2>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
              Best Fit Score mede contexto: necessidade, papel, desenvolvimento, timeline, esquema, range de pick e risco.
            </p>
          </div>
          <span
            className={cn(dsGlass.chip, 'font-mono text-[8px] font-black uppercase tracking-[.16em] text-slate-700 dark:text-slate-200')}
            title="Score calculado por necessidade do time, papel disponivel, desenvolvimento, timeline, esquema, range da escolha e tolerancia a risco."
            style={{ borderColor: accent + '33' }}
          >
            Best Fit engine
          </span>
        </div>
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(270px,.92fr)]">
          {fits[0] && <BestFitCard fit={fits[0]} featured accent={accent} />}
          <div className="grid gap-4">
            {fits.slice(1, 3).map(fit => <BestFitCard key={fit.teamId} fit={fit} accent={accent} />)}
          </div>
        </div>
      </div>
    </GlassShell>
  )
}

const bestFitBreakdownLabels = {
  teamNeedFit: 'Need',
  roleFit: 'Role',
  developmentFit: 'Development',
  timelineFit: 'Timeline',
  schemeFit: 'Scheme',
  draftRangeFit: 'Draft Range',
  riskFit: 'Risk',
}

function BestFitCard({ fit, featured = false, accent }) {
  const scoreColor = getBestFitColor(fit.score)
  const bars = Object.entries(fit.breakdown || {})
  const visibleBars = featured ? bars : bars.slice(0, 4)

  return (
    <motion.article
      whileHover={{ y: -4, scale: featured ? 1.01 : 1.005 }}
      className={cn(
        'relative overflow-hidden rounded-[32px] border border-white/50 bg-white/40 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] ring-1 ring-white/40 backdrop-blur-2xl transition-all duration-300 dark:border-white/10 dark:bg-slate-950/45 dark:ring-white/10',
        featured && 'min-h-[330px] p-5 md:p-6'
      )}
      style={{ boxShadow: featured ? '0 24px 70px ' + scoreColor + '20, inset 1px 1px 0 rgba(255,255,255,.58)' : undefined }}
    >
      <span className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full blur-3xl" style={{ backgroundColor: scoreColor + '22' }} />
      <span className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/45 to-transparent opacity-60 dark:from-white/10" />
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <TeamLogoGlass teamId={fit.teamId} size={featured ? 'xl' : 'lg'} showGlow />
          <div className="min-w-0">
            <div className={dsTypography.metricLabel}>{featured ? '#1 Best Fit' : 'Alternate Fit'}</div>
            <h3 className={cn('mt-1 font-sans font-black leading-tight text-slate-950 dark:text-white', featured ? 'text-3xl' : 'text-xl')}>{fit.teamName}</h3>
            <p className="mt-1 text-xs font-bold uppercase tracking-[.12em] text-slate-500 dark:text-slate-400">{fit.pickContext}</p>
          </div>
        </div>
        <div className="text-right">
          <div className={cn('font-numeric font-black leading-none', featured ? 'text-6xl' : 'text-4xl')} style={{ color: scoreColor }}>{fit.score}</div>
          <div className={dsTypography.metricLabel}>Best Fit</div>
        </div>
      </div>

      <div className="relative mt-5 grid gap-3">
        <div className="rounded-[24px] border border-white/40 bg-white/35 p-4 shadow-[inset_1px_1px_0_rgba(255,255,255,.56)] backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
          <div className="font-mono text-[9px] font-black uppercase tracking-[.18em]" style={{ color: scoreColor }}>{fit.tier}</div>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-600 dark:text-slate-300">{fit.primaryReason}</p>
          <p className="mt-2 text-xs font-medium leading-5 text-slate-500 dark:text-slate-400">{fit.description}</p>
        </div>

        <div className={cn('grid gap-2', featured ? 'sm:grid-cols-2' : '')}>
          {visibleBars.map(([key, value]) => (
            <BestFitBreakdownBar key={key} label={bestFitBreakdownLabels[key] || key} value={value} color={scoreColor} accent={accent} />
          ))}
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {(fit.flags || []).slice(0, featured ? 5 : 3).map(flag => (
            <span key={flag} className="rounded-full border border-white/35 bg-white/35 px-2.5 py-1 font-mono text-[8px] font-black uppercase tracking-[.14em] text-slate-600 backdrop-blur-md dark:border-white/10 dark:bg-white/10 dark:text-slate-300">
              {flag}
            </span>
          ))}
          {(fit.warnings || []).slice(0, featured ? 2 : 1).map(warning => (
            <span key={warning} className="rounded-full border border-amber-200/60 bg-amber-100/35 px-2.5 py-1 font-mono text-[8px] font-black uppercase tracking-[.14em] text-amber-700 backdrop-blur-md dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-200">
              {warning}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  )
}

function BestFitBreakdownBar({ label, value, color, accent }) {
  const pct = Math.round(clamp(Number(value || 0), 0, 100))
  return (
    <div className="rounded-[18px] border border-white/30 bg-white/25 px-3 py-2 backdrop-blur-md dark:border-white/10 dark:bg-white/10">
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="font-mono text-[8px] font-black uppercase tracking-[.16em] text-slate-500 dark:text-slate-400">{label}</span>
        <span className="font-numeric text-sm font-black text-slate-900 dark:text-white">{pct}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-900/10 dark:bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: pct + '%' }}
          transition={{ duration: 0.55, ease: EASE }}
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, ' + color + ', ' + (accent || '#8bbfe8') + ')' }}
        />
      </div>
    </div>
  )
}

function NBATranslationPanel({ player, accent }) {
  const cards = getNBATranslation(player)
  const icons = [LineChart, Gem, AlertTriangle]
  const colors = [accent, '#8bbfe8', '#e8a6a6']
  const labels = ['Papel Inicial', 'Encaixe Ideal', 'Principal Risco']

  return (
    <GlassShell className="h-full rounded-[38px] p-5 md:p-6">
      <div className="relative flex h-full flex-col">
        <SectionLabel>NBA Translation</SectionLabel>
        <h2 className="mt-1 font-headline text-3xl font-black tracking-tight text-slate-950">Papel, ecossistema, preocupação</h2>
        <div className="mt-5 grid flex-1 content-center gap-3">
          {cards.map(([, value], index) => {
            const Icon = icons[index]
            return (
              <motion.article key={labels[index]} whileHover={{ x: 3 }} className="relative overflow-hidden rounded-[24px] border border-white/40 bg-white/30 p-4 shadow-[inset_1px_1px_0_rgba(255,255,255,.58)] backdrop-blur-2xl">
                <span className="absolute inset-y-0 left-0 w-1.5" style={{ background: colors[index] }} />
                <div className="flex items-center gap-3 pl-2">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/35 bg-white/35" style={{ color: colors[index] }}>
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0">
                    <div className="font-mono text-[9px] font-black uppercase tracking-[.18em] text-lo">{labels[index]}</div>
                    <p className="mt-1 text-sm font-black leading-5 text-slate-950">{value}</p>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </GlassShell>
  )
}

export default function PlayerOverviewV2({ p, badges, accent, tier }) {
  const player = useMemo(() => mergeProspectWithManualIntelligence(p || {}), [p])
  const resolved = resolveOutcomeScores(player)
  const [floor, setFloor] = useState(resolved.floor)
  const [ceiling, setCeiling] = useState(resolved.ceiling)

  useEffect(() => {
    setFloor(resolved.floor)
    setCeiling(resolved.ceiling)
  }, [player.id, resolved.floor, resolved.ceiling])

  return (
    <motion.div
      className="overview-v2 grid gap-5 3xl:gap-6"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
      initial="hidden"
      animate="show"
      data-badge-count={badges?.length || 0}
    >
      <CinematicProspectHero player={player} accent={accent} tier={tier} floor={floor} ceiling={ceiling} />
      <div className="grid items-stretch gap-5 xl:grid-cols-[minmax(0,1fr)_380px] 3xl:grid-cols-[minmax(0,1fr)_420px]">
        <ExecutiveDraftRead player={player} accent={accent} floor={floor} ceiling={ceiling} />
        <NBATranslationPanel player={player} accent={accent} />
      </div>
      <PlayerDNASection player={player} accent={accent} />
      <ProjectionOutcomePanel player={player} floor={floor} ceiling={ceiling} accent={accent} />
      <DraftDecisionPanel player={player} accent={accent} />
    </motion.div>
  )
}


