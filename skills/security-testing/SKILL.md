---
name: security-testing
description: Authorized, defensive security testing of systems the user owns — web apps, APIs, desktop/Electron
  apps, services — to find, reproduce and fix vulnerabilities — scope, threat model, smallest non-destructive
  proof, fix, regression test, scored findings file and a release gate. Use for security reviews, hardening,
  threat modelling or auditing injection, XSS, CSRF, SSRF, auth, access control/IDOR, uploads, secrets,
  misconfiguration, rate limits and Electron IPC. Never for third-party targets, malware or detection evasion.
metadata:
  creator: Cadence project
  created: '2026-10-16'
  updated: '2026-10-22'
  origin: Defensive application-security method with a severity and findings validator; no attack tooling.
---

# Test your own systems before attackers do

Authorized, **defensive** testing of systems you own or operate, to find, reproduce and **fix** weaknesses. Every technique here exists to close a hole, always paired with a fix and a regression test.

**Hard boundary.** Only your own systems, in an environment you control, with authorization. No third-party targets, no malware, no evading or obfuscating detection. If a task asks for any of those, stop and say so.

**Use when:** a security review, audit, hardening pass, threat model, vulnerability hunt or pentest *simulation* of your own app/API/desktop app/service is requested, or a feature touches auth, authorization, uploads, secrets, external fetches, IPC, or money.
**Don't use when:** the target is not yours or authorization is unclear (ask first); the question is capacity/latency under load (→ load-stress-testing); the task is general code review without a security angle.

## Inputs you need first
1. **Scope and ownership:** exact systems, environments, data in bounds; written authorization if it is not plainly your own project.
2. **A controlled environment:** local or staging copy, synthetic data, isolated credentials and network, snapshot/teardown plan.
3. **Architecture facts:** entry points, trust boundaries, auth model, data stores, third-party integrations, dependency manifest.
4. **The severity threshold** that blocks release (default: `high` and `critical`).

## Output contract
- A **threat model** (assets, entry points, trust boundaries, abuse cases) written down.
- A **findings file** (`assets/severity-and-findings.md`, JSON or YAML list): stable ids, class, severity (score + band + factors), location, repro, fix, status, test, evidence — one record per finding, kept across runs and diffed by id.
- For every confirmed finding: the **fix** at the right layer and a **regression test** that fails on the old code and passes on the fixed code.
- The **release-gate result** from `scripts/severity.mjs validate findings.json` (fails if any `high`/`critical` finding is not `verified`, `accepted-risk` or `false-positive`). If your agent cannot run Node scripts, apply the formula and gate rules from the asset by hand.

## Method (repeat per target)
`Scope → Threat Model → Simulate → Confirm → Fix → Add test → Document`
1. **Scope** — name system, environment and data; confirm ownership; never destructive payloads against production or real user data.
2. **Threat model** — assets (data, credentials, money, model access, the user's files and shell on the host machine, availability) · entry points (HTTP params/body/headers, cookies, uploads, WebSocket/IPC, CLI args, env, filenames, deserialized blobs, webhooks, LLM/tool output) · trust boundaries (browser→server, renderer→main, app→OS shell, service→DB, code→dependency) · abuse cases ("as an attacker I … to get …") → your Simulate backlog.
3. **Simulate** — smallest **non-destructive** proof per class (catalog): a benign marker row, `{{7*7}}`, a non-alerting DOM probe, your *own* collector for SSRF/redirect. Snapshot first; log what you ran.
4. **Confirm** — input → observed wrong behaviour → why it is a defect. A scanner line is not a finding until reproduced.
5. **Fix** — at the right layer: validation at the boundary, encoding at the sink, authorization in the handler; framework-safe APIs over hand-rolled sanitizers; re-run the class across the codebase (the same mistake repeats).
6. **Add test** — regression test that reproduces the original attack and asserts it now fails safely.
7. **Document** — the finding record with severity factors, status lifecycle (`open → confirmed → fixed → verified`, or `accepted-risk` / `false-positive` with rationale), evidence by path (never raw secrets), linked to task/project. Run the validator.

## Classes to cover (skip only with a stated reason)

| Group | Classes |
|---|---|
| Injection | SQL, NoSQL, OS command, template (SSTI) |
| Auth & session | broken authentication, weak/guessable session, token handling |
| Authorization | broken access control, IDOR, privilege escalation / mass assignment |
| Client-side | XSS (stored / reflected / DOM), CSRF, open redirect |
| Server-side requests | SSRF, path traversal / LFI, zip-slip |
| Data handling | insecure deserialization, insecure file upload, secrets leakage |
| Config & supply chain | misconfiguration (debug, CORS, headers), vulnerable / compromised dependencies |
| Logic & timing | business-logic abuse, race conditions (TOCTOU, double-spend) |
| Robustness | missing rate-limiting / brute-force protection, DoS resilience of own endpoints (limits exist and hold) |
| Desktop / Electron | renderer hardening, IPC as entry point, navigation/CSP, filesystem and shell boundaries, secrets |

Per class — detect, simulate safely, fix pattern, regression test: `assets/vulnerability-catalog.md`.

## Severity (CVSS-like, reproducible)
Five factors 0–1 (`exploitability`, `impact_conf`, `impact_integ`, `impact_avail`, `scope`) →
`score = round((0.35·exploitability + 0.25·max(impact) + 0.15·mean(impact) + 0.25·scope) · 10, 1)` → band `critical ≥ 9.0 · high ≥ 7.0 · medium ≥ 4.0 · low > 0 · info = 0`. Always record the factors so the score is auditable; add a real CVSS vector when interoperability matters. `scripts/severity.mjs score …` computes it.

```yaml
id: SEC-0001
class: idor
severity: { score: 7.6, band: high, factors: { exploitability: 0.9, impact_conf: 0.9, impact_integ: 0.3, impact_avail: 0.1, scope: 0.6 } }
location: "GET /api/orders/{id} — src/api/orders.ts:42"
repro: "Auth as user A; request B's order id; 200 returns B's data."
fix: "Scope lookup to current user; 404 on mismatch."
status: verified
test: "test/api/orders.idor.spec.ts"
```

## Safe simulation rules (non-negotiable)
Environment you control, synthetic data · smallest proof (`' OR '1'='1` returning one marker row, never `DROP`) · no third-party targets (SSRF/redirect only to your own collector; dependency checks read advisories, never attack upstreams) · reversible and logged (snapshot before writes) · **no evasion** — you are testing to *see* problems, so never obfuscate payloads to beat your own logging or WAF · stop if a test could touch real users.

## Anti-patterns
Promoting scanner output to findings without reproduction · "fixed" with no regression test · patching one occurrence of a class and not searching for the rest · testing production because staging was inconvenient · severity typed by gut instead of factors · findings without stable ids (cannot be diffed across runs) · secrets or raw tokens pasted into evidence · treating a DoS robustness check as a load test (that is load-stress-testing's job).

## Done when
- [ ] Scope and ownership confirmed; only a controlled environment was touched.
- [ ] Threat model written: assets, entry points, trust boundaries, abuse cases.
- [ ] Every in-scope class covered or explicitly skipped with a reason.
- [ ] Each finding reproduced with the smallest non-destructive proof and scored from factors.
- [ ] Each confirmed finding has a fix **and** a regression test that fails on the old code.
- [ ] Findings file validates; release gate passes (or exceptions are `accepted-risk` with owner + rationale).
- [ ] No third-party system touched; no evasion used; no secrets in logs or evidence.

## Works with (library handoffs)
- **load-stress-testing** — you verify that limits (size, depth, timeout, rate) *exist*; it measures behaviour *at and beyond* them (soak, spike, breakpoint).
- **ab-testing** — experiment assignment and reward flows are business-logic abuse surfaces; security regressions are hard guardrails there, never weighted.
- **ai-app-engineering** — prompt-injection and tool-output-as-input belong on your entry-point list; it owns the agent architecture, you own the abuse cases and tests.
- **complete-app** — the regression tests and the findings file live in the project's test and docs folders; the release gate joins the acceptance checklist.

## Reference files (read on demand)
- `assets/vulnerability-catalog.md` — every class with safe simulation, detection, fix pattern and regression test, plus the desktop/Electron checklist.
- `assets/severity-and-findings.md` — severity factors and formula, bands, the full findings schema, status lifecycle, parse rules and the release gate.

Scripts (dependency-free Node ≥ 18; run in place or copy into the project):
- `scripts/severity.mjs score --exploitability 0.9 --conf 0.9 --integ 0.3 --avail 0.1 --scope 0.6` — score + band from factors.
- `scripts/severity.mjs validate findings.json [--gate high]` — schema, enum, band↔score and factor↔score consistency, lifecycle rules (`fixed`/`verified` need `test`, `accepted-risk` needs `notes` + `owner`), duplicate ids, and the release gate (exit 1 on failure).
