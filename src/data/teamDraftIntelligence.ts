// ============================================================
// NBA Team Draft Intelligence
// ============================================================
// Structured editorial database generated from the filled team
// strategy form. This file is intentionally data-only: no UI,
// no Mock Draft behavior, and no algorithm wiring happens here.
//
// Needs are normalized to a 0-100 scale from the form's explicit
// ratings when present, with priority-slot conversion used for
// textual needs that did not include a numeric rating.
// ============================================================

export type TeamId = 'ATL' | 'BOS' | 'BKN' | 'CHA' | 'CHI' | 'CLE' | 'DAL' | 'DEN' | 'DET' | 'GSW' | 'HOU' | 'IND' | 'LAC' | 'LAL' | 'MEM' | 'MIA' | 'MIL' | 'MIN' | 'NOP' | 'NYK' | 'OKC' | 'ORL' | 'PHI' | 'PHX' | 'POR' | 'SAC' | 'SAS' | 'TOR' | 'UTA' | 'WAS';

export type TeamTimeline =
  | 'contender'
  | 'playoff'
  | 'ascending'
  | 'retooling'
  | 'rebuilding';

export type DraftMode =
  | 'best-player'
  | 'need-based'
  | 'upside-swing'
  | 'safe-pick'
  | 'value-opportunistic';

export type RiskTolerance = 'low' | 'medium' | 'high';

export type TeamNeeds = {
  primaryCreation: number;
  secondaryCreation: number;
  shooting: number;
  rimPressure: number;
  pointOfAttackDefense: number;
  wingDefense: number;
  rimProtection: number;
  rebounding: number;
  size: number;
  athleticism: number;
  benchScoring: number;
};

export type TeamDraftIntelligence = {
  teamId: TeamId;
  teamName: string;
  abbreviation: TeamId;

  timeline: TeamTimeline;
  draftMode: DraftMode;
  riskTolerance: RiskTolerance;

  teamIdentity: {
    summary: string;
    offensiveStyle: string;
    defensiveStyle: string;
    rosterContext: string;
  };

  needs: TeamNeeds;

  draftPreferences: {
    preferredArchetypes: string[];
    avoidArchetypes: string[];
    prioritySkills: string[];
    avoidSkills: string[];
    idealPickLogic: string;
  };

  algorithmWeights: {
    needFit: number;
    roleFit: number;
    draftRange: number;
    strategyFit: number;
    boardValue: number;
    riskFit: number;
  };

  notes: {
    short: string;
    draftStrategy: string;
    caution: string;
  };
};

export const defaultTeamDraftIntelligenceWeights = {
  "needFit": 0.26,
  "roleFit": 0.2,
  "draftRange": 0.18,
  "strategyFit": 0.18,
  "boardValue": 0.1,
  "riskFit": 0.08
} as const;

export const teamDraftIntelligence: Record<TeamId, TeamDraftIntelligence> = {
  "ATL": {
    "teamId": "ATL",
    "teamName": "Atlanta Hawks",
    "abbreviation": "ATL",
    "timeline": "playoff",
    "draftMode": "need-based",
    "riskTolerance": "medium",
    "teamIdentity": {
      "summary": "ataque funcional; defesa média; ritmo alto; alto volume de 3; boa circulação. Núcleo estatístico: Jalen Johnson, Nickeil Alexander-Walker, Dyson Daniels.",
      "offensiveStyle": "ataque funcional; ritmo alto; alto volume de 3; boa circulação.",
      "defensiveStyle": "defesa média.",
      "rosterContext": "Núcleo estatístico: Jalen Johnson, Nickeil Alexander-Walker, Dyson Daniels."
    },
    "needs": {
      "primaryCreation": 63,
      "secondaryCreation": 20,
      "shooting": 20,
      "rimPressure": 20,
      "pointOfAttackDefense": 58,
      "wingDefense": 58,
      "rimProtection": 56,
      "rebounding": 52,
      "size": 56,
      "athleticism": 20,
      "benchScoring": 20
    },
    "draftPreferences": {
      "preferredArchetypes": [
        "Criador prim?rio com volume real",
        "Protetor de aro com tamanho funcional",
        "Forward/big f?sico com presen?a de garraf?o"
      ],
      "avoidArchetypes": [
        "Liability defensivo",
        "Criador com baixa leitura",
        "Jogador baixo sem rebote"
      ],
      "prioritySkills": [
        "Primary Creation",
        "Size",
        "Rim Protection",
        "Defense",
        "Rebounding",
        "Wing Defense"
      ],
      "avoidSkills": [
        "Liability defensivo",
        "Criador com baixa leitura",
        "Jogador baixo sem rebote"
      ],
      "idealPickLogic": "Combinar fit e valor de board, priorizando primary_creation, size, rim_protection."
    },
    "algorithmWeights": {
      "needFit": 0.26,
      "roleFit": 0.2,
      "draftRange": 0.18,
      "strategyFit": 0.18,
      "boardValue": 0.1,
      "riskFit": 0.08
    },
    "notes": {
      "short": "Atlanta Hawks: prioridade em primary creation e size, com estratégia positional need.",
      "draftStrategy": "Elevar o piso da rotação e cobrir lacunas em primary creation, size, rim protection, sem perder flexibilidade tática. Combinar fit e valor de board, priorizando primary_creation, size, rim_protection.",
      "caution": "Need Fit deve ponderar alto para primary_creation e size; jogadores que não endereçam esses eixos não devem receber boost artificial. Role Fit deve considerar janela playoff_team e tolerância de risco medium. Strategy Fit: positional_need com prioridade editorial em defense; ajustar penalidades por pick range e prontidão."
    }
  },
  "BOS": {
    "teamId": "BOS",
    "teamName": "Boston Celtics",
    "abbreviation": "BOS",
    "timeline": "contender",
    "draftMode": "safe-pick",
    "riskTolerance": "medium",
    "teamIdentity": {
      "summary": "ataque de elite; defesa forte; ritmo controlado; alto volume de 3; força nos rebotes. Núcleo estatístico: Jaylen Brown, Derrick White, Jayson Tatum.",
      "offensiveStyle": "ataque de elite; ritmo controlado; alto volume de 3.",
      "defensiveStyle": "defesa forte; força nos rebotes.",
      "rosterContext": "Núcleo estatístico: Jaylen Brown, Derrick White, Jayson Tatum."
    },
    "needs": {
      "primaryCreation": 20,
      "secondaryCreation": 58,
      "shooting": 46,
      "rimPressure": 81,
      "pointOfAttackDefense": 58,
      "wingDefense": 20,
      "rimProtection": 20,
      "rebounding": 20,
      "size": 20,
      "athleticism": 87,
      "benchScoring": 20
    },
    "draftPreferences": {
      "preferredArchetypes": [
        "Defensor de per?metro com versatilidade",
        "Atleta com press?o de aro e transi??o"
      ],
      "avoidArchetypes": [
        "Liability defensivo",
        "Criador com baixa leitura",
        "Projeto cru sem minutos imediatos"
      ],
      "prioritySkills": [
        "Athleticism",
        "Rim Pressure",
        "Point Of Attack Defense",
        "Playmaking",
        "Secondary Creation",
        "Spacing"
      ],
      "avoidSkills": [
        "Liability defensivo",
        "Criador com baixa leitura",
        "Projeto cru sem minutos imediatos"
      ],
      "idealPickLogic": "Priorizar jogador pronto, baixo erro e função imediata em athleticism, rim_pressure, point_of_attack_defense; evitar apostas que não entrem em playoff rotation."
    },
    "algorithmWeights": {
      "needFit": 0.26,
      "roleFit": 0.2,
      "draftRange": 0.18,
      "strategyFit": 0.18,
      "boardValue": 0.1,
      "riskFit": 0.08
    },
    "notes": {
      "short": "Boston Celtics: prioridade em athleticism e rim pressure, com estratégia win now support.",
      "draftStrategy": "Draftar para playoff utility: athleticism, rim pressure, point of attack defense, com tomada de decisão rápida e impacto sem uso alto. Priorizar jogador pronto, baixo erro e função imediata em athleticism, rim_pressure, point_of_attack_defense; evitar apostas que não entrem em playoff rotation.",
      "caution": "Need Fit deve ponderar alto para athleticism e rim_pressure; jogadores que não endereçam esses eixos não devem receber boost artificial. Role Fit deve considerar janela contender e tolerância de risco medium. Strategy Fit: win_now_support com prioridade editorial em shooting; ajustar penalidades por pick range e prontidão."
    }
  },
  "BKN": {
    "teamId": "BKN",
    "teamName": "Brooklyn Nets",
    "abbreviation": "BKN",
    "timeline": "rebuilding",
    "draftMode": "best-player",
    "riskTolerance": "high",
    "teamIdentity": {
      "summary": "ataque instável; defesa vulnerável; ritmo controlado. Núcleo estatístico: Michael Porter Jr., Nic Claxton, Noah Clowney.",
      "offensiveStyle": "ataque instável; ritmo controlado.",
      "defensiveStyle": "defesa vulnerável.",
      "rosterContext": "Núcleo estatístico: Michael Porter Jr., Nic Claxton, Noah Clowney."
    },
    "needs": {
      "primaryCreation": 20,
      "secondaryCreation": 97,
      "shooting": 100,
      "rimPressure": 20,
      "pointOfAttackDefense": 52,
      "wingDefense": 52,
      "rimProtection": 20,
      "rebounding": 20,
      "size": 20,
      "athleticism": 20,
      "benchScoring": 100
    },
    "draftPreferences": {
      "preferredArchetypes": [
        "Pontuador de segunda unidade"
      ],
      "avoidArchetypes": [
        "Arremessador limitado",
        "Liability defensivo",
        "Criador com baixa leitura"
      ],
      "prioritySkills": [
        "Bench Scoring",
        "Efficiency",
        "Ball Security",
        "Playmaking",
        "Defense",
        "Secondary Creation"
      ],
      "avoidSkills": [
        "Arremessador limitado",
        "Liability defensivo",
        "Criador com baixa leitura"
      ],
      "idealPickLogic": "Atacar BPA com upside real, principalmente se entregar bench_scoring, efficiency, ball_security; tolerar risco quando houver caminho de estrela."
    },
    "algorithmWeights": {
      "needFit": 0.26,
      "roleFit": 0.2,
      "draftRange": 0.18,
      "strategyFit": 0.18,
      "boardValue": 0.1,
      "riskFit": 0.08
    },
    "notes": {
      "short": "Brooklyn Nets: prioridade em bench scoring e efficiency, com estratégia rebuild upside.",
      "draftStrategy": "Usar a pick para aumentar teto: bench scoring, efficiency, ball security importam, mas o desempate deve ser upside e criação. Atacar BPA com upside real, principalmente se entregar bench_scoring, efficiency, ball_security; tolerar risco quando houver caminho de estrela.",
      "caution": "Need Fit deve ponderar alto para bench_scoring e efficiency; jogadores que não endereçam esses eixos não devem receber boost artificial. Role Fit deve considerar janela not_competing e tolerância de risco high. Strategy Fit: rebuild_upside com prioridade editorial em creation; ajustar penalidades por pick range e prontidão."
    }
  },
  "CHA": {
    "teamId": "CHA",
    "teamName": "Charlotte Hornets",
    "abbreviation": "CHA",
    "timeline": "playoff",
    "draftMode": "need-based",
    "riskTolerance": "medium",
    "teamIdentity": {
      "summary": "ataque de elite; defesa média; ritmo controlado; alto volume de 3; força nos rebotes. Núcleo estatístico: Kon Knueppel, Miles Bridges, Brandon Miller.",
      "offensiveStyle": "ataque de elite; ritmo controlado; alto volume de 3.",
      "defensiveStyle": "defesa média; força nos rebotes.",
      "rosterContext": "Núcleo estatístico: Kon Knueppel, Miles Bridges, Brandon Miller."
    },
    "needs": {
      "primaryCreation": 20,
      "secondaryCreation": 86,
      "shooting": 20,
      "rimPressure": 58,
      "pointOfAttackDefense": 73,
      "wingDefense": 46,
      "rimProtection": 20,
      "rebounding": 20,
      "size": 20,
      "athleticism": 81,
      "benchScoring": 20
    },
    "draftPreferences": {
      "preferredArchetypes": [
        "Defensor de per?metro com versatilidade",
        "Atleta com press?o de aro e transi??o"
      ],
      "avoidArchetypes": [
        "Liability defensivo",
        "Criador com baixa leitura",
        "Guard com turnovers altos"
      ],
      "prioritySkills": [
        "Ball Security",
        "Athleticism",
        "Point Of Attack Defense",
        "Rim Pressure",
        "Playmaking",
        "Wing Defense"
      ],
      "avoidSkills": [
        "Liability defensivo",
        "Criador com baixa leitura",
        "Guard com turnovers altos"
      ],
      "idealPickLogic": "Combinar fit e valor de board, priorizando ball_security, athleticism, point_of_attack_defense."
    },
    "algorithmWeights": {
      "needFit": 0.26,
      "roleFit": 0.2,
      "draftRange": 0.18,
      "strategyFit": 0.18,
      "boardValue": 0.1,
      "riskFit": 0.08
    },
    "notes": {
      "short": "Charlotte Hornets: prioridade em ball security e athleticism, com estratégia positional need.",
      "draftStrategy": "Adicionar peça que mude a curva do núcleo: ball security, athleticism, point of attack defense, com prioridade para tradução em dois anos. Combinar fit e valor de board, priorizando ball_security, athleticism, point_of_attack_defense.",
      "caution": "Need Fit deve ponderar alto para ball_security e athleticism; jogadores que não endereçam esses eixos não devem receber boost artificial. Role Fit deve considerar janela play_in_level e tolerância de risco medium. Strategy Fit: positional_need com prioridade editorial em rim_protection; ajustar penalidades por pick range e prontidão."
    }
  },
  "CHI": {
    "teamId": "CHI",
    "teamName": "Chicago Bulls",
    "abbreviation": "CHI",
    "timeline": "ascending",
    "draftMode": "best-player",
    "riskTolerance": "high",
    "teamIdentity": {
      "summary": "ataque instável; defesa vulnerável; ritmo alto; boa circulação. Núcleo estatístico: Josh Giddey, Matas Buzelis, Tre Jones.",
      "offensiveStyle": "ataque instável; ritmo alto; boa circulação.",
      "defensiveStyle": "defesa vulnerável.",
      "rosterContext": "Núcleo estatístico: Josh Giddey, Matas Buzelis, Tre Jones."
    },
    "needs": {
      "primaryCreation": 20,
      "secondaryCreation": 58,
      "shooting": 20,
      "rimPressure": 20,
      "pointOfAttackDefense": 80,
      "wingDefense": 72,
      "rimProtection": 46,
      "rebounding": 20,
      "size": 52,
      "athleticism": 20,
      "benchScoring": 20
    },
    "draftPreferences": {
      "preferredArchetypes": [
        "Defensor de per?metro com versatilidade"
      ],
      "avoidArchetypes": [
        "Liability defensivo",
        "Especialista de baixo upside",
        "Guard com turnovers altos"
      ],
      "prioritySkills": [
        "Point Of Attack Defense",
        "Defense",
        "Wing Defense",
        "Ball Security",
        "Switchability",
        "Rim Protection"
      ],
      "avoidSkills": [
        "Liability defensivo",
        "Especialista de baixo upside",
        "Guard com turnovers altos"
      ],
      "idealPickLogic": "Atacar BPA com upside real, principalmente se entregar point_of_attack_defense, defense, wing_defense; tolerar risco quando houver caminho de estrela."
    },
    "algorithmWeights": {
      "needFit": 0.26,
      "roleFit": 0.2,
      "draftRange": 0.18,
      "strategyFit": 0.18,
      "boardValue": 0.1,
      "riskFit": 0.08
    },
    "notes": {
      "short": "Chicago Bulls: prioridade em point of attack defense e defense, com estratégia rebuild upside.",
      "draftStrategy": "Usar a pick para aumentar teto: point of attack defense, defense, wing defense importam, mas o desempate deve ser upside e criação. Atacar BPA com upside real, principalmente se entregar point_of_attack_defense, defense, wing_defense; tolerar risco quando houver caminho de estrela.",
      "caution": "Need Fit deve ponderar alto para point_of_attack_defense e defense; jogadores que não endereçam esses eixos não devem receber boost artificial. Role Fit deve considerar janela not_competing e tolerância de risco high. Strategy Fit: rebuild_upside com prioridade editorial em creation; ajustar penalidades por pick range e prontidão."
    }
  },
  "CLE": {
    "teamId": "CLE",
    "teamName": "Cleveland Cavaliers",
    "abbreviation": "CLE",
    "timeline": "contender",
    "draftMode": "safe-pick",
    "riskTolerance": "low",
    "teamIdentity": {
      "summary": "ataque de elite; defesa média; alto volume de 3; boa circulação. Núcleo estatístico: James Harden, Donovan Mitchell, Evan Mobley.",
      "offensiveStyle": "ataque de elite; alto volume de 3; boa circulação.",
      "defensiveStyle": "defesa média.",
      "rosterContext": "Núcleo estatístico: James Harden, Donovan Mitchell, Evan Mobley."
    },
    "needs": {
      "primaryCreation": 20,
      "secondaryCreation": 20,
      "shooting": 20,
      "rimPressure": 44,
      "pointOfAttackDefense": 52,
      "wingDefense": 58,
      "rimProtection": 20,
      "rebounding": 20,
      "size": 58,
      "athleticism": 44,
      "benchScoring": 20
    },
    "draftPreferences": {
      "preferredArchetypes": [
        "Defensor de per?metro com versatilidade",
        "Atleta com press?o de aro e transi??o"
      ],
      "avoidArchetypes": [
        "Liability defensivo",
        "Projeto cru sem minutos imediatos",
        "Guard sem arremesso"
      ],
      "prioritySkills": [
        "Wing Defense",
        "Rim Pressure",
        "Athleticism",
        "Switchability",
        "Defense",
        "Point Of Attack Defense"
      ],
      "avoidSkills": [
        "Liability defensivo",
        "Projeto cru sem minutos imediatos",
        "Guard sem arremesso"
      ],
      "idealPickLogic": "Priorizar jogador pronto, baixo erro e função imediata em wing_defense, rim_pressure, athleticism; evitar apostas que não entrem em playoff rotation."
    },
    "algorithmWeights": {
      "needFit": 0.26,
      "roleFit": 0.2,
      "draftRange": 0.18,
      "strategyFit": 0.18,
      "boardValue": 0.1,
      "riskFit": 0.08
    },
    "notes": {
      "short": "Cleveland Cavaliers: prioridade em wing defense e rim pressure, com estratégia win now support.",
      "draftStrategy": "Elevar o piso da rotação e cobrir lacunas em wing defense, rim pressure, athleticism, sem perder flexibilidade tática. Priorizar jogador pronto, baixo erro e função imediata em wing_defense, rim_pressure, athleticism; evitar apostas que não entrem em playoff rotation.",
      "caution": "Need Fit deve ponderar alto para wing_defense e rim_pressure; jogadores que não endereçam esses eixos não devem receber boost artificial. Role Fit deve considerar janela playoff_team e tolerância de risco low. Strategy Fit: win_now_support com prioridade editorial em versatility; ajustar penalidades por pick range e prontidão."
    }
  },
  "DAL": {
    "teamId": "DAL",
    "teamName": "Dallas Mavericks",
    "abbreviation": "DAL",
    "timeline": "playoff",
    "draftMode": "best-player",
    "riskTolerance": "medium",
    "teamIdentity": {
      "summary": "ataque instável; defesa vulnerável; ritmo alto. Núcleo estatístico: Cooper Flagg, P.J. Washington, Naji Marshall.",
      "offensiveStyle": "ataque instável; ritmo alto.",
      "defensiveStyle": "defesa vulnerável.",
      "rosterContext": "Núcleo estatístico: Cooper Flagg, P.J. Washington, Naji Marshall."
    },
    "needs": {
      "primaryCreation": 83,
      "secondaryCreation": 58,
      "shooting": 90,
      "rimPressure": 20,
      "pointOfAttackDefense": 80,
      "wingDefense": 20,
      "rimProtection": 20,
      "rebounding": 20,
      "size": 20,
      "athleticism": 20,
      "benchScoring": 20
    },
    "draftPreferences": {
      "preferredArchetypes": [
        "Criador prim?rio com volume real",
        "Arremessador escal?vel com gravidade",
        "Defensor de per?metro com versatilidade"
      ],
      "avoidArchetypes": [
        "Arremessador limitado",
        "Liability defensivo",
        "Criador com baixa leitura"
      ],
      "prioritySkills": [
        "Shooting",
        "Primary Creation",
        "Point Of Attack Defense",
        "Secondary Creation",
        "Spacing",
        "Efficiency"
      ],
      "avoidSkills": [
        "Arremessador limitado",
        "Liability defensivo",
        "Criador com baixa leitura"
      ],
      "idealPickLogic": "Buscar talento que cresça com o núcleo e resolva shooting, primary_creation, point_of_attack_defense, sem sacrificar teto por encaixe curto."
    },
    "algorithmWeights": {
      "needFit": 0.26,
      "roleFit": 0.2,
      "draftRange": 0.18,
      "strategyFit": 0.18,
      "boardValue": 0.1,
      "riskFit": 0.08
    },
    "notes": {
      "short": "Dallas Mavericks: prioridade em shooting e primary creation, com estratégia rebuild upside.",
      "draftStrategy": "Adicionar peça que mude a curva do núcleo: shooting, primary creation, point of attack defense, com prioridade para tradução em dois anos. Buscar talento que cresça com o núcleo e resolva shooting, primary_creation, point_of_attack_defense, sem sacrificar teto por encaixe curto.",
      "caution": "Need Fit deve ponderar alto para shooting e primary_creation; jogadores que não endereçam esses eixos não devem receber boost artificial. Role Fit deve considerar janela play_in_level e tolerância de risco medium. Strategy Fit: rebuild_upside com prioridade editorial em playmaking; ajustar penalidades por pick range e prontidão."
    }
  },
  "DEN": {
    "teamId": "DEN",
    "teamName": "Denver Nuggets",
    "abbreviation": "DEN",
    "timeline": "contender",
    "draftMode": "safe-pick",
    "riskTolerance": "low",
    "teamIdentity": {
      "summary": "ataque de elite; defesa vulnerável; boa circulação. Núcleo estatístico: Jamal Murray, Nikola Jokić, Christian Braun.",
      "offensiveStyle": "ataque de elite; boa circulação.",
      "defensiveStyle": "defesa vulnerável.",
      "rosterContext": "Núcleo estatístico: Jamal Murray, Nikola Jokić, Christian Braun."
    },
    "needs": {
      "primaryCreation": 20,
      "secondaryCreation": 20,
      "shooting": 20,
      "rimPressure": 73,
      "pointOfAttackDefense": 85,
      "wingDefense": 52,
      "rimProtection": 58,
      "rebounding": 20,
      "size": 46,
      "athleticism": 65,
      "benchScoring": 20
    },
    "draftPreferences": {
      "preferredArchetypes": [
        "Defensor de per?metro com versatilidade",
        "Atleta com press?o de aro e transi??o"
      ],
      "avoidArchetypes": [
        "Liability defensivo",
        "Jogador baixo sem rebote",
        "Projeto cru sem minutos imediatos"
      ],
      "prioritySkills": [
        "Point Of Attack Defense",
        "Rim Pressure",
        "Athleticism",
        "Rim Protection",
        "Defense",
        "Switchability"
      ],
      "avoidSkills": [
        "Liability defensivo",
        "Jogador baixo sem rebote",
        "Projeto cru sem minutos imediatos"
      ],
      "idealPickLogic": "Priorizar jogador pronto, baixo erro e função imediata em point_of_attack_defense, rim_pressure, athleticism; evitar apostas que não entrem em playoff rotation."
    },
    "algorithmWeights": {
      "needFit": 0.26,
      "roleFit": 0.2,
      "draftRange": 0.18,
      "strategyFit": 0.18,
      "boardValue": 0.1,
      "riskFit": 0.08
    },
    "notes": {
      "short": "Denver Nuggets: prioridade em point of attack defense e rim pressure, com estratégia win now support.",
      "draftStrategy": "Draftar para playoff utility: point of attack defense, rim pressure, athleticism, com tomada de decisão rápida e impacto sem uso alto. Priorizar jogador pronto, baixo erro e função imediata em point_of_attack_defense, rim_pressure, athleticism; evitar apostas que não entrem em playoff rotation.",
      "caution": "Need Fit deve ponderar alto para point_of_attack_defense e rim_pressure; jogadores que não endereçam esses eixos não devem receber boost artificial. Role Fit deve considerar janela contender e tolerância de risco low. Strategy Fit: win_now_support com prioridade editorial em shooting; ajustar penalidades por pick range e prontidão."
    }
  },
  "DET": {
    "teamId": "DET",
    "teamName": "Detroit Pistons",
    "abbreviation": "DET",
    "timeline": "contender",
    "draftMode": "safe-pick",
    "riskTolerance": "low",
    "teamIdentity": {
      "summary": "ataque funcional; defesa forte; força nos rebotes. Núcleo estatístico: Cade Cunningham, Jalen Duren, Tobias Harris.",
      "offensiveStyle": "ataque funcional.",
      "defensiveStyle": "defesa forte; força nos rebotes.",
      "rosterContext": "Núcleo estatístico: Cade Cunningham, Jalen Duren, Tobias Harris."
    },
    "needs": {
      "primaryCreation": 46,
      "secondaryCreation": 69,
      "shooting": 69,
      "rimPressure": 20,
      "pointOfAttackDefense": 20,
      "wingDefense": 20,
      "rimProtection": 20,
      "rebounding": 20,
      "size": 20,
      "athleticism": 20,
      "benchScoring": 20
    },
    "draftPreferences": {
      "preferredArchetypes": [
        "Arremessador escal?vel com gravidade"
      ],
      "avoidArchetypes": [
        "Arremessador limitado",
        "Criador com baixa leitura",
        "Projeto cru sem minutos imediatos"
      ],
      "prioritySkills": [
        "Spacing",
        "Ball Security",
        "Shooting",
        "Playmaking",
        "Efficiency",
        "Primary Creation"
      ],
      "avoidSkills": [
        "Arremessador limitado",
        "Criador com baixa leitura",
        "Projeto cru sem minutos imediatos"
      ],
      "idealPickLogic": "Priorizar jogador pronto, baixo erro e função imediata em spacing, ball_security, shooting; evitar apostas que não entrem em playoff rotation."
    },
    "algorithmWeights": {
      "needFit": 0.26,
      "roleFit": 0.2,
      "draftRange": 0.18,
      "strategyFit": 0.18,
      "boardValue": 0.1,
      "riskFit": 0.08
    },
    "notes": {
      "short": "Detroit Pistons: prioridade em spacing e ball security, com estratégia win now support.",
      "draftStrategy": "Draftar para playoff utility: spacing, ball security, shooting, com tomada de decisão rápida e impacto sem uso alto. Priorizar jogador pronto, baixo erro e função imediata em spacing, ball_security, shooting; evitar apostas que não entrem em playoff rotation.",
      "caution": "Need Fit deve ponderar alto para spacing e ball_security; jogadores que não endereçam esses eixos não devem receber boost artificial. Role Fit deve considerar janela contender e tolerância de risco low. Strategy Fit: win_now_support com prioridade editorial em shooting; ajustar penalidades por pick range e prontidão."
    }
  },
  "GSW": {
    "teamId": "GSW",
    "teamName": "Golden State Warriors",
    "abbreviation": "GSW",
    "timeline": "playoff",
    "draftMode": "best-player",
    "riskTolerance": "medium",
    "teamIdentity": {
      "summary": "ataque instável; defesa média; alto volume de 3; boa circulação. Núcleo estatístico: Jimmy Butler III, Stephen Curry, Brandin Podziemski.",
      "offensiveStyle": "ataque instável; alto volume de 3; boa circulação.",
      "defensiveStyle": "defesa média.",
      "rosterContext": "Núcleo estatístico: Jimmy Butler III, Stephen Curry, Brandin Podziemski."
    },
    "needs": {
      "primaryCreation": 20,
      "secondaryCreation": 88,
      "shooting": 20,
      "rimPressure": 85,
      "pointOfAttackDefense": 20,
      "wingDefense": 20,
      "rimProtection": 20,
      "rebounding": 58,
      "size": 52,
      "athleticism": 46,
      "benchScoring": 71
    },
    "draftPreferences": {
      "preferredArchetypes": [
        "Atleta com press?o de aro e transi??o",
        "Pontuador de segunda unidade"
      ],
      "avoidArchetypes": [
        "Jogador baixo sem rebote",
        "Guard com turnovers altos",
        "Guard sem arremesso"
      ],
      "prioritySkills": [
        "Ball Security",
        "Rim Pressure",
        "Bench Scoring",
        "Rebounding",
        "Size",
        "Athleticism"
      ],
      "avoidSkills": [
        "Jogador baixo sem rebote",
        "Guard com turnovers altos",
        "Guard sem arremesso"
      ],
      "idealPickLogic": "Equilibrar valor de board e função clara; priorizar ball_security, rim_pressure, bench_scoring para acelerar o retool."
    },
    "algorithmWeights": {
      "needFit": 0.26,
      "roleFit": 0.2,
      "draftRange": 0.18,
      "strategyFit": 0.18,
      "boardValue": 0.1,
      "riskFit": 0.08
    },
    "notes": {
      "short": "Golden State Warriors: prioridade em ball security e rim pressure, com estratégia talent accumulation.",
      "draftStrategy": "Adicionar peça que mude a curva do núcleo: ball security, rim pressure, bench scoring, com prioridade para tradução em dois anos. Equilibrar valor de board e função clara; priorizar ball_security, rim_pressure, bench_scoring para acelerar o retool.",
      "caution": "Need Fit deve ponderar alto para ball_security e rim_pressure; jogadores que não endereçam esses eixos não devem receber boost artificial. Role Fit deve considerar janela play_in_level e tolerância de risco medium. Strategy Fit: talent_accumulation com prioridade editorial em shooting; ajustar penalidades por pick range e prontidão."
    }
  },
  "HOU": {
    "teamId": "HOU",
    "teamName": "Houston Rockets",
    "abbreviation": "HOU",
    "timeline": "playoff",
    "draftMode": "safe-pick",
    "riskTolerance": "medium",
    "teamIdentity": {
      "summary": "ataque funcional; defesa forte; ritmo controlado; força nos rebotes. Núcleo estatístico: Amen Thompson, Kevin Durant, Jabari Smith Jr..",
      "offensiveStyle": "ataque funcional; ritmo controlado.",
      "defensiveStyle": "defesa forte; força nos rebotes.",
      "rosterContext": "Núcleo estatístico: Amen Thompson, Kevin Durant, Jabari Smith Jr."
    },
    "needs": {
      "primaryCreation": 20,
      "secondaryCreation": 85,
      "shooting": 46,
      "rimPressure": 20,
      "pointOfAttackDefense": 58,
      "wingDefense": 20,
      "rimProtection": 20,
      "rebounding": 20,
      "size": 20,
      "athleticism": 73,
      "benchScoring": 20
    },
    "draftPreferences": {
      "preferredArchetypes": [
        "Conector ofensivo com passe e decis?o",
        "Atleta com press?o de aro e transi??o"
      ],
      "avoidArchetypes": [
        "Liability defensivo",
        "Criador com baixa leitura",
        "Projeto cru sem minutos imediatos"
      ],
      "prioritySkills": [
        "Ball Security",
        "Athleticism",
        "Playmaking",
        "Point Of Attack Defense",
        "Secondary Creation",
        "Shooting"
      ],
      "avoidSkills": [
        "Liability defensivo",
        "Criador com baixa leitura",
        "Projeto cru sem minutos imediatos"
      ],
      "idealPickLogic": "Combinar fit e valor de board, priorizando ball_security, athleticism, playmaking."
    },
    "algorithmWeights": {
      "needFit": 0.26,
      "roleFit": 0.2,
      "draftRange": 0.18,
      "strategyFit": 0.18,
      "boardValue": 0.1,
      "riskFit": 0.08
    },
    "notes": {
      "short": "Houston Rockets: prioridade em ball security e athleticism, com estratégia floor fit.",
      "draftStrategy": "Elevar o piso da rotação e cobrir lacunas em ball security, athleticism, playmaking, sem perder flexibilidade tática. Combinar fit e valor de board, priorizando ball_security, athleticism, playmaking.",
      "caution": "Need Fit deve ponderar alto para ball_security e athleticism; jogadores que não endereçam esses eixos não devem receber boost artificial. Role Fit deve considerar janela playoff_team e tolerância de risco medium. Strategy Fit: floor_fit com prioridade editorial em creation; ajustar penalidades por pick range e prontidão."
    }
  },
  "IND": {
    "teamId": "IND",
    "teamName": "Indiana Pacers",
    "abbreviation": "IND",
    "timeline": "contender",
    "draftMode": "safe-pick",
    "riskTolerance": "medium",
    "teamIdentity": {
      "summary": "ataque instável; defesa vulnerável. Núcleo estatístico: Pascal Siakam, Andrew Nembhard, Ivica Zubac.",
      "offensiveStyle": "ataque instável.",
      "defensiveStyle": "defesa vulnerável.",
      "rosterContext": "Núcleo estatístico: Pascal Siakam, Andrew Nembhard, Ivica Zubac."
    },
    "needs": {
      "primaryCreation": 20,
      "secondaryCreation": 20,
      "shooting": 83,
      "rimPressure": 20,
      "pointOfAttackDefense": 80,
      "wingDefense": 80,
      "rimProtection": 20,
      "rebounding": 52,
      "size": 58,
      "athleticism": 20,
      "benchScoring": 92
    },
    "draftPreferences": {
      "preferredArchetypes": [
        "Defensor de per?metro com versatilidade",
        "Pontuador de segunda unidade"
      ],
      "avoidArchetypes": [
        "Arremessador limitado",
        "Liability defensivo",
        "Jogador baixo sem rebote"
      ],
      "prioritySkills": [
        "Bench Scoring",
        "Efficiency",
        "Defense",
        "Size",
        "Rebounding",
        "Switchability"
      ],
      "avoidSkills": [
        "Arremessador limitado",
        "Liability defensivo",
        "Jogador baixo sem rebote"
      ],
      "idealPickLogic": "Priorizar jogador pronto, baixo erro e função imediata em bench_scoring, efficiency, defense; evitar apostas que não entrem em playoff rotation."
    },
    "algorithmWeights": {
      "needFit": 0.26,
      "roleFit": 0.2,
      "draftRange": 0.18,
      "strategyFit": 0.18,
      "boardValue": 0.1,
      "riskFit": 0.08
    },
    "notes": {
      "short": "Indiana Pacers: prioridade em bench scoring e efficiency, com estratégia win now support.",
      "draftStrategy": "Draftar para playoff utility: bench scoring, efficiency, defense, com tomada de decisão rápida e impacto sem uso alto. Priorizar jogador pronto, baixo erro e função imediata em bench_scoring, efficiency, defense; evitar apostas que não entrem em playoff rotation.",
      "caution": "Need Fit deve ponderar alto para bench_scoring e efficiency; jogadores que não endereçam esses eixos não devem receber boost artificial. Role Fit deve considerar janela contender e tolerância de risco medium. Strategy Fit: win_now_support com prioridade editorial em versatility; ajustar penalidades por pick range e prontidão."
    }
  },
  "LAC": {
    "teamId": "LAC",
    "teamName": "LA Clippers",
    "abbreviation": "LAC",
    "timeline": "playoff",
    "draftMode": "best-player",
    "riskTolerance": "high",
    "teamIdentity": {
      "summary": "ataque funcional; defesa vulnerável; ritmo controlado. Núcleo estatístico: Kawhi Leonard, Bennedict Mathurin, Darius Garland.",
      "offensiveStyle": "ataque funcional; ritmo controlado.",
      "defensiveStyle": "defesa vulnerável.",
      "rosterContext": "Núcleo estatístico: Kawhi Leonard, Bennedict Mathurin, Darius Garland."
    },
    "needs": {
      "primaryCreation": 20,
      "secondaryCreation": 52,
      "shooting": 20,
      "rimPressure": 58,
      "pointOfAttackDefense": 20,
      "wingDefense": 20,
      "rimProtection": 20,
      "rebounding": 85,
      "size": 20,
      "athleticism": 72,
      "benchScoring": 71
    },
    "draftPreferences": {
      "preferredArchetypes": [
        "Atleta com press?o de aro e transi??o",
        "Pontuador de segunda unidade",
        "Forward/big f?sico com presen?a de garraf?o"
      ],
      "avoidArchetypes": [
        "Criador com baixa leitura",
        "Jogador baixo sem rebote",
        "Guard sem arremesso"
      ],
      "prioritySkills": [
        "Rebounding",
        "Athleticism",
        "Bench Scoring",
        "Rim Pressure",
        "Playmaking",
        "Secondary Creation"
      ],
      "avoidSkills": [
        "Criador com baixa leitura",
        "Jogador baixo sem rebote",
        "Guard sem arremesso"
      ],
      "idealPickLogic": "Atacar BPA com upside real, principalmente se entregar rebounding, athleticism, bench_scoring; tolerar risco quando houver caminho de estrela."
    },
    "algorithmWeights": {
      "needFit": 0.26,
      "roleFit": 0.2,
      "draftRange": 0.18,
      "strategyFit": 0.18,
      "boardValue": 0.1,
      "riskFit": 0.08
    },
    "notes": {
      "short": "LA Clippers: prioridade em rebounding e athleticism, com estratégia rebuild upside.",
      "draftStrategy": "Adicionar peça que mude a curva do núcleo: rebounding, athleticism, bench scoring, com prioridade para tradução em dois anos. Atacar BPA com upside real, principalmente se entregar rebounding, athleticism, bench_scoring; tolerar risco quando houver caminho de estrela.",
      "caution": "Need Fit deve ponderar alto para rebounding e athleticism; jogadores que não endereçam esses eixos não devem receber boost artificial. Role Fit deve considerar janela play_in_level e tolerância de risco high. Strategy Fit: rebuild_upside com prioridade editorial em versatility; ajustar penalidades por pick range e prontidão."
    }
  },
  "LAL": {
    "teamId": "LAL",
    "teamName": "Los Angeles Lakers",
    "abbreviation": "LAL",
    "timeline": "playoff",
    "draftMode": "safe-pick",
    "riskTolerance": "low",
    "teamIdentity": {
      "summary": "ataque de elite; defesa vulnerável. Núcleo estatístico: Luka Dončić, Austin Reaves, LeBron James.",
      "offensiveStyle": "ataque de elite.",
      "defensiveStyle": "defesa vulnerável.",
      "rosterContext": "Núcleo estatístico: Luka Dončić, Austin Reaves, LeBron James."
    },
    "needs": {
      "primaryCreation": 20,
      "secondaryCreation": 20,
      "shooting": 20,
      "rimPressure": 52,
      "pointOfAttackDefense": 67,
      "wingDefense": 67,
      "rimProtection": 58,
      "rebounding": 75,
      "size": 69,
      "athleticism": 20,
      "benchScoring": 20
    },
    "draftPreferences": {
      "preferredArchetypes": [
        "Defensor de per?metro com versatilidade",
        "Forward/big f?sico com presen?a de garraf?o"
      ],
      "avoidArchetypes": [
        "Liability defensivo",
        "Jogador baixo sem rebote",
        "Projeto cru sem minutos imediatos"
      ],
      "prioritySkills": [
        "Rebounding",
        "Size",
        "Defense",
        "Rim Protection",
        "Rim Pressure",
        "Switchability"
      ],
      "avoidSkills": [
        "Liability defensivo",
        "Jogador baixo sem rebote",
        "Projeto cru sem minutos imediatos"
      ],
      "idealPickLogic": "Combinar fit e valor de board, priorizando rebounding, size, defense."
    },
    "algorithmWeights": {
      "needFit": 0.26,
      "roleFit": 0.2,
      "draftRange": 0.18,
      "strategyFit": 0.18,
      "boardValue": 0.1,
      "riskFit": 0.08
    },
    "notes": {
      "short": "Los Angeles Lakers: prioridade em rebounding e size, com estratégia win now support.",
      "draftStrategy": "Elevar o piso da rotação e cobrir lacunas em rebounding, size, defense, sem perder flexibilidade tática. Combinar fit e valor de board, priorizando rebounding, size, defense.",
      "caution": "Need Fit deve ponderar alto para rebounding e size; jogadores que não endereçam esses eixos não devem receber boost artificial. Role Fit deve considerar janela playoff_team e tolerância de risco low. Strategy Fit: win_now_support com prioridade editorial em defense; ajustar penalidades por pick range e prontidão."
    }
  },
  "MEM": {
    "teamId": "MEM",
    "teamName": "Memphis Grizzlies",
    "abbreviation": "MEM",
    "timeline": "rebuilding",
    "draftMode": "best-player",
    "riskTolerance": "high",
    "teamIdentity": {
      "summary": "ataque instável; defesa vulnerável. Núcleo estatístico: Ja Morant, Santi Aldama, Jaylen Wells.",
      "offensiveStyle": "ataque instável.",
      "defensiveStyle": "defesa vulnerável.",
      "rosterContext": "Núcleo estatístico: Ja Morant, Santi Aldama, Jaylen Wells."
    },
    "needs": {
      "primaryCreation": 20,
      "secondaryCreation": 20,
      "shooting": 75,
      "rimPressure": 20,
      "pointOfAttackDefense": 52,
      "wingDefense": 52,
      "rimProtection": 58,
      "rebounding": 76,
      "size": 74,
      "athleticism": 20,
      "benchScoring": 46
    },
    "draftPreferences": {
      "preferredArchetypes": [
        "Forward/big f?sico com presen?a de garraf?o"
      ],
      "avoidArchetypes": [
        "Arremessador limitado",
        "Liability defensivo",
        "Jogador baixo sem rebote"
      ],
      "prioritySkills": [
        "Rebounding",
        "Efficiency",
        "Size",
        "Rim Protection",
        "Defense",
        "Bench Scoring"
      ],
      "avoidSkills": [
        "Arremessador limitado",
        "Liability defensivo",
        "Jogador baixo sem rebote"
      ],
      "idealPickLogic": "Atacar BPA com upside real, principalmente se entregar rebounding, efficiency, size; tolerar risco quando houver caminho de estrela."
    },
    "algorithmWeights": {
      "needFit": 0.26,
      "roleFit": 0.2,
      "draftRange": 0.18,
      "strategyFit": 0.18,
      "boardValue": 0.1,
      "riskFit": 0.08
    },
    "notes": {
      "short": "Memphis Grizzlies: prioridade em rebounding e efficiency, com estratégia rebuild upside.",
      "draftStrategy": "Usar a pick para aumentar teto: rebounding, efficiency, size importam, mas o desempate deve ser upside e criação. Atacar BPA com upside real, principalmente se entregar rebounding, efficiency, size; tolerar risco quando houver caminho de estrela.",
      "caution": "Need Fit deve ponderar alto para rebounding e efficiency; jogadores que não endereçam esses eixos não devem receber boost artificial. Role Fit deve considerar janela not_competing e tolerância de risco high. Strategy Fit: rebuild_upside com prioridade editorial em creation; ajustar penalidades por pick range e prontidão."
    }
  },
  "MIA": {
    "teamId": "MIA",
    "teamName": "Miami Heat",
    "abbreviation": "MIA",
    "timeline": "playoff",
    "draftMode": "best-player",
    "riskTolerance": "medium",
    "teamIdentity": {
      "summary": "ataque funcional; defesa forte; ritmo alto; boa circulação; força nos rebotes. Núcleo estatístico: Bam Adebayo, Tyler Herro, Andrew Wiggins.",
      "offensiveStyle": "ataque funcional; ritmo alto; boa circulação.",
      "defensiveStyle": "defesa forte; força nos rebotes.",
      "rosterContext": "Núcleo estatístico: Bam Adebayo, Tyler Herro, Andrew Wiggins."
    },
    "needs": {
      "primaryCreation": 46,
      "secondaryCreation": 20,
      "shooting": 52,
      "rimPressure": 20,
      "pointOfAttackDefense": 20,
      "wingDefense": 20,
      "rimProtection": 58,
      "rebounding": 20,
      "size": 58,
      "athleticism": 20,
      "benchScoring": 20
    },
    "draftPreferences": {
      "preferredArchetypes": [
        "Arremessador escal?vel com gravidade",
        "Protetor de aro com tamanho funcional"
      ],
      "avoidArchetypes": [
        "Arremessador limitado",
        "Jogador baixo sem rebote",
        "Guard sem arremesso"
      ],
      "prioritySkills": [
        "Rim Protection",
        "Efficiency",
        "Shooting",
        "Size",
        "Spacing",
        "Primary Creation"
      ],
      "avoidSkills": [
        "Arremessador limitado",
        "Jogador baixo sem rebote",
        "Guard sem arremesso"
      ],
      "idealPickLogic": "Equilibrar valor de board e função clara; priorizar rim_protection, efficiency, shooting para acelerar o retool."
    },
    "algorithmWeights": {
      "needFit": 0.26,
      "roleFit": 0.2,
      "draftRange": 0.18,
      "strategyFit": 0.18,
      "boardValue": 0.1,
      "riskFit": 0.08
    },
    "notes": {
      "short": "Miami Heat: prioridade em rim protection e efficiency, com estratégia talent accumulation.",
      "draftStrategy": "Adicionar peça que mude a curva do núcleo: rim protection, efficiency, shooting, com prioridade para tradução em dois anos. Equilibrar valor de board e função clara; priorizar rim_protection, efficiency, shooting para acelerar o retool.",
      "caution": "Need Fit deve ponderar alto para rim_protection e efficiency; jogadores que não endereçam esses eixos não devem receber boost artificial. Role Fit deve considerar janela play_in_level e tolerância de risco medium. Strategy Fit: talent_accumulation com prioridade editorial em playmaking; ajustar penalidades por pick range e prontidão."
    }
  },
  "MIL": {
    "teamId": "MIL",
    "teamName": "Milwaukee Bucks",
    "abbreviation": "MIL",
    "timeline": "rebuilding",
    "draftMode": "best-player",
    "riskTolerance": "high",
    "teamIdentity": {
      "summary": "ataque instável; defesa vulnerável; alto volume de 3. Núcleo estatístico: Kevin Porter Jr., Ryan Rollins, AJ Green.",
      "offensiveStyle": "ataque instável; alto volume de 3.",
      "defensiveStyle": "defesa vulnerável.",
      "rosterContext": "Núcleo estatístico: Kevin Porter Jr., Ryan Rollins, AJ Green."
    },
    "needs": {
      "primaryCreation": 20,
      "secondaryCreation": 52,
      "shooting": 20,
      "rimPressure": 83,
      "pointOfAttackDefense": 20,
      "wingDefense": 46,
      "rimProtection": 20,
      "rebounding": 58,
      "size": 20,
      "athleticism": 82,
      "benchScoring": 90
    },
    "draftPreferences": {
      "preferredArchetypes": [
        "Atleta com press?o de aro e transi??o",
        "Pontuador de segunda unidade"
      ],
      "avoidArchetypes": [
        "Jogador baixo sem rebote",
        "Especialista de baixo upside",
        "Guard com turnovers altos"
      ],
      "prioritySkills": [
        "Bench Scoring",
        "Rim Pressure",
        "Athleticism",
        "Rebounding",
        "Ball Security",
        "Wing Defense"
      ],
      "avoidSkills": [
        "Jogador baixo sem rebote",
        "Especialista de baixo upside",
        "Guard com turnovers altos"
      ],
      "idealPickLogic": "Atacar BPA com upside real, principalmente se entregar bench_scoring, rim_pressure, athleticism; tolerar risco quando houver caminho de estrela."
    },
    "algorithmWeights": {
      "needFit": 0.26,
      "roleFit": 0.2,
      "draftRange": 0.18,
      "strategyFit": 0.18,
      "boardValue": 0.1,
      "riskFit": 0.08
    },
    "notes": {
      "short": "Milwaukee Bucks: prioridade em bench scoring e rim pressure, com estratégia rebuild upside.",
      "draftStrategy": "Usar a pick para aumentar teto: bench scoring, rim pressure, athleticism importam, mas o desempate deve ser upside e criação. Atacar BPA com upside real, principalmente se entregar bench_scoring, rim_pressure, athleticism; tolerar risco quando houver caminho de estrela.",
      "caution": "Need Fit deve ponderar alto para bench_scoring e rim_pressure; jogadores que não endereçam esses eixos não devem receber boost artificial. Role Fit deve considerar janela not_competing e tolerância de risco high. Strategy Fit: rebuild_upside com prioridade editorial em creation; ajustar penalidades por pick range e prontidão."
    }
  },
  "MIN": {
    "teamId": "MIN",
    "teamName": "Minnesota Timberwolves",
    "abbreviation": "MIN",
    "timeline": "playoff",
    "draftMode": "safe-pick",
    "riskTolerance": "medium",
    "teamIdentity": {
      "summary": "ataque funcional; defesa média. Núcleo estatístico: Anthony Edwards, Julius Randle, Jaden McDaniels.",
      "offensiveStyle": "ataque funcional.",
      "defensiveStyle": "defesa média.",
      "rosterContext": "Núcleo estatístico: Anthony Edwards, Julius Randle, Jaden McDaniels."
    },
    "needs": {
      "primaryCreation": 20,
      "secondaryCreation": 59,
      "shooting": 20,
      "rimPressure": 52,
      "pointOfAttackDefense": 52,
      "wingDefense": 46,
      "rimProtection": 20,
      "rebounding": 58,
      "size": 20,
      "athleticism": 20,
      "benchScoring": 20
    },
    "draftPreferences": {
      "preferredArchetypes": [
        "Conector ofensivo com passe e decis?o",
        "Atleta com press?o de aro e transi??o"
      ],
      "avoidArchetypes": [
        "Liability defensivo",
        "Criador com baixa leitura",
        "Jogador baixo sem rebote"
      ],
      "prioritySkills": [
        "Ball Security",
        "Rim Pressure",
        "Playmaking",
        "Rebounding",
        "Point Of Attack Defense",
        "Wing Defense"
      ],
      "avoidSkills": [
        "Liability defensivo",
        "Criador com baixa leitura",
        "Jogador baixo sem rebote"
      ],
      "idealPickLogic": "Combinar fit e valor de board, priorizando ball_security, rim_pressure, playmaking."
    },
    "algorithmWeights": {
      "needFit": 0.26,
      "roleFit": 0.2,
      "draftRange": 0.18,
      "strategyFit": 0.18,
      "boardValue": 0.1,
      "riskFit": 0.08
    },
    "notes": {
      "short": "Minnesota Timberwolves: prioridade em ball security e rim pressure, com estratégia floor fit.",
      "draftStrategy": "Elevar o piso da rotação e cobrir lacunas em ball security, rim pressure, playmaking, sem perder flexibilidade tática. Combinar fit e valor de board, priorizando ball_security, rim_pressure, playmaking.",
      "caution": "Need Fit deve ponderar alto para ball_security e rim_pressure; jogadores que não endereçam esses eixos não devem receber boost artificial. Role Fit deve considerar janela playoff_team e tolerância de risco medium. Strategy Fit: floor_fit com prioridade editorial em playmaking; ajustar penalidades por pick range e prontidão."
    }
  },
  "NOP": {
    "teamId": "NOP",
    "teamName": "New Orleans Pelicans",
    "abbreviation": "NOP",
    "timeline": "ascending",
    "draftMode": "best-player",
    "riskTolerance": "high",
    "teamIdentity": {
      "summary": "ataque instável; defesa vulnerável. Núcleo estatístico: Trey Murphy III, Saddiq Bey, Zion Williamson.",
      "offensiveStyle": "ataque instável.",
      "defensiveStyle": "defesa vulnerável.",
      "rosterContext": "Núcleo estatístico: Trey Murphy III, Saddiq Bey, Zion Williamson."
    },
    "needs": {
      "primaryCreation": 20,
      "secondaryCreation": 52,
      "shooting": 85,
      "rimPressure": 20,
      "pointOfAttackDefense": 58,
      "wingDefense": 58,
      "rimProtection": 46,
      "rebounding": 20,
      "size": 20,
      "athleticism": 20,
      "benchScoring": 20
    },
    "draftPreferences": {
      "preferredArchetypes": [
        "Arremessador escal?vel com gravidade"
      ],
      "avoidArchetypes": [
        "Arremessador limitado",
        "Liability defensivo",
        "Criador com baixa leitura"
      ],
      "prioritySkills": [
        "Spacing",
        "Shooting",
        "Efficiency",
        "Defense",
        "Playmaking",
        "Rim Protection"
      ],
      "avoidSkills": [
        "Arremessador limitado",
        "Liability defensivo",
        "Criador com baixa leitura"
      ],
      "idealPickLogic": "Atacar BPA com upside real, principalmente se entregar spacing, shooting, efficiency; tolerar risco quando houver caminho de estrela."
    },
    "algorithmWeights": {
      "needFit": 0.26,
      "roleFit": 0.2,
      "draftRange": 0.18,
      "strategyFit": 0.18,
      "boardValue": 0.1,
      "riskFit": 0.08
    },
    "notes": {
      "short": "New Orleans Pelicans: prioridade em spacing e shooting, com estratégia talent accumulation.",
      "draftStrategy": "Usar a pick para aumentar teto: spacing, shooting, efficiency importam, mas o desempate deve ser upside e criação. Atacar BPA com upside real, principalmente se entregar spacing, shooting, efficiency; tolerar risco quando houver caminho de estrela.",
      "caution": "Need Fit deve ponderar alto para spacing e shooting; jogadores que não endereçam esses eixos não devem receber boost artificial. Role Fit deve considerar janela not_competing e tolerância de risco high. Strategy Fit: talent_accumulation com prioridade editorial em versatility; ajustar penalidades por pick range e prontidão."
    }
  },
  "NYK": {
    "teamId": "NYK",
    "teamName": "New York Knicks",
    "abbreviation": "NYK",
    "timeline": "playoff",
    "draftMode": "safe-pick",
    "riskTolerance": "medium",
    "teamIdentity": {
      "summary": "ataque de elite; defesa forte; força nos rebotes. Núcleo estatístico: Jalen Brunson, OG Anunoby, Mikal Bridges.",
      "offensiveStyle": "ataque de elite.",
      "defensiveStyle": "defesa forte; força nos rebotes.",
      "rosterContext": "Núcleo estatístico: Jalen Brunson, OG Anunoby, Mikal Bridges."
    },
    "needs": {
      "primaryCreation": 20,
      "secondaryCreation": 52,
      "shooting": 20,
      "rimPressure": 55,
      "pointOfAttackDefense": 42,
      "wingDefense": 58,
      "rimProtection": 20,
      "rebounding": 20,
      "size": 20,
      "athleticism": 54,
      "benchScoring": 20
    },
    "draftPreferences": {
      "preferredArchetypes": [
        "Defensor de per?metro com versatilidade",
        "Atleta com press?o de aro e transi??o"
      ],
      "avoidArchetypes": [
        "Liability defensivo",
        "Criador com baixa leitura",
        "Projeto cru sem minutos imediatos"
      ],
      "prioritySkills": [
        "Rim Pressure",
        "Athleticism",
        "Point Of Attack Defense",
        "Wing Defense",
        "Secondary Creation",
        "Playmaking"
      ],
      "avoidSkills": [
        "Liability defensivo",
        "Criador com baixa leitura",
        "Projeto cru sem minutos imediatos"
      ],
      "idealPickLogic": "Combinar fit e valor de board, priorizando rim_pressure, athleticism, point_of_attack_defense."
    },
    "algorithmWeights": {
      "needFit": 0.26,
      "roleFit": 0.2,
      "draftRange": 0.18,
      "strategyFit": 0.18,
      "boardValue": 0.1,
      "riskFit": 0.08
    },
    "notes": {
      "short": "New York Knicks: prioridade em rim pressure e athleticism, com estratégia win now support.",
      "draftStrategy": "Elevar o piso da rotação e cobrir lacunas em rim pressure, athleticism, point of attack defense, sem perder flexibilidade tática. Combinar fit e valor de board, priorizando rim_pressure, athleticism, point_of_attack_defense.",
      "caution": "Need Fit deve ponderar alto para rim_pressure e athleticism; jogadores que não endereçam esses eixos não devem receber boost artificial. Role Fit deve considerar janela playoff_team e tolerância de risco medium. Strategy Fit: win_now_support com prioridade editorial em efficiency; ajustar penalidades por pick range e prontidão."
    }
  },
  "OKC": {
    "teamId": "OKC",
    "teamName": "Oklahoma City Thunder",
    "abbreviation": "OKC",
    "timeline": "contender",
    "draftMode": "safe-pick",
    "riskTolerance": "medium",
    "teamIdentity": {
      "summary": "ataque de elite; defesa forte. Núcleo estatístico: Shai Gilgeous-Alexander, Chet Holmgren, Jalen Williams.",
      "offensiveStyle": "ataque de elite.",
      "defensiveStyle": "defesa forte.",
      "rosterContext": "Núcleo estatístico: Shai Gilgeous-Alexander, Chet Holmgren, Jalen Williams."
    },
    "needs": {
      "primaryCreation": 20,
      "secondaryCreation": 46,
      "shooting": 58,
      "rimPressure": 41,
      "pointOfAttackDefense": 20,
      "wingDefense": 20,
      "rimProtection": 20,
      "rebounding": 47,
      "size": 20,
      "athleticism": 43,
      "benchScoring": 20
    },
    "draftPreferences": {
      "preferredArchetypes": [
        "Atleta com press?o de aro e transi??o",
        "Forward/big f?sico com presen?a de garraf?o"
      ],
      "avoidArchetypes": [
        "Arremessador limitado",
        "Jogador baixo sem rebote",
        "Projeto cru sem minutos imediatos"
      ],
      "prioritySkills": [
        "Rebounding",
        "Athleticism",
        "Rim Pressure",
        "Spacing",
        "Shooting",
        "Playmaking"
      ],
      "avoidSkills": [
        "Arremessador limitado",
        "Jogador baixo sem rebote",
        "Projeto cru sem minutos imediatos"
      ],
      "idealPickLogic": "Priorizar jogador pronto, baixo erro e função imediata em rebounding, athleticism, rim_pressure; evitar apostas que não entrem em playoff rotation."
    },
    "algorithmWeights": {
      "needFit": 0.26,
      "roleFit": 0.2,
      "draftRange": 0.18,
      "strategyFit": 0.18,
      "boardValue": 0.1,
      "riskFit": 0.08
    },
    "notes": {
      "short": "Oklahoma City Thunder: prioridade em rebounding e athleticism, com estratégia floor fit.",
      "draftStrategy": "Draftar para playoff utility: rebounding, athleticism, rim pressure, com tomada de decisão rápida e impacto sem uso alto. Priorizar jogador pronto, baixo erro e função imediata em rebounding, athleticism, rim_pressure; evitar apostas que não entrem em playoff rotation.",
      "caution": "Need Fit deve ponderar alto para rebounding e athleticism; jogadores que não endereçam esses eixos não devem receber boost artificial. Role Fit deve considerar janela contender e tolerância de risco medium. Strategy Fit: floor_fit com prioridade editorial em spacing; ajustar penalidades por pick range e prontidão."
    }
  },
  "ORL": {
    "teamId": "ORL",
    "teamName": "Orlando Magic",
    "abbreviation": "ORL",
    "timeline": "playoff",
    "draftMode": "safe-pick",
    "riskTolerance": "low",
    "teamIdentity": {
      "summary": "ataque funcional; defesa média. Núcleo estatístico: Paolo Banchero, Desmond Bane, Franz Wagner.",
      "offensiveStyle": "ataque funcional.",
      "defensiveStyle": "defesa média.",
      "rosterContext": "Núcleo estatístico: Paolo Banchero, Desmond Bane, Franz Wagner."
    },
    "needs": {
      "primaryCreation": 52,
      "secondaryCreation": 20,
      "shooting": 83,
      "rimPressure": 20,
      "pointOfAttackDefense": 20,
      "wingDefense": 20,
      "rimProtection": 58,
      "rebounding": 20,
      "size": 46,
      "athleticism": 20,
      "benchScoring": 20
    },
    "draftPreferences": {
      "preferredArchetypes": [
        "Arremessador escal?vel com gravidade"
      ],
      "avoidArchetypes": [
        "Arremessador limitado",
        "Criador com baixa leitura",
        "Jogador baixo sem rebote"
      ],
      "prioritySkills": [
        "Shooting",
        "Efficiency",
        "Spacing",
        "Rim Protection",
        "Primary Creation",
        "Size"
      ],
      "avoidSkills": [
        "Arremessador limitado",
        "Criador com baixa leitura",
        "Jogador baixo sem rebote"
      ],
      "idealPickLogic": "Combinar fit e valor de board, priorizando shooting, efficiency, spacing."
    },
    "algorithmWeights": {
      "needFit": 0.26,
      "roleFit": 0.2,
      "draftRange": 0.18,
      "strategyFit": 0.18,
      "boardValue": 0.1,
      "riskFit": 0.08
    },
    "notes": {
      "short": "Orlando Magic: prioridade em shooting e efficiency, com estratégia floor fit.",
      "draftStrategy": "Elevar o piso da rotação e cobrir lacunas em shooting, efficiency, spacing, sem perder flexibilidade tática. Combinar fit e valor de board, priorizando shooting, efficiency, spacing.",
      "caution": "Need Fit deve ponderar alto para shooting e efficiency; jogadores que não endereçam esses eixos não devem receber boost artificial. Role Fit deve considerar janela playoff_team e tolerância de risco low. Strategy Fit: floor_fit com prioridade editorial em shooting; ajustar penalidades por pick range e prontidão."
    }
  },
  "PHI": {
    "teamId": "PHI",
    "teamName": "Philadelphia 76ers",
    "abbreviation": "PHI",
    "timeline": "playoff",
    "draftMode": "best-player",
    "riskTolerance": "high",
    "teamIdentity": {
      "summary": "ataque instável; defesa vulnerável. Núcleo estatístico: Tyrese Maxey, VJ Edgecombe, Joel Embiid.",
      "offensiveStyle": "ataque instável.",
      "defensiveStyle": "defesa vulnerável.",
      "rosterContext": "Núcleo estatístico: Tyrese Maxey, VJ Edgecombe, Joel Embiid."
    },
    "needs": {
      "primaryCreation": 20,
      "secondaryCreation": 58,
      "shooting": 83,
      "rimPressure": 20,
      "pointOfAttackDefense": 20,
      "wingDefense": 20,
      "rimProtection": 20,
      "rebounding": 46,
      "size": 20,
      "athleticism": 20,
      "benchScoring": 20
    },
    "draftPreferences": {
      "preferredArchetypes": [
        "Arremessador escal?vel com gravidade"
      ],
      "avoidArchetypes": [
        "Arremessador limitado",
        "Criador com baixa leitura",
        "Projeto cru sem minutos imediatos"
      ],
      "prioritySkills": [
        "Efficiency",
        "Spacing",
        "Shooting",
        "Secondary Creation",
        "Playmaking",
        "Rebounding"
      ],
      "avoidSkills": [
        "Arremessador limitado",
        "Criador com baixa leitura",
        "Projeto cru sem minutos imediatos"
      ],
      "idealPickLogic": "Combinar fit e valor de board, priorizando efficiency, spacing, shooting."
    },
    "algorithmWeights": {
      "needFit": 0.26,
      "roleFit": 0.2,
      "draftRange": 0.18,
      "strategyFit": 0.18,
      "boardValue": 0.1,
      "riskFit": 0.08
    },
    "notes": {
      "short": "Philadelphia 76ers: prioridade em efficiency e spacing, com estratégia talent accumulation.",
      "draftStrategy": "Elevar o piso da rotação e cobrir lacunas em efficiency, spacing, shooting, sem perder flexibilidade tática. Combinar fit e valor de board, priorizando efficiency, spacing, shooting.",
      "caution": "Need Fit deve ponderar alto para efficiency e spacing; jogadores que não endereçam esses eixos não devem receber boost artificial. Role Fit deve considerar janela playoff_team e tolerância de risco high. Strategy Fit: talent_accumulation com prioridade editorial em versatility; ajustar penalidades por pick range e prontidão."
    }
  },
  "PHX": {
    "teamId": "PHX",
    "teamName": "Phoenix Suns",
    "abbreviation": "PHX",
    "timeline": "playoff",
    "draftMode": "best-player",
    "riskTolerance": "high",
    "teamIdentity": {
      "summary": "ataque instável; defesa média; ritmo controlado; alto volume de 3. Núcleo estatístico: Devin Booker, Dillon Brooks, Grayson Allen.",
      "offensiveStyle": "ataque instável; ritmo controlado; alto volume de 3.",
      "defensiveStyle": "defesa média.",
      "rosterContext": "Núcleo estatístico: Devin Booker, Dillon Brooks, Grayson Allen."
    },
    "needs": {
      "primaryCreation": 20,
      "secondaryCreation": 72,
      "shooting": 52,
      "rimPressure": 82,
      "pointOfAttackDefense": 20,
      "wingDefense": 20,
      "rimProtection": 20,
      "rebounding": 46,
      "size": 20,
      "athleticism": 20,
      "benchScoring": 75
    },
    "draftPreferences": {
      "preferredArchetypes": [
        "Conector ofensivo com passe e decis?o",
        "Atleta com press?o de aro e transi??o",
        "Pontuador de segunda unidade"
      ],
      "avoidArchetypes": [
        "Arremessador limitado",
        "Criador com baixa leitura",
        "Guard sem arremesso"
      ],
      "prioritySkills": [
        "Rim Pressure",
        "Bench Scoring",
        "Secondary Creation",
        "Playmaking",
        "Efficiency",
        "Rebounding"
      ],
      "avoidSkills": [
        "Arremessador limitado",
        "Criador com baixa leitura",
        "Guard sem arremesso"
      ],
      "idealPickLogic": "Equilibrar valor de board e função clara; priorizar rim_pressure, bench_scoring, secondary_creation para acelerar o retool."
    },
    "algorithmWeights": {
      "needFit": 0.26,
      "roleFit": 0.2,
      "draftRange": 0.18,
      "strategyFit": 0.18,
      "boardValue": 0.1,
      "riskFit": 0.08
    },
    "notes": {
      "short": "Phoenix Suns: prioridade em rim pressure e bench scoring, com estratégia talent accumulation.",
      "draftStrategy": "Adicionar peça que mude a curva do núcleo: rim pressure, bench scoring, secondary creation, com prioridade para tradução em dois anos. Equilibrar valor de board e função clara; priorizar rim_pressure, bench_scoring, secondary_creation para acelerar o retool.",
      "caution": "Need Fit deve ponderar alto para rim_pressure e bench_scoring; jogadores que não endereçam esses eixos não devem receber boost artificial. Role Fit deve considerar janela play_in_level e tolerância de risco high. Strategy Fit: talent_accumulation com prioridade editorial em playmaking; ajustar penalidades por pick range e prontidão."
    }
  },
  "POR": {
    "teamId": "POR",
    "teamName": "Portland Trail Blazers",
    "abbreviation": "POR",
    "timeline": "playoff",
    "draftMode": "best-player",
    "riskTolerance": "medium",
    "teamIdentity": {
      "summary": "ataque instável; defesa vulnerável; alto volume de 3; força nos rebotes. Núcleo estatístico: Deni Avdija, Toumani Camara, Jerami Grant.",
      "offensiveStyle": "ataque instável; alto volume de 3.",
      "defensiveStyle": "defesa vulnerável; força nos rebotes.",
      "rosterContext": "Núcleo estatístico: Deni Avdija, Toumani Camara, Jerami Grant."
    },
    "needs": {
      "primaryCreation": 58,
      "secondaryCreation": 100,
      "shooting": 85,
      "rimPressure": 20,
      "pointOfAttackDefense": 20,
      "wingDefense": 20,
      "rimProtection": 20,
      "rebounding": 20,
      "size": 20,
      "athleticism": 20,
      "benchScoring": 46
    },
    "draftPreferences": {
      "preferredArchetypes": [
        "Conector ofensivo com passe e decis?o"
      ],
      "avoidArchetypes": [
        "Arremessador limitado",
        "Criador com baixa leitura",
        "Guard com turnovers altos"
      ],
      "prioritySkills": [
        "Ball Security",
        "Playmaking",
        "Efficiency",
        "Primary Creation",
        "Secondary Creation",
        "Bench Scoring"
      ],
      "avoidSkills": [
        "Arremessador limitado",
        "Criador com baixa leitura",
        "Guard com turnovers altos"
      ],
      "idealPickLogic": "Buscar talento que cresça com o núcleo e resolva ball_security, playmaking, efficiency, sem sacrificar teto por encaixe curto."
    },
    "algorithmWeights": {
      "needFit": 0.26,
      "roleFit": 0.2,
      "draftRange": 0.18,
      "strategyFit": 0.18,
      "boardValue": 0.1,
      "riskFit": 0.08
    },
    "notes": {
      "short": "Portland Trail Blazers: prioridade em ball security e playmaking, com estratégia talent accumulation.",
      "draftStrategy": "Adicionar peça que mude a curva do núcleo: ball security, playmaking, efficiency, com prioridade para tradução em dois anos. Buscar talento que cresça com o núcleo e resolva ball_security, playmaking, efficiency, sem sacrificar teto por encaixe curto.",
      "caution": "Need Fit deve ponderar alto para ball_security e playmaking; jogadores que não endereçam esses eixos não devem receber boost artificial. Role Fit deve considerar janela play_in_level e tolerância de risco medium. Strategy Fit: talent_accumulation com prioridade editorial em creation; ajustar penalidades por pick range e prontidão."
    }
  },
  "SAC": {
    "teamId": "SAC",
    "teamName": "Sacramento Kings",
    "abbreviation": "SAC",
    "timeline": "rebuilding",
    "draftMode": "best-player",
    "riskTolerance": "high",
    "teamIdentity": {
      "summary": "ataque instável; defesa vulnerável. Núcleo estatístico: Keegan Murray, Zach LaVine, DeMar DeRozan.",
      "offensiveStyle": "ataque instável.",
      "defensiveStyle": "defesa vulnerável.",
      "rosterContext": "Núcleo estatístico: Keegan Murray, Zach LaVine, DeMar DeRozan."
    },
    "needs": {
      "primaryCreation": 46,
      "secondaryCreation": 20,
      "shooting": 96,
      "rimPressure": 20,
      "pointOfAttackDefense": 89,
      "wingDefense": 89,
      "rimProtection": 20,
      "rebounding": 20,
      "size": 20,
      "athleticism": 20,
      "benchScoring": 52
    },
    "draftPreferences": {
      "preferredArchetypes": [
        "Arremessador escal?vel com gravidade",
        "Defensor de per?metro com versatilidade"
      ],
      "avoidArchetypes": [
        "Arremessador limitado",
        "Liability defensivo",
        "Especialista de baixo upside"
      ],
      "prioritySkills": [
        "Shooting",
        "Spacing",
        "Defense",
        "Efficiency",
        "Bench Scoring",
        "Primary Creation"
      ],
      "avoidSkills": [
        "Arremessador limitado",
        "Liability defensivo",
        "Especialista de baixo upside"
      ],
      "idealPickLogic": "Atacar BPA com upside real, principalmente se entregar shooting, spacing, defense; tolerar risco quando houver caminho de estrela."
    },
    "algorithmWeights": {
      "needFit": 0.26,
      "roleFit": 0.2,
      "draftRange": 0.18,
      "strategyFit": 0.18,
      "boardValue": 0.1,
      "riskFit": 0.08
    },
    "notes": {
      "short": "Sacramento Kings: prioridade em shooting e spacing, com estratégia rebuild upside.",
      "draftStrategy": "Usar a pick para aumentar teto: shooting, spacing, defense importam, mas o desempate deve ser upside e criação. Atacar BPA com upside real, principalmente se entregar shooting, spacing, defense; tolerar risco quando houver caminho de estrela.",
      "caution": "Need Fit deve ponderar alto para shooting e spacing; jogadores que não endereçam esses eixos não devem receber boost artificial. Role Fit deve considerar janela not_competing e tolerância de risco high. Strategy Fit: rebuild_upside com prioridade editorial em creation; ajustar penalidades por pick range e prontidão."
    }
  },
  "SAS": {
    "teamId": "SAS",
    "teamName": "San Antonio Spurs",
    "abbreviation": "SAS",
    "timeline": "contender",
    "draftMode": "safe-pick",
    "riskTolerance": "medium",
    "teamIdentity": {
      "summary": "ataque de elite; defesa forte; força nos rebotes. Núcleo estatístico: De'Aaron Fox, Devin Vassell, Stephon Castle.",
      "offensiveStyle": "ataque de elite.",
      "defensiveStyle": "defesa forte; força nos rebotes.",
      "rosterContext": "Núcleo estatístico: De'Aaron Fox, Devin Vassell, Stephon Castle."
    },
    "needs": {
      "primaryCreation": 52,
      "secondaryCreation": 20,
      "shooting": 58,
      "rimPressure": 46,
      "pointOfAttackDefense": 54,
      "wingDefense": 20,
      "rimProtection": 20,
      "rebounding": 20,
      "size": 20,
      "athleticism": 40,
      "benchScoring": 20
    },
    "draftPreferences": {
      "preferredArchetypes": [
        "Arremessador escal?vel com gravidade",
        "Defensor de per?metro com versatilidade",
        "Atleta com press?o de aro e transi??o"
      ],
      "avoidArchetypes": [
        "Arremessador limitado",
        "Liability defensivo",
        "Criador com baixa leitura"
      ],
      "prioritySkills": [
        "Point Of Attack Defense",
        "Shooting",
        "Athleticism",
        "Spacing",
        "Primary Creation",
        "Rim Pressure"
      ],
      "avoidSkills": [
        "Arremessador limitado",
        "Liability defensivo",
        "Criador com baixa leitura"
      ],
      "idealPickLogic": "Priorizar jogador pronto, baixo erro e função imediata em point_of_attack_defense, shooting, athleticism; evitar apostas que não entrem em playoff rotation."
    },
    "algorithmWeights": {
      "needFit": 0.26,
      "roleFit": 0.2,
      "draftRange": 0.18,
      "strategyFit": 0.18,
      "boardValue": 0.1,
      "riskFit": 0.08
    },
    "notes": {
      "short": "San Antonio Spurs: prioridade em point of attack defense e shooting, com estratégia positional need.",
      "draftStrategy": "Draftar para playoff utility: point of attack defense, shooting, athleticism, com tomada de decisão rápida e impacto sem uso alto. Priorizar jogador pronto, baixo erro e função imediata em point_of_attack_defense, shooting, athleticism; evitar apostas que não entrem em playoff rotation.",
      "caution": "Need Fit deve ponderar alto para point_of_attack_defense e shooting; jogadores que não endereçam esses eixos não devem receber boost artificial. Role Fit deve considerar janela contender e tolerância de risco medium. Strategy Fit: positional_need com prioridade editorial em spacing; ajustar penalidades por pick range e prontidão."
    }
  },
  "TOR": {
    "teamId": "TOR",
    "teamName": "Toronto Raptors",
    "abbreviation": "TOR",
    "timeline": "playoff",
    "draftMode": "best-player",
    "riskTolerance": "medium",
    "teamIdentity": {
      "summary": "ataque instável; defesa forte; boa circulação. Núcleo estatístico: Brandon Ingram, Scottie Barnes, Immanuel Quickley.",
      "offensiveStyle": "ataque instável; boa circulação.",
      "defensiveStyle": "defesa forte.",
      "rosterContext": "Núcleo estatístico: Brandon Ingram, Scottie Barnes, Immanuel Quickley."
    },
    "needs": {
      "primaryCreation": 58,
      "secondaryCreation": 20,
      "shooting": 81,
      "rimPressure": 20,
      "pointOfAttackDefense": 20,
      "wingDefense": 20,
      "rimProtection": 20,
      "rebounding": 68,
      "size": 46,
      "athleticism": 20,
      "benchScoring": 52
    },
    "draftPreferences": {
      "preferredArchetypes": [
        "Arremessador escal?vel com gravidade",
        "Forward/big f?sico com presen?a de garraf?o"
      ],
      "avoidArchetypes": [
        "Arremessador limitado",
        "Criador com baixa leitura",
        "Jogador baixo sem rebote"
      ],
      "prioritySkills": [
        "Spacing",
        "Shooting",
        "Rebounding",
        "Primary Creation",
        "Bench Scoring",
        "Size"
      ],
      "avoidSkills": [
        "Arremessador limitado",
        "Criador com baixa leitura",
        "Jogador baixo sem rebote"
      ],
      "idealPickLogic": "Combinar fit e valor de board, priorizando spacing, shooting, rebounding."
    },
    "algorithmWeights": {
      "needFit": 0.26,
      "roleFit": 0.2,
      "draftRange": 0.18,
      "strategyFit": 0.18,
      "boardValue": 0.1,
      "riskFit": 0.08
    },
    "notes": {
      "short": "Toronto Raptors: prioridade em spacing e shooting, com estratégia talent accumulation.",
      "draftStrategy": "Elevar o piso da rotação e cobrir lacunas em spacing, shooting, rebounding, sem perder flexibilidade tática. Combinar fit e valor de board, priorizando spacing, shooting, rebounding.",
      "caution": "Need Fit deve ponderar alto para spacing e shooting; jogadores que não endereçam esses eixos não devem receber boost artificial. Role Fit deve considerar janela playoff_team e tolerância de risco medium. Strategy Fit: talent_accumulation com prioridade editorial em shooting; ajustar penalidades por pick range e prontidão."
    }
  },
  "UTA": {
    "teamId": "UTA",
    "teamName": "Utah Jazz",
    "abbreviation": "UTA",
    "timeline": "playoff",
    "draftMode": "best-player",
    "riskTolerance": "medium",
    "teamIdentity": {
      "summary": "ataque instável; defesa vulnerável; ritmo alto; boa circulação. Núcleo estatístico: Lauri Markkanen, Keyonte George, Bez Mbeng.",
      "offensiveStyle": "ataque instável; ritmo alto; boa circulação.",
      "defensiveStyle": "defesa vulnerável.",
      "rosterContext": "Núcleo estatístico: Lauri Markkanen, Keyonte George, Bez Mbeng."
    },
    "needs": {
      "primaryCreation": 20,
      "secondaryCreation": 83,
      "shooting": 20,
      "rimPressure": 20,
      "pointOfAttackDefense": 91,
      "wingDefense": 91,
      "rimProtection": 83,
      "rebounding": 20,
      "size": 46,
      "athleticism": 20,
      "benchScoring": 20
    },
    "draftPreferences": {
      "preferredArchetypes": [
        "Protetor de aro com tamanho funcional",
        "Defensor de per?metro com versatilidade"
      ],
      "avoidArchetypes": [
        "Liability defensivo",
        "Jogador baixo sem rebote",
        "Guard com turnovers altos"
      ],
      "prioritySkills": [
        "Defense",
        "Ball Security",
        "Rim Protection",
        "Wing Defense",
        "Point Of Attack Defense",
        "Switchability"
      ],
      "avoidSkills": [
        "Liability defensivo",
        "Jogador baixo sem rebote",
        "Guard com turnovers altos"
      ],
      "idealPickLogic": "Buscar talento que cresça com o núcleo e resolva defense, ball_security, rim_protection, sem sacrificar teto por encaixe curto."
    },
    "algorithmWeights": {
      "needFit": 0.26,
      "roleFit": 0.2,
      "draftRange": 0.18,
      "strategyFit": 0.18,
      "boardValue": 0.1,
      "riskFit": 0.08
    },
    "notes": {
      "short": "Utah Jazz: prioridade em defense e ball security, com estratégia talent accumulation.",
      "draftStrategy": "Adicionar peça que mude a curva do núcleo: defense, ball security, rim protection, com prioridade para tradução em dois anos. Buscar talento que cresça com o núcleo e resolva defense, ball_security, rim_protection, sem sacrificar teto por encaixe curto.",
      "caution": "Need Fit deve ponderar alto para defense e ball_security; jogadores que não endereçam esses eixos não devem receber boost artificial. Role Fit deve considerar janela play_in_level e tolerância de risco medium. Strategy Fit: talent_accumulation com prioridade editorial em versatility; ajustar penalidades por pick range e prontidão."
    }
  },
  "WAS": {
    "teamId": "WAS",
    "teamName": "Washington Wizards",
    "abbreviation": "WAS",
    "timeline": "playoff",
    "draftMode": "best-player",
    "riskTolerance": "medium",
    "teamIdentity": {
      "summary": "ataque instável; defesa vulnerável. Núcleo estatístico: Anthony Davis, Kyshawn George, Leaky Black.",
      "offensiveStyle": "ataque instável.",
      "defensiveStyle": "defesa vulnerável.",
      "rosterContext": "Núcleo estatístico: Anthony Davis, Kyshawn George, Leaky Black."
    },
    "needs": {
      "primaryCreation": 20,
      "secondaryCreation": 87,
      "shooting": 20,
      "rimPressure": 20,
      "pointOfAttackDefense": 93,
      "wingDefense": 93,
      "rimProtection": 20,
      "rebounding": 58,
      "size": 52,
      "athleticism": 20,
      "benchScoring": 20
    },
    "draftPreferences": {
      "preferredArchetypes": [
        "Defensor de per?metro com versatilidade"
      ],
      "avoidArchetypes": [
        "Liability defensivo",
        "Jogador baixo sem rebote",
        "Guard com turnovers altos"
      ],
      "prioritySkills": [
        "Defense",
        "Ball Security",
        "Wing Defense",
        "Rebounding",
        "Size",
        "Switchability"
      ],
      "avoidSkills": [
        "Liability defensivo",
        "Jogador baixo sem rebote",
        "Guard com turnovers altos"
      ],
      "idealPickLogic": "Buscar talento que cresça com o núcleo e resolva defense, ball_security, wing_defense, sem sacrificar teto por encaixe curto."
    },
    "algorithmWeights": {
      "needFit": 0.26,
      "roleFit": 0.2,
      "draftRange": 0.18,
      "strategyFit": 0.18,
      "boardValue": 0.1,
      "riskFit": 0.08
    },
    "notes": {
      "short": "Washington Wizards: prioridade em defense e ball security, com estratégia talent accumulation.",
      "draftStrategy": "Adicionar peça que mude a curva do núcleo: defense, ball security, wing defense, com prioridade para tradução em dois anos. Buscar talento que cresça com o núcleo e resolva defense, ball_security, wing_defense, sem sacrificar teto por encaixe curto.",
      "caution": "Need Fit deve ponderar alto para defense e ball_security; jogadores que não endereçam esses eixos não devem receber boost artificial. Role Fit deve considerar janela play_in_level e tolerância de risco medium. Strategy Fit: talent_accumulation com prioridade editorial em creation; ajustar penalidades por pick range e prontidão."
    }
  }
};

export type TeamDraftIntelligenceValidationIssue = {
  teamId: string;
  field: string;
  message: string;
};

export function validateTeamDraftIntelligence(
  data: Record<string, TeamDraftIntelligence> = teamDraftIntelligence,
): TeamDraftIntelligenceValidationIssue[] {
  const issues: TeamDraftIntelligenceValidationIssue[] = [];

  Object.values(data).forEach((team) => {
    if (!team.abbreviation) {
      issues.push({ teamId: team.teamId, field: 'abbreviation', message: 'Missing abbreviation.' });
    }

    Object.entries(team.needs).forEach(([field, value]) => {
      if (typeof value !== 'number' || value < 0 || value > 100) {
        issues.push({ teamId: team.teamId, field: `needs.${field}`, message: 'Need value must be between 0 and 100.' });
      }
    });

    const weightSum = Object.values(team.algorithmWeights).reduce((sum, value) => sum + value, 0);
    if (Math.abs(weightSum - 1) > 0.01) {
      issues.push({ teamId: team.teamId, field: 'algorithmWeights', message: `Weights should sum close to 1. Current sum: ${weightSum.toFixed(2)}.` });
    }

    const requiredStrings = [
      ['teamName', team.teamName],
      ['teamIdentity.summary', team.teamIdentity.summary],
      ['teamIdentity.offensiveStyle', team.teamIdentity.offensiveStyle],
      ['teamIdentity.defensiveStyle', team.teamIdentity.defensiveStyle],
      ['teamIdentity.rosterContext', team.teamIdentity.rosterContext],
      ['draftPreferences.idealPickLogic', team.draftPreferences.idealPickLogic],
      ['notes.short', team.notes.short],
      ['notes.draftStrategy', team.notes.draftStrategy],
      ['notes.caution', team.notes.caution],
    ];

    requiredStrings.forEach(([field, value]) => {
      if (!value || String(value).trim().length === 0) {
        issues.push({ teamId: team.teamId, field, message: 'Required text field is empty.' });
      }
    });
  });

  if (Object.keys(data).length !== 30) {
    issues.push({ teamId: 'ALL', field: 'teamDraftIntelligence', message: `Expected 30 teams, found ${Object.keys(data).length}.` });
  }

  return issues;
}

const validationIssues = validateTeamDraftIntelligence();

if (validationIssues.length > 0) {
  throw new Error(`Invalid teamDraftIntelligence data: ${validationIssues.map((issue) => `${issue.teamId} ${issue.field}: ${issue.message}`).join(' | ')}`);
}

export function getTeamDraftIntelligence(teamId: string): TeamDraftIntelligence | undefined {
  return teamDraftIntelligence[teamId.toUpperCase() as TeamId];
}

export function getAllTeamDraftIntelligence(): TeamDraftIntelligence[] {
  return Object.values(teamDraftIntelligence);
}

export function getTeamsByTimeline(timeline: TeamTimeline): TeamDraftIntelligence[] {
  return getAllTeamDraftIntelligence().filter((team) => team.timeline === timeline);
}

export function getTeamsByDraftMode(draftMode: DraftMode): TeamDraftIntelligence[] {
  return getAllTeamDraftIntelligence().filter((team) => team.draftMode === draftMode);
}
