import { useMemo, useState } from 'react'
import {
  STAT_GROUPS,
  STAT_TOOLTIPS,
  formatStat,
  getDraftballrPlayerForProspect,
  getPercentile,
} from '../../data/draftballrStats'

function PercentileBar({ value, percentile }) {
  const numericPercentile = Number(percentile)
  if (percentile === null || percentile === undefined || !Number.isFinite(numericPercentile)) return null

  const pInt = Math.max(0, Math.min(100, Math.round(numericPercentile)))
  const tier =
    pInt > 90 ? 'elite' :
    pInt > 66 ? 'high' :
    pInt >= 33 ? 'mid' :
    'low'

  const colors = {
    elite: { bar: '#7F77DD', text: '#534AB7', bg: '#EEEDFE', label: 'ELITE' },
    high: { bar: '#7F77DD', text: '#534AB7', bg: '#EEEDFE', label: 'HIGH' },
    mid: { bar: '#EF9F27', text: '#854F0B', bg: '#FAEEDA', label: 'MID' },
    low: { bar: '#E24B4A', text: '#A32D2D', bg: '#FCEBEB', label: 'LOW' },
  }
  const c = colors[tier]

  return (
    <div className="mt-[6px]" data-stat-value={value ?? ''}>
      <div className="flex items-center gap-2">
        <div
          className="flex-1 overflow-hidden rounded-full"
          style={{
            height: 5,
            background: 'rgba(136,135,128,0.2)',
          }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${pInt}%`,
              background: c.bar,
              transition: 'width 0.4s ease',
            }}
          />
        </div>
        <span
          className="min-w-[28px] text-right font-mono"
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: c.text,
          }}
        >
          P{pInt}
        </span>
        <span
          className="rounded-full font-mono uppercase"
          style={{
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: '0.06em',
            padding: '2px 6px',
            background: c.bg,
            color: c.text,
          }}
        >
          {c.label}
        </span>
      </div>
    </div>
  )
}

function StatTile({ row, column }) {
  const percentile = getPercentile(row, column.key)
  const tooltip = STAT_TOOLTIPS[column.key]

  return (
    <div className={'rounded-[22px] border border-white/38 bg-white/38 p-3 shadow-[inset_1px_1px_0_rgba(255,255,255,.64)] backdrop-blur-xl dark:border-white/10 dark:bg-white/6 ' + (percentile !== null && percentile !== undefined ? 'mb-1' : '')}>
      <div className="flex items-center justify-between gap-2">
        <span className="min-w-0 truncate font-mono text-[8px] font-black uppercase tracking-[.16em] text-slate-500 dark:text-slate-400">
          {column.label}
        </span>
        {tooltip && (
          <span
            className="shrink-0 cursor-help text-[10px] font-black text-violet-500 dark:text-violet-200"
            title={tooltip}
            aria-label={tooltip}
          >
            ⓘ
          </span>
        )}
      </div>
      <div className="mt-2 font-numeric text-xl font-black tabular-nums text-slate-950 dark:text-white">
        {formatStat(row?.[column.key], column.format)}
      </div>
      <PercentileBar value={row?.[column.key]} percentile={percentile} />
    </div>
  )
}

const perGame = (total, games, decimals = 1) => {
  const numericTotal = Number(total)
  const numericGames = Number(games)
  if (total === null || total === undefined || !Number.isFinite(numericTotal) || !Number.isFinite(numericGames) || numericGames <= 0) return null
  return Number((numericTotal / numericGames).toFixed(decimals))
}

const sumTotals = (...values) => {
  if (values.some(value => value === null || value === undefined || !Number.isFinite(Number(value)))) return null
  return values.reduce((total, value) => total + Number(value), 0)
}

function VolumeMetric({ label, value, format = 'decimal1' }) {
  return (
    <div className="rounded-[18px] border border-white/34 bg-white/34 px-3 py-2.5 shadow-[inset_1px_1px_0_rgba(255,255,255,.58)] backdrop-blur-xl dark:border-white/10 dark:bg-white/6">
      <div className="font-mono text-[8px] font-black uppercase tracking-[.14em] text-slate-500 dark:text-slate-400">
        {label}
      </div>
      <div className="mt-1 font-numeric text-xl font-black tabular-nums text-slate-950 dark:text-white">
        {formatStat(value, format)}
      </div>
    </div>
  )
}

function VolumeGroup({ title, metrics }) {
  return (
    <div className="rounded-[24px] border border-white/36 bg-white/24 p-3 dark:border-white/10 dark:bg-white/5">
      <div className="mb-2 font-mono text-[8px] font-black uppercase tracking-[.18em] text-lo">
        {title}
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {metrics.map(metric => (
          <VolumeMetric key={metric.label} {...metric} />
        ))}
      </div>
    </div>
  )
}

function VolumeSection({ row }) {
  const [mode, setMode] = useState('perGame')
  const games = row?.games
  const fieldGoalAttempts = sumTotals(row?.two_a, row?.three_a)
  const fieldGoalMakes = sumTotals(row?.two_m, row?.three_m)

  const perGameGroups = [
    {
      title: 'Arremessos de Campo',
      metrics: [
        { label: 'FGA', value: perGame(fieldGoalAttempts, games) },
        { label: 'FGM', value: perGame(fieldGoalMakes, games) },
        { label: '3PA', value: perGame(row?.three_a, games) },
        { label: '3PM', value: perGame(row?.three_m, games) },
        { label: '2PA', value: perGame(row?.two_a, games) },
        { label: '2PM', value: perGame(row?.two_m, games) },
      ],
    },
    {
      title: 'Lances Livres',
      metrics: [
        { label: 'FTA', value: perGame(row?.fta, games) },
        { label: 'FTM', value: perGame(row?.ftm, games) },
      ],
    },
    {
      title: 'Por Zona',
      metrics: [
        { label: 'Rim A', value: perGame(row?.rim_a, games) },
        { label: 'Rim M', value: perGame(row?.rim_m, games) },
        { label: 'Dunk A', value: perGame(row?.dunk_a, games) },
        { label: 'Dunk M', value: perGame(row?.dunk_m, games) },
        { label: 'TSA', value: perGame(row?.tsa, games) },
      ],
    },
  ]

  const per100Groups = [
    {
      title: 'Volume Normalizado',
      metrics: [
        { label: '3PA/100', value: row?.['3pa_100'], format: 'decimal2' },
        { label: '2PA/100', value: row?.['2pa_100'], format: 'decimal2' },
        { label: 'FTA/100', value: row?.fta_100, format: 'decimal2' },
        { label: 'Rim A/100', value: row?.rim_100, format: 'decimal2' },
        { label: 'Mid A/100', value: row?.mid_100, format: 'decimal2' },
        { label: 'UA Rim/100', value: row?.ua_rimmakes_100, format: 'decimal2' },
        { label: 'UA 3P/100', value: row?.ua_threes_100, format: 'decimal2' },
      ],
    },
  ]

  const groups = mode === 'perGame' ? perGameGroups : per100Groups

  return (
    <section className="rounded-[30px] border border-white/45 bg-white/30 p-4 shadow-[0_18px_54px_rgba(40,36,32,.055),inset_1px_1px_0_rgba(255,255,255,.64)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/34">
      <div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="font-mono text-[8px] font-black uppercase tracking-[.22em] text-lo">DraftBallr API</div>
          <h3 className="mt-1 font-headline text-xl font-black tracking-tight text-slate-950 dark:text-white">
            Volume
          </h3>
        </div>
        <div className="inline-flex w-fit rounded-full border border-white/45 bg-white/34 p-1 shadow-[inset_1px_1px_0_rgba(255,255,255,.62)] dark:border-white/10 dark:bg-white/6" role="group" aria-label="Alternar visualização de volume">
          {[
            ['perGame', 'Por Jogo'],
            ['per100', 'Por 100 Posses'],
          ].map(([id, label]) => {
            const active = mode === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => setMode(id)}
                aria-pressed={active}
                className={
                  'rounded-full px-3 py-1.5 font-mono text-[9px] font-black uppercase tracking-[.12em] transition-all focus:outline-none focus:ring-2 focus:ring-violet-300/50 ' +
                  (active
                    ? 'bg-white/86 text-violet-700 shadow-[0_8px_18px_rgba(124,92,207,.13)] dark:bg-white/16 dark:text-violet-200'
                    : 'text-slate-500 hover:bg-white/38 dark:text-slate-300 dark:hover:bg-white/8')
                }
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>
      <div className={mode === 'perGame' ? 'grid gap-3 xl:grid-cols-3' : 'grid gap-3 xl:grid-cols-1'}>
        {groups.map(group => (
          <VolumeGroup key={group.title} title={group.title} metrics={group.metrics} />
        ))}
      </div>
    </section>
  )
}

function StatSection({ group, row }) {
  if (group.id === 'volume') return <VolumeSection row={row} />

  return (
    <section className="rounded-[30px] border border-white/45 bg-white/30 p-4 shadow-[0_18px_54px_rgba(40,36,32,.055),inset_1px_1px_0_rgba(255,255,255,.64)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/34">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <div className="font-mono text-[8px] font-black uppercase tracking-[.22em] text-lo">DraftBallr API</div>
          <h3 className="mt-1 font-headline text-xl font-black tracking-tight text-slate-950 dark:text-white">
            {group.label}
          </h3>
        </div>
        <span className="rounded-full border border-white/45 bg-white/38 px-3 py-1 font-mono text-[8px] font-black uppercase tracking-[.14em] text-slate-500 dark:border-white/10 dark:bg-white/8 dark:text-slate-300">
          {group.columns.length} métricas
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4">
        {group.columns.map(column => (
          <StatTile key={column.key} row={row} column={column} />
        ))}
      </div>
    </section>
  )
}

function PhysicalOnlyNotice({ row }) {
  const physical = STAT_GROUPS.find(group => group.id === 'physical')
  return (
    <section className="rounded-[32px] border border-amber-300/45 bg-amber-100/45 p-5 shadow-[0_18px_54px_rgba(180,120,40,.08),inset_1px_1px_0_rgba(255,255,255,.62)] backdrop-blur-2xl dark:border-amber-300/20 dark:bg-amber-400/10">
      <div className="font-mono text-[9px] font-black uppercase tracking-[.22em] text-amber-800 dark:text-amber-200">
        Prospect internacional
      </div>
      <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-amber-950/78 dark:text-amber-100/84">
        Estatísticas de college não disponíveis para prospects internacionais. Abaixo aparecem apenas os dados físicos presentes na base.
      </p>
      {physical && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {physical.columns.map(column => (
            <StatTile key={column.key} row={row} column={column} />
          ))}
        </div>
      )}
    </section>
  )
}

export default function ProfileStats({ p }) {
  const row = useMemo(() => getDraftballrPlayerForProspect(p), [p])

  if (!row) {
    return (
      <section className="rounded-[34px] border border-white/45 bg-white/36 p-6 shadow-[0_26px_78px_rgba(40,36,32,.08),inset_1px_1px_0_rgba(255,255,255,.70)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/50">
        <div className="font-mono text-[9px] font-black uppercase tracking-[.24em] text-lo">Stats indisponíveis</div>
        <h2 className="mt-2 font-headline text-3xl font-black text-slate-950 dark:text-white">Sem match no DraftBallr</h2>
        <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-muted">
          Não encontrei esse jogador no arquivo `draftballr_raw_api.json`. O perfil continua usando os dados editoriais do site nas outras abas.
        </p>
      </section>
    )
  }

  const isInternationalWithoutCollegeStats = row.conf === 'INTL' && row.ppg == null
  const visibleGroups = isInternationalWithoutCollegeStats
    ? []
    : STAT_GROUPS

  return (
    <section className="relative overflow-hidden rounded-[34px] border border-white/45 bg-white/36 p-4 shadow-[0_26px_78px_rgba(40,36,32,.08),inset_1px_1px_0_rgba(255,255,255,.70)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/50 md:p-5">
      <span className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-200/25 blur-3xl dark:bg-violet-400/10" />
      <div className="relative">
        <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="font-mono text-[9px] font-black uppercase tracking-[.28em] text-lo">Stats Profile</div>
            <h2 className="mt-1 font-headline text-3xl font-black tracking-tight text-slate-950 dark:text-white md:text-4xl">
              {row.player}
            </h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-muted">
              #{row.big_board_rank} / {row.position} / {row.team} / {row.class || '—'} / {row.conf || '—'}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:min-w-[360px]">
            {[
              ['Altura', formatStat(row.height, 'string')],
              ['Idade Draft', formatStat(row.draft_age, 'decimal2')],
              ['Conferência', row.conf || '—'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[18px] border border-white/40 bg-white/35 px-3 py-2 text-center shadow-[inset_1px_1px_0_rgba(255,255,255,.55)] dark:border-white/10 dark:bg-white/8">
                <div className="font-mono text-[8px] font-black uppercase tracking-[.14em] text-lo">{label}</div>
                <div className="mt-1 truncate font-numeric text-lg font-black text-violet-600 dark:text-violet-200">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {isInternationalWithoutCollegeStats ? (
          <PhysicalOnlyNotice row={row} />
        ) : (
          <div className="grid gap-4">
            {visibleGroups.map(group => (
              <StatSection key={group.id} group={group} row={row} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
