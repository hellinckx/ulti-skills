#!/usr/bin/env node
// Handoff kit for a prepared project: create the skeleton from assets/handoff-kit.md and check that a prepared folder
// is complete enough for another agent to continue blind. Node >= 18, no dependencies.
//
//   node scaffold.mjs new <folder> --name "Project" [--date 2026-10-18]   writes only missing files, never overwrites
//   node scaffold.mjs check <folder> [--json]                             exit 0 = ready, 1 = gaps, 2 = usage error
import { existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const kitFile = path.join(here, "..", "assets", "handoff-kit.md");

export const requiredFiles = [
  "AGENTS.md", "CLAUDE.md", "README.md", ".gitignore",
  "docs/BRIEF.md", "docs/CONCEPT.md", "docs/MILESTONES.md", "docs/REGISTRY.md", "docs/PROGRESS.md", "docs/ACTIVE.md",
  "docs/REQUESTS.md", "docs/WORKLOG.md", "docs/DECISIONS.md", "docs/DESIGN.md", "docs/SKILLS.md", "docs/RESEARCH.md",
  "docs/START-CLAUDE.md", "docs/START-CODEX.md",
];

export function readTemplates(text = readFileSync(kitFile, "utf8")) {
  const templates = new Map();
  const pattern = /<!-- FILE: ([^\s>]+) -->\r?\n~~~~[a-z]*\r?\n([\s\S]*?)\r?\n~~~~/g;
  for (const match of text.replace(/\r\n/g, "\n").matchAll(pattern)) templates.set(match[1], match[2] + "\n");
  return templates;
}

export function inside(root, relative) {
  const target = path.resolve(root, relative);
  if (target !== root && !target.startsWith(root + path.sep)) throw new Error("Template path leaves the project folder: " + relative);
  // A lexical prefix alone does not stop a pre-existing directory junction or symlink.
  let current = root;
  for (const part of [null, ...path.relative(root, target).split(path.sep).filter(Boolean)]) {
    if (part !== null) current = path.join(current, part);
    const stat = lstatSync(current, { throwIfNoEntry: false });
    if (stat?.isSymbolicLink()) throw new Error("Refusing a symbolic link or junction in project path: " + current);
    if (stat?.isFile() && stat.nlink > 1) throw new Error("Refusing a hardlinked project file: " + current);
  }
  return target;
}

export function scaffold(folder, { name, date = new Date().toISOString().slice(0, 10) } = {}) {
  if (!name || !String(name).trim()) throw new Error("--name is required");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("--date must be YYYY-MM-DD");
  const root = path.resolve(folder);
  mkdirSync(root, { recursive: true });
  const written = [], kept = [];
  const templates = readTemplates();
  // Check all destinations before creating files, so an unsafe tree stays untouched.
  for (const relative of templates.keys()) inside(root, relative);
  for (const [relative, body] of templates) {
    const target = inside(root, relative);
    if (existsSync(target)) { kept.push(relative); continue; }
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, body.replaceAll("{{NAME}}", String(name).trim()).replaceAll("{{DATE}}", date), { flag: "wx" });
    written.push(relative);
  }
  return { root, written, kept };
}

const read = (root, relative) => readFileSync(inside(root, relative), "utf8").replace(/\r\n/g, "\n");
const section = (text, anchor) => { const start = text.indexOf(anchor); if (start < 0) return null; const rest = text.slice(start + anchor.length); const end = rest.search(/\n## /); return end < 0 ? rest : rest.slice(0, end); };

function jsonFiles(dir, found = []) {
  const stat = lstatSync(dir, { throwIfNoEntry: false });
  if (!stat) return found;
  if (stat.isSymbolicLink()) throw new Error("Refusing a symbolic link or junction in config: " + dir);
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isSymbolicLink()) throw new Error("Refusing a symbolic link or junction in config: " + full);
    if (entry.isFile() && lstatSync(full).nlink > 1) throw new Error("Refusing a hardlinked config file: " + full);
    if (entry.isDirectory()) jsonFiles(full, found);
    else if (entry.isFile() && entry.name.endsWith(".json")) found.push(full);
  }
  return found;
}

export function check(folder) {
  const root = path.resolve(folder);
  const errors = [], warnings = [];
  const counts = { milestones: 0, features: 0, decisions: 0, requests: 0, configFiles: 0 };
  if (!existsSync(root) || !statSync(root).isDirectory()) return { ok: false, root, errors: ["Folder does not exist"], warnings, counts };
  const present = requiredFiles.filter((relative) => existsSync(inside(root, relative)));
  for (const relative of requiredFiles) if (!present.includes(relative)) errors.push("Missing file: " + relative);
  const text = Object.fromEntries(present.map((relative) => [relative, read(root, relative)]));

  for (const [relative, body] of Object.entries(text)) {
    const gaps = body.match(/<!--\s*fill\b/g)?.length ?? 0;
    if (gaps) errors.push(`Unfilled gaps in ${relative}: ${gaps}`);
    if (/\b(TODO|TBD|lorem ipsum)\b/i.test(body)) warnings.push("Placeholder word in " + relative);
  }

  const progress = text["docs/PROGRESS.md"];
  if (progress) {
    const next = section(progress, "<!-- kit:next-step -->");
    if (next === null) errors.push("PROGRESS has no <!-- kit:next-step --> anchor");
    else if (!/^\s*1\.\s+\S/m.test(next)) errors.push("PROGRESS next step has no numbered item");
  }

  const milestoneIds = new Set();
  const milestones = text["docs/MILESTONES.md"];
  if (milestones) {
    const parts = milestones.split(/\n(?=## M\d+\b)/).filter((part) => /^## M\d+\b/.test(part));
    counts.milestones = parts.length;
    if (parts.length < 2) errors.push("MILESTONES needs at least two milestones (## M0 …)");
    for (const part of parts) {
      const id = /^## (M\d+)/.exec(part)[1];
      if (milestoneIds.has(id)) errors.push("Duplicate milestone " + id);
      milestoneIds.add(id);
      if (!/\*\*(Acceptance|Abnahme|Done when|Fertig wenn)[^*]*:?\*\*/i.test(part)) errors.push(`Milestone ${id} has no acceptance line`);
    }
  }

  const registry = text["docs/REGISTRY.md"];
  if (registry) {
    const seen = new Set(), used = new Set();
    for (const line of registry.split("\n")) {
      const match = /^\|\s*(F-\d{3})\s*\|[^|]*\|[^|]*\|\s*([^|]*?)\s*\|/.exec(line);
      if (!match) continue;
      counts.features += 1;
      if (seen.has(match[1])) errors.push("Duplicate feature id " + match[1]);
      seen.add(match[1]);
      const milestone = /M\d+/.exec(match[2])?.[0];
      if (!milestone) warnings.push(`${match[1]} has no milestone`);
      else if (milestoneIds.size && !milestoneIds.has(milestone)) errors.push(`${match[1]} points to unknown milestone ${milestone}`);
      else used.add(milestone);
    }
    if (counts.features < 5) errors.push("REGISTRY needs at least five feature rows (| F-001 | …)");
    for (const id of milestoneIds) if (counts.features && !used.has(id)) warnings.push(`Milestone ${id} has no register rows`);
  }

  counts.decisions = (text["docs/DECISIONS.md"] ?? "").match(/^\|\s*D-\d{3}\s*\|/gm)?.length ?? 0;
  counts.requests = (text["docs/REQUESTS.md"] ?? "").match(/^\|\s*R-\d{3}\s*\|/gm)?.length ?? 0;
  if (text["docs/DECISIONS.md"] && !counts.decisions) errors.push("DECISIONS has no D-001 row");
  if (text["docs/REQUESTS.md"] && !counts.requests) errors.push("REQUESTS has no R-001 row (the original idea)");

  for (const relative of ["docs/START-CLAUDE.md", "docs/START-CODEX.md"]) {
    if (text[relative] && !(text[relative].includes("AGENTS.md") && text[relative].includes("PROGRESS.md"))) errors.push(relative + " must point the agent to AGENTS.md and docs/PROGRESS.md");
  }

  for (const skillPath of new Set((text["docs/SKILLS.md"] ?? "").match(/[A-Za-z]:\\[^`|\n<>*]*?SKILL\.md/g) ?? [])) {
    if (!existsSync(skillPath)) warnings.push("Skill path not found on this machine: " + skillPath);
  }

  for (const file of jsonFiles(inside(root, "config"))) {
    counts.configFiles += 1;
    try { JSON.parse(readFileSync(file, "utf8")); } catch (error) { errors.push(`Invalid JSON in ${path.relative(root, file)}: ${error.message}`); }
  }

  return { ok: errors.length === 0, root, errors, warnings, counts };
}

function main(argv) {
  const [command, folder, ...rest] = argv;
  const option = (flag) => { const index = rest.indexOf(flag); return index >= 0 ? rest[index + 1] : undefined; };
  if (command === "new" && folder) {
    const result = scaffold(folder, { name: option("--name"), date: option("--date") });
    console.log(`Kit in ${result.root}: ${result.written.length} written, ${result.kept.length} kept (existing files are never overwritten).`);
    if (result.kept.length) console.log("Kept: " + result.kept.join(", "));
    console.log("Next: fill every <!-- fill --> gap, then run: node scaffold.mjs check " + JSON.stringify(folder));
    return 0;
  }
  if (command === "check" && folder) {
    const result = check(folder);
    if (rest.includes("--json")) console.log(JSON.stringify(result, null, 2));
    else {
      console.log(`${result.ok ? "READY" : "NOT READY"} ${result.root}`);
      console.log(`milestones ${result.counts.milestones} · features ${result.counts.features} · decisions ${result.counts.decisions} · requests ${result.counts.requests} · config files ${result.counts.configFiles}`);
      for (const error of result.errors) console.log("  error: " + error);
      for (const warning of result.warnings) console.log("  warning: " + warning);
    }
    return result.ok ? 0 : 1;
  }
  console.error('Usage: node scaffold.mjs new <folder> --name "Project" [--date YYYY-MM-DD]\n       node scaffold.mjs check <folder> [--json]');
  return 2;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { process.exitCode = main(process.argv.slice(2)); }
  catch (error) { console.error(error.message); process.exitCode = 2; }
}
