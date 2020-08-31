#!/bin/bash
echo "[I] | Updating the Bot..."
echo "[I] | Downloading latest version..."
git reset --hard
git checkout
git pull
echo "[I] | (Re-)building..."
npm run build
#echo "[I] | (Re-)starting the bot..."
#pm2 start pm2-start.json
echo "[I] | Done."
