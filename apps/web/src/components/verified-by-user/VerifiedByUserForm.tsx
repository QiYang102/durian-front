import { useFormContext } from "react-hook-form";
import { TextInput } from "@/components/ui/TextInput";
import { AsyncCombobox } from "../ui/AsyncCombobox";

export function VerifiedByUserForm() {
  const { control } = useFormContext();

  return (
    <>
      <div className="grid grid-cols-1 gap-6">
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
          required
        />
      </div>
      <div className="grid grid-cols-1 gap-6">
        <TextInput
          title="Total Hours Logged"
          name="total_hour_used"
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
