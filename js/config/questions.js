/* ============================================================
   QUESTIONS / DATA FIELDS  —  the guided "flower conversation".
   Each question is spoken by a flower (flowerId) and captured
   into HANA.capture (and the browser console / localStorage),
   so it feels like flowers talking, not a form.
   type:'chips' shows tappable options. Add/remove freely.
   ============================================================ */
window.HANA = window.HANA || {};
HANA.questions = [
  { id:'timeOfDay', flowerId:'lavender', text:"When does your ritual live?",
    type:'chips', options:['Morning','Afternoon','Evening','Night'] },

  { id:'intensity', flowerId:'rose', text:"Shall we keep it gentle, balanced, or deep?",
    type:'chips', options:['Gentle','Balanced','Deep'] },

  { id:'scent', flowerId:'chamomile', text:"Which scent calls to you?",
    type:'chips', options:['Soft floral','Green & herbal','Bright citrus','Warm amber'] },

  { id:'product', flowerId:'dandelion', text:"How would you like to hold your ritual?",
    type:'chips', options:['Drops','Oil','Mist','Blend','Gift'] },

  { id:'season', flowerId:'lily', text:"What season of life are you in right now?",
    type:'chips', options:['A fresh start','Deep change','Seeking calm','Coming home to myself'] }
];
