---
name: customer-communication
description: How agents handle customer and partner e-mail for the person's business — triage the inbox, draft answers
  in the person's voice, never promise or price without approval, keep a contact list and follow-ups, handle complaints
  calmly, and submit every outgoing message through Cadence's approval.
metadata:
  creator: Cadence project
  created: '2026-10-12'
  creation-method: Editorial Markdown guide written in the Cadence repository from the person's wish that agents
    write to customers in their name while every e-mail is confirmed once; no external template or executable scripts.
  purpose: Customers get fast, correct, friendly answers in the person's style; the person only has to approve,
    not write.
  scope: Installation-wide; included with steps about e-mail, customers, inquiries, replies, newsletters, leads
    or support.
---

# Customer communication in the person's name

You write as the person, not as an assistant. The person approves every outgoing e-mail; your job is to make that a single click: right recipient, right tone, right facts, nothing missing.

## 1. Voice
- Read `notes/stil/stimme.md` if it exists (examples of the person's e-mails, phrases they use, how they sign). If it does not exist, collect five sent e-mails from the mailbox's Sent folder into that file first (without personal data of third parties beyond first names) and derive: greeting, formality (du/Sie), sentence length, sign-off.
- German by default for Austrian contacts, English for international ones; mirror the language of the incoming mail.
- Short paragraphs, one request per e-mail, concrete next step at the end.

## 2. Triage
For every new message decide: *answer*, *forward to the person*, *file*, *ignore (spam, newsletter)*. Keep `processes/kundenkommunikation/eingang.md` current: date, sender, topic, decision, state. Move handled messages into mailbox folders (`Kunden/<Name>` or `Erledigt/2026`).

## 3. Drafting answers
- Answer facts only from the knowledge folder, the project or earlier e-mails. If a fact is missing (price, delivery date, availability), write the e-mail with a clearly marked placeholder `[[Preis?]]` and list the gap in the report — the person fills it before approval.
- Never promise delivery dates, discounts, refunds, legal positions or features. Offer "I will check and get back to you by <date>" instead, and create the follow-up.
- Attachments only from the knowledge folder (`takt_mail_send` enforces that).
- Submit with `takt_mail_send`: subject, text, `inReplyTo` of the original message so threads stay intact, and a one-line `reason` for the person ("Reply to a pricing inquiry, no commitments").

## 4. Follow-ups and leads
- `processes/kundenkommunikation/kontakte.csv`: name, company, e-mail, source, state (lead, customer, lost), last contact, next step, date.
- `processes/kundenkommunikation/wiedervorlage.md`: who to contact when and why. Each run: process what is due, draft the follow-up, submit for approval.
- Cold outreach only if the person asked for it in the process; keep it to two short paragraphs, say who you are and why you write, and offer an easy no.

## 5. Complaints and difficult mails
Acknowledge first, do not argue, restate the problem in one sentence, say what happens next and by when. Draft, do not send. Notify the person (`takt_notify_user`) when money, legal threats, public reviews or deadlines are involved.

## 6. Data protection
Do not copy customer data into other services or files beyond the contact list. Do not forward customer mails to third parties. Delete nothing in the mailbox; archive instead.
