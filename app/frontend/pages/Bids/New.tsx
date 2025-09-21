import React from 'react';
import { useForm } from '@inertiajs/react';
import { AppLayout } from '../../components/layouts/AppLayout';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import type { BidFormProps } from '../../types/bid';

const New: React.FC<BidFormProps> = ({ job, bid, errors }) => {
  const { data, setData, post, processing } = useForm({
    amount: bid.amount || '',
    message: bid.message || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/jobs/${job.id}/bids`);
  };

  return (
    <AppLayout title={`Place Bid for ${job.title}`}>
      <div className="mx-auto max-w-2xl p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          Place Bid for &quot;{job.title}&quot;
        </h1>
        <p className="text-gray-600 mb-6">
          Original Budget: JMD {job.budget.toLocaleString()}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="amount"
            label="Your Bid Amount (JMD)"
            type="number"
            value={data.amount}
            onChange={(e) => setData('amount', Number(e.target.value))}
            errors={errors?.amount}
            required
            min={0.01}
            step="0.01"
          />

          <Textarea
            id="message"
            label="Message to Client (optional)"
            value={data.message}
            onChange={(e) => setData('message', e.target.value)}
            errors={errors?.message}
            rows={5}
            placeholder="Introduce yourself, explain your approach, and highlight your qualifications."
          />

          <Button type="submit" className="w-full" loading={processing}>
            Submit Bid
          </Button>
        </form>
      </div>
    </AppLayout>
  );
};

export default New;
