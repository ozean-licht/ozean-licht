# Deployment Guide - Hetzner Server

This guide explains how to deploy the ozean-licht-ecosystem to your Hetzner server.

## Prerequisites

- SSH access to Hetzner server (138.201.139.25)
- SSH key configured: `~/.ssh/ozean-automation`
- Required API keys and credentials

## Quick Deployment

### 1. Clone Repository on Server

```bash
# SSH into your Hetzner server
ssh -i ~/.ssh/ozean-automation root@138.201.139.25

# Clone the repository
git clone https://github.com/ozean-licht/ozean-licht.git ozean-licht-ecosystem
cd ozean-licht-ecosystem
```

### 2. Set Up Environment Variables

The repository **does not** include the `.env` file (for security). You need to create it manually:

```bash
# Copy the example template
cp example.env .env

# Edit with your actual credentials
nano .env
```

**Required values to update in `.env`:**

```bash
# API Keys (Required)
ANTHROPIC_API_KEY=sk-ant-XXXXXXXX          # Get from: https://console.anthropic.com/account/keys
GITHUB_PAT=ghp_XXXXXXXX                    # Get from: https://github.com/settings/tokens
OPENAI_API_KEY=sk-XXXXXXXX                 # Get from: https://platform.openai.com/api-keys (optional)
E2B_API_KEY=XXXXXXXX                       # Get from: https://e2b.dev/dashboard (optional)

# Cloudflare (If using)
CLOUDFLARE_ACCOUNT_ID=XXXXXXXX
CLOUDFLARE_API_TOKEN=XXXXXXXX
CLOUDFLARE_ZONE_ID_OL_DEV=XXXXXXXX
CLOUDFLARE_ZONE_ID_KA_DEV=XXXXXXXX

# Server-specific paths
CLAUDE_CODE_PATH=/usr/local/bin/claude     # Verify with: which claude
```

### 3. Install Dependencies

```bash
# Python dependencies (for ADWs)
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt  # If you have one

# Node.js dependencies (for MCP Gateway)
npm install
```

### 4. Verify Setup

```bash
# Run the setup status check
./infrastructure/scripts/check-setup-status.sh

# Test DNS configuration
./infrastructure/scripts/test-dns.sh
```

## Alternative: Secure Environment Transfer

If you want to securely transfer your `.env` from your local machine to the server:

### Option 1: SCP Transfer (Recommended)

```bash
# From your local machine
scp -i ~/.ssh/ozean-automation .env root@138.201.139.25:/root/ozean-licht-ecosystem/.env
```

### Option 2: Encrypted Transfer

```bash
# On local machine: Encrypt the .env file
gpg --symmetric --cipher-algo AES256 .env

# Transfer encrypted file
scp -i ~/.ssh/ozean-automation .env.gpg root@138.201.139.25:/root/

# On server: Decrypt
gpg .env.gpg
mv .env ozean-licht-ecosystem/.env
rm .env.gpg
```

### Option 3: Use Environment Management Tool

Consider using a secrets management tool like:
- **Hashicorp Vault**
- **AWS Secrets Manager**
- **Doppler**
- **1Password CLI**

## Security Best Practices

### 1. File Permissions

```bash
# Restrict .env file access
chmod 600 .env

# Verify permissions
ls -la .env
# Should show: -rw------- (only owner can read/write)
```

### 2. Never Commit .env

The `.gitignore` already includes:
```
.env
.env.*
!.env.sample
```

This prevents accidental commits of sensitive data.

### 3. Rotate API Keys

If you suspect your `.env` was exposed:

1. **Anthropic**: https://console.anthropic.com/account/keys
2. **GitHub**: https://github.com/settings/tokens
3. **OpenAI**: https://platform.openai.com/api-keys
4. **Cloudflare**: https://dash.cloudflare.com/profile/api-tokens

### 4. Use Different Keys Per Environment

Consider having separate API keys for:
- Development (local machine)
- Staging (test server)
- Production (Hetzner server)

## Deployment Checklist

- [ ] Repository cloned on Hetzner server
- [ ] `.env` file created from `example.env`
- [ ] All required API keys added to `.env`
- [ ] File permissions set correctly (`chmod 600 .env`)
- [ ] Dependencies installed (Python + Node.js)
- [ ] Setup status verified
- [ ] DNS configuration tested
- [ ] Services started and accessible

## Troubleshooting

### Missing .env File Error

```bash
Error: .env file not found
```

**Solution:** Create `.env` from template:
```bash
cp example.env .env
nano .env  # Add your credentials
```

### Permission Denied Errors

```bash
Error: EACCES: permission denied
```

**Solution:** Fix file permissions:
```bash
chmod 600 .env
chown $USER:$USER .env
```

### API Key Invalid

```bash
Error: Invalid API key
```

**Solution:** Verify your API keys are:
- Copied correctly (no extra spaces)
- Not expired
- Have correct permissions/scopes

## Updating the Deployment

To update your deployment when the repository changes:

```bash
# SSH to server
ssh -i ~/.ssh/ozean-automation root@138.201.139.25

# Navigate to repo
cd ozean-licht-ecosystem

# Backup current .env
cp .env .env.backup

# Pull latest changes
git pull origin main

# Restore .env (git pull won't overwrite it, but just in case)
# Your .env is safe because it's in .gitignore

# Check if example.env has new variables
diff .env.backup example.env

# Update dependencies if needed
npm install
pip install -r requirements.txt

# Restart services as needed
```

## Support

For issues or questions:
- Check logs in `logs/` directory
- Review service status: `./infrastructure/scripts/check-setup-status.sh`
- GitHub Issues: https://github.com/ozean-licht/ozean-licht/issues
