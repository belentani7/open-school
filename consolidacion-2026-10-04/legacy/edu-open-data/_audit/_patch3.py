# -*- coding: utf-8 -*-
F = r"C:\Users\USER\edu-open-data\_audit\_report.py"
s = open(F, "r", encoding="utf-8").read().replace("\r\n", "\n")

# 1) add candidate computation after fams.sort
old = "fams.sort(key=lambda f: (-len(f[3]), f[0]))"
new = old + '''
canon_names = {f[2]["name"] for f in fams}
cand     = [r for r in bk_union if not r["isArchived"] and not CLIENT_RX.search(r["name"]) and r["name"] not in canon_names]
cand_pub = [r for r in cand if not r["isPrivate"]]
arch_canon = [f for f in fams if f[2]["isArchived"]]'''
assert old in s and "canon_names" not in s, "anchor1"
s = s.replace(old, new, 1)
print("OK cand")

# 2) replace 3a block
old3a = '''W("The 109-repo local-PC cohort is **already archived**, so its proposed-archive count is **0**. The candidates below are the **%d live, backup/archive/export-named, non-client** repos. All are **private** (0 public), so archiving is not externally visible and is reversible with `gh repo unarchive`.\\n\\n" % len(bk_live))
W("**Count: %d**\\n\\n```powershell\\n" % len(bk_live))
for r in bk_live: W("gh repo archive %s\\n" % r["name"])'''
new3a = '''W("The 109-repo local-PC cohort is **already archived**, so its proposed-archive count is **0**.\\n\\n")
W("Candidate rule: repo is **live** AND (name **or** description matches the backup regex) AND **not** client-flagged AND **not** the canonical of any family (canonicals are the keep targets, so they are excluded to avoid contradicting 3b). That yields **%d** repos, of which **%d are private** and **%d are PUBLIC** (public ones are flagged below - see 4a).\\n\\n" % (len(cand), len(cand)-len(cand_pub), len(cand_pub)))
W("**Count: %d**\\n\\n```powershell\\n" % len(cand))
for r in cand:
    W(("# PUBLIC - visible: " if not r["isPrivate"] else "# ") + ("gh repo archive %s\\n" % r["name"]))'''
assert old3a in s, "anchor3a"
s = s.replace(old3a, new3a, 1)
print("OK 3a")

# 3) 2b caveat
old2bc = '''W("**%d families detected, covering %d of %d repos** (%d singletons).\\n\\n" % (len(fams), len(claimed), total, total-len(claimed)))'''
new2bc = old2bc + '''
W("**Caveat on canonical picks:** **%d of the %d canonicals land on an already-archived member.** The supplied rule (`stars > push > shortest name`) has no live-preference, and since all %d repos have 0 stars, recency alone decides. Treat an `arch` canonical as KEEP-VERIFY: prefer the newest `live` member of that family when the canonical is archived.\\n\\n" % (len(arch_canon), len(fams), total))'''
assert old2bc in s, "anchor2bc"
s = s.replace(old2bc, new2bc, 1)
print("OK caveat")

# 4) caption fix
s = s.replace('Full public list (%d), 5 per line:', 'Full public list (%d), comma-separated:', 1)
print("OK caption")

# 5) summary count
s = s.replace('W("- Backups: cohort `%s` = **%d**, all already archived, 0 actionable. Live backup-named repos = **%d** (proposed archive count = **%d** after the hold guard).\\n" % (PC_DESC, len(pc), len(bk_live)+len(held_bk), len(bk_live)))',
              'W("- Backups: cohort `%s` = **%d**, all already archived, 0 actionable. Live backup-shaped repos (name or description) = **%d** (proposed archive count = **%d** after excluding client holds and family canonicals).\\n" % (PC_DESC, len(pc), len([r for r in bk_union if not r["isArchived"]]), len(cand)))', 1)
print("OK summary")

open(F, "w", encoding="utf-8", newline="\n").write(s)
print("PATCHED")
