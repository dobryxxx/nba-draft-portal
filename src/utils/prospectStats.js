import { prospects } from '../data/prospects.js'

export const STAT_KEYS = [
  'ppg',
  'rpg',
  'apg',
  'fgp',
  'threep',
  'ftp',
  'ts',
  'efg',
  'usg',
  'astTo',
  'stlPct',
  'blkPct',
  'per',
  'collegeRts',
]

export const PERCENT_STAT_KEYS = new Set(['fgp', 'threep', 'ftp', 'ts', 'efg', 'usg'])
export const RATE_PERCENT_STAT_KEYS = new Set(['stlPct', 'blkPct'])

export const STAT_RANGES = {
  ppg: [0, 40],
  rpg: [0, 20],
  apg: [0, 15],
  fgp: [20, 75],
  threep: [0, 60],
  ftp: [30, 100],
  ts: [35, 75],
  efg: [35, 75],
  usg: [5, 45],
  astTo: [0, 6],
  stlPct: [0, 7],
  blkPct: [0, 15],
  per: [-10, 40],
  collegeRts: [-12, 14],
}

const FIELD_ALIASES = {
  threep: ['threep', 'threePct', 'three_pt_pct', 'threePointPct', '3p', '3P%'],
  fgp: ['fgp', 'fgPct', 'fieldGoalPct', 'FG%'],
  ftp: ['ftp', 'ftPct', 'freeThrowPct', 'FT%'],
  ts: ['ts', 'tsPct', 'trueShootingPct', 'TS%'],
  efg: ['efg', 'efgPct', 'effectiveFieldGoalPct', 'eFG%'],
  usg: ['usg', 'usgPct', 'usagePct', 'USG%'],
  astTo: ['astTo', 'ast_to', 'assistTurnover', 'ast_to_ratio'],
  stlPct: ['stlPct', 'stl_pct', 'stealPct', 'STL%'],
  blkPct: ['blkPct', 'blk_pct', 'blockPct', 'BLK%'],
  collegeRts: ['collegeRts', 'college_rts', 'relativeTrueShooting', 'rts', 'RTS'],
}

export function toFiniteNumber(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (typeof value !== 'string') return null
  const cleaned = value.trim().replace('%', '').replace(',', '.')
  if (!cleaned || cleaned === '-') return null
  const parsed = Number(cleaned)
  return Number.isFinite(parsed) ? parsed : null
}

function readStat(stats, key) {
  if (!stats) return null
  const aliases = FIELD_ALIASES[key] || [key]
  for (const alias of aliases) {
    if (stats[alias] !== undefined && stats[alias] !== null) return stats[alias]
  }
  return stats[key]
}

export function normalizeStatValue(key, value) {
  const number = toFiniteNumber(value)
  if (number === null) return null

  // Main efficiency/usage fields sometimes arrive as decimals from external feeds.
  // Stocks such as 0.8 STL% or 0.9 BLK% are plausible real percentages, so keep them as-is.
  if (PERCENT_STAT_KEYS.has(key) && number > 0 && number <= 1) return number * 100

  return number
}

export function normalizeProspectStats(prospect = {}) {
  const raw = prospect?.stats || {}
  const normalized = {}
  STAT_KEYS.forEach(key => {
    normalized[key] = normalizeStatValue(key, readStat(raw, key))
  })
  normalized.stl = normalized.stlPct
  normalized.blk = normalized.blkPct
  return normalized
}

export function hasStatValue(value) {
  return typeof value === 'number' && Number.isFinite(value)
}

export function formatStat(value, decimals = 1) {
  const number = toFiniteNumber(value)
  return number === null ? '—' : number.toFixed(decimals)
}

export function formatPercent(value, decimals = 1) {
  const number = toFiniteNumber(value)
  return number === null ? '—' : `${number.toFixed(decimals)}%`
}

export function formatRatio(value, decimals = 1) {
  return formatStat(value, decimals)
}

export function formatStatByKey(key, value, decimals = 1) {
  if (PERCENT_STAT_KEYS.has(key) || RATE_PERCENT_STAT_KEYS.has(key)) return formatPercent(value, decimals)
  return key === 'astTo' ? formatRatio(value, decimals) : formatStat(value, decimals)
}

export function getNormalizedStat(prospect, key) {
  return normalizeProspectStats(prospect)[key]
}

export function getAllNormalizedStatValues(list, key) {
  return (list || []).map(player => getNormalizedStat(player, key)).filter(hasStatValue)
}

export function auditProspectStats(list = prospects) {
  const results = []

  ;(list || []).forEach(player => {
    const normalized = normalizeProspectStats(player)
    const issues = []

    STAT_KEYS.forEach(key => {
      const raw = readStat(player?.stats || {}, key)
      const value = normalized[key]
      const [min, max] = STAT_RANGES[key] || [-Infinity, Infinity]

      if (raw === undefined || raw === null || raw === '') {
        issues.push({ field: key, type: 'missing', value: raw })
        return
      }
      if (typeof raw === 'string' && toFiniteNumber(raw) !== null) {
        issues.push({ field: key, type: 'numeric-string', value: raw })
      }
      if (!hasStatValue(value)) {
        issues.push({ field: key, type: 'invalid-number', value: raw })
        return
      }
      if (PERCENT_STAT_KEYS.has(key) && value > 100) {
        issues.push({ field: key, type: 'percent-scale-high', value })
      }
      if (value < min || value > max) {
        issues.push({ field: key, type: 'outside-plausible-range', value, range: [min, max] })
      }
    })

    if (issues.length) {
      results.push({
        playerId: player?.id,
        name: player?.name || 'Prospecto sem nome',
        issues,
      })
    }
  })

  return {
    totalProspects: (list || []).length,
    affectedProspects: results.length,
    totalIssues: results.reduce((sum, item) => sum + item.issues.length, 0),
    results,
  }
}

export function auditAllProspectStats() {
  return auditProspectStats(prospects)
}
