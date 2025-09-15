#!/bin/bash
set -e

# ✅ Build Next.js (standalone mode must be enabled in next.config.js)
npm run build

# ✅ Copy required files into the standalone build
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static
cp package-lock.json .next/standalone/package-lock.json || true
cp .env.production .next/standalone/.env.production || true
cp .env .next/standalone/.env || true

# ✅ Move into standalone folder
cd .next/standalone

# ✅ Deploy using Freestyle CLI
npx freestyle deploy \
  --web server.js \
  --domain build.baselineai.in \
  --timeout 360
