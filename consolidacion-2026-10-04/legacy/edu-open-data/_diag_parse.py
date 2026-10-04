"""Lee el cuerpo COMPLETO de los 4 sospechosos y localiza el fallo de parseo."""

from __future__ import annotations

import json
import ssl
import urllib.error
import urllib.request
from pathlib import Path

import registry_loader as rl
import verify_sources as vs

TARGETS = ["orcid", "senado-br-senadores", "material-symbols-meta", "oecd-dataflow"]


def raw_fetch(url: str) -> tuple[str, str, bytes]:
    ctx = ssl._create_unverified_context()
    req = urllib.request.Request(url, headers={
        "User-Agent": vs.UA, "Accept": "*/*", "Accept-Encoding": "identity"})
    try:
        with urllib.request.urlopen(req, timeout=30, context=ctx) as r:
            return str(r.status), r.headers.get("Content-Type", ""), r.read()
    except urllib.error.HTTPError as e:
        return f"HTTP {e.code}", "", e.read()
    except Exception as exc:  # noqa: BLE001
        return "ERROR", type(exc).__name__, str(exc).encode()


def main() -> int:
    reg = rl.load_registry()
    by_id = {e["id"]: e for a in rl.AREAS for e in reg[a]}

    for eid in TARGETS:
        item = by_id[eid]
        url = vs.fill(item["url"])
        kind = item.get("kind")
        status, ctype, raw = raw_fetch(url)
        print("=" * 72)
        print(f"### {eid}   kind declarado={kind}")
        print("=" * 72)
        print(f"  status   : {status}")
        print(f"  ctype    : {ctype.split(';')[0]}")
        print(f"  bytes    : {len(raw):,}")
        print(f"  primeros : {raw[:24]!r}")
        print(f"  ultimos  : {raw[-24:]!r}")

        body = raw
        if body[:2] == b"\x1f\x8b":
            import gzip
            try:
                body = gzip.decompress(raw)
                print("  (era gzip; descomprimido)")
            except Exception as exc:  # noqa: BLE001
                print(f"  (gzip roto: {exc})")
        try:
            data = json.loads(body)
            print(f"  json.loads: OK  tipo={type(data).__name__} "
                  f"len={len(data) if hasattr(data,'__len__') else '-'}")
        except json.JSONDecodeError as exc:
            print(f"  json.loads: FALLA -> {exc.msg} en pos {exc.pos} (linea {exc.lineno})")
            lo = max(0, exc.pos - 60)
            print(f"  ventana  : {body[lo:exc.pos + 60]!r}")
        if body.lstrip()[:4] == b")]}'":
            print("  -> lleva prefijo XSSI de Google")
        if b"<?xml" in body[:120].lower():
            print("  -> el cuerpo es XML")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
