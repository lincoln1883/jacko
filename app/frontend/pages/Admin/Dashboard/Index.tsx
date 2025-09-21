import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../../../components/layouts/AdminLayout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import {
  UsersIcon,
  UserCheckIcon,
  BriefcaseIcon,
  GavelIcon,
} from 'lucide-react';
import { AdminDashboardIndexProps } from '../../../types/admin';

const Index: React.FC<AdminDashboardIndexProps> = ({
  userCount,
  supplierCount,
  clientCount,
  pendingVerificationRequestsCount,
  openJobsCount,
  pendingDisputesCount,
}) => {
  // const { auth: { user } } = usePage().props as any; // Removed unused user variable

  return (
    <AdminLayout title="Admin Dashboard">
      <Head title="Dashboard" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suppliers</CardTitle>
              <UserCheckIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{supplierCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clients</CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clientCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Verifications
              </CardTitle>
              <UserCheckIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pendingVerificationRequestsCount}
              </div>
              <p className="text-xs text-muted-foreground">
                <Link
                  href={window.route('admin.verification_requests.index')}
                  className="text-blue-600 hover:underline"
                >
                  View all
                </Link>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Jobs</CardTitle>
              <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{openJobsCount}</div>
              <p className="text-xs text-muted-foreground">
                <Link
                  href={window.route('admin.jobs.index')}
                  className="text-blue-600 hover:underline"
                >
                  View all
                </Link>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Disputes
              </CardTitle>
              <GavelIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingDisputesCount}</div>
              <p className="text-xs text-muted-foreground">
                <Link
                  href={window.route('admin.disputes.index')}
                  className="text-blue-600 hover:underline"
                >
                  View all
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Index;
