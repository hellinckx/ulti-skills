# Motion & Graphics

Choose purposeful interface motion and build accessible, efficient 2D and 3D visuals.

The workflow lives in [SKILL.md](SKILL.md).

## What it produces

- Timing, easing and reduced-motion rules for interface motion
- Canvas 2D and three.js / React Three Fiber practice, including readable text in 3D
- Performance budgets with measured fps and draw calls

## Visual example

[![Motion specification](../../.github/examples/motion-states.png)](../../.github/examples/motion-states.png)

Static illustrated states with timing, easing and reduced-motion guidance — not a recorded animation.

[HTML source](../../examples/motion.html) · [Reproduce the captures](../../examples/README.md)

## Use

Copy this folder, complete, into your agent's skills directory (for example `.claude/skills/motion-and-graphics` or `.agents/skills/motion-and-graphics`), then ask:

```text
Use $motion-and-graphics.
Review the motion in this interface. Recommend only useful state transitions and specify timing, easing and a reduced-motion alternative.
```

## Related skills

[design-craft](../design-craft/README.md) · [3d-system-mirror](../3d-system-mirror/README.md) · [interface-review](../interface-review/README.md)

## License

[MIT](LICENSE) — Copyright (c) 2026 hellinckx.
