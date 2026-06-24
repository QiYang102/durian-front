import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import { ExampleSection } from "@/components/ui/ExampleSection";
import { PropsTable } from "@/components/ui/PropsTable";

const basicUsageCode = `import ErrorDisplay from "@/components/ui/ErrorDisplay";

export default function Example() {
  return (
    <ErrorDisplay />
  );
}`;

const customMessageCode = `import ErrorDisplay from "@/components/ui/ErrorDisplay";

export default function Example() {
  const handleRetry = () => {
    // Add your retry logic here
  };

  return (
    <ErrorDisplay
      title="Failed to load data"
      message="The server is currently unavailable. Please check your connection and try again."
      onRetry={handleRetry}
      retryText="Reload Data"
    />
  );
}`;

const withoutRetryCode = `import ErrorDisplay from "@/components/ui/ErrorDisplay";

export default function Example() {
  return (
    <ErrorDisplay
      title="Access Denied"
      message="You don't have permission to view this content."
      showRetry={false}
    />
  );
}`;

const networkErrorCode = `import ErrorDisplay from "@/components/ui/ErrorDisplay";
import { useState } from "react";

export default function Example() {
  const [isLoading, setIsLoading] = useState(false);

  const { data, isLoading, isFetching, isError, refetch } =
    getApiDataHook(
      ["query-key-prefix",],
      {},
    );

  return (
    <ErrorDisplay
      title="Network Error"
      message="Unable to connect to the server. Please check your internet connection."
      onRetry={refetch}
      retryText={isLoading ? "Retrying..." : "Try Again"}
      className="max-w-md mx-auto"
    />
  );
}`;

const props = [
  {
    name: "onRetry",
    type: "function",
    description: "Callback function executed when the retry button is clicked",
  },
  {
    name: "retryText",
    type: "string",
    defaultValue: '"Try Again"',
    description: "Text displayed on the retry button",
  },
  {
    name: "showRetry",
    type: "boolean",
    defaultValue: "true",
    description: "Whether to show the retry button",
  },
];

function ErrorDisplayGuidePage() {
  const [copiedCode, setCopiedCode] = useState("");
  const [networkRetryLoading, setNetworkRetryLoading] = useState(false);

  const handleBasicRetry = () => {
  };

  const handleCustomRetry = () => {
  };

  const handleNetworkRetry = () => {
    setNetworkRetryLoading(true);
    new Promise((resolve) => setTimeout(resolve, 1000))
      .then(() => {
      })
      .finally(() => {
        setNetworkRetryLoading(false);
      });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-4 text-slate-900">ErrorDisplay</h1>
        <p className="text-lg text-slate-600">
          The{" "}
          <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
            ErrorDisplay
          </code>{" "}
          component provides a consistent way to display error states with
          optional retry functionality. Used for handling API failures,
          network errors, and other error scenarios.
        </p>
      </div>

      <ExampleSection
        title="Basic Usage"
        description={
          <>
            The ErrorDisplay component works out of the box with sensible
            defaults. It includes a default error icon, title, message, and
            retry button.
          </>
        }
        codeId="basic"
        code={basicUsageCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
      >
        <ErrorDisplay onRetry={handleBasicRetry} />
      </ExampleSection>

      <ExampleSection
        title="Custom Messages"
        description={
          <>
            Customize the error display with your own title, message, and retry
            button text to match your specific use case.
          </>
        }
        codeId="custom"
        code={customMessageCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
      >
        <ErrorDisplay
          title="Failed to load data"
          message="The server is currently unavailable. Please check your connection and try again."
          onRetry={handleCustomRetry}
          retryText="Reload Data"
        />
      </ExampleSection>

      <ExampleSection
        title="Without Retry Button"
        description={
          <>
            For errors where retry isn't applicable,
            you can hide the retry button using{" "}
            <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
              showRetry={false}
            </code>
            .
          </>
        }
        codeId="no-retry"
        code={withoutRetryCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
      >
        <ErrorDisplay
          title="Access Denied"
          message="You don't have permission to view this content."
          showRetry={false}
        />
      </ExampleSection>

      <ExampleSection
        title="Loading State"
        description={
          <>
            Handle loading states during retry operations by updating the retry
            button text in your component.
          </>
        }
        codeId="loading"
        code={networkErrorCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
      >
        <ErrorDisplay
          title="Network Error"
          message="Unable to connect to the server. Please check your internet connection."
          onRetry={handleNetworkRetry}
          retryText={networkRetryLoading ? "Retrying..." : "Try Again"}
          className="max-w-md mx-auto"
        />
      </ExampleSection>

      <PropsTable props={props} />
    </div>
  );
}

export const Route = createFileRoute("/_sandbox/developer-guide/error-display")({
  component: ErrorDisplayGuidePage,
});
