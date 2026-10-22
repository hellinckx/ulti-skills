# Motion and component system — worked values

Long-form companion to `SKILL.md`. Worked easings, durations, reveal patterns, and the full component/state matrix. Every value is an **example range to adapt**, tuned to the direction. Rich/complex animation and graphics (WebGL, canvas, particle systems, data viz) belong to `motion-and-graphics`; this file covers interface motion and component states.

## Easing

Define a small named set and reuse it; don't invent a curve per element.

| Name | cubic-bezier | Use |
|---|---|---|
| ease-out-soft | `0.16, 1, 0.3, 1` | entrances, reveals (decelerate into place) |
| ease-in-out-ui | `0.4, 0, 0.2, 1` | toggles, expands, nav, most UI transitions |
| ease-in-fast | `0.4, 0, 1, 1` | exits / dismiss (accelerate away) |
| spring (playful only) | via spring/physics | overshoot for energetic directions |

Avoid `linear` except continuous loops (marquees, spinners, ambient background). Entrances decelerate; exits accelerate.

## Duration bands

Faster for small/near elements, slower for large/far. Three bands:

| Band | Range | Examples |
|---|---|---|
| micro-feedback | 80–160ms | hover, press, focus ring, color/underline shift |
| UI transition | 200–400ms | scroll reveal, accordion, dropdown, tab, nav open |
| large / hero | 400–800ms | hero intro, page transition, full-section move, modal |

```css
:root {
  --ease-out: cubic-bezier(.16,1,.3,1);
  --ease-ui:  cubic-bezier(.4,0,.2,1);
  --d-micro: 120ms; --d-ui: 280ms; --d-hero: 560ms;
}
```

## Scroll reveal (with hierarchy)

The anti-generic rule: **not one identical fade-up on everything.** Reveals have a hierarchy and a small, staggered cascade.

- **Distance**: fade + rise 8–24px (bigger elements move a little more). Never a long 100px slide.
- **Stagger**: 40–80ms between siblings down a group; the group leads, children follow.
- **Trigger**: start when the element is ~10–15% into the viewport (slightly before fully visible); animate **once**, don't replay on scroll-up.
- **Hero** may use a larger, choreographed intro (title, then deck, then CTAs) within the hero band.

```css
.reveal { opacity: 0; transform: translateY(16px); }
.reveal.in { opacity: 1; transform: none; transition: opacity var(--d-ui) var(--ease-out), transform var(--d-ui) var(--ease-out); }
.reveal:nth-child(2){ transition-delay: 60ms; }
.reveal:nth-child(3){ transition-delay: 120ms; }
```

Use `IntersectionObserver` to add `.in`; unobserve after first trigger.

## Hover / press as physical feedback

Small, immediate, reversible — it should feel like touch (≤160ms).

- **Card hover**: `translateY(-2px…-6px)` + shadow step up (and/or media `scale(1.03)` under `overflow:hidden`).
- **Link hover**: underline grows from left (animated `background-size`) or trailing arrow nudges `translateX(2–4px)`.
- **Button press**: `translateY(1px)` or `scale(.98)` on `:active`.
- Always pair with a visible `:focus-visible` ring for keyboard users.

```css
.card { transition: transform var(--d-micro) var(--ease-ui), box-shadow var(--d-micro) var(--ease-ui); }
.card:hover { transform: translateY(-4px); box-shadow: var(--elev-3); }
.link .arrow { transition: transform var(--d-micro) var(--ease-ui); }
.link:hover .arrow { transform: translateX(3px); }
```

## Component / state matrix

Specify every state, not just the resting look. Minimum per component:

| Component | States to define |
|---|---|
| Button (primary/secondary/tertiary) | rest, hover, active/pressed, focus-visible, disabled, loading |
| Link (inline / standalone) | rest, hover (underline/arrow), focus-visible, visited (where it matters) |
| Card | rest, hover-lift, focus-within, featured/active, pressed (if clickable) |
| Input / textarea / select | rest, hover, focus, filled, error, disabled, with help text |
| Nav item | rest, hover, active/current, focus-visible; open/closed for menus |
| Dialog / drawer / menu | enter, exit, backdrop, focus-trap, Esc-to-close, scroll-lock |
| Toast / inline alert | enter, auto-dismiss, manual dismiss, stacked |
| Tabs / accordion | selected, hover, focus, expand/collapse transition |
| Cookie / consent | privacy-first default order, keyboard operable, same system styling |

Button hierarchy (fill → outline → text) is the backbone; a consistent trailing `→` on standalone links/CTAs is a cheap, strong signature.

## Radius and elevation as systems

Pick a *small* set and apply it consistently — ad hoc radii and shadows are a generic tell.

| Radius token | px | Use |
|---|---|---|
| radius-control | 8–10 | buttons, inputs, chips |
| radius-card | 14–20 | cards, media, panels |
| radius-pill | 999 | eyebrow badges, pills, FABs |

| Elevation | Shadow (illustrative) | Use |
|---|---|---|
| elev-0 | none | flush content |
| elev-1 | `0 1px 2px rgba(0,0,0,.06)` | subtle separation |
| elev-2 | `0 4px 12px rgba(0,0,0,.10)` | cards, raised |
| elev-3 | `0 12px 32px rgba(0,0,0,.16)` | hover, popovers, FAB |

Shadow color/opacity comes from `color-system` per theme. In dark themes, prefer raising surfaces by lightness over heavy shadow. Keep 2–4 elevation steps; more flattens the hierarchy.

## Reduced motion (required)

Honor `prefers-reduced-motion: reduce`: remove travel and parallax, keep essential opacity/instant state so nothing is lost or hidden.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .001ms !important; transition-duration: .001ms !important; scroll-behavior: auto !important; }
  .reveal { opacity: 1 !important; transform: none !important; }
}
```

Ambient/decorative video or motion should offer a pause control and should not autoplay with motion for reduced-motion users.

## Floating / persistent affordances

Stack persistent actions (back-to-top, chat/contact) bottom-aligned with consistent spacing, pill radius, `elev-3`, and a clear hover. They must be keyboard reachable and not cover content or focus targets on small screens.
