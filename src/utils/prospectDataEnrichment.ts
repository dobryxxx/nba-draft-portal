import type { ProspectExternalData } from './prospectExternalDataLoaders.ts';

export type MatchConfidence = 'high' | 'medium' | 'low' | 'none';

export type AuditSeverity = 'info' | 'warning' | 'critical';

export type ProspectAuditIssue = {
  type: string;
  severity: AuditSeverity;
  field?: string;
  message: string;
  evidence?: string[];
  suggestion?: string;
};

export type EnrichedProspectData = {
  prospectId?: string;
  name: string;
  matchConfidence: MatchConfidence;
  matchedSources: string[];
  originalProspect: any;
  externalStats: {
    profile?: any;
    seasonLines?: any;
    barttorvik?: any;
    shotCreation?: any;
  };
  externalIds: Record<string, string>;
  derivedTraits: {
    creation: number;
    shooting: number;
    rimPressure: number;
    playmaking: number;
    defensivePlaymaking: number;
    rebounding: number;
    rimProtection: number;
    efficiency: number;
    usage: number;
    nbaReadiness: number;
    upside: number;
    risk: number;
  };
  auditFlags: ProspectAuditIssue[];
};

export type ExternalMatches = {
  profile?: { id: string; data: any; score: number };
  seasonLines?: { id: string; data: any; score: number };
  barttorvik?: { id: string; data: any; score: number };
  shotCreation?: { id: string; data: any; score: number };
  warnings: string[];
};

type ExternalDataIndex = {
  profilesByName: Map<string, Array<{ id: string; data: any }>>;
  seasonLinesByName: Map<string, Array<{ id: string; data: any }>>;
  barttorvikByName: Map<string, any[]>;
  shotCreationByName: Map<string, any[]>;
};

const indexCache = new WeakMap<ProspectExternalData, ExternalDataIndex>();

const SCHOOL_ALIASES: Record<string, string> = {
  byu: 'brigham young',
  uconn: 'connecticut',
  'st johns': "st john's",
  'st. johns': "st john's",
  olemiss: 'ole miss',
};

export function normalizePlayerName(name: unknown): string {
  return String(name || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[.'’]/g, '')
    .replace(/\b(jr|sr|iii|ii|iv)\b/gi, '')
    .replace(/[^a-z0-9 ]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export function normalizeSchoolName(name: unknown): string {
  const normalized = String(name || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[.'’]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9 ]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
  return SCHOOL_ALIASES[normalized] || normalized;
}

export function createPlayerMatchKey(player: any): string {
  return `${normalizePlayerName(player?.name || player?.player_name)}|${normalizeSchoolName(player?.team || player?.school)}`;
}

const clamp = (value: number, min = 0, max = 100) => {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
};

const score = (value: number) => Math.round(clamp(value));
const num = (value: any, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const pct = (value: any, fallback = 0) => {
  const parsed = num(value, fallback);
  if (parsed > 1000) return parsed / 100;
  if (parsed > 0 && parsed <= 1) return parsed * 100;
  return parsed;
};

const tokenSimilarity = (a: string, b: string) => {
  const aa = new Set(normalizePlayerName(a).split(' ').filter(Boolean));
  const bb = new Set(normalizePlayerName(b).split(' ').filter(Boolean));
  if (!aa.size || !bb.size) return 0;
  const inter = [...aa].filter((item) => bb.has(item)).length;
  return inter / Math.max(aa.size, bb.size);
};

function candidateName(candidate: any): string {
  return candidate?.name || candidate?.player_name || candidate?.player || '';
}

function candidateSchool(candidate: any): string {
  return candidate?.team || candidate?.school || '';
}

export function calculateMatchConfidence(prospect: any, candidate: any): MatchConfidence {
  const prospectName = normalizePlayerName(prospect?.name);
  const externalName = normalizePlayerName(candidateName(candidate));
  if (!prospectName || !externalName) return 'none';
  if (prospectName !== externalName && tokenSimilarity(prospectName, externalName) < 0.67) return 'none';

  const schoolA = normalizeSchoolName(prospect?.team);
  const schoolB = normalizeSchoolName(candidateSchool(candidate));
  const sameSchool = Boolean(schoolA && schoolB && (schoolA === schoolB || schoolA.includes(schoolB) || schoolB.includes(schoolA)));
  const samePosition = String(candidate?.pos || candidate?.position || '').toLowerCase().includes(String(prospect?.position || '').split('/')[0].toLowerCase());
  const exactName = prospectName === externalName;

  if (exactName && sameSchool) return 'high';
  if (exactName && (samePosition || !schoolB)) return 'medium';
  if (tokenSimilarity(prospectName, externalName) >= 0.8 && sameSchool) return 'medium';
  return exactName ? 'low' : 'none';
}

function bestMatchFromArray(prospect: any, rows: any[], nameField = 'name') {
  let best: any = null;
  for (const row of rows) {
    const confidence = calculateMatchConfidence(prospect, { ...row, name: row[nameField] || row.name });
    const points = confidence === 'high' ? 100 : confidence === 'medium' ? 72 : confidence === 'low' ? 45 : 0;
    if (points > (best?.score || 0)) best = { id: String(row.pid || row.player_id || row.id || row[nameField] || row.name), data: row, score: points };
  }
  return best?.score ? best : undefined;
}

function bestMatchFromObject(prospect: any, obj: Record<string, any>) {
  let best: any = null;
  for (const [id, data] of Object.entries(obj || {})) {
    const confidence = calculateMatchConfidence(prospect, data);
    const points = confidence === 'high' ? 100 : confidence === 'medium' ? 72 : confidence === 'low' ? 45 : 0;
    if (points > (best?.score || 0)) best = { id, data, score: points };
  }
  return best?.score ? best : undefined;
}

function addToMap<T>(map: Map<string, T[]>, key: string, value: T) {
  if (!key) return;
  const rows = map.get(key) || [];
  rows.push(value);
  map.set(key, rows);
}

function getExternalDataIndex(externalData: ProspectExternalData): ExternalDataIndex {
  const cached = indexCache.get(externalData);
  if (cached) return cached;
  const index: ExternalDataIndex = {
    profilesByName: new Map(),
    seasonLinesByName: new Map(),
    barttorvikByName: new Map(),
    shotCreationByName: new Map(),
  };

  Object.entries(externalData.profiles || {}).forEach(([id, data]) => addToMap(index.profilesByName, normalizePlayerName(data?.name), { id, data }));
  Object.entries(externalData.seasonLines || {}).forEach(([id, data]) => addToMap(index.seasonLinesByName, normalizePlayerName(data?.name), { id, data }));
  (externalData.barttorvik || []).forEach((data) => addToMap(index.barttorvikByName, normalizePlayerName(data?.player_name || data?.name), data));
  (externalData.shotCreation || []).forEach((data) => addToMap(index.shotCreationByName, normalizePlayerName(data?.player_name || data?.name), data));

  indexCache.set(externalData, index);
  return index;
}

function candidatesForName<T>(map: Map<string, T[]>, prospect: any): T[] {
  const exact = normalizePlayerName(prospect?.name);
  const direct = map.get(exact);
  if (direct?.length) return direct;
  const tokens = exact.split(' ').filter(Boolean);
  if (tokens.length < 2) return [];
  const last = tokens[tokens.length - 1];
  const first = tokens[0];
  const candidates: T[] = [];
  for (const [key, rows] of map.entries()) {
    if (key.includes(first) && key.includes(last)) candidates.push(...rows);
  }
  return candidates.slice(0, 20);
}

export function findExternalMatches(prospect: any, externalData: ProspectExternalData): ExternalMatches {
  const index = getExternalDataIndex(externalData);
  const profile = bestMatchFromObject(prospect, Object.fromEntries(candidatesForName(index.profilesByName, prospect).map((row: any) => [row.id, row.data])));
  const seasonLines = bestMatchFromObject(prospect, Object.fromEntries(candidatesForName(index.seasonLinesByName, prospect).map((row: any) => [row.id, row.data])));
  const barttorvik = bestMatchFromArray(prospect, candidatesForName(index.barttorvikByName, prospect), 'player_name');
  const shotCreation = bestMatchFromArray(prospect, candidatesForName(index.shotCreationByName, prospect), 'player_name');
  const found = [profile, seasonLines, barttorvik, shotCreation].filter(Boolean).length;
  return {
    profile,
    seasonLines,
    barttorvik,
    shotCreation,
    warnings: found ? [] : ['Nenhum match externo encontrado.'],
  };
}

function latestSeasonLine(match?: { data: any }) {
  const lines = match?.data?.lines || [];
  return [...lines].sort((a, b) => num(b.yr) - num(a.yr))[0];
}

export function deriveTraitsFromExternalData(externalStats: EnrichedProspectData['externalStats']) {
  const profile = externalStats.profile || {};
  const bart = externalStats.barttorvik || {};
  const shot = externalStats.shotCreation || {};
  const line = latestSeasonLine({ data: externalStats.seasonLines }) || {};

  const ppg = num(profile.pts || bart.pts || line.pts);
  const apg = num(profile.ast || bart.ast || line.ast);
  const rpg = num(profile.reb || bart.treb || line.reb);
  const ts = pct(profile.ts || bart.TS_per || line.ts);
  const usg = num(profile.usg || bart.usg || line.usg);
  const bpm = num(profile.bpm || bart.BPM || line.bpm);
  const three = pct(profile.tp_pct || bart.TP_per || shot.tp_pct);
  const ft = pct(profile.ft_pct || bart.FT_per);
  const stl = num(profile.stl_p || bart.stl_per || line.stl);
  const blk = num(profile.blk_p || bart.blk_per || line.blk);
  const selfCreation = num(shot.overall_self_creation);
  const rimFreq = num(shot.rim_freq || profile.rim_f);

  return {
    creation: score((usg - 16) * 3 + selfCreation * 0.45 + apg * 7),
    shooting: score((three - 28) * 2.5 + (ft - 62) * 0.8 + (ts - 50) * 1.2),
    rimPressure: score(rimFreq * 0.9 + ppg * 1.5),
    playmaking: score(apg * 12 + num(profile.ast_p || bart.AST_per) * 0.8),
    defensivePlaymaking: score(stl * 8 + blk * 3 + Math.max(0, bpm) * 2),
    rebounding: score(rpg * 9 + num(profile.drb_p || bart.DRB_per) * 0.8),
    rimProtection: score(blk * 10 + num(profile.blk_p || bart.blk_per) * 1.8),
    efficiency: score((ts - 48) * 3 + Math.max(0, bpm) * 3),
    usage: score((usg - 12) * 4),
    nbaReadiness: score(bpm * 4 + ts + Math.min(20, ppg)),
    upside: score(65 + Math.max(0, usg - 22) * 1.5 + Math.max(0, bpm - 5) * 3 - Math.max(0, num(profile.age, 20) - 20) * 5),
    risk: score(55 + Math.max(0, 52 - ts) * 1.8 + Math.max(0, 1.1 - apg) * 8 - Math.max(0, bpm - 5) * 2),
  };
}

function aggregateConfidence(matches: ExternalMatches): MatchConfidence {
  const scores = [matches.profile, matches.seasonLines, matches.barttorvik, matches.shotCreation].filter(Boolean).map((m) => m!.score);
  const max = Math.max(0, ...scores);
  const count = scores.length;
  if (max >= 100 && count >= 2) return 'high';
  if (max >= 72) return count >= 2 ? 'high' : 'medium';
  if (max >= 45) return 'low';
  return 'none';
}

export function enrichProspectWithExternalData(prospect: any, externalData: ProspectExternalData): EnrichedProspectData {
  const matches = findExternalMatches(prospect, externalData);
  const externalStats = {
    profile: matches.profile?.data,
    seasonLines: matches.seasonLines?.data,
    barttorvik: matches.barttorvik?.data,
    shotCreation: matches.shotCreation?.data,
  };
  const matchedSources = Object.entries(externalStats).filter(([, value]) => value).map(([key]) => key);
  return {
    prospectId: String(prospect?.id ?? ''),
    name: prospect?.name || '',
    matchConfidence: aggregateConfidence(matches),
    matchedSources,
    originalProspect: prospect,
    externalStats,
    externalIds: {
      profileId: matches.profile?.id,
      seasonLinesId: matches.seasonLines?.id,
      barttorvikId: matches.barttorvik?.id,
      shotCreationId: matches.shotCreation?.id,
    },
    derivedTraits: deriveTraitsFromExternalData(externalStats),
    auditFlags: matches.warnings.map((message) => ({ type: 'match', severity: 'warning', message })),
  };
}

export function enrichAllProspects(prospects: any[], externalData: ProspectExternalData): EnrichedProspectData[] {
  return prospects.map((prospect) => enrichProspectWithExternalData(prospect, externalData));
}
