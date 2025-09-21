import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../components/layouts/AdminLayout';
import { AdminVerificationRequestsIndexProps } from '../../../types/admin';
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
import { Select } from '../../../components/ui/select';
import { format } from 'date-fns';

const Index: React.FC<AdminVerificationRequestsIndexProps> = ({
  verificationRequests,
  pagination,
  allStatuses,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'approved':
        return 'bg-green-500 hover:bg-green-600';
      case 'rejected':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const handleStatusChange = (status: string) => {
    router.get(
      window.route('admin.verification_requests.index', {
        status: status === 'all' ? undefined : status,
      }),
      { preserveState: true }
    );
  };

  const statusOptions = [
    { label: 'All Statuses', value: 'all' },
    ...allStatuses.map((status) => ({
      label: status.replace(/_/g, ' '),
      value: status,
    })),
  ];

  return (
    <AdminLayout title="Manage Verification Requests">
      <Head title="Verification Requests" />
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Manage Verification Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Select
                options={statusOptions}
                onChange={(e) => handleStatusChange(e.target.value)}
                placeholder="Filter by Status"
                className="w-[180px]"
              />
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Supplier Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Submitted At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {verificationRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.id}</TableCell>
                      <TableCell>{request.supplier?.email || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge
                          className={`${getStatusColor(request.status as string)} text-white capitalize`}
                        >
                          {(request.status as string).replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {request.notes || '--'}
                      </TableCell>
                      <TableCell>
                        {format(new Date(request.created_at!), 'PPP')}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={window.route(
                            'admin.verification_requests.show',
                            request.id
                          )}
                          className="text-blue-600 hover:underline"
                        >
                          View / Review
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
                router.get(
                  window.route('admin.verification_requests.index', { page }),
                  { preserveState: true }
                );
              }}
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Index;
