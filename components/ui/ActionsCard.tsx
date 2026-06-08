"use client";

import { Glass, type GlassVariant } from "../glass/Glass";
import { PlusIcon } from "../icons";

/** Actions card — Figma "actions": a label over an icon/title/description button. */
export function ActionsCard({
  variant = "light",
  title = "Button",
  description = "Description",
  label = "Actions",
}: {
  variant?: "light" | "dark-strong";
  title?: string;
  description?: string;
  label?: string;
}) {
  const muted =
    variant === "light" ? "text-[rgba(0,0,0,0.8)]" : "text-[rgba(255,255,255,0.8)]";
  const innerVariant: GlassVariant = variant;

  return (
    <Glass
      variant={variant}
      radius={16}
      className="flex w-[143px] flex-col items-stretch gap-[10px] px-[10px] py-[16px]"
    >
      <span className={`text-[14px] font-normal leading-none ${muted}`}>
        {label}
      </span>
      <Glass
        as="button"
        interactive
        variant={innerVariant}
        radius={16}
        className="flex w-full items-center justify-start gap-[5px] px-[12px] py-[10px]"
      >
        <PlusIcon />
        <span className="flex flex-col items-start">
          <span className="text-[16px] font-medium leading-none">{title}</span>
          <span className={`text-[14px] font-normal leading-none ${muted}`}>
            {description}
          </span>
        </span>
      </Glass>
    </Glass>
  );
}
