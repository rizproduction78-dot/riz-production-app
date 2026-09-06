#!/bin/bash
# ==============================================================================
# RIZ-PROLOG — PINTASAN OTOMATIS BUKA APLIKASI DI LAPTOP
# PT. RIZ PRODUCTION MULTI KREASI
# ==============================================================================

export PATH="/usr/local/bin:/opt/homebrew/bin:/opt/homebrew/sbin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR" || exit 1

echo "======================================================="
echo "   MEMBUKA APLIKASI RIZ-PROLOG (PT RIZ PRODUCTION)    "
echo "======================================================="

TARGET_URL=""

if lsof -i :4173 >/dev/null 2>&1; then
    echo "✓ Server preview aktif di port 4173."
    TARGET_URL="http://localhost:4173"
elif lsof -i :3000 >/dev/null 2>&1; then
    echo "✓ Server dev aktif di port 3000."
    TARGET_URL="http://localhost:3000"
else
    echo "▶ Memulai server lokal aplikasi..."
    npm run dev >/dev/null 2>&1 &
    
    for i in {1..20}; do
        if lsof -i :3000 >/dev/null 2>&1; then
            TARGET_URL="http://localhost:3000"
            break
        elif lsof -i :4173 >/dev/null 2>&1; then
            TARGET_URL="http://localhost:4173"
            break
        fi
        sleep 0.5
    done
fi

if [ -z "$TARGET_URL" ]; then
    TARGET_URL="http://localhost:3000"
fi

echo "✓ Membuka browser: $TARGET_URL"
open "$TARGET_URL"
echo "✓ Aplikasi berhasil dibuka!"
sleep 1
