import React, { useState, useRef, useEffect } from "react";
import { useController, Control } from "react-hook-form";
import {
  Camera,
  ImagePlusIcon,
  MoreHorizontalIcon,
  Pencil,
  Trash2,
} from "lucide-react";
import { getHttpsImageUrl } from "@ttm/utils/src/transformHttp";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Button } from "../ui/Button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import { Command, CommandGroup, CommandItem, CommandList } from "../ui/Command";

interface UserAvatarUploadProps {
  control: Control<any>;
  name: string;
  formLabel?: string;
  readOnly?: boolean;
}

const UserAvatarUpload: React.FC<UserAvatarUploadProps> = ({
  control,
  name,
  formLabel = "Profile Picture",
  readOnly = false,
}) => {
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const [preview, setPreview] = useState<string | null>(
    typeof value === "string" ? value : null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;

    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        event.target.value = "";
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        event.target.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      onChange(file);
    }
  };

  const handleClick = () => {
    if (readOnly) return;

    fileInputRef.current?.click();
  };

  const handleRemoveClick = () => {
    onChange(null);
  };

  useEffect(() => {
    if (typeof value === "string") {
      setPreview(value);
    } else if (value instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(value);
    } else {
      setPreview(null);
    }
  }, [value]);

  return (
    <div className="flex flex-col gap-3">
      {formLabel && (
        <label className="text-sm font-medium text-gray-700">{formLabel}</label>
      )}

      <div className="flex flex-col gap-2">
        <div className="relative w-24 h-24 group">
          <div
            className={`w-full h-full rounded-full border-2 ${
              preview ? "border-gray-300" : "border-dashed border-gray-300"
            } overflow-hidden bg-gray-50 flex items-center justify-center ${
              !readOnly
                ? "cursor-pointer hover:border-gray-400 transition-colors"
                : ""
            }`}
            onClick={handleClick}
          >
            {preview ? (
              <img
                src={getHttpsImageUrl(preview) ?? ""}
                alt="User avatar preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-2">
                <Camera className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>

          {!readOnly && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  aria-label="Open menu"
                  size="icon"
                  className="absolute bottom-0 right-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center transition-all shadow-lg hover:scale-110"
                >
                  <MoreHorizontalIcon size={15} />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="center"
                side="right"
                className="p-2 w-32 rounded-2xl ml-1"
              >
                <Command>
                  <CommandList>
                    <CommandGroup>
                      <CommandItem
                        value="change"
                        onSelect={handleClick} // or your function
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Pencil size={15} />
                        Change
                      </CommandItem>

                      <CommandItem
                        value="remove"
                        onSelect={handleRemoveClick}
                        className="flex items-center gap-2 cursor-pointer text-red-600"
                      >
                        <Trash2 size={15} />
                        Remove
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {!readOnly && (
          <p className="text-xs text-gray-500 text-left">PNG, JPG up to 5MB</p>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={readOnly}
        />
      </div>

      {error && <p className="text-sm text-red-600 mt-1">{error.message}</p>}
    </div>
  );
};

export default UserAvatarUpload;
