#!/bin/bash
# Script to generate shell wrappers for Python ADW entry points
# These wrappers replace Python scripts with TypeScript API calls

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
API_URL="${ADW_API_URL:-http://localhost:8003}"

echo "Creating shell wrappers for ADW workflows..."
echo "API URL: $API_URL"
echo ""

# ============================================================================
# Single-Phase Wrappers
# ============================================================================

cat > "$SCRIPT_DIR/adw_plan_iso.sh" << 'EOF'
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
EOF

cat > "$SCRIPT_DIR/adw_build_iso.sh" << 'EOF'
#!/bin/bash
# Legacy wrapper for adw_build_iso.py
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

# Create workflow with build type
curl -X POST "$API_URL/api/adw/workflows" \
  -H "Content-Type: application/json" \
  -d "{
    \"issueNumber\": $ISSUE_NUMBER,
    \"workflowType\": \"build\",
    \"modelSet\": \"$MODEL_SET\"
  }" | jq .
EOF

cat > "$SCRIPT_DIR/adw_test_iso.sh" << 'EOF'
#!/bin/bash
# Legacy wrapper for adw_test_iso.py
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

# Create workflow with test type
curl -X POST "$API_URL/api/adw/workflows" \
  -H "Content-Type: application/json" \
  -d "{
    \"issueNumber\": $ISSUE_NUMBER,
    \"workflowType\": \"test\",
    \"modelSet\": \"$MODEL_SET\"
  }" | jq .
EOF

cat > "$SCRIPT_DIR/adw_review_iso.sh" << 'EOF'
#!/bin/bash
# Legacy wrapper for adw_review_iso.py
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

# Create workflow with review type
curl -X POST "$API_URL/api/adw/workflows" \
  -H "Content-Type: application/json" \
  -d "{
    \"issueNumber\": $ISSUE_NUMBER,
    \"workflowType\": \"review\",
    \"modelSet\": \"$MODEL_SET\"
  }" | jq .
EOF

cat > "$SCRIPT_DIR/adw_document_iso.sh" << 'EOF'
#!/bin/bash
# Legacy wrapper for adw_document_iso.py
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

# Create workflow with document type
curl -X POST "$API_URL/api/adw/workflows" \
  -H "Content-Type: application/json" \
  -d "{
    \"issueNumber\": $ISSUE_NUMBER,
    \"workflowType\": \"document\",
    \"modelSet\": \"$MODEL_SET\"
  }" | jq .
EOF

cat > "$SCRIPT_DIR/adw_ship_iso.sh" << 'EOF'
#!/bin/bash
# Legacy wrapper for adw_ship_iso.py
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

# Create workflow with ship type
curl -X POST "$API_URL/api/adw/workflows" \
  -H "Content-Type: application/json" \
  -d "{
    \"issueNumber\": $ISSUE_NUMBER,
    \"workflowType\": \"ship\",
    \"modelSet\": \"$MODEL_SET\"
  }" | jq .
EOF

# ============================================================================
# Composite Workflow Wrappers
# ============================================================================

cat > "$SCRIPT_DIR/adw_plan_build_iso.sh" << 'EOF'
#!/bin/bash
# Legacy wrapper for adw_plan_build_iso.py
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
echo "Workflow: plan-build"
echo "========================================"
echo ""

# Create and execute plan-build workflow
curl -X POST "$API_URL/api/adw/workflows/quick/plan-build" \
  -H "Content-Type: application/json" \
  -d "{
    \"issueNumber\": $ISSUE_NUMBER,
    \"modelSet\": \"$MODEL_SET\"
  }" | jq .
EOF

cat > "$SCRIPT_DIR/adw_plan_build_test_iso.sh" << 'EOF'
#!/bin/bash
# Legacy wrapper for adw_plan_build_test_iso.py
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
echo "Workflow: plan-build-test"
echo "========================================"
echo ""

# Create and execute plan-build-test workflow
curl -X POST "$API_URL/api/adw/workflows/quick/plan-build-test" \
  -H "Content-Type: application/json" \
  -d "{
    \"issueNumber\": $ISSUE_NUMBER,
    \"modelSet\": \"$MODEL_SET\"
  }" | jq .
EOF

cat > "$SCRIPT_DIR/adw_plan_build_review_iso.sh" << 'EOF'
#!/bin/bash
# Legacy wrapper for adw_plan_build_review_iso.py
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
echo "Workflow: plan-build-review"
echo "========================================"
echo ""

# Create and execute plan-build-review workflow
curl -X POST "$API_URL/api/adw/workflows/quick/plan-build-review" \
  -H "Content-Type: application/json" \
  -d "{
    \"issueNumber\": $ISSUE_NUMBER,
    \"modelSet\": \"$MODEL_SET\"
  }" | jq .
EOF

cat > "$SCRIPT_DIR/adw_plan_build_test_review_iso.sh" << 'EOF'
#!/bin/bash
# Legacy wrapper for adw_plan_build_test_review_iso.py
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
echo "Workflow: plan-build-test-review"
echo "========================================"
echo ""

# Create and execute plan-build-test-review workflow
curl -X POST "$API_URL/api/adw/workflows/quick/plan-build-test-review" \
  -H "Content-Type: application/json" \
  -d "{
    \"issueNumber\": $ISSUE_NUMBER,
    \"modelSet\": \"$MODEL_SET\"
  }" | jq .
EOF

cat > "$SCRIPT_DIR/adw_plan_build_document_iso.sh" << 'EOF'
#!/bin/bash
# Legacy wrapper for adw_plan_build_document_iso.py
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
echo "Workflow: plan-build (with document)"
echo "========================================"
echo ""

# Note: plan-build-document is not a separate workflow type
# Use plan-build and add document phase manually
curl -X POST "$API_URL/api/adw/workflows/quick/plan-build" \
  -H "Content-Type: application/json" \
  -d "{
    \"issueNumber\": $ISSUE_NUMBER,
    \"modelSet\": \"$MODEL_SET\"
  }" | jq .

echo ""
echo "NOTE: Document phase must be triggered manually after build completes."
EOF

cat > "$SCRIPT_DIR/adw_sdlc_iso.sh" << 'EOF'
#!/bin/bash
# Legacy wrapper for adw_sdlc_iso.py
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
echo "Workflow: SDLC (complete lifecycle)"
echo "========================================"
echo ""

# Create and execute complete SDLC workflow
curl -X POST "$API_URL/api/adw/workflows/quick/sdlc" \
  -H "Content-Type: application/json" \
  -d "{
    \"issueNumber\": $ISSUE_NUMBER,
    \"modelSet\": \"$MODEL_SET\"
  }" | jq .
EOF

cat > "$SCRIPT_DIR/adw_sdlc_zte_iso.sh" << 'EOF'
#!/bin/bash
# Legacy wrapper for adw_sdlc_zte_iso.py
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
echo "Workflow: ZTE (Zero Touch Execution)"
echo "========================================"
echo ""

# Create and execute ZTE workflow (with auto-merge)
curl -X POST "$API_URL/api/adw/workflows/quick/zte" \
  -H "Content-Type: application/json" \
  -d "{
    \"issueNumber\": $ISSUE_NUMBER,
    \"modelSet\": \"$MODEL_SET\"
  }" | jq .
EOF

cat > "$SCRIPT_DIR/adw_patch_iso.sh" << 'EOF'
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
EOF

# ============================================================================
# Make all scripts executable
# ============================================================================

chmod +x "$SCRIPT_DIR"/*.sh

echo "Shell wrappers created successfully!"
echo ""
echo "Created files:"
ls -1 "$SCRIPT_DIR"/adw_*_iso.sh
echo ""
echo "Usage example:"
echo "  ./adw_plan_build_iso.sh 123 base"
echo ""
echo "Set custom API URL with:"
echo "  export ADW_API_URL=http://your-server:8003"
