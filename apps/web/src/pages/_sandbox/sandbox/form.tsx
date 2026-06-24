import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { AsyncCombobox } from "@/components/ui/AsyncCombobox";
import { AsyncMultiSelect } from "@/components/ui/AsyncMultiSelect";
import { Button } from "@/components/ui/Button";
import { CheckBoxInline } from "@/components/ui/CheckboxInline";
import { DatePickerWithRange } from "@/components/ui/DatePickerWithRange";
import { RadioButton } from "@/components/ui/RadioButton";
import { Textarea } from "@/components/ui/TextArea";

// Define the validation schema
const formSchema = z.object({
  note: z.string(),
  text: z.string(),
  agree: z.boolean(),
  fruit: z.string(),
  start_at: z.date(),
  end_at: z.date(),
});

function SandboxButton() {
  const formMethods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      note: "",
      text: "",
      agree: false,
      start_at: "",
      end_at: "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = formMethods;

  const onSubmit = (data: any) => {
    console.log("Form data", data);
  };

  return (
    <FormProvider {...formMethods}>
      <div className="pb-2">Form 1 example</div>
      <div className="flex flex-col items-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full max-w-lg flex-col gap-2"
        >
          {/* Textarea component */}
          <Textarea
            name="note"
            formLabel="Text Area"
            control={formMethods.control}
            placeholder="Enter your note here"
          />

          <AsyncCombobox
            name="user"
            control={formMethods.control}
            formLabel="Async Combo Box"
            labelField={"fullname"}
            valueField={"id"}
            endpoint="/users"
            dataKey="users"
            placeholder="User"
          />

          <AsyncMultiSelect
            name="user"
            control={formMethods.control}
            formLabel="Async Multi Select"
            labelField={"fullname"}
            valueField={"id"}
            endpoint="/users"
            dataKey="users"
          />

          <CheckBoxInline
            name="agree"
            control={formMethods.control}
            formLabel="Tick to agree"
          />

          <RadioButton
            control={formMethods.control}
            name="fruit"
            formLabel="Favourite fruit"
            defaultValue={"apple"}
            className="data-[state=checked]:border-secondary text-secondary"
            options={[
              { value: "durian", label: "Durian" },
              { value: "apple", label: "Apple" },
              { value: "orange", label: "Orange" },
              { value: "grape", label: "Grape" },
            ]}
          />

          <DatePickerWithRange
            control={formMethods.control}
            start="start_at"
            end="end_at"
            formLabel="Date"
            placeholder="Select a date range"
          />

          <div className="mt-4">
            <Button type="submit" className="bg-blue-400 hover:bg-yellow-400">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}

export const Route = createFileRoute("/_sandbox/sandbox/form")({
  component: SandboxButton,
});
