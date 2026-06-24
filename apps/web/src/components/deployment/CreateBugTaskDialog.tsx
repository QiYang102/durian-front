import { CustomDialog } from "@/components/ui/CustomDialog";
import { FormProvider, useForm } from "react-hook-form";
import { TaskForm } from "../task/TaskForm";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateTask, useEditStory } from "@ttm/api";
import { toast } from "sonner";
import { Story } from "@ttm/api/types/models/story";
import { useEffect } from "react";
import { TaskStatus } from "@ttm/api/types/enums";

const schema = z.object({
  description: z.string().min(1, ""),
  user: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.number().optional(),
  ),
  estimate_time: z.coerce.number().optional(),
});

type TaskFormSchema = z.infer<typeof schema>;

interface CreateBugTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  story: Story;
}

export default function CreateBugTaskDialog({
  isOpen,
  onClose,
  story,
}: CreateBugTaskDialogProps) {
  const form = useForm<TaskFormSchema>({
    defaultValues: {
      description: `Bug: ${story.name}`,
      user: undefined,
      estimate_time: 0,
    },
    resolver: zodResolver(schema),
  });

  const { handleSubmit, reset } = form;

  useEffect(() => {
    if (isOpen) {
      reset({
        description: `Bug: ${story.name}`,
        estimate_time: 0,
      });
    }
  }, [isOpen, story.name, reset]);

  const editStory = useEditStory();

  const createTask = useCreateTask({
    onSuccess: () => {
      editStory.mutate(
        {
          id: String(story.id),
          has_issue: true,
        },
        {
          onSuccess: () => {
            toast.success("Bug task has been created successfully");
            onClose();
          },
        },
      );
    },
    onError: () => {
      toast.error("Failed to create bug task. Please try again.");
    },
  });

  const handleCreate = (data: TaskFormSchema) => {
    createTask.mutate({
      description: data.description,
      user: data.user,
      estimate_time: data.estimate_time,
      story: story.id,
      iteration: story.iteration,
      is_bug: true,
      status: TaskStatus.STATUS_DO,
    });
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <CustomDialog
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={handleSubmit(handleCreate)}
      confirmText="Create Bug Task"
      title="Report Bug"
      isLoading={createTask.isPending || editStory.isPending}
      contentClassName="!max-w-[700px] w-[90%]"
    >
      <FormProvider {...form}>
        <form id="create-bug-task-form" className="flex flex-col gap-6">
          <TaskForm />
        </form>
      </FormProvider>
    </CustomDialog>
  );
}
