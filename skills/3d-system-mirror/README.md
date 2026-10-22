# 3D System Mirror

Mirror a running system — agents, services, jobs, pipelines — as an explorable 3D world where every visible word comes from real data.

The workflow lives in [SKILL.md](SKILL.md).

## What it produces

- A data-first architecture: feeds, a world store, a deterministic behaviour simulation and a scene that reads them
- A procedural building with exploding floors, rooms mapped to activities and furniture scaled to the characters
- Characters with faces and moods derived only from real signals; depth-tested speech bubbles with the real current task
- Live screens as canvas textures you can sit at to select, copy, scroll and search real output
- God view, follow camera, first person and split screen, plus a test plan against a copy of real data

## Use

Copy this folder, complete, into your agent's skills directory (for example `.claude/skills/3d-system-mirror` or `.agents/skills/3d-system-mirror`), then ask:

```text
Use $3d-system-mirror.
Add a 3D view that shows our background workers as characters in an office building.
Each one must show its real current job, queue state and last error. Nothing may be invented.
```

## Included files

- [references/checklist.md](references/checklist.md)
- [references/patterns.md](references/patterns.md)

## Notes

Requires a WebGL-capable frontend; the patterns assume three.js / React Three Fiber.

## Related skills

[motion-and-graphics](../motion-and-graphics/README.md) · [interface-review](../interface-review/README.md)

## License

[MIT](LICENSE) — Copyright (c) 2026 hellinckx.
