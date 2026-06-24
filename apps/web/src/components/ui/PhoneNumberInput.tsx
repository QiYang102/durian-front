import React from "react";
import { forwardRef } from "react";
import { useController } from "react-hook-form";
import PhoneInput from "react-phone-number-input";

import { FormControl, FormField, FormItem, FormMessage } from "./Form";
import { Label } from "./Label";

import "react-phone-number-input/style.css";

export interface PhoneNumberInputProps {
  ref?: any;
  name: string;
  formLabel: string;
  control: any;
  defaultValue?: any;
  required?: boolean;
  readonly?: boolean;
}

export const PhoneNumberInput = forwardRef(
  (
    {
      name,
      formLabel,
      defaultValue,
      control,
      required = false,
      readonly = false,
    }: PhoneNumberInputProps,
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

    // Helper: Format the value to include "+" if missing
    const addPlusIfMissing = (value: string | undefined): string => {
      if (value && !value.startsWith("+")) {
        return `+${value}`;
      }
      return value || "";
    };

    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="relative flex flex-col flex-1 mb-2">
            <FormControl>
              <div>
                <style>
                  {`
                      .PhoneInputInput {
                        outline-width: 0px;
                        background: white;
                      }
                        .custom-label {
                         line-height: 1.5;
                      }
                    `}
                </style>
                <Label
                  className={`py-1 text-xs font-semibold ${
                    errors[name] ? "text-red-500" : "text-gray-600"
                  }`}
                >
                  {formLabel}
                  {required && "*"}
                </Label>
                <PhoneInput
                  className={`flex flex-row rounded-sm border px-5 py-3 outline-0 ${
                    errors[name] ? "border-red-500" : "border-gray-300"
                  }`}
                  international
                  title="Mobile"
                  defaultCountry="MY" // Use defaultCountry to ensure flag displays
                  countryCallingCodeEditable={false}
                  placeholder="Enter phone number"
                  value={addPlusIfMissing(field.value)} // Ensure value has "+"
                  disabled={readonly}
                  onChange={(data) => {
                    // Remove "+" for display but keep it for backend
                    if (data) {
                      const formattedValue = data.replace("+", ""); // Remove "+" before storing
                      field.onChange(formattedValue);
                    } else {
                      field.onChange("");
                    }
                  }}
                />
              </div>
            </FormControl>
            <FormMessage className="px-5 pb-5" />
          </FormItem>
        )}
      />
    );
  },
);
