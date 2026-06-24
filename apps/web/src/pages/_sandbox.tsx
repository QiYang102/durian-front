import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

import { buttonVariants } from "@/components/ui/Button";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { Separator } from "@/components/ui/Separator";
import _ from "lodash";

function LayoutComponent() {
  return (
    <div className="flex flex-col items-center justify-between p-5">
      <ModeToggle />
      <Separator className="my-4" />
      <Outlet />
      <Separator className="my-4" />
      <div className="flex flex-col gap-y-2">
        <Link
          className={buttonVariants({ variant: "outline" })}
          to="/developer-guide"
        >
          Back to Developer Guide Menu
        </Link>
        <Link className={buttonVariants({ variant: "outline" })} to="/sandbox">
          Back to Sandbox Menu
        </Link>
        <Link className={buttonVariants({ variant: "outline" })} to="/">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_sandbox")({
  component: LayoutComponent,
});
