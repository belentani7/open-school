"""Sondea donde se publica realmente cada portal educativo.

Para cada portal comprueba:
  - raiz            -> existe web publica
  - open-data/      -> el pack esta servido
  - campus/voces/   -> el audio esta servido

Usa MARCA ESTRICTA presente solo en el archivo real. Un 200 con el shell de la
SPA no cuenta: las SPA de Vercel responden 200 a cualquier ruta.

Uso:
    python probe_deploy.py            # tabla por pantalla
    python probe_deploy.py --json     # escribe deploy_report.json
"""

from __future__ import annotations

import json
import ssl
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).parent
CTX = ssl.create_default_context()
CTX.check_hostname = False
CTX.verify_mode = ssl.CERT_NONE
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) belentani7-edu-audit"

OD_MARCA = '"temas"'
VOZ_MARCA = '"voz"'

# portal -> (url raiz, url open-data/topics.json, url campus/voces/manifest.json)
SITIOS: dict[str, tuple[str, str, str]] = {
    "lingua-aberta": (
        "https://lingua-aberta.vercel.app/",
        "https://lingua-aberta.vercel.app/open-data/topics.json",
        "https://lingua-aberta.vercel.app/campus/voces/manifest.json",
    ),
    "linguaforge": (
        "https://openlinguaforge.vercel.app/",
        "https://openlinguaforge.vercel.app/open-data/topics.json",
        "https://openlinguaforge.vercel.app/campus/voces/manifest.json",
    ),
    "manosabiertas": (
        "https://manos-abiertas-psi.vercel.app/",
        "https://manos-abiertas-psi.vercel.app/open-data/topics.json",
        "https://manos-abiertas-psi.vercel.app/campus/voces/manifest.json",
    ),
    "secure-t-university": (
        "https://secure-t-university.vercel.app/",
        "https://secure-t-university.vercel.app/open-data/topics.json",
        "https://secure-t-university.vercel.app/campus/voces/manifest.json",
    ),
    "ux-academy": (
        "https://ux-academy-course.vercel.app/",
        "https://ux-academy-course.vercel.app/open-data/topics.json",
        "https://ux-academy-course.vercel.app/campus/voces/manifest.json",
    ),
    "open-school": (
        "https://belentani7.github.io/open-school/",
        "https://belentani7.github.io/open-school/open-data/topics.json",
        "https://belentani7.github.io/open-school/campus/voces/manifest.json",
    ),
    "williamschool": (
        "https://belentani7.github.io/WILLIAMSCHOOL/",
        "https://belentani7.github.io/WILLIAMSCHOOL/open-data/topics.json",
        "https://belentani7.github.io/WILLIAMSCHOOL/campus/voces/manifest.json",
    ),
    "aprende-brasil": (
        "https://aprende-brasil.vercel.app/",
        "https://aprende-brasil.vercel.app/open-data/topics.json",
        "https://aprende-brasil.vercel.app/campus/voces/manifest.json",
    ),
    "lingua-aberta-empresa": (
        "https://lingua-aberta-empresa.vercel.app/",
        "https://lingua-aberta-empresa.vercel.app/open-data/topics.json",
        "https://lingua-aberta-empresa.vercel.app/campus/voces/manifest.json",
    ),
    "cruzando-el-charco": (
        "https://belentani7.github.io/Cruzando-el-charco/",
        "https://belentani7.github.io/Cruzando-el-charco/open-data/topics.json",
        "https://belentani7.github.io/Cruzando-el-charco/campus/voces/manifest.json",
    ),
    "secure-t": (
        "https://belentani7.github.io/secure-t/",
        "https://belentani7.github.io/secure-t/open-data/topics.json",
        "https://belentani7.github.io/secure-t/campus/voces/manifest.json",
    ),
}

ALTERNATIVAS: dict[str, list[tuple[str, str, str]]] = {
    "open-school": [
        ("vercel", "https://open-school-gamma.vercel.app/open-data/topics.json", OD_MARCA),
    ],
    "ux-academy": [
        ("pages", "https://belentani7.github.io/ux-academy-professional-program/open-data/topics.json", OD_MARCA),
    ],
    "williamschool": [
        ("vercel", "https://williamschool-livid.vercel.app/open-data/topics.json", OD_MARCA),
    ],
}


def get(url: str) -> tuple[int, bytes, str]:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=25, context=CTX) as r:
            return r.status, r.read(400_000), r.headers.get("Content-Type", "")
    except urllib.error.HTTPError as exc:
        return exc.code, b"", ""
    except Exception as exc:  # noqa: BLE001
        return 0, b"", f"{type(exc).__name__}: {str(exc)[:70]}"


def tiene(url: str, marca: str) -> tuple[bool, int, str]:
    if not url:
        return False, 0, "sin url"
    code, body, extra = get(url)
    if code == 0:
        return False, 0, extra
    txt = body.decode("utf-8", "replace")
    return (code == 200 and marca.lower() in txt.lower()), len(body), f"HTTP {code}"


def main() -> int:
    informe: dict[str, dict] = {}
    web = 0
    con_od = 0
    con_voz = 0
    for portal, (raiz, od, voz) in SITIOS.items():
        root_ok, root_n, root_note = tiene(raiz, "<html")
        od_ok, od_n, od_note = tiene(od, OD_MARCA)
        voz_ok, voz_n, voz_note = tiene(voz, VOZ_MARCA)
        alt: list[str] = []
        if not od_ok:
            for nombre, url, marca in ALTERNATIVAS.get(portal, []):
                ok, _, _ = tiene(url, marca)
                if ok:
                    alt.append(nombre)
                    od_ok = True
        if not voz_ok:
            for nombre, url, marca in ALTERNATIVAS.get(portal, []):
                ok, _, _ = tiene(url.replace("open-data/topics.json", "campus/voces/manifest.json"), VOZ_MARCA)
                if ok:
                    alt.append(nombre + "/voz")
                    voz_ok = True
        informe[portal] = {
            "web": root_ok,
            "raiz": raiz,
            "open_data": od_ok,
            "voces": voz_ok,
            "alternativa": sorted(set(alt)),
            "detalle": f"raiz {root_note} {root_n}B | od {od_note} {od_n}B | voz {voz_note} {voz_n}B",
        }
        web += root_ok
        con_od += od_ok
        con_voz += voz_ok
        print(
            f"{portal:<22} web={'SI' if root_ok else 'NO'} "
            f"open-data={'SI' if od_ok else 'NO'} voces={'SI' if voz_ok else 'NO'} "
            f"{'alt=' + ','.join(sorted(set(alt))) if alt else ''}",
            flush=True,
        )
    print(f"\nweb={web}/{len(SITIOS)}  open-data={con_od}/{len(SITIOS)}  voces={con_voz}/{len(SITIOS)}")
    (ROOT / "deploy_report.json").write_text(
        json.dumps(informe, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    if "--json" in sys.argv:
        print("-> deploy_report.json")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
