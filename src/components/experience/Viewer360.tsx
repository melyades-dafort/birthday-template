import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { AnimatePresence, motion } from "framer-motion";
import { useExperience } from "./useExperience";

function PanoramaSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  
  useEffect(() => {
    let mounted = true;
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      if (!mounted) return;
      
      console.log('360 panorama loaded successfully');
      
      // Create texture from canvas
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: false });
      
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        
        const canvasTexture = new THREE.CanvasTexture(canvas);
        canvasTexture.colorSpace = THREE.SRGBColorSpace;
        canvasTexture.needsUpdate = true;
        
        if (mounted) {
          setTexture(canvasTexture);
        }
      }
    };
    
    img.onerror = (error) => {
      console.error('Failed to load 360 panorama:', error);
    };
    
    img.src = "/360-background.png";
    
    return () => {
      mounted = false;
      if (texture) {
        texture.dispose();
      }
    };
  }, []);
  
  useEffect(() => {
    if (meshRef.current && texture) {
      const material = meshRef.current.material as THREE.MeshBasicMaterial;
      material.map = texture;
      material.needsUpdate = true;
    }
  }, [texture]);
  
  return (
    <mesh ref={meshRef} scale={[-1, 1, 1]}>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial 
        color={texture ? "#ffffff" : "#FFD1E1"} 
        side={THREE.BackSide}
      />
    </mesh>
  );
}

function CameraController() {
  const { camera } = useThree();
  const isDragging = useRef(false);
  const previousMouse = useRef({ x: 0, y: 0 });
  const rotation = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      previousMouse.current = { x: e.clientX, y: e.clientY };
    };
    
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      
      const deltaX = e.clientX - previousMouse.current.x;
      const deltaY = e.clientY - previousMouse.current.y;
      
      rotation.current.y -= deltaX * 0.002;
      rotation.current.x -= deltaY * 0.002;
      
      // Limit vertical rotation
      rotation.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotation.current.x));
      
      previousMouse.current = { x: e.clientX, y: e.clientY };
    };
    
    const onMouseUp = () => {
      isDragging.current = false;
    };
    
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    
    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);
  
  useFrame(() => {
    camera.rotation.order = "YXZ";
    camera.rotation.y = rotation.current.y;
    camera.rotation.x = rotation.current.x;
  });
  
  return null;
}

export function Viewer360() {
  const { phase, setPhase } = useExperience();
  const [showInstructions, setShowInstructions] = useState(true);
  
  useEffect(() => {
    if (phase === "viewer360") {
      const timer = setTimeout(() => setShowInstructions(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [phase]);
  
  if (phase !== "viewer360") return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5 }}
        className="fixed inset-0 z-40"
      >
        <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
          <PanoramaSphere />
          <CameraController />
          {/* Ambient light for better visibility */}
          <ambientLight intensity={0.3} />
        </Canvas>
        
        {/* Vignette overlay for depth */}
        <div className="pointer-events-none fixed inset-0 z-45" style={{
          background: 'radial-gradient(circle at center, transparent 0%, transparent 40%, rgba(0,0,0,0.15) 100%)'
        }} />
        
        {/* Decorative floating petals */}
        <motion.div
          className="pointer-events-none fixed inset-0 z-45"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
        >
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full bg-gradient-to-br from-pink-300/40 to-pink-500/40 blur-sm"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                x: [-10, 10, -10],
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
        
        {/* Instructions */}
        <AnimatePresence>
          {showInstructions && (
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8 }}
              className="pointer-events-none fixed top-8 left-1/2 -translate-x-1/2 z-50"
            >
              <div className="bg-gradient-to-r from-pink-50/90 via-cream/90 to-pink-50/90 backdrop-blur-lg rounded-2xl px-8 py-4 shadow-xl border border-berry/10">
                <p className="font-serif text-lg italic text-berry text-center mb-1">
                  ✨ Drag to explore this moment ✨
                </p>
                <p className="font-sans text-xs text-berry/70 text-center">
                  A garden of love and memories
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Title overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.8 }}
          className="pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-45"
        >
          <div className="text-center">
            <motion.h2
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 1.2 }}
              className="font-serif text-5xl md:text-6xl text-white drop-shadow-2xl mb-4"
              style={{
                textShadow: '0 0 30px rgba(255,255,255,0.5), 0 0 60px rgba(255,192,203,0.3)',
              }}
            >
              For You
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 2 }}
              className="font-sans text-white/90 text-lg drop-shadow-lg"
              style={{
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
              }}
            >
              A moment to cherish forever
            </motion.p>
          </div>
        </motion.div>
        
        {/* Exit button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.5 }}
          onClick={() => setPhase("celebration")}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 group"
        >
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            
            {/* Button */}
            <div className="relative rounded-full border-2 border-white/30 bg-gradient-to-br from-pink-100/90 via-cream/90 to-pink-100/90 backdrop-blur-lg px-10 py-4 shadow-2xl transition-all group-hover:scale-105 group-hover:shadow-pink-200/50">
              <span className="font-serif text-lg text-berry font-medium">
                Continue ✨
              </span>
            </div>
          </div>
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
