import { nbaRosterPlayers, nbaTeamLineups } from '../data/nbaRosterContextData.ts'
import type { TeamDraftIntelligence } from '../data/teamDraftIntelligence.ts'
import {
  getTeamRosterCoreOverride,
  isForcedCorePlayer,
  isForcedRotationPlayer,
  isIgnoredAsCorePlayer,
  isInjuredCorePlayer,
} from '../data/teamRosterCoreOverrides.ts'

export type RosterPlayerProfile = {
  id: string;
  name: string;
  team: string;
  position: string;
  height?: string;
  weight?: string;
  minutes: number;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  threePointPct?: number;
  tsPct?: number;
  usagePct?: number;
  offRtg?: number;
  defRtg?: number;
  netRtg?: number;
  roleTags: string[];
};

export type RosterContext = {
  teamId: string;
  corePlayers: RosterPlayerProfile[];
  rotationPlayers: RosterPlayerProfile[];

  creators: RosterPlayerProfile[];
  shooters: RosterPlayerProfile[];
  defenders: RosterPlayerProfile[];
  bigs: RosterPlayerProfile[];
  wings: RosterPlayerProfile[];
  guards: RosterPlayerProfile[];

  rosterStrengths: string[];
  rosterWeaknesses: string[];
  availableRoles: string[];
  roleCongestion: string[];

  scores: {
    creationNeedFromRoster: number;
    shootingNeedFromRoster: number;
    defenseNeedFromRoster: number;
    sizeNeedFromRoster: number;
    rimProtectionNeedFromRoster: number;
    reboundingNeedFromRoster: number;
    benchScoringNeedFromRoster: number;
    roleAvailability: number;
    overlapRisk: number;
  };

  notes: {
    rosterSummary: string;
    coreFitContext: string;
    rotationPath: string;
    overlapRisk: string;
  };
};

export type ProspectRosterFit = {
  rosterFitScore: number;
  roleAvailability: number;
  overlapRisk: number;
  complementaryFit: number;
  coreFit: number;
  positives: string[];
  warnings: string[];
  notes: {
    rotationPath: string;
    coreFit: string;
    overlap: string;
  };
};

export type ShootingProfile = {
  score: number;
  label: 'elite' | 'strong' | 'solid' | 'questionable' | 'non-shooter';
  confidence: 'high' | 'medium' | 'low';
  indicators: string[];
  warnings: string[];
};

type RawRosterPlayer = Record<string, any>;

const TEAM_ALIASES: Record<string, string> = {
  BRK: 'BKN',
  BKN: 'BKN',
  PHO: 'PHX',
  PHX: 'PHX',
  GSW: 'GSW',
  GS: 'GSW',
  SAS: 'SAS',
  SA: 'SAS',
  NOP: 'NOP',
  NO: 'NOP',
  NY: 'NYK',
  NYK: 'NYK',
  UTA: 'UTA',
  UTH: 'UTA',
  WAS: 'WAS',
  WSH: 'WAS',
};

const MUST_DRAFT_PROSPECTS = ['aj dybantsa', 'cameron boozer', 'darryn peterson'];

export function normalizeTeamId(teamId: string): string {
  const normalized = String(teamId || '').trim().toUpperCase();
  return TEAM_ALIASES[normalized] || normalized;
}

const clamp = (value: number, min = 0, max = 100) => {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
};

const round = (value: number) => Math.round(clamp(value));

const safeNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const average = (values: number[], fallback = 50) => {
  const valid = values.filter(Number.isFinite);
  return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : fallback;
};

const normalizePlayerName = (name: string) =>
  String(name || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\./g, '')
    .trim()
    .toLowerCase();

const isMustDraftProspect = (player: any) => MUST_DRAFT_PROSPECTS.includes(normalizePlayerName(player?.name));

const allPlayers = (): RawRosterPlayer[] => [...nbaRosterPlayers] as RawRosterPlayer[];
const allLineups = (teamId: string): any[] => (nbaTeamLineups as any)?.[normalizeTeamId(teamId)] || [];

const parseHeightInches = (height: unknown) => {
  const text = String(height || '');
  const match = text.match(/(\d+)[-'](\d+)/);
  if (!match) return 0;
  return Number(match[1]) * 12 + Number(match[2]);
};

function getLineupBoost(profile: RosterPlayerProfile, lineupNames: Map<string, number>) {
  const normalizedName = normalizePlayerName(profile.name);
  const lastName = normalizedName.split(/\s+/).slice(-1)[0];
  let minutes = 0;
  lineupNames.forEach((value, name) => {
    const normalizedLineupName = normalizePlayerName(name);
    if (normalizedLineupName === normalizedName || (lastName && normalizedLineupName.endsWith(lastName))) {
      minutes += value;
    }
  });
  return minutes;
}

const isGuardPosition = (position: string) => /guard|pg|sg/i.test(position);
const isForwardPosition = (position: string) => /forward|sf|pf|wing/i.test(position);
const isCenterPosition = (position: string) => /center|c/i.test(position);

export function getPlayersByTeam(teamId: string): RawRosterPlayer[] {
  const normalized = normalizeTeamId(teamId);
  return allPlayers().filter((player) => normalizeTeamId(player.team) === normalized);
}

function getAnyPlayerByName(name: string): RawRosterPlayer | undefined {
  const normalized = normalizePlayerName(name);
  return allPlayers().find((player) => normalizePlayerName(player.name) === normalized);
}

function getVirtualCorePlayer(teamId: string, playerName: string): RawRosterPlayer {
  const known = getAnyPlayerByName(playerName);
  if (known) return { ...known, team: normalizeTeamId(teamId), contextual_override: true };

  const normalized = normalizePlayerName(playerName);
  const roleDefaults: Record<string, Partial<RawRosterPlayer>> = {
    'tyrese haliburton': {
      position: 'Guard',
      height: '6-5',
      weight: '185',
      per_game: { pts: 18, reb: 4, ast: 9.5, stl: 1.2, blk: 0.5, fg3_pct: 38, min: 32, tov: 2.3 },
      advanced: { ts_pct: 60, usg_pct: 28, off_rtg: 120, def_rtg: 114, net_rtg: 6 },
      scoring_profile: { pts_created: 12, pts_assisted_val: 8, pts_total_pg: 18 },
    },
    'jayson tatum': {
      position: 'Forward-Guard',
      height: '6-8',
      weight: '210',
      per_game: { pts: 25, reb: 8, ast: 4.8, stl: 1.1, blk: 0.5, fg3_pct: 36, min: 34, tov: 2.6 },
      advanced: { ts_pct: 58, usg_pct: 29, off_rtg: 119, def_rtg: 111, net_rtg: 8 },
      scoring_profile: { pts_created: 10, pts_assisted_val: 9, pts_total_pg: 25 },
    },
    'zach edey': {
      position: 'Center',
      height: '7-4',
      weight: '305',
      per_game: { pts: 12, reb: 8, ast: 1.4, stl: 0.4, blk: 1.4, fg3_pct: 0, min: 24, tov: 1.8 },
      advanced: { ts_pct: 62, usg_pct: 20, off_rtg: 116, def_rtg: 112, net_rtg: 3 },
      scoring_profile: { pts_created: 2, pts_assisted_val: 7, pts_putbacks: 2.3, pts_total_pg: 12 },
    },
  };

  const defaults = roleDefaults[normalized] || {};
  return {
    id: `override-${normalizeTeamId(teamId)}-${normalized.replace(/\s+/g, '-')}`,
    name: playerName,
    team: normalizeTeamId(teamId),
    position: defaults.position || 'Forward',
    height: defaults.height || '6-7',
    weight: defaults.weight || '215',
    games_played: 0,
    contextual_override: true,
    per_game: defaults.per_game || { pts: 10, reb: 4, ast: 2, stl: 0.7, blk: 0.4, fg3_pct: 34, min: 24, tov: 1.3 },
    advanced: defaults.advanced || { ts_pct: 55, usg_pct: 20, off_rtg: 112, def_rtg: 114, net_rtg: 0 },
    scoring_profile: defaults.scoring_profile || { pts_created: 3, pts_assisted_val: 4, pts_total_pg: 10 },
  };
}

function getTeamPlayersWithOverrides(teamId: string): RawRosterPlayer[] {
  const normalized = normalizeTeamId(teamId);
  const override = getTeamRosterCoreOverride(normalized);
  const base = getPlayersByTeam(normalized);
  const names = new Set(base.map((player) => normalizePlayerName(player.name)));
  const forced = [...(override?.forceCore || []), ...(override?.forceRotation || [])];
  const additions = forced
    .filter((name) => !names.has(normalizePlayerName(name)))
    .map((name) => getVirtualCorePlayer(normalized, name));
  return [...base, ...additions];
}

export function classifyRosterPlayer(player: RawRosterPlayer): string[] {
  const perGame = player.per_game || {};
  const advanced = player.advanced || {};
  const scoring = player.scoring_profile || {};
  const position = String(player.position || '');
  const height = parseHeightInches(player.height);
  const tags = new Set<string>();
  const minutes = safeNumber(perGame.min);
  const points = safeNumber(perGame.pts);
  const assists = safeNumber(perGame.ast);
  const rebounds = safeNumber(perGame.reb);
  const steals = safeNumber(perGame.stl);
  const blocks = safeNumber(perGame.blk);
  const threePointPct = safeNumber(perGame.fg3_pct);
  const usagePct = safeNumber(advanced.usg_pct);
  const tsPct = safeNumber(advanced.ts_pct);
  const netRtg = safeNumber(advanced.net_rtg);
  const ptsCreated = safeNumber(scoring.pts_created);

  if (assists >= 6 || (usagePct >= 27 && assists >= 4.5)) tags.add('primary creator');
  if (assists >= 3.5 || ptsCreated >= 5) tags.add('secondary creator');
  if (threePointPct >= 38 && minutes >= 16) tags.add('movement shooter');
  if (threePointPct >= 36 && minutes >= 14) tags.add('spot-up shooter');
  if ((blocks >= 1.1 || height >= 83) && isCenterPosition(position)) tags.add('rim protector');
  if ((steals >= 1.1 || netRtg >= 4) && isGuardPosition(position)) tags.add('point-of-attack defender');
  if ((steals >= 1 || blocks >= 0.6 || height >= 80) && isForwardPosition(position)) tags.add('wing defender');
  if (assists >= 2.5 && usagePct < 22 && tsPct >= 56) tags.add('connector');
  if (rebounds >= 6.5) tags.add('rebounder');
  if (points >= 11 && minutes < 26) tags.add('bench scorer');
  if (points >= 18 || usagePct >= 27) tags.add('high-usage scorer');
  if (minutes >= 14 && usagePct <= 17) tags.add('low-usage role player');
  if (isCenterPosition(position) && threePointPct >= 34) tags.add('stretch big');
  if (threePointPct > 0 && threePointPct < 31 && !isCenterPosition(position)) tags.add('non-shooter');
  if (safeNumber(advanced.def_rtg) >= 118 || netRtg <= -8) tags.add('defensive liability');
  if (isGuardPosition(position) && height > 0 && height <= 74) tags.add('small guard');
  if (isForwardPosition(position) && height >= 79) tags.add('big wing');
  if (player.contextual_override) tags.add('contextual core');

  return Array.from(tags);
}

export function buildRosterPlayerProfile(player: RawRosterPlayer): RosterPlayerProfile {
  const perGame = player.per_game || {};
  const advanced = player.advanced || {};
  return {
    id: String(player.id || player.name),
    name: String(player.name || 'Unknown Player'),
    team: normalizeTeamId(player.team),
    position: String(player.position || ''),
    height: player.height,
    weight: player.weight,
    minutes: safeNumber(perGame.min),
    points: safeNumber(perGame.pts),
    rebounds: safeNumber(perGame.reb),
    assists: safeNumber(perGame.ast),
    steals: safeNumber(perGame.stl),
    blocks: safeNumber(perGame.blk),
    threePointPct: safeNumber(perGame.fg3_pct),
    tsPct: safeNumber(advanced.ts_pct),
    usagePct: safeNumber(advanced.usg_pct),
    offRtg: safeNumber(advanced.off_rtg),
    defRtg: safeNumber(advanced.def_rtg),
    netRtg: safeNumber(advanced.net_rtg),
    roleTags: [
      ...classifyRosterPlayer(player),
      ...(isInjuredCorePlayer(player.team, player.name) ? ['injured core'] : []),
    ],
  };
}

const playerImportanceScore = (player: RosterPlayerProfile) =>
  player.minutes * 1.8 +
  player.points * 1.6 +
  player.assists * 4 +
  player.rebounds * 1.4 +
  (player.usagePct || 0) * 0.8 +
  Math.max(-8, player.netRtg || 0) * 0.8;

export function getTeamCorePlayers(teamId: string): RosterPlayerProfile[] {
  const normalized = normalizeTeamId(teamId);
  const lineupNames = getRelevantLineupNames(normalized);
  return getTeamPlayersWithOverrides(normalized)
    .map(buildRosterPlayerProfile)
    .filter((player) => !isIgnoredAsCorePlayer(normalized, player.name))
    .filter((player) =>
      isForcedCorePlayer(normalized, player.name) ||
      player.minutes >= 18 ||
      player.points >= 10 ||
      player.assists >= 4 ||
      player.rebounds >= 7 ||
      getLineupBoost(player, lineupNames) >= 240
    )
    .sort((a, b) =>
      (isForcedCorePlayer(normalized, b.name) ? 1000 : 0) + playerImportanceScore(b) + getLineupBoost(b, lineupNames) * 0.08 -
      ((isForcedCorePlayer(normalized, a.name) ? 1000 : 0) + playerImportanceScore(a) + getLineupBoost(a, lineupNames) * 0.08)
    )
    .slice(0, 6);
}

const hasTag = (player: RosterPlayerProfile, tags: string[]) =>
  tags.some((tag) => player.roleTags.includes(tag));

const names = (players: RosterPlayerProfile[], limit = 3) =>
  players.slice(0, limit).map((player) => player.name).join(', ');

const scoreNeedFromCount = (count: number, ideal: number) => round(100 - Math.min(100, (count / ideal) * 100));

function getRelevantLineupNames(teamId: string) {
  const lineups = allLineups(teamId).filter((lineup) => safeNumber(lineup.minutes) >= 120);
  const playerCounts = new Map<string, number>();
  for (const lineup of lineups) {
    String(lineup.lineup || '').split(' - ').forEach((name) => {
      playerCounts.set(name, (playerCounts.get(name) || 0) + safeNumber(lineup.minutes));
    });
  }
  return playerCounts;
}

function buildNeutralRosterContext(teamId: string): RosterContext {
  return {
    teamId: normalizeTeamId(teamId),
    corePlayers: [],
    rotationPlayers: [],
    creators: [],
    shooters: [],
    defenders: [],
    bigs: [],
    wings: [],
    guards: [],
    rosterStrengths: [],
    rosterWeaknesses: ['Dados de elenco insuficientes para conclusão forte.'],
    availableRoles: ['Papel em avaliação'],
    roleCongestion: [],
    scores: {
      creationNeedFromRoster: 55,
      shootingNeedFromRoster: 55,
      defenseNeedFromRoster: 55,
      sizeNeedFromRoster: 55,
      rimProtectionNeedFromRoster: 55,
      reboundingNeedFromRoster: 55,
      benchScoringNeedFromRoster: 55,
      roleAvailability: 55,
      overlapRisk: 45,
    },
    notes: {
      rosterSummary: 'Contexto de elenco neutro por falta de dados confiáveis.',
      coreFitContext: 'Sem núcleo confirmado suficiente para avaliar encaixe com alta confiança.',
      rotationPath: 'Caminho de minutos depende de avaliação manual do elenco.',
      overlapRisk: 'Risco de sobreposição tratado como neutro.',
    },
  };
}

export function analyzeRosterContext(teamId: string): RosterContext {
  const normalized = normalizeTeamId(teamId);
  const profiles = getTeamPlayersWithOverrides(normalized).map(buildRosterPlayerProfile);
  if (!profiles.length) return buildNeutralRosterContext(normalized);

  const lineupNames = getRelevantLineupNames(normalized);
  const rotationPlayers = profiles
    .filter((player) =>
      isForcedCorePlayer(normalized, player.name) ||
      isForcedRotationPlayer(normalized, player.name) ||
      player.minutes >= 12 ||
      player.points >= 7 ||
      getLineupBoost(player, lineupNames) >= 120 ||
      lineupNames.size === 0
    )
    .sort((a, b) =>
      (isForcedCorePlayer(normalized, b.name) ? 500 : 0) + playerImportanceScore(b) + getLineupBoost(b, lineupNames) * 0.06 -
      ((isForcedCorePlayer(normalized, a.name) ? 500 : 0) + playerImportanceScore(a) + getLineupBoost(a, lineupNames) * 0.06)
    )
    .slice(0, 12);
  const corePlayers = getTeamCorePlayers(normalized);

  const creators = rotationPlayers.filter((player) => hasTag(player, ['primary creator', 'secondary creator', 'high-usage scorer']));
  const shooters = rotationPlayers.filter((player) => hasTag(player, ['movement shooter', 'spot-up shooter', 'stretch big']));
  const defenders = rotationPlayers.filter((player) => hasTag(player, ['point-of-attack defender', 'wing defender', 'rim protector']));
  const bigs = rotationPlayers.filter((player) => isCenterPosition(player.position) || hasTag(player, ['rim protector', 'stretch big']));
  const wings = rotationPlayers.filter((player) => isForwardPosition(player.position) || hasTag(player, ['wing defender', 'big wing']));
  const guards = rotationPlayers.filter((player) => isGuardPosition(player.position) || hasTag(player, ['primary creator', 'small guard']));
  const rimProtectors = rotationPlayers.filter((player) => hasTag(player, ['rim protector']));
  const rebounders = rotationPlayers.filter((player) => hasTag(player, ['rebounder']));
  const benchScorers = rotationPlayers.filter((player) => player.minutes < 27 && (player.points >= 10 || hasTag(player, ['bench scorer'])));

  const scores = {
    creationNeedFromRoster: scoreNeedFromCount(creators.filter((player) => player.assists >= 4 || (player.usagePct || 0) >= 25).length, 3),
    shootingNeedFromRoster: scoreNeedFromCount(shooters.length, 5),
    defenseNeedFromRoster: scoreNeedFromCount(defenders.length, 5),
    sizeNeedFromRoster: scoreNeedFromCount(wings.length + bigs.length, 7),
    rimProtectionNeedFromRoster: scoreNeedFromCount(rimProtectors.length, 2),
    reboundingNeedFromRoster: scoreNeedFromCount(rebounders.length, 3),
    benchScoringNeedFromRoster: scoreNeedFromCount(benchScorers.length, 4),
    roleAvailability: 55,
    overlapRisk: 45,
  };

  const rosterStrengths = [
    creators.length >= 4 ? `Criação já estabelecida com ${names(creators)}.` : '',
    shooters.length >= 5 ? `Boa base de spacing com ${names(shooters)}.` : '',
    defenders.length >= 5 ? `Volume defensivo sólido na rotação.` : '',
    bigs.length >= 3 ? `Profundidade funcional de frontcourt.` : '',
  ].filter(Boolean);

  const rosterWeaknesses = [
    scores.creationNeedFromRoster >= 65 ? 'Poucos criadores confiáveis na rotação.' : '',
    scores.shootingNeedFromRoster >= 65 ? 'Spacing de rotação ainda limitado.' : '',
    scores.defenseNeedFromRoster >= 65 ? 'Faltam defensores confiáveis para sustentar lineups.' : '',
    scores.sizeNeedFromRoster >= 65 ? 'Elenco precisa de mais tamanho funcional.' : '',
    scores.rimProtectionNeedFromRoster >= 65 ? 'Proteção de aro não aparece como força clara.' : '',
    scores.benchScoringNeedFromRoster >= 65 ? 'Pontuação reserva depende demais do core.' : '',
  ].filter(Boolean);

  const availableRoles = [
    scores.creationNeedFromRoster >= 60 ? 'Criador de rotação' : '',
    scores.shootingNeedFromRoster >= 60 ? 'Spacer/arremessador complementar' : '',
    scores.defenseNeedFromRoster >= 60 ? 'Defensor de ponto de ataque ou ala' : '',
    scores.rimProtectionNeedFromRoster >= 60 ? 'Protetor de aro reserva' : '',
    scores.benchScoringNeedFromRoster >= 60 ? 'Pontuador de segunda unidade' : '',
  ].filter(Boolean);

  const roleCongestion = [
    creators.length >= 5 ? 'Muitos criadores/handlers já ocupam uso relevante.' : '',
    guards.length >= 6 ? 'Backcourt congestionado.' : '',
    bigs.length >= 4 ? 'Frontcourt com muitos minutos disputados.' : '',
    shooters.length >= 6 ? 'Função de spot-up shooter já tem concorrência.' : '',
  ].filter(Boolean);

  return {
    teamId: normalized,
    corePlayers,
    rotationPlayers,
    creators,
    shooters,
    defenders,
    bigs,
    wings,
    guards,
    rosterStrengths: rosterStrengths.length ? rosterStrengths : ['Elenco sem força estrutural dominante nos dados.'],
    rosterWeaknesses: rosterWeaknesses.length ? rosterWeaknesses : ['Lacunas principais são mais contextuais do que estatísticas.'],
    availableRoles: availableRoles.length ? availableRoles : ['Papel depende mais de board value do que de lacuna óbvia.'],
    roleCongestion,
    scores,
    notes: {
      rosterSummary: `${normalized} tem núcleo em ${names(corePlayers, 4) || 'avaliação'}, com ${rotationPlayers.length} jogadores de rotação relevantes.`,
      coreFitContext: corePlayers.length ? `O encaixe deve ser avaliado ao redor de ${names(corePlayers, 3)}.` : 'Núcleo principal indefinido nos dados.',
      rotationPath: availableRoles.length ? `Caminho mais limpo: ${availableRoles.slice(0, 2).join(' / ')}.` : 'Caminho de minutos exige superar concorrência interna.',
      overlapRisk: roleCongestion.length ? roleCongestion.slice(0, 2).join(' ') : 'Sem congestionamento forte detectado para uma função específica.',
    },
  };
}

function prospectText(player: any) {
  return [
    player?.name,
    player?.position,
    player?.tier,
    player?.archetype,
    player?.projectedRole,
    player?.scouting?.notes,
    ...(player?.scouting?.strengths || []),
    ...(player?.scouting?.weaknesses || []),
  ].join(' ').toLowerCase();
}

export function evaluateShootingProfile(player: any): ShootingProfile {
  const stats = player?.stats || {};
  const perGame = player?.per_game || {};
  const advanced = player?.advanced || {};
  const shotZones = player?.shot_zones || {};
  const text = prospectText(player);
  const threePointPct = safeNumber(stats.threep ?? stats.three_pct ?? perGame.fg3_pct);
  const attempts = safeNumber(stats.threepa ?? stats.fg3a ?? perGame.fg3a);
  const ftPct = safeNumber(stats.ftp ?? stats.ft_pct ?? perGame.ft_pct);
  const tsPct = safeNumber(stats.ts ?? stats.ts_pct ?? advanced.ts_pct);
  const minutes = safeNumber(stats.min ?? perGame.min);
  const games = safeNumber(player?.games_played ?? stats.games);
  const cornerThree = safeNumber(shotZones.corner_3?.pct ?? shotZones.corner3?.pct ?? shotZones.corner_3);
  const arcThree = safeNumber(shotZones.arc_3?.pct ?? shotZones.arc3?.pct ?? shotZones.arc_3);
  const indicators: string[] = [];
  const warnings: string[] = [];

  const hasShootingKeyword = /shoot|spacing|spacer|shotmaking|catch-and-shoot|arremesso|perimetral|3 pontos/i.test(text);
  const volumeScore = attempts >= 5 ? 24 : attempts >= 3 ? 16 : attempts >= 1.5 ? 8 : minutes >= 18 && games >= 20 ? 4 : 0;
  let score = 42 + volumeScore;

  if (threePointPct >= 41) {
    score += 30;
    indicators.push(`${threePointPct.toFixed(1)}% de 3PT`);
  } else if (threePointPct >= 39) {
    score += 26;
    indicators.push(`${threePointPct.toFixed(1)}% de 3PT`);
  } else if (threePointPct >= 36) {
    score += 18;
    indicators.push(`${threePointPct.toFixed(1)}% de 3PT`);
  } else if (threePointPct >= 33) {
    score += 8;
    indicators.push(`${threePointPct.toFixed(1)}% de 3PT funcional`);
  } else if (threePointPct > 0) {
    score -= 16;
    warnings.push(`${threePointPct.toFixed(1)}% de 3PT indica preocupação`);
  }

  if (ftPct >= 82) {
    score += 8;
    indicators.push(`${ftPct.toFixed(1)}% FT sustenta projeção`);
  } else if (ftPct >= 78) {
    score += 5;
    indicators.push('FT% positivo para tradução do arremesso');
  } else if (ftPct > 0 && ftPct < 68) {
    score -= 7;
    warnings.push('FT% reduz confiança no arremesso');
  }

  if (tsPct >= 61) {
    score += 6;
    indicators.push('eficiência geral forte');
  }
  if (cornerThree >= 38 || arcThree >= 36) {
    score += 5;
    indicators.push('shot zones reforçam spacing');
  }
  if (hasShootingKeyword) {
    score += 8;
    indicators.push('scouting cita arremesso/spacing');
  }

  let confidence: ShootingProfile['confidence'] = 'low';
  if (attempts >= 4 || (minutes >= 22 && games >= 35)) confidence = 'high';
  else if (attempts >= 2 || (minutes >= 16 && games >= 20) || hasShootingKeyword) confidence = 'medium';

  if (threePointPct >= 39 && attempts > 0 && attempts < 2) {
    warnings.push('volume baixo limita confiança da projeção');
    confidence = confidence === 'high' ? 'medium' : 'low';
  }

  const finalScore = round(score);
  let label: ShootingProfile['label'] = 'questionable';
  if (finalScore >= 84 && confidence !== 'low') label = 'elite';
  else if (finalScore >= 74) label = 'strong';
  else if (finalScore >= 62) label = 'solid';
  else if (finalScore < 42 && threePointPct < 32) label = 'non-shooter';

  if (threePointPct >= 39 && label === 'questionable') label = confidence === 'low' ? 'solid' : 'strong';
  if (threePointPct >= 36 && label === 'non-shooter') label = 'solid';

  return {
    score: finalScore,
    label,
    confidence,
    indicators: indicators.slice(0, 4),
    warnings: warnings.slice(0, 3),
  };
}

function prospectRoleSignals(player: any) {
  const stats = player?.stats || {};
  const text = prospectText(player);
  const position = String(player?.position || '').toUpperCase();
  const shootingProfile = evaluateShootingProfile(player);
  return {
    creator: (stats.apg || 0) >= 3.5 || (stats.usg || 0) >= 25 || /creator|handler|playmaking|cria/i.test(text),
    shooter: ['elite', 'strong', 'solid'].includes(shootingProfile.label),
    defender: (stats.stlPct || 0) >= 1.8 || (stats.blkPct || 0) >= 2 || /defense|defensor|switch|two-way/i.test(text),
    big: /PF|C/.test(position),
    wing: /SF|PF|W/.test(position),
    guard: /PG|SG|G/.test(position),
    rimProtector: (stats.blkPct || 0) >= 3 || /rim protector|proteção de aro|tocos/i.test(text),
    rebounder: (stats.rpg || 0) >= 7 || /rebound|rebote/i.test(text),
    benchScorer: (stats.ppg || 0) >= 15 || /scorer|pontuador/i.test(text),
    highUsage: (stats.usg || 0) >= 26 || /primary|volume|protagon/i.test(text),
  };
}

export function evaluateProspectRosterFit(player: any, rosterContext: RosterContext): ProspectRosterFit {
  const signals = prospectRoleSignals(player);
  const mustDraft = isMustDraftProspect(player);
  const shootingProfile = evaluateShootingProfile(player);
  const scores = rosterContext.scores;
  const complementaryParts = [
    signals.creator ? scores.creationNeedFromRoster : 45,
    signals.shooter ? scores.shootingNeedFromRoster : 45,
    signals.defender ? scores.defenseNeedFromRoster : 45,
    signals.wing || signals.big ? scores.sizeNeedFromRoster : 45,
    signals.rimProtector ? scores.rimProtectionNeedFromRoster : 45,
    signals.rebounder ? scores.reboundingNeedFromRoster : 45,
    signals.benchScorer ? scores.benchScoringNeedFromRoster : 45,
  ];
  let complementaryFit = round(average(complementaryParts, 50));

  let overlapRisk = 35;
  if (signals.creator && rosterContext.creators.length >= 4) overlapRisk += 22;
  if (signals.guard && rosterContext.guards.length >= 6) overlapRisk += 18;
  if (signals.big && rosterContext.bigs.length >= 4) overlapRisk += 18;
  if (signals.shooter && rosterContext.shooters.length >= 6) overlapRisk += 10;
  if (signals.highUsage && rosterContext.creators.filter((creator) => (creator.usagePct || 0) >= 25).length >= 2) overlapRisk += 18;
  overlapRisk = round(overlapRisk);

  let roleAvailability = round(average([complementaryFit, 100 - overlapRisk, rosterContext.availableRoles.length ? 68 : 50], 55));
  let coreFit = round(average([
    signals.shooter ? 68 : 55,
    signals.defender ? 66 : 55,
    signals.highUsage && rosterContext.creators.length >= 3 ? 42 : 62,
    complementaryFit,
  ], 55));
  if (mustDraft) {
    complementaryFit = Math.max(complementaryFit, 72);
    roleAvailability = Math.max(roleAvailability, 78);
    coreFit = Math.max(coreFit, 74);
    overlapRisk = Math.min(overlapRisk, 58);
  }
  const rosterFitScore = round(roleAvailability * 0.35 + complementaryFit * 0.35 + coreFit * 0.20 + (100 - overlapRisk) * 0.10);

  const positives = [
    signals.shooter && scores.shootingNeedFromRoster >= 55
      ? shootingProfile.confidence === 'low'
        ? 'Ajuda o espaçamento, embora a confiança dependa do volume/amostra.'
        : `Ajuda a endereçar shooting: ${shootingProfile.indicators[0] || 'perfil de espaçador funcional'}.`
      : '',
    complementaryFit >= 65 ? `Complementa lacuna real do elenco: ${rosterContext.availableRoles.slice(0, 2).join(' / ')}.` : '',
    coreFit >= 65 ? `Perfil tende a funcionar ao lado de ${names(rosterContext.corePlayers, 2) || 'núcleo atual'} sem exigir mudança estrutural.` : '',
    mustDraft ? 'Prospecto imperdivel: o contexto deve se adaptar ao talento.' : roleAvailability >= 65 ? 'Caminho de minutos aparece mais claro pela composicao atual da rotacao.' : '',
  ].filter(Boolean).slice(0, 3);

  const warnings = [
    !mustDraft && overlapRisk >= 65 ? 'Ha risco de sobreposicao com funcoes ja ocupadas no elenco.' : '',
    !mustDraft && roleAvailability < 45 ? 'Caminho de minutos inicial parece congestionado.' : '',
    !mustDraft && complementaryFit < 45 && !(signals.shooter && ['elite', 'strong', 'solid'].includes(shootingProfile.label))
      ? 'O prospecto não ataca as lacunas mais evidentes do elenco.'
      : '',
    signals.shooter && shootingProfile.confidence === 'low' ? 'O arremesso é funcional, mas o volume ainda limita a confiança da projeção.' : '',
  ].filter(Boolean).slice(0, 3);

  return {
    rosterFitScore,
    roleAvailability,
    overlapRisk,
    complementaryFit,
    coreFit,
    positives,
    warnings,
    notes: {
      rotationPath: mustDraft
        ? 'Jogador imperdivel: caminho de minutos deve ser criado pelo talento, nao pela concorrencia interna.'
        : roleAvailability >= 65
        ? `Caminho de rotacao viavel como ${rosterContext.availableRoles[0] || 'peca complementar'}.`
        : 'Caminho de rotacao menos claro pela concorrencia interna.',
      coreFit: coreFit >= 65
        ? `Encaixe positivo ao redor de ${names(rosterContext.corePlayers, 3) || 'núcleo atual'}.`
        : `Encaixe com ${names(rosterContext.corePlayers, 3) || 'núcleo atual'} exige papel mais específico.`,
      overlap: overlapRisk >= 65
        ? rosterContext.notes.overlapRisk
        : 'Baixo risco de sobreposição funcional relevante.',
    },
  };
}

export function getRosterAwareFitNotes(
  player: any,
  rosterContext: RosterContext,
  teamIntelligence?: TeamDraftIntelligence,
) {
  const fit = evaluateProspectRosterFit(player, rosterContext);
  const shootingProfile = evaluateShootingProfile(player);
  const signals = prospectRoleSignals(player);
  const topNeed = Object.entries(teamIntelligence?.needs || {})
    .sort((a, b) => Number(b[1]) - Number(a[1]))[0]?.[0];
  const coreNames = names(rosterContext.corePlayers, 2) || 'núcleo atual';
  const shootingNeed = (teamIntelligence?.needs?.shooting || 0) >= 65 || rosterContext.scores.shootingNeedFromRoster >= 55;
  const role = signals.wing ? 'ala complementar' : signals.guard ? 'guard de rotação' : signals.big ? 'peça de frontcourt' : 'peça complementar';
  const shootingSummary = signals.shooter && shootingNeed
    ? shootingProfile.confidence === 'low'
      ? `Ajuda o spacing como ${role}, mas a confiança depende do volume/amostra.`
      : `Ajuda a endereçar a lacuna de shooting ao redor de ${coreNames}, especialmente em papel off-ball.`
    : '';

  return {
    positives: fit.positives,
    warnings: fit.warnings,
    summary: shootingSummary || (fit.rosterFitScore >= 70
      ? `Encaixe forte porque adiciona ${rosterContext.availableRoles[0] || 'uma função útil'} ao redor de ${coreNames}, com caminho de minutos mais limpo.`
      : fit.overlapRisk >= 65
        ? `Há risco de sobreposição com papéis já ocupados por ${coreNames}, reduzindo a clareza do papel inicial.`
        : `Fit de elenco situacional: conversa com ${topNeed || rosterContext.availableRoles[0] || 'uma necessidade editorial'}, mas depende de tradução do papel.`),
    notes: fit.notes,
    fit,
    shootingProfile,
  };
}
