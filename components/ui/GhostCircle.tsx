"use client";

import { Glass } from "../glass/Glass";

/** Near-transparent round button — Figma center "button" (ghost circle). */
export function GhostCircle({ label = "Action" }: { label?: string }) {
  return (
    <Glass
      as="button"
      interactive
      variant="ghost"
      radius={64}
      aria-label={label}
      className="flex h-[100px] w-[100px] items-center justify-center p-[16px]"
    />
  );
}
