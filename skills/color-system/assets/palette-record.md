# Palette record — machine-readable output of the color method

Every color-system run emits one JSON record so another agent, a linter or a dashboard can read the palette back, audit the contrast claims, or re-seed it. `scripts/palette.mjs --json` prints exactly this shape. Store it next to the design specification (e.g. `docs/design/palette.json`) and link it from there.

## Schema

```json
{
  "$schema": "takt:color-system/palette@1",
  "direction": "string — mood + primary surface, e.g. 'calm precise work tool; dark primary, light optional'",
  "seed": { "neutral_hue": 250, "accent_hue": 255, "source": "brand | mood | existing-tokens" },
  "themes": {
    "dark": {
      "tokens": {
        "bg":   { "oklch": "oklch(0.17 0.012 250)", "hex": "#1b1d23", "clipped": false }
      }
    },
    "light": { "tokens": {} }
  },
  "pairs": [
    {
      "theme": "dark",
      "fg": "text", "bg": "surface",
      "role": "body-text",
      "wcag_ratio": 13.9,
      "target": 4.5,
      "pass": true,
      "adjusted": false
    }
  ],
  "data_series": { "dark": ["#…"], "light": ["#…"], "grayscale_separable": true, "cvd_note": "string" },
  "checks": {
    "wcag_floor": "2.2",
    "apca_reviewed": false,
    "older_audience_target": null,
    "small_screen_reviewed": false,
    "large_screen_reviewed": false,
    "no_color_alone": null,
    "focus_ring_distinct": null
  },
  "evidence": ["screenshots/dark-phone.png"],
  "generated_by": "scripts/palette.mjs 1.0 | manual",
  "created": "YYYY-MM-DD",
  "notes": "string"
}
```

Field rules:
- `tokens.*.oklch` is the source of truth; `hex` is the rendered fallback. `clipped: true` means the OKLCH color was out of the sRGB gamut and chroma was reduced to fit — the hue and lightness are preserved.
- `pairs` must contain at least: `text/bg`, `text/surface`, `text-muted/surface`, `text-subtle/surface`, `text-on-accent/accent`, `accent/bg` (role `ui`, target 3), `focus-ring/bg` (target 3), and `*-text/*-bg` for each semantic color — per theme.
- `target` is the WCAG floor for that role (4.5 text, 3 large/UI, 7 when `older_audience_target` is set). `pass` is computed, never typed.
- `adjusted: true` records that a token's `L` was nudged by the generator to reach its target; the nudged value is what is in `tokens`.
- `checks.*` that cannot be measured by a script stay `null` until a person or a visual-QA skill sets them, with `evidence`.

## Worked example (abridged)

```json
{
  "$schema": "takt:color-system/palette@1",
  "direction": "calm, precise work tool; dark primary, light optional",
  "seed": { "neutral_hue": 250, "accent_hue": 255, "source": "mood" },
  "themes": {
    "dark": { "tokens": {
      "bg":             { "oklch": "oklch(0.170 0.012 250)", "hex": "#0b1015", "clipped": false },
      "surface":        { "oklch": "oklch(0.210 0.014 250)", "hex": "#13191f", "clipped": false },
      "text":           { "oklch": "oklch(0.950 0.010 250)", "hex": "#eaeff5", "clipped": false },
      "accent":         { "oklch": "oklch(0.630 0.170 255)", "hex": "#3589ed", "clipped": false, "adjusted": true },
      "text-on-accent": { "oklch": "oklch(0.150 0.010 255)", "hex": "#090b0f", "clipped": false, "adjusted": true }
    } }
  },
  "pairs": [
    { "theme": "dark", "fg": "text", "bg": "surface", "role": "body-text", "wcag_ratio": 15.31, "target": 4.5, "pass": true, "adjusted": false },
    { "theme": "dark", "fg": "text-on-accent", "bg": "accent", "role": "body-text", "wcag_ratio": 5.57, "target": 4.5, "pass": true, "adjusted": true },
    { "theme": "dark", "fg": "accent", "bg": "surface", "role": "ui", "wcag_ratio": 5.02, "target": 3, "pass": true, "adjusted": true }
  ],
  "checks": { "wcag_floor": "2.2", "apca_reviewed": false, "older_audience_target": null, "small_screen_reviewed": false, "large_screen_reviewed": false, "no_color_alone": null, "focus_ring_distinct": null },
  "evidence": [],
  "generated_by": "scripts/palette.mjs 1.1",
  "created": "2026-10-16",
  "notes": "Produced by `node scripts/palette.mjs --hue 250 --accent 255 --json`. The generator chose near-black text on the dark-theme accent (white would be ~2.7:1) and lifted the accent by 0.01 L — hence adjusted: true."
}
```

## How an agent reads it back
1. Trust `pass` only if `wcag_ratio` recomputes from the two hex values (formula in `palette-recipe.md`); a record is void if any required pair is missing.
2. If `checks.older_audience_target` is set, every `body-text` pair must meet that target, not 4.5.
3. To re-theme: change `seed.*_hue`, regenerate with the script, diff `pairs` — only `L` nudges should change pass/fail, never the structure.
4. A `clipped: true` token is fine for UI; for brand-critical colors, lower `C` in the recipe instead of relying on the clip.
5. Null `checks` are open work for interface-review; do not report the palette as finished while `no_color_alone` or `focus_ring_distinct` is null.
