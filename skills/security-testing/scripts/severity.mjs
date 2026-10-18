#!/usr/bin/env node
// security-testing — severity scoring and findings validation. Dependency-free, Node >= 18.
//
//   node severity.mjs score --exploitability 0.9 --conf 0.9 --integ 0.3 --avail 0.1 --scope 0.6 [--json]
//   node severity.mjs validate findings.json [--gate high|critical] [--json]
//
// Findings file: a JSON array, or an object with a top-level "findings" array (the YAML form in the
// asset is the same shape — convert to JSON first). Exit codes: 0 ok, 1 gate failed / invalid, 2 usage.

import { readFileSync } from "node:fs";

export const CLASSES = ["sql-injection", "nosql-injection", "command-injection", "template-injection", "broken-authentication", "weak-session", "broken-access-control", "idor", "privilege-escalation", "xss", "csrf", "open-redirect", "ssrf", "path-traversal", "insecure-deserialization", "insecure-file-upload", "secrets-leakage", "misconfiguration", "vulnerable-dependency", "business-logic-abuse", "race-condition", "missing-rate-limit", "dos-resilience"];
export const STATUSES = ["open", "confirmed", "fixed", "verified", "accepted-risk", "false-positive"];
const BANDS = ["info", "low", "medium", "high", "critical"];

export function score(f) {
  // Missing/non-numeric factors must fail closed instead of yielding NaN comparisons.
  for (const k of ["exploitability", "impact_conf", "impact_integ", "impact_avail", "scope"]) {
    const v = f?.[k];
    if (typeof v !== "number" || !Number.isFinite(v) || v < 0 || v > 1) throw new Error(`factor ${k} must be a finite number 0..1`);
  }
  const imp = [f.impact_conf, f.impact_integ, f.impact_avail];
  const s = (0.35 * f.exploitability + 0.25 * Math.max(...imp) + 0.15 * (imp.reduce((a, b) => a + b, 0) / 3) + 0.25 * f.scope) * 10;
  return Math.round(s * 10) / 10;
}
export const band = (s) => (s >= 9 ? "critical" : s >= 7 ? "high" : s >= 4 ? "medium" : s > 0 ? "low" : "info");

export function validate(findings, gate = "high") {
  const problems = [], seen = new Set();
  const gateIdx = BANDS.indexOf(gate);
  if (gateIdx < 0) throw new Error("gate must be one of " + BANDS.join("|"));
  let gateFails = 0;
  findings.forEach((f, i) => {
    const where = f?.id ?? `#${i}`;
    const p = (m) => problems.push(`${where}: ${m}`);
    if (!f || typeof f !== "object" || Array.isArray(f)) { p("finding must be an object"); return; }
    for (const k of ["id", "title", "class", "location", "repro", "fix", "status"]) {
      if (typeof f[k] !== "string" || !f[k].trim()) p(`required field '${k}' must be a non-empty string`);
    }
    if (f?.id) { if (seen.has(f.id)) p("duplicate id"); seen.add(f.id); }
    if (f?.class && !CLASSES.includes(f.class)) p(`unknown class '${f.class}'`);
    if (f?.status && !STATUSES.includes(f.status)) p(`unknown status '${f.status}'`);
    const sev = f?.severity;
    if (!sev || typeof sev !== "object" || Array.isArray(sev)) p("severity must be an object");
    else {
      if (typeof sev.score !== "number" || !Number.isFinite(sev.score) || sev.score < 0 || sev.score > 10) p("severity.score must be 0..10");
      else {
        if (sev.band !== band(sev.score)) p(`band '${sev.band}' does not match score ${sev.score} (expected '${band(sev.score)}')`);
        if (sev.factors) { try { const rs = score(sev.factors); if (Math.abs(rs - sev.score) > 0.05) p(`score ${sev.score} does not follow from factors (recomputed ${rs})`); } catch (e) { p(e.message); } }
      }
    }
    if (["fixed", "verified"].includes(f?.status) && (typeof f.test !== "string" || !f.test.trim())) p(`status '${f.status}' requires 'test'`);
    if (f?.status === "accepted-risk" && ([f.notes, f.owner].some(v => typeof v !== "string" || !v.trim()))) p("accepted-risk requires 'notes' (rationale) and 'owner'");
    if (f?.status === "verified" && !f.test) p("verified requires 'test'");
    const closed = ["verified", "accepted-risk", "false-positive"].includes(f?.status);
    if (sev && BANDS.indexOf(sev.band) >= gateIdx && !closed) { gateFails++; p(`release gate: ${sev.band} finding is '${f.status}', must be verified / accepted-risk / false-positive`); }
    if (JSON.stringify(f).match(/(?:api[_-]?key|secret|password|token)["']?\s*[:=]\s*["']?[A-Za-z0-9_\-]{16,}/i)) p("looks like a raw secret in the record — reference evidence by path instead");
  });
  const counts = Object.fromEntries(BANDS.map((b) => [b, findings.filter((f) => f?.severity?.band === b).length]));
  return { findings: findings.length, by_band: counts, gate, gate_failures: gateFails, problems, valid: problems.length === 0, release_ok: gateFails === 0 };
}

const [cmd, ...a] = process.argv.slice(2);
const opt = (k, d) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d; };
const json = a.includes("--json");
if (cmd === "score") {
  const f = { exploitability: Number(opt("--exploitability")), impact_conf: Number(opt("--conf")), impact_integ: Number(opt("--integ")), impact_avail: Number(opt("--avail")), scope: Number(opt("--scope")) };
  if (Object.values(f).some((v) => !Number.isFinite(v))) usage();
  const s = score(f), out = { score: s, band: band(s), factors: f };
  console.log(json ? JSON.stringify(out, null, 2) : `score ${s}  band ${out.band}\nfactors ${JSON.stringify(f)}`);
} else if (cmd === "validate") {
  const file = a.find((x) => !x.startsWith("--")); if (!file) usage();
  let data = JSON.parse(readFileSync(file, "utf8")); if (!Array.isArray(data)) data = data.findings;
  if (!Array.isArray(data)) { console.error("findings file must be a JSON array or {findings:[...]}"); process.exit(1); }
  const res = validate(data, opt("--gate", "high"));
  if (json) console.log(JSON.stringify(res, null, 2));
  else { console.log(`${res.findings} findings  by band ${JSON.stringify(res.by_band)}  gate ${res.gate}`); for (const p of res.problems) console.log("  ✗ " + p); console.log(res.valid ? "valid: yes" : `valid: no (${res.problems.length} problems)`); console.log(res.release_ok ? "release gate: PASS" : `release gate: FAIL (${res.gate_failures})`); }
  process.exit(res.valid && res.release_ok ? 0 : 1);
} else usage();

function usage() {
  console.error("usage:\n  node severity.mjs score --exploitability 0.9 --conf 0.9 --integ 0.3 --avail 0.1 --scope 0.6 [--json]\n  node severity.mjs validate findings.json [--gate high|critical] [--json]");
  process.exit(2);
}
