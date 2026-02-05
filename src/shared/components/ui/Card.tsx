import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

export const cardVariants = cva(
  `rounded-lg border border-solid border-slate-200
    bg-white shadow-sm transition-all duration-200
  `,
  {
    variants: {
      variant: {
        default: "shadow-sm",
        elevated: "shadow-md hover:shadow-lg",
        flat: "border-none shadow-none",
      },
      padding: {
        none: "",
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
      },
      hover: {
        true: "hover:shadow-lg cursor-pointer",
        false: "",
      },
    },
    defaultVariants: {
      variant: "elevated",
      padding: "md",
      hover: false,
    },
  },
);

interface CardProps
  extends VariantProps<typeof cardVariants>, React.ComponentProps<"div"> {
  as?: keyof React.JSX.IntrinsicElements;
}

export default function Card({
  as = "div",
  variant,
  padding,
  hover,
  children,
  className,
  ...props
}: CardProps) {
  return React.createElement(
    as,
    {
      className: cardVariants({ variant, padding, hover, className }),
      ...props,
    },
    children,
  );
}
