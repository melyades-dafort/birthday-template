import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Scene3D } from "./Scene3D";
import { GiftIntro } from "./GiftIntro";
import { HeroOverlay } from "./HeroOverlay";
import { Scrapbook } from "./Scrapbook";
import { WishScene } from "./WishScene";
import { Celebration } from "./Celebration";
import { MusicToggle, ProgressPill, ExplorationHint } from "./UIControls";
import { useExperience } from "./useExperience";
import { useBirthdayData } from "@/hooks/useBirthdayData";

export function BirthdayExperience() {
  const { phase, setPhase, setScroll, scroll, toggleMute, selectedId, explored } = useExperience();
  const { backgroundMusic } = useBirthdayData();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollHostRef = useRef<HTMLDivElement | null>(null);

  // Try fullscreen + fade music in on open
  const openGift = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen().catch(() => undefined);
    setPhase("hero");
    const a = audioRef.current;
    if (a) {
      a.volume = 0;
      // Only play if audio source is available
      a.play()
        .then(() => {
          const target = 0.3;
          const start = performance.now();
          const fade = (t: number) => {
            const p = Math.min(1, (t - start) / 2000);
            a.volume = target * p;
            if (p < 1) requestAnimationFrame(fade);
          };
          requestAnimationFrame(fade);
          toggleMute();
        })
        .catch(() => {
          // Audio file not found or playback failed - continue without music
          console.log("Background music not available - continuing without audio");
        });
    }
  };

  // Scroll driver: hero -> memories transition (0..1) - smooth and precise
  useEffect(() => {
    const el = scrollHostRef.current;
    if (!el) return;
    
    let scrollTimeout: NodeJS.Timeout;
    
    const onScroll = () => {
      const max = el.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0;
      setScroll(p);
      
      // Auto-complete scroll when user stops scrolling
      clearTimeout(scrollTimeout);
      
      // Only auto-complete if user scrolled a reasonable amount and then stopped
      if (phase === "hero" && p > 0.15 && p < 0.85) {
        scrollTimeout = setTimeout(() => {
          // Decide direction based on how far they scrolled
          if (p < 0.5) {
            // Return to top
            el.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          } else {
            // Complete to bottom
            el.scrollTo({
              top: max,
              behavior: 'smooth'
            });
          }
        }, 300); // Wait 300ms after user stops scrolling
      } else if (phase === "memories" && p < 0.85 && p > 0.15) {
        // If scrolling back from memories, auto-complete to top or bottom
        scrollTimeout = setTimeout(() => {
          if (p < 0.5) {
            el.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          } else {
            el.scrollTo({
              top: max,
              behavior: 'smooth'
            });
          }
        }, 300); // Wait 300ms after user stops scrolling
      }
      
      // Smooth phase transitions based on scroll position
      // Transition happens later to ensure 100% = fully revealed memories
      if (phase === "hero" && p > 0.85) {
        setPhase("memories");
      } else if (phase === "memories" && p < 0.3) {
        setPhase("hero");
      } else if (phase === "celebration" && p < 0.7) {
        // Allow scrolling back from celebration to memories
        setPhase("memories");
      }
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      clearTimeout(scrollTimeout);
    };
  }, [phase, setScroll, setPhase]);

  // ESC to close scrapbook / return
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && phase === "scrapbook") setPhase("memories");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, setPhase]);

  const showScroll = phase === "hero" || phase === "memories" || phase === "celebration" || phase === "scrapbook" || phase === "memoryFocus";

  return (
    <div className="relative h-[100svh] w-full overflow-hidden bg-warm-white text-berry">
      {/* 3D Scene fixed layer (handles backgrounds) */}
      <div className="fixed inset-0 z-10">
        <Scene3D phase={phase} scroll={scroll} selectedId={selectedId} explored={explored} />
      </div>

      {/* Overlays */}
      <HeroOverlay />
      <ExplorationHint />
      <ProgressPill />
      <Scrapbook />
      <WishScene />
      <Celebration />

      {/* Scroll host — active during hero/memories/celebration/scrapbook */}
      {showScroll && (
        <div
          ref={scrollHostRef}
          className="fixed inset-0 overflow-y-auto"
          style={{ 
            zIndex: phase === "memories" ? 5 : 20,
            pointerEvents: (phase === "scrapbook" || phase === "memoryFocus") ? "none" : "auto"
          }}
        >
          {/* Invisible tall scaffold to drive scroll */}
          <div style={{ height: "260vh" }} />
        </div>
      )}

      <MusicToggle audioRef={audioRef} />

      {/* Ambient music (best-effort, optional). Uses custom music if uploaded, otherwise defaults to Kabisado */}
      <audio ref={audioRef} loop preload="none" key={backgroundMusic}>
        <source src={backgroundMusic} type="audio/mpeg" />
      </audio>

      <AnimatePresence>{phase === "intro" && <GiftIntro onOpen={openGift} />}</AnimatePresence>
    </div>
  );
}