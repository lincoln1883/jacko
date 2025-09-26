import React from 'react';
import { Link } from '@inertiajs/react';
import { AppLayout } from '../../components/layouts/AppLayout';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '../../components/ui/card';
import type { ClientProfilePageProps } from '../../types/profile';

const ClientShow: React.FC<ClientProfilePageProps> = ({
  profile,
  user,
  can_edit,
  reviews,
  completedJobs,
}) => {
  const completionColor =
    profile.completion_percentage >= 80
      ? 'green'
      : profile.completion_percentage >= 50
        ? 'yellow'
        : 'red';

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={i < rating ? 'text-yellow-400' : 'text-gray-300'}
      >
        ★
      </span>
    ));
  };

  return (
    <AppLayout title="Client Profile">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {profile.company_name || `${user.email}'s Profile`}
                </h1>
                <p className="text-lg text-gray-600 mt-1">
                  {user.role_display}
                </p>
                {profile.average_rating !== undefined &&
                  profile.review_count !== undefined && (
                    <div className="flex items-center mt-2 text-gray-600">
                      <div className="flex text-yellow-400">
                        {renderStars(profile.average_rating)}
                      </div>
                      <span className="ml-2 text-sm">
                        {profile.average_rating.toFixed(1)} (
                        {profile.review_count} reviews)
                      </span>
                    </div>
                  )}
              </div>

              {can_edit && (
                <Link href="/profile/client/edit">
                  <Button variant="outline">Edit Profile</Button>
                </Link>
              )}
            </div>

            {/* Profile Completion */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Profile Completion
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {profile.completion_percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    completionColor === 'green'
                      ? 'bg-green-600'
                      : completionColor === 'yellow'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  }`}
                  style={{ width: `${profile.completion_percentage}%` }}
                />
              </div>
            </div>

            {/* Account Status */}
            <div className="mb-4">
              <Badge
                className={`text-sm py-1 px-3 rounded-full ${
                  profile.active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {profile.active ? 'Active Client' : 'Inactive'}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.company_name && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">
                      Company Name
                    </h3>
                    <p className="text-gray-800">{profile.company_name}</p>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">
                    Email
                  </h3>
                  <p className="text-gray-800">{user.email}</p>
                </div>

                {profile.project_budget_range && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">
                      Typical Project Budget
                    </h3>
                    <p className="text-gray-800 font-semibold">
                      {profile.display_budget_range}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Preferences */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">
                Contact Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">
                    Preferred Contact Method
                  </h3>
                  <p className="text-gray-800">
                    {profile.display_contact_method}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">
                    Account Status
                  </h3>
                  <p className="text-gray-800">
                    {user.verified
                      ? 'Verified Account'
                      : 'Account Not Verified'}
                  </p>
                  {!user.verified && (
                    <p className="text-sm text-gray-600 mt-1">
                      Please verify your email to access all features.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Description */}
        {profile.description && (
          <Card className="mt-6 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">
                About My Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-800 whitespace-pre-wrap">
                  {profile.description}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reviews Section */}
        {reviews && reviews.length > 0 && (
          <Card className="mt-6 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">
                Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-center mb-2">
                      <p className="font-medium text-gray-900">
                        {review.reviewer?.email} (
                        {review.reviewer?.role_display})
                      </p>
                      <div className="ml-3 flex text-yellow-400">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{review.comment}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Reviewed on:{' '}
                      {new Date(review.created_at!).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Completed Jobs Section */}
        {completedJobs && completedJobs.length > 0 && (
          <Card className="mt-6 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">
                Completed Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0"
                  >
                    <h3 className="font-medium text-gray-900 text-lg">
                      <Link
                        href={`/jobs/${job.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {job.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Status: {job.status.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Completed on:{' '}
                      {new Date(job.due_date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="mt-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              <Button className="w-full" disabled>
                Search Tradespeople
                <span className="text-xs ml-2">(Coming Soon)</span>
              </Button>
              <Button variant="outline" className="w-full" disabled>
                View Project History
                <span className="text-xs ml-2">(Coming Soon)</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Call-to-Action for incomplete profiles */}
        {!profile.completed && can_edit && (
          <Card className="mt-6 shadow-lg border-2 border-dashed border-blue-200 bg-blue-50 text-center">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Complete Your Profile
              </h3>
              <p className="text-blue-600 mb-4">
                Complete your profile to help tradespeople understand your
                project needs.
              </p>
              <Link href="/profile/client/edit">
                <Button>Complete Profile</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default ClientShow;
