"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type RefObject,
} from "react";

/** A single registered glass surface — read live by the WebGL canvas. */
export interface LensData {
  el: HTMLElement | null;
  /** premultiplied-friendly tint, components are 0..1 */
  tint: [number, number, number, number];
  /** inner-highlight intensity (0.25 soft / 0.5 strong in Figma) */
  hl: number;
  /** corner radius in stage pixels */
  radius: number;
}

interface GlassContextValue {
  lenses: Map<number, LensData>;
  stageRef: RefObject<HTMLDivElement | null>;
  register: (data: LensData) => () => void;
}

const GlassContext = createContext<GlassContextValue | null>(null);

export function GlassProvider({
  stageRef,
  children,
}: {
  stageRef: RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}) {
  const lenses = useRef<Map<number, LensData>>(new Map()).current;
  const nextId = useRef(0);

  const register = useCallback(
    (data: LensData) => {
      const id = nextId.current++;
      lenses.set(id, data);
      return () => {
        lenses.delete(id);
      };
    },
    [lenses],
  );

  const value = useMemo<GlassContextValue>(
    () => ({ lenses, stageRef, register }),
    [lenses, stageRef, register],
  );

  return <GlassContext.Provider value={value}>{children}</GlassContext.Provider>;
}

export function useGlassContext() {
  const ctx = useContext(GlassContext);
  if (!ctx) throw new Error("useGlassContext must be used within <GlassProvider>");
  return ctx;
}
