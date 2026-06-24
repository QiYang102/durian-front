import TagRegistryList from "@/components/tag-registry/TagRegistryList";
import TagRegistrySearchForm from "@/components/tag-registry/TagRegistrySearchForm";
import TeamCheckInRequired from "@/components/TeamCheckInRequired";
import { Card, CardContent } from "@/components/ui/Card";
import { ClassicLayout } from "@/components/ui/ClassicLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  name: z.string().optional(),
  project: z.coerce.number().optional(),
});

type TagRegistrySearchSchema = z.infer<typeof schema>;

function Tag() {
  const teamId = localStorage.getItem("teamId");
  const [searchParams, setSearchParams] = useState<TagRegistrySearchSchema>({
    name: "",
    project: undefined,
  });
  const form = useForm<TagRegistrySearchSchema>({
    defaultValues: {
      name: "",
      project: undefined,
    },
    resolver: zodResolver(schema),
  });

  const { handleSubmit } = form;

  const onSubmit = (data: TagRegistrySearchSchema) => {
    setSearchParams(data);
  };

  if (!teamId) {
    return <TeamCheckInRequired />;
  }

  return (
    <ClassicLayout
      title="Tag Registry"
      content={
        <>
          <Card>
            <CardContent>
              <FormProvider {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <TagRegistrySearchForm
                    teamId={teamId}
                    setSearchParams={setSearchParams}
                  />
                </form>
              </FormProvider>
            </CardContent>
          </Card>
          <TagRegistryList searchParams={searchParams} teamId={teamId} />
        </>
      }
    />
  );
}

export const Route = createFileRoute("/_app/tag-registry/")({
  component: Tag,
});
