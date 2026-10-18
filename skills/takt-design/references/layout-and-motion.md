# Layout and motion

Provenance: Cadence `docs/design-system.md` (v2–v5 sections), `style.css:44-87`, `desktop.css:1-12,
1089-1117`, `ui-v4.css:229-245`, `ui-v5.css:118-127`, native captures at 1360×900 and 850×640.

## The shell

```
┌───────────┬─────────────────────────────────────────────────────────────┐
│ ▣ CADENCE    │ CADENCE / Page                     2 agents · Writing 0/6 ▮ ⚠ │ 62 px top bar
│           │ one-line purpose of this page                               │
│ WORK      ├─────────────────────────────────────────────────────────────┤
│ ▸ Overview│                                                             │
│   Tasks 3 │   Page title (25 px)                       [Primary action] │
│   …       │   One sentence what this page is for.                       │
│ TEAM      │                                                             │
│   …       │   content — max-width per page type, centred                │
│ SYSTEM    │                                                             │
│   …       │                                                             │
│───────────│                                                             │
│ 5h ▬ Wk ▬ │                                                             │
│ ▢ Project │                                                             │
│ ● Conn ◐ EN│                                                            │
│ v1.3 · hash│                                                            │
└───────────┴─────────────────────────────────────────────────────────────┘
 232 px rail (icons-only 67 px < 1120 px)
```

- The window never scrolls as a whole: shell is `100vh`, the view area scrolls
  (`overflow:auto; overscroll-behavior: contain`), long lists/boards/logs scroll **inside their own
  region**. Main views should fit common laptop sizes without page scrolling where possible.
- Location lives top-left (breadcrumb + purpose line); live state and global notices top-right;
  project, connection, colour style, language and version bottom-left. Orchestration details are a
  view or side column, never a permanent block on top of every page.

## Page widths

| Page type | Max width | Notes |
|---|---|---|
| Normal page (overview, agents) | 1320–1360 px, centred | inner lists don't set their own narrower width |
| Form/settings-like page | 1180 px | |
| Lists (history, changes, memory) | 1240 px | |
| Board, process canvas, workspace | full (1720 px cap or none) | |
| Two-column work pages (settings, help, admin) | full; settings content ≤ 920–1056 px next to the 262 px sub-nav | each column scrolls by itself |
| Reading column | 820 px (help article 900 px) | |
| Dialog forms | 1100 px max; text fields short and fixed |

Page padding `clamp(18px,1.6vw,28px) clamp(20px,2.1vw,38px) 30px`. Page head: title + one-sentence
intro left (≤ 70ch), the page's primary action right, aligned to the bottom (`align-items:flex-end`),
16 px gap to content.

## Grids that recur

- **Overview**: `minmax(0,1.75fr) minmax(250px,.7fr)`, gap 32 — work area left, activity column right
  (the activity column gets a calm, slightly lifted surface; actions sit left, "Improve" ends the row).
- **Master–detail** (agents, profiles): `minmax(270px,340px) minmax(0,1fr)`, gap 26; the list is
  sticky; the detail is one quiet panel (radius 12, 1 px `--line-soft`, padding 20 22).
- **Summary band** above master–detail: 4 KPIs in one hairline band (`repeat(4,1fr)`), 2×2 under 760.
- **Dialog content**: `1.25fr | 1fr` (main | aside), single column under 1080 px.
- **Dashboard**: 12-column grid, wide chart span 8 / narrow span 4, gaps 30 × 38, bands separated by
  38 px and hairlines.
- **Settings**: `262px | 1fr`; help `268px | 1fr`; admin `1fr | 1px | clamp(260px,22vw,380px)`.
- **Board**: 4 equal columns, gap 20.

## Responsive behaviour (desktop-first, Windows window sizes)

Verified sizes in Cadence: **1920×1080, 1360×900, 1280×800, 850×640**. Breakpoints used:
1280 (hide secondary top-bar items) · 1240 (dashboard charts full width) · **1120 (sidebar → icon
rail)** · 1100 (master–detail and two-column bands stack) · 1080 (dialog columns stack) · 980
(top-bar items drop their words) · **900 (settings sub-nav → horizontal; board → 2 columns; rows
stack)** · 860/760 (two-column work pages stack; history rows reflow; dialogs get 8 px margins) ·
540 (board → 1 column). No horizontal page overflow at any of them — text wraps, rows stack,
regions scroll internally. Respect Windows text scaling and resizing.

For web/mobile targets add a 16 px side gutter under 480 px, 44 px touch targets, and turn the rail
into a top or bottom bar; keep everything else.

## Density

Comfortable-dense, like a professional desktop tool:
- 34 px controls and nav rows; 52 px settings rows; 8–12 px gaps between related items;
  16–26 px between sections; 38 px between dashboard bands.
- Each row = label + one short hint + control. Long text → `(i)` tooltip.
- Separation hierarchy: **space → typography → hairline → subtle surface step → (rarely) 1 px
  bordered quiet container.** One container level, never cards in cards.
- Nothing decorative: no hero illustrations in the product, no gradient fills, no glass, no
  oversized empty areas, no uniform tile walls, no permanent status bars.

## Motion principles

Motion explains change and confirms action; it is sparse and quick.

1. **State colour transitions** on every interactive element: 120–160 ms `ease` on background,
   border and colour. No transitions on layout properties.
2. **Overlays enter, they don't perform**: menu 90 ms (−3 px, .98 scale), dialog 160 ms (+8 px,
   .985 scale) over a 140 ms backdrop fade, toast 180 ms (+7 px). Exits are instant.
3. **Micro-nudges** carry meaning: arrow of an inline action moves 3 px; chevrons rotate 90°/180°;
   the switch knob slides 14 px; a hovered chart arc thickens 18 → 22 px; the help play button
   scales 1.06.
4. **Live = gentle pulse**: green dot opacity pulse 1.8 s for running work, yellow ring pulse 1.6 s
   for an open decision, amber glow 2.4 s × 3 for a card that needs the user (then it stays still).
   Live activity lines show a pulsing dot in warning colour (command), blue (file) or violet
   (reasoning summary).
5. **Spinners** (13–16 px, 2 px ring with a red arc, 850 ms linear) mark work in progress inside the
   element that is busy — never a full-screen loader.
6. **Live updates never re-draw the view**: scroll position, focus and half-typed input survive
   incoming events.
7. Explanatory animations (help) run on long loops (7.5 s) with `cubic-bezier(.6,0,.3,1)`.
8. `prefers-reduced-motion: reduce`: pulses and entrances off, spinners slowed to 2.4 s.

## Interaction details that define the feel

- Every element that looks clickable is clickable and produces a visible state or result. No dead
  buttons, no empty dialogs.
- Hover, focus, pressed, disabled, loading, error and success are designed for every control.
- Keyboard everywhere: visible 2 px focus ring; arrows/Home/End in tabs, menus, lists, splitters;
  Escape closes; Ctrl+Enter sends; keyboard alternatives for every drag.
- Right-click opens a context menu wherever items can be acted on.
- Drag & drop always previews the result (drop zones, red-outlined target) before dropping.
- Double-click = "reset to automatic" on splitters and "fit" on canvases.
- Destructive actions say what they remove and how to get it back; heavy ones ask for a checkbox or
  the typed name; most changes are reversible (recovery points, restore deleted profiles).
- Questions to the user show the consequence of each answer, a recommendation, what waits on the
  answer, and allow continuing other work ("Answer later").
