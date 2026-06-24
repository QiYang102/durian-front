import { useFormContext } from "react-hook-form";
import { TextInput } from "@/components/ui/TextInput";
import { Text } from "@/components/ui/Text";
import { Separator } from "@/components/ui/Separator";
import UserAvatarUpload from "../user/UserAvatarUpload";

interface TeamFormProps {
  stacked?: boolean;
}

export function TeamForm({ stacked = false }: TeamFormProps) {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      {!stacked && (
        <div className="space-y-1">
          <Text variant="h3">Team Details</Text>
          <Separator />
        </div>
      )}
      <div
        className={
          stacked
            ? "flex flex-col gap-6"
            : "flex flex-col gap-6 sm:flex-row sm:items-start"
        }
      >
        <div className={stacked ? "w-full" : "sm:w-1/3"}>
          <UserAvatarUpload
            control={control}
            name="team_image"
            formLabel="Team Avatar"
          />
        </div>
        <div className={stacked ? "w-full" : "sm:w-2/3"}>
          <TextInput
            title="Name"
            name="name"
            placeholder="Enter Team Name"
            control={control}
            required
            className="text-base"
            autoMargin={false}
          />
        </div>
      </div>
    </div>
  );
}
