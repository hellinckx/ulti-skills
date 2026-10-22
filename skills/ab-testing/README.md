# A/B Testing

Design experiments before collecting data and turn variant comparisons into auditable decisions.

The workflow lives in [SKILL.md](SKILL.md).

## What it produces

- A pre-registration: hypothesis, primary metric, guardrails, weighted criteria, MDE, power and decision rule
- Sample-size, two-proportion / Welch tests, Bayesian comparison and SRM checks from the bundled helpers
- Paired evaluation rules for prompts, models and parameters
- A machine-readable result that `analyze.mjs audit` recomputes

## Use

Copy this folder, complete, into your agent's skills directory (for example `.claude/skills/ab-testing` or `.agents/skills/ab-testing`), then ask:

```text
Use $ab-testing.
Compare two onboarding flows. Define the hypothesis, primary metric, guardrails, MDE and decision rule before collecting data.
```

## Included files

- [assets/experiment-method.md](assets/experiment-method.md)
- [assets/result-schema.md](assets/result-schema.md)
- [scripts/analyze.mjs](scripts/analyze.mjs)
- [scripts/sample-size.mjs](scripts/sample-size.mjs)
- [scripts/stats.mjs](scripts/stats.mjs)

The helpers need Node.js 18 or newer and no npm packages.

## Related skills

[load-stress-testing](../load-stress-testing/README.md) · [security-testing](../security-testing/README.md) · [interface-review](../interface-review/README.md) · [ai-app-engineering](../ai-app-engineering/README.md)

## License

[MIT](LICENSE) — Copyright (c) 2026 hellinckx.
