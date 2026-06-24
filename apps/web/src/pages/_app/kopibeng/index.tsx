import KopibengList from "@/components/kopibeng/KopibengList";
import KopibengRanking from "@/components/kopibeng/KopibengRanking";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ClassicLayout } from "@/components/ui/ClassicLayout";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

function Kopibeng() {
  const navigate = useNavigate();

  return (
    <ClassicLayout
      title="Kopi Beng"
      actionButton={
        <Button
          variant="default"
          onClick={() => navigate({ to: "/kopibeng/new" })}
        >
          Create New Kopibeng
        </Button>
      }
      content={
        <>
          <KopibengRanking />
          <Card>
            <CardContent>
              <KopibengList />
            </CardContent>
          </Card>
        </>
      }
    />
  );
}

export const Route = createFileRoute("/_app/kopibeng/")({
  component: Kopibeng,
});
