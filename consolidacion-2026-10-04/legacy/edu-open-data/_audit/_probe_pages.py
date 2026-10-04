import json, subprocess, sys

REPOS = ["lingua-aberta", "linguaforge", "ManosAbiertas", "secure-t-university",
         "ux-academy-professional-program", "open-school", "WILLIAMSCHOOL", "aprende-brasil"]

for r in REPOS:
    try:
        out = subprocess.run(["gh", "api", f"repos/belentani7/{r}"],
                             capture_output=True, encoding="utf-8", timeout=60)
        d = json.loads(out.stdout)
        print(f"{r:<32} pages={d.get('has_pages')} home={d.get('homepage') or '-'} "
              f"lang={d.get('language')} default={d.get('default_branch')} "
              f"desc={(d.get('description') or '')[:50]!r}")
    except Exception as exc:
        print(f"{r:<32} ERROR {exc}")
