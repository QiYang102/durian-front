import { useFormContext } from "react-hook-form";
import { Combobox } from "@/components/ui/Combobox";
import { Separator } from "@/components/ui/Separator";
import { TextInput } from "@/components/ui/TextInput";
import { PhoneNumberInput } from "@/components/ui/PhoneNumberInput";
import UserAvatarUpload from "./UserAvatarUpload";
import { ROLE_ITEMS } from "@ttm/api/types/choices";

interface UserFormProps {
  readOnly?: boolean;
}

export default function UserForm({ readOnly = false }: UserFormProps) {
  const { control } = useFormContext();

  return (
    <div className="flex flex-col gap-6">
      <UserAvatarUpload
        control={control}
        name="image"
        formLabel="Profile Picture"
        readOnly={readOnly}
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <TextInput
          title="Full Name"
          name="fullname"
          placeholder="Enter full name"
          control={control}
          required
          className="flex-1 text-base"
          autoMargin={false}
          disabled={readOnly}
          maxLength={50}
        />

        <TextInput
          title="Username"
          name="username"
          placeholder="Enter username"
          control={control}
          className="flex-1 text-base"
          required
          autoMargin={false}
          disabled={readOnly}
          maxLength={50}
        />

        <Combobox
          name="role"
          control={control}
          formLabel="Role"
          items={ROLE_ITEMS}
          placeholder="Select role"
          required
          readonly={readOnly}
        />

        <TextInput
          title="Email"
          name="email"
          placeholder="Enter email"
          control={control}
          className="flex-1 text-base"
          autoMargin={false}
          required
          disabled={readOnly}
        />

        <PhoneNumberInput
          formLabel="Mobile"
          control={control}
          name="mobile_number"
          readonly={readOnly}
        />

        <TextInput
          title="Capacity Per Week"
          name="capacity"
          placeholder=""
          control={control}
          className="flex-1 text-base"
          autoMargin={false}
          disabled
        />
      </div>

      <Separator />
    </div>
  );
}
