# Mejorar PDF - Mejora de visibilidad de texto

Script para mejorar la visibilidad del texto en PDFs de fotos generadas por IA o escaneadas.

## Uso

```
python scripts/improve-pdf.py ARCHIVO_DE_ENTRADA.pdf [-o SALIDA.pdf] [OPCIONES]
```

## Opciones

| Opcion | Default | Descripcion |
|--------|---------|-------------|
| --dpi | 300 | Resolucion de renderizado |
| --contrast | 1.5 | Contraste (1.0 = sin cambio) |
| --brightness | 1.1 | Brillo (1.0 = sin cambio) |
| --sharpness | 2.0 | Nitidez (1.0 = sin cambio) |
| --threshold | 0 | Umbral binario (0 = desactivado) |

## Ejemplos

```
python scripts/improve-pdf.py foto-documento.pdf
python scripts/improve-pdf.py foto-documento.pdf -o resultado.pdf --contrast 2.0 --sharpness 3.0
python scripts/improve-pdf.py foto-documento.pdf --threshold 128
```

## Requisitos

- Python 3.11+
- pymupdf, opencv-python-headless, numpy, Pillow

Instalacion: `pip install pymupdf opencv-python-headless Pillow numpy`
