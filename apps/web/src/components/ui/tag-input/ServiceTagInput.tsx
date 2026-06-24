"use client";

import React, { forwardRef, useState } from "react";

import { useController } from "react-hook-form";

import { fetchTags } from "@ttm/api";
import { Tag, TagType } from "@ttm/api/types";

import ServiceMultipleSelector, {
  Option,
} from "@/components/ui/tag-input/ServiceMultipleSelector";
import { cn } from "@/lib/utils";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../Form";
import { Label } from "../Label";

const OPTIONS: Option[] = [
  { name: "nextjs", id: "Nextjs" },
  { name: "React", id: "react" },
  { name: "Remix", id: "remix" },
  { name: "Vite", id: "vite" },
  { name: "Nuxt", id: "nuxt" },
  { name: "Vue", id: "vue" },
  { name: "Svelte", id: "svelte" },
  { name: "Angular", id: "angular" },
  { name: "Ember", id: "ember" },
  { name: "Gatsby", id: "gatsby" },
  { name: "Astro", id: "astro" },
];

const mockSearch = async (value: string): Promise<Option[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!value) {
        resolve(OPTIONS);
      }
      const res = OPTIONS.filter((option) => option.id.includes(value));
      resolve(res);
    }, 1000);
  });
};

export interface DatePickerProps {
  //extends VariantProps<typeof AsyncComboboxVariant>
  ref?: any;
  name: string;
  formLabel: string;
  control: any;
  maxHeight?: number;
  title?: string;
  placeholder?: string;
  defaultValue?: any;
  selectInputClassName?: string;
  containerClassName?: string;
  iconName?: string;
  iconProvider?: any;
  required?: boolean;
  className?: string;
  data?: any;
  onPostChange?: any;
  disabled?: boolean;
  defaultEmptyResultValue?: string;
  formDescription?: string;
  callApiOnRemove?: boolean;
  creatable?: boolean;
}

export const ServiceTagInput = forwardRef(
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
      required = false,
      className,
      maxHeight = 300,
      onPostChange,
      disabled = false,
      defaultEmptyResultValue = "No result found!",
      formDescription = "",
      callApiOnRemove = false,
      creatable = false,
      ...props // ... other props
    }: DatePickerProps,
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

    const [search, setSearch] = useState("");
    const [isTriggered, setIsTriggered] = React.useState(false);

    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormControl className="relative flex flex-col space-y-1">
              <div>
                <Label
                  className={`text-xs font-semibold ${errors[name] ? "text-red-500" : "text-gray-600"} ${className}`}
                >
                  {formLabel}
                  {required && "*"}
                </Label>
                <ServiceMultipleSelector
                  onSearch={async (value) => {
                    setIsTriggered(true);
                    const res = await fetchTags({ search: value, type: TagType.SERVICE }, {});
                    const result = res.tags.map((tag: Tag) => ({
                      name: tag.name,
                      id: tag.id,
                    }));

                    setIsTriggered(false);
                    return result;
                  }}
                  value={field.value}
                  onChange={field.onChange}
                  // defaultOptions={OPTIONS}
                  triggerSearchOnFocus
                  creatable={creatable}
                  placeholder={placeholder}
                  loadingIndicator={
                    <p className="text-muted-foreground py-2 text-center text-lg leading-10">
                      loading...
                    </p>
                  }
                  emptyIndicator={
                    <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                      no results found.
                    </p>
                  }
                  callApiOnRemove={callApiOnRemove}
                  disabled={disabled}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  },
);
