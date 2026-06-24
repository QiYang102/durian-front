import { useFormContext } from "react-hook-form";

import { EVENT_TYPE_OPTIONS } from "@ttm/api/types/models/eventCalendar";

import { DatePicker } from "@/components/ui/DatePicker";
import { Textarea } from "../ui/TextArea";
import { Combobox } from "../ui/Combobox";
import { AsyncCombobox } from "../ui/AsyncCombobox";

export default function LeaveForm() {
  const { control } = useFormContext();

  return (
    <div className="flex flex-col gap-6">
      <Combobox
        name="type"
        formLabel="Event Type"
        control={control}
        items={EVENT_TYPE_OPTIONS}
        placeholder="Select event type"
        searchPlaceholder="Search event types..."
        required
      />

      <AsyncCombobox
        name="user"
        formLabel="User"
        control={control}
        endpoint="/users"
        dataKey="users"
        labelField="fullname"
        valueField="id"
        placeholder="Select user"
        searchPlaceholder="Search users..."
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <DatePicker
          title="Start Date"
          name="start_date"
          formLabel="Start Date"
          placeholder="Select start date"
          control={control}
          required
          className="flex-1"
        />

        <DatePicker
          title="End Date"
          name="end_date"
          formLabel="End Date"
          placeholder="Select end date"
          control={control}
          required
          className="flex-1"
        />
      </div>

      <Textarea
        name="description"
        formLabel="Description"
        control={control}
        placeholder="Enter event description"
        required
        size="md"
        maxLength={500}
      />
    </div>
  );
}
