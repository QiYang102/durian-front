import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { getSingleStory, useDeleteStory, useEditStory } from "@ttm/api";
import { ClassicLayout } from "@/components/ui/ClassicLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Loading } from "@/components/ui/Loading";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
// import withFeatureGuard from "@/components/guard/guard";
import { ArrowLeftRight, CheckCircle2, Save, Trash2 } from "lucide-react";
import { formatId } from "@ttm/utils";
import { StoryForm } from "@/components/storyboard/StoryForm";
import { StoryStatus } from "@ttm/api/types/enums";
import { StoryAttachment } from "@/components/storyboard/StoryAttachment";
import TaskSection from "@/components/task/TaskSection";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import VerifiedBySection from "@/components/verified-by-user/VerifiedBySection";
import { toast } from "sonner";
import TagSection from "@/components/tag/TagSection";
import TeamCheckInRequired from "@/components/TeamCheckInRequired";
import BugTaskSection from "@/components/task/BugTaskSection";

const schema = z.object({
  project: z.coerce.number().min(1, "Project is required"),
  name: z.string().min(1, "Name is required"),
  short_description: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  priority: z.string().min(1, "Priority is required"),
  is_rnd: z.boolean().default(false),
  is_multi: z.boolean().default(false),
});

type StoryFormSchema = z.infer<typeof schema>;

function StoryDetail() {
  const navigate = useNavigate();

  const { storyId } = Route.useParams();
  const teamId = localStorage.getItem("teamId") || "";
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showBacklogDialog, setShowBacklogDialog] = useState(false);

  const form = useForm<StoryFormSchema>({
    defaultValues: {
      name: "",
      short_description: "",
      description: "",
      priority: "normal",
      is_rnd: false,
      is_multi: false,
    },
    resolver: zodResolver(schema),
  });

  const {
    handleSubmit,
    reset,
    formState: { isDirty },
  } = form;

  const {
    data,
    isLoading,
    isError,
    refetch: refetchStory,
  } = getSingleStory(
    ["story-detail", storyId, teamId],
    parseInt(storyId),
    {
      include: ["project.*", "iteration.*", "team.*"],
    },
    {
      project: "projects",
      iteration: "iterations",
      team: "teams",
    },
  );

  const story = data?.story;

  useEffect(() => {
    if (story) {
      reset({
        project:
          typeof story.project === "number"
            ? story.project
            : story.project?.id || undefined,
        name: story.name || "",
        short_description: story.short_description || "",
        description: story.description || "",
        priority: story.priority || "normal",
        is_rnd: story.is_rnd || false,
        is_multi: story.is_multi || false,
      });
    }
  }, [story, reset]);

  const { mutate: editStory, isPending: isUpdating } = useEditStory({
    onSuccess: () => {
      toast.success("Story has been updated successfully");
    },
    onError: () => {
      toast.error("Failed to update story. Please try again.");
    },
  });

  const { mutate: markComplete, isPending: isMarkingComplete } = useEditStory({
    onSuccess: (data) => {
      const updatedStory = data.story;
      toast.success(
        `Story marked as ${updatedStory.status == StoryStatus.COMPLETED ? "complete" : "incomplete"}`,
      );
    },
    onError: () => {
      toast.error("Failed to update story status. Please try again.");
    },
  });

  const moveToBacklog = useEditStory({
    onSuccess: () => {
      toast.success("Story has been moved to backlog successfully");
      setShowBacklogDialog(false);
      navigate({
        to: "/storyboard",
      });
    },
    onError: () => {
      toast.error("Failed to move story to backlog. Please try again.");
    },
  });

  const { mutate: deleteStory, isPending: isDeleting } = useDeleteStory({
    onSuccess: () => {
      toast.success("Story has been deleted successfully");
      setShowDeleteDialog(false);
      window.history.back();
    },
    onError: () => {
      toast.error("Failed to delete story. Please try again.");
    },
  });

  const onSubmit = (data: StoryFormSchema) => {
    editStory({
      id: storyId,
      ...data,
    });
  };

  const handleMarkComplete = () => {
    const newStatus = isCompleted
      ? story?.is_multi
        ? StoryStatus.STARTED
        : StoryStatus.TAKEN
      : StoryStatus.COMPLETED;

    markComplete({
      id: storyId,
      status: newStatus,
    });

    setShowCompleteDialog(false);
  };

  const handleDelete = () => {
    deleteStory(storyId);
  };

  const handleMoveToBacklog = () => {
    moveToBacklog.mutate({
      id: storyId,
      iteration: null,
      status: StoryStatus.DRAFT,
    });
  };

  useEffect(() => {
    if (!isLoading && story) {
      const currentTeamId = parseInt(teamId || "0");

      // If the story exists but belongs to a different team, redirect
      if (story.team?.id !== currentTeamId) {
        navigate({
          to: "/storyboard",
          replace: true,
        });
      }
    }
  }, [isLoading, story, teamId, navigate]);

  const renderContent = () => {
    if (isLoading && !story) {
      return (
        <Card>
          <CardContent className="min-h-screen p-8">
            <Loading
              showText
              text="Loading story data..."
              size="lg"
              className="items-center justify-center"
            />
          </CardContent>
        </Card>
      );
    }

    if (isError || !story) {
      return (
        <ErrorDisplay
          title="Error Loading Story"
          message="We encountered an error while loading the story. Please try again."
          onRetry={() => {
            refetchStory();
          }}
          retryText="Reload Data"
        />
      );
    }

    return (
      <FormProvider {...form}>
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 flex flex-col gap-6">
            <Card>
              <CardContent className="flex flex-col gap-6">
                <form
                  id="story-form"
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-6"
                >
                  <StoryForm story={story} />
                </form>

                <StoryAttachment storyId={storyId} />

                <div className="pt-4 flex gap-3 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowBacklogDialog(true)}
                    disabled={isDeleting}
                  >
                    <ArrowLeftRight className="w-4 h-4 mr-2" />
                    Move to Backlog
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setShowDeleteDialog(true)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6">
            <TaskSection storyId={storyId} />
            <BugTaskSection storyId={storyId} />
            <VerifiedBySection storyId={storyId} />
            <TagSection storyId={storyId} />
          </div>
        </div>
      </FormProvider>
    );
  };

  const isCompleted = story?.status === StoryStatus.COMPLETED;

  return (
    <>
      <ClassicLayout
        title={`Edit Story${story?.id ? ` - ${formatId(story.id)}` : ""}`}
        backButton
        actionButton={
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowCompleteDialog(true)}
              disabled={isMarkingComplete}
              className={`w-[200px] justify-center ${
                isCompleted
                  ? "bg-green-500 text-white border-green-500 hover:bg-green-600 hover:text-white"
                  : ""
              }`}
            >
              {isMarkingComplete ? (
                <>
                  <Loading className="mr-2 h-4 w-4" />
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {isCompleted ? "Completed" : "Mark as Completed"}
                </>
              )}
            </Button>

            <Button
              type="submit"
              form="story-form"
              disabled={isUpdating || !isDirty}
            >
              <Save className="w-4 h-4 mr-2" />
              {isUpdating ? "Saving..." : "Save"}
            </Button>
          </div>
        }
        content={renderContent()}
      />

      <ConfirmDialog
        isOpen={showCompleteDialog}
        onClose={() => setShowCompleteDialog(false)}
        onConfirm={handleMarkComplete}
        title={
          isCompleted ? "Mark Story as Incomplete" : "Mark Story as Complete"
        }
        content={
          isCompleted
            ? "Are you sure you want to mark this story as incomplete? This will reopen the story."
            : "Are you sure you want to mark this story as complete? Make sure all tasks are finished."
        }
        confirmText={isCompleted ? "Mark Incomplete" : "Mark Complete"}
        cancelText="Cancel"
      />

      <ConfirmDialog
        isOpen={showBacklogDialog}
        onClose={() => setShowBacklogDialog(false)}
        onConfirm={handleMoveToBacklog}
        title="Move to Backlog"
        content="Are you sure you want to move the current story to backlog? This will remove it from the current iteration."
        confirmText="Move to Backlog"
        cancelText="Cancel"
      />

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Story"
        content="Are you sure you want to delete this story? This action cannot be undone. All associated tasks will also be deleted."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}

// const ProtectedStoryManagement = withFeatureGuard(StoryDetail, "story");

export const Route = createFileRoute("/_app/story/$storyId")({
  component: StoryDetail,
});
