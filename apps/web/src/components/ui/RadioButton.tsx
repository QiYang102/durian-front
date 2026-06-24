import React, { forwardRef } from "react";

import { useController } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./Form";
import { RadioGroup, RadioGroupItem } from "./RadioGroup";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const radioButtonVariants = cva("bg-white border", {
  variants: {
    variant: {
      primary:
        "text-primary border-gray-300 data-[state=checked]:border-primary",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

export interface RadioButtonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof radioButtonVariants> {
  name: string;
  formLabel: string;
  control: any;
  required?: boolean;
  readonly?: boolean;
  defaultValue?: string;
  radioGroupClassName?: string;
  formLabelClassName?: string;
  options: { value: string; label: string }[];
}

export const RadioButton = forwardRef(
  (
    {
      name,
      formLabel,
      title,
      placeholder,
      defaultValue,
      control,
      required = false,
      className,
      radioGroupClassName,
      formLabelClassName,
      readonly = false,
      options,
      ...props // ... other props
    }: RadioButtonProps,
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
          <FormItem className="flex flex-col gap-1">
            <FormLabel className={`${formLabelClassName}`}>
              {formLabel}
              {required && "*"}
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={defaultValue}
                value={field.value}
                className={`flex flex-row gap-3  ${radioGroupClassName}`}
              >
                {options.map((option) => (
                  <FormItem
                    key={option.value}
                    className="flex flex-row items-center gap-2"
                  >
                    <FormControl>
                      <RadioGroupItem
                        className={cn(
                          radioButtonVariants({
                            className,
                          }),
                          errors[name] ? "border-red-500" : "border-gray-300",
                        )}
                        value={option.value}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {option.label}
                    </FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      ></FormField>
    );
  },
);
