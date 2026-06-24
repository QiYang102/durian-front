import { useListStoryTag, useRemoveTag } from "@ttm/api";
import { StoryTag } from "@ttm/api/types/models/story-tag";
import { RemovableTag } from "./RemoveableTag";
import { toast } from "sonner";
import { Skeleton } from "../ui/Skeleton";
import { Button } from "../ui/Button";
import { Text } from "../ui/Text";
import { Icon } from "../ui/Icon";
import { Plus, Tag } from "lucide-react";

export default function TagList({
  storyId,
  setShowAddDialog,
  isPending,
}: {
  storyId: string;
  setShowAddDialog: (show: boolean) => void;
  isPending: boolean;
}) {
  const queryKey = ["tags", storyId.toString()];
  const { data, isLoading, isError, isFetching, refetch } = useListStoryTag(
    queryKey,
    +storyId,
    {},
    {},
    {},
  );

  const tags: StoryTag[] = data?.tag ?? [];

  const { mutate } = useRemoveTag({
    onSuccess: () => {
      toast.success("Story tag has been deleted successfully");
      refetch();
    },
    onError: () => {
      toast.error("Failed to remove tag. Please try again.");
    },
  });

  const onRemoveTag = (tagId: number) => {
    mutate({
      storyId: storyId,
      tagId: tagId,
    });
  };

  const renderContent = () => {
    if (isLoading || isFetching) {
      return (
        <div className="flex flex-row flex-wrap gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-6 w-20 rounded-full" />
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4">
            <Icon
              name="alert-circle"
              size="lg"
              color="danger"
              className="h-12 w-12"
            />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            Error Loading Announcements
          </h3>
          <p className="mb-6 max-w-md text-sm text-gray-600">
            We encountered an error while loading the tags. Please try again.
          </p>

          <Button
            onClick={() => refetch()}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Icon name="refresh-cw" size="sm" />
            Reload Data
          </Button>
        </div>
      );
    }

    if (!isLoading && tags.length === 0) {
      return (
        <div>
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Tag className="mx-auto h-12 w-12" />
            </div>
            <Text className="text-lg font-medium text-gray-900 mb-1">
              No story tag yet
            </Text>
          </div>
          <Button
            type="button"
            variant="default"
            className="w-full mt-4 py-3"
            onClick={() => setShowAddDialog(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            {isPending ? "Creating..." : "Add Tag"}
          </Button>
        </div>
      );
    }

    return (
      <>
        <div className="flex flex-row flex-wrap gap-3">
          {tags?.map((t: StoryTag) => (
            <RemovableTag
              key={t.id}
              label={t.name}
              onRemove={() => onRemoveTag(t.id)}
              color={t.color}
            />
          ))}
        </div>
        <Button
          type="button"
          variant="default"
          className="w-full mt-4 py-3"
          onClick={() => setShowAddDialog(true)}
        >
          <Plus className="w-5 h-5 mr-2" />
          {isPending ? "Creating..." : "Add Tag"}
        </Button>
      </>
    );
  };

  return renderContent();
}
