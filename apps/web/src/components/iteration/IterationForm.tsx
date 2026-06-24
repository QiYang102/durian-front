import { useFormContext } from "react-hook-form";
import { TextInput } from "@/components/ui/TextInput";
import { DatePicker } from "../ui/DatePicker";
import { Combobox } from "../ui/Combobox";
import { STATUS } from "@ttm/api/types/choices";

export function IterationForm() {
  const { control } = useFormContext();

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <TextInput
        title="Iteration Name"
        name="name"
        placeholder="Enter Iteration Name"
        control={control}
        required
        className="text-base w-full"
        autoMargin={false}
        disabled
      />

      <DatePicker
        control={control}
        name="start_date"
        formLabel="Start Date"
        className="w-full"
        readonly
      />

      <DatePicker
        control={control}
        name="end_date"
        formLabel="End Date"
        className="w-full"
        readonly
      />

      <Combobox
        name="status"
        formLabel="Status"
        control={control}
        items={STATUS}
        placeholder="Select Status"
        className="w-full"
        readonly
      />
    </div>
  );
}
