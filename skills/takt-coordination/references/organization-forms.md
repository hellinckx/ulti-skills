# Organization forms — decision guide

Cadence supports four forms. The orchestration picks one per process run after the process exists. The person's setting may restrict the choice (automatic with a maximum, always single, or a preferred form).

## Single company (`single`)
**Use when:** one coherent product or change; parts share files, data models or UI; the job is small to medium; interfaces are not yet known.
**Signals:** "build an app for …", "add a feature", "fix", "improve the design", one repository area.
**Staffing:** existing home team; add a specialist only for a missing capability (for example OCR, data visualisation, payments).
**Anti-pattern:** splitting a normal app into "frontend company" and "backend company" when both live in the same small codebase. That only adds trade overhead.

## Supply chain (`supplier`)
**Use when:** a clearly separable building block is consumed by the main product and can be specified by its interface.
**Signals:** "with its own API", "as a library", "a separate importer", "a design system for our apps", heavy domain logic behind a small interface.
**Staffing:** home company builds the product; the supplier (management + 1–3 specialists) builds the block.
**Typical process:** research on the interface → contract (interface spec) → supplier builds block with tests in parallel to home building against a mock → delivery → home integrates and pays with an integration report → supplier fixes from the report → final integration.
**Anti-pattern:** a supplier for something the main product changes daily.

## Partnership (`partners`)
**Use when:** two to four large parts can be built at the same time and meet at a few interfaces.
**Signals:** "web and mobile", "platform plus clients", "two products that work together", "as a partnership", "two companies".
**Staffing:** each partner has management and its own specialists; home keeps integration and final acceptance unless another split is clearly better.
**Typical process:** shared research and interface contracts first → parallel branches per partner → cross-deliveries (API, shared components, data formats) with counter-performance → integration join → cross-review → release.
**Anti-pattern:** more partners than real parts; partners that would block each other on every step.

## Independent audit (`audit`)
**Use when:** quality or security must be judged independently; the customer wants a second opinion; regulated or risky features.
**Signals:** "security-critical", "independent review", "external audit", "must be bulletproof", payment, personal data, permissions.
**Staffing:** exactly two companies. The audit company has management and reviewers/testers (review, testing, visualQa capabilities). It does not build the product.
**Typical process:** home builds in normal steps → release candidate delivered to audit → audit tests and reports (counter-performance: findings) → home reworks → audit re-checks → final acceptance.
**Anti-pattern:** using audit for every small change; letting the audit company implement fixes itself.

## Worked examples
- "I want a habit tracker with a nice dark design" → **single**. One app, shared UI and data.
- "Budget app with invoice scanning; OCR should be its own module others can reuse" → **supplier** (OCR works as supplier, contract: parsing module ↔ integration feedback).
- "Web shop plus iOS/Android app and an admin backend" → **partners** (storefront, mobile studio, platform; contracts on catalogue API and order events).
- "Login and payment for our SaaS, must be secure" → **audit** (home builds, audit tests auth and payment paths, reports findings).

## Naming companies
Give each company a short, meaningful name the customer understands ("OCR Works", "Mobile Studio", "Audit Lab"). The mission is one sentence of what it delivers.
