// Sprint OS — SVG -> PNG engine (via sharp). ⚠️ DECORATIVE VISUALS ONLY: this produces flat IMAGES.
// NEVER use it for data exhibits — a client must be able to edit every figure, and all data exhibits
// have NATIVE equivalents in deck_helpers.js (slopeChart, dumbbellChart, bulletChart, waffleChart,
// mekkoChart, vennDiagram, doughnutChart, radarChart, comboBarLine, scatterMap, waterfall, matrix2x2).
// Legitimate uses: gradient accent rings (donutGauge, radialBars), textured/decorative visuals.
// Async -> PRE-GENERATE the PNGs BEFORE the synchronous pptxgenjs build (like icons).
//
// Usage:
//   const svg = require('./assets/svg.cjs');
//   const p = await svg.render(svg.donutGauge({value:68, label:'68%', sub:'Data Center', color:'76B900'}), 'out/svg', 'dc');
//   slide.addImage({ path:p, x:1, y:2, w:2.6, h:2.6 });
//
// All factories render an SVG (declared viewBox) on a transparent background. Labels are ESCAPED
// (esc): text containing &, <, >, " does not break the SVG.
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const cache = {};
const hx = h => "#" + String(h).replace("#", "");                                   // normalizes a color -> #RRGGBB
const esc = v => String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const num = (v, d) => (typeof v === "number" && isFinite(v)) ? v : (d || 0);        // safe numeric value
const F = "Arial, Helvetica, sans-serif";

// Rasterizes an SVG to a high-resolution PNG, PRESERVING the viewBox ratio (wide exhibits
// are no longer distorted/letterboxed). px = largest dimension of the PNG. Cached by content hash + folder.
async function render(svg, outDir, name, px) {
  px = px || 900;
  outDir = outDir || path.join(process.cwd(), "svg");
  const key = (name || "svg") + "-" + crypto.createHash("md5").update(svg + "|" + px + "|" + outDir).digest("hex").slice(0, 10);
  if (cache[key]) return cache[key];
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, key + ".png");
  if (fs.existsSync(outPath)) { cache[key] = outPath; return outPath; }
  const vb = (svg.match(/viewBox=["']\s*[\d.-]+[\s,]+[\d.-]+[\s,]+([\d.]+)[\s,]+([\d.]+)/) || [0, 400, 400]);
  const vw = +vb[1], vh = +vb[2], scale = px / Math.max(vw, vh);
  const sharp = require("sharp");
  await sharp(Buffer.from(svg), { density: 300 }).resize(Math.round(vw * scale), Math.round(vh * scale), { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(outPath);
  cache[key] = outPath;
  return outPath;
}

// helper: SVG arc (cx,cy,r) from startDeg to endDeg (0 = top, clockwise)
function arcPath(cx, cy, r, startDeg, endDeg) {
  const p = d => { const a = (d - 90) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; };
  const [x1, y1] = p(startDeg), [x2, y2] = p(endDeg);
  const large = (endDeg - startDeg) % 360 > 180 ? 1 : 0;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

// -- GAUGE / DONUT with gradient: a single-KPI ring (value = 0..max) ----------------------
function donutGauge(o) {
  const max = o.max || 100, frac = Math.max(0, Math.min(1, num(o.value) / max));
  const c1 = hx(o.color || "2E7CF6"), c2 = hx(o.color2 || o.color || "2E7CF6");
  const track = hx(o.track || "E9EDF2"), ink = hx(o.ink || "1A1A1A"), mut = hx(o.mut || "8C8C8C");
  const cx = 200, cy = 200, r = 150, sw = o.thickness || 34;
  const full = 2 * Math.PI * r, dash = frac * full;
  const label = o.label != null ? o.label : Math.round(frac * 100) + "%";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${track}" stroke-width="${sw}"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="url(#g)" stroke-width="${sw}"
    stroke-linecap="round" stroke-dasharray="${dash.toFixed(1)} ${(full - dash).toFixed(1)}"
    transform="rotate(-90 ${cx} ${cy})"/>
  <text x="${cx}" y="${cy - 6}" text-anchor="middle" dominant-baseline="middle"
    font-family="${F}" font-size="86" font-weight="700" fill="${ink}">${esc(label)}</text>
  ${o.sub ? `<text x="${cx}" y="${cy + 54}" text-anchor="middle" font-family="${F}" font-size="26" fill="${mut}">${esc(o.sub)}</text>` : ""}
  </svg>`;
}

// -- RADIAL BARS with gradient: up to 5 series as concentric arcs -------------------------
function radialBars(o) {
  const items = (o.items || []).slice(0, 5); // [{label,value(0..1),color?}]
  const cx = 200, cy = 200, sw = o.thickness || 26, gap = 12, r0 = 168;
  const base = hx(o.color || "2E7CF6"), track = hx(o.track || "EEF1F5"), ink = hx(o.ink || "1A1A1A");
  let defs = "", rings = "", labels = "";
  items.forEach((it, i) => {
    const r = r0 - i * (sw + gap);
    const c1 = hx(it.color || base), c2 = it.color2 ? hx(it.color2) : c1;
    defs += `<linearGradient id="rg${i}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>`;
    const end = 6 + Math.max(0, Math.min(1, num(it.value))) * 348;
    rings += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${track}" stroke-width="${sw}"/>
      <path d="${arcPath(cx, cy, r, 0, end)}" fill="none" stroke="url(#rg${i})" stroke-width="${sw}" stroke-linecap="round"/>`;
    labels += `<text x="12" y="${cy - r + sw / 2 - 3}" font-family="${F}" font-size="20" font-weight="700" fill="${ink}">${esc(it.label)}</text>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs>${defs}</defs>${rings}${labels}</svg>`;
}

module.exports = { render, donutGauge, radialBars, arcPath, hx, esc };
