# Palette recipe — worked values

This is the long-form companion to `SKILL.md`. It shows the method with concrete OKLCH values. The values are **examples to re-seed**, not a fixed brand. Change the base hue `H` and regenerate.

## Why OKLCH

`oklch(L C H)` — `L` 0–1 perceptual lightness, `C` chroma (0 grey, ~0.37 max displayable), `H` 0–360 hue angle.

- Equal `L` steps look equally spaced to the eye (HSL does not do this; HSL yellow at 50% looks far lighter than HSL blue at 50%).
- Two hues at the same `L` carry the same visual weight — essential for categorical data colors.
- You change lightness without the hue drifting.

Supported in modern CSS directly: `color: oklch(0.7 0.15 250);`. Provide a hex fallback for old engines if the project needs it.

## Step 1 — Direction

Write one line: mood + surface. Example: *"Calm, precise work tool. Dark primary surface, optional light."* Everything below serves that line.

## Step 2 — Base hue H

Pick ONE seed hue.

| Mood | Typical H range |
|---|---|
| Calm / trustworthy | 230–260 (blue) |
| Fresh / growth | 150–165 (green) |
| Warm / human | 25–55 (orange/amber) |
| Editorial / neutral-warm | 40–70 at very low C |
| Energetic / bold | 350–15 (red/magenta) or a vivid single hue |

If a brand color exists, read its `H` and use that. One seed only.

## Step 3 — Neutral ramp (tinted, not pure grey)

Low chroma `C` ≈ 0.012–0.03 at the seed `H`. Example with `H = 250` (blue-seeded neutrals):

Dark theme (surfaces dark → text light):

| Token | L | C | H | Role |
|---|---|---|---|---|
| bg | 0.17 | 0.012 | 250 | app background |
| surface | 0.21 | 0.014 | 250 | panels/cards |
| surface-2 | 0.25 | 0.016 | 250 | raised / hover surface |
| border | 0.32 | 0.018 | 250 | quiet separation |
| border-strong | 0.42 | 0.02 | 250 | emphasis separation |
| text-subtle | 0.62 | 0.02 | 250 | least important text |
| text-muted | 0.78 | 0.02 | 250 | secondary text |
| text | 0.95 | 0.01 | 250 | body text |

Light theme (surfaces light → text dark):

| Token | L | C | H | Role |
|---|---|---|---|---|
| bg | 0.99 | 0.004 | 250 | app background |
| surface | 0.975 | 0.006 | 250 | panels/cards |
| surface-2 | 0.95 | 0.008 | 250 | raised / hover |
| border | 0.90 | 0.01 | 250 | quiet separation |
| border-strong | 0.82 | 0.014 | 250 | emphasis |
| text-subtle | 0.50 | 0.02 | 250 | least important |
| text-muted | 0.40 | 0.02 | 250 | secondary |
| text | 0.22 | 0.016 | 250 | body text |

Note: ends are near-black / near-white, not `#000`/`#FFF`. Neutrals carry a trace of the seed hue so the UI feels unified.

## Step 4 — Accent + states

One accent. Give it chroma the neutrals don't have. Example accent at `H = 255` (can differ from the neutral seed for contrast):

| Token | L | C | H | Note |
|---|---|---|---|---|
| accent | 0.62 | 0.17 | 255 | primary action / selection |
| accent-hover | 0.67 | 0.17 | 255 | +0.05 L |
| accent-pressed | 0.57 | 0.17 | 255 | −0.05 L |
| accent-muted | 0.40 | 0.06 | 255 | badge/background tint (dark theme) |
| text-on-accent | 0.15 | 0.01 | 255 | label on accent fill — **near-black**; verified 5.6:1 on the L 0.62–0.63 accent |

**Polarity rule (verified with `scripts/palette.mjs`):** on a mid-lightness accent (`L` ≈ 0.58–0.68) near-white text does **not** reach 4.5:1 (≈ 2.7:1 at L 0.62) — use near-black text, or darken the accent to `L` ≤ ~0.50 and accept a weaker accent-on-surface contrast. In a light theme the accent sits at `L` ≈ 0.55, where near-white text passes (4.6:1) and the accent still clears 3:1 against the page. Whichever polarity you choose, measure all three (`accent`, `accent-hover`, `accent-pressed`) against the same `text-on-accent`; the generator does this and picks the polarity that needs the least movement.

## Step 5 — Semantic colors

Fixed meaning only. Tune `L`/`C` to sit with the neutrals and pass contrast. Dark-theme example:

| Token | L | C | H | Meaning |
|---|---|---|---|---|
| success | 0.72 | 0.15 | 150 | confirmed / healthy |
| warning | 0.80 | 0.14 | 85 | caution / needs attention |
| danger | 0.64 | 0.19 | 25 | error / destructive |
| info | 0.70 | 0.12 | 240 | neutral information |

Give each a `-bg` (low-L, low-C version for banners) and a `-text` (high-contrast version for text on that banner). The accent must not double as `danger`.

## Step 6 — Elevation

- Dark theme: raise by **lightness** (bg 0.17 → surface 0.21 → surface-2 0.25), shadow optional and soft.
- Light theme: keep surface near-white, raise with a soft shadow plus a tiny `L` drop on the base behind it.
- 2–4 levels maximum. More levels flatten the hierarchy.

## Step 7 — Data colors

Categorical: hold `L` and `C`, step `H` evenly. Example 6-series at `L ≈ 0.70`, `C ≈ 0.14`:

`H = 255, 200, 150, 90, 40, 350` (blue, cyan, green, yellow-green, orange, pink).

- Matched `L`/`C` means no series shouts louder than another.
- Check in grayscale: if two collapse to the same grey, nudge one series' `L`.
- Check for deuteranopia/protanopia: green↔red pairs are the usual failure; separate them in `L` or swap one hue.

Sequential (one metric, low→high): hold `H`, ramp `L` from ~0.95 to ~0.35. Diverging (two directions from a midpoint): two hues, each ramping `L` toward a neutral middle.

## Contrast math (how to check)

WCAG ratio uses relative luminance `Lr`:

```
channel c in {R,G,B} as sRGB 0..1:
  lin = c <= 0.03928 ? c/12.92 : ((c+0.055)/1.055)^2.4
Lr = 0.2126*linR + 0.7152*linG + 0.0722*linB
ratio = (Lmax + 0.05) / (Lmin + 0.05)   // lighter over darker
```

Targets: body text ≥ 4.5:1, large text/icons ≥ 3:1, focus ring ≥ 3:1 vs adjacent. For older audiences aim body ≥ 7:1.

APCA (preferred for judgement, WCAG still the floor): returns a signed `Lc` 0–106. Rough guide: body text wants `|Lc|` ≥ 75, large text ≥ 60, non-text UI ≥ 45. Use an APCA calculator; the formula is long and must not be hand-approximated.

Always compute per **theme**. A pair that passes on dark can fail on light.

## Re-seeding for a real brand

1. Read the brand's primary hue → set as neutral/accent `H`.
2. Keep every `L`/`C` in the tables; only `H` changes (and accent `C` if the brand is more/less vivid).
3. Regenerate tokens, re-run the contrast checks, adjust `L` of any pair that now fails.
4. The structure, roles and checks are unchanged — that is the point.
