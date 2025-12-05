# Ozean Licht Support Management System

> Vision Document for Conversational Customer Support

**Status:** Planning
**Last Updated:** 2025-12-04
**Platforms:** Ozean Licht Akademie, Kids Ascension

---

## 1. Vision

### The Shift: From Tickets to Conversations

Traditional support systems create friction. Users fill out forms, receive ticket numbers, wait for email responses, and feel like they're talking to a machine. This is the opposite of what Ozean Licht stands for.

**Our vision:** Support should feel like messaging a friend who happens to be an expert. Natural, instant, human.

### Core Philosophy

```
"Support is not a cost center — it's where trust is built."
```

For a spiritual education platform, every support interaction is an extension of the teaching relationship. A student struggling with course access isn't just a technical issue — they're a soul seeking guidance who hit a roadblock.

**Guiding Principles:**
1. **Warmth over efficiency** — Resolve with care, not just speed
2. **Transparency over formality** — "We're looking into this" beats "Ticket #4521 received"
3. **Empowerment over dependency** — Help users help themselves
4. **Presence over automation** — AI assists, humans connect

---

## 2. User Experience Targets

### 2.1 The "WhatsApp Standard"

Users expect support to feel like their daily messaging apps:

| Traditional | Ozean Licht Target |
|-------------|-------------------|
| Fill form, get ticket number | Send message, get response |
| Check email for updates | See typing indicator, real-time reply |
| Formal "Dear Customer" tone | Warm, first-name conversation |
| Close ticket = relationship ends | Conversation stays, relationship grows |
| Hours for first response | Minutes (or instant AI assist) |

### 2.2 UX Goals by Scenario

**Scenario 1: Course Access Issue**
- User: "I can't access Module 3"
- Target: Problem identified + solved in < 5 minutes
- Experience: Chat widget opens, AI suggests cache clear, if fails → human agent sees full context

**Scenario 2: Payment Question**
- User: "Will there be a payment plan for the new course?"
- Target: Routed to sales within 30 seconds, personal response within 1 hour
- Experience: AI acknowledges, creates internal note, sales team follows up personally

**Scenario 3: Spiritual Guidance Request**
- User: "I had a profound experience during meditation, need to talk"
- Target: Recognized as sensitive, routed to trained team member
- Experience: NOT handled by AI, human warmth required, longer response OK

### 2.3 Response Time Targets

| Priority | First Response | Resolution |
|----------|----------------|------------|
| Critical (access blocked) | < 15 min | < 2 hours |
| High (payment/billing) | < 1 hour | < 24 hours |
| Normal (questions) | < 4 hours | < 48 hours |
| Low (feedback/suggestions) | < 24 hours | Acknowledged |

---

## 3. User Personas

### 3.1 The Spiritual Seeker (Primary - Ozean Licht)

**Profile:** 35-55, German-speaking, discovering spiritual practices, may not be tech-savvy

**Support Needs:**
- Course navigation help
- Payment questions (often prefers personal contact)
- Technical issues with video playback
- Deeper questions about course content
- Community connection requests

**UX Requirements:**
- German-first interface
- Simple, calming visual design
- Phone support option for complex issues
- Patient, non-judgmental tone

### 3.2 The Parent (Kids Ascension)

**Profile:** 28-45, parent interested in conscious education for children

**Support Needs:**
- Waitlist status questions
- Content suitability questions
- Scheduling and access
- Partnership inquiries

**UX Requirements:**
- Fast answers (parents are busy)
- Mobile-first experience
- Clear, practical responses

### 3.3 The Course Creator / Admin (Internal)

**Profile:** Team members managing content, courses, users

**Support Needs:**
- Internal communication about user issues
- Escalation paths
- Knowledge sharing

**UX Requirements:**
- Team chat alongside customer conversations
- Easy handoff between team members
- Full conversation history

---

## 4. Core Features

### 4.1 Unified Inbox (Chat-First)

**Concept:** All conversations in one place, regardless of source channel.

```
+------------------------------------------+
|  INBOX                        [Search]   |
|------------------------------------------|
|  [Open: 12]  [Assigned: 5]  [Resolved]   |
|------------------------------------------|
|  Maria K.        "Module 3 won't load"   |
|  WhatsApp        2 min ago    [Tech]     |
|------------------------------------------|
|  Thomas B.       "Payment question"      |
|  Website Chat    15 min ago   [Sales]    |
|------------------------------------------|
|  Anna S.         "Beautiful experience"  |
|  Email           1 hour ago   [Personal] |
+------------------------------------------+
```

**Key Features:**
- Single view for all channels (chat, email, WhatsApp, Telegram)
- Visual indicators: unread, waiting, urgent
- Quick filters by team, label, status
- Conversation preview without opening
- Bulk actions (assign, label, close)

### 4.2 Smart Routing

**Automatic categorization and assignment based on:**

| Signal | Route To |
|--------|----------|
| Keywords: "payment", "invoice", "refund" | Sales Team |
| Keywords: "error", "not working", "can't access" | Tech Support |
| Keywords: "meditation", "experience", "guidance" | Spiritual Team |
| Language: German | German-speaking agent |
| VIP customer flag | Senior team member |
| After hours | AI + queue for morning |

**Escalation Paths:**
```
User Message
    ↓
AI Categorization (instant)
    ↓
Auto-assign to Team Queue
    ↓
Agent Claims or Auto-assigns (round-robin)
    ↓
If no response in X minutes → Escalate to Team Lead
    ↓
If complex → Escalate to Admin
```

### 4.3 AI-Powered First Response

**Philosophy:** AI handles the "boring" stuff so humans can do the "heart" stuff.

**AI Capabilities:**
- **Instant acknowledgment**: "Hi Maria, I see you're having trouble with Module 3. Let me help!"
- **Knowledge base search**: Suggest relevant help articles
- **Common issue resolution**: Password reset, cache clearing, basic troubleshooting
- **Context gathering**: "Can you tell me which browser you're using?"
- **Sentiment detection**: Flag emotional messages for human priority

**AI Boundaries (Never Automate):**
- Refund decisions
- Personal spiritual questions
- Complaint handling
- VIP customer interactions
- Any message with negative sentiment

### 4.4 Team Collaboration

**Internal Team Chat:**
- Private notes on any conversation (customer doesn't see)
- @mention team members for input
- Team channels for categories (tech-support, sales, spiritual)
- Shared snippets/templates for common responses

**Handoff Experience:**
```
[Agent 1]: "Maria, I'm passing you to Thomas who specializes in payment questions."
[System]: Thomas joined the conversation
[Thomas]: "Hi Maria, I see you asked about payment plans. Let me help..."
```
- Full context visible to new agent
- No customer repetition required
- Warm handoff, not cold transfer

### 4.5 Knowledge Base & Self-Service

**Help Center Portal:**
- Searchable articles organized by category
- Video tutorials embedded
- FAQ with collapsible answers
- Multi-language (DE/EN)

**AI-Suggested Articles:**
- Before user sends message: "Looking for help with...?" suggestions
- After message: "While you wait, this might help: [link]"
- In-chat article preview (no redirect needed)

**Self-Learning System:**
- Track which articles resolve issues
- Identify gaps (frequent questions with no article)
- Auto-suggest article creation to team

### 4.6 Customer Context Panel

**When agent opens conversation, they see:**

```
+------------------------------------------+
|  CUSTOMER: Maria Kowalski                |
|------------------------------------------|
|  Email: maria@email.com                  |
|  Member since: 2024-03-15                |
|  Courses: Meditation Basics, Advanced    |
|  Last login: Today, 14:23                |
|  Previous tickets: 2 (resolved)          |
|------------------------------------------|
|  NOTES:                                  |
|  - Prefers phone for complex issues      |
|  - Timezone: CET                         |
|------------------------------------------|
|  RECENT ACTIVITY:                        |
|  - Started Module 3 (stuck at 12%)       |
|  - Watched intro video 3x                |
+------------------------------------------+
```

**Integration Points:**
- Pull from Ozean Licht user database
- Course progress from LMS
- Payment history from commerce system
- Previous support conversations

---

## 5. Channel Strategy

### 5.1 Primary Channels

| Channel | Use Case | Priority |
|---------|----------|----------|
| **Website Chat Widget** | First contact, browsing users | High |
| **WhatsApp Business** | Ongoing conversations, mobile users | High |
| **Email** | Formal requests, documents | Medium |
| **Telegram** | Tech-savvy users, quick questions | Medium |

### 5.2 Widget Design Vision

**Appearance:**
- Ozean Licht branding (turquoise accent #0ec2bc)
- Minimalist, non-intrusive bubble
- Glass morphism card when opened
- Smooth animations (slide up, not pop)

**Behavior:**
- Appears after 30s on page (not immediately)
- Remembers conversation across sessions
- Pre-chat: "How can we help?" with quick options
- Shows online/offline status honestly
- Mobile-responsive (full screen on mobile)

**Quick Actions:**
```
+---------------------------+
|  How can we help?         |
|---------------------------|
|  [Course Access Issue]    |
|  [Payment Question]       |
|  [Technical Problem]      |
|  [Something Else...]      |
+---------------------------+
```

### 5.3 WhatsApp Integration

**Why WhatsApp:**
- 85%+ of German users have WhatsApp
- Feels personal, not corporate
- Notifications work (emails get ignored)
- Media sharing easy (screenshots, videos)

**Implementation:**
- WhatsApp Business API (official)
- Template messages for proactive outreach
- Rich media support (images, documents)
- Conversation continues seamlessly in inbox

---

## 6. Team Structure & Workflows

### 6.1 Support Tiers

**Tier 1: AI + First Response**
- Automated acknowledgment
- Knowledge base suggestions
- Basic troubleshooting scripts
- Escalation to Tier 2

**Tier 2: Support Team**
- Course access issues
- Basic technical support
- General questions
- Escalation to Tier 3

**Tier 3: Specialists**
- Payment/billing (Sales)
- Complex technical (Dev)
- Spiritual guidance (Senior Team)
- Complaints (Admin)

### 6.2 Business Hours & Availability

**Active Hours:** Mon-Fri 9:00-18:00 CET

**After Hours:**
- AI acknowledgment: "We received your message and will respond tomorrow morning"
- Urgent detection: If keywords match, send notification to on-call
- Self-service: Knowledge base always available

### 6.3 Canned Responses (Macros)

**Examples:**
```
/greeting
"Hallo [Name], schön von dir zu hören! Wie kann ich dir helfen?"

/password-reset
"Ich habe dir gerade einen Link zum Zurücksetzen deines Passworts geschickt.
Bitte überprüfe auch deinen Spam-Ordner. Melde dich, wenn es nicht klappt!"

/course-progress
"Ich sehe, dass du bei [Modul] bist. Lass mich kurz nachschauen,
was das Problem sein könnte..."

/escalate-spiritual
"Das klingt nach einer tiefgreifenden Erfahrung. Ich verbinde dich
mit [Name], die/der sich besonders gut mit solchen Themen auskennt."
```

---

## 7. Analytics & Insights

### 7.1 Key Metrics Dashboard

**Volume Metrics:**
- Total conversations (daily/weekly/monthly)
- Conversations by channel
- Peak hours heatmap

**Performance Metrics:**
- First response time (avg, median, 90th percentile)
- Resolution time
- Customer satisfaction (CSAT)
- AI deflection rate (resolved without human)

**Team Metrics:**
- Conversations per agent
- Resolution rate per agent
- Response time per agent
- Customer feedback per agent

### 7.2 Insight Reports

**Weekly Report:**
- Top 5 issues this week
- Suggested knowledge base articles to create
- Unusual patterns or spikes
- Customer sentiment trends

**Monthly Report:**
- CSAT score evolution
- Channel performance comparison
- Team workload distribution
- AI effectiveness analysis

---

## 8. Integration with Ozean Licht Ecosystem

### 8.1 Admin Dashboard Integration

**Location:** `/dashboard/support/` in admin app

**Components:**
- Inbox view (embedded or linked)
- Quick stats widget on main dashboard
- Customer lookup from user management
- Link support conversations to user profiles

### 8.2 Data Integrations

| System | Data Flow |
|--------|-----------|
| User Database | Customer profiles, enrollment status |
| Course System | Progress, completion, access rights |
| Payment System | Invoices, subscriptions, refunds |
| Email System | Notification preferences |
| Telegram Bot | Existing bot conversations |

### 8.3 MCP Gateway Integration

**Potential MCP Tools:**
- `support.createConversation` - Programmatic conversation creation
- `support.addNote` - Add internal notes
- `support.assignAgent` - Auto-assignment logic
- `support.searchKnowledge` - Knowledge base queries

---

## 9. Implementation Considerations

### 9.1 Build vs. Integrate

**Recommendation: Integrate Chatwoot + Customize**

| Approach | Pros | Cons |
|----------|------|------|
| Build from scratch | Full control, perfect fit | 6+ months, high cost |
| Chatwoot self-hosted | 80% features ready, active community | Some customization needed |
| SaaS (Intercom, Zendesk) | Instant start | Expensive, no data control |

### 9.2 Chatwoot Customization Needs

**UI Customization:**
- Ozean Licht branding on widget
- German language default
- Custom quick actions

**Integration Work:**
- Webhook to sync with user database
- Customer context panel with course data
- SSO with admin dashboard

**AI Enhancement:**
- Connect to custom knowledge base
- German language model fine-tuning
- Sentiment analysis for routing

### 9.3 Deployment

**Infrastructure:**
- Self-hosted on Hetzner (existing server)
- Docker deployment
- PostgreSQL (shared or dedicated)
- Redis for real-time features

**Security:**
- GDPR compliance (data in EU)
- End-to-end encryption for messages
- Access control (team roles)
- Audit logging

---

## 10. Success Criteria

### 10.1 Launch Metrics (Month 1)

- [ ] Widget live on ozean-licht.at
- [ ] WhatsApp Business connected
- [ ] Team trained on new system
- [ ] 5 knowledge base articles published
- [ ] First response time < 4 hours

### 10.2 Growth Metrics (Month 3)

- [ ] AI deflection rate > 20%
- [ ] CSAT score > 4.0/5.0
- [ ] First response time < 1 hour
- [ ] 20+ knowledge base articles
- [ ] Zero missed conversations

### 10.3 Maturity Metrics (Month 6)

- [ ] AI deflection rate > 40%
- [ ] CSAT score > 4.5/5.0
- [ ] First response time < 30 minutes
- [ ] Self-service resolves 30% of issues
- [ ] Full integration with course system

---

## 11. Open Questions

1. **Phone Support:** Do we need voice calling, or is chat sufficient?
2. **Video Support:** Screen sharing for technical issues?
3. **Community Forum:** Should support include community peer help?
4. **Multi-brand:** Separate widgets for Ozean Licht vs Kids Ascension?
5. **Proactive Support:** Reach out when users struggle (detected via analytics)?

---

## 12. Next Steps

1. **Validate vision** with team stakeholders
2. **Create technical spec** from this document
3. **Deploy Chatwoot** test instance
4. **Design widget** mockups
5. **Plan data integrations**
6. **Train team** on new workflows

---

*This document serves as the foundation for the Support Management System spec.*
*Reference: Research on Chatwoot, Chaskiq, Tiledesk conducted 2025-12-04*

**05.12.2025 Further Thoughts

Human:

I like Chatwoot, it looks nice. But I see that it’s a separate container.

What I had in mind was like more of a Facebook messenger style, where you’re inside admin dashboard and have this messeging UI

Group Chat but also Private team chat and Ticket from Customers to support, tickets for tech to dev.

With chatwoot it seems I have a separate network

Claude:

You're right — Chatwoot is essentially a separate application that you'd embed or iframe into your dashboard. That's not the seamless, 
native experience you're envisioning.


What You Actually Want

A built-in messaging system inside your admin dashboard:

┌─────────────────────────────────────────────────────────────────┐
│  Trinity Studio Admin                                           │
├──────────┬──────────────────────────────────────────────────────┤
│          │                                                      │
│ Sidebar  │   ┌─────────────────┬──────────────────────────┐    │
│          │   │ Conversations   │  Chat Thread             │    │
│ Dashboard│   │                 │                          │    │
│ Projects │   │ 🔵 Team General │  [Message bubbles]       │    │
│ Team     │   │ 🔵 Dev Team     │                          │    │
│ ──────── │   │ ──────────────  │                          │    │
│ Messages │   │ 🎫 Max S.       │                          │    │
│   └ Team │   │    Payment issue│                          │    │
│   └ Support  │ 🎫 Anna K.      │  ┌────────────────────┐  │    │
│   └ Dev  │   │    Course access│  │ Type message...    │  │    │
│          │   │                 │  └────────────────────┘  │    │
│          │   └─────────────────┴──────────────────────────┘    │
└──────────┴──────────────────────────────────────────────────────┘

Three Conversation Types — One UI

Type | Participants | Purpose
Team Chat | Internal team members | General discussion, like Slack channels
Support Tickets | Customer ↔ Support agents | External customer inquiries
Dev Tickets | Team member → Dev team | Internal technical requests

All rendered the same way — as conversations/chats, not tickets.

## Build vs Chatwoot Trade-off

Aspect | Chatwoot | Custom Built
----------------------------------------------------------------------
Time to MVP | 2-3 days setup | 2-3 weeks build
Native UX | Iframe/separate tab | Fully integrated
Data model | Their schema + sync | Your schema, your control
Real-time | Their WebSocket | Your WebSocket (already have infrastructure)
Channels (WhatsApp, etc.) | Built-in connectors | Must build/integrate yourself
Maintenance | They maintain | You maintain


My Recommendation
Build it native. Here's why it fits your context:

You already have the patterns — CommentThread.tsx, ActivityLog.tsx exist
You have WebSocket capability — can add real-time easily
Your team is small (6 people) — don't need enterprise ticketing overhead
Spiritual platform UX matters — custom feel > generic SaaS look
Future agentic layer — your AI agents can participate in these chats natively

For external channels (WhatsApp, Telegram), you can add inbound integrations later that funnel into your native messaging system.

Human: 

What if we take the open source code of chatwoot and extract everything that we want?

That's a clever middle-ground, but let me give you the honest assessment:
Chatwoot Codebase Reality
Tech Stack:

Backend: Ruby on Rails
Frontend: Vue.js
Database: PostgreSQL
Real-time: ActionCable (Rails WebSockets)

Your Stack:

Backend: Next.js API routes / TypeScript
Frontend: React + ShadCN
Database: PostgreSQL ✓ (match)
Real-time: Would be Socket.io or Server-Sent Events

The Extraction Problem
You'd essentially be translating Vue → React and Ruby → TypeScript, not extracting. That's more work than building from scratch with your patterns.
What you could extract:

Database schema ideas — their conversation/message models are battle-tested
UX patterns — screenshot their UI, rebuild in ShadCN
Business logic concepts — routing rules, SLA tracking, CSAT flow

What's not worth extracting:

Actual component code (Vue → React rewrite)
Backend logic (Ruby → TypeScript rewrite)
Their WebSocket implementation (ActionCable is Rails-specific)

1. Study Chatwoot UI/UX        → Screenshot everything you like
2. Study their DB schema       → Adapt to your conventions
3. Study their feature set     → Pick what matters for v1
4. Build in React/ShadCN       → Your patterns, your stack

What's Actually Worth Copying from Chatwoot
Schema concepts:

Conversations with polymorphic participants
Message types (text, attachment, template, activity)
Inbox abstraction (channel source)
Labels + Teams + Assignment model
CSAT rating per conversation

UX patterns:

Left panel conversation list with filters
Right panel context sidebar
Message composer with canned responses
Typing indicators
Read receipts
Private notes (yellow background)


Revised Recommendation
Don't extract code. Instead:

I fetch Chatwoot's schema from their repo
Adapt it to your TypeScript/PostgreSQL conventions
Build the UI natively in ShadCN with their UX as reference
Skip what you don't need (multi-tenant accounts, enterprise RBAC complexity)