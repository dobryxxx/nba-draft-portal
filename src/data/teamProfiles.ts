// ============================================================
// NBA Draft Fit Score - Editorial Team Profiles
// ============================================================
// First editable model for team context. This file is intentionally
// editorial: it turns team situation, needs, front-office tendency,
// timeline, risk, and draft strategy into structured inputs for a
// future Draft Fit Score algorithm.
//
// Source context reviewed:
// - NBA.com/stats teams pages for official team universe/stat context.
// - pishenis NBA team profiles URL provided by user as profile reference.
//
// These are initial plausible values, not final statistical truth.
// ============================================================

export type TeamId =
  | 'ATL' | 'BOS' | 'BKN' | 'CHA' | 'CHI' | 'CLE' | 'DAL' | 'DEN' | 'DET' | 'GSW'
  | 'HOU' | 'IND' | 'LAC' | 'LAL' | 'MEM' | 'MIA' | 'MIL' | 'MIN' | 'NOP' | 'NYK'
  | 'OKC' | 'ORL' | 'PHI' | 'PHX' | 'POR' | 'SAC' | 'SAS' | 'TOR' | 'UTA' | 'WAS';

export type Conference = 'East' | 'West';

export type Timeline =
  | 'deep_rebuild'
  | 'early_rebuild'
  | 'development_core'
  | 'rising_core'
  | 'playoff_core'
  | 'contender'
  | 'aging_contender';

export type DraftMode =
  | 'talent_accumulation'
  | 'upside_swing'
  | 'core_builder'
  | 'playoff_support'
  | 'win_now_support'
  | 'contender_depth';

export type Priority =
  | 'spacing'
  | 'creation'
  | 'defense'
  | 'rebounding'
  | 'athleticism'
  | 'size'
  | 'floor'
  | 'ceiling'
  | 'two_way'
  | 'guard_creation'
  | 'frontcourt_depth';

export type RiskTolerance = 'low' | 'medium' | 'high';

export type TeamNeeds = {
  shooting: number;
  creation: number;
  defense: number;
  rebounding: number;
  athleticism: number;
  size: number;
  floor: number;
  ceiling: number;
};

export type TeamWeights = {
  teamNeedFit: number;
  teamStrategyFit: number;
  draftRangeFit: number;
  availabilityFit: number;
};

export type PlayerAttributeWeights = TeamNeeds;

export type TeamEditorialProfile = {
  strategy: string;
  frontOfficeTendency: string;
  riskToleranceText: string;
  notes: string[];
};

export type TeamProfile = {
  id: TeamId;
  name: string;
  conference: Conference;
  timeline: Timeline;
  draftMode: DraftMode;
  priority: Priority;
  riskTolerance: RiskTolerance;
  needs: TeamNeeds;
  weights: TeamWeights;
  playerAttributeWeights: PlayerAttributeWeights;
  editorial: TeamEditorialProfile;
};

const balancedWeights: TeamWeights = {
  teamNeedFit: 0.35,
  teamStrategyFit: 0.25,
  draftRangeFit: 0.25,
  availabilityFit: 0.15,
};

const winNowWeights: TeamWeights = {
  teamNeedFit: 0.40,
  teamStrategyFit: 0.30,
  draftRangeFit: 0.18,
  availabilityFit: 0.12,
};

const upsideWeights: TeamWeights = {
  teamNeedFit: 0.28,
  teamStrategyFit: 0.24,
  draftRangeFit: 0.30,
  availabilityFit: 0.18,
};

const contenderAttributeWeights: PlayerAttributeWeights = {
  shooting: 0.24,
  creation: 0.16,
  defense: 0.20,
  rebounding: 0.08,
  athleticism: 0.06,
  size: 0.08,
  floor: 0.14,
  ceiling: 0.04,
};

const rebuildAttributeWeights: PlayerAttributeWeights = {
  shooting: 0.16,
  creation: 0.22,
  defense: 0.12,
  rebounding: 0.06,
  athleticism: 0.12,
  size: 0.08,
  floor: 0.06,
  ceiling: 0.18,
};

export const teamProfiles: TeamProfile[] = [
  {
    id: 'ATL',
    name: 'Atlanta Hawks',
    conference: 'East',
    timeline: 'playoff_core',
    draftMode: 'playoff_support',
    priority: 'defense',
    riskTolerance: 'medium',
    needs: { shooting: 0.70, creation: 0.45, defense: 0.90, rebounding: 0.55, athleticism: 0.65, size: 0.70, floor: 0.65, ceiling: 0.55 },
    weights: balancedWeights,
    playerAttributeWeights: { shooting: 0.18, creation: 0.12, defense: 0.28, rebounding: 0.10, athleticism: 0.10, size: 0.10, floor: 0.08, ceiling: 0.04 },
    editorial: {
      strategy: 'Adicionar defesa, tamanho e conectores que facilitem a vida dos criadores principais.',
      frontOfficeTendency: 'Costuma valorizar wings atleticos, defesa em multiplas posicoes e upside fisico.',
      riskToleranceText: 'Pode aceitar risco moderado, desde que o jogador tenha caminho defensivo claro.',
      notes: ['Priorizar alas com defesa real.', 'Arremesso ajuda, mas nao deve superar necessidade de solidez defensiva.', 'Guards pequenos precisam oferecer muita criacao para entrar no board.'],
    },
  },
  {
    id: 'BOS',
    name: 'Boston Celtics',
    conference: 'East',
    timeline: 'contender',
    draftMode: 'contender_depth',
    priority: 'floor',
    riskTolerance: 'low',
    needs: { shooting: 0.70, creation: 0.35, defense: 0.75, rebounding: 0.45, athleticism: 0.35, size: 0.55, floor: 0.95, ceiling: 0.25 },
    weights: winNowWeights,
    playerAttributeWeights: contenderAttributeWeights,
    editorial: {
      strategy: 'Encontrar rotacao barata, inteligente e pronta para playoffs.',
      frontOfficeTendency: 'Valoriza spacing, tomada de decisao, defesa e jogadores que nao quebram o sistema.',
      riskToleranceText: 'Baixa tolerancia a projetos longos enquanto a janela de titulo estiver aberta.',
      notes: ['Preferir arremessadores grandes e defensores posicionais.', 'Jogadores de alto erro precisam cair muito no draft para fazer sentido.', 'Disponibilidade e maturidade pesam bastante.'],
    },
  },
  {
    id: 'BKN',
    name: 'Brooklyn Nets',
    conference: 'East',
    timeline: 'development_core',
    draftMode: 'core_builder',
    priority: 'creation',
    riskTolerance: 'high',
    needs: { shooting: 0.65, creation: 0.90, defense: 0.55, rebounding: 0.45, athleticism: 0.65, size: 0.60, floor: 0.35, ceiling: 0.90 },
    weights: upsideWeights,
    playerAttributeWeights: rebuildAttributeWeights,
    editorial: {
      strategy: 'Buscar criadores de vantagem e talentos que possam virar pecas centrais.',
      frontOfficeTendency: 'Tende a priorizar valor de upside, ferramentas modernas e flexibilidade de roster.',
      riskToleranceText: 'Alta tolerancia a risco se houver teto real de criacao ou two-way.',
      notes: ['Precisa de talento primario, nao apenas encaixe.', 'Wings com tamanho e habilidade devem receber bonus.', 'Jogadores prontos, mas sem teto, podem ficar abaixo no board.'],
    },
  },
  {
    id: 'CHA',
    name: 'Charlotte Hornets',
    conference: 'East',
    timeline: 'development_core',
    draftMode: 'core_builder',
    priority: 'two_way',
    riskTolerance: 'high',
    needs: { shooting: 0.70, creation: 0.55, defense: 0.85, rebounding: 0.55, athleticism: 0.75, size: 0.75, floor: 0.35, ceiling: 0.85 },
    weights: upsideWeights,
    playerAttributeWeights: { shooting: 0.16, creation: 0.16, defense: 0.22, rebounding: 0.08, athleticism: 0.12, size: 0.10, floor: 0.06, ceiling: 0.10 },
    editorial: {
      strategy: 'Adicionar atletas grandes, defensores e talento complementar para estabilizar o nucleo jovem.',
      frontOfficeTendency: 'Historicamente aceita swings atleticos e perfis jovens com ferramentas claras.',
      riskToleranceText: 'Alta, mas precisa evitar projetos sem traducao funcional.',
      notes: ['Defesa e tamanho devem pesar muito.', 'Spacing ao redor do nucleo e essencial.', 'Criacao secundaria recebe bonus, especialmente em wings.'],
    },
  },
  {
    id: 'CHI',
    name: 'Chicago Bulls',
    conference: 'East',
    timeline: 'early_rebuild',
    draftMode: 'talent_accumulation',
    priority: 'ceiling',
    riskTolerance: 'high',
    needs: { shooting: 0.65, creation: 0.85, defense: 0.60, rebounding: 0.45, athleticism: 0.70, size: 0.60, floor: 0.30, ceiling: 0.95 },
    weights: upsideWeights,
    playerAttributeWeights: rebuildAttributeWeights,
    editorial: {
      strategy: 'Priorizar talento de alto teto e criacao de vantagem para reposicionar a franquia.',
      frontOfficeTendency: 'Precisa aumentar agressividade no draft e acumular upside real.',
      riskToleranceText: 'Alta tolerancia a risco, principalmente em picks altas.',
      notes: ['Nao draftar apenas por encaixe imediato.', 'Criadores e wings com upside devem subir.', 'Floor baixo e aceitavel se o teto for especial.'],
    },
  },
  {
    id: 'CLE',
    name: 'Cleveland Cavaliers',
    conference: 'East',
    timeline: 'contender',
    draftMode: 'win_now_support',
    priority: 'spacing',
    riskTolerance: 'low',
    needs: { shooting: 0.90, creation: 0.45, defense: 0.70, rebounding: 0.35, athleticism: 0.35, size: 0.60, floor: 0.90, ceiling: 0.30 },
    weights: winNowWeights,
    playerAttributeWeights: contenderAttributeWeights,
    editorial: {
      strategy: 'Adicionar spacing, wings confiaveis e decisao rapida para apoiar o nucleo competitivo.',
      frontOfficeTendency: 'Valoriza eficiencia, maturidade e jogadores que se encaixam em estruturas claras.',
      riskToleranceText: 'Baixa; o jogador precisa ser usavel rapidamente.',
      notes: ['Volume de 3 pontos deve ser criterio central.', 'Defesa em playoff importa mais que upside abstrato.', 'Bigs sem spacing precisam ser muito especiais.'],
    },
  },
  {
    id: 'DAL',
    name: 'Dallas Mavericks',
    conference: 'West',
    timeline: 'playoff_core',
    draftMode: 'win_now_support',
    priority: 'defense',
    riskTolerance: 'medium',
    needs: { shooting: 0.70, creation: 0.35, defense: 0.85, rebounding: 0.60, athleticism: 0.55, size: 0.70, floor: 0.80, ceiling: 0.35 },
    weights: winNowWeights,
    playerAttributeWeights: contenderAttributeWeights,
    editorial: {
      strategy: 'Cercar as estrelas com defesa, tamanho, rebote e arremesso funcional.',
      frontOfficeTendency: 'Tende a buscar especialistas que resolvam problemas imediatos de playoff.',
      riskToleranceText: 'Media: aceita risco se a ferramenta principal for elite.',
      notes: ['Defesa e rebote devem receber bonus.', 'Spot-up shooting e essencial.', 'Criadores on-ball so fazem sentido se forem valor claro.'],
    },
  },
  {
    id: 'DEN',
    name: 'Denver Nuggets',
    conference: 'West',
    timeline: 'contender',
    draftMode: 'contender_depth',
    priority: 'floor',
    riskTolerance: 'low',
    needs: { shooting: 0.70, creation: 0.45, defense: 0.65, rebounding: 0.50, athleticism: 0.45, size: 0.55, floor: 0.90, ceiling: 0.30 },
    weights: winNowWeights,
    playerAttributeWeights: contenderAttributeWeights,
    editorial: {
      strategy: 'Adicionar rotacao barata com QI, corte, arremesso e defesa contextual.',
      frontOfficeTendency: 'Valoriza leitura, tamanho funcional e jogadores que entendem jogo em movimento.',
      riskToleranceText: 'Baixa para projetos sem QI; media para jogadores inteligentes com uma ferramenta clara.',
      notes: ['BBIQ deve ser desempate forte.', 'Arremessadores e conectores sobem.', 'Atletas crus precisam cair bastante para fazer sentido.'],
    },
  },
  {
    id: 'DET',
    name: 'Detroit Pistons',
    conference: 'East',
    timeline: 'rising_core',
    draftMode: 'core_builder',
    priority: 'spacing',
    riskTolerance: 'medium',
    needs: { shooting: 0.95, creation: 0.45, defense: 0.60, rebounding: 0.45, athleticism: 0.55, size: 0.60, floor: 0.65, ceiling: 0.60 },
    weights: balancedWeights,
    playerAttributeWeights: { shooting: 0.30, creation: 0.14, defense: 0.14, rebounding: 0.06, athleticism: 0.06, size: 0.08, floor: 0.12, ceiling: 0.10 },
    editorial: {
      strategy: 'Aumentar spacing e confiabilidade ofensiva sem perder fisicalidade.',
      frontOfficeTendency: 'Busca consolidar o nucleo jovem com jogadores que facilitem o ataque.',
      riskToleranceText: 'Media: aceita upside, mas precisa de traducao clara ao lado dos jovens principais.',
      notes: ['Volume real de tres pontos e prioridade maxima.', 'Wings com defesa e arremesso devem subir.', 'Projetos sem jumper podem congestionar o roster.'],
    },
  },
  {
    id: 'GSW',
    name: 'Golden State Warriors',
    conference: 'West',
    timeline: 'aging_contender',
    draftMode: 'win_now_support',
    priority: 'floor',
    riskTolerance: 'low',
    needs: { shooting: 0.80, creation: 0.45, defense: 0.70, rebounding: 0.55, athleticism: 0.45, size: 0.65, floor: 0.90, ceiling: 0.30 },
    weights: winNowWeights,
    playerAttributeWeights: contenderAttributeWeights,
    editorial: {
      strategy: 'Encontrar jogadores inteligentes, prontos e capazes de sobreviver em decisoes rapidas.',
      frontOfficeTendency: 'Valoriza QI, arremesso, defesa de equipe e adaptabilidade.',
      riskToleranceText: 'Baixa em picks de suporte; projetos longos entram apenas se forem valor excepcional.',
      notes: ['Processamento rapido deve pesar.', 'Tamanho no perimetro e necessidade real.', 'Jogadores sem arremesso precisam ser defensores especiais.'],
    },
  },
  {
    id: 'HOU',
    name: 'Houston Rockets',
    conference: 'West',
    timeline: 'playoff_core',
    draftMode: 'playoff_support',
    priority: 'spacing',
    riskTolerance: 'medium',
    needs: { shooting: 0.90, creation: 0.55, defense: 0.55, rebounding: 0.35, athleticism: 0.45, size: 0.55, floor: 0.75, ceiling: 0.50 },
    weights: balancedWeights,
    playerAttributeWeights: { shooting: 0.30, creation: 0.20, defense: 0.12, rebounding: 0.05, athleticism: 0.06, size: 0.07, floor: 0.12, ceiling: 0.08 },
    editorial: {
      strategy: 'Adicionar arremesso e criacao secundaria para liberar um nucleo fisico e defensivo.',
      frontOfficeTendency: 'Valoriza competitividade, forca, defesa e perfis com ferramentas claras.',
      riskToleranceText: 'Media: pode apostar em upside, mas o fit ofensivo precisa ser real.',
      notes: ['Shooting de volume e prioridade.', 'Criadores secundarios recebem bonus.', 'Defensores sem spacing precisam ser elite.'],
    },
  },
  {
    id: 'IND',
    name: 'Indiana Pacers',
    conference: 'East',
    timeline: 'contender',
    draftMode: 'contender_depth',
    priority: 'defense',
    riskTolerance: 'medium',
    needs: { shooting: 0.65, creation: 0.35, defense: 0.90, rebounding: 0.55, athleticism: 0.60, size: 0.75, floor: 0.75, ceiling: 0.40 },
    weights: winNowWeights,
    playerAttributeWeights: { shooting: 0.16, creation: 0.10, defense: 0.30, rebounding: 0.10, athleticism: 0.08, size: 0.10, floor: 0.12, ceiling: 0.04 },
    editorial: {
      strategy: 'Adicionar defesa, tamanho e rebote a um ataque ja estruturado.',
      frontOfficeTendency: 'Gosta de jogadores que correm, processam rapido e aceitam papel.',
      riskToleranceText: 'Media, desde que o prospect tenha utilidade clara em ritmo alto.',
      notes: ['Defesa de wing e frontcourt deve subir.', 'Arremesso e importante, mas nao e a unica prioridade.', 'Atletismo funcional combina com a identidade.'],
    },
  },
  {
    id: 'LAC',
    name: 'LA Clippers',
    conference: 'West',
    timeline: 'aging_contender',
    draftMode: 'win_now_support',
    priority: 'floor',
    riskTolerance: 'low',
    needs: { shooting: 0.75, creation: 0.50, defense: 0.65, rebounding: 0.45, athleticism: 0.40, size: 0.55, floor: 0.90, ceiling: 0.25 },
    weights: winNowWeights,
    playerAttributeWeights: contenderAttributeWeights,
    editorial: {
      strategy: 'Buscar jogadores prontos, eficientes e capazes de preencher buracos de rotacao.',
      frontOfficeTendency: 'Valoriza veteranos, tamanho funcional e perfis de baixo erro.',
      riskToleranceText: 'Baixa; precisa de traducao imediata.',
      notes: ['Maturidade e disponibilidade devem pesar.', 'Guards com criacao secundaria podem subir.', 'Projetos de longo prazo ficam abaixo.'],
    },
  },
  {
    id: 'LAL',
    name: 'Los Angeles Lakers',
    conference: 'West',
    timeline: 'aging_contender',
    draftMode: 'win_now_support',
    priority: 'two_way',
    riskTolerance: 'low',
    needs: { shooting: 0.80, creation: 0.40, defense: 0.85, rebounding: 0.50, athleticism: 0.50, size: 0.75, floor: 0.85, ceiling: 0.35 },
    weights: winNowWeights,
    playerAttributeWeights: contenderAttributeWeights,
    editorial: {
      strategy: 'Adicionar wings e bigs two-way que consigam jogar minutos de pressao.',
      frontOfficeTendency: 'Prefere utilidade imediata, fisicalidade e ferramentas defensivas.',
      riskToleranceText: 'Baixa, exceto para talentos que caiam fora do range esperado.',
      notes: ['Defesa e tamanho no perimetro devem pesar.', 'Shooting funcional e obrigatorio para guards/wings.', 'Jogadores sem papel claro perdem valor.'],
    },
  },
  {
    id: 'MEM',
    name: 'Memphis Grizzlies',
    conference: 'West',
    timeline: 'playoff_core',
    draftMode: 'playoff_support',
    priority: 'size',
    riskTolerance: 'medium',
    needs: { shooting: 0.70, creation: 0.40, defense: 0.70, rebounding: 0.70, athleticism: 0.60, size: 0.90, floor: 0.70, ceiling: 0.50 },
    weights: balancedWeights,
    playerAttributeWeights: { shooting: 0.18, creation: 0.10, defense: 0.20, rebounding: 0.14, athleticism: 0.08, size: 0.14, floor: 0.10, ceiling: 0.06 },
    editorial: {
      strategy: 'Reforcar tamanho, rebote e durabilidade em torno de um nucleo competitivo.',
      frontOfficeTendency: 'Valoriza fisicalidade, defesa e jogadores competitivos com identidade clara.',
      riskToleranceText: 'Media; aceita swings se forem fortes fisicamente ou defensivamente.',
      notes: ['Frontcourt depth e prioridade.', 'Wings grandes com arremesso sobem.', 'Criacao pura e secundaria ao fit fisico.'],
    },
  },
  {
    id: 'MIA',
    name: 'Miami Heat',
    conference: 'East',
    timeline: 'playoff_core',
    draftMode: 'playoff_support',
    priority: 'two_way',
    riskTolerance: 'medium',
    needs: { shooting: 0.75, creation: 0.55, defense: 0.80, rebounding: 0.45, athleticism: 0.55, size: 0.65, floor: 0.75, ceiling: 0.45 },
    weights: balancedWeights,
    playerAttributeWeights: { shooting: 0.20, creation: 0.16, defense: 0.22, rebounding: 0.06, athleticism: 0.08, size: 0.08, floor: 0.14, ceiling: 0.06 },
    editorial: {
      strategy: 'Encontrar jogadores competitivos, condicionados e capazes de executar em papeis exigentes.',
      frontOfficeTendency: 'Valoriza motor, desenvolvimento interno, defesa e maturidade competitiva.',
      riskToleranceText: 'Media: aceita imperfeicoes se houver mentalidade e ferramenta NBA clara.',
      notes: ['Motor e defesa devem receber bonus editorial.', 'Arremesso funcional decide muito encaixe.', 'Jogadores com historico de baixa intensidade devem cair.'],
    },
  },
  {
    id: 'MIL',
    name: 'Milwaukee Bucks',
    conference: 'East',
    timeline: 'aging_contender',
    draftMode: 'win_now_support',
    priority: 'defense',
    riskTolerance: 'low',
    needs: { shooting: 0.75, creation: 0.40, defense: 0.85, rebounding: 0.50, athleticism: 0.45, size: 0.70, floor: 0.90, ceiling: 0.25 },
    weights: winNowWeights,
    playerAttributeWeights: contenderAttributeWeights,
    editorial: {
      strategy: 'Adicionar defesa, pernas jovens e arremesso para sustentar a janela competitiva.',
      frontOfficeTendency: 'Busca tamanho, comprimento e jogadores que ajudem imediatamente.',
      riskToleranceText: 'Baixa; desenvolvimento longo e dificil de encaixar na timeline.',
      notes: ['Wings defensivos e bigs moveis sobem.', 'Shooting e necessario para jogar com estrelas.', 'Disponibilidade deve ter peso alto.'],
    },
  },
  {
    id: 'MIN',
    name: 'Minnesota Timberwolves',
    conference: 'West',
    timeline: 'contender',
    draftMode: 'contender_depth',
    priority: 'creation',
    riskTolerance: 'medium',
    needs: { shooting: 0.65, creation: 0.75, defense: 0.65, rebounding: 0.35, athleticism: 0.45, size: 0.50, floor: 0.75, ceiling: 0.40 },
    weights: balancedWeights,
    playerAttributeWeights: { shooting: 0.18, creation: 0.24, defense: 0.18, rebounding: 0.05, athleticism: 0.05, size: 0.06, floor: 0.18, ceiling: 0.06 },
    editorial: {
      strategy: 'Adicionar criacao secundaria e tomada de decisao ao redor de uma defesa forte.',
      frontOfficeTendency: 'Valoriza tamanho, defesa e jogadores que sustentem identidade de playoff.',
      riskToleranceText: 'Media, principalmente para guards/wings com leitura e arremesso.',
      notes: ['Criacao secundaria e prioridade.', 'Defesa nao pode ser ignorada.', 'Jogadores muito crus podem nao encaixar na janela.'],
    },
  },
  {
    id: 'NOP',
    name: 'New Orleans Pelicans',
    conference: 'West',
    timeline: 'early_rebuild',
    draftMode: 'talent_accumulation',
    priority: 'ceiling',
    riskTolerance: 'high',
    needs: { shooting: 0.70, creation: 0.85, defense: 0.60, rebounding: 0.55, athleticism: 0.75, size: 0.70, floor: 0.35, ceiling: 0.90 },
    weights: upsideWeights,
    playerAttributeWeights: rebuildAttributeWeights,
    editorial: {
      strategy: 'Reorganizar o nucleo com talento de alto teto, criacao e versatilidade fisica.',
      frontOfficeTendency: 'Historicamente atraida por ferramentas fisicas, wings e upside.',
      riskToleranceText: 'Alta se o prospect puder virar peca central ou two-way premium.',
      notes: ['Teto deve pesar mais que encaixe imediato.', 'Saude e disponibilidade precisam entrar como filtro.', 'Wings grandes e criadores sobem.'],
    },
  },
  {
    id: 'NYK',
    name: 'New York Knicks',
    conference: 'East',
    timeline: 'contender',
    draftMode: 'contender_depth',
    priority: 'floor',
    riskTolerance: 'low',
    needs: { shooting: 0.70, creation: 0.40, defense: 0.75, rebounding: 0.55, athleticism: 0.45, size: 0.60, floor: 0.90, ceiling: 0.30 },
    weights: winNowWeights,
    playerAttributeWeights: contenderAttributeWeights,
    editorial: {
      strategy: 'Buscar rotacao forte, fisica e confiavel para playoffs.',
      frontOfficeTendency: 'Valoriza dureza, rebote, defesa e jogadores prontos.',
      riskToleranceText: 'Baixa; precisa de perfil competitivo e usavel.',
      notes: ['Maturidade competitiva recebe bonus.', 'Wings 3-and-D encaixam bem.', 'Projetos leves fisicamente devem cair.'],
    },
  },
  {
    id: 'OKC',
    name: 'Oklahoma City Thunder',
    conference: 'West',
    timeline: 'contender',
    draftMode: 'core_builder',
    priority: 'size',
    riskTolerance: 'medium',
    needs: { shooting: 0.65, creation: 0.45, defense: 0.70, rebounding: 0.70, athleticism: 0.60, size: 0.85, floor: 0.70, ceiling: 0.65 },
    weights: balancedWeights,
    playerAttributeWeights: { shooting: 0.16, creation: 0.14, defense: 0.20, rebounding: 0.12, athleticism: 0.08, size: 0.12, floor: 0.08, ceiling: 0.10 },
    editorial: {
      strategy: 'Adicionar tamanho, rebote e ferramentas sem perder habilidade e tomada de decisao.',
      frontOfficeTendency: 'Valoriza idade, comprimento, versatilidade e processamento.',
      riskToleranceText: 'Media: pode esperar desenvolvimento se a ferramenta for diferenciada.',
      notes: ['Tamanho habilidoso e prioridade.', 'Jogadores sem processamento rapido perdem valor.', 'Draft capital pode bloquear fits fora do range.'],
    },
  },
  {
    id: 'ORL',
    name: 'Orlando Magic',
    conference: 'East',
    timeline: 'playoff_core',
    draftMode: 'win_now_support',
    priority: 'spacing',
    riskTolerance: 'medium',
    needs: { shooting: 0.95, creation: 0.75, defense: 0.25, rebounding: 0.30, athleticism: 0.35, size: 0.40, floor: 0.75, ceiling: 0.45 },
    weights: balancedWeights,
    playerAttributeWeights: { shooting: 0.30, creation: 0.25, defense: 0.10, rebounding: 0.05, athleticism: 0.05, size: 0.05, floor: 0.15, ceiling: 0.05 },
    editorial: {
      strategy: 'Adicionar arremesso e criacao sem comprometer a defesa.',
      frontOfficeTendency: 'Valoriza tamanho, defesa e versatilidade.',
      riskToleranceText: 'Pode aceitar algum risco, mas tende a preferir jogadores uteis no curto prazo.',
      notes: ['Precisa de volume real de 3 pontos.', 'Fit ofensivo e mais importante que upside puro neste contexto.', 'Sem pick compativel, bons encaixes devem ser marcados como bloqueados pelo draft capital.'],
    },
  },
  {
    id: 'PHI',
    name: 'Philadelphia 76ers',
    conference: 'East',
    timeline: 'playoff_core',
    draftMode: 'win_now_support',
    priority: 'floor',
    riskTolerance: 'low',
    needs: { shooting: 0.80, creation: 0.45, defense: 0.70, rebounding: 0.45, athleticism: 0.40, size: 0.65, floor: 0.90, ceiling: 0.30 },
    weights: winNowWeights,
    playerAttributeWeights: contenderAttributeWeights,
    editorial: {
      strategy: 'Adicionar jogadores prontos, saudaveis e de baixo erro para estabilizar a rotacao.',
      frontOfficeTendency: 'Valoriza encaixe com estrelas, spacing e defesa suficiente para playoff.',
      riskToleranceText: 'Baixa, especialmente com historico recente de volatilidade de roster.',
      notes: ['Floor e disponibilidade devem pesar.', 'Shooting e essencial.', 'Projetos medicos ou longos precisam cair muito no draft.'],
    },
  },
  {
    id: 'PHX',
    name: 'Phoenix Suns',
    conference: 'West',
    timeline: 'aging_contender',
    draftMode: 'win_now_support',
    priority: 'defense',
    riskTolerance: 'low',
    needs: { shooting: 0.75, creation: 0.35, defense: 0.90, rebounding: 0.55, athleticism: 0.50, size: 0.70, floor: 0.90, ceiling: 0.25 },
    weights: winNowWeights,
    playerAttributeWeights: contenderAttributeWeights,
    editorial: {
      strategy: 'Encontrar defesa, tamanho e energia barata para apoiar uma janela cara.',
      frontOfficeTendency: 'Precisa maximizar picks com jogadores de rotacao imediata.',
      riskToleranceText: 'Baixa; pouco espaco para desenvolvimento sem contribuicao.',
      notes: ['Defesa de wing e prioridade.', 'Rebote e fisicalidade importam.', 'Jogadores sem funcao imediata perdem valor.'],
    },
  },
  {
    id: 'POR',
    name: 'Portland Trail Blazers',
    conference: 'West',
    timeline: 'development_core',
    draftMode: 'core_builder',
    priority: 'two_way',
    riskTolerance: 'high',
    needs: { shooting: 0.65, creation: 0.55, defense: 0.85, rebounding: 0.60, athleticism: 0.75, size: 0.75, floor: 0.40, ceiling: 0.85 },
    weights: upsideWeights,
    playerAttributeWeights: { shooting: 0.14, creation: 0.14, defense: 0.24, rebounding: 0.10, athleticism: 0.12, size: 0.10, floor: 0.06, ceiling: 0.10 },
    editorial: {
      strategy: 'Construir uma identidade fisica e defensiva com atletas de alto teto.',
      frontOfficeTendency: 'Valoriza ferramentas, juventude e versatilidade posicional.',
      riskToleranceText: 'Alta, desde que o jogador tenha caminho claro para impacto two-way.',
      notes: ['Defense-first wings e bigs devem subir.', 'Spacing ainda precisa ser monitorado.', 'Criacao secundaria e bonus, nao obrigacao.'],
    },
  },
  {
    id: 'SAC',
    name: 'Sacramento Kings',
    conference: 'West',
    timeline: 'playoff_core',
    draftMode: 'playoff_support',
    priority: 'defense',
    riskTolerance: 'medium',
    needs: { shooting: 0.70, creation: 0.40, defense: 0.90, rebounding: 0.55, athleticism: 0.55, size: 0.75, floor: 0.75, ceiling: 0.40 },
    weights: balancedWeights,
    playerAttributeWeights: { shooting: 0.18, creation: 0.10, defense: 0.30, rebounding: 0.08, athleticism: 0.08, size: 0.10, floor: 0.12, ceiling: 0.04 },
    editorial: {
      strategy: 'Adicionar defesa de perimetro, tamanho e fisicalidade sem matar o ataque.',
      frontOfficeTendency: 'Costuma buscar encaixes prontos e jogadores que elevem o piso.',
      riskToleranceText: 'Media; prioridade e resolver problemas atuais.',
      notes: ['Defensores grandes recebem bonus.', 'Arremesso funcional continua necessario.', 'Criadores redundantes podem ficar abaixo.'],
    },
  },
  {
    id: 'SAS',
    name: 'San Antonio Spurs',
    conference: 'West',
    timeline: 'rising_core',
    draftMode: 'core_builder',
    priority: 'creation',
    riskTolerance: 'medium',
    needs: { shooting: 0.75, creation: 0.90, defense: 0.50, rebounding: 0.35, athleticism: 0.45, size: 0.55, floor: 0.55, ceiling: 0.80 },
    weights: balancedWeights,
    playerAttributeWeights: { shooting: 0.20, creation: 0.30, defense: 0.10, rebounding: 0.04, athleticism: 0.06, size: 0.06, floor: 0.08, ceiling: 0.16 },
    editorial: {
      strategy: 'Adicionar criacao, passing e spacing ao redor de um nucleo de alto teto.',
      frontOfficeTendency: 'Valoriza QI, desenvolvimento, tamanho funcional e habilidades complementares.',
      riskToleranceText: 'Media: aceita upside se houver feel for the game.',
      notes: ['Guards e wings criadores sobem muito.', 'Spacing e essencial ao lado do nucleo.', 'Jogadores sem leitura podem cair mesmo com ferramentas.'],
    },
  },
  {
    id: 'TOR',
    name: 'Toronto Raptors',
    conference: 'East',
    timeline: 'development_core',
    draftMode: 'core_builder',
    priority: 'spacing',
    riskTolerance: 'medium',
    needs: { shooting: 0.90, creation: 0.60, defense: 0.55, rebounding: 0.45, athleticism: 0.60, size: 0.70, floor: 0.55, ceiling: 0.70 },
    weights: balancedWeights,
    playerAttributeWeights: { shooting: 0.28, creation: 0.18, defense: 0.14, rebounding: 0.06, athleticism: 0.08, size: 0.10, floor: 0.06, ceiling: 0.10 },
    editorial: {
      strategy: 'Adicionar shooting e criacao sem abandonar tamanho e versatilidade.',
      frontOfficeTendency: 'Historicamente valoriza wings longos, defesa e desenvolvimento.',
      riskToleranceText: 'Media; aceita projetos se o pacote fisico e de skill for raro.',
      notes: ['Shooting deve ser corrigido no roster.', 'Wings grandes com bola recebem bonus.', 'Projetos sem arremesso precisam ter defesa especial.'],
    },
  },
  {
    id: 'UTA',
    name: 'Utah Jazz',
    conference: 'West',
    timeline: 'deep_rebuild',
    draftMode: 'talent_accumulation',
    priority: 'ceiling',
    riskTolerance: 'high',
    needs: { shooting: 0.65, creation: 0.90, defense: 0.65, rebounding: 0.45, athleticism: 0.70, size: 0.65, floor: 0.25, ceiling: 0.95 },
    weights: upsideWeights,
    playerAttributeWeights: rebuildAttributeWeights,
    editorial: {
      strategy: 'Acumular talento de alto teto, especialmente criadores e wings modernos.',
      frontOfficeTendency: 'Tem flexibilidade para apostar em upside e valor de mercado.',
      riskToleranceText: 'Alta; a prioridade e encontrar estrelas, nao encaixes de curto prazo.',
      notes: ['Ceiling deve pesar mais que floor.', 'Criacao e vantagem fisica sobem.', 'Jogadores prontos, mas limitados, so fazem sentido em valor.'],
    },
  },
  {
    id: 'WAS',
    name: 'Washington Wizards',
    conference: 'East',
    timeline: 'deep_rebuild',
    draftMode: 'talent_accumulation',
    priority: 'ceiling',
    riskTolerance: 'high',
    needs: { shooting: 0.70, creation: 0.95, defense: 0.70, rebounding: 0.50, athleticism: 0.80, size: 0.75, floor: 0.20, ceiling: 1.00 },
    weights: upsideWeights,
    playerAttributeWeights: rebuildAttributeWeights,
    editorial: {
      strategy: 'Buscar talento primário e ativos de alto teto em qualquer posicao.',
      frontOfficeTendency: 'Deve maximizar upside, juventude e valor futuro acima de encaixe imediato.',
      riskToleranceText: 'Muito alta; o contexto permite paciencia e desenvolvimento.',
      notes: ['Best talent available deve dominar.', 'Criadores e atletas grandes recebem bonus.', 'Availability fit nao deve bloquear swings em picks altas.'],
    },
  },
];

export function getTeamProfile(teamId: TeamId | string): TeamProfile | undefined {
  return teamProfiles.find(team => team.id === teamId);
}

export function getAllTeamProfiles(): TeamProfile[] {
  return teamProfiles;
}

export function getTeamsByDraftMode(mode: DraftMode): TeamProfile[] {
  return teamProfiles.filter(team => team.draftMode === mode);
}

export function getTeamsByPriority(priority: Priority): TeamProfile[] {
  return teamProfiles.filter(team => team.priority === priority);
}

export default teamProfiles;
