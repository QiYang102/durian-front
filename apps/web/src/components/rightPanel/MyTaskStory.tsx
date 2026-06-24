import { getIncompleteStory, listIterations } from "@ttm/api";
import { useSession } from "@ttm/context";
import { Loading } from "@/components/ui/Loading";
import { Text } from "@/components/ui/Text";
import { Card, CardContent } from "@/components/ui/Card";
import {
  defaultPriorityOption,
  PriorityTypeOption,
  Story,
} from "@ttm/api/types/models/story";
import ErrorDisplay from "../ui/ErrorDisplay";
import { Clipboard, FolderOpen } from "lucide-react";
import { formatId, truncateText } from "@ttm/utils";
import { Link } from "@tanstack/react-router";
import { StoryPriority } from "@ttm/api/types/enums";
import { useScrollTracking, useTaskEmptyState } from "../Telemetry";

export default function MyTaskStory() {
  const session = useSession();
  const currentUser = session.user;
  const teamId = localStorage.getItem("teamId");
  const today = new Date().toISOString().split("T")[0];

  if (!teamId) {
    return (
      <div className="text-sm p-4 text-gray-700">
        ⚠️ Please check in to a team first.
      </div>
    );
  }

  const {
    data: iterationData,
    isLoading: isLoadingIteration,
    isError: isIterationError,
    refetch,
  } = listIterations(["latest-iteration", teamId, today], {
    filter: {
      team: teamId,
    },
    params: {
      per_page: 1,
      "start_date.lte": today,
      "end_date.gte": today,
      // ordering: "-id",
    },
  });

  const { iterations } = iterationData || {};
  const latestIteration =
    iterations && iterations.length > 0 ? iterations[0] : null;

  const {
    data,
    isLoading: isLoadingStories,
    isError: isStoriesError,
  } = getIncompleteStory(
    [
      "my-task-stories",
      currentUser?.id?.toString() || "",
      latestIteration?.id?.toString() || "",
    ],
    {
      params: {
        user: currentUser?.id,
        iteration: latestIteration?.id,
      },
      include: ["project.*"],
    },
    { project: "projects" },
    {
      enabled: !!currentUser?.id && !!latestIteration?.id,
    },
  );

  const stories = data?.stories || [];

  const { showEasterEgg } = useTaskEmptyState(stories.length);
  const { handleScroll, ScrollMessage } = useScrollTracking();

  if (isLoadingIteration || isLoadingStories) {
    return (
      <Card>
        <CardContent>
          <Loading
            showText
            text="Loading your tasks..."
            size="lg"
            className="items-center justify-center"
          />
        </CardContent>
      </Card>
    );
  }

  if (isIterationError || isStoriesError) {
    return (
      <ErrorDisplay
        title="Failed to load tasks"
        message="We couldn't load the tasks data. Please check your connection and try again."
        onRetry={() => {
          refetch();
        }}
        retryText="Reload Data"
      />
    );
  }

  if (!latestIteration) {
    return (
      <Card>
        <CardContent>
          <div className="text-center py-12">
            <Text variant="caption" color="gray">
              No active iteration found for this team.
            </Text>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (stories.length === 0) {
    return (
      <Card>
        <CardContent>
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Clipboard className="mx-auto h-12 w-12" />
            </div>
            <Text variant="caption" color="gray">
              You have no incomplete tasks.
            </Text>
            <p className="text-xs text-gray-400">
              Great job! All your tasks are complete.
            </p>

            {showEasterEgg && (
              <div className="mt-4 animate-bounce">
                <p className="text-sm font-bold text-purple-600">
                  🎮 Free time! Built by PX & JY 🎮
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-xs">
      <div
        className="space-y-2 max-h-screen overflow-y-auto no-scrollbar"
        onScroll={handleScroll}
      >
        {stories.map((story: Story) => {
          const priorityData =
            PriorityTypeOption.get(story.priority as StoryPriority) ??
            defaultPriorityOption;
          const { styles: priorityStyles, icon: PriorityIcon } = priorityData;

          return (
            <Link
              key={story.id}
              to="/story/$storyId"
              params={{ storyId: story.id.toString() }}
            >
              <Card
                className={`hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden flex flex-col mb-3`}
                style={{
                  border: priorityStyles.borderWidth
                    ? `${priorityStyles.borderWidth} solid ${priorityStyles.borderColor}`
                    : undefined,
                }}
              >
                <div
                  className={`px-3 py-2 flex items-center justify-between`}
                  style={{
                    backgroundColor: priorityStyles.accentBarColor,
                    borderBottom: priorityStyles.borderBottomColor
                      ? `1px solid ${priorityStyles.borderBottomColor}`
                      : undefined,
                  }}
                >
                  <Text variant="caption" className="text-slate-800 font-bold">
                    {formatId(story.id)}
                  </Text>
                  {story.priority && (
                    <div
                      className="transition-all duration-200 cursor-pointer hover:scale-110"
                      title={`Priority: ${priorityData.name}`}
                    >
                      <PriorityIcon
                        className={`w-4 h-4 ${priorityStyles.textColor}`}
                        strokeWidth={2.5}
                      />
                    </div>
                  )}
                </div>

                <CardContent className="px-3 py-3 flex-grow">
                  {story.project && (
                    <div className="flex items-center gap-2 uppercase">
                      <FolderOpen className="h-3 w-3  text-blue-700" />
                      <Text className="text-xs text-gray-800 font-medium uppercase tracking-wide">
                        {story.project.name}
                      </Text>
                    </div>
                  )}
                  <Text
                    variant="caption"
                    className="font-bold mb-1.5 line-clamp-2 text-sm"
                  >
                    {truncateText(story.name || "Story Name", 28)}
                  </Text>
                  <Text
                    variant="caption"
                    className="text-slate-600 leading-relaxed line-clamp-2 text-xs"
                  >
                    {truncateText(story.short_description, 80)}
                  </Text>
                </CardContent>
              </Card>
            </Link>
          );
        })}

        <ScrollMessage />
      </div>
    </div>
  );
}
