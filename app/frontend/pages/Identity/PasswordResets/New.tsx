import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import { AuthLayout } from '../../../components/layouts/AuthLayout';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import type { PageProps } from '../../../types/auth';

interface PasswordResetFormData {
  email: string;
}

const PasswordResetNew: React.FC<PageProps> = ({ errors }) => {
  const { data, setData, post, processing } = useForm<PasswordResetFormData>({
    email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/identity/password_reset');
  };

  return (
    <AuthLayout
      title="Reset Password"
      description="Enter your email address and we'll send you a link to reset your password."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          id="email"
          label="Email Address"
          type="email"
          value={data.email}
          onChange={(e) => setData('email', e.target.value)}
          errors={errors?.email}
          required
          autoComplete="email"
          autoFocus
          hint="Enter the email address associated with your account."
        />

        <Button type="submit" className="w-full" loading={processing}>
          Send Reset Instructions
        </Button>

        <div className="text-center space-y-2">
          <Link
            href="/sign_in"
            className="text-sm font-medium text-primary hover:text-primary/80"
          >
            ← Back to Sign In
          </Link>
        </div>
      </form>

      <div className="mt-6 pt-6 border-t border-border">
        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md border border-blue-200 dark:border-blue-800">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-600 dark:text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                What happens next?
              </h3>
              <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                <p>
                  If your email address is registered and verified, you'll
                  receive an email with instructions to reset your password. The
                  link will be valid for 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default PasswordResetNew;
