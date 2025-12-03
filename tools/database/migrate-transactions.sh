#!/bin/bash
# Migrate Transactions from Supabase to Local PostgreSQL
# Usage: ./migrate-transactions.sh

set -e

# Configuration
SUPABASE_URL="https://suwevnhwtmcazjugfmps.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1d2V2bmh3dG1jYXpqdWdmbXBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxODA5NzQsImV4cCI6MjA3Mjc1Njk3NH0.LBMjwzh3OmEur09Moqion1nNclri1w-Wx6gmRAuyGNw"
PG_CONTAINER="iccc0wo0wkgsws4cowk4440c"
PG_DATABASE="ozean-licht-db"
BATCH_SIZE=500
TEMP_DIR="/tmp/transaction-migration"

echo "🚀 Starting Transaction Migration from Supabase to Local PostgreSQL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Create temp directory
mkdir -p "$TEMP_DIR"

# Get total count
echo "📊 Getting total transaction count..."
TOTAL=$(curl -s "${SUPABASE_URL}/rest/v1/transactions?select=count" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Prefer: count=exact" \
  -H "Range: 0-0" \
  -I | grep -i "content-range" | sed 's/.*\///' | tr -d '\r')

echo "   Total transactions in Supabase: $TOTAL"

# Get existing count in local DB
EXISTING=$(docker exec "$PG_CONTAINER" psql -U postgres -d "$PG_DATABASE" -t -c "SELECT COUNT(*) FROM transactions;" | tr -d ' ')
echo "   Existing transactions in local DB: $EXISTING"

if [ "$EXISTING" -gt 0 ]; then
  echo "⚠️  Local database has existing transactions. Will skip duplicates."
fi

# Calculate batches
BATCHES=$(( (TOTAL + BATCH_SIZE - 1) / BATCH_SIZE ))
echo "   Will process in $BATCHES batches of $BATCH_SIZE records each"
echo ""

MIGRATED=0
SKIPPED=0

for ((i=0; i<BATCHES; i++)); do
  OFFSET=$((i * BATCH_SIZE))
  END=$((OFFSET + BATCH_SIZE - 1))

  echo "📦 Batch $((i+1))/$BATCHES: Fetching records $OFFSET to $END..."

  # Fetch batch from Supabase
  curl -s "${SUPABASE_URL}/rest/v1/transactions?select=*&order=created_at.asc" \
    -H "apikey: ${SUPABASE_ANON_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
    -H "Range: ${OFFSET}-${END}" \
    > "$TEMP_DIR/batch_${i}.json"

  # Check if we got data
  BATCH_COUNT=$(jq 'length' "$TEMP_DIR/batch_${i}.json")

  if [ "$BATCH_COUNT" -eq 0 ]; then
    echo "   No more records. Stopping."
    break
  fi

  echo "   Fetched $BATCH_COUNT records. Inserting..."

  # Generate and execute INSERT statements
  BATCH_INSERTED=0

  # Process each record
  jq -c '.[]' "$TEMP_DIR/batch_${i}.json" | while read -r row; do
    # Extract values (handling nulls and escaping)
    ID=$(echo "$row" | jq -r '.id // empty')
    TRX_ID=$(echo "$row" | jq -r '.trx_id // "NULL"')

    # Skip if no ID
    if [ -z "$ID" ]; then
      continue
    fi

    # Generate INSERT with all fields
    SQL=$(cat <<EOF
INSERT INTO transactions (
  id, trx_id, relevante_id, rechnungsnummer, invoice_number,
  stripe_payment_intent_id, stripe_charge_id,
  transaction_date, datum_raw, erfolgt_am,
  status, typ, zahlungsart,
  order_number, product_id, produkt, psp, course_id,
  faelliger_betrag, bezahlt, bezahlt_minus_fee,
  netto, einnahmen_netto,
  fees_total, fees_service, fees_payment_provider,
  vat_rate, ust, steuerkategorie, waehrung,
  plan, zahlungsplan_id, faelligkeiten_id, gutscheincode,
  buyer_email, buyer_first_name, buyer_last_name,
  buyer_phone, buyer_land, buyer_stadt,
  buyer_strasse, buyer_hausnummer, buyer_plz,
  buyer_adress_zusatz, buyer_country_code,
  buyer_ust_id, buyer_unternehmen,
  recipient_name, recipient_email, recipient_phone,
  recipient_land, recipient_strasse, recipient_hausnummer, recipient_firma,
  rechnungs_id, rechnungsdatum, ext_id, gutschrift,
  account_type, source_platform,
  order_id, user_id,
  imported_from_ablefy, imported_at,
  created_at, updated_at
) SELECT
  '${ID}'::uuid,
  $(echo "$row" | jq '.trx_id // "null"'),
  $(echo "$row" | jq '.relevante_id'),
  $(echo "$row" | jq '.rechnungsnummer'),
  $(echo "$row" | jq '.invoice_number'),
  $(echo "$row" | jq '.stripe_payment_intent_id'),
  $(echo "$row" | jq '.stripe_charge_id'),
  $(echo "$row" | jq '.transaction_date')::timestamptz,
  $(echo "$row" | jq '.datum_raw'),
  $(echo "$row" | jq '.erfolgt_am'),
  $(echo "$row" | jq '.status'),
  $(echo "$row" | jq '.typ'),
  $(echo "$row" | jq '.zahlungsart'),
  $(echo "$row" | jq '.order_number // "null"'),
  $(echo "$row" | jq '.product_id // "null"'),
  $(echo "$row" | jq '.produkt'),
  $(echo "$row" | jq '.psp'),
  $(echo "$row" | jq '.course_id // "null"'),
  $(echo "$row" | jq '.faelliger_betrag // 0'),
  $(echo "$row" | jq '.bezahlt // 0'),
  $(echo "$row" | jq '.bezahlt_minus_fee // "null"'),
  $(echo "$row" | jq '.netto // "null"'),
  $(echo "$row" | jq '.einnahmen_netto // "null"'),
  $(echo "$row" | jq '.fees_total // 0'),
  $(echo "$row" | jq '.fees_service // 0'),
  $(echo "$row" | jq '.fees_payment_provider // 0'),
  $(echo "$row" | jq '.vat_rate // 0'),
  $(echo "$row" | jq '.ust // 0'),
  $(echo "$row" | jq '.steuerkategorie'),
  $(echo "$row" | jq '.waehrung // "EUR"'),
  $(echo "$row" | jq '.plan'),
  $(echo "$row" | jq '.zahlungsplan_id // "null"'),
  $(echo "$row" | jq '.faelligkeiten_id // "null"'),
  $(echo "$row" | jq '.gutscheincode'),
  $(echo "$row" | jq '.buyer_email'),
  $(echo "$row" | jq '.buyer_first_name'),
  $(echo "$row" | jq '.buyer_last_name'),
  $(echo "$row" | jq '.buyer_phone'),
  $(echo "$row" | jq '.buyer_land'),
  $(echo "$row" | jq '.buyer_stadt'),
  $(echo "$row" | jq '.buyer_strasse'),
  $(echo "$row" | jq '.buyer_hausnummer'),
  $(echo "$row" | jq '.buyer_plz // "null"'),
  $(echo "$row" | jq '.buyer_adress_zusatz'),
  $(echo "$row" | jq '.buyer_country_code'),
  $(echo "$row" | jq '.buyer_ust_id'),
  $(echo "$row" | jq '.buyer_unternehmen'),
  $(echo "$row" | jq '.recipient_name'),
  $(echo "$row" | jq '.recipient_email'),
  $(echo "$row" | jq '.recipient_phone'),
  $(echo "$row" | jq '.recipient_land'),
  $(echo "$row" | jq '.recipient_strasse'),
  $(echo "$row" | jq '.recipient_hausnummer'),
  $(echo "$row" | jq '.recipient_firma'),
  $(echo "$row" | jq '.rechnungs_id // "null"'),
  $(echo "$row" | jq '.rechnungsdatum'),
  $(echo "$row" | jq '.ext_id'),
  $(echo "$row" | jq '.gutschrift'),
  $(echo "$row" | jq '.account_type // "new"'),
  $(echo "$row" | jq '.source_platform // "ablefy"'),
  $(echo "$row" | jq 'if .order_id then .order_id else null end')::uuid,
  $(echo "$row" | jq 'if .user_id then .user_id else null end')::uuid,
  $(echo "$row" | jq '.imported_from_ablefy // true'),
  $(echo "$row" | jq '.imported_at')::timestamptz,
  $(echo "$row" | jq '.created_at')::timestamptz,
  $(echo "$row" | jq '.updated_at')::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM transactions WHERE trx_id = $(echo "$row" | jq '.trx_id // "null"'));
EOF
)

    # Execute the SQL
    docker exec "$PG_CONTAINER" psql -U postgres -d "$PG_DATABASE" -c "$SQL" 2>/dev/null || true

  done

  echo "   ✅ Batch $((i+1)) complete"

  # Progress
  PROGRESS=$(( (i + 1) * 100 / BATCHES ))
  echo "   📊 Progress: ${PROGRESS}%"
  echo ""

  # Small delay to avoid rate limiting
  sleep 0.5
done

# Final count
FINAL=$(docker exec "$PG_CONTAINER" psql -U postgres -d "$PG_DATABASE" -t -c "SELECT COUNT(*) FROM transactions;" | tr -d ' ')

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Migration Complete!"
echo "   Source (Supabase):    $TOTAL transactions"
echo "   Target (PostgreSQL):  $FINAL transactions"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Cleanup
rm -rf "$TEMP_DIR"
