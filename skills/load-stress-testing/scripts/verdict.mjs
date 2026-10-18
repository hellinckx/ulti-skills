#!/usr/bin/env node
// load-stress-testing — percentiles and verdict rules. Dependency-free, Node >= 18.
//
//   node verdict.mjs percentiles latencies.csv|.json [--key ms] [--json]
//       CSV: one number per line, or a header row and --key <column>. JSON: array of numbers or of objects (--key).
//   node verdict.mjs verdict run.json [--json]
//       Applies the rules of assets/result-schema.md to a result record. Exit 1 on fail or verdict mismatch.

import { readFileSync } from "node:fs";

export function percentiles(values) {
  const v = values.filter((x) => Number.isFinite(x)).sort((a, b) => a - b);
  if (!v.length) throw new Error("no numeric values");
  const q = (p) => { const i = (v.length - 1) * p, lo = Math.floor(i), hi = Math.ceil(i); return v[lo] + (v[hi] - v[lo]) * (i - lo); };
  const mean = v.reduce((s, x) => s + x, 0) / v.length;
  const r1 = (x) => Math.round(x * 10) / 10;
  return { count: v.length, mean: r1(mean), p50: r1(q(0.5)), p95: r1(q(0.95)), p99: r1(q(0.99)), min: v[0], max: v[v.length - 1] };
}

export function applyRules(res) {
  const th = res.thresholds ?? {}, sat = res.saturation ?? {}, fired = [], misses = [];
  const T = { p95_ms: 500, p99_ms: 1000, ttfb_ms: 200, error_rate_steady: 0.001, error_rate_spike: 0.01, cpu_pct: 70, db_connections_pct: 80, ...th };
  const spike = res.profile === "spike";
  for (const a of res.actions ?? []) {
    if (a.p95_ms > T.p95_ms) misses.push(`${a.name}: p95 ${a.p95_ms} > ${T.p95_ms}`);
    if (a.p99_ms > T.p99_ms) misses.push(`${a.name}: p99 ${a.p99_ms} > ${T.p99_ms}`);
    if (a.ttfb_ms !== undefined && a.ttfb_ms > T.ttfb_ms) misses.push(`${a.name}: ttfb ${a.ttfb_ms} > ${T.ttfb_ms}`);
    const er = spike ? T.error_rate_spike : T.error_rate_steady;
    if (a.error_rate > er) misses.push(`${a.name}: error_rate ${a.error_rate} > ${er}`);
  }
  if (res.error_rate !== undefined && res.error_rate > (spike ? T.error_rate_spike : T.error_rate_steady)) misses.push(`overall error_rate ${res.error_rate}`);
  const saturated = [];
  if (sat.cpu_pct >= T.cpu_pct) saturated.push(`cpu ${sat.cpu_pct}%`);
  if (sat.db_connections_pct >= T.db_connections_pct) saturated.push(`db_connections ${sat.db_connections_pct}%`);
  if (sat.io_pct >= 80) saturated.push(`io ${sat.io_pct}%`);
  if (res.profile === "soak" && sat.mem_trend === "rising") misses.push("memory rising over soak (leak)");
  const rows = Object.values(res.data_volume?.rows_per_table ?? {}), maxRows = rows.length ? Math.max(...rows) : 0;
  const vus = res.concurrency?.virtual_users ?? 0, crashed = /crash|5\d\d storm|connection refused/i.test(res.notes ?? "") || (res.error_rate ?? 0) >= 0.2;
  let verdict = "pass", root = "none";
  if (misses.length === 0 && saturated.length === 0) { fired.push("rule 1: all thresholds met, nothing saturated"); }
  else if ((misses.length || crashed) && maxRows < 500000 && vus <= 50 && saturated.length === 0) { verdict = "fail"; root = "architecture"; fired.push(`rule 2: thresholds missed${crashed ? " / crash" : ""} at max ${maxRows.toLocaleString()} rows, ${vus} VUs, no resource saturated → architecture`); }
  else if (misses.length && saturated.length) { verdict = "fail"; root = "infrastructure"; fired.push(`rule 3: thresholds missed with saturation (${saturated.join(", ")}) → infrastructure`); }
  else { verdict = "fail"; root = res.root_cause_class && res.root_cause_class !== "none" ? res.root_cause_class : "architecture"; fired.push(`rule 4: fail; evidence must name the layer (recorded '${res.root_cause_class ?? "unset"}')`); }
  const mismatch = (res.verdict && res.verdict !== verdict) || (res.root_cause_class && res.root_cause_class !== root);
  return { computed: { verdict, root_cause_class: root }, recorded: { verdict: res.verdict ?? null, root_cause_class: res.root_cause_class ?? null }, rules_fired: fired, threshold_misses: misses, saturated, max_rows: maxRows, virtual_users: vus, mismatch };
}

const [cmd, file, ...a] = process.argv.slice(2);
const opt = (k, d) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d; };
const json = a.includes("--json");
if (cmd === "percentiles" && file) {
  const key = opt("--key"); const text = readFileSync(file, "utf8"); let values;
  if (file.endsWith(".json")) { const d = JSON.parse(text); values = d.map((x) => (typeof x === "number" ? x : Number(x?.[key ?? "ms"]))); }
  else { const lines = text.split(/\r?\n/).filter((l) => l.trim()); const head = lines[0].split(","); const col = key ? head.indexOf(key) : (isNaN(Number(head[0])) ? 0 : -1); values = (col >= 0 && isNaN(Number(head[col])) ? lines.slice(1) : lines).map((l) => Number(l.split(",")[col < 0 ? 0 : col])); }
  const p = percentiles(values);
  console.log(json ? JSON.stringify(p) : Object.entries(p).map(([k, v]) => `${k.padEnd(6)} ${v}`).join("\n"));
} else if (cmd === "verdict" && file) {
  const res = JSON.parse(readFileSync(file, "utf8")); const out = applyRules(res);
  if (json) console.log(JSON.stringify(out, null, 2));
  else { console.log(`computed  ${out.computed.verdict} / ${out.computed.root_cause_class}`); console.log(`recorded  ${out.recorded.verdict} / ${out.recorded.root_cause_class}${out.mismatch ? "   ← MISMATCH" : ""}`); for (const f of out.rules_fired) console.log("  " + f); for (const m of out.threshold_misses) console.log("  ✗ " + m); if (out.saturated.length) console.log("  saturated: " + out.saturated.join(", ")); }
  process.exit(out.computed.verdict === "pass" && !out.mismatch ? 0 : 1);
} else { console.error("usage:\n  node verdict.mjs percentiles latencies.csv|json [--key ms] [--json]\n  node verdict.mjs verdict run.json [--json]"); process.exit(2); }
