# Experiment method — worked reference

The long-form companion to `SKILL.md`. Formulas, numbers and templates. All examples are illustrative — re-compute with your own baseline and variance.

## Notation

`p` a proportion (rate); `x̄` a mean; `σ` / `s` population / sample standard deviation; `n` sample size per variant; `α` significance level (false-positive rate); `1−β` power; `δ` the effect to detect (MDE); `Φ` the standard-normal CDF; `z_q` its q-quantile.

Critical values used below:

| Quantity | Value |
|---|---|
| `z_{1−α/2}`, α = 0.05 (two-sided) | 1.960 |
| `z_{1−α/2}`, α = 0.10 | 1.645 |
| `z_{1−β}`, power 0.80 | 0.842 |
| `z_{1−β}`, power 0.90 | 1.282 |
| `(z_{1−α/2}+z_{1−β})²`, α .05 / power .80 | 7.85 |
| `(z_{1−α/2}+z_{1−β})²`, α .05 / power .90 | 10.51 |

## Sample size and power (the core sizing math)

### Proportions (conversion, CTR, pass rate)

Per-variant sample size, absolute MDE `δ = p2 − p1`, pooled `p̄ = (p1+p2)/2`:

```
n = (z_{1−α/2} + z_{1−β})² · 2 · p̄(1−p̄) / δ²
```

Rule of thumb (α .05, power .80): `n ≈ 15.7 · p̄(1−p̄) / δ²`.

**Worked:** baseline `p1 = 0.10`, detect an absolute +2 pts (`p2 = 0.12`). `p̄ = 0.11`, `δ = 0.02`.
`n = 7.85 · 2 · (0.11·0.89) / 0.02² = 7.85 · 0.1958 / 0.0004 ≈ 3,843` per variant.

Detecting a *relative* 5% lift on the same 10% base (`δ = 0.005`, `p̄ = 0.1025`) needs `7.85 · 2 · 0.0920 / 0.000025` ≈ **57,800 per variant** (the quick `1/δ²` rule of thumb says ~16× ≈ 61,500 because it keeps `p̄` at 0.11). Small relative effects are expensive; set the MDE honestly. `scripts/sample-size.mjs --type prop --p1 0.10 --mde 0.05 --relative` reproduces the exact figure.

### Means (revenue per user, latency, rubric score)

```
n = (z_{1−α/2} + z_{1−β})² · 2σ² / δ²
```

"Rule of 16": at α .05 / power .80, `n ≈ 16 σ² / δ²` per variant. Estimate `σ` from history; for heavy-tailed metrics (revenue) consider a capped/winsorised or log metric, or the Mann–Whitney test.

### MDE from a fixed n (traffic-limited)

```
δ = (z_{1−α/2} + z_{1−β}) · √( 2 p̄(1−p̄) / n )       (proportions)
```

Use this when traffic is the constraint: it states the smallest effect the test can actually resolve. If that δ is larger than any effect that would change your decision, the test cannot answer the question — do not run it as-is.

### More than two arms

Splitting traffic across `k` arms gives each `1/k`. Holding power fixed, each pairwise comparison still needs its own `n`, and `α` must be corrected for multiplicity (below). Cost grows faster than linearly in the number of arms.

## Analysis — frequentist

### Two-proportion z-test

```
p̄ = (x1 + x2) / (n1 + n2)
SE = √( p̄(1−p̄) · (1/n1 + 1/n2) )
z  = (p2 − p1) / SE
two-sided p = 2 · (1 − Φ(|z|))
```

CI for the difference (unpooled SE):

```
(p2 − p1) ± z_{1−α/2} · √( p1(1−p1)/n1 + p2(1−p2)/n2 )
```

### Means — Welch's t-test

```
t = (x̄2 − x̄1) / √( s1²/n1 + s2²/n2 )
```

with the Welch–Satterthwaite degrees of freedom. Report the difference and its CI, not just `t`.

### Effect size

Absolute lift `p2−p1`; relative lift `(p2−p1)/p1`. Cross-metric comparisons: Cohen's h `= 2·asin√p2 − 2·asin√p1` (proportions); Cohen's d `= (x̄2−x̄1)/s_pooled` (means). Always report an effect size with its interval.

## Variance reduction — CUPED

Use a pre-experiment covariate `X` (e.g. the unit's pre-period value of the metric) correlated with outcome `Y`:

```
Y_adj = Y − θ · (X − E[X]),   θ = Cov(Y, X) / Var(X)
Var(Y_adj) = Var(Y) · (1 − ρ²),   ρ = corr(X, Y)
```

A correlation `ρ = 0.5` cuts variance by 25% → ~25% less sample for the same power. Estimate `θ` on the pooled data and apply to both arms. CUPED is the cheapest honest way to buy power.

## Analysis — Bayesian (Beta-Binomial for rates)

Prior per arm `Beta(α0, β0)`, weakly informative (e.g. `Beta(1,1)`). After `c` conversions in `n` trials:

```
posterior = Beta(α0 + c,  β0 + n − c)
```

- **P(B > A):** closed form (a finite sum over the Beta parameters) or Monte-Carlo — sample `θA, θB` many times, take the fraction with `θB > θA`.
- **95% credible interval** of the lift = the 2.5 / 97.5 posterior quantiles of `θB − θA`.
- **Expected loss** of shipping B `= E[max(θA − θB, 0)]`; ship when expected loss < a small pre-set threshold (e.g. 0.1% of baseline).

Report P(B>A), the credible interval of the lift, and the expected loss — all against thresholds set *before* the data.

## Valid sequential testing (if you must look early)

Fixed-horizon tests are only valid analysed **once**. To monitor continuously without inflating α:

- **Group-sequential / alpha-spending** (O'Brien–Fleming, Pocock): pre-planned interim looks that spend α across them. O'Brien–Fleming is strict early and near-full α at the end (good when early stops must be very sure); Pocock spends α evenly.
- **Always-valid inference / confidence sequences** (mSPRT; Howard et al.): intervals valid at *every* `n`; stop any time the sequence excludes 0.
- **Sequential Bayesian** with pre-set decision boundaries — but a naive "stop as soon as P(B>A) > 0.95" still needs calibration against its false-ship rate.

Never substitute "peek and stop at p < 0.05" for one of these.

## Experiment integrity

- **A/A test.** Two identical arms; by construction ~α of A/A tests look "significant" by chance, but a *persistent* or large A/A gap signals a broken pipeline, assignment or metric definition.
- **SRM (sample-ratio mismatch).** Chi-square of observed vs expected counts: `χ² = Σ (O−E)²/E`. Planned 50/50 with observed `199,880 / 200,120` on 400,000 → `χ² = (120² + 120²)/200,000 = 0.144`, `p ≈ 0.70` → fine. `p < 0.001` → investigate assignment, redirects, bot filtering, logging **before** reading metrics.
- **Multiple comparisons.** Testing `m` independent hypotheses at `α` each gives family-wise error `≈ 1 − (1−α)^m` (10 metrics at .05 ≈ 40% chance of a false positive). **Bonferroni:** test each at `α/m`. **Benjamini–Hochberg:** control the false-discovery rate when screening many metrics/segments.
- **Novelty & primacy.** New UI can spike (curiosity) or dip (habit) then revert. Inspect the effect's *time trend*, not just the pooled mean; segment new vs returning users (pre-registered).

## A/B testing AI systems — detail

- **Eval set.** Representative of the real task distribution, versioned, with a **locked holdout** never used for tuning. Size it like any experiment (bootstrap power over items).
- **Metric layers.** (1) *Deterministic* — exact/regex match, pass@k, tool-call schema validity, JSON validity, latency, tokens, cost. (2) *Rubric* — define 3–6 dimensions (e.g. correctness, completeness, safety, tone), each scored on a fixed scale with written anchors. (3) *Pairwise preference* — judge picks A, B or tie.
- **LLM-as-judge controls.** Randomize answer order (position bias), hide which is the new variant, control or normalise for length, use a strong judge model, and calibrate against a human-labelled subset; report judge–human agreement (e.g. Cohen's κ).
- **Paired analysis.** Every item runs through every variant → paired tests: **McNemar** (binary pass/fail), **paired-t** or **Wilcoxon signed-rank** (scores), and win/tie/loss rate with a bootstrap CI. Paired designs are far more powerful than independent arms because each item is its own control.
- **Guardrails.** Latency, cost, refusal rate, safety-violation rate. A quality win that doubles cost or latency may still fail the scorecard.

## Multivariate and bandits — detail

- **Full factorial.** `k` factors with levels `l1…lk` → `Π li` cells; measures main effects *and* interactions. Each cell needs enough traffic for power — budget for the product, not the count of factors.
- **Fractional factorial** (Taguchi L-arrays, Plackett–Burman): a chosen subset of cells screens main effects with far less traffic, assuming higher-order interactions are negligible. Use it to screen, then confirm the winner head-to-head.
- **Bandits** (ε-greedy, UCB1, Thompson sampling): allocate more traffic to better-performing arms online, minimising regret. Best for many low-stakes variants or ongoing optimisation; weaker for a clean, one-shot causal estimate. **Thompson sampling** (draw from each arm's posterior, play the argmax) is the usual default.

## What you can A/B test (cross-skill)

This skill owns the *method*; other skills own the *variant* and its *measurement*:

- **Performance variants** — compare two configs, algorithms or infra settings; make p50/p95/p99 latency, throughput or error rate under load the primary / guardrail metrics. Generate the load and read those numbers with **load-stress-testing**, then decide here.
- **Security variants** — compare rule sets, auth flows or hardening options; but security correctness is not a popularity metric: treat any regression in the security signal as a **hard guardrail**, never a weighted trade-off, and gather that signal with **security-testing**.
- **Design variants** — palettes, themes, layout, copy, motion. Build the variants with **color-system** (palette/theme) and **design-craft** (layout, interaction, copy); measure them here with conversion, task-success and the user-analysis layer. Keep accessibility and contrast a guardrail, not a weighted trade-off.

## Pitfall quick list

Peeking · HARKing · no guardrails · re-weighting after results · underpowered · segment mining · ignoring time · **Simpson's paradox** across pooled segments · **interference** between units (network / marketplace effects) · **survivorship** (only measuring units that reached the end) · **Twyman's law** — any figure that looks surprisingly good is usually a bug until proven otherwise.
