"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeHero() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // 1. Scene & Renderer Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 100);
    camera.position.set(0, 3.5, 8.5); // Initial position

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Helper: Generate a high-quality circular radial glow texture programmatically
    const createParticleTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext("2d");
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, "rgba(255, 255, 255, 1)");
      grad.addColorStop(0.2, "rgba(255, 255, 255, 0.8)");
      grad.addColorStop(0.5, "rgba(255, 255, 255, 0.2)");
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
      return new THREE.CanvasTexture(canvas);
    };

    // 2. Central Morphing Glass Sphere (Refractive Nucleus)
    const coreGeometry = new THREE.IcosahedronGeometry(1.2, 4);
    const originalPositions = coreGeometry.attributes.position.array.slice();

    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.08,
      metalness: 0.1,
      transmission: 0.95,
      ior: 1.5,
      thickness: 1.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      side: THREE.DoubleSide
    });

    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    group.add(core);

    // 3. Inner Glowing Sphere
    const innerGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0x18d5b5,
      transparent: true,
      opacity: 0.85
    });
    const innerCore = new THREE.Mesh(innerGeometry, innerMaterial);
    group.add(innerCore);

    // 4. Orbiting Rings
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.15
    });
    const satelliteGeom = new THREE.SphereGeometry(0.05, 16, 16);
    const satellites = [];

    for (let i = 0; i < 2; i += 1) {
      const radius = 1.8 + i * 0.6;
      const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.006, 8, 80), ringMaterial);
      ring.rotation.x = Math.PI / 2 + (i * 0.2);
      group.add(ring);

      const satMat = new THREE.MeshBasicMaterial({
        color: 0xffb545,
        transparent: true,
        opacity: 0.8
      });
      const sat = new THREE.Mesh(satelliteGeom, satMat);
      group.add(sat);

      satellites.push({
        mesh: sat,
        radius,
        speed: 0.5 + i * 0.3,
        angle: Math.random() * Math.PI * 2,
        rotX: ring.rotation.x
      });
    }

    // 5. Scroll-linked Morphing Formations (2000 Particles)
    const particleCount = 2000;
    const particlesGeometry = new THREE.BufferGeometry();
    
    // Arrays for active particle rendering attributes
    const activePositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Precomputed formations coordinate arrays
    const posGalaxy = new Float32Array(particleCount * 3);
    const posGrid = new Float32Array(particleCount * 3);
    const posHelix = new Float32Array(particleCount * 3);
    const posWave = new Float32Array(particleCount * 3);
    const posVortex = new Float32Array(particleCount * 3);

    // Mathematical rotation speed and angle variables for individual particles
    const particleAngles = new Float32Array(particleCount);
    const particleRadii = new Float32Array(particleCount);
    const particleHeights = new Float32Array(particleCount);
    const particleSpeeds = new Float32Array(particleCount);

    // Section colors map matching custom variables in globals.css
    const sectionColors = {
      home: {
        light: [new THREE.Color(0x0f766e), new THREE.Color(0xd97706), new THREE.Color(0x4f46e5)],
        dark: [new THREE.Color(0x18d5b5), new THREE.Color(0xffb545), new THREE.Color(0xff7ab6)]
      },
      projects: {
        light: [new THREE.Color(0x047857), new THREE.Color(0x0e7490), new THREE.Color(0x0ea5e9)],
        dark: [new THREE.Color(0x10b981), new THREE.Color(0x06b6d4), new THREE.Color(0x00f2fe)]
      },
      certificates: {
        light: [new THREE.Color(0x7e22ce), new THREE.Color(0xb45309), new THREE.Color(0x4f46e5)],
        dark: [new THREE.Color(0xa855f7), new THREE.Color(0xfbbf24), new THREE.Color(0xf472b6)]
      },
      courses: {
        light: [new THREE.Color(0x1d4ed8), new THREE.Color(0x0f766e), new THREE.Color(0x0984e3)],
        dark: [new THREE.Color(0x3b82f6), new THREE.Color(0x14b8a6), new THREE.Color(0x00d2ff)]
      },
      education: {
        light: [new THREE.Color(0xbe123c), new THREE.Color(0xc2410c), new THREE.Color(0xd946ef)],
        dark: [new THREE.Color(0xf43f5e), new THREE.Color(0xf97316), new THREE.Color(0xff007f)]
      },
      about: {
        light: [new THREE.Color(0x4338ca), new THREE.Color(0xbe185d), new THREE.Color(0x4f46e5)],
        dark: [new THREE.Color(0x6366f1), new THREE.Color(0xec4899), new THREE.Color(0x9b5de5)]
      },
      contact: {
        light: [new THREE.Color(0xbe123c), new THREE.Color(0x6d28d9), new THREE.Color(0xff4757)],
        dark: [new THREE.Color(0xf43f5e), new THREE.Color(0x8b5cf6), new THREE.Color(0xff6b81)]
      }
    };

    // Initialize state values from the root DOM element
    let currentTheme = "dark";
    let activeSection = "home";
    if (typeof window !== "undefined") {
      currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
      activeSection = document.documentElement.getAttribute("data-active-section") || "home";
    }

    // Target colors for smooth lerping
    const activePalette = sectionColors[activeSection]?.[currentTheme] || sectionColors.home.dark;
    const targetColors = {
      innerCore: activePalette[0].clone(),
      light1: activePalette[0].clone(),
      light2: activePalette[1].clone(),
      light3: activePalette[2].clone(),
      palette: [
        activePalette[0].clone(),
        activePalette[1].clone(),
        activePalette[2].clone()
      ]
    };

    // Precalculate coordinates for all five mathematical formations
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Spin variables used for Galaxy and Vortex states
      const r = Math.pow(Math.random(), 1.6) * 6.5 + 0.3;
      const armAngle = (i % 3) * (2 * Math.PI / 3);
      const angle = armAngle + r * 0.75 + (Math.random() - 0.5) * 0.2;
      const h = (Math.random() - 0.5) * 0.35 * (7.0 - r);

      particleRadii[i] = r;
      particleAngles[i] = angle;
      particleHeights[i] = h;
      particleSpeeds[i] = 0.08 / (r + 0.3); // Spin speed decays outward

      // 1. GALAXY FORMATION
      posGalaxy[i3] = Math.cos(angle) * r;
      posGalaxy[i3 + 1] = h;
      posGalaxy[i3 + 2] = Math.sin(angle) * r;

      // 2. GRID FORMATION (Mainframe Cube Nodes)
      const gx = (i % 12) - 5.5;
      const gy = (Math.floor(i / 12) % 12) - 5.5;
      const gz = (Math.floor(i / 144) % 14) - 6.5;
      posGrid[i3] = gx * 0.45 + (Math.random() - 0.5) * 0.08;
      posGrid[i3 + 1] = gy * 0.45 + (Math.random() - 0.5) * 0.08;
      posGrid[i3 + 2] = gz * 0.45 + (Math.random() - 0.5) * 0.08;

      // 3. DNA HELIX FORMATION
      const helixAngle = i * 0.045;
      const isArmA = i % 2 === 0;
      const factor = isArmA ? 1 : -1;
      const radius = 1.6;
      posHelix[i3] = Math.cos(helixAngle) * radius * factor + (Math.random() - 0.5) * 0.1;
      posHelix[i3 + 1] = (i / particleCount - 0.5) * 7.5 + (Math.random() - 0.5) * 0.05;
      posHelix[i3 + 2] = Math.sin(helixAngle) * radius * factor + (Math.random() - 0.5) * 0.1;

      // 4. CYBER WAVE FORMATION (Mesh grid plane)
      const gridWidth = 50;
      const col = i % gridWidth;
      const row = Math.floor(i / gridWidth);
      posWave[i3] = (col - 24.5) * 0.24 + (Math.random() - 0.5) * 0.04;
      posWave[i3 + 1] = -1.2; // base flat plane
      posWave[i3 + 2] = (row - 19.5) * 0.24 + (Math.random() - 0.5) * 0.04;

      // 5. VORTEX FORMATION (Swirling wormhole ring)
      const vr = Math.pow(Math.random(), 0.5) * 3.5 + 0.2;
      const vAngle = Math.random() * Math.PI * 2;
      posVortex[i3] = Math.cos(vAngle) * vr;
      posVortex[i3 + 1] = (Math.random() - 0.5) * 0.12 * (3.8 - vr);
      posVortex[i3 + 2] = Math.sin(vAngle) * vr;

      // Initialize active points at Galaxy formation
      activePositions[i3] = posGalaxy[i3];
      activePositions[i3 + 1] = posGalaxy[i3 + 1];
      activePositions[i3 + 2] = posGalaxy[i3 + 2];

      // Set initial colors
      const colVal = activePalette[i % 3].clone();
      colVal.lerp(new THREE.Color(0xffffff), Math.max(0, 1.0 - r / 3.0) * 0.5);
      colors[i3] = colVal.r;
      colors[i3 + 1] = colVal.g;
      colors[i3 + 2] = colVal.b;
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(activePositions, 3));
    particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.14, // Slightly larger for stellar soft glow blending
      map: createParticleTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const galaxyParticles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(galaxyParticles);

    // 6. Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.25));

    const light1 = new THREE.PointLight(activePalette[0], 10, 25);
    light1.position.set(5, 5, 5);
    scene.add(light1);

    const light2 = new THREE.PointLight(activePalette[1], 8, 20);
    light2.position.set(-5, -3, 4);
    scene.add(light2);

    const mouseLight = new THREE.PointLight(activePalette[2], 6, 12);
    mouseLight.position.set(0, 0, 3);
    scene.add(mouseLight);

    // 7. Active State & Theme Attribute Observer
    const observer = new MutationObserver(() => {
      const nextTheme = document.documentElement.getAttribute("data-theme") || "dark";
      const nextSection = document.documentElement.getAttribute("data-active-section") || "home";

      const palette = sectionColors[nextSection]?.[nextTheme] || sectionColors.home.dark;
      
      // Update targets for lights
      targetColors.innerCore.copy(palette[0]);
      targetColors.light1.copy(palette[0]);
      targetColors.light2.copy(palette[1]);
      targetColors.light3.copy(palette[2]);

      // Update targets for particles palette
      targetColors.palette[0].copy(palette[0]);
      targetColors.palette[1].copy(palette[1]);
      targetColors.palette[2].copy(palette[2]);
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "data-active-section"]
    });

    // 8. Interaction & Scroll Event Listeners
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, active: false };
    const onMouseMove = (event) => {
      mouse.targetX = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(event.clientY / window.innerHeight) * 2 + 1;
      mouse.active = true;
    };
    window.addEventListener("mousemove", onMouseMove);

    const onMouseLeave = () => {
      mouse.active = false;
    };
    window.addEventListener("mouseleave", onMouseLeave);

    let scrollPercent = 0;
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        scrollPercent = window.scrollY / maxScroll;
      }
    };
    window.addEventListener("scroll", onScroll);

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", resize);

    // 9. Animation Loop
    let frameId;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      const timeFactor = elapsed * 0.6;

      // Mouse smoothing
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Project mouse screen coordinates into 3D world space on the z=0 plane
      const mouseWorld = new THREE.Vector3();
      if (mouse.active) {
        const tempV = new THREE.Vector3(mouse.x, mouse.y, 0.5);
        tempV.unproject(camera);
        const dir = tempV.sub(camera.position).normalize();
        const distToPlane = -camera.position.z / dir.z;
        mouseWorld.copy(camera.position).add(dir.multiplyScalar(distToPlane));
      }

      // Scroll segments calculations (mapping scrollPercent 0.0-1.0 to 5 states)
      const t = Math.max(0, Math.min(4, scrollPercent * 4));
      const activeStage = Math.floor(t);
      const stageProgress = t - activeStage;

      // Camera Cinematic Swooping Path (Parallax & Depth Flight)
      let targetCamX = 0;
      let targetCamY = 3.5;
      let targetCamZ = 8.5;
      let lookAtY = 0;

      if (t < 1) {
        // Hero to Projects (Galaxy -> Grid)
        targetCamX = mouse.x * 1.5;
        targetCamY = 3.5 - (3.5 - 1.5) * stageProgress;
        targetCamZ = 8.5 - (8.5 - 7.0) * stageProgress;
        lookAtY = stageProgress * 0.3;
      } else if (t < 2) {
        // Projects to Certificates (Grid -> DNA Helix)
        const p = t - 1;
        targetCamX = mouse.x * 1.5;
        targetCamY = 1.5 - 1.5 * p;
        targetCamZ = 7.0 + 1.0 * p;
        lookAtY = 0.3 - 0.3 * p;
      } else if (t < 3) {
        // Certificates to Courses/Education (DNA Helix -> Cyber Wave)
        const p = t - 2;
        targetCamX = mouse.x * 1.5 + p * 2.0;
        targetCamY = p * 4.0;
        targetCamZ = 8.0 - 0.5 * p;
        lookAtY = p * -0.5;
      } else {
        // Courses/Education to Contact (Cyber Wave -> Vortex wormhole plunge)
        const p = t - 3;
        targetCamX = (mouse.x * 1.5 + 2.0) * (1 - p);
        targetCamY = 4.0 - 3.5 * p;
        targetCamZ = 7.5 - 3.0 * p;
        lookAtY = -0.5 + 1.0 * p;
      }

      camera.position.x += (targetCamX - camera.position.x) * 0.05;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.position.z += (targetCamZ - camera.position.z) * 0.05;
      camera.lookAt(0, lookAtY, 0);

      // Core Glass Sphere dynamic position, scale, and morphing details based on scroll
      let coreTargetX = window.innerWidth < 800 ? 0.0 : 2.2;
      let coreTargetY = 0.0;
      let coreTargetZ = 0.0;
      let coreTargetScale = 1.0;
      let coreIntensity = 0.22;

      if (t < 1) {
        // Hero to Projects (Shift left, scale down)
        const baseOffsetX = window.innerWidth < 800 ? 0.0 : 2.2;
        const targetX = baseOffsetX - stageProgress * (window.innerWidth < 800 ? 1.5 : 4.8);
        coreTargetX = targetX;
        coreTargetY = -stageProgress * 0.4;
        coreTargetScale = 1.0 - stageProgress * 0.45;
        coreIntensity = 0.22 + stageProgress * 0.06;
      } else if (t < 2) {
        // Projects to Certificates (Shift right, scale up slightly)
        const p = t - 1;
        const startX = window.innerWidth < 800 ? -1.5 : -2.6;
        const endX = window.innerWidth < 800 ? 1.0 : 2.0;
        coreTargetX = startX + (endX - startX) * p;
        coreTargetY = -0.4 + 0.8 * p;
        coreTargetScale = 0.55 + 0.15 * p;
        coreIntensity = 0.28 - 0.08 * p;
      } else if (t < 3) {
        // Certificates to Courses/Education (Shift left, scale down)
        const p = t - 2;
        const startX = window.innerWidth < 800 ? 1.0 : 2.0;
        const endX = window.innerWidth < 800 ? -1.2 : -2.2;
        coreTargetX = startX + (endX - startX) * p;
        coreTargetY = 0.4 - 1.2 * p;
        coreTargetScale = 0.7 - 0.2 * p;
        coreIntensity = 0.20 + p * 0.1;
      } else {
        // Courses/Education to Contact (Shift to center, scale up for Vortex)
        const p = t - 3;
        const startX = window.innerWidth < 800 ? -1.2 : -2.2;
        coreTargetX = startX * (1 - p);
        coreTargetY = -0.8 + 0.8 * p;
        coreTargetScale = 0.5 + 0.7 * p;
        coreIntensity = 0.30 + p * 0.25;
      }

      group.position.x += (coreTargetX - group.position.x) * 0.05;
      group.position.y += (coreTargetY - group.position.y) * 0.05;
      group.position.z += (coreTargetZ - group.position.z) * 0.05;

      const scaleVal = core.scale.x + (coreTargetScale - core.scale.x) * 0.05;
      core.scale.set(scaleVal, scaleVal, scaleVal);

      // Cursor light tracking
      mouseLight.position.x = mouse.x * 6;
      mouseLight.position.y = mouse.y * 5;

      // Central morphing glass sphere vertex displacement
      const corePos = coreGeometry.attributes.position.array;
      const coreCount = coreGeometry.attributes.position.count;
      for (let i = 0; i < coreCount; i++) {
        const i3 = i * 3;
        const vx = originalPositions[i3];
        const vy = originalPositions[i3 + 1];
        const vz = originalPositions[i3 + 2];

        // Wave formula
        const wave = Math.sin(vx * (1.5 + scrollPercent * 0.8) + timeFactor) * 
                     Math.cos(vy * (1.6 + scrollPercent * 0.6) + timeFactor * 0.8) * 
                     Math.sin(vz * 1.4 - timeFactor * 0.4);

        const mouseActivity = Math.abs(mouse.targetX - mouse.x) + Math.abs(mouse.targetY - mouse.y);
        const displacement = (coreIntensity + mouseActivity * 0.12 + scrollPercent * 0.1) * wave;

        const len = Math.sqrt(vx * vx + vy * vy + vz * vz) || 1;
        corePos[i3] = vx + (vx / len) * displacement;
        corePos[i3 + 1] = vy + (vy / len) * displacement;
        corePos[i3 + 2] = vz + (vz / len) * displacement;
      }
      coreGeometry.attributes.position.needsUpdate = true;
      coreGeometry.computeVertexNormals();

      // Core rotations
      core.rotation.y = timeFactor * 0.15;
      core.rotation.z = Math.sin(timeFactor * 0.2) * 0.08;

      innerCore.rotation.x = -timeFactor * 0.25;
      const pulse = 1.0 + Math.sin(timeFactor * 1.8) * 0.06;
      innerCore.scale.set(pulse, pulse, pulse);

      // Swirling particles animations & scroll transitions
      const partPos = particlesGeometry.attributes.position.array;
      const partColors = particlesGeometry.attributes.color.array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Dynamic targets calculations per state:
        let tx = 0, ty = 0, tz = 0;

        // 1. GALAXY Target: Swirling angle
        const radiusVal = particleRadii[i];
        particleAngles[i] += particleSpeeds[i]; // continuous orbit spin
        const galAngle = particleAngles[i];
        const gxGalaxy = Math.cos(galAngle) * radiusVal;
        const gyGalaxy = particleHeights[i];
        const gzGalaxy = Math.sin(galAngle) * radiusVal;

        // 2. GRID Target: gentle hover/float
        const gxGrid = posGrid[i3];
        const gyGrid = posGrid[i3 + 1] + Math.sin(timeFactor + posGrid[i3] * 1.5) * 0.06;
        const gzGrid = posGrid[i3 + 2];

        // 3. HELIX Target: spin the double helix
        const hAngle = (i * 0.045) + timeFactor * 0.25;
        const isArmA = i % 2 === 0;
        const factor = isArmA ? 1 : -1;
        const hRadius = 1.6;
        const gxHelix = Math.cos(hAngle) * hRadius * factor;
        const gyHelix = posHelix[i3 + 1];
        const gzHelix = Math.sin(hAngle) * hRadius * factor;

        // 4. CYBER WAVE Target: sine wave heights
        const gxWave = posWave[i3];
        const gzWave = posWave[i3 + 2];
        const gyWave = posWave[i3 + 1] + Math.sin(gxWave * 0.6 + timeFactor * 1.8) * Math.cos(gzWave * 0.6 + timeFactor * 1.2) * 0.45;

        // 5. VORTEX Target: very fast spinning
        const vorRadius = Math.sqrt(posVortex[i3] * posVortex[i3] + posVortex[i3 + 2] * posVortex[i3 + 2]);
        const vorAngle = Math.atan2(posVortex[i3 + 2], posVortex[i3]) + timeFactor * (0.8 + 0.1 / (vorRadius + 0.1));
        const gxVortex = Math.cos(vorAngle) * vorRadius;
        const gyVortex = posVortex[i3 + 1] + Math.sin(timeFactor * 2.0 + vorRadius) * 0.04;
        const gzVortex = Math.sin(vorAngle) * vorRadius;

        // Segment interpolation (Galaxy -> Grid -> Helix -> Cyber Wave -> Vortex)
        if (activeStage === 0) {
          tx = gxGalaxy + (gxGrid - gxGalaxy) * stageProgress;
          ty = gyGalaxy + (gyGrid - gyGalaxy) * stageProgress;
          tz = gzGalaxy + (gzGrid - gzGalaxy) * stageProgress;
        } else if (activeStage === 1) {
          tx = gxGrid + (gxHelix - gxGrid) * stageProgress;
          ty = gyGrid + (gyHelix - gyGrid) * stageProgress;
          tz = gzGrid + (gzHelix - gzGrid) * stageProgress;
        } else if (activeStage === 2) {
          tx = gxHelix + (gxWave - gxHelix) * stageProgress;
          ty = gyHelix + (gyWave - gyHelix) * stageProgress;
          tz = gzHelix + (gzWave - gzHelix) * stageProgress;
        } else {
          tx = gxWave + (gxVortex - gxWave) * stageProgress;
          ty = gyWave + (gyVortex - gyWave) * stageProgress;
          tz = gzWave + (gzVortex - gzWave) * stageProgress;
        }

        // Apply mouse physics: repel particles nearby in world space
        if (mouse.active) {
          const dx = tx - mouseWorld.x;
          const dy = ty - mouseWorld.y;
          const dz = tz - mouseWorld.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          
          if (dist < 2.0 && dist > 0.01) {
            const repulsionForce = (2.0 - dist) / 2.0; // 0 to 1
            const pushX = (dx / dist) * repulsionForce * 0.9;
            const pushY = (dy / dist) * repulsionForce * 0.9;
            const pushZ = (dz / dist) * repulsionForce * 0.9;
            
            tx += pushX;
            ty += pushY;
            tz += pushZ;
          }
        }

        // Lerp active coordinate toward dynamic target coordinates
        partPos[i3] += (tx - partPos[i3]) * 0.05;
        partPos[i3 + 1] += (ty - partPos[i3 + 1]) * 0.05;
        partPos[i3 + 2] += (tz - partPos[i3 + 2]) * 0.05;

        // Dynamic particle colors lerping (cross-fading colors matching the section)
        const baseColor = targetColors.palette[i % 3].clone();
        baseColor.lerp(new THREE.Color(0xffffff), Math.max(0, 1.0 - radiusVal / 3.0) * 0.5);

        partColors[i3] += (baseColor.r - partColors[i3]) * 0.04;
        partColors[i3 + 1] += (baseColor.g - partColors[i3 + 1]) * 0.04;
        partColors[i3 + 2] += (baseColor.b - partColors[i3 + 2]) * 0.04;
      }
      particlesGeometry.attributes.position.needsUpdate = true;
      particlesGeometry.attributes.color.needsUpdate = true;

      // Subtle rotation of entire galaxy Points mesh
      galaxyParticles.rotation.y = timeFactor * 0.02;

      // Update orbits
      satellites.forEach((sat) => {
        sat.angle += sat.speed * 0.012;
        sat.mesh.position.set(
          Math.cos(sat.angle) * sat.radius,
          Math.sin(sat.angle * 0.5) * 0.15,
          Math.sin(sat.angle) * sat.radius
        );
        sat.mesh.position.applyAxisAngle(new THREE.Vector3(1, 0, 0), sat.rotX);
        sat.mesh.material.color.lerp(targetColors.light2, 0.04);
      });

      // Smooth lights color transitions
      innerCore.material.color.lerp(targetColors.innerCore, 0.04);
      light1.color.lerp(targetColors.light1, 0.04);
      light2.color.lerp(targetColors.light2, 0.04);
      mouseLight.color.lerp(targetColors.light3, 0.04);

      frameId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    resize();
    animate();

    // 10. Cleanup
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frameId);

      coreGeometry.dispose();
      coreMaterial.dispose();
      innerGeometry.dispose();
      innerMaterial.dispose();
      satelliteGeom.dispose();
      satellites.forEach((sat) => {
        sat.mesh.geometry.dispose();
        sat.mesh.material.dispose();
      });
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
      try {
        mount.removeChild(renderer.domElement);
      } catch (e) {
        // ignore
      }
    };
  }, []);

  return <div ref={mountRef} className="hero-canvas" aria-hidden="true" />;
}
