#!/usr/bin/env bash
set -euo pipefail

v=$(date +%Y%m%d%H%M%S)

# update cache-busting querystrings in index pages
sed -i "s/style\.css?v=[0-9]\+/style.css?v=$v/g; s/script\.js?v=[0-9]\+/script.js?v=$v/g" index.html 2>/dev/null || true
sed -i "s/style\.css?v=[0-9]\+/style.css?v=$v/g; s/script\.js?v=[0-9]\+/script.js?v=$v/g" index-fr.html 2>/dev/null || true

git add index.html index-fr.html 2>/dev/null || true
git commit -m "chore: bump asset cache version ($v)" || { echo "Nothing to commit"; exit 0; }
git push
