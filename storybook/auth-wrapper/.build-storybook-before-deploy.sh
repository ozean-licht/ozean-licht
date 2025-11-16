#!/bin/bash
# Build Storybook before deploying auth wrapper
# Run this script before deploying to Coolify

cd /opt/ozean-licht-ecosystem
pnpm build-storybook
echo "✅ Storybook built to storybook/build/"
echo "Now deploy to Coolify"
