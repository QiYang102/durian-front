import { AlertCircle } from "lucide-react";
import { Container } from "@/components/Container";
import { Text } from "@/components/ui/Text";

export default function TeamCheckInRequired() {
  return (
    <Container className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-8 text-center max-w-md px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center h-20 w-20 rounded-full bg-danger-50">
            <AlertCircle className="h-10 w-10 text-danger-500" />
          </div>
          <Text variant="h2">Team Check-In Required</Text>
          <Text variant="default" className="text-gray-600">
            Please check in to a team from the sidebar first.
          </Text>
        </div>
      </div>
    </Container>
  );
}
