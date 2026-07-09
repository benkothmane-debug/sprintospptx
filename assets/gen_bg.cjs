// Sprint OS — generates the crafted dark backgrounds for the structure pages.
// Usage: node gen_bg.cjs <output_dir> [accentHex] [style]
//   styles: halo (default, gradient+rings) | beams (diagonal beams) | grid (fine grid + glow)
//   e.g.: node assets/gen_bg.cjs ./assets 2E7CF6 beams
// Produces cover.png / agenda.png / divider.png / close.png (2560x1440).
// Taste-craft rule: one single style for a whole deck; pick the style by feel of the subject (no forced rotation).
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const OUT = process.argv[2] || path.join(__dirname);
const ACC = (process.argv[3] || "2E7CF6").replace("#","");
const STYLE = (process.argv[4] || "halo").toLowerCase();
fs.mkdirSync(OUT, { recursive: true });
const Wd = 2560, Ht = 1440;

function rings(cx, cy, radii, op){
  return radii.map((r,i)=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#${ACC}" stroke-width="2.2" opacity="${(op*(1-i*0.13)).toFixed(3)}"/>`).join("");
}
function hatch(x0,y0,n,gap,len,op){
  let o=""; for(let i=0;i<n;i++){const x=x0+i*gap; o+=`<line x1="${x}" y1="${y0}" x2="${x+len}" y2="${y0+len}" stroke="#${ACC}" stroke-width="1.4" opacity="${op}"/>`;} return o;
}
const PARAMS = {
  cover:   { gcx:0.80, gcy:0.66, rcx:2230, rcy:1180, hx:60,   hy:80 },
  agenda:  { gcx:0.95, gcy:0.50, rcx:2620, rcy:720,  hx:60,   hy:80 },
  divider: { gcx:0.50, gcy:0.85, rcx:1280, rcy:1500, hx:60,   hy:80 },
  close:   { gcx:0.20, gcy:0.30, rcx:360,  rcy:240,  hx:1900, hy:90 },
};
function beams(p){
  // diagonal beams: wide translucent accent bands + thin backlight lines
  const bx = p.rcx * 0.55;
  let out = "";
  [[-380, 0.10, 520],[120, 0.06, 340],[540, 0.045, 260],[880, 0.03, 180]].forEach(([dx, op, w])=>{
    out += `<rect x="${bx+dx}" y="-400" width="${w}" height="${Ht+800}" fill="#${ACC}" opacity="${op}" transform="rotate(24 ${bx+dx} ${Ht/2})"/>`;
  });
  [[-60, 0.22],[430, 0.16],[820, 0.10]].forEach(([dx, op])=>{
    out += `<rect x="${bx+dx}" y="-400" width="3" height="${Ht+800}" fill="#${ACC}" opacity="${op}" transform="rotate(24 ${bx+dx} ${Ht/2})"/>`;
  });
  return out;
}
function gridlines(p){
  // fine grid + reference crosses: a sober / engineering register
  let out = "";
  for(let x=120; x<Wd; x+=200) out += `<line x1="${x}" y1="0" x2="${x}" y2="${Ht}" stroke="#${ACC}" stroke-width="1" opacity="0.045"/>`;
  for(let y=120; y<Ht; y+=200) out += `<line x1="0" y1="${y}" x2="${Wd}" y2="${y}" stroke="#${ACC}" stroke-width="1" opacity="0.045"/>`;
  const cx = p.rcx*0.78, cy = p.rcy*0.82;
  [[cx,cy],[cx-400,cy+300]].forEach(([px,py])=>{
    out += `<line x1="${px-26}" y1="${py}" x2="${px+26}" y2="${py}" stroke="#${ACC}" stroke-width="2.4" opacity="0.5"/>`;
    out += `<line x1="${px}" y1="${py-26}" x2="${px}" y2="${py+26}" stroke="#${ACC}" stroke-width="2.4" opacity="0.5"/>`;
  });
  out += `<circle cx="${cx}" cy="${cy}" r="340" fill="none" stroke="#${ACC}" stroke-width="1.6" opacity="0.14"/>`;
  return out;
}
function svg(p){
  return `<svg width="${Wd}" height="${Ht}" viewBox="0 0 ${Wd} ${Ht}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="base" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0C1118"/><stop offset="55%" stop-color="#080B11"/><stop offset="100%" stop-color="#04060A"/>
    </linearGradient>
    <radialGradient id="glow" cx="${p.gcx}" cy="${p.gcy}" r="0.6">
      <stop offset="0%" stop-color="#${ACC}" stop-opacity="0.30"/>
      <stop offset="45%" stop-color="#${ACC}" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#${ACC}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vig" cx="0.5" cy="0.5" r="0.75">
      <stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="0.45"/>
    </radialGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fff" stop-opacity="1"/><stop offset="60%" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <mask id="fm"><rect width="${Wd}" height="${Ht}" fill="url(#fade)"/></mask>
  </defs>
  <rect width="${Wd}" height="${Ht}" fill="url(#base)"/>
  <rect width="${Wd}" height="${Ht}" fill="url(#glow)" opacity="${STYLE==="grid"?0.55:1}"/>
  ${STYLE==="beams" ? `<g>${beams(p)}</g>`
    : STYLE==="grid" ? `<g>${gridlines(p)}</g>`
    : `<g>${rings(p.rcx, p.rcy, [260,440,640,860,1100], 0.16)}</g>
  <g mask="url(#fm)">${hatch(p.hx, p.hy, 10, 26, 150, 0.18)}</g>`}
  <rect width="${Wd}" height="${Ht}" fill="url(#vig)"/>
</svg>`;
}
(async()=>{
  for(const v of Object.keys(PARAMS)){
    await sharp(Buffer.from(svg(PARAMS[v]))).png().toFile(path.join(OUT, v+".png"));
    console.log("wrote:", path.join(OUT, v+".png"));
  }
})();
