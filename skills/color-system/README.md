# Color System

Create deliberate OKLCH palettes, semantic tokens and measured contrast across themes.

The workflow lives in [SKILL.md](SKILL.md).

## What it produces

- Seeded dark and light palettes with semantic, focus and data roles
- Gamut-safe OKLCH to hex conversion and measured contrast for every key pair
- CSS tokens and a machine-readable palette record

## Visual example

[![Generated light and dark themes](../../.github/examples/color-system.png)](../../.github/examples/color-system.png)

Real output of the bundled generator at hue 155; all 42 declared contrast pairs meet their targets. A palette demonstration, not an accessibility certification.

[HTML source](../../examples/palette.html) · [Reproduce the captures](../../examples/README.md)

## Use

Copy this folder, complete, into your agent's skills directory (for example `.claude/skills/color-system` or `.agents/skills/color-system`), then ask:

```text
Use $color-system.
Create a warm, restrained dark and light palette for an inventory app. Record seed hues, semantic roles and measured contrast.
```

## Included files

- [assets/palette-recipe.md](assets/palette-recipe.md)
- [assets/palette-record.md](assets/palette-record.md)
- [assets/tokens-template.css](assets/tokens-template.css)
- [scripts/contrast.mjs](scripts/contrast.mjs)
- [scripts/palette.mjs](scripts/palette.mjs)

The helpers need Node.js 18 or newer and no npm packages.

## Related skills

[design-craft](../design-craft/README.md) · [interface-review](../interface-review/README.md) · [ab-testing](../ab-testing/README.md)

## License

[MIT](LICENSE) — Copyright (c) 2026 hellinckx.
