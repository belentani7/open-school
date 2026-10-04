# open-data

Pack de datos abiertos de **investigacion abierta (OpenAlex)**.

- **Fuente:** <https://api.openalex.org/works?per-page=100&select=id,title,publication_year,cited_by_count,doi,type>
- **Clave de API:** no requiere.
- **Generado:** ver `meta.generated_at` en `open-research.json`.

## Ficheros

| Fichero | Descripcion |
|---|---|
| `open-research.json` | Registros con metadatos + bloque `meta` |
| `open-research.csv` | El mismo pack en tabla |

## Regenerar

```bash
python scripts/fetch_open_data.py
```

Usa solo la libreria estandar.

## Licencia

Datos de OpenAlex (licencia CC0). Codigo del pack: MIT.
