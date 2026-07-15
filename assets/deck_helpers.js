// Sprint OS Deck Builder — pptxgenjs helper kit (reusable). CommonJS. Created by Sprint OS (MIT).
// Usage: const kit = require('./assets/deck_helpers.js')(pres, {accent:'76B900', ...});  then kit.frameLight(s, ...), kit.coverDark(s, ...)
// Deck accent: pass the subject's brand palette via overrides (THEME.accent/accentInk/accentOnDark/band). Default = neutral blue.

module.exports = function kit(pres, overrides = {}) {
  const THEME = Object.assign({
    // DECK ACCENT — neutral default. Override with the subject's brand palette (brand identity step) or a provided accent.
    accent:       "2E7CF6",   // fills/bars
    accentInk:    "1D5FCC",   // accent text on light background (contrast)
    accentOnDark: "5B9CFF",   // vivid accent on dark background
    band:         "EFF4FE",   // "Implication" band (very light accent)
    // light face (analytical)
    bg:"FFFFFF", ink:"1A1A1A", gray:"595959", gray2:"8C8C8C", rule:"CFCFCF", neg:"ABAFB3", head:"33373B",
    // dark face (structure/visual)
    dbg:"11151A", don:"F2F4F2", dmute:"9AA6B2", dline:"2A323B",
    // fonts (web-safe by default; pass {fDisp:'Space Grotesk',fBody:'DM Sans',fMono:'JetBrains Mono'} if installed)
    fDisp:"Arial", fBody:"Arial", fMono:"Arial",
    // card style: soft corners + drop shadow (documented rule: cards/panels = soft + shadow;
    // tables/bands/exhibits = sharp; pills/chips = fully rounded). radius:0 + cardShadow:false = flat.
    radius:0.06, cardShadow:true,
    // decorative background on light slides: DISABLED by default (the halos rendered as hard
    // concentric circles — rejected). Opt-in only: "halo" | "dots". decoCorner: "tr"|"br"|"tl"|"bl".
    deco:"none", decoCorner:"tr",
    // native gradients on dark cards (post-processed by scripts/effects.py). false = solid fill.
    gradients:true,
    // glow (halo) on the big numbers of dark KPI tiles (native pptxgenjs, text only). false = off.
    glow:true,
    W:13.3, H:7.5, M:0.55,
  }, overrides);
  const T = THEME, R = pres.shapes;
  // soft card drop shadow: fresh object on every call (pptxgenjs mutates options in place)
  const cardShadow = () => T.cardShadow ? {type:"outer", color:"1A1A1A", blur:7, offset:2, angle:45, opacity:0.12} : undefined;
  // base card: soft corners if T.radius>0, shadow if T.cardShadow (fill/line as options)
  function cardShape(s, x, y, w, h, opts){ opts=opts||{};
    const common = {x, y, w, h, fill:opts.fill, line:opts.line, shadow:cardShadow()};
    if(opts.objectName) common.objectName = opts.objectName;
    if(T.radius>0) s.addShape(R.ROUNDED_RECTANGLE, Object.assign(common, {rectRadius:T.radius}));
    else s.addShape(R.RECTANGLE, common); }
  // ---- native gradients (applied in post-processing by scripts/effects.py) ----
  // Darkens a hex by a factor f (0..1). Used to build the 2nd stop of a card gradient.
  function darken(hex, f){ hex=hex.replace("#",""); const n=parseInt(hex,16);
    const r=Math.round(((n>>16)&255)*(1-f)), g=Math.round(((n>>8)&255)*(1-f)), b=Math.round((n&255)*(1-f));
    return ((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1).toUpperCase(); }
  // Lightens a hex toward white by a factor f (0..1).
  function lighten(hex, f){ hex=hex.replace("#",""); const n=parseInt(hex,16);
    const r=Math.round(((n>>16)&255)+(255-((n>>16)&255))*f), g=Math.round(((n>>8)&255)+(255-((n>>8)&255))*f), b=Math.round((n&255)+(255-(n&255))*f);
    return ((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1).toUpperCase(); }
  // Builds the objectName marker of a gradient (2 or 3 stops), read by effects.py.
  function grad(stops, angle){ return "SOGRAD~"+stops.map(h=>h.replace("#","")).join("~")+"~"+(angle==null?90:angle); }

  // subtle decorative background on light slides: very pale accent motif in a corner, BEHIND the content.
  // Stays within the margin (does not interfere with cards); only shows in the slide's breathing room.
  function bgDeco(s){
    const st = T.deco; if(!st || st==="none" || st===false) return;
    const cn = T.decoCorner||"tr";
    const cx = (cn==="tr"||cn==="br") ? T.W+0.35 : -0.35;
    const cy = (cn==="br"||cn==="bl") ? T.H+0.35 : -0.35;
    if(st==="dots"){ // grid of accent dots fading away from the corner
      const step=0.36, d=0.12, sx=(cn==="tr"||cn==="br")?-1:1, sy=(cn==="br"||cn==="bl")?-1:1;
      for(let r=0;r<5;r++) for(let c=0;c<6;c++){ const tr=Math.min(97, 86+(r+c)*2.2);
        s.addShape(R.OVAL,{x:cx+sx*(0.5+c*step)-d/2, y:cy+sy*(0.5+r*step)-d/2, w:d, h:d,
          fill:{color:T.accent, transparency:tr}, line:{type:"none"}}); } }
    else { // "halo": translucent concentric accent discs -> diffuse glow bleeding past the corner
      [[3.3,96],[2.2,95],[1.3,94]].forEach(([rad,tr])=>
        s.addShape(R.OVAL,{x:cx-rad, y:cy-rad, w:2*rad, h:2*rad,
          fill:{color:T.accent, transparency:tr}, line:{type:"none"}})); }
  }

  // ---------- ANALYTICAL PAGES (light background) ----------
  function frameLight(s, eyebrow, title, message){
    s.background = { color:T.bg };
    bgDeco(s);
    s.addText((eyebrow||"").toUpperCase(),{x:T.M,y:0.34,w:12.2,h:0.28,fontFace:T.fMono,fontSize:10.5,color:T.accentInk,bold:true,charSpacing:2,margin:0});
    s.addText(title,{x:T.M,y:0.64,w:12.2,h:0.9,fontFace:T.fDisp,fontSize:21,color:T.ink,bold:true,margin:0,valign:"top",lineSpacingMultiple:1.02});
    s.addShape(R.RECTANGLE,{x:T.M,y:1.57,w:12.2,h:0.028,fill:{color:T.accent}});
    if(message) s.addText(message,{x:T.M,y:1.64,w:12.2,h:0.42,fontFace:T.fBody,fontSize:13.5,color:T.gray,italic:true,margin:0,valign:"top"});
  }
  // implication() = band("Implication", ...): same band, with markdown **bold** support (via band).
  function implication(s, txt){ band(s, "Implication", txt, 6.32); }
  // badge : small status pill ("RECOMMENDED", "NEW", "PILOT"...) pinned on a card corner.
  // Semantic only (like highlight/hero) — never decorative. opts: {fill, color, size, align:"right"|"left"}
  function badge(s, x, y, text, opts){ opts=opts||{};
    const size=opts.size||8, txt=String(text).toUpperCase();
    const w=Math.max(0.5, txt.length*0.082 + 0.24), h=0.24;
    const bx=opts.align==="right" ? x-w : x;
    s.addShape(R.ROUNDED_RECTANGLE,{x:bx,y,w,h,rectRadius:h/2,fill:{color:opts.fill||"FFFFFF"},line:{type:"none"},shadow:cardShadow()});
    s.addText(txt,{x:bx,y,w,h,align:"center",valign:"middle",fontFace:T.fMono,fontSize:size,bold:true,
      charSpacing:1.5,color:opts.color||T.accentInk,margin:0}); return {x:bx,y,w,h}; }
  function pageNum(s, n, dark){ s.addText(String(n).padStart(2,"0"),{x:12.35,y:7.02,w:0.4,h:0.3,fontFace:T.fMono,fontSize:8.5,color:dark?T.accentOnDark:T.accentInk,bold:true,align:"right",valign:"middle",margin:0}); }
  function source(s, txt, n){ if(txt) s.addText(txt,{x:T.M,y:7.02,w:11.5,h:0.3,fontFace:T.fBody,fontSize:8,color:T.gray2,margin:0,valign:"middle"}); pageNum(s,n,false); }
  function proofTitle(s,x,y,w){ s.addText("Proof points",{x,y,w:w||4,h:0.3,fontFace:T.fBody,fontSize:10.5,color:T.accentInk,bold:true,charSpacing:1,margin:0}); }
  // splits "text **bold** text" into pptxgenjs runs: bold highlights key figures and thesis phrases
  // (busy-reader rule). Supported by proofs, prose, band and the templates' bodyText.
  function md(t, extra){ extra=extra||{}; const out=[];
    String(t).split(/(\*\*[^*]+\*\*)/).forEach(seg=>{ if(!seg) return;
      if(seg.startsWith("**")&&seg.endsWith("**")) out.push({text:seg.slice(2,-2), options:Object.assign({bold:true},extra)});
      else out.push({text:seg, options:Object.assign({},extra)}); });
    return out; }
  function proofs(s, items, x, y, w, h, size){
    // pptxgenjs semantics (read in genXmlTextBody): each run emits a full <a:pPr>, the last one
    // wins -> the bullet must be on ALL runs of the item; and a bulleted run splits the
    // paragraph UNLESS `align` is set at block level (the align branch short-circuits the
    // bullet branch of the splitter). Hence: bullet on every run + align:"left" at block level.
    const runs=[]; items.forEach(t=>{ const segs=md(t); segs.forEach((r,j)=>{
      const o=Object.assign({},r.options); o.bullet={code:"2022",indent:13};
      if(j===segs.length-1) o.breakLine=true;
      runs.push({text:r.text,options:o}); }); });
    s.addText(runs,
      {x,y,w,h,fontFace:T.fBody,fontSize:size||12,color:T.ink,margin:0,paraSpaceAfter:9,lineSpacingMultiple:1.12,valign:"top",align:"left"});
  }
  function flatCardLight(s,x,y,w,h){ cardShape(s,x,y,w,h,{fill:{color:T.bg},line:{color:T.rule,width:1}}); }
  // PROSE — readable written text block ("working slide" pages).
  // paras: array of items. Each item = string (paragraph) OR {lead:"...", text:"..."} (bold thesis + explanation).
  function prose(s, paras, x, y, w, h, opts){
    opts = opts||{}; const size = opts.size||13.5;
    const runs = [];
    const push=(t)=>{ const segs=md(t); segs.forEach((r,j)=>{ if(j===segs.length-1) r.options.breakLine=true; runs.push(r); }); };
    paras.forEach((p)=>{
      if (typeof p === "string"){ push(p); }
      else { runs.push({text:(p.lead?p.lead+" ":""), options:{bold:true, color:opts.leadColor||T.ink, breakLine:false}});
             push(p.text||""); }
    });
    s.addText(runs, {x,y,w,h,fontFace:T.fBody,fontSize:size,color:T.ink,margin:0,
      paraSpaceAfter:opts.gap!=null?opts.gap:12, lineSpacingMultiple:opts.line||1.35, valign:"top", align:opts.align||"left"});
  }
  // dot rating (attractiveness, priority, or a harvey-ball substitute). filled/total.
  function dots(s,x,y,filled,total,opts){ opts=opts||{}; const d=opts.d||0.15, gap=opts.gap||0.07, col=opts.color||T.accent;
    for(let i=0;i<total;i++){ const cx=x+i*(d+gap);
      s.addShape(R.OVAL,{x:cx,y,w:d,h:d, fill:i<filled?{color:col}:{color:"FFFFFF"}, line:{color:col,width:1}}); } }
  // row of metric cards ("big number + label") — impact summary / KPI strip
  // item = [value, label, iconPNG?] — the (optional) icon sits at the card's top right.
  // opts.dark: dark tiles (native accentInk gradient) + vivid accent number WITH glow (halo).
  // Glow (native pptxgenjs, text only) only renders on dark backgrounds — hence the dark variant.
  function metricStrip(s, items, x, y, w, opts){ opts=opts||{}; const n=items.length, gap=opts.gap!=null?opts.gap:0.2,
    cw=(w-gap*(n-1))/n, h=opts.h||1.15, size=opts.size||26, dk=opts.dark;
    const glowOn = dk && T.glow!==false && opts.glow!==false;
    items.forEach((it,i)=>{ const cx=x+i*(cw+gap);
      if(opts.card!==false){ cardShape(s,cx,y,cw,h,{fill:{color:dk?T.accentInk:(opts.fill||T.band)},
        line:dk?{type:"none"}:{color:T.rule,width:0.5}, objectName: dk&&T.gradients!==false?grad([T.accentInk,darken(T.accentInk,0.30)],90):undefined}); }
      if(it[2]) s.addImage({path:it[2], x:cx+cw-0.52, y:y+0.16, w:0.34, h:0.34});
      const valOpt={x:cx+0.16,y:y+0.14,w:cw-(it[2]?0.68:0.3),h:0.55,fontFace:T.fDisp,fontSize:size,color:dk?T.accentOnDark:T.accentInk,bold:true,margin:0};
      if(glowOn) valOpt.glow={size:opts.glowSize||4, color:T.accentOnDark, opacity:opts.glowOpacity||0.3};
      s.addText(it[0],valOpt);
      s.addText(it[1],{x:cx+0.16,y:y+0.7,w:cw-0.3,h:h-0.78,fontFace:T.fBody,fontSize:10.5,color:dk?T.dmute:T.gray,margin:0,lineSpacingMultiple:1.05,valign:"top"}); }); }
  // generic bottom band (label + text). implication() = band("Implication", ...).
  function band(s, label, txt, y){ y=y||6.32;
    s.addShape(R.RECTANGLE,{x:T.M,y,w:12.2,h:0.6,fill:{color:T.band},line:{color:T.rule,width:0.5}});
    s.addShape(R.RECTANGLE,{x:T.M,y,w:0.08,h:0.6,fill:{color:T.accent}});
    s.addText([{text:label+": ",options:{bold:true,color:T.accentInk}}].concat(md(txt,{color:T.ink})),
      {x:0.78,y,w:11.85,h:0.6,fontFace:T.fBody,fontSize:12,valign:"middle",margin:0,lineSpacingMultiple:1.05}); }
  // RAG status (functional colors: green/amber/red). status: green|amber|red (aliases g/o/r, on/risk/off).
  var RAG={green:"2E7D32",amber:"E68A00",red:"C62828"};
  function rag(s,x,y,status,label,opts){ opts=opts||{}; const m={green:RAG.green,g:RAG.green,on:RAG.green,vert:RAG.green,
    amber:RAG.amber,a:RAG.amber,o:RAG.amber,orange:RAG.amber,risk:RAG.amber,red:RAG.red,r:RAG.red,off:RAG.red,rouge:RAG.red};
    const c=m[(status||"").toLowerCase()]||RAG.amber, d=opts.d||0.18;
    s.addShape(R.OVAL,{x,y,w:d,h:d,fill:{color:c}});
    if(label) s.addText(label,{x:x+d+0.08,y:y-0.07,w:opts.w||2.6,h:d+0.14,fontFace:T.fBody,fontSize:opts.size||11,color:T.ink,bold:!!opts.bold,valign:"middle",margin:0}); }
  // heatmap: grid of values 0..1 (1 = green/good, 0 = red). opts.invert to flip (1 = risk).
  function heatmap(s, grid, x, y, opts){ opts=opts||{}; const cw=opts.cw||0.55, ch=opts.ch||0.34, gap=opts.gap!=null?opts.gap:0.05;
    const col=v=>{ if(opts.invert) v=1-v; v=Math.max(0,Math.min(1,v));
      const stops=[[0,[198,40,40]],[0.5,[230,138,0]],[1,[46,125,50]]]; let a=stops[0],b=stops[2];
      for(let i=0;i<stops.length-1;i++){ if(v>=stops[i][0]&&v<=stops[i+1][0]){a=stops[i];b=stops[i+1];break;} }
      const t=(v-a[0])/((b[0]-a[0])||1), c=a[1].map((ch0,j)=>Math.round(ch0+(b[1][j]-ch0)*t));
      return c.map(n=>n.toString(16).padStart(2,"0")).join("").toUpperCase(); };
    grid.forEach((row,r)=>row.forEach((v,c)=>{ s.addShape(R.RECTANGLE,{x:x+c*(cw+gap),y:y+r*(ch+gap),w:cw,h:ch,fill:{color:col(v)},line:{color:"FFFFFF",width:1.2}}); })); }
  // quote / point-of-view box (big sentence, accent border)
  function pullQuote(s,x,y,w,h,txt,opts){ opts=opts||{};
    cardShape(s,x,y,w,h,{fill:{color:T.bg},line:{color:T.accent,width:1.25}});
    s.addShape(R.RECTANGLE,{x,y,w:0.08,h,fill:{color:T.accent}});
    s.addText(txt,{x:x+0.28,y:y+0.12,w:w-0.5,h:h-0.24,fontFace:T.fDisp,fontSize:opts.size||18,color:T.accentInk,bold:true,valign:"middle",margin:0,lineSpacingMultiple:1.2}); }
  // small labelled callout ("So what?", "What we need from you"...)
  function calloutBox(s,x,y,w,h,label,txt,opts){ opts=opts||{};
    cardShape(s,x,y,w,h,{fill:{color:T.band},line:{color:T.rule,width:0.5}});
    s.addText((label||"").toUpperCase(),{x:x+0.18,y:y+0.13,w:w-0.36,h:0.3,fontFace:T.fMono,fontSize:9.5,color:T.accentInk,bold:true,charSpacing:1,margin:0});
    s.addText(txt,{x:x+0.18,y:y+0.5,w:w-0.36,h:h-0.6,fontFace:T.fBody,fontSize:opts.size||11,color:T.ink,margin:0,lineSpacingMultiple:1.25,valign:"top"}); }
  // chevron roadmap (phases as arrows). phases: [{title, sub}]
  function chevrons(s,phases,x,y,w,h,opts){ opts=opts||{}; const n=phases.length, ov=opts.overlap!=null?opts.overlap:0.18, cw=(w+ov*(n-1))/n;
    phases.forEach((p,i)=>{ const cx=x+i*(cw-ov);
      s.addShape(R.CHEVRON,{x:cx,y,w:cw,h,fill:{color:T.accent},line:{color:"FFFFFF",width:1}});
      s.addText([{text:(p.title||""),options:{bold:true,fontSize:opts.size||12,color:"FFFFFF",breakLine:true}},{text:p.sub||"",options:{fontSize:9,color:"FFFFFF"}}],
        {x:cx+(i===0?0.1:0.32),y,w:cw-0.5,h,align:"center",valign:"middle",fontFace:T.fBody,margin:0,lineSpacingMultiple:1.05}); }); }
  // WATERFALL / bridge: items [{label, value, total?:true}] (value>0 goes up, <0 down, total = absolute bar from 0)
  function waterfall(s, items, x, y, w, h, opts){ opts=opts||{}; let run=0;
    const pts=items.map(it=>{ let lo,hi,end; if(it.total){lo=0;hi=it.value;end=it.value;} else {const a=run,b=run+it.value;lo=Math.min(a,b);hi=Math.max(a,b);end=b;} run=end; return {lo,hi,end,val:it.value,total:it.total,label:it.label}; });
    const maxV=Math.max.apply(null,pts.map(p=>p.hi).concat([0]))*(opts.headroom||1.12)||1;
    const n=items.length, gap=opts.gap!=null?opts.gap:0.18, bw=(w-gap*(n-1))/n, yv=v=>y+h-(v/maxV)*h;
    pts.forEach((p,i)=>{ const bx=x+i*(bw+gap), top=yv(p.hi), bot=yv(p.lo),
      col=p.total?T.accent:(p.val>=0?(opts.up||T.accent):(opts.down||T.neg));
      s.addShape(R.RECTANGLE,{x:bx,y:top,w:bw,h:Math.max(0.04,bot-top),fill:{color:col}});
      const lbl=(p.val>=0&&!p.total?"+":"")+(opts.fmt?opts.fmt(p.val):p.val);
      s.addText(lbl,{x:bx-0.15,y:top-0.3,w:bw+0.3,h:0.27,fontFace:T.fMono,fontSize:opts.size||11,color:T.ink,bold:true,align:"center",margin:0});
      s.addText(p.label,{x:bx-gap/2,y:y+h+0.05,w:bw+gap,h:0.42,fontFace:T.fBody,fontSize:9,color:T.gray,align:"center",margin:0,lineSpacingMultiple:0.95});
      if(i<pts.length-1){ const ny=yv(p.end); s.addShape(R.LINE,{x:bx+bw,y:ny,w:gap,h:0,line:{color:T.gray2,width:0.75,dashType:"dash"}}); } }); }
  // 2x2 MATRIX: axes + items [{x:0..1, y:0..1, label, r}]
  function matrix2x2(s,x,y,w,h,opts){ opts=opts||{};
    s.addShape(R.RECTANGLE,{x,y,w,h,fill:{color:T.bg},line:{color:T.rule,width:1}});
    s.addShape(R.LINE,{x:x+w/2,y,w:0,h,line:{color:T.rule,width:0.75}});
    s.addShape(R.LINE,{x,y:y+h/2,w,h:0,line:{color:T.rule,width:0.75}});
    // rotated axis label: long flat box centered left of the plot (pptxgenjs rotates around the
    // box CENTER and wraps to pre-rotation width — same geometry as scatterMap's yLabel).
    if(opts.ylabel) s.addText(opts.ylabel,{x:x-0.32-h/2,y:y+h/2-0.15,w:h,h:0.3,rotate:270,align:"center",valign:"middle",fontFace:T.fBody,fontSize:9,color:T.gray2,margin:0});
    if(opts.xlabel) s.addText(opts.xlabel,{x,y:y+h+0.06,w,h:0.25,align:"center",fontFace:T.fBody,fontSize:9,color:T.gray2,margin:0});
    (opts.items||[]).forEach(it=>{ const d=it.r||0.26, cx=x+it.x*w, cy=y+(1-it.y)*h, lw=opts.lw||2.0;
      s.addShape(R.OVAL,{x:cx-d/2,y:cy-d/2,w:d,h:d,fill:{color:opts.dot||T.accent}});
      const left = it.x > 0.72; // far-right labels flip LEFT to stay inside the frame
      if(it.label) s.addText(it.label,{x:left?cx-d/2-0.06-lw:cx+d/2+0.06,y:cy-0.16,w:lw,h:0.32,align:left?"right":"left",fontFace:T.fBody,fontSize:10,color:T.ink,bold:true,valign:"middle",margin:0}); }); }
  // progress bar (scorecards). pct 0..100
  function progressBar(s,x,y,w,pct,opts){ opts=opts||{}; const hh=opts.h||0.18, v=Math.max(0,Math.min(100,pct));
    s.addShape(R.RECTANGLE,{x,y,w,h:hh,fill:{color:opts.track||"E8E8E8"}});
    s.addShape(R.RECTANGLE,{x,y,w:Math.max(0.03,w*v/100),h:hh,fill:{color:opts.color||T.accent}});
    if(opts.label!==false) s.addText(v+"%",{x:x+w+0.08,y:y-0.07,w:0.8,h:hh+0.14,fontFace:T.fMono,fontSize:opts.size||10,color:T.ink,bold:true,valign:"middle",margin:0}); }
  // star rating
  function stars(s,x,y,filled,max,opts){ opts=opts||{}; max=max||5; let t=""; for(let i=0;i<max;i++) t+=(i<filled?"★":"☆");
    s.addText(t,{x,y,w:opts.w||1.6,h:0.32,fontFace:T.fBody,fontSize:opts.size||14,color:opts.color||T.accent,valign:"middle",margin:0}); }
  // FUNNEL: stages [{label, value}] (decreasing width; byValue for proportional widths)
  function funnel(s,stages,x,y,w,h,opts){ opts=opts||{}; const n=stages.length, sh=(h-(n-1)*0.08)/n, base=stages[0]&&stages[0].value;
    stages.forEach((st,i)=>{ const frac=opts.byValue&&base?Math.max(0.12,st.value/base):(1-i*(0.7/n)); const bw=w*frac, bx=x+(w-bw)/2, by=y+i*(sh+0.08);
      s.addShape(R.RECTANGLE,{x:bx,y:by,w:bw,h:sh,fill:{color:T.accent}});
      s.addText(st.label+(st.value!=null?"   "+st.value:""),{x:bx,y:by,w:bw,h:sh,align:"center",valign:"middle",fontFace:T.fBody,fontSize:opts.size||11,color:"FFFFFF",bold:true,margin:0}); }); }
  // GANTT: rows [{label, start, span, color}] over opts.periods[]. + opts.milestones [{at}]
  function gantt(s, rows, x, y, w, h, opts){ opts=opts||{}; const periods=opts.periods||[], cols=periods.length||opts.cols||4,
    labelW=opts.labelW||2.2, gx=x+labelW, gw=w-labelW, colW=gw/cols, n=rows.length, rh=h/n;
    periods.forEach((p,c)=> s.addText(p,{x:gx+c*colW,y:y-0.3,w:colW,h:0.26,align:"center",fontFace:T.fMono,fontSize:9,color:T.gray2,margin:0}));
    rows.forEach((r,i)=>{ const ry=y+i*rh;
      s.addText(r.label,{x,y:ry,w:labelW-0.1,h:rh,fontFace:T.fBody,fontSize:10,color:T.ink,valign:"middle",margin:0});
      s.addShape(R.LINE,{x:gx,y:ry+rh,w:gw,h:0,line:{color:"EEEEEE",width:0.5}});
      const bx=gx+(r.start||0)*colW, bw=(r.span||1)*colW;
      s.addShape(R.ROUNDED_RECTANGLE,{x:bx+0.04,y:ry+rh*0.24,w:Math.max(0.12,bw-0.08),h:rh*0.52,fill:{color:r.color||T.accent},rectRadius:0.04}); });
    (opts.milestones||[]).forEach(m=>{ const mx=gx+m.at*colW; s.addShape(R.DIAMOND||R.OVAL,{x:mx-0.08,y:y+h+0.06,w:0.16,h:0.16,fill:{color:T.accentInk}});
      if(m.label) s.addText(m.label,{x:mx-0.6,y:y+h+0.24,w:1.2,h:0.3,align:"center",fontFace:T.fBody,fontSize:8,color:T.gray,margin:0}); }); }
  // icon columns: cols [{title, text, icon?(png path)}]
  function iconColumns(s, cols, x, y, w, opts){ opts=opts||{}; const n=cols.length, gap=opts.gap||0.3, cw=(w-gap*(n-1))/n;
    cols.forEach((c,i)=>{ const cx=x+i*(cw+gap);
      if(c.icon) s.addImage({path:c.icon,x:cx+cw/2-0.25,y,w:0.5,h:0.5});
      else s.addShape(R.OVAL,{x:cx+cw/2-0.22,y,w:0.44,h:0.44,fill:{color:T.band},line:{color:T.accent,width:1.2}});
      s.addText(c.title,{x:cx,y:y+0.62,w:cw,h:0.4,align:"center",fontFace:T.fDisp,fontSize:opts.tsize||13,color:T.ink,bold:true,margin:0});
      s.addText(c.text,{x:cx,y:y+1.04,w:cw,h:opts.h||1.4,align:"center",fontFace:T.fBody,fontSize:11,color:T.gray,margin:0,lineSpacingMultiple:1.2,valign:"top"}); }); }
  // "how to win" FORMULA: terms = [str...] (last = result). auto ops (+ … =) or opts.ops.
  function formula(s, terms, x, y, w, h, opts){ opts=opts||{}; const n=terms.length,
    ops=opts.ops||terms.map((_,i)=> i===n-2?"=":"+").slice(0,n-1), gap=opts.gap||0.5, cw=(w-gap*(n-1))/n;
    terms.forEach((t,i)=>{ const cx=x+i*(cw+gap), res=(i===n-1);
      s.addShape(R.OVAL,{x:cx,y,w:cw,h,fill:{color:res?T.accent:T.band},line:{color:T.accent,width:1.5}});
      s.addText(t,{x:cx+0.1,y,w:cw-0.2,h,align:"center",valign:"middle",fontFace:T.fDisp,fontSize:opts.size||13,color:res?"FFFFFF":T.accentInk,bold:true,margin:0,lineSpacingMultiple:1.0});
      if(i<n-1) s.addText(ops[i],{x:cx+cw,y,w:gap,h,align:"center",valign:"middle",fontFace:T.fDisp,fontSize:opts.opsize||24,color:T.ink,bold:true,margin:0}); }); }
  // concentric LAYERS ("big picture"): levels outer→inner = [{label, fill?}]
  function layers(s, levels, cx, cy, rx, ry, opts){ opts=opts||{}; const n=levels.length;
    levels.forEach((lv,i)=>{ const f=1-i/n, w=2*rx*f, h=2*ry*f, last=i===n-1;
      s.addShape(R.OVAL,{x:cx-w/2,y:cy-h/2,w,h,fill:{color:lv.fill||(last?T.accent:T.band)},line:{color:T.accent,width:1}});
      s.addText(lv.label,{x:cx-w/2,y:last?cy-0.25:cy-h/2+0.1,w,h:last?0.5:0.4,align:"center",valign:last?"middle":"top",fontFace:T.fBody,fontSize:opts.size||11,color:last?"FFFFFF":T.ink,bold:true,margin:0,lineSpacingMultiple:1.0}); }); }
  // CYCLE (operating model): center + satellite items[]
  function cycle(s, items, cx, cy, r, opts){ opts=opts||{}; const n=items.length, cr=opts.cr||0.85, sd=opts.sd||1.1;
    s.addShape(R.OVAL,{x:cx-cr,y:cy-cr,w:cr*2,h:cr*2,fill:{color:T.accent}});
    if(opts.center) s.addText(opts.center,{x:cx-cr,y:cy-cr,w:cr*2,h:cr*2,align:"center",valign:"middle",fontFace:T.fDisp,fontSize:opts.csize||12,color:"FFFFFF",bold:true,margin:0,lineSpacingMultiple:1.0});
    items.forEach((it,i)=>{ const a=-Math.PI/2+i*2*Math.PI/n, px=cx+Math.cos(a)*r, py=cy+Math.sin(a)*r;
      s.addShape(R.OVAL,{x:px-sd/2,y:py-sd/2,w:sd,h:sd,fill:{color:T.band},line:{color:T.accent,width:1.25}});
      s.addText(it,{x:px-sd/2,y:py-sd/2,w:sd,h:sd,align:"center",valign:"middle",fontFace:T.fBody,fontSize:opts.size||10,color:T.ink,bold:true,margin:0,lineSpacingMultiple:1.0}); }); }
  // ISSUE TREE: root {label, children:[{label, children?}]} — elbow connectors
  function issueTree(s, root, x, y, w, h, opts){ opts=opts||{}; const colW=opts.colW||2.7, bh=opts.boxH||0.5, fs=opts.size||10.5,
    L=(col)=>x+col*colW, bw=colW-0.35;
    function box(bx,by,txt,acc){ s.addShape(R.RECTANGLE,{x:bx,y:by,w:bw,h:bh,fill:{color:acc?T.accent:T.bg},line:{color:T.accent,width:1}});
      s.addText(txt,{x:bx+0.08,y:by,w:bw-0.16,h:bh,valign:"middle",fontFace:T.fBody,fontSize:fs,color:acc?"FFFFFF":T.ink,bold:!!acc,margin:0,lineSpacingMultiple:0.95}); }
    const ch=root.children||[], n=ch.length, rootY=y+h/2-bh/2; box(L(0),rootY,root.label,true);
    const spineX=L(1)-0.18, stepY=h/n, mid=i=>y+i*stepY+stepY/2;
    s.addShape(R.LINE,{x:L(0)+bw,y:rootY+bh/2,w:spineX-(L(0)+bw),h:0,line:{color:T.rule,width:1}});
    s.addShape(R.LINE,{x:spineX,y:mid(0),w:0,h:mid(n-1)-mid(0),line:{color:T.rule,width:1}});
    ch.forEach((c,i)=>{ const cy=mid(i)-bh/2; s.addShape(R.LINE,{x:spineX,y:cy+bh/2,w:L(1)-spineX,h:0,line:{color:T.rule,width:1}}); box(L(1),cy,c.label);
      const sub=c.children||[]; if(sub.length){ const sStep=stepY/sub.length, sSpine=L(2)-0.18;
        s.addShape(R.LINE,{x:L(1)+bw,y:cy+bh/2,w:sSpine-(L(1)+bw),h:0,line:{color:T.rule,width:0.75}});
        const sMid=j=>y+i*stepY+j*sStep+sStep/2; if(sub.length>1) s.addShape(R.LINE,{x:sSpine,y:sMid(0),w:0,h:sMid(sub.length-1)-sMid(0),line:{color:T.rule,width:0.75}});
        sub.forEach((sb,j)=>{ const sy=sMid(j)-bh*0.42; s.addShape(R.LINE,{x:sSpine,y:sy+bh*0.42,w:L(2)-sSpine,h:0,line:{color:T.rule,width:0.75}});
          s.addShape(R.RECTANGLE,{x:L(2),y:sy,w:bw,h:bh*0.84,fill:{color:T.band},line:{color:T.rule,width:0.75}});
          s.addText(sb.label||sb,{x:L(2)+0.08,y:sy,w:bw-0.16,h:bh*0.84,valign:"middle",fontFace:T.fBody,fontSize:fs-0.5,color:T.ink,margin:0,lineSpacingMultiple:0.9}); }); } }); }
  // light-background chart (key bar/series in accent, the rest in gray via chartColors)
  function chartLight(extra){ return Object.assign({
    chartArea:{fill:{color:T.bg}}, plotArea:{fill:{color:T.bg}},
    catAxisLabelColor:T.gray, valAxisLabelColor:T.gray2, catAxisLabelFontFace:T.fBody, valAxisLabelFontFace:T.fMono,
    catAxisLabelFontSize:11, valAxisLabelFontSize:9, valGridLine:{color:"E8E8E8",size:0.5}, catGridLine:{style:"none"},
    showLegend:false, showValue:true, dataLabelColor:T.ink, dataLabelFontFace:T.fMono, dataLabelFontSize:12, dataLabelFontBold:true,
    dataLabelPosition:"outEnd", valAxisMinVal:0, chartColors:[T.accent] }, extra||{}); }
  // ---------- NATIVE pptxgenjs CHART PRIMITIVES (Sprint OS styling) ----------
  // Series palette: accent + derivatives (never a rainbow; the key series carries the accent, the rest fades).
  const seriesPalette = () => [T.accent, lighten(T.accent,0.35), darken(T.accent,0.28), T.neg, lighten(T.accent,0.6)];
  // DOUGHNUT / ring — o:{x,y,w,h, slices:[{label,value}], hole?, colors?, legend?}
  function doughnutChart(s, o){ const sl=o.slices||[];
    s.addChart(pres.charts.DOUGHNUT, [{name:o.name||"part", labels:sl.map(x=>x.label), values:sl.map(x=>x.value)}],
      chartLight({x:o.x,y:o.y,w:o.w,h:o.h, holeSize:o.hole||62, showLegend:o.legend!==false, legendPos:o.legendPos||"r",
        legendColor:T.ink, legendFontFace:T.fBody, legendFontSize:11, showValue:false, showPercent:o.percent!==false,
        dataLabelColor:"FFFFFF", dataLabelFontFace:T.fMono, dataLabelFontSize:11, chartColors:o.colors||seriesPalette()})); }
  // RADAR / spider — o:{x,y,w,h, axes:[...], series:[{name,values:[...]}], colors?}
  function radarChart(s, o){ const data=(o.series||[]).map(se=>({name:se.name, labels:o.axes, values:se.values}));
    s.addChart(pres.charts.RADAR, data, chartLight({x:o.x,y:o.y,w:o.w,h:o.h, radarStyle:"standard",
      showLegend:(o.series||[]).length>1, legendPos:"b", legendColor:T.ink, legendFontFace:T.fBody, legendFontSize:11,
      showValue:false, catAxisLabelColor:T.ink, catAxisLabelFontSize:11, valAxisHidden:true, valGridLine:{color:"E8E8E8",size:0.5},
      chartColors:o.colors||seriesPalette(), lineSize:2})); }
  // COMBO bars + line (2nd axis) — o:{x,y,w,h, cats, bar:{name,values}, line:{name,values}, barColor?, lineColor?}
  function comboBarLine(s, o){
    s.addChart([
      {type:pres.charts.BAR, data:[{name:o.bar.name, labels:o.cats, values:o.bar.values}],
        options:{chartColors:[o.barColor||T.accent], barDir:"col"}},
      {type:pres.charts.LINE, data:[{name:o.line.name, labels:o.cats, values:o.line.values}],
        options:{chartColors:[o.lineColor||T.accentInk], secondaryValAxis:true, secondaryCatAxis:true,
          lineSize:2.5, lineDataSymbol:"circle", lineDataSymbolSize:6}}
    ], (()=>{ const opts = chartLight({x:o.x,y:o.y,w:o.w,h:o.h, showLegend:true, legendPos:"b", legendColor:T.ink, legendFontFace:T.fBody,
      legendFontSize:11, showValue:false,
      // secondary axis: pptxgenjs requires paired valAxes AND catAxes (2 entries); the 1st valAxis reuses the light style
      valAxes:[{valAxisLabelColor:T.gray2, valAxisLabelFontFace:T.fMono, valAxisLabelFontSize:9, valGridLine:{color:"E8E8E8",size:0.5}},
               {valAxisHidden:false, valAxisLabelColor:T.gray2, valAxisLabelFontFace:T.fMono, valAxisLabelFontSize:9}],
      catAxes:[{catAxisLabelColor:T.gray, catAxisLabelFontFace:T.fBody, catAxisLabelFontSize:11}, {catAxisHidden:true}] });
      // "outEnd" is invalid inside <c:lineChart> (ECMA-376) and triggers PowerPoint's repair prompt;
      // labels are hidden anyway (showValue:false), so drop the position hint entirely.
      delete opts.dataLabelPosition; return opts; })()); }
  // POSITIONING SCATTER (manual shapes: NAMED points + quadrants) --------------
  // o:{x,y,w,h, xLabel,yLabel, quadrants:[topLeft,topRight,bottomLeft,bottomRight]?, points:[{label,x,y(0..1),size?,highlight?}]}
  function scatterMap(s, o){ const z={x:o.x,y:o.y,w:o.w,h:o.h}, pad=0.5;
    const px=z.x+pad, py=z.y+0.1, pw=z.w-pad-0.15, ph=z.h-pad-0.1; // plot area
    // frame + quadrant separators
    s.addShape(R.RECTANGLE,{x:px,y:py,w:pw,h:ph,fill:{color:"FBFCFD"},line:{color:T.rule,width:1}});
    s.addShape(R.LINE,{x:px+pw/2,y:py,w:0,h:ph,line:{color:T.rule,width:0.75,dashType:"dash"}});
    s.addShape(R.LINE,{x:px,y:py+ph/2,w:pw,h:0,line:{color:T.rule,width:0.75,dashType:"dash"}});
    // quadrant labels (optional)
    const q=o.quadrants; if(q){ const qs=[[px+0.1,py+0.08,"l"],[px+pw-0.1,py+0.08,"r"],[px+0.1,py+ph-0.32,"l"],[px+pw-0.1,py+ph-0.32,"r"]];
      q.forEach((t,i)=>{ if(!t)return; s.addText(t,{x:qs[i][2]==="l"?qs[i][0]:px+pw/2,y:qs[i][1],w:pw/2-0.2,h:0.24,
        align:qs[i][2],fontFace:T.fMono,fontSize:9,bold:true,color:T.gray2,margin:0}); }); }
    // axis labels
    if(o.xLabel) s.addText(o.xLabel,{x:px,y:py+ph+0.06,w:pw,h:0.3,align:"center",fontFace:T.fBody,fontSize:10,italic:true,color:T.gray,margin:0});
    // rotated axis label: pptxgenjs rotates the box around ITS CENTER, and text wraps to the
    // pre-rotation width — so use a LONG FLAT box whose center sits left of the plot's middle.
    if(o.yLabel) s.addText(o.yLabel,{x:px-0.32-ph/2, y:py+ph/2-0.15, w:ph, h:0.3,
      align:"center",valign:"middle",fontFace:T.fBody,fontSize:10,italic:true,color:T.gray,margin:0,rotate:270});
    // named points
    (o.points||[]).forEach(p=>{ const d=(p.size||0.2), cx=px+p.x*pw-d/2, cy=py+(1-p.y)*ph-d/2, hl=p.highlight;
      s.addShape(R.OVAL,{x:cx,y:cy,w:d,h:d,fill:{color:hl?T.accent:lighten(T.accent,0.45)},line:{color:hl?T.accentInk:T.accent,width:1}});
      const left = p.x > 0.72; // labels of far-right points flip LEFT so they stay inside the frame
      s.addText(p.label,{x:left?cx-1.64:cx+d+0.04,y:cy-0.02+d/2-0.12,w:1.6,h:0.24,align:left?"right":"left",fontFace:T.fBody,fontSize:9.5,bold:!!hl,color:hl?T.accentInk:T.ink,margin:0,valign:"middle"}); }); }

  // ---------- NATIVE data exhibits (pure pptxgenjs shapes -> fully EDITABLE in PowerPoint) ----------
  // These replace the SVG factories for DATA exhibits: same visuals, but every bar/dot/label is a
  // real shape the client can edit. The SVG engine stays for decorative visuals only.
  // SLOPE chart — o:{items:[{label,a,b,highlight?}], leftLabel, rightLabel}
  function slopeChart(s, o, x, y, w, h){
    const items=o.items||[], xL=x+1.55, xR=x+w-1.55, yT=y+0.5, yB=y+h-0.15;
    const vals=items.flatMap(i=>[i.a,i.b]), min=Math.min.apply(null,vals), max=Math.max.apply(null,vals);
    const span=(max-min)||1, Y=v=>yB-(v-min)/span*(yB-yT);
    s.addText(o.leftLabel||"Before",{x:xL-0.8,y:y,w:1.6,h:0.3,align:"center",fontFace:T.fDisp,fontSize:13,bold:true,color:T.ink,margin:0});
    s.addText(o.rightLabel||"After",{x:xR-0.8,y:y,w:1.6,h:0.3,align:"center",fontFace:T.fDisp,fontSize:13,bold:true,color:T.ink,margin:0});
    [xL,xR].forEach(px=> s.addShape(R.LINE,{x:px,y:yT-0.06,w:0,h:(yB-yT)+0.12,line:{color:"E4E8ED",width:1.5}}));
    items.forEach(it=>{ const c=it.highlight?T.accent:"C2CAD3", lw=it.highlight?2.75:1.75, ya=Y(it.a), yb=Y(it.b);
      s.addShape(R.LINE,{x:xL,y:Math.min(ya,yb),w:xR-xL,h:Math.abs(yb-ya),line:{color:c,width:lw},flipV:yb<ya});
      [[xL,ya],[xR,yb]].forEach(p=> s.addShape(R.OVAL,{x:p[0]-0.05,y:p[1]-0.05,w:0.1,h:0.1,fill:{color:c},line:{type:"none"}}));
      const tc=it.highlight?T.ink:T.gray, bold=!!it.highlight;
      s.addText(it.label+"  "+it.a,{x:xL-1.62,y:ya-0.12,w:1.5,h:0.26,align:"right",fontFace:T.fBody,fontSize:10.5,bold,color:tc,margin:0,valign:"middle"});
      s.addText(it.b+"  "+it.label,{x:xR+0.12,y:yb-0.12,w:1.5,h:0.26,align:"left",fontFace:T.fBody,fontSize:10.5,bold,color:tc,margin:0,valign:"middle"}); }); }
  // DUMBBELL — o:{items:[{label,a,b}], aLabel,bLabel, max?}
  function dumbbellChart(s, o, x, y, w, h){
    const items=o.items||[], lw=1.9, xL=x+lw, xR=x+w-0.55;
    const max=o.max||Math.max.apply(null,items.flatMap(i=>[i.a,i.b]))*1.12||1, X=v=>xL+v/max*(xR-xL);
    s.addText([{text:"● ",options:{color:"C2CAD3"}},{text:(o.aLabel||"Before")+"    ",options:{color:T.gray,bold:true}},
               {text:"● ",options:{color:T.accent}},{text:o.bLabel||"After",options:{color:T.accentInk,bold:true}}],
      {x:xL,y:y,w:w-lw,h:0.28,fontFace:T.fBody,fontSize:10.5,margin:0});
    const rh=(h-0.45)/items.length;
    items.forEach((it,i)=>{ const cy=y+0.55+i*rh+rh/2-0.05, xa=X(it.a), xb=X(it.b);
      s.addText(it.label,{x:x,y:cy-0.13,w:lw-0.12,h:0.28,align:"right",fontFace:T.fBody,fontSize:10.5,bold:true,color:T.ink,margin:0,valign:"middle"});
      s.addShape(R.LINE,{x:Math.min(xa,xb),y:cy,w:Math.abs(xb-xa),h:0,line:{color:"DCE1E7",width:3.5}});
      s.addShape(R.OVAL,{x:xa-0.08,y:cy-0.08,w:0.16,h:0.16,fill:{color:"C2CAD3"},line:{type:"none"}});
      s.addShape(R.OVAL,{x:xb-0.08,y:cy-0.08,w:0.16,h:0.16,fill:{color:T.accent},line:{type:"none"}});
      // on declines (b left of a) the value label flips to the LEFT of the b-dot, away from the gray dot
      const dec = xb < xa;
      s.addText(String(it.b),{x:dec?xb-0.82:xb+0.12,y:cy-0.13,w:0.7,h:0.28,align:dec?"right":"left",fontFace:T.fMono,fontSize:10.5,bold:true,color:T.accentInk,margin:0,valign:"middle"}); }); }
  // BULLET chart — o:{items:[{label,value,target,max?}]}
  function bulletChart(s, o, x, y, w, h){
    const items=o.items||[], lw=1.7, bw=w-lw-0.7, rh=h/items.length;
    items.forEach((it,i)=>{ const ry=y+i*rh+rh/2-0.14, max=(it.max||Math.max(it.value,it.target||0)*1.25)||1;
      const W2=v=>Math.max(0,Math.min(1,v/max))*bw;
      s.addText(it.label,{x:x,y:ry,w:lw-0.12,h:0.28,align:"right",fontFace:T.fBody,fontSize:10.5,bold:true,color:T.ink,margin:0,valign:"middle"});
      s.addShape(R.ROUNDED_RECTANGLE,{x:x+lw,y:ry,w:bw,h:0.28,rectRadius:0.05,fill:{color:"EEF1F5"},line:{type:"none"}});
      s.addShape(R.ROUNDED_RECTANGLE,{x:x+lw,y:ry,w:Math.max(0.05,W2(it.value)),h:0.28,rectRadius:0.05,fill:{color:T.accent},line:{type:"none"}});
      if(it.target!=null) s.addShape(R.RECTANGLE,{x:x+lw+W2(it.target)-0.02,y:ry-0.05,w:0.045,h:0.38,fill:{color:T.ink}});
      s.addText(String(it.value),{x:x+lw+bw+0.1,y:ry,w:0.6,h:0.28,fontFace:T.fMono,fontSize:10.5,bold:true,color:T.accentInk,margin:0,valign:"middle"}); }); }
  // WAFFLE — o:{value(0..100), label?, sub?} ; 10x10 grid filled bottom-up + big figure on the right
  function waffleChart(s, o, x, y, w, h){
    const size=Math.min(h,w*0.55), cell=size/10*0.82, gap=size/10*0.18, filled=Math.round(Math.max(0,Math.min(100,o.value)));
    for(let r=0;r<10;r++) for(let c=0;c<10;c++){ const idx=(9-r)*10+c;
      s.addShape(R.ROUNDED_RECTANGLE,{x:x+c*(cell+gap),y:y+r*(cell+gap),w:cell,h:cell,rectRadius:cell*0.18,
        fill:{color:idx<filled?T.accent:"E9EDF2"},line:{type:"none"}}); }
    const tx=x+10*(cell+gap)+0.3;
    s.addText(o.label!=null?o.label:filled+"%",{x:tx,y:y+size*0.2,w:w-(tx-x),h:0.8,fontFace:T.fDisp,fontSize:40,bold:true,color:T.ink,margin:0});
    if(o.sub) s.addText(o.sub,{x:tx,y:y+size*0.2+0.85,w:w-(tx-x),h:1.0,fontFace:T.fBody,fontSize:12,color:T.gray,margin:0,lineSpacingMultiple:1.15,valign:"top"}); }
  // MEKKO / Marimekko — o:{cols:[{label,weight,segs:[{value,color?}]}]}
  function mekkoChart(s, o, x, y, w, h){
    const cols=o.cols||[], gap=0.08, totW=cols.reduce((a,c)=>a+c.weight,0)||1, ph=h-0.4;
    const pal=[T.accent, lighten(T.accent,0.3), lighten(T.accent,0.6), darken(T.accent,0.25)];
    let cx=x;
    cols.forEach(col=>{ const cw=(col.weight/totW)*(w-gap*(cols.length-1)); const tot=(col.segs||[]).reduce((a,s2)=>a+s2.value,0)||1; let cy=y;
      (col.segs||[]).forEach((sg,i)=>{ const sh=sg.value/tot*ph;
        s.addShape(R.RECTANGLE,{x:cx,y:cy,w:cw,h:sh,fill:{color:sg.color||pal[i%pal.length]},line:{color:"FFFFFF",width:1}});
        if(sh>0.28) s.addText(Math.round(sg.value/tot*100)+"%",{x:cx,y:cy+sh/2-0.13,w:cw,h:0.26,align:"center",fontFace:T.fMono,fontSize:10,bold:true,color:"FFFFFF",margin:0});
        cy+=sh; });
      s.addText(col.label,{x:cx-0.15,y:y+ph+0.08,w:cw+0.3,h:0.3,align:"center",fontFace:T.fBody,fontSize:10.5,bold:true,color:T.ink,margin:0});
      cx+=cw+gap; }); }
  // VENN (3 sets) — o:{sets:[{label,color?}], center?} ; transparent native ovals.
  // Geometry fits INSIDE (x,y,w,h) including the labels; colors = accent + derivatives (palette doctrine).
  function vennDiagram(s, o, x, y, w, h){
    const sets=(o.sets||[]).slice(0,3);
    const pal=[T.accent, lighten(T.accent,0.45), darken(T.accent,0.3)];
    const r=Math.min(w/3.2, (h-0.7)/3.0), d=r*0.62;
    const cx=x+w/2, cy=y+1.62*r+0.32;
    const pts=[[cx,cy-d],[cx-d*0.92,cy+d*0.6],[cx+d*0.92,cy+d*0.6]];
    sets.forEach((st,i)=> s.addShape(R.OVAL,{x:pts[i][0]-r,y:pts[i][1]-r,w:2*r,h:2*r,
      fill:{color:st.color||pal[i],transparency:62},line:{color:st.color||pal[i],width:1}}));
    if(o.center) s.addText(o.center,{x:cx-0.8,y:cy+r*0.15-0.14,w:1.6,h:0.3,align:"center",fontFace:T.fDisp,fontSize:12,bold:true,color:T.ink,margin:0});
    const lp=[[cx-1.0,pts[0][1]-r-0.3],[pts[1][0]-r-0.5,pts[1][1]+r+0.04],[pts[2][0]+r-1.5,pts[2][1]+r+0.04]];
    sets.forEach((st,i)=> s.addText(st.label,{x:lp[i][0],y:lp[i][1],w:2.0,h:0.28,align:"center",fontFace:T.fBody,fontSize:11,bold:true,color:T.ink,margin:0})); }

  // table cells (anthracite header, key value highlighted in accent)
  const th = (t,al)=>({text:t,options:{fill:{color:T.accentInk},color:"FFFFFF",bold:true,fontFace:T.fDisp,fontSize:11.5,align:al||"left",valign:"middle"}});
  const tk = (t)=>({text:t,options:{color:T.ink,fontFace:T.fBody,fontSize:11.5,align:"left",valign:"middle",fill:{color:T.bg}}});
  const tv = (t,hl)=>({text:t,options:{color:hl?T.accentInk:T.gray,bold:!!hl,fontFace:T.fMono,fontSize:11.5,align:"right",valign:"middle",fill:{color:hl?T.band:T.bg}}});

  // ---------- GRID ENGINE (usable area between the title block and the kicker) ----------
  // zone() -> content region {x,y,w,h}. Options: top (default 2.1), bottom (default 6.17; 6.95 if noKicker).
  function zone(opts){ opts=opts||{}; const top=opts.top!=null?opts.top:2.1,
    bottom=opts.bottom!=null?opts.bottom:(opts.noKicker?6.95:6.17);
    return {x:T.M, y:top, w:T.W-2*T.M, h:bottom-top}; }
  // cols([2,1]) -> weighted columns of the usable zone (exact gutters). cols([1,1,1],{gap:0.25,top:2.3})
  function cols(weights, opts){ opts=opts||{}; return splitW(opts.zone||zone(opts), weights, opts.gap!=null?opts.gap:0.3); }
  // rows(z,[1,2]) -> weighted rows of a region z (nestable: rows(cols([2,1])[0], [1,1]))
  function rows(z, weights, gap){ return splitH(z, weights, gap!=null?gap:0.25); }
  function splitW(z, weights, gap){ const tot=weights.reduce((a,b)=>a+b,0), avail=z.w-gap*(weights.length-1); let cx=z.x;
    return weights.map(wt=>{ const cw=avail*wt/tot, r={x:cx,y:z.y,w:cw,h:z.h}; cx+=cw+gap; return r; }); }
  function splitH(z, weights, gap){ const tot=weights.reduce((a,b)=>a+b,0), avail=z.h-gap*(weights.length-1); let cy=z.y;
    return weights.map(wt=>{ const ch=avail*wt/tot, r={x:z.x,y:cy,w:z.w,h:ch}; cy+=ch+gap; return r; }); }
  // pad(z, 0.15) -> shrunken region (inner padding of a card)
  function pad(z, p){ return {x:z.x+p, y:z.y+p, w:z.w-2*p, h:z.h-2*p}; }

  // ---------- MBB CRAFT HELPERS ----------
  // exhibit header: factual description + unit + period, above every chart/table.
  // e.g. exhibitHeader(s, "Revenue by segment, EUR B, 2021-2025", z.x, z.y, z.w)
  function exhibitHeader(s, txt, x, y, w){
    s.addText(txt,{x,y,w,h:0.26,fontFace:T.fBody,fontSize:10,color:T.gray,bold:true,margin:0,valign:"middle"}); }
  // annotated growth arrow between two points (above the bars). label e.g. "+12%/yr"
  function cagrArrow(s, x1, y1, x2, y2, label){
    s.addShape(R.LINE,{x:x1,y:y1,w:x2-x1,h:y2-y1,line:{color:T.accentInk,width:1.5,endArrowType:"triangle"}});
    if(label) s.addText(label,{x:(x1+x2)/2-0.75,y:Math.min(y1,y2)-0.3,w:1.5,h:0.26,align:"center",
      fontFace:T.fMono,fontSize:10,bold:true,color:T.accentInk,margin:0}); }
  // callout box pointing at a spot on an exhibit (inflection point, outlier)
  function chartCallout(s, txt, x, y, w, tx, ty){
    const h=0.52; s.addShape(R.LINE,{x:x+w/2,y:y+h,w:tx-(x+w/2),h:ty-(y+h),line:{color:T.gray2,width:0.75}});
    s.addShape(R.RECTANGLE,{x,y,w,h,fill:{color:T.bg},line:{color:T.accentInk,width:1}});
    s.addText(txt,{x:x+0.08,y,w:w-0.16,h,fontFace:T.fBody,fontSize:9.5,color:T.ink,valign:"middle",margin:0,lineSpacingMultiple:0.95}); }
  // section tracker (top-right; decks > 15 slides). sections=["Context","Diagnosis",...], activeIdx.
  function tracker(s, sections, activeIdx, dark){
    const runs=[]; sections.forEach((t,i)=>{ if(i) runs.push({text:"  ·  ",options:{color:dark?T.dmute:T.gray2}});
      runs.push({text:t.toUpperCase(),options:{bold:i===activeIdx,
        color:i===activeIdx?(dark?T.accentOnDark:T.accentInk):(dark?T.dmute:T.gray2)}}); });
    s.addText(runs,{x:T.W-8.2-T.M,y:0.34,w:8.2,h:0.28,align:"right",fontFace:T.fMono,fontSize:8.5,charSpacing:1,margin:0}); }
  // quartered harvey ball (0..4). Rendered as PIE + outline (visually verified in QA).
  function harvey(s, x, y, q, opts){ opts=opts||{}; const d=opts.d||0.22, col=opts.color||T.accentInk;
    if(q>=4){ s.addShape(R.OVAL,{x,y,w:d,h:d,fill:{color:col},line:{color:col,width:1}}); }
    else { if(q>0) s.addShape(R.PIE,{x,y,w:d,h:d,fill:{color:col},line:{color:col,width:0.5},angleRange:[270,270+q*90]});
      s.addShape(R.OVAL,{x,y,w:d,h:d,fill:{type:"none"},line:{color:col,width:1}}); } }
  // numbered footnotes, on ONE line between the kicker (ends 6.92) and the source (7.02).
  // items=["definition…","scope…"]; call in the body: "Adjusted EBITDA¹"
  function footnotes(s, items){ if(!items||!items.length) return;
    const runs=[]; items.forEach((t,i)=>{ if(i) runs.push({text:"    ",options:{}});
      runs.push({text:(i+1)+". ",options:{bold:true,color:T.gray2}}); runs.push({text:t,options:{color:T.gray2}}); });
    s.addText(runs,{x:T.M,y:6.93,w:12.2,h:0.14,fontFace:T.fBody,fontSize:7,margin:0,valign:"top"}); }

  // ---------- DARK PAGES (structure / visual): background = PNG generated by gen_bg.cjs ----------
  function darkBase(s, bgPath){ if(bgPath) s.background={path:bgPath}; else s.background={color:T.dbg}; }
  function eyebrowDark(s,t,y){ s.addText((t||"").toUpperCase(),{x:0.85,y:y||1.25,w:11,h:0.35,fontFace:T.fMono,fontSize:12,color:T.accentOnDark,bold:true,charSpacing:3,margin:0}); }
  function coverDark(s, o){ // o:{bgPath,eyebrow,title,governing,metaA,metaB,metaC,metaD,source}
    darkBase(s,o.bgPath);
    eyebrowDark(s,o.eyebrow,1.25);
    s.addText(o.title,{x:0.82,y:1.7,w:11.6,h:1.0,fontFace:T.fDisp,fontSize:42,color:T.don,bold:true,margin:0});
    s.addShape(R.RECTANGLE,{x:0.85,y:2.85,w:2.0,h:0.05,fill:{color:T.accentOnDark}});
    if(o.governing) s.addText(o.governing,{x:0.85,y:3.15,w:10.8,h:1.5,fontFace:T.fBody,fontSize:18,color:T.don,margin:0,lineSpacingMultiple:1.12});
    s.addShape(R.LINE,{x:0.85,y:5.55,w:11.6,h:0,line:{color:T.dline,width:1}});
    if(o.metaA) s.addText(o.metaA,{x:0.85,y:5.7,w:5.4,h:0.3,fontFace:T.fBody,fontSize:13,color:T.don,bold:true,margin:0});
    if(o.metaB) s.addText(o.metaB,{x:0.85,y:6.0,w:5.4,h:0.3,fontFace:T.fBody,fontSize:12,color:T.dmute,margin:0});
    if(o.metaC) s.addText(o.metaC,{x:6.5,y:5.7,w:5.4,h:0.3,fontFace:T.fBody,fontSize:13,color:T.don,bold:true,margin:0});
    if(o.metaD) s.addText(o.metaD,{x:6.5,y:6.0,w:5.4,h:0.3,fontFace:T.fBody,fontSize:12,color:T.dmute,margin:0});
    if(o.source) s.addText(o.source,{x:0.85,y:6.95,w:11.6,h:0.3,fontFace:T.fBody,fontSize:9,color:T.dmute,margin:0});
  }
  function coverLight(s, o){ // LIGHT cover page (default): large type on white + VARIED accent composition
    // o:{eyebrow,title,governing,metaA,metaB,metaC,metaD,source, style:"beams"|"arcs"|"mosaic"}
    // RULE: vary the cover style from one deck to the next (like the dark backgrounds).
    s.background = { color:T.bg };
    const cs = o.style||"beams";
    if(cs==="arcs"){ // concentric quarter circles top-right
      [[3.6,0],[2.75,55],[1.95,78],[1.2,40]].forEach(([r,tr],i)=>
        s.addShape(R.OVAL,{x:13.3-r,y:-r,w:r*2,h:r*2,
          fill:Object.assign({color:i===3?T.accent:(i===0?T.band:T.accent)},tr?{transparency:tr}:{}) }));
    } else if(cs==="mosaic"){ // staggered rounded tiles top-right
      [{x:10.4,y:0.5,d:1.15,c:T.band},{x:11.75,y:0.2,d:1.5,c:T.accent,tr:75},{x:11.35,y:1.9,d:0.85,c:T.accent,tr:40},
       {x:12.5,y:1.55,d:1.15,c:T.accent},{x:12.35,y:2.95,d:0.75,c:T.band},{x:10.9,y:2.55,d:0.5,c:T.accent,tr:60}].forEach(t=>
        s.addShape(R.ROUNDED_RECTANGLE,{x:t.x,y:t.y,w:t.d,h:t.d,rectRadius:0.16,
          fill:Object.assign({color:t.c},t.tr?{transparency:t.tr}:{}) }));
    } else if(cs==="rings"){ // thin rings bottom-right + solid dot (echo of the halo background)
      [[3.3,T.band,2.5],[2.55,T.accent,1.2],[1.85,T.accent,1.6],[1.15,T.accent,2.2]].forEach(([r,c,w])=>
        s.addShape(R.OVAL,{x:12.4-r,y:6.6-r,w:r*2,h:r*2,fill:{color:"FFFFFF",transparency:100},line:{color:c,width:w}}));
      s.addShape(R.OVAL,{x:12.12,y:6.32,w:0.56,h:0.56,fill:{color:T.accent}});
    } else if(cs==="dots"){ // dot grid fading top-right (halftone)
      for(let r=0;r<5;r++) for(let c=0;c<7;c++){ const tr=Math.min(88,(r+c)*9);
        if(tr<88) s.addShape(R.OVAL,{x:10.55+c*0.38,y:0.45+r*0.38,w:0.15,h:0.15,
          fill:Object.assign({color:T.accent},tr?{transparency:tr}:{}) }); }
    } else if(cs==="bands"){ // flag: thin horizontal bands at the top of the slide
      s.addShape(R.RECTANGLE,{x:0,y:0,w:13.3,h:0.22,fill:{color:T.accent}});
      s.addShape(R.RECTANGLE,{x:0,y:0.22,w:13.3,h:0.13,fill:{color:T.accent,transparency:55}});
      s.addShape(R.RECTANGLE,{x:0,y:0.35,w:13.3,h:0.09,fill:{color:T.band}});
    } else if(cs==="corner"){ // bold color block bleeding off the top-right corner
      s.addShape(R.ROUNDED_RECTANGLE,{x:10.15,y:-1.3,w:4.2,h:3.9,rectRadius:0.3,rotate:12,fill:{color:T.band}});
      s.addShape(R.ROUNDED_RECTANGLE,{x:10.95,y:-1.7,w:4.2,h:3.9,rectRadius:0.3,rotate:12,fill:{color:T.accent}});
    } else if(cs==="split"){ // solid vertical panel on the right (editorial color-block)
      s.addShape(R.RECTANGLE,{x:10.1,y:0,w:3.2,h:7.5,fill:{color:T.accent}});
      s.addShape(R.RECTANGLE,{x:9.9,y:0,w:0.2,h:7.5,fill:{color:T.band}});
      [[10.7,1.3],[11.6,3.1],[10.9,5.0]].forEach(([x,y])=>
        s.addShape(R.OVAL,{x,y,w:0.9,h:0.9,fill:{color:"FFFFFF",transparency:82}}));
    } else { // beams (default): diagonal rounded beams
      [{x:9.6,y:-2.4,w:1.35,h:8.2,c:T.band},
       {x:11.0,y:-3.0,w:1.8,h:9.0,c:T.accent,tr:80},
       {x:12.45,y:-2.2,w:1.0,h:7.6,c:T.accent,tr:45}].forEach(b=>
        s.addShape(R.ROUNDED_RECTANGLE,{x:b.x,y:b.y,w:b.w,h:b.h,rectRadius:0.5,rotate:24,
          fill:Object.assign({color:b.c},b.tr?{transparency:b.tr}:{}) }));
    }
    // in split mode, the text and the rule stop before the right panel
    const tw = cs==="split" ? 8.9 : null;
    const titW = cs==="split" ? 8.9 : 10.1;
    s.addText((o.eyebrow||"").toUpperCase(),{x:T.M,y:1.95,w:titW,h:0.35,fontFace:T.fMono,fontSize:12,color:T.accentInk,bold:true,charSpacing:3,margin:0});
    s.addText(o.title,{x:T.M-0.03,y:2.35,w:titW,h:1.75,fontFace:T.fDisp,fontSize:40,color:T.ink,bold:true,margin:0,valign:"top",lineSpacingMultiple:1.02});
    s.addShape(R.RECTANGLE,{x:T.M,y:4.25,w:2.0,h:0.05,fill:{color:T.accent}});
    if(o.governing) s.addText(o.governing,{x:T.M,y:4.5,w:cs==="split"?8.9:9.8,h:1.1,fontFace:T.fBody,fontSize:15,color:T.gray,margin:0,lineSpacingMultiple:1.25,valign:"top"});
    s.addShape(R.LINE,{x:T.M,y:5.95,w:tw?tw+0.4:12.2,h:0,line:{color:T.rule,width:1}});
    if(o.metaA) s.addText(o.metaA,{x:T.M,y:6.12,w:tw?4.3:5.6,h:0.3,fontFace:T.fBody,fontSize:13,color:T.ink,bold:true,margin:0});
    if(o.metaB) s.addText(o.metaB,{x:T.M,y:6.44,w:tw?4.3:5.6,h:0.3,fontFace:T.fBody,fontSize:12,color:T.gray,margin:0});
    if(o.metaC) s.addText(o.metaC,{x:tw?5.3:6.6,y:6.12,w:tw?4.0:5.6,h:0.3,fontFace:T.fBody,fontSize:13,color:T.ink,bold:true,margin:0});
    if(o.metaD) s.addText(o.metaD,{x:tw?5.3:6.6,y:6.44,w:tw?4.0:5.6,h:0.3,fontFace:T.fBody,fontSize:12,color:T.gray,margin:0});
    if(o.source) s.addText(o.source,{x:T.M,y:7.02,w:11.6,h:0.3,fontFace:T.fBody,fontSize:8,color:T.gray2,margin:0});
  }
  function dividerDark(s, o){ // o:{bgPath,part,title,caption}
    darkBase(s,o.bgPath);
    if(o.part) s.addText(o.part.toUpperCase(),{x:0.85,y:2.7,w:6,h:0.4,fontFace:T.fMono,fontSize:13,color:T.accentOnDark,bold:true,charSpacing:3,margin:0});
    s.addText(o.title,{x:0.82,y:3.15,w:11.6,h:1.2,fontFace:T.fDisp,fontSize:36,color:T.don,bold:true,margin:0,lineSpacingMultiple:1.0});
    s.addShape(R.RECTANGLE,{x:0.85,y:4.4,w:2.0,h:0.05,fill:{color:T.accentOnDark}});
    if(o.caption) s.addText(o.caption,{x:0.85,y:4.65,w:10.5,h:1.0,fontFace:T.fBody,fontSize:15,color:T.dmute,margin:0,lineSpacingMultiple:1.2});
  }
  function darkHeader(s, bgPath, eyebrow, title){ // for agenda / structured visual page
    darkBase(s,bgPath);
    s.addText((eyebrow||"").toUpperCase(),{x:T.M,y:0.34,w:11,h:0.28,fontFace:T.fMono,fontSize:10.5,color:T.accentOnDark,bold:true,charSpacing:2,margin:0});
    s.addText(title,{x:T.M,y:0.64,w:12.2,h:0.9,fontFace:T.fDisp,fontSize:21,color:T.don,bold:true,margin:0,valign:"top",lineSpacingMultiple:1.02});
    s.addShape(R.RECTANGLE,{x:T.M,y:1.57,w:12.2,h:0.028,fill:{color:T.accentOnDark}});
  }

  return { THEME:T, frameLight, implication, band, dots, metricStrip, rag, heatmap, pullQuote, calloutBox, chevrons,
           waterfall, matrix2x2, progressBar, stars, funnel, gantt, iconColumns, formula, layers, cycle, issueTree, source, pageNum, proofTitle, proofs, prose, flatCardLight,
           chartLight, th, tk, tv, darkBase, eyebrowDark, coverDark, dividerDark, darkHeader,
           zone, cols, rows, pad, exhibitHeader, cagrArrow, chartCallout, tracker, harvey, footnotes, md,
           cardShadow, cardShape, coverLight, bgDeco, darken, lighten, grad, badge,
           doughnutChart, radarChart, comboBarLine, scatterMap,
           slopeChart, dumbbellChart, bulletChart, waffleChart, mekkoChart, vennDiagram };
};
