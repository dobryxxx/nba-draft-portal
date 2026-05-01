// ============================================================
// External Prospect References
// ============================================================
// Normalized references from editorial draft sources. These are
// review inputs for the Prospect Validation Engine; they do not
// automatically replace src/data/prospects.js.
// ============================================================

export type ExternalProspectSource =
  | 'espn'
  | 'ringer'
  | 'bleacher_report'
  | 'nba_draft_room'
  | 'tankathon'
  | 'rookie_scale'
  | 'draftballr'
  | 'manual';

export interface ExternalProspectReference {
  name: string;
  normalizedName: string;
  source: ExternalProspectSource;
  rank?: number;
  position?: string;
  team?: string;
  age?: number;
  height?: string;
  weight?: string;
  wingspan?: string;
  archetype?: string;
  notes?: string[];
  sourceUrl?: string;
  lastUpdated?: string;
}

export const externalProspectReferences: ExternalProspectReference[] = [
  {
    "name": "AJ Dybantsa",
    "source": "ringer",
    "rank": 1,
    "position": "SF/PF",
    "team": "BYU",
    "age": 19.4,
    "height": "6'9\"",
    "weight": "210 lbs",
    "archetype": "Ala criador com teto de primeira opção",
    "notes": [
      "Competidor físico de elite para a posição.",
      "Combina criação própria, presença defensiva e upside de estrela."
    ],
    "sourceUrl": "https://theringer.com/nba-draft/2026/mock-draft?view=skim",
    "normalizedName": "aj dybantsa",
    "lastUpdated": "2026-04-29"
  },
  {
    "name": "AJ Dybantsa",
    "source": "bleacher_report",
    "rank": 1,
    "position": "SF",
    "team": "BYU",
    "height": "6'9\"",
    "weight": "210 lbs",
    "archetype": "Wing scorer de alto teto",
    "notes": [
      "Perfil visto como tier acima do restante da classe.",
      "Ponto forte é criar vantagem própria e pontuar em todos os níveis."
    ],
    "sourceUrl": "https://bleacherreport.com/articles/25422909-new-2026-nba-mock-draft-warriors-winning-lottery-simulation",
    "normalizedName": "aj dybantsa",
    "lastUpdated": "2026-04-29"
  },
  {
    "name": "Cameron Boozer",
    "source": "ringer",
    "rank": 2,
    "position": "PF/C",
    "team": "Duke",
    "age": 18.9,
    "height": "6'9\"",
    "weight": "250 lbs",
    "archetype": "Hub ofensivo de frontcourt",
    "notes": [
      "Máquina de decisão correta, com valor em múltiplas funções.",
      "Piso alto pelo toque, leitura, rebote e encaixe em ataques estruturados."
    ],
    "sourceUrl": "https://theringer.com/nba-draft/2026/mock-draft?view=skim",
    "normalizedName": "cameron boozer",
    "lastUpdated": "2026-04-29"
  },
  {
    "name": "Cameron Boozer",
    "source": "bleacher_report",
    "rank": 3,
    "position": "PF",
    "team": "Duke",
    "height": "6'9\"",
    "weight": "250 lbs",
    "archetype": "Frontcourt connector",
    "notes": [
      "Pode ser tanto peça de impacto imediato quanto bloco de longo prazo.",
      "Skill tree ampla permite moldar o papel conforme a necessidade do time."
    ],
    "sourceUrl": "https://bleacherreport.com/articles/25422909-new-2026-nba-mock-draft-warriors-winning-lottery-simulation",
    "normalizedName": "cameron boozer",
    "lastUpdated": "2026-04-29"
  },
  {
    "name": "Darryn Peterson",
    "source": "ringer",
    "rank": 3,
    "position": "PG/SG",
    "team": "Kansas",
    "age": 19.4,
    "height": "6'6\"",
    "weight": "205 lbs",
    "archetype": "Superstar scoring guard",
    "notes": [
      "Aposta de upside como pontuador primário.",
      "Criação e pick-and-roll podem dar direção ofensiva a um elenco jovem."
    ],
    "sourceUrl": "https://theringer.com/nba-draft/2026/mock-draft?view=skim",
    "normalizedName": "darryn peterson",
    "lastUpdated": "2026-04-29"
  },
  {
    "name": "Darryn Peterson",
    "source": "bleacher_report",
    "rank": 2,
    "position": "SG",
    "team": "Kansas",
    "height": "6'6\"",
    "weight": "205 lbs",
    "archetype": "Shotmaker dinâmico",
    "notes": [
      "Arremessador elétrico com defesa forte quando saudável.",
      "Histórico médico e temporada irregular precisam ser considerados."
    ],
    "sourceUrl": "https://bleacherreport.com/articles/25422909-new-2026-nba-mock-draft-warriors-winning-lottery-simulation",
    "normalizedName": "darryn peterson",
    "lastUpdated": "2026-04-29"
  },
  {
    "name": "Caleb Wilson",
    "source": "ringer",
    "rank": 4,
    "position": "PF",
    "team": "North Carolina",
    "age": 19.9,
    "height": "6'10\"",
    "weight": "215 lbs",
    "archetype": "Forward atlético two-way",
    "notes": [
      "Teto defensivo raro, com finalização forte no aro.",
      "Arremesso é swing skill importante para o teto."
    ],
    "sourceUrl": "https://theringer.com/nba-draft/2026/mock-draft?view=skim",
    "normalizedName": "caleb wilson",
    "lastUpdated": "2026-04-29"
  },
  {
    "name": "Caleb Wilson",
    "source": "bleacher_report",
    "rank": 4,
    "position": "PF",
    "team": "North Carolina",
    "height": "6'10\"",
    "weight": "215 lbs",
    "archetype": "Atleta de motor alto",
    "notes": [
      "Finalização e motor aparecem como diferenciais fortes.",
      "Pode ser visto como steal se cair fora do top 3."
    ],
    "sourceUrl": "https://bleacherreport.com/articles/25422909-new-2026-nba-mock-draft-warriors-winning-lottery-simulation",
    "normalizedName": "caleb wilson",
    "lastUpdated": "2026-04-29"
  },
  {
    "name": "Brayden Burries",
    "source": "ringer",
    "rank": 5,
    "position": "SG",
    "team": "Arizona",
    "age": 20.7,
    "height": "6'4\"",
    "weight": "205 lbs",
    "archetype": "Guard defensivo com criação secundária",
    "notes": [
      "Defensor de bola forte com upside silencioso de lead guard.",
      "Pode funcionar em lineups grandes como guard complementar."
    ],
    "sourceUrl": "https://theringer.com/nba-draft/2026/mock-draft?view=skim",
    "normalizedName": "brayden burries",
    "lastUpdated": "2026-04-29"
  },
  {
    "name": "Brayden Burries",
    "source": "bleacher_report",
    "rank": 10,
    "position": "SG",
    "team": "Arizona",
    "height": "6'4\"",
    "weight": "205 lbs",
    "archetype": "Guard funcional de alto motor",
    "notes": [
      "Mais função do que flash, mas com lampejos de criação.",
      "Motor, força e versatilidade sustentam tradução NBA."
    ],
    "sourceUrl": "https://bleacherreport.com/articles/25422909-new-2026-nba-mock-draft-warriors-winning-lottery-simulation",
    "normalizedName": "brayden burries",
    "lastUpdated": "2026-04-29"
  },
  {
    "name": "Keaton Wagler",
    "source": "ringer",
    "rank": 6,
    "position": "PG/SG",
    "team": "Illinois",
    "age": 19.3,
    "height": "6'6\"",
    "weight": "180 lbs",
    "archetype": "Guard de tamanho com gravidade de arremesso",
    "notes": [
      "Tamanho posicional e arremesso dinâmico elevam o encaixe.",
      "Principal pergunta é sustentar carga como opção primária."
    ],
    "sourceUrl": "https://theringer.com/nba-draft/2026/mock-draft?view=skim",
    "normalizedName": "keaton wagler",
    "lastUpdated": "2026-04-29"
  },
  {
    "name": "Keaton Wagler",
    "source": "bleacher_report",
    "rank": 5,
    "position": "PG/SG",
    "team": "Illinois",
    "height": "6'6\"",
    "weight": "180 lbs",
    "archetype": "Big guard criativo",
    "notes": [
      "Pode atuar off-ball pelo tamanho e arremesso.",
      "Criatividade e craft dão teto especial."
    ],
    "sourceUrl": "https://bleacherreport.com/articles/25422909-new-2026-nba-mock-draft-warriors-winning-lottery-simulation",
    "normalizedName": "keaton wagler",
    "lastUpdated": "2026-04-29"
  },
  {
    "name": "Darius Acuff Jr.",
    "source": "ringer",
    "rank": 7,
    "position": "PG/SG",
    "team": "Arkansas",
    "age": 19.6,
    "height": "6'3\"",
    "weight": "190 lbs",
    "archetype": "Guard de criação e dureza",
    "notes": [
      "Talento de backcourt capaz de acelerar identidade ofensiva.",
      "Pode subir para top 5 dependendo do encaixe da loteria."
    ],
    "sourceUrl": "https://theringer.com/nba-draft/2026/mock-draft?view=skim",
    "normalizedName": "darius acuff",
    "lastUpdated": "2026-04-29"
  },
  {
    "name": "Darius Acuff Jr.",
    "source": "bleacher_report",
    "rank": 6,
    "position": "PG/SG",
    "team": "Arkansas",
    "height": "6'3\"",
    "weight": "190 lbs",
    "archetype": "Scoring guard agressivo",
    "notes": [
      "Ataque sem medo e liderança chamam atenção.",
      "Defesa e atletismo não elite seguem como pontos de risco."
    ],
    "sourceUrl": "https://bleacherreport.com/articles/25422909-new-2026-nba-mock-draft-warriors-winning-lottery-simulation",
    "normalizedName": "darius acuff",
    "lastUpdated": "2026-04-29"
  },
  {
    "name": "Mikel Brown Jr.",
    "source": "ringer",
    "rank": 8,
    "position": "PG/SG",
    "team": "Louisville",
    "age": 20.2,
    "height": "6'5\"",
    "weight": "190 lbs",
    "archetype": "Criador em espaço aberto",
    "notes": [
      "Controle de bola elétrico e valor como shooter em movimento.",
      "Ano irregular reduziu valor, mas mantém aposta de estrela nessa faixa."
    ],
    "sourceUrl": "https://theringer.com/nba-draft/2026/mock-draft?view=skim",
    "normalizedName": "mikel brown",
    "lastUpdated": "2026-04-29"
  },
  {
    "name": "Mikel Brown Jr.",
    "source": "bleacher_report",
    "rank": 7,
    "position": "PG/SG",
    "team": "Louisville",
    "height": "6'5\"",
    "weight": "190 lbs",
    "archetype": "Lead guard de teto alto",
    "notes": [
      "Dieta eficiente de 3, lances livres e finalizações próximas.",
      "Tomada de decisão ambiciosa precisa ser lapidada."
    ],
    "sourceUrl": "https://bleacherreport.com/articles/25422909-new-2026-nba-mock-draft-warriors-winning-lottery-simulation",
    "normalizedName": "mikel brown",
    "lastUpdated": "2026-04-29"
  },
  {
    "name": "Nate Ament",
    "source": "ringer",
    "rank": 9,
    "position": "SF/PF",
    "team": "Tennessee",
    "age": 19.5,
    "height": "6'10\"",
    "weight": "207 lbs",
    "archetype": "Forward criador de tamanho",
    "notes": [
      "Feel especial para o tamanho e defesa positiva.",
      "Eficiência de arremesso abaixo do esperado pressiona o piso."
    ],
    "sourceUrl": "https://theringer.com/nba-draft/2026/mock-draft?view=skim",
    "normalizedName": "nate ament",
    "lastUpdated": "2026-04-29"
  },
  {
    "name": "Nate Ament",
    "source": "bleacher_report",
    "rank": 11,
    "position": "SF",
    "team": "Tennessee",
    "height": "6'10\"",
    "weight": "207 lbs",
    "archetype": "Forward dribble-pass-shoot",
    "notes": [
      "Aposta de upside por combinação incomum de tamanho e habilidade.",
      "Tem flashes de scorer em três níveis se o desenvolvimento encaixar."
    ],
    "sourceUrl": "https://bleacherreport.com/articles/25422909-new-2026-nba-mock-draft-warriors-winning-lottery-simulation",
    "normalizedName": "nate ament",
    "lastUpdated": "2026-04-29"
  },
  {
    "name": "Kingston Flemings",
    "source": "ringer",
    "rank": 10,
    "position": "PG",
    "team": "Houston",
    "age": 19.4,
    "height": "6'4\"",
    "weight": "190 lbs",
    "archetype": "Guard veloz com feel de criação",
    "notes": [
      "Muito mais que scorer: mostra feel no pick-and-roll.",
      "Velocidade em quadra aberta é uma das melhores da classe."
    ],
    "sourceUrl": "https://theringer.com/nba-draft/2026/mock-draft?view=skim",
    "normalizedName": "kingston flemings",
    "lastUpdated": "2026-04-29"
  },
  {
    "name": "Kingston Flemings",
    "source": "bleacher_report",
    "rank": 8,
    "position": "PG",
    "team": "Houston",
    "height": "6'4\"",
    "weight": "190 lbs",
    "archetype": "Organizador downhill",
    "notes": [
      "Pronto para conduzir ataque NBA com decisão e midrange.",
      "Arremesso é swing skill, mas defesa e downhill dão piso."
    ],
    "sourceUrl": "https://bleacherreport.com/articles/25422909-new-2026-nba-mock-draft-warriors-winning-lottery-simulation",
    "normalizedName": "kingston flemings",
    "lastUpdated": "2026-04-29"
  },
  {
    "name": "Labaron Philon Jr.",
    "source": "ringer",
    "rank": 11,
    "position": "PG/SG",
    "team": "Alabama",
    "age": 20.5,
    "height": "6'4\"",
    "weight": "185 lbs",
    "archetype": "Guard competitivo de encaixe rápido",
    "notes": [
      "Moxie, inteligência e skill set sustentam transição rápida para rotação.",
      "Pode misturar encaixe imediato com upside de condução futura."
    ],
    "sourceUrl": "https://theringer.com/nba-draft/2026/mock-draft?view=skim",
    "normalizedName": "labaron philon",
    "lastUpdated": "2026-04-29"
  },
  {
    "name": "Labaron Philon Jr.",
    "source": "bleacher_report",
    "rank": 9,
    "position": "PG/SG",
    "team": "Alabama",
    "height": "6'4\"",
    "weight": "185 lbs",
    "archetype": "Score-first guard",
    "notes": [
      "Produção deu salto grande com melhora de eficiência.",
      "Frame e seleção de arremesso ainda precisam de ajuste."
    ],
    "sourceUrl": "https://bleacherreport.com/articles/25422909-new-2026-nba-mock-draft-warriors-winning-lottery-simulation",
    "normalizedName": "labaron philon",
    "lastUpdated": "2026-04-29"
  },
  {
    "name": "Cameron Carr",
    "source": "ringer",
    "rank": 12,
    "position": "SG",
    "team": "Baylor",
    "height": "6'5\"",
    "weight": "175 lbs",
    "archetype": "Off-ball athlete shooter",
    "notes": [
      "Movimento sem bola, arremesso de catch-and-shoot e explosão no aro.",
      "Corpo leve ainda é ponto de desenvolvimento."
    ],
    "sourceUrl": "https://theringer.com/nba-draft/2026/mock-draft?view=skim",
    "normalizedName": "cameron carr",
    "lastUpdated": "2026-04-29"
  },
  {
    "name": "Cameron Carr",
    "source": "bleacher_report",
    "rank": 16,
    "position": "SG",
    "team": "Baylor",
    "height": "6'5\"",
    "weight": "175 lbs",
    "archetype": "Shotmaker atlético",
    "notes": [
      "Arremesso e bounce são ferramentas principais.",
      "Frame de 175 lbs é risco físico no nível NBA."
    ],
    "sourceUrl": "https://bleacherreport.com/articles/25422909-new-2026-nba-mock-draft-warriors-winning-lottery-simulation",
    "normalizedName": "cameron carr",
    "lastUpdated": "2026-04-29"
  },
  {
    "name": "Yaxel Lendeborg",
    "source": "ringer",
    "rank": 13,
    "position": "PF",
    "team": "Michigan",
    "age": 23.7,
    "height": "6'9\"",
    "weight": "240 lbs",
    "archetype": "Forward multifuncional NBA-ready",
    "notes": [
      "Pode espaçar, passar e defender em esquema versátil.",
      "Valor maior como plug-and-play do que upside puro."
    ],
    "sourceUrl": "https://theringer.com/nba-draft/2026/mock-draft?view=skim",
    "normalizedName": "yaxel lendeborg",
    "lastUpdated": "2026-04-29"
  },
  {
    "name": "Yaxel Lendeborg",
    "source": "bleacher_report",
    "rank": 12,
    "position": "PF",
    "team": "Michigan",
    "height": "6'9\"",
    "weight": "240 lbs",
    "archetype": "Forward versátil pronto",
    "notes": [
      "Tamanho, competitividade e versatilidade sustentam minutos cedo.",
      "Perfil pode servir tanto para curto prazo quanto desenvolvimento."
    ],
    "sourceUrl": "https://bleacherreport.com/articles/25422909-new-2026-nba-mock-draft-warriors-winning-lottery-simulation",
    "normalizedName": "yaxel lendeborg",
    "lastUpdated": "2026-04-29"
  },
  {
    "name": "Hannes Steinbach",
    "source": "ringer",
    "rank": 14,
    "position": "PF/C",
    "team": "Washington",
    "height": "6'11\"",
    "weight": "220 lbs",
    "archetype": "Big produtor com toque",
    "notes": [
      "Pontuação no garrafão, rebote e flashes de spacing.",
      "Dá backbone e flexibilidade de lineup."
    ],
    "sourceUrl": "https://theringer.com/nba-draft/2026/mock-draft?view=skim",
    "normalizedName": "hannes steinbach",
    "lastUpdated": "2026-04-29"
  },
  {
    "name": "Hannes Steinbach",
    "source": "bleacher_report",
    "rank": 13,
    "position": "C",
    "team": "Washington",
    "height": "6'11\"",
    "weight": "220 lbs",
    "archetype": "Big de rebote e finalização",
    "notes": [
      "Rebote e finalização interior são caminhos rápidos de valor.",
      "Organização forte pode desbloquear o arremesso e esconder limitações defensivas."
    ],
    "sourceUrl": "https://bleacherreport.com/articles/25422909-new-2026-nba-mock-draft-warriors-winning-lottery-simulation",
    "normalizedName": "hannes steinbach",
    "lastUpdated": "2026-04-29"
  },
  {
    "name": "Karim Lopez",
    "source": "bleacher_report",
    "rank": 14,
    "position": "PF",
    "team": "New Zealand Breakers",
    "height": "6'9\"",
    "weight": "225 lbs",
    "archetype": "Forward two-way de esforço",
    "notes": [
      "Papel de baixa manutenção, alto esforço e defesa versátil.",
      "Range amplo, mas B/R colocou em faixa de loteria."
    ],
    "sourceUrl": "https://bleacherreport.com/articles/25422909-new-2026-nba-mock-draft-warriors-winning-lottery-simulation",
    "normalizedName": "karim lopez",
    "lastUpdated": "2026-04-29"
  },
  {
    "name": "Karim Lopez",
    "source": "ringer",
    "rank": 27,
    "position": "SF/PF",
    "team": "New Zealand",
    "height": "6'9\"",
    "weight": "225 lbs",
    "archetype": "Forward internacional de range amplo",
    "notes": [
      "Range visto como amplo; The Ringer indicou menor confiança em loteria.",
      "Valor depende de defesa, energia e desenvolvimento do arremesso."
    ],
    "sourceUrl": "https://theringer.com/nba-draft/2026/mock-draft?view=skim",
    "normalizedName": "karim lopez",
    "lastUpdated": "2026-04-29"
  },
  {
    "name": "Aday Mara",
    "source": "ringer",
    "rank": 17,
    "position": "C",
    "team": "Michigan",
    "height": "7'3\"",
    "weight": "255 lbs",
    "archetype": "Rim protector jumbo",
    "notes": [
      "Proteção de aro e passe para big de tamanho raro.",
      "Defesa em espaço e arremesso limitam o encaixe universal."
    ],
    "sourceUrl": "https://theringer.com/nba-draft/2026/mock-draft?view=skim",
    "normalizedName": "aday mara",
    "lastUpdated": "2026-04-29"
  },
  {
    "name": "Aday Mara",
    "source": "bleacher_report",
    "rank": 15,
    "position": "C",
    "team": "Michigan",
    "height": "7'3\"",
    "weight": "255 lbs",
    "archetype": "Big de proteção de aro",
    "notes": [
      "Altera arremessos no aro e passa bem para o tamanho.",
      "Mobilidade defensiva em espaço segue como risco."
    ],
    "sourceUrl": "https://bleacherreport.com/articles/25422909-new-2026-nba-mock-draft-warriors-winning-lottery-simulation",
    "normalizedName": "aday mara",
    "lastUpdated": "2026-04-29"
  },
  {
    "name": "Bennett Stirtz",
    "source": "ringer",
    "rank": 18,
    "position": "PG/SG",
    "team": "Iowa",
    "age": 22.7,
    "height": "6'4\"",
    "weight": "190 lbs",
    "archetype": "Guard habilidoso e estável",
    "notes": [
      "Ball handler maduro, bom tomador de decisão e shooter forte.",
      "Menos explosivo, mas pode encaixar em desenvolvimento de longo prazo."
    ],
    "sourceUrl": "https://theringer.com/nba-draft/2026/mock-draft?view=skim",
    "normalizedName": "bennett stirtz",
    "lastUpdated": "2026-04-29"
  },
  {
    "name": "Jayden Quaintance",
    "source": "ringer",
    "rank": 20,
    "position": "PF/C",
    "team": "Kentucky",
    "age": 18.9,
    "height": "6'10\"",
    "weight": "255 lbs",
    "archetype": "Rim protector de alto risco",
    "notes": [
      "Potencial de proteção de aro muito alto.",
      "ACL recente cria risco médico e avaliação mais complexa."
    ],
    "sourceUrl": "https://theringer.com/nba-draft/2026/mock-draft?view=skim",
    "normalizedName": "jayden quaintance",
    "lastUpdated": "2026-04-29"
  },
  {
    "name": "Isaiah Evans",
    "source": "ringer",
    "rank": 21,
    "position": "SG/SF",
    "team": "Duke",
    "height": "6'6\"",
    "weight": "180 lbs",
    "archetype": "Wing shooter de release alto",
    "notes": [
      "Tamanho e velocidade de release criam valor como shooter.",
      "Pode subir no processo pré-draft se o arremesso se confirmar."
    ],
    "sourceUrl": "https://theringer.com/nba-draft/2026/mock-draft?view=skim",
    "normalizedName": "isaiah evans",
    "lastUpdated": "2026-04-29"
  }
];
