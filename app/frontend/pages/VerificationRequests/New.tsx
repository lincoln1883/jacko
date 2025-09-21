import React, { useRef } from 'react';
import { useForm } from '@inertiajs/react';
import { AppLayout } from '../../components/layouts/AppLayout';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import type { VerificationRequestFormProps } from '../../types/verification_request';

const New: React.FC<VerificationRequestFormProps> = ({
  verificationRequest,
  errors,
}) => {
  const { data, setData, post, processing, progress } = useForm({
    notes: verificationRequest.notes || '',
    documents: [] as File[],
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/verification_requests');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setData('documents', files);
  };

  return (
    <AppLayout title="Submit Verification Request">
      <div className="mx-auto max-w-2xl p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          Submit Verification Request
        </h1>
        <p className="text-gray-600 mb-6">
          Upload your NIS, TRN, and trade certifications for review.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Textarea
            id="notes"
            label="Additional Notes (optional)"
            value={data.notes}
            onChange={(e) => setData('notes', e.target.value)}
            errors={errors?.notes}
            rows={5}
            placeholder="Any additional information or comments for the admin reviewer."
          />

          <div>
            <label
              htmlFor="documents"
              className="block text-sm font-medium text-gray-700"
            >
              Supporting Documents
            </label>
            <Input
              id="documents"
              type="file"
              multiple
              onChange={handleFileChange}
              errors={errors?.documents}
              ref={fileInputRef}
              className="mt-1"
              hint="Max 5 files, 5MB each. PDF, JPEG, PNG formats accepted."
            />
            {progress && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${progress.percentage}%` }}
                ></div>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" loading={processing}>
            Submit Request
          </Button>
        </form>
      </div>
    </AppLayout>
  );
};

export default New;
