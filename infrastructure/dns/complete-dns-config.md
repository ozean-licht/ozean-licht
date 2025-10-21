# Complete DNS Configuration for Hostinger

## ozean-licht.dev

### A Records (Application Services)
| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 138.201.139.25 | 3600 |
| A | www | 138.201.139.25 | 3600 |
| A | coolify | 138.201.139.25 | 3600 |
| A | n8n | 138.201.139.25 | 3600 |
| A | qdrant | 138.201.139.25 | 3600 |
| A | mem0 | 138.201.139.25 | 3600 |
| A | api | 138.201.139.25 | 3600 |
| A | app | 138.201.139.25 | 3600 |

### MX Records (Email - Using Google Workspace or ProtonMail)
| Type | Name | Priority | Value | TTL |
|------|------|----------|-------|-----|
| MX | @ | 1 | aspmx.l.google.com | 3600 |
| MX | @ | 5 | alt1.aspmx.l.google.com | 3600 |
| MX | @ | 5 | alt2.aspmx.l.google.com | 3600 |
| MX | @ | 10 | alt3.aspmx.l.google.com | 3600 |
| MX | @ | 10 | alt4.aspmx.l.google.com | 3600 |

**OR for ProtonMail:**
| Type | Name | Priority | Value | TTL |
|------|------|----------|-------|-----|
| MX | @ | 10 | mail.protonmail.ch | 3600 |
| MX | @ | 20 | mailsec.protonmail.ch | 3600 |

### TXT Records (SPF, DMARC, Domain Verification)
| Type | Name | Value | TTL |
|------|------|-------|-----|
| TXT | @ | "v=spf1 include:_spf.google.com ~all" | 3600 |
| TXT | _dmarc | "v=DMARC1; p=quarantine; rua=mailto:admin@ozean-licht.dev" | 3600 |

### CNAME Records
| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | mail | mail.google.com | 3600 |

---

## kids-ascension.dev

### A Records
| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 138.201.139.25 | 3600 |
| A | www | 138.201.139.25 | 3600 |
| A | app | 138.201.139.25 | 3600 |
| A | api | 138.201.139.25 | 3600 |
| A | admin | 138.201.139.25 | 3600 |
| A | video | 138.201.139.25 | 3600 |

### MX Records (Same as above)
Configure same as ozean-licht.dev

### TXT Records
| Type | Name | Value | TTL |
|------|------|-------|-----|
| TXT | @ | "v=spf1 include:_spf.google.com ~all" | 3600 |
| TXT | _dmarc | "v=DMARC1; p=quarantine; rua=mailto:admin@kids-ascension.dev" | 3600 |

## Clean Up in Hostinger

### Remove/Update These Default Records:
- ❌ Remove default Hostinger MX records
- ❌ Remove default parking page A records (if any)
- ❌ Remove unnecessary CNAME records
- ✅ Keep only the records listed above

## Verify DNS Propagation

```bash
# Check A records
dig ozean-licht.dev +short
dig n8n.ozean-licht.dev +short
dig app.kids-ascension.dev +short

# Check MX records
dig ozean-licht.dev MX +short

# Check TXT records
dig ozean-licht.dev TXT +short
```