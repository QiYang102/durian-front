import { useEffect } from "react";

import { createFileRoute, Outlet } from "@tanstack/react-router";

import { useSession } from "@ttm/context";
import { toast } from "sonner";

function LayoutComponent() {
  const { user, isLoading } = useSession();

  useEffect(() => {
    if (user && !isLoading) {
      const welcomeMessage = `Welcome back ${user.fullname}!`;
      toast.success(welcomeMessage);
    }
  }, [user, isLoading]);

  return (
    <div className="h-screen w-screen">
      <div className="md:hidden"></div>
      <div className="relative mx-10 flex h-full flex-col justify-center sm:mx-0 md:grid md:items-center lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="bg-muted relative hidden h-full flex-col p-10 text-white dark:border-r lg:flex">
          <img
            src="/images/login-bg.png"
            className="absolute inset-0 w-full h-full object-cover"
            alt="Authentication background"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60" />

          <div className="relative z-20 flex items-start text-lg font-medium">
            <img
              src="/images/logo.png"
              className="min-h-12 max-h-14"
              alt="Logo"
            />
          </div>

          <div className="relative z-20 flex flex-col justify-center items-center h-full text-center -mt-16">
            <div className="max-w-md">
              <h1 className="text-4xl font-bold text-white mb-4">Codetinker</h1>
            </div>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_auth")({
  component: LayoutComponent,
  validateSearch: (search) => search as { redirectURL?: string },
});
