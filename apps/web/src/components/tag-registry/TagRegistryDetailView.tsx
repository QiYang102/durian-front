import { useGetSingleTagReport } from "@ttm/api";
import TagStoryList from "./TagStoryList";
import TagTotalInfo from "./TagTotalInfo";
import { Card, CardContent } from "../ui/Card";
import ErrorDisplay from "../ui/ErrorDisplay";
import { Loading } from "../ui/Loading";

export default function TagRegistryDetailView({ tagId }: { tagId: string }) {
  const queryKey = ["report", tagId];
  const { data, isLoading, isFetching, isError, refetch } =
    useGetSingleTagReport(queryKey, +tagId, {}, {}, {});

  const result = data?.result;

  if (isLoading || isFetching) {
    return (
      <Card>
        <CardContent>
          <Loading size="md" showText text="Loading tag details..." />
        </CardContent>
      </Card>
    );
  }

  if (isError || !result) {
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TagTotalInfo result={result} />
      </div>
      <div>
        <TagStoryList result={result} />
      </div>
    </>
  );
}
