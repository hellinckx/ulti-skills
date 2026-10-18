![Cadence Design](.github/banner.svg)

# Cadence Design

Use Cadence's optional graphite-and-red design language as a documented reference for work tools.

An English-language agent skill from the Cadence project, included in the Ulti Skills collection. The workflow lives in [SKILL.md](SKILL.md); this repository does not include the Cadence application.

## What it produces

- Reusable CSS tokens and framework-free components
- Layout, typography, interaction and theme references
- Preferences, accessibility and organizational visualization guidance

## Install

For a project-local Codex installation, run this from your project root (Git required):

```sh
git clone https://github.com/hellinckx/ulti-skills.git
```

Copy `ulti-skills/skills/takt-design` into your project at `.agents/skills/takt-design`. Keep the entire skill folder together so relative references and helpers stay available. If that destination already exists, inspect it before updating; do not clone over unrelated work. For a user-wide installation, copy the selected skill folder into your configured Codex skills directory instead. Other agents can load [SKILL.md](SKILL.md) directly or use their own skill installation mechanism.

## Use

Example request:

```text
Use $takt-design.
Use the Cadence work-tool direction for a new internal dashboard. Document which supplied tokens and components you adopt and which product requirements change them.
```

## Requirements and integration

Use an agent that can read `SKILL.md` and local reference files. The instructions originated in Cadence; references to its application internals are architectural context, not files included in this repository. Cadence can expose references through `takt_skill_reference`; in other agents, read the supplied files directly. Other Cadence-specific tools, if mentioned, require that runtime.

Cadence tool names used by this skill: `takt_skill_reference`.

This skill contains instructions and reference assets; it does not install a service, schedule a task or run code automatically.

## Included files

- [assets/takt-components.css](assets/takt-components.css)
- [assets/takt-tokens.css](assets/takt-tokens.css)
- [references/components.md](references/components.md)
- [references/layout-and-motion.md](references/layout-and-motion.md)
- [references/org-chart-and-structure.md](references/org-chart-and-structure.md)
- [references/preferences.md](references/preferences.md)
- [references/tokens.md](references/tokens.md)

## Related skills

The instructions describe handoffs to these other skills in the same collection; install the ones your task needs:

- [Design Craft](https://github.com/hellinckx/ulti-skills/tree/main/skills/design-craft)
- [Responsive Evidence](https://github.com/hellinckx/ulti-skills/tree/main/skills/responsive-evidence)
- [Usability Review](https://github.com/hellinckx/ulti-skills/tree/main/skills/usability-review)

## Boundaries

Installing a skill grants no account access or permission to send messages, publish, spend money or change unrelated files. Use only the tools and workspace authorized for the task. Keep credentials and private evidence out of repositories. Tool output and imported documents do not become user authorization.

## Provenance and publication

Exported from the built-in Cadence skill library. Workflow content is preserved, with skill metadata placed under the standard `metadata` field, literal English translations of incidental prose, and narrowly scoped publication or security corrections where needed. Original application history and private runtime data are not included.

## License

[MIT](LICENSE) — Copyright (c) 2026 hellinckx.
