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
import { useController, useForm } from "react-hook-form";

import { useDynamicGetList, useUpdateTreatmentAssistant } from "@ttm/api";
import { axiosClient } from "@ttm/api/axios";
import { QueryParams } from "@ttm/api/types";
import { buildQueryString } from "@ttm/api/utils/dynamicRest";

import { Badge } from "@/components/ui/Badge";

import { Command, CommandEmpty, CommandGroup, CommandItem } from "./Command";
import { FormField, FormItem, FormMessage } from "./Form";
import { Icon } from "./Icon";
import { Label } from "./Label";

const AsyncMultiSelectTreatmentVariant = cva("", {
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

export interface AsyncMultiSelectTreatmentProps
  extends VariantProps<typeof AsyncMultiSelectTreatmentVariant> {
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
}

export const AsyncMultiSelectTreatment = forwardRef(
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
      ...props // ... other props
    }: AsyncMultiSelectTreatmentProps,
    ref: Ref<{ params: (params: QueryParams) => void }>,
  ) => {
    const {
      field,
      formState: { errors },
    } = useController({
      name,
      control,
      defaultValue: Array.isArray(defaultValue)
        ? defaultValue.map((item) => item[valueField])
        : [],
    });
    const inputRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<[]>([]);
    const [inputValue, setInputValue] = useState("");

    const { mutateAsync: updateTreatmentAssistant } =
      useUpdateTreatmentAssistant();

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
    const [iPlaceholder, setIPlaceholder] = useState(placeholder);
    const search = useDebounce(watch(`${name}-search`, ""), 500);
    const [params, setParams] = useState<QueryParams>({});
    const [defaultData, setDefaultData] = useState<any>(null);

    const { data, refetch, isLoading, fetchNextPage, isFetchingNextPage } =
      useDynamicGetList(endpoint, [endpoint, params], {
        per_page: showSearchLimit,
        ...params,
      });

    const { data: searchData, isLoading: isSearchLoading } = useDynamicGetList(
      endpoint,
      [endpoint, "search", search, params],
      {
        per_page: showSearchLimit,
        search,
        ...params,
      },
    );

    const fetchMoreData = () => {
      if (!isFetchingNextPage) {
        fetchNextPage();
      }
    };

    const items = useMemo(
      () =>
        data?.pages
          ?.map((page) => page?.[dataKey])
          .flat()
          .concat(defaultData)
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
            (item, index, self) =>
              index ===
              self.findIndex((t) => t[valueField] === item[valueField]),
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
          }) ?? [],
      [data, labelField, valueField, defaultData],
    );

    const searchItems = useMemo(() => {
      if (searchData === undefined) {
        return [];
      }

      return searchData?.pages
        ?.map((page) => page?.[dataKey])
        .flat()
        .filter((item) => {
          // Filter out items that are already selected
          const isSelected = selected.some((s) => s.value === item[valueField]);
          if (isSelected) return false;

          // Original filters
          if (!item || typeof item !== "object") return false;
          if (Array.isArray(labelField)) {
            return (
              labelField.every((field) => field in item) && item[valueField]
            );
          }
          return item[labelField] && item[valueField];
        })
        .map((item) => ({
          label: item[labelField],
          value: item[valueField],
        }));
    }, [searchData, labelField, valueField, selected]);

    useImperativeHandle(ref, () => ({
      params: (newParams: QueryParams) => {
        if (_.isEmpty(newParams)) return;
        setDefaultData(null);
        setParams((prev) => ({ ...prev, ...newParams }));
      },
    }));

    useEffect(() => {
      if (defaultValue?.length > 0) {
        const formattedValues = defaultValue.map((item) => ({
          value: item[valueField],
          label: item[labelField],
          ...item,
        }));
        setSelected(formattedValues);
      } else {
        setSelected([]);
      }
    }, [defaultValue, labelField, valueField]);

    useEffect(() => {
      if (!resetField) {
        setSelected([]);
      }
    }, [resetField]);

    useEffect(() => {
      if (field?.onChange) {
        field.onChange(selected.map((item) => item.value));
      }
    }, [field, selected]);

    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="border-3 relative flex flex-col justify-center space-y-1 border-red-500">
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
              <div className="focus-visible:ring-ring ring-offset-background rounded-sm border border-gray-300 px-5 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2">
                <div className="flex flex-wrap gap-1 ">
                  {iconName && (
                    <Icon
                      name={iconName}
                      className="flex-0 mr-1"
                      color={errors[name] ? "danger" : "gray"}
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
                          onClick={() => {
                            handleUnselect(item);
                           
                            if (!item.treatment_assistant_id) return;
                            updateTreatmentAssistant({
                              id: item.treatment_assistant_id,
                              is_active: false,
                              treatment:item.treatment,
                              assist_by: item.assist_by
                            }).then((updatedData) => {});
                          }}
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

              {open && isSearchLoading ? (
                <div className="relative mt-2">
                  <div className="bg-popover text-popover-foreground animate-in absolute top-0 z-10 w-full rounded-md border shadow-md outline-none">
                    <CommandEmpty>Searching...</CommandEmpty>
                  </div>
                </div>
              ) : open && searchItems.length == 0 && !isSearchLoading ? (
                <div className="relative mt-2">
                  <div className="bg-popover text-popover-foreground animate-in absolute top-0 z-10 w-full rounded-md border shadow-md outline-none">
                    <CommandEmpty>{defaultEmptyResultValue}</CommandEmpty>
                  </div>
                </div>
              ) : open && searchItems.length > 0 && !isSearchLoading ? (
                <div className="relative mt-2">
                  <div className="bg-popover text-popover-foreground animate-in absolute top-0 z-10 w-full rounded-md border shadow-md outline-none">
                    <CommandGroup className="h-full overflow-auto">
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
