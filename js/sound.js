/* ============================================================
   SOUND ENGINE  —  generative ambient audio (WebAudio, no files).
   Self-contained: creates its own toggle button bottom-left.
   Public API (window.SOUND):
     chime(i)    soft bell when flower i awakens (its own note)
     shimmer()   rising arpeggio for the blend reveal
     swell()     gentle low swell for a petal surge
   Everything respects the toggle; safe no-ops when muted.
   ============================================================ */
window.SOUND = (function(){
  var S, ctx=null, master=null, padNodes=[], sparkleTimer=null, on=false, btn;

  // page-aware soundscape: each page gets its own tonal pad + chimes
  function pageKey(){ return (document.body && document.body.getAttribute('data-page')) || 'home'; }
  function loadS(){
    var base={ masterVolume:.15, padVolume:.5, sparkleVolume:.3, chimeVolume:.55, breatheSpeed:.1,
      padChord:[110,164.81,220,277.18,329.63], chimeScale:[440,493.88,554.37,659.25,739.99,880] };
    var ss=(window.HANA && HANA.soundscapeFor) ? HANA.soundscapeFor(pageKey()) : null;
    var g=(window.HANA && HANA.sound) || {};
    var out={}; [base,g,ss||{}].forEach(function(o){ for(var k in o) if(o[k]!=null) out[k]=o[k]; });
    return out;
  }

  function ensureCtx(){
    if(ctx) return;
    var AC=window.AudioContext||window.webkitAudioContext; if(!AC) return;
    ctx=new AC();
    master=ctx.createGain(); master.gain.value=S.masterVolume; master.connect(ctx.destination);
  }
  function startPad(){
    stopPad();
    var lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=900; lp.Q.value=0.4;
    var padGain=ctx.createGain(); padGain.gain.value=0;
    lp.connect(padGain); padGain.connect(master);
    // slow breathing on the pad volume
    var lfo=ctx.createOscillator(), lfoG=ctx.createGain();
    lfo.frequency.value=S.breatheSpeed; lfoG.gain.value=S.padVolume*0.25;
    lfo.connect(lfoG); lfoG.connect(padGain.gain); lfo.start();
    padGain.gain.setTargetAtTime(S.padVolume*0.6, ctx.currentTime, 2.5);
    S.padChord.forEach(function(f,i){
      var o=ctx.createOscillator(), g=ctx.createGain();
      o.type=(i%2?'triangle':'sine'); o.frequency.value=f; o.detune.value=(i-2)*3;
      g.gain.value=0.22/S.padChord.length*3;
      o.connect(g); g.connect(lp); o.start();
      padNodes.push(o,g,lfo,lfoG,padGain,lp);
    });
    // occasional quiet high plucks
    sparkleTimer=setInterval(function(){
      if(!on||!ctx) return;
      if(Math.random()<0.55) pluck(S.chimeScale[(Math.random()*S.chimeScale.length)|0]*2, S.sparkleVolume*0.4, 2.2);
    }, 3800);
  }
  function stopPad(){
    if(sparkleTimer){ clearInterval(sparkleTimer); sparkleTimer=null; }
    padNodes.forEach(function(n){ try{ n.stop? n.stop():0; n.disconnect&&n.disconnect(); }catch(e){} });
    padNodes=[];
  }
  function pluck(freq,vol,dur){
    if(!ctx||!on) return;
    var o=ctx.createOscillator(), g=ctx.createGain();
    o.type='sine'; o.frequency.value=freq;
    g.gain.setValueAtTime(0.0001,ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(vol,ctx.currentTime+0.02);
    g.gain.exponentialRampToValueAtTime(0.0001,ctx.currentTime+(dur||1.6));
    o.connect(g); g.connect(master); o.start(); o.stop(ctx.currentTime+(dur||1.6)+0.1);
  }
  function mood(){ var ss=(window.HANA&&HANA.soundscapeFor)?HANA.soundscapeFor(pageKey()):null; return (ss&&ss.mood)||''; }
  function updateBtn(){
    if(!btn) return;
    btn.innerHTML='<span class="sdot"></span>'+(on?('Soundscape &middot; '+mood()):'Soundscape');
    btn.classList.toggle('on',on); btn.setAttribute('aria-pressed',on?'true':'false');
    btn.title=(window.HANA&&HANA.soundscapeNote)||'Ambient soundscape';
  }
  function setOn(v){
    on=v;
    try{ localStorage.setItem('hana_sound', v?'1':'0'); }catch(e){}
    updateBtn();
    if(v){ ensureCtx(); if(!ctx) return; ctx.resume&&ctx.resume();
      if(master) master.gain.setTargetAtTime(S.masterVolume, ctx.currentTime, 1.0);   // gentle fade in
      startPad();
    } else if(ctx&&master){                                                            // graceful fade out, then stop
      master.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.45);
      setTimeout(function(){ if(!on){ stopPad(); if(ctx&&ctx.suspend) ctx.suspend(); } }, 1300);
    }
  }
  function makeToggle(){
    btn=document.createElement('button'); btn.className='soundtoggle'; btn.type='button';
    btn.setAttribute('aria-label','toggle ambient soundscape');
    btn.addEventListener('click',function(){ setOn(!on); });
    document.body.appendChild(btn); updateBtn();
  }
  function init(){
    if(btn) return; S=loadS(); makeToggle();
    // persist the soundscape across pages: if it was on, carry it; audio resumes on
    // the first interaction (browser autoplay policy), so it feels continuous.
    var persisted=false; try{ persisted=localStorage.getItem('hana_sound')==='1'; }catch(e){}
    if(persisted){
      on=true; updateBtn();
      var resume=function(){ if(on){ ensureCtx(); if(ctx){ ctx.resume&&ctx.resume();
          if(master) master.gain.setTargetAtTime(S.masterVolume, ctx.currentTime, 1.5); startPad(); } }
        window.removeEventListener('pointerdown',resume,true); window.removeEventListener('keydown',resume,true); };
      window.addEventListener('pointerdown',resume,{once:true,capture:true});
      window.addEventListener('keydown',resume,{once:true,capture:true});
    }
  }
  document.addEventListener('DOMContentLoaded',init);
  if(document.readyState!=='loading'){ setTimeout(init,0); }
  return {
    chime:function(i){ if(!on||!ctx) return; pluck(S.chimeScale[(i||0)%S.chimeScale.length], S.chimeVolume*0.5, 1.8); },
    shimmer:function(){ if(!on||!ctx) return; var t=0; S.chimeScale.forEach(function(f,i){
      setTimeout(function(){ pluck(f*2, S.chimeVolume*0.35, 1.4); }, t); t+=110; }); },
    swell:function(){ if(!on||!ctx) return; pluck(S.padChord[0], S.padVolume*0.5, 2.6); },
    isOn:function(){ return on; }
  };
})();
