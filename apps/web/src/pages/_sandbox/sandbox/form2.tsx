import { useState, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

//import { DateField, DatePicker } from "@/components/ui/DateField";
import { DatePicker } from "@/components/ui/DatePicker";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { PhoneNumberInput } from "@/components/ui/PhoneNumberInput";
import { TextInput } from "@/components/ui/TextInput";
import { TimeInput } from "@/components/ui/TimeInput";
import { TitleCombobox } from "@/components/ui/TitleCombobox";
// import { OCCUPATION } from "@ttm/api/types/choices";
// import { TagInput } from "@/components/ui/tag-input/ProductTagInput";

export const Choice = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

function SandboxForm() {
  // Define the validation schema
  const formSchema = z.object({
    mutli_select: z.string().array().optional(),
    date: z.string(),
    mobile: z.string(),
    title: z.string(),
    time: z.object({
      hour: z.number(),
      minute: z.number(),
      second: z.number(),
    }),
  });

  const formMethods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mutli_select: "",
      date: "",
      mobile: "",
      title: "",
      time: "",
    },
  });

  const { watch, control } = formMethods;

  // Watch the mobile field
  const mobile = watch("mobile");

  useEffect(() => {
    console.log("Mobile value:", mobile);
  }, [mobile]);

  const handleStartAtChange = (data: any) => {
    setValue(
      "end_at",
      {
        hour: data.hour + 1,
        minute: data.minute,
        second: 0,
      },
      { shouldValidate: true },
    );
  };

  const [resetField, setResetField] = useState(false);

  return (
    <FormProvider {...formMethods}>
      <div className="pb-2">Form 2 example</div>
      <div className="flex flex-col items-center">
        <form className="grid grid-cols-1 gap-3">
          <MultiSelect
            name="mutli_select"
            formLabel="Multi-Select"
            control={formMethods.control}
            valueField="id"
            labelField="name"
            placeholder="Status"
            className="w-full"
            iconName="smile"
            resetField={resetField}
            items={Choice.filter((option) => {
              return option.value;
            })}
            endpoint={""}
            dataKey={""}
          />

          <DatePicker
            control={formMethods.control}
            name="date"
            formLabel="Date"
          ></DatePicker>

          <TimeInput
            control={formMethods.control}
            name="time"
            formLabel="Time"
            onPostChange={handleStartAtChange}
          />

          <PhoneNumberInput
            control={formMethods.control}
            name="mobile"
            formLabel="Mobile Number"
          ></PhoneNumberInput>

          <TextInput
            title="Text Input"
            name="title"
            placeholder="Add title"
            control={formMethods.control}
          />

          {/* <TitleCombobox
            name="occupation"
            formLabel="Occupation"
            control={formMethods.control}
            items={OCCUPATION}
            placeholder="Select Occupation"
          /> */}

          {/* <TagInput
            control={formMethods.control}
            name="tags"
            formLabel="Tags"
            placeholder="Tags"
            iconName="user"
            callApiOnRemove={true}
          ></TagInput> */}

          {/* <DatePicker label="Pick a date">
            <DateField />
          </DatePicker> */}
        </form>
      </div>
    </FormProvider>
  );
}

export const Route = createFileRoute("/_sandbox/sandbox/form2")({
  component: SandboxForm,
});
