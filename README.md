![Ulti Skills](.github/banner.svg)

# Ulti Skills

**22 focused agent skills for planning, design, engineering, testing and operations.**

An English-language collection from the Cadence project, released under the [MIT license](LICENSE). Each skill has its own `SKILL.md`, usage guide and any supporting references or dependency-free helpers. This repository contains the skill library, not the Cadence application.

## Install and use

```sh
git clone https://github.com/hellinckx/ulti-skills.git
```

Choose a folder under `skills/` and copy it, complete, into your project's `.agents/skills/` directory. For example, copy `skills/goal-to-plan` to `.agents/skills/goal-to-plan`. Inspect any existing destination first; do not overwrite another skill. For user-wide installation, use your agent's configured skills directory instead.

Then ask your agent:

```text
Use $goal-to-plan to turn a local workshop inventory app idea into requirements,
dependencies and measurable acceptance criteria.
```

Other agents can read a selected `SKILL.md` directly or use their own multi-skill repository installer. Read the individual README for its intended use, prerequisites and example. Related skills are included here but are loaded separately as needed.

## Skill catalog

| Skill | Purpose |
|---|---|
| [ab-testing](skills/ab-testing/README.md) | Design experiments before collecting data and turn variant comparisons into auditable decisions. |
| [ai-app-engineering](skills/ai-app-engineering/README.md) | Build applications with explicit provider connections, model selection, agent tools and operational boundaries. |
| [bookkeeping](skills/bookkeeping/README.md) | Organize invoice intake, document filing and ledger preparation for a small Austrian business. |
| [color-system](skills/color-system/README.md) | Create deliberate OKLCH palettes, semantic tokens and measured contrast across themes. |
| [company-management](skills/company-management/README.md) | Translate a business goal into standing processes, accountable roles and concise operational reporting. |
| [complete-app](skills/complete-app/README.md) | Deliver applications with the settings, persistence, help and recovery behavior people expect. |
| [customer-communication](skills/customer-communication/README.md) | Prepare accurate customer email drafts, contact records and follow-ups while preserving human approval. |
| [design-craft](skills/design-craft/README.md) | Give interfaces a clear visual direction and a transferable design specification. |
| [goal-to-plan](skills/goal-to-plan/README.md) | Turn a short product goal into requirements, dependencies and a verifiable delivery plan. |
| [load-stress-testing](skills/load-stress-testing/README.md) | Measure application behavior under realistic data volume and concurrent use in a controlled staging environment. |
| [marketing-content](skills/marketing-content/README.md) | Prepare consistent, factual marketing drafts and a content calendar with approval before publication. |
| [motion-and-graphics](skills/motion-and-graphics/README.md) | Choose purposeful interface motion and build accessible, efficient 2D and 3D visuals. |
| [project-structure](skills/project-structure/README.md) | Keep project folders understandable through responsibility-based organization and safe, scoped moves. |
| [responsive-evidence](skills/responsive-evidence/README.md) | Verify actual interface adaptation and preserve screenshots and observations across four viewport classes. |
| [security-testing](skills/security-testing/README.md) | Find, reproduce and fix security weaknesses in authorized systems using controlled, non-destructive checks. |
| [study-organization](skills/study-organization/README.md) | Organize course materials, deadlines and study preparation with human review before submissions. |
| [takt-coordination](skills/takt-coordination/README.md) | Derive agent teams from the customer goal, delivery process and independently verifiable work packages. |
| [takt-design](skills/takt-design/README.md) | Use Cadence's optional graphite-and-red design language as a documented reference for work tools. |
| [takt-operations](skills/takt-operations/README.md) | Keep recurring agent processes traceable through shared knowledge, status files and explicit handovers. |
| [usability-review](skills/usability-review/README.md) | Evaluate real task completion, discoverability, keyboard access and recovery in a running interface. |
| [venture-blueprint](skills/venture-blueprint/README.md) | Turn an idea into a prepared project folder that another agent can inspect and continue. |
| [web-design-craft](skills/web-design-craft/README.md) | Build distinctive web surfaces from deliberate composition, typography, spacing and interaction decisions. |

## Requirements

- An agent that supports skills or can read Markdown instructions and local files.
- Node.js 18 or newer for the nine optional `.mjs` helpers. No npm dependencies are required.
- Browser or application tools for workflows that verify real interfaces.
- Cadence tools and connected accounts for the Cadence-specific operational workflows. The Markdown alone does not provide mailbox access, account connections or an agent runtime.

For a helper example, run this from `skills/web-design-craft/`:

```sh
node scripts/type-scale.mjs --base 16 --ratio 1.25 --ratio-sm 1.2 --css
```

## Scope and safety

Installing a skill does not authorize external actions or expand workspace permissions. Messages, publications, spending, submissions and destructive actions require the authorization specified by the task and runtime. Never commit credentials, private evidence or customer data.

The publication review included all 22 skill entrypoints, all nine Node helpers, file references and credential-pattern checks. Fourteen targeted security regressions pass. The exported helpers include narrowly scoped corrections for linked filesystem paths and malformed security findings; the original Takt project remains unchanged. See [security notes](SECURITY.md) for scope and limits.

Skills that discuss Austrian bookkeeping or provider protocols require current domain or runtime verification before use. German integration-sensitive filenames and report headings inside some Cadence workflows are retained; the explanatory documentation is English.

## Layout

```text
skills/
  <skill-name>/
    SKILL.md
    README.md
    assets/       # when provided
    references/   # when provided
    scripts/      # when provided
LICENSE
SECURITY.md
```

## Provenance and license

Prepared from Cadence's built-in skill library with provenance metadata retained. This collection consolidates the initial individual skill publications; no private application history or local audit archives are included.

[MIT](LICENSE) — Copyright (c) 2026 hellinckx.
