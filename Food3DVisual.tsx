import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Food3DConfig, Food3DModelPreset } from '../types';
import { 
  Sparkles, 
  Flame, 
  RotateCw, 
  Eye, 
  Volume2, 
  Layers, 
  Maximize2,
  RefreshCw,
  Info
} from 'lucide-react';

interface Food3DVisualProps {
  config?: Food3DConfig;
  className?: string;
  interactive?: boolean;
  showControls?: boolean;
  onDishSelect?: () => void;
}

export const Food3DVisual: React.FC<Food3DVisualProps> = ({
  config,
  className = '',
  interactive = true,
  showControls = true,
  onDishSelect
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [isWebGLSupported, setIsWebGLSupported] = useState<boolean>(true);
  const [isRotating, setIsRotating] = useState<boolean>(config?.enableAutoRotate ?? true);
  const [viewAngle, setViewAngle] = useState<'perspective' | 'top' | 'front'>('perspective');
  const [showWireframe, setShowWireframe] = useState<boolean>(false);
  const [activeParticles, setActiveParticles] = useState<boolean>(config?.enableSteamOrEmbers ?? true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
  // Animation refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const foodGroupRef = useRef<THREE.Group | null>(null);
  const particlesGroupRef = useRef<THREE.Points | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const pointLightRef = useRef<THREE.PointLight | null>(null);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());

  // Mouse drag tracking
  const previousMousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetRotation = useRef<{ x: number; y: number }>({ x: 0.3, y: 0 });
  const currentRotation = useRef<{ x: number; y: number }>({ x: 0.3, y: 0 });

  const activePreset: Food3DModelPreset = config?.modelPreset || 'karahi';
  const glowType = config?.glowIntensity || 'radiant';
  const particleType = config?.particleEffect || 'embers';
  const rotationSpeed = (config?.rotationSpeed ?? 1.0) * 0.008;
  const floatingDist = (config?.floatingDistance ?? 12) * 0.015;
  const animSpeed = (config?.animationSpeed ?? 1.0);

  // Determine glow styling
  const getGlowColor = () => {
    switch (glowType) {
      case 'fiery': return '#ff4500';
      case 'ember': return '#ea580c';
      case 'subtle': return '#d4af37';
      case 'radiant':
      default: return '#f59e0b';
    }
  };

  // Helper to build procedural 3D food models
  const buildFoodGeometry = useCallback((preset: Food3DModelPreset, isWire: boolean): THREE.Group => {
    const group = new THREE.Group();

    // Material helpers
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.25,
      wireframe: isWire
    });

    const ironMat = new THREE.MeshStandardMaterial({
      color: 0x1f1f22,
      metalness: 0.9,
      roughness: 0.35,
      wireframe: isWire
    });

    const bronzeMat = new THREE.MeshStandardMaterial({
      color: 0xb45309,
      metalness: 0.7,
      roughness: 0.4,
      wireframe: isWire
    });

    const bunMat = new THREE.MeshStandardMaterial({
      color: 0xc2782e,
      roughness: 0.6,
      metalness: 0.1,
      wireframe: isWire
    });

    const pattyMat = new THREE.MeshStandardMaterial({
      color: 0x3f1e10,
      roughness: 0.8,
      metalness: 0.15,
      wireframe: isWire
    });

    const cheeseMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.3,
      metalness: 0.2,
      emissive: 0x78350f,
      emissiveIntensity: 0.2,
      wireframe: isWire
    });

    const tomatoMat = new THREE.MeshStandardMaterial({
      color: 0xd92626,
      roughness: 0.2,
      metalness: 0.1,
      wireframe: isWire
    });

    const herbMat = new THREE.MeshStandardMaterial({
      color: 0x16a34a,
      roughness: 0.4,
      wireframe: isWire
    });

    const meatMat = new THREE.MeshStandardMaterial({
      color: 0x852e18,
      roughness: 0.55,
      metalness: 0.2,
      wireframe: isWire
    });

    const gravyMat = new THREE.MeshStandardMaterial({
      color: 0xb91c1c,
      roughness: 0.2,
      metalness: 0.3,
      emissive: 0x7f1d1d,
      emissiveIntensity: 0.35,
      wireframe: isWire
    });

    const emberMat = new THREE.MeshStandardMaterial({
      color: 0xff3b00,
      emissive: 0xff4500,
      emissiveIntensity: 1.2,
      roughness: 0.8,
      wireframe: isWire
    });

    // 1. BASE SERVING PLATTER / CHARCOAL HEARTH DISH
    const basePlateGeo = new THREE.CylinderGeometry(2.3, 2.0, 0.15, 32);
    const basePlate = new THREE.Mesh(basePlateGeo, ironMat);
    basePlate.position.y = -0.55;
    basePlate.receiveShadow = true;
    group.add(basePlate);

    // Glowing rim ring
    const rimGeo = new THREE.TorusGeometry(2.28, 0.04, 16, 48);
    const rimMesh = new THREE.Mesh(rimGeo, goldMat);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = -0.48;
    group.add(rimMesh);

    // Glowing charcoal embers under the dish
    for (let i = 0; i < 7; i++) {
      const emberGeo = new THREE.DodecahedronGeometry(0.12 + Math.random() * 0.08, 0);
      const emberMesh = new THREE.Mesh(emberGeo, emberMat);
      const angle = (i / 7) * Math.PI * 2;
      emberMesh.position.set(
        Math.cos(angle) * 1.6 + (Math.random() - 0.5) * 0.2,
        -0.45,
        Math.sin(angle) * 1.6 + (Math.random() - 0.5) * 0.2
      );
      group.add(emberMesh);
    }

    // 2. PRESET SPECIFIC GEOMETRY
    if (preset === 'karahi') {
      // SHINWARI MUTTON KARAHI WOK
      // Karahi pan body (hemisphere bowl)
      const bowlGeo = new THREE.SphereGeometry(1.8, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
      const bowlMesh = new THREE.Mesh(bowlGeo, ironMat);
      bowlMesh.rotation.x = Math.PI;
      bowlMesh.position.y = 0.1;
      group.add(bowlMesh);

      // Brass Handles
      [-1.85, 1.85].forEach((xPos) => {
        const handleGeo = new THREE.TorusGeometry(0.35, 0.06, 12, 24, Math.PI);
        const handleMesh = new THREE.Mesh(handleGeo, bronzeMat);
        handleMesh.position.set(xPos, 0.1, 0);
        handleMesh.rotation.z = xPos > 0 ? -Math.PI / 2 : Math.PI / 2;
        group.add(handleMesh);
      });

      // Rich tomato & butter gravy surface
      const gravyGeo = new THREE.CylinderGeometry(1.65, 1.4, 0.2, 32);
      const gravyMesh = new THREE.Mesh(gravyGeo, gravyMat);
      gravyMesh.position.y = 0.05;
      group.add(gravyMesh);

      // Tender Mutton meat chunks
      for (let i = 0; i < 9; i++) {
        const meatGeo = new THREE.DodecahedronGeometry(0.28 + Math.random() * 0.12, 1);
        const meatMesh = new THREE.Mesh(meatGeo, meatMat);
        const angle = (i / 9) * Math.PI * 2 + Math.random() * 0.2;
        const rad = 0.3 + (i % 3) * 0.45;
        meatMesh.position.set(
          Math.cos(angle) * rad,
          0.2 + (Math.random() * 0.1),
          Math.sin(angle) * rad
        );
        meatMesh.rotation.set(Math.random(), Math.random(), Math.random());
        group.add(meatMesh);
      }

      // Ginger juliennes (thin golden slivers)
      for (let i = 0; i < 8; i++) {
        const gingerGeo = new THREE.BoxGeometry(0.04, 0.03, 0.4);
        const gingerMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.3 });
        const ginger = new THREE.Mesh(gingerGeo, gingerMat);
        ginger.position.set(
          (Math.random() - 0.5) * 1.2,
          0.32,
          (Math.random() - 0.5) * 1.2
        );
        ginger.rotation.set(0.1, Math.random() * Math.PI, 0.1);
        group.add(ginger);
      }

      // Green Chili & Fresh Coriander
      for (let i = 0; i < 5; i++) {
        const chiliGeo = new THREE.ConeGeometry(0.08, 0.55, 8);
        const chiliMesh = new THREE.Mesh(chiliGeo, herbMat);
        chiliMesh.position.set(
          (Math.random() - 0.5) * 1.1,
          0.3,
          (Math.random() - 0.5) * 1.1
        );
        chiliMesh.rotation.set(Math.PI / 2.3, Math.random() * Math.PI, Math.PI / 4);
        group.add(chiliMesh);
      }

    } else if (preset === 'burger') {
      // CHARCOAL SMOKED GOURMET BURGER
      // Bottom Bun
      const bottomBunGeo = new THREE.CylinderGeometry(1.4, 1.35, 0.3, 32);
      const bottomBun = new THREE.Mesh(bottomBunGeo, bunMat);
      bottomBun.position.y = -0.25;
      group.add(bottomBun);

      // Smoked Angus Patty
      const pattyGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.35, 32);
      const patty = new THREE.Mesh(pattyGeo, pattyMat);
      patty.position.y = 0.05;
      group.add(patty);

      // Melted Cheddar Drip (Torus/curved segments)
      const cheeseGeo = new THREE.BoxGeometry(2.1, 0.06, 2.1);
      const cheese = new THREE.Mesh(cheeseGeo, cheeseMat);
      cheese.position.y = 0.22;
      cheese.rotation.y = Math.PI / 4;
      group.add(cheese);

      // Lettuce ruffle
      const lettuceGeo = new THREE.CylinderGeometry(1.6, 1.45, 0.08, 16);
      const lettuce = new THREE.Mesh(lettuceGeo, herbMat);
      lettuce.position.y = 0.28;
      group.add(lettuce);

      // Red Tomato slice
      const tomatoGeo = new THREE.CylinderGeometry(1.35, 1.35, 0.12, 24);
      const tomato = new THREE.Mesh(tomatoGeo, tomatoMat);
      tomato.position.y = 0.38;
      group.add(tomato);

      // Top Brioche Bun
      const topBunGeo = new THREE.SphereGeometry(1.45, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const topBun = new THREE.Mesh(topBunGeo, bunMat);
      topBun.position.y = 0.44;
      topBun.scale.set(1, 0.65, 1);
      group.add(topBun);

      // Toasted Sesame seeds on top
      const sesameMat = new THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 0.2 });
      for (let i = 0; i < 35; i++) {
        const sesameGeo = new THREE.BoxGeometry(0.04, 0.02, 0.07);
        const sesame = new THREE.Mesh(sesameGeo, sesameMat);
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = 1.43;
        const sinPhi = Math.sin(phi);
        if (sinPhi > 0.4) {
          sesame.position.set(
            r * sinPhi * Math.cos(theta) * 0.85,
            0.44 + r * Math.cos(phi) * 0.62,
            r * sinPhi * Math.sin(theta) * 0.85
          );
          sesame.rotation.set(Math.random(), Math.random(), Math.random());
          group.add(sesame);
        }
      }

    } else if (preset === 'pizza') {
      // ARTISANAL STONE-OVEN PIZZA
      // Raised crust edge
      const crustGeo = new THREE.TorusGeometry(1.7, 0.25, 16, 40);
      const crust = new THREE.Mesh(crustGeo, bunMat);
      crust.rotation.x = Math.PI / 2;
      crust.position.y = -0.15;
      group.add(crust);

      // Mozzarella cheese center
      const pizzaBaseGeo = new THREE.CylinderGeometry(1.65, 1.65, 0.1, 32);
      const pizzaBase = new THREE.Mesh(pizzaBaseGeo, cheeseMat);
      pizzaBase.position.y = -0.15;
      group.add(pizzaBase);

      // Pepperoni / spicy sausage discs
      for (let i = 0; i < 9; i++) {
        const pepGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.04, 16);
        const pep = new THREE.Mesh(pepGeo, tomatoMat);
        const angle = (i / 9) * Math.PI * 2;
        const r = 0.5 + (i % 2) * 0.55;
        pep.position.set(Math.cos(angle) * r, -0.08, Math.sin(angle) * r);
        pep.rotation.y = Math.random();
        group.add(pep);
      }

      // Basil leaves
      for (let i = 0; i < 6; i++) {
        const basilGeo = new THREE.ConeGeometry(0.18, 0.35, 5);
        const basil = new THREE.Mesh(basilGeo, herbMat);
        const angle = (i / 6) * Math.PI * 2 + 0.3;
        basil.position.set(Math.cos(angle) * 0.8, -0.05, Math.sin(angle) * 0.8);
        basil.rotation.set(Math.PI / 2.2, angle, 0);
        group.add(basil);
      }

    } else if (preset === 'steak') {
      // PRIME CHARCOAL TOMAHAWK / RIBEYE
      // Thick steak slab
      const steakShape = new THREE.Shape();
      steakShape.moveTo(-1.2, -0.8);
      steakShape.bezierCurveTo(-1.5, 0.2, -0.8, 1.1, 0.6, 0.9);
      steakShape.bezierCurveTo(1.4, 0.7, 1.6, -0.4, 1.1, -0.9);
      steakShape.bezierCurveTo(0.2, -1.2, -0.8, -1.1, -1.2, -0.8);

      const extrudeSettings = { depth: 0.45, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.08, bevelThickness: 0.08 };
      const steakGeo = new THREE.ExtrudeGeometry(steakShape, extrudeSettings);
      const steakMesh = new THREE.Mesh(steakGeo, meatMat);
      steakMesh.rotation.x = Math.PI / 2;
      steakMesh.position.set(-0.1, 0.15, -0.1);
      group.add(steakMesh);

      // Melting herb butter medallion
      const butterMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.2, metalness: 0.1 });
      const butterGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.12, 16);
      const butter = new THREE.Mesh(butterGeo, butterMat);
      butter.position.set(0.1, 0.28, 0.1);
      group.add(butter);

      // Sprig of rosemary
      const sprigGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.2, 8);
      const sprig = new THREE.Mesh(sprigGeo, herbMat);
      sprig.position.set(-0.2, 0.25, 0.2);
      sprig.rotation.set(Math.PI / 2.3, 0.4, 0.6);
      group.add(sprig);

    } else if (preset === 'dessert-skillet') {
      // SIZZLING IRON SKILLET BROWNIE
      const skilletGeo = new THREE.CylinderGeometry(1.6, 1.4, 0.4, 32);
      const skillet = new THREE.Mesh(skilletGeo, ironMat);
      skillet.position.y = -0.1;
      group.add(skillet);

      // Handle
      const handleGeo = new THREE.BoxGeometry(0.3, 0.15, 1.2);
      const handle = new THREE.Mesh(handleGeo, ironMat);
      handle.position.set(0, -0.05, 1.9);
      group.add(handle);

      // Fudgy Brownie core
      const brownieGeo = new THREE.BoxGeometry(1.8, 0.35, 1.8);
      const brownieMat = new THREE.MeshStandardMaterial({ color: 0x271309, roughness: 0.8 });
      const brownie = new THREE.Mesh(brownieGeo, brownieMat);
      brownie.position.y = 0.1;
      brownie.rotation.y = Math.PI / 6;
      group.add(brownie);

      // Vanilla Gelato Scoop
      const scoopGeo = new THREE.SphereGeometry(0.55, 24, 24);
      const scoopMat = new THREE.MeshStandardMaterial({ color: 0xfffbeb, roughness: 0.4 });
      const scoop = new THREE.Mesh(scoopGeo, scoopMat);
      scoop.position.set(0, 0.55, 0);
      group.add(scoop);

      // Molten dark chocolate drizzle
      const dripGeo = new THREE.TorusGeometry(0.5, 0.08, 12, 24);
      const dripMat = new THREE.MeshStandardMaterial({ color: 0x1c0b05, roughness: 0.1, metalness: 0.3 });
      const drip = new THREE.Mesh(dripGeo, dripMat);
      drip.rotation.x = Math.PI / 2.2;
      drip.position.set(0, 0.45, 0);
      group.add(drip);

    } else if (preset === 'cocktail') {
      // ICED BOTANICAL MOCKTAIL
      // Crystal Glass
      const glassGeo = new THREE.CylinderGeometry(0.75, 0.6, 2.0, 24, 1, true);
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.45,
        roughness: 0.1,
        metalness: 0.1,
        transmission: 0.9,
        ior: 1.5
      });
      const glass = new THREE.Mesh(glassGeo, glassMat);
      glass.position.y = 0.5;
      group.add(glass);

      // Liquid volume
      const liquidGeo = new THREE.CylinderGeometry(0.7, 0.55, 1.6, 24);
      const liquidMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xb45309,
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.85,
        roughness: 0.2
      });
      const liquid = new THREE.Mesh(liquidGeo, liquidMat);
      liquid.position.y = 0.35;
      group.add(liquid);

      // Floating ice cubes
      for (let i = 0; i < 3; i++) {
        const iceGeo = new THREE.BoxGeometry(0.35, 0.35, 0.35);
        const iceMat = new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.65,
          roughness: 0.1,
          transmission: 0.8
        });
        const ice = new THREE.Mesh(iceGeo, iceMat);
        ice.position.set((Math.random() - 0.5) * 0.3, 0.6 + i * 0.25, (Math.random() - 0.5) * 0.3);
        ice.rotation.set(Math.random(), Math.random(), Math.random());
        group.add(ice);
      }

      // Citrus wheel garnish
      const citrusGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.04, 20);
      const citrusMat = new THREE.MeshStandardMaterial({ color: 0x84cc16, roughness: 0.3 });
      const citrus = new THREE.Mesh(citrusGeo, citrusMat);
      citrus.position.set(0.65, 1.45, 0);
      citrus.rotation.z = Math.PI / 3;
      group.add(citrus);

    } else {
      // DEFAULT / CUSTOM SIGNATURE GASTRONOMY SHOWPIECE
      // Tiered golden presentation dome with crown embers
      const domeGeo = new THREE.SphereGeometry(1.6, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const domeMesh = new THREE.Mesh(domeGeo, goldMat);
      domeMesh.position.y = -0.15;
      group.add(domeMesh);

      const crownTorus = new THREE.TorusGeometry(1.2, 0.12, 16, 32);
      const crown = new THREE.Mesh(crownTorus, bronzeMat);
      crown.rotation.x = Math.PI / 2;
      crown.position.y = 0.4;
      group.add(crown);

      // Inner flame core
      const coreGeo = new THREE.OctahedronGeometry(0.6, 1);
      const core = new THREE.Mesh(coreGeo, emberMat);
      core.position.y = 0.7;
      group.add(core);
    }

    return group;
  }, []);

  // Helper to create particle cloud (Steam / Embers / Spice Dust)
  const buildParticles = useCallback((type: string, count = 120): THREE.Points => {
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    const isEmber = type === 'embers';
    const isSteam = type === 'steam';

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Spawn in cylinder around dish
      const rad = Math.random() * 1.8;
      const angle = Math.random() * Math.PI * 2;
      positions[i3] = Math.cos(angle) * rad;
      positions[i3 + 1] = Math.random() * 2.8 - 0.2; // height
      positions[i3 + 2] = Math.sin(angle) * rad;

      if (isEmber) {
        // Warm fiery ember colors: Orange, Gold, Red
        colors[i3] = 1.0;
        colors[i3 + 1] = 0.35 + Math.random() * 0.45;
        colors[i3 + 2] = 0.05;
      } else if (isSteam) {
        // Soft white-grey steam
        colors[i3] = 0.95;
        colors[i3 + 1] = 0.92;
        colors[i3 + 2] = 0.88;
      } else {
        // Golden spice sparkles
        colors[i3] = 0.95;
        colors[i3 + 1] = 0.85;
        colors[i3 + 2] = 0.3;
      }

      scales[i] = Math.random() * 0.12 + 0.04;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: isSteam ? 0.22 : 0.09,
      vertexColors: true,
      transparent: true,
      opacity: isSteam ? 0.35 : 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    return new THREE.Points(particleGeo, particleMat);
  }, []);

  // Main 3D Initializer
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setIsWebGLSupported(false);
        return;
      }
    } catch {
      setIsWebGLSupported(false);
      return;
    }

    const width = container.clientWidth || 480;
    const height = container.clientHeight || 480;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 2.2, 5.8);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Clear previous canvas
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 4. Lighting System
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.4);
    scene.add(ambientLight);

    const mainSpot = new THREE.DirectionalLight(0xffffff, 2.2);
    mainSpot.position.set(4, 7, 5);
    mainSpot.castShadow = true;
    scene.add(mainSpot);

    const rimLight = new THREE.DirectionalLight(0xd4af37, 1.8);
    rimLight.position.set(-4, -2, -3);
    scene.add(rimLight);

    // Sizzling hearth Point Light underneath
    const pointLight = new THREE.PointLight(getGlowColor(), 2.8, 10);
    pointLight.position.set(0, -0.4, 0);
    scene.add(pointLight);
    pointLightRef.current = pointLight;

    // 5. Food Geometry Group
    const foodGroup = buildFoodGeometry(activePreset, showWireframe);
    scene.add(foodGroup);
    foodGroupRef.current = foodGroup;

    // 6. Particles
    if (activeParticles) {
      const particles = buildParticles(particleType);
      scene.add(particles);
      particlesGroupRef.current = particles;
    }

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width: newW, height: newH } = entries[0].contentRect;
      if (newW > 0 && newH > 0 && cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = newW / newH;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(newW, newH);
      }
    });
    resizeObserver.observe(container);

    // 7. Animation Loop
    clockRef.current.start();
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const elapsedTime = clockRef.current.getElapsedTime() * animSpeed;

      if (foodGroupRef.current) {
        // Smooth mouse rotation interpolation
        currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.1;
        currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.1;

        if (isRotating && !isDragging) {
          targetRotation.current.y += rotationSpeed;
        }

        foodGroupRef.current.rotation.x = currentRotation.current.x;
        foodGroupRef.current.rotation.y = currentRotation.current.y;

        // Elegant floating hover loop
        const hoverY = Math.sin(elapsedTime * 2.2) * floatingDist;
        foodGroupRef.current.position.y = hoverY;

        // Gentle tilt rhythm
        foodGroupRef.current.rotation.z = Math.sin(elapsedTime * 1.5) * 0.03;
      }

      // Animate Particles
      if (particlesGroupRef.current && activeParticles) {
        const positions = particlesGroupRef.current.geometry.attributes.position.array as Float32Array;
        const count = positions.length / 3;

        for (let i = 0; i < count; i++) {
          const i3 = i * 3;
          // Float upward
          positions[i3 + 1] += 0.015 * animSpeed;
          // Swirl gently
          positions[i3] += Math.sin(elapsedTime + i) * 0.003;
          positions[i3 + 2] += Math.cos(elapsedTime + i) * 0.003;

          // Recycle when too high
          if (positions[i3 + 1] > 2.8) {
            positions[i3 + 1] = -0.2;
            const rad = Math.random() * 1.6;
            const angle = Math.random() * Math.PI * 2;
            positions[i3] = Math.cos(angle) * rad;
            positions[i3 + 2] = Math.sin(angle) * rad;
          }
        }
        particlesGroupRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Pulse Point Light
      if (pointLightRef.current) {
        pointLightRef.current.intensity = 2.4 + Math.sin(elapsedTime * 4.0) * 0.8;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      resizeObserver.disconnect();
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [activePreset, showWireframe, activeParticles, particleType, glowType, rotationSpeed, floatingDist, animSpeed, isRotating, isDragging, buildFoodGeometry, buildParticles]);

  // Handle Drag / Touch Interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive) return;
    setIsDragging(true);
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !interactive) return;
    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;

    targetRotation.current.y += deltaX * 0.008;
    targetRotation.current.x += deltaY * 0.008;

    // Clamp vertical tilt
    targetRotation.current.x = Math.max(-0.4, Math.min(1.2, targetRotation.current.x));

    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!interactive || e.touches.length === 0) return;
    setIsDragging(true);
    previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !interactive || e.touches.length === 0) return;
    const deltaX = e.touches[0].clientX - previousMousePosition.current.x;
    const deltaY = e.touches[0].clientY - previousMousePosition.current.y;

    targetRotation.current.y += deltaX * 0.008;
    targetRotation.current.x += deltaY * 0.008;
    targetRotation.current.x = Math.max(-0.4, Math.min(1.2, targetRotation.current.x));

    previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  // Switch Camera Angles
  const setAngle = (angle: 'perspective' | 'top' | 'front') => {
    setViewAngle(angle);
    if (!cameraRef.current) return;
    if (angle === 'top') {
      targetRotation.current = { x: 1.1, y: 0 };
    } else if (angle === 'front') {
      targetRotation.current = { x: 0.05, y: 0 };
    } else {
      targetRotation.current = { x: 0.35, y: 0 };
    }
  };

  const resetView = () => {
    targetRotation.current = { x: 0.35, y: 0 };
    setIsRotating(true);
    setShowWireframe(false);
  };

  // Fallback 2D card with 3D CSS parallax if WebGL fails
  if (!isWebGLSupported) {
    return (
      <div 
        onClick={onDishSelect}
        className={`relative rounded-3xl bg-gradient-to-b from-[#1c1612] to-[#120e0b] border border-[#d4af37]/40 overflow-hidden shadow-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer group ${className}`}
      >
        <div className="absolute inset-0 bg-[#d4af37]/10 rounded-full blur-3xl" />
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-2xl overflow-hidden mb-6 shadow-xl border border-white/10 group-hover:scale-105 transition-transform duration-500">
          <img
            src={config?.customImageUrl || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'}
            alt={config?.title || 'Featured Culinary Masterpiece'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#d4af37]/50 text-[10px] text-[#d4af37] font-bold uppercase tracking-widest">
            {config?.tag || 'Signature Masterpiece'}
          </div>
        </div>
        <h3 className="font-serif text-2xl font-bold text-[#fdfbf7] mb-2">{config?.title || 'Living Hearth Speciality'}</h3>
        <p className="text-xs text-[#c5bcad] max-w-sm">{config?.description || 'Authentic ancestral cuisine prepared over living binchotan embers.'}</p>
      </div>
    );
  }

  return (
    <div 
      className={`relative select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsDragging(false);
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      {/* Background Atmospheric Glow Rings */}
      <div 
        className="absolute inset-0 pointer-events-none rounded-full blur-3xl opacity-30 transition-all duration-700"
        style={{
          background: `radial-gradient(circle at center, ${getGlowColor()} 0%, transparent 70%)`
        }}
      />

      {/* Floating 3D WebGL Canvas */}
      <div 
        ref={mountRef} 
        className="w-full h-full min-h-[380px] sm:min-h-[460px] cursor-grab active:cursor-grabbing flex items-center justify-center"
      />

      {/* Subtle Bottom Floor Ember Glow Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-ping" />
        <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#d4af37]/80 bg-black/60 px-3 py-1 rounded-full border border-[#d4af37]/30 backdrop-blur-md">
          {isDragging ? 'Interactive 3D Orbit Active' : 'Drag to Rotate 360° • Live 3D Hearth Model'}
        </span>
      </div>

      {/* Interactive Controls Overlay */}
      {showControls && (
        <div className={`absolute top-4 right-4 flex flex-col gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-70 sm:opacity-85'}`}>
          {/* Auto Rotate Toggle */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsRotating(!isRotating);
            }}
            title={isRotating ? 'Pause Rotation' : 'Auto Rotate'}
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-semibold backdrop-blur-md border transition-all cursor-pointer ${
              isRotating 
                ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37]' 
                : 'bg-black/60 border-white/20 text-white/70 hover:text-white'
            }`}
          >
            <RotateCw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
          </button>

          {/* Camera Angles */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setAngle(viewAngle === 'perspective' ? 'top' : viewAngle === 'top' ? 'front' : 'perspective');
            }}
            title="Toggle Perspective"
            className="w-9 h-9 rounded-xl bg-black/60 border border-white/20 hover:border-[#d4af37]/60 text-white/80 hover:text-white flex items-center justify-center text-xs backdrop-blur-md transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Wireframe Inspector Toggle */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowWireframe(!showWireframe);
            }}
            title="Toggle 3D Wireframe"
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs backdrop-blur-md border transition-all cursor-pointer ${
              showWireframe
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                : 'bg-black/60 border-white/20 text-white/70 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Steam / Embers Toggle */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveParticles(!activeParticles);
            }}
            title="Toggle Steam & Embers"
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs backdrop-blur-md border transition-all cursor-pointer ${
              activeParticles
                ? 'bg-orange-500/20 border-orange-400 text-orange-300'
                : 'bg-black/60 border-white/20 text-white/70 hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4" />
          </button>

          {/* Reset Camera Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              resetView();
            }}
            title="Reset View"
            className="w-9 h-9 rounded-xl bg-black/60 border border-white/20 hover:border-white/40 text-white/70 hover:text-white flex items-center justify-center text-xs backdrop-blur-md transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Preset Badge */}
      <div className="absolute top-4 left-4 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/70 border border-[#d4af37]/40 text-[11px] font-semibold uppercase tracking-wider text-[#d4af37] backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>{activePreset.replace('-', ' ')} 3D</span>
        </div>
      </div>
    </div>
  );
};
