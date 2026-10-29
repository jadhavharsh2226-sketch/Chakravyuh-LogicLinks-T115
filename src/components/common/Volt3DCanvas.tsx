import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { VoltExpression } from './VoltCharacter';
import { sounds } from '../../services/soundEffects';

interface Volt3DCanvasProps {
  expression?: VoltExpression;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

export const Volt3DCanvas: React.FC<Volt3DCanvasProps> = ({
  expression = 'happy',
  size = 'md',
  className = '',
  onClick,
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Dimension mapping
  const dimensions = {
    sm: { width: 64, height: 64 },
    md: { width: 110, height: 110 },
    lg: { width: 170, height: 170 },
    xl: { width: 240, height: 240 },
    hero: { width: 340, height: 340 },
  }[size];

  // Refs for animation parameters
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const isBlinkingRef = useRef(false);
  const blinkProgressRef = useRef(0);
  const spinAngleRef = useRef(0);
  const isSpinningRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = dimensions.width;
    const height = dimensions.height;

    // 1. Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. Lighting Setup (Cyan fill + Neon lime key light + Specular shine)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xA6FF00, 2.2); // Lime key from top-right
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x00E5FF, 1.8); // Cyan fill from bottom-left
    fillLight.position.set(-3, -2, 2);
    scene.add(fillLight);

    const rimLight = new THREE.SpotLight(0xffffff, 2.5);
    rimLight.position.set(0, 5, 2);
    rimLight.angle = Math.PI / 4;
    rimLight.penumbra = 0.5;
    scene.add(rimLight);

    // Root Group for the robot
    const robotGroup = new THREE.Group();
    scene.add(robotGroup);

    // 3. Create Procedural Textures
    // Head Gradient Texture (Cyan to Neon-Lime with soft specular highlight)
    const createGradientTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;

      // Diagonal gradient: Cyan at bottom-left to Electric Lime at top-right
      const grad = ctx.createLinearGradient(0, 512, 512, 0);
      grad.addColorStop(0.0, '#00C8FF'); // Deep bright cyan
      grad.addColorStop(0.4, '#1EE4DB'); // Bright turquoise
      grad.addColorStop(0.7, '#60FF70'); // Vibrant mint
      grad.addColorStop(1.0, '#B2FF38'); // Electric lime green
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      // Soft white specular gloss highlight on upper right curve (just like user's photo!)
      const glossGrad = ctx.createRadialGradient(380, 110, 5, 380, 110, 140);
      glossGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
      glossGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.4)');
      glossGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = glossGrad;
      ctx.fillRect(0, 0, 512, 512);

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    const gradientTex = createGradientTexture();

    // Robot Shell Material (Glossy clearcoat finish)
    const shellMaterial = new THREE.MeshPhysicalMaterial({
      map: gradientTex,
      roughness: 0.15,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.9,
    });

    // 4. Robot Head Geometry
    const headGroup = new THREE.Group();
    robotGroup.add(headGroup);

    const headGeo = new THREE.SphereGeometry(0.85, 48, 48);
    const headMesh = new THREE.Mesh(headGeo, shellMaterial);
    headMesh.scale.set(1.08, 0.94, 0.96); // Adorable squircle proportions
    headMesh.position.set(0, 0.15, 0);
    headGroup.add(headMesh);

    // Crown / Antenna Ring
    const ringGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.08, 32);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x55E9A8,
      roughness: 0.2,
      metalness: 0.1,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.set(0, 0.95, 0);
    headGroup.add(ringMesh);

    // Floating Antenna Bead (Free-floating glowing cyan sphere above head)
    const antennaGeo = new THREE.SphereGeometry(0.09, 32, 32);
    const antennaMat = new THREE.MeshStandardMaterial({
      color: 0x22F4EE,
      emissive: 0x00D4FF,
      emissiveIntensity: 0.8,
      roughness: 0.1,
    });
    const antennaMesh = new THREE.Mesh(antennaGeo, antennaMat);
    antennaMesh.position.set(0, 1.28, 0);
    headGroup.add(antennaMesh);

    // Antenna Point Light for subtle cyan glow
    const antennaLight = new THREE.PointLight(0x00E5FF, 0.8, 2);
    antennaLight.position.set(0, 1.28, 0.2);
    headGroup.add(antennaLight);

    // 5. Visor with Dynamic Face Canvas Texture (Eyes & Mouth from user's image)
    const faceCanvas = document.createElement('canvas');
    faceCanvas.width = 512;
    faceCanvas.height = 256;
    const faceCtx = faceCanvas.getContext('2d')!;
    const faceTexture = new THREE.CanvasTexture(faceCanvas);
    faceTexture.colorSpace = THREE.SRGBColorSpace;

    // Curved Visor Mesh
    const visorGeo = new THREE.CylinderGeometry(
      0.72,
      0.72,
      0.46,
      32,
      1,
      false,
      Math.PI * 0.27,
      Math.PI * 0.46
    );
    const visorMat = new THREE.MeshPhysicalMaterial({
      map: faceTexture,
      roughness: 0.1,
      metalness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      transparent: true,
    });
    const visorMesh = new THREE.Mesh(visorGeo, visorMat);
    visorMesh.rotation.y = -Math.PI / 2;
    visorMesh.position.set(0, 0.14, 0.18);
    headGroup.add(visorMesh);

    // Function to draw the exact cute anime face from the user's uploaded picture
    const drawFace = (eyeHeightPct: number, lookOffsetX: number, lookOffsetY: number) => {
      faceCtx.clearRect(0, 0, 512, 256);

      // Dark glossy visor background
      const visorBg = faceCtx.createLinearGradient(0, 0, 0, 256);
      visorBg.addColorStop(0, '#0E1722');
      visorBg.addColorStop(1, '#080E14');
      faceCtx.fillStyle = visorBg;
      faceCtx.beginPath();
      faceCtx.roundRect(40, 20, 432, 216, 80);
      faceCtx.fill();

      // Top specular glass highlight curve
      faceCtx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      faceCtx.lineWidth = 6;
      faceCtx.beginPath();
      faceCtx.arc(360, 40, 90, Math.PI * 0.9, Math.PI * 1.5);
      faceCtx.stroke();

      const eyeCenterX1 = 180 + lookOffsetX * 18;
      const eyeCenterX2 = 332 + lookOffsetX * 18;
      const eyeCenterY = 115 + lookOffsetY * 12;

      // Handle expressions
      if (expression === 'celebrating') {
        // Joyful anime crescent eyes (^ ^)
        faceCtx.strokeStyle = '#FFFFFF';
        faceCtx.lineWidth = 12;
        faceCtx.lineCap = 'round';
        // Left eye arc
        faceCtx.beginPath();
        faceCtx.arc(eyeCenterX1, eyeCenterY, 32, Math.PI * 1.15, Math.PI * 1.85);
        faceCtx.stroke();
        // Right eye arc
        faceCtx.beginPath();
        faceCtx.arc(eyeCenterX2, eyeCenterY, 32, Math.PI * 1.15, Math.PI * 1.85);
        faceCtx.stroke();
      } else if (expression === 'curious_coding') {
        // Tech coder brackets: < and >
        faceCtx.fillStyle = '#C6FF3D';
        faceCtx.font = 'bold 55px monospace';
        faceCtx.textAlign = 'center';
        faceCtx.textBaseline = 'middle';
        faceCtx.fillText('<', eyeCenterX1, eyeCenterY);
        faceCtx.fillText('>', eyeCenterX2, eyeCenterY);
      } else {
        // Standard / Happy / Thinking Eyes (Big sparkling anime eyes with double reflection)
        const currentEyeHeight = Math.max(3, 44 * eyeHeightPct);
        const eyeWidth = 32;

        const drawEye = (cx: number, cy: number) => {
          if (eyeHeightPct < 0.2) {
            // Closed/Blinking eye slit
            faceCtx.strokeStyle = '#FFFFFF';
            faceCtx.lineWidth = 6;
            faceCtx.lineCap = 'round';
            faceCtx.beginPath();
            faceCtx.moveTo(cx - 24, cy);
            faceCtx.lineTo(cx + 24, cy);
            faceCtx.stroke();
            return;
          }

          // Outer Eye Circle / Oval
          faceCtx.fillStyle = '#FFFFFF';
          faceCtx.beginPath();
          faceCtx.ellipse(cx, cy, eyeWidth, currentEyeHeight, 0, 0, Math.PI * 2);
          faceCtx.fill();

          // Dark Inner Iris
          faceCtx.fillStyle = '#060B10';
          faceCtx.beginPath();
          faceCtx.ellipse(
            cx + lookOffsetX * 4,
            cy + lookOffsetY * 4,
            eyeWidth * 0.88,
            currentEyeHeight * 0.88,
            0,
            0,
            Math.PI * 2
          );
          faceCtx.fill();

          // Large Top-Right Specular Highlight (The sparkle from user's image!)
          faceCtx.fillStyle = '#FFFFFF';
          faceCtx.beginPath();
          faceCtx.arc(
            cx + 8 + lookOffsetX * 3,
            cy - 12 * eyeHeightPct + lookOffsetY * 3,
            11 * eyeHeightPct,
            0,
            Math.PI * 2
          );
          faceCtx.fill();

          // Secondary Bottom-Left Reflection
          faceCtx.fillStyle = '#FFFFFF';
          faceCtx.beginPath();
          faceCtx.arc(
            cx - 10 + lookOffsetX * 3,
            cy + 10 * eyeHeightPct + lookOffsetY * 3,
            6 * eyeHeightPct,
            0,
            Math.PI * 2
          );
          faceCtx.fill();
        };

        drawEye(eyeCenterX1, eyeCenterY);
        drawEye(eyeCenterX2, eyeCenterY);
      }

      // Mouth (Cute wide smile with white tooth highlight from user's photo!)
      const mouthY = 175;
      faceCtx.fillStyle = '#FFFFFF';
      faceCtx.beginPath();
      faceCtx.arc(256 + lookOffsetX * 8, mouthY, 26, 0.1 * Math.PI, 0.9 * Math.PI);
      faceCtx.lineTo(256 + lookOffsetX * 8 - 25, mouthY);
      faceCtx.closePath();
      faceCtx.fill();

      // Update texture
      faceTexture.needsUpdate = true;
    };

    drawFace(1.0, 0, 0);

    // 6. Robot Body & Pod Arms (Hovering floating torso)
    const bodyGroup = new THREE.Group();
    robotGroup.add(bodyGroup);

    const bodyGeo = new THREE.SphereGeometry(0.55, 36, 36);
    const bodyMesh = new THREE.Mesh(bodyGeo, shellMaterial);
    bodyMesh.scale.set(0.92, 0.98, 0.78);
    bodyMesh.position.set(0, -0.68, 0);
    bodyGroup.add(bodyMesh);

    // Left Arm / Pod
    const armGeo = new THREE.SphereGeometry(0.2, 24, 24);
    const armMat = shellMaterial.clone();

    const leftArm = new THREE.Mesh(armGeo, armMat);
    leftArm.scale.set(0.65, 1.25, 0.75);
    leftArm.position.set(-0.54, -0.65, 0.05);
    leftArm.rotation.z = 0.22;
    bodyGroup.add(leftArm);

    // Right Arm / Pod
    const rightArm = new THREE.Mesh(armGeo, armMat);
    rightArm.scale.set(0.65, 1.25, 0.75);
    rightArm.position.set(0.54, -0.65, 0.05);
    rightArm.rotation.z = -0.22;
    bodyGroup.add(rightArm);

    // 7. Ground Hovering Shadow (Dynamically scales with bot height)
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d')!;
    const shadowGrad = sCtx.createRadialGradient(64, 64, 5, 64, 64, 60);
    shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
    shadowGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.18)');
    shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = shadowGrad;
    sCtx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(1.6, 0.8);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, -1.35, 0);
    scene.add(shadowMesh);

    // 8. Mouse Tracking Event Listeners
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      // Calculate normalized offset from center of container (-1 to 1)
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = (e.clientX - centerX) / (window.innerWidth / 2);
      const dy = (e.clientY - centerY) / (window.innerHeight / 2);

      mouseRef.current.targetX = Math.max(-1, Math.min(1, dx));
      mouseRef.current.targetY = Math.max(-1, Math.min(1, dy));
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 9. Blinking Timer Loop
    let nextBlinkTime = performance.now() + 2500 + Math.random() * 2000;

    // 10. Main 60 FPS Render & Animation Loop
    let startTime = performance.now();

    const animate = (time: number) => {
      animFrameRef.current = requestAnimationFrame(animate);

      const elapsed = (time - startTime) * 0.001;

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      // Handle 3D Spin (Click reaction)
      if (isSpinningRef.current) {
        spinAngleRef.current += 0.18;
        if (spinAngleRef.current >= Math.PI * 2) {
          spinAngleRef.current = 0;
          isSpinningRef.current = false;
        }
      }

      // Hovering Floating Physics
      const hoverY = Math.sin(elapsed * 2.2) * 0.08;
      const hoverTilt = Math.cos(elapsed * 1.8) * 0.03;

      robotGroup.position.y = hoverY;
      robotGroup.rotation.z = hoverTilt;

      // Head Mouse Tracking Tilt
      headGroup.rotation.y = mouseRef.current.x * 0.45 + spinAngleRef.current;
      headGroup.rotation.x = -mouseRef.current.y * 0.3;

      // Antenna Spring Float (lags head slightly)
      antennaMesh.position.y = 1.28 + Math.sin(elapsed * 3.0) * 0.04;

      // Pod Arms Sway
      leftArm.rotation.z = 0.22 + Math.cos(elapsed * 2.2) * 0.06;
      rightArm.rotation.z = -0.22 - Math.cos(elapsed * 2.2) * 0.06;

      // Shadow dynamically reacts to bot altitude
      const shadowScale = 1.0 - hoverY * 1.5;
      shadowMesh.scale.set(shadowScale, shadowScale, shadowScale);
      shadowMat.opacity = 0.85 - hoverY * 2.0;

      // Blinking Logic
      if (!isBlinkingRef.current && time > nextBlinkTime) {
        isBlinkingRef.current = true;
        blinkProgressRef.current = 0;
      }

      if (isBlinkingRef.current) {
        blinkProgressRef.current += 0.15;
        // Blink curve: 0 -> 1 -> 0
        const blinkPhase = Math.sin(blinkProgressRef.current * Math.PI);
        const eyeHeight = 1.0 - blinkPhase;
        drawFace(eyeHeight, mouseRef.current.x, mouseRef.current.y);

        if (blinkProgressRef.current >= 1.0) {
          isBlinkingRef.current = false;
          nextBlinkTime = time + 2500 + Math.random() * 3000;
          drawFace(1.0, mouseRef.current.x, mouseRef.current.y);
        }
      } else {
        // Redraw gaze on mouse move
        drawFace(1.0, mouseRef.current.x, mouseRef.current.y);
      }

      renderer.render(scene, camera);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
      gradientTex.dispose();
      faceTexture.dispose();
      shadowTex.dispose();
    };
  }, [dimensions.width, dimensions.height, expression, interactive]);

  const handleClick = () => {
    sounds.playChirp();
    // Trigger 3D spin backflip!
    isSpinningRef.current = true;
    spinAngleRef.current = 0;
    if (onClick) onClick();
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      style={{ width: dimensions.width, height: dimensions.height }}
      className={`relative inline-block cursor-pointer select-none transition-transform duration-200 hover:scale-105 active:scale-95 ${className}`}
      title="Volt — Click to trigger a 3D spin!"
    />
  );
};
