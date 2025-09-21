import React from 'react';
import { Link } from '@inertiajs/react';
import { AppLayout } from '../../components/layouts/AppLayout';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-card rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {profile.company_name || `${user.email}'s Profile`}
              </h1>
              <p className="text-lg text-muted-foreground mt-1">
                {user.role_display}
              </p>
              {profile.average_rating !== undefined &&
                profile.review_count !== undefined && (
                  <div className="flex items-center mt-2 text-muted-foreground">
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
              <span className="text-sm font-medium text-muted-foreground">
                Profile Completion
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                {profile.completion_percentage}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
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
              className={`${
                profile.active
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {profile.active ? 'Active Client' : 'Inactive'}
            </Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-card rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Basic Information
            </h2>

            <div className="space-y-4">
              {profile.company_name && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Company Name
                  </h3>
                  <p className="text-foreground">{profile.company_name}</p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Email
                </h3>
                <p className="text-foreground">{user.email}</p>
              </div>

              {profile.project_budget_range && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Typical Project Budget
                  </h3>
                  <p className="text-foreground font-semibold">
                    {profile.display_budget_range}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Contact Preferences */}
          <div className="bg-card rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Contact Preferences
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Preferred Contact Method
                </h3>
                <p className="text-foreground">
                  {profile.display_contact_method}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Account Status
                </h3>
                <p className="text-foreground">
                  {user.verified ? 'Verified Account' : 'Account Not Verified'}
                </p>
                {!user.verified && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Please verify your email to access all features.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {profile.description && (
          <div className="bg-card rounded-lg shadow-sm border p-6 mt-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              About My Projects
            </h2>
            <div className="prose prose-sm max-w-none">
              <p className="text-foreground whitespace-pre-wrap">
                {profile.description}
              </p>
            </div>
          </div>
        )}

        {/* Reviews Section */}
        {reviews && reviews.length > 0 && (
          <div className="bg-card rounded-lg shadow-sm border p-6 mt-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Reviews
            </h2>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-center mb-2">
                    <p className="font-medium text-foreground">
                      {review.reviewer?.email} ({review.reviewer?.role_display})
                    </p>
                    <div className="ml-3 flex text-yellow-400">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {review.comment}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Reviewed on:{' '}
                    {new Date(review.created_at!).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Jobs Section */}
        {completedJobs && completedJobs.length > 0 && (
          <div className="bg-card rounded-lg shadow-sm border p-6 mt-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Completed Jobs
            </h2>
            <div className="space-y-4">
              {completedJobs.map((job) => (
                <div
                  key={job.id}
                  className="border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <h3 className="font-medium text-foreground text-lg">
                    <Link
                      href={window.route('jobs.show', job.id)}
                      className="text-blue-600 hover:underline"
                    >
                      {job.title}
                    </Link>
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Status: {job.status.replace(/_/g, ' ')}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Completed on: {new Date(job.due_date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-card rounded-lg shadow-sm border p-6 mt-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Quick Actions
          </h2>
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
        </div>

        {/* Call-to-Action for incomplete profiles */}
        {!profile.completed && can_edit && (
          <div className="bg-muted/50 rounded-lg border-2 border-dashed border-muted p-6 mt-6 text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Complete Your Profile
            </h3>
            <p className="text-muted-foreground mb-4">
              Complete your profile to help tradespeople understand your project
              needs.
            </p>
            <Link href="/profile/client/edit">
              <Button>Complete Profile</Button>
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ClientShow;
