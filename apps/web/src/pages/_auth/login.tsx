import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createFileRoute,
  Link,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { useSession } from "@ttm/context";

import { Spinners } from "@/components/Spinner";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { TextInput } from "@/components/ui/TextInput";
import { setUserId, setUserProperty, trackEvent } from "@/lib/analytics";
import { LoginEvents } from "@ttm/api/types/tracker";

const schema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const loginSearchSchema = z.object({
  redirectURL: z.string().optional(),
});

function Login() {
  const { signIn, isPendingLogin, user } = useSession();
  const [loginAttemptCount, setLoginAttemptCount] = useState(0);
  const navigate = useNavigate();
  const search = useSearch({ from: "/_auth/login" });

  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { handleSubmit } = methods;

  useEffect(() => {
    if (user) {
      setUserId(user.id || "");
      setUserProperty({ user_fullname: user.fullname });

      const redirectURL = search.redirectURL;

      if (redirectURL) {
        try {
          const decodedURL = decodeURIComponent(redirectURL);
          navigate({
            to: decodedURL,
            replace: true,
          });
        } catch (error) {
          console.error("Error decoding redirectURL:", error);
        }
      } else {
        navigate({
          to: "/",
          replace: true,
        });
      }
    }
  }, [user, search.redirectURL, navigate]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoginAttemptCount(loginAttemptCount + 1);
      setUserProperty({ user_fullname: data.username });

      // Wait for signIn to return success or fail
      await signIn(data);
    } catch (err) {
      toast.error("Invalid email or password!");
    }
  });

  const version = import.meta.env.VITE_VERSION;
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <FormProvider {...methods}>
      <div className={cn("grid gap-6")}>
        <div className="grid gap-2">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <form onSubmit={onSubmit} className="">
          <div className="grid gap-6">
            <div className="grid gap-2">
              {/* <Input
                id="email"
                label="Email"
                control={methods.control}
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isPendingLogin}
              /> */}
              <TextInput
                id="username"
                label="Username"
                title="Username"
                control={methods.control}
                placeholder="Enter your username"
                type="text"
                autoCapitalize="none"
                autoComplete="username"
                autoCorrect="off"
                disabled={isPendingLogin}
                name="username"
                showPassword={false}
                toggleShowPassword={undefined}
              />
              <TextInput
                id="password"
                label="Password"
                title="Password"
                control={methods.control}
                placeholder="*****"
                type="password"
                showPassword={showPassword}
                toggleShowPassword={toggleShowPassword}
                autoCapitalize="none"
                autoComplete="password"
                autoCorrect="off"
                name="password"
                disabled={isPendingLogin}
              />

              <div className="flex justify-end -mt-1">
                <Link
                  to="/reset-password"
                  replace={true}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  onClick={() =>
                    trackEvent(LoginEvents.LOGIN_FORGOT_PASSWORD_CLICKED)
                  }
                >
                  Forgot password ?
                </Link>
              </div>
            </div>

            <Button
              disabled={isPendingLogin}
              trackEventName={LoginEvents.LOGIN_BUTTON_CLICKED}
            >
              {isPendingLogin && (
                <Spinners.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isPendingLogin ? "Signing In..." : "Sign In"}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                replace={true}
                className="font-medium text-indigo-600 hover:text-indigo-500 underline"
                onClick={() =>
                  trackEvent(LoginEvents.LOGIN_REGISTER_LINK_CLICKED)
                }
              >
                Create here
              </Link>
            </p>
          </div>
          {/* {version && (
            <div className="py-2 text-center">
              <Text variant="default" color="systemBlack">
                version: {version}
              </Text>
            </div>
          )}               */}

          {version && (
            <div className="text-center mt-8">
              <p className="text-sm text-gray-500">version: {version}</p>
            </div>
          )}
        </form>
      </div>
    </FormProvider>
  );
}

export const Route = createFileRoute("/_auth/login")({
  component: Login,
  validateSearch: loginSearchSchema,
});
