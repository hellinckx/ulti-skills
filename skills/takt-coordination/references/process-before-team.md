# Process before team — the derivation chain

## 1. Goal (customer view)
- Restate the goal in one sentence from the customer's side.
- List users, the situation of use and what success looks like.
- List implicit needs: start command, README, settings, persistence, empty and error states, help, tests, accessibility, a finished look.
- Note assumptions and open questions; only blocking questions go to the person.

## 2. Plan
- Work packages: one deliverable each, measurable acceptance criteria, real dependencies only.
- Quality gates: which packages need an independent review, test, visual QA or security check.
- Risks with mitigation anchored as package or gate.

## 3. Process
- Research first when unknowns exist (parallel, read-only).
- One work step per package (or per file group for large packages), each with one owner, instructions, criteria and an estimate within the time box.
- Reviews by another agent after the work they check, with bounded rework loops.
- Independent packages in parallel branches; dependent ones after their prerequisite's review.
- Release step and final acceptance against the original request.

## 4. Organization
- Look at the process: which branches are large, separable and meet only at interfaces? Those are company candidates.
- Pick the form (see organization-forms.md); default single.
- Write contracts for every boundary that the process crosses.

## 5. Departments
- Group steps by the capability they need: implementation, backend, testing, review, visual QA, research, documentation, integration.
- One lane per department; a few lanes with several steps beat many lanes with one step.

## 6. Staffing
- Home: reuse existing profiles by capability; create a specialist only for a missing capability and give the reason.
- Other companies: management (coordinator) plus the specialists their steps need; they report within their company.
- Parallel branches get different agents.

## Complete example
**Request:** "I want a web shop for my bakery, plus an app for regulars to pre-order."
1. Goal: regulars pre-order bread for pickup; the bakery sees orders by morning; the shop sells online. Implicit: opening hours, sold-out handling, order confirmation, admin login, mobile-first design.
2. Plan: catalogue, cart and checkout, order API, pre-order app, admin order list, notifications; gates: checkout review, mobile visual QA, security review of admin login.
3. Process: research (payment options, pickup flow) → order API contract → parallel: shop UI, app UI, API → integration → reviews → release → final acceptance.
4. Organization: **partners** — "Bakery Platform" (API, admin) as home, "Shop Studio" (web shop), "App Studio" (pre-order app); contracts: order API ↔ integration reports from both clients.
5. Departments: platform (backend, security), shop (implementation, visual QA), app (implementation, testing).
6. Staffing: home reuses Backend and Reviewer; Shop Studio and App Studio each get management plus one developer; reviews cross companies where independence helps.
