import { Story, StoryBadgeOption } from "@ttm/api/types/models/story";
import { Text } from "../ui/Text";
import { Clock, FlaskConical, Users } from "lucide-react";
import { StoryStatus } from "@ttm/api/types/enums";
import CompletedStoryCard from "./StoryCompletedCard";
import BaseStoryCard from "../BaseStoryCard";

interface StoryCardProps {
  story: Story;
  onToggleDeploy?: (storyId: number, currentStatus: boolean) => void;
}

export default function StoryCard({ story, onToggleDeploy }: StoryCardProps) {
  if (story.status === StoryStatus.COMPLETED) {
    return <CompletedStoryCard story={story} onToggleDeploy={onToggleDeploy} />;
  }

  const totalEstimatedTime = story.total_estimate_time || 0;

  const badgeConfig = StoryBadgeOption.get("isNew");
  const BadgeIcon = badgeConfig?.icon;

  return (
    <>
      <BaseStoryCard
        story={story}
        badgeChildren={
          story.status === StoryStatus.NEW && badgeConfig?.show && BadgeIcon ? (
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
        footerChildren={
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gray-500" />
                <Text variant="macro" className="font-medium">
                  {totalEstimatedTime > 0 ? `${totalEstimatedTime}h` : "0.00h"}
                </Text>
              </div>

              <div className="flex items-center gap-2">
                {story.is_rnd && (
                  <div
                    className="transition-all duration-200 cursor-pointer hover:scale-110"
                    title="R&D"
                  >
                    <FlaskConical
                      className="w-3.5 h-3.5 text-fuchsia-500"
                      strokeWidth={2.5}
                    />
                  </div>
                )}
                {story.is_multi && (
                  <div
                    className="transition-all duration-200 cursor-pointer hover:scale-110"
                    title="Team"
                  >
                    <Users
                      className="w-3.5 h-3.5 text-cyan-500"
                      strokeWidth={2.5}
                    />
                  </div>
                )}
              </div>
            </div>

            {story.status && story.status !== StoryStatus.NEW && (
              <div className="absolute bottom-1 right-1 opacity-70">
                <div className="transform -rotate-12">
                  <div className="border-4 border-red-700 rounded-xl p-1">
                    <div className="border-4 border-red-700 rounded-lg p-1 px-4">
                      <span className="text-md font-bold text-red-700 tracking-wider">
                        {story.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        }
      />
    </>
  );
}
