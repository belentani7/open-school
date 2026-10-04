"""Ingesta del intake verificado en el registro de fuentes.

El registro (`registry/<area>.json`) es la fuente de verdad y `sources.json` es
un artefacto generado. El intake en `registry/_intake/` contiene el resultado
del harvest mundial y del sondeo en vivo:

    approved.json              391 fuentes vivas (196 maquina-legibles, 195 portales)
    rejections.json            374 fuentes descartadas con su motivo
    approved_candidates.json   765 fichas completas (license, topics, parser, docs_url)
    raw_catalogs.json          225 semillas curadas (parser mas completo)

`approved.json` solo lleva el resultado del sondeo: no tiene `license`, `use`
ni `topics`. La ficha completa se recupera cruzando por `id` con los candidates
(cobertura medida: 391/391).

Politica de ingesta, alineada con las reglas de `registry/meta.json`:

  - regla 1: solo fuentes con endpoint documentado accesible sin credenciales
  - regla 2: licencia obligatoria para redistribucion

Por eso entran por defecto solo las fuentes maquina-legibles con licencia
declarada. Los portales HTML (195, ninguno con licencia determinada) y las
fichas con licencia sin determinar quedan fuera salvo que se pidan
explicitamente con `--include-portals` y `--include-unknown-license`.

Dos garantias de seguridad:

  - Nunca se resucita un id rechazado, sea cual sea el motivo del rechazo.
  - Solo se retira una entrada YA presente en el registro si su rechazo es
    definitivo (404 o bloqueo por credenciales). Los motivos dependientes del
    entorno local (timeout, TLS, rate limit) NO borran nada: una fuente buena
    no se pierde por un fallo de red de esta maquina.

Uso:
    python patch_registry.py                              # dry-run: informe, no escribe
    python patch_registry.py --apply                      # escribe registry/ y sources.json
    python patch_registry.py --include-portals            # anade tambien los 195 portales HTML
    python patch_registry.py --include-unknown-license    # anade fichas sin licencia determinada
"""

from __future__ import annotations

import argparse
import json
from collections import Counter, defaultdict
from pathlib import Path

import registry_loader as rl

ROOT = Path(__file__).parent
INTAKE = ROOT / "registry" / "_intake"

# Motivos de rechazo que prueban que la fuente no sirve. El resto son
# dependientes del entorno (timeout, TLS interceptado, 5xx transitorio, rate
# limit) y no justifican retirar una fuente ya presente.
DROP_REASONS_DEFINITIVE = {"http_404", "auth_required_or_blocked"}

UNKNOWN_LICENSES = {"", "unknown", "mixed", "sin determinar"}

# Retiradas decididas tras verify_sources.py. Los ids son los REALES del
# registro: el codigo antiguo usaba `ine_es` y `doaj`, que NUNCA coincidieron
# con los ids reales (`ine-es`, `doaj-articles`, `doaj-journals`), asi que esas
# dos retiradas quedaron sin aplicar y las fuentes seguian devolviendo 403.
DROP = {
    "ine-es": "403 Cloudflare; cubierto por datos.gob.es + Eurostat",
    "doaj-articles": "403 Cloudflare; requiere API key. Cubierto por OpenAlex + Crossref",
    "doaj-journals": "403 Cloudflare; requiere API key. Cubierto por OpenAlex + Crossref",
    "sciencemuseum-uk": "403 sin credenciales (verificado en vivo 2026-09-13)",
    "geoboundaries": "404 endpoint retirado (verificado en vivo 2026-09-13)",
    "dados_gov_br": "401 en CKAN anonimo; sustituido por IBGE + Camara",
    "gutendex": "TLS roto y respuesta HTML; sustituido por Gutenberg directo + LibriVox",
}

# Endpoints reparados manualmente (idempotente si ya estan aplicados).
LEGACY_REPLACE_URL = {
    "wiktionary_es": "https://es.wiktionary.org/w/api.php?action=query&list=search&srsearch={q}&format=json&srlimit=3",
    "freedict_en": "https://en.wiktionary.org/api/rest_v1/page/definition/{q}",
    "eurostat": "http://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/demo_gind?format=JSON&lang=EN",
    "datos_gob_es": "https://datos.gob.es/apidata/catalog/dataset/title/{q}?_pageSize=5",
    "eu_publications": "https://data.europa.eu/api/hub/search/search?q={q}&limit=5",
}

# Correcciones de campo detectadas al verificar en vivo. `oecd-dataflow`
# devuelve XML (application/vnd.sdmx.structure+xml) aunque se declaro json.
FIX_FIELDS = {
    "oecd-dataflow": {"kind": "xml"},
}

# Campos que se copian tal cual desde la ficha del candidate.
CANDIDATE_FIELDS = (
    "name", "url", "kind", "auth", "country", "region", "langs", "license",
    "docs_url", "rate_limit", "ttl_h", "tls_insecure", "http_only", "quality",
    "topics", "parser", "source",
)


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def load_intake() -> tuple[dict, list[dict], dict[str, dict]]:
    approved = load_json(INTAKE / "approved.json")
    rejections = load_json(INTAKE / "rejections.json")
    candidates = load_json(INTAKE / "approved_candidates.json")["entries"]
    raw = load_json(INTAKE / "raw_catalogs.json")["entries"]

    # Las semillas curadas llevan un `parser` mas completo: se superponen
    # encima de las fichas de candidates, que son el superconjunto.
    index = {c["id"]: dict(c) for c in candidates}
    for r in raw:
        index.setdefault(r["id"], {}).update(r)
    return approved, rejections["entries"], index


def derived_use(cand: dict, area: str) -> str:
    desc = str(cand.get("descripcion") or "").strip()
    if desc:
        return desc[:180]
    topics = [t for t in (cand.get("topics") or []) if t]
    if topics:
        return f"datos abiertos de {area}: " + ", ".join(topics[:4])
    return f"fuente de datos abiertos del area {area}"


def build_probe(approved_entry: dict) -> dict:
    ev = approved_entry.get("evidence") or {}
    return {
        "url": approved_entry.get("probe_url"),
        "status": ev.get("status"),
        "ctype": ev.get("ctype"),
        "bytes": ev.get("bytes"),
        "ms": ev.get("ms"),
        "records": ev.get("records"),
        "checked_utc": approved_entry.get("last_good_utc"),
    }


def materialize(approved_entry: dict, cand: dict, area: str) -> dict:
    out: dict = {"id": approved_entry["id"]}
    for field in CANDIDATE_FIELDS:
        if field in cand:
            out[field] = cand[field]

    if not out.get("name"):
        out["name"] = approved_entry.get("name") or approved_entry["id"]
    if not out.get("url"):
        out["url"] = approved_entry["url"]

    out["area"] = area
    out["use"] = derived_use(cand, area)
    out["probe"] = build_probe(approved_entry)
    out["last_good_utc"] = approved_entry.get("last_good_utc")
    out["portal_only"] = bool(approved_entry.get("portal_only"))
    if approved_entry.get("tls_insecure_observed"):
        out["tls_insecure"] = True

    shape = str(approved_entry.get("kind") or out.get("kind") or "")
    if shape in ("html", "text"):
        out["parser"] = None

    return rl.normalize(out, area)


def fix_existing(entry: dict) -> dict:
    eid = entry.get("id")
    if eid in LEGACY_REPLACE_URL:
        entry["url"] = LEGACY_REPLACE_URL[eid]
    for field, value in FIX_FIELDS.get(eid, {}).items():
        entry[field] = value
    # Relleno aditivo: la licencia ya estaba declarada pero sin URL asociada
    # (el mapa solo cubria 4 grafias). Nunca sobrescribe una URL existente.
    if not entry.get("license_url"):
        url = rl.LICENSE_URLS.get(str(entry.get("license", "")).strip())
        if url:
            entry["license_url"] = url
    return entry


def main() -> int:
    ap = argparse.ArgumentParser(description="Ingesta del intake verificado en registry/")
    ap.add_argument("--apply", action="store_true", help="escribe registry/ y sources.json")
    ap.add_argument("--include-portals", action="store_true",
                    help="incluye portales HTML (kind=html) pese a no tener licencia determinada")
    ap.add_argument("--include-unknown-license", action="store_true",
                    help="incluye fichas con licencia sin determinar")
    args = ap.parse_args()

    registry = rl.load_registry()
    before = {area: len(registry[area]) for area in rl.AREAS}
    existing_ids = {e["id"] for area in rl.AREAS for e in registry[area]}

    approved, rejections, candidates = load_intake()
    rejected_reason = {r["id"]: r["reason"] for r in rejections}
    definitive = {i for i, reason in rejected_reason.items() if reason in DROP_REASONS_DEFINITIVE}

    # 1. retiradas
    removed: list[tuple[str, str, str]] = []
    for area in rl.AREAS:
        kept = []
        for entry in registry[area]:
            eid = entry["id"]
            if eid in definitive:
                removed.append((eid, area, rejected_reason[eid]))
                continue
            if eid in DROP:
                removed.append((eid, area, DROP[eid]))
                continue
            kept.append(fix_existing(entry))
        registry[area] = kept

    # 2. altas
    added: list[tuple[str, str]] = []
    skipped: Counter = Counter()
    skipped_by_area: dict[str, Counter] = defaultdict(Counter)

    for entry in approved["entries"]:
        eid = entry["id"]
        area = entry.get("area")

        if area not in rl.AREAS:
            skipped[f"area_no_registrable ({area})"] += 1
            skipped_by_area[area or "sin_area"]["area_no_registrable"] += 1
            continue
        if eid in rejected_reason:
            skipped[f"id rechazado ({rejected_reason[eid]})"] += 1
            continue
        if eid in existing_ids:
            skipped["ya en el registro"] += 1
            continue

        cand = candidates.get(eid)
        if cand is None:
            skipped["sin ficha de candidate"] += 1
            continue
        if entry.get("portal_only") and not args.include_portals:
            skipped["portal HTML (sin licencia)"] += 1
            skipped_by_area[area]["portal HTML"] += 1
            continue
        if str(cand.get("license") or "").strip().lower() in UNKNOWN_LICENSES and not args.include_unknown_license:
            skipped["licencia sin determinar"] += 1
            skipped_by_area[area]["licencia sin determinar"] += 1
            continue

        registry[area].append(materialize(entry, cand, area))
        added.append((eid, area))

    # 3. informe
    after = {area: len(registry[area]) for area in rl.AREAS}
    total_before = sum(before.values())
    total_after = sum(after.values())

    print("=" * 72)
    print("INGESTA DEL INTAKE VERIFICADO -> registry/")
    print("=" * 72)
    print(f"  modo                : {'APLICAR' if args.apply else 'DRY-RUN (no escribe)'}")
    print(f"  portales HTML       : {'incluidos' if args.include_portals else 'excluidos'}")
    print(f"  licencia sin determ.: {'incluida' if args.include_unknown_license else 'excluida'}")
    print()
    print(f"  fuentes aprobadas en el intake : {len(approved['entries'])}")
    print(f"  fuentes rechazadas en el intake: {len(rejections)}")
    print(f"  fichas de candidate disponibles: {len(candidates)}")

    print()
    print("--- retiradas ---")
    if removed:
        for eid, area, why in removed:
            print(f"  DROP  {eid:<24} [{area}] {why}")
    else:
        print("  (ninguna)")

    print()
    print("--- altas por area ---")
    by_area: Counter = Counter(area for _, area in added)
    for area in rl.AREAS:
        if by_area.get(area):
            print(f"  ADD   {area:<20} {by_area[area]:>4}")
    if not added:
        print("  (ninguna)")

    print()
    print("--- excluidas, por motivo ---")
    for reason, n in skipped.most_common():
        print(f"  SKIP  {reason:<40} {n}")
    if not skipped:
        print("  (ninguna)")

    print()
    print("--- efecto por area ---")
    print(f"  {'area':<20} {'antes':>6} {'despues':>8} {'delta':>7}")
    for area in rl.AREAS:
        delta = after[area] - before[area]
        mark = "" if delta == 0 else ("+" if delta > 0 else "-")
        print(f"  {area:<20} {before[area]:>6} {after[area]:>8} {mark}{abs(delta):>6}")
    print(f"  {'TOTAL':<20} {total_before:>6} {total_after:>8} {total_after - total_before:>+7}")

    # 4. comprobaciones de seguridad antes de escribir
    print()
    print("--- comprobaciones ---")
    all_ids = [e["id"] for area in rl.AREAS for e in registry[area]]
    dupes = sorted({i for i in all_ids if all_ids.count(i) > 1})
    # Regla dura: un id rechazado nunca se da de alta.
    resurrected = sorted({eid for eid, _ in added} & set(rejected_reason))
    # Caso distinto y deliberado: fuentes ya presentes cuyo rechazo no es
    # definitivo (timeout o TLS de esta maquina). Se conservan.
    kept_rejected = sorted(set(all_ids) & set(rejected_reason))
    missing = [
        e["id"]
        for area in rl.AREAS
        for e in registry[area]
        if not e.get("license") or e.get("auth") != "none"
    ]
    print(f"  ids duplicados                    : {len(dupes)} {dupes[:6]}")
    print(f"  altas de un id rechazado (debe 0) : {len(resurrected)} {resurrected[:6]}")
    print(f"  entradas sin licencia o con auth  : {len(missing)} {missing[:6]}")
    if kept_rejected:
        print(f"  conservadas pese a un rechazo no definitivo: {len(kept_rejected)}")
        for eid in kept_rejected:
            print(f"    KEEP  {eid:<24} motivo del rechazo: {rejected_reason[eid]}")

    blocked = bool(dupes or resurrected or missing)
    if blocked:
        print("\n  BLOQUEADO: hay violaciones; no se escribe nada.")
        return 1

    if not args.apply:
        print("\n  dry-run: nada escrito. Repite con --apply para aplicar.")
        return 0

    meta = rl.load_meta()
    newest = max(
        (e.get("last_good_utc") or "" for area in rl.AREAS for e in registry[area]),
        default="",
    )
    if newest:
        meta["verified_at"] = newest
    meta["fix_log"] = (
        (meta.get("fix_log") or "") + " | "
        f"2026-09-13: ingesta del harvest mundial desde registry/_intake "
        f"(approved.json + rejections.json): {len(added)} altas, {len(removed)} retiradas, "
        f"{total_after} fuentes. Excluidas por la regla 2 de licencia: portales HTML y "
        f"fichas sin licencia determinada."
    )
    rl.save_all(registry, meta)
    rl.sync_sources_json()
    print(f"\n  escrito: registry/ (8 areas + _merged.json + index.json) y sources.json")
    print(f"  total en registro: {total_after}")
    return rl.check()


if __name__ == "__main__":
    raise SystemExit(main())
