#!/usr/bin/env npx tsx
/**
 * Gravity Analyzer
 *
 * Analyzes import relationships to identify high-gravity files
 * (files that many other files depend on).
 *
 * Usage: npx tsx analyze-gravity.ts <directory> [--json] [--top N]
 */

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, extname, basename, resolve, dirname, relative } from "node:path";

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
// Types
// ============================================================================

interface FileGravity {
  path: string;
  relativePath: string;
  gravity: number;
  importedBy: string[];
  imports: string[];
}

interface GravityReport {
  directory: string;
  totalFiles: number;
  analyzed: number;
  highGravity: FileGravity[];  // gravity >= 5
  mediumGravity: FileGravity[]; // gravity 2-4
  lowGravity: FileGravity[];   // gravity 0-1
  orphans: FileGravity[];      // imports nothing, imported by nothing
  hubs: FileGravity[];         // both imports and is imported by many
}

// ============================================================================
// Analysis Functions
// ============================================================================

function collectCodeFiles(dir: string, files: string[] = [], depth = 0, maxDepth = 10): string[] {
  if (depth > maxDepth) return files;

  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith(".") || SKIP_DIRS.has(entry.name)) continue;

      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        collectCodeFiles(fullPath, files, depth + 1, maxDepth);
      } else if (CODE_EXTENSIONS.has(extname(entry.name))) {
        files.push(fullPath);
      }
    }
  } catch {}
  return files;
}

function extractImports(filePath: string): string[] {
  const imports: string[] = [];
  try {
    const content = readFileSync(filePath, "utf-8");
    const importRegex = /(?:import|from)\s+['"]([^'"]+)['"]/g;
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }
  } catch {}
  return imports;
}

function resolveImport(importPath: string, fromFile: string, allFiles: Set<string>): string | null {
  if (!importPath.startsWith(".")) return null; // Skip external modules

  const resolved = resolve(dirname(fromFile), importPath);

  // Try various extensions
  const candidates = [
    resolved,
    resolved + ".ts",
    resolved + ".tsx",
    resolved + ".js",
    resolved + ".jsx",
    join(resolved, "index.ts"),
    join(resolved, "index.tsx"),
    join(resolved, "index.js"),
    join(resolved, "index.jsx"),
  ];

  for (const candidate of candidates) {
    if (allFiles.has(candidate)) {
      return candidate;
    }
  }

  return null;
}

function analyzeGravity(dir: string): GravityReport {
  const allFiles = collectCodeFiles(dir);
  const fileSet = new Set(allFiles);

  // Initialize gravity data for all files
  const gravityMap = new Map<string, FileGravity>();
  for (const file of allFiles) {
    gravityMap.set(file, {
      path: file,
      relativePath: relative(dir, file),
      gravity: 0,
      importedBy: [],
      imports: [],
    });
  }

  // Analyze imports and build graph
  for (const file of allFiles) {
    const imports = extractImports(file);
    const fileGravity = gravityMap.get(file)!;

    for (const importPath of imports) {
      const resolved = resolveImport(importPath, file, fileSet);
      if (resolved && gravityMap.has(resolved)) {
        // Track import relationship
        fileGravity.imports.push(relative(dir, resolved));

        const targetGravity = gravityMap.get(resolved)!;
        targetGravity.importedBy.push(relative(dir, file));
        targetGravity.gravity++;
      }
    }
  }

  // Categorize files
  const files = Array.from(gravityMap.values());
  files.sort((a, b) => b.gravity - a.gravity);

  const highGravity = files.filter(f => f.gravity >= 5);
  const mediumGravity = files.filter(f => f.gravity >= 2 && f.gravity < 5);
  const lowGravity = files.filter(f => f.gravity >= 1 && f.gravity < 2);
  const orphans = files.filter(f => f.gravity === 0 && f.imports.length === 0);
  const hubs = files.filter(f => f.gravity >= 3 && f.imports.length >= 3);

  return {
    directory: dir,
    totalFiles: allFiles.length,
    analyzed: allFiles.length,
    highGravity,
    mediumGravity,
    lowGravity,
    orphans,
    hubs,
  };
}

// ============================================================================
// Output Formatting
// ============================================================================

function formatReport(report: GravityReport, top: number): string {
  const lines: string[] = [];

  lines.push("Gravity Analysis Report");
  lines.push("=======================");
  lines.push("");
  lines.push(`Directory: ${report.directory}`);
  lines.push(`Total files: ${report.totalFiles}`);
  lines.push("");

  // High gravity files
  if (report.highGravity.length > 0) {
    lines.push("HIGH GRAVITY (imported by 5+ files)");
    lines.push("-".repeat(40));
    for (const file of report.highGravity.slice(0, top)) {
      lines.push(`  [${file.gravity}] ${file.relativePath}`);
      if (file.importedBy.length <= 5) {
        for (const importer of file.importedBy) {
          lines.push(`      <- ${importer}`);
        }
      } else {
        for (const importer of file.importedBy.slice(0, 3)) {
          lines.push(`      <- ${importer}`);
        }
        lines.push(`      ... and ${file.importedBy.length - 3} more`);
      }
    }
    lines.push("");
  }

  // Medium gravity files
  if (report.mediumGravity.length > 0) {
    lines.push("MEDIUM GRAVITY (imported by 2-4 files)");
    lines.push("-".repeat(40));
    for (const file of report.mediumGravity.slice(0, top)) {
      lines.push(`  [${file.gravity}] ${file.relativePath}`);
    }
    lines.push("");
  }

  // Hubs (both import and are imported)
  if (report.hubs.length > 0) {
    lines.push("HUBS (high connectivity - both import and are imported)");
    lines.push("-".repeat(40));
    for (const file of report.hubs.slice(0, top)) {
      lines.push(`  ${file.relativePath}`);
      lines.push(`      imports: ${file.imports.length}, imported by: ${file.gravity}`);
    }
    lines.push("");
  }

  // Summary
  lines.push("SUMMARY");
  lines.push("-".repeat(40));
  lines.push(`  High gravity (>=5):  ${report.highGravity.length} files`);
  lines.push(`  Medium gravity (2-4): ${report.mediumGravity.length} files`);
  lines.push(`  Low gravity (1):     ${report.lowGravity.length} files`);
  lines.push(`  Orphans (0):         ${report.orphans.length} files`);
  lines.push(`  Hubs:                ${report.hubs.length} files`);

  return lines.join("\n");
}

function formatJson(report: GravityReport): string {
  return JSON.stringify({
    directory: report.directory,
    totalFiles: report.totalFiles,
    summary: {
      highGravity: report.highGravity.length,
      mediumGravity: report.mediumGravity.length,
      lowGravity: report.lowGravity.length,
      orphans: report.orphans.length,
      hubs: report.hubs.length,
    },
    highGravityFiles: report.highGravity.map(f => ({
      path: f.relativePath,
      gravity: f.gravity,
      importedBy: f.importedBy,
    })),
    hubs: report.hubs.map(f => ({
      path: f.relativePath,
      imports: f.imports.length,
      importedBy: f.gravity,
    })),
  }, null, 2);
}

// ============================================================================
// Main
// ============================================================================

const args = process.argv.slice(2);
const directory = args.find(a => !a.startsWith("--"));
const jsonOutput = args.includes("--json");
const topArg = args.find(a => a.startsWith("--top="));
const top = topArg ? parseInt(topArg.split("=")[1]) : 10;

if (!directory) {
  console.log("Gravity Analyzer");
  console.log("================");
  console.log("");
  console.log("Analyzes import relationships to identify high-gravity files.");
  console.log("");
  console.log("Usage: npx tsx analyze-gravity.ts <directory> [options]");
  console.log("");
  console.log("Options:");
  console.log("  --json       Output as JSON");
  console.log("  --top=N      Show top N files per category (default: 10)");
  console.log("");
  console.log("Gravity levels:");
  console.log("  High   (●●●)  - Imported by 5+ files");
  console.log("  Medium (●●)   - Imported by 2-4 files");
  console.log("  Low    (●)    - Imported by 1 file");
  console.log("  Orphan        - Not imported and imports nothing");
  process.exit(1);
}

const resolvedDir = resolve(directory);
if (!existsSync(resolvedDir) || !statSync(resolvedDir).isDirectory()) {
  console.error(`Error: ${resolvedDir} is not a directory`);
  process.exit(1);
}

const report = analyzeGravity(resolvedDir);

if (jsonOutput) {
  console.log(formatJson(report));
} else {
  console.log(formatReport(report, top));
}
