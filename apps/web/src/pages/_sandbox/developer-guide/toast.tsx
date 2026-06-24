import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ExampleSection } from "@/components/ui/ExampleSection";
import { PropsTable } from "@/components/ui/PropsTable";
import { Button } from "@/components/ui/Button";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  ToastAction,
} from "@/components/ui/Toast";

interface ToastItem {
  id: number;
  type: string;
  title: string;
  description: string;
  open: boolean;
}

const basicUsageCode = `import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

export default function Example() {
  const [open, setOpen] = useState(false);

  return (
    <ToastProvider swipeDirection="right">
      <Button onClick={() => setOpen(true)}>
        Show Toast
      </Button>
      <Toast open={open} onOpenChange={setOpen}>
        <div className="grid gap-1">
          <ToastTitle>Success!</ToastTitle>
          <ToastDescription>
            Your changes have been saved successfully.
          </ToastDescription>
        </div>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  );
}`;

const variantsCode = `import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

export default function Example() {
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  return (
    <ToastProvider swipeDirection="right">
      <div className="space-x-2">
        <Button onClick={() => setSuccessOpen(true)}>
          Success Toast
        </Button>
        <Button 
          onClick={() => setErrorOpen(true)}
          variant="destructive"
        >
          Error Toast
        </Button>
      </div>
      
      <Toast open={successOpen} onOpenChange={setSuccessOpen}>
        <div className="grid gap-1">
          <ToastTitle>Success</ToastTitle>
          <ToastDescription>
            Operation completed successfully.
          </ToastDescription>
        </div>
        <ToastClose />
      </Toast>
      
      <Toast 
        open={errorOpen} 
        onOpenChange={setErrorOpen}
        variant="destructive"
      >
        <div className="grid gap-1">
          <ToastTitle>Error</ToastTitle>
          <ToastDescription>
            Something went wrong. Please try again.
          </ToastDescription>
        </div>
        <ToastClose />
      </Toast>
      
      <ToastViewport />
    </ToastProvider>
  );
}`;

const withActionCode = `import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

export default function Example() {
  const [open, setOpen] = useState(false);

  const handleUndo = () => {
    setOpen(false);
  };

  return (
    <ToastProvider swipeDirection="right">
      <Button onClick={() => setOpen(true)}>
        Delete Item
      </Button>
      
      <Toast open={open} onOpenChange={setOpen}>
        <div className="grid gap-1">
          <ToastTitle>Item Deleted</ToastTitle>
          <ToastDescription>
            The item has been moved to trash.
          </ToastDescription>
        </div>
        <ToastAction
          altText="Undo delete"
          onClick={handleUndo}
        >
          Undo
        </ToastAction>
      </Toast>
      
      <ToastViewport />
    </ToastProvider>
  );
}`;

const autoCloseCode = `import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

export default function Example() {
  const [open, setOpen] = useState(false);

  return (
    <ToastProvider swipeDirection="right">
      <Button onClick={() => setOpen(true)}>
        Auto-close Toast
      </Button>
      
      <Toast 
        open={open} 
        onOpenChange={setOpen}
        duration={3000}
      >
        <div className="grid gap-1">
          <ToastTitle>Auto-closing</ToastTitle>
          <ToastDescription>
            This toast will disappear automatically in 3 seconds.
          </ToastDescription>
        </div>
        <ToastClose />
      </Toast>
      
      <ToastViewport />
    </ToastProvider>
  );
}`;

const toastProps = [
  {
    name: "variant",
    type: '"default" | "destructive"',
    defaultValue: '"default"',
    description: "Visual variant of the toast",
  },
  {
    name: "duration",
    type: "number",
    defaultValue: "5000",
    description: "Time in milliseconds before auto-closing",
  },
  {
    name: "altText",
    type: "string",
    description: "Accessible description for screen readers",
  },
];


function ToastGuidePage() {
  const [copiedCode, setCopiedCode] = useState("");
  
  const [basicOpen, setBasicOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [actionOpen, setActionOpen] = useState(false);
  const [autoCloseOpen, setAutoCloseOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const handleUndo = () => {
    setActionOpen(false);
  };

  const closeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastProvider swipeDirection="right">
      <div className="max-w-4xl mx-auto p-6 bg-white">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-4 text-slate-900">Toast</h1>
          <p className="text-lg text-slate-600">
            The{" "}
            <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
              Toast
            </code>{" "}
            component provides pop-up notifications that appear temporarily
            to inform users about system status, completed actions, or errors.
          </p>
        </div>

        <ExampleSection
          title="Basic Usage"
          description={
            <>
              Simple toast with title and description. The toast is controlled
              by React state and can be dismissed by clicking the close button
              or swiping.
            </>
          }
          codeId="basic"
          code={basicUsageCode}
          copiedCode={copiedCode}
          setCopiedCode={setCopiedCode}
        >
          <Button onClick={() => setBasicOpen(true)}>
            Show Toast
          </Button>
        </ExampleSection>

        <ExampleSection
          title="Toast Variants"
          description={
            <>
              Use different variants to convey different message types. The{" "}
              <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
                destructive
              </code>{" "}
              variant is ideal for error messages with red styling.
            </>
          }
          codeId="variants"
          code={variantsCode}
          copiedCode={copiedCode}
          setCopiedCode={setCopiedCode}
        >
          <div className="space-x-2">
            <Button onClick={() => setSuccessOpen(true)}>
              Success Toast
            </Button>
            <Button 
              onClick={() => setErrorOpen(true)}
              variant="destructive"
            >
              Error Toast
            </Button>
          </div>
        </ExampleSection>

        <ExampleSection
          title="With Action Button"
          description={
            <>
              Add action buttons using{" "}
              <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
                ToastAction
              </code>{" "}
              for user interactions like "Undo" or "Retry". Include{" "}
              <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
                altText
              </code>{" "}
              for accessibility.
            </>
          }
          codeId="action"
          code={withActionCode}
          copiedCode={copiedCode}
          setCopiedCode={setCopiedCode}
        >
          <Button onClick={() => setActionOpen(true)}>
            Delete Item
          </Button>
        </ExampleSection>

        <ExampleSection
          title="Auto-closing Toast"
          description={
            <>
              Control auto-close behavior with the{" "}
              <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
                duration
              </code>{" "}
              prop. Set to 0 to prevent auto-closing, or specify milliseconds
              for custom timing.
            </>
          }
          codeId="auto-close"
          code={autoCloseCode}
          copiedCode={copiedCode}
          setCopiedCode={setCopiedCode}
        >
          <Button onClick={() => setAutoCloseOpen(true)}>
            Auto-close Toast
          </Button>
        </ExampleSection>

        {/* Props Tables */}
        <div className="mb-8">
          <PropsTable props={toastProps} />
        </div>

        {/* Basic Toast */}
        <Toast open={basicOpen} onOpenChange={setBasicOpen}>
          <div className="grid gap-1">
            <ToastTitle>Success!</ToastTitle>
            <ToastDescription>
              Your changes have been saved successfully.
            </ToastDescription>
          </div>
          <ToastClose />
        </Toast>

        {/* Success Toast */}
        <Toast open={successOpen} onOpenChange={setSuccessOpen}>
          <div className="grid gap-1">
            <ToastTitle>Success</ToastTitle>
            <ToastDescription>
              Operation completed successfully.
            </ToastDescription>
          </div>
          <ToastClose />
        </Toast>

        {/* Error Toast */}
        <Toast 
          open={errorOpen} 
          onOpenChange={setErrorOpen}
          variant="destructive"
        >
          <div className="grid gap-1">
            <ToastTitle>Error</ToastTitle>
            <ToastDescription>
              Something went wrong. Please try again.
            </ToastDescription>
          </div>
          <ToastClose />
        </Toast>

        {/* Action Toast */}
        <Toast open={actionOpen} onOpenChange={setActionOpen}>
          <div className="grid gap-1">
            <ToastTitle>Item Deleted</ToastTitle>
            <ToastDescription>
              The item has been moved to trash.
            </ToastDescription>
          </div>
          <ToastAction
            altText="Undo delete"
            onClick={handleUndo}
          >
            Undo
          </ToastAction>
        </Toast>

        <Toast 
          open={autoCloseOpen} 
          onOpenChange={setAutoCloseOpen}
          duration={3000}
        >
          <div className="grid gap-1">
            <ToastTitle>Auto-closing</ToastTitle>
            <ToastDescription>
              This toast will disappear automatically in 3 seconds.
            </ToastDescription>
          </div>
          <ToastClose />
        </Toast>

        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            open={toast.open}
            onOpenChange={() => closeToast(toast.id)}
            variant={toast.type === 'error' ? 'destructive' : 'default'}
          >
            <div className="grid gap-1">
              <ToastTitle>{toast.title}</ToastTitle>
              <ToastDescription>{toast.description}</ToastDescription>
            </div>
            <ToastClose />
          </Toast>
        ))}
      </div>
      
      <ToastViewport />
    </ToastProvider>
  );
}

export const Route = createFileRoute("/_sandbox/developer-guide/toast")({
  component: ToastGuidePage,
});