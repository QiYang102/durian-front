import * as React from "react";
import { useController } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react"; // Or import { Icon } from "./Icon" if you use that
import { FormDescription, FormField, FormItem, FormMessage } from "./Form";
import { Label } from "./Label";

const COLOR_OPTIONS: Record<string, string> = {
  white: "bg-white border border-gray-200",
  muted: "bg-slate-300",
  warning: "bg-yellow-700",
  amber: "bg-amber-700",
  lime: "bg-lime-700",
  orange: "bg-orange-700",
  rose: "bg-rose-700",
  danger: "bg-red-700",
  pink: "bg-pink-700",
  fuchsia: "bg-fuchsia-700",
  purple: "bg-purple-700",
  violet: "bg-violet-700",
  indigo: "bg-indigo-700",
  info: "bg-blue-700",
  sky: "bg-sky-700",
  cyan: "bg-cyan-700",
  teal: "bg-teal-700",
  emerald: "bg-emerald-700",
  success: "bg-green-700",
  default: "bg-slate-700",
  gray: "bg-gray-700",
  black: "bg-black",
};

export interface PresetColorInputProps {
  name: string;
  control: any;
  title?: string;
  defaultValue?: string;
  required?: boolean;
  containerClassName?: string;
  formDescription?: string;
}

const PresetColorInput = React.forwardRef<
  HTMLDivElement,
  PresetColorInputProps
>(
  (
    {
      name,
      control,
      title,
      defaultValue,
      required,
      containerClassName,
      formDescription,
    },
    ref,
  ) => {
    const {
      field,
      formState: { errors },
    } = useController({
      name,
      control,
      defaultValue: defaultValue || "default",
    });

    return (
      <FormField
        control={control}
        name={name}
        render={() => (
          <FormItem
            className={cn("relative mb-4 flex flex-col", containerClassName)}
          >
            {/* Label */}
            {title && (
              <Label
                className={cn(
                  "py-1 text-xs font-semibold text-gray-600",
                  errors[name] && "text-red-500",
                )}
              >
                {title}
                {required && "*"}
              </Label>
            )}

            {/* Container (Matches TextInput style: border, rounded, bg-white) */}
            <div
              ref={ref}
              className={cn(
                "flex flex-wrap gap-2 rounded-xl border bg-white p-3 min-h-[56px] items-center",
                errors[name] ? "border-red-500" : "border-gray-300",
              )}
            >
              {Object.entries(COLOR_OPTIONS).map(([keyName, bgClass]) => {
                const isSelected = field.value === keyName;

                return (
                  <button
                    key={keyName}
                    type="button" // Important: prevents form submission
                    onClick={() => field.onChange(keyName)}
                    title={keyName} // Show name on hover
                    className={cn(
                      "group relative flex h-8 w-8 items-center justify-center rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400",
                      bgClass,
                      isSelected
                        ? "scale-110 ring-2 ring-offset-1 ring-slate-900"
                        : "hover:scale-105 opacity-80 hover:opacity-100",
                    )}
                  >
                    {isSelected && (
                      <Check
                        className={cn(
                          "h-4 w-4",
                          // Make checkmark black if background is white/muted, otherwise white
                          ["white", "muted"].includes(keyName)
                            ? "text-black"
                            : "text-white",
                        )}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {formDescription && (
              <FormDescription>{formDescription}</FormDescription>
            )}
            <FormMessage className="pt-1 text-xs" />
          </FormItem>
        )}
      />
    );
  },
);

PresetColorInput.displayName = "PresetColorInput";

export { PresetColorInput };
