import {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";

import { useDebounce } from "@uidotdev/usehooks";
import { cva, VariantProps } from "class-variance-authority";
import _ from "lodash";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { useController, useForm } from "react-hook-form";

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
import { buildQueryString } from "@ttm/api/utils/dynamicRest";
import { axiosClient } from "@ttm/api/axios";
import { useDynamicGetList } from "@ttm/api";
import { QueryParams } from "@ttm/api/types";

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

const AsyncComboboxVariant = cva("", {
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

export interface AsyncComboboxProps extends VariantProps {
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
}

// Helper function to get nested property values
const getNestedValue = (obj, path) => {
  if (!obj || !path) return undefined;

  // Handle dot notation for nested objects (e.g., "item.item_name")
  const keys = typeof path === "string" ? path.split(".") : [path];
  let result = obj;

  for (const key of keys) {
    if (result === null || result === undefined || !(key in result)) {
      return undefined;
    }
    result = result[key];
  }

  return result;
};

export interface AsyncComboboxRef {
  params: (params: QueryParams) => void;
}

export const AsyncCombobox = forwardRef(
  (
    {
      name,
      formLabel,
      title,
      placeholder,
      defaultValue,
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
      valueField = "id", // Default to "id" but can be "object" to return entire object
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
      ...props // ... other props
    }: AsyncComboboxProps,
    ref: Ref,
  ) => {
    const {
      field,
      formState: { errors },
    } = useController({
      name,
      control,
      defaultValue: defaultValue || "",
    });
    const { control: searchControl, watch, setValue } = useForm();
    const search = useDebounce(watch(`${name}-search`, ""), 500);
    const [params, setParams] = useState<QueryParams>({});
    const [defaultData, setDefaultData] = useState<any>(null);
    const [originalItems, setOriginalItems] = useState<any[]>([]);

    const { data, isLoading, fetchNextPage, isFetchingNextPage } =
      useDynamicGetList(endpoint, [endpoint, "search", search, params], {
        per_page: showSearchLimit,
        search,
        ...params,
      });

    const fetchMoreData = () => {
      if (search) return;
      if (data?.pages?.length < 1) return;
      if (!isFetchingNextPage && !isLoading) {
        fetchNextPage();
      }
    };

    // Handle scroll event
    const handleScroll = (event) => {
      const { scrollTop, scrollHeight, clientHeight } = event.target;
      const threshold = 0.7; // Similar to onEndReachedThreshold
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

      if (
        !search &&
        !isFetchingNextPage &&
        searchItems?.length >= showSearchLimit &&
        distanceFromBottom <= threshold
      ) {
        fetchMoreData();
      }
    };

    // Store original items for entire object reference
    useEffect(() => {
      if (data) {
        const items = data?.pages
          ?.map((page) => page?.[dataKey])
          .flat()
          .concat(defaultData)
          .filter(Boolean);

        setOriginalItems(items);
      }
    }, [data, defaultData]);

    const searchItems = useMemo(() => {
      if (data === undefined) {
        return [];
      }

      const allItems = data?.pages
        ?.map((page) => page?.[dataKey])
        .flat()
        .concat(defaultData)
        .filter((item) => {
          if (!item || typeof item !== "object") return false;
          if (Array.isArray(labelField)) {
            // More permissive - check if at least one field exists
            return (
              labelField.some(
                (field) => getNestedValue(item, field) !== undefined,
              ) &&
              (valueField === "object" || item[valueField] !== undefined)
            );
          }
          return (
            getNestedValue(item, labelField) !== undefined &&
            (valueField === "object" || item[valueField] !== undefined)
          );
        })
        .filter((data, index, self) => {
          if (valueField === "object") {
            // For object mode, use a unique identifier if available
            const uniqueId = data.id || data._id || JSON.stringify(data);
            return (
              index ===
              self.findIndex(
                (t) => (t.id || t._id || JSON.stringify(t)) === uniqueId,
              )
            );
          }
          return (
            index === self.findIndex((t) => t[valueField] === data[valueField])
          );
        });

      return (
        allItems.map((item) => {
          let label = "";
          if (Array.isArray(labelField)) {
            // Filter out undefined values before joining
            label = labelField
              .map((field) => getNestedValue(item, field))
              .filter(Boolean)
              .join(" - ");
          } else {
            label = getNestedValue(item, labelField) || "";
          }

          // For object mode, create an identifier for tracking selection
          const itemValue =
            valueField === "object"
              ? item.id || item._id || JSON.stringify(item)
              : item[valueField];

          return {
            label: label,
            value: itemValue,
            originalItem: item, // Store the entire original item
          };
        }) ?? []
      );
    }, [data, labelField, valueField, defaultData]);

    useImperativeHandle(ref, () => ({
      params: (newParams: QueryParams) => {
        if (_.isEmpty(newParams)) return;
        setDefaultData(null);
        setParams((prev) => ({ ...prev, ...newParams }));
      },
    }));

    useEffect(() => {
      if (defaultValue && !multiple) {
        field.disabled = true;
        getDataForDefaultValue(endpoint, defaultValue)
          .then((value) => {
            if (value) {
              setDefaultData(value);

              // Set the appropriate value based on valueField
              if (valueField === "object") {
                field.onChange(value);
              } else {
                field.onChange(value?.[valueField]);
                field.value = value?.[valueField];
              }

              if (onPostChange)
                onPostChange(
                  valueField === "object" ? value : value?.[valueField],
                );
            }
          })
          .finally(() => {
            field.disabled = false;
          });
      }
    }, [defaultValue]);

    // Helper function to find the display text for the selected value
    const getSelectedItemLabel = () => {
      if (!field.value) return placeholder;

      if (valueField === "object") {
        // For object mode, we need to extract the display text from the object
        if (typeof field.value === "object") {
          if (Array.isArray(labelField)) {
            return labelField
              .map((field) => getNestedValue(field.value, field))
              .filter(Boolean)
              .join(" - ");
          }
          return getNestedValue(field.value, labelField) || placeholder;
        }
      }

      // For normal mode, look up the display text in searchItems
      const selectedItem = searchItems.find(
        (item) => item.value === field.value,
      );
      return selectedItem?.label || placeholder;
    };

    // Handle item selection
    const handleSelectItem = (item) => {
      if (valueField === "object") {
        // Return the entire original item
        field.onChange(item.originalItem);
        if (onPostChange) onPostChange(item.originalItem);
      } else {
        // Return just the value field as before
        field.onChange(item.value);
        if (onPostChange) onPostChange(item.value);
      }
    };

    // Clear the selection
    const handleClearSelection = () => {
      field.onChange(null);
      setValue(`${name}-search`, "");
      setParams({});
      setDefaultData(null);
      if (onPostChange) onPostChange(null);
    };

    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="relative mb-2 flex flex-1 flex-col rounded-sm">
            <Label
              className={`py-1 text-xs font-semibold ${errors[name] ? "text-red-500" : "text-gray-600"} ${className}`}
            >
              {formLabel}
              {required && "*"}
            </Label>
            <Popover modal={true}>
              <PopoverTrigger asChild>
                <FormControl>
                  <button
                    role="combobox"
                    className={cn(
                      AsyncComboboxVariant({ size, className }),
                      "justify-between",
                      !field.value && "text-muted-foreground",
                      `rounded-sm border ${errors[name] ? "border-red-500" : "border-gray-300"}`,
                      " items-center bg-white px-5 py-3",
                    )}
                    disabled={readonly}
                  >
                    {iconName && (
                      <Icon
                        name={iconName}
                        className="flex-0 mr-2"
                        color={errors[name] ? "danger" : "gray"}
                        size={"md"}
                      />
                    )}

                    <div className="flex h-6 flex-1 flex-row items-center justify-between">
                      <div
                        className={`text-default ${errors[name] ? "text-red-500" : field.value ? "text-black" : "text-gray-400"}`}
                      >
                        {field.value
                          ? valueField === "object"
                            ? Array.isArray(labelField)
                              ? labelField
                                  .map((f) => getNestedValue(field.value, f))
                                  .filter(Boolean)
                                  .join(" - ")
                              : getNestedValue(field.value, labelField)
                            : searchItems.find(
                                (item) => item.value === field.value,
                              )?.label
                          : placeholder}
                      </div>
                      {!field.value && (
                        <ChevronsUpDown
                          className={`ml-2 h-4 w-4 shrink-0 opacity-50 ${errors[name] ? "text-red-500" : "text-gray-600"}`}
                        />
                      )}
                      {field.value && !readonly && (
                        <X
                          className="ml-2 h-4 w-4 shrink-0 opacity-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClearSelection();
                          }}
                        />
                      )}
                    </div>
                  </button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                onScroll={handleScroll}
                onChange={(data: any) => {
                  let searchValue = data.target?.value || "";
                  setValue(`${name}-search`, searchValue);
                }}
                className={`max-h-80 overflow-y-auto no-scrollbar p-0`}
              >
                <Command className="" shouldFilter={false}>
                  <CommandInput
                    placeholder={searchPlaceholder}
                    className="h-9"
                  />
                  <CommandEmpty>{defaultEmptyResultValue}</CommandEmpty>
                  <CommandGroup>
                    {searchItems.map((item) => (
                      <CommandItem
                        value={`${item.value}-${item.label}-${name}`}
                        key={`${item.value}-${item.label}-${name}`}
                        title={`${item.label}`}
                        onSelect={() => handleSelectItem(item)}
                      >
                        {item.label}
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            (
                              valueField === "object"
                                ? field.value &&
                                  field.value.id === item.originalItem.id
                                : item.value === field.value
                            )
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                    {isFetchingNextPage && (
                      <div className="flex items-center justify-center p-2 text-sm text-gray-500">
                        Loading more...
                      </div>
                    )}
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

const getDataForDefaultValue = async (endpoint: string, defaultValue: any) => {
  endpoint = endpoint.split("?")[0];
  return await axiosClient
    .get(endpoint + "/" + defaultValue)
    .then((res) => res.data)
    .then((data) => {
      return data[Object.keys(data)[0]];
    });
};

const getDataForDefaultValues = async (
  endpoint: string,
  defaultValues: Array,
) => {
  return await axiosClient
    .get(endpoint, {
      params: {
        filter: {
          "id.in": defaultValues,
        },
      },
      paramsSerializer: (params) => buildQueryString(params),
    })
    .then((res) => res.data)
    .then((data) => {
      return data[Object.keys(data)[0]];
    });
};
