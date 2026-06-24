import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import {
  getSingleEventCalendar,
  useEditEventCalendar,
  useDeleteEventCalendar,
} from "@ttm/api/modules/eventCalendar";
import { EventCalendar } from "@ttm/api/types/models/eventCalendar";
import { Card, CardContent } from "@/components/ui/Card";
import { ClassicLayout } from "@/components/ui/ClassicLayout";
import { toast } from "sonner";
import LeaveForm from "@/components/leave/LeaveForm";
import { Loading } from "@/components/ui/Loading";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import moment from "moment";
import { Save, Trash2 } from "lucide-react";

const leaveFormSchema = z.object({
  type: z.string().min(1, { message: "Event type is required" }),
  user: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.number().nullable().optional(),
  ),
  start_date: z.date(),
  end_date: z.date(),
  description: z.string().min(1, { message: "Description is required" }),
});

type LeaveFormSchema = z.infer<typeof leaveFormSchema>;

function LeaveDetail() {
  const { leaveId } = Route.useParams();
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data, isLoading, isError, refetch, isFetching } =
    getSingleEventCalendar(
      ["event-calendars", leaveId],
      +leaveId,
      {},
      {},
      {
        enabled: !!leaveId,
      },
    );

  const leave = data?.event_calendar as EventCalendar | undefined;

  const formatDateToISO = (date: Date) => {
    return moment(date).format("YYYY-MM-DD");
  };

  const form = useForm<LeaveFormSchema>({
    resolver: zodResolver(leaveFormSchema),
    defaultValues: {
      type: "",
      start_date: undefined,
      end_date: undefined,
      description: "",
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isDirty },
  } = form;

  useEffect(() => {
    if (leave && Object.keys(leave).length > 0) {
      reset({
        type: leave.type || "",
        user: typeof leave.user === "object" ? leave.user?.id : leave.user,
        start_date: leave.start_date ? new Date(leave.start_date) : undefined,
        end_date: leave.end_date ? new Date(leave.end_date) : undefined,
        description: leave.description || "",
      });
    }
  }, [leave, reset]);

  const { mutate: editLeaveDetail, isPending: isUpdating } =
    useEditEventCalendar({
      onSuccess: () => {
        toast.success("Leave have been successfully updated");

        refetch();
      },
      onError: (error: any) => {
        toast.error(
          error?.data ||
            error?.message ||
            "Failed to update leave. Please try again.",
        );
      },
    });

  const { mutate: deleteLeave, isPending: isDeleting } = useDeleteEventCalendar(
    {
      onSuccess: () => {
        toast.success("Leave has been deleted successfully");

        navigate({ to: "/leave" });
      },
      onError: (error: any) => {
        toast.error(
          error?.data ||
            error?.message ||
            "Failed to delete leave. Please try again.",
        );
      },
    },
  );

  const onSubmit = (data: LeaveFormSchema) => {
    const updateData = {
      ...data,
      id: leaveId,
      start_date: formatDateToISO(data.start_date),
      end_date: formatDateToISO(data.end_date),
    };

    editLeaveDetail(updateData);
  };

  const handleDelete = () => {
    deleteLeave(leaveId);
    setShowDeleteDialog(false);
  };

  const renderContent = () => {
    if (isLoading || isFetching) {
      return (
        <Card>
          <CardContent>
            <Loading size="md" showText text="Loading leave details..." />
          </CardContent>
        </Card>
      );
    }

    if (isError || !leave) {
      return (
        <ErrorDisplay
          title="Error Loading Leave Details"
          message="We encountered an error while loading the leave. Please try again."
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
              id="leave-form"
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <LeaveForm />
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <ClassicLayout
        title="Leave"
        backButton
        actionButton={
          <div className="flex gap-3">
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
              form="leave-form"
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
        title="Delete Leave"
        content={`Are you sure you want to delete? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}

export const Route = createFileRoute("/_app/leave/$leaveId")({
  component: LeaveDetail,
});
