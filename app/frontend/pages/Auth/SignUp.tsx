import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import { AuthLayout } from '../../components/layouts/AuthLayout';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import type { SignUpFormData, AuthPageProps } from '../../types/auth';

const SignUp: React.FC<AuthPageProps> = ({ errors }) => {
  const { data, setData, post, processing, reset } = useForm<SignUpFormData>({
    email: '',
    password: '',
    password_confirmation: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/sign_up', {
      onError: () => {
        reset('password', 'password_confirmation');
      },
    });
  };

  return (
    <AuthLayout
      title="Sign Up"
      description="Create your account to get started."
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
          hint="We'll send you a verification email after you sign up."
        />

        <Input
          id="password"
          label="Password"
          type="password"
          value={data.password}
          onChange={(e) => setData('password', e.target.value)}
          errors={errors?.password}
          required
          autoComplete="new-password"
          hint="Choose a strong password with at least 12 characters."
        />

        <Input
          id="password_confirmation"
          label="Confirm Password"
          type="password"
          value={data.password_confirmation}
          onChange={(e) => setData('password_confirmation', e.target.value)}
          errors={errors?.password_confirmation}
          required
          autoComplete="new-password"
          hint="Enter the same password again to confirm."
        />

        <Button type="submit" className="w-full" loading={processing}>
          Create Account
        </Button>

        <div className="text-center">
          <span className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              href="/sign_in"
              className="font-medium text-blue-600 hover:text-blue-800"
            >
              Sign in
            </Link>
          </span>
        </div>

        <div className="text-xs text-gray-500 text-center">
          By creating an account, you agree to our Terms of Service and Privacy
          Policy.
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignUp;
