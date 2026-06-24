import TagRegistryDetailView from "@/components/tag-registry/TagRegistryDetailView";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { ClassicLayout } from "@/components/ui/ClassicLayout";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import { Loading } from "@/components/ui/Loading";
import { Text } from "@/components/ui/Text";
import { createFileRoute } from "@tanstack/react-router";
import { useGetSingleTag } from "@ttm/api";

function TagRegistryDetail() {
  const { tagId } = Route.useParams();

  const queryKey = ["single-tag", tagId];
  const { data, isLoading, isError, refetch, isFetching } = useGetSingleTag(
    queryKey,
    +tagId,
    { include: ["project.*"] },
    { project: "projects" },
    {},
  );

  const tag = data?.tag;

  const renderContent = () => {
    if (isLoading || isFetching) {
      return (
        <Card>
          <CardContent>
            <Loading size="md" showText text="Loading tag details..." />
          </CardContent>
        </Card>
      );
    }

    if (isError) {
      return (
        <ErrorDisplay
          title="Error Loading Tag Details"
          message="We encountered an error while loading the tag. Please try again."
          onRetry={refetch}
          retryText="Reload Data"
        />
      );
    }

    return (
      <>
        <Card>
          <CardContent className="flex flex-row items-center gap-3">
            <Text variant="h2">{tag?.project.name}</Text>
            <Badge color={tag?.color} className="max-w-fit flex self-end h-7">
              {tag?.name}
            </Badge>
          </CardContent>
        </Card>
        <TagRegistryDetailView tagId={tagId} />
      </>
    );
  };

  return (
    <ClassicLayout
      title="Tag Registry Detail"
      backButton
      content={renderContent()}
    />
  );
}

export const Route = createFileRoute("/_app/tag-registry/$tagId")({
  component: TagRegistryDetail,
});
