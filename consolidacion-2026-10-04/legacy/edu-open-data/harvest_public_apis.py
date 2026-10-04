"""M1.1 - Lee el catalogo mundial public-apis en trozos y emite candidatas crudas.

Fuente: README de public-apis/public-apis (cache local de tool-output; si no existe, descarga).
Lectura SIEMPRE por trozos (256 KB), nunca el fichero entero de una vez.

Salida: registry/_intake/raw_public_apis.json
"""
import io
import json
import os
import re
import sys
import unicodedata
import urllib.request
from collections import Counter, OrderedDict

ROOT = os.path.dirname(os.path.abspath(__file__))
INTAKE = os.path.join(ROOT, "registry", "_intake")
CACHE = r"C:\Users\USER\.local\share\mimocode\tool-output\tool_g001a09789e63a001P0jZsSXL2"
REMOTE = "https://raw.githubusercontent.com/public-apis/public-apis/master/README.md"
CHUNK = 256 * 1024
UA = "Mozilla/5.0 (edu-open-data/1.0; +https://github.com/belentani7)"

ROW = re.compile(
    r"^\|\s*\[(?P<name>[^\]]+)\]\((?P<url>[^)]+)\)\s*\|(?P<desc>[^|]+)\|"
    r"(?P<auth>[^|]+)\|(?P<https>[^|]+)\|(?P<cors>[^|]+)\|"
)
H3 = re.compile(r"^###\s+(?P<cat>.+?)\s*$")

JUNK_CATEGORIES = {
    "Anime", "Cryptocurrency", "Games & Comics", "Personality",
    "Sports & Fitness", "Video", "Food & Drink", "Blockchain",
    "Currency Exchange", "URL Shorteners", "Tracking", "Phone",
    "Shopping", "Entertainment",
}
JUNK_NAME = re.compile(
    r"waifu|hentai|nsfw|gambl|crypto|vpn|proxy|\bsms\b|porn|casino", re.I
)

EXT_KIND = [
    (".xml", "xml"), (".rss", "xml"), (".atom", "xml"),
    (".csv", "csv"), (".tsv", "csv"),
    (".json", "json"), (".geojson", "json"),
    (".txt", "text"), (".dat", "text"), (".md", "text"),
    (".png", "image"), (".jpg", "image"), (".jpeg", "image"),
    (".svg", "text"), (".gif", "image"),
]


def slug(text):
    t = unicodedata.normalize("NFKD", text)
    t = t.encode("ascii", "ignore").decode("ascii").lower()
    t = re.sub(r"[^a-z0-9]+", "-", t).strip("-")
    return t or "x"


def host_of(url):
    m = re.match(r"^[a-z]+://(?P<h>[^/:?#]+)", url, re.I)
    return m.group("h").lower() if m else ""


def free_url(url):
    """URL de sonda sin placeholders: quita el query de la docs y deja algo estable."""
    if "?" in url:
        base, _, q = url.partition("?")
        # Conserva solo parametros simples sin llaves
        keep = [p for p in q.split("&") if "{" not in p and "}" not in p]
        return base + ("?" + "&".join(keep) if keep else "")
    return url


def guess_kind(url):
    low = url.lower()
    for ext, kind in EXT_KIND:
        if low.endswith(ext) or (ext + "?") in low:
            return kind
    tail = url.split("?")[0]
    if not tail.endswith("/") and not tail.endswith(".html") and not tail.endswith(".htm"):
        return "json"
    return "html"


def read_chunks(path, size=CHUNK):
    """Cede trozos de texto, nunca el fichero entero."""
    buf = b""
    with open(path, "rb") as fh:
        while True:
            block = fh.read(size)
            if not block:
                break
            buf += block
            lines = buf.split(b"\n")
            buf = lines.pop()
            for ln in lines:
                yield ln.decode("utf-8", "replace")
    if buf:
        yield buf.decode("utf-8", "replace")


def read_remote():
    req = urllib.request.Request(REMOTE, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        with io.BytesIO(r.read()) as memo:
            memo.seek(0)
            while True:
                block = memo.read(CHUNK)
                if not block:
                    break
                for ln in block.split(b"\n"):
                    yield ln.decode("utf-8", "replace")


def main():
    os.makedirs(INTAKE, exist_ok=True)
    if not os.path.exists(CACHE):
        print("cache local ausente -> descargando README")
        source, lines = "remote", read_remote()
    else:
        print("fuente: cache local", CACHE)
        source, lines = "cache", read_chunks(CACHE)

    cat = ""
    rows, stats = [], Counter()
    seen = set()
    for ln in lines:
        m = H3.match(ln)
        if m:
            cat = m.group("cat").strip()
            continue
        m = ROW.match(ln)
        if not m:
            continue
        stats["filas_totales"] += 1
        auth = m.group("auth").strip().strip("`").strip()
        https = m.group("https").strip()
        if auth != "No":
            stats["descartado_por_auth"] += 1
            continue
        if https != "Yes":
            stats["descartado_por_http"] += 1
            continue
        if cat in JUNK_CATEGORIES:
            stats["descartado_por_categoria"] += 1
            continue
        name = m.group("name").strip()
        if JUNK_NAME.search(name):
            stats["descartado_por_nombre"] += 1
            continue
        url = m.group("url").strip()
        key = host_of(url) + re.sub(r"^[a-z]+://[^/]+", "", url).split("?")[0]
        if key in seen:
            stats["descartado_por_duplicado"] += 1
            continue
        seen.add(key)

        kind = guess_kind(url)
        rid = slug(name) + "-" + slug(host_of(url).split(".")[0])[:24]
        rows.append(OrderedDict([
            ("id", rid),
            ("name", name),
            ("area", "sin_clasificar"),
            ("url", free_url(url) or url),
            ("kind", kind),
            ("auth", "none"),
            ("country", "global"),
            ("region", "global"),
            ("langs", ["pt", "es", "en", "ca"]),
            ("license", "unknown"),
            ("docs_url", url),
            ("topics", [slug(cat)] if cat else []),
            ("quality", "C" if kind == "html" else "B"),
            ("source", "public-apis"),
            ("categoria_public_apis", cat),
            ("descripcion", m.group("desc").strip()),
            ("cors", m.group("cors").strip()),
            ("probe", {"url": free_url(url) or url, "expect": kind}),
        ]))

    out = os.path.join(INTAKE, "raw_public_apis.json")
    with io.open(out, "w", encoding="utf-8") as fh:
        json.dump({"schema_version": 1, "source": source,
                   "total": len(rows), "entries": rows}, fh,
                  ensure_ascii=False, indent=1)

    by_kind = Counter(r["kind"] for r in rows)
    by_cat = Counter(r["categoria_public_apis"] for r in rows)
    print("--- harvest_public_apis ---")
    for k, v in sorted(stats.items()):
        print(f"  {k:32s} {v}")
    print(f"  {'CANDIDATAS':32s} {len(rows)}")
    print("  por kind:", dict(by_kind))
    print("  top categorias:", by_cat.most_common(12))
    print("  ->", out)


if __name__ == "__main__":
    sys.exit(main())
