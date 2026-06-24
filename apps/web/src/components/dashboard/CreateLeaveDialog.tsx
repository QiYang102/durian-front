//create Leave dialog
import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { Combobox } from "@/components/ui/Combobox";
import { AsyncCombobox } from "@/components/ui/AsyncCombobox";
import { DatePicker } from "@/components/ui/DatePicker";
import { Textarea } from "@/components/ui/TextArea";
import { EVENT_TYPE_OPTIONS } from "@ttm/api/types/models/eventCalendar";
import { useCreateEventCalendar } from "@ttm/api/modules/eventCalendar";
import { toast } from "sonner";
import { formatDisplayDate } from "@ttm/utils";

const schema = z.object({
  type: z.string().min(1, "Event type is required"),
  user: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.number().nullable().optional(),
  ),
  start_date: z.date({ required_error: "Start date is required" }),
  end_date: z.date({ required_error: "End date is required" }),
  description: z.string().min(1, "Description is required"),
});

type CreateLeaveSchema = z.infer<typeof schema>;

interface CreateLeaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreateLeaveDialog = ({
  isOpen,
  onClose,
  onSuccess,
}: CreateLeaveDialogProps) => {
  const { mutate: createEventCalendar, isPending: isLoading } =
    useCreateEventCalendar({
      onSuccess: () => {
        toast.success("Leave has been created successfully");
        onSuccess?.();
        onClose();
      },
      onError: (error: any) => {
        const errorMessage = error?.data
          ? typeof error.data === "string"
            ? error.data
            : JSON.stringify(error.data)
          : error?.message || "Failed to create leave. Please try again.";

        toast.error(errorMessage);
      },
    });

  const form = useForm<CreateLeaveSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: undefined,
      user: undefined,
      start_date: undefined,
      end_date: undefined,
      description: undefined,
    },
  });

  const { control, handleSubmit, setValue, reset } = form;

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = (data: CreateLeaveSchema) => {
    const formattedData = {
      ...data,
      start_date: formatDisplayDate(data.start_date.toISOString()),
      end_date: formatDisplayDate(data.end_date.toISOString()),
    };
    createEventCalendar(formattedData);
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const handleEventTypeChange = (value: string) => {
    setValue("type", value);
  };

  const handleUserChange = (value: number) => {
    setValue("user", value);
  };

  const handleStartDateChange = (date: Date) => {
    const formattedDate = formatDisplayDate(date.toISOString());
    setValue("start_date", formattedDate);
  };

  const handleEndDateChange = (date: Date) => {
    const formattedDate = formatDisplayDate(date.toISOString());
    setValue("end_date", formattedDate);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="flex max-h-[90vh] w-[80%] max-w-[600px] flex-col">
        <DialogHeader className="border-b border-gray-200 px-6 py-5">
          <DialogTitle className="text-xl font-semibold">
            Create Leave
          </DialogTitle>
          <Text variant="default" className="mt-1 text-sm text-gray-500">
            Fill in the details below to create leave.
          </Text>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Combobox
                      name="type"
                      formLabel="Event Type"
                      control={control}
                      items={EVENT_TYPE_OPTIONS}
                      placeholder="Select event type"
                      searchPlaceholder="Search event types..."
                      onPostChange={handleEventTypeChange}
                      required
                      readonly={isLoading}
                    />
                  </div>

                  <div>
                    <AsyncCombobox
                      name="user"
                      formLabel="User"
                      control={control}
                      endpoint="/users"
                      dataKey="users"
                      labelField="fullname"
                      valueField="id"
                      placeholder="Select user"
                      searchPlaceholder="Search users..."
                      onPostChange={handleUserChange}
                      readonly={isLoading}
                    />
                  </div>

                  <div>
                    <DatePicker
                      title="Start Date"
                      name="start_date"
                      formLabel="Start Date"
                      placeholder="Select start date"
                      control={control}
                      required
                      readonly={isLoading}
                    />
                  </div>

                  <div>
                    <DatePicker
                      name="end_date"
                      formLabel="End Date"
                      control={control}
                      placeholder="Select end date"
                      required
                      readonly={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <Textarea
                    name="description"
                    formLabel="Description"
                    control={control}
                    placeholder="Enter event description"
                    required
                    disabled={isLoading}
                    size="md"
                    maxLength={500}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-5">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="px-6"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="default"
                    disabled={isLoading}
                    className="bg-black px-6 text-white hover:bg-gray-800"
                  >
                    {isLoading ? "Creating..." : "Create"}
                  </Button>
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
};
