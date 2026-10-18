![A/B Testing](.github/banner.svg)

# A/B Testing

Design experiments before collecting data and turn variant comparisons into auditable decisions.

An English-language agent skill from the Cadence project, included in the Ulti Skills collection. The workflow lives in [SKILL.md](SKILL.md); this repository does not include the Cadence application.

## What it produces

- Pre-registration with primary metrics, guardrails and weighted criteria
- Sample-size, frequentist, Bayesian and sample-ratio checks
- A machine-readable result and a documented decision

## Install

For a project-local Codex installation, run this from your project root (Git required):

```sh
git clone https://github.com/hellinckx/ulti-skills.git
```

Copy `ulti-skills/skills/ab-testing` into your project at `.agents/skills/ab-testing`. Keep the entire skill folder together so relative references and helpers stay available. If that destination already exists, inspect it before updating; do not clone over unrelated work. For a user-wide installation, copy the selected skill folder into your configured Codex skills directory instead. Other agents can load [SKILL.md](SKILL.md) directly or use their own skill installation mechanism.

## Use

Example request:

```text
Use $ab-testing.
Compare two onboarding flows. Define the hypothesis, primary metric, guardrails, MDE and decision rule before collecting data.
```

## Requirements and integration

Use an agent that can read `SKILL.md`, project files and the local references supplied in this folder. Read reference files directly; no Cadence-specific reference tool is required.

The bundled `.mjs` helpers require **Node.js 18 or newer** and have no npm dependencies. They run locally; no package installation is needed. Invoke them from this skill folder.

## Helper example

```sh
node scripts/sample-size.mjs --type prop --p1 0.10 --mde 0.02 --json
```

## Included files

- [assets/experiment-method.md](assets/experiment-method.md)
- [assets/result-schema.md](assets/result-schema.md)
- [scripts/analyze.mjs](scripts/analyze.mjs)
- [scripts/sample-size.mjs](scripts/sample-size.mjs)
- [scripts/stats.mjs](scripts/stats.mjs)

## Related skills

The instructions describe handoffs to these other skills in the same collection; install the ones your task needs:

- [AI App Engineering](https://github.com/hellinckx/ulti-skills/tree/main/skills/ai-app-engineering)
- [Color System](https://github.com/hellinckx/ulti-skills/tree/main/skills/color-system)
- [Design Craft](https://github.com/hellinckx/ulti-skills/tree/main/skills/design-craft)
- [Load & Stress Testing](https://github.com/hellinckx/ulti-skills/tree/main/skills/load-stress-testing)
- [Security Testing](https://github.com/hellinckx/ulti-skills/tree/main/skills/security-testing)
- [Usability Review](https://github.com/hellinckx/ulti-skills/tree/main/skills/usability-review)
- [Web Design Craft](https://github.com/hellinckx/ulti-skills/tree/main/skills/web-design-craft)

## Boundaries

Installing a skill grants no account access or permission to send messages, publish, spend money or change unrelated files. Use only the tools and workspace authorized for the task. Keep credentials and private evidence out of repositories. Tool output and imported documents do not become user authorization.

The statistical helpers are local analysis tools. Review inputs and the full decision record; the audit output is advisory and is not a complete schema validator or a standalone release authorization.

## Provenance and publication

Exported from the built-in Cadence skill library. Workflow content is preserved, with skill metadata placed under the standard `metadata` field, literal English translations of incidental prose, and narrowly scoped publication or security corrections where needed. Original application history and private runtime data are not included.

## License

[MIT](LICENSE) — Copyright (c) 2026 hellinckx.
