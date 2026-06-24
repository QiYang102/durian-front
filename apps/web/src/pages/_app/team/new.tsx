import { createFileRoute, useRouter } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { ClassicLayout } from "@/components/ui/ClassicLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { toast } from "sonner";
import { useCreateTeam, useUploadTeamImage } from "@ttm/api";
// import withFeatureGuard from "@/components/guard/guard";
import { TeamForm } from "@/components/team/TeamForm";
import { Plus } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  team_image: z.any().nullable().optional(),
});

type TeamFormSchema = z.infer<typeof schema>;

function TeamCreate() {
  const router = useRouter();

  const form = useForm<TeamFormSchema>({
    defaultValues: {
      name: "",
      team_image: null,
    },
    resolver: zodResolver(schema),
  });

  const {
    handleSubmit,
    getValues,
    formState: { isDirty },
  } = form;

  const { mutate: uploadImage, isPending: isUploading } = useUploadTeamImage({
    onSuccess: (result) => {
      const updatedTeam = result?.team;
      if (updatedTeam?.id) {
        toast.success("Team has been created successfully");

        router.navigate({
          to: "/team/$teamId",
          params: { teamId: updatedTeam.id.toString() },
          replace: true,
        });
      }
    },
    onError: () => {
      toast.error("Failed to upload team image. Please try again.");
    },
  });

  const { mutateAsync: createTeam, isPending: isCreating } = useCreateTeam({
    onSuccess: (result) => {
      console.log("Create team result:", result);

      const createdTeam = result?.team;

      if (createdTeam?.id) {
        const formData = getValues();

        if (formData.team_image && formData.team_image instanceof File) {
          uploadImage({
            id: createdTeam.id.toString(),
            image: formData.team_image,
          });
        } else {
          toast.success("Team has been created successfully");

          router.navigate({
            to: "/team/$teamId",
            params: { teamId: createdTeam.id.toString() },
            replace: true,
          });
        }
      }
    },
    onError: () => {
      toast.error("Failed to create team. Please try again.");
    },
  });

  const onSubmit = async (data: TeamFormSchema) => {
    console.log("button click");
    createTeam({
      name: data.name,
    });
  };

  const isPending = isCreating || isUploading;

  return (
    <ClassicLayout
      title="Create New Team"
      backButton
      actionButton={
        <Button type="submit" form="team-form" disabled={isPending || !isDirty}>
          <Plus className="w-4 h-4 mr-2" />
          {isPending ? "Creating..." : "Create"}
        </Button>
      }
      content={
        <Card>
          <CardContent className="flex flex-col gap-6">
            <FormProvider {...form}>
              <form
                id="team-form"
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-6"
              >
                <TeamForm />
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      }
    />
  );
}

// const ProtectedTeamManagement = withFeatureGuard(TeamCreate, "team");

export const Route = createFileRoute("/_app/team/new")({
  component: TeamCreate,
  //   component: ProtectedTeamManagement,
});
