#!/bin/bash

echo "========================================="
echo "Ozean Licht Server Status Check"
echo "========================================="
echo ""

# System Info
echo "📊 SYSTEM INFO"
echo "Hostname: $(hostname)"
echo "OS: $(lsb_release -ds)"
echo "Kernel: $(uname -r)"
echo "Uptime: $(uptime -p)"
echo "Timezone: $(timedatectl | grep "Time zone" | awk '{print $3}')"
echo ""

# Network
echo "🌐 NETWORK"
echo "IPv4: $(ip -4 addr show enp6s0 | grep inet | awk '{print $2}')"
echo "IPv6: $(ip -6 addr show enp6s0 | grep inet6 | head -1 | awk '{print $2}')"
echo ""

# Firewall Status
echo "🔒 SECURITY"
echo "UFW Status: $(ufw status | head -1)"
echo "Open Ports:"
ufw status | grep -E "^[0-9]" | awk '{print "  - "$1}'
echo "Fail2ban: $(systemctl is-active fail2ban)"
echo ""

# Docker Status
echo "🐋 DOCKER"
if command -v docker &> /dev/null; then
    echo "Docker Version: $(docker --version | cut -d' ' -f3 | tr -d ',')"
    echo "Docker Compose: $(docker compose version | cut -d' ' -f4)"
    echo "Running Containers: $(docker ps -q | wc -l)"
    echo ""

    # Check for Coolify
    if docker ps | grep -q coolify; then
        echo "✅ Coolify is running!"
        COOLIFY_PORT=$(docker port coolify 2>/dev/null | grep 8000 | cut -d: -f2)
        echo "   Access URL: http://138.201.139.25:${COOLIFY_PORT:-8000}"

        # Try to get initial password from logs
        echo ""
        echo "📝 Coolify Admin Password:"
        docker logs coolify 2>&1 | grep -A2 "password" | tail -3
    else
        echo "⚠️  Coolify is not running yet"
    fi
else
    echo "❌ Docker is not installed"
fi
echo ""

# Resource Usage
echo "💾 RESOURCES"
echo "CPU Load: $(uptime | awk -F'load average:' '{print $2}')"
echo "Memory: $(free -h | grep Mem | awk '{print "Used: "$3" / Total: "$2}')"
echo "Disk: $(df -h / | tail -1 | awk '{print "Used: "$3" / Total: "$2" ("$5" used)"}')"
echo ""

# Service Status
echo "⚙️  SERVICES"
services=("docker" "fail2ban" "ufw" "unattended-upgrades" "ssh")
for service in "${services[@]}"; do
    status=$(systemctl is-active $service)
    if [ "$status" = "active" ]; then
        echo "✅ $service: active"
    else
        echo "❌ $service: $status"
    fi
done
echo ""

# Check if setup script completed
if [ -f /var/log/ozean-setup.log ]; then
    echo "📋 SETUP LOG"
    echo "Last 5 lines from setup:"
    tail -5 /var/log/ozean-setup.log
else
    echo "ℹ️  Setup log not found at /var/log/ozean-setup.log"
fi
echo ""

echo "========================================="
echo "Next Steps:"
echo "1. Access Coolify at http://138.201.139.25:8000"
echo "2. Complete initial setup with admin password"
echo "3. Configure domain (ozean-licht.at)"
echo "4. Deploy N8N and LiteRAG through Coolify"
echo "========================================="