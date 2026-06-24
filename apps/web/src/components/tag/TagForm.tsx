import { useFormContext } from "react-hook-form";
import { PresetColorInput } from "../ui/PresetColorInput";
import { TextInput } from "../ui/TextInput";

export default function TagForm() {
  const { control } = useFormContext();

  return (
    <>
      <TextInput
        title="Tag Name"
        name="name"
        control={control}
        placeholder="e.g. Bugs"
        required
      />
      <PresetColorInput
        title="Tag Color"
        name="color"
        control={control}
        required
      />
    </>
  );
}
