// Sprint OS — SVG -> PNG exhibit engine (via sharp). The universal escape hatch: everything SVG
// can draw (gradients, gauges, arcs, diagrams, textured backgrounds) becomes a slide image, beyond
// pptxgenjs's ~10 shapes. Async -> PRE-GENERATE the PNGs BEFORE the synchronous pptxgenjs build (like icons).
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

// -- SLOPE CHART: comparison of 2 periods (slopes) ----------------------------------------
// o:{items:[{label,a,b,color?,highlight?}], leftLabel, rightLabel, color?}
function slope(o) {
  const items = o.items || [], acc = hx(o.color || "2E7CF6"), ink = hx("1A1A1A"), mut = hx("8C8C8C"), grey = hx("C2CAD3");
  const W = 560, H = 400, xL = 150, xR = 410, yT = 60, yB = 350;
  const vals = items.flatMap(i => [num(i.a), num(i.b)]), min = vals.length ? Math.min(...vals) : 0, max = vals.length ? Math.max(...vals) : 1;
  const span = (max - min) || 1, y = v => yB - (num(v) - min) / span * (yB - yT);
  let body = "";
  body += `<text x="${xL}" y="40" text-anchor="middle" font-family="${F}" font-size="20" font-weight="700" fill="${ink}">${esc(o.leftLabel || "Before")}</text>`;
  body += `<text x="${xR}" y="40" text-anchor="middle" font-family="${F}" font-size="20" font-weight="700" fill="${ink}">${esc(o.rightLabel || "After")}</text>`;
  body += `<line x1="${xL}" y1="${yT - 6}" x2="${xL}" y2="${yB + 6}" stroke="${hx("E4E8ED")}" stroke-width="2"/><line x1="${xR}" y1="${yT - 6}" x2="${xR}" y2="${yB + 6}" stroke="${hx("E4E8ED")}" stroke-width="2"/>`;
  items.forEach(it => {
    const c = it.highlight ? acc : (it.color ? hx(it.color) : grey), w = it.highlight ? 4 : 2.5;
    const ya = y(it.a), yb = y(it.b);
    body += `<line x1="${xL}" y1="${ya}" x2="${xR}" y2="${yb}" stroke="${c}" stroke-width="${w}"/>`;
    body += `<circle cx="${xL}" cy="${ya}" r="5" fill="${c}"/><circle cx="${xR}" cy="${yb}" r="5" fill="${c}"/>`;
    const bold = it.highlight ? "700" : "400", tc = it.highlight ? ink : mut;
    body += `<text x="${xL - 14}" y="${ya + 5}" text-anchor="end" font-family="${F}" font-size="16" font-weight="${bold}" fill="${tc}">${esc(it.label)} ${esc(it.a)}</text>`;
    body += `<text x="${xR + 14}" y="${yb + 5}" text-anchor="start" font-family="${F}" font-size="16" font-weight="${bold}" fill="${tc}">${esc(it.b)} ${esc(it.label)}</text>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">${body}</svg>`;
}

// -- DUMBBELL: comparison of 2 states per row ---------------------------------------------
// o:{items:[{label,a,b}], aLabel,bLabel, colorA?, colorB?, max?}
function dumbbell(o) {
  const items = o.items || [], cA = hx(o.colorA || "C2CAD3"), cB = hx(o.colorB || "2E7CF6"), ink = hx("1A1A1A");
  const W = 560, H = Math.max(200, 70 + items.length * 56), xL = 200, xR = 530;
  const max = o.max || (items.length ? Math.max(...items.flatMap(i => [num(i.a), num(i.b)])) * 1.1 : 1) || 1;
  const x = v => xL + num(v) / max * (xR - xL);
  let body = `<text x="${xL}" y="34" text-anchor="start" font-family="${F}" font-size="15" font-weight="700" fill="${cA}">● ${esc(o.aLabel || "Before")}</text><text x="${xL + 160}" y="34" font-family="${F}" font-size="15" font-weight="700" fill="${cB}">● ${esc(o.bLabel || "After")}</text>`;
  items.forEach((it, i) => {
    const yy = 68 + i * 56, xa = x(it.a), xb = x(it.b);
    body += `<text x="${xL - 16}" y="${yy + 5}" text-anchor="end" font-family="${F}" font-size="15" font-weight="600" fill="${ink}">${esc(it.label)}</text>`;
    body += `<line x1="${xa}" y1="${yy}" x2="${xb}" y2="${yy}" stroke="${hx("DCE1E7")}" stroke-width="4"/>`;
    body += `<circle cx="${xa}" cy="${yy}" r="8" fill="${cA}"/><circle cx="${xb}" cy="${yy}" r="8" fill="${cB}"/>`;
    body += `<text x="${xb + 16}" y="${yy + 5}" font-family="${F}" font-size="14" font-weight="700" fill="${cB}">${esc(it.b)}</text>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">${body}</svg>`;
}

// -- BULLET CHART: actual vs target vs range, per row -------------------------------------
// o:{items:[{label,value,target,max}], color?}
function bullet(o) {
  const items = o.items || [], acc = hx(o.color || "2E7CF6"), ink = hx("1A1A1A");
  const W = 560, H = Math.max(160, 40 + items.length * 62), xL = 180, xR = 520, bw = xR - xL;
  let body = "";
  items.forEach((it, i) => {
    const yy = 40 + i * 62, val = num(it.value), tgt = it.target != null ? num(it.target) : null;
    const max = (it.max || Math.max(val, tgt || 0) * 1.25) || 1;
    const w = v => Math.max(0, Math.min(1, num(v) / max)) * bw;
    body += `<text x="${xL - 16}" y="${yy + 22}" text-anchor="end" font-family="${F}" font-size="15" font-weight="600" fill="${ink}">${esc(it.label)}</text>`;
    body += `<rect x="${xL}" y="${yy}" width="${bw}" height="30" rx="4" fill="${hx("EEF1F5")}"/>`;                    // range
    body += `<rect x="${xL}" y="${yy}" width="${w(val).toFixed(1)}" height="30" rx="4" fill="${acc}"/>`;             // actual
    if (tgt != null) body += `<rect x="${(xL + w(tgt)).toFixed(1)}" y="${yy - 5}" width="4" height="40" fill="${ink}"/>`; // target
    body += `<text x="${xR + 8}" y="${yy + 22}" font-family="${F}" font-size="15" font-weight="700" fill="${acc}">${esc(it.value)}</text>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">${body}</svg>`;
}

// -- WAFFLE / pictogram: proportion on a 10x10 grid ---------------------------------------
// o:{value(0..100), color?, track?, label?, sub?}
function waffle(o) {
  const acc = hx(o.color || "2E7CF6"), track = hx(o.track || "E9EDF2"), ink = hx("1A1A1A"), mut = hx("8C8C8C");
  const filled = Math.round(Math.max(0, Math.min(100, num(o.value)))), cell = 30, gap = 6, s = cell + gap, ox = 20, oy = 20;
  let sq = "";
  for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) {
    const idx = (9 - r) * 10 + c; // fills bottom-up
    sq += `<rect x="${ox + c * s}" y="${oy + r * s}" width="${cell}" height="${cell}" rx="4" fill="${idx < filled ? acc : track}"/>`;
  }
  const tx = ox + 10 * s + 24;
  const lbl = o.label != null ? o.label : filled + "%";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${tx + 240} ${oy + 10 * s}">${sq}
    <text x="${tx}" y="${oy + 120}" font-family="${F}" font-size="72" font-weight="700" fill="${ink}">${esc(lbl)}</text>
    ${o.sub ? `<text x="${tx}" y="${oy + 160}" font-family="${F}" font-size="22" fill="${mut}">${esc(o.sub)}</text>` : ""}</svg>`;
}

// -- MARIMEKKO / MEKKO: variable-width columns, 100% stacked ------------------------------
// o:{cols:[{label,weight, segs:[{label?,value,color?}]}], colors?}
function mekko(o) {
  const cols = o.cols || [], W = 560, H = 400, x0 = 20, y0 = 40, pw = W - 40, ph = H - 90, gap = 6;
  const pal = (o.colors || ["2E7CF6", "5AA0FF", "AFC9F0", "1D5FCC"]).map(hx), ink = hx("1A1A1A");
  const totW = cols.reduce((a, c) => a + num(c.weight), 0) || 1;
  let body = "", x = x0;
  cols.forEach(col => {
    const segs = col.segs || []; if (!segs.length) return;
    const cw = (num(col.weight) / totW) * (pw - gap * (cols.length - 1));
    const tot = segs.reduce((a, s) => a + num(s.value), 0) || 1;
    let y = y0;
    segs.forEach((sg, i) => {
      const sh = num(sg.value) / tot * ph, c = sg.color ? hx(sg.color) : pal[i % pal.length];
      body += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${cw.toFixed(1)}" height="${sh.toFixed(1)}" fill="${c}"/>`;
      if (sh > 26) body += `<text x="${(x + cw / 2).toFixed(1)}" y="${(y + sh / 2 + 5).toFixed(1)}" text-anchor="middle" font-family="${F}" font-size="14" font-weight="700" fill="#fff">${Math.round(num(sg.value) / tot * 100)}%</text>`;
      y += sh;
    });
    body += `<text x="${(x + cw / 2).toFixed(1)}" y="${y0 + ph + 24}" text-anchor="middle" font-family="${F}" font-size="15" font-weight="600" fill="${ink}">${esc(col.label)}</text>`;
    x += cw + gap;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">${body}</svg>`;
}

// -- VENN, 3 circles (needs / attractiveness / access...) ---------------------------------
// o:{sets:[{label,color?}] (3), center?}
function venn(o) {
  const sets = (o.sets || []).slice(0, 3), pal = ["2E7CF6", "76B900", "F2A900"].map(hx);
  const W = 440, H = 400, r = 110, cx = 220, cy = 190, d = 78;
  const pts = [[cx, cy - d], [cx - d * 0.92, cy + d * 0.6], [cx + d * 0.92, cy + d * 0.6]];
  const lblPos = [[cx, cy - d - r + 26], [cx - d - r + 90, cy + d + r - 30], [cx + d + r - 90, cy + d + r - 30]];
  let body = "";
  sets.forEach((st, i) => { body += `<circle cx="${pts[i][0]}" cy="${pts[i][1]}" r="${r}" fill="${st.color ? hx(st.color) : pal[i]}" fill-opacity="0.42"/>`; });
  if (o.center) body += `<text x="${cx}" y="${cy + 30}" text-anchor="middle" font-family="${F}" font-size="16" font-weight="700" fill="${hx("1A1A1A")}">${esc(o.center)}</text>`;
  sets.forEach((st, i) => { body += `<text x="${lblPos[i][0]}" y="${lblPos[i][1]}" text-anchor="middle" font-family="${F}" font-size="17" font-weight="700" fill="${st.color ? hx(st.color) : pal[i]}">${esc(st.label)}</text>`; });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">${body}</svg>`;
}

module.exports = { render, donutGauge, radialBars, slope, dumbbell, bullet, waffle, mekko, venn, arcPath, hx, esc };
