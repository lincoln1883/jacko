import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '../../../components/layouts/AdminLayout';
import { AdminConstructionServicesNewProps } from '../../../types/admin';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';

const New: React.FC<AdminConstructionServicesNewProps> = ({
  service: initialService,
  errors: initialErrors,
}) => {
  const { data, setData, post, processing, errors } = useForm({
    name: initialService.name || '',
    unit: initialService.unit || '',
    price: initialService.price || 0,
    category: initialService.category || '',
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { flash } = usePage().props as any;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(window.route('admin.construction_services.create'), {
      onSuccess: () => {
        // Optionally update local state or show a success message
      },
      onError: (err) => {
        console.error('Error creating service:', err);
      },
    });
  };

  return (
    <AdminLayout title="Add New Construction Service">
      <Head title="Add Service" />
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Add New Construction Service
            </CardTitle>
          </CardHeader>
          <CardContent>
            {flash.notice && (
              <div
                className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
                role="alert"
              >
                <span className="block sm:inline">{flash.notice}</span>
              </div>
            )}
            {initialErrors && Object.keys(initialErrors).length > 0 && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                role="alert"
              >
                <strong className="font-bold">Whoops!</strong>
                <span className="block sm:inline">
                  {' '}
                  There were some problems with your input.
                </span>
                <ul className="mt-3 list-disc list-inside">
                  {Object.values(initialErrors).map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Service Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="mt-1 block w-full"
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  type="text"
                  value={data.unit}
                  onChange={(e) => setData('unit', e.target.value)}
                  className="mt-1 block w-full"
                />
                {errors.unit && (
                  <p className="text-sm text-red-600 mt-1">{errors.unit}</p>
                )}
              </div>

              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={data.price}
                  onChange={(e) => setData('price', parseFloat(e.target.value))}
                  className="mt-1 block w-full"
                />
                {errors.price && (
                  <p className="text-sm text-red-600 mt-1">{errors.price}</p>
                )}
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  type="text"
                  value={data.category}
                  onChange={(e) => setData('category', e.target.value)}
                  className="mt-1 block w-full"
                />
                {errors.category && (
                  <p className="text-sm text-red-600 mt-1">{errors.category}</p>
                )}
              </div>

              <Button type="submit" disabled={processing}>
                {processing ? 'Creating...' : 'Add Service'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default New;
