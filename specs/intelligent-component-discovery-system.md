# Plan: Intelligent Multi-Layer Component Discovery System with Local Tailwind Plus Index

**Version:** 2.0 - Updated for Current State
**Date:** 2025-11-12
**Status:** Ready for Implementation (Post-Storybook Phase 2)
**Prerequisite:** Storybook Phase 1-2 Complete (Weeks 1-4)

## Task Description
Build a sophisticated AI-powered component discovery system that enhances the Ozean Licht Storybook platform with semantic search capabilities. The system downloads and indexes Tailwind Plus components locally (web scraping, no API token), providing natural language queries like "show me glass cards with turquoise accents" or "find composition components for authentication flows" across 84 existing production-ready components plus the entire Tailwind Plus library.

## Current State Analysis

### ✅ Completed Infrastructure (Phases 1-4)
The shared UI components library now has **84 production-ready components** across three tiers:

**Tier 1 - Base Layer (58 components):**
- ✅ 47 shadcn/ui primitives (Radix UI)
- ✅ 11 Catalyst components (Headless UI)
- Status: Production-ready, full TypeScript support

**Tier 2 - Brand Layer (7 components):**
- ✅ Branded Button, Card, Input, Badge, Dialog, Alert, Skeleton
- ✅ Ozean Licht design tokens applied (turquoise #0ec2bc, glass morphism)
- Status: Brand identity established and working

**Tier 3 - Composition Layer (19 components):**
- ✅ 6 Cards (CourseCard, TestimonialCard, PricingCard, BlogCard, FeatureCard, StatsCard)
- ✅ 5 Sections (CTA, Hero, Feature, Testimonials, Pricing)
- ✅ 5 Forms (Login, Register, PasswordReset, MagicLink, Contact)
- ✅ 3 Layouts (Dashboard, Marketing, Auth)
- Status: Complete, 0 TypeScript errors

**Location:** `shared/ui-components/src/`
**Build Status:** ✅ Success (CJS: 50.68 KB, ESM: 46.10 KB)

### 🔜 Upcoming: Storybook Documentation (Weeks 1-4)
Per `storybook-unified-implementation-spec.md`, Storybook 8.4+ will be implemented to:
- Document all 84+ existing components
- Provide visual regression testing (Chromatic)
- Enable interaction testing (play functions)
- Establish design token synchronization

### 🎯 This Spec: AI-Powered Discovery Layer (Weeks 5-8+)
This system enhances Storybook with intelligent component discovery:
1. Download and locally index Tailwind Plus components via web scraping
2. Create semantic search across 84 existing + Tailwind Plus components
3. Enable natural language queries via vector embeddings
4. Build Storybook addon for AI-powered component suggestions
5. Integrate with MCP for agent-based component management
6. Maintain institutional memory of component usage patterns

## Objective
Enhance the Storybook component platform with AI-powered discovery that:
1. ✅ Leverages existing 84 production-ready components
2. 🔜 Downloads and indexes Tailwind Plus components locally
3. 🔜 Provides semantic search via vector embeddings (Mem0)
4. 🔜 Enables natural language queries in Storybook
5. 🔜 Optimizes retrieval through Redis caching
6. 🔜 Integrates with MCP for agent workflows
7. 🔜 Tracks usage patterns for intelligent suggestions

## Problem Statement
While the Ozean Licht ecosystem now has 84 well-structured, production-ready components with established branding, developers still face discovery challenges:
- **Manual Browsing:** Finding the right component requires browsing Storybook categories
- **No Semantic Search:** Can't query "glass cards with turquoise" or "authentication forms"
- **Tailwind Plus Gap:** Premium Tailwind Plus components only accessible via web (no API token)
- **Missing AI Assistance:** No intelligent suggestions based on context or usage patterns
- **Brand Variants:** Need ability to query brand-specific component variants

The full Tailwind Plus index is ~6MB, making it too large for direct LLM context injection. This system creates an intelligent discovery layer that makes both existing and Tailwind Plus components easily discoverable through natural language.

## Solution Approach
Implement a multi-layer discovery system that combines:
- **Scraping Layer**: Web scraping Tailwind Plus components with tailwindplus-downloader
- **Index Layer**: Local JSON storage with skeleton files for LLM queries
- **Semantic Layer**: Vector embeddings for component understanding (using Mem0 pattern)
- **Token Layer**: Design token system for brand switching
- **Query Layer**: Natural language processing for intuitive search
- **Cache Layer**: Redis for performance optimization
- **MCP Layer**: Agent-based retrieval with progressive disclosure
- **Memory Layer**: Pattern recognition and usage analytics

## Relevant Files

### ✅ Completed Infrastructure to Leverage
- `shared/ui-components/` - **84 production-ready components** (Phases 1-4 complete)
  - `src/ui/` - 47 shadcn/ui primitives
  - `src/catalyst/` - 11 Catalyst components
  - `src/components/` - 7 branded Ozean Licht components
  - `src/compositions/` - 19 composition components
  - `UPGRADE_PLAN.md` - Complete roadmap and status
  - `PHASE-4-COMPLETE.md` - Phase 4 implementation report
- `tools/mcp-gateway/` - MCP service integration platform
- `tools/memory/` - Institutional memory system (Mem0-based)
- `design-system.md` - Ozean Licht design tokens (turquoise #0ec2bc, glass morphism)
- `BRANDING.md` - Brand guidelines (already applied to Tier 2 components)

### 🔜 Storybook Infrastructure (In Progress)
- `.storybook/` - Configuration and setup (Weeks 1-4)
- `shared/ui-components/src/stories/` - Component stories (CSF 3.0)
- `storybook-unified-implementation-spec.md` - 8-week implementation plan

### New Files

#### Core System
- `tools/component-discovery/` - Main discovery system
  - `src/indexer/semantic-indexer.ts` - Vector embedding generator
  - `src/query/natural-language-processor.ts` - NLP query handler
  - `src/cache/redis-manager.ts` - Redis caching layer
  - `src/tokens/design-token-engine.ts` - Token swapping engine
  - `config/embeddings.json` - Embedding configuration

#### MCP Service
- `tools/mcp-services/component-discovery/` - MCP service
  - `server.ts` - MCP server implementation
  - `tools/search.ts` - Natural language search tool
  - `tools/retrieve.ts` - Component retrieval tool
  - `tools/suggest.ts` - Intelligent suggestions

#### Storybook Integration
- `.storybook/addons/component-discovery.ts` - Storybook addon
- `shared/ui-components/src/discovery/` - Discovery UI components

#### Database Schema
- `tools/component-discovery/schema/`
  - `components.sql` - Component metadata table
  - `embeddings.sql` - Vector embeddings table
  - `usage_patterns.sql` - Usage analytics table

## Implementation Phases

**Prerequisites:**
- ✅ Shared UI Components (Phases 1-4) - COMPLETE
- 🔜 Storybook Setup (Phases 1-2, Weeks 1-4) - Must complete first

**Timeline:** Weeks 5-12 (8 weeks total, following Storybook Phases 1-2)

### Phase 1: Foundation & Tailwind Plus Integration (Weeks 5-6)
**Dependencies:** Storybook Phase 2 complete (66+ components documented)

Build the core discovery infrastructure:
- Download and index Tailwind Plus components locally (~6MB → skeleton ~200KB)
- Scan and catalog 84 existing production-ready components
- Create unified component metadata format
- Set up Redis caching infrastructure
- Build hierarchical categorization system

**Key Difference from Original:** We're indexing known, stable components (84), not discovering scattered files (295+). Brand tokens already exist.

### Phase 2: Semantic Search Layer (Weeks 7-8)
**Dependencies:** Component index complete, Mem0 service running

Implement AI-powered semantic search:
- Generate vector embeddings using existing Mem0 infrastructure
- Index all components with semantic descriptions
- Build natural language query processor
- Implement relevance ranking algorithm
- Create query caching strategy

**Integration Point:** Leverage Storybook stories as source of component metadata and usage examples.

### Phase 3: Storybook Addon & UI (Weeks 9-10)
**Dependencies:** Storybook Phases 1-3 complete, semantic search working

Build visual discovery interface:
- Create Storybook addon panel for component discovery
- Implement search UI with brand filter (Ozean Licht/Kids Ascension)
- Add component preview and insertion
- Build intelligent suggestion engine
- Enable context-aware recommendations

**Integration Point:** Addon displays Storybook stories for matched components directly in discovery panel.

### Phase 4: MCP Integration & Analytics (Weeks 11-12)
**Dependencies:** Discovery system functional, MCP Gateway operational

Enable agent-based workflows:
- Build MCP service with search/retrieve/suggest tools
- Implement usage pattern tracking
- Create component co-occurrence analysis
- Build institutional memory integration
- Enable progressive disclosure for AI agents

**Integration Point:** Agents can query components and receive Storybook URLs for human review.

## Step by Step Tasks

### 1. Download Tailwind Plus Components Locally
```bash
# Create Tailwind Plus local repository
mkdir -p shared/ui-components/src/tailwind-plus
cd shared/ui-components

# Download all Tailwind Plus components (requires web credentials)
npx github:richardkmichael/tailwindplus-downloader#latest
# Enter your Tailwind Plus email and password when prompted
# Download takes ~3-4 minutes, creates timestamped JSON file

# Organize downloaded components
mv tailwindplus-*.json src/tailwind-plus/components-full.json

# Create skeleton file for LLM queries (reduces 6MB to ~200KB)
npm install -g jq  # If not already installed
cat src/tailwind-plus/components-full.json | \
  jq 'walk(if type == "object" and has("code") then del(.code) else . end)' \
  > src/tailwind-plus/components-skeleton.json

# Verify download success
ls -lh src/tailwind-plus/
# Should show:
# - components-full.json (~6MB)
# - components-skeleton.json (~200KB)
```
- Authenticate with Tailwind Plus web credentials
- Downloads all UI components in HTML, React, Vue formats
- Supports Tailwind CSS v3 and v4, light/dark/system modes
- Creates skeleton for efficient LLM processing

### 2. Set Up Component Discovery Infrastructure
```bash
# Create project structure
mkdir -p tools/component-discovery/{src,config,schema}
mkdir -p tools/component-discovery/src/{indexer,query,cache,tokens,scraper}
mkdir -p tools/mcp-services/component-discovery

# Initialize Node.js project
cd tools/component-discovery
npm init -y
npm install typescript @types/node tsx
npm install chromadb redis ioredis langchain
npm install tailwindcss @tailwindcss/typography

# For local embeddings (alternative to OpenAI)
npm install @xenova/transformers  # Use local models
```
- Set up TypeScript configuration with strict mode
- Configure ESLint and Prettier for code quality
- Create Docker Compose for Redis and ChromaDB
- Note: Using local embeddings to avoid OpenAI costs

### 3. Build Tailwind Plus Index Processor
```typescript
// tools/component-discovery/src/indexer/tailwind-plus-processor.ts
import { readFileSync } from 'fs';
import path from 'path';

interface TailwindPlusComponent {
  category: string;  // e.g., "Marketing", "E-commerce"
  section: string;
  name: string;
  snippets: Array<{
    code: string;
    language: string;
    mode: 'light' | 'dark' | 'system';
    framework: 'html' | 'react' | 'vue';
    version: 3 | 4;
    preview?: string;
  }>;
}

class TailwindPlusProcessor {
  private componentsPath = 'shared/ui-components/src/tailwind-plus/components-full.json';
  private skeletonPath = 'shared/ui-components/src/tailwind-plus/components-skeleton.json';

  async processComponents(): Promise<ComponentMetadata[]> {
    const rawData = JSON.parse(readFileSync(this.componentsPath, 'utf-8'));
    const processed: ComponentMetadata[] = [];

    for (const component of rawData) {
      // Convert Tailwind Plus format to our ComponentMetadata format
      const metadata: ComponentMetadata = {
        id: `tailwind-plus-${component.category}-${component.name}`.toLowerCase().replace(/\s+/g, '-'),
        name: component.name,
        path: `tailwind-plus/${component.category}/${component.section}/${component.name}`,
        category: this.mapCategory(component.category),
        brand: 'neutral',  // Tailwind Plus components are brand-neutral
        props: this.extractProps(component.snippets),
        dependencies: ['tailwindcss'],
        description: `${component.category} - ${component.section} - ${component.name}`,
        usage_examples: component.snippets.map(s => s.preview || ''),
        design_tokens: this.extractTokens(component.snippets),
        tailwind_classes: this.extractClasses(component.snippets),
        accessibility: { wcag_level: 'AA', tested: false },
        performance: { bundle_size: 0, render_time: 0 },
        source: 'tailwind-plus',
        snippets: component.snippets
      };

      processed.push(metadata);
    }

    return processed;
  }

  private mapCategory(tailwindCategory: string): string {
    // Map Tailwind Plus categories to our system
    const mapping = {
      'Marketing': 'layout',
      'E-commerce': 'data',
      'Application UI': 'ui',
      // Add more mappings as needed
    };
    return mapping[tailwindCategory] || 'ui';
  }

  private extractProps(snippets: any[]): any[] {
    // Extract props from React snippets
    const reactSnippet = snippets.find(s => s.framework === 'react');
    if (!reactSnippet) return [];

    // Simple prop extraction (can be enhanced)
    const propsMatch = reactSnippet.code.match(/interface\s+\w+Props\s*{([^}]+)}/);
    return propsMatch ? this.parseProps(propsMatch[1]) : [];
  }

  private extractClasses(snippets: any[]): string[] {
    // Extract Tailwind classes from code
    const classes = new Set<string>();
    snippets.forEach(snippet => {
      const classMatches = snippet.code.matchAll(/className="([^"]+)"/g);
      for (const match of classMatches) {
        match[1].split(' ').forEach(cls => classes.add(cls));
      }
    });
    return Array.from(classes);
  }
}
```
- Process downloaded Tailwind Plus JSON
- Convert to unified ComponentMetadata format
- Extract props, classes, and tokens
- Map categories to our system

### 4. Build Component Scanner & Indexer
```typescript
// tools/component-discovery/src/indexer/component-scanner.ts
interface ComponentMetadata {
  id: string;
  name: string;
  path: string;
  tier: 'base' | 'brand' | 'composition';  // Three-tier architecture
  category: 'ui' | 'layout' | 'form' | 'data' | 'navigation' | 'feedback';
  brand: 'ozean-licht' | 'kids-ascension' | 'neutral';
  props: PropDefinition[];
  dependencies: string[];
  description: string;
  usage_examples: string[];
  design_tokens: string[];
  tailwind_classes: string[];
  accessibility: AccessibilityMetadata;
  performance: PerformanceMetrics;
  storybook_url?: string;  // Link to Storybook story
}

class ComponentScanner {
  async scanSharedUIComponents(): Promise<ComponentMetadata[]> {
    // Scan shared/ui-components/src/ structure
    const components: ComponentMetadata[] = [];

    // Tier 1: Base layer (58 components)
    components.push(...await this.scanDirectory('shared/ui-components/src/ui'));         // 47 shadcn
    components.push(...await this.scanDirectory('shared/ui-components/src/catalyst'));    // 11 Catalyst

    // Tier 2: Brand layer (7 components)
    components.push(...await this.scanDirectory('shared/ui-components/src/components')); // 7 branded

    // Tier 3: Composition layer (19 components)
    components.push(...await this.scanDirectory('shared/ui-components/src/compositions')); // 19 compositions

    return components; // Total: 84 components
  }

  async scanDirectory(path: string): Promise<ComponentMetadata[]> {
    // Parse TSX/JSX files in known structure
    // Extract component metadata from TypeScript interfaces
    // Read JSDoc comments for descriptions
    // Link to Storybook stories (if available)
  }
}
```
- Scan **84 production-ready components** in organized structure
- Parse Tailwind Plus component library
- Extract props, dependencies, and usage patterns
- Generate component fingerprints for deduplication
- **Key Improvement:** Leverage existing three-tier architecture and TypeScript types

### 5. Implement Semantic Search Using Existing Mem0 Infrastructure
```typescript
// tools/component-discovery/src/indexer/semantic-indexer.ts
// Reuse existing Mem0 handler from tools/mcp-gateway/src/mcp/handlers/mem0.ts
import axios, { AxiosInstance } from 'axios';

class ComponentSemanticIndexer {
  private mem0Client: AxiosInstance;

  constructor() {
    // Connect to existing Mem0 service
    this.mem0Client = axios.create({
      baseURL: process.env.MEM0_API_URL || 'http://localhost:8000',
      headers: { 'Content-Type': 'application/json' }
    });
  }

  async indexComponent(component: ComponentMetadata): Promise<void> {
    // Store component as memory with special metadata
    const description = this.createSemanticDescription(component);

    await this.mem0Client.post('/memory/add', {
      user_id: 'component-index',  // Special user for component storage
      content: description,
      metadata: {
        type: 'component',
        component_id: component.id,
        name: component.name,
        category: component.category,
        brand: component.brand,
        source: component.source || 'custom',
        tailwind_classes: component.tailwind_classes,
        framework: 'react',  // or extract from component
        path: component.path
      }
    });
  }

  async searchComponents(query: string, options?: any): Promise<any[]> {
    // Use Mem0's existing semantic search
    const response = await this.mem0Client.post('/memory/search', {
      query,
      user_id: 'component-index',
      limit: options?.limit || 20,
      threshold: options?.threshold || 0.6
    });

    // Extract component metadata from search results
    return response.data.results.map((result: any) => ({
      component_id: result.metadata.component_id,
      name: result.metadata.name,
      category: result.metadata.category,
      score: result.score,
      content: result.content,
      path: result.metadata.path
    }));
  }

  private createSemanticDescription(component: ComponentMetadata): string {
    return `
      Component: ${component.name}
      Category: ${component.category}
      Description: ${component.description}
      Props: ${component.props.map(p => p.name).join(', ')}
      Styling: ${component.tailwind_classes.join(' ')}
      Tokens: ${component.design_tokens.join(', ')}
      Use Cases: ${component.usage_examples.join('; ')}
    `;
  }
}
```
- Generate embeddings for all components
- Include visual characteristics in embeddings
- Store in vector database (ChromaDB/Pinecone)
- Update embeddings on component changes

### 6. Create Design Token Engine
```typescript
// tools/component-discovery/src/tokens/design-token-engine.ts
interface DesignTokenSet {
  id: string;
  name: 'ozean-licht' | 'kids-ascension';
  tokens: {
    colors: ColorTokens;
    typography: TypographyTokens;
    spacing: SpacingTokens;
    effects: EffectTokens;
  };
  overrides: TokenOverride[];
}

class DesignTokenEngine {
  private tokenSets: Map<string, DesignTokenSet>;

  async loadTokens() {
    // Load Ozean Licht tokens from design-system.md
    this.tokenSets.set('ozean-licht', {
      id: 'ozean-licht',
      name: 'ozean-licht',
      tokens: {
        colors: {
          primary: '#0ec2bc',        // Turquoise
          background: '#0A0F1A',     // Cosmic dark
          card: 'rgba(26, 31, 46, 0.7)', // Glass effect
        },
        typography: {
          heading: 'Cinzel Decorative',
          body: 'Montserrat'
        }
      }
    });

    // Load Kids Ascension tokens
    this.tokenSets.set('kids-ascension', {
      id: 'kids-ascension',
      name: 'kids-ascension',
      tokens: {
        colors: {
          primary: '#FFD700',        // Golden yellow
          background: '#F0F8FF',     // Light sky
          card: 'rgba(255, 255, 255, 0.9)', // Bright cards
        },
        typography: {
          heading: 'Comic Sans MS',  // Kid-friendly
          body: 'Nunito'
        }
      }
    });
  }

  transformComponent(component: string, fromBrand: string, toBrand: string): string {
    // Intelligent token replacement
    // Preserve component logic
    // Swap visual tokens
    return transformedComponent;
  }
}
```
- Define token sets for each brand
- Create inheritance hierarchy
- Build token transformation engine
- Generate brand-specific component variants

### 5. Build Natural Language Query Processor
```typescript
// tools/component-discovery/src/query/natural-language-processor.ts
import { OpenAI } from 'openai';

interface QueryIntent {
  action: 'search' | 'filter' | 'suggest' | 'explain';
  entities: {
    category?: string;
    style?: string[];
    brand?: string;
    features?: string[];
  };
  modifiers: {
    withGlass?: boolean;
    darkMode?: boolean;
    responsive?: boolean;
    accessible?: boolean;
  };
}

class NaturalLanguageProcessor {
  async parseQuery(query: string): Promise<QueryIntent> {
    // Examples:
    // "Show me glass cards with turquoise accents"
    // "Find form components for Kids Ascension"
    // "I need a responsive data table with dark mode"

    const intent = await this.extractIntent(query);
    const entities = await this.extractEntities(query);
    const modifiers = await this.extractModifiers(query);

    return { action: intent, entities, modifiers };
  }

  async searchComponents(intent: QueryIntent): Promise<ComponentResult[]> {
    // Convert intent to vector
    const queryEmbedding = await this.generateQueryEmbedding(intent);

    // Semantic search in ChromaDB
    const results = await this.chroma.query({
      queryEmbeddings: [queryEmbedding],
      nResults: 10,
      where: this.buildWhereClause(intent)
    });

    // Rank by relevance
    return this.rankResults(results, intent);
  }
}
```
- Parse natural language queries
- Extract intent and entities
- Convert to vector embeddings
- Perform semantic similarity search

### 6. Implement Redis Caching Layer
```typescript
// tools/component-discovery/src/cache/redis-manager.ts
import Redis from 'ioredis';

class RedisComponentCache {
  private redis: Redis;
  private readonly TTL = 3600; // 1 hour

  constructor() {
    this.redis = new Redis({
      host: 'localhost',
      port: 6379,
      db: 1 // Component cache DB
    });
  }

  async cacheComponentIndex(components: ComponentMetadata[]) {
    // Cache component metadata
    const pipeline = this.redis.pipeline();

    for (const component of components) {
      const key = `component:${component.id}`;
      pipeline.setex(key, this.TTL, JSON.stringify(component));

      // Cache by category
      pipeline.sadd(`category:${component.category}`, component.id);

      // Cache by brand
      pipeline.sadd(`brand:${component.brand}`, component.id);

      // Cache search terms
      for (const term of this.extractSearchTerms(component)) {
        pipeline.zadd(`search:${term}`, Date.now(), component.id);
      }
    }

    await pipeline.exec();
  }

  async searchCache(query: string): Promise<ComponentMetadata[]> {
    // Check cache first
    const cached = await this.redis.get(`query:${query}`);
    if (cached) return JSON.parse(cached);

    // Perform search
    const results = await this.performSearch(query);

    // Cache results
    await this.redis.setex(`query:${query}`, 300, JSON.stringify(results));

    return results;
  }
}
```
- Cache component metadata in Redis
- Implement query result caching
- Use Redis Sets for categorization
- Implement cache invalidation strategy

### 7. Create MCP Service for Component Discovery
```typescript
// tools/mcp-services/component-discovery/server.ts
import { MCPServer } from '@anthropic/mcp';
import { ComponentDiscovery } from '../../component-discovery';

const server = new MCPServer({
  name: 'component-discovery',
  version: '1.0.0',
  description: 'Intelligent component discovery with natural language'
});

// Search tool
server.tool({
  name: 'search_components',
  description: 'Search components using natural language',
  inputSchema: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Natural language search query' },
      brand: { type: 'string', enum: ['ozean-licht', 'kids-ascension'] },
      limit: { type: 'number', default: 10 }
    }
  },
  async handler(input) {
    const discovery = new ComponentDiscovery();
    const results = await discovery.search(input.query, {
      brand: input.brand,
      limit: input.limit
    });

    // Progressive disclosure
    return {
      summary: `Found ${results.length} components`,
      components: results.map(c => ({
        name: c.name,
        category: c.category,
        match_score: c.score
      })),
      details_available: true
    };
  }
});

// Retrieve tool
server.tool({
  name: 'get_component',
  description: 'Retrieve component with brand-specific tokens',
  inputSchema: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      brand: { type: 'string' },
      include_code: { type: 'boolean', default: false }
    }
  },
  async handler(input) {
    const discovery = new ComponentDiscovery();
    const component = await discovery.getComponent(input.id);

    if (input.brand) {
      component.code = await discovery.applyBrandTokens(
        component.code,
        input.brand
      );
    }

    return component;
  }
});

// Suggest tool
server.tool({
  name: 'suggest_components',
  description: 'Get AI-powered component suggestions',
  inputSchema: {
    type: 'object',
    properties: {
      context: { type: 'string', description: 'Current development context' },
      existing_components: { type: 'array', items: { type: 'string' } }
    }
  },
  async handler(input) {
    const discovery = new ComponentDiscovery();
    const suggestions = await discovery.suggestComponents(input);

    return {
      suggestions: suggestions,
      reasoning: 'Based on your current components and context'
    };
  }
});

server.start();
```
- Create MCP service with search, retrieve, and suggest tools
- Implement progressive disclosure for results
- Support brand-specific component retrieval
- Enable agent-based component discovery

### 8. Build Hierarchical Component Categorization
```typescript
// tools/component-discovery/src/indexer/hierarchy.ts
interface ComponentHierarchy {
  root: CategoryNode;
  brands: Map<string, BrandNode>;
}

interface CategoryNode {
  name: string;
  path: string;
  children: CategoryNode[];
  components: ComponentReference[];
  metadata: {
    description: string;
    usage_guidelines: string;
    best_practices: string[];
  };
}

const COMPONENT_HIERARCHY = {
  'ui': {
    'buttons': ['primary', 'secondary', 'ghost', 'icon'],
    'cards': ['glass', 'solid', 'outlined', 'interactive'],
    'badges': ['status', 'notification', 'label'],
    'inputs': ['text', 'textarea', 'select', 'checkbox', 'radio']
  },
  'layout': {
    'containers': ['section', 'article', 'aside'],
    'grids': ['responsive', 'masonry', 'flex'],
    'spacing': ['stack', 'inline', 'grid']
  },
  'navigation': {
    'menus': ['sidebar', 'navbar', 'breadcrumb'],
    'links': ['nav-link', 'anchor', 'router-link']
  },
  'data': {
    'tables': ['data-table', 'responsive-table', 'sortable-table'],
    'lists': ['ordered', 'unordered', 'definition'],
    'charts': ['bar', 'line', 'pie', 'area']
  },
  'feedback': {
    'alerts': ['success', 'warning', 'error', 'info'],
    'modals': ['dialog', 'confirmation', 'fullscreen'],
    'toasts': ['notification', 'snackbar']
  },
  'tailwind-plus': {
    // Organize Tailwind Plus components
    'premium': ['...components from Tailwind Plus'],
    'templates': ['...page templates'],
    'patterns': ['...design patterns']
  }
};
```
- Create hierarchical categorization system
- Map Tailwind Plus components to categories
- Define relationships between components
- Enable drill-down navigation

### 9. Implement Usage Analytics & Pattern Recognition
```typescript
// tools/component-discovery/src/analytics/usage-tracker.ts
interface UsagePattern {
  component_id: string;
  frequency: number;
  contexts: string[];
  co_occurrences: Map<string, number>;
  performance_metrics: {
    render_time: number;
    bundle_size: number;
    accessibility_score: number;
  };
}

class UsageAnalytics {
  async trackUsage(componentId: string, context: UsageContext) {
    // Log to database
    await this.db.query(`
      INSERT INTO component_usage
      (component_id, timestamp, context, user_id, project)
      VALUES ($1, $2, $3, $4, $5)
    `, [componentId, new Date(), context, userId, project]);

    // Update Redis counters
    await this.redis.zincrby('popular_components', 1, componentId);

    // Track co-occurrences
    for (const otherId of context.otherComponents) {
      await this.redis.zincrby(`cooccur:${componentId}`, 1, otherId);
    }

    // Save to memory system
    if (this.isSignificantPattern(context)) {
      await this.saveToMemory(componentId, context);
    }
  }

  async getRecommendations(currentComponents: string[]): Promise<string[]> {
    // Analyze co-occurrence patterns
    const recommendations = new Set<string>();

    for (const compId of currentComponents) {
      const coOccurrences = await this.redis.zrevrange(
        `cooccur:${compId}`,
        0, 5
      );
      coOccurrences.forEach(id => recommendations.add(id));
    }

    return Array.from(recommendations);
  }
}
```
- Track component usage patterns
- Identify frequent combinations
- Generate intelligent recommendations
- Feed data back to memory system

### 10. Create Storybook Discovery Addon
```typescript
// .storybook/addons/component-discovery.tsx
import React, { useState } from 'react';
import { addons } from '@storybook/addons';
import { AddonPanel } from '@storybook/components';

const ComponentDiscoveryPanel = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('ozean-licht');

  const handleSearch = async () => {
    const response = await fetch('/api/component-discovery/search', {
      method: 'POST',
      body: JSON.stringify({
        query: searchQuery,
        brand: selectedBrand
      })
    });

    const data = await response.json();
    setResults(data.components);
  };

  return (
    <div className="component-discovery-panel">
      <div className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search components naturally..."
          className="glass-input"
        />
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
        >
          <option value="ozean-licht">Ozean Licht</option>
          <option value="kids-ascension">Kids Ascension</option>
        </select>
      </div>

      <div className="results-grid">
        {results.map(component => (
          <ComponentCard
            key={component.id}
            component={component}
            onSelect={() => insertComponent(component)}
          />
        ))}
      </div>
    </div>
  );
};

addons.register('component-discovery', {
  title: 'Component Discovery',
  type: types.PANEL,
  render: ({ active, key }) => (
    <AddonPanel active={active} key={key}>
      <ComponentDiscoveryPanel />
    </AddonPanel>
  ),
});
```
- Create Storybook addon for visual discovery
- Integrate with natural language search
- Support brand switching in UI
- Enable component preview and insertion

### 11. Integrate with Memory System
```bash
# Save component patterns to memory
bash tools/memory/save.sh "Pattern: Glass card components perform best with backdrop-filter: blur(12px) and 70% opacity" --category=pattern

bash tools/memory/save.sh "$(cat <<'EOF'
Category: solution
Component: GlassCard
Problem: Performance issues on mobile devices
Solution: Reduce blur radius to 8px on screens < 768px
Implementation: Use CSS media query or tailwind responsive classes
Files: shared/ui-components/src/components/Card.tsx
EOF
)" --category=solution
```
- Connect to existing Mem0 memory system
- Save component usage patterns
- Store successful component combinations
- Build institutional knowledge base

### 12. Validate Complete System
```bash
# Start all services
docker-compose up -d redis chromadb
cd tools/component-discovery && npm run dev
cd tools/mcp-services/component-discovery && npm start

# Test natural language search
curl -X POST http://localhost:8200/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "glass cards with turquoise for dashboard"}'

# Test brand switching
curl -X POST http://localhost:8200/api/component/button-primary \
  -H "Content-Type: application/json" \
  -d '{"brand": "kids-ascension"}'

# Test MCP integration
mcp-client query component-discovery search_components \
  --query "form components with validation" \
  --brand "ozean-licht"

# Check Redis caching
redis-cli -n 1 keys "component:*" | head -10
redis-cli -n 1 zrevrange popular_components 0 10

# Verify Storybook addon
cd /opt/ozean-licht-ecosystem
pnpm storybook
# Open http://localhost:6006 and test discovery panel
```

## Testing Strategy

### Unit Tests
- Test embedding generation accuracy
- Validate token transformation logic
- Test query parsing and intent extraction
- Verify Redis caching operations

### Integration Tests
- End-to-end natural language search
- Brand switching across component sets
- MCP service communication
- Storybook addon functionality

### Performance Tests
- Measure search latency (target < 100ms with cache)
- Test with 1000+ components
- Validate Redis cache hit rates (> 80%)
- Monitor memory usage under load

### Semantic Accuracy Tests
- Validate search relevance scoring
- Test edge cases in natural language
- Verify brand token application
- Check component categorization accuracy

## Acceptance Criteria

### Core Functionality
- [ ] Index 84 existing production-ready components successfully
- [ ] Download and index Tailwind Plus component library (~6MB → ~200KB skeleton)
- [ ] Generate semantic embeddings for all components (84 + Tailwind Plus)
- [ ] Natural language search returns relevant results ranked by semantic similarity
- [ ] Query existing brand variants (Ozean Licht turquoise vs Kids Ascension themes)
- [ ] Link to Storybook stories for each component

### Performance
- [ ] Search latency < 100ms with Redis cache (< 300ms without cache)
- [ ] Cache hit rate > 80% for common queries
- [ ] System handles 500+ components efficiently (84 existing + Tailwind Plus)
- [ ] Progressive disclosure reduces initial payload by 70%
- [ ] Skeleton file enables fast LLM queries (200KB vs 6MB full index)

### Integration with Storybook
- [ ] Storybook addon accessible from toolbar
- [ ] Search panel displays in Storybook sidebar
- [ ] Clicking result navigates to component story
- [ ] Component metadata syncs with Storybook stories
- [ ] Visual previews use Storybook screenshots

### Integration with MCP & Memory
- [ ] MCP service accessible to agents via tools/mcp-gateway
- [ ] search_components, get_component, suggest_components tools functional
- [ ] Memory system stores usage patterns
- [ ] Institutional memory tracks successful component combinations
- [ ] Agent queries receive progressive disclosure (summary → details)

### User Experience
- [ ] Natural language queries feel intuitive ("glass cards with turquoise")
- [ ] Results ranked by semantic relevance + usage frequency
- [ ] Brand filter works (Ozean Licht / Kids Ascension / Neutral)
- [ ] Tier filter works (Base / Brand / Composition)
- [ ] Component preview available in discovery panel
- [ ] Code snippets copyable from search results

## Validation Commands

```bash
# Verify shared-ui components built successfully
cd shared/ui-components
pnpm build
# Should show: ✅ 0 TypeScript errors, successful build

# Check component count
cd /opt/ozean-licht-ecosystem
find shared/ui-components/src -name "*.tsx" -type f | grep -E "(ui|catalyst|components|compositions)" | wc -l
# Should return 84+

# System health check
curl http://localhost:8200/health
# Should return: { "status": "ok", "components": 84, "tailwind_plus": "indexed" }

# Component count verification
curl http://localhost:8200/api/stats | jq '.total_components'
# Should return 84 (existing) + Tailwind Plus components (~500+)

# Search functionality test - Brand-specific query
curl -X POST http://localhost:8200/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "glass cards with turquoise accents", "brand": "ozean-licht"}'
# Should return Card, GlassCard from Tier 2 + CourseCard, PricingCard from Tier 3

# Search by tier
curl -X POST http://localhost:8200/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "authentication forms", "tier": "composition"}'
# Should return LoginForm, RegisterForm, PasswordResetForm, MagicLinkForm

# Brand variant query (already applied in Tier 2)
curl http://localhost:8200/api/component/button?brand=ozean-licht | jq '.design_tokens.primary'
# Should return: "#0ec2bc" (turquoise)

# Storybook integration test
curl http://localhost:8200/api/component/course-card | jq '.storybook_url'
# Should return: "http://localhost:6006/?path=/story/compositions-cards--course-card"

# MCP service test
mcp-test component-discovery
# Should pass: search_components, get_component, suggest_components

# Redis cache verification
redis-cli -n 1 keys "component:*" | wc -l
# Should return 84+ keys

redis-cli -n 1 zrevrange popular_components 0 10 WITHSCORES
# Should show most-used components with usage counts

# Memory integration test
bash tools/memory/search.sh "glass card components"
# Should return saved component patterns

# Verify Storybook addon
cd /opt/ozean-licht-ecosystem
pnpm storybook
# Open http://localhost:6006
# Check for "Discovery" panel in Storybook sidebar
# Test search: "glass cards with turquoise"
```

## Notes

### Tailwind Plus Integration (Web Scraping Approach)
- NO API TOKEN - using web access only
- Requires Tailwind Plus web credentials (email/password)
- Use tailwindplus-downloader for automated scraping
- Full index is ~6MB, create skeleton for LLM efficiency
- Components stored locally in JSON format
- Session persists between downloads
- Re-download periodically for updates
- Map Tailwind Plus categories to our system

### Vector Database Choices
- ChromaDB for local development (embedded)
- Consider Pinecone/Weaviate for production
- Embedding dimensions: 1536 (OpenAI text-embedding-3-small)
- Update strategy: Re-index on component changes

### Performance Optimization
- Use Redis Streams for real-time updates
- Implement query result pagination
- Consider edge caching with Cloudflare
- Batch embedding generation for efficiency

### Security Considerations
- Sanitize natural language inputs
- Rate limit API endpoints
- Validate brand token transformations
- Secure Redis with ACLs

### Dependencies
```bash
# Tailwind Plus Downloader
npx github:richardkmichael/tailwindplus-downloader#latest
npm install -g jq  # For JSON processing

# Core
npm install typescript tsx @types/node
npm install axios chromadb ioredis langchain

# Existing Mem0 integration (no new OpenAI needed)
# Uses existing tools/mcp-gateway/src/mcp/handlers/mem0.ts

# Parsing
npm install @babel/parser @babel/traverse
npm install typescript-parser react-docgen-typescript

# MCP
npm install @anthropic/mcp

# Tailwind & shadcn
npm install tailwindcss @tailwindcss/typography
npx shadcn@latest init  # For base components

# Development
npm install -D vitest @vitest/ui
npm install -D eslint prettier
```

### Future Enhancements
1. **Visual Search**: Upload mockup, find matching components
2. **AI Component Generation**: Generate new components from descriptions
3. **Component Relationships**: Graph database for component dependencies
4. **Performance Predictions**: ML model for component performance impact
5. **Accessibility Scoring**: Automated WCAG compliance checking
6. **Version Control**: Track component evolution over time
7. **Component Playground**: Live editing with token switching
8. **Export System**: Generate component packages for external use

---

## Correct Implementation Order

This section provides the complete, correct order for implementing all component infrastructure across the Ozean Licht ecosystem, from current state through full AI-powered discovery.

### 📊 Master Timeline Overview (20 Weeks Total)

```
COMPLETED ✅ | IN PROGRESS 🔜 | PLANNED 📋
════════════════════════════════════════════════════════════════════════════

Phase 0 (COMPLETE): Shared UI Components Foundation        [Weeks -8 to 0] ✅
Phase 1 (CURRENT):  Storybook Documentation Platform       [Weeks 1-4]    🔜
Phase 2 (NEXT):     Component Discovery System              [Weeks 5-8]    📋
Phase 3 (FUTURE):   Advanced Discovery & Analytics         [Weeks 9-12]   📋
Phase 4 (FUTURE):   Kids Ascension Theme & Expansion       [Weeks 13-16]  📋
Phase 5 (FUTURE):   Production Optimization & Scale        [Weeks 17-20]  📋
```

---

### Phase 0: Shared UI Components Foundation ✅ COMPLETE

**Status:** ✅ 100% Complete (As of 2025-11-12)
**Duration:** 8 weeks (historical)
**Deliverables:** 84 production-ready components

#### Week -8 to -7: Phase 1 - Catalyst Integration
- ✅ Downloaded Catalyst UI Kit ($250 investment)
- ✅ Integrated 11 premium Catalyst components
- ✅ Applied Ozean Licht branding (turquoise #0ec2bc, glass morphism)
- ✅ Created SidebarLayout, StackedLayout, AuthLayout
- ✅ Built Navbar, Sidebar with brand effects

**Reference:** `shared/ui-components/UPGRADE_PLAN.md` Phase 1

#### Week -6 to -5: Phase 2 - shadcn/ui Base Components
- ✅ Installed all 47 shadcn/ui primitive components
- ✅ Complete Radix UI integration
- ✅ Zero TypeScript compilation errors
- ✅ Full type safety and exports configured

**Reference:** `shared/ui-components/UPGRADE_PLAN.md` Phase 2

#### Week -4 to -3: Phase 3 - Branded Components (SKIPPED - Fast-tracked to Phase 4)
- Note: Phase 3 was deferred; composition layer built first

#### Week -2 to 0: Phase 4 - Composition Components
- ✅ Created 19 composition components
  - 6 Cards (Course, Testimonial, Pricing, Blog, Feature, Stats)
  - 5 Sections (CTA, Hero, Feature, Testimonials, Pricing)
  - 5 Forms (Login, Register, PasswordReset, MagicLink, Contact)
  - 3 Layouts (Dashboard, Marketing, Auth)
- ✅ Full TypeScript with comprehensive interfaces
- ✅ Production build successful (CJS: 50.68 KB, ESM: 46.10 KB)

**Reference:** `shared/ui-components/PHASE-4-COMPLETE.md`

**Current State Summary:**
```
Tier 1 (Base):        58 components (shadcn + Catalyst)
Tier 2 (Brand):        7 components (branded primitives)
Tier 3 (Composition): 19 components (complex patterns)
────────────────────────────────────────────────────────
Total:                84 components ✅ Production-Ready
```

---

### Phase 1: Storybook Documentation Platform 🔜 CURRENT PRIORITY

**Status:** 🔜 Ready to Start
**Duration:** 4 weeks (Weeks 1-4)
**Prerequisite:** ✅ Phase 0 complete (84 components exist)
**Team:** 1-2 frontend developers
**Reference:** `specs/storybook-unified-implementation-spec.md`

#### Week 1: Foundation & Core Setup
**Days 1-2: Installation**
```bash
# Install Storybook 8.4+ with Vite
pnpm add -D @storybook/react-vite@^8.4.0 @storybook/addon-essentials@^8.4.0
npx storybook@latest init --type react --builder vite --skip-install

# Install addons
pnpm add -D @storybook/addon-interactions @storybook/addon-a11y \
  @storybook/addon-vitest @chromatic-com/storybook
```

**Days 3-4: Configuration**
- Configure `.storybook/main.ts` with Vite
- Set up `.storybook/preview.ts` with Ozean Licht theme
- Configure design token preview
- Set up TypeScript path aliases

**Days 5-7: Initial Stories**
- Create 10 foundational stories (CSF 3.0):
  - 5 Shared UI: Button, Card, Badge, Input, Select
  - 5 Admin: Header, DataTable, LoginForm, Modal, Alert

**Deliverable:** ✅ Working Storybook at localhost:6006 with 10 stories

#### Week 2: Testing Infrastructure
**Days 8-10: Interaction Testing**
- Implement play functions for form components
- Add keyboard navigation tests
- Create async validation tests

**Days 11-12: Accessibility Setup**
- Configure axe-core integration
- Run initial a11y audit (< 3 warnings per story)
- Document acceptable warnings

**Days 13-14: Build Optimization**
- Verify build time < 20 seconds
- Configure lazy loading
- Set up production build pipeline

**Deliverable:** ✅ 10+ stories with tests, a11y checks passing

#### Week 3: Complete Component Documentation
**Priority Order:**
1. Shared UI Library (12 components) - Complete coverage
2. Admin Critical Path (20 components) - User flows
3. Admin Secondary (20 components) - Supporting UI
4. Ozean Licht (10 components) - Public-facing

**Each Component Gets:**
- Default story with all props
- 3-5 variant stories (states, sizes, themes)
- Play function for interactive components
- A11y validation passing
- Chromatic parameters configured

**Deliverable:** ✅ 60+ components documented with stories

#### Week 4: Advanced Stories & Documentation
**Play Functions (10 components):**
- LoginForm, DataTable, Modal, Select, DatePicker
- FileUpload, NavigationMenu, Tabs, Accordion, Toast

**MDX Documentation:**
- GETTING_STARTED.mdx
- DESIGN_TOKENS.mdx
- COMPONENT_GUIDELINES.mdx
- MIGRATION_GUIDE.mdx

**Deliverable:** ✅ 66+ stories with comprehensive documentation

**Phase 1 Exit Criteria:**
- [ ] Storybook running at localhost:6006
- [ ] 66+ components documented with CSF 3.0 stories
- [ ] Build time < 20 seconds
- [ ] A11y checks passing (< 3 warnings per story)
- [ ] TypeScript fully configured
- [ ] Component guidelines established

---

### Phase 2: Component Discovery System 📋 NEXT (Weeks 5-8)

**Status:** 📋 Planned (This Spec)
**Duration:** 4 weeks
**Prerequisite:** ✅ Storybook Phases 1-2 complete (66+ stories documented)
**Team:** 1 backend + 1 frontend developer
**Reference:** `specs/intelligent-component-discovery-system.md` (this document)

#### Week 5: Foundation & Tailwind Plus Integration
**Days 1-2: Infrastructure Setup**
```bash
# Create project structure
mkdir -p tools/component-discovery/{src,config,schema}
cd tools/component-discovery
npm init -y

# Install dependencies
npm install typescript tsx chromadb ioredis langchain
npm install @xenova/transformers  # Local embeddings
```

**Days 3-4: Tailwind Plus Download**
```bash
# Download Tailwind Plus components locally
cd shared/ui-components
npx github:richardkmichael/tailwindplus-downloader#latest
# Enter web credentials, wait ~3-4 minutes

# Create skeleton for LLM (6MB → 200KB)
cat tailwindplus-*.json | jq 'walk(...)' > components-skeleton.json
```

**Days 5-7: Component Indexer**
- Build ComponentScanner for 84 existing components
- Build TailwindPlusProcessor for downloaded library
- Create unified ComponentMetadata format
- Set up Redis caching infrastructure

**Deliverable:** ✅ 84 existing + Tailwind Plus components indexed

#### Week 6: Semantic Search Layer
**Days 8-10: Vector Embeddings**
- Integrate with existing Mem0 infrastructure (`tools/mcp-gateway/src/mcp/handlers/mem0.ts`)
- Generate semantic embeddings for all components
- Store in Mem0 with metadata (tier, brand, category)
- Test semantic search accuracy

**Days 11-14: Natural Language Processor**
- Build NLPQueryProcessor for intent extraction
- Implement relevance ranking algorithm
- Create query caching in Redis
- Test queries: "glass cards with turquoise", "authentication forms"

**Deliverable:** ✅ Semantic search working via API (localhost:8200)

#### Week 7: Storybook Addon & UI
**Days 15-17: Addon Development**
```typescript
// .storybook/addons/component-discovery.tsx
// Create search panel for Storybook sidebar
```
- Build Storybook addon panel
- Implement search UI with filters (brand, tier, category)
- Add component preview functionality
- Link results to Storybook stories

**Days 18-21: Intelligent Suggestions**
- Build suggestion engine based on current component
- Implement co-occurrence analysis
- Add context-aware recommendations
- Test suggestion quality

**Deliverable:** ✅ Storybook addon functional, suggestions working

#### Week 8: MCP Integration & Polish
**Days 22-24: MCP Service**
```typescript
// tools/mcp-services/component-discovery/server.ts
// Implement search_components, get_component, suggest_components tools
```
- Build MCP service with 3 tools
- Integrate with tools/mcp-gateway
- Implement progressive disclosure for agents
- Test agent workflows

**Days 25-28: Analytics & Memory**
- Implement usage pattern tracking
- Create component co-occurrence analysis
- Integrate with institutional memory (Mem0)
- Build analytics dashboard

**Deliverable:** ✅ Full discovery system operational

**Phase 2 Exit Criteria:**
- [ ] 84 + Tailwind Plus components indexed
- [ ] Semantic search < 100ms with cache
- [ ] Storybook addon displays in sidebar
- [ ] MCP service accessible to agents
- [ ] Natural language queries work
- [ ] Usage analytics tracking

---

### Phase 3: Advanced Discovery & Analytics 📋 FUTURE (Weeks 9-12)

**Status:** 📋 Planned
**Prerequisite:** Phase 2 complete (discovery system operational)
**Focus:** Visual testing, design tokens, team adoption

#### Week 9-10: Visual Regression Testing
**Reference:** `storybook-unified-implementation-spec.md` Phase 3
- Set up Chromatic visual testing
- Configure TurboSnap (80% cost reduction)
- Implement Vitest addon for smoke tests
- Create automated test pipeline

#### Week 11: Design Token Synchronization
- Set up Figma → Tokens Studio → GitHub pipeline
- Configure Style Dictionary transformation
- Sync tokens to Storybook
- Enable token-based search

#### Week 12: Team Enablement & Documentation
- Create component contribution guide
- Build story template generator
- Conduct team training session
- Deploy to production (storybook.ozean-licht.dev)

**Phase 3 Exit Criteria:**
- [ ] Chromatic visual testing live
- [ ] All stories pass smoke tests
- [ ] Design tokens synchronized
- [ ] Production deployment complete
- [ ] Team trained and onboarded

---

### Phase 4: Kids Ascension Theme & Multi-Brand 📋 FUTURE (Weeks 13-16)

**Status:** 📋 Planned
**Prerequisite:** Phase 3 complete
**Focus:** Second brand theme, token engine expansion

#### Week 13-14: Kids Ascension Design Tokens
**Reference:** `shared/ui-components/UPGRADE_PLAN.md` Phase 6
- Define KA design tokens (bright, playful colors)
- Create theme overrides
- Test all 84 components with KA theme
- Document theme switching

#### Week 15-16: Multi-Brand Discovery
- Extend discovery system for KA brand
- Implement brand-specific search
- Build theme switcher in Storybook
- Test cross-brand component variants

**Phase 4 Exit Criteria:**
- [ ] Kids Ascension theme complete
- [ ] 84 components work in both themes
- [ ] Discovery supports brand filtering
- [ ] Theme switching seamless

---

### Phase 5: Production Optimization & Scale 📋 FUTURE (Weeks 17-20)

**Status:** 📋 Planned
**Prerequisite:** Phase 4 complete
**Focus:** Performance, testing, accessibility

#### Week 17-18: Performance Optimization
- Bundle size analysis (target < 5MB)
- Tree-shaking optimization
- Lazy loading for heavy components
- CDN configuration (Cloudflare)

#### Week 19: Accessibility Audit
- WCAG AA compliance testing
- Automated a11y scoring
- Screen reader testing
- Keyboard navigation audit

#### Week 20: Final Documentation & Handoff
- Complete API documentation
- Create video walkthroughs
- Final team training
- Maintenance schedule

**Phase 5 Exit Criteria:**
- [ ] Bundle size < 5MB
- [ ] WCAG AA compliant (0 violations)
- [ ] Performance optimized
- [ ] Full documentation complete
- [ ] 100% team adoption

---

## 📋 Quick Reference: Implementation Sequence

**For AI Agents and Developers - Copy/Paste Ready:**

```bash
# COMPLETED ✅
Phase 0.1: Catalyst Integration (Week -8 to -7) ✅
Phase 0.2: shadcn/ui Base (Week -6 to -5) ✅
Phase 0.3: Compositions (Week -2 to 0) ✅
# Status: 84 production-ready components

# CURRENT PRIORITY 🔜 START HERE
Phase 1.1: Storybook Setup (Week 1) 🔜
  → Install Storybook 8.4+ with Vite
  → Configure with Ozean Licht theme
  → Create 10 initial stories

Phase 1.2: Testing Infrastructure (Week 2) 🔜
  → Add play functions
  → Set up a11y testing
  → Optimize build (<20s)

Phase 1.3: Component Documentation (Week 3) 🔜
  → Document all 84 components
  → Create variant stories
  → Write MDX documentation

Phase 1.4: Advanced Stories (Week 4) 🔜
  → 10 play functions
  → Component guidelines
  → Migration guide

# WAIT FOR STORYBOOK PHASE 1-2 ⏸️
# Do not start Phase 2 until Storybook has 66+ documented stories

# NEXT AFTER STORYBOOK 📋
Phase 2.1: Discovery Foundation (Week 5) 📋
  → Download Tailwind Plus (~3-4 min)
  → Index 84 existing components
  → Set up Redis cache

Phase 2.2: Semantic Search (Week 6) 📋
  → Generate embeddings (Mem0)
  → Build NLP query processor
  → Test natural language search

Phase 2.3: Storybook Addon (Week 7) 📋
  → Build discovery panel
  → Link to Storybook stories
  → Implement suggestions

Phase 2.4: MCP Integration (Week 8) 📋
  → Build MCP service
  → Agent tool integration
  → Usage analytics

# FUTURE PHASES 📋
Phase 3: Visual Testing & Tokens (Weeks 9-12) 📋
Phase 4: Kids Ascension Theme (Weeks 13-16) 📋
Phase 5: Production Optimization (Weeks 17-20) 📋
```

---

## 🎯 Critical Success Factors

### Do This ✅
1. **Follow the sequence** - Each phase depends on the previous
2. **Complete Phase 0 checklist** - Verify 84 components exist before starting Storybook
3. **Wait for Storybook** - Don't start discovery until 66+ stories documented
4. **Leverage existing work** - Use three-tier architecture, don't rebuild
5. **Test incrementally** - Validate each week's deliverables
6. **Reference specs** - Use UPGRADE_PLAN.md and PHASE-4-COMPLETE.md as truth

### Don't Do This ❌
1. **Skip prerequisites** - Discovery without Storybook = wasted effort
2. **Rebuild components** - 84 production-ready components already exist
3. **Ignore brand tokens** - Ozean Licht brand already established (#0ec2bc)
4. **Start phases in parallel** - Dependencies will break
5. **Assume 295+ components** - Actual count is 84 organized components
6. **Build from scratch** - Leverage Mem0, MCP Gateway, existing tools

---

## 📞 Support & Questions

**Primary References:**
1. `shared/ui-components/UPGRADE_PLAN.md` - Component library roadmap
2. `shared/ui-components/PHASE-4-COMPLETE.md` - Current state report
3. `specs/storybook-unified-implementation-spec.md` - Storybook plan (Phase 1)
4. `specs/intelligent-component-discovery-system.md` - This document (Phase 2)
5. `specs/ozean-licht-brand-preservation-storybook-implementation.md` - Brand preservation

**Questions to Ask Before Starting Each Phase:**
- [ ] Is the previous phase 100% complete?
- [ ] Do all exit criteria pass for the previous phase?
- [ ] Are the prerequisite systems operational?
- [ ] Has the team been briefed on this phase's objectives?
- [ ] Do we have the required developer resources?

**Contact:** AI Agents + Ozean Licht Platform Team

---

**Document Version:** 2.0 - Aligned with Current State
**Last Updated:** 2025-11-12
**Next Review:** After Storybook Phase 1 completion
**Owner:** Platform Team