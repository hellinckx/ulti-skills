---
name: responsive-evidence
description: Verify frontend adaptation in four viewport classes and save real screenshots and a report in the workspace.
  Owns responsive layout evidence, not visual direction or usability review.
metadata:
  creator: Cadence project
  created: '2026-10-13'
  creation-method: Editorial guide based on the product's four-class responsive acceptance requirement.
  purpose: Deliver usable mobile, small, normal and large interfaces with inspectable evidence.
  scope: Installation-wide; frontend work and visual acceptance only.
---

# Four classes, real evidence

Read the canonical design specification and supported platforms. For web interfaces use mobile, tablet/small, normal and large. Starting viewports are 390×844, 820×1180, 1360×900 and 1920×1080 CSS pixels; adjust to the product and record exact actual dimensions. These are test classes, not mandatory CSS breakpoints. For native apps test legal window sizes and explicitly document unsupported mobile/tablet classes; do not label emulation as native support.

1. Start the real interface using its documented command. Inspect the current browser/window before choosing captures. Test changed routes and representative states with realistic long/dense content; include navigation, dialogs, menus and file/composer controls where changed.
2. Adapt composition and information hierarchy: controls remain reachable, text legible, touch/keyboard actions possible; no unintended horizontal page overflow, clipping or overlays. Intentionally scrollable tables/canvases need visible affordances. Check an intermediate width near changed breakpoints and browser zoom where relevant.
3. Capture and actually inspect screenshots in all four supported classes. Save them inside the task workspace under `docs/qa/responsive/<run-id>/`, with stable names such as `admin-mobile-main.png`. Avoid secrets; use fixture data for proof. Screenshots from another build or a mockup do not prove this interface.
4. Write `report.md` alongside the images: source/build, start command, environment, actual CSS viewport and scale, route/state, screenshot path, functional observations, defects, fixes, unsupported classes and remaining checks. Link it from the canonical design specification. Preserve previous runs and never overwrite unrelated user evidence.
5. Fix observed defects together, then recapture affected views and confirm the correction. Report blocked tools/platform limitations explicitly. Never claim four-class completion from CSS inspection or from screenshots you did not look at.

Usability task walkthroughs belong to usability-review; visual tokens and reusable rules belong to design-craft. Share their documents rather than copying instructions or introducing another design source.
