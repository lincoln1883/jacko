import React from 'react';
import { useForm } from '@inertiajs/react';
import { AppLayout } from '../../components/layouts/AppLayout';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Select } from '../../components/ui/select';
import { JobFormProps, Parish } from '../../types/job';

const New: React.FC<JobFormProps> = ({ job, parishes, errors }) => {
  const { data, setData, post, processing } = useForm({
    title: job.title || '',
    description: job.description || '',
    budget: job.budget || '',
    due_date: job.due_date || '',
    location: job.location || '',
    parish_id: job.parish_id || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/jobs');
  };

  const parishOptions = parishes.map((parish: Parish) => ({
    label: parish.name,
    value: String(parish.id),
  }));

  return (
    <AppLayout title="Post a New Job">
      <div className="mx-auto max-w-4xl p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Post a New Job
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="title"
            label="Job Title"
            value={data.title}
            onChange={(e) => setData('title', e.target.value)}
            errors={errors?.title}
            required
          />

          <Textarea
            id="description"
            label="Job Description"
            value={data.description}
            onChange={(e) => setData('description', e.target.value)}
            errors={errors?.description}
            required
            rows={6}
          />

          <Input
            id="budget"
            label="Budget (JMD)"
            type="number"
            value={data.budget}
            onChange={(e) => setData('budget', Number(e.target.value))}
            errors={errors?.budget}
            required
            min={0}
            step="0.01"
          />

          <Input
            id="due_date"
            label="Due Date"
            type="date"
            value={data.due_date}
            onChange={(e) => setData('due_date', e.target.value)}
            errors={errors?.due_date}
            required
          />

          <Input
            id="location"
            label="Specific Location (e.g., street address, neighborhood)"
            value={data.location}
            onChange={(e) => setData('location', e.target.value)}
            errors={errors?.location}
            required
          />

          <Select
            id="parish_id"
            label="Parish"
            value={String(data.parish_id)}
            onChange={(e) => setData('parish_id', Number(e.target.value))}
            options={parishOptions}
            errors={errors?.parish_id}
            placeholder="Select a Parish"
            required
          />

          <Button type="submit" className="w-full" loading={processing}>
            Post Job
          </Button>
        </form>
      </div>
    </AppLayout>
  );
};

export default New;
