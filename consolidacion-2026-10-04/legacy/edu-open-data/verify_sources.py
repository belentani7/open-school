"""Verifica en vivo cada fuente del registro.

Lee registry/ (fuente de verdad) via registry_loader, no sources.json, que es
un artefacto GENERADO. Escribir la marca de verificacion en sources.json la
perderia el siguiente --sync; por eso la marca va a registry/meta.json y desde
ahi se regenera sources.json.

Uso:
    python verify_sources.py                 # todas
    python verify_sources.py idiomas civico_derechos
    python verify_sources.py --json          # solo salida JSON

Salida: verify_report.json + tabla por consola.
Sin dependencias externas (stdlib).
"""

from __future__ import annotations

import gzip
import json
import ssl
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

import registry_loader as rl

ROOT = Path(__file__).parent
REPORT = ROOT / "verify_report.json"

UA = "BelentaniEduBot/1.0 (+https://belentani.eu; educational open-data sync)"
TIMEOUT = 25
TIMEOUT_SLOW = 90

# Fuentes verificadas que estan VIVAS pero tardan o aplican rate limit estricto.
# Con el margen normal se declaraban caidas sin serlo.
SLOW = {
    "tatoeba": "respuesta lenta (~13 s medidos)",
    "librivox": "respuesta lenta",
    "arxiv": "respuesta lenta y 429 si se sondea seguido",
    "musicbrainz-recording": "503 por rate limit si se sondea seguido",
    "musicbrainz-release": "503 por rate limit si se sondea seguido",
}
SAMPLE = {
    "q": "casa",
    "es": "casa",
    "pt": "casa",
    "en": "house",
    "spa": "casa",
    "limit": "5",
    "rows": "5",
    "page": "1",
    "offset": "0",
    "yearFrom": "2020",
    "yearTo": "2024",
    "cve": "CVE-2021-44228",
    "keys": "sunset",
    "doi": "10.1186/1756-8722-6-59",
    "query": "SELECT ?x WHERE { ?x wdt:P31 wd:Q5 } LIMIT 1",
}

# Negociacion de contenido por `kind`: hay APIs que devuelven XML si se les
# pide */* y JSON si se les pide JSON (ORCID, Senado BR). Sin esto se
# declaraban como caidas fuentes que estan perfectamente vivas.
ACCEPT_BY_KIND = {
    "json": "application/json, application/*+json, */*",
    "xml": "application/xml, text/xml, */*",
    "csv": "text/csv, */*",
}


def strip_xssi(raw: bytes) -> bytes:
    """Quita el prefijo anti-XSSI de Google ()]'} que rompe json.loads."""
    if raw[:4] == b")]}'":
        rest = raw.split(b"\n", 1)
        return rest[1] if len(rest) > 1 else raw[4:]
    return raw


def fill(url: str) -> str:
    """Sustituye {placeholder} por muestras y escapa."""
    out = url
    for key, value in SAMPLE.items():
        token = "{" + key + "}"
        if token in out:
            out = out.replace(token, urllib.parse.quote(value, safe=""))
    return out


def check(url: str, kind: str, insecure: bool = False, timeout: int | None = None) -> dict:
    started = time.perf_counter()
    budget = timeout or TIMEOUT
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": UA,
            "Accept": ACCEPT_BY_KIND.get(kind, "*/*"),
            "Accept-Encoding": "identity",
        },
    )
    ctx = ssl._create_unverified_context() if insecure else ssl.create_default_context()
    try:
        with urllib.request.urlopen(req, timeout=budget, context=ctx) as resp:
            raw = resp.read()
            status = resp.status
            ctype = resp.headers.get("Content-Type", "")
            encoding = resp.headers.get("Content-Encoding", "")
    except urllib.error.HTTPError as exc:
        return {
            "ok": False,
            "status": exc.code,
            "reason": f"HTTPError {exc.code}",
            "ms": int((time.perf_counter() - started) * 1000),
        }
    except Exception as exc:  # noqa: BLE001 - reportamos cualquier fallo de red
        text = str(exc)
        if not insecure and ("CERTIFICATE_VERIFY_FAILED" in text or "self-signed" in text):
            retry = check(url, kind, insecure=True, timeout=timeout)
            retry["tls_insecure"] = True
            return retry
        return {
            "ok": False,
            "status": None,
            "reason": f"{type(exc).__name__}: {text}",
            "ms": int((time.perf_counter() - started) * 1000),
        }

    if encoding == "gzip" or raw[:2] == b"\x1f\x8b":
        try:
            raw = gzip.decompress(raw)
        except OSError as exc:
            return {
                "ok": False,
                "status": status,
                "reason": f"gzip: {exc}",
                "ms": int((time.perf_counter() - started) * 1000),
            }

    elapsed = int((time.perf_counter() - started) * 1000)
    parsed = None
    if kind == "json":
        try:
            data = json.loads(strip_xssi(raw))
            if isinstance(data, list):
                parsed = len(data)
            elif isinstance(data, dict):
                parsed = len(data.keys())
        except json.JSONDecodeError as exc:
            return {
                "ok": False,
                "status": status,
                "reason": f"JSONDecodeError: {exc.msg}",
                "ms": elapsed,
                "bytes": len(raw),
            }

    return {
        "ok": 200 <= status < 300,
        "status": status,
        "ctype": ctype.split(";")[0],
        "bytes": len(raw),
        "keys_or_items": parsed,
        "ms": elapsed,
    }


def main() -> int:
    registry = dict(rl.load_registry())
    wanted = [a for a in sys.argv[1:] if not a.startswith("--")]
    quiet = "--json" in sys.argv

    report: dict[str, dict] = {}
    rows: list[tuple[str, str, str, str]] = []

    for group, entries in registry.items():
        if group == "meta" or not isinstance(entries, list):
            continue
        if wanted and group not in wanted:
            continue
        for item in entries:
            url = fill(item["url"])
            budget = TIMEOUT_SLOW if item["id"] in SLOW else None
            result = check(url, item.get("kind", "json"), timeout=budget)
            report[item["id"]] = {
                "group": group,
                "name": item["name"],
                "kind": item.get("kind"),
                "license": item.get("license"),
                "url_tested": url,
                **result,
            }
            flag = "OK " if result.get("ok") else "FAIL"
            detail = (
                f"{result.get('status')} {result.get('bytes', 0)}B "
                f"{result.get('keys_or_items', '-')}keys {result['ms']}ms"
                if result.get("ok")
                else str(result.get("reason"))
            )
            rows.append((flag, item["id"], group, detail))
            if not quiet:
                print(f"{flag} {item['id']:<18} {group:<16} {detail}", flush=True)

    ok = sum(1 for r in report.values() if r["ok"])
    total = len(report)
    REPORT.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    if not wanted:
        # La marca va a la fuente de verdad (registry/meta.json) y desde ahi se
        # regenera sources.json, para que el siguiente --sync no la borre.
        meta = rl.load_meta()
        meta["verified_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        rl.save_all(registry, meta)

    print(f"\nRESULTADO: {ok}/{total} fuentes vivas -> {REPORT.name}")
    if ok < total:
        print("FALLOS:")
        for flag, sid, group, detail in rows:
            if flag == "FAIL":
                print(f"  - {sid} ({group}): {detail}")
    return 0 if ok == total else 1


if __name__ == "__main__":
    raise SystemExit(main())
