---
name: iso-world-site
description: "Build websites in the \"iso-world\" style - a live, hard-edged isometric 3D diorama that runs behind the page and that the camera travels through as you scroll, flat-shaded blocks with ink outlines and hatch stripes, painted mono labels, huge tight uppercase grotesk headlines, soft rounded glass panels and animated isometric illustrations. Works for any topic (a bakery, a law firm, a SaaS tool, a hospital, a band, a school) because the subject is turned into a working miniature system. Use this skill whenever the user asks for a \"3D website\", \"isometric website\", a site \"with 3D animations / 3D renders\", a \"fett geile 3D Webseite\", a scroll-driven 3D landing page, or wants an existing site redesigned in this look, even if they don't name the style. No WebGL, no libraries: plain HTML, CSS and canvas."
metadata:
  creator: hellinckx
  created: '2026-10-21'
  creation-method: Written description of a website style and its build workflow. The collection contains the
    method only; it ships no engine code, template, demo page or images.
  purpose: A recognisable 3D look for websites without WebGL or libraries, where the subject becomes a working
    isometric miniature that the camera travels through on scroll while the content stays calm and typographic.
  scope: Any website that should show its subject as a scroll-driven isometric diorama. Pairs with color-system
    for palettes, web-design-craft for composition, motion-and-graphics for other 3D work, and responsive-evidence
    for verification.
---

# iso-world site

A page in this style feels like looking down at a **working miniature of the subject**. A small 3D world (stations, a
conveyor path, things moving through it, lamps switching on) sits fixed behind the content. As the visitor scrolls, the
camera glides from station to station, and each chapter of the story is told at one station. Everything else on the page
is calm, typographic and precise, so the world can be the one loud thing.

This file describes the style without colours, then the workflow. It contains no code: build the world and the page
for each project from this description.

## The style, colour-independent

**1. A diorama, not decoration.** The 3D world is a model of how the subject actually works. Things (orders, patients,
songs, tickets, parcels) flow through stations, queue at the slow step and get counted at the end. Motion always means
something: work happening, waiting, finishing. Nothing floats, spins or sparkles just to look busy.

**2. Hard-edged flat shading.** Every object is a box (or made from boxes). Each face is a flat fill: top 100 %, front
87 %, side 72 % of the material colour. Every edge gets a 1.3–2.4 px ink outline with round joins. There are no gradients,
no lighting and no textures on objects. Only three "materials" exist: **light** (the main objects), **dark** (machines,
housings) and **accent** (whatever is active right now). Diagonal **hatch stripes** mark special surfaces: hazard pads,
blocked state, a beam, a press, a planned zone. Dashed **ghost wireframes** show planned or virtual things.

**3. Everything is labelled like a machine.** Painted on the floor and on box faces, in a monospace font, uppercase:
station codes, batch IDs, counters and short captions with units. The labels are content, so they come from the
subject's real units and vocabulary.

**4. Two radii.** Hard little things are tight (2–4 px: buttons, chips, inputs, the world itself). Containers are soft
and rounded (16–20 px: glass plates, app windows, cards, passes). The soft, blurred glass panels with a deep, low shadow
float above the hard-edged world. This contrast is what makes the style feel polished and *rund*.

**5. Typography.** There are two families, each with one job:
- Display/body: a tight grotesk at weight 700. H1 is 42–88 px, line-height 0.96, letter-spacing −0.035em, uppercase.
  H2 is 30–48 px, −0.03em. Headlines are short declaratives that end with a full stop. One word may switch to the accent
  colour.
- Utility: a monospace for every eyebrow, label, meta line, counter and button-ish link. It is set uppercase at
  11–13 px with 0.08–0.14em tracking.
- An eyebrow is mono uppercase with a small 18×6 accent bar in front of it. Every section starts with one.

**6. Restrained palette roles.** Use one page background with two raised steps, three text greys and **one** accent. The
accent may simply be the foreground colour, which gives a fully monochrome look (the purest version of the style). The
world reads seven scene tokens from CSS variables (floor, grid, belt, dark, light, accent, outline). Change those and the
whole world recolours. See *Palette roles* below.

**7. Physical-object UI.** Interface pieces are modelled on real objects from the subject's world. Examples: a split-flap
departure board for the hero headline, ID passes on lanyards that flip over, a receipt or ticket printer for a contact
form, an app window with a title bar holding a live canvas, a status legend with lamps. Pick one or two per site that fit
the topic.

**8. Quiet layout.** The content is 1200 px wide with generous section padding (104 px desktop / 64 px mobile). Chapters
over the world are 125vh tall with the plate on alternating sides (left / right / center). Normal sections below the
journey have a solid background, so reading stays easy. Primary buttons have a **hard offset shadow** (`3px 3px 0`) that
grows on hover.

**9. Motion rules.** The camera moves only with scroll, eased with smoothstep, and lifts a little ("bump") between
stations. Pointer parallax is tiny (about 0.06 rad). Content reveals once with a 14 px rise. With
`prefers-reduced-motion`, the world renders as a single still frame that still follows the scroll, and nothing loops.
Canvases pause off-screen and in hidden tabs, and quality adapts to frame cost.

## Workflow

### 1. Turn the topic into a world (the most important step)
Before writing any markup, answer these four questions in a few lines:
- **What flows?** That becomes the tokens: orders, dough batches, patients, contracts, support tickets, songs, students.
- **Where does it stop?** That becomes 4–7 stations in order. The first is the source, the last is the dock or exit.
- **Which step is slow?** Give it a longer dwell time. The queue that forms there is your "aha" moment.
- **What do the labels say?** Use real codes, units and short captions from the domain.

| Topic | Tokens | Stations (source → … → dock) | Slow step |
|---|---|---|---|
| Bakery | `DOUGH-` batches | flour store → mixer → proofing (tower) → oven (press) → counter | proofing |
| Law firm | `CASE-` files | intake → review → drafting (screen) → signature → filed | review |
| SaaS analytics | `EVT-` events | ingest → validate → enrich → dashboard (screen) → archive | enrich |
| Hospital | `PT-` patients | admission → triage → imaging (machine) → ward (tower) → discharge | imaging |
| Music label | `TRK-` tracks | demo inbox → studio → mix (press) → master → release | mix |

Station kinds: `source`, `machine` (housing + portal over the belt + lamp), `press` (a ram that stamps while busy),
`tower` (stacked silo or rack), `screen` (a panel with a live counter), `dock` (hatched pad where finished items pile up).

### 2. Write the story as chapters
Each station gets one chapter: an eyebrow with a number, an H2 statement and 1–3 sentences. Add **one** proof element:
a states legend, a stat, chips, or a short list. The hero chapter is station 0 with a bare plate (no glass) and a scrim.
The last chapter is centered and holds the call to action. Below the journey come normal sections: features with an app
window or iso drawing, a card grid with iso covers, then the footer call to action.

### 3. Choose the palette roles
Ask the user only if the brand colours are unknown and matter. Otherwise choose by the subject: monochrome graphite for
engineering or serious topics, warm bone (light) for craft or editorial, one saturated accent for consumer topics. Define
all roles as CSS variables on `:root`, including the seven scene tokens.

### 4. Build the world and the page
Write small, dependency-free files for the project:
1. **A canvas-2D 3D engine:** an orthographic isometric camera (azimuth, elevation, distance, target), projection of
   world points to screen, boxes drawn back to front with the three face shades and ink outlines, hatch fills, dashed
   ghost boxes, and text painted onto floor and faces. It handles device pixel ratio, resize, scroll and pointer input,
   pauses off-screen and in hidden tabs, lowers quality when frames get expensive, and renders a still frame under
   reduced motion.
2. **A data-driven world:** a config of stations in path order (label, caption, kind, dwell, optional camera override),
   a token spawner (prefix, start number, speed, interval, maximum), queues in front of busy stations, lamps that light
   while a station works, a counter at the dock and optional props (stacks, racks, pallets, ghost boxes) placed from a
   seed. Keep the spawn interval slightly shorter than the slowest dwell, so a queue forms but does not fill the line.
3. **A scroll camera:** each chapter marks its station; the camera eases between station anchors, alternates a small
   left/right turn, and shifts the world away from the side the chapter's plate sits on.
4. **Isometric SVG illustrations** for features and cards: boxes, hatched pads, callout pills and dashed routes in the
   same materials as the world, one idea each, reading the same CSS variables.
5. **Page components:** nav, eyebrow, buttons, glass plate, chapter, states legend, stat, chips, feature row, app window,
   cards, live feed and footer, all from the tokens.
6. Inner pages: a fixed camera on one station in a hero strip about 70vh tall instead of the full journey, or a slow
   orbit around one station inside an app window.

### 5. Verify like a visitor
Open the page in a browser preview and check the following before calling it done:
- Hero: headline readable over the scrim, world visible on the right, no console errors.
- Scroll to the middle of every chapter: the camera rests on that station, the plate does not cover the station, and the
  queue at the slow station is visible.
- Mobile (375 px wide): no horizontal scroll, plates readable, the world still visible.
- Reduced motion: still frame, no loops.
- Theme tokens: if you change the palette, the world and the iso drawings must follow.

## Palette roles
| Role | Meaning |
|---|---|
| background, raised, raised more | page, raised surface, plates and cards |
| text, secondary, muted, faint | text, secondary text, labels, decoration only |
| accent, on-accent | the one active colour (CTA, current item, lit lamp) and the text on it |
| scene floor, scene grid | world floor and its grid lines (grid 3–6 % away from the floor) |
| scene belt | conveyor and pallets, slightly lighter than the floor |
| scene dark | machines and housings |
| scene light | the main objects, strongest contrast to the floor |
| scene accent | active objects in the world, usually equal to the accent |
| scene outline | ink outlines and hatch stripes (near-black on dark themes, deep ink on light themes) |

Rules:
- Keep body text at 4.5:1 or more against the background, including muted text when it carries labels. Faint is for
  decoration only.
- Don't use red, amber or green as the accent if the world shows states (busy, blocked, OK). Those colours carry meaning.
- On light themes the outline stays dark and scene light becomes near-white, so the blocks still pop.
- From a brand colour: accent = brand colour with an on-accent that reaches 4.5:1; background = brand hue at 8–15 %
  saturation and 10–13 % lightness (dark) or 92–95 % (light), raised steps 3–5 % apart; text = same hue at 2–4 %
  saturation; scene floor = background, grid 4 % off, belt 3 % lighter, dark about 20 % lighter, light close to the
  text colour, outline 5–8 % darker than the floor.
- After a theme switch, tell the world and the drawings to re-read the variables.

## Copy voice
Short and factual, written in the present tense, like a site sign or a machine label. Headlines state one thing
("The slow step sets the pace."). Body text explains what the visitor can see in the world ("The lamp is lit while a
batch is inside."). Don't invent numbers, customers or claims for a real business. Use the user's facts, or mark
placeholders clearly (`[number]`).
