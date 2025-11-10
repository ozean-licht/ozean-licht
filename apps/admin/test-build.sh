#!/bin/bash
# Clean build test
rm -rf .next
export NEXTAUTH_URL=https://dashboard.ozean-licht.dev
export NODE_ENV=production
npm run build 2>&1 | tee build-output.log
