import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

export const textVariants = cva("font-sans", {
  variants: {
    variant: {
      "heading-3xl": "text-3xl font-medium",
      "heading-2xl": "text-2xl font-medium",
      "heading-xl": "text-xl font-medium",
      "heading-lg": "text-lg font-medium",
      "subtitle": "text-base font-normal",
      "body-base": "text-base font-normal",
      "body-base-secondary": "text-base font-normal",
      "body-sm": "text-sm font-normal",
      "body-sm-medium": "text-sm font-medium",
      "body-xs": "text-xs font-normal",
      "label-sm": "text-sm font-medium",
      "label-base": "text-base font-medium",
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