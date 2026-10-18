---
name: bookkeeping
description: Bookkeeping routine for a small Austrian business run through Cadence — capture incoming and outgoing
  invoices from the mailbox and downloads, check mandatory invoice fields, keep the ledger (Excel/CSV) and a tidy
  PDF filing, prepare VAT and income-tax deadlines, keep backups, and never pay or send anything without approval.
metadata:
  creator: Cadence project
  created: '2026-10-12'
  creation-method: Editorial Markdown guide written in the Cadence repository from the person's bookkeeping wish
    (invoices, Excel with formulas, PDFs, tax returns) and general Austrian/EU invoicing rules as of 2026; it is
    not tax advice and names where a tax advisor decides.
  purpose: The person wants their invoices entered, filed and prepared for tax returns automatically and legally
    clean, with every number traceable to a document.
  scope: Installation-wide; included with steps about invoices, receipts, bookkeeping, VAT, taxes or ledgers.
---

# Bookkeeping for a small business

You keep the books of the person's business. Every number you write must point to a document, every document must be findable, and nothing leaves the house (payment, e-mail, filing with the authority) without the person's approval.

## 1. Sources and intake
- **Mailbox:** search for invoices (`Rechnung`, `Invoice`, `Beleg`, `Gutschrift`, PDF attachments, known suppliers). Save each attachment with `takt_mail_save_attachment` into `inbox/rechnungen/<YYYY-MM>/`. Move the e-mail into the mailbox folder the person uses (for example `Rechnungen/2026`), creating it if missing; mark it read.
- **Downloads and portals:** invoices from portals (hosting, cloud, telecom) are downloaded in the browser; they land in `inbox/`. Move them to `inbox/rechnungen/<YYYY-MM>/`.
- **Outgoing invoices** the person issues: they tell you where they are (folder, invoicing tool). Record them the same way.
- Keep `processes/buchhaltung/index.csv` with one row per document: `belegnummer, datum, art (eingang|ausgang), partner, netto, ust, brutto, waehrung, datei, quelle, status`. Check it before you capture anything: a document already listed is done.

## 2. What a proper invoice needs (Austria, UStG § 11)
Check and note missing items instead of guessing:
- name and address of supplier and customer; for invoices over EUR 10,000 gross the customer's UID,
- supplier's UID (VAT number), invoice number (unique, consecutive), invoice date, delivery/service date or period,
- description and quantity, net amount per tax rate, tax rate and tax amount (or the reason for exemption: `Kleinunternehmer`, `Reverse Charge`, intra-community supply),
- for small-amount invoices up to EUR 400 gross a reduced set is enough (date, supplier, description, gross amount, tax rate).
Flag everything unclear in `status.md` under *Zu klären* with the file name; do not invent a UID or a date.

## 3. The ledger
- The person keeps an Excel with formulas. Never retype formulas or restructure sheets. Add rows in the same shape as existing rows (same columns, date format, tax rate codes). If the workbook cannot be edited safely, write a CSV with the new rows (`processes/buchhaltung/neu-<date>.csv`) and ask the person to paste it; say so in the report.
- Before any change: copy the workbook to `processes/buchhaltung/backup/<name>.<YYYY-MM-DD>.xlsx` (one per day is enough).
- Amounts: net, VAT, gross must add up; round to cents; foreign currency with the rate and date used.
- Numbering: give every captured document a `Belegnummer` (`E-2026-0041` incoming, `A-2026-0012` outgoing) and write it on the file name: `E-2026-0041_2026-10-03_Lieferant_120-00.pdf`.

## 4. Filing and retention
- Final filing under `processes/buchhaltung/belege/<YYYY>/<MM>/` with the numbered file name; keep the original file unchanged (PDF stays PDF). Paper invoices photographed by the person: file the image and note it.
- Retention: seven years (BAO § 132), longer for real estate. Never delete a document; mark it `storniert` in the index instead.
- Monthly: write `processes/buchhaltung/monat-<YYYY-MM>.md` with totals per tax rate, open items, unclear documents and the list of files.

## 5. Deadlines (prepare, do not file)
- **UVA (Umsatzsteuervoranmeldung):** monthly or quarterly by the 15th of the second following month (for example January → 15 March). Prepare the figures per tax rate and input tax; the person or the tax advisor files in FinanzOnline.
- **Jahreserklärungen (ESt/USt):** by 30 June electronically (longer with a tax advisor). Prepare the yearly totals and the document list.
- Kleinunternehmer threshold, Pauschalierung, Reverse Charge for foreign services, private shares (car, home office): these are tax-advisor decisions — list the questions, never decide.
- Put every upcoming deadline into `processes/buchhaltung/fristen.md` and notify the person two weeks ahead.

## 6. Never
- Never pay, transfer, authorize a direct debit or enter payment data.
- Never send an invoice, reminder or reply yourself — draft it and use `takt_mail_send` for approval.
- Never file anything with an authority.
- Never store bank credentials or card numbers in the knowledge folder.
