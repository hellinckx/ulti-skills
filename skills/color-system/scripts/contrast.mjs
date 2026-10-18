#!/usr/bin/env node
// color-system — WCAG contrast of two colors. Dependency-free, Node >= 18.
//   node contrast.mjs "#1d2026" "#eceef2"
//   node contrast.mjs "oklch(0.21 0.014 250)" "oklch(0.95 0.01 250)"
// Prints the ratio and pass/fail for body text (4.5), large text / UI (3), enhanced (7).
import { gamutMap, hexToLinear, contrast } from "./palette.mjs";

function parse(input) {
  const s = String(input).trim();
  if (/^#?[0-9a-f]{3}([0-9a-f]{3})?$/i.test(s)) return hexToLinear(s.startsWith("#") ? s : "#" + s);
  const m = /^oklch\(\s*([\d.]+)%?\s+([\d.]+)\s+([\d.]+)/i.exec(s);
  if (m) {
    let L = Number(m[1]); if (s.includes("%")) L /= 100;
    return gamutMap(L, Number(m[2]), Number(m[3])).rgb;
  }
  throw new Error("unsupported color: " + input + " (use #hex or oklch(L C H))");
}

const [a, b] = process.argv.slice(2);
if (!a || !b) { console.error('usage: node contrast.mjs <colorA> <colorB>   e.g. "#fff" "oklch(0.62 0.17 255)"'); process.exit(2); }
const ratio = contrast(parse(a), parse(b));
const r = ratio.toFixed(2);
console.log(`${a}  vs  ${b}`);
console.log(`ratio ${r}:1`);
console.log(`  body text   (4.5:1) ${ratio >= 4.5 ? "PASS" : "FAIL"}`);
console.log(`  large/UI    (3:1)   ${ratio >= 3 ? "PASS" : "FAIL"}`);
console.log(`  enhanced    (7:1)   ${ratio >= 7 ? "PASS" : "FAIL"}`);
process.exit(ratio >= 3 ? 0 : 1);
