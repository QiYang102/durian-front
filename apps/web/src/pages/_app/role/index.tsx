import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { z } from "zod";

import ErrorComponent from "@/components/Error";
import RoleList from "@/components/role/RoleList";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";
import { ClassicLayout } from "@/components/ui/ClassicLayout";
import { FormProvider, useForm } from "react-hook-form";
import withFeatureGuard from "@/components/guard/guard";
import { RoleEvents } from "@ttm/api/types/tracker";
import { Plus } from "lucide-react";

export default function RoleListing() {
  const { search, page, sort } = Route.useSearch();
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      search,
    },
  });
  const { watch, control } = form;

  const searchDebounce = useDebounce(watch("search"), 500);

  useEffect(() => {
    if (searchDebounce !== search) {
      router.navigate({
        search: (prev: any) => ({ ...prev, search: searchDebounce, page: 1 }),
        params: true,
      });
    }
  }, [searchDebounce, search, router]);

  const handlePageChange = (newPage: number) => {
    router.navigate({
      search: (prev: any) => ({ ...prev, page: newPage }),
      params: true,
    });
  };

  const handleSortChange = (newSortingColumn: string) => {
    router.navigate({
      search: (prev: any) => ({ ...prev, sort: newSortingColumn, page: 1 }),
      params: true,
    });
  };

  return (
    <ClassicLayout
      title="Role"
      content={
        <>
          <FormProvider {...form}>
            <div className="flex flex-row items-center gap-2 mb-4">
              <div className="w-full flex-1">
                <TextInput
                  id="search"
                  control={control}
                  placeholder="Search"
                  title="Search"
                  name="search"
                  showPassword={false}
                  toggleShowPassword={undefined}
                />
              </div>
              <div className="w-full sm:w-auto">
                <Button
                  variant="default"
                  className="sm:auto w-full sm:mt-2.5"
                  trackEventName={RoleEvents.ROLE_CREATE_INITIATED}
                  onClick={() => {
                    router.navigate({ to: "/role/new" });
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create
                </Button>
              </div>
            </div>
          </FormProvider>
          <RoleList
            search={search}
            page={page}
            sort={sort}
            onPageChange={handlePageChange}
            onSortChange={handleSortChange}
          />
        </>
      }
    />
  );
}

const ProtectedRoleManagement = withFeatureGuard(RoleListing, "role");

export const Route = createFileRoute("/_app/role/")({
  component: ProtectedRoleManagement,
  errorComponent: () => (
    <ErrorComponent errorMessage="Sorry, we couldn't find what you were looking for." />
  ),
  validateSearch: z.object({
    search: z.string().optional().default(""),
    page: z.number().optional().default(1),
    sort: z.string().optional().default("name"),
  }),
});
