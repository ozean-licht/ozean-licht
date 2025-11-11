# Plan: Intelligent Multi-Layer Component Discovery System with Local Tailwind Plus Index

## Task Description
Build a sophisticated component discovery system for the Ozean Licht ecosystem that downloads and indexes Tailwind Plus components locally (no API token - web access only), implements design tokens for multiple branding kits (Ozean Licht vs Kids Ascension), and provides AI-powered component retrieval through semantic search, vector embeddings, and intelligent caching. The system will enable natural language queries like "show me glass cards with turquoise accents" or "find all form components that support dark mode" across 295+ custom components plus the entire Tailwind Plus library.

## Objective
Create an intelligent component discovery infrastructure that:
1. Downloads and locally indexes Tailwind Plus components via web scraping
2. Indexes all components (Tailwind Plus + custom) with semantic understanding
3. Enables brand-specific component variants through design tokens
4. Provides natural language search via vector embeddings
5. Optimizes retrieval through Redis caching and progressive disclosure
6. Integrates with MCP for agent-based component management
7. Maintains institutional memory of component usage patterns

## Problem Statement
The Ozean Licht ecosystem has 295+ component files scattered across multiple applications with no intelligent way to discover, search, or retrieve them. Developers struggle to find the right component, leading to duplication and inconsistent implementations. Tailwind Plus components are only accessible via web interface (no API token), requiring us to scrape and locally index them. The full Tailwind Plus index is ~6MB, making it too large for direct LLM context. Additionally, maintaining separate brands (Ozean Licht vs Kids Ascension) requires intelligent token swapping that preserves component logic while changing visual appearance.

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

### Existing Infrastructure to Leverage
- `tools/mcp-gateway/` - MCP service integration platform
- `tools/memory/` - Institutional memory system (Mem0-based)
- `shared/ui-components/` - Current component library
- `design-system.md` - Ozean Licht design tokens
- `BRANDING.md` - Brand guidelines for token mapping

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

### Phase 1: Foundation & Indexing (Week 1-2)
Build the core indexing system that scans all components, generates semantic embeddings, and creates a hierarchical categorization structure. Integrate Tailwind Plus components with proper licensing.

### Phase 2: Intelligence Layer (Week 3-4)
Implement vector embeddings using OpenAI/local models, natural language query processing, and semantic search capabilities. Build the Redis caching layer for performance.

### Phase 3: Multi-Brand Token System (Week 5-6)
Create the design token engine that enables brand switching between Ozean Licht and Kids Ascension. Implement token inheritance and override mechanisms.

### Phase 4: MCP Integration & UI (Week 7-8)
Build the MCP service for agent-based retrieval, create Storybook addon for visual discovery, and implement progressive disclosure patterns.

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
}

class ComponentScanner {
  async scanDirectory(path: string): Promise<ComponentMetadata[]> {
    // Parse TSX/JSX files
    // Extract component metadata
    // Identify Tailwind Plus components
    // Map design token usage
  }
}
```
- Scan all 295+ existing components
- Parse Tailwind Plus component library
- Extract props, dependencies, and usage patterns
- Generate component fingerprints for deduplication

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
- [ ] Index all 295+ existing components successfully
- [ ] Integrate Tailwind Plus component library
- [ ] Generate embeddings for all components
- [ ] Natural language search returns relevant results
- [ ] Brand switching works without breaking components

### Performance
- [ ] Search latency < 100ms with Redis cache
- [ ] Cache hit rate > 80% for common queries
- [ ] System handles 1000+ components efficiently
- [ ] Progressive disclosure reduces initial payload by 70%

### Integration
- [ ] MCP service accessible to agents
- [ ] Storybook addon displays in panel
- [ ] Memory system stores patterns
- [ ] Design tokens apply correctly

### User Experience
- [ ] Natural language queries feel intuitive
- [ ] Results ranked by relevance
- [ ] Brand switching is seamless
- [ ] Component preview available

## Validation Commands

```bash
# System health check
curl http://localhost:8200/health

# Component count verification
curl http://localhost:8200/api/stats | jq '.total_components'
# Should return 295+ (existing) + Tailwind Plus components

# Search functionality test
curl -X POST http://localhost:8200/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "buttons with hover effects"}'
# Should return relevant button components

# Brand token test
curl http://localhost:8200/api/component/button-primary?brand=ozean-licht | grep "#0ec2bc"
# Should contain turquoise color

curl http://localhost:8200/api/component/button-primary?brand=kids-ascension | grep "#FFD700"
# Should contain golden color

# MCP service test
mcp-test component-discovery
# Should pass all tool tests

# Redis cache verification
redis-cli -n 1 info keyspace
# Should show keys in db1

# Memory integration test
bash tools/memory/search.sh "component patterns"
# Should return saved component patterns
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