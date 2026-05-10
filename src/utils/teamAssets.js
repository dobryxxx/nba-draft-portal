const LOGO_FILES = {
  ATL: 'atlanta-hawks.png',
  BOS: 'boston-celtics.png',
  BKN: 'brooklyn-nets.png',
  CHA: 'charlotte-hornets.png',
  CHI: 'chicago-bulls.png',
  CLE: 'cleveland-cavaliers.png',
  DAL: 'dallas-mavericks.png',
  DEN: 'denver-nuggets.png',
  DET: 'detroit-pistons.png',
  GSW: 'golden-state-warriors.png',
  HOU: 'houston-rockets.png',
  IND: 'indiana-pacers.png',
  LAC: 'los-angeles-clippers.png',
  LAL: 'los-angeles-lakers.png',
  MEM: 'memphis-grizzlies.png',
  MIA: 'miami-heat.png',
  MIL: 'milwaukee-bucks.png',
  MIN: 'minnesota-timberwolves.png',
  NOP: 'new-orleans-pelicans.png',
  NYK: 'new-york-knicks.png',
  OKC: 'oklahoma-city-thunder.png',
  ORL: 'orlando-magic.png',
  PHI: 'philadelphia-76ers.png',
  PHX: 'phoenix-suns.png',
  POR: 'portland-trail-blazers.png',
  SAC: 'sacramento-kings.png',
  SAS: 'san-antonio-spurs.png',
  TOR: 'toronto-raptors.png',
  UTA: 'utah-jazz.png',
  WAS: 'washington-wizards.png',
}

const TEAM_COLORS = {
  ATL: { primary: '#C8102E', secondary: '#FDB927' },
  BOS: { primary: '#007A33', secondary: '#BA9653' },
  BKN: { primary: '#111111', secondary: '#A7A8AA' },
  CHA: { primary: '#1D1160', secondary: '#00788C' },
  CHI: { primary: '#CE1141', secondary: '#111111' },
  CLE: { primary: '#6F263D', secondary: '#FFB81C' },
  DAL: { primary: '#00538C', secondary: '#B8C4CA' },
  DEN: { primary: '#0E2240', secondary: '#FEC524' },
  DET: { primary: '#C8102E', secondary: '#1D42BA' },
  GSW: { primary: '#1D428A', secondary: '#FFC72C' },
  HOU: { primary: '#CE1141', secondary: '#C4CED4' },
  IND: { primary: '#002D62', secondary: '#FDBB30' },
  LAC: { primary: '#C8102E', secondary: '#1D428A' },
  LAL: { primary: '#552583', secondary: '#FDB927' },
  MEM: { primary: '#5D76A9', secondary: '#12173F' },
  MIA: { primary: '#98002E', secondary: '#F9A01B' },
  MIL: { primary: '#00471B', secondary: '#EEE1C6' },
  MIN: { primary: '#0C2340', secondary: '#78BE20' },
  NOP: { primary: '#0C2340', secondary: '#C8102E' },
  NYK: { primary: '#006BB6', secondary: '#F58426' },
  OKC: { primary: '#007AC1', secondary: '#EF3B24' },
  ORL: { primary: '#0077C0', secondary: '#C4CED4' },
  PHI: { primary: '#006BB6', secondary: '#ED174C' },
  PHX: { primary: '#1D1160', secondary: '#E56020' },
  POR: { primary: '#E03A3E', secondary: '#111111' },
  SAC: { primary: '#5A2D81', secondary: '#63727A' },
  SAS: { primary: '#111111', secondary: '#C4CED4' },
  TOR: { primary: '#CE1141', secondary: '#111111' },
  UTA: { primary: '#002B5C', secondary: '#F9A01B' },
  WAS: { primary: '#002B5C', secondary: '#E31837' },
}

export function getTeamLogo(teamId) {
  const file = LOGO_FILES[String(teamId || '').toUpperCase()]
  return file ? '/team-logos/' + file : null
}

export function getTeamColors(teamId) {
  const colors = TEAM_COLORS[String(teamId || '').toUpperCase()] || { primary: '#7c5ccf', secondary: '#5aaed6' }
  return { ...colors, glow: colors.primary + '33' }
}

export function getTeamVisualStyle(teamId) {
  const colors = getTeamColors(teamId)
  return {
    ...colors,
    background: 'radial-gradient(circle at 50% 0%, ' + colors.primary + '20, transparent 42%), rgba(255,255,255,.34)',
    borderColor: colors.primary + '26',
    boxShadow: '0 18px 48px ' + colors.primary + '14',
  }
}
