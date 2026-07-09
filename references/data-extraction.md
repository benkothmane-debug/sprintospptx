# Step 1 — Data grounding (one .md per document)

**Goal**: put ALL raw data into the input before any reasoning. Never work from memory, never summarize at this stage. Every number in the deck must be traceable back to a `sources/*.md` file.

## Rule
For **every** document provided (PDF, .docx, .xlsx, .csv, .pptx, web page, e-mail…), create **one file** `sources/<document-name>.md` that **copies verbatim** all useful information.

## What to extract (verbatim)
- **Every number** with its label, unit, and period (e.g. "FY2026 revenue: $215.9B (+65% YoY)").
- **Every table** (copied as Markdown tables).
- **Key passages** word for word (executive quotes, definitions, commitments, risks).
- **The document's structure** (section headings) so you know where each piece of information came from.
- **Dates**, scopes, footnotes, and the document's assumptions.

## How to extract by format
- **PDF**: extract the text (`pymupdf`: `fitz.open(...).get_text()`), not an "eyeball" read. For a large PDF, extract all text into a file then `grep` the financial/risk sections.
- **.docx**: `pandoc fichier.docx -o sources/fichier.md` (or python-docx).
- **.xlsx/.csv**: copy sheets/ranges as Markdown tables (openpyxl/pandas).
- **.pptx**: extract the text (python-pptx) slide by slide.
- **Web**: fetch the content (WebFetch / pandoc from the HTML) and paste it in.

## Format of each `sources/<doc>.md`
```markdown
# Source: <document name> (<type>, <date/period>)
Path: <actual path> · Extracted on: <date>

## Key figures (verbatim)
- <label>: <value> <unit> (<period>, <change>)   ← copied as-is
...

## Tables (verbatim)
| ... | ... |   ← copied identically

## Key passages (verbatim)
> "<exact quote>"  (section, p. X)

## Document outline
- Section 1 — ...
- Section 2 — ...
```

## After extraction
- Build the analysis (step 2) **exclusively** from these `.md` files.
- Every value on a slide cites its source (`Form 10-K`, `sources/<doc>.md`).
- If a data point is missing, do not invent it: state a clearly labeled **assumption `[A]`** or **estimate `[E]`**, and note it in the slide's sources.

## Anti-patterns
- Summarizing the document instead of copying the data → you lose the raw material.
- Building slides without having created the `sources/*.md` files.
- Mixing several documents into a single .md (one .md = one document, for traceability).
