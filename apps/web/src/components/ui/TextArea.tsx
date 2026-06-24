import * as React from "react";
import { forwardRef } from "react";

import { cva, VariantProps } from "class-variance-authority";
import { useController } from "react-hook-form";

import { cn } from "@/lib/utils";

import { FormField, FormItem, FormMessage } from "./Form";
import { Label } from "./Label";

const textAreaVariants = cva("", {
  variants: {
    size: {
      sm: "min-h-[80px]",
      default: "min-h-[120px]",
      md: "min-h-[120px]",
      lg: "min-h-[160px]",
      xl: "min-h-[200px]",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textAreaVariants> {
  //extends VariantProps<typeof AsyncComboboxVariant>
  ref?: any;
  name: string;
  formLabel: string;
  control: any;
  maxHeight?: number;
  title?: string;
  placeholder?: string;
  defaultValue?: any;
  selectInputClassName?: string;
  containerClassName?: string;
  iconName?: string;
  iconProvider?: any;
  required?: boolean;
  className?: string;
  data?: any;
  onPostChange?: any;
  readonly?: boolean;
  defaultEmptyResultValue?: string;
  formDescription?: string;
  selectPlaceholder?: string;
  buttonWidth?: string;
  maxLength?: number;
}

export const Textarea = forwardRef(
  (
    {
      name,
      formLabel,
      title,
      placeholder,
      defaultValue,
      control,
      selectInputClassName,
      containerClassName,
      iconName,
      iconProvider,
      required = false,
      className,
      size = "default",
      maxHeight = 300,
      onPostChange,
      readonly = false,
      defaultEmptyResultValue = "No result found!",
      formDescription = "",
      selectPlaceholder = "Select...",
      maxLength,
      ...props // ... other props
    }: TextAreaProps,
    ref,
  ) => {
    const {
      field,
      formState: { errors },
    } = useController({
      name,
      control,
      defaultValue: defaultValue || "",
    });

    const [charCount, setCharCount] = React.useState(field.value?.length || 0);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      field.onChange(e);
      setCharCount(e.target.value.length);
    };

    React.useEffect(() => {
      setCharCount(field.value?.length || 0);
    }, [field.value]);

    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <>
            <FormItem className="relative flex flex-1 flex-col">
              {formLabel && (
                <Label
                  className={cn([
                    "py-1 text-xs font-semibold",
                    errors[name] ? "text-red-500" : "text-gray-600",
                    className,
                  ])}
                >
                  {formLabel}
                  {required && "*"}
                </Label>
              )}

              <textarea
                placeholder={placeholder}
                className={cn(
                  // "focus-visible:ring-ring ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                  textAreaVariants({
                    size,
                    className,
                  }),
                  "!mt-0 flex-1 rounded-sm border px-5 py-3 outline-0",
                  `${errors[name] ? "border-red-500" : "border-gray-300"}`,
                  `${props.disabled ? "bg-gray-50" : "bg-white"}`,
                  className,
                )}
                ref={ref}
                maxLength={maxLength}
                {...props}
                value={field.value}
                onChange={handleInputChange}
              />

              {maxLength && (
                <div
                  className={cn(
                    "text-right text-xs",
                    charCount === maxLength ? "text-red-500" : "text-gray-500",
                  )}
                >
                  {charCount}/{maxLength}
                </div>
              )}

              <FormMessage className="px-5 pb-5" />
            </FormItem>
          </>
        )}
      ></FormField>
    );
  },
);
