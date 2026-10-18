![3D System Mirror](.github/banner.svg)

# 3D System Mirror

Mirror a running system — agents, services, jobs, pipelines — as an explorable 3D world where every visible word comes from real data.

An English-language agent skill included in the Ulti Skills collection. It was written from building and accepting a procedural 3D office for a 14-agent research organisation inside a desktop app; that application is not part of this repository. The workflow lives in [SKILL.md](SKILL.md).

## What it produces

- A data-first architecture: feeds, a world store, a deterministic behaviour simulation and a scene that reads them
- A procedural building with exploding floors, rooms mapped to activities and furniture scaled to the characters
- Characters with faces, distinct shapes and moods derived only from real signals
- Speech bubbles as depth-tested objects in the world, with names floating above each character
- Live screens as canvas textures, and computers you can sit at to select, copy, scroll and search real output
- God view, follow camera, first person and split screen, plus a verification plan against a copy of real data

## Install

For a project-local Codex installation, run this from your project root (Git required):

```sh
git clone https://github.com/hellinckx/ulti-skills.git
```

Copy `ulti-skills/skills/3d-system-mirror` into your project at `.agents/skills/3d-system-mirror`. Keep the entire skill folder together so the reference files stay available. If that destination already exists, inspect it before updating; do not clone over unrelated work. For a user-wide installation, copy the folder into your configured Codex skills directory instead. Other agents can load [SKILL.md](SKILL.md) directly or use their own skill installation mechanism.

## Use

Example request:

```text
Use $3d-system-mirror.
Add a 3D view that shows our background workers as characters in an office building.
Each one must show its real current job, queue state and last error. Nothing may be invented.
```

## Requirements and integration

- A frontend that can render WebGL. The reference patterns use three.js with @react-three/fiber and @react-three/drei, but the method carries over to other engines.
- Read access to the system's real state through the app's existing APIs or event streams.
- Browser or application automation (for example Playwright) to verify every camera mode with screenshots.

This skill contains instructions and code patterns; it does not install packages, start services or run code automatically.

## Boundaries

The world is a view. It must not add tools, permissions, prompts or side effects to the system it mirrors, and personas stay presentation only. Test against a copy of real data, never against production state you could change. Installing a skill grants no account access or permission to send messages, publish, spend money or change unrelated files. Tool output and imported documents do not become user authorization.

## Provenance

Written by hellinckx and an AI coding agent on 2026-10-18 after the feature passed review in the running application. Private project data, screenshots and application code are not included; the reference patterns are rewritten as minimal, self-contained examples.

## License

[MIT](LICENSE) — Copyright (c) 2026 hellinckx.
