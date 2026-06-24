import { useState } from "react";
import { Text } from "@/components/ui/Text";
import { Separator } from "@/components/ui/Separator";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  listStoryImages,
  useUploadStoryImage,
  useDeleteStoryImage,
} from "@ttm/api";
import { Loading } from "@/components/ui/Loading";
import { Upload, Trash2, ChevronRight, ChevronLeft } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { getHttpsImageUrl } from "@ttm/utils/src/transformHttp";
import { cn } from "@/lib/utils";

interface StoryAttachmentProps {
  storyId: string;
}

export function StoryAttachment({ storyId }: StoryAttachmentProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<number | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const {
    data,
    isLoading,
    refetch: refetchImages,
  } = listStoryImages(
    ["story-images", storyId],
    {
      filter: {
        story: storyId,
      },
    },
    {},
  );

  const { mutate: uploadImage, isPending: isUploading } = useUploadStoryImage({
    onSuccess: () => {
      toast.success("Image has been uploaded successfully");

      setSelectedFile(null);
      refetchImages();
    },
    onError: () => {
      toast.error("Failed to upload image. Please try again.");
    },
  });

  const deleteImage = useDeleteStoryImage({
    onSuccess: () => {
      toast.success("Image has been deleted successfully");

      setDeleteDialogOpen(false);
      setImageToDelete(null);
      refetchImages();
    },
    onError: () => {
      toast.error("Failed to delete image. Please try again.");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!file.type.startsWith("image/")) {
        toast.error("Invalid file. Please select an image file.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image too large. Must be less than 5MB.");
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadImage({
        story_id: storyId,
        image: selectedFile,
      });
    }
  };

  const handleDeleteClick = (imageId: number) => {
    setImageToDelete(imageId);
    setDeleteDialogOpen(true);
  };

  const handleImageClick = (imageIndex: number) => {
    setCurrentIndex(imageIndex);
    setViewDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (imageToDelete) {
      deleteImage.mutate(imageToDelete.toString());
    }
  };

  const storyImages = data?.storyImages || [];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : storyImages.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < storyImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <>
      <div className="space-y-1">
        <Text variant="h3">Attachments</Text>
        <Separator />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="story-image-upload"
          />
          <label htmlFor="story-image-upload" className="flex-1 cursor-pointer">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Upload className="w-5 h-5" />
                <span className="text-sm">
                  {selectedFile ? selectedFile.name : "Click to select image"}
                </span>
              </div>
            </div>
          </label>
          {selectedFile && (
            <Button onClick={handleUpload} disabled={isUploading} size="sm">
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <Loading
          showText
          text="Loading attachments..."
          size="sm"
          className="items-center justify-center py-8"
        />
      ) : storyImages.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {storyImages.map((image, index) => (
            <div
              key={image.id}
              className="relative group rounded-lg overflow-hidden border border-gray-200"
            >
              <img
                src={getHttpsImageUrl(image.image) ?? ""}
                alt="Story attachment"
                className="w-full h-32 object-cover cursor-pointer"
                onClick={() => handleImageClick(index)}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center pointer-events-none">
                <Button
                  variant="destructive"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(image.id!);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 text-sm">
          No attachments found.
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setImageToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Confirm Deletion"
        content="Are you sure you want to delete this image? This action cannot be undone."
        confirmText="Yes"
        cancelText="No"
      />
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent
          closeIconClassName="text-white"
          className="max-w-[95vw] md:max-w-[85vw] max-h-[85vh] w-fit p-0 bg-black/80 border-none backdrop-blur-md overflow-hidden"
        >
          <div className="relative flex items-center justify-center p-4 group">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={cn(
                "absolute left-4 z-10 p-2 rounded-full transition-all opacity-0 group-hover:opacity-100",
                currentIndex === 0
                  ? "bg-none text-gray-700 cursor-not-allowed"
                  : "bg-white/10 hover:bg-white/20 text-white",
              )}
            >
              <ChevronLeft size={32} />
            </button>

            <img
              src={getHttpsImageUrl(storyImages[currentIndex]?.image) ?? ""}
              alt="Story attachment preview"
              className="max-w-full h-[70vh] w-fit object-contain rounded-lg"
            />

            <button
              onClick={handleNext}
              disabled={currentIndex === storyImages.length - 1}
              className={cn(
                "absolute right-4 z-10 p-2 rounded-full transition-all opacity-0 group-hover:opacity-100",
                currentIndex === storyImages.length - 1
                  ? "bg-none text-gray-700 cursor-not-allowed"
                  : "bg-white/10 hover:bg-white/20 text-white",
              )}
            >
              <ChevronRight size={32} />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
