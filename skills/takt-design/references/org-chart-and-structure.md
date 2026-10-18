# Org chart, structure views and live diagrams

The Cadence org chart is the reference for showing people, roles and live work as a tree. Reuse it whenever a product shows teams, hierarchies, ownership or flows between actors.

## Canvas
- Free 2D canvas over the full content width, height `clamp(460px, 64vh, 860px)`, background `#141215`, 1 px hairline border, radius 8.
- Drag pans (cursor `grab` → `grabbing`), mouse wheel zooms around the pointer (`exp(-deltaY × 0.0015)`, limits 0.3–2.2), horizontal trackpad scroll pans, double-click on empty space fits, keyboard on the focused canvas: arrows (60 px, Shift 160 px), `+`, `-`, `0` fits.
- Fit: scale to the canvas minus 24 px margins, at most 1.15, centred. Re-fit when content or canvas size changes unless the person moved the view themselves; keep the view across live redraws.
- A click after a drag does nothing; a click without movement selects. Corner hint at bottom right: "Drag to pan · mouse wheel zooms · double-click fits" (11.5 px, quiet, on a translucent chip).
- Details of the selected item go **below** the canvas in full width — never in a narrow side column that clips content. Mouse selection scrolls the details into view; keyboard selection keeps focus in the chart.

## Tree layout
- Top: the customer/requester as a pill (156 × 46, radius 23) and, to the right, an advisor pill (150 × 40) joined by a dotted line.
- Cards 196 × 78, radius 10, horizontal gap 22, vertical gap 64. A parent with four or more leaf children lays them out as a grid with a shared bus line.
- Reporting lines: orthogonal paths with 8 px rounded corners, 1.4 px `#3b3239`; parent → bus at half the gap → child top centre. From the customer to companies the line is dashed (4 5) because a customer is not a manager.
- Card anatomy: 4 px left edge bar (green when working, amber when waiting, red on error), avatar circle r 16 with the role emoji in the agent colour, name 13.5 px/640 (12 px when longer than 17 characters, shortened at 22 with a title tooltip), state line 11.5 px with dot + word + elapsed time, meta line (current activity or role) 11.5 px, counters top-right (▶ running, ⏳ queued, ✓ done) in tabular figures.
- Selected card: dark accent fill `#241519`, accent stroke 1.6. Hover strengthens the stroke; focus shows the focus colour at 2 px.
- Working cards get a soft breathing halo (2.2 s), never a bouncing animation; respect reduced motion.

## Several organizations side by side
- Each organization is a quiet frame: rect radius 16, fill one step above the canvas (`#171519`), hairline stroke, 18 px inner padding.
- Header pill at the top of the frame: 220 × 34, radius 17, a 4.5 px role dot (accent = home, teal = supplier, violet = partner, amber = audit), name 12.5 px/650, role and form 10.5 px quiet.
- Frames stand next to each other with 56 px plus padding between them; the managements sit at the same height. There are never reporting lines across frames.

## Flows and trade
- Live flows inside a team follow the reporting lines (up to the common manager, down to the target), drawn as 1.8 px dashed animated lines (5 6, 1.1 s) in the flow colour with an arrow marker, two small particles (r 3.6) moving along the path and one pill label (20 px high, radius 10, 10.5 px/600) at the middle.
- Colours per meaning: order = accent, handover = teal `#82d6d0`, review = violet `#caa6ff`, rework and questions = amber `#f1c778`, delegation = blue `#9cc6ff`. The legend toggles each kind and an "As table" disclosure lists all flows.
- Trade between organizations is **not** a fixed line: a smooth arc from card top to card top that rises just above the frames, drawn **behind** the cards with its label **above** them. Opacity comes from the data: full for 3 minutes, then linear fading to 0.22 at 30 minutes, then gone. An unpaid counter-performance stays dashed amber (min opacity 0.55, at most 2 hours). Identical trades between the same two agents merge into one arc with "×n". Labels avoid each other by moving along the curve.

## Structure list (team structure)
- A tree list with guide lines (vertical, branch, corner) in 26 px cells; leads show a counter of their reports.
- Grouped by organization when there is more than one: group header with role dot, bold name and "role · form · count" in quiet text, a hairline between groups.
- Drag a row onto another to change the reporting line (red outlined target), a dashed "top level" drop zone appears while dragging; right-click or the context-menu key offers the same without a mouse.

## Fold sections (details below a figure)
- Use for "see everything" pages under a diagram: one quiet surface per section (`#1b181c`, radius 8), 48 px summary row with a 8 px chevron that rotates 45° → 135°, title 14 px/620, a one-line subtitle that ellipsizes, right-aligned meta (counts, state word with dot, small step track).
- Body below a hairline, 14–18 px padding, left indent 36 px. Nested folds inside a body are rows without their own surface, separated by hairlines.
- Every fold has a stable key so live redraws keep it open or closed. Never render an expandable item without content; plain rows have no chevron.

## Phase cells and step tracks
- Phase cells: a grid of up to four cells, `#221e23`, radius 6, 2 px inset left edge in the state colour, kicker 11.5 px caps, state word with dot, one line of time and run count, one line of who. Selected cell uses the dark accent fill. Cells are buttons.
- Step track: an SVG strip 6 px high, one rounded segment per step, coloured by phase kind (work green `#9ed7b3`, increment violet `#b49cff`, review amber), planned steps `#2f2930`, the running step at 55 % opacity. Always with an `aria-label` like "3 of 7 steps done".

## Cycle figure (process loops)
- For iterative processes (Scrum, release trains): stations as circles r 24 with a line icon, card stacks for backlogs, one large loop ring (r 92, 10 px track, accent progress arc with rounded caps and an arrow head), a small inner loop for review and rework with its count, a dashed return arc to the next iteration, and the post-loop path (release → acceptance → goal) below.
- Running stations pulse in green, waiting ones in amber, finished ones get a green stroke. Selecting a station opens the matching fold section below and scrolls to it.
- Provide a compact vertical layout below 760 px container width.

## Communication rows
- One row per exchange: kind label in caps (11.5 px, coloured by kind), "from → to" with identity badges, title, time right-aligned; the row expands to the full text rendered as Markdown, findings and an "Open task" quiet button.
