import sys
import os
import glob
from pathlib import Path
from PIL import Image, ImageEnhance
import pymupdf

desktop = r"C:\Users\USER\Desktop"
output_dir = r"C:\Users\USER\Desktop\PDFs_mejorados"
os.makedirs(output_dir, exist_ok=True)

image_files = []
for ext in ["*.png", "*.jpg", "*.jpeg", "*.bmp", "*.gif", "*.tiff"]:
    for f in glob.glob(os.path.join(desktop, "**", ext), recursive=True):
        if "noiacore" not in f.lower():
            image_files.append(f)

image_files = sorted(set(image_files))
print(f"Encontradas {len(image_files)} imagenes")

for img_path in image_files:
    basename = Path(img_path).stem
    pdf_path = os.path.join(output_dir, f"{basename}.pdf")
    improved_path = os.path.join(output_dir, f"{basename}_MEJORADO.pdf")

    print(f"Procesando {basename}...")
    img = Image.open(img_path)
    img_rgb = img.convert("RGB")
    img_rgb.save(pdf_path, "PDF", resolution=150)

    print(f"  Solo nitidez...")
    os.system(f'python scripts\\improve-pdf-color.py "{pdf_path}" -o "{improved_path}" --dpi 200 --sharpness 2.0')

    os.remove(pdf_path)
    print(f"  -> {improved_path}")

print(f"\nTerminado. {len(image_files)} archivos procesados.")
print(f"Resultados en: {output_dir}")
