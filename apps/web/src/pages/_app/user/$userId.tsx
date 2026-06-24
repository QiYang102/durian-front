import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import {
  getSingleUserList,
  editUser,
  useUploadUserImage,
  useDeleteUserImage,
} from "@ttm/api";
import { Card, CardContent } from "@/components/ui/Card";
import { ClassicLayout } from "@/components/ui/ClassicLayout";
import { toast } from "sonner";
import UserForm from "@/components/user/UserForm";
import { ReportCard } from "@/components/report/ReportCard";
import { UserEvents } from "@ttm/api/types/tracker";
import withFeatureGuard from "@/components/guard/guard";
import { ErrorState } from "@/components/ui/ErrorState";
import { Loading } from "@/components/ui/Loading";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import { useSession } from "@ttm/context";
import { Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfileHover } from "@/components/Telemetry";

const userFormSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Username is required" })
    .max(50, { message: "Username must be at most 50 characters" }),
  role: z.string().min(1, { message: "Role is required" }),
  fullname: z
    .string()
    .min(1, { message: "Full name is required" })
    .max(50, { message: "Full name must be at most 50 characters" }),
  email: z
    .string()
    .email("Invalid email address")
    .min(1, { message: "Email is required" }),
  mobile_number: z
    .string()
    .optional()
    .refine((val) => !val || /^\+?[\d\s-()]{1,15}$/.test(val), {
      message: "Invalid mobile number format",
    })
    .or(z.literal("")),
  image: z.any().nullable().optional(),
  capacity: z.number().optional(),
});

type UserFormSchema = z.infer<typeof userFormSchema>;

function UserDetail() {
  const { userId } = Route.useParams();
  const navigate = useNavigate();
  const { user: currentUser, init } = useSession();
  const { tab = "form" } = Route.useSearch();

  const [hasAvatarChange, setHasAvatarChange] = useState(false);
  const { handleMouseEnter, handleMouseLeave, ProfileMessage } =
    useProfileHover();

  const canEdit = currentUser?.id === parseInt(userId);

  const { data, isLoading, isError, refetch, isFetching } = getSingleUserList(
    ["users", userId],
    +userId,
    {},
    {},
    {
      enabled: !!userId,
    },
  );

  const user = data?.user || {};

  const form = useForm<UserFormSchema>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: "",
      role: "",
      fullname: "",
      email: "",
      mobile_number: "",
      image: null,
      capacity: 0,
    },
  });

  const {
    handleSubmit,
    reset,
    watch,
    formState: { isDirty },
  } = form;

  const image = watch("image");

  useEffect(() => {
    if (image instanceof File) {
      setHasAvatarChange(true);
    }
  }, [image]);

  const buttonDisabled = !isDirty && !hasAvatarChange;

  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      reset({
        username: user.username || "",
        role: user.role || "",
        fullname: user.fullname || "",
        email: user.email || "",
        mobile_number: user.mobile_number || "",
        image: user.image || null,
        capacity: user.capacity || 0,
      });
    }
  }, [user, reset]);

  // const { mutate: uploadAvatar } = useUploadUserImage({
  //   onSuccess: () => {
  //     toast.success("User has been updated successfully");

  //     setHasAvatarChange(false);
  //     refetch();
  //   },
  //   onError: () => {
  //     toast.error("Failed to upload user avatar. Please try again.");
  //   },
  // });

  // const { mutate: deleteAvatar } = useDeleteUserImage({
  //   onSuccess: () => {
  //     toast.success("User image has been deleted successfully");
  //   },
  //   onError: () => {
  //     toast.error("Failed te delete user image. Please try again.");
  //   },
  // });

  const { mutate: editUserDetail, isPending: isUpdating } = editUser({
    onSuccess: () => {
      toast.success("User has been updated successfully");
      refetch();

      setTimeout(() => {
        init();
      }, 1000);
    },
    onError: (error: any) => {
      const message =
        typeof error?.data === "string"
          ? error.data
          : error?.data?.detail ||
            error?.message ||
            "Failed to update user. Please try again";

      toast.error(message);
    },
  });

  const onSubmit = (data: UserFormSchema) => {
    const formData = new FormData();

    // Append text fields
    formData.append("fullname", data.fullname || "");
    formData.append("username", data.username || "");
    formData.append("email", data.email || "");
    formData.append("mobile_number", data.mobile_number || "");

    // Append file if present
    if (data.image instanceof File) {
      formData.append("image", data.image);
    } else if (data.image === null && user?.image) {
      // user cleared existing image
      formData.append("delete_image", "true");
    }
    formData.append("id", userId);

    editUserDetail(formData);
  };

  const renderFormContent = () => {
    if (isLoading || isFetching) {
      return (
        <Card>
          <CardContent>
            <Loading size="md" showText text="Loading user details..." />
          </CardContent>
        </Card>
      );
    }

    if (isError || !user) {
      return (
        <ErrorDisplay
          title="Error Loading User Details"
          message="We encountered an error while loading the user. Please try again."
          onRetry={refetch}
          retryText="Reload Data"
        />
      );
    }

    return (
      <Card>
        <CardContent className="flex flex-col gap-6">
          <FormProvider {...form}>
            <form
              id="user-form"
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <UserForm readOnly={!canEdit} />
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    );
  };

  return (
    <ClassicLayout
      title={`User Profile ${user?.fullname ? ` - ${user.fullname}` : ""}`}
      backButton
      backButtonTrackEventName={UserEvents.USER_UPDATE_BACK_CLICKED}
      actionButton={
        tab === "form" && canEdit ? (
          <Button
            type="submit"
            form="user-form"
            disabled={isUpdating || buttonDisabled}
            trackEventName={UserEvents.USER_UPDATE_SAVE_BUTTON_CLICKED}
          >
            <Save className="w-4 h-4 mr-2" />
            {isUpdating ? "Saving..." : "Save"}
          </Button>
        ) : null
      }
      content={
        <div className="flex flex-col gap-6">
          <Card>
            <CardContent className="overflow-x-auto">
              <Tabs defaultValue={tab}>
                <div className="relative w-full">
                  <TabsList className="w-full justify-start grid-cols-2">
                    <TabsTrigger
                      value="form"
                      className="flex items-center justify-start whitespace-nowrap"
                      onClick={() =>
                        navigate({
                          to: "/user/$userId",
                          params: { userId },
                          search: { tab: "form" },
                          replace: true,
                        })
                      }
                    >
                      User Details
                    </TabsTrigger>

                    <TabsTrigger
                      value="report"
                      className="flex items-center justify-start whitespace-nowrap"
                      onClick={() =>
                        navigate({
                          to: "/user/$userId",
                          params: { userId },
                          search: { tab: "report" },
                          replace: true,
                        })
                      }
                    >
                      Report
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="form">
                  <div>{renderFormContent()}</div>
                </TabsContent>

                <TabsContent value="report">
                  <ReportCard userId={userId} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      }
    />
  );
}

const ProtectedUserDetail = withFeatureGuard(UserDetail, "user");

export const Route = createFileRoute("/_app/user/$userId")({
  component: UserDetail,
  errorComponent: ErrorState,
});
