# Web craft method — worked values

Read on demand from `SKILL.md`. It shows the Direction-first method with concrete scales and patterns. Every number here is an **example range to adapt**, not a fixed brand. Change the direction and the values follow; the structure does not.

## Step 1 — Write the direction

One short block, before any markup. Example:

> *Intent:* marketing landing for a developer tool; must convince and convert.
> *Adjectives:* confident, editorial, precise, quietly technical.
> *Density & voice:* spacious, large display type, restrained accent.
> *Signature move:* one word per headline shifts to the accent/muted weight; every standalone link ends in a trailing arrow that nudges on hover.

Pin this where you can see it. Every later tie-break cites it.

## Step 2 — Spacing scale

Pick **one base unit** and a stepped ramp. 8px base is the common default; 4px base when the UI is dense.

| Token | px (8-base) | Typical use |
|---|---|---|
| space-1 | 4 | icon gap, tight inline |
| space-2 | 8 | label→value, chip padding |
| space-3 | 12 | control padding Y |
| space-4 | 16 | body paragraph gap, card inner |
| space-5 | 24 | card padding, group gap |
| space-6 | 32 | sub-block separation |
| space-8 | 48 | intra-section blocks |
| space-10 | 64 | small section padding Y |
| space-12 | 96 | section padding Y (desktop) |
| space-16 | 128 | hero / major band padding Y |

Two rhythms, kept clearly apart:

- **Intra-component** (inside a card/row): steps 1–5. Tight and consistent.
- **Inter-section** (between bands): steps 10–16, scaled by viewport. This is where premium pages breathe.

Responsive section padding example with `clamp()` (keeps the ratio, compresses on phones):

```css
.section { padding-block: clamp(3.5rem, 9vw, 8rem); }   /* 56px → 128px */
.hero    { padding-block: clamp(5rem, 14vw, 12rem); }   /* 80px → 192px */
```

Rule: never hand-type a one-off margin. If a value isn't on the scale, the scale is wrong, not the exception.

## Step 3 — Modular type scale

Choose one ratio from the direction:

| Direction | Ratio | Name |
|---|---|---|
| Dense / utilitarian / dashboard | 1.20 | minor third |
| Balanced product/marketing | 1.25 | major third |
| Editorial / spacious | 1.333 | perfect fourth |
| Dramatic display landing | 1.414–1.5 | aug. fourth / fifth |

Worked scale at base 16px, ratio 1.333 (round to taste):

| Role | rem | px | Leading | Tracking |
|---|---|---|---|---|
| caption / eyebrow | 0.75 | 12 | 1.4 | +0.12em, uppercase |
| small | 0.875 | 14 | 1.5 | 0 |
| body | 1.0 | 16 | 1.6 | 0 |
| body-lg / deck | 1.25 | 20 | 1.55 | 0 |
| h3 | 1.6 | 26 | 1.25 | -0.005em |
| h2 | 2.1 | 34 | 1.15 | -0.01em |
| h1 | 2.8 | 45 | 1.05 | -0.015em |
| display | 3.7–6+ | 60–96+ | 0.95–1.0 | -0.02em |

Fluid display so it is genuinely large on desktop yet fits phones:

```css
.display { font-size: clamp(2.5rem, 7vw, 5.5rem); line-height: 1.0; letter-spacing: -0.02em; }
.h2      { font-size: clamp(1.75rem, 3.5vw, 2.25rem); line-height: 1.15; }
```

Type rules that carry the premium feel:

- **Big type gets tighter**: leading drops toward ~0.95 and tracking goes slightly negative as size grows. Small type gets *looser* tracking (eyebrows +0.12em).
- **Measure**: body `max-width: 60–75ch` (≈32–40ch on phones). Never let paragraphs run the full container on wide screens.
- **Two families max**: one display/heading with character, one neutral text face; or a single family across weights + optical sizes. Mono only for code.
- **One "largest" per view**: exactly one element wins the size contest. Everything else steps down clearly.
- **Signature headline move**: wrap one word in a muted or accent role to make a focal point, and repeat the device across headings.

## Step 4 — Grid and container

```css
:root { --container: 1200px; --gutter: clamp(1rem, 4vw, 2.5rem); }
.container { width: min(100% - 2*var(--gutter), var(--container)); margin-inline: auto; }
```

- **12-col** marketing grid / **8-col** app grid. Build splits off it: 7/5 and 8/4 read designed; 6/6 and 4/4/4 read default — use the even splits sparingly and on purpose.
- **Full-bleed bands**: the band background spans the viewport; the `.container` keeps content aligned to the grid.
- **Dominant alignment per section**: strong left-align for dense editorial content; centered only for hero/announcement moments. Don't mix within a section.

## Step 5 — Section architecture catalog

Every section shares the skeleton — *eyebrow → title → deck → content → CTA* — and varies only the **content block**. Alternate blocks so no two neighbors share a shape.

| Block | When to use | Notes |
|---|---|---|
| Hero | top of page | largest type, signature move, treated media/video + overlay, 1 primary + 1 secondary CTA |
| Asymmetric split (7/5) | feature with one visual | text one side, media/demo the other; mirror it next time |
| 3-up card grid | parallel offerings | identical card anatomy; vary via content, not shape; one may be "featured" |
| Oversized stat band | proof / credibility | huge numbers, small uppercase captions; 3–4 across, stack on phone |
| Interactive demo | explain a mechanism | clickable input → visible response; shows the product thinking |
| Media showcase (alternating) | portfolio / products | full-bleed media + overlaid title + category chip + honest source tag |
| Editorial list / steps | process, comparisons | numbered or labeled rows; strong left rhythm |
| Logo / trust strip | social proof | muted, evenly spaced, small; "cited in / member of" |
| Mega-footer | end | multi-column link lists, uppercase column heads, contact + one accent link |

Section eyebrow forms:

- **Left-aligned sections**: inline uppercase label, wide tracking, often with a leading dot and `·` separators (`EU AI ACT · ART. 4`).
- **Centered sections**: a pill badge (rounded-full, bordered/tonal, uppercase, tracked) above a large centered title.

Credibility layer is design, not garnish: press logos, honest metadata (created / updated / reviewed dates), large proof numbers, transparent "AI-generated / symbolic image" captions. Style them deliberately.

## Step 6 — Responsive rules

| Breakpoint | Target | Behavior |
|---|---|---|
| ≤480 (phone) | one column | splits stack, grids → 1-col with priority re-order, nav → menu, type via clamp, gutter ≥16px, touch ≥44px |
| 481–768 (tablet) | 1–2 col | 3-up → 2-up, hero type mid |
| 769–1280 (laptop) | full grid | the tuned baseline |
| 1281–1600 (desktop) | full grid | more section air |
| ≥1920 (very large) | capped | container/line-length capped so text isn't 200ch; hero type up; raise column count or max-width instead of stretching sparse cards |

Reflow, don't merely shrink: re-order by importance, keep display leading tight after scaling, and always check the **real rendered** page at each size for clipping/overlap before claiming it verified.

## Step 7 — Re-seeding for a new product

1. Rewrite the **direction** (intent, adjectives, density, signature move).
2. Keep the spacing scale and type scale **structure**; adjust base/ratio only if the new density demands it.
3. Keep the section catalog; pick the subset the content needs and alternate blocks.
4. Pull exact palette from `color-system`; record direction, scales, section inventory and component list in `docs/DESIGN.md`.
5. The skeleton, scales and checks are unchanged — that is the point.
