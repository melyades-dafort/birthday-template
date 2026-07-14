import { motion } from "framer-motion";
import { useExperience } from "./useExperience";
import { useBirthdayData } from "@/hooks/useBirthdayData";

export function GiftIntro({ onOpen }: { onOpen: () => void }) {
  const { phase } = useExperience();
  const { celebrantName, introMessage, introSubtitle } = useBirthdayData();
  if (phase !== "intro") return null;
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center px-6"
    >
      {/* Blur overlay */}
      <div className="absolute inset-0 backdrop-blur-2xl bg-gradient-blush/60" />
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.2, 0.9, 0.3, 1] }}
        className="relative max-w-lg text-center"
      >
        <div className="rounded-3xl border border-cream/40 bg-cream/30 px-10 py-12 backdrop-blur-xl shadow-soft">
          <div className="mb-4 font-hand text-2xl text-berry/70">for {celebrantName}</div>
          <h1 className="font-serif text-3xl leading-tight text-berry sm:text-4xl">
            {introMessage}
          </h1>
          <p className="mt-5 font-serif italic text-berry/80 sm:text-lg">
            {introSubtitle}
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={onOpen}
              className="group relative overflow-hidden rounded-full bg-rose px-8 py-3 font-sans text-sm font-medium tracking-wide text-cream shadow-soft transition-transform hover:scale-[1.03]"
            >
              <span className="relative z-10">Open My Gift</span>
              <span className="absolute inset-0 -z-0 bg-gradient-to-r from-rose via-blush to-rose opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
            <button className="rounded-full px-6 py-3 font-sans text-sm text-berry/70 transition hover:text-berry">
              Not yet
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}