export const TEAM_TIMELINE_OPTIONS = [
  'CONTENDER',
  'PLAYOFF',
  'ASCENDING',
  'RETOOLING',
  'REBUILDING',
] as const;

export const TEAM_DRAFT_MODE_OPTIONS = [
  'BEST_PLAYER',
  'NEED_BASED',
  'UPSIDE_SWING',
  'SAFE_PICK',
  'VALUE_OPPORTUNISTIC',
] as const;

export const TEAM_RISK_TOLERANCE_OPTIONS = ['LOW', 'MEDIUM', 'HIGH'] as const;

export const TEAM_NEED_LEVELS = ['NONE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;

export const TEAM_POSITION_GROUPS = [
  'POINT_GUARD',
  'COMBO_GUARD',
  'SCORING_GUARD',
  'SMALL_GUARD',
  'BIG_GUARD',
  'WING',
  'BIG_WING',
  'DEFENSIVE_WING',
  'FORWARD',
  'COMBO_FORWARD',
  'BIG',
  'CENTER',
  'STRETCH_BIG',
  'RIM_PROTECTOR',
  'ROLL_BIG',
  'REBOUNDING_FORWARD',
  'HIGH_USAGE_GUARD',
  'LOW_USAGE_CONNECTOR',
  'OFF_BALL_SHOOTER',
] as const;

export const TEAM_ARCHETYPE_PREFERENCES = [
  'PRIMARY_CREATOR',
  'SECONDARY_CREATOR',
  'SCORING_GUARD',
  'COMBO_GUARD',
  'MOVEMENT_SHOOTER',
  'OFF_BALL_SHOOTER',
  'THREE_AND_D_WING',
  'TWO_WAY_WING',
  'DEFENSIVE_WING',
  'BIG_WING',
  'CONNECTOR_WING',
  'SLASHING_WING',
  'VERSATILE_FORWARD',
  'STRETCH_BIG',
  'RIM_PROTECTOR',
  'ROLL_BIG',
  'PLAYMAKING_BIG',
  'ENERGY_BIG',
  'REBOUNDING_BIG',
  'LOW_USAGE_DEFENDER',
  'HIGH_UPSIDE_PROJECT',
  'NBA_READY_ROLE_PLAYER',
] as const;

export const TEAM_STRATEGIC_PRIORITIES = [
  'BOARD_VALUE',
  'IMMEDIATE_ROTATION',
  'UPSIDE',
  'SHOOTING',
  'DEFENSE',
  'SIZE',
  'CREATION',
  'SECONDARY_CREATION',
  'RIM_PROTECTION',
  'REBOUNDING',
  'LOW_USAGE_FIT',
  'DEVELOPMENTAL_SWING',
  'SAFE_FLOOR',
] as const;

export type TeamTimelineOption = typeof TEAM_TIMELINE_OPTIONS[number];
export type TeamDraftModeOption = typeof TEAM_DRAFT_MODE_OPTIONS[number];
export type TeamRiskToleranceOption = typeof TEAM_RISK_TOLERANCE_OPTIONS[number];
export type TeamNeedLevel = typeof TEAM_NEED_LEVELS[number];
export type TeamPositionGroup = typeof TEAM_POSITION_GROUPS[number];
export type TeamArchetypePreference = typeof TEAM_ARCHETYPE_PREFERENCES[number];
export type TeamStrategicPriority = typeof TEAM_STRATEGIC_PRIORITIES[number];

export function needLevelToScore(level: TeamNeedLevel): number {
  const scores: Record<TeamNeedLevel, number> = {
    NONE: 20,
    LOW: 40,
    MEDIUM: 60,
    HIGH: 78,
    CRITICAL: 92,
  };
  return scores[level] ?? 60;
}

export const TEAM_TIMELINE_LABELS: Record<TeamTimelineOption, string> = {
  CONTENDER: 'Contender',
  PLAYOFF: 'Playoff',
  ASCENDING: 'Ascendente',
  RETOOLING: 'Retool',
  REBUILDING: 'Reconstrucao',
};

export const TEAM_DRAFT_MODE_LABELS: Record<TeamDraftModeOption, string> = {
  BEST_PLAYER: 'Melhor jogador disponivel',
  NEED_BASED: 'Necessidade do elenco',
  UPSIDE_SWING: 'Aposta de teto',
  SAFE_PICK: 'Escolha segura',
  VALUE_OPPORTUNISTIC: 'Valor de board',
};

export const TEAM_RISK_TOLERANCE_LABELS: Record<TeamRiskToleranceOption, string> = {
  LOW: 'Baixa',
  MEDIUM: 'Media',
  HIGH: 'Alta',
};

export const TEAM_NEED_LEVEL_LABELS: Record<TeamNeedLevel, string> = {
  NONE: 'Nenhuma',
  LOW: 'Baixa',
  MEDIUM: 'Media',
  HIGH: 'Alta',
  CRITICAL: 'Critica',
};

export const TEAM_POSITION_GROUP_LABELS: Record<TeamPositionGroup, string> = {
  POINT_GUARD: 'Armador',
  COMBO_GUARD: 'Combo guard',
  SCORING_GUARD: 'Guard pontuador',
  SMALL_GUARD: 'Guard baixo',
  BIG_GUARD: 'Guard grande',
  WING: 'Ala',
  BIG_WING: 'Ala grande',
  DEFENSIVE_WING: 'Ala defensivo',
  FORWARD: 'Forward',
  COMBO_FORWARD: 'Forward versatil',
  BIG: 'Big',
  CENTER: 'Pivo',
  STRETCH_BIG: 'Big espacador',
  RIM_PROTECTOR: 'Protetor de aro',
  ROLL_BIG: 'Roll big',
  REBOUNDING_FORWARD: 'Forward reboteiro',
  HIGH_USAGE_GUARD: 'Guard de alto uso',
  LOW_USAGE_CONNECTOR: 'Conector de baixo uso',
  OFF_BALL_SHOOTER: 'Arremessador off-ball',
};

export const TEAM_ARCHETYPE_LABELS: Record<TeamArchetypePreference, string> = {
  PRIMARY_CREATOR: 'Criador primario',
  SECONDARY_CREATOR: 'Criador secundario',
  SCORING_GUARD: 'Guard pontuador',
  COMBO_GUARD: 'Combo guard',
  MOVEMENT_SHOOTER: 'Arremessador em movimento',
  OFF_BALL_SHOOTER: 'Arremessador off-ball',
  THREE_AND_D_WING: 'Ala 3&D',
  TWO_WAY_WING: 'Ala two-way',
  DEFENSIVE_WING: 'Ala defensivo',
  BIG_WING: 'Ala grande',
  CONNECTOR_WING: 'Ala conector',
  SLASHING_WING: 'Ala agressor',
  VERSATILE_FORWARD: 'Forward versatil',
  STRETCH_BIG: 'Big espacador',
  RIM_PROTECTOR: 'Protetor de aro',
  ROLL_BIG: 'Roll big',
  PLAYMAKING_BIG: 'Big passador',
  ENERGY_BIG: 'Big de energia',
  REBOUNDING_BIG: 'Big reboteiro',
  LOW_USAGE_DEFENDER: 'Defensor de baixo uso',
  HIGH_UPSIDE_PROJECT: 'Projeto de alto teto',
  NBA_READY_ROLE_PLAYER: 'Role player pronto',
};

export const TEAM_STRATEGIC_PRIORITY_LABELS: Record<TeamStrategicPriority, string> = {
  BOARD_VALUE: 'Valor de board',
  IMMEDIATE_ROTATION: 'Rotacao imediata',
  UPSIDE: 'Teto',
  SHOOTING: 'Arremesso',
  DEFENSE: 'Defesa',
  SIZE: 'Tamanho',
  CREATION: 'Criacao',
  SECONDARY_CREATION: 'Criacao secundaria',
  RIM_PROTECTION: 'Protecao de aro',
  REBOUNDING: 'Rebote',
  LOW_USAGE_FIT: 'Encaixe de baixo uso',
  DEVELOPMENTAL_SWING: 'Aposta de desenvolvimento',
  SAFE_FLOOR: 'Piso seguro',
};
