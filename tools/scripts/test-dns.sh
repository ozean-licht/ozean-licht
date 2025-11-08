#!/bin/bash

# DNS Testing Script for Ozean Licht Development Domains
# Run this locally to check if DNS is configured correctly

echo "================================================"
echo "    DNS Configuration Test"
echo "    $(date)"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Expected IP
EXPECTED_IP="138.201.139.25"

# Function to test DNS resolution
test_dns() {
    local domain=$1
    local subdomain=$2
    local full_domain="${subdomain}${subdomain:+.}${domain}"

    echo -n "Testing $full_domain ... "

    # Get the IP address
    resolved_ip=$(dig +short $full_domain A | head -1)

    if [ -z "$resolved_ip" ]; then
        echo -e "${RED}✗ No DNS record found${NC}"
        return 1
    elif [ "$resolved_ip" = "$EXPECTED_IP" ]; then
        echo -e "${GREEN}✓ Resolves to $resolved_ip${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠ Resolves to $resolved_ip (expected $EXPECTED_IP)${NC}"
        return 1
    fi
}

# Function to test HTTP/HTTPS connectivity
test_http() {
    local url=$1
    echo -n "  HTTP test for $url ... "

    # Test with curl (timeout 5 seconds)
    if curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 "$url" | grep -q "200\|301\|302\|401"; then
        echo -e "${GREEN}✓ Reachable${NC}"
    else
        echo -e "${YELLOW}⚠ Not reachable yet${NC}"
    fi
}

echo "🌐 Testing ozean-licht.dev"
echo "------------------------"
test_dns "ozean-licht.dev" ""
test_dns "ozean-licht.dev" "coolify"
test_dns "ozean-licht.dev" "n8n"
test_dns "ozean-licht.dev" "literag"
test_dns "ozean-licht.dev" "app"
test_dns "ozean-licht.dev" "www"

echo ""
echo "🌐 Testing kids-ascension.dev"
echo "----------------------------"
test_dns "kids-ascension.dev" ""
test_dns "kids-ascension.dev" "app"
test_dns "kids-ascension.dev" "api"
test_dns "kids-ascension.dev" "admin"
test_dns "kids-ascension.dev" "www"

echo ""
echo "🔌 Testing Connectivity"
echo "----------------------"
test_http "http://$EXPECTED_IP:8000"
test_http "http://coolify.ozean-licht.dev"

echo ""
echo "📊 DNS Propagation Status"
echo "------------------------"

# Check nameservers
echo "Nameservers for ozean-licht.dev:"
dig +short NS ozean-licht.dev | head -3 | sed 's/^/  /'

echo ""
echo "Nameservers for kids-ascension.dev:"
dig +short NS kids-ascension.dev | head -3 | sed 's/^/  /'

echo ""
echo "================================================"
echo "📝 Summary"
echo "------------------------------------------------"

# Count successes
total_tests=0
successful_tests=0

for domain in "ozean-licht.dev" "kids-ascension.dev"; do
    for subdomain in "" "app" "coolify" "n8n" "literag" "api" "admin" "www"; do
        full_domain="${subdomain}${subdomain:+.}${domain}"

        # Skip subdomains that don't apply to all domains
        if [[ "$domain" == "ozean-licht.dev" && ("$subdomain" == "api" || "$subdomain" == "admin") ]]; then
            continue
        fi
        if [[ "$domain" == "kids-ascension.dev" && ("$subdomain" == "coolify" || "$subdomain" == "n8n" || "$subdomain" == "literag") ]]; then
            continue
        fi

        resolved_ip=$(dig +short $full_domain A | head -1)
        if [ ! -z "$resolved_ip" ]; then
            ((total_tests++))
            if [ "$resolved_ip" = "$EXPECTED_IP" ]; then
                ((successful_tests++))
            fi
        else
            ((total_tests++))
        fi
    done
done

if [ $successful_tests -eq $total_tests ] && [ $total_tests -gt 0 ]; then
    echo -e "${GREEN}✅ All DNS records configured correctly!${NC}"
    echo "You can now access Coolify at: http://coolify.ozean-licht.dev"
elif [ $successful_tests -gt 0 ]; then
    echo -e "${YELLOW}⚠ Partial DNS configuration ($successful_tests/$total_tests tests passed)${NC}"
    echo "DNS is propagating. Check again in 30 minutes."
else
    echo -e "${RED}❌ DNS not configured yet${NC}"
    echo "Please configure DNS records in Hostinger."
    echo "Direct access available at: http://$EXPECTED_IP:8000"
fi

echo ""
echo "💡 Tips:"
echo "  - DNS propagation can take 5-48 hours"
echo "  - Use http://$EXPECTED_IP:8000 for immediate access"
echo "  - Run this script again to check progress"
echo "================================================"