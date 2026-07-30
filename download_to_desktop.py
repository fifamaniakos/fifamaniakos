import time
import pandas as pd
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

print("Iniciando extracción automatizada directa al Escritorio...")

chrome_options = Options()
# Activar perfil visible para pasar Cloudflare automáticamente
chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")

driver = webdriver.Chrome(options=chrome_options)

try:
    print("Abriendo CMTracker...")
    driver.get("https://www.cmtracker.net/players?sort=overallrating%3Adesc&limit=50&page=1&gender__in=Male&db=26072300")
    
    # Esperamos a que la página pase el check
    time.sleep(8)

    js_code = """
    var callback = arguments[0];
    (async () => {
        let allPlayers = [];
        let page = 1;
        let hasMore = true;

        async function fetchPage(p) {
            try {
                const url = `https://www.cmtracker.net/players?sort=overallrating%3Adesc&limit=50&page=${p}&gender__in=Male&db=26072300`;
                const res = await fetch(url);
                if (!res.ok) return [];
                const html = await res.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");
                const scriptTag = doc.querySelector("#__NEXT_DATA__");
                if (!scriptTag) return [];
                const data = JSON.parse(scriptTag.textContent);
                let pagePlayers = [];
                function extract(obj) {
                    if (!obj || typeof obj !== 'object') return;
                    if (Array.isArray(obj) && obj.length > 0 && (obj[0].overallrating || obj[0].name || obj[0].short_name || obj[0].id)) {
                        pagePlayers = obj;
                        return;
                    }
                    for (let k in obj) {
                        if (pagePlayers.length > 0) break;
                        extract(obj[k]);
                    }
                }
                extract(data);
                return pagePlayers;
            } catch(e) { return []; }
        }

        const chunkSize = 15;
        while (hasMore) {
            let promises = [];
            for (let p = page; p < page + chunkSize; p++) {
                promises.push(fetchPage(p));
            }
            let results = await Promise.all(promises);
            for (let chunk of results) {
                if (chunk && chunk.length > 0) {
                    allPlayers.push(...chunk);
                }
            }
            if (results.some(r => r.length === 0) || page > 450) {
                hasMore = false;
            } else {
                page += chunkSize;
            }
        }
        callback(allPlayers);
    })();
    """

    driver.set_script_timeout(600)
    print("Descargando las 400+ páginas de jugadores...")
    players = driver.execute_async_script(js_code)

    print(f"Descarga finalizada. Total de jugadores obtenidos: {len(players)}")

    if players:
        df = pd.json_normalize(players)
        
        output_excel = "C:/Users/HP/Desktop/cmtracker_jugadores_completo.xlsx"
        output_csv = "C:/Users/HP/Desktop/cmtracker_jugadores_completo.csv"

        df.to_excel(output_excel, index=False)
        df.to_csv(output_csv, index=False, encoding="utf-8-sig")

        print(f"¡ÉXITO! Archivos guardados directamente en el Escritorio:")
        print(f" - Excel: {output_excel}")
        print(f" - CSV: {output_csv}")

finally:
    driver.quit()
