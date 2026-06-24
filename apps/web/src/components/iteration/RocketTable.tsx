import { getFirstUserAchieveEffort } from "@ttm/api";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Loading } from "@/components/ui/Loading";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import { Text } from "@/components/ui/Text";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Drumstick } from "lucide-react";
import { formatDateTime } from "@ttm/utils";

interface RocketTableProps {
  iterationId: string;
  teamId?: string;
}

interface RocketUser {
  fullname: string;
  total_effort: number;
  rocket_at: string | null;
}

export function RocketTable({ iterationId, teamId }: RocketTableProps) {
  const { data, isLoading, isError, refetch } = getFirstUserAchieveEffort(
    [iterationId, teamId || ""],
    { iteration: iterationId, team: teamId },
    { enabled: !!iterationId },
  );

  const reportingData: RocketUser[] = data?.result || [];

  const maxEffort = Math.max(...reportingData.map((u) => u.total_effort));

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex h-96 items-center justify-center">
          <Loading
            showText
            text="Loading rocket table..."
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
        title="Error Loading Rocket Table"
        message="We encountered an error while loading the rocket table."
        onRetry={() => refetch()}
        retryText="Reload Table"
      />
    );
  }

  if (!reportingData || reportingData.length === 0) {
    return (
      <Card>
        <CardContent className="flex h-96 items-center justify-center text-gray-500">
          <Text>No data available</Text>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle>The-Rocket Table</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold p-4">Full Name</TableHead>
                <TableHead className="font-semibold p-4 text-right">
                  Total Effort{" "}
                </TableHead>
                <TableHead className="font-semibold p-4 text-right">
                  Rocket At{" "}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportingData.map((user: any, index: number) => {
                const isTop = user.total_effort === maxEffort;
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <span className={isTop ? "text-green-600 font-bold" : ""}>
                        {user.fullname || "-"}
                      </span>
                      {isTop && (
                        <Drumstick className="w-4 h-4 text-green-600" />
                      )}
                    </TableCell>
                    <TableCell
                      className={`text-right ${
                        isTop ? "text-green-600 font-bold" : ""
                      }`}
                    >
                      {user.total_effort.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatDateTime(user.rocket_at)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
