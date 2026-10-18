# Result schema — machine-readable run output

Every load/stress run emits one structured object an AI, a dashboard or a CI gate can read without re-parsing prose. This file defines the schema, a worked example, the threshold defaults and the verdict rules.

## Schema (JSON)

```json
{
  "$schema": "takt:load-stress-testing/result@1",
  "scenario": "string — what was tested, e.g. 'checkout create under peak'",
  "target": {
    "environment": "staging | production-authorized",
    "app_version": "string (commit or tag)",
    "instance_class": "string — matches prod? true/false in notes"
  },
  "profile": "baseline | ramp | soak | spike | stress",
  "concurrency": {
    "model": "open | closed",
    "virtual_users": 0,
    "arrival_rate_per_s": 0,
    "think_time_ms": 0,
    "duration_s": 0
  },
  "data_volume": {
    "users": 0,
    "rows_per_table": { "projects": 0, "tasks": 0, "records": 0 },
    "distribution": "zipf | uniform | mixed — note skew"
  },
  "actions": [
    {
      "name": "login | password_reset | create_record | search | open_detail",
      "samples": 0,
      "p50_ms": 0, "p95_ms": 0, "p99_ms": 0,
      "ttfb_ms": 0,
      "error_rate": 0.0
    }
  ],
  "throughput_rps": 0,
  "error_rate": 0.0,
  "saturation": {
    "cpu_pct": 0, "mem_trend": "flat | rising", "db_connections_pct": 0, "io_pct": 0
  },
  "thresholds": {
    "p95_ms": 500, "p99_ms": 1000, "ttfb_ms": 200,
    "error_rate_steady": 0.001, "error_rate_spike": 0.01,
    "cpu_pct": 70, "db_connections_pct": 80
  },
  "verdict": "pass | fail",
  "root_cause_class": "none | architecture | infrastructure",
  "breakpoint": { "virtual_users": 0, "rps": 0 },
  "evidence": ["slow-query-log excerpt", "EXPLAIN output", "saturation chart ref"],
  "notes": "string"
}
```

Keep `data_volume.rows_per_table` keyed by the product's real hot tables. `breakpoint` is filled only for the `stress` profile.

## Worked example — a failing architecture result

```json
{
  "$schema": "takt:load-stress-testing/result@1",
  "scenario": "list user's tasks (dashboard landing)",
  "target": { "environment": "staging", "app_version": "e838bf1", "instance_class": "4vCPU/8GB — matches prod" },
  "profile": "ramp",
  "concurrency": { "model": "closed", "virtual_users": 20, "arrival_rate_per_s": 0, "think_time_ms": 3000, "duration_s": 300 },
  "data_volume": { "users": 50000, "rows_per_table": { "tasks": 480000 }, "distribution": "zipf" },
  "actions": [
    { "name": "open_detail", "samples": 1200, "p50_ms": 2100, "p95_ms": 6400, "p99_ms": 9800, "ttfb_ms": 6100, "error_rate": 0.04 }
  ],
  "throughput_rps": 7,
  "error_rate": 0.04,
  "saturation": { "cpu_pct": 35, "mem_trend": "flat", "db_connections_pct": 30, "io_pct": 20 },
  "thresholds": { "p95_ms": 500, "p99_ms": 1000, "ttfb_ms": 200, "error_rate_steady": 0.001, "error_rate_spike": 0.01, "cpu_pct": 70, "db_connections_pct": 80 },
  "verdict": "fail",
  "root_cause_class": "architecture",
  "breakpoint": { "virtual_users": 0, "rps": 0 },
  "evidence": ["EXPLAIN ANALYZE: Seq Scan on tasks (cost=0..48000 rows=480000)", "latency rose 40ms->6400ms from 10k->480k rows"],
  "notes": "Only 20 users and <500k rows, CPU/DB idle, yet 6.4s p95. Missing index on tasks(user_id). Architecture, not server size."
}
```

The tell: **low concurrency, low data, resources idle, latency enormous** ⇒ `architecture`. Adding server capacity would not help; an index on `tasks(user_id)` would.

## Threshold defaults

Interactive user actions, adapt per product but declare before the run:

| Key | Default | Meaning |
|---|---|---|
| `p95_ms` | 500 | 95th-percentile action latency ceiling |
| `p99_ms` | 1000 | 99th-percentile ceiling |
| `ttfb_ms` | 200 | Time to first byte ceiling |
| `error_rate_steady` | 0.001 | <0.1% errors under steady load |
| `error_rate_spike` | 0.01 | <1% errors during a spike |
| `cpu_pct` | 70 | Sustained CPU headroom limit |
| `db_connections_pct` | 80 | Pool-usage limit before cliff risk |

## Verdict decision rules (machine-applicable)

Apply in order; the first match wins.

1. **pass** — every action meets `p95_ms` and `p99_ms`, `error_rate` ≤ its threshold, no resource over its saturation limit, latency flat across data regimes, soak memory `flat`. ⇒ `root_cause_class = none`.
2. **fail / architecture** — thresholds missed **or** the server errored/crashed **while** `max(rows_per_table) < 500000` **and** `virtual_users ≤ 50` **and** no resource is saturated (cpu/db/io below limits). The bottleneck is the code/query/data model. ⇒ `root_cause_class = architecture`. (See the §G checklist in `method.md`.)
3. **fail / infrastructure** — thresholds met at low concurrency and flat across regimes, queries already indexed/paginated/cached, but thresholds miss **only** at high concurrency/high data **and** a resource is saturated (cpu ≥ limit, or db_connections ≥ limit, or io saturated). ⇒ `root_cause_class = infrastructure`. Scale out.
4. Otherwise **fail** with `root_cause_class` set to whichever layer the evidence points to; record why in `notes`.

A CI gate can treat `verdict != "pass"` as a failed check and route by `root_cause_class`: `architecture` ⇒ back to engineering; `infrastructure` ⇒ to capacity/ops.
