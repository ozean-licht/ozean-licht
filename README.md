# <
 Ozean Licht Ecosystem

> **Monorepo powering two Austrian associations with shared technical infrastructure and autonomous AI development**


## <� Quick Navigation

| I am... | I want to... | Start here |
|---------|-------------|------------|
| **> AI Agent** | Understand the codebase | [CLAUDE.md](./CLAUDE.md) |
| **=� Developer** | Get started quickly | [Quick Start](#-quick-start) |
| **=' DevOps** | Deploy infrastructure | [Infrastructure](#-infrastructure) |
| **=� Contributor** | Understand architecture | [docs/architecture.md](./docs/architecture.md) |
| **<� Student/Parent** | Learn about Kids Ascension | [apps/kids-ascension](./apps/kids-ascension/README.md) |
| **<
 Member** | Learn about Ozean Licht | [Apps](#-apps) |

## < Overview

The **Ozean Licht Ecosystem** is a unified technical platform serving two legally separate Austrian associations (Vereine):

### <� **Kids Ascension** (`kids-ascension.dev`)
- **Mission:** Liberation through learning - 100% free educational platform for children (ages 6-14)
- **Features:** Video courses, self-paced learning, teacher-quality content
- **Status:** Active development with monorepo migration phase

### <
 **Ozean Licht** (`ozean-licht.dev`)
- **Mission:** Content platform for courses and community
- **Features:** Course management, member portal, content delivery
- **Status:** Foundation phase

Both platforms share:
-  **Unified authentication** (SSO across platforms)
-  **Multi-tenant database architecture** (legal separation with shared infrastructure)
-  **Autonomous development workflows** (AI-driven development)
-  **Three-tier storage system** (MinIO � R2 � Stream)
-  **MCP Gateway** (unified tool access)

## Design System & Branding

**Ozean Licht Design System** - Complete design language with turquoise branding, glass morphism, and cosmic aesthetics.

**Key Resources:**
- [Design System](/design-system.md) - Complete design tokens, patterns, and guidelines
- [Branding Guidelines](/BRANDING.md) - Brand identity, logos, and usage rules
- [Shared Components](/shared/ui-components/README.md) - React component library (`@ozean-licht/shared-ui`)
- [Component Guidelines](/shared/ui-components/COMPONENT-GUIDELINES.md) - Usage patterns and best practices

**Quick Start:**
```typescript
// Import shared components
import { Button, Card, Badge } from '@ozean-licht/shared-ui'

// Use Ozean Licht styling
<Card variant="default" hover padding="md">
  <CardTitle>Dashboard Card</CardTitle>
  <Button variant="primary">Action</Button>
</Card>
```

**Signature Elements:**
- Primary Color: Turquoise (#0ec2bc)
- Background: Cosmic Dark (#0A0F1A)
- Glass morphism effects
- Cinzel Decorative + Montserrat fonts
- Glow, float, and shine animations

**Note:** Kids Ascension has separate branding. See `/BRANDING.md` for details.

---

## =� Quick Start

### Prerequisites

```bash
# Required tools
node -v       # Node.js 18+
pnpm -v       # PNPM package manager
uv --version  # Python package manager for ADW
gh --version  # GitHub CLI
claude --version  # Claude Code CLI

# Install missing tools
npm install -g pnpm              # Package manager
curl -LsSf https://astral.sh/uv/install.sh | sh  # UV for Python
brew install gh                  # GitHub CLI (macOS)
```

### Installation

```bash
# Clone repository
git clone https://github.com/ozean-licht/ecosystem.git
cd ozean-licht-ecosystem

# Install all dependencies
pnpm install

# Setup environment
cp example.env .env
# Edit .env with your credentials
```

### Development

```bash
# Start specific services
pnpm --filter @ka/web dev       # Kids Ascension frontend (port 3000)
pnpm --filter @ol/web dev       # Ozean Licht frontend (port 3001)
pnpm --filter admin dev          # Admin dashboard (port 9200)

# Start MCP Gateway
cd tools/mcp-gateway
npm run dev                      # Port 8100

# Run tests
pnpm test                        # All tests
pnpm --filter @ka/web test:e2e   # E2E tests
```

#### Workspace Folders

The workspace defines 13 major project areas:
- 🏠 Root (Ecosystem) - Core configuration and root commands
- 🎓 Kids Ascension - Educational platform
- 🌊 Ozean Licht - Community platform
- ⚙️ Admin Dashboard - Unified admin interface
- 🤖 Orchestrator 3 Stream - Agent orchestration system
- 🔧 MCP Gateway - Unified tool access
- 🚀 Coolify Config - Deployment configuration
- 🐳 Docker Services - Container orchestration
- 🤖 ADW Workflows - Autonomous development
- 📚 Documentation - Architecture and guides
- 🧩 Shared Libraries - Reusable code
- 🎥 Video Translator - Video translation tool
- 📅 Event Calendar - Event management

**See `.claude/README.md` for complete command catalog and troubleshooting.**

## Autonomous Development Workflows (ADW)

Our groundbreaking AI-driven development system enables **Zero Touch Engineering** - humans define "what" in GitHub issues, AI agents determine "how".

### Key Features

- ** 15 Concurrent Workflows:** Isolated git worktrees with dedicated ports
- ** Institutional Memory:** Mem0 integration for continuous learning
- ** Complete SDLC:** Plan, Build, Test, Review, Document, Ship
- ** Auto-deployment:** Optional Zero Touch Execution (auto-merge to main)

**Full Documentation:** [adws/README.md](./adws/README.md)

```

## Infrastructure

### Current Setup
- **=Server:** Hetzner AX42 (50/mo) - AMD Ryzen 5, 64GB RAM, 2x512GB NVMe
- **=3 Orchestration:** Coolify (self-hosted PaaS)
- **= Databases:** PostgreSQL (multi-tenant)
- **= Storage:** MinIO (hot)  Cloudflare R2 (cold)  Stream (CDN)
- **= Gateway:** MCP Gateway v1.0.1

### Service URLs
```bash
# Production Services
http://coolify.ozean-licht.dev:8000     # Coolify dashboard
http://n8n.ozean-licht.dev              # N8N automation
http://mem0.ozean-licht.dev             # Memory storage
https://grafana.ozean-licht.dev         # Monitoring

# Local Development
http://localhost:8100                    # MCP Gateway
http://localhost:9200                    # Admin dashboard
http://localhost:3000                    # Kids Ascension
http://localhost:3001                    # Ozean Licht
```

**Full Documentation:** [tools/README.md](./tools/README.md)



## =� Apps

### Admin Dashboard
Unified admin interface for both platforms with NextAuth authentication.

**Features:**
- Role-based access control (RBAC)
- Audit logging
- Session management
- MCP client library

**Documentation:** [apps/admin/README.md](./apps/admin/README.md)

### Kids Ascension
Educational platform liberating children through self-paced learning.

**Tech Stack:**
- React + TypeScript
- Video streaming via Cloudflare
- Parent/child accounts
- Progress tracking

**Documentation:** [apps/kids-ascension/README.md](./apps/kids-ascension/README.md)

### Ozean Licht
Content platform for courses and community (in development).

**Planned Features:**
- Course management
- Member portal
- Event calendar
- Community forums

## Security & Authentication

### Multi-Tenant Architecture

```sql
-- Separate databases per entity
shared_users_db    -- Unified authentication
kids_ascension_db  -- KA-specific data
ozean_licht_db     -- OL-specific data

-- JWT contains entity access
{
  "userId": "uuid",
  "entities": [
    { "entityId": "kids_ascension", "role": "admin" },
    { "entityId": "ozean_licht", "role": "user" }
  ]
}
```

### Authentication Flow
1. User logs in Verify in `shared_users_db`
2. Fetch entity permissions
3. Generate JWT with entity context
4. Route to appropriate platform



---

**Last Updated:** 2025-11-11
**Primary Maintainer:** Sergej Goetz (via autonomous agents)
**Status:** = Foundation Phase - Active Development

---

<div align="center">

**<
 "Empowering communities through technology and education" <**

</div>