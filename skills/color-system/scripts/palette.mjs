#!/usr/bin/env node
// color-system — palette generator + verifier. Dependency-free, Node >= 18.
//
//   node palette.mjs --hue 250 [--accent 255] [--json] [--css] [--older] [--no-stagger] [--out dir]
//
// Generates the dark and light token sets of the recipe from a seed hue in OKLCH,
// converts to gamut-safe hex, measures WCAG contrast of all key pairs, repairs failures
// (text polarity on accent, accent lightness, text lightness, series stagger) and prints a
// table (default), the CSS (--css) and/or the palette record JSON (--json).
// --older raises body-text target to 7:1. --no-stagger keeps all data series at equal L.
// --out writes tokens.css and palette.json into a directory.

import { lstatSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ---------- color math (OKLCH -> OKLab -> linear sRGB -> sRGB) ----------
const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGamma = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

export function oklchToLinearRgb(L, C, H) {
  const h = (H * Math.PI) / 180;
  const a = C * Math.cos(h), b = C * Math.sin(h);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}
const inGamut = (rgb) => rgb.every((c) => c >= -1e-6 && c <= 1 + 1e-6);

// Reduce chroma (keep L and H) until the color fits sRGB. Returns {rgb, C, clipped}.
export function gamutMap(L, C, H) {
  let rgb = oklchToLinearRgb(L, C, H);
  if (inGamut(rgb)) return { rgb, C, clipped: false };
  let lo = 0, hi = C;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut(oklchToLinearRgb(L, mid, H))) lo = mid; else hi = mid;
  }
  return { rgb: oklchToLinearRgb(L, lo, H), C: lo, clipped: true };
}
const clamp01 = (c) => Math.min(1, Math.max(0, c));
export const linearToHex = (rgb) => "#" + rgb.map((c) => Math.round(clamp01(toGamma(clamp01(c))) * 255).toString(16).padStart(2, "0")).join("");
export const hexToLinear = (hex) => {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((x) => x + x).join("") : h;
  return [0, 2, 4].map((i) => toLinear(parseInt(full.slice(i, i + 2), 16) / 255));
};
export const luminance = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
export const contrast = (rgbA, rgbB) => {
  const a = luminance(rgbA), b = luminance(rgbB);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
};

// ---------- recipe (L/C are the method; H is the seed) ----------
const SERIES_H = [255, 200, 150, 90, 40, 350];
const SERIES_STAGGER = [0, 0.04, -0.04, 0.08, -0.08, 0.12]; // keeps weight similar, makes grayscale separable

function recipe(hN, hA, hS, stagger) {
  const n = (L, C) => ({ L, C, H: hN });
  const a = (L, C) => ({ L, C, H: hA });
  const s = (L, C, H) => ({ L, C, H });
  const SUCC = 150, WARN = 85, DANG = 25, INFO = 240; // semantic hues are fixed meanings
  const series = (base, C) => Object.fromEntries(SERIES_H.map((H, i) => [`series-${i + 1}`, s(base + (stagger ? SERIES_STAGGER[i] : 0), C, H)]));
  return {
    dark: {
      bg: n(0.17, 0.012), surface: n(0.21, 0.014), "surface-2": n(0.25, 0.016), overlay: n(0.14, 0.012),
      text: n(0.95, 0.010), "text-muted": n(0.78, 0.020), "text-subtle": n(0.62, 0.020), "text-on-accent": a(0.98, 0.010),
      border: n(0.32, 0.018), "border-strong": n(0.42, 0.020), divider: n(0.28, 0.016),
      accent: a(0.62, 0.170), "accent-hover": a(0.67, 0.170), "accent-pressed": a(0.57, 0.170), "accent-muted": a(0.40, 0.060),
      secondary: s(0.66, 0.130, hS),
      success: s(0.72, 0.150, SUCC), "success-bg": s(0.30, 0.060, SUCC), "success-text": s(0.90, 0.080, SUCC),
      warning: s(0.80, 0.140, WARN), "warning-bg": s(0.32, 0.060, WARN), "warning-text": s(0.92, 0.080, WARN),
      danger: s(0.64, 0.190, DANG), "danger-bg": s(0.30, 0.090, DANG), "danger-text": s(0.90, 0.090, DANG),
      info: s(0.70, 0.120, INFO), "info-bg": s(0.30, 0.060, INFO), "info-text": s(0.90, 0.070, INFO),
      "focus-ring": a(0.72, 0.180),
      ...series(0.70, 0.14),
    },
    light: {
      bg: n(0.99, 0.004), surface: n(0.975, 0.006), "surface-2": n(0.95, 0.008), overlay: n(0.30, 0.010),
      text: n(0.22, 0.016), "text-muted": n(0.40, 0.020), "text-subtle": n(0.50, 0.020), "text-on-accent": a(0.99, 0.006),
      border: n(0.90, 0.010), "border-strong": n(0.82, 0.014), divider: n(0.93, 0.008),
      accent: a(0.55, 0.170), "accent-hover": a(0.50, 0.170), "accent-pressed": a(0.45, 0.170), "accent-muted": a(0.92, 0.050),
      secondary: s(0.55, 0.120, hS),
      success: s(0.55, 0.150, SUCC), "success-bg": s(0.94, 0.050, SUCC), "success-text": s(0.35, 0.100, SUCC),
      warning: s(0.65, 0.140, WARN), "warning-bg": s(0.95, 0.060, WARN), "warning-text": s(0.40, 0.090, WARN),
      danger: s(0.53, 0.190, DANG), "danger-bg": s(0.95, 0.060, DANG), "danger-text": s(0.40, 0.120, DANG),
      info: s(0.55, 0.120, INFO), "info-bg": s(0.94, 0.050, INFO), "info-text": s(0.38, 0.080, INFO),
      "focus-ring": a(0.55, 0.180),
      ...series(0.58, 0.15),
    },
  };
}

// Key pairs: [fg, bg, role, target]
const PAIRS = (older) => {
  const T = older ? 7 : 4.5;
  return [
    ["text", "bg", "body-text", T], ["text", "surface", "body-text", T], ["text", "surface-2", "body-text", T],
    ["text-muted", "surface", "secondary-text", 4.5], ["text-subtle", "surface", "subtle-text", 4.5],
    ["text-on-accent", "accent", "body-text", 4.5], ["text-on-accent", "accent-hover", "body-text", 4.5], ["text-on-accent", "accent-pressed", "body-text", 4.5],
    ["accent", "bg", "ui", 3], ["accent", "surface", "ui", 3], ["focus-ring", "bg", "ui", 3], ["focus-ring", "surface", "ui", 3],
    ["border-strong", "surface", "ui", 3],
    ["success-text", "success-bg", "body-text", 4.5], ["warning-text", "warning-bg", "body-text", 4.5],
    ["danger-text", "danger-bg", "body-text", 4.5], ["info-text", "info-bg", "body-text", 4.5],
    ["success", "surface", "ui", 3], ["warning", "surface", "ui", 3], ["danger", "surface", "ui", 3], ["info", "surface", "ui", 3],
  ];
};
// Text-like tokens that may move in L to reach a target (the background stays the designed value).
const NUDGE_FG = new Set(["text", "text-muted", "text-subtle", "success-text", "warning-text", "danger-text", "info-text", "focus-ring", "border-strong"]);
const ACCENTS = ["accent", "accent-hover", "accent-pressed"];

function resolve(tok) {
  const { rgb, C, clipped } = gamutMap(tok.L, tok.C, tok.H);
  return { ...tok, C, rgb, hex: linearToHex(rgb), clipped };
}

// text-on-accent: simulate both polarities — near-white text with the accent trio darkened step by
// step, and near-black text with the trio lightened — and keep the solution that reaches the target
// with the fewest 0.01-L steps while accent stays >= 3:1 against bg and surface. Marks moved tokens.
function fixOnAccent(t, target, adjusted) {
  const base = t["text-on-accent"];
  const attempt = (pol, dir) => {
    const acc = Object.fromEntries(ACCENTS.map((k) => [k, t[k]]));
    const tok = resolve({ ...base, L: pol === "light" ? 0.98 : 0.15 });
    let steps = 0, min = Math.min(...ACCENTS.map((k) => contrast(tok.rgb, acc[k].rgb)));
    while (min < target && steps < 40) {
      for (const k of ACCENTS) acc[k] = resolve({ ...acc[k], L: Math.min(0.9, Math.max(0.2, acc[k].L + dir * 0.01)) });
      min = Math.min(...ACCENTS.map((k) => contrast(tok.rgb, acc[k].rgb)));
      steps++;
    }
    const uiOk = contrast(acc.accent.rgb, t.bg.rgb) >= 3 && contrast(acc.accent.rgb, t.surface.rgb) >= 3;
    return { pol, acc, tok, min, steps, uiOk, ok: min >= target };
  };
  const cands = [attempt("light", -1), attempt("dark", +1)];
  const rank = (c) => (c.ok && c.uiOk ? 0 : c.ok ? 1 : 2) * 1000 + c.steps - c.min / 100;
  const best = cands.sort((a, b) => rank(a) - rank(b))[0];
  for (const k of ACCENTS) if (best.acc[k].L !== t[k].L) { t[k] = best.acc[k]; adjusted.add(k); }
  if (best.pol === "dark") adjusted.add("text-on-accent");
  t["text-on-accent"] = best.tok;
}

// Data series: guarantee grayscale separability — neighbouring series (sorted by luminance) must
// differ by >= minGap; push the brighter one up (or, at the top, the darker one down) in 0.01 L steps.
function separateSeries(t, adjusted, minGap = 0.03) {
  const keys = SERIES_H.map((_, i) => `series-${i + 1}`);
  for (let guard = 0; guard < 80; guard++) {
    const sorted = keys.map((k) => ({ k, lum: luminance(t[k].rgb) })).sort((a, b) => a.lum - b.lum);
    let moved = false;
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].lum - sorted[i - 1].lum >= minGap) continue;
      const up = sorted[i].k, down = sorted[i - 1].k;
      if (t[up].L < 0.9) { t[up] = resolve({ ...t[up], L: t[up].L + 0.01 }); adjusted.add(up); }
      else { t[down] = resolve({ ...t[down], L: t[down].L - 0.01 }); adjusted.add(down); }
      moved = true; break;
    }
    if (!moved) return true;
  }
  return false;
}

export function buildPalette({ hue, accent = hue, secondary = (hue + 300) % 360, older = false, stagger = true }) {
  const spec = recipe(hue, accent, secondary, stagger);
  const themes = {}, pairs = [];
  for (const theme of ["dark", "light"]) {
    const t = {}, adjusted = new Set();
    for (const [k, v] of Object.entries(spec[theme])) t[k] = resolve(v);
    fixOnAccent(t, 4.5, adjusted);
    separateSeries(t, adjusted);
    for (const [fg, bg, role, target] of PAIRS(older)) {
      let ratio = contrast(t[fg].rgb, t[bg].rgb), guard = 0;
      if (ratio < target && NUDGE_FG.has(fg)) {
        const dir = luminance(t[bg].rgb) < 0.18 ? 0.01 : -0.01; // move away from the background
        while (ratio < target && guard++ < 60) {
          const L = Math.min(0.995, Math.max(0.05, t[fg].L + dir));
          if (L === t[fg].L) break;
          t[fg] = resolve({ ...t[fg], L });
          ratio = contrast(t[fg].rgb, t[bg].rgb);
          adjusted.add(fg);
        }
      }
      pairs.push({ theme, fg, bg, role, wcag_ratio: +ratio.toFixed(2), target, pass: ratio >= target, adjusted: adjusted.has(fg) || adjusted.has(bg) });
    }
    themes[theme] = { tokens: Object.fromEntries(Object.entries(t).map(([k, v]) => [k, { oklch: `oklch(${v.L.toFixed(3)} ${v.C.toFixed(3)} ${v.H})`, hex: v.hex, clipped: v.clipped, adjusted: adjusted.has(k) || undefined }])) };
  }
  const seriesHex = (th) => SERIES_H.map((_, i) => themes[th].tokens[`series-${i + 1}`].hex);
  const sepOf = (th) => { const l = seriesHex(th).map((h) => luminance(hexToLinear(h))).sort((a, b) => a - b); return l.every((v, i) => i === 0 || v - l[i - 1] >= 0.03); };
  const sep = sepOf("dark") && sepOf("light");
  return {
    $schema: "takt:color-system/palette@1",
    direction: "", seed: { neutral_hue: hue, accent_hue: accent, source: "cli" },
    themes, pairs,
    data_series: { dark: seriesHex("dark"), light: seriesHex("light"), grayscale_separable: sep, cvd_note: sep ? "neighbouring series differ in luminance; still eyeball red/green pairs (series-3 vs series-5)" : "two series share luminance — nudge L on one of them or keep --stagger on" },
    checks: { wcag_floor: "2.2", apca_reviewed: false, older_audience_target: older ? 7 : null, small_screen_reviewed: false, large_screen_reviewed: false, no_color_alone: null, focus_ring_distinct: null },
    evidence: [], generated_by: "scripts/palette.mjs 1.1", created: new Date().toISOString().slice(0, 10), notes: "",
  };
}

export function toCss(record) {
  const block = (sel, tokens) => `${sel} {\n` + Object.entries(tokens).map(([k, v]) => `  --${k}: ${v.oklch}; /* ${v.hex}${v.clipped ? " clipped" : ""}${v.adjusted ? " adjusted" : ""} */`).join("\n") + "\n}\n";
  return `/* generated by color-system/scripts/palette.mjs — seed H=${record.seed.neutral_hue}, accent H=${record.seed.accent_hue} */\n` +
    block(":root", record.themes.dark.tokens) + block(':root[data-theme="light"]', record.themes.light.tokens) +
    `@media (prefers-contrast: more) { :root { --text-muted: var(--text); --border: var(--border-strong); } }\n`;
}

// Refuse linked output paths so generating a palette cannot overwrite a file elsewhere.
function safeOutputDirectory(folder) {
  const absolute = path.resolve(folder), root = path.parse(absolute).root;
  let current = root;
  for (const part of path.relative(root, absolute).split(path.sep).filter(Boolean)) {
    current = path.join(current, part);
    const stat = lstatSync(current, { throwIfNoEntry: false });
    if (stat?.isSymbolicLink()) throw new Error("Refusing a symbolic link or junction in output path: " + current);
    if (stat && !stat.isDirectory()) throw new Error("Output path is not a directory: " + current);
  }
  for (const name of ["tokens.css", "palette.json"]) {
    const file = path.join(absolute, name), stat = lstatSync(file, { throwIfNoEntry: false });
    if (stat && (stat.isSymbolicLink() || !stat.isFile() || stat.nlink > 1)) throw new Error("Refusing a linked or non-regular output file: " + file);
  }
  return absolute;
}

// ---------- CLI ----------
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const args = process.argv.slice(2);
  const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
  const flag = (k) => args.includes(k);
  const hue = Number(opt("--hue", NaN));
  if (!Number.isFinite(hue)) { console.error("usage: node palette.mjs --hue <0-360> [--accent <0-360>] [--json] [--css] [--older] [--no-stagger] [--out dir]"); process.exit(2); }
  const rec = buildPalette({ hue, accent: Number(opt("--accent", hue)), older: flag("--older"), stagger: !flag("--no-stagger") });
  const requestedOut = opt("--out");
  const out = requestedOut ? safeOutputDirectory(requestedOut) : undefined;
  if (out) { mkdirSync(out, { recursive: true }); writeFileSync(path.join(out, "tokens.css"), toCss(rec)); writeFileSync(path.join(out, "palette.json"), JSON.stringify(rec, null, 2)); console.log("wrote", path.join(out, "tokens.css"), "and", path.join(out, "palette.json")); }
  if (flag("--css")) process.stdout.write(toCss(rec));
  if (flag("--json")) process.stdout.write(JSON.stringify(rec, null, 2) + "\n");
  if (!flag("--css") && !flag("--json") && !out) {
    const fails = rec.pairs.filter((p) => !p.pass), adj = rec.pairs.filter((p) => p.adjusted);
    console.log(`seed H=${hue} accent H=${rec.seed.accent_hue}  pairs=${rec.pairs.length}  fail=${fails.length}  adjusted-pairs=${adj.length}  series grayscale-separable=${rec.data_series.grayscale_separable}`);
    for (const th of ["dark", "light"]) {
      console.log(`\n[${th}]`);
      for (const [k, v] of Object.entries(rec.themes[th].tokens)) console.log(`  --${k.padEnd(15)} ${v.oklch.padEnd(26)} ${v.hex}${v.clipped ? "  clipped" : ""}${v.adjusted ? "  adjusted" : ""}`);
    }
    console.log("\n[pairs]");
    for (const p of rec.pairs) console.log(`  ${p.theme.padEnd(5)} ${(p.fg + "/" + p.bg).padEnd(30)} ${String(p.wcag_ratio).padStart(6)} : 1  target ${p.target}  ${p.pass ? "PASS" : "FAIL"}${p.adjusted ? "  (adjusted)" : ""}`);
  }
  process.exit(rec.pairs.some((p) => !p.pass) ? 1 : 0);
}
