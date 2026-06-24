import { createFileRoute } from "@tanstack/react-router";
import { useForm, FormProvider } from "react-hook-form";
import { Combobox } from "@/components/ui/Combobox";
import { useState } from "react";
import { ExampleSection } from "@/components/ui/ExampleSection";
import { PropsTable } from "@/components/ui/PropsTable";
import { CUSTOMER_TYPES } from "@ttm/api/types/choices";

const usageCode = `import { useForm, FormProvider } from "react-hook-form";
import { Combobox } from "@/components/ui/Combobox";

const CUSTOMER_TYPES = [
  { value: "earlybird", label: "Early Bird" },
  { value: "employee", label: "Employee" },
  { value: "prime", label: "T Privilege" },
  { value: "public", label: "Public" },
];

export default function Example() {
const form = useForm({ defaultValues: { customer_type: "" } });

return (
    <FormProvider {...form}>
    <form>
        <Combobox
            name="customer_type"
            formLabel="Customer Type"
            control={form.control}
            items={CUSTOMER_TYPES}
            placeholder="Select Customer Type"
            required
        />
    </form>
    </FormProvider>
);
}`;

const props = [
  {
    name: "name",
    type: "string",
    required: true,
    description: "Form field name for registration",
  },
  {
    name: "formLabel",
    type: "string",
    required: true,
    description: "Label displayed above the combobox",
  },
  {
    name: "items",
    type: "Item[]",
    defaultValue: "[]",
    description: "Array of options to display",
  },
  {
    name: "placeholder",
    type: "string",
    description: "Placeholder text when no option is selected",
  },
  {
    name: "readonly",
    type: "boolean",
    defaultValue: "false",
    description: "Disable user interaction",
  },
  {
    name: "defaultValue",
    type: "any",
    description: "Initial selected value",
  },
  {
    name: "formDescription",
    type: "string",
    description: "Helper text displayed below the field",
  },
];

function ComboboxGuidePage() {
  const [copiedCode, setCopiedCode] = useState("");
  const form = useForm({ defaultValues: { customer_type: "" } });

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-4 text-slate-900">Combobox</h1>
        <p className="text-lg text-slate-600">
          The{" "}
          <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
            Combobox
          </code>{" "}
          component provides a searchable dropdown with React Hook Form
          integration, validation, and custom styling.
        </p>
      </div>

      <ExampleSection
        title="Basic Usage"
        description={
          <>
            Combobox is used with{" "}
            <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
              control
            </code>{" "}
            and{" "}
            <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
              items
            </code>{" "}
            props. Each option should have{" "}
            <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
              label
            </code>{" "}
            and{" "}
            <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
              value
            </code>
            .
          </>
        }
        codeId="basic"
        code={usageCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
      >
        <FormProvider {...form}>
          <form className="space-y-4">
            <Combobox
              name="customer_type"
              formLabel="Customer Type"
              control={form.control}
              items={CUSTOMER_TYPES}
              placeholder="Select Customer Type"
              required
            />
          </form>
        </FormProvider>
      </ExampleSection>

      <PropsTable props={props} />
    </div>
  );
}
export const Route = createFileRoute("/_sandbox/developer-guide/combobox")({
  component: ComboboxGuidePage,
});
