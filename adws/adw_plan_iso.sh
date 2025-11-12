#!/bin/bash
# Legacy wrapper for adw_plan_iso.py
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
echo "========================================"
echo ""

# Create workflow with plan type
RESPONSE=$(curl -s -X POST "$API_URL/api/adw/workflows" \
  -H "Content-Type: application/json" \
  -d "{
    \"issueNumber\": $ISSUE_NUMBER,
    \"workflowType\": \"plan\",
    \"modelSet\": \"$MODEL_SET\"
  }")

echo "$RESPONSE" | jq .

ADW_ID=$(echo "$RESPONSE" | jq -r '.adwId // empty')

if [ -n "$ADW_ID" ]; then
  echo ""
  echo "Workflow created: $ADW_ID"
  echo "View status: $API_URL/api/adw/workflows/$ADW_ID"
fi
