#!/usr/bin/env npx tsx
/**
 * Organize directory structure for agent navigation.
 * Moves specs, docs, and creates navigation READMEs.
 *
 * Usage:
 *   npx tsx organize.ts <directory>              # Dry-run (show plan)
 *   npx tsx organize.ts <directory> --apply      # Execute changes
 *   npx tsx organize.ts <directory> --apply --map # Execute + regenerate maps
 */

import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  renameSync,
  readdirSync,
  statSync,
} from "node:fs";
import { join, dirname, basename, relative, resolve, extname } from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = resolve(__dirname, "..");

interface MoveAction {
  type: "move";
  from: string;
  to: string;
  reason: string;
}

interface CreateAction {
  type: "create";
  path: string;
  content: string;
  reason: string;
}

interface SkipAction {
  type: "skip";
  path: string;
  reason: string;
}

type Action = MoveAction | CreateAction | SkipAction;

// File classification patterns
const SPEC_PATTERNS = [
  /-spec\.md$/i,
  /-plan\.md$/i,
  /-design\.md$/i,
  /-architecture\.md$/i,
  /-implementation\.md$/i,
  /-requirements\.md$/i,
  /-proposal\.md$/i,
  /-rfc\.md$/i,
  /^spec-/i,
  /^plan-/i,
];

const DOC_PATTERNS = [
  /-guide\.md$/i,
  /-docs\.md$/i,
  /-tutorial\.md$/i,
  /-howto\.md$/i,
  /-reference\.md$/i,
  /^DEPLOYMENT\.md$/i,
  /^CONTRIBUTING\.md$/i,
  /^SETUP\.md$/i,
  /^INSTALLATION\.md$/i,
  /^USAGE\.md$/i,
  /^API\.md$/i,
  /^TROUBLESHOOTING\.md$/i,
];

const REPORT_PATTERNS = [
  /-report\.md$/i,
  /-summary\.md$/i,
  /-review\.md$/i,
  /-analysis\.md$/i,
  /^review_/i,
  /^report_/i,
];

// Files to keep in place (never move)
const KEEP_IN_PLACE = [
  /^README\.md$/i,
  /^CHANGELOG\.md$/i,
  /^LICENSE/i,
  /^CONTEXT-MAP\.md$/i,
  /^\.gitkeep$/,
];

// Directories to skip
const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  ".quarantine",
  "coverage",
  ".turbo",
  ".cache",
  "specs",      // Don't reorganize already-organized dirs
  "docs",
  "reports",
]);

// Important directories that should have READMEs
const IMPORTANT_DIR_PATTERNS = [
  /^lib$/,
  /^src$/,
  /^components$/,
  /^hooks$/,
  /^utils$/,
  /^types$/,
  /^api$/,
  /^app$/,
  /^pages$/,
  /^services$/,
  /^modules$/,
];

function matchesAny(filename: string, patterns: RegExp[]): boolean {
  return patterns.some((p) => p.test(filename));
}

function walkMarkdownFiles(dir: string, files: string[] = [], depth = 0, maxDepth = 4): string[] {
  if (depth > maxDepth) return files;

  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name) && !entry.name.startsWith(".")) {
        walkMarkdownFiles(fullPath, files, depth + 1, maxDepth);
      }
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

function findImportantDirsWithoutReadme(dir: string): string[] {
  const missing: string[] = [];

  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (SKIP_DIRS.has(entry.name) || entry.name.startsWith(".")) continue;

    const fullPath = join(dir, entry.name);
    const readmePath = join(fullPath, "README.md");

    // Check if it's an important directory
    const isImportant = matchesAny(entry.name, IMPORTANT_DIR_PATTERNS);

    // Check if it has code files
    let hasCodeFiles = false;
    try {
      const subEntries = readdirSync(fullPath);
      hasCodeFiles = subEntries.some((f) =>
        [".ts", ".tsx", ".js", ".jsx"].includes(extname(f))
      );
    } catch {
      // Skip if can't read
    }

    if ((isImportant || hasCodeFiles) && !existsSync(readmePath)) {
      missing.push(fullPath);
    }

    // Recurse one level for nested important dirs
    const nestedEntries = readdirSync(fullPath, { withFileTypes: true });
    for (const nested of nestedEntries) {
      if (!nested.isDirectory()) continue;
      if (SKIP_DIRS.has(nested.name) || nested.name.startsWith(".")) continue;

      const nestedPath = join(fullPath, nested.name);
      const nestedReadme = join(nestedPath, "README.md");

      if (matchesAny(nested.name, IMPORTANT_DIR_PATTERNS) && !existsSync(nestedReadme)) {
        missing.push(nestedPath);
      }
    }
  }

  return missing;
}

function generateStubReadme(dirPath: string, rootDir: string): string {
  const dirName = basename(dirPath);
  const relPath = relative(rootDir, dirPath);

  // List files in directory
  const entries = readdirSync(dirPath, { withFileTypes: true });
  const codeFiles = entries
    .filter((e) => e.isFile() && [".ts", ".tsx", ".js", ".jsx"].includes(extname(e.name)))
    .map((e) => e.name)
    .slice(0, 10);

  const subdirs = entries
    .filter((e) => e.isDirectory() && !e.name.startsWith(".") && !SKIP_DIRS.has(e.name))
    .map((e) => e.name);

  let content = `# ${dirName}\n\n`;
  content += `> Part of \`${relPath}\`\n\n`;

  if (codeFiles.length > 0) {
    content += `## Key Files\n\n`;
    content += `| File | Purpose |\n|------|--------|\n`;
    for (const f of codeFiles) {
      const purpose = inferPurpose(f);
      content += `| \`${f}\` | ${purpose} |\n`;
    }
    content += "\n";
  }

  if (subdirs.length > 0) {
    content += `## Subdirectories\n\n`;
    for (const d of subdirs) {
      content += `- [\`${d}/\`](./${d}/)\n`;
    }
    content += "\n";
  }

  content += `---\n\n`;
  content += `*This README was auto-generated by context-mapper. Edit to add context.*\n`;

  return content;
}

function inferPurpose(filename: string): string {
  const stem = basename(filename, extname(filename)).toLowerCase();

  if (stem === "index") return "Entry point / exports";
  if (stem.includes("config")) return "Configuration";
  if (stem.includes("util")) return "Utility functions";
  if (stem.includes("type")) return "Type definitions";
  if (stem.includes("hook")) return "React hook";
  if (stem.includes("context")) return "React context";
  if (stem.includes("provider")) return "Provider component";
  if (stem.includes("client")) return "Client implementation";
  if (stem.includes("server")) return "Server-side logic";
  if (stem.includes("api")) return "API handlers";
  if (stem.includes("route")) return "Route handlers";
  if (stem.includes("middleware")) return "Middleware";
  if (stem.includes("auth")) return "Authentication";
  if (stem.includes("db") || stem.includes("database")) return "Database";
  if (stem.includes("schema")) return "Schema definitions";
  if (stem.includes("validation")) return "Validation logic";
  if (stem.includes("error")) return "Error handling";
  if (stem.includes("constant")) return "Constants";

  return "TODO: Add description";
}

function planActions(directory: string): Action[] {
  const actions: Action[] = [];
  const mdFiles = walkMarkdownFiles(directory);

  // Ensure target directories exist (will be created if needed)
  const specsDir = join(directory, "specs");
  const docsDir = join(directory, "docs");
  const reportsDir = join(directory, "docs", "reports");

  for (const filePath of mdFiles) {
    const filename = basename(filePath);
    const relPath = relative(directory, filePath);
    const parentDir = basename(dirname(filePath));

    // Skip files in already-organized directories
    if (relPath.startsWith("specs/") || relPath.startsWith("docs/") || relPath.startsWith("reports/")) {
      continue;
    }

    // Skip files that should stay in place
    if (matchesAny(filename, KEEP_IN_PLACE)) {
      actions.push({ type: "skip", path: relPath, reason: "Keep in place" });
      continue;
    }

    // Classify and plan move
    if (matchesAny(filename, SPEC_PATTERNS)) {
      const destPath = join(specsDir, filename);
      if (!existsSync(destPath)) {
        actions.push({
          type: "move",
          from: relPath,
          to: relative(directory, destPath),
          reason: "Spec file → specs/",
        });
      }
    } else if (matchesAny(filename, REPORT_PATTERNS)) {
      const destPath = join(reportsDir, filename);
      if (!existsSync(destPath)) {
        actions.push({
          type: "move",
          from: relPath,
          to: relative(directory, destPath),
          reason: "Report → docs/reports/",
        });
      }
    } else if (matchesAny(filename, DOC_PATTERNS)) {
      const destPath = join(docsDir, filename);
      if (!existsSync(destPath)) {
        actions.push({
          type: "move",
          from: relPath,
          to: relative(directory, destPath),
          reason: "Doc file → docs/",
        });
      }
    }
    // Other .md files stay where they are (might be component-specific docs)
  }

  // Find important directories without READMEs
  const dirsNeedingReadme = findImportantDirsWithoutReadme(directory);
  for (const dirPath of dirsNeedingReadme) {
    const readmePath = join(dirPath, "README.md");
    const relPath = relative(directory, readmePath);
    const content = generateStubReadme(dirPath, directory);

    actions.push({
      type: "create",
      path: relPath,
      content,
      reason: "Navigation README for important directory",
    });
  }

  return actions;
}

function executeActions(directory: string, actions: Action[]): { success: number; failed: number } {
  let success = 0;
  let failed = 0;

  for (const action of actions) {
    if (action.type === "skip") continue;

    try {
      if (action.type === "move") {
        const fromPath = join(directory, action.from);
        const toPath = join(directory, action.to);
        const toDir = dirname(toPath);

        // Create target directory if needed
        if (!existsSync(toDir)) {
          mkdirSync(toDir, { recursive: true });
        }

        renameSync(fromPath, toPath);
        console.log(`  MOVED: ${action.from} → ${action.to}`);
        success++;
      } else if (action.type === "create") {
        const filePath = join(directory, action.path);
        const fileDir = dirname(filePath);

        if (!existsSync(fileDir)) {
          mkdirSync(fileDir, { recursive: true });
        }

        writeFileSync(filePath, action.content);
        console.log(`  CREATED: ${action.path}`);
        success++;
      }
    } catch (e) {
      console.error(`  FAILED: ${action.type === "move" ? action.from : action.path} - ${e}`);
      failed++;
    }
  }

  return { success, failed };
}

function runDetectAndMap(directory: string) {
  const detectScript = join(SKILL_ROOT, "scripts/detect-rot.ts");
  const mapScript = join(SKILL_ROOT, "scripts/generate-context-map.ts");

  console.log("\nRegenerating context map...");

  try {
    execSync(`npx tsx "${detectScript}" "${directory}"`, { stdio: "pipe" });
    execSync(`npx tsx "${mapScript}" "${directory}"`, { stdio: "pipe" });
    console.log("  Context map updated in README.md");
  } catch (e) {
    console.error("  Failed to regenerate context map");
  }
}

// Main
const args = process.argv.slice(2);
const directory = args.find((a) => !a.startsWith("--"));
const applyChanges = args.includes("--apply");
const regenerateMap = args.includes("--map");

if (!directory) {
  console.log("Context Mapper - Organize");
  console.log("=========================\n");
  console.log("Usage:");
  console.log("  npx tsx organize.ts <directory>              # Dry-run (show plan)");
  console.log("  npx tsx organize.ts <directory> --apply      # Execute changes");
  console.log("  npx tsx organize.ts <directory> --apply --map # Execute + update maps\n");
  console.log("Actions:");
  console.log("  - Move *-spec.md, *-plan.md → specs/");
  console.log("  - Move *-guide.md, *-docs.md → docs/");
  console.log("  - Move *-report.md → docs/reports/");
  console.log("  - Create README.md in important directories");
  process.exit(1);
}

const resolvedDir = resolve(directory);
if (!existsSync(resolvedDir)) {
  console.error(`Error: ${resolvedDir} does not exist`);
  process.exit(1);
}

console.log("Context Mapper - Organize");
console.log("=========================\n");
console.log(`Directory: ${resolvedDir}`);
console.log(`Mode: ${applyChanges ? "APPLY CHANGES" : "DRY RUN (preview)"}\n`);

const actions = planActions(resolvedDir);

const moves = actions.filter((a) => a.type === "move") as MoveAction[];
const creates = actions.filter((a) => a.type === "create") as CreateAction[];
const skips = actions.filter((a) => a.type === "skip") as SkipAction[];

if (moves.length === 0 && creates.length === 0) {
  console.log("No changes needed. Directory is organized.\n");
  if (regenerateMap) {
    runDetectAndMap(resolvedDir);
  }
  process.exit(0);
}

// Show plan
if (moves.length > 0) {
  console.log(`Files to move (${moves.length}):`);
  for (const m of moves) {
    console.log(`  ${m.from}`);
    console.log(`    → ${m.to} (${m.reason})`);
  }
  console.log();
}

if (creates.length > 0) {
  console.log(`READMEs to create (${creates.length}):`);
  for (const c of creates) {
    console.log(`  ${c.path} (${c.reason})`);
  }
  console.log();
}

// Execute if --apply
if (applyChanges) {
  console.log("Executing...\n");
  const result = executeActions(resolvedDir, actions);
  console.log(`\nDone: ${result.success} changes, ${result.failed} failed`);

  if (regenerateMap) {
    runDetectAndMap(resolvedDir);
  }
} else {
  console.log("---");
  console.log("This is a dry run. Use --apply to execute changes.");
  console.log("Use --apply --map to also regenerate context maps.");
}
