# -*- coding: utf-8 -*-
F = r"C:\Users\USER\edu-open-data\_audit\_report.py"
s = open(F, "r", encoding="utf-8").read().replace("\r\n", "\n")
a = 'disk_top = sorted(repos, key=lambda r: -du(r))[:18]'
assert a in s; s = s.replace(a, 'disk_top = sorted(repos, key=lambda r: -du(r))[:14]', 1)
b = 'W("Top 18 by `diskUsage` (KB).'
assert b in s; s = s.replace(b, 'W("Top 14 by `diskUsage` (KB).', 1)
c = 'W("\\n### 3c. Descriptions can be regenerated'
assert c in s; s = s.replace(c, 'W("### 3c. Descriptions can be regenerated', 1)
open(F, "w", encoding="utf-8", newline="\n").write(s)
print("PATCHED")
