import { listStories, useEditStory } from "@ttm/api";
import { Card, CardContent } from "@/components/ui/Card";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import { Loading } from "../ui/Loading";
import { StoryMode, StoryStatus } from "@ttm/api/types/enums";
import { Pagination } from "../Pagination";
import StoryCard from "./StoryCard";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import moment from "moment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import { StoryboardEmptyState } from "./StoryBoardEmptyState";

interface StoryboardCardViewProps {
  bucket: StoryMode;
  iterationId: string;
}
export default function StoryboardCardView({
  iterationId,
  bucket,
}: StoryboardCardViewProps) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);

  const getStatusFilter = (bucket: StoryMode) => {
    if (bucket === StoryMode.COMPLETED) {
      return [StoryStatus.COMPLETED];
    } else if (bucket === StoryMode.INCOMPLETED) {
      return [StoryStatus.NEW, StoryStatus.STARTED, StoryStatus.TAKEN];
    }
    return [];
  };

  const statusFilter = getStatusFilter(bucket);

  const { data, isLoading, isError, refetch } = listStories(
    [
      "list-of-stories",
      page.toString(),
      perPage.toString(),
      bucket,
      iterationId,
    ],
    {
      page: page,
      per_page: 20,
      filter: {
        iteration: iterationId,
        ...(bucket === StoryMode.COMPLETED && {
          "completed_at.lte": moment().startOf("day").toISOString(),
        }),
      },
      in: {
        status: statusFilter,
      },
      include: ["project.*"],
    },
    { project: "projects" },
  );

  const editStory = useEditStory({
    onSuccess: () => {
      toast.success("Deployment status has been updated successfully");
    },
    onError: () => {
      toast.error("Failed to update deployment status. Please try again.");
    },
  });

  const { stories, meta } = data || {};

  const handleToggleDeploy = (storyId: number, currentStatus: boolean) => {
    editStory.mutate({
      id: storyId.toString(),
      is_needed_to_deploy: !currentStatus,
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Loading
            showText
            text="Loading stories..."
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
        title="Failed to load stories"
        message="We couldn't load the stories data. Please check your connection and try again."
        onRetry={() => {
          refetch();
        }}
        retryText="Reload Data"
      />
    );
  }

  if (!stories || stories.length === 0) {
    return (
      <StoryboardEmptyState
        bucket={bucket}
        iterationId={iterationId}
      ></StoryboardEmptyState>
    );
  }

  return (
    <div className="@container flex flex-1 flex-col gap-3">
      {bucket === StoryMode.COMPLETED && (
        <h2 className="text-xl font-semibold">Completed</h2>
      )}

      <div className="grid grid-cols-1 @sm:grid-cols-2 @3xl:grid-cols-3 @6xl:grid-cols-4 gap-4 auto-rows-fr">
        {stories.map((story) => (
          <Link
            key={story.id}
            to="/story/$storyId"
            params={{ storyId: story.id.toString() }}
          >
            <StoryCard story={story} onToggleDeploy={handleToggleDeploy} />
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex flex-1 items-center gap-4 text-sm">
          {meta?.total_results} total
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show:</span>
          <Select
            value={perPage.toString()}
            onValueChange={(value) => {
              setPerPage(Number(value));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[70px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-x-2">
          <Pagination
            currentPage={meta?.page}
            totalPages={meta?.total_pages}
            onPageChange={(page) => setPage(page)}
          />
        </div>
      </div>
    </div>
  );
}
