"""
draftballr_scraper.py
=====================
Scraper de stats avançadas de prospects do draftballr.com/stats

REQUISITOS:
    pip install playwright pandas
    python -m playwright install chromium

USO:
    python draftballr_scraper.py

SAÍDA:
    draftballr_stats.csv  — todos os jogadores com suas stats
    draftballr_stats.json — mesmos dados em JSON
"""

import asyncio
import json
import csv
import re
from playwright.async_api import async_playwright

TARGET_URL = "https://draftballr.com/stats"
OUTPUT_CSV  = "draftballr_stats.csv"
OUTPUT_JSON = "draftballr_stats.json"

# ─── helpers ────────────────────────────────────────────────────────────────

def clean(text: str) -> str:
    return text.strip().replace("\n", " ").replace("\t", " ")

# ─── main scraper ───────────────────────────────────────────────────────────

async def scrape():
    captured_json = []          # armazena respostas JSON interceptadas
    players = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=False,     # roda com janela visível — necessário pra passar Cloudflare
            slow_mo=100,
        )
        context = await browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            ),
            viewport={"width": 1440, "height": 900},
            locale="en-US",
        )
        page = await context.new_page()

        # ── intercepta TODAS as respostas JSON ──────────────────────────────
        async def on_response(response):
            ct = response.headers.get("content-type", "")
            if "json" in ct:
                try:
                    body = await response.json()
                    captured_json.append({
                        "url": response.url,
                        "data": body,
                    })
                    print(f"  [JSON] {response.url[:80]}")
                except Exception:
                    pass

        page.on("response", on_response)

        # ── navega para a página ─────────────────────────────────────────────
        print(f"\n→ Abrindo {TARGET_URL} …")
        await page.goto(TARGET_URL, wait_until="domcontentloaded", timeout=60_000)

        # aguarda a tabela carregar (ajuste o seletor se necessário)
        print("→ Aguardando dados renderizarem (até 30s)…")
        try:
            await page.wait_for_selector("table, [class*='table'], [class*='row'], [class*='player']",
                                         timeout=30_000)
        except Exception:
            print("  (seletor de tabela não encontrado, continuando mesmo assim)")

        await asyncio.sleep(5)   # margem extra pra JS terminar

        # ── 1ª tentativa: dados via JSON interceptado ───────────────────────
        if captured_json:
            print(f"\n→ {len(captured_json)} endpoint(s) JSON capturado(s):")
            for item in captured_json:
                print(f"   {item['url']}")

            # salva JSON bruto pra inspeção
            with open("draftballr_raw_api.json", "w", encoding="utf-8") as f:
                json.dump(captured_json, f, indent=2, ensure_ascii=False)
            print("→ JSON bruto salvo em draftballr_raw_api.json")

            # tenta extrair lista de jogadores do primeiro JSON com lista
            for item in captured_json:
                data = item["data"]
                if isinstance(data, list) and len(data) > 5:
                    players = data
                    print(f"→ {len(players)} jogadores encontrados via API JSON")
                    break
                if isinstance(data, dict):
                    for v in data.values():
                        if isinstance(v, list) and len(v) > 5:
                            players = v
                            print(f"→ {len(players)} jogadores encontrados via API JSON (nested)")
                            break
                if players:
                    break

        # ── 2ª tentativa: scraping do DOM da tabela ──────────────────────────
        if not players:
            print("\n→ Sem JSON capturado; fazendo scraping do DOM…")
            players = await scrape_dom(page)

        await browser.close()

    # ── salva resultados ─────────────────────────────────────────────────────
    if players:
        save_csv(players)
        save_json(players)
        print(f"\n✓ {len(players)} jogadores salvos em {OUTPUT_CSV} e {OUTPUT_JSON}")
    else:
        print("\n✗ Nenhum dado encontrado. Veja draftballr_raw_api.json para debug.")


async def scrape_dom(page) -> list[dict]:
    """Extrai dados diretamente da tabela renderizada no DOM."""
    players = []

    # pega cabeçalhos
    headers = await page.evaluate("""
        () => {
            const ths = document.querySelectorAll('th, [class*="header"], [class*="col-header"]');
            return Array.from(ths).map(th => th.innerText.trim()).filter(Boolean);
        }
    """)

    # pega linhas de dados
    rows = await page.evaluate("""
        () => {
            // tenta <tr> primeiro
            const rows = document.querySelectorAll('tr');
            if (rows.length > 1) {
                return Array.from(rows).slice(1).map(tr =>
                    Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim())
                ).filter(r => r.length > 0);
            }
            // fallback: divs com classe "row"
            const divRows = document.querySelectorAll('[class*="row"]:not([class*="header"])');
            return Array.from(divRows).map(row =>
                Array.from(row.querySelectorAll('[class*="cell"], [class*="col"]'))
                    .map(cell => cell.innerText.trim())
            ).filter(r => r.length > 0);
        }
    """)

    print(f"  Headers encontrados: {headers}")
    print(f"  Linhas encontradas:  {len(rows)}")

    for row in rows:
        if not any(row):
            continue
        if headers and len(headers) == len(row):
            players.append(dict(zip(headers, row)))
        else:
            players.append({f"col_{i}": v for i, v in enumerate(row)})

    # se DOM vazio, tenta pegar texto completo e parsear
    if not players:
        print("  DOM vazio; tentando pegar texto completo da página…")
        text = await page.evaluate("() => document.body.innerText")
        with open("draftballr_page_text.txt", "w", encoding="utf-8") as f:
            f.write(text)
        print("  Texto salvo em draftballr_page_text.txt para análise manual.")

    return players


def save_csv(players: list[dict]):
    if not players:
        return
    # garante que todos os dicts têm as mesmas chaves
    all_keys = list(dict.fromkeys(k for p in players for k in p.keys()))
    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=all_keys, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(players)


def save_json(players: list[dict]):
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(players, f, indent=2, ensure_ascii=False)


# ─── entry point ────────────────────────────────────────────────────────────

if __name__ == "__main__":
    asyncio.run(scrape())
