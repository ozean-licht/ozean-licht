# Orchestrator Redeploy Instructions - User Permissions Fix

**Issue:** Orchestrator running as root with read-only access, cannot see ADW user
**Fix:** Updated Dockerfile and docker-compose.yml to run as `adw-user` (UID 1000) with write permissions

---

## Quick Redeploy Steps

### 1. Stop Current Container

```bash
cd /opt/ozean-licht-ecosystem/apps/orchestrator_3_stream
docker-compose down
```

### 2. Rebuild Image (No Cache)

```bash
docker-compose build --no-cache
```

**Why `--no-cache`?**
- Ensures all Dockerfile changes are applied
- Creates adw-user properly with UID/GID 1000
- Installs UV in correct location
- Configures git for adw-user

### 3. Start Updated Container

```bash
docker-compose up -d
```

### 4. Verify Fix

```bash
# Check container is running
docker ps | grep orchestrator_3_stream

# Check container logs
docker logs orchestrator_3_stream --tail 50

# Enter container and verify user
docker exec -it orchestrator_3_stream bash

# Inside container:
whoami                    # Should show: adw-user (not root!)
id                        # Should show: uid=1000(adw-user) gid=1000(adw-user)
which uv                  # Should show: /home/adw-user/.local/bin/uv
git config --global user.name  # Should show: Orchestrator Agent

# Test write permissions
cd /opt/ozean-licht-ecosystem
touch test_write.txt      # Should succeed without errors
rm test_write.txt

# Exit container
exit
```

---

## What Was Changed

### Dockerfile
✅ Created `adw-user` with UID/GID 1000 (matches host user)
✅ Installed UV to `/home/adw-user/.local/bin` (not `/root/.local/bin`)
✅ Configured git user.name and user.email for commits
✅ Added `safe.directory` to prevent git ownership errors
✅ Set all file ownership to `adw-user:adw-user`
✅ Container now runs as `adw-user` instead of `root`

### docker-compose.yml
✅ Removed `:ro` (read-only) flag from repository volume
✅ Added `user: "1000:1000"` to run container as adw-user

---

## Expected Results

After redeployment:

✅ **Orchestrator signs in as `adw-user`** (not root)
✅ **Full read/write access** to `/opt/ozean-licht-ecosystem`
✅ **Can create git worktrees** for ADW workflows
✅ **Can create branches and commits**
✅ **Can execute ADW tools** (list_adw_worktrees, trigger_adw_workflow, etc.)
✅ **UV commands work** (`uv run adws/adw_*.py`)

---

## Testing ADW Integration

Once redeployed, test ADW functionality:

### Via Container Shell

```bash
docker exec -it orchestrator_3_stream bash

# Test ADW commands
cd /opt/ozean-licht-ecosystem
git worktree list
uv run adws/adw_plan_iso.py --help

# Test git operations
git status
git branch

exit
```

### Via Orchestrator Chat

Open orchestrator UI (https://dev.ozean-licht.dev or your deployed URL):

```
You: List all active ADW workflows
Expected: ✅ Tool "list_adw_worktrees" executes successfully

You: Show repository status
Expected: ✅ Tool "get_repo_status" executes successfully

You: What ADW tools are available?
Expected: ✅ Lists all ADW tools from tools catalog
```

---

## Troubleshooting

### Container won't start

```bash
# Check logs
docker logs orchestrator_3_stream

# Common issues:
# - Database not ready: Wait 30s and check again
# - Port in use: docker-compose down && docker-compose up -d
```

### Still showing as root

```bash
# Verify you rebuilt with --no-cache
docker-compose build --no-cache

# Check docker-compose.yml has user: "1000:1000"
grep -A 2 "user:" docker-compose.yml
```

### Permission denied errors

```bash
# Check volume mount removed :ro flag
docker inspect orchestrator_3_stream | grep -A 5 "Mounts"

# Should show:
# "Source": "/opt/ozean-licht-ecosystem",
# "Destination": "/opt/ozean-licht-ecosystem",
# "Mode": "",  # <-- NOT "ro"
```

### Git errors

```bash
# Enter container
docker exec -it orchestrator_3_stream bash

# Check git config
git config --global --list

# Should include:
# user.name=Orchestrator Agent
# user.email=orchestrator@ozean-licht.dev
# safe.directory=/opt/ozean-licht-ecosystem
```

---

## Rollback Plan

If issues occur, temporarily rollback:

```bash
# Revert docker-compose.yml changes
git diff docker-compose.yml  # Review changes
git checkout docker-compose.yml  # Revert to previous version

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

**Note:** Rollback will restore read-only access but orchestrator chat will still work (ADW tools will be disabled).

---

## Next Steps After Successful Deployment

1. ✅ Verify orchestrator running as `adw-user`
2. ✅ Test ADW tools via chat interface
3. ✅ Try creating a test worktree
4. ✅ Monitor logs for 24 hours
5. ✅ Update team documentation
6. ✅ Consider adding monitoring alerts

---

## Documentation

**Full Fix Details:** `app_docs/DOCKER_USER_PERMISSIONS_FIX.md`
**Deployment Guide:** `DEPLOYMENT.md`
**ADW Integration:** `/app_docs/ADW_ORCHESTRATOR_INTEGRATION.md`

---

**Status:** Ready to redeploy
**Estimated downtime:** 2-5 minutes
**Risk level:** Low (can rollback easily)
