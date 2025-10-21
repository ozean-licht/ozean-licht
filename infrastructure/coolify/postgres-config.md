# PostgreSQL Configuration for Coolify

## Kids Ascension Database

### Basic Settings
- **Service Name**: kids-ascension-db
- **Image**: postgres:17-alpine
- **Username**: postgres
- **Password**: [secure password stored separately]

### Environment Variables (Add these in Coolify)
```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=7M6jFrr7IYILOa67MxnfkpUxxNiDVp9IjHN60bkIR0QpbC40DRgzXkVAeVEkdWbJ
POSTGRES_DB=kids_ascension
PGDATA=/var/lib/postgresql/data/pgdata

# Performance tuning
POSTGRES_INITDB_ARGS=--encoding=UTF8 --locale=en_US.UTF-8
```

### Initial Database Arguments
```
-c max_connections=200
-c shared_buffers=256MB
-c effective_cache_size=1GB
-c maintenance_work_mem=64MB
-c checkpoint_completion_target=0.9
-c wal_buffers=16MB
-c default_statistics_target=100
-c random_page_cost=1.1
-c log_statement=all
-c log_duration=on
```

### Volume Configuration
- **Mount Path**: `/var/lib/postgresql/data`
- **Volume Name**: `kids-ascension-db-data`
- **Persistent**: Yes

### Network Settings
- **Port Mapping**:
  - Internal: 5432
  - External: (leave empty for security, or 5433 if needed)
- **Network**: Default Coolify network
- **Hostname**: kids-ascension-db

### Health Check
- **Command**: `pg_isready -U postgres`
- **Interval**: 30s
- **Timeout**: 10s
- **Retries**: 5

### Resource Limits
- **Memory**: 4GB minimum, 8GB recommended
- **CPU**: 2 cores

---

## Ozean Licht Database

### Basic Settings
- **Service Name**: ozean-licht-db
- **Image**: postgres:17-alpine
- **Username**: postgres
- **Password**: [generate different secure password]

### Environment Variables
```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=[generate secure password]
POSTGRES_DB=ozean_licht
PGDATA=/var/lib/postgresql/data/pgdata

# Same performance settings as above
```

### Network Settings
- **Port Mapping**:
  - Internal: 5432
  - External: (leave empty, or 5434 if needed)

---

## Post-Deployment Setup

### 1. Create Additional Databases

After deployment, connect to each PostgreSQL instance and create specific databases:

#### For Kids Ascension DB Instance:
```sql
-- Connect to the instance
docker exec -it kids-ascension-db psql -U postgres

-- Create databases
CREATE DATABASE kids_ascension_app;
CREATE DATABASE kids_ascension_analytics;
CREATE DATABASE n8n;

-- Create users with limited privileges
CREATE USER ka_app WITH PASSWORD 'separate_app_password';
GRANT ALL PRIVILEGES ON DATABASE kids_ascension_app TO ka_app;

CREATE USER n8n_user WITH PASSWORD 'separate_n8n_password';
GRANT ALL PRIVILEGES ON DATABASE n8n TO n8n_user;

-- Enable extensions
\c kids_ascension_app
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

#### For Ozean Licht DB Instance:
```sql
-- Connect to the instance
docker exec -it ozean-licht-db psql -U postgres

-- Create databases
CREATE DATABASE ozean_licht_app;
CREATE DATABASE literag;

-- Create users
CREATE USER oz_app WITH PASSWORD 'separate_app_password';
GRANT ALL PRIVILEGES ON DATABASE ozean_licht_app TO oz_app;

CREATE USER literag_user WITH PASSWORD 'separate_literag_password';
GRANT ALL PRIVILEGES ON DATABASE literag TO literag_user;

-- Enable extensions for LiteRAG
\c literag
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### 2. Backup Configuration

Add this to your backup script:
```bash
#!/bin/bash
# Backup script for PostgreSQL databases

# Kids Ascension
docker exec kids-ascension-db pg_dumpall -U postgres > /backups/ka_backup_$(date +%Y%m%d_%H%M%S).sql

# Ozean Licht
docker exec ozean-licht-db pg_dumpall -U postgres > /backups/oz_backup_$(date +%Y%m%d_%H%M%S).sql

# Compress and encrypt
tar -czf /backups/db_backup_$(date +%Y%m%d).tar.gz /backups/*.sql
rm /backups/*.sql
```

### 3. Connection Strings for Applications

#### Kids Ascension Apps:
```env
# Main app
DATABASE_URL=postgresql://ka_app:password@kids-ascension-db:5432/kids_ascension_app

# N8N
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=kids-ascension-db
DB_POSTGRESDB_PORT=5432
DB_POSTGRESDB_DATABASE=n8n
DB_POSTGRESDB_USER=n8n_user
DB_POSTGRESDB_PASSWORD=separate_n8n_password
```

#### Ozean Licht Apps:
```env
# Main app
DATABASE_URL=postgresql://oz_app:password@ozean-licht-db:5432/ozean_licht_app

# LiteRAG
DATABASE_URL=postgresql://literag_user:password@ozean-licht-db:5432/literag
```

## Monitoring Queries

### Check database sizes:
```sql
SELECT
    datname AS database,
    pg_size_pretty(pg_database_size(datname)) AS size
FROM pg_database
ORDER BY pg_database_size(datname) DESC;
```

### Check active connections:
```sql
SELECT
    datname,
    count(*) as connections
FROM pg_stat_activity
GROUP BY datname
ORDER BY connections DESC;
```

### Check slow queries:
```sql
SELECT
    query,
    mean_exec_time,
    calls,
    total_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

## Security Best Practices

1. **Never expose PostgreSQL ports publicly** unless absolutely necessary
2. **Use separate users** for each application with minimal required privileges
3. **Enable SSL** if exposing externally
4. **Regular backups** - automate daily backups
5. **Monitor logs** for suspicious activity
6. **Update regularly** - postgres:17-alpine receives security updates

## Alternative: Single Database Instance

Instead of two separate instances, you could use ONE PostgreSQL instance with multiple databases:

**Advantages:**
- Less resource usage
- Easier management
- Single backup point

**Configuration:**
- Service Name: `main-db`
- Create all databases in one instance
- Still use separate users per application

To do this, just create one PostgreSQL service and create multiple databases within it.

---

**Created**: 2025-10-20
**PostgreSQL Version**: 17-alpine
**Security**: Production-ready configuration