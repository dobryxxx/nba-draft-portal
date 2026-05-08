// ============================================================
// NBA DRAFT 2026 - PROSPECTS DATABASE
// ============================================================
// Restored from official data file and updated with DraftBallr profiles.
// Numeric stat policy: DraftBallr is the primary source; BartTorvik is supplemental when extractable.
// Missing official values should stay null/blank instead of being estimated as real data.
// Attribute radar scores generated from production, efficiency, role, and position.
// ============================================================

export const STAT_SOURCE_POLICY = {
  primary: 'DraftBallr stats/player profiles',
  supplemental: 'BartTorvik player stats when cleanly extractable',
  optional: 'CollegeBasketballData API when an API key is available',
  rule: 'Do not invent or estimate official numeric stats. Leave missing fields blank until sourced.',
  lastReviewed: '2026-04-30'
};

export const prospects = [
  {
    "id": 1,
    "name": "AJ Dybantsa",
    "position": "SF/PF",
    "team": "BYU",
    "age": 18,
    "height": "6'9\"",
    "weight": "210 lbs",
    "wingspan": "7'2\"",
    "tier": "ELITE",
    "rank": 1,
    "stats": {
      "ppg": 25.5,
      "rpg": 6.8,
      "apg": 3.7,
      "fgp": 51,
      "threep": 33.1,
      "ftp": 77.4,
      "per": 30.2,
      "ts": 60,
      "usg": 33.5,
      "efg": 55,
      "astTo": 1.2,
      "blkPct": 1.1,
      "stlPct": 1.7,
      "games": 35,
      "fgm": 8.8,
      "fga": 17.3,
      "threepm": 1.4,
      "threepa": 4.2
    },
    "scouting": {
      "strengths": [
        "Líder nacional em pontuação (25.5 PPG) com eficiência de 51% no campo",
        "Criação off the dribble de elite — muda velocidade como Tracy McGrady",
        "Playmaking avançado para a posição (3.7 APG, baixo índice de turnovers)"
      ],
      "weaknesses": [
        "Consistência no arremesso de 3 ainda em desenvolvimento (33.1%)",
        "Tendência a procurar falta ao invés de finalizar com força no aro"
      ],
      "notes": "Dybantsa é o tipo de prospecto que se destaca não apenas pelo talento, mas pela intensidade competitiva que carrega. Fisicamente, combina tamanho de ala grande com mobilidade e dureza defensiva incomuns para a faixa etária, o que o torna uma presença real nos dois lados da quadra. Tem personalidade forte o suficiente para impor identidade num elenco — uma qualidade rara em prospectos jovens e que costuma ser tão decisiva quanto qualquer habilidade técnica.",
      "attributes": {
        "Athleticism": 7,
        "Shooting": 5.9,
        "Playmaking": 7.1,
        "Defense": 5.6,
        "Rebounding": 5.4,
        "BBIQ": 7
      },
      "evaluation": {
        "version": "manual_editor_v1",
        "floor": {
          "score": 70,
          "label": "Starter",
          "note": ""
        },
        "ceiling": {
          "score": null,
          "label": "",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "Decision making",
          "note": ""
        },
        "tools": {
          "shooting": "Solid",
          "creation": "Elite",
          "defense": "Solid",
          "rebounding": "Solid",
          "efficiency": "Plus"
        },
        "note": ""
      }
    },
    "accentColor": "#8b5cf6"
  },
  {
    "id": 2,
    "name": "Darryn Peterson",
    "position": "PG/SG",
    "team": "Kansas",
    "age": 19,
    "height": "6'6\"",
    "weight": "205 lbs",
    "wingspan": "6'10.5\"",
    "tier": "ELITE",
    "rank": 2,
    "stats": {
      "ppg": 20.2,
      "rpg": 4.2,
      "apg": 1.6,
      "fgp": 43.8,
      "threep": 38.2,
      "ftp": 82.6,
      "per": 26.5,
      "ts": 57.8,
      "usg": 30.9,
      "efg": 52.7,
      "astTo": 1,
      "blkPct": 2.3,
      "stlPct": 2.9,
      "games": 24,
      "fgm": 6.5,
      "fga": 14.8,
      "threepm": 2.6,
      "threepa": 6.9
    },
    "scouting": {
      "strengths": [
        "Shotmaking de elite nos três níveis — explosão e força de guarda maior",
        "QI ofensivo instintivo, baixo número de turnovers para o uso que recebe",
        "Arremesso de 3 limpo e repetível (38.2%) com boa consistência mecânica"
      ],
      "weaknesses": [
        "Histórico de problemas físicos (cãibra severa que exigiu hospitalização)",
        "Volume de jogos reduzido (24 partidas) deixa lacunas na avaliação médica"
      ],
      "notes": "Peterson é considerado o maior potencial de superstar scorer do draft, com capacidade de criar vantagem em múltiplos contextos: isolamento, pick-and-roll e sem a bola. Sua versatilidade ofensiva o torna um catchall raro — o tipo de jogador que dá direção a elencos inteiros pela simples ameaça que representa. A grande incógnita é se a temporada turbulenta no Kansas reflete problemas estruturais no seu jogo ou apenas ruído de adaptação a um ambiente difícil.",
      "attributes": {
        "Athleticism": 7.6,
        "Shooting": 7.6,
        "Playmaking": 3.7,
        "Defense": 7.8,
        "Rebounding": 6.1,
        "BBIQ": 4.5
      },
      "evaluation": {
        "version": "manual_editor_v1",
        "floor": {
          "score": 70,
          "label": "Starter",
          "note": ""
        },
        "ceiling": {
          "score": null,
          "label": "",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "Decision making",
          "note": ""
        },
        "tools": {
          "shooting": "Plus",
          "creation": "Elite",
          "defense": "Plus",
          "rebounding": "Solid",
          "efficiency": "Plus"
        },
        "note": ""
      }
    },
    "accentColor": "#8b5cf6"
  },
  {
    "id": 3,
    "name": "Cameron Boozer",
    "position": "PF/C",
    "team": "Duke",
    "age": 19,
    "height": "6'9\"",
    "weight": "250 lbs",
    "wingspan": "7'1\"",
    "tier": "ELITE",
    "rank": 3,
    "stats": {
      "ppg": 22.5,
      "rpg": 10.2,
      "apg": 4.1,
      "fgp": 55.6,
      "threep": 39.1,
      "ftp": 78.9,
      "per": 31.4,
      "ts": 65.3,
      "usg": 30.6,
      "efg": 60.7,
      "astTo": 1.6,
      "blkPct": 2.2,
      "stlPct": 2.5,
      "games": 38,
      "fgm": 7.6,
      "fga": 13.7,
      "threepm": 1.4,
      "threepa": 3.6
    },
    "scouting": {
      "strengths": [
        "AP National Player of the Year — 22.5/10.2/4.1 com 55.6% FG",
        "Box Plus-Minus de 17.1, mais alto de toda a college basketball em 2025-26",
        "Fundamentos ofensivos impecáveis: pós baixo, mid-range e tiro de 3 (39.1%)"
      ],
      "weaknesses": [
        "Debate sobre o teto de desenvolvimento comparado a Peterson/Dybantsa",
        "Sem explosividade atletica de elite — jogo depende mais de fundamentos e leitura"
      ],
      "notes": "Boozer é um forward com inteligência de jogo excepcional, capaz de agregar valor em múltiplas funções sem precisar ser o astro da jogada. Funciona como hub ofensivo, parceiro de pick-and-roll e espaçador com naturalidade, e o analista acredita que ele poderia fazer tudo isso já no primeiro ano profissional. O único \"risco\" do seu perfil é uma limitação como scorer de alto volume — mas quem enxerga além dos números reconhece que seu impacto nas vitórias tende a ser consistente e silencioso.",
      "attributes": {
        "Athleticism": 7.5,
        "Shooting": 8.1,
        "Playmaking": 7.9,
        "Defense": 7,
        "Rebounding": 7.6,
        "BBIQ": 8.3
      },
      "evaluation": {
        "version": "manual_editor_v1",
        "floor": {
          "score": 70,
          "label": "Starter",
          "note": ""
        },
        "ceiling": {
          "score": 90,
          "label": "MVP / franchise outlier",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "",
          "note": ""
        },
        "tools": {
          "shooting": "Elite",
          "creation": "Elite",
          "defense": "Plus",
          "rebounding": "Elite",
          "efficiency": "Elite"
        },
        "note": ""
      }
    },
    "accentColor": "#8b5cf6"
  },
  {
    "id": 4,
    "name": "Caleb Wilson",
    "position": "PF",
    "team": "North Carolina",
    "age": 19,
    "height": "6'10\"",
    "weight": "215 lbs",
    "wingspan": "7'0\"",
    "tier": "LOTTERY",
    "rank": 4,
    "stats": {
      "ppg": 19.8,
      "rpg": 9.4,
      "apg": 2.7,
      "fgp": 57.8,
      "threep": 25.9,
      "ftp": 72.1,
      "per": 25.3,
      "ts": 62.6,
      "usg": 28.8,
      "efg": 59,
      "astTo": 1.4,
      "blkPct": 4.4,
      "stlPct": 2.8,
      "games": 24,
      "fgm": 7.1,
      "fga": 12.3,
      "threepm": 0.3,
      "threepa": 1.1
    },
    "scouting": {
      "strengths": [
        "Atletismo twitchy e explosivo — arremessa acima do aro com facilidade",
        "Produção de dois lados da bola com first step especial para seu tamanho",
        "Reboteiro de elite (9.4 RPG) com motor constante"
      ],
      "weaknesses": [
        "Arremesso de 3 em desenvolvimento (25.9%) — maior limitação de longo prazo",
        "Playmaking ainda básico para um forward de alto nível"
      ],
      "notes": "Wilson tem o maior teto defensivo da classe, com atributos físicos — altura, envergadura e mobilidade — que poucos jogadores do draft conseguem igualar. No ataque, apresenta um perfil incomum: um ala grande com movimentação fluida, upside de arremesso e capacidade de finalização na bola parada. Ainda tem detalhes técnicos a aprimorar em várias áreas, mas a combinação de impacto defensivo de elite com versatilidade ofensiva o coloca entre os prospectos mais completos da geração.",
      "attributes": {
        "Athleticism": 8.6,
        "Shooting": 4.7,
        "Playmaking": 5.9,
        "Defense": 9.2,
        "Rebounding": 10,
        "BBIQ": 6.1
      },
      "evaluation": {
        "version": "manual_editor_v1",
        "floor": {
          "score": 70,
          "label": "Starter",
          "note": ""
        },
        "ceiling": {
          "score": 85,
          "label": "Franchise player",
          "note": ""
        },
        "risk": {
          "level": "Moderate",
          "reason": "",
          "note": ""
        },
        "tools": {
          "shooting": "Question",
          "creation": "Solid",
          "defense": "Elite",
          "rebounding": "Elite",
          "efficiency": "Plus"
        },
        "note": ""
      }
    },
    "accentColor": "#f97316"
  },
  {
    "id": 5,
    "name": "Keaton Wagler",
    "position": "PG/SG",
    "team": "Illinois",
    "age": 19,
    "height": "6'6\"",
    "weight": "185 lbs",
    "wingspan": "6'9\"",
    "tier": "LOTTERY",
    "rank": 5,
    "stats": {
      "ppg": 17.9,
      "rpg": 5.1,
      "apg": 4.2,
      "fgp": 44.5,
      "threep": 39.7,
      "ftp": 79.6,
      "per": 22.8,
      "ts": 59.6,
      "usg": 25.7,
      "efg": 54.1,
      "astTo": 2.4,
      "blkPct": 1.3,
      "stlPct": 1.7,
      "games": 37,
      "fgm": 5.5,
      "fga": 12.3,
      "threepm": 2.4,
      "threepa": 5.9
    },
    "scouting": {
      "strengths": [
        "Tomada de decisão inteligente e visão de jogo acima da média para a posição",
        "Arremesso de 3 confiável (39.7%) com boa vantagem de tamanho sobre guardas",
        "Excelente como facilitador fora da bola e em ball screens — elevador de companheiros"
      ],
      "weaknesses": [
        "Ainda precisa adicionar força para suportar fisicalidade NBA",
        "Sem explosividade atlética como criador primário"
      ],
      "notes": "Wagler é um dos atiradores mais perigosos e dinâmicos da classe, com mecanismo confiável e capacidade técnica sólida de operar no pick-and-roll. Tem tamanho posicional adequado para um guard no nível profissional, o que amplifica o problema que representa para as defesas. A principal dúvida sobre ele é física: se seu corpo será capaz de absorver as demandas de ser opção primária na NBA — mas mesmo como peça secundária, sua gravidade ofensiva é inegável.",
      "attributes": {
        "Athleticism": 6.1,
        "Shooting": 8.1,
        "Playmaking": 6.5,
        "Defense": 5.5,
        "Rebounding": 7.1,
        "BBIQ": 7
      },
      "evaluation": {
        "version": "manual_editor_v1",
        "floor": {
          "score": 55,
          "label": "Rotation",
          "note": ""
        },
        "ceiling": {
          "score": 80,
          "label": "All-Star",
          "note": ""
        },
        "risk": {
          "level": "Moderate",
          "reason": "Frame/physicality",
          "note": ""
        },
        "tools": {
          "shooting": "Plus",
          "creation": "Plus",
          "defense": "Question",
          "rebounding": "Solid",
          "efficiency": "Plus"
        },
        "note": ""
      }
    },
    "accentColor": "#f97316"
  },
  {
    "id": 14,
    "name": "Darius Acuff Jr.",
    "position": "PG/SG",
    "team": "Arkansas",
    "age": 19,
    "height": "6'3\"",
    "weight": "190 lbs",
    "wingspan": "6'6\"",
    "tier": "LOTTERY",
    "rank": 6,
    "stats": {
      "ppg": 23.5,
      "rpg": 4.2,
      "apg": 6.4,
      "fgp": 48,
      "threep": 44,
      "ftp": 84.1,
      "per": 27.4,
      "ts": 60.4,
      "usg": 29.5,
      "efg": 56.1,
      "astTo": 3,
      "blkPct": 0.9,
      "stlPct": 1.3,
      "games": 36,
      "fgm": 8,
      "fga": 16.5,
      "threepm": 2.5,
      "threepa": 5.8
    },
    "scouting": {
      "strengths": [
        "SEC Player of Year + Freshman of Year — 845 pontos, recorde Arkansas",
        "Único jogador na NCAA a fazer 20+ PPG e 6+ APG com 48% FG e 44% de 3",
        "Motor ofensivo explosivo; capacidade de virar jogo sozinho (49 pts no recorde pessoal)"
      ],
      "weaknesses": [
        "Estatura limitante para guarda NBA (6'2\") sem compensação atlética óbvia",
        "Hábitos defensivos ruins chamam atenção de scouts — ponto de atenção real"
      ],
      "notes": "Acuff se destaca pela dureza mental, frieza emocional e pela leitura de jogo que permite alimentar atletas explosivos com eficiência tanto em transição quanto no half court. É um armador com identidade competitiva forte, que não depende de números para impactar a dinâmica de um grupo. Seu perfil tem tudo para escalar na loteria à medida que o processo pré-draft avança e os times compreendem melhor o valor do que ele oferece além do óbvio.",
      "attributes": {
        "Athleticism": 6.4,
        "Shooting": 9,
        "Playmaking": 9.3,
        "Defense": 4.8,
        "Rebounding": 5.2,
        "BBIQ": 8.8
      },
      "evaluation": {
        "version": "manual_editor_v1",
        "floor": {
          "score": 60,
          "label": "Rotation",
          "note": ""
        },
        "ceiling": {
          "score": 85,
          "label": "Franchise player",
          "note": ""
        },
        "risk": {
          "level": "Moderate",
          "reason": "Defense translation",
          "note": ""
        },
        "tools": {},
        "note": ""
      }
    },
    "accentColor": "#f59e0b"
  },
  {
    "id": 6,
    "name": "Kingston Flemings",
    "position": "PG",
    "team": "Houston",
    "age": 19,
    "height": "6'4\"",
    "weight": "185 lbs",
    "wingspan": "6'7\"",
    "tier": "LOTTERY",
    "rank": 7,
    "stats": {
      "ppg": 17.3,
      "rpg": 4.1,
      "apg": 5.8,
      "fgp": 46.2,
      "threep": 40,
      "ftp": 81.3,
      "per": 23.1,
      "ts": 56.3,
      "usg": 26.5,
      "efg": 52,
      "astTo": 2.9,
      "blkPct": 1.3,
      "stlPct": 3,
      "games": 37,
      "fgm": 6,
      "fga": 12.6,
      "threepm": 1.1,
      "threepa": 2.9
    },
    "scouting": {
      "strengths": [
        "Playmaking de elite — comparado a Derrick Rose pela visão e explosão",
        "Arremessador confiável de 3 (40%) com alto QI ofensivo",
        "Liderança comprovada em sistema de alta exigência defensiva de Houston"
      ],
      "weaknesses": [
        "Tamanho limítrofe para PG na NBA (6'3\")",
        "Precisará se afirmar como finalizador contra corpos maiores"
      ],
      "notes": "Flemings é frequentemente reduzido ao rótulo de scorer, mas seu perfil vai além disso: tem sensibilidade real no pick-and-roll e é possivelmente o jogador mais veloz da classe em espaço aberto. A velocidade que exibe não é apenas atlética — é combinada com leitura de jogo suficiente para transformá-la em vantagem concreta dentro das estruturas ofensivas. Um prospecto com esse perfil de transição e desequilíbrio em espaço aberto tende a encontrar papel imediato em qualquer sistema de jogo moderno.",
      "attributes": {
        "Athleticism": 6.4,
        "Shooting": 7.7,
        "Playmaking": 8.3,
        "Defense": 6.6,
        "Rebounding": 5.3,
        "BBIQ": 7.6
      },
      "evaluation": {
        "version": "manual_editor_v1",
        "floor": {
          "score": 60,
          "label": "Rotation",
          "note": ""
        },
        "ceiling": {
          "score": 85,
          "label": "Franchise player",
          "note": ""
        },
        "risk": {
          "level": "Moderate",
          "reason": "",
          "note": ""
        },
        "tools": {
          "shooting": "Plus",
          "creation": "Elite",
          "defense": "Solid",
          "rebounding": "Solid",
          "efficiency": "Plus"
        },
        "note": ""
      }
    },
    "accentColor": "#f97316"
  },
  {
    "id": 7,
    "name": "Mikel Brown Jr.",
    "position": "PG/SG",
    "team": "Louisville",
    "age": 20,
    "height": "6'5\"",
    "weight": "190 lbs",
    "wingspan": "6'7\"",
    "tier": "LOTTERY",
    "rank": 8,
    "stats": {
      "ppg": 18.2,
      "rpg": 3.3,
      "apg": 4.7,
      "fgp": 41.5,
      "threep": 34,
      "ftp": 83.1,
      "per": 21.4,
      "ts": 57.7,
      "usg": 31,
      "efg": 51.1,
      "astTo": 1.5,
      "blkPct": 0.5,
      "stlPct": 2.4,
      "games": 21,
      "fgm": 5.3,
      "fga": 13,
      "threepm": 2.6,
      "threepa": 7.6
    },
    "scouting": {
      "strengths": [
        "Tamanho posicional excelente para guarda moderno (6'5\")",
        "Criação de contato e ida à linha de lance livre em volume alto",
        "Visão de jogo e passagem criativa — potencial como iniciador primário"
      ],
      "weaknesses": [
        "Lesão nas costas encerrou temporada 6 jogos cedo — preocupação médica real",
        "Eficiência de 3 inconsistente (34%) com oscilações de temperatura ao longo do ano"
      ],
      "notes": "Brown é um handler elétrico em espaço aberto que combina criação de vantagem com movimentação off-ball sofisticada — domina saídas em pin-downs, staggers e flare screens como atirador com naturalidade. Esse perfil duplo é raro: a maioria dos guards dessa classe tende a ser uma coisa ou outra. A temporada irregular no Louisville teve um efeito supressor no seu valor percebido, mas quem olha além das flutuações reconhece nele uma das apostas mais subestimadas da classe.",
      "attributes": {
        "Athleticism": 5.4,
        "Shooting": 6.4,
        "Playmaking": 6.1,
        "Defense": 4.7,
        "Rebounding": 3.4,
        "BBIQ": 5.1
      },
      "evaluation": {
        "version": "manual_editor_v1",
        "floor": {
          "score": 60,
          "label": "Rotation",
          "note": ""
        },
        "ceiling": {
          "score": 85,
          "label": "Franchise player",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "Shooting consistency",
          "note": ""
        },
        "tools": {},
        "note": ""
      }
    },
    "accentColor": "#f97316"
  },
  {
    "id": 9,
    "name": "Nate Ament",
    "position": "PF/SF",
    "team": "Tennessee",
    "age": 19,
    "height": "6'10\"",
    "weight": "210 lbs",
    "wingspan": "7'0\"",
    "tier": "LOTTERY",
    "rank": 9,
    "stats": {
      "ppg": 17.1,
      "rpg": 6.5,
      "apg": 2.5,
      "fgp": 41.7,
      "threep": 32.8,
      "ftp": 76.4,
      "per": 20.8,
      "ts": 53.4,
      "usg": 27.8,
      "efg": 45.2,
      "astTo": 1,
      "blkPct": 2.7,
      "stlPct": 1.9,
      "games": 35,
      "fgm": 4.9,
      "fga": 12.3,
      "threepm": 1.3,
      "threepa": 3.9
    },
    "scouting": {
      "strengths": [
        "Tamanho wing de 6'10\" com tiro de médio alcance suave — modelo Kevin Durant",
        "Potencial defensivo imenso com comprimento e instintos naturais",
        "QI de leitura de jogo avançado para um freshman"
      ],
      "weaknesses": [
        "Confiança e assertividade como shotmaker ainda inconsistentes",
        "Arremesso de 3 em 32.8% — precisa melhorar para maximizar spacing na NBA"
      ],
      "notes": "Ament chegou à temporada com status de top 5-7, mas eficiências abaixo do esperado — tanto de três pontos quanto na bola parada — levantaram dúvidas sobre seu teto como espaçador. O que permanece intacto é uma coordenação motora e um equilíbrio para um jogador do seu porte que são genuinamente raros, além de contribuição defensiva acima da média. É um prospecto que exige paciência avaliativa: os números de uma temporada difícil não devem obscurecer o que ele demonstra ser quando em ritmo.",
      "attributes": {
        "Athleticism": 6.3,
        "Shooting": 4.1,
        "Playmaking": 4.8,
        "Defense": 6.3,
        "Rebounding": 6,
        "BBIQ": 4.4
      },
      "evaluation": {
        "version": "manual_editor_v1",
        "floor": {
          "score": 44,
          "label": "G-League / two-way",
          "note": ""
        },
        "ceiling": {
          "score": 80,
          "label": "All-Star",
          "note": ""
        },
        "risk": {
          "level": "High",
          "reason": "",
          "note": ""
        },
        "tools": {
          "shooting": "Solid",
          "creation": "Question",
          "defense": "Solid",
          "rebounding": "Plus",
          "efficiency": "Question"
        },
        "note": ""
      }
    },
    "accentColor": "#f97316"
  },
  {
    "id": 25,
    "name": "Aday Mara",
    "position": "C",
    "team": "Michigan",
    "age": 22,
    "height": "7'3\"",
    "weight": "255 lbs",
    "wingspan": "7'5\"",
    "tier": "LOTTERY",
    "rank": 10,
    "stats": {
      "ppg": 13.5,
      "rpg": 6.1,
      "apg": 1.9,
      "fgp": 53.4,
      "threep": 31.5,
      "ftp": 71.2,
      "per": 19.7,
      "ts": 65.8,
      "usg": 23.8,
      "efg": 67.3,
      "astTo": 1.2,
      "blkPct": 12,
      "stlPct": 0.8,
      "games": 40,
      "fgm": 5,
      "fga": 7.5,
      "threepm": 0.1,
      "threepa": 0.3
    },
    "scouting": {
      "strengths": [
        "Dimensões de rim protector de elite (7' + envergadura 7'5\")",
        "26 pontos contra Arizona no Final Four — desempenho assinatura em 2026",
        "Boa mão e touch de finalizador no pós (53.4% FG)"
      ],
      "weaknesses": [
        "Jogador mais velho da classe (22 anos)",
        "Tiro de 3 (31.5%) precisa evoluir para spacing moderno"
      ],
      "notes": "Mara é um pivô de 7'3\" com presença defensiva que distorce a geometria do ataque adversário só pela sua posição na quadra. Foi peça central de uma das defesas mais dominantes do basquete universitário na temporada, com percentual de tocos entre os mais altos da divisão. Soma a isso uma capacidade de passe subestimada para um jogador do seu porte, o que o torna mais do que uma simples âncora defensiva — é um pivô com mãos e visão de jogo que transcendem o estereótipo da posição.",
      "attributes": {
        "Athleticism": 4.3,
        "Shooting": 6.2,
        "Playmaking": 4,
        "Defense": 5,
        "Rebounding": 4.3,
        "BBIQ": 5.8
      },
      "evaluation": {
        "version": "manual_editor_v1",
        "floor": {
          "score": 60,
          "label": "Rotation",
          "note": ""
        },
        "ceiling": {
          "score": 81,
          "label": "All-Star",
          "note": ""
        },
        "risk": {
          "level": "Moderate",
          "reason": "",
          "note": ""
        },
        "tools": {
          "shooting": "Question",
          "creation": "Solid",
          "defense": "Elite",
          "rebounding": "Solid",
          "efficiency": "Elite"
        },
        "note": ""
      }
    },
    "accentColor": "#f59e0b"
  },
  {
    "id": 11,
    "name": "Labaron Philon",
    "position": "PG/SG",
    "team": "Alabama",
    "age": 20,
    "height": "6'4\"",
    "weight": "180 lbs",
    "wingspan": "6'7\"",
    "tier": "LOTTERY",
    "rank": 11,
    "stats": {
      "ppg": 17.8,
      "rpg": 3.5,
      "apg": 4.7,
      "fgp": 46.1,
      "threep": 40.2,
      "ftp": 82.4,
      "per": 22.5,
      "ts": 62.6,
      "usg": 29.9,
      "efg": 58.5,
      "astTo": 2,
      "blkPct": 0.5,
      "stlPct": 2,
      "games": 33,
      "fgm": 7.4,
      "fga": 14.7,
      "threepm": 2.5,
      "threepa": 6.2
    },
    "scouting": {
      "strengths": [
        "Tiro de 3 elite (40.2%) com 2.3 cestas por jogo — spacer e criador simultâneo",
        "Segundo ano transformado: liderança, eficiência e produção escalaram juntas",
        "Defensor com boa antecipação e presença no ponto de ataque"
      ],
      "weaknesses": [
        "Tamanho limítrofe para a posição na NBA (6'3\")",
        "Sem arma de chega-ao-aro consistente contra corpos maiores"
      ],
      "notes": "Philon é um armador com inteligência de jogo fora do comum para a idade, combinando moxie competitivo com um conjunto de habilidades que sugere adaptação rápida ao ritmo profissional. Sua leitura defensiva e capacidade de encaixe em sistemas já estabelecidos o tornam um prospecto que agrega sem precisar de protagonismo imediato. Há também uma dimensão de potencial ainda não totalmente revelado — alguém que pode começar cumprindo papel definido e gradualmente assumir as chaves do carro.",
      "attributes": {
        "Athleticism": 5.4,
        "Shooting": 8.8,
        "Playmaking": 6.7,
        "Defense": 4.5,
        "Rebounding": 3.8,
        "BBIQ": 6.9
      },
      "evaluation": {
        "version": "manual_editor_v1",
        "floor": {
          "score": 64,
          "label": "Rotation",
          "note": ""
        },
        "ceiling": {
          "score": 85,
          "label": "Franchise player",
          "note": ""
        },
        "risk": {
          "level": "Low",
          "reason": "Role clarity",
          "note": ""
        },
        "tools": {
          "shooting": "Elite",
          "creation": "Plus",
          "defense": "Plus",
          "rebounding": "Question",
          "efficiency": "Elite"
        },
        "note": ""
      }
    },
    "accentColor": "#f97316"
  },
  {
    "id": 10,
    "name": "Yaxel Lendeborg",
    "position": "PF",
    "team": "Michigan",
    "age": 23.7,
    "height": "6'9\"",
    "weight": "240 lbs",
    "wingspan": "7'4\"",
    "tier": "LOTTERY",
    "rank": 12,
    "stats": {
      "ppg": 15.1,
      "rpg": 6.9,
      "apg": 3.3,
      "fgp": 52.3,
      "threep": 38.3,
      "ftp": 81.9,
      "per": null,
      "ts": 64.6,
      "usg": 20.5,
      "efg": 61.2,
      "astTo": 3.1,
      "blkPct": 4.4,
      "stlPct": 2.1,
      "games": 39,
      "fgm": 5,
      "fga": 9.6,
      "threepm": 1.7,
      "threepa": 4.5,
      "ftm": 3.4,
      "fta": 4.1,
      "totals": {
        "games": 39,
        "fgm": 196,
        "fga": 375,
        "threepm": 67,
        "threepa": 175,
        "ftm": 131,
        "fta": 160,
        "pts": 590,
        "reb": 269,
        "ast": 128,
        "tov": 41,
        "stl": 45,
        "blk": 48
      }
    },
    "scouting": {
      "strengths": [
        "Efici?ncia de elite para fun??o complementar: 64.6% TS e 60.2% eFG.",
        "Playmaking muito forte para forward: 3.2 APG e AST/TO 3.1.",
        "Impacto defensivo real: 2.1% STL, 4.4% BLK e DBPM 5.9 no perfil DraftBallr."
      ],
      "weaknesses": [
        "Idade de 23.7 anos reduz margem de crescimento em compara??o aos freshmen.",
        "Perfil tende mais a alto impacto de rota??o do que cria??o prim?ria NBA."
      ],
      "notes": "Lendeborg ? um forward de 6'9\" e 240 libras com capacidade de espa?amento, senso de passe e versatilidade defensiva funcionando em conjunto. Seu perfil ? menos chamativo do que outros nessa faixa, mas a soma das partes o torna confi?vel para m?ltiplas fun??es dentro de uma estrutura ofensiva. Times experientes tendem a reconhecer esse tipo de jogador como pe?a de alto aproveitamento em contexto coletivo.",
      "attributes": {
        "Athleticism": 6,
        "Shooting": 6.8,
        "Playmaking": 6.2,
        "Defense": 5.2,
        "Rebounding": 7,
        "BBIQ": 7
      },
      "evaluation": {
        "version": "manual_editor_v1",
        "floor": {
          "score": 60,
          "label": "Rotation",
          "note": ""
        },
        "ceiling": {
          "score": 65,
          "label": "Starter",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "Age/upside",
          "note": ""
        },
        "tools": {
          "shooting": "Plus",
          "creation": "Solid",
          "defense": "Question",
          "rebounding": "Plus",
          "efficiency": "Plus"
        },
        "note": "Restaurado por elegibilidade autom?tica/idade; stats ficam em branco at? reconcilia??o com fonte limpa."
      }
    },
    "accentColor": "#8bbfe8",
    "eligibilityStatus": "automatic_age_eligible",
    "archetype": "Switchable Connector / Stretch 4",
    "dataSources": {
      "traditionalStats": "University of Michigan Athletics cumulative statistics",
      "traditionalStatsUrl": "https://mgoblue.com/sports/mens-basketball/stats/2025-26",
      "advancedStats": "DraftBallr player profile",
      "advancedStatsUrl": "https://draftballr.com/players/yaxel-lendeborg",
      "lastVerified": "2026-04-30"
    },
    "statSourceNote": "Traditional box stats from University of Michigan cumulative statistics; advanced context from DraftBallr."
  },
  {
    "id": 12,
    "name": "Allen Graves",
    "position": "PF/SF",
    "team": "Santa Clara",
    "age": 19.9,
    "height": "6'9\"",
    "weight": "225 lbs",
    "wingspan": "7'0\"",
    "tier": "LOTTERY",
    "rank": 13,
    "stats": {
      "ppg": 11.8,
      "rpg": 6.5,
      "apg": 1.8,
      "fgp": 51.5,
      "threep": 40.7,
      "ftp": 75,
      "per": null,
      "ts": 61.5,
      "usg": 22.4,
      "efg": 58.2,
      "astTo": 2.5,
      "blkPct": 5,
      "stlPct": 4.9,
      "games": 34,
      "fgm": 4.2,
      "fga": 8.1,
      "threepm": 1.1,
      "threepa": 2.7
    },
    "scouting": {
      "strengths": [
        "Stretch 4 eficiente: 40.7% de 3 e 61.5% TS no perfil DraftBallr",
        "Impacto defensivo raro para ala/grande, com 4.9% STL e 5.0% BLK",
        "Excelente economia de posse: AST/TO 2.5 e baixo volume de turnovers"
      ],
      "weaknesses": [
        "Faltas ainda pesam no perfil defensivo",
        "Criacao com a bola ainda parece mais complementar do que primaria"
      ],
      "notes": "Graves é um forward inteligente e maduro que impacta o jogo com estilo controlado nos dois lados da quadra — tamanho, estrutura física sólida e comprimento funcional dão a ele versatilidade de encaixe em diferentes lineups. Suas métricas de eficiência se destacam apesar de minutos reduzidos num programa de mid-major: 51,7% de aproveitamento geral, 41,6% de três e baixíssima taxa de turnovers, o que indica um jogador com excelente consciência de posição. A avaliação carrega projeção inerente pelo nível de competição enfrentado, e seu atletismo vertical não é explosivo — mas o conjunto de habilidades técnicas, instintos defensivos e leitura coletiva do jogo sugere um jogador que agrega a sistemas vencedores sem precisar de papel central.",
      "attributes": {
        "Athleticism": 6.3,
        "Shooting": 8.2,
        "Playmaking": 5.2,
        "Defense": 8.2,
        "Rebounding": 6.5,
        "BBIQ": 6.6
      },
      "evaluation": {
        "version": "manual_editor_v1",
        "floor": {
          "score": 60,
          "label": "Rotation",
          "note": ""
        },
        "ceiling": {
          "score": 70,
          "label": "Starter",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "",
          "note": ""
        },
        "tools": {
          "shooting": "Elite",
          "creation": "Solid",
          "defense": "Elite",
          "rebounding": "Plus",
          "efficiency": "Plus"
        },
        "note": ""
      }
    },
    "accentColor": "#8bbfe8"
  },
  {
    "id": 13,
    "name": "Hannes Steinbach",
    "position": "PF/C",
    "team": "Washington",
    "age": 19,
    "height": "6'11\"",
    "weight": "220 lbs",
    "wingspan": "6'11\"",
    "tier": "LOTTERY",
    "rank": 14,
    "stats": {
      "ppg": 16.4,
      "rpg": 5.2,
      "apg": 2.8,
      "fgp": 46.9,
      "threep": 38.1,
      "ftp": 80.2,
      "per": 21.3,
      "ts": 63.6,
      "usg": 24.4,
      "efg": 60.2,
      "astTo": 0.8,
      "blkPct": 3.9,
      "stlPct": 1.8,
      "games": 30,
      "fgm": 7,
      "fga": 12.1,
      "threepm": 0.6,
      "threepa": 1.8
    },
    "scouting": {
      "strengths": [
        "Tamanho wing de 6'7\" com tiro de 3 (38.1%) e versatilidade defensiva",
        "Coordenação e controle de bola avançados para o tamanho",
        "Jogo two-way com instintos reboteiros acima da média"
      ],
      "weaknesses": [
        "Criação ISO limitada — mais dependente de sistema do que initiator",
        "Precisa amadurecer fisicamente para os embates de 3s/4s na NBA"
      ],
      "notes": "Steinbach foi um dos poucos pontos positivos de uma temporada problemática para o Washington, destacando-se como reboteiro voraz e finalizador de alto volume dentro do garrafão. Seu repertório de pontuação na bola parada foi um dos mais impressionantes do país, com lampejos de capacidade de espaçamento que são incomuns para um jogador do seu porte. Oferece solidez produtiva imediata e flexibilidade de encaixe em diferentes configurações de quinteto.",
      "attributes": {
        "Athleticism": 6.5,
        "Shooting": 8.2,
        "Playmaking": 4.7,
        "Defense": 6.8,
        "Rebounding": 6.4,
        "BBIQ": 5.4
      },
      "evaluation": {
        "version": "manual_editor_v1",
        "floor": {
          "score": 60,
          "label": "Rotation",
          "note": ""
        },
        "ceiling": {
          "score": 75,
          "label": "All-Star",
          "note": ""
        },
        "risk": {
          "level": "Moderate",
          "reason": "Role clarity",
          "note": ""
        },
        "tools": {
          "shooting": "Solid",
          "creation": "Question",
          "defense": "Solid",
          "rebounding": "Elite",
          "efficiency": "Plus"
        },
        "note": ""
      }
    },
    "accentColor": "#f97316"
  },
  {
    "id": 17,
    "name": "Tounde Yessoufou",
    "position": "SF",
    "team": "Baylor",
    "age": 20,
    "height": "6'7\"",
    "weight": "205 lbs",
    "wingspan": "7'0\"",
    "tier": "MID_1ST",
    "rank": 15,
    "stats": {
      "ppg": 15.6,
      "rpg": 6.1,
      "apg": 2.2,
      "fgp": 47.8,
      "threep": 35.9,
      "ftp": 74.3,
      "per": 20.1,
      "ts": 54.2,
      "usg": 25.4,
      "efg": 51.1,
      "astTo": 0.8,
      "blkPct": 1.9,
      "stlPct": 3.3,
      "games": 33,
      "fgm": 6.5,
      "fga": 14.3,
      "threepm": 1.6,
      "threepa": 5.4
    },
    "scouting": {
      "strengths": [
        "Tamanho e comprimento de wing para defesa versátil na NBA",
        "Arremessador capaz de 3 (35.9%) com potencial off-ball",
        "Motor e intensidade que translationam para contribuição imediata"
      ],
      "weaknesses": [
        "Criação ofensiva ISO limitada — depende de estrutura",
        "Ainda precisa definir papel principal na NBA"
      ],
      "notes": "Yessoufou é um prospecto com volume ofensivo real, habilidade incomum na meia distância e instinto defensivo legítimo pelo número de roubos. As limitações centrais são o arremesso de três pontos — que precisa melhorar para que defesas na NBA o respeitem no perímetro — e o impacto defensivo coletivo, que não acompanha os números individuais de roubos. O perfil físico sem grande margem de envergadura também reduz o teto como defensor de múltiplas posições. O desenvolvimento do arremesso de longa distância será o fator que determinará se ele se torna jogador de rotação ou apenas um complemento pontual.",
      "attributes": {
        "Athleticism": 7.2,
        "Shooting": 5.5,
        "Playmaking": 4,
        "Defense": 7.3,
        "Rebounding": 6.9,
        "BBIQ": 4
      },
      "evaluation": {
        "version": "manual_editor_v1",
        "floor": {
          "score": 45,
          "label": "Deep bench",
          "note": ""
        },
        "ceiling": {
          "score": 70,
          "label": "Starter",
          "note": ""
        },
        "risk": {
          "level": "Moderate",
          "reason": "Shooting consistency",
          "note": ""
        },
        "tools": {
          "shooting": "Question",
          "creation": "Question",
          "defense": "Plus",
          "rebounding": "Plus",
          "efficiency": "Solid"
        },
        "note": ""
      }
    },
    "accentColor": "#f59e0b"
  },
  {
    "id": 18,
    "name": "Cameron Carr",
    "position": "SG/SF",
    "team": "Baylor",
    "age": 21,
    "height": "6'5\"",
    "weight": "175 lbs",
    "wingspan": "6'10\"",
    "tier": "MID_1ST",
    "rank": 16,
    "stats": {
      "ppg": 17.4,
      "rpg": 4.8,
      "apg": 2.9,
      "fgp": 48.2,
      "threep": 37.4,
      "ftp": 80.1,
      "per": 21.2,
      "ts": 61.8,
      "usg": 24.3,
      "efg": 57.6,
      "astTo": 1.1,
      "blkPct": 3.9,
      "stlPct": 1.6,
      "games": 33,
      "fgm": 6.3,
      "fga": 13,
      "threepm": 2.3,
      "threepa": 6.2
    },
    "scouting": {
      "strengths": [
        "Breakout season em Baylor — scorer versátil com tiro de 3 confiável (37.4%)",
        "Tamanho e atletismo para jogar 2/3 na NBA",
        "Produção equilibrada nos três níveis"
      ],
      "weaknesses": [
        "Playmaking como initiator ainda questão em aberto",
        "Consistência defensiva precisa ser mais assertiva"
      ],
      "notes": "Carr é um guard atlético com perfil predominantemente off-ball, cujo valor está na movimentação sem a bola, no arremesso em catch-and-shoot e na finalização explosiva na bola parada. Registrou 41,7% em catch-and-shoot de três pontos na temporada — número que indica consistência real como ameaça de perímetro, não apenas volume. Defensivamente, contribui com contestações de weakside que o mantêm relevante nos dois lados da quadra.",
      "attributes": {
        "Athleticism": 6.4,
        "Shooting": 7.8,
        "Playmaking": 5.1,
        "Defense": 6.4,
        "Rebounding": 5.8,
        "BBIQ": 5.7
      },
      "evaluation": {
        "version": "manual_editor_v1",
        "floor": {
          "score": 55,
          "label": "Rotation",
          "note": ""
        },
        "ceiling": {
          "score": 73,
          "label": "Starter",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "Decision making",
          "note": ""
        },
        "tools": {
          "shooting": "Plus",
          "creation": "Solid",
          "defense": "Plus",
          "rebounding": "Solid",
          "efficiency": "Plus"
        },
        "note": ""
      }
    },
    "accentColor": "#f59e0b"
  },
  {
    "id": 16,
    "name": "Bennett Stirtz",
    "position": "PG/SG",
    "team": "Iowa",
    "age": 22.7,
    "height": "6'4\"",
    "weight": "190 lbs",
    "wingspan": "6'6\"",
    "tier": "MID_1ST",
    "rank": 17,
    "stats": {
      "ppg": 19.8,
      "rpg": 2.6,
      "apg": 4.4,
      "fgp": 47.7,
      "threep": 35.8,
      "ftp": 84.8,
      "per": null,
      "ts": 60.7,
      "usg": 26.1,
      "efg": 56.5,
      "astTo": 2.4,
      "blkPct": 0.9,
      "stlPct": 2.3,
      "games": 37,
      "fgm": 6.8,
      "fga": 14.2,
      "threepm": 2.5,
      "threepa": 6.9,
      "ftm": 3.8,
      "fta": 4.5,
      "totals": {
        "games": 37,
        "fgm": 251,
        "fga": 526,
        "threepm": 92,
        "threepa": 257,
        "ftm": 140,
        "fta": 165,
        "pts": 734,
        "reb": 98,
        "ast": 163,
        "tov": 68,
        "stl": 51,
        "blk": 9
      }
    },
    "scouting": {
      "strengths": [
        "Produ??o ofensiva alta: 19.8 PPG com 60.7% TS em carga grande.",
        "Criador eficiente no pick-and-roll: 4.4 APG e AST/TO 2.4.",
        "Toque confi?vel: 84.8% FT e 56.5% eFG no perfil DraftBallr."
      ],
      "weaknesses": [
        "Senior de 22.7 anos, com menor margem de upside puro.",
        "Limita??es atl?ticas e envergadura estimada em 6'6\" podem pesar defensivamente."
      ],
      "notes": "Stirtz ? um armador tecnicamente s?lido, com tamanho posicional adequado, tomada de decis?o consistente e cria??o eficiente no pick-and-roll. O mecanismo de arremesso ? profissional na execu??o e confi?vel sob press?o ? um dos mais bem constru?dos da classe. Compensa a aus?ncia de atletismo explosivo com intelig?ncia, efici?ncia e uma mentalidade competitiva que facilita processos de desenvolvimento em ambientes exigentes.",
      "attributes": {
        "Athleticism": 5,
        "Shooting": 7.2,
        "Playmaking": 7,
        "Defense": 4.8,
        "Rebounding": 4.2,
        "BBIQ": 7.4
      },
      "evaluation": {
        "version": "manual_editor_v1",
        "floor": {
          "score": 60,
          "label": "Rotation",
          "note": ""
        },
        "ceiling": {
          "score": 65,
          "label": "Starter",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "Frame/physicality",
          "note": ""
        },
        "tools": {
          "shooting": "Plus",
          "creation": "Plus",
          "defense": "Question",
          "rebounding": "Question",
          "efficiency": "Plus"
        },
        "note": "Restaurado por elegibilidade autom?tica/idade; stats ficam em branco at? reconcilia??o com fonte limpa."
      }
    },
    "accentColor": "#f59e0b",
    "eligibilityStatus": "automatic_age_eligible",
    "archetype": "Efficient Creator / Scoring PG",
    "dataSources": {
      "traditionalStats": "ESPN Iowa Hawkeyes 2025-26 team stats and Iowa final notes",
      "traditionalStatsUrl": "https://www.espn.com/mens-college-basketball/team/stats/_/name/iowa/sort/threePointFieldGoalPct",
      "advancedStats": "DraftBallr player profile",
      "advancedStatsUrl": "https://draftballr.com/players/bennett-stirtz",
      "lastVerified": "2026-04-30"
    },
    "statSourceNote": "Traditional box stats from ESPN/Iowa season totals; advanced context from DraftBallr."
  },
  {
    "id": 8,
    "name": "Jayden Quaintance",
    "position": "PF/C",
    "team": "Kentucky",
    "age": 18,
    "height": "6'10\"",
    "weight": "255 lbs",
    "wingspan": "7'5\"",
    "tier": "MID_1ST",
    "rank": 18,
    "stats": {
      "ppg": 5,
      "rpg": 5,
      "apg": 0.5,
      "fgp": 52.1,
      "threep": 0,
      "ftp": 68,
      "per": 16.2,
      "ts": 49.6,
      "usg": 20.9,
      "efg": 57.1,
      "astTo": 0.3,
      "blkPct": 5,
      "stlPct": 1.7,
      "games": 4,
      "fgm": 2,
      "fga": 3.5,
      "threepm": 0,
      "threepa": 0
    },
    "scouting": {
      "strengths": [
        "Bloqueador de chutes de nível generacional — mobilidade e envergadura 7'5\"",
        "Elasticidade e verticalidade raras para um pivô de 18 anos",
        "Defensor que consegue guardar perímetro e proteger o aro na mesma posse"
      ],
      "weaknesses": [
        "Joelho operado (ACL) + lesão recorrente limitaram a apenas 4 jogos em 2025-26",
        "Ataque bruto e sem arremesso de 3 — necessita evolução ofensiva"
      ],
      "notes": "Quaintance exige separação entre o que foi visto e o que ele representa como prospecto: voltou de uma ruptura de LCA em menos de um ano e teve uma temporada visivelmente comprometida pela pressa do retorno. Em condições normais, ele disputa com Caleb Wilson o título de protetor de aro mais dinâmico da classe — combinação de tamanho, mobilidade e timing defensivo que poucos jogadores têm. A incógnita central é saber se o histórico de lesão representa um padrão preocupante ou apenas circunstância de má sorte.",
      "attributes": {
        "Athleticism": 2.8,
        "Shooting": 2.1,
        "Playmaking": 1.7,
        "Defense": 4.5,
        "Rebounding": 2.4,
        "BBIQ": 1.5
      },
      "evaluation": {
        "version": "manual_editor_v1",
        "floor": {
          "score": 40,
          "label": "G-League / two-way",
          "note": ""
        },
        "ceiling": {
          "score": 75,
          "label": "All-Star",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "Medical/context",
          "note": ""
        },
        "tools": {
          "shooting": "Question",
          "creation": "Question",
          "defense": "Elite",
          "rebounding": "Plus",
          "efficiency": "Question"
        },
        "note": ""
      }
    },
    "accentColor": "#f97316"
  },
  {
    "id": 20,
    "name": "Karim Lopez",
    "position": "SF/PF",
    "team": "Mexico",
    "age": "N/A",
    "height": "6'9\"",
    "weight": "220 lbs",
    "wingspan": "7'1\"",
    "tier": "MID_1ST",
    "rank": 19,
    "stats": {
      "ppg": null,
      "rpg": null,
      "apg": null,
      "fgp": null,
      "threep": null,
      "ftp": null,
      "per": null,
      "ts": null,
      "usg": null,
      "efg": null,
      "astTo": null,
      "blkPct": null,
      "stlPct": null,
      "games": null,
      "fgm": null,
      "fga": null,
      "threepm": null,
      "threepa": null
    },
    "scouting": {
      "strengths": [
        "Ferramentas fisicas claras para ala: 6'9 de altura e 7'1 de envergadura estimada",
        "Perfil internacional com upside, comprimento e versatilidade de ataque",
        "DraftBallr destaca potencial de starter se o arremesso e a defesa evoluirem"
      ],
      "weaknesses": [
        "DraftBallr nao tem amostra estatistica conectada para ele no painel",
        "Consistencia de arremesso e defesa ainda aparecem como pontos de desenvolvimento"
      ],
      "notes": "Lopez projeta ser o primeiro mexicano nascido no país a ser escolhido na primeira rodada do draft — uma trajetória construída sobre dois anos produtivos na NBL australiana pelo programa Next Stars dos New Zealand Breakers, o mesmo caminho percorrido por LaMelo Ball, Josh Giddey e Alex Sarr. O jogo está visivelmente desacelerando para ele: compostura com a bola, execução rápida de leituras e ausência de excesso de drible são marcas de um prospecto de 18 anos com maturidade de jogo fora do comum para a idade. A avaliação honesta reconhece que ele ainda é um \"jack of all trades\" sem uma habilidade isolada em que se apoiar imediatamente na NBA, mas a combinação de fisicalidade, versatilidade defensiva e flashes de criação como ala grande representa um teto de construção genuinamente interessante.",
      "attributes": {
        "Athleticism": 5,
        "Shooting": 5,
        "Playmaking": 5,
        "Defense": 5,
        "Rebounding": 5,
        "BBIQ": 5
      },
      "evaluation": {
        "version": "manual_editor_v1",
        "floor": {
          "score": 40,
          "label": "G-League / two-way",
          "note": ""
        },
        "ceiling": {
          "score": 70,
          "label": "Starter",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "Role clarity",
          "note": ""
        },
        "tools": {
          "shooting": "Solid",
          "creation": "Question",
          "defense": "Question",
          "rebounding": "Solid",
          "efficiency": "Solid"
        },
        "note": ""
      }
    },
    "accentColor": "#e8a6b8"
  },
  {
    "id": 21,
    "name": "Malachi Moreno",
    "position": "C/PF",
    "team": "Kentucky",
    "age": 19,
    "height": "7'0\"",
    "weight": "240 lbs",
    "wingspan": "7'4\"",
    "tier": "MID_1ST",
    "rank": 20,
    "stats": {
      "ppg": 11.4,
      "rpg": 6.3,
      "apg": 1.2,
      "fgp": 52.7,
      "threep": 0,
      "ftp": 64.2,
      "per": 18.1,
      "ts": 62.3,
      "usg": 18.2,
      "efg": 58.2,
      "astTo": 1.4,
      "blkPct": 7.3,
      "stlPct": 1.3,
      "games": 36,
      "fgm": 2.7,
      "fga": 4.6,
      "threepm": 0,
      "threepa": 0.1
    },
    "scouting": {
      "strengths": [
        "Tamanho e envergadura de rim protector de nível NBA",
        "Eficiência alta como finalizador (52.7% FG) em posições de baixo posto",
        "All-SEC Freshman Team 2026"
      ],
      "weaknesses": [
        "Sem arremesso externo — zero tentativas de 3 em 2025-26",
        "Lance livre baixo (64.2%) revela limitações de toque"
      ],
      "notes": "Moreno é um prospecto de perfil moderno para a posição: baixo uso, boa distribuição para um pivô, alto índice Morey e presença frequente na linha de lances livres. O BPM elevado sugere impacto real enquanto está em quadra. O obstáculo central é a finalização na borda — o único caminho ofensivo verdadeiramente disponível para ele, dado que não arremessa de três pontos. Se não resolver essa conversão, o teto ofensivo se estreita consideravelmente, independentemente das outras qualidades que apresenta.",
      "attributes": {
        "Athleticism": 4.1,
        "Shooting": 3.4,
        "Playmaking": 3,
        "Defense": 5.4,
        "Rebounding": 4.5,
        "BBIQ": 5.1
      },
      "evaluation": {
        "version": "manual_editor_v1",
        "floor": {
          "score": 40,
          "label": "G-League / two-way",
          "note": ""
        },
        "ceiling": {
          "score": 60,
          "label": "Rotation",
          "note": ""
        },
        "risk": {
          "level": "High",
          "reason": "Role clarity",
          "note": ""
        },
        "tools": {
          "shooting": "Question",
          "creation": "Question",
          "defense": "Plus",
          "rebounding": "Solid",
          "efficiency": "Solid"
        },
        "note": ""
      }
    },
    "accentColor": "#f59e0b"
  },
  {
    "id": 22,
    "name": "Amari Allen",
    "position": "SF/PF",
    "team": "Alabama",
    "age": 19,
    "height": "6'7\"",
    "weight": "210 lbs",
    "wingspan": "6'11\"",
    "tier": "MID_1ST",
    "rank": 21,
    "stats": {
      "ppg": 12.6,
      "rpg": 5.9,
      "apg": 2.3,
      "fgp": 48.4,
      "threep": 36.2,
      "ftp": 77.3,
      "per": 19.4,
      "ts": 57,
      "usg": 19.3,
      "efg": 53.3,
      "astTo": 2.3,
      "blkPct": 2.2,
      "stlPct": 2,
      "games": 32,
      "fgm": 3.8,
      "fga": 8.5,
      "threepm": 1.5,
      "threepa": 4.3
    },
    "scouting": {
      "strengths": [
        "Passador acima da média para a posição (A/T ratio de 2.3)",
        "Defensor versátil e reboteiro consistente",
        "Arremessador de 3 capaz (36.2%) — spacing real"
      ],
      "weaknesses": [
        "Pontuação modesta (12.6 PPG) — ainda não provou escalar ofensivamente",
        "Precisará definir papel principal na NBA"
      ],
      "notes": "Allen é descrito como o conector mais talentoso e silencioso da classe, com tamanho posicional adequado, tomada de decisão acima da média e capacidade de complementar diferentes estruturas ofensivas. Seu arremesso ainda está em desenvolvimento, mas o QI ofensivo e a inteligência de leitura compensam a limitação temporária — são atributos que tendem a perdurar mais do que percentuais de uma temporada. É o tipo de prospecto cujo valor real só se revela dentro de sistemas bem construídos, onde a capacidade de conectar jogadas sem desperdiçar posse se torna um diferencial concreto.",
      "attributes": {
        "Athleticism": 4.9,
        "Shooting": 6.1,
        "Playmaking": 5.3,
        "Defense": 5.6,
        "Rebounding": 4.9,
        "BBIQ": 5.9
      },
      "evaluation": {
        "version": "manual_editor_v1",
        "floor": {
          "score": 50,
          "label": "Deep bench",
          "note": ""
        },
        "ceiling": {
          "score": 68,
          "label": "Starter",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "Shooting consistency",
          "note": ""
        },
        "tools": {
          "shooting": "Solid",
          "creation": "Plus",
          "defense": "Solid",
          "rebounding": "Plus",
          "efficiency": "Solid"
        },
        "note": ""
      }
    },
    "accentColor": "#f59e0b"
  },
  {
    "id": 24,
    "name": "Isaiah Evans",
    "position": "SG",
    "team": "Duke",
    "age": 19,
    "height": "6'6\"",
    "weight": "180 lbs",
    "wingspan": "6'10\"",
    "tier": "MID_1ST",
    "rank": 22,
    "stats": {
      "ppg": 11.2,
      "rpg": 4.3,
      "apg": 1.8,
      "fgp": 44.2,
      "threep": 36.1,
      "ftp": 79.8,
      "per": 17.5,
      "ts": 59,
      "usg": 21.8,
      "efg": 55,
      "astTo": 1.1,
      "blkPct": 2.9,
      "stlPct": 1.5,
      "games": 38,
      "fgm": 4.9,
      "fga": 11.3,
      "threepm": 2.7,
      "threepa": 7.4
    },
    "scouting": {
      "strengths": [
        "Tamanho wing com tiro de 3 sólido (36.1%) e comprometimento defensivo",
        "Assumiu usage maior no segundo semestre com Boozer dobrado",
        "Produção em contexto de elite confirma base técnica"
      ],
      "weaknesses": [
        "Criação fora da bola predominante — limitações como ball handler",
        "Explosividade atlética média para a posição"
      ],
      "notes": "Evans é um guard de 6'6\" com mecanismo de arremesso de alta liberação que, combinado com sua envergadura, torna cada tentativa um problema complexo para qualquer defensor. A movimentação em telas e a capacidade de abrir espaço na linha de três — como opção de pop ou cortador — forçam decisões difíceis de forma constante. Ainda em desenvolvimento como jogador completo, a qualidade do arremesso por si só já garante impacto ofensivo consistente em nível profissional.",
      "attributes": {
        "Athleticism": 4.9,
        "Shooting": 7,
        "Playmaking": 3.5,
        "Defense": 5.3,
        "Rebounding": 4.7,
        "BBIQ": 4.6
      },
      "evaluation": {
        "version": "manual_editor_v1",
        "floor": {
          "score": 48,
          "label": "Deep bench",
          "note": ""
        },
        "ceiling": {
          "score": 65,
          "label": "Starter",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "Defense translation",
          "note": ""
        },
        "tools": {
          "shooting": "Plus",
          "creation": "Solid",
          "defense": "Question",
          "rebounding": "Question",
          "efficiency": "Plus"
        },
        "note": ""
      }
    },
    "accentColor": "#f59e0b"
  },
  {
    "id": 26,
    "name": "Christian Anderson",
    "position": "PG",
    "team": "Texas Tech",
    "age": 20,
    "height": "6'6\"",
    "weight": "205 lbs",
    "wingspan": "6'10\"",
    "tier": "MID_1ST",
    "rank": 23,
    "stats": {
      "ppg": 18.9,
      "rpg": 4.7,
      "apg": 2.8,
      "fgp": 46.8,
      "threep": 42.5,
      "ftp": 83.4,
      "per": 22.1,
      "ts": 62.6,
      "usg": 25.2,
      "efg": 59.7,
      "astTo": 2.2,
      "blkPct": 0.7,
      "stlPct": 2.2,
      "games": 33,
      "fgm": 6.2,
      "fga": 13.1,
      "threepm": 3.3,
      "threepa": 7.9
    },
    "scouting": {
      "strengths": [
        "Arremessador de elite (42.5% de 3 com 3.4 cestas por jogo)",
        "Salta de 10.6 para 18.9 PPG no segundo ano — explosão de produção",
        "All-Big 12 First Team — scorer premium em conferência de alto nível"
      ],
      "weaknesses": [
        "Playmaking como iniciador primário ainda limitado (2.8 APG)",
        "Sem grande criação fora do arremesso"
      ],
      "notes": "Anderson é o prospecto com o perfil ofensivo mais completo desta série: eficiência excepcional, criação real para companheiros, arremesso de três com volume e autonomia, e trajetória de evolução clara entre as duas temporadas universitárias. As limitações estão no físico — envergadura e peso abaixo da média para a posição — e no impacto defensivo, que provavelmente o define como jogador de contribuição ofensiva prioritária na NBA. Se a eficiência se mantiver em alto nível, o teto como criador e arremessador é genuinamente elevado.",
      "attributes": {
        "Athleticism": 5.6,
        "Shooting": 9.3,
        "Playmaking": 6.4,
        "Defense": 4.8,
        "Rebounding": 3.9,
        "BBIQ": 7
      },
      "evaluation": {
        "version": "manual_editor_v1",
        "floor": {
          "score": 50,
          "label": "Deep bench",
          "note": ""
        },
        "ceiling": {
          "score": null,
          "label": "",
          "note": ""
        },
        "risk": {
          "level": "High",
          "reason": "Defense translation",
          "note": ""
        },
        "tools": {
          "shooting": "Elite",
          "creation": "Plus",
          "defense": "Question",
          "rebounding": "Solid",
          "efficiency": "Elite"
        },
        "note": ""
      }
    },
    "accentColor": "#f59e0b"
  },
  {
    "id": 27,
    "name": "Koa Peat",
    "position": "PF",
    "team": "Arizona",
    "age": 19,
    "height": "6'8\"",
    "weight": "235 lbs",
    "wingspan": "6'11\"",
    "tier": "MID_1ST",
    "rank": 24,
    "stats": {
      "ppg": 14.1,
      "rpg": 7.3,
      "apg": 2.1,
      "fgp": 53.6,
      "threep": 0,
      "ftp": 72.4,
      "per": 19.8,
      "ts": 55.7,
      "usg": 24.4,
      "efg": 53.7,
      "astTo": 1.6,
      "blkPct": 2.5,
      "stlPct": 1.3,
      "games": 36,
      "fgm": 5.6,
      "fga": 10.5,
      "threepm": 0.2,
      "threepa": 0.6
    },
    "scouting": {
      "strengths": [
        "Físico de \"Mack truck\" — usa força para dominar rebote e defesa de pós",
        "Finalizador explosivo no aro com atletismo para sua estatura (53.6% FG)",
        "QI de rebote e esforço que enchem a caixa de estatísticas silenciosas"
      ],
      "weaknesses": [
        "Zero tentativas de arremesso de 3 — perfil ofensivo potencialmente limitante na NBA moderna",
        "Consistência inconsistente — jogos de alto impacto alternados com aparições invisíveis"
      ],
      "notes": "Peat explodiu no início da temporada a ponto de levantar comparações com Cam Boozer, mas a exposição prolongada revelou uma dieta ofensiva quase exclusivamente dentro do arco aos 6'8\" — dependência de jumpers em fade no garrafão quando não finaliza direto no aro. A aposta em Peat é sobre intangibles e sensibilidade de jogo: ele acumula pontos dentro das brechas do ataque sem precisar ter a bola nas mãos e é um passador excepcional para seu perfil de jogador. O prospecto que emerge dessa avaliação é alguém que impacta mais do que os números indicam, mas que depende de desenvolvimento do arsenal ofensivo externo para desbloquear seu verdadeiro teto.",
      "attributes": {
        "Athleticism": 4.4,
        "Shooting": 2.7,
        "Playmaking": 4.7,
        "Defense": 4.1,
        "Rebounding": 4.3,
        "BBIQ": 5.1
      },
      "evaluation": {
        "version": "manual_editor_v1",
        "floor": {
          "score": null,
          "label": "",
          "note": ""
        },
        "ceiling": {
          "score": 70,
          "label": "Starter",
          "note": ""
        },
        "risk": {
          "level": "Moderate",
          "reason": "Shooting consistency",
          "note": ""
        },
        "tools": {
          "shooting": "Solid",
          "creation": "Plus",
          "defense": "Solid",
          "rebounding": "Solid",
          "efficiency": "Solid"
        },
        "note": ""
      }
    },
    "accentColor": "#f59e0b"
  },
  {
    "id": 28,
    "name": "Brayden Burries",
    "position": "SG",
    "team": "Arizona",
    "age": 19,
    "height": "6'4\"",
    "weight": "205 lbs",
    "wingspan": "6'7\"",
    "tier": "MID_1ST",
    "rank": 25,
    "stats": {
      "ppg": 14.2,
      "rpg": 3.5,
      "apg": 4.8,
      "fgp": 45.3,
      "threep": 38.4,
      "ftp": 81.2,
      "per": 19.2,
      "ts": 61.6,
      "usg": 21.6,
      "efg": 57.2,
      "astTo": 1.7,
      "blkPct": 0.7,
      "stlPct": 2.8,
      "games": 39,
      "fgm": 5.4,
      "fga": 11,
      "threepm": 1.8,
      "threepa": 4.6
    },
    "scouting": {
      "strengths": [
        "Arremessador fluente de 3 (38.4%)",
        "Playmaking sólido em time de Final Four",
        "Produção em sistema de alta exigência"
      ],
      "weaknesses": [
        "Tamanho de guarda NBA (6'3\")",
        "Falta de criação off the dribble explícita"
      ],
      "notes": "Burries é um defensor agressivo e predatório no perímetro, com habilidade específica de pressionar armadores adversários de alto nível — uma função valiosa que muitos guards não conseguem exercer com consistência. Seu papel secundário no Arizona manteve encoberto um potencial ainda não explorado de atuar como armador titular no futuro. É o tipo de perfil que cresce na avaliação quanto mais se entende o impacto das funções invisíveis do basquete.",
      "attributes": {
        "Athleticism": 5.1,
        "Shooting": 8.1,
        "Playmaking": 5.6,
        "Defense": 5.2,
        "Rebounding": 3.9,
        "BBIQ": 6.2
      },
      "evaluation": {
        "version": "manual_editor_v1",
        "floor": {
          "score": 64,
          "label": "Rotation",
          "note": ""
        },
        "ceiling": {
          "score": 70,
          "label": "Starter",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "Decision making",
          "note": ""
        },
        "tools": {
          "shooting": "Plus",
          "creation": "Solid",
          "defense": "Plus",
          "rebounding": "Plus",
          "efficiency": "Plus"
        },
        "note": ""
      }
    },
    "accentColor": "#f59e0b"
  },
  {
    "id": 31,
    "name": "Joshua Jefferson",
    "position": "SF/PF",
    "team": "Iowa State",
    "age": 22.6,
    "height": "6'9\"",
    "weight": "240 lbs",
    "wingspan": "6'10\"",
    "tier": "MID_1ST",
    "rank": 26,
    "stats": {
      "ppg": 16.4,
      "rpg": 7.4,
      "apg": 4.8,
      "fgp": 47.1,
      "threep": 34.5,
      "ftp": 70,
      "per": null,
      "ts": 56,
      "usg": 28.6,
      "efg": 51.7,
      "astTo": 1.9,
      "blkPct": 3.4,
      "stlPct": 3.1,
      "games": 35,
      "fgm": 5.5,
      "fga": 11.8,
      "threepm": 1.1,
      "threepa": 3.1,
      "ftm": 4.3,
      "fta": 6.1,
      "totals": {
        "games": 35,
        "fgm": 194,
        "fga": 412,
        "threepm": 38,
        "threepa": 110,
        "ftm": 149,
        "fta": 213,
        "pts": 575,
        "reb": 260,
        "ast": 167,
        "tov": 89,
        "stl": 57,
        "blk": 29
      }
    },
    "scouting": {
      "strengths": [
        "Point-forward real: 4.8 APG, 27.7% AST e cria??o de alto n?vel para a posi??o.",
        "Defesa muito ativa: 3.1% STL, 3.4% BLK e DBPM 5.5.",
        "Volume f?sico e rebote: 7.4 RPG com 240 lbs no perfil DraftBallr."
      ],
      "weaknesses": [
        "Efici?ncia geral mediana para o volume: 56.0% TS e -0.5 rTS.",
        "Arremesso ainda precisa estabilizar: 34.5% de 3 e 70.0% FT."
      ],
      "notes": "Jefferson foi possivelmente o forward universit?rio mais criativo na distribui??o da temporada, com leitura de jogo coletivo que raramente aparece nessa posi??o. A disposi??o para envolver colegas em a??es complexas reflete QI ofensivo genuinamente diferenciado. A criatividade ?s vezes ultrapassa os limites do control?vel ? ele erra mais do que deveria nos momentos em que testa os pr?prios limites ?, mas isso ? o reverso de uma qualidade real, n?o um defeito estrutural.",
      "attributes": {
        "Athleticism": 5.6,
        "Shooting": 5.8,
        "Playmaking": 7,
        "Defense": 6.2,
        "Rebounding": 6.4,
        "BBIQ": 7.2
      },
      "evaluation": {
        "version": "manual_editor_v1",
        "floor": {
          "score": 51,
          "label": "Deep bench",
          "note": ""
        },
        "ceiling": {
          "score": 65,
          "label": "Starter",
          "note": ""
        },
        "risk": {
          "level": "Low",
          "reason": "Age/upside",
          "note": ""
        },
        "tools": {
          "shooting": "Solid",
          "creation": "Plus",
          "defense": "Plus",
          "rebounding": "Plus",
          "efficiency": "Solid"
        },
        "note": "Restaurado por elegibilidade autom?tica/idade; stats ficam em branco at? reconcilia??o com fonte limpa."
      }
    },
    "accentColor": "#8bbfe8",
    "eligibilityStatus": "automatic_age_eligible",
    "archetype": "Winning Forward / Wing F",
    "dataSources": {
      "traditionalStats": "Iowa State Athletics cumulative statistics",
      "traditionalStatsUrl": "https://cyclones.com/sports/mens-basketball/stats/2025-26",
      "advancedStats": "DraftBallr player profile",
      "advancedStatsUrl": "https://draftballr.com/players/joshua-jefferson",
      "lastVerified": "2026-04-30"
    },
    "statSourceNote": "Traditional box stats from Iowa State cumulative statistics; advanced context from DraftBallr."
  },
  {
    "id": 15,
    "name": "Chris Cenac Jr.",
    "position": "PF",
    "team": "Houston",
    "age": 19,
    "height": "6'9\"",
    "weight": "225 lbs",
    "wingspan": "7'2\"",
    "tier": "MID_1ST",
    "rank": 27,
    "stats": {
      "ppg": 13.4,
      "rpg": 7.2,
      "apg": 1.8,
      "fgp": 54.1,
      "threep": 34.2,
      "ftp": 70.8,
      "per": 20.2,
      "ts": 54.6,
      "usg": 19.5,
      "efg": 53.6,
      "astTo": 0.8,
      "blkPct": 2.6,
      "stlPct": 1.9,
      "games": 37,
      "fgm": 3.9,
      "fga": 8,
      "threepm": 0.8,
      "threepa": 2.4
    },
    "scouting": {
      "strengths": [
        "Forward versátil em sistema de defesa de alto nível de Houston",
        "Arremessador de 3 capaz (34.2%) com envergadura 7'2\"",
        "Finalização eficiente no aro e em pick-and-roll"
      ],
      "weaknesses": [
        "Criação ISO quase inexistente — será um complemento, não um líder",
        "Lance livre baixo (70.8%) sugere limitações de toque no arremesso"
      ],
      "notes": "Cenac Jr. é um prospecto com base física diferenciada e eficiência real perto do aro. As limitações centrais estão na criação de jogo próprio, na frequência e no aproveitamento nos lances livres, e na consistência do arremesso de média e longa distância. O desenvolvimento dessas áreas, especialmente a autonomia ofensiva, será o fator determinante para definir se ele se consolida como jogador de rotação ou alcança um papel mais relevante na liga.",
      "attributes": {
        "Athleticism": 4.4,
        "Shooting": 4.3,
        "Playmaking": 3.2,
        "Defense": 4.8,
        "Rebounding": 4.3,
        "BBIQ": 4.1
      },
      "evaluation": {
        "version": "manual_editor_v1",
        "floor": {
          "score": 40,
          "label": "G-League / two-way",
          "note": ""
        },
        "ceiling": {
          "score": 65,
          "label": "Starter",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "Role clarity",
          "note": ""
        },
        "tools": {
          "shooting": "Solid",
          "creation": "Question",
          "defense": "Question",
          "rebounding": "Plus",
          "efficiency": "Solid"
        },
        "note": ""
      }
    },
    "accentColor": "#f59e0b"
  },
  {
    "id": 29,
    "name": "Meleek Thomas",
    "position": "SG/SF",
    "team": "Arkansas",
    "age": 19,
    "height": "6'5\"",
    "weight": "185 lbs",
    "wingspan": "6'6\"",
    "tier": "MID_1ST",
    "rank": 28,
    "stats": {
      "ppg": 13.8,
      "rpg": 4.4,
      "apg": 2.6,
      "fgp": 46.1,
      "threep": 41.6,
      "ftp": 78.9,
      "per": 18.7,
      "ts": 55.9,
      "usg": 22.1,
      "efg": 52.2,
      "astTo": 2.5,
      "blkPct": 0.6,
      "stlPct": 2.8,
      "games": 37,
      "fgm": 5.5,
      "fga": 12.6,
      "threepm": 2.2,
      "threepa": 5.3
    },
    "scouting": {
      "strengths": [
        "Tiro de 3 elite (41.6%) em papel secundário",
        "Defensor ativo (2.8 STL%) com turnovers baixíssimos (8.2 TO%)",
        "Upside de criador baseado em tape de highschool"
      ],
      "weaknesses": [
        "Produziu como arma secundária — precisa provar impacto como foco",
        "Tamanho médio para wing NBA"
      ],
      "notes": "Thomas é um prospecto com uma combinação incomum: alto volume ofensivo, arremesso de três eficiente e controle de turnovers no nível de elite para a posição e a idade. O problema estrutural está na meia distância — zona que ele frequenta demais para o que converte — e na baixa taxa de criação para companheiros, o que limita sua utilidade como articulador do ataque. Se aprender a reduzir os arremessos de meia distância ineficientes e desenvolver mais autonomia no perímetro, o perfil ofensivo se torna muito mais difícil de defender. A defesa, por ora, não é diferencial.",
      "attributes": {
        "Athleticism": 5.1,
        "Shooting": 7.6,
        "Playmaking": 6,
        "Defense": 4.9,
        "Rebounding": 3.4,
        "BBIQ": 6.1
      },
      "evaluation": {
        "version": "manual_editor_v1",
        "floor": {
          "score": 50,
          "label": "Deep bench",
          "note": ""
        },
        "ceiling": {
          "score": null,
          "label": "",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "Decision making",
          "note": ""
        },
        "tools": {
          "shooting": "Elite",
          "creation": "Question",
          "defense": "Plus",
          "rebounding": "Question",
          "efficiency": "Solid"
        },
        "note": ""
      }
    },
    "accentColor": "#f59e0b"
  },
  {
    "id": 30,
    "name": "Milan Momcilovic",
    "position": "PF",
    "team": "Iowa St.",
    "age": 21.8,
    "height": "6'8\"",
    "weight": "225 lbs",
    "wingspan": "6'11\"",
    "tier": "MID_1ST",
    "rank": 29,
    "stats": {
      "ppg": 16.9,
      "rpg": 3.1,
      "apg": 1,
      "fgp": 50.5,
      "threep": 48.7,
      "ftp": 87.8,
      "per": null,
      "ts": 69.3,
      "usg": 18.1,
      "efg": 67.2,
      "astTo": 1.2,
      "blkPct": 1,
      "stlPct": 1.6,
      "games": 37,
      "fgm": 5.6,
      "fga": 11.1,
      "threepm": 3.7,
      "threepa": 7.5
    },
    "scouting": {
      "strengths": [
        "Especialista de elite: 48.7% de 3, 69.3% TS e 67.2% eFG no DraftBallr",
        "Volume de arremesso altissimo para ala, com 15.1 tentativas de 3 por 100 posses",
        "Baixo turnover e espacamento premium em contexto de Iowa State"
      ],
      "weaknesses": [
        "Pouca pressao de aro e baixo volume de rebotes ofensivos",
        "Impacto defensivo e criacao propria ainda limitam o teto"
      ],
      "notes": "Momcilovic é um prospecto de perfil muito específico: arremessador de elite no catch-and-shoot, com eficiência estatisticamente fora da curva nesta temporada e trajetória de melhora documentada ao longo de três anos. As limitações são igualmente específicas — quase nenhuma criação própria, raramente busca o aro, e histórico defensivo inconsistente com ressalvas sobre o rebote. A pergunta central sobre ele não é se arremessa bem, mas se o aproveitamento excepcional se sustenta quando as defesas da NBA, muito mais organizadas, fecham as rotas de passe e reduzem os looks abertos que Iowa State gerou para ele. A resposta a essa questão determinará inteiramente o seu valor real na liga.",
      "attributes": {
        "Athleticism": 4.1,
        "Shooting": 10,
        "Playmaking": 2.6,
        "Defense": 3.4,
        "Rebounding": 1.4,
        "BBIQ": 5.5
      },
      "evaluation": {
        "version": "manual_editor_v1",
        "floor": {
          "score": 45,
          "label": "Deep bench",
          "note": ""
        },
        "ceiling": {
          "score": 70,
          "label": "Starter",
          "note": ""
        },
        "risk": {
          "level": "Moderate",
          "reason": "",
          "note": ""
        },
        "tools": {},
        "note": ""
      }
    },
    "accentColor": "#e8a6b8"
  },
  {
    "id": 32,
    "name": "Ebuka Okorie",
    "position": "SG/SF",
    "team": "Stanford",
    "age": 20,
    "height": "6'5\"",
    "weight": "200 lbs",
    "wingspan": "6'9\"",
    "tier": "SLEEPER",
    "rank": 30,
    "stats": {
      "ppg": 15.1,
      "rpg": 4.6,
      "apg": 2.3,
      "fgp": 45.8,
      "threep": 36.7,
      "ftp": 80.1,
      "per": 19.6,
      "ts": 58.9,
      "usg": 30.1,
      "efg": 52.8,
      "astTo": 1.9,
      "blkPct": 1,
      "stlPct": 2.7,
      "games": 31,
      "fgm": 7.5,
      "fga": 16.2,
      "threepm": 2,
      "threepa": 5.7
    },
    "scouting": {
      "strengths": [
        "Dribble separator violento — explosão downhill mais rápida da classe",
        "Criador explosivo que força decisões rápidas da defesa",
        "Arremessador capaz (36.7%)"
      ],
      "weaknesses": [
        "Consistência no controle após a explosão inicial",
        "Precisão no arremesso em altos volumes"
      ],
      "notes": "Okorie liderou a ACC em pontuação na temporada, com 8 jogos com pelo menos 30 pontos — quebrando o recorde de calouros da conferência estabelecido por Marvin Bagley III. É descrito como o separador de drible mais violento e o atacante mais inegável descendo a quadra da classe — um perfil raro de guard com velocidade devastadora aliada a controle de corpo e manipulação de ritmo sofisticados. A ressalva mais consistente entre os scouts é a disposição como criador para os colegas: os instintos de finalizador às vezes suprimem a visão de jogo num grau que precisará evoluir no nível profissional.",
      "attributes": {
        "Athleticism": 6,
        "Shooting": 6.9,
        "Playmaking": 5.7,
        "Defense": 5.3,
        "Rebounding": 3.9,
        "BBIQ": 5.6
      },
      "evaluation": {
        "version": "manual_editor_v1",
        "floor": {
          "score": 55,
          "label": "Rotation",
          "note": ""
        },
        "ceiling": {
          "score": 65,
          "label": "Starter",
          "note": ""
        },
        "risk": {
          "level": "Low",
          "reason": "Decision making",
          "note": ""
        },
        "tools": {},
        "note": ""
      }
    },
    "accentColor": "#f59e0b"
  },
  {
    "id": 33,
    "name": "Isiah Harwell",
    "position": "SG",
    "team": "Houston",
    "age": 20,
    "height": "6'4\"",
    "weight": "190 lbs",
    "wingspan": "6'8\"",
    "tier": "SLEEPER",
    "rank": 31,
    "stats": {
      "ppg": 13.5,
      "rpg": 3.4,
      "apg": 3.6,
      "fgp": 46.2,
      "threep": 37.8,
      "ftp": 82.4,
      "per": 18.3,
      "ts": 59.4,
      "usg": 22.9,
      "efg": null,
      "astTo": null,
      "blkPct": null,
      "stlPct": null,
      "games": null,
      "fgm": null,
      "fga": null,
      "threepm": null,
      "threepa": null
    },
    "scouting": {
      "strengths": [
        "Produto de sistema defensivo exigente de Houston",
        "Arremessador de 3 sólido (37.8%)",
        "Dois lados da bola com comprometimento defensivo"
      ],
      "weaknesses": [
        "Sem papel estelar definido — sempre arma secundária",
        "Criação primária limitada"
      ],
      "notes": "Guarda de rotação com valor real. System-dependent mas com habilidades transferíveis.",
      "attributes": {
        "Athleticism": 4.8,
        "Shooting": 7.1,
        "Playmaking": 4.7,
        "Defense": 4.8,
        "Rebounding": 4.3,
        "BBIQ": 5
      }
    },
    "accentColor": "#f59e0b"
  },
  {
    "id": 34,
    "name": "Tyler Tanner",
    "position": "PG",
    "team": "Vanderbilt",
    "age": 21,
    "height": "6'3\"",
    "weight": "185 lbs",
    "wingspan": "6'7\"",
    "tier": "SLEEPER",
    "rank": 32,
    "stats": {
      "ppg": 16.4,
      "rpg": 3.9,
      "apg": 5.1,
      "fgp": 46.6,
      "threep": 38.7,
      "ftp": 83.5,
      "per": 21.3,
      "ts": 61.2,
      "usg": 26.3,
      "efg": 54.9,
      "astTo": 2.7,
      "blkPct": 1.1,
      "stlPct": 4.1,
      "games": 36,
      "fgm": 6.3,
      "fga": 13.1,
      "threepm": 1.7,
      "threepa": 4.5
    },
    "scouting": {
      "strengths": [
        "All-SEC First Team — grande avanço no segundo ano",
        "Playmaking e scoring balanceados (16/5 PTS/AST)",
        "Arremessador de 3 elite (38.7%)"
      ],
      "weaknesses": [
        "Tamanho limítrofe (6'3\")",
        "Defesa no ponto de ataque questiona a retenção na NBA"
      ],
      "notes": "Tanner é um prospecto de números excepcionais em quase todas as categorias relevantes — eficiência, criação, controle de turnovers, roubos, impacto geral — produzidos com carga ofensiva real e evolução clara entre as temporadas. O BPM é o mais alto entre os perfis desta série. A única coluna de fraquezas listada no perfil é inteiramente composta por medidas físicas: altura, envergadura, peso e rebote ofensivo. É um caso raro em que o corpo e os números apontam em direções opostas, e a avaliação final depende quase inteiramente de quanto uma franquia da NBA está disposta a apostar que a competência compensa a estrutura.",
      "attributes": {
        "Athleticism": 6.3,
        "Shooting": 8.3,
        "Playmaking": 7.4,
        "Defense": 6.4,
        "Rebounding": 4.8,
        "BBIQ": 7.5
      },
      "evaluation": {
        "version": "manual_editor_v1",
        "floor": {
          "score": 40,
          "label": "G-League / two-way",
          "note": ""
        },
        "ceiling": {
          "score": 60,
          "label": "Rotation",
          "note": ""
        },
        "risk": {
          "level": "High",
          "reason": "",
          "note": ""
        },
        "tools": {
          "shooting": "Plus",
          "creation": "Plus",
          "defense": "Question",
          "rebounding": "Solid",
          "efficiency": "Plus"
        },
        "note": ""
      }
    },
    "accentColor": "#f59e0b"
  },
  {
    "id": 35,
    "name": "Henri Veesaar",
    "position": "C/PF",
    "team": "North Carolina",
    "age": 22,
    "height": "7'1\"",
    "weight": "240 lbs",
    "wingspan": "7'4\"",
    "tier": "SLEEPER",
    "rank": 33,
    "stats": {
      "ppg": 12.4,
      "rpg": 7.1,
      "apg": 1.6,
      "fgp": 54.2,
      "threep": 29.4,
      "ftp": 71.8,
      "per": 19.1,
      "ts": 66.4,
      "usg": 22.7,
      "efg": 66.7,
      "astTo": 1.2,
      "blkPct": 3.8,
      "stlPct": 1.1,
      "games": 31,
      "fgm": 6.7,
      "fga": 11,
      "threepm": 1.3,
      "threepa": 3
    },
    "scouting": {
      "strengths": [
        "Dimensões elite para rim protector (7'1\" + 7'4\" wingspan)",
        "Eficiência alta no aro (54.2% FG)",
        "Reboteiro consistente em Big ACC"
      ],
      "weaknesses": [
        "Tiro de 3 limitado (29.4%) — espacing mínimo",
        "Jogo mais velho (22) sem explosividade de elite"
      ],
      "notes": "Veesaar é um pivô de 7 pés com a rara combinação de arremesso de perímetro e presença ofensiva convencional: converte 75,9% das tentativas no aro e aparece entre os líderes nacionais em enterradas, enquanto também acerta a bola de três em volume crescente. O senso de passe é um ativo real — ele encontra cortadores de posições estacionárias, opera no short-roll e executa sets de high-low com precisão, o que o torna mais do que uma âncora estática. A principal fragilidade está na defesa em espaço: sua mobilidade horizontal limitada o torna um alvo em situações de switch, e o desenvolvimento como protetor de aro ainda deixa a desejar, exigindo que seja colocado ao lado de um ala mais atlético para cobrir seu raio de atuação.",
      "attributes": {
        "Athleticism": 4.4,
        "Shooting": 5.8,
        "Playmaking": 3.6,
        "Defense": 4.2,
        "Rebounding": 4.5,
        "BBIQ": 5.5
      },
      "evaluation": {
        "version": "manual_editor_v1",
        "floor": {
          "score": 45,
          "label": "Deep bench",
          "note": ""
        },
        "ceiling": {
          "score": 70,
          "label": "Starter",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "",
          "note": ""
        },
        "tools": {
          "shooting": "Elite",
          "creation": "Question",
          "defense": "Question",
          "rebounding": "Plus",
          "efficiency": "Elite"
        },
        "note": ""
      }
    },
    "accentColor": "#f59e0b"
  },
  {
    "id": 37,
    "name": "Dailyn Swain",
    "position": "SF/PF",
    "team": "Texas",
    "age": 22,
    "height": "6'8\"",
    "weight": "215 lbs",
    "wingspan": "7'1\"",
    "tier": "SLEEPER",
    "rank": 34,
    "stats": {
      "ppg": 15.3,
      "rpg": 6.2,
      "apg": 2.4,
      "fgp": 48.1,
      "threep": 36.4,
      "ftp": 76.2,
      "per": 19.8,
      "ts": 63.3,
      "usg": 25.5,
      "efg": 57.8,
      "astTo": 1.3,
      "blkPct": 1,
      "stlPct": 2.8,
      "games": 35,
      "fgm": 5.9,
      "fga": 11,
      "threepm": 0.9,
      "threepa": 2.6
    },
    "scouting": {
      "strengths": [
        "All-SEC Second Team como transfer — transição bem-sucedida",
        "Versatilidade de forward com spacing (36.4% de 3)",
        "Produção regular ao longo de toda temporada"
      ],
      "weaknesses": [
        "Maior pick (22 anos)",
        "Criação ISO limitada"
      ],
      "notes": "Swain é um ala criador de 6'7\" com handle impressionante para o seu porte, usando uma combinação de velocidade, fluidez e atletismo para superar alas e forwards maiores em situações de isolamento. Seu ataque é construído sobre pressão de bola constante ao aro, finalizações com toque apurado e capacidade de atrair faltas — gerando 5,6 tentativas de lance livre por jogo com aproveitamento de 81,5%. A visão de jogo é um atributo real: ele encontra cortadores e pivôs em rolamento com leituras precisas, e a pressão que cria ofensivamente colapsa defesas e abre espaço para os colegas.",
      "attributes": {
        "Athleticism": 5.5,
        "Shooting": 7.3,
        "Playmaking": 4.8,
        "Defense": 5.6,
        "Rebounding": 4.5,
        "BBIQ": 5.8
      },
      "evaluation": {
        "version": "manual_editor_v1",
        "floor": {
          "score": 55,
          "label": "Rotation",
          "note": ""
        },
        "ceiling": {
          "score": 65,
          "label": "Starter",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "Age/upside",
          "note": ""
        },
        "tools": {
          "shooting": "Solid",
          "creation": "Plus",
          "defense": "Plus",
          "rebounding": "Plus",
          "efficiency": "Elite"
        },
        "note": ""
      }
    },
    "accentColor": "#f59e0b"
  },
  {
    "id": 42,
    "name": "Juke Harris",
    "position": "SF/PF",
    "team": "Wake Forest",
    "age": 20,
    "height": "6'8\"",
    "weight": "215 lbs",
    "wingspan": "7'0\"",
    "tier": "SLEEPER",
    "rank": 35,
    "stats": {
      "ppg": 15.8,
      "rpg": 6.7,
      "apg": 2.1,
      "fgp": 48.3,
      "threep": 34.9,
      "ftp": 75.8,
      "per": 20.4,
      "ts": 58.1,
      "usg": 27.3,
      "efg": 52.7,
      "astTo": 1.2,
      "blkPct": 0.7,
      "stlPct": 2.1,
      "games": 35,
      "fgm": 6.7,
      "fga": 15.1,
      "threepm": 2.5,
      "threepa": 7.5
    },
    "scouting": {
      "strengths": [
        "Produção alta em volume com tamanho wing elite (6'8\" + 7'0\")",
        "Reboteiro ativo e competitivo no pós",
        "Potencial two-way com desenvolvimento"
      ],
      "weaknesses": [
        "ACC program de menor calibre — menor exposição",
        "Tiro de 3 mediano (34.9%)"
      ],
      "notes": "Harris é um prospecto com altura relevante, agressividade real na busca do contato e salto de produção expressivo no segundo ano. Os problemas são estruturais em dois pontos: conversão abaixo da média na borda e nos três pontos, que são as zonas onde mais tenta arremessar, e impacto defensivo negativo que se agravou com o aumento de minutos. O perfil ofensivo depende excessivamente dos lances livres para ser eficiente — o que é uma estratégia válida, mas frágil em níveis mais altos de jogo, onde as defesas ajustam e as arbitragens são menos generosas. O desenvolvimento da finalização limpa e da consistência no perímetro determinará se ele se torna jogador de rotação ou permanece como contribuinte pontual.",
      "attributes": {
        "Athleticism": 5.7,
        "Shooting": 5.7,
        "Playmaking": 4.5,
        "Defense": 4.8,
        "Rebounding": 5,
        "BBIQ": 5
      },
      "evaluation": {
        "version": "manual_editor_v1",
        "floor": {
          "score": 35,
          "label": "G-League / two-way",
          "note": ""
        },
        "ceiling": {
          "score": 55,
          "label": "Rotation",
          "note": ""
        },
        "risk": {
          "level": "High",
          "reason": "",
          "note": ""
        },
        "tools": {
          "shooting": "Solid",
          "creation": "Question",
          "defense": "Question",
          "rebounding": "Plus",
          "efficiency": "Solid"
        },
        "note": ""
      }
    },
    "accentColor": "#f59e0b"
  },
  {
    "id": 45,
    "name": "Matthew Able",
    "position": "SF",
    "team": "NC State",
    "age": 20,
    "height": "6'8\"",
    "weight": "210 lbs",
    "wingspan": "6'11\"",
    "tier": "SLEEPER",
    "rank": 36,
    "stats": {
      "ppg": 14.6,
      "rpg": 5.4,
      "apg": 2,
      "fgp": 47.5,
      "threep": 36.8,
      "ftp": 78.4,
      "per": 19.1,
      "ts": 54.4,
      "usg": 19.8,
      "efg": 51.4,
      "astTo": 1,
      "blkPct": 1.9,
      "stlPct": 3.3,
      "games": 34,
      "fgm": 3.1,
      "fga": 7.4,
      "threepm": 1.4,
      "threepa": 4.1
    },
    "scouting": {
      "strengths": [
        "Wing com tiro de 3 (36.8%) e tamanho para defender múltiplas posições",
        "Produtor consistente no ACC",
        "Comprimento e mobilidade two-way"
      ],
      "weaknesses": [
        "Program menor em termos de exposição nacional",
        "Criação ISO limitada"
      ],
      "notes": "Freshman freshman de NC State com perfil de wing moderno. Potencial de pick de segundo turno com valor real.",
      "attributes": {
        "Athleticism": 5.9,
        "Shooting": 6.1,
        "Playmaking": 3.6,
        "Defense": 6.9,
        "Rebounding": 5.8,
        "BBIQ": 4.1
      },
      "evaluation": {
        "version": "manual_editor_v1",
        "floor": {
          "score": 35,
          "label": "G-League / two-way",
          "note": ""
        },
        "ceiling": {
          "score": 55,
          "label": "Rotation",
          "note": ""
        },
        "risk": {
          "level": "High",
          "reason": "Role clarity",
          "note": ""
        },
        "tools": {
          "shooting": "Solid",
          "creation": "Question",
          "defense": "Question",
          "rebounding": "Question",
          "efficiency": "Question"
        },
        "note": ""
      }
    },
    "accentColor": "#f59e0b"
  },
  {
    "id": 46,
    "name": "Flory Bidunga",
    "position": "C",
    "team": "Kansas",
    "age": 21,
    "height": "6'10\"",
    "weight": "245 lbs",
    "wingspan": "7'3\"",
    "tier": "SLEEPER",
    "rank": 37,
    "stats": {
      "ppg": 10.8,
      "rpg": 7.8,
      "apg": 1.1,
      "fgp": 58.3,
      "threep": 0,
      "ftp": 62.5,
      "per": 18.2,
      "ts": 64.7,
      "usg": 19.6,
      "efg": 64,
      "astTo": 1,
      "blkPct": 9,
      "stlPct": 1.4,
      "games": 35,
      "fgm": 5.6,
      "fga": 8.8,
      "threepm": 0,
      "threepa": 0.1
    },
    "scouting": {
      "strengths": [
        "Eficiência no aro de elite (58.3% FG)",
        "Rebotetador de alta porcentagem em Big 12",
        "Dimensões autênticas para centro moderno"
      ],
      "weaknesses": [
        "Sem extensão de arremesso alguma",
        "Lance livre baixo (62.5%)"
      ],
      "notes": "Bidunga é um prospecto com impacto defensivo de elite e altíssima eficiência na finalização de jogadas, evidenciando uma transição sólida de minutagem para o segundo ano. Os problemas estruturais moram nas dimensões físicas: a altura e o peso abaixo do padrão para a posição de pivô prejudicam severamente sua capacidade de coletar rebotes e de cavar lances livres através de contato no garrafão. O perfil ofensivo é unidimensional, restrito à finalização na borda sem qualquer espaçamento de perímetro. A sua viabilidade na NBA passará por comprovar que a excelência em proteger o aro (RAPM 99) e finalizar em movimento se sustenta contra oponentes mais altos e pesados, compensando suas limitações de tamanho e de rebote.",
      "attributes": {
        "Athleticism": 5.1,
        "Shooting": 4.2,
        "Playmaking": 2.5,
        "Defense": 6,
        "Rebounding": 6.3,
        "BBIQ": 5
      },
      "evaluation": {
        "version": "manual_editor_v1",
        "floor": {
          "score": 40,
          "label": "G-League / two-way",
          "note": ""
        },
        "ceiling": {
          "score": 70,
          "label": "Starter",
          "note": ""
        },
        "risk": {
          "level": "High",
          "reason": "Role clarity",
          "note": ""
        },
        "tools": {
          "shooting": "Question",
          "creation": "Question",
          "defense": "Elite",
          "rebounding": "Plus",
          "efficiency": "Elite"
        },
        "note": ""
      }
    },
    "accentColor": "#f59e0b"
  },
  {
    "id": 49,
    "name": "Morez Johnson Jr.",
    "position": "C/PF",
    "team": "Michigan",
    "age": 21,
    "height": "6'10\"",
    "weight": "235 lbs",
    "wingspan": "7'3\"",
    "tier": "SLEEPER",
    "rank": 38,
    "stats": {
      "ppg": 11.2,
      "rpg": 7.6,
      "apg": 1.4,
      "fgp": 55.4,
      "threep": 0,
      "ftp": 65.8,
      "per": 17.9,
      "ts": 67.7,
      "usg": 21.1,
      "efg": 64.2,
      "astTo": 0.9,
      "blkPct": 4.8,
      "stlPct": 1.5,
      "games": 40,
      "fgm": 4.9,
      "fga": 7.8,
      "threepm": 0.3,
      "threepa": 0.9
    },
    "scouting": {
      "strengths": [
        "Big man de campeonato do Michigan",
        "Eficiência de finishing alta (55.4%)",
        "Reboteiro com comprimento"
      ],
      "weaknesses": [
        "Sem arremesso externo",
        "Lance livre baixo limita papel em posse"
      ],
      "notes": "Johnson tem ferramentas físicas de nível NBA — força de ancoragem, envergadura estimada em 7'2\" e atletismo explosivo — que se traduzem diretamente em defesa versátil, rebote de alto volume e finalização eficiente dentro do garrafão. Faz leituras rápidas, sabe quem é como jogador e produz jogadas vencedoras nos dois lados de forma incessante, o que coloca seu impacto em patamar diferente do que os números brutos sugerem. A principal limitação está na tomada de decisão como passador no short-roll e na ausência de jogo ofensivo além do garrafão — um arremesso de perímetro confiável ainda não está consolidado, o que pode restringir os cenários em que atua como opção de alto volume.",
      "attributes": {
        "Athleticism": 4.5,
        "Shooting": 4.6,
        "Playmaking": 2.8,
        "Defense": 5.1,
        "Rebounding": 5.4,
        "BBIQ": 5.1
      },
      "evaluation": {
        "version": "manual_editor_v1",
        "floor": {
          "score": 40,
          "label": "G-League / two-way",
          "note": ""
        },
        "ceiling": {
          "score": 65,
          "label": "Starter",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "Role clarity",
          "note": ""
        },
        "tools": {
          "shooting": "Solid",
          "creation": "Question",
          "defense": "Plus",
          "rebounding": "Solid",
          "efficiency": "Elite"
        },
        "note": ""
      }
    },
    "accentColor": "#f59e0b"
  },
  {
      "id": 57,
      "name": "Elliot Cadeau",
      "position": "PG",
      "team": "Michigan",
      "age": 21.8,
      "height": "6'1\"",
      "weight": "180 lbs",
      "wingspan": "",
      "tier": "SLEEPER",
      "rank": 39,
      "eligibilityStatus": "official_early_entry",
      "archetype": "Tempo Guard / Table Setter",
      "stats": {
          "ppg": 10.5,
          "rpg": 2.7,
          "apg": 5.9,
          "fgp": 41.1,
          "threep": 37.6,
          "ftp": 70.9,
          "per": 14.7,
          "ts": 54.3,
          "usg": 21.4,
          "efg": 50.9,
          "astTo": 2.44,
          "blkPct": null,
          "stlPct": null,
          "games": 40,
          "fgm": 3.4,
          "fga": 8.3,
          "threepm": 1.6,
          "threepa": 4.3,
          "ftm": 2.1,
          "fta": 2.9
      },
      "scouting": {
          "strengths": [
              "Playmaking funcional: 5.9 assistencias com AST/TO de 2.44.",
              "Melhora real como arremessador de volume: 37.6% de tres em 4.3 tentativas.",
              "Controla ritmo e organiza posses no half court."
          ],
          "weaknesses": [
              "Tamanho e finalizacao no aro ainda limitam a margem NBA.",
              "Pontuacao propria depende mais de contexto do que de vantagem fisica."
          ],
          "notes": "Cadeau entra na board como um armador de mesa, com valor ligado a ritmo, passe e organizacao. A melhora no arremesso recoloca seu perfil no radar, mas a traducao NBA ainda depende de provar que consegue punir defesas fisicas sem perder eficiencia.",
          "attributes": {
              "Athleticism": 5.7,
              "Shooting": 6.8,
              "Playmaking": 8.1,
              "Defense": 5.2,
              "Rebounding": 3.8,
              "BBIQ": 7.7
          },
          "evaluation": {
              "version": "official_addition_v1",
              "floor": {
                  "score": 45,
                  "label": "Deep bench",
                  "note": ""
              },
              "ceiling": {
                  "score": 62,
                  "label": "Rotation",
                  "note": ""
              },
              "risk": {
                  "level": "High",
                  "reason": "Size/finishing translation",
                  "note": ""
              },
              "tools": {
                  "shooting": "Plus",
                  "creation": "Plus",
                  "defense": "Question",
                  "rebounding": "Question",
                  "efficiency": "Solid"
              },
              "note": "Adicionado apos lista oficial de early entry."
          }
      },
      "accentColor": "#f59e0b",
      "dataSources": {
          "officialStatus": "NBA early entry list 2026",
          "traditionalStats": "Tankathon 2026 Draft Profile",
          "traditionalStatsUrl": "https://www.tankathon.com/players/elliot-cadeau",
          "lastVerified": "2026-04-30"
      }
  },
  {
      "id": 58,
      "name": "Jeremy Fears Jr.",
      "position": "PG",
      "team": "Michigan State",
      "age": 21.2,
      "height": "6'2\"",
      "weight": "190 lbs",
      "wingspan": "",
      "tier": "SLEEPER",
      "rank": 40,
      "eligibilityStatus": "official_early_entry",
      "archetype": "Lead Guard / Advantage Passer",
      "stats": {
          "ppg": 15.2,
          "rpg": 2.4,
          "apg": 9.4,
          "fgp": 43.1,
          "threep": 32.1,
          "ftp": 88.5,
          "per": 22.9,
          "ts": 57.6,
          "usg": 24.3,
          "efg": 47.9,
          "astTo": 3.86,
          "blkPct": null,
          "stlPct": null,
          "games": 35,
          "fgm": 4.5,
          "fga": 10.4,
          "threepm": 1,
          "threepa": 3.1,
          "ftm": 5.3,
          "fta": 5.9
      },
      "scouting": {
          "strengths": [
              "Criacao para terceiros de elite: 9.4 APG e AST/TO de 3.86.",
              "Pressiona a linha de lance livre e converte 88.5%.",
              "Perfil de lead guard com leitura e controle de jogo."
          ],
          "weaknesses": [
              "Arremesso de tres ainda precisa estabilizar para abrir teto NBA.",
              "Tamanho cria margem menor em matchups fisicos."
          ],
          "notes": "Fears volta ao radar como um armador de alto volume de criacao, com passe, controle de erro e pressao de lance livre como base do perfil. O swing esta no arremesso: se o jumper for respeitado, o valor de rotacao cresce rapidamente.",
          "attributes": {
              "Athleticism": 6.1,
              "Shooting": 5.8,
              "Playmaking": 9,
              "Defense": 5.7,
              "Rebounding": 3.5,
              "BBIQ": 8.1
          },
          "evaluation": {
              "version": "official_addition_v1",
              "floor": {
                  "score": 50,
                  "label": "Deep bench",
                  "note": ""
              },
              "ceiling": {
                  "score": 68,
                  "label": "Starter",
                  "note": ""
              },
              "risk": {
                  "level": "Moderate",
                  "reason": "Shooting consistency",
                  "note": ""
              },
              "tools": {
                  "shooting": "Question",
                  "creation": "Elite",
                  "defense": "Solid",
                  "rebounding": "Question",
                  "efficiency": "Plus"
              },
              "note": "Adicionado apos lista oficial de early entry."
          }
      },
      "accentColor": "#f59e0b",
      "dataSources": {
          "officialStatus": "NBA early entry list 2026",
          "traditionalStats": "Tankathon 2026 Draft Profile",
          "traditionalStatsUrl": "https://www.tankathon.com/players/jeremy-fears-jr",
          "lastVerified": "2026-04-30"
      }
  },
  {
      "id": 59,
      "name": "Billy Richmond III",
      "position": "SG/SF",
      "team": "Arkansas",
      "age": 20.4,
      "height": "6'6\"",
      "weight": "205 lbs",
      "wingspan": "",
      "tier": "SLEEPER",
      "rank": 41,
      "eligibilityStatus": "official_early_entry",
      "archetype": "Athletic Connector / Slashing Wing",
      "stats": {
          "ppg": 11.2,
          "rpg": 4.3,
          "apg": 2,
          "fgp": 56.3,
          "threep": 25.9,
          "ftp": 78.4,
          "per": null,
          "ts": null,
          "usg": null,
          "efg": 58.8,
          "astTo": 1.6,
          "blkPct": null,
          "stlPct": null,
          "games": 37,
          "fgm": 4.6,
          "fga": 8.2,
          "threepm": 0.4,
          "threepa": 1.6,
          "ftm": 1.6,
          "fta": 2
      },
      "scouting": {
          "strengths": [
              "Finalizacao eficiente para guard/wing: 56.3% FG.",
              "Contribui em multiplas areas sem exigir alto uso.",
              "Tamanho e atletismo sustentam traducao defensiva situacional."
          ],
          "weaknesses": [
              "Arremesso de tres ainda nao abre spacing confiavel.",
              "Precisa transformar flashes de criacao em vantagem repetivel."
          ],
          "notes": "Richmond e um wing atletico de energia, com boa eficiencia dentro do arco e contribuicao secundaria em rebote, passe e defesa. Para virar peca de rotacao NBA, precisa transformar o arremesso de tres de ponto fraco em ferramenta ao menos funcional.",
          "attributes": {
              "Athleticism": 7.1,
              "Shooting": 4.8,
              "Playmaking": 5.4,
              "Defense": 6.2,
              "Rebounding": 5.7,
              "BBIQ": 5.8
          },
          "evaluation": {
              "version": "official_addition_v1",
              "floor": {
                  "score": 45,
                  "label": "Deep bench",
                  "note": ""
              },
              "ceiling": {
                  "score": 64,
                  "label": "Rotation",
                  "note": ""
              },
              "risk": {
                  "level": "High",
                  "reason": "Shooting development",
                  "note": ""
              },
              "tools": {
                  "shooting": "Question",
                  "creation": "Solid",
                  "defense": "Solid",
                  "rebounding": "Solid",
                  "efficiency": "Plus"
              },
              "note": "Adicionado apos lista oficial de early entry."
          }
      },
      "accentColor": "#f59e0b",
      "dataSources": {
          "officialStatus": "NBA early entry list 2026",
          "traditionalStats": "ESPN player stats",
          "traditionalStatsUrl": "https://www.espn.com/mens-college-basketball/player/stats/_/id/5060732/billy-richmond-iii",
          "lastVerified": "2026-04-30"
      }
  },
  {
      "id": 60,
      "name": "Andrej Stojakovic",
      "position": "SG/SF",
      "team": "Illinois",
      "age": 21.8,
      "height": "6'7\"",
      "weight": "215 lbs",
      "wingspan": "",
      "tier": "SLEEPER",
      "rank": 42,
      "eligibilityStatus": "official_early_entry",
      "archetype": "Scoring Wing / Slasher",
      "stats": {
          "ppg": 13.5,
          "rpg": 4.5,
          "apg": 1,
          "fgp": 50,
          "threep": 24.4,
          "ftp": 80.5,
          "per": 20.1,
          "ts": 57.8,
          "usg": 25,
          "efg": 53,
          "astTo": 0.77,
          "blkPct": null,
          "stlPct": null,
          "games": 34,
          "fgm": 4.9,
          "fga": 9.9,
          "threepm": 0.6,
          "threepa": 2.4,
          "ftm": 3,
          "fta": 3.8
      },
      "scouting": {
          "strengths": [
              "Pontua com eficiencia de dois pontos e pressiona a defesa atacando closeouts.",
              "Tamanho de wing NBA com pedigree de shotmaking.",
              "Produziu 13.5 PPG em papel de rotacao forte."
          ],
          "weaknesses": [
              "3P% de 24.4 cria uma pergunta central de traducao.",
              "AST/TO baixo limita leitura como criador secundario."
          ],
          "notes": "Stojakovic e um scorer de wing que ganhou tracao como peca ofensiva em Illinois, especialmente atacando o aro e punindo vantagens. A avaliacao depende quase toda do jumper: se o arremesso voltar ao nivel esperado, o pacote fisico-ofensivo ganha valor de segunda rodada.",
          "attributes": {
              "Athleticism": 6.4,
              "Shooting": 4.7,
              "Playmaking": 3.8,
              "Defense": 5.3,
              "Rebounding": 5.8,
              "BBIQ": 5
          },
          "evaluation": {
              "version": "official_addition_v1",
              "floor": {
                  "score": 45,
                  "label": "Deep bench",
                  "note": ""
              },
              "ceiling": {
                  "score": 65,
                  "label": "Starter",
                  "note": ""
              },
              "risk": {
                  "level": "High",
                  "reason": "Shooting consistency",
                  "note": ""
              },
              "tools": {
                  "shooting": "Question",
                  "creation": "Solid",
                  "defense": "Question",
                  "rebounding": "Solid",
                  "efficiency": "Solid"
              },
              "note": "Adicionado apos lista oficial de early entry."
          }
      },
      "accentColor": "#f59e0b",
      "dataSources": {
          "officialStatus": "NBA early entry list 2026",
          "traditionalStats": "Tankathon 2026 Draft Profile",
          "traditionalStatsUrl": "https://www.tankathon.com/players/andrej-stojakovic",
          "lastVerified": "2026-04-30"
      }
  },
  {
      "id": 61,
      "name": "Sergio de Larrea",
      "position": "PG/SG",
      "team": "Valencia",
      "age": 20.5,
      "height": "6'6\"",
      "weight": "198 lbs",
      "wingspan": "",
      "tier": "SLEEPER",
      "rank": 43,
      "eligibilityStatus": "official_early_entry",
      "archetype": "Big Guard / International Connector",
      "stats": {
          "ppg": 6.7,
          "rpg": 2,
          "apg": 2.8,
          "fgp": 45.1,
          "threep": 41.3,
          "ftp": 80,
          "per": 17.8,
          "ts": 60.5,
          "usg": 22.4,
          "efg": 54.7,
          "astTo": 1.83,
          "blkPct": null,
          "stlPct": null,
          "games": 50,
          "fgm": 2,
          "fga": 4.5,
          "threepm": 0.9,
          "threepa": 2.1,
          "ftm": 1.8,
          "fta": 2.3
      },
      "scouting": {
          "strengths": [
              "Tamanho raro para combo guard: 6'6\" com leitura de passe.",
              "41.3% de tres em contexto profissional europeu.",
              "TS% de 60.5 sustenta eficiencia mesmo em minutos curtos."
          ],
          "weaknesses": [
              "Baixo volume de minutos exige cuidado na traducao estatistica.",
              "Precisa ganhar forca e acelerar reads contra pressao NBA."
          ],
          "notes": "De Larrea e um guard internacional de tamanho, passe e arremesso, com perfil de draft-and-stash ou desenvolvimento paciente. O valor esta na combinacao de 6'6\", tomada de decisao e eficiencia como jogador jovem em ambiente profissional.",
          "attributes": {
              "Athleticism": 5.7,
              "Shooting": 7.7,
              "Playmaking": 7,
              "Defense": 5.8,
              "Rebounding": 4.6,
              "BBIQ": 7.2
          },
          "evaluation": {
              "version": "official_addition_v1",
              "floor": {
                  "score": 45,
                  "label": "Deep bench",
                  "note": ""
              },
              "ceiling": {
                  "score": 70,
                  "label": "Starter",
                  "note": ""
              },
              "risk": {
                  "level": "Moderate",
                  "reason": "International translation",
                  "note": ""
              },
              "tools": {
                  "shooting": "Plus",
                  "creation": "Plus",
                  "defense": "Solid",
                  "rebounding": "Question",
                  "efficiency": "Plus"
              },
              "note": "Adicionado apos lista oficial de early entry."
          }
      },
      "accentColor": "#f59e0b",
      "dataSources": {
          "officialStatus": "NBA early entry list 2026",
          "traditionalStats": "Tankathon 2026 Draft Profile",
          "traditionalStatsUrl": "https://www.tankathon.com/players/sergio-de-larrea",
          "lastVerified": "2026-04-30"
      }
  },
  {
      "id": 62,
      "name": "Alexandros Samodurov",
      "position": "PF/C",
      "team": "Panathinaikos",
      "age": 21,
      "height": "6'11\"",
      "weight": "200 lbs",
      "wingspan": "",
      "tier": "SLEEPER",
      "rank": 44,
      "eligibilityStatus": "official_early_entry",
      "archetype": "Development Big / Stretch Frontcourt",
      "stats": {
          "ppg": 3.3,
          "rpg": 1.7,
          "apg": 0.6,
          "fgp": 55.1,
          "threep": 26.7,
          "ftp": 72.2,
          "per": null,
          "ts": null,
          "usg": null,
          "efg": null,
          "astTo": null,
          "blkPct": null,
          "stlPct": null,
          "games": 13,
          "fgm": null,
          "fga": null,
          "threepm": null,
          "threepa": null
      },
      "scouting": {
          "strengths": [
              "Tamanho legitimo de frontcourt com mobilidade para PF/C.",
              "Finaliza bem em volume baixo e tem flashes de spacing.",
              "Experiencia em estrutura profissional de alto nivel."
          ],
          "weaknesses": [
              "Baixo volume de minutos reduz confianca na avaliacao estatistica.",
              "Arremesso externo ainda nao e ferramenta confiavel."
          ],
          "notes": "Samodurov entra como aposta de desenvolvimento internacional: tamanho, toque e experiencia profissional chamam atencao, mas o volume atual ainda e pequeno demais para leitura definitiva. O caminho NBA passa por ganhar forca, consistencia no jumper e papel defensivo claro.",
          "attributes": {
              "Athleticism": 5.8,
              "Shooting": 5,
              "Playmaking": 4.1,
              "Defense": 5.8,
              "Rebounding": 4.8,
              "BBIQ": 5.7
          },
          "evaluation": {
              "version": "official_addition_v1",
              "floor": {
                  "score": 35,
                  "label": "G-League / two-way",
                  "note": ""
              },
              "ceiling": {
                  "score": 62,
                  "label": "Rotation",
                  "note": ""
              },
              "risk": {
                  "level": "High",
                  "reason": "Low-minute sample",
                  "note": ""
              },
              "tools": {
                  "shooting": "Question",
                  "creation": "Question",
                  "defense": "Solid",
                  "rebounding": "Solid",
                  "efficiency": "Solid"
              },
              "note": "Adicionado apos lista oficial de early entry."
          }
      },
      "accentColor": "#f59e0b",
      "dataSources": {
          "officialStatus": "NBA early entry list 2026",
          "traditionalStats": "RealGM/Basketball-Reference international profile",
          "traditionalStatsUrl": "https://basketball.realgm.com/player/Alexandros-Samodurov/Summary/183456",
          "lastVerified": "2026-04-30"
      }
  },
  {
      "id": 63,
      "name": "Luigi Suigo",
      "position": "C",
      "team": "Mega Basket",
      "age": 19.2,
      "height": "7'3\"",
      "weight": "240 lbs",
      "wingspan": "",
      "tier": "SLEEPER",
      "rank": 45,
      "eligibilityStatus": "official_early_entry",
      "archetype": "Oversized Development Center",
      "stats": {
          "ppg": 8.1,
          "rpg": 5.3,
          "apg": 0.8,
          "fgp": 56.4,
          "threep": 26.7,
          "ftp": 76.2,
          "per": null,
          "ts": null,
          "usg": null,
          "efg": 60.7,
          "astTo": 0.9,
          "blkPct": null,
          "stlPct": null,
          "games": 16,
          "fgm": 3.3,
          "fga": 5.9,
          "threepm": 0.5,
          "threepa": 1.9,
          "ftm": 1,
          "fta": 1.3
      },
      "scouting": {
          "strengths": [
              "Medidas raras: 7'3\" com presenca real no garrafao.",
              "Produz 8.1 PPG e 5.3 RPG em Mega Basket aos 19 anos.",
              "Mostra toque de lance livre e flashes de espacamento para o tamanho."
          ],
          "weaknesses": [
              "Mobilidade e velocidade defensiva ainda precisam ser testadas em nivel NBA.",
              "Arremesso de tres existe, mas ainda nao e confiavel."
          ],
          "notes": "Suigo e uma aposta internacional de tamanho extremo, com 7'3\" e producao profissional em Mega Basket. O pacote chama atencao pela combinacao de finalizacao, rebote e algum toque, mas a traducao depende de mobilidade defensiva, forca e paciencia de desenvolvimento.",
          "attributes": {
              "Athleticism": 5.4,
              "Shooting": 5.2,
              "Playmaking": 3.8,
              "Defense": 6.4,
              "Rebounding": 6.8,
              "BBIQ": 5.4
          },
          "evaluation": {
              "version": "official_addition_v1",
              "floor": {
                  "score": 40,
                  "label": "G-League / two-way",
                  "note": ""
              },
              "ceiling": {
                  "score": 72,
                  "label": "Starter",
                  "note": ""
              },
              "risk": {
                  "level": "High",
                  "reason": "Development big",
                  "note": ""
              },
              "tools": {
                  "shooting": "Question",
                  "creation": "Question",
                  "defense": "Plus",
                  "rebounding": "Plus",
                  "efficiency": "Solid"
              },
              "note": "Adicionado apos lista oficial de early entry."
          }
      },
      "accentColor": "#f59e0b",
      "dataSources": {
          "officialStatus": "NBA early entry list 2026",
          "traditionalStats": "Basketball-Reference Mega Superbet 2025-26",
          "traditionalStatsUrl": "https://www.basketball-reference.com/international/teams/mega/2026.html",
          "lastVerified": "2026-04-30"
      }
  }
];

export const draftMeta = {
  "year": 2026,
  "totalProspects": 45,
  "tiers": {
    "ELITE": 3,
    "LOTTERY": 11,
    "MID_1ST": 15,
    "SLEEPER": 16
  },
  "topPicks": {
    "consensus1": "AJ Dybantsa",
    "consensus2": "Darryn Peterson",
    "consensus3": "Cameron Boozer"
  },
  "lastUpdated": "2026-04-30",
  "sources": [
    "DraftBallr player profiles / stats (primary numeric source)",
    "BartTorvik player stats (supplemental numeric source)",
    "CollegeBasketballData API (optional numeric source when key is available)",
    "ESPN Big Board (Jonathan Givony)",
    "NBADraft.net",
    "CBS Sports / FanSided Big Board",
    "The Athletic (Sam Vecenie)",
    "CraftedNBA Consensus Board",
    "Tankathon Big Board",
    "No Ceilings NBA",
    "arkansasrazorbacks.com (official stats)"
  ],
  "statSourcePolicy": STAT_SOURCE_POLICY
};

export const TIER_CONFIG = {
  "ELITE": {
    "label": "ELITE",
    "color": "#7c5ccf",
    "bg": "#eee9fb",
    "text": "#5d46a3"
  },
  "LOTTERY": {
    "label": "LOTTERY",
    "color": "#8bbfe8",
    "bg": "#edf7fd",
    "text": "#4f86ad"
  },
  "MID_1ST": {
    "label": "MID 1ST",
    "color": "#c9a941",
    "bg": "#fbf4d2",
    "text": "#8a7023"
  },
  "SLEEPER": {
    "label": "SLEEPER",
    "color": "#e6a06f",
    "bg": "#faeee5",
    "text": "#a8663b"
  }
};

export const LOTTERY_TEAMS = [
  {
    "id": 1,
    "slotOrder": 1,
    "name": "Washington Wizards",
    "abbr": "WAS",
    "record": "17-65",
    "color": "#002B5C",
    "prob": 14
  },
  {
    "id": 2,
    "slotOrder": 2,
    "name": "Indiana Pacers",
    "abbr": "IND",
    "record": "19-63",
    "color": "#002D62",
    "prob": 14
  },
  {
    "id": 3,
    "slotOrder": 3,
    "name": "Brooklyn Nets",
    "abbr": "BKN",
    "record": "20-62",
    "color": "#777D84",
    "prob": 14
  },
  {
    "id": 4,
    "slotOrder": 4,
    "name": "Utah Jazz",
    "abbr": "UTA",
    "record": "22-60",
    "color": "#002B5C",
    "prob": 12.5
  },
  {
    "id": 5,
    "slotOrder": 5,
    "name": "Sacramento Kings",
    "abbr": "SAC",
    "record": "22-60",
    "color": "#5A2D81",
    "prob": 10.5
  },
  {
    "id": 6,
    "slotOrder": 6,
    "name": "Memphis Grizzlies",
    "abbr": "MEM",
    "record": "25-57",
    "color": "#5D76A9",
    "prob": 9
  },
  {
    "id": 7,
    "slotOrder": 7,
    "name": "New Orleans Pelicans",
    "abbr": "NOP",
    "record": "26-56",
    "color": "#0C2340",
    "prob": 7.5
  },
  {
    "id": 8,
    "slotOrder": 8,
    "name": "Dallas Mavericks",
    "abbr": "DAL",
    "record": "26-56",
    "color": "#00538C",
    "prob": 6
  },
  {
    "id": 9,
    "slotOrder": 9,
    "name": "Chicago Bulls",
    "abbr": "CHI",
    "record": "31-51",
    "color": "#CE1141",
    "prob": 4.5
  },
  {
    "id": 10,
    "slotOrder": 10,
    "name": "Milwaukee Bucks",
    "abbr": "MIL",
    "record": "32-50",
    "color": "#00471B",
    "prob": 3
  },
  {
    "id": 11,
    "slotOrder": 11,
    "name": "Golden State Warriors",
    "abbr": "GSW",
    "record": "37-45",
    "color": "#1D428A",
    "prob": 2
  },
  {
    "id": 12,
    "slotOrder": 12,
    "name": "LA Clippers",
    "abbr": "LAC",
    "record": "42-40",
    "color": "#C8102E",
    "prob": 1.5
  },
  {
    "id": 13,
    "slotOrder": 13,
    "name": "Miami Heat",
    "abbr": "MIA",
    "record": "43-39",
    "color": "#98002E",
    "prob": 1
  },
  {
    "id": 14,
    "slotOrder": 14,
    "name": "Charlotte Hornets",
    "abbr": "CHA",
    "record": "44-38",
    "color": "#00788C",
    "prob": 0.5
  }
];

export const PICKS_15_30 = [
  {
    "pick": 15,
    "owner": "Chicago Bulls",
    "ownerAbbr": "CHI",
    "via": "Portland Trail Blazers",
    "viaAbbr": "POR",
    "color": "#CE1141"
  },
  {
    "pick": 16,
    "owner": "Memphis Grizzlies",
    "ownerAbbr": "MEM",
    "via": "Phoenix Suns",
    "viaAbbr": "PHX",
    "color": "#5D76A9"
  },
  {
    "pick": 17,
    "owner": "Oklahoma City Thunder",
    "ownerAbbr": "OKC",
    "via": "Philadelphia 76ers",
    "viaAbbr": "PHI",
    "color": "#007AC1"
  },
  {
    "pick": 18,
    "owner": "Charlotte Hornets",
    "ownerAbbr": "CHA",
    "via": "Orlando Magic",
    "viaAbbr": "ORL",
    "color": "#00788C"
  },
  {
    "pick": 19,
    "owner": "Toronto Raptors",
    "ownerAbbr": "TOR",
    "via": null,
    "viaAbbr": null,
    "color": "#CE1141"
  },
  {
    "pick": 20,
    "owner": "San Antonio Spurs",
    "ownerAbbr": "SAS",
    "via": "Atlanta Hawks",
    "viaAbbr": "ATL",
    "color": "#C4CED4"
  },
  {
    "pick": 21,
    "owner": "Detroit Pistons",
    "ownerAbbr": "DET",
    "via": "Minnesota Timberwolves",
    "viaAbbr": "MIN",
    "color": "#C8102E"
  },
  {
    "pick": 22,
    "owner": "Philadelphia 76ers",
    "ownerAbbr": "PHI",
    "via": "Houston Rockets",
    "viaAbbr": "HOU",
    "color": "#006BB6"
  },
  {
    "pick": 23,
    "owner": "Atlanta Hawks",
    "ownerAbbr": "ATL",
    "via": "Cleveland Cavaliers",
    "viaAbbr": "CLE",
    "color": "#C8102E"
  },
  {
    "pick": 24,
    "owner": "New York Knicks",
    "ownerAbbr": "NYK",
    "via": null,
    "viaAbbr": null,
    "color": "#006BB6"
  },
  {
    "pick": 25,
    "owner": "Los Angeles Lakers",
    "ownerAbbr": "LAL",
    "via": null,
    "viaAbbr": null,
    "color": "#552583"
  },
  {
    "pick": 26,
    "owner": "Denver Nuggets",
    "ownerAbbr": "DEN",
    "via": null,
    "viaAbbr": null,
    "color": "#0E2240"
  },
  {
    "pick": 27,
    "owner": "Boston Celtics",
    "ownerAbbr": "BOS",
    "via": null,
    "viaAbbr": null,
    "color": "#007A33"
  },
  {
    "pick": 28,
    "owner": "Minnesota Timberwolves",
    "ownerAbbr": "MIN",
    "via": "Detroit Pistons",
    "viaAbbr": "DET",
    "color": "#236192"
  },
  {
    "pick": 29,
    "owner": "Cleveland Cavaliers",
    "ownerAbbr": "CLE",
    "via": "San Antonio Spurs",
    "viaAbbr": "SAS",
    "color": "#860038"
  },
  {
    "pick": 30,
    "owner": "Dallas Mavericks",
    "ownerAbbr": "DAL",
    "via": "Oklahoma City Thunder",
    "viaAbbr": "OKC",
    "color": "#00538C"
  }
];

export default prospects;
