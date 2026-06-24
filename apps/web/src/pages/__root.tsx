import { Suspense, useEffect } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  Outlet,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useSession } from "@ttm/context";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/Toaster";
import { Toaster as ToasterShadcn } from "@/components/ui/Sonner";
import { TooltipProvider } from "@/components/ui/Tooltip";
import NotFoundPage from "@/components/NotFoundPage";
import { z } from "zod";

const rootSearchSchema = z
  .object({
    redirectURL: z.string().optional(),
  })
  .catchall(z.any());

function RootComponent() {
  const { user, isLoading, accessToken, init, isLoggingOut } = useSession();
  const navigate = useNavigate();
  const router = useRouter();

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/register", "/reset-password", "/durian", "/durian/", "/durian/products", "/durian/cart", "/durian/checkout", "/durian/profile", "/durian/login"];

  useEffect(() => {
    const currentPath = window.location.pathname;

    if (isLoading || isLoggingOut) {
      return;
    }

    // const isPublicRoute = publicRoutes.includes(currentPath);
    const isPublicRoute =
      publicRoutes.includes(currentPath) ||
      /^\/reset-password-confirm\/[^/]+\/[^/]+$/.test(currentPath);

    if (currentPath === "/") {
      navigate({ to: "/durian", replace: true });
      return;
    }

    if (!user && !accessToken) {
      if (isPublicRoute) {
        if (window.location.pathname !== currentPath) {
          navigate({
            to: currentPath,
            replace: true,
          });
        }
      } else {
        const fullOriginalPath = currentPath + window.location.search;

        if (currentPath !== "/login") {
          navigate({
            to: "/login",
            search: { redirectURL: encodeURIComponent(fullOriginalPath) },
            replace: true,
          });
        }
      }
    }
  }, [
    user,
    isLoading,
    accessToken,
    router.state.location.pathname,
    router.state.location.search,
    navigate,
    isLoggingOut,
  ]);

  useEffect(() => {
    if (!isLoading && accessToken && !user) {
      init();
    }
  }, [isLoading, accessToken, user, init]);

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Outlet />
      </TooltipProvider>
      {process.env.NODE_ENV === "development" && (
        <Suspense>
          <TanStackRouterDevtools position="bottom-right" />
          <ReactQueryDevtools buttonPosition="bottom-left" />
        </Suspense>
      )}
      <ToasterShadcn position="top-center" />
      <Toaster />
    </ThemeProvider>
  );
}

export const Route = createRootRouteWithContext<{
  queryClient: typeof import("@ttm/api/axios").axiosClient;
}>()({
  component: RootComponent,
  notFoundComponent: NotFoundPage,
  validateSearch: rootSearchSchema,
});
