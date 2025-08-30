import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import { AppLayout } from '../../../components/layouts/AppLayout';
import { Button } from '../../../components/ui/button';
import type { PageProps } from '../../../types/auth';

const EmailVerificationNew: React.FC<PageProps> = () => {
  const { post, processing } = useForm();

  const handleResend = () => {
    post('/identity/email_verification');
  };

  return (
    <AppLayout title="Email Verification">
      <div className="max-w-2xl mx-auto py-12 sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                <svg
                  className="h-6 w-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Verify Your Email
              </h1>

              <p className="text-gray-600 mb-6">
                Please check your email and click the verification link to
                activate your account.
              </p>

              <div className="space-y-4">
                <Button
                  onClick={handleResend}
                  loading={processing}
                  className="w-full"
                >
                  Resend Verification Email
                </Button>

                <Link
                  href="/"
                  className="block text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  ← Back to Dashboard
                </Link>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="bg-blue-50 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-blue-400"
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
                    <h3 className="text-sm font-medium text-blue-800">
                      Didn&apos;t receive the email?
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <ul className="list-disc list-inside space-y-1">
                        <li>Check your spam or junk folder</li>
                        <li>Make sure the email address is correct</li>
                        <li>Wait a few minutes for delivery</li>
                        <li>
                          Click &quot;Resend&quot; to get a new verification
                          email
                        </li>
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

export default EmailVerificationNew;
