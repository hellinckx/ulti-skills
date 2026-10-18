# Acceptance checklist for a 3D system mirror

Tick every line in the real, built app with real data before calling it done.

## Truth
- [ ] Every bubble, screen, board, count and log line traces to a field of the world store.
- [ ] Empty sources show "No … yet", never sample content.
- [ ] Paused/queued/failed states show the real reason (quota, sign-in, error text) and resume time if known.
- [ ] Workers of later stages appear as holograms with "Starts in …", not as active workers.
- [ ] Talk topics exist only when their data exists.
- [ ] Personas change presentation only (no prompts, models, budgets, tools, rights); invalid input rejected.

## Look
- [ ] Outside view, exploded view, every floor close-up at 1280×720, 1440×900, 1920×1080, 2560×1440.
- [ ] Dark (night) and light (day) theme; app in another language keeps the world in its fixed language.
- [ ] Furniture fits the characters: no tables at eye height, no heads behind counters, monitors at eye level.
- [ ] First person of **every** worker: desk workers read their own screen; others see the room, not a face.
- [ ] Bubbles never shown through a floor slab; overlapping bubbles stack; info panel never covers the subject.
- [ ] Screens readable when zoomed in (code, logs, checks, charts).
- [ ] Hover glow + label on every clickable thing; cursor changes; none on the computer in use.
- [ ] At a desk: virtual pointer, drag-select, Ctrl+C/right click copy verified in the system clipboard, Ctrl+A, wheel scroll, all tabs, search with results that open.
- [ ] Characters: faces readable in every close-up, shapes distinct, expressions follow the mood.

## Behave
- [ ] Working → desk; paused → break area; idle → persona routine (breaks, conversations) and back.
- [ ] Camera follow starts after the fly-in; zooming into the closed building opens it.
- [ ] Split screen with 1, 4 and all workers.
- [ ] Search, keyboard (`/`, `E`, `F`, `PageUp/Down`, `Esc`), focusable panels.
- [ ] Reduced motion: no wobble, no walking animation, still updates.

## Budget
- [ ] fps and draw calls recorded (target 60 fps at 1440×900 on a normal laptop; draw calls well below 1,000).
- [ ] View lazy-loaded; app start unchanged.
- [ ] No console errors during the whole QA run.
