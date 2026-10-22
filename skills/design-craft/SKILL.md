---
name: design-craft
description: Give a web, desktop or game interface a deliberate visual direction — composition, grid, spacing
  rhythm, fluid type scale, section architecture, component states and motion bands — and record it once in
  docs/DESIGN.md so another agent can reproduce it. Use when creating, redesigning or auditing how an interface
  looks, and whenever a result risks looking like a generic AI template. Not for exact palettes (color-system),
  rich animation or 3D (motion-and-graphics), or checking the running result (interface-review).
metadata:
  creator: Cadence project
  created: '2026-09-30'
  updated: '2026-10-22'
  origin: Merges the former design-craft and web-design-craft skills into one method with one design record.
---

# Design with intention

A good surface is a **system of decisions** — direction, grid, rhythm, type scale, section shapes, component states, motion — made once and held everywhere. The product supplies content, brand and colour; the craft rules stay constant. Avoid vague goals such as "make it modern".

## Inputs first
1. **Existing sources:** brand, tokens, component library, an existing `docs/DESIGN.md` or equivalent, `AGENTS.md` rules. Extend what exists; never run a second design system beside it. If the brief forbids touching an established design, audit only.
2. **Archetype and job:** landing, marketing, product UI, dashboard, portal, docs, desktop tool, game HUD — does it convince, convert, operate or inform?
3. **Audience and real content:** density tolerance, languages, real copy and media. Lorem shapes layouts wrongly.

## Method
1. **Write the direction (3–4 lines) before any layout:** archetype and job · 3–5 adjectives · density and voice (spacious-editorial ↔ dense-utilitarian) · **one signature move** repeated throughout (a headline device, a trailing-arrow link, an oversized stat band, a strict mono accent). Every later tie-break cites this text.
2. **Set the scales.** One spacing base (4 px dense, 8 px default) with a stepped ramp; intra-component rhythm (4–24 px) clearly separate from inter-section rhythm (64–128 px, scaled with `clamp()`). One modular type ratio (≈1.2 dense → 1.25 balanced → 1.333 editorial → ≤1.5 dramatic), fluid between phone and desktop: `node scripts/type-scale.mjs --base 16 --ratio 1.25 --ratio-sm 1.2 --css`. Never hand-type a one-off margin.
3. **Lay the grid.** A centred container (≈1100–1320 px marketing; fluid for apps), gutters ≥ 16 px on phones, 12 columns (8 for apps) used for deliberate asymmetry (7/5, 8/4) rather than default 6/6 and 4/4/4. One dominant alignment per section; full-bleed bands with contained content.
4. **Build sections from one skeleton** — eyebrow → one strong title → short deck → content block → single CTA — and vary the content shape (asymmetric split, 3-up grid, media left/right, stat band, demo, editorial list) so adjacent sections differ. App views: one primary action and one clear reading order per page.
5. **Specify every component state:** default, hover, pressed, `:focus-visible` (2 px ring, ≥ 3:1), disabled, loading; per view also empty, error, dense and narrow. A small radius set (control / card / pill) and a 2–4 step elevation ramp, applied consistently. Anything that looks interactive responds visibly.
6. **Give motion a hierarchy:** micro feedback 80–160 ms · UI transitions 200–400 ms · hero/page 400–800 ms; ease-out entrances, ease-in exits; reveals rise 8–24 px once with 40–80 ms stagger; a `prefers-reduced-motion` path always. Rich animation, canvas and 3D go to motion-and-graphics.
7. **Reflow, don't shrink.** Phone: one column, re-ordered priority, 44 px targets, real menu. Very large: cap measure and container, scale the hero up, never stretch three sparse cards across 2400 px. Check in a real browser (interface-review).
8. **Record and hand over.** Write or update `docs/DESIGN.md` from `assets/design-template.md`: actual tokens and paths, type and spacing scales, grid, component inventory and states, adaptation, accessibility results, and links to evidence. Small edits update only the affected decisions.

## Typography that carries the weight
- At most two families (display with character + legible text; mono only for code or labels). Prefer local/system fonts and respect licences and network permissions.
- Display large with tight leading (0.95–1.1) and slightly negative tracking; body 14–18 px, leading 1.45–1.7, measure 55–75 ch (32–40 on phones).
- A distinct eyebrow role: small, uppercase, tracking 0.08–0.16 em. Tabular numerals for tables and metrics. Exactly one "largest" element per view.

## Accessibility (floor)
Contrast via color-system tokens in every theme (4.5:1 text, 3:1 large text, icons and focus) · semantic HTML, heading order, labels, accessible names for icon buttons · full keyboard operation with Escape/Enter and managed dialog focus · hit areas ≥ 32 px desktop, ≥ 44 px touch · never meaning by colour or motion alone · usable at 200 % zoom.

## Anti-patterns (the default-AI interface)
Centred hero with headline + paragraph + two buttons + gradient blob · three identical outline-icon feature cards · violet-blue gradients · emoji as icons · borders and shadows on every box, nested cards, tile walls · one global section padding everywhere · unstyled Inter/Arial as "brand" · the same 0.3 s fade-up on every element · everything the same size · placeholder copy in shipped UI.

## Done when
- [ ] Direction written first; the main view expresses it and the signature move repeats.
- [ ] One spacing scale and one fluid type scale; nothing off-scale.
- [ ] Adjacent sections differ in shape; grid asymmetry is deliberate; one focal element per view.
- [ ] Every interactive element has all states; motion has three bands and a reduced-motion path.
- [ ] Colours come from tokens; accessibility floor met.
- [ ] `docs/DESIGN.md` matches the final code and links interface-review evidence.

## Reference files (read on demand)
- `assets/design-template.md` — sections and completeness guide for `docs/DESIGN.md`.
- `assets/web-craft-method.md` — worked spacing and type scales, `clamp()` examples, section catalog, grid and responsive rules.
- `assets/motion-system.md` — easings, duration bands, reveal and hover patterns, the component/state matrix, radius and elevation sets, reduced motion.
- `scripts/type-scale.mjs --base 16 --ratio 1.25 [--ratio-sm 1.2] [--min-vw 360 --max-vw 1280] [--unit 4] [--css|--json]` — fluid type scale and spacing scale as CSS variables or JSON (Node ≥ 18, no dependencies).

## Works with
color-system (every colour token) · motion-and-graphics (rich motion, canvas, 3D) · interface-review (task walkthroughs and four-viewport screenshots) · ab-testing (when two directions compete; accessibility stays a guardrail).
