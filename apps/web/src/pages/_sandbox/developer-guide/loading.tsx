import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ExampleSection } from "@/components/ui/ExampleSection";
import { PropsTable } from "@/components/ui/PropsTable";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import { Card, CardContent } from "@/components/ui/Card";

const basicUsageCode = `import { Loading } from "@/components/ui/Loading";

export default function Example() {
  return (
    <div className="p-4">
      <Loading />
    </div>
  );
}`;

const withTextCode = `import { Loading } from "@/components/ui/Loading";

export default function Example() {
  return (
    <div className="space-y-6">
      <Loading showText text="Processing payment..." size="lg" />
    </div>
  );
}`;

const colorsCode = `import { Loading } from "@/components/ui/Loading";

export default function Example() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Loading color="default" />
        <span className="text-sm">Default</span>
      </div>
    </div>
  );
}`;

const realWorldCode = `import { Loading } from "@/components/ui/Loading";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useState } from "react";

export default function Example() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  const fetchData = () => {
    setIsLoading(true);
    setData(null);

    // Simulate API call
    new Promise((resolve) => setTimeout(resolve, 2000))
      .then(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="space-y-4">
      <Button onClick={fetchData} disabled={isLoading}>
        {isLoading ? (
          <>
            <Loading size="sm" className="mr-2" />
            Loading...
          </>
        ) : (
          'Fetch Data'
        )}
      </Button>
      
      <Card className="w-full h-32">
        <CardContent className="h-full">
          {isLoading ? (
            <Loading 
              showText 
              text="Loading data..." 
              size="lg"
              className="h-full"
            />
          ) : data ? (
            <div className="flex items-center justify-center h-full">
              <p>{data}</p>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Click the button to load data</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}`;

const props = [
  {
    name: "color",
    type: '"default" | "primary" | "secondary" | "accent" | "white" | "muted"',
    defaultValue: '"default"',
    description: "Color variant of the spinner",
  },
  {
    name: "spacing",
    type: '"none" | "sm" | "default" | "lg"',
    defaultValue: '"default"',
    description: "Gap between spinner and text (when showText is true)",
  },
  {
    name: "text",
    type: "string",
    defaultValue: '"Loading..."',
    description: "Text to display alongside the spinner",
  },
  {
    name: "showText",
    type: "boolean",
    defaultValue: "false",
    description: "Whether to show the loading text",
  },
];

function LoadingGuidePage() {
  const [copiedCode, setCopiedCode] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  const fetchData = () => {
    setIsLoading(true);
    setData(null);

    new Promise((resolve) => setTimeout(resolve, 2000)).then(() => {
      setIsLoading(false);
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-4 text-slate-900">Loading</h1>
        <p className="text-lg text-slate-600">
          The{" "}
          <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
            Loading
          </code>{" "}
          component provides a consistent loading spinner with customizable
          sizes, colors, and optional text. Perfect for indicating loading
          states in buttons, cards, overlays, and full-page scenarios.
        </p>
      </div>

      <ExampleSection
        title="Basic Usage"
        description={
          <>
            Simple loading spinner using the default size and color. The spinner
            automatically animates with a smooth rotation.
          </>
        }
        codeId="basic"
        code={basicUsageCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
      >
        <div className="p-4">
          <Loading />
        </div>
      </ExampleSection>

      <ExampleSection
        title="With Loading Text"
        description={
          <>
            Add descriptive text to provide context about what's loading. Use{" "}
            <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
              showText
            </code>{" "}
            to display text and customize it with the{" "}
            <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
              text
            </code>{" "}
            prop.
          </>
        }
        codeId="text"
        code={withTextCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
      >
        <div className="space-y-6">
          <Loading showText text="Processing payment..." size="lg" />
        </div>
      </ExampleSection>

      <ExampleSection
        title="Color Variants"
        description={
          <>
            Choose from different color variants to match your design system.
            The{" "}
            <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
              white
            </code>{" "}
            variant is useful for dark backgrounds.
          </>
        }
        codeId="colors"
        code={colorsCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Loading color="default" />
            <span className="text-sm">Default</span>
          </div>
          <div className="flex items-center space-x-4">
            <Loading color="primary" />
            <span className="text-sm">Primary</span>
          </div>
          <div className="flex items-center space-x-4">
            <Loading color="secondary" />
            <span className="text-sm">Secondary</span>
          </div>
          <div className="flex items-center space-x-4">
            <Loading color="accent" />
            <span className="text-sm">Accent</span>
          </div>
          <div className="flex items-center space-x-4 bg-gray-500 py-1 rounded">
            <Loading color="white" />
            <span className="text-sm text-white">White</span>
          </div>
          <div className="flex items-center space-x-4">
            <Loading color="muted" />
            <span className="text-sm">Muted</span>
          </div>
        </div>
      </ExampleSection>

      <ExampleSection
        title="Real-world Example"
        description={
          <>
            Practical example showing loading states in buttons and content
            areas.
          </>
        }
        codeId="real-world"
        code={realWorldCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
      >
        <div className="space-y-4">
          <Button onClick={fetchData} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loading size="sm" className="mr-2" />
                Loading...
              </>
            ) : (
              "Fetch Data"
            )}
          </Button>

          <Card className="w-full h-32">
            <CardContent className="h-full">
              {isLoading ? (
                <Loading
                  showText
                  text="Loading data..."
                  size="lg"
                  className="h-full"
                />
              ) : data ? (
                <div className="flex items-center justify-center h-full">
                  <p>{data}</p>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">
                    Click the button to load data
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </ExampleSection>

      <PropsTable props={props} />
    </div>
  );
}

export const Route = createFileRoute("/_sandbox/developer-guide/loading")({
  component: LoadingGuidePage,
});
