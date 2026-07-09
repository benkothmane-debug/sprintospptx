# Deck archetypes (adapt the structure to the intent)

Sprint OS is **not** reserved for strategy presentations. First detect the deck's **intent**, then adapt the **structure**, the **slide types**, and the **tone** — while keeping the shared invariants (see bottom of this page).

## Detecting the intent
**First split — decide vs. understand (SKILL.md step 0, Intent lock):** "should we / which option /
recommend / is it worth" → decision deck (archetype 1 or 6); "present / describe / overview /
panorama / explain / what is" → **descriptive deck (archetype 4)**, with NO recommendation slide and
NO invented decision question. Never convert one into the other.
Then the finer clues: "strategy / board / investors", "**workshop / facilitation**", "**training / course / onboarding**", "**explainer / popularize / present a topic**", "**pitch**", "**project update / status / steering committee (COPIL)**", "keynote / talk". When in doubt, ask, or pick the closest archetype and announce it.

## Structure by archetype (beyond the invariants)

### 1. Strategy / Board / Investors (consulting register)
Pyramid: cover → agenda → **executive summary** → evidence by pillar (analytical exhibits) → risks → **recommendation** → closing. Tone: answer-first, MECE, evidence labels, devil's advocate. (This is the most "McKinsey" register.)

### 2. Workshop (facilitation register)
Cover → **workshop objectives** → **timed agenda** (run-of-show: sequence + durations) → framing/context → **activity slides** (clear instruction, format — solo/group, expected deliverable, timer) → optional **templates/canvases** to fill in → **debrief / synthesis** → **next steps & owners** → closing. More **visual** pages and **dividers** (to pace the sequences); fewer dense tables. Tone: direct, imperative ("List…", "In pairs, identify…").

### 3. Training / Course / Onboarding (pedagogical register)
Cover → **learning objectives** ("By the end, you will know how to…") → agenda/learning path → **concept slides** (1 idea explained, diagram) → **concrete examples / demos** → **step-by-step** → **exercise / quiz** → **recap & key points** → resources → closing. Alternate concept (often visual) and application (often analytical). Tone: clear, progressive, examples before abstractions.

### 4. Explainer / Topic deck (narrative register)
Cover → **hook / why it matters** → light agenda → **definitions** → **how it works** (diagrams, timelines, schematics) → **examples** → **key takeaways** → closing. Mostly **visual** pages + a few exhibits. Tone: pedagogical, narrative (arc), no unglossed jargon.

### 5. Pitch (persuasive register)
Cover → problem → solution → market → product (demo/screenshots) → traction (numbers) → business model → team → **the ask** → closing. Mix of visual (product) and analytical (market/traction). Tone: taut, oriented toward proof and benefit.

### 6. Project update / Status / Steering committee (steering register)
Cover → **synthesis & overall status (RAG green/amber/red)** → progress vs. milestones (**timeline / Gantt**) → key metrics → **risks & blockers** → **decisions/arbitrations requested** → next steps → closing. Mostly analytical. Tone: factual, concise, decision-oriented.

### 7. Program governance / PMO / Steering committee (delivery register)
The densest and most tabular register (PMO / program governance). Reporting period displayed at the top, **RAG status** everywhere (green/amber/red = functional colors, an exception to the "single accent" rule). Typical sequence:
Control tower (overall status + KPIs + milestones + top risks + decisions) → **Executive status dashboard** (RAG per workstream + key message + decisions required + escalations) → **Workstream progress tracker** (large table: scope/plan/delivery/risks/dependencies/next milestone, with **harvey balls** and **RAG**) → **Integrated plan (Gantt + dependencies + milestones)** → **Milestone achievement** (planned vs. actual + slippage) → **RAID log** (Risks/Assumptions/Issues/Dependencies) → **Decisions required** (options/reco/impact/owner) + decisions taken → **Dependency map** (matrix/heatmap) → **Budget burn** (cumulative curve + table) → **Resource & capacity** (table + load **heatmap**) → **Scope change control** (CR pipeline) → **Sprint / next 30 days** (KPIs + defect trend + release readiness) → **Change adoption** (adoption heatmap) → **Value realization** (targets vs. realized). Tone: factual, dense, action/decision-oriented.

> These lists are **templates**, not straitjackets: add/remove items to fit the topic, keep the logical order and the invariants.

## Specific slides (beyond the analytical templates)
Reuse the existing helpers (`frameLight`, `darkHeader`, `dividerDark`, `flatCardLight`, `proofs`, tables) to compose:
- **Objectives** (workshop/course): 3–5 objectives as cards or a list, action verb first ("Align…", "Decide…", "Know how to…").
- **Timed agenda**: 3-column table (no. · sequence · duration), total displayed; dark variant.
- **Activity / exercise**: title = the instruction; inset boxes "Format" (solo/pair/group), "Duration", "Deliverable"; white space to work in.
- **Step-by-step**: numbered steps (process-flow) or horizontal timeline.
- **Recap / key points**: 3–5 takeaways, one sentence each.
- **Quiz / check**: question + options; answer in the presenter notes.
- **RAG status**: color dot (green/amber/red) per workstream + comment.
- **Run-of-show / timeline**: time sequence (timeline / bars helper).

## SHARED invariants (all archetypes)
Whatever the archetype, always:
- Polished **cover** and **closing** (worked dark background); **agenda** whenever the deck exceeds ~5 slides.
- **Data grounding** (one `.md` per source), the **subject's brand identity** applied, **self-contained wording** (full sentences, jargon glossed), **sourced numbers**.
- **Analytical vs. visual page** decided case by case; **a single accent**; **native .pptx** + **visual QA**.
- The **so-what / usefulness** stays explicit — including in workshops/training: every slide has a clear purpose (what the audience must understand or do).
