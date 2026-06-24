import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  getSingleStory,
  useEditStory,
  useMoveToLatestIteration,
  useDeleteStory,
} from "@ttm/api";
import { ClassicLayout } from "@/components/ui/ClassicLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { toast } from "sonner";
import { Loading } from "@/components/ui/Loading";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
// import withFeatureGuard from "@/components/guard/guard";
import { formatId } from "@ttm/utils";
import { StoryForm } from "@/components/storyboard/StoryForm";
import { StoryAttachment } from "@/components/storyboard/StoryAttachment";
import { PublishSuccessDialog } from "@/components/story-drafted/PublishSuccessDialog";
import { Rocket, Save, Trash2 } from "lucide-react";

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
  const { storyId } = Route.useParams();
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPublishSuccessDialog, setShowPublishSuccessDialog] =
    useState(false);

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
    ["story-detail", storyId],
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

      refetchStory();
    },
    onError: () => {
      toast.error("Failed to update story. Please try again.");
    },
  });

  const { mutate: moveToIteration, isPending: isPublishing } =
    useMoveToLatestIteration({
      onSuccess: () => {
        toast.success("Story has been published successfully");

        setShowPublishSuccessDialog(true);
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.detail ||
            "Failed to publish story. Please try again.",
        );
      },
    });

  const { mutate: deleteStory, isPending: isDeleting } = useDeleteStory({
    onSuccess: () => {
      toast.success("Story has been deleted successfully");

      navigate({ to: "/story-drafted" });
    },
    onError: (error: any) => {
      toast.error(
        error?.data ||
          error?.message ||
          "Failed to delete story. Please try again.",
      );
    },
  });

  const onSubmit = (data: StoryFormSchema) => {
    editStory({
      id: storyId,
      ...data,
    });
  };

  const handlePublish = () => {
    const formData = form.getValues();

    editStory(
      {
        id: storyId,
        ...formData,
        status: "new",
      },
      {
        onSuccess: () => {
          moveToIteration({ storyId: parseInt(storyId) });
        },
      },
    );
  };

  const handleDelete = () => {
    deleteStory(storyId);
    setShowDeleteDialog(false);
  };

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
        <div className="flex flex-col gap-6">
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
            </CardContent>
          </Card>
        </div>
      </FormProvider>
    );
  };

  return (
    <>
      <ClassicLayout
        title={`Edit Story${story?.id ? ` - ${formatId(story.id)}` : ""}`}
        backButton
        actionButton={
          <div className="flex gap-3">
            <Button
              type="button"
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
            <Button
              type="submit"
              form="story-form"
              disabled={isUpdating || !isDirty}
            >
              <Save className="w-4 h-4 mr-2" />
              {isUpdating ? "Saving..." : "Save"}
            </Button>

            <Button
              type="submit"
              onClick={handlePublish}
              disabled={isUpdating || isPublishing}
            >
              <Rocket className="w-4 h-4 mr-2" />
              {isPublishing ? "Publishing..." : "Publish"}
            </Button>
          </div>
        }
        content={renderContent()}
      />
      <ConfirmDialog
        isOpen={showDeleteDialog}
        isLoading={isDeleting}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Story"
        content={`Are you sure you want to delete "${story?.name || formatId(story?.id || 0)}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
      <PublishSuccessDialog
        isOpen={showPublishSuccessDialog}
        onClose={() => {
          setShowPublishSuccessDialog(false);
          navigate({ to: "/story-drafted", replace: true });
        }}
        storyId={storyId}
        storyName={story?.name}
      />
    </>
  );
}

// const ProtectedStoryManagement = withFeatureGuard(StoryDetail, "story");

export const Route = createFileRoute("/_app/story-drafted/$storyId")({
  component: StoryDetail,
});
