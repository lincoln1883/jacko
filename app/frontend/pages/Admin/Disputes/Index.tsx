import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../components/layouts/AdminLayout';
import { AdminDisputesIndexProps } from '../../../types/admin';
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

const Index: React.FC<AdminDisputesIndexProps> = ({
  disputes,
  pagination,
  allStatuses,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'resolved':
        return 'bg-green-500 hover:bg-green-600';
      case 'escalated':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const filterAndPaginate = (status: string | null, page: number) => {
    const queryParams = new URLSearchParams();
    if (status) {
      queryParams.append('status', status);
    }
    if (page > 1) {
      queryParams.append('page', page.toString());
    }
    router.get(`/admin/disputes?${queryParams.toString()}`);
  };

  const handleStatusChange = (newStatus: string) => {
    filterAndPaginate(newStatus === 'all' ? null : newStatus, 1);
  };

  const statusOptions = [
    { label: 'All Statuses', value: 'all' },
    ...allStatuses.map((status) => ({
      label: status.replace(/_/g, ' '),
      value: status,
    })),
  ];

  return (
    <AdminLayout title="Manage Disputes">
      <Head title="Disputes" />
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Manage Disputes
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
                    <TableHead>Job Title</TableHead>
                    <TableHead>Reporter</TableHead>
                    <TableHead>Reported User</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {disputes.map((dispute) => (
                    <TableRow key={dispute.id}>
                      <TableCell>{dispute.id}</TableCell>
                      <TableCell>{dispute.job?.title || 'N/A'}</TableCell>
                      <TableCell>{dispute.reporter?.email || 'N/A'}</TableCell>
                      <TableCell>
                        {dispute.reported_user?.email || 'N/A'}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {dispute.reason}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${getStatusColor(dispute.status as string)} text-white capitalize`}
                        >
                          {(dispute.status as string).replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(dispute.created_at!), 'PPP')}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/admin/disputes/${dispute.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          View / Resolve
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
                filterAndPaginate(null, page);
              }}
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Index;
