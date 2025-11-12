#!/bin/bash
# Legacy wrapper for adw_patch_iso.py
# Calls TypeScript API endpoint instead

set -e

ISSUE_NUMBER=$1
MODEL_SET=${2:-base}
API_URL="${ADW_API_URL:-http://localhost:8003}"

if [ -z "$ISSUE_NUMBER" ]; then
  echo "Usage: $0 <issue_number> [model_set]"
  exit 1
fi

echo "========================================"
echo "  DEPRECATION WARNING"
echo "========================================"
echo "Python scripts are deprecated."
echo "Using TypeScript API endpoint instead."
echo ""
echo "Issue: #$ISSUE_NUMBER | Model: $MODEL_SET"
echo "Workflow: patch"
echo "========================================"
echo ""

# Create and execute patch workflow
curl -X POST "$API_URL/api/adw/workflows/patch" \
  -H "Content-Type: application/json" \
  -d "{
    \"issueNumber\": $ISSUE_NUMBER,
    \"modelSet\": \"$MODEL_SET\"
  }" | jq .
