# Ablefy Transaction Migration Briefing

> Session: 2025-12-03 | Status: In Progress

## Goal

Migrate 40k+ Ablefy transactions from Airtable to our PostgreSQL database and set up N8N workflow to sync ongoing transactions.

## Current State

### Completed
- [x] Fixed N8N MCP connection (changed `N8N_URL` to `N8N_API_URL`, HTTP to HTTPS)
- [x] MCP Gateway running on port 8200 with N8N healthy
- [x] Added Supabase MCP to `.mcp.json`
- [x] Found legacy Ablefy integration code in `docs/archive/ozean-licht-legacy/`

### Pending
- [ ] Connect to Supabase to explore transactions table (restart session first)
- [ ] Get sample Ablefy webhook payload from Airtable
- [ ] Build N8N workflow: Airtable -> PostgreSQL
- [ ] Migrate existing 40k transactions
- [ ] Set up live sync for new transactions

## Key Files

| File | Purpose |
|------|---------|
| `/opt/ozean-licht-ecosystem/.mcp.json` | MCP server config (Supabase added) |
| `/opt/ozean-licht-ecosystem/.env` | N8N_API_URL fixed to `https://n8n.ozean-licht.dev` |
| `docs/archive/ozean-licht-legacy/database/edge-functions/process-ablefy-webhook/index.ts` | Transaction processing logic |
| `docs/archive/ozean-licht-legacy/workflows/ablefy-transaction-sync.json` | Legacy N8N workflow template |

## Ablefy Transaction Schema

```typescript
interface AblefyTransaction {
  // IDs
  trx_id: number                    // Primary key
  relevante_id?: string
  rechnungsnummer?: string          // Invoice number
  order_number?: number
  product_id?: number

  // Dates
  datum: string                     // Transaction date (DD.MM.YYYY HH:mm)
  erfolgt_am?: string               // Completed at

  // Status & Type
  status: string                    // Erfolgreich, Ausstehend, Fehlgeschlagen, Erstattet, Storniert
  typ: string                       // Transaction type
  zahlungsart: string               // PayPal, Kreditkarte, Klarna, SEPA, etc.

  // Financial
  faelliger_betrag: number          // Amount due
  bezahlt: number                   // Amount paid
  bezahlt_minus_fee?: number
  waehrung: string                  // Currency (EUR)
  fees_total?: number
  fees_service?: number
  fees_payment_provider?: number
  vat_rate?: number
  ust?: number                      // VAT amount

  // Product
  produkt?: string                  // Product name
  psp?: string
  plan?: string
  zahlungsplan_id?: number
  gutscheincode?: string

  // Buyer
  email: string                     // Required
  vorname?: string
  nachname?: string
  telefon?: string
  land?: string
  stadt?: string
  strasse?: string
  hausnummer?: string
  plz?: number
  ust_id?: string
  unternehmen?: string

  // Meta
  account_type: 'old' | 'new'
}
```

## Airtable Source

- **Base ID:** `app5e7mJQhxDYD5Zy`
- **Table ID:** `tblqaRqGbbYKRpE6W`
- **Credentials:** Configured in MCP Gateway (Airtable handler initialized)

## Architecture

```
┌─────────────┐    Webhook     ┌─────────┐    Insert    ┌────────────┐
│   Ablefy    │ ──────────────>│   N8N   │ ────────────>│ PostgreSQL │
└─────────────┘                └─────────┘              └────────────┘
       │                            │
       │                            │ Read records
       v                            v
┌─────────────┐              ┌─────────────┐
│  Airtable   │<─────────────│ Batch Sync  │
│ (40k+ txns) │              │  Workflow   │
└─────────────┘              └─────────────┘
```

## Next Steps

1. **Restart Claude Code session** to load Supabase MCP
2. **Use Supabase MCP** to explore transactions table schema
3. **Use Airtable MCP** to fetch sample transactions
4. **Create N8N workflow** with nodes:
   - Airtable Trigger (on record create/update)
   - Transform data (normalize dates, status, payment methods)
   - PostgreSQL Insert/Upsert
5. **Batch migration**: Loop through Airtable records and insert to DB
6. **Activate webhook** for live sync

## MCP Services Available

| Service | Status | Use For |
|---------|--------|---------|
| n8n | Healthy | Workflow automation |
| airtable | Healthy | Read transactions (source) |
| postgres | Error (local) | Target DB (use Supabase instead) |
| supabase | Configured | Target DB alternative |

## Commands to Test

```bash
# Test N8N
curl -s -X POST http://localhost:8200/mcp/execute \
  -H "Content-Type: application/json" \
  -d '{"command":"/mcp-n8n health"}'

# List Airtable tables
curl -s -X POST http://localhost:8200/mcp/execute \
  -H "Content-Type: application/json" \
  -d '{"command":"/mcp-airtable list-tables"}'
```

---
*Created: 2025-12-03 | Author: Claude Code*
