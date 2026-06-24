import { forwardRef, useImperativeHandle, useRef } from "react";
import { FeatureTree } from "./FeatureTree";
import { useListFeatures, listAllRoleFeature } from "@ttm/api";
import { Card, CardContent } from "@/components/ui/Card";
import { Loading } from "@/components/ui/Loading";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import { Text } from "@/components/ui/Text";
import { Separator } from "@/components/ui/Separator";

interface RoleFeatureProps {
  id?: string;
  onSelectedFeaturesChange?: (features: number[]) => void;
  onFeatureChanges?: (hasChanges: boolean) => void;
}

const RoleFeature = forwardRef<any, RoleFeatureProps>(
  ({ id = "", onSelectedFeaturesChange, onFeatureChanges }, ref) => {
    const parsedRoleId = id ? parseInt(id) : 0;
    const featureTreeRef = useRef<any>(null);

    const {
      data: featureData,
      isLoading: featuresLoading,
      isError: featuresError,
      refetch: refetchFeatures,
    } = useListFeatures(["features"], { per_page: 1000 }, {});

    const {
      data: roleFeatureData,
      isLoading: roleFeaturesLoading,
      isError: roleFeaturesError,
      refetch: refetchRoleFeatures,
    } = listAllRoleFeature(
      ["role-features", parsedRoleId.toString()],
      {
        filter: { role: parsedRoleId.toString() },
        include: ["feature.*"],
        per_page: 1000,
      },
      {},
    );

    useImperativeHandle(ref, () => ({
      hasUnsavedChanges: () => featureTreeRef.current?.hasUnsavedChanges?.(),
      getSelectedFeatureIds: () => {
        return featureTreeRef.current?.getSelectedFeatureIds() || [];
      },
      resetChanges: () => {
        featureTreeRef.current?.resetChanges?.();
      },
      refetchRoleFeatures: () => {
        return refetchRoleFeatures();
      },
    }));

    if (featuresLoading || roleFeaturesLoading) {
      return (
        <Card>
          <CardContent className="min-h-screen p-8">
            <Loading
              showText
              text="Loading features..."
              size="lg"
              className="items-center justify-center"
            />
          </CardContent>
        </Card>
      );
    }

    if (featuresError) {
      return (
        <ErrorDisplay
          title="Error Loading Features"
          message="Failed to load features data. Please try again."
          onRetry={refetchFeatures}
          retryText="Reload Features"
        />
      );
    }

    if (roleFeaturesError) {
      return (
        <ErrorDisplay
          title="Error Loading Role Features"
          message="Failed to load role features data. Please try again."
          onRetry={refetchRoleFeatures}
          retryText="Reload Role Features"
        />
      );
    }

    return (
      <>
        <div className="space-y-1">
          <Text variant="h3">Access Control</Text>
          <Separator />
        </div>
        <FeatureTree
          ref={featureTreeRef}
          featureData={featureData}
          roleFeatureData={roleFeatureData}
          roleId={parsedRoleId}
          onFeatureSelection={onSelectedFeaturesChange}
          onFeatureChanges={onFeatureChanges}
        />
      </>
    );
  },
);

RoleFeature.displayName = "RoleFeature";

export default RoleFeature;
