#!/usr/bin/env node
// ab-testing — sample size, power and MDE. Dependency-free, Node >= 18.
//
//   node sample-size.mjs --type prop --p1 0.10 --mde 0.02 [--relative] [--alpha 0.05] [--power 0.8] [--arms 2]
//   node sample-size.mjs --type prop --p1 0.10 --n 5000             (MDE a fixed n can resolve)
//   node sample-size.mjs --type mean --sd 12 --mde 1.5 [--alpha 0.05] [--power 0.8] [--arms 2]
//   node sample-size.mjs --type mean --sd 12 --n 800                (MDE from n)
// --arms > 2 applies Bonferroni to alpha for the pairwise comparisons. --json for machine output.

import { qnorm, r } from "./stats.mjs";

const a = process.argv.slice(2);
const opt = (k, d) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d; };
const flag = (k) => a.includes(k);
const type = opt("--type", "prop"), alpha0 = Number(opt("--alpha", 0.05)), power = Number(opt("--power", 0.8)), arms = Number(opt("--arms", 2));
const alpha = arms > 2 ? alpha0 / (arms - 1) : alpha0; // Bonferroni across (arms-1) comparisons vs control
const zA = qnorm(1 - alpha / 2), zB = qnorm(power), k = (zA + zB) ** 2;
let out;

if (type === "prop") {
  const p1 = Number(opt("--p1"));
  if (!(p1 > 0 && p1 < 1)) usage();
  if (opt("--n")) {
    const n = Number(opt("--n"));
    // MDE from n (absolute): delta = (zA+zB) * sqrt(2 p1 (1-p1) / n) — uses p1 as variance proxy
    const delta = (zA + zB) * Math.sqrt(2 * p1 * (1 - p1) / n);
    out = { mode: "mde_from_n", type, p1, n_per_arm: n, alpha, power, mde_absolute: r(delta, 5), mde_relative: r(delta / p1, 4) };
  } else {
    let mde = Number(opt("--mde")); if (!(mde > 0)) usage();
    const delta = flag("--relative") ? p1 * mde : mde, p2 = p1 + delta, pbar = (p1 + p2) / 2;
    if (!(p2 < 1)) usage();
    const n = Math.ceil(k * 2 * pbar * (1 - pbar) / delta ** 2);
    out = { mode: "n_from_mde", type, p1, p2: r(p2, 5), mde_absolute: r(delta, 5), mde_relative: r(delta / p1, 4), alpha, alpha_family: alpha0, arms, power, z_alpha: r(zA, 4), z_power: r(zB, 4), n_per_arm: n, n_total: n * arms };
  }
} else if (type === "mean") {
  const sd = Number(opt("--sd")); if (!(sd > 0)) usage();
  if (opt("--n")) {
    const n = Number(opt("--n")), delta = (zA + zB) * Math.sqrt(2 * sd * sd / n);
    out = { mode: "mde_from_n", type, sd, n_per_arm: n, alpha, power, mde_absolute: r(delta, 5), cohen_d: r(delta / sd, 4) };
  } else {
    const mde = Number(opt("--mde")); if (!(mde > 0)) usage();
    const n = Math.ceil(k * 2 * sd * sd / mde ** 2);
    out = { mode: "n_from_mde", type, sd, mde_absolute: mde, cohen_d: r(mde / sd, 4), alpha, alpha_family: alpha0, arms, power, z_alpha: r(zA, 4), z_power: r(zB, 4), n_per_arm: n, n_total: n * arms };
  }
} else usage();

if (flag("--json")) console.log(JSON.stringify(out, null, 2));
else {
  console.log(Object.entries(out).map(([key, v]) => `${key.padEnd(14)} ${v}`).join("\n"));
  if (out.mode === "n_from_mde") console.log(`\n→ ${out.n_per_arm.toLocaleString()} per arm (${out.n_total.toLocaleString()} total) to detect ${out.type === "prop" ? (out.mde_relative * 100).toFixed(1) + "% relative / " + out.mde_absolute + " absolute" : out.mde_absolute} at α=${out.alpha_family}${arms > 2 ? " (Bonferroni → " + r(alpha, 5) + ")" : ""}, power ${power}.`);
  else console.log(`\n→ with ${out.n_per_arm.toLocaleString()} per arm you can resolve an effect of ${out.mde_absolute}${out.type === "prop" ? " absolute (" + (out.mde_relative * 100).toFixed(1) + "% relative)" : ""} — if that is bigger than any effect that would change your decision, do not run the test as-is.`);
}

function usage() {
  console.error("usage:\n  node sample-size.mjs --type prop --p1 0.10 --mde 0.02 [--relative] [--alpha 0.05] [--power 0.8] [--arms 2] [--json]\n  node sample-size.mjs --type prop --p1 0.10 --n 5000\n  node sample-size.mjs --type mean --sd 12 --mde 1.5\n  node sample-size.mjs --type mean --sd 12 --n 800");
  process.exit(2);
}
