import { getProjectStoryReporting } from "@ttm/api";
import { Loading } from "@/components/ui/Loading";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Text } from "@/components/ui/Text";

interface ProjectStoryReportingProps {
  iterationId: string;
  teamId?: string;
}

export function ProjectStoryReporting({
  iterationId,
  teamId,
}: ProjectStoryReportingProps) {
  const { data, isLoading, isError, refetch } = getProjectStoryReporting(
    [iterationId, teamId || ""],
    { iteration: iterationId, team: teamId },
    { enabled: !!iterationId },
  );

  const reportingData = data?.result;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex h-96 items-center justify-center">
          <Loading
            showText
            text="Loading project reporting..."
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
        title="Error Loading Project Reporting"
        message="We encountered an error while loading the project story reporting."
        onRetry={() => refetch()}
        retryText="Reload Report"
      />
    );
  }

  if (
    !reportingData ||
    !reportingData.data ||
    reportingData.data.length === 0
  ) {
    return (
      <Card>
        <CardContent className="flex h-96 items-center justify-center text-gray-500">
          <Text>No project data available</Text>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle>Project Story Reporting</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold p-4">Project</TableHead>
                <TableHead className="text-right font-semibold p-4">
                  Total Story
                </TableHead>
                <TableHead className="text-right font-semibol0 p-4">
                  Total Estimated Hour
                </TableHead>
                <TableHead className="text-right font-semibold p-4">
                  %
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportingData.data.map((project: any) => (
                <TableRow key={project.project_id}>
                  <TableCell className="font-medium">
                    {project.project_name || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {project.total_story}
                  </TableCell>
                  <TableCell className="text-right">
                    {project.total_estimated_hour.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    {project.percentage.toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))}

              <TableRow className="border-t-2 border-gray-300 bg-gray-50 font-semibold">
                <TableCell className="font-bold">Total</TableCell>
                <TableCell className="text-right font-bold">
                  {reportingData.total.total_story}
                </TableCell>
                <TableCell className="text-right font-bold">
                  {reportingData.total.total_estimated_hour.toFixed(2)}
                </TableCell>
                <TableCell className="text-right font-bold">
                  {reportingData.total.percentage.toFixed(2)}%
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
