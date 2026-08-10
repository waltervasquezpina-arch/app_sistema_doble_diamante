"""
extract_fichas.py
Extrae texto de las 12 fichas PDF de innovación PIIP - AGROIDEAS
y genera un archivo data/seed.js con los datos estructurados.
"""

import os
import sys
import json
import re
from pypdf import PdfReader

# Forzar UTF-8 en la consola de Windows
sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DOC_DIR  = os.path.join(BASE_DIR, "..", "Document")
OUT_DIR  = os.path.join(BASE_DIR, "..", "data")

FICHAS = [
    "ficha N° IN0001 .pdf",
    "ficha N° IN0002 .pdf",
    "Ficha N° IN0003  .pdf",
    "ficha N° IN0004 .pdf",
    "ficha N° IN0005 .pdf",
    "ficha N° IN0006 .pdf",
    "ficha N° IN0007 .pdf",
    "ficha N° IN0008 .pdf",
    "ficha N° IN0009  .pdf",
    "Ficha N° IN0010 .pdf",
    "ficha N° IN0011 .pdf",
    "ficha N° IN0012 .pdf",
]

def clean(text):
    """Normaliza el texto extraído del PDF."""
    if not text:
        return ""
    # Colapsa espacios múltiples y saltos de línea
    text = re.sub(r'\s+', ' ', text).strip()
    # Elimina caracteres raros de OCR
    text = re.sub(r'[^\w\sáéíóúÁÉÍÓÚñÑüÜ¿?¡!.,;:()\-\/°%]', '', text)
    return text

def extract_pdf_text(filepath):
    """Extrae todo el texto de un PDF página por página."""
    try:
        reader = PdfReader(filepath)
        pages = []
        for page in reader.pages:
            t = page.extract_text()
            if t:
                pages.append(t)
        return "\n".join(pages)
    except Exception as e:
        return f"[ERROR leyendo PDF: {e}]"

def main():
    os.makedirs(OUT_DIR, exist_ok=True)

    results = []
    for i, filename in enumerate(FICHAS, start=1):
        filepath = os.path.join(DOC_DIR, filename)
        code = f"IN{i:04d}"
        print(f"Leyendo {code}: {filename}")

        if not os.path.exists(filepath):
            print(f"  WARN: Archivo no encontrado: {filepath}")
            raw_text = ""
        else:
            raw_text = extract_pdf_text(filepath)

        results.append({
            "code": code,
            "filename": filename,
            "raw_text": raw_text[:8000],  # Límite para evitar JSONs gigantes
            "char_count": len(raw_text)
        })
        print(f"  OK Extraidos {len(raw_text)} caracteres")

    # Guardar texto crudo para inspección
    raw_path = os.path.join(OUT_DIR, "raw_fichas.json")
    with open(raw_path, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Texto crudo guardado en: {raw_path}")
    print("Revisa el archivo y luego ejecuta generate_seed.py")

if __name__ == "__main__":
    main()
