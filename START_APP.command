#!/bin/bash
cd "$(dirname "$0")"

if lsof -i :3000 >/dev/null 2>&1; then
  echo "Server sudah aktif di port 3000. Membuka browser..."
else
  echo "Menjalankan server..."
  npm run dev &
  sleep 2
fi

open "http://localhost:3000/"
