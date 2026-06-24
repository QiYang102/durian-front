import * as React from "react";

import { cva, VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

import { Text } from "./Text";

const buttonVariants = cva("bg-white rounded-3xl p-4", {
  variants: {
    variant: {
      border: "border-slate-500 border ",
      shadow: "shadow-lg shadow-slate-200 border border-slate-200",
      disabled: "border border-slate-200 bg-gray-100 shadow-none",
      info: "bg-[#EBF0FC]",
      borderless: "border border-slate-300",
    },
  },
  defaultVariants: {
    variant: "borderless",
  },
});

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof buttonVariants> {
  title?: string;
  titleClassName?: string;
  titleVariant?: string;
  titleColor?: string;
  svg?: any;
  disabled?: boolean;
}

function IconButton({
  className,
  variant,
  title,
  titleClassName,
  titleVariant = "macro",
  titleColor = "secondary",
  disabled,
  svg,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        buttonVariants({
          variant,
          className,
        }),
        "cursor-pointer",
      )}
      {...props}
    >
      {title && (
        <div className="flex h-20 w-16 items-center justify-center">
          <div className={`flex flex-col items-center ${className} `}>
            {svg}
            <Text
              variant={titleVariant}
              color={titleColor}
              className={`${titleClassName} mt-2 text-center`}
            >
              {title}
            </Text>
          </div>
        </div>
      )}
      {props.children}
    </div>
  );
}

export { IconButton };
