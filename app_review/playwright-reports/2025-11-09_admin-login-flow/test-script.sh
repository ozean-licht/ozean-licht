#!/bin/bash
# Admin Dashboard Login Flow Test Script
# This script will be used to validate the login flow manually

echo "=== Admin Dashboard Login Flow Test ==="
echo "Date: $(date)"
echo ""

# Check if admin app is running on port 9200
echo "Checking if admin app is running on port 9200..."
if curl -s http://localhost:9200 > /dev/null 2>&1; then
    echo "✓ Admin app is running"
else
    echo "✗ Admin app is NOT running"
    echo "Please start with: pnpm --filter admin dev"
    exit 1
fi

echo ""
echo "Test Credentials:"
echo "  Email: super@ozean-licht.dev"
echo "  Password: SuperAdmin123!"
echo ""
echo "Manual Test Steps:"
echo "1. Open browser to http://localhost:9200/login"
echo "2. Fill in the credentials above"
echo "3. Click submit"
echo "4. Observe redirect behavior"
echo ""
echo "Expected: Should redirect to /dashboard (may show 404 if not implemented)"
