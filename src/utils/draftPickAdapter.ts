import { LOTTERY_TEAMS, PICKS_15_30 } from '../data/prospects.js';
import type { TeamId } from '../data/teamProfiles';

export interface NormalizedDraftPick {
  pick: number;
  round: 1 | 2;
  teamId: TeamId;
  originalTeamId?: TeamId;
  playerId?: string;
  isLottery: boolean;
  isTopFour: boolean;
}

type LotteryTeam = {
  id: number;
  slotOrder: number;
  name: string;
  abbr: TeamId;
  record: string;
  color: string;
  prob: number;
};

type FixedFirstRoundPick = {
  pick: number;
  owner: string;
  ownerAbbr: TeamId;
  via?: string | null;
  viaAbbr?: TeamId | null;
  color?: string;
};

type MockDraftResolvedPick = {
  pick: number;
  ownerAbbr?: TeamId;
  viaAbbr?: TeamId | null;
  originalTeam?: LotteryTeam | null;
  isLottery?: boolean;
  isTop4?: boolean;
  playerId?: string | number | null;
};

export type DraftOrderInput = Array<NormalizedDraftPick | MockDraftResolvedPick | number>;

type TradeResult = {
  ownerAbbr: TeamId;
  originalTeamId?: TeamId;
};

const lotteryTeams = LOTTERY_TEAMS as LotteryTeam[];
const fixedFirstRoundPicks = PICKS_15_30 as FixedFirstRoundPick[];

const isTeamId = (value: unknown): value is TeamId =>
  typeof value === 'string' && /^[A-Z]{2,3}$/.test(value);

function teamByLotteryId(id: number): LotteryTeam | undefined {
  return lotteryTeams.find(team => team.id === id);
}

function teamByAbbr(abbr: TeamId): LotteryTeam | undefined {
  return lotteryTeams.find(team => team.abbr === abbr);
}

function applyLotteryTradeRules(team: LotteryTeam, finalPosition: number): TradeResult {
  if (team.abbr === 'NOP') {
    return { ownerAbbr: 'ATL', originalTeamId: 'NOP' };
  }

  if (team.abbr === 'LAC') {
    return { ownerAbbr: 'OKC', originalTeamId: 'LAC' };
  }

  if (team.abbr === 'IND') {
    if (finalPosition <= 4 || finalPosition >= 11) {
      return { ownerAbbr: 'IND', originalTeamId: 'IND' };
    }

    return { ownerAbbr: 'LAC', originalTeamId: 'IND' };
  }

  return { ownerAbbr: team.abbr, originalTeamId: team.abbr };
}

function normalizePlayerId(playerId: unknown): string | undefined {
  if (playerId === null || playerId === undefined || playerId === '') return undefined;
  return String(playerId);
}

function normalizeFromResolvedPick(pick: MockDraftResolvedPick): NormalizedDraftPick {
  const pickNumber = pick.pick;
  const originalTeamId = pick.originalTeam?.abbr ?? pick.viaAbbr ?? pick.ownerAbbr;
  const owner = pick.ownerAbbr ?? originalTeamId;

  if (!isTeamId(owner)) {
    throw new Error(`Draft pick #${pickNumber} is missing a valid ownerAbbr/teamId.`);
  }

  return {
    pick: pickNumber,
    round: pickNumber <= 30 ? 1 : 2,
    teamId: owner,
    originalTeamId: isTeamId(originalTeamId) ? originalTeamId : undefined,
    playerId: normalizePlayerId(pick.playerId),
    isLottery: pick.isLottery ?? pickNumber <= 14,
    isTopFour: pick.isTop4 ?? pickNumber <= 4,
  };
}

function normalizeExistingPick(pick: NormalizedDraftPick): NormalizedDraftPick {
  return {
    ...pick,
    round: pick.round ?? (pick.pick <= 30 ? 1 : 2),
    isLottery: pick.isLottery ?? pick.pick <= 14,
    isTopFour: pick.isTopFour ?? pick.pick <= 4,
  };
}

function normalizeDraftOrderInput(currentOrder: DraftOrderInput): NormalizedDraftPick[] {
  if (!currentOrder.length) return [];

  if (typeof currentOrder[0] === 'number') {
    return buildDraftOrderFromLotteryResult(currentOrder as number[]);
  }

  return (currentOrder as Array<NormalizedDraftPick | MockDraftResolvedPick>)
    .map(item => {
      if ('teamId' in item && typeof item.pick === 'number') {
        return normalizeExistingPick(item as NormalizedDraftPick);
      }

      return normalizeFromResolvedPick(item as MockDraftResolvedPick);
    })
    .sort((a, b) => a.pick - b.pick);
}

export function buildDraftOrderFromLotteryResult(lotteryResult: number[]): NormalizedDraftPick[] {
  const lotteryPicks = lotteryResult.map((teamId, index): NormalizedDraftPick => {
    const pickNumber = index + 1;
    const team = teamByLotteryId(teamId);

    if (!team) {
      throw new Error(`Unknown lottery team id: ${teamId}`);
    }

    const trade = applyLotteryTradeRules(team, pickNumber);

    return {
      pick: pickNumber,
      round: 1,
      teamId: trade.ownerAbbr,
      originalTeamId: trade.originalTeamId,
      isLottery: true,
      isTopFour: pickNumber <= 4,
    };
  });

  const fixedPicks = fixedFirstRoundPicks.map((pick): NormalizedDraftPick => ({
    pick: pick.pick,
    round: 1,
    teamId: pick.ownerAbbr,
    originalTeamId: pick.viaAbbr ?? pick.ownerAbbr,
    isLottery: false,
    isTopFour: false,
  }));

  return [...lotteryPicks, ...fixedPicks].sort((a, b) => a.pick - b.pick);
}

function getDefaultLotteryResult(): number[] {
  return [...lotteryTeams]
    .sort((a, b) => a.slotOrder - b.slotOrder)
    .map(team => team.id);
}

export function getCurrentDraftOrder(currentOrder?: DraftOrderInput): NormalizedDraftPick[] {
  if (currentOrder?.length) {
    return normalizeDraftOrderInput(currentOrder);
  }

  return buildDraftOrderFromLotteryResult(getDefaultLotteryResult());
}

export function getTeamPicks(teamId: TeamId | string, currentOrder?: DraftOrderInput): NormalizedDraftPick[] {
  return getCurrentDraftOrder(currentOrder).filter(pick => pick.teamId === teamId);
}

export function getPickByNumber(pickNumber: number, currentOrder?: DraftOrderInput): NormalizedDraftPick | undefined {
  return getCurrentDraftOrder(currentOrder).find(pick => pick.pick === pickNumber);
}

export function teamHasPickInRange(
  teamId: TeamId | string,
  minPick: number,
  maxPick: number,
  currentOrder?: DraftOrderInput,
): boolean {
  return getTeamPicks(teamId, currentOrder).some(pick => pick.pick >= minPick && pick.pick <= maxPick);
}

export function getLotteryPicks(currentOrder?: DraftOrderInput): NormalizedDraftPick[] {
  return getCurrentDraftOrder(currentOrder).filter(pick => pick.isLottery);
}

export function getFirstRoundPicks(currentOrder?: DraftOrderInput): NormalizedDraftPick[] {
  return getCurrentDraftOrder(currentOrder).filter(pick => pick.round === 1 && pick.pick <= 30);
}

export function getOriginalLotteryTeamId(teamId: TeamId): number | undefined {
  return teamByAbbr(teamId)?.id;
}


