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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../components/ui/avatar'; // Assuming Avatar component exists
import { Star } from 'lucide-react'; // For rating display
import { format } from 'date-fns';

interface SupplierProfile {
  id: number;
  bio: string;
  years_of_experience: number;
}

interface Tradesperson {
  id: number;
  email: string;
  supplier_profile: SupplierProfile;
  avatar_url: string | null;
  average_rating: number;
  review_count: number;
}

interface Job {
  id: number;
  title: string;
  status: string;
  created_at: string;
}

interface ClientDashboardPageProps extends PageProps {
  tradespeople: Tradesperson[];
  clientJobs: Job[];
}

const DashboardPage: React.FC = () => {
  const { tradespeople, clientJobs } =
    usePage<ClientDashboardPageProps>().props;

  return (
    <AppLayout title="Client Dashboard">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Client Dashboard
        </h1>

        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Available Suppliers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tradespeople.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tradespeople.map((tradesperson) => (
                  <Card
                    key={tradesperson.id}
                    className="p-4 flex flex-col justify-between h-full"
                  >
                    <div>
                      <div className="flex items-center space-x-4 mb-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={
                              tradesperson.avatar_url ||
                              'https://via.placeholder.com/150'
                            }
                            alt={`${tradesperson.email}'s avatar`}
                          />
                          <AvatarFallback>
                            {tradesperson.email[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {tradesperson.email}
                          </h3>
                          {tradesperson.average_rating > 0 && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                              <span>
                                {tradesperson.average_rating.toFixed(1)} (
                                {tradesperson.review_count})
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mt-1">
                        Years of Experience:{' '}
                        {tradesperson.supplier_profile?.years_of_experience}
                      </p>
                      <p className="mt-2 text-gray-700 text-sm line-clamp-3">
                        {tradesperson.supplier_profile?.bio ||
                          'No bio available.'}
                      </p>
                    </div>
                    <Link
                      href={`/suppliers/${tradesperson.id}`}
                      className="mt-4 block"
                    >
                      <Button className="w-full">View Profile</Button>
                    </Link>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">
                No tradespeople available at the moment.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">
              My Created Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {clientJobs.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {clientJobs.map((job) => (
                  <Card key={job.id} className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Status: {job.status}
                    </p>
                    <p className="text-sm text-gray-600">
                      Created: {format(new Date(job.created_at), 'PPP')}
                    </p>
                    <Link
                      href={`/jobs/${job.id}`}
                      className="mt-2 inline-block"
                    >
                      <Button variant="link" className="p-0 h-auto">
                        View Job Details
                      </Button>
                    </Link>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">
                You haven&apos;t created any jobs yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
