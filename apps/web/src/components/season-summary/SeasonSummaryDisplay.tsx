import { useGetSingleSeason } from "@ttm/api";
import { Card, CardContent } from "../ui/Card";
import ErrorDisplay from "../ui/ErrorDisplay";
import { Loading } from "../ui/Loading";
import ContributedProjectPie from "./ContributedProjectPie";
import { TotalTask } from "./TotalTask";
import { TotalHours } from "./TotalHours";
import { TotalSolo } from "./TotalSolo";
import { TotalRND } from "./TotalRND";
import { TotalVerified } from "./TotalVerified";
import { TotalBug } from "./TotalBug";
import ContributedUser from "./ContributedUser";
import TotalInformation from "./TotalInformation";

export default function SeasonSummaryDisplay({
  seasonId,
}: {
  seasonId: number;
}) {
  const queryKey = ["season", seasonId.toString()];
  const { data, isLoading, isFetching, isError, refetch } = useGetSingleSeason(
    queryKey,
    seasonId,
    {},
    {},
    { enabled: !!seasonId },
  );

  const { season } = data || {};

  if (isLoading || isFetching) {
    return (
      <Card>
        <CardContent>
          <Loading size="md" showText text="Loading report details..." />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <ErrorDisplay
        title="Error Loading Report Details"
        message="We encountered an error while loading the report. Please try again."
        onRetry={refetch}
        retryText="Reload Data"
      />
    );
  }

  if (!season) {
    return (
      <Card>
        <CardContent className="flex h-96 items-center justify-center text-gray-700">
          Please select a season.
        </CardContent>
      </Card>
    );
  }

  const reportData = season?.report_data;
  if (!reportData || Object.keys(reportData).length === 0) {
    return (
      <Card>
        <CardContent className="flex h-96 items-center justify-center text-gray-700">
          No report data available for this season.
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <TotalInformation season={season} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ContributedProjectPie season={season} />
        <ContributedUser season={season} />
      </div>
      <div>
        <TotalTask season={season} />
      </div>
      <div>
        <TotalHours season={season} />
      </div>
      <div>
        <TotalSolo season={season} />
      </div>
      <div>
        <TotalRND season={season} />
      </div>
      <div>
        <TotalVerified season={season} />
      </div>
      <div>
        <TotalBug season={season} />
      </div>
    </>
  );
}
