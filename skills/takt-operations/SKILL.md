---
name: takt-operations
description: Working rules for every step of a standing process in Cadence — how agents of one organization work
  in the shared knowledge folder, hand results to each other, keep status files current, ask for approval before
  anything leaves the house, escalate to the person and write step reports that the next run can build on.
metadata:
  creator: Cadence project
  created: '2026-10-12'
  creation-method: Editorial Markdown guide written in the Cadence repository from the process-management design
    (ADR-0041) and the person's wishes for a self-running organization; no external template or executable scripts.
  purpose: Standing processes run again and again with different agents. They only work when every step reads the
    same files, writes the same way and never repeats or loses work. This skill is the house protocol for that.
  scope: Installation-wide; included with every step of a standing process (process management) in every connected
    project.
---

# Working in a standing process

You are one step of a process that runs again and again. Other agents ran before you, others will run after you, and the same process will run again tomorrow. Your working directory is the **knowledge folder** of the organization. Everything you know, found and decided must be in it, in a form a person and the next agent can read without you.

## 1. The loop of every step
1. **Orient (2 minutes):** read `README.md`, `processes/process-map.md`, the status file of your process (`processes/<process-slug>/status.md`, create it if missing) and the handover notes left for your role (`notes/handover/<your role>.md`). Check the report of the last run that Cadence gave you in the prompt. Decide what is already done and what is new.
2. **Do the work** the step asks for. Prefer small, verifiable actions. If information is missing, look for it in the knowledge folder first, then in the sources you have (mailbox, browser), then write it down as an open point.
3. **Record while working:** update lists and status files as you go, not at the end. A crash must not lose what you learned.
4. **Hand over:** write what the next step or the next run needs into `notes/handover/<next role>.md` (or `notes/handover/next-run.md`). Keep the file short and current; delete what is done.
5. **Report:** your final message is the step report with the four headings `## Ergebnis`, `## Belege`, `## Offene Punkte`, `## Nächste Schritte`. Name files, numbers, dates. No filler.

## 2. The knowledge folder
- `README.md` — rules (Cadence writes it; you may add a section "Unsere Ordnung" describing the structure you chose).
- `processes/process-map.md` — current process map (Cadence writes it).
- `processes/<process-slug>/` — your process: `status.md` (what is open, what is done, when it last ran), `decisions.md` (decisions with date and reason), working files.
- `reports/` — run reports (Cadence writes them from your final messages). Read them, do not edit them.
- `inbox/` — downloads and e-mail attachments. Move what you processed into a sensible place (for example `inbox/processed/2026-10/`) and note it.
- `notes/` — yours: handover notes, lists, drafts. Use dates in file names (`2026-10-12-...`), one topic per file, Markdown or CSV.
- Never store passwords, tokens, card numbers or copies of ID documents anywhere in the folder.

## 3. Communication between agents
Agents of this organization do not chat; they leave written handovers:
- **For the next step:** `notes/handover/<role>.md` with the sections *Was ich getan habe*, *Was du brauchst*, *Offen*. Overwrite your own old notes; keep it under one page.
- **For the management:** anything that needs a decision, a budget, a new process or a change to the process map goes into `notes/handover/geschaeftsfuehrung.md`.
- **For the person:** questions only a human can answer go into `notes/fragen-an-die-person.md` (date, question, why it matters, what happens until it is answered). Use `takt_notify_user` only when the person must act now (deadline, blocked money, security).
- Read the handover for your role before you start, and remove entries you have handled.

## 4. Doing the same work twice
Before you process an e-mail, an invoice, a course, a customer: check the status files and lists. If it is listed as done, skip it and say so. Keep an index per process (`processes/<slug>/index.csv` or a table in `status.md`) with an identifier, date and state for every item you handled.

## 5. Outside effect needs approval
You may read, download, sort, prepare, draft and file. You may **not**: send e-mails, submit forms, post, pay, book, delete other people's data, sign or promise. For those, use `takt_mail_send` (an e-mail waits for approval) or `takt_approval_request` (describe the action precisely; after approval a new step carries it out). Prepare everything so the approved action is a single click: draft text, recipients, attachments, exact page and field names.

## 6. Quality bar
- Correct over fast: verify numbers, dates and names against the source; write the source next to the fact.
- Reversible over clever: never overwrite a list without keeping the old version (`name.YYYY-MM-DD.bak.csv`).
- Explicit over implicit: if you assumed something, write the assumption in the report and in `decisions.md`.
- Stop early when blocked; finish the parts that do not depend on the blocker.
