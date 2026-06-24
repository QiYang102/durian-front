import { createFileRoute } from "@tanstack/react-router";
import { useForm, FormProvider } from "react-hook-form";
import { PhoneNumberInput } from "@/components/ui/PhoneNumberInput";
import { useState } from "react";
import { ExampleSection } from "@/components/ui/ExampleSection";
import { PropsTable } from "@/components/ui/PropsTable";

const basicUsageCode = `import { useForm, FormProvider } from "react-hook-form";
import { PhoneNumberInput } from "@/components/ui/PhoneNumberInput";

export default function Example() {
  const form = useForm({ defaultValues: { phoneNumber: "" } });

  return (
    <FormProvider {...form}>
      <form>
        <PhoneNumberInput
              name="contactNumber"
              formLabel="Contact Number"
              control={basicForm.control}
              required
            />
      </form>
    </FormProvider>
  );
}`;

const withDefaultValueCode = `import { useForm, FormProvider } from "react-hook-form";
import { PhoneNumberInput } from "@/components/ui/PhoneNumberInput";

export default function Example() {
  const form = useForm({ 
    defaultValues: { 
      userPhone: "60123456789" // Malaysian number without +
    } 
  });

  return (
    <FormProvider {...form}>
      <form>
        <PhoneNumberInput
              name="phoneNumber"
              formLabel="Contact Number"
              control={defaultValueForm.control}
              defaultValue="60123456789"
              required
            />
      </form>
    </FormProvider>
  );
}`;

const props = [
  {
    name: "defaultValue",
    type: "string",
    description: "Initial phone number value (without + prefix)",
  },
  {
    name: "required",
    type: "boolean",
    defaultValue: "false",
    description: "Whether the field is required (adds * to label)",
  },
  {
    name: "readonly",
    type: "boolean",
    defaultValue: "false",
    description: "Disable user interaction with the input",
  },
];

function PhoneNumberInputGuidePage() {
  const [copiedCode, setCopiedCode] = useState("");

  const basicForm = useForm({
    defaultValues: {
      phoneNumber: "",
    },
  });

  const defaultValueForm = useForm({
    defaultValues: {
      userPhone: "60123456789",
    },
  });

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-4 text-slate-900">
          PhoneNumberInput
        </h1>
        <p className="text-lg text-slate-600">
          The{" "}
          <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
            PhoneNumberInput
          </code>{" "}
          component provides international phone number input with country flag
          selection and automatic formatting.
          Defaults to Malaysia (MY) country code.
        </p>
      </div>

      <ExampleSection
        title="Basic Usage"
        description={
          <>
            Basic phone number input with Malaysian country code as default. The
            component automatically formats the display and handles country
            selection.
          </>
        }
        codeId="basic"
        code={basicUsageCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
      >
        <FormProvider {...basicForm}>
          <form className="space-y-4 bg-white p-2">
            <PhoneNumberInput
              name="contactNumber"
              formLabel="Contact Number"
              control={basicForm.control}
              required
            />
          </form>
        </FormProvider>
      </ExampleSection>

      <ExampleSection
        title="With Default Value"
        description={
          <>
            Initialize the phone input with a default value. Provide the number
            without the "+" prefix.
          </>
        }
        codeId="default-value"
        code={withDefaultValueCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
      >
        <FormProvider {...defaultValueForm}>
          <form className="space-y-4 bg-white p-2">
            <PhoneNumberInput
              name="phoneNumber"
              formLabel="Contact Number"
              control={defaultValueForm.control}
              defaultValue="60123456789"
              required
            />
          </form>
        </FormProvider>
      </ExampleSection>

      <PropsTable props={props} />
    </div>
  );
}

export const Route = createFileRoute(
  "/_sandbox/developer-guide/phone-number-input",
)({
  component: PhoneNumberInputGuidePage,
});
