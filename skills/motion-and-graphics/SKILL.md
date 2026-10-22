---
name: motion-and-graphics
description: Decide which interface motion is worth having and build fast, accessible 2D and 3D graphics —
  timing and easing, reduced-motion paths, SVG and Canvas 2D, three.js / React Three Fiber scenes, readable text
  in 3D, game HUDs, frame-rate-independent loops and measured performance budgets. Use for animation,
  transitions, hand-drawn charts, canvas games, 3D scenes and any "make it feel alive" request. Not for static
  layout (design-craft) or palettes (color-system).
metadata:
  creator: Cadence project
  created: '2026-09-30'
  updated: '2026-10-22'
  origin: Interface motion practice plus 3D lessons from building a procedural three.js office.
---

# Motion and graphics

## 1. Decide whether motion is useful
- Motion explains origin and destination, shows a state change or confirms an action. Remove motion that communicates nothing.
- Keep frequent actions (typing, tab changes, list filtering) still or very brief. Rare, important moments (first launch, completion) may take longer.
- Motion must never block input: a new state starts from the current position, and the person can act before an animation ends.
- Every animated thing has a reduced-motion path: under `@media (prefers-reduced-motion: reduce)` (or the app's own setting) replace movement with an immediate change or a short fade, stop ambient loops and parallax, and cut cameras instead of flying them.

## 2. Curves and duration
- Typical durations: 80–150 ms small feedback, 150–250 ms fades, 220–320 ms dialogs and spatial transitions, up to 500 ms for large scene changes. Shorter for elements that move less far; longer for big surfaces.
- Easing: `cubic-bezier(.2,.7,.2,1)` for entering, `cubic-bezier(.4,0,1,1)` for leaving. Springs suit interruptible drag, swipe and camera motion.
- In frame loops ease with frame-rate-independent damping, `value += (target - value) * (1 - Math.exp(-rate * dt))` (three.js: `MathUtils.damp`), never with a fixed factor per frame.
- Animate `transform` and `opacity`. Do not animate `width`, `top` or `box-shadow` in loops; use `will-change` only while an animation runs.
- Stagger lists by 20–40 ms per item and cap the total at about 300 ms.

## 3. 2D graphics
- SVG for icons, charts and scalable shapes with few elements; Canvas 2D for hundreds of moving objects; WebGL beyond that.
- Size canvases for `devicePixelRatio` (`canvas.width = cssWidth * dpr`, then `ctx.scale(dpr, dpr)`), and redraw on resize with a `ResizeObserver`.
- Drive animation with `requestAnimationFrame`, a fixed logic step and an accumulator, so speed never depends on the frame rate. Pause when the document is hidden.
- Keep simulation, collision and state separate from drawing so they can be unit-tested without a browser; seed randomness so runs are reproducible.
- Charts: label axes and units, tabular numerals, no 3D effects on 2D data, and a text or table alternative for screen readers.

## 4. 3D graphics
### Stack and assets
- Use a library already in the project; otherwise three.js, and React Three Fiber (`@react-three/fiber`) plus `@react-three/drei` in React apps. Pin exact versions and bundle them; do not load runtime code from a CDN in desktop apps or offline products.
- Prefer procedural geometry from primitives (boxes, cylinders, lathes, extrusions) over model files when the style allows it: no asset pipeline, tiny bundles, every piece parameterised.
- Decide the scale of the main subject first (characters, vehicles, pieces) and build everything else to it. Check the view from the subject's own eyes.

### Light, material, camera
- One shadow-casting directional light plus hemisphere or ambient fill; only large pieces cast shadows. A restrained palette, physical materials (`MeshStandardMaterial`, `MeshPhysicalMaterial` with clear coat or sheen for toy-like surfaces), fog or depth of field sparingly.
- Gentle camera moves with damping (drei `CameraControls`); never spin the camera on its own. Clamp distance and polar angle so the camera cannot go under the ground or through walls; cameras that follow a subject look over walls or along corridors.
- When a side panel covers part of the canvas, keep the subject in the free area: an orbit focal offset (half the covered width in metres at the orbit distance) or `camera.setViewOffset` in first person.

### Text and labels in 3D
- Readable text inside a scene is a `CanvasTexture` painted at 512–1024 px wide, with `colorSpace = SRGBColorSpace`, anisotropy 4–8 and `toneMapped: false`. Repaint only when the content's signature changes, at most a few times per second.
- Labels that must be hidden by objects in front belong in the scene as camera-facing planes with `depthTest: true` and `depthWrite: false`, so only the covered part disappears. HTML overlays always draw on top and show through walls; use them only for UI that should.
- Scale labels mildly with distance and declutter overlaps in screen space (project, sort by distance, push later ones up).

### Interaction
- Raycast only against meaningful targets; mark pickable groups and give them a hover state (emissive tint, pointer cursor, short label of what a click does).
- Make every 3D action reachable by keyboard or from an accessible list next to the canvas (search, buttons, a visually hidden list of what is shown).
- For screens inside the scene that people can use, map pointer UV to canvas pixels and draw the cursor, selection and scrollbars into the texture; hide the real cursor over the screen and pause camera controls while it is in use.

## 5. Performance budget
- Targets: 60 fps at the common laptop size, draw calls well below 1,000, no long tasks above 50 ms during interaction, no growth in memory over a 10-minute run.
- Reuse geometry and materials; scale shared unit geometries per mesh. Use `InstancedMesh` for repeated objects (trees, books, lights, particles).
- Merge static meshes per material after mount (`BufferGeometryUtils.mergeGeometries`) and keep animated or clickable pieces separate.
- Cap `dpr` (about 1.5–1.75), keep textures small, use `frameloop="demand"` with an explicit invalidate when nothing moves, and lower quality dynamically on slow devices.
- Dispose geometries, materials and textures on unmount; remove listeners and timers. Lazy-load heavy 3D views so the rest of the app starts as fast as before.
- Expose fps, draw calls (`renderer.info.render.calls`) and triangles to tests, for example as data attributes updated once a second.

## 6. Game interfaces
- HUD near the edges, the centre of play clear; tabular numerals; briefly emphasise changed values.
- Start, pause, restart and end are distinct states with keyboard, touch and controller input where supported.
- Each hit or action gets short feedback (scale pop, flash, sound with a mute setting). No continuous blinking; nothing flashes more than three times per second.

## 7. Verify by looking
- Run the real build and observe animations over several frames or a short screen recording. Check startup stutter, timers and listeners left running, memory over time and behaviour when the window is hidden and shown again.
- For 3D, capture every camera mode and important view at small and large window sizes, plus reduced motion and each theme; open and inspect every image. Typical defects: objects at the wrong scale, cameras inside walls, labels through floors, panels covering the subject, black frames from cameras behind geometry.
- Record fps and draw calls next to the screenshots. Report what was measured, on which machine, and what was not checked.

## Works with
- `3d-system-mirror` — a complete recipe for mirroring a live system as a 3D world on top of these practices.
- `design-craft` — direction, layout and motion bands this skill builds on; `color-system` — palettes and contrast for scenes and HUDs.
- `interface-review` — viewport screenshots and task walkthroughs for interfaces with motion.
