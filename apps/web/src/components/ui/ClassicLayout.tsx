import { useRouter } from "@tanstack/react-router";

import { Container } from "../Container";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { Text } from "./Text";
import { trackEvent } from "@/lib/analytics";

export function ClassicLayout({
  actionButton = null,
  content,
  title,
  backButton = false,
  onbackCallback = () => {},
  backButtonTrackEventName,
}: {
  actionButton?: any;
  content: any;
  title: string;
  backButton?: boolean;
  onbackCallback?: () => void;
  backButtonTrackEventName?: string;
}) {
  const router = useRouter();

  const onBack = () => {
    if (backButtonTrackEventName) {
      trackEvent(backButtonTrackEventName);
    }
    onbackCallback && onbackCallback();
    router.history.back();
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col ">
      <Container>
        <div className="flex flex-col gap-6">
          <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-2">
              {backButton && (
                <Button variant={"ghost"} className="p-0" onClick={onBack}>
                  <Icon
                    name="ArrowLeftCircle"
                    color={"primary"}
                    size={"xl"}
                    className="shrink-0"
                  ></Icon>
                </Button>
              )}
              <Text variant="h1">{title}</Text>
            </div>
            {actionButton}
          </div>
          {content}
        </div>
      </Container>
    </div>
  );
}
