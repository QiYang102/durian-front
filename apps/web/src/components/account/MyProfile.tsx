import { useFormContext } from "react-hook-form";
import { TextInput } from "@/components/ui/TextInput";
import { PhoneNumberInput } from "@/components/ui/PhoneNumberInput";
import { Separator } from "@/components/ui/Separator";
import { Combobox } from "@/components/ui/Combobox";
import UserAvatarUpload from "../user/UserAvatarUpload";
import { ROLE_ITEMS } from "@ttm/api/types/choices";

export default function MyProfile() {
  const { control } = useFormContext();

  return (
    <div className="flex flex-col gap-6">
      <UserAvatarUpload
        control={control}
        name="image"
        formLabel="Profile Picture"
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
          maxLength={50}
        />

        <Combobox
          name="role"
          control={control}
          formLabel="Role"
          items={ROLE_ITEMS}
          placeholder="Select role"
          required
        />

        <TextInput
          title="Email"
          name="email"
          placeholder="Enter email"
          control={control}
          className="flex-1 text-base"
          autoMargin={false}
          required
        />

        <PhoneNumberInput
          formLabel="Mobile"
          control={control}
          name="mobile_number"
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
