import React from 'react';
import { Link } from '@inertiajs/react';
import { AuthLayout } from '../../../components/layouts/AuthLayout';
import { Button } from '../../../components/ui/button';
import type { PageProps } from '../../../types/auth';

const EmailVerificationShow: React.FC<PageProps> = () => {
  return (
    <AuthLayout
      title="Email Verified"
      description="Your email address has been successfully verified."
    >
      <div className="text-center space-y-6">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <svg
            className="h-6 w-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Email Verification Complete
          </h3>
          <p className="text-gray-600">
            Your email address has been successfully verified. You can now
            access all features of your account.
          </p>
        </div>

        <div className="space-y-3">
          <Link href="/">
            <Button className="w-full">Go to Dashboard</Button>
          </Link>

          <Link
            href="/sessions"
            className="block text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Manage Sessions
          </Link>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="bg-green-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
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
                <h3 className="text-sm font-medium text-green-800">
                  What&apos;s next?
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Your account is now fully activated</li>
                    <li>
                      You can change your password anytime from your dashboard
                    </li>
                    <li>
                      Keep your account secure by monitoring your active
                      sessions
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default EmailVerificationShow;
