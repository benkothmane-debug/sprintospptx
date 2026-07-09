# Brand identity (automatic brand resolution)

**Principle**: as soon as the deck is about a **company** (or a subject tied to a brand), the style must **adopt that company's brand identity** — its accent color, possibly its logo — instead of the default accent. A deck about NVIDIA must be NVIDIA green; about Stripe, Stripe indigo; etc.

> If **no brand is identifiable** (generic subject) or the user provides no brand guidelines → use the **neutral default accent** (or a color the user specifies).

## When to apply it
- The subject names an identifiable company / product / brand → resolve its brand identity.
- Generic subject with no brand (e.g. "the SaaS market") → choose a palette suited to the **subject type** (ui-ux-pro-max logic: fintech = dark + trust blue, etc.), not a brand.
- Multiple brands (comparison) → neutral default accent, and use each brand's color only to identify its column/series.

## Method (order of priority)
1. **Web search (primary source)** — look up the official color:
   - queries: `"<company> brand color hex"`, `"<company> brand guidelines"`, `"<entreprise> couleur logo hex"` (French variant — useful when targeting French brands).
   - reliable sources: official brand page / press kit, `brandfetch.com/<domain>`, `brandcolorcode.com`, Wikipedia (logo infobox). Record **primary + secondary** (hex).
2. **Extraction from the logo (confirmation / fallback)** — fetch a **raster logo (PNG/JPG/WebP)** and extract its dominant color:
   ```bash
   curl -s "https://logo.clearbit.com/<domaine>" -o /tmp/logo.png   # no key required (may be blocked depending on network)
   node assets/brand_colors.cjs /tmp/logo.png                        # -> {accent, accentInk, accentOnDark, band, candidates}
   ```
   `brand_colors.cjs` ignores white/black/gray and returns the most saturated color (the accent), plus `accentInk` (dark, text on light), `accentOnDark` (vivid, on dark) and `band` (light tint).
   - **Logo sources if Clearbit is unreachable**: the site's `apple-touch-icon`/`og:image` (often PNG) — grab the URL from the homepage HTML then `curl`; otherwise a PNG image of the logo found via search.
   - **Format**: sharp reads PNG/JPG/WebP/SVG, **not `.ico`** (`.ico` favicons do not work — get a PNG).
   - If you only have the official hex (method 1), skip the extraction: that is the primary source.
3. **Arbitration**: prefer the official hex found in (1); use (2) to confirm/complement. Choose **ONE** accent color (the primary). Check the **contrast**: on a light background, accent text/rules must stay legible → if the accent is too light, use `accentInk` (dark variant) for text and keep the vivid accent for fills/bars and the dark background.
4. **Fallback without web tooling** (execution environment with no web search or network): ask the user for the hex in a single question; if they do not have it, use the **neutral default accent** and note it in `brand/palette.md` ("brand not resolved, neutral accent"). Never invent a hex "from memory" without flagging it.

## MANDATORY deliverable: `brand/palette.md`

Like data grounding (one `.md` per source), brand resolution produces a **palette file**
in the deck's workspace: `brand/palette.md`. It is **the single source of truth for color** in the
build: step 6 injects its tokens into `THEME` and `gen_bg.cjs`, and QA checks the deck **against this
file**. No palette improvised mid-build; if a color must change, edit
`brand/palette.md` then rebuild.

Canonical format:

```markdown
# Palette — <Subject / Company>   (resolved on <date>)

## Official colors (web search)
| Role              | Hex     | Source (exact URL)                      | Confidence |
|-------------------|---------|-----------------------------------------|-----------|
| Brand primary     | 76B900  | nvidia.com/…/brand-guidelines           | [F]       |
| Brand secondary   | 000000  | same                                    | [F]       |

## Derived tokens (to inject into THEME + gen_bg)
| Token        | Hex     | Derivation                                   |
|--------------|---------|----------------------------------------------|
| accent       | 76B900  | official primary                             |
| accentInk    | 4E7A00  | primary darkened (AA contrast on white)      |
| accentOnDark | 8FD400  | primary lightened ~+10% (dark background)    |
| band         | F1F8E4  | tint of the primary at ~6% opacity           |

## Logo
- File: brand/logo.png (source: <URL>, transparent background: yes/no)
- Version for dark backgrounds: white/monochrome (brand/logo-white.png) or none
- Usage: cover + closing, corner, discreet size

## Brand typography
- <Official typeface if identifiable AND installable, otherwise: "the deck's default pairing">

## Application (reminders)
- gen_bg: `node assets/gen_bg.cjs <outdir> <accent>` then regenerate cover/agenda/divider/close.
- Accent = key series of exhibits, title rule, implication band, active tracker.
- accentInk = all accent text on light backgrounds. Never a 2nd accent; the brand secondary
  serves at most as an occasional tint.
```

File rules:
- **Every hex has its source (URL) and its confidence label**: `[F]` official hex found (brand
  guidelines, press kit) · `[E]` extracted from the logo by `brand_colors.cjs` · `[A]` assumed. An `[A]` accent
  must be flagged to the user before the build.
- Subject **without a brand**: the file still exists, with the palette chosen by subject type and the
  rationale ("B2B fintech: deep blue, trust") — QA always has a reference.
- **Multi-brand** (comparison): one section per brand (color = identification of its series
  only) + the deck's neutral accent documented.

## Applying the brand
- Set the accent **in a single place**:
  - `assets/deck_helpers.js` → `THEME.accent` (fills), `accentInk` (text on light), `accentOnDark` (on dark), `band` (band, very light accent);
  - `assets/gen_bg.cjs` → pass the accent hex as an argument for the dark backgrounds (halo/rings in the brand color), then regenerate cover/agenda/divider/close.
- **Logo** (optional but recommended): place the brand's logo on the **cover** and the **closing** (corner, discreet size). Get a transparent-background PNG if possible; on dark backgrounds, prefer a white/monochrome version of the logo.
- **Typeface**: if the brand has an identifiable and available typeface, use it; otherwise keep the default pairing (or web-safe). Do not degrade legibility to imitate a typeface.

## Guardrails
- **Always ONE single accent color** in the deck (the brand's primary). The brand secondary serves at most as an occasional tint, never a 2nd accent.
- Do not reuse the default charcoal dark background if the brand mandates a strong light background — but in general: keep the sandwich structure (charcoal + brand accent in the halo), which works for almost every brand.
- Cite the color's source in the notes (e.g. "accent #76B900 — NVIDIA brand guidelines / logo"). If the color is uncertain, flag it `[A]`.
- Respect the logo/brand: sober usage, no distortion.
