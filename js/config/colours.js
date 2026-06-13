/* ============================================================
   COLOURS (v2)  —  lilac-led, elevated. Bright, crystal-clear.
   Lilac is the CORE and is preserved. Drives the canvas field
   and the page UI (site.js maps these to CSS variables).
   ============================================================ */
window.HANA = window.HANA || {};
HANA.colours = {
  // The luminous lilac field (bright, crystal — never dark)
  bgTop:    '#f6efff',   // pearl-lilac, almost white at the top
  bgMid:    '#e9d8ff',   // soft lilac
  bgBottom: '#cdb1f4',   // luminous lilac-violet
  halo:     '#fff6ec',   // warm white light behind a focal bloom
  haloPink: '#ffd1ea',   // soft rose secondary light

  // Brand / UI accents
  ink:  '#3a2160',       // deep violet ink (text on light)
  gold: '#e4a23a',       // warm gold (CTAs, rules)
  rose: '#ff78aa',       // signature rose

  // Glass surfaces (readability: used only where they aid legibility)
  glass:        'rgba(255,255,255,0.50)',
  glassBorder:  'rgba(255,255,255,0.70)',
  panel:        'rgba(46,26,78,0.42)',     // calm reading panel (darker for contrast)
  panelBorder:  'rgba(255,255,255,0.40)',

  // Potion liquid before any flower is chosen
  bottleStart: [223, 200, 252]
};
