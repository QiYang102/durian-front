import { Card, CardContent } from "../ui/Card";
import ErrorDisplay from "../ui/ErrorDisplay";
import { Loading } from "../ui/Loading";
import KopibengRankingCard from "./KopibengRankingCard";
import { useListUserOverallKopibeng } from "@ttm/api";

export default function KopibengRanking() {
  const queryKey = ["top3"];
  const { data, isLoading, isFetching, isError, refetch } =
    useListUserOverallKopibeng(queryKey, {
      per_page: 10,
      sort: ["-amount"],
    });

  const { result } = data || {};

  // This is to make the ranking become [secondPlace, firstPlace, thirdPlace] for the UI display
  const top3: (any | null)[] = [null, null, null];

  if (result && result.length > 0) {
    for (let i = 0; i < 3; i++) {
      if (result[i]) {
        switch (i) {
          case 0:
            top3[1] = result[i];
            break;
          case 1:
            top3[0] = result[i];
            break;
          case 2:
            top3[2] = result[i];
            break;

          default:
            break;
        }
      }
    }
  }

  if (isLoading || isFetching) {
    return (
      <Card className="flex flex-col flex-1">
        <CardContent className="flex items-center justify-center">
          <Loading size="md" showText text="Loading Kopibeng Ranking..." />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <ErrorDisplay
        title="Error Loading Kopibeng Ranking"
        message="We encountered an error while loading the kopibeng ranking. Please try again."
        onRetry={refetch}
        retryText="Reload Data"
      />
    );
  }

  return (
    <Card className="py-5">
      <CardContent className="flex flex-row gap-10 justify-evenly">
        <div className="hidden md:flex flex-col justify-center items-start px-6 py-4">
          <h2 className="flex flex-row text-3xl font-extrabold text-brown-700 tracking-wide">
            Kopi Beng Champions
          </h2>
          <p className="text-sm text-brown-500">
            Most Kopi Beng Outstanding Balance
          </p>
        </div>
        <div className="flex flex-row flex-shrink-0 gap-5 items-end">
          {top3.map((user, index) => (
            <KopibengRankingCard
              key={user?.userId ?? `empty-${index}`}
              place={index as 0 | 1 | 2}
              image={user?.image ?? ""}
              name={user?.fullname ?? ""}
              amount={user?.amount ?? 0}
              isPlaceholder={!user}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
