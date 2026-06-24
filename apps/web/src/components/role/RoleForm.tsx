import { useFormContext } from "react-hook-form";
import { TextInput } from "@/components/ui/TextInput";
import { Text } from "@/components/ui/Text";
import { Separator } from "@/components/ui/Separator";

export function RoleForm() {
  const { control } = useFormContext();

  return (
    <>
      <div className="space-y-1">
        <Text variant="h3">Role Detail</Text>
        <Separator />
      </div>
      <div className="flex flex-col gap-6 sm:flex-row">
        <TextInput
          title="Name"
          name="name"
          placeholder="Enter Role Name"
          control={control}
          required
          className="flex-1 text-base"
          autoMargin={false}
        />
        <TextInput
          title="Code"
          name="code"
          placeholder="Enter Role Code"
          control={control}
          className="flex-1 text-base"
          autoMargin={false}
          required
        />
      </div>
    </>
  );
}