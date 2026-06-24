import { forwardRef, Ref, useState, useEffect } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { useController } from "react-hook-form";
import _ from "lodash";

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

export interface ComboboxProps {
  name: string;
  formLabel: string;
  control: any;
  items?: any[];
  placeholder?: string;
  searchPlaceholder?: string;
  defaultValue?: string[];
  iconName?: string;
  readonly?: boolean;
  required?: boolean;
  formDescription?: string;
  onPostChange?: (values: string[]) => void;
}

export const MultiCombobox = forwardRef(
  (
    {
      name,
      formLabel,
      control,
      items = [],
      placeholder = "Select items...",
      searchPlaceholder = "Search...",
      defaultValue = [],
      iconName,
      readonly = false,
      required = false,
      formDescription = "",
      onPostChange,
    }: ComboboxProps,
    ref: Ref<any>,
  ) => {
    const {
      field,
      formState: { errors },
    } = useController({
      name,
      control,
      defaultValue,
    });

    const [isOpen, setIsOpen] = useState(false);
    const [selectedLabels, setSelectedLabels] = useState<string>("");

    // Update selectedLabels when field.value changes
    useEffect(() => {
      if (field.value?.length > 0) {
        const labels = items
          ?.filter((item) => field.value.split(",").map(v => v.trim()).includes(item.value))
          .map((item) => item.label);
        setSelectedLabels(labels.join(", "));
      } else {
        setSelectedLabels("");
      }
    }, [field.value, items]);

    // Handle item selection and deselection
    const handleSelect = (value: string) => {
      const currentValues = field.value
        ? field.value.split(",").map((v) => v.trim()).filter(Boolean)
        : [];
      let newValues;

      if (currentValues.includes(value)) {
        newValues = currentValues.filter((v) => v !== value);
      } else {
        newValues = [...currentValues, value];
      }

      const stringValue = newValues.join(", ");
      field.onChange(stringValue); // Update field value
      if (onPostChange) onPostChange(newValues); // Trigger onPostChange with array of values
    };

    // Clear the selection
    const clearSelection = () => {
      field.onChange("");
      if (onPostChange) onPostChange([]);
    };

    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="relative mb-2 flex flex-col">
            <Label
              className={`py-1 text-xs font-semibold ${errors[name] ? "text-red-500" : "text-gray-600"}`}
            >
              {formLabel}
              {required && "*"}
            </Label>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <button
                    role="combobox"
                    className={`flex justify-between rounded-sm border bg-white px-5 py-3 ${
                      errors[name] ? "border-red-500" : "border-gray-300"
                    } ${readonly ? "bg-gray-50" : ""}`}
                    disabled={readonly}
                  >
                    {iconName && (
                      <Icon
                        name={iconName}
                        className="flex-0 mr-2"
                        color={errors[name] ? "danger" : "gray"}
                        size="md"
                      />
                    )}
                    <div className="flex h-6 flex-1 flex-row items-center justify-between">
                      <div
                        className={`text-default ${
                          errors[name]
                            ? "text-red-500"
                            : selectedLabels
                              ? "text-black"
                              : "text-gray-400"
                        }`}
                      >
                        {selectedLabels || placeholder}
                      </div>
                      {!selectedLabels && (
                        <ChevronsUpDown
                          className={`ml-2 h-4 w-4 shrink-0 opacity-50 ${
                            errors[name] ? "text-red-500" : "text-gray-600"
                          }`}
                        />
                      )}
                      {selectedLabels && (
                        <X
                          className="ml-2 h-4 w-4 shrink-0 cursor-pointer opacity-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            clearSelection();
                          }}
                        />
                      )}
                    </div>
                  </button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="max-h-64 overflow-y-auto p-0"
              >
                <Command>
                  <CommandInput
                    placeholder={searchPlaceholder}
                    className="h-9"
                  />
                  <CommandEmpty>No results found</CommandEmpty>
                  <CommandGroup>
                    {items.map((item) => (
                      <CommandItem
                        value={item.label}
                        key={item.value}
                        title={item.label}
                        onSelect={() => handleSelect(item.value)}
                      >
                        {item.label}
                        <Check
                          className={`ml-auto h-4 w-4 ${
                            field.value
                              ?.split(",")
                              .map((v) => v.trim())
                              .includes(item.value)
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
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

export default MultiCombobox;
