export type Phase =
  | "intro"
  | "hero"
  | "memories"
  | "memoryFocus"
  | "scrapbook"
  | "finalIntro"
  | "wish"
  | "celebration";

interface ExperienceState {
  phase: Phase;
  selectedId: number | null;
  explored: Set<number>;
  muted: boolean;
  scroll: number; // 0..1 hero->memories transition
  setPhase: (p: Phase) => void;
  setScroll: (n: number) => void;
  selectMemory: (id: number | null) => void;
  markExplored: (id: number) => void;
  toggleMute: () => void;
  reset: () => void;
}

// Minimal zustand-less store — we roll our own to avoid extra deps
type Listener = () => void;
let state: Omit<ExperienceState, keyof Actions> = {
  phase: "intro",
  selectedId: null,
  explored: new Set<number>(),
  muted: true,
  scroll: 0,
};
type Actions = Pick<
  ExperienceState,
  "setPhase" | "setScroll" | "selectMemory" | "markExplored" | "toggleMute" | "reset"
>;
const listeners = new Set<Listener>();
const notify = () => listeners.forEach((l) => l());

const actions: Actions = {
  setPhase: (p) => {
    state = { ...state, phase: p };
    notify();
  },
  setScroll: (n) => {
    if (state.scroll === n) return;
    state = { ...state, scroll: n };
    notify();
  },
  selectMemory: (id) => {
    state = { ...state, selectedId: id };
    notify();
  },
  markExplored: (id) => {
    if (state.explored.has(id)) return;
    const next = new Set(state.explored);
    next.add(id);
    state = { ...state, explored: next };
    notify();
  },
  toggleMute: () => {
    state = { ...state, muted: !state.muted };
    notify();
  },
  reset: () => {
    state = { phase: "intro", selectedId: null, explored: new Set(), muted: state.muted, scroll: 0 };
    notify();
  },
};

import { useEffect, useState } from "react";

export function getExperience() {
  return state;
}

export function subscribeExperience(cb: Listener) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function useExperience(): ExperienceState {
  const [snap, setSnap] = useState(state);
  useEffect(() => subscribeExperience(() => setSnap(state)), []);
  return { ...snap, ...actions };
}

export const experienceActions = actions;