---
name: color-system
description: Build or fix the color foundation of any interface — palette, semantic roles, light/dark themes, design
  tokens and accessible contrast — as a repeatable OKLCH method with a machine-readable palette record, NOT a fixed
  brand palette. Use for any frontend, website, app, dashboard or game task that chooses, derives, audits or re-themes
  colors, defines color tokens, fixes weak contrast, or replaces generic default AI colors (indigo/purple gradients,
  untouched framework defaults). Covers legibility on very small to very large screens and for older eyes. Do not
  use for layout/typography (web-design-craft), for the written design spec (design-craft), or when the product's
  established palette must stay untouched.
metadata:
  creator: Cadence project
  created: '2026-10-16'
  creation-method: Editorial Markdown guide written in the Cadence repository. Perceptual-color method (OKLCH),
    WCAG 2.2 and APCA contrast rules, a CSS-variable token contract and a machine-readable palette record, condensed
    from accepted color and accessibility practice. Reference files carry worked values; dependency-free Node scripts
    generate and verify palettes. Revised 16.10.2026 to the library's operating structure.
  purpose: Give every interface Cadence builds a deliberate, accessible, non-generic color foundation that adapts
    per product instead of repeating the same default AI palette — and leave behind a palette record other agents
    can read.
  scope: Installation-wide; attached to interface and color tasks in every connected project. Owns the color method
    and the palette record. web-design-craft owns layout/type/motion, design-craft owns the design specification,
    takt-design is one optional house palette.
---

# Color with intention

A color system is **rules and roles, not favourite swatches**. This skill gives the method; the product supplies its hues. The rules below never change; the values do.

**Use when:** a task picks, derives, audits or re-themes colors; defines color tokens; needs light + dark; has weak contrast; or is about to ship default-AI colors.
**Don't use when:** the brief says keep the existing palette (then only audit contrast); the task is layout/type/motion (→ web-design-craft); you only need the written spec (→ design-craft).

## Inputs you need first
1. **Direction** in words: mood (calm / warm / clinical / editorial / energetic) + primary surface (light, dark, both). Ask or derive from audience and content.
2. **Brand hue**, if one exists — read its OKLCH hue `H`. If none, choose `H` from the mood (table in `assets/palette-recipe.md`).
3. **Themes required** (dark, light, both) and **audience constraints** (older users → higher contrast; outdoor/phone-first → fewer hairlines).
4. **Existing token layer** (CSS variables, Tailwind theme, design tokens) — extend it, never run a second one beside it.

## Output contract
Every run leaves behind:
- **Tokens** in the project's token layer (`--bg`, `--surface`, `--text`, `--accent`, semantic, focus, data series — full set in `assets/tokens-template.css`), for every supported theme.
- A **palette record** (`assets/palette-record.md` schema, JSON): direction, seed hues, every token as OKLCH + hex per theme, the **measured contrast of the key pairs**, pass/fail, and the checks run. Another agent must be able to read it back and reproduce or audit the palette. Store it next to the design spec (e.g. `docs/design/palette.json`) and reference it from the spec that design-craft owns.
- Short note in the design specification: method, seed hue(s), measured ratios.

`scripts/palette.mjs` produces the tokens, the CSS and the record from a hue and verifies contrast; `scripts/contrast.mjs` checks any two colors. In Cadence sessions (scripts not exposed), compute with the formulas in `assets/palette-recipe.md`.

## Method (work in OKLCH)

OKLCH (`oklch(L C H)`) is perceptual: equal `L` steps look equal, equal `L` across hues weighs equal — HSL cannot promise either. Convert to hex only at the end; keep OKLCH in the record.

1. **Direction → seed.** One brand hue `H` seeds neutrals and accent. Write the direction line into the record first.
2. **Neutrals, tinted.** 10–12 step ramp at low chroma (`C` ≈ 0.01–0.03) toward `H`, evenly spaced in `L` (dark surfaces ≈ 0.16–0.26; text ≈ 0.92–0.97; light theme re-picked, not inverted). Near-black / near-white at the ends, never `#000`/`#FFF`.
3. **Accent + states.** One accent with chroma the neutrals lack; `hover`/`pressed` as ±0.04–0.06 `L`, not new hues; `accent-muted` low-chroma for tints; `text-on-accent` verified ≥ 4.5:1.
4. **Semantic colors.** success / warning / danger / info at expected hues (green / amber / red / blue), each with `-bg` and `-text`, tuned into the same family and contrast-checked. Meaning only — never decoration; accent is never also danger.
5. **Elevation.** Dark: raise by getting lighter (2–4 levels). Light: near-white surfaces + soft shadow + a hair of `L` drop behind.
6. **Data colors.** Categorical: hold `L`/`C`, step `H` evenly; check grayscale and CVD separability. Sequential: hold `H`, ramp `L`. Diverging: two hues to a neutral middle.
7. **Verify, record, hand over.** Measure every key pair per theme (section below), fix failures by moving `L` (not by adding hue), write the record, update the spec.

Worked `L`/`C`/`H` tables, re-seeding for a brand, and the contrast math: `assets/palette-recipe.md`.

## Contrast and accessibility (floor, not goal)
- Text ≥ **4.5:1** on its surface; large text (≥ 24px, or ≥ 19px bold) and meaningful icons ≥ **3:1**; focus ring ≥ 3:1 against neighbours and visibly distinct from hover. Measure in **every** theme.
- Prefer **APCA** (`|Lc|` ≈ 75 body, 60 large, 45 UI) for judgement; WCAG numbers remain the floor.
- **Never color alone** — pair every color-coded state with text, icon or shape (CVD ≈ 1 in 12 men).
- State measured ratios in the record and the spec. "Accessible" without numbers is a claim, not a check.

## Legibility across screens and ages
- **Small (≤ 640px):** raise contrast slightly; 1px dividers and subtle surface shifts vanish on dim phones — carry no meaning in hairlines.
- **Very large (≥ 1920px):** big flat fills show banding and over-saturate; lower chroma on large backgrounds, keep accents findable across a room.
- **Older audiences:** aim body text ≥ **7:1**; no meaning on blue-vs-black or fine blue detail; no saturated blue small text; must survive 200% zoom and forced high-contrast modes (`prefers-contrast: more` block in the template).

## Anti-patterns (the default-AI palette)
Indigo/violet accent (`#6366F1`–`#8B5CF6`) with a blue→purple gradient on everything · untouched Tailwind `slate`/`indigo`, Bootstrap blue, Material `#1976D2` as "brand" · teal→purple or pink→orange gradients as decoration · pure `#000` on pure `#FFF` · grey text picked by eye · the same five pastels on every chart · hex values scattered in components instead of tokens · a light theme made by inverting the dark one.

## Done when
- [ ] Direction, seed `H` and themes recorded before any value was chosen.
- [ ] Every text/surface pair meets its target in each theme — numbers in the record.
- [ ] Focus ring visible and distinct from hover; no meaning on color alone.
- [ ] Accent, semantic and data colors separable in grayscale and for CVD.
- [ ] No framework default or default-AI gradient stands in for the brand.
- [ ] Tokens are the single source in the project's token layer; the palette record exists and the design spec references it.
- [ ] Checked at phone brightness and, if relevant, on a very large display.

## Works with (library handoffs)
- **web-design-craft** — owns layout, spacing, typography, motion; it *consumes* your tokens. Give it `--text-muted`, `--accent`, elevation steps; it never invents colors.
- **design-craft** — owns the canonical design specification; you deliver the palette record and the measured ratios into it.
- **takt-design** — one optional house palette (graphite + red); treat it as a seed example, not a requirement.
- **ab-testing** — when two palettes compete, it decides; keep contrast a **guardrail** (veto), never a weighted trade-off.
- **usability-review** / **responsive-evidence** — verify the rendered result at real sizes; attach their screenshots to the record's `evidence`.

## Reference files (read on demand)
In Cadence, call `takt_skill_reference` with `skill: "color-system"` and one of:
- `assets/palette-recipe.md` — full recipe with worked OKLCH values, dark + light example palettes, semantic and data-color tables, re-seeding for a brand, WCAG/APCA math.
- `assets/tokens-template.css` — complete light + dark `--token` set to copy into the project and re-seed.
- `assets/palette-record.md` — the machine-readable palette record (JSON schema, example, how an agent reads it back).

Scripts (run in Claude/Codex or copy into the project; dependency-free Node ≥ 18):
- `scripts/palette.mjs --hue 250 [--accent 255] [--json] [--css]` — generates both themes from a seed hue with gamut-safe OKLCH→hex, measures all key pairs, auto-nudges failing text tokens, emits CSS + the palette record.
- `scripts/contrast.mjs <colorA> <colorB>` — WCAG ratio and pass/fail bands for hex or `oklch()` inputs.
