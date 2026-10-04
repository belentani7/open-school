import pathlib, re, collections

p = pathlib.Path(r"C:\Users\USER\.local\share\mimocode\tool-output\tool_g001a09789e63a001P0jZsSXL2")
raw = p.read_bytes()
for enc in ("utf-8", "utf-8-sig", "utf-16", "cp1252"):
    try:
        t = raw.decode(enc)
        print("DECODE OK:", enc, "chars:", len(t))
        break
    except UnicodeDecodeError as e:
        print("fail", enc, e)

lines = t.splitlines()
print("lines:", len(lines))
print("--- first 30 ---")
for ln in lines[:30]:
    print(repr(ln[:160]))

ROW = re.compile(
    r"^\|\s*\[(?P<name>[^\]]+)\]\((?P<url>[^)]+)\)\s*\|(?P<desc>[^|]+)\|(?P<auth>[^|]+)\|(?P<https>[^|]+)\|(?P<cors>[^|]+)\|"
)
hits = [ROW.match(l) for l in lines]
hits = [h for h in hits if h]
print("--- row matches:", len(hits))
auth = collections.Counter(h.group("auth").strip() for h in hits)
print("auth:", auth.most_common(10))
https = collections.Counter(h.group("https").strip() for h in hits)
print("https:", https.most_common(5))
ok = [h for h in hits if h.group("auth").strip() == "No" and h.group("https").strip() == "Yes"]
print("auth=No & https=Yes:", len(ok))
for h in ok[:8]:
    print("  *", h.group("name"), "|", h.group("url")[:90], "| cors=", h.group("cors").strip())
print("--- headers (## ) ---")
hdrs = [l for l in lines if l.startswith("###")]
print(len(hdrs), hdrs[:12])
