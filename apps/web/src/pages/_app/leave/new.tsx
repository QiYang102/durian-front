import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/Button";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateEventCalendar } from "@ttm/api/modules/eventCalendar";
import { Card, CardContent } from "@/components/ui/Card";
import { ClassicLayout } from "@/components/ui/ClassicLayout";
import { toast } from "sonner";
import LeaveForm from "@/components/leave/LeaveForm";
import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";
import { Plus } from "lucide-react";

const leaveFormSchema = z.object({
  type: z.string().min(1, { message: "Event type is required" }),
  user: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.number().nullable().optional(),
  ),
  start_date: z.date({ message: "Start date is required" }),
  end_date: z.date({ message: "End date is required" }),
  description: z.string().min(1, { message: "Description is required" }),
});

type LeaveFormSchema = z.infer<typeof leaveFormSchema>;

function NewLeaveDetail() {
  const navigate = useNavigate();

  const form = useForm<LeaveFormSchema>({
    defaultValues: {
      type: "",
      start_date: undefined,
      end_date: undefined,
      description: "",
    },
    resolver: zodResolver(leaveFormSchema),
  });

  const { handleSubmit, formState } = form;
  const { isDirty } = formState;

  const formatDateToISO = (date: Date) => {
    return moment(date).format("YYYY-MM-DD");
  };

  const { mutate: createLeaveDetail, isPending: isCreating } =
    useCreateEventCalendar({
      onSuccess: (result) => {
        toast.success("Leave has been created successfully");

        navigate({
          to: "/leave/$leaveId",
          params: {
            leaveId: result.event_calendar.id.toString(),
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
            : error?.message || "Failed to create leave. Please try again.",
        );
      },
    });

  const onSubmit = (data: LeaveFormSchema) => {
    const submitData = {
      ...data,
      start_date: formatDateToISO(data.start_date),
      end_date: formatDateToISO(data.end_date),
    };
    createLeaveDetail(submitData);
  };

  const renderContent = () => {
    return (
      <FormProvider {...form}>
        <form
          id="leave-create-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <LeaveForm />
        </form>
      </FormProvider>
    );
  };

  return (
    <ClassicLayout
      title="Create Leave"
      backButton
      actionButton={
        <div className="flex gap-3">
          <Button
            type="submit"
            form="leave-create-form"
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

export const Route = createFileRoute("/_app/leave/new")({
  component: NewLeaveDetail,
});
