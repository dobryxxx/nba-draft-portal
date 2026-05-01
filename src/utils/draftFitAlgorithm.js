import { getAllTeamProfiles } from '../data/teamProfiles.js';
import { getCurrentDraftOrder, getTeamPicks } from './draftPickAdapter.js';

const ATTRIBUTE_KEYS = ['shooting', 'creation', 'defense', 'rebounding', 'athleticism', 'size', 'floor', 'ceiling'];
const DEFAULT_WEIGHTS = { draftRangeFit: 0.40, availabilityFit: 0.25, teamNeedFit: 0.20, teamStrategyFit: 0.15 };
const REALISM_ORDER = { High: 0, Medium: 1, Low: 2, Blocked: 3 };
const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, value));
const clamp01 = value => Math.min(1, Math.max(0, value));
const round = value => Math.round(clamp(value));
const pct = value => round(value * 100);
const toScore = (value, max = 10) => typeof value === 'number' && Number.isFinite(value) ? clamp((value / max) * 100) : 0;

function stat(player, key) {
  const value = player?.stats?.[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function attr(player, ...keys) {
  const source = { ...(player?.attributes || {}), ...(player?.scouting?.attributes || {}) };
  for (const key of keys) {
    const direct = source[key];
    if (typeof direct === 'number' && Number.isFinite(direct)) return direct;
    const found = Object.entries(source).find(([name, value]) => name.toLowerCase() === key.toLowerCase() && typeof value === 'number');
    if (found) return found[1];
  }
  return undefined;
}

function role(position = '') {
  const p = String(position).toUpperCase();
  if (p.includes('C') || p.includes('PF')) return 'big';
  if (p.includes('SF') || p.includes('W')) return 'wing';
  return 'guard';
}

function playerRank(player) {
  const value = Number(player?.rank ?? player?.bigBoardRank ?? player?.mockRank ?? 45);
  return Number.isFinite(value) ? clamp(value, 1, 75) : 45;
}

function parseHeightInches(height) {
  const match = String(height || '').match(/(\d+)\s*'\s*(\d+(?:\.\d+)?)?/);
  if (!match) return undefined;
  return Number(match[1]) * 12 + Number(match[2] || 0);
}

function average(values) {
  const valid = values.filter(value => typeof value === 'number' && Number.isFinite(value));
  return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : 0;
}

function wordScore(text, positiveWords, negativeWords = []) {
  const source = String(text || '').toLowerCase();
  const positives = positiveWords.reduce((sum, word) => sum + (source.includes(word) ? 1 : 0), 0);
  const negatives = negativeWords.reduce((sum, word) => sum + (source.includes(word) ? 1 : 0), 0);
  return clamp(50 + positives * 12 - negatives * 12);
}

export function getPlayerDraftAttributes(player) {
  const s = player?.stats || {};
  const scoutingText = [player?.scouting?.notes, ...(player?.scouting?.strengths || []), ...(player?.scouting?.weaknesses || [])].join(' ');
  const playerRole = role(player?.position);
  const height = parseHeightInches(player?.height) ?? (playerRole === 'big' ? 82 : playerRole === 'wing' ? 79 : 75);
  const wingspan = parseHeightInches(player?.wingspan) ?? height;
  const rank = playerRank(player);
  const age = player?.age ?? 20;
  const shooting = average([toScore(attr(player, 'Shooting', 'shooting')), clamp(((stat(player, 'threep') ?? stat(player, 'threePct') ?? 32) - 25) * 5), clamp(((stat(player, 'ftp') ?? stat(player, 'ft') ?? stat(player, 'ftPct') ?? 70) - 55) * 2.4), clamp(((stat(player, 'ts') ?? 54) - 48) * 5.6), wordScore(scoutingText, ['shoot', 'spacing', 'arremesso', '3'], ['preocupante', 'inconsistente'])]);
  const creation = average([toScore(attr(player, 'Playmaking', 'creation', 'playmaking')), clamp(((s.apg ?? 2.5) / 7) * 100), clamp(((s.astTo ?? 1.2) / 3) * 100), clamp(((s.usg ?? 20) - 12) * 4.2), wordScore(scoutingText, ['creator', 'cria', 'handle', 'playmaking', 'passing'], ['turnover', 'decisao'])]);
  const defense = average([toScore(attr(player, 'Defense', 'defense')), clamp(((s.stlPct ?? 1.7) / 4.5) * 100), clamp(((s.blkPct ?? 1.8) / 8) * 100), wordScore(scoutingText, ['defense', 'defesa', 'switch', 'rim protection', 'steal'], ['defensivo preocupante', 'lento'])]);
  const rebounding = average([toScore(attr(player, 'Rebounding', 'rebounding')), clamp(((s.rpg ?? 4.5) / (playerRole === 'big' ? 11 : 7)) * 100), wordScore(scoutingText, ['rebound', 'rebote', 'motor'], ['rebounding concern'])]);
  const athleticism = average([toScore(attr(player, 'Athleticism', 'athleticism')), clamp(50 + Math.max(0, wingspan - height) * 5 + (age <= 19 ? 8 : 0) + (playerRole !== 'guard' ? 4 : 0)), wordScore(scoutingText, ['athletic', 'explosivo', 'transition', 'vertical', 'speed'], ['below average athlete'])]);
  const size = average([toScore(attr(player, 'Size', 'size')), clamp(((height - 72) / 13) * 70 + Math.max(0, wingspan - height) * 5 + (playerRole !== 'guard' ? 10 : 0)), wordScore([player?.height, player?.wingspan, scoutingText].join(' '), ['size', 'length', 'longo', 'wingspan'], ['undersized'])]);
  const floor = average([toScore(attr(player, 'Floor', 'floor')), clamp((s.ts ?? 54) * 1.25 - 25), clamp((s.per ?? 18) * 3.5), shooting * 0.20 + defense * 0.25 + creation * 0.15 + 35]);
  const ceiling = average([toScore(attr(player, 'Ceiling', 'ceiling')), clamp((100 - rank) + 18), clamp(((s.ppg ?? 10) / 24) * 100), clamp(((s.usg ?? 18) - 12) * 4.5), creation * 0.25 + athleticism * 0.2 + size * 0.15 + shooting * 0.18]);
  return { shooting: round(shooting), creation: round(creation), defense: round(defense), rebounding: round(rebounding), athleticism: round(athleticism), size: round(size), floor: round(floor), ceiling: round(ceiling) };
}

function rangeTier(expectedPick) {
  if (expectedPick <= 3) return 'top_3';
  if (expectedPick <= 5) return 'top_5';
  if (expectedPick <= 14) return 'lottery';
  if (expectedPick <= 22) return 'mid_first';
  if (expectedPick <= 30) return 'late_first';
  return 'second_round';
}

function explicitRange(player) {
  const raw = player?.draftRange ?? player?.projectedRange;
  if (!raw) return undefined;
  let minPick, maxPick, expectedPick;
  if (Array.isArray(raw)) {
    minPick = Number(raw[0]); maxPick = Number(raw[1] ?? raw[0]);
  } else if (typeof raw === 'object') {
    minPick = Number(raw.minPick ?? raw.min); maxPick = Number(raw.maxPick ?? raw.max); expectedPick = Number(raw.expectedPick ?? raw.expected);
  } else if (typeof raw === 'string') {
    const nums = raw.match(/\d+/g)?.map(Number) || [];
    if (/top\s*3/i.test(raw)) { minPick = 1; maxPick = 4; }
    else if (/top\s*5/i.test(raw)) { minPick = 2; maxPick = 7; }
    else if (/lottery/i.test(raw)) { minPick = 1; maxPick = 14; }
    else if (nums.length >= 2) { [minPick, maxPick] = nums; }
    else if (nums.length === 1) { minPick = Math.max(1, nums[0] - 3); maxPick = nums[0] + 5; expectedPick = nums[0]; }
  }
  if (!Number.isFinite(minPick) || !Number.isFinite(maxPick)) return undefined;
  const min = Math.max(1, Math.round(Math.min(minPick, maxPick)));
  const max = Math.max(min, Math.round(Math.max(minPick, maxPick)));
  const expected = Number.isFinite(expectedPick) ? Math.round(expectedPick) : Math.round((min + max) / 2);
  return { minPick: min, maxPick: max, expectedPick: clamp(expected, min, max), tier: rangeTier(expected) };
}

export function getPlayerExpectedRange(player) {
  const explicit = explicitRange(player);
  if (explicit) return explicit;
  const rank = playerRank(player);
  if (rank <= 3) return { minPick: 1, maxPick: 4, expectedPick: rank, tier: 'top_3' };
  if (rank <= 5) return { minPick: 2, maxPick: 7, expectedPick: rank, tier: 'top_5' };
  if (rank <= 10) return { minPick: 5, maxPick: 13, expectedPick: rank, tier: 'lottery' };
  if (rank <= 14) return { minPick: 8, maxPick: 18, expectedPick: rank, tier: 'lottery' };
  if (rank <= 22) return { minPick: 12, maxPick: 28, expectedPick: rank, tier: 'mid_first' };
  if (rank <= 30) return { minPick: 18, maxPick: 35, expectedPick: rank, tier: 'late_first' };
  return { minPick: Math.max(1, Math.round(rank - 8)), maxPick: Math.round(rank + 15), expectedPick: Math.round(rank), tier: 'second_round' };
}

function pickDistanceToRange(pick, range) {
  if (pick >= range.minPick && pick <= range.maxPick) return 0;
  return pick < range.minPick ? range.minPick - pick : pick - range.maxPick;
}

function scorePickForRange(pick, range) {
  const pickNumber = pick.pick;
  const span = Math.max(1, range.maxPick - range.minPick);
  const expectedDistance = Math.abs(pickNumber - range.expectedPick);
  if (pickNumber >= range.minPick && pickNumber <= range.maxPick) {
    return { bestPick: pick, compatibility: clamp01(1 - (expectedDistance / (span + 4)) * 0.18), status: 'ideal', explanation: `Pick #${pickNumber} dentro do range esperado (#${range.minPick}-#${range.maxPick}).` };
  }
  const distance = pickDistanceToRange(pickNumber, range);
  if (distance <= 3) {
    const side = pickNumber < range.minPick ? 'um pouco antes' : 'um pouco depois';
    return { bestPick: pick, compatibility: clamp01(0.84 - distance * 0.035), status: 'reachable', explanation: `Pick #${pickNumber} fica ${side} do range esperado (#${range.minPick}-#${range.maxPick}).` };
  }
  if (pickNumber < range.minPick - 3) {
    const reachSize = range.expectedPick - pickNumber;
    return { bestPick: pick, compatibility: clamp01(0.68 - Math.max(0, reachSize - 6) * 0.035), status: 'reach', explanation: `Pick #${pickNumber} seria reach para um jogador projetado entre #${range.minPick}-#${range.maxPick}.` };
  }
  return { bestPick: pick, compatibility: clamp01(0.55 - (pickNumber - range.maxPick - 3) * 0.055), status: 'unlikely_available', explanation: `Pick #${pickNumber} fora do range: jogador tende a sair antes (#${range.minPick}-#${range.maxPick}).` };
}

export function getPickCompatibility(playerRange, teamPicks) {
  const firstRoundPicks = teamPicks.filter(pick => pick.round === 1 && pick.pick <= 30);
  if (!firstRoundPicks.length) return { compatibility: 0, status: 'no_pick', explanation: 'Sem escolha de primeira rodada compativel.' };
  const statusRank = { ideal: 0, reachable: 1, reach: 2, unlikely_available: 3, no_pick: 4 };
  return firstRoundPicks.map(pick => scorePickForRange(pick, playerRange)).sort((a, b) => statusRank[a.status] - statusRank[b.status] || b.compatibility - a.compatibility)[0];
}

export function getDraftRangeFit(player, teamPicks) {
  return pct(getPickCompatibility(getPlayerExpectedRange(player), teamPicks).compatibility);
}

export function getAvailabilityFit(player, teamPicks) {
  const compatibility = getPickCompatibility(getPlayerExpectedRange(player), teamPicks);
  const map = { ideal: 95, reachable: 78, reach: 66, unlikely_available: 28, no_pick: 0 };
  if (compatibility.status === 'ideal' || compatibility.status === 'reachable') return round(map[compatibility.status] * (0.85 + compatibility.compatibility * 0.15));
  if (compatibility.status === 'reach') return round(map.reach * compatibility.compatibility);
  if (compatibility.status === 'unlikely_available') return round(55 * compatibility.compatibility);
  return 0;
}

function weightedAverage(values, weights) {
  const totalWeight = ATTRIBUTE_KEYS.reduce((sum, key) => sum + (weights[key] || 0), 0) || 1;
  return ATTRIBUTE_KEYS.reduce((sum, key) => sum + values[key] * (weights[key] || 0), 0) / totalWeight;
}

function calculateTeamNeedFit(player, teamProfile) {
  const attrs = getPlayerDraftAttributes(player);
  const weightedNeeds = ATTRIBUTE_KEYS.reduce((acc, key) => { acc[key] = teamProfile.needs[key] * (teamProfile.playerAttributeWeights[key] || 0); return acc; }, {});
  return round(weightedAverage(attrs, weightedNeeds));
}

function priorityScore(priority, attrs) {
  const map = { spacing: attrs.shooting, creation: attrs.creation, guard_creation: attrs.creation, defense: attrs.defense, rebounding: attrs.rebounding, athleticism: attrs.athleticism, size: attrs.size, floor: attrs.floor, ceiling: attrs.ceiling, two_way: (attrs.defense + attrs.shooting + attrs.size) / 3, frontcourt_depth: (attrs.size + attrs.rebounding + attrs.defense) / 3 };
  return map[priority] ?? 50;
}

function modeScore(mode, attrs) {
  const map = { talent_accumulation: attrs.ceiling * 0.55 + attrs.creation * 0.25 + attrs.athleticism * 0.20, upside_swing: attrs.ceiling * 0.55 + attrs.athleticism * 0.25 + attrs.size * 0.20, core_builder: attrs.ceiling * 0.35 + attrs.creation * 0.25 + attrs.shooting * 0.15 + attrs.defense * 0.15 + attrs.floor * 0.10, playoff_support: attrs.floor * 0.32 + attrs.defense * 0.24 + attrs.shooting * 0.22 + attrs.size * 0.12 + attrs.creation * 0.10, win_now_support: attrs.floor * 0.38 + attrs.shooting * 0.24 + attrs.defense * 0.22 + attrs.creation * 0.10 + attrs.rebounding * 0.06, contender_depth: attrs.floor * 0.40 + attrs.defense * 0.24 + attrs.shooting * 0.22 + attrs.rebounding * 0.08 + attrs.ceiling * 0.06 };
  return map[mode] ?? 50;
}

function riskScore(teamProfile, attrs) {
  if (teamProfile.riskTolerance === 'high') return attrs.ceiling * 0.7 + attrs.floor * 0.3;
  if (teamProfile.riskTolerance === 'low') return attrs.floor * 0.75 + attrs.ceiling * 0.25;
  return attrs.floor * 0.5 + attrs.ceiling * 0.5;
}

function timelineScore(teamProfile, attrs) {
  if (teamProfile.timeline === 'deep_rebuild' || teamProfile.timeline === 'early_rebuild') return attrs.ceiling * 0.55 + attrs.creation * 0.20 + attrs.athleticism * 0.15 + attrs.floor * 0.10;
  if (teamProfile.timeline === 'development_core' || teamProfile.timeline === 'rising_core') return attrs.ceiling * 0.35 + attrs.floor * 0.25 + attrs.shooting * 0.18 + attrs.defense * 0.12 + attrs.creation * 0.10;
  return attrs.floor * 0.45 + attrs.shooting * 0.22 + attrs.defense * 0.18 + attrs.creation * 0.10 + attrs.ceiling * 0.05;
}

function calculateTeamStrategyFit(player, teamProfile) {
  const attrs = getPlayerDraftAttributes(player);
  return round(priorityScore(teamProfile.priority, attrs) * 0.30 + modeScore(teamProfile.draftMode, attrs) * 0.30 + riskScore(teamProfile, attrs) * 0.22 + timelineScore(teamProfile, attrs) * 0.18);
}

export function getRealismLabel(player, teamPicks) {
  const compatibility = getPickCompatibility(getPlayerExpectedRange(player), teamPicks);
  if (compatibility.status === 'no_pick') return 'Blocked';
  if (compatibility.status === 'unlikely_available') return 'Low';
  if (compatibility.status === 'reach') return compatibility.compatibility >= 0.55 ? 'Medium' : 'Low';
  if (compatibility.status === 'reachable') return 'Medium';
  return 'High';
}

export function getDraftFitLabel(score, isBlocked) {
  if (isBlocked) return 'Blocked Fit';
  if (score >= 86) return 'Elite Draft Fit';
  if (score >= 74) return 'Strong Draft Fit';
  if (score >= 60) return 'Good Draft Fit';
  return 'Weak Draft Fit';
}

function needReason(teamProfile, attrs) {
  const pairs = ATTRIBUTE_KEYS.map(key => ({ key, need: teamProfile.needs[key], value: attrs[key], score: teamProfile.needs[key] * attrs[key] })).sort((a, b) => b.score - a.score);
  const top = pairs[0];
  const flags = [];
  if (top.key === 'shooting') flags.push('Shooting need');
  if (top.key === 'creation') flags.push('Creation need');
  if (top.key === 'defense') flags.push('Defensive need');
  if (top.key === 'floor') flags.push('Floor fit');
  if (top.key === 'ceiling') flags.push('Upside swing');
  const labels = { shooting: 'arremesso/spacing', creation: 'criacao com bola', defense: 'defesa', rebounding: 'rebote', athleticism: 'atletismo', size: 'tamanho', floor: 'piso', ceiling: 'teto' };
  return { reason: `O perfil de ${labels[top.key]} responde uma prioridade relevante do time.`, flags };
}

function strategyFlags(teamProfile, attrs) {
  const flags = [];
  if (teamProfile.draftMode === 'talent_accumulation' || teamProfile.draftMode === 'upside_swing') flags.push('Rebuild upside');
  if (teamProfile.draftMode === 'win_now_support' || teamProfile.draftMode === 'contender_depth' || teamProfile.draftMode === 'playoff_support') flags.push('Win-now support');
  if (teamProfile.riskTolerance === 'low' && attrs.floor >= 65) flags.push('Low-risk profile');
  if (teamProfile.riskTolerance === 'high' && attrs.ceiling - attrs.floor >= 18) flags.push('High-variance bet');
  return flags;
}

export function generateDraftFitReasons(player, teamProfile, fitComponents, pickCompatibility) {
  const attrs = getPlayerDraftAttributes(player);
  const range = getPlayerExpectedRange(player);
  const reasons = [];
  const flags = [];
  const pick = pickCompatibility.bestPick;
  if (pickCompatibility.status === 'ideal' && pick) { reasons.push(`O time possui a escolha #${pick.pick}, dentro do range esperado do jogador (#${range.minPick}-#${range.maxPick}).`); flags.push('Pick range match', 'Likely available'); }
  else if (pickCompatibility.status === 'reachable' && pick) { reasons.push(`A escolha #${pick.pick} fica perto do range esperado (#${range.minPick}-#${range.maxPick}), mantendo uma janela realista.`); flags.push('Likely available'); }
  else if (pickCompatibility.status === 'reach' && pick) { reasons.push(`A escolha #${pick.pick} seria acima do range esperado do jogador (#${range.minPick}-#${range.maxPick}).`); flags.push('Reach risk'); }
  else if (pickCompatibility.status === 'unlikely_available' && pick) { reasons.push(`A escolha #${pick.pick} fica tarde demais para um prospecto projetado entre #${range.minPick}-#${range.maxPick}.`); flags.push('Unlikely available'); }
  else { reasons.push('Sem pick compativel na primeira rodada, o encaixe fica bloqueado pelo draft capital.'); flags.push('Blocked by draft capital'); }
  const need = needReason(teamProfile, attrs);
  reasons.push(need.reason);
  flags.push(...need.flags);
  const editorial = teamProfile.editorial?.strategy || teamProfile.editorial?.notes?.[0];
  reasons.push(editorial ? `Estrategia editorial: ${editorial}` : 'A estrategia editorial do time conversa com este tipo de aposta no draft.');
flags.push(...strategyFlags(teamProfile, attrs));
  return { reasons: [...new Set(reasons)].slice(0, 3), flags: [...new Set(flags)].slice(0, 6) };
}

function scoreCap(status) {
  if (status === 'no_pick') return 35;
  if (status === 'unlikely_available') return 55;
  if (status === 'reach') return 68;
  if (status === 'reachable') return 85;
  return 100;
}

function pickContext(range, compatibility) {
  const pick = compatibility.bestPick?.pick;
  if (compatibility.status === 'ideal' && pick) return `Pick #${pick} dentro do range esperado (#${range.minPick}-#${range.maxPick}).`;
  if (compatibility.status === 'reachable' && pick) return `Pick #${pick} perto do range esperado (#${range.minPick}-#${range.maxPick}).`;
  if (compatibility.status === 'reach' && pick) return `Pick #${pick} seria reach para um jogador projetado entre #${range.minPick}-#${range.maxPick}.`;
  if (compatibility.status === 'unlikely_available' && pick) return `Pick #${pick} fora do range: jogador tende a sair antes.`;
  return 'Sem escolha de primeira rodada compativel.';
}

export function calculateDraftFit(player, teamProfile, currentOrder) {
  const teamPicks = getTeamPicks(teamProfile.id, currentOrder);
  const playerRange = getPlayerExpectedRange(player);
  const pickCompatibility = getPickCompatibility(playerRange, teamPicks);
  const components = {
    teamNeedFit: calculateTeamNeedFit(player, teamProfile),
    teamStrategyFit: calculateTeamStrategyFit(player, teamProfile),
    draftRangeFit: pct(pickCompatibility.compatibility),
    availabilityFit: getAvailabilityFit(player, teamPicks),
  };
  const weightedScore = components.draftRangeFit * DEFAULT_WEIGHTS.draftRangeFit + components.availabilityFit * DEFAULT_WEIGHTS.availabilityFit + components.teamNeedFit * DEFAULT_WEIGHTS.teamNeedFit + components.teamStrategyFit * DEFAULT_WEIGHTS.teamStrategyFit;
  const score = round(Math.min(weightedScore, scoreCap(pickCompatibility.status)));
  const blocked = pickCompatibility.status === 'no_pick';
  const realism = blocked ? 'Blocked' : getRealismLabel(player, teamPicks);
  const { reasons, flags } = generateDraftFitReasons(player, teamProfile, components, pickCompatibility);
  return { teamId: teamProfile.id, teamName: teamProfile.name, score, label: getDraftFitLabel(score, blocked), realism, pickContext: pickContext(playerRange, pickCompatibility), reasons, flags, components, debug: { playerRange, pickCompatibility } };
}

export function getBestDraftFits(player, options = {}) {
  const { limit = 5, includeBlocked = false, currentOrder } = options;
  const order = getCurrentDraftOrder(currentOrder);
  return getAllTeamProfiles()
    .map(team => calculateDraftFit(player, team, order))
    .filter(result => includeBlocked || result.realism !== 'Blocked')
    .sort((a, b) => REALISM_ORDER[a.realism] - REALISM_ORDER[b.realism] || b.score - a.score)
    .slice(0, limit);
}

