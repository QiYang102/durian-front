import { forwardRef, Ref, useState } from "react";

import { cva, VariantProps } from "class-variance-authority";
import _ from "lodash";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { useController } from "react-hook-form";

import { QueryParams } from "@ttm/api/types";

import { cn } from "@/lib/utils";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./Command";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./Form";
import { Icon } from "./Icon";
import { Label } from "./Label";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";

const containerVariants = cva("", {
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

const AsyncComboboxProps = cva("", {
  variants: {
    size: {
      default: "h-12",
    },
    backgroundColor: {
      default: "bg-white",
      primary: "bg-primary",
      secondary: "bg-secondary",
    },
    color: {
      default: "border-slate-400",
      danger: "border-red-400",
    },
  },
  defaultVariants: {
    size: "default",
    backgroundColor: "default",
    color: "default",
  },
});

export interface ComboboxProps
  extends VariantProps<typeof containerVariants>,
    VariantProps<typeof AsyncComboboxProps> {
  ref?: any;
  name: string;
  formLabel: string;
  control: any;
  maxHeight?: number;
  title?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  defaultValue?: any;
  selectInputClassName?: string;
  containerClassName?: string;
  iconName?: string;
  iconProvider?: any;
  className?: string;
  items?: any;
  multiple?: boolean;
  onPostChange?: any;
  deselectMode?: "all" | "any";
  enableSelectAll?: boolean;
  mode?: "default" | "modal" | "auto";
  readonly?: boolean;
  defaultEmptyResultValue?: string;
  formDescription?: string;
  required?: boolean;
  buttonWidth?: string;
}

export const Combobox = forwardRef(
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
      size,
      color,
      autoMargin,
      className,
      items = [],
      maxHeight = 300,
      searchPlaceholder = "Search...",
      onPostChange,
      mode = "modal",
      multiple = false,
      deselectMode = "any",
      enableSelectAll = false,
      readonly = false,
      defaultEmptyResultValue = "No result found!",
      formDescription = "",
      required = false,
      buttonWidth = "w-[200px]",
      ...props // ... other props
    }: ComboboxProps,
    ref: Ref<{ params: (params: QueryParams) => void }>,
  ) => {
    const {
      field,
      formState: { errors },
    } = useController({
      name,
      control,
      defaultValue: defaultValue || "",
    });

    // const onChangeMultiDropdown = (data: string[]) => {
    //   field.onChange(data);
    //   if (onPostChange) onPostChange(data);
    // };

    // const selectAll = () => {
    //   const allValues = items?.map((item: { value: string }) => item.value);
    //   field.onChange(allValues);
    //   if (onPostChange) onPostChange(allValues);
    // };

    // const deselectAll = () => {
    //   field.onChange([]);
    //   if (onPostChange) onPostChange([]);
    // };

    // const isDeselect = () => {
    //   if (deselectMode === "all") {
    //     return field.value.length === items?.length;
    //   } else {
    //     return field.value.length > 0;
    //   }
    // };

    //   const renderMultiDropdownPlaceholder = () => {
    //     if (isArray(field.value) && field.value.length > 0) {
    //       const selectedLabels = items
    //         ?.filter((item) => field.value.includes(item.value))
    //         .map((item) => item.label);

    //       setIPlaceholder(selectedLabels.join(", "));
    //     } else {
    //       setIPlaceholder(placeholder);
    //     }
    //   };

    // useEffect(() => {
    //   if (multiple) {
    //     //   renderMultiDropdownPlaceholder();
    //   }
    // }, [field.value, items]);

    const [isOpen, setIsOpen] = useState(false);

    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="relative flex flex-col mb-2">
            <Label
              className={`py-1 text-xs font-semibold ${errors[name] ? "text-red-500" : "text-gray-600"}`}
            >
              {formLabel}
              {required && "*"}
            </Label>
            <Popover open={isOpen} onOpenChange={setIsOpen} modal={true}>
              <PopoverTrigger asChild>
                <FormControl>
                  <button
                    role="combobox"
                    className={cn(
                      `flex justify-between rounded-sm border bg-white px-5 py-3 ${errors[name] ? "border-red-500" : "border-gray-300"}`,
                      !field.value && "text-muted-foreground",
                      `${readonly ? "bg-gray-50" : ""}`,
                    )}
                    disabled={readonly}
                  >
                    {iconName && (
                      <Icon
                        name={iconName}
                        className="mr-2 flex-0"
                        color={errors[name] ? "danger" : "gray"}
                        size={"md"}
                      />
                    )}
                    <div className="flex flex-row items-center justify-between flex-1 h-6">
                      <div
                        className={`text-default ${errors[name] ? "text-red-500" : field.value ? "text-black" : "text-gray-400"}`}
                      >
                        {field.value
                          ? items.find((item) => item.value === field.value)
                              ?.label
                          : placeholder}
                      </div>
                      {!field.value && (
                        <ChevronsUpDown
                          className={`ml-2 h-4 w-4 shrink-0 opacity-50 ${errors[name] ? "text-red-500" : "text-gray-600"}`}
                        />
                      )}
                      {field.value && (
                        <X
                          className="w-4 h-4 ml-2 opacity-50 shrink-0"
                          onClick={() => {
                            field.onChange("");
                          }}
                        />
                      )}
                      {/* <Label>{field.value}</Label> */}
                    </div>
                  </button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent align="start" className={`max-h-64 overflow-y-auto p-0`}>
                <Command>
                  <CommandInput
                    placeholder={searchPlaceholder}
                    className="h-9"
                  />
                  <CommandEmpty>{defaultEmptyResultValue}</CommandEmpty>
                  <CommandGroup>
                    {items.map((item) => (
                      <CommandItem
                        value={item.label}
                        key={item.value}
                        title={item.label}
                        onSelect={() => {
                          field.onChange(item.value);
                          setIsOpen(false);
                          if (onPostChange) onPostChange(item.value);
                        }}
                      >
                        {item.label}
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            item.value === field.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            {formDescription && (
              <FormDescription>{formDescription}</FormDescription>
            )}
            <FormMessage className="px-5 pb-5" />
          </FormItem>
        )}
      />
    );
  },
);
