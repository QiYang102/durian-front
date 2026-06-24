import { useState } from "react";
import { EventCalendar } from "@ttm/api/types/models/eventCalendar";
import { useDeleteEventCalendar } from "@ttm/api/modules/eventCalendar";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { toast } from "sonner";

interface DeleteLeaveListingButtonProps {
  leave: EventCalendar;
  onSuccess?: () => void;
}

export const DeleteLeaveListingButton = ({
  leave,
  onSuccess,
}: DeleteLeaveListingButtonProps) => {
  const [confirmDialogOpened, setConfirmDialogOpened] = useState(false);

  const deleteLeave = useDeleteEventCalendar({
    onSuccess: () => {
      toast.success("Leave has been deleted successfully");

      setConfirmDialogOpened(false);
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to delete leave. Please try again.");

      setConfirmDialogOpened(false);
    },
  });

  const handleDeleteStory = () => {
    if (!leave.id) return;
    deleteLeave.mutate(leave.id.toString());
  };

  return (
    <>
      <Button
        variant="blank"
        onClick={(e) => {
          e.stopPropagation();
          setConfirmDialogOpened(true);
        }}
        disabled={deleteLeave.isPending}
      >
        <Icon name="trash-2" color="danger" size="md" />
      </Button>

      <div onClick={(e) => e.stopPropagation()}>
        <ConfirmDialog
          isOpen={confirmDialogOpened}
          onClose={() => setConfirmDialogOpened(false)}
          onConfirm={handleDeleteStory}
          title="Confirm Deletion"
          content="Are you sure you want to delete this leave?"
          confirmText="Yes"
          cancelText="No"
        />
      </div>
    </>
  );
};
