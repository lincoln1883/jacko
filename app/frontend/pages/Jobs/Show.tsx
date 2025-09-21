import React from 'react';
import { AppLayout } from '../../components/layouts/AppLayout';
import { Link, usePage, router } from '@inertiajs/react';
import type { JobShowProps } from '../../types/job';
import type { PageProps } from '../../types/auth';
import type { Bid } from '../../types/bid';
import { Button } from '../../components/ui/button';

const Show: React.FC<JobShowProps> = ({ job }) => {
  const { auth } = usePage<PageProps>().props;
  const currentUser = auth?.user;

  const isClient = currentUser && currentUser.id === job.client_id;
  const canPlaceBid =
    currentUser &&
    (currentUser.role === 'supplier' || currentUser.role === 'contractor');

  const handleAcceptBid = (bidId: number) => {
    if (window.confirm('Are you sure you want to accept this bid?')) {
      router.put(`/jobs/${job.id}/bids/${bidId}`, { status: 'accepted' });
    }
  };

  const handleRejectBid = (bidId: number) => {
    if (window.confirm('Are you sure you want to reject this bid?')) {
      router.put(`/jobs/${job.id}/bids/${bidId}`, { status: 'rejected' });
    }
  };

  return (
    <AppLayout title={job.title}>
      <div className="mx-auto max-w-4xl p-6 bg-white shadow-md rounded-lg">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {job.title}
            </h1>
            {job.client && (
              <p className="text-lg text-gray-600">
                Client: {job.client?.email}
              </p>
            )}
          </div>
          <div className="flex-shrink-0">
            {/* Actions for client (edit/delete) or supplier (bid) */}
            {isClient ? (
              <Link
                href={`/jobs/${job.id}/edit`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Edit Job
              </Link>
            ) : canPlaceBid && job.status === 'open' ? (
              <Link
                href={`/jobs/${job.id}/bids/new`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Place Bid
              </Link>
            ) : null}
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Description
            </h2>
            <p className="text-gray-700 leading-relaxed">{job.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Budget
              </h2>
              <p className="text-green-600 text-2xl font-bold">
                JMD {job.budget?.toLocaleString()}
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Due Date
              </h2>
              <p className="text-gray-700 text-lg">{job.due_date}</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Location
            </h2>
            <p className="text-gray-700 text-lg">
              {job.location}, {job.parish?.name}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Status</h2>
            <p className="text-gray-700 text-lg capitalize">{job.status}</p>
          </div>
        </div>

        {job.bids && job.bids.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Bids for this Job
            </h2>
            <div className="space-y-4">
              {job.bids.map((bid: Bid) => (
                <div
                  key={bid.id}
                  className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold text-gray-800">
                      Bid from {bid.supplier?.email}
                    </h3>
                    <span className="text-xl font-bold text-green-600">
                      JMD {bid.amount.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{bid.message}</p>
                  <p className="text-xs text-gray-500 mb-3">
                    Status:{' '}
                    <span className="capitalize font-medium">{bid.status}</span>
                  </p>
                  {isClient &&
                    job.status === 'open' &&
                    bid.status === 'pending' && (
                      <div className="flex space-x-2 mt-4">
                        <Button
                          onClick={() => handleAcceptBid(bid.id!)}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          Accept Bid
                        </Button>
                        <Button
                          onClick={() => handleRejectBid(bid.id!)}
                          className="bg-red-500 hover:bg-red-600 text-white"
                        >
                          Reject Bid
                        </Button>
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Show;
