import sys
import os
import argparse
import tempfile
from pathlib import Path

import pymupdf
import cv2
import numpy as np
from PIL import Image, ImageEnhance


def enhance_image(img_array, contrast=1.5, brightness=1.1, sharpness=2.0, threshold=0):
    img = Image.fromarray(cv2.cvtColor(img_array, cv2.COLOR_BGR2RGB))
    img = ImageEnhance.Contrast(img).enhance(contrast)
    img = ImageEnhance.Brightness(img).enhance(brightness)
    img = ImageEnhance.Sharpness(img).enhance(sharpness)
    if threshold > 0:
        gray = img.convert("L")
        img = gray.point(lambda x: 255 if x > threshold else 0)
    return np.array(img)


def improve_pdf(input_path, output_path, dpi=300, contrast=1.5, brightness=1.1, sharpness=2.0, threshold=0):
    doc = pymupdf.open(input_path)
    page_count = len(doc)
    print(f"Procesando {page_count} paginas...")

    for i, page in enumerate(doc):
        pix = page.get_pixmap(matrix=pymupdf.Matrix(dpi / 72, dpi / 72))
        img_array = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, pix.n)

        enhanced = enhance_image(img_array, contrast, brightness, sharpness, threshold)

        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
            tmp_path = tmp.name

        enhanced_img = Image.fromarray(enhanced)
        enhanced_img.save(tmp_path)

        new_page = doc.new_page(width=enhanced_img.width, height=enhanced_img.height)
        new_page.insert_image(pymupdf.Rect(0, 0, enhanced_img.width, enhanced_img.height), filename=tmp_path)
        doc.delete_page(i)

        os.unlink(tmp_path)

        if (i + 1) % 5 == 0 or i == page_count - 1:
            print(f"  Pagina {i + 1}/{page_count} completada")

    doc.save(output_path)
    doc.close()
    print(f"Guardado: {output_path}")


def main():
    parser = argparse.ArgumentParser(description="Mejora la visibilidad de texto en PDFs")
    parser.add_argument("input", help="Archivo PDF de entrada")
    parser.add_argument("-o", "--output", help="Archivo PDF de salida", default=None)
    parser.add_argument("--dpi", type=int, default=300, help="Resolucion DPI")
    parser.add_argument("--contrast", type=float, default=1.5, help="Contraste (1.0=sin cambio)")
    parser.add_argument("--brightness", type=float, default=1.1, help="Brillo (1.0=sin cambio)")
    parser.add_argument("--sharpness", type=float, default=2.0, help="Nitidez (1.0=sin cambio)")
    parser.add_argument("--threshold", type=int, default=0, help="Umbral binario (0=desactivado)")
    args = parser.parse_args()

    if not os.path.exists(args.input):
        print(f"Error: No se encontro {args.input}")
        sys.exit(1)

    output = args.output or str(Path(args.input).with_suffix(".mejorado.pdf"))
    improve_pdf(args.input, output, args.dpi, args.contrast, args.brightness, args.sharpness, args.threshold)


if __name__ == "__main__":
    main()