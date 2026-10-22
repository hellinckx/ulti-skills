# AI App Engineering

Build applications with explicit provider connections, catalog-driven model selection, narrow agent tools and operational limits.

The workflow lives in [SKILL.md](SKILL.md).

## What it produces

- A provider abstraction for API-key, local and Codex App Server connections
- Model catalogs, allow-lists and reasoning-effort validation without silent fallback
- OS-encrypted key storage, timeouts, retries, quotas and cost accounting
- Agent loops with typed tools, structured output, fail-closed approvals and fake-provider tests

## Use

Copy this folder, complete, into your agent's skills directory (for example `.claude/skills/ai-app-engineering` or `.agents/skills/ai-app-engineering`), then ask:

```text
Use $ai-app-engineering.
Plan the AI layer for a local document assistant. Compare local models, API providers and a personal Codex connection; specify tool permissions and tests.
```

## Notes

Protocol details (especially the Codex App Server) must be verified against the installed version and current official documentation.

## Related skills

[ab-testing](../ab-testing/README.md) · [security-testing](../security-testing/README.md) · [load-stress-testing](../load-stress-testing/README.md)

## License

[MIT](LICENSE) — Copyright (c) 2026 hellinckx.
