# MBB craft reference (McKinsey / BCG / Bain / Accenture)

Fine-grained production rules, drawn from the firms' documented practices. This file complements
`wording.md` (substance) and `slide-layouts.md` (patterns): it says **how to finish every slide at
professional level**. When a rendering trade-off arises, these rules win.

> Deck language: all rules apply whether the deck is in French or in English, unless explicitly
> scoped. French ❌/✅ pairs are kept verbatim as French-deck illustrations.

---

## The 3 quality tests (run on EVERY deck)

1. **Titles-only test (horizontal logic)**: reading only the action titles, in order, must tell the
   complete argument, like continuous prose. If the story does not hold, the problem is structural:
   fix the outline, not the slides.
2. **Squint test (visual hierarchy)**: squinting at the rendered slide, you must still see WHERE to
   look first (title → bold/lead-ins → the exhibit's accent element). If everything has the same
   visual weight, the hierarchy has failed.
3. **60-second test (vertical logic)**: every slide must be explainable in one minute, and everything
   it contains must prove its title. Strict consistency rule: **nothing in the title that is not
   demonstrated in the body; nothing in the body that does not serve the title**. Material that is
   interesting but off-thread is not deleted: it moves to the **appendix** (see below).

---

## Action title: precision rules

- **Complete sentence with a conjugated verb, active voice.** The title states a **conclusion**, never
  a process or a heading.
- **CLARITY ABOVE ALL**: the title must be understood on the **first read**, by someone discovering
  the topic. Simple, direct sentence (subject, verb, object); no nested subordinate clauses, no double
  negation, no hollow abstractions, no unglossed jargon. If the title requires a second read, rewrite
  it more simply: two short sentences beat one clever sentence.
- **Never more than 2 lines**: this is the ONLY hard limit. There is NO word cap: a force-shortened
  title loses its conclusion and degrades back into a heading. Position, size, and weight **identical
  on every slide**: flipping through the deck, the title does not move by a pixel.
- **Quantify whenever possible**: the key number goes IN the title.
- **If the title contains "and", you probably need two slides** (one idea = one slide).
- Titles are written **first** (at outline stage: that is the ghost deck), then **rewritten last**
  once the body is built: tighten, remove spare words, verify the body proves exactly this sentence.
- Voice-over test: "if I had to summarize this slide out loud in one sentence, what would it be?"
  That sentence IS the title.

English-deck example:
- ❌ "Cost evolution" → ✅ "Costs grew 10% per year over 5 years, twice as fast as revenue"

French-deck examples (kept verbatim):
- ❌ « Évolution des coûts » → ✅ « Les coûts ont crû de 10 % par an sur 5 ans, deux fois plus vite que le revenu »
- ❌ « Benchmark concurrentiel » → ✅ « Trois concurrents ont déjà atteint la taille critique qui nous manque »
- ❌ « Recommandations et prochaines étapes » → two slides: « Nous recommandons de concentrer l'investissement sur le segment X » then « Trois décisions sont attendues du comité d'ici fin juillet »

---

## The pyramid INSIDE the slide (3 layers)

Every content slide reproduces the pyramid in miniature:

1. **Layer 1: the action title** (the conclusion).
2. **Layer 2: the lead-ins**: 2 to 4 argument sentences **in bold**, one per zone/column/block, at
   body size + 2 pt. These are the sub-conclusions that, together, prove the title.
3. **Layer 3: the evidence**: under each lead-in, the development in regular weight (data,
   explanatory sentences, sub-bullets).

**Rushed-reader rule**: reading the title + the bold text must be enough to understand the whole
slide. Bold therefore carries **complete thesis sentences**, not isolated words highlighted at random;
roughly one bold element per block, never bold sprinkled through the body of sentences (at most the
key number).

---

## Exhibits: the craft (charts and tables)

**Exhibit header** (above every chart/table): one factual line **with unit and period**. English
deck: "Revenue by segment, €bn, 2021-2025"; French deck: « Chiffre d'affaires par segment, Mds €,
2021-2025 ». Interpretation stays in the action title; the exhibit header does not conclude, it
describes.

**Units: ALWAYS.** A missing unit is THE signature flaw of an amateur deck. Every axis, every table
column, every big number carries its unit (€M, %, pts, FTE) and its period.

**Direct labels rather than a legend**: attach series labels at the end of lines / next to columns.
A separate legend is a last resort (too many series), never the reflex.

**Color is semantic, not decorative**:
- the series / bar / segment / table row that **proves the title** gets the accent;
- **everything else in gray** (the `neg` token);
- same data = same color across the whole deck (if "us" is in accent on slide 8, "us" is in accent
  on slide 19).
- **Parallel cards and columns: IDENTICAL dress.** A card colored differently from its peers tells the
  reader "this one is special": if nothing is special, that is a false signal. Never decorative
  alternation on equal items.
  - **Soft highlight** (`highlight`): `band` tint + accent edge, to underline without shouting.
  - **Strong highlight** (the `hero` of scenario cards, canvasGrid's `focal`, `dark`): a **smooth
    native accent gradient** (lighter top fading to darker bottom, via effects.py); reserved for ONE
    element with a genuinely distinct role (recommended option, critical path, central message).
  - **Name WHY it is highlighted — the sticker.** A strong highlight should carry a small **badge**
    (`kit.badge`, a tiny white pill pinned on the card's top corner) that states the reason in one
    word: "Recommended", "Pilot", "New"… (in the deck's language — `heroTag` on `scenarioCards`,
    default "Recommended", `heroTag:false` to disable). A highlight without a stated reason makes
    the reader guess; the sticker removes the guess at zero space cost.
  - These highlights are **SEMANTIC and NEVER APPLIED BY DEFAULT**: no card is colored unless the
    build explicitly asks for it (e.g. `scenarioCards` only colors a hero if `hero` is passed).
    Coloring one item among equals "to look nice" is defect #1 to ban.
  - Legitimate structural exceptions: the zebra striping of **table rows** (a reading convention) and
    panels with a **different role** (summary, recommendation, so-what).

**Annotations that work** (add at least one per analytical exhibit):
- **CAGR** arrow between the first and last bar (EN "+12%/yr" / FR « +12 %/an »);
- boxed **callout** on the inflection point or the outlier ("series break: BU divested in 2023");
- **brace** grouping categories and carrying their sum;
- **delta** displayed between two compared bars (+28%, ×2.5).

**Zero chart junk**: no chart border, no shadow, no 3D, no plot-area background fill; thin light-gray
gridlines (`E2E8F0`) or none; if the **data labels** carry the message, show them and **remove the
value axis** (one OR the other, not both).

**Choose the exhibit type by the nature of the message** (CODE primitives → `references/slide-layouts.md`):
- evolution over time → columns or line; **2 magnitudes** (volume + rate) → `comboBarLine`;
- comparison across players → sorted horizontal bars;
- comparison of **2 periods / before-after** → `slope` (crossing ranks) or `dumbbell` (gap per row);
- actual **vs target** → `bullet` (compact, dashboard-style);
- decomposition / structure → stacked bars, `mekko` (Marimekko, 2 dimensions), **waterfall** (value bridges);
- share of a whole → `doughnutChart` (ring) or `waffle` (memorable "X out of 100" proportion);
- relationship between two variables / positioning → `scatterMap` (named quadrants, named points);
- multi-criteria profile → `radarChart` (spider); intersection of 3 sets → `venn`;
- KPI in a ring → `donutGauge` (SVG, with gradient);
- qualitative assessment → **harvey balls** ●◐○ or dots, never an invented chart.

**Tables**: numbers **right-aligned** (comparable at a glance), labels on the left, anthracite header
(`head`), **thin horizontal rules only** (no vertical grid), the key row or column highlighted
(`band` fill). Sort rows in the order that serves the message (descending, chronological), never
alphabetical by default.

---

## Fine typography

- **Two-sizes rule** (BCG): within a slide body, **exactly two text sizes, 2 pt apart**: lead-ins
  14 pt bold / body 12 pt (the V3 register). Not three sizes, and no sizes that vary from one slide
  to the next.
- **One role = one size**, constant across the whole deck (all lead-ins are the same size, all
  sources are 8 pt).
- Hierarchy through **weight and size**; never through color alone, never through underlining
  (exception: BCG-style underlined lead-ins, if adopted everywhere).
- ALL CAPS reserved for eyebrows and short labels; italics rare (quotes, glosses).

---

## Professional chrome (each slide's "frame")

- **Section tracker** for decks > 15 slides: a discreet reminder of the current section (eyebrow or
  top-right corner, active section in accent, the others in gray).
- **Page number on every slide**; date and confidentiality notice on the cover (and in the footer if
  the context requires it).
- **Source line, 8 pt gray, bottom of slide, canonical format**:
  - English deck: `Source: <documents>, <years>; Sprint OS analysis`
  - French deck: `Source : <documents>, <années> ; analyse Sprint OS`
  For methodological details, use **numbered footnotes** (1. 2.) referenced in the body
  ("adjusted EBITDA¹").
- Footer strictly identical on all content slides.

---

## The appendix reflex

**Never delete** a solid analysis that does not carry the main thread: it moves to the **appendix**
("Backup"). The main deck stays on the argumentative line; the appendix absorbs methodological
details, sensitivities, secondary analyses, and slides anticipating the committee's questions. At MBB
firms the appendix is often **longer than the main deck**: that is a sign of rigor, not of poor
scoping. An "Appendix" divider (dark background) separates it.

---

## Absolute bans (never seen in an MBB deck)

- Animations and transitions; GIFs.
- Clipart, decorative stock photos, "corporate people" illustrations.
- 3D charts; multicolored pie charts (> 4-5 segments with only one in accent).
- WordArt, drop shadows on text, gradients on analytical pages.
- An empty "Thank you / Questions?" slide (the closing slide carries synthesis + next steps + contact).
- More than 3 levels of bullet indentation.
- An exhibit without unit or period; a number without a source.

---

## Final review checklist (before delivery, on top of the SKILL.md QA)

- [ ] The titles alone, read in order, tell the complete argument.
- [ ] Every title: clear on first read, conjugated verb, a conclusion (quantified where possible), ≤ 2 lines.
- [ ] Every content slide: bold lead-ins that, together with the title, are enough to understand everything.
- [ ] Every exhibit: header with **unit + period**, key series in accent / rest in gray, at least
      one useful annotation (CAGR, callout, delta), zero chart junk.
- [ ] Exactly two body sizes (14/12), constant across the whole deck.
- [ ] 8 pt source line on every data slide; numbered footnotes where methodology requires; page number
      everywhere; tracker if > 15 slides.
- [ ] Grid respected: titles and footers immobile from slide to slide, columns aligned.
- [ ] Whatever was cut from the main thread is in the appendix, not lost.
