---
name: usability-review
description: Walk real tasks through a running interface and fix what blocks people — task completion,
  discoverability, clear feedback, keyboard-only use, focus handling, live-update stability and recovery from
  errors — with findings saved under docs/qa/usability/. Use when planning, building or accepting any frontend flow,
  or when someone says an interface is confusing. Do not use for visual styling (design-craft), viewport proof
  (responsive-evidence) or as a substitute for research with real participants.
metadata:
  creator: Cadence project
  created: '2026-10-13'
  creation-method: Editorial guide based on the product's frontend quality requirements.
  purpose: Make interfaces intuitive through observed task flows and actionable findings.
  scope: Frontend planning, implementation and acceptance.
---

# Usability through observed tasks

Own behaviour and task success, not a second design system. Read the product brief and canonical design specification; keep terminology, controls and navigation consistent with them. Analyse existing flows before changing them.

- Identify the audience, frequent tasks and costly mistakes. For each changed flow define entry, goal, steps, expected outcome and recovery; prioritise reducing ambiguity and unnecessary decisions rather than adding features.
- Use clear action labels, visible feedback and discoverable next steps. Progressive disclosure may hide complexity but must not hide required actions. Distinguish pending, saved, failed and completed; never present placeholders as live data.
- Exercise a representative successful flow and relevant failure/empty/loading/dense states in the real app. Include first use, long/localised content, cancelled work, interrupted connections and preservation of drafts where they apply.
- Complete the flow with keyboard only. Check logical focus order, visible focus, accessible names, Escape/Enter, focus trapping/restoration and an alternative to drag. Check touch reach and target sizes when supported. Automated accessibility checks supplement observed behaviour.
- For async/live interfaces verify that updates preserve selection, scroll, focus and partially entered text. Prevent accidental double submissions. Destructive actions explain consequences and offer undo or an appropriate confirmation.
- Write `docs/qa/usability/<run-id>.md` (or the existing QA location): task and build, actual steps/results, severity, affected route/control, reproduction, correction and remaining gaps. Link to the design specification and responsive evidence instead of duplicating their rules.

Fix task-blocking, inaccessible or misleading behaviour within scope before acceptance. Verify the corrected flow once. A heuristic walkthrough is not user research; report it honestly and never invent a usability score or claim user testing without participants.
