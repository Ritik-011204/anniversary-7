/* ================================================================
 *  app.js — Main Initialization
 *
 *  Boots the entire experience in order:
 *    1. Three.js scene
 *    2. UI (nav, music, modal, chat bubbles)
 *    3. Chapter 3D scenes + ScrollTrigger
 *    4. Start render loop
 *    5. Hide loader
 * ================================================================ */

window.APP = window.APP || {};

(function () {

  function boot() {
    try {
      /* 1. Three.js engine */
      APP.Scene.init();

      /* 2. UI elements */
      APP.UI.init();

      /* 3. Chapter 3D + Scroll animations */
      APP.Chapters.init();

      /* 4. Start rendering */
      APP.Scene.animate();

      /* 5. Hide loader with a short delay for polish */
      setTimeout(function () {
        APP.UI.hideLoader();
      }, 600);

      console.log('✨ Anniversary website loaded successfully');

    } catch (err) {
      console.error('Failed to initialize:', err);
      /* Still hide loader so the page is usable */
      APP.UI.hideLoader();
    }
  }

  /* Wait for DOM + fonts to be ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
