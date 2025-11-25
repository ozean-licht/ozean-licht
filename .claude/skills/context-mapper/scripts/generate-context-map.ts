#!/usr/bin/env npx tsx
/**
 * Generate a navigation-focused context map and merge into README.md.
 * Creates scannable, line-based maps for agent consumption.
 *
 * Usage: npx tsx generate-context-map.ts <directory>
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, extname, basename, resolve } from "node:path";

const MARKER_START = "<!-- CONTEXT-MAP:START - Auto-generated navigation map. Edit the content, keep the markers. -->";
const MARKER_END = "<!-- CONTEXT-MAP:END -->";

const SKIP_DIRS = new Set([
  "node_modules", ".git", "dist", "build", "__pycache__",
  ".next", ".quarantine", "coverage", ".turbo", ".cache"
]);

const CODE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx"]);

// Patterns to identify file purposes
const PURPOSE_PATTERNS: Array<{ pattern: RegExp; purpose: string }> = [
  { pattern: /^index\.(ts|tsx|js|jsx)$/, purpose: "Entry point / exports" },
  { pattern: /^server\.(ts|js)$/, purpose: "Server entry point" },
  { pattern: /^main\.(ts|js)$/, purpose: "Main entry point" },
  { pattern: /^app\.(ts|tsx)$/, purpose: "App entry point" },
  { pattern: /config/i, purpose: "Configuration" },
  { pattern: /middleware/i, purpose: "Request middleware" },
  { pattern: /^route\.(ts|js)$/, purpose: "API route handler" },
  { pattern: /^page\.(ts|tsx)$/, purpose: "Page component" },
  { pattern: /^layout\.(ts|tsx)$/, purpose: "Layout component" },
  { pattern: /types?\./i, purpose: "Type definitions" },
  { pattern: /constants?\./i, purpose: "Constants" },
  { pattern: /utils?\./i, purpose: "Utility functions" },
  { pattern: /helpers?\./i, purpose: "Helper functions" },
  { pattern: /hooks?\./i, purpose: "React hooks" },
  { pattern: /context/i, purpose: "React context" },
  { pattern: /provider/i, purpose: "Context provider" },
  { pattern: /client/i, purpose: "Client implementation" },
  { pattern: /schema/i, purpose: "Schema definitions" },
  { pattern: /adapter/i, purpose: "Adapter layer" },
  { pattern: /auth/i, purpose: "Authentication" },
  { pattern: /db|database/i, purpose: "Database layer" },
  { pattern: /api/i, purpose: "API layer" },
  { pattern: /error/i, purpose: "Error handling" },
  { pattern: /logger?/i, purpose: "Logging" },
];

interface FileInfo {
  name: string;
  path: string;
  isEntry: boolean;
  purpose: string;
}

interface DirInfo {
  name: string;
  path: string;
  hasReadme: boolean;
  fileCount: number;
  description: string;
}

function inferPurpose(filename: string): string {
  for (const { pattern, purpose } of PURPOSE_PATTERNS) {
    if (pattern.test(filename)) return purpose;
  }
  return ""; // Empty = needs manual description
}

function inferDirPurpose(dirname: string): string {
  const lower = dirname.toLowerCase();
  const purposes: Record<string, string> = {
    "lib": "Core libraries",
    "src": "Source code",
    "app": "Next.js app router",
    "pages": "Next.js pages",
    "api": "API routes",
    "components": "UI components",
    "ui": "UI primitives",
    "hooks": "React hooks",
    "utils": "Utilities",
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
  };
  return purposes[lower] || "";
}

function scanDirectory(dir: string): { files: FileInfo[]; dirs: DirInfo[] } {
  const files: FileInfo[] = [];
  const dirs: DirInfo[] = [];

  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return { files, dirs };
  }

  for (const entry of entries) {
    if (entry.name.startsWith(".") || SKIP_DIRS.has(entry.name)) continue;

    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      const hasReadme = existsSync(join(fullPath, "README.md"));
      let fileCount = 0;
      try {
        const subEntries = readdirSync(fullPath);
        fileCount = subEntries.filter(f =>
          CODE_EXTENSIONS.has(extname(f)) || f.endsWith(".md")
        ).length;
      } catch {}

      dirs.push({
        name: entry.name,
        path: entry.name,
        hasReadme,
        fileCount,
        description: inferDirPurpose(entry.name),
      });
    } else if (entry.isFile()) {
      const ext = extname(entry.name);
      if (CODE_EXTENSIONS.has(ext)) {
        const stem = basename(entry.name, ext).toLowerCase();
        const isEntry = ["index", "main", "server", "app", "entry"].includes(stem);

        files.push({
          name: entry.name,
          path: entry.name,
          isEntry,
          purpose: inferPurpose(entry.name),
        });
      }
    }
  }

  // Sort: entries first, then by name
  files.sort((a, b) => {
    if (a.isEntry && !b.isEntry) return -1;
    if (!a.isEntry && b.isEntry) return 1;
    return a.name.localeCompare(b.name);
  });

  // Sort dirs by importance
  const dirOrder = ["src", "app", "lib", "components", "api", "pages"];
  dirs.sort((a, b) => {
    const aIdx = dirOrder.indexOf(a.name.toLowerCase());
    const bIdx = dirOrder.indexOf(b.name.toLowerCase());
    if (aIdx >= 0 && bIdx >= 0) return aIdx - bIdx;
    if (aIdx >= 0) return -1;
    if (bIdx >= 0) return 1;
    return a.name.localeCompare(b.name);
  });

  return { files, dirs };
}

function generateContextMap(directory: string): string {
  const dirName = basename(directory);
  const { files, dirs } = scanDirectory(directory);
  const timestamp = new Date().toISOString().slice(0, 10);

  let content = `${MARKER_START}\n\n`;
  content += `## Navigation\n\n`;
  content += `> Last mapped: ${timestamp}\n\n`;

  // Entry points
  const entries = files.filter(f => f.isEntry);
  if (entries.length > 0) {
    const entryList = entries.map(e => `\`${e.name}\``).join(", ");
    content += `**Start here:** ${entryList}\n\n`;
  }

  // Key files (limit to 15)
  const keyFiles = files.slice(0, 15);
  if (keyFiles.length > 0) {
    content += `### Key Files\n\n`;
    content += `| File | Purpose |\n`;
    content += `|------|--------|\n`;
    for (const f of keyFiles) {
      const purpose = f.purpose || "_add description_";
      const marker = f.isEntry ? " **entry**" : "";
      content += `| \`${f.name}\`${marker} | ${purpose} |\n`;
    }
    content += "\n";
  }

  // Directories with README links
  if (dirs.length > 0) {
    content += `### Directories\n\n`;
    content += `| Directory | Purpose | Navigate |\n`;
    content += `|-----------|---------|----------|\n`;
    for (const d of dirs) {
      const purpose = d.description || "_add description_";
      const link = d.hasReadme ? `[README](./${d.name}/)` : `${d.fileCount} files`;
      content += `| \`${d.name}/\` | ${purpose} | ${link} |\n`;
    }
    content += "\n";
  }

  content += `${MARKER_END}`;

  return content;
}

function mergeIntoReadme(directory: string, contextMap: string): string {
  const readmePath = join(directory, "README.md");

  if (existsSync(readmePath)) {
    let existing = readFileSync(readmePath, "utf-8");

    // Check if markers exist (old or new format)
    if (existing.includes("CONTEXT-MAP:START")) {
      // Replace content between markers
      const pattern = /<!-- CONTEXT-MAP:START[^>]*-->[\s\S]*?<!-- CONTEXT-MAP:END -->/;
      return existing.replace(pattern, contextMap);
    } else {
      // Append with separator
      return existing.trimEnd() + "\n\n---\n\n" + contextMap;
    }
  } else {
    // Create new README
    return `# ${basename(directory)}\n\n${contextMap}`;
  }
}

// Main
const directory = process.argv[2];
if (!directory) {
  console.log("Usage: npx tsx generate-context-map.ts <directory>");
  process.exit(1);
}

const resolvedDir = resolve(directory);
if (!existsSync(resolvedDir) || !statSync(resolvedDir).isDirectory()) {
  console.error(`Error: ${resolvedDir} is not a directory`);
  process.exit(1);
}

const contextMap = generateContextMap(resolvedDir);
const finalContent = mergeIntoReadme(resolvedDir, contextMap);

const readmePath = join(resolvedDir, "README.md");
writeFileSync(readmePath, finalContent);

console.log(`Context map updated: ${readmePath}`);
