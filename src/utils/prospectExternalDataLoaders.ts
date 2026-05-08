import fs from 'node:fs';
import zlib from 'node:zlib';

export type ExternalDataPaths = {
  profiles?: string;
  seasonLines?: string;
  barttorvik?: string;
  shotCreation?: string;
};

export type ProspectExternalData = {
  profiles: Record<string, any>;
  seasonLines: Record<string, any>;
  barttorvik: any[];
  shotCreation: any[];
};

export const defaultExternalDataPaths: Required<ExternalDataPaths> = {
  profiles: 'C:/Users/Cliente/Downloads/api_profiles.json.gz',
  seasonLines: 'C:/Users/Cliente/Downloads/api_season_lines.json',
  barttorvik: 'C:/Users/Cliente/Downloads/barttorvik_complete_final.csv',
  shotCreation: 'C:/Users/Cliente/Downloads/pbp_shot_creation.csv',
};

const cleanJson = (text: string) =>
  text
    .replace(/\bNaN\b/g, 'null')
    .replace(/\bInfinity\b/g, 'null')
    .replace(/\b-Infinity\b/g, 'null');

export function readJsonObject(path: string, gz = false): Record<string, any> {
  if (!path || !fs.existsSync(path)) return {};
  const buffer = fs.readFileSync(path);
  const text = (gz ? zlib.gunzipSync(buffer) : buffer).toString('utf8');
  return JSON.parse(cleanJson(text));
}

export function parseCsv(text: string): any[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"' && inQuotes && next === '"') {
      cell += '"';
      i += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      row.push(cell);
      cell = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') i += 1;
      row.push(cell);
      if (row.some((value) => value !== '')) rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += char;
    }
  }

  if (cell || row.length) {
    row.push(cell);
    if (row.some((value) => value !== '')) rows.push(row);
  }

  const headers = rows.shift()?.map((header) => header.trim()) || [];
  return rows.map((values) => {
    const record: Record<string, any> = {};
    headers.forEach((header, index) => {
      const raw = values[index] ?? '';
      const trimmed = raw.trim();
      const number = Number(trimmed);
      record[header] = trimmed !== '' && Number.isFinite(number) ? number : trimmed;
    });
    return record;
  });
}

export function readCsv(path: string): any[] {
  if (!path || !fs.existsSync(path)) return [];
  return parseCsv(fs.readFileSync(path, 'utf8'));
}

export function loadProspectExternalData(paths: ExternalDataPaths = {}): ProspectExternalData {
  const resolved = { ...defaultExternalDataPaths, ...paths };
  return {
    profiles: readJsonObject(resolved.profiles, resolved.profiles.endsWith('.gz')),
    seasonLines: readJsonObject(resolved.seasonLines, false),
    barttorvik: readCsv(resolved.barttorvik),
    shotCreation: readCsv(resolved.shotCreation),
  };
}
