import json

NDJSON_PATH = 'archive/ea_fc26_pages.ndjson'

POSITION_MAP = {
    'POR': 'POR',
    'DFC': 'DFC',
    'LI': 'LI',
    'LD': 'LD',
    'MCD': 'MCD',
    'MC': 'MC',
    'MCO': 'MCO',
    'MI': 'EI',
    'MD': 'ED',
    'EI': 'EI',
    'ED': 'ED',
    'DC': 'DC',
}


def load_items():
    items = []
    seen_ids = set()
    with open(NDJSON_PATH, encoding='utf-8-sig') as f:
        for line in f:
            line = line.strip().lstrip('﻿')
            if not line:
                continue
            page = json.loads(line)
            for it in page:
                if it['id'] in seen_ids:
                    continue
                seen_ids.add(it['id'])
                items.append(it)
    return items


def stat(item, key, default=60):
    v = item.get('stats', {}).get(key, {}).get('value')
    return v if isinstance(v, int) else default


def build_stats(item, is_gk):
    if is_gk:
        return {
            'pace': stat(item, 'gkDiving', 60),
            'shooting': stat(item, 'gkHandling', 60),
            'passing': stat(item, 'gkKicking', 60),
            'dribbling': stat(item, 'gkPositioning', 60),
            'defending': stat(item, 'gkReflexes', 60),
            'physical': item.get('overallRating', 60),
        }
    return {
        'pace': stat(item, 'pac'),
        'shooting': stat(item, 'sho'),
        'passing': stat(item, 'pas'),
        'dribbling': stat(item, 'dri'),
        'defending': stat(item, 'def'),
        'physical': stat(item, 'phy'),
    }


def player_name(item):
    common = item.get('commonName')
    if common:
        return common
    first = item.get('firstName') or ''
    last = item.get('lastName') or ''
    full = f"{first} {last}".strip()
    return full or 'Jugador'


def preferred_foot(item):
    return 'Izquierdo' if item.get('preferredFoot') == 2 else 'Derecho'


def estimate_value(ovr, age):
    base = max(0, (ovr - 40)) ** 3 * 350
    if age and age <= 23:
        base *= 1.4
    elif age and age >= 32:
        base *= 0.4
    return max(int(base), 30000)


def build_player(item):
    ovr = item.get('overallRating', 60)
    pos_short = (item.get('position') or {}).get('shortLabel') or 'MC'
    position = POSITION_MAP.get(pos_short, 'MC')
    is_gk = position == 'POR'

    team = item.get('team') or {}
    nationality = (item.get('nationality') or {}).get('label') or 'Internacional'
    league = item.get('leagueName') or 'Liga Oficial EA FC'

    birth = item.get('birthdate') or ''
    age = None
    try:
        year = int(birth.split('/')[-1].split(' ')[0])
        age = max(16, 2026 - year) if year > 1900 else None
    except (ValueError, IndexError):
        age = None
    if not age:
        age = 25

    card_type = 'Icon' if ovr >= 90 else ('Special' if ovr >= 85 else ('Gold' if ovr >= 75 else 'Silver'))
    value = estimate_value(ovr, age)

    return {
        'id': f"eafc-p-{item['id']}",
        'playerId': str(item['id']),
        'name': player_name(item),
        'position': position,
        'rating': ovr,
        'potential': ovr,
        'cardType': card_type,
        'value': value,
        'wage': f"€{max(1000, ovr * 4000):,}".replace(',', '.'),
        'photoUrl': item.get('avatarUrl') or '',
        'nationality': nationality,
        'clubName': team.get('label') or 'Sin Club',
        'clubLogoUrl': team.get('imageUrl') or '',
        'league': league,
        'age': age,
        'preferredFoot': preferred_foot(item),
        'stats': build_stats(item, is_gk),
    }


items = load_items()
print(f"Jugadores únicos cargados desde EA FC26: {len(items)}")

players_list = [build_player(it) for it in items]
players_list.sort(key=lambda p: -p['rating'])

# ---- sofifaPlayersDatabase.ts (full database, real official data) ----
ts_db_content = f"""import {{ PlayerPosition, PlayerStats }} from '../types';

export interface SoFifaPlayerPreset {{
  id: string;
  playerId?: string;
  name: string;
  position: PlayerPosition;
  rating: number;
  potential?: number;
  cardType: 'Gold' | 'Special' | 'Icon' | 'Silver';
  value: number;
  wage?: string;
  photoUrl: string;
  stats: PlayerStats;
  nationality: string;
  clubName?: string;
  clubLogoUrl?: string;
  league?: string;
  age?: number;
  preferredFoot?: string;
}}

export const SOFIFA_PLAYERS_DATABASE: SoFifaPlayerPreset[] = {json.dumps(players_list, ensure_ascii=False, indent=2)} as const as unknown as SoFifaPlayerPreset[];
"""

with open('src/data/sofifaPlayersDatabase.ts', 'w', encoding='utf-8') as f:
    f.write(ts_db_content)

print("src/data/sofifaPlayersDatabase.ts regenerado con datos oficiales de EA FC 26.")

# ---- sofifaData.ts (clubs) ----
clubs_seen = {}
for p in players_list:
    name = p['clubName']
    if name == 'Sin Club' or name in clubs_seen:
        continue
    clubs_seen[name] = {
        'name': name,
        'country': p['nationality'],
        'league': p['league'],
        'logoUrl': p['clubLogoUrl'],
        'overalls': [],
    }
for p in players_list:
    if p['clubName'] in clubs_seen:
        clubs_seen[p['clubName']]['overalls'].append(p['rating'])

clubs_list = []
for idx, (name, c) in enumerate(sorted(clubs_seen.items())):
    avg_ovr = sum(c['overalls']) / len(c['overalls']) if c['overalls'] else 70
    budget = int(avg_ovr * 1500000)
    clean_name = name.replace('FC', '').replace('CF', '').replace('RC', '').replace('CD', '').strip()
    words = clean_name.split()
    if len(words) >= 3:
        short_name = (words[0][0] + words[1][0] + words[2][0]).upper()
    elif len(words) == 2:
        short_name = (words[0][:2] + words[1][0]).upper()
    else:
        short_name = clean_name[:3].upper()

    clubs_list.append({
        'id': f"eafc-club-{idx}",
        'name': name,
        'shortName': short_name,
        'logoUrl': c['logoUrl'] or 'https://cdn.sofifa.net/teams/241/60.png',
        'stadium': f"Estadio {name}",
        'country': c['country'],
        'league': c['league'],
        'defaultBudget': budget,
    })

ts_data_content = f"""export {{ SOFIFA_PLAYERS_DATABASE as SOFIFA_PLAYERS }} from './sofifaPlayersDatabase';
export type {{ SoFifaPlayerPreset }} from './sofifaPlayersDatabase';

export interface SoFifaClubPreset {{
  id: string;
  name: string;
  shortName: string;
  logoUrl: string;
  stadium: string;
  country: string;
  league: string;
  defaultBudget: number;
}}

export const SOFIFA_CLUBS: SoFifaClubPreset[] = {json.dumps(clubs_list, ensure_ascii=False, indent=2)} as const as unknown as SoFifaClubPreset[];

export const GET_SOFIFA_COUNTRIES = (): string[] => {{
  const countries = new Set<string>();
  SOFIFA_CLUBS.forEach(c => {{
    if (c.country) countries.add(c.country);
  }});
  return Array.from(countries).sort();
}};

export const GET_SOFIFA_LEAGUES_BY_COUNTRY = (country?: string): string[] => {{
  const leagues = new Set<string>();
  SOFIFA_CLUBS.forEach(c => {{
    if (!country || c.country === country) {{
      if (c.league) leagues.add(c.league);
    }}
  }});
  return Array.from(leagues).sort();
}};

export const GET_SOFIFA_CLUBS_BY_FILTER = (country?: string, league?: string): SoFifaClubPreset[] => {{
  return SOFIFA_CLUBS.filter(c => {{
    const matchCountry = !country || c.country === country;
    const matchLeague = !league || c.league === league;
    return matchCountry && matchLeague;
  }});
}};
"""

with open('src/data/sofifaData.ts', 'w', encoding='utf-8') as f:
    f.write(ts_data_content)

print(f"src/data/sofifaData.ts regenerado con {len(clubs_list)} clubes oficiales.")

# ---- officialCurrentSquads.ts (current top-30 roster per club, no legends filtering needed: EA data is current-season only) ----
squads_by_club = {}
for p in players_list:
    club = p['clubName']
    if club == 'Sin Club':
        continue
    squads_by_club.setdefault(club, [])
    if len(squads_by_club[club]) < 30:
        squads_by_club[club].append({
            'id': p['id'],
            'name': p['name'],
            'position': p['position'],
            'rating': p['rating'],
            'age': p['age'],
            'nationality': p['nationality'],
        })

ts_squads_content = f"""export interface SquadPlayer {{
  id: string;
  name: string;
  position: string;
  rating: number;
  age: number;
  nationality: string;
}}

export const OFFICIAL_CURRENT_SQUADS: Record<string, SquadPlayer[]> = {json.dumps(squads_by_club, ensure_ascii=False, indent=2)};

export const GET_OFFICIAL_SQUAD_BY_CLUB_NAME = (clubName: string): SquadPlayer[] => {{
  if (!clubName) return [];

  if (OFFICIAL_CURRENT_SQUADS[clubName]) {{
    return OFFICIAL_CURRENT_SQUADS[clubName];
  }}

  const cleanTarget = clubName.toLowerCase().replace('cf', '').replace('fc', '').replace('rc', '').trim();
  const matchedKey = Object.keys(OFFICIAL_CURRENT_SQUADS).find(key => {{
    const cleanKey = key.toLowerCase().replace('cf', '').replace('fc', '').replace('rc', '').trim();
    return cleanKey.includes(cleanTarget) || cleanTarget.includes(cleanKey);
  }});

  if (matchedKey && OFFICIAL_CURRENT_SQUADS[matchedKey]) {{
    return OFFICIAL_CURRENT_SQUADS[matchedKey];
  }}

  return [];
}};
"""

with open('src/data/officialCurrentSquads.ts', 'w', encoding='utf-8') as f:
    f.write(ts_squads_content)

print(f"src/data/officialCurrentSquads.ts regenerado con {len(squads_by_club)} planteles oficiales EA FC 26.")
