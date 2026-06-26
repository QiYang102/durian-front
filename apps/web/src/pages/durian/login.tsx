import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { DurianLayout } from '@/components/durian/DurianLayout';
import { FormProvider, useForm } from 'react-hook-form';
import { useSession } from '@ttm/context/contexts/session';
import { toast } from 'sonner';
import { useGlobalLoading } from '@/components/GlobalLoadingContext';

export const Route = createFileRoute('/durian/login')({
  component: DurianLogin,
});

function DurianLogin() {
  const { signIn } = useSession();
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useGlobalLoading();
  
  const form = useForm({
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const handleLogin = async (values: any) => {
    try {
      showLoading("Signing in...");
      await signIn({ username: values.username, password: values.password });
      navigate({ to: '/durian' });
    } catch (err) {
      toast.error("Login failed. Check your credentials.");
    } finally {
      hideLoading();
    }
  };

  return (
    <DurianLayout>
      <div className="flex items-center justify-center p-4 py-20 w-full">
        <Card className="w-full max-w-md shadow-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 pb-6">
            <CardTitle className="text-3xl text-center text-slate-900 dark:text-white font-extrabold tracking-tight">Welcome Back</CardTitle>
            <p className="text-center text-slate-500 dark:text-slate-400 mt-2 text-sm">Sign in to your <span className="font-semibold text-slate-700 dark:text-slate-300">DuriNow</span> account</p>
          </CardHeader>
          <CardContent className="pt-8">
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-6">
                <Input id="username" control={form.control} label="Username / Email" />
                <Input id="password" control={form.control} label="Password" type="password" />
                <Button type="submit" className="w-full bg-slate-900 text-white hover:bg-yellow-500 hover:text-slate-950 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-yellow-500 dark:hover:text-slate-950 font-bold py-6 text-lg mt-4 shadow-md transition-all">
                  Sign In
                </Button>

                <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
                  Don't have an account?{' '}
                  <Link to="/durian/register" className="font-bold text-yellow-600 hover:text-yellow-500 dark:text-yellow-400 dark:hover:text-yellow-300 transition-colors">
                    Sign Up
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
