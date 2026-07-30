import pandas as pd

df = pd.read_csv('sofifa_players.csv')

# Ligas femeninas a excluir
FEMALE_LEAGUES = [
    'Liga F', 
    'Barclays WSL', 
    'NWSL', 
    'Calcio A Femminile', 
    'Liga Portugal Feminino', 
    "Scottish Women's League",
    'Arkema PL',
    'GPFBL'
]

# Filtrar fuera ligas femeninas
df_male = df[~df['league'].isin(FEMALE_LEAGUES)].copy()

print(f"Total original: {len(df)}")
print(f"Total tras eliminar ligas femeninas: {len(df_male)}")
print(f"Eliminadas: {len(df) - len(df_male)} jugadoras.")

# Sobrescribir CSV y Excel
df_male.to_csv('sofifa_players.csv', index=False, encoding='utf-8-sig')
df_male.to_excel('sofifa_players.xlsx', index=False)

print("¡Archivos sofifa_players.csv y sofifa_players.xlsx actualizados sin equipos/jugadoras femeninas!")
