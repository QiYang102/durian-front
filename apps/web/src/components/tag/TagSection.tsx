import { Card, CardContent } from "../ui/Card";
import { Text } from "../ui/Text";
import { CustomDialog } from "../ui/CustomDialog";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TagForm from "./TagForm";
import TagList from "./TagList";
import { useCreateTag } from "@ttm/api";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(1, ""),
  color: z.string().min(1, ""),
});

type TagFormSchema = z.infer<typeof schema>;

export default function TagSection({ storyId }: { storyId: string }) {
  const [showAddDialog, setShowAddDialog] = useState(false);

  const form = useForm<TagFormSchema>({
    defaultValues: {
      name: "",
      color: "info",
    },
    resolver: zodResolver(schema),
  });

  const { handleSubmit, reset, formState } = form;
  const { isDirty } = formState;

  useEffect(() => {
    if (showAddDialog) {
      reset();
    }
  }, [showAddDialog, form]);

  const { mutate, isPending } = useCreateTag({
    onSuccess: () => {
      setShowAddDialog(false);
      toast.success("Tag has been created successfully");
    },
    onError: (error: any) => {
      const errorMessage = error?.data
        ? typeof error.data === "string"
          ? error.data
          : error.data.error
        : error?.message || "Failed to create tag. Please try again.";

      toast.error(errorMessage);
    },
  });

  const handleCreate = (data: TagFormSchema) => {
    mutate({
      storyId: storyId,
      name: data.name.trim(),
      color: data.color,
    });
  };

  return (
    <Card>
      <CardContent className="flex flex-col gap-6 w-full">
        <div className="flex items-center justify-between">
          <Text variant="h3">Story Tags</Text>
        </div>
        <TagList
          storyId={storyId}
          setShowAddDialog={setShowAddDialog}
          isPending={isPending}
        />

        <CustomDialog
          isOpen={showAddDialog}
          onClose={() => {
            setShowAddDialog(false);
            reset();
          }}
          onConfirm={handleSubmit(handleCreate)}
          confirmText={`${isPending ? "Creating..." : "Create Tag"}`}
          title="Story Tag"
          contentClassName="!max-w-[700px] w-[90%]"
          isLoading={isPending || !isDirty}
        >
          <FormProvider {...form}>
            <form id="create-tag-form" className="flex flex-col gap-6">
              <TagForm />
            </form>
          </FormProvider>
        </CustomDialog>
      </CardContent>
    </Card>
  );
}
