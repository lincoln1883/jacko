import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import { AuthLayout } from '../../../components/layouts/AuthLayout';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import type { PageProps, IdentityFormData } from '../../../types/auth';

const PasswordResetEdit: React.FC<PageProps> = ({ errors }) => {
  const { data, setData, patch, processing, reset } = useForm<IdentityFormData>(
    {
      password: '',
      password_confirmation: '',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Get the current URL to extract the token (sid)
    const url = new window.URL(window.location.href);
    const sid = url.searchParams.get('sid');

    patch(`/identity/password_reset/edit?sid=${sid}`, {
      onError: () => {
        reset('password', 'password_confirmation');
      },
    });
  };

  return (
    <AuthLayout
      title="Set New Password"
      description="Choose a new password for your account."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          id="password"
          label="New Password"
          type="password"
          value={data.password || ''}
          onChange={(e) => setData('password', e.target.value)}
          errors={errors?.password}
          required
          autoComplete="new-password"
          hint="Choose a strong password with at least 8 characters."
        />

        <Input
          id="password_confirmation"
          label="Confirm New Password"
          type="password"
          value={data.password_confirmation || ''}
          onChange={(e) => setData('password_confirmation', e.target.value)}
          errors={errors?.password_confirmation}
          required
          autoComplete="new-password"
          hint="Enter the same password again to confirm."
        />

        <Button type="submit" className="w-full" loading={processing}>
          Update Password
        </Button>

        <div className="text-center">
          <Link
            href="/sign_in"
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            ← Back to Sign In
          </Link>
        </div>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-800">
                Almost there!
              </h3>
              <div className="mt-2 text-sm text-gray-700">
                <p>
                  After you set your new password, you&apos;ll be redirected to
                  the sign in page where you can log in with your updated
                  credentials.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-gray-600"
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
              <h3 className="text-sm font-medium text-gray-800">
                Password Security Tips
              </h3>
              <div className="mt-2 text-sm text-gray-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    Use a unique password that you don&apos;t use elsewhere
                  </li>
                  <li>
                    Include uppercase letters, lowercase letters, numbers, and
                    symbols
                  </li>
                  <li>Make it at least 8 characters long</li>
                  <li>Avoid using personal information</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default PasswordResetEdit;
