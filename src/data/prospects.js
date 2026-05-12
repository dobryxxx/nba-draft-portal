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
    "id": 3,
    "name": "Cameron Boozer",
    "position": "PF/C",
    "team": "Duke",
    "age": 19,
    "height": "6'9\"",
    "weight": "250 lbs",
    "wingspan": "7'1\"",
    "tier": "CORNERSTONE",
    "rank": 1,
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
      "threepa": 3.6,
      "collegeRts": 8.8
    },
    "scouting": {
      "strengths": [
        "AP National Player of the Year â€” 22.5/10.2/4.1 com 55.6% FG",
        "Box Plus-Minus de 17.1, mais alto de toda a college basketball em 2025-26",
        "Fundamentos ofensivos impecÃ¡veis: pÃ³s baixo, mid-range e tiro de 3 (39.1%)"
      ],
      "weaknesses": [
        "Debate sobre o teto de desenvolvimento comparado a Peterson/Dybantsa",
        "Sem explosividade atletica de elite â€” jogo depende mais de fundamentos e leitura"
      ],
      "notes": "Boozer Ã© um forward com inteligÃªncia de jogo excepcional, capaz de agregar valor em mÃºltiplas funÃ§Ãµes sem precisar ser o astro da jogada. Funciona como hub ofensivo, parceiro de pick-and-roll e espaÃ§ador com naturalidade, e o analista acredita que ele poderia fazer tudo isso jÃ¡ no primeiro ano profissional. O Ãºnico \"risco\" do seu perfil Ã© uma limitaÃ§Ã£o como scorer de alto volume â€” mas quem enxerga alÃ©m dos nÃºmeros reconhece que seu impacto nas vitÃ³rias tende a ser consistente e silencioso.",
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
    "accentColor": "#7c3aed"
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
    "tier": "CORNERSTONE",
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
      "threepa": 6.9,
      "collegeRts": 1.3
    },
    "scouting": {
      "strengths": [
        "Shotmaking de elite nos trÃªs nÃ­veis â€” explosÃ£o e forÃ§a de guarda maior",
        "QI ofensivo instintivo, baixo nÃºmero de turnovers para o uso que recebe",
        "Arremesso de 3 limpo e repetÃ­vel (38.2%) com boa consistÃªncia mecÃ¢nica"
      ],
      "weaknesses": [
        "HistÃ³rico de problemas fÃ­sicos (cÃ£ibra severa que exigiu hospitalizaÃ§Ã£o)",
        "Volume de jogos reduzido (24 partidas) deixa lacunas na avaliaÃ§Ã£o mÃ©dica"
      ],
      "notes": "Peterson Ã© considerado o maior potencial de superstar scorer do draft, com capacidade de criar vantagem em mÃºltiplos contextos: isolamento, pick-and-roll e sem a bola. Sua versatilidade ofensiva o torna um catchall raro â€” o tipo de jogador que dÃ¡ direÃ§Ã£o a elencos inteiros pela simples ameaÃ§a que representa. A grande incÃ³gnita Ã© se a temporada turbulenta no Kansas reflete problemas estruturais no seu jogo ou apenas ruÃ­do de adaptaÃ§Ã£o a um ambiente difÃ­cil.",
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
    "accentColor": "#7c3aed"
  },
  {
    "id": 1,
    "name": "AJ Dybantsa",
    "position": "SF/PF",
    "team": "BYU",
    "age": 18,
    "height": "6'9\"",
    "weight": "210 lbs",
    "wingspan": "7'2\"",
    "tier": "CORNERSTONE",
    "rank": 3,
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
      "threepa": 4.2,
      "collegeRts": 3.5
    },
    "scouting": {
      "strengths": [
        "LÃ­der nacional em pontuaÃ§Ã£o (25.5 PPG) com eficiÃªncia de 51% no campo",
        "CriaÃ§Ã£o off the dribble de elite â€” muda velocidade como Tracy McGrady",
        "Playmaking avanÃ§ado para a posiÃ§Ã£o (3.7 APG, baixo Ã­ndice de turnovers)"
      ],
      "weaknesses": [
        "ConsistÃªncia no arremesso de 3 ainda em desenvolvimento (33.1%)",
        "TendÃªncia a procurar falta ao invÃ©s de finalizar com forÃ§a no aro"
      ],
      "notes": "Dybantsa Ã© o tipo de prospecto que se destaca nÃ£o apenas pelo talento, mas pela intensidade competitiva que carrega. Fisicamente, combina tamanho de ala grande com mobilidade e dureza defensiva incomuns para a faixa etÃ¡ria, o que o torna uma presenÃ§a real nos dois lados da quadra. Tem personalidade forte o suficiente para impor identidade num elenco â€” uma qualidade rara em prospectos jovens e que costuma ser tÃ£o decisiva quanto qualquer habilidade tÃ©cnica.",
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
    "accentColor": "#7c3aed"
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
    "tier": "ELITE",
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
      "threepa": 1.1,
      "collegeRts": 6.1
    },
    "scouting": {
      "strengths": [
        "Atletismo twitchy e explosivo â€” arremessa acima do aro com facilidade",
        "ProduÃ§Ã£o de dois lados da bola com first step especial para seu tamanho",
        "Reboteiro de elite (9.4 RPG) com motor constante"
      ],
      "weaknesses": [
        "Arremesso de 3 em desenvolvimento (25.9%) â€” maior limitaÃ§Ã£o de longo prazo",
        "Playmaking ainda bÃ¡sico para um forward de alto nÃ­vel"
      ],
      "notes": "Wilson tem o maior teto defensivo da classe, com atributos fÃ­sicos â€” altura, envergadura e mobilidade â€” que poucos jogadores do draft conseguem igualar. No ataque, apresenta um perfil incomum: um ala grande com movimentaÃ§Ã£o fluida, upside de arremesso e capacidade de finalizaÃ§Ã£o na bola parada. Ainda tem detalhes tÃ©cnicos a aprimorar em vÃ¡rias Ã¡reas, mas a combinaÃ§Ã£o de impacto defensivo de elite com versatilidade ofensiva o coloca entre os prospectos mais completos da geraÃ§Ã£o.",
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
    "accentColor": "#d4af37"
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
    "tier": "ELITE",
    "rank": 5,
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
      "threepa": 0.3,
      "collegeRts": 9.3
    },
    "scouting": {
      "strengths": [
        "DimensÃµes de rim protector de elite (7' + envergadura 7'5\")",
        "26 pontos contra Arizona no Final Four â€” desempenho assinatura em 2026",
        "Boa mÃ£o e touch de finalizador no pÃ³s (53.4% FG)"
      ],
      "weaknesses": [
        "Jogador mais velho da classe (22 anos)",
        "Tiro de 3 (31.5%) precisa evoluir para spacing moderno"
      ],
      "notes": "Mara Ã© um pivÃ´ de 7'3\" com presenÃ§a defensiva que distorce a geometria do ataque adversÃ¡rio sÃ³ pela sua posiÃ§Ã£o na quadra. Foi peÃ§a central de uma das defesas mais dominantes do basquete universitÃ¡rio na temporada, com percentual de tocos entre os mais altos da divisÃ£o. Soma a isso uma capacidade de passe subestimada para um jogador do seu porte, o que o torna mais do que uma simples Ã¢ncora defensiva â€” Ã© um pivÃ´ com mÃ£os e visÃ£o de jogo que transcendem o estereÃ³tipo da posiÃ§Ã£o.",
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
    "accentColor": "#d4af37"
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
    "tier": "ELITE",
    "rank": 6,
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
      "threepa": 7.6,
      "collegeRts": 1.2
    },
    "scouting": {
      "strengths": [
        "Tamanho posicional excelente para guarda moderno (6'5\")",
        "CriaÃ§Ã£o de contato e ida Ã  linha de lance livre em volume alto",
        "VisÃ£o de jogo e passagem criativa â€” potencial como iniciador primÃ¡rio"
      ],
      "weaknesses": [
        "LesÃ£o nas costas encerrou temporada 6 jogos cedo â€” preocupaÃ§Ã£o mÃ©dica real",
        "EficiÃªncia de 3 inconsistente (34%) com oscilaÃ§Ãµes de temperatura ao longo do ano"
      ],
      "notes": "Brown Ã© um handler elÃ©trico em espaÃ§o aberto que combina criaÃ§Ã£o de vantagem com movimentaÃ§Ã£o off-ball sofisticada â€” domina saÃ­das em pin-downs, staggers e flare screens como atirador com naturalidade. Esse perfil duplo Ã© raro: a maioria dos guards dessa classe tende a ser uma coisa ou outra. A temporada irregular no Louisville teve um efeito supressor no seu valor percebido, mas quem olha alÃ©m das flutuaÃ§Ãµes reconhece nele uma das apostas mais subestimadas da classe.",
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
    "accentColor": "#d4af37"
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
    "rank": 7,
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
      "threepa": 5.8,
      "collegeRts": 3.9
    },
    "scouting": {
      "strengths": [
        "SEC Player of Year + Freshman of Year â€” 845 pontos, recorde Arkansas",
        "Ãšnico jogador na NCAA a fazer 20+ PPG e 6+ APG com 48% FG e 44% de 3",
        "Motor ofensivo explosivo; capacidade de virar jogo sozinho (49 pts no recorde pessoal)"
      ],
      "weaknesses": [
        "Estatura limitante para guarda NBA (6'2\") sem compensaÃ§Ã£o atlÃ©tica Ã³bvia",
        "HÃ¡bitos defensivos ruins chamam atenÃ§Ã£o de scouts â€” ponto de atenÃ§Ã£o real"
      ],
      "notes": "Acuff se destaca pela dureza mental, frieza emocional e pela leitura de jogo que permite alimentar atletas explosivos com eficiÃªncia tanto em transiÃ§Ã£o quanto no half court. Ã‰ um armador com identidade competitiva forte, que nÃ£o depende de nÃºmeros para impactar a dinÃ¢mica de um grupo. Seu perfil tem tudo para escalar na loteria Ã  medida que o processo prÃ©-draft avanÃ§a e os times compreendem melhor o valor do que ele oferece alÃ©m do Ã³bvio.",
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
    "accentColor": "#10b981"
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
    "rank": 8,
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
      "threepa": 6.2,
      "collegeRts": 6.1
    },
    "scouting": {
      "strengths": [
        "Tiro de 3 elite (40.2%) com 2.3 cestas por jogo â€” spacer e criador simultÃ¢neo",
        "Segundo ano transformado: lideranÃ§a, eficiÃªncia e produÃ§Ã£o escalaram juntas",
        "Defensor com boa antecipaÃ§Ã£o e presenÃ§a no ponto de ataque"
      ],
      "weaknesses": [
        "Tamanho limÃ­trofe para a posiÃ§Ã£o na NBA (6'3\")",
        "Sem arma de chega-ao-aro consistente contra corpos maiores"
      ],
      "notes": "Philon Ã© um armador com inteligÃªncia de jogo fora do comum para a idade, combinando moxie competitivo com um conjunto de habilidades que sugere adaptaÃ§Ã£o rÃ¡pida ao ritmo profissional. Sua leitura defensiva e capacidade de encaixe em sistemas jÃ¡ estabelecidos o tornam um prospecto que agrega sem precisar de protagonismo imediato. HÃ¡ tambÃ©m uma dimensÃ£o de potencial ainda nÃ£o totalmente revelado â€” alguÃ©m que pode comeÃ§ar cumprindo papel definido e gradualmente assumir as chaves do carro.",
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
    "accentColor": "#10b981"
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
    "rank": 9,
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
      "threepa": 5.9,
      "collegeRts": 3.1
    },
    "scouting": {
      "strengths": [
        "Tomada de decisÃ£o inteligente e visÃ£o de jogo acima da mÃ©dia para a posiÃ§Ã£o",
        "Arremesso de 3 confiÃ¡vel (39.7%) com boa vantagem de tamanho sobre guardas",
        "Excelente como facilitador fora da bola e em ball screens â€” elevador de companheiros"
      ],
      "weaknesses": [
        "Ainda precisa adicionar forÃ§a para suportar fisicalidade NBA",
        "Sem explosividade atlÃ©tica como criador primÃ¡rio"
      ],
      "notes": "Wagler Ã© um dos atiradores mais perigosos e dinÃ¢micos da classe, com mecanismo confiÃ¡vel e capacidade tÃ©cnica sÃ³lida de operar no pick-and-roll. Tem tamanho posicional adequado para um guard no nÃ­vel profissional, o que amplifica o problema que representa para as defesas. A principal dÃºvida sobre ele Ã© fÃ­sica: se seu corpo serÃ¡ capaz de absorver as demandas de ser opÃ§Ã£o primÃ¡ria na NBA â€” mas mesmo como peÃ§a secundÃ¡ria, sua gravidade ofensiva Ã© inegÃ¡vel.",
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
    "accentColor": "#10b981"
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
    "rank": 10,
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
      "threepa": 2.9,
      "collegeRts": -0.2
    },
    "scouting": {
      "strengths": [
        "Playmaking de elite â€” comparado a Derrick Rose pela visÃ£o e explosÃ£o",
        "Arremessador confiÃ¡vel de 3 (40%) com alto QI ofensivo",
        "LideranÃ§a comprovada em sistema de alta exigÃªncia defensiva de Houston"
      ],
      "weaknesses": [
        "Tamanho limÃ­trofe para PG na NBA (6'3\")",
        "PrecisarÃ¡ se afirmar como finalizador contra corpos maiores"
      ],
      "notes": "Flemings Ã© frequentemente reduzido ao rÃ³tulo de scorer, mas seu perfil vai alÃ©m disso: tem sensibilidade real no pick-and-roll e Ã© possivelmente o jogador mais veloz da classe em espaÃ§o aberto. A velocidade que exibe nÃ£o Ã© apenas atlÃ©tica â€” Ã© combinada com leitura de jogo suficiente para transformÃ¡-la em vantagem concreta dentro das estruturas ofensivas. Um prospecto com esse perfil de transiÃ§Ã£o e desequilÃ­brio em espaÃ§o aberto tende a encontrar papel imediato em qualquer sistema de jogo moderno.",
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
    "accentColor": "#10b981"
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
    "rank": 11,
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
      "threepa": 1.8,
      "collegeRts": 7.1
    },
    "scouting": {
      "strengths": [
        "Tamanho wing de 6'7\" com tiro de 3 (38.1%) e versatilidade defensiva",
        "CoordenaÃ§Ã£o e controle de bola avanÃ§ados para o tamanho",
        "Jogo two-way com instintos reboteiros acima da mÃ©dia"
      ],
      "weaknesses": [
        "CriaÃ§Ã£o ISO limitada â€” mais dependente de sistema do que initiator",
        "Precisa amadurecer fisicamente para os embates de 3s/4s na NBA"
      ],
      "notes": "Steinbach foi um dos poucos pontos positivos de uma temporada problemÃ¡tica para o Washington, destacando-se como reboteiro voraz e finalizador de alto volume dentro do garrafÃ£o. Seu repertÃ³rio de pontuaÃ§Ã£o na bola parada foi um dos mais impressionantes do paÃ­s, com lampejos de capacidade de espaÃ§amento que sÃ£o incomuns para um jogador do seu porte. Oferece solidez produtiva imediata e flexibilidade de encaixe em diferentes configuraÃ§Ãµes de quinteto.",
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
    "accentColor": "#10b981"
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
    "tier": "LOTTERY",
    "rank": 12,
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
      "threepa": 4.6,
      "collegeRts": 5.1
    },
    "scouting": {
      "strengths": [
        "Arremessador fluente de 3 (38.4%)",
        "Playmaking sÃ³lido em time de Final Four",
        "ProduÃ§Ã£o em sistema de alta exigÃªncia"
      ],
      "weaknesses": [
        "Tamanho de guarda NBA (6'3\")",
        "Falta de criaÃ§Ã£o off the dribble explÃ­cita"
      ],
      "notes": "Burries Ã© um defensor agressivo e predatÃ³rio no perÃ­metro, com habilidade especÃ­fica de pressionar armadores adversÃ¡rios de alto nÃ­vel â€” uma funÃ§Ã£o valiosa que muitos guards nÃ£o conseguem exercer com consistÃªncia. Seu papel secundÃ¡rio no Arizona manteve encoberto um potencial ainda nÃ£o explorado de atuar como armador titular no futuro. Ã‰ o tipo de perfil que cresce na avaliaÃ§Ã£o quanto mais se entende o impacto das funÃ§Ãµes invisÃ­veis do basquete.",
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
    "accentColor": "#10b981"
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
    "tier": "LOTTERY",
    "rank": 13,
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
      "threepa": 6.2,
      "collegeRts": 5.3
    },
    "scouting": {
      "strengths": [
        "Breakout season em Baylor â€” scorer versÃ¡til com tiro de 3 confiÃ¡vel (37.4%)",
        "Tamanho e atletismo para jogar 2/3 na NBA",
        "ProduÃ§Ã£o equilibrada nos trÃªs nÃ­veis"
      ],
      "weaknesses": [
        "Playmaking como initiator ainda questÃ£o em aberto",
        "ConsistÃªncia defensiva precisa ser mais assertiva"
      ],
      "notes": "Carr Ã© um guard atlÃ©tico com perfil predominantemente off-ball, cujo valor estÃ¡ na movimentaÃ§Ã£o sem a bola, no arremesso em catch-and-shoot e na finalizaÃ§Ã£o explosiva na bola parada. Registrou 41,7% em catch-and-shoot de trÃªs pontos na temporada â€” nÃºmero que indica consistÃªncia real como ameaÃ§a de perÃ­metro, nÃ£o apenas volume. Defensivamente, contribui com contestaÃ§Ãµes de weakside que o mantÃªm relevante nos dois lados da quadra.",
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
    "accentColor": "#10b981"
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
    "tier": "LOTTERY",
    "rank": 14,
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
      "threepa": 7.9,
      "collegeRts": 6.1
    },
    "scouting": {
      "strengths": [
        "Arremessador de elite (42.5% de 3 com 3.4 cestas por jogo)",
        "Salta de 10.6 para 18.9 PPG no segundo ano â€” explosÃ£o de produÃ§Ã£o",
        "All-Big 12 First Team â€” scorer premium em conferÃªncia de alto nÃ­vel"
      ],
      "weaknesses": [
        "Playmaking como iniciador primÃ¡rio ainda limitado (2.8 APG)",
        "Sem grande criaÃ§Ã£o fora do arremesso"
      ],
      "notes": "Anderson Ã© o prospecto com o perfil ofensivo mais completo desta sÃ©rie: eficiÃªncia excepcional, criaÃ§Ã£o real para companheiros, arremesso de trÃªs com volume e autonomia, e trajetÃ³ria de evoluÃ§Ã£o clara entre as duas temporadas universitÃ¡rias. As limitaÃ§Ãµes estÃ£o no fÃ­sico â€” envergadura e peso abaixo da mÃ©dia para a posiÃ§Ã£o â€” e no impacto defensivo, que provavelmente o define como jogador de contribuiÃ§Ã£o ofensiva prioritÃ¡ria na NBA. Se a eficiÃªncia se mantiver em alto nÃ­vel, o teto como criador e arremessador Ã© genuinamente elevado.",
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
    "accentColor": "#10b981"
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
    "tier": "MID_1ST",
    "rank": 15,
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
      "threepa": 2.7,
      "collegeRts": 5
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
      "notes": "Graves Ã© um forward inteligente e maduro que impacta o jogo com estilo controlado nos dois lados da quadra â€” tamanho, estrutura fÃ­sica sÃ³lida e comprimento funcional dÃ£o a ele versatilidade de encaixe em diferentes lineups. Suas mÃ©tricas de eficiÃªncia se destacam apesar de minutos reduzidos num programa de mid-major: 51,7% de aproveitamento geral, 41,6% de trÃªs e baixÃ­ssima taxa de turnovers, o que indica um jogador com excelente consciÃªncia de posiÃ§Ã£o. A avaliaÃ§Ã£o carrega projeÃ§Ã£o inerente pelo nÃ­vel de competiÃ§Ã£o enfrentado, e seu atletismo vertical nÃ£o Ã© explosivo â€” mas o conjunto de habilidades tÃ©cnicas, instintos defensivos e leitura coletiva do jogo sugere um jogador que agrega a sistemas vencedores sem precisar de papel central.",
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
    "accentColor": "#3b82f6"
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
    "tier": "MID_1ST",
    "rank": 16,
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
      },
      "collegeRts": 8.1
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
    "accentColor": "#3b82f6",
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
    "id": 22,
    "name": "Amari Allen",
    "position": "SF/PF",
    "team": "Alabama",
    "age": 19,
    "height": "6'7\"",
    "weight": "210 lbs",
    "wingspan": "6'11\"",
    "tier": "MID_1ST",
    "rank": 17,
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
      "threepa": 4.3,
      "collegeRts": 0.5
    },
    "scouting": {
      "strengths": [
        "Passador acima da mÃ©dia para a posiÃ§Ã£o (A/T ratio de 2.3)",
        "Defensor versÃ¡til e reboteiro consistente",
        "Arremessador de 3 capaz (36.2%) â€” spacing real"
      ],
      "weaknesses": [
        "PontuaÃ§Ã£o modesta (12.6 PPG) â€” ainda nÃ£o provou escalar ofensivamente",
        "PrecisarÃ¡ definir papel principal na NBA"
      ],
      "notes": "Allen Ã© descrito como o conector mais talentoso e silencioso da classe, com tamanho posicional adequado, tomada de decisÃ£o acima da mÃ©dia e capacidade de complementar diferentes estruturas ofensivas. Seu arremesso ainda estÃ¡ em desenvolvimento, mas o QI ofensivo e a inteligÃªncia de leitura compensam a limitaÃ§Ã£o temporÃ¡ria â€” sÃ£o atributos que tendem a perdurar mais do que percentuais de uma temporada. Ã‰ o tipo de prospecto cujo valor real sÃ³ se revela dentro de sistemas bem construÃ­dos, onde a capacidade de conectar jogadas sem desperdiÃ§ar posse se torna um diferencial concreto.",
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
    "accentColor": "#3b82f6"
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
    "rank": 18,
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
      "notes": "Lopez projeta ser o primeiro mexicano nascido no paÃ­s a ser escolhido na primeira rodada do draft â€” uma trajetÃ³ria construÃ­da sobre dois anos produtivos na NBL australiana pelo programa Next Stars dos New Zealand Breakers, o mesmo caminho percorrido por LaMelo Ball, Josh Giddey e Alex Sarr. O jogo estÃ¡ visivelmente desacelerando para ele: compostura com a bola, execuÃ§Ã£o rÃ¡pida de leituras e ausÃªncia de excesso de drible sÃ£o marcas de um prospecto de 18 anos com maturidade de jogo fora do comum para a idade. A avaliaÃ§Ã£o honesta reconhece que ele ainda Ã© um \"jack of all trades\" sem uma habilidade isolada em que se apoiar imediatamente na NBA, mas a combinaÃ§Ã£o de fisicalidade, versatilidade defensiva e flashes de criaÃ§Ã£o como ala grande representa um teto de construÃ§Ã£o genuinamente interessante.",
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
    "accentColor": "#3b82f6"
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
    "tier": "MID_1ST",
    "rank": 19,
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
      "threepa": 3.9,
      "collegeRts": -3.1
    },
    "scouting": {
      "strengths": [
        "Tamanho wing de 6'10\" com tiro de mÃ©dio alcance suave â€” modelo Kevin Durant",
        "Potencial defensivo imenso com comprimento e instintos naturais",
        "QI de leitura de jogo avanÃ§ado para um freshman"
      ],
      "weaknesses": [
        "ConfianÃ§a e assertividade como shotmaker ainda inconsistentes",
        "Arremesso de 3 em 32.8% â€” precisa melhorar para maximizar spacing na NBA"
      ],
      "notes": "Ament chegou Ã  temporada com status de top 5-7, mas eficiÃªncia abaixo do esperado, dificuldades para criar vantagens, arremessos limpos e criaÃ§Ã£o coletiva, nos fazem pÃ´r em cheque seu valor como prospecto. O que ficou, foram alguns flashes como pontuador que alimentam certa esperanÃ§a, alÃ©m de contribuiÃ§Ã£o defensiva acima da mÃ©dia. Existe um mundo onde ele vira algo a mais, mas existem muitos mais onde ele nÃ£o passa de um bom role player. E existem chances reais de sua irregularidade e dificuldades tÃ©cnicas o levarem ao esquecimento apÃ³s alguns anos. Alto risco, pra talvez uma grande recompensa. Ou provavelmente, uma recompensa sÃ³lida, mas nada especial",
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
    "accentColor": "#3b82f6"
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
    "rank": 20,
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
      "threepa": 0,
      "collegeRts": -6.9
    },
    "scouting": {
      "strengths": [
        "Bloqueador de chutes de nÃ­vel generacional â€” mobilidade e envergadura 7'5\"",
        "Elasticidade e verticalidade raras para um pivÃ´ de 18 anos",
        "Defensor que consegue guardar perÃ­metro e proteger o aro na mesma posse"
      ],
      "weaknesses": [
        "Joelho operado (ACL) + lesÃ£o recorrente limitaram a apenas 4 jogos em 2025-26",
        "Ataque bruto e sem arremesso de 3 â€” necessita evoluÃ§Ã£o ofensiva"
      ],
      "notes": "Quaintance exige separaÃ§Ã£o entre o que foi visto e o que ele representa como prospecto: voltou de uma ruptura de LCA em menos de um ano e teve uma temporada visivelmente comprometida pela pressa do retorno. Em condiÃ§Ãµes normais, ele disputa com Caleb Wilson o tÃ­tulo de protetor de aro mais dinÃ¢mico da classe â€” combinaÃ§Ã£o de tamanho, mobilidade e timing defensivo que poucos jogadores tÃªm. A incÃ³gnita central Ã© saber se o histÃ³rico de lesÃ£o representa um padrÃ£o preocupante ou apenas circunstÃ¢ncia de mÃ¡ sorte.",
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
    "accentColor": "#3b82f6"
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
    "rank": 21,
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
      "threepa": 5.3,
      "collegeRts": -0.6
    },
    "scouting": {
      "strengths": [
        "Tiro de 3 elite (41.6%) em papel secundÃ¡rio",
        "Defensor ativo (2.8 STL%) com turnovers baixÃ­ssimos (8.2 TO%)",
        "Upside de criador baseado em tape de highschool"
      ],
      "weaknesses": [
        "Produziu como arma secundÃ¡ria â€” precisa provar impacto como foco",
        "Tamanho mÃ©dio para wing NBA"
      ],
      "notes": "Thomas Ã© um prospecto com uma combinaÃ§Ã£o incomum: alto volume ofensivo, arremesso de trÃªs eficiente e controle de turnovers no nÃ­vel de elite para a posiÃ§Ã£o e a idade. O problema estrutural estÃ¡ na meia distÃ¢ncia â€” zona que ele frequenta demais para o que converte â€” e na baixa taxa de criaÃ§Ã£o para companheiros, o que limita sua utilidade como articulador do ataque. Se aprender a reduzir os arremessos de meia distÃ¢ncia ineficientes e desenvolver mais autonomia no perÃ­metro, o perfil ofensivo se torna muito mais difÃ­cil de defender. A defesa, por ora, nÃ£o Ã© diferencial.",
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
    "accentColor": "#3b82f6"
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
    "tier": "MID_1ST",
    "rank": 22,
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
      "threepa": 2.6,
      "collegeRts": 6.8
    },
    "scouting": {
      "strengths": [
        "All-SEC Second Team como transfer â€” transiÃ§Ã£o bem-sucedida",
        "Versatilidade de forward com spacing (36.4% de 3)",
        "ProduÃ§Ã£o regular ao longo de toda temporada"
      ],
      "weaknesses": [
        "Maior pick (22 anos)",
        "CriaÃ§Ã£o ISO limitada"
      ],
      "notes": "Swain Ã© um ala criador de 6'7\" com handle impressionante para o seu porte, usando uma combinaÃ§Ã£o de velocidade, fluidez e atletismo para superar alas e forwards maiores em situaÃ§Ãµes de isolamento. Seu ataque Ã© construÃ­do sobre pressÃ£o de bola constante ao aro, finalizaÃ§Ãµes com toque apurado e capacidade de atrair faltas â€” gerando 5,6 tentativas de lance livre por jogo com aproveitamento de 81,5%. A visÃ£o de jogo Ã© um atributo real: ele encontra cortadores e pivÃ´s em rolamento com leituras precisas, e a pressÃ£o que cria ofensivamente colapsa defesas e abre espaÃ§o para os colegas.",
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
    "accentColor": "#3b82f6"
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
    "tier": "MID_1ST",
    "rank": 23,
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
      "threepa": 0.9,
      "collegeRts": 11.2
    },
    "scouting": {
      "strengths": [
        "Big man de campeonato do Michigan",
        "EficiÃªncia de finishing alta (55.4%)",
        "Reboteiro com comprimento"
      ],
      "weaknesses": [
        "Sem arremesso externo",
        "Lance livre baixo limita papel em posse"
      ],
      "notes": "Johnson tem ferramentas fÃ­sicas de nÃ­vel NBA â€” forÃ§a de ancoragem, envergadura estimada em 7'2\" e atletismo explosivo â€” que se traduzem diretamente em defesa versÃ¡til, rebote de alto volume e finalizaÃ§Ã£o eficiente dentro do garrafÃ£o. Faz leituras rÃ¡pidas, sabe quem Ã© como jogador e produz jogadas vencedoras nos dois lados de forma incessante, o que coloca seu impacto em patamar diferente do que os nÃºmeros brutos sugerem. A principal limitaÃ§Ã£o estÃ¡ na tomada de decisÃ£o como passador no short-roll e na ausÃªncia de jogo ofensivo alÃ©m do garrafÃ£o â€” um arremesso de perÃ­metro confiÃ¡vel ainda nÃ£o estÃ¡ consolidado, o que pode restringir os cenÃ¡rios em que atua como opÃ§Ã£o de alto volume.",
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
    "accentColor": "#3b82f6"
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
      "threepa": 0.6,
      "collegeRts": -0.8
    },
    "scouting": {
      "strengths": [
        "FÃ­sico de \"Mack truck\" â€” usa forÃ§a para dominar rebote e defesa de pÃ³s",
        "Finalizador explosivo no aro com atletismo para sua estatura (53.6% FG)",
        "QI de rebote e esforÃ§o que enchem a caixa de estatÃ­sticas silenciosas"
      ],
      "weaknesses": [
        "Zero tentativas de arremesso de 3 â€” perfil ofensivo potencialmente limitante na NBA moderna",
        "ConsistÃªncia inconsistente â€” jogos de alto impacto alternados com apariÃ§Ãµes invisÃ­veis"
      ],
      "notes": "Peat explodiu no inÃ­cio da temporada a ponto de levantar comparaÃ§Ãµes com Cam Boozer, mas a exposiÃ§Ã£o prolongada revelou uma dieta ofensiva quase exclusivamente dentro do arco aos 6'8\" â€” dependÃªncia de jumpers em fade no garrafÃ£o quando nÃ£o finaliza direto no aro. A aposta em Peat Ã© sobre intangibles e sensibilidade de jogo: ele acumula pontos dentro das brechas do ataque sem precisar ter a bola nas mÃ£os e Ã© um passador excepcional para seu perfil de jogador. O prospecto que emerge dessa avaliaÃ§Ã£o Ã© alguÃ©m que impacta mais do que os nÃºmeros indicam, mas que depende de desenvolvimento do arsenal ofensivo externo para desbloquear seu verdadeiro teto.",
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
    "accentColor": "#3b82f6"
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
    "tier": "FRINGE",
    "rank": 25,
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
      "threepa": 2.4,
      "collegeRts": -1.9
    },
    "scouting": {
      "strengths": [
        "Forward versÃ¡til em sistema de defesa de alto nÃ­vel de Houston",
        "Arremessador de 3 capaz (34.2%) com envergadura 7'2\"",
        "FinalizaÃ§Ã£o eficiente no aro e em pick-and-roll"
      ],
      "weaknesses": [
        "CriaÃ§Ã£o ISO quase inexistente â€” serÃ¡ um complemento, nÃ£o um lÃ­der",
        "Lance livre baixo (70.8%) sugere limitaÃ§Ãµes de toque no arremesso"
      ],
      "notes": "Cenac Jr. Ã© um prospecto com base fÃ­sica diferenciada e eficiÃªncia real perto do aro. As limitaÃ§Ãµes centrais estÃ£o na criaÃ§Ã£o de jogo prÃ³prio, na frequÃªncia e no aproveitamento nos lances livres, e na consistÃªncia do arremesso de mÃ©dia e longa distÃ¢ncia. O desenvolvimento dessas Ã¡reas, especialmente a autonomia ofensiva, serÃ¡ o fator determinante para definir se ele se consolida como jogador de rotaÃ§Ã£o ou alcanÃ§a um papel mais relevante na liga.",
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
    "accentColor": "#f97316"
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
    "tier": "FRINGE",
    "rank": 26,
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
      },
      "collegeRts": 4.2
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
    "accentColor": "#f97316",
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
    "id": 17,
    "name": "Tounde Yessoufou",
    "position": "SF",
    "team": "Baylor",
    "age": 20,
    "height": "6'7\"",
    "weight": "205 lbs",
    "wingspan": "7'0\"",
    "tier": "FRINGE",
    "rank": 27,
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
      "threepa": 5.4,
      "collegeRts": -2.3
    },
    "scouting": {
      "strengths": [
        "Tamanho e comprimento de wing para defesa versÃ¡til na NBA",
        "Arremessador capaz de 3 (35.9%) com potencial off-ball",
        "Motor e intensidade que translationam para contribuiÃ§Ã£o imediata"
      ],
      "weaknesses": [
        "CriaÃ§Ã£o ofensiva ISO limitada â€” depende de estrutura",
        "Ainda precisa definir papel principal na NBA"
      ],
      "notes": "Yessoufou Ã© um prospecto com volume ofensivo real, habilidade incomum na meia distÃ¢ncia e instinto defensivo legÃ­timo pelo nÃºmero de roubos. As limitaÃ§Ãµes centrais sÃ£o o arremesso de trÃªs pontos â€” que precisa melhorar para que defesas na NBA o respeitem no perÃ­metro â€” e o impacto defensivo coletivo, que nÃ£o acompanha os nÃºmeros individuais de roubos. O perfil fÃ­sico sem grande margem de envergadura tambÃ©m reduz o teto como defensor de mÃºltiplas posiÃ§Ãµes. O desenvolvimento do arremesso de longa distÃ¢ncia serÃ¡ o fator que determinarÃ¡ se ele se torna jogador de rotaÃ§Ã£o ou apenas um complemento pontual.",
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
    "accentColor": "#f97316"
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
    "tier": "FRINGE",
    "rank": 28,
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
      "threepa": 7.4,
      "collegeRts": 2.5
    },
    "scouting": {
      "strengths": [
        "Tamanho wing com tiro de 3 sÃ³lido (36.1%) e comprometimento defensivo",
        "Assumiu usage maior no segundo semestre com Boozer dobrado",
        "ProduÃ§Ã£o em contexto de elite confirma base tÃ©cnica"
      ],
      "weaknesses": [
        "CriaÃ§Ã£o fora da bola predominante â€” limitaÃ§Ãµes como ball handler",
        "Explosividade atlÃ©tica mÃ©dia para a posiÃ§Ã£o"
      ],
      "notes": "Evans Ã© um guard de 6'6\" com mecanismo de arremesso de alta liberaÃ§Ã£o que, combinado com sua envergadura, torna cada tentativa um problema complexo para qualquer defensor. A movimentaÃ§Ã£o em telas e a capacidade de abrir espaÃ§o na linha de trÃªs â€” como opÃ§Ã£o de pop ou cortador â€” forÃ§am decisÃµes difÃ­ceis de forma constante. Ainda em desenvolvimento como jogador completo, a qualidade do arremesso por si sÃ³ jÃ¡ garante impacto ofensivo consistente em nÃ­vel profissional.",
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
    "accentColor": "#f97316"
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
    "tier": "FRINGE",
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
      "threepa": 7.5,
      "collegeRts": 12.8
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
      "notes": "Momcilovic Ã© um prospecto de perfil muito especÃ­fico: arremessador de elite no catch-and-shoot, com eficiÃªncia estatisticamente fora da curva nesta temporada e trajetÃ³ria de melhora documentada ao longo de trÃªs anos. As limitaÃ§Ãµes sÃ£o igualmente especÃ­ficas â€” quase nenhuma criaÃ§Ã£o prÃ³pria, raramente busca o aro, e histÃ³rico defensivo inconsistente com ressalvas sobre o rebote. A pergunta central sobre ele nÃ£o Ã© se arremessa bem, mas se o aproveitamento excepcional se sustenta quando as defesas da NBA, muito mais organizadas, fecham as rotas de passe e reduzem os looks abertos que Iowa State gerou para ele. A resposta a essa questÃ£o determinarÃ¡ inteiramente o seu valor real na liga.",
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
    "accentColor": "#f97316"
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
    "tier": "FRINGE",
    "rank": 30,
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
      },
      "collegeRts": -0.5
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
    "accentColor": "#f97316",
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
    "id": 32,
    "name": "Ebuka Okorie",
    "position": "SG/SF",
    "team": "Stanford",
    "age": 20,
    "height": "6'5\"",
    "weight": "200 lbs",
    "wingspan": "6'9\"",
    "tier": "FRINGE",
    "rank": 31,
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
      "threepa": 5.7,
      "collegeRts": 2.4
    },
    "scouting": {
      "strengths": [
        "Dribble separator violento â€” explosÃ£o downhill mais rÃ¡pida da classe",
        "Criador explosivo que forÃ§a decisÃµes rÃ¡pidas da defesa",
        "Arremessador capaz (36.7%)"
      ],
      "weaknesses": [
        "ConsistÃªncia no controle apÃ³s a explosÃ£o inicial",
        "PrecisÃ£o no arremesso em altos volumes"
      ],
      "notes": "Okorie liderou a ACC em pontuaÃ§Ã£o na temporada, com 8 jogos com pelo menos 30 pontos â€” quebrando o recorde de calouros da conferÃªncia estabelecido por Marvin Bagley III. Ã‰ descrito como o separador de drible mais violento e o atacante mais inegÃ¡vel descendo a quadra da classe â€” um perfil raro de guard com velocidade devastadora aliada a controle de corpo e manipulaÃ§Ã£o de ritmo sofisticados. A ressalva mais consistente entre os scouts Ã© a disposiÃ§Ã£o como criador para os colegas: os instintos de finalizador Ã s vezes suprimem a visÃ£o de jogo num grau que precisarÃ¡ evoluir no nÃ­vel profissional.",
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
    "accentColor": "#f97316"
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
    "tier": "FRINGE",
    "rank": 32,
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
      "threepa": 3,
      "collegeRts": 9.9
    },
    "scouting": {
      "strengths": [
        "DimensÃµes elite para rim protector (7'1\" + 7'4\" wingspan)",
        "EficiÃªncia alta no aro (54.2% FG)",
        "Reboteiro consistente em Big ACC"
      ],
      "weaknesses": [
        "Tiro de 3 limitado (29.4%) â€” espacing mÃ­nimo",
        "Jogo mais velho (22) sem explosividade de elite"
      ],
      "notes": "Veesaar Ã© um pivÃ´ de 7 pÃ©s com a rara combinaÃ§Ã£o de arremesso de perÃ­metro e presenÃ§a ofensiva convencional: converte 75,9% das tentativas no aro e aparece entre os lÃ­deres nacionais em enterradas, enquanto tambÃ©m acerta a bola de trÃªs em volume crescente. O senso de passe Ã© um ativo real â€” ele encontra cortadores de posiÃ§Ãµes estacionÃ¡rias, opera no short-roll e executa sets de high-low com precisÃ£o, o que o torna mais do que uma Ã¢ncora estÃ¡tica. A principal fragilidade estÃ¡ na defesa em espaÃ§o: sua mobilidade horizontal limitada o torna um alvo em situaÃ§Ãµes de switch, e o desenvolvimento como protetor de aro ainda deixa a desejar, exigindo que seja colocado ao lado de um ala mais atlÃ©tico para cobrir seu raio de atuaÃ§Ã£o.",
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
    "accentColor": "#f97316"
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
    "rank": 33,
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
      "fta": 2,
      "collegeRts": 4.7
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
    "accentColor": "#8b5e34",
    "dataSources": {
      "officialStatus": "NBA early entry list 2026",
      "traditionalStats": "ESPN player stats",
      "traditionalStatsUrl": "https://www.espn.com/mens-college-basketball/player/stats/_/id/5060732/billy-richmond-iii",
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
    "rank": 34,
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
    "accentColor": "#8b5e34",
    "dataSources": {
      "officialStatus": "NBA early entry list 2026",
      "traditionalStats": "Basketball-Reference Mega Superbet 2025-26",
      "traditionalStatsUrl": "https://www.basketball-reference.com/international/teams/mega/2026.html",
      "lastVerified": "2026-04-30"
    }
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
    "tier": "SLEEPER",
    "rank": 35,
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
      "threepa": 0.1,
      "collegeRts": 5.8
    },
    "scouting": {
      "strengths": [
        "Tamanho e envergadura de rim protector de nÃ­vel NBA",
        "EficiÃªncia alta como finalizador (52.7% FG) em posiÃ§Ãµes de baixo posto",
        "All-SEC Freshman Team 2026"
      ],
      "weaknesses": [
        "Sem arremesso externo â€” zero tentativas de 3 em 2025-26",
        "Lance livre baixo (64.2%) revela limitaÃ§Ãµes de toque"
      ],
      "notes": "Moreno Ã© um prospecto de perfil moderno para a posiÃ§Ã£o: baixo uso, boa distribuiÃ§Ã£o para um pivÃ´, alto Ã­ndice Morey e presenÃ§a frequente na linha de lances livres. O BPM elevado sugere impacto real enquanto estÃ¡ em quadra. O obstÃ¡culo central Ã© a finalizaÃ§Ã£o na borda â€” o Ãºnico caminho ofensivo verdadeiramente disponÃ­vel para ele, dado que nÃ£o arremessa de trÃªs pontos. Se nÃ£o resolver essa conversÃ£o, o teto ofensivo se estreita consideravelmente, independentemente das outras qualidades que apresenta.",
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
    "accentColor": "#8b5e34"
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
    "rank": 36,
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
      "threepa": 4.5,
      "collegeRts": 4.7
    },
    "scouting": {
      "strengths": [
        "All-SEC First Team â€” grande avanÃ§o no segundo ano",
        "Playmaking e scoring balanceados (16/5 PTS/AST)",
        "Arremessador de 3 elite (38.7%)"
      ],
      "weaknesses": [
        "Tamanho limÃ­trofe (6'3\")",
        "Defesa no ponto de ataque questiona a retenÃ§Ã£o na NBA"
      ],
      "notes": "Tanner Ã© um prospecto de nÃºmeros excepcionais em quase todas as categorias relevantes â€” eficiÃªncia, criaÃ§Ã£o, controle de turnovers, roubos, impacto geral â€” produzidos com carga ofensiva real e evoluÃ§Ã£o clara entre as temporadas. O BPM Ã© o mais alto entre os perfis desta sÃ©rie. A Ãºnica coluna de fraquezas listada no perfil Ã© inteiramente composta por medidas fÃ­sicas: altura, envergadura, peso e rebote ofensivo. Ã‰ um caso raro em que o corpo e os nÃºmeros apontam em direÃ§Ãµes opostas, e a avaliaÃ§Ã£o final depende quase inteiramente de quanto uma franquia da NBA estÃ¡ disposta a apostar que a competÃªncia compensa a estrutura.",
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
    "accentColor": "#8b5e34"
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
    "rank": 37,
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
        "Arremessador de 3 sÃ³lido (37.8%)",
        "Dois lados da bola com comprometimento defensivo"
      ],
      "weaknesses": [
        "Sem papel estelar definido â€” sempre arma secundÃ¡ria",
        "CriaÃ§Ã£o primÃ¡ria limitada"
      ],
      "notes": "Guarda de rotaÃ§Ã£o com valor real. System-dependent mas com habilidades transferÃ­veis.",
      "attributes": {
        "Athleticism": 4.8,
        "Shooting": 7.1,
        "Playmaking": 4.7,
        "Defense": 4.8,
        "Rebounding": 4.3,
        "BBIQ": 5
      }
    },
    "accentColor": "#8b5e34"
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
    "rank": 38,
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
      "threepa": 7.5,
      "collegeRts": 1.6
    },
    "scouting": {
      "strengths": [
        "ProduÃ§Ã£o alta em volume com tamanho wing elite (6'8\" + 7'0\")",
        "Reboteiro ativo e competitivo no pÃ³s",
        "Potencial two-way com desenvolvimento"
      ],
      "weaknesses": [
        "ACC program de menor calibre â€” menor exposiÃ§Ã£o",
        "Tiro de 3 mediano (34.9%)"
      ],
      "notes": "Harris Ã© um prospecto com altura relevante, agressividade real na busca do contato e salto de produÃ§Ã£o expressivo no segundo ano. Os problemas sÃ£o estruturais em dois pontos: conversÃ£o abaixo da mÃ©dia na borda e nos trÃªs pontos, que sÃ£o as zonas onde mais tenta arremessar, e impacto defensivo negativo que se agravou com o aumento de minutos. O perfil ofensivo depende excessivamente dos lances livres para ser eficiente â€” o que Ã© uma estratÃ©gia vÃ¡lida, mas frÃ¡gil em nÃ­veis mais altos de jogo, onde as defesas ajustam e as arbitragens sÃ£o menos generosas. O desenvolvimento da finalizaÃ§Ã£o limpa e da consistÃªncia no perÃ­metro determinarÃ¡ se ele se torna jogador de rotaÃ§Ã£o ou permanece como contribuinte pontual.",
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
    "accentColor": "#8b5e34"
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
    "rank": 39,
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
        "Wing com tiro de 3 (36.8%) e tamanho para defender mÃºltiplas posiÃ§Ãµes",
        "Produtor consistente no ACC",
        "Comprimento e mobilidade two-way"
      ],
      "weaknesses": [
        "Program menor em termos de exposiÃ§Ã£o nacional",
        "CriaÃ§Ã£o ISO limitada"
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
    "accentColor": "#8b5e34"
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
    "rank": 40,
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
      "threepa": 0.1,
      "collegeRts": 8.2
    },
    "scouting": {
      "strengths": [
        "EficiÃªncia no aro de elite (58.3% FG)",
        "Rebotetador de alta porcentagem em Big 12",
        "DimensÃµes autÃªnticas para centro moderno"
      ],
      "weaknesses": [
        "Sem extensÃ£o de arremesso alguma",
        "Lance livre baixo (62.5%)"
      ],
      "notes": "Bidunga Ã© um prospecto com impacto defensivo de elite e altÃ­ssima eficiÃªncia na finalizaÃ§Ã£o de jogadas, evidenciando uma transiÃ§Ã£o sÃ³lida de minutagem para o segundo ano. Os problemas estruturais moram nas dimensÃµes fÃ­sicas: a altura e o peso abaixo do padrÃ£o para a posiÃ§Ã£o de pivÃ´ prejudicam severamente sua capacidade de coletar rebotes e de cavar lances livres atravÃ©s de contato no garrafÃ£o. O perfil ofensivo Ã© unidimensional, restrito Ã  finalizaÃ§Ã£o na borda sem qualquer espaÃ§amento de perÃ­metro. A sua viabilidade na NBA passarÃ¡ por comprovar que a excelÃªncia em proteger o aro (RAPM 99) e finalizar em movimento se sustenta contra oponentes mais altos e pesados, compensando suas limitaÃ§Ãµes de tamanho e de rebote.",
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
    "accentColor": "#8b5e34"
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
    "rank": 41,
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
    "accentColor": "#8b5e34",
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
    "rank": 42,
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
      "fta": 5.9,
      "collegeRts": 1.1
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
    "accentColor": "#8b5e34",
    "dataSources": {
      "officialStatus": "NBA early entry list 2026",
      "traditionalStats": "Tankathon 2026 Draft Profile",
      "traditionalStatsUrl": "https://www.tankathon.com/players/jeremy-fears-jr",
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
    "accentColor": "#8b5e34",
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
    "accentColor": "#8b5e34",
    "dataSources": {
      "officialStatus": "NBA early entry list 2026",
      "traditionalStats": "RealGM/Basketball-Reference international profile",
      "traditionalStatsUrl": "https://basketball.realgm.com/player/Alexandros-Samodurov/Summary/183456",
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
    "rank": 45,
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
    "accentColor": "#8b5e34",
    "dataSources": {
      "officialStatus": "NBA early entry list 2026",
      "traditionalStats": "Tankathon 2026 Draft Profile",
      "traditionalStatsUrl": "https://www.tankathon.com/players/andrej-stojakovic",
      "lastVerified": "2026-04-30"
    }
  },
  {
    "id": 64,
    "name": "Zuby Ejiofor",
    "position": "PF/C",
    "team": "St. John's",
    "age": 22.2,
    "height": "6'9\"",
    "weight": "245 lbs",
    "wingspan": "7'2\"",
    "tier": "SLEEPER",
    "rank": 24,
    "stats": {
      "ppg": 16.3,
      "rpg": 7.3,
      "apg": 3.5,
      "fgp": null,
      "threep": 30.5,
      "ftp": 71.8,
      "per": null,
      "ts": 60.9,
      "usg": 26.4,
      "efg": 56,
      "astTo": 1.7,
      "blkPct": 7.2,
      "stlPct": 2.2,
      "games": 37,
      "fgm": 200,
      "fga": 373,
      "threepm": 18,
      "threepa": 59,
      "ftm": 186,
      "fta": 259,
      "collegeRts": 4.4
    },
    "scouting": {
      "strengths": [],
      "weaknesses": [],
      "notes": "Descrição em andamento",
      "attributes": {
        "Athleticism": null,
        "Shooting": null,
        "Playmaking": null,
        "Defense": null,
        "Rebounding": null,
        "BBIQ": null
      },
      "evaluation": {
        "version": "draftballr_import_basic_v1",
        "floor": {
          "score": null,
          "label": "",
          "note": ""
        },
        "ceiling": {
          "score": null,
          "label": "",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "",
          "note": ""
        },
        "tools": {
          "shooting": "",
          "creation": "",
          "defense": "",
          "rebounding": "",
          "efficiency": ""
        },
        "note": "Imported automatically with basic DraftBallr data. Review manually before editorial use."
      }
    },
    "accentColor": "#8b5e34",
    "source": "draftballr",
    "dataStatus": "imported-basic",
    "needsReview": true,
    "draftballr": {
      "playerId": 77145,
      "rowId": 3513284,
      "slug": "zuby-ejiofor",
      "position": "PF/C",
      "classYear": "Sr",
      "conference": "BE",
      "bigBoardRank": 24,
      "draftable": true,
      "importedAt": "2026-05-11"
    }
  },
  {
    "id": 65,
    "name": "Richie Saunders",
    "position": "SG/SF",
    "team": "BYU",
    "age": 24.8,
    "height": "6'5\"",
    "weight": "200 lbs",
    "wingspan": "6'8\"",
    "tier": "SLEEPER",
    "rank": 35,
    "stats": {
      "ppg": 18,
      "rpg": 5.8,
      "apg": 2.1,
      "fgp": null,
      "threep": 37.6,
      "ftp": 81.7,
      "per": null,
      "ts": 63.2,
      "usg": 23.8,
      "efg": 59.3,
      "astTo": 1.3,
      "blkPct": 1,
      "stlPct": 3.1,
      "games": 25,
      "fgm": 149,
      "fga": 305,
      "threepm": 64,
      "threepa": 170,
      "ftm": 89,
      "fta": 109,
      "collegeRts": 6.7
    },
    "scouting": {
      "strengths": [],
      "weaknesses": [],
      "notes": "Descrição em andamento",
      "attributes": {
        "Athleticism": null,
        "Shooting": null,
        "Playmaking": null,
        "Defense": null,
        "Rebounding": null,
        "BBIQ": null
      },
      "evaluation": {
        "version": "draftballr_import_basic_v1",
        "floor": {
          "score": null,
          "label": "",
          "note": ""
        },
        "ceiling": {
          "score": null,
          "label": "",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "",
          "note": ""
        },
        "tools": {
          "shooting": "",
          "creation": "",
          "defense": "",
          "rebounding": "",
          "efficiency": ""
        },
        "note": "Imported automatically with basic DraftBallr data. Review manually before editorial use."
      }
    },
    "accentColor": "#8b5e34",
    "source": "draftballr",
    "dataStatus": "imported-basic",
    "needsReview": true,
    "draftballr": {
      "playerId": 76396,
      "rowId": 3513132,
      "slug": "richie-saunders",
      "position": "Wing G",
      "classYear": "Sr",
      "conference": "B12",
      "bigBoardRank": 35,
      "draftable": true,
      "importedAt": "2026-05-11"
    }
  },
  {
    "id": 66,
    "name": "Braden Smith",
    "position": "PG",
    "team": "Purdue",
    "age": 22.9,
    "height": "6'0\"",
    "weight": "170 lbs",
    "wingspan": "6'5\"",
    "tier": "SLEEPER",
    "rank": 36,
    "stats": {
      "ppg": 14.3,
      "rpg": 3.5,
      "apg": 8.8,
      "fgp": null,
      "threep": 36.2,
      "ftp": 82.5,
      "per": null,
      "ts": 55.2,
      "usg": 26.5,
      "efg": 51.1,
      "astTo": 3.1,
      "blkPct": 0.7,
      "stlPct": 3,
      "games": 39,
      "fgm": 197,
      "fga": 448,
      "threepm": 64,
      "threepa": 177,
      "ftm": 99,
      "fta": 120,
      "collegeRts": -1.3
    },
    "scouting": {
      "strengths": [],
      "weaknesses": [],
      "notes": "Descrição em andamento",
      "attributes": {
        "Athleticism": null,
        "Shooting": null,
        "Playmaking": null,
        "Defense": null,
        "Rebounding": null,
        "BBIQ": null
      },
      "evaluation": {
        "version": "draftballr_import_basic_v1",
        "floor": {
          "score": null,
          "label": "",
          "note": ""
        },
        "ceiling": {
          "score": null,
          "label": "",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "",
          "note": ""
        },
        "tools": {
          "shooting": "",
          "creation": "",
          "defense": "",
          "rebounding": "",
          "efficiency": ""
        },
        "note": "Imported automatically with basic DraftBallr data. Review manually before editorial use."
      }
    },
    "accentColor": "#8b5e34",
    "source": "draftballr",
    "dataStatus": "imported-basic",
    "needsReview": true,
    "draftballr": {
      "playerId": 76196,
      "rowId": 3513100,
      "slug": "braden-smith",
      "position": "Pure PG",
      "classYear": "Sr",
      "conference": "B10",
      "bigBoardRank": 36,
      "draftable": true,
      "importedAt": "2026-05-11"
    }
  },
  {
    "id": 67,
    "name": "Darrion Williams",
    "position": "SG/SF",
    "team": "N.C. State",
    "age": 23.2,
    "height": "6'6\"",
    "weight": "236 lbs",
    "wingspan": "6'7\"",
    "tier": "SLEEPER",
    "rank": 41,
    "stats": {
      "ppg": 14,
      "rpg": 4.6,
      "apg": 2.8,
      "fgp": null,
      "threep": 40.4,
      "ftp": 77.3,
      "per": null,
      "ts": 53.3,
      "usg": 23.7,
      "efg": 51.1,
      "astTo": 1.8,
      "blkPct": 1.3,
      "stlPct": 2,
      "games": 33,
      "fgm": 166,
      "fga": 401,
      "threepm": 78,
      "threepa": 193,
      "ftm": 51,
      "fta": 66,
      "collegeRts": -3.2
    },
    "scouting": {
      "strengths": [],
      "weaknesses": [],
      "notes": "Descrição em andamento",
      "attributes": {
        "Athleticism": null,
        "Shooting": null,
        "Playmaking": null,
        "Defense": null,
        "Rebounding": null,
        "BBIQ": null
      },
      "evaluation": {
        "version": "draftballr_import_basic_v1",
        "floor": {
          "score": null,
          "label": "",
          "note": ""
        },
        "ceiling": {
          "score": null,
          "label": "",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "",
          "note": ""
        },
        "tools": {
          "shooting": "",
          "creation": "",
          "defense": "",
          "rebounding": "",
          "efficiency": ""
        },
        "note": "Imported automatically with basic DraftBallr data. Review manually before editorial use."
      }
    },
    "accentColor": "#8b5e34",
    "source": "draftballr",
    "dataStatus": "imported-basic",
    "needsReview": true,
    "draftballr": {
      "playerId": 75953,
      "rowId": 3513083,
      "slug": "darrion-williams",
      "position": "Wing G",
      "classYear": "Sr",
      "conference": "ACC",
      "bigBoardRank": 41,
      "draftable": true,
      "importedAt": "2026-05-11"
    }
  },
  {
    "id": 68,
    "name": "Tarris Reed Jr.",
    "position": "C",
    "team": "Connecticut",
    "age": 22.9,
    "height": "6'10\"",
    "weight": "265 lbs",
    "wingspan": "7'4\"",
    "tier": "SLEEPER",
    "rank": 42,
    "stats": {
      "ppg": 14.7,
      "rpg": 9,
      "apg": 2.3,
      "fgp": null,
      "threep": 0,
      "ftp": 61.7,
      "per": null,
      "ts": 61.4,
      "usg": 26.5,
      "efg": 60.7,
      "astTo": 1.2,
      "blkPct": 8.4,
      "stlPct": 2,
      "games": 35,
      "fgm": 210,
      "fga": 346,
      "threepm": 0,
      "threepa": 4,
      "ftm": 95,
      "fta": 154,
      "collegeRts": 4.9
    },
    "scouting": {
      "strengths": [],
      "weaknesses": [],
      "notes": "Descrição em andamento",
      "attributes": {
        "Athleticism": null,
        "Shooting": null,
        "Playmaking": null,
        "Defense": null,
        "Rebounding": null,
        "BBIQ": null
      },
      "evaluation": {
        "version": "draftballr_import_basic_v1",
        "floor": {
          "score": null,
          "label": "",
          "note": ""
        },
        "ceiling": {
          "score": null,
          "label": "",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "",
          "note": ""
        },
        "tools": {
          "shooting": "",
          "creation": "",
          "defense": "",
          "rebounding": "",
          "efficiency": ""
        },
        "note": "Imported automatically with basic DraftBallr data. Review manually before editorial use."
      }
    },
    "accentColor": "#8b5e34",
    "source": "draftballr",
    "dataStatus": "imported-basic",
    "needsReview": true,
    "draftballr": {
      "playerId": 77482,
      "rowId": 3513322,
      "slug": "tarris-reed-jr",
      "position": "C",
      "classYear": "Sr",
      "conference": "BE",
      "bigBoardRank": 42,
      "draftable": true,
      "importedAt": "2026-05-11"
    }
  },
  {
    "id": 69,
    "name": "Ryan Conwell",
    "position": "PG/SG",
    "team": "Louisville",
    "age": 22,
    "height": "6'3\"",
    "weight": "215 lbs",
    "wingspan": "6'8\"",
    "tier": "SLEEPER",
    "rank": 43,
    "stats": {
      "ppg": 18.8,
      "rpg": 4.8,
      "apg": 2.7,
      "fgp": null,
      "threep": 34.5,
      "ftp": 83.2,
      "per": null,
      "ts": 56.6,
      "usg": 27.5,
      "efg": 52.1,
      "astTo": 1.2,
      "blkPct": 0.6,
      "stlPct": 2,
      "games": 34,
      "fgm": 201,
      "fga": 493,
      "threepm": 112,
      "threepa": 325,
      "ftm": 124,
      "fta": 149,
      "collegeRts": 0.1
    },
    "scouting": {
      "strengths": [],
      "weaknesses": [],
      "notes": "Descrição em andamento",
      "attributes": {
        "Athleticism": null,
        "Shooting": null,
        "Playmaking": null,
        "Defense": null,
        "Rebounding": null,
        "BBIQ": null
      },
      "evaluation": {
        "version": "draftballr_import_basic_v1",
        "floor": {
          "score": null,
          "label": "",
          "note": ""
        },
        "ceiling": {
          "score": null,
          "label": "",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "",
          "note": ""
        },
        "tools": {
          "shooting": "",
          "creation": "",
          "defense": "",
          "rebounding": "",
          "efficiency": ""
        },
        "note": "Imported automatically with basic DraftBallr data. Review manually before editorial use."
      }
    },
    "accentColor": "#8b5e34",
    "source": "draftballr",
    "dataStatus": "imported-basic",
    "needsReview": true,
    "draftballr": {
      "playerId": 75878,
      "rowId": 3513070,
      "slug": "ryan-conwell",
      "position": "Combo G",
      "classYear": "Sr",
      "conference": "ACC",
      "bigBoardRank": 43,
      "draftable": true,
      "importedAt": "2026-05-11"
    }
  },
  {
    "id": 70,
    "name": "Nate Bittle",
    "position": "PF/C",
    "team": "Oregon",
    "age": 23.1,
    "height": "7'0\"",
    "weight": "252 lbs",
    "wingspan": "7'6\"",
    "tier": "SLEEPER",
    "rank": 44,
    "stats": {
      "ppg": 16.8,
      "rpg": 6.9,
      "apg": 2.6,
      "fgp": null,
      "threep": 31.9,
      "ftp": 73.2,
      "per": null,
      "ts": 56.3,
      "usg": 27.7,
      "efg": 52.2,
      "astTo": 1.2,
      "blkPct": 7,
      "stlPct": 1.7,
      "games": 25,
      "fgm": 145,
      "fga": 312,
      "threepm": 36,
      "threepa": 113,
      "ftm": 93,
      "fta": 127,
      "collegeRts": -0.2
    },
    "scouting": {
      "strengths": [],
      "weaknesses": [],
      "notes": "Descrição em andamento",
      "attributes": {
        "Athleticism": null,
        "Shooting": null,
        "Playmaking": null,
        "Defense": null,
        "Rebounding": null,
        "BBIQ": null
      },
      "evaluation": {
        "version": "draftballr_import_basic_v1",
        "floor": {
          "score": null,
          "label": "",
          "note": ""
        },
        "ceiling": {
          "score": null,
          "label": "",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "",
          "note": ""
        },
        "tools": {
          "shooting": "",
          "creation": "",
          "defense": "",
          "rebounding": "",
          "efficiency": ""
        },
        "note": "Imported automatically with basic DraftBallr data. Review manually before editorial use."
      }
    },
    "accentColor": "#8b5e34",
    "source": "draftballr",
    "dataStatus": "imported-basic",
    "needsReview": true,
    "draftballr": {
      "playerId": 75330,
      "rowId": 3513000,
      "slug": "nate-bittle",
      "position": "PF/C",
      "classYear": "Sr",
      "conference": "B10",
      "bigBoardRank": 44,
      "draftable": true,
      "importedAt": "2026-05-11"
    }
  },
  {
    "id": 71,
    "name": "Bruce Thornton",
    "position": "PG/SG",
    "team": "Ohio St.",
    "age": 22.8,
    "height": "6'2\"",
    "weight": "205 lbs",
    "wingspan": "",
    "tier": "SLEEPER",
    "rank": 45,
    "stats": {
      "ppg": 19.9,
      "rpg": 5.1,
      "apg": 3.9,
      "fgp": null,
      "threep": 40,
      "ftp": 82.9,
      "per": null,
      "ts": 66.5,
      "usg": 23.2,
      "efg": 62.6,
      "astTo": 3,
      "blkPct": 0.8,
      "stlPct": 1.9,
      "games": 34,
      "fgm": 237,
      "fga": 428,
      "threepm": 62,
      "threepa": 155,
      "ftm": 141,
      "fta": 170,
      "collegeRts": 10
    },
    "scouting": {
      "strengths": [],
      "weaknesses": [],
      "notes": "Descrição em andamento",
      "attributes": {
        "Athleticism": null,
        "Shooting": null,
        "Playmaking": null,
        "Defense": null,
        "Rebounding": null,
        "BBIQ": null
      },
      "evaluation": {
        "version": "draftballr_import_basic_v1",
        "floor": {
          "score": null,
          "label": "",
          "note": ""
        },
        "ceiling": {
          "score": null,
          "label": "",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "",
          "note": ""
        },
        "tools": {
          "shooting": "",
          "creation": "",
          "defense": "",
          "rebounding": "",
          "efficiency": ""
        },
        "note": "Imported automatically with basic DraftBallr data. Review manually before editorial use."
      }
    },
    "accentColor": "#8b5e34",
    "source": "draftballr",
    "dataStatus": "imported-basic",
    "needsReview": true,
    "draftballr": {
      "playerId": 76969,
      "rowId": 3513232,
      "slug": "bruce-thornton",
      "position": "Combo G",
      "classYear": "Sr",
      "conference": "B10",
      "bigBoardRank": 45,
      "draftable": true,
      "importedAt": "2026-05-11"
    }
  },
  {
    "id": 72,
    "name": "Alex Karaban",
    "position": "SF/PF",
    "team": "Connecticut",
    "age": 23.6,
    "height": "6'8\"",
    "weight": "219 lbs",
    "wingspan": "6'11\"",
    "tier": "SLEEPER",
    "rank": 46,
    "stats": {
      "ppg": 13.2,
      "rpg": 5.3,
      "apg": 2.4,
      "fgp": null,
      "threep": 37.4,
      "ftp": 85.1,
      "per": null,
      "ts": 59,
      "usg": 17.6,
      "efg": 55.9,
      "astTo": 2.2,
      "blkPct": 2.8,
      "stlPct": 1.5,
      "games": 40,
      "fgm": 188,
      "fga": 405,
      "threepm": 77,
      "threepa": 206,
      "ftm": 74,
      "fta": 87,
      "collegeRts": 2.5
    },
    "scouting": {
      "strengths": [],
      "weaknesses": [],
      "notes": "Descrição em andamento",
      "attributes": {
        "Athleticism": null,
        "Shooting": null,
        "Playmaking": null,
        "Defense": null,
        "Rebounding": null,
        "BBIQ": null
      },
      "evaluation": {
        "version": "draftballr_import_basic_v1",
        "floor": {
          "score": null,
          "label": "",
          "note": ""
        },
        "ceiling": {
          "score": null,
          "label": "",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "",
          "note": ""
        },
        "tools": {
          "shooting": "",
          "creation": "",
          "defense": "",
          "rebounding": "",
          "efficiency": ""
        },
        "note": "Imported automatically with basic DraftBallr data. Review manually before editorial use."
      }
    },
    "accentColor": "#8b5e34",
    "source": "draftballr",
    "dataStatus": "imported-basic",
    "needsReview": true,
    "draftballr": {
      "playerId": 76473,
      "rowId": 3513144,
      "slug": "alex-karaban",
      "position": "Wing F",
      "classYear": "Sr",
      "conference": "BE",
      "bigBoardRank": 46,
      "draftable": true,
      "importedAt": "2026-05-11"
    }
  },
  {
    "id": 73,
    "name": "Trevon Brazile",
    "position": "PF/C",
    "team": "Arkansas",
    "age": 23.5,
    "height": "6'10\"",
    "weight": "215 lbs",
    "wingspan": "7'4\"",
    "tier": "SLEEPER",
    "rank": 47,
    "stats": {
      "ppg": 13,
      "rpg": 7.3,
      "apg": 1.6,
      "fgp": null,
      "threep": 34.1,
      "ftp": 71.7,
      "per": null,
      "ts": 61.9,
      "usg": 17.2,
      "efg": 59.5,
      "astTo": 1.5,
      "blkPct": 5.2,
      "stlPct": 2.6,
      "games": 36,
      "fgm": 169,
      "fga": 322,
      "threepm": 45,
      "threepa": 132,
      "ftm": 86,
      "fta": 120,
      "collegeRts": 5.4
    },
    "scouting": {
      "strengths": [],
      "weaknesses": [],
      "notes": "Descrição em andamento",
      "attributes": {
        "Athleticism": null,
        "Shooting": null,
        "Playmaking": null,
        "Defense": null,
        "Rebounding": null,
        "BBIQ": null
      },
      "evaluation": {
        "version": "draftballr_import_basic_v1",
        "floor": {
          "score": null,
          "label": "",
          "note": ""
        },
        "ceiling": {
          "score": null,
          "label": "",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "",
          "note": ""
        },
        "tools": {
          "shooting": "",
          "creation": "",
          "defense": "",
          "rebounding": "",
          "efficiency": ""
        },
        "note": "Imported automatically with basic DraftBallr data. Review manually before editorial use."
      }
    },
    "accentColor": "#8b5e34",
    "source": "draftballr",
    "dataStatus": "imported-basic",
    "needsReview": true,
    "draftballr": {
      "playerId": 75756,
      "rowId": 3513061,
      "slug": "trevon-brazile",
      "position": "Stretch 4",
      "classYear": "Sr",
      "conference": "SEC",
      "bigBoardRank": 47,
      "draftable": true,
      "importedAt": "2026-05-11"
    }
  },
  {
    "id": 74,
    "name": "Quadir Copeland",
    "position": "PG",
    "team": "N.C. State",
    "age": 22.7,
    "height": "6'6\"",
    "weight": "200 lbs",
    "wingspan": "6'10\"",
    "tier": "SLEEPER",
    "rank": 48,
    "stats": {
      "ppg": 13.9,
      "rpg": 3.6,
      "apg": 6.5,
      "fgp": null,
      "threep": 39.7,
      "ftp": 77.5,
      "per": null,
      "ts": 59.2,
      "usg": 28.1,
      "efg": 53,
      "astTo": 2.3,
      "blkPct": 0.6,
      "stlPct": 3.6,
      "games": 34,
      "fgm": 155,
      "fga": 314,
      "threepm": 23,
      "threepa": 58,
      "ftm": 141,
      "fta": 182,
      "collegeRts": 2.7
    },
    "scouting": {
      "strengths": [],
      "weaknesses": [],
      "notes": "Descrição em andamento",
      "attributes": {
        "Athleticism": null,
        "Shooting": null,
        "Playmaking": null,
        "Defense": null,
        "Rebounding": null,
        "BBIQ": null
      },
      "evaluation": {
        "version": "draftballr_import_basic_v1",
        "floor": {
          "score": null,
          "label": "",
          "note": ""
        },
        "ceiling": {
          "score": null,
          "label": "",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "",
          "note": ""
        },
        "tools": {
          "shooting": "",
          "creation": "",
          "defense": "",
          "rebounding": "",
          "efficiency": ""
        },
        "note": "Imported automatically with basic DraftBallr data. Review manually before editorial use."
      }
    },
    "accentColor": "#8b5e34",
    "source": "draftballr",
    "dataStatus": "imported-basic",
    "needsReview": true,
    "draftballr": {
      "playerId": 76308,
      "rowId": 3513119,
      "slug": "quadir-copeland",
      "position": "Pure PG",
      "classYear": "Sr",
      "conference": "ACC",
      "bigBoardRank": 48,
      "draftable": true,
      "importedAt": "2026-05-11"
    }
  },
  {
    "id": 75,
    "name": "Rueben Chinyelu",
    "position": "C",
    "team": "Florida",
    "age": 22.7,
    "height": "6'11\"",
    "weight": "260 lbs",
    "wingspan": "7'8\"",
    "tier": "SLEEPER",
    "rank": 49,
    "stats": {
      "ppg": 10.9,
      "rpg": 11.2,
      "apg": 0.7,
      "fgp": null,
      "threep": 0,
      "ftp": 69.5,
      "per": null,
      "ts": 61,
      "usg": 20.1,
      "efg": 58.4,
      "astTo": 0.4,
      "blkPct": 4.2,
      "stlPct": 1.7,
      "games": 35,
      "fgm": 150,
      "fga": 257,
      "threepm": 0,
      "threepa": 2,
      "ftm": 82,
      "fta": 118,
      "collegeRts": 4.5
    },
    "scouting": {
      "strengths": [],
      "weaknesses": [],
      "notes": "Descrição em andamento",
      "attributes": {
        "Athleticism": null,
        "Shooting": null,
        "Playmaking": null,
        "Defense": null,
        "Rebounding": null,
        "BBIQ": null
      },
      "evaluation": {
        "version": "draftballr_import_basic_v1",
        "floor": {
          "score": null,
          "label": "",
          "note": ""
        },
        "ceiling": {
          "score": null,
          "label": "",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "",
          "note": ""
        },
        "tools": {
          "shooting": "",
          "creation": "",
          "defense": "",
          "rebounding": "",
          "efficiency": ""
        },
        "note": "Imported automatically with basic DraftBallr data. Review manually before editorial use."
      }
    },
    "accentColor": "#8b5e34",
    "source": "draftballr",
    "dataStatus": "imported-basic",
    "needsReview": true,
    "draftballr": {
      "playerId": 78281,
      "rowId": 3513393,
      "slug": "rueben-chinyelu",
      "position": "C",
      "classYear": "Jr",
      "conference": "SEC",
      "bigBoardRank": 49,
      "draftable": true,
      "importedAt": "2026-05-11"
    }
  },
  {
    "id": 76,
    "name": "Nick Martinelli",
    "position": "SF/PF",
    "team": "Northwestern",
    "age": 22.2,
    "height": "6'7\"",
    "weight": "225 lbs",
    "wingspan": "6'11\"",
    "tier": "SLEEPER",
    "rank": 50,
    "stats": {
      "ppg": 23,
      "rpg": 6.2,
      "apg": 2,
      "fgp": null,
      "threep": 41.7,
      "ftp": 80.9,
      "per": null,
      "ts": 60.2,
      "usg": 29.4,
      "efg": 55.2,
      "astTo": 1.4,
      "blkPct": 1.2,
      "stlPct": 1.4,
      "games": 33,
      "fgm": 268,
      "fga": 526,
      "threepm": 45,
      "threepa": 108,
      "ftm": 178,
      "fta": 220,
      "collegeRts": 3.7
    },
    "scouting": {
      "strengths": [],
      "weaknesses": [],
      "notes": "Descrição em andamento",
      "attributes": {
        "Athleticism": null,
        "Shooting": null,
        "Playmaking": null,
        "Defense": null,
        "Rebounding": null,
        "BBIQ": null
      },
      "evaluation": {
        "version": "draftballr_import_basic_v1",
        "floor": {
          "score": null,
          "label": "",
          "note": ""
        },
        "ceiling": {
          "score": null,
          "label": "",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "",
          "note": ""
        },
        "tools": {
          "shooting": "",
          "creation": "",
          "defense": "",
          "rebounding": "",
          "efficiency": ""
        },
        "note": "Imported automatically with basic DraftBallr data. Review manually before editorial use."
      }
    },
    "accentColor": "#8b5e34",
    "source": "draftballr",
    "dataStatus": "imported-basic",
    "needsReview": true,
    "draftballr": {
      "playerId": 76952,
      "rowId": 3513228,
      "slug": "nick-martinelli",
      "position": "Wing F",
      "classYear": "Sr",
      "conference": "B10",
      "bigBoardRank": 50,
      "draftable": true,
      "importedAt": "2026-05-11"
    }
  },
  {
    "id": 77,
    "name": "Tamin Lipsey",
    "position": "PG/SG",
    "team": "Iowa St.",
    "age": 23,
    "height": "6'1\"",
    "weight": "200 lbs",
    "wingspan": "6'5\"",
    "tier": "SLEEPER",
    "rank": 51,
    "stats": {
      "ppg": 13.5,
      "rpg": 3.9,
      "apg": 5.1,
      "fgp": null,
      "threep": 31.6,
      "ftp": 65.6,
      "per": null,
      "ts": 54,
      "usg": 22.9,
      "efg": 51.6,
      "astTo": 3.3,
      "blkPct": 0.1,
      "stlPct": 4.2,
      "games": 34,
      "fgm": 168,
      "fga": 366,
      "threepm": 42,
      "threepa": 133,
      "ftm": 80,
      "fta": 122,
      "collegeRts": -2.5
    },
    "scouting": {
      "strengths": [],
      "weaknesses": [],
      "notes": "Descrição em andamento",
      "attributes": {
        "Athleticism": null,
        "Shooting": null,
        "Playmaking": null,
        "Defense": null,
        "Rebounding": null,
        "BBIQ": null
      },
      "evaluation": {
        "version": "draftballr_import_basic_v1",
        "floor": {
          "score": null,
          "label": "",
          "note": ""
        },
        "ceiling": {
          "score": null,
          "label": "",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "",
          "note": ""
        },
        "tools": {
          "shooting": "",
          "creation": "",
          "defense": "",
          "rebounding": "",
          "efficiency": ""
        },
        "note": "Imported automatically with basic DraftBallr data. Review manually before editorial use."
      }
    },
    "accentColor": "#8b5e34",
    "source": "draftballr",
    "dataStatus": "imported-basic",
    "needsReview": true,
    "draftballr": {
      "playerId": 77122,
      "rowId": 3513276,
      "slug": "tamin-lipsey",
      "position": "Scoring PG",
      "classYear": "Sr",
      "conference": "B12",
      "bigBoardRank": 51,
      "draftable": true,
      "importedAt": "2026-05-11"
    }
  },
  {
    "id": 78,
    "name": "Jaden Bradley",
    "position": "PG/SG",
    "team": "Arizona",
    "age": 22.8,
    "height": "6'3\"",
    "weight": "185 lbs",
    "wingspan": "",
    "tier": "SLEEPER",
    "rank": 52,
    "stats": {
      "ppg": 13.3,
      "rpg": 3.4,
      "apg": 4.4,
      "fgp": null,
      "threep": 39.4,
      "ftp": 80.9,
      "per": null,
      "ts": 56.8,
      "usg": 21.1,
      "efg": 49.9,
      "astTo": 2.5,
      "blkPct": 0.3,
      "stlPct": 2.6,
      "games": 39,
      "fgm": 170,
      "fga": 367,
      "threepm": 26,
      "threepa": 66,
      "ftm": 152,
      "fta": 188,
      "collegeRts": 0.3
    },
    "scouting": {
      "strengths": [],
      "weaknesses": [],
      "notes": "Descrição em andamento",
      "attributes": {
        "Athleticism": null,
        "Shooting": null,
        "Playmaking": null,
        "Defense": null,
        "Rebounding": null,
        "BBIQ": null
      },
      "evaluation": {
        "version": "draftballr_import_basic_v1",
        "floor": {
          "score": null,
          "label": "",
          "note": ""
        },
        "ceiling": {
          "score": null,
          "label": "",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "",
          "note": ""
        },
        "tools": {
          "shooting": "",
          "creation": "",
          "defense": "",
          "rebounding": "",
          "efficiency": ""
        },
        "note": "Imported automatically with basic DraftBallr data. Review manually before editorial use."
      }
    },
    "accentColor": "#8b5e34",
    "source": "draftballr",
    "dataStatus": "imported-basic",
    "needsReview": true,
    "draftballr": {
      "playerId": 77082,
      "rowId": 3513267,
      "slug": "jaden-bradley",
      "position": "Scoring PG",
      "classYear": "Sr",
      "conference": "B12",
      "bigBoardRank": 52,
      "draftable": true,
      "importedAt": "2026-05-11"
    }
  },
  {
    "id": 79,
    "name": "Dillon Mitchell",
    "position": "PF/C",
    "team": "St. John's",
    "age": 22.7,
    "height": "6'8\"",
    "weight": "193 lbs",
    "wingspan": "6'10\"",
    "tier": "SLEEPER",
    "rank": 53,
    "stats": {
      "ppg": 8.3,
      "rpg": 7,
      "apg": 3,
      "fgp": null,
      "threep": 6.7,
      "ftp": 49.4,
      "per": null,
      "ts": 55.5,
      "usg": 15.9,
      "efg": 56.1,
      "astTo": 3,
      "blkPct": 2.6,
      "stlPct": 2.6,
      "games": 37,
      "fgm": 132,
      "fga": 236,
      "threepm": 1,
      "threepa": 15,
      "ftm": 43,
      "fta": 87,
      "collegeRts": -1
    },
    "scouting": {
      "strengths": [],
      "weaknesses": [],
      "notes": "Descrição em andamento",
      "attributes": {
        "Athleticism": null,
        "Shooting": null,
        "Playmaking": null,
        "Defense": null,
        "Rebounding": null,
        "BBIQ": null
      },
      "evaluation": {
        "version": "draftballr_import_basic_v1",
        "floor": {
          "score": null,
          "label": "",
          "note": ""
        },
        "ceiling": {
          "score": null,
          "label": "",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "",
          "note": ""
        },
        "tools": {
          "shooting": "",
          "creation": "",
          "defense": "",
          "rebounding": "",
          "efficiency": ""
        },
        "note": "Imported automatically with basic DraftBallr data. Review manually before editorial use."
      }
    },
    "accentColor": "#8b5e34",
    "source": "draftballr",
    "dataStatus": "imported-basic",
    "needsReview": true,
    "draftballr": {
      "playerId": 76429,
      "rowId": 3513137,
      "slug": "dillon-mitchell",
      "position": "PF/C",
      "classYear": "Sr",
      "conference": "BE",
      "bigBoardRank": 53,
      "draftable": true,
      "importedAt": "2026-05-11"
    }
  },
  {
    "id": 80,
    "name": "Kylan Boswell",
    "position": "PG/SG",
    "team": "Illinois",
    "age": 21.2,
    "height": "6'2\"",
    "weight": "180 lbs",
    "wingspan": "",
    "tier": "SLEEPER",
    "rank": 54,
    "stats": {
      "ppg": 12.3,
      "rpg": 4,
      "apg": 3,
      "fgp": null,
      "threep": 30.7,
      "ftp": 78.1,
      "per": null,
      "ts": 55.9,
      "usg": 20.6,
      "efg": 50.7,
      "astTo": 2.7,
      "blkPct": 0,
      "stlPct": 1.5,
      "games": 30,
      "fgm": 122,
      "fga": 275,
      "threepm": 35,
      "threepa": 114,
      "ftm": 89,
      "fta": 114,
      "collegeRts": -0.6
    },
    "scouting": {
      "strengths": [],
      "weaknesses": [],
      "notes": "Descrição em andamento",
      "attributes": {
        "Athleticism": null,
        "Shooting": null,
        "Playmaking": null,
        "Defense": null,
        "Rebounding": null,
        "BBIQ": null
      },
      "evaluation": {
        "version": "draftballr_import_basic_v1",
        "floor": {
          "score": null,
          "label": "",
          "note": ""
        },
        "ceiling": {
          "score": null,
          "label": "",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "",
          "note": ""
        },
        "tools": {
          "shooting": "",
          "creation": "",
          "defense": "",
          "rebounding": "",
          "efficiency": ""
        },
        "note": "Imported automatically with basic DraftBallr data. Review manually before editorial use."
      }
    },
    "accentColor": "#8b5e34",
    "source": "draftballr",
    "dataStatus": "imported-basic",
    "needsReview": true,
    "draftballr": {
      "playerId": 76818,
      "rowId": 3513216,
      "slug": "kylan-boswell",
      "position": "Combo G",
      "classYear": "Sr",
      "conference": "B10",
      "bigBoardRank": 54,
      "draftable": true,
      "importedAt": "2026-05-11"
    }
  },
  {
    "id": 81,
    "name": "Emanuel Sharp",
    "position": "PG/SG",
    "team": "Houston",
    "age": 22.3,
    "height": "6'3\"",
    "weight": "",
    "wingspan": "",
    "tier": "SLEEPER",
    "rank": 55,
    "stats": {
      "ppg": 15.5,
      "rpg": 3,
      "apg": 1.7,
      "fgp": null,
      "threep": 37.2,
      "ftp": 89.1,
      "per": null,
      "ts": 58.2,
      "usg": 23.2,
      "efg": 52.7,
      "astTo": 1.8,
      "blkPct": 0.4,
      "stlPct": 2.5,
      "games": 37,
      "fgm": 176,
      "fga": 426,
      "threepm": 97,
      "threepa": 261,
      "ftm": 123,
      "fta": 138,
      "collegeRts": 1.7
    },
    "scouting": {
      "strengths": [],
      "weaknesses": [],
      "notes": "Descrição em andamento",
      "attributes": {
        "Athleticism": null,
        "Shooting": null,
        "Playmaking": null,
        "Defense": null,
        "Rebounding": null,
        "BBIQ": null
      },
      "evaluation": {
        "version": "draftballr_import_basic_v1",
        "floor": {
          "score": null,
          "label": "",
          "note": ""
        },
        "ceiling": {
          "score": null,
          "label": "",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "",
          "note": ""
        },
        "tools": {
          "shooting": "",
          "creation": "",
          "defense": "",
          "rebounding": "",
          "efficiency": ""
        },
        "note": "Imported automatically with basic DraftBallr data. Review manually before editorial use."
      }
    },
    "accentColor": "#8b5e34",
    "source": "draftballr",
    "dataStatus": "imported-basic",
    "needsReview": true,
    "draftballr": {
      "playerId": 76775,
      "rowId": 3513201,
      "slug": "emanuel-sharp",
      "position": "Combo G",
      "classYear": "Sr",
      "conference": "B12",
      "bigBoardRank": 55,
      "draftable": true,
      "importedAt": "2026-05-11"
    }
  },
  {
    "id": 82,
    "name": "Tucker DeVries",
    "position": "SG/SF",
    "team": "Indiana",
    "age": 23.6,
    "height": "6'7\"",
    "weight": "190 lbs",
    "wingspan": "",
    "tier": "SLEEPER",
    "rank": 56,
    "stats": {
      "ppg": 13.7,
      "rpg": 5.2,
      "apg": 3.3,
      "fgp": null,
      "threep": 33.3,
      "ftp": 85.9,
      "per": null,
      "ts": 54.6,
      "usg": 21.2,
      "efg": 51,
      "astTo": 2.2,
      "blkPct": 1.8,
      "stlPct": 2,
      "games": 32,
      "fgm": 144,
      "fga": 363,
      "threepm": 82,
      "threepa": 246,
      "ftm": 67,
      "fta": 78,
      "collegeRts": -1.9
    },
    "scouting": {
      "strengths": [],
      "weaknesses": [],
      "notes": "Descrição em andamento",
      "attributes": {
        "Athleticism": null,
        "Shooting": null,
        "Playmaking": null,
        "Defense": null,
        "Rebounding": null,
        "BBIQ": null
      },
      "evaluation": {
        "version": "draftballr_import_basic_v1",
        "floor": {
          "score": null,
          "label": "",
          "note": ""
        },
        "ceiling": {
          "score": null,
          "label": "",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "",
          "note": ""
        },
        "tools": {
          "shooting": "",
          "creation": "",
          "defense": "",
          "rebounding": "",
          "efficiency": ""
        },
        "note": "Imported automatically with basic DraftBallr data. Review manually before editorial use."
      }
    },
    "accentColor": "#8b5e34",
    "source": "draftballr",
    "dataStatus": "imported-basic",
    "needsReview": true,
    "draftballr": {
      "playerId": 75260,
      "rowId": 3512988,
      "slug": "tucker-devries",
      "position": "Wing G",
      "classYear": "Sr",
      "conference": "B10",
      "bigBoardRank": 56,
      "draftable": true,
      "importedAt": "2026-05-11"
    }
  },
  {
    "id": 83,
    "name": "Tyler Nickel",
    "position": "SG/SF",
    "team": "Vanderbilt",
    "age": 22.8,
    "height": "6'7\"",
    "weight": "210 lbs",
    "wingspan": "",
    "tier": "SLEEPER",
    "rank": 58,
    "stats": {
      "ppg": 13.5,
      "rpg": 3.2,
      "apg": 1.2,
      "fgp": null,
      "threep": 40,
      "ftp": 84.7,
      "per": null,
      "ts": 61.7,
      "usg": 16.9,
      "efg": 59.6,
      "astTo": 1.7,
      "blkPct": 1.9,
      "stlPct": 1.4,
      "games": 36,
      "fgm": 163,
      "fga": 366,
      "threepm": 110,
      "threepa": 275,
      "ftm": 50,
      "fta": 59,
      "collegeRts": 5.2
    },
    "scouting": {
      "strengths": [],
      "weaknesses": [],
      "notes": "Descrição em andamento",
      "attributes": {
        "Athleticism": null,
        "Shooting": null,
        "Playmaking": null,
        "Defense": null,
        "Rebounding": null,
        "BBIQ": null
      },
      "evaluation": {
        "version": "draftballr_import_basic_v1",
        "floor": {
          "score": null,
          "label": "",
          "note": ""
        },
        "ceiling": {
          "score": null,
          "label": "",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "",
          "note": ""
        },
        "tools": {
          "shooting": "",
          "creation": "",
          "defense": "",
          "rebounding": "",
          "efficiency": ""
        },
        "note": "Imported automatically with basic DraftBallr data. Review manually before editorial use."
      }
    },
    "accentColor": "#8b5e34",
    "source": "draftballr",
    "dataStatus": "imported-basic",
    "needsReview": true,
    "draftballr": {
      "playerId": 76761,
      "rowId": 3513197,
      "slug": "tyler-nickel",
      "position": "Wing G",
      "classYear": "Sr",
      "conference": "SEC",
      "bigBoardRank": 58,
      "draftable": true,
      "importedAt": "2026-05-11"
    }
  },
  {
    "id": 84,
    "name": "Keanu Dawes",
    "position": "PF/C",
    "team": "Utah",
    "age": 21.2,
    "height": "6'9\"",
    "weight": "210 lbs",
    "wingspan": "",
    "tier": "SLEEPER",
    "rank": 59,
    "stats": {
      "ppg": 12.5,
      "rpg": 8.8,
      "apg": 2.2,
      "fgp": null,
      "threep": 31.7,
      "ftp": 72.4,
      "per": null,
      "ts": 62.8,
      "usg": 19.9,
      "efg": 60.5,
      "astTo": 1.2,
      "blkPct": 1.2,
      "stlPct": 1,
      "games": 32,
      "fgm": 148,
      "fga": 271,
      "threepm": 32,
      "threepa": 101,
      "ftm": 71,
      "fta": 98,
      "collegeRts": 6.3
    },
    "scouting": {
      "strengths": [],
      "weaknesses": [],
      "notes": "Descrição em andamento",
      "attributes": {
        "Athleticism": null,
        "Shooting": null,
        "Playmaking": null,
        "Defense": null,
        "Rebounding": null,
        "BBIQ": null
      },
      "evaluation": {
        "version": "draftballr_import_basic_v1",
        "floor": {
          "score": null,
          "label": "",
          "note": ""
        },
        "ceiling": {
          "score": null,
          "label": "",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "",
          "note": ""
        },
        "tools": {
          "shooting": "",
          "creation": "",
          "defense": "",
          "rebounding": "",
          "efficiency": ""
        },
        "note": "Imported automatically with basic DraftBallr data. Review manually before editorial use."
      }
    },
    "accentColor": "#8b5e34",
    "source": "draftballr",
    "dataStatus": "imported-basic",
    "needsReview": true,
    "draftballr": {
      "playerId": 78899,
      "rowId": 3513431,
      "slug": "keanu-dawes",
      "position": "Stretch 4",
      "classYear": "Jr",
      "conference": "B12",
      "bigBoardRank": 59,
      "draftable": true,
      "importedAt": "2026-05-11"
    }
  },
  {
    "id": 85,
    "name": "Micah Handlogten",
    "position": "C",
    "team": "Florida",
    "age": 22.5,
    "height": "7'1\"",
    "weight": "255 lbs",
    "wingspan": "7'0\"",
    "tier": "SLEEPER",
    "rank": 60,
    "stats": {
      "ppg": 4.1,
      "rpg": 5.9,
      "apg": 0.7,
      "fgp": null,
      "threep": 0,
      "ftp": 37,
      "per": null,
      "ts": 61,
      "usg": 14.9,
      "efg": 63.7,
      "astTo": 1,
      "blkPct": 5.9,
      "stlPct": 1.9,
      "games": 34,
      "fgm": 65,
      "fga": 102,
      "threepm": 0,
      "threepa": 1,
      "ftm": 10,
      "fta": 27,
      "collegeRts": 4.5
    },
    "scouting": {
      "strengths": [],
      "weaknesses": [],
      "notes": "Descrição em andamento",
      "attributes": {
        "Athleticism": null,
        "Shooting": null,
        "Playmaking": null,
        "Defense": null,
        "Rebounding": null,
        "BBIQ": null
      },
      "evaluation": {
        "version": "draftballr_import_basic_v1",
        "floor": {
          "score": null,
          "label": "",
          "note": ""
        },
        "ceiling": {
          "score": null,
          "label": "",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "",
          "note": ""
        },
        "tools": {
          "shooting": "",
          "creation": "",
          "defense": "",
          "rebounding": "",
          "efficiency": ""
        },
        "note": "Imported automatically with basic DraftBallr data. Review manually before editorial use."
      }
    },
    "accentColor": "#8b5e34",
    "source": "draftballr",
    "dataStatus": "imported-basic",
    "needsReview": true,
    "draftballr": {
      "playerId": 76525,
      "rowId": 3513156,
      "slug": "micah-handlogten",
      "position": "C",
      "classYear": "Sr",
      "conference": "SEC",
      "bigBoardRank": 60,
      "draftable": true,
      "importedAt": "2026-05-11"
    }
  },
  {
    "id": 86,
    "name": "Oscar Cluff",
    "position": "C",
    "team": "Purdue",
    "age": 24.6,
    "height": "6'11\"",
    "weight": "",
    "wingspan": "",
    "tier": "SLEEPER",
    "rank": 61,
    "stats": {
      "ppg": 10.6,
      "rpg": 7.5,
      "apg": 1.8,
      "fgp": null,
      "threep": 0,
      "ftp": 69.9,
      "per": null,
      "ts": 69.4,
      "usg": 19.2,
      "efg": 68.3,
      "astTo": 2.2,
      "blkPct": 4.7,
      "stlPct": 1.2,
      "games": 39,
      "fgm": 164,
      "fga": 240,
      "threepm": 0,
      "threepa": 0,
      "ftm": 86,
      "fta": 123,
      "collegeRts": 12.9
    },
    "scouting": {
      "strengths": [],
      "weaknesses": [],
      "notes": "Descrição em andamento",
      "attributes": {
        "Athleticism": null,
        "Shooting": null,
        "Playmaking": null,
        "Defense": null,
        "Rebounding": null,
        "BBIQ": null
      },
      "evaluation": {
        "version": "draftballr_import_basic_v1",
        "floor": {
          "score": null,
          "label": "",
          "note": ""
        },
        "ceiling": {
          "score": null,
          "label": "",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "",
          "note": ""
        },
        "tools": {
          "shooting": "",
          "creation": "",
          "defense": "",
          "rebounding": "",
          "efficiency": ""
        },
        "note": "Imported automatically with basic DraftBallr data. Review manually before editorial use."
      }
    },
    "accentColor": "#8b5e34",
    "source": "draftballr",
    "dataStatus": "imported-basic",
    "needsReview": true,
    "draftballr": {
      "playerId": 79380,
      "rowId": 3513504,
      "slug": "oscar-cluff",
      "position": "C",
      "classYear": "Sr",
      "conference": "B10",
      "bigBoardRank": 61,
      "draftable": true,
      "importedAt": "2026-05-11"
    }
  },
  {
    "id": 87,
    "name": "Rafael Castro",
    "position": "C",
    "team": "George Washington",
    "age": 23.2,
    "height": "6'11\"",
    "weight": "200 lbs",
    "wingspan": "",
    "tier": "SLEEPER",
    "rank": 62,
    "stats": {
      "ppg": 15.3,
      "rpg": 9.1,
      "apg": 1.7,
      "fgp": null,
      "threep": 0,
      "ftp": 66.1,
      "per": null,
      "ts": 64.6,
      "usg": 24.7,
      "efg": 62.8,
      "astTo": 0.9,
      "blkPct": 7.9,
      "stlPct": 3.5,
      "games": 28,
      "fgm": 152,
      "fga": 242,
      "threepm": 0,
      "threepa": 0,
      "ftm": 125,
      "fta": 189,
      "collegeRts": 8.1
    },
    "scouting": {
      "strengths": [],
      "weaknesses": [],
      "notes": "Descrição em andamento",
      "attributes": {
        "Athleticism": null,
        "Shooting": null,
        "Playmaking": null,
        "Defense": null,
        "Rebounding": null,
        "BBIQ": null
      },
      "evaluation": {
        "version": "draftballr_import_basic_v1",
        "floor": {
          "score": null,
          "label": "",
          "note": ""
        },
        "ceiling": {
          "score": null,
          "label": "",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "",
          "note": ""
        },
        "tools": {
          "shooting": "",
          "creation": "",
          "defense": "",
          "rebounding": "",
          "efficiency": ""
        },
        "note": "Imported automatically with basic DraftBallr data. Review manually before editorial use."
      }
    },
    "accentColor": "#8b5e34",
    "source": "draftballr",
    "dataStatus": "imported-basic",
    "needsReview": true,
    "draftballr": {
      "playerId": 75059,
      "rowId": 3512953,
      "slug": "rafael-castro",
      "position": "C",
      "classYear": "Sr",
      "conference": "A10",
      "bigBoardRank": 62,
      "draftable": true,
      "importedAt": "2026-05-11"
    }
  },
  {
    "id": 88,
    "name": "Ja'Kobi Gillespie",
    "position": "PG",
    "team": "Tennessee",
    "age": 22.3,
    "height": "6'1\"",
    "weight": "188 lbs",
    "wingspan": "6'5\"",
    "tier": "SLEEPER",
    "rank": 63,
    "stats": {
      "ppg": 18.4,
      "rpg": 2.8,
      "apg": 5.4,
      "fgp": null,
      "threep": 33.8,
      "ftp": 81.4,
      "per": null,
      "ts": 53.8,
      "usg": 25.7,
      "efg": 50.1,
      "astTo": 2.4,
      "blkPct": 0.8,
      "stlPct": 3.6,
      "games": 37,
      "fgm": 232,
      "fga": 566,
      "threepm": 103,
      "threepa": 305,
      "ftm": 114,
      "fta": 140,
      "collegeRts": -2.7
    },
    "scouting": {
      "strengths": [],
      "weaknesses": [],
      "notes": "Descrição em andamento",
      "attributes": {
        "Athleticism": null,
        "Shooting": null,
        "Playmaking": null,
        "Defense": null,
        "Rebounding": null,
        "BBIQ": null
      },
      "evaluation": {
        "version": "draftballr_import_basic_v1",
        "floor": {
          "score": null,
          "label": "",
          "note": ""
        },
        "ceiling": {
          "score": null,
          "label": "",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "",
          "note": ""
        },
        "tools": {
          "shooting": "",
          "creation": "",
          "defense": "",
          "rebounding": "",
          "efficiency": ""
        },
        "note": "Imported automatically with basic DraftBallr data. Review manually before editorial use."
      }
    },
    "accentColor": "#8b5e34",
    "source": "draftballr",
    "dataStatus": "imported-basic",
    "needsReview": true,
    "draftballr": {
      "playerId": 76218,
      "rowId": 3513105,
      "slug": "jakobi-gillespie",
      "position": "Pure PG",
      "classYear": "Sr",
      "conference": "SEC",
      "bigBoardRank": 63,
      "draftable": true,
      "importedAt": "2026-05-11"
    }
  },
  {
    "id": 89,
    "name": "Duke Miles",
    "position": "PG",
    "team": "Vanderbilt",
    "age": 24.4,
    "height": "6'2\"",
    "weight": "",
    "wingspan": "",
    "tier": "SLEEPER",
    "rank": 64,
    "stats": {
      "ppg": 16.1,
      "rpg": 3,
      "apg": 4.5,
      "fgp": null,
      "threep": 34.8,
      "ftp": 90.1,
      "per": null,
      "ts": 59.5,
      "usg": 25.7,
      "efg": 51.3,
      "astTo": 2.5,
      "blkPct": 0.8,
      "stlPct": 5,
      "games": 28,
      "fgm": 134,
      "fga": 308,
      "threepm": 48,
      "threepa": 138,
      "ftm": 136,
      "fta": 151,
      "collegeRts": 3
    },
    "scouting": {
      "strengths": [],
      "weaknesses": [],
      "notes": "Descrição em andamento",
      "attributes": {
        "Athleticism": null,
        "Shooting": null,
        "Playmaking": null,
        "Defense": null,
        "Rebounding": null,
        "BBIQ": null
      },
      "evaluation": {
        "version": "draftballr_import_basic_v1",
        "floor": {
          "score": null,
          "label": "",
          "note": ""
        },
        "ceiling": {
          "score": null,
          "label": "",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "",
          "note": ""
        },
        "tools": {
          "shooting": "",
          "creation": "",
          "defense": "",
          "rebounding": "",
          "efficiency": ""
        },
        "note": "Imported automatically with basic DraftBallr data. Review manually before editorial use."
      }
    },
    "accentColor": "#8b5e34",
    "source": "draftballr",
    "dataStatus": "imported-basic",
    "needsReview": true,
    "draftballr": {
      "playerId": 73566,
      "rowId": 3512793,
      "slug": "duke-miles",
      "position": "Pure PG",
      "classYear": "Sr",
      "conference": "SEC",
      "bigBoardRank": 64,
      "draftable": true,
      "importedAt": "2026-05-11"
    }
  },
  {
    "id": 90,
    "name": "Jaxon Kohler",
    "position": "PF/C",
    "team": "Michigan St.",
    "age": 23,
    "height": "6'9\"",
    "weight": "245 lbs",
    "wingspan": "7'0\"",
    "tier": "SLEEPER",
    "rank": 65,
    "stats": {
      "ppg": 12.5,
      "rpg": 8.9,
      "apg": 1.3,
      "fgp": null,
      "threep": 38.9,
      "ftp": 86.9,
      "per": null,
      "ts": 61.5,
      "usg": 20.1,
      "efg": 58.8,
      "astTo": 0.9,
      "blkPct": 3.1,
      "stlPct": 1.3,
      "games": 35,
      "fgm": 164,
      "fga": 328,
      "threepm": 58,
      "threepa": 149,
      "ftm": 53,
      "fta": 61,
      "collegeRts": 5
    },
    "scouting": {
      "strengths": [],
      "weaknesses": [],
      "notes": "Descrição em andamento",
      "attributes": {
        "Athleticism": null,
        "Shooting": null,
        "Playmaking": null,
        "Defense": null,
        "Rebounding": null,
        "BBIQ": null
      },
      "evaluation": {
        "version": "draftballr_import_basic_v1",
        "floor": {
          "score": null,
          "label": "",
          "note": ""
        },
        "ceiling": {
          "score": null,
          "label": "",
          "note": ""
        },
        "risk": {
          "level": "",
          "reason": "",
          "note": ""
        },
        "tools": {
          "shooting": "",
          "creation": "",
          "defense": "",
          "rebounding": "",
          "efficiency": ""
        },
        "note": "Imported automatically with basic DraftBallr data. Review manually before editorial use."
      }
    },
    "accentColor": "#8b5e34",
    "source": "draftballr",
    "dataStatus": "imported-basic",
    "needsReview": true,
    "draftballr": {
      "playerId": 77224,
      "rowId": 3513293,
      "slug": "jaxon-kohler",
      "position": "PF/C",
      "classYear": "Sr",
      "conference": "B10",
      "bigBoardRank": 65,
      "draftable": true,
      "importedAt": "2026-05-11"
    }
  }
];

export const draftMeta = {
  "year": 2026,
  "totalProspects": 72,
  "tiers": {
      "CORNERSTONE": 3,
      "ELITE": 3,
      "LOTTERY": 8,
      "MID_1ST": 10,
      "FRINGE": 8,
      "SLEEPER": 40
  },
  "topPicks": {
    "consensus1": "Cameron Boozer",
    "consensus2": "Darryn Peterson",
    "consensus3": "AJ Dybantsa"
  },
  "lastUpdated": "2026-05-11",
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
  "CORNERSTONE": {
    "label": "CORNERSTONE",
    "color": "#7c3aed",
    "bg": "#eee9fb",
    "text": "#5b21b6"
  },
  "ELITE": {
    "label": "ELITE",
    "color": "#d4af37",
    "bg": "#fff4c2",
    "text": "#8a6a00"
  },
  "LOTTERY": {
    "label": "LOTERIA",
    "color": "#10b981",
    "bg": "#dff8ed",
    "text": "#047857"
  },
  "MID_1ST": {
    "label": "MID 1ST",
    "color": "#3b82f6",
    "bg": "#e0efff",
    "text": "#1d4ed8"
  },
  "FRINGE": {
    "label": "FRINGE",
    "color": "#f97316",
    "bg": "#ffedd5",
    "text": "#c2410c"
  },
  "SLEEPER": {
    "label": "SLEEPER",
    "color": "#8b5e34",
    "bg": "#f4eadc",
    "text": "#5f3f20"
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
