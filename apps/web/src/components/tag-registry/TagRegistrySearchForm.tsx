import { useRef } from "react";
import { useFormContext } from "react-hook-form";
import { TextInput } from "../ui/TextInput";
import { AsyncCombobox } from "../ui/AsyncCombobox";

export default function TagRegistrySearchForm({
  teamId,
  setSearchParams,
}: {
  teamId: string | null;
  setSearchParams: Function;
}) {
  const { control, setValue } = useFormContext();
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const handleProjectChange = (value: number | null) => {
    setValue("project", value ?? undefined);
    setSearchParams((prev: any) => ({
      ...prev,
      project: value ?? undefined,
    }));
  };

  const handleNameChange = (value: string) => {
    setValue("name", value);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      setSearchParams((prev: any) => ({ ...prev, name: value }));
    }, 500);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <TextInput
        name="name"
        title="Tag Name"
        control={control}
        onChange={(e) => handleNameChange(e.target.value)}
        placeholder="Search tag name"
      />
      <AsyncCombobox
        name="project"
        formLabel="Project Name"
        control={control}
        endpoint={`/projects?filter{team}=${teamId}`}
        dataKey="projects"
        labelField="name"
        valueField="id"
        onPostChange={handleProjectChange}
        placeholder="Select project"
        searchPlaceholder="Search projects..."
      />
    </div>
  );
}
