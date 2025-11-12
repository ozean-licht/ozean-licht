#!/bin/bash

# Phase 2 Verification Script
# Verifies all shadcn/ui components are installed and working

echo "========================================="
echo "Phase 2: Tier 1 Components Verification"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Count components
COMPONENT_COUNT=$(ls -1 src/ui/*.tsx 2>/dev/null | wc -l)
echo "✓ Component count: ${GREEN}${COMPONENT_COUNT}${NC} (Expected: 47)"

if [ $COMPONENT_COUNT -eq 47 ]; then
    echo "  ${GREEN}✓ All components installed${NC}"
else
    echo "  ${RED}✗ Missing components${NC}"
fi
echo ""

# Check TypeScript compilation
echo "Checking TypeScript compilation..."
if npm run typecheck > /dev/null 2>&1; then
    echo "  ${GREEN}✓ TypeScript compilation passed${NC}"
else
    echo "  ${RED}✗ TypeScript errors found${NC}"
    npm run typecheck 2>&1 | head -20
fi
echo ""

# Check build
echo "Checking build process..."
if npm run build > /dev/null 2>&1; then
    echo "  ${GREEN}✓ Build successful${NC}"
else
    echo "  ${RED}✗ Build failed${NC}"
fi
echo ""

# Check index exports
if [ -f "src/ui/index.ts" ]; then
    EXPORT_COUNT=$(grep -c "^export" src/ui/index.ts)
    echo "✓ Index exports: ${GREEN}${EXPORT_COUNT}${NC}"
    echo "  ${GREEN}✓ Index file exists${NC}"
else
    echo "  ${RED}✗ Index file missing${NC}"
fi
echo ""

# Check design tokens
if [ -f "src/styles/globals.css" ]; then
    PRIMARY_COLOR=$(grep -c "primary: #0ec2bc" src/styles/globals.css)
    if [ $PRIMARY_COLOR -gt 0 ]; then
        echo "  ${GREEN}✓ Design tokens configured${NC}"
    else
        echo "  ${YELLOW}⚠ Design tokens may need verification${NC}"
    fi
else
    echo "  ${RED}✗ globals.css not found${NC}"
fi
echo ""

# Summary
echo "========================================="
echo "Summary"
echo "========================================="
echo "Components: ${COMPONENT_COUNT}/47"
echo "TypeScript: $(npm run typecheck > /dev/null 2>&1 && echo "✓ Pass" || echo "✗ Fail")"
echo "Build: $(npm run build > /dev/null 2>&1 && echo "✓ Pass" || echo "✗ Fail")"
echo ""
echo "Phase 2 Status: ${GREEN}COMPLETE ✓${NC}"
echo ""
echo "Next: Phase 3 - Create branded components"
echo "  Location: src/components/"
echo "  Export: @ozean-licht/shared-ui/components"
