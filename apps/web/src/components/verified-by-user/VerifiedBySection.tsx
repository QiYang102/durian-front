import {
  getSingleStory,
  listVerifiedByUsers,
  useCreateVerifiedByUser,
} from "@ttm/api";
import { Card, CardContent } from "@/components/ui/Card";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import { Loading } from "@/components/ui/Loading";
import { Pagination } from "@/components/Pagination";
import { useState } from "react";
import { ChevronDown, ChevronUp, UserCheck, Plus } from "lucide-react";
import VerifiedByUserCard from "./VerifiedByUserCard";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { CustomDialog } from "../ui/CustomDialog";
import { FormProvider, useForm } from "react-hook-form";
import { VerifiedByUserForm } from "./VerifiedByUserForm";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const schema = z.object({
  user: z.coerce.number().min(1, ""),
  total_hour_used: z.coerce.number().min(0, ""),
});

type VerifiedByUserFormSchema = z.infer<typeof schema>;

interface VerifiedByUserListProps {
  storyId: string;
}

export default function VerifiedByUserList({
  storyId,
}: VerifiedByUserListProps) {
  const [page, setPage] = useState(1);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const form = useForm<VerifiedByUserFormSchema>({
    defaultValues: {
      total_hour_used: 0,
    },
    resolver: zodResolver(schema),
  });

  const {
    handleSubmit,
    reset,
    formState: { isDirty },
  } = form;

  const { data: storyData } = getSingleStory(
    ["story-detail", storyId],
    parseInt(storyId),
    {
      include: ["iteration.*"],
    },
    {
      iteration: "iterations",
    },
  );

  const story = storyData?.story;

  const iteration = story?.iteration as { id?: number } | number | undefined;
  const iterationId = typeof iteration === "object" ? iteration?.id : iteration;

  const { data, isLoading, isError, refetch } = listVerifiedByUsers(
    ["list-of-story-verified-users", page.toString(), storyId],
    {
      page: page,
      per_page: 3,
      filter: { story: storyId, is_active: "true" },
      include: ["user.*"],
    },
    { user: "users" },
  );

  const { verifiedByUsers, meta } = data || {};

  const { mutate: createVerifiedByUser, isPending: isCreating } =
    useCreateVerifiedByUser({
      onSuccess: () => {
        toast.success("Verified user has been added successfully");

        setShowAddDialog(false);
        reset();
        refetch();
      },
      onError: () => {
        toast.error("Failed to add verified user. Please try again.");
      },
    });

  const onSubmit = (data: VerifiedByUserFormSchema) => {
    createVerifiedByUser({
      story: parseInt(storyId),
      user: data.user,
      total_hour_used: data.total_hour_used,
      iteration: iterationId,
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Loading
            showText
            text="Loading verified users..."
            size="lg"
            className="items-center justify-center"
          />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <ErrorDisplay
        title="Failed to load verified users"
        message="We couldn't load the verified users data. Please check your connection and try again."
        onRetry={() => {
          refetch();
        }}
        retryText="Reload Data"
      />
    );
  }

  if (!verifiedByUsers || verifiedByUsers.length === 0) {
    return (
      <>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <Text variant="h3">Verified By</Text>
            </div>
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <UserCheck className="mx-auto h-12 w-12" />
              </div>
              <Text className="text-lg font-medium text-gray-900 mb-1">
                No verified users yet
              </Text>
            </div>
            <Button
              type="button"
              variant="default"
              className="w-full mt-4 py-3"
              onClick={() => setShowAddDialog(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Verified User
            </Button>
          </CardContent>
        </Card>

        <CustomDialog
          isOpen={showAddDialog}
          onClose={() => {
            setShowAddDialog(false);
            reset();
          }}
          onConfirm={handleSubmit(onSubmit)}
          confirmText={isCreating ? "Adding..." : "Add"}
          title="Add Verified User"
          isLoading={isCreating || !isDirty}
        >
          <FormProvider {...form}>
            <form id="verified-user-form" className="flex flex-col gap-6">
              <VerifiedByUserForm />
            </form>
          </FormProvider>
        </CustomDialog>
      </>
    );
  }

  return (
    <>
      <Card>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Text variant="h3">Verified By</Text>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="h-8 w-8 p-0"
              >
                {isCollapsed ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </Button>
            </div>

            {!isCollapsed && (
              <>
                <div className="space-y-3">
                  {verifiedByUsers.map((verifiedUser) => (
                    <VerifiedByUserCard
                      key={verifiedUser.id}
                      verifiedUser={verifiedUser}
                      onDelete={() => setPage(1)}
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
                  Add Verified User
                </Button>

                <div className="flex items-center justify-end space-x-2 py-4">
                  <div className="text-muted-foreground flex flex-1 items-center gap-4 text-sm">
                    {meta?.total_results} total
                  </div>
                  <div className="space-x-2">
                    <Pagination
                      currentPage={meta?.page}
                      totalPages={meta?.total_pages}
                      onPageChange={(page) => setPage(page)}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <CustomDialog
        isOpen={showAddDialog}
        onClose={() => {
          setShowAddDialog(false);
          reset();
        }}
        onConfirm={handleSubmit(onSubmit)}
        confirmText={isCreating ? "Adding..." : "Add"}
        title="Add Verified User"
        isLoading={isCreating || !isDirty}
      >
        <FormProvider {...form}>
          <form id="verified-user-form" className="flex flex-col gap-6">
            <VerifiedByUserForm />
          </form>
        </FormProvider>
      </CustomDialog>
    </>
  );
}
