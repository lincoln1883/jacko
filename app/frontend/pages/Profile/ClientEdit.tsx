import React from 'react';
import { useForm, Link, router } from '@inertiajs/react';
import { AppLayout } from '../../components/layouts/AppLayout';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Select } from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '../../components/ui/card';
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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Edit Your Profile
            </h1>
            <p className="text-gray-600 mt-2">
              Update your client profile to help suppliers understand your
              needs.
            </p>
          </div>
          <Link href="/profile/client">
            <Button variant="outline">View Profile</Button>
          </Link>
        </div>

        {/* Profile completion indicator */}
        <Card className="mb-6 shadow-lg">
          <CardContent className="p-6">
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
                  profile.completion_percentage >= 80
                    ? 'bg-green-600'
                    : profile.completion_percentage >= 50
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                }`}
                style={{ width: `${profile.completion_percentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Complete your profile to help suppliers understand your project
              requirements.
            </p>
          </CardContent>
        </Card>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Account Type Selection */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">
                Account Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  You&apos;re currently set up as a{' '}
                  <span className="font-semibold text-gray-800">Client</span>.
                  Would you like to change your account type?
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 p-4 border-2 border-blue-500 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        Client Account
                      </h3>
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      I want to hire suppliers for projects
                    </p>
                    <p className="text-xs text-gray-500">
                      ✓ Currently selected
                    </p>
                  </div>
                  <button
                    type="button"
                    className="flex-1 p-4 border-2 border-gray-200 hover:border-blue-300 rounded-lg transition-colors cursor-pointer w-full text-left"
                    onClick={() =>
                      router.visit('/profile/supplier/edit?switch_role=true')
                    }
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        Supplier Account
                      </h3>
                      <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      I am a supplier looking for work
                    </p>
                    <p className="text-xs text-blue-600 hover:underline">
                      → Switch to supplier
                    </p>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent>
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
                  hint="This helps suppliers understand the scale of your projects"
                />
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
                hint="How would you like suppliers to contact you?"
              />
            </CardContent>
          </Card>

          {/* Project Description */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">
                About Your Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                id="description"
                label="Describe Your Typical Projects"
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                errors={serverErrors?.description}
                placeholder="Describe the types of projects you typically hire for, your expectations, and any specific requirements..."
                rows={6}
                hint="Help suppliers understand what types of projects you typically hire for (max 1500 characters)"
              />
            </CardContent>
          </Card>

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
        <Card className="mt-8 shadow-lg bg-gray-50 border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Tips for a Great Client Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Be clear about your typical project requirements</li>
              <li>• Specify your preferred communication method</li>
              <li>
                • Provide a realistic budget range to attract suitable suppliers
              </li>
              <li>
                • Describe any specific standards or expectations you have
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ClientEdit;
