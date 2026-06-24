import {
  defaultBadgeConfig,
  Story,
  StoryBadgeOption,
} from "@ttm/api/types/models/story";
import { Text } from "../ui/Text";
import { Rocket, AlertCircle, Clipboard } from "lucide-react";
import { formatDisplayDate } from "@ttm/utils";
import { DeploymentStatus } from "@ttm/api/types/enums";
import { useState } from "react";
import moment from "moment";
import CreateBugTaskDialog from "./CreateBugTaskDialog";
import UpdateDeploymentStatusDialog from "./UpdateDeploymentStatusDialog";
import { useNavigate } from "@tanstack/react-router";
import { useEditStory } from "@ttm/api";
import { toast } from "sonner";
import ActionButton from "../ActionButton";
import BaseStoryCard from "../BaseStoryCard";
import { useDeploymentFeedback } from "../Telemetry";

interface DeploymentCardProps {
  story: Story;
  deploymentMode: DeploymentStatus;
}

const formatDeploymentDate = (dateString?: string) => {
  if (!dateString) return null;
  return moment(dateString).format("YYYY-MM-DD h:mm A");
};

export default function DeploymentCard({
  story,
  deploymentMode,
}: DeploymentCardProps) {
  const navigate = useNavigate();

  const [bugDialogOpen, setBugDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const { showRandomMessage } = useDeploymentFeedback();

  const editStory = useEditStory({
    onSuccess: () => {
      showRandomMessage();

      toast.success("Story has been redeployed successfully");
    },
    onError: () => {
      toast.error("Failed to redeploy story. Please try again.");
    },
  });

  const handleCreateSubStory = () => {
    navigate({
      to: "/story-drafted/new",
      search: { parent_story: story.id.toString() },
    });
  };

  const handleRedeploy = () => {
    const now = new Date().toISOString();
    editStory.mutate({
      id: String(story.id),
      deployment_production_status_at: now,
      has_issue: false,
      issue_resolved_at: null,
    });
  };

  const isProduction = deploymentMode === DeploymentStatus.PRODUCTION;
  const hasIssue = !!(isProduction && story.has_issue);
  const isResolved = !!(isProduction && story.issue_resolved_at);

  const badgeKey = isResolved ? "isResolved" : hasIssue ? "hasIssue" : null;

  const badgeConfig =
    (badgeKey && StoryBadgeOption.get(badgeKey)) ?? defaultBadgeConfig;
  const BadgeIcon = badgeConfig.icon;

  const renderFooter = () => {
    if (isResolved) {
      return (
        <div className="h-6 flex items-center justify-between gap-2">
          <Text variant="macro" className="text-gray-600">
            Issues resolved at{" "}
            {formatDisplayDate(story.issue_resolved_at || "")}
          </Text>
          <div className="flex gap-1.5">
            <ActionButton
              icon={Rocket}
              onClick={handleRedeploy}
              title="Redeploy to production"
              colorScheme="purple"
              disabled={editStory.isPending}
            >
              Redeploy
            </ActionButton>
          </div>
        </div>
      );
    }

    if (hasIssue) {
      return <div className="h-6"></div>;
    }

    if (
      deploymentMode === DeploymentStatus.PENDING ||
      deploymentMode === DeploymentStatus.STAGING
    ) {
      return (
        <div
          className={`h-6 flex items-center ${deploymentMode === DeploymentStatus.PENDING ? "justify-end" : "justify-between"}  gap-2`}
        >
          {deploymentMode === DeploymentStatus.STAGING &&
            story.deployment_staging_status_at && (
              <Text variant="macro" className="text-gray-600">
                Deployed at{" "}
                {formatDeploymentDate(story.deployment_staging_status_at)}
              </Text>
            )}
          <div className="flex gap-1">
            <ActionButton
              icon={Clipboard}
              onClick={handleCreateSubStory}
              title="Create child story"
              colorScheme="blue"
              className=" hover:bg-blue-50"
            />
            <ActionButton
              icon={Rocket}
              onClick={() => setStatusDialogOpen(true)}
              title="Update deployment status"
              colorScheme="purple"
              className=" hover:bg-purple-50"
            />
          </div>
        </div>
      );
    }

    if (deploymentMode === DeploymentStatus.PRODUCTION) {
      return (
        <div className="h-6 flex items-center justify-between gap-2">
          {story.deployment_production_status_at && (
            <Text variant="macro" className="text-gray-600">
              Deployed at{" "}
              {formatDeploymentDate(story.deployment_production_status_at)}
            </Text>
          )}
          <ActionButton
            icon={AlertCircle}
            onClick={() => setBugDialogOpen(true)}
            title="Report bug"
            colorScheme="red"
            className="hover:bg-red-50"
          />
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <BaseStoryCard
        story={story}
        badgeChildren={
          badgeConfig.show && BadgeIcon ? (
            <div
              className={`flex items-center gap-1 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md ${badgeConfig.animate ? "animate-bounce" : ""}`}
              style={{
                background: badgeConfig.bgColor,
              }}
            >
              <BadgeIcon className="w-3.5 h-3.5 text-white" />
              <Text className="text-xs">{badgeConfig.label}</Text>
            </div>
          ) : null
        }
        footerChildren={renderFooter()}
      />

      <CreateBugTaskDialog
        isOpen={bugDialogOpen}
        onClose={() => setBugDialogOpen(false)}
        story={story}
      />

      <UpdateDeploymentStatusDialog
        isOpen={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        story={story}
      />
    </>
  );
}
