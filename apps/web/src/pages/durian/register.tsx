import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { DurianLayout } from '@/components/durian/DurianLayout';
import { FormProvider, useForm } from 'react-hook-form';
import { useSession } from '@ttm/context/contexts/session';
import { useAuthRegister } from '@ttm/api';
import { toast } from 'sonner';
import { useGlobalLoading } from '@/components/GlobalLoadingContext';

export const Route = createFileRoute('/durian/register')({
  component: DurianRegister,
});

function DurianRegister() {
  const register = useAuthRegister();
  const { signIn } = useSession();
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useGlobalLoading();

  const form = useForm({
    defaultValues: {
      email: '',
      fullname: '',
      mobile: '',
      password: '',
      confirmPassword: ''
    }
  });

  const handleRegister = async (values: any) => {
    if (values.password !== values.confirmPassword) {
      form.setError('confirmPassword', { type: 'manual', message: 'Passwords do not match.' });
      return;
    }

    try {
      showLoading("Signing up...");
      await register.mutateAsync({
        username: values.email,
        email: values.email,
        password1: values.password,
        password2: values.confirmPassword,
        mobile_number: values.mobile,
        fullname: values.fullname,
      });

      // Auto login after registration
      await signIn({ username: values.email, password: values.password });
      toast.success("Account registered and signed in!");
      navigate({ to: '/durian' });
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Registration failed. Try a different email.");
    } finally {
      hideLoading();
    }
  };

  return (
    <DurianLayout>
      <div className="flex items-center justify-center p-4 py-10 w-full">
        <Card className="w-full max-w-md shadow-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 pb-6">
            <CardTitle className="text-3xl text-center text-slate-900 dark:text-white font-extrabold tracking-tight">Create Account</CardTitle>
            <p className="text-center text-slate-500 dark:text-slate-400 mt-2 text-sm">Join <span className="font-semibold text-slate-700 dark:text-slate-300">DuriNow</span> to start ordering premium durians</p>
          </CardHeader>
          <CardContent className="pt-8">
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-4">
                <Input
                  id="email"
                  control={form.control}
                  label="Email Address"
                  type="email"
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Please enter a valid email address"
                    }
                  }}
                />
                
                <Input
                  id="fullname"
                  control={form.control}
                  label="Full Name"
                  rules={{ required: "Full name is required" }}
                />

                <Input
                  id="mobile"
                  control={form.control}
                  label="Mobile Phone Number"
                  placeholder="e.g. 60123456789"
                  rules={{ required: "Mobile phone number is required" }}
                />

                <Input
                  id="password"
                  control={form.control}
                  label="Password"
                  type="password"
                  rules={{
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters"
                    }
                  }}
                />

                <Input
                  id="confirmPassword"
                  control={form.control}
                  label="Confirm Password"
                  type="password"
                  rules={{ required: "Please confirm your password" }}
                />

                <Button type="submit" className="w-full bg-slate-900 text-white hover:bg-yellow-500 hover:text-slate-950 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-yellow-500 dark:hover:text-slate-950 font-bold py-6 text-lg mt-6 shadow-md transition-all">
                  Sign Up
                </Button>

                <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
                  Already have an account?{' '}
                  <Link to="/durian/login" className="font-bold text-yellow-600 hover:text-yellow-500 dark:text-yellow-400 dark:hover:text-yellow-300 transition-colors">
                    Sign In
                  </Link>
                </p>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      </div>
    </DurianLayout>
  );
}
