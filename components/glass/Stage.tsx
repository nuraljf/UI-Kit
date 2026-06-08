"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { GlassProvider } from "./GlassContext";

// Three.js accesses browser globals (WebGL context, canvas) so it must never
// run on the server. Dynamic import with ssr:false defers the entire R3F tree
// to the client, preventing the Internal Server Error on first page load.
const LiquidGlassCanvas = dynamic(
  () => import("./LiquidGlassCanvas").then((m) => ({ default: m.LiquidGlassCanvas })),
  { ssr: false },
);

const STAGE_W = 1440;
const STAGE_H = 1024;

/**
 * Reproduces the Figma frame "UI'Kit" (117:5) at its native 1440×1024 and
 * scales it down responsively while preserving the exact ratio.
 */
export function Stage({ children }: { children: React.ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const fit = () => {
      const available = document.documentElement.clientWidth - 48; // 24px padding/side
      setScale(Math.min(1, available / STAGE_W));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return (
    <div className="flex justify-center overflow-hidden p-6">
      <div
        style={{ width: STAGE_W * scale, height: STAGE_H * scale }}
        className="relative"
      >
        <GlassProvider stageRef={stageRef}>
          <div
            ref={stageRef}
            className="absolute left-0 top-0 overflow-hidden rounded-xl"
            style={{
              width: STAGE_W,
              height: STAGE_H,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <LiquidGlassCanvas />
            <div className="absolute inset-0 z-10">{children}</div>
          </div>
        </GlassProvider>
      </div>
    </div>
  );
}
