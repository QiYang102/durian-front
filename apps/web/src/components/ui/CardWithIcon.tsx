import * as React from "react";

import { cva, VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

import { Text } from "./Text";

const cardVariants = cva("bg-white rounded-2xl p-4", {
  variants: {
    variant: {
      border: "border border-slate-500",
      shadow: "shadow-lg shadow-slate-200 border border-slate-200",
      disabled: "bg-gray-300 shadow-none",
      info: "bg-[#EBF0FC]",
      borderless: "border border-slate-300",
    },
  },
  defaultVariants: {
    variant: "border",
  },
});

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  title?: any;
  titleClassName?: string;
}

function CardIcon({
  className,
  variant,
  title,
  titleClassName,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        cardVariants({
          variant,
          className,
        }),
      )}
      {...props}
    >
      {title && (
        <div className="relative -my-5 ml-2 flex self-start px-2">
          <Text className={`${titleClassName} bg-white`}>{title}</Text>
        </div>
      )}
      {props.children}
    </div>
  );
}

export { CardIcon };
