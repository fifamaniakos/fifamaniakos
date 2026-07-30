import json
import pandas as pd
import numpy as np

# Cargar jugadores del Excel/CSV
df_players = pd.read_excel('sofifa_players.xlsx')

# Limpiar nulos y renombrar columnas de stats
df_players = df_players.where(pd.notnull(df_players), None)

players_list = []

for idx, row in df_players.iterrows():
    p = {
        "id": str(row["id"]),
        "playerId": str(row["playerId"]) if row["playerId"] is not None else None,
        "name": str(row["name"]),
        "position": str(row["position"]),
        "rating": int(row["rating"]),
        "potential": int(row["potential"]) if row["potential"] is not None else int(row["rating"]),
        "cardType": str(row["cardType"]),
        "value": int(row["value"]),
        "wage": str(row["wage"]) if row["wage"] is not None else None,
        "photoUrl": str(row["photoUrl"]),
        "nationality": str(row["nationality"]),
        "clubName": str(row["clubName"]) if row["clubName"] is not None else None,
        "clubLogoUrl": str(row["clubLogoUrl"]) if row["clubLogoUrl"] is not None else None,
        "league": str(row["league"]) if row["league"] is not None else None,
        "age": int(row["age"]) if row["age"] is not None else None,
        "preferredFoot": str(row["preferredFoot"]) if row["preferredFoot"] is not None else None,
        "stats": {
            "pace": int(row["stats.pace"]),
            "shooting": int(row["stats.shooting"]),
            "passing": int(row["stats.passing"]),
            "dribbling": int(row["stats.dribbling"]),
            "defending": int(row["stats.defending"]),
            "physical": int(row["stats.physical"])
        }
    }
    players_list.append(p)

print(f"Procesados {len(players_list)} jugadores.")

# Escribir en src/data/sofifaPlayersDatabase.ts
header = "import { PlayerPosition, PlayerStats } from '../types';\n\nexport interface SoFifaPlayerPreset {\n  id: string;\n  playerId?: string;\n  name: string;\n  position: PlayerPosition;\n  rating: number;\n  potential?: number;\n  cardType: 'Gold' | 'Special' | 'Icon' | 'Silver';\n  value: number;\n  wage?: string;\n  photoUrl: string;\n  stats: PlayerStats;\n  nationality: string;\n  clubName?: string;\n  clubLogoUrl?: string;\n  league?: string;\n  age?: number;\n  preferredFoot?: string;\n}\n\nexport const SOFIFA_PLAYERS_DATABASE: SoFifaPlayerPreset[] = "

footer = " as const as unknown as SoFifaPlayerPreset[];\n"

with open('src/data/sofifaPlayersDatabase.ts', 'w', encoding='utf-8') as f:
    f.write(header)
    json.dump(players_list, f, ensure_ascii=False, indent=2)
    f.write(footer)

print("Actualizado src/data/sofifaPlayersDatabase.ts con éxito!")
