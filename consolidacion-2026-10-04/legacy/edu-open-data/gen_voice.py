"""Genera la voz de bienvenida de cada portal en PT > ES > EN > CA.

Usa edge-tts (voces neuronales, gratis, sin API key). El audio se pre-renderiza
en build y se commitea: cero descarga en el navegador, funciona sin conexion.

Salida por portal:
    portals/<portal>/voces/<lang>/bienvenida.mp3
    portals/<portal>/voces/bienvenida-<lang>.mp3   (drop-in para campus/voces/)
    portals/<portal>/voces/manifest.json

Uso:
    python gen_voice.py                     # todos los portales
    python gen_voice.py manosabiertas       # uno
    python gen_voice.py --dry-run           # solo imprime los guiones
"""

from __future__ import annotations

import asyncio
import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).parent
PORTALS = ROOT / "portals"

# Orden fijo del ecosistema. No reordenar.
LANGS = ["pt", "es", "en", "ca"]

VOICES = {
    "pt": "pt-BR-FranciscaNeural",
    "es": "es-ES-ElviraNeural",
    "en": "en-US-AriaNeural",
    "ca": "ca-ES-JoanaNeural",
}

GUION = {
    "pt": (
        "Bem-vindo ao portal de referência {portal}. Domínio: {dominio}. "
        "Reúne {temas_n} temas construídos a partir de {fontes_n} fontes de dados "
        "abertos verificadas: {temas}. Tudo gratuito, sem credenciais, "
        "e funciona sem ligação à Internet."
    ),
    "es": (
        "Bienvenido al portal de referencia {portal}. Dominio: {dominio}. "
        "Reúne {temas_n} temas construidos a partir de {fontes_n} fuentes de datos "
        "abiertos verificadas: {temas}. Todo gratuito, sin credenciales, "
        "y funciona sin conexión."
    ),
    "en": (
        "Welcome to the {portal} reference portal. Domain: {dominio}. "
        "It brings together {temas_n} topics built from {fontes_n} verified open "
        "data sources: {temas}. All free, no credentials, and it works offline."
    ),
    "ca": (
        "Benvingut al portal de referència {portal}. Domini: {dominio}. "
        "Aplega {temas_n} temes construïts a partir de {fontes_n} fonts de dades "
        "obertes verificades: {temas}. Tot gratuït, sense credencials, "
        "i funciona sense connexió."
    ),
}


def read_manifest(portal_id: str) -> dict:
    return json.loads((PORTALS / portal_id / "topics.json").read_text(encoding="utf-8"))


def build_scripts(man: dict) -> dict[str, str]:
    temas = [t["tema"].replace("-", " ") for t in man["temas"]]
    temas_n = len(temas)
    fontes_n = len({f["fuente"] for f in man["fuentes"]})
    campos = {
        "portal": man["portal"],
        "dominio": man["dominio"],
        "temas_n": temas_n,
        "fontes_n": fontes_n,
        "temas": ", ".join(temas),
    }
    return {lang: GUION[lang].format(**campos) for lang in LANGS}


async def synth(text: str, voice: str, dest: Path) -> None:
    import edge_tts

    dest.parent.mkdir(parents=True, exist_ok=True)
    await edge_tts.Communicate(text, voice).save(str(dest))


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    h.update(path.read_bytes())
    return h.hexdigest()


def run_portal(portal_id: str, dry: bool) -> dict:
    man = read_manifest(portal_id)
    scripts = build_scripts(man)
    base = PORTALS / portal_id / "voces"
    entry = {
        "portal": portal_id,
        "dominio": man["dominio"],
        "orden_idiomas": LANGS,
        "generado_utc": datetime.now(timezone.utc).replace(microsecond=0).isoformat(),
        "motor": "edge-tts (voces neuronales, sin API key)",
        "idiomas": {},
    }
    for lang in LANGS:
        texto = scripts[lang]
        ruta = base / lang / "bienvenida.mp3"
        plano = base / f"bienvenida-{lang}.mp3"
        if not dry:
            asyncio.run(synth(texto, VOICES[lang], ruta))
            plano.write_bytes(ruta.read_bytes())
            entry["idiomas"][lang] = {
                "voz": VOICES[lang],
                "guion": texto,
                "archivo": f"voces/{lang}/bienvenida.mp3",
                "bytes": ruta.stat().st_size,
                "sha256": sha256(ruta),
            }
            print(f"  {portal_id:<22} {lang}  {ruta.stat().st_size:>7} B")
        else:
            entry["idiomas"][lang] = {"voz": VOICES[lang], "guion": texto}
    if not dry:
        (base / "manifest.json").write_text(
            json.dumps(entry, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
    return entry


def main() -> int:
    dry = "--dry-run" in sys.argv
    wanted = [a for a in sys.argv[1:] if not a.startswith("-")]
    targets = wanted or sorted(
        p.name for p in PORTALS.iterdir() if (p / "topics.json").exists()
    )
    total = 0
    for portal_id in targets:
        print(f"[{portal_id}]" + (" (dry-run)" if dry else ""), flush=True)
        try:
            run_portal(portal_id, dry)
            total += len(LANGS)
        except Exception as exc:  # noqa: BLE001
            print(f"  ERROR {portal_id}: {str(exc)[:200]}")
    print(f"\nportales={len(targets)} clips={total} idiomas={','.join(LANGS)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
