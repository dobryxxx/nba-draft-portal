// ============================================================
// Prospect Validation Rules
// ============================================================
// Shared thresholds and helpers for the Prospect Validation Engine.
// These rules are editorial heuristics, not automatic truth.
// ============================================================

export type ProspectTier = 'CORNERSTONE' | 'ELITE' | 'LOTTERY' | 'MID_1ST' | 'FRINGE' | 'SLEEPER';
export type ProspectRole = 'guard' | 'wing' | 'big';
export type Confidence = 'low' | 'medium' | 'high';
export type Severity = 'info' | 'warning' | 'critical';

export const MEASUREMENT_TOLERANCES = {
  heightInches: { info: 1, warning: 2, critical: 3 },
  wingspanInches: { info: 1.5, warning: 3, critical: 4.5 },
  weightPounds: { info: 8, warning: 16, critical: 25 },
} as const;

export const STAT_GRADE_THRESHOLDS = {
  shooting: { elite: 82, plus: 68, solid: 52 },
  creation: { elite: 78, plus: 64, solid: 48 },
  defense: { elite: 78, plus: 63, solid: 48 },
  rebounding: { elite: 80, plus: 65, solid: 48 },
  efficiency: { elite: 80, plus: 66, solid: 50 },
  floor: { elite: 82, plus: 68, solid: 52 },
  ceiling: { elite: 84, plus: 70, solid: 54 },
  risk: { high: 68, medium: 42 },
} as const;

export function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

export function safeNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

export function parseHeightInches(value?: string): number | undefined {
  const match = String(value || '').match(/(\d+)\s*'\s*(\d+(?:\.\d+)?)?/);
  if (!match) return undefined;
  return Number(match[1]) * 12 + Number(match[2] || 0);
}

export function parseWeightPounds(value?: string): number | undefined {
  const match = String(value || '').match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : undefined;
}

export function roleFromPosition(position = ''): ProspectRole {
  const value = String(position).toUpperCase();
  if (value.includes('C') || value.includes('PF')) return 'big';
  if (value.includes('SF') || value.includes('W')) return 'wing';
  return 'guard';
}

export function recommendedTierForRank(rank?: number): ProspectTier {
  if (!rank || !Number.isFinite(rank)) return 'SLEEPER';
  if (rank <= 3) return 'CORNERSTONE';
  if (rank <= 6) return 'ELITE';
  if (rank <= 14) return 'LOTTERY';
  if (rank <= 24) return 'MID_1ST';
  if (rank <= 32) return 'FRINGE';
  return 'SLEEPER';
}

export function tierDistanceScore(current?: string, expected?: string): number {
  const order: ProspectTier[] = ['CORNERSTONE', 'ELITE', 'LOTTERY', 'MID_1ST', 'FRINGE', 'SLEEPER'];
  const a = order.indexOf(String(current || '').toUpperCase() as ProspectTier);
  const b = order.indexOf(String(expected || '').toUpperCase() as ProspectTier);
  if (a < 0 || b < 0) return 0;
  return Math.abs(a - b);
}

export function labelFromScore(value: number): 'Elite' | 'Plus' | 'Solid' | 'Question' {
  if (value >= 82) return 'Elite';
  if (value >= 68) return 'Plus';
  if (value >= 52) return 'Solid';
  return 'Question';
}

export function measurementSeverity(diff: number, thresholds: { info: number; warning: number; critical: number }): Severity {
  if (diff >= thresholds.critical) return 'critical';
  if (diff >= thresholds.warning) return 'warning';
  return 'info';
}
