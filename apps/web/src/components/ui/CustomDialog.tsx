import { ComponentProps, ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";

import { Button } from "./Button";
import { Text } from "./Text";

export function CustomDialog({
  contentClassName,
  isOpen = false,
  isLoading = false,
  isSecondaryLoading = false,
  onClose,
  onConfirm,
  onSecondaryConfirm,
  title = "Title",
  footerContent = "",
  confirmText = "Yes",
  secondaryButtonText = "",
  cancelText = "",
  children,
}: {
  contentClassName?: string;
  isOpen: boolean;
  isLoading?: boolean;
  isSecondaryLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onSecondaryConfirm?: () => void;
  title: string;
  confirmText: string;
  cancelText?: string;
  secondaryButtonText?: string;
  children?: ReactNode;
  footerContent?: string;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        closeIconClassName="text-white"
        className={`max-h-[90vh] w-[80%] max-w-[400px] overflow-visible ${contentClassName}`}
      >
        <DialogHeader className="bg-primary flex items-center justify-between rounded-t-lg p-5">
          <DialogTitle className="flex-grow text-center text-white">
            <Text variant="h2">{title}</Text>
          </DialogTitle>
        </DialogHeader>
        {children && (
          <div className="px-6 pb-6">
            <div className="flex flex-col gap-3">
              {children}

              <div className="grid grid-cols-3 gap-3">
                {secondaryButtonText && (
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={onSecondaryConfirm}
                    disabled={isSecondaryLoading}
                  >
                    <Text variant="default">{secondaryButtonText}</Text>
                  </Button>
                )}
                {cancelText && (
                  <Button
                    variant="outline"
                    className="col-start-2 col-end-3 w-full"
                    onClick={onClose}
                  >
                    <Text variant="default">{cancelText}</Text>
                  </Button>
                )}
                <Button
                  variant="default"
                  className="col-start-3 col-end-4 w-full"
                  onClick={onConfirm}
                  disabled={isLoading}
                >
                  <Text variant="default">{confirmText}</Text>
                </Button>
              </div>
            </div>
          </div>
        )}

        {footerContent && (
          <DialogFooter className="flex items-center justify-center space-x-2 bg-red-100 text-center">
            {footerContent}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

CustomDialog.displayName = "CustomDialog";
