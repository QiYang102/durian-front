import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/Button";
import { Toaster } from "@/components/ui/Sonner";
import { toast } from "sonner";

function SonnerSandbox() {
  const simulateApi = () => new Promise((resolve) => setTimeout(resolve, 1500));

  return (
    <div className="space-y-6">
      {/* Local Toaster for the sandbox page */}
      {/* <Toaster /> */}

      <div className="text-xl font-semibold">Sonner Sandbox</div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => toast("Hello from Sonner!")}>Basic</Button>

        <Button
          variant="accent"
          onClick={() => toast.success("Saved successfully")}
        >
          Success
        </Button>

        <Button
          variant="destructive"
          onClick={() => toast.error("Something went wrong")}
        >
          Error
        </Button>

        <Button
          variant="secondary"
          onClick={() => toast.info("Heads up, some info for you")}
        >
          Info
        </Button>

        <Button onClick={() => toast.warning("Please check your input")}>
          Warning
        </Button>

        <Button
          onClick={() =>
            toast("New message received", {
              action: {
                label: "Undo",
                onClick: () => toast("Undo clicked"),
              },
            })
          }
        >
          With Action
        </Button>

        <Button
          onClick={() =>
            toast.promise(simulateApi(), {
              loading: "Processing...",
              success: "All done!",
              error: "Failed to process",
            })
          }
        >
          Promise
        </Button>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_sandbox/sandbox/sonner")({
  component: SonnerSandbox,
});
