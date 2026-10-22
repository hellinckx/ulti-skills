---
name: goal-to-plan
description: Turn a short or vague goal ("I want an app for X", a dictated idea, a feature list, a look) into an
  honest, ordered plan — idea check, users, explicit and implicit requirements, prerequisites, a dependency graph
  and measurable acceptance criteria — with visible assumptions instead of a round of questions. Use when someone
  describes what they want rather than how, before building a new product or large feature, or when a backlog must
  be derived from a goal. Not for a small, fully specified change.
metadata:
  creator: Cadence project
  created: '2026-10-10'
  updated: '2026-10-22'
  origin: Absorbs the idea check and research rules of the former venture-blueprint skill.
---

# From a goal to a complete plan

People describe the goal, a few features and a feeling for the design — rarely how it works, what it needs first or how the parts fit. Think it through like a product owner, architect and designer together, and plan everything a finished result needs, no more.

## 1. Understand
- Separate the request into **goal** (why), **example** (what it could be — replaceable), **must-haves**, **constraints** (money, tools, accounts) and **meta-requests** (models, handoff, freedom). State the goal as one sentence.
- Inspect the project read-only: code, stack, `AGENTS.md`/`CLAUDE.md`, docs, earlier plans, open decisions. Build on what exists.
- Name the kind of product (desktop tool, web app, site, API, automation, game, pipeline) and its context (one user, team, customers).

## 2. Check the idea honestly (new products only)
- Sketch 2–4 product shapes and compare them on goal fit, feasibility with the available stack, running cost, legal/platform risk and time to the first visible result. Pick one and say why in a paragraph.
- Research what memory cannot confirm — platform APIs, terms of service, licences, privacy rules, prices — and cite sources with dates. Where a wish conflicts with rules (scraping instead of an API, bypassing captchas), plan the honest alternative.
- If no shape is worth building, say so with reasons and stop. An honest "no" beats a polished bad plan.

## 3. Expand into requirements
- **Explicit features**, each as a user-visible outcome with measurable acceptance criteria.
- **Implicit features** a person expects without saying — the complete-app checklist covers them (navigation, states, settings, persistence, help, recovery). Include only what this product actually needs.
- **Non-functional:** security (no secrets in code or logs, validation, least privilege), privacy (which data goes where), accessibility, performance targets, reliability, offline behaviour.
- **Operations:** install, one documented start command, configuration, updates, backup.

## 4. Prerequisites and order
- For each feature list what must exist first: data model, storage, scaffolding, shared UI shell and tokens, settings, provider connections, auth, test setup, development fixtures (never shown as real data).
- Order: foundations → shared services → features → integration → polish → release. Independent features can run in parallel. Plan shared parts once.
- Put risky unknowns first (spikes) so later work rests on verified ground. The first visible, startable result comes early.

## 5. Decide, don't stall
- Make safe, reversible assumptions for everything unspecified and list them visibly. Use established defaults: the project's stack or a simple, well-supported one; local storage unless sharing is required.
- Ask only questions that change the plan significantly and are expensive to reverse (who the users are, paid services, legal obligations) — early, with 2–4 options and a recommendation, while independent work continues.
- Never ask about things good craft decides (colours, layouts, field and folder names, equivalent libraries).

## 6. Plan output
- Goal, chosen shape and why, assumptions, an ordered backlog of user-visible outcomes with acceptance criteria, dependency order, quality gates and a final end-to-end acceptance against the original goal.
- Each step names the files or areas it touches, what it delivers, how it is verified and what it builds on. Mark UI steps as frontend so design-craft and interface-review get applied.
- Size it to the goal: a small tool gets few steps. No "TBD", no step without a check.
- Someone who never saw the request must understand what will be built and why each step exists. When the work will be handed to another session or agent, write the plan to a file (e.g. `docs/PLAN.md`) with the exact next step at the top.
