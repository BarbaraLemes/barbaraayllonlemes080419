import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

export const inputVariants = cva(
  "w-full border border-solid rounded-md bg-white outline-none transition-all duration-200 placeholder:text-slate-400",
  {
    variants: {
      variant: {
        default: "border-slate-300 focus:border-slate-800 focus:ring-2 focus:ring-slate-800/20",
        error: "border-red-600 focus:border-red-600 focus:ring-2 focus:ring-red-600/20",
      },
      size: {
        sm: "h-8 px-3 py-1.5 text-sm",
        md: "h-10 px-4 py-2 text-base",
        lg: "h-12 px-5 py-3 text-base",
      },
      disabled: {
        true: "bg-slate-100 text-slate-500 cursor-not-allowed opacity-60",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      disabled: false,
    },
  }
);

export const labelVariants = cva("block text-sm font-medium mb-1.5", {
  variants: {
    variant: {
      default: "text-slate-700",
      error: "text-slate-700",
    },
    required: {
      true: "after:content-['*'] after:ml-1 after:text-red-600",
      false: "",
    },
  },
  defaultVariants: {
    variant: "default",
    required: false,
  },
});

export const helperTextVariants = cva("text-sm mt-1.5 flex items-center gap-1", {
  variants: {
    variant: {
      default: "text-slate-500",
      error: "text-red-600",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface InputTextProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    Omit<VariantProps<typeof inputVariants>, "disabled" | "variant"> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function InputText({
  label,
  error,
  helperText,
  required,
  size = "md",
  className,
  disabled,
  id,
  ...props
}: InputTextProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  const variant = error ? "error" : "default";

  return (
    <div className="flex flex-col w-full">
      {label && (
        <label
          htmlFor={inputId}
          className={labelVariants({ variant, required })}
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        disabled={disabled}
        className={inputVariants({ 
          variant, 
          size, 
          disabled: disabled || false,
          className 
        })}
        aria-invalid={!!error}
        aria-describedby={
          error 
            ? `${inputId}-error` 
            : helperText 
            ? `${inputId}-helper` 
            : undefined
        }
        {...props}
      />

      {error && (
        <span
          id={`${inputId}-error`}
          className={helperTextVariants({ variant: "error" })}
          role="alert"
        >
          <i className="pi pi-exclamation-circle" />
          {error}
        </span>
      )}

      {helperText && !error && (
        <span
          id={`${inputId}-helper`}
          className={helperTextVariants({ variant: "default" })}
        >
          {helperText}
        </span>
      )}
    </div>
  );
}