import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ClassicLayout } from "@/components/ui/ClassicLayout";
import LeaveList from "@/components/leave/LeaveList";
import { CalendarRange, List, Plus } from "lucide-react";
import { useState } from "react";
import LeaveCalendar from "@/components/leave/LeaveCalendar";

function LeaveListing() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");

  const handleCreateClick = () => {
    navigate({
      to: "/leave/new",
    });
  };

  const actionButton = (
    <div className="flex flex-row gap-3">
      <div className="flex border border-gray-300 rounded-md overflow-hidden">
        <Button
          variant={viewMode === "calendar" ? "default" : "ghost"}
          onClick={() => setViewMode("calendar")}
          className="rounded-none border-r"
        >
          <CalendarRange className="w-4 h-4 mr-2" />
          Calendar
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "ghost"}
          onClick={() => setViewMode("list")}
          className="rounded-none"
        >
          <List className="w-4 h-4 mr-2" />
          List
        </Button>
      </div>
      <Button
        variant="default"
        onClick={handleCreateClick}
        className="flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Create
      </Button>
    </div>
  );

  const content = (
    <Card>
      <CardContent className="overflow-x-auto">
        {viewMode === "calendar" ? <LeaveCalendar /> : <LeaveList />}
      </CardContent>
    </Card>
  );

  return (
    <ClassicLayout
      title="Leave"
      actionButton={actionButton}
      content={content}
    />
  );
}
export const Route = createFileRoute("/_app/leave/")({
  component: LeaveListing,
});
