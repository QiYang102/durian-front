import { CustomDialog } from "@/components/ui/CustomDialog";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditStory } from "@ttm/api";
import { toast } from "sonner";
import { Story } from "@ttm/api/types/models/story";
import { useEffect } from "react";
import { Combobox } from "../ui/Combobox";
import { DeploymentStatus } from "@ttm/api/types/enums";
import { DEPLOYMENT_STATUS_OPTIONS } from "@ttm/api/types/choices";

const schema = z.object({
  deployment_status: z.string().min(1, ""),
});

type DeploymentFormSchema = z.infer<typeof schema>;

interface UpdateDeploymentStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  story: Story;
}

export default function UpdateDeploymentStatusDialog({
  isOpen,
  onClose,
  story,
}: UpdateDeploymentStatusDialogProps) {
  const form = useForm<DeploymentFormSchema>({
    defaultValues: {
      deployment_status: story.deployment_status || DeploymentStatus.PENDING,
    },
    resolver: zodResolver(schema),
  });

  const { handleSubmit, reset, control } = form;

  useEffect(() => {
    if (isOpen) {
      reset({
        deployment_status: story.deployment_status || DeploymentStatus.PENDING,
      });
    }
  }, [isOpen, story.deployment_status, reset]);

  const editStory = useEditStory({
    onSuccess: () => {
      toast.success("Deployment status has been updated successfully");

      onClose();
    },
    onError: () => {
      toast.error("Failed to update deployment status. Please try again.");
    },
  });

  const handleUpdate = (data: DeploymentFormSchema) => {
    const now = new Date().toISOString();
    const payload: any = {
      id: String(story.id),
      deployment_status: data.deployment_status,
    };

    if (data.deployment_status === DeploymentStatus.STAGING) {
      payload.deployment_staging_status_at = now;
    } else if (data.deployment_status === DeploymentStatus.PRODUCTION) {
      payload.deployment_production_status_at = now;
    }

    editStory.mutate(payload);
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <CustomDialog
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={handleSubmit(handleUpdate)}
      confirmText="Update"
      title="Update Deployment Status"
      isLoading={editStory.isPending}
    >
      <FormProvider {...form}>
        <form id="update-deployment-form" className="flex flex-col gap-6">
          <Combobox
            name="deployment_status"
            formLabel="Deployment Status"
            control={control}
            items={DEPLOYMENT_STATUS_OPTIONS}
            placeholder="Select deployment status"
            className="w-full"
            required
          />
        </form>
      </FormProvider>
    </CustomDialog>
  );
}
