#!/usr/bin/env python3
"""Render each page of a PDF as slide-NN.jpg for visual QA (PyMuPDF, no poppler needed).

Usage: python3 scripts/pdf2img.py deck.pdf [outdir] [dpi]
Prints the absolute path of each generated image (pass it as-is to the read tool).
"""
import pathlib
import sys

import fitz  # PyMuPDF

pdf = sys.argv[1]
outdir = pathlib.Path(sys.argv[2]) if len(sys.argv) > 2 else pathlib.Path(".")
dpi = int(sys.argv[3]) if len(sys.argv) > 3 else 150
outdir.mkdir(parents=True, exist_ok=True)

for old in outdir.glob("slide-*.jpg"):
    old.unlink()  # purge renders from a previous build

doc = fitz.open(pdf)
pad = max(2, len(str(doc.page_count)))
for i, page in enumerate(doc, 1):
    path = outdir / f"slide-{i:0{pad}d}.jpg"
    page.get_pixmap(dpi=dpi).save(path, jpg_quality=85)
    print(path.resolve())
