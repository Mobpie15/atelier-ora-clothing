/**
 * ATELIER ORA // 3D GARMENT STUDIO ENGINE (Three.js r128 + GLTFLoader)
 * Photorealistic 3D Luxury Heavyweight Hoodie Visualizer
 * - Authentic 3D garment mesh with real cloth folds, draped hood & tailored sleeves
 * - Real-time color swatches (Oatmeal, Olive, Espresso, Terracotta, Camel)
 * - Micro-textured 500 GSM loopback cotton fleece bump mapping
 * - Touch-optimized 360 orbit (pan-y compatible for smooth mobile scrolling)
 */

(function () {
  'use strict';

  const container = document.getElementById('three-garment-container');
  if (!container || typeof THREE === 'undefined') return;

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || 460;

  const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
  camera.position.set(0, 0.2, 5.2);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // -------------------------------------------------------------
  // 1. PROCEDURAL 500 GSM LOOPBACK COTTON BUMP TEXTURE
  // -------------------------------------------------------------
  function createFabricTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 512, 512);

    const imgData = ctx.getImageData(0, 0, 512, 512);
    const data = imgData.data;

    for (let y = 0; y < 512; y++) {
      for (let x = 0; x < 512; x++) {
        const idx = (y * 512 + x) * 4;
        // French Terry micro loop knit
        const knit = Math.sin(x * 1.57) * Math.cos(y * 1.57) * 16;
        // Natural slub yarn variation
        const slub = (Math.sin(x * 0.25 + y * 0.35) + Math.cos(x * 0.35 - y * 0.2)) * 10;
        const noise = (Math.random() - 0.5) * 18;
        const val = Math.min(255, Math.max(0, 128 + knit + slub + noise));

        data[idx] = val;
        data[idx + 1] = val;
        data[idx + 2] = val;
        data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(8, 8);
    return tex;
  }

  const fabricBumpTex = createFabricTexture();

  // -------------------------------------------------------------
  // 2. STUDIO LIGHTING RIG (Balanced for Natural Fabric Contrast)
  // -------------------------------------------------------------
  const ambientLight = new THREE.AmbientLight(0xf2ebd9, 0.65);
  scene.add(ambientLight);

  // Key Studio Light (Warm white highlight from top-right)
  const keyLight = new THREE.DirectionalLight(0xfffaef, 1.45);
  keyLight.position.set(4.5, 6.0, 4.5);
  scene.add(keyLight);

  // Cool Studio Fill Light (Softens contrast on left folds without blowing out shadows)
  const fillLight = new THREE.DirectionalLight(0xcfd7e2, 0.75);
  fillLight.position.set(-4.5, -0.5, 3.5);
  scene.add(fillLight);

  // Crisp Warm Rim Light (Traces the shoulders & hood silhouette)
  const rimLight = new THREE.DirectionalLight(0xffecd5, 1.35);
  rimLight.position.set(0, 5.0, -4.5);
  scene.add(rimLight);

  // Under Bounce Light
  const underLight = new THREE.DirectionalLight(0xb5a896, 0.45);
  underLight.position.set(0, -4.0, 2.0);
  scene.add(underLight);

  // Pedestal & Contact Shadow Grounding
  const pedestalGeom = new THREE.CylinderGeometry(2.3, 2.45, 0.16, 54);
  const pedestalMat = new THREE.MeshStandardMaterial({
    color: 0x443f38,
    roughness: 0.88,
    metalness: 0.08
  });
  const pedestal = new THREE.Mesh(pedestalGeom, pedestalMat);
  pedestal.position.y = -2.05;
  scene.add(pedestal);

  // Soft Circular Ground Shadow
  function createShadowDisc() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
    grad.addColorStop(0, 'rgba(25, 23, 20, 0.50)');
    grad.addColorStop(0.5, 'rgba(25, 23, 20, 0.20)');
    grad.addColorStop(1, 'rgba(25, 23, 20, 0.0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    const tex = new THREE.CanvasTexture(canvas);
    const geom = new THREE.PlaneGeometry(3.5, 3.5);
    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      depthWrite: false
    });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -1.96;
    return mesh;
  }

  const shadowMesh = createShadowDisc();
  if (shadowMesh) scene.add(shadowMesh);

  // -------------------------------------------------------------
  // 3. MODEL CATALOG — one studio, many garments.
  //    recolor: single fabric material tinted per swatch (hoodie).
  //    variants: factory colorways baked in the GLB (KHR_materials_variants
  //    parsed manually — the bundled r128 loader predates that extension).
  // -------------------------------------------------------------
  const MODELS = {
    hoodie: {
      file: 'assets/models/hoodie.glb',
      title: '500 GSM Heavyweight Boxy Hoodie',
      price: 260,
      image: 'assets/images/garment-hoodie-oatmeal.jpg',
      mode: 'recolor',
      normSize: 3.8, yOff: 0.15, camZ: 5.2,
      swatches: [
        { id: 'oatmeal', label: 'Oatmeal Heather', hex: 0xd0c7b5, css: '#ded8cb' },
        { id: 'olive', label: 'Vintage Washed Olive', hex: 0x525642, css: '#5a5e48' },
        { id: 'espresso', label: 'Deep Espresso Noir', hex: 0x1f1d1b, css: '#272422' },
        { id: 'terracotta', label: 'Terracotta Clay', hex: 0x94503c, css: '#a05943' },
        { id: 'camel', label: 'Warm Camel', hex: 0xad8b65, css: '#b9966f' }
      ],
      colorLabels: {
        oatmeal: 'Oatmeal Heather', olive: 'Vintage Washed Olive',
        espresso: 'Deep Espresso Noir', terracotta: 'Terracotta Clay', camel: 'Warm Camel Wool'
      },
      sizes: ['S (US 36)', 'M (US 38)', 'L (US 40)', 'XL (US 42)']
    },
    sneaker: {
      file: 'assets/models/sneaker.glb',
      title: 'Court Sneaker · Full-Grain',
      price: 190,
      image: 'assets/images/garment-boots-model.jpg',
      mode: 'variants',
      normSize: 3.1, yOff: -0.1, camZ: 4.6,
      swatches: [
        { id: 'midnight', label: 'Midnight Knit', css: '#245a7d' },
        { id: 'beach', label: 'Beach Sand', css: '#d8c49a' },
        { id: 'street', label: 'Street Grey', css: '#6b6f75' }
      ],
      colorLabels: { midnight: 'Midnight Knit', beach: 'Beach Sand', street: 'Street Grey' },
      sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11']
    }
  };

  let currentModelId = 'hoodie';
  let currentColorId = 'oatmeal';

  const fabricMaterial = new THREE.MeshStandardMaterial({
    color: MODELS.hoodie.swatches[0].hex,
    roughness: 0.86,
    metalness: 0.02,
    bumpMap: fabricBumpTex,
    bumpScale: 0.020,
    side: THREE.DoubleSide
  });

  // -------------------------------------------------------------
  // 4. GENERIC GARMENT LOADER (auto-center + normalize + material mode)
  // -------------------------------------------------------------
  const garmentGroup = new THREE.Group();
  scene.add(garmentGroup);

  let garmentMeshes = [];
  let variantMaps = []; // [{material, texture}] for mode:'variants'
  const loader = new THREE.GLTFLoader();

  function clearGarment() {
    garmentGroup.traverse(function (child) {
      if (child.isMesh) {
        if (child.geometry) child.geometry.dispose();
      }
    });
    while (garmentGroup.children.length) garmentGroup.remove(garmentGroup.children[0]);
    garmentMeshes = [];
    variantMaps = [];
  }

  function placeModel(model, cfg) {
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const scale = cfg.normSize / Math.max(size.x, size.y, size.z);
    model.scale.setScalar(scale);
    model.position.x = -center.x * scale;
    model.position.y = -center.y * scale + cfg.yOff;
    model.position.z = -center.z * scale;
    garmentGroup.add(model);
    camera.position.z = cfg.camZ;
    camera.updateProjectionMatrix();
  }

  /** Read KHR_materials_variants mapping + diffuse textures straight from the
   *  GLB bytes (no decoder upgrade needed on this old loader). */
  function parseVariantMaps(arrayBuffer) {
    const maps = [];
    try {
      const dv = new DataView(arrayBuffer);
      const jsonLen = dv.getUint32(12, true);
      const json = JSON.parse(new TextDecoder().decode(new Uint8Array(arrayBuffer, 20, jsonLen)));
      const variants = (((json.extensions || {}).KHR_materials_variants || {}).variants || []).map(function (v) { return v.name; });
      if (!variants.length) return maps;
      const mesh = (json.meshes || [])[0];
      const mappings = ((((mesh.primitives || [])[0].extensions || {}).KHR_materials_variants || {}).mappings || []);
      const texForMaterial = function (mi) {
        const m = (json.materials || [])[mi] || {};
        const bct = (m.pbrMetallicRoughness || {}).baseColorTexture || {};
        const t = (json.textures || [])[bct.index === undefined ? -1 : bct.index] || {};
        if (t.source !== undefined) return t.source;
        const ext = t.extensions || {};
        if (ext.EXT_texture_webp && ext.EXT_texture_webp.source !== undefined) return ext.EXT_texture_webp.source;
        if (ext.KHR_texture_basisu && ext.KHR_texture_basisu.source !== undefined) return ext.KHR_texture_basisu.source;
        return -1;
      };
      const imageBytes = function (ii) {
        const img = (json.images || [])[ii] || {};
        const bv = (json.bufferViews || [])[img.bufferView || 0] || {};
        const start = 12 + 8 + jsonLen + (bv.byteOffset || 0);
        // NOTE: assumes single BIN chunk at file offset (standard .glb)
        const binStart = 20 + jsonLen + 8;
        return { bytes: arrayBuffer.slice(binStart + (bv.byteOffset || 0), binStart + (bv.byteOffset || 0) + (bv.byteLength || 0)), mime: img.mimeType || 'image/png' };
      };
      mappings.forEach(function (mp) {
        (mp.variants || []).forEach(function (vi) {
          maps.push({ variant: variants[vi] || ('v' + vi), image: texForMaterial(mp.material) });
        });
      });
      maps._blobs = {};
      maps.forEach(function (mp) {
        if (mp.image >= 0 && !maps._blobs[mp.image]) {
          const b = imageBytes(mp.image);
          maps._blobs[mp.image] = URL.createObjectURL(new Blob([b.bytes], { type: b.mime }));
        }
      });
    } catch (e) {
      console.warn('variant parse failed:', e);
    }
    return maps;
  }

  function applyVariant(variantId) {
    const cfg = MODELS[currentModelId];
    const hit = variantMaps.filter(function (m) { return m.variant === variantId; })[0];
    if (!hit || hit.image === undefined || hit.image < 0) return;
    const url = (variantMaps._blobs || {})[hit.image];
    if (!url) return;
    new THREE.TextureLoader().load(url, function (tex) {
      tex.encoding = THREE.sRGBEncoding;
      tex.flipY = false; // glTF UV convention (GLTFLoader does the same)
      garmentMeshes.forEach(function (mesh) {
        if (!mesh.userData.baseMat) mesh.userData.baseMat = mesh.material;
        mesh.material = mesh.userData.baseMat.clone();
        mesh.material.map = tex;
        mesh.material.needsUpdate = true;
      });
    });
  }

  let loadGen = 0;
  let modelReady = false;
  let pendingColor = null;

  function loadModel(id) {
    const cfg = MODELS[id];
    if (!cfg) return;
    const gen = ++loadGen;
    modelReady = false;
    pendingColor = null;
    currentModelId = id;
    clearGarment();
    targetRotationY = 0;
    targetRotationX = 0;
    fetch(cfg.file).then(function (r) { return r.arrayBuffer(); }).then(function (buf) {
      if (gen !== loadGen) return; // superseded
      if (cfg.mode === 'variants') variantMaps = parseVariantMaps(buf);
      loader.parse(buf, '', function (gltf) {
        if (gen !== loadGen) return; // user switched mid-load
        const model = gltf.scene;
        model.traverse(function (child) {
          if (child.isMesh) {
            if (cfg.mode === 'recolor') child.material = fabricMaterial;
            child.castShadow = true;
            child.receiveShadow = true;
            garmentMeshes.push(child);
          }
        });
        placeModel(model, cfg);
        modelReady = true;
        const badge = container.querySelector('.loading-model-chip');
        if (badge) badge.remove();
        if (pendingColor) {
          const c = pendingColor;
          pendingColor = null;
          setColor(c);
        }
      }, function (error) {
        console.warn('GLTF load failed:', error);
      });
    }).catch(function (e) {
      console.warn('model fetch failed:', e);
    });
  }

  // -------------------------------------------------------------
  // 5. INTERACTION: 360 ORBIT, MOBILE TOUCH, SWATCHES & WIND
  // -------------------------------------------------------------
  let isDragging = false;
  let prevMouse = { x: 0, y: 0 };
  let startTouch = { x: 0, y: 0 };
  let isHorizontalDrag = false;
  let targetRotationY = 0;
  let targetRotationX = 0;
  let currentRotationY = 0;
  let currentRotationX = 0;
  let isWindActive = true;
  let isWireframeActive = false;

  function onPointerDown(e) {
    isDragging = true;
    const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0].clientY) || 0;
    prevMouse = { x: clientX, y: clientY };
    startTouch = { x: clientX, y: clientY };
    isHorizontalDrag = false;
  }

  function onPointerMove(e) {
    if (!isDragging) return;

    const isTouch = e.touches && e.touches.length > 0;
    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;

    if (isTouch && !isHorizontalDrag) {
      const totalDx = Math.abs(clientX - startTouch.x);
      const totalDy = Math.abs(clientY - startTouch.y);

      // If user is scrolling vertically, immediately yield to native browser scroll
      if (totalDy > 6 && totalDy >= totalDx) {
        isDragging = false;
        return;
      }
      // If user clearly drags horizontally, engage 3D garment rotation
      if (totalDx > 10 && totalDx > totalDy * 1.2) {
        isHorizontalDrag = true;
      } else {
        return; // Don't rotate until deliberate horizontal intent is confirmed
      }
    }

    const deltaX = clientX - prevMouse.x;
    const deltaY = clientY - prevMouse.y;

    targetRotationY += deltaX * 0.008;
    targetRotationX += deltaY * 0.005;
    targetRotationX = Math.max(-0.35, Math.min(0.35, targetRotationX));
    prevMouse = { x: clientX, y: clientY };
  }

  function onPointerUp() {
    isDragging = false;
    isHorizontalDrag = false;
  }

  container.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  container.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerUp, { passive: true });

  // ---- Studio UI: swatches + model tabs (rebuilt per garment) ----
  const activeColorLabel = document.getElementById('active-swatch-name');

  function setColor(colorName) {
    const cfg = MODELS[currentModelId];
    const sw = cfg.swatches.filter(function (s) { return s.id === colorName; })[0];
    if (!sw) return;
    currentColorId = colorName;
    if (!modelReady) {
      // model still loading: remember, apply the moment it lands
      pendingColor = colorName;
    } else if (cfg.mode === 'recolor') {
      fabricMaterial.color.setHex(sw.hex);
    } else {
      applyVariant(colorName);
    }
    document.querySelectorAll('.color-swatch-btn').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-color') === colorName);
    });
    if (activeColorLabel) activeColorLabel.textContent = colorName.toUpperCase();
    const ctaBtn = document.getElementById('btn-add-3d-garment');
    if (ctaBtn) ctaBtn.setAttribute('data-color', colorName);
    const ctaLabel = document.getElementById('studio-cta-label');
    if (ctaLabel) ctaLabel.innerHTML = 'ADD CONFIGURED 3D GARMENT &bull; $' + cfg.price;
    syncStudioModel();
  }

  function syncStudioModel() {
    const cfg = MODELS[currentModelId];
    window.__studioModel = {
      id: currentModelId, title: cfg.title, price: cfg.price,
      image: cfg.image, colorId: currentColorId,
      colorLabels: cfg.colorLabels
    };
  }

  function rebuildStudioUI() {
    const cfg = MODELS[currentModelId];
    const title = document.getElementById('studio-model-title');
    if (title) title.textContent = cfg.title;
    const price = document.getElementById('studio-model-price');
    if (price) price.textContent = '$' + cfg.price + ' USD';
    const wrap = document.getElementById('studio-swatches');
    if (wrap) {
      wrap.innerHTML = '';
      cfg.swatches.forEach(function (sw, i) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'color-swatch-btn' + (i === 0 ? ' active' : '');
        btn.setAttribute('data-color', sw.id);
        btn.title = sw.label;
        if (sw.css) btn.style.background = sw.css;
        btn.addEventListener('click', function () { setColor(sw.id); });
        wrap.appendChild(btn);
      });
    }
    const sizeSel = document.getElementById('select-3d-size');
    if (sizeSel) {
      sizeSel.innerHTML = '';
      cfg.sizes.forEach(function (s, i) {
        const o = document.createElement('option');
        o.value = s; o.textContent = s;
        if (i === 0) o.selected = true;
        sizeSel.appendChild(o);
      });
    }
    document.querySelectorAll('.model-tab-btn').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-studio-model') === currentModelId);
    });
    syncStudioModel();
  }

  document.querySelectorAll('.model-tab-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const id = btn.getAttribute('data-studio-model');
      if (!id || id === currentModelId) return;
      currentModelId = id;
      currentColorId = MODELS[id].swatches[0].id;
      if (MODELS[id].mode === 'recolor') fabricMaterial.color.setHex(MODELS[id].swatches[0].hex);
      rebuildStudioUI();
      loadModel(id);
      setColor(currentColorId);
    });
  });

  // NOTE: boot call lives at the end of this file (after rotation vars).

  // Wind Sway Toggle
  const windBtn = document.getElementById('btn-toggle-wind');
  if (windBtn) {
    windBtn.addEventListener('click', () => {
      isWindActive = !isWindActive;
      windBtn.classList.toggle('active', isWindActive);
      const span = windBtn.querySelector('span');
      if (span) span.textContent = isWindActive ? 'WIND DRAPE: ON' : 'WIND DRAPE: OFF';
    });
  }

  // CAD Wireframe Toggle
  const wireBtn = document.getElementById('btn-toggle-wireframe');
  if (wireBtn) {
    wireBtn.addEventListener('click', () => {
      isWireframeActive = !isWireframeActive;
      wireBtn.classList.toggle('active', isWireframeActive);
      fabricMaterial.wireframe = isWireframeActive;
      garmentMeshes.forEach(function (mesh) {
        if (mesh.material) mesh.material.wireframe = isWireframeActive;
      });
      const span = wireBtn.querySelector('span');
      if (span) span.textContent = isWireframeActive ? 'CAD SEAMS: ON' : 'CAD SEAMS: OFF';
    });
  }

  // Camera Reset
  const resetBtn = document.getElementById('btn-reset-3d');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      targetRotationY = 0;
      targetRotationX = 0;
      setColor(MODELS[currentModelId].swatches[0].id);
    });
  }

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    if (!isDragging) {
      targetRotationY += 0.003;
    }

    currentRotationY += (targetRotationY - currentRotationY) * 0.08;
    currentRotationX += (targetRotationX - currentRotationX) * 0.08;

    garmentGroup.rotation.y = currentRotationY;
    garmentGroup.rotation.x = currentRotationX;

    if (isWindActive) {
      const sway = Math.sin(time * 2.0) * 0.025;
      garmentGroup.position.y = Math.sin(time * 1.6) * 0.04;
      garmentGroup.position.x = sway * 0.3;
    } else {
      garmentGroup.position.y = 0;
      garmentGroup.position.x = 0;
    }

    renderer.render(scene, camera);
  }

  animate();

  // Responsive Viewport Resize
  function onResize() {
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight || (window.innerWidth <= 768 ? 380 : 540);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  window.addEventListener('resize', onResize);

  // Expose global helpers
  window.set3DGarmentColor = setColor;
  window.__variantInfo = function () {
    return { n: variantMaps.length, blobs: Object.keys(variantMaps._blobs || {}), first: variantMaps[0] || null, meshes: garmentMeshes.length };
  };

  // boot: hoodie first (same default as before)
  rebuildStudioUI();
  loadModel('hoodie');
})();
