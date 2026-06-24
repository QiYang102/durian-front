import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "@/components/ui/TextInput";
import { Button } from "@/components/ui/Button";
import StoryDraftedCard from "@/components/story-drafted/StoryDraftedCard";
import { Card, CardContent } from "@/components/ui/Card";
import { ClassicLayout } from "@/components/ui/ClassicLayout";
import { AsyncCombobox } from "@/components/ui/AsyncCombobox";
import withFeatureGuard from "@/components/guard/guard";
import { Plus, SlidersHorizontal } from "lucide-react";

const schema = z.object({
  search: z.string().optional(),
  project: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => val?.toString()),
});

function StoryDraftedListing() {
  const navigate = useNavigate();
  const [teamId, setTeamId] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      search: "",
    },
    resolver: zodResolver(schema),
  });

  const { control, handleSubmit, watch, setValue } = form;
  const selectedProject = watch("project") || "";

  const [submittedSearch, setSubmittedSearch] = useState("");
  const [submittedProject, setSubmittedProject] = useState("");

  useEffect(() => {
    const localStorageTeamId = localStorage.getItem("teamId");
    setTeamId(localStorageTeamId);
  }, []);

  const handleCreateClick = () => {
    navigate({
      to: "/story-drafted/new",
    });
  };

  const onSubmit = (data: { search?: string; project?: string }) => {
    setSubmittedSearch(data.search || "");
    setSubmittedProject(data.project || ""); // ADDED
  };

  const handleProjectChange = (projectValue: string | undefined) => {
    setValue("project", projectValue || "");
  };

  const actionButton = (
    <Button
      variant="default"
      onClick={handleCreateClick}
      className="flex items-center gap-2"
    >
      <Plus className="w-4 h-4" />
      Create
    </Button>
  );

  const content = (
    <>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-row items-end gap-2">
            <TextInput
              id="search"
              control={control}
              placeholder="Search stories..."
              title="Search"
              name="search"
              showPassword={false}
              toggleShowPassword={undefined}
            />
            <div className="flex-1">
              <AsyncCombobox
                name="project"
                control={control}
                formLabel="Project"
                labelField="name"
                valueField="id"
                endpoint={
                  teamId ? `/projects?filter{team}=${teamId}` : "/projects"
                }
                dataKey="projects"
                placeholder="Filter by project"
                defaultValue={selectedProject || undefined}
                onPostChange={(value) => {
                  handleProjectChange(value);
                }}
              />
            </div>
            <Button type="submit" className="mb-3">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </form>
      </FormProvider>
      <Card>
        <CardContent className="overflow-x-auto">
          <StoryDraftedCard
            searchValue={submittedSearch}
            projectFilter={submittedProject}
          />
        </CardContent>
      </Card>
    </>
  );

  return (
    <ClassicLayout
      title="Backlog"
      actionButton={actionButton}
      content={content}
    />
  );
}

const ProtectedStoryManagement = withFeatureGuard(StoryDraftedListing, "story");

export const Route = createFileRoute("/_app/story-drafted/")({
  component: StoryDraftedListing,
});
