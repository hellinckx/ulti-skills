---
name: takt-design
description: Optional Cadence design reference for work tools, dashboards and admin apps when the product brief
  chooses that direction; preserves each project's own brand and platform.
metadata:
  creator: Cadence project
  created: '2026-10-10'
  creation-method: Extracted from the shipped Cadence desktop app (renderer CSS, components and dated user wishes)
    and condensed into an editorial guide with reference files; no executable scripts.
  purpose: Give every interface Cadence builds the same calm, precise, professional character and the same customisable,
    honest behaviour.
  scope: Installation-wide; included with interface tasks in every connected project. Replaces the earlier takt-house-style
    skill.
---

# Cadence design language

**Character:** careful professional software on deep warm black. One accent for action and selection, crisp type, space instead of lines, live and honest states, and everything tunable.

**When it applies:** use this as a reference when the brief chooses Cadence's style or when a calm work-tool direction fits a new tool. Absence of a design file alone does not select this style. If the project already has a design system, brand guide, `DESIGN.md` or established UI, follow that. Never restyle an existing customer-facing product unless the request says so. Record chosen and adapted values in the product's canonical design specification; design-craft owns that document, usability-review owns task behaviour checks and responsive-evidence owns four-class screenshots. The exact values below describe Cadence, not universal defaults for all frontends.

## Reference files (read on demand)
Call the Cadence tool `takt_skill_reference` with `skill: "takt-design"` and one of these files when you need exact values. Copy `assets/takt-tokens.css` into the project (for example `src/styles/tokens.css`) instead of retyping colours.
- `assets/takt-tokens.css` — all colour, type, radius, shadow and motion tokens, five themes plus system.
- `assets/takt-components.css` — framework-free `t-*` component classes with exact values.
- `references/tokens.md` — what each token is for; how to derive a new theme colour.
- `references/components.md` — anatomy, states and rules per component.
- `references/layout-and-motion.md` — shell, widths, grids, breakpoints, density, motion.
- `references/preferences.md` — what to show or hide, customisation, copy tone, accessibility, verification.
- `references/org-chart-and-structure.md` — the live org chart (canvas, tree layout, cards, organizations side by side, flows and fading trade), structure lists, fold sections, phase cells, step tracks, cycle figures and communication rows.
If the tool is not available in this session, apply the rules below; they are sufficient for a consistent result.

## Core rules
1. **Tokens first.** Dark is the designed source; every other theme derives from it. Define colours once as CSS variables (or Tailwind theme values mapped from them) and never hard-code a hex in a component. Never add a colour for one theme only.
2. **Warm graphite neutrals.** Page `#111013`, rail `#0c0b0d`, surface `#19171b`, text `#f1edf0`, muted `#b8afb6`, quiet `#9b9098`, hairline `#2b252c`. Accent red `#d0102e` (hover `#e0243f`), identical in all themes. Status: success `#7fc79a`, warning `#d9b36b`, error `#e0707c`, info `#b49cff`.
3. **Spend the accent sparingly:** the one primary action, the current selection (dark accent fill with accent text or icon), active tab underline, switches, progress and focus. Never as a large background or decoration.
4. **Separate in this order:** space → type → hairline → small surface step → one quiet bordered container. At most one container level; no cards inside cards.
5. **Three button variants, no outlines.** Primary = filled accent, secondary = quiet fill, quiet = coloured text. Danger confirms use dark red. A known action gets its icon on the left.
6. **Consistent sizes.** Controls 34 px (28 small, 40 in dialog forms). Radii 6 (controls), 8 (cards, menus), 10–12 (dialogs, panels). Pills only for counters and status.
7. **Legible type.** Segoe UI Variable / system-ui. Body 13.5–15 px, floor 11.5 px, page title 25 px / 620 / −0.025em, section kickers 11.5 px caps +0.06em. Changing numbers use tabular figures.
8. **Rows:** label + one short hint on the left, control on the right. Long explanations go into an `(i)` tooltip. Fields are as wide as their content needs.
9. **Truthful live state.** Status = dot or icon + word + colour. Running work gets a green edge and a pulse; work that needs the user gets an amber glow and the button to press. Show elapsed time, who acted and exact counts.
10. **Autosave and confirm it:** save 0.9 s after typing stops or on blur and show dot → spinner → "Saved". Save buttons only in dialogs and on creation.
11. **Customisable by default:** theme styles with preview tiles, one-click language switch, entity colour and emoji, resizable splitters (keyboard-operable, double-click resets), collapsible navigation groups, view switches, chart legends that toggle series, "As table" under every chart, global defaults with visible per-item overrides.
12. **Keyboard and mouse alike:** 2 px focus ring, arrow/Home/End navigation, Escape closes, right-click menu wherever items can be acted on, keyboard alternative for every drag. Respect reduced motion.
13. **Quick, quiet motion:** hover 140 ms, menus 90 ms, dialogs 160 ms from +8 px, toasts 180 ms. Pulses mark live things only.
14. **People and structure as a living tree:** show teams and ownership as the Cadence org chart — a full-width canvas (drag, wheel zoom, double-click fit), 196 × 78 cards with state edge, avatar and live activity, rounded orthogonal reporting lines, flows along the lines with pill labels, organizations as quiet frames side by side, and exchanges between them as arcs that fade with age. Details always below, never clipped beside it. See `references/org-chart-and-structure.md`.
15. **Everything inspectable:** under a summary figure, every part opens as a fold section with a stable key, real content and counts in the summary row; no dead chevrons, no forms left open on the page — creation happens in a dialog behind one button.

**Don't:** stack cards in cards, build uniform tile walls or permanent status bars, use decorative gradients, glassmorphism, drop shadows on in-page cards or large empty hero areas inside a product; use outlined buttons, native OS select dropdowns in a styled app, pure `#000`/`#fff` or blue-grey neutrals; show sample data in empty lists, fake activity, "0" badges or explanations that repeat the label; write hype or claims the product cannot prove; let a live update lose scroll position, focus or half-typed input.

## Building a screen
1. Write the page's purpose in one sentence (page intro) and pick the single primary action.
2. Shell: 232 px navigation rail (67 px icon rail below 1120 px), 62 px top bar with breadcrumb/purpose left and live status/notices right, scrolling view. Width by page type: 1320 normal, 1180 forms, 1240 lists, full for boards and canvases, 820 reading.
3. Head: 25 px title and one-sentence intro left, primary button right, bottom-aligned.
4. Structure: settings in quiet panels with rows; numbers in KPI bands with hairlines; lists with hairlines and a left accent bar for selection; tables with hairlines only; charts with toggle legends and "As table".
5. States: main, empty (dashed panel and one action), loading (inline spinner), error (what failed and what to check), question (options, consequences, recommendation), live. Check hover, focus, pressed and disabled on every control.
6. Copy: verbs on buttons, "…" when a further step follows, one-line hints, direct "you"/"du", stated consequences, no hype.
7. Accessibility: labels and tooltips on icon buttons, ARIA roles on combobox, tabs and menus, `aria-live` for async results, 4.5:1 contrast in every theme.

## Adapting
- **Light theme:** higher layers get lighter, text `#0f0c0e`, accent stays the same with white text, shadows at about 35 % opacity; cards still sit above the page. Do not simply invert.
- **Dense admin:** 34 px rows, 28 px toolbar buttons, hairline tables with tabular numbers, sticky toolbar with search (max 340 px), master–detail `minmax(270px,340px) | 1fr`, deep-linkable records, right-click menus on rows, inline autosave.
- **Marketing page:** same tokens and type family with more air (sections 64–120 px apart, hero 44–64 px / 650, body 16–18 px); accent only in the primary CTA and one accent per section; real product captures; varied layouts instead of rows of equal cards.
- **Editor or canvas:** panels run to the window edges with 1 px splitters, dot-grid or near-black canvas, wheel-zoom around the pointer, drag to pan, double-click to fit, inspector in a side column or dialog.
- **Mobile / narrow web:** 16 px side gutter, 44 px touch targets, rail becomes a top or bottom bar, stacked rows, full-height dialogs with 8 px margin, no horizontal page scroll.
- **Frameworks:** map the variables into the framework theme and keep variables as the single source; expose variants (`primary | secondary | quiet | danger`, `md | sm`) instead of free style props; avoid inline styles for dynamic values (classes, data attributes, `<progress>`), which also keeps strict CSPs working.

## Verify for real
Use responsive-evidence's four-class matrix and the product's supported themes and platform constraints. Inspect actual captures, fix clipping, overflow and focus, and link the report from the canonical design specification. Only call the supported, actually inspected views visually checked.
