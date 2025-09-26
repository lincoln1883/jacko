import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '../../../components/layouts/AdminLayout';
import { AdminUserShowProps } from '../../../types/admin';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select } from '../../../components/ui/select';
import { Badge } from '../../../components/ui/badge';
import { format } from 'date-fns';
import { User } from '../../../types/auth';
import { Link } from '@inertiajs/react';

const Show: React.FC<AdminUserShowProps> = ({
  user: initialUser,
  errors: initialErrors,
}) => {
  const { data, setData, put, processing, errors } = useForm({
    id: initialUser.id,
    email: initialUser.email,
    role: initialUser.role,
    verified: initialUser.verified || false,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { flash } = usePage().props as any;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/admin/users/${data.id}`, {
      onSuccess: () => {
        // Optionally update local state or show a success message
      },
      onError: (err) => {
        console.error('Error updating user:', err);
      },
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'client':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'supplier':
        return 'bg-green-500 hover:bg-green-600';
      case 'contractor':
        return 'bg-purple-500 hover:bg-purple-600';
      case 'admin':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const roleOptions = [
    { label: 'Client', value: 'client' },
    { label: 'Supplier', value: 'supplier' },
    { label: 'Contractor', value: 'contractor' },
    { label: 'Admin', value: 'admin' },
  ];

  return (
    <AdminLayout title={`Manage User: ${initialUser.email}`}>
      <Head title={initialUser.email} />
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Manage User: {initialUser.email}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {flash && (
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

            <form onSubmit={handleSubmit} className="space-y-6 mb-8">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  disabled
                  className="mt-1 block w-full"
                />
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  options={roleOptions}
                  onChange={(e) =>
                    setData('role', e.target.value as User['role'])
                  } // Explicitly cast to User['role']
                  value={data.role}
                  placeholder="Select a role"
                  className="w-full"
                />
                {errors.role && (
                  <p className="text-sm text-red-600 mt-1">{errors.role}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="verified"
                  checked={data.verified}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setData('verified', e.target.checked)
                  }
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <Label htmlFor="verified">Verified Account</Label>
              </div>

              <Button type="submit" disabled={processing}>
                {processing ? 'Updating...' : 'Update User'}
              </Button>
            </form>

            <div className="mt-8 space-y-4">
              <h3 className="text-2xl font-semibold text-gray-800">
                User Details
              </h3>
              <p>
                <strong>ID:</strong> {initialUser.id}
              </p>
              <p>
                <strong>Created At:</strong>{' '}
                {format(new Date(initialUser.created_at!), 'PPP')}
              </p>
              <p>
                <strong>Updated At:</strong>{' '}
                {format(new Date(initialUser.updated_at!), 'PPP')}
              </p>
              <div>
                <strong>Role:</strong>{' '}
                <Badge
                  className={`${getRoleColor(initialUser.role)} text-white capitalize`}
                >
                  {initialUser.role}
                </Badge>
              </div>
              <div>
                <strong>Verified:</strong>{' '}
                <Badge
                  variant={initialUser.verified ? 'default' : 'destructive'}
                >
                  {initialUser.verified ? 'Yes' : 'No'}
                </Badge>
              </div>

              {initialUser.supplier_profile &&
                (initialUser.supplier_profile.company_name ||
                  initialUser.supplier_profile.bio ||
                  initialUser.supplier_profile.contact_email ||
                  initialUser.supplier_profile.contact_phone ||
                  initialUser.supplier_profile.location ||
                  initialUser.supplier_profile.website ||
                  initialUser.supplier_profile.avatar_url ||
                  initialUser.supplier_profile.cover_image_url) && (
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle className="text-xl">
                        Supplier Profile
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {initialUser.supplier_profile.company_name && (
                        <p>
                          <strong>Company Name:</strong>{' '}
                          {initialUser.supplier_profile.company_name}
                        </p>
                      )}
                      {initialUser.supplier_profile.bio && (
                        <p>
                          <strong>Bio:</strong>{' '}
                          {initialUser.supplier_profile.bio}
                        </p>
                      )}
                      {initialUser.supplier_profile.contact_email && (
                        <p>
                          <strong>Contact Email:</strong>{' '}
                          {initialUser.supplier_profile.contact_email}
                        </p>
                      )}
                      {initialUser.supplier_profile.contact_phone && (
                        <p>
                          <strong>Contact Phone:</strong>{' '}
                          {initialUser.supplier_profile.contact_phone}
                        </p>
                      )}
                      {initialUser.supplier_profile.location && (
                        <p>
                          <strong>Location:</strong>{' '}
                          {initialUser.supplier_profile.location}
                        </p>
                      )}
                      {initialUser.supplier_profile.website && (
                        <p>
                          <strong>Website:</strong>{' '}
                          <a
                            href={initialUser.supplier_profile.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {initialUser.supplier_profile.website}
                          </a>
                        </p>
                      )}
                      {initialUser.supplier_profile.avatar_url && (
                        <p>
                          <strong>Avatar:</strong>{' '}
                          <img
                            src={initialUser.supplier_profile.avatar_url}
                            alt="Avatar"
                            className="w-16 h-16 rounded-full object-cover inline-block ml-2"
                          />
                        </p>
                      )}
                      {initialUser.supplier_profile.cover_image_url && (
                        <p>
                          <strong>Cover Image:</strong>{' '}
                          <img
                            src={initialUser.supplier_profile.cover_image_url}
                            alt="Cover"
                            className="w-32 h-16 object-cover inline-block ml-2"
                          />
                        </p>
                      )}
                      {initialUser.supplier_profile.average_rating !==
                        undefined && (
                        <p>
                          <strong>Average Rating:</strong>{' '}
                          {initialUser.supplier_profile.average_rating.toFixed(
                            1
                          )}{' '}
                          ({initialUser.supplier_profile.review_count} reviews)
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}

              {initialUser.client_profile &&
                (initialUser.client_profile.company_name ||
                  initialUser.client_profile.contact_email ||
                  initialUser.client_profile.contact_phone ||
                  initialUser.client_profile.location) && (
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle className="text-xl">Client Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {initialUser.client_profile.company_name && (
                        <p>
                          <strong>Company Name:</strong>{' '}
                          {initialUser.client_profile.company_name}
                        </p>
                      )}
                      {initialUser.client_profile.contact_email && (
                        <p>
                          <strong>Contact Email:</strong>{' '}
                          {initialUser.client_profile.contact_email}
                        </p>
                      )}
                      {initialUser.client_profile.contact_phone && (
                        <p>
                          <strong>Contact Phone:</strong>{' '}
                          {initialUser.client_profile.contact_phone}
                        </p>
                      )}
                      {initialUser.client_profile.location && (
                        <p>
                          <strong>Location:</strong>{' '}
                          {initialUser.client_profile.location}
                        </p>
                      )}
                      {initialUser.client_profile.average_rating !==
                        undefined && (
                        <p>
                          <strong>Average Rating:</strong>{' '}
                          {initialUser.client_profile.average_rating.toFixed(1)}{' '}
                          ({initialUser.client_profile.review_count} reviews)
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}

              {initialUser.verification_requests &&
                initialUser.verification_requests.length > 0 && (
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle className="text-xl">
                        Verification Requests
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {initialUser.verification_requests.map((request) => (
                        <div key={request.id} className="border p-3 rounded-md">
                          <p>
                            <strong>Request ID:</strong> {request.id}
                          </p>
                          <p>
                            <strong>Status:</strong>{' '}
                            <Badge
                              variant={
                                request.status === 'approved'
                                  ? 'default'
                                  : request.status === 'rejected'
                                    ? 'destructive'
                                    : 'default'
                              }
                              className="capitalize"
                            >
                              {request.status}
                            </Badge>
                          </p>
                          <p>
                            <strong>Submitted:</strong>{' '}
                            {format(new Date(request.created_at!), 'PPP')}
                          </p>
                          {request.notes && (
                            <p>
                              <strong>Notes:</strong> {request.notes}
                            </p>
                          )}
                          <Link
                            href={`/admin/verification_requests/${request.id}`}
                            className="text-blue-600 hover:underline mt-2 inline-block"
                          >
                            View Request
                          </Link>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Show;
