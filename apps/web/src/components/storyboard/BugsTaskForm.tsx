import { useFormContext } from "react-hook-form";
import { AsyncCombobox } from "../ui/AsyncCombobox";
import { Textarea } from "../ui/TextArea";

export function BugsTaskForm() {
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
    </>
  );
}
