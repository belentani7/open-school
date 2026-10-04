import sys
import os
import argparse
import tempfile
import numpy as np
from PIL import Image, ImageEnhance
import pymupdf
from pathlib import Path


def enhance_preserve_color(img_array, sharpness=2.0):
    img = Image.fromarray(img_array)
    img = ImageEnhance.Sharpness(img).enhance(sharpness)
    return img


def improve_pdf(input_path, output_path, dpi=300, sharpness=2.0):
    doc = pymupdf.open(input_path)
    page_count = len(doc)
    print(f"Procesando {page_count} paginas...")

    for i, page in enumerate(doc):
        mat = pymupdf.Matrix(dpi / 72, dpi / 72)
        pix = page.get_pixmap(matrix=mat)
        img_array = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, pix.n)

        enhanced = enhance_preserve_color(img_array, sharpness)

        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
            tmp_path = tmp.name

        enhanced.save(tmp_path)

        new_page = doc.new_page(width=enhanced.width, height=enhanced.height)
        new_page.insert_image(pymupdf.Rect(0, 0, enhanced.width, enhanced.height), filename=tmp_path)
        doc.delete_page(i)

        os.unlink(tmp_path)

        if (i + 1) % 5 == 0 or i == page_count - 1:
            print(f"  Pagina {i + 1}/{page_count} completada")

    doc.save(output_path)
    doc.close()
    print(f"Guardado: {output_path}")


def main():
    parser = argparse.ArgumentParser(description="Solo nitidez, sin alterar colores")
    parser.add_argument("input", help="Archivo PDF de entrada")
    parser.add_argument("-o", "--output", help="Archivo PDF de salida", default=None)
    parser.add_argument("--dpi", type=int, default=300, help="Resolucion DPI")
    parser.add_argument("--sharpness", type=float, default=2.0, help="Nitidez (1.0=sin cambio)")
    args = parser.parse_args()

    if not os.path.exists(args.input):
        print(f"Error: No se encontro {args.input}")
        sys.exit(1)

    output = args.output or str(Path(args.input).with_suffix(".mejorado.pdf"))
    improve_pdf(args.input, output, args.dpi, args.sharpness)


if __name__ == "__main__":
    main()