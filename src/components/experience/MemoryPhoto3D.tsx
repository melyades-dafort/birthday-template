import { useEffect, useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import type { Memory } from "@/data/memories";

interface Props {
  memory: Memory;
  reveal: number; // 0..1, 0 = at cake center, 1 = at target
  focusMode: "idle" | "selected" | "dimmed";
  explored: boolean;
  onClick: (id: number) => void;
}

function PhotoCard({ memory, reveal, focusMode, explored, onClick }: Props) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  
  // Load texture with CORS proxy
  useEffect(() => {
    let mounted = true;
    
    // Try without proxy first, then fallback to colored placeholder
    const imageUrl = memory.image;
    
    console.log('Loading image:', imageUrl, 'for memory', memory.id);
    
    // Create an img element to test loading
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      if (!mounted) return;
      
      console.log('Image loaded successfully:', imageUrl);
      
      // Successfully loaded, create texture from canvas
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 1000;
      const ctx = canvas.getContext('2d', { willReadFrequently: false });
      
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const canvasTexture = new THREE.CanvasTexture(canvas);
        canvasTexture.colorSpace = THREE.SRGBColorSpace;
        canvasTexture.needsUpdate = true;
        
        if (mounted) {
          console.log('Texture created for memory', memory.id);
          setTexture(canvasTexture);
        }
      }
    };
    
    img.onerror = (error) => {
      // Failed to load, texture stays null and will show placeholder color
      console.error('Could not load texture for memory', memory.id, imageUrl, error);
    };
    
    // Attempt to load with crossOrigin
    img.src = imageUrl;
    
    return () => {
      mounted = false;
      if (texture) {
        texture.dispose();
      }
    };
  }, [memory.image]);

  useFrame((state) => {
    if (!group.current || !inner.current) return;
    const t = state.clock.elapsedTime;
    // Interpolate reveal from origin (cake ~ [0, 0.3, 0]) to target
    const [tx, ty, tz] = memory.position;
    const ox = THREE.MathUtils.lerp(0, tx, reveal);
    const oy = THREE.MathUtils.lerp(0.3, ty, reveal);
    const oz = THREE.MathUtils.lerp(0, tz, reveal);
    // Add gentle floating
    const bob = Math.sin(t * memory.floatSpeed + memory.id) * memory.floatIntensity * reveal;
    group.current.position.x = ox;
    group.current.position.y = oy + bob;
    group.current.position.z = oz;

    const [rx, ry, rz] = memory.rotation;
    const targetRx = THREE.MathUtils.lerp(rx, 0, hovered ? 0.7 : 0);
    const targetRy = THREE.MathUtils.lerp(ry, 0, hovered ? 0.7 : 0);
    inner.current.rotation.x = THREE.MathUtils.lerp(inner.current.rotation.x, targetRx * reveal, 0.1);
    inner.current.rotation.y = THREE.MathUtils.lerp(inner.current.rotation.y, targetRy * reveal, 0.1);
    inner.current.rotation.z = THREE.MathUtils.lerp(inner.current.rotation.z, rz * reveal, 0.1);

    const baseScale = memory.scale * reveal;
    const targetScale =
      focusMode === "dimmed" ? baseScale * 0.85 : hovered ? baseScale * 1.15 : baseScale;
    const s = THREE.MathUtils.lerp(inner.current.scale.x, targetScale, 0.12);
    inner.current.scale.set(s, s, s);
  });

  const dimmed = focusMode === "dimmed";
  const opacity = focusMode === "dimmed" ? 0.25 : 1;
  const zOffset = focusMode === "dimmed" ? -3 : 0;

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick(memory.id);
  };

  return (
    <group ref={group} position-z={zOffset}>
      <group ref={inner}>
        {/* Back */}
        <mesh 
          position={[0, 0, -0.02]}
          onClick={handleClick}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = "";
          }}
        >
          <boxGeometry args={[1.2, 1.5, 0.04]} />
          <meshStandardMaterial color="#FFFDFB" roughness={0.9} transparent opacity={opacity} />
        </mesh>
        
        {/* White Polaroid frame */}
        <mesh
          onClick={handleClick}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = "";
          }}
        >
          <planeGeometry args={[1.2, 1.5]} />
          <meshStandardMaterial color="#FFF8F0" roughness={0.7} transparent opacity={opacity} />
        </mesh>
        
        {/* Image on top of frame */}
        <mesh position={[0, 0.05, 0.02]}>
          <planeGeometry args={[1.02, 1.24]} />
          <meshBasicMaterial
            key={texture ? 'with-texture' : 'no-texture'}
            map={texture}
            color={texture ? "#ffffff" : "#FFD1E1"}
            transparent
            opacity={opacity}
            toneMapped={false}
          />
        </mesh>
        
        {/* Explored star */}
        <mesh position={[0.5, 0.65, 0.05]} visible={explored}>
          <circleGeometry args={[0.07, 16]} />
          <meshBasicMaterial color="#C8A96B" transparent opacity={opacity} />
        </mesh>
        
        {/* Subtle glow for unexplored photos */}
        {!explored && (
          <pointLight 
            position={[0, 0, 0.3]} 
            color="#FFD1E1" 
            intensity={0.3} 
            distance={2}
          />
        )}
      </group>
    </group>
  );
}


export function MemoryPhoto3D(props: Props) {
  return <PhotoCard {...props} />;
}
