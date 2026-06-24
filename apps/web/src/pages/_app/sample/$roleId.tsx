import SampleRoleFormComponent from "@/components/sample/SampleRoleFormComponent";
import { ClassicLayout } from "@/components/ui/ClassicLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/Button";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { useSampleGetRole } from "@ttm/api";
import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { RoleFeatureComponent } from "@/components/sample/RoleFeatureComponent";
import { Loading } from "@/components/ui/Loading";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import _ from "lodash";
import { Save } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
});

function SampleDetail() {
  const { roleId } = Route.useParams();
  const selectedFeaturesRef = useRef<number[]>([]);

  const form = useForm({
    defaultValues: {
      name: "",
      code: "",
    },
    resolver: zodResolver(schema),
  });

  const { handleSubmit, reset, formState } = form;
  const { dirtyFields } = formState;

  const { data, isLoading, isError, refetch } = useSampleGetRole(
    ["role", roleId],
    roleId,
    {},
    {},
  );

  const role = data?.role || {};

  // Patch form values when role data is loaded
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
  };

  const onSubmit = (data: z.infer<typeof schema>) => {
    console.log("Form data:", data);
    console.log("Selected feature IDs:", selectedFeaturesRef.current);
  };

  const renderContent = () => {
    if (isLoading) {
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
          title="Error Loading Role"
          message="We encountered an error while loading the role. Please try again."
          onRetry={refetch}
          retryText="Reload Data"
        />
      );
    }

    return (
      <FormProvider {...form}>
        <form
          id="sample-role-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <SampleRoleFormComponent />
          <RoleFeatureComponent
            roleId={roleId}
            onSelectedFeaturesChange={handleSelectedFeaturesChange}
          />
        </form>
      </FormProvider>
    );
  };

  return (
    <ClassicLayout
      title="Sample Role Detail"
      backButton
      actionButton={
        <Button
          type="submit"
          form="sample-role-form"
          // disabled={!_.isEmpty(dirtyFields) && saveRole.isPending}
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      }
      content={
        <Card>
          <CardContent className="flex flex-col gap-6">
            {renderContent()}
          </CardContent>
        </Card>
      }
    />
  );
}

export const Route = createFileRoute("/_app/sample/$roleId")({
  component: SampleDetail,
});
