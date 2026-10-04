import json, re, collections
SRC = r"C:\Users\USER\edu-open-data\_audit\repos_utf8.json"
repos = json.load(open(SRC, encoding="utf-8-sig"))
repos.sort(key=lambda r: r["name"].lower())
print("TOTAL", len(repos))
print("SAMPLE", json.dumps(repos[0], ensure_ascii=False))

def stem(name):
    s = name.lower().replace("_","-").replace(".","-")
    prev = None
    while prev != s:
        prev = s
        s = re.sub(r"-(v\d+(-\d+)*|\d+|export(-\d+)?|archiv\w*|backup(-v\d+)?|audited(-\d[\d-]*)?|template(-\w+)?|portal(-\w+)?|main|repo|final|rebuild|docs|web|lite|pro|ultra)$", "", s)
    return s

groups = collections.defaultdict(list)
for r in repos:
    groups[stem(r["name"])].append(r["name"])
print("=== STEM GROUPS (>=2) ===")
big = {k:v for k,v in groups.items() if len(v) > 1}
for k in sorted(big, key=lambda x: (-len(big[x]), x)):
    print(len(big[k]), k, "::", ", ".join(sorted(big[k])))

print("=== 2-TOKEN GROUPS (>=2) ===")
g2 = collections.defaultdict(list)
for r in repos:
    parts = re.split(r"[-_.]", r["name"].lower())
    g2["-".join(parts[:2])].append(r["name"])
for k in sorted(g2, key=lambda x: (-len(g2[x]), x)):
    if len(g2[k]) > 1:
        print(len(g2[k]), k, "::", ", ".join(sorted(g2[k])))

BK = re.compile(r"(backup|copia|snapshot|export|archiv|respaldo)", re.I)
bn = [r["name"] for r in repos if BK.search(r["name"])]
bd = [r["name"] for r in repos if BK.search(r.get("description") or "")]
print("=== BACKUP NAME MATCHES", len(bn), "===")
print(", ".join(sorted(bn)))
print("=== BACKUP DESC-ONLY MATCHES", len([n for n in bd if n not in bn]), "===")
print(", ".join(sorted([n for n in bd if n not in bn])))
print("=== UNION", len(set(bn)|set(bd)), "===")

CLIENT = re.compile(r"(natalia|carquidex|carquide|steven|michelle|relayze|artequeveste|arte-que-veste|sabons|marcia|cuidar)", re.I)
cl = [r["name"] for r in repos if CLIENT.search(r["name"])]
print("=== CLIENT-NAME MATCHES", len(cl), "===")
print(", ".join(sorted(cl)))

pub = [r for r in repos if not r["isPrivate"]]
print("=== PUBLIC", len(pub), "===")
print(", ".join(sorted(r["name"] for r in pub)))

print("=== TOP DISK ===")
for r in sorted(repos, key=lambda x: -(x.get("diskUsage") or 0))[:25]:
    print(r.get("diskUsage"), r["name"], "priv=" + str(r["isPrivate"]), "arch=" + str(r["isArchived"]))
print("=== STARRED ===")
for r in repos:
    if r.get("stargazerCount", 0) > 0:
        print(r["stargazerCount"], r["name"])
