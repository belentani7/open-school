# -*- coding: utf-8 -*-
import io
F = r"C:\Users\USER\edu-open-data\_audit\_report.py"
s = open(F, "r", encoding="utf-8").read().replace("\r\n", "\n")

old2b = '''W("| Family | Kind | n | Canonical | Archived | Public | Members (flags) |\\n|---|---|---:|---|---:|---:|---|\\n")
for label, kind, canon, mem in fams:
    na = len([r for r in mem if r["isArchived"]]); npu = len([r for r in mem if not r["isPrivate"]])
    mems = ", ".join("`%s`(%s)" % (r["name"], flags(r, canon)) for r in sorted(mem, key=lambda x:x["name"].lower()))
    W("| **%s** | %s | %d | `%s` | %d | %d | %s |\\n" % (label, kind, len(mem), canon["name"], na, npu, mems))'''

new2b = '''W("| Family | Kind | n | Canonical (keep) | Rec | Members (flags) |\\n|---|---|---:|---|---|---|\\n")
for label, kind, canon, mem in fams:
    mems = ", ".join("`%s`(%s)" % (r["name"], flags(r, canon)) for r in sorted(mem, key=lambda x:x["name"].lower()))
    if kind == "CLIENT":
        rec = "**DO NOT TOUCH**"
    elif len(mem) == 1:
        rec = "KEEP"
    else:
        rec = "KEEP 1 / ARCH %d live" % len([r for r in mem if r["name"] != canon["name"] and not r["isArchived"]])
    W("| **%s** | %s | %d | `%s` | %s | %s |\\n" % (label, kind, len(mem), canon["name"], rec, mems))'''

assert old2b in s, "2b block not found"
s = s.replace(old2b, new2b, 1)
print("OK 2b merged")

old3b = 'W("### 3b. Family recommendations (keep / merge / archive)\\n\\nPer-family recommendations are in the **Rec** column of the 2b table above: **%d** families are `KEEP 1 / ARCH n live` (keep the canonical, archive the redundant live copies after diffing), **%d** are singletons (KEEP only), and **%d** are **DO NOT TOUCH** client families. Nothing was executed.\\n\\n") if False else None'
new3b = 'W("### 3b. Family recommendations (keep / merge / archive)\\n\\nPer-family recommendations are in the **Rec** column of the 2b table above: **%d** families are `KEEP 1 / ARCH n live` (keep the canonical, archive the redundant live copies after diffing history first), **%d** are **DO NOT TOUCH** client families. Nothing was executed.\\n\\n" % (len([f for f in fams if f[1] != "CLIENT" and len(f[3]) > 1]), len([f for f in fams if f[1] == "CLIENT"])))'
assert old3b in s, "3b block not found"
s = s.replace(old3b, new3b, 1)
print("OK 3b fixed")

s = s.replace('for i in range(0, len(pc), 5):\n    W("  ".join("%-32s" % r["name"] for r in pc[i:i+5]).rstrip() + "\\n")',
              'for i in range(0, len(pc), 6):\n    W("  ".join("%-27s" % r["name"] for r in pc[i:i+6]).rstrip() + "\\n")', 1)
s = s.replace('for i in range(0, len(ps), 5):\n    W("  ".join("%-30s" % n for n in ps[i:i+5]).rstrip() + "\\n")',
              'for i in range(0, len(ps), 6):\n    W("  ".join("%-26s" % n for n in ps[i:i+6]).rstrip() + "\\n")', 1)
print("OK list compaction")

open(F, "w", encoding="utf-8", newline="\n").write(s)
print("PATCHED")
