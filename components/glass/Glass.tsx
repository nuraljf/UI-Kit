"use client";

import { forwardRef, useMemo } from "react";
import { useGlass } from "./useGlass";

export type GlassVariant = "light" | "dark" | "dark-strong" | "subtle" | "ghost";

type Tint = [number, number, number, number];

interface VariantSpec {
  tint: Tint;
  hl: number;
  /** default foreground text color class */
  fg: string;
}

const VARIANTS: Record<GlassVariant, VariantSpec> = {
  light: { tint: [1, 1, 1, 0.65], hl: 0.5, fg: "text-black" },
  subtle: { tint: [1, 1, 1, 0.4], hl: 0.5, fg: "text-[rgba(0,0,0,0.65)]" },
  ghost: { tint: [1, 1, 1, 0.1], hl: 0.5, fg: "text-black" },
  dark: { tint: [0, 0, 0, 0.65], hl: 0.25, fg: "text-white" },
  "dark-strong": { tint: [0, 0, 0, 0.65], hl: 0.5, fg: "text-white" },
};

export interface GlassProps
  extends React.HTMLAttributes<HTMLElement> {
  variant?: GlassVariant;
  /** corner radius in px — must match the WebGL lens radius */
  radius?: number;
  as?: "button" | "div";
  interactive?: boolean;
  /** refraction strength multiplier (1 = subtle panel, >1 = strong lens) */
  refract?: number;
  /** draw priority — higher wins where lenses overlap */
  priority?: number;
}

/**
 * A glass surface. It paints NO background of its own — the refraction, tint
 * and inner highlight are rendered by the WebGL canvas behind it. This element
 * carries only the drop shadow, geometry (for the lens registry) and content.
 */
export const Glass = forwardRef<HTMLElement, GlassProps>(function Glass(
  {
    variant = "light",
    radius = 16,
    as = "div",
    interactive = false,
    refract = 1,
    priority = 0,
    className = "",
    style,
    children,
    ...rest
  },
  _ref,
) {
  const spec = VARIANTS[variant];
  const setLensRef = useGlass(
    useMemo(
      () => ({ tint: spec.tint, hl: spec.hl, radius, refract, priority }),
      [spec.tint, spec.hl, radius, refract, priority],
    ),
  );

  const Tag = as as "button";

  return (
    <Tag
      ref={setLensRef as React.Ref<HTMLButtonElement>}
      className={[
        "relative isolate select-none",
        spec.fg,
        interactive ? "t-press cursor-pointer" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        borderRadius: radius,
        boxShadow: "var(--ui-drop-shadow)",
        background: "transparent",
        border: 0,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
});
