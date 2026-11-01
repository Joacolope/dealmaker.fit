#!/usr/bin/env bash
# Exporta cada etapa del Roadmap DealMaker FIT a PDF con Chrome headless (usa el @media print de roadmap.css).
# Uso: con la carpeta plan/ servida en http://localhost:4190 (npx serve -l 4190 plan), correr:
#   bash herramientas/armar-roadmap-pdf.sh
# Correrlo cada vez que cambie el contenido (plan/roadmap/etapas.js).
set -e
cd "$(dirname "$0")/.."
CHROME="${CHROME:-/c/Program Files/Google/Chrome/Application/chrome.exe}"
BASE="${BASE:-http://localhost:4190}"
for slug in tecnico crecimiento emprendedor empresario; do
  "$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=8000 \
    --print-to-pdf="$(pwd)/plan/roadmap/$slug.pdf" "$BASE/roadmap/$slug" 2>/dev/null
  echo "plan/roadmap/$slug.pdf"
done
