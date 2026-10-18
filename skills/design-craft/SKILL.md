---
name: design-craft
description: Design high quality web, desktop, and game interfaces with a clear visual direction, strong typography,
  deliberate layout, accessible states, and responsive behavior. Avoid generic AI-generated UI patterns.
metadata:
  creator: Cadence project
  created: '2026-09-30'
  creation-method: Editorial Markdown guide written in the Cadence repository; no external template or executable
    scripts.
  purpose: Maintain strong design quality in interfaces, game UI, and responsive views.
  scope: Installation-wide; included with relevant tasks in every connected project.
---

# Design with intention

Aim for an interface that feels considered, calm, precise, and immediately usable. Avoid vague goals such as “make it modern.”

## 1. Choose a direction before styling
- Read the request and existing files. Follow the project brand, colors, fonts, design system, and AGENTS.md requirements when present.
- For every frontend task create or update a canonical, transferable design specification, normally `docs/DESIGN.md`. If an established equivalent exists, maintain it rather than creating a competing file. Read `assets/design-template.md` directly as the completeness guide. Record actual tokens, typography, layouts, component states, interactions, adaptation, accessibility, assets and implementation paths; another team must be able to reproduce the style from this document. Update it with the final implementation and link QA evidence. Small edits update only affected decisions.
- If no direction exists, derive one from audience, product purpose, content and platform. Choose deliberately among editorial, expressive, dense, restrained or other appropriate directions.
- Give each page one primary action and a clear reading order. Remove elements that do not help people complete the task.

## 2. Let typography establish hierarchy
- Select fonts and weights for the chosen direction, language coverage, legibility and performance. Prefer available local/system fonts; respect actual network permissions and asset licences. Document intentional pairing and fallback rather than imposing a fixed family count.
- Use a consistent scale, for example 12 / 13.5 / 15 / 18 / 24 / 32 px. Body text is usually 14–16 px with 1.45–1.6 line height and 55–80 characters per line.
- Use tabular numerals for tables and metrics. Reserve uppercase text with slight letter spacing for small section labels.

## 3. Use grids and space instead of excess borders
- Define a coherent spacing scale suitable for the product (a 4 px scale is a useful starting point). Keep related elements close and separate unrelated groups with more space.
- Avoid nested cards, repeated tile walls, and borders around every element. Prefer spacing, a subtle divider, or a slight surface change.
- Align content to a small number of edges. Asymmetry can be deliberate; accidental misalignment cannot.
- Derive consistent radii and elevation from the chosen visual language; describe their purpose in the design specification. Do not copy fixed values into unrelated styles.

## 4. Give color a purpose
- Define a purposeful, documented palette suited to the brand, surface and themes. Reserve semantic colours for their stated meanings; a restrained neutral palette with one accent is a starting point, not a requirement.
- Aim for contrast of at least 4.5:1 for text and 3:1 for large text and icons. Check both dark and light themes when the product supports them.
- Use CSS variables such as `--bg`, `--surface`, `--text`, `--muted`, and `--accent`; avoid scattered hex values.
- Use gradients, glass effects, or neon only when they support the chosen direction.

## 5. Design every state
- For each interactive control, define default, hover, focus, pressed, disabled, and loading states. Show a visible 2 px focus ring.
- For each view, consider empty, loading, error, dense, and narrow states. Explain what happened and offer a useful next action when an error occurs.
- Anything that looks interactive must respond visibly. Confirm destructive actions or make them reversible.

## 6. Make the interface accessible
- Use semantic HTML, a sensible heading order, labelled fields, and accessible names for icon buttons. Make every action keyboard accessible with a clear tab order and Escape/Enter behavior.
- Use hit areas of at least 32 px on desktop and 44 px on touch screens. Never communicate status with color alone.
- Respect `prefers-reduced-motion`.

## 7. Design responsively from the start
- Use responsive-evidence for mobile, tablet/small, normal and large classes, actual inspected screenshots and a workspace report. Record unsupported native classes explicitly. Prevent unintended horizontal page overflow and allow long words to wrap.
- Prefer Grid and Flexbox with `minmax()` and use `clamp()` for fluid type and spacing. Keep touch controls easy to reach.

## 8. Avoid generic generated-interface patterns
- Avoid default violet-blue gradients, emoji used as icon substitutes, repeated feature tiles, centered walls of text, placeholder copy, and arbitrary shadows on every box.
- Use realistic content and a consistent SVG icon set with matching size and stroke weight.

## 9. Review the result as a user
Open the real result and use usability-review for task completion and recovery, responsive-evidence for viewport proof. Fix observed defects, keep the design specification aligned with the final code, and state any unverified checks. These skills share the same specification and own separate responsibilities; do not create duplicate quality guides.
