---
name: load-stress-testing
description: Prove whether an app survives real users and real data before launch — build a production-like staging,
  seed realistic data at volume into a real database, drive core user paths with a measured Playwright harness,
  run baseline / ramp / soak / spike / stress profiles, read p50/p95/p99 latency, throughput, error rate and saturation
  against thresholds declared before the run, and pin a failure to the right layer (architecture/data-model vs infrastructure,
  the under-500k-rows rule) in a machine-readable verdict. Use for any load, stress, performance, scalability, latency,
  throughput, capacity, soak, spike or benchmark task, for "will it scale?", and before a marketing or broadcast
  push. Do not use for functional testing, for security robustness checks (security-testing verifies limits exist;
  this skill measures behaviour at and beyond them), or against production without written consent.
metadata:
  creator: Cadence project
  created: '2026-10-16'
  creation-method: Editorial Markdown guide written in the Cadence repository. Distils accepted load- and performance-engineering
    practice (realistic data generation, open/closed concurrency models, Little's Law, latency percentiles, the
    USE method, the architecture-vs-infrastructure diagnosis) into an adaptable method, a Playwright measurement
    pattern, a machine-readable result schema and a dependency-free Node script that computes percentiles and applies
    the verdict rules. Revised 16.10.2026 to the library's operating structure.
  purpose: Give every app Cadence builds a deliberate way to find out, before launch, whether it holds under production-like
    data and concurrent load — and to decide whether to refactor or to buy servers, with evidence.
  scope: Installation-wide; attached to load, stress, performance, scalability and capacity tasks in every connected
    project. Owns the load/performance method and the verdict; security-testing owns hostile-input robustness, ab-testing
    decides whether two measured results differ.
---

# Prove it holds under load

An app that works for one developer on an empty database says nothing about launch day. **The only way to know is to test it** — production-like data volume, concurrent users, real measurement, thresholds set in advance.

**Use when:** before any launch or marketing/broadcast push, after a data-model or infrastructure change, when someone claims "it'll scale", when a page "feels slow", when choosing between refactoring and bigger servers.
**Don't use when:** the question is functional correctness (ordinary tests), hostile-input robustness (→ security-testing), or the only available target is production and there is no written consent, window and kill switch (then stop).

## Inputs you need first
1. **The app's hot paths** (login, password reset, create record, list/search, open detail) and its hot tables.
2. **Expected scale:** users and rows at 1–3 years, expected peak concurrent users, and the *spike* scenario (campaign, TV, viral).
3. **Production shape:** DB engine + version, schema/indexes, instance class, pool sizes, runtime concurrency settings — to mirror in staging.
4. **Thresholds** the product commits to (defaults below) and who signs them off.
5. **Observability access:** app metrics, DB slow-query log, host saturation (CPU / RAM / IO / connections).

## Output contract
- A **production-like staging** with a documented safety gate (synthetic data only, isolated credentials, teardown).
- **Idempotent seed scripts** that wrote realistic data into the real staging DB at ≥ 3 regimes (~10k / ~100k / ~500k rows per hot table).
- A **Playwright timing harness** emitting one structured row per action per regime per profile.
- One **result record per run** (`assets/result-schema.md`, JSON): scenario, target, profile, concurrency model, data volume, per-action p50/p95/p99/TTFB/error rate, throughput, saturation, thresholds, `verdict`, `root_cause_class`, breakpoint, evidence.
- `scripts/verdict.mjs percentiles` turns raw latencies into p50/p95/p99; `scripts/verdict.mjs verdict run.json` applies the decision rules and compares with the recorded verdict (exit 1 on fail). In Cadence sessions (scripts not exposed) apply the rules from the asset by hand.

## Method
1. **Staging that matches production by design** — same DB engine and version, schema, migrations, **indexes**, instance class (or the prototype machine), pool/config, runtime concurrency. A smaller box only describes that box; label it. **Never load-test production without written consent, a window and a kill switch.** Isolate, synthetic data only, observability on.
2. **Generate realistic data into the real DB** — scripts insert real rows (not mocks): 30k–200k users, 100k+ rows in every table users act in, three regimes to plot latency against row count; real foreign keys and constraints; **non-uniform distributions** (Zipf ownership, temporal spread, hot rows, real field sizes, prod-like cardinality); idempotent (deterministic RNG, bulk `COPY`/multi-row inserts 1k–10k per transaction, top-up/UPSERT, resumable). Measure with the production index set in place.
3. **Measure core user paths with Playwright** — wrap each action (`performance.now()`, Navigation Timing / `Server-Timing` for server time, TTFB from the response); same path at 10k / 100k / 500k; think-time between actions; warm-up discarded; Playwright for UI-path *feel*, a protocol driver (k6 / Locust / JMeter) for raw *volume*; every measurement a structured row.
4. **Run the profiles in order:** baseline (1 user, floor) → ramp-up (find the knee) → soak (30–120 min: leaks, pool exhaustion, GC) → spike (N× peak instantly: does autoscaling react, does it recover) → stress to breakpoint (where SLA breaks; graceful shedding, no data loss). Model concurrency honestly: `L = λ × W` (Little's Law); state open vs closed model and think-time in every scenario.
5. **Compare against thresholds declared before the run** (table below); percentiles, never only averages; per action, per regime, per profile.
6. **Diagnose the layer** — the <500k-rows rule (below); work the architecture checklist first; call it infrastructure only when the code is clean and thresholds miss only at high concurrency/data with a saturated resource.
7. **Record the verdict** (schema), attach evidence (slow-query log, `EXPLAIN ANALYZE`, saturation charts), and route: `architecture` → engineering, `infrastructure` → capacity/ops.

Worked volumes, the idempotent-seed pattern, the harness sketch, profile numbers, metric math and the root-cause checklist: `assets/method.md`.

## Thresholds (defaults — adapt, but declare before the run)

| Metric | Default (interactive action) | Why |
|---|---|---|
| p50 / p95 / p99 latency | ≤ 200 / 500 / 1000 ms | typical feel / the tail most users hit / worst common case |
| TTFB | ≤ 200 ms | server not stalling before first byte |
| Error rate | < 0.1 % steady, < 1 % spike | correctness under load |
| Throughput | ≥ required peak RPS | from expected concurrent users ÷ action time |
| CPU | < 70 % sustained | headroom for bursts |
| DB connections | < 80 % of pool | pool exhaustion is a cliff, not a slope |
| Memory over soak | flat | a rising line is a leak |

## The decisive rule: architecture vs infrastructure
> If a single action takes many seconds, or the server crashes, **while every hot table is still under ~500,000 rows and only a handful of users are active, it is an architecture / data-model / software problem — not a server-sizing problem.** A correctly indexed relational database answers point and range queries on 500k rows in milliseconds on modest hardware.

Architecture culprits, in order: missing index (latency climbs with row count) · N+1 queries · no pagination · no caching of hot reads · unbounded joins · heavy serialization on the request path · synchronous side-work · connection pool too small or leaked · lock contention. **Infrastructure only when** queries are indexed/paginated/cached, latency is flat across regimes, and thresholds miss *only* at high concurrency/data with a saturated resource — then scale: vertical, read replicas, load balancer, autoscaling, connection pooler (PgBouncer), CDN, write queue/backpressure.

**The broadcast-spike lesson.** A TV feature sent millions of viewers at once; a fraction became thousands of simultaneous shoppers; one small web server dropped connections and the orders were lost. Plan for the concurrent peak, not the daily average, and prove with the spike profile that autoscaling reacts in time. *Your startup might succeed — at least make sure it doesn't fall over at 30 users.*

## Anti-patterns
Load-testing an empty or ten-row database · uniform random seed data that hides skew and hot rows · timing a whole script as one number · reporting averages · thresholds decided after seeing the results · one profile only · testing a smaller box and calling it production · buying servers before checking indexes and N+1 · load-testing production "quickly" · running without observability (a failure you can't see you can't diagnose).

## Done when
- [ ] Staging mirrors production design; production untouched without consent.
- [ ] Real staging DB seeded with realistic, referentially intact data at ≥ 3 regimes incl. ~500k on hot tables.
- [ ] Core user paths measured per regime and profile with percentiles; think-time and concurrency model stated.
- [ ] All five profiles run; the knee, soak stability, spike recovery and breakpoint recorded.
- [ ] Thresholds were declared before the run and compared.
- [ ] Verdict pins the layer with evidence (`EXPLAIN`, slow-query log, saturation); `verdict.mjs` agrees with the record.
- [ ] Result emitted in the machine-readable schema and routed to the right owner.

## Works with (library handoffs)
- **security-testing** — verifies that limits (size, depth, timeout, rate) exist; you measure behaviour at and beyond them and the recovery.
- **ab-testing** — decides whether two builds' latency distributions really differ before anyone acts on it; your metrics become its primary/guardrail inputs.
- **ai-app-engineering** — model/tool latency and token cost are load dimensions of AI features; it owns the architecture, you own the measurement.
- **project-structure / complete-app** — seed scripts, the harness and result records live in the project's test/ops structure; a passing verdict joins the release acceptance.

## Reference files (read on demand)
Read the following files directly from this skill folder:
- `assets/method.md` — staging checklist, data volumes and distributions, the idempotent-seed pattern, the Playwright harness, profiles with numbers, concurrency modelling, metric math (percentiles, RPS, USE), the root-cause checklist.
- `assets/result-schema.md` — the result JSON schema, a worked failing-architecture example, threshold defaults and the machine-applicable verdict rules.

Scripts (run in Claude/Codex or copy into the project; dependency-free Node ≥ 18):
- `scripts/verdict.mjs percentiles latencies.(csv|json) [--key ms]` — count, mean, p50/p95/p99, min/max from raw latencies (linear interpolation).
- `scripts/verdict.mjs verdict run.json [--json]` — applies the verdict rules to a result record, reports which thresholds and rules fired, compares with the recorded `verdict`/`root_cause_class`; exit 1 on fail or mismatch.
