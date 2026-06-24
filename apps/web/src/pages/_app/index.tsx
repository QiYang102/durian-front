import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { FormProvider, useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/Card";
import AnnouncementCarousel from "@/components/dashboard/AnnouncementCarousel";
import { CreateUserStoryDialog } from "@/components/dashboard/CreateUserStoryDialog";
import { CreateLeaveDialog } from "@/components/dashboard/CreateLeaveDialog";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { ClassicLayout } from "@/components/ui/ClassicLayout";
import { Megaphone, ClipboardList, CalendarDays } from "lucide-react";
import LeaveSmallCalendar from "@/components/dashboard/LeaveSmallCalendar";

type DashboardForm = {
  team: number | null;
};

function Dashboard() {
  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);

  const form = useForm<DashboardForm>({
    defaultValues: {
      team: null,
    },
  });

  const { watch, setValue } = form;
  const selectedTeam = watch("team");

  useEffect(() => {
    const localStorageTeamId = localStorage.getItem("teamId");

    if (localStorageTeamId) {
      setValue("team", Number(localStorageTeamId));
    }
  }, [setValue]);

  useEffect(() => {
    if (selectedTeam) {
      localStorage.setItem("teamId", String(selectedTeam));
    }
  }, [selectedTeam]);

  const dashboardContent = (
    <FormProvider {...form}>
      <div className="flex flex-1 flex-col lg:flex-row gap-3 min-h-[600px]">
        <div className="basis-2/3 flex min-h-0">
          <Card className="flex-1 flex flex-col min-h-0">
            <CardContent className="flex-1 min-h-0">
              <div className="flex flex-col gap-3 h-full">
                <div className="flex flex-row items-center justify-start gap-3">
                  <Megaphone className="h-6 w-6 text-black" />
                  <Text variant="h2">Announcements</Text>
                </div>
                <AnnouncementCarousel />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="basis-1/3 flex flex-col">
          <Card className="h-full">
            <CardContent className="h-full">
              <div className="flex flex-col gap-4">
                <Text variant="h2">Quick action</Text>
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateStoryOpen(true)}
                      className="h-auto py-4"
                    >
                      <div className="grid grid-rows-2 gap-2">
                        <ClipboardList className="w-6 h-6 justify-self-center self-end" />
                        <span>Create User Story</span>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateEventOpen(true)}
                      className="h-auto py-4"
                    >
                      <div className="grid grid-rows-2 gap-2">
                        <CalendarDays className="w-6 h-6 justify-self-center self-end" />
                        <span>Create Leave</span>
                      </div>
                    </Button>
                  </div>
                </div>
                <LeaveSmallCalendar />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <CreateUserStoryDialog
        isOpen={isCreateStoryOpen}
        onClose={() => setIsCreateStoryOpen(false)}
      />
      <CreateLeaveDialog
        isOpen={isCreateEventOpen}
        onClose={() => setIsCreateEventOpen(false)}
      />
    </FormProvider>
  );

  return <ClassicLayout title="Dashboard" content={dashboardContent} />;
}

export const Route = createFileRoute("/_app/")({
  component: Dashboard,
});
