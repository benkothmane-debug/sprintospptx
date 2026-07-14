# SprintOS PPTX V3 — Deck Builder

**Made by Sprint OS · Open source (MIT)**

An agent skill that turns source material into dense, consulting-grade (McKinsey/MBB style),
**native editable `.pptx`** decks — real text, tables and charts, never images of text.

## What it does
- **Sourced content**: verbatim data extraction (one `.md` per source), every number traceable.
- **Consulting craft**: action titles, self-contained wording, pyramid structure, semantic color,
  20 full slide templates + ~28 exhibit primitives (waterfall, Mekko, slope, dumbbell, bullet,
  waffle, scatter map, radar, gauges…).
- **Brand-aware**: resolves the subject's brand color automatically (web → logo extraction → fallback).
- **Advanced visuals**: native OOXML gradients (post-processing), SVG→PNG exhibit engine, glow on
  dark KPI strips, duotone photo covers, decorative accent halos.
- **Built-in QA**: renders every slide to images, runs a partner-grade review (text + visual),
  fixes and re-renders.
- **Language-aware**: the deck is written in the language of the request (French request → French
  deck, English → English).

## Requirements
Node ≥ 18 (`npm install` in the skill folder: pptxgenjs + sharp, **~24 MB**), Python 3 (`python-pptx`,
`PyMuPDF`, `Pillow`), LibreOffice (`soffice`) for QA rendering. A curated set of **137 icons is
bundled** (no extra dependency); installing `react react-dom react-icons` (optional, ~90 MB) unlocks
the full 30k-icon catalog. Model/agent agnostic: works with any LLM agent able to run shell commands;
subagents and task tools are used when available, with documented fallbacks otherwise.

## Entry point
Read [`SKILL.md`](SKILL.md) — it routes to `references/` (doctrine), `assets/` (build kit),
`scripts/` (tooling) and `examples/` (golden deck: one slide per template; visual overview in
`examples/render/contact-sheet.jpg`).

## License
MIT — see [LICENSE](LICENSE). © Sprint OS.
