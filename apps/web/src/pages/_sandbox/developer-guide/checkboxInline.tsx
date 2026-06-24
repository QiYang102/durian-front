import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ExampleSection } from "@/components/ui/ExampleSection";
import { PropsTable } from "@/components/ui/PropsTable";
import { CheckBoxInline } from "@/components/ui/CheckboxInline";

const basicUsageCode = `import { useForm } from "react-hook-form";
import { CheckBoxInline } from "@/components/ui/CheckboxInline";

export default function Example() {
  const form = useForm({
    defaultValues: { terms: false },
  });

  return (
    <FormProvider {...form}>
      <CheckBoxInline
        name="terms"
        formLabel="I agree to the terms"
        control={form.control}
      />
    </FormProvider>
  );
}`;

const props = [
  {
    name: "name",
    type: "string",
    description: "Field name for react-hook-form.",
    required: true,
  },
  {
    name: "formLabel",
    type: "string",
    description: "Text label displayed next to the checkbox.",
    required: true,
  },
  {
    name: "control",
    type: "Control (RHF)",
    description: "The control object from react-hook-form.",
    required: true,
  },
  {
    name: "iconName",
    type: "string",
    description: "Optional icon name to display before the label.",
  },
  {
    name: "readonly",
    type: "boolean",
    defaultValue: "false",
    description: "Disables user interaction.",
  },
  {
    name: "onPostChange",
    type: "(value: boolean | 'indeterminate') => void",
    description: "Callback fired after the value changes.",
  },
  {
    name: "formDescription",
    type: "string",
    defaultValue: `""`,
    description: "Optional helper text below the field.",
  },
  {
    name: "required",
    type: "boolean",
    defaultValue: "false",
    description: "Marks the field as required.",
  },
];

function CheckboxInlineGuidePage() {
  const [copiedCode, setCopiedCode] = useState("");
  const form = useForm({
    defaultValues: {
      terms: false,
    },
  });

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-4 text-slate-900">
          CheckboxInline
        </h1>
        <p className="text-lg text-slate-600">
          The{" "}
          <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
            CheckBoxInline
          </code>{" "}
          component is a styled checkbox field integrated with{" "}
          <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
            react-hook-form
          </code>
          . It supports variants, icons, and form validation.
        </p>
      </div>
      <FormProvider {...form}>
        <ExampleSection
          title="Basic Usage"
          description="A simple inline checkbox integrated with react-hook-form."
          codeId="basic"
          code={basicUsageCode}
          copiedCode={copiedCode}
          setCopiedCode={setCopiedCode}
        >
          <CheckBoxInline
            name="terms"
            formLabel="I agree to the terms"
            control={form.control}
          />
        </ExampleSection>
      </FormProvider>

      <PropsTable props={props} />
    </div>
  );
}

export const Route = createFileRoute(
  "/_sandbox/developer-guide/checkboxInline",
)({
  component: CheckboxInlineGuidePage,
});
