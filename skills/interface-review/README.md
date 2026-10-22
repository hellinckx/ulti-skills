# Interface Review

Prove that a running interface works: observed task walkthroughs, keyboard use and inspected screenshots in four viewport classes.

The workflow lives in [SKILL.md](SKILL.md).

## What it produces

- Task walkthroughs covering success, empty, error, cancel and recovery
- Keyboard-only completion and focus checks
- Screenshots at mobile, tablet, normal and large sizes that were actually inspected
- A report under `docs/qa/<run-id>/` with defects, fixes and remaining gaps

## Visual example

[![Four real viewport classes](../../.github/examples/responsive.png)](../../.github/examples/responsive.png)

Real captures at 390×844, 820×1180, 1360×900 and 1920×1080, plus a [form-recovery state](../../.github/examples/form-recovery.png) exercised in Chromium.

[HTML source](../../examples/interface.html) · [Reproduce the captures](../../examples/README.md)

## Use

Copy this folder, complete, into your agent's skills directory (for example `.claude/skills/interface-review` or `.agents/skills/interface-review`), then ask:

```text
Use $interface-review.
Review the checkout flow in the running app: walk success, validation errors and cancel by keyboard,
capture all four viewport classes and fix what breaks.
```

## Notes

Needs browser or application automation that can start the real build and take screenshots.

## Related skills

[design-craft](../design-craft/README.md) · [complete-app](../complete-app/README.md)

## License

[MIT](LICENSE) — Copyright (c) 2026 hellinckx.
