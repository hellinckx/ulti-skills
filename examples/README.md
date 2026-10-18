# Visual examples

These small, authored fixtures demonstrate the kinds of design decisions described by the skills. They are illustrative examples with fictional data, not customer work or evidence that every agent run will produce the same result.

| Source | What it illustrates | Render |
|---|---|---|
| [interface.html](interface.html) | Shared typography, spacing, status, filtering, a keyboard-operable dialog and form recovery | [Workspace](../.github/examples/interface.png) / [Recovery state](../.github/examples/form-recovery.png) |
| [landing.html](landing.html) | Editorial composition, asymmetric layout, type hierarchy and a restrained product direction | [Web design](../.github/examples/web-design.png) |
| [palette.html](palette.html) | Actual light/dark tokens and measured contrast from `color-system/scripts/palette.mjs`, with seed hue 155 | [Color system](../.github/examples/color-system.png) |
| [motion.html](motion.html) | A static motion specification: entry, settling and final states, timing, easing and reduced-motion guidance | [Motion states](../.github/examples/motion-states.png) |

The [responsive overview](../.github/examples/responsive.png) combines real screenshots at 390×844, 820×1180, 1360×900 and 1920×1080. Full-size captures sit alongside it; the overview only resizes them for comparison. [Capture metadata](../.github/examples/capture-info.json) records the checks and actual viewport dimensions.

## Reproduce the images

From this directory, with Node.js 18 or newer:

```sh
npm install
npx playwright install chromium
npm run render
```

The renderer generates the palette with the supplied skill helper, serves only the demo-file allowlist on loopback, opens Chromium, checks the local interactions and viewport bounds, and writes the screenshots to `.github/examples/`. It makes no model calls or third-party browser requests. The same command can replace the generated example images, so commit or back up local edits first.

Optional `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` selects an existing Chromium binary. Optional `ULTI_SKILLS_RENDER_NODE_MODULES` selects an existing dependency directory instead of a local npm install. No credentials are needed. System fonts may differ slightly across operating systems.

## Scope

The workspace fixture demonstrates task creation, filtering, validation and focus recovery. It is a small in-memory demo, not a complete project-management product. The palette's 42 passing contrast pairs are generator measurements, not a full accessibility certification. The motion sheet contains static illustrated states, not a recorded animation. The source pages are included so these limits and the implementation can be inspected.
