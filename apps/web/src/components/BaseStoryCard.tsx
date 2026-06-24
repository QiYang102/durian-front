import {
  defaultPriorityOption,
  PriorityTypeOption,
  Story,
} from "@ttm/api/types/models/story";
import { Card, CardContent } from "@/components/ui/Card";
import { Text } from "./ui/Text";
import { FolderOpen } from "lucide-react";
import { formatId, truncateText } from "@ttm/utils";
import { StoryPriority } from "@ttm/api/types/enums";

interface BaseStoryCardProps {
  story: Story;
  badgeChildren?: React.ReactNode;
  footerChildren: React.ReactNode;
}

export default function BaseStoryCard({
  story,
  badgeChildren,
  footerChildren,
}: BaseStoryCardProps) {
  const priorityData =
    PriorityTypeOption.get(story.priority as StoryPriority) ??
    defaultPriorityOption;

  const { styles: priorityStyles, icon: PriorityIcon } = priorityData;

  return (
    <div className="relative h-full">
      {badgeChildren && (
        <div className="absolute -top-2 -right-3 z-10">{badgeChildren}</div>
      )}

      <Card
        className={`relative hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full overflow-hidden flex flex-col ${priorityStyles.border}`}
        style={{
          ...(story.priority === StoryPriority.HIGH
            ? {
                backgroundImage: 'url("/images/be-doo-be-doo-minion2.gif")',
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundColor: "#ffecec",
                backgroundBlendMode: "soft-light",
              }
            : {}),
          border: priorityStyles.borderWidth
            ? `${priorityStyles.borderWidth} solid ${priorityStyles.borderColor}`
            : undefined,
        }}
      >
        <div
          className={`px-4 py-2 flex items-center justify-between border-b`}
          style={{
            backgroundColor: priorityStyles.accentBarColor,
            borderBottom: priorityStyles.borderBottomColor
              ? `1px solid ${priorityStyles.borderBottomColor}`
              : undefined,
          }}
        >
          <div className="flex flex-row">
            <Text
              variant="h4"
              color="systemBlack"
              className="text-slate-800 font-bold"
            >
              {formatId(story.id)}
            </Text>
          </div>
          {story.priority && (
            <div
              className="transition-all duration-200 cursor-pointer hover:scale-110"
              title={`Priority: ${priorityData.name}`}
            >
              <PriorityIcon
                className={`w-3.5 h-3.5 ${priorityStyles.textColor}`}
                strokeWidth={2.5}
              />
            </div>
          )}
        </div>

        <CardContent className="px-4 py-3 flex-grow flex flex-col gap-2">
          {story.project?.name && (
            <div className="flex items-center gap-1.5">
              <FolderOpen className="h-3 w-3 text-blue-700 flex-shrink-0" />
              <Text className="text-xs text-gray-800 font-medium uppercase tracking-wide truncate">
                {story.project.name}
              </Text>
            </div>
          )}
          <Text
            variant="h4"
            color="systemBlack"
            className="font-bold leading-tight line-clamp-2"
          >
            {story.name || "Story Name"}
          </Text>
          <Text
            variant="macro"
            className="text-slate-600 leading-snug line-clamp-2"
            dangerouslySetInnerHTML={{
              __html: truncateText(
                story.short_description || story.description,
                80,
              ),
            }}
          />
        </CardContent>

        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 mt-auto">
          {footerChildren}
        </div>
      </Card>
    </div>
  );
}
