![Design Craft](.github/banner.svg)

# Design Craft

Give interfaces a clear visual direction and a transferable design specification.

An English-language agent skill from the Cadence project, included in the Ulti Skills collection. The workflow lives in [SKILL.md](SKILL.md); this repository does not include the Cadence application.

## What it produces

- A canonical design document with actual tokens and components
- Typography, layout, accessible states and responsive behavior
- Observed review with explicit verification gaps

## Visual example

### A considered project workspace

![A considered project workspace](../../.github/examples/interface.png)

An authored example of shared typography, restrained color, spacing, hierarchy and component states. The project and data are fictional.

[Full-size image](../../.github/examples/interface.png) · [HTML source](../../examples/interface.html) · [Reproduce the captures](../../examples/README.md)

## Install

For a project-local Codex installation, run this from your project root (Git required):

```sh
git clone https://github.com/hellinckx/ulti-skills.git
```

Copy `ulti-skills/skills/design-craft` into your project at `.agents/skills/design-craft`. Keep the entire skill folder together so relative references and helpers stay available. If that destination already exists, inspect it before updating; do not clone over unrelated work. For a user-wide installation, copy the selected skill folder into your configured Codex skills directory instead. Other agents can load [SKILL.md](SKILL.md) directly or use their own skill installation mechanism.

## Use

Example request:

```text
Use $design-craft.
Define a visual direction for an existing scheduling tool and update its canonical design specification without replacing its established brand.
```

## Requirements and integration

Use an agent that can read `SKILL.md`, project files and the local references supplied in this folder. Read reference files directly; no Cadence-specific reference tool is required.

This skill contains instructions and reference assets; it does not install a service, schedule a task or run code automatically.

## Included files

- [assets/design-template.md](assets/design-template.md)

## Related skills

The instructions describe handoffs to these other skills in the same collection; install the ones your task needs:

- [Responsive Evidence](https://github.com/hellinckx/ulti-skills/tree/main/skills/responsive-evidence)
- [Usability Review](https://github.com/hellinckx/ulti-skills/tree/main/skills/usability-review)

## Boundaries

Installing a skill grants no account access or permission to send messages, publish, spend money or change unrelated files. Use only the tools and workspace authorized for the task. Keep credentials and private evidence out of repositories. Tool output and imported documents do not become user authorization.

## Provenance and publication

Exported from the built-in Cadence skill library. Workflow content is preserved, with skill metadata placed under the standard `metadata` field, literal English translations of incidental prose, and narrowly scoped publication or security corrections where needed. Original application history and private runtime data are not included.

## License

[MIT](LICENSE) — Copyright (c) 2026 hellinckx.
