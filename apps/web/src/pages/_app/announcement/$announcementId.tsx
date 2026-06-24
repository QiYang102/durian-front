import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import {
  getSingleAnnouncement,
  useEditAnnouncement,
} from "@ttm/api/modules/announcement";
import { Announcement } from "@ttm/api/types/models/announcement";
import { Card, CardContent } from "@/components/ui/Card";
import { ClassicLayout } from "@/components/ui/ClassicLayout";
import { toast } from "sonner";
import AnnouncementForm from "@/components/announcement/AnnouncementForm";
//import withFeatureGuard from "@/components/guard/guard";
import { ErrorState } from "@/components/ui/ErrorState";
import { Loading } from "@/components/ui/Loading";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Save, Trash2 } from "lucide-react";

const announcementFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(200, { message: "Name must be at most 200 characters" }),
  start_date: z.date(),
  end_date: z.date(),
  description: z.string().optional(),
  is_live: z.boolean().optional(),
});

type AnnouncementFormSchema = z.infer<typeof announcementFormSchema>;

function AnnouncementDetail() {
  const { announcementId } = Route.useParams();
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data, isLoading, isError, refetch, isFetching } =
    getSingleAnnouncement(
      ["announcements", announcementId],
      +announcementId,
      {},
      {},
      {
        enabled: !!announcementId,
      },
    );

  const announcement = data?.announcement as Announcement | undefined;

  const form = useForm<AnnouncementFormSchema>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: {
      name: "",
      start_date: undefined,
      end_date: undefined,
      description: "",
      is_live: true,
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isDirty },
  } = form;

  useEffect(() => {
    if (announcement && Object.keys(announcement).length > 0) {
      reset({
        name: announcement.name || "",
        start_date: announcement.start_date
          ? new Date(announcement.start_date)
          : undefined,
        end_date: announcement.end_date
          ? new Date(announcement.end_date)
          : undefined,
        description: announcement.description || "",
        is_live: announcement.is_live || false,
      });
    }
  }, [announcement, reset]);

  const { mutate: editAnnouncementDetail, isPending: isUpdating } =
    useEditAnnouncement({
      onSuccess: () => {
        toast.success("Announcement have been updated successfully");

        refetch();
      },
      onError: (error: any) => {
        toast.error(
          error?.data ||
            error?.message ||
            "Failed to update announcement. Please try again.",
        );
      },
    });

  const { mutate: deleteAnnouncement, isPending: isDeleting } =
    useEditAnnouncement({
      onSuccess: () => {
        toast.success("Announcement has been deleted successfully");

        navigate({ to: "/announcement" });
      },
      onError: (error: any) => {
        toast.error(
          error?.data ||
            error?.message ||
            "Failed to delete announcement. Please try again.",
        );
      },
    });

  const onSubmit = (data: AnnouncementFormSchema) => {
    const updateData = {
      ...data,
      id: announcementId,
    };

    editAnnouncementDetail(updateData);
  };

  const handleDelete = () => {
    const deleteData = {
      ...form.getValues(),
      id: announcementId,
      is_active: false,
    };
    deleteAnnouncement(deleteData);
    setShowDeleteDialog(false);
  };

  const renderContent = () => {
    if (isLoading || isFetching) {
      return (
        <Card>
          <CardContent>
            <Loading
              size="md"
              showText
              text="Loading announcement details..."
            />
          </CardContent>
        </Card>
      );
    }

    if (isError || !announcement) {
      return (
        <ErrorDisplay
          title="Error Loading Announcement Details"
          message="We encountered an error while loading the announcement. Please try again."
          onRetry={refetch}
          retryText="Reload Data"
        />
      );
    }

    return (
      <Card>
        <CardContent className="flex flex-col gap-6">
          <FormProvider {...form}>
            <form
              id="announcement-form"
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <AnnouncementForm />
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <ClassicLayout
        title={`Announcement ${announcement?.name ? ` - ${announcement.name}` : ""}`}
        backButton
        actionButton={
          <div className="flex gap-2">
            <Button
              type="button"
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
            <Button
              type="submit"
              form="announcement-form"
              disabled={isUpdating || !isDirty}
            >
              <Save className="w-4 h-4 mr-2" />
              {isUpdating ? "Saving..." : "Save"}
            </Button>
          </div>
        }
        content={renderContent()}
      />

      <ConfirmDialog
        isOpen={showDeleteDialog}
        isLoading={isDeleting}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Announcement"
        content={`Are you sure you want to delete "${announcement?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}

//const ProtectedAnnouncementDetail = withFeatureGuard(AnnouncementDetail, "announcement");

export const Route = createFileRoute("/_app/announcement/$announcementId")({
  component: AnnouncementDetail,
  errorComponent: ErrorState,
});
