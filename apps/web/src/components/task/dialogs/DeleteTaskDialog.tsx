import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useDeleteTask } from "@ttm/api";
import { toast } from "sonner";
import { Task } from "@ttm/api/types/models/task";

interface DeleteTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onSuccess?: () => void;
}

export default function DeleteTaskDialog({
  isOpen,
  onClose,
  task,
  onSuccess,
}: DeleteTaskDialogProps) {
  const deleteTask = useDeleteTask({
    onSuccess: () => {
      toast.success("Task has been deleted successfully");

      onClose();
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to delete task. Please try again.");
    },
  });

  const handleDelete = () => {
    deleteTask.mutate(String(task.id));
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDelete}
      title="Delete Task"
      content="Are you sure you want to delete this task?"
      confirmText="Delete"
      cancelText="Cancel"
      isLoading={deleteTask.isPending}
    />
  );
}
