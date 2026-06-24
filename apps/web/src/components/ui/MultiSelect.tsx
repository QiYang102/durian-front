"use client";

import {
  forwardRef,
  Ref,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { cva, VariantProps } from "class-variance-authority";
import { Command as CommandPrimitive } from "cmdk";
import _ from "lodash";
import { X } from "lucide-react";
import { useController, useForm } from "react-hook-form";

import { QueryParams } from "@ttm/api/types";

import { Badge } from "@/components/ui/Badge";

import { Command, CommandEmpty, CommandGroup, CommandItem } from "./Command";
import { FormField, FormItem, FormMessage } from "./Form";
import { Icon } from "./Icon";
import { Label } from "./Label";

const MultiSelectVariant = cva("", {
  variants: {
    size: {
      default: "flex ",
      custom: "",
    },

    color: {
      default: "border-slate-400",
      danger: "border-red-400",
    },
  },
  defaultVariants: {
    size: "default",
    color: "default",
  },
});

export interface MultiSelectProps
  extends VariantProps<typeof MultiSelectVariant> {
  ref?: any;
  name: string;
  formLabel: string;
  control: any;
  maxHeight?: number;
  title?: string;
  placeholder?: string;
  endpoint: string;
  dataKey: string;
  searchPlaceholder?: string;
  defaultValue?: any;
  selectInputClassName?: string;
  containerClassName?: string;
  iconName?: string;
  required?: boolean;
  className?: string;
  showSearchLimit?: number;
  data?: any;
  multiple?: boolean;
  labelField?: string | string[];
  valueField?: string;
  onPostChange?: any;
  deselectMode?: "all" | "any";
  enableSelectAll?: boolean;
  mode?: "default" | "modal" | "auto";
  readonly?: boolean;
  defaultEmptyResultValue?: string;
  formDescription?: string;
  selectPlaceholder?: string;
  resetField?: boolean;
  items?: any;
}

export const MultiSelect = forwardRef(
  (
    {
      name,
      formLabel,
      title,
      placeholder,
      defaultValue = null,
      endpoint,
      dataKey,
      control,
      selectInputClassName,
      containerClassName,
      iconName,
      size,
      color,
      required = false,
      className,
      labelField = "label",
      valueField = "value",
      maxHeight = 300,
      searchPlaceholder = "Search...",
      showSearchLimit = 20,
      onPostChange,
      mode = "modal",
      multiple = false,
      deselectMode = "any",
      enableSelectAll = false,
      readonly = false,
      defaultEmptyResultValue = "No result found!",
      formDescription = "",
      selectPlaceholder = "Select...",
      resetField = false,
      items = [],
      ...props // ... other props
    }: MultiSelectProps,
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
    const inputRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<[]>([]);
    const [inputValue, setInputValue] = useState("");

    const handleUnselect = useCallback((item) => {
      setSelected((prev) => prev.filter((s) => s.value !== item.value));
    }, []);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        const input = inputRef.current;
        if (input) {
          if (e.key === "Delete" || e.key === "Backspace") {
            if (input.value === "") {
              setSelected((prev) => {
                const newSelected = [...prev];
                newSelected.pop();
                return newSelected;
              });
            }
          }
          // This is not a default behaviour of the <input /> field
          if (e.key === "Escape") {
            input.blur();
          }
        }
      },
      [],
    );

    const { control: searchControl, watch, setValue } = useForm();
    const [defaultData, setDefaultData] = useState<any>(null);

    useEffect(() => {
      if (defaultValue !== null) {
        field.disabled = true;
        if (items.length > 0) {
          setSelected(
            items.filter((item) => defaultValue.includes(item.value)),
          );
        }
        field.disabled = false;
      }
    }, [defaultValue]);

    useEffect(() => {
      if (!resetField) {
        setSelected([]);
      }
    }, [resetField]);

    useEffect(() => {
      field.onChange(selected.map((item) => item.value));
    }, [selected]);

    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="border-3 relative flex flex-col justify-center border-red-500">
            <Command
              onKeyDown={handleKeyDown}
              className="overflow-visible bg-transparent"
            >
              <Label
                className={`py-1 text-xs font-semibold ${errors[name] ? "text-red-500" : "text-gray-600"}`}
              >
                {formLabel}
                {required && "*"}
              </Label>

              <div
                className={`flex flex-row rounded-sm border px-5  py-3 outline-0 ${errors[name] ? "border-red-500" : "border-gray-300"} ${className}`}
              >
                <div className="flex flex-wrap gap-1">
                  {iconName && (
                    <Icon
                      name={iconName}
                      className="flex-0 mr-1"
                      color={errors[name] ? "primary" : "gray"}
                      size={"md"}
                    />
                  )}
                  {selected.map((item) => {
                    return (
                      <Badge key={item.value} variant="secondary">
                        {item.label}
                        <button
                          className="ring-offset-background focus:ring-ring ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleUnselect(item);
                              field.onChange(
                                field.value.filter((v) => v !== item),
                              );
                            }
                          }}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onClick={() => handleUnselect(item)}
                        >
                          <X className="text-muted-foreground hover:text-foreground h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })}
                  {/* Avoid having the "Search" Icon */}
                  <CommandPrimitive.Input
                    ref={inputRef}
                    value={inputValue}
                    onValueChange={(data: any) => {
                      let searchValue = data || "";
                      setValue(`${name}-search`, searchValue);
                      setInputValue(data);
                    }}
                    onBlur={() => setOpen(false)}
                    onFocus={() => setOpen(true)}
                    placeholder={placeholder}
                    className="placeholder:text-muted-foreground flex-1 bg-transparent outline-none"
                  />
                </div>
              </div>

              {open && (
                <div className="relative mt-2">
                  <div className="bg-popover text-popover-foreground animate-in absolute top-0 z-10 w-full rounded-md border shadow-md outline-none">
                    <CommandGroup className="h-full overflow-auto">
                      {items.map((item) => {
                        return (
                          <CommandItem
                            value={item.label}
                            key={item.value}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onSelect={(value) => {
                              setInputValue("");

                              setSelected((prevList) => {
                                if (
                                  prevList.some(
                                    (elem) => elem.value === item.value,
                                  )
                                ) {
                                  return prevList;
                                } else {
                                  return [...prevList, item];
                                }
                              });
                            }}
                            className={"cursor-pointer"}
                          >
                            {item.label}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </div>
                </div>
              )}
            </Command>
            <FormMessage className="px-5 pb-5" />
          </FormItem>
        )}
      />
    );
  },
);
