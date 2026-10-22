---
name: complete-app
description: Finish an application with a user interface as a complete product instead of a prototype with gaps —
  reachable features, every state designed, settings where they are needed, persistence, help, error recovery, a
  documented one-command start and an end-to-end acceptance walk. Use when building, finishing, releasing or
  accepting an app, tool or dashboard people will use, or when asked to "make it complete" or "production ready".
  Not for a single component, a library or API without UI, or visual direction alone (design-craft).
metadata:
  creator: Cadence project
  created: '2026-10-10'
  updated: '2026-10-22'
---

# Complete application, not a prototype

An app is finished when a person can install it, start it with one documented command, find every feature, adapt it where it matters, recover from mistakes and understand what happened — without reading the code. Plan this from the first step; do not leave it to the end. Completeness means **no gaps**, not every feature below: include what this product needs and skip the rest.

## 1. Structure
- One clear shell: every main area reachable in one click, a page title and one primary action per page. Group navigation by task, not by technical module.
- Everything that looks clickable works and gives feedback. No dead links, "coming soon" stubs, TODO text or buttons without function in the shipped UI.
- Reopen where the person left off (view, selection, filters) when that helps.

## 2. Every state is designed
For each list, page and dialog: main, empty (explains the next step, offers one action), loading (no layout jump), error (what failed, what to check, retry), success feedback, disabled with reason, offline/backend unavailable where relevant. Long work shows progress and can be cancelled. Destructive actions name the consequence; prefer undo.

## 3. Settings, when the app has options
- One central place for configuration, grouped into sections; search or section navigation beyond ~12 options. Defaults are good enough that nobody has to visit it.
- Typical groups, only as needed: language, theme (light/dark/system) and reduced motion; workflow defaults and notifications; data location, export/import, backup, reset; connected accounts and their status; diagnostics and an about section with version.
- Values validate inline, save visibly, persist across restarts with a schema version and migration path. Keys and tokens go to the OS secure store or the official sign-in flow — never plain-text config, logs, or the UI after entry.

## 4. Supporting features
- **Help:** getting started, what each area does, shortcuts, troubleshooting, where data is stored.
- **First start:** a useful empty state or short onboarding leading to the first real action; no forced tour.
- **Search and filter** wherever a list can outgrow one screen; **history** where data changes and it matters who did what.
- **Keyboard and access:** focus ring, tab order, Escape/Enter, shortcuts for frequent actions, labels and accessible names, 4.5:1 contrast, `aria-live` for async results.

## 5. Robustness behind the UI
- Validation on client and server; readable messages, never stack traces.
- Persistence survives reloads and crashes (atomic writes, schema version, migration).
- Timeouts on every external call; retry or a clear offline state.
- Local logs with enough context to diagnose, without secrets or personal data.
- Tests for the core flows and settings persistence; build and tests pass.

## 6. Release acceptance
- Starts from a clean checkout with the documented command; the README covers purpose, requirements, install, start, configuration and known limits.
- Walk every requested feature end to end in the real running app, then settings (change, restart, verify), help, empty and error states — with interface-review for the four viewport classes and each theme.
- Nothing is fake: no sample data presented as real, no simulated activity.
- Report what was checked and what could not be checked.
