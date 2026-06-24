"use client";

import { forwardRef } from "react";

import { CalendarDays, X } from "lucide-react";
import moment from "moment";
import { useController } from "react-hook-form";
import { toast } from "sonner";

import { Calendar } from "@/components/ui/CalendarV1";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";

import { FormField, FormItem, FormMessage } from "./Form";
import { Label } from "./Label";

export interface DatePickerProps {
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
  labelClassName?: string;
  disableDates?: (date: Date) => boolean;
}

export const DatePicker = forwardRef(
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
      labelClassName = "",
      ...props // ... other props
    }: DatePickerProps,
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
          <FormItem className="relative flex flex-col flex-1 mb-2">
            <Label
              className={`py-1 text-xs font-semibold ${errors[name] ? "text-red-500" : "text-gray-600"} ${labelClassName}`}
            >
              {formLabel}
              {required && "*"}
            </Label>
            <Popover modal={true}>
              <PopoverTrigger asChild>
                <button
                  disabled={readonly}
                  className={`flex flex-row items-center justify-between rounded-sm border bg-white px-5 py-3 ${errors[name] ? "border-red-500" : "border-gray-300"} ${className}`}
                >
                  <div
                    className={`flex flex-row ${errors[name] ? "text-red-500" : "text-black"}`}
                  >
                    <CalendarDays
                      className={`mr-2 ${errors[name] ? "text-red-500" : "text-gray-600"}`}
                    />
                    {field.value ? (
                      moment(field.value).local().format("DD MMM YYYY")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </div>
                  {field.value && (
                    <X
                      className="w-4 h-4 ml-2 opacity-50 shrink-0"
                      onClick={() => {
                        field.onChange("");
                      }}
                    />
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(data) => {
                    if (props.disableDates && props.disableDates(data)) {
                      toast.error(
                        "This date is disabled. Please select another date.",
                      );
                      return;
                    }

                    field.onChange(data);
                    if (onPostChange) onPostChange(data);
                  }}
                  disabled={(date) =>
                    props.disableDates ? props.disableDates(date) : false
                  }
                  captionLayout="dropdown"
                  startMonth={new Date(1954, 0)} // January 1954
                  endMonth={new Date(new Date().getFullYear() + 10, 11)}
                  autoFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage className="px-5 pb-5" />
          </FormItem>
        )}
      ></FormField>
    );
  },
);
