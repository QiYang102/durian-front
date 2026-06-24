import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/Button";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { editUser, useUploadUserImage, getSingleUserList } from "@ttm/api";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Loading } from "@/components/ui/Loading";
import { ClassicLayout } from "@/components/ui/ClassicLayout";
import { toast } from "sonner";
import MyProfile from "@/components/account/MyProfile";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorState } from "@/components/ui/ErrorState";
import { useSession } from "@ttm/context";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import { Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { ReportCard } from "@/components/report/ReportCard";

function Account() {
  const { user: sessionUser } = useSession();
  const userId = sessionUser?.id;
  const navigate = useNavigate();
  const { tab = "profile" } = Route.useSearch();

  const { data, isLoading, isError, refetch, isFetching } = getSingleUserList(
    ["users", userId?.toString() || ""],
    userId,
    {},
    {},
    {
      enabled: !!userId,
    },
  );

  const user = data?.user || {};

  const [hasAvatarChange, setHasAvatarChange] = useState(false);

  const schema = z.object({
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

  type ProfileFormSchema = z.infer<typeof schema>;

  const form = useForm<ProfileFormSchema>({
    defaultValues: {
      username: "",
      role: "",
      fullname: "",
      email: "",
      mobile_number: "",
      image: null,
      capacity: 0,
    },
    resolver: zodResolver(schema),
  });

  const { handleSubmit, reset, watch, formState } = form;
  const { isDirty } = formState;

  const image = watch("image");

  useEffect(() => {
    if (image instanceof File) {
      setHasAvatarChange(true);
    }
  }, [image]);

  const buttonDisabled = !isDirty && !hasAvatarChange;

  useEffect(() => {
    if (user) {
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

  const { mutate: uploadAvatar } = useUploadUserImage({
    onSuccess: () => {
      toast.success("Profile has been updated successfully");

      setHasAvatarChange(false);
      refetch();
    },
    onError: () => {
      toast.error("Failed to upload profile picture. Please try again.");
    },
  });

  const { mutate: editUserDetail, isPending: isUpdating } = editUser({
    onSuccess: () => {
      const formData = form.getValues();

      if (formData.image && formData.image instanceof File) {
        uploadAvatar({
          id: userId,
          image: formData.image,
        });
      } else {
        toast.success("Profile has been updated successfully");

        refetch();
      }
    },
    onError: (error: any) => {
      toast.error(
        error?.data ||
          error?.message ||
          "Failed to update profile. Please try again.",
      );
    },
  });

  const onSubmit = async (data: ProfileFormSchema) => {
    const { image, ...updateData } = data;
    updateData.id = userId;

    editUserDetail(updateData);
  };

  const renderProfileContent = () => {
    if (isLoading || isFetching) {
      return (
        <Card>
          <CardContent>
            <Loading showText text="Loading profile..." size="lg" />
          </CardContent>
        </Card>
      );
    }

    if (isError || !user) {
      return (
        <ErrorDisplay
          title="Error Loading Profile"
          message="We encountered an error while loading your profile. Please try again."
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
              id="my-profile-form"
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <MyProfile />
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    );
  };

  return (
    <ClassicLayout
      title="Account"
      backButton
      actionButton={
        tab === "profile" ? (
          <div className="flex gap-3">
            <Button
              type="submit"
              form="my-profile-form"
              disabled={isUpdating || buttonDisabled}
            >
              <Save className="w-4 h-4 mr-2" />
              {isUpdating ? "Saving..." : "Save"}
            </Button>
          </div>
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
                      value="profile"
                      className="flex items-center justify-start whitespace-nowrap"
                      onClick={() =>
                        navigate({
                          to: "/account",
                          search: { tab: "profile" },
                          replace: true,
                        })
                      }
                    >
                      Profile
                    </TabsTrigger>

                    <TabsTrigger
                      value="report"
                      className="flex items-center justify-start whitespace-nowrap"
                      onClick={() =>
                        navigate({
                          to: "/account",
                          search: { tab: "report" },
                          replace: true,
                        })
                      }
                    >
                      Report
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="profile">
                  {renderProfileContent()}
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

export const Route = createFileRoute("/_app/account/")({
  component: Account,
  errorComponent: ErrorState,
});
