/* ============================================================
   PRODUCT / BLEND OPTIONS  —  ritual names, descriptions, formats.
   ritualNames: the pool the blend reveal picks from.
   blendWeights: % split by number of selected flowers (sums to 100).
   ============================================================ */
window.HANA = window.HANA || {};
HANA.products = {
  ritualNames:['Radiant Calm','Evening Light','Held in Bloom','Quiet Hours',
               'Soft Dawn','Tender Light','Stillwater Bloom','Golden Hush'],
  ritualSubs:[
    "A soft embrace for gentler evenings.",
    "A peaceful close to your day.",
    "Warmth, softness and a sense of being held.",
    "Stillness gathered into one ritual."
  ],
  blendWeights:{ 1:[100], 2:[55,45], 3:[40,35,25], 4:[35,30,20,15], 5:[28,24,20,16,12], 6:[24,21,18,15,12,10] },

  formats:[
    { id:'drops', name:'Ritual Drops',  desc:"A few drops to begin or close your day." },
    { id:'oil',   name:'Botanical Oil', desc:"A silken oil for a slow, sensory ritual." },
    { id:'mist',  name:'Aura Mist',     desc:"A fine mist to set the mood of a room." },
    { id:'blend', name:'Personal Blend',desc:"Your flowers, composed into one bottle." },
    { id:'gift',  name:'Gift Ritual',   desc:"A composed ritual, wrapped to give." }
  ]
};
