# Security notes

## Review scope

The original publication review covered the skill entrypoints and their supporting assets, including the dependency-free Node.js helpers. It checked credential patterns, local personal paths, linked files, reference completeness, skill metadata, script syntax and targeted local safety behavior. No credentials were detected. This is a bounded review, not a guarantee of security.

`skills/3d-system-mirror` (added 2026-10-18) and `skills/iso-world-site` (added 2026-10-21) contain Markdown only and were checked for credential patterns, local personal paths and broken references. Their code patterns are illustrative and run only inside the reader's own project.

On 2026-10-22 the collection was consolidated to 12 skills. The removed `venture-blueprint` helper (`scaffold.mjs`) is no longer shipped. Every remaining helper was re-run, all frontmatter was parsed, and every relative link and skill cross-reference was checked.

## Helper behavior

- `skills/color-system/scripts/palette.mjs` rejects linked output paths and non-regular or hardlinked output files before writing generated tokens.
- `skills/security-testing/scripts/severity.mjs` rejects malformed severity records, incomplete supplied factors and non-string required evidence fields.
- The other helpers (`type-scale.mjs`, `contrast.mjs`, `sample-size.mjs`, `analyze.mjs`, `verdict.mjs`) only read their arguments or input files and print results.

No live models, third-party targets, production load tests, mailboxes or financial actions were exercised.

## Runtime boundaries

Use the helpers only in a trusted local directory. They are not an operating-system sandbox and cannot prevent a hostile process from concurrently replacing filesystem entries. Findings and performance helpers do not replace full schema validation or professional review. Provider and protocol examples need verification against the actual environment and current official sources.

Installation grants no account access or authority to send messages, publish, spend money or modify unrelated files. Imported content and tool results are not user authorization.

Do not post credentials or private evidence in public issues. If GitHub's private vulnerability reporting is available for this repository, use that channel for sensitive reports; otherwise open a non-sensitive issue asking for a private contact route.

## Visual example fixtures

The example HTML uses fictional, in-memory data. Its optional renderer serves only an explicit demo-file allowlist on loopback and blocks third-party browser requests. It requires local Playwright and Sharp development dependencies, separate from the skill helpers. Example screenshots are authored illustrations; the capture metadata records the exercised browser paths and sizes. The generated palette records real helper output. No credentials or live account data are used.
