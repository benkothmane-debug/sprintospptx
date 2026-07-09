---
name: sprintospptx-v3
description: >
  SprintOS PPTX V3 — THE reference PowerPoint skill of Sprint OS (replaces sprintospptx and any other pptx skill).
  Use whenever a .pptx file is involved, as input or output: create a deck / presentation / slides / workshop /
  training / pitch; read, parse, or extract content from a .pptx; edit, extend, or merge an existing
  presentation; work from a template. Generates native editable decks with DENSE consulting-grade content
  (McKinsey/MBB): sourced data extraction (one .md per source), self-contained wording, action titles,
  subject brand identity resolved automatically (color + logo), mandatory structure (cover + agenda +
  executive summary + dividers + closing on crafted dark backgrounds), visual and content QA in a loop.
  Trigger on: deck, slides, presentation, PowerPoint, .pptx, workshop, training, pitch, keynote,
  présentation, atelier, formation, COPIL.
license: >
  Open source (MIT). Made by Sprint OS — see LICENSE.
---

# SprintOS PPTX V3 — Deck Builder

> V3 = a **battle-tested technical mechanism** (editing existing .pptx files, OOXML scripts, QA-safe
> fonts, pptxgenjs pitfalls, visual QA by an independent reviewer) **+ the Sprint OS doctrine** (dense
> consulting-grade content, sourced data, self-contained wording, subject brand identity).
> The deliverable is always a **native editable .pptx** (real text, tables, charts — never images of text).

**You produce working documents, not marketing keynote slides.** A reader must understand the deck
on its own, without a presenter. Useful density is a quality; a half-empty content slide is a defect.
Golden rule: **content first, style second** — no slide is built until the data has been
extracted and the analysis laid out.

## Output language (ALWAYS detect first)

The DECK is written in the language of the user's request: French request → French deck; English
request → English deck; any other language → that language. When ambiguous (mixed-language request),
ask ONE question. This covers ALL visible text: titles, body, exhibit labels, table headers, band
labels ("Implication"/"Bottom line" → use the deck language), sources, cover metadata.
Language-specific writing rules in `references/wording.md` apply according to the OUTPUT language
(e.g., French anglicism bans apply only to French decks; equivalent English filler-word bans apply
to English decks). The em-dash ban applies to ALL languages.

⚠️ **Template default labels are ENGLISH** ("Key takeaway", "Proof", "Recommendation", "Decision
required", "Recommended"…). For a non-English deck, ALWAYS pass the localized label through the
template options (`bandLabel`, `proofLabel`, `heroTag`, `soWhat.head`, `need.head`, `reco.head`…) —
never let an English default leak into a French deck, and vice versa. QA checks band labels and
badges against the deck language.

## Quick routing

| Task | Guide |
|------|-------|
| Read / analyze a .pptx | `python3 scripts/extract_text.py file.pptx` + `scripts/thumbnail.py` (visual preview) |
| Edit an existing .pptx or start from a template | [editing.md](editing.md), then QA below |
| Create a deck from scratch | Sprint OS pipeline below + [pptxgenjs.md](pptxgenjs.md) |

---

## Reading a .pptx

```bash
# Text extraction (one `## Slide N` section per slide, tables and notes included)
python3 scripts/extract_text.py presentation.pptx

# Visual preview as a grid (requires soffice on the PATH, see Dependencies)
python3 scripts/thumbnail.py presentation.pptx

# Raw XML
python3 scripts/office/unpack.py presentation.pptx unpacked/
```

## Editing an existing .pptx

**Read [editing.md](editing.md) for the details.** Workflow: analyze with `thumbnail.py` → unpack →
manipulate the slides → edit the content → clean → pack.

The doctrine also applies to editing: if you are asked to "improve", extend, or redo existing slides,
apply the same requirements (action title, density, sources, self-contained) to the slides you touch.

---

## Creating a deck — Sprint OS pipeline (always in this order)

```
P. PLAN              → task list: pipeline steps + 1 task/slide (detailed content)
0. ARCHETYPE         → intent of the deck (strategy / workshop / training / explainer / pitch / status)
                                                                    [references/deck-archetypes.md]
1. DATA ANCHORING    → one .md per source document (verbatim copy)  [references/data-extraction.md]
2. CONTENT & WORDING → final text, so-what, evidence labels         [references/wording.md]
3. DECK PLAN         → structure + register per slide               [references/page-types.md + slide-layouts.md]
C. MBB CRAFT         → fine-grained rules for titles / exhibits / typography / chrome [references/mbb-slide-craft.md]
4. BRAND IDENTITY    → web search for the subject's brand → brand/palette.md  [references/brand-identity.md]
5. DESIGN            → tokens, two faces, one accent                [references/design-tokens.md + structure-and-color.md]
6. BUILD             → pptxgenjs via assets/deck_helpers.js + assets/gen_bg.cjs + [pptxgenjs.md](pptxgenjs.md)
7. QA                → render to images + inspection + fixes in a loop (QA section)
```

### P. Plan (mandatory)

Create a task list from the start and keep it up to date — via the **agent's task tool if the
environment provides one**, otherwise in a `plan.md` file in the working directory (same content,
checkboxes). Two levels:
1. **One task per pipeline step** (Archetype, Data anchoring, Content, Plan, Brand, Design, Build, QA).
2. **One task per planned slide**, whose description defines the content in detail: register
   (analytical / prose / visual), **action title** (the conclusion sentence), key message, planned exhibit with
   its data, proof points labeled `[F/I/A/E]`, implication / so-what, sources (`sources/*.md`).

Do NOT start the Build until the slide-by-slide list is written: the detailed plan IS the deliverable
of step 3. Check off each slide once built AND passed through QA.

### 0. Archetype + declared brief reading

**⚠️ INTENT LOCK — answer the user's ACTUAL request, first question of the whole pipeline.**
Before anything else, determine what the user is asking for:
- a **QUESTION TO DECIDE** ("should we…?", "which option…?", "recommend…", "is it worth…?")
  → decision deck: answer-first, executive summary in SCR, recommendation, decisions requested;
- a **SUBJECT TO PRESENT / UNDERSTAND** ("present…", "describe…", "overview of…", "panorama",
  "explain…", "what is…") → **descriptive deck**: key facts, how it works, dynamics, players,
  numbers, key takeaways — **NO recommendation, NO "decision requested", NO invented question**.

**NEVER reframe a descriptive request as a decision.** "Present solar energy in Europe" must
produce a panorama of solar energy in Europe (capacity, growth, players, economics, outlook,
what to remember) — NOT "Should we invest in solar energy?". Inventing a decision question the
user never asked is a top-severity defect, checked in QA. Action titles remain factual
conclusions in both cases ("EU solar capacity tripled since 2019"), never recommendations
unless the intent is decision. The same lock applies in reverse: a "help me decide" request
must not produce a flat descriptive deck.

Then identify the **deck type**, because it drives the structure: strategy/board,
workshop, training/course, explainer, pitch, project status update, keynote. Templates → `references/deck-archetypes.md`.

Then **declare your reading of the brief in one line** (taste-craft rule): "I read this as:
intent \<decide | present/understand | teach | facilitate | persuade | report>, \<archetype>
for \<audience>, register \<sober-analytical | premium | pedagogical | **clear keynote**>, density
\<read | presented>, background \<halo | beams | grid>". This line locks the choices — starting with
the intent; in case of genuine ambiguity, ask ONE question, not a questionnaire. Details → `references/taste-craft.md`.

> The **clear keynote** register is the historical style of the builder's V1, kept as an option
> (`references/keynote-style.md`): bold subject-linked palettes, visual layouts, big numbers,
> airy. Choose it for keynotes, launches, and general-public communications; in that case its rules
> take precedence over the density floors, but the V3 invariants remain (no em dash, sourced
> numbers, one accent, QA).

### 1. Data anchoring (NON-negotiable)

For **each source document** (PDF, .docx, .xlsx, web page, .pptx…): create `sources/<name>.md` that copies
**verbatim** all useful information (numbers, tables, key passages). Do not summarize at this stage — copy.
Never work from memory; if material is missing, run a web search and source it. **No number in the
deck may exist without being traceable to a `sources/*.md`.** Details → `references/data-extraction.md`.

### 2. Content & wording

Turn the data into useful content in `content/<deck>.md`, slide by slide, with an explicit so-what and
evidence labels: `[F]` sourced fact · `[I]` inference · `[A]` assumption · `[E]` estimate.

> ⚠️ **Write the FINAL TEXT, in sufficient quantity** — this is the number-one cause of hollow slides. The
> volume targets are **FLOORS, not ceilings**: written page ≥ 180 words; exhibit + prose ≥ 100 words;
> aim for ≥ 75% of the usable zone filled; **develop as much as the analysis demands**, with a single
> absolute cap: **1500 words per slide** (beyond that, split into two slides). The build only typesets this
> text: if the content is thin, enrich the analysis BEFORE building — do not produce an empty shell. Wording
> must be **self-contained**: complete sentences, jargon glossed, no symbol grammar (`=`, `→`).
> Details → `references/wording.md`.

### 3. Plan + register for each slide

**Form follows the idea** — three registers, to vary across the deck:

| Register | When | Rendering |
|----------|------|-----------|
| **Analytical** | a **number** proves the point | light background, one central exhibit + reading + implication |
| **Prose (written)** | the idea is qualitative / explanatory / argumentative | light background, real paragraphs (lead paragraph + developed points) |
| **Visual** | strong moment (statement, transition, quote) | crafted dark background, large type, 1 idea |

> ⚠️ Do not put everything into "number boxes" or "chart + 3 bullets": that is what makes a deck thin and
> monotonous. If the point is an analysis, **write it out**. A deck meant to be **read** (brief, memo) carries real paragraphs;
> a deck meant to be **presented** is leaner (depth in the presenter notes, see `addNotes()` in pptxgenjs.md).

**Horizontal logic**: once the plan is laid out, read the action titles alone, in order: they must
tell the complete argument like continuous text. If not, fix the plan before building. Each slide
reproduces the pyramid internally: action title → **bold lead-ins** (2-4 argument sentences) → proofs in
regular weight; a rushed reader who reads only title + bold understands everything. Details → `references/mbb-slide-craft.md`.

**Structure slides: decide which to include, based on the nature of the content.** They are not all
mandatory all the time, but when the content calls for them, they MUST be there: the decision is made
here (step 3), slide by slide, and goes into the task list.

| Structure slide | When to include | Rendering |
|-----------------|-----------------|-----------|
| **Cover** | Always | **LIGHT by default** (`kit.coverLight`: large type on white + accent composition); dark (`coverDark`) only if requested or for a very premium register |
| **Agenda / table of contents** | As soon as the deck exceeds ~5 slides; carries the **purpose of the document** | Dark |
| **Objectives** | Workshop (session objectives), training ("by the end, you will know how to…"), any meeting where the audience must know what it is there to do or decide | Light or dark |
| **Executive summary** | As soon as the deck carries an analysis or a recommendation (strategy, board, study, COPIL): the densest slide, complete answer in SCR. Unnecessary for a pure workshop | Light |
| **Section dividers** | From 2 sections or a deck > ~10 slides; more frequent in workshop/training (to pace) | Dark |
| **Recap / key takeaways** | Training and explainer, before the closing (3-5 takeaways) | Light |
| **Next steps / decisions requested** | COPIL, strategy, workshop debrief: who / what / when | Light |
| **"Appendix" divider + appendix** | As soon as solid analyses have been cut from the main line (cut TO the appendix, never delete) | Dark |
| **Closing** | Always: synthesis + next steps + contact; never an empty "Thank you" | Crafted dark |

Archetype-specific pages (workshop activities, step-by-step, quiz, RAG status, control tower…)
→ `references/deck-archetypes.md`.

> **Sandwich**: agenda, dividers, and closing = crafted dark background (via `gen_bg.cjs`); content
> pages = light background. **Exception: the cover is light by default** (user preference,
> `kit.coverLight`). See `references/structure-and-color.md`.

**Layout variety — by judgment, not by quota.** The default reflex is variety (the kit offers
**20** templates in `slide_templates.js` + the catalog of 60 patterns + free composition on the grid):
do not recycle the same quintet out of laziness. But **it is a conscious per-slide choice, not a
counter**: at step 3, for each piece of content, go through the table in `references/slide-layouts.md` and
pick the template that **fits THIS message** (timeline → `timelineBlocks`/`phasesRoadmap`, comparison →
`scenarioCards`/`registerTable`, canvas → `canvasGrid`, journey → `lanesMatrix`, decision →
`decisionNote`/`decisionCockpit`…). If the right format repeats, so much the better:
- **DELIBERATE repetition takes precedence over variety.** A series of parallel slides (same objects, same
  nature of comparison, a run of homogeneous steps) MUST keep the same template: reading coherence comes
  before diversity. Never switch layouts just to "look varied".
- What we hunt is **suffered monotony** — the same template reused without asking the question. Asking
  it, answering "the same one", and keeping it, is a good outcome.

### 4. Brand identity → `brand/palette.md` deliverable (NON-negotiable, like data anchoring)

Deck about a company or an identifiable subject → **search the web** for its brand guidelines (official
color via brand guidelines / press kit, logo, possibly typography), with extraction from the logo as confirmation:

```bash
curl -s "https://logo.clearbit.com/<domaine>" -o /tmp/logo.png && node assets/brand_colors.cjs /tmp/logo.png
```

Then **write the resolved palette to `brand/palette.md`** (canonical format → `references/brand-identity.md`):
official colors with **hex + source URL + confidence label [F/E/A]**, derived tokens
(accent / accentInk / accentOnDark / band), downloaded logo (+ dark-background version), typography. This file
is **the single source of truth for color**: the build injects its tokens into `THEME.accent*` and `gen_bg.cjs`,
and QA checks the deck against it. An NVIDIA deck is NVIDIA green (#76B900, sourced), a Stripe deck Stripe
indigo. Subject with no brand → the file still exists (palette by subject type, justified).

### 5. Design (tokens)

One theme, **two faces** (light analytical / dark visual), **a single accent color**, set in one single
place. Palette, dense type scale (action title 21-22 pt, headers / key messages 14-16 pt, body 12-14 pt,
KPI stat callouts up to 72 pt, sources 8 pt), layout constants → `references/design-tokens.md`.

### 6. Build

Build with **pptxgenjs** (full guide and pitfalls: [pptxgenjs.md](pptxgenjs.md)), relying on,
in this order:
1. **`assets/slide_templates.js`** — 20 complete slide templates (exec summary, reco one-pager,
   exhibit+insights, MECE buckets, scenarios, COPIL, decision cockpit, roadmap, canvas, swimlanes…):
   guaranteed geometry, you supply the content. Catalog + mapping table → `references/slide-layouts.md`;
   one runnable example per template → `examples/golden-deck.js`.
2. `assets/deck_helpers.js` — grid engine (`zone`/`cols`/`rows`/`pad`), craft helpers (`exhibitHeader`,
   `cagrArrow`, `tracker`, `harvey`, `footnotes`…) and primitives (frames, implication, tables, charts…)
   for free composition when no template fits;
- `assets/gen_bg.cjs` — crafted dark backgrounds (`cover` / `agenda` / `divider` / `close` variants),
  **3 composition styles**: `halo` (rings + glow), `beams` (diagonal beams, premium),
  `grid` (sober grid, engineering). One style per deck, **chosen by feel when reading the brief**
  (`node assets/gen_bg.cjs <outdir> <accent> <style>`);
- `examples/example-build.js` — minimal runnable template (cover + analytical page + closing).

Colors come **exclusively from `brand/palette.md`** (tokens injected into `THEME` + `gen_bg`);
if a color must change, edit that file then rebuild — never an improvised hex in the build code.

When building each slide, apply the **craft reference** (`references/mbb-slide-craft.md`):
exhibit header with unit + period, direct labels rather than a legend, key series in accent / rest in
gray, at least one annotation per exhibit (CAGR arrow, callout, delta), table numbers right-aligned,
two-body-sizes rule (14/12), section tracker if > 15 slides, numbered footnotes.

**Bold in body text (mandatory, rushed-reader rule)**: `**bold**` markup is supported
by `proofs`, `prose`, `band`, and the template bodies (`kit.md()` converts it into runs). Bold the
**key numbers and thesis sentences** of each bullet/paragraph: title + bold must be enough to understand the
slide. A body with no bold at all is a QA defect.

**Icons: MANDATORY by default** (user preference; a deck with no icons at all is a QA defect):
the `icon` field of the templates (monochrome PNG via `assets/icon.cjs`, to PRE-GENERATE at the start of the build because it is async)
on agenda, exec summary, key messages, bands, and KPI strips; never on analytical exhibits.

**Exhibit variety — a PER-SLIDE questioning, not a quota.** The real defect is not "not
enough exhibits": it is falling back on a format **by reflex/laziness** when another would serve
the message better. The discipline is therefore a conscious choice, slide by slide, never a mechanical counter:
- **For each slide, ask the question**: "which form best fits THIS message?" — a real exhibit
  (chart, waterfall, 2×2 matrix, timeline, funnel, Mekko, scatter, harvey balls, SVG gauge…), a card,
  a table? Use the "nature of the message → type" table in `references/mbb-slide-craft.md`.
- **DELIBERATE repetition is legitimate.** Consecutive parallel slides (same nature of content,
  comparison of N objects on the same grid) MUST keep the same format: coherence then takes precedence over
  variety. Never force a different format just to "look varied".
- What we hunt is **monotony by default**: all-cards or all-bars because the question was never
  asked. If, after asking it, the right format is the same as the previous slide, that is perfectly fine.
- Simple heuristic (indicative, not a rule): from ≥ 3 charts on, if they are all the same type for no reason,
  ask again whether a waterfall / a structure / a matrix would say one of them better.

**Varied cover**: `coverLight` accepts 8 compositions: `beams` (diagonal beams), `arcs`
(quarter circles), `mosaic` (tiles), `rings` (thin rings), `dots` (dot grid), `bands` (flag
header), `corner` (color block in the corner), `split` (editorial vertical panel). No mechanical rule:
**choose by feel the one that fits the subject, and inventing a new one is allowed** (pptxgenjs
shapes in the palette colors, text stack ≤ 4 elements respected). Variety comes from free
choice, not from an imposed rotation.

**`highlight` is semantic**: NEVER pass it when items are of equal importance; only
for a genuinely intended emphasis (recommended option, central message).

After each `writeFile`, **recompress**: `python3 scripts/rezip.py deck.pptx` (pptxgenjs writes an uncompressed ZIP).

### Advanced visual effects (beyond pptxgenjs)
pptxgenjs cannot do gradients on shapes (glow = text only). Four levers added for more beautiful slides,
all **reliable under LibreOffice rendering**:

1. **Native gradients** (`scripts/effects.py`). `dark` cards (dark hero/focal/KPI) are marked via
   their `objectName` (`kit.grad([hex1,hex2],angle)`); **after the build**, run
   `python3 scripts/effects.py deck.pptx` which converts these shapes into real OOXML `<a:gradFill>`. Graceful
   fallback: without this pass, the shape keeps its solid fill. Driven by `THEME.gradients` (default `true`).
   **Build order: `node build.js` → `effects.py` → `rezip.py`.**
2. **SVG exhibits → PNG** (`assets/svg.cjs`). The universal escape hatch: anything SVG can draw
   (gradient gauges/donuts via `svg.donutGauge`, radial bars via `svg.radialBars`, or a custom SVG)
   becomes a slide image. `await svg.render(svgString, outDir, name)` → PNG, placed via `addImage`.
   **Async → pre-generate BEFORE the synchronous build** (like the icons).
3. **Glow on big numbers** (`metricStrip(..., {dark:true})`). A **dark** KPI strip combines native gradient
   + halo (`glow`, native pptxgenjs, text only — only renders on dark backgrounds). Driven by `THEME.glow` (default
   `true`), subtle by default (size 4, opacity 0.3). On light backgrounds, no glow (it would drown there).
4. **Duotone photo** (`assets/duotone.cjs`). `await duotone('photo.jpg', outDir, {dark, light, overlay})` renders
   a photo as a dark brand-colored background, legible under a light title; pass the PNG as `bgPath`
   to `coverDark`/`dividerDark`. **Async → pre-generate.**

> Async pre-generation: icons (`icon.cjs`), exhibits (`svg.cjs`), and duotone backgrounds (`duotone.cjs`) are
> generated BEFORE the pptxgenjs build (which is synchronous). Then chain build → `effects.py` → `rezip.py`.

---

## Typography & fonts — QA reliability

**The font names written in the .pptx are rendered by the user's PowerPoint, not by this
environment.** Visual QA goes through LibreOffice, which substitutes missing fonts — sometimes with
different metrics: the preview may show an overflow (or a good fit) that the real deck will not have.

- **Safe fonts** (faithful metrics in QA *and* present in Office): **Arial, Calibri, Cambria, Times New
  Roman, Courier New, Bookman Old Style, Century Schoolbook**. Prefer these for body text and any element where
  fit matters.
- **Sprint OS premium register** (Space Grotesk / DM Sans / JetBrains Mono, see design-tokens): only if
  the fonts are installed in `~/Library/Fonts` — otherwise stay on the sober Arial/Helvetica register.
- **User-requested font outside the safe list**: use it where requested, but size those
  containers with ~10% margin and do not trust the fit shown by QA on those elements.
- **QA-unreliable fonts** (substitute with different metrics): Georgia, Trebuchet MS, Impact, Arial Black,
  Garamond, Consolas, Palatino Linotype, Calibri Light. OK for titles/accents with margin; fit not verifiable.
- **Never Aptos** (no reliable substitute here, absent from older Office versions).

---

## Anti-patterns (reject these outputs)

**Substance (the most serious):**
- **Hollow slides**: vague titles, telegraphic 3-word bullets, no so-what, large useless whitespace.
  Every bullet carries a fact, a number, or an implication.
- **Poster slide**: a content slide reduced to one big number + 5 words. Stat callouts (up to
  72 pt) are welcome as an **element** of a dense slide, not as the whole slide; the
  one-idea-one-type format stays reserved for visual pages (dividers, statements).
- Numbers without **unit / period / source**; assumptions presented as facts; working from memory
  without `sources/*.md`.
- Text that is not **self-contained**: symbols as grammar (`=`, `→`), unglossed jargon.
- **Em dash "—"** in slide text: FORBIDDEN (replace with ":", a comma, parentheses, or two
  sentences). Emoji: at most 1/slide, never on an analytical exhibit.

**Form:**
- Cover / agenda / closing on a white background or a plain flat fill (always a crafted dark background).
- The whole deck as "chart + 3 bullets" or number boxes: vary the three registers and the layouts.
- More than **one accent color**; decorative icons or generic images on analytical pages.
- **Decorative bars**: empty full-width banner at the top/bottom, side band on the slide edge,
  colored strip on the edge of a card — AI-slide markers. (The **content-bearing** elements of the
  Sprint OS design system — the rule under the action title, the "Implication" band — are, on the other hand, allowed;
  the `THEME.deco` corner motif is OFF by default and opt-in only.)
- Centered body (body text is left-aligned; only the titles of visual pages may be centered).
- Insufficient contrast (light on light, dark on dark); pure black / pure white as a flat fill.
- Text overflowing its box: shrink, split, or enlarge the container — never ship it cut off.

---

## QA (mandatory, in a loop)

After each build: render the .pptx to images, inspect, fix, re-render — until a clean pass.
Never deliver a deck that has not passed QA. First render = there ARE defects; finding them is the job.
Work without narrating: check → fix → next.

### Content QA

```bash
python3 scripts/extract_text.py deck.pptx
# Forgotten placeholders:
python3 scripts/extract_text.py deck.pptx | grep -iE "\bx{3,}\b|lorem|ipsum|\bTODO|\[insert|this.*(page|slide).*layout"
```

- [ ] **Intent matches the request** (top-severity): a descriptive request ("present / describe /
      overview of X") has NOT been reframed as a decision deck (no invented "should we…?", no
      recommendation / decisions-requested slides) — and a decision request has NOT produced a flat
      descriptive deck.
- [ ] **Numbers faithful to `sources/*.md`** (value, unit, period); no invented value.
- [ ] **Colors faithful to `brand/palette.md`**: the deck's accent = the file's token (sourced hex), dark
      backgrounds generated with that same accent, no hex outside the palette in the build.
- [ ] **Action title** on every slide: a conclusion sentence that is **CLEAR, understandable on first
      reading** (no convoluted phrasing), a conjugated verb, **max 2 lines** (the only hard limit,
      no word cap), quantified when possible; the **so-what lives first in the title**.
- [ ] **"Implication / Bottom line" band NOT systematic**: present only when it adds an
      implication beyond the title (not a rehash); aim for ≤ ~1 slide in 3; vary how the so-what is expressed.
- [ ] **Titles-only test**: read in order, the titles tell the complete argument.
- [ ] **Bold lead-ins**: title + bold are enough to understand each content slide.
- [ ] **Density reached**: floors respected (written page ≥ 180 words, exhibit+prose ≥ 100 words);
      no slide exceeds 1500 words.
- [ ] Self-contained: complete sentences, no `=`/`→`, jargon glossed; no em dash "—".
- [ ] Sources/assumptions in the slide footer; **unit + period on every exhibit**; content complete,
      right order, no typos.
- [ ] **Structure slides present per the step 3 table**: cover and closing always;
      agenda, objectives, executive summary, dividers, recap, next steps, appendix when the content calls for them.
- [ ] **Icons present** (agenda, exec summary, key messages, KPI strips); **≥ 2 exhibit types**
      if ≥ 3 charts; **no card emphasized among items of equal importance**: neither `highlight`
      (soft tint) nor `hero`/`focal`/`dark` (flat fill + sheen) without a real semantic role; never by default.
- [ ] Full craft checklist → `references/mbb-slide-craft.md` ("final review" section).
- [ ] **Taste-craft locks** (`references/taste-craft.md`): dark pages with title ≤ 2 lines,
      no decorative strip; `·` rationed (max 1/line); no falsely precise number
      and no filler verb ("revolutionize", "seamless"…); a single corner-radius system;
      proofread every visible string.

### Partner review — text + visual (MANDATORY, a single reviewer)

An **independent reviewer** plays the **ultra-senior consultant (partner)** who rereads the deck before it
goes to the client. The former text review and the former visual QA are merged into **a single pass, by the
same reviewer, on the same deck** — to go faster. **⚠️ The merge removes NO criterion: the
reviewer applies the FULL union of points A + B below; we stay exactly as rigorous
as with two separate reviews.** The reviewer receives **both** the extracted text (`python3 scripts/extract_text.py
deck.pptx`) **and** the images of all slides (see "Converting to images"), and returns **a single
list of precise corrections** (slide, defect, before → after); apply them then re-verify.

**Who the reviewer is, depending on the execution environment:**
- **If the agent can launch subagents** (separate context): delegate the review there — this is the best case,
  the reviewer has never seen the build code.
- **Otherwise (model/environment without subagents)**: do a **"cold pass"** yourself, with this
  strict discipline — work ONLY from the rendered images and the extracted text (do NOT reopen
  the build code during the review), examine the slides in a different order from the build order,
  and apply checklist A + B point by point, recording each verdict. The bias to fight: you have the
  code in your head and you would "see" what you expect, not what is actually rendered.

**A. TEXT criteria** — reread slide by slide, cover included:
- **Phrasing**: every sentence well written, natural, without clumsiness or wording calqued from
  another language (in French decks, no "by the way", "adresser un sujet", "délivrer de la valeur"…);
- **Typos and grammar**: spelling, agreement, punctuation;
- **Relevant bolding**: every bold passage is genuinely the key idea/number of its sentence
  (no decorative bold, no bold landing on a secondary word);
- **Consistency**: constant terminology, no label/text duplication, homogeneous register.

**B. VISUAL criteria** — inspect the images and list every defect a reader would see:
- Text overflow / text cut off at the edges or outside its box
- Overlaps (text on a shape, axis labels on a band, stacked elements)
- Title wrapped onto 2 lines that bites into the content or shifts a decoration
- Elements too close (< 0.25"); irregular gaps (big void here, cramped there)
- HALF-EMPTY CONTENT SLIDE (under-content: flag it for enrichment)
- Insufficient contrast (light text on light background, dark icon on dark background)
- Cover / agenda / dividers / closing NOT on a crafted dark background
- Misaligned columns / cards; box too narrow causing excessive wrapping
- Flat hierarchy (squint test: title, bold, and accent element must stand out when squinting)
- Exhibit without a visible unit/period; chart where everything is colored (the key series must be alone in accent)
- Title or footer that changes position from one slide to the next
- Forgotten placeholder

List only the defects a reader would see (no sub-pixel nitpicking). Give the reviewer the
absolute paths of the images — `ls -1 "$PWD"/out/slide-*.jpg` — one per slide, with a brief expectation for each:

```
You are an ultra-senior consultant (partner): reread this deck before it goes to the client and apply IN ONE PASS
the entirety of the TEXT (A) AND VISUAL (B) criteria above. No criterion is optional.
Return a single list of corrections (slide, type text|visual, defect, before → after).

Deck text: <paste the output of extract_text.py>
Images (one per slide, absolute paths):
1. <absolute-path>/slide-NN.jpg — (Expected: [brief description])
...
```

### Verification loop

1. Generate → convert to images → inspect.
2. **Check overflows first** (defect #1, always visible). Exception: elements in a
   QA-unreliable font → trust the ~10% margin, not the displayed fit.
3. **Hunt the void**: a half-empty content slide = go back to step 2 (enrich the text), not a
   mere layout tweak.
4. Fix the build code → regenerate → re-render → re-inspect the affected slides.
5. **Cap: 2 render cycles** (the initial partner review + one verification of the fixes).
   Stop after one clean fix-and-verify cycle; do not loop on sub-pixel nudges.

---

## Converting to images

```bash
# locate soffice (portable: PATH -> macOS -> Linux)
SOFFICE="$(command -v soffice || echo /Applications/LibreOffice.app/Contents/MacOS/soffice)"
[ -x "$SOFFICE" ] || SOFFICE=/usr/bin/soffice
"$SOFFICE" --headless --convert-to pdf --outdir out/ deck.pptx -env:UserInstallation=file:///tmp/lo-$$
python3 scripts/pdf2img.py out/deck.pdf out/ 150   # prints the absolute paths of the slide-NN.jpg files
```

After fixes, **rerun both commands** (the PDF must be regenerated from the edited .pptx).
`scripts/thumbnail.py` and `scripts/office/soffice.py` call bare `soffice`: if needed, add its
directory to the PATH first (macOS: `export PATH="/Applications/LibreOffice.app/Contents/MacOS:$PATH"`).

## Dependencies (verify on the execution machine)

The skill is **model- and agent-agnostic**: everything goes through Node, Python 3, and LibreOffice.
Verify/install on first use:
- **Node ≥ 18 + pptxgenjs / sharp / react-icons / react-dom**: included in the skill's `node_modules/`
  (`require` from the skill directory, or `npm i` in the deck's project). If `node` is not on the
  PATH, look for an nvm install (`ls ~/.nvm/versions/node/*/bin` — on this machine: v22.23.1).
- **python-pptx**: `python3 -c "import pptx"` — used by `scripts/extract_text.py` and `scripts/effects.py`
  (`pip install python-pptx` if missing).
- **LibreOffice (soffice)**: PDF rendering for QA. macOS: `/Applications/LibreOffice.app/Contents/MacOS/soffice`;
  Linux: `soffice` (libreoffice package); otherwise `command -v soffice`.
- **PyMuPDF**: `python3 -c "import fitz"` — used by `scripts/pdf2img.py` (`pip install PyMuPDF` if missing;
  replaces poppler/pdftoppm, not required).
- **Pillow**: for `scripts/thumbnail.py` (`pip install Pillow` if missing).
