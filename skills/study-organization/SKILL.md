---
name: study-organization
description: Routine for supporting the person's studies through a learning platform such as Moodle — inventory
  of courses, deadlines and exams, materials downloaded and organized, reading and preparation plans, well-prepared
  drafts and study summaries in the person's own style for their review, and submissions only after their approval.
metadata:
  creator: Cadence project
  created: '2026-10-12'
  creation-method: Editorial Markdown guide written in the Cadence repository from the person's wish to have their
    Moodle courses handled autonomously; no external template or executable scripts.
  purpose: The person never misses a deadline, always has the materials and a prepared draft at hand, and decides
    themselves what they submit.
  scope: Installation-wide; included with steps about Moodle, courses, lectures, assignments, exams, semesters or
    universities.
---

# Supporting the person's studies

You keep the person's studies organized through the learning platform (for example Moodle). You read, collect, plan and prepare; the person reviews and submits. Submissions, forum posts and messages to lecturers are outside effect and go through `takt_approval_request`.

## 1. Getting in and around
- Open the platform with `takt_browser_open`, sign in with `takt_browser_fill_credential` (the login is stored by the person). If the platform redirects to a university or Microsoft sign-in, the stored login lists that address too; two-step forms are filled in two calls. If a second factor is required, stop and notify the person.
- Walk every course: overview page, every section, every activity (assignments, quizzes, forums, folders, links, lecture recordings). Platforms hide content behind "more" links and collapsed sections — expand them. Note what each activity is, its dates and its state (not started, submitted, graded).

## 2. The inventory
- `processes/studium/kurse.md`: one section per course with lecturer, schedule, grading scheme, materials, links.
- `processes/studium/fristen.csv`: date, time, course, item (assignment, quiz, exam, registration), requirements, state, link. Sort by date. Everything within 14 days is also listed at the top of `status.md`.
- `processes/studium/material/<course>/`: downloaded slides, scripts, readings (via the browser → `inbox/`, then moved here). Keep the platform's names; add a `README.md` per course listing what is there and what is missing.
- Register for exams and events only after approval; list registration deadlines separately — they are the most often missed.

## 3. Preparing assignments
- Read the assignment text twice and the rubric or grading notes; write the requirements as a checklist in `notes/studium/<course>/<assignment>/anforderungen.md` (format, length, structure, citation style, submission form, file type, naming). Read between the lines: what the lecturer rewards (own examples, references to lecture content, a clear structure).
- Collect sources from the course materials first, then from the library or the web; cite properly and keep a `quellen.md` with links and access dates.
- Write a complete draft in the person's own style if they have provided samples of their writing (`notes/stil/schreibstil.md`, built from texts they gave you — ask for them in the report if missing); otherwise write plainly and mark passages where the person's own experience, opinion or data is required with `[[Deine Erfahrung: …]]`. Keep the draft in the required format and file name.
- State clearly in the report what the draft is, which parts need the person's input, and that submission is their decision. Prepare the submission as an approval request with file name and the exact submission page.

## 4. Preparing for exams
Build a study plan backwards from the exam date (`notes/studium/<course>/lernplan.md`): topics per day, materials per topic, self-test questions with answers from the slides, a one-page summary per lecture. Refresh weekly; mark what the person said they already know.

## 5. Each run
Check announcements and forum posts for changed dates or new requirements; update `fristen.csv` and `status.md`; notify the person (`takt_notify_user`) for deadlines within 72 hours, grades posted, registration windows or anything requiring a second factor.

## 6. Rules
- The person stays responsible for the rules of their university; make it easy for them to review and decide, never submit on your own.
- Do not message lecturers or fellow students without approval.
- Keep private data (grades, matriculation number) only in the knowledge folder.
