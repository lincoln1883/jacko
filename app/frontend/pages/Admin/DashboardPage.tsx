import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../../components/layouts/AdminLayout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import {
  UsersIcon,
  UserCheckIcon,
  BriefcaseIcon,
  GavelIcon,
} from 'lucide-react';
import { AdminDashboardIndexProps } from '../../types/admin';

const Index: React.FC<AdminDashboardIndexProps> = ({
  userCount,
  supplierCount,
  clientCount,
  pendingVerificationRequestsCount,
  openJobsCount,
  pendingDisputesCount,
}) => {
  return (
    <AdminLayout title="Admin Dashboard">
      <Head title="Dashboard" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Users
              </CardTitle>
              <UsersIcon className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {userCount}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Suppliers
              </CardTitle>
              <UserCheckIcon className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {supplierCount}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Clients
              </CardTitle>
              <UsersIcon className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {clientCount}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pending Verifications
              </CardTitle>
              <UserCheckIcon className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-700">
                {pendingVerificationRequestsCount}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                <Link
                  href={'/admin/verification_requests'}
                  className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
                >
                  View all
                </Link>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Open Jobs
              </CardTitle>
              <BriefcaseIcon className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700">
                {openJobsCount}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                <Link
                  href={'/admin/jobs'}
                  className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
                >
                  View all
                </Link>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pending Disputes
              </CardTitle>
              <GavelIcon className="h-5 w-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-700">
                {pendingDisputesCount}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                <Link
                  href={'/admin/disputes'}
                  className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
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
