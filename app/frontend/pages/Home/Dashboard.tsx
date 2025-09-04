import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { AppLayout } from '../../components/layouts/AppLayout';
import { Search, Users } from 'lucide-react';
import type { PageProps } from '../../types/auth';

const Dashboard: React.FC = () => {
  const { auth } = usePage<PageProps>().props;
  const user = auth?.user;

  if (!user) {
    return null; // This shouldn't happen since AppLayout also checks for user
  }

  return (
    <AppLayout title="Dashboard">
      <div className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
        <div className="bg-card overflow-hidden shadow-lg border sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Dashboard
            </h2>

            {/* Quick Search Section */}
            <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2 flex items-center">
                    <Search className="w-5 h-5 mr-2" />
                    Find Skilled Tradespeople
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Search and connect with verified professionals for your
                    projects.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/search"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Start Searching
                </Link>
                <Link
                  href="/search/tradespeople"
                  className="inline-flex items-center px-4 py-2 border border-blue-300 text-blue-700 font-medium rounded-md hover:bg-blue-50 transition-colors dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Browse All
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-primary/10 p-6 rounded-lg border">
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Welcome!
                </h3>
                <p className="text-muted-foreground">
                  You&apos;re successfully signed in to your Jacko account.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Member since: {user.created_at}
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-950 p-6 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Account Security
                </h3>
                <p className="text-muted-foreground mb-3">
                  Manage your active sessions and security settings.
                </p>
                <Link
                  href="/sessions"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:text-green-300 dark:bg-green-900 dark:hover:bg-green-800"
                >
                  View Sessions
                </Link>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-950 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Account Settings
                </h3>
                <p className="text-muted-foreground mb-3">
                  Update your profile and password.
                </p>
                <Link
                  href="/password/edit"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 dark:text-yellow-300 dark:bg-yellow-900 dark:hover:bg-yellow-800"
                >
                  Change Password
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
