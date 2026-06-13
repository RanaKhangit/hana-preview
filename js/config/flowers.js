/* ============================================================
   FLOWERS (v2)  —  backed by REAL flower imagery.
   assets.petals = an ARRAY of real petal/fragment cut-outs; the
                   murmuration draws a random one per particle, so
                   the field looks varied and alive (not repeated).
   assets.bloom  = the full flower that emerges and speaks.
   assets.guide  = the hero image on the Flower Guides page.
   colour        = soft light / light-streams / blend-card dots only
                   (the petals are real photos — never tinted).
   keywords      = words that summon this flower (selection only).
   intro / lore  = spoken: feeling, ritual, apothecary only.
   To add more variety, drop more PNGs in assets/flowers/petals/
   and list them here. To swap in licensed/commissioned photography
   later, just replace the files — no code change.
   ============================================================ */
window.HANA = window.HANA || {};
function _pet(id, n){ var a=['assets/flowers/petals/'+id+'.png']; for(var i=2;i<=n;i++) a.push('assets/flowers/petals/'+id+'-'+i+'.png'); return a; }
HANA.flowers = [
  {
    id:'rose', name:'Rose', colour:[255,120,170],
    assets:{ petals:_pet('rose',3), bloom:'assets/flowers/blooms/rose.png', guide:'assets/flowers/blooms/rose.png' },
    intro:"I'm Rose. I step forward in heavy moments, when you want to feel held.",
    lore:"For centuries I have belonged to the tender rituals of the heart. I bring warmth, softness and a sense of being held.",
    role:"Warmth and comfort — the heart of your blend.",
    keywords:['held','heavy','low','sad','heart','lonely','anxious','anxiety','overwhelmed','tense','comfort','love','hold','hurt']
  },
  {
    id:'lily', name:'Lily', colour:[255,236,196],
    assets:{ petals:_pet('lily',3), bloom:'assets/flowers/blooms/lily.png', guide:'assets/flowers/blooms/lily.png' },
    intro:"I'm Lily. I bring softness and light into the space around you.",
    lore:"Old gardens kept me for moments of grace and quiet renewal. I lift the air a little and let some light in.",
    role:"Lightness and grace.",
    keywords:['light','lift','bright','grace','space','clear','clarity','renew','fresh','flat','low','sad','grief','tearful','blue']
  },
  {
    id:'lavender', name:'Lavender', colour:[176,107,255],
    assets:{ petals:_pet('lavender',3), bloom:'assets/flowers/blooms/lavender.png', guide:'assets/flowers/blooms/lavender.png' },
    intro:"I'm Lavender. I bring calm to the close of day.",
    lore:"Drawn from the apothecary tradition, I have long marked the gentle turning toward evening.",
    role:"Calm at the close of day.",
    keywords:['calm','evening','wind down','wind-down','relax','soft','tense','stress','stressed','settle','close of day']
  },
  {
    id:'bluebell', name:'Bluebell', colour:[97,150,255],
    assets:{ petals:_pet('bluebell',3), bloom:'assets/flowers/blooms/bluebell.png', guide:'assets/flowers/blooms/bluebell.png' },
    intro:"I'm Bluebell. I belong to quieter evenings.",
    lore:"I am a woodland flower of hush and stillness, gathered where the day grows quiet.",
    role:"Stillness for evening rituals.",
    keywords:['sleep','settle','night','quiet','rest','still','restless','cant sleep',"can't sleep",'awake','unwind']
  },
  {
    id:'chamomile', name:'Chamomile', colour:[255,214,120],
    assets:{ petals:_pet('chamomile',3), bloom:'assets/flowers/blooms/chamomile.png', guide:'assets/flowers/blooms/chamomile.png' },
    intro:"I'm Chamomile. I soften the rhythm of your evening ritual.",
    lore:"Kept in kitchens and apothecaries for generations, I am the slow, golden wind-down at the end of a long day.",
    role:"A soft, slow evening.",
    keywords:['soothe','soft','gentle','unwind','warm','tired','cosy','slow evening','wind down']
  },
  {
    id:'dandelion', name:'Dandelion', colour:[255,206,90],
    assets:{ petals:_pet('dandelion',3), bloom:'assets/flowers/blooms/dandelion.png', guide:'assets/flowers/blooms/dandelion.png' },
    intro:"I'm Dandelion. I help complete your blend with brightness and movement.",
    lore:"I scatter on the wind and carry small wishes. I bring brightness and a sense of lift to finish a blend.",
    role:"Brightness that completes the blend.",
    keywords:['bright','complete','movement','energy','hope','morning','fresh','lift','joy','play']
  }
];
HANA.defaultFlowers = ['rose','lavender','bluebell','dandelion'];

/* Home hero murmuration draws from these CRISP, real single-petal cut-outs
   (not the per-flower petals, not canvas shapes). Drop more PNGs in
   assets/flowers/petals/hero/ and list them to enrich the flock. */
HANA.heroPetals = [
  'assets/flowers/petals/hero/rose.png',
  'assets/flowers/petals/hero/rose-red.png',
  'assets/flowers/petals/hero/lavender.png',
  'assets/flowers/petals/hero/lily.png',
  'assets/flowers/petals/hero/bluebell.png',
  'assets/flowers/petals/hero/dandelion.png'
];
