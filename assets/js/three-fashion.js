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
  // 3. COLOR SWATCHES & LUXURY FABRIC MATERIAL
  // -------------------------------------------------------------
  const SWATCH_COLORS = {
    oatmeal: 0xd0c7b5,
    olive: 0x525642,
    espresso: 0x1f1d1b,
    terracotta: 0x94503c,
    camel: 0xad8b65
  };

  let currentColorHex = SWATCH_COLORS.oatmeal;

  const fabricMaterial = new THREE.MeshStandardMaterial({
    color: currentColorHex,
    roughness: 0.86,
    metalness: 0.02,
    bumpMap: fabricBumpTex,
    bumpScale: 0.020,
    side: THREE.DoubleSide
  });

  // -------------------------------------------------------------
  // 4. LOAD AUTHENTIC 3D HOODIE MODEL (GLTF)
  // -------------------------------------------------------------
  const garmentGroup = new THREE.Group();
  scene.add(garmentGroup);

  let hoodieLoaded = false;
  const hoodieMeshes = [];

  const loader = new THREE.GLTFLoader();
  loader.load(
    'assets/models/hoodie.glb',
    function (gltf) {
      const model = gltf.scene;

      // Auto-center and normalize size
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 3.8 / maxDim;

      model.scale.setScalar(scale);
      model.position.x = -center.x * scale;
      model.position.y = -center.y * scale + 0.15;
      model.position.z = -center.z * scale;

      model.traverse(function (child) {
        if (child.isMesh) {
          child.material = fabricMaterial;
          child.castShadow = true;
          child.receiveShadow = true;
          hoodieMeshes.push(child);
        }
      });

      garmentGroup.add(model);
      hoodieLoaded = true;

      const badge = container.querySelector('.loading-model-chip');
      if (badge) badge.remove();
    },
    undefined,
    function (error) {
      console.warn('GLTF load failed:', error);
    }
  );

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

  // Color Swatch Selection
  const swatchButtons = document.querySelectorAll('.color-swatch-btn');
  const activeColorLabel = document.getElementById('active-swatch-name');

  function setColor(colorName) {
    if (SWATCH_COLORS[colorName]) {
      currentColorHex = SWATCH_COLORS[colorName];
      fabricMaterial.color.setHex(currentColorHex);

      swatchButtons.forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-color') === colorName);
      });

      if (activeColorLabel) {
        activeColorLabel.textContent = colorName.toUpperCase();
      }

      const ctaBtn = document.getElementById('btn-add-3d-garment');
      if (ctaBtn) {
        ctaBtn.setAttribute('data-color', colorName);
      }
    }
  }

  swatchButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const color = btn.getAttribute('data-color');
      setColor(color);
    });
  });

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
      setColor('oatmeal');
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
})();
