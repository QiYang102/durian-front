import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Checkbox } from "@/components/ui/Checkbox";
import { ExampleSection } from "@/components/ui/ExampleSection";
import { PropsTable } from "@/components/ui/PropsTable";

const basicUsageCode = `import { Checkbox } from "@/components/ui/Checkbox";

export default function Example() {
  return (
    <label className="flex items-center gap-2">
      <Checkbox />
      <span>Accept terms and conditions</span>
    </label>
  );
}`;

const disabledCode = `import { Checkbox } from "@/components/ui/Checkbox";

export default function Example() {
  return (
    <div className="flex flex-col gap-2">
      <Checkbox disabled defaultChecked />
      <Checkbox disabled />
    </div>
  );
}`;

const controlledCode = `import { useState } from "react";
import { Checkbox } from "@/components/ui/Checkbox";

export default function Example() {
  const [checked, setChecked] = useState(false);

  return (
    <label className="flex items-center gap-2">
      <Checkbox
        checked={checked}
        onCheckedChange={setChecked}
      />
      <span>{checked ? "Checked!" : "Unchecked"}</span>
    </label>
  );
}`;

const props = [
  {
    name: "checked",
    type: "boolean | 'indeterminate'",
    description: "Manually controls the checked state of the checkbox.",
  },
  {
    name: "defaultChecked",
    type: "boolean",
    description: "Sets the initial checked state when uncontrolled.",
  },
  {
    name: "onCheckedChange",
    type: "(checked: boolean | 'indeterminate') => void",
    description: "Callback fired when the checked state changes.",
  },
  {
    name: "disabled",
    type: "boolean",
    description: "Whether the checkbox is disabled.",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes for styling.",
  },
];

function CheckboxGuidePage() {
  const [copiedCode, setCopiedCode] = useState("");

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-4 text-slate-900">Checkbox</h1>
        <p className="text-lg text-slate-600">
          The{" "}
          <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
            Checkbox
          </code>{" "}
          component allows users to select one or multiple options in forms or
          settings.
        </p>
      </div>

      <ExampleSection
        title="Basic Usage"
        description="Combine a checkbox with a label for accessibility."
        codeId="basic"
        code={basicUsageCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
      >
        <label className="flex items-center gap-2">
          <Checkbox />
          <span>Accept terms and conditions</span>
        </label>
      </ExampleSection>

      <ExampleSection
        title="Disabled"
        description="A disabled checkbox cannot be interacted with."
        codeId="disabled"
        code={disabledCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
      >
        <div className="flex flex-col gap-2">
          <Checkbox disabled defaultChecked />
          <Checkbox disabled />
        </div>
      </ExampleSection>

      <ExampleSection
        title="Controlled"
        description="Manage the checked state with React state."
        codeId="controlled"
        code={controlledCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
      >
        {(() => {
          const [checked, setChecked] = useState(false);
          return (
            <label className="flex items-center gap-2">
              <Checkbox
                checked={checked}
                onCheckedChange={(value) => setChecked(value === true)}
              />
              <span>{checked ? "Checked!" : "Unchecked"}</span>
            </label>
          );
        })()}
      </ExampleSection>

      <PropsTable props={props} />
    </div>
  );
}

export const Route = createFileRoute("/_sandbox/developer-guide/checkbox")({
  component: CheckboxGuidePage,
});
