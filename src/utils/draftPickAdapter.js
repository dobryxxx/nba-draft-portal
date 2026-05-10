import { LOTTERY_TEAMS, PICKS_15_30 } from '../data/prospects.js';

const lotteryTeams = LOTTERY_TEAMS;
const fixedFirstRoundPicks = PICKS_15_30;
const officialLotteryOrder = ['WAS', 'UTA', 'MEM', 'CHI', 'IND', 'BKN', 'SAC', 'NOP', 'DAL', 'MIL', 'GSW', 'LAC', 'MIA', 'CHA'];

const isTeamId = value => typeof value === 'string' && /^[A-Z]{2,3}$/.test(value);
const normalizePlayerId = playerId => playerId === null || playerId === undefined || playerId === '' ? undefined : String(playerId);

function teamByLotteryId(id) {
  return lotteryTeams.find(team => team.id === id);
}

function teamByAbbr(abbr) {
  return lotteryTeams.find(team => team.abbr === abbr);
}

function applyLotteryTradeRules(team, finalPosition) {
  if (team.abbr === 'NOP') return { ownerAbbr: 'ATL', originalTeamId: 'NOP' };
  if (team.abbr === 'LAC') return { ownerAbbr: 'OKC', originalTeamId: 'LAC' };
  if (team.abbr === 'IND') {
    if (finalPosition <= 4 || finalPosition >= 11) return { ownerAbbr: 'IND', originalTeamId: 'IND' };
    return { ownerAbbr: 'LAC', originalTeamId: 'IND' };
  }
  return { ownerAbbr: team.abbr, originalTeamId: team.abbr };
}

function normalizeFromResolvedPick(pick) {
  const pickNumber = pick.pick;
  const originalTeamId = pick.originalTeam?.abbr ?? pick.viaAbbr ?? pick.ownerAbbr;
  const owner = pick.ownerAbbr ?? originalTeamId;
  if (!isTeamId(owner)) throw new Error(`Draft pick #${pickNumber} is missing a valid ownerAbbr/teamId.`);
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

function normalizeExistingPick(pick) {
  return {
    ...pick,
    round: pick.round ?? (pick.pick <= 30 ? 1 : 2),
    isLottery: pick.isLottery ?? pick.pick <= 14,
    isTopFour: pick.isTopFour ?? pick.pick <= 4,
  };
}

function normalizeDraftOrderInput(currentOrder) {
  if (!currentOrder.length) return [];
  if (typeof currentOrder[0] === 'number') return buildDraftOrderFromLotteryResult(currentOrder);
  return currentOrder.map(item => {
    if ('teamId' in item && typeof item.pick === 'number') return normalizeExistingPick(item);
    return normalizeFromResolvedPick(item);
  }).sort((a, b) => a.pick - b.pick);
}

export function buildDraftOrderFromLotteryResult(lotteryResult) {
  const lotteryPicks = lotteryResult.map((teamId, index) => {
    const pickNumber = index + 1;
    const team = teamByLotteryId(teamId);
    if (!team) throw new Error(`Unknown lottery team id: ${teamId}`);
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
  const fixedPicks = fixedFirstRoundPicks.map(pick => ({
    pick: pick.pick,
    round: 1,
    teamId: pick.ownerAbbr,
    originalTeamId: pick.viaAbbr ?? pick.ownerAbbr,
    isLottery: false,
    isTopFour: false,
  }));
  return [...lotteryPicks, ...fixedPicks].sort((a, b) => a.pick - b.pick);
}

function getDefaultLotteryResult() {
  return officialLotteryOrder
    .map(abbr => lotteryTeams.find(team => team.abbr === abbr)?.id)
    .filter(Boolean);
}

export function getCurrentDraftOrder(currentOrder) {
  if (currentOrder?.length) return normalizeDraftOrderInput(currentOrder);
  return buildDraftOrderFromLotteryResult(getDefaultLotteryResult());
}

export function getTeamPicks(teamId, currentOrder) {
  return getCurrentDraftOrder(currentOrder).filter(pick => pick.teamId === teamId);
}

export function getPickByNumber(pickNumber, currentOrder) {
  return getCurrentDraftOrder(currentOrder).find(pick => pick.pick === pickNumber);
}

export function teamHasPickInRange(teamId, minPick, maxPick, currentOrder) {
  return getTeamPicks(teamId, currentOrder).some(pick => pick.pick >= minPick && pick.pick <= maxPick);
}

export function getLotteryPicks(currentOrder) {
  return getCurrentDraftOrder(currentOrder).filter(pick => pick.isLottery);
}

export function getFirstRoundPicks(currentOrder) {
  return getCurrentDraftOrder(currentOrder).filter(pick => pick.round === 1 && pick.pick <= 30);
}

export function getOriginalLotteryTeamId(teamId) {
  return teamByAbbr(teamId)?.id;
}
