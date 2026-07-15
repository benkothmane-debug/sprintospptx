# Deck structure & colored backgrounds

## The "sandwich" structure
- **Structure pages** (cover, agenda, dividers, inter-slides, closing) → **crafted dark background** (gradient + halo + shapes).
- **Analytical content pages** → **light background** (legibility of tables/charts).
- A purely *visual* content page (strong statement) may be dark as well.

This is the classic recommendation for premium decks: dark backgrounds for title + conclusion, light for content; title + conclusions in navy (academic usage).

## Structure checklist (verify BEFORE delivering)
- [ ] **Cover** — either the composed LIGHT cover (`kit.coverLight`, the default: large type + accent composition) or a crafted dark background; never a plain, unworked page.
- [ ] **Agenda** — dark + the document's **Objective**, if the deck > ~5 slides.
- [ ] **Executive summary** (analytical) if the subject carries a thesis.
- [ ] **Dividers** — dark, before each major part (long deck).
- [ ] **Inter-slides** for transitions if a sequence is too dense (optional).
- [ ] **Closing** — crafted dark (synthesis + next steps + contact + source).
- [ ] Consistent numbering; single accent; uniform footers.

## Colored backgrounds: method (mandatory for structure pages)
pptxgenjs **does not do gradients natively** → **generate a background PNG** then place editable text on top.

1. Generate the backgrounds with **`assets/gen_bg.cjs`** (variants `cover`, `agenda`, `divider`, `close`). Each background combines:
   - a diagonal **dark gradient** (charcoal, never pure black);
   - a **radial halo** in the accent (placed where there is little text);
   - sober **geometric shapes** (concentric rings = "signal propagation", thin masked hatching);
   - a slight **vignette** for focus.
2. In the build: `slide.background = { path: 'assets/<variant>.png' }`.
3. Place the text on top using the dark theme's **light** colors (off-white / vivid accent / muted).

The background's motif and accent are driven by the brand accent (a single place, see `design-tokens.md`). Vary the placement of the halo/rings between variants (cover ≠ agenda ≠ close) so the pages are not identical.

## Combining the retained skills (where the method comes from)
- **management-consulting** → pyramid structure, MECE, evidence labels, analytical exhibits, devil's advocate.
- **ui-ux-pro-max** → palette/font-pairing choice by product type, chart types.
- **impeccable** → craft of visual pages: weight inversion, mono eyebrows, flat cards, a single accent, "no pure black/white", anti-slop.
- **reference practices** → action titles, ghost deck, light/dark sandwich, depth in the presenter notes.

## Presenter notes
Put the documentary depth in the **notes** (`slide.addNotes(...)`), not on the slide. The slide stays tight; the notes carry the full analysis and the sources.
