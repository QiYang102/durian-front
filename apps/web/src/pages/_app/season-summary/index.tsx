import { Card, CardContent } from "@/components/ui/Card";
import { ClassicLayout } from "@/components/ui/ClassicLayout";
import { createFileRoute } from "@tanstack/react-router";
import SeasonForm from "@/components/season-summary/SeasonForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import SeasonSummaryDisplay from "@/components/season-summary/SeasonSummaryDisplay";
import { useState } from "react";
import TeamCheckInRequired from "@/components/TeamCheckInRequired";

type SeasonSessionSchema = z.infer<typeof schema>;

const schema = z.object({
  season_name: z.coerce.number().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

function SessionSummary() {
  const teamId = localStorage.getItem("teamId");
  const [seasonId, setSeasonId] = useState<number>(0);

  const form = useForm<SeasonSessionSchema>({
    defaultValues: {
      season_name: undefined,
      start_date: undefined,
      end_date: undefined,
    },
    resolver: zodResolver(schema),
  });

  const { formState } = form;
  const { isSubmitted } = formState;

  const renderContent = () => {
    if (!teamId) {
      return <TeamCheckInRequired />;
    }

    return (
      <ClassicLayout
        title="Season Summary"
        content={
          <>
            <Card>
              <CardContent>
                <FormProvider {...form}>
                  <form>
                    <SeasonForm teamId={teamId} setSeasonId={setSeasonId} />
                  </form>
                </FormProvider>
              </CardContent>
            </Card>
            {isSubmitted && <SeasonSummaryDisplay seasonId={seasonId} />}
          </>
        }
      />
    );
  };

  return renderContent();
}

export const Route = createFileRoute("/_app/season-summary/")({
  component: SessionSummary,
});
