# -*- coding: utf-8 -*-
F = r"C:\Users\USER\edu-open-data\_audit\_report.py"
s = open(F, "r", encoding="utf-8").read().replace("\r\n", "\n")
a = '''for r in cand:
    W(("# PUBLIC - visible: " if not r["isPrivate"] else "# ") + ("gh repo archive %s\\n" % r["name"]))'''
b = '''for r in cand:
    W("gh repo archive %s%s\\n" % (r["name"], "   # PUBLIC - visible" if not r["isPrivate"] else ""))'''
assert a in s, "anchor"
s = s.replace(a, b, 1)
open(F, "w", encoding="utf-8", newline="\n").write(s)
print("PATCHED")
