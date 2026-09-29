/* ================================================================
 *  ui.js — Navigation, Music Player, Letter Modal, Cursor Glow
 * ================================================================ */

window.APP = window.APP || {};

APP.UI = (function () {

  /* ============================================================
   *  NAVIGATION
   * ============================================================ */
  function initNav() {
    var hamburger = document.getElementById('nav-hamburger');
    var navLinks  = document.getElementById('nav-links');
    var nav       = document.getElementById('main-nav');
    var links     = navLinks.querySelectorAll('a');

    /* Hamburger toggle */
    hamburger.addEventListener('click', function () {
      var open = hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
    });

    /* Click a nav link → close menu & smooth scroll */
    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');

        var target = document.querySelector(link.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    /* Add "scrolled" class to nav when past first screen */
    var scrolledClass = 'scrolled';
    window.addEventListener('scroll', function () {
      if (window.scrollY > 80) nav.classList.add(scrolledClass);
      else nav.classList.remove(scrolledClass);
    }, { passive: true });

    /* Active chapter highlight */
    var sections = document.querySelectorAll('.chapter');
    function updateActive() {
      var scrollPos = window.scrollY + window.innerHeight * 0.4;
      sections.forEach(function (sec, i) {
        var top    = sec.offsetTop;
        var bottom = top + sec.offsetHeight;
        if (scrollPos >= top && scrollPos < bottom) {
          links.forEach(function (l) { l.classList.remove('active'); });
          if (links[i]) links[i].classList.add('active');
        }
      });
    }
    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
  }

  /* ============================================================
   *  SCROLL PROGRESS BAR
   * ============================================================ */
  function initProgressBar() {
    var bar = document.getElementById('scroll-progress-bar');
    window.addEventListener('scroll', function () {
      var scrollTop  = window.scrollY;
      var docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = pct + '%';
    }, { passive: true });
  }

  /* ============================================================
   *  MUSIC PLAYER
   * ============================================================ */
  function initMusic() {
    var btn = document.getElementById('music-btn');
    if (!CONFIG.music.enabled) { btn.hidden = true; return; }

    var audio = new Audio();
    audio.src  = CONFIG.music.src;
    audio.loop = true;
    audio.volume = 0.5;
    var playing = false;

    btn.addEventListener('click', function () {
      if (playing) {
        audio.pause();
        btn.classList.remove('playing');
        btn.setAttribute('aria-label', 'Play background music');
      } else {
        audio.play().catch(function () { /* browser blocked */ });
        btn.classList.add('playing');
        btn.setAttribute('aria-label', 'Pause background music');
      }
      playing = !playing;
    });
  }

  /* ============================================================
   *  LETTER MODAL
   * ============================================================ */
  function initLetter() {
    var modal    = document.getElementById('letter-modal');
    var body     = document.getElementById('letter-body');
    var openBtn  = document.getElementById('letter-btn');
    var closeBtn = modal.querySelector('.modal-close');
    var overlay  = modal.querySelector('.modal-overlay');

    /* Populate letter content from config */
    var lines = CONFIG.letter;
    body.innerHTML = '';
    lines.forEach(function (line) {
      var p = document.createElement('p');
      p.textContent = line || '\u00A0';   // non-breaking space for blank lines
      body.appendChild(p);
    });

    function openModal() {
      modal.hidden = false;
      // trigger reflow before adding class
      void modal.offsetHeight;
      modal.classList.add('visible');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }
    function closeModal() {
      modal.classList.remove('visible');
      document.body.style.overflow = '';
      setTimeout(function () { modal.hidden = true; }, 500);
    }

    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('visible')) closeModal();
    });
  }

  /* ============================================================
   *  CHAT BUBBLES (Chapter 04)
   *  Generates DOM from CONFIG.chatMessages
   * ============================================================ */
  function initChat() {
    var container = document.getElementById('chat-container');
    if (!container || !CONFIG.chatMessages) return;

    CONFIG.chatMessages.forEach(function (msg) {
      var div = document.createElement('div');
      div.className = 'chat-bubble chat-bubble--' + msg.sender;
      div.textContent = msg.text;
      container.appendChild(div);
    });
  }

  /* ============================================================
   *  CURSOR GLOW (desktop only)
   * ============================================================ */
  function initCursorGlow() {
    if (APP.Scene.isMobile() || APP.Scene.isTablet()) return;

    var glow = document.getElementById('cursor-glow');
    if (!glow) return;

    document.addEventListener('mousemove', function (e) {
      glow.style.left = e.clientX + 'px';
      glow.style.top  = e.clientY + 'px';
      glow.style.opacity = '1';
    });

    document.addEventListener('mouseleave', function () {
      glow.style.opacity = '0';
    });
  }

  /* ============================================================
   *  LOADING SCREEN
   * ============================================================ */
  function hideLoader() {
    var loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('hidden');
      setTimeout(function () { loader.style.display = 'none'; }, 900);
    }
  }

  /* ============================================================
   *  PUBLIC INIT
   * ============================================================ */
  function init() {
    initNav();
    initProgressBar();
    initMusic();
    initLetter();
    initChat();
    initCursorGlow();
  }

  return {
    init: init,
    hideLoader: hideLoader
  };

})();
