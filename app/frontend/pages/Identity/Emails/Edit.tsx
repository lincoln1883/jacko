import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import { AppLayout } from '../../../components/layouts/AppLayout';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import type { PageProps, IdentityFormData } from '../../../types/auth';

interface EmailEditProps extends PageProps {
  user: {
    email: string;
  };
}

const EmailEdit: React.FC<EmailEditProps> = ({ user, errors }) => {
  const { data, setData, patch, processing, reset } = useForm<IdentityFormData>(
    {
      email: user.email,
      password_challenge: '',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    patch('/identity/email', {
      onError: () => reset('password_challenge'),
    });
  };

  return (
    <AppLayout title="Change Email" user={{ id: 1, email: user.email }}>
      <div className="max-w-2xl mx-auto py-12 sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Change Email Address
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Update your email address. You'll need to verify your new email
                address before the change takes effect.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                id="email"
                label="New Email Address"
                type="email"
                value={data.email || ''}
                onChange={(e) => setData('email', e.target.value)}
                errors={errors?.email}
                required
                autoComplete="email"
                autoFocus
              />

              <Input
                id="password_challenge"
                label="Current Password"
                type="password"
                value={data.password_challenge || ''}
                onChange={(e) => setData('password_challenge', e.target.value)}
                errors={errors?.password_challenge}
                required
                autoComplete="current-password"
                hint="Enter your current password to confirm this change."
              />

              <div className="flex items-center justify-between">
                <Link
                  href="/"
                  className="text-sm font-medium text-gray-600 hover:text-gray-500"
                >
                  ← Back to Dashboard
                </Link>

                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => window.history.back()}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" loading={processing}>
                    Update Email
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="bg-yellow-50 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Important
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        After changing your email, you'll receive a verification
                        email at your new address. You'll need to click the
                        verification link to complete the change.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default EmailEdit;
