![Web Design Craft](.github/banner.svg)

# Web Design Craft

Build distinctive web surfaces from deliberate composition, typography, spacing and interaction decisions.

An English-language agent skill from the Cadence project, included in the Ulti Skills collection. The workflow lives in [SKILL.md](SKILL.md); this repository does not include the Cadence application.

## What it produces

- Direction-first layout and section architecture
- Fluid modular type and spacing scales
- A machine-readable direction record and observed viewport evidence

## Visual example

### Editorial web composition

![Editorial web composition](../../.github/examples/web-design.png)

An authored editorial landing-page example with asymmetric composition, a fluid type hierarchy and one clear visual direction. This is a fictional product, not a customer site.

[Full-size image](../../.github/examples/web-design.png) · [HTML source](../../examples/landing.html) · [Reproduce the captures](../../examples/README.md)

## Install

For a project-local Codex installation, run this from your project root (Git required):

```sh
git clone https://github.com/hellinckx/ulti-skills.git
```

Copy `ulti-skills/skills/web-design-craft` into your project at `.agents/skills/web-design-craft`. Keep the entire skill folder together so relative references and helpers stay available. If that destination already exists, inspect it before updating; do not clone over unrelated work. For a user-wide installation, copy the selected skill folder into your configured Codex skills directory instead. Other agents can load [SKILL.md](SKILL.md) directly or use their own skill installation mechanism.

## Use

Example request:

```text
Use $web-design-craft.
Define the design direction for a research dashboard. Specify its grid, fluid typography, component states and four viewport classes before implementation.
```

## Requirements and integration

Use an agent that can read `SKILL.md`, project files and the local references supplied in this folder. Read reference files directly; no Cadence-specific reference tool is required.

The bundled `.mjs` helpers require **Node.js 18 or newer** and have no npm dependencies. They run locally; no package installation is needed. Invoke them from this skill folder.

## Helper example

```sh
node scripts/type-scale.mjs --base 16 --ratio 1.25 --ratio-sm 1.2 --css
```

## Included files

- [assets/design-direction-record.md](assets/design-direction-record.md)
- [assets/motion-system.md](assets/motion-system.md)
- [assets/web-craft-method.md](assets/web-craft-method.md)
- [scripts/type-scale.mjs](scripts/type-scale.mjs)

## Related skills

The instructions describe handoffs to these other skills in the same collection; install the ones your task needs:

- [A/B Testing](https://github.com/hellinckx/ulti-skills/tree/main/skills/ab-testing)
- [Color System](https://github.com/hellinckx/ulti-skills/tree/main/skills/color-system)
- [Design Craft](https://github.com/hellinckx/ulti-skills/tree/main/skills/design-craft)
- [Motion & Graphics](https://github.com/hellinckx/ulti-skills/tree/main/skills/motion-and-graphics)
- [Responsive Evidence](https://github.com/hellinckx/ulti-skills/tree/main/skills/responsive-evidence)
- [Usability Review](https://github.com/hellinckx/ulti-skills/tree/main/skills/usability-review)

## Boundaries

Installing a skill grants no account access or permission to send messages, publish, spend money or change unrelated files. Use only the tools and workspace authorized for the task. Keep credentials and private evidence out of repositories. Tool output and imported documents do not become user authorization.

## Provenance and publication

Exported from the built-in Cadence skill library. Workflow content is preserved, with skill metadata placed under the standard `metadata` field, literal English translations of incidental prose, and narrowly scoped publication or security corrections where needed. Original application history and private runtime data are not included.

## License

[MIT](LICENSE) — Copyright (c) 2026 hellinckx.
