import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/Badge";
import { useState } from "react";
import { ExampleSection } from "@/components/ui/ExampleSection";
import { PropsTable } from "@/components/ui/PropsTable";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/Table";
import {
  CustomerType,
  CustomerTypeOption,
} from "@ttm/api/types/models/customer";

const basicUsageCode = `import { Badge } from "@/components/ui/Badge";

export default function Example() {
  return (
    <div className="flex gap-2 flex-wrap">
      <Badge color="success">Success</Badge>
      <Badge color="warning">Warning</Badge>
      <Badge color="danger">Danger</Badge>
      <Badge color="info">Info</Badge>
      <Badge color="default">Default</Badge>
    </div>
  );
}`;

const colorVariantsCode = `// Standard color variants
<div className="flex gap-2 flex-wrap">
  <Badge color="orange">Orange</Badge>
  <Badge color="blue">Blue</Badge>
  <Badge color="yellow">Yellow</Badge>
  <Badge color="green">Green</Badge>
  <Badge color="red">Red</Badge>
  <Badge color="gray">Gray</Badge>
  <Badge color="purple">Purple</Badge>
</div>`;

const themingCode = `// Theme variants with borders
<div className="flex gap-2 flex-wrap">
  <Badge color="black">Dark Theme</Badge>
  <Badge color="white">Light Theme</Badge>
  <Badge color="muted">Muted</Badge>
</div>`;

const customStylingCode = `<div className="flex gap-2 flex-wrap">
  <Badge 
    color="info" 
    className="px-4 py-2"
    textClassName="text-sm normal-case font-normal"
  >
    Custom Styling
  </Badge>
  <Badge 
    color="purple"
    textClassName="text-base normal-case"
  >
    Large Text
  </Badge>
</div>`;

const realWorldCode = `// Example usage inside a table cell
const CustomerType = {
  EMPLOYEE: "employee",
  PRIME: "prime",
  EARLY_BIRD: "earlybird",
  PUBLIC: "public",
};

const CustomerTypeOption = new Map([
  [CustomerType.EMPLOYEE, { chipVariant: "blue", chipTextVariant: "Employee" }],
  [CustomerType.PRIME, { chipVariant: "orange", chipTextVariant: "T Privilege" }],
  [CustomerType.EARLY_BIRD, { chipVariant: "gray", chipTextVariant: "Early Bird" }],
  [CustomerType.PUBLIC, { chipVariant: "purple", chipTextVariant: "Public" }],
]);

// Table column config
{
  accessorKey: "customer.customer_type",
  header: ({ column }) => (
    <Button
      variant="ghost"
      className="flex items-center gap-2"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      Customer Type
      <Icon name="arrow-down-up" className="h-4 w-4" color="gray" />
    </Button>
  ),
  cell: ({ row }) => (
    <Badge
      color={CustomerTypeOption.get(row.original.customer?.customer_type)?.chipVariant}
      className="truncate"
    >
      {CustomerTypeOption.get(row.original.customer?.customer_type)?.chipTextVariant}
    </Badge>
  ),
}`;

const props = [
  {
    name: "color",
    type: "'success' | 'warning' | 'danger' | 'info' | 'default' | 'muted' | 'black' | 'white' | 'orange' | 'blue' | 'yellow' | 'green' | 'red' | 'gray' | 'purple'",
    defaultValue: "'success'",
    description: "Color variant of the badge",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes for the badge container",
  },
  {
    name: "textClassName",
    type: "string",
    description: "Additional CSS classes for the text element",
  },
  {
    name: "children",
    type: "ReactNode",
    required: true,
    description: "Content to display inside the badge",
  },
];

function BadgeGuidePage() {
  const [copiedCode, setCopiedCode] = useState("");

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-4 text-slate-900">Badge</h1>
        <p className="text-lg text-slate-600">
          The{" "}
          <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">Badge</code>{" "}
          component displays status indicators, labels, or categories with clean
          color variants and optional bullet styling.
        </p>
      </div>

      <ExampleSection
        title="Basic Usage"
        description="Use semantic color variants to indicate various states or importance levels."
        codeId="basic"
        code={basicUsageCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
      >
        <div className="flex gap-2 flex-wrap">
          <Badge className="inline-flex items-center" color="success">
            Success
          </Badge>
          <Badge className="inline-flex items-center" color="warning">
            Warning
          </Badge>
          <Badge className="inline-flex items-center" color="danger">
            Danger
          </Badge>
          <Badge className="inline-flex items-center" color="info">
            Info
          </Badge>
          <Badge className="inline-flex items-center" color="default">
            Default
          </Badge>
        </div>
      </ExampleSection>

      <ExampleSection
        title="Color Variants"
        description="Clean color variants without borders for general categorization."
        codeId="colors"
        code={colorVariantsCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
      >
        <div className="flex gap-2 flex-wrap">
          <Badge className="inline-flex items-center" color="orange">
            Orange
          </Badge>
          <Badge className="inline-flex items-center" color="blue">
            Blue
          </Badge>
          <Badge className="inline-flex items-center" color="yellow">
            Yellow
          </Badge>
          <Badge className="inline-flex items-center" color="green">
            Green
          </Badge>
          <Badge className="inline-flex items-center" color="red">
            Red
          </Badge>
          <Badge className="inline-flex items-center" color="gray">
            Gray
          </Badge>
          <Badge className="inline-flex items-center" color="purple">
            Purple
          </Badge>
        </div>
      </ExampleSection>

      <ExampleSection
        title="Theme Colors"
        description="Theme-based variants with borders for high contrast scenarios."
        codeId="theme"
        code={themingCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
      >
        <div className="flex gap-2 flex-wrap">
          <Badge className="inline-flex items-center" color="black">
            Dark Theme
          </Badge>
          <Badge className="inline-flex items-center" color="white">
            Light Theme
          </Badge>
          <Badge className="inline-flex items-center" color="muted">
            Muted
          </Badge>
        </div>
      </ExampleSection>

      <ExampleSection
        title="Custom Styling"
        description="Override default styles with custom classes for padding, text size, and formatting."
        codeId="custom"
        code={customStylingCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
      >
        <div className="flex gap-2 flex-wrap">
          <Badge
            color="info"
            className="px-4 py-2 inline-flex items-center"
            textClassName="text-sm normal-case font-normal"
          >
            Custom Styling
          </Badge>
          <Badge
            color="purple"
            className="inline-flex items-center"
            textClassName="text-base normal-case"
          >
            Large Text
          </Badge>
        </div>
      </ExampleSection>

      <ExampleSection
        title="Real World Example"
        description="Using the Badge inside a customer table to visually represent customer types."
        codeId="realworld"
        code={realWorldCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
      >
        <Table>
          <TableBody>
            {[
              { name: "Alice", type: CustomerType.EMPLOYEE },
              { name: "Bob", type: CustomerType.PRIME },
              { name: "Charlie", type: CustomerType.EARLY_BIRD },
              { name: "Diana", type: CustomerType.PUBLIC },
            ].map((customer) => (
              <TableRow key={customer.name}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>
                  <Badge
                    className="inline-flex items-center"
                    color={
                      CustomerTypeOption.get(customer.type)?.chipVariant ||
                      "default"
                    }
                  >
                    {CustomerTypeOption.get(customer.type)?.chipTextVariant}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ExampleSection>

      <PropsTable props={props} />
    </div>
  );
}

export const Route = createFileRoute("/_sandbox/developer-guide/badge")({
  component: BadgeGuidePage,
});
