# Ozean Licht Infrastructure

## 📍 Single Source of Truth

**`server/architecture.md`** - Complete infrastructure documentation

## 🚀 Quick Access for Agents

### Autonomous SSH Access
```bash
ssh -i ~/.ssh/ozean-automation root@138.201.139.25
```

### Service URLs
- Coolify: http://coolify.ozean-licht.dev:8000
- N8N: http://n8n.ozean-licht.dev
- Qdrant: http://qdrant.ozean-licht.dev/dashboard
- Mem0: http://mem0.ozean-licht.dev
- Grafana: https://grafana.ozean-licht.dev
- Prometheus: http://localhost:9091 (internal only)

## 📁 Directory Structure

```
infrastructure/
├── server/
│   └── architecture.md         # MAIN DOCUMENTATION - All server details
├── automation/
│   └── autonomous-monitor.sh    # Monitoring script for agents
├── coolify/                     # Service configurations (reference)
│   ├── n8n-config.md
│   ├── mem0-config.md
│   └── ...
├── scripts/                     # Utility scripts
└── dns/                        # DNS configurations
```

## 🤖 For Autonomous Agents

1. **Read `server/architecture.md` first** - Contains all infrastructure details
2. **Use automation SSH key** - No passphrase required
3. **Container names are specific** - Check architecture.md for exact names
4. **Mem0 is your memory** - Store learnings there

## ✅ Status: PRODUCTION READY

All core services deployed and operational as of 2025-10-20.