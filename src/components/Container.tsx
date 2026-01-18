import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

export const containerVariants = cva("mx-auto px-4 sm:px-6 lg:px-8", {
  variants: {
    size: {
      sm: "max-w-2xl", 
      md: "max-w-4xl", 
      lg: "max-w-6xl", 
      xl: "max-w-7xl", 
      full: "max-w-full",
    },
  },
  defaultVariants: {
    size: "xl",
  },
});

interface ContainerProps
  extends VariantProps<typeof containerVariants>, React.ComponentProps<"div"> {
  as?: keyof React.JSX.IntrinsicElements;
}

export default function Container({
  as = "div",
  size,
  children,
  className,
  ...props
}: ContainerProps) {
  return React.createElement(
    as,
    { className: containerVariants({ size, className }), ...props },
    children,
  );
}
