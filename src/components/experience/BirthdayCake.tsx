import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface CandleProps {
  position: [number, number, number];
  lit: boolean;
  flicker: number;
}

function Candle({ position, lit, flicker }: CandleProps) {
  const flameRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    if (!flameRef.current) return;
    const t = state.clock.elapsedTime;
    const s = lit ? 1 + Math.sin(t * 8 + position[0]) * 0.08 * flicker : 0.001;
    flameRef.current.scale.set(s * 0.9, s, s * 0.9);
    flameRef.current.rotation.z = Math.sin(t * 4 + position[0]) * 0.05 * flicker;
    if (lightRef.current) {
      lightRef.current.intensity = lit ? 0.6 + Math.sin(t * 9) * 0.1 : 0;
    }
  });
  return (
    <group position={position}>
      {/* wax */}
      <mesh castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.35, 16]} />
        <meshStandardMaterial color="#FFF8F0" roughness={0.6} />
      </mesh>
      {/* wick */}
      <mesh position={[0, 0.19, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.04, 6]} />
        <meshStandardMaterial color="#3a2a1a" />
      </mesh>
      {/* flame */}
      <mesh ref={flameRef} position={[0, 0.28, 0]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshBasicMaterial color="#FFD48A" transparent opacity={0.95} />
      </mesh>
      <pointLight ref={lightRef} position={[0, 0.28, 0]} color="#FFB570" distance={2.5} intensity={0.6} />
    </group>
  );
}

interface Props {
  litCandles: boolean;
  flicker?: number;
  hover?: number;
}

function CakeModel() {
  // Load GLB model
  const gltf = useGLTF("/models/strawberry_cake.glb");
  
  // Clone the scene to avoid mutation
  const clonedScene = useMemo(() => {
    const clone = gltf.scene.clone();
    
    // Log all mesh names to console for debugging
    console.log("=== Cake Model Meshes ===");
    clone.traverse((child: any) => {
      if (child.isMesh) {
        console.log("Mesh name:", child.name, "Material:", child.material?.name);
      }
    });
    
    // Traverse and make only the cake body pink (not toppings)
    clone.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material = child.material.clone();
          
          const meshName = child.name.toLowerCase();
          const materialName = child.material.name?.toLowerCase() || '';
          
          // Keep these parts in their original colors (toppings/decorations)
          const keepOriginal = meshName.includes('strawberry') || 
                               meshName.includes('red_strawberry') || 
                               meshName.includes('cupcake') ||
                               materialName.includes('strawberry') ||
                               materialName.includes('red');
          
          // Make everything else light pink (the cake body/icing)
          if (!keepOriginal) {
            child.material.color = new THREE.Color("#FFC0D9"); // Light pink color for body
          }
          
          child.material.needsUpdate = true;
        }
      }
    });
    return clone;
  }, [gltf.scene]);
  
  console.log("GLB loaded:", gltf);
  
  return (
    <primitive 
      object={clonedScene} 
      scale={50}
      position={[0, -.8, 0]}
      rotation={[0.3, 0, 0]}
    />
  );
}

export function BirthdayCake({ litCandles, flicker = 1, hover = 0 }: Props) {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = t * 0.08;
    group.current.position.y = Math.sin(t * 0.9) * 0.08 - 0.4;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, hover * 0.15, 0.05);
  });

  const candlePositions: [number, number, number][] = [
    [0.35, 1.55, 0],
    [-0.35, 1.55, 0],
    [0, 1.55, 0.35],
    [0, 1.55, -0.35],
    [0, 1.55, 0],
  ];

  return (
    <group ref={group}>
      {/* Use GLB model */}
      <CakeModel />
    </group>
  );
}

// Preload the model
useGLTF.preload("/models/strawberry_cake.glb");