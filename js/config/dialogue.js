/* ============================================================
   DIALOGUE  —  every line the garden / HANA says.
   Use {name} as a placeholder for the customer's name.
   Keep all language feeling + ritual + sensory (never medical).
   ============================================================ */
window.HANA = window.HANA || {};
HANA.dialogue = {
  brand:'HANA',
  tagline:'A PRIVATE BOTANICAL SOCIETY',
  systemSpeaker:'HANA',

  welcome:"Welcome to HANA, a private botanical society.",
  askName:"What is your name?",
  namePlaceholder:"type your name…",

  greet:"Welcome, {name}. The garden has opened for you.",
  feelPlaceholder:"Share how you feel, what you are seeking, or the ritual you want to create…",

  listening:"Thank you, {name}. Let me listen, and call your flowers forward.",
  council:"Your flowers are gathering, {name}.",
  forming:"Your HANA ritual is forming…",
  ready:"{name}, your ritual is ready.",

  toCheckout:"Gathering your ritual direction… (this is a demo).",
  refine:"Of course — tell me a little more.",
  questionIntro:"" // optional lead-in before guided questions
};
