import {
  getTeamDraftIntelligence,
  type TeamDraftIntelligence,
  type TeamNeeds,
} from '../data/teamDraftIntelligence.ts'
import {
  analyzeRosterContext,
  evaluateProspectRosterFit,
  evaluateShootingProfile,
  getRosterAwareFitNotes,
} from './rosterContextAlgorithm.ts'

export type DraftDecisionGrade =
  | 'Ideal Decision'
  | 'Strong Decision'
  | 'Good Decision'
  | 'Acceptable Decision'
  | 'Situational Decision'
  | 'Risky Decision'
  | 'Poor Decision';

export type DraftDecisionBreakdown = {
  needFit: number;
  roleFit: number;
  draftRange: number;
  strategyFit: number;
  boardValue: number;
  riskFit: number;
};

export type DraftDecisionResult = {
  score: number;
  grade: DraftDecisionGrade;
  recommendationType: string;
  summary: string;
  positives: string[];
  warnings: string[];
  breakdown: DraftDecisionBreakdown;
  debug?: {
    weights: DraftDecisionBreakdown;
    appliedBonuses: string[];
    appliedPenalties: string[];
    matchedNeeds: string[];
    missedNeeds: string[];
    rosterFitScore?: number;
    overlapRisk?: number;
    roleAvailability?: number;
    rosterStrengths?: string[];
    rosterWeaknesses?: string[];
    corePlayers?: string[];
    playerTraits?: PlayerDecisionTraits;
    teamNeeds?: TeamNeeds;
    rosterContext?: {
      corePlayers: string[];
      injuredCore: string[];
      matchedNeeds: string[];
      missedNeeds: string[];
      shootingProfile?: ReturnType<typeof evaluateShootingProfile>;
      overlapRisk: number;
      roleAvailability: number;
      rosterFitScore?: number;
      rosterStrengths?: string[];
      rosterWeaknesses?: string[];
      notes?: {
        rotationPath?: string;
        coreFit?: string;
        overlap?: string;
      };
    };
  };
};

export type DraftDecisionInput = {
  player: any;
  teamId: string;
  currentPick: number;
  availablePlayers?: any[];
};

export type PlayerDecisionTraits = {
  shooting: number;
  primaryCreation: number;
  secondaryCreation: number;
  rimPressure: number;
  pointOfAttackDefense: number;
  wingDefense: number;
  rimProtection: number;
  rebounding: number;
  size: number;
  athleticism: number;
  benchScoring: number;
  nbaReadiness: number;
  upside: number;
  risk: number;
};

const DEFAULT_WEIGHTS: DraftDecisionBreakdown = {
  needFit: 0.26,
  roleFit: 0.20,
  draftRange: 0.18,
  strategyFit: 0.18,
  boardValue: 0.10,
  riskFit: 0.08,
};

const NEED_LABELS: Record<keyof TeamNeeds, string> = {
  primaryCreation: 'criação primária',
  secondaryCreation: 'criação secundária',
  shooting: 'arremesso',
  rimPressure: 'pressão de aro',
  pointOfAttackDefense: 'defesa no ponto de ataque',
  wingDefense: 'defesa de alas',
  rimProtection: 'proteção de aro',
  rebounding: 'rebote',
  size: 'tamanho',
  athleticism: 'atletismo',
  benchScoring: 'pontuação de banco',
};

const MUST_DRAFT_PROSPECTS = ['aj dybantsa', 'cameron boozer', 'darryn peterson'];
const PRIMARY_CREATION_PRIORITY_TEAMS = new Set(['BKN', 'MEM', 'SAC', 'CHI', 'MIL', 'MIA']);

export function clamp(value: number, min = 0, max = 100): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function normalizeScore(value: number): number {
  return Math.round(clamp(value, 0, 100));
}

const safeNumber = (value: unknown, fallback = 0): number => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const average = (values: number[], fallback = 55): number => {
  const valid = values.filter(Number.isFinite);
  if (!valid.length) return fallback;
  return valid.reduce((sum, value) => sum + value, 0) / valid.length;
};

const toText = (value: unknown): string => {
  if (Array.isArray(value)) return value.join(' ');
  if (value && typeof value === 'object') return Object.values(value).join(' ');
  return String(value || '');
};

const playerSearchText = (player: any): string => [
  player?.name,
  player?.position,
  player?.tier,
  player?.archetype,
  player?.projectedRole,
  player?.role,
  player?.scouting?.notes,
  toText(player?.scouting?.strengths),
  toText(player?.scouting?.weaknesses),
  toText(player?.scouting?.attributes),
  toText(player?.scouting?.evaluation?.tools),
].join(' ').toLowerCase();

const normalizeName = (value: unknown): string =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\./g, '')
    .trim()
    .toLowerCase();

function isMustDraftProspect(player: any): boolean {
  return MUST_DRAFT_PROSPECTS.includes(normalizeName(player?.name));
}

function getAdjustedTeamNeeds(teamIntelligence: TeamDraftIntelligence): TeamNeeds {
  const teamId = teamIntelligence.teamId;
  const needs: TeamNeeds = { ...teamIntelligence.needs };

  if (PRIMARY_CREATION_PRIORITY_TEAMS.has(teamId)) {
    needs.primaryCreation = Math.max(needs.primaryCreation, 100);
    needs.secondaryCreation = Math.max(needs.secondaryCreation, 76);
    needs.benchScoring = Math.max(needs.benchScoring, 70);
  }

  if (teamId === 'UTA') {
    needs.shooting = Math.max(needs.shooting, 96);
    needs.secondaryCreation = Math.max(needs.secondaryCreation, 78);
  }

  if (teamId === 'DAL') {
    needs.primaryCreation = 100;
    needs.secondaryCreation = Math.max(needs.secondaryCreation, 78);
    needs.shooting = Math.max(needs.shooting, 76);
  }

  if (teamId === 'WAS') {
    needs.shooting = Math.max(needs.shooting, 74);
    needs.pointOfAttackDefense = Math.max(needs.pointOfAttackDefense, 88);
    needs.wingDefense = Math.max(needs.wingDefense, 88);
    needs.secondaryCreation = Math.max(needs.secondaryCreation, 82);
    needs.primaryCreation = Math.max(needs.primaryCreation, 44);
  }

  if (teamId === 'IND') {
    needs.shooting = Math.max(needs.shooting, 86);
    needs.pointOfAttackDefense = Math.max(needs.pointOfAttackDefense, 84);
    needs.wingDefense = Math.max(needs.wingDefense, 84);
    needs.primaryCreation = Math.min(needs.primaryCreation, 42);
    needs.secondaryCreation = Math.min(needs.secondaryCreation, 56);
  }

  return needs;
}

export function hasKeyword(source: unknown, keywords: string[]): boolean {
  const text = toText(source).toLowerCase();
  return keywords.some((keyword) => text.includes(keyword.toLowerCase()));
}

export function getPlayerRank(player: any): number | undefined {
  const rank = Number(player?.rank ?? player?.boardRank ?? player?.mockRank);
  return Number.isFinite(rank) && rank > 0 ? rank : undefined;
}

export function getPlayerPosition(player: any): string {
  return String(player?.position || player?.pos || '').toUpperCase();
}

export function getPlayerStats(player: any): Record<string, number> {
  const stats = player?.stats || {};
  return {
    ppg: safeNumber(stats.ppg ?? stats.points),
    rpg: safeNumber(stats.rpg ?? stats.rebounds),
    apg: safeNumber(stats.apg ?? stats.assists),
    ts: safeNumber(stats.ts ?? stats.tsPct),
    efg: safeNumber(stats.efg ?? stats.efgPct),
    threep: safeNumber(stats.threep ?? stats.threePct ?? stats['3p']),
    ftp: safeNumber(stats.ftp ?? stats.ftPct),
    usg: safeNumber(stats.usg ?? stats.usgPct),
    astTo: safeNumber(stats.astTo ?? stats.ast_to),
    blkPct: safeNumber(stats.blkPct ?? stats.blk ?? stats.blocks),
    stlPct: safeNumber(stats.stlPct ?? stats.stl ?? stats.steals),
    per: safeNumber(stats.per),
  };
}

const parseFeetInches = (value: unknown): number => {
  const text = String(value || '');
  const match = text.match(/(\d+)'(?:\s?(\d+))?/);
  if (!match) return 0;
  return Number(match[1]) * 12 + Number(match[2] || 0);
};

const toolScore = (player: any, key: string, fallback = 55): number => {
  const tools = player?.scouting?.evaluation?.tools || {};
  const attributes = player?.scouting?.attributes || {};
  const raw = tools[key] ?? tools[key.toLowerCase()] ?? attributes[key] ?? attributes[key.toLowerCase()];
  if (typeof raw === 'number') return raw <= 10 ? raw * 10 : raw;
  const text = String(raw || '').toLowerCase();
  if (text.includes('elite')) return 88;
  if (text.includes('plus')) return 74;
  if (text.includes('solid')) return 60;
  if (text.includes('question')) return 35;
  return fallback;
};

const tierScore = (tier: unknown): number => {
  const value = String(tier || '').toUpperCase();
  if (value.includes('ELITE')) return 92;
  if (value.includes('LOTTERY')) return 78;
  if (value.includes('MID_1ST') || value.includes('MID 1ST')) return 66;
  if (value.includes('SLEEPER')) return 58;
  return 55;
};

export function derivePlayerTraits(player: any): PlayerDecisionTraits {
  const stats = getPlayerStats(player);
  const text = playerSearchText(player);
  const position = getPlayerPosition(player);
  const height = parseFeetInches(player?.height);
  const wingspan = parseFeetInches(player?.wingspan);
  const age = safeNumber(player?.age, 20);
  const rank = getPlayerRank(player) ?? 45;
  const floor = safeNumber(player?.scouting?.evaluation?.floor?.score, 52);
  const ceiling = safeNumber(player?.scouting?.evaluation?.ceiling?.score, floor + 18);
  const manualRisk = String(player?.scouting?.evaluation?.risk?.level || player?.risk || '').toLowerCase();

  const isGuard = /PG|SG|G/.test(position);
  const isWing = /SF|W|F/.test(position);
  const isBig = /PF|C/.test(position);
  const shootingProfile = evaluateShootingProfile(player);

  const shooting = average([
    stats.threep ? (stats.threep - 25) * 2.8 : 55,
    stats.ftp ? (stats.ftp - 58) * 1.8 : 55,
    stats.ts ? (stats.ts - 48) * 3.2 : 55,
    toolScore(player, 'shooting', 55),
    shootingProfile.score,
    hasKeyword(text, ['shooter', 'shooting', 'spacing', 'shotmaking', 'catch-and-shoot', 'arremesso']) ? 76 : 55,
  ]);

  const primaryCreation = average([
    stats.usg ? (stats.usg - 16) * 3.4 : 55,
    stats.apg ? 42 + stats.apg * 8 : 55,
    stats.astTo ? 42 + stats.astTo * 12 : 55,
    toolScore(player, 'creation', 55),
    toolScore(player, 'Playmaking', 55),
    hasKeyword(text, ['primary creator', 'creator', 'lead guard', 'shot creator', 'criação', 'handler']) ? 78 : 55,
  ]);

  const secondaryCreation = average([
    stats.apg ? 45 + stats.apg * 7 : 55,
    stats.astTo ? 45 + stats.astTo * 10 : 55,
    toolScore(player, 'creation', 55),
    hasKeyword(text, ['passing', 'playmaking', 'connector', 'connective', 'passe', 'leitura']) ? 74 : 55,
  ]);

  const rimPressure = average([
    stats.ppg ? 40 + stats.ppg * 1.8 : 55,
    stats.ftp ? (stats.ftp - 58) * 1.2 : 55,
    hasKeyword(text, ['rim pressure', 'slasher', 'driving', 'transition', 'aro', 'finalização']) ? 76 : 55,
  ]);

  const pointOfAttackDefense = average([
    stats.stlPct ? 42 + stats.stlPct * 12 : 55,
    toolScore(player, 'defense', 55),
    isGuard || isWing ? 60 : 48,
    hasKeyword(text, ['point of attack', 'poa', 'perimeter defense', 'on-ball defense', 'defesa']) ? 76 : 55,
  ]);

  const wingDefense = average([
    toolScore(player, 'defense', 55),
    stats.stlPct ? 40 + stats.stlPct * 10 : 55,
    stats.blkPct ? 45 + stats.blkPct * 5 : 55,
    isWing || height >= 78 ? 66 : 48,
    hasKeyword(text, ['switch', 'versatile defender', 'wing defense', 'two-way', 'defesa versátil']) ? 78 : 55,
  ]);

  const rimProtection = average([
    stats.blkPct ? 38 + stats.blkPct * 10 : 48,
    isBig ? 65 : 42,
    height >= 82 ? 75 : height >= 80 ? 66 : 45,
    wingspan >= 84 ? 72 : 52,
    hasKeyword(text, ['rim protection', 'rim protector', 'blocks', 'tocos', 'proteção de aro']) ? 80 : 55,
  ]);

  const rebounding = average([
    stats.rpg ? 38 + stats.rpg * 5.5 : 55,
    toolScore(player, 'rebounding', 55),
    isBig ? 62 : isWing ? 54 : 44,
    hasKeyword(text, ['rebound', 'rebounding', 'rebote']) ? 74 : 55,
  ]);

  const size = average([
    height ? (height - 72) * 5.2 + 45 : 55,
    wingspan ? (wingspan - 74) * 4.2 + 45 : 55,
    isBig ? 66 : isWing ? 60 : 48,
  ]);

  const athleticism = average([
    toolScore(player, 'athleticism', 55),
    hasKeyword(text, ['athletic', 'explosive', 'vertical', 'speed', 'tools', 'atletismo', 'explosivo']) ? 78 : 55,
    ceiling >= 80 ? 66 : 54,
  ]);

  const benchScoring = average([
    stats.ppg ? 40 + stats.ppg * 2 : 55,
    stats.usg ? 42 + stats.usg * 1.5 : 55,
    hasKeyword(text, ['scorer', 'scoring', 'shot creation', 'pontuador', 'volume']) ? 76 : 55,
  ]);

  const nbaReadiness = average([
    floor,
    shooting,
    pointOfAttackDefense,
    stats.ts ? (stats.ts - 48) * 3 : 55,
    hasKeyword(text, ['nba ready', 'clear role', 'low risk', 'pronto', 'função clara']) ? 76 : 55,
  ]);

  const upside = average([
    ceiling,
    tierScore(player?.tier),
    rank <= 5 ? 88 : rank <= 14 ? 76 : rank <= 30 ? 62 : 52,
    age <= 18.5 ? 78 : age <= 20 ? 64 : 52,
    primaryCreation,
    athleticism,
  ]);

  const riskFromManual = manualRisk.includes('high') ? 78 : manualRisk.includes('moderate') || manualRisk.includes('medium') ? 58 : manualRisk.includes('low') ? 32 : 0;
  const risk = average([
    riskFromManual || 55,
    floor < 45 ? 78 : floor < 55 ? 64 : floor < 65 ? 52 : 38,
    ceiling - floor >= 30 ? 78 : ceiling - floor >= 20 ? 62 : 45,
    stats.ts && stats.ts < 53 && stats.usg > 24 ? 74 : 52,
    stats.astTo && stats.astTo < 1 && isGuard ? 68 : 52,
    hasKeyword(text, ['risk', 'raw', 'concern', 'turnover', 'decision making', 'medical', 'inconsistente', 'risco']) ? 70 : 50,
  ]);

  return {
    shooting: normalizeScore(shooting),
    primaryCreation: normalizeScore(primaryCreation),
    secondaryCreation: normalizeScore(secondaryCreation),
    rimPressure: normalizeScore(rimPressure),
    pointOfAttackDefense: normalizeScore(pointOfAttackDefense),
    wingDefense: normalizeScore(wingDefense),
    rimProtection: normalizeScore(rimProtection),
    rebounding: normalizeScore(rebounding),
    size: normalizeScore(size),
    athleticism: normalizeScore(athleticism),
    benchScoring: normalizeScore(benchScoring),
    nbaReadiness: normalizeScore(nbaReadiness),
    upside: normalizeScore(upside),
    risk: normalizeScore(risk),
  };
}

function getNeedFitDetails(player: any, teamIntelligence: TeamDraftIntelligence) {
  const traits = derivePlayerTraits(player);
  const shootingProfile = evaluateShootingProfile(player);
  const shootingSolvesNeed = ['elite', 'strong', 'solid'].includes(shootingProfile.label);
  const adjustedNeeds = getAdjustedTeamNeeds(teamIntelligence);
  const entries = Object.entries(adjustedNeeds) as Array<[keyof TeamNeeds, number]>;
  const meaningfulNeeds = entries.filter(([, value]) => value >= 35);
  const denominator = meaningfulNeeds.reduce((sum, [, need]) => sum + need, 0) || 1;
  let weighted = meaningfulNeeds.reduce((sum, [key, need]) => sum + need * traits[key], 0) / denominator;
  if (teamIntelligence.timeline === 'rebuilding') {
    weighted = weighted * 0.82 + traits.upside * 0.18;
    if (traits.upside >= 84) weighted += 8;
    else if (traits.upside >= 75) weighted += 5;
  }
  if (teamIntelligence.teamId === 'DAL') {
    weighted += Math.max(0, traits.primaryCreation - 64) * 0.10;
  }
  if (teamIntelligence.teamId === 'UTA') {
    weighted += Math.max(0, traits.shooting - 66) * 0.12;
  }
  if (teamIntelligence.teamId === 'IND' && isMustDraftProspect(player)) {
    weighted += 6;
  }
  const matchedNeeds = meaningfulNeeds
    .filter(([key, need]) => need >= 70 && (traits[key] >= 70 || (key === 'shooting' && shootingSolvesNeed)))
    .map(([key]) => NEED_LABELS[key]);
  const missedNeeds = meaningfulNeeds
    .filter(([key, need]) => need >= 70 && traits[key] < 50 && !(key === 'shooting' && shootingSolvesNeed))
    .map(([key]) => NEED_LABELS[key]);

  return {
    score: normalizeScore(weighted),
    traits,
    matchedNeeds,
    missedNeeds,
  };
}

export function calculateNeedFit(player: any, teamIntelligence: TeamDraftIntelligence): number {
  return getNeedFitDetails(player, teamIntelligence).score;
}

export function calculateRoleFit(player: any, teamIntelligence: TeamDraftIntelligence): number {
  const { traits, matchedNeeds, missedNeeds } = getNeedFitDetails(player, teamIntelligence);
  let score = 58;

  if (teamIntelligence.timeline === 'contender' || teamIntelligence.timeline === 'playoff') {
    score += (traits.nbaReadiness - 55) * 0.45;
    score += (Math.max(traits.shooting, traits.pointOfAttackDefense, traits.wingDefense) - 55) * 0.18;
    score -= Math.max(0, traits.risk - 58) * 0.25;
  }

  if (teamIntelligence.timeline === 'rebuilding') {
    score += (traits.upside - 55) * 0.45;
    score += (Math.max(traits.primaryCreation, traits.size, traits.athleticism) - 55) * 0.18;
  }

  if (teamIntelligence.timeline === 'ascending' || teamIntelligence.timeline === 'retooling') {
    score += (average([traits.upside, traits.nbaReadiness], 55) - 55) * 0.35;
  }

  if (teamIntelligence.draftMode === 'need-based') score += matchedNeeds.length * 5 - missedNeeds.length * 4;
  if (teamIntelligence.draftMode === 'safe-pick') score += (traits.nbaReadiness - traits.risk) * 0.22;
  if (teamIntelligence.draftMode === 'upside-swing') score += (traits.upside - 55) * 0.35;

  const avoidText = teamIntelligence.draftPreferences.avoidArchetypes.join(' ').toLowerCase();
  if (traits.shooting < 45 && avoidText.includes('arremessador limitado')) score -= 10;
  if (traits.pointOfAttackDefense < 45 && avoidText.includes('liability defensivo')) score -= 10;
  if (traits.risk > 70 && avoidText.includes('projeto cru')) score -= 8;
  if (isMustDraftProspect(player)) {
    score = Math.max(score, 82);
    if (teamIntelligence.teamId === 'IND') score = Math.max(score, 86);
  }
  if (teamIntelligence.teamId === 'DAL' && traits.primaryCreation >= 70) score += 8;
  if (teamIntelligence.teamId === 'IND' && traits.primaryCreation >= 78 && !isMustDraftProspect(player)) score -= 7;

  return normalizeScore(score);
}

export function calculateDraftRange(player: any, currentPick: number): number {
  const rank = getPlayerRank(player);
  if (!rank) return 55;
  const distance = Math.abs(rank - currentPick);
  const isReach = rank > currentPick;
  const isSteal = rank < currentPick;

  let score = 35;
  if (distance <= 1) score = 100;
  else if (distance <= 3) score = 90;
  else if (distance <= 5) score = 78;
  else if (distance <= 8) score = 65;
  else if (distance <= 12) score = 52;

  if (isReach) {
    score -= Math.max(0, distance - 2) * 2.2;
    if (currentPick <= 5 && distance > 5) score -= 12;
    if (currentPick <= 10 && distance > 10) score -= 12;
  }

  if (isSteal) {
    score += Math.min(12, distance * 1.4);
    if (distance >= 6) score += 4;
  }

  return normalizeScore(score);
}

export function calculateStrategyFit(player: any, teamIntelligence: TeamDraftIntelligence): number {
  const { traits, matchedNeeds, missedNeeds } = getNeedFitDetails(player, teamIntelligence);
  let score = 58;

  if (teamIntelligence.timeline === 'rebuilding') score += (traits.upside - 55) * 0.38;
  if (teamIntelligence.timeline === 'ascending') score += (average([traits.upside, traits.nbaReadiness], 55) - 55) * 0.30;
  if (teamIntelligence.timeline === 'retooling') score += (average([traits.secondaryCreation, traits.size, traits.shooting], 55) - 55) * 0.22;
  if (teamIntelligence.timeline === 'playoff' || teamIntelligence.timeline === 'contender') {
    score += (traits.nbaReadiness - 55) * 0.40;
    score += (average([traits.shooting, traits.pointOfAttackDefense, traits.wingDefense], 55) - 55) * 0.18;
    score -= Math.max(0, traits.risk - 60) * 0.25;
  }

  if (teamIntelligence.draftMode === 'upside-swing') score += (traits.upside - 55) * 0.34;
  if (teamIntelligence.draftMode === 'safe-pick') score += (traits.nbaReadiness - traits.risk) * 0.24;
  if (teamIntelligence.draftMode === 'need-based') score += matchedNeeds.length * 6 - missedNeeds.length * 5;
  if (teamIntelligence.draftMode === 'best-player') score += tierScore(player?.tier) * 0.12 - 6;
  if (teamIntelligence.draftMode === 'value-opportunistic') {
    const rank = getPlayerRank(player);
    if (rank && rank < 20) score += 5;
  }

  if (teamIntelligence.riskTolerance === 'low') score -= Math.max(0, traits.risk - 48) * 0.28;
  if (teamIntelligence.riskTolerance === 'high' && traits.upside >= 70) score += 5;
  if (PRIMARY_CREATION_PRIORITY_TEAMS.has(teamIntelligence.teamId)) {
    score += Math.max(0, traits.primaryCreation - 66) * 0.18;
    if (traits.primaryCreation >= 78 && traits.risk <= 70) score += 5;
  }
  if (teamIntelligence.teamId === 'UTA') score += Math.max(0, traits.shooting - 68) * 0.18;
  if (teamIntelligence.teamId === 'DAL' && traits.primaryCreation >= 70) score += 7;
  if (teamIntelligence.teamId === 'WAS' && isMustDraftProspect(player)) score += 8;
  if (teamIntelligence.teamId === 'IND' && isMustDraftProspect(player)) score += 8;

  return normalizeScore(score);
}

export function calculateBoardValue(player: any, currentPick: number, availablePlayers: any[] = []): number {
  const rank = getPlayerRank(player);
  if (!rank) return 55;

  let score = calculateDraftRange(player, currentPick);
  const distance = rank - currentPick;
  if (distance > 0) score -= Math.min(30, distance * 2.4);
  if (distance < 0) score += Math.min(18, Math.abs(distance) * 1.8);

  const availableByRank = [...availablePlayers]
    .filter((candidate) => getPlayerRank(candidate))
    .sort((a, b) => (getPlayerRank(a) || 99) - (getPlayerRank(b) || 99));

  const boardIndex = availableByRank.findIndex((candidate) => String(candidate?.id ?? candidate?.name) === String(player?.id ?? player?.name));
  if (boardIndex === 0) score += 14;
  else if (boardIndex > 0 && boardIndex <= 2) score += 8;
  else if (boardIndex >= 5) score -= Math.min(18, boardIndex * 1.5);

  const betterAvailable = availableByRank.filter((candidate) => (getPlayerRank(candidate) || 99) + 4 < rank).length;
  if (betterAvailable >= 3) score -= 16;
  if (betterAvailable >= 6) score -= 12;

  return normalizeScore(score);
}

export function calculateRiskFit(player: any, teamIntelligence: TeamDraftIntelligence): number {
  const traits = derivePlayerTraits(player);
  const risk = traits.risk;
  let score = 70;

  if (teamIntelligence.riskTolerance === 'low') score = 96 - risk * 0.95;
  if (teamIntelligence.riskTolerance === 'medium') score = 88 - Math.abs(risk - 50) * 0.55 - Math.max(0, risk - 70) * 0.35;
  if (teamIntelligence.riskTolerance === 'high') score = 72 - Math.max(0, risk - 78) * 0.45 + Math.max(0, traits.upside - 65) * 0.30;

  if ((teamIntelligence.timeline === 'contender' || teamIntelligence.timeline === 'playoff') && risk > 65) score -= 10;
  if (teamIntelligence.timeline === 'rebuilding' && risk > 65 && traits.upside >= 72) score += 8;

  return normalizeScore(score);
}

export function getDraftDecisionGrade(score: number): DraftDecisionGrade {
  if (score >= 90) return 'Ideal Decision';
  if (score >= 80) return 'Strong Decision';
  if (score >= 70) return 'Good Decision';
  if (score >= 60) return 'Acceptable Decision';
  if (score >= 50) return 'Situational Decision';
  if (score >= 40) return 'Risky Decision';
  return 'Poor Decision';
}

function getRecommendationType(
  breakdown: DraftDecisionBreakdown,
  player: any,
  currentPick: number,
  traits: PlayerDecisionTraits,
): string {
  const rank = getPlayerRank(player);
  const isReach = rank ? rank > currentPick + 5 : false;
  const isSteal = rank ? rank + 5 < currentPick : false;
  if (isMustDraftProspect(player)) return 'Franchise Talent / BPA';
  if (breakdown.boardValue >= 82 && isSteal) return 'Best Player Available';
  if (breakdown.needFit >= 75 && breakdown.boardValue >= 68) return 'Need + Value';
  if (traits.upside >= 76 && breakdown.riskFit >= 55) return 'Upside Swing';
  if (traits.nbaReadiness >= 72 && traits.risk <= 50) return 'Safe Rotation Bet';
  if (isReach && breakdown.needFit >= 70) return 'Strategic Reach';
  if (traits.risk >= 72 && traits.upside >= 74) return 'High-Risk Bet';
  if (breakdown.boardValue < 45) return 'Poor Value';
  return 'Balanced Decision';
}

function buildPositives(
  breakdown: DraftDecisionBreakdown,
  matchedNeeds: string[],
  team: TeamDraftIntelligence,
): string[] {
  const positives: string[] = [];
  if (matchedNeeds.length) positives.push(`Resolve necessidade prioritária: ${matchedNeeds.slice(0, 2).join(' e ')}.`);
  if (breakdown.boardValue >= 75) positives.push('Boa relação entre talento disponível e faixa da pick.');
  if (breakdown.strategyFit >= 72) positives.push('Perfil compatível com a estratégia competitiva do time.');
  if (breakdown.roleFit >= 72) positives.push('Papel projetado claro dentro do elenco.');
  if (team.draftMode === 'upside-swing' && breakdown.riskFit >= 55) positives.push('Aposta de teto faz sentido para o modo de draft da franquia.');
  return positives.slice(0, 3);
}

function buildWarnings(
  breakdown: DraftDecisionBreakdown,
  missedNeeds: string[],
  traits: PlayerDecisionTraits,
  player: any,
  currentPick: number,
  team: TeamDraftIntelligence,
): string[] {
  const warnings: string[] = [];
  const rank = getPlayerRank(player);
  if (rank && rank > currentPick + 5) warnings.push('Reach relevante para a posição da pick.');
  if (missedNeeds.length) warnings.push(`Não resolve carência prioritária: ${missedNeeds.slice(0, 2).join(' e ')}.`);
  if (breakdown.boardValue < 45) warnings.push('Valor de board fraco para este ponto do draft.');
  if (breakdown.riskFit < 50 || (team.riskTolerance === 'low' && traits.risk > 60)) warnings.push('Risco acima da tolerância normal da franquia.');
  if ((team.timeline === 'contender' || team.timeline === 'playoff') && traits.nbaReadiness < 55) warnings.push('Pode exigir mais desenvolvimento do que o contexto permite.');
  return warnings.slice(0, 3);
}

function getDraftDecisionSummary(
  score: number,
  recommendationType: string,
  warnings: string[],
  positives: string[],
  rosterSummary?: string,
): string {
  if (recommendationType === 'Franchise Talent / BPA') return 'Prospecto imperdivel: o talento de topo justifica criar o encaixe ao redor dele.';
  if (rosterSummary && score >= 65) return rosterSummary;
  if (score >= 80) return 'Escolha forte pela combinação entre valor de board, necessidade real e papel claro no elenco.';
  if (recommendationType === 'Strategic Reach') return 'O encaixe de necessidade é bom, mas há risco de reach para esta faixa do draft.';
  if (recommendationType === 'Upside Swing') return 'Perfil interessante para upside, com apelo maior se o time priorizar desenvolvimento de longo prazo.';
  if (recommendationType === 'Safe Rotation Bet') return 'Boa escolha se o time priorizar segurança, função imediata e menor variância.';
  if (warnings.length > positives.length) return 'Decisão possível, mas com alertas relevantes de valor, risco ou encaixe estratégico.';
  return 'Escolha equilibrada: faz sentido no contexto, mas não domina todos os critérios de decisão.';
}

export function calculateDraftDecision(input: DraftDecisionInput): DraftDecisionResult {
  const team = getTeamDraftIntelligence(input.teamId);
  if (!team) {
    throw new Error(`Team draft intelligence not found for teamId: ${input.teamId}`);
  }

  const weights = team.algorithmWeights || DEFAULT_WEIGHTS;
  const needDetails = getNeedFitDetails(input.player, team);
  const rosterContext = analyzeRosterContext(input.teamId);
  const rosterFit = evaluateProspectRosterFit(input.player, rosterContext);
  const rosterNotes = getRosterAwareFitNotes(input.player, rosterContext, team);
  const shootingProfile = evaluateShootingProfile(input.player);
  const breakdown: DraftDecisionBreakdown = {
    needFit: normalizeScore(needDetails.score * 0.85 + rosterFit.complementaryFit * 0.15),
    roleFit: normalizeScore(calculateRoleFit(input.player, team) * 0.75 + rosterFit.rosterFitScore * 0.25),
    draftRange: calculateDraftRange(input.player, input.currentPick),
    strategyFit: normalizeScore(calculateStrategyFit(input.player, team) * 0.85 + rosterFit.coreFit * 0.15),
    boardValue: calculateBoardValue(input.player, input.currentPick, input.availablePlayers),
    riskFit: normalizeScore(calculateRiskFit(input.player, team) * 0.85 + (100 - rosterFit.overlapRisk) * 0.15),
  };
  if (isMustDraftProspect(input.player)) {
    breakdown.roleFit = Math.max(breakdown.roleFit, 84);
    breakdown.strategyFit = Math.max(breakdown.strategyFit, 78);
    breakdown.needFit = Math.max(breakdown.needFit, team.timeline === 'rebuilding' ? 84 : 76);
  }
  if (team.teamId === 'IND' && input.currentPick <= 4) {
    breakdown.boardValue = Math.max(breakdown.boardValue, 90);
    if (isMustDraftProspect(input.player)) {
      breakdown.roleFit = Math.max(breakdown.roleFit, 90);
      breakdown.strategyFit = Math.max(breakdown.strategyFit, 88);
      breakdown.needFit = Math.max(breakdown.needFit, 82);
    }
  }

  const rawScore =
    breakdown.needFit * weights.needFit +
    breakdown.roleFit * weights.roleFit +
    breakdown.draftRange * weights.draftRange +
    breakdown.strategyFit * weights.strategyFit +
    breakdown.boardValue * weights.boardValue +
    breakdown.riskFit * weights.riskFit;

  const score = normalizeScore(rawScore);
  const grade = getDraftDecisionGrade(score);
  const recommendationType = getRecommendationType(breakdown, input.player, input.currentPick, needDetails.traits);
  let positives = [
    ...buildPositives(breakdown, needDetails.matchedNeeds, team),
    ...rosterNotes.positives,
  ].slice(0, 3);
  let warnings = [
    ...buildWarnings(breakdown, needDetails.missedNeeds, needDetails.traits, input.player, input.currentPick, team),
    ...rosterNotes.warnings,
  ].slice(0, 3);
  if (isMustDraftProspect(input.player)) {
    positives = [
      'Prospecto imperdivel: talento de topo deve prevalecer sobre ajuste fino de elenco.',
      ...positives,
    ].slice(0, 3);
    warnings = warnings
      .filter((warning) => !/car[eÃª]ncia priorit|desenvolvimento|concorr|congestion/i.test(warning))
      .slice(0, 2);
  }

  const appliedBonuses = [
    ...(breakdown.needFit >= 75 ? ['strong need match'] : []),
    ...(breakdown.boardValue >= 75 ? ['board value'] : []),
    ...(breakdown.strategyFit >= 75 ? ['strategy alignment'] : []),
    ...(breakdown.riskFit >= 75 ? ['risk tolerance match'] : []),
    ...(rosterFit.rosterFitScore >= 70 ? ['roster context fit'] : []),
    ...(rosterFit.roleAvailability >= 70 ? ['clear rotation path'] : []),
  ];

  const appliedPenalties = [
    ...(breakdown.draftRange < 55 ? ['draft range concern'] : []),
    ...(breakdown.boardValue < 50 ? ['board value penalty'] : []),
    ...(breakdown.riskFit < 50 ? ['risk penalty'] : []),
    ...(!isMustDraftProspect(input.player) && needDetails.missedNeeds.length ? ['missed priority needs'] : []),
    ...(!isMustDraftProspect(input.player) && rosterFit.overlapRisk >= 70 ? ['roster overlap penalty'] : []),
  ];

  return {
    score,
    grade,
    recommendationType,
    summary: getDraftDecisionSummary(score, recommendationType, warnings, positives, rosterNotes.summary),
    positives,
    warnings,
    breakdown,
    debug: {
      weights,
      appliedBonuses,
      appliedPenalties,
      matchedNeeds: needDetails.matchedNeeds,
      missedNeeds: needDetails.missedNeeds,
      playerTraits: needDetails.traits,
      teamNeeds: getAdjustedTeamNeeds(team),
      rosterFitScore: rosterFit.rosterFitScore,
      overlapRisk: rosterFit.overlapRisk,
      roleAvailability: rosterFit.roleAvailability,
      rosterStrengths: rosterContext.rosterStrengths,
      rosterWeaknesses: rosterContext.rosterWeaknesses,
      corePlayers: rosterContext.corePlayers.map((player) => player.name),
      rosterContext: {
        corePlayers: rosterContext.corePlayers.map((player) => player.name),
        injuredCore: rosterContext.corePlayers.filter((player) => player.roleTags.includes('injured core')).map((player) => player.name),
        matchedNeeds: needDetails.matchedNeeds,
        missedNeeds: needDetails.missedNeeds,
        shootingProfile,
        overlapRisk: rosterFit.overlapRisk,
        roleAvailability: rosterFit.roleAvailability,
        rosterFitScore: rosterFit.rosterFitScore,
        rosterStrengths: rosterContext.rosterStrengths,
        rosterWeaknesses: rosterContext.rosterWeaknesses,
        notes: rosterNotes.notes,
      },
    },
  };
}

export function getDraftDecisionAudit(input: DraftDecisionInput) {
  const team = getTeamDraftIntelligence(input.teamId);
  if (!team) {
    throw new Error(`Team draft intelligence not found for teamId: ${input.teamId}`);
  }

  const decision = calculateDraftDecision(input);
  const playerTraits = derivePlayerTraits(input.player);
  const rosterContext = analyzeRosterContext(input.teamId);
  const rosterFit = evaluateProspectRosterFit(input.player, rosterContext);
  const shootingProfile = evaluateShootingProfile(input.player);

  return {
    decision,
    playerTraits,
    teamNeeds: getAdjustedTeamNeeds(team),
    rosterContext,
    rosterFit,
    shootingProfile,
    weights: decision.debug?.weights || team.algorithmWeights || DEFAULT_WEIGHTS,
    debug: decision.debug,
  };
}

export function rankAvailablePlayersForTeam(players: any[], teamId: string, currentPick: number) {
  return [...players]
    .map((player) => ({
      player,
      decision: calculateDraftDecision({
        player,
        teamId,
        currentPick,
        availablePlayers: players,
      }),
    }))
    .sort((a, b) => b.decision.score - a.decision.score);
}
