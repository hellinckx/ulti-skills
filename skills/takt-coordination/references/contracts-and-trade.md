# Contracts and trade

## How Cadence books trade
1. **Contract** — at the start of a run with several companies, Cadence records each contract between the managements (offer and agreed counter).
2. **Delivery** — when a step of company B starts and its predecessor steps belong to company A, Cadence books a delivery A → B. A review of A's work by B counts as a delivery of that work.
3. **Counter-performance** — the receiving step must pay back:
   - work and research steps end with a section `## Counter-performance for <A>` (German: `## Gegenleistung an <A>`),
   - reviews pay with their summary and findings.
   Cadence books it when the step finishes; without the section the start of the result counts as weaker feedback.
4. **Effect** — later steps of company A receive the counter-performances as "feedback from your trading partners".
5. **Visibility** — the org chart draws trade as fading curves between the agents; the memory page lists every delivery and counter-performance.

## Writing a contract
Both sides must be concrete and verifiable.

| Offer | Counter | Why it works |
| --- | --- | --- |
| OpenAPI spec and mock server for orders | Integration report: calls used, missing fields, failing cases | The supplier learns exactly what to fix next |
| Release candidate with start command | Test report with severity, steps to reproduce, screenshots | Audit findings drive rework |
| Component library v1 with stories | Usage report: missing variants, accessibility issues | Library improves for real consumers |
| Research brief on payment providers | Decision memo: chosen provider, open questions | Research turns into decisions |
| Data export in documented format | Import result: rows rejected and why | Format problems surface early |

Avoid: "code ↔ thanks", "support ↔ feedback", "everything ↔ approval", offers without a format or counters without content.

## A good counter-performance
```
## Counter-performance for OCR Works
- Usable: image parsing, confidence values, error codes.
- Missing: multi-page PDFs (invoice 2 of 3 lost), currency for CHF.
- Defect: totals with comma decimals parse as 1000x (src/parse/amount.js:42).
- Next delivery needs: page iteration, locale-aware amounts, a test fixture per case.
```
Short, specific, with locations, and ending with what the next delivery needs.

## Trade patterns per form
- **Supply chain:** home → supplier (requirements, research) and supplier → home (block); counters: acceptance feedback, integration report.
- **Partnership:** partner ↔ partner at interfaces (API, events, shared components); counters: integration results, cross-review findings.
- **Audit:** home → audit (release candidate); audit → home (test report); counter for the report: the fix list with what changed.

## Parallel work through contracts
Agree the interface first, then let both sides build at the same time against the contract (mocks, fixtures). Join at an integration step, exchange counter-performances, run one bounded fix loop, then the final review.
