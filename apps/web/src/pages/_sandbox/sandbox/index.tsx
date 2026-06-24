import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/Button";

function SandboxMenu() {
  return (
    <>
      <div>Sandbox</div>
      <div className="mt-2 flex max-w-lg flex-row flex-wrap items-center justify-center gap-2">
        <Button asChild>
          <Link to="/sandbox/button">Button</Link>
        </Button>
        <Button asChild>
          <Link to="/sandbox/toast">Toast</Link>
        </Button>
        <Button asChild>
          <Link to="/sandbox/form">Form</Link>
        </Button>
        <Button asChild>
          <Link to="/sandbox/form2">Form 2</Link>
        </Button>
        <Button asChild>
          <Link to="/sandbox/update-access-from-checkbox">
            Update access from check box sample
          </Link>
        </Button>
        <Button asChild>
          <Link to="/sandbox/signature-canvas">Signature Canvas</Link>
        </Button>
        <Button asChild>
          <Link to="/sandbox/upload-file">Upload File</Link>
        </Button>
        <Button asChild>
          <Link to="/sandbox/tab">Tab</Link>
        </Button>
        <Button asChild>
          <Link to="/sandbox/group-row-table">Group Row Table</Link>
        </Button>
        <Button asChild>
          <Link to="/sandbox/pieChart">Pie Chart</Link>
        </Button>
        <Button asChild>
          <Link to="/sandbox/sonner">Sonner</Link>
        </Button>
      </div>
    </>
  );
}

export const Route = createFileRoute("/_sandbox/sandbox/")({
  component: SandboxMenu,
});
