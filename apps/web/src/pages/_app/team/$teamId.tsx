import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  getSingleTeam,
  listTeamMembers,
  useCreateTeamMember,
  useEditTeam,
} from "@ttm/api";
import { ClassicLayout } from "@/components/ui/ClassicLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { toast } from "sonner";
import { Loading } from "@/components/ui/Loading";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import { TeamForm } from "@/components/team/TeamForm";
// import withFeatureGuard from "@/components/guard/guard";
import TeamMemberList from "@/components/team/TeamMemberList";
import { UserCircle2, UserPlus } from "lucide-react";
import { CustomDialog } from "@/components/ui/CustomDialog";
import { AsyncCombobox } from "@/components/ui/AsyncCombobox";
import { Separator } from "@/components/ui/Separator";
import { Icon } from "@/components/ui/Icon";
import { Text } from "@/components/ui/Text";
import { getHttpsImageUrl } from "@ttm/utils/src/transformHttp";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  team_image: z.any().nullable().optional(),
});

type TeamFormSchema = z.infer<typeof schema>;

function TeamDetail() {
  const { teamId } = Route.useParams();

  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [hasImageChange, setHasImageChange] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const form = useForm<TeamFormSchema>({
    defaultValues: {
      name: "",
      team_image: null,
    },
    resolver: zodResolver(schema),
  });

  const addMemberForm = useForm<{ user: string }>({
    defaultValues: { user: "" },
  });

  const {
    handleSubmit,
    reset,
    watch,
    formState: { isDirty },
  } = form;

  const teamImage = watch("team_image");

  useEffect(() => {
    if (teamImage instanceof File) {
      setHasImageChange(true);
    }
  }, [teamImage]);

  const buttonDisabled = !isDirty && !hasImageChange;

  const {
    data,
    isLoading,
    isError,
    refetch: refetchTeam,
  } = getSingleTeam(["teams", teamId], parseInt(teamId), {}, {});

  const team = data?.team;

  const { data: teamMembersData, refetch: refetchMembers } = listTeamMembers(
    ["team-members", teamId],
    {
      filter: { team: teamId },
    },
  );

  const { teamMembers } = teamMembersData || {};

  // const { mutate: uploadImage } = useUploadTeamImage({
  //   onSuccess: () => {
  //     toast.success("Team updated successfully");

  //     setHasImageChange(false);
  //     setShowEditDialog(false);
  //     refetchTeam();
  //   },
  //   onError: () => {
  //     toast.error("Failed to upload team image. Please try again.");
  //   },
  // });

  // const { mutate: deleteImage } = useDeleteTeamImage({
  //   onSuccess: () => {
  //     toast.success("Team image has been deleted successfully");
  //   },
  //   onError: () => {
  //     toast.error("Failed te delete team image. Please try again.");
  //   },
  // });

  const { mutate: editTeam, isPending: isUpdating } = useEditTeam({
    onSuccess: () => {
      toast.success("Team updated successfully");
      setShowEditDialog(false);
      setHasImageChange(false);
      refetchTeam();
      reset({
        name: team?.name ?? "",
        team_image: team?.team_image ?? null,
      });
    },
    onError: () => {
      toast.error("Failed to update team. Please try again.");
    },
  });

  const { mutate: createTeamMember, isPending: isAdding } = useCreateTeamMember(
    {
      onSuccess: () => {
        toast.success("Member added successfully");

        setAddMemberDialogOpen(false);
        addMemberForm.reset();

        refetchTeam();
        refetchMembers();
      },
      onError: () => {
        toast.error("Failed to add member. Please try again.");
      },
    },
  );

  useEffect(() => {
    if (team && team.name) {
      reset({
        name: team.name,
        team_image: team.team_image || null,
      });
      setHasImageChange(false);
    }
  }, [team, reset]);

  const onSubmit = (data: z.infer<typeof schema>) => {
    const formData = new FormData();
    formData.append("name", data.name);

    if (data.team_image instanceof File) {
      formData.append("image", data.team_image);
    } else if (data.team_image === null && team?.team_image) {
      // user cleared existing image
      formData.append("delete_image", "true");
    }
    editTeam({ id: teamId, formData });
  };

  const handleAddMember = (data: { user: string }) => {
    if (!data.user) return;

    console.log("data.user", data.user);

    const currentMembers = teamMembers || [];

    const isAlreadyMember = currentMembers.some(
      (member) => member.user?.toString() == data.user,
    );
    console.log("isAlreadyMember", isAlreadyMember);

    if (isAlreadyMember) {
      toast.error("This user is already a member of the team");
      return;
    }

    createTeamMember({
      team: teamId,
      user: data.user,
    });
    console.log("Adding member", data.user, "to team", teamId);
  };

  const renderContent = () => {
    if (isLoading && !team) {
      return (
        <Card>
          <CardContent className="min-h-screen p-8">
            <Loading
              showText
              text="Loading team data..."
              size="lg"
              className="items-center justify-center"
            />
          </CardContent>
        </Card>
      );
    }

    if (isError || !team) {
      return (
        <ErrorDisplay
          title="Error Loading Team"
          message="We encountered an error while loading the team. Please try again."
          onRetry={() => {
            refetchTeam();
          }}
          retryText="Reload Data"
        />
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col gap-6 w-full">
            <div className="flex items-center gap-2">
              <Text variant="h3">Team Details</Text>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => setShowEditDialog(true)}
              >
                <Icon name="pencil" size="sm" />
              </Button>
            </div>
            <Separator />

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                {team?.team_image ? (
                  <img
                    src={getHttpsImageUrl(team.team_image) ?? ""}
                    alt="Team Avatar"
                    className="h-16 w-16 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center ring-2 ring-gray-200 flex-shrink-0">
                    <UserCircle2 className="h-10 w-10 text-gray-400" />
                  </div>
                )}
                <Text variant="h3" className="w-full line-clamp-3 break-words">
                  {team?.name}
                </Text>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <TeamMemberList teamId={teamId} />
        </div>
      </div>
    );
  };

  return (
    <>
      <ClassicLayout
        title="Edit Team"
        backButton
        actionButton={
          <Button type="button" onClick={() => setAddMemberDialogOpen(true)}>
            <UserPlus className="w-5 h-5 text-white-400 pr-1" />
            Add Team Member
          </Button>
        }
        content={renderContent()}
      />
      <FormProvider {...addMemberForm}>
        <CustomDialog
          isOpen={addMemberDialogOpen}
          onClose={() => setAddMemberDialogOpen(false)}
          onConfirm={addMemberForm.handleSubmit(handleAddMember)}
          confirmText={isAdding ? "Adding..." : "Add"}
          title="Add New Member"
          cancelText="Cancel"
        >
          <AsyncCombobox
            name="user"
            control={addMemberForm.control}
            formLabel="Select Member"
            labelField="fullname"
            valueField="id"
            endpoint="/users"
            dataKey="users"
            placeholder="Select Member"
            required
          />
        </CustomDialog>
      </FormProvider>

      <CustomDialog
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        onConfirm={handleSubmit(onSubmit)}
        confirmText={isUpdating ? "Saving..." : "Save"}
        title="Edit Team Details"
        isLoading={isUpdating || buttonDisabled}
      >
        <FormProvider {...form}>
          <form id="team-form" className="flex flex-col gap-6">
            <TeamForm stacked />
          </form>
        </FormProvider>
      </CustomDialog>
    </>
  );
}

// const ProtectedTeamManagement = withFeatureGuard(TeamDetail, "team");

export const Route = createFileRoute("/_app/team/$teamId")({
  component: TeamDetail,
});
