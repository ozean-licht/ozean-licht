# Ozean Licht Backup System

Automated backup system using BorgBackup to Hetzner Storage Box (BX21).

## Quick Start

```bash
# Run first backup
./backup.sh full

# List backups
./backup.sh list

# Setup automated backups
./setup-cron.sh
```

## Architecture

```
┌─────────────────────────────┐         ┌─────────────────────────────┐
│  Ozean-Hetzner Server       │         │  Hetzner Storage Box BX21   │
│  (AX42)                     │         │  u513736.your-storagebox.de │
│                             │         │                             │
│  PostgreSQL DBs ──────────┐ │  Borg   │  borg-backup/               │
│  Code + Configs ──────────┼─┼────────▶│    ├── data/                │
│  .env files ──────────────┘ │  SSH    │    ├── config               │
│                             │  :23    │    └── archives             │
└─────────────────────────────┘         └─────────────────────────────┘
```

## Files

| File | Purpose |
|------|---------|
| `backup.sh` | Main backup script |
| `restore.sh` | Restore and recovery operations |
| `setup-cron.sh` | Install automated cron jobs |
| `config.env` | Configuration (credentials, paths, retention) |
| `logs/` | Backup logs (retained 30 days) |

## Backup Operations

### Full Backup
Backs up databases + code + configs, prunes old backups:
```bash
./backup.sh full
```

### Database-Only Backup (Hourly)
Quick backup of PostgreSQL databases only:
```bash
./backup.sh db
```

### List Backups
```bash
./backup.sh list
```

### Repository Info
```bash
./backup.sh info
```

### Check Integrity
```bash
./backup.sh check
```

## Restore Operations

### List Available Backups
```bash
./restore.sh list
```

### View Archive Contents
```bash
./restore.sh contents code-20241201-120000
```

### Extract Full Backup
```bash
./restore.sh extract code-20241201-120000 /tmp/restore
```

### Restore Single File
```bash
./restore.sh file code-20241201-120000 opt/ozean-licht-ecosystem/.env /tmp/.env.restored
```

### Restore Database (DESTRUCTIVE!)
```bash
./restore.sh database code-20241201-120000 kids_ascension
```

### Mount Archive (Browse)
```bash
./restore.sh mount code-20241201-120000 /mnt/backup
ls /mnt/backup/
fusermount -u /mnt/backup
```

## Schedule

| Backup Type | Schedule | Cron Expression |
|-------------|----------|-----------------|
| Database | Hourly | `0 * * * *` |
| Full | Daily 3 AM | `0 3 * * *` |

## Retention Policy

| Period | Keep |
|--------|------|
| Hourly | 48 |
| Daily | 14 |
| Weekly | 8 |
| Monthly | 6 |

## What's Backed Up

### Included
- `/opt/ozean-licht-ecosystem/` (all code and configs)
- PostgreSQL databases: `kids_ascension`, `ozean_licht`, `shared_users`
- Environment files (`.env`)

### Excluded
- `node_modules/`
- `.next/`, `dist/`, `build/`
- `.git/`
- `*.log`
- `.pnpm-store/`
- `__pycache__/`

## Security

- **Encryption**: AES-256 (repokey-blake2)
- **Passphrase**: Stored in `config.env`
- **SSH Key**: `/home/adw-user/.ssh/storagebox_backup`

### Key Backup
The Borg encryption key is stored in the repository but should also be backed up separately:
```bash
borg key export $BORG_REPO ~/borg-key-backup.txt
```

Keep this key and the passphrase in a secure location (e.g., password manager).

## Credentials

| Item | Value |
|------|-------|
| Storage Box | u513736.your-storagebox.de:23 |
| SSH Key | `/home/adw-user/.ssh/storagebox_backup` |
| Borg Passphrase | See `config.env` |

## Troubleshooting

### Connection Failed
```bash
# Test SSH connection
ssh -p 23 -i ~/.ssh/storagebox_backup u513736@u513736.your-storagebox.de
```

### Repository Locked
```bash
# Break stale lock (use carefully!)
borg break-lock $BORG_REPO
```

### Check Logs
```bash
tail -f logs/backup-$(date '+%Y-%m-%d').log
```

### Manual Borg Commands
```bash
# Set environment first
export BORG_REPO="u513736@u513736.your-storagebox.de:./borg-backup"
export BORG_PASSPHRASE="ozean-backup-2024-secure"
export BORG_RSH="ssh -p 23 -i /home/adw-user/.ssh/storagebox_backup"

# Then run borg commands
borg list $BORG_REPO
borg info $BORG_REPO
```

## Disaster Recovery

### Full System Recovery

1. **Provision new server**
2. **Install dependencies**: `apt install borgbackup postgresql-client`
3. **Restore SSH key** from secure backup
4. **Extract latest backup**:
   ```bash
   ./restore.sh extract code-YYYYMMDD-HHMMSS /opt/ozean-licht-ecosystem
   ```
5. **Restore databases**:
   ```bash
   ./restore.sh database code-YYYYMMDD-HHMMSS kids_ascension
   ./restore.sh database code-YYYYMMDD-HHMMSS ozean_licht
   ./restore.sh database code-YYYYMMDD-HHMMSS shared_users
   ```
6. **Start services**: `pnpm install && pnpm dev`

---

*Created: 2024-12-01 | Storage: Hetzner BX21 (5TB)*
