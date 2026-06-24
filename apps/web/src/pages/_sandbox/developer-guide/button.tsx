import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ExampleSection } from "@/components/ui/ExampleSection";
import { PropsTable } from "@/components/ui/PropsTable";
import { Icon } from "@/components/ui/Icon";

const basicUsageCode = `import { Button } from "@/components/ui/Button";

export default function Example() {
  return <Button>Click Me</Button>;
}`;

const variantsCode = `<div className="flex gap-2 flex-wrap">
  <Button variant="default">Default</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="outline">Outline</Button>
  <Button variant="outline-secondary">Outline Secondary</Button>
  <Button variant="destructive">Destructive</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="link">Link</Button>
  <Button variant="accent">Accent</Button>
  <Button variant="blank">Blank</Button>
</div>`;

const sizesCode = `<div className="flex gap-2 items-center flex-wrap">
  <Button size="sm">Small</Button>
  <Button size="default">Default</Button>
  <Button size="lg">Large</Button>
  <Button size="icon" variant="accent"><Icon name="star" /></Button>
</div>`;

const trackingCode = `import { Button } from "@/components/ui/Button";

export default function Example() {
  return (
    <Button 
      variant="default" 
      trackEventName="button_clicked"
    >
      Track Event
    </Button>
  );
}`;

const props = [
  {
    name: "variant",
    type: "'default' | 'secondary' | 'outline' | 'outline-secondary' | 'destructive' | 'ghost' | 'link' | 'accent' | 'blank'",
    defaultValue: "'default'",
    description: "Visual style of the button",
  },
  {
    name: "size",
    type: "'sm' | 'default' | 'lg' | 'icon'",
    defaultValue: "'default'",
    description: "Size of the button",
  },
  {
    name: "trackEventName",
    type: "string",
    description: "Optional analytics event name to track on click",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes",
  },
  {
    name: "children",
    type: "ReactNode",
    required: true,
    description: "Content of the button",
  },
];

function ButtonGuidePage() {
  const [copiedCode, setCopiedCode] = useState("");

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-4 text-slate-900">Button</h1>
        <p className="text-lg text-slate-600">
          The{" "}
          <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
            Button
          </code>{" "}
          component provides multiple visual styles, sizes, and integrates with
          analytics tracking.
        </p>
      </div>

      <ExampleSection
        title="Basic Usage"
        description="A simple button with default styling."
        codeId="basic"
        code={basicUsageCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
      >
        <Button>Click Me</Button>
      </ExampleSection>

      <ExampleSection
        title="Variants"
        description="Different visual styles are available via the `variant` prop."
        codeId="variants"
        code={variantsCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
      >
        <div className="flex gap-2 flex-wrap">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="outline-secondary">Outline Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="blank">Blank</Button>
        </div>
      </ExampleSection>

      <ExampleSection
        title="Sizes"
        description="Adjust the button size with the `size` prop."
        codeId="sizes"
        code={sizesCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
      >
        <div className="flex gap-2 items-center flex-wrap">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" variant="accent">
            <Icon name="star" />
          </Button>
        </div>
      </ExampleSection>

      <ExampleSection
        title="Tracking Events"
        description="Use the `trackEventName` prop to automatically send analytics events when clicked."
        codeId="tracking"
        code={trackingCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
      >
        <Button variant="default" trackEventName="button_clicked">
          Track Event
        </Button>
      </ExampleSection>

      <PropsTable props={props} />

      <div className="mt-6 text-sm text-slate-600">
        <p>
          <strong>Note:</strong> The <code>Button</code> component also inherits
          all native HTML <code>&lt;button&gt;</code> props such as{" "}
          <code>onClick</code>, <code>type</code>, <code>disabled</code>, etc.
        </p>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_sandbox/developer-guide/button")({
  component: ButtonGuidePage,
});
