import { useEffect, useState } from "react";

import { CalendarRange, Sun } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ClassicLayout } from "@/components/ui/ClassicLayout";
import { createFileRoute } from "@tanstack/react-router";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import { Loading } from "@/components/ui/Loading";
import { MyTaskDisplay } from "@/components/my-task/MyTaskDisplay";
import TeamCheckInRequired from "@/components/TeamCheckInRequired";
import { useGetCapacityReport } from "@ttm/api";
import { useSession } from "@ttm/context";
import { AsyncCombobox } from "@/components/ui/AsyncCombobox";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

const schema = z.object({
  iteration: z.number(),
});

type MyTaskSchema = z.infer<typeof schema>;

export default function MyTaskPage() {
  const [viewMode, setViewMode] = useState<"daily" | "weekly">("daily");
  const { user } = useSession();
  const teamId = localStorage.getItem("teamId");

  const form = useForm<MyTaskSchema>({
    resolver: zodResolver(schema),
  });

  const { control, handleSubmit, setValue, watch } = form;
  const selectedIteration = watch("iteration");

  const { data, isLoading, isFetching, isRefetching, isError, refetch } =
    useGetCapacityReport(
      [
        user?.id?.toString() ?? "",
        viewMode,
        teamId ? teamId.toString() : "",
        selectedIteration ? selectedIteration.toString() : "",
      ],
      {
        team_id: teamId ?? "",
        period: viewMode,
        ...(selectedIteration && { iteration: selectedIteration }),
      },
    );

  const capacityReportData = data;

  useEffect(() => {
    if (data?.iteration && !selectedIteration) {
      setValue("iteration", data.iteration);
    }
  }, [data?.iteration, setValue, selectedIteration]);

  console.log(capacityReportData);

  const handleIterationChange = (value: number) => {
    setValue("iteration", value);
  };

  if (!teamId) {
    return <TeamCheckInRequired />;
  }

  const renderContent = () => {
    if (isLoading || isFetching || isRefetching) {
      return (
        <Card className="flex flex-1 justify-center items-center">
          <CardContent>
            <Loading size="md" showText text="Loading task details..." />
          </CardContent>
        </Card>
      );
    }

    if (isError || !capacityReportData) {
      return (
        <ErrorDisplay
          title="Error Loading Task Details"
          message="We encountered an error while loading the task. Please try again."
          onRetry={refetch}
          retryText="Reload Data"
        />
      );
    }

    return (
      <>
        {viewMode === "weekly" && (
          <Card>
            <CardContent>
              <FormProvider {...form}>
                <AsyncCombobox
                  name="iteration"
                  formLabel="Iteration"
                  control={control}
                  endpoint={`/iterations?filter{team}=${teamId}`}
                  dataKey="iterations"
                  labelField="name"
                  valueField="id"
                  placeholder="Select iteration"
                  searchPlaceholder="Search iterations..."
                  onPostChange={handleIterationChange}
                  readonly={isLoading}
                />
              </FormProvider>
            </CardContent>
          </Card>
        )}
        <MyTaskDisplay
          capacityReportData={capacityReportData}
          viewMode={viewMode}
        />
      </>
    );
  };

  return (
    <ClassicLayout
      title="My Task"
      actionButton={
        <div className="flex border border-gray-300 rounded-md overflow-hidden">
          <Button
            variant={viewMode === "daily" ? "default" : "ghost"}
            onClick={() => setViewMode("daily")}
            className="rounded-none border-r"
          >
            <Sun className="w-4 h-4 mr-2" />
            Daily View
          </Button>
          <Button
            variant={viewMode === "weekly" ? "default" : "ghost"}
            onClick={() => setViewMode("weekly")}
            className="rounded-none"
          >
            <CalendarRange className="w-4 h-4 mr-2" />
            Weekly View
          </Button>
        </div>
      }
      content={renderContent()}
    />
  );
}

export const Route = createFileRoute("/_app/my-task/")({
  component: MyTaskPage,
});
