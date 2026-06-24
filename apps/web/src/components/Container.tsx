import { ComponentProps } from "react";

import { cva, VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const containerVariants = cva("", {
  variants: {
    variant: {
      default: "p-4",
      onlyVertical: "py-4",
      onlyHorizontal: "px-4",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface ContainerProps
  extends ComponentProps<"div">,
    VariantProps<typeof containerVariants> {}

export function Container({ variant, className, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        containerVariants({
          variant,
          className,
        }),
      )}
      {...props}
    />
  );
}
