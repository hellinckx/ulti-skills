# Security notes

## Review scope

The publication review covers the 14 retained skill entrypoints and their supporting assets, including nine dependency-free Node.js helpers. It checked credential patterns, local personal paths, linked files, reference completeness, skill metadata, script syntax and targeted local safety behavior. No matching credentials were detected. This is a bounded review, not a guarantee of security.

## Corrected helper behavior

- `skills/venture-blueprint/scripts/scaffold.mjs` rejects symbolic links, directory junctions and hardlinked project files before generating templates, and guards configuration traversal.
- `skills/color-system/scripts/palette.mjs` rejects linked output paths and non-regular or hardlinked output files before writing generated tokens.
- `skills/security-testing/scripts/severity.mjs` rejects malformed severity records, incomplete supplied factors and non-string required evidence fields.

Fourteen targeted regression checks pass, including synthetic linked-path cases, ordinary repeated generation, malformed findings, valid verified findings and critical-finding release blocking. Five computational smoke checks also passed. No live models, third-party targets, production load tests, mailboxes or financial actions were exercised.

## Runtime boundaries

Use generators only in a trusted local directory. They are not an operating-system sandbox and cannot prevent a hostile process from concurrently replacing filesystem entries. Findings and performance helpers do not replace full schema validation or professional review. Provider/protocol examples need verification against the actual environment and current official sources.

Installation grants no account access or authority to send messages, publish, spend money or modify unrelated files. Imported content and tool results are not user authorization.

Do not post credentials or private evidence in public issues. If GitHub's private vulnerability reporting is available for this repository, use that channel for sensitive reports; otherwise open a non-sensitive issue asking for a private contact route.

## Visual example fixtures

The example HTML uses fictional, in-memory data. Its optional renderer serves only an explicit demo-file allowlist on loopback and blocks third-party browser requests. It requires local Playwright and Sharp development dependencies, separate from the nine dependency-free skill helpers. Example screenshots are authored illustrations; the capture metadata records the exercised browser paths and sizes. The generated palette records real helper output. No credentials or live account data are used.
