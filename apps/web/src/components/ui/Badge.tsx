import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

import { Text } from "./Text";

const chipVariants = cva(
  "px-5 py-[0.5] border rounded-full self-start flex-row items-center",
  {
    variants: {
      color: {
        success: "bg-green-100 border-green-600",
        warning: "bg-yellow-100 border-yellow-600",
        danger: "bg-red-100 border-red-600",
        info: "bg-blue-100 border-blue-600",
        default: "bg-slate-100 border-slate-600",
        muted: "bg-slate-500 border-slate-600",
        black: "bg-black border-slate-600",
        white: "bg-white border-slate-600",

        orange: "bg-warning-100 border-warning-600",
        blue: "bg-blue-100 border-blue-600",
        yellow: "bg-yellow-100 border-yellow-600",
        green: "bg-green-100 border-green-600",
        red: "bg-red-100 border-red-600",
        gray: "bg-gray-100 border-gray-600",
        purple: "bg-purple-100 border-purple-600",

        pink: "bg-pink-100 border-pink-600",
        indigo: "bg-indigo-100 border-indigo-600",
        teal: "bg-teal-100 border-teal-600",
        cyan: "bg-cyan-100 border-cyan-600",
        lime: "bg-lime-100 border-lime-600",
        emerald: "bg-emerald-100 border-emerald-600",
        sky: "bg-sky-100 border-sky-600",
        violet: "bg-violet-100 border-violet-600",
        fuchsia: "bg-fuchsia-100 border-fuchsia-600",
        rose: "bg-rose-100 border-rose-600",
        amber: "bg-amber-100 border-amber-600",
        slate: "bg-slate-100 border-slate-600",
      },
    },
    defaultVariants: {
      color: "success",
    },
  },
);

const chipBulletVariants = cva("mr-1", {
  variants: {
    color: {
      success: "bg-green-100",
      warning: "bg-yellow-100",
      danger: "bg-red-100",
      info: "bg-blue-100",
      default: "bg-slate-100",
      muted: "bg-slate-500",
      black: "bg-black",
      white: "bg-white",

      orange: "bg-warning-100",
      blue: "bg-blue-100",
      yellow: "bg-yellow-100",
      green: "bg-green-100",
      red: "bg-red-100",
      gray: "bg-gray-100",
      purple: "bg-purple-100",

      pink: "bg-pink-100",
      indigo: "bg-indigo-100",
      teal: "bg-teal-100",
      cyan: "bg-cyan-100",
      lime: "bg-lime-100",
      emerald: "bg-emerald-100",
      sky: "bg-sky-100",
      violet: "bg-violet-100",
      fuchsia: "bg-fuchsia-100",
      rose: "bg-rose-100",
      amber: "bg-amber-100",
      slate: "bg-slate-100",
    },
    styling: {
      bullet: "h-3 w-3 rounded-full shrink-0",
      default: "",
    },
  },
  defaultVariants: {
    color: "success",
    styling: "default",
  },
});

const chipTextVariants = cva("text-xs", {
  variants: {
    color: {
      success: "text-green-700",
      warning: "text-yellow-700",
      danger: "text-red-700",
      info: "text-blue-700",
      default: "text-slate-700",
      muted: "text-slate-300",
      black: "text-white",
      white: "text-black",

      orange: "text-orange-700",
      blue: "text-blue-700",
      yellow: "text-yellow-700",
      green: "text-green-700",
      red: "text-red-700",
      gray: "text-gray-700",
      purple: "text-purple-700",

      pink: "text-pink-700",
      indigo: "text-indigo-700",
      teal: "text-teal-700",
      cyan: "text-cyan-700",
      lime: "text-lime-700",
      emerald: "text-emerald-700",
      sky: "text-sky-700",
      violet: "text-violet-700",
      fuchsia: "text-fuchsia-700",
      rose: "text-rose-700",
      amber: "text-amber-700",
      slate: "text-slate-700",
    },
  },
  defaultVariants: {
    color: "success",
  },
});

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof chipVariants> {
  textClassName?: string;
  icon?: React.ReactNode;
  styling?: "bullet" | "default";
}

function Badge({
  color,
  className,
  textClassName,
  icon,
  styling,
  ...props
}: BadgeProps) {
  return (
    <div
      className={
        styling === "bullet"
          ? cn(
              "flex-row items-center self-start rounded-full border border-gray-700 bg-white px-2 py-[0.15]",
              className,
            )
          : cn(
              "flex-row items-center self-start rounded-full border border-gray-700 bg-white px-2 py-[0.15]",
              className,
              chipVariants({
                color,
                className,
              }),
            )
      }
      {...props}
    >
      <span className={cn(chipBulletVariants({ color, styling }))}></span>
      <Text
        className={cn(
          textClassName,
          styling === "bullet" ? "" : chipTextVariants({ color }),
          "inline-flex gap-1 items-center text-xs font-semibold uppercase",
        )}
      >
        {props.children}
      </Text>
    </div>
  );
}

export { Badge };
