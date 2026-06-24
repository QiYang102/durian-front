import { checkCelebration, listStories, useEditStory } from "@ttm/api";
import { Card, CardContent } from "@/components/ui/Card";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import { Loading } from "../ui/Loading";
import { StoryMode, StoryStatus } from "@ttm/api/types/enums";
import StoryCard from "./StoryCard";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import CelebrationMessage from "./CelebrationMessage";
import { toast } from "sonner";
import moment from "moment";

interface TodayCompletedProps {
  bucket: StoryMode;
  iterationId: string;
}

export default function TodayCompleted({
  iterationId,
  bucket,
}: TodayCompletedProps) {
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
      "list-of-today-stories",
      page.toString(),
      perPage.toString(),
      bucket,
      iterationId,
    ],
    {
      page,
      per_page: 20,
      filter: {
        iteration: iterationId,
        "completed_at.gte": moment().startOf("day").toISOString(),
      },
      in: {
        status: statusFilter,
      },
      include: ["project.*"],
    },
    { project: "projects" },
  );

  console.log(moment().startOf("day").toISOString());

  const editStory = useEditStory({
    onSuccess: () => {
      toast.success("Deployment status has been updated successfully");
    },
    onError: () => {
      toast.error("Failed to update deployment status. Please try again.");
    },
  });

  const { data: celebrationData } = checkCelebration(
    ["checkCelebration", bucket, iterationId],
    {
      params: { iteration: iterationId },
    },
  );

  const { stories, meta } = data || {};

  const handleToggleDeploy = (storyId: number, currentStatus: boolean) => {
    editStory.mutate({
      id: storyId.toString(),
      is_needed_to_deploy: !currentStatus,
    });
  };

  const isFridayOrLater = moment().weekday() > 5;
  const shouldCelebrate =
    (celebrationData?.should_celebrate && isFridayOrLater) || false;

  // Hide component completely if no stories today
  if (!stories || stories.length === 0) {
    return null;
  }

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
        onRetry={refetch}
        retryText="Reload Data"
      />
    );
  }

  return (
    <div className="@container">
      <h2 className="text-xl font-semibold mb-4">Completed Recently</h2>
      <div className="grid grid-cols-1 @sm:grid-cols-2 @3xl:grid-cols-3 @6xl:grid-cols-4 gap-4 auto-rows-fr">
        {stories.map((story) => (
          <Link
            key={`today-${story.id}`}
            to="/story/$storyId"
            params={{ storyId: story.id.toString() }}
          >
            <StoryCard story={story} onToggleDeploy={handleToggleDeploy} />
          </Link>
        ))}
      </div>
      {shouldCelebrate && (
        <CelebrationMessage variant="banner" className="mt-4" />
      )}
      <hr className="mt-6" />
    </div>
  );
}
