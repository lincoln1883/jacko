import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '../../../components/layouts/AdminLayout';
import { AdminDisputeShowProps } from '../../../types/admin';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { Select } from '../../../components/ui/select'; // Corrected import
import { Badge } from '../../../components/ui/badge';
import { format } from 'date-fns';

const Show: React.FC<AdminDisputeShowProps> = ({
  dispute: initialDispute,
  errors: initialErrors,
}) => {
  const { data, setData, put, processing, errors } = useForm({
    id: initialDispute.id,
    status: initialDispute.status,
    notes: initialDispute.notes || '',
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { flash } = usePage().props as any;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(window.route('admin.disputes.update', data.id), {
      onSuccess: () => {
        // Optionally update local state or show a success message
      },
      onError: (err) => {
        console.error('Error updating dispute:', err);
      },
    });
  };

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

  const statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Resolved', value: 'resolved' },
    { label: 'Escalated', value: 'escalated' },
  ];

  return (
    <AdminLayout title={`Review Dispute: ${initialDispute.id}`}>
      <Head title={`Dispute ${initialDispute.id}`} />
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Review Dispute: {initialDispute.id}
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

            <form onSubmit={handleSubmit} className="space-y-6 mb-8">
              <div>
                <Label htmlFor="status">Dispute Status</Label>
                <Select
                  options={statusOptions}
                  onChange={(e) =>
                    setData(
                      'status',
                      e.target.value as typeof initialDispute.status
                    )
                  }
                  value={data.status}
                  placeholder="Select Status"
                  className="w-[200px]"
                />
                {errors.status && (
                  <p className="text-sm text-red-600 mt-1">{errors.status}</p>
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
                {errors.notes && (
                  <p className="text-sm text-red-600 mt-1">{errors.notes}</p>
                )}
              </div>

              <Button type="submit" disabled={processing}>
                {processing ? 'Updating...' : 'Update Dispute'}
              </Button>
            </form>

            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-gray-800">
                Dispute Details
              </h3>
              <p>
                <strong>Dispute ID:</strong> {initialDispute.id}
              </p>
              <p>
                <strong>Job Title:</strong> {initialDispute.job?.title || 'N/A'}
              </p>
              <p>
                <strong>Reporter Email:</strong>{' '}
                {initialDispute.reporter?.email || 'N/A'}
              </p>
              <p>
                <strong>Reported User Email:</strong>{' '}
                {initialDispute.reported_user?.email || 'N/A'}
              </p>
              <p>
                <strong>Reason:</strong> {initialDispute.reason}
              </p>
              <p>
                <strong>Description:</strong> {initialDispute.description}
              </p>
              <p>
                <strong>Current Status:</strong>{' '}
                <Badge
                  className={`${getStatusColor(initialDispute.status!)} text-white capitalize`}
                >
                  {initialDispute.status!.replace(/_/g, ' ')}
                </Badge>
              </p>
              <p>
                <strong>Submitted At:</strong>{' '}
                {format(new Date(initialDispute.created_at!), 'PPP')}
              </p>
              <p>
                <strong>Last Updated At:</strong>{' '}
                {format(new Date(initialDispute.updated_at!), 'PPP')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Show;
