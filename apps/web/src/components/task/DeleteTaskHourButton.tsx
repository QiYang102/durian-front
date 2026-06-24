import { useState } from "react";
import { TaskHour } from "@ttm/api/types/models/taskHour";
import { useEditTaskHour } from "@ttm/api";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { toast } from "sonner";

interface DeleteTaskHourButtonProps {
  taskHour: TaskHour;
  onSuccess?: () => void;
}

export const DeleteTaskHourButton = ({
  taskHour,
  onSuccess,
}: DeleteTaskHourButtonProps) => {
  const [confirmDialogOpened, setConfirmDialogOpened] = useState(false);

  const editTaskHour = useEditTaskHour({
    onSuccess: () => {
      toast.success("Task hour has been deleted successfully");

      setConfirmDialogOpened(false);
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to delete task hour. Please try again.");

      setConfirmDialogOpened(false);
    },
  });

  const handleDeactivateTaskHour = () => {
    if (!taskHour.id) return;
    const userId =
      typeof taskHour.user === "object" ? taskHour.user?.id : taskHour.user;

    const taskId =
      typeof taskHour.task === "object" ? taskHour.task?.id : taskHour.task;

    editTaskHour.mutate({
      id: taskHour.id.toString(),
      is_active: false,
      user: userId,
      task: taskId,
    });
  };

  return (
    <>
      <Button
        variant="blank"
        onClick={(e) => {
          e.stopPropagation();
          setConfirmDialogOpened(true);
        }}
        disabled={editTaskHour.isPending}
      >
        <Icon name="trash-2" color="danger" size="md" />
      </Button>

      <div onClick={(e) => e.stopPropagation()}>
        <ConfirmDialog
          isOpen={confirmDialogOpened}
          onClose={() => setConfirmDialogOpened(false)}
          onConfirm={handleDeactivateTaskHour}
          title="Confirm Delete"
          content="Are you sure you want to delete this task hour record?"
          confirmText="Yes"
          cancelText="No"
          isLoading={editTaskHour.isPending}
        />
      </div>
    </>
  );
};
