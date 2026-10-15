from pathlib import Path
from bs4 import BeautifulSoup
import json
import re
import html as html_lib
from datetime import date

SOURCE_DIR = Path("/tmp/ridge-pages")
OUTPUT = Path("/tmp/ridge-official-data.json")

LABELS = {
    "cépage": "grapes",
    "cépages": "grapes",
    "degré d'alcool": "alcohol",
    "degré d’alcool": "alcohol",
    "alcool": "alcohol",
    "taux de sucre": "sugar",
    "sucre": "sugar",
    "format": "bottleSize",
    "arômes": "aromas",
    "arôme": "aromas",
    "accords": "pairings",
    "accord mets et vin": "pairings",
    "accords mets et vins": "pairings",
    "code saq": "sku",
    "vinification": "vinification",
    "élevage": "aging",
    "sol": "soil",
    "sols": "soil",
    "récolte": "harvest",
}

def clean(value):
    value = html_lib.unescape(str(value or ""))
    value = value.replace("\xa0", " ")
    value = re.sub(r"\s+", " ", value)
    return value.strip(" :\n\t")

def parse_price(text):
    candidates = re.findall(r"(\d{1,3}[,.]\d{2})\s*\$", text)
    if not candidates:
        return None
    values = [float(x.replace(",", ".")) for x in candidates]
    values = [x for x in values if 5 <= x <= 500]
    return values[0] if values else None

def product_jsonld(soup):
    for script in soup.find_all("script", type="application/ld+json"):
        raw = script.string or script.get_text()
        try:
            data = json.loads(raw)
        except Exception:
            continue

        stack = data if isinstance(data, list) else [data]

        while stack:
            item = stack.pop(0)

            if isinstance(item, dict):
                if item.get("@type") == "Product":
                    return item
                graph = item.get("@graph")
                if isinstance(graph, list):
                    stack.extend(graph)

    return {}

def extract_pairs(soup):
    result = {}

    # Tables
    for row in soup.find_all("tr"):
        cells = [clean(x.get_text(" ", strip=True)) for x in row.find_all(["th", "td"])]
        if len(cells) >= 2:
            key = cells[0].lower().rstrip(":")
            if key in LABELS:
                result[LABELS[key]] = clean(" ".join(cells[1:]))

    # Definition lists
    for dt in soup.find_all("dt"):
        key = clean(dt.get_text(" ", strip=True)).lower().rstrip(":")
        dd = dt.find_next_sibling("dd")
        if key in LABELS and dd:
            result[LABELS[key]] = clean(dd.get_text(" ", strip=True))

    # Generic adjacent blocks
    elements = soup.find_all(["p", "li", "div", "span", "strong", "h3", "h4"])

    for element in elements:
        text = clean(element.get_text(" ", strip=True))
        low = text.lower().rstrip(":")

        if low in LABELS:
            nxt = element.find_next()
            guard = 0

            while nxt and guard < 8:
                guard += 1
                value = clean(nxt.get_text(" ", strip=True))

                if value and value.lower().rstrip(":") != low:
                    if len(value) <= 1000:
                        result.setdefault(LABELS[low], value)
                        break

                nxt = nxt.find_next()

        # "Label : value"
        for label, field in LABELS.items():
            pattern = rf"^{re.escape(label)}\s*:\s*(.+)$"
            m = re.match(pattern, text, flags=re.I)

            if m:
                result.setdefault(field, clean(m.group(1)))

    return result

products = []

for path in sorted(SOURCE_DIR.glob("*.html")):
    raw = path.read_text(errors="ignore")
    soup = BeautifulSoup(raw, "html.parser")

    structured = product_jsonld(soup)
    pairs = extract_pairs(soup)

    title = clean(
        structured.get("name")
        or (soup.find("h1").get_text(" ", strip=True) if soup.find("h1") else path.stem)
    )

    description = clean(structured.get("description"))

    if not description:
        candidates = [
            clean(p.get_text(" ", strip=True))
            for p in soup.find_all("p")
        ]
        candidates = [
            x for x in candidates
            if len(x) >= 80
            and "livraison" not in x.lower()
            and "politique" not in x.lower()
        ]
        description = max(candidates, key=len) if candidates else ""

    offers = structured.get("offers", {})
    if isinstance(offers, list):
        offers = offers[0] if offers else {}

    price = None
    if isinstance(offers, dict):
        try:
            price = float(offers.get("price"))
        except (TypeError, ValueError):
            pass

    if price is None:
        price = parse_price(clean(soup.get_text(" ", strip=True)))

    url = structured.get("url")
    if not url:
        url = f"https://domaineduridge.com/produit/{path.stem}/"

    record = {
        "source": "Domaine du Ridge — fiche produit officielle",
        "sourceUrl": url,
        "sourceChecked": str(date.today()),
        "sourceSlug": path.stem,
        "name": title,
        "officialDescription": description,
        "approxPrice": price,
        **pairs,
    }

    products.append(record)

OUTPUT.write_text(
    json.dumps(products, ensure_ascii=False, indent=2)
)

print(f"✓ {len(products)} fiches factuelles créées")
print(f"✓ {OUTPUT}")
print()

for p in products:
    print(f"── {p['name']}")
    print(f"   prix         : {p.get('approxPrice', '—')}")
    print(f"   cépage(s)    : {p.get('grapes', '—')}")
    print(f"   alcool       : {p.get('alcohol', '—')}")
    print(f"   sucre        : {p.get('sugar', '—')}")
    print(f"   format       : {p.get('bottleSize', '—')}")
    print(f"   SAQ/SKU      : {p.get('sku', '—')}")
    print(f"   vinification : {p.get('vinification', '—')}")
    print(f"   élevage      : {p.get('aging', '—')}")
    print(f"   sol          : {p.get('soil', '—')}")
    print()
