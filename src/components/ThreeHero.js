"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { usePathname } from "next/navigation";

export default function ThreeHero() {
  const mountRef = useRef(null);
  const pathname = usePathname();

  // Hide the canvas on sub-pages
  if (pathname !== "/") {
    return null;
  }

  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent));
    // The early return for mobile devices has been removed so the animation runs on all screen sizes
    
    const mount = mountRef.current;
    if (!mount) return;

    // 1. Scene & Renderer Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 100);
    camera.position.set(0, 3.5, 8.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

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

    // 2. Central Glowing Core & Halo
    const coreGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95
    });
    const glowingCore = new THREE.Mesh(coreGeometry, coreMaterial);
    group.add(glowingCore);

    const haloGeometry = new THREE.SphereGeometry(0.32, 16, 16);
    const haloMaterial = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending
    });
    const glowingHalo = new THREE.Mesh(haloGeometry, haloMaterial);
    group.add(glowingHalo);

    // 3. Holographic Tech Grid Floor (y = -1.6)
    const techGrid = new THREE.GridHelper(8, 16, 0x8b5cf6, 0x334155);
    techGrid.position.y = -1.6;
    if (Array.isArray(techGrid.material)) {
      techGrid.material.forEach(m => {
        m.transparent = true;
        m.opacity = 0.18;
      });
    } else {
      techGrid.material.transparent = true;
      techGrid.material.opacity = 0.18;
    }
    group.add(techGrid);

    // 4. Coordinate Orbit Rings
    const orbitRings = [];
    const ringGeometries = [];
    const ringMaterials = [];
    for (let i = 0; i < 2; i++) {
      const r = 1.1 + i * 0.55;
      const ringGeom = new THREE.RingGeometry(r, r + 0.006, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x4f46e5,
        transparent: true,
        opacity: 0.16,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.3;
      ring.rotation.y = (Math.random() - 0.5) * 0.3;
      group.add(ring);
      orbitRings.push({ mesh: ring, speed: (i === 0 ? 0.08 : -0.05) });
      ringGeometries.push(ringGeom);
      ringMaterials.push(ringMat);
    }

    // 5. Floating Interconnected Tech Nodes (APIs, Databases, Cloud Services, Microservices)
    const techNodes = [];
    const nodeCount = 24;
    const geometries = [
      new THREE.BoxGeometry(0.12, 0.12, 0.12),       // Database (Cube)
      new THREE.OctahedronGeometry(0.085, 0),        // API (Octahedron)
      new THREE.DodecahedronGeometry(0.085, 0),      // Cloud (Dodecahedron)
      new THREE.TetrahedronGeometry(0.085, 0)        // Microservice (Tetrahedron)
    ];

    const purpleNodeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x8b5cf6,
      roughness: 0.1,
      metalness: 0.9,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.85,
      emissive: 0x8b5cf6,
      emissiveIntensity: 0.35
    });

    const indigoNodeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x4f46e5,
      roughness: 0.1,
      metalness: 0.9,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.85,
      emissive: 0x4f46e5,
      emissiveIntensity: 0.35
    });

    const materials = [purpleNodeMaterial, indigoNodeMaterial];

    for (let i = 0; i < nodeCount; i++) {
      const geom = geometries[i % geometries.length];
      const mat = materials[i % materials.length];
      const mesh = new THREE.Mesh(geom, mat);
      
      const orbitRadius = 0.8 + Math.random() * 1.55;
      const speed = 0.14 + Math.random() * 0.32;
      const angle = Math.random() * Math.PI * 2;
      
      const axis = new THREE.Vector3(
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 1.0,
        (Math.random() - 0.5) * 0.5
      ).normalize();
      
      group.add(mesh);
      techNodes.push({
        mesh,
        orbitRadius,
        speed,
        angle,
        axis,
        color: mat.color
      });
    }

    // 6. Connective Lines
    const maxConnections = 120;
    const linePositions = new Float32Array(maxConnections * 2 * 3);
    const lineColors = new Float32Array(maxConnections * 2 * 3);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      linewidth: 1
    });

    const neonLines = new THREE.LineSegments(lineGeometry, lineMaterial);
    group.add(neonLines);

    // 7. Flowing Data Packets (flowing along active connections)
    const packets = [];
    const packetCount = 12;
    const packetGeometry = new THREE.SphereGeometry(0.016, 8, 8);
    const packetMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    for (let i = 0; i < packetCount; i++) {
      const mesh = new THREE.Mesh(packetGeometry, packetMaterial);
      group.add(mesh);

      // Random starting nodes
      const fromIdx = Math.floor(Math.random() * techNodes.length);
      let toIdx = (fromIdx + 1) % techNodes.length;
      
      packets.push({
        mesh,
        fromNode: techNodes[fromIdx],
        toNode: techNodes[toIdx],
        progress: Math.random(),
        speed: 0.008 + Math.random() * 0.015
      });
    }

    // 8. Scroll-linked Morphing Background Particles (600 Particles representing raw data)
    const particleCount = 600; 
    const particlesGeometry = new THREE.BufferGeometry();
    const activePositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const posGrid = new Float32Array(particleCount * 3);
    const posHelix = new Float32Array(particleCount * 3);
    const posHelixAngle = new Float32Array(particleCount);
    const posVortexRadius = new Float32Array(particleCount);
    const posVortexAngle = new Float32Array(particleCount);
    const posVortexY = new Float32Array(particleCount);
    const posTunnelAngle = new Float32Array(particleCount);
    const posTunnelRadius = new Float32Array(particleCount);
    const posTunnelZ = new Float32Array(particleCount);
    const particleAngles = new Float32Array(particleCount);
    const particleRadii = new Float32Array(particleCount);

    const colorCombos = {
      combo1: {
        light: [new THREE.Color(0x8b5cf6), new THREE.Color(0x4f46e5), new THREE.Color(0xa855f7)],
        dark: [new THREE.Color(0x8b5cf6), new THREE.Color(0x4f46e5), new THREE.Color(0xa855f7)]
      },
      combo2: {
        light: [new THREE.Color(0x8b5cf6), new THREE.Color(0x4f46e5), new THREE.Color(0xa855f7)],
        dark: [new THREE.Color(0x8b5cf6), new THREE.Color(0x4f46e5), new THREE.Color(0xa855f7)]
      }
    };

    const getActivePalette = (section, theme) => {
      const isCombo1 = ["home", "certificates", "education", "contact"].includes(section);
      const combo = isCombo1 ? colorCombos.combo1 : colorCombos.combo2;
      return combo[theme] || combo.dark;
    };

    let currentTheme = "light";
    let activeSection = "home";
    if (typeof window !== "undefined") {
      activeSection = document.documentElement.getAttribute("data-active-section") || "home";
    }

    const activePalette = getActivePalette(activeSection, currentTheme);
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

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      const ringIndex = i % 3;
      const r = 1.15 + ringIndex * 0.4 + (Math.random() - 0.5) * 0.12;
      const angle = Math.random() * Math.PI * 2;
      particleRadii[i] = r;
      particleAngles[i] = angle;

      const level = (i % 6) - 2.5;
      const streamX = ((i / 6) % 100 - 50) * 0.12;
      posGrid[i3] = streamX;
      posGrid[i3 + 1] = level * 0.8 + (Math.random() - 0.5) * 0.05;
      posGrid[i3 + 2] = (Math.random() - 0.5) * 1.5;

      const helixAngle = (i / particleCount) * Math.PI * 8;
      posHelixAngle[i] = helixAngle;
      const isArmA = (i % 2 === 0);
      const factor = isArmA ? 1 : -1;
      const hRadius = 1.6 + (Math.random() - 0.5) * 0.1;
      posHelix[i3] = Math.cos(helixAngle) * hRadius * factor;
      posHelix[i3 + 1] = (i / particleCount - 0.5) * 6.5;
      posHelix[i3 + 2] = Math.sin(helixAngle) * hRadius * factor;

      const ringGroup = i % 8;
      const tunnelZ = (ringGroup - 3.5) * 1.2;
      const tunnelAngle = (i / particleCount) * Math.PI * 2 * (particleCount / 8);
      const tunnelRadius = 2.2 + (Math.random() - 0.5) * 0.15;
      posTunnelAngle[i] = tunnelAngle;
      posTunnelRadius[i] = tunnelRadius;
      posTunnelZ[i] = tunnelZ;

      const vr = Math.sqrt(Math.random()) * 3.5 + 0.3;
      const vAngle = Math.random() * Math.PI * 2;
      posVortexRadius[i] = vr;
      posVortexAngle[i] = vAngle;
      posVortexY[i] = (Math.random() - 0.5) * 6.0;

      if (ringIndex === 0) {
        activePositions[i3] = Math.cos(angle) * r;
        activePositions[i3 + 1] = 0;
        activePositions[i3 + 2] = Math.sin(angle) * r;
      } else if (ringIndex === 1) {
        activePositions[i3] = 0;
        activePositions[i3 + 1] = Math.cos(angle) * r;
        activePositions[i3 + 2] = Math.sin(angle) * r;
      } else {
        activePositions[i3] = Math.cos(angle) * r;
        activePositions[i3 + 1] = Math.sin(angle) * r;
        activePositions[i3 + 2] = 0;
      }

      const colVal = activePalette[i % 3].clone();
      colVal.lerp(new THREE.Color(0xffffff), Math.max(0, 1.0 - r / 3.0) * 0.5);
      colors[i3] = colVal.r;
      colors[i3 + 1] = colVal.g;
      colors[i3 + 2] = colVal.b;
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(activePositions, 3));
    particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.065,
      map: createParticleTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const galaxyParticles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(galaxyParticles);

    // 9. Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.15));
    const coreLight = new THREE.PointLight(0x8b5cf6, 20, 20);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    const light1 = new THREE.PointLight(activePalette[0], 12, 25);
    light1.position.set(4, 4, 4);
    scene.add(light1);
    const light2 = new THREE.PointLight(activePalette[1], 10, 20);
    light2.position.set(-4, -2, 4);
    scene.add(light2);
    const mouseLight = new THREE.PointLight(activePalette[2], 8, 10);
    mouseLight.position.set(0, 0, 2.5);
    scene.add(mouseLight);

    let colorTransitionFrames = 0;
    const observer = new MutationObserver(() => {
      const nextSection = document.documentElement.getAttribute("data-active-section") || "home";
      const palette = getActivePalette(nextSection, "light");
      targetColors.innerCore.copy(palette[0]);
      targetColors.light1.copy(palette[0]);
      targetColors.light2.copy(palette[1]);
      targetColors.light3.copy(palette[2]);
      targetColors.palette[0].copy(palette[0]);
      targetColors.palette[1].copy(palette[1]);
      targetColors.palette[2].copy(palette[2]);
      colorTransitionFrames = 45;
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-active-section"] });

    let frameId;
    let introSpinFactor = 8.0;
    let frameCount = 0;
    const clock = new THREE.Clock();

    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, active: false };
    const onMouseMove = (e) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
      mouse.active = true;
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", () => { mouse.active = false; });

    let viewportHeight = typeof window !== "undefined" ? window.innerHeight : 0;
    let documentHeight = typeof document !== "undefined" ? document.documentElement.scrollHeight : 0;
    let maxScroll = documentHeight - viewportHeight;

    const updateHeights = () => {
      viewportHeight = window.innerHeight;
      documentHeight = document.documentElement.scrollHeight;
      maxScroll = documentHeight - viewportHeight;
    };

    let scrollPercent = 0;
    let maxScrollPercent = 0;
    const onScroll = () => {
      if (maxScroll > 0) {
        scrollPercent = window.scrollY / maxScroll;
        if (scrollPercent > maxScrollPercent) {
          maxScrollPercent = scrollPercent;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    if (typeof window !== "undefined") {
      if (!window.location.hash) {
        if ("scrollRestoration" in window.history) {
          window.history.scrollRestoration = "manual";
        }
        window.scrollTo(0, 0);
      } else {
        if ("scrollRestoration" in window.history) {
          window.history.scrollRestoration = "auto";
        }
      }
    }

    let isCanvasVisible = true;
    const visibilityObserver = new IntersectionObserver((entries) => {
      const entry = entries[0];
      isCanvasVisible = entry.isIntersecting;
      if (isCanvasVisible && !frameId) {
        animate();
      }
    }, { threshold: 0.05 });
    visibilityObserver.observe(mount);

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      updateHeights();
      onScroll();
    };
    window.addEventListener("resize", resize);

    updateHeights();
    onScroll();

    const animate = () => {
      if (!isCanvasVisible) {
        frameId = null;
        return;
      }
      frameCount++;
      const elapsed = clock.getElapsedTime();
      const timeFactor = elapsed * 0.5;
      introSpinFactor += (1.0 - introSpinFactor) * 0.018;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const mouseWorld = new THREE.Vector3();
      if (mouse.active) {
        const tempV = new THREE.Vector3(mouse.x, mouse.y, 0.5);
        tempV.unproject(camera);
        const dir = tempV.sub(camera.position).normalize();
        const distToPlane = -camera.position.z / dir.z;
        mouseWorld.copy(camera.position).add(dir.multiplyScalar(distToPlane));
      }

      const t = Math.max(0, Math.min(4, maxScrollPercent * 4));
      const activeStage = Math.floor(t);
      const stageProgress = t - activeStage;

      // Scroll camera paths
      camera.position.x += ( (t < 2 ? mouse.x * 1.5 : (t < 3 ? mouse.x * 1.5 + (t-2)*2 : 0)) - camera.position.x) * 0.05;
      camera.lookAt(0, (t < 1 ? stageProgress * 0.3 : (t < 2 ? 0.3 - 0.3*(t-1) : (t < 3 ? (t-2)*-0.5 : -0.5 + (t-3)*1.0))), 0);

      group.position.x += ( (t < 1 ? (window.innerWidth < 800 ? 0 : 2.2) - stageProgress * (window.innerWidth < 800 ? 1.5 : 4.8) : 0) - group.position.x) * 0.05;
      
      // Core pulses
      const corePulse = 1.0 + Math.sin(timeFactor * 3.6) * 0.12;
      glowingCore.scale.set(corePulse, corePulse, corePulse);
      glowingHalo.scale.set(corePulse * 1.25, corePulse * 1.25, corePulse * 1.25);

      // Rotate grid and orbit rings
      techGrid.rotation.y = timeFactor * 0.06;
      orbitRings.forEach(ring => {
        ring.mesh.rotation.z += ring.speed * 0.01 * introSpinFactor;
      });

      // Orbiting node movements
      techNodes.forEach((node) => {
        node.angle += node.speed * 0.008 * introSpinFactor;
        
        const right = new THREE.Vector3(1, 0, 0).cross(node.axis).normalize();
        if (right.lengthSq() < 0.001) right.set(0, 1, 0);
        const orthogonal = new THREE.Vector3().crossVectors(node.axis, right).normalize();
        
        node.mesh.position.copy(right).multiplyScalar(Math.cos(node.angle) * node.orbitRadius)
          .addScaledVector(orthogonal, Math.sin(node.angle) * node.orbitRadius);
        
        node.mesh.rotation.x += 0.015;
        node.mesh.rotation.y += 0.02;

        const scaleVal = t < 1 ? 1.0 - stageProgress * 0.35 : 0.65;
        node.mesh.scale.set(scaleVal, scaleVal, scaleVal);
      });

      // Compute dynamic connecting lines
      let lineIdx = 0;
      const maxDistance = 1.35;
      const connectionPool = []; // track active pairs for packet routing

      for (let i = 0; i < techNodes.length; i++) {
        for (let j = i + 1; j < techNodes.length; j++) {
          if (lineIdx >= maxConnections) break;

          const posA = techNodes[i].mesh.position;
          const posB = techNodes[j].mesh.position;
          const dist = posA.distanceTo(posB);

          if (dist < maxDistance) {
            connectionPool.push({ from: techNodes[i], to: techNodes[j] });
            const pIdx = lineIdx * 6;

            linePositions[pIdx] = posA.x;
            linePositions[pIdx + 1] = posA.y;
            linePositions[pIdx + 2] = posA.z;

            linePositions[pIdx + 3] = posB.x;
            linePositions[pIdx + 4] = posB.y;
            linePositions[pIdx + 5] = posB.z;

            const opacity = (1.0 - dist / maxDistance) * 0.6;
            const colorA = techNodes[i].color.clone().multiplyScalar(opacity);
            const colorB = techNodes[j].color.clone().multiplyScalar(opacity);

            lineColors[pIdx] = colorA.r;
            lineColors[pIdx + 1] = colorA.g;
            lineColors[pIdx + 2] = colorA.b;

            lineColors[pIdx + 3] = colorB.r;
            lineColors[pIdx + 4] = colorB.g;
            lineColors[pIdx + 5] = colorB.b;

            lineIdx++;
          }
        }
      }

      lineGeometry.attributes.position.needsUpdate = true;
      lineGeometry.attributes.color.needsUpdate = true;
      lineGeometry.setDrawRange(0, lineIdx * 2);

      // Animate flowing data packets
      packets.forEach((packet) => {
        packet.progress += packet.speed * (introSpinFactor * 0.25 + 0.75);
        if (packet.progress >= 1.0) {
          packet.progress = 0;
          // Shift to a new connection path if available
          if (connectionPool.length > 0) {
            const path = connectionPool[Math.floor(Math.random() * connectionPool.length)];
            packet.fromNode = path.from;
            packet.toNode = path.to;
          } else {
            // Fallback random
            const fromIdx = Math.floor(Math.random() * techNodes.length);
            packet.fromNode = techNodes[fromIdx];
            packet.toNode = techNodes[(fromIdx + 1) % techNodes.length];
          }
        }

        if (packet.fromNode && packet.toNode) {
          packet.mesh.position.lerpVectors(
            packet.fromNode.mesh.position,
            packet.toNode.mesh.position,
            packet.progress
          );
          // Scale based on scroll
          const scaleVal = t < 1 ? 1.0 - stageProgress * 0.35 : 0.65;
          packet.mesh.scale.set(scaleVal, scaleVal, scaleVal);
        }
      });

      // Smooth lights color transitions
      light1.color.lerp(targetColors.light1, 0.04);
      light2.color.lerp(targetColors.light2, 0.04);
      mouseLight.color.lerp(targetColors.light3, 0.04);

      // Background particles morph animations
      if (frameCount % 2 === 0) {
        const partPos = particlesGeometry.attributes.position.array;
        const runColorUpdate = colorTransitionFrames > 0;
        const partColors = particlesGeometry.attributes.color.array;

        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          let tx = 0, ty = 0, tz = 0;

          const ringIndex = i % 3;
          const ringRadius = particleRadii[i];
          const ringAngle = particleAngles[i] + timeFactor * (0.35 + ringIndex * 0.15);
          let gxGyro = 0, gyGyro = 0, gzGyro = 0;
          if (ringIndex === 0) {
            gxGyro = Math.cos(ringAngle) * ringRadius;
            gyGyro = Math.sin(timeFactor + ringAngle * 2.0) * 0.05;
            gzGyro = Math.sin(ringAngle) * ringRadius;
          } else if (ringIndex === 1) {
            gxGyro = Math.sin(timeFactor + ringAngle * 2.0) * 0.05;
            gyGyro = Math.cos(ringAngle) * ringRadius;
            gzGyro = Math.sin(ringAngle) * ringRadius;
          } else {
            gxGyro = Math.cos(ringAngle) * ringRadius;
            gyGyro = Math.sin(ringAngle) * ringRadius;
            gzGyro = Math.sin(timeFactor + ringAngle * 2.0) * 0.05;
          }

          const streamSpeed = 1.3;
          let gxGrid = posGrid[i3] + timeFactor * streamSpeed;
          gxGrid = ((gxGrid + 6) % 12) - 6;
          const gyGrid = posGrid[i3 + 1];
          const gzGrid = posGrid[i3 + 2];

          const hAngle = posHelixAngle[i] + timeFactor * 0.8;
          const isArm = (i % 2 === 0);
          const factor = isArm ? 1 : -1;
          const hRadius = 1.55;
          const gxHelix = Math.cos(hAngle) * hRadius * factor;
          const gyHelix = posHelix[i3 + 1];
          const gzHelix = Math.sin(hAngle) * hRadius * factor;

          const tunnelSpeed = 1.8;
          const tRadius = posTunnelRadius[i];
          const tAngle = posTunnelAngle[i];
          let gzTunnel = posTunnelZ[i] - timeFactor * tunnelSpeed;
          gzTunnel = ((gzTunnel + 5) % 10) - 5;
          const gxTunnel = Math.cos(tAngle) * tRadius;
          const gyTunnel = Math.sin(tAngle) * tRadius;

          const rainSpeed = 2.8;
          const rRadius = posVortexRadius[i];
          const rAngle = posVortexAngle[i];
          let gyVortex = posVortexY[i] - timeFactor * rainSpeed;
          gyVortex = ((gyVortex + 3.5) % 7.0) - 3.5;
          const gxVortex = Math.cos(rAngle) * rRadius;
          const gzVortex = Math.sin(rAngle) * rRadius;

          if (activeStage === 0) {
            tx = gxGyro + (gxGrid - gxGyro) * stageProgress;
            ty = gyGyro + (gyGrid - gyGyro) * stageProgress;
            tz = gzGyro + (gzGrid - gzGyro) * stageProgress;
          } else if (activeStage === 1) {
            tx = gxGrid + (gxHelix - gxGrid) * stageProgress;
            ty = gyGrid + (gyHelix - gyGrid) * stageProgress;
            tz = gzGrid + (gzHelix - gzGrid) * stageProgress;
          } else if (activeStage === 2) {
            tx = gxHelix + (gxTunnel - gxHelix) * stageProgress;
            ty = gyHelix + (gyTunnel - gyHelix) * stageProgress;
            tz = gzHelix + (gzTunnel - gzHelix) * stageProgress;
          } else {
            tx = gxTunnel + (gxVortex - gxTunnel) * stageProgress;
            ty = gyTunnel + (gyVortex - gyTunnel) * stageProgress;
            tz = gzTunnel + (gzVortex - gzTunnel) * stageProgress;
          }

          if (mouse.active) {
            const dx = tx - mouseWorld.x;
            const dy = ty - mouseWorld.y;
            const dz = tz - mouseWorld.z;
            const distSq = dx * dx + dy * dy + dz * dz;
            if (distSq < 3.5 && distSq > 0.0001) {
              const dist = Math.sqrt(distSq);
              const repulsionForce = (1.85 - dist) / 1.85;
              tx += (dx / dist) * repulsionForce * 0.75;
              ty += (dy / dist) * repulsionForce * 0.75;
              tz += (dz / dist) * repulsionForce * 0.75;
            }
          }

          partPos[i3] += (tx - partPos[i3]) * 0.05;
          partPos[i3 + 1] += (ty - partPos[i3 + 1]) * 0.05;
          partPos[i3 + 2] += (tz - partPos[i3 + 2]) * 0.05;

          if (runColorUpdate) {
            const baseColor = targetColors.palette[i % 3].clone();
            baseColor.lerp(new THREE.Color(0xffffff), Math.max(0, 1.0 - ringRadius / 3.0) * 0.5);
            partColors[i3] += (baseColor.r - partColors[i3]) * 0.04;
            partColors[i3 + 1] += (baseColor.g - partColors[i3 + 1]) * 0.04;
            partColors[i3 + 2] += (baseColor.b - partColors[i3 + 2]) * 0.04;
          }
        }
        
        particlesGeometry.attributes.position.needsUpdate = true;
        if (runColorUpdate) {
          particlesGeometry.attributes.color.needsUpdate = true;
        }
      }

      if (colorTransitionFrames > 0 && frameCount % 2 === 0) {
        colorTransitionFrames--;
      }
      
      frameId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    resize();
    animate();
    
    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      
      coreGeometry.dispose();
      coreMaterial.dispose();
      haloGeometry.dispose();
      haloMaterial.dispose();
      
      techGrid.dispose();
      ringGeometries.forEach(g => g.dispose());
      ringMaterials.forEach(m => m.dispose());
      
      geometries.forEach(g => g.dispose());
      purpleNodeMaterial.dispose();
      indigoNodeMaterial.dispose();
      
      lineGeometry.dispose();
      lineMaterial.dispose();

      packetGeometry.dispose();
      packetMaterial.dispose();

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
