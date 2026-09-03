#!/bin/bash
# ==============================================================================
# RIZ-PROLOG — PINTASAN OTOMATIS BUKA APLIKASI DI LAPTOP
# PT. RIZ PRODUCTION MULTI KREASI
# ==============================================================================

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "======================================================="
echo "   MEMBUKA APLIKASI RIZ-PROLOG DI BROWSER LAPTOP...   "
echo "======================================================="

cd "$DIR"
open "http://localhost:4173"
npx vite preview --port 4173 --host
