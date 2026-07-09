// Sprint OS — Complete slide templates (guaranteed geometry). CommonJS.
// Structures reverse-engineered from consulting template packs (McKinsey/L.E.K./Accenture-style),
// styled with Sprint OS tokens (THEME from deck_helpers). Each function lays out the ENTIRE slide:
// header (frameLight) + body on the grid + kicker/source. The AI supplies content, never coordinates.
//
// Usage:
//   const kit = require('./assets/deck_helpers.js')(pres, {accent:'76B900'});
//   const tpl = require('./assets/slide_templates.js')(pres, kit);
//   tpl.execSummary3(pres.addSlide(), {eyebrow:'SUMMARY', title:'…', messages:[{n:'01',head:'…',body:'…',implication:['…','…']}…], bottomLine:'…', source:'…', page:3});

module.exports = function templates(pres, kit) {
  const T = kit.THEME, R = pres.shapes;

  // -- internal building blocks --------------------------------------------------------
  // card: soft corners + drop shadow via kit.cardShape (T.radius / T.cardShadow);
  // the top tick is inset by T.radius so it does not overflow the rounded corners.
  function cardBox(s, z, opts){ opts=opts||{};
    // Dark card: solid accentInk fill (fallback) + SMOOTH native gradient marker, slightly
    // lightened at the top -> darkened at the bottom (post-processed by effects.py), unless T.gradients===false.
    // NO veil stacked on top: veils created visible banding at render time (rejected).
    const gradName = (opts.dark && T.gradients!==false)
      ? kit.grad([kit.lighten(T.accentInk,0.10), kit.darken(T.accentInk,0.28)], 90) : undefined;
    kit.cardShape(s, z.x, z.y, z.w, z.h,
      {fill:{color:opts.dark?T.accentInk:(opts.tint?T.band:T.bg)}, line:{color:T.rule,width:opts.dark?0:1}, objectName:gradName});
    // barColor (semantic, e.g. RAG columns) -> rounded tick at top-left, never a full bar
    // whose width gets clipped by the rounded corners. Never on a dark card (interferes with the gradient).
    if(opts.barColor && !opts.dark) s.addShape(R.ROUNDED_RECTANGLE,{x:z.x+0.16,y:z.y+0.12,w:0.55,h:0.07,rectRadius:0.035,fill:{color:opts.barColor}}); }
  function numChip(s, x, y, n, opts){ opts=opts||{}; const d=opts.d||0.34;
    s.addShape(R.ROUNDED_RECTANGLE,{x,y,w:d,h:d,rectRadius:0.05,fill:{color:opts.light?T.band:T.accentInk}});
    s.addText(String(n),{x,y,w:d,h:d,align:"center",valign:"middle",fontFace:T.fDisp,
      fontSize:opts.size||12,bold:true,color:opts.light?T.accentInk:"FFFFFF",margin:0}); }
  function blockTitle(s, x, y, w, txt, opts){ opts=opts||{};
    s.addText(txt,{x,y,w,h:0.3,fontFace:T.fDisp,fontSize:14,bold:true,color:opts.color||T.ink,margin:0,valign:"middle"}); }
  function bodyText(s, x, y, w, h, txt){ // 12pt body (string or bullet array); **bold** supported
    if(Array.isArray(txt)) kit.proofs(s, txt, x, y, w, h, 12);
    else s.addText(kit.md(txt),{x,y,w,h,fontFace:T.fBody,fontSize:12,color:T.ink,margin:0,lineSpacingMultiple:1.2,valign:"top"}); }
  function chrome(s, o){ kit.frameLight(s, o.eyebrow, o.title, o.message);
    if(o.tracker) kit.tracker(s, o.tracker.sections, o.tracker.active);
    if(o.bottomLine) kit.band(s, o.bandLabel||"Key takeaway", o.bottomLine);
    if(o.footnotes) kit.footnotes(s, o.footnotes);
    kit.source(s, o.source, o.page); }
  const zTop = (o)=> o.message?2.1:1.9;
  const zopts = (o, extra)=> Object.assign({top:zTop(o), noKicker:!o.bottomLine && !o.footnotes}, extra||{});

  // -- 1. EXEC SUMMARY "3 messages" (McKinsey #01) -----------------------------
  // o.messages = [{n,head,body,implication:[..],icon?:pngPath}] (2 to 4); o.bottomLine required.
  // icon (optional, via assets/icon.cjs) replaces the numbered chip.
  function execSummary3(s, o){ chrome(s, o);
    const zs = kit.cols(o.messages.map(()=>1), zopts(o));
    o.messages.forEach((m,i)=>{ const z=zs[i]; cardBox(s, z, {tint:false});
      const p=kit.pad(z, 0.18);
      if(m.icon) s.addImage({path:m.icon, x:p.x, y:p.y+0.02, w:0.34, h:0.34});
      else numChip(s, p.x, p.y+0.02, m.n||("0"+(i+1)), {light:true});
      s.addText(m.head,{x:p.x+0.48,y:p.y,w:p.w-0.48,h:0.56,fontFace:T.fDisp,fontSize:14,bold:true,color:T.ink,margin:0,valign:"top",lineSpacingMultiple:1.0});
      bodyText(s, p.x, p.y+0.68, p.w, 1.2, m.body);
      s.addShape(R.LINE,{x:p.x,y:p.y+1.98,w:p.w,h:0,line:{color:T.rule,width:0.5}});
      s.addText("Implication",{x:p.x,y:p.y+2.08,w:p.w,h:0.26,fontFace:T.fBody,fontSize:11,bold:true,color:T.accentInk,margin:0});
      bodyText(s, p.x, p.y+2.4, p.w, z.h-2.76, m.implication); }); }

  // -- 2. QUADRANT MEMO (L.E.K. #18/#26) — THE structured written page -----------
  // o.sections = 4 {head, body}; o.summary optional = left panel {head, body}.
  function memoQuadrants(s, o){ chrome(s, o);
    let grid;
    if(o.summary){ const [side, main] = kit.cols([1,2.6], zopts(o));
      cardBox(s, side, {tint:true}); const sp=kit.pad(side,0.2);
      blockTitle(s, sp.x, sp.y, sp.w, o.summary.head, {color:T.accentInk});
      bodyText(s, sp.x, sp.y+0.42, sp.w, side.h-0.8, o.summary.body);
      const rowsz = kit.rows(main, [1,1], 0.35); grid=[...kit.cols([1,1],{zone:rowsz[0],gap:0.45}), ...kit.cols([1,1],{zone:rowsz[1],gap:0.45})]; }
    else { const rowsz = kit.rows(kit.zone(zopts(o)), [1,1], 0.35);
      grid=[...kit.cols([1,1],{zone:rowsz[0],gap:0.45}), ...kit.cols([1,1],{zone:rowsz[1],gap:0.45})]; }
    o.sections.forEach((sec,i)=>{ const z=grid[i];
      s.addText(sec.head,{x:z.x,y:z.y,w:z.w,h:0.28,fontFace:T.fDisp,fontSize:14,bold:true,color:T.accentInk,margin:0});
      s.addShape(R.RECTANGLE,{x:z.x,y:z.y+0.32,w:0.5,h:0.03,fill:{color:T.accent}});
      bodyText(s, z.x, z.y+0.45, z.w, z.h-0.45, sec.body); }); }

  // -- 3. SIDE INDEX + NARRATIVE BODY (L.E.K. #12) -----------------------------
  // o.index = [{n,label}] (up to ~11); o.body = prose paras (see kit.prose); o.bodyHead.
  function sideIndex(s, o){ chrome(s, o);
    const [side, main] = kit.cols([1,2.7], zopts(o));
    cardBox(s, side, {tint:true}); const sp=kit.pad(side,0.18);
    o.index.forEach((it,i)=>{ const iy=sp.y+i*(sp.h/o.index.length);
      s.addText([{text:String(it.n).padStart(2,"0")+"  ",options:{bold:true,color:T.accentInk}},
                 {text:it.label,options:{color:it.active?T.ink:T.gray}}],
        {x:sp.x,y:iy,w:sp.w,h:0.3,fontFace:T.fBody,fontSize:10.5,margin:0,valign:"middle"}); });
    if(o.bodyHead) blockTitle(s, main.x, main.y, main.w, o.bodyHead, {color:T.accentInk});
    kit.prose(s, o.body, main.x, main.y+(o.bodyHead?0.45:0), main.w, main.h-(o.bodyHead?0.45:0), {size:12.5}); }

  // -- 4. KEY MESSAGES + SO WHAT (L.E.K. #27) ------------------------------------
  // o.items = [{head, sub, icon?:pngPath}] (3-5); o.soWhat = {head?, body};
  // o.panelStyle: "soft" (default: tinted + accent bar) | "dark" (large anthracite panel).
  function keyMessagesSoWhat(s, o){ chrome(s, o);
    const [left, right] = kit.cols([1.7,1], zopts(o));
    const rowsz = kit.rows(left, o.items.map(()=>1), 0.18);
    o.items.forEach((it,i)=>{ const z=rowsz[i]; cardBox(s, z, {tint:o.highlight===i});
      if(it.icon) s.addImage({path:it.icon, x:z.x+0.14, y:z.y+z.h/2-0.17, w:0.34, h:0.34});
      else numChip(s, z.x+0.14, z.y+z.h/2-0.17, "0"+(i+1));
      s.addText([{text:it.head,options:{bold:true,breakLine:true}}].concat(kit.md(it.sub||"",{color:T.gray,fontSize:11})),
        {x:z.x+0.62,y:z.y+0.08,w:z.w-0.78,h:z.h-0.16,fontFace:T.fBody,fontSize:12.5,color:T.ink,margin:0,lineSpacingMultiple:1.08,valign:"middle"}); });
    const darkP = o.panelStyle==="dark";
    cardBox(s, right, {dark:darkP, tint:!darkP});
    if(!darkP) s.addShape(R.ROUNDED_RECTANGLE,{x:right.x,y:right.y+T.radius,w:0.08,h:right.h-2*T.radius,rectRadius:0.04,fill:{color:T.accent}});
    const rp=kit.pad(right,0.22), pfg=darkP?"FFFFFF":T.accentInk, pbody=darkP?"FFFFFF":T.ink;
    s.addText(o.soWhat.head||"So what?",{x:rp.x+(darkP?0:0.06),y:rp.y,w:rp.w-0.06,h:0.32,fontFace:T.fDisp,fontSize:15,bold:true,color:pfg,margin:0});
    s.addText(kit.md(o.soWhat.body,{color:pbody}),{x:rp.x+(darkP?0:0.06),y:rp.y+0.45,w:rp.w-0.06,h:rp.h-0.5,fontFace:T.fBody,fontSize:12,color:pbody,margin:0,lineSpacingMultiple:1.25,valign:"top"}); }

  // -- 5. DECISION NOTE (L.E.K. #20) -------------------------------------------
  // o.need={head?,body}; o.options=[{name,points:[..]}] (2-3); o.reco={head?,body}.
  function decisionNote(s, o){ chrome(s, o);
    const z = kit.zone(zopts(o)); const rowsz = kit.rows(z, [2.4,1], 0.3);
    const zs = kit.cols([1, ...o.options.map(()=>1)], {zone:rowsz[0]});
    cardBox(s, zs[0], {tint:true}); const np=kit.pad(zs[0],0.18);
    blockTitle(s, np.x, np.y, np.w, (o.need.head||"Decision required"), {color:T.accentInk});
    bodyText(s, np.x, np.y+0.42, np.w, zs[0].h-0.7, o.need.body);
    o.options.forEach((op,i)=>{ const oz=zs[i+1]; cardBox(s, oz); const op_=kit.pad(oz,0.18);
      numChip(s, op_.x, op_.y+0.02, String.fromCharCode(65+i));
      blockTitle(s, op_.x+0.48, op_.y+0.04, op_.w-0.48, op.name);
      bodyText(s, op_.x, op_.y+0.55, op_.w, oz.h-0.8, op.points); });
    const rz=rowsz[1]; cardBox(s, rz, {dark:true});
    s.addText([{text:(o.reco.head||"Recommendation")+": ",options:{bold:true,color:T.accentOnDark}},
               {text:o.reco.body,options:{color:"FFFFFF"}}],
      {x:rz.x+0.25,y:rz.y,w:rz.w-0.5,h:rz.h,fontFace:T.fBody,fontSize:12.5,margin:0,valign:"middle",lineSpacingMultiple:1.15}); }

  // -- 6. ZEBRA REGISTER TABLE (L.E.K. #21: risks, requirements, backlog…) --------
  // o.headers=[..]; o.rows=[[..]]; o.widths=[..] (weights); o.keyCol optional (highlighted index).
  function registerTable(s, o){ chrome(s, o);
    const z = kit.zone(zopts(o));
    if(o.exhibit) kit.exhibitHeader(s, o.exhibit, z.x, z.y-0.02, z.w);
    const top = o.exhibit? z.y+0.3 : z.y;
    const header = o.headers.map(h=>kit.th(h));
    const rows = o.rows.map((r,ri)=>r.map((c,ci)=>({text:String(c),options:{
      color:ci===o.keyCol?T.accentInk:T.ink, bold:ci===o.keyCol, fontFace:ci===o.keyCol?T.fMono:T.fBody,
      fontSize:11, align:(typeof c==="number"||(/\d/.test(String(c))&&/^[\d\s.,%+\-€$Mdskpts]+$/.test(String(c))))?"right":"left",
      valign:"middle", fill:{color:ri%2?T.band:T.bg}}})));
    const tot=(o.widths||o.headers.map(()=>1)).reduce((a,b)=>a+b,0);
    const rh=Math.max(0.34, Math.min(0.85, (z.h-(o.exhibit?0.3:0))/(o.rows.length+1)));
    s.addTable([header,...rows],{x:z.x,y:top,w:z.w,colW:(o.widths||o.headers.map(()=>1)).map(w=>z.w*w/tot),
      border:{type:"solid",pt:0.5,color:T.rule}, rowH:rh, margin:0.06, valign:"middle"}); }

  // -- 7. NARRATIVE BLOCK TIMELINE (L.E.K. #23) ----------------------------------
  // o.phases = [{label, milestone?, body}] (4-6).
  function timelineBlocks(s, o){ chrome(s, o);
    const z = kit.zone(zopts(o)); const n=o.phases.length, ly=z.y+0.55;
    s.addShape(R.LINE,{x:z.x+0.2,y:ly,w:z.w-0.4,h:0,line:{color:T.accent,width:2}});
    const zs = kit.cols(o.phases.map(()=>1), {zone:z, gap:0.25});
    o.phases.forEach((p,i)=>{ const cz=zs[i], cx=cz.x+cz.w/2;
      s.addText(p.label,{x:cz.x,y:z.y,w:cz.w,h:0.3,align:"center",fontFace:T.fDisp,fontSize:12.5,bold:true,color:T.ink,margin:0});
      s.addShape(R.OVAL,{x:cx-0.09,y:ly-0.09,w:0.18,h:0.18,fill:{color:T.accent},line:{color:"FFFFFF",width:1.5}});
      const bz={x:cz.x,y:ly+0.3,w:cz.w,h:z.h-(ly-z.y)-0.65}; cardBox(s,bz,{tint:o.highlight===i});
      bodyText(s, bz.x+0.15, bz.y+0.15, bz.w-0.3, bz.h-0.3, p.body);
      if(p.milestone) s.addText(p.milestone,{x:cz.x,y:bz.y+bz.h+0.06,w:cz.w,h:0.24,align:"center",fontFace:T.fMono,fontSize:9.5,bold:true,color:T.accentInk,margin:0}); }); }

  // -- 8. ASSERTION + PROOFS (L.E.K. #19, light pyramid #24) ---------------------
  // o.claim = strong sentence; o.proofs = [{head, body}] (3-5); o.proofLabel = label for the items
  // (default "Proof"; use "Axis", "Lever", "Pillar"… to match the content, never a literal copy).
  function insightProof(s, o){ chrome(s, o);
    const [left, right] = kit.cols([1,1.6], zopts(o));
    const darkP = o.panelStyle==="dark";
    cardBox(s, left, {dark:darkP, tint:!darkP});
    if(!darkP) s.addShape(R.ROUNDED_RECTANGLE,{x:left.x,y:left.y+T.radius,w:0.08,h:left.h-2*T.radius,rectRadius:0.04,fill:{color:T.accent}});
    const lp=kit.pad(left,0.28);
    s.addText(o.claim,{x:lp.x+(darkP?0:0.06),y:lp.y,w:lp.w-0.06,h:lp.h,fontFace:T.fDisp,fontSize:19,bold:true,color:darkP?"FFFFFF":T.accentInk,margin:0,valign:"middle",lineSpacingMultiple:1.2});
    const rz = kit.rows(right, o.proofs.map(()=>1), 0.2);
    o.proofs.forEach((pr,i)=>{ const z=rz[i]; cardBox(s, z, {tint:o.highlight===i});
      s.addText([{text:(o.proofLabel||"Proof")+" "+(i+1)+": ",options:{bold:true,color:T.accentInk}},{text:pr.head,options:{bold:true,breakLine:true}},
                 {text:pr.body,options:{color:T.gray,fontSize:11}}],
        {x:z.x+0.18,y:z.y+0.08,w:z.w-0.36,h:z.h-0.16,fontFace:T.fBody,fontSize:12,color:T.ink,margin:0,lineSpacingMultiple:1.1,valign:"middle"}); }); }

  // -- 9. N CARD COLUMNS (L.E.K. #04/#05/#29; generic) ------------------------
  // o.cards = [{head, body(string|[bullets])}] (2-4); o.highlight = emphasized index (semantic).
  // RULE: parallel items = identical styling; never decorative alternation (false signal).
  function nColCards(s, o){ chrome(s, o);
    const zs = kit.cols(o.cards.map(()=>1), zopts(o));
    o.cards.forEach((c,i)=>{ const z=zs[i]; cardBox(s, z, {tint:o.highlight===i});
      const p=kit.pad(z,0.18);
      blockTitle(s, p.x, p.y, p.w, c.head, {color:T.accentInk});
      bodyText(s, p.x, p.y+0.45, p.w, p.h-0.45, c.body); }); }

  // -- 10. EXHIBIT + INSIGHTS (the canonical MBB layout: chart 2/3, reading 1/3) ----
  // o.exhibit = {header, draw(slide, zone)} — draw receives the slide and the zone, and renders the
  // chart (slide.addChart + kit.chartLight()) or the table; o.insights = [bullets].
  function exhibitInsights(s, o){ chrome(s, o);
    const [left, right] = kit.cols([2,1], zopts(o));
    if(o.exhibit.header) kit.exhibitHeader(s, o.exhibit.header, left.x, left.y-0.02, left.w);
    o.exhibit.draw(s, {x:left.x, y:left.y+0.32, w:left.w, h:left.h-0.4});
    kit.proofTitle(s, right.x, right.y, right.w);
    kit.proofs(s, o.insights, right.x, right.y+0.35, right.w, right.h-0.35, 12); }

  // -- 11. RECO ONE-PAGER (McKinsey #02; closing slide of a strategy deck) ----
  // o.reco={text, by?, date?}; o.why={head?, points[]}; o.actions=[{tag,head,sub?}].
  function recoOnePager(s, o){ chrome(s, o);
    const [left, right] = kit.cols([1,1.9], zopts(o));
    cardBox(s, left, {dark:true}); const lp=kit.pad(left,0.25);
    s.addText("RECOMMENDATION",{x:lp.x,y:lp.y,w:lp.w,h:0.28,fontFace:T.fMono,fontSize:10,bold:true,charSpacing:2,color:T.accentOnDark,margin:0});
    s.addText(o.reco.text,{x:lp.x,y:lp.y+0.4,w:lp.w,h:lp.h-1.3,fontFace:T.fDisp,fontSize:16,bold:true,color:"FFFFFF",margin:0,lineSpacingMultiple:1.25,valign:"top"});
    if(o.reco.date){ s.addText(o.reco.by||"Decision expected by",{x:lp.x,y:lp.y+lp.h-0.72,w:lp.w,h:0.24,fontFace:T.fBody,fontSize:9.5,color:"C9D2DA",margin:0});
      s.addText(o.reco.date,{x:lp.x,y:lp.y+lp.h-0.46,w:lp.w,h:0.4,fontFace:T.fDisp,fontSize:17,bold:true,color:"FFFFFF",margin:0}); }
    const rz = kit.rows(right, [1.25,1], 0.3);
    cardBox(s, rz[0]); const wp=kit.pad(rz[0],0.18);
    blockTitle(s, wp.x, wp.y, wp.w, o.why.head||"Why this is the right option", {color:T.accentInk});
    bodyText(s, wp.x, wp.y+0.42, wp.w, wp.h-0.56, o.why.points);
    cardBox(s, rz[1], {tint:true}); const ap=kit.pad(rz[1],0.16);
    blockTitle(s, ap.x, ap.y, ap.w, "Actions required from leadership", {color:T.accentInk});
    const arz = kit.rows({x:ap.x,y:ap.y+0.38,w:ap.w,h:ap.h-0.38}, o.actions.map(()=>1), 0.08);
    o.actions.forEach((a,i)=>{ const z=arz[i];
      s.addShape(R.ROUNDED_RECTANGLE,{x:z.x,y:z.y+z.h/2-0.14,w:0.5,h:0.28,fill:{color:T.accentInk},rectRadius:0.14});
      s.addText(a.tag||("D"+(i+1)),{x:z.x,y:z.y+z.h/2-0.14,w:0.5,h:0.28,align:"center",valign:"middle",fontFace:T.fMono,fontSize:10,bold:true,color:"FFFFFF",margin:0});
      s.addText([{text:a.head,options:{bold:true}},{text:a.sub?("  "+a.sub):"",options:{color:T.gray,fontSize:10.5}}],
        {x:z.x+0.62,y:z.y,w:z.w-0.62,h:z.h,fontFace:T.fBody,fontSize:11.5,color:T.ink,margin:0,valign:"middle",lineSpacingMultiple:1.0}); }); }

  // -- 12. MECE BUCKETS (McKinsey #05/#25: N columns with dark header + bullets) -------
  // o.buckets=[{head, sub?, points[]}] (3-5).
  function buckets(s, o){ chrome(s, o);
    const zs = kit.cols(o.buckets.map(()=>1), zopts(o,{gap:0.22}));
    o.buckets.forEach((b,i)=>{ const z=zs[i], hh=b.sub?0.62:0.44;
      s.addShape(R.RECTANGLE,{x:z.x,y:z.y,w:z.w,h:hh,fill:{color:T.accentInk}});
      s.addText([{text:b.head,options:{bold:true,breakLine:!!b.sub}},{text:b.sub||"",options:{fontSize:9.5,color:"C9D2DA"}}],
        {x:z.x+0.12,y:z.y,w:z.w-0.24,h:hh,fontFace:T.fDisp,fontSize:12.5,color:"FFFFFF",margin:0,valign:"middle",lineSpacingMultiple:1.0});
      s.addShape(R.RECTANGLE,{x:z.x,y:z.y+hh,w:z.w,h:z.h-hh,fill:{color:o.highlight===i?T.band:T.bg},line:{color:T.rule,width:0.75}});
      kit.proofs(s, b.points, z.x+0.15, z.y+hh+0.15, z.w-0.3, z.h-hh-0.3, 11); }); }

  // -- 13. SCENARIO / GRADED OPTION CARDS (McKinsey #22, highlighted hero) -----
  // o.scenarios=[{name, tag?, metrics:[[label,val]], notes?}] (2-4); o.hero=index (default: last).
  function scenarioCards(s, o){ chrome(s, o);
    // SEMANTIC emphasis only: no colored card unless o.hero is explicitly passed.
    const hero = o.hero!=null?o.hero:-1;
    const zs = kit.cols(o.scenarios.map(()=>1), zopts(o));
    o.scenarios.forEach((sc,i)=>{ const z=zs[i], dark=i===hero;
      cardBox(s, z, {dark, tint:!dark&&o.highlight===i});
      // small "sticker" pinned on the hero card's top-right corner, naming WHY it is highlighted.
      // o.heroTag (e.g. "Recommended") — pass it in the deck's language; heroTag:false disables.
      if(dark && o.heroTag!==false) kit.badge(s, z.x+z.w-0.16, z.y+0.16, o.heroTag||"Recommended", {align:"right"});
      const p=kit.pad(z,0.2), fg=dark?"FFFFFF":T.ink, mut=dark?"DEE4E9":T.gray;
      s.addText(sc.name,{x:p.x,y:p.y,w:p.w,h:0.34,fontFace:T.fDisp,fontSize:15,bold:true,color:fg,margin:0});
      if(sc.tag) s.addText(sc.tag,{x:p.x,y:p.y+0.36,w:p.w,h:0.26,fontFace:T.fBody,fontSize:11,bold:true,color:dark?T.accentOnDark:T.accentInk,margin:0});
      let my=p.y+0.75;
      (sc.metrics||[]).forEach(m=>{ s.addText(m[0],{x:p.x,y:my,w:p.w*0.55,h:0.26,fontFace:T.fBody,fontSize:10.5,color:mut,margin:0,valign:"middle"});
        s.addText(String(m[1]),{x:p.x+p.w*0.55,y:my,w:p.w*0.45,h:0.26,align:"right",fontFace:T.fMono,fontSize:11,bold:true,color:fg,margin:0,valign:"middle"});
        my+=0.3; });
      if(sc.notes){ s.addShape(R.LINE,{x:p.x,y:my+0.06,w:p.w,h:0,line:{color:dark?"4A555F":T.rule,width:0.5}});
        s.addText(sc.notes,{x:p.x,y:my+0.14,w:p.w,h:z.h-(my-z.y)-0.3,fontFace:T.fBody,fontSize:10,color:mut,margin:0,lineSpacingMultiple:1.1,valign:"top"}); } }); }

  // -- 14. STEERING COMMITTEE (McKinsey #30: statuses + 3 semantic columns) -------
  // o.statuses=[{label,status:'green'|'amber'|'red',text}] (3-4);
  // o.progress=[..]; o.decisions=[..]; o.risks=[..] (bullets).
  function steeringCommittee(s, o){ chrome(s, o);
    const GREEN="2E7D32", RED="C62828";
    const z = kit.zone(zopts(o)); const rowsz = kit.rows(z, [1,2.6], 0.28);
    const st = kit.cols(o.statuses.map(()=>1), {zone:rowsz[0], gap:0.22});
    o.statuses.forEach((k,i)=>{ const kz=st[i]; cardBox(s, kz, {tint:true});
      s.addText(k.label,{x:kz.x+0.14,y:kz.y+0.08,w:kz.w-0.28,h:0.24,fontFace:T.fBody,fontSize:9.5,color:T.gray,margin:0});
      kit.rag(s, kz.x+0.14, kz.y+0.42, k.status, k.text, {bold:true, size:11.5, w:kz.w-0.5}); });
    const colsz = kit.cols([1,1,1], {zone:rowsz[1], gap:0.25});
    [{h:"Progress this period",c:GREEN,items:o.progress},
     {h:"Decisions required",c:T.accentInk,items:o.decisions},
     {h:"Key risks",c:RED,items:o.risks}].forEach((col,i)=>{ const cz=colsz[i];
      cardBox(s, cz, {barColor:col.c}); const p=kit.pad(cz,0.16);
      s.addText(col.h,{x:p.x,y:p.y+0.04,w:p.w,h:0.28,fontFace:T.fDisp,fontSize:13,bold:true,color:col.c,margin:0});
      s.addText(col.items.map(t=>({text:t,options:{bullet:{code:"2022",indent:11},breakLine:true,color:T.ink}})),
        {x:p.x,y:p.y+0.42,w:p.w,h:p.h-0.42,fontFace:T.fBody,fontSize:11,align:"left",margin:0,paraSpaceAfter:7,lineSpacingMultiple:1.1,valign:"top"}); }); }

  // -- 15. STACKED BANDS (unbranded #1: message + numeric proofs per band) -----
  // o.bands=[{head, body, kpis?:[[val,label]] (0-2), icon?:pngPath}] (3-4).
  function stackedBands(s, o){ chrome(s, o);
    const rowsz = kit.rows(kit.zone(zopts(o)), o.bands.map(()=>1), 0.22);
    o.bands.forEach((b,i)=>{ const z=rowsz[i]; cardBox(s, z, {tint:o.highlight===i});
      const kw=(b.kpis&&b.kpis.length)? b.kpis.length*1.35+0.2 : 0;
      if(b.icon) s.addImage({path:b.icon, x:z.x+0.16, y:z.y+z.h/2-0.19, w:0.38, h:0.38});
      else { s.addShape(R.OVAL,{x:z.x+0.16,y:z.y+z.h/2-0.19,w:0.38,h:0.38,fill:{color:T.accentInk}});
      s.addText("0"+(i+1),{x:z.x+0.16,y:z.y+z.h/2-0.19,w:0.38,h:0.38,align:"center",valign:"middle",fontFace:T.fDisp,fontSize:11,bold:true,color:"FFFFFF",margin:0}); }
      s.addText([{text:b.head,options:{bold:true,breakLine:true}}].concat(kit.md(b.body,{color:T.gray,fontSize:11})),
        {x:z.x+0.72,y:z.y+0.1,w:z.w-0.9-kw,h:z.h-0.2,fontFace:T.fBody,fontSize:12.5,color:T.ink,margin:0,lineSpacingMultiple:1.12,valign:"middle"});
      (b.kpis||[]).forEach((k,j)=>{ const kx=z.x+z.w-kw+j*1.35+0.1;
        s.addShape(R.RECTANGLE,{x:kx,y:z.y+z.h/2-0.42,w:1.22,h:0.84,fill:{color:T.bg},line:{color:T.rule,width:0.75}});
        s.addText(String(k[0]),{x:kx,y:z.y+z.h/2-0.38,w:1.22,h:0.42,align:"center",fontFace:T.fDisp,fontSize:16,bold:true,color:T.accentInk,margin:0});
        s.addText(k[1],{x:kx,y:z.y+z.h/2+0.04,w:1.22,h:0.32,align:"center",fontFace:T.fBody,fontSize:8.5,color:T.gray,margin:0,lineSpacingMultiple:0.9}); }); }); }

  // -- 16. DECISION COCKPIT (Accenture #15: D1-Dn cards with an imposed structure) -----
  // o.decisions=[{tag?, area, context, reco, ifNot}] (3-4).
  function decisionCockpit(s, o){ chrome(s, o);
    const zs = kit.cols(o.decisions.map(()=>1), zopts(o,{gap:0.22}));
    o.decisions.forEach((d,i)=>{ const z=zs[i]; cardBox(s, z); const p=kit.pad(z,0.16);
      s.addShape(R.ROUNDED_RECTANGLE,{x:p.x,y:p.y,w:0.5,h:0.26,fill:{color:T.accentInk},rectRadius:0.13});
      s.addText(d.tag||("D"+(i+1)),{x:p.x,y:p.y,w:0.5,h:0.26,align:"center",valign:"middle",fontFace:T.fMono,fontSize:9.5,bold:true,color:"FFFFFF",margin:0});
      s.addText(d.area,{x:p.x+0.62,y:p.y-0.02,w:p.w-0.62,h:0.54,fontFace:T.fDisp,fontSize:12.5,bold:true,color:T.ink,margin:0,valign:"top",lineSpacingMultiple:1.0});
      const b = kit.rows({x:p.x,y:p.y+0.62,w:p.w,h:p.h-0.62},[1.1,1,1],0.12);
      s.addText(d.context,{x:b[0].x,y:b[0].y,w:b[0].w,h:b[0].h,fontFace:T.fBody,fontSize:10.5,color:T.ink,margin:0,lineSpacingMultiple:1.1,valign:"top"});
      s.addText([{text:"Recommendation: ",options:{bold:true,color:T.accentInk}},{text:d.reco,options:{color:T.ink}}],
        {x:b[1].x,y:b[1].y,w:b[1].w,h:b[1].h,fontFace:T.fBody,fontSize:10.5,margin:0,lineSpacingMultiple:1.1,valign:"top"});
      s.addText([{text:"If no decision: ",options:{bold:true,color:T.gray}},{text:d.ifNot,options:{color:T.gray}}],
        {x:b[2].x,y:b[2].y,w:b[2].w,h:b[2].h,fontFace:T.fBody,fontSize:10.5,margin:0,lineSpacingMultiple:1.1,valign:"top"}); }); }

  // -- 17. PHASED ROADMAP (McKinsey #11/#26, Accenture #30: waves + milestones) ------
  // o.phases=[{name, span?, items:[{head, sub?}]}] (3-4).
  function phasesRoadmap(s, o){ chrome(s, o);
    const zs = kit.cols(o.phases.map(()=>1), zopts(o,{gap:0.22}));
    o.phases.forEach((ph,i)=>{ const z=zs[i], hh=0.6;
      s.addShape(R.RECTANGLE,{x:z.x,y:z.y,w:z.w,h:hh,fill:{color:kit.lighten(T.accent, Math.min(i*0.15,0.32))}});
      s.addText([{text:ph.name,options:{bold:true,breakLine:!!ph.span}},{text:ph.span||"",options:{fontSize:9.5}}],
        {x:z.x+0.14,y:z.y,w:z.w-0.28,h:hh,fontFace:T.fDisp,fontSize:12.5,color:"FFFFFF",margin:0,valign:"middle",lineSpacingMultiple:1.0});
      const rowsz = kit.rows({x:z.x,y:z.y+hh+0.14,w:z.w,h:z.h-hh-0.14}, ph.items.map(()=>1), 0.12);
      ph.items.forEach((it,j)=>{ const iz=rowsz[j];
        s.addShape(R.RECTANGLE,{x:iz.x,y:iz.y,w:iz.w,h:iz.h,fill:{color:T.bg},line:{color:T.rule,width:0.75}});
        s.addText([{text:it.head,options:{bold:true,breakLine:!!it.sub}},{text:it.sub||"",options:{color:T.gray,fontSize:9.5}}],
          {x:iz.x+0.12,y:iz.y+0.04,w:iz.w-0.24,h:iz.h-0.08,fontFace:T.fBody,fontSize:11,color:T.ink,margin:0,valign:"middle",lineSpacingMultiple:1.02}); }); }); }

  // -- 18. CANVAS GRID (Accenture #29/#26: one-page canvas, dark focal cell) -------
  // o.cells=[{head, body}]; o.gridCols (default 3); o.focal=optional index.
  function canvasGrid(s, o){ chrome(s, o);
    const gc=o.gridCols||3, n=o.cells.length, gr=Math.ceil(n/gc);
    const rowsz = kit.rows(kit.zone(zopts(o)), Array(gr).fill(1), 0.2);
    o.cells.forEach((c,i)=>{ const r=Math.floor(i/gc), z=kit.cols(Array(Math.min(gc,n-r*gc)).fill(1),{zone:rowsz[r],gap:0.2})[i%gc];
      const focal=i===o.focal; cardBox(s, z, {dark:focal});
      const p=kit.pad(z,0.14);
      s.addText(c.head,{x:p.x,y:p.y,w:p.w,h:0.26,fontFace:T.fDisp,fontSize:12,bold:true,color:focal?"FFFFFF":T.accentInk,margin:0});
      s.addShape(R.RECTANGLE,{x:p.x,y:p.y+0.3,w:0.4,h:0.025,fill:{color:focal?T.accentOnDark:T.accent}});
      s.addText(c.body,{x:p.x,y:p.y+0.4,w:p.w,h:p.h-0.4,fontFace:T.fBody,fontSize:10.5,color:focal?"E2E8ED":T.ink,margin:0,lineSpacingMultiple:1.12,valign:"top"}); }); }

  // -- 19. SWIMLANES MATRIX (Accenture #11: lanes × steps; blueprint, RACI, comms) ---
  // o.steps=["Step 1",…]; o.lanes=[{label, cells:["…",…]}].
  function lanesMatrix(s, o){ chrome(s, o);
    const z = kit.zone(zopts(o));
    const header=[kit.th("",undefined)].concat(o.steps.map(st=>kit.th(st,"center")));
    const rows=o.lanes.map((ln,ri)=>[{text:ln.label,options:{bold:true,color:T.ink,fontFace:T.fBody,fontSize:10.5,align:"left",valign:"middle",fill:{color:T.band}}}]
      .concat(ln.cells.map(c=>({text:c,options:{color:T.ink,fontFace:T.fBody,fontSize:10,align:"left",valign:"top",fill:{color:ri%2?T.band:T.bg}}}))));
    const labW=z.w*0.16, colW=(z.w-labW)/o.steps.length;
    const rh=Math.max(0.4, Math.min(1.1, z.h/(o.lanes.length+1)));
    s.addTable([header,...rows],{x:z.x,y:z.y,w:z.w,colW:[labW,...o.steps.map(()=>colW)],
      border:{type:"solid",pt:0.5,color:T.rule}, rowH:rh, margin:0.06, valign:"middle", autoPage:false}); }

  // -- 20. MOSAIC / BENTO (mixed sizes: 1 hero + 4-7 tiles, rounded corners) ------
  // o.hero={head, body} (major card, band tint); o.tiles=[{head, body, kpi?:[val,label]}] (4-7).
  // "Slide split into 5-8 elements" format; the tiles flow into 2 columns on the right.
  function mosaic(s, o){ chrome(s, o);
    const [heroZ, gridZ] = kit.cols([1,1.75], zopts(o));
    cardBox(s, heroZ, {tint:true}); const hp=kit.pad(heroZ,0.22);
    s.addText(o.hero.head,{x:hp.x,y:hp.y,w:hp.w,h:0.6,fontFace:T.fDisp,fontSize:16,bold:true,color:T.accentInk,margin:0,lineSpacingMultiple:1.05,valign:"top"});
    bodyText(s, hp.x, hp.y+0.7, hp.w, hp.h-0.7, o.hero.body);
    const n=o.tiles.length, rows=Math.ceil(n/2);
    const rz = kit.rows(gridZ, Array(rows).fill(1), 0.2);
    o.tiles.forEach((t,i)=>{ const r=Math.floor(i/2), inRow=Math.min(2, n-r*2);
      const z=kit.cols(Array(inRow).fill(1), {zone:rz[r], gap:0.2})[i%2];
      cardBox(s, z); const p=kit.pad(z,0.14);
      s.addText(t.head,{x:p.x,y:p.y,w:p.w-(t.kpi?1.1:0),h:0.28,fontFace:T.fDisp,fontSize:12.5,bold:true,color:T.ink,margin:0,valign:"middle"});
      if(t.kpi) s.addText(String(t.kpi[0]),{x:p.x+p.w-1.05,y:p.y-0.04,w:1.05,h:0.36,align:"right",fontFace:T.fDisp,fontSize:16,bold:true,color:T.accentInk,margin:0});
      bodyText(s, p.x, p.y+0.36, p.w, p.h-0.36, t.body); }); }

  return { execSummary3, memoQuadrants, sideIndex, keyMessagesSoWhat, decisionNote,
           registerTable, timelineBlocks, insightProof, nColCards, exhibitInsights,
           recoOnePager, buckets, scenarioCards, steeringCommittee, stackedBands,
           decisionCockpit, phasesRoadmap, canvasGrid, lanesMatrix, mosaic };
};
