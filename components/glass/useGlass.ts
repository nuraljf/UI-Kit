"use client";

import { useCallback, useEffect, useRef } from "react";
import { useGlassContext, type LensData } from "./GlassContext";

/**
 * Registers a DOM element as a refractive glass lens. The returned ref
 * callback is attached to the surface element; its live bounding box is read
 * every frame by the WebGL canvas, so CSS transforms (hover / press) make the
 * glass follow the DOM 1:1.
 */
export function useGlass(opts: {
  tint: [number, number, number, number];
  hl: number;
  radius: number;
}) {
  const { register } = useGlassContext();

  // One mutable record shared with the registry; kept current every render.
  const data = useRef<LensData>({
    el: null,
    tint: opts.tint,
    hl: opts.hl,
    radius: opts.radius,
  });
  data.current.tint = opts.tint;
  data.current.hl = opts.hl;
  data.current.radius = opts.radius;

  useEffect(() => {
    const unregister = register(data.current);
    return unregister;
  }, [register]);

  return useCallback((el: HTMLElement | null) => {
    data.current.el = el;
  }, []);
}
