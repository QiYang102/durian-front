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
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, control, id, defaultValue, label, ...props }, ref) => {
    const {
      field,
      formState: { errors },
    } = useController({
      control: control,
      name: id,
      defaultValue: defaultValue || "",
    });
    return (
      <>
        {label && <Label htmlFor={id}>{label}</Label>}
        <input
          type={type}
          value={field.value}
          onChange={field.onChange}
          className={cn(
            //focus-visible:ring-ring ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
            " placeholder:text-muted-foreground bg-background flex h-10 w-full rounded-md border px-3 py-2 text-sm  file:border-0 file:bg-transparent file:text-sm file:font-medium  disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          ref={ref}
          {...props}
        />
        {errors[id] && (
          <div className="text-sm text-red-600">
            {errors?.[id]?.message?.toString()}
          </div>
        )}
      </>
    );
  },
);
Input.displayName = "Input";

export { Input };
