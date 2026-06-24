import { useFormContext } from "react-hook-form";
import { AsyncCombobox } from "../ui/AsyncCombobox";
import { useListSeason } from "@ttm/api";

export default function SeasonForm({
  teamId,
  setSeasonId,
}: {
  teamId: string;
  setSeasonId: Function;
}) {
  const { control, setValue, handleSubmit } = useFormContext();

  const { data, isLoading } = useListSeason(
    [],
    {
      filter: {
        team: teamId,
      },
      sort: ["-end_date"],
    },
    {},
  );

  const onSubmit = (data: any) => {
    if (data) {
      setSeasonId(data.season_name);
    }
  };

  return (
    <div className="flex flex-row items-center gap-4">
      <AsyncCombobox
        name="season_name"
        formLabel="Season"
        control={control}
        placeholder="Select season"
        searchPlaceholder="Search season..."
        endpoint={`/season-session?filter{team}=${teamId}&sort[]=-end_date`}
        dataKey="seasons"
        labelField="season_name"
        valueField="id"
        defaultValue={!isLoading ? data?.seasons?.[0]?.id : ""}
        onPostChange={(value: number) => {
          setValue("season_name", value);
          handleSubmit(onSubmit)();
        }}
        required
      />
    </div>
  );
}
