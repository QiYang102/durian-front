import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CustomDialog } from "@/components/ui/CustomDialog";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { ExampleSection } from "@/components/ui/ExampleSection";
import { PropsTable } from "@/components/ui/PropsTable";
import { Combobox } from "@/components/ui/Combobox";
import { FormProvider, useForm } from "react-hook-form";
import { CUSTOMER_TYPES } from "@ttm/api/types/choices";

const basicUsageCode = `import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { CustomDialog } from "@/components/ui/CustomDialog";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { Combobox } from "@/components/ui/Combobox";
import { CUSTOMER_TYPES } from "@ttm/api/types/choices";

export default function Example() {
  const [open, setOpen] = useState(false);
  const form = useForm({ defaultValues: { customer_type: "" } });

  const onSubmit = (data: any) => {
    alert(\`Selected type: \${data.customer_type || "None"}\`);
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Custom Dialog</Button>
      <CustomDialog
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={form.handleSubmit(onSubmit)}
        title="Select Customer Type"
        confirmText="Confirm"
        cancelText="Cancel"
      >
        <Text variant="default">Please choose an option below:</Text>
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
      </CustomDialog>
    </>
  );
}`;

const secondaryActionCode = `import { useState } from "react";
import { CustomDialog } from "@/components/ui/CustomDialog";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";

export default function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Delete Dialog</Button>
      <CustomDialog
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          alert("Deleted permanently!");
          setOpen(false);
        }}
        onSecondaryConfirm={() => {
          alert("Archived instead!");
          setOpen(false);
        }}
        title="Delete Item?"
        confirmText="Delete"
        secondaryButtonText="Archive"
      >
        <Text variant="default">
          This action cannot be undone. Are you sure you want to{" "}
          <b>delete</b> this item? Or would you prefer to <b>archive</b> it instead?
        </Text>
      </CustomDialog>
    </>
  );
}`;

const props = [
  {
    name: "isOpen",
    type: "boolean",
    required: true,
    description: "Controls whether the dialog is open.",
  },
  {
    name: "onClose",
    type: "() => void",
    required: true,
    description: "Callback when the dialog is closed.",
  },
  {
    name: "onConfirm",
    type: "() => void",
    required: true,
    description: "Callback when the confirm button is clicked.",
  },
  {
    name: "onSecondaryConfirm",
    type: "() => void",
    description: "Callback when the secondary button is clicked.",
  },
  {
    name: "title",
    type: "string",
    required: true,
    description: "Dialog title displayed at the top.",
  },
  {
    name: "children",
    type: "ReactNode",
    required: true,
    description: "Custom content inside the dialog body.",
  },
  {
    name: "confirmText",
    type: "string",
    required: true,
    description: "Label for the confirm button.",
  },
  {
    name: "secondaryButtonText",
    type: "string",
    description: "Optional label for the secondary button.",
  },
  {
    name: "cancelText",
    type: "string",
    description: "Optional label for the cancel button.",
  },
];
function CustomDialogGuidePage() {
  const [copiedCode, setCopiedCode] = useState("");
  const [openBasic, setOpenBasic] = useState(false);
  const [openSecondary, setOpenSecondary] = useState(false);

  const form = useForm({ defaultValues: { customer_type: "" } });
  const onSubmit = (data: any) => {
    alert(`Selected type: ${data.customer_type || "None"}`);
    setOpenBasic(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-4 text-slate-900">CustomDialog</h1>
        <p className="text-lg text-slate-600">
          The{" "}
          <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
            CustomDialog
          </code>{" "}
          component is a flexible dialog that supports multiple action buttons,
          custom children content, and an optional footer. Use it for
          confirmation flows, forms, or complex modals.
        </p>
      </div>

      <ExampleSection
        title="Basic Usage with Combobox"
        description="You can place any custom content inside the dialog body, such as a Combobox selection."
        codeId="basic"
        code={basicUsageCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
      >
        <>
          <Button onClick={() => setOpenBasic(true)}>Open Custom Dialog</Button>
          <CustomDialog
            isOpen={openBasic}
            onClose={() => setOpenBasic(false)}
            onConfirm={form.handleSubmit(onSubmit)}
            title="Select Customer Type"
            confirmText="Confirm"
            cancelText="Cancel"
          >
            <Text variant="default">Please choose an option below:</Text>
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
          </CustomDialog>
        </>
      </ExampleSection>

      <ExampleSection
        title="With Secondary Action"
        description="Use the secondary action button for alternate choices, such as 'Archive instead of Delete'."
        codeId="secondary"
        code={secondaryActionCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
      >
        <>
          <Button onClick={() => setOpenSecondary(true)}>
            Open Delete Dialog
          </Button>
          <CustomDialog
            isOpen={openSecondary}
            onClose={() => setOpenSecondary(false)}
            onConfirm={() => {
              alert("Deleted permanently!");
              setOpenSecondary(false);
            }}
            onSecondaryConfirm={() => {
              alert("Archived instead!");
              setOpenSecondary(false);
            }}
            title="Delete Item?"
            confirmText="Delete"
            secondaryButtonText="Archive"
          >
            <Text variant="default">
              This action cannot be undone. Are you sure you want to{" "}
              <b>delete</b> this item? Or would you prefer to <b>archive</b> it
              instead?
            </Text>
          </CustomDialog>
        </>
      </ExampleSection>

      <PropsTable props={props} />
    </div>
  );
}

export const Route = createFileRoute("/_sandbox/developer-guide/custom-dialog")(
  {
    component: CustomDialogGuidePage,
  },
);
