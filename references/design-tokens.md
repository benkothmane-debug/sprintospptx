# Sprint OS tokens (design system)

One system, **two faces** (light analytical / dark visual), **a single accent color**.

## ⚠️ Accent color — ONE single place to set it
The deck's accent is defined in `assets/deck_helpers.js` (the `THEME.accent*` object) and passed to `assets/gen_bg.cjs` (`--accent` argument). Changing it propagates everywhere. **Neutral by default**; it is replaced by the **subject's brand identity** ("brand identity" step) or by a color provided by the user.

Provided default (neutral — will be overridden per subject):
```
accent (fills/bars, on dark) : #2E7CF6   (default neutral blue)
accentInk (accent text on light) : #1D5FCC   (dark variant, AA contrast)
```
> Rule: a single accent hue across the whole deck. Shades of that hue are allowed (light/dark), not a 2nd color.

## LIGHT face (analytical pages)
```
bg      #FFFFFF      background
ink     #1A1A1A      primary text (never pure black)
gray    #595959      secondary text / key message
gray2   #8C8C8C      captions / sources
rule    #CFCFCF      hairlines
neg     #ABAFB3      non-key bars (gray)
band    accent at ~6% opacity (#EFF4FE by default)  "Implication" band
head    #33373B      table headers (anthracite)
```

## DARK face (structure / visual pages)
```
bg      #11151A      charcoal (never pure black)
on      #F2F4F2      off-white text (never pure white)
mute    #9AA6B2      secondary text
line    #2A323B      hairlines on dark
accent  vivid version of the accent (on dark, raise lightness ~+10%)
```

## Typography
Two possible registers — choose based on the desired look, keep ONE pairing per deck:
- **Sober / safe (web-safe, guaranteed rendering)**: headings & body in **Arial / Helvetica**. Legible table figures. Prefer this if you are not installing a font.
- **Premium (install into ~/Library/Fonts)**: display **Space Grotesk**, body **DM Sans**, figures/eyebrows **JetBrains Mono** ("financial terminal" effect). Recommended by ui-ux-pro-max for tech/AI products.

Scale (16:9, WIDE layout 13.3×7.5 in):
```
Eyebrow (mono/caps, tracked)   10–11 pt
Action title                   21–22 pt (bold)   ·  cover hero 40–44 pt
Lead-ins / block headers       14 pt (bold) — the layer-2 argument sentences
Body / evidence                12 pt
KPI figures (stat callouts)    26–72 pt (accent) — as one element of a dense slide, never the whole slide
Sources / footer               8 pt (muted)
```
**Two-size rule (BCG)**: within a slide's body, exactly **two sizes 2 pt apart**
(lead-ins 14 bold / body 12). Constant across the whole deck: one role = one size. If a deck requires a larger
body (projected training), move the pair to 16/14, never mix and match.

**Weight inversion** (visual pages): hero rather light, section titles heavier.

## Layout (constants)
```
Layout: LAYOUT_WIDE (13.3 × 7.5 in)
Left/right margin: 0.55 in
Action title: y 0.64 ; accent rule: y 1.57 ; message: y 1.64
Exhibit zone: y ≈ 2.1 → 6.2
Implication band: y 6.32 (h 0.6, fill = band, accent bar on the left)
Sources footer: y 7.02 ; page number bottom-right (accent)
```

## Cards: soft corners + shadow (documented rule)
The deck's shape system (taste-craft lock with an explicit rule, so mixing is allowed):
- **Cards and panels**: soft corners (`THEME.radius`, default 0.06 in) + **soft drop shadow**
  (blur 7, offset 2, opacity 12%, never opaque black). This is what creates depth.
- **Tables, bands (implication/Key takeaway), exhibits, bucket headers**: sharp corners, no shadow.
- **Pills and chips** (D1 tags, badges, dots): fully rounded.
- **Highlighted card (`dark`)**: a **smooth native gradient** — slightly lightened accentInk at the top
  fading to a darker shade at the bottom, applied as a real `<a:gradFill>` by the `scripts/effects.py`
  post-processing pass (solid `accentInk` fallback if the pass is skipped). NO stacked translucent
  veils on top (they rendered as visible banding — rejected), and no corner tick on dark cards.
  Reserved for **SEMANTIC** emphasis (hero, focal point), never by default — see `mbb-slide-craft.md`.
Ultra-sober deck: pass `{radius:0, cardShadow:false}` in the kit overrides (declare it at
brief reading). pptxgenjs pitfall: the shadow is built by `kit.cardShadow()` (a fresh object on every
call, never shared); the cards' top hairline is inset by `radius` so it does not overrun the corners.

## Decorative background on light slides (`THEME.deco`)
To add breathing room without noise, `frameLight` places a **very pale accent motif in a corner**,
BEHIND the content (in the margin, it does not interfere with cards). **Default: `deco:"none"`** — the
halo variant rendered as hard concentric circles and was rejected; only enable a motif (`"halo"` or
`"dots"`) on an explicit request. Corner adjustable via `decoCorner` (`"tr"` default | `"br"` | `"tl"` | `"bl"`).

## Color rules (reminder)
- A single accent hue. On charts: the **key** series/bar in accent, the rest in gray (`neg`).
- No pure black (#000) or pure white (#FFF) as a brand fill.
- No decorative gradient on analytical pages (reserved for the backgrounds of structure pages).
