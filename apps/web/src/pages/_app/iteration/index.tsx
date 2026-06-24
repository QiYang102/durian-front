import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { listIterations, useDeleteIteration, useEditIteration } from "@ttm/api";
import { ClassicLayout } from "@/components/ui/ClassicLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Loading } from "@/components/ui/Loading";
import ErrorDisplay from "@/components/ui/ErrorDisplay";

import {
  ArrowBigRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  List,
  ListIcon,
  Plus,
  Trash2,
} from "lucide-react";

import { CapacityBurndownChart } from "@/components/iteration/CapacityBurndownChart";
import { ProjectPieChart } from "@/components/iteration/ProjectPieChart";
import { LeaveSummary } from "@/components/iteration/LeaveSummary";
import { Text } from "@/components/ui/Text";
import { toast } from "sonner";
import {
  IterationStatus,
  IterationStatusOption,
} from "@ttm/api/types/models/iteration";
import { formatDisplayDate } from "@ttm/utils";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ProjectStoryReporting } from "@/components/iteration/ProjectStoryReporting";
import TeamCheckInRequired from "@/components/TeamCheckInRequired";
import { RocketTable } from "@/components/iteration/RocketTable";
import { z } from "zod";
import { HoursBurnDownChart } from "@/components/iteration/HoursBurnDownChart";

function WeeklyIterationPage() {
  const { date: currentDate } = Route.useSearch();
  const navigate = useNavigate();
  const teamId = localStorage.getItem("teamId");

  // const [currentDate, setCurrentDate] = useState(
  //   new Date().toISOString().split("T")[0],
  // );

  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [confirmCompleteDialogOpen, setConfirmCompleteDialogOpen] =
    useState(false);

  const {
    data: filteredData,
    isLoading,
    isError,
    refetch,
  } = listIterations(
    ["weekly-iteration", teamId, currentDate],
    {
      filter: {
        team: teamId,
        "start_date.lte": currentDate,
        "end_date.gte": currentDate,
      },
    },
    {},
  );

  const iteration = filteredData?.iterations?.[0];

  const deleteIteration = useDeleteIteration({
    onSuccess: () => {
      toast.success("Iteration has been deleted successfully");

      setConfirmDeleteDialogOpen(false);
      refetch();
    },
    onError: () => {
      toast.error("Failed to delete iteration. Please try again.");

      setConfirmDeleteDialogOpen(false);
    },
  });

  const editIteration = useEditIteration({
    onSuccess: () => {
      toast.success("Iteration marked as complete");

      refetch();
    },
    onError: () => {
      toast.error("Failed to update iteration status. Please try again.");
    },
  });

  const handleDeleteIteration = () => {
    if (!iteration?.id) return;

    setConfirmDeleteDialogOpen(false);

    deleteIteration.mutate(String(iteration.id));
  };

  const handleMarkAsComplete = () => {
    if (!iteration?.id) return;

    setConfirmCompleteDialogOpen(false);

    editIteration.mutate({
      id: String(iteration.id),
      name: iteration.name,
      team: iteration.team,
      start_date: iteration.start_date,
      end_date: iteration.end_date,
      status: IterationStatus.STATUS_COMPLETE,
    });
  };

  const handlePreviousWeek = () => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - 7);
    navigate({
      params: {},
      search: { date: date.toISOString().split("T")[0] },
    });
  };

  const handleNextWeek = () => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + 7);
    navigate({
      params: {},
      search: { date: date.toISOString().split("T")[0] },
    });
  };

  const handleNavigateToIterationList = () => {
    navigate({ to: "/iteration/list" });
  };

  const handleNavigateToStoryList = () => {
    navigate({
      to: "/iteration/$iterationId/story",
      params: { iterationId: String(iteration?.id) },
      search: { date: currentDate },
    });
  };

  const handleAddIteration = () => {
    navigate({
      to: "/iteration/new",
    });
  };

  if (!teamId) {
    return <TeamCheckInRequired />;
  }

  if (isLoading) {
    return (
      <ClassicLayout
        title="Iteration"
        content={
          <Card>
            <CardContent className="min-h-screen p-8">
              <Loading
                showText
                text="Loading iteration data..."
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
        title="Iteration"
        content={
          <ErrorDisplay
            title="Error Loading Iteration"
            message="We encountered an error while loading the iteration. Please try again."
            onRetry={refetch}
            retryText="Reload Data"
          />
        }
      />
    );
  }

  if (!iteration) {
    return (
      <ClassicLayout
        title="Iteration"
        actionButton={
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleNavigateToIterationList}
            >
              <List className="w-4 h-4 mr-2" />
              View All Iterations
            </Button>

            <Button onClick={handleAddIteration}>
              <Plus className="w-4 h-4 mr-2" />
              Create New Iteration
            </Button>
          </div>
        }
        content={
          <Card>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePreviousWeek}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>

                  <Text className="text-sm text-gray-500">
                    Week of {formatDisplayDate(currentDate)}
                  </Text>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNextWeek}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 text-gray-400">
                    <FileText className="mx-auto h-12 w-12" />
                  </div>
                  <Text className="text-lg font-semibold text-gray-700 mb-2">
                    No Iteration Found
                  </Text>
                  <Text className="text-gray-500 mb-6 max-w-md">
                    There is no iteration for this week. Try navigating to a
                    different week or create a new iteration.
                  </Text>
                </div>
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
        title="Iteration"
        actionButton={
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleNavigateToIterationList}>
              <ListIcon className="w-4 h-4 mr-2" />
              View All Iterations
            </Button>
            <Button type="button" onClick={handleNavigateToStoryList}>
              <ArrowBigRight className="w-6 h-6 text-white-400 pr-1" />
              To Story List
            </Button>
          </div>
        }
        content={
          <>
            <Card>
              <CardContent className="flex flex-col gap-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePreviousWeek}
                    className="hidden lg:flex"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>

                  <div className="flex flex-col md:flex-row md:items-center gap-6 flex-1">
                    <div className="space-y-1 flex flex-col">
                      <Text className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Iteration Name
                      </Text>
                      <Text className="font-medium">{iteration.name}</Text>
                    </div>
                    <div className="space-y-1 flex flex-col">
                      <Text className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Duration
                      </Text>
                      <Text className="font-medium">
                        {iteration.start_date
                          ? formatDisplayDate(iteration.start_date)
                          : "-"}
                        {" - "}
                        {iteration.end_date
                          ? formatDisplayDate(iteration.end_date)
                          : "-"}
                      </Text>
                    </div>
                    <div className="space-y-1 flex flex-col">
                      <Text className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Status
                      </Text>
                      <Badge
                        className="truncate"
                        color={
                          IterationStatusOption.get(iteration.status || "")
                            ?.chipVariant
                        }
                      >
                        {
                          IterationStatusOption.get(iteration.status || "")
                            ?.chipTextVariant
                        }
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    <Button
                      variant="outline"
                      onClick={() => setConfirmCompleteDialogOpen(true)}
                      disabled={
                        iteration.status === IterationStatus.STATUS_COMPLETE ||
                        editIteration.isPending
                      }
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Mark as Complete
                    </Button>

                    <Button
                      variant="destructive"
                      onClick={() => setConfirmDeleteDialogOpen(true)}
                      disabled={deleteIteration.isPending}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNextWeek}
                    className="hidden lg:flex"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex lg:hidden gap-3 justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePreviousWeek}
                    className="flex-1"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous Week
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleNextWeek}
                    className="flex-1"
                  >
                    Next Week
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                <LeaveSummary
                  iterationId={String(iteration.id)}
                  startDate={iteration.start_date || ""}
                  endDate={iteration.end_date || ""}
                />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1">
              <CapacityBurndownChart iterationId={String(iteration.id)} />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <HoursBurnDownChart iterationId={String(iteration.id)} />
              <ProjectPieChart iterationId={String(iteration.id)} />
            </div>

            <ProjectStoryReporting
              iterationId={String(iteration.id)}
              teamId={String(iteration.team)}
            />

            <RocketTable
              iterationId={String(iteration.id)}
              teamId={String(iteration.team)}
            />
          </>
        }
      />

      <ConfirmDialog
        isOpen={confirmDeleteDialogOpen}
        onClose={() => setConfirmDeleteDialogOpen(false)}
        onConfirm={handleDeleteIteration}
        title="Confirm Deletion"
        content="Are you sure you want to delete this iteration? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />

      <ConfirmDialog
        isOpen={confirmCompleteDialogOpen}
        onClose={() => setConfirmCompleteDialogOpen(false)}
        onConfirm={handleMarkAsComplete}
        title="Mark as Complete"
        content="Are you sure you want to mark this iteration as complete?"
        confirmText="Confirm"
        cancelText="Cancel"
      />
    </>
  );
}

export const Route = createFileRoute("/_app/iteration/")({
  component: WeeklyIterationPage,
  validateSearch: z.object({
    date: z.string().optional().default(new Date().toISOString().split("T")[0]),
  }),
});
