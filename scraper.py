import json
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

# ---------- CONFIG ----------
URL = "https://draftballr.com/stats"

# ---------- HELPERS ----------

def get_tier(rank):
    if rank <= 5:
        return "ELITE"
    elif rank <= 14:
        return "LOTTERY"
    elif rank <= 30:
        return "FRINGE"
    else:
        return "SLEEPER"

def get_color(tier):
    if tier == "ELITE":
        return "#8b5cf6"
    elif tier == "LOTTERY":
        return "#f97316"
    else:
        return "#f59e0b"

def estimate_wingspan(height_str):
    try:
        feet, inches = height_str.replace('"', '').split("'")
        total_inches = int(feet) * 12 + int(inches)
        wingspan = total_inches + 3  # média NBA: +3"
        return f"{wingspan // 12}'{wingspan % 12}\""
    except:
        return ""

def safe_float(val):
    try:
        return float(val)
    except:
        return 0.0

# ---------- DRIVER ----------
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
driver.get(URL)

time.sleep(5)  # aguarda carregamento JS

# ---------- CAPTURA ----------
rows = driver.find_elements(By.CSS_SELECTOR, "table tbody tr")

prospects = []

for idx, row in enumerate(rows, start=1):
    cols = row.find_elements(By.TAG_NAME, "td")

    if len(cols) < 8:
        continue

    try:
        name = cols[1].text
        position = cols[2].text
        team = cols[3].text
        age = int(cols[4].text) if cols[4].text.isdigit() else 19
        height = cols[5].text
        weight = cols[6].text

        tier = get_tier(idx)
        accent = get_color(tier)

        wingspan = estimate_wingspan(height)

        # stats (ajuste dependendo da tabela real)
        ppg = safe_float(cols[7].text)
        rpg = safe_float(cols[8].text)
        apg = safe_float(cols[9].text)

        prospect = {
            "name": name,
            "position": position,
            "team": team,
            "age": age,
            "height": height,
            "weight": weight,
            "wingspan": wingspan,
            "tier": tier,
            "rank": idx,
            "stats": {
                "ppg": ppg,
                "rpg": rpg,
                "apg": apg,
                "fgp": 0,
                "threep": 0,
                "ftp": 0,
                "per": 0,
                "ts": 0,
                "usg": 0
            },
            "scouting": {
                "strengths": ["Athleticism", "Scoring upside", "Versatility"],
                "weaknesses": ["Consistency", "Defense", "Decision making"],
                "notes": f"Prospecto de alto potencial no contexto do Draft 2026."
            },
            "accentColor": accent
        }

        prospects.append(prospect)

    except Exception as e:
        print("Erro ao processar jogador:", e)

# ---------- SALVAR ----------
with open("prospects.json", "w", encoding="utf-8") as f:
    json.dump(prospects, f, indent=2, ensure_ascii=False)

driver.quit()

print("✅ Arquivo prospects.json gerado com sucesso!")