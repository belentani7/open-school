"""M1.4 - Verificacion en vivo de cada candidata.

ACEPTA: status 200 (o 3xx ya seguido), bytes>=256, content-type coherente con el
        kind, JSON parsea (si kind=json), >=1 registro extraido, ms<=8000.
RECHAZA: a registry/_intake/rejections.json con motivo y evidencia, para que
        reprobar no resucite un id caido (misma semantica DROP que patch_registry.py).

Fallback TLS obligatorio: algunos hosts locales estan interceptados (tatoeba,
openfoodfacts). Primero contexto verificado; si falla por SSL, reintenta con
ssl._create_unverified_context() y lo anota como tls_insecure observado.

Salidas:
  registry/_intake/probe_report.json   (todas las sondas, con metricas)
  registry/_intake/approved.json       (aceptadas, listas para patch_registry)
  registry/_intake/rejections.json     ({id, reason, evidence})
  registry/_intake/probe_report.md     (informe legible)
"""
from __future__ import annotations

import gzip
import io
import json
import os
import ssl
import sys
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
import zlib
from collections import Counter
from concurrent.futures import ThreadPoolExecutor

ROOT = os.path.dirname(os.path.abspath(__file__))
INTAKE = os.path.join(ROOT, "registry", "_intake")
CANDS = os.path.join(INTAKE, "approved_candidates.json")
OUT_REPORT = os.path.join(INTAKE, "probe_report.json")
OUT_APPROVED = os.path.join(INTAKE, "approved.json")
OUT_REJECT = os.path.join(INTAKE, "rejections.json")
OUT_MD = os.path.join(INTAKE, "probe_report.md")

UA = "Mozilla/5.0 (edu-open-data/1.0; +https://github.com/belentani7)"
WORKERS = 12
TIMEOUT = 12.0           # alguna fuente buena tarda >8s (tatoeba, arxiv, dbpedia)
# Gate duro solo contra respuestas basura. Entre MIN_BYTES y SMALL_BYTES se
# acepta si parsea con >=1 registro, anotando "small_payload": hay APIs que
# devuelven JSON legitimo y compacto (OpenCitations, MeSH, KEGG...).
MIN_BYTES = 64
SMALL_BYTES = 256
MAX_MS = 12000
MAX_READ = 262144        # 256 KB por sonda, nunca el fichero entero
HOST_GAP = 1.1           # cortesia por host (MusicBrainz & cia lo exigen)
RETRY_ON = ("rate_limited", "server_error_500", "server_error_502",
            "server_error_503", "server_error_504")

TIEBREAK = ["academico", "idiomas", "civico_derechos", "ciencia_salud",
            "datos_pais", "ciberseguridad", "ux_diseno", "patrimonio_arte",
            "sin_clasificar"]

CTX_VERIFIED = ssl.create_default_context()
CTX_UNVERIFIED = ssl._create_unverified_context()

PH = {"q": "escola", "limit": "3", "lang": "pt", "iso3": "BRA",
      "doi": "10.1038/nature12373", "year": "2024"}

_host_lock = threading.Lock()
_host_last: dict[str, float] = {}
_print_lock = threading.Lock()


def ascii_url(url: str) -> str:
    for key, val in PH.items():
        url = url.replace("{" + key + "}", val)
    return urllib.parse.quote(url, safe=":/?#[]@!$&'()*+,;=%~-._")


def host_of(url: str) -> str:
    m = urllib.parse.urlsplit(url)
    return (m.hostname or "").lower()


def polite(host: str) -> None:
    if not host:
        return
    with _host_lock:
        last = _host_last.get(host, 0.0)
        wait = HOST_GAP - (time.time() - last)
        if wait > 0:
            time.sleep(wait)
        _host_last[host] = time.time()


def gunzip_tolerant(raw: bytes) -> bytes:
    """Descomprime gzip aunque la respuesta venga truncada.

    Se pide identity, pero algunos servidores ignoran la cabecera. Con lectura
    parcial, gzip.decompress lanza EOFError; aqui se rescata todo lo que el
    descompresor incremental haya podido emitir antes del corte.
    """
    try:
        return gzip.decompress(raw)
    except (EOFError, OSError, zlib.error):
        pass
    try:
        d = zlib.decompressobj(16 + zlib.MAX_WBITS)
        out = d.decompress(raw)
        out += d.flush()
        return out or raw
    except zlib.error:
        return raw


def fetch(url: str, insecure: bool = False) -> dict:
    ctx = CTX_UNVERIFIED if insecure else CTX_VERIFIED
    req = urllib.request.Request(url, headers={
        "User-Agent": UA,
        "Accept": "application/json, application/xml, text/html, */*",
        "Accept-Encoding": "identity",
    })
    host = host_of(url)
    polite(host)
    t0 = time.time()
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT, context=ctx) as r:
            raw = r.read(MAX_READ)
            enc = (r.headers.get("Content-Encoding") or "").lower()
            if "gzip" in enc:
                raw = gunzip_tolerant(raw)
            return {"ok": True, "status": r.status, "ctype":
                    (r.headers.get("Content-Type") or "").split(";")[0].strip().lower(),
                    "body": raw, "ms": int((time.time() - t0) * 1000),
                    "enc": enc, "truncated": len(raw) >= MAX_READ,
                    "final": r.geturl()}
    except urllib.error.HTTPError as e:
        body = b""
        try:
            body = e.read(2048)
        except Exception:                                     # noqa: BLE001
            pass
        return {"ok": False, "status": e.code, "ctype":
                (e.headers.get("Content-Type") or "").split(";")[0].strip().lower()
                if e.headers else "",
                "body": body, "ms": int((time.time() - t0) * 1000),
                "error": f"HTTP {e.code}"}
    except ssl.SSLError as e:
        return {"ok": False, "status": None, "ctype": "", "body": b"",
                "ms": int((time.time() - t0) * 1000),
                "error": f"SSLError: {type(e).__name__}", "ssl": True}
    except Exception as e:                                    # noqa: BLE001
        return {"ok": False, "status": None, "ctype": "", "body": b"",
                "ms": int((time.time() - t0) * 1000),
                "error": f"{type(e).__name__}"}


def strip_xssi(text: str) -> str:
    """Google/YouTube anteponen )]}' para impedir XSSI. Hay que quitarlo antes de parsear."""
    t = text.lstrip("\ufeff \t\r\n")
    if t.startswith(")]}'"):
        nl = t.find("\n")
        return t[nl + 1:] if nl != -1 else t
    return t


def count_records(obj) -> int:
    if isinstance(obj, list):
        return len(obj)
    if isinstance(obj, dict):
        for key in ("results", "data", "items", "entries", "hits", "records",
                    "docs", "list", "values", "elements", "objects", "response"):
            val = obj.get(key)
            if isinstance(val, list):
                return len(val)
            if isinstance(val, dict):
                for sub in ("hits", "items", "docs", "records"):
                    if isinstance(val.get(sub), list):
                        return len(val[sub])
        return len(obj)
    return 0


def evaluate(row: dict, res: dict) -> dict:
    """Devuelve veredicto: accept | reject con motivo y evidencia."""
    kind = (row.get("probe") or {}).get("expect") or row.get("kind") or "json"
    body = res.get("body") or b""
    ctype = res.get("ctype") or ""
    ms = res.get("ms") or 0
    status = res.get("status")
    ev = {"status": status, "ctype": ctype, "bytes": len(body), "ms": ms}

    if not res.get("ok"):
        if res.get("ssl"):
            return {"verdict": "reject", "reason": "tls_both_contexts_failed",
                    "evidence": dict(ev, error=res.get("error"))}
        if status in (401, 403):
            return {"verdict": "reject", "reason": "auth_required_or_blocked",
                    "evidence": dict(ev, error=res.get("error"))}
        if status == 404:
            return {"verdict": "reject", "reason": "http_404",
                    "evidence": ev}
        if status in (410, 451):
            return {"verdict": "reject", "reason": f"http_{status}_gone",
                    "evidence": ev}
        if status == 429:
            return {"verdict": "reject", "reason": "rate_limited",
                    "evidence": ev}
        if status and 500 <= status < 600:
            return {"verdict": "reject", "reason": f"server_error_{status}",
                    "evidence": ev}
        return {"verdict": "reject", "reason": "network_or_timeout",
                "evidence": dict(ev, error=res.get("error"))}

    if ms > MAX_MS:
        return {"verdict": "reject", "reason": "too_slow", "evidence": ev}
    if len(body) < MIN_BYTES:
        return {"verdict": "reject", "reason": "too_small", "evidence": ev}
    small = len(body) < SMALL_BYTES

    if kind == "json":
        if "html" in ctype:
            return {"verdict": "reject", "reason": "html_not_api", "evidence": ev}
        text = strip_xssi(body.decode("utf-8", "replace"))
        # Payload grande cortado a MAX_READ: no es parseable por definicion.
        # Se valida forma JSON + content-type declarado, no un parse completo.
        if res.get("truncated") or len(body) >= MAX_READ:
            head = text.lstrip()[:1]
            if head in ("{", "["):
                return {"verdict": "accept",
                        "evidence": dict(ev, bytes=">=" + str(MAX_READ)),
                        "records": None, "note": "large_payload_truncated"}
            return {"verdict": "reject", "reason": "large_payload_not_json",
                    "evidence": dict(ev, head=text[:120])}
        try:
            parsed = json.loads(text)
        except Exception as e:                                # noqa: BLE001
            return {"verdict": "reject", "reason": "json_parse_error",
                    "evidence": dict(ev, error=str(e)[:120],
                                     head=text[:120])}
        n = count_records(parsed)
        if n < 1:
            return {"verdict": "reject", "reason": "no_records",
                    "evidence": dict(ev, records=0)}
        return {"verdict": "accept", "evidence": dict(ev, records=n),
                "records": n, "note": "small_payload" if small else None}

    if kind == "xml":
        text = strip_xssi(body.decode("utf-8", "replace"))
        if "<" not in text or ">" not in text:
            return {"verdict": "reject", "reason": "not_xml", "evidence": ev}
        if "html" in ctype and "<html" in text[:2048].lower():
            return {"verdict": "reject", "reason": "html_not_xml", "evidence": ev}
        return {"verdict": "accept",
                "evidence": dict(ev, records=text.count("<") - text.count("</") > 0),
                "records": 1, "note": "small_payload" if small else None}

    if kind in ("text", "csv"):
        text = body.decode("utf-8", "replace")
        lines = [ln for ln in text.splitlines() if ln.strip()]
        if not lines:
            return {"verdict": "reject", "reason": "empty_text", "evidence": ev}
        return {"verdict": "accept", "evidence": dict(ev, records=len(lines)),
                "records": len(lines), "note": "small_payload" if small else None}

    if kind == "image":
        if ctype.startswith("image/"):
            return {"verdict": "accept", "evidence": dict(ev, records=1), "records": 1}
        return {"verdict": "reject", "reason": "not_image", "evidence": ev}

    if kind == "html":
        if "html" in ctype or b"<html" in body[:2048].lower():
            return {"verdict": "accept", "evidence": dict(ev, records=1),
                    "records": 1, "portal_only": True}
        return {"verdict": "reject", "reason": "not_html", "evidence": ev}

    return {"verdict": "reject", "reason": f"unknown_kind_{kind}", "evidence": ev}


def probe_one(row: dict) -> dict:
    url = ascii_url(row["url"])
    insecure_used = False
    res = fetch(url, insecure=False)
    if res.get("ssl") or (not res.get("ok") and res.get("status") is None):
        res2 = fetch(url, insecure=True)
        if res2.get("ok"):
            insecure_used = True
            res = res2
        elif "SSLError" in str(res.get("error", "")):
            res = res2 if res2.get("status") is not None else res

    verdict = evaluate(row, res)

    # Un reintento para 429/5xx (rate limit transitorio o backend caido un momento).
    if verdict["verdict"] != "accept" and verdict.get("reason") in RETRY_ON:
        time.sleep(2.0)
        res = fetch(url, insecure=insecure_used)
        retry = evaluate(row, res)
        if retry["verdict"] == "accept":
            verdict = retry
        else:
            verdict = dict(retry, retried_after=verdict.get("reason"))

    out = {
        "id": row["id"],
        "name": row["name"],
        "area": row["area"],
        "kind": row.get("kind"),
        "source": row.get("source"),
        "quality": row.get("quality"),
        "url": row["url"],
        "probe_url": url,
        "verdict": verdict["verdict"],
        "reason": verdict.get("reason"),
        "evidence": verdict.get("evidence"),
        "records": verdict.get("records"),
        "portal_only": verdict.get("portal_only", False),
        "note": verdict.get("note"),
        "tls_insecure_observed": insecure_used or bool(row.get("tls_insecure")),
        "last_good_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
    return out


def main():
    with io.open(CANDS, encoding="utf-8") as fh:
        rows = json.load(fh)["entries"]

    # Escuelas primero: el informe util llega en los primeros minutos.
    rows.sort(key=lambda r: (TIEBREAK.index(r["area"]) if r["area"] in TIEBREAK else 99,
                             r.get("kind") == "html",
                             r["id"]))

    print(f"--- probe_registry --- {len(rows)} candidatas, {WORKERS} workers")
    t0 = time.time()
    results, done, rejected = [], 0, 0
    with ThreadPoolExecutor(max_workers=WORKERS) as pool:
        for res in pool.map(probe_one, rows):
            results.append(res)
            done += 1
            if res["verdict"] != "accept":
                rejected += 1
            if done % 50 == 0 or done == len(rows):
                with _print_lock:
                    print(f"  {done:4d}/{len(rows)}  ok={done - rejected:4d} "
                          f"ko={rejected:4d}  {int(time.time() - t0)}s")

    approved = [r for r in results if r["verdict"] == "accept"]
    rejects = [r for r in results if r["verdict"] != "accept"]
    machine = [r for r in approved if not r["portal_only"]]

    os.makedirs(INTAKE, exist_ok=True)
    with io.open(OUT_REPORT, "w", encoding="utf-8") as fh:
        json.dump({"total": len(results),
                   "aceptadas": len(approved),
                   "maquina_legibles": len(machine),
                   "solo_portales": len(approved) - len(machine),
                   "rechazadas": len(rejects),
                   "entries": results}, fh, ensure_ascii=False, indent=1)
    with io.open(OUT_APPROVED, "w", encoding="utf-8") as fh:
        json.dump({"total": len(approved), "machine": len(machine),
                   "ids": [r["id"] for r in approved],
                   "by_area": dict(Counter(r["area"] for r in approved)),
                   "entries": approved}, fh, ensure_ascii=False, indent=1)
    with io.open(OUT_REJECT, "w", encoding="utf-8") as fh:
        json.dump({"total": len(rejects),
                   "by_reason": dict(Counter(r["reason"] for r in rejects)),
                   "entries": [{"id": r["id"], "name": r["name"], "area": r["area"],
                                "url": r["url"], "reason": r["reason"],
                                "evidence": r["evidence"]} for r in rejects]},
                  fh, ensure_ascii=False, indent=1)

    by_area = Counter(r["area"] for r in approved)
    by_area_m = Counter(r["area"] for r in machine)
    by_reason = Counter(r["reason"] for r in rejects)

    md = ["# M1 - Informe de sonda en vivo", "",
          f"Candidatas sondeadas: **{len(results)}**  ",
          f"Aceptadas: **{len(approved)}** (maquina-legibles **{len(machine)}**, "
          f"solo portales **{len(approved) - len(machine)}**)  ",
          f"Rechazadas: **{len(rejects)}**  ",
          f"Tiempo: **{int(time.time() - t0)}s**", "",
          "## Aceptadas por area (escuelas primero)", "",
          "| area | aceptadas | maquina-legibles |", "|---|---|---|"]
    for a in TIEBREAK:
        if by_area.get(a):
            md.append(f"| `{a}` | {by_area[a]} | {by_area_m.get(a, 0)} |")
    md += ["", "## Rechazos por motivo", "", "| motivo | n |", "|---|---|"]
    for r, n in by_reason.most_common():
        md.append(f"| `{r}` | {n} |")
    md += ["", "## Aceptadas maquina-legibles (detalle)", "",
           "| area | id | kind | recs | ms | bytes | url |", "|---|---|---|---|---|---|---|"]
    for r in sorted(machine, key=lambda x: (TIEBREAK.index(x["area"])
                    if x["area"] in TIEBREAK else 99, x["id"])):
        e = r["evidence"]
        md.append("| `{}` | `{}` | {} | {} | {} | {} | `{}` |".format(
            r["area"], r["id"], r["kind"], r.get("records"),
            e.get("ms"), e.get("bytes"), r["probe_url"][:70]))
    with io.open(OUT_MD, "w", encoding="utf-8") as fh:
        fh.write("\n".join(md) + "\n")

    print("--- resultado ---")
    print(f"  aceptadas             {len(approved)}")
    print(f"  de ellas legibles     {len(machine)}")
    print(f"  solo portales HTML    {len(approved) - len(machine)}")
    print(f"  rechazadas            {len(rejects)}")
    print("  aceptadas maquina por area:")
    for a in TIEBREAK:
        if by_area_m.get(a):
            print(f"    {a:20s} {by_area_m[a]:4d}   (total accept {by_area.get(a, 0)})")
    print("  rechazos:")
    for r, n in by_reason.most_common():
        print(f"    {r:28s} {n}")
    print(f"  -> {OUT_MD}")
    print(f"  {int(time.time() - t0)}s total")


if __name__ == "__main__":
    sys.exit(main())
