---
name: ab-testing
description: Design, run, analyse and decide A/B, split and multivariate experiments scientifically — for whole
  apps, single features, or AI systems (prompts, models, parameters) — and emit a pre-registered, machine-readable
  result an AI can audit. Lock hypothesis, primary metric, guardrails and weighted criteria BEFORE data; size for
  power and MDE; check A/A and sample-ratio mismatch; analyse frequentist and Bayesian with effect sizes and intervals;
  avoid peeking or use valid sequential methods. Use whenever two or more variants are compared or someone asks
  whether a change is really better (experiment, split test, variant, conversion, metric, significance, eval set,
  prompt comparison). Do not use for pure load or security measurement (load-stress-testing, security-testing supply
  those metrics) or for a one-off descriptive report with no comparison.
metadata:
  creator: Cadence project
  created: '2026-10-16'
  creation-method: Editorial Markdown guide written in the Cadence repository. Experiment-design method condensed
    from accepted causal-inference, frequentist and Bayesian A/B-testing and ML-evaluation practice; a machine-readable
    JSON result schema; dependency-free Node scripts for sample size, analysis, SRM and result auditing. Revised
    16.10.2026 to the library's operating structure.
  purpose: Give every comparison Cadence runs — product features, whole apps, or AI systems — a pre-registered,
    statistically honest decision instead of dashboard-watching and after-the-fact storytelling, recorded so another
    agent can audit or chain it.
  scope: Installation-wide; attached to experiment, A/B, split-test, variant, metric, conversion and significance
    tasks in every connected project. Owns the experiment method and the decision; load-stress-testing, security-testing,
    color-system, web-design-craft and design-craft supply the variants and their measurements.
---

# Experiments that decide, not dashboards that reassure

An A/B test is a **pre-registered decision rule**. Decide what "better" means and how much each part counts **before** a single result exists; after launch there is only execution and arithmetic.

**Use when:** two or more variants (features, whole apps, prompts/models/parameters, designs, configs) must be compared and a decision made; someone claims "B is better".
**Don't use when:** there is no comparison (descriptive analytics), the metric is produced by another skill and only needs reading (then feed it here), or the decision is a hard safety/correctness requirement (that is a guardrail, not a trade-off).

## Inputs you need first
1. **The decision at stake** and who makes it; what outcome would change behaviour (that sets the MDE).
2. **Variants and the exact parameter(s) that differ** — nothing else may change mid-test.
3. **Traffic / item volume** available and the business cycle length (seasonality).
4. **Metrics you can actually measure**, their baselines and variance (history or a pilot).
5. **Must-not-harm constraints** (latency, cost, error rate, accessibility, security) → guardrails.

## Output contract
- **Pre-registration** (before launch): hypothesis, variants + parameters, unit, assignment, primary + guardrail metrics, **weighted criteria with score mappings**, MDE, α, power, sample size, duration, decision rule — written as the `designed` state of the result schema.
- **Result** (after): the same JSON (`assets/result-schema.md`) filled with integrity checks, per-variant metrics/scores/composite, statistics with intervals, Bayesian summary, guardrail status, decision + confidence + rationale — plus a human write-up.
- `scripts/sample-size.mjs` sizes the test; `scripts/analyze.mjs` runs the z/t tests, Bayesian comparison, SRM check and **audits a result file** (recomputes scores, composite, guardrails, integrity). In Cadence sessions (scripts not exposed) use the formulas in `assets/experiment-method.md`.

## Method
1. **Hypothesis with mechanism:** "Changing X to V moves primary metric P by ≥ MDE without harming guardrails G, because …".
2. **Criteria → weights → score mappings** (the scorecard, §3). Lock them. Guardrails are vetoes, never weights.
3. **Design:** randomization unit (user / session / device / account / request / eval item — smallest that avoids interference), deterministic assignment `hash(unit_id + salt) → bucket`, primary metric, MDE from decision relevance, α (0.05) and power (0.80–0.90) → **n per variant** (`sample-size.mjs`), duration ≥ one full business cycle, the sequential method if any, multiple-comparison correction if > 2 arms or > 1 metric.
4. **Pre-register** by writing the `designed` result record. Nothing after this may be edited except the result fields.
5. **Run with integrity checks:** A/A sanity, **SRM** (`analyze.mjs srm`; p < 0.001 → void), no mid-flight changes, full duration.
6. **Analyse once** (fixed horizon) or with a valid sequential method: effect size with CI (frequentist) and P(B>A), credible interval, expected loss (Bayesian); paired tests for item-level AI evals.
7. **User-analysis layer:** fold quantitative behaviour and qualitative signal into scored criteria (§7) — never let an anecdote silently override the scorecard, never let the scorecard ignore it.
8. **Decide by the locked rule,** write both artefacts, run `analyze.mjs audit` on the result, list follow-ups.

## 3. The weighted scorecard — define "better", then weight it
1. List criteria: metric + direction + how measured (quantitative *and* user-analysis signals).
2. Weights sum to 1, locked before data.
3. Explicit **score mapping** raw → 0..1 (linear min/max or threshold) per criterion; without it a latency in ms cannot be combined with a rate in %.
4. `composite = Σ weight × score` per variant.
5. Guardrails veto regardless of composite.
Decision template: *ship B if composite(B) − composite(A) ≥ M **and** the primary metric clears the pre-set statistical bar **and** no guardrail is breached.* Fill M and the bar before launch.

## 4. Design details that decide validity
- **MDE** from what would change the decision, never from hope. If the resolvable effect at available traffic is larger than any decision-relevant effect, the test cannot answer — don't run it as-is (`sample-size.mjs --n`).
- **Power:** proportions `n = (z₁₋α/₂ + z₁₋β)² · 2 p̄(1−p̄) / δ²`; means `n = (…)² · 2σ² / δ²`; > 2 arms → α/(arms−1) (Bonferroni) and cost grows faster than linearly.
- **Variance reduction (CUPED)** with a pre-period covariate buys power honestly (ρ = 0.5 → 25 % less sample).

## 5. Integrity before analysis
A/A arms show no persistent difference · **SRM** chi-square of observed vs planned split passes · ran ≥ one business cycle (novelty/primacy absorbed) · no variant, allocation or instrumentation change mid-flight · bots and duplicates filtered identically across arms.

## 6. Analyse — two lenses, one honest answer
- **Frequentist:** two-proportion z (rates) or Welch t (means); report point estimate, CI, p vs pre-set α; relative + absolute lift; Cohen's h / d for cross-metric comparison. Significance ≠ practical significance.
- **Bayesian:** Beta-Binomial posteriors; P(B > A), credible interval of the lift, **expected loss** vs a pre-set threshold — usually the most direct "ship?" answer.
- **Peeking:** fixed horizon = analyse once. Continuous monitoring only with group-sequential α-spending (O'Brien–Fleming, Pocock) or always-valid confidence sequences (mSPRT). Repeated p < 0.05 checks inflate false positives toward ~30 %.
- **Multiple comparisons:** Bonferroni or Benjamini–Hochberg; non-pre-registered segments are hypothesis generation only.

## 7. The user-analysis layer
Quantitative behaviour (funnels, drop-off, retention, task completion, rage clicks, time-to-task) and qualitative signal (replays, tickets, surveys, interviews, preference votes) become **scored criteria with weights** (e.g. a clarity score 1–5 mapped linearly). Gather the usability signal with usability-review; weight it here.

## 8. A/B testing AI systems
Prompts, models and parameters are variant **parameters**; the eval set is the traffic. Representative, versioned eval set with a **locked holdout**; metric layers: deterministic (exact/regex, pass@k, tool-call validity, latency, tokens, cost) + rubric (3–6 anchored dimensions) + pairwise preference. LLM-as-judge needs order randomization, blinding, length control and calibration against human labels (report κ). Items run through every variant → **paired** tests (McNemar / paired-t / Wilcoxon) with bootstrap CIs; cost and latency are guardrails; report on the holdout.

## 9. Multivariate and bandits
Full factorial measures interactions but needs traffic per cell; fractional factorial screens main effects cheaply; bandits (Thompson sampling, UCB) minimise regret during optimisation at the cost of clean causal estimates — use a fixed A/B for one-time, high-stakes decisions.

## Anti-patterns
Peeking and stopping at p < 0.05 · HARKing (choosing metric/segment after data) · no guardrails · re-weighting after results · underpowered tests or 16-cell MVTs on thin traffic · segment mining · reading before a full cycle · ignoring SRM · reporting a bare p-value or "winner" without effect size and interval · Simpson's paradox across pooled segments · interference between units · survivorship · trusting a surprisingly good number without checking the pipeline (Twyman's law).

## Done when
- [ ] Hypothesis, primary metric, guardrails, criteria **and weights** locked before data (the `designed` record exists).
- [ ] MDE from decision relevance; n and power computed and reachable within the planned duration.
- [ ] Deterministic assignment; A/A and SRM passed; full cycle ran; nothing changed mid-flight.
- [ ] Effect size with CI (and Bayesian P(B>A) / expected loss) reported, not a bare p-value.
- [ ] Peeking avoided or a valid sequential method used; multiple comparisons corrected.
- [ ] User-analysis signal folded into the scorecard.
- [ ] Decision follows the locked rule; no guardrail breached; `analyze.mjs audit` reports `consistent`.
- [ ] Human write-up and machine-readable result both written; follow-ups listed.

## Works with (library handoffs)
- **load-stress-testing** — produces p50/p95/p99, throughput, error rate for performance variants; you decide whether a difference is real and whether it clears the scorecard. Latency is usually a guardrail.
- **security-testing** — security correctness is **never** a weighted trade-off: any regression is a hard guardrail; it supplies the signal.
- **color-system / web-design-craft / design-craft** — build design variants (palette, layout, copy); keep contrast and accessibility as guardrails.
- **usability-review** — gathers the qualitative user signal you weight.
- **ai-app-engineering** — builds the eval harness for AI variants; you own the statistics and the decision.

## Reference files (read on demand)
In Cadence, call `takt_skill_reference` with `skill: "ab-testing"` and one of:
- `assets/experiment-method.md` — formulas with worked numbers (power, MDE, z/t tests, CUPED, Beta-Binomial, sequential methods, SRM, corrections, novelty/primacy), the AI-eval rubric, factorial/bandits, cross-skill variant sources.
- `assets/result-schema.md` — the pre-registration/result JSON schema, a filled arithmetic-checked example, read-back rules.

Scripts (run in Claude/Codex or copy into the project; dependency-free Node ≥ 18):
- `scripts/sample-size.mjs --type prop|mean … [--n]` — n per arm from MDE (or MDE from n), Bonferroni for > 2 arms.
- `scripts/analyze.mjs prop|mean|srm|audit …` — two-proportion z / Welch t with CI and effect size, Bayesian P(B>A) + credible interval + expected loss, SRM chi-square, and **audit** of a result file (recomputes scores, composite, guardrails, integrity).
- `scripts/stats.mjs` — the shared primitives (normal quantile/CDF, χ², t, Beta sampling).
