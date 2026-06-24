import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { ClassicLayout } from "@/components/ui/ClassicLayout";
import StoryList from "@/components/story/StoryList";
import IssueListView from "@/components/storyboard/IssueListView";
import { getSingleIteration } from "@ttm/api";
import { Card, CardContent } from "@/components/ui/Card";
import { Loading } from "@/components/ui/Loading";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { AsyncCombobox } from "@/components/ui/AsyncCombobox";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import withFeatureGuard from "@/components/guard/guard";

enum StoryTab {
  STORY = "story",
  ISSUES = "issues",
}

const schema = z.object({
  name: z.number().optional().nullable(),
});

type SearchSchema = z.infer<typeof schema>;

export default function StoryListing() {
  const { iterationId } = Route.useParams();
  const { tab = StoryTab.STORY, user_id } = Route.useSearch();
  const navigate = useNavigate();

  const form = useForm<SearchSchema>({
    resolver: zodResolver(schema),
    values: {
      name: user_id ? Number(user_id) : undefined,
    },
  });

  const { control, handleSubmit } = form;

  const { data, isLoading, isError, refetch } = getSingleIteration(
    ["iteration-detail", iterationId],
    Number(iterationId),
    {},
  );

  const iteration = data?.iteration;

  const onSubmit = (formData: SearchSchema) => {
    navigate({
      to: "/iteration/$iterationId/story",
      params: { iterationId },
      search: {
        tab: tab as StoryTab,
        user_id: formData.name ?? undefined,
      },
      replace: true,
    });
  };

  if (isLoading) {
    return (
      <ClassicLayout
        title="Story List"
        backButton
        content={
          <Card>
            <CardContent>
              <Loading
                showText
                text="Loading iteration..."
                size="lg"
                className="items-center justify-center"
              />
            </CardContent>
          </Card>
        }
      />
    );
  }

  if (isError || !iteration) {
    return (
      <ClassicLayout
        title="Story List"
        backButton
        content={
          <ErrorDisplay
            title="Failed to load iteration"
            message="Could not fetch the iteration details. Please try again."
            onRetry={refetch}
            retryText="Retry"
          />
        }
      />
    );
  }

  return (
    <ClassicLayout
      title="Story List"
      backButton
      content={
        <Card>
          <CardContent className="overflow-x-auto flex flex-col gap-3">
            <FormProvider {...form}>
              <form>
                <AsyncCombobox
                  key={`user-filter-${user_id || "none"}`}
                  name="name"
                  formLabel="Assign to"
                  control={control}
                  endpoint="/users"
                  dataKey="users"
                  labelField="fullname"
                  valueField="id"
                  placeholder="Select user"
                  searchPlaceholder="Search users..."
                  onPostChange={handleSubmit(onSubmit)}
                  readonly={isLoading}
                />
              </form>
            </FormProvider>

            <Tabs
              defaultValue={tab}
              value={tab}
              onValueChange={(value) => {
                navigate({
                  to: "/iteration/$iterationId/story",
                  params: { iterationId },
                  search: {
                    tab: value as StoryTab,
                    user_id: user_id,
                  },
                  replace: true,
                });
              }}
            >
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value={StoryTab.STORY}>Stories</TabsTrigger>
                <TabsTrigger value={StoryTab.ISSUES}>Issues</TabsTrigger>
              </TabsList>

              <TabsContent value={StoryTab.STORY}>
                <StoryList iterationId={iterationId} user_id={user_id} />
              </TabsContent>

              <TabsContent value={StoryTab.ISSUES}>
                <IssueListView iterationId={iterationId} user_id={user_id} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      }
    />
  );
}

// const ProtectedStoryManagement = withFeatureGuard(StoryListing, "iteration");

export const Route = createFileRoute("/_app/iteration/$iterationId/story")({
  component: StoryListing,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      tab: (search.tab as StoryTab) || StoryTab.STORY,
      user_id: search.user_id ? (search.user_id as number) : undefined,
    };
  },
});
