import { useState, useEffect } from "react";
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
import { TextInput } from "@/components/ui/TextInput";
import { Text } from "@/components/ui/Text";
import { AsyncCombobox } from "@/components/ui/AsyncCombobox";
import { Textarea } from "../ui/TextArea";
import { Badge } from "@/components/ui/Badge";
import { CreateStorySuccessDialog } from "./CreateStorySuccessDialog";
import { useCreateStory } from "@ttm/api";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  short_description: z.string().min(1, "Description is required"),
  project: z
    .union([z.string(), z.number()])
    .refine(
      (val) => val !== "" && val != null && val !== 0,
      "Project is required",
    ),
});

type CreateUserStorySchema = z.infer<typeof schema>;

interface CreateUserStoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreateUserStoryDialog = ({
  isOpen,
  onClose,
  onSuccess,
}: CreateUserStoryDialogProps) => {
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [createdStoryId, setCreatedStoryId] = useState<string>("");
  const [createdStoryName, setCreatedStoryName] = useState<string>("");

  const [teamId, setTeamId] = useState<string | null>(() =>
    localStorage.getItem("teamId"),
  );
  const [teamName, setTeamName] = useState<string | null>(() =>
    localStorage.getItem("teamName"),
  );

  const { mutate: createStory, isPending: isLoading } = useCreateStory({
    onSuccess: (data: any) => {
      const story = data?.story;
      const storyId = story?.id?.toString() || "";
      const storyName = story?.name || "";

      setCreatedStoryId(storyId);
      setCreatedStoryName(storyName);
      toast.success("User story has been created successfully");

      onSuccess?.();
      onClose();
      setShowSuccessDialog(true);
    },
    onError: (error: any) => {
      const errorMessage = error?.data
        ? typeof error.data === "string"
          ? error.data
          : JSON.stringify(error.data)
        : error?.message || "Failed to create user story. Please try again.";
      toast.error(errorMessage);
    },
  });

  const form = useForm<CreateUserStorySchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: undefined,
      short_description: undefined,
      project: undefined,
    },
  });

  const { control, handleSubmit, setValue, reset } = form;

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = (data: CreateUserStorySchema) => {
    const submitData = {
      name: data.name,
      short_description: data.short_description,
      project: Number(data.project),
      team: teamId ? Number(teamId) : undefined,
    };

    createStory(submitData);
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    setCreatedStoryId("");
    setCreatedStoryName("");
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const handleProjectChange = (value: string | number) => {
    setValue("project", value);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="flex max-h-[90vh] w-[80%] max-w-[600px] flex-col">
          <DialogHeader className="border-b border-gray-200 px-6 py-5">
            <DialogTitle className="text-xl font-semibold">
              Create User Story
            </DialogTitle>
            <Text variant="default" className="mt-1 text-sm text-gray-500">
              Fill in the details below to create user story.
            </Text>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {!teamId ? (
              <div className="flex flex-col items-center justify-center gap-4 py-12">
                <AlertCircle className="text-danger-500 h-16 w-16" />
                <div className="space-y-2 text-center">
                  <Text variant="h3">Team Check-In Required</Text>
                  <div>
                    <Text variant="default" className="text-gray-500">
                      Please check in to a team from the sidebar before creating
                      a user story.
                    </Text>
                  </div>
                </div>
                <Button
                  variant="default"
                  onClick={handleClose}
                  className="mt-4"
                >
                  Close
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-start gap-2">
                  <Badge color="blue" className="px-3">
                    {teamName}
                  </Badge>
                </div>
                <FormProvider {...form}>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-2">
                      <div>
                        <TextInput
                          name="name"
                          title="Title"
                          control={control}
                          placeholder="Enter story title"
                          required
                          disabled={isLoading}
                        />
                      </div>

                      <div>
                        <Textarea
                          name="short_description"
                          formLabel="Short Description"
                          control={control}
                          placeholder="Enter story short description"
                          required
                          disabled={isLoading}
                          size="md"
                          maxLength={255}
                        />
                      </div>

                      <div>
                        <AsyncCombobox
                          name="project"
                          formLabel="Project"
                          control={control}
                          endpoint={
                            teamId
                              ? `/projects?filter{team}=${teamId}`
                              : "/projects"
                          }
                          dataKey="projects"
                          labelField="name"
                          valueField="id"
                          placeholder="Select project"
                          searchPlaceholder="Search projects..."
                          onPostChange={handleProjectChange}
                          required
                          readonly={isLoading}
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
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <CreateStorySuccessDialog
        isOpen={showSuccessDialog}
        onClose={handleSuccessDialogClose}
        storyId={createdStoryId}
        storyName={createdStoryName}
      />
    </>
  );
};
