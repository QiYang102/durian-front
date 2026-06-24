import { CustomDialog } from "@/components/ui/CustomDialog";
import { FormProvider, useForm } from "react-hook-form";
import { BugsTaskForm } from "./BugsTaskForm";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Task } from "@ttm/api/types/models/task";
import { useEditStory, useEditTask } from "@ttm/api";
import { toast } from "sonner";
import { StoryStatus } from "@ttm/api/types/enums";
import { useEffect } from "react";

const schema = z.object({
  description: z.string().min(1, ""),
  user: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.number().optional(),
  ),
});

type BugsTaskFormSchema = z.infer<typeof schema>;

interface EditTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
}

export default function EditBugsTaskDialog({
  isOpen,
  onClose,
  task,
}: EditTaskDialogProps) {
  const form = useForm<BugsTaskFormSchema>({
    defaultValues: {
      description: task.description || "",
      user: typeof task.user === "object" ? task.user?.id : task.user,
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
      });
    }
  }, [isOpen, task, reset]);

  const story = typeof task.story === "object" ? task.story : undefined;
  const storyId = typeof task.story === "object" ? task.story?.id : task.story;

  const editStory = useEditStory();

  const editTask = useEditTask({
    onSuccess: () => {
      toast.success("Task has been updated successfull");
      onClose();
    },
    onError: () => {
      toast.error("Failed to update task. Please try again.");
    },
  });

  const handleEdit = (data: BugsTaskFormSchema) => {
    const wasUnassigned = !task.user;
    const isNowAssigned = !!data.user;

    editTask.mutate(
      {
        id: String(task.id),
        description: data.description,
        user: data.user,
        story: storyId,
        status: task.status,
      },
      {
        onSuccess: () => {
          if (wasUnassigned && isNowAssigned) {
            const newStoryStatus = story?.is_multi
              ? StoryStatus.STARTED
              : StoryStatus.TAKEN;

            editStory.mutate({
              id: String(storyId),
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
          <BugsTaskForm />
        </form>
      </FormProvider>
    </CustomDialog>
  );
}
