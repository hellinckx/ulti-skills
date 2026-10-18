# Load & stress method — worked detail

Long-form companion to `SKILL.md`. Concrete volumes, an idempotent-seed pattern, a Playwright measurement sketch, every load profile with example numbers, the metric math, and the root-cause checklist. Numbers are **starting points to adapt**, not fixed law.

## A. Staging that matches production

| Must match | Why it changes results |
|---|---|
| DB engine **and version** | Planner and index behaviour differ across versions |
| Schema + migrations + **indexes** | A missing staging index gives a false slow result; an extra one gives a false fast one |
| Instance class / prototype machine | CPU, RAM and IO ceilings decide the breakpoint |
| Connection pool size, DB config | Pool and `work_mem`/buffers shape the cliff |
| App runtime + concurrency settings | Worker/thread counts cap throughput |

Mismatch is allowed only when you *deliberately* test a cheaper box to find its ceiling — and you label the result as that box, not production.

**Safety gate before any run:** target is staging (or prod with written consent + window + kill switch); data is synthetic only; credentials are isolated; teardown is planned; observability is on (app metrics, slow-query log, host saturation).

## B. Realistic data generation

### Volumes — bracket reality, then exceed it
Pick regimes from realistic 1–3 year growth and add one step beyond:

| Regime | Users | Rows per hot table | Proves |
|---|---|---|---|
| Small | ~10k | ~10k | Floor; should be instant |
| Medium | ~50k | ~100k | Real near-term scale |
| Large | ~200k | ~500k | The owner's architecture line |
| Beyond (optional) | 500k+ | 1M+ | Where infra scaling legitimately starts |

Seed **every table a user acts in** (projects, tasks, records, comments, attachments-metadata), not just the users table.

### Referential integrity
- Insert parents before children; use **real foreign keys** drawn from inserted parent IDs.
- Honour every constraint: unique, not-null, check, enum domains. A violated or bypassed constraint changes the plan the DB picks.
- Keep derived/denormalized fields consistent with their source, or you test a state production can never reach.

### Distributions — never uniform
Uniform-random data hides the problems that actually bite in production.

- **Ownership skew (Zipf / power-law):** most users own a handful of rows; a few own thousands. This is what surfaces the "one big account is slow" bug.
- **Temporal spread:** timestamps across the real time window, with daily/weekly peaks — not all `now()`.
- **Hot rows:** a small set of records that receive most reads (the landing dashboard, the popular project), so caching and lock contention get exercised.
- **Realistic field sizes:** real-length names, descriptions, tags — not `"xxx"`. Large text columns change IO and serialization cost.
- **Cardinality that matches prod:** status enums, category counts, tag fan-out — index selectivity depends on it.

### Idempotent seed pattern
A seed you cannot safely re-run is a liability. Make it converge, not duplicate:

```
seed(targetUsers, targetRowsPerTable):
  rng = deterministic(seed = 42)              # reproducible data
  existing = count(users)
  for i in existing .. targetUsers:           # top-up, don't restart
    batch.append(makeUser(rng, i))            # stable natural key per i
    if batch full (~1k–10k): bulkInsert(batch) in one transaction; batch.clear()
  flush(batch)
  # children reference real parent IDs; same top-up logic per table
```

- **Bulk, not row-by-row:** `COPY` (Postgres) or multi-row `INSERT`, 1k–10k rows per transaction. Row-at-a-time seeding of 500k rows wastes hours and tests nothing useful.
- **Deterministic:** fix the RNG seed so every environment gets the same data and bugs reproduce.
- **UPSERT or top-up:** `INSERT ... ON CONFLICT DO NOTHING`, or count-then-fill, so re-running tops up to target instead of duplicating.
- **Record progress:** store the last index/counts so an interrupted seed resumes.
- Disable non-essential indexes/triggers during a huge initial load, then rebuild — but **measure with the production index set in place.**

## C. Playwright measurement harness

Goal: time the **real user actions**, per data regime, and emit structured rows.

```js
// Sketch — adapt to the app. One measured action:
async function timed(page, name, action) {
  const t0 = await page.evaluate(() => performance.now());
  await action();                                  // the real user step
  const t1 = await page.evaluate(() => performance.now());
  // server view: TTFB from the response, or a Server-Timing header
  return { action: name, ms: t1 - t0, ts: Date.now() };
}

// Core paths to measure (adapt to the product):
//  login, send-password-reset, create-record, list/search, open-detail
const results = [];
results.push(await timed(page, 'login', () => login(page, user)));
results.push(await timed(page, 'create_task', () => createTask(page, data)));
results.push(await timed(page, 'search', () => search(page, 'term')));
// write results as JSON/CSV -> result schema
```

- **Per-action latency**: wrap each step; do not time a whole script as one number.
- **Server time + TTFB**: read Navigation Timing (`responseStart - requestStart`) or a `Server-Timing` response header; separate network from server.
- **Same path, three regimes**: run against the 10k / 100k / 500k databases and compare the curve (section E).
- **Think-time**: insert realistic pauses (`waitForTimeout` with jittered values) between actions so the profile matches human pacing, not a tight loop.
- **Concurrency**: Playwright with many parallel `browser.newContext()` gives UI-fidelity concurrency but is heavy; for raw RPS at hundreds/thousands of virtual users, pair it with **k6 / Locust / JMeter** hitting the API directly. Use Playwright for *feel*, the protocol tool for *volume*.
- **Warm-up**: discard the first few iterations (cold caches/JIT) or report them separately.

## D. Load profiles with example numbers

| Profile | Example setup | Pass signal |
|---|---|---|
| **Baseline** | 1 virtual user, system otherwise idle, 50 iterations/action | Establishes the latency floor; all percentiles tight |
| **Ramp-up** | 1→10→50→100→250→500 VUs, 2–5 min per step | Latency/error curve stays flat until a clear knee; note the knee |
| **Soak** | Hold expected peak (e.g. 150 VUs) for 30–120 min | Latency flat, memory flat, no pool exhaustion, error rate steady |
| **Spike** | Jump 10→2000 VUs in <30 s, hold 2–5 min, drop | Autoscaling reacts, few errors, fast recovery to baseline |
| **Stress** | Increase VUs until error rate >1% or p95 breaches SLA | Records the breakpoint (VUs/RPS); system sheds load gracefully, no data loss |

### Concurrency modelling
- **Little's Law:** `concurrent_users L = arrival_rate λ × avg_session_duration W`. To model "500 users each doing a 2-minute session arriving at 250/min" ⇒ `L = (250/60) × 120 ≈ 500` concurrent.
- **Open model** (fixed arrival rate, independent of responses) models the real world and viral spikes — the queue grows if the server slows. Prefer it for spike/stress.
- **Closed model** (fixed VU count, each waits for its response then thinks) models a known fixed user base. Think-time is mandatory or you overstate load.
- State the model, arrival rate / VU count, and think-time in every scenario; a number without them is not reproducible.

## E. Reading the data-regime curve

Plot each action's p95 against row count (10k → 100k → 500k):

- **Flat line** ⇒ indexed, bounded query. Healthy.
- **Linear rise** ⇒ full table scan or unpaginated read; latency ∝ rows. Add an index / paginate.
- **Super-linear / cliff** ⇒ N+1 amplified by data, or a join with no supporting index, or memory pressure. Fix the query shape.

This curve is the single most diagnostic artifact — it separates "slow because unindexed" from "slow because overloaded."

## F. Metric math

- **Percentiles**: sort the latency samples; p95 = value at the 95th-percentile index. Report p50/p95/p99 per action. **Never report only the mean** — one slow 1% ruins the experience the mean hides.
- **Throughput (RPS)**: completed requests ÷ wall-clock seconds, at a stated concurrency. Required RPS ≈ expected peak concurrent actions ÷ average action time.
- **Error rate**: failed ÷ total (count HTTP 5xx, timeouts, and wrong results — a fast wrong answer is still an error).
- **Saturation (the USE method)**: for each resource (CPU, RAM, IO, DB connections, network), watch **U**tilization, **S**aturation (queue depth) and **E**rrors. The first resource to saturate is the bottleneck.
- **TTFB**: `responseStart − requestStart`. Rising TTFB under load = server-side queuing, not network.

## G. Root-cause checklist (architecture first)

When thresholds miss at **low data (<500k rows) and low concurrency**, it is the software. Check, in order:

1. **Missing index** — `EXPLAIN (ANALYZE)` shows a Seq Scan on a big table; latency rose with row count.
2. **N+1 queries** — request count explodes with result size; one list view fires hundreds of queries.
3. **No pagination** — endpoint returns/loads the whole table; memory and payload grow with data.
4. **No caching** — identical hot read recomputed every request; add a cache with correct invalidation.
5. **Unbounded joins / Cartesian blow-up** — row count multiplies across joins.
6. **Serialization cost** — huge JSON blobs built on the request path.
7. **Synchronous side-work** — email/PDF/export done inline instead of queued.
8. **Connection pool** — too small (requests queue for a connection) or leaked (connections never returned).
9. **Locking / contention** — hot-row updates serialize; long transactions block.

Only when 1–9 are clean, latency is flat across regimes, and thresholds miss **only** at high concurrency/data does it become **infrastructure**: vertical scale, read replicas, load balancer, horizontal autoscaling, a connection pooler (PgBouncer), CDN, write queue/backpressure. That is when spending on servers is the right move — not before.

## H. Cross-references

- **security-testing** — the same load lens applied to hostile traffic: rate-limiting, DoS robustness, graceful degradation, resource-exhaustion defence.
- **ab-testing** — when two builds show different latency, decide whether the difference is real (significance) before acting on it.
