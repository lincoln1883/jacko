import React, { useState, useEffect } from 'react';
import { useForm, Link, router } from '@inertiajs/react';
import { AppLayout } from '../../components/layouts/AppLayout';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Select } from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { SkillsMultiSelect } from '../../components/ui/skills-multi-select';
import {
  AdditionalParishesMultiSelect,
  PortfolioUpload,
  AvatarUpload,
} from '../../components';
import { useToast } from '../../contexts/ToastContext';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../../components/ui/card';
import type {
  SupplierProfilePageProps,
  SupplierProfileFormData,
  Parish,
} from '../../types/profile';
import {
  AVAILABILITY_STATUS_OPTIONS,
  EXPERIENCE_LEVEL_OPTIONS,
} from '../../types/profile';

interface SupplierEditCustomProps extends SupplierProfilePageProps {
  parishes: Parish[];
}

const SupplierEditContent: React.FC<SupplierEditCustomProps> = ({
  profile,
  skills,
  skills_by_category,
  parishes,
  errors: serverErrors,
}) => {
  const { data, setData, put, processing } = useForm<SupplierProfileFormData>({
    bio: profile.bio || '',
    company_name: profile.company_name || '',
    years_experience: profile.years_experience || '',
    hourly_rate: profile.hourly_rate || '',
    phone: profile.phone || '',
    website: profile.website || '',
    availability_status: profile.availability_status,
    experience_level: profile.experience_level || null,
    description: profile.description || '',
    skill_ids: profile.skill_ids || [],
    parish_id: profile.parish?.id || '', // New field
    street_address: profile.street_address || '', // New field
    city_town: profile.city_town || '', // New field
    postal_code: profile.postal_code || '', // New field
    service_radius_km: profile.service_radius_km || '', // New field
    service_area_notes: profile.service_area_notes || '', // New field
    additional_parishes: profile.additional_parishes || [], // New field
  });

  // Avatar state
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.avatar_url);
  const [avatarThumbnailUrl, setAvatarThumbnailUrl] = useState<string | null>(
    profile.avatar_thumbnail_url
  );

  // Portfolio state
  const [portfolioImages, setPortfolioImages] = useState([]);
  const [portfolioMeta, setPortfolioMeta] = useState({
    can_add_more: true,
    storage_used_mb: 0,
    storage_limit_mb: 100,
  });
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [portfolioError, setPortfolioError] = useState<string | null>(null);
  const toast = useToast();

  // Avatar handlers
  const handleAvatarUploadSuccess = (
    newAvatarUrl: string,
    newThumbnailUrl: string
  ) => {
    setAvatarUrl(newAvatarUrl);
    setAvatarThumbnailUrl(newThumbnailUrl);
  };

  const handleAvatarDeleteSuccess = () => {
    setAvatarUrl(null);
    setAvatarThumbnailUrl(null);
  };

  // Load portfolio images on component mount
  useEffect(() => {
    loadPortfolioImages();
  }, []);

  const loadPortfolioImages = async () => {
    setPortfolioLoading(true);
    setPortfolioError(null);

    try {
      const response = await fetch('/portfolio_images', {
        headers: {
          Accept: 'application/json',
          'X-CSRF-Token':
            document
              .querySelector('meta[name="csrf-token"]')
              ?.getAttribute('content') || '',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load portfolio images');
      }

      const data = await response.json();
      setPortfolioImages(data.portfolio_images);
      setPortfolioMeta(data.meta);
    } catch (error) {
      console.error('Error loading portfolio images:', error);
      setPortfolioError(
        error instanceof Error
          ? error.message
          : 'Failed to load portfolio images'
      );
    } finally {
      setPortfolioLoading(false);
    }
  };

  const handlePortfolioUpload = async (files: FileList) => {
    const formData = new FormData();
    Array.from(files).forEach((file, index) => {
      formData.append(
        index === 0
          ? 'portfolio_image[image]'
          : `portfolio_images[${index}][image]`,
        file
      );
    });

    try {
      const response = await fetch('/portfolio_images', {
        method: 'POST',
        headers: {
          'X-CSRF-Token':
            document
              .querySelector('meta[name="csrf-token"]')
              ?.getAttribute('content') || '',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      toast.success(result.message || 'Portfolio image uploaded successfully!');
      await loadPortfolioImages(); // Reload images
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Upload failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  const handlePortfolioUpdate = async (
    id: number,
    updateData: {
      title?: string;
      description?: string;
      image_alt_text?: string;
      active?: boolean;
    }
  ) => {
    try {
      const response = await fetch(`/portfolio_images/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token':
            document
              .querySelector('meta[name="csrf-token"]')
              ?.getAttribute('content') || '',
        },
        body: JSON.stringify({ portfolio_image: updateData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Update failed');
      }

      const result = await response.json();
      toast.success(result.message || 'Portfolio image updated successfully!');
      await loadPortfolioImages();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Update failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  const handlePortfolioDelete = async (id: number) => {
    try {
      const response = await fetch(`/portfolio_images/${id}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-Token':
            document
              .querySelector('meta[name="csrf-token"]')
              ?.getAttribute('content') || '',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Delete failed');
      }

      const result = await response.json();
      toast.success(result.message || 'Portfolio image deleted successfully!');
      await loadPortfolioImages();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Delete failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  const handlePortfolioReorder = async (imageIds: number[]) => {
    try {
      const response = await fetch('/portfolio_images/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token':
            document
              .querySelector('meta[name="csrf-token"]')
              ?.getAttribute('content') || '',
        },
        body: JSON.stringify({ image_ids: imageIds }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Reorder failed');
      }

      const result = await response.json();
      toast.success(
        result.message || 'Portfolio images reordered successfully!'
      );
      await loadPortfolioImages();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Reorder failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put('/profile/supplier');
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Edit Your Profile
            </h1>
            <p className="text-gray-600 mt-2">
              Update your supplier profile to attract more clients.
            </p>
          </div>
          <Link href="/profile/supplier">
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
              Complete all sections to improve your profile visibility.
            </p>
          </CardContent>
        </Card>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
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
                  <span className="font-semibold text-gray-800">Supplier</span>.
                  Would you like to change your account type?
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    className="flex-1 p-4 border-2 border-gray-200 hover:border-blue-300 rounded-lg transition-colors cursor-pointer w-full text-left"
                    onClick={() =>
                      router.visit('/profile/client/edit?switch_role=true')
                    }
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        Client Account
                      </h3>
                      <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      I want to hire suppliers for projects
                    </p>
                    <p className="text-xs text-blue-600 hover:underline">
                      → Switch to client
                    </p>
                  </button>
                  <div className="flex-1 p-4 border-2 border-blue-500 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        Supplier Account
                      </h3>
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      I am a supplier looking for work
                    </p>
                    <p className="text-xs text-gray-500">
                      ✓ Currently selected
                    </p>
                  </div>
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
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  id="company_name"
                  label="Company Name"
                  type="text"
                  value={data.company_name}
                  onChange={(e) => setData('company_name', e.target.value)}
                  errors={serverErrors?.company_name}
                  placeholder="Your business name (optional)"
                />

                <Select
                  id="availability_status"
                  label="Availability Status"
                  value={data.availability_status}
                  onChange={(e) =>
                    setData(
                      'availability_status',
                      e.target
                        .value as SupplierProfileFormData['availability_status']
                    )
                  }
                  options={AVAILABILITY_STATUS_OPTIONS}
                  errors={serverErrors?.availability_status}
                />
              </div>

              <div className="mt-6">
                <Textarea
                  id="bio"
                  label="Professional Bio"
                  value={data.bio}
                  onChange={(e) => setData('bio', e.target.value)}
                  errors={serverErrors?.bio}
                  placeholder="Tell clients about your professional background..."
                  rows={3}
                  hint="Brief overview of your skills and experience (max 1000 characters)"
                />
              </div>
            </CardContent>
          </Card>

          {/* Profile Avatar */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">
                Profile Avatar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-6">
                Upload a professional photo to personalize your profile and
                build trust with potential clients.
              </p>

              <AvatarUpload
                currentAvatarUrl={avatarUrl}
                currentThumbnailUrl={avatarThumbnailUrl}
                onUploadSuccess={handleAvatarUploadSuccess}
                onDeleteSuccess={handleAvatarDeleteSuccess}
              />
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">
                Location Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <Select
                  id="parish_id"
                  label="Parish"
                  value={data.parish_id}
                  onChange={(e) => setData('parish_id', e.target.value)}
                  options={parishes.map((p) => ({
                    label: p.name,
                    value: p.id.toString(),
                  }))}
                  errors={serverErrors?.parish_id}
                  placeholder="Select your parish"
                />
                <Input
                  id="street_address"
                  label="Street Address"
                  type="text"
                  value={data.street_address}
                  onChange={(e) => setData('street_address', e.target.value)}
                  errors={serverErrors?.street_address}
                  placeholder="E.g., 123 Main St"
                />
                <Input
                  id="city_town"
                  label="City/Town"
                  type="text"
                  value={data.city_town}
                  onChange={(e) => setData('city_town', e.target.value)}
                  errors={serverErrors?.city_town}
                  placeholder="E.g., Kingston"
                />
                <Input
                  id="postal_code"
                  label="Postal Code"
                  type="text"
                  value={data.postal_code}
                  onChange={(e) => setData('postal_code', e.target.value)}
                  errors={serverErrors?.postal_code}
                  placeholder="E.g., KGN10"
                />
              </div>
              <div className="mt-6 grid md:grid-cols-2 gap-6">
                <Input
                  id="service_radius_km"
                  label="Service Radius (km)"
                  type="number"
                  min="0"
                  max="500"
                  value={data.service_radius_km}
                  onChange={(e) => setData('service_radius_km', e.target.value)}
                  errors={serverErrors?.service_radius_km}
                  placeholder="E.g., 50"
                  hint="Distance from your location you are willing to travel"
                />
                <AdditionalParishesMultiSelect
                  parishes={parishes}
                  selectedParishIds={data.additional_parishes.map(Number)}
                  onSelectionChange={(selectedIds) =>
                    setData('additional_parishes', selectedIds.map(String))
                  }
                  errors={serverErrors?.additional_parishes}
                />
              </div>
              <div className="mt-6">
                <Textarea
                  id="service_area_notes"
                  label="Service Area Notes"
                  value={data.service_area_notes}
                  onChange={(e) =>
                    setData('service_area_notes', e.target.value)
                  }
                  errors={serverErrors?.service_area_notes}
                  placeholder="Any specific notes about your service areas or travel limitations..."
                  rows={3}
                  hint="Describe any specific areas you serve or travel limitations."
                />
              </div>
            </CardContent>
          </Card>

          {/* Experience & Pricing */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">
                Experience & Pricing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  id="years_experience"
                  label="Years of Experience"
                  type="number"
                  min="0"
                  max="50"
                  value={data.years_experience}
                  onChange={(e) => setData('years_experience', e.target.value)}
                  errors={serverErrors?.years_experience}
                  placeholder="0"
                  hint="Total years in your trade"
                />

                <Select
                  id="experience_level"
                  label="Experience Level"
                  value={data.experience_level || ''}
                  onChange={(e) =>
                    setData(
                      'experience_level',
                      e.target
                        .value as SupplierProfileFormData['experience_level']
                    )
                  }
                  options={EXPERIENCE_LEVEL_OPTIONS}
                  errors={serverErrors?.experience_level}
                  placeholder="Select your experience level"
                />

                <Input
                  id="hourly_rate"
                  label="Hourly Rate (USD)"
                  type="number"
                  min="1"
                  max="10000"
                  step="0.01"
                  value={data.hourly_rate}
                  onChange={(e) => setData('hourly_rate', e.target.value)}
                  errors={serverErrors?.hourly_rate}
                  placeholder="50.00"
                  hint="Your standard hourly rate"
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  id="phone"
                  label="Phone Number"
                  type="tel"
                  value={data.phone}
                  onChange={(e) => setData('phone', e.target.value)}
                  errors={serverErrors?.phone}
                  placeholder="+1-876-123-4567"
                  hint="Your business phone number"
                />

                <Input
                  id="website"
                  label="Website"
                  type="url"
                  value={data.website}
                  onChange={(e) => setData('website', e.target.value)}
                  errors={serverErrors?.website}
                  placeholder="https://yourwebsite.com"
                  hint="Your business website (optional)"
                />
              </div>
            </CardContent>
          </Card>

          {/* Skills & Services Selection */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">
                Skills & Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SkillsMultiSelect
                skills={skills}
                skillsByCategory={skills_by_category}
                selectedSkillIds={data.skill_ids}
                onSelectionChange={(skillIds) => setData('skill_ids', skillIds)}
                label="Your Skills & Services"
                hint="Select up to 10 skills that best represent your expertise and services (required)"
                errors={serverErrors?.skill_ids}
                maxSelections={10}
              />
            </CardContent>
          </Card>

          {/* Services Description */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">
                Services Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                id="description"
                label="Describe Your Services"
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                errors={serverErrors?.description}
                placeholder="Describe the services you offer, your specialties, and what makes you unique..."
                rows={6}
                hint="Detailed description of your services to help clients understand what you offer (max 2000 characters)"
              />
            </CardContent>
          </Card>

          {/* Portfolio Images */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">
                Portfolio Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PortfolioUpload
                portfolioImages={portfolioImages}
                meta={portfolioMeta}
                onUpload={handlePortfolioUpload}
                onUpdate={handlePortfolioUpdate}
                onDelete={handlePortfolioDelete}
                onReorder={handlePortfolioReorder}
                loading={portfolioLoading}
                error={portfolioError || undefined}
              />
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <Link href="/profile/supplier">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" loading={processing}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

const SupplierEdit: React.FC<SupplierEditCustomProps> = (props) => {
  return (
    <AppLayout title="Edit Supplier Profile">
      <SupplierEditContent {...props} />
    </AppLayout>
  );
};

export default SupplierEdit;
