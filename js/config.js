/* =====================================================================
   CONFIG — swap assets and integrations here
   ===================================================================== */
const CONFIG = {
  introVideo: 'assets/intro.mp4',            // Geometric blocks logo reveal
  introPoster: 'assets/posters/intro.jpg',
  introMaxMs: 6000,                          // never hold visitors longer than this
  introSkipAfterMs: 1200,                    // show "Skip" after this delay
  introOncePerSession: true,                 // true = intro plays once per browser session (not on every refresh)
  formEndpoint: 'https://script.google.com/macros/s/AKfycbzoub4zRbPHBgY9c1d--2OprrOZUF-_NGyTL9RvZK7nxdMId1fcHFWOmPjyD6uAuzYvng/exec', // Google Apps Script (saves to your Sheet). Any other URL = plain JSON POST
  showPlaceholderBadges: false,              // true = show "Placeholder" labels and boxes while content is missing
  showTestimonials: false,                   // set true once TESTIMONIALS in data.js are real, approved quotes
  behance: 'https://www.behance.net/prathmeshmungi'
};
