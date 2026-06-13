/* ============================================================
   SOUNDSCAPES (V2) — page-specific generative ambience config.
   Each page has its own soft tonal pad + chime palette, so the
   audio world shifts as you move through HANA, matching the page's
   mood. Played generatively in WebAudio (js/sound.js) — no files.

   COMPLIANCE — IMPORTANT:
   These are AESTHETIC sound-design tones chosen for mood and
   atmosphere only. They are NOT "healing frequencies". HANA makes
   NO claim that any tone or frequency treats, heals, balances,
   calms medically, or changes any physiological or mental state.
   Ambience is OFF by default and is entirely optional.
   ============================================================ */
window.HANA = window.HANA || {};

HANA.soundscapeNote = "Aesthetic ambient sound design for mood and atmosphere only. Makes no health claim.";

/* padChord / chimeScale are musical pad tones in Hz (sound design, not 'frequencies' in any clinical sense). */
HANA.soundscapes = {
  home:     { mood:'Living garden hush',     character:'soft, suspended, alive',  padChord:[110,164.81,220,277.18,329.63], chimeScale:[440,493.88,554.37,659.25,739.99,880], masterVolume:0.15, padVolume:0.5,  breatheSpeed:0.09 },
  how:      { mood:'The unfurling',          character:'opening, gentle rise',    padChord:[98,146.83,196,293.66],          chimeScale:[392,440,493.88,587.33,659.25],         masterVolume:0.13, padVolume:0.45, breatheSpeed:0.08 },
  guides:   { mood:'The breathing archive',  character:'still, library-calm',     padChord:[130.81,196,261.63,329.63],      chimeScale:[523.25,587.33,659.25,783.99],          masterVolume:0.12, padVolume:0.42, breatheSpeed:0.07 },
  potions:  { mood:'Alchemy shimmer',        character:'bright, mystic, golden',  padChord:[146.83,220,293.66,440],         chimeScale:[587.33,659.25,739.99,880,987.77],      masterVolume:0.14, padVolume:0.48, breatheSpeed:0.10 },
  create:   { mood:'The listening clearing', character:'warm, attentive',         padChord:[110,164.81,220,329.63],         chimeScale:[440,523.25,659.25,783.99],             masterVolume:0.13, padVolume:0.46, breatheSpeed:0.09 },
  result:   { mood:'The reveal',             character:'warm, resolved, golden',  padChord:[130.81,196,261.63,392],         chimeScale:[523.25,659.25,783.99,1046.5],          masterVolume:0.15, padVolume:0.5,  breatheSpeed:0.10 },
  about:    { mood:"The founder's hush",     character:'intimate, candle-soft',   padChord:[98,146.83,220],                 chimeScale:[392,493.88,587.33],                    masterVolume:0.12, padVolume:0.42, breatheSpeed:0.07 },
  journal:  { mood:'Falling petals',         character:'airy, drifting',          padChord:[123.47,185,246.94,370],         chimeScale:[493.88,587.33,739.99,987.77],          masterVolume:0.12, padVolume:0.44, breatheSpeed:0.08 },
  checkout: { mood:'The settling',           character:'calm, grounded',          padChord:[110,164.81,220,277.18],         chimeScale:[440,554.37,659.25],                    masterVolume:0.12, padVolume:0.4,  breatheSpeed:0.07 }
};

/* resolve the soundscape for a page key, with a safe default */
HANA.soundscapeFor = function(key){
  return (HANA.soundscapes && HANA.soundscapes[key]) || HANA.soundscapes.home;
};
