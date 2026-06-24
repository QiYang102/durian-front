import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { Spinners } from "@/components/Spinner";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { TextInput } from "@/components/ui/TextInput";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { useForgotPassword } from "@ttm/api";

function ResetPassword() {
  // const navigate = useNavigate();

  const schema = z.object({
    email: z
      .string()
      .email("Invalid email format")
      .min(5, { message: "Email must be at least 5 characters" })
      .max(254, { message: "Email must be less than 254 characters" }),
  });

  const form = useForm({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(schema),
  });

  const { handleSubmit } = form;

  const sendResetLink = useForgotPassword({
    onSuccess: () => {
      toast.success("Reset link has been sent successfully");

      // navigate({ to: "/login" });
    },
    onError: (error: any) => {
      toast.error(
        error?.data
          ? typeof error.data === "string"
            ? error.data
            : JSON.stringify(error.data)
          : error?.message || "Failed to send reset link. Please try again.",
      );
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    trackEvent("FORGOT_PASSWORD_ATTEMPTED");
    sendResetLink.mutate(data);
  };

  return (
    <FormProvider {...form}>
      <div className={cn("grid gap-6")}>
        <div className="grid gap-2">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Forgot password?
          </h2>
          <p className="text-center text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your
            password
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <TextInput
                title="Email address"
                name="email"
                placeholder="Enter your email address"
                control={form.control}
                type="email"
                required
                disabled={sendResetLink.isPending}
              />
            </div>

            <Button type="submit" disabled={sendResetLink.isPending}>
              {sendResetLink.isPending && (
                <Spinners.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {sendResetLink.isPending
                ? "Sending reset link..."
                : "Send reset link"}
            </Button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Back to{" "}
            <Link
              to="/login"
              replace={true}
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

export const Route = createFileRoute("/_auth/reset-password")({
  component: ResetPassword,
});
