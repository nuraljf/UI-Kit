"use client";

import { Glass, type GlassVariant } from "../glass/Glass";
import { PlusIcon } from "../icons";

type Size = "md" | "sm";

const pad: Record<Size, string> = {
  md: "px-[20px] py-[16px] text-[16px]",
  sm: "px-[12px] py-[10px] text-[14px]",
};

const iconPad: Record<Size, string> = {
  md: "p-[16px]",
  sm: "p-[10px]",
};

interface ButtonProps {
  variant?: GlassVariant;
  size?: Size;
  /** pill (34px) instead of the default 16px radius */
  pill?: boolean;
  className?: string;
  children: React.ReactNode;
}

/** Text button — Figma "button" / "button small". */
export function Button({
  variant = "light",
  size = "md",
  pill = false,
  className = "",
  children,
}: ButtonProps) {
  return (
    <Glass
      as="button"
      interactive
      variant={variant}
      radius={pill ? 34 : 16}
      className={`inline-flex items-center justify-center gap-[5px] whitespace-nowrap font-medium leading-none ${pad[size]} ${className}`}
    >
      {children}
    </Glass>
  );
}

interface IconButtonProps {
  variant?: GlassVariant;
  size?: Size;
  pill?: boolean;
  label: string;
  className?: string;
  icon?: React.ReactNode;
}

/** Icon-only button — symmetric padding, Figma "button" with an icon child. */
export function IconButton({
  variant = "light",
  size = "md",
  pill = false,
  label,
  className = "",
  icon,
}: IconButtonProps) {
  return (
    <Glass
      as="button"
      interactive
      variant={variant}
      radius={pill ? 34 : 16}
      aria-label={label}
      className={`inline-flex items-center justify-center ${iconPad[size]} ${className}`}
    >
      {icon ?? <PlusIcon />}
    </Glass>
  );
}
