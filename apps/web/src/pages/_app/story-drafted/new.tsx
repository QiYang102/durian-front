import { useEffect } from "react";
import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ClassicLayout } from "@/components/ui/ClassicLayout";
import { StoryDraftedForm } from "@/components/story-drafted/StoryDraftedForm";
import { getSingleStory } from "@ttm/api/modules/story";
import { useCreateStory } from "@ttm/api/modules/story";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { STORY_TEMPLATE } from "@ttm/api/types/editorTemplates";
import { useBlocker } from "@tanstack/react-router";

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

function NewStoryDetail() {
  const navigate = useNavigate();

  const search = useSearch({ from: "/_app/story-drafted/new" });
  const parentStoryId = search?.parent_story
    ? Number(search.parent_story)
    : undefined;

  const form = useForm<StoryFormSchema>({
    defaultValues: {
      name: "",
      project: null as any,
      short_description: "",
      description: "",
      priority: "normal",
      is_rnd: false,
      is_multi: false,
    },
    resolver: zodResolver(schema),
  });

  const { handleSubmit, formState } = form;
  const { isDirty, dirtyFields } = formState;

  const { status, proceed, reset } = useBlocker({
    shouldBlockFn: ({ next }) => {
      if (next.fullPath === "/story-drafted/$storyId") {
        return false;
      }

      const hasActualChanges = Object.keys(dirtyFields).length > 0;
      return hasActualChanges;
    },
    withResolver: true,
  });

  const parentStoryQueryKey = ["parent-story", parentStoryId?.toString() ?? ""];

  const { data: parentData } = getSingleStory(
    parentStoryQueryKey,
    parentStoryId as number,
    {
      include: ["project.*"],
    },
    { project: "projects" },
    {
      enabled: !!parentStoryId,
    },
  );

  const parentStory = parentData?.story;

  useEffect(() => {
    if (!parentStoryId) return;
    if (!parentStory) return;

    const currentProject = form.getValues("project");
    const parentProjectId =
      typeof parentStory.project === "number"
        ? parentStory.project
        : parentStory.project?.id;

    if (!currentProject && parentProjectId) {
      form.setValue("project", parentProjectId, { shouldDirty: true });
    }

    if (!form.getValues("name")) {
      form.setValue("name", parentStory.name ?? "", { shouldDirty: true });
    }
    if (!form.getValues("short_description")) {
      form.setValue("short_description", parentStory.short_description ?? "", {
        shouldDirty: true,
      });
    }
    if (!form.getValues("description")) {
      form.setValue("description", parentStory.description ?? "", {
        shouldDirty: true,
      });
    }
  }, [parentStoryId, parentStory, form]);

  const { mutate: createStoryDetail, isPending: isCreating } = useCreateStory({
    onSuccess: (result) => {
      form.reset();
      toast.success("Story has been created successfully");
      navigate({
        to: "/story-drafted/$storyId",
        params: { storyId: result.story.id.toString() },
        replace: true,
      });
    },
    onError: (error: any) => {
      toast.error(
        error?.data
          ? typeof error.data === "string"
            ? error.data
            : JSON.stringify(error.data)
          : error?.message || "Failed to create story. Please try again.",
      );
    },
  });

  const onSubmit = (data: StoryFormSchema) => {
    const localStorageTeamId = localStorage.getItem("teamId");

    createStoryDetail({
      ...data,
      team: localStorageTeamId ? Number(localStorageTeamId) : undefined,
      parent_story: parentStoryId,
    });
  };

  return (
    <div>
      <ClassicLayout
        title="Create Story"
        backButton
        actionButton={
          <div className="flex gap-3">
            <Button
              type="submit"
              form="story-create-form"
              disabled={isCreating || !isDirty}
            >
              <Plus className="w-4 h-4 mr-2" />
              {isCreating ? "Creating..." : "Create"}
            </Button>
          </div>
        }
        content={
          <FormProvider {...form}>
            <div className="flex flex-col gap-6">
              <Card>
                <CardContent className="flex flex-col gap-6">
                  <form
                    id="story-create-form"
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-6"
                  >
                    <StoryDraftedForm parentStoryId={parentStoryId} />
                  </form>
                </CardContent>
              </Card>
            </div>
          </FormProvider>
        }
      />
      {status === "blocked" && (
        <ConfirmDialog
          isOpen={true}
          title="Go back?"
          content="Are you sure you want to go back?"
          confirmText="Sure"
          cancelText="Cancel"
          onConfirm={proceed}
          onClose={reset}
        />
      )}
    </div>
  );
}

export const Route = createFileRoute("/_app/story-drafted/new")({
  component: NewStoryDetail,
});
