# Severity and the machine-readable findings schema

Long-form companion to `SKILL.md`. Defines (A) a CVSS-like severity so any two findings compare on the same scale, and (B) the structured record every finding is written as, so an AI or tool can parse, track, diff and close them. Keep records terse and stable; the goal is machine-readable, not prose.

---

## A. Severity (CVSS-like, 0.0–10.0)

Score each finding on five factors, 0–1 each, then map to a 0–10 score and a band. This is a lightweight stand-in for full CVSS 3.1/4.0 — use the real CVSS vector when you need interoperability, but always record a number and a band.

| Factor | Meaning | Low → High (0 → 1) |
|---|---|---|
| `exploitability` | How hard to trigger | needs local/privileged access & timing → trivial remote, unauthenticated |
| `impact_conf` | Confidentiality hit | none → full data/secret disclosure |
| `impact_integ` | Integrity hit | none → arbitrary data/code modification |
| `impact_avail` | Availability hit | none → full outage |
| `scope` | Blast radius | single user/record → whole system / other principals / host |

**Score** = `round( (0.35·exploitability + 0.25·max(impact_*) + 0.15·mean(impact_*) + 0.25·scope) · 10 , 1)`.
Use `max(impact_*)` so a single catastrophic impact dominates, and `mean` to reward breadth.

**Bands:**

| Band | Score | Response |
|---|---|---|
| `critical` | 9.0–10.0 | fix now; block release |
| `high` | 7.0–8.9 | fix this cycle; block release of the affected area |
| `medium` | 4.0–6.9 | schedule; track to closure |
| `low` | 0.1–3.9 | fix opportunistically / document as accepted risk |
| `info` | 0.0 | hardening note, no vulnerability |

Record the factor values so the score is reproducible and auditable:

```yaml
severity:
  score: 7.6
  band: high
  factors: { exploitability: 0.9, impact_conf: 0.9, impact_integ: 0.3, impact_avail: 0.1, scope: 0.6 }
  cvss: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N"   # optional, when interoperability is needed
```

Adjust for the real environment: a weakness reachable only from a trusted internal network scores lower on `exploitability`; one on an internet-facing, unauthenticated path scores higher. State the assumption in `notes`.

---

## B. Findings schema

One record per finding. YAML shown; JSON is equivalent (same keys). Required fields first.

### Fields

| Field | Req | Type | Notes |
|---|---|---|---|
| `id` | ✓ | string | Stable unique id, e.g. `SEC-0001`. Never reused or renumbered — findings are diffed across runs by id. |
| `title` | ✓ | string | One line, human-readable. |
| `class` | ✓ | enum | Taxonomy token from the catalog (see list below). |
| `severity` | ✓ | object | `{ score, band, factors, cvss? }` from section A. |
| `location` | ✓ | string | Where it lives: route + `file:line`, or component/IPC channel. |
| `repro` | ✓ | string | Smallest non-destructive steps that prove it, including the input and the observed wrong behavior. |
| `fix` | ✓ | string | The applied/intended fix, at the right layer. |
| `status` | ✓ | enum | Lifecycle below. |
| `test` | ✓* | string | Path/id of the regression test. Required once `status ≥ fixed`. |
| `asset` | – | string | The protected asset at risk (from the threat model). |
| `entry_point` | – | string | Where untrusted input enters. |
| `trust_boundary` | – | string | Which boundary it crosses. |
| `evidence` | – | string[] | Pointers to logs/snapshots/screenshots — never raw secrets. |
| `discovered` | – | date | ISO date. |
| `owner` | – | string | Who owns the fix. |
| `task` / `project` | – | string | Optional links to the task and project id in your tracker. |
| `references` | – | string[] | CWE/OWASP/CVE ids. |
| `notes` | – | string | Environment assumptions, scope caveats, accepted-risk rationale. |

`*` conditionally required.

### `class` enum (catalog taxonomy)

```
sql-injection · nosql-injection · command-injection · template-injection ·
broken-authentication · weak-session ·
broken-access-control · idor · privilege-escalation ·
xss · csrf · open-redirect ·
ssrf · path-traversal ·
insecure-deserialization · insecure-file-upload · secrets-leakage ·
misconfiguration · vulnerable-dependency ·
business-logic-abuse · race-condition ·
missing-rate-limit · dos-resilience
```

### `status` lifecycle

```
open → confirmed → fixed → verified
                      ↘ accepted-risk      (documented, not fixed — needs rationale + owner)
          ↘ false-positive                 (could not reproduce — keep the id, record why)
```

- `open` — suspected (e.g. from a scan or review); not yet reproduced.
- `confirmed` — reproduced with a concrete repro. **A finding is only real at this stage.**
- `fixed` — fix applied; `test` must be present.
- `verified` — regression test is green on fixed code and was shown to fail on the old code; re-tested against the original repro.
- `accepted-risk` — consciously not fixed; requires `notes` (why) and `owner`.
- `false-positive` — investigated, not a real defect; keep the id so it isn't re-reported.

A finding is not "done" until `verified` or an explicit `accepted-risk`/`false-positive`.

### Full example

```yaml
- id: SEC-0001
  title: Order endpoint returns other users' orders (IDOR)
  class: idor
  severity:
    score: 7.6
    band: high
    factors: { exploitability: 0.9, impact_conf: 0.9, impact_integ: 0.3, impact_avail: 0.1, scope: 0.6 }
  asset: customer order data
  entry_point: "GET /api/orders/{id} path parameter"
  trust_boundary: browser → API server
  location: "GET /api/orders/{id} — src/api/orders.ts:42"
  repro: "Auth as user A (synthetic). Request an order id owned by user B. Response 200 returns B's order JSON."
  fix: "Scope lookup to current user (where owner_id = session.userId); return 404 on mismatch."
  status: verified
  test: "test/api/orders.idor.spec.ts"
  evidence: ["logs/sec-0001-repro.txt"]
  discovered: 2026-10-16
  owner: backend
  references: ["CWE-639", "OWASP-A01"]
  notes: "Internet-facing, authenticated path; exploitability high."
```

### Parse rules (for tooling)
- The findings file is a YAML/JSON list under a top-level `findings:` key (or a JSON array).
- `id` is the primary key; merge across runs by `id`.
- `class` must be one of the enum tokens; `band` must match `score` per the table.
- Treat a finding as actionable when `status` ∈ {`confirmed`, `fixed`} and `band` ∈ {`medium`, `high`, `critical`}.
- Release gate: fail if any `status` ≠ `verified`/`accepted-risk`/`false-positive` with `band` ∈ {`high`, `critical`}.

Keep secrets and raw tokens out of every field — reference evidence by path, never inline.
