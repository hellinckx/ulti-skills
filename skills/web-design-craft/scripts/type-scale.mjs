#!/usr/bin/env node
// web-design-craft — fluid modular type scale + spacing scale. Dependency-free, Node >= 18.
//
//   node type-scale.mjs --base 16 --ratio 1.25 [--ratio-sm 1.2] [--min-vw 360] [--max-vw 1280]
//                       [--steps -2:6] [--unit 4] [--css] [--json]
//
// For each step n, size at the small viewport = base·ratio_sm^n and at the large viewport =
// base·ratio^n; the output is a CSS clamp() that interpolates linearly between the two viewports:
//   clamp(min, intercept(rem) + slope(vw), max)   slope = (max−min)/(maxVw−minVw)·100
// Default prints a table; --css prints :root variables; --json prints the record blocks.

import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROLES = [
  { role: "display", step: 5, leading: 1.0, tracking_em: -0.02 },
  { role: "h1", step: 4, leading: 1.05, tracking_em: -0.015 },
  { role: "h2", step: 3, leading: 1.1, tracking_em: -0.01 },
  { role: "h3", step: 2, leading: 1.2, tracking_em: 0 },
  { role: "lead", step: 1, leading: 1.5, tracking_em: 0 },
  { role: "body", step: 0, leading: 1.6, tracking_em: 0 },
  { role: "small", step: -1, leading: 1.5, tracking_em: 0 },
  { role: "eyebrow", step: -1, leading: 1.2, tracking_em: 0.12, uppercase: true },
  { role: "caption", step: -2, leading: 1.4, tracking_em: 0.01 },
];

const r2 = (x) => Math.round(x * 100) / 100;
const r4 = (x) => Math.round(x * 10000) / 10000;

// sizeSm = size at the small viewport, sizeLg = size at the large viewport. The preferred value is a
// straight line through both points (slope may be negative for small steps, where the larger ratio
// makes text *smaller* on wide screens); clamp() bounds are the smaller and larger of the two sizes.
export function fluidClamp(sizeSm, sizeLg, minVw, maxVw, rootPx = 16) {
  const slope = (sizeLg - sizeSm) / (maxVw - minVw);          // px per px of viewport (signed)
  const intercept = sizeSm - slope * minVw;                    // px
  const vw = r4(slope * 100), rem = r4(intercept / rootPx);
  const lo = Math.min(sizeSm, sizeLg), hi = Math.max(sizeSm, sizeLg);
  const mid = vw === 0 ? `${rem}rem` : `${rem}rem ${vw < 0 ? "-" : "+"} ${Math.abs(vw)}vw`;
  return `clamp(${r2(lo)}px, ${mid}, ${r2(hi)}px)`;
}

export function typeScale({ base = 16, ratio = 1.25, ratioSm = ratio, minVw = 360, maxVw = 1280, steps = [-2, 6] } = {}) {
  const [lo, hi] = steps;
  const rows = [];
  for (let n = lo; n <= hi; n++) {
    const sm = base * ratioSm ** n, lg = base * ratio ** n;
    rows.push({ step: n, sm_px: r2(sm), lg_px: r2(lg), clamp: fluidClamp(sm, lg, minVw, maxVw) });
  }
  const roles = ROLES.filter((r) => r.step >= lo && r.step <= hi).map((r) => ({ ...r, clamp: rows.find((x) => x.step === r.step).clamp }));
  return { ratio_sm: ratioSm, ratio_lg: ratio, base_px: base, min_vw: minVw, max_vw: maxVw, steps: rows, roles };
}

export function spacingScale(unit = 4) {
  const mult = [1, 2, 3, 4, 6, 8, 12, 16, 24, 32];
  return { unit_px: unit, steps: mult.map((m) => m * unit), section_padding_px: { phone: unit * 16, desktop: unit * 32 } };
}

export function toCss(ts, sp) {
  const lines = [":root {"];
  for (const r of ts.steps) lines.push(`  --step-${r.step < 0 ? "n" + -r.step : r.step}: ${r.clamp};`);
  for (const r of ts.roles) lines.push(`  --font-${r.role}: var(--step-${r.step < 0 ? "n" + -r.step : r.step}); --leading-${r.role}: ${r.leading}; --tracking-${r.role}: ${r.tracking_em}em;`);
  sp.steps.forEach((px, i) => lines.push(`  --space-${i + 1}: ${px}px;`));
  lines.push(`  --section-pad: clamp(${sp.section_padding_px.phone}px, ${r4((sp.section_padding_px.phone / 16))}rem + ${r4(((sp.section_padding_px.desktop - sp.section_padding_px.phone) / (ts.max_vw - ts.min_vw)) * 100)}vw, ${sp.section_padding_px.desktop}px);`);
  lines.push("}");
  return lines.join("\n") + "\n";
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const a = process.argv.slice(2);
  const opt = (k, d) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d; };
  const flag = (k) => a.includes(k);
  const base = Number(opt("--base", 16)), ratio = Number(opt("--ratio", 1.25)), ratioSm = Number(opt("--ratio-sm", ratio));
  const minVw = Number(opt("--min-vw", 360)), maxVw = Number(opt("--max-vw", 1280)), unit = Number(opt("--unit", 4));
  const steps = String(opt("--steps", "-2:6")).split(":").map(Number);
  if ([base, ratio, ratioSm, minVw, maxVw, unit, ...steps].some((n) => !Number.isFinite(n)) || maxVw <= minVw || ratio <= 1 || ratioSm <= 1) {
    console.error("usage: node type-scale.mjs --base 16 --ratio 1.25 [--ratio-sm 1.2] [--min-vw 360 --max-vw 1280] [--steps -2:6] [--unit 4] [--css|--json]"); process.exit(2);
  }
  const ts = typeScale({ base, ratio, ratioSm, minVw, maxVw, steps }), sp = spacingScale(unit);
  if (flag("--json")) { process.stdout.write(JSON.stringify({ type_scale: ts, spacing_scale: sp }, null, 2) + "\n"); process.exit(0); }
  if (flag("--css")) { process.stdout.write(toCss(ts, sp)); process.exit(0); }
  console.log(`base ${base}px  ratio ${ratioSm} (≤${minVw}px) → ${ratio} (≥${maxVw}px)`);
  console.log("step  @small   @large   clamp");
  for (const r of ts.steps) console.log(`${String(r.step).padStart(4)}  ${String(r.sm_px).padStart(7)}  ${String(r.lg_px).padStart(7)}   ${r.clamp}`);
  console.log("\nroles: " + ts.roles.map((r) => `${r.role}=step ${r.step} (lh ${r.leading}, ls ${r.tracking_em}em${r.uppercase ? ", caps" : ""})`).join(" · "));
  console.log(`spacing (unit ${unit}px): ${sp.steps.join(" ")}  section-pad ${sp.section_padding_px.phone}→${sp.section_padding_px.desktop}px`);
}
