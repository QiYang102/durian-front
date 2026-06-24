import { CustomDialog } from "@/components/ui/CustomDialog";
import { FormProvider, useForm } from "react-hook-form";
import { TaskForm } from "../TaskForm";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Task } from "@ttm/api/types/models/task";
import { getSingleStory, useEditStory, useEditTask } from "@ttm/api";
import { toast } from "sonner";
import { StoryStatus } from "@ttm/api/types/enums";
import { useEffect } from "react";

const schema = z.object({
  description: z.string().min(1, ""),
  user: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.number().optional(),
  ),
  estimate_time: z.coerce.number().optional(),
});

type TaskFormSchema = z.infer<typeof schema>;

interface EditTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
}

export default function EditTaskDialog({
  isOpen,
  onClose,
  task,
}: EditTaskDialogProps) {
  const form = useForm<TaskFormSchema>({
    defaultValues: {
      description: task.description || "",
      user: typeof task.user === "object" ? task.user?.id : task.user,
      estimate_time: task.estimate_time || 0,
    },
    resolver: zodResolver(schema),
  });

  const {
    handleSubmit,
    reset,
    formState: { isDirty },
  } = form;

  useEffect(() => {
    if (isOpen) {
      reset({
        description: task.description || "",
        user: typeof task.user === "object" ? task.user?.id : task.user,
        estimate_time: task.estimate_time || 0,
      });
    }
  }, [isOpen, task, reset]);

  const { data: storyData } = getSingleStory(
    ["story-detail", String(task.story)],
    typeof task.story === "number" ? task.story : 0,
    {},
    {},
  );

  const story = storyData?.story;

  const editStory = useEditStory();

  const editTask = useEditTask({
    onSuccess: () => {
      toast.success("Task has been updated successfully");
      onClose();
    },
    onError: () => {
      toast.error("Failed to update task. Please try again.");
    },
  });

  const handleEdit = (data: TaskFormSchema) => {
    const wasUnassigned = !task.user;
    const isNowAssigned = !!data.user;

    editTask.mutate(
      {
        id: String(task.id),
        description: data.description,
        user: data.user,
        estimate_time: data.estimate_time,
        story: task.story,
        status: task.status,
      },
      {
        onSuccess: () => {
          if (wasUnassigned && isNowAssigned) {
            const newStoryStatus = story?.is_multi
              ? StoryStatus.STARTED
              : StoryStatus.TAKEN;

            editStory.mutate({
              id: String(task.story),
              status: newStoryStatus,
            });
          }
        },
      },
    );
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <CustomDialog
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={handleSubmit(handleEdit)}
      confirmText="Update"
      title="Edit Task"
      isLoading={editTask.isPending || !isDirty}
      contentClassName="!max-w-[700px] w-[90%]"
    >
      <FormProvider {...form}>
        <form id="edit-task-form" className="flex flex-col gap-6">
          <TaskForm />
        </form>
      </FormProvider>
    </CustomDialog>
  );
}
