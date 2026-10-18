# Cadence tokens

The ready-to-paste file is `assets/takt-tokens.css` (all themes, identity palette, base reset).
This page explains what each token is for and where it came from, so you can pick the right one.

Provenance: Cadence repo `src/renderer/style.css:1-29` (core tokens), `desktop.css:1458-1471`
(design system v2: radii and heights), `ui-v3.css` (buttons, menus, settings, switch),
`ui-v4.css` (badges, dialog forms), `ui-v7.css` (charts, usage dashboard), `scripts/theme-palette.mjs`
(theme derivation), `charts.js:8-9` (data palette). Values as of 06.10.2026.

## Contents
1. Colour system and how themes are derived
2. Surfaces, lines, text
3. Brand red
4. Semantic colours
5. Identity palette (agents, people, tags)
6. Data colours
7. Typography
8. Spacing, radii, sizes
9. Elevation, z-order
10. Motion

---

## 1. Colour system

- **Dark is the designed source.** Every other theme is a rule-based derivation of the dark palette,
  so a new colour automatically appears in every theme. Cadence's build replaces every hex in its CSS with
  `var(--p-<hex>)` and computes one palette block per theme (`theme-palette.mjs`).
- **Brand red and saturated mid-tones never change** across themes (rule: saturation > 0.6 and
  lightness 0.35–0.62 stay fixed). White text on red keeps working everywhere.
- Derivation rules (use these if you need a colour that is not in the token file):
  - **Light:** neutral surfaces flip so that *higher* dark layers become *lighter* light layers
    (cards above the page). Dark lightness `l < .14` → `0.93 + (l − .07) · 0.9`; `l ≤ .5` → `1 − l · 0.94`;
    text (`l > .5`) → `(1 − l) · 0.85`. Neutral saturation capped at 0.14. Saturated dark tints
    (e.g. selected dark red) become a faint tint at `l ≈ .93–.97`. Dark shadows stay dark at 35 % alpha.
  - **Graphite:** neutrals keep their lightness, hue 220°, saturation ≤ 0.12 (cool steel).
  - **Midnight:** neutrals become night blue: surfaces hue 224° sat .34; text hue 222° sat ≤ .22.
  - **Sand:** the light result, neutrals re-hued to 36° (warm paper), sat .34 / .20 / .14 by lightness.
  - **System ("Wie Windows"):** dark, or light under `prefers-color-scheme: light`.
- **Every theme must reach 4.5:1 for text** (Cadence runs `verify:themes`). Measured: dark text/page
  16.4:1, muted 8.9:1, quiet 6.2:1; light text 16.4:1, muted 9.0:1, quiet 6.0:1; white on red 5.25:1.
- Never define a colour for only one theme. If you add one, add it to every theme block (or derive it).

## 2. Surfaces, lines, text (dark → light)

| Token | Dark | Light | Use |
|---|---|---|---|
| `--rail` | `#0c0b0d` | `#e8e6ea` | sidebar / navigation rail, darkest |
| `--page` | `#111013` | `#ecebee` | app background ("ink") |
| `--subnav` | `#141215` | `#efedf0` | settings sub-navigation, empty-state fill |
| `--panel` | `#161418` | `#f1f0f2` | quiet outer container (settings panel, dashboard section) |
| `--field` | `#171518` | `#f2f0f2` | inputs, textarea |
| `--surface` | `#19171b` | `#f4f3f4` | cards, listbox, dialog body |
| `--surface-soft` | `#1b181c` | `#f5f4f5` | segmented track, dialog footer |
| `--surface-raised` | `#211e23` | `#fafafb` | hover on surface, KPI tile |
| `--line` | `#3b3239` | `#d0c8ce` | strong hairline: table header, trigger border |
| `--line-soft` | `#2b252c` | `#dbd6dc` | default divider everywhere |
| `--line-faint` | `#221e24` | `#e3dfe4` | rows inside a panel |
| `--panel-line` | `#262127` | `#dfdae0` | 1 px border of quiet containers |
| `--field-line` | `#4a4047` | `#c3b9c0` | input border; hover `#6b4a55`, open `#80515d` (reddish!) |
| `--text` | `#f1edf0` | `#0f0c0e` | primary text (warm off-white, never pure #fff) |
| `--muted` | `#b8afb6` | `#443c42` | secondary text, hints, inactive nav |
| `--quiet` | `#9b9098` | `#5e555c` | meta, captions, caps kickers, counts |

The neutrals are **warm, slightly violet-red greys** (hue ≈ 300–340°, very low saturation). That warmth
is what makes the red feel at home; avoid pure neutral greys or blue-greys in the default theme.

Surface steps are tiny (≈ 2–4 % lightness). Hierarchy comes from space and type first, then a
hairline, then a surface step — never from heavy borders or shadows.

## 3. Brand red

| Token | Value | Use |
|---|---|---|
| `--accent` | `#d0102e` | primary button fill, active tab underline, switch on, selected tile ring, progress value, live "in progress" dot |
| `--accent-strong` | `#f0445b` | red text on dark: links, current nav item text, "As table" links, spinner arc |
| `--accent-hover` | `#ff6570` | primary button hover (Cadence original; brief state) |
| `--accent-soft` | `#351017` (light `#faeef0`) | selected nav item, selected option, segmented/view-switch selection, option-card hover |
| `--accent-line` | `#86434d` | border of the current card / project |
| `--accent-ink` | `#fff7f8` | text on red |
| `--focus` | `#ff9aa2` (light `#60050c`) | 2 px focus ring, offset 2–3 px |

Rules: red marks **action, selection and attention**. It is never a large background, never the only
carrier of meaning, and never decoration. One filled red button per area.

## 4. Semantic colours

| Meaning | Ink | Tint bg | Line | Notes |
|---|---|---|---|---|
| success / done / connected / running | `#a5d7b6` | `#16261c` | `#3f6b52` | running cards: green inset edge 3 px + "working" |
| warning / pending / waiting | `#e6c578` | `#2a2314` | `#6b5a2e` | "decision needed" pulsing dot |
| danger / error | `#ff978c` text, `#ff9aa2` ink | `#35151b` | `#7a2f3b` | error counts, failed |
| info / live data | `#9cc8f0` | `#16222e` | — | "Live" status pill |
| attention (needs YOUR action) | `#d9a13a` | `#261e16` | — | amber card glow, amber fill on the one button to press, ink `#f0c37e` |

Status is always **dot/icon + word + colour**, never colour alone.

## 5. Identity palette

Twelve calm colours, each as a triple: soft fill / line / ink. Used for agent or person badges,
the emoji tile behind them, a coloured chip in history rows. Names: ruby, violet, amber, teal, blue,
pink, green, orange, cyan, lilac, lime, slate (exact values in `takt-tokens.css`, light variants
included). Apply with `data-color="teal"` on any element and read `--c-soft`, `--c-line`, `--c-ink`.
A user picks the colour; a sensible default comes from the role.

## 6. Data colours

- Categorical series (charts.js): `#3987e5` blue, `#d95926` orange, `#199e70` green, `#c98500` ochre,
  `#d55181` pink, `#008300` deep green, `#9085e9` violet, `#e66767` coral. Cycle in this order.
- Process/step status: done `#3f9a68`, running `#d29a3c`, failed `#e05a5a`, rework `#b0703f`,
  waiting `#7d7383`, queued `#8b8090`.
- Diff: add `#7fc79a`, modify `#d9b36b`, delete `#e0707c` (monospace counts `+12 ~3 −1`).
- Chart chrome: grid `#2a252d` 1 px, axis text `#8d808b` 11 px tabular, line stroke 2 px round joins,
  dots with 2 px stroke in the card colour, crosshair 1 px dashed `3 3`.
- Terminal: 16 ANSI colours on `#0d0c0e` (fg `#e5e1e4`) — see components.md if you need them.

## 7. Typography

- Family: **Segoe UI Variable → Segoe UI → system-ui**. It is a Windows-native product; on the web
  fall back to system-ui (Inter is an acceptable stand-in). No display or decorative fonts.
  Mono: Cascadia Mono / Cascadia Code / Consolas. Emoji: Segoe UI Emoji stack.
- `font-synthesis: none; text-rendering: optimizeLegibility`. Variable weights are used in fine steps.
- `font-variant-numeric: tabular-nums` on every number that can change or sits in a column
  (counts, times, tokens, percentages, versions).

| Role | Size | Weight | Tracking / LH |
|---|---|---|---|
| Hero number (dashboard) | 34 px | 650 | −0.035em, lh 1.05 |
| Page title h1 | 25–26 px (22 in settings, 21 subnav title) | 620–640 | −0.025em, lh 1.2 |
| Agent/entity hero name | 22 px | 660 | −0.01em |
| Section / dialog title | 18–19 px | 600–660 | −0.018em, lh 1.3–1.35 |
| KPI value | 19–20 px | 620–650 | −0.02em |
| Panel / card section title | 15 px | 620–640 | |
| Body / page intro | 15 px | 400 | lh 1.55–1.65, max 65–70ch |
| Reading (markdown, help) | 14.5 px | 400 | lh 1.65, column ≤ 820 px |
| Label, button, nav item | 13.5 px | 600 (labels), 400 (nav) | |
| UI text (menus, rows, inputs dense) | 13 px | 400–560 | |
| Hint under a label | 12.5 px | 400 | lh 1.5 |
| Meta, table head, card meta | 12 px | 400–600 | |
| Caps kicker / group heading | 11.5 px | 650 | +0.06em, UPPERCASE |
| Smallest (axis, quota, version) | 11 px (10.5 for the topbar purpose line) | | |

Users explicitly asked for **bigger** text after a too-small first version (27.09.2026):
the floor is 11.5–12 px, body 13.5–15 px, headings 17–28 px.

## 8. Spacing, radii, sizes

- Spacing rhythm (px): 2 · 4 · 6 · 8 · 10 · 12 · 14 · 16 · 18 · 22 · 26 · 34 · 38. Gaps inside controls
  6–10, between controls 8, between rows 10–14 vertical padding, between sections 16–26, between
  dashboard bands 38. Page padding `clamp(18px,1.6vw,28px) clamp(20px,2.1vw,38px)`.
- Radii: **4** state chips/tags · **6** controls (`--radius-control`) · **8** cards, menus, rows
  (`--radius-panel`) · **10** dialogs, settings panels, listbox (`--radius-dialog`) · **12–14** large
  dialogs, chart cards, canvases. Full pills **only** for counters, status pills, chips, switches.
- Heights: control 34 (`--control-h`), small 28, dialog-form fields 40, combobox trigger 38,
  nav items 34, list rows ~46 (8 px padding + two lines), settings rows ≥ 52, topbar 62 (53 narrow).
- Icons: 15 px in controls, 17 px in navigation, 13–14 px in chips; stroke 1.45–1.6, round caps/joins,
  `fill: none; stroke: currentColor`.

## 9. Elevation and z-order

Shadows are deep and soft and only on things that float:
toast `0 8px 24px #0006` · tooltip `0 12px 30px #000a` · listbox `0 14px 34px #0009` ·
menu `0 18px 44px rgb(0 0 0/.55)` · dialog `0 24px 70px #000c` · modal `0 28px 80px rgb(0 0 0/.6)`.
Backdrops: `rgb(6 5 8/.78)` + `backdrop-filter: blur(2px)` (node dialog `#08070bc4` + blur 3px).
Cards and panels on the page have **no** shadow. Light theme: same geometry, ~35 % of the alpha.
z: task dialog 45 · toast/node dialog 60 · modal question 70 · tooltip/listbox 80 · context menu 120.

## 10. Motion

| What | Duration | Easing |
|---|---|---|
| Hover colour/background/border | 140–160 ms | ease |
| Option/row background | 120 ms | ease |
| Context menu in | 90 ms, from `translateY(-3px) scale(.98)` + fade | ease-out |
| Dialog in | backdrop fade 140 ms; panel 160 ms from `translateY(8px) scale(.985)` | ease-out |
| Toast | 180 ms, from `translateY(7px)` + fade | ease |
| Switch knob | 140 ms translateX(14px) | ease |
| Chevron rotate / arrow nudge | 140–160 ms; arrow `translateX(3px)` on hover | ease |
| Spinner | 800–850 ms linear (2.4 s under reduced motion — slows, never stops) | linear |
| Live dot pulse | 1.8 s opacity 1 → .35 | ease-in-out, infinite |
| Decision dot pulse | 1.6 s ring 4 → 7 px | ease-in-out, infinite |
| Needs-action card glow | 2.4 s, **3 times only** | ease-in-out |
| Explanatory flow animation | 7.5 s loop | `cubic-bezier(.6,0,.3,1)` |

Exits are instant or shorter than entrances. Under `prefers-reduced-motion: reduce` pulses and
entrances stop, spinners slow down.
