---
name: goal-to-plan
description: Turn a short, vague goal ("I want an app for X", a list of features, a look) into a complete, ordered
  plan — users, explicit and implicit requirements, design, prerequisites, a dependency graph and measurable
  acceptance criteria — with visible assumptions instead of a round of questions. Use when someone describes what
  they want rather than how, before building a new product or a large feature, or when a backlog must be derived
  from a goal. Do not use for a small, fully specified change, or to prepare a whole new venture folder with
  research and handoff files (venture-blueprint).
metadata:
  creator: Cadence project
  created: '2026-10-10'
  creation-method: Editorial Markdown guide written in the Cadence repository from the user's stated way of working
    with Cadence; no external template or executable scripts.
  purpose: People say what they want to achieve, not how. The agent does the product thinking, requirements
    engineering and planning itself.
  scope: Planning, orchestration and coordination work in any project.
---

# From a goal to a complete plan

Assume the person will describe only the goal, a few features, a feeling for the design or what they want to see — rarely how it should work, what it needs first or how parts fit together. That is normal. Your job is to think it through like an experienced product owner, architect and designer together, and to plan everything a finished result needs.

## 1. Understand before planning
- Read the request literally and for intent: who will use the result, what problem it solves, what "done" looks like for them. State that as one product goal.
- Inspect the project read-only: existing code, structure, stack, rules (`AGENTS.md`, `PRODUCT.md`, docs), previous plans, open decisions, the project memory and earlier processes. Build on what exists; never plan from scratch when a base is there.
- Identify the **kind of product** (desktop tool, web app, website, API, automation, game, data pipeline, internal admin …) and its context (single user, team, company, customers).

## 2. Expand the request into requirements
Write down, in plain language, everything the goal implies:
- **Explicit features** from the request, each as a user-visible outcome with measurable acceptance criteria.
- **Implicit features** a person expects without saying: navigation and overview, create/edit/delete with confirmation, search and filter for growing lists, central settings, persistence that survives restarts, import/export or backup when data matters, help and first-start guidance, error and empty states, notifications, history when data changes, sign-in and roles only when several people or secrets are involved.
- **Design:** follow the established product identity or derive a fitting direction from audience and purpose. Plan the canonical transferable design specification, main screens, states, themes and language. Design-craft owns the specification, usability-review owns observed task flows, responsive-evidence owns the four-class screenshot report.
- **Non-functional requirements:** security (no secrets in code or logs, input validation, least privilege), privacy (which data goes where, GDPR), accessibility, performance targets, reliability (atomic saves, recovery), offline behaviour, maintainability (clean English folder structure, tests).
- **Operations:** how it is installed, started (one documented command), configured, updated and backed up.

## 3. Prerequisites and dependencies
- For every feature, list what must exist first: data model, storage, project scaffolding and structure, shared UI shell and design tokens, settings infrastructure, API clients or provider connections, authentication, test setup, seed or sample data for development (never shown as real data).
- Draw the dependency graph: foundations → shared services → features → integration → polish → release. Features that do not depend on each other can run in parallel in separate paths.
- Explain how features relate (shared data, one feeding another, common settings) and plan the shared parts once instead of per feature.
- Put risky or unknown parts early (spikes, research steps) so later work rests on verified ground.

## 4. Decide, don't stall
- Make safe, reversible assumptions for everything the person did not specify and list them visibly (assumptions). Choose established defaults: mainstream stack already in the project or a simple, well-supported one; local data storage unless sharing is required; the product's language for the UI with the other language one click away.
- Ask only fundamental questions that change the plan significantly and cannot be reversed cheaply (for example: who the users are when it decides between a local tool and a hosted service, paid external services, legal obligations). Ask them early, with 2–4 concrete options and a recommendation; continue all independent work meanwhile.
- Never ask for details you can decide with good craft (colours, layouts, field names, folder names, libraries of equal quality).

## 5. Plan output
- A product goal, an ordered backlog of user-visible outcomes with acceptance criteria, the dependency order, quality gates (reviews, visual checks, tests) and a final release with an end-to-end acceptance against the original goal.
- Size the plan to the goal: a small tool needs few steps, a full product needs foundations, features, settings, help, tests and release. Do not inflate; do not leave out what a finished product needs.
- Every work step names the files or areas it touches, what it delivers, how it is verified, and which earlier results it builds on.
- Mark every interface-related implementation, integration and verification step explicitly as frontend/UI in its task description, including otherwise vague steps such as checkout or signup. This makes the relevant quality skills discoverable after delegation. Include the canonical design path and usability/responsive evidence paths in the handoff; do not copy their whole guides into each task. Keep unrelated backend steps separate.
- The finished plan must let someone who never saw the request understand what will be built and why each step exists.
