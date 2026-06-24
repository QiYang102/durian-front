import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import {
  getSingleIteration,
  useDeleteIteration,
  useEditIteration,
} from "@ttm/api";
import { ClassicLayout } from "@/components/ui/ClassicLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { toast } from "sonner";
import { Loading } from "@/components/ui/Loading";
import ErrorDisplay from "@/components/ui/ErrorDisplay";

// import withFeatureGuard from "@/components/guard/guard";

import { ArrowBigRight, CheckCircle2, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  IterationStatus,
  IterationStatusOption,
} from "@ttm/api/types/models/iteration";
import { CapacityBurndownChart } from "@/components/iteration/CapacityBurndownChart";
import { ProjectPieChart } from "@/components/iteration/ProjectPieChart";
import { formatDate } from "@ttm/utils";
import { Badge } from "@/components/ui/Badge";
import { Text } from "@/components/ui/Text";
import { LeaveSummary } from "@/components/iteration/LeaveSummary";
import { ProjectStoryReporting } from "@/components/iteration/ProjectStoryReporting";

function IterationDetail() {
  const { iterationId } = Route.useParams();
  const navigate = useNavigate();

  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [confirmCompleteDialogOpen, setConfirmCompleteDialogOpen] =
    useState(false);

  const { data, isLoading, isError, refetch } = getSingleIteration(
    ["iteration-detail", iterationId],
    parseInt(iterationId),
    {},
    {},
  );

  const iteration = data?.iteration;

  const deleteIteration = useDeleteIteration({
    onSuccess: () => {
      toast.success("Iteration has been deleted successfully");
      setConfirmDeleteDialogOpen(false);
      navigate({ to: "/iteration" });
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

    deleteIteration.mutate(String(iteration?.id));
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

  const handleNavigateToStoryList = () => {
    navigate({
      to: "/iteration/$iterationId/story",
      params: { iterationId: iterationId },
    });
  };

  const renderContent = () => {
    if (isLoading && !iteration) {
      return (
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
      );
    }

    if (isError || !iteration) {
      return (
        <ErrorDisplay
          title="Error Loading Iteration"
          message="We encountered an error while loading the iteration. Please try again."
          onRetry={() => {
            refetch();
          }}
          retryText="Reload Data"
        />
      );
    }

    return (
      <div className="flex flex-col gap-6">
        <Card>
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
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
                      ? formatDate(iteration.start_date)
                      : "-"}
                    {" - "}
                    {iteration.end_date ? formatDate(iteration.end_date) : "-"}
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
            </div>

            <LeaveSummary
              iterationId={String(iteration.id)}
              startDate={iteration.start_date || ""}
              endDate={iteration.end_date || ""}
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <CapacityBurndownChart iterationId={String(iteration.id)} />

          <ProjectPieChart iterationId={String(iteration.id)} />
        </div>

        <ProjectStoryReporting
          iterationId={String(iteration.id)}
          teamId={String(iteration.team)}
        />
      </div>
    );
  };

  return (
    <>
      <ClassicLayout
        title="Iteration Details"
        backButton
        actionButton={
          <div className="flex gap-3">
            <Button type="button" onClick={handleNavigateToStoryList}>
              <ArrowBigRight className="w-6 h-6 text-white-400 pr-1" />
              To Story List
            </Button>
          </div>
        }
        content={renderContent()}
      />

      <ConfirmDialog
        isOpen={confirmDeleteDialogOpen}
        onClose={() => setConfirmDeleteDialogOpen(false)}
        onConfirm={() => {
          handleDeleteIteration();
        }}
        title="Confirm Deletion"
        content="Are you sure you want to delete this iteration? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />

      <ConfirmDialog
        isOpen={confirmCompleteDialogOpen}
        onClose={() => setConfirmCompleteDialogOpen(false)}
        onConfirm={() => {
          handleMarkAsComplete();
        }}
        title="Mark as Complete"
        content="Are you sure you want to mark this iteration as complete?"
        confirmText="Confirm"
        cancelText="Cancel"
      />
    </>
  );
}

// const ProtectedIterationManagement = withFeatureGuard(IterationDetail, "iteration");

export const Route = createFileRoute("/_app/iteration/$iterationId/")({
  component: IterationDetail,
});
