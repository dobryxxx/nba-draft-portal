import {
  PROSPECT_ARCHETYPES,
  PROSPECT_CONFIDENCE_LEVELS,
  PROSPECT_FLOORS,
  PROSPECT_OUTCOME_TIERS,
  PROSPECT_POSITIONS,
  PROSPECT_PROJECTED_ROLES,
  PROSPECT_RISKS,
  PROSPECT_SKILL_TAGS,
  PROSPECT_TIERS,
  PROSPECT_WEAKNESS_TAGS,
  isAllowedProspectOption,
  type ProspectArchetype,
  type ProspectDataConfidence,
  type ProspectFloor,
  type ProspectOutcomeTier,
  type ProspectPosition,
  type ProspectProjectedRole,
  type ProspectRisk,
  type ProspectSkillTag,
  type ProspectTier,
  type ProspectWeaknessTag,
} from './prospectOptionSchema';

export type ProspectManualTraits = {
  scoring?: number;
  shooting?: number;
  creation?: number;
  rimPressure?: number;
  playmaking?: number;
  defense?: number;
  rebounding?: number;
  rimProtection?: number;
  size?: number;
  athleticism?: number;
  feel?: number;
  nbaReadiness?: number;
  upside?: number;
  risk?: number;
};

export type ProspectDraftIntelligenceOverride = {
  playerId?: string;
  name: string;
  position?: ProspectPosition;
  tier?: ProspectTier;
  archetype?: ProspectArchetype;
  projectedRole?: ProspectProjectedRole;
  risk?: ProspectRisk;
  projection?: {
    floor?: ProspectFloor;
    ceiling?: ProspectOutcomeTier;
    realisticOutcome?: ProspectOutcomeTier;
    projectionScoreOverride?: number;
  };
  manualTraits?: ProspectManualTraits;
  scouting?: {
    strengths?: readonly ProspectSkillTag[];
    weaknesses?: readonly ProspectWeaknessTag[];
    swingSkill?: ProspectSkillTag;
    mainConcern?: ProspectWeaknessTag;
    translationSummary?: string;
    notes?: readonly string[];
  };
  dataConfidence?: {
    stats?: ProspectDataConfidence;
    scouting?: ProspectDataConfidence;
    projection?: ProspectDataConfidence;
    role?: ProspectDataConfidence;
  };
};

export type ProspectDraftIntelligenceValidation = {
  valid: boolean;
  errors: string[];
  warnings: string[];
};

export type ResolvedProspectIntelligence = {
  hasManualOverride: boolean;
  manualOverrideKey?: string;
  manualFieldsUsed: string[];
  fallbackFieldsUsed: string[];
  position?: ProspectPosition;
  tier?: ProspectTier;
  archetype?: ProspectArchetype;
  projectedRole?: ProspectProjectedRole;
  risk?: ProspectRisk;
  projection?: ProspectDraftIntelligenceOverride['projection'];
  manualTraits?: ProspectManualTraits;
  scouting?: ProspectDraftIntelligenceOverride['scouting'];
  dataConfidence?: ProspectDraftIntelligenceOverride['dataConfidence'];
};

const TRAIT_KEYS = [
  'scoring', 'shooting', 'creation', 'rimPressure', 'playmaking', 'defense', 'rebounding', 'rimProtection', 'size', 'athleticism', 'feel', 'nbaReadiness', 'upside', 'risk',
] as const satisfies readonly (keyof ProspectManualTraits)[];

// Manual-first layer populated from src/data/prospects.js.
// Edit values here using only the enums from prospectOptionSchema.ts.
// This file does not mutate the original prospect database.
export const prospectDraftIntelligence = {
  "aj-dybantsa": {
    "playerId": "1",
    "name": "AJ Dybantsa",
    "position": "SF/PF",
    "tier": "CORNERSTONE",
    "archetype": "VERSATILE_FORWARD",
    "projectedRole": "SECONDARY_CREATOR",
    "projection": {
      "floor": "STARTER",
      "ceiling": "MVP",
      "realisticOutcome": "ALL_STAR",
      "projectionScoreOverride": 82
    },
    "manualTraits": {
      "shooting": 60,
      "creation": 88,
      "rimPressure": 91,
      "playmaking": 71,
      "defense": 60,
      "rebounding": 60,
      "rimProtection": 15,
      "athleticism": 74,
      "feel": 70,
      "nbaReadiness": 74,
      "upside": 100
    },
    "scouting": {
      "strengths": [
        "FINISHING",
        "SELF_CREATION",
        "SECONDARY_PLAYMAKING",
        "RIM_PRESSURE",
        "REBOUNDING",
        "TRANSITION",
        "ATHLETICISM"
      ],
      "weaknesses": [
        "SHOOTING_CONSISTENCY",
        "DECISION_MAKING",
        "HANDLE",
        "DEFENSIVE_CONSISTENCY"
      ],
      "swingSkill": "PULL_UP_SHOOTING",
      "mainConcern": "SHOOTING_CONSISTENCY",
      "translationSummary": "Dybantsa é o tipo de prospecto que se destaca não apenas pelo talento, mas pela intensidade competitiva que carrega. Fisicamente, combina tamanho de ala grande com mobilidade e dureza defensiva incomuns para a faixa etária, o que o torna uma presença real nos dois lados da quadra. Tem personalidade forte o suficiente para impor identidade num elenco — uma qualidade rara em prospectos jovens e que costuma ser tão decisiva quanto qualquer habilidade técnica.",
      "notes": [
        "Líder nacional em pontuação (25.5 PPG) com eficiência de 51% no campo",
        "Criação off the dribble de elite — muda velocidade como Tracy McGrady",
        "Playmaking avançado para a posição (3.7 APG, baixo índice de turnovers)",
        "Consistência no arremesso de 3 ainda em desenvolvimento (33.1%)",
        "Tendência a procurar falta ao invés de finalizar com força no aro"
      ]
    },
    "dataConfidence": {
      "stats": "HIGH",
      "scouting": "HIGH",
      "projection": "HIGH",
      "role": "HIGH"
    }
  },
  "darryn-peterson": {
    "playerId": "2",
    "name": "Darryn Peterson",
    "position": "PG/SG",
    "tier": "CORNERSTONE",
    "archetype": "SCORING_GUARD",
    "projectedRole": "PRIMARY_OPTION",
    "projection": {
      "floor": "STARTER",
      "ceiling": "MVP",
      "realisticOutcome": "FRANCHISE_PLAYER",
      "projectionScoreOverride": 85
    },
    "manualTraits": {
      "shooting": 74,
      "creation": 88,
      "rimPressure": 84,
      "playmaking": 37,
      "defense": 77,
      "rebounding": 60,
      "rimProtection": 32,
      "athleticism": 78,
      "feel": 45,
      "nbaReadiness": 74,
      "upside": 100
    },
    "scouting": {
      "strengths": [
        "SPOT_UP_SHOOTING",
        "SELF_CREATION",
        "RIM_PRESSURE",
        "TEAM_DEFENSE",
        "ADVANTAGE_CREATION",
        "FINISHING"
      ],
      "weaknesses": [
        "DECISION_MAKING",
        "INJURY_RISK"
      ],
      "swingSkill": "FINISHING",
      "mainConcern": "DECISION_MAKING",
      "translationSummary": "Peterson é considerado o maior potencial de superstar scorer do draft, com capacidade de criar vantagem em múltiplos contextos: isolamento, pick-and-roll e sem a bola. Sua versatilidade ofensiva o torna um catchall raro — o tipo de jogador que dá direção a elencos inteiros pela simples ameaça que representa. A grande incógnita é se a temporada turbulenta no Kansas reflete problemas estruturais no seu jogo ou apenas ruído de adaptação a um ambiente difícil.",
      "notes": [
        "Shotmaking de elite nos três níveis — explosão e força de guarda maior",
        "QI ofensivo instintivo, baixo número de turnovers para o uso que recebe",
        "Arremesso de 3 limpo e repetível (38.2%) com boa consistência mecânica",
        "Histórico de problemas físicos (cãibra severa que exigiu hospitalização)",
        "Volume de jogos reduzido (24 partidas) deixa lacunas na avaliação médica"
      ]
    },
    "dataConfidence": {
      "stats": "HIGH",
      "scouting": "HIGH",
      "projection": "HIGH",
      "role": "HIGH"
    }
  },
  "cameron-boozer": {
    "playerId": "3",
    "name": "Cameron Boozer",
    "position": "PF/C",
    "tier": "CORNERSTONE",
    "archetype": "STRETCH_BIG",
    "projectedRole": "SECONDARY_CREATOR",
    "projection": {
      "floor": "STARTER",
      "ceiling": "MVP",
      "realisticOutcome": "FRANCHISE_PLAYER",
      "projectionScoreOverride": 80
    },
    "manualTraits": {
      "shooting": 88,
      "creation": 88,
      "rimPressure": 84,
      "playmaking": 79,
      "defense": 74,
      "rebounding": 88,
      "rimProtection": 31,
      "athleticism": 75,
      "feel": 83,
      "nbaReadiness": 88,
      "upside": 100
    },
    "scouting": {
      "strengths": [
        "SPOT_UP_SHOOTING",
        "SELF_CREATION",
        "SECONDARY_PLAYMAKING",
        "RIM_PRESSURE",
        "REBOUNDING",
        "MOTOR",
        "PROCESSING",
        "ADVANTAGE_CREATION"
      ],
      "weaknesses": [
        "DEFENSIVE_CONSISTENCY"
      ],
      "swingSkill": "SELF_CREATION",
      "translationSummary": "Boozer é um forward com inteligência de jogo excepcional, capaz de agregar valor em múltiplas funções sem precisar ser o astro da jogada. Funciona como hub ofensivo, parceiro de pick-and-roll e espaçador com naturalidade, e o analista acredita que ele poderia fazer tudo isso já no primeiro ano profissional. O único \"risco\" do seu perfil é uma limitação como scorer de alto volume — mas quem enxerga além dos números reconhece que seu impacto nas vitórias tende a ser consistente e silencioso.",
      "notes": [
        "AP National Player of the Year — 22.5/10.2/4.1 com 55.6% FG",
        "Box Plus-Minus de 17.1, mais alto de toda a college basketball em 2025-26",
        "Fundamentos ofensivos impecáveis: pós baixo, mid-range e tiro de 3 (39.1%)",
        "Debate sobre o teto de desenvolvimento comparado a Peterson/Dybantsa",
        "Sem explosividade atletica de elite — jogo depende mais de fundamentos e leitura"
      ]
    },
    "dataConfidence": {
      "stats": "HIGH",
      "scouting": "HIGH",
      "projection": "HIGH",
      "role": "HIGH"
    }
  },
  "caleb-wilson": {
    "playerId": "4",
    "name": "Caleb Wilson",
    "position": "PF",
    "tier": "ELITE",
    "archetype": "VERSATILE_FORWARD",
    "projectedRole": "THIRD_OPTION",
    "risk": "MODERATE",
    "projection": {
      "floor": "ROTATION",
      "ceiling": "FRANCHISE_PLAYER",
      "realisticOutcome": "ALL_STAR",
      "projectionScoreOverride": 78
    },
    "manualTraits": {
      "shooting": 36,
      "creation": 60,
      "rimPressure": 75,
      "playmaking": 59,
      "defense": 90,
      "rebounding": 88,
      "rimProtection": 62,
      "athleticism": 86,
      "feel": 61,
      "nbaReadiness": 74,
      "upside": 100,
      "risk": 54
    },
    "scouting": {
      "strengths": [
        "FINISHING",
        "REBOUNDING",
        "RIM_PROTECTION",
        "TEAM_DEFENSE",
        "MOTOR",
        "OFF_BALL_VALUE"
      ],
      "weaknesses": [
        "SHOOTING_CONSISTENCY",
        "LOW_VOLUME_SHOOTING",
        "ROLE_CLARITY"
      ],
      "swingSkill": "SELF_CREATION",
      "mainConcern": "SHOOTING_CONSISTENCY",
      "translationSummary": "Wilson tem o maior teto defensivo da classe, com atributos físicos — altura, envergadura e mobilidade — que poucos jogadores do draft conseguem igualar. No ataque, apresenta um perfil incomum: um ala grande com movimentação fluida, upside de arremesso e capacidade de finalização na bola parada. Ainda tem detalhes técnicos a aprimorar em várias áreas, mas a combinação de impacto defensivo de elite com versatilidade ofensiva o coloca entre os prospectos mais completos da geração.",
      "notes": [
        "Atletismo twitchy e explosivo — arremessa acima do aro com facilidade",
        "Produção de dois lados da bola com first step especial para seu tamanho",
        "Reboteiro de elite (9.4 RPG) com motor constante",
        "Arremesso de 3 em desenvolvimento (25.9%) — maior limitação de longo prazo",
        "Playmaking ainda básico para um forward de alto nível"
      ]
    },
    "dataConfidence": {
      "stats": "HIGH",
      "scouting": "HIGH",
      "projection": "HIGH",
      "role": "HIGH"
    }
  },
  "keaton-wagler": {
    "playerId": "5",
    "name": "Keaton Wagler",
    "position": "PG/SG",
    "tier": "LOTTERY",
    "archetype": "SCORING_GUARD",
    "projectedRole": "SHOOTING_SPECIALIST",
    "risk": "MODERATE",
    "projection": {
      "floor": "BENCH",
      "ceiling": "ALL_STAR",
      "realisticOutcome": "STARTER",
      "projectionScoreOverride": 68
    },
    "manualTraits": {
      "shooting": 80,
      "creation": 75,
      "rimPressure": 73,
      "playmaking": 65,
      "defense": 36,
      "rebounding": 60,
      "rimProtection": 18,
      "athleticism": 61,
      "feel": 70,
      "nbaReadiness": 74,
      "upside": 100,
      "risk": 54
    },
    "scouting": {
      "strengths": [
        "SPOT_UP_SHOOTING",
        "SECONDARY_PLAYMAKING",
        "PULL_UP_SHOOTING",
        "SELF_CREATION"
      ],
      "weaknesses": [
        "STRENGTH",
        "DECISION_MAKING",
        "DEFENSIVE_CONSISTENCY"
      ],
      "swingSkill": "ADVANTAGE_CREATION",
      "mainConcern": "STRENGTH",
      "translationSummary": "Wagler é um dos atiradores mais perigosos e dinâmicos da classe, com mecanismo confiável e capacidade técnica sólida de operar no pick-and-roll. Tem tamanho posicional adequado para um guard no nível profissional, mas uma envergadura que não anima em nada, além de um corpo ainda franzino para seu porte. A principal dúvida sobre ele é física: seu corpo será capaz de absorver as demandas de ser opção primária na NBA? Wagler emendou uma segunda metade de temporada fantástica, fazendo chover no ano de 2026, e mostrando um potencial como scorer e playmaker secundário. Mesmo não tendo um primeiro passo explosivo, combina boa técnica e equilíbrio corporal para atacar o garrafão e finalizar próximo à cesta, o que é animador considerando sua facilidade em jogar no perímetro. Se conseguir criar vantagens saindo do drible com constância na NBA, tem tudo para prosperar como pontuador secundário e eficiente. Não o vemos como o melhor, ou segundo melhor prospecto de guard [desconsiderando obviamente Darryn Peterson, que está em outro debate] desse Draft, como o consenso tem projetado sendo uma possível escolha TOP-6. Vemos Walter como uma aposta interessante, podendo ser um bom e versátil cestinha, criador coletivo disposto, mas o teto de primeira opção ofensiva tão é no momento atual, muito mais hipotético, do que provável ou possível. A falta de um atleticismo animador, também contribui para nossa visão geral de que, trata-se mais de um projeto de desenvolvimento, do que uma realidade imediata na NBA, como grande parte das projeções apontam.",
      "notes": [
        "Tomada de decisão inteligente e visão de jogo acima da média para a posição",
        "Arremesso de 3 confiável (39.7%) com boa vantagem de tamanho sobre guardas",
        "Excelente como facilitador fora da bola e em ball screens — elevador de companheiros",
        "Ainda precisa adicionar força para suportar fisicalidade NBA",
        "Sem explosividade atlética como criador primário"
      ]
    },
    "dataConfidence": {
      "stats": "HIGH",
      "scouting": "HIGH",
      "projection": "HIGH",
      "role": "HIGH"
    }
  },
  "darius-acuff": {
    "playerId": "14",
    "name": "Darius Acuff Jr.",
    "position": "PG/SG",
    "tier": "LOTTERY",
    "archetype": "PRIMARY_CREATOR",
    "projectedRole": "ROTATION_GUARD",
    "risk": "MODERATE",
    "projection": {
      "floor": "ROTATION",
      "ceiling": "FRANCHISE_PLAYER",
      "realisticOutcome": "ALL_STAR",
      "projectionScoreOverride": 73
    },
    "manualTraits": {
      "shooting": 94,
      "creation": 93,
      "rimPressure": 88,
      "playmaking": 93,
      "defense": 41,
      "rebounding": 52,
      "rimProtection": 13,
      "athleticism": 70,
      "feel": 88,
      "nbaReadiness": 66,
      "upside": 100,
      "risk": 54
    },
    "scouting": {
      "strengths": [
        "SPOT_UP_SHOOTING",
        "SELF_CREATION",
        "SECONDARY_PLAYMAKING",
        "RIM_PRESSURE",
        "TRANSITION",
        "MOTOR"
      ],
      "weaknesses": [
        "DEFENSIVE_CONSISTENCY",
        "SIZE_LIMITATION"
      ],
      "swingSkill": "TEAM_DEFENSE",
      "mainConcern": "DEFENSIVE_CONSISTENCY",
      "translationSummary": "Acuff se destaca pela dureza mental, frieza emocional e leitura de jogo que permite alimentar os companheiros com constância, tanto em transição quanto no half court. É um armador com identidade competitiva forte e mostrou um certo 'gosto pela decisão' em sua temporada por Arkansas, que nos chama muita atenção. É um aspecto um pouco mais intangível, mas pensamos que pode ser um diferencial importante nele como prospecto. Suas fraquezas são certamente sua altura, que é bem abaixo do ideal para a posição, e é o que mais pode dificultar sua projeção como um estrela na liga. Por outro lado, sua envergadura é bem interessante, e analisando a tape do seu jogo, ele foi capaz de finalizar próximo ao aro, com constância e eficiência durante todo o ano, em cima de defensores bem maiores e mais atléticos, ou seja, não é como se sua dieta de arremessos fosse baseada puramente no perímetro e meia distância, o que talvez pode dar uma esperança a longo prazo, mas certamente, ainda deve conviver com dúvidas defensivas por toda carreira. Em geral, foi um dos prospectos mais elusivos, com jogo ofensivo vasto e estranhamente regular para um armador 'baixinho' e calouro. Nós não temos nele um teto de franchise player, mas sim uma boa estrela na liga é onde ele deve chegar se tudo der certo.",
      "notes": [
        "SEC Player of Year + Freshman of Year — 845 pontos, recorde Arkansas",
        "Único jogador na NCAA a fazer 20+ PPG e 6+ APG com 48% FG e 44% de 3",
        "Motor ofensivo explosivo; capacidade de virar jogo sozinho (49 pts no recorde pessoal)",
        "Estatura limitante para guarda NBA (6'2\") sem compensação atlética óbvia",
        "Hábitos defensivos ruins chamam atenção de scouts — ponto de atenção real"
      ]
    },
    "dataConfidence": {
      "stats": "HIGH",
      "scouting": "HIGH",
      "projection": "HIGH",
      "role": "HIGH"
    }
  },
  "kingston-flemings": {
    "playerId": "6",
    "name": "Kingston Flemings",
    "position": "PG",
    "tier": "LOTTERY",
    "archetype": "COMBO_GUARD",
    "projectedRole": "ROTATION_GUARD",
    "risk": "MODERATE",
    "projection": {
      "floor": "ROTATION",
      "ceiling": "FRANCHISE_PLAYER",
      "realisticOutcome": "ALL_STAR",
      "projectionScoreOverride": 73
    },
    "manualTraits": {
      "shooting": 78,
      "creation": 88,
      "rimPressure": 72,
      "playmaking": 83,
      "defense": 60,
      "rebounding": 60,
      "rimProtection": 18,
      "athleticism": 64,
      "feel": 76,
      "nbaReadiness": 74,
      "upside": 99,
      "risk": 54
    },
    "scouting": {
      "strengths": [
        "SPOT_UP_SHOOTING",
        "SELF_CREATION",
        "SECONDARY_PLAYMAKING",
        "RIM_PRESSURE",
        "TEAM_DEFENSE"
      ],
      "weaknesses": [
        "ROLE_CLARITY",
        "RIM_FINISHING"
      ],
      "swingSkill": "SPOT_UP_SHOOTING",
      "mainConcern": "ROLE_CLARITY",
      "translationSummary": "Flemings é frequentemente reduzido ao rótulo de scorer, mas seu perfil vai além disso: tem alguma sensibilidade no pick-and-roll para achar passes, e é possivelmente o jogador mais veloz da classe em espaços. A velocidade que exibe não é apenas atlética — é combinada com leitura de jogo suficiente para transformá-la em vantagem concreta dentro das estruturas ofensivas. Um prospecto com esse perfil de transição, e capaz de desequilibrar com poucos toques na meia quadra, tende a encontrar papel imediato em qualquer sistema de jogo moderno. Não acreditamos que ele é, como a média das análises projeta, um prospecto superior a caras como Mikel Brown Jr, por exemplo, mas ainda assim, trata-se de um dos jogadores mais sólidos e prontos pra impactar do topo desse Draft.  Seu teto não nos parece ser tão alto, o que tira ele de algumas conversas nessa classe, como um talento TOP-6, mas é sólido o suficiente pra ser uma escolha de loteria segura. Assim como outros guards da classe, suas medidas são um problema. Altura bem abaixo, e principalmente, a menor envergadura entre os armadores, podem dificultar seu valor no dia do Draft. Mas cremos que mesmo assim, sua técnica refinada, QI de jogo elevado, e eficiência em vários cenários, o consolidam como uma escolha justa na loteria. Vemos suas características mais para um bom coadjuvante, do que um protagonista real, pois ele é um armador que não deve prosperar com muitos toques, controlando o ataque posse após posse, criando cestas do nada com frequência, ou sendo um maestro ofensivo criando para os companheiros como Acuff ou Mikel já são, por exemplo.",
      "notes": [
        "Playmaking de elite — comparado a Derrick Rose pela visão e explosão",
        "Arremessador confiável de 3 (40%) com alto QI ofensivo",
        "Liderança comprovada em sistema de alta exigência defensiva de Houston",
        "Tamanho limítrofe para PG na NBA (6'3\")",
        "Precisará se afirmar como finalizador contra corpos maiores"
      ]
    },
    "dataConfidence": {
      "stats": "HIGH",
      "scouting": "HIGH",
      "projection": "HIGH",
      "role": "HIGH"
    }
  },
  "mikel-brown": {
    "playerId": "7",
    "name": "Mikel Brown Jr.",
    "position": "PG/SG",
    "tier": "ELITE",
    "archetype": "PRIMARY_CREATOR",
    "projectedRole": "STARTING_GUARD",
    "projection": {
      "floor": "ROTATION",
      "ceiling": "FRANCHISE_PLAYER",
      "realisticOutcome": "ALL_STAR",
      "projectionScoreOverride": 73
    },
    "manualTraits": {
      "shooting": 70,
      "creation": 68,
      "rimPressure": 75,
      "playmaking": 61,
      "defense": 47,
      "rebounding": 34,
      "rimProtection": 7,
      "athleticism": 54,
      "feel": 51,
      "nbaReadiness": 63,
      "upside": 98
    },
    "scouting": {
      "strengths": [
        "SELF_CREATION",
        "SECONDARY_PLAYMAKING",
        "RIM_PRESSURE",
        "TEAM_DEFENSE",
        "ADVANTAGE_CREATION"
      ],
      "weaknesses": [
        "INJURY_RISK",
        "SHOOTING_CONSISTENCY",
        "SHOT_SELECTION"
      ],
      "swingSkill": "SELF_CREATION",
      "mainConcern": "INJURY_RISK",
      "translationSummary": "Brown é um handler elétrico em espaço aberto que combina criação de vantagem com movimentação off-ball sofisticada — domina saídas em pin-downs, staggers e flare screens como atirador com naturalidade. Esse perfil duplo é raro: a maioria dos guards dessa classe tende a ser uma coisa ou outra. A temporada irregular no Louisville teve um efeito supressor no seu valor percebido, mas quem olha além das flutuações reconhece nele uma das apostas mais subestimadas da classe.",
      "notes": [
        "Tamanho posicional excelente para guarda moderno (6'5\")",
        "Criação de contato e ida à linha de lance livre em volume alto",
        "Visão de jogo e passagem criativa — potencial como iniciador primário",
        "Lesão nas costas encerrou temporada 6 jogos cedo — preocupação médica real",
        "Eficiência de 3 inconsistente (34%) com oscilações de temperatura ao longo do ano"
      ]
    },
    "dataConfidence": {
      "stats": "HIGH",
      "scouting": "HIGH",
      "projection": "HIGH",
      "role": "HIGH"
    }
  },
  "nate-ament": {
    "playerId": "9",
    "name": "Nate Ament",
    "position": "SF/PF",
    "tier": "FIRST_ROUND",
    "archetype": "TWO_WAY_WING",
    "projectedRole": "ROTATION_WING",
    "risk": "HIGH",
    "projection": {
      "floor": "TWO_WAY",
      "ceiling": "ALL_STAR",
      "realisticOutcome": "ROTATION",
      "projectionScoreOverride": 62
    },
    "manualTraits": {
      "shooting": 60,
      "creation": 36,
      "rimPressure": 69,
      "playmaking": 48,
      "defense": 60,
      "rebounding": 74,
      "rimProtection": 38,
      "athleticism": 63,
      "feel": 44,
      "nbaReadiness": 36,
      "upside": 85,
      "risk": 76
    },
    "scouting": {
      "strengths": [
        "SELF_CREATION",
        "REBOUNDING",
        "RIM_PROTECTION",
        "TEAM_DEFENSE"
      ],
      "weaknesses": [
        "SHOOTING_CONSISTENCY",
        "DECISION_MAKING",
        "DEFENSIVE_CONSISTENCY",
        "LOW_FEEL",
        "RIM_FINISHING"
      ],
      "swingSkill": "SELF_CREATION",
      "mainConcern": "SHOOTING_CONSISTENCY",
      "translationSummary": "Ament chegou à temporada com status de top 5-7, mas eficiência abaixo do esperado, dificuldades para criar vantagens, arremessos limpos e criação coletiva, nos fazem pôr em cheque seu valor como prospecto. O que ficou, foram alguns flashes como pontuador que alimentam certa esperança, além de contribuição defensiva acima da média. Existe um mundo onde ele vira algo a mais, mas existem muitos mais onde ele não passa de um bom role player. E existem chances reais de sua irregularidade e dificuldades técnicas o levarem ao esquecimento após alguns anos. Alto risco, pra talvez uma grande recompensa. Ou provavelmente, uma recompensa sólida, mas nada especial.",
      "notes": [
        "Tamanho wing de 6'10\" com tiro de médio alcance suave — modelo Kevin Durant",
        "Potencial defensivo imenso com comprimento e instintos naturais",
        "QI de leitura de jogo avançado para um freshman",
        "Confiança e assertividade como shotmaker ainda inconsistentes",
        "Arremesso de 3 em 32.8% — precisa melhorar para maximizar spacing na NBA"
      ]
    },
    "dataConfidence": {
      "stats": "HIGH",
      "scouting": "HIGH",
      "projection": "HIGH",
      "role": "HIGH"
    }
  },
  "aday-mara": {
    "playerId": "25",
    "name": "Aday Mara",
    "position": "C",
    "tier": "ELITE",
    "archetype": "PLAYMAKING_BIG",
    "projectedRole": "THIRD_OPTION",
    "risk": "MODERATE",
    "projection": {
      "floor": "ROTATION",
      "ceiling": "ALL_STAR",
      "realisticOutcome": "STARTER",
      "projectionScoreOverride": 71
    },
    "manualTraits": {
      "shooting": 36,
      "creation": 60,
      "rimPressure": 59,
      "playmaking": 59,
      "defense": 90,
      "rebounding": 60,
      "rimProtection": 95,
      "athleticism": 43,
      "feel": 58,
      "nbaReadiness": 88,
      "upside": 88,
      "risk": 54
    },
    "scouting": {
      "strengths": [
        "REBOUNDING",
        "RIM_PROTECTION",
        "TEAM_DEFENSE"
      ],
      "weaknesses": [
        "SHOOTING_CONSISTENCY",
        "LOW_VOLUME_SHOOTING",
        "INJURY_RISK",
        "AGE_UPSIDE"
      ],
      "swingSkill": "REBOUNDING",
      "mainConcern": "SHOOTING_CONSISTENCY",
      "translationSummary": "Mara é um pivô de 7'3 com presença defensiva que distorce a geometria do ataque adversário só pela sua posição na quadra. Foi peça central de uma da defesa mais dominantes do basquete universitário na temporada, com percentual de tocos entre os mais altos da divisão. Soma a isso uma capacidade de passe rara para um jogador do seu porte, o que o torna mais do que uma simples âncora defensiva — é um pivô com mãos e visão de jogo que transcendem o estereótipo da posição. Com um trabalho de pés absurdo, e toque super refinado, ele domina no post scoring, elevando sua capacidade de pontuar próximo ao aro, e dando no todo, uma margem de crescimento das mais animadoras da classe, junto a um piso também bom.",
      "notes": [
        "Dimensões de rim protector de elite (7' + envergadura 7'5\")",
        "26 pontos contra Arizona no Final Four — desempenho assinatura em 2026",
        "Boa mão e touch de finalizador no pós (53.4% FG)",
        "Jogador mais velho da classe (22 anos)",
        "Tiro de 3 (31.5%) precisa evoluir para spacing moderno"
      ]
    },
    "dataConfidence": {
      "stats": "HIGH",
      "scouting": "HIGH",
      "projection": "HIGH",
      "role": "HIGH"
    }
  },
  "labaron-philon": {
    "playerId": "11",
    "name": "Labaron Philon",
    "position": "PG/SG",
    "tier": "LOTTERY",
    "archetype": "PRIMARY_CREATOR",
    "projectedRole": "STARTING_GUARD",
    "risk": "LOW",
    "projection": {
      "floor": "ROTATION",
      "ceiling": "FRANCHISE_PLAYER",
      "realisticOutcome": "ALL_STAR",
      "projectionScoreOverride": 75
    },
    "manualTraits": {
      "shooting": 88,
      "creation": 78,
      "rimPressure": 73,
      "playmaking": 72,
      "defense": 74,
      "rebounding": 36,
      "rimProtection": 7,
      "athleticism": 54,
      "feel": 69,
      "nbaReadiness": 88,
      "upside": 86,
      "risk": 28
    },
    "scouting": {
      "strengths": [
        "SPOT_UP_SHOOTING",
        "SELF_CREATION",
        "SECONDARY_PLAYMAKING",
        "RIM_PRESSURE",
        "TEAM_DEFENSE"
      ],
      "weaknesses": [
        "DEFENSIVE_CONSISTENCY",
        "ROLE_CLARITY"
      ],
      "swingSkill": "SPOT_UP_SHOOTING",
      "mainConcern": "DEFENSIVE_CONSISTENCY",
      "translationSummary": "Philon é um armador com inteligência de jogo fora do comum para a idade, combinando competitividade com um conjunto de habilidades que sugere adaptação rápida ao ritmo profissional. Sua leitura defensiva e capacidade de encaixe em sistemas já estabelecidos o tornam um prospecto que agrega sem precisar de protagonismo imediato. Há também uma dimensão de potencial ainda não totalmente revelado — alguém que pode começar cumprindo papel definido e gradualmente assumir as chaves do carro. Um dos prospectos mais subestimados da classe hoje, pois trata-se de um legítimo TOP-10 com poucas falhas muito notórias em seu jogo.",
      "notes": [
        "Tiro de 3 elite (40.2%) com 2.3 cestas por jogo — spacer e criador simultâneo",
        "Segundo ano transformado: liderança, eficiência e produção escalaram juntas",
        "Defensor com boa antecipação e presença no ponto de ataque",
        "Tamanho limítrofe para a posição na NBA (6'3\")",
        "Sem arma de chega-ao-aro consistente contra corpos maiores"
      ]
    },
    "dataConfidence": {
      "stats": "HIGH",
      "scouting": "HIGH",
      "projection": "HIGH",
      "role": "HIGH"
    }
  },
  "yaxel-lendeborg": {
    "playerId": "10",
    "name": "Yaxel Lendeborg",
    "position": "PF",
    "tier": "FIRST_ROUND",
    "archetype": "VERSATILE_FORWARD",
    "projectedRole": "ROTATION_WING",
    "projection": {
      "floor": "ROTATION",
      "ceiling": "STARTER",
      "realisticOutcome": "BENCH",
      "projectionScoreOverride": 63
    },
    "manualTraits": {
      "shooting": 74,
      "creation": 60,
      "rimPressure": 66,
      "playmaking": 62,
      "defense": 36,
      "rebounding": 74,
      "rimProtection": 62,
      "athleticism": 60,
      "feel": 70,
      "nbaReadiness": 74,
      "upside": 85
    },
    "scouting": {
      "strengths": [
        "SPOT_UP_SHOOTING",
        "SECONDARY_PLAYMAKING",
        "RIM_PRESSURE",
        "REBOUNDING",
        "RIM_PROTECTION"
      ],
      "weaknesses": [
        "DEFENSIVE_CONSISTENCY",
        "AGE_UPSIDE",
        "SHOT_SELECTION"
      ],
      "swingSkill": "SPOT_UP_SHOOTING",
      "mainConcern": "DEFENSIVE_CONSISTENCY",
      "translationSummary": "Lendenborg é um dos prospectos mais prontos da classe. Promete impactar rapidamente onde quer que chegue, como um ala versátil, capaz de defender e atacar. Porém, sua idade avançada - terá 24 anos no íncio da temporada da NBA -, e o fato de não ser, para nós, um grande talento nem defensivo nem ofensivo, não nos passa o conforto que gostaríamos de ter em uma escolha de loteria, que é onde o consenso tem colocado seu nome. Bom jogador para o nível do college, mas nada animador pensando em desenvolvimento de médio e longo prazo em nível de NBA.",
      "notes": [
        "Eficiência de elite para função complementar: 64.6% TS e 60.2% eFG.",
        "Playmaking muito forte para forward: 3.2 APG e AST/TO 3.1.",
        "Impacto defensivo real: 2.1% STL, 4.4% BLK e DBPM 5.9 no perfil DraftBallr.",
        "Idade de 23.7 anos reduz margem de crescimento em compara??o aos freshmen.",
        "Perfil tende mais a alto impacto de rotação do que criação primária NBA."
      ]
    },
    "dataConfidence": {
      "stats": "HIGH",
      "scouting": "HIGH",
      "projection": "HIGH",
      "role": "HIGH"
    }
  },
  "allen-graves": {
    "playerId": "12",
    "name": "Allen Graves",
    "position": "SF/PF",
    "tier": "FIRST_ROUND",
    "archetype": "BIG_WING",
    "projectedRole": "ROTATION_WING",
    "projection": {
      "floor": "ROTATION",
      "ceiling": "STARTER",
      "realisticOutcome": "STARTER",
      "projectionScoreOverride": 65
    },
    "manualTraits": {
      "shooting": 88,
      "creation": 60,
      "rimPressure": 56,
      "playmaking": 62,
      "defense": 88,
      "rebounding": 74,
      "rimProtection": 70,
      "athleticism": 60,
      "feel": 66,
      "nbaReadiness": 74,
      "upside": 80
    },
    "scouting": {
      "strengths": [
        "SPOT_UP_SHOOTING",
        "SECONDARY_PLAYMAKING",
        "REBOUNDING",
        "RIM_PROTECTION",
        "TEAM_DEFENSE"
      ],
      "weaknesses": [
        "TURNOVERS",
        "DEFENSIVE_CONSISTENCY",
        "ROLE_CLARITY"
      ],
      "swingSkill": "FINISHING",
      "mainConcern": "TURNOVERS",
      "translationSummary": "Graves é um forward inteligente e maduro que impacta o jogo com estilo controlado nos dois lados da quadra — tamanho, estrutura física sólida e comprimento funcional dão a ele versatilidade de encaixe em diferentes lineups. Suas métricas de eficiência se destacam apesar de minutos reduzidos num programa de mid-major: 51,7% de aproveitamento geral, 41,6% de três e baixíssima taxa de turnovers, o que indica um jogador com excelente consciência de posição. A avaliação carrega projeção inerente pelo nível de competição enfrentado, e seu atletismo vertical não é explosivo — mas o conjunto de habilidades técnicas, instintos defensivos e leitura coletiva do jogo sugere um jogador que agrega a sistemas vencedores sem precisar de papel central.",
      "notes": [
        "Stretch 4 eficiente: 40.7% de 3 e 61.5% TS no perfil DraftBallr",
        "Impacto defensivo raro para ala/grande, com 4.9% STL e 5.0% BLK",
        "Excelente economia de posse: AST/TO 2.5 e baixo volume de turnovers",
        "Faltas ainda pesam no perfil defensivo",
        "Criacao com a bola ainda parece mais complementar do que primaria"
      ]
    },
    "dataConfidence": {
      "stats": "HIGH",
      "scouting": "HIGH",
      "projection": "HIGH",
      "role": "HIGH"
    }
  },
  "hannes-steinbach": {
    "playerId": "13",
    "name": "Hannes Steinbach",
    "position": "PF/C",
    "tier": "LOTTERY",
    "archetype": "PLAYMAKING_BIG",
    "projectedRole": "ROTATION_BIG",
    "risk": "MODERATE",
    "projection": {
      "floor": "ROTATION",
      "ceiling": "ALL_STAR",
      "realisticOutcome": "STARTER",
      "projectionScoreOverride": 68
    },
    "manualTraits": {
      "shooting": 60,
      "creation": 36,
      "rimPressure": 69,
      "playmaking": 47,
      "defense": 60,
      "rebounding": 92,
      "rimProtection": 55,
      "athleticism": 65,
      "feel": 54,
      "nbaReadiness": 74,
      "upside": 91,
      "risk": 54
    },
    "scouting": {
      "strengths": [
        "SPOT_UP_SHOOTING",
        "REBOUNDING",
        "RIM_PROTECTION",
        "TEAM_DEFENSE"
      ],
      "weaknesses": [
        "LOW_VOLUME_SHOOTING",
        "DECISION_MAKING",
        "STRENGTH"
      ],
      "swingSkill": "PULL_UP_SHOOTING",
      "mainConcern": "LOW_VOLUME_SHOOTING",
      "translationSummary": "Steinbach foi um dos poucos pontos positivos de uma temporada problemática para o Washington, destacando-se como reboteiro voraz e finalizador de alto volume dentro do garrafão. Seu repertório de pontuação na bola parada foi um dos mais impressionantes do país, com lampejos de capacidade de espaçamento que são incomuns para um jogador do seu porte. Oferece solidez produtiva imediata e flexibilidade de encaixe em diferentes configurações de quinteto.",
      "notes": [
        "Tamanho wing de 6'7\" com tiro de 3 (38.1%) e versatilidade defensiva",
        "Coordenação e controle de bola avançados para o tamanho",
        "Jogo two-way com instintos reboteiros acima da média",
        "Criação ISO limitada — mais dependente de sistema do que initiator",
        "Precisa amadurecer fisicamente para os embates de 3s/4s na NBA"
      ]
    },
    "dataConfidence": {
      "stats": "HIGH",
      "scouting": "HIGH",
      "projection": "HIGH",
      "role": "HIGH"
    }
  },
  "tounde-yessoufou": {
    "playerId": "17",
    "name": "Tounde Yessoufou",
    "position": "SF",
    "tier": "FRINGE",
    "archetype": "DEFENSIVE_WING",
    "projectedRole": "ROTATION_WING",
    "risk": "HIGH",
    "projection": {
      "floor": "BENCH",
      "ceiling": "STARTER",
      "realisticOutcome": "ROTATION",
      "projectionScoreOverride": 58
    },
    "manualTraits": {
      "shooting": 36,
      "creation": 36,
      "rimPressure": 65,
      "playmaking": 40,
      "defense": 74,
      "rebounding": 74,
      "rimProtection": 27,
      "athleticism": 72,
      "feel": 40,
      "nbaReadiness": 60,
      "upside": 81,
      "risk": 54
    },
    "scouting": {
      "strengths": [
        "REBOUNDING",
        "TEAM_DEFENSE",
        "MOTOR"
      ],
      "weaknesses": [
        "SHOOTING_CONSISTENCY",
        "DECISION_MAKING",
        "DEFENSIVE_CONSISTENCY",
        "ROLE_CLARITY",
        "SHOT_SELECTION"
      ],
      "swingSkill": "SELF_CREATION",
      "mainConcern": "SHOOTING_CONSISTENCY",
      "translationSummary": "Yessoufou é um prospecto de instintos defensivos legítimos. Extremamente agressivo no ponto de ataque, é dono de um motor fantástico que resulta em muitos roubos de bola e highlights defensivos. As limitações principais são o arremesso de três pontos, criação individual e jogo na meia quadra. Não se enganem com os números brutos, porque por mais que tenha tido um bom número de pontos por jogo em Baylor, seu jogo ofensivo ainda se baseia em cortes sem a bola, rebotes ofensivos e pontuar na quadra aberta. Chega na NBA como um defensor inveterado, e um operário ofensivo. O desenvolvimento de sua criação individual deve ser o fator que determinará se ele será um jogador de rotação, ou uma peça fundamental de uma equipe vencedora.",
      "notes": [
        "Tamanho e comprimento de wing para defesa versátil na NBA",
        "Arremessador ainda fraco de 3 (29.6%), mas com potencial off-ball",
        "Motor e intensidade que translationam para contribuição imediata",
        "Criação ofensiva ISO limitada — depende de estrutura",
        "Ainda precisa definir papel principal na NBA"
      ]
    },
    "dataConfidence": {
      "stats": "HIGH",
      "scouting": "HIGH",
      "projection": "HIGH",
      "role": "HIGH"
    }
  },
  "cameron-carr": {
    "playerId": "18",
    "name": "Cameron Carr",
    "position": "SG/SF",
    "tier": "LOTTERY",
    "archetype": "THREE_AND_D_WING",
    "projectedRole": "STARTING_WING",
    "projection": {
      "floor": "ROTATION",
      "ceiling": "STARTER",
      "realisticOutcome": "STARTER",
      "projectionScoreOverride": 64
    },
    "manualTraits": {
      "shooting": 80,
      "creation": 60,
      "rimPressure": 78,
      "playmaking": 51,
      "defense": 77,
      "rebounding": 60,
      "rimProtection": 59,
      "athleticism": 72,
      "feel": 57,
      "nbaReadiness": 74,
      "upside": 80
    },
    "scouting": {
      "strengths": [
        "SPOT_UP_SHOOTING",
        "RIM_PRESSURE",
        "WING_DEFENSE",
        "TEAM_DEFENSE",
        "MOTOR",
        "TOUCH",
        "TRANSITION",
        "ATHLETICISM"
      ],
      "weaknesses": [
        "SHOOTING_CONSISTENCY",
        "DECISION_MAKING",
        "DEFENSIVE_CONSISTENCY",
        "TURNOVERS",
        "PLAYMAKING_LIMITATION"
      ],
      "swingSkill": "SPOT_UP_SHOOTING",
      "mainConcern": "SHOOTING_CONSISTENCY",
      "translationSummary": "Carr é um guard atlético com perfil predominantemente off-ball, cujo valor está versatilidade que ele entrega em mixar: movimentação sem a bola, arremesso em catch-and-shoot, finalização explosiva, talento pra de acertar arremessos difíceis [shotmaking], e ainda ser capaz de criar por conta própria de forma secundária. Registrou 41,7% em catch-and-shoot de três pontos na temporada — número que indica consistência real como ameaça de perímetro, não apenas volume. Defensivamente, contribui com seu porte físico avantajado, fisicalidade e esforços, o que faz dele um prospecto relevante nos dois lados da quadra. Para nós, talvez ele não tenha uma curva de desenvolvimento tão sexy quanto outros armadores, mas é um dos guards, pontuadores e chutadores mais confiáveis da classe, com ótimas chances de ser um jogador fundamental a curto, médio e longo prazo onde quer que chegue na NBA.",
      "notes": [
        "Breakout season em Baylor — scorer versátil com tiro de 3 confiável (37.4%)",
        "Tamanho e atletismo para jogar 2/3 na NBA",
        "Produção equilibrada nos três níveis",
        "Playmaking como initiator ainda questão em aberto",
        "Consistência defensiva precisa ser mais assertiva"
      ]
    },
    "dataConfidence": {
      "stats": "HIGH",
      "scouting": "HIGH",
      "projection": "HIGH",
      "role": "HIGH"
    }
  },
  "bennett-stirtz": {
    "playerId": "16",
    "name": "Bennett Stirtz",
    "position": "PG/SG",
    "tier": "FRINGE",
    "archetype": "SCORING_GUARD",
    "projectedRole": "ROTATION_GUARD",
    "projection": {
      "floor": "ROTATION",
      "ceiling": "STARTER",
      "realisticOutcome": "STARTER",
      "projectionScoreOverride": 63
    },
    "manualTraits": {
      "shooting": 74,
      "creation": 74,
      "rimPressure": 79,
      "playmaking": 70,
      "defense": 36,
      "rebounding": 36,
      "rimProtection": 13,
      "athleticism": 40,
      "feel": 74,
      "nbaReadiness": 74,
      "upside": 79
    },
    "scouting": {
      "strengths": [
        "SELF_CREATION",
        "SECONDARY_PLAYMAKING",
        "RIM_PRESSURE",
        "PICK_AND_ROLL_CREATION"
      ],
      "weaknesses": [
        "SHOOTING_CONSISTENCY",
        "DECISION_MAKING",
        "DEFENSIVE_CONSISTENCY",
        "AGE_UPSIDE",
        "ROLE_CLARITY"
      ],
      "swingSkill": "SELF_CREATION",
      "mainConcern": "SHOOTING_CONSISTENCY",
      "translationSummary": "Stirtz é um armador dinâmico que consegue impactar o jogo em mais de uma área, tendo uma boa capacidade de envolver os companheiros e pontuar. Porém, seu jogo em Iowa é muito maximizado por um volume altíssimo, que na NBA não deve se reproduzir, e então, seu impacto também deve ser muito menor. Juntando isso, com sua idade avançada - 23 anos no começo da temporada da NBA -, temos Stirtz como um prospecto que já está bem próximo do seu teto, considerando um estilo de jogo que não deve se traduzir tão bem como o consenso aponta.",
      "notes": [
        "Produção ofensiva alta: 19.8 PPG com 60.7% TS em carga grande.",
        "Criador eficiente no pick-and-roll: 4.4 APG e AST/TO 2.4.",
        "Toque confiável: 84.8% FT e 56.5% eFG",
        "Senior de 22.7 anos, com menor margem de upside puro.",
        "Limitações atléticas e envergadura estimada em 6'6\" podem pesar defensivamente."
      ]
    },
    "dataConfidence": {
      "stats": "HIGH",
      "scouting": "HIGH",
      "projection": "HIGH",
      "role": "HIGH"
    }
  },
  "jayden-quaintance": {
    "playerId": "8",
    "name": "Jayden Quaintance",
    "position": "PF/C",
    "tier": "LOTTERY",
    "archetype": "RIM_PROTECTOR",
    "projectedRole": "DEFENSIVE_SPECIALIST",
    "projection": {
      "floor": "TWO_WAY",
      "ceiling": "ALL_STAR",
      "realisticOutcome": "ROTATION",
      "projectionScoreOverride": 68
    },
    "manualTraits": {
      "shooting": 36,
      "creation": 46,
      "rimPressure": 56,
      "playmaking": 27,
      "defense": 92,
      "rebounding": 80,
      "rimProtection": 80,
      "athleticism": 28,
      "feel": 15,
      "nbaReadiness": 36,
      "upside": 90
    },
    "scouting": {
      "strengths": [
        "RIM_PROTECTION",
        "TEAM_DEFENSE",
        "TRANSITION",
        "REBOUNDING",
        "MOTOR"
      ],
      "weaknesses": [
        "SHOOTING_CONSISTENCY",
        "DECISION_MAKING",
        "DEFENSIVE_CONSISTENCY",
        "INJURY_RISK",
        "SAMPLE_SIZE"
      ],
      "swingSkill": "RIM_PROTECTION",
      "mainConcern": "SHOOTING_CONSISTENCY",
      "translationSummary": "Quaintance exige separação entre o que foi visto e o que ele representa como prospecto: voltou de uma ruptura de LCA em menos de um ano e teve uma temporada visivelmente comprometida pela pressa do retorno. Em condições normais, ele disputa com Caleb Wilson o título de protetor de aro mais dinâmico da classe — combinação de tamanho, mobilidade e timing defensivo que poucos jogadores têm. A incógnita central é saber se o histórico de lesão representa um padrão preocupante ou apenas circunstância de má sorte.",
      "notes": [
        "Bloqueador de chutes de nível generacional — mobilidade e envergadura 7'5\"",
        "Elasticidade e verticalidade raras para um pivô de 18 anos",
        "Defensor que consegue guardar perímetro e proteger o aro na mesma posse",
        "Joelho operado (ACL) + lesão recorrente limitaram a apenas 4 jogos em 2025-26",
        "Ataque bruto e sem arremesso de 3 — necessita evolução ofensiva"
      ]
    },
    "dataConfidence": {
      "stats": "HIGH",
      "scouting": "HIGH",
      "projection": "HIGH",
      "role": "HIGH"
    }
  },
  "karim-lopez": {
    "playerId": "20",
    "name": "Karim Lopez",
    "position": "SF/PF",
    "tier": "FIRST_ROUND",
    "archetype": "CONNECTOR_WING",
    "projectedRole": "ROTATION_WING",
    "projection": {
      "floor": "TWO_WAY",
      "ceiling": "STARTER",
      "realisticOutcome": "ROTATION",
      "projectionScoreOverride": 55
    },
    "manualTraits": {
      "shooting": 60,
      "creation": 36,
      "rimPressure": 23,
      "playmaking": 50,
      "defense": 36,
      "rebounding": 60,
      "rimProtection": 0,
      "athleticism": 50,
      "feel": 50,
      "nbaReadiness": 60,
      "upside": 76
    },
    "scouting": {
      "strengths": [
        "FEEL",
        "SIZE"
      ],
      "weaknesses": [
        "SHOOTING_CONSISTENCY",
        "STRENGTH",
        "DEFENSIVE_CONSISTENCY"
      ],
      "swingSkill": "FEEL",
      "mainConcern": "SHOOTING_CONSISTENCY",
      "translationSummary": "Lopez projeta ser o primeiro mexicano nascido no país a ser escolhido na primeira rodada do draft — uma trajetória construída sobre dois anos produtivos na NBL australiana pelo programa Next Stars dos New Zealand Breakers, o mesmo caminho percorrido por LaMelo Ball, Josh Giddey e Alex Sarr. O jogo está visivelmente desacelerando para ele: compostura com a bola, execução rápida de leituras e ausência de excesso de drible são marcas de um prospecto de 18 anos com maturidade de jogo fora do comum para a idade. A avaliação honesta reconhece que ele ainda é um \"jack of all trades\" sem uma habilidade isolada em que se apoiar imediatamente na NBA, mas a combinação de fisicalidade, versatilidade defensiva e flashes de criação como ala grande representa um teto de construção genuinamente interessante.",
      "notes": [
        "Ferramentas fisicas claras para ala: 6'9 de altura e 7'1 de envergadura estimada",
        "Perfil internacional com upside, comprimento e versatilidade de ataque",
        "DraftBallr destaca potencial de starter se o arremesso e a defesa evoluirem",
        "DraftBallr nao tem amostra estatistica conectada para ele no painel",
        "Consistencia de arremesso e defesa ainda aparecem como pontos de desenvolvimento"
      ]
    },
    "dataConfidence": {
      "stats": "MEDIUM",
      "scouting": "HIGH",
      "projection": "HIGH",
      "role": "HIGH"
    }
  },
  "malachi-moreno": {
    "playerId": "21",
    "name": "Malachi Moreno",
    "position": "PF/C",
    "tier": "SLEEPER",
    "archetype": "ENERGY_BIG",
    "projectedRole": "ROTATION_BIG",
    "risk": "HIGH",
    "projection": {
      "floor": "TWO_WAY",
      "ceiling": "ROTATION",
      "realisticOutcome": "ROTATION",
      "projectionScoreOverride": 50
    },
    "manualTraits": {
      "shooting": 36,
      "creation": 36,
      "rimPressure": 51,
      "playmaking": 50,
      "defense": 74,
      "rebounding": 60,
      "rimProtection": 85,
      "athleticism": 41,
      "feel": 51,
      "nbaReadiness": 60,
      "upside": 83,
      "risk": 76
    },
    "scouting": {
      "strengths": [
        "REBOUNDING",
        "RIM_PROTECTION",
        "TEAM_DEFENSE",
        "PICK_AND_ROLL_CREATION"
      ],
      "weaknesses": [
        "SHOOTING_CONSISTENCY",
        "LOW_VOLUME_SHOOTING"
      ],
      "swingSkill": "REBOUNDING",
      "mainConcern": "SHOOTING_CONSISTENCY",
      "translationSummary": "Moreno é um prospecto de perfil moderno para a posição: baixo uso, boa distribuição para um pivô, alto índice Morey e presença frequente na linha de lances livres. O BPM elevado sugere impacto real enquanto está em quadra. O obstáculo central é a finalização na borda — o único caminho ofensivo verdadeiramente disponível para ele, dado que não arremessa de três pontos. Se não resolver essa conversão, o teto ofensivo se estreita consideravelmente, independentemente das outras qualidades que apresenta.",
      "notes": [
        "Tamanho e envergadura de rim protector de nível NBA",
        "Eficiência alta como finalizador (52.7% FG) em posições de baixo posto",
        "All-SEC Freshman Team 2026",
        "Sem arremesso externo — zero tentativas de 3 em 2025-26",
        "Lance livre baixo (64.2%) revela limitações de toque"
      ]
    },
    "dataConfidence": {
      "stats": "HIGH",
      "scouting": "HIGH",
      "projection": "HIGH",
      "role": "HIGH"
    }
  },
  "amari-allen": {
    "playerId": "22",
    "name": "Amari Allen",
    "position": "SF/PF",
    "tier": "FIRST_ROUND",
    "archetype": "CONNECTOR_WING",
    "projectedRole": "ROTATION_WING",
    "projection": {
      "floor": "BENCH",
      "ceiling": "STARTER",
      "realisticOutcome": "ROTATION",
      "projectionScoreOverride": 59
    },
    "manualTraits": {
      "shooting": 60,
      "creation": 74,
      "rimPressure": 59,
      "playmaking": 53,
      "defense": 60,
      "rebounding": 74,
      "rimProtection": 31,
      "athleticism": 49,
      "feel": 59,
      "nbaReadiness": 60,
      "upside": 82
    },
    "scouting": {
      "strengths": [
        "SECONDARY_PLAYMAKING",
        "TEAM_DEFENSE",
        "FEEL"
      ],
      "weaknesses": [
        "SHOOTING_CONSISTENCY",
        "DECISION_MAKING",
        "ROLE_CLARITY"
      ],
      "swingSkill": "SECONDARY_PLAYMAKING",
      "mainConcern": "SHOOTING_CONSISTENCY",
      "translationSummary": "Allen é descrito como o conector mais talentoso e silencioso da classe, com tamanho posicional adequado, tomada de decisão acima da média e capacidade de complementar diferentes estruturas ofensivas. Seu arremesso ainda está em desenvolvimento, mas o QI ofensivo e a inteligência de leitura compensam a limitação temporária — são atributos que tendem a perdurar mais do que percentuais de uma temporada. É o tipo de prospecto cujo valor real só se revela dentro de sistemas bem construídos, onde a capacidade de conectar jogadas sem desperdiçar posse se torna um diferencial concreto.",
      "notes": [
        "Passador acima da média para a posição (A/T ratio de 2.3)",
        "Defensor versátil e reboteiro consistente",
        "Arremessador de 3 capaz (36.2%) — spacing real",
        "Pontuação modesta (12.6 PPG) — ainda não provou escalar ofensivamente",
        "Precisará definir papel principal na NBA"
      ]
    },
    "dataConfidence": {
      "stats": "HIGH",
      "scouting": "HIGH",
      "projection": "HIGH",
      "role": "HIGH"
    }
  },
  "isaiah-evans": {
    "playerId": "24",
    "name": "Isaiah Evans",
    "position": "SG",
    "tier": "FRINGE",
    "archetype": "MOVEMENT_SHOOTER",
    "projectedRole": "ROTATION_GUARD",
    "projection": {
      "floor": "BENCH",
      "ceiling": "STARTER",
      "realisticOutcome": "ROTATION",
      "projectionScoreOverride": 57
    },
    "manualTraits": {
      "shooting": 74,
      "creation": 60,
      "rimPressure": 56,
      "playmaking": 35,
      "defense": 36,
      "rebounding": 36,
      "rimProtection": 41,
      "athleticism": 49,
      "feel": 46,
      "nbaReadiness": 74,
      "upside": 81
    },
    "scouting": {
      "strengths": [
        "SPOT_UP_SHOOTING",
        "MOVEMENT_SHOOTING",
        "OFF_BALL_VALUE",
        "TEAM_DEFENSE"
      ],
      "weaknesses": [
        "SHOOTING_CONSISTENCY",
        "DECISION_MAKING",
        "DEFENSIVE_CONSISTENCY",
        "LOW_MOTOR"
      ],
      "swingSkill": "SELF_CREATION",
      "mainConcern": "SHOOTING_CONSISTENCY",
      "translationSummary": "Evans é um guard de 6'6\" com mecanismo de arremesso de alta liberação que, combinado com sua envergadura, torna cada tentativa um problema complexo para qualquer defensor. A movimentação em telas e a capacidade de abrir espaço na linha de três — como opção de pop ou cortador — forçam decisões difíceis de forma constante. Ainda em desenvolvimento como jogador completo, a qualidade do arremesso por si só já garante impacto ofensivo consistente em nível profissional.",
      "notes": [
        "Tamanho wing com tiro de 3 sólido (36.1%) e comprometimento defensivo",
        "Assumiu usage maior no segundo semestre com Boozer dobrado",
        "Produção em contexto de elite confirma base técnica",
        "Criação fora da bola predominante — limitações como ball handler",
        "Explosividade atlética média para a posição"
      ]
    },
    "dataConfidence": {
      "stats": "HIGH",
      "scouting": "HIGH",
      "projection": "HIGH",
      "role": "HIGH"
    }
  },
  "christian-anderson": {
    "playerId": "26",
    "name": "Christian Anderson",
    "position": "PG",
    "tier": "LOTTERY",
    "archetype": "SCORING_GUARD",
    "projectedRole": "ROTATION_GUARD",
    "risk": "HIGH",
    "projection": {
      "floor": "BENCH",
      "ceiling": "STARTER",
      "realisticOutcome": "ROTATION",
      "projectionScoreOverride": 50
    },
    "manualTraits": {
      "shooting": 88,
      "creation": 74,
      "rimPressure": 76,
      "playmaking": 64,
      "defense": 36,
      "rebounding": 60,
      "rimProtection": 10,
      "athleticism": 56,
      "feel": 70,
      "nbaReadiness": 88,
      "upside": 71,
      "risk": 76
    },
    "scouting": {
      "strengths": [
        "SPOT_UP_SHOOTING",
        "SELF_CREATION",
        "SECONDARY_PLAYMAKING",
        "RIM_PRESSURE",
        "TEAM_DEFENSE",
        "PICK_AND_ROLL_CREATION"
      ],
      "weaknesses": [
        "SHOOTING_CONSISTENCY",
        "DEFENSIVE_CONSISTENCY"
      ],
      "swingSkill": "SPOT_UP_SHOOTING",
      "mainConcern": "SHOOTING_CONSISTENCY",
      "translationSummary": "Anderson é um dos prospectos de armadores com perfil ofensivo mais amplo desta classe: eficiência excepcional, criação real para companheiros [playmaking], criação individual excelente e em várias áreas da quadra, arremesso de três com volume/eficiência invejáveis, e uma trajetória de evolução clara entre as duas temporadas universitárias. As limitações estão no físico — altura e peso abaixo do ideal para a posição — e no impacto defensivo. Entretanto, analisando seu jogo em quadra, mesmo tendo 1.85m de altura [sem tênis], ele demonstra um atleticismo suficiente pra superar esses asteriscos. Sua tape mostra um ótimo controle corporal para infiltrar, absorver contato e finalizar com constância próximo ao aro. Se a eficiência se mantiver em bom nível, seu teto como criador individual/coletivo, e arremessador é genuinamente elevado. Um dos talentos mais subestimados do Draft.",
      "notes": [
        "Arremessador de elite (42.5% de 3 com 3.4 cestas por jogo)",
        "Salta de 10.6 para 18.9 PPG no segundo ano — explosão de produção",
        "All-Big 12 First Team — scorer premium em conferência de alto nível",
        "Playmaking como iniciador primário ainda limitado (2.8 APG)",
        "Sem grande criação fora do arremesso"
      ]
    },
    "dataConfidence": {
      "stats": "HIGH",
      "scouting": "HIGH",
      "projection": "HIGH",
      "role": "HIGH"
    }
  },
  "koa-peat": {
    "playerId": "27",
    "name": "Koa Peat",
    "position": "PF",
    "tier": "FRINGE",
    "archetype": "VERSATILE_FORWARD",
    "projectedRole": "ROTATION_BIG",
    "risk": "MODERATE",
    "projection": {
      "floor": "BENCH",
      "ceiling": "STARTER",
      "realisticOutcome": "ALL_STAR",
      "projectionScoreOverride": 70
    },
    "manualTraits": {
      "shooting": 60,
      "creation": 74,
      "rimPressure": 61,
      "playmaking": 47,
      "defense": 60,
      "rebounding": 60,
      "rimProtection": 35,
      "athleticism": 44,
      "feel": 51,
      "nbaReadiness": 60,
      "upside": 78,
      "risk": 54
    },
    "scouting": {
      "strengths": [
        "REBOUNDING",
        "RIM_PROTECTION",
        "TEAM_DEFENSE"
      ],
      "weaknesses": [
        "SHOOTING_CONSISTENCY",
        "LOW_VOLUME_SHOOTING",
        "ROLE_CLARITY"
      ],
      "swingSkill": "REBOUNDING",
      "mainConcern": "SHOOTING_CONSISTENCY",
      "translationSummary": "Peat começou o processo - de forma inexplicável para nós -, como um candidato ao topo do Draft, mas a exposição prolongada revelou uma dieta de arremessos quase exclusivamente na área pintada, baseada em cortes e dependente muitas vezes de passes dos outros. A aposta em Peat é sobre seu QI, prontidão e físico de veterano: ele acumula pontos dentro das brechas do ataque sem precisar ter a bola nas mãos, e é um passador sólido para seu perfil de jogador. Mas o fato de pontuar em cortes pra cesta, sem precisar estar com a bola nas mãos, revela nesse caso, toda a dificuldade que ele possui criando pra si no jogo on-ball. Seu físico é certamente mais que pronto pra NBA, mas seu jogo mostra carências e brechas que na nossa avaliação, encurtam muito sua curva de desenvolvimento e teto como jogador. Dependerá de um sistema ofensivo muito peculiar, e disposto a comprar suas particularidades. Precisará de um repentino, surpreendente e improvável desenvolvimento do arsenal ofensivo individual para desbloquear um potencial que hoje é consideravelmente baixo, apesar do piso, e possível no curto prazo ser interessante.",
      "notes": [
        "Físico de \"Mack truck\" — usa força para dominar rebote e defesa de pós",
        "Finalizador explosivo no aro com atletismo para sua estatura (53.6% FG)",
        "QI de rebote e esforço que enchem a caixa de estatísticas silenciosas",
        "Zero tentativas de arremesso de 3 — perfil ofensivo potencialmente limitante na NBA moderna",
        "Consistência inconsistente — jogos de alto impacto alternados com aparições invisíveis"
      ]
    },
    "dataConfidence": {
      "stats": "HIGH",
      "scouting": "HIGH",
      "projection": "HIGH",
      "role": "HIGH"
    }
  },
  "brayden-burries": {
    "playerId": "28",
    "name": "Brayden Burries",
    "position": "SG",
    "tier": "LOTTERY",
    "archetype": "THREE_AND_D_WING",
    "projectedRole": "ROTATION_GUARD",
    "projection": {
      "floor": "BENCH",
      "ceiling": "STARTER",
      "realisticOutcome": "ROTATION",
      "projectionScoreOverride": 67
    },
    "manualTraits": {
      "shooting": 77,
      "creation": 60,
      "rimPressure": 64,
      "playmaking": 56,
      "defense": 78,
      "rebounding": 74,
      "rimProtection": 10,
      "athleticism": 51,
      "feel": 62,
      "nbaReadiness": 74,
      "upside": 77
    },
    "scouting": {
      "strengths": [
        "SPOT_UP_SHOOTING",
        "SECONDARY_PLAYMAKING",
        "RIM_PRESSURE",
        "TEAM_DEFENSE",
        "TRANSITION"
      ],
      "weaknesses": [
        "DEFENSIVE_CONSISTENCY",
        "ROLE_CLARITY",
        "DECISION_MAKING"
      ],
      "swingSkill": "SPOT_UP_SHOOTING",
      "mainConcern": "DEFENSIVE_CONSISTENCY",
      "translationSummary": "Burries é um defensor agressivo e predatório no perímetro, com habilidade específica de pressionar armadores adversários de alto nível — uma função valiosa que muitos guards não conseguem exercer com consistência. Seu papel secundário no Arizona manteve encoberto um potencial ainda não explorado de atuar como armador titular no futuro. É o tipo de perfil que cresce na avaliação quanto mais se entende o impacto das funções invisíveis do basquete.",
      "notes": [
        "Arremessador fluente de 3 (38.4%)",
        "Playmaking sólido em time de Final Four",
        "Produção em sistema de alta exigência",
        "Tamanho de guarda NBA (6'3\")",
        "Falta de criação off the dribble explícita"
      ]
    },
    "dataConfidence": {
      "stats": "HIGH",
      "scouting": "HIGH",
      "projection": "HIGH",
      "role": "HIGH"
    }
  },
  "joshua-jefferson": {
    "playerId": "31",
    "name": "Joshua Jefferson",
    "position": "PF/C",
    "tier": "FRINGE",
    "archetype": "STRETCH_BIG",
    "projectedRole": "ROTATION_WING",
    "risk": "LOW",
    "projection": {
      "floor": "BENCH",
      "ceiling": "STARTER",
      "realisticOutcome": "ROTATION",
      "projectionScoreOverride": 58
    },
    "manualTraits": {
      "shooting": 68,
      "creation": 74,
      "rimPressure": 66,
      "playmaking": 70,
      "defense": 74,
      "rebounding": 74,
      "rimProtection": 48,
      "athleticism": 56,
      "feel": 72,
      "nbaReadiness": 60,
      "upside": 68,
      "risk": 28
    },
    "scouting": {
      "strengths": [
        "SELF_CREATION",
        "SECONDARY_PLAYMAKING",
        "REBOUNDING",
        "RIM_PROTECTION",
        "TEAM_DEFENSE"
      ],
      "weaknesses": [
        "SHOOTING_CONSISTENCY",
        "AGE_UPSIDE"
      ],
      "swingSkill": "SELF_CREATION",
      "mainConcern": "SHOOTING_CONSISTENCY",
      "translationSummary": "Jefferson foi possivelmente o forward universit?rio mais criativo na distribui??o da temporada, com leitura de jogo coletivo que raramente aparece nessa posi??o. A disposi??o para envolver colegas em a??es complexas reflete QI ofensivo genuinamente diferenciado. A criatividade ?s vezes ultrapassa os limites do control?vel ? ele erra mais do que deveria nos momentos em que testa os pr?prios limites ?, mas isso ? o reverso de uma qualidade real, n?o um defeito estrutural.",
      "notes": [
        "Point-forward real: 4.8 APG, 27.7% AST e cria??o de alto n?vel para a posi??o.",
        "Defesa muito ativa: 3.1% STL, 3.4% BLK e DBPM 5.5.",
        "Volume f?sico e rebote: 7.4 RPG com 240 lbs no perfil DraftBallr.",
        "Efici?ncia geral mediana para o volume: 56.0% TS e -0.5 rTS.",
        "Arremesso ainda precisa estabilizar: 34.5% de 3 e 70.0% FT."
      ]
    },
    "dataConfidence": {
      "stats": "HIGH",
      "scouting": "HIGH",
      "projection": "HIGH",
      "role": "HIGH"
    }
  },
  "chris-cenac": {
    "playerId": "15",
    "name": "Chris Cenac Jr.",
    "position": "PF",
    "tier": "FRINGE",
    "archetype": "VERSATILE_FORWARD",
    "projectedRole": "ROTATION_BIG",
    "projection": {
      "floor": "TWO_WAY",
      "ceiling": "STARTER",
      "realisticOutcome": "ROTATION",
      "projectionScoreOverride": 53
    },
    "manualTraits": {
      "shooting": 60,
      "creation": 36,
      "rimPressure": 58,
      "playmaking": 32,
      "defense": 36,
      "rebounding": 74,
      "rimProtection": 36,
      "athleticism": 44,
      "feel": 41,
      "nbaReadiness": 60,
      "upside": 74
    },
    "scouting": {
      "strengths": [
        "REBOUNDING",
        "RIM_PROTECTION",
        "TEAM_DEFENSE"
      ],
      "weaknesses": [
        "SHOOTING_CONSISTENCY",
        "DECISION_MAKING",
        "ROLE_CLARITY"
      ],
      "swingSkill": "REBOUNDING",
      "mainConcern": "SHOOTING_CONSISTENCY",
      "translationSummary": "Cenac Jr. é uma das grandes e mais arriscadas apostas desse Draft. Um big com medidas físicas impressionantes [2,08m de altura e 2,26m de envergadura], atleticismo claro e um teto animador. Porém, ainda carece de muito desenvolvimento, portanto não há como definir muito bem seu papel em quadra, especialmente no ataque, porque ele ainda faz poucas coisas chamativas pra entendermos o que ele é realmente. Se desenvolver sua criação individual e jogo de costas para cesta, poderá alcançar um nível além como jogador. Mas ele ainda tem muito mais 'se', em seu jogo, e pouquíssimos 'é' atualmente. Típico jogador que faz sentido apostar, a depender de quem esteja disponível, do fim de primeiro round em diante.",
      "notes": [
        "Forward versátil em sistema de defesa de alto nível de Houston",
        "Arremessador de 3 capaz (34.2%) com envergadura 7'2\"",
        "Finalização eficiente no aro e em pick-and-roll",
        "Criação ISO quase inexistente — será um complemento, não um líder",
        "Lance livre baixo (70.8%) sugere limitações de toque no arremesso"
      ]
    },
    "dataConfidence": {
      "stats": "HIGH",
      "scouting": "HIGH",
      "projection": "HIGH",
      "role": "HIGH"
    }
  },
  "meleek-thomas": {
    "playerId": "29",
    "name": "Meleek Thomas",
    "position": "SG/SF",
    "tier": "FIRST_ROUND",
    "archetype": "MOVEMENT_SHOOTER",
    "projectedRole": "ROTATION_GUARD",
    "projection": {
      "floor": "BENCH",
      "ceiling": "ROTATION",
      "realisticOutcome": "ROTATION",
      "projectionScoreOverride": 50
    },
    "manualTraits": {
      "shooting": 88,
      "creation": 36,
      "rimPressure": 62,
      "playmaking": 60,
      "defense": 74,
      "rebounding": 36,
      "rimProtection": 8,
      "athleticism": 51,
      "feel": 61,
      "nbaReadiness": 60,
      "upside": 73
    },
    "scouting": {
      "strengths": [
        "SPOT_UP_SHOOTING",
        "SECONDARY_PLAYMAKING",
        "TEAM_DEFENSE"
      ],
      "weaknesses": [
        "SHOOTING_CONSISTENCY",
        "TURNOVERS",
        "ROLE_CLARITY"
      ],
      "swingSkill": "SPOT_UP_SHOOTING",
      "mainConcern": "SHOOTING_CONSISTENCY",
      "translationSummary": "Thomas é um prospecto com uma combinação incomum: alto volume ofensivo, arremesso de três eficiente e controle de turnovers no nível de elite para a posição e a idade. O problema estrutural está na meia distância — zona que ele frequenta demais para o que converte — e na baixa taxa de criação para companheiros, o que limita sua utilidade como articulador do ataque. Se aprender a reduzir os arremessos de meia distância ineficientes e desenvolver mais autonomia no perímetro, o perfil ofensivo se torna muito mais difícil de defender. A defesa, por ora, não é diferencial.",
      "notes": [
        "Tiro de 3 elite (41.6%) em papel secundário",
        "Defensor ativo (2.8 STL%) com turnovers baixíssimos (8.2 TO%)",
        "Upside de criador baseado em tape de highschool",
        "Produziu como arma secundária — precisa provar impacto como foco",
        "Tamanho médio para wing NBA"
      ]
    },
    "dataConfidence": {
      "stats": "HIGH",
      "scouting": "HIGH",
      "projection": "HIGH",
      "role": "HIGH"
    }
  },
  "milan-momcilovic": {
    "playerId": "30",
    "name": "Milan Momcilovic",
    "position": "PF",
    "tier": "FRINGE",
    "archetype": "STRETCH_BIG",
    "projectedRole": "ROTATION_BIG",
    "risk": "MODERATE",
    "projection": {
      "floor": "BENCH",
      "ceiling": "STARTER",
      "realisticOutcome": "ROTATION",
      "projectionScoreOverride": 58
    },
    "manualTraits": {
      "shooting": 98,
      "creation": 26,
      "rimPressure": 73,
      "playmaking": 26,
      "defense": 34,
      "rebounding": 14,
      "rimProtection": 14,
      "athleticism": 41,
      "feel": 55,
      "nbaReadiness": 76,
      "upside": 64,
      "risk": 54
    },
    "scouting": {
      "strengths": [
        "SPOT_UP_SHOOTING",
        "MOVEMENT_SHOOTING"
      ],
      "weaknesses": [
        "STRENGTH",
        "DEFENSIVE_CONSISTENCY"
      ],
      "swingSkill": "SPOT_UP_SHOOTING",
      "mainConcern": "SHOOTING_CONSISTENCY",
      "translationSummary": "Momcilovic é um prospecto de perfil muito específico: arremessador de elite no catch-and-shoot, com eficiência estatisticamente fora da curva nesta temporada e trajetória de melhora documentada ao longo de três anos. As limitações são igualmente específicas — quase nenhuma criação própria, raramente busca o aro, e histórico defensivo inconsistente com ressalvas sobre o rebote. A pergunta central sobre ele não é se arremessa bem, mas se o aproveitamento excepcional se sustenta quando as defesas da NBA, muito mais organizadas, fecham as rotas de passe e reduzem os looks abertos que Iowa State gerou para ele. A resposta a essa questão determinará inteiramente o seu valor real na liga.",
      "notes": [
        "Especialista de elite: 48.7% de 3, 69.3% TS e 67.2% eFG no DraftBallr",
        "Volume de arremesso altissimo para ala, com 15.1 tentativas de 3 por 100 posses",
        "Baixo turnover e espacamento premium em contexto de Iowa State",
        "Pouca pressao de aro e baixo volume de rebotes ofensivos",
        "Impacto defensivo e criacao propria ainda limitam o teto"
      ]
    },
    "dataConfidence": {
      "stats": "HIGH",
      "scouting": "HIGH",
      "projection": "HIGH",
      "role": "HIGH"
    }
  },
  "ebuka-okorie": {
    "playerId": "32",
    "name": "Ebuka Okorie",
    "position": "SG/SF",
    "tier": "FRINGE",
    "archetype": "SCORING_GUARD",
    "projectedRole": "ROTATION_GUARD",
    "risk": "MODERATE",
    "projection": {
      "floor": "BENCH",
      "ceiling": "STARTER",
      "realisticOutcome": "ROTATION",
      "projectionScoreOverride": 60
    },
    "manualTraits": {
      "shooting": 69,
      "creation": 57,
      "rimPressure": 66,
      "playmaking": 57,
      "defense": 53,
      "rebounding": 39,
      "rimProtection": 14,
      "athleticism": 60,
      "feel": 56,
      "nbaReadiness": 65,
      "upside": 63,
      "risk": 28
    },
    "scouting": {
      "strengths": [
        "PULL_UP_SHOOTING",
        "SELF_CREATION",
        "SECONDARY_PLAYMAKING",
        "RIM_PRESSURE",
        "TEAM_DEFENSE"
      ],
      "weaknesses": [
        "SHOOTING_CONSISTENCY",
        "ROLE_CLARITY",
        "SIZE_LIMITATION"
      ],
      "swingSkill": "PULL_UP_SHOOTING",
      "mainConcern": "SHOOTING_CONSISTENCY",
      "translationSummary": "Okorie liderou a ACC em pontuação na temporada, com 8 jogos com pelo menos 30 pontos — quebrando o recorde de calouros da conferência estabelecido por Marvin Bagley III. É descrito como o separador de drible mais violento e o atacante mais inegável descendo a quadra da classe — um perfil raro de guard com velocidade devastadora aliada a controle de corpo e manipulação de ritmo sofisticados. A ressalva mais consistente entre os scouts é a disposição como criador para os colegas: os instintos de finalizador às vezes suprimem a visão de jogo num grau que precisará evoluir no nível profissional.",
      "notes": [
        "Dribble separator violento — explosão downhill mais rápida da classe",
        "Criador explosivo que força decisões rápidas da defesa",
        "Arremessador capaz (36.7%)",
        "Consistência no controle após a explosão inicial",
        "Precisão no arremesso em altos volumes"
      ]
    },
    "dataConfidence": {
      "stats": "HIGH",
      "scouting": "HIGH",
      "projection": "HIGH",
      "role": "HIGH"
    }
  },
  "isiah-harwell": {
    "playerId": "33",
    "name": "Isiah Harwell",
    "position": "SG",
    "tier": "SLEEPER",
    "archetype": "COMBO_GUARD",
    "projectedRole": "ROTATION_GUARD",
    "projection": {
      "floor": "BENCH",
      "ceiling": "ROTATION",
      "realisticOutcome": "BENCH",
      "projectionScoreOverride": 50
    },
    "manualTraits": {
      "shooting": 71,
      "creation": 47,
      "rimPressure": 63,
      "playmaking": 47,
      "defense": 48,
      "rebounding": 43,
      "rimProtection": 0,
      "athleticism": 48,
      "feel": 50,
      "nbaReadiness": 65,
      "upside": 61
    },
    "scouting": {
      "strengths": [
        "SPOT_UP_SHOOTING",
        "SECONDARY_PLAYMAKING"
      ],
      "weaknesses": [
        "ROLE_CLARITY"
      ],
      "swingSkill": "SPOT_UP_SHOOTING",
      "mainConcern": "ROLE_CLARITY",
      "translationSummary": "Guarda de rotação com valor real. System-dependent mas com habilidades transferíveis.",
      "notes": [
        "Produto de sistema defensivo exigente de Houston",
        "Arremessador de 3 sólido (37.8%)",
        "Dois lados da bola com comprometimento defensivo",
        "Sem papel estelar definido — sempre arma secundária",
        "Criação primária limitada"
      ]
    },
    "dataConfidence": {
      "stats": "MEDIUM",
      "scouting": "HIGH",
      "projection": "MEDIUM",
      "role": "HIGH"
    }
  },
  "tyler-tanner": {
    "playerId": "34",
    "name": "Tyler Tanner",
    "position": "PG",
    "tier": "SLEEPER",
    "archetype": "PRIMARY_CREATOR",
    "projectedRole": "ROTATION_GUARD",
    "risk": "HIGH",
    "projection": {
      "floor": "TWO_WAY",
      "ceiling": "ROTATION",
      "realisticOutcome": "BENCH",
      "projectionScoreOverride": 50
    },
    "manualTraits": {
      "shooting": 74,
      "creation": 74,
      "rimPressure": 70,
      "playmaking": 74,
      "defense": 36,
      "rebounding": 60,
      "rimProtection": 15,
      "athleticism": 63,
      "feel": 75,
      "nbaReadiness": 74,
      "upside": 60,
      "risk": 76
    },
    "scouting": {
      "strengths": [
        "SPOT_UP_SHOOTING",
        "SELF_CREATION",
        "SECONDARY_PLAYMAKING",
        "RIM_PRESSURE",
        "TEAM_DEFENSE"
      ],
      "weaknesses": [
        "TURNOVERS",
        "ROLE_CLARITY",
        "SIZE_LIMITATION"
      ],
      "swingSkill": "SPOT_UP_SHOOTING",
      "mainConcern": "TURNOVERS",
      "translationSummary": "Tanner é um prospecto de números excepcionais em quase todas as categorias relevantes — eficiência, criação, controle de turnovers, roubos, impacto geral — produzidos com carga ofensiva real e evolução clara entre as temporadas. O BPM é o mais alto entre os perfis desta série. A única coluna de fraquezas listada no perfil é inteiramente composta por medidas físicas: altura, envergadura, peso e rebote ofensivo. É um caso raro em que o corpo e os números apontam em direções opostas, e a avaliação final depende quase inteiramente de quanto uma franquia da NBA está disposta a apostar que a competência compensa a estrutura.",
      "notes": [
        "All-SEC First Team — grande avanço no segundo ano",
        "Playmaking e scoring balanceados (16/5 PTS/AST)",
        "Arremessador de 3 elite (38.7%)",
        "Tamanho limítrofe (6'3\")",
        "Defesa no ponto de ataque questiona a retenção na NBA"
      ]
    },
    "dataConfidence": {
      "stats": "HIGH",
      "scouting": "HIGH",
      "projection": "HIGH",
      "role": "HIGH"
    }
  },
  "henri-veesaar": {
    "playerId": "35",
    "name": "Henri Veesaar",
    "position": "PF/C",
    "tier": "FRINGE",
    "archetype": "RIM_PROTECTOR",
    "projectedRole": "ROTATION_BIG",
    "projection": {
      "floor": "BENCH",
      "ceiling": "STARTER",
      "realisticOutcome": "ROTATION",
      "projectionScoreOverride": 58
    },
    "manualTraits": {
      "shooting": 88,
      "creation": 36,
      "rimPressure": 56,
      "playmaking": 36,
      "defense": 36,
      "rebounding": 74,
      "rimProtection": 53,
      "athleticism": 44,
      "feel": 55,
      "nbaReadiness": 88,
      "upside": 59
    },
    "scouting": {
      "strengths": [
        "REBOUNDING",
        "RIM_PROTECTION",
        "TEAM_DEFENSE"
      ],
      "weaknesses": [
        "SHOOTING_CONSISTENCY",
        "AGE_UPSIDE"
      ],
      "swingSkill": "REBOUNDING",
      "mainConcern": "SHOOTING_CONSISTENCY",
      "translationSummary": "Veesaar é um pivô de 7 pés com a rara combinação de arremesso de perímetro e presença ofensiva convencional: converte 75,9% das tentativas no aro e aparece entre os líderes nacionais em enterradas, enquanto também acerta a bola de três em volume crescente. O senso de passe é um ativo real — ele encontra cortadores de posições estacionárias, opera no short-roll e executa sets de high-low com precisão, o que o torna mais do que uma âncora estática. A principal fragilidade está na defesa em espaço: sua mobilidade horizontal limitada o torna um alvo em situações de switch, e o desenvolvimento como protetor de aro ainda deixa a desejar, exigindo que seja colocado ao lado de um ala mais atlético para cobrir seu raio de atuação.",
      "notes": [
        "Dimensões elite para rim protector (7'1\" + 7'4\" wingspan)",
        "Eficiência alta no aro (54.2% FG)",
        "Reboteiro consistente em Big ACC",
        "Tiro de 3 limitado (29.4%) — espacing mínimo",
        "Jogo mais velho (22) sem explosividade de elite"
      ]
    },
    "dataConfidence": {
      "stats": "HIGH",
      "scouting": "HIGH",
      "projection": "HIGH",
      "role": "HIGH"
    }
  },
  "dailyn-swain": {
    "playerId": "37",
    "name": "Dailyn Swain",
    "position": "SF/PF",
    "tier": "FIRST_ROUND",
    "archetype": "DEFENSIVE_WING",
    "projectedRole": "ROTATION_WING",
    "projection": {
      "floor": "BENCH",
      "ceiling": "STARTER",
      "realisticOutcome": "ROTATION",
      "projectionScoreOverride": 60
    },
    "manualTraits": {
      "shooting": 50,
      "creation": 74,
      "rimPressure": 65,
      "playmaking": 48,
      "defense": 74,
      "rebounding": 74,
      "rimProtection": 14,
      "athleticism": 55,
      "feel": 58,
      "nbaReadiness": 88,
      "upside": 58
    },
    "scouting": {
      "strengths": [
        "RIM_PRESSURE",
        "REBOUNDING",
        "TEAM_DEFENSE",
        "FEEL"
      ],
      "weaknesses": [
        "AGE_UPSIDE",
        "SHOOTING_CONSISTENCY"
      ],
      "swingSkill": "RIM_PRESSURE",
      "mainConcern": "AGE_UPSIDE",
      "translationSummary": "Swain é um ala criador de 6'7\" com handle impressionante para o seu porte, usando uma combinação de velocidade, fluidez e atletismo para superar alas e forwards maiores em situações de isolamento. Seu ataque é construído sobre pressão de bola constante ao aro, finalizações com toque apurado e capacidade de atrair faltas — gerando 5,6 tentativas de lance livre por jogo com aproveitamento de 81,5%. A visão de jogo é um atributo real: ele encontra cortadores e pivôs em rolamento com leituras precisas, e a pressão que cria ofensivamente colapsa defesas e abre espaço para os colegas.",
      "notes": [
        "All-SEC Second Team como transfer — transição bem-sucedida",
        "Versatilidade de forward com spacing (36.4% de 3)",
        "Produção regular ao longo de toda temporada",
        "Maior pick (22 anos)",
        "Criação ISO limitada"
      ]
    },
    "dataConfidence": {
      "stats": "HIGH",
      "scouting": "HIGH",
      "projection": "HIGH",
      "role": "HIGH"
    }
  },
  "juke-harris": {
    "playerId": "42",
    "name": "Juke Harris",
    "position": "SF/PF",
    "tier": "SLEEPER",
    "archetype": "TWO_WAY_WING",
    "projectedRole": "ROTATION_WING",
    "risk": "HIGH",
    "projection": {
      "floor": "TWO_WAY",
      "ceiling": "ROTATION",
      "realisticOutcome": "BENCH",
      "projectionScoreOverride": 45
    },
    "manualTraits": {
      "shooting": 60,
      "creation": 36,
      "rimPressure": 66,
      "playmaking": 45,
      "defense": 36,
      "rebounding": 74,
      "rimProtection": 10,
      "athleticism": 57,
      "feel": 50,
      "nbaReadiness": 60,
      "upside": 56,
      "risk": 76
    },
    "scouting": {
      "strengths": [
        "SELF_CREATION",
        "RIM_PRESSURE",
        "REBOUNDING",
        "TEAM_DEFENSE"
      ],
      "weaknesses": [
        "DEFENSIVE_CONSISTENCY"
      ],
      "swingSkill": "SELF_CREATION",
      "mainConcern": "DEFENSIVE_CONSISTENCY",
      "translationSummary": "Harris é um prospecto com altura relevante, agressividade real na busca do contato e salto de produção expressivo no segundo ano. Os problemas são estruturais em dois pontos: conversão abaixo da média na borda e nos três pontos, que são as zonas onde mais tenta arremessar, e impacto defensivo negativo que se agravou com o aumento de minutos. O perfil ofensivo depende excessivamente dos lances livres para ser eficiente — o que é uma estratégia válida, mas frágil em níveis mais altos de jogo, onde as defesas ajustam e as arbitragens são menos generosas. O desenvolvimento da finalização limpa e da consistência no perímetro determinará se ele se torna jogador de rotação ou permanece como contribuinte pontual.",
      "notes": [
        "Produção alta em volume com tamanho wing elite (6'8\" + 7'0\")",
        "Reboteiro ativo e competitivo no pós",
        "Potencial two-way com desenvolvimento",
        "ACC program de menor calibre — menor exposição",
        "Tiro de 3 mediano (34.9%)"
      ]
    },
    "dataConfidence": {
      "stats": "HIGH",
      "scouting": "HIGH",
      "projection": "HIGH",
      "role": "HIGH"
    }
  },
  "matthew-able": {
    "playerId": "45",
    "name": "Matthew Able",
    "position": "SF",
    "tier": "SLEEPER",
    "archetype": "TWO_WAY_WING",
    "projectedRole": "ROTATION_WING",
    "risk": "HIGH",
    "projection": {
      "floor": "TWO_WAY",
      "ceiling": "ROTATION",
      "realisticOutcome": "BENCH",
      "projectionScoreOverride": 45
    },
    "manualTraits": {
      "shooting": 60,
      "creation": 36,
      "rimPressure": 64,
      "playmaking": 36,
      "defense": 36,
      "rebounding": 36,
      "rimProtection": 27,
      "athleticism": 59,
      "feel": 41,
      "nbaReadiness": 36,
      "upside": 55,
      "risk": 76
    },
    "scouting": {
      "strengths": [
        "RIM_PRESSURE",
        "TEAM_DEFENSE"
      ],
      "weaknesses": [
        "DECISION_MAKING"
      ],
      "swingSkill": "RIM_PRESSURE",
      "mainConcern": "DECISION_MAKING",
      "translationSummary": "Freshman freshman de NC State com perfil de wing moderno. Potencial de pick de segundo turno com valor real.",
      "notes": [
        "Wing com tiro de 3 (36.8%) e tamanho para defender múltiplas posições",
        "Produtor consistente no ACC",
        "Comprimento e mobilidade two-way",
        "Program menor em termos de exposição nacional",
        "Criação ISO limitada"
      ]
    },
    "dataConfidence": {
      "stats": "HIGH",
      "scouting": "HIGH",
      "projection": "HIGH",
      "role": "HIGH"
    }
  },
  "flory-bidunga": {
    "playerId": "46",
    "name": "Flory Bidunga",
    "position": "C",
    "tier": "SLEEPER",
    "archetype": "RIM_PROTECTOR",
    "projectedRole": "ROTATION_BIG",
    "risk": "HIGH",
    "projection": {
      "floor": "TWO_WAY",
      "ceiling": "STARTER",
      "realisticOutcome": "ROTATION",
      "projectionScoreOverride": 55
    },
    "manualTraits": {
      "shooting": 36,
      "creation": 36,
      "rimPressure": 49,
      "playmaking": 25,
      "defense": 88,
      "rebounding": 74,
      "rimProtection": 100,
      "athleticism": 51,
      "feel": 50,
      "nbaReadiness": 88,
      "upside": 54,
      "risk": 76
    },
    "scouting": {
      "strengths": [
        "REBOUNDING",
        "RIM_PROTECTION",
        "TEAM_DEFENSE"
      ],
      "weaknesses": [
        "SHOOTING_CONSISTENCY",
        "LOW_VOLUME_SHOOTING",
        "DECISION_MAKING",
        "DEFENSIVE_CONSISTENCY"
      ],
      "swingSkill": "REBOUNDING",
      "mainConcern": "SHOOTING_CONSISTENCY",
      "translationSummary": "Bidunga é um prospecto com impacto defensivo de elite e altíssima eficiência na finalização de jogadas, evidenciando uma transição sólida de minutagem para o segundo ano. Os problemas estruturais moram nas dimensões físicas: a altura e o peso abaixo do padrão para a posição de pivô prejudicam severamente sua capacidade de coletar rebotes e de cavar lances livres através de contato no garrafão. O perfil ofensivo é unidimensional, restrito à finalização na borda sem qualquer espaçamento de perímetro. A sua viabilidade na NBA passará por comprovar que a excelência em proteger o aro (RAPM 99) e finalizar em movimento se sustenta contra oponentes mais altos e pesados, compensando suas limitações de tamanho e de rebote.",
      "notes": [
        "Eficiência no aro de elite (58.3% FG)",
        "Rebotetador de alta porcentagem em Big 12",
        "Dimensões autênticas para centro moderno",
        "Sem extensão de arremesso alguma",
        "Lance livre baixo (62.5%)"
      ]
    },
    "dataConfidence": {
      "stats": "HIGH",
      "scouting": "HIGH",
      "projection": "HIGH",
      "role": "HIGH"
    }
  },
  "morez-johnson": {
    "playerId": "49",
    "name": "Morez Johnson Jr.",
    "position": "PF/C",
    "tier": "FIRST_ROUND",
    "archetype": "ENERGY_BIG",
    "projectedRole": "ROTATION_BIG",
    "projection": {
      "floor": "BENCH",
      "ceiling": "STARTER",
      "realisticOutcome": "ROTATION",
      "projectionScoreOverride": 53
    },
    "manualTraits": {
      "shooting": 60,
      "creation": 36,
      "rimPressure": 51,
      "playmaking": 28,
      "defense": 74,
      "rebounding": 60,
      "rimProtection": 67,
      "athleticism": 45,
      "feel": 51,
      "nbaReadiness": 88,
      "upside": 53
    },
    "scouting": {
      "strengths": [
        "REBOUNDING",
        "RIM_PROTECTION",
        "TEAM_DEFENSE",
        "FEEL"
      ],
      "weaknesses": [
        "SHOOTING_CONSISTENCY",
        "LOW_VOLUME_SHOOTING",
        "DECISION_MAKING",
        "ROLE_CLARITY"
      ],
      "swingSkill": "REBOUNDING",
      "mainConcern": "SHOOTING_CONSISTENCY",
      "translationSummary": "Johnson tem ferramentas físicas de nível NBA — força de ancoragem, envergadura estimada em 7'2\" e atletismo explosivo — que se traduzem diretamente em defesa versátil, rebote de alto volume e finalização eficiente dentro do garrafão. Faz leituras rápidas, sabe quem é como jogador e produz jogadas vencedoras nos dois lados de forma incessante, o que coloca seu impacto em patamar diferente do que os números brutos sugerem. A principal limitação está na tomada de decisão como passador no short-roll e na ausência de jogo ofensivo além do garrafão — um arremesso de perímetro confiável ainda não está consolidado, o que pode restringir os cenários em que atua como opção de alto volume.",
      "notes": [
        "Big man de campeonato do Michigan",
        "Eficiência de finishing alta (55.4%)",
        "Reboteiro com comprimento",
        "Sem arremesso externo",
        "Lance livre baixo limita papel em posse"
      ]
    },
    "dataConfidence": {
      "stats": "HIGH",
      "scouting": "HIGH",
      "projection": "HIGH",
      "role": "HIGH"
    }
  },
  "elliot-cadeau": {
    "playerId": "57",
    "name": "Elliot Cadeau",
    "position": "PG",
    "tier": "SLEEPER",
    "archetype": "PRIMARY_CREATOR",
    "projectedRole": "ROTATION_GUARD",
    "risk": "HIGH",
    "projection": {
      "floor": "BENCH",
      "ceiling": "ROTATION",
      "realisticOutcome": "ROTATION",
      "projectionScoreOverride": 54
    },
    "manualTraits": {
      "shooting": 74,
      "creation": 74,
      "rimPressure": 51,
      "playmaking": 81,
      "defense": 36,
      "rebounding": 36,
      "rimProtection": 0,
      "athleticism": 57,
      "feel": 77,
      "nbaReadiness": 60,
      "upside": 51,
      "risk": 76
    },
    "scouting": {
      "strengths": [
        "SPOT_UP_SHOOTING",
        "SECONDARY_PLAYMAKING"
      ],
      "weaknesses": [
        "SHOOTING_CONSISTENCY",
        "STRENGTH"
      ],
      "swingSkill": "SPOT_UP_SHOOTING",
      "mainConcern": "SHOOTING_CONSISTENCY",
      "translationSummary": "Cadeau entra na board como um armador de mesa, com valor ligado a ritmo, passe e organizacao. A melhora no arremesso recoloca seu perfil no radar, mas a traducao NBA ainda depende de provar que consegue punir defesas fisicas sem perder eficiencia.",
      "notes": [
        "Playmaking funcional: 5.9 assistencias com AST/TO de 2.44.",
        "Melhora real como arremessador de volume: 37.6% de tres em 4.3 tentativas.",
        "Controla ritmo e organiza posses no half court.",
        "Tamanho e finalizacao no aro ainda limitam a margem NBA.",
        "Pontuacao propria depende mais de contexto do que de vantagem fisica."
      ]
    },
    "dataConfidence": {
      "stats": "HIGH",
      "scouting": "HIGH",
      "projection": "HIGH",
      "role": "HIGH"
    }
  },
  "jeremy-fears": {
    "playerId": "58",
    "name": "Jeremy Fears Jr.",
    "position": "PG",
    "tier": "SLEEPER",
    "archetype": "PRIMARY_CREATOR",
    "projectedRole": "ROTATION_GUARD",
    "risk": "MODERATE",
    "projection": {
      "floor": "BENCH",
      "ceiling": "STARTER",
      "realisticOutcome": "ROTATION",
      "projectionScoreOverride": 59
    },
    "manualTraits": {
      "shooting": 36,
      "creation": 88,
      "rimPressure": 69,
      "playmaking": 90,
      "defense": 60,
      "rebounding": 36,
      "rimProtection": 0,
      "athleticism": 61,
      "feel": 81,
      "nbaReadiness": 74,
      "upside": 50,
      "risk": 54
    },
    "scouting": {
      "strengths": [
        "SECONDARY_PLAYMAKING",
        "RIM_PRESSURE",
        "FEEL"
      ],
      "weaknesses": [
        "SHOOTING_CONSISTENCY",
        "STRENGTH",
        "ROLE_CLARITY"
      ],
      "swingSkill": "SECONDARY_PLAYMAKING",
      "mainConcern": "SHOOTING_CONSISTENCY",
      "translationSummary": "Fears volta ao radar como um armador de alto volume de criacao, com passe, controle de erro e pressao de lance livre como base do perfil. O swing esta no arremesso: se o jumper for respeitado, o valor de rotacao cresce rapidamente.",
      "notes": [
        "Criacao para terceiros de elite: 9.4 APG e AST/TO de 3.86.",
        "Pressiona a linha de lance livre e converte 88.5%.",
        "Perfil de lead guard com leitura e controle de jogo.",
        "Arremesso de tres ainda precisa estabilizar para abrir teto NBA.",
        "Tamanho cria margem menor em matchups fisicos."
      ]
    },
    "dataConfidence": {
      "stats": "HIGH",
      "scouting": "HIGH",
      "projection": "HIGH",
      "role": "HIGH"
    }
  },
  "billy-richmond": {
    "playerId": "59",
    "name": "Billy Richmond III",
    "position": "SG/SF",
    "tier": "SLEEPER",
    "archetype": "COMBO_GUARD",
    "projectedRole": "ROTATION_GUARD",
    "risk": "HIGH",
    "projection": {
      "floor": "BENCH",
      "ceiling": "ROTATION",
      "realisticOutcome": "ROTATION",
      "projectionScoreOverride": 55
    },
    "manualTraits": {
      "shooting": 36,
      "creation": 60,
      "rimPressure": 55,
      "playmaking": 54,
      "defense": 60,
      "rebounding": 60,
      "rimProtection": 0,
      "athleticism": 71,
      "feel": 58,
      "nbaReadiness": 74,
      "upside": 49,
      "risk": 76
    },
    "scouting": {
      "weaknesses": [
        "SHOOTING_CONSISTENCY",
        "LOW_VOLUME_SHOOTING"
      ],
      "mainConcern": "SHOOTING_CONSISTENCY",
      "translationSummary": "Richmond e um wing atletico de energia, com boa eficiencia dentro do arco e contribuicao secundaria em rebote, passe e defesa. Para virar peca de rotacao NBA, precisa transformar o arremesso de tres de ponto fraco em ferramenta ao menos funcional.",
      "notes": [
        "Finalizacao eficiente para guard/wing: 56.3% FG.",
        "Contribui em multiplas areas sem exigir alto uso.",
        "Tamanho e atletismo sustentam traducao defensiva situacional.",
        "Arremesso de tres ainda nao abre spacing confiavel.",
        "Precisa transformar flashes de criacao em vantagem repetivel."
      ]
    },
    "dataConfidence": {
      "stats": "HIGH",
      "scouting": "HIGH",
      "projection": "HIGH",
      "role": "HIGH"
    }
  },
  "andrej-stojakovic": {
    "playerId": "60",
    "name": "Andrej Stojakovic",
    "position": "SG/SF",
    "tier": "SLEEPER",
    "archetype": "COMBO_GUARD",
    "projectedRole": "ROTATION_GUARD",
    "risk": "HIGH",
    "projection": {
      "floor": "BENCH",
      "ceiling": "STARTER",
      "realisticOutcome": "ROTATION",
      "projectionScoreOverride": 55
    },
    "manualTraits": {
      "shooting": 36,
      "creation": 60,
      "rimPressure": 62,
      "playmaking": 38,
      "defense": 36,
      "rebounding": 60,
      "rimProtection": 0,
      "athleticism": 64,
      "feel": 50,
      "nbaReadiness": 60,
      "upside": 48,
      "risk": 76
    },
    "scouting": {
      "weaknesses": [
        "SHOOTING_CONSISTENCY",
        "DECISION_MAKING",
        "STRENGTH"
      ],
      "mainConcern": "SHOOTING_CONSISTENCY",
      "translationSummary": "Stojakovic e um scorer de wing que ganhou tracao como peca ofensiva em Illinois, especialmente atacando o aro e punindo vantagens. A avaliacao depende quase toda do jumper: se o arremesso voltar ao nivel esperado, o pacote fisico-ofensivo ganha valor de segunda rodada.",
      "notes": [
        "Pontua com eficiencia de dois pontos e pressiona a defesa atacando closeouts.",
        "Tamanho de wing NBA com pedigree de shotmaking.",
        "Produziu 13.5 PPG em papel de rotacao forte.",
        "3P% de 24.4 cria uma pergunta central de traducao.",
        "AST/TO baixo limita leitura como criador secundario."
      ]
    },
    "dataConfidence": {
      "stats": "HIGH",
      "scouting": "HIGH",
      "projection": "HIGH",
      "role": "HIGH"
    }
  },
  "sergio-de-larrea": {
    "playerId": "61",
    "name": "Sergio de Larrea",
    "position": "PG/SG",
    "tier": "SLEEPER",
    "archetype": "MOVEMENT_SHOOTER",
    "projectedRole": "ROTATION_GUARD",
    "risk": "MODERATE",
    "projection": {
      "floor": "BENCH",
      "ceiling": "STARTER",
      "realisticOutcome": "ROTATION",
      "projectionScoreOverride": 58
    },
    "manualTraits": {
      "shooting": 74,
      "creation": 74,
      "rimPressure": 45,
      "playmaking": 70,
      "defense": 60,
      "rebounding": 36,
      "rimProtection": 0,
      "athleticism": 57,
      "feel": 72,
      "nbaReadiness": 74,
      "upside": 46,
      "risk": 54
    },
    "scouting": {
      "strengths": [
        "SPOT_UP_SHOOTING",
        "SECONDARY_PLAYMAKING",
        "FEEL"
      ],
      "weaknesses": [
        "SHOOTING_CONSISTENCY",
        "DECISION_MAKING",
        "STRENGTH"
      ],
      "swingSkill": "SPOT_UP_SHOOTING",
      "mainConcern": "SHOOTING_CONSISTENCY",
      "translationSummary": "De Larrea e um guard internacional de tamanho, passe e arremesso, com perfil de draft-and-stash ou desenvolvimento paciente. O valor esta na combinacao de 6'6\", tomada de decisao e eficiencia como jogador jovem em ambiente profissional.",
      "notes": [
        "Tamanho raro para combo guard: 6'6\" com leitura de passe.",
        "41.3% de tres em contexto profissional europeu.",
        "TS% de 60.5 sustenta eficiencia mesmo em minutos curtos.",
        "Baixo volume de minutos exige cuidado na traducao estatistica.",
        "Precisa ganhar forca e acelerar reads contra pressao NBA."
      ]
    },
    "dataConfidence": {
      "stats": "HIGH",
      "scouting": "HIGH",
      "projection": "HIGH",
      "role": "HIGH"
    }
  },
  "alexandros-samodurov": {
    "playerId": "62",
    "name": "Alexandros Samodurov",
    "position": "PF/C",
    "tier": "SLEEPER",
    "archetype": "VERSATILE_FORWARD",
    "projectedRole": "ROTATION_BIG",
    "risk": "HIGH",
    "projection": {
      "floor": "TWO_WAY",
      "ceiling": "ROTATION",
      "realisticOutcome": "BENCH",
      "projectionScoreOverride": 49
    },
    "manualTraits": {
      "shooting": 36,
      "creation": 36,
      "rimPressure": 34,
      "playmaking": 41,
      "defense": 60,
      "rebounding": 60,
      "rimProtection": 0,
      "athleticism": 58,
      "feel": 57,
      "nbaReadiness": 60,
      "upside": 45,
      "risk": 76
    },
    "scouting": {
      "strengths": [
        "FEEL"
      ],
      "weaknesses": [
        "SHOOTING_CONSISTENCY",
        "STRENGTH",
        "DEFENSIVE_CONSISTENCY",
        "ROLE_CLARITY"
      ],
      "swingSkill": "FEEL",
      "mainConcern": "SHOOTING_CONSISTENCY",
      "translationSummary": "Samodurov entra como aposta de desenvolvimento internacional: tamanho, toque e experiencia profissional chamam atencao, mas o volume atual ainda e pequeno demais para leitura definitiva. O caminho NBA passa por ganhar forca, consistencia no jumper e papel defensivo claro.",
      "notes": [
        "Tamanho legitimo de frontcourt com mobilidade para PF/C.",
        "Finaliza bem em volume baixo e tem flashes de spacing.",
        "Experiencia em estrutura profissional de alto nivel.",
        "Baixo volume de minutos reduz confianca na avaliacao estatistica.",
        "Arremesso externo ainda nao e ferramenta confiavel."
      ]
    },
    "dataConfidence": {
      "stats": "HIGH",
      "scouting": "HIGH",
      "projection": "HIGH",
      "role": "HIGH"
    }
  },
  "luigi-suigo": {
    "playerId": "63",
    "name": "Luigi Suigo",
    "position": "C",
    "tier": "SLEEPER",
    "archetype": "ROLL_BIG",
    "projectedRole": "ROTATION_BIG",
    "risk": "HIGH",
    "projection": {
      "floor": "TWO_WAY",
      "ceiling": "STARTER",
      "realisticOutcome": "ROTATION",
      "projectionScoreOverride": 56
    },
    "manualTraits": {
      "shooting": 36,
      "creation": 36,
      "rimPressure": 47,
      "playmaking": 38,
      "defense": 74,
      "rebounding": 74,
      "rimProtection": 0,
      "athleticism": 54,
      "feel": 54,
      "nbaReadiness": 60,
      "upside": 44,
      "risk": 76
    },
    "scouting": {
      "weaknesses": [
        "SHOOTING_CONSISTENCY",
        "LOW_VOLUME_SHOOTING",
        "DECISION_MAKING",
        "STRENGTH",
        "DEFENSIVE_CONSISTENCY"
      ],
      "mainConcern": "SHOOTING_CONSISTENCY",
      "translationSummary": "Suigo é uma aposta internacional de tamanho extremo, com 7'3 (2,20m), e experiência profissional vindo do Mega Basket. O seu jogo nos chama muita atenção pela combinação de finalização, rebote e algum toque refinado próximo ao aro. Também com certa leitura de jogo, capacidade de correr quadra com fluidez - mesmo com seu tamanho -, e chance de ser uma bela arma trabalhando em pick-and-roll. Mas a tradução e evolução do seu jogo também dependerá do ganho de força e paciência para uma transição de saída do jogo europeu. É um legítimo projeto, mas para nós, um dos ótimos projetos de desenvolvimento dessa classe.",
      "notes": [
        "Medidas raras: 7'3\" com presenca real no garrafão.",
        "Produz 8.1 PPG e 5.3 RPG em Mega Basket aos 19 anos.",
        "Mostra toque de lance livre e flashes de espaçamento para o tamanho.",
        "Mobilidade e velocidade defensiva ainda precisam ser testadas em nível NBA.",
        "Arremesso de três existe, mas ainda não é confiável."
      ]
    },
    "dataConfidence": {
      "stats": "HIGH",
      "scouting": "HIGH",
      "projection": "HIGH",
      "role": "HIGH"
    }
  }
} satisfies Record<string, ProspectDraftIntelligenceOverride>;

export function normalizeProspectIntelligenceKey(value: string): string {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\b(jr|sr|iii|ii|iv)\b/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const clampNumber = (value: unknown, min = 0, max = 100): number | undefined => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return undefined;
  return Math.min(max, Math.max(min, value));
};

function clampManualTraits(traits?: ProspectManualTraits): ProspectManualTraits | undefined {
  if (!traits) return undefined;
  return TRAIT_KEYS.reduce<ProspectManualTraits>((acc, key) => {
    const value = clampNumber(traits[key]);
    if (typeof value === 'number') acc[key] = value;
    return acc;
  }, {});
}

export function getProspectDraftIntelligence(playerIdOrName: string): ProspectDraftIntelligenceOverride | undefined {
  const direct = prospectDraftIntelligence[playerIdOrName];
  if (direct) return direct;
  const normalized = normalizeProspectIntelligenceKey(playerIdOrName);
  if (prospectDraftIntelligence[normalized]) return prospectDraftIntelligence[normalized];
  return Object.values(prospectDraftIntelligence).find(entry =>
    normalizeProspectIntelligenceKey(entry.playerId || '') === normalized ||
    normalizeProspectIntelligenceKey(entry.name) === normalized
  );
}

export function getProspectManualTraits(playerIdOrName: string): ProspectManualTraits | undefined {
  return clampManualTraits(getProspectDraftIntelligence(playerIdOrName)?.manualTraits);
}

export function hasProspectManualOverride(playerIdOrName: string): boolean {
  return Boolean(getProspectDraftIntelligence(playerIdOrName));
}

export function getProspectManualFieldsUsed(override?: ProspectDraftIntelligenceOverride): string[] {
  if (!override) return [];
  return [
    override.position !== undefined ? 'position' : '',
    override.tier !== undefined ? 'tier' : '',
    override.archetype !== undefined ? 'archetype' : '',
    override.projectedRole !== undefined ? 'projectedRole' : '',
    override.risk !== undefined ? 'risk' : '',
    override.projection !== undefined ? 'projection' : '',
    override.manualTraits !== undefined ? 'manualTraits' : '',
    override.scouting !== undefined ? 'scouting' : '',
    override.dataConfidence !== undefined ? 'dataConfidence' : '',
  ].filter(Boolean);
}

export function getResolvedProspectIntelligence(prospect: Record<string, any>): ResolvedProspectIntelligence {
  const override = getProspectDraftIntelligence(String(prospect?.id || prospect?.slug || prospect?.name || ''));
  if (!override) {
    return {
      hasManualOverride: false,
      manualFieldsUsed: [],
      fallbackFieldsUsed: ['originalProspect', 'heuristics'],
    };
  }

  const traits = clampManualTraits(override.manualTraits);
  const projectionScoreOverride = clampNumber(override.projection?.projectionScoreOverride, 35, 100);
  const projection = override.projection
    ? { ...override.projection, projectionScoreOverride }
    : undefined;

  return {
    hasManualOverride: true,
    manualOverrideKey: normalizeProspectIntelligenceKey(override.playerId || override.name),
    manualFieldsUsed: getProspectManualFieldsUsed(override),
    fallbackFieldsUsed: ['originalProspect', 'heuristics'],
    position: override.position,
    tier: override.tier,
    archetype: override.archetype,
    projectedRole: override.projectedRole,
    risk: override.risk,
    projection,
    manualTraits: traits,
    scouting: override.scouting,
    dataConfidence: override.dataConfidence,
  };
}

export function mergeProspectWithManualIntelligence<T extends Record<string, any>>(prospect: T): T & { resolvedIntelligence: ResolvedProspectIntelligence } {
  const resolvedIntelligence = getResolvedProspectIntelligence(prospect);
  if (!resolvedIntelligence.hasManualOverride) {
    return {
      ...prospect,
      resolvedIntelligence,
    };
  }

  const override = getProspectDraftIntelligence(String(prospect?.id || prospect?.slug || prospect?.name || ''));
  const traits = resolvedIntelligence.manualTraits;
  const manualScouting = resolvedIntelligence.scouting;
  return {
    ...prospect,
    position: resolvedIntelligence.position ?? prospect.position,
    tier: resolvedIntelligence.tier ?? prospect.tier,
    archetype: resolvedIntelligence.archetype ?? prospect.archetype,
    projectedRole: resolvedIntelligence.projectedRole ?? prospect.projectedRole,
    risk: resolvedIntelligence.risk ?? prospect.risk,
    resolvedIntelligence,
    draftIntelligence: {
      ...(prospect.draftIntelligence || {}),
      ...override,
      manualTraits: traits ?? override?.manualTraits,
      projection: resolvedIntelligence.projection,
    },
    scouting: {
      ...(prospect.scouting || {}),
      translationSummary: manualScouting?.translationSummary ?? prospect.scouting?.translationSummary,
      archetype: resolvedIntelligence.archetype ?? prospect.scouting?.archetype,
      projectedRole: resolvedIntelligence.projectedRole ?? prospect.scouting?.projectedRole,
      risk: resolvedIntelligence.risk ?? prospect.scouting?.risk,
      manualTags: manualScouting ?? prospect.scouting?.manualTags,
    },
  };
}

export function validateProspectDraftIntelligence(): ProspectDraftIntelligenceValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  const seenNames = new Map<string, string>();
  const validateOption = (entryKey: string, field: string, value: unknown, options: readonly string[]) => {
    if (value !== undefined && !isAllowedProspectOption(options, value)) errors.push(entryKey + '.' + field + ' has invalid value: ' + String(value));
  };
  for (const [entryKey, entry] of Object.entries(prospectDraftIntelligence)) {
    if (!entry.name?.trim()) errors.push(entryKey + ' is missing required name');
    const normalizedName = normalizeProspectIntelligenceKey(entry.name || '');
    const previousKey = seenNames.get(normalizedName);
    if (normalizedName && previousKey) errors.push('Duplicate prospect intelligence name: ' + entry.name + ' in ' + previousKey + ' and ' + entryKey);
    if (normalizedName) seenNames.set(normalizedName, entryKey);
    validateOption(entryKey, 'position', entry.position, PROSPECT_POSITIONS);
    validateOption(entryKey, 'tier', entry.tier, PROSPECT_TIERS);
    validateOption(entryKey, 'risk', entry.risk, PROSPECT_RISKS);
    validateOption(entryKey, 'archetype', entry.archetype, PROSPECT_ARCHETYPES);
    validateOption(entryKey, 'projectedRole', entry.projectedRole, PROSPECT_PROJECTED_ROLES);
    validateOption(entryKey, 'projection.floor', entry.projection?.floor, PROSPECT_FLOORS);
    validateOption(entryKey, 'projection.ceiling', entry.projection?.ceiling, PROSPECT_OUTCOME_TIERS);
    validateOption(entryKey, 'projection.realisticOutcome', entry.projection?.realisticOutcome, PROSPECT_OUTCOME_TIERS);
    const projectionScore = entry.projection?.projectionScoreOverride;
    if (projectionScore !== undefined && clampNumber(projectionScore, 35, 100) !== projectionScore) errors.push(entryKey + '.projection.projectionScoreOverride must be between 35 and 100');
    for (const key of TRAIT_KEYS) {
      const value = entry.manualTraits?.[key];
      if (value !== undefined && clampNumber(value) !== value) errors.push(entryKey + '.manualTraits.' + key + ' must be between 0 and 100');
    }
    entry.scouting?.strengths?.forEach(value => validateOption(entryKey, 'scouting.strengths', value, PROSPECT_SKILL_TAGS));
    entry.scouting?.weaknesses?.forEach(value => validateOption(entryKey, 'scouting.weaknesses', value, PROSPECT_WEAKNESS_TAGS));
    validateOption(entryKey, 'scouting.swingSkill', entry.scouting?.swingSkill, PROSPECT_SKILL_TAGS);
    validateOption(entryKey, 'scouting.mainConcern', entry.scouting?.mainConcern, PROSPECT_WEAKNESS_TAGS);
    validateOption(entryKey, 'dataConfidence.stats', entry.dataConfidence?.stats, PROSPECT_CONFIDENCE_LEVELS);
    validateOption(entryKey, 'dataConfidence.scouting', entry.dataConfidence?.scouting, PROSPECT_CONFIDENCE_LEVELS);
    validateOption(entryKey, 'dataConfidence.projection', entry.dataConfidence?.projection, PROSPECT_CONFIDENCE_LEVELS);
    validateOption(entryKey, 'dataConfidence.role', entry.dataConfidence?.role, PROSPECT_CONFIDENCE_LEVELS);
  }
  return { valid: errors.length === 0, errors, warnings };
}
