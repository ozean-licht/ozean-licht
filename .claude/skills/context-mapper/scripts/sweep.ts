#!/usr/bin/env npx tsx
/**
 * Map all watched directories.
 * Runs generate-context-map on each directory in watched-dirs.json.
 *
 * Usage: npx tsx sweep.ts
 */

import { readFileSync, existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = resolve(__dirname, "..");
const REPO_ROOT = resolve(SKILL_ROOT, "../../..");

interface WatchedDir {
  path: string;
  priority: "high" | "medium" | "low";
  reason?: string;
}

interface Config {
  watched: WatchedDir[];
}

interface MapResult {
  path: string;
  priority: string;
  exists: boolean;
  mapped: boolean;
  error?: string;
}

function loadConfig(): Config {
  const configPath = join(SKILL_ROOT, "watched-dirs.json");
  if (!existsSync(configPath)) {
    console.error("Error: watched-dirs.json not found");
    process.exit(1);
  }
  return JSON.parse(readFileSync(configPath, "utf-8"));
}

function mapDirectory(dirPath: string): boolean {
  const mapScript = join(SKILL_ROOT, "scripts/generate-context-map.ts");
  try {
    execSync(`npx tsx "${mapScript}" "${dirPath}"`, {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"]
    });
    return true;
  } catch {
    return false;
  }
}

function main() {
  const config = loadConfig();
  const results: MapResult[] = [];

  console.log("Context Mapper - Sweep");
  console.log("======================\n");
  console.log(`Mapping ${config.watched.length} directories...\n`);

  for (const dir of config.watched) {
    const fullPath = join(REPO_ROOT, dir.path);
    const result: MapResult = {
      path: dir.path,
      priority: dir.priority,
      exists: existsSync(fullPath),
      mapped: false
    };

    if (!result.exists) {
      result.error = "Not found";
      results.push(result);
      continue;
    }

    result.mapped = mapDirectory(fullPath);
    if (!result.mapped) {
      result.error = "Map failed";
    }

    results.push(result);
  }

  // Print results
  console.log("Results:");
  console.log("-".repeat(50));
  console.log("Directory".padEnd(30) + "Priority".padEnd(10) + "Status");
  console.log("-".repeat(50));

  for (const r of results) {
    const status = r.error ? `[${r.error}]` : "[mapped]";
    console.log(r.path.padEnd(30) + r.priority.padEnd(10) + status);
  }

  const mapped = results.filter(r => r.mapped).length;
  const failed = results.filter(r => !r.mapped).length;

  console.log("\n" + "=".repeat(50));
  console.log(`Mapped: ${mapped}/${results.length} directories`);
  if (failed > 0) {
    console.log(`Failed: ${failed}`);
  }
}

main();
