#!/bin/bash
export PATH="$HOME/.node/bin:/usr/local/bin:/opt/homebrew/bin:/opt/homebrew/sbin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR" || exit 1

TARGET_URL=""
if lsof -i :4173 >/dev/null 2>&1; then
    TARGET_URL="http://localhost:4173"
elif lsof -i :3000 >/dev/null 2>&1; then
    TARGET_URL="http://localhost:3000"
else
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

open "$TARGET_URL"
