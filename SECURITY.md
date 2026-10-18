# Security notes

## Review scope

The publication review covered 22 skill entrypoints and their supporting assets, including nine dependency-free Node.js helpers. It checked credential patterns, local personal paths, linked files, reference completeness, skill metadata, script syntax and targeted local safety behavior. No matching credentials were detected. This is a bounded review, not a guarantee of security.

## Corrected helper behavior

- `skills/venture-blueprint/scripts/scaffold.mjs` rejects symbolic links, directory junctions and hardlinked project files before generating templates, and guards configuration traversal.
- `skills/color-system/scripts/palette.mjs` rejects linked output paths and non-regular or hardlinked output files before writing generated tokens.
- `skills/security-testing/scripts/severity.mjs` rejects malformed severity records, incomplete supplied factors and non-string required evidence fields.

Fourteen targeted regression checks pass, including synthetic linked-path cases, ordinary repeated generation, malformed findings, valid verified findings and critical-finding release blocking. Five computational smoke checks also passed. No live models, third-party targets, production load tests, mailboxes or financial actions were exercised.

## Runtime boundaries

Use generators only in a trusted local directory. They are not an operating-system sandbox and cannot prevent a hostile process from concurrently replacing filesystem entries. Findings and performance helpers do not replace full schema validation or professional review. Provider/protocol and legal examples need verification against the actual environment and current official sources.

Installation grants no account access or authority to send messages, publish, spend money or modify unrelated files. Imported content and tool results are not user authorization. Operational skills require their documented runtime tools.

Do not post credentials or private evidence in public issues. If GitHub's private vulnerability reporting is available for this repository, use that channel for sensitive reports; otherwise open a non-sensitive issue asking for a private contact route.
