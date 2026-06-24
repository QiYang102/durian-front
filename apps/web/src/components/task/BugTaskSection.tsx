import {
  getSingleStory,
  listTasks,
  useCreateTask,
  useEditStory,
} from "@ttm/api";
import { Card, CardContent } from "@/components/ui/Card";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import { Loading } from "@/components/ui/Loading";
import { Pagination } from "@/components/Pagination";
import { useState } from "react";
import { Bug, ChevronDown, ChevronUp, Plus } from "lucide-react";
import TaskCard from "./TaskCard";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { CustomDialog } from "../ui/CustomDialog";
import { FormProvider, useForm } from "react-hook-form";
import { TaskForm } from "./TaskForm";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { TaskStatus, StoryStatus } from "@ttm/api/types/enums";

const schema = z.object({
  description: z.string().min(1, ""),
  user: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.number().optional(),
  ),
  estimate_time: z.coerce.number().optional(),
});

type TaskFormSchema = z.infer<typeof schema>;

interface TaskListProps {
  storyId: string;
}

export default function BugTaskSection({ storyId }: TaskListProps) {
  const [page, setPage] = useState(1);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const form = useForm<TaskFormSchema>({
    defaultValues: {
      description: "",
      estimate_time: 0,
    },
    resolver: zodResolver(schema),
  });

  const {
    handleSubmit,
    reset,
    formState: { isDirty },
  } = form;

  const { data: storyData } = getSingleStory(
    ["story-detail", storyId],
    parseInt(storyId),
    {
      include: ["iteration.*"],
    },
    {
      iteration: "iterations",
    },
  );

  const story = storyData?.story;

  const isStoryCompleted = story?.status === StoryStatus.COMPLETED;
  const [isCollapsed, setIsCollapsed] = useState(isStoryCompleted);

  const iteration = story?.iteration as { id?: number } | number | undefined;
  const iterationId = typeof iteration === "object" ? iteration?.id : iteration;

  const { data, isLoading, isError, refetch } = listTasks(
    ["list-of-story-bug-tasks", page.toString(), storyId],
    {
      page: page,
      per_page: 5,
      filter: { story: storyId, is_active: "true", is_bug: "true" },
      include: ["user.*"],
    },
    { user: "users" },
  );

  const { tasks, meta } = data || {};

  const { mutate: createTask, isPending: isCreating } = useCreateTask({
    onSuccess: () => {
      toast.success("Bug fix has been created successfully");

      setShowAddDialog(false);
      reset();
      refetch();
    },
    onError: () => {
      toast.error("Failed to create bug fix. Please try again.");
    },
  });

  const editStory = useEditStory();

  const onSubmit = (data: TaskFormSchema) => {
    console.log("data", data);

    createTask(
      {
        story: parseInt(storyId),
        description: data.description,
        user: data.user,
        estimate_time: data.estimate_time,
        status: TaskStatus.STATUS_DO,
        iteration: iterationId,
        is_bug: true,
      },
      {
        onSuccess: () => {
          if (data.user) {
            const newStoryStatus = story?.is_multi
              ? StoryStatus.STARTED
              : StoryStatus.TAKEN;

            editStory.mutate({
              id: storyId,
              status: newStoryStatus,
            });
          }
        },
      },
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Loading
            showText
            text="Loading bug fixes..."
            size="lg"
            className="items-center justify-center"
          />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <ErrorDisplay
        title="Failed to load bug fixes"
        message="We couldn't load the bug fixes data. Please check your connection and try again."
        onRetry={() => {
          refetch();
        }}
        retryText="Reload Data"
      />
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <Text variant="h3">Bug Fixes</Text>
            </div>
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Bug className="mx-auto h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No bugs fixes found
              </h3>
              <Text color="gray">Click "Add Bug Fix" to create one.</Text>
            </div>
            <Button
              type="button"
              variant="default"
              className="w-full mt-4 py-3"
              onClick={() => setShowAddDialog(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Bug Fix
            </Button>
          </CardContent>
        </Card>

        <CustomDialog
          isOpen={showAddDialog}
          onClose={() => {
            setShowAddDialog(false);
            reset();
          }}
          onConfirm={handleSubmit(onSubmit)}
          confirmText={isCreating ? "Creating..." : "Create"}
          title="Add Bug Fix"
          isLoading={isCreating || !isDirty}
          contentClassName="!max-w-[700px] w-[90%]"
        >
          <FormProvider {...form}>
            <form id="bug-task-form" className="flex flex-col gap-6">
              <TaskForm />
            </form>
          </FormProvider>
        </CustomDialog>
      </>
    );
  }

  return (
    <>
      <Card>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Text variant="h3">Bug Fixes</Text>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="h-8 w-8 p-0"
              >
                {isCollapsed ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </Button>
            </div>

            {!isCollapsed && (
              <>
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onDelete={() => setPage(1)}
                    />
                  ))}
                </div>

                <Button
                  type="button"
                  variant="default"
                  className="w-full mt-4 py-3"
                  onClick={() => setShowAddDialog(true)}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Bug Fix
                </Button>

                <div className="flex items-center justify-end space-x-2 py-4">
                  <div className="text-muted-foreground flex flex-1 items-center gap-4 text-sm">
                    {meta?.total_results} total
                  </div>
                  <div className="space-x-2">
                    <Pagination
                      currentPage={meta?.page}
                      totalPages={meta?.total_pages}
                      onPageChange={(page) => setPage(page)}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <CustomDialog
        isOpen={showAddDialog}
        onClose={() => {
          setShowAddDialog(false);
          reset();
        }}
        onConfirm={handleSubmit(onSubmit)}
        confirmText={isCreating ? "Creating..." : "Create"}
        title="Add Bug Fix"
        isLoading={isCreating || !isDirty}
        contentClassName="!max-w-[700px] w-[90%]"
      >
        <FormProvider {...form}>
          <form id="bug-task-form" className="flex flex-col gap-6">
            <TaskForm />
          </form>
        </FormProvider>
      </CustomDialog>
    </>
  );
}
