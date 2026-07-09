// Sprint OS — canonical example of the 4 advanced visual effects (gradients / SVG / glow / duotone).
// Run:  node examples/advanced-effects.js  &&  python3 scripts/effects.py examples/advanced-effects.pptx
//           &&  python3 scripts/rezip.py examples/advanced-effects.pptx
// (order matters: async pre-gen -> build -> effects.py -> rezip)
const path = require("path");
const SK = path.join(__dirname, "..");
const pptxgen = require(path.join(SK, "node_modules/pptxgenjs"));
const kitFactory = require(path.join(SK, "assets/deck_helpers.js"));
const svg = require(path.join(SK, "assets/svg.cjs"));
const duotone = require(path.join(SK, "assets/duotone.cjs"));

(async () => {
  const OUT = path.join(__dirname, "fx-assets");
  // 1) ASYNC PRE-GENERATION (before the synchronous build): SVG exhibits + duotone background
  const gauge = await svg.render(svg.donutGauge({ value: 68, label: "68%", sub: "Data Center", color: "76B900", color2: "1A6B00" }), OUT, "gauge");
  const rings = await svg.render(svg.radialBars({ items: [
    { label: "Compute 67%", value: 0.67, color: "76B900", color2: "1A6B00" },
    { label: "Graphics 41%", value: 0.41, color: "5AA0FF", color2: "1D5FCC" },
    { label: "Auto 22%", value: 0.22, color: "F2A900", color2: "B87A00" },
  ] }), OUT, "rings");

  const pres = new pptxgen();
  pres.defineLayout({ name: "W", width: 13.3, height: 7.5 });
  pres.layout = "W";
  const kit = kitFactory(pres, { accent: "76B900", accentInk: "5A8F00", accentOnDark: "8FD400" });
  const tpl = require(path.join(SK, "assets/slide_templates.js"))(pres, kit);

  // Slide A — DARK KPI strip: native gradient (effects.py) + accent glow
  const a = pres.addSlide(); a.background = { color: "11151A" };
  a.addText("ADVANCED EFFECTS — DARK KPI (gradient + glow)", { x: 0.55, y: 0.4, w: 12, h: 0.4, fontFace: "Arial", fontSize: 14, bold: true, color: "8FD400" });
  kit.metricStrip(a, [["$215.9B", "Revenue +65% YoY"], ["$130.4B", "Op. income 60.4%"], ["$120.1B", "Net income 55.6%"], ["$102.7B", "Cash flow 85.6%"]], 0.55, 3, 12.2, { dark: true, h: 1.5, size: 30 });

  // Slide B — SVG exhibits (gauge + radial bars)
  const b = pres.addSlide(); b.background = { color: "FFFFFF" };
  b.addText("ADVANCED EFFECTS — SVG EXHIBITS", { x: 0.55, y: 0.4, w: 12, h: 0.4, fontFace: "Arial", fontSize: 14, bold: true, color: "5A8F00" });
  b.addImage({ path: gauge, x: 1.4, y: 2, w: 3.2, h: 3.2 });
  b.addImage({ path: rings, x: 7.2, y: 1.9, w: 3.6, h: 3.6 });

  await pres.writeFile({ fileName: path.join(__dirname, "advanced-effects.pptx") });
  console.log("OK — then: python3 scripts/effects.py examples/advanced-effects.pptx");
})();
