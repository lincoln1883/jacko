import React from 'react';
import { AppLayout } from '../../components/layouts/AppLayout';
import { Link, router } from '@inertiajs/react';
import type { JobsIndexProps, Job } from '../../types/job';
import { Select } from '../../components/ui/select';

const Index: React.FC<JobsIndexProps> = ({
  jobs,
  parishes,
  selectedParishId,
  selectedStatus,
  canPostJob,
}) => {
  const parishOptions = [
    { label: 'All Parishes', value: '' },
    ...parishes.map((parish) => ({
      label: parish.name,
      value: String(parish.id),
    })),
  ];

  const jobStatusOptions = [
    { label: 'All Statuses', value: '' },
    { label: 'Open', value: 'open' },
    { label: 'Bidding', value: 'bidding' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  const handleParishChange = (value: string) => {
    router.get(
      '/jobs',
      { parish_id: value === '' ? undefined : value },
      { preserveState: true, replace: true }
    );
  };

  const handleStatusChange = (value: string) => {
    router.get(
      '/jobs',
      { status: value === '' ? undefined : value },
      { preserveState: true, replace: true }
    );
  };

  return (
    <AppLayout title="Job Listings">
      <div className="mx-auto max-w-7xl p-6 bg-white shadow-md rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Job Listings</h1>
          {canPostJob && (
            <Link
              href="/jobs/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Post a New Job
            </Link>
          )}
        </div>

        <div className="flex space-x-4 mb-6">
          <div className="flex-1">
            <Select
              id="parish-filter"
              label="Filter by Parish"
              value={String(selectedParishId || '')}
              onChange={(e) => handleParishChange(e.target.value)}
              options={parishOptions}
              placeholder="Select a Parish"
            />
          </div>
          <div className="flex-1">
            <Select
              id="status-filter"
              label="Filter by Status"
              value={String(selectedStatus || '')}
              onChange={(e) => handleStatusChange(e.target.value)}
              options={jobStatusOptions}
              placeholder="Select a Status"
            />
          </div>
        </div>

        {jobs.length === 0 ? (
          <p className="text-center text-gray-500">
            No jobs posted yet. Be the first to post one!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job: Job) => (
              <div
                key={job.id}
                className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200"
              >
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {job.title}
                </h2>
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                  {job.description}
                </p>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05A7 7 0 0113.95 6.05L16 8l-2 2-2.05-2.05A7 7 0 115.05 4.05zM10 12a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    {job.location}, {job.parish?.name}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Due: {job.due_date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-green-600">
                    JMD {job.budget?.toLocaleString()}
                  </span>
                  <Link
                    href={`/jobs/${job.id}`}
                    className="text-indigo-600 hover:text-indigo-900 font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Index;
