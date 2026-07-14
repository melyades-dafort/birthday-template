import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BirthdayExperience } from "@/components/experience/BirthdayExperience";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
  return (
      <div className="flex h-[100svh] w-full items-center justify-center bg-gradient-blush">
        <div className="font-serif italic text-berry/70">preparing your gift…</div>
      </div>
    );
  }
  return <BirthdayExperience />;
}
