import { motion } from "framer-motion";
import { useExperience } from "./useExperience";
import { useBirthdayData } from "@/hooks/useBirthdayData";
import { birthdayConfig } from "@/data/memories";

export function HeroOverlay() {
  const { phase, scroll } = useExperience();
  const { celebrantName } = useBirthdayData();
  const showHero = phase === "hero";
  const t = showHero ? 1 - scroll : 0;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-20 overflow-hidden"
      aria-hidden={!showHero}
    >
      {/* Organic layered pink waves */}
      <motion.div
        className="absolute -left-24 -top-24 h-[70vh] w-[70vh] rounded-full bg-gradient-blush blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, 40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        style={{ opacity: 0.7 * t + 0.2 }}
      />
      <motion.div
        className="absolute -bottom-32 -right-20 h-[80vh] w-[80vh] rounded-full bg-gradient-dream blur-3xl"
        animate={{ x: [0, -40, 0], y: [0, -30, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        style={{ opacity: 0.6 * t + 0.15 }}
      />
      <motion.div
        className="absolute left-1/3 top-1/2 h-[40vh] w-[40vh] rounded-full bg-pastel blur-3xl"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        style={{ opacity: 0.4 * t }}
      />

      {/* Editorial typography */}
      <div className="relative h-full w-full">
        <motion.h1
          className="absolute left-4 top-[8vh] font-serif text-[22vw] font-light leading-[0.85] tracking-tight text-berry sm:left-10 sm:text-[16vw]"
          style={{
            opacity: t,
            transform: `translateX(${-scroll * 40}vw)`,
          }}
        >
          Happy
        </motion.h1>
        <motion.h1
          className="absolute right-4 top-[26vh] font-serif text-[22vw] font-light leading-[0.85] tracking-tight text-rose sm:right-10 sm:top-[22vh] sm:text-[16vw]"
          style={{
            opacity: t,
            transform: `translateX(${scroll * 40}vw)`,
          }}
        >
          Birthday
        </motion.h1>
        <motion.h1
          className="absolute bottom-[18vh] left-6 font-serif italic text-[14vw] font-normal leading-none text-berry/90 sm:bottom-[14vh] sm:left-16 sm:text-[10vw]"
          style={{
            opacity: t,
            transform: `translateY(${scroll * 40}vh) scale(${1 - scroll * 0.4})`,
          }}
        >
          {celebrantName}
        </motion.h1>

        <motion.p
          className="absolute bottom-[10vh] right-6 max-w-xs text-right font-serif text-sm italic text-berry/70 sm:right-16 sm:text-base"
          style={{ opacity: t }}
        >
          {birthdayConfig.openingMessage}
        </motion.p>

        <motion.div
          className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-berry/60"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ opacity: t }}
        >
          <span className="font-hand text-lg">Scroll to unwrap your memories</span>
          <span className="text-xl">↓</span>
        </motion.div>
      </div>
    </div>
  );
}