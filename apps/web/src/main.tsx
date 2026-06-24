import ReactDOM from "react-dom/client";

import "./index.css";
import "ckeditor5/ckeditor5.css";
import "./ckeditor-content.css";
import "./i18n";

import { StrictMode } from "react";

import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";

import { axiosClient } from "@ttm/api/axios";
import { LeadManagementProvider, SessionProvider } from "@ttm/context";
import { CustomerManagementProvider } from "@ttm/context/contexts/customerManagement";

import { routeTree } from "./routeTree.gen";
import { queryClient } from "./lib/queryClient";

axiosClient.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const router = createRouter({
  routeTree,
  context: {
    queryClient,
    axiosClient,
  },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root");

if (import.meta.env.PROD) {
  console.log = () => {};
  console.error = () => {};
  console.warn = () => {};
  console.info = () => {};
  console.debug = () => {};
  console.trace = () => {};
  console.dir = () => {};
  console.dirxml = () => {};
  console.table = () => {};
  console.group = () => {};
}

import React from "react";

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return <div style={{ padding: 20, color: 'red' }}>
        <h1>React App Crashed</h1>
        <pre>{this.state.error?.message}</pre>
        <pre>{this.state.error?.stack}</pre>
      </div>;
    }
    return this.props.children;
  }
}

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <SessionProvider>
            <LeadManagementProvider>
              <CustomerManagementProvider>
                <RouterProvider router={router} />
              </CustomerManagementProvider>
            </LeadManagementProvider>
          </SessionProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </StrictMode>
  );
}
