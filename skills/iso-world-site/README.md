# Iso World Site

Build websites as a live isometric 3D diorama that the camera travels through on scroll — plain HTML, CSS and canvas, no WebGL and no libraries.

An English-language agent skill included in the Ulti Skills collection. The complete method lives in [SKILL.md](SKILL.md). It is a written description only: the skill ships no engine code, template, demo page or images, and the agent builds the world and the page for each project from the description.

## What it produces

- A topic turned into a working miniature: things flow through 4–7 stations, queue at the slow step and get counted at the end
- A fixed canvas world behind the page; each chapter of the story rests the camera on one station
- Flat-shaded boxes with ink outlines, hatch stripes, ghost wireframes and painted mono labels from the subject's real vocabulary
- Huge tight uppercase grotesk headlines, mono utility type, soft glass panels over the hard-edged world
- Physical-object interface pieces and isometric SVG illustrations in the same materials as the world
- A palette driven by seven scene tokens, so the whole world recolours from CSS variables
- Reduced-motion still frames, off-screen pausing and adaptive quality

## Install

```sh
git clone https://github.com/hellinckx/ulti-skills.git
```

Copy `ulti-skills/skills/iso-world-site` into your project at `.agents/skills/iso-world-site`. If that destination already exists, inspect it before updating; do not clone over unrelated work. For a user-wide installation, copy the folder into your configured skills directory instead. Other agents can load [SKILL.md](SKILL.md) directly.

## Use

Example request:

```text
Use $iso-world-site.
Build a one-page site for a small bakery in Vienna. Dough batches move from the flour store
through the mixer, proofing and the oven to the counter. Proofing is the slow step.
```

## Requirements and integration

- A browser with canvas 2D support. No build step, framework or package is required.
- Browser automation or a manual browser preview to check every chapter, a 375 px mobile width and reduced motion, as the workflow describes.

## Boundaries

The skill contains instructions only; it does not install packages, start servers or run code automatically. Do not invent figures, customers or claims for a real business — use the requester's facts or mark placeholders clearly. Do not copy another company's site, branding or imagery into the world.

## License

[MIT](LICENSE) — Copyright (c) 2026 hellinckx.
