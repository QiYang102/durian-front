import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ClassicLayout } from "@/components/ui/ClassicLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { DeploymentStatus } from "@ttm/api/types/enums";
import { Card, CardContent } from "@/components/ui/Card";
import { Package, Server, Rocket } from "lucide-react";
import {
  getStoriesToBeDeploy,
  getStoriesInStaging,
  getStoriesInProduction,
} from "@ttm/api/modules/story";
import DeploymentCard from "@/components/deployment/DeploymentCard";
import { FileText } from "lucide-react";
import { Loading } from "@/components/ui/Loading";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import TeamCheckInRequired from "@/components/TeamCheckInRequired";

const DEPLOYMENT_MODES = Object.values(DeploymentStatus);

export default function DeploymentOverview() {
  const teamId = localStorage.getItem("teamId") || "";
  const { status = DeploymentStatus.PENDING } = Route.useSearch();
  const navigate = useNavigate();

  const {
    data: pendingData,
    isLoading: isLoadingPending,
    isError: isErrorPending,
    refetch: refetchPending,
  } = getStoriesToBeDeploy(
    ["deployment-pending", teamId],
    { include: ["project.*"], filter: { team: teamId } },
    { project: "projects" },
    { enabled: !!teamId },
  );

  console.log("Pending Data:", pendingData);

  const {
    data: stagingData,
    isLoading: isLoadingStaging,
    isError: isErrorStaging,
    refetch: refetchStaging,
  } = getStoriesInStaging(
    ["deployment-staging", teamId],
    { include: ["project.*"], filter: { team: teamId } },
    { project: "projects" },
    { enabled: !!teamId },
  );

  const {
    data: productionData,
    isLoading: isLoadingProduction,
    isError: isErrorProduction,
    refetch: refetchProduction,
  } = getStoriesInProduction(
    ["deployment-production", teamId],
    { include: ["project.*"], filter: { team: teamId } },
    { project: "projects" },
    { enabled: !!teamId },
  );

  const counts = {
    [DeploymentStatus.PENDING]: pendingData?.stories?.length || 0,
    [DeploymentStatus.STAGING]: stagingData?.stories?.length || 0,
    [DeploymentStatus.PRODUCTION]: productionData?.stories?.length || 0,
  };

  const getTabConfig = (mode: DeploymentStatus) => {
    switch (mode) {
      case DeploymentStatus.PENDING:
        return {
          label: "To Be Deployed",
          icon: <Package className="w-4 h-4 mr-2" />,
        };
      case DeploymentStatus.STAGING:
        return {
          label: "Staging",
          icon: <Server className="w-4 h-4 mr-2" />,
        };
      case DeploymentStatus.PRODUCTION:
        return {
          label: "Production",
          icon: <Rocket className="w-4 h-4 mr-2" />,
        };
      default:
        return {
          label: "",
          icon: null,
        };
    }
  };

  if (!teamId) {
    return <TeamCheckInRequired />;
  }

  const renderContent = (mode: DeploymentStatus) => {
    let data, isLoading, isError, refetch;

    switch (mode) {
      case DeploymentStatus.PENDING:
        data = pendingData;
        isLoading = isLoadingPending;
        isError = isErrorPending;
        refetch = refetchPending;
        break;
      case DeploymentStatus.STAGING:
        data = stagingData;
        isLoading = isLoadingStaging;
        isError = isErrorStaging;
        refetch = refetchStaging;
        break;
      case DeploymentStatus.PRODUCTION:
        data = productionData;
        isLoading = isLoadingProduction;
        isError = isErrorProduction;
        refetch = refetchProduction;
        break;
      default:
        return null;
    }

    const stories = data?.stories || [];

    if (isLoading) {
      return (
        <Card>
          <CardContent>
            <Loading
              showText
              text="Loading stories..."
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
          title="Failed to load stories"
          message="We couldn't load the deployment stories. Please check your connection and try again."
          onRetry={() => {
            refetch();
          }}
          retryText="Reload Data"
        />
      );
    }

    if (!stories || stories.length === 0) {
      return (
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <FileText className="mx-auto h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No stories found
              </h3>
              <p className="text-gray-500">
                No deployment stories in this stage
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="@container">
        <div className="grid grid-cols-1 @sm:grid-cols-2 @3xl:grid-cols-3 @6xl:grid-cols-4 gap-4 auto-rows-fr">
          {stories.map((story) => (
            <DeploymentCard
              key={story.id}
              story={story}
              deploymentMode={status}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <ClassicLayout
      title="Deployment Overview"
      content={
        <Card>
          <CardContent>
            <Tabs
              defaultValue={DeploymentStatus.PENDING}
              value={status}
              onValueChange={(value) =>
                navigate({
                  to: "/deployment",
                  search: { status: value as DeploymentStatus },
                  replace: true,
                })
              }
            >
              <TabsList className="grid grid-cols-3 w-full mb-6">
                {DEPLOYMENT_MODES.map((mode) => {
                  const config = getTabConfig(mode);
                  const count = counts[mode];

                  return (
                    <TabsTrigger key={mode} value={mode}>
                      {config.icon}
                      {config.label}
                      <span className="ml-2 bg-gray-100 rounded-full px-2 py-0.5 text-xs font-bold">
                        {count}
                      </span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {DEPLOYMENT_MODES.map((mode) => (
                <TabsContent key={mode} value={mode} className="mt-0">
                  {renderContent(mode)}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      }
    />
  );
}

export const Route = createFileRoute("/_app/deployment/")({
  component: DeploymentOverview,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      status: (search.status as DeploymentStatus) || DeploymentStatus.PENDING,
    };
  },
});
