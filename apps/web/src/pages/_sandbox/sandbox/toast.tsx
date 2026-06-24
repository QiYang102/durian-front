import { useEffect } from "react";

import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/UseToast";

function SandboxToast() {
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "Fired from code when load",
    });
  }, []);

  return (
    <>
      <div>Sandbox - Toast</div>

      <div>
        <Button
          className="bg-blue-400"
          onClick={() => {
            toast({
              title: "Scheduled: Catch up",
              description: "Friday, February 10, 2023 at 5:57 PM",
            });
          }}
        >
          Fire
        </Button>
      </div>
    </>
  );
}

export const Route = createFileRoute("/_sandbox/sandbox/toast")({
  component: SandboxToast,
});
