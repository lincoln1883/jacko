import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import { AppLayout } from '../../components/layouts/AppLayout';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import type { PageProps, IdentityFormData } from '../../types/auth';

const PasswordEdit: React.FC<PageProps> = ({ errors }) => {
  const { data, setData, patch, processing, reset } = useForm<IdentityFormData>({
    password: '',
    password_confirmation: '',
    password_challenge: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    patch('/password', {
      onSuccess: () => {
        reset();
      },
      onError: () => {
        reset('password', 'password_confirmation', 'password_challenge');
      },
    });
  };

  return (
    <AppLayout title="Change Password" user={{ id: 1, email: 'user@example.com' }}>
      <div className="max-w-2xl mx-auto py-12 sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Change Password
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Update your password to keep your account secure.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                id="password_challenge"
                label="Current Password"
                type="password"
                value={data.password_challenge || ''}
                onChange={(e) => setData('password_challenge', e.target.value)}
                errors={errors?.password_challenge}
                required
                autoComplete="current-password"
                autoFocus
                hint="Enter your current password to confirm this change."
              />

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
                  <Button
                    type="submit"
                    loading={processing}
                  >
                    Update Password
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="bg-blue-50 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Password Security Tips
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <ul className="list-disc list-inside space-y-1">
                        <li>Use a unique password that you don't use elsewhere</li>
                        <li>Include uppercase letters, lowercase letters, numbers, and symbols</li>
                        <li>Make it at least 8 characters long</li>
                        <li>Consider using a password manager</li>
                      </ul>
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

export default PasswordEdit;
