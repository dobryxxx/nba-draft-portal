import {
  getTeamDraftIntelligence,
  type DraftMode,
  type RiskTolerance,
  type TeamDraftIntelligence,
  type TeamId,
  type TeamNeeds,
  type TeamTimeline,
} from './teamDraftIntelligence.ts';
import {
  TEAM_ARCHETYPE_PREFERENCES,
  TEAM_DRAFT_MODE_OPTIONS,
  TEAM_NEED_LEVELS,
  TEAM_POSITION_GROUPS,
  TEAM_RISK_TOLERANCE_OPTIONS,
  TEAM_STRATEGIC_PRIORITIES,
  TEAM_TIMELINE_OPTIONS,
  needLevelToScore,
  type TeamArchetypePreference,
  type TeamDraftModeOption,
  type TeamNeedLevel,
  type TeamPositionGroup,
  type TeamRiskToleranceOption,
  type TeamStrategicPriority,
  type TeamTimelineOption,
} from './teamOptionSchema.ts';

export type TeamManualNeeds = {
  primaryCreation?: TeamNeedLevel;
  secondaryCreation?: TeamNeedLevel;
  shooting?: TeamNeedLevel;
  rimPressure?: TeamNeedLevel;
  pointOfAttackDefense?: TeamNeedLevel;
  wingDefense?: TeamNeedLevel;
  rimProtection?: TeamNeedLevel;
  rebounding?: TeamNeedLevel;
  size?: TeamNeedLevel;
  athleticism?: TeamNeedLevel;
  benchScoring?: TeamNeedLevel;
};

export type TeamPositionContext = {
  open?: TeamPositionGroup[];
  healthy?: TeamPositionGroup[];
  crowded?: TeamPositionGroup[];
  priority?: TeamPositionGroup[];
  avoid?: TeamPositionGroup[];
};

export type TeamManualDraftWeights = {
  needFit?: number;
  roleFit?: number;
  draftRange?: number;
  strategyFit?: number;
  boardValue?: number;
  riskFit?: number;
  positionDepthFit?: number;
};

export type TeamDraftManualIntelligence = {
  teamId: string;
  teamName?: string;
  timeline?: TeamTimelineOption;
  draftMode?: TeamDraftModeOption;
  riskTolerance?: TeamRiskToleranceOption;
  needs?: TeamManualNeeds;
  positionContext?: TeamPositionContext;
  preferredArchetypes?: TeamArchetypePreference[];
  avoidArchetypes?: TeamArchetypePreference[];
  strategicPriorities?: TeamStrategicPriority[];
  weights?: TeamManualDraftWeights;
  notes?: {
    identity?: string;
    idealPickLogic?: string;
    caution?: string;
  };
};

export type ResolvedTeamDraftIntelligence = TeamDraftIntelligence & {
  positionContext?: TeamPositionContext;
  strategicPriorities?: TeamStrategicPriority[];
  manualIntelligence?: {
    hasManualOverride: boolean;
    fieldsUsed: string[];
  };
  algorithmWeights: TeamDraftIntelligence['algorithmWeights'] & { positionDepthFit?: number };
};

export const teamDraftManualIntelligence: Record<string, TeamDraftManualIntelligence> = {
  IND: {
    teamId: 'IND',
    timeline: 'PLAYOFF',
    draftMode: 'VALUE_OPPORTUNISTIC',
    riskTolerance: 'MEDIUM',
    needs: {
      primaryCreation: 'LOW',
      secondaryCreation: 'MEDIUM',
      shooting: 'HIGH',
      rimPressure: 'MEDIUM',
      pointOfAttackDefense: 'HIGH',
      wingDefense: 'CRITICAL',
      rimProtection: 'MEDIUM',
      rebounding: 'HIGH',
      size: 'CRITICAL',
      athleticism: 'MEDIUM',
      benchScoring: 'MEDIUM',
    },
    positionContext: {
      crowded: ['HIGH_USAGE_GUARD'],
      healthy: ['POINT_GUARD', 'COMBO_GUARD'],
      open: ['BIG_WING', 'DEFENSIVE_WING', 'REBOUNDING_FORWARD'],
      priority: ['BIG_WING', 'DEFENSIVE_WING', 'BIG' ],
      avoid: ['SMALL_GUARD', 'HIGH_USAGE_GUARD'],
    },
    preferredArchetypes: ['TWO_WAY_WING', 'DEFENSIVE_WING', 'BIG_WING'],
    avoidArchetypes: ['SCORING_GUARD', 'HIGH_UPSIDE_PROJECT'],
    strategicPriorities: ['DEFENSE', 'SHOOTING', 'SIZE', 'REBOUNDING', 'LOW_USAGE_FIT'],
    weights: {
      needFit: 0.24,
      roleFit: 0.18,
      draftRange: 0.18,
      strategyFit: 0.17,
      boardValue: 0.11,
      riskFit: 0.05,
      positionDepthFit: 0.07,
    },
    notes: {
      idealPickLogic: 'Priorizar tamanho, defesa de ala e rebote sem adicionar outro guard de alto uso.',
      caution: 'Evitar guards redundantes que nao resolvam defesa, tamanho ou rebote.',
    },
  },
  MEM: {
    teamId: 'MEM',
    timeline: 'REBUILDING',
    draftMode: 'BEST_PLAYER',
    riskTolerance: 'MEDIUM',
    needs: {
      primaryCreation: 'CRITICAL',
      secondaryCreation: 'HIGH',
      shooting: 'HIGH',
      wingDefense: 'HIGH',
      size: 'MEDIUM',
      rimProtection: 'LOW',
      rebounding: 'MEDIUM',
    },
    positionContext: {
      crowded: ['ROLL_BIG', 'CENTER'],
      healthy: ['WING'],
      open: ['POINT_GUARD', 'BIG_WING', 'OFF_BALL_SHOOTER'],
      priority: ['POINT_GUARD', 'COMBO_GUARD', 'STRETCH_BIG', 'BIG_WING', 'OFF_BALL_SHOOTER'],
      avoid: ['ROLL_BIG'],
    },
    preferredArchetypes: ['PRIMARY_CREATOR', 'OFF_BALL_SHOOTER', 'BIG_WING', 'STRETCH_BIG'],
    avoidArchetypes: ['ROLL_BIG'],
    strategicPriorities: ['CREATION', 'SHOOTING', 'SIZE', 'BOARD_VALUE'],
    notes: {
      identity: 'Core contextual recalibrado ao redor de Zach Edey, Cedric Coward e Jaylen Wells.',
      idealPickLogic: 'Buscar criacao primaria ou spacing que complemente Edey e os wings jovens.',
      caution: 'Nao supervalorizar outro big tradicional sem skill complementar.',
    },
  },
  BOS: {
    teamId: 'BOS',
    timeline: 'CONTENDER',
    draftMode: 'SAFE_PICK',
    riskTolerance: 'LOW',
    positionContext: {
      priority: ['OFF_BALL_SHOOTER', 'DEFENSIVE_WING', 'LOW_USAGE_CONNECTOR'],
      open: ['OFF_BALL_SHOOTER', 'LOW_USAGE_CONNECTOR'],
      avoid: ['HIGH_USAGE_GUARD', 'HIGH_USAGE_GUARD'],
    },
    preferredArchetypes: ['NBA_READY_ROLE_PLAYER', 'OFF_BALL_SHOOTER', 'LOW_USAGE_DEFENDER', 'THREE_AND_D_WING'],
    strategicPriorities: ['IMMEDIATE_ROTATION', 'SHOOTING', 'DEFENSE', 'LOW_USAGE_FIT', 'SAFE_FLOOR'],
    notes: {
      idealPickLogic: 'Priorizar jogador pronto, baixo uso, arremesso e defesa para rotacao de playoff.',
      caution: 'Evitar projetos que precisem de muitas posses ou longo desenvolvimento.',
    },
  },
  DAL: {
    teamId: 'DAL',
    timeline: 'ASCENDING',
    draftMode: 'NEED_BASED',
    riskTolerance: 'MEDIUM',
    needs: {
      primaryCreation: 'CRITICAL',
      secondaryCreation: 'HIGH',
      shooting: 'HIGH',
      pointOfAttackDefense: 'MEDIUM',
    },
    positionContext: {
      open: ['POINT_GUARD', 'COMBO_GUARD', 'OFF_BALL_SHOOTER'],
      priority: ['POINT_GUARD', 'COMBO_GUARD', 'OFF_BALL_SHOOTER'],
      avoid: ['ROLL_BIG', 'CENTER'],
    },
    preferredArchetypes: ['PRIMARY_CREATOR', 'COMBO_GUARD', 'OFF_BALL_SHOOTER'],
    strategicPriorities: ['CREATION', 'SHOOTING', 'LOW_USAGE_FIT'],
    notes: {
      idealPickLogic: 'Buscar armador principal ou criador que organize o ataque ao redor de Cooper Flagg.',
    },
  },
  UTA: {
    teamId: 'UTA',
    timeline: 'ASCENDING',
    draftMode: 'SAFE_PICK',
    riskTolerance: 'MEDIUM',
    needs: {
      shooting: 'CRITICAL',
      secondaryCreation: 'HIGH',
      size: 'HIGH',
      wingDefense: 'MEDIUM',
    },
    positionContext: {
      open: ['OFF_BALL_SHOOTER', 'BIG_WING', 'STRETCH_BIG'],
      priority: ['OFF_BALL_SHOOTER', 'BIG_WING', 'STRETCH_BIG'],
      avoid: ['ROLL_BIG', 'POINT_GUARD'],
    },
    preferredArchetypes: ['MOVEMENT_SHOOTER', 'OFF_BALL_SHOOTER', 'BIG_WING', 'STRETCH_BIG'],
    strategicPriorities: ['SHOOTING', 'UPSIDE', 'SIZE', 'SECONDARY_CREATION'],
    notes: {
      idealPickLogic: 'Priorizar bolas de tres off-ball, spacing e tamanho funcional.',
    },
  },
  BKN: {
    teamId: 'BKN',
    timeline: 'REBUILDING',
    draftMode: 'UPSIDE_SWING',
    riskTolerance: 'HIGH',
    needs: { primaryCreation: 'CRITICAL', 'secondaryCreation': 'HIGH', shooting: 'HIGH', benchScoring: 'HIGH' },
    positionContext: { priority: ['POINT_GUARD', 'COMBO_GUARD', 'SCORING_GUARD', 'HIGH_USAGE_GUARD'], open: ['POINT_GUARD', 'SCORING_GUARD'] },
    preferredArchetypes: ['PRIMARY_CREATOR', 'TWO_WAY_WING', 'SCORING_GUARD', 'COMBO_GUARD'],
    strategicPriorities: ['CREATION', 'UPSIDE', 'BOARD_VALUE'],
  },
  SAC: {
    teamId: 'SAC',
    timeline: 'REBUILDING',
    needs: { primaryCreation: 'CRITICAL', secondaryCreation: 'HIGH' },
    positionContext: { priority: ['POINT_GUARD', 'COMBO_GUARD', 'HIGH_USAGE_GUARD'] },
    preferredArchetypes: ['PRIMARY_CREATOR', 'COMBO_GUARD'],
    strategicPriorities: ['CREATION', 'BOARD_VALUE'],
  },
  CHI: {
    teamId: 'CHI',
    timeline: 'REBUILDING',
    needs: { primaryCreation: 'CRITICAL', secondaryCreation: 'HIGH' },
    positionContext: { priority: ['BIG', 'POINT_GUARD', 'COMBO_GUARD', 'SCORING_GUARD'] },
    preferredArchetypes: ['PRIMARY_CREATOR', 'SCORING_GUARD', 'COMBO_GUARD'],
    strategicPriorities: ['SIZE', 'CREATION', 'UPSIDE'],
  },
  MIL: {
    teamId: 'MIL',
    needs: { primaryCreation: 'CRITICAL', secondaryCreation: 'HIGH', pointOfAttackDefense: 'HIGH' },
    positionContext: { priority: ['POINT_GUARD', 'COMBO_GUARD', 'BIG_GUARD'], avoid: ['LOW_USAGE_CONNECTOR'] },
    preferredArchetypes: ['PRIMARY_CREATOR', 'COMBO_GUARD', 'SCORING_GUARD'],
    strategicPriorities: ['CREATION', 'IMMEDIATE_ROTATION', 'BOARD_VALUE'],
  },
  MIA: {
    teamId: 'MIA',
    needs: { primaryCreation: 'CRITICAL', secondaryCreation: 'HIGH', shooting: 'HIGH' },
    positionContext: { priority: ['POINT_GUARD', 'COMBO_GUARD', 'OFF_BALL_SHOOTER'], open: ['SCORING_GUARD'] },
    preferredArchetypes: ['PRIMARY_CREATOR', 'COMBO_GUARD', 'OFF_BALL_SHOOTER'],
    strategicPriorities: ['CREATION', 'SHOOTING', 'SAFE_FLOOR'],
  },
  WAS: {
    teamId: 'WAS',
    timeline: 'ASCENDING',
    draftMode: 'VALUE_OPPORTUNISTIC',
    riskTolerance: 'HIGH',
    needs: { shooting: 'HIGH', pointOfAttackDefense: 'HIGH', wingDefense: 'HIGH', secondaryCreation: 'HIGH' },
    positionContext: { priority: ['BIG_WING', 'DEFENSIVE_WING', 'OFF_BALL_SHOOTER'], avoid: ['HIGH_USAGE_GUARD'] },
    strategicPriorities: ['BOARD_VALUE', 'DEFENSE', 'SHOOTING', 'SIZE'],
    notes: {
      idealPickLogic: 'Considerar a novidade de Trae Young e Anthony Davis antes de tratar criacao primaria ou frontcourt como vazio absoluto.',
    },
  },
};

const timelineMap: Record<TeamTimelineOption, TeamTimeline> = {
  CONTENDER: 'contender',
  PLAYOFF: 'playoff',
  ASCENDING: 'ascending',
  RETOOLING: 'retooling',
  REBUILDING: 'rebuilding',
};

const draftModeMap: Record<TeamDraftModeOption, DraftMode> = {
  BEST_PLAYER: 'best-player',
  NEED_BASED: 'need-based',
  UPSIDE_SWING: 'upside-swing',
  SAFE_PICK: 'safe-pick',
  VALUE_OPPORTUNISTIC: 'value-opportunistic',
};

const riskMap: Record<TeamRiskToleranceOption, RiskTolerance> = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

const unique = <T,>(items: T[]) => [...new Set(items.filter(Boolean))];

function normalizeTeamId(teamId: string) {
  return String(teamId || '').trim().toUpperCase();
}

function normalizeWeights(weights: TeamManualDraftWeights | undefined, base: ResolvedTeamDraftIntelligence['algorithmWeights']) {
  if (!weights) return base;
  const merged = { ...base, ...weights };
  const total = Object.values(merged).reduce((sum, value) => sum + (Number.isFinite(value) ? Number(value) : 0), 0) || 1;
  return Object.fromEntries(Object.entries(merged).map(([key, value]) => [key, Number(value) / total])) as ResolvedTeamDraftIntelligence['algorithmWeights'];
}

function manualFields(override?: TeamDraftManualIntelligence) {
  if (!override) return [];
  return [
    override.timeline ? 'timeline' : '',
    override.draftMode ? 'draftMode' : '',
    override.riskTolerance ? 'riskTolerance' : '',
    override.needs ? 'needs' : '',
    override.positionContext ? 'positionContext' : '',
    override.preferredArchetypes ? 'preferredArchetypes' : '',
    override.avoidArchetypes ? 'avoidArchetypes' : '',
    override.strategicPriorities ? 'strategicPriorities' : '',
    override.weights ? 'weights' : '',
    override.notes ? 'notes' : '',
  ].filter(Boolean);
}

export function getTeamDraftManualIntelligence(teamId: string) {
  return teamDraftManualIntelligence[normalizeTeamId(teamId)];
}

export function hasTeamManualOverride(teamId: string) {
  return Boolean(getTeamDraftManualIntelligence(teamId));
}

export function mergeTeamIntelligenceWithManualOverride(
  base: TeamDraftIntelligence,
  override?: TeamDraftManualIntelligence,
): ResolvedTeamDraftIntelligence {
  if (!override) {
    return {
      ...base,
      manualIntelligence: { hasManualOverride: false, fieldsUsed: [] },
    } as ResolvedTeamDraftIntelligence;
  }

  const needs: TeamNeeds = { ...base.needs };
  Object.entries(override.needs || {}).forEach(([key, level]) => {
    if (level) needs[key as keyof TeamNeeds] = needLevelToScore(level);
  });

  const preferredLabels = unique([...(base.draftPreferences.preferredArchetypes || []), ...(override.preferredArchetypes || [])]);
  const avoidLabels = unique([...(base.draftPreferences.avoidArchetypes || []), ...(override.avoidArchetypes || [])]);
  const prioritySkills = unique([...(base.draftPreferences.prioritySkills || []), ...(override.strategicPriorities || [])]);

  return {
    ...base,
    timeline: override.timeline ? timelineMap[override.timeline] : base.timeline,
    draftMode: override.draftMode ? draftModeMap[override.draftMode] : base.draftMode,
    riskTolerance: override.riskTolerance ? riskMap[override.riskTolerance] : base.riskTolerance,
    needs,
    draftPreferences: {
      ...base.draftPreferences,
      preferredArchetypes: preferredLabels,
      avoidArchetypes: avoidLabels,
      prioritySkills,
      idealPickLogic: override.notes?.idealPickLogic || base.draftPreferences.idealPickLogic,
    },
    notes: {
      ...base.notes,
      short: override.notes?.identity || base.notes.short,
      draftStrategy: override.notes?.idealPickLogic || base.notes.draftStrategy,
      caution: override.notes?.caution || base.notes.caution,
    },
    positionContext: override.positionContext,
    strategicPriorities: override.strategicPriorities,
    algorithmWeights: normalizeWeights(override.weights, base.algorithmWeights),
    manualIntelligence: {
      hasManualOverride: true,
      fieldsUsed: manualFields(override),
    },
  };
}

export function resolveTeamDraftIntelligence(teamId: string): ResolvedTeamDraftIntelligence | undefined {
  const normalized = normalizeTeamId(teamId);
  const base = getTeamDraftIntelligence(normalized);
  if (!base) return undefined;
  return mergeTeamIntelligenceWithManualOverride(base, getTeamDraftManualIntelligence(normalized));
}

export type TeamDraftManualValidationIssue = {
  teamId: string;
  field: string;
  message: string;
};

function invalidValues<T extends readonly string[]>(values: unknown[] | undefined, allowed: T) {
  if (!values) return [];
  return values.filter((value) => !allowed.includes(value as T[number]));
}

export function validateTeamDraftManualIntelligence(
  data: Record<string, TeamDraftManualIntelligence> = teamDraftManualIntelligence,
): TeamDraftManualValidationIssue[] {
  const issues: TeamDraftManualValidationIssue[] = [];
  Object.entries(data).forEach(([key, team]) => {
    const teamId = normalizeTeamId(team.teamId || key);
    if (!team.teamId) issues.push({ teamId, field: 'teamId', message: 'teamId obrigatorio.' });
    if (team.timeline && !TEAM_TIMELINE_OPTIONS.includes(team.timeline)) issues.push({ teamId, field: 'timeline', message: 'Timeline invalida.' });
    if (team.draftMode && !TEAM_DRAFT_MODE_OPTIONS.includes(team.draftMode)) issues.push({ teamId, field: 'draftMode', message: 'Draft mode invalido.' });
    if (team.riskTolerance && !TEAM_RISK_TOLERANCE_OPTIONS.includes(team.riskTolerance)) issues.push({ teamId, field: 'riskTolerance', message: 'Risk tolerance invalido.' });
    Object.entries(team.needs || {}).forEach(([field, level]) => {
      if (level && !TEAM_NEED_LEVELS.includes(level)) issues.push({ teamId, field: `needs.${field}`, message: 'Need level invalido.' });
    });
    Object.entries(team.positionContext || {}).forEach(([field, values]) => {
      invalidValues(values as unknown[], TEAM_POSITION_GROUPS).forEach((value) => issues.push({ teamId, field: `positionContext.${field}`, message: `Grupo invalido: ${String(value)}.` }));
    });
    invalidValues(team.preferredArchetypes, TEAM_ARCHETYPE_PREFERENCES).forEach((value) => issues.push({ teamId, field: 'preferredArchetypes', message: `Archetype invalido: ${String(value)}.` }));
    invalidValues(team.avoidArchetypes, TEAM_ARCHETYPE_PREFERENCES).forEach((value) => issues.push({ teamId, field: 'avoidArchetypes', message: `Archetype invalido: ${String(value)}.` }));
    invalidValues(team.strategicPriorities, TEAM_STRATEGIC_PRIORITIES).forEach((value) => issues.push({ teamId, field: 'strategicPriorities', message: `Prioridade invalida: ${String(value)}.` }));
    const weights = Object.values(team.weights || {});
    weights.forEach((value) => {
      if (!Number.isFinite(value) || Number(value) < 0 || Number(value) > 1) issues.push({ teamId, field: 'weights', message: 'Peso deve ficar entre 0 e 1.' });
    });
    if (weights.length >= 6) {
      const sum = weights.reduce((total, value) => total + Number(value), 0);
      if (Math.abs(sum - 1) > 0.08) issues.push({ teamId, field: 'weights', message: `Soma dos pesos distante de 1: ${sum.toFixed(2)}.` });
    }
  });
  return issues;
}

const validationIssues = validateTeamDraftManualIntelligence();
if (validationIssues.length && typeof console !== 'undefined') {
  console.warn('[teamDraftManualIntelligence] validation issues', validationIssues);
}
