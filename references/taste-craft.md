# Taste-craft (anti-defects transposed from web design)

Distilled from taste-skill (MIT): only what transposes to .pptx decks. Complements
`mbb-slide-craft.md` (substance): here live the anti-"AI slop" reflexes and the consistency locks.
Web-only material (GSAP, Tailwind, dark mode, CWV) is deliberately excluded.

> Deck language: rules apply whether the deck is in French or in English, unless explicitly scoped.
> French examples are kept verbatim as French-deck illustrations.

## 1. Declared brief reading (before any design)
Before choosing the palette and backgrounds, state your reading of the brief in ONE line:
"I read this as: \<archetype> for \<audience>, register \<sober-analytical | premium | pedagogical>,
density \<to be read = dense | to be presented = sparse>". This line locks the choices; do not jump to
a default aesthetic. If the reading genuinely diverges, ask ONE question, never a questionnaire.

## 2. Anti-defects (the LLM reflexes to counter)
- **Do not serve the same recipe again**: the same "palette per topic type", the same cover
  composition, the same icons from one deck to the next = slop. Rotate the families (see §4).
- **Fake-precise numbers are forbidden**: `92 %`, `4,1×`, `13,4` invented to "look spec'd". A number
  comes from a source (`sources/*.md`) or it does not exist.
- **Filler verbs are banned**, by deck language; concrete verbs only:
  - When the deck is in FRENCH: « révolutionner », « sans couture », « déverrouiller le potentiel »,
    « sublimer », « réinventer », « nouvelle génération » without proof. Also banned in French decks,
    the anglicisms: « adresser un sujet », « délivrer de la valeur », « by the way ».
  - When the deck is in ENGLISH: "Elevate", "Seamless", "Unleash", "Revolutionize", "Reinvent",
    "Next-generation", "Unlock the potential", "Delve", "Leverage" used as filler, without proof.
- **Generic names are banned** in examples: in a French deck, no « Jean Dupont », « Acme »,
  « SmartFlow »; in an English deck, no "John Smith", "Jane Doe", "Acme", "SmartFlow". Invent
  credible, contextual names.
- **No decorative numbering**: no "001 · Capabilities" eyebrows, no "01 / 4" on visuals; a numbered
  badge is only legitimate when the order CARRIES meaning (steps, priorities).
- **The middot `·` is rationed**: max 1 per metadata line; never as a universal separator.
- **No decorative colored dots/badges**: a colored dot = a real semantic state (RAG), otherwise
  nothing.
- **Micro-meta banned**: no "v1.2", no decorative timestamps, no poetic labels (EN "Field notes" /
  FR « Notes de terrain ») in place of functional labels (EN "Testimonials", "Appendix" /
  FR « Témoignages », « Annexes »).

## 3. Consistency locks (mechanical, verifiable in QA)
- **Theme lock**: one deck = one light face + one dark face, never a random inversion mid-deck (the
  structure/content sandwich is THE rule, not a free alternation).
- **Accent lock**: ONE accent color, identical on every slide (already in design-tokens; QA counts
  hex values outside the palette).
- **Shape lock**: ONE documented corner system for the whole deck. Sprint OS: **cards/panels = soft
  corners + soft drop shadow; tables/bands/exhibits = sharp; pills/chips = fully rounded** (detail →
  design-tokens.md). Flat variant (`radius:0, cardShadow:false`) for an ultra-sober deck, to be
  declared at brief reading. What is forbidden: mixing without a rule.
- **Copy-register lock**: do not mix technical mono, editorial prose, and marketing punchlines on the
  same slide without a brand reason.

## 4. Structural dark pages (cover / agenda / dividers / closing)
The deck equivalent of the web "hero"; strict discipline:
- **Sober text stack**: eyebrow, title, governing/caption, meta, and no gadget decorations (a tagline
  under the meta, a decorative "BRAND · MOTION · SPATIAL" strip). No mechanical cap on the number of
  elements: sobriety is judged on the render.
- **Title ≤ 2 lines** (the only hard limit). The hook (governing) has no word limit: it must be
  **clear on first read** and hold visually (the anti-overflow rule wins).
- **Composition follows the feel of the subject**: `gen_bg.cjs` accepts several styles (`halo`,
  `beams`, `grid`), the light cover accepts 8+; the style is chosen freely at brief reading (sober →
  grid, premium → halo, dynamic → beams) and holds for the WHOLE deck. Variety comes from free
  choice, not from an imposed rotation.
- **No fake visuals**: no fake screenshot made of rectangles, no makeshift SVG illustration; if a
  real visual is missing, a crafted background + typography is enough.

## 5. Copy proofread (before delivery, on top of the QA)
Re-read EVERY visible string (titles, bold text, bullets, labels, footers, sources) and rewrite any
sentence that is: grammatically shaky, ambiguous in its referent, playing at hollow "depth", or
cute-but-wrong. Flat-and-correct copy beats clever-and-dubious copy.

## 6. Quotes (if pullQuote is used)
Body ≤ 3 lines (cut the quote, not the font size); attribution = first name + last name + role
(+ company), never a first name alone; typographic quotation marks only, never straight quotes:
French deck « », English deck “ ” (curly quotes), or no quotation marks at all.

> Convergences already in place in V3 (nothing to do, do not weaken them): TOTAL ban on the em-dash
> in every deck language, never pure black/white fills, one single accent, rationed emoji, density
> through usefulness.
