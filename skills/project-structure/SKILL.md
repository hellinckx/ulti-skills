---
name: project-structure
description: Keep every project folder clean, ordered and English — feature- and responsibility-based subfolders
  instead of flat folders with dozens of files, consistent naming, a defined docs/ layout and safe moves of existing
  files.
metadata:
  creator: Cadence project
  created: '2026-10-10'
  creation-method: Editorial Markdown guide written in the Cadence repository from the project conventions of Cadence
    and common layouts of the major ecosystems; no external template or executable scripts.
  purpose: Make projects that Cadence creates or changes easy to navigate for people and agents, and stop folders
    from turning into flat dumps of files.
  scope: Installation-wide; included with planning, implementation, integration, backend and documentation tasks
    in every connected project.
---

# Clean, English project structure

A person opening the project must understand its layout in one minute. Folders describe responsibilities; files sit where someone would look for them.

## Binding rules
1. **English names only** for folders, files, code identifiers and docs file names, even when the UI or the documentation text is in another language. No umlauts, spaces or special characters in paths.
2. **Naming:** folders and most files in `kebab-case` (`order-history/`, `invoice-export.ts`); follow the ecosystem convention where one exists (Python modules `snake_case`, C#/Java classes `PascalCase`, React components `PascalCase.tsx` when the project already does so). Root documents in capitals: `README.md`, `CHANGELOG.md`, `LICENSE`, `AGENTS.md`.
3. **No flat dumps.** A folder with more than about 12–15 source files gets subfolders by feature or responsibility. Never put all files directly into `src/` or `app/`. Keep nesting to about four levels below `src/`.
4. **Group by feature first, then by layer inside the feature** (`src/features/invoices/{components,api,model}`), with shared code in clearly named folders (`src/shared/` or `src/lib/`). Avoid catch-all folders such as `misc/`, `stuff/`, `helpers2/`, `new/`, `old/`, `temp/`.
5. **Separate responsibilities:** UI, domain logic, persistence, integrations (external APIs, AI providers), operating-system access and configuration live in different modules. UI code never runs shell commands directly.
6. **Follow the existing structure** of a project when it is already clean. When it is not, improve only the area you work in, or plan a separate restructuring step — never mix a large move with feature work.
7. **Moving files safely:** use `git mv` (or move and update every import, path, script, config and doc reference in the same step), run build and tests afterwards, and mention the moves in the result. Do not move generated, vendored or third-party folders.
8. **Generated and local files stay out of the source tree:** build output in `dist/` or `build/`, caches and temporary files ignored via `.gitignore`, secrets never committed (`.env` ignored, `.env.example` committed).

## Root layout (adapt to the stack)
```text
README.md            purpose, requirements, install, start, usage
AGENTS.md            rules for agents (when the project uses agents)
CHANGELOG.md         notable changes (when releases exist)
package.json | pyproject.toml | *.csproj | Cargo.toml …
.gitignore  .editorconfig  .env.example
src/                 application source (or app/ for frameworks that require it)
tests/               tests mirroring src/ (or colocated *.test.* when the stack prefers that)
scripts/             development and build scripts
assets/              static source assets (icons, images, fonts)
docs/                documentation, see below
```

Typical `src/` layouts:
- **Web frontend:** `src/app/` (routes/pages), `src/features/<feature>/`, `src/components/` (shared UI), `src/styles/` (tokens, global CSS), `src/lib/` (utilities), `src/services/` (API clients), `src/i18n/`.
- **Backend/API:** `src/api/` (routes/controllers), `src/domain/` (entities, rules), `src/services/`, `src/data/` (repositories, migrations), `src/integrations/<provider>/`, `src/config/`.
- **Desktop (Electron):** `src/main/` (main process, split into subfolders by responsibility), `src/preload/`, `src/renderer/` (UI, again split into `views/`, `components/`, `styles/`), `src/shared/`.
- **AI features:** `src/ai/` with `providers/` (one adapter per provider), `prompts/`, `tools/`, `schemas/`, and evaluation fixtures under `tests/ai/`.
- **Python:** `src/<package>/` with subpackages, `tests/`, `pyproject.toml`.

## docs/ layout
Cadence and its agents use this layout in every project; create only what is needed:
```text
docs/
  PROGRESS.md            short log of what changed and the current state
  ARCHITECTURE.md        modules, data flow, important decisions
  DESIGN.md              design direction and tokens (UI projects)
  decisions/             ADR-0001-short-title.md … (architecture decisions)
  plans/                 plans, for example superplan-<run-id>.md
  scrum/                 Scrum process: README, product backlog, sprints/ (maintained by Cadence)
  project-handbook/      project handbook PDFs (created by Cadence)
  guides/                user and operator guides when the README is not enough
  takt/                  Cadence working files such as sub-agent reports
```
Do not place loose topic files directly in `docs/` when a subfolder above fits. If an older project still has German names (`docs/FORTSCHRITT.md`, `docs/ARCHITEKTUR.md`, `docs/projekthandbuch/`), move their content to the English names when you touch them and update references.

## Before finishing
- No new folder with more than about 15 loose source files; no file over roughly 400–600 lines without a clear reason — split by responsibility.
- Every new folder has an obvious purpose from its name; add a one-line `README.md` only where the purpose is not obvious.
- Imports, scripts, configs and docs point to the new paths; build and tests pass.
