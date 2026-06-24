import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { DurianLayout } from '@/components/durian/DurianLayout';
import { FormProvider, useForm } from 'react-hook-form';
import { useSession } from '@ttm/context/contexts/session';
import { toast } from 'sonner';

export const Route = createFileRoute('/durian/login')({
  component: DurianLogin,
});

function DurianLogin() {
  const { signIn } = useSession();
  const navigate = useNavigate();
  
  const form = useForm({
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const handleLogin = async (values: any) => {
    try {
      await signIn({ username: values.username, password: values.password });
      navigate({ to: '/durian' });
    } catch (err) {
      toast.error("Login failed. Check your credentials.");
    }
  };

  return (
    <DurianLayout>
      <div className="flex items-center justify-center p-4 py-20 w-full">
        <Card className="w-full max-w-md shadow-lg border-yellow-200">
          <CardHeader className="bg-yellow-50 border-b border-yellow-100 rounded-t-xl pb-6">
            <CardTitle className="text-3xl text-center text-yellow-900 font-bold">Welcome Back</CardTitle>
            <p className="text-center text-yellow-700/80 mt-2 text-sm">Sign in to your Durian Is Ok account</p>
          </CardHeader>
          <CardContent className="pt-8">
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-6">
                <Input id="username" control={form.control} label="Username / Email" />
                <Input id="password" control={form.control} label="Password" type="password" />
                <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-6 text-lg mt-4 shadow-sm">
                  Sign In
                </Button>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      </div>
    </DurianLayout>
  );
}
