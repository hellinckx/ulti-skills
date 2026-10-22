---
name: interface-review
description: Prove that a running interface works for people — walk the real tasks (success, empty, error,
  cancel, recovery), complete them by keyboard, capture and actually look at screenshots in four viewport classes
  (mobile, tablet, normal, large), fix what blocks or breaks, and save evidence under docs/qa/. Use before
  accepting any frontend change, or when someone asks whether it works on phone, tablet or a large screen, or
  says an interface is confusing. Not for visual direction (design-craft), and never a substitute for research
  with real participants or for claims from CSS inspection alone.
metadata:
  creator: Cadence project
  created: '2026-10-13'
  updated: '2026-10-22'
  origin: Merges the former usability-review and responsive-evidence skills into one acceptance pass.
---

# Interface review: observed tasks, real viewports

A claim that an interface "works" or "is responsive" needs a run of the real build and screenshots you actually looked at. Read the product brief and `docs/DESIGN.md` first; keep terminology, controls and navigation consistent with them. This skill owns behaviour and evidence, not a second design system.

## 1. Define the tasks
- Audience, frequent tasks and costly mistakes. For each changed flow: entry, goal, steps, expected outcome, recovery.
- Prefer removing ambiguity and unnecessary decisions over adding features. Progressive disclosure may hide complexity, never required actions.

## 2. Walk them in the real app
- Start the interface with its documented command; screenshots of a mockup or another build prove nothing.
- Run the successful path and the relevant failure, empty, loading, dense and long/localised-content states; first use, cancelled work, interrupted connections and draft preservation where they apply.
- Feedback distinguishes pending, saved, failed and completed. Placeholders never pose as live data. Double submissions are prevented. Destructive actions name the consequence and offer undo or a fitting confirmation.
- Live/async views keep selection, scroll, focus and partially typed text across updates.

## 3. Keyboard and access
Complete every flow by keyboard only: logical focus order, visible focus, accessible names, Escape/Enter, focus trapping and restoration in dialogs, an alternative to drag. Check touch reach and target sizes when touch is supported. Automated accessibility checks supplement the walk; they do not replace it.

## 4. Four viewport classes
- Starting viewports (CSS px): **mobile 390×844 · tablet 820×1180 · normal 1360×900 · large 1920×1080**. These are test classes, not mandatory breakpoints; record the actual sizes and scale used.
- Check that controls stay reachable, text legible, nothing clips or overlaps, and there is no unintended horizontal page scroll. Intentionally scrollable tables or canvases show an affordance. Try an intermediate width near changed breakpoints and 200 % zoom where relevant.
- Native apps: test legal window sizes and state unsupported classes explicitly; emulation is not native support.
- Open and inspect every screenshot. A capture you did not look at is not evidence.

## 5. Fix, recapture, record
- Fix task-blocking, inaccessible, misleading and layout defects within scope; recapture the affected views and confirm the fix once.
- Save under `docs/qa/<run-id>/` (or the project's existing QA location): screenshots with stable names (`checkout-mobile-error.png`) and `report.md` with build/source, start command, environment, viewports, tasks and steps, observations, severity, reproduction, fixes and remaining gaps. Use fixture data; no secrets. Never overwrite earlier runs or the person's own evidence. Link the report from `docs/DESIGN.md`.

## Honesty rules
- A heuristic walkthrough is not user research: never invent a usability score or claim user testing without participants.
- Report blocked tools and unchecked classes explicitly instead of implying full coverage.

## Done when
- [ ] Every changed flow walked in the real build, including failure and recovery, and completed by keyboard.
- [ ] Screenshots captured and inspected in all supported classes; unsupported ones named.
- [ ] Defects fixed and recaptured; report saved and linked from the design spec.
