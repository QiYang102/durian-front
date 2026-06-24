import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomDialog } from "@/components/ui/CustomDialog";
import { TextInput } from "@/components/ui/TextInput";
import { useSession } from "@ttm/context";
import { Task } from "@ttm/api/types/models/task";
import { useCreateTaskHour, useEditTask } from "@ttm/api";
import { toast } from "sonner";
import { TaskStatus } from "@ttm/api/types/enums";

const schema = z.object({
  hour: z.coerce.number().min(0.1, "Hours must be greater than 0"),

  // To identify wheather the user wants to set remain_hour or not
  remain_hour: z.preprocess(
    (val) =>
      val === "" || val === null || val === undefined ? null : Number(val),
    z
      .number()
      .min(0, "Remaining hours cannot be negative")
      .nullable()
      .optional(),
  ),
});

type AddTaskHourFormData = z.infer<typeof schema>;

interface AddTaskHourDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
}

export default function AddTaskHourDialog({
  isOpen,
  onClose,
  task,
}: AddTaskHourDialogProps) {
  const session = useSession();
  const currentUser = session.user;

  const form = useForm<AddTaskHourFormData>({
    defaultValues: {
      hour: 0,
      remain_hour: undefined,
    },
    resolver: zodResolver(schema),
  });

  const { control, handleSubmit, reset } = form;

  const createTaskHour = useCreateTaskHour({
    onSuccess: () => {
      toast.success("Task hour has been added successfully");

      onClose();
      reset();
    },
    onError: () => {
      toast.error("Failed to add task hour. Please try again.");
    },
  });

  const editTask = useEditTask({
    onError: () => {
      toast.error("Failed to update task status. Please try again.");
    },
  });

  const handleConfirm = (data: AddTaskHourFormData) => {
    createTaskHour.mutate({
      task: task.id,
      user: currentUser?.id || 0,
      hour: data.hour,
      remain_hour: data.remain_hour,
    });

    if (task.status === TaskStatus.STATUS_DO) {
      editTask.mutate({
        id: String(task.id),
        status: TaskStatus.STATUS_DOING,
        story: task.story,
        description: task.description,
      });
    }
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <CustomDialog
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={handleSubmit(handleConfirm)}
      title="Add Task Hour"
      confirmText="Add"
      cancelText="Cancel"
      isLoading={createTaskHour.isPending || editTask.isPending}
    >
      <div className="flex flex-col gap-4">
        <TextInput
          title="Hours Used"
          name="hour"
          control={control}
          type="number"
          placeholder="e.g., 2.5"
          className="w-full"
          autoMargin={false}
        />

        <TextInput
          title="Remaining Hours"
          name="remain_hour"
          control={control}
          type="number"
          placeholder="e.g., 1.5"
          className="w-full"
          autoMargin={false}
        />
      </div>
    </CustomDialog>
  );
}
