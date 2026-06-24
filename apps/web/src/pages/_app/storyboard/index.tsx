import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { ClassicLayout } from "@/components/ui/ClassicLayout";
import StoryboardCardView from "@/components/storyboard/Storyboard";
import StoryboardListView from "@/components/storyboard/StoryboardListView";
import StoryboardCompletedListView from "@/components/storyboard/StoryboardCompletedListView";
import TodayCompleted from "@/components/storyboard/TodayCompleted";
import TodayCompletedListView from "@/components/storyboard/TodayCompletedListView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { StoryMode } from "@ttm/api/types/enums";
import { Card, CardContent } from "@/components/ui/Card";
import { getStoryboardCounts, listIterations } from "@ttm/api";
import { Loading } from "@/components/ui/Loading";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { Plus, LayoutGrid, List, FileText, CalendarDays } from "lucide-react";
import TeamCheckInRequired from "@/components/TeamCheckInRequired";
import { Text } from "@/components/ui/Text";
import IssueListView from "@/components/storyboard/IssueListView";
import moment from "moment";
import MarqueeComponent from "@/components/storyboard/banner";
import { Dialog, DialogContent } from "@/components/ui/Dialog";

const STATUS = [...Object.values(StoryMode), "issues"];

export default function StoryboardListing() {
  const { bucket = StoryMode.INCOMPLETED } = Route.useSearch();
  const navigate = useNavigate();
  const teamId = localStorage.getItem("teamId");
  const [viewMode, setViewMode] = useState<"card" | "list">(() => {
    const match = document.cookie.match(/storyboard:view=(card|list)/);
    return match ? (match[1] as "card" | "list") : "card";
  });
  const [isThisWeekIteration, setIsThisWeekIteration] = useState(true);

  const today = new Date().toISOString().split("T")[0];
  const startOfWeek = moment().startOf("isoWeek").format("YYYY-MM-DD");
  const endOfWeek = moment().endOf("isoWeek").format("YYYY-MM-DD");

  const isFriday = moment().weekday() === 5;

  const handleViewChange = (mode: "card" | "list") => {
    setViewMode(mode);
    document.cookie = `storyboard:view=${mode}`;
  };

  const handleAddStory = () => {
    navigate({
      to: "/story-drafted/new",
    });
  };

  const getTabLabel = (status: string) => {
    if (status === "issues") {
      return (
        <div className="flex items-center gap-2">
          {/* <Bug className="w-4 h-4" /> */}
          Issues
        </div>
      );
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const { data, isLoading, isError, refetch } = listIterations(
    ["latest-iteration", teamId ? teamId : ""],
    {
      filter: {
        team: teamId ? teamId : "",
      },
      params: {
        per_page: 1,
      },
      sort: ["-id"],
    },
  );

  const { iterations } = data || {};
  const latestIteration =
    iterations && iterations.length > 0 ? iterations[0] : null;

  useEffect(() => {
    if (latestIteration?.end_date) {
      // If today is "2026-02-02" and latest iteration end_date is "2026-02-01", isExpired is true.
      const isExpired = today > latestIteration.end_date;

      if (isExpired) {
        setIsThisWeekIteration(false);
      } else {
        setIsThisWeekIteration(true);
      }
    }
  }, [latestIteration, today]);

  const { data: countsData } = getStoryboardCounts(
    ["story-counts", latestIteration?.id?.toString() || ""],
    {
      params: {
        iteration: latestIteration?.id?.toString(),
      },
    },
    { enabled: !!latestIteration },
  );

  const counts: Record<string, number> = {
    [StoryMode.INCOMPLETED]: countsData?.incompleted || 0,
    [StoryMode.COMPLETED]: countsData?.completed || 0,
    issues: countsData?.issues || 0,
  };

  if (!teamId) {
    return <TeamCheckInRequired />;
  }

  if (isLoading) {
    return (
      <ClassicLayout
        title="Storyboard"
        content={
          <Card>
            <CardContent>
              <Loading
                showText
                text="Loading storyboard..."
                size="lg"
                className="items-center justify-center"
              />
            </CardContent>
          </Card>
        }
      />
    );
  }

  if (isError) {
    return (
      <ClassicLayout
        title="Storyboard"
        content={
          <ErrorDisplay
            title="Failed to load iteration"
            message="Could not fetch the latest iteration. Please try again."
            onRetry={refetch}
            retryText="Retry"
          />
        }
      />
    );
  }

  if (!latestIteration) {
    return (
      <ClassicLayout
        title="Storyboard"
        content={
          <Card>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 text-gray-400">
                  <FileText className="mx-auto h-12 w-12" />
                </div>
                <Text className="text-lg font-semibold text-gray-700 mb-2">
                  No Iteration Found
                </Text>
                <Text className="text-gray-500 mb-6 max-w-md">
                  No iteration created yet. Please create an iteration to manage
                  your stories.
                </Text>
                <Button onClick={() => navigate({ to: "/iteration/new" })}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Iteration
                </Button>
              </div>
            </CardContent>
          </Card>
        }
      />
    );
  }

  return (
    <>
      <ClassicLayout
        title="Storyboard"
        actionButton={
          <div className="flex gap-3">
            {bucket !== "issues" && (
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <Button
                  variant={viewMode === "card" ? "default" : "ghost"}
                  onClick={() => handleViewChange("card")}
                  className="rounded-none border-r"
                >
                  <LayoutGrid className="w-4 h-4 mr-2" />
                  Card
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  onClick={() => handleViewChange("list")}
                  className="rounded-none"
                >
                  <List className="w-4 h-4 mr-2" />
                  List
                </Button>
              </div>
            )}

            <Button onClick={handleAddStory}>
              <Plus className="w-4 h-4 mr-2" />
              Create New Story
            </Button>
          </div>
        }
        content={
          <div className="flex flex-col gap-6 sm:gap-3">
            {isFriday && <MarqueeComponent />}

            <Card>
              <CardContent className="overflow-x-auto">
                <Tabs defaultValue={bucket} className="flex flex-col gap-3">
                  <div className="relative w-full">
                    <TabsList className="flex flex-row w-full gap-3 sm:grid sm:grid-cols-5 sm:gap-0 md:grid-cols-5">
                      {STATUS.map((status) => (
                        <TabsTrigger
                          key={status}
                          value={status}
                          onClick={() =>
                            navigate({
                              to: "/storyboard",
                              search: { bucket: status },
                              replace: true,
                            })
                          }
                        >
                          {getTabLabel(status)}
                          <span className="ml-2 bg-gray-100 rounded-full px-2 py-0.5 text-xs font-bold">
                            {counts[status] || 0}
                          </span>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>

                  <TabsContent value={bucket}>
                    {bucket === "issues" ? (
                      <IssueListView
                        key={bucket}
                        iterationId={latestIteration.id.toString()}
                      />
                    ) : viewMode === "card" ? (
                      <div className="flex flex-col gap-6 shadow-sm">
                        {bucket === StoryMode.COMPLETED && (
                          <>
                            <TodayCompleted
                              key={`today-${bucket}`}
                              bucket={bucket}
                              iterationId={latestIteration.id.toString()}
                            />
                          </>
                        )}
                        <StoryboardCardView
                          key={bucket}
                          bucket={bucket}
                          iterationId={latestIteration.id.toString()}
                        />
                      </div>
                    ) : bucket === StoryMode.COMPLETED ? (
                      <div className="flex flex-col gap-6 shadow-sm">
                        <TodayCompletedListView
                          key={`todayList-${bucket}`}
                          iterationId={latestIteration.id.toString()}
                        />
                        <StoryboardCompletedListView
                          key={`completedList-${bucket}`}
                          iterationId={latestIteration.id.toString()}
                        />
                      </div>
                    ) : (
                      <StoryboardListView
                        key={bucket}
                        bucket={bucket}
                        iterationId={latestIteration.id.toString()}
                      />
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        }
      />

      <Dialog
        open={!isThisWeekIteration}
        onOpenChange={() => setIsThisWeekIteration(true)}
      >
        <DialogContent className="max-h-[90vh] w-[90%] max-w-[600px] overflow-hidden p-0 border-none shadow-2xl">
          <div className="h-1.5 w-full bg-warning-500" />

          <div className="flex flex-col items-center justify-center p-12 px-16 text-center gap-4">
            <div className="flex flex-col justify-center items-center gap-3">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                <CalendarDays className="h-12 w-12" />
              </div>

              <Text className="text-xl font-bold tracking-tight text-gray-800">
                Iteration Date Mismatch
              </Text>
            </div>

            <div className="text-gray-500 leading-relaxed">
              <p className="text-sm">
                This iteration is not from the current week ({startOfWeek} -{" "}
                {endOfWeek}). Please create a new iteration to manage this
                week's stories.
              </p>
            </div>

            <Button
              size="lg"
              className="w-full mt-3 sm:w-auto px-8 shadow-sm hover:shadow-md transition-all"
              onClick={() => {
                setIsThisWeekIteration(false);
                navigate({ to: "/iteration/new" });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Iteration
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// const ProtectedStoryManagement = withFeatureGuard(StoryboardListing, "story");

export const Route = createFileRoute("/_app/storyboard/")({
  component: StoryboardListing,
  // component: ProtectedStoryManagement,
});
