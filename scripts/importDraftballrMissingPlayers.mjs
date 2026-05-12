import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const PROSPECTS_PATH = path.join(ROOT, 'src', 'data', 'prospects.js');
const REPORT_JSON_PATH = path.join(ROOT, 'src', 'data', 'generated', 'draftballrImportReport.json');
const REPORT_MD_PATH = path.join(ROOT, 'src', 'data', 'generated', 'draftballrImportReport.md');
const DRAFTBALLR_STATS_URL = 'https://draftballr.com/stats';

const args = new Set(process.argv.slice(2));
const isDryRun = args.has('--dry-run') || args.has('--dry') || args.has('-d');

const roundOne = value => (typeof value === 'number' && Number.isFinite(value) ? Math.round(value * 10) / 10 : null);
const cleanString = value => (typeof value === 'string' && value.trim() ? value.trim() : '');
const hasValue = value => value !== null && value !== undefined && value !== '';

export function normalizePlayerName(name, { stripSuffix = true } = {}) {
  const base = String(name || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\b(a\.?\s*j\.?)\b/g, 'aj')
    .replace(/[.'’`-]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!stripSuffix) return base;
  return base
    .replace(/\b(jr|sr|ii|iii|iv|v)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugifyName(name) {
  return normalizePlayerName(name)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function getLastNameKey(name) {
  const parts = normalizePlayerName(name).split(' ').filter(Boolean);
  return parts.at(-1) || '';
}

function nameDistance(a, b) {
  const left = normalizePlayerName(a);
  const right = normalizePlayerName(b);
  if (!left || !right) return 99;
  const matrix = Array.from({ length: left.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= right.length; j += 1) matrix[0][j] = j;
  for (let i = 1; i <= left.length; i += 1) {
    for (let j = 1; j <= right.length; j += 1) {
      const cost = left[i - 1] === right[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[left.length][right.length];
}

function normalizePosition(position) {
  const value = cleanString(position).toLowerCase();
  if (!value) return '';
  if (value.includes('pure pg')) return 'PG';
  if (value.includes('scoring pg') || value.includes('combo')) return 'PG/SG';
  if (value.includes('wing g')) return 'SG/SF';
  if (value.includes('wing f')) return 'SF/PF';
  if (value.includes('stretch') || value.includes('pf/c')) return 'PF/C';
  if (value === 'c' || value.includes('center')) return 'C';
  if (value.includes('guard')) return 'GUARD';
  if (value.includes('wing')) return 'WING';
  if (value.includes('forward')) return 'FORWARD';
  return cleanString(position);
}

function formatHeight(height) {
  const value = cleanString(height);
  const match = value.match(/^(\d+)-(\d+)$/);
  if (!match) return value;
  return `${match[1]}'${match[2]}"`;
}

function formatWeight(weight) {
  if (typeof weight !== 'number' || !Number.isFinite(weight)) return '';
  return `${Math.round(weight)} lbs`;
}

function mapDraftballrPlayerToProspect(player, id, fallbackRank) {
  const rank = Number.isFinite(player.big_board_rank) ? Number(player.big_board_rank) : fallbackRank;
  const threepa = roundOne(player.three_a);
  const threepm = roundOne(player.three_m);
  const fga = hasValue(player.two_a) && hasValue(player.three_a) ? roundOne(player.two_a + player.three_a) : null;
  const fgm = hasValue(player.two_m) && hasValue(player.three_m) ? roundOne(player.two_m + player.three_m) : null;

  return {
    id,
    name: player.player,
    position: normalizePosition(player.position),
    team: cleanString(player.team),
    age: roundOne(player.draft_age),
    height: formatHeight(player.height),
    weight: formatWeight(player.weight_lbs),
    wingspan: player.wingspan_in ? `${Math.floor(player.wingspan_in / 12)}'${Math.round(player.wingspan_in % 12)}"` : '',
    tier: 'SLEEPER',
    rank,
    stats: {
      ppg: roundOne(player.ppg),
      rpg: roundOne(player.rpg),
      apg: roundOne(player.apg),
      fgp: roundOne(player.fg_pct ?? null),
      threep: roundOne(player.three_pct),
      ftp: roundOne(player.ft_pct),
      per: null,
      ts: roundOne(player.ts),
      usg: roundOne(player.usg),
      efg: roundOne(player.efg),
      astTo: roundOne(player.ast_tov_ratio),
      blkPct: roundOne(player.blk_pct),
      stlPct: roundOne(player.stl_pct),
      games: Number.isFinite(player.games) ? player.games : null,
      fgm,
      fga,
      threepm,
      threepa,
      ftm: roundOne(player.ftm),
      fta: roundOne(player.fta)
    },
    scouting: {
      strengths: [],
      weaknesses: [],
      notes: 'Descrição em andamento',
      attributes: {
        Athleticism: null,
        Shooting: null,
        Playmaking: null,
        Defense: null,
        Rebounding: null,
        BBIQ: null
      },
      evaluation: {
        version: 'draftballr_import_basic_v1',
        floor: {
          score: null,
          label: '',
          note: ''
        },
        ceiling: {
          score: null,
          label: '',
          note: ''
        },
        risk: {
          level: '',
          reason: '',
          note: ''
        },
        tools: {
          shooting: '',
          creation: '',
          defense: '',
          rebounding: '',
          efficiency: ''
        },
        note: 'Imported automatically with basic DraftBallr data. Review manually before editorial use.'
      }
    },
    accentColor: '#38bdf8',
    source: 'draftballr',
    dataStatus: 'imported-basic',
    needsReview: true,
    draftballr: {
      playerId: player.player_id ?? null,
      rowId: player.id ?? null,
      slug: player.player_slug || slugifyName(player.player),
      position: player.position || null,
      classYear: player.class || null,
      conference: player.conf || null,
      bigBoardRank: Number.isFinite(player.big_board_rank) ? player.big_board_rank : null,
      draftable: Boolean(player.draftable),
      importedAt: new Date().toISOString()
    }
  };
}

async function loadLocalProspects() {
  const moduleUrl = pathToFileURL(PROSPECTS_PATH).href + `?cacheBust=${Date.now()}`;
  const mod = await import(moduleUrl);
  return Array.isArray(mod.prospects) ? mod.prospects : [];
}

function extractInitialPlayersFromHtml(html) {
  const startMarkerIndex = html.indexOf('initialPlayers');
  if (startMarkerIndex === -1) {
    throw new Error('DraftBallr initialPlayers payload was not found in the page HTML.');
  }

  const arrayStart = html.indexOf('[{', startMarkerIndex);
  const endMarker = '],\\"initialFilterOptions\\":';
  const arrayEnd = html.indexOf(endMarker, arrayStart);
  if (arrayStart === -1 || arrayEnd === -1) {
    throw new Error('DraftBallr initialPlayers payload was found but could not be bounded.');
  }

  const escapedJson = html.slice(arrayStart, arrayEnd + 1);
  const json = escapedJson
    .replace(/\\u0026/g, '&')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\');

  return JSON.parse(json);
}

async function fetchDraftballrPlayers() {
  const response = await fetch(DRAFTBALLR_STATS_URL, {
    headers: {
      'user-agent': 'Mozilla/5.0 Draft Importer (local audit)',
      accept: 'text/html,application/xhtml+xml'
    }
  });

  if (!response.ok) {
    throw new Error(`DraftBallr request failed with status ${response.status}.`);
  }

  const html = await response.text();
  const players = extractInitialPlayersFromHtml(html);
  return players.filter(player => player && player.player && player.year === 2026 && player.draftable === true);
}

function buildComparison(localProspects, draftballrPlayers) {
  const exactNames = new Set(localProspects.map(player => normalizePlayerName(player.name)));
  const strictNames = new Set(localProspects.map(player => normalizePlayerName(player.name, { stripSuffix: false })));
  const maxId = Math.max(0, ...localProspects.map(player => Number(player.id)).filter(Number.isFinite));
  const maxRank = Math.max(0, ...localProspects.map(player => Number(player.rank)).filter(Number.isFinite));
  const maxDraftballrRank = Math.max(0, ...draftballrPlayers.map(player => Number(player.big_board_rank)).filter(Number.isFinite));

  const existing = [];
  const possibleDuplicates = [];
  const skipped = [];
  const additions = [];

  let nextId = maxId + 1;
  let nextFallbackRank = Math.max(maxRank, maxDraftballrRank) + 1;

  for (const player of draftballrPlayers) {
    const normalized = normalizePlayerName(player.player);
    const strict = normalizePlayerName(player.player, { stripSuffix: false });

    if (exactNames.has(normalized) || strictNames.has(strict)) {
      existing.push(player.player);
      continue;
    }

    const sameLastNameCandidates = localProspects
      .filter(local => getLastNameKey(local.name) && getLastNameKey(local.name) === getLastNameKey(player.player))
      .map(local => ({
        localName: local.name,
        localPosition: local.position,
        distance: nameDistance(local.name, player.player)
      }))
      .filter(candidate => candidate.distance <= 3);

    if (sameLastNameCandidates.length) {
      possibleDuplicates.push({
        draftballrName: player.player,
        draftballrPosition: player.position,
        candidates: sameLastNameCandidates
      });
      continue;
    }

    if (!cleanString(player.player)) {
      skipped.push({ player, reason: 'Missing player name.' });
      continue;
    }

    const fallbackRank = Number.isFinite(player.big_board_rank) ? Number(player.big_board_rank) : nextFallbackRank++;
    additions.push(mapDraftballrPlayerToProspect(player, nextId++, fallbackRank));
  }

  return { existing, possibleDuplicates, skipped, additions };
}

function stringifyProspectForFile(prospect) {
  return JSON.stringify(prospect, null, 2).replace(/\n/g, '\n  ');
}

function updateDraftMeta(source, prospectsAfterImport) {
  const tierCounts = prospectsAfterImport.reduce((acc, prospect) => {
    const tier = prospect.tier || 'SLEEPER';
    acc[tier] = (acc[tier] || 0) + 1;
    return acc;
  }, {});

  return source
    .replace(/"totalProspects":\s*\d+/, `"totalProspects": ${prospectsAfterImport.length}`)
    .replace(
      /"tiers":\s*\{[\s\S]*?\n\s*\}/,
      `"tiers": ${JSON.stringify(tierCounts, null, 4).replace(/\n/g, '\n  ')}`
    )
    .replace(/"lastUpdated":\s*"[^"]+"/, `"lastUpdated": "${new Date().toISOString().slice(0, 10)}"`);
}

async function appendProspectsToFile(additions, prospectsAfterImport) {
  if (!additions.length) return;

  const source = await fs.readFile(PROSPECTS_PATH, 'utf8');
  const markerMatch = source.match(/\r?\n\];\r?\n\r?\nexport const draftMeta/);
  if (!markerMatch || markerMatch.index === undefined) {
    throw new Error('Could not find the end of the prospects array in src/data/prospects.js.');
  }
  const markerIndex = markerMatch.index;

  const prefix = source.slice(0, markerIndex);
  const suffix = source.slice(markerIndex);
  const needsComma = !prefix.trimEnd().endsWith('[');
  const insertion = `${needsComma ? ',' : ''}\n  ${additions.map(stringifyProspectForFile).join(',\n  ')}`;
  const nextSource = updateDraftMeta(prefix + insertion + suffix, prospectsAfterImport);
  await fs.writeFile(PROSPECTS_PATH, nextSource, 'utf8');
}

function buildReport({ draftballrPlayers, comparison }) {
  const report = {
    source: DRAFTBALLR_STATS_URL,
    generatedAt: new Date().toISOString(),
    dryRun: isDryRun,
    totals: {
      foundDraftballrDraftable: draftballrPlayers.length,
      alreadyExisting: comparison.existing.length,
      added: comparison.additions.length,
      possibleDuplicates: comparison.possibleDuplicates.length,
      skipped: comparison.skipped.length
    },
    addedPlayers: comparison.additions.map(player => ({
      id: player.id,
      rank: player.rank,
      name: player.name,
      position: player.position,
      team: player.team,
      status: player.dataStatus,
      needsReview: player.needsReview
    })),
    alreadyExisting: comparison.existing,
    possibleDuplicates: comparison.possibleDuplicates,
    skipped: comparison.skipped.map(item => ({
      name: item.player?.player || '',
      reason: item.reason
    }))
  };

  return report;
}

function toMarkdown(report) {
  const added = report.addedPlayers.length
    ? report.addedPlayers.map(player => `- #${player.rank ?? '-'} ${player.name} (${player.position || '-'}) — ${player.team || '-'}`).join('\n')
    : '- Nenhum jogador novo.';

  const duplicates = report.possibleDuplicates.length
    ? report.possibleDuplicates
      .map(item => `- ${item.draftballrName} (${item.draftballrPosition || '-'}) possível duplicata de: ${item.candidates.map(c => `${c.localName} / ${c.localPosition || '-'}`).join(', ')}`)
      .join('\n')
    : '- Nenhuma possível duplicata bloqueada.';

  const skipped = report.skipped.length
    ? report.skipped.map(item => `- ${item.name || 'Sem nome'}: ${item.reason}`).join('\n')
    : '- Nenhum jogador ignorado.';

  return `# DraftBallr Import Report

Fonte: ${report.source}

Gerado em: ${report.generatedAt}

Modo: ${report.dryRun ? 'dry-run, sem alteração de arquivos' : 'importação real'}

## Totais

- Encontrados no DraftBallr como draftable: ${report.totals.foundDraftballrDraftable}
- Já existentes no site: ${report.totals.alreadyExisting}
- Novos ${report.dryRun ? 'que seriam adicionados' : 'adicionados'}: ${report.totals.added}
- Possíveis duplicatas bloqueadas: ${report.totals.possibleDuplicates}
- Ignorados: ${report.totals.skipped}

## Jogadores ${report.dryRun ? 'que seriam adicionados' : 'adicionados'}

${added}

## Possíveis duplicatas para revisão manual

${duplicates}

## Ignorados

${skipped}
`;
}

async function writeReport(report) {
  await fs.mkdir(path.dirname(REPORT_JSON_PATH), { recursive: true });
  await fs.writeFile(REPORT_JSON_PATH, JSON.stringify(report, null, 2), 'utf8');
  await fs.writeFile(REPORT_MD_PATH, toMarkdown(report), 'utf8');
}

async function main() {
  const [localProspects, draftballrPlayers] = await Promise.all([
    loadLocalProspects(),
    fetchDraftballrPlayers()
  ]);

  const comparison = buildComparison(localProspects, draftballrPlayers);
  const report = buildReport({ draftballrPlayers, comparison });

  if (!isDryRun) {
    await appendProspectsToFile(comparison.additions, [...localProspects, ...comparison.additions]);
  }

  await writeReport(report);

  console.log('\nDraftBallr Import Report');
  console.log(`- Found draftable: ${report.totals.foundDraftballrDraftable}`);
  console.log(`- Already existing: ${report.totals.alreadyExisting}`);
  console.log(`- ${isDryRun ? 'Would add' : 'Added'}: ${report.totals.added}`);
  console.log(`- Possible duplicates: ${report.totals.possibleDuplicates}`);
  console.log(`- Skipped: ${report.totals.skipped}`);
  console.log(`- Report JSON: ${path.relative(ROOT, REPORT_JSON_PATH)}`);
  console.log(`- Report MD: ${path.relative(ROOT, REPORT_MD_PATH)}\n`);

  if (isDryRun) {
    console.log('Dry-run complete. No prospect data was changed.');
  }
}

main().catch(error => {
  console.error('\nDraftBallr import failed.');
  console.error(error);
  process.exitCode = 1;
});
