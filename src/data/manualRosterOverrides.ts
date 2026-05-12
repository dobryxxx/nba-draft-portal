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
  guards?: ManualRosterPlayer[];
  wingsForwards?: ManualRosterPlayer[];
  bigs?: ManualRosterPlayer[];
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
      { name: 'Derrick White', status: 'core' },
      { name: 'Payton Pritchard', status: 'core' },
      { name: 'Baylor Scheierman' },
      { name: 'Jordan Walsh' },
      { name: 'Hugo González' },
    ],
    wingsForwards: [
      { name: 'Jaylen Brown', status: 'core' },
      { name: 'Jayson Tatum', status: 'core' },
      { name: 'Sam Hauser' },
    ],
    bigs: [
      { name: 'Nikola Vučević', status: 'uncertain' },
      { name: 'Neemias Queta', status: 'core' },
      { name: 'Luka Garza' },
    ],
  },
  BKN: {
    guards: [
      { name: 'Egor Dëmin', status: 'core' },
      { name: 'Nolan Traore' },
      { name: 'Ben Saraf' },
      { name: 'Drake Powell' },
    ],
    wingsForwards: [
      { name: 'Michael Porter Jr.', status: 'core' },
      { name: 'Danny Wolf' },
      { name: 'Terance Mann' },
      { name: 'Ziaire Williams' },
      { name: 'Josh Minott' },
    ],
    bigs: [
      { name: 'Nic Claxton' },
      { name: 'Noah Clowney', status: 'core' },
      { name: 'Day\'Ron Sharpe' },
    ],
  },
  CHA: {
    guards: [
      { name: 'LaMelo Ball', status: 'core' },
      { name: 'Kon Knueppel', status: 'core' },
      { name: 'Coby White', status: 'uncertain' },
      { name: 'Sion James' },
      { name: 'Josh Green' },
      { name: 'Liam McNeeley'},
    ],
    wingsForwards: [
      { name: 'Brandon Miller', status: 'core' },
      { name: 'Miles Bridges', status: 'core' },
      { name: 'Grant Williams' },
      { name: 'Tidjane Salaün' },
    ],
    bigs: [
      { name: 'Ryan Kalkbrenner' },
      { name: 'Moussa Diabaté', status: 'core' },
    ],
  },
  CHI: {
    guards: [
      { name: 'Josh Giddey', status: 'core' },
      { name: 'Tre Jones' },
      { name: 'Isaac Okoro' },
      { name: 'Rob Dillingham' },
    ],
    wingsForwards: [
      { name: 'Matas Buzelis', status: 'core' },
      { name: 'Noa Essengue' },
      { name: 'Patrick Williams' },
      { name: 'Leonard Miller' },
    ],
    bigs: [
      { name: 'Jalen Smith' },
    ],
  },
  CLE: {
    guards: [
      { name: 'Donovan Mitchell', status: 'core' },
      { name: 'James Harden', status: 'core' },
      { name: 'Sam Merrill' },
      { name: 'Dennis Schröder' },
      { name: 'Craig Porter Jr.' },
      { name: 'Keon Ellis' },
    ],
    wingsForwards: [
      { name: 'Jaylon Tyson' },
      { name: 'Nae\'Qwan Tomlin' },
      { name: 'Dean Wade' },
      { name: 'Max Strus', status: 'core'},
    ],
    bigs: [
      { name: 'Evan Mobley', status: 'core' },
      { name: 'Jarrett Allen', status: 'core' },
    ],
  },
  DAL: {
    guards: [
      { name: 'Max Christie' },
      { name: 'Ryan Nembhard' },
      { name: 'Kyrie Irving', status: 'injured', note: 'Lesionado' },
    ],
    wingsForwards: [
      { name: 'Cooper Flagg', status: 'core' },
      { name: 'P.J. Washington', status: 'core' },
      { name: 'Naji Marshall' },
      { name: 'Caleb Martin' },
      { name: 'Klay Thompson', status: 'uncertain', note: 'Futuro incerto' },
    ],
    bigs: [
      { name: 'Dereck Lively II', status: 'core' },
      { name: 'Daniel Gafford' },
      { name: 'Dwight Powell' },
    ],
  },
  DEN: {
    guards: [
      { name: 'Jamal Murray', status: 'core' },
      { name: 'Christian Braun', status: 'core' },
      { name: 'Julian Strawther' },
      { name: 'Jalen Pickett' },
    ],
    wingsForwards: [
      { name: 'Aaron Gordon', status: 'core' },
      { name: 'Cameron Johnson', status: 'core' },
      { name: 'Peyton Watson', status: 'core' },
      { name: 'Spencer Jones' },
    ],
    bigs: [
      { name: 'Nikola Jokić', status: 'core' },
      { name: 'Jonas Valančiūnas', },
    ],
  },
  DET: {
    guards: [
      { name: 'Cade Cunningham', status: 'core' },
      { name: 'Daniss Jenkins' },
      { name: 'Caris LeVert' },
    ],
    wingsForwards: [
      { name: 'Tobias Harris' },
      { name: 'Ausar Thompson', status: 'core'},
      { name: 'Duncan Robinson' },
      { name: 'Ron Holland II' },
    ],
    bigs: [
      { name: 'Jalen Duren', status: 'core' },
      { name: 'Isaiah Stewart' },
      { name: 'Paul Reed' },
    ],
  },
  GSW: {
    guards: [
      { name: 'Stephen Curry', status: 'core' },
      { name: 'Brandin Podziemski' },
      { name: 'De\'Anthony Melton' },
      { name: 'Moses Moody' },
      { name: 'Pat Spencer' },
      { name: 'Will Richard' },
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
      { name: 'Fred VanVleet', status: 'core'},
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
      { name: 'Clint Capela' },
    ],
  },
  IND: {
    guards: [
      { name: 'Tyrese Haliburton', status: 'core' },
      { name: 'Andrew Nembhard', status: 'core' },
      { name: 'T.J. McConnell' },
      { name: 'Quenton Jackson' },
      { name: 'Johnny Furphy' },
      { name: 'Kam Jones' },
    ],
    wingsForwards: [
      { name: 'Pascal Siakam', status: 'core' },
      { name: 'Aaron Nesmith', status: 'core' },
      { name: 'Ben Sheppard' },
      { name: 'Jarace Walker' },
      { name: 'Obi Toppin' },
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
      { name: 'Bennedict Mathurin' },
      { name: 'Kris Dunn' },
      { name: 'Jordan Miller' },
      { name: 'Bogdan Bogdanović' },
      { name: 'Kobe Sanders' },
    ],
    wingsForwards: [
      { name: 'Kawhi Leonard', status: 'uncertain' },
      { name: 'Derrick Jones Jr.' },
      { name: 'Isaiah Jackson' },
      { name: 'Nicolas Batum' },
    ],
    bigs: [
      { name: 'Brook Lopez' },
    ],
  },
  LAL: {
    guards: [
      { name: 'Luka Dončić', status: 'core' },
      { name: 'Austin Reaves', status: 'core' },
      { name: 'Marcus Smart' },
    ],
    wingsForwards: [
      { name: 'LeBron James', status: 'uncertain' },
      { name: 'Rui Hachimura', status: 'uncertain' },
      { name: 'Jake LaRavia' },
      { name: 'Jarred Vanderbilt' },
    ],
    bigs: [
      { name: 'Deandre Ayton' },
    ],
  },
  MEM: {
    guards: [
      { name: 'Ja Morant', status: 'uncertain' },
      { name: 'Ty Jerome' },
      { name: 'Cedric Coward', status: 'core' },
      { name: 'Cam Spencer' },
      { name: 'Javon Small' },
      { name: 'Kentavious Caldwell-Pope' },
      { name: 'Walter Clayton Jr.' },
    ],
    wingsForwards: [
      { name: 'Jaylen Wells', status: 'core' },
      { name: 'GG Jackson' },
      { name: 'Olivier-Maxence Prosper' },
      { name: 'Taylor Hendricks' },
      { name: 'Santi Aldama' },
    ],
    bigs: [
      { name: 'Brandon Clarke' },
      { name: 'Zach Edey', status: 'core' },
    ],
  },
  MIA: {
    guards: [
      { name: 'Tyler Herro', status: 'core' },
      { name: 'Norman Powell', status: 'uncertain' },
      { name: 'Davion Mitchell', status: 'core' },
      { name: 'Pelle Larsson' },
      { name: 'Kasparas Jakučionis' },
      { name: 'Dru Smith' },
    ],
    wingsForwards: [
      { name: 'Andrew Wiggins', status: 'core' },
      { name: 'Jaime Jaquez Jr' },
      { name: 'Nikola Jović' },
    ],
    bigs: [
      { name: 'Bam Adebayo', status: 'core' },
      { name: 'Kel\'el Ware', status: 'core' },
    ],
  },
  MIL: {
    guards: [
      { name: 'Kevin Porter Jr.' },
      { name: 'Ryan Rollins', status: 'core' },
      { name: 'AJ Green'},
      { name: 'Gary Trent Jr.' },
      { name: 'Gary Harris' },
    ],
    wingsForwards: [
      { name: 'Giannis Antetokounmpo', status: 'uncertain' },
      { name: 'Kyle Kuzma' },
      { name: 'Bobby Portis' },
      { name: 'Taurean Prince' },
      { name: 'Ousmane Dieng' },
    ],
    bigs: [
      { name: 'Myles Turner' },
      { name: 'Jericho Sims' },
    ],
  },
  MIN: {
    guards: [
      { name: 'Anthony Edwards', status: 'core' },
      { name: 'Donte DiVincenzo', status: 'injured' },
      { name: 'Ayo Dosunmu', status: 'uncertain' },
      { name: 'Terrence Shannon Jr.' },
      { name: 'Jaylen Clark' },
    ],
    wingsForwards: [
      { name: 'Jaden McDaniels', status: 'core' },
      { name: 'Julius Randle', status: 'core' },
    ],
    bigs: [
      { name: 'Rudy Gobert', status: 'core' },
      { name: 'Naz Reid' },
      { name: 'Joan Beringer' },
    ],
  },
  NOP: {
    guards: [
      { name: 'Dejounte Murray', status: 'core' },
      { name: 'Jeremiah Fears' },
      { name: 'Jordan Poole' },
      { name: 'Jordan Hawkins' },
    ],
    wingsForwards: [
      { name: 'Trey Murphy III', status: 'core' },
      { name: 'Zion Williamson', status: 'core' },
      { name: 'Saddiq Bey' },
      { name: 'Herbert Jones', status: 'core' },
      { name: 'Micah Peavy' },
    ],
    bigs: [
      { name: 'Derik Queen', status: 'core' },
      { name: 'Yves Missi' },
      { name: 'Kevon Looney' },
    ],
  },
  NYK: {
    guards: [
      { name: 'Jalen Brunson', status: 'core' },
      { name: 'Josh Hart', status: 'core' },
      { name: 'Miles McBride' },
      { name: 'Jose Alvarado' },
    ],
    wingsForwards: [
      { name: 'Mikal Bridges', status: 'core' },
      { name: 'OG Anunoby', status: 'core' },
    ],
    bigs: [
      { name: 'Karl-Anthony Towns', status: 'core' },
      { name: 'Mitchell Robinson', status: 'uncertain' },
    ],
  },
  OKC: {
    guards: [
      { name: 'Shai Gilgeous-Alexander', status: 'core' },
      { name: 'Ajay Mitchell' },
      { name: 'Cason Wallace' },
      { name: 'Isaiah Joe' },
      { name: 'Aaron Wiggins' },
      { name: 'Alex Caruso', status: 'core' },
      { name: 'Jared McCain' },
    ],
    wingsForwards: [
      { name: 'Jalen Williams', status: 'core' },
      { name: 'Kenrich Williams' },
      { name: 'Luguentz Dort' },
    ],
    bigs: [
      { name: 'Chet Holmgren', status: 'core' },
      { name: 'Isaiah Hartenstein', status: 'core' },
      { name: 'Jaylin Williams' },
    ],
  },
  ORL: {
    guards: [
      { name: 'Desmond Bane', status: 'core' },
      { name: 'Jalen Suggs', status: 'core' },
      { name: 'Anthony Black', status: 'core' },
      { name: 'Jase Richardson' },
    ],
    wingsForwards: [
      { name: 'Paolo Banchero', status: 'core' },
      { name: 'Franz Wagner', status: 'core' },
      { name: 'Tristan da Silva' },
      { name: 'Jonathan Isaac' },
      { name: 'Noah Penda' },
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
      { name: 'Quentin Grimes', status: 'uncertain' },
    ],
    wingsForwards: [
      { name: 'Paul George', status: 'core' },
      { name: 'Kelly Oubre Jr.', status: 'uncertain' },
      { name: 'Dominick Barlow' },
      { name: 'Trendon Watford' },
      { name: 'Justin Edwards' },
    ],
    bigs: [
      { name: 'Joel Embiid', status: 'core' },
      { name: 'Adem Bona' },
      { name: 'Andre Drummond' },
    ],
  },
  PHX: {
    guards: [
      { name: 'Devin Booker', status: 'core' },
      { name: 'Jalen Green', status: 'core' },
      { name: 'Grayson Allen' },
      { name: 'Collin Gillespie', status: 'uncertain' },
    ],
    wingsForwards: [
      { name: 'Dillon Brooks', status: 'core' },
      { name: 'Royce O\'Neale' },
      { name: 'Oso Ighodaro' },
      { name: 'Ryan Dunn' },
      { name: 'Rasheer Fleming' }
    ],
    bigs: [
      { name: 'Mark Williams' },
      { name: 'Khaman Maluach' },
    ],
  },
  POR: {
    guards: [
      { name: 'Jrue Holiday', status: 'core' },
      { name: 'Damian Lillard', status: 'core' },
      { name: 'Shaedon Sharpe' },
      { name: 'Scoot Henderson' },
      { name: 'Vít Krejčí' },
      { name: 'Sidy Cissoko' },
    ],
    wingsForwards: [
      { name: 'Deni Avdija', status: 'core' },
      { name: 'Jerami Grant' },
      { name: 'Toumani Camara', status: 'core' },
      { name: 'Kris Murray' },
    ],
    bigs: [
      { name: 'Donovan Clingan', status: 'core' },
      { name: 'Robert Williams III' },
      { name: 'Yang Hansen' },
    ],
  },
  SAC: {
    guards: [
      { name: 'Russell Westbrook' },
      { name: 'Zach LaVine' },
      { name: 'Malik Monk' },
      { name: 'Nique Clifford' },
      { name: 'Devin Carter' },
      { name: 'Killian Hayes' },
    ],
    wingsForwards: [
      { name: 'DeMar DeRozan' },
      { name: 'Keegan Murray', status: 'core' },
      { name: 'De\'Andre Hunter' },
    ],
    bigs: [
      { name: 'Domantas Sabonis', status: 'core' },
      { name: 'Maxime Raynaud' },
      { name: 'Dylan Cardwell' },
    ],
  },
  SAS: {
    guards: [
      { name: 'Stephon Castle', status: 'core' },
      { name: 'De\'Aaron Fox', status: 'core' },
      { name: 'Devin Vassell', status: 'core' },
      { name: 'Dylan Harper', status: 'core' },
    ],
    wingsForwards: [
      { name: 'Julian Champagnie' },
      { name: 'Harrison Barnes' },
      { name: 'Keldon Johnson' },
    ],
    bigs: [
      { name: 'Victor Wembanyama', status: 'core' },
      { name: 'Luke Kornet' },
    ],
  },
  TOR: {
    guards: [
      { name: 'Immanuel Quickley', status: 'core' },
      { name: 'RJ Barrett', status: 'core' },
      { name: 'Jamal Shead' },
      { name: 'Ja\'Kobe Walter' },
      { name: 'Gradey Dick' },
    ],
    wingsForwards: [
      { name: 'Brandon Ingram', status: 'core' },
      { name: 'Scottie Barnes', status: 'core' },
      { name: 'Collin Murray-Boyles' },
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
      { name: 'Vince Williams Jr.' },
      { name: 'John Konchar' },
    ],
    wingsForwards: [
      { name: 'Lauri Markkanen', status: 'core' },
      { name: 'Jaren Jackson Jr.', status: 'core' },
      { name: 'Ace Bailey' },
      { name: 'Brice Sensabaugh' },
      { name: 'Svi Mykhailiuk' },
      { name: 'Cody Williams' },
    ],
    bigs: [
      { name: 'Jusuf Nurkić', status: 'uncertain' },
      { name: 'Walker Kessler', status: 'core' },
      { name: 'Kyle Filipowski' },
    ],
  },
  WAS: {
    guards: [
      { name: 'Trae Young', status: 'core' },
      { name: 'Bub Carrington' },
      { name: 'Tre Johnson' },
      { name: 'D\'Angelo Russell', status: 'uncertain', note: 'Futuro incerto' },
    ],
    wingsForwards: [
      { name: 'Bilal Coulibaly', status: 'core' },
      { name: 'Kyshawn George', status: 'core' },
      { name: 'Will Riley' },
      { name: 'Cam Whitmore' },
      { name: 'Jamir Watkins' },
      { name: 'Justin Champagnie' },
    ],
    bigs: [
      { name: 'Alex Sarr', status: 'core' },
      { name: 'Anthony Davis', status: 'core' },
      { name: 'Tristan Vukcevic' },
    ],
  },
};

export function getManualRosterOverride(teamId?: string | null) {
  if (!teamId) return null;
  return manualRosterOverrides[String(teamId).trim().toUpperCase()] || null;
}

export function hasManualRosterOverride(teamId?: string | null) {
  return Boolean(getManualRosterOverride(teamId));
}

export function normalizeManualRosterOverride(override?: ManualRosterOverride | null) {
  if (!override) return null;

  const seen = new Set<string>();
  const take = (players: ManualRosterPlayer[] = []) => {
    const deduped = (players || []).filter(player => {
      const key = player?.name?.trim().toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    }).map(player => ({
      ...player,
      name: player.name.trim(),
      status: rosterStatusPriority[player.status || 'normal'] === undefined ? 'normal' : player.status || 'normal',
    }));

    return sortRosterPlayersByStatus(deduped);
  };

  return {
    guards: take(override.guards || []),
    wingsForwards: take(override.wingsForwards || []),
    bigs: take(override.bigs || []),
  };
}
