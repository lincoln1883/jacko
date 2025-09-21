import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../components/layouts/AdminLayout';
import { AdminConstructionServicesIndexProps } from '../../../types/admin';
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
import { Button } from '../../../components/ui/button';

const Index: React.FC<AdminConstructionServicesIndexProps> = ({
  services,
  pagination,
}) => {
  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      router.delete(window.route('admin.construction_services.destroy', id));
    }
  };

  return (
    <AdminLayout title="Manage Construction Services">
      <Head title="Construction Services" />
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-3xl font-bold text-gray-900">
              Manage Construction Services
            </CardTitle>
            <Link href={window.route('admin.construction_services.new')}>
              <Button>Add New Service</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>{service.id}</TableCell>
                      <TableCell>{service.name}</TableCell>
                      <TableCell>{service.unit}</TableCell>
                      <TableCell>${service.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{service.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={window.route(
                            'admin.construction_services.edit',
                            service.id
                          )}
                          className="text-blue-600 hover:underline mr-4"
                        >
                          Edit
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(service.id!)}
                        >
                          Delete
                        </Button>
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
                  window.route('admin.construction_services.index', { page })
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
