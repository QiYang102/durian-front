import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";

import { Button } from "./Button";
import { Text } from "./Text";

export function ConfirmDialog({
  isOpen,
  isLoading,
  onClose,
  onConfirm,
  title,
  content,
  confirmText = "Yes",
  cancelText,
  confirmTrackEventName,
  cancelTrackEventName,
}: {
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  // content: string;
  content: React.ReactNode;
  confirmText: string;
  cancelText?: string;
  confirmTrackEventName?: string;
  cancelTrackEventName?: string;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-h-[90vh] w-[80%] max-w-[400px] overflow-auto "
        closeIconClassName="text-white"
      >
        <DialogHeader className="bg-primary flex items-center justify-between rounded-t-lg p-5">
          <DialogTitle className="flex-grow text-center text-white">
            <Text variant="h2">{title}</Text>
          </DialogTitle>
        </DialogHeader>
        <div className="px-6 pb-6">
          <div className="flex flex-col items-center gap-3">
            <Text variant="h4">{content}</Text>
            <Button
              variant="destructive"
              className="w-full"
              onClick={onConfirm}
              disabled={isLoading}
              trackEventName={confirmTrackEventName}
            >
              <Text variant="default">{confirmText}</Text>
            </Button>
            {cancelText && (
              <Button
                variant="outline"
                className="w-full"
                onClick={onClose}
                disabled={isLoading}
                trackEventName={cancelTrackEventName}
              >
                <Text variant="default">{cancelText}</Text>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
