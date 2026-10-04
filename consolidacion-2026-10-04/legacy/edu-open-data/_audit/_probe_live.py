import ssl, urllib.request, urllib.error

URLS = [
    "https://belentani7.github.io/open-school/open-data/index.html",
    "https://belentani7.github.io/ux-academy-professional-program/open-data/index.html",
    "https://belentani7.github.io/WILLIAMSCHOOL/open-data/index.html",
    "https://belentani7.github.io/lingua-aberta/open-data/index.html",
    "https://belentani7.github.io/secure-t-university/open-data/index.html",
    "https://open-school-gamma.vercel.app/open-data/index.html",
    "https://williamschool-livid.vercel.app/open-data/index.html",
    "https://ux-academy-course.vercel.app/open-data/index.html",
    "https://lingua-aberta.vercel.app/open-data/index.html",
    "https://belentani7.github.io/lingua-aberta/",
    "https://belentani7.github.io/open-school/campus/",
]
ctx = ssl._create_unverified_context()
for u in URLS:
    try:
        req = urllib.request.Request(u, headers={"User-Agent": "probe/1.0"})
        with urllib.request.urlopen(req, timeout=20, context=ctx) as r:
            b = r.read(400)
            print(f"{r.status} {len(b):>4}B  {u}")
    except urllib.error.HTTPError as e:
        print(f"{e.code}        {u}")
    except Exception as e:
        print(f"ERR {type(e).__name__}  {u}")
