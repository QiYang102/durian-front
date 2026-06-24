import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { createUser } from "@ttm/api";
import { Card, CardContent } from "@/components/ui/Card";
import { ClassicLayout } from "@/components/ui/ClassicLayout";
import { toast } from "@/components/ui/UseToast";
import UserForm from "@/components/user/UserForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserEvents } from "@ttm/api/types/tracker";
import withFeatureGuard from "@/components/guard/guard";

function NewUserDetail() {
  const navigate = useNavigate();
  const { t } = useTranslation('user');
  
  const schema = z.object({
      username: z
        .string()
        .min(1, { message: t('user.userForm.form.fields.username.required') })
        .max(20, { message: t('user.userForm.form.fields.username.maxLength') }),
      role: z.number({ message: t('user.userForm.form.fields.role.required') }),
      fullname: z
        .string()
        .min(1, { message: t('user.userForm.form.fields.fullname.required') })
        .max(100, { message: t('user.userForm.form.fields.fullname.maxLength') }),
      email: z
        .string()
        .email(t('user.userForm.form.fields.email.invalid'))
        .min(1, { message: t('user.userForm.form.fields.email.required') }),
      mobile: z
        .string()
        .optional()
        .refine((val) => !val || /^\+?[\d\s-()]{1,15}$/.test(val), {
          message: t('user.userForm.form.fields.mobile.invalid'),
        })
        .or(z.literal("")),
      address: z
        .string()
        .max(512, { message: t('user.userForm.form.fields.address.maxLength') })
        .optional()
        .or(z.literal("")),
      postcode: z
        .string()
        .max(16, { message: t('user.userForm.form.fields.postcode.maxLength') })
        .optional()
        .or(z.literal("")),
      city: z
        .string()
        .max(255, { message: t('user.userForm.form.fields.city.maxLength') })
        .optional()
        .or(z.literal("")),
      state: z
        .string()
        .max(64, { message: t('user.userForm.form.fields.state.maxLength') })
        .optional()
        .or(z.literal("")),
      country: z
        .string()
        .max(64, { message: t('user.userForm.form.fields.country.maxLength') })
        .optional()
        .or(z.literal("")),
    });
  

  const form = useForm({
    defaultValues: {
      username: "",
      role: null,
      fullname: "",
      email: "",
      mobile: "",
      address: "",
      postcode: "",
      city: "",
      state: "",
      country: "",
    },
    resolver: zodResolver(schema),
  });

  const { handleSubmit, formState } = form;
  const { isDirty } = formState;

  // API mutation for creating user
  const { mutateAsync: createUserDetail, isPending: isCreating } = createUser();

  const onSubmit = async (data: z.infer<typeof schema>) => {    
    try {
      const result = await createUserDetail(data);

      if (result) {        
        toast({
          title: "User Created",
          description: "User created successfully.",
        });

        // Navigate to the created user's edit page
        navigate({
          to: "/user/$userId",
          params: {
            userId: result.id.toString(),
          },
          replace: true,
        });
      }
    } catch (error: any) {      
      toast({
        title: "Error",
        description: error?.data
          ? typeof error.data === "string"
            ? error.data
            : JSON.stringify(error.data)
          : error?.message || "An error occurred while creating the user",
        variant: "destructive",
      });
    }
  };

  const renderContent = () => {
    return (
      <FormProvider {...form}>
        <form
          id="sample-user-create-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <UserForm />
        </form>
      </FormProvider>
    );
  };

  return (
    <ClassicLayout
      title={t("user.userForm.title.createUser")}
      backButton
      backButtonTrackEventName={UserEvents.USER_CREATE_BACK_CLICKED}
      actionButton={
        <div className="flex gap-3">
          <Button
            type="submit"
            form="sample-user-create-form"
            disabled={isCreating || !isDirty}
            trackEventName={UserEvents.USER_CREATE_BUTTON_CLICKED}
          >
            {isCreating ? "Creating..." : "Create"}
          </Button>

        </div>
      }
      content={
        <Card>
          <CardContent className="flex flex-col gap-6">
            {renderContent()}
          </CardContent>
        </Card>
      }
    />
  );
}

const ProtectedNewUser = withFeatureGuard(NewUserDetail, "user");

export const Route = createFileRoute("/_app/user/new")({
  component: ProtectedNewUser,
});
