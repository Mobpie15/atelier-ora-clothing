/**
 * ATELIER ORA // 3D GARMENT STUDIO ENGINE (Three.js r128)
 * Photorealistic 3D Luxury Streetwear Hoodie Visualizer
 * - Anatomical boxy streetwear drape with natural arm posture (NO rigid scarecrow cylinders)
 * - Tailored kangaroo pouch with hand entry openings
 * - Sculpted hollow hood with face rim, crossover collar & metallic aglets
 * - Procedural 500 GSM loopback cotton weave & bump mapping
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
  camera.position.set(0, 0.15, 5.6);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // -------------------------------------------------------------
  // 1. PROCEDURAL 500 GSM FABRIC TEXTURE GENERATOR
  // -------------------------------------------------------------
  function generateFabricBumpTexture() {
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
        // Micro French Terry loop weave
        const loop = Math.sin(x * 1.57) * Math.cos(y * 1.57) * 16;
        // Organic cotton slub variance
        const slub = (Math.sin(x * 0.25 + y * 0.4) + Math.cos(x * 0.35 - y * 0.18)) * 8;
        const noise = (Math.random() - 0.5) * 18;
        const val = Math.min(255, Math.max(0, 128 + loop + slub + noise));

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
    tex.repeat.set(6, 6);
    return tex;
  }

  const fabricBumpTex = generateFabricBumpTexture();

  // Contact shadow texture for pedestal
  function generateShadowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
    grad.addColorStop(0, 'rgba(30, 28, 25, 0.45)');
    grad.addColorStop(0.5, 'rgba(30, 28, 25, 0.18)');
    grad.addColorStop(1, 'rgba(30, 28, 25, 0.0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }

  const shadowTex = generateShadowTexture();

  // -------------------------------------------------------------
  // 2. PROFESSIONAL STUDIO LIGHTING SETUP
  // -------------------------------------------------------------
  const ambientLight = new THREE.AmbientLight(0xf5ede1, 0.82);
  scene.add(ambientLight);

  // Key Studio Light (Warm white highlight)
  const keyLight = new THREE.DirectionalLight(0xfffcf5, 1.85);
  keyLight.position.set(4.5, 6.0, 4.5);
  scene.add(keyLight);

  // Soft Cool Fill Light (Brings out folds without blowing out shadows)
  const fillLight = new THREE.DirectionalLight(0xd2dde8, 0.95);
  fillLight.position.set(-4.5, -0.5, 3.5);
  scene.add(fillLight);

  // Crisp Warm Rim Light (Accentuates shoulder and hood silhouette)
  const rimLight = new THREE.DirectionalLight(0xffecd2, 1.65);
  rimLight.position.set(0, 5.2, -4.5);
  scene.add(rimLight);

  // Under Bounce Light (Reflects off warm travertine pedestal)
  const underLight = new THREE.DirectionalLight(0xbaa995, 0.6);
  underLight.position.set(0, -4.5, 2.0);
  scene.add(underLight);

  // Pedestal & Grounding
  const pedestalGeom = new THREE.CylinderGeometry(2.3, 2.45, 0.16, 54);
  const pedestalMat = new THREE.MeshStandardMaterial({
    color: 0x48433b,
    roughness: 0.88,
    metalness: 0.08
  });
  const pedestal = new THREE.Mesh(pedestalGeom, pedestalMat);
  pedestal.position.y = -2.1;
  scene.add(pedestal);

  // Soft Contact Shadow Plane
  if (shadowTex) {
    const shadowGeom = new THREE.PlaneGeometry(3.6, 3.6);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeom, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -2.01;
    scene.add(shadowMesh);
  }

  // -------------------------------------------------------------
  // 3. COLOR SWATCH PALETTE & FABRIC MATERIALS
  // -------------------------------------------------------------
  const SWATCH_COLORS = {
    oatmeal: 0xd6cfbf,
    olive: 0x5a5e48,
    espresso: 0x242220,
    terracotta: 0x9e5742,
    camel: 0xb8956e
  };

  let currentColorHex = SWATCH_COLORS.oatmeal;

  // Main 500 GSM Loopback Cotton Material
  const fabricMaterial = new THREE.MeshStandardMaterial({
    color: currentColorHex,
    roughness: 0.86,
    metalness: 0.02,
    bumpMap: fabricBumpTex,
    bumpScale: 0.016,
    flatShading: false
  });

  // Ribbed Waistband & Cuffs Material
  const ribbingMaterial = new THREE.MeshStandardMaterial({
    color: currentColorHex,
    roughness: 0.92,
    metalness: 0.01,
    bumpMap: fabricBumpTex,
    bumpScale: 0.022
  });

  // Polished Metal Eyelets & Aglets
  const metalMaterial = new THREE.MeshStandardMaterial({
    color: 0xd0d0d0,
    roughness: 0.22,
    metalness: 0.94
  });

  // Dark Inner Hood Lining (Simulates deep shadow inside hollow hood)
  const innerHoodMat = new THREE.MeshStandardMaterial({
    color: 0x1a1917,
    roughness: 0.96,
    side: THREE.BackSide
  });

  // -------------------------------------------------------------
  // 4. SCULPTED 3D HOODIE GARMENT GROUP
  // -------------------------------------------------------------
  const garmentGroup = new THREE.Group();
  scene.add(garmentGroup);

  // A. Torso Mesh (Boxy Streetwear Silhouette with Realistic Creases)
  const torsoGeom = new THREE.CylinderGeometry(1.06, 0.98, 1.84, 48, 28);
  const tPos = torsoGeom.attributes.position;

  for (let i = 0; i < tPos.count; i++) {
    const x = tPos.getX(i);
    const y = tPos.getY(i);
    const z = tPos.getZ(i);

    // 1. Natural chest volume projection
    if (z > 0 && y > -0.2) {
      const chestFactor = Math.cos((y - 0.3) * 1.5) * 0.075 * Math.cos(x * 1.3);
      tPos.setZ(i, z + Math.max(0, chestFactor));
    }

    // 2. Soft horizontal drape folds across lower torso
    if (y < 0.25 && y > -0.7) {
      const fold = Math.sin((y + 0.3) * 11.0) * 0.022 * Math.max(0, 1.0 - Math.abs(x * 0.8));
      tPos.setZ(i, tPos.getZ(i) + fold);
    }

    // 3. Subtle armpit pinch for natural dropped shoulder
    if (y > 0.5 && Math.abs(x) > 0.85) {
      tPos.setX(i, x * 0.97);
    }
  }

  torsoGeom.computeVertexNormals();
  const torsoMesh = new THREE.Mesh(torsoGeom, fabricMaterial);
  torsoMesh.position.y = -0.1;
  garmentGroup.add(torsoMesh);

  // B. Ribbed Waistband Hem
  const waistGeom = new THREE.CylinderGeometry(0.98, 0.95, 0.22, 48, 8);
  const wPos = waistGeom.attributes.position;
  for (let i = 0; i < wPos.count; i++) {
    const x = wPos.getX(i);
    const z = wPos.getZ(i);
    const angle = Math.atan2(z, x);
    const rib = Math.sin(angle * 48) * 0.007;
    wPos.setX(i, x + Math.cos(angle) * rib);
    wPos.setZ(i, z + Math.sin(angle) * rib);
  }
  waistGeom.computeVertexNormals();
  const waistMesh = new THREE.Mesh(waistGeom, ribbingMaterial);
  waistMesh.position.y = -1.13;
  garmentGroup.add(waistMesh);

  // C. Tailored Kangaroo Pouch Pocket with Real Angled Hand Openings
  const pouchShape = new THREE.Shape();
  pouchShape.moveTo(-0.65, -0.68);
  pouchShape.lineTo(0.65, -0.68);
  pouchShape.lineTo(0.65, -0.44);
  pouchShape.quadraticCurveTo(0.60, -0.28, 0.44, -0.16); // Hand entry curve
  pouchShape.lineTo(-0.44, -0.16);
  pouchShape.quadraticCurveTo(-0.60, -0.28, -0.65, -0.44); // Hand entry curve
  pouchShape.closePath();

  const pouchGeom = new THREE.ExtrudeGeometry(pouchShape, {
    depth: 0.045,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.016,
    bevelThickness: 0.016
  });

  // Warp pouch to match curved cylindrical torso
  const pPos = pouchGeom.attributes.position;
  for (let i = 0; i < pPos.count; i++) {
    const x = pPos.getX(i);
    const z = pPos.getZ(i);
    const cylinderRadius = 1.05;
    const cylZ = Math.sqrt(Math.max(0, cylinderRadius * cylinderRadius - x * x));
    pPos.setZ(i, z + cylZ - 0.98);
  }
  pouchGeom.computeVertexNormals();

  const pouchMesh = new THREE.Mesh(pouchGeom, fabricMaterial);
  pouchMesh.position.set(0, 0, 0.98);
  garmentGroup.add(pouchMesh);

  // D. Naturally Hanging Streetwear Sleeves (Left & Right)
  function createSleeve(isRight) {
    const group = new THREE.Group();
    const sign = isRight ? 1 : -1;

    // 1. Dropped Shoulder Cap
    const capGeom = new THREE.SphereGeometry(0.36, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const capMesh = new THREE.Mesh(capGeom, fabricMaterial);
    capMesh.position.set(sign * 1.02, 0.65, 0.02);
    capMesh.rotation.z = sign * -0.65;
    group.add(capMesh);

    // 2. Upper Arm (Hangs downward and relaxed at ~70 degrees, NOT sticking out)
    const upperGeom = new THREE.CylinderGeometry(0.34, 0.28, 0.92, 24, 8);
    const uPos = upperGeom.attributes.position;
    for (let i = 0; i < uPos.count; i++) {
      const y = uPos.getY(i);
      // Soft crease at inner elbow
      if (y < -0.2) {
        uPos.setZ(i, uPos.getZ(i) + Math.sin(y * 12) * 0.015);
      }
    }
    upperGeom.computeVertexNormals();

    const upperMesh = new THREE.Mesh(upperGeom, fabricMaterial);
    upperMesh.position.set(sign * 1.18, 0.26, 0.04);
    upperMesh.rotation.z = sign * -0.36;
    upperMesh.rotation.x = 0.06;
    group.add(upperMesh);

    // 3. Forearm (Extends gently down and forward toward the wrist)
    const foreGeom = new THREE.CylinderGeometry(0.28, 0.24, 0.82, 24, 8);
    const foreMesh = new THREE.Mesh(foreGeom, fabricMaterial);
    foreMesh.position.set(sign * 1.32, -0.42, 0.12);
    foreMesh.rotation.z = sign * -0.15;
    foreMesh.rotation.x = 0.16;
    group.add(foreMesh);

    // 4. Ribbed Wrist Cuff with fine vertical ribbing
    const cuffGeom = new THREE.CylinderGeometry(0.24, 0.22, 0.22, 24, 6);
    const cPos = cuffGeom.attributes.position;
    for (let i = 0; i < cPos.count; i++) {
      const x = cPos.getX(i);
      const z = cPos.getZ(i);
      const angle = Math.atan2(z, x);
      const rib = Math.sin(angle * 32) * 0.005;
      cPos.setX(i, x + Math.cos(angle) * rib);
      cPos.setZ(i, z + Math.sin(angle) * rib);
    }
    cuffGeom.computeVertexNormals();

    const cuffMesh = new THREE.Mesh(cuffGeom, ribbingMaterial);
    cuffMesh.position.set(sign * 1.37, -0.92, 0.20);
    cuffMesh.rotation.z = sign * -0.15;
    cuffMesh.rotation.x = 0.16;
    group.add(cuffMesh);

    return group;
  }

  garmentGroup.add(createSleeve(false));
  garmentGroup.add(createSleeve(true));

  // E. Sculpted 3D Hood (Hollow Back Drape & Face Opening)
  const hoodOuterGeom = new THREE.SphereGeometry(0.82, 36, 24, 0, Math.PI * 2, 0, Math.PI * 0.78);
  const hPos = hoodOuterGeom.attributes.position;

  for (let i = 0; i < hPos.count; i++) {
    const x = hPos.getX(i);
    const y = hPos.getY(i);
    const z = hPos.getZ(i);

    // 1. Extend realistic hood depth at the back
    if (z < 0) {
      hPos.setZ(i, z * 1.25);
    }
    // 2. Open up the front face cavity
    if (z > 0 && y < 0.65) {
      hPos.setZ(i, z * 0.45);
    }
    // 3. Gentle fold indentation down the center nape seam
    if (Math.abs(x) < 0.15 && z < -0.2) {
      hPos.setZ(i, hPos.getZ(i) * 0.95);
    }
  }

  hoodOuterGeom.computeVertexNormals();
  const hoodOuterMesh = new THREE.Mesh(hoodOuterGeom, fabricMaterial);
  hoodOuterMesh.position.set(0, 1.02, -0.08);
  garmentGroup.add(hoodOuterMesh);

  // Inner Hood Shadow Lining
  const innerHoodGeom = new THREE.SphereGeometry(0.76, 28, 20, 0, Math.PI * 2, 0, Math.PI * 0.74);
  const ihPos = innerHoodGeom.attributes.position;
  for (let i = 0; i < ihPos.count; i++) {
    const z = ihPos.getZ(i);
    if (z < 0) ihPos.setZ(i, z * 1.22);
  }
  innerHoodGeom.computeVertexNormals();
  const innerHoodMesh = new THREE.Mesh(innerHoodGeom, innerHoodMat);
  innerHoodMesh.position.set(0, 1.02, -0.08);
  garmentGroup.add(innerHoodMesh);

  // Face Opening Rounded Border Rim (Framing the hood)
  const faceRimGeom = new THREE.TorusGeometry(0.48, 0.055, 16, 36);
  const faceRimMesh = new THREE.Mesh(faceRimGeom, ribbingMaterial);
  faceRimMesh.position.set(0, 1.05, 0.28);
  faceRimMesh.rotation.x = 0.18;
  garmentGroup.add(faceRimMesh);

  // Crossover Neckline Collar
  const neckBandGeom = new THREE.TorusGeometry(0.44, 0.06, 16, 32);
  const neckBandMesh = new THREE.Mesh(neckBandGeom, ribbingMaterial);
  neckBandMesh.position.set(0, 0.78, 0.14);
  neckBandMesh.rotation.x = Math.PI / 2 + 0.12;
  garmentGroup.add(neckBandMesh);

  // F. Drawstrings with Metallic Eyelets & Aglets
  function createDrawstring(offsetX) {
    const strGroup = new THREE.Group();

    // Metallic Grommet / Eyelet Ring
    const eyeletGeom = new THREE.TorusGeometry(0.038, 0.012, 12, 24);
    const eyeletMesh = new THREE.Mesh(eyeletGeom, metalMaterial);
    eyeletMesh.position.set(offsetX, 0.72, 0.52);
    eyeletMesh.rotation.y = offsetX > 0 ? 0.2 : -0.2;
    strGroup.add(eyeletMesh);

    // Braided Round Cotton Cord
    const cordGeom = new THREE.CylinderGeometry(0.018, 0.018, 0.65, 12);
    const cordMat = new THREE.MeshStandardMaterial({
      color: 0xeeece5,
      roughness: 0.8
    });
    const cordMesh = new THREE.Mesh(cordGeom, cordMat);
    cordMesh.position.set(offsetX, 0.38, 0.54);
    strGroup.add(cordMesh);

    // Heavy Metal Aglet Tip
    const agletGeom = new THREE.CylinderGeometry(0.024, 0.024, 0.12, 12);
    const agletMesh = new THREE.Mesh(agletGeom, metalMaterial);
    agletMesh.position.set(offsetX, 0.02, 0.54);
    strGroup.add(agletMesh);

    return { strGroup, cordMesh, agletMesh, offsetX };
  }

  const leftString = createDrawstring(-0.16);
  const rightString = createDrawstring(0.16);
  garmentGroup.add(leftString.strGroup);
  garmentGroup.add(rightString.strGroup);

  // -------------------------------------------------------------
  // 5. INTERACTION: 360 ORBIT, MOBILE TOUCH, SWATCHES & WIND
  // -------------------------------------------------------------
  let isDragging = false;
  let prevMouse = { x: 0, y: 0 };
  let startTouch = { x: 0, y: 0 };
  let isPrimarilyHorizontalTouch = false;
  let targetRotationY = 0;
  let targetRotationX = 0;
  let currentRotationY = 0;
  let currentRotationX = 0;
  let isWindActive = true;
  let isWireframeActive = false;

  // Pointer & Mouse Drag Handlers
  function onPointerDown(e) {
    isDragging = true;
    const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0].clientY) || 0;
    prevMouse = { x: clientX, y: clientY };
    startTouch = { x: clientX, y: clientY };
    isPrimarilyHorizontalTouch = false;
  }

  function onPointerMove(e) {
    if (!isDragging) return;

    const isTouch = e.touches && e.touches.length > 0;
    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;

    const deltaX = clientX - prevMouse.x;
    const deltaY = clientY - prevMouse.y;

    if (isTouch && !isPrimarilyHorizontalTouch) {
      const totalDx = Math.abs(clientX - startTouch.x);
      const totalDy = Math.abs(clientY - startTouch.y);

      // If vertical movement dominates, don't hijack vertical page scroll
      if (totalDy > totalDx && totalDy > 10) {
        isDragging = false;
        return;
      }
      if (totalDx > totalDy && totalDx > 8) {
        isPrimarilyHorizontalTouch = true;
      }
    }

    targetRotationY += deltaX * 0.008;
    targetRotationX += deltaY * 0.005;
    targetRotationX = Math.max(-0.35, Math.min(0.35, targetRotationX));
    prevMouse = { x: clientX, y: clientY };
  }

  function onPointerUp() {
    isDragging = false;
    isPrimarilyHorizontalTouch = false;
  }

  container.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  // Mobile Touch Handlers
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
      ribbingMaterial.color.setHex(currentColorHex);

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

  // CAD Wireframe Seams Toggle
  const wireBtn = document.getElementById('btn-toggle-wireframe');
  if (wireBtn) {
    wireBtn.addEventListener('click', () => {
      isWireframeActive = !isWireframeActive;
      wireBtn.classList.toggle('active', isWireframeActive);
      fabricMaterial.wireframe = isWireframeActive;
      ribbingMaterial.wireframe = isWireframeActive;
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

    // Subtle idle auto-rotation if user is not actively dragging
    if (!isDragging) {
      targetRotationY += 0.003;
    }

    // Smooth inertia interpolation
    currentRotationY += (targetRotationY - currentRotationY) * 0.08;
    currentRotationX += (targetRotationX - currentRotationX) * 0.08;

    garmentGroup.rotation.y = currentRotationY;
    garmentGroup.rotation.x = currentRotationX;

    // Realistic Wind Drape & String Swing Physics
    if (isWindActive) {
      const sway = Math.sin(time * 2.0) * 0.035;
      leftString.cordMesh.rotation.z = Math.sin(time * 2.8) * 0.12;
      leftString.agletMesh.rotation.z = Math.sin(time * 2.8 + 0.2) * 0.18;

      rightString.cordMesh.rotation.z = -Math.sin(time * 2.8 + 0.4) * 0.12;
      rightString.agletMesh.rotation.z = -Math.sin(time * 2.8 + 0.6) * 0.18;

      garmentGroup.position.y = Math.sin(time * 1.6) * 0.045;
      garmentGroup.position.x = sway * 0.4;
    } else {
      garmentGroup.position.y = 0;
      garmentGroup.position.x = 0;
      leftString.cordMesh.rotation.z = 0;
      leftString.agletMesh.rotation.z = 0;
      rightString.cordMesh.rotation.z = 0;
      rightString.agletMesh.rotation.z = 0;
    }

    renderer.render(scene, camera);
  }

  animate();

  // Responsive Viewport Resize Handler
  function onResize() {
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight || (window.innerWidth <= 768 ? 380 : 540);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  window.addEventListener('resize', onResize);
})();
