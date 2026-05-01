import { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Copy,
  Edit3,
  FileJson,
  RotateCcw,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  XCircle,
} from 'lucide-react'
import { validateAllProspects, generateCorrectionPatch } from '../utils/prospectValidationEngine.js'
import { buttons, cn, glass, glassCard, motionPresets, typography } from '../styles/designSystem'

const REVIEW_KEY = 'rookies-brasil-data-quality-review-v1'
const OVERRIDES_KEY = 'rookies-brasil-data-quality-manual-overrides-v1'

const HEALTH_META = {
  problematic: {
    label: 'Problemático',
    color: '#d77878',
    bg: 'rgba(248,216,198,.42)',
    Icon: AlertTriangle,
  },
  needs_review: {
    label: 'Revisar',
    color: '#c59b42',
    bg: 'rgba(251,244,210,.58)',
    Icon: Clock3,
  },
  clean: {
    label: 'Limpo',
    color: '#4f9577',
    bg: 'rgba(229,244,236,.62)',
    Icon: ShieldCheck,
  },
}

const DECISION_META = {
  accepted: { label: 'Aceita', color: '#4f9577', Icon: CheckCircle2 },
  rejected: { label: 'Rejeitada', color: '#d77878', Icon: XCircle },
  ignored: { label: 'Depois', color: '#8b837c', Icon: Clock3 },
}

const FILTERS = [
  ['all', 'Todos'],
  ['problematic', 'Problemáticos'],
  ['needs_review', 'Revisar'],
  ['clean', 'Limpos'],
]

const POSITION_PRESETS = ['PG', 'PG/SG', 'SG', 'SG/SF', 'SF', 'SF/PF', 'PF', 'PF/C', 'C']
const TIER_PRESETS = ['ELITE', 'LOTTERY', 'MID_1ST', 'SLEEPER']
const OUTCOME_LABELS = ['G-League / two-way', 'Deep bench', 'Rotation', 'Starter', 'All-Star', 'Franchise player', 'MVP / franchise outlier']
const RISK_LEVELS = ['Low', 'Moderate', 'High']
const RISK_REASONS = ['Shooting consistency', 'Decision making', 'Frame/physicality', 'Defense translation', 'Medical/context', 'Age/upside', 'Role clarity']
const TOOL_LABELS = ['Question', 'Solid', 'Plus', 'Elite']
const EVALUATION_PRESETS = {
  highUpside: {
    label: 'High Upside',
    data: {
      floorScore: 54,
      floorLabel: 'Rotation',
      ceilingScore: 88,
      ceilingLabel: 'Franchise player',
      riskLevel: 'High',
      riskReason: 'Role clarity',
      tools: { shooting: 'Solid', creation: 'Plus', defense: 'Solid', rebounding: 'Solid', efficiency: 'Question' },
      note: 'Aposta em teto. Precisa de desenvolvimento e contexto certo para converter ferramentas em impacto NBA.'
    }
  },
  safeFloor: {
    label: 'Safe Floor',
    data: {
      floorScore: 67,
      floorLabel: 'Starter',
      ceilingScore: 78,
      ceilingLabel: 'All-Star',
      riskLevel: 'Low',
      riskReason: 'Role clarity',
      tools: { shooting: 'Solid', creation: 'Solid', defense: 'Plus', rebounding: 'Solid', efficiency: 'Plus' },
      note: 'Perfil de tradução mais estável, com caminho claro para minutos e menor dependência de criação primária.'
    }
  },
  nbaReady: {
    label: 'NBA Ready',
    data: {
      floorScore: 64,
      floorLabel: 'Rotation',
      ceilingScore: 74,
      ceilingLabel: 'Starter',
      riskLevel: 'Moderate',
      riskReason: 'Age/upside',
      tools: { shooting: 'Solid', creation: 'Solid', defense: 'Solid', rebounding: 'Solid', efficiency: 'Plus' },
      note: 'Mais pronto para contribuir cedo do que explosivo em teto. Valor depende de função e encaixe.'
    }
  },
  shootingSwing: {
    label: 'Shooting Swing',
    data: {
      floorScore: 48,
      floorLabel: 'Deep bench',
      ceilingScore: 82,
      ceilingLabel: 'All-Star',
      riskLevel: 'High',
      riskReason: 'Shooting consistency',
      tools: { shooting: 'Question', creation: 'Solid', defense: 'Solid', rebounding: 'Solid', efficiency: 'Question' },
      note: 'A tradução depende muito da bola de três. Se estabilizar, muda completamente o teto.'
    }
  },
  defensiveBet: {
    label: 'Defensive Bet',
    data: {
      floorScore: 58,
      floorLabel: 'Rotation',
      ceilingScore: 76,
      ceilingLabel: 'All-Star',
      riskLevel: 'Moderate',
      riskReason: 'Offensive role',
      tools: { shooting: 'Question', creation: 'Question', defense: 'Elite', rebounding: 'Plus', efficiency: 'Solid' },
      note: 'Defesa sustenta minutos, mas o papel ofensivo define se vira peça situacional ou titular.'
    }
  }
}

const suggestionId = (report, suggestion, index) =>
  [
    report.playerId,
    suggestion.field,
    index,
    JSON.stringify(suggestion.suggestedValue).slice(0, 80),
  ].join('::')

const safeText = value => {
  if (value === null || value === undefined || value === '') return 'vazio'
  if (Array.isArray(value)) return value.length ? value.join(' • ') : '[]'
  if (typeof value === 'object') return JSON.stringify(value, null, 2)
  return String(value)
}

const loadJson = (key) => {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(window.localStorage.getItem(key)) || {}
  } catch {
    return {}
  }
}

function compactObject(value) {
  return Object.fromEntries(
    Object.entries(value || {}).filter(([, item]) => item !== undefined && item !== null && String(item).trim() !== '')
  )
}

function normalizeEvaluation(evaluation = {}) {
  const clean = compactObject(evaluation)
  const tools = compactObject(clean.tools || {})
  if (!Object.keys(clean).length && !Object.keys(tools).length) return null

  return {
    version: 'manual_editor_v1',
    floor: {
      score: Number(clean.floorScore || 0),
      label: clean.floorLabel || '',
      note: clean.floorNote || '',
    },
    ceiling: {
      score: Number(clean.ceilingScore || 0),
      label: clean.ceilingLabel || '',
      note: clean.ceilingNote || '',
    },
    risk: {
      level: clean.riskLevel || '',
      reason: clean.riskReason || '',
      note: clean.riskNote || '',
    },
    tools,
    note: clean.note || '',
  }
}

function overrideToPatch(playerId, override) {
  const clean = compactObject(override)
  const suggestedChanges = {}

  ;['position', 'tier', 'rank', 'height', 'weight', 'wingspan'].forEach(field => {
    if (clean[field] !== undefined) suggestedChanges[field] = field === 'rank' ? Number(clean[field]) : clean[field]
  })

  const manualEvaluation = normalizeEvaluation(override?.evaluation)

  if (clean.scoutingNotes || manualEvaluation) {
    suggestedChanges.scouting = { ...(suggestedChanges.scouting || {}) }
    if (clean.scoutingNotes) suggestedChanges.scouting.notes = clean.scoutingNotes
    if (manualEvaluation) suggestedChanges.scouting.evaluation = manualEvaluation
  }

  if (clean.manualNote) {
    suggestedChanges.editorialReviewNote = clean.manualNote
  }

  return Object.keys(suggestedChanges).length
    ? {
        playerId,
        source: 'manual_override',
        suggestedChanges,
      }
    : null
}

function buildAcceptedPatch(reports, decisions, overrides) {
  const suggestionPatches = reports
    .map(report => {
      const acceptedSuggestions = report.suggestions.filter((suggestion, index) => decisions[suggestionId(report, suggestion, index)] === 'accepted')
      if (!acceptedSuggestions.length) return null
      return generateCorrectionPatch({ ...report, suggestions: acceptedSuggestions })
    })
    .filter(Boolean)

  const manualPatches = Object.entries(overrides || {})
    .map(([playerId, override]) => overrideToPatch(playerId, override))
    .filter(Boolean)

  return [...suggestionPatches, ...manualPatches]
}

function countManualOverrides(overrides) {
  return Object.values(overrides || {}).reduce((sum, override) => {
    const basicCount = Object.keys(compactObject({ ...override, evaluation: undefined })).length
    const evaluationCount = normalizeEvaluation(override?.evaluation) ? 1 : 0
    return sum + basicCount + evaluationCount
  }, 0)
}

export default function DataQualityReview({ prospects = [] }) {
  const reports = useMemo(() => validateAllProspects(prospects), [prospects])
  const prospectsById = useMemo(() => new Map(prospects.map(player => [String(player.id), player])), [prospects])
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [decisions, setDecisions] = useState(() => loadJson(REVIEW_KEY))
  const [overrides, setOverrides] = useState(() => loadJson(OVERRIDES_KEY))
  const [selectedId, setSelectedId] = useState(() => reports[0]?.playerId)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(REVIEW_KEY, JSON.stringify(decisions))
    }
  }, [decisions])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides))
    }
  }, [overrides])

  useEffect(() => {
    if (!reports.some(report => report.playerId === selectedId)) {
      setSelectedId(reports[0]?.playerId)
    }
  }, [reports, selectedId])

  const counts = useMemo(() => ({
    total: reports.length,
    problematic: reports.filter(report => report.overallHealth === 'problematic').length,
    needsReview: reports.filter(report => report.overallHealth === 'needs_review').length,
    clean: reports.filter(report => report.overallHealth === 'clean').length,
    accepted: Object.values(decisions).filter(value => value === 'accepted').length,
    rejected: Object.values(decisions).filter(value => value === 'rejected').length,
    manual: countManualOverrides(overrides),
  }), [reports, decisions, overrides])

  const filteredReports = useMemo(() => {
    const q = query.trim().toLowerCase()
    return reports.filter(report => {
      const matchesFilter = filter === 'all' || report.overallHealth === filter
      const matchesQuery = !q || report.playerName.toLowerCase().includes(q)
      return matchesFilter && matchesQuery
    })
  }, [reports, query, filter])

  const selectedReport = filteredReports.find(report => report.playerId === selectedId) || filteredReports[0] || reports[0]
  const selectedPlayer = selectedReport ? prospectsById.get(selectedReport.playerId) : null
  const selectedOverride = selectedReport ? overrides[selectedReport.playerId] || {} : {}
  const selectedPatch = selectedReport ? [
    generateCorrectionPatch(selectedReport),
    overrideToPatch(selectedReport.playerId, selectedOverride),
  ].filter(Boolean) : []
  const acceptedPatch = useMemo(() => buildAcceptedPatch(reports, decisions, overrides), [reports, decisions, overrides])

  const setDecision = (key, value) => {
    setDecisions(current => {
      const next = { ...current }
      if (!value) delete next[key]
      else next[key] = value
      return next
    })
  }

  const setOverride = (playerId, field, value) => {
    setOverrides(current => {
      const previous = current[playerId] || {}
      const nextValue = { ...previous, [field]: value }
      const compact = compactObject(nextValue)
      const next = { ...current }
      if (Object.keys(compact).length) next[playerId] = compact
      else delete next[playerId]
      return next
    })
  }

  const clearOverride = (playerId) => {
    setOverrides(current => {
      const next = { ...current }
      delete next[playerId]
      return next
    })
  }

  const copyAcceptedPatch = async () => {
    const payload = JSON.stringify(acceptedPatch, null, 2)
    await navigator?.clipboard?.writeText(payload)
  }

  return (
    <div className="relative min-h-full overflow-hidden px-5 py-6 md:px-7" style={{ background: '#edeae4' }}>
      <span className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-[#8bbfe8]/18 blur-3xl" />
      <span className="pointer-events-none absolute right-10 top-0 h-96 w-96 rounded-full bg-[#eee9fb]/70 blur-3xl" />
      <span className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#f2bfd0]/20 blur-3xl" />

      <motion.div {...motionPresets.page} className="relative mx-auto grid max-w-[1700px] gap-6">
        <section className={cn(glassCard('primary', 'relative overflow-hidden rounded-[36px] p-7 md:p-8'))}>
          <span className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/50 to-transparent opacity-60" />
          <span className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-[#a79be8]/20 blur-3xl" />
          <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
            <div>
              <div className={typography.sectionLabel}>DATA QUALITY REVIEW</div>
              <h1 className="mt-3 max-w-4xl font-sans text-5xl font-extrabold leading-[.96] tracking-tight text-slate-900 md:text-7xl">
                Controle editorial da base de prospects
              </h1>
              <p className="mt-5 max-w-3xl text-base font-semibold leading-7 text-muted">
                Sugestões revisáveis e ajustes manuais para posição, medidas, tiers, avaliação e textos de scouting. Nada altera a database oficial sem aprovação.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:w-[520px]">
              <MetricCard label="Problemáticos" value={counts.problematic} color="#d77878" />
              <MetricCard label="Precisam revisão" value={counts.needsReview} color="#c59b42" />
              <MetricCard label="Aceitas" value={counts.accepted} color="#4f9577" />
              <MetricCard label="Edições manuais" value={counts.manual} color="#7c5ccf" />
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[390px_minmax(0,1fr)]">
          <aside className={cn(glassCard('secondary', 'rounded-[32px] p-4 xl:sticky xl:top-6 xl:max-h-[calc(100vh-48px)] xl:overflow-hidden'))}>
            <div className="rounded-[26px] border border-white/25 bg-white/22 p-3">
              <div className="flex items-center gap-2 rounded-full border border-white/25 bg-white/30 px-4 py-3 backdrop-blur-md">
                <Search size={16} className="text-muted" />
                <input
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                  placeholder="Buscar prospect..."
                  className="w-full bg-transparent text-sm font-bold text-slate-700 outline-none placeholder:text-muted"
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {FILTERS.map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setFilter(id)}
                    className={cn('rounded-full px-3 py-2 font-mono text-[8px] font-black uppercase tracking-[.14em] transition-all duration-200', filter === id ? 'bg-violet-500 text-white shadow-[0_10px_24px_rgba(124,92,207,.20)]' : 'bg-white/30 text-muted hover:bg-white/45')}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 space-y-2 overflow-y-auto pr-1 xl:max-h-[calc(100vh-250px)]">
              {filteredReports.map(report => (
                <ReportListItem
                  key={report.playerId}
                  report={report}
                  hasManualOverride={!!overrides[report.playerId]}
                  active={selectedReport?.playerId === report.playerId}
                  onClick={() => setSelectedId(report.playerId)}
                />
              ))}
            </div>
          </aside>

          <main className="min-w-0">
            {selectedReport ? (
              <ReportDetail
                report={selectedReport}
                player={selectedPlayer}
                patch={selectedPatch}
                decisions={decisions}
                setDecision={setDecision}
                override={selectedOverride}
                setOverride={(field, value) => setOverride(selectedReport.playerId, field, value)}
                clearOverride={() => clearOverride(selectedReport.playerId)}
              />
            ) : (
              <div className={cn(glassCard('primary', 'rounded-[34px] p-8 text-center'))}>
                Nenhum prospect encontrado para esse filtro.
              </div>
            )}

            <section className={cn(glassCard('secondary', 'mt-6 rounded-[32px] p-5'))}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className={typography.sectionLabel}>PATCH REVISÁVEL</div>
                  <h3 className="mt-1 font-sans text-2xl font-extrabold tracking-tight text-slate-900">Aceitas + edições manuais</h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-muted">
                    Esse pacote reúne sugestões aceitas e ajustes digitados por você. A base oficial continua intocada até aplicarmos juntos.
                  </p>
                </div>
                <button type="button" onClick={copyAcceptedPatch} className={buttons.secondary}>
                  <Copy size={15} className="inline-block" /> Copiar patch
                </button>
              </div>
              <pre className="mt-5 max-h-[260px] max-w-full overflow-auto whitespace-pre-wrap break-words rounded-[24px] border border-white/25 bg-white/24 p-4 text-xs leading-6 text-slate-700 backdrop-blur-md">
                {JSON.stringify(acceptedPatch, null, 2)}
              </pre>
            </section>
          </main>
        </section>
      </motion.div>
    </div>
  )
}

function MetricCard({ label, value, color }) {
  return (
    <div className={cn(glass.inner, 'rounded-[26px] p-4')}>
      <div className={typography.metricLabel}>{label}</div>
      <div className="mt-2 font-numeric text-5xl font-extrabold leading-none tracking-tight" style={{ color }}>{value}</div>
    </div>
  )
}

function ReportListItem({ report, active, hasManualOverride, onClick }) {
  const meta = HEALTH_META[report.overallHealth]
  const Icon = meta.Icon
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('w-full rounded-[24px] border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/36 hover:shadow-[0_14px_34px_rgba(0,0,0,.06)]', active ? 'border-white/60 bg-white/42 shadow-[0_18px_42px_rgba(124,92,207,.12)]' : 'border-white/20 bg-white/18')}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate font-sans text-sm font-extrabold text-slate-800">{report.playerName}</div>
          <div className="mt-1 font-mono text-[8px] font-black uppercase tracking-[.16em] text-muted">
            {report.suggestions.length} sugestões
          </div>
        </div>
        <span className="flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[8px] font-black uppercase tracking-[.12em]" style={{ color: meta.color, background: meta.bg }}>
          <Icon size={12} /> {meta.label}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {hasManualOverride && (
          <span className="rounded-full bg-violet-100/70 px-2.5 py-1 font-mono text-[8px] font-black uppercase tracking-[.12em] text-violet-700">
            editado manualmente
          </span>
        )}
      </div>
      <p className="mt-3 line-clamp-2 text-xs font-semibold leading-5 text-muted">{report.summary}</p>
    </button>
  )
}

function ReportDetail({ report, player, patch, decisions, setDecision, override, setOverride, clearOverride }) {
  const meta = HEALTH_META[report.overallHealth]
  const Icon = meta.Icon

  return (
    <div className="grid gap-6">
      <section className={cn(glassCard('primary', 'relative overflow-hidden rounded-[36px] p-7'))}>
        <span className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/45 to-transparent opacity-60" />
        <div className="relative flex flex-wrap items-start justify-between gap-5">
          <div>
            <div className={typography.sectionLabel}>PROSPECT REPORT</div>
            <h2 className="mt-2 font-sans text-5xl font-extrabold tracking-tight text-slate-900">{report.playerName}</h2>
            <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-muted">{report.summary}</p>
          </div>
          <span className="flex items-center gap-2 rounded-full px-4 py-2 font-mono text-[10px] font-black uppercase tracking-[.16em]" style={{ color: meta.color, background: meta.bg }}>
            <Icon size={15} /> {meta.label}
          </span>
        </div>
      </section>

      <ManualOverridePanel player={player} override={override} setOverride={setOverride} clearOverride={clearOverride} />

      <section className="grid gap-4">
        {report.suggestions.map((suggestion, index) => {
          const key = suggestionId(report, suggestion, index)
          return (
            <SuggestionCard
              key={key}
              suggestion={suggestion}
              decision={decisions[key]}
              onDecision={value => setDecision(key, value)}
            />
          )
        })}
      </section>

      <section className={cn(glassCard('secondary', 'rounded-[32px] p-5'))}>
        <div className="flex items-center gap-3">
          <span className={cn(glass.inner, 'flex h-11 w-11 items-center justify-center rounded-2xl text-violet-500')}>
            <FileJson size={19} />
          </span>
          <div>
            <div className={typography.sectionLabel}>PATCH DO JOGADOR</div>
            <h3 className="font-sans text-2xl font-extrabold tracking-tight text-slate-900">Sugestões do motor + edição manual</h3>
          </div>
        </div>
        <pre className="mt-5 max-h-[320px] max-w-full overflow-auto whitespace-pre-wrap break-words rounded-[24px] border border-white/25 bg-white/24 p-4 text-xs leading-6 text-slate-700 backdrop-blur-md">
          {JSON.stringify(patch, null, 2)}
        </pre>
      </section>
    </div>
  )
}


function getSuggestedEvaluation(player) {
  const s = player?.stats || {}
  const position = String(player?.position || '').toUpperCase()
  const rank = Number(player?.rank || 40)
  const role = position.includes('C') || position.includes('PF') ? 'big' : position.includes('SF') ? 'wing' : 'guard'
  const ppg = Number(s.ppg || (role === 'guard' ? 12 : 10))
  const ts = Number(s.ts || 55)
  const threep = Number(s.threep || 33)
  const astTo = Number(s.astTo || 1.2)
  const stlPct = Number(s.stlPct || 1.6)
  const blkPct = Number(s.blkPct || (role === 'big' ? 3.2 : 1.1))
  const rpg = Number(s.rpg || (role === 'big' ? 6 : 4))

  const floorScore = clampNumber(42 + Math.max(0, ts - 52) * 1.6 + Math.max(0, 26 - rank) * 0.55 + (threep >= 35 ? 6 : 0) + (role === 'big' && rpg >= 8 ? 5 : 0), 35, 82)
  const ceilingScore = clampNumber(60 + Math.max(0, 16 - rank) * 1.6 + ppg * 0.9 + (player?.age <= 19 ? 6 : 0) + (threep >= 36 ? 4 : 0), 48, 95)
  const riskLevel = floorScore < 50 || threep < 31 || astTo < 1 ? 'High' : floorScore >= 64 ? 'Low' : 'Moderate'
  const riskReason = threep < 31 ? 'Shooting consistency' : astTo < 1 ? 'Decision making' : floorScore >= 64 ? 'Role clarity' : 'Frame/physicality'

  return {
    floorScore: Math.round(floorScore),
    floorLabel: labelForOutcome(floorScore),
    ceilingScore: Math.round(Math.max(ceilingScore, floorScore + 8)),
    ceilingLabel: labelForOutcome(Math.max(ceilingScore, floorScore + 8)),
    riskLevel,
    riskReason,
    tools: {
      shooting: toolFromNumber(threep >= 38 ? 86 : threep >= 35 ? 72 : threep >= 32 ? 56 : 42),
      creation: toolFromNumber(ppg >= 18 && astTo >= 1.2 ? 76 : astTo >= 1.5 ? 66 : 48),
      defense: toolFromNumber(Math.max(stlPct * 22, blkPct * (role === 'big' ? 11 : 18))),
      rebounding: toolFromNumber(role === 'big' ? rpg * 8 : rpg * 11),
      efficiency: toolFromNumber(ts >= 61 ? 84 : ts >= 57 ? 70 : ts >= 53 ? 56 : 42),
    },
    note: 'Sugestão inicial baseada em stats, posição, idade e rank. Ajuste manualmente antes de aplicar.'
  }
}

function clampNumber(value, min, max) {
  return Math.min(max, Math.max(min, Number(value) || 0))
}

function labelForOutcome(score) {
  if (score >= 90) return 'MVP / franchise outlier'
  if (score >= 85) return 'Franchise player'
  if (score >= 75) return 'All-Star'
  if (score >= 65) return 'Starter'
  if (score >= 55) return 'Rotation'
  if (score >= 45) return 'Deep bench'
  return 'G-League / two-way'
}

function toolFromNumber(score) {
  if (score >= 82) return 'Elite'
  if (score >= 68) return 'Plus'
  if (score >= 52) return 'Solid'
  return 'Question'
}

function ManualOverridePanel({ player, override, setOverride, clearOverride }) {
  const manualCount = Object.keys(compactObject({ ...override, evaluation: undefined })).length + (normalizeEvaluation(override?.evaluation) ? 1 : 0)
  const evaluation = { ...getSuggestedEvaluation(player), ...(override.evaluation || {}), tools: { ...getSuggestedEvaluation(player).tools, ...(override.evaluation?.tools || {}) } }

  const setEvaluation = (field, value) => setOverride('evaluation', { ...(override.evaluation || {}), [field]: value })
  const setEvaluationScore = (scoreField, labelField, value) => {
    const numericValue = Number(value)
    setOverride('evaluation', {
      ...(override.evaluation || {}),
      [scoreField]: numericValue,
      [labelField]: labelForOutcome(numericValue),
    })
  }
  const setTool = (tool, value) => setEvaluation('tools', { ...(evaluation.tools || {}), [tool]: value })
  const applyPreset = preset => setOverride('evaluation', EVALUATION_PRESETS[preset].data)
  const useSuggestion = () => setOverride('evaluation', getSuggestedEvaluation(player))

  return (
    <section className={cn(glassCard('primary', 'relative overflow-hidden rounded-[34px] p-6'))}>
      <span className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#a79be8]/18 blur-3xl" />
      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className={typography.sectionLabel}>EDIÇÃO MANUAL</div>
          <h3 className="mt-1 font-sans text-3xl font-extrabold tracking-tight text-slate-900">Ajustes que você quer aplicar</h3>
          <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-muted">
            Corrija dados objetivos e edite a avaliação como scout. Tudo fica salvo localmente e entra no patch final.
          </p>
        </div>
        <button type="button" onClick={clearOverride} className={buttons.ghost} disabled={!manualCount}>
          <RotateCcw size={14} className="inline-block" /> limpar edição
        </button>
      </div>

      <div className="relative mt-6 grid gap-4 lg:grid-cols-3">
        <ManualSelect label="Posição" value={override.position || ''} placeholder={player?.position || '-'} options={POSITION_PRESETS} onChange={value => setOverride('position', value)} />
        <ManualSelect label="Tier" value={override.tier || ''} placeholder={player?.tier || '-'} options={TIER_PRESETS} onChange={value => setOverride('tier', value)} />
        <ManualInput label="Rank" value={override.rank || ''} placeholder={player?.rank ? String(player.rank) : '-'} onChange={value => setOverride('rank', value)} />
        <ManualInput label="Altura" value={override.height || ''} placeholder={player?.height || '-'} onChange={value => setOverride('height', value)} />
        <ManualInput label="Peso" value={override.weight || ''} placeholder={player?.weight || '-'} onChange={value => setOverride('weight', value)} />
        <ManualInput label="Envergadura" value={override.wingspan || ''} placeholder={player?.wingspan || '-'} onChange={value => setOverride('wingspan', value)} />
      </div>

      <EvaluationEditor evaluation={evaluation} setEvaluation={setEvaluation} setEvaluationScore={setEvaluationScore} setTool={setTool} applyPreset={applyPreset} useSuggestion={useSuggestion} />

      <div className="relative mt-4 grid items-start gap-4 xl:grid-cols-2">
        <ManualTextarea
          label="Notas de scout"
          value={override.scoutingNotes || ''}
          placeholder={player?.scouting?.notes || 'Digite uma versão revisada do relatório...'}
          onChange={value => setOverride('scoutingNotes', value)}
        />
        <ManualTextarea
          label="Nota interna da revisão"
          value={override.manualNote || ''}
          placeholder="Ex: revisar após combine, conferir medida oficial, aguardar nova fonte..."
          onChange={value => setOverride('manualNote', value)}
        />
      </div>

      {!!manualCount && (
        <div className="relative mt-4 inline-flex items-center gap-2 rounded-full bg-violet-100/70 px-3 py-2 font-mono text-[9px] font-black uppercase tracking-[.14em] text-violet-700">
          <Edit3 size={13} /> {manualCount} campos manuais salvos
        </div>
      )}
    </section>
  )
}

function EvaluationEditor({ evaluation, setEvaluation, setEvaluationScore, setTool, applyPreset, useSuggestion }) {
  return (
    <section className="relative mt-5 rounded-[30px] border border-white/30 bg-white/24 p-5 backdrop-blur-md">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className={typography.sectionLabel}>EVALUATION EDITOR</div>
          <h4 className="mt-1 font-sans text-2xl font-extrabold tracking-tight text-slate-900">Piso, teto, risco e ferramentas</h4>
          <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-muted">
            Use presets para começar rápido ou ajuste cada campo manualmente. Essa avaliação substitui o antigo JSON automático.
          </p>
        </div>
        <button type="button" onClick={useSuggestion} className={buttons.secondary}>
          <Save size={14} className="inline-block" /> usar sugestão
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {Object.entries(EVALUATION_PRESETS).map(([key, preset]) => (
          <button
            key={key}
            type="button"
            onClick={() => applyPreset(key)}
            className="rounded-full bg-white/35 px-3 py-2 font-mono text-[8px] font-black uppercase tracking-[.14em] text-violet-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/55"
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        <RangeEditor title="Piso" score={evaluation.floorScore} label={evaluation.floorLabel} note={evaluation.floorNote} color="#6fbf9c" onScore={value => setEvaluationScore('floorScore', 'floorLabel', value)} onLabel={value => setEvaluation('floorLabel', value)} onNote={value => setEvaluation('floorNote', value)} />
        <RangeEditor title="Teto" score={evaluation.ceilingScore} label={evaluation.ceilingLabel} note={evaluation.ceilingNote} color="#8f72e8" onScore={value => setEvaluationScore('ceilingScore', 'ceilingLabel', value)} onLabel={value => setEvaluation('ceilingLabel', value)} onNote={value => setEvaluation('ceilingNote', value)} />
        <RiskEditor evaluation={evaluation} setEvaluation={setEvaluation} />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {['shooting', 'creation', 'defense', 'rebounding', 'efficiency'].map(tool => (
          <ManualSelect key={tool} label={tool} value={evaluation.tools?.[tool] || ''} placeholder={evaluation.tools?.[tool] || 'Solid'} options={TOOL_LABELS} onChange={value => setTool(tool, value)} />
        ))}
      </div>

      <ManualTextarea
        label="Resumo da avaliação"
        value={evaluation.note || ''}
        placeholder="Explique em uma frase por que esse piso/teto/risco faz sentido..."
        onChange={value => setEvaluation('note', value)}
      />
    </section>
  )
}

function RangeEditor({ title, score, label, note, color, onScore, onLabel, onNote }) {
  const numericScore = Number(score || 50)
  const syncedLabel = label || labelForOutcome(numericScore)

  return (
    <div className="rounded-[26px] border border-white/25 bg-white/24 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className={typography.metricLabel}>{title}</div>
          <div className="mt-1 font-numeric text-5xl font-extrabold leading-none" style={{ color }}>{numericScore}</div>
        </div>
        <ManualSelect label="Label" value={syncedLabel} placeholder={syncedLabel} options={OUTCOME_LABELS} onChange={onLabel} />
      </div>
      <input type="range" min="35" max="98" value={numericScore} onChange={event => onScore(event.target.value)} className="mt-4 w-full accent-violet-500" />
      <textarea value={note || ''} onChange={event => onNote(event.target.value)} placeholder="Comentário opcional..." className="mt-3 min-h-[70px] w-full resize-y rounded-2xl border border-white/20 bg-white/24 px-3 py-2 text-xs font-semibold leading-5 text-slate-700 outline-none placeholder:text-slate-400" />
    </div>
  )
}

function RiskEditor({ evaluation, setEvaluation }) {
  const color = evaluation.riskLevel === 'High' ? '#d77878' : evaluation.riskLevel === 'Low' ? '#4f9577' : '#c59b42'
  return (
    <div className="rounded-[26px] border border-white/25 bg-white/24 p-4">
      <div className={typography.metricLabel}>Risco</div>
      <div className="mt-1 font-numeric text-5xl font-extrabold leading-none" style={{ color }}>{evaluation.riskLevel || 'Moderate'}</div>
      <div className="mt-4 grid gap-3">
        <ManualSelect label="Nível" value={evaluation.riskLevel || ''} placeholder={evaluation.riskLevel || 'Moderate'} options={RISK_LEVELS} onChange={value => setEvaluation('riskLevel', value)} />
        <ManualSelect label="Motivo" value={evaluation.riskReason || ''} placeholder={evaluation.riskReason || 'Role clarity'} options={RISK_REASONS} onChange={value => setEvaluation('riskReason', value)} />
        <textarea value={evaluation.riskNote || ''} onChange={event => setEvaluation('riskNote', event.target.value)} placeholder="Comentário opcional..." className="min-h-[70px] w-full resize-y rounded-2xl border border-white/20 bg-white/24 px-3 py-2 text-xs font-semibold leading-5 text-slate-700 outline-none placeholder:text-slate-400" />
      </div>
    </div>
  )
}


function ManualInput({ label, value, placeholder, onChange }) {
  return (
    <label className="block min-w-0 rounded-[24px] border border-white/25 bg-white/24 p-4 backdrop-blur-md">
      <span className={typography.metricLabel}>{label}</span>
      <input
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full bg-transparent font-sans text-lg font-extrabold text-slate-800 outline-none placeholder:text-slate-400"
      />
    </label>
  )
}

function ManualSelect({ label, value, placeholder, options, onChange }) {
  return (
    <label className="block rounded-[24px] border border-white/25 bg-white/24 p-4 backdrop-blur-md">
      <span className={typography.metricLabel}>{label}</span>
      <select
        value={value}
        onChange={event => onChange(event.target.value)}
        className="mt-2 w-full bg-transparent font-sans text-lg font-extrabold text-slate-800 outline-none"
      >
        <option value="">Atual: {placeholder}</option>
        {options.map(option => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  )
}

function ManualTextarea({ label, value, placeholder, onChange }) {
  return (
    <label className="block rounded-[24px] border border-white/25 bg-white/24 p-4 backdrop-blur-md">
      <span className={typography.metricLabel}>{label}</span>
      <textarea
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-3 max-h-[240px] min-h-[132px] w-full resize-none overflow-y-auto rounded-2xl border border-white/20 bg-white/20 px-3 py-3 text-sm font-semibold leading-6 text-slate-700 outline-none placeholder:text-slate-400"
      />
    </label>
  )
}

function SuggestionCard({ suggestion, decision, onDecision }) {
  const severityColor = suggestion.severity === 'critical' ? '#d77878' : suggestion.severity === 'warning' ? '#c59b42' : '#5aaed6'
  const decisionMeta = decision ? DECISION_META[decision] : null
  const DecisionIcon = decisionMeta?.Icon

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, scale: 1.003 }}
      className={cn(glassCard('secondary', 'rounded-[30px] p-5 transition-all duration-300'))}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full px-3 py-1 font-mono text-[8px] font-black uppercase tracking-[.15em]" style={{ color: severityColor, background: severityColor + '1f' }}>
              {suggestion.severity}
            </span>
            <span className="rounded-full bg-white/30 px-3 py-1 font-mono text-[8px] font-black uppercase tracking-[.15em] text-muted">
              {suggestion.confidence} confidence
            </span>
            {decisionMeta && (
              <span className="rounded-full px-3 py-1 font-mono text-[8px] font-black uppercase tracking-[.15em]" style={{ color: decisionMeta.color, background: decisionMeta.color + '1d' }}>
                {DecisionIcon && <DecisionIcon size={12} className="mr-1 inline-block" />} {decisionMeta.label}
              </span>
            )}
          </div>
          <h3 className="mt-3 font-sans text-2xl font-extrabold tracking-tight text-slate-900">{suggestion.field}</h3>
          <p className="mt-2 max-w-4xl text-sm font-semibold leading-6 text-muted">{suggestion.reason}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ActionButton active={decision === 'accepted'} color="#4f9577" onClick={() => onDecision(decision === 'accepted' ? null : 'accepted')} icon={CheckCircle2}>Aceitar</ActionButton>
          <ActionButton active={decision === 'rejected'} color="#d77878" onClick={() => onDecision(decision === 'rejected' ? null : 'rejected')} icon={XCircle}>Rejeitar</ActionButton>
          <ActionButton active={decision === 'ignored'} color="#8b837c" onClick={() => onDecision(decision === 'ignored' ? null : 'ignored')} icon={Clock3}>Depois</ActionButton>
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <ValueBox label="Valor atual" value={suggestion.currentValue} tone="#8b837c" />
        <ValueBox label="Valor sugerido" value={suggestion.suggestedValue} tone="#7c5ccf" />
      </div>

      <div className="mt-5 rounded-[24px] border border-white/20 bg-white/20 p-4">
        <div className="mb-3 flex items-center gap-2 font-mono text-[9px] font-black uppercase tracking-[.18em] text-muted">
          <Sparkles size={14} /> Evidências
        </div>
        <div className="grid gap-2">
          {(suggestion.evidence || []).map((item, index) => (
            <div key={index} className="rounded-2xl bg-white/24 px-3 py-2 text-xs font-bold leading-5 text-slate-600">
              {item}
            </div>
          ))}
        </div>
        {!!suggestion.sources?.length && (
          <div className="mt-3 flex flex-wrap gap-2">
            {suggestion.sources.map(source => (
              <span key={source} className={cn(glass.chip, 'font-mono text-[8px] font-black uppercase tracking-[.13em] text-muted')}>{source}</span>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  )
}

function ActionButton({ active, color, onClick, icon: Icon, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-white/30 px-4 py-2 font-mono text-[9px] font-black uppercase tracking-[.15em] transition-all duration-200 hover:-translate-y-0.5"
      style={{ color, background: active ? color + '24' : 'rgba(255,255,255,.28)', boxShadow: active ? '0 10px 24px ' + color + '20' : '0 8px 20px rgba(0,0,0,.04)' }}
    >
      <Icon size={13} className="mr-1 inline-block" /> {children}
    </button>
  )
}

function ValueBox({ label, value, tone }) {
  return (
    <div className="rounded-[24px] border border-white/25 bg-white/24 p-4">
      <div className={typography.metricLabel}>{label}</div>
      <pre className="mt-2 whitespace-pre-wrap break-words font-sans text-sm font-bold leading-6 text-slate-700" style={{ color: tone }}>
        {safeText(value)}
      </pre>
    </div>
  )
}
