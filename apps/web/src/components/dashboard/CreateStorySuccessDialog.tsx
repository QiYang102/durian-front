import { useNavigate } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { Navigation } from "lucide-react";

interface CreateStorySuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  storyId: string;
  storyName?: string;
}

export const CreateStorySuccessDialog = ({
  isOpen,
  onClose,
  storyId,
  storyName,
}: CreateStorySuccessDialogProps) => {
  const navigate = useNavigate();

  const handleBackToDrafted = () => {
    navigate({ to: `/story-drafted/${storyId}`, replace: true });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        closeIconClassName="text-white"
        className="flex max-h-[90vh] w-[80%] max-w-[600px] flex-col"
      >
        <DialogHeader className="bg-primary flex flex-shrink-0 items-center justify-center gap-2 rounded-t-lg p-5">
          <DialogTitle className="text-center text-white">
            <Text variant="h2">Story Created Successfully!</Text>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="flex flex-col gap-6 py-4">
            <div className="text-center">
              <Text variant="default" className="text-gray-600">
                {storyName ? `"${storyName}"` : "Your story"} has been created
              </Text>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                variant="default"
                className="w-full"
                onClick={handleBackToDrafted}
              >
                <Navigation className="w-4 h-4 mr-2" />
                <Text variant="default">Take me to the story</Text>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
