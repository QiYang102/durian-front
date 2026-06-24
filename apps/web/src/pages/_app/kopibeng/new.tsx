import KopibengForm from "@/components/kopibeng/KopibengForm";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ClassicLayout } from "@/components/ui/ClassicLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCreateKopibeng } from "@ttm/api";
import { formatDisplayDate } from "@ttm/utils";
import { Plus } from "lucide-react";
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

export default function KopibengCreate() {
  const navigate = useNavigate();

  const form = useForm<KopibengFormSchema>({
    defaultValues: {
      create_date: undefined,
      remark: "",
      status: "",
      complete_date: undefined,
    },
    resolver: zodResolver(schema),
  });

  const { handleSubmit, formState } = form;
  const { isDirty } = formState;

  const { mutate: createKopibengDetail, isPending } = useCreateKopibeng({
    onSuccess: (result) => {
      toast.success("Kopibeng has been created successfully");

      navigate({
        to: "/kopibeng/$kopibengId",
        params: {
          kopibengId: result.kopibeng.id.toString(),
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
          : error?.message || "Failed to create story. Please try again.",
      );
    },
  });

  const handleSubmitForm = (data: KopibengFormSchema) => {
    createKopibengDetail({
      ...data,
      create_date: formatDisplayDate(data.create_date.toISOString()),
      complete_date: data.complete_date
        ? formatDisplayDate(data.complete_date.toISOString())
        : undefined,
    });
  };

  return (
    <ClassicLayout
      title="Create Kopi Beng"
      backButton
      actionButton={
        <Button
          variant="default"
          type="submit"
          form="kopibeng-create-form"
          disabled={isPending || !isDirty}
        >
          <div className="flex flex-row justify-center items-center gap-2">
            <Plus className="w-4 h-4" />
            <p className="text-center">
              {isPending ? "Creating..." : "Create"}
            </p>
          </div>
        </Button>
      }
      content={
        <FormProvider {...form}>
          <Card>
            <CardContent>
              <form
                id="kopibeng-create-form"
                onSubmit={handleSubmit(handleSubmitForm)}
              >
                <KopibengForm initialStatus={""} isUpdate={false} />
              </form>
            </CardContent>
          </Card>
        </FormProvider>
      }
    />
  );
}

export const Route = createFileRoute("/_app/kopibeng/new")({
  component: KopibengCreate,
});
