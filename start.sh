#!/bin/bash
echo "[I] | Downloading latest version..."
git reset --hard
git checkout
git pull
echo "[I] | Installing node modules..."
rm -rf node_modules/
npm install imagemin
npm install imagemin-gifsicle
npm install imagemin-jpegtran
npm install imagemin-pngquant
npm install
echo "[I] | Building..."
npm run build
echo "[I] | (Re-)starting the bot..."
pm2 start pm2-start.json
echo "[I] | Done..."
