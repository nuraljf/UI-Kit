"use client";

import { useState } from "react";
import { Glass } from "../glass/Glass";

type Size = "md" | "sm";

const cellPad: Record<Size, string> = {
  md: "px-[20px] py-[16px]",
  sm: "px-[12px] py-[10px]",
};

/** Segmented control — Figma "button group" of numbered cells. */
export function Segmented({
  size = "md",
  count = 4,
}: {
  size?: Size;
  count?: number;
}) {
  const [active, setActive] = useState(0);
  const cells = Array.from({ length: count }, (_, i) => i + 1);

  return (
    <Glass
      variant="light"
      radius={16}
      role="group"
      className="inline-flex items-stretch overflow-hidden"
    >
      {cells.map((n, i) => (
        <button
          key={n}
          type="button"
          aria-pressed={active === i}
          onClick={() => setActive(i)}
          className={`t-fade relative cursor-pointer whitespace-nowrap text-[14px] font-normal leading-none text-black ${cellPad[size]}`}
          style={{
            borderLeft: i === 0 ? undefined : "1px solid rgba(0,0,0,0.12)",
            backgroundColor:
              active === i ? "rgba(255,255,255,0.45)" : "transparent",
          }}
        >
          {n}
        </button>
      ))}
    </Glass>
  );
}
