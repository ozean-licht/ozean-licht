#!/usr/bin/env npx tsx
/**
 * Context Map Generator v2
 *
 * Generates README.md navigation maps for agent consumption.
 * README IS the map - replaces entirely, no merging.
 *
 * Features:
 * - Gravity analysis (import counting)
 * - ASCII tree structure
 * - Task-oriented hot paths
 * - Complexity detection
 *
 * Usage: npx tsx generate-context-map.ts <directory>
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, extname, basename, resolve, relative, dirname } from "node:path";

// ============================================================================
// Configuration
// ============================================================================

const SKIP_DIRS = new Set([
  "node_modules", ".git", "dist", "build", "__pycache__",
  ".next", ".quarantine", "coverage", ".turbo", ".cache",
  ".vercel", ".output", "out"
]);

const CODE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx"]);
const CONFIG_FILES = new Set(["package.json", "tsconfig.json", ".env", ".env.example"]);

// Complexity thresholds
const DEEP_MAP_FILE_THRESHOLD = 10;
const DEEP_MAP_DEPTH_THRESHOLD = 2;

// ============================================================================
// Types
// ============================================================================

interface FileInfo {
  name: string;
  relativePath: string;
  fullPath: string;
  isEntry: boolean;
  purpose: string;
  gravity: number;
  importedBy: string[];
}

interface DirInfo {
  name: string;
  relativePath: string;
  fullPath: string;
  fileCount: number;
  depth: number;
  purpose: string;
  needsDeepMap: boolean;
  reason?: string;
}

interface DirectoryAnalysis {
  name: string;
  essence: string;
  files: FileInfo[];
  dirs: DirInfo[];
  entryPoints: FileInfo[];
  configDir?: string;
  typesDir?: string;
  totalFiles: number;
}

// ============================================================================
// Purpose Inference
// ============================================================================

const FILE_PURPOSE_PATTERNS: Array<{ pattern: RegExp; purpose: string }> = [
  // Entry points
  { pattern: /^index\.(ts|tsx|js|jsx)$/, purpose: "Module entry point and exports" },
  { pattern: /^server\.(ts|js)$/, purpose: "Server entry point" },
  { pattern: /^main\.(ts|js)$/, purpose: "Application entry point" },
  { pattern: /^app\.(ts|tsx)$/, purpose: "App component or entry" },

  // Next.js specific
  { pattern: /^page\.(ts|tsx)$/, purpose: "Next.js page component" },
  { pattern: /^layout\.(ts|tsx)$/, purpose: "Next.js layout component" },
  { pattern: /^route\.(ts|js)$/, purpose: "Next.js API route handler" },
  { pattern: /^middleware\.(ts|js)$/, purpose: "Next.js middleware" },
  { pattern: /^loading\.(ts|tsx)$/, purpose: "Next.js loading state" },
  { pattern: /^error\.(ts|tsx)$/, purpose: "Next.js error boundary" },

  // Common patterns
  { pattern: /config/i, purpose: "Configuration and settings" },
  { pattern: /env/i, purpose: "Environment variables schema" },
  { pattern: /constants?/i, purpose: "Constant values" },
  { pattern: /types?\./, purpose: "TypeScript type definitions" },
  { pattern: /schema/i, purpose: "Data schema definitions" },

  // Auth
  { pattern: /auth/i, purpose: "Authentication logic" },
  { pattern: /jwt/i, purpose: "JWT token handling" },
  { pattern: /session/i, purpose: "Session management" },
  { pattern: /permission/i, purpose: "Permission checking" },

  // Data
  { pattern: /db|database/i, purpose: "Database operations" },
  { pattern: /pool/i, purpose: "Connection pooling" },
  { pattern: /query|queries/i, purpose: "Database queries" },
  { pattern: /adapter/i, purpose: "Data adapter layer" },
  { pattern: /client/i, purpose: "Client implementation" },

  // API
  { pattern: /api/i, purpose: "API handlers" },
  { pattern: /route/i, purpose: "Route definitions" },
  { pattern: /handler/i, purpose: "Request handlers" },
  { pattern: /controller/i, purpose: "Controller logic" },

  // React
  { pattern: /hook/i, purpose: "React hook" },
  { pattern: /context/i, purpose: "React context" },
  { pattern: /provider/i, purpose: "Context provider" },
  { pattern: /component/i, purpose: "React component" },

  // Utilities
  { pattern: /utils?/i, purpose: "Utility functions" },
  { pattern: /helpers?/i, purpose: "Helper functions" },
  { pattern: /logger?/i, purpose: "Logging utilities" },
  { pattern: /error/i, purpose: "Error handling" },
  { pattern: /validation/i, purpose: "Input validation" },
];

const DIR_PURPOSE_MAP: Record<string, string> = {
  "src": "Source code",
  "lib": "Core libraries",
  "app": "Next.js app router",
  "pages": "Next.js pages",
  "api": "API routes",
  "components": "UI components",
  "ui": "UI primitives",
  "hooks": "React hooks",
  "utils": "Utility functions",
  "helpers": "Helper functions",
  "types": "Type definitions",
  "config": "Configuration",
  "auth": "Authentication",
  "services": "Business logic",
  "modules": "Feature modules",
  "contexts": "React contexts",
  "providers": "Context providers",
  "styles": "Stylesheets",
  "assets": "Static assets",
  "public": "Public files",
  "tests": "Test files",
  "specs": "Specifications",
  "docs": "Documentation",
  "scripts": "Build/utility scripts",
  "migrations": "Database migrations",
  "middleware": "Middleware functions",
  "routes": "Route handlers",
  "mcp": "MCP service handlers",
  "health": "Health check endpoints",
  "rbac": "Role-based access control",
  "data-table": "Data table components",
  "dashboard": "Dashboard features",
};

// Task patterns based on directory type
const TASK_PATTERNS: Record<string, Array<{ task: string; start: string; flow: string }>> = {
  "next-app": [
    { task: "Add page", start: "`app/`", flow: "Create `[route]/page.tsx` → Add layout if needed" },
    { task: "Add API route", start: "`app/api/`", flow: "Create `[route]/route.ts` → Export handlers" },
    { task: "Add component", start: "`components/`", flow: "Create component → Export from index" },
  ],
  "express-server": [
    { task: "Add route", start: "`src/routes/`", flow: "Create handler → Register in `index.ts`" },
    { task: "Add middleware", start: "`src/middleware/`", flow: "Create function → Add to chain in `server.ts`" },
    { task: "Update config", start: "`config/`", flow: "Modify schema → Update `.env.example`" },
  ],
  "component-library": [
    { task: "Add component", start: "`src/`", flow: "Create component → Add story → Export from index" },
    { task: "Update theme", start: "`src/theme/`", flow: "Modify tokens → Update components" },
  ],
  "mcp-gateway": [
    { task: "Add MCP service", start: "`src/mcp/`", flow: "Create handler → Add to `catalog.json` → Register route" },
    { task: "Debug request", start: "`src/middleware/`", flow: "Check logs → Trace to handler → Verify external API" },
    { task: "Update auth", start: "`src/auth/`", flow: "Modify validation → Update middleware chain" },
  ],
  "default": [
    { task: "Add feature", start: "`src/`", flow: "Create module → Register in index → Add tests" },
    { task: "Fix bug", start: "logs/errors", flow: "Find error → Trace to source → Apply fix" },
    { task: "Update config", start: "`config/`", flow: "Modify values → Restart if needed" },
  ],
};

// ============================================================================
// Analysis Functions
// ============================================================================

function inferFilePurpose(filename: string, content?: string): string {
  // Check patterns first
  for (const { pattern, purpose } of FILE_PURPOSE_PATTERNS) {
    if (pattern.test(filename)) return purpose;
  }

  // Try to infer from content if available
  if (content) {
    if (content.includes("express()") || content.includes("createServer")) {
      return "Server initialization";
    }
    if (content.includes("NextAuth") || content.includes("getServerSession")) {
      return "NextAuth configuration";
    }
    if (content.includes("createContext") && content.includes("useContext")) {
      return "React context with provider";
    }
    if (content.includes("z.object") || content.includes("z.string")) {
      return "Zod validation schema";
    }
    if (content.includes("prisma") || content.includes("PrismaClient")) {
      return "Prisma database client";
    }
  }

  return ""; // Empty means needs manual description
}

function inferDirPurpose(dirname: string): string {
  return DIR_PURPOSE_MAP[dirname.toLowerCase()] || "";
}

function detectProjectType(dir: string): string {
  const packageJsonPath = join(dir, "package.json");
  if (existsSync(packageJsonPath)) {
    try {
      const pkg = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };

      if (deps["next"]) return "next-app";
      if (deps["express"]) return "express-server";
      if (deps["@storybook/react"]) return "component-library";
    } catch {}
  }

  // Check for MCP gateway patterns
  if (existsSync(join(dir, "src/mcp")) || basename(dir).includes("mcp")) {
    return "mcp-gateway";
  }

  return "default";
}

function calculateGravity(
  file: string,
  allFiles: string[],
  importMap: Map<string, string[]>
): number {
  const importedBy = importMap.get(file) || [];
  return importedBy.length;
}

function buildImportMap(dir: string, files: string[]): Map<string, string[]> {
  const importMap = new Map<string, string[]>();

  // Initialize all files
  for (const file of files) {
    importMap.set(file, []);
  }

  // Analyze imports
  for (const filePath of files) {
    try {
      const content = readFileSync(filePath, "utf-8");
      const importRegex = /(?:import|from)\s+['"]([^'"]+)['"]/g;
      let match;

      while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1];

        // Resolve relative imports
        if (importPath.startsWith(".")) {
          const resolved = resolve(dirname(filePath), importPath);

          // Try to find matching file
          for (const ext of ["", ".ts", ".tsx", ".js", ".jsx", "/index.ts", "/index.tsx"]) {
            const candidate = resolved + ext;
            if (importMap.has(candidate)) {
              const importedBy = importMap.get(candidate) || [];
              importedBy.push(filePath);
              importMap.set(candidate, importedBy);
              break;
            }
          }
        }
      }
    } catch {}
  }

  return importMap;
}

function countCodeFiles(dir: string, depth = 0, maxDepth = 5): number {
  if (depth > maxDepth) return 0;

  let count = 0;
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith(".") || SKIP_DIRS.has(entry.name)) continue;

      if (entry.isDirectory()) {
        count += countCodeFiles(join(dir, entry.name), depth + 1, maxDepth);
      } else if (CODE_EXTENSIONS.has(extname(entry.name))) {
        count++;
      }
    }
  } catch {}
  return count;
}

function getMaxDepth(dir: string, current = 0, maxDepth = 5): number {
  if (current > maxDepth) return current;

  let max = current;
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith(".") && !SKIP_DIRS.has(entry.name)) {
        const subDepth = getMaxDepth(join(dir, entry.name), current + 1, maxDepth);
        max = Math.max(max, subDepth);
      }
    }
  } catch {}
  return max;
}

function collectAllCodeFiles(dir: string, files: string[] = [], depth = 0, maxDepth = 5): string[] {
  if (depth > maxDepth) return files;

  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith(".") || SKIP_DIRS.has(entry.name)) continue;

      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        collectAllCodeFiles(fullPath, files, depth + 1, maxDepth);
      } else if (CODE_EXTENSIONS.has(extname(entry.name))) {
        files.push(fullPath);
      }
    }
  } catch {}
  return files;
}

// ============================================================================
// Directory Analysis
// ============================================================================

function analyzeDirectory(dir: string): DirectoryAnalysis {
  const dirName = basename(dir);
  const allCodeFiles = collectAllCodeFiles(dir);
  const importMap = buildImportMap(dir, allCodeFiles);

  const files: FileInfo[] = [];
  const dirs: DirInfo[] = [];

  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return { name: dirName, essence: "", files: [], dirs: [], entryPoints: [], totalFiles: 0 };
  }

  for (const entry of entries) {
    if (entry.name.startsWith(".") || SKIP_DIRS.has(entry.name)) continue;

    const fullPath = join(dir, entry.name);
    const relativePath = entry.name;

    if (entry.isDirectory()) {
      const fileCount = countCodeFiles(fullPath);
      const depth = getMaxDepth(fullPath);
      const needsDeepMap = fileCount > DEEP_MAP_FILE_THRESHOLD || depth > DEEP_MAP_DEPTH_THRESHOLD;

      let reason: string | undefined;
      if (needsDeepMap) {
        const reasons: string[] = [];
        if (fileCount > DEEP_MAP_FILE_THRESHOLD) reasons.push(`${fileCount} files`);
        if (depth > DEEP_MAP_DEPTH_THRESHOLD) reasons.push(`${depth} levels deep`);
        reason = reasons.join(", ");
      }

      dirs.push({
        name: entry.name,
        relativePath,
        fullPath,
        fileCount,
        depth,
        purpose: inferDirPurpose(entry.name),
        needsDeepMap,
        reason,
      });
    } else if (CODE_EXTENSIONS.has(extname(entry.name))) {
      let content: string | undefined;
      try {
        content = readFileSync(fullPath, "utf-8");
      } catch {}

      const stem = basename(entry.name, extname(entry.name)).toLowerCase();
      const isEntry = ["index", "main", "server", "app", "entry"].includes(stem);
      const gravity = calculateGravity(fullPath, allCodeFiles, importMap);

      files.push({
        name: entry.name,
        relativePath,
        fullPath,
        isEntry,
        purpose: inferFilePurpose(entry.name, content),
        gravity,
        importedBy: importMap.get(fullPath) || [],
      });
    }
  }

  // Sort files by gravity (highest first), then by name
  files.sort((a, b) => {
    if (b.gravity !== a.gravity) return b.gravity - a.gravity;
    if (a.isEntry && !b.isEntry) return -1;
    if (!a.isEntry && b.isEntry) return 1;
    return a.name.localeCompare(b.name);
  });

  // Sort dirs by importance
  const dirOrder = ["src", "app", "lib", "components", "config", "api", "pages", "types"];
  dirs.sort((a, b) => {
    const aIdx = dirOrder.indexOf(a.name.toLowerCase());
    const bIdx = dirOrder.indexOf(b.name.toLowerCase());
    if (aIdx >= 0 && bIdx >= 0) return aIdx - bIdx;
    if (aIdx >= 0) return -1;
    if (bIdx >= 0) return 1;
    return a.name.localeCompare(b.name);
  });

  // Identify special directories
  const configDir = dirs.find(d => d.name.toLowerCase() === "config")?.name;
  const typesDir = dirs.find(d => d.name.toLowerCase() === "types")?.name;

  // Generate essence based on package.json or directory analysis
  let essence = "";
  const packageJsonPath = join(dir, "package.json");
  if (existsSync(packageJsonPath)) {
    try {
      const pkg = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
      if (pkg.description) {
        essence = pkg.description;
      }
    } catch {}
  }

  return {
    name: dirName,
    essence,
    files,
    dirs,
    entryPoints: files.filter(f => f.isEntry),
    configDir,
    typesDir,
    totalFiles: allCodeFiles.length,
  };
}

// ============================================================================
// Output Generation
// ============================================================================

function gravityIndicator(gravity: number): string {
  if (gravity >= 5) return "●●●";
  if (gravity >= 2) return "●●";
  return "●";
}

function generateAsciiTree(analysis: DirectoryAnalysis): string {
  const lines: string[] = ["```", "."];
  const items: Array<{ name: string; purpose: string; isDir: boolean; needsLink?: boolean }> = [];

  // Add directories first
  for (const dir of analysis.dirs.slice(0, 10)) {
    items.push({
      name: dir.name + "/",
      purpose: dir.purpose || "...",
      isDir: true,
      needsLink: dir.needsDeepMap,
    });
  }

  // Add top files (limited)
  for (const file of analysis.files.slice(0, 5)) {
    if (!analysis.dirs.some(d => file.relativePath.startsWith(d.name + "/"))) {
      items.push({
        name: file.name,
        purpose: file.purpose || "...",
        isDir: false,
      });
    }
  }

  // Generate tree lines
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const isLast = i === items.length - 1;
    const prefix = isLast ? "└── " : "├── ";
    const link = item.needsLink ? ` [→](./${item.name})` : "";
    lines.push(`${prefix}${item.name.padEnd(16)} # ${item.purpose}${link}`);
  }

  lines.push("```");
  return lines.join("\n");
}

function generateTaskTable(dir: string): string {
  const projectType = detectProjectType(dir);
  const tasks = TASK_PATTERNS[projectType] || TASK_PATTERNS["default"];

  const lines = [
    "| Task | Start Here | Flow |",
    "|------|------------|------|",
  ];

  for (const task of tasks) {
    lines.push(`| ${task.task} | ${task.start} | ${task.flow} |`);
  }

  return lines.join("\n");
}

function generateContextMap(dir: string): string {
  const analysis = analyzeDirectory(dir);
  const timestamp = new Date().toISOString().slice(0, 10);

  const lines: string[] = [];

  // Title and essence
  lines.push(`# ${analysis.name}`);
  lines.push("");
  lines.push(`> ${analysis.essence || `${analysis.name} - add description`}`);
  lines.push("");

  // Quick Nav
  const entryFile = analysis.entryPoints[0]?.name || analysis.files[0]?.name || "index.ts";
  const configPath = analysis.configDir || "config";
  const typesPath = analysis.typesDir || "types";

  lines.push("## Quick Nav");
  lines.push("");
  lines.push(`**Entry:** \`${entryFile}\` | **Config:** \`${configPath}/\` | **Types:** \`${typesPath}/\``);
  lines.push("");

  // Task-oriented hot paths
  lines.push("## If You Need To...");
  lines.push("");
  lines.push(generateTaskTable(dir));
  lines.push("");

  // ASCII tree structure
  lines.push("## Structure");
  lines.push("");
  lines.push(generateAsciiTree(analysis));
  lines.push("");

  // Key files with gravity
  if (analysis.files.length > 0) {
    lines.push("## Key Files");
    lines.push("");
    lines.push("| File | Purpose | Gravity |");
    lines.push("|------|---------|---------|");

    const keyFiles = analysis.files.slice(0, 12);
    for (const file of keyFiles) {
      const purpose = file.purpose || "_add description_";
      const gravity = gravityIndicator(file.gravity);
      lines.push(`| \`${file.name}\` | ${purpose} | ${gravity} |`);
    }
    lines.push("");
  }

  // Needs deeper mapping
  const needsDeepMap = analysis.dirs.filter(d => d.needsDeepMap);
  if (needsDeepMap.length > 0) {
    lines.push("## Needs Deeper Mapping");
    lines.push("");
    for (const dir of needsDeepMap) {
      lines.push(`- [ ] \`${dir.name}/\` — ${dir.reason}`);
    }
    lines.push("");
  }

  // Footer
  lines.push("---");
  lines.push("");
  lines.push(`*Mapped: ${timestamp} | Files: ${analysis.totalFiles}*`);

  return lines.join("\n");
}

// ============================================================================
// Main
// ============================================================================

const directory = process.argv[2];
if (!directory) {
  console.log("Context Map Generator v2");
  console.log("========================");
  console.log("");
  console.log("Usage: npx tsx generate-context-map.ts <directory>");
  console.log("");
  console.log("Features:");
  console.log("  - Gravity analysis (import counting)");
  console.log("  - ASCII tree structure");
  console.log("  - Task-oriented hot paths");
  console.log("  - Complexity detection");
  console.log("");
  console.log("Output: Replaces README.md entirely (README IS the map)");
  process.exit(1);
}

const resolvedDir = resolve(directory);
if (!existsSync(resolvedDir) || !statSync(resolvedDir).isDirectory()) {
  console.error(`Error: ${resolvedDir} is not a directory`);
  process.exit(1);
}

const contextMap = generateContextMap(resolvedDir);
const readmePath = join(resolvedDir, "README.md");

writeFileSync(readmePath, contextMap);
console.log(`Context map written: ${readmePath}`);

// Report if there are directories needing deeper mapping
const analysis = analyzeDirectory(resolvedDir);
const needsDeepMap = analysis.dirs.filter(d => d.needsDeepMap);
if (needsDeepMap.length > 0) {
  console.log("");
  console.log("Directories needing their own maps:");
  for (const dir of needsDeepMap) {
    console.log(`  - ${dir.name}/ (${dir.reason})`);
  }
}
