import { useFormContext } from "react-hook-form";
import { TextInput } from "@/components/ui/TextInput";
import { Text } from "@/components/ui/Text";
import { Separator } from "@/components/ui/Separator";
import { Combobox } from "@/components/ui/Combobox";
import {
  ENVIRONMENT,
  FRONTEND_BACKEND,
  MIGRATION,
} from "@ttm/api/types/choices";
import { Textarea } from "../ui/TextArea";

export function DeploymentTemplateForm() {
  const { control } = useFormContext();

  return (
    <>
      <div className="space-y-1">
        <Text variant="h3">Deployment Details</Text>
        <Separator />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <TextInput
          name="project_name"
          control={control}
          title="Project Name"
          placeholder="Enter project name"
          autoMargin={false}
        />

        <TextInput
          name="branch_name"
          control={control}
          title="Branch Name"
          placeholder="Enter branch name"
          autoMargin={false}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Combobox
          name="environment"
          formLabel="Environment"
          control={control}
          items={ENVIRONMENT}
          required
        />

        <Combobox
          name="migration"
          formLabel="Migration"
          control={control}
          items={MIGRATION}
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Combobox
          name="front_back"
          formLabel="Front/Back"
          control={control}
          items={FRONTEND_BACKEND}
          required
        />

        <TextInput
          name="repo"
          control={control}
          title="Repo"
          placeholder="Enter repo name"
          required
          autoMargin={false}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Textarea
          name="command"
          formLabel="Command"
          control={control}
          placeholder="Enter command"
        />

        <Textarea
          name="remark"
          formLabel="Remark"
          control={control}
          placeholder="Enter any remarks"
        />
      </div>
    </>
  );
}
