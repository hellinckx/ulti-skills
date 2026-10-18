![Color System](.github/banner.svg)

# Color System

Create deliberate OKLCH palettes, semantic tokens and measured contrast across themes.

An English-language agent skill from the Cadence project, included in the Ulti Skills collection. The workflow lives in [SKILL.md](SKILL.md); this repository does not include the Cadence application.

## What it produces

- Seeded dark and light palettes with semantic roles
- Gamut mapping and contrast measurements
- CSS tokens and a machine-readable palette record

## Visual example

### Generated light and dark themes

![Generated light and dark themes](../../.github/examples/color-system.png)

A real rendering of the bundled palette generator output at hue 155. All 42 declared contrast pairs meet their targets. This is a palette demonstration, not a full accessibility certification.

[Full-size image](../../.github/examples/color-system.png) · [HTML source](../../examples/palette.html) · [Reproduce the captures](../../examples/README.md)

## Install

For a project-local Codex installation, run this from your project root (Git required):

```sh
git clone https://github.com/hellinckx/ulti-skills.git
```

Copy `ulti-skills/skills/color-system` into your project at `.agents/skills/color-system`. Keep the entire skill folder together so relative references and helpers stay available. If that destination already exists, inspect it before updating; do not clone over unrelated work. For a user-wide installation, copy the selected skill folder into your configured Codex skills directory instead. Other agents can load [SKILL.md](SKILL.md) directly or use their own skill installation mechanism.

## Use

Example request:

```text
Use $color-system.
Create a warm, restrained dark and light palette for an inventory app. Record seed hues, semantic roles and measured contrast.
```

## Requirements and integration

Use an agent that can read `SKILL.md`, project files and the local references supplied in this folder. Read reference files directly; no Cadence-specific reference tool is required.

The bundled `.mjs` helpers require **Node.js 18 or newer** and have no npm dependencies. They run locally; no package installation is needed. Invoke them from this skill folder.

## Helper example

```sh
node scripts/contrast.mjs "#111013" "#f1edf0"
```

## Included files

- [assets/palette-recipe.md](assets/palette-recipe.md)
- [assets/palette-record.md](assets/palette-record.md)
- [assets/tokens-template.css](assets/tokens-template.css)
- [scripts/contrast.mjs](scripts/contrast.mjs)
- [scripts/palette.mjs](scripts/palette.mjs)

## Related skills

The instructions describe handoffs to these other skills in the same collection; install the ones your task needs:

- [A/B Testing](https://github.com/hellinckx/ulti-skills/tree/main/skills/ab-testing)
- [Design Craft](https://github.com/hellinckx/ulti-skills/tree/main/skills/design-craft)
- [Responsive Evidence](https://github.com/hellinckx/ulti-skills/tree/main/skills/responsive-evidence)
- [Usability Review](https://github.com/hellinckx/ulti-skills/tree/main/skills/usability-review)
- [Web Design Craft](https://github.com/hellinckx/ulti-skills/tree/main/skills/web-design-craft)

## Boundaries

Installing a skill grants no account access or permission to send messages, publish, spend money or change unrelated files. Use only the tools and workspace authorized for the task. Keep credentials and private evidence out of repositories. Tool output and imported documents do not become user authorization.

File-generating helpers must run in a trusted local directory. They are not an OS sandbox and cannot defend against a hostile process concurrently replacing directories.

## Provenance and publication

Exported from the built-in Cadence skill library. Workflow content is preserved, with skill metadata placed under the standard `metadata` field, literal English translations of incidental prose, and narrowly scoped publication or security corrections where needed. Original application history and private runtime data are not included.

## License

[MIT](LICENSE) — Copyright (c) 2026 hellinckx.
