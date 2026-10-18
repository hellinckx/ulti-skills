---
name: complete-app
description: Finish every project with a user interface as a complete, well-structured product — full navigation,
  every state designed, comprehensive central settings, help, persistence, error handling and a documented start
  — instead of a prototype with gaps.
metadata:
  creator: Cadence project
  created: '2026-10-10'
  creation-method: Editorial Markdown guide written in the Cadence repository from the release and final-acceptance
    rules of Cadence; no external template or executable scripts.
  purpose: Make the end result of UI work usable and complete on first start, with the settings and supporting screens
    a professional application is expected to have.
  scope: Installation-wide; included with interface, release and acceptance tasks in every connected project.
---

# Complete application, not a prototype

An application is finished when a person can install it, start it with one documented command, find every feature, adjust it to their needs in one central place, recover from mistakes and understand what happened — without reading the code. Plan this from the first sprint; do not leave it to the last step.

## 1. Structure of the interface
- One clear shell: navigation (sidebar or top bar) with every main area reachable in one click, a page title and one-sentence purpose per page, one primary action per page.
- Group navigation by task, not by technical module. Typical areas: overview/dashboard, the core work areas, history or activity, settings, help/about.
- Every element that looks clickable is clickable and gives visible feedback. No dead links, placeholder pages, "coming soon" stubs or TODO texts in the shipped UI.
- Deep links or remembered state: the app reopens where the person left it (last view, selection, filters, panel sizes) when that is helpful.

## 2. Every state is designed
For each list, page and dialog: main, empty (explains the next step and offers one action), loading (inline spinner, no layout jump), error (what failed, what to check, a retry), success feedback, disabled with reason, offline or unavailable backend when relevant. Long-running work shows progress and can be cancelled. Destructive actions confirm and name the consequence; prefer undo or a recovery point where possible.

## 3. Central settings (required for every app with a UI)
Provide one settings page (or dialog for small tools) as the single place for configuration, grouped into clear sections with a search or section navigation when there are more than about 12 options. Include whatever applies:
- **General:** language (one-click switch), start behaviour, default view, date/number formats, units.
- **Appearance:** theme (dark, light, system), density or font size, accent where sensible, reduced motion.
- **Behaviour:** defaults for the core workflow, confirmations, autosave interval, notifications (which, how), sounds.
- **Data:** storage location, export and import (JSON/CSV), backup and restore, reset to defaults (with confirmation), clear caches, privacy options.
- **Accounts and integrations:** connected services and their status, sign-in/out, API endpoints or keys via the operating system's secure store or the official sign-in flow — never in plain-text config, logs or the UI after entry.
- **Advanced:** logging level, diagnostics export (without secrets), feature toggles, about (version, build, licences).
Rules: settings save automatically with a visible saved state (or one explicit save in dialogs); every value is validated with an inline message; defaults are sensible so the app works without visiting settings; each option shows a one-line hint and its consequence; global defaults may be overridden per item and the override stays visible; settings persist across restarts with a schema version and a migration path.

## 4. Supporting screens and features
- **Help:** short getting-started steps, explanation of each area, keyboard shortcuts, troubleshooting and where data is stored. An about section with version.
- **First start:** a short onboarding or a well-designed empty state that leads to the first useful action; no forced tour.
- **History or activity log** for apps that change data: who did what and when, with filters.
- **Notifications:** one consistent place and style for messages; important errors stay until resolved.
- **Search and filter** wherever a list can grow beyond one screen.
- **Keyboard:** focus ring, tab order, Escape closes, Enter confirms, shortcuts for frequent actions; right-click menus where items can be acted on.
- **Responsive:** follow responsive-evidence for four supported viewport classes, inspected screenshots and documented native constraints. Link its workspace report rather than maintaining a second size matrix.
- **Accessibility:** labels on all controls, 4.5:1 contrast, screen-reader names for icon buttons, `aria-live` for async results.

## 5. Robustness behind the UI
- Input validation on client and server; clear messages instead of stack traces.
- Persistence that survives restarts and crashes (atomic writes, schema version, migration); no data loss on reload.
- Errors are logged locally with enough context to diagnose, without secrets or personal data.
- Network and backend failures are handled with retry or a clear offline state; timeouts on every external call.
- Tests for the core flows and the settings persistence; build and tests pass.

## 6. Delivery checklist (release and final acceptance)
- Starts from a clean checkout with the documented command (`npm start`, start script or equivalent); README explains purpose, requirements, installation, start, usage, configuration and known limits.
- Walk through every requested feature end to end in the real running app, then through settings (change, restart, verify persistence), help, empty and error states.
- Look at the real window or browser at the sizes above, in every offered theme, and fix what you see. Report what you checked and what you could not check.
- Nothing in the UI is fake: no sample data presented as real, no simulated activity, no buttons without function.
