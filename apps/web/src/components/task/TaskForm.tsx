import { useFormContext } from "react-hook-form";
import { TextInput } from "@/components/ui/TextInput";
import { AsyncCombobox } from "../ui/AsyncCombobox";
import { Textarea } from "../ui/TextArea";

export function TaskForm() {
  const { control } = useFormContext();

  return (
    <>
      <div className="grid grid-cols-1 gap-6">
        <Textarea
          name="description"
          formLabel="Description"
          control={control}
          placeholder="Enter task description"
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <AsyncCombobox
          name="user"
          formLabel="Member"
          control={control}
          endpoint="/users"
          dataKey="users"
          labelField="fullname"
          valueField="id"
          placeholder="Select member"
          searchPlaceholder="Search members..."
        />
        <TextInput
          title="Estimated Time"
          name="estimate_time"
          control={control}
          type="number"
          placeholder="e.g., 1.5"
          className="w-full"
          autoMargin={false}
          required
        />
      </div>
    </>
  );
}
