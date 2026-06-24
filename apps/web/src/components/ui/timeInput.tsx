"use client";

import { forwardRef } from "react";

import moment from "moment";
import { useController } from "react-hook-form";

import { FormField, FormItem, FormMessage } from "./Form";
import { TimeField } from "./TimeField";

// const AsyncComboboxVariant = cva("", {
//     variants: {
//       size: {
//         default: "flex flex-1 ",
//         custom: "",
//       },

//       color: {
//         default: "border-slate-400",
//         danger: "border-red-400",
//       },
//     },
//     defaultVariants: {
//       size: "default",
//       color: "default",
//     },
//   });

export interface TimePickerProps {
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
}

export const TimeInput = forwardRef(
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
      maxHeight = 300,
      onPostChange,
      readonly = false,
      defaultEmptyResultValue = "No result found!",
      formDescription = "",
      selectPlaceholder = "Select...",
      ...props // ... other props
    }: TimePickerProps,
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
          <FormItem className="relative mb-2 flex-1">
            <TimeField
              label={formLabel}
              isRequired={required}
              hasError={errors[name] !== undefined}
              defaultValue={defaultValue}
              value={field.value}
              hour={moment(defaultValue).hour()}
              minute={moment(defaultValue).minute()}
              onChange={(data) => {
                // let hour = String(data.hour).padStart(2, "0");
                // let minute = String(data.minute).padStart(2, "0");
                // let time = `${hour}:${minute}:00`;
                field.onChange(data);
                if (onPostChange) {
                  onPostChange(data);
                }
              }}
            />

            <FormMessage className="px-5 pb-5" />
          </FormItem>
        )}
      ></FormField>
    );
  },
);
