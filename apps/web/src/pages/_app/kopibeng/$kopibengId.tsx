import KopibengForm from "@/components/kopibeng/KopibengForm";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ClassicLayout } from "@/components/ui/ClassicLayout";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import { Loading } from "@/components/ui/Loading";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  useDeleteKopibeng,
  useEditKopibeng,
  useGetSingleKopibeng,
} from "@ttm/api";
import { formatDisplayDate } from "@ttm/utils";
import { SaveIcon, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z
  .object({
    create_date: z.date({ invalid_type_error: "Create date is required" }),
    member_name: z.coerce.number().min(1, "Member name is required"),
    remark: z.string().optional(),
    status: z.string().min(1, "Status is required"),
    complete_date: z.preprocess(
      (val) => (val === "" || val == null ? undefined : val),
      z.date().optional(),
    ),
  })
  .refine(
    (data) => data.status !== "complete" || data.complete_date !== undefined,
    {
      message: "Complete date is required when status is complete",
      path: ["complete_date"],
    },
  );

type KopibengFormSchema = z.infer<typeof schema>;

function KopibengDetail() {
  const navigate = useNavigate();
  const { kopibengId } = Route.useParams();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const form = useForm<KopibengFormSchema>({
    defaultValues: {
      create_date: undefined,
      remark: "",
      status: "",
      complete_date: undefined,
    },
    resolver: zodResolver(schema),
  });

  const { handleSubmit, formState, reset } = form;
  const { isDirty } = formState;

  // Get single kopibeng
  const queryKey = ["kopibeng", kopibengId];
  const { data, isLoading, isError, refetch, isFetching } =
    useGetSingleKopibeng(
      queryKey,
      +kopibengId,
      {},
      {},
      { enabled: !!kopibengId },
    );

  const kopibeng = data?.kopibeng;

  useEffect(() => {
    if (!kopibeng) return;

    reset({
      create_date: kopibeng.create_date
        ? new Date(kopibeng.create_date)
        : undefined,
      member_name: kopibeng.member_name,
      remark: kopibeng.remark || "",
      status: kopibeng.status || "",
      complete_date: kopibeng.complete_date
        ? new Date(kopibeng.complete_date)
        : undefined,
    });
  }, [kopibeng, reset]);

  const { mutate: editKopibengDetail, isPending: isUpdating } = useEditKopibeng(
    {
      onSuccess: () => {
        toast.success("Kopibeng have been successfully updated");

        refetch();
      },
      onError: () => {
        toast.error("Failed to update kopibeng. Please try again.");
      },
    },
  );

  const { mutate: deleteKopibeng, isPending: isDeleting } = useDeleteKopibeng({
    onSuccess: () => {
      toast.success("Kopibeng has been deleted successfully");

      navigate({ to: "/kopibeng" });
    },
    onError: (error: any) => {
      toast.error(
        error?.data ||
          error?.message ||
          "Failed to delete kopibeng. Please try again.",
      );
    },
  });

  const handleOnSubmit = (data: KopibengFormSchema) => {
    editKopibengDetail({
      ...data,
      id: kopibengId,
      create_date: formatDisplayDate(data.create_date.toISOString()),
      complete_date: data.complete_date
        ? formatDisplayDate(data.complete_date.toISOString())
        : null,
    });
  };

  const handleOnDelete = () => {
    deleteKopibeng(kopibengId);
    setShowDeleteDialog(false);
  };

  const renderContent = () => {
    if (isLoading || isFetching) {
      return (
        <Card>
          <CardContent>
            <Loading size="md" showText text="Loading kopibeng details..." />
          </CardContent>
        </Card>
      );
    }

    if (isError || !kopibeng) {
      return (
        <ErrorDisplay
          title="Error Loading Kopibeng Details"
          message="We encountered an error while loading the kopibeng. Please try again."
          onRetry={refetch}
          retryText="Reload Data"
        />
      );
    }

    return (
      <>
        <FormProvider {...form}>
          <Card>
            <CardContent>
              <form
                id="kopibeng-create-form"
                onSubmit={handleSubmit(handleOnSubmit)}
              >
                <KopibengForm
                  initialStatus={kopibeng?.status || ""}
                  isUpdate={true}
                />
              </form>
            </CardContent>
          </Card>
        </FormProvider>
        <ConfirmDialog
          isOpen={showDeleteDialog}
          isLoading={isDeleting}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleOnDelete}
          title="Delete Leave"
          content={`Are you sure you want to delete? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
        />
      </>
    );
  };

  return (
    <ClassicLayout
      title="Kopi Beng"
      backButton
      actionButton={
        <div className="flex flex-row gap-3">
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
            variant="default"
            type="submit"
            form="kopibeng-create-form"
            disabled={isUpdating || !isDirty}
          >
            <div className="flex flex-row justify-center items-center gap-2">
              <SaveIcon className="w-4 h-4" />
              <p className="text-center">{isUpdating ? "Saving..." : "Save"}</p>
            </div>
          </Button>
        </div>
      }
      content={renderContent()}
    />
  );
}

export const Route = createFileRoute("/_app/kopibeng/$kopibengId")({
  component: KopibengDetail,
});
