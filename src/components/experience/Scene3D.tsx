import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { BirthdayCake } from "./BirthdayCake";
import { MemoryPhoto3D } from "./MemoryPhoto3D";
import { FloatingParticles } from "./FloatingParticles";
import { useBirthdayData } from "@/hooks/useBirthdayData";
import { getExperience, experienceActions, type Phase } from "./useExperience";

interface SceneProps {
  phase: Phase;
  scroll: number;
  selectedId: number | null;
  explored: Set<number>;
}

function Rig() {
  const { camera, size } = useThree();
  const target = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current.x = (e.clientX / size.width - 0.5) * 2;
      target.current.y = (e.clientY / size.height - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [size]);
  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, target.current.x * 0.4, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, -target.current.y * 0.25 + 0.2, 0.05);
    camera.lookAt(0, 0.3, 0);
  });
  return null;
}

function CakeGroup({ phase, scroll }: { phase: Phase; scroll: number }) {
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!group.current) return;
    // Hero: cake on right, memories: centered
    const heroX = 1.6;
    const memX = 0;
    const s = phase === "intro" || phase === "hero" ? scroll : 1;
    const x = THREE.MathUtils.lerp(heroX, memX, s);
    const scale = THREE.MathUtils.lerp(0.9, 1.05, s);
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, x, 0.08);
    group.current.scale.setScalar(
      THREE.MathUtils.lerp(group.current.scale.x, scale, 0.08),
    );
  });
  // Candles lit only during wish and finalIntro; keep off in hero for elegance
  const litFinal = phase === "finalIntro" || phase === "wish";
  return (
    <group ref={group} position={[1.6, 0, 0]}>
      <BirthdayCake litCandles={litFinal} flicker={1} />
    </group>
  );
}

function MemoriesGroup({ phase, scroll, selectedId, explored }: SceneProps) {
  const { memories } = useBirthdayData();
  const dragGroup = useRef<THREE.Group>(null);
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const rotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = document.querySelector<HTMLCanvasElement>("canvas.experience-canvas");
    if (!el) return;
    const down = (e: PointerEvent) => {
      if (getExperience().phase !== "memories") return;
      dragging.current = true;
      last.current = { x: e.clientX, y: e.clientY };
    };
    const move = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;
      velocity.current.x = dx * 0.005;
      velocity.current.y = dy * 0.003;
      last.current = { x: e.clientX, y: e.clientY };
    };
    const up = () => (dragging.current = false);
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  useFrame((state) => {
    if (!dragGroup.current) return;
    
    // Shorter rotation range to prevent showing empty backs
    // Reduced from ±90 degrees to ±45 degrees (±0.785 radians)
    const maxYRotation = Math.PI / 4; // 45 degrees
    
    // When in memories phase and not being dragged, use smooth oscillating motion
    if (getExperience().phase === "memories" && !dragging.current) {
      // Sine wave creates smooth back-and-forth motion
      const time = state.clock.elapsedTime;
      rotation.current.y = Math.sin(time * 0.2) * (maxYRotation * 0.8); // Oscillate within 80% of max range
    } else {
      // Manual dragging
      rotation.current.y = THREE.MathUtils.clamp(
        rotation.current.y + velocity.current.x,
        -maxYRotation,
        maxYRotation
      );
    }
    
    rotation.current.x = THREE.MathUtils.clamp(
      rotation.current.x + velocity.current.y,
      -0.35,
      0.35,
    );
    velocity.current.x *= 0.92;
    velocity.current.y *= 0.92;
    
    dragGroup.current.rotation.y = THREE.MathUtils.lerp(
      dragGroup.current.rotation.y,
      rotation.current.y,
      0.15,
    );
    dragGroup.current.rotation.x = THREE.MathUtils.lerp(
      dragGroup.current.rotation.x,
      rotation.current.x,
      0.15,
    );
  });

  // Reveal: 0 during hero, 1 during memories+
  // Smooth transition: photos fully revealed when scroll reaches 100%
  const reveal =
    phase === "intro" || phase === "hero" 
      ? THREE.MathUtils.clamp(scroll, 0, 1)
      : 1;

  const handleClick = (id: number) => {
    if (getExperience().phase !== "memories") return;
    experienceActions.markExplored(id);
    experienceActions.selectMemory(id);
    experienceActions.setPhase("memoryFocus");
    setTimeout(() => experienceActions.setPhase("scrapbook"), 900);
  };

  return (
    <group ref={dragGroup}>
      {memories.map((m) => {
        const isSelected = selectedId === m.id;
        const focusMode: "idle" | "selected" | "dimmed" =
          phase === "memoryFocus" || phase === "scrapbook"
            ? isSelected
              ? "selected"
              : "dimmed"
            : "idle";
        return (
          <MemoryPhoto3D
            key={m.id}
            memory={m}
            reveal={reveal}
            focusMode={focusMode}
            explored={explored.has(m.id)}
            onClick={handleClick}
          />
        );
      })}
    </group>
  );
}

function Environment3D({ phase }: { phase: Phase }) {
  const bgRef = useRef<THREE.Mesh>(null);
  const flowersRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [flowersTexture, setFlowersTexture] = useState<THREE.Texture | null>(null);
  
  // Load background3.jpg texture
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const canvasTexture = new THREE.CanvasTexture(canvas);
        canvasTexture.colorSpace = THREE.SRGBColorSpace;
        canvasTexture.needsUpdate = true;
        setTexture(canvasTexture);
      }
    };
    
    img.onerror = (error) => {
      console.error('Failed to load background3.jpg:', error);
    };
    
    img.src = '/background3.jpg';
  }, []);
  
  // Load background-flowers.png texture
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const canvasTexture = new THREE.CanvasTexture(canvas);
        canvasTexture.colorSpace = THREE.SRGBColorSpace;
        canvasTexture.needsUpdate = true;
        setFlowersTexture(canvasTexture);
      }
    };
    
    img.onerror = (error) => {
      console.error('Failed to load background-flowers.png:', error);
    };
    
    img.src = '/background-flowers.png';
  }, []);
  
  // Smooth crossfade between textures based on phase
  useFrame(() => {
    if (!bgRef.current || !flowersRef.current || !texture || !flowersTexture) return;
    
    const bgMat = bgRef.current.material as THREE.MeshBasicMaterial;
    const flowersMat = flowersRef.current.material as THREE.MeshBasicMaterial;
    
    // Determine target opacity based on phase
    const useFlowers = phase === "memories" || phase === "memoryFocus" || phase === "scrapbook";
    const bgTargetOpacity = useFlowers ? 0 : 1;
    const flowersTargetOpacity = useFlowers ? 1 : 0;
    
    // Smooth lerp for crossfade effect
    bgMat.opacity = THREE.MathUtils.lerp(bgMat.opacity, bgTargetOpacity, 0.05);
    flowersMat.opacity = THREE.MathUtils.lerp(flowersMat.opacity, flowersTargetOpacity, 0.05);
    
    // Don't tint during normal view - show background naturally
    if (phase === "intro" || phase === "hero" || phase === "memories" || phase === "memoryFocus") {
      bgMat.color.lerp(new THREE.Color("#ffffff"), 0.05);
      flowersMat.color.lerp(new THREE.Color("#ffffff"), 0.05);
    } else {
      // Adjust opacity based on phase for both materials
      const targetOpacity = 
        phase === "wish" || phase === "finalIntro" ? 0.3 :
        phase === "scrapbook" ? 0.6 :
        0.7;
      
      // Apply dimming to whichever background is visible
      if (bgMat.opacity > 0.1) {
        bgMat.opacity = THREE.MathUtils.lerp(bgMat.opacity, Math.min(bgTargetOpacity, targetOpacity), 0.05);
      }
      if (flowersMat.opacity > 0.1) {
        flowersMat.opacity = THREE.MathUtils.lerp(flowersMat.opacity, Math.min(flowersTargetOpacity, targetOpacity), 0.05);
      }
      
      // Subtle color tint overlay for special phases
      const target = new THREE.Color(
        phase === "wish" || phase === "finalIntro"
          ? "#4a2f3e"
          : phase === "scrapbook"
            ? "#f5e6d3"
            : "#ffe6ef"
      );
      bgMat.color.lerp(target, 0.03);
      flowersMat.color.lerp(target, 0.03);
    }
  });
  
  return (
    <>
      {/* Background 3 plane */}
      <mesh ref={bgRef} position={[0, 0, -15]}>
        <planeGeometry args={[60, 40]} />
        <meshBasicMaterial 
          key={texture ? 'with-bg' : 'no-bg'}
          map={texture} 
          color="#ffffff"
          transparent
          opacity={1}
          toneMapped={false}
          side={THREE.FrontSide}
        />
      </mesh>
      
      {/* Flowers background plane (overlaid, initially invisible) */}
      <mesh ref={flowersRef} position={[0, 0, -14.9]}>
        <planeGeometry args={[60, 40]} />
        <meshBasicMaterial 
          key={flowersTexture ? 'with-flowers' : 'no-flowers'}
          map={flowersTexture} 
          color="#ffffff"
          transparent
          opacity={0}
          toneMapped={false}
          side={THREE.FrontSide}
        />
      </mesh>
    </>
  );
}

export function Scene3D(props: SceneProps) {
  const { memories } = useBirthdayData();
  
  return (
    <Canvas
      className="experience-canvas"
      camera={{ position: [0, 0.4, 8], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false }}
    >
      <Suspense fallback={null}>
        <Environment3D phase={props.phase} />
        <FloatingParticles />
        <CakeGroup phase={props.phase} scroll={props.scroll} />
        <MemoriesGroup {...props} />
      </Suspense>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 3]} intensity={1.0} castShadow />
      <pointLight position={[-3, 2, 2]} color="#FFB5D8" intensity={0.8} />
      <pointLight position={[3, -2, 3]} color="#FFD1E1" intensity={0.6} />
      <pointLight position={[0, 4, 0]} color="#FFF8F0" intensity={0.4} />
      <Rig />
    </Canvas>
  );
}