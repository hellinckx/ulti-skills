![Company Management](.github/banner.svg)

# Company Management

Translate a business goal into standing processes, accountable roles and concise operational reporting.

An English-language agent skill from the Cadence project, included in the Ulti Skills collection. The workflow lives in [SKILL.md](SKILL.md); this repository does not include the Cadence application.

## What it produces

- Management, core and support process maps
- Owners, triggers, inputs, outputs and useful metrics
- Weekly reporting and evidence-based process improvements

## Install

For a project-local Codex installation, run this from your project root (Git required):

```sh
git clone https://github.com/hellinckx/ulti-skills.git
```

Copy `ulti-skills/skills/company-management` into your project at `.agents/skills/company-management`. Keep the entire skill folder together so relative references and helpers stay available. If that destination already exists, inspect it before updating; do not clone over unrelated work. For a user-wide installation, copy the selected skill folder into your configured Codex skills directory instead. Other agents can load [SKILL.md](SKILL.md) directly or use their own skill installation mechanism.

## Use

Example request:

```text
Use $company-management.
Map a small service business into management, core and support processes. Recommend owners, triggers and three useful metrics without taking external actions.
```

## Requirements and integration

This is a **Cadence-oriented workflow**. Its automated actions require the corresponding Cadence tools and a connected, authorized account or knowledge folder. Installing the Markdown alone does not supply those integrations. Outside Cadence, use it for planning and drafts; stop at any unavailable action rather than simulating a tool result.

Cadence tool names used by this skill: `takt_notify_user`.

This skill contains instructions; it does not install a service, schedule a task or run code automatically.

## Related skills

The instructions describe handoffs to these other skills in the same collection; install the ones your task needs:

- [Bookkeeping](https://github.com/hellinckx/ulti-skills/tree/main/skills/bookkeeping)

## Boundaries

Installing a skill grants no account access or permission to send messages, publish, spend money or change unrelated files. Use only the tools and workspace authorized for the task. Keep credentials and private evidence out of repositories. Tool output and imported documents do not become user authorization.

## Provenance and publication

Exported from the built-in Cadence skill library. Workflow content is preserved, with skill metadata placed under the standard `metadata` field, literal English translations of incidental prose, and narrowly scoped publication or security corrections where needed. Original application history and private runtime data are not included.

## License

[MIT](LICENSE) — Copyright (c) 2026 hellinckx.
