// Sprint OS — extracts the brand accent color from a logo (or any image).
// Usage: node brand_colors.cjs <image_path_or_local_url>
//   e.g.: curl -s https://logo.clearbit.com/nvidia.com -o /tmp/l.png && node brand_colors.cjs /tmp/l.png
// Output: accent (the most saturated color, excluding white/black/grey) + variants + top candidates.
const sharp = require("sharp");

const img = process.argv[2];
if (!img) { console.error("usage: node brand_colors.cjs <image>"); process.exit(1); }

function toHex(r,g,b){ return [r,g,b].map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,"0")).join("").toUpperCase(); }
function darken(r,g,b,f){ return [r*f,g*f,b*f]; }
function lighten(r,g,b,f){ return [r+(255-r)*f, g+(255-g)*f, b+(255-b)*f]; }

(async()=>{
  const { data, info } = await sharp(img).resize(96,96,{fit:"inside"}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const ch = info.channels;
  const buckets = {}; // key = quantized color -> {r,g,b,score,count}
  for (let i=0;i<data.length;i+=ch){
    const r=data[i],g=data[i+1],b=data[i+2],a=ch>3?data[i+3]:255;
    if (a<128) continue;
    const max=Math.max(r,g,b), min=Math.min(r,g,b);
    const val=max/255, sat=max===0?0:(max-min)/max;
    if (val>0.95 && sat<0.10) continue;   // near-white
    if (val<0.12) continue;               // near-black
    if (sat<0.18) continue;               // grey
    const q=v=>Math.round(v/16)*16;
    const key=`${q(r)}-${q(g)}-${q(b)}`;
    const b0=buckets[key]||(buckets[key]={r:0,g:0,b:0,count:0,score:0});
    b0.r+=r; b0.g+=g; b0.b+=b; b0.count++; b0.score+=sat*val;
  }
  const list=Object.values(buckets).map(b=>({r:b.r/b.count,g:b.g/b.count,b:b.b/b.count,score:b.score,count:b.count}))
    .sort((a,b)=>b.score-a.score);
  if (!list.length){ console.log(JSON.stringify({error:"no saturated color detected (monochrome logo?)"} )); return; }
  const top=list[0];
  const accent=toHex(top.r,top.g,top.b);
  const accentInk=toHex(...darken(top.r,top.g,top.b,0.74));     // text on a light background
  const accentOnDark=toHex(...lighten(top.r,top.g,top.b,0.14)); // on a dark background
  const band=toHex(...lighten(top.r,top.g,top.b,0.90));         // implication band
  const candidates=list.slice(0,4).map(c=>"#"+toHex(c.r,c.g,c.b));
  console.log(JSON.stringify({ accent:"#"+accent, accentInk:"#"+accentInk, accentOnDark:"#"+accentOnDark, band:"#"+band, candidates }, null, 2));
})().catch(e=>{ console.error("error:", e.message); process.exit(1); });
