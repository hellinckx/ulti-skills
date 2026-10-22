# Complete App

Deliver applications without prototype gaps: every state, settings where needed, persistence, help, recovery and a one-command start.

The workflow lives in [SKILL.md](SKILL.md).

## What it produces

- A gap audit of navigation, states, settings, persistence, help and recovery
- Robustness rules for validation, timeouts, crash-safe saves and logging
- An end-to-end release acceptance walk in the real running app

## Visual example

[![A considered project workspace](../../.github/examples/interface.png)](../../.github/examples/interface.png)

An authored example with filtering, a keyboard-operable dialog and form recovery. The project and data are fictional.

[HTML source](../../examples/interface.html) · [Reproduce the captures](../../examples/README.md)

## Use

Copy this folder, complete, into your agent's skills directory (for example `.claude/skills/complete-app` or `.agents/skills/complete-app`), then ask:

```text
Use $complete-app.
Audit this local app for missing settings, help, persistence and recovery states. Build a completion checklist and verify the documented startup path.
```

## Related skills

[goal-to-plan](../goal-to-plan/README.md) · [design-craft](../design-craft/README.md) · [interface-review](../interface-review/README.md)

## License

[MIT](LICENSE) — Copyright (c) 2026 hellinckx.
