import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const loadingVariants = cva("animate-spin", {
  variants: {
    size: {
      xs: "h-3 w-3",
      sm: "h-4 w-4",
      default: "h-6 w-6",
      md: "h-6 w-6",
      lg: "h-8 w-8",
      xl: "h-10 w-10",
      "2xl": "h-12 w-12",
    },
    color: {
      default: "text-muted-foreground",
      primary: "text-primary",
      secondary: "text-secondary",
      accent: "text-accent-foreground",
      white: "text-white",
      muted: "text-muted-foreground",
    },
  },
  defaultVariants: {
    size: "default",
    color: "default",
  },
});

const loadingContainerVariants = cva("flex items-center justify-center", {
  variants: {
    spacing: {
      none: "",
      sm: "gap-2",
      default: "gap-3",
      lg: "gap-4",
    },
  },
  defaultVariants: {
    spacing: "default",
  },
});

export interface LoadingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof loadingVariants>,
    VariantProps<typeof loadingContainerVariants> {
  text?: string;
  showText?: boolean;
}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  (
    {
      className,
      size,
      color,
      spacing,
      text = "Loading...",
      showText = false,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(loadingContainerVariants({ spacing }), className)}
        {...props}
      >
        <Loader2 className={cn(loadingVariants({ size, color }))} />
        {showText && (
          <span className="text-sm text-muted-foreground">{text}</span>
        )}
      </div>
    );
  },
);

Loading.displayName = "Loading";

export { Loading, loadingVariants };
