import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import { AuthLayout } from '../../components/layouts/AuthLayout';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import type { SignInFormData, AuthPageProps } from '../../types/auth';

const SignIn: React.FC<AuthPageProps> = ({ errors, email_hint }) => {
  const { data, setData, post, processing, reset } = useForm<SignInFormData>({
    email: email_hint || '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/sign_in', {
      onError: () => reset('password'),
    });
  };

  return (
    <AuthLayout
      title="Sign In"
      description="Welcome back! Please sign in to your account."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          id="email"
          label="Email address"
          type="email"
          value={data.email}
          onChange={(e) => setData('email', e.target.value)}
          errors={errors?.email}
          required
          autoComplete="email"
        />

        <Input
          id="password"
          label="Password"
          type="password"
          value={data.password}
          onChange={(e) => setData('password', e.target.value)}
          errors={errors?.password}
          required
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <Link
              href="/identity/password_reset/new"
              className="font-medium text-blue-600 hover:text-blue-800"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <Button type="submit" className="w-full" loading={processing}>
          Sign In
        </Button>

        <div className="text-center">
          <span className="text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link
              href="/sign_up"
              className="font-medium text-blue-600 hover:text-blue-800"
            >
              Sign up
            </Link>
          </span>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignIn;
