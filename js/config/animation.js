/* ============================================================
   ANIMATION SETTINGS (v2)  —  real-petal murmuration.
   Petals are now REAL photo cut-outs (see flowers.js assets).
   ============================================================ */
window.HANA = window.HANA || {};
HANA.animation = {
  // The canvas now sits OVER a cinematic real-petal video, so the live petal
  // layer is deliberately lighter and slower — a graceful accent, not clutter.
  petalCount:        58,    // home: fewer but LARGER, crisper REAL petals (depth field) over the cinematic film
  ambientPetalCount: 40,    // secondary pages (over a still): a gentle drift
  petalScaleMin:     0.20,  // petal sprite size as fraction of min(W,H)*0.20
  petalScaleMax:     0.95,  // big crisp foreground petals read as unmistakably real
  petalOpacity:      0.97,  // near-opaque foreground petals; depth still fades the far ones

  flowStrength:  0.15,   // murmuration swirl strength (flow-field)
  cohesion:      0.0009, // gentle pull toward centre (keeps the flock together)
  damping:       0.94,
  maxSpeed:      2.4,
  noiseScale:    0.0016, // flow-field scale (smaller = larger swirls)
  timeScale:     0.26,   // a touch slower — more graceful, more premium

  surgeEvery:    8.0,    // seconds between gentle surges toward the viewer
  surgeStrength: 0.85,

  // Shape formations: the flock gathers into a living pattern, holds, releases
  // (this is the "petals forming shapes like a murmuration" beat, kept subtle)
  formationEvery: 17,
  formationHold:  4.5,
  formationShare: 0.5,
  formationShapes:['ring','spiral','wave','heart'],

  bloomEntrance: 0.9,    // seconds for an emerging flower bloom to scale/fade in
  bloomScale:    0.36,   // emerged bloom size as fraction of min(W,H)
  focusGlow:     0.5,    // ONE soft colour-correct halo behind the focal bloom
                         //   (replaces the old random white glow dots — set 0 to remove)
  bottlePulse:   0.7,

  cursorRepel:   150,    // px radius petals part around the cursor
  reduceMotion:  false
};
