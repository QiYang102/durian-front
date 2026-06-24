"use client";

import { forwardRef, useEffect, useState } from "react";

import { X } from "lucide-react";
import moment from "moment";
import { DateRange } from "react-day-picker";
import { useController, useWatch } from "react-hook-form";

import { Calendar } from "@/components/ui/CalendarV1";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { cn } from "@/lib/utils";

import { FormField, FormItem, FormMessage } from "./Form";
import { Icon } from "./Icon";
import { Label } from "./Label";

export interface DatePickerWithRangeProps {
  ref?: any;
  start: string;
  end: string;
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

export const DatePickerWithRange = forwardRef(
  (
    {
      start: startName,
      end: endName,
      formLabel,
      title,
      placeholder = "Pick a date",
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
      formDescription = "",
      ...props // ... other props
    }: DatePickerWithRangeProps,
    ref,
  ) => {
    const {
      field,
      formState: { errors },
    } = useController({
      name: startName,
      control,
      defaultValue: defaultValue || "",
    });

    const {
      field: endField,
      formState: { errors: endErrors },
    } = useController({
      name: endName,
      control,
      defaultValue: defaultValue || "",
    });

    const [date, setDate] = useState<DateRange | undefined>({
      from: undefined,
      to: undefined,
    });

    function adjustDate(data: any) {
      setDate((date) => {
        return data;
      });
    }

    const startValue = useWatch({ control, name: startName });
    const endValue = useWatch({ control, name: endName });

    // Reset date picker when the form values are reset
    useEffect(() => {
      if (!startValue && !endValue) {
        setDate({ from: undefined, to: undefined });
      }
      if (startValue && endValue) {
        setDate({ from: startValue, to: endValue });
      }
    }, [startValue, endValue]);

    return (
      <>
        <div>
          <FormField
            control={control}
            name={startName}
            render={({ field }) => (
              <FormItem className="relative mb-2 flex flex-1 flex-col">
                <Label
                  className={`py-1 text-xs font-semibold ${errors[startName] ? "text-red-500" : "text-gray-600"} ${className}`}
                >
                  {formLabel}
                  {required && "*"}
                </Label>
                <div className={cn("grid gap-2", className)}>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        disabled={readonly}
                        id="date"
                        className={`flex flex-row items-center justify-between rounded-sm border bg-white px-5 py-3 ${errors[startName] ? "border-red-500" : "border-gray-300"} ${className}`}
                      >
                        <div
                          className={`flex flex-row ${errors[startName] ? "text-red-500" : "text-gray-600"}`}
                        >
                          {/* <Icon className="w-4 h-4 mr-2" name="calendar" /> */}

                          {date?.from ? (
                            date.to ? (
                              <>
                                {moment(date.from)
                                  .local()
                                  .format("DD MMM YYYY")}{" "}
                                -{" "}
                                {moment(date.to).local().format("DD MMM YYYY")}
                              </>
                            ) : (
                              moment(date.from).local().format("DD MMM YYYY")
                            )
                          ) : (
                            <span className="text-gray-400">{placeholder}</span>
                          )}
                        </div>
                        {field.value && (
                          <X
                            className="ml-2 h-4 w-4 shrink-0 opacity-50"
                            onClick={() => {
                              field.onChange(null);
                              endField.onChange(null);
                              setDate({
                                from: undefined,
                                to: undefined,
                              });
                            }}
                          />
                        )}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={(data) => {
                          adjustDate(data);
                          if (data?.from) {
                            field.onChange(data?.from);
                          }
                          if (data?.to) {
                            endField.onChange(data?.to);
                          }
                        }}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <FormMessage className="mt-1 px-5 pb-5" />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={control}
            name={endName}
            render={({ field }) => (
              <FormItem className="relative mb-2 flex flex-1 flex-col">
                <FormMessage className="mt-1 px-5 pb-5" />
              </FormItem>
            )}
          ></FormField>
        </div>
      </>
    );
  },
);
