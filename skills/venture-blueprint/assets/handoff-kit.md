# Handoff kit templates

Single source for `scripts/scaffold.mjs` and for agents that cannot run scripts. Each file starts with a `<!-- FILE: path -->` line followed by a `~~~~` fenced block. Placeholders: `{{NAME}}` project name, `{{DATE}}` ISO date. Every `<!-- fill: … -->` marker is a gap the preparing agent must replace with real content; `check` fails while any remains. `<!-- kit:… -->` anchors stay in the files: the checker uses them and they are language-independent, so headings may be translated into the person's language.

<!-- FILE: AGENTS.md -->
~~~~markdown
# Working rules for every agent in this project (Claude Code, Codex, others)

Different AI agents build this project in turns. Every agent must be able to continue without asking.

## On entry (always, also after context loss)

0. Read `docs/BRIEF.md`: the person's original assignment (role, freedoms, honesty, goal, acceptance). It applies to every agent.
1. Read `docs/PROGRESS.md`: done, running, **the exact next step**, open questions.
2. Read `docs/REGISTRY.md` (feature register), `docs/ACTIVE.md` (who works on what) and `docs/REQUESTS.md` (request log). They prevent duplicate work.
3. Read the last 30 lines of `docs/WORKLOG.md`.
4. Read `docs/MILESTONES.md` for the current milestone and its acceptance criteria.
5. Architecture: `docs/CONCEPT.md`, `docs/DECISIONS.md` (decisions there apply; deviations get a new row with reason). Design: `docs/DESIGN.md`. Skills: `docs/SKILLS.md`. Sources and platform rules: `docs/RESEARCH.md`. Configuration: `config/`.

Then continue with the "next step" in PROGRESS. Do not re-plan what is already planned.

## Intake check (before EVERY new request, idea or task)

1. Search `docs/REGISTRY.md` for the function, synonyms and neighbours.
2. Check `docs/ACTIVE.md` and the end of `docs/WORKLOG.md`; never start in parallel on the same feature or files.
3. Check `docs/REQUESTS.md`, `docs/DECISIONS.md`, `docs/CONCEPT.md`, `docs/MILESTONES.md`.
4. Search `src/` for existing modules, channels, tables, components; extend instead of rewriting.
5. Log the result in `docs/REQUESTS.md` (`exists`, `planned`, `in progress`, `new`, `conflict`, `rejected`); `new` gets the next F-number in REGISTRY; `conflict` becomes a question to the person.
6. Enter yourself in `docs/ACTIVE.md` before starting, remove yourself afterwards.

Every answer to a request starts with the intake result in one sentence.

## While working

- After every finished block: one line in `docs/WORKLOG.md`, update PROGRESS ("running", "next step").
- Every routine decision becomes a row in `docs/DECISIONS.md`; every question to the person goes into PROGRESS with a recommendation, and work continues with it.
- Keep REGISTRY status current (🔧 ✅ ❌); a milestone is not done while its rows are not ✅.
- New facts about platforms, rules or the domain go into `docs/RESEARCH.md` with source, date, status.
- Sub-agents get register IDs, allowed files and the WORKLOG duty; the orchestrator enters and removes them in ACTIVE.
- A milestone is done only with build and tests green, the app started, the views seen in a real window and screenshots under `docs/qa/<milestone>/`.
- Never claim something works without running it.

## WORKLOG format

```
- {{DATE}} 14:05 · Agent · M0 · what was done, which files, state (green/red/untested).
```

## Technical rules

<!-- fill: stack, naming, language of docs and UI, process boundaries, secrets, domain-specific invariants (for example determinism), commands -->

## Git

<!-- fill: repository, branch, remote or "local only", commit rhythm, what is never committed -->

## Permissions from the person

<!-- fill: open source policy, reuse of other local projects, live model tests, outward actions that need approval -->

## Model roles (frame, not duty)

<!-- fill: orchestrator / sub-agent / text / mechanical models for Claude Code and Codex, as the person prefers -->
~~~~

<!-- FILE: CLAUDE.md -->
~~~~markdown
# Claude Code: project rules

Read and follow `AGENTS.md`. Start every session with `docs/PROGRESS.md`, section "next step".
~~~~

<!-- FILE: README.md -->
~~~~markdown
# {{NAME}}

<!-- fill: what it is in two sentences, current state, how to continue (start prompts), file overview, what the person must contribute -->
~~~~

<!-- FILE: .gitignore -->
~~~~text
node_modules/
out/
dist/
/data/
/data-qa/
*.log
.env
.env.*
.DS_Store
*.tsbuildinfo
docs/qa/**/*.tmp
~~~~

<!-- FILE: docs/BRIEF.md -->
~~~~markdown
# Build order: {{NAME}}

> The person's original assignment. It applies to every agent. Start prompts: `docs/START-CLAUDE.md`, `docs/START-CODEX.md`.

## Your role and your freedoms

<!-- fill: lead architect and orchestrator; models; free choice of sub-agents, decomposition, technology and design (proposals in CONCEPT/DECISIONS are a starting point); early, short questions with 2-4 options and a recommendation; honesty rule -->

## The goal

<!-- fill: the person's real goal behind the example, the product in one paragraph, value or revenue stages -->

## What it must do

<!-- fill: numbered must-haves, each a user-visible outcome -->

## The interface

<!-- fill: platform, quality bar, language, main areas -->

## Skills

Read the matching skills before each part; mapping with paths in `docs/SKILLS.md`.

## Process and acceptance

1. Read `AGENTS.md`, then `docs/PROGRESS.md`, continue with the next step.
2. Work through `docs/MILESTONES.md` on your own, one after another, without waiting for prompts.
3. Every milestone ends with real evidence (build and tests green, app started, views seen, screenshots in `docs/qa/<milestone>/`).
4. <!-- fill: when the whole project is done -->
~~~~

<!-- FILE: docs/CONCEPT.md -->
~~~~markdown
# Concept {{NAME}}

As of {{DATE}}. Every deviation goes into `docs/DECISIONS.md` with a reason.

## 1. The idea in one sentence
<!-- fill -->

## 2. Why it can work
<!-- fill: evidence, the real advantage, unit economics, scaling -->

## 3. Value stages with go/no-go
<!-- fill: table stage / what / value / threshold for the next stage -->

## 4. Rules and limits
<!-- fill: platform, legal, licence, privacy and safety constraints with RESEARCH ids; honest alternatives where the wish conflicts with them -->

## 5. Architecture
<!-- fill: module diagram, one subsection per module with responsibility, interfaces, performance targets; data and security -->

## 6. Interface
<!-- fill: table of areas and contents -->

## 7. First use case
<!-- fill: pointer to the domain bible and its config -->

## 8. Open points
<!-- fill: what must be clarified before which milestone -->
~~~~

<!-- FILE: docs/MILESTONES.md -->
~~~~markdown
# Milestones

Every milestone ends with: typecheck, tests and build green; app started with the documented command; affected views seen in a real window and captured under `docs/qa/<milestone>/`; `report.md` with commands and results; register rows ✅; PROGRESS updated; commit.

<!-- kit:milestones -->
## M0 · Skeleton and shell
**Result:** <!-- fill -->
**Acceptance:** <!-- fill: measurable -->
**Register:** <!-- fill: F-ids -->

## M1 · <!-- fill: title -->
**Result:** <!-- fill -->
**Acceptance:** <!-- fill: measurable -->
**Register:** <!-- fill: F-ids -->
~~~~

<!-- FILE: docs/REGISTRY.md -->
~~~~markdown
# Feature register

The one list of all functions: done, in progress, planned or rejected. **Look here before every new task** (`AGENTS.md`, intake check). No function exists twice.

Status: ✅ done and checked · 🔧 in progress · 📋 planned · ❌ rejected · ⏸ deferred

| ID | Function | Status | Milestone | Location (files) | Notes |
|---|---|---|---|---|---|
<!-- fill: one row per feature, F-001 onwards, grouped by milestone; every milestone in MILESTONES has rows -->
~~~~

<!-- FILE: docs/PROGRESS.md -->
~~~~markdown
# Progress
Last updated: {{DATE}} · <!-- fill: agent --> · **prepared, no code yet**

Entry: `AGENTS.md`, `docs/BRIEF.md`, then here.

## Done
<!-- fill: what the preparation delivered and what was checked -->

## Running
- nothing

## Next step (exact)
<!-- kit:next-step -->
<!-- fill: numbered, concrete first steps -->

## Open
<!-- fill: milestones left, what needs the person -->

## Questions to the person (work continues with the recommendation)
<!-- fill: numbered questions with options and recommendation -->

## Start
<!-- fill: commands once they exist -->
~~~~

<!-- FILE: docs/ACTIVE.md -->
~~~~markdown
# Active board: who works on what

Every agent enters itself **before** starting and removes itself **after** finishing. Orphaned rows older than 24 hours without a WORKLOG line may be removed (note it in WORKLOG).

| Since | Agent / session | Feature (register id) | Files / area | Expected end |
|---|---|---|---|---|
| – | – | – | – | – |
~~~~

<!-- FILE: docs/REQUESTS.md -->
~~~~markdown
# Request log

Every request of the person is logged here **before** work starts, with the intake result (`AGENTS.md`).

| No. | Date | Request (short) | Check | Result | Entered in |
|---|---|---|---|---|---|
<!-- fill: R-001 = the original idea, in the person's words, condensed -->
~~~~

<!-- FILE: docs/WORKLOG.md -->
~~~~markdown
# Work log

Format: date time · agent · milestone · what was done, which files, state.

<!-- fill: first line for the preparation -->
~~~~

<!-- FILE: docs/DECISIONS.md -->
~~~~markdown
# Decision log

Every routine decision with date, decision, reason and rollback. Larger architecture decisions also get a file under `docs/decisions/`.

| No. | Date | Decision | Reason | Rollback |
|---|---|---|---|---|
<!-- fill: D-001 onwards: stack, storage, AI connection, key domain choices -->
~~~~

<!-- FILE: docs/DESIGN.md -->
~~~~markdown
# Design

<!-- fill: stance, colour method, type, main views with layout, content rules (for example video safe zones), how it is checked -->
~~~~

<!-- FILE: docs/SKILLS.md -->
~~~~markdown
# Skills per subsystem

Read the skill file before the matching part and follow its rules.

| Subsystem | Skills | Why |
|---|---|---|
<!-- fill: one row per subsystem; give library roots with absolute paths and check that every named skill exists -->
~~~~

<!-- FILE: docs/RESEARCH.md -->
~~~~markdown
# Research

Every finding with source, check date and status: **confirmed** (primary source read), **secondary** (third party only, verify before use), **open** (not checked yet).

| ID | Finding | Source | Checked | Status |
|---|---|---|---|---|
<!-- fill: platform, legal, technical and domain facts the plan relies on -->

## Check before M0
<!-- fill: versions, local tools, accounts -->
~~~~

<!-- FILE: docs/START-CLAUDE.md -->
~~~~markdown
# Start with Claude Code

Open a new Claude Code chat in the project folder, choose the orchestrator model, paste:

```
Working folder: <!-- fill: absolute path -->. You are lead architect and orchestrator of "{{NAME}}".

Read in this order before doing anything:
1. AGENTS.md
2. docs/BRIEF.md
3. docs/PROGRESS.md
4. docs/REGISTRY.md, docs/ACTIVE.md, docs/REQUESTS.md, docs/WORKLOG.md
5. docs/CONCEPT.md, docs/MILESTONES.md, docs/DECISIONS.md, docs/DESIGN.md, docs/SKILLS.md, docs/RESEARCH.md, config/

Then start with the "next step" in docs/PROGRESS.md and work through all milestones on your own. <!-- fill: model roles for sub-agents -->

Duties: intake check before every new request; WORKLOG and PROGRESS after every block; decisions in DECISIONS; status in REGISTRY; sources in RESEARCH. Every milestone ends with real evidence. Never claim something works without running it. Commit after every milestone.

Ask me only when something is fundamentally unclear: short, 2 to 4 options, your recommendation; keep working meanwhile.

Begin now.
```
~~~~

<!-- FILE: docs/START-CODEX.md -->
~~~~markdown
# Start with Codex

<!-- fill: model table (orchestrator, sub-agents, text, mechanical) -->

```
Working folder: <!-- fill: absolute path -->. You are lead architect and orchestrator of "{{NAME}}".

Read in this order before doing anything: AGENTS.md, docs/BRIEF.md, docs/PROGRESS.md, docs/REGISTRY.md, docs/ACTIVE.md, docs/REQUESTS.md, docs/WORKLOG.md; then docs/CONCEPT.md, docs/MILESTONES.md, docs/DECISIONS.md, docs/DESIGN.md, docs/SKILLS.md, docs/RESEARCH.md, config/ as needed.

Then start with the "next step" in docs/PROGRESS.md and work through all milestones on your own. Same duties as in AGENTS.md. Never claim something works without running it.

Begin now.
```
~~~~
