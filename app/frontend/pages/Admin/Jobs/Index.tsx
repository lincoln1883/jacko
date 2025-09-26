import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../components/layouts/AdminLayout'; // Corrected import
import { AdminJobsIndexProps } from '../../../types/admin';
import { Pagination } from '../../../components/Pagination';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import { format } from 'date-fns';

const Index: React.FC<AdminJobsIndexProps> = ({ jobs, pagination }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-500 hover:bg-green-600';
      case 'bidding':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'in_progress':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'completed':
        return 'bg-purple-500 hover:bg-purple-600';
      case 'cancelled':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <AdminLayout title="Manage Jobs">
      <Head title="Jobs" />
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Manage Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Parish</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>{job.id}</TableCell>
                      <TableCell>{job.title}</TableCell>
                      <TableCell>{job.client?.email || 'N/A'}</TableCell>
                      <TableCell>{job.parish?.name || 'N/A'}</TableCell>
                      <TableCell>${job.budget.toFixed(2)}</TableCell>
                      <TableCell>
                        {format(new Date(job.due_date), 'PPP')}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${getStatusColor(job.status)} text-white capitalize`}
                        >
                          {job.status.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/admin/jobs/${job.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          View / Edit
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={(page) => {
                router.get(`/admin/jobs?page=${page}`);
              }}
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Index;
