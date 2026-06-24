import { forwardRef, Ref, useState } from "react";
import { useController } from "react-hook-form";
import { Check, ChevronsUpDown } from "lucide-react";
import { cva, VariantProps } from "class-variance-authority";

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
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { cn } from "@/lib/utils";

export const containerVariants = cva("", {
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
  placeholder?: string;
  searchPlaceholder?: string;
  defaultValue?: any;
  items: { label: string; value: string; group?: string }[];
  multiple?: boolean;
  onPostChange?: any;
  readonly?: boolean;
  defaultEmptyResultValue?: string;
  formDescription?: string;
  required?: boolean;
}

export const TitleCombobox = forwardRef(
  (
    {
      name,
      formLabel,
      placeholder,
      defaultValue,
      control,
      items = [],
      maxHeight = 300,
      searchPlaceholder = "Search...",
      onPostChange,
      readonly = false,
      defaultEmptyResultValue = "No result found!",
      formDescription = "",
      required = false,
    }: ComboboxProps,
    ref: Ref<any>
  ) => {
    const {
      field,
      formState: { errors },
    } = useController({
      name,
      control,
      defaultValue: defaultValue || "",
    });

    const [isOpen, setIsOpen] = useState(false);

    const groupedItems = items.reduce((acc, item) => {
      const group = item.group || "Other";
      if (!acc[group]) acc[group] = [];
      acc[group].push(item);
      return acc;
    }, {} as Record<string, { label: string; value: string }[]>);

    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="relative flex flex-col mb-2">
            <FormLabel
              className={`py-1 text-xs font-semibold ${
                errors[name] ? "text-red-500" : "text-gray-600"
              }`}
            >
              {formLabel}
              {required && "*"}
            </FormLabel>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <button
                    role="combobox"
                    className={cn(
                      `flex justify-between rounded-sm border bg-white px-5 py-3 ${
                        errors[name] ? "border-red-500" : "border-gray-300"
                      }`,
                      !field.value && "text-muted-foreground",
                      `${readonly ? "bg-gray-50" : ""}`
                    )}
                    disabled={readonly}
                  >
                    <div
                      className={`text-default ${
                        errors[name]
                          ? "text-red-500"
                          : field.value
                          ? "text-black"
                          : "text-gray-400"
                      }`}
                    >
                      {field.value
                        ? items.find((item) => item.value === field.value)
                            ?.label
                        : placeholder}
                    </div>
                    <ChevronsUpDown className="w-4 h-4 ml-2 text-gray-600 opacity-50 shrink-0" />
                  </button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className={"p-0 max-h-64 overflow-y-auto"}
              >
                <Command>
                  <CommandInput
                    placeholder={searchPlaceholder}
                    className="h-9"
                  />
                  <CommandEmpty>{defaultEmptyResultValue}</CommandEmpty>
                  {Object.keys(groupedItems).map((group) => (
                    <CommandGroup key={group} label={group}>
                      <div className="px-4 py-2 text-sm font-semibold text-gray-500">
                        {group}
                      </div>
                      {groupedItems[group].map((item) => (
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
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ))}
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
  }
);
