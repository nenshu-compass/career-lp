"use client";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef, ReactNode, Ref } from "react";

type Variant = "primary" | "accent" | "line" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  children?: ReactNode;
  className?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      fullWidth,
      children,
      ...props
    }: ButtonProps,
    ref: Ref<HTMLButtonElement>
  ) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-bold rounded-full transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants: Record<Variant, string> = {
      primary: "bg-primary-600 text-white shadow-lg hover:bg-primary-700 hover:shadow-xl",
      accent:  "bg-accent-500 text-white shadow-lg hover:bg-accent-600 hover:shadow-xl",
      line:    "text-white shadow-lg hover:shadow-xl",
      outline: "border-2 border-primary-600 text-primary-600 hover:bg-primary-50",
      ghost:   "text-gray-600 hover:bg-gray-100",
    };

    const sizes: Record<Size, string> = {
      sm: "px-5 py-2.5 text-sm",
      md: "px-8 py-4 text-base",
      lg: "px-10 py-5 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(
          base,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          variant === "line" && "[background-color:#06C755] hover:[background-color:#05a847]",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
