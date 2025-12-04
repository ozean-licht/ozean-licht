#!/bin/bash
# Chatwoot Quick Setup Script
# This script helps initialize Chatwoot with secure secrets

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env"
ENV_EXAMPLE="$SCRIPT_DIR/.env.example"

echo "=========================================="
echo "Chatwoot Setup Script"
echo "=========================================="
echo ""

# Check if .env already exists
if [ -f "$ENV_FILE" ]; then
    echo "⚠️  WARNING: .env file already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi
    echo "Backing up existing .env to .env.backup..."
    cp "$ENV_FILE" "$ENV_FILE.backup"
fi

# Copy example file
echo "Creating .env from .env.example..."
cp "$ENV_EXAMPLE" "$ENV_FILE"

# Generate secrets
echo ""
echo "Generating secure secrets..."
echo ""

SECRET_KEY_BASE=$(openssl rand -hex 64)
WEBHOOK_SECRET=$(openssl rand -hex 32)
POSTGRES_PASSWORD=$(openssl rand -base64 32)
REDIS_PASSWORD=$(openssl rand -base64 32)

echo "✓ SECRET_KEY_BASE generated"
echo "✓ CHATWOOT_WEBHOOK_SECRET generated"
echo "✓ CHATWOOT_POSTGRES_PASSWORD generated"
echo "✓ CHATWOOT_REDIS_PASSWORD generated"
echo ""

# Replace values in .env (with backup for safety)
sed -i.bak "s|SECRET_KEY_BASE=.*|SECRET_KEY_BASE=$SECRET_KEY_BASE|" "$ENV_FILE"
sed -i.bak "s|CHATWOOT_WEBHOOK_SECRET=.*|CHATWOOT_WEBHOOK_SECRET=$WEBHOOK_SECRET|" "$ENV_FILE"
sed -i.bak "s|CHATWOOT_POSTGRES_PASSWORD=.*|CHATWOOT_POSTGRES_PASSWORD=$POSTGRES_PASSWORD|" "$ENV_FILE"
sed -i.bak "s|CHATWOOT_REDIS_PASSWORD=.*|CHATWOOT_REDIS_PASSWORD=$REDIS_PASSWORD|" "$ENV_FILE"

echo "Secrets have been generated and saved to .env"
echo ""

# Prompt for required values
echo "=========================================="
echo "Configuration"
echo "=========================================="
echo ""

read -p "Enter Chatwoot Base URL [https://chatwoot.ozean-licht.dev]: " BASE_URL
BASE_URL=${BASE_URL:-https://chatwoot.ozean-licht.dev}
sed -i.bak "s|CHATWOOT_BASE_URL=.*|CHATWOOT_BASE_URL=$BASE_URL|" "$ENV_FILE"
echo "✓ Base URL set to: $BASE_URL"
echo ""

echo "SMTP Configuration:"
read -p "Enter SMTP address: " SMTP_ADDRESS
read -p "Enter SMTP port [587]: " SMTP_PORT
SMTP_PORT=${SMTP_PORT:-587}
read -p "Enter SMTP username: " SMTP_USERNAME
read -sp "Enter SMTP password: " SMTP_PASSWORD
echo ""
read -p "Enter sender email [support@ozean-licht.at]: " SENDER_EMAIL
SENDER_EMAIL=${SENDER_EMAIL:-support@ozean-licht.at}

sed -i.bak "s|CHATWOOT_SMTP_ADDRESS=.*|CHATWOOT_SMTP_ADDRESS=$SMTP_ADDRESS|" "$ENV_FILE"
sed -i.bak "s|CHATWOOT_SMTP_PORT=.*|CHATWOOT_SMTP_PORT=$SMTP_PORT|" "$ENV_FILE"
sed -i.bak "s|CHATWOOT_SMTP_USERNAME=.*|CHATWOOT_SMTP_USERNAME=$SMTP_USERNAME|" "$ENV_FILE"
sed -i.bak "s|CHATWOOT_SMTP_PASSWORD=.*|CHATWOOT_SMTP_PASSWORD=$SMTP_PASSWORD|" "$ENV_FILE"
sed -i.bak "s|CHATWOOT_MAILER_SENDER_EMAIL=.*|CHATWOOT_MAILER_SENDER_EMAIL=$SENDER_EMAIL|" "$ENV_FILE"

echo ""
echo "✓ SMTP configuration saved"
echo ""

# Clean up backup files
rm -f "$ENV_FILE.bak"

echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Your .env file has been created with secure secrets."
echo ""
echo "IMPORTANT: Save these values for the admin dashboard:"
echo ""
echo "CHATWOOT_BASE_URL=$BASE_URL"
echo "CHATWOOT_WEBHOOK_SECRET=$WEBHOOK_SECRET"
echo ""
echo "Add these to apps/admin/.env:"
echo ""
echo "# Chatwoot Integration"
echo "CHATWOOT_BASE_URL=$BASE_URL"
echo "CHATWOOT_WEBHOOK_SECRET=$WEBHOOK_SECRET"
echo "CHATWOOT_API_KEY=<generate_after_first_login>"
echo "CHATWOOT_ACCOUNT_ID=<get_from_chatwoot_ui>"
echo ""
echo "=========================================="
echo "Next Steps:"
echo "=========================================="
echo ""
echo "1. Review and edit .env if needed:"
echo "   nano $ENV_FILE"
echo ""
echo "2. Start Chatwoot services:"
echo "   docker compose up -d"
echo ""
echo "3. Initialize database:"
echo "   docker compose exec chatwoot-web bundle exec rails db:chatwoot_prepare"
echo ""
echo "4. Create admin user:"
echo "   docker compose exec chatwoot-web bundle exec rails runner \\"
echo "     \"User.create!(email: 'admin@ozean-licht.at', password: 'YourSecurePassword', name: 'Admin', confirmed_at: Time.now, role: :administrator)\""
echo ""
echo "5. Access Chatwoot UI:"
echo "   $BASE_URL"
echo ""
echo "6. Generate API key in Chatwoot UI:"
echo "   Profile Settings → Access Token → Add Personal Access Token"
echo ""
echo "7. Configure webhooks in Chatwoot UI:"
echo "   Settings → Integrations → Webhooks"
echo "   URL: https://admin.ozean-licht.dev/api/support/webhooks/chatwoot"
echo ""
echo "For full documentation, see README.md"
echo ""
