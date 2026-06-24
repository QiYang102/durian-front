import * as React from "react";

import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const textVariants = cva("", {
  variants: {
    variant: {
      h1: "text-3xl font-semibold",
      h2: "text-2xl font-semibold",
      h3: "text-xl font-semibold",
      h4: "text-sm font-medium",
      default: "text-base",
      caption: "text-sm",
      macro: "text-xs",
      micro: "text-xxs",
      "calendar-title": "text-base font-semibold",
      "calendar-header": "text-2xl font-bold uppercase"
    },
    color: {
      default: "",
      primary: "text-primary",
      secondary: "text-secondary",
      accent: "text-accent",
      link: "text-link",
      hero: "text-hero",
      success: "text-success",
      danger: "text-red-500",
      warning: "text-warning",
      info: "text-info-500",
      black: "text-black",
      white: "text-white",
      muted: "text-muted",
      mutedLight: "text-mutedLight",
      gray: "text-gray-400",
      card: "text-[#636363]",
      systemBlack: "text-[#111827]",
    },
    size: {
      default: "",
      xxs: "text-xxs",
      xs: "text-xs",
      sm: "text-sm",
      md: "text-md",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
      "5xl": "text-5xl",
      "6xl": "text-6xl",
      "7xl": "text-7xl",
    },
  },
  defaultVariants: {
    variant: "default",
    color: "default",
    size: "default",
  },
});

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: string;
  size?: string;
  color?: string;
}

const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      color = "default",
      ...props
    },
    ref,
  ) => {
    return (
      <span
        className={cn(
          textVariants({
            variant,
            color,
            size,
            className,
          }),
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Text.displayName = "Text";
export { Text };
