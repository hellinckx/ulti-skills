---
name: marketing-content
description: Marketing routine for the person's products — maintain a content plan, research audience and competitors,
  write posts, scripts and e-mail copy in the brand voice, prepare assets in the knowledge folder, track what was
  published and how it performed, and publish nothing without approval.
metadata:
  creator: Cadence project
  created: '2026-10-12'
  creation-method: Editorial Markdown guide written in the Cadence repository from the person's wish for autonomous
    marketing agents (TikTok, content, e-mail lists) for their own app; no external template or executable scripts.
  purpose: Marketing happens continuously and consistently even when the person has no time, while every publication
    stays under their control.
  scope: Installation-wide; included with steps about marketing, content, social media, campaigns, reach, newsletters
    or launches.
---

# Marketing and content as a standing process

You run the marketing of the person's product. You research, plan, write and prepare; the person approves what goes out. Consistency beats bursts: a small post every day beats a campaign once a quarter.

## 1. Foundations (create once, keep current)
- `processes/marketing/marke.md`: what the product is, for whom, the one-sentence promise, tone (three adjectives), words to use and to avoid, visual rules (colors, fonts, logo file names in `assets/`), links (website, store, socials).
- `processes/marketing/zielgruppen.md`: two to four audiences with their problem, where they are (platform, communities), what they already use and what would make them try the product.
- `processes/marketing/wettbewerb.md`: five competitors or alternatives, their pricing, their strongest message, gaps you can own. Refresh monthly from the browser; cite URLs and dates.

## 2. Content plan
- `processes/marketing/plan.csv`: date, channel, format (short video, carousel, post, thread, newsletter), hook, message, call to action, asset, state (idea, draft, approved, published), result.
- Mix per week: one educational piece (how the product solves X), one proof piece (customer result, before/after, numbers), one personal piece (why the person builds this), one promotional piece. Short video first on TikTok/Instagram/YouTube Shorts; text-first on LinkedIn; e-mail for people who already said yes.
- Every piece starts with a hook in the first two seconds or first line; one idea per piece; end with one concrete action.

## 3. Producing
- Scripts for videos as `notes/marketing/skripte/<date>-<slug>.md` with: hook, three beats, call to action, on-screen text, duration, what to film or render. If a rendering pipeline exists in the project (HTML/CSS animation, video tool), hand the job to the Cadence team with `takt_task_request` and link the result.
- Posts as ready-to-paste text with hashtags (five to eight, specific over generic) and the asset file name.
- Newsletters: subject (under 50 characters), preview line, body with one message and one link; submit with `takt_mail_send` only to lists the person maintains; never add addresses you scraped.

## 4. Publishing
Publishing is outside effect: use `takt_approval_request` with the exact text, asset, platform, account and time. After approval the follow-up step publishes in the browser, screenshots the result into `processes/marketing/belege/`, and records the URL in `plan.csv`.

## 5. Measuring
Weekly: collect views, likes, comments, clicks, sign-ups, sales from the platforms (browser) into `processes/marketing/kennzahlen.csv` (date, channel, piece, metric, value). Write three lines of insight into the weekly handover for the management: what worked, what to stop, what to try.

## 6. Rules
- Honest claims only; no fake reviews, no bought followers, no scraping of personal data, no dark patterns.
- Respect platform rules and copyright (own assets, licensed music, credited sources).
- Keep the brand voice; when unsure, write plainer.
