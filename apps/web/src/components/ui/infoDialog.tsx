import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";

import { Icon } from "./Icon";
import { Text } from "./Text";

export function InfoDialogue({
  isOpen,
  onClose,
  title,
  content,
  iconName,
  iconSize = "xl",
  iconColor = "text-primary",
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  iconName?: string;
  iconSize?: string;
  iconColor?: string;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-h-[90vh] w-[80%] max-w-[400px] overflow-auto "
        closeIconClassName="text-white"
      >
        <DialogHeader className="bg-secondary flex items-center justify-between rounded-t-lg p-6">
          <DialogTitle className="flex-grow text-center text-white">
            <Text variant="h2">{title}</Text>
          </DialogTitle>
        </DialogHeader>
        <div className="px-6">
          <div className="mt-4 flex flex-col items-center space-y-10">
            <Icon size={iconSize} name={iconName} color={"success"}></Icon>
            <p>{content}</p>
          </div>
        </div>

        <DialogFooter className="px-6 py-4"></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
