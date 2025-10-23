# Ozean Licht Ecosystem - Server Architecture

**Last Updated**: 2025-10-23
**Status**: OPERATIONAL ✅
**Purpose**: Complete infrastructure documentation for autonomous agents

## Server Information

### Hardware Specifications
- **Provider**: Hetzner
- **Model**: AX42
- **CPU**: AMD Ryzen 5 3600 (6 cores, 12 threads)
- **RAM**: 64 GB DDR4
- **Storage**: 2 x 512 GB NVMe SSD (Software-RAID 1)
- **Network**: 1 Gbit/s port
- **Location**: Germany (Hetzner DC)

### Network Details
- **Primary IP**: 138.201.139.25
- **IPv6**: 2a01:4f8:172:3614::2

### Operating System
- **Distribution**: Ubuntu 24.04.3 LTS
- **Kernel**: 6.8.0-85-generic x86_64
- **Timezone**: Europe/Vienna

## Access Configuration

### SSH Access - CRITICAL FOR AGENTS

#### Human Access (Passphrase Protected)
```bash
ssh -i ~/.ssh/id_ed25519_ozean root@138.201.139.25
# Passphrase required: TVpfm4518b1DpJYI9C#
```

#### Autonomous Agent Access (No Passphrase) ✅
```bash
ssh -i ~/.ssh/ozean-automation root@138.201.139.25
# No passphrase - agents can connect autonomously
```

### Authorized Keys
1. **Human Admin**: `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJ3pQOC2A4oyjoUTIh4Ue/1wLzQl/XpZL4/dg7n1wm/z ozean-licht-infrastructure`
2. **Automation**: `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAINSXprbUU73fyaYu4wc/5sT4yObbULsL8aP2Eraa4fGK ozean-automation`

### Security Configuration ✅
- ✅ SSH key-only authentication
- ✅ Fail2ban configured and active
- ✅ UFW firewall enabled
- ✅ Automatic security updates
- ✅ Redis memory overcommit fixed (`vm.overcommit_memory=1`)

## Deployed Services - Complete Status

### Platform Management
| Service | Container Name | Status | Access |
|---------|---------------|--------|--------|
| **Coolify** | `coolify` | ✅ Running | http://coolify.ozean-licht.dev:8000 |
| **Coolify Proxy** | `coolify-proxy` | ✅ Running | Traefik on ports 80/443 |
| **Coolify DB** | `coolify-db` | ✅ Running | PostgreSQL 15 (internal) |
| **Coolify Redis** | `coolify-redis` | ✅ Running | Internal cache |

### Databases
| Service | Container ID | Port | Credentials |
|---------|-------------|------|-------------|
| **PostgreSQL (Kids Ascension)** | `iccc0wo0wkgsws4cowk4440c` | 5432 (internal) | User: postgres, Password: 7M6jFrr7IYILOa67MxnfkpUxxNiDVp9IjHN60bkIR0QpbC40DRgzXkVAeVEkdWbJ |
| **PostgreSQL (Ozean Licht)** | `zo8g4ogg8g0gss0oswkcs84w` | 5432 (internal) | User: postgres, Password: [in Coolify] |
| **PostgreSQL (N8N)** | `postgresql-k088ko800k8wg0sc40sw8k4g` | 5432 (internal) | Part of N8N stack |

### Automation & AI Services
| Service | Container Name | Port | Domain | Status |
|---------|---------------|------|--------|--------|
| **MCP Gateway** | `mcp-gateway-o000okc80okco8s0sgcwwcwo` | 8100, 9090 | Internal only | ✅ Running |
| **N8N** | `n8n-k088ko800k8wg0sc40sw8k4g` | 5678 | http://n8n.ozean-licht.dev | ✅ Running |
| **N8N Worker** | `n8n-worker-k088ko800k8wg0sc40sw8k4g` | Internal | N/A | ✅ Running |
| **Qdrant** | `qdrant-posgccgk4gw84ss8oockoksc` | 6333-6334 | http://qdrant.ozean-licht.dev | ✅ Running |
| **Mem0** | `mem0-uo8gc0kc0gswcskk44gc8wks` | 8090 | http://mem0.ozean-licht.dev | ✅ Running |

### Caching
| Service | Container Name | Port | Purpose |
|---------|---------------|------|---------|
| **Redis (Main)** | `lw0ws0kwsw4ko4kg4o8o40os` | 6379 | Primary cache |
| **Redis (MCP Gateway)** | `redis-o000okc80okco8s0sgcwwcwo` | Internal | MCP rate limiting |
| **Redis (N8N)** | `redis-k088ko800k8wg0sc40sw8k4g` | Internal | N8N cache |

## Domain Configuration

### Development Domains (Active)
- **ozean-licht.dev** - Configured in Hostinger
  - coolify.ozean-licht.dev → Coolify Dashboard
  - n8n.ozean-licht.dev → N8N Workflows
  - qdrant.ozean-licht.dev → Qdrant Vector DB
  - mem0.ozean-licht.dev → Mem0 AI Memory

- **kids-ascension.dev** - Configured in Hostinger
  - app.kids-ascension.dev → (Ready for deployment)
  - api.kids-ascension.dev → (Ready for deployment)

## For Autonomous Agents - Essential Commands

### Health Monitoring
```bash
# Check all services
ssh -i ~/.ssh/ozean-automation root@138.201.139.25 << 'EOF'
docker ps --format "table {{.Names}}\t{{.Status}}"
curl -s localhost:8090/health  # Mem0
curl -s localhost:6333/health  # Qdrant
curl -s localhost:5678/healthz # N8N
EOF
```

### Service Management
```bash
# Restart a service
ssh -i ~/.ssh/ozean-automation root@138.201.139.25 "docker restart [container-name]"

# View logs
ssh -i ~/.ssh/ozean-automation root@138.201.139.25 "docker logs [container-name] --tail 50"

# Check resources
ssh -i ~/.ssh/ozean-automation root@138.201.139.25 "free -h && df -h /"
```

### Container Identification
- **PostgreSQL KA**: `iccc0wo0wkgsws4cowk4440c`
- **PostgreSQL OL**: `zo8g4ogg8g0gss0oswkcs84w`
- **Redis**: `lw0ws0kwsw4ko4kg4o8o40os`
- **Mem0**: `mem0-uo8gc0kc0gswcskk44gc8wks`
- **Qdrant**: `qdrant-posgccgk4gw84ss8oockoksc`
- **N8N**: `n8n-k088ko800k8wg0sc40sw8k4g`

## Mem0 + Qdrant Integration

### Add Memory (For Agents)
```bash
curl -X POST http://mem0.ozean-licht.dev/memory/add \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "agent_name",
    "content": "Information to remember",
    "metadata": {"type": "learning", "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'""}
  }'
```

### Search Memory
```bash
curl -X POST http://mem0.ozean-licht.dev/memory/search \
  -H "Content-Type: application/json" \
  -d '{"query": "search term", "user_id": "agent_name"}'
```

## Coolify Management

### Access
- **URL**: http://coolify.ozean-licht.dev:8000
- **User**: Centauro
- **Password**: [Changed - stored securely]

### API Access (Future)
```bash
# Get API token from Coolify UI → Settings → API Tokens
curl -H "Authorization: Bearer [API_TOKEN]" \
     http://coolify.ozean-licht.dev:8000/api/v1/services
```

## Resource Allocation

### Current Usage (Approximate)
- **System + Docker**: 8 GB
- **PostgreSQL (all)**: 8 GB
- **N8N + Worker**: 2 GB
- **Qdrant**: 1 GB
- **Mem0**: 1 GB
- **Redis**: 500 MB
- **Coolify**: 2 GB
- **Total Used**: ~22 GB
- **Available**: ~42 GB for applications

## Backup Strategy

### Database Backups (To Implement)
```bash
# PostgreSQL backups
docker exec iccc0wo0wkgsws4cowk4440c pg_dumpall -U postgres > ka_backup.sql
docker exec zo8g4ogg8g0gss0oswkcs84w pg_dumpall -U postgres > ol_backup.sql

# Qdrant backup
curl -X POST http://localhost:6333/collections/ozean_memories/snapshots

# Redis backup
docker exec lw0ws0kwsw4ko4kg4o8o40os redis-cli BGSAVE
```

## Monitoring Scripts

### Autonomous Monitor Location
`/Users/serg/Dev/ozean-licht-ecosystem/infrastructure/automation/autonomous-monitor.sh`

### Auto-Healing Script (On Server)
`/root/auto-heal.sh` - Automatically restarts unhealthy containers

## Critical Files for Agents

### Local Repository
```
/Users/serg/Dev/ozean-licht-ecosystem/
├── infrastructure/
│   ├── server/
│   │   └── architecture.md (THIS FILE - Single source of truth)
│   └── automation/
│       └── autonomous-monitor.sh (Monitoring script)
├── .ssh/
│   └── ozean-automation (SSH key for agents)
└── CLAUDE.md (Project context)
```

### On Server
```
/root/
├── mem0/
│   ├── Dockerfile
│   └── server.py (Mem0 API server)
└── auto-heal.sh (Auto-healing script)
```

## Next Priorities

1. **Enable SSL** via Let's Encrypt in Coolify
2. **Deploy Kids Ascension** frontend and API
3. **Set up automated backups** to Hetzner Storage Box
4. **Configure monitoring** (Prometheus/Grafana)
5. **Create N8N workflows** for automation

## Emergency Procedures

### If Service Fails
1. Check logs: `docker logs [container] --tail 100`
2. Restart: `docker restart [container]`
3. Check resources: `df -h && free -h`
4. Review Coolify dashboard for errors

### If Server Unreachable
1. Check Hetzner console
2. Verify DNS resolution
3. Check with provider for network issues

## Success Metrics

- ✅ All 7 core services deployed and running
- ✅ Autonomous SSH access configured
- ✅ Memory layer (Mem0 + Qdrant) operational
- ✅ Workflow automation (N8N) ready
- ✅ 2 domains configured with DNS
- ✅ ~42 GB RAM available for applications

---

**Infrastructure Engineer**: Sergej Götz
**Setup Date**: 2025-10-20
**Documentation for**: Autonomous Agents & Future Maintainers
**Status**: PRODUCTION READY 🟢