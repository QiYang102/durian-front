import { listTeams } from "@ttm/api";
import { Card, CardContent } from "@/components/ui/Card";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import TeamCard from "./TeamCard";
import { Loading } from "../ui/Loading";
import { Users } from "lucide-react";

export default function TeamList() {
  const { data, isLoading, isError, refetch } = listTeams(["teams"]);

  const { teams } = data || {};

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Loading
            showText
            text="Loading teams..."
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
        title="Failed to load teams"
        message="We couldn't load the teams data. Please check your connection and try again."
        onRetry={() => {
          refetch();
        }}
        retryText="Reload Data"
      />
    );
  }

  if (!teams || teams.length === 0) {
    return (
      <Card>
        <CardContent>
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Users className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No teams found.
            </h3>
            <p className="text-gray-500">Get started by creating a new team</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
