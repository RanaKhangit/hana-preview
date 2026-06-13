/* ============================================================
   GARDEN ENGINE v2  —  REAL-petal living murmuration.
   Petals are real photographic cut-outs (assets/flowers/...),
   not vector shapes. No random white glow dots. Flowers emerge
   as real bloom images and speak. The bottle is page-optional
   and only appears when the potion composes.
   Public API (window.GARDEN) — unchanged + setBottle():
     init(canvasId, mode)  awaken(id)  composeBlend(ids,weights)
     surge()  formName(text)  clearName()  formShape(name)
     setBottle(bool)  reset()  setMode(m)  onFlowerClick(fn)  flowerPos(id)
   ============================================================ */
window.GARDEN = (function(){
  var A, C, cv, ctx, W, H, DPR, U, cx, cy, t0=null, raf=null, lastTs=null, ds=1;
  var petals=[], flowers=[], streams=[], nameTargets=[], heroPetalImgs=[];
  var bottle={ fill:0, tfill:0, col:[223,200,252], tcol:[223,200,252] }, bottleVisible=false;
  var awakened=[], mode='hero', clickCb=null, surgeClock=0, surgeBoost=0;
  var mouse={ x:-9999, y:-9999 };
  var formation={ active:false, str:0, clock:0, hold:0, idx:0 };
  var bgGrad=null, PC=null, labelCache={};

  function hex(h){ h=h.replace('#',''); if(h.length===3) h=h.split('').map(function(c){return c+c;}).join('');
    return [parseInt(h.substr(0,2),16),parseInt(h.substr(2,2),16),parseInt(h.substr(4,2),16)]; }
  function rgb(a,al){ return 'rgba('+(a[0]|0)+','+(a[1]|0)+','+(a[2]|0)+','+(al==null?1:al)+')'; }
  function lerp3(a,b,s){ for(var i=0;i<3;i++) a[i]+=(b[i]-a[i])*s; }
  function clamp(v,lo,hi){ return v<lo?lo:v>hi?hi:v; }
  function mix(a,b,s){ return a+(b-a)*s; }
  function loadImg(src){ var im=new Image(); im.src=(window.HANA_ASSETS&&HANA_ASSETS[src])||src; return im; }
  function ready(im){ return im && im.complete && im.naturalWidth>0; }

  function resize(){
    W=cv.clientWidth; H=cv.clientHeight; DPR=Math.min(window.devicePixelRatio||1,2); U=Math.min(W,H);
    cv.width=W*DPR; cv.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0);
    cx=W*0.5; cy=H*0.50;
    bgGrad=ctx.createLinearGradient(0,0,0,H);
    bgGrad.addColorStop(0,rgb(PC.bgTop)); bgGrad.addColorStop(0.55,rgb(PC.bgMid)); bgGrad.addColorStop(1,rgb(PC.bgBottom));
    layoutFlowers();
  }
  function layoutFlowers(){
    var rx=Math.min(W*0.32,430), ry=Math.min(H*0.32,290);
    for(var i=0;i<flowers.length;i++){
      var a=-Math.PI/2 + i*(Math.PI*2/flowers.length);
      flowers[i].hx=cx+Math.cos(a)*rx; flowers[i].hy=cy+Math.sin(a)*ry; flowers[i].ca=a;
      if(flowers[i].cx==null){ flowers[i].cx=flowers[i].hx; flowers[i].cy=flowers[i].hy; }
    }
  }
  function makeFlowers(){
    flowers=(HANA.flowers||[]).map(function(f){
      return { id:f.id, name:f.name, c:f.colour.slice(), wake:0, twake:0,
               petalImgs:(f.assets.petals||[f.assets.petal]).map(loadImg), bloomImg:loadImg(f.assets.bloom) };
    });
  }
  function buildPetals(n){
    petals=[];
    for(var i=0;i<n;i++){
      var k=Math.random(), fi=i%Math.max(1,flowers.length);
      var nv=(flowers[fi]&&flowers[fi].petalImgs)?flowers[fi].petalImgs.length:1;
      petals.push({ x:Math.random()*W, y:Math.random()*H, vx:(Math.random()-.5)*0.6, vy:(Math.random()-.5)*0.6,
        k:k, depth:0.30+0.70*k, rot:Math.random()*6.28, vr:(Math.random()-.5)*0.03,
        fi:fi, pv:(Math.random()*nv)|0, hv:(Math.random()*Math.max(1,heroPetalImgs.length))|0,
        ph:Math.random()*6.28, named:false, tx:0, ty:0, inForm:false, fx:0, fy:0 });
    }
  }
  function petalPx(p){ return (A.petalScaleMin + p.k*(A.petalScaleMax-A.petalScaleMin)) * U * 0.18 * (1+surgeBoost*0.3); }

  function labelSprite(name){
    if(labelCache[name]) return labelCache[name];
    var c=document.createElement('canvas'); c.width=180; c.height=36; var g=c.getContext('2d');
    g.font='600 14px Manrope,sans-serif'; g.textAlign='center'; g.textBaseline='middle';
    g.shadowColor='rgba(40,14,70,.9)'; g.shadowBlur=10; g.fillStyle='#fff'; g.fillText(name,90,18);
    labelCache[name]=c; return c;
  }

  function shapePoints(shape,n){
    var pts=[], R=U*0.30, i, t;
    for(i=0;i<n;i++){ t=i/n;
      if(shape==='ring'){ var a=t*6.283; pts.push([cx+Math.cos(a)*R, cy+Math.sin(a)*R*0.85]); }
      else if(shape==='spiral'){ var sa=t*6.283*2.5, sr=R*(0.22+0.78*t); pts.push([cx+Math.cos(sa)*sr, cy+Math.sin(sa)*sr*0.85]); }
      else if(shape==='heart'){ var ht=t*6.283, hx=16*Math.pow(Math.sin(ht),3),
        hy=13*Math.cos(ht)-5*Math.cos(2*ht)-2*Math.cos(3*ht)-Math.cos(4*ht); pts.push([cx+hx*(R/17), cy-hy*(R/17)]); }
      else { var wx=W*0.1+t*W*0.8; pts.push([wx, cy+Math.sin(t*6.283*1.5)*H*0.13]); }
    }
    return pts;
  }
  function startFormation(shape){
    var n=Math.floor(petals.length*(A.formationShare||0.5)), pts=shapePoints(shape,n);
    for(var i=0;i<petals.length;i++){ if(i<n){ petals[i].fx=pts[i][0]; petals[i].fy=pts[i][1]; petals[i].inForm=true; } else petals[i].inForm=false; }
    formation.active=true; formation.hold=A.formationHold||4;
  }
  function endFormation(){ formation.active=false; for(var i=0;i<petals.length;i++) petals[i].inForm=false; }
  function flowAngle(x,y,t){ var n=A.noiseScale;
    return (Math.sin(x*n + t*0.5) + Math.cos(y*n - t*0.4) + Math.sin((x+y)*n*0.6 + t*0.3)) * 1.7; }

  function drawBg(t){
    // TRANSPARENT canvas: the cinematic real-petal VIDEO (home) or the page's
    // own real-photo centrepiece (secondary pages) shows through behind the
    // canvas. The drifting petals + emerging blooms are drawn on top as a
    // light, live layer — they accent the real footage, they are not the show.
    ctx.clearRect(0,0,W,H);
  }

  function updatePetals(t){
    var toName=nameTargets.length>0;
    for(var i=0;i<petals.length;i++){
      var p=petals[i];
      if(p.named && toName){ p.vx+=(p.tx-p.x)*0.02; p.vy+=(p.ty-p.y)*0.02; p.vx*=0.86; p.vy*=0.86; }
      else if(p.inForm && formation.str>0.02){
        p.vx+=(p.fx-p.x)*0.018*formation.str; p.vy+=(p.fy-p.y)*0.018*formation.str;
        var fa=flowAngle(p.x,p.y,t); p.vx+=Math.cos(fa)*A.flowStrength*(1-formation.str*0.85); p.vy+=Math.sin(fa)*A.flowStrength*(1-formation.str*0.85);
        var fd=Math.pow(0.90,ds); p.vx*=fd; p.vy*=fd;
      } else {
        var a=flowAngle(p.x,p.y,t);
        p.vx+=Math.cos(a)*A.flowStrength; p.vy+=Math.sin(a)*A.flowStrength;
        p.vx+=(cx-p.x)*A.cohesion; p.vy+=(cy-p.y)*A.cohesion;
        if(surgeBoost>0.01){ var dx=p.x-cx,dy=p.y-cy,d=Math.sqrt(dx*dx+dy*dy)||1; p.vx+=dx/d*surgeBoost*0.5; p.vy+=dy/d*surgeBoost*0.5; }
        var mx=p.x-mouse.x,my=p.y-mouse.y,md=Math.sqrt(mx*mx+my*my);
        if(md<A.cursorRepel&&md>0.5){ var f=(A.cursorRepel-md)/A.cursorRepel*1.7; p.vx+=mx/md*f; p.vy+=my/md*f; }
        var dmp=Math.pow(A.damping,ds); p.vx*=dmp; p.vy*=dmp;
      }
      var sp=Math.sqrt(p.vx*p.vx+p.vy*p.vy), msd=A.maxSpeed*(0.6+p.depth*0.6);
      if(sp>msd){ p.vx=p.vx/sp*msd; p.vy=p.vy/sp*msd; }
      p.x+=p.vx*ds; p.y+=p.vy*ds; p.rot+=p.vr*ds;
      if(p.x<-60)p.x=W+60; if(p.x>W+60)p.x=-60; if(p.y<-60)p.y=H+60; if(p.y>H+60)p.y=-60;
      var img;
      if(mode==='hero' && heroPetalImgs.length){ img=heroPetalImgs[p.hv]||heroPetalImgs[0]; }
      else { var fl=flowers[p.fi]||flowers[0]; if(!fl) continue; img=fl.petalImgs[p.pv]||fl.petalImgs[0]; }
      if(!ready(img)) continue;
      var px=petalPx(p);
      ctx.setTransform(DPR,0,0,DPR,p.x*DPR,p.y*DPR); ctx.rotate(p.rot);
      ctx.globalAlpha=clamp(A.petalOpacity*(0.32+p.depth*0.68),0,1);
      ctx.drawImage(img,-px/2,-px/2,px,px);
    }
    ctx.setTransform(DPR,0,0,DPR,0,0); ctx.globalAlpha=1;
  }

  function drawFlower(f,t){
    if(f.wake<0.02) return;
    f.cx+=(mix(f.hx,cx,0.16*f.wake)-f.cx)*0.06; f.cy+=(mix(f.hy,cy,0.16*f.wake)-f.cy)*0.06;
    var x=f.cx,y=f.cy, sc=A.bloomScale*U*(0.55+0.45*f.wake);
    if(A.focusGlow>0){ var hr=sc*0.85, g=ctx.createRadialGradient(x,y,0,x,y,hr);
      g.addColorStop(0,rgb(f.c,A.focusGlow*0.5*f.wake)); g.addColorStop(1,rgb(f.c,0));
      ctx.fillStyle=g; ctx.fillRect(x-hr,y-hr,hr*2,hr*2); }
    if(ready(f.bloomImg)){ ctx.globalAlpha=clamp(f.wake*1.1,0,1); ctx.drawImage(f.bloomImg, x-sc/2, y-sc/2, sc, sc); ctx.globalAlpha=1; }
    if(f.wake>0.35){ ctx.globalAlpha=clamp((f.wake-0.35)/0.4,0,1); ctx.drawImage(labelSprite(f.name), x-90, y+sc*0.5-6); ctx.globalAlpha=1; }
  }

  function drawStreams(t){
    if(!bottleVisible) return;
    for(var i=0;i<streams.length;i++){
      var s=streams[i], f=flowerById(s.fi); if(!f) continue;
      var x0=f.cx,y0=f.cy,x1=cx,y1=cy+H*0.10-50, mxp=(x0+x1)/2+Math.sin(t*1.3+i)*22,myp=(y0+y1)/2-40;
      ctx.strokeStyle=rgb(f.c,0.18); ctx.lineWidth=2.4;
      ctx.beginPath(); ctx.moveTo(x0,y0); ctx.quadraticCurveTo(mxp,myp,x1,y1); ctx.stroke();
      var tt=((t*0.5+s.off)%1), bx=(1-tt)*(1-tt)*x0+2*(1-tt)*tt*mxp+tt*tt*x1, by=(1-tt)*(1-tt)*y0+2*(1-tt)*tt*myp+tt*tt*y1;
      var rg=ctx.createRadialGradient(bx,by,0,bx,by,7); rg.addColorStop(0,rgb(f.c,0.8)); rg.addColorStop(1,rgb(f.c,0));
      ctx.fillStyle=rg; ctx.beginPath(); ctx.arc(bx,by,7,0,6.283); ctx.fill();
    }
  }

  function drawBottle(t){
    if(!bottleVisible) return;
    var bw=78,bh=142,x=cx,y=cy+H*0.10,top=y-bh*0.5,bot=y+bh*0.5;
    var og=ctx.createRadialGradient(x,y,0,x,y,120); og.addColorStop(0,rgb(bottle.col,0.30)); og.addColorStop(1,rgb(bottle.col,0));
    ctx.fillStyle=og; ctx.fillRect(x-120,y-120,240,240);
    function body(){ ctx.beginPath(); ctx.moveTo(x-11,top-20); ctx.lineTo(x+11,top-20); ctx.lineTo(x+11,top-6);
      ctx.quadraticCurveTo(x+bw*0.5,top+2,x+bw*0.5,top+28); ctx.lineTo(x+bw*0.5,bot-16);
      ctx.quadraticCurveTo(x+bw*0.5,bot,x+bw*0.5-16,bot); ctx.lineTo(x-bw*0.5+16,bot);
      ctx.quadraticCurveTo(x-bw*0.5,bot,x-bw*0.5,bot-16); ctx.lineTo(x-bw*0.5,top+28);
      ctx.quadraticCurveTo(x-bw*0.5,top+2,x-11,top-6); ctx.closePath(); }
    body(); ctx.fillStyle='rgba(255,255,255,0.30)'; ctx.fill();
    ctx.save(); body(); ctx.clip();
    var lvl=bot-16-(bot-16-(top+32))*bottle.fill;
    var lg=ctx.createLinearGradient(0,lvl,0,bot);
    lg.addColorStop(0,rgb([clamp(bottle.col[0]+40,0,255),clamp(bottle.col[1]+40,0,255),clamp(bottle.col[2]+40,0,255)],0.95));
    lg.addColorStop(1,rgb(bottle.col,0.95));
    ctx.fillStyle=lg; ctx.fillRect(x-bw,lvl,bw*2,bot-lvl+4);
    ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.fillRect(x-bw,lvl,bw*2,2); ctx.restore();
    body(); ctx.strokeStyle='rgba(255,255,255,0.6)'; ctx.lineWidth=1.4; ctx.stroke();
    ctx.fillStyle='rgba(255,246,255,0.95)'; ctx.fillRect(x-12,top-30,24,12); ctx.fillRect(x-9,top-44,18,10);
    ctx.beginPath(); ctx.arc(x,top+8,5.5,0,6.283); ctx.fillStyle=C.gold; ctx.fill();
  }

  function flowerById(id){ for(var i=0;i<flowers.length;i++) if(flowers[i].id===id) return flowers[i]; return null; }

  function loop(ts){
    if(!t0)t0=ts; var t=(ts-t0)/1000*A.timeScale;
    var rawDt=(lastTs==null)?16.7:(ts-lastTs); ds=clamp(rawDt/16.667,0.25,3); lastTs=ts;
    surgeClock+=ds/60;
    if(mode==='hero' && surgeClock>A.surgeEvery && !formation.active){ surgeClock=0; surgeBoost=A.surgeStrength; }
    surgeBoost*=Math.pow(0.95,ds);
    if(mode==='hero' && !nameTargets.length){
      if(formation.active){ formation.str=Math.min(1,formation.str+0.012*ds); formation.hold-=ds/60; if(formation.hold<=0){ endFormation(); formation.clock=0; } }
      else { formation.str=Math.max(0,formation.str-0.02*ds); formation.clock+=ds/60;
        if(formation.clock>(A.formationEvery||13)){ var sh=A.formationShapes||['ring','spiral','wave']; startFormation(sh[formation.idx++%sh.length]); } }
    } else if(formation.active){ endFormation(); formation.str=0; }
    for(var i=0;i<flowers.length;i++) flowers[i].wake+=(flowers[i].twake-flowers[i].wake)*0.05;
    lerp3(bottle.col,bottle.tcol,0.03); bottle.fill+=(bottle.tfill-bottle.fill)*0.05;
    drawBg(t);
    updatePetals(t);
    if(mode==='hero'){ drawStreams(t); for(var f=0;f<flowers.length;f++) drawFlower(flowers[f],t); drawBottle(t); }
    raf=requestAnimationFrame(loop);
  }

  function reblendBottle(){
    if(awakened.length===0) return;
    var acc=[0,0,0]; for(var i=0;i<awakened.length;i++){ var f=flowerById(awakened[i]); acc[0]+=f.c[0];acc[1]+=f.c[1];acc[2]+=f.c[2]; }
    bottle.tcol=[acc[0]/awakened.length,acc[1]/awakened.length,acc[2]/awakened.length]; bottle.tfill=clamp(awakened.length*0.2+0.12,0,1);
  }

  var onMove=function(e){ if(!cv) return; var r=cv.getBoundingClientRect(); mouse.x=e.clientX-r.left; mouse.y=e.clientY-r.top; };
  var onLeave=function(){ mouse.x=-9999; mouse.y=-9999; };
  var onClick=function(e){ if(!clickCb||mode!=='hero')return; var r=cv.getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top;
    for(var i=0;i<flowers.length;i++){ var f=flowers[i],d=Math.hypot(mx-f.cx,my-f.cy); if(f.wake>0.3 && d<A.bloomScale*U*0.4){ clickCb(f.id); return; } } };

  return {
    init:function(id,m){
      var prev=cv; cv=document.getElementById(id); if(!cv) return; ctx=cv.getContext('2d');
      A=HANA.animation; C=HANA.colours; mode=m||'hero'; bottleVisible=false;
      if(A.reduceMotion){ A=Object.assign({},A,{timeScale:A.timeScale*0.6,surgeStrength:A.surgeStrength*0.4}); }
      PC={ bgTop:hex(C.bgTop), bgMid:hex(C.bgMid), bgBottom:hex(C.bgBottom), halo:hex(C.halo), haloPink:hex(C.haloPink) };
      makeFlowers(); heroPetalImgs=(HANA.heroPetals||[]).map(loadImg);
      resize(); buildPetals(mode==='hero'?A.petalCount:A.ambientPetalCount);
      window.removeEventListener('resize',resize); window.addEventListener('resize',resize);
      window.removeEventListener('mousemove',onMove); window.addEventListener('mousemove',onMove);
      document.removeEventListener('mouseleave',onLeave); document.addEventListener('mouseleave',onLeave);
      if(prev) prev.removeEventListener('click',onClick); cv.removeEventListener('click',onClick); cv.addEventListener('click',onClick);
      if(raf) cancelAnimationFrame(raf); t0=null; lastTs=null; raf=requestAnimationFrame(loop);
    },
    awaken:function(id){ var f=flowerById(id); if(!f) return; f.twake=1;
      if(awakened.indexOf(id)<0){ awakened.push(id); streams.push({fi:id,off:Math.random()}); } reblendBottle(); },
    composeBlend:function(ids,weights){ bottleVisible=true;
      var acc=[0,0,0],tot=0; (ids||awakened).forEach(function(id,i){ var f=flowerById(id); if(!f)return;
        var w=(weights&&weights[i]!=null)?weights[i]:1; acc[0]+=f.c[0]*w;acc[1]+=f.c[1]*w;acc[2]+=f.c[2]*w;tot+=w; });
      if(tot>0){ bottle.tcol=[acc[0]/tot,acc[1]/tot,acc[2]/tot]; bottle.tfill=1; } surgeBoost=A.surgeStrength; },
    surge:function(){ surgeBoost=A.surgeStrength; },
    setBottle:function(v){ bottleVisible=!!v; },
    formName:function(text){
      nameTargets=[]; for(var n=0;n<petals.length;n++) petals[n].named=false;
      var off=document.createElement('canvas'); off.width=420; off.height=120; var o=off.getContext('2d');
      o.fillStyle='#000'; o.font='700 92px Cormorant Garamond, Georgia, serif'; o.textAlign='center'; o.textBaseline='middle'; o.fillText(text||'',210,60,400);
      var d=o.getImageData(0,0,420,120).data, pts=[];
      for(var y=0;y<120;y+=7) for(var x=0;x<420;x+=7){ if(d[(y*420+x)*4+3]>128) pts.push([x,y]); }
      var k=Math.min(1,(W-24)/440), sx=cx-210*k, sy=Math.max(14,cy-U*0.34*k);
      for(var i=0;i<pts.length;i++) nameTargets.push([sx+pts[i][0]*k,sy+pts[i][1]*k]);
      var count=Math.min(petals.length,nameTargets.length);
      for(var j=0;j<count;j++){ petals[j].named=true; petals[j].tx=nameTargets[j][0]; petals[j].ty=nameTargets[j][1]; }
    },
    clearName:function(){ nameTargets=[]; for(var i=0;i<petals.length;i++) petals[i].named=false; },
    reset:function(){ awakened=[]; streams=[]; bottle.tfill=0; bottle.tcol=C.bottleStart.slice(); bottleVisible=false;
      for(var i=0;i<flowers.length;i++) flowers[i].twake=0; this.clearName(); endFormation(); formation.str=0; },
    onFlowerClick:function(fn){ clickCb=fn; },
    flowerPos:function(id){ var f=flowerById(id); return f?{x:f.cx,y:f.cy}:null; },
    formShape:function(name){ startFormation(name||'ring'); },
    setMode:function(m){ mode=m; }
  };
})();
