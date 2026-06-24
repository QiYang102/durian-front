import { createFileRoute } from "@tanstack/react-router";
import { useForm, FormProvider } from "react-hook-form";
import { DatePicker } from "@/components/ui/DatePicker";
import { useState } from "react";
import { ExampleSection } from "@/components/ui/ExampleSection";
import { PropsTable } from "@/components/ui/PropsTable";

const basicUsageCode = `import { useForm, FormProvider } from "react-hook-form";
import { DatePicker } from "@/components/ui/DatePicker";

export default function Example() {
  const form = useForm({ defaultValues: { sampleDatePicker: "" } });

  return (
    <FormProvider {...form}>
      <form>
        <DatePicker
          name="sampleDatePicker"
          formLabel="Select a date"
          placeholder="Pick a date"
          control={form.control}
          required
        />
      </form>
    </FormProvider>
  );
}`;

const dateRestrictionCode = `import { useForm, FormProvider } from "react-hook-form";
import { DatePicker } from "@/components/ui/DatePicker";

const disablePastDates = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

export default function Example() {
  const form = useForm({ defaultValues: { eventDate: "" } });

  return (
    <FormProvider {...form}>
      <form>
        <DatePicker
          name="eventDate"
          formLabel="Event Date"
          placeholder="Choose event date"
          control={form.control}
          disableDates={disablePastDates}
          onPostChange={(date) => console.log('Date selected:', date)}
          formDescription="Past dates are disabled"
          required
        />
      </form>
    </FormProvider>
  );
}`;

const props = [
  {
    name: "readonly",
    type: "boolean",
    defaultValue: "false",
    description: "Disable user interaction",
  },
  {
    name: "disableDates",
    type: "(date: Date) => boolean",
    description: "Function to determine which dates should be disabled",
  },
  {
    name: "onPostChange",
    type: "(date: Date | undefined) => void",
    description: "Callback function called when date selection changes",
  },
];

function DatePickerGuidePage() {
  const [copiedCode, setCopiedCode] = useState("");
  const form = useForm({
    defaultValues: {
      sampleDatePicker: "",
      eventDate: "",
    },
  });

  const disablePastDates = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-4 text-slate-900">DatePicker</h1>
        <p className="text-lg text-slate-600">
          The{" "}
          <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
            DatePicker
          </code>{" "}
          component provides a calendar-based date selection with React Hook Form
          integration, validation, date restrictions, and custom styling.
        </p>
      </div>

      <ExampleSection
        title="Basic"
        description={
          <>
            DatePicker is used with{" "}
            <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
              control
            </code>{" "}
            prop for form integration. The component handles date formatting and
            validation automatically.
          </>
        }
        codeId="basic"
        code={basicUsageCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
      >
        <FormProvider {...form}>
          <form className="space-y-4">
            <DatePicker
              name="sampleDatePicker"
              formLabel="Select a date"
              placeholder="Pick a date"
              control={form.control}
              required
            />
          </form>
        </FormProvider>
      </ExampleSection>

      <ExampleSection
        title="Date Restrictions"
        description={
          <>
            Use{" "}
            <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
              disableDates
            </code>{" "}
            prop to disable specific dates. The function receives a Date object
            and returns true for dates that should be disabled.
          </>
        }
        codeId="restrictions"
        code={dateRestrictionCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
      >
        <FormProvider {...form}>
          <form className="space-y-4">
            <DatePicker
              name="eventDate"
              formLabel="Event Date"
              placeholder="Choose event date"
              control={form.control}
              disableDates={disablePastDates}
              formDescription="Past dates are disabled"
              required
            />
          </form>
        </FormProvider>
      </ExampleSection>

      <PropsTable props={props} />
    </div>
  );
}

export const Route = createFileRoute("/_sandbox/developer-guide/date-picker")({
  component: DatePickerGuidePage,
});