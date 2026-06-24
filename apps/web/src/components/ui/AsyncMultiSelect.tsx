"use client";

import {
  forwardRef,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import { useDebounce } from "@uidotdev/usehooks";
import { cva, VariantProps } from "class-variance-authority";
import { Command as CommandPrimitive } from "cmdk";
import _ from "lodash";
import { X } from "lucide-react";
import { useController, useForm} from "react-hook-form";

import { useDynamicGetList } from "@ttm/api";
import { axiosClient } from "@ttm/api/axios";
import { QueryParams } from "@ttm/api/types";
import { buildQueryString } from "@ttm/api/utils/dynamicRest";

import { Badge } from "./Badge";

import { Command, CommandEmpty, CommandGroup, CommandItem } from "./Command";
import { FormField, FormItem, FormMessage } from "./Form";
import { Icon } from "./Icon";
import { Label } from "./Label";

const AsyncMultiSelectVariant = cva("", {
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

export interface AsyncMultiSelectProps
  extends VariantProps<typeof AsyncMultiSelectVariant> {
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
  allowReset?: boolean;
  accessKey?: string;
}

export const AsyncMultiSelect = forwardRef(
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
      showSearchLimit = 10,
      onPostChange,
      mode = "modal",
      multiple = false,
      deselectMode = "any",
      enableSelectAll = false,
      readonly = false,
      defaultEmptyResultValue = "No result found!",
      formDescription = "",
      selectPlaceholder = "Select...",
      allowReset = false,
      accessKey = "",
      ...props // ... other props
    }: AsyncMultiSelectProps,
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

    const prevValueRef = useRef(field.value);

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
    const search = useDebounce(watch(`${name}-search`, ""), 500);
    const [params, setParams] = useState<QueryParams>({});
    const [defaultData, setDefaultData] = useState<any>(null);
    const isInitialMount = useRef(true);
    const isLoadingDefaults = useRef(false);

    const {
      data: searchData,
      isLoading: isSearchLoading,
      fetchNextPage,
      isFetchingNextPage,
    } = useDynamicGetList(endpoint, [endpoint, "search", search, params], {
      per_page: showSearchLimit,
      search,
      ...params,
    });

    const fetchMoreData = () => {
      if (search) return;
      if (searchData?.pages?.length < 1) return;
      if (!isFetchingNextPage && !isSearchLoading) {
        fetchNextPage();
      }
    };

    // Handle scroll event
    const handleScroll = (event) => {
      const { scrollTop, scrollHeight, clientHeight } = event.target;
      const threshold = 0.6; // Similar to onEndReachedThreshold
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

    const searchItems = useMemo(() => {
      if (searchData === undefined) {
        return [];
      }

      return (
        searchData?.pages
          ?.map((page) => page?.[dataKey])
          .flat()
          .filter((item) => {
            if (!item || typeof item !== "object") return false;
            if (Array.isArray(labelField)) {
              return (
                labelField.every((field) => field in item) && item[valueField]
              );
            }
            return item[labelField] && item[valueField];
          })
          .filter(
            (data, index, self) =>
              index ===
              self.findIndex((t) => t[valueField] === data[valueField]),
          )
          .map((item) => {
            let label = "";
            if (Array.isArray(labelField)) {
              label = labelField.map((field) => item[field]).join(" - ");
            } else {
              label = item[labelField];
            }

            return {
              label: label,
              value: item[valueField],
            };
          }) ?? []
      );
    }, [searchData, labelField, valueField]);

    useImperativeHandle(ref, () => ({
      params: (newParams: QueryParams) => {
        if (_.isEmpty(newParams)) return;
        setDefaultData(null);
        setParams((prev) => ({ ...prev, ...newParams }));
      },
    }));

    useEffect(() => {
      if (defaultValue !== null && defaultValue.length > 0) {
        field.disabled = true;
        isLoadingDefaults.current = true;
        getDataForDefaultValues(endpoint, defaultValue)
          .then((values) => {
            if (values && values.length > 0) {
              let formattedValues = values.map((value) => ({
                value: value["id"],
                label: value[accessKey],
              }));
              setSelected(formattedValues);

              const selectedIds = formattedValues.map((item) => item.value);
              setValue(name, selectedIds, {
                shouldDirty: false,
                shouldTouch: false,
                shouldValidate: false,
              });
              // Update ref to match the new values
              prevValueRef.current = selectedIds;
            }
          })
          .finally(() => {
            field.disabled = false;

            // Clean up
            isLoadingDefaults.current = false;
            isInitialMount.current = false;
          });
      }
    }, [defaultValue]);

    useEffect(() => {
      if (allowReset) {
        setSelected([]);
      }
    }, [allowReset]);

    useEffect(() => {
      prevValueRef.current = field.value;
    }, [field.value]);

    useEffect(() => {
      // Skip effect on first render or during default loading
      if (isInitialMount.current || isLoadingDefaults.current) {
        return;
      }
      const selectedValues = selected.map((item) => item.value);

      // Only trigger onChange if values actually changed
      if (!_.isEqual(prevValueRef.current, selectedValues)) {
        if (field.onChange) {
          field.onChange(selectedValues);
        }

        if (onPostChange) {
          onPostChange(selectedValues);
        }

        // Update ref for next render
        prevValueRef.current = selectedValues;
      }
    }, [selected]);

    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="relative flex flex-col justify-center space-y-1 border-red-500 border-3">
            <Label
              className={`text-xs font-semibold ${errors[name] ? "text-red-500" : "text-gray-600"}`}
            >
              {formLabel}
              {required && "*"}
            </Label>

            <Command
              onKeyDown={handleKeyDown}
              className="overflow-visible bg-transparent"
            >
              <div className="px-5 py-3 text-sm border border-gray-300 rounded-sm focus-visible:ring-ring ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2">
                <div className="flex flex-wrap gap-1 ">
                  {iconName && (
                    <Icon
                      name={iconName}
                      className="mr-1 flex-0"
                      color={errors[name] ? "danger" : "gray"}
                      size={"md"}
                    />
                  )}
                  {selected.map((item) => {
                    return (
                      <Badge key={item.value} variant="secondary">
                        {item.label}
                        <button
                          className="ml-1 rounded-full outline-none ring-offset-background focus:ring-ring focus:ring-2 focus:ring-offset-2"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleUnselect(item);
                              field.onChange(
                                field.value.filter((v) => v !== item),
                              );
                              // if (onPostChange) onPostChange(field.value);
                            }
                          }}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onClick={() => handleUnselect(item)}
                        >
                          <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
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
                    className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              {open && isSearchLoading ? (
                <div className="relative mt-2">
                  <div className="absolute top-0 z-10 w-full border rounded-md shadow-md outline-none bg-popover text-popover-foreground animate-in">
                    <CommandEmpty>Searching...</CommandEmpty>
                  </div>
                </div>
              ) : open && searchItems.length == 0 && !isSearchLoading ? (
                <div className="relative mt-2">
                  <div className="absolute top-0 z-10 w-full border rounded-md shadow-md outline-none bg-popover text-popover-foreground animate-in">
                    <CommandEmpty>{defaultEmptyResultValue}</CommandEmpty>
                  </div>
                </div>
              ) : open && searchItems.length > 0 && !isSearchLoading ? (
                <div className="relative mt-2">
                  <div className="absolute top-0 z-10 w-full border rounded-md shadow-md outline-none bg-popover text-popover-foreground animate-in">
                    <CommandGroup
                      className="max-h-[40vh] overflow-auto"
                      onScroll={handleScroll}
                    >
                      {searchItems.map((item) => {
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
                      {isFetchingNextPage && (
                        <div className="flex items-center justify-center p-2 text-sm text-gray-500">
                          Loading more...
                        </div>
                      )}
                    </CommandGroup>
                  </div>
                </div>
              ) : null}
            </Command>
            <FormMessage className="px-5 pb-5" />
          </FormItem>
        )}
      />
    );
  },
);

const getDataForDefaultValues = async (
  endpoint: string,
  defaultValues: Array<string>,
) => {
  try {
    const response = await axiosClient.get(endpoint, {
      params: {
        filter: {
          "id.in": defaultValues,
        },
      },
      paramsSerializer: (params) => buildQueryString(params),
    });
    const data = response.data;
    return data[Object.keys(data)[0]] || [];
  } catch (error) {
    return [];
  }
};
