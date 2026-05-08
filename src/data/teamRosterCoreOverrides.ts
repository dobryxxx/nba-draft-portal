export type TeamRosterCoreOverride = {
  teamId: string;
  forceCore?: string[];
  injuredCore?: string[];
  forceRotation?: string[];
  ignoreAsCore?: string[];
  notes?: string;
};

export const teamRosterCoreOverrides: Record<string, TeamRosterCoreOverride> = {
  IND: {
    teamId: 'IND',
    forceCore: ['Tyrese Haliburton', 'Pascal Siakam'],
    injuredCore: ['Tyrese Haliburton'],
    notes: 'Haliburton e Siakam devem ser tratados como pecas de alto uso. O draft deve priorizar encaixe ao redor deles, exceto no top-4, onde BPA prevalece.',
  },
  BOS: {
    teamId: 'BOS',
    forceCore: ['Jayson Tatum', 'Jaylen Brown', 'Derrick White'],
    injuredCore: ['Jayson Tatum'],
    notes: 'Tatum deve ser considerado peca primaria da franquia independentemente da amostra da temporada.',
  },
  MEM: {
    teamId: 'MEM',
    forceCore: ['Zach Edey', 'Cedric Coward', 'Jaylen Wells'],
    injuredCore: ['Zach Edey'],
    ignoreAsCore: ['Ja Morant', 'Jaren Jackson Jr.'],
    notes: 'Ja Morant e Jaren Jackson Jr. devem ser desconsiderados do core. O planejamento deve partir de Zach Edey, Cedric Coward e Jaylen Wells.',
  },
  WAS: {
    teamId: 'WAS',
    forceCore: ['Trae Young', 'Anthony Davis'],
    notes: 'Trae Young e Anthony Davis devem ser tratados como novo eixo competitivo/contextual do elenco.',
  },
  DAL: {
    teamId: 'DAL',
    forceCore: ['Cooper Flagg'],
    notes: 'Cooper Flagg deve ser tratado como futuro franchise player. O draft deve buscar encaixe com ele, especialmente armador principal.',
  },
};

const normalizeName = (name: string) =>
  String(name || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\./g, '')
    .replace(/\s+jr$/i, ' jr')
    .trim()
    .toLowerCase();

export function getTeamRosterCoreOverride(teamId: string): TeamRosterCoreOverride | undefined {
  return teamRosterCoreOverrides[String(teamId || '').toUpperCase()];
}

export function isForcedCorePlayer(teamId: string, playerName: string): boolean {
  const override = getTeamRosterCoreOverride(teamId);
  return Boolean(override?.forceCore?.some((name) => normalizeName(name) === normalizeName(playerName)));
}

export function isInjuredCorePlayer(teamId: string, playerName: string): boolean {
  const override = getTeamRosterCoreOverride(teamId);
  return Boolean(override?.injuredCore?.some((name) => normalizeName(name) === normalizeName(playerName)));
}

export function isForcedRotationPlayer(teamId: string, playerName: string): boolean {
  const override = getTeamRosterCoreOverride(teamId);
  return Boolean(override?.forceRotation?.some((name) => normalizeName(name) === normalizeName(playerName)));
}

export function isIgnoredAsCorePlayer(teamId: string, playerName: string): boolean {
  const override = getTeamRosterCoreOverride(teamId);
  return Boolean(override?.ignoreAsCore?.some((name) => normalizeName(name) === normalizeName(playerName)));
}
