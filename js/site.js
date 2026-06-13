/* ============================================================
   SITE  —  shared chrome: applies the colour palette to the UI,
   builds the navigation and footer. Used by every page.
   ============================================================ */
window.SITE = (function(){
  var PAGES=[
    {href:'index.html',        label:'Home',          key:'home'},
    {href:'society.html',      label:'The Society',   key:'society'},
    {href:'how-it-works.html', label:'How It Works',  key:'how'},
    {href:'flower-guides.html',label:'Flower Guides', key:'guides'},
    {href:'potions.html',      label:'The Atelier',   key:'potions'},
    {href:'about.html',        label:'About',         key:'about'},
    {href:'journal.html',      label:'Journal',       key:'journal'}
  ];
  /* Each page has its OWN real-photo centrepiece (home uses the video).
     Resolved through HANA_ASSETS so it works loose OR in the single-file bundle. */
  var PAGE_BG={
    how:     'assets/page/how.png',
    guides:  'assets/page/guides.png',
    potions: 'assets/page/potions.png',
    about:   'assets/page/about.png',
    journal: 'assets/page/journal.png',
    create:  'assets/page/create.png',
    checkout:'assets/page/checkout.png',
    result:  'assets/page/result.png'
  };
  function R(p){ return (window.HANA_ASSETS&&HANA_ASSETS[p])||p; }
  function background(key){
    if(key==='home') return;                 // home is the cinematic video
    var src=PAGE_BG[key]; if(!src) return;
    if(document.querySelector('.pagebg')) return;
    var url=R(src);
    var bg=document.createElement('div'); bg.className='pagebg';
    bg.style.backgroundImage='url("'+url+'")';
    document.body.insertBefore(bg,document.body.firstChild);
    var gr=document.createElement('div'); gr.className='grade';
    document.body.insertBefore(gr,bg.nextSibling);
    var im=new Image(); im.onload=function(){ bg.classList.add('ready'); }; im.src=url;
    setTimeout(function(){ bg.classList.add('ready'); },1400);   // safety: never stay invisible
  }
  function applyColours(){
    var c=HANA.colours, r=document.documentElement.style;
    r.setProperty('--hana-bg-top',c.bgTop); r.setProperty('--hana-bg-mid',c.bgMid); r.setProperty('--hana-bg-bottom',c.bgBottom);
    r.setProperty('--hana-ink',c.ink); r.setProperty('--hana-gold',c.gold); r.setProperty('--hana-rose',c.rose);
    r.setProperty('--hana-glass',c.glass); r.setProperty('--hana-glass-border',c.glassBorder);
    r.setProperty('--hana-panel',c.panel); r.setProperty('--hana-panel-border',c.panelBorder);
  }
  /* page-specific ambient soundscape — load the engine on pages that
     don't already include it (home loads it directly). Ordered, off by default. */
  function ensureSound(){
    if(window.SOUND) return;
    ['js/config/sound.js','js/config/soundscapes.js','js/sound.js'].forEach(function(src){
      var s=document.createElement('script'); s.src=src; s.async=false; document.body.appendChild(s);
    });
  }
  function nav(active){
    background(active); ensureSound();
    var d=HANA.dialogue, n=document.createElement('div'); n.className='nav';
    var links=PAGES.map(function(p){ return '<a href="'+p.href+'" class="'+(p.key===active?'active':'')+'">'+p.label+'</a>'; }).join('');
    n.innerHTML='<a class="brand" href="index.html">'+d.brand+'<small>'+d.tagline+'</small></a>'+
      '<div class="nav-links">'+links+'<a class="nav-cta" href="society.html">Apply to HANA Society</a></div>'+
      '<button class="nav-burger" aria-label="menu">&#9776;</button>';
    document.body.appendChild(n);
    n.querySelector('.nav-burger').addEventListener('click',function(){
      n.querySelector('.nav-links').classList.toggle('open');
    });
  }
  function footer(){
    var f=document.createElement('div'); f.className='foot';
    f.innerHTML='HANA · a private botanical society &amp; ritual atelier.<br>'+
      '<span style="opacity:.7">Prototype — feeling &amp; ritual language only. Nothing here is a health claim.</span>';
    document.body.appendChild(f);
  }
  return { applyColours:applyColours, nav:nav, footer:footer, background:background };
})();
