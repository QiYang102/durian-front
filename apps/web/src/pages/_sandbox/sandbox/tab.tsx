import { useState } from "react";

import { createFileRoute } from "@tanstack/react-router";

import { Card, CardContent } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";

function SandboxTab() {
  const [tabValue, setTabValue] = useState("tab 1");

  return (
    <>
      <div>Sandbox - Tab</div>
      <Card>
        <CardContent className="flex flex-row">
          <Tabs defaultValue={tabValue}>
            <div className="relative w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-6 md:grid-cols-10">
                <TabsTrigger value="tab 1" onClick={() => setTabValue("tab 1")}>
                  Tab 1
                </TabsTrigger>
                <TabsTrigger value="tab 2" onClick={() => setTabValue("tab 2")}>
                  Tab 2
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="tab 1">
              <div className="p-6">Tab 1 hereeee</div>
            </TabsContent>
            <TabsContent value="tab 2">
              <div className="p-6">Tab 2 hereeee</div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}

export const Route = createFileRoute("/_sandbox/sandbox/tab")({
  component: SandboxTab,
});
