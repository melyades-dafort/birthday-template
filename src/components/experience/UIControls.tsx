import { Volume2, VolumeX, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useExperience } from "./useExperience";

export function MusicToggle({ audioRef }: { audioRef: React.RefObject<HTMLAudioElement | null> }) {
  const { muted, toggleMute } = useExperience();
  return (
    <div className="fixed right-5 top-5 z-50 flex items-center gap-2">
      {/* Scrolling song title */}
      <div className="overflow-hidden rounded-full border border-berry/20 bg-cream/70 backdrop-blur-md px-4 py-2 max-w-[200px]">
        <motion.div
          animate={{ x: [0, -100] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="whitespace-nowrap font-serif text-xs italic text-berry/80"
        >
          ♪ Kabisado - IV OF SPADES ♪ Kabisado - IV OF SPADES
        </motion.div>
      </div>
      
      {/* Music toggle button */}
      <button
        onClick={() => {
          toggleMute();
          const a = audioRef.current;
          if (!a) return;
          if (muted) {
            a.play().catch(() => undefined);
            a.volume = 0.3;
          } else {
            a.pause();
          }
        }}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-berry/20 bg-cream/70 text-berry backdrop-blur-md transition hover:bg-cream"
        aria-label={muted ? "Unmute music" : "Mute music"}
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>
    </div>
  );
}

export function ProgressPill() {
  const { phase, explored, setPhase } = useExperience();
  const canFinal = explored.size >= 3;
  const show = phase === "memories" && canFinal;
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          onClick={() => setPhase("finalIntro")}
          className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full bg-berry px-5 py-2.5 font-serif text-sm italic text-cream shadow-soft hover:bg-rose"
        >
          <Sparkles className="h-4 w-4 text-gold" />
          One Last Surprise 🎀
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export function ExplorationHint() {
  const { phase, explored } = useExperience();
  if (phase !== "memories") return null;
  return (
    <div className="pointer-events-none fixed left-1/2 top-6 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full bg-cream/60 px-4 py-1.5 font-serif text-xs italic tracking-wide text-berry/80 backdrop-blur">
      <span>drag to explore</span>
      <span className="opacity-40">·</span>
      <span>click a photo to open</span>
      <span className="opacity-40">·</span>
      <span>
        {explored.size} / 12 opened
      </span>
    </div>
  );
}