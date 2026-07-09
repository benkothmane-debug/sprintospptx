# Step 2 — Wording & analysis (data → insight)

Content must be **dense like a McKinsey deck** AND **self-contained**: every slide must be understandable on its own, without the presenter.

> **Deck language.** The deck is generated in French OR in English, following the user's request (see the "Output language" section of SKILL.md). Every rule below applies in BOTH languages unless explicitly scoped "When the deck is in FRENCH:" or "When the deck is in ENGLISH:". French ❌/✅ pairs are kept verbatim as French-deck illustrations.

## ⚠️ Content IS the deliverable of this step (cause #1 of empty slides)
The most frequent cause of a "hollow/empty" slide is not the rendering: it is **under-specified content**. Therefore:
- `content/<deck>.md` contains the **FINAL, verbatim text** of every slide (title, kicker, paragraphs, table cells, captions), **not a 3-sentence sketch**. The build step only **typesets** this text; it invents nothing and fills in nothing.
- **Write enough to fill the slide's usable area.** A half-empty slide is a signal of under-content → enrich the analysis (nuance, cause, consequence, comparison, example); do not leave blank space.

### Volume targets per slide (16:9 — these are FLOORS, not ceilings; aim for ≥ 75% of usable height)
- **Written (prose) page**: **≥ 180 words** = a kicker (2-3 sentences) + **3 to 5** developed points (bold thesis + 1-3 sentences each). Below 150 words the slide will look empty. No low ceiling: develop as much as the analysis requires.
- **Exhibit + prose**: an exhibit that fills its half + **≥ 100 words** of written analysis beside it (developed sentences, not dry bullets).
- **Standalone analytical exhibit** (table/chart): the exhibit **fills** its zone + **3-4 sentences** of reading + implication.
- **Visual / structural page**: few words (deliberate), but the **crafted background** fills the space.
- **Absolute ceiling: 1,500 words per slide.** Beyond that, split into two slides. In practice, fit at 12-14 pt saturates well before that: the anti-overflow rule always wins (split the slide or enlarge the container; never go below ~10 pt and never ship clipped text).
- Prefer **fewer, richer slides** over many thin ones. If a slide carries only one thin idea, merge it.

> Simple rule: before building a slide, its final text must already sit in `content/<deck>.md` and hit the volume target. Otherwise, enrich the content; do not build a shell.

## Action title (mandatory on every slide)
A **complete sentence that concludes** (the so-what), not a topic label.

English-deck example:
- ❌ "Revenue" · ❌ "Gross margin"
- ✅ "Gross margin falls to 71.1% as a deliberate industrial choice (the Blackwell ramp), not price weakness"

French-deck example:
- ❌ « Chiffre d'affaires » · ❌ « Marge brute »
- ✅ « La marge brute recule à 71,1 % par choix industriel (le ramp Blackwell) et non par faiblesse de prix »

Precision rules (detail → `mbb-slide-craft.md`):
- **Max 2 lines** (the ONLY hard limit; there is NO word cap), conjugated verb, active voice; a **conclusion**, not a process.
- **Clear on first read**: a simple, direct sentence, no convoluted phrasing; if the title requires a second read, rewrite it.
- **Quantify whenever possible**: the key number goes in the title.
- **An "and" in the title probably means two slides** (one idea = one slide).
- Write the titles **first** (at outline stage), then **rewrite them last** once the body is built.
- Voice-over test: the sentence you would say out loud to summarize the slide IS the title.

**Ghost-deck test**: reading only the action titles, in order, must tell the entire argument. If not, fix the structure.

## Self-contained text (the rule most often missed)
- **Complete sentences**, subject–verb–object. No fragments.
- **Zero symbols used as grammar**: `=`, `→`, `·` are forbidden as substitutes for a verb or conjunction. (« Build = ponctuel ; inférence → récurrent » ❌)
- **Jargon translated or glossed** in the deck's language: EN "cost per request (token)", "model usage (inference)"; FR « coût par requête (token) », « usage des modèles (inférence) ». No bare `ramp`, `capex`, `hyperscaler`, `flywheel`, `T+1`.
- **One idea per bullet**, ~1 line, understandable in isolation.
- **Numbers** always carry **unit + period + source**; lead with the number.

Rewrite example (English deck):
> ❌ "Build = one-off; inference → recurring per token."
> ✅ "Training a model is a one-time expense; using it (inference) is paid on every request, so demand becomes recurring."

Rewrite example (French deck, kept verbatim):
> ❌ « Build = ponctuel ; inférence = répétée à chaque token → revenu récurrent. »
> ✅ « Entraîner un modèle est une dépense ponctuelle ; l'utiliser (l'inférence) se paie à chaque requête : la demande devient donc récurrente. »

## Punctuation: the em-dash "—" is BANNED, in EVERY deck language
The em-dash "—" (and the en-dash "–" used as punctuation) is a visual marker of AI writing: **never use it in slide text, whether the deck is in French or in English**. Replace it with:
- a **colon** ":" to introduce an explanation (EN: "Margin down: temporary mix effect." / FR: « Marge en baisse : effet de mix temporaire. »);
- a **comma** for a parenthetical clause;
- **parentheses** for a precision;
- or a split into **two sentences**.
Use the short hyphen "-" only for compound words, never as sentence punctuation. (This rule also applies to labels such as "Implication: …", "Objective: …" — FR « Implication : … », « Objectif : … ».)

## Emoji: SPARINGLY
Emoji are **allowed but rare**: they help locate and pace, they do not decorate.
- **Where**: an occasional marker on an agenda item, a key point/takeaway, a status (🟢🟠🔴), a "key takeaway" callout box, a workshop/training page.
- **How many**: at most **one per slide**, and **a few per deck**; never a grid of emoji.
- **Where NOT**: on analytical exhibits (tables, charts, waterfalls, matrices), nor as a replacement for a word, nor as a systematic bullet marker.
- **Consistency**: choose sober emoji that match the meaning (no gratuitous smileys).

## Explicit so-what (mandatory) — but its EXPRESSION varies
So-what thinking is mandatory on every content slide; its **formatting** is not.
- **By default, the so-what lives in the ACTION TITLE** (the title already IS the conclusion). A slide whose title concludes does not need to re-conclude at the bottom.
- **The "Implication / Bottom line / Key takeaway" band is NOT a default ornament.** Add it only when it brings an implication **beyond** the title: a cross-cutting consequence, a trade-off, an "and therefore for the decision…" that the title does not carry. Repeating it on every slide as a restatement of the title is a mechanical tic to avoid.
- **Vary the expression** from slide to slide: sometimes the band, sometimes a bold thesis sentence in the body, sometimes a plain-language callout box, sometimes nothing (the title suffices). Technically: the band only renders if `bottomLine` is passed to the template, so only pass it when there truly is an additional so-what.
- Order of magnitude: aim for **at most ~1 slide in 3** with a dedicated band; never systematic.

## Evidence labels (epistemology)
Tag every claim: `[F]` sourced fact · `[I]` inference (derived from facts) · `[A]` assumption (judgment, with confidence level) · `[E]` estimate (computed from data + assumptions). Never present an assumption as a fact.

## Argument structure — MATCHES THE DECK'S INTENT (see SKILL.md step 0, Intent lock)

**Decision-intent decks (Minto pyramid)** — when the user asks a question to decide:
1. **Bottom line** (the answer, one sentence).
2. **3 supporting arguments** max, each with tagged evidence.
3. **Risks** (≥2, with probability/impact/mitigation).
4. **Kill conditions** (≥2: what would overturn the conclusion).
5. **Next actions** (≥2, who/what/when).
6. **Devil's advocate**: state the strongest counter-thesis, then why the recommendation holds (or adjust it).

**Descriptive / present-a-topic decks** — when the user asks to present or understand a subject:
1. **Central takeaway** (the one factual sentence that summarizes the subject — NOT a recommendation).
2. **3-5 key themes** that structure the subject (MECE), each with sourced facts and numbers.
3. **Dynamics & outlook** (what is changing, trends, forces at play) — stated as facts.
4. **Key takeaways** slide (what to remember), instead of a recommendation.
Do NOT add recommendation / decisions-requested / kill-conditions slides to a descriptive deck;
do NOT frame the title or exec summary as an answer to a question the user never asked. Action
titles remain factual conclusions ("EU solar capacity tripled since 2019"), which is different
from recommendations ("The EU should invest in solar").

## MECE
Mutually exclusive, collectively exhaustive categories (3 pillars, 3 risks, 2 scenarios…). No overlap, no gap.

## Format of the `content/<deck>.md` file (one entry per slide)
```markdown
## SLIDE n — [ANALYTICAL | VISUAL]
- Action title: <conclusion sentence>
- Key message: <one line>
- Exhibit: <type: table / columns / bars / waterfall / 2x2 matrix / benchmark / scenarios / pyramid>
- Proof points: <2-4 self-contained sentences, tagged [F/I/A/E]>
- Implication (so-what): <one sentence>
- Sources / assumptions: <ref sources/*.md; [A]/[E] made explicit>
```

## Anti-patterns
- Topic titles, decorative bullets, vague slogans.
- **Filler verbs** (see taste-craft), banned by deck language:
  - When the deck is in FRENCH: « révolutionner », « sans couture », « sublimer », « réinventer », « déverrouiller le potentiel », « nouvelle génération » without quantified proof.
  - When the deck is in ENGLISH: "Elevate", "Seamless", "Unleash", "Revolutionize", "Next-generation", "Unlock the potential", "Delve", "Leverage" used as filler, without quantified proof.
- **Fake-precise numbers** invented to look serious: every number traces back to `sources/*.md` or it does not exist.
- Fragments / symbols-as-grammar / bare jargon.
- "Framework salad": stacking frameworks instead of analyzing the data.
- Generic recommendations (EN "improve the experience" / FR « améliorer l'expérience ») without who/what/when.
