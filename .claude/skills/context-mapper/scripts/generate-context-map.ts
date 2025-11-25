#!/usr/bin/env npx tsx
/**
 * Context Map Generator v3 - "Merge Sort" Architecture
 *
 * Divide: Specialized extractors for each data type
 * Conquer: Deep analysis within each domain
 * Merge: Combine all extractions into rich README
 * Enrich: Markers for agent enhancement
 *
 * Usage: npx tsx generate-context-map.ts <directory> [--no-enrich]
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, extname, basename, resolve, dirname, relative } from "node:path";

// ============================================================================
// Types
// ============================================================================

interface PackageData {
  name: string;
  description: string;
  version: string;
  scripts: Record<string, string>;
  dependencies: string[];
  devDependencies: string[];
  main?: string;
  type?: string;
}

interface EnvVar {
  name: string;
  file: string;
  line: number;
  hasDefault: boolean;
  defaultValue?: string;
}

interface Route {
  method: string;
  path: string;
  handler: string;
  file: string;
}

interface FileGravity {
  path: string;
  relativePath: string;
  gravity: number;
  importedBy: string[];
  purpose: string;
}

interface DirComplexity {
  name: string;
  path: string;
  fileCount: number;
  depth: number;
  needsMap: boolean;
  reason: string;
}

interface ExistingDocs {
  path: string;
  title: string;
  type: "guide" | "api" | "readme" | "other";
}

interface Extraction {
  package: PackageData | null;
  envVars: EnvVar[];
  routes: Route[];
  gravity: FileGravity[];
  complexity: DirComplexity[];
  docs: ExistingDocs[];
  entryPoint: string | null;
  port: number | null;
  framework: string | null;
}

// ============================================================================
// Configuration
// ============================================================================

const SKIP_DIRS = new Set([
  "node_modules", ".git", "dist", "build", "__pycache__",
  ".next", ".quarantine", "coverage", ".turbo", ".cache",
  ".vercel", ".output", "out"
]);

const CODE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx"]);

// ============================================================================
// DIVIDE: Specialized Extractors
// ============================================================================

/**
 * Extract package.json data
 */
function extractPackage(dir: string): PackageData | null {
  const pkgPath = join(dir, "package.json");
  if (!existsSync(pkgPath)) return null;

  try {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    return {
      name: pkg.name || basename(dir),
      description: pkg.description || "",
      version: pkg.version || "0.0.0",
      scripts: pkg.scripts || {},
      dependencies: Object.keys(pkg.dependencies || {}),
      devDependencies: Object.keys(pkg.devDependencies || {}),
      main: pkg.main,
      type: pkg.type,
    };
  } catch {
    return null;
  }
}

/**
 * Extract environment variable references from code
 */
function extractEnvVars(dir: string): EnvVar[] {
  const envVars: EnvVar[] = [];
  const seen = new Set<string>();

  function scanFile(filePath: string) {
    try {
      const content = readFileSync(filePath, "utf-8");
      const lines = content.split("\n");

      lines.forEach((line, idx) => {
        // Match process.env.VAR_NAME or process.env['VAR_NAME'] or process.env["VAR_NAME"]
        const patterns = [
          /process\.env\.([A-Z_][A-Z0-9_]*)/g,
          /process\.env\[['"]([A-Z_][A-Z0-9_]*)['"]\]/g,
          // Also match env.VAR from destructured imports
          /env\.([A-Z_][A-Z0-9_]*)/g,
        ];

        for (const pattern of patterns) {
          let match;
          while ((match = pattern.exec(line)) !== null) {
            const varName = match[1];
            if (!seen.has(varName)) {
              seen.add(varName);

              // Check for default value patterns
              const hasDefault = line.includes("||") || line.includes("??") || line.includes(":");
              let defaultValue: string | undefined;

              // Try to extract default value
              const defaultMatch = line.match(new RegExp(`${varName}['"\\]]*\\s*(?:\\|\\||\\?\\?)\\s*['"]?([^'",;\\)]+)['"]?`));
              if (defaultMatch) {
                defaultValue = defaultMatch[1].trim();
              }

              envVars.push({
                name: varName,
                file: relative(dir, filePath),
                line: idx + 1,
                hasDefault,
                defaultValue,
              });
            }
          }
        }
      });
    } catch {}
  }

  function walkDir(d: string) {
    try {
      const entries = readdirSync(d, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.name.startsWith(".") || SKIP_DIRS.has(entry.name)) continue;
        const fullPath = join(d, entry.name);
        if (entry.isDirectory()) {
          walkDir(fullPath);
        } else if (CODE_EXTENSIONS.has(extname(entry.name))) {
          scanFile(fullPath);
        }
      }
    } catch {}
  }

  walkDir(dir);

  // Also check .env.example if it exists
  const envExample = join(dir, ".env.example");
  if (existsSync(envExample)) {
    try {
      const content = readFileSync(envExample, "utf-8");
      content.split("\n").forEach((line, idx) => {
        const match = line.match(/^([A-Z_][A-Z0-9_]*)=/);
        if (match && !seen.has(match[1])) {
          seen.add(match[1]);
          envVars.push({
            name: match[1],
            file: ".env.example",
            line: idx + 1,
            hasDefault: true,
            defaultValue: line.split("=")[1]?.trim(),
          });
        }
      });
    } catch {}
  }

  return envVars.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Extract API routes from Express/Next.js patterns
 */
function extractRoutes(dir: string): Route[] {
  const routes: Route[] = [];

  function scanFile(filePath: string) {
    try {
      const content = readFileSync(filePath, "utf-8");
      const relPath = relative(dir, filePath);

      // Express patterns: app.get('/path', ...) or router.post('/path', ...)
      const expressPatterns = [
        /(?:app|router)\.(get|post|put|delete|patch|use)\s*\(\s*['"`]([^'"`]+)['"`]/gi,
      ];

      for (const pattern of expressPatterns) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          routes.push({
            method: match[1].toUpperCase(),
            path: match[2],
            handler: relPath,
            file: relPath,
          });
        }
      }

      // Next.js App Router: export async function GET/POST/etc
      const nextPatterns = /export\s+(?:async\s+)?function\s+(GET|POST|PUT|DELETE|PATCH)\s*\(/gi;
      let nextMatch;
      while ((nextMatch = nextPatterns.exec(content)) !== null) {
        // Derive path from file location (app/api/xxx/route.ts -> /api/xxx)
        const pathMatch = relPath.match(/app(.*)\/route\.(ts|js)/);
        if (pathMatch) {
          routes.push({
            method: nextMatch[1].toUpperCase(),
            path: pathMatch[1] || "/",
            handler: nextMatch[1],
            file: relPath,
          });
        }
      }
    } catch {}
  }

  function walkDir(d: string) {
    try {
      const entries = readdirSync(d, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.name.startsWith(".") || SKIP_DIRS.has(entry.name)) continue;
        const fullPath = join(d, entry.name);
        if (entry.isDirectory()) {
          walkDir(fullPath);
        } else if (CODE_EXTENSIONS.has(extname(entry.name))) {
          scanFile(fullPath);
        }
      }
    } catch {}
  }

  walkDir(dir);
  return routes;
}

/**
 * Calculate file gravity (import analysis)
 */
function extractGravity(dir: string): FileGravity[] {
  const allFiles: string[] = [];
  const importMap = new Map<string, string[]>();

  function collectFiles(d: string, depth = 0) {
    if (depth > 10) return;
    try {
      const entries = readdirSync(d, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.name.startsWith(".") || SKIP_DIRS.has(entry.name)) continue;
        const fullPath = join(d, entry.name);
        if (entry.isDirectory()) {
          collectFiles(fullPath, depth + 1);
        } else if (CODE_EXTENSIONS.has(extname(entry.name))) {
          allFiles.push(fullPath);
          importMap.set(fullPath, []);
        }
      }
    } catch {}
  }

  collectFiles(dir);

  // Analyze imports
  for (const filePath of allFiles) {
    try {
      const content = readFileSync(filePath, "utf-8");
      const importRegex = /(?:import|from)\s+['"]([^'"]+)['"]/g;
      let match;

      while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1];
        if (importPath.startsWith(".")) {
          const resolved = resolve(dirname(filePath), importPath);
          for (const ext of ["", ".ts", ".tsx", ".js", ".jsx", "/index.ts", "/index.tsx", "/index.js"]) {
            const candidate = resolved + ext;
            if (importMap.has(candidate)) {
              importMap.get(candidate)!.push(filePath);
              break;
            }
          }
        }
      }
    } catch {}
  }

  // Build gravity list
  const gravityList: FileGravity[] = [];
  for (const [file, importedBy] of importMap) {
    const gravity = importedBy.length;
    if (gravity > 0) {
      gravityList.push({
        path: file,
        relativePath: relative(dir, file),
        gravity,
        importedBy: importedBy.map(f => relative(dir, f)),
        purpose: inferPurpose(file),
      });
    }
  }

  return gravityList.sort((a, b) => b.gravity - a.gravity);
}

/**
 * Infer file purpose from name and content
 */
function inferPurpose(filePath: string): string {
  const name = basename(filePath).toLowerCase();
  const content = (() => {
    try { return readFileSync(filePath, "utf-8"); } catch { return ""; }
  })();

  // Check content patterns first (more specific)
  if (content.includes("express()") || content.includes("createServer")) return "Server initialization";
  if (content.includes("NextAuth") || content.includes("getServerSession")) return "NextAuth configuration";
  if (content.includes("z.object") || content.includes("z.string")) return "Zod validation schema";
  if (content.includes("PrismaClient")) return "Prisma database client";
  if (content.includes("createContext") && content.includes("Provider")) return "React context provider";

  // Fall back to name patterns
  if (name.includes("error")) return "Error handling utilities";
  if (name.includes("type")) return "TypeScript type definitions";
  if (name.includes("config") || name.includes("env")) return "Configuration management";
  if (name.includes("logger") || name.includes("log")) return "Logging utilities";
  if (name.includes("auth")) return "Authentication logic";
  if (name.includes("middleware")) return "Middleware functions";
  if (name.includes("route")) return "Route handlers";
  if (name.includes("util") || name.includes("helper")) return "Utility functions";
  if (name.includes("hook")) return "React hooks";
  if (name.includes("context")) return "React context";
  if (name.includes("client")) return "Client implementation";
  if (name.includes("server")) return "Server-side logic";
  if (name.includes("index")) return "Module exports";
  if (name.includes("metric")) return "Metrics collection";
  if (name.includes("health")) return "Health check endpoints";

  return "";
}

/**
 * Analyze directory complexity for "Needs Deeper Mapping"
 */
function extractComplexity(dir: string): DirComplexity[] {
  const result: DirComplexity[] = [];

  function countFiles(d: string, depth = 0): { count: number; maxDepth: number } {
    if (depth > 10) return { count: 0, maxDepth: depth };
    let count = 0;
    let maxDepth = depth;

    try {
      const entries = readdirSync(d, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.name.startsWith(".") || SKIP_DIRS.has(entry.name)) continue;
        const fullPath = join(d, entry.name);
        if (entry.isDirectory()) {
          const sub = countFiles(fullPath, depth + 1);
          count += sub.count;
          maxDepth = Math.max(maxDepth, sub.maxDepth);
        } else if (CODE_EXTENSIONS.has(extname(entry.name))) {
          count++;
        }
      }
    } catch {}

    return { count, maxDepth };
  }

  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory() || entry.name.startsWith(".") || SKIP_DIRS.has(entry.name)) continue;

      const fullPath = join(dir, entry.name);
      const { count, maxDepth } = countFiles(fullPath);

      const needsMap = count > 8 || maxDepth > 2;
      const reasons: string[] = [];
      if (count > 8) reasons.push(`${count} files`);
      if (maxDepth > 2) reasons.push(`${maxDepth} levels deep`);

      result.push({
        name: entry.name,
        path: entry.name,
        fileCount: count,
        depth: maxDepth,
        needsMap,
        reason: reasons.join(", ") || "small",
      });
    }
  } catch {}

  return result.sort((a, b) => b.fileCount - a.fileCount);
}

/**
 * Find existing documentation
 */
function extractDocs(dir: string): ExistingDocs[] {
  const docs: ExistingDocs[] = [];

  function scanDir(d: string, depth = 0) {
    if (depth > 2) return;
    try {
      const entries = readdirSync(d, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.name.startsWith(".") || SKIP_DIRS.has(entry.name)) continue;

        const fullPath = join(d, entry.name);
        if (entry.isDirectory() && (entry.name === "docs" || entry.name === "documentation")) {
          scanDir(fullPath, depth + 1);
        } else if (entry.name.endsWith(".md") && entry.name !== "README.md") {
          const relPath = relative(dir, fullPath);
          let type: ExistingDocs["type"] = "other";
          const nameLower = entry.name.toLowerCase();

          if (nameLower.includes("guide") || nameLower.includes("tutorial")) type = "guide";
          else if (nameLower.includes("api")) type = "api";

          // Try to extract title from first heading
          let title = entry.name.replace(".md", "");
          try {
            const content = readFileSync(fullPath, "utf-8");
            const titleMatch = content.match(/^#\s+(.+)$/m);
            if (titleMatch) title = titleMatch[1];
          } catch {}

          docs.push({ path: relPath, title, type });
        }
      }
    } catch {}
  }

  scanDir(dir);
  return docs;
}

/**
 * Detect entry point and port
 */
function extractEntryAndPort(dir: string, pkg: PackageData | null): { entry: string | null; port: number | null; framework: string | null } {
  let entry: string | null = null;
  let port: number | null = null;
  let framework: string | null = null;

  // Check package.json main/scripts
  if (pkg) {
    if (pkg.main) entry = pkg.main;
    if (pkg.scripts.dev) {
      // Extract port from dev script if present
      const portMatch = pkg.scripts.dev.match(/(?:PORT|port)[=\s]+(\d+)/);
      if (portMatch) port = parseInt(portMatch[1]);
    }

    // Detect framework
    if (pkg.dependencies.includes("next") || pkg.devDependencies.includes("next")) {
      framework = "Next.js";
    } else if (pkg.dependencies.includes("express")) {
      framework = "Express";
    } else if (pkg.dependencies.includes("fastify")) {
      framework = "Fastify";
    } else if (pkg.dependencies.includes("hono")) {
      framework = "Hono";
    }
  }

  // Scan for common entry points
  const entryPoints = ["src/server.ts", "src/index.ts", "src/main.ts", "server.ts", "index.ts", "app.ts"];
  for (const ep of entryPoints) {
    const fullPath = join(dir, ep);
    if (existsSync(fullPath)) {
      if (!entry) entry = ep;

      // Try to extract port from file
      try {
        const content = readFileSync(fullPath, "utf-8");
        const portMatch = content.match(/(?:listen|PORT)[(\s:=]+(\d{4})/);
        if (portMatch && !port) port = parseInt(portMatch[1]);
      } catch {}
    }
  }

  return { entry, port, framework };
}

// ============================================================================
// CONQUER: Run All Extractors
// ============================================================================

function runExtraction(dir: string): Extraction {
  const pkg = extractPackage(dir);
  const { entry, port, framework } = extractEntryAndPort(dir, pkg);

  return {
    package: pkg,
    envVars: extractEnvVars(dir),
    routes: extractRoutes(dir),
    gravity: extractGravity(dir),
    complexity: extractComplexity(dir),
    docs: extractDocs(dir),
    entryPoint: entry,
    port,
    framework,
  };
}

// ============================================================================
// MERGE: Combine Into README
// ============================================================================

function mergeToReadme(dir: string, ext: Extraction, includeEnrich: boolean): string {
  const lines: string[] = [];
  const dirName = basename(dir);
  const timestamp = new Date().toISOString().slice(0, 10);

  // ── Title & Description ──
  const title = ext.package?.name || dirName;
  const description = ext.package?.description || `${dirName} - add description`;

  lines.push(`# ${title}`);
  lines.push("");
  lines.push(`> ${description}`);
  lines.push("");

  // ── Quick Start ──
  lines.push("## Quick Start");
  lines.push("");
  lines.push("```bash");

  if (ext.package?.scripts) {
    const scripts = ext.package.scripts;
    if (scripts.install || existsSync(join(dir, "package.json"))) {
      lines.push("npm install");
    }
    if (scripts.dev) {
      const devComment = ext.port ? ` # Port ${ext.port}` : "";
      lines.push(`npm run dev${devComment}`);
    }
    if (scripts.build) {
      lines.push("npm run build");
    }
    if (scripts.start && scripts.start !== scripts.dev) {
      lines.push("npm start");
    }
    if (scripts.test) {
      lines.push("npm test");
    }
  } else {
    lines.push("# No package.json found");
  }

  lines.push("```");
  lines.push("");

  // ── Environment Variables ──
  if (ext.envVars.length > 0) {
    lines.push("## Environment Variables");
    lines.push("");
    lines.push("| Variable | Required | Default | Source |");
    lines.push("|----------|----------|---------|--------|");

    for (const env of ext.envVars.slice(0, 20)) {
      const required = env.hasDefault ? "No" : "Yes";
      const defaultVal = env.defaultValue || "-";
      lines.push(`| \`${env.name}\` | ${required} | ${defaultVal} | \`${env.file}:${env.line}\` |`);
    }

    if (ext.envVars.length > 20) {
      lines.push(`| ... | | | *${ext.envVars.length - 20} more* |`);
    }
    lines.push("");
  }

  // ── API Endpoints ──
  if (ext.routes.length > 0) {
    lines.push("## API Endpoints");
    lines.push("");
    lines.push("| Method | Path | Handler |");
    lines.push("|--------|------|---------|");

    for (const route of ext.routes.slice(0, 25)) {
      lines.push(`| ${route.method} | \`${route.path}\` | \`${route.file}\` |`);
    }

    if (ext.routes.length > 25) {
      lines.push(`| ... | | *${ext.routes.length - 25} more routes* |`);
    }
    lines.push("");
  }

  // ── Structure ──
  lines.push("## Structure");
  lines.push("");
  lines.push("```");
  lines.push(".");

  const dirs = ext.complexity.slice(0, 12);
  for (let i = 0; i < dirs.length; i++) {
    const d = dirs[i];
    const isLast = i === dirs.length - 1 && !ext.entryPoint;
    const prefix = isLast ? "└── " : "├── ";
    const mapLink = d.needsMap ? " [needs map]" : "";
    const purpose = getDirPurpose(d.name);
    lines.push(`${prefix}${d.name}/`.padEnd(20) + `# ${purpose}${mapLink}`);
  }

  if (ext.entryPoint) {
    lines.push(`└── ${ext.entryPoint}`.padEnd(20) + "# Entry point");
  }

  lines.push("```");
  lines.push("");

  // ── Key Files (by Gravity) ──
  if (ext.gravity.length > 0) {
    lines.push("## Key Files");
    lines.push("");
    lines.push("Files ranked by import frequency (gravity):");
    lines.push("");
    lines.push("| File | Imports | Purpose |");
    lines.push("|------|---------|---------|");

    const topFiles = ext.gravity.slice(0, 15);
    for (const file of topFiles) {
      const purpose = file.purpose || (includeEnrich ? "<!-- ENRICH -->" : "-");
      lines.push(`| \`${file.relativePath}\` | ${file.gravity} | ${purpose} |`);
    }
    lines.push("");
  }

  // ── If You Need To... (Tasks) ──
  lines.push("## If You Need To...");
  lines.push("");

  if (includeEnrich) {
    lines.push("<!-- ENRICH: Add 3-5 common tasks based on understanding of the codebase -->");
    lines.push("");
  }

  lines.push("| Task | Start Here | Flow |");
  lines.push("|------|------------|------|");

  // Generate tasks based on framework and structure
  const tasks = generateTasks(ext);
  for (const task of tasks) {
    lines.push(`| ${task.task} | \`${task.start}\` | ${task.flow} |`);
  }
  lines.push("");

  // ── Existing Documentation ──
  if (ext.docs.length > 0) {
    lines.push("## Documentation");
    lines.push("");
    for (const doc of ext.docs) {
      lines.push(`- [${doc.title}](./${doc.path})`);
    }
    lines.push("");
  }

  // ── Needs Deeper Mapping ──
  const needsMap = ext.complexity.filter(d => d.needsMap);
  if (needsMap.length > 0) {
    lines.push("## Needs Deeper Mapping");
    lines.push("");
    lines.push("These directories are complex enough for their own README:");
    lines.push("");
    for (const d of needsMap) {
      lines.push(`- [ ] \`${d.name}/\` — ${d.reason}`);
    }
    lines.push("");
  }

  // ── Footer ──
  lines.push("---");
  lines.push("");
  const mode = includeEnrich ? "hybrid (enrichment markers present)" : "auto";
  const fileCount = ext.gravity.length + ext.complexity.reduce((sum, d) => sum + d.fileCount, 0);
  lines.push(`*Mapped: ${timestamp} | Mode: ${mode} | Files: ~${fileCount}*`);

  return lines.join("\n");
}

/**
 * Get directory purpose from name
 */
function getDirPurpose(name: string): string {
  const purposes: Record<string, string> = {
    src: "Source code",
    lib: "Core libraries",
    app: "Next.js app router",
    api: "API routes",
    components: "UI components",
    hooks: "React hooks",
    utils: "Utilities",
    types: "Type definitions",
    config: "Configuration",
    auth: "Authentication",
    mcp: "MCP handlers",
    tests: "Test suites",
    docs: "Documentation",
    scripts: "Build scripts",
    public: "Static assets",
    monitoring: "Metrics & health",
    middleware: "Middleware",
    routes: "Route handlers",
    services: "Business logic",
    database: "Database layer",
    prisma: "Prisma schema",
  };
  return purposes[name.toLowerCase()] || "...";
}

/**
 * Generate task suggestions based on extraction
 */
function generateTasks(ext: Extraction): Array<{ task: string; start: string; flow: string }> {
  const tasks: Array<{ task: string; start: string; flow: string }> = [];

  // Framework-specific tasks
  if (ext.framework === "Next.js") {
    tasks.push({ task: "Add page", start: "app/", flow: "Create `[route]/page.tsx` → Add to nav" });
    tasks.push({ task: "Add API route", start: "app/api/", flow: "Create `route.ts` → Export handlers" });
  } else if (ext.framework === "Express") {
    if (ext.routes.length > 0) {
      const routeFile = ext.routes[0].file;
      tasks.push({ task: "Add route", start: dirname(routeFile) + "/", flow: "Create handler → Register in router" });
    }
    tasks.push({ task: "Add middleware", start: "src/middleware/", flow: "Create function → Add to app chain" });
  }

  // Structure-based tasks
  const hasComponents = ext.complexity.some(d => d.name === "components");
  if (hasComponents) {
    tasks.push({ task: "Add component", start: "components/", flow: "Create file → Export from index" });
  }

  const hasMcp = ext.complexity.some(d => d.name === "mcp");
  if (hasMcp) {
    tasks.push({ task: "Add MCP handler", start: "mcp/", flow: "Create handler → Register in index" });
  }

  // Generic tasks
  if (ext.envVars.length > 0) {
    const configFile = ext.envVars[0].file;
    tasks.push({ task: "Add env var", start: configFile, flow: "Add to schema → Update `.env.example`" });
  }

  // Default fallback
  if (tasks.length === 0) {
    tasks.push({ task: "Add feature", start: "src/", flow: "Create module → Export → Add tests" });
    tasks.push({ task: "Fix bug", start: "logs/", flow: "Find error → Trace source → Apply fix" });
  }

  return tasks.slice(0, 5);
}

// ============================================================================
// Main
// ============================================================================

const args = process.argv.slice(2);
const directory = args.find(a => !a.startsWith("--"));
const noEnrich = args.includes("--no-enrich");

if (!directory) {
  console.log("Context Map Generator v3 - Merge Sort Architecture");
  console.log("===================================================");
  console.log("");
  console.log("Usage: npx tsx generate-context-map.ts <directory> [--no-enrich]");
  console.log("");
  console.log("Extractors:");
  console.log("  - package.json    → name, scripts, dependencies");
  console.log("  - Code scan       → env vars, routes, ports");
  console.log("  - Import analysis → gravity (file importance)");
  console.log("  - Structure       → complexity, needs-map flags");
  console.log("  - Existing docs   → links to documentation");
  console.log("");
  console.log("Options:");
  console.log("  --no-enrich   Skip <!-- ENRICH --> markers");
  console.log("");
  console.log("Output: README.md with real extracted data");
  process.exit(1);
}

const resolvedDir = resolve(directory);
if (!existsSync(resolvedDir) || !statSync(resolvedDir).isDirectory()) {
  console.error(`Error: ${resolvedDir} is not a directory`);
  process.exit(1);
}

console.log("Extracting...");
const extraction = runExtraction(resolvedDir);

console.log(`  Package: ${extraction.package?.name || "not found"}`);
console.log(`  Env vars: ${extraction.envVars.length}`);
console.log(`  Routes: ${extraction.routes.length}`);
console.log(`  Files with gravity: ${extraction.gravity.length}`);
console.log(`  Directories: ${extraction.complexity.length}`);
console.log(`  Existing docs: ${extraction.docs.length}`);
console.log(`  Entry point: ${extraction.entryPoint || "not found"}`);
console.log(`  Port: ${extraction.port || "not found"}`);
console.log(`  Framework: ${extraction.framework || "unknown"}`);
console.log("");

console.log("Merging...");
const readme = mergeToReadme(resolvedDir, extraction, !noEnrich);

const readmePath = join(resolvedDir, "README.md");
writeFileSync(readmePath, readme);
console.log(`Written: ${readmePath}`);

// Report directories needing maps
const needsMap = extraction.complexity.filter(d => d.needsMap);
if (needsMap.length > 0) {
  console.log("");
  console.log("Directories needing their own maps:");
  for (const d of needsMap) {
    console.log(`  - ${d.name}/ (${d.reason})`);
  }
}
