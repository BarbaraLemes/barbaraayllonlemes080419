import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary: "bg-slate-800 text-white hover:bg-slate-700 focus-visible:ring-slate-800",
        secondary: "bg-slate-600 text-white hover:bg-slate-500 focus-visible:ring-slate-600",
        danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
        warning: "bg-yellow-400 text-slate-900 hover:bg-yellow-500 focus-visible:ring-yellow-400",
        ghost: "bg-transparent text-slate-800 hover:bg-slate-100 focus-visible:ring-slate-400",
        cancel: "bg-slate-200 text-slate-800 hover:bg-slate-300 focus-visible:ring-slate-400",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-base",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  loadingText?: string;
  icon?: string;
  iconPos?: "left" | "right";
}

export default function Button({
  variant,
  children,
  size,
  isLoading = false,
  loadingText = "Carregando...",
  icon,
  iconPos = "left",
  className,
  disabled,
  ...props
}: ButtonProps) {
  const iconElement = icon && <i className={`pi ${icon}`} />;

  return (
    <button
      className={buttonVariants({ variant, size, className })}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <i className="pi pi-spin pi-spinner" />
          {loadingText}
        </>
      ) : (
        <>
          {iconPos === "left" && iconElement}
          {children}
          {iconPos === "right" && iconElement}
        </>
      )}
    </button>
  );
}
