![Ulti Skills](.github/banner.svg)

# Ulti Skills

**12 agent skills for planning, design, engineering, 3D visualisation and quality — each one kept only because it adds knowledge or a helper an agent would not have on its own.**

An English-language collection, most of it from the Cadence project, released under the [MIT license](LICENSE). Each skill is a self-contained folder with a `SKILL.md`, a short README and any references or dependency-free helpers it needs.

## Visual examples

Real browser renders of the included example sources. The interfaces use fictional data; they illustrate the methods and are not guaranteed agent output. Click any image for the full-size PNG.

| Interface design | Editorial web design |
|---|---|
| [![Project workspace with deliberate typography and spacing](.github/examples/interface.png)](.github/examples/interface.png) | [![Editorial landing page with asymmetric composition](.github/examples/web-design.png)](.github/examples/web-design.png) |
| [Design Craft](skills/design-craft/README.md) · [Complete App](skills/complete-app/README.md) | [Design Craft](skills/design-craft/README.md) |

| Generated color system | Four real viewport classes |
|---|---|
| [![Generated OKLCH light and dark palettes with contrast results](.github/examples/color-system.png)](.github/examples/color-system.png) | [![Responsive interface captures at four real viewport sizes](.github/examples/responsive.png)](.github/examples/responsive.png) |
| [Color System](skills/color-system/README.md) · 42/42 declared contrast pairs pass | [Interface Review](skills/interface-review/README.md) · full-size captures included |

| Validation and recovery | Motion specification |
|---|---|
| [![Real form error with preserved field focus](.github/examples/form-recovery.png)](.github/examples/form-recovery.png) | [![Static motion state sheet with timings and easing](.github/examples/motion-states.png)](.github/examples/motion-states.png) |
| [Interface Review](skills/interface-review/README.md) · exercised in Chromium | [Motion & Graphics](skills/motion-and-graphics/README.md) · static illustrated states |

[Example source and reproduction steps](examples/README.md) · [Capture metadata](.github/examples/capture-info.json)

## Install and use

```sh
git clone https://github.com/hellinckx/ulti-skills.git
```

Copy a folder from `skills/`, complete, into your agent's skills directory — for Claude Code `.claude/skills/<name>` (project) or `~/.claude/skills/<name>` (user), for Codex `.agents/skills/<name>`. Inspect an existing destination first; do not overwrite another skill. Then ask, for example:

```text
Use $goal-to-plan to turn a local workshop inventory app idea into requirements,
dependencies and measurable acceptance criteria.
```

Other agents can read a `SKILL.md` directly. Related skills are referenced by name and loaded separately when needed.

## Skill catalog

| Skill | Purpose |
|---|---|
| **Plan and build** | |
| [goal-to-plan](skills/goal-to-plan/README.md) | Turn a short or vague goal into an honest, ordered plan with visible assumptions and measurable acceptance. |
| [complete-app](skills/complete-app/README.md) | Deliver applications without prototype gaps: every state, settings where needed, persistence, help, recovery. |
| [ai-app-engineering](skills/ai-app-engineering/README.md) | Build AI features and agents with explicit providers, catalog-driven model selection, narrow tools and tests. |
| **Design** | |
| [design-craft](skills/design-craft/README.md) | Give interfaces a deliberate direction, scales, grid and component states, recorded once in `docs/DESIGN.md`. |
| [color-system](skills/color-system/README.md) | Create OKLCH palettes, semantic tokens and measured contrast across themes. |
| [motion-and-graphics](skills/motion-and-graphics/README.md) | Choose purposeful motion and build accessible, efficient 2D and 3D visuals. |
| [iso-world-site](skills/iso-world-site/README.md) | Build websites as a live isometric diorama the camera travels through on scroll — plain HTML, CSS and canvas. |
| [3d-system-mirror](skills/3d-system-mirror/README.md) | Mirror a running system as an explorable 3D world where every visible word comes from real data. |
| **Verify** | |
| [interface-review](skills/interface-review/README.md) | Prove a running interface works: task walkthroughs, keyboard use and inspected screenshots in four viewport classes. |
| [ab-testing](skills/ab-testing/README.md) | Pre-register experiments and turn variant comparisons into auditable decisions. |
| [load-stress-testing](skills/load-stress-testing/README.md) | Measure behaviour under realistic data volume and concurrency in a controlled staging environment. |
| [security-testing](skills/security-testing/README.md) | Find, reproduce and fix security weaknesses in your own systems with non-destructive checks. |

## Requirements

- An agent that supports skills or can read Markdown instructions and local files.
- Node.js 18 or newer for the optional `.mjs` helpers (color-system, design-craft, ab-testing, load-stress-testing, security-testing). No npm dependencies.
- Browser or application automation for the workflows that verify real interfaces.

Helper example, run from `skills/design-craft/`:

```sh
node scripts/type-scale.mjs --base 16 --ratio 1.25 --ratio-sm 1.2 --css
```

## Scope and safety

Installing a skill does not authorize external actions or widen workspace permissions. Messages, publications, spending, submissions and destructive actions still need the authorization the task and runtime require. Never commit credentials, private evidence or customer data. See [security notes](SECURITY.md) for the review scope and its limits.

## Changes on 2026-10-22

The collection was reduced from 16 to 12 skills:

- `web-design-craft` was merged into **design-craft** (one method, one design record; the type-scale helper moved with it).
- `usability-review` and `responsive-evidence` were merged into **interface-review** (one acceptance pass with one report).
- `venture-blueprint` was removed; its honest idea check and research rules now live in **goal-to-plan**. The 15-file handoff kit added process overhead without improving the result.
- `project-structure` was removed: its rules restate common conventions an agent already follows, and its "move files when you touch them" rule invited scope creep.

All remaining skills got shorter, trigger-precise descriptions, current cross-references and compact READMEs.

## Layout

```text
skills/<skill-name>/
  SKILL.md        instructions the agent loads
  README.md       what it produces and an example request
  LICENSE
  assets/ references/ scripts/   when provided
examples/         illustrative HTML sources and optional renderer
.github/examples/ real PNG captures and metadata
```

## License

[MIT](LICENSE) — Copyright (c) 2026 hellinckx.
