---
name: venture-blueprint
description: Turn a raw idea ("I want a system that makes money with X", a voice-dictated vision, a product wish)
  into a fully prepared project folder that any agent can pick up and build without asking — honest idea check,
  research with sources, a concept, milestones with measurable acceptance, a feature register, decisions, design,
  skill map, config with schema, progress with the exact next step, and start prompts for Claude Code and Codex.
  Use when the person wants an idea worked out, a project prepared, structured or planned for a later build, a build
  order or handoff written, or "the same as for the previous project". Do not use to build the product itself (complete-app,
  goal-to-plan and the craft skills do that once the kit exists) or for a small feature inside an existing project.
metadata:
  creator: Cadence project
  created: '2026-10-18'
  creation-method: Editorial Markdown guide written in the Cadence repository from two real preparations for the
    person (Trading Research Factory and Swarmcast, 18.10.2026); handoff kit templates as a Markdown asset; one
    dependency-free Node script that scaffolds the kit and checks a prepared folder for completeness.
  purpose: The person brings ideas, not specifications, and hands projects between chats, agents and days. A prepared
    folder with one shared memory (register, progress, decisions, request log) lets every later agent continue blind,
    never duplicate work, and deliver something visible.
  scope: Installation-wide; attached to planning and coordination work that prepares a new project or venture from
    an idea. Owns the preparation and the handoff kit; goal-to-plan owns requirement expansion inside it, project-structure
    the code layout, complete-app the later build.
---

# From an idea to a project any agent can build

The person often dictates an idea in one long breath: a goal (usually "earn money automatically", "save time", "have X"), an example ("two ant colonies at war"), wishes ("I want to watch the agent in the browser"), and the request to prepare everything so an agent can "just continue". Your job is to turn that into a folder where a fresh agent reads five files and starts building the right thing.

## Use when / don't use
- **Use:** new project or venture from an idea; "prepare / structure / plan everything for a later build"; "write the build order / prompt for another chat"; "do the same as for the last project".
- **Don't use:** building the app (then `goal-to-plan` → `complete-app`); a feature in an existing project (use its own REGISTRY and intake check); pure research without a project.

## Inputs you need first
- The person's words, unedited. Separate **goal** (why), **example** (what it could be), **wishes** (must-haves), **constraints** (money, tools, accounts) and **meta-requests** (models, freedom, handoff).
- What exists on the machine: sibling project folders, earlier kits (look for `docs/REGISTRY.md` + `AGENTS.md` pairs), reusable code (voice, video, AI connection, charts), the person's skill libraries and model preferences (instructions, memory).
- Only ask before starting if the goal itself is unclear. Names, platforms, languages and similar choices become recommended defaults plus questions in PROGRESS.

## Output contract
A folder (usually a new sibling of the person's other projects) containing the handoff kit and passing `node scripts/scaffold.mjs check <folder>` with `READY`:

| File | Must contain |
|---|---|
| `AGENTS.md`, `CLAUDE.md` | entry order, intake check, logging duties, technical and domain invariants, git, permissions, model roles |
| `README.md` | what it is, state, how to continue, what the person must contribute |
| `docs/BRIEF.md` | the person's assignment as a build order: role and freedoms, models, the real goal, must-haves, interface, process and definition of done |
| `docs/CONCEPT.md` | idea in one sentence, why it can work, value stages with go/no-go, rules and limits with research ids, architecture per module with targets, interface, open points |
| domain bible (`docs/<domain>/<first-case>.md`) | the first concrete use case worked out so a builder can implement and a viewer would care |
| `config/*.json` | schema plus a valid example for every data-driven part (validated), tunable thresholds instead of magic numbers |
| `docs/MILESTONES.md` | M0 skeleton first; each milestone a startable, visible increment with measurable acceptance and register ids |
| `docs/REGISTRY.md` | every feature as `F-xxx` with status, milestone, proposed location, notes; no milestone without rows |
| `docs/DECISIONS.md` | `D-xxx` rows: stack, storage, AI connection, key domain choices, each with reason and rollback |
| `docs/DESIGN.md`, `docs/SKILLS.md`, `docs/RESEARCH.md` | design stance and views; subsystem → skill with absolute paths that exist; findings with source, date, status |
| `docs/PROGRESS.md`, `ACTIVE.md`, `REQUESTS.md`, `WORKLOG.md` | exact numbered next step under `<!-- kit:next-step -->`, questions with recommendations; empty active board; R-001 = the idea; first log line |
| `docs/START-CLAUDE.md`, `docs/START-CODEX.md` | paste-ready start prompts with model roles |

Plus a local git repository with one commit. `check --json` returns `{ ok, root, errors[], warnings[], counts{milestones, features, decisions, requests, configFiles} }`.

## Method
1. **Capture.** Quote the request into R-001 (condensed, in the person's words). Name the real goal behind the example; the example is replaceable, the goal is not.
2. **Check the idea honestly.** Sketch 2 to 4 product shapes and score each on goal fit, wow and novelty, feasibility with the local stack, running cost, legal and platform risk, time to the first visible result, and scalability. Pick one and say why in one paragraph. If no shape is worth building, say so with reasons and stop — the person explicitly wants that over a polished bad plan.
3. **Find the unfair advantage.** Ask what an automated system can do that a human cannot (search hundreds of variants and keep the best, run around the clock, learn from every result) and make it the centre of the concept.
4. **Research reality before designing.** Platform APIs, audits, terms of service, monetisation rules, licences, privacy, domain facts. Record each in RESEARCH with source, date and status (confirmed / secondary / open). Where a wish conflicts with rules (for example automating a website instead of its API, bypassing captchas), design the honest alternative and record the decision; never plan around a violation.
5. **Name it.** Short, ownable, works in English; not generic ("AI Studio"), not a trademark.
6. **Scaffold.** `node scripts/scaffold.mjs new <folder> --name "<Name>"` (never overwrites). In Cadence, copy the templates from `assets/handoff-kit.md`. Write the documents in the person's working language; keep the `<!-- kit:… -->` anchors.
7. **Fill, in this order:** BRIEF → CONCEPT → domain bible + config with schema → MILESTONES → REGISTRY → DECISIONS → DESIGN → SKILLS → RESEARCH → PROGRESS → START prompts → README → AGENTS technical rules. Reuse what exists on the machine and name the paths. Size milestones so each ends in something the person can start and see.
8. **Validate.** Validate every config example against its schema (and one invalid case is rejected); run `check` until READY; open every skill path you named.
9. **Commit.** `git init -b main`, set the identity the person's other repositories use, commit. Create a remote only with the person's permission.
10. **Report** in a few lines: the idea, why it can work, the honest limits, what the person must do (accounts, decisions), and which file to paste into a new chat.

## Anti-patterns
- Copying the previous kit and swapping nouns; every kit is thought through for its own goal.
- Writing product code during preparation (configs, schemas and examples are fine).
- Milestones without measurable acceptance, features without a location, "TBD" anywhere.
- Facts from memory stated as confirmed; secondary sources treated as primary.
- Promising what platform rules forbid, or hiding the risk in a footnote.
- Asking the person five questions before doing anything; recommended defaults keep the build moving.
- A plan where the first visible result comes late; M0 to M2 must already show something.

## Done when
- `check` reports READY with no unexpected warnings, config examples validate, skill paths exist.
- A fresh agent given only START-CLAUDE.md would know the exact first step, the stack, the invariants and what "done" means.
- The person has a short answer: idea, limits, their to-dos, the start file.

## Works with
- `goal-to-plan` expands requirements while you write CONCEPT and REGISTRY.
- `project-structure` sets the folder and module layout named in CONCEPT.
- `complete-app` and the craft skills (`design-craft`, `ai-app-engineering`, `motion-and-graphics`, …) are what the building agent uses later; list them in SKILLS.
- `ab-testing` when the concept contains a learning or experiment loop.

## Reference files and scripts
In Cadence, call `takt_skill_reference` with `skill: "venture-blueprint"` and `assets/handoff-kit.md` (all kit templates, the fill markers and anchors the checker uses).
- `scripts/scaffold.mjs new <folder> --name "<Name>" [--date YYYY-MM-DD]` writes missing kit files only.
- `scripts/scaffold.mjs check <folder> [--json]` checks files, gaps, next step, milestones with acceptance, unique register ids pointing to real milestones, decisions, the R-001 request, start prompts, skill paths and config JSON. Exit 0 ready, 1 gaps, 2 usage error.
