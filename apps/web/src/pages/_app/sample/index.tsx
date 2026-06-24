import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { ClassicLayout } from "@/components/ui/ClassicLayout";
import SampleRoleListingComponent from "@/components/sample/SampleRoleListingComponent";
import { FormProvider, useForm } from "react-hook-form";
import { TextInput } from "@/components/ui/TextInput";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";

const schema = z.object({
  search: z.string().optional(),
});
export default function Sample() {
  const form = useForm({
    defaultValues: {
      search: "",
    },
    resolver: zodResolver(schema),
  });

  const { control, handleSubmit } = form;
  const [submittedSearch, setSubmittedSearch] = useState("");

  const onSubmit = (data: { search?: string }) => {
    setSubmittedSearch(data.search || "");
  };

  return (
    <ClassicLayout
      title="Sample Page"
      content={
        <>
          <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-row items-center gap-2 mb-4">
                <TextInput
                  id="search"
                  control={control}
                  placeholder="Search"
                  title="Search"
                  name="search"
                  showPassword={false}
                  toggleShowPassword={undefined}
                />
                <Button type="submit">Search</Button>
              </div>
            </form>
          </FormProvider>
          <SampleRoleListingComponent searchValue={submittedSearch} />
        </>
      }
    />
  );
}
export const Route = createFileRoute("/_app/sample/")({
  component: Sample,
});
