import { createFileRoute, useRouter } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { ClassicLayout } from "@/components/ui/ClassicLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { toast } from "sonner";
import { useCreateIteration } from "@ttm/api";
// import withFeatureGuard from "@/components/guard/guard";
import moment from "moment";
import { useEffect } from "react";
import { DatePicker } from "@/components/ui/DatePicker";
import { TextInput } from "@/components/ui/TextInput";
import { IterationStatus } from "@ttm/api/types/models/iteration";
import { Plus } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  selected_date: z.date(),
  start_date: z.date(),
  end_date: z.date(),
});

type IterationFormSchema = z.infer<typeof schema>;

function IterationCreate() {
  const router = useRouter();
  const teamId = localStorage.getItem("teamId");

  const form = useForm<IterationFormSchema>({
    defaultValues: {
      name: "",
      selected_date: new Date(),
      start_date: new Date(),
      end_date: new Date(),
    },
    resolver: zodResolver(schema),
  });

  const {
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { isDirty },
  } = form;

  const selectedDate = watch("selected_date");

  useEffect(() => {
    if (selectedDate) {
      const momentDate = moment(selectedDate);

      const startOfWeek = momentDate.clone().startOf("isoWeek");
      const endOfWeek = momentDate.clone().endOf("isoWeek");

      setValue("start_date", startOfWeek.toDate());
      setValue("end_date", endOfWeek.toDate());
    }
  }, [selectedDate, setValue]);

  const { mutateAsync: createIteration, isPending } = useCreateIteration({
    onSuccess: (result) => {
      const createdIteration = result?.iteration;

      if (createdIteration?.id) {
        toast.success("Iteration has been created successfully");

        router.navigate({
          to: "/iteration/$iterationId",
          params: { iterationId: createdIteration.id.toString() },
          replace: true,
        });
      }
    },
    onError: () => {
      toast.error("Failed to create iteration. Please try again.");
    },
  });

  const onSubmit = async (data: IterationFormSchema) => {
    if (!teamId) {
      toast.error(
        "Failed to create iteration. Please check in to a team first.",
      );
      return;
    }

    createIteration({
      name: data.name,
      start_date: moment(data.start_date).format("YYYY-MM-DD"),
      end_date: moment(data.end_date).format("YYYY-MM-DD"),
      team: teamId,
      status: IterationStatus.STATUS_DO,
    });
  };

  const startDate = watch("start_date");
  const endDate = watch("end_date");

  return (
    <ClassicLayout
      title="Create New Iteration"
      backButton
      actionButton={
        <Button
          type="submit"
          form="iteration-form"
          disabled={isPending || !isDirty}
        >
          <Plus className="w-4 h-4 mr-2" />
          {isPending ? "Creating..." : "Create"}
        </Button>
      }
      content={
        <Card className="h-[150px] sm:h-[175px] lg:h-[200px]">
          <CardContent className="flex flex-col gap-6 h-full">
            <FormProvider {...form}>
              <form
                id="iteration-form"
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <TextInput
                    title="Iteration Name"
                    name="name"
                    placeholder="Enter iteration name"
                    control={control}
                    required
                    className="text-base"
                    autoMargin={false}
                  />

                  <div className="flex flex-col gap-2">
                    <DatePicker
                      control={control}
                      name="selected_date"
                      formLabel="Iteration Date"
                      required
                    />

                    {selectedDate && (
                      <p className="text-s font-medium text-blue-700 mt-1 rounded-md bg-blue-50 p-4">
                        Week:{" "}
                        <span className="font-medium">
                          {moment(startDate).format("DD/MM/YYYY")}
                        </span>{" "}
                        –{" "}
                        <span className="font-medium">
                          {moment(endDate).format("DD/MM/YYYY")}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      }
    />
  );
}

// const ProtectedIterationManagement = withFeatureGuard(IterationCreate,"iteration");

export const Route = createFileRoute("/_app/iteration/new")({
  component: IterationCreate,
  //   component: ProtectedIterationManagement,
});
