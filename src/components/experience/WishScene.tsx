import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useExperience } from "./useExperience";
import { useBirthdayData } from "@/hooks/useBirthdayData";

const WISH_LINES = [
  "Before this day ends...",
  "Close your eyes.",
  "Think of your biggest dream.",
  "And make a wish. ✨",
];

export function WishScene() {
  const { phase, setPhase } = useExperience();
  const { celebrantName } = useBirthdayData();
  const [line, setLine] = useState(0);
  const [wished, setWished] = useState(false);

  useEffect(() => {
    if (phase !== "finalIntro" && phase !== "wish") return;
    if (phase === "finalIntro") {
      setLine(0);
      setWished(false);
      const t1 = setTimeout(() => setLine(1), 2200);
      const t2 = setTimeout(() => setLine(2), 4400);
      const t3 = setTimeout(() => setLine(3), 6600);
      const t4 = setTimeout(() => setPhase("wish"), 9000);
      return () => [t1, t2, t3, t4].forEach(clearTimeout);
    }
  }, [phase, setPhase]);

  const makeWish = () => {
    if (wished) return;
    setWished(true);
    setTimeout(() => setPhase("celebration"), 2200);
  };

  const active = phase === "finalIntro" || phase === "wish";
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="fixed inset-0 z-30 flex items-end justify-center pb-24 sm:pb-32"
        >
          <div className="absolute inset-0 bg-gradient-wish" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />

          <div className="relative text-center">
            <AnimatePresence mode="wait">
              {phase === "finalIntro" && (
                <motion.p
                  key={line}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 1 }}
                  className="font-serif text-2xl italic text-cream/90 sm:text-4xl"
                >
                  {WISH_LINES[line]}
                </motion.p>
              )}
              {phase === "wish" && !wished && (
                <motion.button
                  key="wish-btn"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={makeWish}
                  className="rounded-full bg-cream px-10 py-4 font-serif text-lg tracking-[0.3em] text-berry shadow-soft transition hover:scale-105"
                >
                  MAKE A WISH
                </motion.button>
              )}
              {phase === "wish" && wished && (
                <motion.div
                  key="blowing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-hand text-3xl text-cream/90"
                >
                  🌬️  ...
                </motion.div>
              )}
            </AnimatePresence>
            <div className="mt-6 font-hand text-cream/60">for {celebrantName}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}