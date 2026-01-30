#!/usr/bin/env python3
from pathlib import Path

SRC = Path("index.html")
DST = Path("index-fr.html")

if not SRC.exists():
    raise SystemExit("❌ index.html not found (run in project root).")

html = SRC.read_text(encoding="utf-8")

repl = [
    # --- HTML lang ---
    ('<html lang="en">', '<html lang="fr">'),

    # --- <title> + description ---
    ('<title>VVZ Studio — Local service landing pages</title>',
     '<title>VVZ Studio — Landing pages pour services locaux</title>'),

    ('<meta name="description" content="VVZ Studio builds conversion-focused landing pages for local businesses. Fast delivery. Lead capture + tracking-ready.">',
     '<meta name="description" content="VVZ Studio crée des landing pages orientées conversion pour services locaux. Livraison rapide. Capture de leads + prête pour le tracking.">'),

    # --- OG: делаем абсолютные URL + FR тексты ---
    ('<meta property="og:title" content="VVZ Studio — Landing Pages that Convert">',
     '<meta property="og:title" content="VVZ Studio — Landing pages qui convertissent" />'),

    ('<meta property="og:description" content="Conversion-focused landing pages for local services. Fast delivery. Lead capture + tracking-ready.">',
     '<meta property="og:description" content="Landing pages orientées conversion pour services locaux. Livraison rapide. Capture de leads + prête pour le tracking." />'),

    ('<meta property="og:type" content="website">',
     '<meta property="og:type" content="website" />'),

    # og:image относительный -> абсолютный (если у тебя og.png в корне)
    ('<meta property="og:image" content="og.png">',
     '<meta property="og:url" content="https://vyto2022.github.io/vvz-site/index-fr.html" />\n'
     '  <meta property="og:image" content="https://vyto2022.github.io/vvz-site/og.png" />\n'
     '  <meta property="og:image:width" content="1200" />\n'
     '  <meta property="og:image:height" content="630" />\n'
     '  <meta name="twitter:image" content="https://vyto2022.github.io/vvz-site/og.png" />'),

    # --- hreflang + canonical (вставим сразу после description, если ещё нет) ---
]

def replace_one(s: str, old: str, new: str):
    if old not in s:
        print(f"⚠️  Not found:\n{old}\n")
        return s
    return s.replace(old, new)

for old, new in repl:
    html = replace_one(html, old, new)

# hreflang/canonical: вставляем после meta description, если ещё не вставляли
hreflang_block = (
    '  <link rel="alternate" hreflang="en" href="https://vyto2022.github.io/vvz-site/index.html">\n'
    '  <link rel="alternate" hreflang="fr" href="https://vyto2022.github.io/vvz-site/index-fr.html">\n'
    '  <link rel="canonical" href="https://vyto2022.github.io/vvz-site/index-fr.html">\n'
)

marker = '<meta name="description" '
if hreflang_block.strip() not in html:
    # вставим сразу после строки с description
    lines = html.splitlines(True)
    out = []
    inserted = False
    for line in lines:
        out.append(line)
        if (not inserted) and line.strip().startswith('<meta name="description"'):
            out.append(hreflang_block)
            inserted = True
    html = "".join(out)
    if inserted:
        print("✅ Inserted hreflang/canonical block.")
    else:
        print("⚠️  Could not insert hreflang block (description meta not found).")

# --- NAV translations (точечные замены) ---
nav_repl = [
    (">Work<", ">Réalisations<"),
    (">Services<", ">Services<"),
    (">Process<", ">Process<"),
    (">Trust<", ">Confiance<"),
    (">Pricing<", ">Tarifs<"),
    (">FAQ<", ">FAQ<"),
    (">Get a quote<", ">Demander un devis<"),
    (">See work<", ">Voir les exemples<"),
]
for old, new in nav_repl:
    html = replace_one(html, old, new)

# --- HERO translations (если у тебя строки совпадают) ---
hero_repl = [
    ("Local service landing pages that bring real leads.",
     "Landing pages pour services locaux qui génèrent de vrais prospects."),
    ("VVZ Studio builds fast, clean pages for local businesses: clear offer, trust blocks, and a form that converts — delivered in 3–7 days.",
     "Landing pages orientées conversion pour services locaux — offre claire, preuves, capture de leads — livrées en 3 à 7 jours."),
    ("Perfect for auto services, detailing, tire shops, cleaning, repairs — any local service.",
     "Idéal pour garages, detailing, pneus, nettoyage, réparations — tout service local."),
]
for old, new in hero_repl:
    html = replace_one(html, old, new)

# --- WORK intro + cards (мягко, по твоим текущим формулировкам) ---
work_repl = [
    ('3 examples of “local service” pages (click to open the case).',
     '3 exemples pour services locaux — structure + logique de conversion à l’intérieur.'),
    ('Auto Service — Bookings', 'Garage — Plus de réservations'),
    ('Car Detailing — Premium', 'Detailing — Offre premium'),
    ('Tire Shop — Seasonal Calls', 'Pneus — Appels saisonniers'),
    ('View case →', 'Voir le cas →'),
]
for old, new in work_repl:
    html = replace_one(html, old, new)

# --- Language switcher (если ты добавил EN/FR блок) ---
html = html.replace('href="index-fr.html"', 'href="index-fr.html" class="lang-link is-active"')  # мягкая попытка
html = html.replace('href="index.html" class="lang-link is-active"', 'href="index.html"')      # чтобы EN не был active

DST.write_text(html, encoding="utf-8")
print(f"✅ Generated {DST}")
