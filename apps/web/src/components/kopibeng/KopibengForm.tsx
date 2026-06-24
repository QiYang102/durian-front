import { useFormContext } from "react-hook-form";
import { AsyncCombobox } from "../ui/AsyncCombobox";
import { Textarea } from "../ui/TextArea";
import { Combobox } from "../ui/Combobox";
import { KOPIBENG_STATUS_CHOICE } from "@ttm/api/types/choices";
import { DatePicker } from "../ui/DatePicker";

interface KopibengFormProps {
  initialStatus: string;
  isUpdate: boolean;
}

export default function KopibengForm({
  initialStatus,
  isUpdate,
}: KopibengFormProps) {
  const { control, watch, setValue } = useFormContext();
  const status = watch("status");

  if (isUpdate) {
    if (initialStatus === "owing" && status === "complete") {
      setValue("complete_date", new Date());
    } else if (status === "owing") {
      setValue("complete_date", undefined);
    }
  }

  if (!isUpdate) {
    if (status === "owing") {
      setValue("complete_date", undefined);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <DatePicker
          title="Create Date"
          name="create_date"
          formLabel="Create Date"
          placeholder="Select create date"
          control={control}
          required
        />
      </div>
      <div>
        <AsyncCombobox
          name="member_name"
          formLabel="Member to buy Kopi Beng"
          control={control}
          endpoint="/users"
          dataKey="users"
          labelField="fullname"
          valueField="id"
          placeholder="Select member"
          searchPlaceholder="Search users..."
          required
        />
      </div>
      <div>
        <Textarea
          name="remark"
          formLabel="Remark"
          control={control}
          placeholder="e.g. Failed to complete task // Kopi to All or to qiyang"
        />
      </div>
      <div>
        <Combobox
          name="status"
          formLabel="Kopibeng Status"
          control={control}
          items={KOPIBENG_STATUS_CHOICE}
          placeholder="Select Kopibeng Status"
          required
        />
      </div>
      <div>
        {status === "complete" && (
          <DatePicker
            title="Complete Date"
            name="complete_date"
            formLabel="Complete Date"
            placeholder="Select complete date"
            control={control}
          />
        )}
      </div>
    </div>
  );
}
