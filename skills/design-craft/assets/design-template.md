# Product design specification

Maintain this document at `docs/DESIGN.md`, or update the established equivalent and record its canonical path. Replace prompts with actual decisions; never ship this blank template as evidence. Keep existing design sources authoritative and link implementation paths.

## Intent and context
Product, audiences, core tasks, surface mode (operate/read/persuade/experience), supported platforms, constraints, existing brand sources, scope and explicit exclusions. State the chosen direction and why it suits this product.

## Visual system
Actual token names, values and source paths for every supported theme: backgrounds, layers, text, action and semantic colours, contrast results, typography families/fallbacks/licences, sizes/weights/line heights, spacing, density, grids, widths, radii, borders, elevation, icons and imagery. Include motion durations/curves and reduced-motion behaviour. Document units and framework mappings so another project can reproduce the style.

## Components and interaction
Anatomy, variants and actual source paths for navigation, buttons, fields, tables, menus, dialogs, notifications and domain-specific controls. Define hover/focus/pressed/disabled/loading/empty/error/success, validation, keyboard rules, touch targets, cancellation, recovery, persistence and focus restoration. Record reusable patterns and exceptions.

## Layout and adaptation
Per surface: reading order, primary task, information hierarchy and composition. Four classes: mobile, tablet/small, normal, large. Record exact tested viewports, breakpoint rationale, navigation transformations, tables/canvases/menus/dialogs, minimum native window constraints, zoom and long-content behaviour. Values are selected for this product, not imposed by this template.

## Content and accessibility
Tone, terminology, localisation and formatting, representative real content, accessible names, semantic structure, keyboard/screen-reader behaviour and measured contrast. Separate verified results from planned checks.

## Transfer and verification
Installation/start instructions, token/component/asset dependencies, licences, what to copy or adapt, and a minimal recipe for reproducing the style without needing the original app. Link the interface-review report (`docs/qa/<run-id>/report.md`); identify tested routes/states, screenshot files, actual environment/build, known defects and unsupported classes.
