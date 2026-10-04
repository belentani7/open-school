# -*- coding: utf-8 -*-
import json, re, datetime, io

SRC = r"C:\Users\USER\edu-open-data\_audit\repos_utf8.json"
OUT = r"C:\Users\USER\edu-open-data\_audit\github-cleanup-dryrun.md"
TS  = datetime.datetime.now().astimezone().strftime("%Y-%m-%d %H:%M:%S %z")

repos = json.load(open(SRC, encoding="utf-8-sig"))
repos.sort(key=lambda r: r["name"].lower())

def d(r):  return (r.get("description") or "").strip()
def lg(r):
    pl = r.get("primaryLanguage")
    return (pl.get("name") if isinstance(pl, dict) else None) or "-"
def pa(r): return (r.get("pushedAt") or "")[:10]
def du(r): return r.get("diskUsage") or 0

total, arch = len(repos), [r for r in repos if r["isArchived"]]
notarch = [r for r in repos if not r["isArchived"]]
priv    = [r for r in repos if r["isPrivate"]]
pub     = [r for r in repos if not r["isPrivate"]]
starg   = [r for r in repos if r.get("stargazerCount",0) > 0]
nodesc  = [r for r in repos if not d(r)]

PC_DESC = "Backup local PC 2026-08-29"
pc      = [r for r in repos if d(r) == PC_DESC]
pc_live = [r for r in pc if not r["isArchived"]]
CLIENT_RX = re.compile(r"(natalia|carquidex|carquide|steven|michelle|relayze|artequeveste|arte-que-veste|sabons|marcia|cuidar|no-tocar)", re.I)
BK_RX   = re.compile(r"(backup|copia|snapshot|export|archiv|respaldo|archive)", re.I)
bk_name = [r for r in repos if BK_RX.search(r["name"])]
bk_dsc  = [r for r in repos if BK_RX.search(d(r))]
bk_union= sorted({r["name"]:r for r in bk_name+bk_dsc}.values(), key=lambda r:r["name"].lower())
bk_not_pc = [r for r in bk_union if r not in pc]
bk_live = [r for r in bk_name if not r["isArchived"] and not CLIENT_RX.search(r["name"])]
held_bk = [r for r in bk_name if not r["isArchived"] and CLIENT_RX.search(r["name"])]

FAM = [
 ("belentani-omega",        r"^belentani[-_]omega",              "known"),
 ("belentani-judas",        r"^belentani[-_]judas",              "known"),
 ("duck-zion",              r"^duck[-_]zion",                    "known"),
 ("duck-studio",            r"^duck[-_]studio",                  "known"),
 ("noiacore-lab",           r"^noiacore[-_]lab",                 "known"),
 ("cruzando-el-charco",     r"^(cruzando[-_]el|clon)",           "known"),
 ("music-os",               r"^music[-_]os",                     "known"),
 ("manosabiertas",          r"^(manos[-_]?abiertas|maos[-_]abertas|abraz|clon[-_]manosabiertas)","known"),
 ("belentani-studio",       r"^belentani[-_]studio",             "known"),
 ("tender-words",           r"^tender[-_]words",                 "known"),
 ("linguaforge",            r"^linguaforge",                     "known"),
 ("carquidec",              r"carquide",                         "CLIENT"),
 ("heyduck",                r"^hey[-_]?duck",                    "known"),
 ("voice-bot-saas",         r"^voice[-_]?bot|^voice[-_]assistant|^voice[-_]ai|^voicerestore","known"),
 ("duck-unified-master",    r"^duck[-_]unified",                 "known"),
 ("natalia-marinho",        r"^natalia",                         "CLIENT"),
 ("secure-t",               r"^secure[-_]?t|^securetea",         "extra"),
 ("noiacore (broad)",       r"^noiacore",                        "extra"),
 ("aion",                   r"^aion|^08[-_]AION",                "extra"),
 ("judas (non-belentani)",  r"^judas|^the[-_]judas|^UIJUDAS",    "extra"),
 ("duck-ecosystem",         r"^duck[-_]ecosystem",               "extra"),
 ("duck-2000",              r"^duck[-_]2000",                    "extra"),
 ("duck-2026",              r"^duck[-_]2026",                    "extra"),
 ("duck-apps",              r"^duck[-_]apps",                    "extra"),
 ("duck-lab",               r"^duck[-_]lab",                     "extra"),
 ("duck-music",             r"^duck[-_]music",                   "extra"),
 ("duck-producao",          r"^duck[-_]producao",                "extra"),
 ("duck-full-studio-pro",   r"^duck[-_]full[-_]studio",          "extra"),
 ("03-duck-web",            r"^03[-_]duck",                      "extra"),
 ("claude-skills",          r"^claude[-_]skills",                "extra"),
 ("local-agent",            r"^local[-_]agent",                  "extra"),
 ("belentani-video",        r"^belentani[-_]video",              "extra"),
 ("belentani-unified",      r"^belentani[-_]unified",            "extra"),
 ("belentani-ecosystem",    r"^belentani[-_]ecosystem",          "extra"),
 ("belentani-java",         r"^belentani[-_]java",               "extra"),
 ("belentani-cv-ai",        r"^belentani[._-]cv",                "extra"),
 ("aurea3d-premium",        r"^aurea3d",                         "extra"),
 ("belentani-the",          r"^belentani[-_]the",                "extra"),
 ("omega-*",                r"^omega[-_](infinite|core|max)",    "extra"),
 ("pvc-u",                  r"^pvc[-_]u|^metricool[-_]pvcu",     "extra"),
 ("rh-fiscal",              r"^rh[-_]fiscal",                    "extra"),
 ("nexus-workforce",        r"^nexus[-_]workforce",              "extra"),
 ("ctg-psicologia",         r"^ctg[-_]psicologia",               "extra"),
 ("lingua-aberta",          r"^lingua[-_]aberta",                "extra"),
 ("william",                r"^william",                         "extra"),
 ("steven-renovation",      r"^steven",                          "CLIENT"),
 ("sabons",                 r"^sabons",                          "CLIENT"),
 ("artequeveste",           r"^arte[-_]?que",                    "CLIENT"),
 ("michelle/relayze",       r"^michelle|relayze",                "CLIENT"),
 ("marcia/cuidar",          r"^marcia|cuidar",                   "CLIENT"),
 ("newbelentani",           r"^newbelentani",                    "extra"),
 ("platform1/2/3",          r"^platform\d",                      "extra"),
 ("skills-registry",        r"^skills[-_](registry|marketplace)", "extra"),
 ("free-claude-code",       r"^free[-_]claude",                  "extra"),
 ("pedro-belentani-blog",   r"^pedro[-_]belentani",              "extra"),
 ("belentani7 profile",     r"^belentani7",                      "extra"),
 ("superpowers",            r"^superpowers",                     "extra"),
 ("premium-effects",        r"^premium[-_]effects",              "extra"),
 ("meta-skill packs",       r"^(meta[-_]?skill|metaskill|meta[-_]design)", "extra"),
]
claimed, fams = {}, []
for label, pat, kind in FAM:
    rx = re.compile(pat, re.I)
    mem = [r for r in repos if rx.search(r["name"]) and r["name"] not in claimed]
    if len(mem) < 2: continue
    for r in mem: claimed[r["name"]] = label
    canon = sorted(mem, key=lambda r: (-r.get("stargazerCount",0), r.get("pushedAt") or "", len(r["name"]), r["name"]))[0]
    fams.append((label, kind, canon, mem))
fams.sort(key=lambda f: (-len(f[3]), f[0]))
canon_names = {f[2]["name"] for f in fams}
cand     = [r for r in bk_union if not r["isArchived"] and not CLIENT_RX.search(r["name"]) and r["name"] not in canon_names]
cand_pub = [r for r in cand if not r["isPrivate"]]
arch_canon = [f for f in fams if f[2]["isArchived"]]

def flags(r, canon):
    f = []
    f.append("arch" if r["isArchived"] else "live")
    f.append("priv" if r["isPrivate"] else "PUBLIC")
    if r["name"] == canon["name"]: f.append("CANON")
    if not d(r): f.append("nodesc")
    return ",".join(f)

du_total = sum(du(r) for r in repos)
disk_top = sorted(repos, key=lambda r: -du(r))[:14]
du_100 = [r for r in repos if du(r) > 100000]
pub_in_fam = sorted({r["name"] for _,_,_,m in fams for r in m if not r["isPrivate"]})
client_all = [r for r in repos if CLIENT_RX.search(r["name"])]
nd60 = nodesc[:60]
def wrap_list(names, width=104):
    lines, cur = [], ""
    for n in names:
        piece = n if not cur else ", " + n
        if len(cur) + len(piece) > width:
            lines.append(cur); cur = n
        else:
            cur = cur + piece
    if cur: lines.append(cur)
    return lines

o = io.StringIO(); W = o.write

W("# GitHub Cleanup - READ-ONLY DRY RUN (belentani7)\n\n")
W("**STATUS: NOTHING EXECUTED.** No repo was archived, edited, renamed, or deleted. This is evidence + proposal only.\n\n")
W("- **Generated (local):** `%s`\n" % TS)
W("- **Account:** `belentani7` (gh CLI, active keyring profile; token scopes include `repo`, `delete_repo`)\n")
W("- **Evidence artifacts:** `C:\\Users\\USER\\edu-open-data\\_audit\\repos_utf8.json` (UTF-8+BOM, 113,125 bytes) and `repos.json` (same payload, PowerShell default UTF-16LE). All numbers below are derived from these files.\n\n")

W("## 0. Exact commands executed\n\n```powershell\n")
W("gh auth status\n\n")
W("gh repo list belentani7 --limit 1000 --json name,description,isArchived,isPrivate,primaryLanguage,pushedAt,stargazerCount,diskUsage > \"C:\\Users\\USER\\edu-open-data\\_audit\\repos.json\"\n\n")
W("gh repo list belentani7 --limit 1000 --json name,description,isArchived,isPrivate,primaryLanguage,pushedAt,stargazerCount,diskUsage | Out-File -FilePath \"C:\\Users\\USER\\edu-open-data\\_audit\\repos_utf8.json\" -Encoding utf8\n\n")
W("python \"C:\\Users\\USER\\edu-open-data\\_audit\\_report.py\"   # read-only analysis + render\n```\n\n")
W("> Only `gh repo list` (read-only) was ever called. No `gh repo archive` / `edit` / `rename` / `delete` was issued.\n\n---\n\n")

W("## 1. Headline counts\n\n| Metric | Count |\n|---|---:|\n")
W("| Total repositories | **%d** |\n" % total)
W("| Already archived | **%d** (%.1f%%) |\n" % (len(arch), 100.0*len(arch)/total))
W("| Not archived (live) | **%d** |\n" % len(notarch))
W("| Private | **%d** |\n" % len(priv))
W("| Public | **%d** |\n" % len(pub))
W("| `stargazerCount > 0` | **%d** |\n" % len(starg))
W("| Empty/null description | **%d** (%.1f%%) |\n" % (len(nodesc), 100.0*len(nodesc)/total))
W("| Description = `%s` | **%d** |\n" % (PC_DESC, len(pc)))
W("| Total `diskUsage` | **%d KB** (~%.1f GB) |\n" % (du_total, du_total/1048576.0))
W("| Repos > 100 MB | **%d** |\n" % len(du_100))
W("\n**Repos with `stargazerCount > 0`:** %s\n\n" % (", ".join("`%s` (%d)" % (r["name"], r["stargazerCount"]) for r in starg) if starg else "**NONE - all %d repos have exactly 0 stars.**" % total))
W("---\n\n")

W("## 2a. BACKUPS / ARCHIVES / EXPORTS\n\n")
W("Regex `backup|copia|snapshot|export|archiv|respaldo|archive` applied case-insensitively to **name** and **description**.\n\n")
W("| Bucket | Count |\n|---|---:|\n")
W("| Description exactly `%s` | **%d** |\n" % (PC_DESC, len(pc)))
W("| ...of those, already archived | **%d** |\n" % (len(pc)-len(pc_live)))
W("| ...of those, still live (TO ARCHIVE) | **%d** |\n" % len(pc_live))
W("| ...of those, private | **%d** |\n" % len([r for r in pc if r["isPrivate"]]))
W("| Name matches backup pattern | **%d** |\n" % len(bk_name))
W("| Description matches backup pattern | **%d** |\n" % len(bk_dsc))
W("| UNION (name OR description) | **%d** |\n" % len(bk_union))
W("| UNION minus the `%s` cohort | **%d** |\n\n" % (PC_DESC, len(bk_not_pc)))
W("**Key correction to the prior estimate:** the ~109 local-PC backups are **already 100%% archived** (109/109, all private, 0 live). There is nothing left to archive in that cohort - a prior pass already did it. The real remaining backup-shaped targets are the **%d** explicitly-named archive/export repos below.\n\n" % len(bk_live))
W("### A.1 - `%s` cohort: %d repos, ALL already archived, ALL private\n\n" % (PC_DESC, len(pc)))
W("Shown for completeness (verifies the earlier cleanup pass). None are actionable.\n\n```text\n")
for ln in wrap_list([r["name"] for r in pc]): W(ln + "\n")
W("```\n\n")
W("### A.2 - Explicit archive/export/snapshot/backup-named repos (%d, excluding cohort)\n\n| Repo | State | Visibility | diskUsage KB | Description |\n|---|---|---|---:|---|\n" % len(bk_not_pc))
for r in bk_not_pc:
    W("| `%s` | %s | %s | %d | %s |\n" % (r["name"], "archived" if r["isArchived"] else "**LIVE**",
      "private" if r["isPrivate"] else "**PUBLIC**", du(r), (d(r)[:58] or "_empty_").replace("|","/")))
W("\n---\n\n")

W("## 2b. DUPLICATE FAMILIES\n\n")
W("Detection = curated case-insensitive regex rules (the 16 supplied families + auto-detected extras with >= 2 members). Canonical = **most stars > most recent push > shortest name**. Flag legend: `arch`=archived, `live`=active, `priv`/`PUBLIC`, `CANON`=keep candidate, `nodesc`=no description.\n\n")
W("**%d families detected, covering %d of %d repos** (%d singletons).\n\n" % (len(fams), len(claimed), total, total-len(claimed)))
W("**Caveat on canonical picks:** **%d of the %d canonicals land on an already-archived member.** The supplied rule (`stars > push > shortest name`) has no live-preference, and since all %d repos have 0 stars, recency alone decides. Treat an `arch` canonical as KEEP-VERIFY: prefer the newest `live` member of that family when the canonical is archived.\n\n" % (len(arch_canon), len(fams), total))
W("| Family | Kind | n | Canonical (keep) | Rec | Members (flags) |\n|---|---|---:|---|---|---|\n")
for label, kind, canon, mem in fams:
    mems = ", ".join("`%s`(%s)" % (r["name"], flags(r, canon)) for r in sorted(mem, key=lambda x:x["name"].lower()))
    if kind == "CLIENT":
        rec = "**DO NOT TOUCH**"
    elif len(mem) == 1:
        rec = "KEEP"
    else:
        rec = "KEEP 1 / ARCH %d live" % len([r for r in mem if r["name"] != canon["name"] and not r["isArchived"]])
    W("| **%s** | %s | %d | `%s` | %s | %s |\n" % (label, kind, len(mem), canon["name"], rec, mems))
W("\n---\n\n")

W("## 2c. NO-DESCRIPTION REPOS\n\n")
W("Exact count: **%d of %d (%.1f%%)** have an empty or null description.\n\n" % (len(nodesc), total, 100.0*len(nodesc)/total))
W("First 60 (alphabetical) with `primaryLanguage`:\n\n| # | Repo | primaryLanguage | Archived | Private |\n|---:|---|---|---|---|\n")
for i, r in enumerate(nd60, 1):
    W("| %d | `%s` | %s | %s | %s |\n" % (i, r["name"], lg(r), "Y" if r["isArchived"] else "-", "Y" if r["isPrivate"] else "PUBLIC"))
W("\n*(remaining %d no-description repos omitted for length; full set in `repos_utf8.json`)*\n\n---\n\n" % (len(nodesc)-len(nd60)))

W("## 3. PROPOSED ACTIONS - **NOT EXECUTED**\n\n> Nothing below has been run. These are review candidates only.\n\n")
W("### 3a. Backups - `gh repo archive` candidate list\n\n")
W("The 109-repo local-PC cohort is **already archived**, so its proposed-archive count is **0**.\n\n")
W("Candidate rule: repo is **live** AND (name **or** description matches the backup regex) AND **not** client-flagged AND **not** the canonical of any family (canonicals are the keep targets, so they are excluded to avoid contradicting 3b). That yields **%d** repos, of which **%d are private** and **%d are PUBLIC** (public ones are flagged below - see 4a).\n\n" % (len(cand), len(cand)-len(cand_pub), len(cand_pub)))
W("**Count: %d**\n\n```powershell\n" % len(cand))
for r in cand:
    W("gh repo archive %s%s\n" % (r["name"], "   # PUBLIC - visible" if not r["isPrivate"] else ""))
W("```\n\n")
W("Held back by the client / explicit-hold guard (%d): %s\n\n" % (len(held_bk), ", ".join("`%s`" % r["name"] for r in held_bk) if held_bk else "_none_"))
W("### 3b. Family recommendations (keep / merge / archive)\n\nPer-family recommendations are in the **Rec** column of the 2b table above: **%d** families are `KEEP 1 / ARCH n live` (keep the canonical, archive the redundant live copies after diffing history first), **%d** are **DO NOT TOUCH** client families. Nothing was executed.\n\n" % (len([f for f in fams if f[1] != "CLIENT" and len(f[3]) > 1]), len([f for f in fams if f[1] == "CLIENT"])))
W("### 3c. Descriptions can be regenerated\n\n")
W("The **%d** no-description repos and the **%d** `%s` cohort need no manual writing. A generator pass over each repo's manifest/README can emit `gh repo edit --description`, a text-only reversible metadata change. Suggested sequencing: (1) archive backup-shaped repos, (2) collapse families, (3) batch-regenerate descriptions for survivors, (4) archive the emptied shells. Do each step as a separate reviewed batch, never a single scripted sweep.\n\n" % (len(nodesc), len(pc), PC_DESC))
W("---\n\n")

W("## 4. RISKS\n\n")
W("### 4a. PUBLIC repos - archiving is publicly visible\n\n")
W("**%d public / %d private / %d total.** Archiving a public repo flips a visible archived badge and drops it from search and profile listings. Its content stays reachable, so this is low-data-risk but high-visibility.\n\n" % (len(pub), len(priv), total))
W("Full public list (%d), comma-separated:\n\n```text\n" % len(pub))
ps = sorted(r["name"] for r in pub)
for ln in wrap_list(ps): W(ln + "\n")
W("```\n\n**%d of those public repos sit inside a duplicate family** (archive here = most visible action):\n\n```text\n" % len(pub_in_fam))
for ln in wrap_list(pub_in_fam): W(ln + "\n")
W("```\n\n")

W("### 4b. CLIENT repos - never touch\n\n")
W("Matched by `natalia* | carquidex* | carquide* | steven* | michelle* | relayze* | artequeveste | sabons* | marcia* | cuidar*` plus the literal `no-tocar` hold. **%d repos.** Several are deliverable/client sites. Do not archive, rename, edit, or delete any of them.\n\n" % len(client_all))
W("| Repo | Archived | Visibility | Why flagged |\n|---|---|---|---|\n")
for r in client_all:
    why = "explicit `no-tocar` hold" if "no-tocar" in r["name"].lower() else "client name pattern"
    W("| `%s` | %s | %s | %s |\n" % (r["name"], "Y" if r["isArchived"] else "no", "**PUBLIC**" if not r["isPrivate"] else "private", why))
W("\nExposure: **%d** client-flagged repos are currently PUBLIC.\n\n" % len([r for r in client_all if not r["isPrivate"]]))
W("### 4c. Disk usage outliers\n\n")
W("Top 14 by `diskUsage` (KB). %d repos exceed 100 MB; account total **%d KB (~%.1f GB)**. Space is recovered by collapsing the big redundant families, not by archiving tiny shells.\n\n" % (len(du_100), du_total, du_total/1048576.0))
W("| diskUsage KB | Repo | Visibility | State |\n|---:|---|---|---|\n")
for r in disk_top:
    W("| %d | `%s` | %s | %s |\n" % (du(r), r["name"], "priv" if r["isPrivate"] else "**PUBLIC**", "archived" if r["isArchived"] else "live"))
W("\nNote the `carquidec` cluster: 5 near-identical ~517 MB copies (CLIENT - do not touch). `belentani-Omega` (1,050 MB) and `belentani-os` (1,121 MB) are both already archived, so their size is retained, not freed, by archiving.\n\n")
W("### 4d. Other cautions\n\n")
W("- `backup-no-tocar-2026-09-10` is a literal \"do not touch\" hold - excluded from every proposed list.\n")
W("- `archivo-fabi-privado` and `cuidamar-privacidad-portable` imply third-party personal data - treat as sensitive even though private.\n")
W("- `mimocode-workspace-backup`, `prometheus-omega-backup`, `belentani_omega_backup`, `secure-t-archive` are named backups of live work - confirm the live counterpart exists and is newer before archiving.\n")
W("- **%d repos are already archived**; they will likely dominate any `gh repo list` you eyeball, which is why raw counts mislead.\n" % len(arch))
W("- Family regexes are heuristic: a few singleton repos with shared brand prefixes (e.g. `belentani-never-listed`) may belong to families not captured here. Review the member lists above before acting.\n\n")
W("---\n\n")
W("## 5. Summary\n\n")
W("- **%d** repos; **%d** archived; **%d** live; **%d** private; **%d** public; **0** with any stars.\n" % (total, len(arch), len(notarch), len(priv), len(pub)))
W("- Backups: cohort `%s` = **%d**, all already archived, 0 actionable. Live backup-shaped repos (name or description) = **%d** (proposed archive count = **%d** after excluding client holds and family canonicals).\n" % (PC_DESC, len(pc), len([r for r in bk_union if not r["isArchived"]]), len(cand)))
W("- Families: **%d** detected covering **%d** repos; **%d** include client repos that must never be touched.\n" % (len(fams), len(claimed), len([f for f in fams if f[1]=="CLIENT"])))
W("- **%d** repos have no description (regenerable via `gh repo edit`).\n" % len(nodesc))
W("- **NOTHING WAS EXECUTED.** Confirmed no mutating `gh repo` subcommand was invoked.\n")

open(OUT, "w", encoding="utf-8", newline="\n").write(o.getvalue())
print("WROTE", OUT)
print("LINES", o.getvalue().count("\n"))
print("families", len(fams), "claimed", len(claimed))
print("pc", len(pc), "pc_live", len(pc_live), "bk_live", len(bk_live), "held", len(held_bk), "bk_not_pc", len(bk_not_pc))
print("pub", len(pub), "nodesc", len(nodesc), "arch", len(arch), "priv", len(priv), "client", len(client_all))

