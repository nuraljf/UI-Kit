"use client";

import { useCallback, useRef, useState } from "react";
import { Glass } from "../glass/Glass";
import { useGlassContext } from "../glass/GlassContext";

const MIN_SIZE = 64;
const MAX_SIZE = 560;

type DragState = {
  mode: "move" | "resize";
  startX: number;
  startY: number;
  origX: number;
  origY: number;
  origSize: number;
};

/**
 * Near-transparent round glass — Figma center "button" — made draggable and
 * resizable so you can slide it across the photo and watch the backdrop warp
 * through the WebGL lens. The lens tracks this element's live bounding box, so
 * moving/resizing it updates the refraction in real time.
 */
export function GhostCircle({
  initialX = 748,
  initialY = 284,
  initialSize = 100,
  label = "Drag to move, drag the corner to resize",
}: {
  initialX?: number;
  initialY?: number;
  initialSize?: number;
  label?: string;
}) {
  const { stageRef } = useGlassContext();
  const [pos, setPos] = useState({ x: initialX, y: initialY });
  const [size, setSize] = useState(initialSize);
  const [active, setActive] = useState(false);
  const drag = useRef<DragState | null>(null);

  const stageScale = useCallback(() => {
    const s = stageRef.current;
    return s ? s.getBoundingClientRect().width / 1440 || 1 : 1;
  }, [stageRef]);

  const onMove = useCallback(
    (e: PointerEvent) => {
      const d = drag.current;
      if (!d) return;
      const scale = stageScale();
      const dx = (e.clientX - d.startX) / scale;
      const dy = (e.clientY - d.startY) / scale;
      if (d.mode === "move") {
        setPos({ x: d.origX + dx, y: d.origY + dy });
      } else {
        const delta = Math.max(dx, dy);
        setSize(Math.min(MAX_SIZE, Math.max(MIN_SIZE, d.origSize + delta)));
      }
    },
    [stageScale],
  );

  const onUp = useCallback(() => {
    drag.current = null;
    setActive(false);
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
  }, [onMove]);

  const begin = useCallback(
    (mode: DragState["mode"]) => (e: React.PointerEvent) => {
      e.preventDefault();
      if (mode === "resize") e.stopPropagation();
      drag.current = {
        mode,
        startX: e.clientX,
        startY: e.clientY,
        origX: pos.x,
        origY: pos.y,
        origSize: size,
      };
      setActive(true);
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [pos.x, pos.y, size, onMove, onUp],
  );

  return (
    <div
      className="group absolute"
      style={{ left: pos.x, top: pos.y, width: size, height: size, zIndex: 30 }}
    >
      <Glass
        as="div"
        variant="ghost"
        radius={size / 2}
        refract={2.6}
        priority={10}
        role="button"
        aria-label={label}
        title={label}
        onPointerDown={begin("move")}
        className="h-full w-full touch-none"
        style={{ cursor: active ? "grabbing" : "grab" }}
      />
      {/* resize handle */}
      <div
        onPointerDown={begin("resize")}
        aria-hidden
        className="absolute bottom-[6px] right-[6px] h-[16px] w-[16px] rounded-full border border-white/70 bg-white/30 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
        style={{ cursor: "nwse-resize", opacity: active ? 1 : undefined }}
      />
    </div>
  );
}
