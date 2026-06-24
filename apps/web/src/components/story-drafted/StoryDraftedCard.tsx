import { useNavigate } from "@tanstack/react-router";
import { Story } from "@ttm/api/types/models/story";
import { formatDate } from "@ttm/utils";
import { Card, CardContent } from "@/components/ui/Card";
import { Text } from "../ui/Text";
import ErrorDisplay from "../ui/ErrorDisplay";
import { Loading } from "../ui/Loading";
import { FolderOpen, Clock, AlertCircle } from "lucide-react";
import moment from "moment";
import { useDynamicGetList } from "@ttm/api";
import { useEffect, useMemo } from "react";
import { Meta } from "@ttm/api/types";
import { Project } from "@ttm/api/types/models/project";

import { useInView } from "react-intersection-observer";

interface StoryDraftedCardProps {
  searchValue?: string;
  projectFilter?: string;
}

const StoryDraftedCard = ({
  searchValue,
  projectFilter,
}: StoryDraftedCardProps) => {
  const navigate = useNavigate();
  const { ref, inView } = useInView();
  const checkedInTeamId = localStorage.getItem("teamId");
  const queryKey = [
    "all-stories",
    searchValue || "",
    projectFilter || "",
    checkedInTeamId || "",
  ];

  const STALE_DAYS_THRESHOLD = parseInt(
    import.meta.env.VITE_STORY_STALE_DAYS || "3",
    10,
  );

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useDynamicGetList(
    "/stories",
    queryKey,
    {
      sort: ["-id"],
      per_page: 10,
      search: searchValue ? searchValue.trim() : "",
      filter: {
        status: "draft",
        team: checkedInTeamId ?? "",
        project: projectFilter ?? "",
      },
      include: ["project.*"],
    },
    { project: "projects" },
  );

  const stories = useMemo(() => {
    if (!data) return [];

    return (
      (data.pages as unknown as {
        projects: Project[];
        stories: Story[];
        meta: Meta[];
      }[]) || []
    )
      .flatMap((page) => page.stories)
      .filter(Boolean);
  }, [data]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const handleScroll = (event: any) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    const threshold = 100;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    if (hasNextPage && !isFetchingNextPage && distanceFromBottom <= threshold) {
      fetchNextPage();
    }
  };

  const isStaleStory = (createDate: string): boolean => {
    const daysDiff = moment().diff(moment(createDate), "days");
    return daysDiff > STALE_DAYS_THRESHOLD;
  };

  const navigateToStory = (story: Story) => {
    navigate({
      to: "/story-drafted/$storyId",
      params: { storyId: story.id.toString() },
    });
  };

  const renderContent = () => {
    if (!checkedInTeamId) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="text-danger-500 h-16 w-16" />
          <div className="space-y-2 text-center">
            <Text variant="h3">Team Check-In Required</Text>
            <div>
              <Text variant="default" className="text-gray-500">
                Please check in to a team from the sidebar to view draft
                stories.
              </Text>
            </div>
          </div>
        </div>
      );
    }

    if (isLoading) {
      return (
        <Card>
          <CardContent>
            <Loading size="md" showText text="Loading story details..." />
          </CardContent>
        </Card>
      );
    }

    if (isError) {
      return (
        <ErrorDisplay
          title="Error Loading Stories"
          message="We encountered an error while loading the stories. Please try again."
          onRetry={refetch}
          retryText="Reload Data"
        />
      );
    }

    if (!stories || stories.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <FolderOpen className="h-16 w-16 text-gray-400 mb-4" />
          <Text variant="default" color="gray" size="lg">
            No stories found
          </Text>
        </div>
      );
    }

    return (
      <div className="w-full h-full overflow-y-auto">
        <div className="@container">
          <div
            className="grid grid-cols-1 @sm:grid-cols-2 @3xl:grid-cols-3 @6xl:grid-cols-4 gap-4 p-3 no-scrollbar"
            style={{ maxHeight: "80vh", overflowY: "auto" }}
          >
            {stories.map((story) => {
              const isStale = isStaleStory(story.create_at);

              return (
                <Card
                  key={`story-${story.id}`}
                  className={`
                  hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col 
                  ${
                    isStale
                      ? "border-2 border-danger-400 bg-danger-50/30 hover:border-danger-500"
                      : "border border-gray-200 hover:border-gray-300"
                  }
                `}
                  onClick={() => navigateToStory(story)}
                >
                  <CardContent className="p-4 flex flex-col h-full min-h-[200px]">
                    <div className="flex flex-col space-y-4 flex-grow">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 uppercase">
                          <FolderOpen
                            className={`h-3.5 w-3.5 ${isStale ? "text-danger-600" : "text-blue-700"}`}
                          />
                          <Text
                            variant="h4"
                            className={` ${
                              isStale ? "text-danger-700 font-semibold" : ""
                            }`}
                          >
                            {story.project?.name || "-"}
                          </Text>
                        </div>
                        <Text
                          variant="macro"
                          className={`font-medium ${isStale ? "text-danger-700" : "text-gray-600"}`}
                        >
                          {moment(story.create_at).fromNow()}
                        </Text>
                      </div>

                      <div>
                        <Text
                          variant="h4"
                          color="black"
                          className="mb-2 leading-tight line-clamp-2"
                        >
                          {story.name || "-"}
                        </Text>
                      </div>

                      <div>
                        <Text
                          variant="default"
                          color="card"
                          className="text-xs leading-snug line-clamp-2"
                          dangerouslySetInnerHTML={{
                            __html: story.short_description || "-",
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 pt-3 mt-auto">
                      <Clock
                        className={`h-3.5 w-3.5 ${isStale ? "text-danger-600" : "text-gray-500"}`}
                      />
                      <Text
                        variant="macro"
                        className={` ${
                          isStale
                            ? "text-danger-700 font-medium"
                            : "text-gray-500"
                        }`}
                      >
                        Created since {formatDate(story.create_at)}
                      </Text>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            <div ref={ref} className="col-span-full p-4 flex justify-center">
              {isFetchingNextPage && (
                <Loading size="sm" showText text="Loading more..." />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return <div className="w-full">{renderContent()}</div>;
};

export default StoryDraftedCard;
