// Sprint OS — minimal runnable template. Copy into a project, extend.
// Prerequisites: npm i pptxgenjs sharp ; then generate the backgrounds:
//   node ../assets/gen_bg.cjs ../assets 2E7CF6
// Then: node example-build.js   (writes example.pptx)
const path = require("path");
const pptxgen = require("pptxgenjs");
const ASSETS = path.join(__dirname, "..", "assets");
const bg = name => path.join(ASSETS, name);

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "Sprint OS";
pres.title = "Sprint OS - example";

// Load the kit (pass a fonts/accent override here if needed)
const kit = require(path.join(ASSETS, "deck_helpers.js"))(pres, {
  // accent: "2E7CF6", accentInk: "1D5FCC", accentOnDark: "5B9CFF", band: "EFF4FE",
  // fDisp:"Space Grotesk", fBody:"DM Sans", fMono:"JetBrains Mono",  // if installed
});
const T = kit.THEME;

/* 1 — COVER (visual, crafted dark background) */
let s = pres.addSlide();
kit.coverDark(s, {
  bgPath: bg("cover.png"),
  eyebrow: "Sprint OS - Example deck",
  title: "Document title",
  governing: "Governing idea in one sentence: the conclusion first, not a topic label.",
  metaA: "Subtitle / audience", metaB: "Prepared by ...",
  metaC: "Month YYYY", metaD: "Internal document, confidential",
  source: "Source: ... (one .md per document in sources/).",
});

/* 2 — ANALYTICAL PAGE (light background, exhibit + proof points + so-what) */
s = pres.addSlide();
kit.frameLight(s, "Pillar 1 - Example",
  "The highlighted data point concludes directly: the title is a complete sentence",
  "Key message: one line that sets the reading angle.");
s.addText("Exhibit header (unit)",{x:T.M,y:2.15,w:7,h:0.3,fontFace:T.fBody,fontSize:11,color:T.gray,bold:true,margin:0});
s.addChart(pres.charts.BAR, [{ name:"Series", labels:["A","B","C"], values:[60.9,130.5,215.9] }],
  Object.assign({ x:0.4, y:2.5, w:7.4, h:3.6, barDir:"col", valAxisMaxVal:240,
    chartColors:[T.neg, T.neg, T.accent] }, kit.chartLight()));
kit.proofTitle(s, 8.2, 2.2, 4.4);
kit.proofs(s, [
  "First proof point, a complete self-contained sentence with a sourced figure [F].",
  "Second proof point that spells out a mechanism rather than a symbol [I].",
  "Third proof point, a clearly labeled assumption when data is missing [A].",
], 8.2, 2.55, 4.5, 3.5, 12);
kit.implication(s, "The consequence sentence (so-what): what the data implies for the decision.");
kit.source(s, "Source: sources/<doc>.md. Assumptions [A]/[E] made explicit.", 2);

/* 2bis — WRITTEN PAGE (prose / working slide, light background) */
s = pres.addSlide();
kit.frameLight(s, "Analysis",
  "When the point is an analysis, write it out: prose carries more than a chart wrapped in bullets",
  "Example of a written page: a kicker, then points developed in complete sentences.");
kit.prose(s, [
  "A slide's form must follow the idea it carries. A number is shown in an exhibit; a mechanism, a cause or a stake is written out, because sentences convey the reasoning, not one more bar on a chart.",
  { lead: "A written page stands on its own.", text: "The reader understands the argument without a presenter, which makes it the right slide for documents and working notes meant to be read." },
  { lead: "It mixes with exhibits without replacing them.", text: "A good deck alternates written pages, tables and charts: that variety is what makes it dense and natural rather than monotonous." },
], 0.55, 2.2, 12.2, 3.8, { size: 14, line: 1.4 });
kit.source(s, "Source: Sprint OS Deck Builder methodology.", 3);

/* 3 — CLOSING (visual, dark background) */
s = pres.addSlide();
kit.coverDark(s, {
  bgPath: bg("close.png"),
  eyebrow: "In summary",
  title: "The conclusion in one sentence, then the next steps",
  governing: "Next steps: 1) ... 2) ... 3). Each one actionable (who, what, when).",
  metaA: "Contact", metaB: "firstname.lastname@sprint-os.com",
  source: "Internal document, confidential.",
});

pres.writeFile({ fileName: path.join(__dirname, "example.pptx") }).then(f=>console.log("OK:", f));
