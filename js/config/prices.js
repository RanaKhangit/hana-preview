/* ============================================================
   HANA SOCIETY — offer architecture (front-end positioning only).
   Application-only private botanical society + bespoke ritual atelier.
   NO ecommerce: no one-off/member pricing, no cart, no checkout.
   The £195/month offer is a private SOCIETY MEMBERSHIP, never a "subscription".
   ============================================================ */
window.HANA = window.HANA || {};
HANA.prices = {
  currency:'£',
  offers:{
    society:     { name:'HANA Society Membership', monthly:195,  yearly:1950,
                   note:'Application-only', cta:'Apply to HANA Society' },
    consultation:{ name:'Private Ritual Consultation', from:750, to:1000,
                   note:'The bespoke preparation is included', cta:'Request a Private Consultation' },
    atelier:     { name:'HANA Atelier', monthly:500, yearly:5000,
                   note:'Ongoing, after consultation', cta:'Enter the HANA Atelier' },
    innerCircle: { name:'HANA Inner Circle', from:7500, toPlus:15000,
                   note:'Application-only · limited places', cta:'Apply for the Inner Circle' }
  }
};
