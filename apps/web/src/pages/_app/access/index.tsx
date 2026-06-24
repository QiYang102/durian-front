import { createFileRoute } from "@tanstack/react-router";

import { Container } from "@/components/Container";
import ErrorComponent from "@/components/Error";
import { Card, CardContent } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import withFeatureGuard from "@/components/guard/guard";

function Access() {
  return (
    <Container>
      <div className="flex flex-col gap-6">
        <div className="flex flex-row justify-between">
          <Text variant="h1">Access</Text>
        </div>
        <Card>
          <CardContent className="h-screen p-6">
            <div className="flex flex-wrap gap-8">
              <Text className="text-xl font-bold " color="primary">
                Coming soon...
              </Text>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

const ProtectedAccessManagement = withFeatureGuard(Access, "access");

export const Route = createFileRoute("/_app/access/")({
  component: ProtectedAccessManagement,
  errorComponent: () => (
    <ErrorComponent errorMessage="Sorry, we couldn't find what you were looking for." />
  ),
});
