# Security Testing

Find, reproduce and fix security weaknesses in systems you own, using controlled, non-destructive checks.

The workflow lives in [SKILL.md](SKILL.md).

## What it produces

- A threat model with assets, entry points, trust boundaries and abuse cases
- A vulnerability catalog with the smallest safe proof and fix pattern per class
- Factor-based severity scores and a findings file validated by a release gate (`severity.mjs`)

## Use

Copy this folder, complete, into your agent's skills directory (for example `.claude/skills/security-testing` or `.agents/skills/security-testing`), then ask:

```text
Use $security-testing.
Review this local API using synthetic data. Confirm scope, map trust boundaries, reproduce issues non-destructively and record fixes with regression evidence.
```

## Included files

- [assets/severity-and-findings.md](assets/severity-and-findings.md)
- [assets/vulnerability-catalog.md](assets/vulnerability-catalog.md)
- [scripts/severity.mjs](scripts/severity.mjs)

The helpers need Node.js 18 or newer and no npm packages.

## Notes

Defensive use on your own systems only. No attack tooling ships with the skill.

## Related skills

[load-stress-testing](../load-stress-testing/README.md) · [ai-app-engineering](../ai-app-engineering/README.md) · [complete-app](../complete-app/README.md)

## License

[MIT](LICENSE) — Copyright (c) 2026 hellinckx.
