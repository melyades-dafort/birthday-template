import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBirthdayData } from "@/hooks/useBirthdayData";
import { birthdayConfig } from "@/data/memories";
import { useExperience } from "./useExperience";
import { MemoryImage } from "./MemoryImage";

export function Scrapbook() {
  const { phase, selectedId, setPhase, selectMemory, explored } = useExperience();
  const { memories } = useBirthdayData();
  const [turning, setTurning] = useState<"idle" | "next" | "prev">("idle");
  const [displayId, setDisplayId] = useState<number | null>(selectedId);

  const open = phase === "scrapbook";
  if (open && displayId !== selectedId && turning === "idle") {
    setDisplayId(selectedId);
  }

  const idx = memories.findIndex((m) => m.id === displayId);
  const memory = idx >= 0 ? memories[idx] : null;

  const go = (dir: "next" | "prev") => {
    if (turning !== "idle" || idx < 0) return;
    const nextIdx = (idx + (dir === "next" ? 1 : -1) + memories.length) % memories.length;
    setTurning(dir);
    setTimeout(() => {
      setDisplayId(memories[nextIdx].id);
      selectMemory(memories[nextIdx].id);
    }, 450);
    setTimeout(() => setTurning("idle"), 900);
  };

  const close = () => {
    setPhase("memories");
    setTimeout(() => selectMemory(null), 800);
  };

  return (
    <AnimatePresence>
      {open && memory && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-30 flex items-center justify-center px-4 py-10 sm:px-10"
        >
          {/* Cream environment */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.98_0.02_75)_0%,oklch(0.9_0.05_60)_70%,oklch(0.75_0.09_40)_100%)]" />

          <motion.div
            initial={{ scale: 0.6, rotateX: 40, opacity: 0 }}
            animate={{ scale: 1, rotateX: 0, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.2, 0.9, 0.3, 1] }}
            className="book-perspective relative w-full max-w-5xl"
          >
            <div className="book-3d relative mx-auto grid aspect-[3/2] w-full grid-cols-1 overflow-hidden rounded-2xl shadow-paper md:grid-cols-2">
              {/* Spine (desktop) */}
              <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-3 -translate-x-1/2 bg-gradient-to-r from-[oklch(0.7_0.06_40)] via-[oklch(0.55_0.08_35)] to-[oklch(0.7_0.06_40)] md:block" />

              {/* LEFT: photo page */}
              <div className="paper-texture relative flex items-center justify-center overflow-hidden p-6 sm:p-10">
                <AnimatePresence mode="wait">
                  <PagePhoto memoryId={memory.id} src={memory.image} title={memory.title} />
                </AnimatePresence>
              </div>

              {/* RIGHT: message page (with page-turn overlay) */}
              <div className="paper-texture relative overflow-hidden p-6 sm:p-10">
                <AnimatePresence mode="wait">
                  <PageMessage
                    index={idx}
                    total={memories.length}
                    title={memory.title}
                    message={memory.message}
                    date={memory.date}
                  />
                </AnimatePresence>
                <AnimatePresence>
                  {turning !== "idle" && (
                    <motion.div
                      key={turning}
                      initial={{ rotateY: turning === "next" ? 0 : -180 }}
                      animate={{ rotateY: turning === "next" ? -180 : 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.9, ease: [0.6, 0.05, 0.3, 1] }}
                      className="page-turn absolute inset-0 bg-cream shadow-paper"
                      style={{ transformOrigin: turning === "next" ? "left center" : "right center" }}
                    >
                      <div className="paper-texture h-full w-full" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Controls */}
            <div className="mt-6 flex items-center justify-between gap-4 text-berry">
              <button
                onClick={close}
                className="rounded-full border border-berry/30 px-5 py-2 font-sans text-sm transition hover:bg-berry hover:text-cream"
              >
                ← Back to memories
              </button>
              <div className="flex items-center gap-3 font-serif italic text-berry/80">
                <button onClick={() => go("prev")} disabled={turning !== "idle"} className="px-3 py-1 disabled:opacity-40">
                  ‹ previous
                </button>
                <span className="text-sm">
                  {String(idx + 1).padStart(2, "0")} / {String(memories.length).padStart(2, "0")}
                </span>
                <button onClick={() => go("next")} disabled={turning !== "idle"} className="px-3 py-1 disabled:opacity-40">
                  next ›
                </button>
              </div>
            </div>
            <div className="mt-2 text-center font-hand text-berry/60">
              {explored.size} of {memories.length} memories opened · from {birthdayConfig.senderName}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PagePhoto({ memoryId, src, title }: { memoryId: number; src: string; title: string }) {
  const tilt = memoryId % 2 === 0 ? -3 : 3;
  return (
    <motion.div
      key={memoryId}
      initial={{ opacity: 0, scale: 0.9, y: 20, rotate: tilt }}
      animate={{ opacity: 1, scale: 1, y: 0, rotate: tilt }}
      exit={{ opacity: 0, scale: 0.9, y: -20, rotate: tilt }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="relative aspect-[3/4] w-4/5 max-w-sm rounded-sm bg-cream p-3 pb-14 shadow-paper"
    >
      {/* Tape */}
      <div className="absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 rotate-[-4deg] rounded-sm bg-blush/60 opacity-80" />
      <div className="relative h-full w-full overflow-hidden bg-pastel">
        <MemoryImage src={src} alt={title} />
      </div>
      <div className="absolute bottom-3 left-0 right-0 text-center font-hand text-lg text-berry">
        {title}
      </div>
      {/* Heart sticker */}
      <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-rose text-cream shadow-soft">
        ♡
      </div>
    </motion.div>
  );
}

function PageMessage({
  index,
  total,
  title,
  message,
  date,
}: {
  index: number;
  total: number;
  title: string;
  message: string;
  date: string;
}) {
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex h-full flex-col justify-between"
    >
      <div className="font-sans text-xs uppercase tracking-[0.3em] text-berry/50">
        Memory {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
      <div>
        <h2 className="font-serif text-3xl leading-tight text-berry sm:text-4xl">{title}</h2>
        <p className="mt-4 font-serif text-base leading-relaxed text-berry/85 sm:text-lg">
          {message}
        </p>
        <p className="mt-6 font-hand text-xl text-rose">Keep this memory close. ♡</p>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div className="font-hand text-lg text-berry/60">{date}</div>
        <svg width="42" height="42" viewBox="0 0 42 42" className="text-gold">
          <path
            d="M21 4l4 12h12l-10 7 4 12-10-7-10 7 4-12L5 16h12z"
            fill="currentColor"
            opacity="0.6"
          />
        </svg>
      </div>
    </motion.div>
  );
}