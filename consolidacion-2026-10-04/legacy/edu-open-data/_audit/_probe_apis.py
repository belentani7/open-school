import re
p = r"C:\Users\USER\.local\share\mimocode\tool-output\tool_g001a09789e63a001P0jZsSXL2"
lines = open(p, encoding="utf-8", errors="replace").read().split("\n")
cat = None
rows = []
JUNK = {"Anime", "Cryptocurrency", "Games & Comics", "Personality", "Sports & Fitness",
        "Video", "Food & Drink", "Weather", "Blockchain", "Currency Exchange",
        "URL Shorteners", "Tracking", "Phone", "Shopping", "Entertainment", "Sports & Fitness"}
row_re = re.compile(r"^\|\s*\[(?P<name>[^\]]+)\]\((?P<url>[^)]+)\)\s*\|\s*(?P<desc>[^|]+)\|\s*(?P<auth>[^|]+?)\s*\|\s*(?P<https>[^|]+?)\s*\|\s*(?P<cors>[^|]+?)\s*\|\s*$")
for ln in lines:
    if ln.startswith("### "):
        cat = ln[4:].strip()
    m = row_re.match(ln)
    if m:
        rows.append((cat, m.group("name"), m.group("url"), m.group("auth"), m.group("https"), m.group("cors")))
ok = [r for r in rows if r[3] == "No" and r[4] == "Yes"]
print("parsed rows", len(rows))
print("Auth=No & HTTPS=Yes", len(ok))
cats = {}
for r in ok:
    cats.setdefault(r[0], 0)
    cats[r[0]] += 1
print("categories with keeps", len(cats))
print(sorted(cats.items(), key=lambda kv: -kv[1]))
print("junk-cat keeps", sum(v for k, v in cats.items() if k in JUNK))
print("cors yes", sum(1 for r in ok if r[5] == "Yes"))
