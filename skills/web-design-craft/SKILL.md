---
name: web-design-craft
description: Build or review premium, distinctive websites and web apps — composition, grid, spacing rhythm, fluid
  typographic scale, section architecture, component states and motion hierarchy — with a repeatable Direction-first
  method, adaptable ranges and a machine-readable design-direction record, NOT fixed pixel values or a copied brand.
  Use for any web surface (landing, marketing, product UI, dashboard, portal, docs) when generating, redesigning
  or auditing layout, hierarchy, interaction or polish, and whenever a page risks looking machine-templated. Delegates
  exact color to color-system, the written spec to design-craft, rich animation/graphics to motion-and-graphics.
  Do not use for native/mobile-app UI or for copy-only tasks.
metadata:
  creator: Cadence project
  created: '2026-10-16'
  creation-method: Editorial Markdown guide written in the Cadence repository. Distilled from close multi-viewport
    analysis of a premium reference site plus accepted layout, typography and motion practice into an adaptable
    method with ranges, a direction record schema and a dependency-free fluid type-scale generator. Revised 16.10.2026
    to the library's operating structure.
  purpose: Give every website and web app Cadence builds a deliberate, premium, non-generic surface — agency-grade
    composition, type, motion and component states that adapt per product — and leave a direction record other agents
    can read and continue from.
  scope: Installation-wide; attached to website, landing, web-app and interface tasks in every connected project.
    Owns web layout, rhythm, typography, section architecture, component states and interaction polish. color-system
    owns color, design-craft owns the design specification, motion-and-graphics owns rich animation and graphics.
---

# Web design with intention

A premium web surface is a **system of decisions** — grid, rhythm, type scale, section shapes, component states, motion — made once, deliberately, and held everywhere. The product supplies content, brand and color; the craft rules stay constant.

**Use when:** generating, redesigning or auditing a web page/app's layout, hierarchy, typography, components, interaction or polish; when the result must not look templated.
**Don't use when:** the task is only color (→ color-system), only the written spec (→ design-craft), a native/mobile app, copywriting only, or the brief forbids touching an established customer-facing design (then audit only).

## Inputs you need first
1. **Archetype + job:** landing / marketing / product UI / dashboard / portal / docs — convince, convert, operate or inform?
2. **Audience + content reality:** reading age, density tolerance, languages, real copy and media (not lorem).
3. **Brand constraints:** existing type, logo, tone; tokens from color-system (or a seed hue to request one).
4. **Viewport targets:** phone (≤480), tablet, laptop, very large (≥1920) — all four, always.
5. **Existing system:** design tokens, component library, spacing/type scale already in the codebase — extend, never duplicate.

## Output contract
- The **implemented surface** (or review findings) built from one scale, one grid, one state matrix, one motion system.
- A **design-direction record** (`assets/design-direction-record.md`, JSON): direction (archetype, adjectives, density, signature move), container/grid, spacing scale, fluid type scale with roles, section inventory with shape alternation, component/state coverage, motion bands, responsive and accessibility checks, evidence. Stored next to the design spec (e.g. `docs/design/direction.json`) and referenced from the spec design-craft owns.
- `scripts/type-scale.mjs` emits the fluid type + spacing scale as CSS variables and as the record's `type_scale`/`spacing_scale` blocks.

## Method (Direction first, ranges not pixels)
1. **Write the direction** (3–4 lines) before any layout: archetype + job · 3–5 adjectives · density & voice (spacious-editorial ↔ dense-utilitarian; loud display ↔ quiet restraint) · **one signature move** (a headline device, a trailing-arrow link, an oversized stat band, a strict mono accent) repeated throughout. Every later tie is resolved by this text.
2. **Set the scales.** One spacing base (4 or 8px) and a stepped scale; one modular type ratio (≈1.2 dense → 1.333 editorial → ≤1.5 dramatic) made fluid with `clamp()` between a phone and a desktop scale (`scripts/type-scale.mjs`). Record both.
3. **Lay the grid.** A centred container (≈1100–1320px marketing; wider/fluid for apps) with honest gutters (≥16–24px phone); a 12-column (or 8-column app) grid used for **deliberate asymmetry** (7/5, 8/4) over 6/6 and 4/4/4; full-bleed bands with contained content; one dominant alignment per section.
4. **Build sections from one skeleton, varying the content shape:** eyebrow → one strong title (signature move lives here) → short deck → content block → single CTA. Alternate shapes (asymmetric split · 3-up grid · media-left/right · stat band · demo · editorial list) so no two adjacent sections match. Hero: largest type, most air, one primary + one secondary action. Credibility layer (proof numbers, press strip, honest metadata) designed, not bolted on.
5. **Specify every component's states** (default · hover · active/pressed · focus-visible · disabled · loading; cards: resting + hover lift + featured; links: animated underline/arrow). Radius set (control / card / pill) and a 2–4 step elevation ramp, applied consistently. Anything that looks interactive is interactive and shows it.
6. **Give motion a hierarchy.** Micro feedback ≈80–160ms · UI transitions ≈200–400ms · hero/page ≈400–800ms; custom ease-out/in-out, springs only for playful directions; scroll reveals rise a small distance (8–24px) with 40–80ms stagger, once, slightly before in-view; `prefers-reduced-motion` path mandatory.
7. **Reflow for the extremes.** Phone: single column, re-ordered priority, 44px targets, real menu. Very large: cap measure and container, scale hero type up, don't stretch 3 sparse cards across 2400px. **View every size in a real browser; fix clipping/overlap before claiming anything.**
8. **Verify, record, hand over.** Run the done list, write the direction record, feed scale + components into the design spec (design-craft), attach screenshots (responsive-evidence).

Worked spacing/type values, section catalog and grid patterns: `assets/web-craft-method.md`. Easings, durations, state matrix, radius/elevation: `assets/motion-system.md`.

## Typography rules that carry the most weight
- ≤ 2 families (display with character + legible text; mono only for code). Display: **large**, tight leading (0.95–1.1), slightly negative tracking. Body: 1.5–1.7 leading, 60–75 character measure (32–40 on phones).
- A distinct **eyebrow/label** role: small, uppercase, wide tracking (0.08–0.16em), muted or accent color.
- Secondary text uses the `--text-muted` role from color-system, never a random smaller grey; one element is "largest" per view.

## Accessibility (non-negotiable)
Contrast per color-system (4.5 / 3 / focus 3) in every theme · full keyboard operability with visible `:focus-visible` and managed dialog focus · real landmarks, heading order, labels, alt, `aria` only where native falls short · never meaning by color or motion alone · usable at 200% zoom and with reduced motion.

## Anti-patterns (the default-AI website)
Centred hero: headline + paragraph + two buttons + gradient blob · three identical outline-icon feature cards · everything the same size, nothing dominant · borders on everything · one global section padding (`py-16` everywhere) · unstyled default Inter/Arial as "brand" · the same 0.3s fade-up on every element · lorem content shaping real layout · 2400px-wide 3-column grids.

## Done when
- [ ] Direction written first; the hero visibly expresses it and the signature move repeats.
- [ ] One spacing scale; intra-component vs inter-section rhythm clearly different.
- [ ] Fluid modular type scale with real display size, tight display leading and an eyebrow role; measure held at all sizes.
- [ ] One focal element per section; adjacent sections differ in shape; grid asymmetry is deliberate.
- [ ] Every interactive element has hover / active / focus-visible / disabled (/ loading); links share one device.
- [ ] Motion has three bands and honours `prefers-reduced-motion`.
- [ ] Phone, tablet, laptop and very-large views checked in a real browser; no clipping or overlap.
- [ ] Contrast, keyboard, semantics pass; color delegated to color-system tokens.
- [ ] Direction record written and referenced from the design spec; screenshots attached.

## Works with (library handoffs)
- **color-system** — provides every token you use (`--text-muted`, `--accent*`, elevation surfaces); request a palette with your direction line, never pick colors here.
- **design-craft** — owns the canonical design specification; you deliver scale, grid, component inventory and the direction record into it.
- **motion-and-graphics** — owns rich animation, canvas, 3D and charts; you set the motion *bands* and hand complex pieces over.
- **usability-review** — checks task behaviour and copy clarity on the built surface.
- **responsive-evidence** — produces the four-size screenshots that become your record's `evidence`.
- **ab-testing** — when two directions or heroes compete; keep accessibility a guardrail, never a weighted trade-off.

## Reference files (read on demand)
Read the following files directly from this skill folder:
- `assets/web-craft-method.md` — the full Direction-first method with worked spacing scales, modular type scale and `clamp()` examples, section-architecture catalog, grid/layout patterns, responsive rules.
- `assets/motion-system.md` — easing curves, duration bands, scroll-reveal and hover patterns, the component/state matrix, radius/elevation systems, reduced-motion path.
- `assets/design-direction-record.md` — the machine-readable direction record (JSON schema, filled example, read-back rules).

Scripts (run in Claude/Codex or copy into the project; dependency-free Node ≥ 18):
- `scripts/type-scale.mjs --base 16 --ratio 1.25 [--ratio-sm 1.2] [--min-vw 360 --max-vw 1280] [--unit 4] [--css|--json]` — fluid modular type scale (`clamp()` per step, named roles) and the spacing scale, as CSS variables or as the record's JSON blocks.
