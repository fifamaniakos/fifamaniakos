import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const csvPath = process.argv[2] || 'C:/Users/HP/Downloads/equipos_top10_ligas.csv';
const outDir = path.join(root, 'public', 'badges', 'top10');
const seedPath = path.join(root, 'src', 'data', 'top10LeagueClubs.ts');
const migrationPath = path.join(root, 'supabase', 'migrations', '009_seed_top10_league_clubs.sql');

const FALLBACK_LOGO_URL = '';

const manualAliases = new Map([
  ['bayern munich', ['FC Bayern München', 'Bayern München']],
  ['borussia monchengladbach', ['Borussia Mönchengladbach', "Borussia M'gladbach"]],
  ['manchester united', ['Manchester Utd', 'Manchester United']],
  ['newcastle united', ['Newcastle Utd', 'Newcastle United']],
  ['nottingham forest', ['Nottm Forest', 'Nottingham Forest']],
  ['tottenham hotspur', ['Spurs', 'Tottenham Hotspur']],
  ['west ham united', ['West Ham', 'West Ham United']],
  ['wolverhampton wanderers', ['Wolves', 'Wolverhampton Wanderers']],
  ['alaves', ['D. Alavés', 'Alavés']],
  ['barcelona', ['FC Barcelona', 'Barcelona']],
  ['atletico de madrid', ['Atlético de Madrid', 'Atlético Madrid']],
  ['inter', ['Lombardia FC', 'Inter']],
  ['milan', ['Milano FC', 'Milan']],
  ['roma', ['Roma FC', 'Roma']],
  ['lazio', ['Latium', 'Lazio']],
  ['napoli', ['Napoli FC', 'Napoli']],
  ['paris saint germain', ['PSG', 'Paris Saint-Germain']],
  ['ajax', ['AFC Ajax', 'Ajax']],
  ['psv eindhoven', ['PSV', 'PSV Eindhoven']],
  ['feyenoord', ['Feyenoord', 'Feyenoord Rotterdam']],
  ['benfica', ['SL Benfica', 'Benfica']],
  ['porto', ['FC Porto', 'Porto']],
  ['sporting cp', ['Sporting CP', 'Sporting']],
  ['gent', ['KAA Gent', 'Gent']],
  ['club brugge', ['Club Brugge KV', 'Club Brugge']],
]);

function normalize(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function slugify(value) {
  return normalize(value).replace(/\s+/g, '-');
}

function shortName(name) {
  const words = name.replace(/&/g, ' ').split(/\s+/).filter(Boolean);
  const base = words.length >= 2 ? words.map((word) => word[0]).join('') : name.slice(0, 3);
  return base.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3).padEnd(3, 'X');
}

function findExistingLocalLogo(id, name) {
  const baseName = `${id}-${slugify(name)}`;
  const existing = ['png', 'svg', 'webp', 'jpg', 'jpeg']
    .map((extension) => path.join(outDir, `${baseName}.${extension}`))
    .find((candidate) => fs.existsSync(candidate));

  if (!existing) return '';
  return `/${path.relative(path.join(root, 'public'), existing).replace(/\\/g, '/')}`;
}

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines.shift().split(',');
  return lines.map((line) => {
    const values = [];
    let current = '';
    let quoted = false;
    for (const char of line) {
      if (char === '"') {
        quoted = !quoted;
        continue;
      }
      if (char === ',' && !quoted) {
        values.push(current);
        current = '';
        continue;
      }
      current += char;
    }
    values.push(current);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] || '']));
  });
}

function readSofifaClubs() {
  const source = fs.readFileSync(path.join(root, 'src', 'data', 'sofifaData.ts'), 'utf8');
  const marker = 'export const SOFIFA_CLUBS: SoFifaClubPreset[] =';
  const arrayStart = source.indexOf('[', source.indexOf(marker) + marker.length);
  const arrayEnd = source.indexOf('\n];', arrayStart);
  return JSON.parse(source.slice(arrayStart, arrayEnd + 2));
}

function findPreset(row, presetsByName) {
  const key = normalize(row.nombre);
  const candidates = [row.nombre, ...(manualAliases.get(key) || [])];

  for (const candidate of candidates) {
    const preset = presetsByName.get(normalize(candidate));
    if (preset) return preset;
  }

  const scoped = [...presetsByName.values()].filter((preset) => {
    const sameLeague = normalize(preset.league || '').includes(normalize(row.liga)) || normalize(row.liga).includes(normalize(preset.league || ''));
    return sameLeague && normalize(preset.name) === key;
  });

  return scoped[0] || null;
}

async function downloadFile(url, destination) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  const contentType = response.headers.get('content-type') || '';
  const extension = contentType.includes('svg') ? 'svg' : contentType.includes('webp') ? 'webp' : 'png';
  const finalDestination = destination.replace(/\.[^.]+$/, `.${extension}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(finalDestination, buffer);
  return finalDestination;
}

async function findWikipediaLogo(row) {
  const languagesByCountry = {
    'Argentina': ['es', 'en'],
    'Brasil': ['pt', 'en', 'es'],
    'España': ['es', 'en'],
    'Alemania': ['de', 'en'],
    'Francia': ['fr', 'en'],
    'Países Bajos': ['nl', 'en'],
    'Portugal': ['pt', 'en'],
    'Bélgica': ['fr', 'nl', 'en'],
    'Inglaterra': ['en'],
    'Italia': ['it', 'en'],
  };
  const languages = languagesByCountry[row.pais] || ['en', 'es'];
  const queries = [
    `${row.nombre} logo ${row.pais}`,
    `${row.nombre} ${row.liga} logo`,
    `${row.nombre} escudo`,
    `${row.nombre} club badge`,
  ];

  for (const language of languages) {
    for (const query of queries) {
      const params = new URLSearchParams({
        action: 'query',
        format: 'json',
        origin: '*',
        generator: 'search',
        gsrsearch: query,
        gsrlimit: '5',
        prop: 'pageimages',
        piprop: 'original|thumbnail',
        pithumbsize: '256',
      });
      const response = await fetch(`https://${language}.wikipedia.org/w/api.php?${params.toString()}`);
      if (!response.ok) continue;
      const body = await response.json();
      const pages = Object.values(body?.query?.pages || {});
      const candidate = pages.find((page) => {
        const title = normalize(page?.title || '');
        const name = normalize(row.nombre);
        const likelyTeamPage = title.includes(name) || name.includes(title) || title.includes('club') || title.includes('fc');
        return likelyTeamPage && (page?.original?.source || page?.thumbnail?.source);
      });
      const url = candidate?.original?.source || candidate?.thumbnail?.source;
      if (url) return url;
    }
  }

  return null;
}

function writeSeed(clubs) {
  const content = `export interface Top10LeagueClubSeed {\n  id: string;\n  name: string;\n  shortName: string;\n  country: string;\n  league: string;\n  division: string;\n  logoUrl: string;\n  stadium: string;\n  budget: number;\n}\n\nexport const TOP10_LEAGUE_CLUBS: Top10LeagueClubSeed[] = ${JSON.stringify(clubs, null, 2)};\n`;
  fs.writeFileSync(seedPath, content, 'utf8');
}

function sqlString(value) {
  return String(value).replace(/'/g, "''");
}

function writeMigration(clubs) {
  const values = clubs.map((club) => {
    const data = {
      id: club.id,
      name: club.name,
      shortName: club.shortName,
      manager: 'Por Inscribir (Vacante)',
      gamertag: '@Por Inscribir',
      platform: 'PS5',
      country: club.country,
      league: club.league,
      stadium: club.stadium,
      logoUrl: club.logoUrl,
      division: club.division,
      budget: club.budget,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
      form: [],
    };
    return `  ('${sqlString(club.id)}', '${sqlString(JSON.stringify(data))}'::jsonb)`;
  }).join(',\n');

  const sql = `-- Seed top 10 league clubs as vacant selectable clubs for manager registration.\n-- Safe to run more than once: existing registered clubs with these keys are left untouched.\n\ninsert into public.clubs (key, data)\nvalues\n${values}\non conflict (key) do update\nset data = excluded.data\nwhere\n  coalesce(public.clubs.data->>'manager', '') ilike '%vacante%'\n  or coalesce(public.clubs.data->>'manager', '') ilike '%por inscribir%';\n`;
  fs.writeFileSync(migrationPath, sql, 'utf8');
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });

  const rows = parseCsv(fs.readFileSync(csvPath, 'utf8'));
  const presets = readSofifaClubs();
  const presetsByName = new Map(presets.map((preset) => [normalize(preset.name), preset]));
  const clubs = [];
  const missing = [];

  for (const row of rows) {
    const id = `club-top10-${String(row.id).padStart(3, '0')}`;
    const preset = findPreset(row, presetsByName);
    let logoUrl = findExistingLocalLogo(id, row.nombre) || FALLBACK_LOGO_URL;

    const remoteLogoUrl = logoUrl ? null : preset?.logoUrl || await findWikipediaLogo(row);

    if (remoteLogoUrl) {
      const basePath = path.join(outDir, `${id}-${slugify(row.nombre)}.png`);
      try {
        const downloadedPath = await downloadFile(remoteLogoUrl, basePath);
        logoUrl = `/${path.relative(path.join(root, 'public'), downloadedPath).replace(/\\/g, '/')}`;
        console.log(`OK ${row.nombre} -> ${logoUrl}`);
      } catch (error) {
        missing.push(`${row.nombre}: ${error.message}`);
        console.warn(`MISS ${row.nombre}: ${error.message}`);
      }
    } else if (!logoUrl) {
      missing.push(`${row.nombre}: no preset match`);
      console.warn(`MISS ${row.nombre}: no preset match`);
    }

    clubs.push({
      id,
      name: row.nombre,
      shortName: preset?.shortName?.trim() ? preset.shortName.trim().slice(0, 3).toUpperCase() : shortName(row.nombre),
      country: row.pais,
      league: row.liga,
      division: '1ra División',
      logoUrl,
      stadium: preset?.stadium || `Estadio ${row.nombre}`,
      budget: preset?.defaultBudget || 100000000,
    });
  }

  writeSeed(clubs);
  writeMigration(clubs);

  fs.writeFileSync(path.join(outDir, 'missing.log'), missing.join('\n') + '\n', 'utf8');
  console.log(`Downloaded ${clubs.filter((club) => club.logoUrl).length}/${clubs.length} logos.`);
  console.log(`Missing report: ${path.join(outDir, 'missing.log')}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
