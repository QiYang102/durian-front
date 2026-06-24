import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createFileRoute,
  Link,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { Spinners } from "@/components/Spinner";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useResetPasswordConfirm } from "@ttm/api";

const schema = z
  .object({
    new_password1: z.string().min(8, "Password must be at least 8 characters"),
    new_password2: z
      .string()
      .min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((data) => data.new_password1 === data.new_password2, {
    message: "Passwords don't match",
    path: ["new_password2"],
  });

function ResetPasswordConfirm() {
  const navigate = useNavigate();
  const { uid, tokenid } = useParams({
    from: "/_auth/reset-password-confirm/$uid/$tokenid",
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      new_password1: "",
      new_password2: "",
    },
  });

  const { control, handleSubmit, watch } = form;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const resetPasswordConfirm = useResetPasswordConfirm({
    onSuccess: () => {
      toast.success(
        "Your password has been updated successfully. Please login with your new password.",
      );

      navigate({ to: "/login", replace: true });
    },
    onError: (error: any) => {
      console.error("Password reset error:", error);

      if (error?.data?.new_password2) {
        const errorMessages = Array.isArray(error.data.new_password2)
          ? error.data.new_password2.join("\n")
          : error.data.new_password2;

        toast.error("Failed to reset password. Please try again.");
      } else if (error?.data?.token) {
        toast.error(
          "This password reset link is invalid or has expired. Please request a new one.",
        );
      } else {
        toast.error(
          error?.message || "Failed to reset password. Please try again.",
        );
      }
    },
  });

  const newPassword = watch("new_password1") || "";
  const confirmPassword = watch("new_password2") || "";

  const passwordsMatch =
    newPassword === confirmPassword && newPassword.length > 0;

  const passwordRequirementTests = {
    length: (pw: string) => pw.length >= 8,
    letter: (pw: string) => /[A-Z]/i.test(pw),
    number: (pw: string) => /[0-9]/.test(pw),
    symbol: (pw: string) => /[^A-Za-z0-9]/.test(pw),
  };

  const passwordRequirementMet = passwordRequirementTests.length(newPassword);
  const letterRequirementMet = passwordRequirementTests.letter(newPassword);
  const numberRequirementMet = passwordRequirementTests.number(newPassword);
  const symbolRequirementMet = passwordRequirementTests.symbol(newPassword);

  const atLeastTwoTypesMet =
    [letterRequirementMet, numberRequirementMet, symbolRequirementMet].filter(
      Boolean,
    ).length >= 2;

  const isFormValid =
    passwordRequirementMet && atLeastTwoTypesMet && passwordsMatch;

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const onSubmit = handleSubmit(async (data) => {
    const payload = {
      ...data,
      uid: uid,
      token: tokenid,
    };

    resetPasswordConfirm.mutate(payload);
  });

  return (
    <FormProvider {...form}>
      <div className={cn("grid gap-6")}>
        <div className="grid gap-2">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Reset Your Password
          </h2>
          <p className="text-center text-sm text-gray-600">
            Enter your new password below
          </p>
        </div>

        <form onSubmit={onSubmit}>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <TextInput
                name="new_password1"
                title="New Password"
                control={control}
                placeholder="Enter your new password"
                type="password"
                showPassword={showPassword}
                toggleShowPassword={toggleShowPassword}
                autoCapitalize="none"
                autoComplete="new-password"
                autoCorrect="off"
                disabled={resetPasswordConfirm.isPending}
                required
              />

              <TextInput
                name="new_password2"
                title="Confirm New Password"
                control={control}
                placeholder="Confirm your new password"
                type="password"
                showPassword={showConfirmPassword}
                toggleShowPassword={toggleShowConfirmPassword}
                autoCapitalize="none"
                autoComplete="new-password"
                autoCorrect="off"
                disabled={resetPasswordConfirm.isPending}
                required
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Password Requirements:
              </h4>
              <ul className="space-y-1">
                <li className="flex items-center text-sm">
                  <CheckCircle2
                    className={`w-4 h-4 ${
                      passwordRequirementMet
                        ? "text-green-500"
                        : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`ml-2 ${
                      passwordRequirementMet
                        ? "text-green-700"
                        : "text-gray-600"
                    }`}
                  >
                    Minimum 8 characters
                  </span>
                </li>

                <li className="flex flex-col">
                  <div className="flex items-center text-sm">
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        atLeastTwoTypesMet ? "text-green-500" : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`ml-2 ${
                        atLeastTwoTypesMet ? "text-green-700" : "text-gray-600"
                      }`}
                    >
                      At least 2 types of the following:
                    </span>
                  </div>
                  <ul className="ml-6 space-y-1 mt-1">
                    <li className="flex items-center text-sm">
                      <CheckCircle2
                        className={`w-3 h-3 ${
                          letterRequirementMet
                            ? "text-green-500"
                            : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`ml-2 ${
                          letterRequirementMet
                            ? "text-green-700"
                            : "text-gray-600"
                        }`}
                      >
                        Letters (A-Z, a-z)
                      </span>
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle2
                        className={`w-3 h-3 ${
                          numberRequirementMet
                            ? "text-green-500"
                            : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`ml-2 ${
                          numberRequirementMet
                            ? "text-green-700"
                            : "text-gray-600"
                        }`}
                      >
                        Numbers (0-9)
                      </span>
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle2
                        className={`w-3 h-3 ${
                          symbolRequirementMet
                            ? "text-green-500"
                            : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`ml-2 ${
                          symbolRequirementMet
                            ? "text-green-700"
                            : "text-gray-600"
                        }`}
                      >
                        Symbols (@#$% etc.)
                      </span>
                    </li>
                  </ul>
                </li>

                <li className="flex items-center text-sm">
                  <CheckCircle2
                    className={`w-4 h-4 ${
                      passwordsMatch ? "text-green-500" : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`ml-2 ${
                      passwordsMatch ? "text-green-700" : "text-gray-600"
                    }`}
                  >
                    Passwords match
                  </span>
                </li>
              </ul>
            </div>

            <Button
              type="submit"
              disabled={resetPasswordConfirm.isPending || !isFormValid}
            >
              {resetPasswordConfirm.isPending && (
                <Spinners.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {resetPasswordConfirm.isPending
                ? "Updating Password..."
                : "Reset Password"}
            </Button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Back to{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500 underline"
            >
              Login
            </Link>
          </p>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            © Codetinker {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </FormProvider>
  );
}

export const Route = createFileRoute(
  "/_auth/reset-password-confirm/$uid/$tokenid",
)({
  component: ResetPasswordConfirm,
});
