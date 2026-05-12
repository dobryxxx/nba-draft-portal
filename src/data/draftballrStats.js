import rawDraftballrApi from '../../draftballr_raw_api.json'

export const DRAFTBALLR_TOTAL_PLAYERS = 67

export const ID_COLUMNS = [
  { key: 'big_board_rank', label: '#', format: 'integer' },
  { key: 'player', label: 'Jogador', format: 'string' },
  { key: 'position', label: 'Posição', format: 'string' },
  { key: 'team', label: 'Time', format: 'string' },
  { key: 'class', label: 'Cl', format: 'string' },
  { key: 'conf', label: 'Conf', format: 'string' },
]

export const PROFILE_ID_COLUMNS = [
  ...ID_COLUMNS,
  { key: 'height', label: 'Altura', format: 'string' },
  { key: 'draft_age', label: 'Idade Draft', format: 'decimal2' },
]

export const STAT_GROUPS = [
  {
    id: 'traditional',
    label: 'Tradicionais',
    shortLabel: 'Tradicionais',
    columns: [
      ['games', 'G', 'integer'],
      ['mpg', 'MPG', 'decimal1'],
      ['ppg', 'PPG', 'decimal1'],
      ['rpg', 'RPG', 'decimal1'],
      ['orpg', 'ORPG', 'decimal1'],
      ['drpg', 'DRPG', 'decimal1'],
      ['apg', 'APG', 'decimal1'],
      ['spg', 'SPG', 'decimal1'],
      ['bpg', 'BPG', 'decimal1'],
      ['topg', 'TOV', 'decimal1'],
      ['prpg', 'PRpg (Off)', 'decimal1'],
      ['d_prpg', 'PRpg (Def)', 'decimal1'],
    ],
  },
  {
    id: 'shooting',
    label: 'Shooting',
    shortLabel: 'Shooting',
    columns: [
      ['ts', 'TS%', 'percent1'],
      ['efg', 'eFG%', 'percent1'],
      ['three_pct', '3P%', 'percent1'],
      ['two_pct', '2P%', 'percent1'],
      ['ft_pct', 'FT%', 'percent1'],
      ['rim_pct', 'Rim%', 'percent1'],
      ['mid_pct', 'Mid%', 'percent1'],
      ['2p_ts_pct', '2P TS%', 'percent1'],
      ['dunk_pct', 'Dunk%', 'percent1'],
      ['close_2_pct', 'Close 2%', 'percent1'],
      ['far_2_pct', 'Far 2%', 'percent1'],
      ['ftr', 'FTr', 'decimal1'],
      ['morey_rate', 'Morey Rate', 'decimal2'],
      ['3pr', '3PR', 'decimal3'],
    ],
  },
  {
    id: 'volume',
    label: 'Volume por 100 posses',
    shortLabel: 'Volume',
    columns: [
      ['3pa_100', '3PA/100', 'decimal2'],
      ['2pa_100', '2PA/100', 'decimal2'],
      ['fta_100', 'FTA/100', 'decimal2'],
      ['rim_100', 'Rim/100', 'decimal2'],
      ['mid_100', 'Mid/100', 'decimal2'],
      ['ua_rimmakes_100', 'UA Rim/100', 'decimal2'],
      ['ua_threes_100', 'UA 3P/100', 'decimal2'],
      ['ua_rimmakes', 'UA Rim Makes', 'integer'],
      ['ua_threes', 'UA Threes', 'integer'],
    ],
  },
  {
    id: 'advanced',
    label: 'Avançadas (Box Score)',
    shortLabel: 'Avançadas',
    columns: [
      ['bpm', 'BPM', 'decimal1'],
      ['obpm', 'OBPM', 'decimal1'],
      ['dbpm', 'DBPM', 'decimal1'],
      ['bpm_plus', 'BPM+', 'decimal2'],
      ['obpm_plus', 'OBPM+', 'decimal2'],
      ['dbpm_plus', 'DBPM+', 'decimal2'],
      ['ortg', 'ORtg', 'decimal1'],
      ['drtg', 'DRtg', 'decimal1'],
      ['usg', 'USG%', 'percent1'],
      ['box_creation', 'Box Creation', 'decimal2'],
      ['offensive_load', 'Off. Load', 'decimal2'],
      ['college_rts', 'College RTS', 'decimal2'],
      ['ctov', 'cTOV', 'decimal2'],
      ['poss', 'Posses', 'integer'],
      ['min_pct', 'Min%', 'percent1'],
      ['high_major_ts_baseline', 'TS Baseline Conf', 'percent2'],
    ],
  },
  {
    id: 'rapm',
    label: 'RAPM (Hipotético)',
    shortLabel: 'RAPM',
    columns: [
      ['he_rapm_total', 'RAPM Total', 'decimal2'],
      ['he_rapm_off_adj_ppp', 'RAPM Off', 'decimal2'],
      ['he_rapm_def_adj_ppp', 'RAPM Def', 'decimal2'],
      ['he_rapm_def_2p', 'RAPM Def 2P', 'decimal4'],
      ['he_rapm_def_orb', 'RAPM Def ORB', 'decimal4'],
      ['he_rapm_def_ftr', 'RAPM Def FTr', 'decimal4'],
      ['he_rim_ast_100', 'Rim Ast/100', 'decimal2'],
      ['he_3p_ast_100', '3P Ast/100', 'decimal2'],
    ],
  },
  {
    id: 'playmaking',
    label: 'Playmaking & Criação',
    shortLabel: 'Criação',
    columns: [
      ['ast_pct', 'AST%', 'percent1'],
      ['to_pct', 'TOV%', 'percent1'],
      ['ast_tov_ratio', 'AST/TOV', 'decimal2'],
      ['ast_to_usg', 'AST/USG', 'decimal2'],
      ['assisted_pct', 'Assisted%', 'percent1'],
      ['threes_assisted_pct', '3P Assisted%', 'percent1'],
      ['rim_assisted_pct', 'Rim Assisted%', 'percent1'],
      ['pfr', 'PFR', 'decimal2'],
      ['stk_to_foul', 'STK/Foul', 'decimal2'],
      ['fc_per_40', 'FC/40', 'decimal1'],
    ],
  },
  {
    id: 'defense',
    label: 'Rebote & Defesa',
    shortLabel: 'Rebote/Def',
    columns: [
      ['or_pct', 'ORB%', 'percent1'],
      ['dr_pct', 'DRB%', 'percent1'],
      ['stl_pct', 'STL%', 'percent1'],
      ['blk_pct', 'BLK%', 'percent1'],
      ['tov_100', 'TOV/100', 'decimal2'],
      ['rim_non_rim', 'Rim/NonRim', 'decimal2'],
    ],
  },
  {
    id: 'physical',
    label: 'Físico',
    shortLabel: 'Físico',
    columns: [
      ['height', 'Altura', 'string'],
      ['height_wo_shoes_in', 'Altura s/ sapato', 'inches2'],
      ['wingspan_in', 'Wingspan', 'inches2'],
      ['weight_lbs', 'Peso', 'lbs1'],
      ['draft_age', 'Idade no Draft', 'decimal2'],
    ],
  },
].map(group => ({
  ...group,
  columns: group.columns.map(([key, label, format]) => ({ key, label, format })),
}))

export const STAT_TOOLTIPS = {
  ts: 'True Shooting %: eficiência de pontuação considerando 2P, 3P e lances livres.',
  efg: 'Effective FG%: ajusta o valor dos arremessos de 3 pontos em relação aos de 2.',
  bpm: 'Box Plus/Minus: estimativa de impacto por 100 posses baseada no box score.',
  obpm: 'Offensive Box Plus/Minus: componente ofensivo do BPM.',
  dbpm: 'Defensive Box Plus/Minus: componente defensivo do BPM.',
  bpm_plus: 'BPM ajustado pela força da conferência.',
  obpm_plus: 'OBPM ajustado pela força da conferência.',
  dbpm_plus: 'DBPM ajustado pela força da conferência.',
  he_rapm_total: 'Regularized Adjusted Plus/Minus hipotético total (off + def).',
  he_rapm_off_adj_ppp: 'Pontos ofensivos adicionados por 100 posses (RAPM ofensivo).',
  he_rapm_def_adj_ppp: 'Pontos defensivos evitados por 100 posses (RAPM defensivo).',
  he_rapm_def_2p: 'Impacto defensivo em arremessos de 2 pontos adversários.',
  he_rapm_def_orb: 'Impacto defensivo em rebote ofensivo adversário.',
  he_rapm_def_ftr: 'Impacto defensivo na taxa de lances livres adversária.',
  usg: 'Usage Rate: % das posses da equipe usadas pelo jogador enquanto em quadra.',
  box_creation: 'Estimativa de posses criadas para si ou para colegas via drible/penetração.',
  college_rts: 'Relative True Shooting: TS% do jogador relativa à baseline da sua conferência.',
  high_major_ts_baseline: 'TS% médio esperado para um jogador na mesma conferência, usado como baseline para o College RTS.',
  morey_rate: '% de arremessos que são do tipo "Morey" (rim, 3P ou lance livre).',
  ctov: 'Turnover controlado pelo uso — isola o TOV% do efeito do USG%.',
  '3pr': 'Three-Point Rate: proporção de tentativas de campo que são de 3 pontos.',
  ftr: 'Free Throw Rate: FTA por tentativa de campo — mede agressividade até o garrafão.',
  pfr: 'Personal Foul Rate: faltas sofridas por 40 minutos.',
  stk_to_foul: 'Steals + Blocks por falta cometida — razão impacto defensivo / custo defensivo.',
  rim_non_rim: 'Razão entre makes no rim e makes fora do rim.',
  ast_to_usg: 'Equilíbrio entre criação para colegas (ast_pct) e uso pessoal (usg%).',
  offensive_load: 'Carga ofensiva total: combina USG% e criação de posses para colegas.',
  ua_rimmakes_100: 'Unassisted rim makes por 100 posses — rim makes criados pelo próprio jogador.',
  ua_threes_100: 'Unassisted 3-pointers por 100 posses.',
  prpg: 'Points + Rebounds (ofensivos) por jogo — proxy de impacto ofensivo.',
  d_prpg: 'Points + Rebounds (defensivos) por jogo.',
  rim_assisted_pct: '% dos makes no rim que vieram de assistências.',
  threes_assisted_pct: '% dos makes de 3 pontos que vieram de assistências.',
  assisted_pct: '% geral dos field goals do jogador que vieram de assistências.',
  fc_per_40: 'Faltas cometidas por 40 minutos.',
}

export const LOWER_IS_BETTER_KEYS = new Set(['drtg', 'topg', 'to_pct', 'tov_100', 'fc_per_40'])

export const draftballrPlayers = Array.isArray(rawDraftballrApi?.[0]?.data) ? rawDraftballrApi[0].data : []

export function normalizeDraftballrKey(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function coerceStatValue(value) {
  if (value === null || value === undefined || value === '') return null
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  const numeric = Number(String(value).replace('%', '').trim())
  return Number.isFinite(numeric) ? numeric : null
}

export function formatStat(value, format = 'decimal1') {
  if (value === null || value === undefined || value === '') return '—'
  if (format === 'string') return String(value || '—')
  const numeric = coerceStatValue(value)
  if (numeric === null) return '—'
  if (format === 'integer') return Math.round(numeric).toLocaleString('pt-BR')
  if (format === 'decimal2') return numeric.toFixed(2)
  if (format === 'decimal3') return numeric.toFixed(3)
  if (format === 'decimal4') return numeric.toFixed(4)
  if (format === 'percent1') return `${numeric.toFixed(1)}%`
  if (format === 'percent2') return `${numeric.toFixed(2)}%`
  if (format === 'inches2') return `${numeric.toFixed(2)} in`
  if (format === 'lbs1') return `${numeric.toFixed(1)} lbs`
  return numeric.toFixed(1)
}

export const formatDraftballrValue = formatStat

export function getColumnValue(row, column) {
  return column.format === 'string' ? row?.[column.key] ?? null : coerceStatValue(row?.[column.key])
}

export function getPercentile(row, key) {
  const value = coerceStatValue(row?.percentiles?.[key])
  if (value === null) return null
  return Math.max(0, Math.min(100, value))
}

export function getDraftballrPlayerBySlug(slug) {
  const normalized = normalizeDraftballrKey(slug)
  return draftballrPlayers.find(row => normalizeDraftballrKey(row.player_slug || row.player) === normalized)
}

export function getDraftballrPlayerForProspect(prospect) {
  if (!prospect) return null
  const keys = [prospect.player_slug, prospect.slug, prospect.id, prospect.name].filter(Boolean).map(normalizeDraftballrKey)
  return draftballrPlayers.find(row => {
    const rowKeys = [row.player_slug, row.player].filter(Boolean).map(normalizeDraftballrKey)
    return rowKeys.some(key => keys.includes(key))
  }) || null
}

export function buildVisibleThresholds(rows, columns) {
  return columns.reduce((acc, column) => {
    if (column.format === 'string') return acc
    const values = rows
      .map(row => getColumnValue(row, column))
      .filter(value => typeof value === 'number')
      .sort((a, b) => a - b)
    if (values.length < 5) return acc
    acc[column.key] = {
      low: values[Math.floor((values.length - 1) * 0.1)],
      high: values[Math.ceil((values.length - 1) * 0.9)],
      lowerIsBetter: LOWER_IS_BETTER_KEYS.has(column.key),
    }
    return acc
  }, {})
}

export function compareDraftballrRows(a, b, column, direction = 'asc') {
  const av = getColumnValue(a, column)
  const bv = getColumnValue(b, column)
  const aNull = av === null || av === undefined || av === ''
  const bNull = bv === null || bv === undefined || bv === ''
  if (aNull && bNull) return Number(a.big_board_rank || 999) - Number(b.big_board_rank || 999)
  if (aNull) return 1
  if (bNull) return -1

  const modifier = direction === 'asc' ? 1 : -1
  if (column.format === 'string') return String(av).localeCompare(String(bv)) * modifier
  return (Number(av) - Number(bv)) * modifier
}
