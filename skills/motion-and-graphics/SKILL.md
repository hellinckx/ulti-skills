---
name: motion-and-graphics
description: Create purposeful motion and 2D or 3D graphics for interfaces and games. Choose useful animation, tune
  curves and durations, and build performant Canvas, SVG, or WebGL visuals without network dependencies.
metadata:
  creator: Cadence project
  created: '2026-09-30'
  creation-method: Editorial Markdown guide written in the Cadence repository; no external template or executable
    scripts.
  purpose: Build accessible, performant motion and graphics without network dependencies.
  scope: Installation-wide; included with relevant tasks in every connected project.
---

# Motion and graphics

## Decide whether motion is useful
- Use motion to explain origin and destination, show a state change, or provide feedback. Remove decoration that communicates nothing.
- Keep frequent actions such as typing and tab changes still or very brief. Important, uncommon moments such as first launch or completion may take longer.

## Curves and duration
- Typical durations: 80–150 ms for small feedback, 150–250 ms for fades, 220–320 ms for dialogs and spatial transitions, and up to 500 ms for large scenes. Shorten elements that move farther.
- Use `cubic-bezier(.2,.7,.2,1)` for entering and `cubic-bezier(.4,0,1,1)` for leaving. Springs can suit interruptible drag and swipe interactions.
- Animate `transform` and `opacity`, not layout properties such as `width`, `top`, or `box-shadow` in a loop. Allow a new state to start from the current position.
- Under `@media (prefers-reduced-motion: reduce)`, replace motion with an immediate change or a short fade.

## 2D graphics
- Use SVG for icons, charts, and scalable shapes. Use Canvas 2D for many moving objects. Account for `devicePixelRatio` when sizing the canvas.
- Drive animation with `requestAnimationFrame` and a fixed logic step so speed does not depend on frame rate. Pause when the page is hidden.
- Keep collision, physics, and state separate from rendering so they can be tested with `node:test`.

## 3D graphics
- The network is disabled, so do not load CDN libraries. Use WebGL directly for small effects, or use a library file already present in the project.
- Use few light sources, a restrained palette, and gentle camera motion. Apply fog or depth of field sparingly.
- Reuse geometry and instances. Keep textures small and reduce resolution dynamically on slower devices.

## Game interfaces
- Keep the HUD near the edges and leave the central play area clear. Use tabular numerals and briefly emphasize changed values.
- Treat start, pause, restart, and end as distinct states with keyboard and touch support.
- Give each hit or action brief feedback. Avoid continuous blinking.

## Check motion quality
Observe animation in the workplace browser over multiple frames. Check for startup stutter, forgotten timers or listeners, and memory leaks. Test touch targets, portrait layout, and overflow at mobile and tablet widths.
