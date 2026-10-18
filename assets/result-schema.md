# Reproducible result — documentation format and machine-readable schema

The companion to `SKILL.md` §10. Two things: a fill-in documentation outline for humans, and a machine-readable JSON schema with a worked example. **The JSON is the contract an AI reads back** — same shape for the design (before data) and the final result (after data); fields unknown before launch are `null`.

## Documentation outline (human-readable)

1. **Title & ID**, owner, dates, status.
2. **Hypothesis** and the mechanism it proposes.
3. **Variants** and the exact parameters/variables/settings that differ.
4. **Criteria, weights and score mappings** — the locked scorecard (§3).
5. **Guardrails** and their thresholds.
6. **Design** — primary metric, MDE, α, power, sample size, duration, assignment, sequential method.
7. **What actually ran** — dates, exposures, A/A and SRM outcome.
8. **Results** — per-variant metric values, per-criterion scores, composite, statistics with intervals.
9. **Decision** — outcome, winning variant, confidence and the reasons for it.
10. **Follow-ups** / the next experiment.

## Machine-readable schema (JSON)

Field contract; types and allowed values are in the `//` comments (strip comments for strict JSON). Version it with `schema_version`.

```json
{
  "schema_version": "1.0",
  "experiment": {
    "id": "string",                 // stable slug
    "title": "string",
    "hypothesis": "string",         // falsifiable claim + direction + mechanism
    "type": "ab",                   // "ab" | "multivariate" | "bandit"
    "owner": "string",
    "created": "YYYY-MM-DD",
    "status": "designed"            // "designed" | "running" | "decided" | "aborted"
  },
  "unit": "user",                   // randomization & analysis unit
  "assignment": {
    "method": "hash",               // deterministic bucketing
    "salt": "string",
    "split": { "control": 0.5, "variant_b": 0.5 }   // must sum to 1
  },
  "variants": [
    { "id": "string", "name": "string", "is_control": true,
      "parameters": {},             // the exact settings that differ
      "allocation": 0.5 }
  ],
  "criteria": [                     // the weighted scorecard; weights sum to 1
    { "id": "string", "name": "string", "metric": "string",
      "direction": "increase",      // "increase" | "decrease"
      "weight": 0.0,
      "score_mapping": { "type": "linear", "min": 0.0, "max": 0.0 } }  // raw → 0..1
  ],
  "guardrails": [                   // vetoes, never weighted
    { "metric": "string", "direction": "decrease",
      "threshold": 0.0,
      "comparison": "must_stay_below",  // "must_stay_below" | "must_stay_above"
      "breached": null }            // boolean after data
  ],
  "design": {
    "primary_metric": "string",
    "mde": { "value": 0.0, "type": "absolute" },  // "absolute" | "relative"
    "alpha": 0.05,
    "power": 0.80,
    "sample_size_per_variant": 0,
    "planned_duration_days": 0,
    "sequential_method": "none"     // "none"|"obrien_fleming"|"pocock"|"msprt"|"bayesian_boundary"
  },
  "integrity": {
    "aa_test": { "run": false, "significant": null },
    "srm": { "expected": {}, "observed": {}, "chi_square": null, "p": null, "passed": null },
    "ran": { "start": null, "end": null, "full_cycle": null }
  },
  "results": {
    "per_variant": [
      { "id": "string", "exposures": 0,
        "metrics": {},              // metric name → observed value
        "scores": {},               // criterion id → 0..1 score
        "composite": 0.0 }          // Σ weight·score
    ],
    "primary_statistics": {
      "method": "two_proportion_z", // or "welch_t" | "mann_whitney" | "mcnemar" | "bootstrap"
      "effect": { "absolute_lift": 0.0, "relative_lift": 0.0 },
      "ci": { "level": 0.95, "low": 0.0, "high": 0.0 },
      "p_value": null,
      "bayesian": { "prob_b_beats_a": null, "credible_low": null, "credible_high": null, "expected_loss": null }
    },
    "multiple_comparison": { "method": "none", "adjusted": false }  // "bonferroni"|"benjamini_hochberg"|"none"
  },
  "decision": {
    "outcome": null,                // "ship_b" | "keep_a" | "inconclusive" | "iterate"
    "winning_variant": null,
    "confidence": null,             // "high" | "medium" | "low"
    "rationale": "string",
    "follow_ups": []
  }
}
```

## Filled example (arithmetic checked)

Score mapping is linear: `score = clamp((value − min) / (max − min), 0, 1)`. Composite `= Σ weight · score`.

```json
{
  "schema_version": "1.0",
  "experiment": {
    "id": "exp_2026_checkout_cta",
    "title": "Checkout CTA colour + copy",
    "hypothesis": "A higher-contrast CTA with action-oriented copy raises the checkout-start rate by >= 2 absolute points without harming the refund rate.",
    "type": "ab", "owner": "growth", "created": "2026-10-16", "status": "decided"
  },
  "unit": "user",
  "assignment": { "method": "hash", "salt": "exp_2026_checkout_cta", "split": { "control": 0.5, "variant_b": 0.5 } },
  "variants": [
    { "id": "control",   "name": "Current",        "is_control": true,  "parameters": { "cta_color": "var(--accent)",        "cta_copy": "Continue" },              "allocation": 0.5 },
    { "id": "variant_b", "name": "High-contrast",  "is_control": false, "parameters": { "cta_color": "var(--accent-strong)", "cta_copy": "Start secure checkout" }, "allocation": 0.5 }
  ],
  "criteria": [
    { "id": "checkout_start", "name": "Checkout-start rate",       "metric": "checkout_start_rate", "direction": "increase", "weight": 0.5, "score_mapping": { "type": "linear", "min": 0.10, "max": 0.16 } },
    { "id": "revenue",        "name": "Revenue per user",          "metric": "rev_per_user",        "direction": "increase", "weight": 0.3, "score_mapping": { "type": "linear", "min": 8.0,  "max": 12.0 } },
    { "id": "clarity",        "name": "Perceived clarity (survey)","metric": "clarity_score",       "direction": "increase", "weight": 0.2, "score_mapping": { "type": "linear", "min": 3.0,  "max": 5.0  } }
  ],
  "guardrails": [
    { "metric": "refund_rate",    "direction": "decrease", "threshold": 0.05, "comparison": "must_stay_below", "breached": false },
    { "metric": "p95_latency_ms", "direction": "decrease", "threshold": 1200, "comparison": "must_stay_below", "breached": false },
    { "metric": "contrast_ratio", "direction": "increase", "threshold": 4.5,  "comparison": "must_stay_above", "breached": false }
  ],
  "design": {
    "primary_metric": "checkout_start_rate",
    "mde": { "value": 0.02, "type": "absolute" },
    "alpha": 0.05, "power": 0.80,
    "sample_size_per_variant": 3843,
    "planned_duration_days": 14,
    "sequential_method": "none"
  },
  "integrity": {
    "aa_test": { "run": true, "significant": false },
    "srm": { "expected": { "control": 0.5, "variant_b": 0.5 }, "observed": { "control": 199880, "variant_b": 200120 }, "chi_square": 0.144, "p": 0.705, "passed": true },
    "ran": { "start": "2026-09-01", "end": "2026-09-15", "full_cycle": true }
  },
  "results": {
    "per_variant": [
      { "id": "control",   "exposures": 199880, "metrics": { "checkout_start_rate": 0.100, "rev_per_user": 9.1, "clarity_score": 3.6, "refund_rate": 0.031, "p95_latency_ms": 980,  "contrast_ratio": 4.8 }, "scores": { "checkout_start": 0.00, "revenue": 0.275, "clarity": 0.30 }, "composite": 0.1425 },
      { "id": "variant_b", "exposures": 200120, "metrics": { "checkout_start_rate": 0.124, "rev_per_user": 9.9, "clarity_score": 4.2, "refund_rate": 0.030, "p95_latency_ms": 1005, "contrast_ratio": 5.2 }, "scores": { "checkout_start": 0.40, "revenue": 0.475, "clarity": 0.60 }, "composite": 0.4625 }
    ],
    "primary_statistics": {
      "method": "two_proportion_z",
      "effect": { "absolute_lift": 0.024, "relative_lift": 0.24 },
      "ci": { "level": 0.95, "low": 0.022, "high": 0.026 },
      "p_value": 1e-12,
      "bayesian": { "prob_b_beats_a": 0.999, "credible_low": 0.022, "credible_high": 0.026, "expected_loss": 0.00005 }
    },
    "multiple_comparison": { "method": "none", "adjusted": false }
  },
  "decision": {
    "outcome": "ship_b",
    "winning_variant": "variant_b",
    "confidence": "high",
    "rationale": "Composite margin 0.4625 - 0.1425 = 0.32 >= M (0.05); primary significant at alpha 0.05 and P(B>A) = 0.999; all three guardrails intact; SRM passed; full business cycle ran.",
    "follow_ups": [ "Test copy independently of colour to attribute the lift", "Confirm on the mobile segment (pre-registered)" ]
  }
}
```

## How an AI reads it back

- Confirm `integrity.srm.passed == true` and `integrity.ran.full_cycle == true` before trusting anything; otherwise the result is void.
- Treat any `guardrails[].breached == true` as a **veto**: `decision.outcome` must not be `ship_b` for the breaching variant, whatever the composite says.
- Recompute `composite = Σ weight · score` per variant to audit `decision`; recompute each score from `metrics` and `score_mapping`.
- `decision.confidence` is only `high` when the statistics clear the pre-set bar (`p_value < alpha` or `prob_b_beats_a` ≥ threshold), the scorecard margin ≥ M, and every integrity check passed; downgrade to `medium`/`low` when one of those is weak.
- To chain the next experiment, read `decision.follow_ups` and the criteria where the winner scored low.
