import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import { AppLayout } from '../../components/layouts/AppLayout';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Select } from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import type {
  ClientProfilePageProps,
  ClientProfileFormData,
} from '../../types/profile';

const ClientEdit: React.FC<ClientProfilePageProps> = ({
  profile,
  contact_method_options = [],
  budget_range_options = [],
  errors: serverErrors,
}) => {
  const { data, setData, put, processing } = useForm<ClientProfileFormData>({
    company_name: profile.company_name || '',
    preferred_contact_method: profile.preferred_contact_method,
    project_budget_range: profile.project_budget_range || '',
    description: profile.description || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put('/profile/client');
  };

  return (
    <AppLayout title="Edit Client Profile">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Edit Your Profile
              </h1>
              <p className="text-muted-foreground mt-2">
                Update your client profile to help tradespeople understand your
                needs.
              </p>
            </div>
            <Link href="/profile/client">
              <Button variant="outline">View Profile</Button>
            </Link>
          </div>
        </div>

        {/* Profile completion indicator */}
        <div className="bg-card rounded-lg shadow-sm border p-4 mb-6">
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
                profile.completion_percentage >= 80
                  ? 'bg-green-600'
                  : profile.completion_percentage >= 50
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
              }`}
              style={{ width: `${profile.completion_percentage}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Complete your profile to help tradespeople understand your project
            requirements.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-card rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Basic Information
            </h2>

            <div className="space-y-6">
              <Input
                id="company_name"
                label="Company Name"
                type="text"
                value={data.company_name}
                onChange={(e) => setData('company_name', e.target.value)}
                errors={serverErrors?.company_name}
                placeholder="Your company or business name (optional)"
                hint="Leave blank if you're an individual client"
              />

              <Select
                id="project_budget_range"
                label="Typical Project Budget Range"
                value={data.project_budget_range}
                onChange={(e) =>
                  setData('project_budget_range', e.target.value)
                }
                options={budget_range_options}
                errors={serverErrors?.project_budget_range}
                placeholder="Select budget range..."
                hint="This helps tradespeople understand the scale of your projects"
              />
            </div>
          </div>

          {/* Contact Preferences */}
          <div className="bg-card rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Contact Preferences
            </h2>

            <Select
              id="preferred_contact_method"
              label="Preferred Contact Method"
              value={data.preferred_contact_method}
              onChange={(e) =>
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setData('preferred_contact_method', e.target.value as any)
              }
              options={contact_method_options}
              errors={serverErrors?.preferred_contact_method}
              hint="How would you like tradespeople to contact you?"
            />
          </div>

          {/* Project Description */}
          <div className="bg-card rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              About Your Projects
            </h2>

            <Textarea
              id="description"
              label="Describe Your Typical Projects"
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
              errors={serverErrors?.description}
              placeholder="Describe the types of projects you typically hire for, your expectations, and any specific requirements..."
              rows={6}
              hint="Help tradespeople understand what types of projects you typically hire for (max 1500 characters)"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <Link href="/profile/client">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" loading={processing}>
              Save Changes
            </Button>
          </div>
        </form>

        {/* Help Section */}
        <div className="bg-muted/30 rounded-lg border p-6 mt-8">
          <h3 className="text-lg font-semibold text-foreground mb-3">
            Tips for a Great Client Profile
          </h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Be clear about your typical project requirements</li>
            <li>• Specify your preferred communication method</li>
            <li>
              • Provide a realistic budget range to attract suitable
              tradespeople
            </li>
            <li>• Describe any specific standards or expectations you have</li>
          </ul>
        </div>
      </div>
    </AppLayout>
  );
};

export default ClientEdit;
