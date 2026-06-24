import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { ExampleSection } from "@/components/ui/ExampleSection";
import { PropsTable } from "@/components/ui/PropsTable";

const basicUsageCode = `import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Button } from "@/components/ui/Button";

export default function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Delete Item</Button>
      <ConfirmDialog
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          alert("Confirmed!");
          setOpen(false);
        }}
        title="Delete Item"
        content="Are you sure you want to delete this item?"
        confirmText="Delete"
        cancelText="Cancel"
      />
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
    name: "title",
    type: "string",
    required: true,
    description: "Dialog title displayed at the top.",
  },
  {
    name: "content",
    type: "ReactNode",
    required: true,
    description: "Dialog content (text, description, or JSX).",
  },
  {
    name: "confirmText",
    type: "string",
    required: true,
    description: "Label for the confirm button.",
  },
  {
    name: "cancelText",
    type: "string",
    description: "Optional label for the cancel button.",
  },
  {
    name: "confirmTrackEventName",
    type: "string",
    description: "Analytics event name for confirm action.",
  },
  {
    name: "cancelTrackEventName",
    type: "string",
    description: "Analytics event name for cancel action.",
  },
];

function ConfirmDialogGuidePage() {
  const [copiedCode, setCopiedCode] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-4 text-slate-900">
          ConfirmDialog
        </h1>
        <p className="text-lg text-slate-600">
          The{" "}
          <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
            ConfirmDialog
          </code>{" "}
          component displays a confirmation dialog with a title, content, and
          confirm/cancel buttons. It is commonly used for destructive actions
          like deletions.
        </p>
      </div>

      <ExampleSection
        title="Basic Usage"
        description="Open a confirmation dialog when a user performs a critical action."
        codeId="basic"
        code={basicUsageCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
      >
        <>
          <Button onClick={() => setOpen(true)}>Delete Item</Button>
          <ConfirmDialog
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={() => {
              alert("Confirmed!");
              setOpen(false);
            }}
            title="Delete Item"
            content="Are you sure you want to delete this item?"
            confirmText="Delete"
            cancelText="Cancel"
          />
        </>
      </ExampleSection>

      <PropsTable props={props} />
    </div>
  );
}

export const Route = createFileRoute(
  "/_sandbox/developer-guide/confirm-dialog",
)({
  component: ConfirmDialogGuidePage,
});
