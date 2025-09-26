import React from 'react';
import { AppLayout } from '../../components/layouts/AppLayout';
import { usePage, Link } from '@inertiajs/react';
import type { PageProps } from '../../types/auth';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';

interface Job {
  id: number;
  title: string;
  description: string;
  budget: number;
  due_date: string;
  location: string;
  client: { id: number; email: string };
  parish: { id: number; name: string };
}

interface SupplierDashboardPageProps extends PageProps {
  openJobs: Job[];
}

const DashboardPage: React.FC = () => {
  const { openJobs } = usePage<SupplierDashboardPageProps>().props;

  return (
    <AppLayout title="Supplier Dashboard">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Supplier Dashboard
        </h1>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Open Jobs for Bidding
            </CardTitle>
          </CardHeader>
          <CardContent>
            {openJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {openJobs.map((job) => (
                  <Card
                    key={job.id}
                    className="p-4 flex flex-col justify-between h-full"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Client: {job.client.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        Location: {job.location}, {job.parish.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Budget: ${job.budget}
                      </p>
                      <p className="text-sm text-gray-600">
                        Due Date: {new Date(job.due_date).toLocaleDateString()}
                      </p>
                      <p className="mt-2 text-gray-700 text-sm line-clamp-3">
                        {job.description}
                      </p>
                    </div>
                    <Link href={`/jobs/${job.id}`} className="mt-4 block">
                      <Button className="w-full">View Details</Button>
                    </Link>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">
                No open jobs available for bidding at the moment.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
