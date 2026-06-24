import { listAllRoleFeature } from "@ttm/api";
import { Card, CardContent } from "../ui/Card";
import { Loading } from "../ui/Loading";
import { FeatureTree } from "./SampleFeatureTree";
import ErrorDisplay from "../ui/ErrorDisplay";

interface RoleFeatureComponentProps {
  roleId: string;
  onSelectedFeaturesChange?: (selectedFeatureIds: number[]) => void;
}

export function RoleFeatureComponent({
  roleId,
  onSelectedFeaturesChange,
}: RoleFeatureComponentProps) {
  const {
    data: roleFeatureData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = listAllRoleFeature(
    ["role-feature", roleId],
    {
      filter: { role: roleId },
      include: ["feature.*"],
    },
    { feature: "features" },
  );

  const roleFeatures = roleFeatureData?.roleFeature || [];

  if (isLoading || isFetching) {
    return (
      <Card>
        <CardContent className="min-h-screen p-8">
          <Loading
            showText
            text="Loading role features..."
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
        title="Error Loading Role Features"
        message="We encountered an error while loading the role features. Please try again."
        onRetry={refetch}
        retryText="Reload Data"
      />
    );
  }

  return (
    <Card>
      <CardContent className="min-h-screen p-8">
        <FeatureTree
          roleFeatures={roleFeatures}
          onSelectedFeaturesChange={onSelectedFeaturesChange}
        />
      </CardContent>
    </Card>
  );
}
