import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { ClassicLayout } from "@/components/ui/ClassicLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { toast } from "@/components/ui/UseToast";
import { useCreateRoleWithFeatures } from "@ttm/api";
import { RoleForm } from "@/components/role/RoleForm";
import RoleFeature from "@/components/role/RoleFeature";
import withFeatureGuard from "@/components/guard/guard";
import { RoleEvents } from "@ttm/api/types/tracker";
import { Plus } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
});

function RoleCreate() {
  const router = useRouter();
  const selectedFeaturesRef = useRef<number[]>([]);

  const form = useForm({
    defaultValues: {
      name: "",
      code: "",
    },
    resolver: zodResolver(schema),
  });

  const { handleSubmit } = form;

  const { mutateAsync: createRole, isPending } = useCreateRoleWithFeatures({
    onSuccess: (result) => {
      console.log("Create role result:", result);

      const createdRole = result?.role;
      if (createdRole?.id) {
        toast({
          title: "Role Created",
          description: "Role has been created successfully.",
        });

        router.navigate({
          to: "/role/$roleId",
          params: { roleId: createdRole.id.toString() },
          replace: true,
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create role. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSelectedFeaturesChange = (selectedFeatureIds: number[]) => {
    selectedFeaturesRef.current = selectedFeatureIds;
  };

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      await createRole({
        ...data,
        feature_ids: selectedFeaturesRef.current,
      });
    } catch (error) {
      console.error("Failed to create role:", error);
    }
  };

  return (
    <ClassicLayout
      title="Create Role"
      backButton
      backButtonTrackEventName={RoleEvents.ROLE_CREATE_BACK_CLICKED}
      actionButton={
        <Button
          type="submit"
          form="role-form"
          disabled={isPending}
          trackEventName={RoleEvents.ROLE_CREATE_BUTTON_CLICKED}
        >
          <Plus className="w-4 h-4 mr-2" />
          {isPending ? "Creating..." : "Create"}
        </Button>
      }
      content={
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
                  onSelectedFeaturesChange={handleSelectedFeaturesChange}
                />
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      }
    />
  );
}

const ProtectedRoleManagement = withFeatureGuard(RoleCreate, "role");

export const Route = createFileRoute("/_app/role/new")({
  component: ProtectedRoleManagement,
});
