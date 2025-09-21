import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '../../../components/layouts/AdminLayout';
import { AdminJobShowProps } from '../../../types/admin';
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

const Show: React.FC<AdminJobShowProps> = ({
  job: initialJob,
  errors: initialErrors,
}) => {
  const {
    data,
    setData,
    put,
    processing,
    delete: destroy,
    errors,
  } = useForm({
    id: initialJob.id,
    status: initialJob.status,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { flash } = usePage().props as any;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(window.route('admin.jobs.update', data.id), {
      onSuccess: () => {
        // Optionally update local state or show a success message
      },
      onError: (err) => {
        console.error('Error updating job:', err);
      },
    });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      destroy(window.route('admin.jobs.destroy', data.id));
    }
  };

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

  const statusOptions = [
    { label: 'Open', value: 'open' },
    { label: 'Bidding', value: 'bidding' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  return (
    <AdminLayout title={`Manage Job: ${initialJob.title}`}>
      <Head title={initialJob.title} />
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Manage Job: {initialJob.title}
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
                <Label htmlFor="status">Job Status</Label>
                <Select
                  options={statusOptions}
                  onChange={(e) =>
                    setData(
                      'status',
                      e.target.value as typeof initialJob.status
                    )
                  }
                  value={data.status}
                  placeholder="Select job status"
                  className="w-full"
                />
                {errors.status && (
                  <p className="text-sm text-red-600 mt-1">{errors.status}</p>
                )}
              </div>

              <div className="flex space-x-4">
                <Button type="submit" disabled={processing}>
                  {processing ? 'Updating...' : 'Update Job Status'}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={processing}
                >
                  {processing ? 'Deleting...' : 'Delete Job'}
                </Button>
              </div>
            </form>

            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-gray-800">
                Job Details
              </h3>
              <p>
                <strong>ID:</strong> {initialJob.id}
              </p>
              <p>
                <strong>Title:</strong> {initialJob.title}
              </p>
              <p>
                <strong>Description:</strong> {initialJob.description}
              </p>
              <p>
                <strong>Budget:</strong> ${initialJob.budget.toFixed(2)}
              </p>
              <p>
                <strong>Due Date:</strong>{' '}
                {format(new Date(initialJob.due_date), 'PPP')}
              </p>
              <p>
                <strong>Location:</strong> {initialJob.location}
              </p>
              <p>
                <strong>Parish:</strong> {initialJob.parish?.name || 'N/A'}
              </p>
              <p>
                <strong>Client:</strong> {initialJob.client?.email || 'N/A'}
              </p>
              <p>
                <strong>Status:</strong>{' '}
                <Badge
                  className={`${getStatusColor(initialJob.status)} text-white capitalize`}
                >
                  {initialJob.status.replace(/_/g, ' ')}
                </Badge>
              </p>
              <p>
                <strong>Created At:</strong>{' '}
                {format(new Date(initialJob.created_at!), 'PPP')}
              </p>
              <p>
                <strong>Updated At:</strong>{' '}
                {format(new Date(initialJob.updated_at!), 'PPP')}
              </p>
            </div>

            {initialJob.bids && initialJob.bids.length > 0 && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="text-xl">Bids for this Job</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {initialJob.bids.map((bid) => (
                    <div
                      key={bid.id}
                      className="border p-4 rounded-md shadow-sm"
                    >
                      <p>
                        <strong>Bidder:</strong> {bid.supplier?.email || 'N/A'}
                      </p>
                      <p>
                        <strong>Amount:</strong> ${bid.amount.toFixed(2)}
                      </p>
                      <p>
                        <strong>Message:</strong> {bid.message}
                      </p>
                      <p>
                        <strong>Status:</strong>{' '}
                        <Badge
                          variant={
                            bid.status === 'accepted'
                              ? 'default'
                              : bid.status === 'rejected'
                                ? 'destructive'
                                : 'default'
                          }
                          className="capitalize"
                        >
                          {bid.status}
                        </Badge>
                      </p>
                      <p>
                        <strong>Submitted At:</strong>{' '}
                        {format(new Date(bid.created_at!), 'PPP')}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Show;
