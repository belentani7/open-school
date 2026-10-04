"""Normaliza el material curricular existente de Manos Abiertas.

El proyecto ya tenia un curriculum completo (4 niveles, 21 modulos, 280 h) en un
JSON de archivo con mucha informacion anidada que la web no consumia. Este paso
extrae su estructura real (niveles, modulos, horas, objetivos) y la deja en un
`curriculum.json` compacto y estable que el frontend puede cargar sin depender de
la forma cruda del documento original.

Uso:
    python gen_curriculum.py \
        --src <repo>/data/curriculum.source.json \
        --out <repo>/curriculum.json
"""

from __future__ import annotations

import argparse
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path


def _horas(modulos: list[dict]) -> int:
    return sum(int(m.get("duracion_horas") or 0) for m in modulos)


def normaliza(src: Path) -> dict:
    crudo = json.loads(src.read_text(encoding="utf-8"))
    proyecto = crudo.get("proyecto", {})
    niveles = []
    for nivel in crudo.get("niveles", []):
        modulos = nivel.get("modulos", []) or []
        niveles.append({
            "id": nivel.get("id"),
            "nombre": nivel.get("nombre"),
            "icono": nivel.get("icono"),
            "descripcion": nivel.get("descripcion") or nivel.get("objetivo_general") or "",
            "horas": _horas(modulos),
            "modulos": [
                {
                    "codigo": m.get("codigo"),
                    "titulo": m.get("titulo"),
                    "horas": int(m.get("duracion_horas") or 0),
                    "dificultad": m.get("nivel_dificultad") or "",
                    "prerrequisitos": m.get("prerrequisitos") or [],
                    "objetivos": m.get("objetivos_aprendizaje") or [],
                }
                for m in modulos
            ],
        })
    total_modulos = sum(len(n["modulos"]) for n in niveles)
    idiomas = (crudo.get("recursos_globales", {})
               .get("youtube_tutoriales_39_idiomas", {})
               .get("lista_completa_idiomas", []) or [])
    return {
        "proyecto": {
            "nombre": proyecto.get("nombre") or "Manos Abiertas",
            "version": proyecto.get("version") or "",
            "licencia": proyecto.get("licencia") or "",
            "idioma_principal": proyecto.get("idioma_principal") or "es",
            "descripcion": proyecto.get("descripcion") or "",
        },
        "generado_utc": datetime.now(timezone.utc).replace(microsecond=0).isoformat(),
        "origen": {
            "archivo": src.name,
            "sha256": hashlib.sha256(src.read_bytes()).hexdigest(),
        },
        "orden_idiomas": ["pt", "es", "en", "ca"],
        "estadistica": {
            "total_niveles": len(niveles),
            "total_modulos": total_modulos,
            "horas_estimadas": sum(n["horas"] for n in niveles),
        },
        "niveles": niveles,
        "recursos": {
            "canales_por_idioma": [
                {
                    "codigo": i.get("codigo"),
                    "nombre": i.get("nombre") or i.get("nome") or i.get("codigo"),
                    "canales": i.get("canales") or [],
                }
                for i in idiomas
            ],
        },
    }


def main() -> int:
    ap = argparse.ArgumentParser(description="Normaliza el curriculum de Manos Abiertas")
    ap.add_argument("--src", required=True, help="JSON de origen (material existente)")
    ap.add_argument("--out", required=True, help="JSON normalizado de salida")
    args = ap.parse_args()

    src, out = Path(args.src), Path(args.out)
    data = normaliza(src)
    out.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    est = data["estadistica"]
    print(f"{out.name}: {est['total_niveles']} niveles, {est['total_modulos']} modulos, "
          f"{est['horas_estimadas']} h")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
