import os
import requests

teams = {
    "atlanta-hawks": "atl",
    "boston-celtics": "bos",
    "brooklyn-nets": "bkn",
    "charlotte-hornets": "cha",
    "chicago-bulls": "chi",
    "cleveland-cavaliers": "cle",
    "dallas-mavericks": "dal",
    "denver-nuggets": "den",
    "detroit-pistons": "det",
    "golden-state-warriors": "gs",
    "houston-rockets": "hou",
    "indiana-pacers": "ind",
    "los-angeles-clippers": "lac",
    "los-angeles-lakers": "lal",
    "memphis-grizzlies": "mem",
    "miami-heat": "mia",
    "milwaukee-bucks": "mil",
    "minnesota-timberwolves": "min",
    "new-orleans-pelicans": "no",
    "new-york-knicks": "ny",
    "oklahoma-city-thunder": "okc",
    "orlando-magic": "orl",
    "philadelphia-76ers": "phi",
    "phoenix-suns": "phx",
    "portland-trail-blazers": "por",
    "sacramento-kings": "sac",
    "san-antonio-spurs": "sa",
    "toronto-raptors": "tor",
    "utah-jazz": "utah",
    "washington-wizards": "wsh",
}

os.makedirs("nba-logos-transparentes", exist_ok=True)

for name, code in teams.items():
    url = f"https://a.espncdn.com/i/teamlogos/nba/500/{code}.png"
    file_path = f"nba-logos-transparentes/{name}.png"

    response = requests.get(url)

    if response.status_code == 200:
        with open(file_path, "wb") as file:
            file.write(response.content)
        print(f"Baixou: {name}")
    else:
        print(f"Erro: {name}")

print("Finalizado!")