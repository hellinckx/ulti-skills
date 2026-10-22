---
name: 3d-system-mirror
description: Mirror a running system (agents, services, jobs, queues, pipelines) as an interactive 3D world
  inside its own UI — a building whose floors open up, rooms per activity, characters with faces for the
  workers, bubbles with the real current task, live screens as usable canvas textures, god view, first person
  and split screen — where every visible number and sentence comes from real data. Use when someone wants to see
  their system as a game-like world, 3D office, living org chart or digital twin. Not for plain dashboards, data
  the app cannot read, or staged fake activity.
metadata:
  creator: hellinckx
  created: '2026-10-18'
  updated: '2026-10-22'
  origin: Written from building and accepting a 3D office for a 14-agent organisation (Electron, React, three.js, procedural geometry).
---

# 3D system mirror

A recipe for turning a real system into a beautiful, explorable 3D world that never lies. The world is a **view**,
not a second system: it reads the same data the app already has and adds presentation (places, characters, moods,
conversations) that is either taken from that data or clearly derived from it.

## 1. Requirements that held up in review (keep all of them)

1. **A world, not a chart.** Its own view with a **god view**. First the building from outside; zoom in or click and
   the **floors separate** (exploded view) so every room can be seen. Rooms match activities: desks with computers
   where workers work, a lab for tests, a library for documents, a court for decisions, a trading or delivery floor,
   coffee, lounge and roof terrace. Built **procedurally from primitives**; light, materials and a small surrounding
   world matter.
2. **Workers are characters.** Solid, toy-like figures **with faces**, each a **different shape**, playful but not
   childish. Each has a human name and a personality (configurable, good defaults). They sit at their computer when
   working, walk to breaks when idle and talk to each other between tasks. A bubble above each shows **the real
   current task**, or a chat or chill line when idle.
3. **Mirror the real system, never fake.** Activity, current run, live streamed text, tokens, queued and paused lanes
   with the real reason, jobs in the lab, decisions, documents, fetches. Deterministic services get stations too. An
   empty source shows "No … yet", never sample content.
4. **Screens show the work** — code being written, logs, small charts — live where possible, otherwise the latest,
   rendered as **canvas textures** that stay readable up close.
5. **Interaction.** Clickable things are highlighted (glow, cursor, label); a click opens details (log, run, model,
   tokens, history, links into the app). Search. **First person** from any worker. **Split screen** of 1…all workers.
6. **Usable computers.** Sitting at a desk turns the real pointer into a **virtual pointer on the screen**; drag to
   select, Ctrl+C / right click to copy, Ctrl+A, wheel to scroll; extra pages with stats about the worker, who used the
   computer when, and a search through its work. No hover glow on the computer in use.
7. **Personas are configurable** (name, traits, look, behaviour) and stored by the app; presentation only — never new
   tools, rights or prompts.
8. **Language and scale.** The world can use one fixed language independent of the app (here: always English).
   Furniture is built to the characters' size; every first-person view is checked by eye.
9. **Bubbles behave like objects:** hidden exactly where something stands in front of them, readable, uncluttered.

Requirements change while people look at the result. Expect several rounds on the characters and the bubbles; build
so those parts can be swapped (one component each).

## 2. Architecture: data adapters → world state → scene

```
existing app streams ─► feeds (subscribe once, guard every call)
                              │
                              ▼
                       world store (plain real data)
            ┌─────────────────┼──────────────────────┐
            ▼                 ▼                      ▼
  behaviour simulation   bubble text, topics,   screen models → painter → CanvasTexture
  (pure, seeded, tested)   mood (derived)              ▲ interaction state (pointer, selection, tabs)
            └──────────────► scene components ◄──────┘  (read stores in the frame loop, not via React state)
```

- **Feeds:** subscribe to every existing stream once per view; wrap each call so a missing or still-growing API
  cannot break the view; debounce chatty sources; fetch details (full logs, results) only when a status changes.
- **World store:** one plain data object. Helpers decide which run a worker shows, stitch stored log + live deltas,
  decode a half-streamed JSON field (e.g. code inside a structured answer), map events to workers.
- **Behaviour simulation:** deterministic, seeded, no rendering code. Real activity decides place and pose; only idle
  workers follow their persona (breaks, conversations).
- **Scene:** components read the simulation and stores in the frame loop through refs. React re-renders only when
  structure changes.

## 3. Building, rooms, routes

- Keep the **plan as data**: floor height, slab, footprint, corridor, elevator core, rooms (kind, floor, bounds,
  door), one station per worker (position, facing, desk style, optional extra waypoints, raised seat), hangouts
  (gathering spots facing a centre), wall displays.
- **Map work to rooms by meaning:** intake → newsroom, documents → library, writing code → studio, review → review
  room, simulation → lab, decisions → court, money → trading floor, leadership → top floor, breaks → café, lounge,
  roof.
- **Routes:** room → hub → door → corridor lane → (elevator) → corridor → door → hub → target. Keep room centres free so
  straight segments never cross furniture.
- **Exploded view:** `y(level) = level × (floorHeight + explode × gap)`, plus a per-floor lift that moves floors above
  the focused one out of the way. Everything on a floor (characters, elevator riders) uses the same function.
- **Walls:** glass outside, solid and uniform inside (one height, one material, door lintels). Cameras that follow
  must look over the wall tops or along corridors.
- **Scale to the characters:** decide their size first (here 0.6–0.9 m), then seats (cushions ~0.32 m), desks
  (~0.62 m), tables (~0.38 m), counters (~0.72 m) and monitors at eye level. Human-sized furniture hides them.

## 4. Characters, mood and state

- **Shapes:** a profile function `r(t)` for a lathe (round, tall, wide, drop, egg, pear, mushroom, peanut, gumdrop) and
  a rounded box for a cube; per-character proportions from a stable seed. The same profile places the face on the
  surface. See `references/patterns.md`.
- **Material:** solid satin vinyl (`MeshPhysicalMaterial` with clear coat and sheen), a top-to-bottom gradient of the
  persona colour, a subtle jiggle and breathing in the vertex shader, a rim light in the state colour. Characters of
  later stages appear as translucent holograms.
- **Face:** glossy eyes with pupils and highlights, brows, several mouths (smile, grin, flat, frown, o, wavy), cheeks.
  Expression per mood: eye openness, brow tilt, mouth, blush, wandering gaze; blinking; talking opens the mouth.
- **Body language:** arms type at the desk, gesture while talking, swing while walking, rise when excited, droop when
  tired; feet step; an error makes the body shiver.
- **Mood** is simulated but derived **only from real signals** and always shown with its reason, e.g. working →
  focused; success in the last 10 min → excited; failure in the last 30 min → frustrated; waiting for quota or
  sign-in → restless; most of the daily budget used → tired; talking → cheerful; break → relaxed.
- **State colour** (rim and floor ring) stays readable at a glance: working blue, thinking cyan, queued amber, paused
  amber, error red.
- **Reduced motion:** no jiggle, teleport instead of walking, camera cuts, render on demand with a slow tick so data
  still updates.

Rejected on the way and why: glassy virions with spikes (busy, not "cool"), a single liquid mass without a face
(lost personality). Faces and distinct silhouettes won.

## 5. Bubbles and names

- **Text priority:** real run (task, subject, last ~70 streamed characters, size) → real reason for waiting, pausing
  or failing → chat line → "last run: task · tokens · time" → ready.
- **Talk is real:** build talking points only from data that exists (latest decision, counts, newest item, latest job,
  quota, usage). Lines are i18n arrays; personality picks variants.
- **Bubbles are objects in the world, not HTML overlays:** a canvas texture on a plane that copies the camera rotation,
  `depthTest` on, `depthWrite` off. Whatever stands in front hides exactly the covered part; the rest stays visible.
  HTML overlays always draw on top (bubbles through floors); ray tests are all-or-nothing.
- **Style like the in-world screens** (dark glass, state-coloured frame, mono detail line, tail). The **name floats
  above the head without background**, the mood small below it; the bubble above the name shows only content.
- Size grows mildly with distance (`clamp(d/9, 0.42, 3.4)`), fades in and out, shows only for the focused floor, and a
  declutter pass stacks overlapping bubbles (screen-space projection, nearest first, shift converted back to metres).
- Keep a visually hidden list of all bubble texts for screen readers and tests.

## 6. Screens as live textures, and computers you can use

- Compose a small **screen model** per screen (title, status, body: code | log | chart | bars | checks | columns |
  cards | text | lines | hologram | split) and paint it on a canvas; repaint only when the model's JSON signature
  changes. Desk monitors 768–1024 px, wall displays 1024 px.
- **Text layout returns geometry:** the painter lays code, logs, text and line lists out as visual lines and returns
  them, so pointer UV → canvas pixel → line and character. Selection, scroll offset (logs anchored at the bottom),
  scrollbar, tabs and a **virtual pointer** (arrow or I-beam) are painted into the texture; the real cursor is hidden
  over the screen and camera controls are off while the pointer is on it.
- **Keyboard:** a visually hidden textarea keeps focus while a screen is in use, so app shortcuts stay quiet and typing
  reaches the screen's search. Ctrl+C or right click copy (Clipboard API with a fallback), Ctrl+A, Ctrl+1…4 tabs,
  Ctrl+F search, arrows and PageUp/PageDown scroll, Esc leaves. Focus it with `preventScroll`, and refocus it after a
  click into the 3D view (the page container may take focus).
- **Desk tabs:** Work (live work or a run opened from search), Agent (mood with reason, state, model, budget, run
  counts, success rate, averages, recent runs), Computer (workstation, owner, 24-hour activity strip, who used it when
  — real runs and events), Search (logs, answers and errors of recent runs plus events; fetch full logs on demand;
  click a result to open it).
- **"Use computer"** puts the camera in the desk chair looking at the monitor, wherever the worker is; the worker's own
  (hidden) body must let pointer events through.

## 7. Cameras

- Orbit controls (e.g. drei `CameraControls`) with shots per mode: outside, exploded, floor close-up (upper floors
  lifted), follow a worker (front-side in rooms, along the corridor in corridors, over the shoulder at the desk; start
  following only after the fly-in finished), display and object close-ups. Zooming into the closed building opens it.
- Keep the subject in the free area beside an info panel: measure the panel, convert half the covered width to metres
  at the orbit distance (`setFocalOffset`) or shift the projection in first person (`setViewOffset`).
- **First person:** controls unmounted, camera eased to the eyes; at the desk it frames the whole monitor; elsewhere
  it looks ahead from slightly behind the eyes with the own body hidden.
- **Split screen:** one canvas, a frame callback at priority 1 renders the scene once per selected worker with
  scissor/viewport, plus a CSS grid overlay with names and status.

## 8. Interaction and accessibility

- Clickable groups tint their standard materials with an accent emissive on hover (cloned, restored on leave), show a
  pointer and a label "name · what a click does"; mark them so static merging leaves them alone.
- An info panel per selection with links into the app's views; search (`/`) over workers, displays, objects, floors;
  keyboard for modes and floors; Esc steps back. All panels are real DOM with focusable controls.

## 9. Performance budget

- Shared unit geometries scaled per mesh; **instancing** for books, LEDs, mullions, trees, bushes, flowers, cars.
- **Static merge:** after mount, merge static furniture below each floor into one mesh per material (and shadow flag)
  and hide the originals. Measured: 1,888 → ~650 draw calls before characters; ~900 with 14 detailed characters and
  a landscaped surrounding.
- One shadow-casting light, only big pieces cast; `dpr` capped (~1.75); lazy-load the whole view so the app starts as
  before; write fps, draw calls and triangles to data attributes once a second for tests.

## 10. Personas (presentation only)

A shared contract (name, 1–3 traits, bio, colour, shape, accessory, size, chattiness, break tendency, energy, global
behaviour) stored as one validated JSON value in an existing key/value settings table (no migration), with field-wise
repair of damaged values, change notifications and an editor in the view. Personas never reach prompts, models,
budgets, tools or permissions.

## 11. Testing with real data

- Build the real app and drive it with Playwright against a **copy** of real data (e.g. SQLite `VACUUM INTO`; switch off
  autonomous jobs in the copy) and, if useful, the real sign-in. Trigger one cheap real job to show a live state.
- Script every mode at 1280×720, 1440×900, 1920×1080, 2560×1440; each floor and display; worker close-ups; **first
  person of every worker**; split screen; hover; persona edit and rejected invalid input; light theme; app in another
  language; reduced motion; at a desk: select, Ctrl+C and **read the system clipboard** from the main process, Ctrl+A,
  scroll, tabs, search. Record fps, draw calls and console errors.
- **Look at every screenshot** (contact sheets help) and fix what looks wrong. Typical findings: furniture at eye
  height, cameras inside walls, panels covering the subject, bubbles through floors, hidden bodies catching clicks,
  focus moving to the page container, test pointers outside a smaller screen.

## 12. Adapting to another domain

1. List the workers (people, services, agents, jobs) and their **real** states; list the artifacts they produce and the
   events.
2. Map each worker to a room by meaning, and each artifact type to a display or a prop that grows with real counts
   (books per document, LEDs per running job, a gavel per decision, an antenna per fetch).
3. Write feeds and store first; keep the simulation pure and tested; then build geometry.
4. Decide character scale, build furniture to it, check every first-person view.
5. Every visible number and sentence must trace back to a field in the store.

## Reference files

- `references/patterns.md` — the core techniques as code: character profiles, static merge, world-space bubbles,
  screen text hit-testing, split-screen rendering, view offset beside a panel.
- `references/checklist.md` — the acceptance checklist.
