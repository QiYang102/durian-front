import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { Spinners } from "@/components/Spinner";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { TextInput } from "@/components/ui/TextInput";
import { trackEvent } from "@/lib/analytics";
import { useRegisterUser } from "@ttm/api";
import { RegistrationEvents } from "@ttm/api/types/tracker";
import { PhoneNumberInput } from "@/components/ui/PhoneNumberInput";
import { cn } from "@/lib/utils";

function Register() {
  const navigate = useNavigate();

  const schema = z
    .object({
      fullname: z
        .string()
        .min(1, { message: "Full name is required" })
        .max(100, { message: "Full name must be less than 100 characters" }),
      email: z
        .string()
        .email("Invalid email format")
        .min(5, { message: "Email must be at least 5 characters" })
        .max(254, { message: "Email must be less than 254 characters" }),
      mobile: z
        .string()
        .optional()
        .refine((val) => !val || /^\+?[\d\s-()]{8,20}$/.test(val), {
          message: "Invalid mobile number format",
        })
        .or(z.literal("")),
      password1: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" }),
      password2: z
        .string()
        .min(8, { message: "Confirm password must be at least 8 characters" }),
    })
    .refine((data) => data.password1 === data.password2, {
      message: "Passwords don't match",
      path: ["password2"],
    });

  const form = useForm({
    defaultValues: {
      fullname: "",
      email: "",
      mobile: "",
      password1: "",
      password2: "",
    },
    resolver: zodResolver(schema),
  });

  const { handleSubmit } = form;

  const { mutateAsync: registerUserDetail, isPending: isRegistering } =
    useRegisterUser();

  const onSubmit = async (data: z.infer<typeof schema>) => {
    trackEvent(RegistrationEvents.REGISTRATION_ATTEMPTED);

    try {
      const result = await registerUserDetail(data);

      if (result) {
        toast.success(
          "Your account has been created successfully. Please login.",
        );

        navigate({
          to: "/login",
          replace: true,
        });
      }
    } catch (error: any) {
      toast.error(
        error?.data
          ? typeof error.data === "string"
            ? error.data
            : JSON.stringify(error.data)
          : error?.message || "Failed to register. Please try again.",
      );
    }
  };

  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const toggleShowPassword1 = () => {
    setShowPassword1((prev) => !prev);
  };

  const toggleShowPassword2 = () => {
    setShowPassword2((prev) => !prev);
  };

  return (
    <FormProvider {...form}>
      <div className={cn("grid gap-6")}>
        {/* Header Section */}
        <div className="grid gap-2">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              replace={true}
              className="font-medium text-indigo-600 hover:text-indigo-500 underline"
              onClick={() =>
                trackEvent(RegistrationEvents.REGISTRATION_LOGIN_LINK_CLICKED)
              }
            >
              Sign in here
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <TextInput
                title="Full Name"
                name="fullname"
                placeholder="Enter your full name"
                control={form.control}
                required
                disabled={isRegistering}
              />

              <TextInput
                title="Email"
                name="email"
                placeholder="Enter your email"
                control={form.control}
                type="email"
                required
                disabled={isRegistering}
              />

              <PhoneNumberInput
                formLabel="Mobile Phone"
                control={form.control}
                name="mobile"
                required
              />

              <TextInput
                title="Password"
                name="password1"
                placeholder="Enter your password"
                control={form.control}
                type="password"
                showPassword={showPassword1}
                toggleShowPassword={toggleShowPassword1}
                required
                disabled={isRegistering}
              />

              <TextInput
                title="Confirm Password"
                name="password2"
                placeholder="Confirm your password"
                control={form.control}
                type="password"
                showPassword={showPassword2}
                toggleShowPassword={toggleShowPassword2}
                required
                disabled={isRegistering}
              />
            </div>

            <Button type="submit" disabled={isRegistering}>
              {isRegistering && (
                <Spinners.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isRegistering ? "Creating Account..." : "Create Account"}
            </Button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}

export const Route = createFileRoute("/_auth/register")({
  component: Register,
});
