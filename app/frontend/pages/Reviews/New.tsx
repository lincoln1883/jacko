import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { AppLayout } from '../../components/layouts/AppLayout';
import { ReviewFormProps } from '../../types/review';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
// import { Input } from '../../components/ui/input'; // Removed unused import
import { StarIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Label } from '../../components/ui/label';

const New: React.FC<ReviewFormProps> = ({
  job,
  reviewee_id,
  errors: initialErrors,
}) => {
  const [rating, setRating] = useState(0);
  const { data, setData, post, processing, errors } = useForm({
    job_id: job.id,
    reviewee_id: reviewee_id,
    rating: 0,
    comment: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(window.route('jobs.reviews.store', job.id), {
      onSuccess: () => {
        // Optionally redirect or show a success message
      },
      onError: (err) => {
        console.error('Error submitting review:', err);
      },
    });
  };

  const renderStars = (currentRating: number) => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <StarIcon
          key={index}
          className={`h-8 w-8 cursor-pointer ${starValue <= currentRating ? 'text-yellow-400' : 'text-gray-300'}`}
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setData('rating', starValue)}
          onMouseLeave={() => setData('rating', rating)} // Reset to current rating on mouse leave
          fill={starValue <= data.rating ? 'currentColor' : 'none'}
        />
      );
    });
  };

  React.useEffect(() => {
    setData('rating', rating);
  }, [rating, setData]);

  return (
    <AppLayout title="Write a Review">
      <Head title="Write a Review" />
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Write a Review for {job.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
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

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="rating">Rating</Label>
                <div className="flex space-x-1">{renderStars(data.rating)}</div>
                {errors.rating && (
                  <p className="text-sm text-red-600 mt-1">{errors.rating}</p>
                )}
              </div>

              <div>
                <Label htmlFor="comment">Comment</Label>
                <Textarea
                  id="comment"
                  value={data.comment}
                  onChange={(e) => setData('comment', e.target.value)}
                  rows={5}
                  className="mt-1 block w-full"
                  placeholder="Enter your review comments..."
                />
                {errors.comment && (
                  <p className="text-sm text-red-600 mt-1">{errors.comment}</p>
                )}
              </div>

              <Button type="submit" disabled={processing}>
                {processing ? 'Submitting...' : 'Submit Review'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default New;
