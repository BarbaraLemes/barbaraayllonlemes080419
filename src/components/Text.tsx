import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

export const textVariants = cva("font-sans", {
  variants: {
    variant: {
      "heading-3xl": "text-xl sm:text-2xl md:text-3xl font-medium cursor-default",
      "heading-2xl": "text-lg sm:text-xl md:text-2xl font-medium cursor-default",
      "heading-xl": "text-base sm:text-lg md:text-xl font-medium cursor-default",
      "heading-lg": "text-base sm:text-lg font-medium cursor-default",
      "subtitle": "text-sm sm:text-base font-normal cursor-default",
      "body-base": "text-sm sm:text-base font-normal cursor-default",
      "body-base-secondary": "text-sm sm:text-base font-normal cursor-default",
      "body-sm": "text-xs sm:text-sm font-normal cursor-default",
      "body-sm-medium": "text-xs sm:text-sm font-medium cursor-default",
      "body-xs": "text-xs font-normal cursor-default",
      "label-sm": "text-xs sm:text-sm font-medium cursor-default",
      "label-base": "text-sm sm:text-base font-medium cursor-default",
    }
  },
  defaultVariants: {
    variant: "body-base"
  }
})

interface TextProps extends VariantProps<typeof textVariants> {
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  children?: React.ReactNode;
}

export default function Text({ as = 'span', variant, className, children, ...props }: TextProps) {
  return React.createElement(
    as,
    {
      className: textVariants({ variant, className }),
      ...props
    },
    children
  )
}