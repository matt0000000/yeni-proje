import type { League, Player, ValuePoint } from "./types";

function makeHistory(current: number, trend: "up" | "down" | "stable"): ValuePoint[] {
  const points: ValuePoint[] = [];
  const months = ["2023-06", "2023-09", "2023-12", "2024-03", "2024-06", "2024-09", "2024-12", "2025-03", "2025-06"];
  let val = trend === "up" ? current * 0.55 : trend === "down" ? current * 1.45 : current * 0.95;
  for (let i = 0; i < months.length - 1; i++) {
    const noise = (Math.random() - 0.5) * 0.08 * val;
    val += noise;
    if (trend === "up") val += current * 0.05;
    if (trend === "down") val -= current * 0.05;
    points.push({ date: months[i], value: Math.max(val, 500_000) });
  }
  points.push({ date: "2025-06", value: current });
  return points;
}

const premierLeaguePlayers: Omit<Player, "leagueId" | "leagueName" | "leagueSlug">[] = [
  // Arsenal
  { id: "p001", slug: "bukayo-saka", name: "Bukayo Saka", nationality: "England", nationalityCode: "GB-ENG", position: "Right Winger", positionGroup: "Forward", age: 23, height: "178cm", foot: "Left", currentValue: 180_000_000, valueTrend: "up", contractExpiry: "2027", shirtNumber: 7, clubId: "c001", clubName: "Arsenal", clubSlug: "arsenal", clubLogo: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg", valueHistory: [] },
  { id: "p002", slug: "martin-odegaard", name: "Martin Ødegaard", nationality: "Norway", nationalityCode: "NO", position: "Attacking Midfielder", positionGroup: "Midfielder", age: 26, height: "178cm", foot: "Right", currentValue: 130_000_000, valueTrend: "stable", contractExpiry: "2028", shirtNumber: 8, clubId: "c001", clubName: "Arsenal", clubSlug: "arsenal", clubLogo: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg", valueHistory: [] },
  { id: "p003", slug: "declan-rice", name: "Declan Rice", nationality: "England", nationalityCode: "GB-ENG", position: "Central Midfielder", positionGroup: "Midfielder", age: 26, height: "185cm", foot: "Right", currentValue: 120_000_000, valueTrend: "up", contractExpiry: "2028", shirtNumber: 41, clubId: "c001", clubName: "Arsenal", clubSlug: "arsenal", clubLogo: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg", valueHistory: [] },
  { id: "p004", slug: "gabriel-magalhaes", name: "Gabriel Magalhães", nationality: "Brazil", nationalityCode: "BR", position: "Centre-Back", positionGroup: "Defender", age: 27, height: "190cm", foot: "Left", currentValue: 90_000_000, valueTrend: "up", contractExpiry: "2027", shirtNumber: 6, clubId: "c001", clubName: "Arsenal", clubSlug: "arsenal", clubLogo: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg", valueHistory: [] },
  { id: "p005", slug: "david-raya", name: "David Raya", nationality: "Spain", nationalityCode: "ES", position: "Goalkeeper", positionGroup: "Goalkeeper", age: 29, height: "183cm", foot: "Right", currentValue: 55_000_000, valueTrend: "up", contractExpiry: "2028", shirtNumber: 22, clubId: "c001", clubName: "Arsenal", clubSlug: "arsenal", clubLogo: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg", valueHistory: [] },
  // Man City
  { id: "p006", slug: "erling-haaland", name: "Erling Haaland", nationality: "Norway", nationalityCode: "NO", position: "Centre-Forward", positionGroup: "Forward", age: 24, height: "194cm", foot: "Left", currentValue: 200_000_000, valueTrend: "stable", contractExpiry: "2034", shirtNumber: 9, clubId: "c002", clubName: "Manchester City", clubSlug: "manchester-city", clubLogo: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg", valueHistory: [] },
  { id: "p007", slug: "phil-foden", name: "Phil Foden", nationality: "England", nationalityCode: "GB-ENG", position: "Attacking Midfielder", positionGroup: "Midfielder", age: 25, height: "171cm", foot: "Left", currentValue: 170_000_000, valueTrend: "up", contractExpiry: "2027", shirtNumber: 47, clubId: "c002", clubName: "Manchester City", clubSlug: "manchester-city", clubLogo: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg", valueHistory: [] },
  { id: "p008", slug: "rodri", name: "Rodri", nationality: "Spain", nationalityCode: "ES", position: "Defensive Midfielder", positionGroup: "Midfielder", age: 28, height: "191cm", foot: "Right", currentValue: 150_000_000, valueTrend: "stable", contractExpiry: "2027", shirtNumber: 16, clubId: "c002", clubName: "Manchester City", clubSlug: "manchester-city", clubLogo: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg", valueHistory: [] },
  { id: "p009", slug: "ruben-dias", name: "Rúben Dias", nationality: "Portugal", nationalityCode: "PT", position: "Centre-Back", positionGroup: "Defender", age: 27, height: "187cm", foot: "Right", currentValue: 90_000_000, valueTrend: "stable", contractExpiry: "2027", shirtNumber: 3, clubId: "c002", clubName: "Manchester City", clubSlug: "manchester-city", clubLogo: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg", valueHistory: [] },
  { id: "p010", slug: "ederson", name: "Ederson", nationality: "Brazil", nationalityCode: "BR", position: "Goalkeeper", positionGroup: "Goalkeeper", age: 31, height: "188cm", foot: "Right", currentValue: 50_000_000, valueTrend: "down", contractExpiry: "2026", shirtNumber: 31, clubId: "c002", clubName: "Manchester City", clubSlug: "manchester-city", clubLogo: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg", valueHistory: [] },
  // Liverpool
  { id: "p011", slug: "mo-salah", name: "Mohamed Salah", nationality: "Egypt", nationalityCode: "EG", position: "Right Winger", positionGroup: "Forward", age: 32, height: "175cm", foot: "Left", currentValue: 60_000_000, valueTrend: "down", contractExpiry: "2025", shirtNumber: 11, clubId: "c003", clubName: "Liverpool", clubSlug: "liverpool", clubLogo: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg", valueHistory: [] },
  { id: "p012", slug: "trent-alexander-arnold", name: "Trent Alexander-Arnold", nationality: "England", nationalityCode: "GB-ENG", position: "Right-Back", positionGroup: "Defender", age: 26, height: "175cm", foot: "Right", currentValue: 80_000_000, valueTrend: "stable", contractExpiry: "2025", shirtNumber: 66, clubId: "c003", clubName: "Liverpool", clubSlug: "liverpool", clubLogo: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg", valueHistory: [] },
  { id: "p013", slug: "virgil-van-dijk", name: "Virgil van Dijk", nationality: "Netherlands", nationalityCode: "NL", position: "Centre-Back", positionGroup: "Defender", age: 33, height: "193cm", foot: "Right", currentValue: 50_000_000, valueTrend: "down", contractExpiry: "2025", shirtNumber: 4, clubId: "c003", clubName: "Liverpool", clubSlug: "liverpool", clubLogo: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg", valueHistory: [] },
  { id: "p014", slug: "alexis-mac-allister", name: "Alexis Mac Allister", nationality: "Argentina", nationalityCode: "AR", position: "Central Midfielder", positionGroup: "Midfielder", age: 25, height: "174cm", foot: "Right", currentValue: 85_000_000, valueTrend: "up", contractExpiry: "2028", shirtNumber: 10, clubId: "c003", clubName: "Liverpool", clubSlug: "liverpool", clubLogo: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg", valueHistory: [] },
  { id: "p015", slug: "darwin-nunez", name: "Darwin Núñez", nationality: "Uruguay", nationalityCode: "UY", position: "Centre-Forward", positionGroup: "Forward", age: 25, height: "187cm", foot: "Right", currentValue: 75_000_000, valueTrend: "stable", contractExpiry: "2028", shirtNumber: 9, clubId: "c003", clubName: "Liverpool", clubSlug: "liverpool", clubLogo: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg", valueHistory: [] },
  // Chelsea
  { id: "p016", slug: "cole-palmer", name: "Cole Palmer", nationality: "England", nationalityCode: "GB-ENG", position: "Attacking Midfielder", positionGroup: "Midfielder", age: 22, height: "185cm", foot: "Right", currentValue: 150_000_000, valueTrend: "up", contractExpiry: "2033", shirtNumber: 20, clubId: "c004", clubName: "Chelsea", clubSlug: "chelsea", clubLogo: "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg", valueHistory: [] },
  { id: "p017", slug: "reece-james", name: "Reece James", nationality: "England", nationalityCode: "GB-ENG", position: "Right-Back", positionGroup: "Defender", age: 25, height: "180cm", foot: "Right", currentValue: 70_000_000, valueTrend: "down", contractExpiry: "2031", shirtNumber: 24, clubId: "c004", clubName: "Chelsea", clubSlug: "chelsea", clubLogo: "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg", valueHistory: [] },
  { id: "p018", slug: "enzo-fernandez", name: "Enzo Fernández", nationality: "Argentina", nationalityCode: "AR", position: "Central Midfielder", positionGroup: "Midfielder", age: 24, height: "178cm", foot: "Right", currentValue: 90_000_000, valueTrend: "stable", contractExpiry: "2031", shirtNumber: 8, clubId: "c004", clubName: "Chelsea", clubSlug: "chelsea", clubLogo: "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg", valueHistory: [] },
  // Spurs
  { id: "p019", slug: "heung-min-son", name: "Heung-min Son", nationality: "South Korea", nationalityCode: "KR", position: "Left Winger", positionGroup: "Forward", age: 32, height: "183cm", foot: "Left", currentValue: 45_000_000, valueTrend: "down", contractExpiry: "2025", shirtNumber: 7, clubId: "c005", clubName: "Tottenham Hotspur", clubSlug: "tottenham-hotspur", clubLogo: "https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg", valueHistory: [] },
  { id: "p020", slug: "james-maddison", name: "James Maddison", nationality: "England", nationalityCode: "GB-ENG", position: "Attacking Midfielder", positionGroup: "Midfielder", age: 28, height: "175cm", foot: "Right", currentValue: 70_000_000, valueTrend: "stable", contractExpiry: "2028", shirtNumber: 10, clubId: "c005", clubName: "Tottenham Hotspur", clubSlug: "tottenham-hotspur", clubLogo: "https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg", valueHistory: [] },
];

const laLigaPlayers: Omit<Player, "leagueId" | "leagueName" | "leagueSlug">[] = [
  // Real Madrid
  { id: "p101", slug: "vinicius-jr", name: "Vinícius Jr.", nationality: "Brazil", nationalityCode: "BR", position: "Left Winger", positionGroup: "Forward", age: 24, height: "176cm", foot: "Right", currentValue: 200_000_000, valueTrend: "up", contractExpiry: "2027", shirtNumber: 7, clubId: "c101", clubName: "Real Madrid", clubSlug: "real-madrid", clubLogo: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg", valueHistory: [] },
  { id: "p102", slug: "jude-bellingham", name: "Jude Bellingham", nationality: "England", nationalityCode: "GB-ENG", position: "Attacking Midfielder", positionGroup: "Midfielder", age: 21, height: "186cm", foot: "Right", currentValue: 200_000_000, valueTrend: "up", contractExpiry: "2029", shirtNumber: 5, clubId: "c101", clubName: "Real Madrid", clubSlug: "real-madrid", clubLogo: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg", valueHistory: [] },
  { id: "p103", slug: "kylian-mbappe", name: "Kylian Mbappé", nationality: "France", nationalityCode: "FR", position: "Centre-Forward", positionGroup: "Forward", age: 26, height: "178cm", foot: "Right", currentValue: 180_000_000, valueTrend: "stable", contractExpiry: "2029", shirtNumber: 9, clubId: "c101", clubName: "Real Madrid", clubSlug: "real-madrid", clubLogo: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg", valueHistory: [] },
  { id: "p104", slug: "toni-kroos", name: "Toni Kroos", nationality: "Germany", nationalityCode: "DE", position: "Central Midfielder", positionGroup: "Midfielder", age: 35, height: "183cm", foot: "Right", currentValue: 15_000_000, valueTrend: "down", contractExpiry: "2025", shirtNumber: 8, clubId: "c101", clubName: "Real Madrid", clubSlug: "real-madrid", clubLogo: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg", valueHistory: [] },
  { id: "p105", slug: "aurelien-tchouameni", name: "Aurélien Tchouaméni", nationality: "France", nationalityCode: "FR", position: "Defensive Midfielder", positionGroup: "Midfielder", age: 24, height: "187cm", foot: "Right", currentValue: 100_000_000, valueTrend: "stable", contractExpiry: "2028", shirtNumber: 18, clubId: "c101", clubName: "Real Madrid", clubSlug: "real-madrid", clubLogo: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg", valueHistory: [] },
  // Barcelona
  { id: "p106", slug: "pedri", name: "Pedri", nationality: "Spain", nationalityCode: "ES", position: "Central Midfielder", positionGroup: "Midfielder", age: 22, height: "174cm", foot: "Right", currentValue: 120_000_000, valueTrend: "up", contractExpiry: "2026", shirtNumber: 8, clubId: "c102", clubName: "FC Barcelona", clubSlug: "barcelona", clubLogo: "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg", valueHistory: [] },
  { id: "p107", slug: "gavi", name: "Gavi", nationality: "Spain", nationalityCode: "ES", position: "Central Midfielder", positionGroup: "Midfielder", age: 20, height: "173cm", foot: "Right", currentValue: 110_000_000, valueTrend: "up", contractExpiry: "2026", shirtNumber: 6, clubId: "c102", clubName: "FC Barcelona", clubSlug: "barcelona", clubLogo: "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg", valueHistory: [] },
  { id: "p108", slug: "lamine-yamal", name: "Lamine Yamal", nationality: "Spain", nationalityCode: "ES", position: "Right Winger", positionGroup: "Forward", age: 17, height: "180cm", foot: "Right", currentValue: 180_000_000, valueTrend: "up", contractExpiry: "2027", shirtNumber: 19, clubId: "c102", clubName: "FC Barcelona", clubSlug: "barcelona", clubLogo: "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg", valueHistory: [] },
  { id: "p109", slug: "robert-lewandowski", name: "Robert Lewandowski", nationality: "Poland", nationalityCode: "PL", position: "Centre-Forward", positionGroup: "Forward", age: 36, height: "184cm", foot: "Right", currentValue: 18_000_000, valueTrend: "down", contractExpiry: "2026", shirtNumber: 9, clubId: "c102", clubName: "FC Barcelona", clubSlug: "barcelona", clubLogo: "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg", valueHistory: [] },
  { id: "p110", slug: "frenkie-de-jong", name: "Frenkie de Jong", nationality: "Netherlands", nationalityCode: "NL", position: "Central Midfielder", positionGroup: "Midfielder", age: 27, height: "180cm", foot: "Right", currentValue: 65_000_000, valueTrend: "stable", contractExpiry: "2026", shirtNumber: 21, clubId: "c102", clubName: "FC Barcelona", clubSlug: "barcelona", clubLogo: "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg", valueHistory: [] },
  // Atletico
  { id: "p111", slug: "antoine-griezmann", name: "Antoine Griezmann", nationality: "France", nationalityCode: "FR", position: "Attacking Midfielder", positionGroup: "Forward", age: 33, height: "176cm", foot: "Left", currentValue: 35_000_000, valueTrend: "down", contractExpiry: "2026", shirtNumber: 7, clubId: "c103", clubName: "Atlético Madrid", clubSlug: "atletico-madrid", clubLogo: "https://upload.wikimedia.org/wikipedia/en/f/f4/Atletico_Madrid_2017_logo.svg", valueHistory: [] },
  { id: "p112", slug: "julian-alvarez", name: "Julián Álvarez", nationality: "Argentina", nationalityCode: "AR", position: "Centre-Forward", positionGroup: "Forward", age: 24, height: "170cm", foot: "Right", currentValue: 90_000_000, valueTrend: "up", contractExpiry: "2030", shirtNumber: 19, clubId: "c103", clubName: "Atlético Madrid", clubSlug: "atletico-madrid", clubLogo: "https://upload.wikimedia.org/wikipedia/en/f/f4/Atletico_Madrid_2017_logo.svg", valueHistory: [] },
];

const bundesligaPlayers: Omit<Player, "leagueId" | "leagueName" | "leagueSlug">[] = [
  // Bayern Munich
  { id: "p201", slug: "harry-kane", name: "Harry Kane", nationality: "England", nationalityCode: "GB-ENG", position: "Centre-Forward", positionGroup: "Forward", age: 31, height: "188cm", foot: "Right", currentValue: 100_000_000, valueTrend: "stable", contractExpiry: "2027", shirtNumber: 9, clubId: "c201", clubName: "Bayern München", clubSlug: "bayern-munich", clubLogo: "https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282002%E2%80%932017%29.svg", valueHistory: [] },
  { id: "p202", slug: "jamal-musiala", name: "Jamal Musiala", nationality: "Germany", nationalityCode: "DE", position: "Attacking Midfielder", positionGroup: "Midfielder", age: 21, height: "180cm", foot: "Right", currentValue: 150_000_000, valueTrend: "up", contractExpiry: "2026", shirtNumber: 42, clubId: "c201", clubName: "Bayern München", clubSlug: "bayern-munich", clubLogo: "https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282002%E2%80%932017%29.svg", valueHistory: [] },
  { id: "p203", slug: "leroy-sane", name: "Leroy Sané", nationality: "Germany", nationalityCode: "DE", position: "Right Winger", positionGroup: "Forward", age: 29, height: "183cm", foot: "Left", currentValue: 60_000_000, valueTrend: "down", contractExpiry: "2025", shirtNumber: 10, clubId: "c201", clubName: "Bayern München", clubSlug: "bayern-munich", clubLogo: "https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282002%E2%80%932017%29.svg", valueHistory: [] },
  { id: "p204", slug: "thomas-muller", name: "Thomas Müller", nationality: "Germany", nationalityCode: "DE", position: "Attacking Midfielder", positionGroup: "Midfielder", age: 35, height: "186cm", foot: "Right", currentValue: 8_000_000, valueTrend: "down", contractExpiry: "2025", shirtNumber: 25, clubId: "c201", clubName: "Bayern München", clubSlug: "bayern-munich", clubLogo: "https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282002%E2%80%932017%29.svg", valueHistory: [] },
  // Dortmund
  { id: "p205", slug: "florian-wirtz", name: "Florian Wirtz", nationality: "Germany", nationalityCode: "DE", position: "Attacking Midfielder", positionGroup: "Midfielder", age: 21, height: "176cm", foot: "Right", currentValue: 150_000_000, valueTrend: "up", contractExpiry: "2027", shirtNumber: 10, clubId: "c202", clubName: "Borussia Dortmund", clubSlug: "borussia-dortmund", clubLogo: "https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg", valueHistory: [] },
  { id: "p206", slug: "nico-schlotterbeck", name: "Nico Schlotterbeck", nationality: "Germany", nationalityCode: "DE", position: "Centre-Back", positionGroup: "Defender", age: 25, height: "191cm", foot: "Left", currentValue: 55_000_000, valueTrend: "stable", contractExpiry: "2028", shirtNumber: 4, clubId: "c202", clubName: "Borussia Dortmund", clubSlug: "borussia-dortmund", clubLogo: "https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg", valueHistory: [] },
  { id: "p207", slug: "gregor-kobel", name: "Gregor Kobel", nationality: "Switzerland", nationalityCode: "CH", position: "Goalkeeper", positionGroup: "Goalkeeper", age: 26, height: "194cm", foot: "Right", currentValue: 45_000_000, valueTrend: "up", contractExpiry: "2028", shirtNumber: 1, clubId: "c202", clubName: "Borussia Dortmund", clubSlug: "borussia-dortmund", clubLogo: "https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg", valueHistory: [] },
  // Leverkusen
  { id: "p208", slug: "granit-xhaka-lev", name: "Granit Xhaka", nationality: "Switzerland", nationalityCode: "CH", position: "Central Midfielder", positionGroup: "Midfielder", age: 32, height: "186cm", foot: "Right", currentValue: 30_000_000, valueTrend: "stable", contractExpiry: "2027", shirtNumber: 34, clubId: "c203", clubName: "Bayer Leverkusen", clubSlug: "bayer-leverkusen", clubLogo: "https://upload.wikimedia.org/wikipedia/en/5/59/Bayer_04_Leverkusen_logo.svg", valueHistory: [] },
];

const serieAPlayers: Omit<Player, "leagueId" | "leagueName" | "leagueSlug">[] = [
  // Inter
  { id: "p301", slug: "lautaro-martinez", name: "Lautaro Martínez", nationality: "Argentina", nationalityCode: "AR", position: "Centre-Forward", positionGroup: "Forward", age: 27, height: "174cm", foot: "Right", currentValue: 110_000_000, valueTrend: "up", contractExpiry: "2029", shirtNumber: 10, clubId: "c301", clubName: "Inter Milan", clubSlug: "inter-milan", clubLogo: "https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg", valueHistory: [] },
  { id: "p302", slug: "nicolo-barella", name: "Nicolò Barella", nationality: "Italy", nationalityCode: "IT", position: "Central Midfielder", positionGroup: "Midfielder", age: 27, height: "172cm", foot: "Right", currentValue: 80_000_000, valueTrend: "stable", contractExpiry: "2029", shirtNumber: 23, clubId: "c301", clubName: "Inter Milan", clubSlug: "inter-milan", clubLogo: "https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg", valueHistory: [] },
  { id: "p303", slug: "hakan-calhanoglu", name: "Hakan Çalhanoğlu", nationality: "Turkey", nationalityCode: "TR", position: "Defensive Midfielder", positionGroup: "Midfielder", age: 30, height: "180cm", foot: "Right", currentValue: 50_000_000, valueTrend: "stable", contractExpiry: "2027", shirtNumber: 20, clubId: "c301", clubName: "Inter Milan", clubSlug: "inter-milan", clubLogo: "https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg", valueHistory: [] },
  // Juventus
  { id: "p304", slug: "dusan-vlahovic", name: "Dušan Vlahović", nationality: "Serbia", nationalityCode: "RS", position: "Centre-Forward", positionGroup: "Forward", age: 24, height: "190cm", foot: "Left", currentValue: 80_000_000, valueTrend: "stable", contractExpiry: "2026", shirtNumber: 9, clubId: "c302", clubName: "Juventus", clubSlug: "juventus", clubLogo: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Juventus_FC_2017_icon_%28black%29.svg", valueHistory: [] },
  { id: "p305", slug: "khephren-thuram", name: "Khéphren Thuram", nationality: "France", nationalityCode: "FR", position: "Central Midfielder", positionGroup: "Midfielder", age: 23, height: "190cm", foot: "Right", currentValue: 50_000_000, valueTrend: "up", contractExpiry: "2029", shirtNumber: 19, clubId: "c302", clubName: "Juventus", clubSlug: "juventus", clubLogo: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Juventus_FC_2017_icon_%28black%29.svg", valueHistory: [] },
  // AC Milan
  { id: "p306", slug: "rafael-leao", name: "Rafael Leão", nationality: "Portugal", nationalityCode: "PT", position: "Left Winger", positionGroup: "Forward", age: 25, height: "188cm", foot: "Right", currentValue: 85_000_000, valueTrend: "stable", contractExpiry: "2028", shirtNumber: 10, clubId: "c303", clubName: "AC Milan", clubSlug: "ac-milan", clubLogo: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg", valueHistory: [] },
  { id: "p307", slug: "theo-hernandez", name: "Theo Hernández", nationality: "France", nationalityCode: "FR", position: "Left-Back", positionGroup: "Defender", age: 27, height: "184cm", foot: "Left", currentValue: 70_000_000, valueTrend: "stable", contractExpiry: "2026", shirtNumber: 19, clubId: "c303", clubName: "AC Milan", clubSlug: "ac-milan", clubLogo: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg", valueHistory: [] },
  { id: "p308", slug: "mike-maignan", name: "Mike Maignan", nationality: "France", nationalityCode: "FR", position: "Goalkeeper", positionGroup: "Goalkeeper", age: 29, height: "191cm", foot: "Right", currentValue: 70_000_000, valueTrend: "up", contractExpiry: "2026", shirtNumber: 16, clubId: "c303", clubName: "AC Milan", clubSlug: "ac-milan", clubLogo: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg", valueHistory: [] },
];

const ligue1Players: Omit<Player, "leagueId" | "leagueName" | "leagueSlug">[] = [
  // PSG
  { id: "p401", slug: "ousmane-dembele-psg", name: "Ousmane Dembélé", nationality: "France", nationalityCode: "FR", position: "Right Winger", positionGroup: "Forward", age: 27, height: "178cm", foot: "Right", currentValue: 70_000_000, valueTrend: "up", contractExpiry: "2028", shirtNumber: 10, clubId: "c401", clubName: "Paris Saint-Germain", clubSlug: "psg", clubLogo: "https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg", valueHistory: [] },
  { id: "p402", slug: "bradley-barcola", name: "Bradley Barcola", nationality: "France", nationalityCode: "FR", position: "Left Winger", positionGroup: "Forward", age: 22, height: "182cm", foot: "Left", currentValue: 70_000_000, valueTrend: "up", contractExpiry: "2029", shirtNumber: 29, clubId: "c401", clubName: "Paris Saint-Germain", clubSlug: "psg", clubLogo: "https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg", valueHistory: [] },
  { id: "p403", slug: "vitinha", name: "Vitinha", nationality: "Portugal", nationalityCode: "PT", position: "Central Midfielder", positionGroup: "Midfielder", age: 24, height: "169cm", foot: "Right", currentValue: 65_000_000, valueTrend: "up", contractExpiry: "2028", shirtNumber: 17, clubId: "c401", clubName: "Paris Saint-Germain", clubSlug: "psg", clubLogo: "https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg", valueHistory: [] },
  // Monaco
  { id: "p404", slug: "wissam-ben-yedder", name: "Wissam Ben Yedder", nationality: "France", nationalityCode: "FR", position: "Centre-Forward", positionGroup: "Forward", age: 34, height: "170cm", foot: "Right", currentValue: 12_000_000, valueTrend: "down", contractExpiry: "2026", shirtNumber: 10, clubId: "c402", clubName: "AS Monaco", clubSlug: "monaco", clubLogo: "https://upload.wikimedia.org/wikipedia/en/e/ea/AS_Monaco_FC.svg", valueHistory: [] },
  { id: "p405", slug: "takumi-minamino", name: "Takumi Minamino", nationality: "Japan", nationalityCode: "JP", position: "Attacking Midfielder", positionGroup: "Midfielder", age: 30, height: "172cm", foot: "Right", currentValue: 18_000_000, valueTrend: "stable", contractExpiry: "2026", shirtNumber: 18, clubId: "c402", clubName: "AS Monaco", clubSlug: "monaco", clubLogo: "https://upload.wikimedia.org/wikipedia/en/e/ea/AS_Monaco_FC.svg", valueHistory: [] },
];

const superLigPlayers: Omit<Player, "leagueId" | "leagueName" | "leagueSlug">[] = [
  // Galatasaray
  { id: "p501", slug: "mauro-icardi", name: "Mauro Icardi", nationality: "Argentina", nationalityCode: "AR", position: "Centre-Forward", positionGroup: "Forward", age: 31, height: "181cm", foot: "Right", currentValue: 8_000_000, valueTrend: "down", contractExpiry: "2026", shirtNumber: 9, clubId: "c501", clubName: "Galatasaray", clubSlug: "galatasaray", clubLogo: "https://upload.wikimedia.org/wikipedia/en/f/fd/Galatasaray_Sports_Club_Logo.svg", valueHistory: [] },
  { id: "p502", slug: "dries-mertens", name: "Dries Mertens", nationality: "Belgium", nationalityCode: "BE", position: "Attacking Midfielder", positionGroup: "Forward", age: 37, height: "169cm", foot: "Right", currentValue: 3_000_000, valueTrend: "down", contractExpiry: "2026", shirtNumber: 7, clubId: "c501", clubName: "Galatasaray", clubSlug: "galatasaray", clubLogo: "https://upload.wikimedia.org/wikipedia/en/f/fd/Galatasaray_Sports_Club_Logo.svg", valueHistory: [] },
  { id: "p503", slug: "kerem-akturkoglu", name: "Kerem Aktürkoğlu", nationality: "Turkey", nationalityCode: "TR", position: "Right Winger", positionGroup: "Forward", age: 25, height: "177cm", foot: "Left", currentValue: 20_000_000, valueTrend: "up", contractExpiry: "2027", shirtNumber: 11, clubId: "c501", clubName: "Galatasaray", clubSlug: "galatasaray", clubLogo: "https://upload.wikimedia.org/wikipedia/en/f/fd/Galatasaray_Sports_Club_Logo.svg", valueHistory: [] },
  { id: "p504", slug: "wilfried-zaha", name: "Wilfried Zaha", nationality: "Ivory Coast", nationalityCode: "CI", position: "Left Winger", positionGroup: "Forward", age: 31, height: "179cm", foot: "Right", currentValue: 8_000_000, valueTrend: "stable", contractExpiry: "2026", shirtNumber: 22, clubId: "c501", clubName: "Galatasaray", clubSlug: "galatasaray", clubLogo: "https://upload.wikimedia.org/wikipedia/en/f/fd/Galatasaray_Sports_Club_Logo.svg", valueHistory: [] },
  // Fenerbahce
  { id: "p505", slug: "edin-dzeko", name: "Edin Džeko", nationality: "Bosnia-Herzegovina", nationalityCode: "BA", position: "Centre-Forward", positionGroup: "Forward", age: 38, height: "193cm", foot: "Right", currentValue: 2_500_000, valueTrend: "down", contractExpiry: "2025", shirtNumber: 9, clubId: "c502", clubName: "Fenerbahçe", clubSlug: "fenerbahce", clubLogo: "https://upload.wikimedia.org/wikipedia/en/4/41/Fenerbah%C3%A7e_SK.svg", valueHistory: [] },
  { id: "p506", slug: "michy-batshuayi", name: "Michy Batshuayi", nationality: "Belgium", nationalityCode: "BE", position: "Centre-Forward", positionGroup: "Forward", age: 31, height: "181cm", foot: "Right", currentValue: 6_000_000, valueTrend: "stable", contractExpiry: "2026", shirtNumber: 23, clubId: "c502", clubName: "Fenerbahçe", clubSlug: "fenerbahce", clubLogo: "https://upload.wikimedia.org/wikipedia/en/4/41/Fenerbah%C3%A7e_SK.svg", valueHistory: [] },
  { id: "p507", slug: "irfan-kahveci", name: "İrfan Can Kahveci", nationality: "Turkey", nationalityCode: "TR", position: "Attacking Midfielder", positionGroup: "Midfielder", age: 30, height: "175cm", foot: "Right", currentValue: 6_000_000, valueTrend: "stable", contractExpiry: "2026", shirtNumber: 10, clubId: "c502", clubName: "Fenerbahçe", clubSlug: "fenerbahce", clubLogo: "https://upload.wikimedia.org/wikipedia/en/4/41/Fenerbah%C3%A7e_SK.svg", valueHistory: [] },
  // Besiktas
  { id: "p508", slug: "romain-saiss", name: "Romain Saïss", nationality: "Morocco", nationalityCode: "MA", position: "Centre-Back", positionGroup: "Defender", age: 34, height: "187cm", foot: "Right", currentValue: 2_500_000, valueTrend: "down", contractExpiry: "2025", shirtNumber: 4, clubId: "c503", clubName: "Beşiktaş", clubSlug: "besiktas", clubLogo: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Besiktas_JK_logo.svg", valueHistory: [] },
];

function attachLeague(
  players: Omit<Player, "leagueId" | "leagueName" | "leagueSlug">[],
  leagueId: string,
  leagueName: string,
  leagueSlug: string
): Player[] {
  return players.map((p) => ({
    ...p,
    leagueId,
    leagueName,
    leagueSlug,
    valueHistory: makeHistory(p.currentValue, p.valueTrend),
  }));
}

const plPlayers = attachLeague(premierLeaguePlayers, "l001", "Premier League", "premier-league");
const laPlayers = attachLeague(laLigaPlayers, "l002", "La Liga", "la-liga");
const blPlayers = attachLeague(bundesligaPlayers, "l003", "Bundesliga", "bundesliga");
const saPlayers = attachLeague(serieAPlayers, "l004", "Serie A", "serie-a");
const lgPlayers = attachLeague(ligue1Players, "l005", "Ligue 1", "ligue-1");
const slPlayers = attachLeague(superLigPlayers, "l006", "Süper Lig", "super-lig");

export const ALL_PLAYERS: Player[] = [
  ...plPlayers, ...laPlayers, ...blPlayers, ...saPlayers, ...lgPlayers, ...slPlayers,
];

function buildClub(
  id: string, slug: string, name: string, shortName: string, logo: string,
  leagueId: string, leagueSlug: string, leagueName: string,
  stadium: string, founded: number, allPlayers: Player[]
): import("./types").Club {
  return {
    id, slug, name, shortName, logo, stadium, founded,
    leagueId, leagueSlug, leagueName,
    players: allPlayers.filter((p) => p.clubId === id),
  };
}

const arsenal = buildClub("c001", "arsenal", "Arsenal", "ARS", "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg", "l001", "premier-league", "Premier League", "Emirates Stadium", 1886, plPlayers);
const manCity = buildClub("c002", "manchester-city", "Manchester City", "MCI", "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg", "l001", "premier-league", "Premier League", "Etihad Stadium", 1880, plPlayers);
const liverpool = buildClub("c003", "liverpool", "Liverpool", "LIV", "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg", "l001", "premier-league", "Premier League", "Anfield", 1892, plPlayers);
const chelsea = buildClub("c004", "chelsea", "Chelsea", "CHE", "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg", "l001", "premier-league", "Premier League", "Stamford Bridge", 1905, plPlayers);
const spurs = buildClub("c005", "tottenham-hotspur", "Tottenham Hotspur", "TOT", "https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg", "l001", "premier-league", "Premier League", "Tottenham Hotspur Stadium", 1882, plPlayers);
const manUtd = buildClub("c006", "manchester-united", "Manchester United", "MUN", "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg", "l001", "premier-league", "Premier League", "Old Trafford", 1878, plPlayers);

const realMadrid = buildClub("c101", "real-madrid", "Real Madrid", "RMA", "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg", "l002", "la-liga", "La Liga", "Santiago Bernabéu", 1902, laPlayers);
const barcelona = buildClub("c102", "barcelona", "FC Barcelona", "BAR", "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg", "l002", "la-liga", "La Liga", "Camp Nou", 1899, laPlayers);
const atletico = buildClub("c103", "atletico-madrid", "Atlético Madrid", "ATM", "https://upload.wikimedia.org/wikipedia/en/f/f4/Atletico_Madrid_2017_logo.svg", "l002", "la-liga", "La Liga", "Riyadh Air Metropolitano", 1903, laPlayers);
const sevilla = buildClub("c104", "sevilla", "Sevilla FC", "SEV", "https://upload.wikimedia.org/wikipedia/en/3/3b/Sevilla_FC_logo.svg", "l002", "la-liga", "La Liga", "Ramón Sánchez-Pizjuán", 1890, laPlayers);
const villarreal = buildClub("c105", "villarreal", "Villarreal CF", "VIL", "https://upload.wikimedia.org/wikipedia/en/b/b9/Villarreal_CF_logo.svg", "l002", "la-liga", "La Liga", "Estadio de la Cerámica", 1923, laPlayers);

const bayernMunich = buildClub("c201", "bayern-munich", "Bayern München", "FCB", "https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282002%E2%80%932017%29.svg", "l003", "bundesliga", "Bundesliga", "Allianz Arena", 1900, blPlayers);
const dortmund = buildClub("c202", "borussia-dortmund", "Borussia Dortmund", "BVB", "https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg", "l003", "bundesliga", "Bundesliga", "Signal Iduna Park", 1909, blPlayers);
const leverkusen = buildClub("c203", "bayer-leverkusen", "Bayer Leverkusen", "B04", "https://upload.wikimedia.org/wikipedia/en/5/59/Bayer_04_Leverkusen_logo.svg", "l003", "bundesliga", "Bundesliga", "BayArena", 1904, blPlayers);
const rb_leipzig = buildClub("c204", "rb-leipzig", "RB Leipzig", "RBL", "https://upload.wikimedia.org/wikipedia/en/0/04/RB_Leipzig_2014_logo.svg", "l003", "bundesliga", "Bundesliga", "Red Bull Arena", 2009, blPlayers);

const inter = buildClub("c301", "inter-milan", "Inter Milan", "INT", "https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg", "l004", "serie-a", "Serie A", "San Siro", 1908, saPlayers);
const juventus = buildClub("c302", "juventus", "Juventus", "JUV", "https://upload.wikimedia.org/wikipedia/commons/b/bc/Juventus_FC_2017_icon_%28black%29.svg", "l004", "serie-a", "Serie A", "Allianz Stadium", 1897, saPlayers);
const acMilan = buildClub("c303", "ac-milan", "AC Milan", "MIL", "https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg", "l004", "serie-a", "Serie A", "San Siro", 1899, saPlayers);
const napoli = buildClub("c304", "napoli", "SSC Napoli", "NAP", "https://upload.wikimedia.org/wikipedia/commons/2/2d/SSC_Napoli.svg", "l004", "serie-a", "Serie A", "Stadio Maradona", 1926, saPlayers);

const psg = buildClub("c401", "psg", "Paris Saint-Germain", "PSG", "https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg", "l005", "ligue-1", "Ligue 1", "Parc des Princes", 1970, lgPlayers);
const monaco = buildClub("c402", "monaco", "AS Monaco", "MON", "https://upload.wikimedia.org/wikipedia/en/e/ea/AS_Monaco_FC.svg", "l005", "ligue-1", "Ligue 1", "Stade Louis II", 1924, lgPlayers);
const marseille = buildClub("c403", "marseille", "Olympique de Marseille", "OM", "https://upload.wikimedia.org/wikipedia/commons/d/d8/Olympique_Marseille_logo.svg", "l005", "ligue-1", "Ligue 1", "Stade Vélodrome", 1899, lgPlayers);
const lyon = buildClub("c404", "lyon", "Olympique Lyonnais", "OL", "https://upload.wikimedia.org/wikipedia/en/e/e9/Olympique_Lyonnais_%28logo%29.svg", "l005", "ligue-1", "Ligue 1", "Groupama Stadium", 1950, lgPlayers);

const galatasaray = buildClub("c501", "galatasaray", "Galatasaray", "GS", "https://upload.wikimedia.org/wikipedia/en/f/fd/Galatasaray_Sports_Club_Logo.svg", "l006", "super-lig", "Süper Lig", "Rams Park", 1905, slPlayers);
const fenerbahce = buildClub("c502", "fenerbahce", "Fenerbahçe", "FB", "https://upload.wikimedia.org/wikipedia/en/4/41/Fenerbah%C3%A7e_SK.svg", "l006", "super-lig", "Süper Lig", "Şükrü Saracoğlu", 1907, slPlayers);
const besiktas = buildClub("c503", "besiktas", "Beşiktaş", "BJK", "https://upload.wikimedia.org/wikipedia/commons/5/5b/Besiktas_JK_logo.svg", "l006", "super-lig", "Süper Lig", "Tüpraş Stadyumu", 1903, slPlayers);
const trabzonspor = buildClub("c504", "trabzonspor", "Trabzonspor", "TS", "https://upload.wikimedia.org/wikipedia/en/e/e9/Trabzonspor_logo.svg", "l006", "super-lig", "Süper Lig", "Şenol Güneş Stadyumu", 1967, slPlayers);

export const LEAGUES: League[] = [
  {
    id: "l001", slug: "premier-league", name: "Premier League", country: "England",
    logo: "https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg",
    clubs: [arsenal, manCity, liverpool, chelsea, spurs, manUtd],
  },
  {
    id: "l002", slug: "la-liga", name: "La Liga", country: "Spain",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/54/LaLiga_Logo_2023.svg",
    clubs: [realMadrid, barcelona, atletico, sevilla, villarreal],
  },
  {
    id: "l003", slug: "bundesliga", name: "Bundesliga", country: "Germany",
    logo: "https://upload.wikimedia.org/wikipedia/en/d/df/Bundesliga_logo_%282017%29.svg",
    clubs: [bayernMunich, dortmund, leverkusen, rb_leipzig],
  },
  {
    id: "l004", slug: "serie-a", name: "Serie A", country: "Italy",
    logo: "https://upload.wikimedia.org/wikipedia/en/e/e1/Serie_A_logo_%282019%29.svg",
    clubs: [inter, juventus, acMilan, napoli],
  },
  {
    id: "l005", slug: "ligue-1", name: "Ligue 1", country: "France",
    logo: "https://upload.wikimedia.org/wikipedia/en/b/ba/Ligue_1_Uber_Eats_logo.svg",
    clubs: [psg, monaco, marseille, lyon],
  },
  {
    id: "l006", slug: "super-lig", name: "Süper Lig", country: "Turkey",
    logo: "https://upload.wikimedia.org/wikipedia/en/6/68/S%C3%BCper_Lig_logo.svg",
    clubs: [galatasaray, fenerbahce, besiktas, trabzonspor],
  },
];

export function getLeague(slug: string): League | undefined {
  return LEAGUES.find((l) => l.slug === slug);
}

export function getClub(leagueSlug: string, clubSlug: string): import("./types").Club | undefined {
  const league = getLeague(leagueSlug);
  return league?.clubs.find((c) => c.slug === clubSlug);
}

export function getPlayer(id: string): Player | undefined {
  return ALL_PLAYERS.find((p) => p.slug === id || p.id === id);
}

export function searchPlayers(query: string): Player[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return ALL_PLAYERS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.nationality.toLowerCase().includes(q) ||
      p.clubName.toLowerCase().includes(q) ||
      p.position.toLowerCase().includes(q)
  ).slice(0, 20);
}

export function getTop100(): Player[] {
  return [...ALL_PLAYERS].sort((a, b) => b.currentValue - a.currentValue).slice(0, 100);
}
