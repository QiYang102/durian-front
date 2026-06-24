import {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  useRef,
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
import { Badge } from "./Badge"; // Import Badge for showing selected items
import { buildQueryString } from "@ttm/api/utils/dynamicRest";
import { axiosClient } from "@ttm/api/axios";
import { useDynamicGetList } from "@ttm/api";
import { QueryParams } from "@ttm/api/types";
import { on } from "events";

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

export interface AsyncComboboxV1Props extends VariantProps {
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
  onDelete?: any;
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

export interface AsyncComboboxV1Ref {
  params: (params: QueryParams) => void;
}

export const AsyncComboboxV1 = forwardRef(
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
      onDelete,
      ...props // ... other props
    }: AsyncComboboxV1Props,
    ref: Ref,
  ) => {
    const {
      field,
      formState: { errors },
    } = useController({
      name,
      control,
      defaultValue: multiple ? defaultValue || [] : defaultValue || "",
    });
    const { control: searchControl, watch, setValue } = useForm();
    const search = useDebounce(watch(`${name}-search`, ""), 500);
    const [params, setParams] = useState<QueryParams>({});
    const [defaultData, setDefaultData] = useState<any>(null);
    const [originalItems, setOriginalItems] = useState<any[]>([]);
    const [open, setOpen] = useState(false);

    // Refs for tracking default value fetching to prevent duplicate API calls
    const defaultValueFetchedRef = useRef(false);
    const previousDefaultValueRef = useRef(null);

    // Memoize defaultValue to prevent unnecessary re-renders
    const memoizedDefaultValue = useMemo(() => {
      return defaultValue;
    }, [
      // For arrays, compare the values
      Array.isArray(defaultValue) ? defaultValue.join(",") : defaultValue,
    ]);

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
          .concat(
            defaultData
              ? Array.isArray(defaultData)
                ? defaultData
                : [defaultData]
              : [],
          )
          .filter(Boolean);

        setOriginalItems(items);
      }
    }, [data, defaultData, dataKey]);

    const searchItems = useMemo(() => {
      if (data === undefined) {
        return [];
      }

      const allItems = data?.pages
        ?.map((page) => page?.[dataKey])
        .flat()
        .concat(
          defaultData
            ? Array.isArray(defaultData)
              ? defaultData
              : [defaultData]
            : [],
        )
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
    }, [data, labelField, valueField, defaultData, dataKey]);

    useImperativeHandle(ref, () => ({
      params: (newParams: QueryParams) => {
        if (_.isEmpty(newParams)) return;
        setDefaultData(null);
        setParams((prev) => ({ ...prev, ...newParams }));
      },
    }));

    // Improved defaultValue handling to prevent repeating API calls
    useEffect(() => {
      // Check if defaultValue has actually changed using deep comparison
      const defaultValueChanged = !_.isEqual(
        memoizedDefaultValue,
        previousDefaultValueRef.current,
      );

      if (defaultValueChanged) {
        // Update the previous value ref
        previousDefaultValueRef.current = memoizedDefaultValue;

        // Reset the fetched flag when defaultValue changes
        defaultValueFetchedRef.current = false;
      }

      if (memoizedDefaultValue && !defaultValueFetchedRef.current) {
        defaultValueFetchedRef.current = true;
        field.disabled = true;

        if (multiple) {
          if (
            Array.isArray(memoizedDefaultValue) &&
            memoizedDefaultValue.length > 0
          ) {
            getDataForDefaultValues(endpoint, memoizedDefaultValue)
              .then((values) => {
                if (values && values.length) {
                  setDefaultData(values);

                  // Set the appropriate values based on valueField
                  if (valueField === "object") {
                    field.onChange(values);
                  } else {
                    const valueArray = values.map((value) => value[valueField]);
                    field.onChange(valueArray);
                    field.value = valueArray;
                  }

                  if (onPostChange)
                    onPostChange(valueField === "object" ? values : valueArray);
                }
              })
              .catch((error) => {
                console.error("Error fetching default values:", error);
              })
              .finally(() => {
                field.disabled = false;
              });
          }
        } else {
          getDataForDefaultValue(endpoint, memoizedDefaultValue)
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
            .catch((error) => {
              console.error("Error fetching default value:", error);
            })
            .finally(() => {
              field.disabled = false;
            });
        }
      }
    }, [
      memoizedDefaultValue,
      multiple,
      field,
      endpoint,
      valueField,
      onPostChange,
    ]);

    // Helper function to check if an item is selected
    // Replace the isItemSelected function with this fixed version
    const isItemSelected = (item) => {
      if (!field.value) return false;

      if (multiple) {
        if (Array.isArray(field.value)) {
          if (valueField === "object") {
            return field.value.some(
              (val) =>
                val.id === item.originalItem.id ||
                val._id === item.originalItem._id,
            );
          } else {
            // Convert both to strings before comparison to handle numeric vs string IDs
            return field.value.some(
              (val) => String(val) === String(item.value),
            );
          }
        }
        return false;
      } else {
        if (valueField === "object") {
          return (
            field.value &&
            (field.value.id === item.originalItem.id ||
              field.value._id === item.originalItem._id)
          );
        }
        // Convert both to strings before comparison
        return String(field.value) === String(item.value);
      }
    };

    // Handle item selection
    const handleSelectItem = (item) => {
      if (multiple) {
        let newValue;

        if (valueField === "object") {
          // Handle object mode for multiple selection
          if (Array.isArray(field.value)) {
            const isSelected = field.value.some(
              (val) =>
                val.id === item.originalItem.id ||
                val._id === item.originalItem._id,
            );

            if (isSelected) {
              // Remove the item
              newValue = field.value.filter(
                (val) =>
                  val.id !== item.originalItem.id &&
                  (val._id !== item.originalItem._id || val._id === undefined),
              );
            } else {
              // Add the item
              newValue = [...field.value, item.originalItem];
            }
          } else {
            // Initialize with the first selection
            newValue = [item.originalItem];
          }
        } else {
          // Handle value-only mode for multiple selection
          if (Array.isArray(field.value)) {
            const isSelected = field.value.includes(item.value);

            if (isSelected) {
              // Remove the value
              newValue = field.value.filter((val) => val !== item.value);
            } else {
              // Add the value
              newValue = [...field.value, item.value];
            }
          } else {
            // Initialize with the first selection
            newValue = [item.value];
          }
        }

        field.onChange(newValue);
        if (onPostChange) onPostChange(newValue);

        // For multi-select, don't close the popover after selection
        setOpen(true);
      } else {
        // Original single-select behavior
        if (valueField === "object") {
          field.onChange(item.originalItem);
          if (onPostChange) onPostChange(item.originalItem);
        } else {
          field.onChange(item.value);
          if (onPostChange) onPostChange(item.value);
        }
        setOpen(false);
      }
    };

    // Remove a specific selected item (for multi-select)
    const handleRemoveItem = (itemToRemove, event) => {
      console.log("itemToRemove", itemToRemove);
      if (event) {
        event.stopPropagation();
      }

      if (!multiple || !field.value || !Array.isArray(field.value)) return;

      let newValue;

      if (valueField === "object") {
        newValue = field.value.filter(
          (item) =>
            item.id !== itemToRemove.id &&
            (item._id !== itemToRemove._id || item._id === undefined),
        );
      } else {
        newValue = field.value.filter((value) => value !== itemToRemove);
      }

      field.onChange(newValue);
      if (onPostChange) onPostChange(newValue);
      if (onDelete) onDelete(itemToRemove);
    };

    // Clear all selections
    const handleClearSelection = (event) => {
      if (event) {
        event.stopPropagation();
      }

      field.onChange(multiple ? [] : null);
      setValue(`${name}-search`, "");
      setParams({});
      if (onPostChange) onPostChange(multiple ? [] : null);
    };

    // Get selected items for display in the multi-select field
    const getSelectedItems = () => {
      if (!field.value || !multiple) return [];

      if (!Array.isArray(field.value)) return [];

      if (valueField === "object") {
        return field.value.map((item) => {
          let label = "";
          if (Array.isArray(labelField)) {
            label = labelField
              .map((field) => getNestedValue(item, field))
              .filter(Boolean)
              .join(" - ");
          } else {
            label = getNestedValue(item, labelField) || "";
          }
          return { value: item, label };
        });
      } else {
        return field.value
          .map((value) => {
            const item = searchItems.find((item) => item.value === value);
            return item ? { value, label: item.label } : null;
          })
          .filter(Boolean);
      }
    };

    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="relative flex flex-col space-y-1">
            <Label
              className={`text-xs font-semibold ${errors[name] ? "text-red-500" : "text-gray-600"} ${className}`}
            >
              {formLabel}
              {required && "*"}
            </Label>
            <Popover modal={true} open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <button
                    role="combobox"
                    className={cn(
                      AsyncComboboxVariant({ size, className }),
                      "justify-between",
                      !field.value && "text-muted-foreground",
                      `rounded-sm border ${errors[name] ? "border-red-500" : "border-gray-300"}`,
                      "bg-white px-5 py-3",
                      multiple &&
                        field.value &&
                        Array.isArray(field.value) &&
                        field.value.length > 0
                        ? "min-h-12 items-start"
                        : "items-center",
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

                    <div className="items-strength flex flex-1 flex-col justify-between">
                      {/* Single select display */}
                      {!multiple && (
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
                      )}

                      {/* Multi-select display */}
                      {multiple && (
                        <div className="flex flex-wrap gap-1 py-1">
                          {field.value &&
                          Array.isArray(field.value) &&
                          field.value.length > 0 ? (
                            getSelectedItems().map((item, index) => (
                              <Badge
                                key={index}
                                variant={"primary"}
                                className="flex flex-row p-1"
                              >
                                <div
                                  className={
                                    "flex flex-1 flex-row items-center"
                                  }
                                >
                                  {item.label}
                                  {!readonly && (
                                    <X
                                      className="ml-1 h-4 w-4 cursor-pointer"
                                      onClick={(e) =>
                                        handleRemoveItem(item.value, e)
                                      }
                                    />
                                  )}
                                </div>
                              </Badge>
                            ))
                          ) : (
                            <div className="text-gray-400">{placeholder}</div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* <div className="flex flex-col items-center self-center ml-2">
                      {!field.value && (
                        <ChevronsUpDown
                          className={`h-4 w-4 shrink-0 opacity-50 ${errors[name] ? "text-red-500" : "text-gray-600"}`}
                        />
                      )}
                      {((multiple &&
                        field.value &&
                        Array.isArray(field.value) &&
                        field.value.length > 0) ||
                        (!multiple && field.value)) &&
                        !readonly && (
                          <X
                            className="w-4 h-4 ml-2 opacity-50 shrink-0"
                            onClick={handleClearSelection}
                          />
                        )}
                    </div> */}
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
                className={`max-h-80 overflow-y-scroll p-0`}
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
                            isItemSelected(item) ? "opacity-100" : "opacity-0",
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
  if (!defaultValue) return null;

  endpoint = endpoint.split("?")[0];

  try {
    const response = await axiosClient.get(`${endpoint}/${defaultValue}`);
    const data = response.data;
    return data[Object.keys(data)[0]];
  } catch (error) {
    console.error(`Error fetching default value for ${defaultValue}:`, error);
    return null;
  }
};

const getDataForDefaultValues = async (
  endpoint: string,
  defaultValues: Array<any>,
) => {
  if (!Array.isArray(defaultValues) || defaultValues.length === 0) {
    return [];
  }

  endpoint = endpoint.split("?")[0];

  try {
    // Create proper array-style query params for REST API
    const params = new URLSearchParams();

    // Add each ID to the filter parameter using the proper bracket notation
    defaultValues.forEach((id) => {
      params.append("filter{id.in}[]", id.toString());
    });
    // Make the API request with the URL params properly formatted
    const response = await axiosClient.get(`${endpoint}?${params.toString()}`);
    const data = response.data;

    if (!data || typeof data !== "object") {
      console.error("Unexpected response format:", data);
      return [];
    }

    // Get the first key in the response (usually the collection name like "users")
    const dataKey = Object.keys(data)[0];

    if (!dataKey || !Array.isArray(data[dataKey])) {
      console.error("Data collection not found in response:", data);
      return [];
    }

    return data[dataKey];
  } catch (error) {
    console.error("Error fetching default values:", error);
    return [];
  }
};
