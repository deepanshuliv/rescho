"use client";

import { forwardRef, ReactNode, MouseEventHandler } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  loadingText?: string;
  className?: string;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  /** Renders a Next.js link styled as a button instead of a <button>. */
  href?: string;
  "aria-label"?: string;
}

const baseStyles =
  "inline-flex items-center justify-center gap-2 font-semibold font-display rounded-2xl tracking-tight select-none transition-[transform,box-shadow,background-color,color,border-color,opacity] duration-200 ease-out";

const variants = {
  primary:
    "btn-sheen bg-brand-gradient text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_6px_16px_-8px_rgba(192,24,46,0.7)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_10px_24px_-10px_rgba(192,24,46,0.8)] hover:-translate-y-0.5 disabled:bg-none disabled:bg-bg-tertiary disabled:text-text-muted disabled:shadow-none disabled:hover:translate-y-0",
  secondary:
    "border border-white/[0.1] bg-white/[0.03] text-text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-white/[0.18] hover:bg-white/[0.06] disabled:opacity-40",
  ghost:
    "text-text-secondary hover:text-text-primary hover:bg-white/[0.06] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] disabled:opacity-40",
};

const sizes = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-5 text-sm",
  lg: "h-[52px] px-7 text-[15px]",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading,
      loadingText,
      className = "",
      disabled,
      onClick,
      type = "button",
      href,
      "aria-label": ariaLabel,
    },
    ref,
  ) => {
    const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    if (href) {
      return (
        <Link href={href} className={classes} aria-label={ariaLabel}>
          {children}
        </Link>
      );
    }

    return (
      <motion.button
        ref={ref}
        type={type}
        whileTap={{ scale: 0.98 }}
        className={classes}
        disabled={disabled || isLoading}
        onClick={onClick}
        aria-label={ariaLabel}
        aria-busy={isLoading || undefined}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin h-4 w-4" />
            {loadingText ?? children}
          </>
        ) : (
          children
        )}
      </motion.button>
    );
  },
);

Button.displayName = "Button";

export default Button;
