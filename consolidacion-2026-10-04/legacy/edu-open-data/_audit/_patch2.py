# -*- coding: utf-8 -*-
F = r"C:\Users\USER\edu-open-data\_audit\_report.py"
s = open(F, "r", encoding="utf-8").read().replace("\r\n", "\n")

helper = '''def wrap_list(names, width=104):
    lines, cur = [], ""
    for n in names:
        piece = n if not cur else ", " + n
        if len(cur) + len(piece) > width:
            lines.append(cur); cur = n
        else:
            cur = cur + piece
    if cur: lines.append(cur)
    return lines

'''
anchor = "o = io.StringIO(); W = o.write"
assert anchor in s, "anchor missing"
s = s.replace(anchor, helper + anchor, 1)
print("OK helper")

a = '''for i in range(0, len(pc), 6):
    W("  ".join("%-27s" % r["name"] for r in pc[i:i+6]).rstrip() + "\\n")'''
assert a in s, "pc loop missing"
s = s.replace(a, 'for ln in wrap_list([r["name"] for r in pc]): W(ln + "\\n")', 1)
print("OK pc list")

b = '''for i in range(0, len(ps), 6):
    W("  ".join("%-26s" % n for n in ps[i:i+6]).rstrip() + "\\n")'''
assert b in s, "ps loop missing"
s = s.replace(b, 'for ln in wrap_list(ps): W(ln + "\\n")', 1)
print("OK pub list")

c = '''for i in range(0, len(pub_in_fam), 3):
    W("  ".join("%-40s" % n for n in pub_in_fam[i:i+3]).rstrip() + "\\n")'''
assert c in s, "pubfam loop missing"
s = s.replace(c, 'for ln in wrap_list(pub_in_fam): W(ln + "\\n")', 1)
print("OK pubfam list")

open(F, "w", encoding="utf-8", newline="\n").write(s)
print("PATCHED")
