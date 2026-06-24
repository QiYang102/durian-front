import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useController } from "react-hook-form";

import { useDeleteTreatmentImage } from "@ttm/api/modules/treatment";
import { Button } from "./Button";
import { Label } from "./Label";
import { Text } from "./Text";
import { toast } from "../ui/UseToast";
import { Trash2 } from "lucide-react";

interface MultiImageUploadProps {
  name: string;
  control: any;
  formLabel?: string;
  placeholder?: string;
  dragActiveText?: string;
  defaultValue?: any;
  onPostChange?: any;
  onUpload?: any;
  className?: string;
}

export const MultiImageUpload = ({
  name,
  control,
  formLabel = "Upload Images",
  placeholder = "Drag 'n' drop some files here, or click to select files",
  dragActiveText = "Drop the files here ...",
  defaultValue = [],
  onPostChange,
  onUpload,
  className,
}: MultiImageUploadProps) => {
  const [previews, setPreviews] = useState<
    { id?: string; file: File | null; previewUrl: string }[]
  >([]);
  const [files, setFiles] = useState<File[]>([]);

  const { mutate: deleteImage } = useDeleteTreatmentImage();

  const {
    field,
    formState: { errors },
  } = useController({
    name,
    control,
    defaultValue: [],
  });

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const newPreviews = acceptedFiles.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }));

      setPreviews((prev) => [...prev, ...newPreviews]);

      setFiles((prevFiles) => {
        const updatedFiles = [...prevFiles, ...acceptedFiles];
        field.onChange(updatedFiles);
        onPostChange?.(updatedFiles);
        return updatedFiles;
      });

      if (onUpload) {
        try {
          await onUpload(acceptedFiles);
        } catch (error) {
          console.error("Upload failed", error);
        }
      }
    },
    [field, onPostChange, onUpload],
  );

  const removeImage = (index: number) => {
    const imageToRemove = previews[index];

    if (imageToRemove.id) {
      deleteImage(
        { imageId: imageToRemove.id },
        {
          onSuccess: () => {
            toast({
              title: "Image Deleted",
              description: "Image deleted successfully!",
            });
          },
          onError: () => {
            toast({
              title: "Error",
              description: "Failed to delete the image.",
            });
          },
        },
      );
    }

    setPreviews((prev) => prev.filter((_, i) => i !== index));
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    field.onChange(updatedFiles);

    if (onPostChange) {
      onPostChange(updatedFiles);
    }
  };

  useEffect(() => {
    if (defaultValue && defaultValue.length > 0) {
      const initialPreviews = defaultValue.map((image) => ({
        id: image.id,
        file: null,
        previewUrl: image.url,
      }));
      setPreviews(initialPreviews);
    } else {
      setPreviews([]);
    }
  }, [defaultValue]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  return (
    <div className="flex flex-col gap-1">
      <Label
        className={`text-xs font-semibold ${
          errors[name] ? "text-red-500" : "text-gray-600"
        } ${className}`}
      >
        {formLabel}
      </Label>
      <div
        className={`flex flex-col gap-2 rounded-sm border-2 border-dashed bg-gray-100 p-3 ${
          errors[name] ? "border-red-500" : "border-gray-300"
        }`}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <div className="text-center">
            <Text>{dragActiveText}</Text>
          </div>
        ) : (
          <div className="text-center">
            <Text>{placeholder}</Text>
          </div>
        )}
      </div>

      {previews.length > 0 && (
        <div className="flex gap-4 mt-4 overflow-x-auto">
          {previews.map((preview, index) => (
            <div key={index} className="relative flex-shrink-0">
              <img
                src={preview.previewUrl}
                alt={`Preview ${index}`}
                className="object-cover w-40 h-40 rounded-md"
                onClick={() => {
                  window.open(preview.previewUrl, "_blank");
                }}
              />
              <Button
                onClick={() => removeImage(index)}
                variant="accent"
                className="absolute text-sm font-bold text-red-500 cursor-pointer opacity-70 right-1 top-2"
              >
                <Trash2 />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
