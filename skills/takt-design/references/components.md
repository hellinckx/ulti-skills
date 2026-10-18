# Cadence components

Every component exists as ready CSS in `assets/takt-components.css` (class prefix `t-`).
This page gives anatomy, states and the rules behind each one.
Use the CSS as is, or translate it into the project's stack (Tailwind/React/CSS modules) keeping the
values. Provenance paths refer to the Cadence repo (`src/renderer/...`).

## Contents
Buttons · Inline action and links · Text fields · Combobox (select) · Switch and checkbox ·
Segmented control and view switch · Tabs · Status pills, state chips, tags, counters · Identity badge ·
Info tip and tooltip · Context menu · Settings panel and rows · Autosave indicator · Dialogs
(confirm, question, form editor, wide inspector) · Toast · Empty states · Lists and selection ·
Facts (definition lists) · Tables · Cards and board · KPI band and meters · Charts · Splitters and
split views · Canvas (zoom/pan) · History/timeline rows · Sidebar · Top bar · Callouts and notes ·
Pickers (theme, colour, emoji, capability chips) · Markdown/reading · Terminal

---

## Buttons
*Provenance: style.css:97-105, ui-v3.css:5-29, desktop.css:1462-1466*

Exactly three variants plus two danger forms. **No outlines** — the design rule is "Do not outline buttons; use color instead".

| Variant | Look | Use |
|---|---|---|
| Primary `t-btn--primary` | filled `#d0102e`, text `#fff7f8`, hover `#ff6570` | the ONE main action of an area (Start, Save in dialog, New task) |
| Secondary `t-btn` | quiet fill `#262228` → hover `#312b33` → active `#3a323c` | further actions (Edit, Refresh quotas) |
| Quiet `t-btn--quiet` | transparent, `--muted` text, hover fill `#221e24` | rare or optional actions (Improve, Answer later, Cancel) |
| Danger `t-btn--danger` | `#3a151c` fill, `#ffa3ab` text | the confirming destructive action inside a dialog |
| Danger quiet `t-btn--danger-quiet` | red-ish text `#f08c95`, fill on hover | destructive side actions on a page ("Delete …") |
| Attention `t-btn--attention` | amber `#d9a13a` fill, dark text | the button inside a card that needs the user (Resume) |

Sizes: 34 px (default), 28 px `t-btn--sm` (12.5 px text, 10 px padding), 38 px in dialog footers
(min-width 112 px). Padding 0 14 px (primary 16). Text 13.5 px / 600. Icon 15 px left of the label,
gap 7 px, for every action with a known symbol (edit, delete, open folder, start demo).
Disabled: fill `#1f1c20`, text `#8d858c`, `cursor: not-allowed` — never just lower opacity on primary.
Focus: 2 px `--focus` ring, offset 3 px.
Labels that open a further step end with an ellipsis: "Delete …", "Connect folder …".
First creation says "Start …", later additions say "Add …".

Icon-only buttons (28 × 28, radius 6, transparent, hover fill) always get `aria-label` **and** a
tooltip; pressed toggles show a 1 px red inset ring.

```html
<button class="t-btn t-btn--primary"><svg class="t-icon" viewBox="0 0 24 24"><path d="M7 5l11 7-11 7z"/></svg>Start</button>
<button class="t-btn">Edit</button>
<button class="t-btn t-btn--quiet">Improve</button>
<button class="t-btn t-btn--danger-quiet">Delete …</button>
```

## Inline action and links
*style.css:134-137, desktop.css:1609,1620*
- Inline action: red text 13.5 px / 570 with a right arrow that nudges `translateX(3px)` on hover;
  the label underlines on hover (offset 3 px). Used for "All tasks →", "Add the first entry →".
- Text links only for navigation inside running text: `--accent-strong`, underline offset 3 px.

## Text fields
*style.css:112-114, ui-v3.css:155,190, ui-v4.css:123-127, ui-v7.css:341-351*
- Default: height 34–39, padding 0 11 px, 1 px `#4a4047`, radius 6, bg `#171518`, caret red,
  placeholder `#a0969e`, hover border `#6b4a55`, focus = 2 px focus outline offset 1 px with the
  border turned transparent.
- In dialog forms: **40 px** high, radius 8, bg `#141215`, 14 px text. All fields of one form share
  the height so rows stay symmetric.
- Labels sit above: 13 px / 580 text colour, optional `small` in quiet. Explanations go into an
  `(i)` next to the label, not as text under the field.
- Textarea: min 112 px (composer 148–190), line-height 1.55–1.6, vertical resize. The resize grip is
  restyled as two diagonal lines `#7d6f7b` turning red `#c8323f` on hover/focus — the design asks for
  it ("Cadence-Stil statt weißer Systemlinien").
- Fields are **as wide as needed, not as wide as the page**: numbers 84 px, selects 200–300 px,
  search 340–360 px max.
- Composer textareas carry a microphone (dictation) and a quiet "Improve" button bottom-right.

## Combobox (select)
*desktop.css:2042-2072, takt-select.js*
Never show the native OS dropdown (it brings a blue Windows highlight). Every single-line select is
the shared Cadence combobox; a visually hidden native `<select>` stays underneath for forms.
- Trigger: min-height 38, padding 0 11, 1 px `--line`, radius 6, bg `--surface`, 13 px; chevron 14 px
  quiet, rotates 180° when open. Hover: border `#6b4a55`, bg raised. Open: border `#80515d`.
- Listbox: absolute, 5 px below (opens upward when there is no room), padding 4, radius 10,
  1 px `--line-soft`, bg `--surface`, shadow `0 14px 34px #0009`, max-height 170–280 px.
- Option: min-height 34, padding 7 9, radius 6, 12.5 px muted. Selected: `#351017` bg, near-white
  text. Keyboard-active: inset 1 px `#80515d` + `#2b1d22` bg. Both: `#4a1d29`. Disabled: quiet, .72.
- Keys: Tab, Space, Enter, arrows, Home, End, Escape, type-ahead by first letter. Roles
  `combobox`/`listbox`/`option`, real `<label>`. `forced-colors` falls back to system colours.
- Width: 200–300 px in settings rows (260 px typical), full width only inside dialog grids.

## Switch and checkbox
*ui-v3.css:210-219, 149-153*
- Switch 32 × 18, knob 14 px, track `#3a333b` → red when on, knob `#d8d0d6` → `#fff7f8`,
  140 ms. Focus ring `#ff6b78` offset 2.
- A switch in a settings row has **no second visible label next to it** — the row label is the
  label; keep an `aria-label` (decision 04.10.2026).
- Checkboxes use `accent-color: #d0102e`, 16 px. Confirmation checkboxes sit in a soft panel
  (`#221e24`, radius 8, padding 12 14) with bold label + small consequence text.

## Segmented control and view switch
*ui-v3.css:253-257, desktop.css:1206-1209, ui-v7.css:375-378*
- Segmented (choice of mode, e.g. language, "Teamplan | Autonomous process"): track `#1d1a1f`,
  padding 3, radius 8; items 30 px high, 0 14 padding, 13 px / 600; **selected = filled red**.
- View switch (Board | Schedule) and sub-sections: track with 1 px `--line-soft`, radius 9, bg
  `#171418`; selected = `--accent-soft` (or `#2a2329` neutral for metric sub-tabs) + 600 weight.
  Use the softer version where the choice is a *view*, the red version where it is a *setting*.

## Tabs
*desktop.css:459-463, 1132-1137*
Flat bar, 1 px bottom line, items 36–38 px, 13.5 px muted; selected = text colour + 600 + **2 px red
underline** (inset 10 px from the label edges). Counts inside the tab in 11.5 px quiet. ARIA tablist
with arrow keys and Home/End. Each tab is its own sub-page; the content scrolls, not the window.
Scrollbars of tab bars are hidden.

## Status pills, state chips, tags, counters
*ui-v3.css:203-208, desktop.css:1548-1553, ui-v4.css:6-15*
- **Status pill** (`t-status`): radius 99, padding 3 9, 12 px / 600, dot 7 px in `currentColor`,
  tinted bg per level: ok / warn / error / live. Used for connection, health, availability.
- **State chip** (`t-state`): radius 4, 22 px, 1 px border in the level's line colour, 12 px / 600.
  Used for task state (working, review, done, blocked). A running state carries a spinner.
- **Kind tag** (`t-tag`): radius 4, 1 px `--line-soft`, quiet 11.5 px ("Process", "Plan", "reading").
- **Counter** (`t-count`) — exactly one meaning per kind:
  `count` neutral number · `alert` red, demands a decision · `live` green pulsing dot (+ number) ·
  `new` green "NEW" caps 10 px. Shown **only when there is something** (no "0" badges). A collapsed
  group shows its most important child badge (alert > live > count > new).
- Error counter on cards: small text button with warning icon and the exact number ("⚠ 3 errors"),
  opens the error filter; absent when there are no errors.

## Identity badge
*style.css:199-213, ui-v4.css:17-23*
Square tile with the person's/agent's **emoji or outline icon** in their colour triple: 30 px radius 9
(tiny 20/6, card 26/8, large 56/14). Border `--c-line`, fill `--c-soft`, ink `--c-ink`. Name next to
it, role below in quiet 11.5–12 px. Agent first, then content — cards and history rows lead with
who is acting.

## Info tip and tooltip
*desktop.css:1001-1004*
- `(i)` button 19 px round, 1 px `#5a4d57`, 11.5 px / 600 muted; hover/focus: red border, text colour.
  Reachable by mouse, keyboard and click; `cursor: help`.
- Tooltip layer: fixed, max 340 px, padding 10 12, radius 8, bg `#231d22`, 1 px `#5a4652`, 13 px / 1.5,
  shadow `0 12px 30px #000a`, always kept inside the window, no pointer events.
- Long explanations live here, so rows stay one label + one short hint.

## Context menu
*ui-v3.css:99-118, context-menu.js*
One component for right-click, the context-menu key and every dropdown menu. **Right-click works
everywhere it makes sense** (explicit wish).
- Panel: min 210 / max 320 px, padding 5, 1 px `#332b33`, radius 8, bg `#1c181d`, shadow
  `0 18px 44px rgb(0 0 0/.55)`, enters in 90 ms from `translateY(-3px) scale(.98)`.
- Item: 32 px, padding 0 10, radius 6, 13 px; icon 15 px left in muted (turns text colour on hover);
  hover `#2a242c`; optional right detail (shortcut) 11.5 px quiet; check mark `#ff6b78` for the current
  choice; destructive items in `#ff9aa2` with `#3a151c` hover.
- Section heading: caps 11 px / 650 quiet; separator 1 px `#2c262d`, margin 5 6.
- Keys: arrows, Home/End, Tab, Escape. Closes on outside click, scroll, resize and blur. Always fully
  inside the window (flip/clamp).

## Settings panel and rows
*ui-v3.css:158-209, 268-278*
The settings page is a two-column work page: a 262 px sub-navigation (bg `#141215`, groups with caps
headings, items 34 px with 16 px icons, current = accent-soft bg + red icon, a yellow 7 px dot when a
section needs attention) and content max 920 px (padding 26 34 48).
- **Panel** (`t-panel`): 1 px `#262127`, radius 10, bg `#161418`, margin-bottom 16. Head: title 15 px /
  640 with the `(i)` right next to it, one-sentence description 13 px muted (≤ 68ch), actions on the
  right. Body padding 0 18 14.
- **Row** (`t-row`): label 13.5 / 600 + hint 12.5 muted on the left, control right-aligned; min 52 px,
  1 px `#221e24` between rows (none above the first). Sub-groups get a caps 11.5 px heading.
- Long lists (servers, skills) are collapsible `<details>` groups (bg `#1b181c`, 40 px summary, rotating
  8 px chevron) and searchable.
- Under 900 px: sub-nav becomes a horizontal scroller, rows stack, controls align left.
- Callouts inside: soft fill `#211d23` radius 8; warning callout `#231d12` with `#e8d3a0` text.

## Autosave indicator
*desktop.css:1512-1522, design-system.md "Speichern"*
Editable values **save themselves** — 0.9 s after typing stops or on blur (forms that create a new
version save on blur only). Next to the field: dot = unsaved (warning colour), spinner = saving,
check + "Saved" = done (success), icon + text = error. "Save" buttons exist only in dialogs and when
creating a new entry.

## Dialogs
*desktop.css:599-614, 1538-1568, ui-v3.css:120-145, ui-v4.css:105-160, 181-226*
Shared rules: same colours, type, spacing, buttons and focus as the page. Height follows content,
max = window; **anchored at the top** (`place-items: start center`, top padding `clamp(18px,5vh,56px)`)
so switching tabs inside never makes it jump. Escape, close button and click outside close it —
except decision dialogs. Content scrolls inside; never the page behind. Separate sections with
hairlines, not nested cards. Focus moves in and returns on close.
- **Confirm** (600 px, padding 24 25 20, radius 11, 1 px `#66414a`): title 18 px / 610, lead text
  13.5 muted naming the consequence, optional checkbox panel, optional "type the name" field for heavy
  deletions, actions right. Destructive confirm = filled dark red.
- **Question / decision** (660 px, radius 10, bg `#1a171b`, 1 px `#3a2f39`, shadow `0 28px 80px`):
  kicker "Decision needed" with a pulsing yellow dot, the question as 19 px heading, source line,
  context, then 2–4 **option cards** (`#242026`, radius 8, padding 12 14, bold option + consequence
  below; hover/focus `#351017` + 2 px red ring). Cannot be clicked away — only "Answer later", which
  minimises it to a yellow bar (`#1f1a12`, 1 px `#4a3b22`, "Answer now" button) above the content.
  Mark the recommended option.
- **Form editor** (820 px, radius 14): head grid = live preview badge 48 px | title 18 / 660 + one
  line | close 34 px. Body sections with caps 11.5 px headings, two-column field grid (gap 14 18),
  40 px fields. **Fixed footer** with top hairline, bg `#171519`, padding 16 22 18, error text left,
  buttons right (min-width 112).
- **Wide inspector** (task / process node, 1120–1240 px, ≤ 88 vh, radius 10–14): head with kicker
  ("1.3 · Task · Work"), title 19 / 650, one meta line, actions in one row; sticky tab bar; body
  padding 20 24 24; two columns (1.25fr / 1fr) above 1080 px.
- Backdrop `rgb(6 5 8/.78)` blur 2 px. Under 760 px: 8 px margin, full height.

## Toast
*desktop.css:319-320*
Bottom-right (25 px / 20 px), max 440 px, padding 10 14, radius 6–8, bg `#211b20`, 1 px `#59434c`,
13 px, shadow `0 8px 24px #0006`; enters 180 ms from `translateY(7px)`. One short sentence stating
what happened, optionally the recovery ("Saved · recovery point created"). Announce via `aria-live`.

## Empty states
*style.css:142-146, ui-v3.css:368-370, desktop.css:96*
- Page-level: max 560 px, padding 22 24, **1 px dashed** `#2f282f`, radius 10, bg `#141215`; heading
  19 px / 590, one or two sentences (≤ 58ch) saying what will appear here and how, one inline action.
- Inside lists/columns: a single quiet 12 px line ("No tasks").
- **Never fill empty lists with sample data.** Demo content only via an explicit "Insert demo" action,
  in English, with genuinely usable starter content.

## Lists and selection
*ui-v4.css:37-50, style.css:189-197*
Rows 8 10 padding, radius 8, grid `30px | 1fr | auto` (badge | title + subtitle | state), gap 11.
Hover `#1e1a1f`. **Selected = `#261b21` + inset 2 px red bar on the left.** Paused/deleted rows
fade content to .62. Trees use 1 px guide lines (`#3b3239`) with a 5 px rounded elbow, indentation
from 18–26 px cells, a count on parent rows, and drag-to-reparent with a red-outlined target and a
dashed "top level" drop strip that appears only while dragging.

## Facts (definition lists)
*ui-v4.css:70-76, desktop.css:1562-1566*
Two layouts: (a) `130px | 1fr` rows, dt 13 px quiet, dd 13.5 text; (b) auto-fill grid of 150 px
cells, dt 12 px quiet, dd 14 px / 600 with an optional small second line. Sections headed by caps
kickers, separated by hairlines.

## Tables
*desktop.css:1046-1050, 1614-1618, ui-v7.css:502-505*
Hairlines only, no zebra, no cell borders, no card around. Header 12 px / 600 quiet with 1 px
`--line`; cells padding 9–11 px, 1 px `--line-soft`; numbers right-aligned tabular; first column
in text colour. Row hover `#ffffff05`. Wrap in an overflow-x container with a sensible min-width
(620–640 px). Linked hover: hovering a table row highlights the same item in the chart and vice versa.

## Cards and board
*desktop.css:85-112, 1525-1536, ui-v7.css:354-367, ui-v6.css:59-90*
- Board: four fixed status columns (To do · In progress · Review · Done), gap 20, each column scrolls
  on its own; 2 columns under 900 px, 1 under 540 px. Column head 36 px: 7 px status dot (in progress
  = red with 3 px halo, review = yellow, done = green), 13 px / 600 title, count right in quiet.
- Card: 1 px `--line-soft`, radius 8, bg `#1a171b`; hover border `#59444c` + bg `#20191e`.
  Order: **agent badge + name + role** → kind tag → title 14 px / 600 single line → 2-line description
  12 px muted → footer: state left, one labelled action (Start / Stop / Replan), **elapsed working
  time** with clock icon right (not wall-clock time).
- Running: border `#3f6b52`, inset 3 px green edge, "working" + spinner, a live line
  ("Backend runs `npm test`") on a green-tinted strip.
- Needs the user: amber border + soft amber glow, pulses 3 times, the action button turns amber.
- Selected: border `#86434d` + inset 2 px red. Dragging: opacity .45; drop target column
  `#28191e` with border `#88424c`. Keyboard alternative to drag: a status picker.
- Done column switches to compact one-line entries grouped by day.

## KPI band and meters
*ui-v4.css:27-31, ui-v7.css:441-489, desktop.css:430-434*
- Numbers sit in **open bands with vertical hairlines**, not in boxed tiles: value 20 px / 640
  tabular, label 13 px muted, optional 11 px quiet delta. Hero values 34 px / 650, −0.035em.
  A quieter secondary band uses 15 px values separated by a dashed top line.
- Low/mid thresholds colour the hero number (danger / warning) and always also state it in words.
- Meters: `<progress>` 5–6 px (3 px in the sidebar), radius 3–4, track `#30272e`, value red.

## Charts
*ui-v7.css:101-151, 373-413, charts.js*
- Quiet axes, 1 px grid, 2 px lines with round joins, rounded bars, donut stroke 18 (22 on hover)
  with the total in the middle (26 px / 680).
- Chart head: title 12.5–13.5 px / 600–640 left, **legend right as toggle buttons** (24 px pills,
  9 px rounded-square swatch, value in 11 px quiet). Off state: .45 opacity + hollow swatch. All
  series start on.
- Tooltip `#221d24`, 1 px `#3a3240`, radius 9; values right-aligned tabular.
- Every chart has a quiet "As table" disclosure underneath (rotating 5 px chevron) — data must be
  readable without the picture.
- Drag-to-zoom on time axes with a small "Reset zoom" pill that only exists while zoomed.
- On dashboards, charts drop the card: 14 px top padding + top hairline, on a 12-column grid
  (wide = 8, narrow = 4; stacking at 1240 / 820 px), gaps 30 × 38.
- Empty chart: centered quiet sentence in a 140 px area.

## Splitters and split views
*ui-v3.css:330-338, pane-layout.css, ui-v7.css:524-532*
Panels are separated by **1 px lines with a 6–8 px invisible grab area**, never by gaps between cards.
On hover/focus/drag the line becomes 2 px red and a 3 × 26 px grip appears. Keyboard: arrows move
16 px (Shift 64 px), Home/End go to the limits, `aria-valuenow` is reported; **double-click resets to
automatic**. Stored sizes are wishes — on small windows side panels give way first down to their
minimums (centre ≥ 260 px). Split views hold 2–4 numbered panes; dragging a pane heading shows four
clear dock zones before dropping; no empty quadrants are kept.

## Org chart and structure views
Full-width canvas with drag, wheel zoom and double-click fit; cards 196 × 78 with state edge, avatar, state line and counters; rounded orthogonal reporting lines; live flows with pill labels; organizations as frames side by side; trade as fading arcs; details below in full width. Exact values: `references/org-chart-and-structure.md`.

## Fold sections
Quiet surface per section (`#1b181c`, radius 8), 48 px summary row with rotating chevron, title, ellipsized subtitle and right-aligned meta; body below a hairline with 36 px left indent; nested folds as hairline rows; stable keys keep state across live redraws; no empty expandable items.

## Canvas (diagrams, schedules)
*ui-v4.css:164-179, ui-v5.css:60-67*
Free canvas with a dot grid (`radial-gradient(circle, #2a242b 1px, transparent 1.3px)` at 22 px),
radius 12, 1 px `--line-soft`. **Wheel zooms around the pointer** (Ctrl+wheel on schedules), drag
pans (grab/grabbing cursors), double-click fits everything, keyboard works; **no zoom buttons, no
percent buttons** — a tiny tabular zoom readout and one "fit" icon at most. Node details open in a
centred dialog, not a side panel. Schedules: fixed first column and header; plan = dashed band,
actual = filled band, failed = red outline; the legend says this in words and its categories are
toggles.

## History / timeline rows
*ui-v3.css:289-328, desktop.css:1167-1203*
One row per entry in three columns: time (92 px, right-aligned tabular 12 px) | 8 px coloured dot
(assistant violet `#b89cf0`, result green, error `#ff7a86`, approval/question yellow, reasoning
`#7c6aa8`) | content (actor 620 weight, kind quiet, linked task, 13.5 px text). Thin hairline between
rows, not cards. Sticky day headings in caps 11.5 px. Consecutive similar entries collapse into a
quiet bundle with count and time span and a small chevron. Commands and paths show as a quiet code
line, original text in the tooltip. The agent's colour chip appears in every row. Sticky toolbar with
search (max 340 px) on top. Under 760 px the content moves below actor and time.

## Sidebar
*ui-v3.css:33-84, desktop.css:1473-1488, ui-v4.css:5-15*
- 232 px (≥ 1121 px), bg `#0c0b0d`, right hairline, padding 18 12 12. Brand: mark 31 px + "CADENCE" 19 px
  / 650, −0.035em.
- Collapsible groups (e.g. WORK · TEAM · TRACE · SYSTEM) with caps 11.5 px headings; the chevron
  only appears on hover/focus or when collapsed; collapsed state is remembered.
- Items 34 px, 13.5 px muted, 17 px icons stroke 1.45, gap 11; hover `#211d22`; **current =
  `#351017` bg + red text/icon**; an item that needs the user gets an amber tint + 2 px amber bar.
- Bottom block above a hairline: compact quota line (two thin meters side by side), project switcher
  row, one row with connection dot + colour-style swatch + language code (one click each), version
  line 11.5 px tabular (`v1.3.0 · 741c9c7`). Everything fits at 900 px window height; only the nav
  scrolls below that.
- Under 1120 px: 67 px icon rail with tooltips (57 px on very narrow windows).

## Top bar
*style.css:61-77, desktop.css:1490-1510*
62 px, bottom hairline, padding 0 36. Left: breadcrumb "CADENCE / Page" (root in quiet caps-ish 650 with
.06em tracking) and below it a 10.5 px quiet one-line purpose of the page. Right: live status items
(icon + bold tabular number + word, e.g. "2 agents active", "Writing 0/6" with a 42 × 4 meter),
a 20 px hairline divider, then **global notices as small pills** (error red, warning amber, info
neutral) — each one navigates to where it can be solved. Items hide progressively at 1280 / 980 px.

## Callouts and notes
- Attention callout: 3 px amber left border, `#261e16` bg, radius 0 7 7 0 — "this step needs you".
- Note in reading text: 3 px red left border, `#1d171b` bg.
- Store/recovery banner: 1 px amber-brown border + 3 px warning left edge.

## Pickers
*ui-v3.css:244-257, ui-v4.css:128-151*
- **Theme**: tiles 112 px min (preview 54 px with a diagonal split page-colour / red; "system" split
  vertically dark/light), selected = 2 px inset red ring. The same choice is one click away in the
  sidebar as a swatch menu.
- **Colour**: 30 px circles, ink centre on soft ring, selected = double ring (2 px gap, 2 px ink).
- **Emoji**: grid of 38 px cells, selected = accent-soft bg + 1.5 px red inset.
- **Capability chips**: 32 px pills with a hollow 7 px dot; checked = filled red dot on accent-soft.

## Markdown / reading
*desktop.css:1599-1618*
Column ≤ 820 px, 14.5 px / 1.65 muted, headings in text colour (h2 18 px, h3 15 px), markers quiet,
inline code on `#241f25` with a pink-white `#f3d7dc`, code blocks radius 8 on `#141215`, tables with
hairlines, notes as a red quote bar. Help pages: chapter list 268 px left with search, article
right, an outline docked to the right that collapses to a marker; media 16:9 with a 64 px red play
button (`#d11d3be6`, scale 1.06 on hover).

## Terminal
*desktop.css:2088-2113*
Own darker surface `#0d0c0e`, Cascadia Mono 13 px / 1.35, fg `#e5e1e4`, block cursor when focused,
inset 1 px `#4a2d36` focus frame. Tabs are flat 28–30 px with a red 2 px bottom edge on the active
one, close "×" appears on hover/current; agent terminals show a small name label `#3a1c24`/`#f3c6ce`.
ANSI: `#6a6268 #f07070 #6fd39a #e6d36a #74a7ee #d88ad8 #5fcbe0 #e5e1e4` + bright
`#9a9098 #ff8a8a #8ee8b4 #fff08a #9cc3ff #f0a8f0 #8ee3f3 #ffffff`.

---

## React / Tailwind translation
- Keep the CSS variables as the single source; in Tailwind map them in `theme.extend.colors`
  (`page: 'var(--page)'`, …) and radii/heights the same way. Don't hard-code hex in components.
- Theme switch = set `data-theme` on `<html>` and persist it; default `"dark"`; offer `"system"`.
- Components accept `variant="primary|secondary|quiet|danger|dangerQuiet"` and `size="md|sm"`
  rather than free styling props.
- CSP-friendly habit from Cadence: no inline `style` for dynamic values — use data attributes,
  classes, `<progress>`, or CSS custom properties set via classes.
