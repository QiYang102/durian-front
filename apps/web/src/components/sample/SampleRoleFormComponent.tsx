import { useFormContext } from "react-hook-form";
import { TextInput } from "../ui/TextInput";

export default function SampleRoleFormComponent() {
  const { control } = useFormContext();

  return (
    <fieldset className="flex flex-row gap-6">
      <TextInput
        title="Name"
        name="name"
        placeholder="Enter Role Name"
        control={control}
        required
        className="flex-1 text-base"
        autoMargin={false}
      ></TextInput>
      <TextInput
        title="Code"
        name="code"
        placeholder="Enter Role Code"
        control={control}
        required
        className="flex-1 text-base"
        autoMargin={false}
      ></TextInput>
    </fieldset>
  );
}
