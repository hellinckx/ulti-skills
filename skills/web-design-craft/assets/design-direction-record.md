# Design-direction record — machine-readable output of the web-craft method

One JSON record per web surface so another agent can continue the design, audit it against the method, or regenerate the scales. `scripts/type-scale.mjs --json` prints the `type_scale` and `spacing_scale` blocks exactly as used here. Store next to the design specification (e.g. `docs/design/direction.json`) and link it from the spec that design-craft owns.

## Schema

```json
{
  "$schema": "takt:web-design-craft/direction@1",
  "surface": { "name": "string", "archetype": "landing | marketing | product-ui | dashboard | portal | docs", "job": "convince | convert | operate | inform" },
  "direction": {
    "adjectives": ["confident", "editorial", "calm"],
    "density": "spacious-editorial | balanced | dense-utilitarian",
    "voice": "loud-display | measured | quiet-restraint",
    "signature_move": "string — the one repeated gesture, e.g. 'one word per headline shifts to accent weight'"
  },
  "layout": {
    "container_max_px": 1240,
    "gutter_px": { "phone": 20, "desktop": 40 },
    "grid_columns": 12,
    "asymmetry_used": ["7/5", "8/4"],
    "full_bleed_bands": true
  },
  "spacing_scale": { "unit_px": 4, "steps": [4, 8, 12, 16, 24, 32, 48, 64, 96, 128], "section_padding_px": { "phone": 64, "desktop": 128 } },
  "type_scale": {
    "ratio_sm": 1.2, "ratio_lg": 1.25, "base_px": 16, "min_vw": 360, "max_vw": 1280,
    "families": { "display": "string", "text": "string", "mono": "string | null" },
    "roles": [
      { "role": "display", "step": 5, "clamp": "clamp(…)", "leading": 1.0, "tracking_em": -0.02 },
      { "role": "h1", "step": 4, "clamp": "clamp(…)", "leading": 1.05, "tracking_em": -0.015 },
      { "role": "body", "step": 0, "clamp": "clamp(…)", "leading": 1.6, "tracking_em": 0 },
      { "role": "eyebrow", "step": -1, "clamp": "clamp(…)", "leading": 1.2, "tracking_em": 0.12, "uppercase": true }
    ],
    "measure_ch": { "phone": 36, "desktop": 70 }
  },
  "sections": [
    { "id": "hero", "shape": "asymmetric-split", "focal": "display headline", "cta": "primary+secondary" },
    { "id": "proof", "shape": "stat-band", "focal": "3 large numbers", "cta": null }
  ],
  "section_shape_alternation_ok": true,
  "components": {
    "state_matrix_complete": ["button-primary", "button-secondary", "link", "card", "input"],
    "radius_px": { "control": 8, "card": 16, "pill": 999 },
    "elevation_steps": 3
  },
  "motion": {
    "bands_ms": { "micro": [80, 160], "transition": [200, 400], "hero": [400, 800] },
    "ease_default": "cubic-bezier(0.22, 1, 0.36, 1)",
    "reveal": { "distance_px": 16, "stagger_ms": 60, "once": true },
    "reduced_motion_path": true
  },
  "responsive": { "checked_px": [390, 768, 1366, 1920], "no_clipping": null, "very_large_measure_capped": null },
  "accessibility": { "contrast_record": "docs/design/palette.json", "keyboard_complete": null, "landmarks_headings_ok": null, "no_color_or_motion_alone": null, "zoom_200_ok": null },
  "evidence": ["screenshots/hero-390.png"],
  "generated_by": "scripts/type-scale.mjs 1.0 | manual",
  "created": "YYYY-MM-DD",
  "notes": "string"
}
```

Rules:
- `direction` is written **before** any layout value; a record whose `direction.signature_move` is empty is not a direction, it is a template.
- `type_scale.roles[].clamp` must be the actual CSS emitted; `step` is the exponent in `base · ratio^step`.
- `section_shape_alternation_ok` is computed: no two adjacent `sections[].shape` equal.
- `components.state_matrix_complete` lists only components for which default/hover/active/focus-visible/disabled(/loading) all exist in code.
- Every `null` under `responsive` and `accessibility` is open work; the surface is not done while any required check is null.

## Filled example (abridged)

```json
{
  "$schema": "takt:web-design-craft/direction@1",
  "surface": { "name": "Provi-style agency site", "archetype": "marketing", "job": "convince" },
  "direction": { "adjectives": ["confident", "editorial", "precise", "warm"], "density": "spacious-editorial", "voice": "loud-display", "signature_move": "one word per headline switches to the accent colour; every standalone link ends in a trailing arrow that nudges on hover" },
  "layout": { "container_max_px": 1240, "gutter_px": { "phone": 20, "desktop": 40 }, "grid_columns": 12, "asymmetry_used": ["7/5", "8/4"], "full_bleed_bands": true },
  "spacing_scale": { "unit_px": 4, "steps": [4, 8, 12, 16, 24, 32, 48, 64, 96, 128], "section_padding_px": { "phone": 64, "desktop": 128 } },
  "type_scale": {
    "ratio_sm": 1.2, "ratio_lg": 1.25, "base_px": 16, "min_vw": 360, "max_vw": 1280,
    "families": { "display": "Fraunces", "text": "Inter", "mono": null },
    "roles": [
      { "role": "display", "step": 5, "clamp": "clamp(39.81px, 2.2678rem + 0.9799vw, 48.83px)", "leading": 1.0, "tracking_em": -0.02 },
      { "role": "body", "step": 0, "clamp": "clamp(16px, 1rem, 16px)", "leading": 1.6, "tracking_em": 0 },
      { "role": "eyebrow", "step": -1, "clamp": "clamp(12.8px, 0.8464rem - 0.058vw, 13.33px)", "leading": 1.2, "tracking_em": 0.12, "uppercase": true }
    ],
    "measure_ch": { "phone": 36, "desktop": 70 }
  },
  "sections": [
    { "id": "hero", "shape": "asymmetric-split", "focal": "display headline", "cta": "primary+secondary" },
    { "id": "services", "shape": "3-up-grid", "focal": "titles", "cta": null },
    { "id": "proof", "shape": "stat-band", "focal": "numbers", "cta": null },
    { "id": "work", "shape": "media-right", "focal": "case image", "cta": "tertiary-arrow" }
  ],
  "section_shape_alternation_ok": true,
  "components": { "state_matrix_complete": ["button-primary", "button-secondary", "link", "card"], "radius_px": { "control": 8, "card": 16, "pill": 999 }, "elevation_steps": 3 },
  "motion": { "bands_ms": { "micro": [80, 160], "transition": [200, 400], "hero": [400, 800] }, "ease_default": "cubic-bezier(0.22, 1, 0.36, 1)", "reveal": { "distance_px": 16, "stagger_ms": 60, "once": true }, "reduced_motion_path": true },
  "responsive": { "checked_px": [390, 768, 1366, 1920], "no_clipping": true, "very_large_measure_capped": true },
  "accessibility": { "contrast_record": "docs/design/palette.json", "keyboard_complete": true, "landmarks_headings_ok": true, "no_color_or_motion_alone": true, "zoom_200_ok": null },
  "evidence": ["screenshots/hero-390.png", "screenshots/hero-1920.png"],
  "generated_by": "scripts/type-scale.mjs 1.0",
  "created": "2026-10-16",
  "notes": "clamp values from `node scripts/type-scale.mjs --base 16 --ratio 1.25 --ratio-sm 1.2 --json`."
}
```

## How an agent reads it back
1. Regenerate the scales with the recorded `type_scale` parameters; the emitted `clamp()` strings must match — if not, the code drifted from the record.
2. Check `section_shape_alternation_ok` and recompute it from `sections[]`.
3. Treat any `null` check as open; do not report the surface finished.
4. To restyle for a new brand: keep `layout`, `spacing_scale`, `type_scale.ratio_*`, `sections[]` and `motion`; change `direction.adjectives`, `signature_move`, families and the color record. The structure is the craft; the values are the brand.
