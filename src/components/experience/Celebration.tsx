import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import { useExperience } from "./useExperience";
import { useBirthdayData } from "@/hooks/useBirthdayData";
import { birthdayConfig } from "@/data/memories";

function TypingText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let currentIndex = 0;
    
    const startTyping = () => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
        timeout = setTimeout(startTyping, 30); // 30ms per character
      }
    };
    
    // Start typing after delay
    timeout = setTimeout(startTyping, delay);
    
    return () => clearTimeout(timeout);
  }, [text, delay]);
  
  return <>{displayedText}</>;
}

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 4 + Math.random() * 4,
        color: ["#F7A8C4", "#E875A5", "#FFF8F0", "#C8A96B", "#FFD1E1"][i % 5],
        size: 6 + Math.random() * 8,
        rotate: Math.random() * 360,
      })),
    [],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ y: "-10vh", rotate: p.rotate, opacity: 0 }}
          animate={{ y: "110vh", rotate: p.rotate + 720, opacity: [0, 1, 1, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute block rounded-sm"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.4,
            background: p.color,
          }}
        />
      ))}
    </div>
  );
}

export function Celebration() {
  const { phase, setPhase, selectMemory } = useExperience();
  const { celebrantName, finalMessage } = useBirthdayData();
  if (phase !== "celebration") return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4 }}
        className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center px-6"
      >
        <div className="absolute inset-0 bg-gradient-celebrate" />
        <Confetti />
        <div className="pointer-events-auto relative max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="font-sans text-xs uppercase tracking-[0.5em] text-berry/60"
          >
            {birthdayConfig.senderName}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="mt-4 font-serif text-[14vw] leading-[0.9] text-berry sm:text-8xl"
          >
            Happy Birthday
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.9 }}
            className="font-serif italic text-[18vw] leading-none text-rose sm:text-9xl"
          >
            {celebrantName}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.5 }}
            className="mx-auto mt-8 max-w-xl font-serif text-base leading-relaxed text-berry/85 sm:text-lg"
          >
            <TypingText text={finalMessage} delay={1500} />
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.2 }}
            className="mt-6 font-hand text-2xl text-rose"
          >
            With love, {birthdayConfig.senderName}
          </motion.p>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.8 }}
            onClick={() => {
              selectMemory(null);
              setPhase("memories");
            }}
            className="mt-10 rounded-full border border-berry/30 bg-cream/60 px-6 py-3 font-sans text-sm text-berry backdrop-blur transition hover:bg-berry hover:text-cream"
          >
            Relive the memories
          </motion.button>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 3.2 }}
            className="mt-4 font-hand text-sm text-berry/60"
          >
            or scroll up to go back to the beginning
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}