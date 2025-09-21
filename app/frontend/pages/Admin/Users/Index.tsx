import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../components/layouts/AdminLayout'; // Corrected import
import { AdminUsersIndexProps } from '../../../types/admin';
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

const Index: React.FC<AdminUsersIndexProps> = ({ users, pagination }) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500 hover:bg-red-600';
      case 'supplier':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'client':
        return 'bg-green-500 hover:bg-green-600';
      case 'contractor':
        return 'bg-purple-500 hover:bg-purple-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <AdminLayout title="Manage Users">
      <Head title="Users" />
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Manage Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          className={`${getRoleColor(user.role)} text-white capitalize`}
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.verified ? 'default' : 'destructive'}
                        >
                          {' '}
                          {/* Use default for success */}
                          {user.verified ? 'Yes' : 'No'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(user.created_at!), 'PPP')}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={window.route('admin.users.show', user.id)}
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
                router.get(window.route('admin.users.index', { page }));
              }}
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Index;
