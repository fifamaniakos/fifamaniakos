import json
import pandas as pd

# Cargar jugadores del Excel
df = pd.read_excel('sofifa_players.xlsx')

# Extraer equipos únicos
df_clubs = df.dropna(subset=['clubName']).drop_duplicates(subset=['clubName'])

clubs_list = []

for idx, row in df_clubs.reset_index(drop=True).iterrows():
    club_name = str(row['clubName'])
    short_name = club_name[:3].upper()
    logo_url = str(row['clubLogoUrl']) if pd.notnull(row['clubLogoUrl']) else "https://drop-assets.ea.com/images/5xHpRhSwl3xEjJiepk1JH8/e665662058bca65a85e0ab1abbe7c261/l116003.png"
    country = str(row['nationality']) if pd.notnull(row['nationality']) else "Internacional"
    league = str(row['league']) if pd.notnull(row['league']) else "Liga General"
    
    clubs_list.append({
        "id": f"eafc-club-{idx}",
        "name": club_name,
        "shortName": short_name,
        "logoUrl": logo_url,
        "stadium": f"Estadio {club_name}",
        "country": country,
        "league": league,
        "defaultBudget": 100000000
    })

print(f"Extraídos {len(clubs_list)} clubes únicos del Excel.")

# Actualizar sofifaData.ts manteniendo exports e helpers
with open('src/data/sofifaData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Reemplazar la constante SOFIFA_CLUBS
marker_start = "export const SOFIFA_CLUBS: SoFifaClubPreset[] = "
marker_end = "];\n\nexport const GET_SOFIFA_COUNTRIES"

start_pos = text.find(marker_start)
end_pos = text.find(marker_end, start_pos)

if start_pos != -1 and end_pos != -1:
    new_clubs_json = json.dumps(clubs_list, ensure_ascii=False, indent=2)
    new_text = text[:start_pos + len(marker_start)] + new_clubs_json + text[end_pos:]
    
    with open('src/data/sofifaData.ts', 'w', encoding='utf-8') as f:
        f.write(new_text)
    print("¡`SOFIFA_CLUBS` actualizado en `src/data/sofifaData.ts`!")
else:
    print("No se encontraron los marcadores en sofifaData.ts")
