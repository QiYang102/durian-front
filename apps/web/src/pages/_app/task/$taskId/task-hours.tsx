import { createFileRoute } from "@tanstack/react-router";
import { ClassicLayout } from "@/components/ui/ClassicLayout";
import { getSingleTask } from "@ttm/api";
import { Card, CardContent } from "@/components/ui/Card";
import { Loading } from "@/components/ui/Loading";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import TaskHourList from "@/components/task/TaskHourList";

function TaskHoursPage() {
  const { taskId } = Route.useParams();

  const { data, isLoading, isError, refetch } = getSingleTask(
    ["task-detail", taskId],
    Number(taskId),
    {},
  );

  const task = data?.task;

  if (isLoading) {
    return (
      <ClassicLayout
        title="Task Hours"
        backButton
        content={
          <Card>
            <CardContent>
              <Loading
                showText
                text="Loading task..."
                size="lg"
                className="items-center justify-center"
              />
            </CardContent>
          </Card>
        }
      />
    );
  }

  if (isError || !task) {
    return (
      <ClassicLayout
        title="Task Hours"
        backButton
        content={
          <ErrorDisplay
            title="Failed to load task"
            message="Could not fetch the task details. Please try again."
            onRetry={refetch}
            retryText="Retry"
          />
        }
      />
    );
  }

  return (
    <ClassicLayout
      title={`#${taskId} ${task.description} - Task Hours`}
      backButton
      content={
        <Card>
          <CardContent className="overflow-x-auto">
            <TaskHourList />
          </CardContent>
        </Card>
      }
    />
  );
}

export const Route = createFileRoute("/_app/task/$taskId/task-hours")({
  component: TaskHoursPage,
});