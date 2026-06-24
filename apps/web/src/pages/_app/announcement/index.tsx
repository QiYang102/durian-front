import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ClassicLayout } from "@/components/ui/ClassicLayout";
import withFeatureGuard from "@/components/guard/guard";
import AnnouncementList from "@/components/announcement/AnnouncementList";
import { Plus } from "lucide-react";

function AnnouncementListing() {
  const navigate = useNavigate();

  const handleCreateClick = () => {
    navigate({
      to: "/announcement/new",
    });
  };

  const actionButton = (
    <Button
      variant="default"
      onClick={handleCreateClick}
      className="flex items-center gap-2"
    >
      <Plus className="w-4 h-4" />
      Create
    </Button>
  );

  const content = (
    <Card>
      <CardContent className="overflow-x-auto">
        <AnnouncementList />
      </CardContent>
    </Card>
  );

  return (
    <ClassicLayout
      title="Announcement List"
      actionButton={actionButton}
      content={content}
    />
  );
}

const ProtectedUserManagement = withFeatureGuard(AnnouncementListing, "user");

export const Route = createFileRoute("/_app/announcement/")({
  component: AnnouncementListing,
});
