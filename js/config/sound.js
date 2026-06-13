/* ============================================================
   SOUND SETTINGS  —  the generative ambient layer (WebAudio,
   no audio files). The toggle appears bottom-left; sound only
   starts after the visitor taps it (browser autoplay rules).
   ============================================================ */
window.HANA = window.HANA || {};
HANA.sound = {
  startOn:       false,  // sound always needs one tap; this just sets the toggle's first state
  masterVolume:  0.16,   // overall loudness (0..0.4 sensible)
  padVolume:     0.50,   // the breathing chord bed
  sparkleVolume: 0.30,   // occasional high plucks
  chimeVolume:   0.55,   // flower-awaken chimes

  // A-major add9 pad — warm, uplifting, peaceful
  padChord:  [110.00, 164.81, 220.00, 277.18, 329.63],
  // pentatonic chime scale; flower i uses note i (Rose..Dandelion)
  chimeScale:[440.00, 493.88, 554.37, 659.25, 739.99, 880.00],
  breatheSpeed: 0.10     // pad swell speed (Hz)
};
