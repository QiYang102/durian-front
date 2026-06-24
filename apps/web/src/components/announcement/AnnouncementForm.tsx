import { useFormContext, Controller } from "react-hook-form";
import { Separator } from "@/components/ui/Separator";
import { TextInput } from "@/components/ui/TextInput";
import { DatePicker } from "@/components/ui/DatePicker";
import CkEditor from "../ui/CkEditor";
import { Checkbox } from "@/components/ui/Checkbox";

export default function AnnouncementForm() {
  const { control } = useFormContext();

  return (
    <div className="flex flex-col gap-6">
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

      <TextInput
          title="Title"
          name="name"
          placeholder="Enter announcement title"
          control={control}
          required
          className="flex text-base"
          autoMargin={false}
        />

      <CkEditor
        title="Description"
        name="description"
        placeholder="Enter announcement"
        control={control}
        className="flex-1"
        required
      />

       <div className="flex items-center space-x-2">
        <Controller
          name="is_live"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="is_live"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <label
          htmlFor="is_live"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Live Status
        </label>
      </div>

      <Separator />
    </div>
  );
}
