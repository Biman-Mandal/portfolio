"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeHero() {
  const mountRef = useRef(null);

  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent));
    if (isMobile) {
      return;
    }
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
    const coreGeometry = new THREE.IcosahedronGeometry(1.2, 2);
    const originalPositions = coreGeometry.attributes.position.array.slice();

    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      roughness: 0.1,
      metalness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide
    });

    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    group.add(core);

    // 3. Inner Glowing Sphere
    const innerGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0x1d4ed8,
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
    const satelliteGeom = new THREE.SphereGeometry(0.05, 8, 8);
    const satellites = [];

    for (let i = 0; i < 3; i++) {
      const radius = 1.8 + i * 0.6;
      const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.006, 6, 60), ringMaterial);
      ring.rotation.x = Math.PI / 2 + (i * 0.2);
      group.add(ring);

      const satMat = new THREE.MeshBasicMaterial({
        color: 0xeab308,
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

    // 5. Scroll-linked Morphing Formations (600 Particles)
    const particleCount = 600; 

    const particlesGeometry = new THREE.BufferGeometry();
    
    // Arrays for active particle rendering attributes
    const activePositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Precomputed formations coordinate arrays
    const posGrid = new Float32Array(particleCount * 3);
    const posHelix = new Float32Array(particleCount * 3);
    const posHelixAngle = new Float32Array(particleCount);
    
    // Vortex parameter caches (reused for Stage 4 Digital Rain)
    const posVortexRadius = new Float32Array(particleCount);
    const posVortexAngle = new Float32Array(particleCount);
    const posVortexY = new Float32Array(particleCount);

    // Cyber Data Tunnel parameter caches (Stage 3)
    const posTunnelAngle = new Float32Array(particleCount);
    const posTunnelRadius = new Float32Array(particleCount);
    const posTunnelZ = new Float32Array(particleCount);

    // Gyroscope HUD parameters (Stage 0)
    const particleAngles = new Float32Array(particleCount);
    const particleRadii = new Float32Array(particleCount);

    // Professional Steel Teal/Blue vs Slate Indigo/Gold color combinations
    const colorCombos = {
      combo1: {
        light: [new THREE.Color(0x0f766e), new THREE.Color(0x1d4ed8), new THREE.Color(0x0284c7)],
        dark: [new THREE.Color(0x14b8a6), new THREE.Color(0x3b82f6), new THREE.Color(0x0ea5e9)]
      },
      combo2: {
        light: [new THREE.Color(0x4338ca), new THREE.Color(0xb45309), new THREE.Color(0x1e3a8a)],
        dark: [new THREE.Color(0x6366f1), new THREE.Color(0xfbbf24), new THREE.Color(0x4f46e5)]
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
      
      // 1. Gyroscope HUD parameters (Stage 0)
      const ringIndex = i % 3;
      const r = 1.8 + ringIndex * 0.6 + (Math.random() - 0.5) * 0.15;
      const angle = Math.random() * Math.PI * 2;
      particleRadii[i] = r;
      particleAngles[i] = angle;

      // 2. Data Streams parameters (Stage 1)
      const level = (i % 6) - 2.5;
      const streamX = ((i / 6) % 100 - 50) * 0.12;
      posGrid[i3] = streamX;
      posGrid[i3 + 1] = level * 0.8 + (Math.random() - 0.5) * 0.05;
      posGrid[i3 + 2] = (Math.random() - 0.5) * 1.5;

      // 3. Helix coordinates (Stage 2)
      const helixAngle = (i / particleCount) * Math.PI * 8; // 4 full turns
      posHelixAngle[i] = helixAngle;
      const isArmA = (i % 2 === 0);
      const factor = isArmA ? 1 : -1;
      const hRadius = 1.6 + (Math.random() - 0.5) * 0.1;
      posHelix[i3] = Math.cos(helixAngle) * hRadius * factor;
      posHelix[i3 + 1] = (i / particleCount - 0.5) * 6.5;
      posHelix[i3 + 2] = Math.sin(helixAngle) * hRadius * factor;

      // 4. Cyber Data Tunnel parameters (Stage 3)
      const ringGroup = i % 8; // 8 segments along Z
      const tunnelZ = (ringGroup - 3.5) * 1.2;
      const tunnelAngle = (i / particleCount) * Math.PI * 2 * (particleCount / 8);
      const tunnelRadius = 2.2 + (Math.random() - 0.5) * 0.15;
      posTunnelAngle[i] = tunnelAngle;
      posTunnelRadius[i] = tunnelRadius;
      posTunnelZ[i] = tunnelZ;

      // 5. Digital Rain parameters (Stage 4)
      const vr = Math.sqrt(Math.random()) * 3.5 + 0.3;
      const vAngle = Math.random() * Math.PI * 2;
      posVortexRadius[i] = vr;
      posVortexAngle[i] = vAngle;
      posVortexY[i] = (Math.random() - 0.5) * 6.0;

      // Initial active positions (Gyroscope HUD rings on X-Z, Y-Z, X-Y planes)
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
      size: 0.14,
      map: createParticleTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const galaxyParticles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(galaxyParticles);

    scene.add(new THREE.AmbientLight(0xffffff, 0.25));
    const light1 = new THREE.PointLight(activePalette[0], 15, 25);
    light1.position.set(5, 5, 5);
    scene.add(light1);
    const light2 = new THREE.PointLight(activePalette[1], 12, 20);
    light2.position.set(-5, -3, 4);
    scene.add(light2);
    const mouseLight = new THREE.PointLight(activePalette[2], 10, 12);
    mouseLight.position.set(0, 0, 3);
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

    // Caching window and document dimensions for reflow-free scroll computations
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

    // Make an initial update to cache the dimensions and sync the scroll progress properly
    updateHeights();
    onScroll();

    const animate = () => {
      if (!isCanvasVisible) {
        frameId = null;
        return;
      }
      frameCount++;
      const elapsed = clock.getElapsedTime();
      const timeFactor = elapsed * 0.6;
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

      camera.position.x += ( (t < 2 ? mouse.x * 1.5 : (t < 3 ? mouse.x * 1.5 + (t-2)*2 : 0)) - camera.position.x) * 0.05;
      camera.lookAt(0, (t < 1 ? stageProgress * 0.3 : (t < 2 ? 0.3 - 0.3*(t-1) : (t < 3 ? (t-2)*-0.5 : -0.5 + (t-3)*1.0))), 0);

      group.position.x += ( (t < 1 ? (window.innerWidth < 800 ? 0 : 2.2) - stageProgress * (window.innerWidth < 800 ? 1.5 : 4.8) : 0) - group.position.x) * 0.05;
      
      const scaleVal = core.scale.x + ((t < 1 ? 1.0 - stageProgress * 0.45 : (t < 2 ? 0.55 + 0.15*(t-1) : 0.5)) - core.scale.x) * 0.05;
      core.scale.set(scaleVal, scaleVal, scaleVal);

      core.rotation.y = timeFactor * 0.15 * introSpinFactor;
      innerCore.rotation.x = -timeFactor * 0.25 * introSpinFactor;
      const pulse = 1.0 + Math.sin(timeFactor * 1.8 * introSpinFactor) * 0.06;
      innerCore.scale.set(pulse, pulse, pulse);

      // Update orbits
      satellites.forEach((sat) => {
        sat.angle += sat.speed * 0.012 * introSpinFactor;
        sat.mesh.position.set(
          Math.cos(sat.angle) * sat.radius,
          Math.sin(sat.angle * 0.5) * 0.15,
          Math.sin(sat.angle) * sat.radius
        );
        sat.mesh.position.applyAxisAngle(new THREE.Vector3(1, 0, 0), sat.rotX);
        sat.mesh.material.color.lerp(targetColors.light2, 0.04);
      });

      // Smooth lights and materials color transitions
      innerCore.material.color.lerp(targetColors.innerCore, 0.04);
      light1.color.lerp(targetColors.light1, 0.04);
      light2.color.lerp(targetColors.light2, 0.04);
      mouseLight.color.lerp(targetColors.light3, 0.04);

      if (frameCount % 2 === 0) {
        const partPos = particlesGeometry.attributes.position.array;
        const runColorUpdate = colorTransitionFrames > 0;
        const partColors = particlesGeometry.attributes.color.array;

        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          let tx = 0, ty = 0, tz = 0;

          // Target 0: Gyroscope HUD Rings (Active Orbit Rotations)
          const ringIndex = i % 3;
          const ringRadius = particleRadii[i];
          const ringAngle = particleAngles[i] + timeFactor * (0.4 + ringIndex * 0.2);
          let gxGyro = 0, gyGyro = 0, gzGyro = 0;
          if (ringIndex === 0) {
            gxGyro = Math.cos(ringAngle) * ringRadius;
            gyGyro = Math.sin(timeFactor + ringAngle * 2.0) * 0.06;
            gzGyro = Math.sin(ringAngle) * ringRadius;
          } else if (ringIndex === 1) {
            gxGyro = Math.sin(timeFactor + ringAngle * 2.0) * 0.06;
            gyGyro = Math.cos(ringAngle) * ringRadius;
            gzGyro = Math.sin(ringAngle) * ringRadius;
          } else {
            gxGyro = Math.cos(ringAngle) * ringRadius;
            gyGyro = Math.sin(ringAngle) * ringRadius;
            gzGyro = Math.sin(timeFactor + ringAngle * 2.0) * 0.06;
          }

          // Target 1: Flowing Data Streams (Scrolling X coordinates)
          const streamSpeed = 1.5;
          let gxGrid = posGrid[i3] + timeFactor * streamSpeed;
          // Wrap X coordinates between -6 and 6
          gxGrid = ((gxGrid + 6) % 12) - 6;
          const gyGrid = posGrid[i3 + 1];
          const gzGrid = posGrid[i3 + 2];

          // Target 2: Spinning Helix
          const hAngle = posHelixAngle[i] + timeFactor * 0.9;
          const isArmA = (i % 2 === 0);
          const factor = isArmA ? 1 : -1;
          const hRadius = 1.6;
          const gxHelix = Math.cos(hAngle) * hRadius * factor;
          const gyHelix = posHelix[i3 + 1];
          const gzHelix = Math.sin(hAngle) * hRadius * factor;

          // Target 3: Scrolling Data Tunnel (Moving Z coordinates)
          const tunnelSpeed = 2.0;
          const tRadius = posTunnelRadius[i];
          const tAngle = posTunnelAngle[i];
          let gzTunnel = posTunnelZ[i] - timeFactor * tunnelSpeed;
          // Wrap Z coordinates between -5 and 5
          gzTunnel = ((gzTunnel + 5) % 10) - 5;
          const gxTunnel = Math.cos(tAngle) * tRadius;
          const gyTunnel = Math.sin(tAngle) * tRadius;

          // Target 4: Falling Digital Rain
          const rainSpeed = 3.0;
          const rRadius = posVortexRadius[i];
          const rAngle = posVortexAngle[i];
          let gyVortex = posVortexY[i] - timeFactor * rainSpeed;
          // Wrap Y coordinates between -3.5 and 3.5
          gyVortex = ((gyVortex + 3.5) % 7.0) - 3.5;
          const gxVortex = Math.cos(rAngle) * rRadius;
          const gzVortex = Math.sin(rAngle) * rRadius;

          // Segment interpolation
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

          // Apply mouse physics: repel particles nearby in world space
          if (mouse.active) {
            const dx = tx - mouseWorld.x;
            const dy = ty - mouseWorld.y;
            const dz = tz - mouseWorld.z;
            const distSq = dx * dx + dy * dy + dz * dz;
            if (distSq < 4.0 && distSq > 0.0001) {
              const dist = Math.sqrt(distSq);
              const repulsionForce = (2.0 - dist) / 2.0;
              tx += (dx / dist) * repulsionForce * 0.9;
              ty += (dy / dist) * repulsionForce * 0.9;
              tz += (dz / dist) * repulsionForce * 0.9;
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
      innerGeometry.dispose();
      innerMaterial.dispose();
      satelliteGeom.dispose();

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
