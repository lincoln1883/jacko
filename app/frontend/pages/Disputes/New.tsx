import React from 'react';
import { useForm } from '@inertiajs/react';
import { AppLayout } from '../../components/layouts/AppLayout';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import type { DisputeFormProps } from '../../types/dispute';

const New: React.FC<DisputeFormProps> = ({
  job,
  dispute,
  errors,
  reportedUserOptions,
}) => {
  const { data, setData, post, processing } = useForm({
    reported_user_id: dispute.reported_user_id || '',
    reason: dispute.reason || '',
    description: dispute.description || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/jobs/${job.id}/disputes`);
  };

  return (
    <AppLayout title={`Report Dispute for ${job.title}`}>
      <div className="mx-auto max-w-2xl p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          Report Dispute for &quot;{job.title}&quot;
        </h1>
        <p className="text-gray-600 mb-6">
          Please provide details about the discrepancy or issue you are
          reporting.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Select
              id="reported_user_id"
              label="User to Report"
              value={data.reported_user_id.toString()}
              onChange={(e) =>
                setData('reported_user_id', Number(e.target.value))
              }
              options={reportedUserOptions.map((option) => ({
                label: option.label,
                value: option.value.toString(),
              }))}
              errors={errors?.reported_user_id}
              placeholder="Select a user to report"
            />
          </div>

          <Input
            id="reason"
            label="Reason for Dispute"
            value={data.reason}
            onChange={(e) => setData('reason', e.target.value)}
            errors={errors?.reason}
            placeholder="e.g., Unfinished work, Payment issue, Misconduct"
          />

          <Textarea
            id="description"
            label="Detailed Description"
            value={data.description}
            onChange={(e) => setData('description', e.target.value)}
            errors={errors?.description}
            rows={7}
            placeholder="Provide a detailed account of the issue, including dates, specific events, and any relevant communication."
          />

          <Button type="submit" className="w-full" loading={processing}>
            Submit Dispute
          </Button>
        </form>
      </div>
    </AppLayout>
  );
};

export default New;
