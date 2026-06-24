import { Card, CardContent } from "@/components/ui/Card";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import { Loading } from "../ui/Loading";
import { getUserTaskStatistics } from "@ttm/api";
import { User, Users, Flame, FlaskConical } from "lucide-react";

interface TaskStatisticsCardProps {
  userId?: string | number;
}

export const ReportCard = ({ userId }: TaskStatisticsCardProps) => {
  const { data, isLoading, isError, refetch } = getUserTaskStatistics(
    ["task-statistics", String(userId)],
    {
      user_id: userId,
    },
    {
      enabled: !!userId,
    },
  );

  if (!userId) {
    return (
      <Card>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            <p className="text-sm">User information not available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="flex flex-col flex-1">
        <CardContent className="flex items-center justify-center">
          <Loading size="md" showText text="Loading reports..." />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent>
          <ErrorDisplay
            title="Failed to load task statistics"
            message="We couldn't load the task statistics data. Please try again."
            onRetry={refetch}
            retryText="Reload Statistics"
          />
        </CardContent>
      </Card>
    );
  }

  const stats = data?.result?.[0] || {};

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between py-2">
              <div className="text-center w-full">
                <div className="text-5xl font-semibold">
                  {stats.completed_task_count || 0}
                </div>
                <div className="text-sm">Completed Tasks</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between py-2">
              <div className="text-center w-full">
                <div className="text-5xl font-semibold">
                  {stats.total_hours_committed || 0}
                </div>
                <div className="text-sm">Total Hours Committed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent>
          <div className="text-md font-semibold mb-4">Task breakdown</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-start gap-1 mb-2">
                <User className="w-4 h-4 text-blue-700" />
                <div className="text-sm">Solo</div>
              </div>
              <div className="text-3xl text-center font-semibold text-blue-700">
                {stats.solo_task_count || 0}
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-start gap-1 mb-2">
                <Users className="w-4 h-4 text-cyan-600" />
                <div className="text-sm">Team</div>
              </div>
              <div className="text-3xl text-center font-semibold text-cyan-600">
                {stats.multi_task_count || 0}
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-start gap-1 mb-2">
                <Flame className="w-4 h-4 text-red-700" />
                <div className="text-sm">High Priority</div>
              </div>
              <div className="text-3xl text-center font-semibold text-red-700">
                {stats.priority_task_count || 0}
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-start gap-1 mb-2">
                <FlaskConical className="w-4 h-4 text-fuchsia-700" />
                <div className="text-sm">R&D</div>
              </div>
              <div className="text-3xl text-center font-semibold text-fuchsia-700">
                {stats.rnd_task_count || 0}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
