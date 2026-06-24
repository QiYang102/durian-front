import { createFileRoute, useRouter } from "@tanstack/react-router";

import { Button } from "@/components/ui/Button";
import { ClassicLayout } from "@/components/ui/ClassicLayout";
// import withFeatureGuard from "@/components/guard/guard";
import TeamList from "@/components/team/TeamList";
import { UserPlus } from "lucide-react";

export default function TeamListing() {
  const router = useRouter();

  const handleAddTeam = () => {
    router.navigate({
      to: "/team/new",
    });
  };

  return (
    <ClassicLayout
      title="Team List"
      actionButton={
        <Button onClick={handleAddTeam}>
          <UserPlus className="w-4 h-4 mr-2" />
          Add Team
        </Button>
      }
      content={<TeamList />}
    />
  );
}

// const ProtectedTeamManagement = withFeatureGuard(TeamListing, "team");

export const Route = createFileRoute("/_app/team/")({
  component: TeamListing,
  // component: ProtectedTeamManagement,
});
