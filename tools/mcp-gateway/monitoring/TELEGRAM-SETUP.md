# Telegram Alerts Setup for Grafana

## Overview

This guide sets up Telegram notifications for Grafana alerts from the MCP Gateway monitoring dashboard.

## Prerequisites

- Telegram account
- Access to Grafana (https://grafana.ozean-licht.dev)
- Admin credentials for Grafana

## Step 1: Create Telegram Bot

### 1.1 Talk to BotFather

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Follow prompts:
   - **Bot name**: `Ozean Licht MCP Alerts` (or any name you prefer)
   - **Bot username**: `ozean_licht_mcp_bot` (must end in `_bot` and be unique)

4. BotFather will reply with your **Bot Token**:
   ```
   Use this token to access the HTTP API:
   1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
   ```

5. **Save this token** - you'll need it for Grafana configuration

### 1.2 Get Chat ID

You need the Chat ID to know where to send alerts:

**Option A: Personal Chat (Direct Messages)**

1. Send any message to your bot (e.g., "Hello")
2. Run this command to get your chat ID:
   ```bash
   curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates" | jq '.result[0].message.chat.id'
   ```

3. The response will include your `chat_id` (a number, e.g., `123456789`)

**Option B: Group Chat (Team Notifications)**

1. Create a Telegram group
2. Add your bot to the group
3. Send a message in the group mentioning the bot
4. Run the same command as above
5. The `chat_id` will be negative (e.g., `-987654321`)

## Step 2: Add Bot Token to Environment

Add the Telegram credentials to your `.env` file:

```bash
# Telegram Alerts
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=123456789  # Your personal or group chat ID
```

## Step 3: Configure Grafana Contact Point

### 3.1 Via Grafana UI

1. Open Grafana: https://grafana.ozean-licht.dev
2. Login with admin credentials
3. Navigate to: **Alerting** → **Contact points**
4. Click **"+ Add contact point"**
5. Fill in the form:
   - **Name**: `Telegram - MCP Alerts`
   - **Integration**: Select `Telegram`
   - **BOT API Token**: Paste your bot token
   - **Chat ID**: Paste your chat ID
   - **Message**: (Optional - customize alert message)
     ```
     🚨 {{ .Status | toUpper }}{{ if eq .Status "firing" }}🔥{{ end }}

     Alert: {{ .Labels.alertname }}
     Service: {{ .Labels.service }}
     Severity: {{ .Labels.severity }}

     {{ .Annotations.description }}

     Time: {{ .StartsAt.Format "2006-01-02 15:04:05 MST" }}
     ```

6. Click **"Test"** to verify connectivity
7. Click **"Save contact point"**

### 3.2 Via API (Automated)

```bash
# Create Telegram contact point
curl -X POST https://grafana.ozean-licht.dev/api/v1/provisioning/contact-points \
  -H "Authorization: Bearer <GRAFANA_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Telegram - MCP Alerts",
    "type": "telegram",
    "settings": {
      "bottoken": "'"$TELEGRAM_BOT_TOKEN"'",
      "chatid": "'"$TELEGRAM_CHAT_ID"'",
      "message": "🚨 {{ .Status | toUpper }}\n\nAlert: {{ .Labels.alertname }}\nService: {{ .Labels.service }}\nSeverity: {{ .Labels.severity }}\n\n{{ .Annotations.description }}\n\nTime: {{ .StartsAt.Format \"2006-01-02 15:04:05 MST\" }}"
    },
    "disableResolveMessage": false
  }'
```

### 3.3 Via Configuration File (Provisioned)

Create: `infrastructure/mcp-gateway/monitoring/grafana/provisioning/alerting/telegram-contact-point.yml`

```yaml
apiVersion: 1

contactPoints:
  - orgId: 1
    name: Telegram - MCP Alerts
    receivers:
      - uid: telegram-mcp
        type: telegram
        settings:
          bottoken: ${TELEGRAM_BOT_TOKEN}
          chatid: ${TELEGRAM_CHAT_ID}
          message: |
            🚨 {{ .Status | toUpper }}{{ if eq .Status "firing" }}🔥{{ end }}

            Alert: {{ .Labels.alertname }}
            Service: {{ .Labels.service }}
            Severity: {{ .Labels.severity }}

            {{ .Annotations.description }}

            Time: {{ .StartsAt.Format "2006-01-02 15:04:05 MST" }}
          disable_resolve_message: false
```

Then update `docker-compose.yml` to include environment variables:

```yaml
grafana:
  environment:
    - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
    - TELEGRAM_CHAT_ID=${TELEGRAM_CHAT_ID}
```

## Step 4: Link Alert Rules to Telegram

### 4.1 Update Notification Policy

1. Go to: **Alerting** → **Notification policies**
2. Click **"Edit" (pencil icon)** on the root policy
3. Under **"Contact point"**, select `Telegram - MCP Alerts`
4. Click **"Save policy"**

### 4.2 Create Specific Route (Advanced)

For different severities (e.g., only critical alerts to Telegram):

```yaml
# In provisioning/alerting/notification-policies.yml
policies:
  - receiver: Telegram - MCP Alerts
    matchers:
      - severity = critical
    continue: false
```

## Step 5: Test Alerts

### Manual Test

1. Go to Grafana → **Alerting** → **Alert rules**
2. Find an alert rule (e.g., "HighErrorRate")
3. Click **"More" (...)** → **"Declare incident"**
4. Check Telegram for the alert notification

### Trigger Real Alert

Force an error condition:

```bash
# Simulate high error rate
for i in {1..100}; do
  curl -X POST http://localhost:8100/mcp/rpc \
    -H "Content-Type: application/json" \
    -d '{"jsonrpc":"2.0","method":"invalid.method","id":1}'
  sleep 0.1
done
```

Within 2 minutes, you should receive a Telegram alert for "HighErrorRate" (if configured).

## Alert Message Customization

### Default Message Template

```
🚨 FIRING🔥

Alert: HighErrorRate
Service: mcp-gateway
Severity: warning

Error rate exceeds 0.1 errors/sec for 2 minutes

Time: 2025-10-23 17:30:00 UTC
```

### Custom Message Variables

Available template variables:
- `{{ .Status }}` - "firing" or "resolved"
- `{{ .Labels.alertname }}` - Alert rule name
- `{{ .Labels.service }}` - Service name
- `{{ .Labels.severity }}` - Severity level
- `{{ .Annotations.description }}` - Alert description
- `{{ .StartsAt }}` - Alert start time
- `{{ .EndsAt }}` - Alert end time (for resolved)
- `{{ .DashboardURL }}` - Link to dashboard (if configured)
- `{{ .PanelURL }}` - Link to panel (if configured)

### Emoji Indicators

- 🚨 Alert status
- 🔥 Firing state
- ✅ Resolved state
- ⚠️ Warning severity
- 🔴 Critical severity
- 📊 Dashboard link
- 🔗 Panel link

## Monitoring Alert Delivery

### Check Telegram API Status

```bash
# Verify bot is active
curl "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getMe"

# Check recent messages
curl "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getUpdates"
```

### Grafana Alert State History

1. Go to: **Alerting** → **Alert rules**
2. Click on any alert rule
3. View **"State history"** tab
4. Check if alerts are being triggered and sent

## Troubleshooting

### Bot Not Responding

- **Issue**: Bot doesn't reply to messages
- **Solution**: Verify bot token is correct, bot is not blocked by Telegram

### Alerts Not Received

1. **Check Grafana Logs**:
   ```bash
   docker logs grafana-o000okc80okco8s0sgcwwcwo 2>&1 | grep -i telegram
   ```

2. **Verify Contact Point**:
   - Grafana → Alerting → Contact points
   - Click "Test" button on Telegram contact point
   - Should receive test message in Telegram

3. **Check Notification Policy**:
   - Ensure Telegram contact point is selected in root policy

4. **Verify Chat ID**:
   - Chat ID must be a number (positive for personal, negative for groups)
   - Re-run getUpdates to confirm

### Invalid Bot Token Error

- **Error**: `{"ok":false,"error_code":401,"description":"Unauthorized"}`
- **Solution**: Double-check bot token from BotFather, regenerate if needed

### Chat Not Found Error

- **Error**: `{"ok":false,"error_code":400,"description":"Bad Request: chat not found"}`
- **Solution**: Send a message to the bot first, then get chat ID again

## Security Best Practices

1. **Never commit bot token to git**
   - Use `.env` file (already in `.gitignore`)
   - Store in Coolify environment variables

2. **Restrict bot access**
   - Only share bot with team members
   - Use group chat for team alerts
   - Personal chat for admin-level alerts

3. **Rotate tokens periodically**
   - Generate new token via BotFather
   - Update in all configurations

4. **Monitor bot usage**
   - Check getUpdates regularly for unexpected messages
   - Review Grafana alert delivery logs

## Next Steps

1. ✅ Create Telegram bot via BotFather
2. ✅ Get bot token and chat ID
3. ✅ Add to `.env` file
4. ⏳ Configure Grafana contact point (UI or provisioning)
5. ⏳ Link alert rules to Telegram
6. ⏳ Test with manual alert trigger
7. ⏳ Monitor alert delivery

---

**Last Updated**: 2025-10-23
**Status**: Documentation complete, awaiting bot creation and configuration
