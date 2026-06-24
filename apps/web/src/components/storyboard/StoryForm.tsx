import { useFormContext } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { TextInput } from "@/components/ui/TextInput";
import { Text } from "@/components/ui/Text";
import { Separator } from "@/components/ui/Separator";
import { Combobox } from "@/components/ui/Combobox";
import { PRIORITY_CHOICE } from "@ttm/api/types/choices";
import { AsyncCombobox } from "../ui/AsyncCombobox";
import CkEditor from "../ui/CkEditor";
import { CheckBoxInline } from "../ui/CheckboxInline";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/TextArea";
import { Clock } from "lucide-react";
import { Story, StoryStatusOption } from "@ttm/api/types/models/story";
import { Badge } from "../ui/Badge";
import { STORY_TEMPLATE } from "@ttm/api/types/editorTemplates";
import { formatId } from "@ttm/utils";

interface StoryFormProps {
  story?: Story;
}

export function StoryForm({ story }: StoryFormProps) {
  const navigate = useNavigate();
  const { control, setValue, getValues } = useFormContext();
  const [teamId, setTeamId] = useState<string | null>(null);
  const status = story?.status;
  const totalEstimateTime = story?.total_estimate_time || 0;
  const parentStoryId = story?.parent_story;

  useEffect(() => {
    const checkedInTeamId = localStorage.getItem("teamId");
    setTeamId(checkedInTeamId);
  }, []);

  const handleParentStoryClick = () => {
    if (parentStoryId) {
      navigate({
        to: "/story/$storyId",
        params: { storyId: parentStoryId.toString() },
      });
    }
  };

  return (
    <>
      {parentStoryId && (
        <Button
          variant="outline"
          className="text-xs px-3 py-2 font-semibold border border-blue-500 bg-blue-100 text-blue-600 hover:bg-blue-50 w-fit self-start"
          onClick={handleParentStoryClick}
        >
          Parent Story: {formatId(parentStoryId.toString())}
        </Button>
      )}
      <div className="space-y-1">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 flex items-center gap-3">
            <Text variant="h3">Story Details</Text>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5">
              <Clock className="w-4 h-4 text-gray-500" />
              <Text variant="caption" className="font-medium text-gray-700">
                {totalEstimateTime > 0 ? `${totalEstimateTime}h` : "0.00"}
              </Text>
            </div>

            {status && (
              <Badge
                className="text-xs px-3 py-2 font-semibold border"
                color={StoryStatusOption.get(status || "")?.chipVariant}
              >
                {StoryStatusOption.get(status || "")?.chipTextVariant}
              </Badge>
            )}
          </div>
        </div>
        <Separator />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AsyncCombobox
          name="project"
          formLabel="Project"
          control={control}
          endpoint={teamId ? `/projects?filter{team}=${teamId}` : "/projects"}
          dataKey="projects"
          labelField="name"
          valueField="id"
          placeholder="Select project"
          searchPlaceholder="Search projects..."
          required
          defaultValue={story ? story.project?.id : null}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <TextInput
          name="name"
          control={control}
          title="Story Name"
          placeholder="Enter story name"
          required
          autoMargin={false}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Textarea
          name="short_description"
          formLabel="Short Description"
          control={control}
          placeholder="Enter story short description"
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <CkEditor
          name="description"
          title="Long Description"
          control={control}
          placeholder="Enter story long description"
          required
          minHeight="180px"
          defaultValue={STORY_TEMPLATE}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Combobox
          name="priority"
          formLabel="Priority Level"
          control={control}
          items={PRIORITY_CHOICE}
          placeholder="Select Priority Level"
          required
        />

        <div className="flex flex-wrap md:col-span-1 gap-6 mt-7">
          <CheckBoxInline
            name="is_rnd"
            control={control}
            formLabel="Is R&D?"
            onClick={() =>
              setValue("is_rnd", !getValues("is_rnd"), {
                shouldDirty: true,
              })
            }
            className="my-3"
          />
          <CheckBoxInline
            name="is_multi"
            control={control}
            formLabel="Is Multi?"
            onClick={() =>
              setValue("is_multi", !getValues("is_multi"), {
                shouldDirty: true,
              })
            }
            className="my-3"
          />
        </div>
      </div>
    </>
  );
}
