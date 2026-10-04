"""Evidencia cruda del payload de OpenStax: que campos llegan de verdad."""
from __future__ import annotations

import json
import ssl
import urllib.request

CTX = ssl.create_default_context()
CTX.check_hostname = False
CTX.verify_mode = ssl.CERT_NONE
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) belentani7-audit"

URL = "https://openstax.org/apps/cms/api/v2/pages/?type=books.Book&fields=title,slug&limit=40"

req = urllib.request.Request(URL, headers={"User-Agent": UA})
with urllib.request.urlopen(req, timeout=40, context=CTX) as r:
    raw = r.read()
print("HTTP", r.status, "bytes", len(raw))

data = json.loads(raw.decode("utf-8", "replace"))
print("claves raiz:", list(data.keys()))
print("meta:", json.dumps(data.get("meta"), ensure_ascii=False)[:300])

items = data.get("items", [])
print("items:", len(items))
if items:
    primero = items[0]
    print("\nclaves del item[0]:", list(primero.keys()))
    print("item[0] completo:")
    print(json.dumps(primero, ensure_ascii=False, indent=2)[:1200])
    print("\nslug top-level:", repr(primero.get("slug")))
    print("meta.slug:", repr((primero.get("meta") or {}).get("slug")))
    print("meta.html_url:", repr((primero.get("meta") or {}).get("html_url")))
    print("\nmuestra de 5:")
    for i in items[:5]:
        m = i.get("meta") or {}
        print(" title=%r slug=%r meta.slug=%r html_url=%r" % (
            i.get("title"), i.get("slug"), m.get("slug"), m.get("html_url")))
