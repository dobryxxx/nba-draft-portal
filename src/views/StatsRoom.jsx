import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import {
  DRAFTBALLR_TOTAL_PLAYERS,
  ID_COLUMNS,
  LOWER_IS_BETTER_KEYS,
  STAT_GROUPS,
  STAT_TOOLTIPS,
  buildVisibleThresholds,
  compareDraftballrRows,
  draftballrPlayers,
  formatStat,
  getColumnValue,
  normalizeDraftballrKey,
} from '../data/draftballrStats'

const DEFAULT_GROUP = 'advanced'

function SortMark({ active, direction }) {
  return (
    <span className={'ml-1 font-mono text-[9px] ' + (active ? 'opacity-100' : 'opacity-30')}>
      {active ? (direction === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  )
}

function getCellTone(value, column, thresholds) {
  if (value === null || value === undefined || column.format === 'string') return ''
  const threshold = thresholds[column.key]
  if (!threshold) return ''
  const highValue = value >= threshold.high
  const lowValue = value <= threshold.low
  const positive = threshold.lowerIsBetter ? lowValue : highValue
  const negative = threshold.lowerIsBetter ? highValue : lowValue
  if (positive) {
    return 'bg-emerald-100/75 text-emerald-950 ring-1 ring-emerald-300/45 dark:bg-emerald-400/15 dark:text-emerald-200 dark:ring-emerald-300/20'
  }
  if (negative) {
    return 'bg-rose-100/75 text-rose-950 ring-1 ring-rose-300/45 dark:bg-rose-400/15 dark:text-rose-200 dark:ring-rose-300/20'
  }
  return ''
}

function HeaderCell({ column, sort, onSort, stickyClass = '' }) {
  const active = sort.key === column.key
  const tooltip = STAT_TOOLTIPS[column.key]
  const lowerIsBetter = LOWER_IS_BETTER_KEYS.has(column.key)

  return (
    <th
      className={
        'sticky top-0 z-20 whitespace-nowrap border-b border-white/45 bg-white/78 px-3 py-3 text-left font-mono text-[9px] font-black uppercase tracking-[.16em] text-slate-500 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/88 dark:text-slate-300 ' +
        stickyClass
      }
    >
      <button
        type="button"
        onClick={() => onSort(column)}
        className="inline-flex items-center gap-1 rounded-full px-1 py-0.5 transition-colors hover:text-violet-600 dark:hover:text-violet-200"
        title={tooltip || (lowerIsBetter ? 'Menor é melhor nesta métrica.' : undefined)}
      >
        <span>{column.label}</span>
        {tooltip && <span className="text-[10px] text-violet-500 dark:text-violet-200">ⓘ</span>}
        {lowerIsBetter && <span className="text-[9px] text-amber-500">↓</span>}
        <SortMark active={active} direction={sort.direction} />
      </button>
    </th>
  )
}

function PlayerCell({ row, prospectsBySlug, prospectsByName, onSelectProspect }) {
  const slug = normalizeDraftballrKey(row.player_slug || row.player)
  const local = prospectsBySlug.get(slug) || prospectsByName.get(normalizeDraftballrKey(row.player))
  const canOpen = Boolean(local && onSelectProspect)

  return (
    <td className="sticky left-[64px] z-10 border-b border-white/28 bg-white/70 px-3 py-2.5 align-middle backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/78">
      <button
        type="button"
        disabled={!canOpen}
        onClick={() => canOpen && onSelectProspect(local.id)}
        className={
          'block max-w-[230px] truncate text-left font-sans text-sm font-black text-slate-900 dark:text-white ' +
          (canOpen ? 'transition-colors hover:text-violet-600 dark:hover:text-violet-200' : 'cursor-default')
        }
        title={canOpen ? `Abrir perfil de ${row.player}` : row.player}
      >
        {row.player}
      </button>
    </td>
  )
}

function Cell({ row, column, thresholds, stickyClass = '' }) {
  const value = getColumnValue(row, column)
  const tone = getCellTone(value, column, thresholds)
  return (
    <td className={'border-b border-white/28 px-3 py-2.5 align-middle dark:border-white/10 ' + stickyClass}>
      <span
        className={
          'inline-flex min-h-7 items-center rounded-full px-2.5 font-mono text-[11px] font-black tabular-nums text-slate-700 dark:text-slate-200 ' +
          tone
        }
      >
        {formatStat(row?.[column.key], column.format)}
      </span>
    </td>
  )
}

export default function StatsRoom({ prospects = [], onSelectProspect }) {
  const [activeGroup, setActiveGroup] = useState(DEFAULT_GROUP)
  const [search, setSearch] = useState('')
  const [position, setPosition] = useState('ALL')
  const [conference, setConference] = useState('ALL')
  const [classFilter, setClassFilter] = useState('ALL')
  const [sort, setSort] = useState({ key: 'big_board_rank', direction: 'asc' })

  const active = STAT_GROUPS.find(group => group.id === activeGroup) || STAT_GROUPS[0]
  const activeColumns = active.columns
  const allColumns = [...ID_COLUMNS, ...activeColumns]
  const allColumnMap = useMemo(() => {
    return [...ID_COLUMNS, ...STAT_GROUPS.flatMap(group => group.columns)]
      .reduce((acc, column) => ({ ...acc, [column.key]: column }), {})
  }, [])

  const prospectsBySlug = useMemo(() => {
    return new Map(prospects.map(prospect => [normalizeDraftballrKey(prospect.slug || prospect.player_slug || prospect.name), prospect]))
  }, [prospects])

  const prospectsByName = useMemo(() => {
    return new Map(prospects.map(prospect => [normalizeDraftballrKey(prospect.name), prospect]))
  }, [prospects])

  const positions = useMemo(() => ['ALL', ...Array.from(new Set(draftballrPlayers.map(row => row.position).filter(Boolean))).sort()], [])
  const conferences = useMemo(() => ['ALL', ...Array.from(new Set(draftballrPlayers.map(row => row.conf).filter(Boolean))).sort()], [])
  const classes = useMemo(() => ['ALL', ...Array.from(new Set(draftballrPlayers.map(row => row.class || '-').filter(Boolean))).sort()], [])

  const filteredRows = useMemo(() => {
    const query = normalizeDraftballrKey(search)
    return draftballrPlayers.filter(row => {
      const matchesSearch = !query || normalizeDraftballrKey(row.player).includes(query) || normalizeDraftballrKey(row.team).includes(query)
      const matchesPosition = position === 'ALL' || row.position === position
      const matchesConference = conference === 'ALL' || row.conf === conference
      const matchesClass = classFilter === 'ALL' || (row.class || '-') === classFilter
      return matchesSearch && matchesPosition && matchesConference && matchesClass
    })
  }, [search, position, conference, classFilter])

  const sortedRows = useMemo(() => {
    const column = allColumnMap[sort.key] || ID_COLUMNS[0]
    return [...filteredRows].sort((a, b) => compareDraftballrRows(a, b, column, sort.direction))
  }, [allColumnMap, filteredRows, sort])

  const thresholds = useMemo(() => buildVisibleThresholds(filteredRows, activeColumns), [filteredRows, activeColumns])

  const handleSort = column => {
    setSort(current => ({
      key: column.key,
      direction: current.key === column.key && current.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  return (
    <section className="min-h-full px-4 py-5 md:px-6 lg:px-7">
      <div className="mx-auto max-w-[1660px]">
        <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="font-mono text-[9px] font-black uppercase tracking-[.28em] text-lo">DraftBallr / Comparative Table</div>
            <h1 className="mt-1 font-headline text-4xl font-black tracking-tight text-slate-950 dark:text-white md:text-5xl">
              Stats Room
            </h1>
            <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-muted">
              Tabela comparativa dos 67 prospects de 2026, com filtros, ordenação e destaque por extremos dentro do conjunto visível.
            </p>
          </div>
          <div className="rounded-[24px] border border-white/45 bg-white/38 px-4 py-3 text-right shadow-[inset_1px_1px_0_rgba(255,255,255,.62)] backdrop-blur-xl dark:border-white/10 dark:bg-white/6">
            <div className="font-mono text-[8px] font-black uppercase tracking-[.18em] text-lo">Mostrando</div>
            <div className="mt-1 font-numeric text-3xl font-black text-violet-600 dark:text-violet-200">
              {filteredRows.length} / {DRAFTBALLR_TOTAL_PLAYERS}
            </div>
          </div>
        </div>

        <div className="rounded-[30px] border border-white/45 bg-white/36 p-4 shadow-[0_18px_52px_rgba(40,36,32,.06),inset_1px_1px_0_rgba(255,255,255,.68)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/42">
          <div className="grid gap-3 xl:grid-cols-[minmax(240px,1fr)_180px_140px_120px] xl:items-center">
            <label className="relative block min-w-0">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder="Buscar jogador ou time..."
                className="h-12 w-full rounded-2xl border border-white/40 bg-white/58 pl-11 pr-4 font-sans text-sm font-semibold text-slate-800 outline-none ring-0 transition focus:border-violet-300/70 focus:ring-4 focus:ring-violet-300/15 dark:border-white/10 dark:bg-slate-950/35 dark:text-white"
              />
            </label>
            <FilterSelect value={position} onChange={setPosition} items={positions} allLabel="Todas posições" />
            <FilterSelect value={conference} onChange={setConference} items={conferences} allLabel="Todas confs" />
            <FilterSelect value={classFilter} onChange={setClassFilter} items={classes} allLabel="Todas classes" />
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
            {STAT_GROUPS.map(group => {
              const activeTab = activeGroup === group.id
              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setActiveGroup(group.id)}
                  className={
                    'shrink-0 rounded-full border px-3 py-2 font-mono text-[9px] font-black uppercase tracking-[.15em] transition-all ' +
                    (activeTab
                      ? 'border-violet-200/70 bg-white/80 text-violet-700 shadow-[0_10px_24px_rgba(124,92,207,.14)] dark:border-violet-300/20 dark:bg-white/15 dark:text-violet-200'
                      : 'border-white/45 bg-white/35 text-slate-500 hover:bg-white/55 dark:border-white/10 dark:bg-white/8 dark:text-slate-300')
                  }
                >
                  {group.shortLabel}
                </button>
              )
            })}
          </div>

          <p className="mt-3 font-mono text-[9px] font-black uppercase tracking-[.16em] text-slate-500 dark:text-slate-300">
            Mostrando {filteredRows.length} de {DRAFTBALLR_TOTAL_PLAYERS} prospects
          </p>
        </div>

        <div className="mt-5 overflow-hidden rounded-[30px] border border-white/45 bg-white/30 shadow-[0_18px_52px_rgba(40,36,32,.06)] dark:border-white/10 dark:bg-white/5">
          <div className="max-h-[calc(100vh-300px)] min-h-[480px] overflow-auto [scrollbar-width:thin]">
            <table className="min-w-[1220px] border-separate border-spacing-0 text-left">
              <thead>
                <tr>
                  {allColumns.map((column, index) => {
                    const stickyClass =
                      column.key === 'big_board_rank'
                        ? 'sticky left-0 z-40 min-w-[64px]'
                        : column.key === 'player'
                        ? 'sticky left-[64px] z-40 min-w-[250px]'
                        : ''
                    return (
                      <HeaderCell
                        key={`${activeGroup}-${column.key}-${index}`}
                        column={column}
                        sort={sort}
                        onSort={handleSort}
                        stickyClass={stickyClass}
                      />
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {sortedRows.map(row => (
                  <tr key={row.player_slug || row.player} className="group/row transition-colors hover:bg-white/22 dark:hover:bg-white/5">
                    <Cell row={row} column={ID_COLUMNS[0]} thresholds={thresholds} stickyClass="sticky left-0 z-10 bg-white/70 backdrop-blur-xl dark:bg-slate-950/78" />
                    <PlayerCell row={row} prospectsBySlug={prospectsBySlug} prospectsByName={prospectsByName} onSelectProspect={onSelectProspect} />
                    {allColumns.slice(2).map((column, index) => (
                      <Cell key={`${row.player_slug}-${column.key}-${index}`} row={row} column={column} thresholds={thresholds} />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

function FilterSelect({ value, onChange, items, allLabel }) {
  return (
    <select
      value={value}
      onChange={event => onChange(event.target.value)}
      className="h-12 rounded-2xl border border-white/40 bg-white/58 px-3 font-mono text-[10px] font-black uppercase tracking-[.12em] text-slate-600 outline-none dark:border-white/10 dark:bg-slate-950/35 dark:text-slate-200"
    >
      {items.map(item => <option key={item} value={item}>{item === 'ALL' ? allLabel : item}</option>)}
    </select>
  )
}
