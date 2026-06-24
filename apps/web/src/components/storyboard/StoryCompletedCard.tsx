import { useNavigate } from "@tanstack/react-router";
import { Story } from "@ttm/api/types/models/story";
import { Server, ServerOff, Clipboard } from "lucide-react";
import BaseStoryCard from "../BaseStoryCard";
import ActionButton from "../ActionButton";

interface CompletedStoryCardProps {
  story: Story;
  onToggleDeploy?: (storyId: number, currentStatus: boolean) => void;
}

export default function CompletedStoryCard({
  story,
  onToggleDeploy,
}: CompletedStoryCardProps) {
  const navigate = useNavigate();

  const handleDeployToggle = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (onToggleDeploy) {
      onToggleDeploy(story.id, story.is_needed_to_deploy || false);
    }
  };

  const handleCreateSubStory = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    navigate({
      to: "/story-drafted/new",
      search: { parent_story: story.id.toString() },
    });
  };

  const isDeployNeeded = story.is_needed_to_deploy;

  return (
    <BaseStoryCard
      story={story}
      footerChildren={
        <div className="flex items-center justify-end gap-2">
          <ActionButton
            icon={isDeployNeeded ? Server : ServerOff}
            onClick={handleDeployToggle}
            title={
              isDeployNeeded ? "Deployment needed" : "No deployment needed"
            }
            colorScheme={isDeployNeeded ? "green" : "gray"}
            className={
              isDeployNeeded
                ? " border-green-300 bg-green-50 hover:bg-green-100"
                : " border-gray-300 bg-gray-50 hover:bg-gray-100"
            }
          >
            {isDeployNeeded ? "Needed Deploy" : "No Need Deploy"}
          </ActionButton>

          <ActionButton
            icon={Clipboard}
            onClick={handleCreateSubStory}
            title="Create sub-story"
            className="text-blue-700 border-blue-300 bg-blue-50 hover:bg-blue-100"
          >
            Create Story
          </ActionButton>
        </div>
      }
    />
  );
}
