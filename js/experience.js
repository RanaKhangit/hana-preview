/* ============================================================
   EXPERIENCE  —  the home conversational ritual (state machine).
   Orchestrates GARDEN + dialogue + flower conversation + blend.
   Captures data invisibly into HANA.capture + localStorage + console.
   ============================================================ */
window.EXPERIENCE = (function(){
  var D, els={}, phase='intro', capture={}, selected=[], typeToken=0;

  function el(cls,parent,tag){ var e=document.createElement(tag||'div'); e.className=cls; (parent||document.body).appendChild(e); return e; }
  function flower(id){ return (HANA.flowers||[]).find(function(f){return f.id===id;}); }
  function flrgb(c){ return 'rgb('+c[0]+','+c[1]+','+c[2]+')'; }
  function sleep(ms){ return new Promise(function(r){setTimeout(r,ms);}); }

  function buildDOM(){
    var stage=el('stage');
    var dlg=el('dialogue',stage);
    els.spk=el('dspeaker',dlg);
    var line=el('dline',dlg); els.txt=document.createElement('span'); line.appendChild(els.txt);
    var cur=document.createElement('span'); cur.className='cur'; line.appendChild(cur);
    els.council=el('council');
    els.say=el('say',null,'form');
    els.input=document.createElement('input'); els.input.autocomplete='off'; els.input.spellcheck=false;
    var mic=document.createElement('button'); mic.type='button'; mic.className='mic'; mic.innerHTML='&#127908;'; mic.title='voice (demo)';
    var send=document.createElement('button'); send.type='submit'; send.setAttribute('aria-label','send'); send.innerHTML='&#8594;';
    els.say.appendChild(els.input); els.say.appendChild(mic); els.say.appendChild(send);
    els.chips=el('chips');
    els.blend=el('blend');
    els.journey=el('journey');
    ['Share','Connect','Create','Receive'].forEach(function(l,i){ var j=el('j'+(i===0?' on':''),els.journey); j.className='j'+(i===0?' on':'');
      var d=document.createElement('span'); d.className='jd'; var t=document.createElement('span'); t.className='jl'; t.textContent=l; j.appendChild(d); j.appendChild(t); });
    els.restart=el('restart',null,'button'); els.restart.textContent='start again'; els.restart.style.display='none';
    els.restart.onclick=restart;
    els.say.addEventListener('submit',onSubmit);
    mic.onclick=function(){ els.input.placeholder='listening… (demo — please type)'; els.input.focus(); };
  }
  function step(n){ var js=els.journey.querySelectorAll('.j'); js.forEach(function(j,i){ j.classList.toggle('on',i<=n); }); }

  /* Single-writer, time-based typewriter:
     - cancels any previous line (no two lines can fight over the text)
     - renders by elapsed time, so throttled/background tabs still
       complete each line quickly instead of crawling. */
  function type(speaker,text,colour){
    els.spk.textContent=speaker||''; els.spk.style.color=colour||'#ffe9b8';
    var my=++typeToken, full=text||'', t0=performance.now(), perChar=22;
    return new Promise(function(res){
      els.txt.textContent='';
      function tick(){
        if(my!==typeToken){ res(); return; }            // superseded by a newer line
        var n=Math.min(full.length, Math.floor((performance.now()-t0)/perChar));
        els.txt.textContent=full.slice(0,n);
        if(n>=full.length){ res(); return; }
        setTimeout(tick,40);
      }
      tick();
    });
  }
  function fill(t){ return (t||'').replace('{name}',capture.name||'friend'); }

  function pickFlowers(text){
    var s=(text||'').toLowerCase(), out=[];
    (HANA.flowers||[]).forEach(function(f){ if(out.length>=4) return;
      for(var i=0;i<f.keywords.length;i++){ if(s.indexOf(f.keywords[i])>=0){ out.push(f.id); break; } } });
    if(out.length===0) out=(HANA.defaultFlowers||['rose','lavender']).slice(0,4);
    return out;
  }

  async function onSubmit(e){
    e.preventDefault();
    if(phase==='intro'||phase==='busy'||phase==='done') return;   // garden is mid-speech: keep the typed text, ignore the send
    var v=(els.input.value||'').trim(); if(!v) return; els.input.value='';
    await type('You',v,'#fff'); await sleep(400);
    if(phase==='name'){
      capture.name=v.replace(/[^a-zA-Z' -]/g,'').slice(0,22)||'friend';
      GARDEN.surge(); if(window.SOUND) SOUND.swell(); step(1);   // petals gather warmly; the garden greets by name in type, not in petals
      await type(D.systemSpeaker, fill(D.greet));
      els.input.placeholder=D.feelPlaceholder; phase='feel'; els.input.focus(); save(); return;
    }
    if(phase==='feel'){
      capture.feeling=v; GARDEN.surge(); if(window.SOUND) SOUND.swell(); step(2); phase='busy';
      els.say.style.opacity='0'; els.say.style.pointerEvents='none'; els.input.blur();
      await type(D.systemSpeaker, fill(D.listening)); await sleep(500);
      selected=pickFlowers(v);
      for(var i=0;i<selected.length;i++){ var f=flower(selected[i]); GARDEN.awaken(f.id); addCouncil(f);
        if(window.SOUND) SOUND.chime(HANA.flowers.indexOf(f));   // each flower wakes with its own note
        await type(f.name, f.intro, flrgb(f.colour)); await sleep(650); }
      save();
      await guidedQuestions();
      await composeAndReveal();
      return;
    }
  }

  function addCouncil(f){
    var c=document.createElement('div'); c.className='fcard'; c.style.cursor='pointer';
    c.innerHTML='<h4><span class="fdot" style="color:'+flrgb(f.colour)+';background:'+flrgb(f.colour)+'"></span>'+f.name+'</h4><p>'+f.intro+'</p><div class="more">tap to hear my story</div>';
    c.onclick=function(){ var p=c.querySelector('p'); p.textContent=(p.dataset.open? f.intro : f.lore); p.dataset.open=p.dataset.open?'':'1'; };
    els.council.appendChild(c); setTimeout(function(){ c.classList.add('show'); },16);   // setTimeout (not rAF) so the card still reveals if the tab is briefly backgrounded
  }

  function guidedQuestions(){
    var qs=HANA.questions||[]; var idx=0;
    return new Promise(function(resolve){
      function next(){
        if(idx>=qs.length){ resolve(); return; }
        var q=qs[idx++], f=flower(q.flowerId)||{name:D.systemSpeaker,colour:[255,233,184]};
        if(!(q.options&&q.options.length)){ next(); return; }   // optionless question: never stall the ritual
        type(f.name,q.text,flrgb(f.colour||[255,233,184])).then(function(){
          els.chips.innerHTML='';
          q.options.forEach(function(opt){ var c=document.createElement('div'); c.className='chip'; c.textContent=opt;
            c.onclick=function(){ capture[q.id]=opt; els.chips.innerHTML=''; save(); next(); }; els.chips.appendChild(c); });
        });
      }
      next();
    });
  }

  async function composeAndReveal(){
    step(2);
    await type(D.systemSpeaker, D.forming);
    var weights=(HANA.products.blendWeights[selected.length]||[100]);
    GARDEN.surge(); GARDEN.formShape('ring');   // petals gather into a living ring — NO bottle on home; the bottle is revealed on the Ritual Result page
    await sleep(1500); step(3);
    revealBlend(weights);
    await type(D.systemSpeaker, fill(D.ready));
    els.say.style.opacity='0'; els.say.style.pointerEvents='none'; els.restart.style.display='block';
    phase='done'; save();   // lore-clicks stay alive after the reveal
  }

  function ritual(){
    var names=HANA.products.ritualNames, subs=HANA.products.ritualSubs||[''];
    var h=(capture.name||'').length+selected.length;
    return { name:names[h%names.length], sub:subs[h%subs.length] };
  }

  function revealBlend(weights){
    var r=ritual(); capture.ritualName=r.name; capture.blend=selected.map(function(id,i){return {id:id,pct:weights[i]};});
    var rows='';
    selected.forEach(function(id,i){ var f=flower(id); rows+='<div class="brow"><span class="fdot" style="color:'+flrgb(f.colour)+';background:'+flrgb(f.colour)+'"></span><span class="bname"><b>'+f.name+'</b><span>'+f.role+'</span></span><span class="bpc">'+weights[i]+'%</span></div>'; });
    els.blend.innerHTML=
      '<div class="eyebrow">YOUR PERSONAL BLEND</div>'+
      '<h2>'+r.name+'</h2><div class="ritual-sub">'+r.sub+'</div>'+rows+
      '<div class="blend-note">A personalised botanical direction, composed for you. Bespoke preparations are made by hand in the HANA Atelier after a private consultation.</div>'+
      '<button class="cta" id="hx-reveal">Reveal My Ritual</button>'+
      '<button class="cta ghost" id="hx-refine">Refine My Blend</button>';
    setTimeout(function(){ els.blend.classList.add('show'); },16);   // setTimeout (not rAF) so the blend reveal is never gated on tab focus
    if(window.SOUND) SOUND.shimmer();   // the reveal gets a rising sparkle
    document.getElementById('hx-reveal').onclick=goResult;
    document.getElementById('hx-refine').onclick=refine;
    save();
  }

  function goResult(){ save(); if(window.ROUTER){ ROUTER.go('ritual-result.html'); } else { window.location.href='ritual-result.html'; } }
  async function refine(){ els.blend.classList.remove('show'); els.say.style.opacity='1'; els.say.style.pointerEvents='auto';
    els.restart.style.display='none'; els.input.placeholder=D.feelPlaceholder;
    GARDEN.reset(); els.council.innerHTML=''; selected=[]; phase='feel';
    await type(D.systemSpeaker, D.refine); els.input.focus(); }
  function restart(){ capture={name:capture.name}; selected=[]; GARDEN.reset(); els.council.innerHTML=''; els.chips.innerHTML='';
    els.blend.classList.remove('show'); els.say.style.opacity='1'; els.say.style.pointerEvents='auto'; els.restart.style.display='none';
    els.input.placeholder=D.feelPlaceholder; phase='feel'; step(1); type(D.systemSpeaker, fill(D.greet)); els.input.focus(); }

  function save(){ window.HANA.capture=capture; try{ localStorage.setItem('hana_capture',JSON.stringify(capture)); }catch(e){}
    console.log('[HANA capture] (data gathered invisibly behind the ritual):', JSON.parse(JSON.stringify(capture))); }

  return {
    start: async function(){
      D=HANA.dialogue; buildDOM();
      GARDEN.onFlowerClick(function(id){ if(phase==='busy'||phase==='intro') return;   // never interrupt a speaking sequence
        var f=flower(id); if(f) type(f.name,f.lore,flrgb(f.colour)); });
      await sleep(500); await type(D.systemSpeaker, D.welcome); await sleep(800);
      await type(D.systemSpeaker, D.askName); els.input.placeholder=D.namePlaceholder; phase='name'; els.input.focus();
    }
  };
})();
