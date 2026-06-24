import { createFileRoute } from "@tanstack/react-router";
import { useRef, useEffect, useState } from "react";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { getSingleRoleList, useBulkUpdateRoleFeatures } from "@ttm/api";
import { ClassicLayout } from "@/components/ui/ClassicLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { toast } from "@/components/ui/UseToast";
import { Loading } from "@/components/ui/Loading";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { RoleForm } from "@/components/role/RoleForm";
import RoleFeature from "@/components/role/RoleFeature";
import withFeatureGuard from "@/components/guard/guard";
import { trackEvent } from "@/lib/analytics";
import { RoleEvents } from "@ttm/api/types/tracker";
import { Save } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
});

function RoleDetail() {
  const { roleId } = Route.useParams();
  const roleFeatureRef: any = useRef();
  const selectedFeaturesRef = useRef<number[]>([]);
  const isSubmittingRef = useRef(false);

  const [pendingFormData, setPendingFormData] = useState<z.infer<
    typeof schema
  > | null>(null);
  const [hasFeatureChanges, setHasFeatureChanges] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      code: "",
    },
    resolver: zodResolver(schema),
  });

  const {
    handleSubmit,
    reset,
    formState: { isDirty },
  } = form;

  const buttonDisabled = !isDirty && !hasFeatureChanges;

  const { data, isLoading, isError, refetch } = getSingleRoleList(
    ["roles", roleId],
    roleId,
    {},
    {},
  );

  const role = data?.role || {};

  const { mutateAsync: bulkUpdateRoleFeatures, isPending: isUpdating } =
    useBulkUpdateRoleFeatures({
      onSuccess: async () => {
        toast({
          title: "Success",
          description: "Role updated successfully",
        });

        reset(pendingFormData || form.getValues());
        setHasFeatureChanges(false);
        setPendingFormData(null);
        setShowConfirmDialog(false);
        roleFeatureRef.current?.resetChanges();
        await refetch();
        await roleFeatureRef.current?.refetchRoleFeatures();
      },
      onError: (error) => {
        console.error("Failed to update role:", error);

        toast({
          title: "Error",
          description: "Failed to update role",
          variant: "destructive",
        });
      },
    });

  useEffect(() => {
    if (role && role.name && role.code) {
      reset({
        name: role.name,
        code: role.code,
      });
    }
  }, [role, reset]);

  const handleSelectedFeaturesChange = (selectedFeatureIds: number[]) => {
    selectedFeaturesRef.current = selectedFeatureIds;

    const featureChanges = roleFeatureRef.current?.hasUnsavedChanges() || false;
    setHasFeatureChanges(featureChanges);
  };

  const handleFeatureChanges = (hasChanges: boolean) => {
    setHasFeatureChanges(hasChanges);
  };

  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setPendingFormData(data);

    if (!showConfirmDialog) {
      setShowConfirmDialog(true);
    }
  };

  const handleConfirmSave = async () => {
    if (!pendingFormData) return;

    try {
      console.log("Form data:", pendingFormData);
      console.log("Selected feature IDs:", selectedFeaturesRef.current);

      await bulkUpdateRoleFeatures({
        roleId: +roleId,
        featureIds: selectedFeaturesRef.current,
        name: pendingFormData.name,
        code: pendingFormData.code,
      });
    } catch (error) {
      console.error("Failed to save role:", error);
    } finally {
      isSubmittingRef.current = false;
    }
  };

  const handleConfirmCancel = () => {
    setShowConfirmDialog(false);
    setPendingFormData(null);
    isSubmittingRef.current = false;
  };

  const getConfirmationContent = () => {
    if (!pendingFormData && !hasFeatureChanges) {
      return "No changes detected.";
    }

    let content = "Are you sure you want to save these changes?\n\n";

    if (pendingFormData && isDirty) {
      content += `Role Name: ${pendingFormData.name}\n`;
      content += `Role Code: ${pendingFormData.code}\n\n`;
    }

    if (hasFeatureChanges) {
      content += `Selected Features: ${selectedFeaturesRef.current.join(", ")}`;
    }

    return <pre>{content}</pre>;
  };

  const renderContent = () => {
    if (isLoading && !role) {
      return (
        <Card>
          <CardContent className="min-h-screen p-8">
            <Loading
              showText
              text="Loading role data..."
              size="lg"
              className="items-center justify-center"
            />
          </CardContent>
        </Card>
      );
    }

    if (isError || !role) {
      return (
        <ErrorDisplay
          title="Error Loading Role"
          message="We encountered an error while loading the role. Please try again."
          onRetry={() => {
            trackEvent(RoleEvents.ROLE_DETAIL_RETRY);
            refetch();
          }}
          retryText="Reload Data"
        />
      );
    }

    return (
      <Card>
        <CardContent className="flex flex-col gap-6">
          <FormProvider {...form}>
            <form
              id="role-form"
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <RoleForm />
              <RoleFeature
                ref={roleFeatureRef}
                id={roleId}
                onSelectedFeaturesChange={handleSelectedFeaturesChange}
                onFeatureChanges={handleFeatureChanges}
              />
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <ClassicLayout
        title="Role Detail"
        backButton
        backButtonTrackEventName={RoleEvents.ROLE_UPDATE_BACK_CLICKED}
        actionButton={
          <Button
            type="submit"
            form="role-form"
            trackEventName={RoleEvents.ROLE_UPDATE_SAVE_BUTTON_CLICKED}
            disabled={isUpdating || buttonDisabled}
          >
            <Save className="w-4 h-4 mr-2" />
            {isUpdating ? "Saving..." : "Save"}
          </Button>
        }
        content={renderContent()}
      />

      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={handleConfirmCancel}
        onConfirm={async () => {
          await handleConfirmSave();
          isSubmittingRef.current = false;
        }}
        title="Confirm Save"
        content={getConfirmationContent()}
        confirmText="Save"
        cancelText="Cancel"
        confirmTrackEventName={RoleEvents.ROLE_UPDATE_CONFIRM_SAVE}
        cancelTrackEventName={RoleEvents.ROLE_UPDATE_CONFIRM_CANCEL}
      />
    </>
  );
}

const ProtectedRoleManagement = withFeatureGuard(RoleDetail, "role");

export const Route = createFileRoute("/_app/role/$roleId")({
  component: ProtectedRoleManagement,
});
