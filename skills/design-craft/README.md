# Design Craft

Give web, desktop and game interfaces a deliberate visual direction and record it once in `docs/DESIGN.md`.

The workflow lives in [SKILL.md](SKILL.md).

## What it produces

- A written direction with one repeated signature move
- One spacing scale and a fluid modular type scale (`scripts/type-scale.mjs`)
- Grid, section architecture, component state matrix and motion bands
- A transferable design specification that another team can reproduce

## Visual example

[![Editorial web design](../../.github/examples/web-design.png)](../../.github/examples/web-design.png)

An authored landing page showing asymmetric composition, a strong type hierarchy and a restrained direction. Content is fictional.

[HTML source](../../examples/landing.html) · [Reproduce the captures](../../examples/README.md)

## Use

Copy this folder, complete, into your agent's skills directory (for example `.claude/skills/design-craft` or `.agents/skills/design-craft`), then ask:

```text
Use $design-craft.
Define a visual direction for an existing scheduling tool and update its design specification without replacing its established brand.
```

## Included files

- [assets/design-template.md](assets/design-template.md)
- [assets/motion-system.md](assets/motion-system.md)
- [assets/web-craft-method.md](assets/web-craft-method.md)
- [scripts/type-scale.mjs](scripts/type-scale.mjs)

The helpers need Node.js 18 or newer and no npm packages.

## Related skills

[color-system](../color-system/README.md) · [motion-and-graphics](../motion-and-graphics/README.md) · [interface-review](../interface-review/README.md)

## License

[MIT](LICENSE) — Copyright (c) 2026 hellinckx.
