import React, { forwardRef, useCallback, useEffect, useState } from "react";

import { set } from "date-fns";
import { useDropzone } from "react-dropzone";
import { useController } from "react-hook-form";

import { Button } from "./Button";
import { FormField, FormItem, FormMessage } from "./Form";
import { Icon } from "./Icon";
import { Label } from "./Label";
import { Text } from "./Text";

export interface UploadImageProps {
  ref?: any;
  name: string;
  formLabel: string;
  control: any;
  title?: string;
  placeholder?: string;
  dragActiveText?: string;
  defaultValue?: any;
  required?: boolean;
  className?: string;
  onPostChange?: any;
  readonly?: boolean;
}

export const ImageUpload = forwardRef(
  (
    {
      name,
      control,
      formLabel,
      title,
      defaultValue,
      placeholder = "Drag 'n' drop some files here, or click to select files",
      dragActiveText = "Drop the files here ...",
      readonly = false,
      required = false,
      onPostChange,
      className,
      ...props
    }: UploadImageProps,
    ref,
  ) => {
    const [preview, setPreview] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: any) => {
      const file = acceptedFiles[0];

      // Create a FileReader to read the file and generate a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string); // Set the preview state
      };
      reader.readAsDataURL(file); // Read the file as a data URL
      field.onChange(acceptedFiles);
    }, []);

    const {
      field,
      formState: { errors },
    } = useController({
      name,
      control,
      defaultValue: defaultValue || "",
    });

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
    });

    useEffect(() => {
      setPreview(defaultValue);
    }, [defaultValue]);

    const removeImage = () => {
      setPreview(null);
      field.onChange(null);
    };

    return (
      <>
        <div className="flex flex-col flex-1 gap-1">
          <Label
            className={`text-xs font-semibold ${errors[name] ? "text-red-500" : "text-gray-600"} ${className}`}
          >
            {formLabel}
            {required && "*"}
          </Label>
          <FormField
            control={control}
            name={name}
            render={({ field }) => (
              <FormItem
                className={`flex flex-1 flex-col ${readonly ? "bg-gray-50" : ""}`}
              >
                {!preview && (
                  <div
                    className={`flex flex-1 flex-col rounded-sm border-2 border-dashed bg-gray-100 p-3 ${errors[name] ? "border-red-500" : "border-gray-300"}`}
                    {...getRootProps()}
                  >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                      <div className="flex flex-col items-center justify-center flex-1">
                        <Icon name="plus" size={"3xl"} color="gray" />
                        <Text>{dragActiveText}</Text>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center flex-1">
                        <Icon name="plus" size={"3xl"} color="gray" />
                        <Text>{placeholder}</Text>
                      </div>
                    )}
                  </div>
                )}
                {/* Image Preview */}
                {preview && (
                  <div
                    className={`relative flex flex-1 flex-col items-center justify-center rounded-sm border border-gray-300 ${!readonly ? "group" : ""}`}
                  >
                    {/* <span className="text-grey-700 group-hover:text-red-700">
                        Call
                      </span> */}

                    <img
                      src={preview}
                      alt="Preview"
                      className="max-w-96 max-h-96 group-hover:border-red-700 group-hover:opacity-50"
                    />
                    <Button
                      variant="destructive"
                      // className="invisible group-hover:visible"
                      className="absolute invisible group-hover:visible"
                      onClick={() => {
                        removeImage();
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                )}
                <FormMessage className="px-5 pb-5" />
              </FormItem>
            )}
          ></FormField>
        </div>
      </>
    );
  },
);
