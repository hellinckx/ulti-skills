# Load & Stress Testing

Measure application behaviour under realistic data volume and concurrent use in a controlled staging environment.

The workflow lives in [SKILL.md](SKILL.md).

## What it produces

- A production-like staging plan with a safety gate
- Idempotent seed data at three volume regimes and measured user paths
- Baseline, ramp, soak, spike and stress profiles against pre-declared thresholds
- A verdict that separates architecture from infrastructure problems (`verdict.mjs`)

## Use

Copy this folder, complete, into your agent's skills directory (for example `.claude/skills/load-stress-testing` or `.agents/skills/load-stress-testing`), then ask:

```text
Use $load-stress-testing.
Plan a staging-only load test for an order API. Define data regimes, user paths, safety limits, thresholds and a kill switch before running anything.
```

## Included files

- [assets/method.md](assets/method.md)
- [assets/result-schema.md](assets/result-schema.md)
- [scripts/verdict.mjs](scripts/verdict.mjs)

The helpers need Node.js 18 or newer and no npm packages.

## Notes

Never run against production without written consent, a window and a kill switch.

## Related skills

[security-testing](../security-testing/README.md) · [ab-testing](../ab-testing/README.md) · [complete-app](../complete-app/README.md)

## License

[MIT](LICENSE) — Copyright (c) 2026 hellinckx.
