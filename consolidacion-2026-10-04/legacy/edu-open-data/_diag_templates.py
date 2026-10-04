"""Diagnostica los 5 fallos que parecen bug nuestro de plantilla.

Muestra la URL plantilla, la URL rellenada por fill() y la respuesta cruda de
la fuente (status, content-type y cabeza del cuerpo) para decidir el arreglo.
"""

from __future__ import annotations

import gzip
import json
import ssl
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

import registry_loader as rl
import verify_sources as vs

IDS = ["opencitations", "orcid", "senado-br-senadores",
       "material-symbols-meta", "oecd-dataflow"]


def fetch(url: str) -> tuple[str, str, str]:
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    req = urllib.request.Request(url, headers={
        "User-Agent": vs.UA,
        "Accept": "application/json, */*",
        "Accept-Encoding": "identity",
    })
    try:
        with urllib.request.urlopen(req, timeout=20, context=ctx) as r:
            raw = r.read(4096)
            if r.headers.get("Content-Encoding") == "gzip":
                try:
                    raw = gzip.decompress(raw)
                except Exception:  # noqa: BLE001
                    pass
            return str(r.status), r.headers.get("Content-Type", ""), raw.decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        body = e.read(600).decode("utf-8", "replace")
        return f"HTTP {e.code}", e.headers.get("Content-Type", "") if e.headers else "", body
    except Exception as exc:  # noqa: BLE001
        return "ERROR", type(exc).__name__, str(exc)[:200]


def main() -> int:
    registry = rl.load_registry()
    by_id = {e["id"]: e for a in rl.AREAS for e in registry[a]}

    for eid in IDS:
        item = by_id.get(eid)
        if not item:
            print(f"\n### {eid}: NO EN EL REGISTRO")
            continue
        url = item["url"]
        filled = vs.fill(url)
        print("=" * 72)
        print(f"### {eid}")
        print("=" * 72)
        print(f"  kind      : {item.get('kind')}")
        print(f"  plantilla : {url}")
        print(f"  rellenada : {filled}")
        if filled != url:
            print(f"  (fill sustituyo placeholders)")
        status, ctype, body = fetch(filled)
        print(f"  status    : {status}")
        print(f"  ctype     : {ctype}")
        print(f"  cuerpo    : {body[:230]!r}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
