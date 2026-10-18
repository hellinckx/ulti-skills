#!/usr/bin/env node
// ab-testing — analysis. Dependency-free, Node >= 18.
//
//   node analyze.mjs prop   --n1 199880 --c1 19988 --n2 200120 --c2 24815 [--alpha 0.05] [--sims 200000] [--seed 7]
//   node analyze.mjs mean   --n1 800 --mean1 9.1 --sd1 4.2 --n2 810 --mean2 9.9 --sd2 4.4 [--alpha 0.05]
//   node analyze.mjs srm    --expected 0.5,0.5 --observed 199880,200120
//   node analyze.mjs audit  result.json           (recompute scores/composite/decision of a result-schema file)
// Every command prints a table and, with --json, a machine-readable object.

import { readFileSync } from "node:fs";
import { qnorm, pnorm, chi2Sf, tTwoSided, rbeta, seed, quantile, r } from "./stats.mjs";

const [cmd, ...a] = process.argv.slice(2);
const opt = (k, d) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d; };
const num = (k, d) => { const v = Number(opt(k, d)); if (!Number.isFinite(v)) usage(); return v; };
const json = a.includes("--json");
let out;

if (cmd === "prop") {
  const n1 = num("--n1"), c1 = num("--c1"), n2 = num("--n2"), c2 = num("--c2"), alpha = num("--alpha", 0.05);
  const p1 = c1 / n1, p2 = c2 / n2, pbar = (c1 + c2) / (n1 + n2);
  const se = Math.sqrt(pbar * (1 - pbar) * (1 / n1 + 1 / n2)), z = (p2 - p1) / se, p = 2 * (1 - pnorm(Math.abs(z)));
  const seU = Math.sqrt(p1 * (1 - p1) / n1 + p2 * (1 - p2) / n2), zc = qnorm(1 - alpha / 2);
  const h = 2 * Math.asin(Math.sqrt(p2)) - 2 * Math.asin(Math.sqrt(p1));
  // Bayesian Beta(1,1) posteriors, Monte-Carlo
  seed(num("--seed", 7)); const sims = num("--sims", 200000);
  const diffs = new Float64Array(sims); let wins = 0, loss = 0;
  for (let i = 0; i < sims; i++) { const ta = rbeta(1 + c1, 1 + n1 - c1), tb = rbeta(1 + c2, 1 + n2 - c2); diffs[i] = tb - ta; if (tb > ta) wins++; loss += Math.max(ta - tb, 0); }
  const sorted = Array.from(diffs).sort((x, y) => x - y);
  out = {
    method: "two_proportion_z", n1, c1, n2, c2, p1: r(p1, 5), p2: r(p2, 5), alpha,
    effect: { absolute_lift: r(p2 - p1, 5), relative_lift: r((p2 - p1) / p1, 4), cohen_h: r(h, 4) },
    z: r(z, 3), p_value: p < 1e-12 ? 1e-12 : r(p, 6), significant: p < alpha,
    ci: { level: 1 - alpha, low: r(p2 - p1 - zc * seU, 5), high: r(p2 - p1 + zc * seU, 5) },
    bayesian: { prob_b_beats_a: r(wins / sims, 4), credible_low: r(quantile(sorted, 0.025), 5), credible_high: r(quantile(sorted, 0.975), 5), expected_loss: r(loss / sims, 6), sims },
  };
} else if (cmd === "mean") {
  const n1 = num("--n1"), m1 = num("--mean1"), s1 = num("--sd1"), n2 = num("--n2"), m2 = num("--mean2"), s2 = num("--sd2"), alpha = num("--alpha", 0.05);
  const v1 = s1 * s1 / n1, v2 = s2 * s2 / n2, se = Math.sqrt(v1 + v2), t = (m2 - m1) / se;
  const df = (v1 + v2) ** 2 / (v1 * v1 / (n1 - 1) + v2 * v2 / (n2 - 1)), p = tTwoSided(t, df);
  const sp = Math.sqrt(((n1 - 1) * s1 * s1 + (n2 - 1) * s2 * s2) / (n1 + n2 - 2)), zc = qnorm(1 - alpha / 2); // normal approx for CI width at large df
  out = { method: "welch_t", n1, mean1: m1, sd1: s1, n2, mean2: m2, sd2: s2, alpha, effect: { absolute_lift: r(m2 - m1, 5), relative_lift: r((m2 - m1) / m1, 4), cohen_d: r((m2 - m1) / sp, 4) }, t: r(t, 3), df: r(df, 1), p_value: p < 1e-12 ? 1e-12 : r(p, 6), significant: p < alpha, ci: { level: 1 - alpha, low: r(m2 - m1 - zc * se, 5), high: r(m2 - m1 + zc * se, 5), note: "normal-approx width" } };
} else if (cmd === "srm") {
  const exp = String(opt("--expected", "")).split(",").map(Number), obs = String(opt("--observed", "")).split(",").map(Number);
  if (exp.length < 2 || exp.length !== obs.length || exp.some((x) => !(x > 0)) || obs.some((x) => !(x >= 0))) usage();
  const total = obs.reduce((s, x) => s + x, 0), sumExp = exp.reduce((s, x) => s + x, 0);
  const expected = exp.map((x) => total * x / sumExp), chi = obs.reduce((s, o, i) => s + (o - expected[i]) ** 2 / expected[i], 0), df = obs.length - 1, p = chi2Sf(chi, df);
  out = { method: "srm_chi_square", expected_counts: expected.map((x) => r(x, 1)), observed: obs, chi_square: r(chi, 4), df, p_value: r(p, 6), passed: p >= 0.001, verdict: p >= 0.001 ? "no sample-ratio mismatch" : "SRM — assignment/logging broken; result void until fixed" };
} else if (cmd === "audit") {
  const file = a.find((x) => !x.startsWith("--")); if (!file) usage();
  const res = JSON.parse(readFileSync(file, "utf8"));
  const weights = res.criteria.map((c) => c.weight), wsum = r(weights.reduce((s, w) => s + w, 0), 6);
  const findings = [];
  if (Math.abs(wsum - 1) > 1e-6) findings.push(`criteria weights sum to ${wsum}, not 1`);
  const per = (res.results?.per_variant ?? []).map((v) => {
    const scores = {}; let composite = 0;
    for (const c of res.criteria) {
      const raw = v.metrics?.[c.metric]; const m = c.score_mapping;
      let s = null;
      if (m?.type === "linear" && typeof raw === "number") { s = Math.min(1, Math.max(0, (raw - m.min) / (m.max - m.min))); if (c.direction === "decrease") s = 1 - s; }
      scores[c.id] = s === null ? null : r(s, 4);
      if (s === null) findings.push(`${v.id}: cannot score criterion ${c.id} (metric ${c.metric} missing or mapping not linear)`); else composite += c.weight * s;
      if (s !== null && v.scores?.[c.id] !== undefined && Math.abs(v.scores[c.id] - s) > 0.005) findings.push(`${v.id}: recorded score ${c.id}=${v.scores[c.id]} but recomputed ${r(s, 4)}`);
    }
    composite = r(composite, 4);
    if (v.composite !== undefined && Math.abs(v.composite - composite) > 0.005) findings.push(`${v.id}: recorded composite ${v.composite} but recomputed ${composite}`);
    return { id: v.id, scores, composite };
  });
  for (const g of res.guardrails ?? []) for (const v of res.results?.per_variant ?? []) {
    const val = v.metrics?.[g.metric]; if (typeof val !== "number") continue;
    const breached = g.comparison === "must_stay_below" ? val >= g.threshold : val <= g.threshold;
    if (breached && res.decision?.winning_variant === v.id && res.decision?.outcome === "ship_b") findings.push(`guardrail ${g.metric} breached by winning variant ${v.id} (${val} vs ${g.threshold}) — ship decision invalid`);
  }
  const integ = res.integrity ?? {};
  if (integ.srm && integ.srm.passed === false) findings.push("SRM failed — result void");
  if (integ.ran && integ.ran.full_cycle === false) findings.push("did not run a full business cycle");
  const ctl = per.find((p) => p.id === res.variants?.find((v) => v.is_control)?.id), best = [...per].sort((x, y) => y.composite - x.composite)[0];
  out = { method: "audit", weights_sum: wsum, per_variant: per, composite_margin_best_vs_control: ctl && best ? r(best.composite - ctl.composite, 4) : null, recorded_decision: res.decision?.outcome ?? null, findings, verdict: findings.length ? "ISSUES" : "consistent" };
} else usage();

if (json) console.log(JSON.stringify(out, null, 2));
else console.log(render(out));

function render(o, ind = "") { return Object.entries(o).map(([k, v]) => v && typeof v === "object" && !Array.isArray(v) ? `${ind}${k}:\n${render(v, ind + "  ")}` : `${ind}${k.padEnd(28 - ind.length)} ${Array.isArray(v) ? JSON.stringify(v) : v}`).join("\n"); }
function usage() {
  console.error("usage:\n  node analyze.mjs prop --n1 N --c1 C --n2 N --c2 C [--alpha 0.05] [--sims 200000] [--seed 7] [--json]\n  node analyze.mjs mean --n1 N --mean1 M --sd1 S --n2 N --mean2 M --sd2 S [--alpha 0.05] [--json]\n  node analyze.mjs srm --expected 0.5,0.5 --observed 199880,200120 [--json]\n  node analyze.mjs audit result.json [--json]");
  process.exit(2);
}
