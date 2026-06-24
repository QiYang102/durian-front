import * as React from "react";

import { useController } from "react-hook-form";

import { cn } from "@/lib/utils";

import { Label } from "./Label";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  control: any;
  defaultValue?: string;
  label?: string;
  rules?: any;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, control, id, defaultValue, label, rules, ...props }, ref) => {
    const {
      field,
      formState: { errors },
    } = useController({
      control: control,
      name: id,
      defaultValue: defaultValue || "",
      rules: rules,
    });
    return (
      <div className="flex flex-col gap-1.5 w-full text-left">
        {label && (
          <Label htmlFor={id} className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {label}
          </Label>
        )}
        <input
          type={type}
          value={field.value}
          onChange={field.onChange}
          className={cn(
            "placeholder:text-muted-foreground bg-background flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {errors[id] && (
          <div className="text-sm text-red-600 font-medium">
            {errors?.[id]?.message?.toString()}
          </div>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
