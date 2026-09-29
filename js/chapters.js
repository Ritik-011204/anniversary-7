/* ================================================================
 *  chapters.js — All 9 Chapter 3D Scenes + ScrollTrigger Animations
 *
 *  Each chapter:
 *    • Creates its Three.js Group + objects
 *    • Registers GSAP ScrollTrigger animations
 *    • Registers per-frame update callbacks
 *
 *  The chapter system adapts object counts to the device tier
 *  automatically via APP.Scene.perfTier().
 * ================================================================ */

window.APP = window.APP || {};

APP.Chapters = (function () {

  var S = null;           // shorthand for APP.Scene (set in init)
  var scene, camera;
  var groups = {};        // chapter THREE.Groups
  var isReduced = false;

  /* ============================================================
   *  OPENING  —  "7 Years… and still you"
   * ============================================================ */
  function initOpening() {
    /* DOM animation: fade-in hero elements */
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#opening',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1
      }
    });

    /* Entrance animations (not scroll-linked, plays on load) */
    var entrance = gsap.timeline({ delay: 0.5 });
    entrance
      .from('.hero-number', { opacity: 0, scale: 0.6, duration: 1.4, ease: 'expo.out' })
      .from('.hero-word',   { opacity: 0, y: 30, duration: 1, ease: 'power3.out' }, '-=0.6')
      .to('.hero-subtitle', { opacity: 1, duration: 1, ease: 'power2.out' }, '-=0.4')
      .to('.hero-tagline',  { opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.4')
      .to('.scroll-hint',   { opacity: 1, duration: 0.6 }, '-=0.2');

    /* Scroll-linked: camera dolly + text fade */
    tl.to(camera.position, { z: 22, ease: 'none' }, 0)
      .to('.hero-title',    { opacity: 0, y: -40, ease: 'none' }, 0.3)
      .to('.hero-subtitle', { opacity: 0, ease: 'none' }, 0.3)
      .to('.hero-tagline',  { opacity: 0, ease: 'none' }, 0.4)
      .to('.scroll-hint',   { opacity: 0, ease: 'none' }, 0.1);
  }

  /* ============================================================
   *  CHAPTER 01  —  The Beginning
   *  Floating polaroids that approach the camera.
   * ============================================================ */
  function initChapter01() {
    var g = new THREE.Group();
    g.visible = false;
    groups.ch01 = g;
    scene.add(g);

    var photos = CONFIG.photos.beginning;
    var maxPhotos = Math.min(photos.length, S.perfTier().maxPhotos);

    S.loadTextures(photos.slice(0, maxPhotos)).then(function (textures) {
      textures.forEach(function (tex, i) {
        var scale = i === 0 ? 1.3 : 0.8;
        var p = S.createPolaroid(tex, scale);
        if (i === 0) {
          p.position.set(0, 0, 0);
        } else {
          var angle = ((i - 1) / (textures.length - 1)) * Math.PI * 2;
          p.position.set(Math.cos(angle) * 5, Math.sin(angle) * 2.5, -2 - Math.random() * 3);
          p.rotation.z = (Math.random() - 0.5) * 0.2;
        }
        p.userData.baseY = p.position.y;
        p.userData.idx   = i;
        g.add(p);
      });
    });

    /* Floating animation */
    S.onUpdate(function (elapsed) {
      if (!g.visible) return;
      g.children.forEach(function (child) {
        var i = child.userData.idx || 0;
        child.position.y = child.userData.baseY + Math.sin(elapsed * 0.6 + i * 1.2) * 0.15;
        child.rotation.z += Math.sin(elapsed * 0.4 + i) * 0.0003;
      });
    });

    /* ScrollTrigger */
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#chapter-01',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onEnter:     function () { g.visible = true; },
        onLeave:     function () { g.visible = false; },
        onEnterBack: function () { g.visible = true; },
        onLeaveBack: function () { g.visible = false; }
      }
    });

    tl.to(camera.position, { z: 14, ease: 'none' }, 0);

    /* Fade-in chapter text */
    gsap.utils.toArray('#chapter-01 .fade-in').forEach(function (el, i) {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 1,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'top 50%',
          scrub: 1
        }
      });
    });
  }

  /* ============================================================
   *  CHAPTER 02  —  Our Memories (3D gallery orbit)
   * ============================================================ */
  function initChapter02() {
    var g = new THREE.Group();
    g.visible = false;
    groups.ch02 = g;
    scene.add(g);

    var photos = CONFIG.photos.memories;
    var maxPhotos = Math.min(photos.length, S.perfTier().maxPhotos);

    S.loadTextures(photos.slice(0, maxPhotos)).then(function (textures) {
      var count = textures.length;
      textures.forEach(function (tex, i) {
        var p = S.createPolaroid(tex, 0.85);
        var angle = (i / count) * Math.PI * 2;
        var radius = 7;
        p.position.set(
          Math.cos(angle) * radius,
          Math.sin(angle * 0.5) * 2,
          Math.sin(angle) * radius
        );
        p.rotation.y = -angle + Math.PI;
        p.userData.angle = angle;
        p.userData.idx = i;
        g.add(p);
      });
    });

    /* Slow orbit */
    S.onUpdate(function (elapsed) {
      if (!g.visible) return;
      g.rotation.y = elapsed * 0.05; // slow orbit
    });

    /* ScrollTrigger */
    gsap.timeline({
      scrollTrigger: {
        trigger: '#chapter-02',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onEnter:     function () { g.visible = true; },
        onLeave:     function () { g.visible = false; },
        onEnterBack: function () { g.visible = true; },
        onLeaveBack: function () { g.visible = false; }
      }
    })
    .to(camera.position, { z: 18, y: 1, ease: 'none' }, 0)
    .to(camera.position, { z: 14, y: 0, ease: 'none' }, 0.5);

    /* Text fade-in */
    gsap.utils.toArray('#chapter-02 .fade-in').forEach(function (el) {
      gsap.to(el, {
        opacity: 1, y: 0,
        scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 50%', scrub: 1 }
      });
    });
  }

  /* ============================================================
   *  CHAPTER 03  —  Us  (photo heart)
   * ============================================================ */
  function initChapter03() {
    var g = new THREE.Group();
    g.visible = false;
    groups.ch03 = g;
    scene.add(g);

    var photos = CONFIG.photos.us;
    var maxPhotos = Math.min(photos.length, S.perfTier().maxPhotos);
    var heartPts = S.getHeartPositions(maxPhotos, 0.28);

    S.loadTextures(photos.slice(0, maxPhotos)).then(function (textures) {
      textures.forEach(function (tex, i) {
        var p = S.createPolaroid(tex, 0.5);
        var pt = heartPts[i];
        p.position.set(pt.x, pt.y, pt.z);
        p.userData.idx = i;
        g.add(p);
      });
    });

    /* Slow rotation */
    S.onUpdate(function (elapsed) {
      if (!g.visible) return;
      g.rotation.y = Math.sin(elapsed * 0.15) * 0.3;
    });

    /* ScrollTrigger */
    gsap.timeline({
      scrollTrigger: {
        trigger: '#chapter-03',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onEnter:     function () { g.visible = true; },
        onLeave:     function () { g.visible = false; },
        onEnterBack: function () { g.visible = true; },
        onLeaveBack: function () { g.visible = false; }
      }
    })
    .to(camera.position, { z: 20, ease: 'none' }, 0)
    .to(camera.position, { z: 12, ease: 'none' }, 0.3);

    /* Text */
    gsap.utils.toArray('#chapter-03 .fade-in').forEach(function (el) {
      gsap.to(el, {
        opacity: 1, y: 0,
        scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 50%', scrub: 1 }
      });
    });
  }

  /* ============================================================
   *  CHAPTER 04  —  The Chaos 😂
   *  Mostly DOM (chat bubbles). Small 3D playful elements.
   * ============================================================ */
  function initChapter04() {
    var g = new THREE.Group();
    g.visible = false;
    groups.ch04 = g;
    scene.add(g);

    /* Small floating emoji-like spheres */
    var colors = [0xe86b8a, 0xf5a67e, 0x6b3fa0, 0xd4a653];
    for (var i = 0; i < 8; i++) {
      var geo = new THREE.SphereGeometry(0.15 + Math.random() * 0.15, 8, 8);
      var mat = new THREE.MeshBasicMaterial({
        color: colors[i % colors.length],
        transparent: true,
        opacity: 0.4
      });
      var sphere = new THREE.Mesh(geo, mat);
      sphere.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 10
      );
      sphere.userData.basePos = sphere.position.clone();
      sphere.userData.idx = i;
      g.add(sphere);
    }

    /* Add a couple floating polaroids */
    var chaosPhotos = CONFIG.photos.chaos;
    S.loadTextures(chaosPhotos.slice(0, 2)).then(function (textures) {
      textures.forEach(function (tex, i) {
        var p = S.createPolaroid(tex, 0.65);
        p.position.set(i === 0 ? -6 : 6, (Math.random() - 0.5) * 3, -3);
        p.rotation.z = (Math.random() - 0.5) * 0.3;
        p.userData.baseY = p.position.y;
        p.userData.idx = i + 10;
        g.add(p);
      });
    });

    /* Playful bouncy animation */
    S.onUpdate(function (elapsed) {
      if (!g.visible) return;
      g.children.forEach(function (child) {
        var i = child.userData.idx || 0;
        if (child.userData.basePos) {
          child.position.y = child.userData.basePos.y + Math.sin(elapsed * 1.2 + i * 0.8) * 0.4;
          child.position.x = child.userData.basePos.x + Math.cos(elapsed * 0.8 + i) * 0.2;
        } else if (child.userData.baseY !== undefined) {
          child.position.y = child.userData.baseY + Math.sin(elapsed * 0.8 + i) * 0.3;
          child.rotation.z += Math.sin(elapsed + i) * 0.001;
        }
      });
    });

    /* ScrollTrigger */
    gsap.timeline({
      scrollTrigger: {
        trigger: '#chapter-04',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onEnter:     function () { g.visible = true; },
        onLeave:     function () { g.visible = false; },
        onEnterBack: function () { g.visible = true; },
        onLeaveBack: function () { g.visible = false; }
      }
    })
    .to(camera.position, { z: 16, ease: 'none' }, 0);

    /* Chat bubble stagger animation */
    gsap.utils.toArray('.chat-bubble').forEach(function (el, i) {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 0.6,
        delay: i * 0.08,
        scrollTrigger: { trigger: '#chat-container', start: 'top 80%', end: 'top 40%', scrub: 1 }
      });
    });

    /* Text */
    gsap.utils.toArray('#chapter-04 .fade-in').forEach(function (el) {
      gsap.to(el, {
        opacity: 1, y: 0,
        scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 50%', scrub: 1 }
      });
    });
  }

  /* ============================================================
   *  CHAPTER 05  —  The Hard Days
   *  Rain activates, scene darkens.
   * ============================================================ */
  function initChapter05() {
    var g = new THREE.Group();
    g.visible = false;
    groups.ch05 = g;
    scene.add(g);

    /* A single dim polaroid */
    var dimPhoto = CONFIG.photos.beginning[0] || { src: 'assets/images/photo01.jpg' };
    S.loadTexture(typeof dimPhoto === 'string' ? dimPhoto : dimPhoto.src, 5).then(function (tex) {
      var p = S.createPolaroid(tex, 1.0);
      p.position.set(0, 0, -2);
      p.material && (p.traverse(function (child) {
        if (child.material && child.material.map) {
          child.material.transparent = true;
          child.material.opacity = 0.5;
        }
      }));
      p.userData.baseY = 0;
      p.userData.idx = 0;
      g.add(p);
    });

    /* Subtle floating */
    S.onUpdate(function (elapsed) {
      if (!g.visible) return;
      g.children.forEach(function (child) {
        child.position.y = (child.userData.baseY || 0) + Math.sin(elapsed * 0.25) * 0.1;
      });
    });

    /* ScrollTrigger — rain + mood shift */
    var rain = S.getRain();
    var stars = S.getStars();

    gsap.timeline({
      scrollTrigger: {
        trigger: '#chapter-05',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onEnter:     function () { g.visible = true; },
        onLeave:     function () { g.visible = false; },
        onEnterBack: function () { g.visible = true; },
        onLeaveBack: function () { g.visible = false; }
      }
    })
    .to(camera.position, { z: 18, ease: 'none' }, 0)
    // Activate rain
    .to(rain ? rain.material : {}, { opacity: 0.35, ease: 'none' }, 0)
    .to(rain ? rain.material : {}, { opacity: 0, ease: 'none' }, 0.8)
    // Dim stars
    .to(stars ? stars.material : {}, { opacity: 0.25, ease: 'none' }, 0)
    .to(stars ? stars.material : {}, { opacity: 0.7, ease: 'none' }, 0.8);

    /* Text */
    gsap.utils.toArray('#chapter-05 .fade-in').forEach(function (el) {
      gsap.to(el, {
        opacity: 1, y: 0,
        scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 50%', scrub: 1 }
      });
    });
  }

  /* ============================================================
   *  CHAPTER 06  —  7 Years Later  (the big "7" reveal)
   *  Photos scatter → form the giant digit 7.
   * ============================================================ */
  function initChapter06() {
    var g = new THREE.Group();
    g.visible = false;
    groups.ch06 = g;
    scene.add(g);

    var photos = CONFIG.photos.sevenYears;
    var targetPts = S.getSevenPositions(2.8);
    var maxPhotos = Math.min(photos.length, targetPts.length);

    S.loadTextures(photos.slice(0, maxPhotos)).then(function (textures) {
      textures.forEach(function (tex, i) {
        var p = S.createPolaroid(tex, 0.55);
        var target = targetPts[i] || { x: 0, y: 0, z: 0 };
        // Start at random scattered positions
        p.position.set(
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 15
        );
        p.rotation.set(
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.5
        );
        p.userData.target = target;
        p.userData.startPos = p.position.clone();
        p.userData.startRot = p.rotation.clone();
        p.userData.idx = i;
        g.add(p);
      });
    });

    /* ScrollTrigger — formation animation */
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#chapter-06',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: function (self) {
          if (!g.visible) return;
          var p = self.progress;
          // Map 0–0.7 to formation progress
          var formProgress = Math.min(p / 0.7, 1);
          formProgress = formProgress * formProgress * (3 - 2 * formProgress); // smoothstep

          g.children.forEach(function (child) {
            if (!child.userData.target) return;
            var s = child.userData.startPos;
            var t = child.userData.target;
            var sr = child.userData.startRot;
            child.position.x = s.x + (t.x - s.x) * formProgress;
            child.position.y = s.y + (t.y - s.y) * formProgress;
            child.position.z = s.z + (t.z - s.z) * formProgress;
            child.rotation.x = sr.x * (1 - formProgress);
            child.rotation.y = sr.y * (1 - formProgress);
            child.rotation.z = sr.z * (1 - formProgress);
          });
        },
        onEnter:     function () { g.visible = true; },
        onLeave:     function () { g.visible = false; },
        onEnterBack: function () { g.visible = true; },
        onLeaveBack: function () { g.visible = false; }
      }
    });

    // Camera pulls back to reveal the "7"
    tl.to(camera.position, { z: 30, y: 0, ease: 'none' }, 0);

    /* Stats stagger */
    gsap.utils.toArray('#chapter-06 .stat').forEach(function (el, i) {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 0.8,
        scrollTrigger: {
          trigger: '#chapter-06 .stats',
          start: 'top 75%',
          end: 'top 40%',
          scrub: 1
        },
        delay: i * 0.15
      });
    });

    /* Text */
    gsap.utils.toArray('#chapter-06 .fade-in').forEach(function (el) {
      gsap.to(el, {
        opacity: 1, y: 0,
        scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 50%', scrub: 1 }
      });
    });
  }

  /* ============================================================
   *  CHAPTER 07  —  Still You
   *  Single large photo, warm glow.
   * ============================================================ */
  function initChapter07() {
    var g = new THREE.Group();
    g.visible = false;
    groups.ch07 = g;
    scene.add(g);

    var photo = CONFIG.photos.stillYou;
    var src = typeof photo === 'string' ? photo : photo.src;

    S.loadTexture(src, 7).then(function (tex) {
      var p = S.createPolaroid(tex, 1.5);
      p.position.set(0, 0, 0);
      p.userData.baseY = 0;
      p.userData.idx = 0;
      g.add(p);
    });

    /* Gentle float */
    S.onUpdate(function (elapsed) {
      if (!g.visible) return;
      g.children.forEach(function (child) {
        child.position.y = (child.userData.baseY || 0) + Math.sin(elapsed * 0.4) * 0.12;
        child.rotation.z = Math.sin(elapsed * 0.2) * 0.015;
      });
    });

    /* ScrollTrigger */
    gsap.timeline({
      scrollTrigger: {
        trigger: '#chapter-07',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onEnter:     function () { g.visible = true; },
        onLeave:     function () { g.visible = false; },
        onEnterBack: function () { g.visible = true; },
        onLeaveBack: function () { g.visible = false; }
      }
    })
    .to(camera.position, { z: 16, ease: 'none' }, 0);

    /* Text */
    gsap.utils.toArray('#chapter-07 .fade-in').forEach(function (el) {
      gsap.to(el, {
        opacity: 1, y: 0,
        scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 50%', scrub: 1 }
      });
    });
  }

  /* ============================================================
   *  FINALE  —  Happy Anniversary + Letter button
   * ============================================================ */
  function initFinale() {
    /* Warm glow particles intensify */
    var glow = S.getGlowParticles();

    gsap.timeline({
      scrollTrigger: {
        trigger: '#finale',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1
      }
    })
    .to(camera.position, { z: 20, ease: 'none' }, 0)
    .to(glow ? glow.material : {}, { opacity: 0.4, size: 0.6, ease: 'none' }, 0);

    /* Text fade-in */
    gsap.utils.toArray('#finale .fade-in').forEach(function (el) {
      gsap.to(el, {
        opacity: 1, y: 0,
        scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 50%', scrub: 1 }
      });
    });

    /* Button fade-in */
    gsap.to('#letter-btn', {
      opacity: 1, y: 0,
      scrollTrigger: { trigger: '#letter-btn', start: 'top 90%', end: 'top 70%', scrub: 1 }
    });
  }

  /* ============================================================
   *  INIT ALL CHAPTERS
   * ============================================================ */
  function init() {
    S = APP.Scene;
    scene  = APP.scene;
    camera = APP.camera;
    isReduced = S.isReducedMotion;

    if (isReduced) {
      /* In reduced-motion mode, just show text without 3D animations */
      document.querySelectorAll('.fade-in').forEach(function (el) {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      document.querySelectorAll('.stat').forEach(function (el) {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      var btn = document.getElementById('letter-btn');
      if (btn) { btn.style.opacity = '1'; btn.style.transform = 'none'; }
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    initOpening();
    initChapter01();
    initChapter02();
    initChapter03();
    initChapter04();
    initChapter05();
    initChapter06();
    initChapter07();
    initFinale();
  }

  return { init: init };

})();
