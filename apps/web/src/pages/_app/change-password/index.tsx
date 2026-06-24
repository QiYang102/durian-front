import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeftCircle, Save } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";

import { useResetPassword } from "@ttm/api";

import { Container } from "@/components/Container";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Text } from "@/components/ui/Text";
import { TextInput } from "@/components/ui/TextInput";
import { toast } from "sonner";

function ChangePassword() {
  const formSchema = z.object({
    old_password: z.string(),
    new_password1: z.string(),
    // .min(2, {
    //   message: "New Password must be at least 2 characters.",
    // }), add message to trigger error
    new_password2: z.string(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      old_password: "",
      new_password1: "",
      new_password2: "",
    },
  });

  const {
    watch,
    reset,
    formState: { errors },
  } = form;
  const navigate = useNavigate();

  const newPassword = watch("new_password1");
  const confirmPassword = watch("new_password2");

  const passwordsMatch = newPassword === confirmPassword;

  const { mutateAsync: resetPassword } = useResetPassword();

  const passwordRequirementTests = {
    length: (pw: string) => pw.length >= 8,
    upperCase: (pw: string) => /[A-Z]/i.test(pw),
    lowerCase: (pw: string) => /[a-z]/.test(pw),
    number: (pw: string) => /[0-9]/.test(pw),
    symbol: (pw: string) => /[^A-Za-z0-9]/.test(pw),
  };

  const lengthRequirementMet = passwordRequirementTests.length(newPassword);
  const upperCaseRequirementMet =
    passwordRequirementTests.upperCase(newPassword);
  const lowerCaseRequirementMet =
    passwordRequirementTests.lowerCase(newPassword);
  const numberRequirementMet = passwordRequirementTests.number(newPassword);
  const symbolRequirementMet = passwordRequirementTests.symbol(newPassword);

  // Check if all requirements are met
  const allRequirementsMet =
    lengthRequirementMet &&
    upperCaseRequirementMet &&
    lowerCaseRequirementMet &&
    numberRequirementMet &&
    symbolRequirementMet;

  function onSubmit(data: any) {
    // check if new password meets all requirements
    if (!allRequirementsMet) {
      toast.error("Please ensure your new password meets all requirements");
      return;
    }

    // check if new password is same with confirm password
    if (!passwordsMatch) {
      toast.error("New password and confirm password do not match");
      return;
    }

    resetPassword(data)
      .then((data) => {
        if (data) {
          toast.success("Password has been updated successfully");

          navigate({ to: "/" });
          reset();
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to update password. Please try again.");

        if (error.data.new_password2) {
          let errorMessage = "";
          error.data.new_password2.forEach((message: string) => {
            errorMessage += message;

            // if it is the last message, no need to add next line
            if (
              error.data.new_password2.indexOf(message) !==
              error.data.new_password2.length - 1
            ) {
              errorMessage += "\n";
            }
          });
          toast.error(errorMessage);
        } else if (error.data.old_password) {
          toast.error(
            "Your old password was entered incorrectly. Please enter it again.",
          );
        } else {
          toast.error(JSON.stringify(error));
        }
      });
  }

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword1, setShowNewPassword1] = useState(false);
  const [showNewPassword2, setShowNewPassword2] = useState(false);

  return (
    <Container>
      <div>
        <div className="pb-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex min-w-0 items-center">
              <Link className="mr-2" to="/">
                <ArrowLeftCircle className="text-primary h-9 w-9" />
              </Link>

              <div className="mt-4 flex flex-shrink-0 md:mt-0">
                <Text variant="h1">Change Password</Text>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="h-screen p-8">
          <div className="flex justify-between pb-3">
            <span className="text-base">
              To change your password, enter your current password and your new
              password below.
            </span>
          </div>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <TextInput
                title="Current Password"
                name="old_password"
                control={form.control}
                type={"password"}
                showPassword={showOldPassword}
                toggleShowPassword={() => setShowOldPassword(!showOldPassword)}
                autoCapitalize="none"
                autoComplete="current-password"
                autoCorrect="off"
                disabled={false}
                label="Current Password"
                placeholder="Current Password"
                iconName="Lock"
                required
              />

              <TextInput
                name="new_password1"
                title="New Password"
                control={form.control}
                type={"password"}
                showPassword={showNewPassword1}
                toggleShowPassword={() =>
                  setShowNewPassword1(!showNewPassword1)
                }
                autoCapitalize="none"
                autoComplete="new-password"
                autoCorrect="off"
                disabled={false}
                label="New Password"
                placeholder="New Password"
                iconName="Lock"
                required
              />

              <TextInput
                name="new_password2"
                title="Confirm Password"
                control={form.control}
                type={"password"}
                showPassword={showNewPassword2}
                toggleShowPassword={() =>
                  setShowNewPassword2(!showNewPassword2)
                }
                autoCapitalize="none"
                autoComplete="new-password"
                autoCorrect="off"
                disabled={false}
                placeholder="Repeat New Password"
                iconName="Lock"
                required
              />
              <div className="flex flex-col">
                <Text variant="xs">Password requirements:</Text>
                {!lengthRequirementMet && (
                  <div className="flex flex-row items-center gap-2">
                    <Icon name="x" size={"sm"} color={"danger"} />
                    <span className="text-sm text-red-500">
                      Minimum 8 characters
                    </span>
                  </div>
                )}
                {!upperCaseRequirementMet && (
                  <div className="flex flex-row items-center gap-2">
                    <Icon name="x" size={"sm"} color={"danger"} />
                    <span className="text-sm text-red-500">
                      At least one uppercase letter
                    </span>
                  </div>
                )}
                {!lowerCaseRequirementMet && (
                  <div className="flex flex-row items-center gap-2">
                    <Icon name="x" size={"sm"} color={"danger"} />
                    <span className="text-sm text-red-500">
                      At least one lowercase letter
                    </span>
                  </div>
                )}
                {!numberRequirementMet && (
                  <div className="flex flex-row items-center gap-2">
                    <Icon name="x" size={"sm"} color={"danger"} />
                    <span className="text-sm text-red-500">
                      At least one number (e.g. 0-9)
                    </span>
                  </div>
                )}
                {!symbolRequirementMet && (
                  <div className="flex flex-row items-center gap-2">
                    <Icon name="x" size={"sm"} color={"danger"} />
                    <span className="text-sm text-red-500">
                      At least one symbol (e.g. @#$%)
                    </span>
                  </div>
                )}
                {/* if all requirements are met, show success message */}
                {allRequirementsMet && newPassword.length > 0 && (
                  <div className="flex flex-row items-center gap-2">
                    <Icon name="check" size={"sm"} color={"success"} />
                    <span className="text-sm text-green-500">
                      All password requirements met
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-shrink-0 md:mt-0">
                <Button variant="default" type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </Container>
  );
}

export const Route = createFileRoute("/_app/change-password/")({
  component: ChangePassword,
});
