/* ================================================================
 *  scene.js — Three.js 3D Engine, Camera, Particles, Render Loop
 * ================================================================ */

window.APP = window.APP || {};

APP.Scene = (function () {

  var scene, camera, renderer, clock;
  var starField, heartParticles, rainSystem, glowParticles;
  var updateCallbacks = [];
  var isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----- helpers ----- */
  function isMobile()  { return window.innerWidth < 768; }
  function isTablet()  { return window.innerWidth >= 768 && window.innerWidth < 1024; }
  function perfTier()  {
    if (isMobile())  return CONFIG.performance.mobile;
    if (isTablet())  return CONFIG.performance.tablet;
    return CONFIG.performance.desktop;
  }

  /* ============================================================
   *  PLACEHOLDER TEXTURE GENERATOR
   *  Creates a gradient canvas texture when real photos are missing.
   * ============================================================ */
  var gradientPalettes = [
    ['#6b3fa0', '#e86b8a'], ['#e86b8a', '#f5a67e'],
    ['#0a0a3a', '#6b3fa0'], ['#f5a67e', '#d4a653'],
    ['#3a0a4a', '#e86b8a'], ['#1a0a3a', '#f5a67e'],
    ['#4a2080', '#e86b8a'], ['#0a1a3a', '#9b6fd0']
  ];

  function createPlaceholderTexture(w, h, idx) {
    var c = document.createElement('canvas');
    c.width  = w || 400;
    c.height = h || 520;
    var ctx = c.getContext('2d');
    var pal = gradientPalettes[(idx || 0) % gradientPalettes.length];
    var g = ctx.createLinearGradient(0, 0, c.width, c.height);
    g.addColorStop(0, pal[0]);
    g.addColorStop(1, pal[1]);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.font = (c.width * 0.28) + 'px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('♡', c.width / 2, c.height / 2);
    return new THREE.CanvasTexture(c);
  }

  function loadTexture(src, idx) {
    return new Promise(function (resolve) {
      new THREE.TextureLoader().load(
        src,
        function (tex) { resolve(tex); },
        undefined,
        function ()    { resolve(createPlaceholderTexture(400, 520, idx)); }
      );
    });
  }

  function loadTextures(photoArr) {
    return Promise.all(photoArr.map(function (p, i) {
      var s = typeof p === 'string' ? p : p.src;
      return loadTexture(s, i);
    }));
  }

  /* ============================================================
   *  CREATE POLAROID MESH
   *  A photo plane with a white border, grouped together.
   * ============================================================ */
  function createPolaroid(texture, scale) {
    scale = scale || 1;
    var pw = 1.8 * scale, ph = 2.2 * scale;
    var bw = 2.1 * scale, bh = 2.8 * scale;

    var group = new THREE.Group();

    // White border
    var borderGeo = new THREE.PlaneGeometry(bw, bh);
    var borderMat = new THREE.MeshBasicMaterial({ color: 0xf5f0e8, side: THREE.DoubleSide });
    var border = new THREE.Mesh(borderGeo, borderMat);
    border.position.z = -0.01;
    border.position.y = -0.15 * scale;   // extra space at bottom (polaroid look)
    group.add(border);

    // Photo
    var photoGeo = new THREE.PlaneGeometry(pw, ph);
    var photoMat = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    var photo = new THREE.Mesh(photoGeo, photoMat);
    photo.position.y = 0.1 * scale;
    group.add(photo);

    return group;
  }

  /* ============================================================
   *  PARTICLE SYSTEMS
   * ============================================================ */

  /* --- Star Field --- */
  function createStars(count) {
    var geo = new THREE.BufferGeometry();
    var positions = new Float32Array(count * 3);
    var sizes = new Float32Array(count);
    for (var i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 120;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
      sizes[i] = Math.random() * 2 + 0.5;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    var mat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.12,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
      depthWrite: false
    });
    starField = new THREE.Points(geo, mat);
    scene.add(starField);
  }

  /* --- Floating Heart Particles --- */
  function createHeartParticles(count) {
    var geo = new THREE.BufferGeometry();
    var positions = new Float32Array(count * 3);
    var velocities = [];
    for (var i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30 - 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
      velocities.push(Math.random() * 0.3 + 0.1);
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    var mat = new THREE.PointsMaterial({
      color: 0xe86b8a,
      size: 0.18,
      transparent: true,
      opacity: 0.35,
      sizeAttenuation: true,
      depthWrite: false
    });
    heartParticles = new THREE.Points(geo, mat);
    heartParticles._velocities = velocities;
    scene.add(heartParticles);
  }

  /* --- Rain Particles (Chapter 05) --- */
  function createRain(count) {
    var geo = new THREE.BufferGeometry();
    var positions = new Float32Array(count * 3);
    for (var i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = Math.random() * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    var mat = new THREE.PointsMaterial({
      color: 0x8090c0,
      size: 0.06,
      transparent: true,
      opacity: 0,      // starts invisible
      sizeAttenuation: true,
      depthWrite: false
    });
    rainSystem = new THREE.Points(geo, mat);
    scene.add(rainSystem);
  }

  /* --- Glow / Bokeh Particles --- */
  function createGlowParticles(count) {
    var geo = new THREE.BufferGeometry();
    var positions = new Float32Array(count * 3);
    for (var i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    var mat = new THREE.PointsMaterial({
      color: 0xf5a67e,
      size: 0.35,
      transparent: true,
      opacity: 0.15,
      sizeAttenuation: true,
      depthWrite: false
    });
    glowParticles = new THREE.Points(geo, mat);
    scene.add(glowParticles);
  }

  /* ----- Update particles each frame ----- */
  function updateParticles(elapsed, delta) {
    // Star twinkle
    if (starField) {
      var sp = starField.geometry.attributes.position.array;
      for (var i = 0; i < sp.length; i += 3) {
        sp[i + 1] += Math.sin(elapsed * 0.3 + i) * 0.0008;
      }
      starField.geometry.attributes.position.needsUpdate = true;
      starField.rotation.y = elapsed * 0.008;
    }

    // Floating hearts rise
    if (heartParticles) {
      var hp = heartParticles.geometry.attributes.position.array;
      var vel = heartParticles._velocities;
      for (var i = 0; i < hp.length / 3; i++) {
        hp[i * 3 + 1] += vel[i] * delta;
        hp[i * 3]     += Math.sin(elapsed + i) * 0.003;
        if (hp[i * 3 + 1] > 25) hp[i * 3 + 1] = -15;
      }
      heartParticles.geometry.attributes.position.needsUpdate = true;
    }

    // Rain fall
    if (rainSystem && rainSystem.material.opacity > 0) {
      var rp = rainSystem.geometry.attributes.position.array;
      for (var i = 0; i < rp.length; i += 3) {
        rp[i + 1] -= 0.4;
        if (rp[i + 1] < -10) rp[i + 1] = 30;
      }
      rainSystem.geometry.attributes.position.needsUpdate = true;
    }

    // Glow drift
    if (glowParticles) {
      glowParticles.rotation.y = elapsed * 0.01;
      glowParticles.rotation.x = Math.sin(elapsed * 0.05) * 0.05;
    }
  }

  /* ============================================================
   *  HEART SHAPE POSITIONS
   *  Returns array of {x, y, z} forming a heart curve.
   * ============================================================ */
  function getHeartPositions(count, scale) {
    var pts = [];
    for (var i = 0; i < count; i++) {
      var t = (i / count) * Math.PI * 2;
      var x = 16 * Math.pow(Math.sin(t), 3);
      var y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      pts.push({
        x: x * scale,
        y: y * scale,
        z: (Math.random() - 0.5) * scale * 3
      });
    }
    return pts;
  }

  /* ============================================================
   *  "7" SHAPE POSITIONS
   *  Returns array of {x, y} for photos forming the digit 7.
   * ============================================================ */
  function getSevenPositions(spacing) {
    spacing = spacing || 2.6;
    var grid = [
      [1,1,1,1,1],
      [0,0,0,0,1],
      [0,0,0,1,0],
      [0,0,0,1,0],
      [0,0,1,0,0],
      [0,0,1,0,0],
      [0,1,0,0,0],
      [0,1,0,0,0]
    ];
    var pts = [];
    var rows = grid.length, cols = grid[0].length;
    var ox = -(cols - 1) * spacing / 2;
    var oy =  (rows - 1) * spacing / 2;
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        if (grid[r][c]) {
          pts.push({
            x: ox + c * spacing,
            y: oy - r * spacing,
            z: 0
          });
        }
      }
    }
    return pts;
  }

  /* ============================================================
   *  INIT
   * ============================================================ */
  function init() {
    var canvas = document.getElementById('webgl-canvas');
    var perf   = perfTier();

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a1a, 0.012);

    camera = new THREE.PerspectiveCamera(
      60, window.innerWidth / window.innerHeight, 0.1, 500
    );
    camera.position.set(0, 0, 30);

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: !isMobile(),
      alpha: false,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, perf.pixelRatio));
    renderer.setClearColor(0x0a0a1a, 1);

    /* Lighting */
    scene.add(new THREE.AmbientLight(0x6b3fa0, 0.5));

    var dirLight = new THREE.DirectionalLight(0xf5a67e, 0.6);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    var pinkLight = new THREE.PointLight(0xe86b8a, 0.5, 50);
    pinkLight.position.set(-5, 5, 15);
    scene.add(pinkLight);

    /* Particles */
    if (!isReducedMotion) {
      createStars(perf.particles);
      createHeartParticles(Math.floor(perf.particles * 0.15));
      createRain(Math.floor(perf.particles * 0.5));
      createGlowParticles(Math.floor(perf.particles * 0.12));
    }

    clock = new THREE.Clock();

    window.addEventListener('resize', onResize);

    /* Public refs */
    APP.scene    = scene;
    APP.camera   = camera;
    APP.renderer = renderer;
    APP.clock    = clock;
  }

  function onResize() {
    var perf = perfTier();
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, perf.pixelRatio));
  }

  /* ----- Render / Animate ----- */
  var lastTime = 0;
  function animate() {
    requestAnimationFrame(animate);
    if (isReducedMotion) { renderer.render(scene, camera); return; }

    var now = performance.now() * 0.001;  // seconds
    var delta = Math.min(now - lastTime, 0.1); // clamp to avoid jumps
    lastTime = now;
    var elapsed = clock.getElapsedTime();

    updateParticles(elapsed, delta);

    for (var i = 0; i < updateCallbacks.length; i++) {
      updateCallbacks[i](elapsed, delta);
    }

    renderer.render(scene, camera);
  }

  function onUpdate(fn) { updateCallbacks.push(fn); }

  /* Public API */
  return {
    init: init,
    animate: animate,
    onUpdate: onUpdate,
    isMobile: isMobile,
    isTablet: isTablet,
    perfTier: perfTier,
    isReducedMotion: isReducedMotion,
    loadTexture: loadTexture,
    loadTextures: loadTextures,
    createPolaroid: createPolaroid,
    createPlaceholderTexture: createPlaceholderTexture,
    getHeartPositions: getHeartPositions,
    getSevenPositions: getSevenPositions,
    // expose for chapters
    getRain: function () { return rainSystem; },
    getStars: function () { return starField; },
    getHeartParticles: function () { return heartParticles; },
    getGlowParticles: function () { return glowParticles; }
  };
})();
