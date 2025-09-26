import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '../../../components/layouts/AdminLayout';
import { AdminVerificationRequestShowProps } from '../../../types/admin';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { Select } from '../../../components/ui/select';
import { Badge } from '../../../components/ui/badge';
import { format } from 'date-fns';

const Show: React.FC<AdminVerificationRequestShowProps> = ({
  verificationRequest: initialRequest,
  errors: initialErrors,
}) => {
  const { data, setData, put, processing } = useForm({
    id: initialRequest.id,
    status: initialRequest.status,
    notes: initialRequest.notes || '',
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { flash } = usePage().props as any;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/admin/verification_requests/${data.id}`, {
      onSuccess: () => {
        // Optionally update local state or show a success message
      },
      onError: (err) => {
        console.error('Error updating verification request:', err);
      },
    });
  };

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

  const statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
  ];

  return (
    <AdminLayout title={`Review Verification Request: ${initialRequest.id}`}>
      <Head title={`Request ${initialRequest.id}`} />
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Review Verification Request: {initialRequest.id}
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
            {flash.alert && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                role="alert"
              >
                <strong className="font-bold">Whoops!</strong>{' '}
                <span className="block sm:inline">{flash.alert}</span>
              </div>
            )}
            {initialErrors && Object.keys(initialErrors).length > 0 && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                role="alert"
              >
                <strong className="font-bold">Whoops!</strong>{' '}
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
                <Label htmlFor="status">Request Status</Label>
                <Select
                  options={statusOptions}
                  onChange={(e) =>
                    setData(
                      'status',
                      e.target.value as typeof initialRequest.status
                    )
                  }
                  value={data.status}
                  placeholder="Select Status"
                  className="w-[200px]"
                />
                {initialErrors?.status && (
                  <p className="text-sm text-red-600 mt-1">
                    {initialErrors?.status}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="notes">Admin Notes / Resolution</Label>
                <textarea
                  id="notes"
                  value={data.notes}
                  onChange={(e) => setData('notes', e.target.value)}
                  rows={5}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                ></textarea>
                {initialErrors?.notes && (
                  <p className="text-sm text-red-600 mt-1">
                    {initialErrors?.notes}
                  </p>
                )}
              </div>

              <Button type="submit" disabled={processing}>
                {processing ? 'Updating...' : 'Update Request'}
              </Button>
            </form>

            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-gray-800">
                Request Details
              </h3>
              <p>
                <strong>Request ID:</strong> {initialRequest.id}
              </p>
              <p>
                <strong>Supplier Email:</strong>{' '}
                {initialRequest.supplier?.email || 'N/A'}
              </p>
              <p>
                <strong>Current Status:</strong>{' '}
                <Badge
                  className={`${getStatusColor(initialRequest.status)} text-white capitalize`}
                >
                  {initialRequest.status.replace(/_/g, ' ')}
                </Badge>
              </p>
              <p>
                <strong>Submitted At:</strong>{' '}
                {format(new Date(initialRequest.created_at!), 'PPP')}
              </p>
              <p>
                <strong>Last Updated At:</strong>{' '}
                {format(new Date(initialRequest.updated_at!), 'PPP')}
              </p>
              {initialRequest.notes && (
                <p>
                  <strong>User Notes:</strong> {initialRequest.notes}
                </p>
              )}

              {initialRequest.documents &&
                initialRequest.documents.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">
                      Documents Submitted
                    </h4>
                    <ul className="list-disc list-inside space-y-1">
                      {initialRequest.documents.map((docUrl, index) => (
                        <li key={index}>
                          <a
                            href={docUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Document {index + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Show;
