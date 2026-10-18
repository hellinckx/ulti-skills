# Preferences behind the Cadence design (inferred from Cadence)

Cadence was built iteratively from user feedback. Its docs log the explicit
wishes with dates ("Wunsch 03.10.2026", "Rückmeldung der Person", "Review 02.10.2026"). This page
collects what those wishes and the shipped result reveal about the intended taste, so new work starts where
Cadence ended instead of repeating corrections that were already made.

## Explicit wishes (dated in Cadence)

| Date | Wish | What it means for new work |
|---|---|---|
| 27.09 | UI was too small and text-heavy on big monitors | min text 11.5–12 px, body 13.5–15, headings 17–28; long explanations into `(i)` tooltips |
| 27.09 | Fields not as wide as the page | fixed, short field widths; pages with forms capped at 1180–1240 px |
| 27.09 | Task details as a window over the board, not below it | details open as a large dialog/inspector over the context |
| 28.09 | "Containers and hierarchy instead of only lines and text" | one quiet bordered container per topic (settings panels), clear sections — but no nested cards |
| 28.09 | "Don't ring buttons, just colour them" | no outlined buttons; filled red / quiet fill / coloured text |
| 28.09 | "Right-click everywhere" | context menus on every actionable item |
| 28.09 | Six colour styles incl. "like Windows" | theming is a first-class feature with preview tiles + one-click switch |
| 29.09 | Badges with one fixed meaning each | count / alert / live / new; shown only when there is something to do |
| 29.09 | Canvases with wheel-zoom and drag, no % buttons | direct manipulation over toolbars |
| 29.09 | Dialogs as high as their content, anchored at the top | no empty space, no jumping between tabs |
| 02.10 | Help outline docked right, collapsible | navigation aids never steal reading width |
| 02.10 | Memory form as a dialog once entries exist | inline form when empty, dialog when the list is the content |
| 02.10 | File icons like a code editor (own glyph + typical colour per type) | familiar, recognisable iconography over generic icons |
| 02.10 | Usage totals as a calm grid instead of a long list | numbers as KPI bands |
| 03.10 | Agent shown in every history row | always show *who* did something |
| 03.10 | Textarea resize grip in Cadence style | even system chrome (scrollbars, grips, selection) is themed |
| 03.10 | Kanban shows working time, not clock time; highlight when action is needed | show the useful number; draw attention only when the user must act |
| 03.10 | Usage as a dashboard: full width, open bands with hairlines instead of boxes | data pages breathe; hairlines over tiles |
| 03.10 | Live dictation "like in Claude" | benchmark against best-in-class tools and match that polish |
| 04.10 | A switch shows no second visible label | remove redundant text; keep accessible names |
| 04.10 | Actions left, "Improve" at the end of the row | consistent, predictable action placement |

## Taste in one paragraph

Dark, calm, precise, professional — "careful professional software", not a generic AI console.
Deep warm black and graphite, one confident red used sparingly, generous but not wasteful space,
crisp type hierarchy, very few lines. Rich in function and detail (live states, metrics, history,
recovery), yet every screen has one clear purpose and one primary action. Users like things they can
**tune** (themes, colours, emoji, panel sizes, split views, legends, limits) and **verify**
(numbers, timelines, "as table", provenance of every change).

## Expected customisation and variability patterns

Offer these whenever the product has room for them:

- **Colour styles**: Dark (default), Light, Graphite, Midnight, Sand, System — preview tiles in
  settings and a one-click swatch menu in the sidebar. Contrast ≥ 4.5:1 in each.
- **Language switch** one click away (sidebar code "DE"/"EN"), applies instantly; content written by
  people stays untranslated (`translate="no"`). In Cadence German is the source language and English is
  generated; follow the project's own default language and keep the other one click away.
- **Personal identity for entities**: emoji + colour from a calm 12-colour palette, with sensible
  defaults from the role.
- **Resizable everything**: splitters with keyboard + double-click reset, remembered sizes treated as
  wishes, split views of 2–4 panes with docking.
- **Collapsible navigation groups**, remembered.
- **View switches** (Board | Schedule; Overview | Analysis) instead of separate pages.
- **Chart legends as toggles**, drag-zoom on time axes, "As table" for every chart.
- **Global defaults with per-item overrides** (global model, per-agent model; global mode, per-project
  mode) — the override is shown next to the value ("· global").
- **Limits and budgets** as plain numeric settings with units, autosaved.
- **Modes with clear consequences** (guided / balanced / autonomous; standard plan / superplan) —
  every mode states what it changes and what it never changes.

## What to show — and what to hide

- Show **real state only**: no sample data, no fake activity, no pretend "verified" states. A missing
  feature is shown as missing. Empty lists stay empty (with a helpful empty state).
- Show **who, what, when, how much**: actor first, then action, then time/duration, then counts.
- Show numbers with units and context ("79 % left · resets 10:29"), tabular.
- Hide what has nothing to say: no "0" badges, no error counter without errors, no hint when there is
  nothing to do, no tooltip when empty.
- Hide explanation behind `(i)`; keep the row to label + one short hint.
- Never show private reasoning or secrets; redact tokens.
- Status never by colour alone — always dot/icon + word.

## Copy tone

- Calm, exact, honest. No superlatives, no hype, no unproven promises, no compliance claims, no
  certifications the product doesn't have.
- Address the user directly and informally (German "du"; English plain "you").
- Short sentences; name the consequence: "Deleting removes all Cadence data of a project: tasks,
  histories, backups … If you wish, the folder also goes to the recycle bin."
- Empty states say what will appear and how: "No agent is working right now." / "No project connected
  yet."
- Errors say what failed and what to check: "Browser QA failed. Check steps and screenshots."
- Buttons are verbs; "…" when another step follows ("Delete …"); "Start…" for the first, "Add…" for
  further items.
- Settings hints are one line ("From the current Codex catalogue.").
- The product never acts silently: "Cadence never switches the model silently."
- Dates/times in local format (06.10.2026, 09:33); version label "v1.3.0 · 741c9c7".

## Accessibility to rely on

Visible focus everywhere, keyboard alternatives for drag, ARIA roles for combobox/listbox/tabs/menus,
`aria-live` announcements for async results, `aria-valuenow` on splitters, accessible names on icon
buttons and label-less switches, reduced motion respected, forced-colors fallback, 4.5:1 contrast in
every theme, Windows text scaling.

## How work is verified

- Look at the real thing: open it in the real window/browser at **at least two sizes** (Cadence uses
  1360×900 and 850×640; add 1920×1080) and check spacing, clipping, scrolling, focus, legibility and
  click targets — plus main, empty, loading, error, question and active states.
- Never call something "visually checked" without having looked at it. CSS that "looks plausible"
  is not verified.
- Keep a dated note of design decisions and the viewports actually checked (Cadence keeps them in
  `DESIGN.md` / `docs/design-system.md`).

## How decisions are handled

Prefer to decide from the rules and keep going, stating the reason in one line, rather than
asking open questions. When a decision genuinely belongs to the user, ask one concise question with 2–4 options,
their consequences and a recommendation.
