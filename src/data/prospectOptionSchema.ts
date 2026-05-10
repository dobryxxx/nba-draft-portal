export const PROSPECT_POSITIONS = [
  'PG',
  'SG',
  'SF',
  'PF',
  'C',
  'PG/SG',
  'SG/SF',
  'SF/PF',
  'PF/C',
  'GUARD',
  'WING',
  'FORWARD',
  'BIG',
] as const;

export type ProspectPosition = typeof PROSPECT_POSITIONS[number];

export const PROSPECT_TIERS = [
  'ELITE',
  'LOTTERY',
  'FIRST_ROUND',
  'FRINGE_FIRST',
  'SECOND_ROUND',
  'SLEEPER',
  'UNDRAFTED',
] as const;

export type ProspectTier = typeof PROSPECT_TIERS[number];

export const PROSPECT_RISKS = [
  'LOW',
  'MODERATE',
  'HIGH',
  'SEVERE',
] as const;

export type ProspectRisk = typeof PROSPECT_RISKS[number];

export const PROSPECT_OUTCOME_TIERS = [
  'MVP',
  'FRANCHISE_PLAYER',
  'ALL_STAR',
  'STARTER',
  'ROTATION',
  'BENCH',
  'G_LEAGUE',
] as const;

export type ProspectOutcomeTier = typeof PROSPECT_OUTCOME_TIERS[number];

export const PROSPECT_FLOORS = [
  'STARTER',
  'ROTATION',
  'BENCH',
  'TWO_WAY',
  'G_LEAGUE',
  'OVERSEAS',
] as const;

export type ProspectFloor = typeof PROSPECT_FLOORS[number];

export const PROSPECT_ARCHETYPES = [
  'PRIMARY_CREATOR',
  'SCORING_GUARD',
  'COMBO_GUARD',
  'MOVEMENT_SHOOTER',
  'THREE_AND_D_WING',
  'TWO_WAY_WING',
  'DEFENSIVE_WING',
  'CONNECTOR_WING',
  'BIG_WING',
  'SLASHING_WING',
  'VERSATILE_FORWARD',
  'STRETCH_BIG',
  'RIM_PROTECTOR',
  'ROLL_BIG',
  'PLAYMAKING_BIG',
  'ENERGY_BIG',
] as const;

export type ProspectArchetype = typeof PROSPECT_ARCHETYPES[number];

export const PROSPECT_PROJECTED_ROLES = [
  'PRIMARY_OPTION',
  'SECONDARY_CREATOR',
  'THIRD_OPTION',
  'STARTING_GUARD',
  'STARTING_WING',
  'STARTING_BIG',
  'ROTATION_GUARD',
  'ROTATION_WING',
  'ROTATION_BIG',
  'DEFENSIVE_SPECIALIST',
  'SHOOTING_SPECIALIST',
  'BENCH_SCORER',
  'DEVELOPMENT_PROJECT',
  'TWO_WAY_CONTRACT',
] as const;

export type ProspectProjectedRole = typeof PROSPECT_PROJECTED_ROLES[number];

export const PROSPECT_SKILL_TAGS = [
  'PULL_UP_SHOOTING',
  'SPOT_UP_SHOOTING',
  'MOVEMENT_SHOOTING',
  'SELF_CREATION',
  'ADVANTAGE_CREATION',
  'PICK_AND_ROLL_CREATION',
  'SECONDARY_PLAYMAKING',
  'RIM_PRESSURE',
  'TOUCH',
  'FINISHING',
  'TRANSITION',
  'POINT_OF_ATTACK_DEFENSE',
  'WING_DEFENSE',
  'TEAM_DEFENSE',
  'RIM_PROTECTION',
  'REBOUNDING',
  'SWITCHABILITY',
  'SIZE',
  'ATHLETICISM',
  'FEEL',
  'MOTOR',
  'PROCESSING',
  'OFF_BALL_VALUE',
] as const;

export type ProspectSkillTag = typeof PROSPECT_SKILL_TAGS[number];

export const PROSPECT_WEAKNESS_TAGS = [
  'SHOOTING_CONSISTENCY',
  'LOW_VOLUME_SHOOTING',
  'DECISION_MAKING',
  'TURNOVERS',
  'SHOT_SELECTION',
  'HANDLE',
  'BURST',
  'STRENGTH',
  'SIZE_LIMITATION',
  'DEFENSIVE_CONSISTENCY',
  'FOULING',
  'RIM_FINISHING',
  'PLAYMAKING_LIMITATION',
  'ROLE_CLARITY',
  'INJURY_RISK',
  'SAMPLE_SIZE',
  'AGE_UPSIDE',
  'LOW_FEEL',
  'LOW_MOTOR',
] as const;

export type ProspectWeaknessTag = typeof PROSPECT_WEAKNESS_TAGS[number];

export const PROSPECT_CONFIDENCE_LEVELS = ['LOW', 'MEDIUM', 'HIGH'] as const;
export type ProspectDataConfidence = typeof PROSPECT_CONFIDENCE_LEVELS[number];

export const PROSPECT_POSITION_LABELS: Record<ProspectPosition, string> = {
  PG: 'Armador',
  SG: 'Ala-armador',
  SF: 'Ala',
  PF: 'Ala-pivo',
  C: 'Pivo',
  'PG/SG': 'Armador / ala-armador',
  'SG/SF': 'Ala-armador / ala',
  'SF/PF': 'Ala / ala-pivo',
  'PF/C': 'Ala-pivo / pivo',
  GUARD: 'Guard',
  WING: 'Ala',
  FORWARD: 'Forward',
  BIG: 'Big',
};

export const PROSPECT_TIER_LABELS: Record<ProspectTier, string> = {
  ELITE: 'Elite',
  LOTTERY: 'Lottery',
  FIRST_ROUND: 'Primeira rodada',
  FRINGE_FIRST: 'Fim de primeira rodada',
  SECOND_ROUND: 'Segunda rodada',
  SLEEPER: 'Sleeper',
  UNDRAFTED: 'Undrafted',
};

export const PROSPECT_RISK_LABELS: Record<ProspectRisk, string> = {
  LOW: 'Baixo',
  MODERATE: 'Moderado',
  HIGH: 'Alto',
  SEVERE: 'Severo',
};

export const PROSPECT_OUTCOME_LABELS: Record<ProspectOutcomeTier, string> = {
  MVP: 'MVP',
  FRANCHISE_PLAYER: 'Franchise player',
  ALL_STAR: 'All-Star',
  STARTER: 'Titular',
  ROTATION: 'Rotacao',
  BENCH: 'Fundo de banco',
  G_LEAGUE: 'G-League',
};

export const PROSPECT_FLOOR_LABELS: Record<ProspectFloor, string> = {
  STARTER: 'Titular',
  ROTATION: 'Rotacao',
  BENCH: 'Fundo de banco',
  TWO_WAY: 'Two-way',
  G_LEAGUE: 'G-League',
  OVERSEAS: 'Exterior',
};

export const PROSPECT_ARCHETYPE_LABELS: Record<ProspectArchetype, string> = {
  PRIMARY_CREATOR: 'Criador primario',
  SCORING_GUARD: 'Guard pontuador',
  COMBO_GUARD: 'Combo guard',
  MOVEMENT_SHOOTER: 'Arremessador em movimento',
  THREE_AND_D_WING: 'Ala 3&D',
  TWO_WAY_WING: 'Ala two-way',
  DEFENSIVE_WING: 'Ala defensivo',
  CONNECTOR_WING: 'Ala conector',
  BIG_WING: 'Ala grande',
  SLASHING_WING: 'Ala agressivo atacando o aro',
  VERSATILE_FORWARD: 'Forward versatil',
  STRETCH_BIG: 'Big espacador',
  RIM_PROTECTOR: 'Protetor de aro',
  ROLL_BIG: 'Big de roll',
  PLAYMAKING_BIG: 'Big passador',
  ENERGY_BIG: 'Big de energia',
};

export const PROSPECT_PROJECTED_ROLE_LABELS: Record<ProspectProjectedRole, string> = {
  PRIMARY_OPTION: 'Primeira opcao',
  SECONDARY_CREATOR: 'Criador secundario',
  THIRD_OPTION: 'Terceira opcao',
  STARTING_GUARD: 'Guard titular',
  STARTING_WING: 'Ala titular',
  STARTING_BIG: 'Big titular',
  ROTATION_GUARD: 'Guard de rotacao',
  ROTATION_WING: 'Ala de rotacao',
  ROTATION_BIG: 'Big de rotacao',
  DEFENSIVE_SPECIALIST: 'Especialista defensivo',
  SHOOTING_SPECIALIST: 'Especialista de arremesso',
  BENCH_SCORER: 'Pontuador de banco',
  DEVELOPMENT_PROJECT: 'Projeto de desenvolvimento',
  TWO_WAY_CONTRACT: 'Contrato two-way',
};

export const PROSPECT_SKILL_TAG_LABELS: Record<ProspectSkillTag, string> = {
  PULL_UP_SHOOTING: 'Arremesso de pull-up',
  SPOT_UP_SHOOTING: 'Spot-up shooting',
  MOVEMENT_SHOOTING: 'Arremesso em movimento',
  SELF_CREATION: 'Criacao propria',
  ADVANTAGE_CREATION: 'Criacao de vantagem',
  PICK_AND_ROLL_CREATION: 'Criacao no pick-and-roll',
  SECONDARY_PLAYMAKING: 'Playmaking secundario',
  RIM_PRESSURE: 'Pressao no aro',
  TOUCH: 'Toque',
  FINISHING: 'Finalizacao',
  TRANSITION: 'Transicao',
  POINT_OF_ATTACK_DEFENSE: 'Defesa no ponto da bola',
  WING_DEFENSE: 'Defesa em alas',
  TEAM_DEFENSE: 'Defesa coletiva',
  RIM_PROTECTION: 'Protecao de aro',
  REBOUNDING: 'Rebote',
  SWITCHABILITY: 'Trocas defensivas',
  SIZE: 'Tamanho',
  ATHLETICISM: 'Atletismo',
  FEEL: 'Feel',
  MOTOR: 'Motor',
  PROCESSING: 'Processamento',
  OFF_BALL_VALUE: 'Valor sem bola',
};

export const PROSPECT_WEAKNESS_TAG_LABELS: Record<ProspectWeaknessTag, string> = {
  SHOOTING_CONSISTENCY: 'Consistencia do arremesso',
  LOW_VOLUME_SHOOTING: 'Baixo volume de arremesso',
  DECISION_MAKING: 'Tomada de decisao',
  TURNOVERS: 'Turnovers',
  SHOT_SELECTION: 'Selecao de arremessos',
  HANDLE: 'Handle',
  BURST: 'Explosao inicial',
  STRENGTH: 'Forca fisica',
  SIZE_LIMITATION: 'Limitacao de tamanho',
  DEFENSIVE_CONSISTENCY: 'Consistencia defensiva',
  FOULING: 'Faltas',
  RIM_FINISHING: 'Finalizacao no aro',
  PLAYMAKING_LIMITATION: 'Limitacao como passador',
  ROLE_CLARITY: 'Clareza de papel',
  INJURY_RISK: 'Risco fisico/lesao',
  SAMPLE_SIZE: 'Amostra pequena',
  AGE_UPSIDE: 'Idade/upside',
  LOW_FEEL: 'Baixo feel',
  LOW_MOTOR: 'Motor inconsistente',
};

export const isAllowedProspectOption = <T extends readonly string[]>(options: T, value: unknown): value is T[number] =>
  typeof value === 'string' && (options as readonly string[]).includes(value);
