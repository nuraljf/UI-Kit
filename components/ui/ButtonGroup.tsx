"use client";

import { Glass, type GlassVariant } from "../glass/Glass";
import { SelectorIcon } from "../icons";

/** Button group with a dropdown handle — Figma "button group". */
export function ButtonGroup({
  variant = "light",
  label = "Button Group",
}: {
  variant?: GlassVariant;
  label?: string;
}) {
  const seam =
    variant === "light" ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.18)";

  return (
    <Glass
      variant={variant}
      radius={16}
      interactive
      className="inline-flex h-[53px] w-[174px] items-stretch overflow-hidden"
    >
      <span className="flex flex-1 items-center justify-center whitespace-nowrap px-[20px] text-[16px] font-medium leading-none">
        {label}
      </span>
      <span
        className="flex items-center justify-center px-[5px]"
        style={{ borderLeft: `1px solid ${seam}` }}
        aria-hidden
      >
        <SelectorIcon />
      </span>
    </Glass>
  );
}
