import React from 'react';
import { AppLayout } from '../../components/layouts/AppLayout';
// import { usePage } from '@inertiajs/react';
import type { PageProps } from '../../types/auth';
import { format } from 'date-fns';
import { Badge } from '../../components/ui/badge';
import { Link } from '@inertiajs/react';

interface Job {
  id: number;
  title: string;
}

interface UserProfile {
  id: number;
  email: string;
  role_display: string;
}

interface Dispute {
  id: number;
  job?: Job;
  reporter?: UserProfile;
  reported_user?: UserProfile;
  reason: string;
  description: string;
  status: 'pending' | 'resolved' | 'escalated';
  created_at: string;
  updated_at: string;
}

interface DisputeShowProps extends PageProps {
  dispute: Dispute;
}

const Show: React.FC<DisputeShowProps> = ({ dispute }) => {
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

  return (
    <AppLayout title={`Dispute: ${dispute.id}`}>
      <div className="mx-auto max-w-4xl p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          Dispute Details: {dispute.id}
        </h1>

        <div className="space-y-4 mb-6">
          <p>
            <strong>Job:</strong>{' '}
            {dispute.job ? (
              <Link
                href={`/jobs/${dispute.job.id}`}
                className="text-blue-600 hover:underline"
              >
                {dispute.job.title}
              </Link>
            ) : (
              'N/A'
            )}
          </p>
          <p>
            <strong>Reporter:</strong>{' '}
            {dispute.reporter ? dispute.reporter.email : 'N/A'}
            {dispute.reporter && (
              <Badge className="ml-2 capitalize">
                {dispute.reporter.role_display}
              </Badge>
            )}
          </p>
          <p>
            <strong>Reported User:</strong>{' '}
            {dispute.reported_user ? dispute.reported_user.email : 'N/A'}
            {dispute.reported_user && (
              <Badge className="ml-2 capitalize">
                {dispute.reported_user.role_display}
              </Badge>
            )}
          </p>
          <p>
            <strong>Reason:</strong> {dispute.reason}
          </p>
          <p>
            <strong>Description:</strong> {dispute.description}
          </p>
          <p>
            <strong>Status:</strong>{' '}
            <Badge
              className={`${getStatusColor(dispute.status)} text-white capitalize`}
            >
              {dispute.status}
            </Badge>
          </p>
          <p>
            <strong>Submitted On:</strong>{' '}
            {format(new Date(dispute.created_at!), 'PPP')}
          </p>
          <p>
            <strong>Last Updated:</strong>{' '}
            {format(new Date(dispute.updated_at!), 'PPP')}
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Show;
