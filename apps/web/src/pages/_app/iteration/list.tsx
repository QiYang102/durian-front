import { createFileRoute, useRouter } from "@tanstack/react-router";

import { Button } from "@/components/ui/Button";
import { ClassicLayout } from "@/components/ui/ClassicLayout";
// import withFeatureGuard from "@/components/guard/guard";
import IterationList from "@/components/iteration/IterationList";
import { Plus } from "lucide-react";
import TeamCheckInRequired from "@/components/TeamCheckInRequired";

export default function IterationListing() {
  const router = useRouter();

  const teamId = localStorage.getItem("teamId");

  const handleAddTeam = () => {
    router.navigate({
      to: "/iteration/new",
    });
  };

  if (!teamId) {
    return <TeamCheckInRequired />;
  }

  return (
    <ClassicLayout
      title="Iteration List"
      backButton
      actionButton={
        <Button onClick={handleAddTeam}>
          <Plus className="w-4 h-4 mr-2" />
          Create New Iteration
        </Button>
      }
      content={<IterationList teamId={teamId} />}
    />
  );
}

// const ProtectedIterationManagement = withFeatureGuard(IterationListing, "iteration");

export const Route = createFileRoute("/_app/iteration/list")({
  component: IterationListing,
  // component: ProtectedIterationManagement,
});
