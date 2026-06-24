import * as React from "react";

import { cva } from "class-variance-authority";
import { useController } from "react-hook-form";

import { cn } from "@/lib/utils";

import { FormDescription, FormField, FormItem, FormMessage } from "./Form";
import { Icon } from "./Icon";
import { Label } from "./Label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";

const containerVariants = cva("relative", {
  variants: {
    autoMargin: {
      true: "mt-2 mb-4",
      false: "",
    },
  },
  defaultVariants: {
    autoMargin: true,
  },
});

const textInputVariants = cva(
  ["border", "rounded-xl", "px-4", "py-2", "bg-white", "justify-center"],
  {
    variants: {
      size: {
        default: "h-14",
        long: "h-64",
      },
      color: {
        default: "border-gray-300",
        danger: "border-red-500",
      },
      outlineColor: {
        none: "",
        blue: "outline outline-2 outline-blue-500",
        green: "outline outline-2 outline-green-500",
        red: "outline outline-2 outline-red-500",
        purple: "outline outline-2 outline-purple-500",
        yellow: "outline outline-2 outline-yellow-500",
        gray: "outline outline-2 outline-gray-500",
      },
    },
    defaultVariants: {
      color: "default",
      size: "default",
      outlineColor: "none",
    },
  },
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  control: any;
  defaultValue?: string;
  label?: string;
  iconName?: string;
  required?: boolean;
  containerClassName?: string;
  textInputClassName?: string;
  labelClassName?: string;
  autoMargin?: boolean;
  size?: number;
  color?: string;
  outlineColor?: string; // New prop for outline color
  showPassword?: boolean;
  toggleShowPassword?: any;
  maxLength?: number;
  prefix?: string;
  unit?: string;
  disabled?: boolean;
  disableScroll?: boolean;
  formDescription?: string;
  helpText?: string;
}

const TextInput = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      control,
      title,
      name,
      defaultValue,
      label,
      iconName,
      required,
      autoMargin,
      containerClassName,
      textInputClassName,
      labelClassName,
      size,
      color,
      outlineColor, // Add the new prop
      showPassword,
      toggleShowPassword,
      maxLength,
      prefix,
      unit,
      disabled,
      disableScroll = true,
      formDescription,
      helpText = "",
      ...props
    },
    ref,
  ) => {
    const {
      field,
      formState: { errors },
    } = useController({
      name: name,
      control,
      defaultValue: defaultValue || "",
    });

    const [charCount, setCharCount] = React.useState(field.value?.length || 0);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      field.onChange(e);
      setCharCount(e.target.value.length);
    };

    // Listen for external value changes (e.g., when the form is reset)
    React.useEffect(() => {
      setCharCount(field.value?.length || 0);
    }, [field.value]);

    return (
      <>
        <FormField
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem className="relative mb-2 flex flex-1 flex-col rounded-sm">
              <>
                <div className="flex items-center space-x-2">
                  {title && (
                    <Label
                      htmlFor={name}
                      className={cn(
                        "py-1 text-xs font-semibold text-gray-600",
                        errors[name] && "text-red-500",
                        labelClassName,
                      )}
                    >
                      {title}
                      {required && "*"}
                    </Label>
                  )}
                  {helpText && (
                    <Tooltip>
                      <TooltipTrigger
                        onClick={(e) => e.preventDefault()}
                        className="cursor-default"
                      >
                        <Icon
                          name="circle-help"
                          color={"black"}
                          className="shrink-0"
                          size="sm"
                        />
                      </TooltipTrigger>
                      <TooltipContent className="z-10 ml-2 rounded border border-gray-300 bg-white p-2 text-sm shadow-lg">
                        {helpText}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </>
              <div
                className={cn(
                  `rounded-sm border px-5 py-3 ${disabled ? "bg-gray-50" : "bg-white"}`,
                  errors[name] ? "border-red-500" : "border-gray-300",
                  outlineColor && `outline outline-2 outline-${outlineColor}-500`,
                )}
              >
                <div className="flex items-center justify-center">
                  {iconName && (
                    <Icon
                      name={iconName}
                      className="flex-0 mr-2"
                      color={errors[name] ? "danger" : "gray"}
                      size={"md"}
                    />
                  )}
                  {prefix && (
                    <span
                      className={`mr-2 ${errors[name] ? "text-red-500" : "text-gray-600"}`}
                    >
                      {prefix}
                    </span>
                  )}
                  <div className={`text-default flex-1 `}>
                    <input
                      type={showPassword ? "text" : type}
                      value={field.value || ""}
                      onChange={handleInputChange} // Use custom handleInputChange
                      className={cn(
                        "placeholder:text-default flex w-full border-none outline-none",
                        errors[name] && "placeholder:text-red-500",
                        disabled && "bg-gray-50",
                        props.readOnly && "text-gray-500 cursor-default"
                      )}
                      maxLength={maxLength} // Add maxLength to the input
                      ref={ref}
                      disabled={disabled}
                      onWheel={
                        disableScroll
                          ? (e) => (e.target as HTMLInputElement).blur()
                          : undefined
                      }
                      {...props}
                    />
                  </div>
                  {unit && (
                    <span
                      className={`mr-2 ${errors[name] ? "text-red-500" : "text-gray-600"}`}
                    >
                      {unit}
                    </span>
                  )}
                  {type === "password" && (
                    <div
                      className="right-0 cursor-pointer"
                      onClick={toggleShowPassword}
                    >
                      {showPassword ? (
                        <Icon
                          className="h-5 w-5 text-gray-500"
                          aria-hidden="true"
                          name={"eye-off"}
                        />
                      ) : (
                        <Icon
                          className="h-5 w-5 text-gray-500"
                          aria-hidden="true"
                          name={"eye"}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>

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
              {formDescription && (
                <FormDescription>{formDescription}</FormDescription>
              )}
              <FormMessage className="px-5 pb-5" />
            </FormItem>
          )}
        ></FormField>
      </>
    );
  },
);

TextInput.displayName = "TextInput";

export { TextInput };