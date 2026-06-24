import { checkCelebration } from "@ttm/api";
import { StoryMode } from "@ttm/api/types/enums";
import { Card, CardContent } from "@/components/ui/Card";
import RandomCelebration from "./RandomCelebration";
import { FileText } from "lucide-react";
import moment from "moment";

interface StoryboardEmptyStateProps {
  bucket: StoryMode;
  iterationId: string;
}

export function StoryboardEmptyState({
  bucket,
  iterationId,
}: StoryboardEmptyStateProps) {
  const { data: celebrationData, isLoading } = checkCelebration(
    ["checkCelebration", bucket, iterationId],
    {
      params: {
        iteration: iterationId,
      },
    },
  );

  const isFridayOrLater = moment().weekday() >= 5;

  const shouldCelebrate =
    (celebrationData?.should_celebrate && isFridayOrLater) || false;

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <p className="text-center text-gray-500">
            Checking for celebration...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-3">
      {bucket === StoryMode.COMPLETED && (
        <h2 className="text-xl font-semibold">Completed</h2>
      )}
      <Card>
        <CardContent>
          <div className="text-center">
            {shouldCelebrate ? (
              <RandomCelebration variant="empty" />
            ) : (
              <>
                <div className="text-gray-400 mb-4">
                  {bucket === StoryMode.INCOMPLETED && (
                    <FileText className="mx-auto h-12 w-12" />
                  )}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No stories found
                </h3>
                <p className="text-gray-500">
                  {bucket === StoryMode.COMPLETED
                    ? "No updates from yesterday 💤"
                    : "Get started by creating a new story"}
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
