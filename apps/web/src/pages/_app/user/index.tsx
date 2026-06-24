import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import UserList from "@/components/user/UserList";
import UserCard from "@/components/user/UserCard";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ClassicLayout } from "@/components/ui/ClassicLayout";
import withFeatureGuard from "@/components/guard/guard";
import { LayoutGrid, LayoutList } from "lucide-react";

function UserListing() {
  const [viewMode, setViewMode] = useState<"list" | "card">("card");

  const toggleView = () => {
    setViewMode((prev) => (prev === "list" ? "card" : "list"));
  };

  const actionButton = (
    <Button
      variant="default"
      onClick={toggleView}
      className="flex items-center gap-2"
    >
      {viewMode === "list" ? (
        <>
          <LayoutGrid className="h-4 w-4" />
          Show Card
        </>
      ) : (
        <>
          <LayoutList className="h-4 w-4" />
          Show List
        </>
      )}
    </Button>
  );

  const content = (
    <Card>
      <CardContent className="overflow-x-auto">
        {viewMode === "list" ? <UserList /> : <UserCard />}
      </CardContent>
    </Card>
  );

  return (
    <ClassicLayout
      title="User List"
      actionButton={actionButton}
      content={content}
    />
  );
}

const ProtectedUserManagement = withFeatureGuard(UserListing, "user");

export const Route = createFileRoute("/_app/user/")({
  component: UserListing,
});
