/* ============================================================
   SNOW — calm "floral snow": real petal cut-outs falling gently
   from a soft sky, with sine-wave wind sway. Refined, meditative.
   SNOW.init(canvasId, [petalSrcs], count)
   ============================================================ */
window.SNOW = (function(){
  var cv, ctx, W, H, DPR, raf, last=null, imgs=[], petals=[], reduce=false;
  function load(src){ var i=new Image(); i.src=(window.HANA_ASSETS&&HANA_ASSETS[src])||src; return i; }
  function ready(i){ return i && i.complete && i.naturalWidth>0; }
  function resize(){ W=cv.clientWidth||window.innerWidth; H=cv.clientHeight||window.innerHeight; DPR=Math.min(window.devicePixelRatio||1,2);
    cv.width=W*DPR; cv.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); }
  function spawn(initial){
    return { x:Math.random()*W, y:initial?Math.random()*H:-40-Math.random()*140,
      vy:0.45+Math.random()*0.8, sway:0.6+Math.random()*1.5, swayPh:Math.random()*6.28, swaySpd:0.35+Math.random()*0.6,
      rot:Math.random()*6.28, vr:(Math.random()-.5)*0.018, size:24+Math.random()*42, fi:(Math.random()*Math.max(1,imgs.length))|0,
      op:0.5+Math.random()*0.45, depth:0.4+Math.random()*0.6 };
  }
  function build(n){ petals=[]; for(var i=0;i<n;i++) petals.push(spawn(true)); }
  function loop(ts){
    if(last==null) last=ts; var dt=(ts-last)/16.667; dt=dt<0.25?0.25:dt>3?3:dt; last=ts;
    ctx.clearRect(0,0,W,H);
    for(var i=0;i<petals.length;i++){ var p=petals[i];
      p.swayPh+=p.swaySpd*0.02*dt; p.y+=p.vy*p.depth*dt*1.1; p.x+=Math.sin(p.swayPh)*p.sway*p.depth*dt; p.rot+=p.vr*dt;
      if(p.y>H+60){ var np=spawn(false); for(var k in np) p[k]=np[k]; }
      var im=imgs[p.fi]; if(!ready(im)) continue; var s=p.size*p.depth;
      ctx.globalAlpha=Math.min(1,p.op*p.depth+0.12); ctx.setTransform(DPR,0,0,DPR,p.x*DPR,p.y*DPR); ctx.rotate(p.rot);
      ctx.drawImage(im,-s/2,-s/2,s,s);
    }
    ctx.setTransform(DPR,0,0,DPR,0,0); ctx.globalAlpha=1;
    raf=requestAnimationFrame(loop);
  }
  return { init:function(id,srcs,count){
    cv=document.getElementById(id); if(!cv) return; ctx=cv.getContext('2d');
    reduce=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    imgs=(srcs||[]).map(load); resize();
    window.removeEventListener('resize',resize); window.addEventListener('resize',resize);
    build(count||(reduce?14:42));
    if(raf) cancelAnimationFrame(raf); last=null; raf=requestAnimationFrame(loop);
  }};
})();
