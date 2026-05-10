// Como editar:
// - Use a sigla do time como chave.
// - Distribua os jogadores em guards, wingsForwards e bigs.
// - Cada jogador precisa ter pelo menos { name: "Nome do Jogador" }.
// - O campo status e opcional.
// - Status disponiveis:
//   "core" = jogador principal, usa a cor do time
//   "injured" = jogador machucado, pilula vermelha
//   "uncertain" = futuro incerto, pilula amarela
//   "normal" = estilo neutro
// - O campo note e opcional e aparece no hover.
// - Todos os times ja vem preenchidos como ponto de partida manual.

export type RosterPlayerStatus = 'core' | 'injured' | 'uncertain' | 'normal';

export type ManualRosterPlayer = {
  name: string;
  status?: RosterPlayerStatus;
  note?: string;
};

export type ManualRosterOverride = {
  guards: ManualRosterPlayer[];
  wingsForwards: ManualRosterPlayer[];
  bigs: ManualRosterPlayer[];
};

export type ManualRosterOverrides = Record<string, ManualRosterOverride>;

export const rosterStatusPriority: Record<RosterPlayerStatus, number> = {
  core: 0,
  normal: 1,
  uncertain: 2,
  injured: 3,
};

export function sortRosterPlayersByStatus<T extends { status?: RosterPlayerStatus }>(players: T[] = []): T[] {
  return players
    .map((player, index) => ({ player, index }))
    .sort((a, b) => {
      const aStatus = a.player.status || 'normal';
      const bStatus = b.player.status || 'normal';
      const statusDiff = rosterStatusPriority[aStatus] - rosterStatusPriority[bStatus];
      return statusDiff !== 0 ? statusDiff : a.index - b.index;
    })
    .map(({ player }) => player);
}

export const manualRosterOverrides: ManualRosterOverrides = {
  ATL: {
    guards: [
      { name: 'Nickeil Alexander-Walker', status: 'core' },
      { name: 'Dyson Daniels', status: 'core' },
      { name: 'CJ McCollum', status: 'core' },
      { name: 'Buddy Hield' },
      { name: 'Gabe Vincent' },
    ],
    wingsForwards: [
      { name: 'Jalen Johnson', status: 'core' },
      { name: 'Jonathan Kuminga' },
      { name: 'Zaccharie Risacher' },
      { name: 'Corey Kispert' },
      { name: 'Mouhamed Gueye' },
    ],
    bigs: [
      { name: 'Onyeka Okongwu', status: 'core' },
      { name: 'Jock Landale' },
      { name: 'Christian Koloko' },
    ],
  },
  BOS: {
    guards: [
      { name: 'Jayson Tatum', status: 'injured' },
      { name: 'Derrick White', status: 'core' },
      { name: 'Payton Pritchard', status: 'core' },
      { name: 'Baylor Scheierman' },
      { name: 'Jordan Walsh' },
      { name: 'Hugo González' },
    ],
    wingsForwards: [
      { name: 'Jaylen Brown', status: 'core' },
      { name: 'Sam Hauser' },
    ],
    bigs: [
      { name: 'Nikola Vučević', status: 'core' },
      { name: 'Neemias Queta' },
      { name: 'Luka Garza' },
    ],
  },
  BKN: {
    guards: [
      { name: 'Egor Dëmin' },
      { name: 'Nolan Traore' },
      { name: 'Malachi Smith' },
      { name: 'Ben Saraf' },
      { name: 'Drake Powell' },
      { name: 'Tyson Etienne' },
      { name: 'Ochai Agbaji' },
    ],
    wingsForwards: [
      { name: 'Michael Porter Jr.', status: 'core' },
      { name: 'Danny Wolf' },
      { name: 'Terance Mann' },
      { name: 'Ziaire Williams' },
      { name: 'Chaney Johnson' },
      { name: 'Josh Minott' },
      { name: 'Jalen Wilson' },
      { name: 'E.J. Liddell' },
    ],
    bigs: [
      { name: 'Nic Claxton' },
      { name: 'Noah Clowney' },
      { name: 'Day\'Ron Sharpe' },
    ],
  },
  CHA: {
    guards: [
      { name: 'LaMelo Ball', status: 'core' },
      { name: 'Coby White', status: 'core' },
      { name: 'Sion James' },
      { name: 'Josh Green' },
    ],
    wingsForwards: [
      { name: 'Brandon Miller', status: 'core' },
      { name: 'Kon Knueppel', status: 'core' },
      { name: 'Miles Bridges', status: 'core' },
      { name: 'Moussa Diabaté', status: 'core' },
      { name: 'Grant Williams' },
      { name: 'Tidjane Salaün' },
    ],
    bigs: [
      { name: 'Ryan Kalkbrenner' },
    ],
  },
  CHI: {
    guards: [
      { name: 'Josh Giddey', status: 'core' },
      { name: 'Tre Jones' },
      { name: 'Anfernee Simons' },
      { name: 'Collin Sexton' },
      { name: 'Isaac Okoro' },
      { name: 'Jaden Ivey' },
      { name: 'Rob Dillingham' },
    ],
    wingsForwards: [
      { name: 'Matas Buzelis', status: 'core' },
      { name: 'Patrick Williams' },
      { name: 'Leonard Miller' },
      { name: 'Guerschon Yabusele' },
    ],
    bigs: [
      { name: 'Jalen Smith' },
      { name: 'Nick Richards' },
    ],
  },
  CLE: {
    guards: [
      { name: 'Donovan Mitchell', status: 'core' },
      { name: 'James Harden', status: 'core' },
      { name: 'Sam Merrill' },
      { name: 'Dennis Schröder' },
      { name: 'Lonzo Ball' },
      { name: 'Craig Porter Jr.' },
      { name: 'Keon Ellis' },
    ],
    wingsForwards: [
      { name: 'Jaylon Tyson' },
      { name: 'Nae\'Qwan Tomlin' },
    ],
    bigs: [
      { name: 'Evan Mobley', status: 'core' },
      { name: 'Jarrett Allen', status: 'core' },
      { name: 'Dean Wade' },
    ],
  },
  DAL: {
    guards: [
      { name: 'Max Christie', status: 'core' },
      { name: 'Ryan Nembhard' },
      { name: 'Brandon Williams' },
      { name: 'Kyrie Irving', status: 'injured', note: 'Lesionado' },
      { name: 'D\'Angelo Russell', status: 'uncertain', note: 'Futuro incerto' },
    ],
    wingsForwards: [
      { name: 'Cooper Flagg', status: 'core' },
      { name: 'P.J. Washington', status: 'core' },
      { name: 'Naji Marshall' },
      { name: 'Khris Middleton' },
      { name: 'Marvin Bagley III' },
      { name: 'Caleb Martin' },
      { name: 'Jeremiah Robinson-Earl' },
      { name: 'Klay Thompson', status: 'uncertain', note: 'Futuro incerto' },
    ],
    bigs: [
      { name: 'Dereck Lively II', status: 'core' },
      { name: 'Daniel Gafford' },
      { name: 'Dwight Powell' },
      { name: 'Moussa Cisse' },
    ],
  },
  DEN: {
    guards: [
      { name: 'Jamal Murray', status: 'core' },
      { name: 'Christian Braun', status: 'core' },
      { name: 'Peyton Watson', status: 'core' },
      { name: 'Tim Hardaway Jr.' },
      { name: 'Bruce Brown' },
      { name: 'Julian Strawther' },
      { name: 'Jalen Pickett' },
      { name: 'Tyus Jones' },
    ],
    wingsForwards: [
      { name: 'Aaron Gordon', status: 'core' },
      { name: 'Cameron Johnson', status: 'core' },
      { name: 'Spencer Jones' },
    ],
    bigs: [
      { name: 'Nikola Jokić', status: 'core' },
      { name: 'Jonas Valančiūnas', status: 'core' },
    ],
  },
  DET: {
    guards: [
      { name: 'Cade Cunningham', status: 'core' },
      { name: 'Daniss Jenkins' },
      { name: 'Caris LeVert' },
      { name: 'Javonte Green' },
    ],
    wingsForwards: [
      { name: 'Tobias Harris' },
      { name: 'Ausar Thompson' },
      { name: 'Duncan Robinson' },
      { name: 'Kevin Huerter' },
      { name: 'Ronald Holland II' },
      { name: 'Paul Reed' },
    ],
    bigs: [
      { name: 'Jalen Duren', status: 'core' },
      { name: 'Isaiah Stewart' },
    ],
  },
  GSW: {
    guards: [
      { name: 'Stephen Curry', status: 'core' },
      { name: 'Brandin Podziemski', status: 'core' },
      { name: 'De\'Anthony Melton' },
      { name: 'Moses Moody' },
      { name: 'Pat Spencer' },
      { name: 'Gary Payton II' },
      { name: 'LJ Cryer' },
      { name: 'Will Richard' },
      { name: 'Nate Williams' },
    ],
    wingsForwards: [
      { name: 'Jimmy Butler III', status: 'core' },
      { name: 'Draymond Green', status: 'core' },
      { name: 'Gui Santos' },
    ],
    bigs: [
      { name: 'Kristaps Porziņģis', status: 'core' },
      { name: 'Al Horford' },
      { name: 'Quinten Post' },
    ],
  },
  HOU: {
    guards: [
      { name: 'Reed Sheppard' },
      { name: 'Josh Okogie' },
      { name: 'Aaron Holiday' },
    ],
    wingsForwards: [
      { name: 'Kevin Durant', status: 'core' },
      { name: 'Amen Thompson', status: 'core' },
      { name: 'Jabari Smith Jr.', status: 'core' },
      { name: 'Tari Eason' },
      { name: 'Dorian Finney-Smith' },
    ],
    bigs: [
      { name: 'Alperen Sengun', status: 'core' },
      { name: 'Steven Adams', status: 'core' },
    ],
  },
  IND: {
    guards: [
      { name: 'Andrew Nembhard', status: 'core' },
      { name: 'Aaron Nesmith', status: 'core' },
      { name: 'T.J. McConnell' },
      { name: 'Quenton Jackson' },
      { name: 'Ethan Thompson' },
      { name: 'Ben Sheppard' },
      { name: 'Johnny Furphy' },
      { name: 'Kam Jones' },
      { name: 'Garrison Mathews' },
      { name: 'Taelon Peter' },
      { name: 'Tyrese Haliburton', status: 'injured', note: 'Contextual core / lesao' },
    ],
    wingsForwards: [
      { name: 'Pascal Siakam', status: 'core' },
      { name: 'Jarace Walker' },
      { name: 'Obi Toppin' },
      { name: 'Kobe Brown' },
    ],
    bigs: [
      { name: 'Ivica Zubac', status: 'core' },
      { name: 'Jay Huff' },
      { name: 'Micah Potter' },
    ],
  },
  LAC: {
    guards: [
      { name: 'Darius Garland', status: 'core' },
      { name: 'Bennedict Mathurin', status: 'core' },
      { name: 'Kris Dunn' },
      { name: 'Jordan Miller' },
      { name: 'Bogdan Bogdanović' },
      { name: 'Kobe Sanders' },
      { name: 'Chris Paul' },
    ],
    wingsForwards: [
      { name: 'Kawhi Leonard', status: 'core' },
      { name: 'Derrick Jones Jr.' },
      { name: 'Isaiah Jackson' },
      { name: 'Nicolas Batum' },
    ],
    bigs: [
      { name: 'John Collins' },
      { name: 'Brook Lopez' },
    ],
  },
  LAL: {
    guards: [
      { name: 'Luka Dončić', status: 'core' },
      { name: 'Austin Reaves', status: 'core' },
      { name: 'Marcus Smart', status: 'core' },
      { name: 'Luke Kennard' },
    ],
    wingsForwards: [
      { name: 'LeBron James', status: 'core' },
      { name: 'Rui Hachimura', status: 'core' },
      { name: 'Jake LaRavia' },
      { name: 'Jarred Vanderbilt' },
    ],
    bigs: [
      { name: 'Deandre Ayton' },
      { name: 'Jaxson Hayes' },
    ],
  },
  MEM: {
    guards: [
      { name: 'Ty Jerome', status: 'core' },
      { name: 'Cedric Coward', status: 'core' },
      { name: 'Cam Spencer', status: 'core' },
      { name: 'Javon Small' },
      { name: 'Kentavious Caldwell-Pope' },
      { name: 'Walter Clayton Jr.' },
      { name: 'Jahmai Mashack' },
    ],
    wingsForwards: [
      { name: 'Jaylen Wells', status: 'core' },
      { name: 'GG Jackson' },
      { name: 'Olivier-Maxence Prosper' },
      { name: 'Taylor Hendricks' },
      { name: 'Rayan Rupert' },
    ],
    bigs: [
      { name: 'Santi Aldama' },
      { name: 'Zach Edey', status: 'injured', note: 'Contextual core / lesao' },
    ],
  },
  MIA: {
    guards: [
      { name: 'Tyler Herro', status: 'core' },
      { name: 'Norman Powell', status: 'core' },
      { name: 'Jaime Jaquez Jr.', status: 'core' },
      { name: 'Davion Mitchell', status: 'core' },
      { name: 'Pelle Larsson' },
      { name: 'Kasparas Jakučionis' },
      { name: 'Dru Smith' },
    ],
    wingsForwards: [
      { name: 'Andrew Wiggins', status: 'core' },
      { name: 'Nikola Jović' },
      { name: 'Simone Fontecchio' },
    ],
    bigs: [
      { name: 'Bam Adebayo', status: 'core' },
      { name: 'Kel\'el Ware', status: 'core' },
    ],
  },
  MIL: {
    guards: [
      { name: 'Kevin Porter Jr.', status: 'core' },
      { name: 'Ryan Rollins', status: 'core' },
      { name: 'Cam Thomas', status: 'core' },
      { name: 'AJ Green', status: 'core' },
      { name: 'Cole Anthony' },
      { name: 'Gary Trent Jr.' },
      { name: 'Gary Harris' },
    ],
    wingsForwards: [
      { name: 'Giannis Antetokounmpo', status: 'core' },
      { name: 'Kyle Kuzma' },
      { name: 'Bobby Portis' },
      { name: 'Taurean Prince' },
      { name: 'Ousmane Dieng' },
      { name: 'Pete Nance' },
    ],
    bigs: [
      { name: 'Myles Turner' },
      { name: 'Jericho Sims' },
    ],
  },
  MIN: {
    guards: [
      { name: 'Anthony Edwards', status: 'core' },
      { name: 'Donte DiVincenzo', status: 'core' },
      { name: 'Ayo Dosunmu' },
      { name: 'Bones Hyland' },
      { name: 'Kyle Anderson' },
      { name: 'Mike Conley' },
      { name: 'Jaylen Clark' },
    ],
    wingsForwards: [
      { name: 'Jaden McDaniels', status: 'core' },
    ],
    bigs: [
      { name: 'Julius Randle', status: 'core' },
      { name: 'Rudy Gobert', status: 'core' },
      { name: 'Naz Reid' },
    ],
  },
  NOP: {
    guards: [
      { name: 'Dejounte Murray', status: 'core' },
      { name: 'Jeremiah Fears' },
      { name: 'Jordan Poole' },
      { name: 'Bryce McGowens' },
      { name: 'Jordan Hawkins' },
    ],
    wingsForwards: [
      { name: 'Trey Murphy III', status: 'core' },
      { name: 'Zion Williamson', status: 'core' },
      { name: 'Saddiq Bey', status: 'core' },
      { name: 'Herbert Jones', status: 'core' },
      { name: 'Micah Peavy' },
      { name: 'Kevon Looney' },
    ],
    bigs: [
      { name: 'Derik Queen' },
      { name: 'Yves Missi' },
      { name: 'Karlo Matković' },
    ],
  },
  NYK: {
    guards: [
      { name: 'Jalen Brunson', status: 'core' },
      { name: 'OG Anunoby', status: 'core' },
      { name: 'Josh Hart', status: 'core' },
      { name: 'Miles McBride' },
      { name: 'Landry Shamet' },
      { name: 'Jose Alvarado' },
      { name: 'Jordan Clarkson' },
    ],
    wingsForwards: [
      { name: 'Mikal Bridges', status: 'core' },
    ],
    bigs: [
      { name: 'Karl-Anthony Towns', status: 'core' },
      { name: 'Mitchell Robinson', status: 'core' },
    ],
  },
  OKC: {
    guards: [
      { name: 'Shai Gilgeous-Alexander', status: 'core' },
      { name: 'Jalen Williams', status: 'core' },
      { name: 'Ajay Mitchell' },
      { name: 'Cason Wallace' },
      { name: 'Luguentz Dort' },
      { name: 'Isaiah Joe' },
      { name: 'Aaron Wiggins' },
      { name: 'Alex Caruso' },
      { name: 'Jared McCain' },
    ],
    wingsForwards: [
      { name: 'Jaylin Williams' },
      { name: 'Kenrich Williams' },
    ],
    bigs: [
      { name: 'Chet Holmgren', status: 'core' },
      { name: 'Isaiah Hartenstein', status: 'core' },
    ],
  },
  ORL: {
    guards: [
      { name: 'Desmond Bane', status: 'core' },
      { name: 'Jalen Suggs', status: 'core' },
      { name: 'Anthony Black', status: 'core' },
      { name: 'Jevon Carter' },
    ],
    wingsForwards: [
      { name: 'Paolo Banchero', status: 'core' },
      { name: 'Franz Wagner', status: 'core' },
      { name: 'Tristan da Silva' },
    ],
    bigs: [
      { name: 'Wendell Carter Jr.', status: 'core' },
      { name: 'Goga Bitadze' },
    ],
  },
  PHI: {
    guards: [
      { name: 'Tyrese Maxey', status: 'core' },
      { name: 'VJ Edgecombe', status: 'core' },
      { name: 'Quentin Grimes', status: 'core' },
      { name: 'Kelly Oubre Jr.', status: 'core' },
      { name: 'Cameron Payne' },
    ],
    wingsForwards: [
      { name: 'Paul George', status: 'core' },
      { name: 'Dominick Barlow' },
      { name: 'Trendon Watford' },
      { name: 'Tyrese Martin' },
      { name: 'MarJon Beauchamp' },
      { name: 'Adem Bona' },
      { name: 'Justin Edwards' },
    ],
    bigs: [
      { name: 'Joel Embiid', status: 'core' },
      { name: 'Andre Drummond' },
    ],
  },
  PHX: {
    guards: [
      { name: 'Devin Booker', status: 'core' },
      { name: 'Jalen Green', status: 'core' },
      { name: 'Grayson Allen', status: 'core' },
      { name: 'Collin Gillespie', status: 'core' },
      { name: 'Jordan Goodwin' },
      { name: 'Jamaree Bouyea' },
    ],
    wingsForwards: [
      { name: 'Dillon Brooks', status: 'core' },
      { name: 'Royce O\'Neale', status: 'core' },
      { name: 'Oso Ighodaro' },
      { name: 'Ryan Dunn' },
    ],
    bigs: [
      { name: 'Mark Williams' },
    ],
  },
  POR: {
    guards: [
      { name: 'Jrue Holiday', status: 'core' },
      { name: 'Shaedon Sharpe', status: 'core' },
      { name: 'Scoot Henderson' },
      { name: 'Caleb Love' },
      { name: 'Vít Krejčí' },
      { name: 'Matisse Thybulle' },
      { name: 'Sidy Cissoko' },
    ],
    wingsForwards: [
      { name: 'Deni Avdija', status: 'core' },
      { name: 'Jerami Grant', status: 'core' },
      { name: 'Toumani Camara', status: 'core' },
      { name: 'Kris Murray' },
    ],
    bigs: [
      { name: 'Donovan Clingan', status: 'core' },
      { name: 'Robert Williams III' },
    ],
  },
  SAC: {
    guards: [
      { name: 'Russell Westbrook', status: 'core' },
      { name: 'Zach LaVine', status: 'core' },
      { name: 'De\'Andre Hunter' },
      { name: 'Malik Monk' },
      { name: 'Nique Clifford' },
      { name: 'Daeqwon Plowden' },
      { name: 'Devin Carter' },
      { name: 'Killian Hayes' },
    ],
    wingsForwards: [
      { name: 'DeMar DeRozan', status: 'core' },
      { name: 'Keegan Murray', status: 'core' },
      { name: 'Precious Achiuwa' },
      { name: 'Doug McDermott' },
    ],
    bigs: [
      { name: 'Domantas Sabonis', status: 'core' },
      { name: 'Maxime Raynaud' },
      { name: 'Dylan Cardwell' },
      { name: 'Drew Eubanks' },
    ],
  },
  SAS: {
    guards: [
      { name: 'Stephon Castle', status: 'core' },
      { name: 'De\'Aaron Fox', status: 'core' },
      { name: 'Devin Vassell', status: 'core' },
      { name: 'Dylan Harper' },
      { name: 'Keldon Johnson' },
    ],
    wingsForwards: [
      { name: 'Julian Champagnie' },
      { name: 'Harrison Barnes' },
    ],
    bigs: [
      { name: 'Victor Wembanyama', status: 'core' },
      { name: 'Luke Kornet' },
    ],
  },
  TOR: {
    guards: [
      { name: 'Scottie Barnes', status: 'core' },
      { name: 'Immanuel Quickley', status: 'core' },
      { name: 'RJ Barrett', status: 'core' },
      { name: 'Jamal Shead' },
      { name: 'Ja\'Kobe Walter' },
    ],
    wingsForwards: [
      { name: 'Brandon Ingram', status: 'core' },
      { name: 'Collin Murray-Boyles' },
      { name: 'Gradey Dick' },
    ],
    bigs: [
      { name: 'Jakob Poeltl' },
      { name: 'Sandro Mamukelashvili' },
    ],
  },
  UTA: {
    guards: [
      { name: 'Keyonte George', status: 'core' },
      { name: 'Isaiah Collier', status: 'core' },
      { name: 'Bez Mbeng', status: 'core' },
      { name: 'Vince Williams Jr.' },
      { name: 'Elijah Harkless' },
      { name: 'John Konchar' },
    ],
    wingsForwards: [
      { name: 'Ace Bailey' },
      { name: 'Brice Sensabaugh' },
      { name: 'Blake Hinson' },
      { name: 'Svi Mykhailiuk' },
      { name: 'Cody Williams' },
    ],
    bigs: [
      { name: 'Lauri Markkanen', status: 'core' },
      { name: 'Jaren Jackson Jr.', status: 'core' },
      { name: 'Jusuf Nurkić', status: 'core' },
      { name: 'Kyle Filipowski' },
      { name: 'Kevin Love' },
      { name: 'Oscar Tshiebwe' },
    ],
  },
  WAS: {
    guards: [
      { name: 'Trae Young', status: 'core' },
      { name: 'Bub Carrington', status: 'core' },
      { name: 'Tre Johnson', status: 'core' },
      { name: 'Bilal Coulibaly' },
      { name: 'Sharife Cooper' },
      { name: 'Jaden Hardy' },
      { name: 'D\'Angelo Russell', status: 'uncertain', note: 'Futuro incerto' },
    ],
    wingsForwards: [
      { name: 'Anthony Davis', status: 'core' },
      { name: 'Kyshawn George', status: 'core' },
      { name: 'Will Riley' },
      { name: 'Cam Whitmore' },
      { name: 'Jamir Watkins' },
      { name: 'Leaky Black' },
      { name: 'Justin Champagnie' },
      { name: 'Anthony Gill' },
      { name: 'Tristan Vukcevic' },
    ],
    bigs: [
      { name: 'Alex Sarr', status: 'core' },
    ],
  },
};

export function getManualRosterOverride(teamId?: string | null) {
  if (!teamId) return null;
  return manualRosterOverrides[String(teamId).toUpperCase()] || null;
}

export function hasManualRosterOverride(teamId?: string | null) {
  const override = getManualRosterOverride(teamId);
  if (!override) return false;
  return Boolean(
    override.guards.length ||
    override.wingsForwards.length ||
    override.bigs.length
  );
}

export function normalizeManualRosterOverride(override?: ManualRosterOverride | null) {
  if (!override) return null;

  const seen = new Set<string>();
  const take = (players: ManualRosterPlayer[] = []) => {
    const deduped = players.filter(player => {
      const key = player.name.trim().toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    }).map(player => ({
      ...player,
      status: player.status || 'normal',
    }));

    return sortRosterPlayersByStatus(deduped);
  };

  return {
    guards: take(override.guards),
    wingsForwards: take(override.wingsForwards),
    bigs: take(override.bigs),
  };
}
