import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ExampleSection } from "@/components/ui/ExampleSection";
import { PropsTable } from "@/components/ui/PropsTable";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

const basicUsageCode = `import { Icon } from "@/components/ui/Icon";

export default function Example() {
  return (
    <div className="space-y-4">
      <Icon name="home" />
      <Icon name="user-circle" />
      <Icon name="shopping-cart" />
      <Icon name="bell" />
    </div>
  );
}`;

const fillVariantsCode = `import { Icon } from "@/components/ui/Icon";

export default function Example() {
  return (
    <div className="space-y-6">
      {/* Fill variants */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Fill Variants</h3>
        <div className="flex items-center space-x-8">
          <div className="flex flex-col items-center space-y-2">
            <Icon name="circle" size="3xl" />
            <span className="text-xs">No Fill</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Icon name="circle" fill="success" size="3xl" />
            <span className="text-xs">Success Fill</span>
          </div>
        </div>
      </div>
      
    </div>
  );
}`;

const useCasesCode = `import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";

export default function Example() {
  return (
    <div className="space-y-8">
      {/* Button with icons */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Button Examples</h3>
        <div className="flex space-x-4">
          <Button className="flex items-center space-x-2">
            <Icon name="plus" size="sm" color={"white"} />
            <span>Add Item</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Icon name="download" size="sm" />
            <span>Download</span>
          </Button>
          <Button variant="destructive" className="flex items-center space-x-2">
            <Icon name="trash" size="sm" />
            <span>Delete</span>
          </Button>
        </div>
      </div>
    </div>
  );
}`;

const props = [
  {
    name: "name",
    type: "string",
    description: "Lucide icon name",
  },
  {
    name: "fill",
    type: '"success" | "danger" | "disabled" | string',
    defaultValue: '"transparent"',
    description: "Fill color for the icon (predefined values or custom color)",
  },
];

function IconGuidePage() {
  const [copiedCode, setCopiedCode] = useState("");

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-4 text-slate-900">Icon</h1>
        <p className="text-lg text-slate-600">
          The{" "}
          <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
            Icon
          </code>{" "}
          component provides access to Lucide React icons with customizable
          sizes, colors, and fill options.
        </p>
      </div>

      <ExampleSection
        title="Basic Usage"
        description={
          <>
            Simple icon usage with default size and color. Use kebab-case names
            that match Lucide React icon names. The component automatically
            converts them to the correct format.
          </>
        }
        codeId="basic"
        code={basicUsageCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
      >
        <div className="flex items-center space-x-4">
          <Icon name="home" />
          <Icon name="user-circle" />
          <Icon name="shopping-cart" />
          <Icon name="bell" />
        </div>
      </ExampleSection>

      <ExampleSection
        title="Fill Variants"
        description={
          <>
            Use the{" "}
            <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">fill</code>{" "}
            prop to add solid fills to icons. Supports predefined fills
            (success, danger, disabled) or custom colors for enhanced visual
            impact.
          </>
        }
        codeId="fill"
        code={fillVariantsCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
      >
        <div className="space-y-6">
          {/* Fill variants */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Fill Variants</h3>
            <div className="flex items-center space-x-8">
              <div className="flex flex-col items-center space-y-2">
                <Icon name="circle" size="3xl" />
                <span className="text-xs">No Fill</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Icon name="circle" fill="success" size="3xl" />
                <span className="text-xs">Success Fill</span>
              </div>
            </div>
          </div>
        </div>
      </ExampleSection>

      <ExampleSection
        title="Real-world Use Cases"
        description={
          <>
            Practical examples showing how icons integrate with buttons.
          </>
        }
        codeId="use-cases"
        code={useCasesCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
      >
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Button Examples</h3>
            <div className="flex space-x-4">
              <Button className="flex items-center space-x-2">
                <Icon name="plus" size="sm" color={"white"}/>
                <span>Add Item</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Icon name="download" size="sm" />
                <span>Download</span>
              </Button>
              <Button variant="destructive" className="flex items-center space-x-2">
                <Icon name="trash" size="sm" />
                <span>Delete</span>
              </Button>
            </div>
          </div>
        
        </div>
      </ExampleSection>

      <PropsTable props={props} />
    </div>
  );
}

export const Route = createFileRoute("/_sandbox/developer-guide/icon")({
  component: IconGuidePage,
});