import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ClassicLayout } from "@/components/ui/ClassicLayout";
import { Button } from "@/components/ui/Button";
import { ExampleSection } from "@/components/ui/ExampleSection";
import { PropsTable } from "@/components/ui/PropsTable";

const basicUsageCode = `import { ClassicLayout } from "@/components/ui/ClassicLayout";
import { Button } from "@/components/ui/Button";

export default function Example() {
  return (
    <ClassicLayout
      title="Dashboard"
      actionButton={<Button>New</Button>}
      content={<div>Your main content goes here</div>}
    />
  );
}`;

const withBackButtonCode = `import { ClassicLayout } from "@/components/ui/ClassicLayout";

export default function Example() {
  return (
    <ClassicLayout
      title="Settings"
      backButton
      content={<div>Settings page content</div>}
    />
  );
}`;

const props = [
  {
    name: "title",
    type: "string",
    required: true,
    description: "The main page title displayed in the header.",
  },
  {
    name: "content",
    type: "ReactNode",
    required: true,
    description: "The main content area displayed below the header.",
  },
  {
    name: "actionButton",
    type: "ReactNode",
    description:
      "Optional action button displayed on the right side of the header.",
  },
  {
    name: "backButton",
    type: "boolean",
    description: "If true, displays a back button in the header.",
  },
  {
    name: "backButtonTrackEventName",
    type: "string",
    description:
      "Event name for analytics tracking when back button is clicked.",
  },
];

function ClassicLayoutGuidePage() {
  const [copiedCode, setCopiedCode] = useState("");

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-4 text-slate-900">
          ClassicLayout
        </h1>
        <p className="text-lg text-slate-600">
          The{" "}
          <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
            ClassicLayout
          </code>{" "}
          component provides a simple page layout with a header, optional back
          button, action button, and a content area.
        </p>
      </div>

      <ExampleSection
        title="Basic Usage"
        description="A layout with a title and optional action button."
        codeId="basic"
        code={basicUsageCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
      >
        <ClassicLayout
          title="Dashboard"
          actionButton={<Button>New</Button>}
          content={
            <div className="p-4 bg-gray-50 rounded">
              Your main content goes here
            </div>
          }
        />
      </ExampleSection>

      <ExampleSection
        title="With Back Button"
        description="Enable a back button for navigable pages."
        codeId="withBackButton"
        code={withBackButtonCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
      >
        <ClassicLayout
          title="Settings"
          backButton
          content={
            <div className="p-4 bg-gray-50 rounded">Settings page content</div>
          }
        />
      </ExampleSection>

      <PropsTable props={props} />
    </div>
  );
}

export const Route = createFileRoute(
  "/_sandbox/developer-guide/classic-layout",
)({
  component: ClassicLayoutGuidePage,
});
