---
name: takt-coordination
description: Playbook for coordinators and orchestration in Cadence — think from the customer's goal to the process
  and only then to the team, choose the organization form (single company, supply chain, partnership, independent
  audit), staff companies with their own management, write trade contracts with counter-performance and keep many
  agents working in parallel without losing quality.
metadata:
  creator: Cadence project
  created: '2026-10-10'
  creation-method: Editorial Markdown guide written in the Cadence repository from the user's model of Cadence as
    a universe of agent companies (ADR-0037) and the shipped orchestration rules; no external template or executable
    scripts.
  purpose: 'Every coordinator in Cadence plans the same way: customer first, process before team, companies only
    where parts truly separate, and trade that always pays back. The result is a team and process that fit the goal,
    run in parallel and improve each other.'
  scope: Installation-wide; included with orchestration and coordination work (design turns, company management)
    in every connected project.
---

# Coordinating in the Cadence universe

**The picture:** the person is the **customer**. Agents work in **companies**. Each company has a **management** (a coordinator) and departments. Several companies are not wired together; they **trade**. Every delivery requires a **counter-performance** that makes the supplier better. The system admin sits next to the customer as an advisor and is not a company.

## Reference files (read on demand)
Call `takt_skill_reference` with `skill: "takt-coordination"` and one of these files when you need detail:
- `references/organization-forms.md` — decision guide per form with signals, anti-signals, staffing patterns and worked examples.
- `references/contracts-and-trade.md` — contract templates, good and bad counter-performances, trade flows per form, how Cadence books trade.
- `references/process-before-team.md` — the derivation chain from goal to staffing with checklists and a complete example.

## 1. Customer first
Before planning anything, write down for yourself:
- **Who** uses the result, in which situation, and what problem it solves for them.
- **What the customer will judge:** the three to five things they will try first. These become acceptance criteria and the final acceptance.
- **What they did not say but need:** settings, empty and error states, saving and restoring, help, start command, README, tests, accessibility, a real look. People describe goals, not specifications; completing them is your job.
- **What is unclear:** make safe, reversible assumptions and list them. Ask only what blocks the whole plan.

## 2. Process before team
Order of thinking (binding):
1. Goal from the customer's view.
2. Plan: small, independently verifiable work packages with deliverable, criteria, dependencies (only real ones).
3. Process: steps per package, independent reviews with bounded rework loops, research before risky work, release and final acceptance.
4. Organization: one company, or several where the process shows separable parts.
5. Departments (lanes) from the capabilities the steps need.
6. Staffing: reuse existing profiles in the home company; create specialists only for missing capabilities and say why.

Never shape the process around the team you happen to have. If the process needs a capability nobody has, create the role. If a role has nothing to do in this process, leave it out.

## 3. Choosing the organization form
Default is **single**. Use more than one company only when at least one of these holds:
- **Separable large parts** with a small, describable interface between them (web app + mobile app + platform; product + data pipeline). Few cross-dependencies, each part big enough for its own team.
- **A supplied building block** that another part consumes (API, component library, design system, importer) → **supply chain**.
- **Independence matters** for quality or security, or the customer wants a second opinion → **independent audit**.
- **The customer asks for it** ("as a partnership", "two companies", "with an independent audit").

Do not split when parts share most files, when the interface is not yet clear (do research first), or when the whole job is small. Respect the person's setting (automatic, single, preferred form, maximum count).

## 4. Companies and management
- `companies[0]` is always `home` with your own profile as coordinator.
- Every further company gets: a key `co-…`, a role (`supplier`, `partner`, `audit`), a one-sentence mission, its **own managing coordinator** among the new agents (roleKind `coordinator`, top level, no reportsTo) and its own specialists who report within the company.
- Assign the work packages of a company in `workPackageIds`; its steps must be executed by its own members. Existing profiles work for home.
- Keep companies lean: management plus the specialists the process really needs. Each extra company costs agents, steps and tokens.

## 5. Trade with counter-performance
- Every non-home company has at least one **contract**: `offer` (what it delivers) and `counter` (what it receives in return). Both concrete and checkable.
- Good pairs: interface specification ↔ integration feedback with failing calls; release candidate ↔ test report with findings; component library ↔ usage report with missing variants; research findings ↔ questions and decisions they unlocked.
- Bad pairs: "code ↔ thanks", "help ↔ support", anything a reviewer could not verify.
- Cadence books deliveries along the process automatically and demands the counter-performance from the receiving step. Plan steps so a delivery is a finished, usable result and the receiver has something concrete to report back.
- Use trade for parallelism: agree interfaces early (contract first, mocks allowed), let both sides build at the same time, integrate at a join, then exchange feedback.

## 6. Parallel work without chaos
- Independent packages run in parallel branches with different agents; dependent packages wait for their prerequisite and its review.
- Two agents never write the same files at the same time; split by component or file group.
- Every important result gets an independent review by another agent (another company for audits). Rework loops are bounded (1–3).
- Research first when technologies, interfaces or risks are unknown; never let implementation guess.
- Keep steps small enough to finish in the planning level's time box, but never as artificial micro-steps.

## 7. Memory and communication
- Record decisions, findings, risks and next steps others must know with `takt_memory_add`: with reason and source, at most three per task.
- Handover text is for the next agent: what is done, where, how to start and test it, what is open. No marketing.
- Questions to the customer only when a decision changes the outcome and no safe assumption exists; offer two to four options with consequences and a recommendation.

## Checklist before returning a design
- Customer goal, implicit needs and final acceptance are explicit.
- Every step traces to a package or gate; every package and gate appears in the process.
- Organization form fits the signals; settings respected; each company has management, members, steps and at least one contract.
- Parallel branches have different owners and separate files; reviews are independent; loops are bounded.
- New roles are justified and placed in the right company and department.
