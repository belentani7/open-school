import ssl, urllib.request, re
ctx = ssl._create_unverified_context()
for u in ["https://open-school-gamma.vercel.app/open-data/index.html",
          "https://ux-academy-course.vercel.app/open-data/index.html",
          "https://belentani7.github.io/WILLIAMSCHOOL/open-data/index.html",
          "https://belentani7.github.io/open-school/open-data/index.html"]:
    try:
        req = urllib.request.Request(u, headers={"User-Agent": "probe/1.0"})
        with urllib.request.urlopen(req, timeout=25, context=ctx) as r:
            t = r.read().decode("utf-8", "replace")
            title = re.search(r"<title>(.*?)</title>", t, re.S)
            print(f"{r.status} len={len(t):>6} title={title.group(1).strip()[:60] if title else None!r}  {u}")
            print("     has_spa_root=", 'id="root"' in t or 'id="app"' in t, " has_topics_link=", 'topics.json' in t)
    except Exception as e:
        print("ERR", type(e).__name__, u)
