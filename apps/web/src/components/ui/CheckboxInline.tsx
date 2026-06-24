"use client";

import { forwardRef } from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { useController } from "react-hook-form";

import { cn } from "@/lib/utils";

import { Checkbox } from "./Checkbox";
import { FormControl, FormField, FormItem, FormMessage } from "./Form";
import { Icon } from "./Icon";
import { Text } from "./Text";

const checkBoxInlineVariants = cva("bg-white border text-sm font-medium", {
  variants: {
    variant: {
      primary: "data-[state=checked]:bg-primary",
      tertiary: "data-[state=checked]:bg-[#FFB200]",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

export interface CheckBoxInlineProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof checkBoxInlineVariants> {
  name: string;
  formLabel: string;
  control: any;
  selectInputClassName?: string;
  containerClassName?: string;
  iconName?: string;
  iconProvider?: any;
  required?: boolean;
  maxHeight?: number;
  onPostChange?: any;
  readonly?: boolean;
  defaultEmptyResultValue?: string;
  formDescription?: string;
  selectPlaceholder?: string;
}

export const CheckBoxInline = forwardRef(
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
      variant,
      iconName,
      iconProvider,
      required = false,
      className,
      maxHeight = 300,
      onPostChange,
      readonly = false,
      defaultEmptyResultValue = "No result found!",
      formDescription = "",
      selectPlaceholder = "Select...",
      ...props // ... other props
    }: CheckBoxInlineProps,
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

    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div
                className={`flex flex-row items-center gap-2 ${containerClassName}`}
              >
                <Checkbox
                  className={cn(
                    checkBoxInlineVariants({
                      variant,
                      className,
                    }),
                    "data-[state=checked]:bg-secondary",
                  )}
                  onCheckedChange={(value) => {
                    field.onChange(value);
                    onPostChange && onPostChange(value);
                  }}
                  checked={field.value}
                  disabled={readonly}
                  {...props}
                ></Checkbox>

                <div className="flex flex-row">
                  {iconName && (
                    <Icon
                      name={iconName}
                      className="flex-0 mr-2"
                      color={errors[name] ? "danger" : "gray"}
                      size={"md"}
                    />
                  )}
                  <Text
                    className={`text-sm font-medium ${errors[name] ? "text-red-500" : "text-gray-600"}`}
                  >
                    {formLabel}
                  </Text>
                </div>
              </div>
            </FormControl>

            <FormMessage className="px-5 pb-5" />
          </FormItem>
        )}
      ></FormField>
    );
  },
);
