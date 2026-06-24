import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/Button";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateAnnouncement } from "@ttm/api/modules/announcement";
import { Card, CardContent } from "@/components/ui/Card";
import { ClassicLayout } from "@/components/ui/ClassicLayout";
import { toast } from "sonner";
import AnnouncementForm from "@/components/announcement/AnnouncementForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
//import withFeatureGuard from "@/components/guard/guard";

const announcementFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(200, { message: "Name must be at most 200 characters" }),
  start_date: z.date({ message: "Start date is required" }),
  end_date: z.date({ message: "End date is required" }),
  description: z.string().optional(),
  is_live: z.boolean().optional(),
});

type AnnouncementFormSchema = z.infer<typeof announcementFormSchema>;

function NewAnnouncementDetail() {
  const navigate = useNavigate();

  const form = useForm<AnnouncementFormSchema>({
    defaultValues: {
      name: "",
      start_date: undefined,
      end_date: undefined,
      description: "",
      is_live: true,
    },
    resolver: zodResolver(announcementFormSchema),
  });

  const { handleSubmit, formState } = form;
  const { isDirty } = formState;

  const { mutate: createAnnouncementDetail, isPending: isCreating } =
    useCreateAnnouncement({
      onSuccess: (result) => {
        toast.success("Announcement has been created successfully");

        navigate({
          to: "/announcement/$announcementId",
          params: {
            announcementId: result.announcement.id.toString(),
          },
          replace: true,
        });
      },
      onError: (error: any) => {
        toast.error(
          error?.data
            ? typeof error.data === "string"
              ? error.data
              : JSON.stringify(error.data)
            : error?.message ||
                "Failed to create announcement. Please try again.",
        );
      },
    });

  const onSubmit = (data: AnnouncementFormSchema) => {
    createAnnouncementDetail(data);
  };

  const renderContent = () => {
    return (
      <FormProvider {...form}>
        <form
          id="announcement-create-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <AnnouncementForm />
        </form>
      </FormProvider>
    );
  };

  return (
    <ClassicLayout
      title="Create Announcement"
      backButton
      actionButton={
        <div className="flex gap-3">
          <Button
            type="submit"
            form="announcement-create-form"
            disabled={isCreating || !isDirty}
          >
            <Plus className="w-4 h-4 mr-2" />
            {isCreating ? "Creating..." : "Create"}
          </Button>
        </div>
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

//const ProtectedNewAnnouncement = withFeatureGuard(NewAnnouncementDetail, "announcement");

export const Route = createFileRoute("/_app/announcement/new")({
  component: NewAnnouncementDetail,
});
