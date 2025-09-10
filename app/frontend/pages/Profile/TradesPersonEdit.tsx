import React, { useState, useEffect } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { AppLayout } from '../../components/layouts/AppLayout';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Select } from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { SkillsMultiSelect } from '../../components/ui/skills-multi-select';
import { PortfolioUpload, AvatarUpload } from '../../components';
import { useToast } from '../../contexts/ToastContext';
import type {
  TradesPersonProfilePageProps,
  TradesPersonProfileFormData,
} from '../../types/profile';
import { AVAILABILITY_STATUS_OPTIONS } from '../../types/profile';

const TradesPersonEditContent: React.FC<TradesPersonProfilePageProps> = ({
  profile,
  skills,
  skills_by_category,
  errors: serverErrors,
}) => {
  const { data, setData, put, processing } =
    useForm<TradesPersonProfileFormData>({
      bio: profile.bio || '',
      company_name: profile.company_name || '',
      years_experience: profile.years_experience || '',
      hourly_rate: profile.hourly_rate || '',
      phone: profile.phone || '',
      website: profile.website || '',
      availability_status: profile.availability_status,
      description: profile.description || '',
      skill_ids: profile.skill_ids || [],
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
    put('/profile/tradesperson');
  };

  return (
    <>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Edit Your Profile
              </h1>
              <p className="text-muted-foreground mt-2">
                Update your tradesperson profile to attract more clients.
              </p>
            </div>
            <Link href="/profile/tradesperson">
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
            Complete all sections to improve your profile visibility.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Account Type Selection */}
          <div className="bg-card rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Account Type
            </h2>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You&apos;re currently set up as a{' '}
                <span className="font-semibold text-foreground">
                  Tradesperson
                </span>
                . Would you like to change your account type?
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  className="flex-1 p-4 border-2 border-border hover:border-primary/50 rounded-lg transition-colors cursor-pointer w-full text-left"
                  onClick={() =>
                    (window.location.href =
                      '/profile/client/edit?switch_role=true')
                  }
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground">
                      Client Account
                    </h3>
                    <div className="w-3 h-3 bg-muted rounded-full"></div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    I want to hire tradespeople for projects
                  </p>
                  <p className="text-xs text-primary hover:underline">
                    → Switch to client
                  </p>
                </button>
                <div className="flex-1 p-4 border-2 border-primary bg-primary/5 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground">
                      Tradesperson Account
                    </h3>
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    I am a tradesperson looking for work
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ✓ Currently selected
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-card rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Basic Information
            </h2>

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
                      .value as TradesPersonProfileFormData['availability_status']
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
          </div>

          {/* Profile Avatar */}
          <div className="bg-card rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Profile Avatar
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Upload a professional photo to personalize your profile and build
              trust with potential clients.
            </p>

            <AvatarUpload
              currentAvatarUrl={avatarUrl}
              currentThumbnailUrl={avatarThumbnailUrl}
              onUploadSuccess={handleAvatarUploadSuccess}
              onDeleteSuccess={handleAvatarDeleteSuccess}
            />
          </div>

          {/* Experience & Pricing */}
          <div className="bg-card rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Experience & Pricing
            </h2>

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
          </div>

          {/* Contact Information */}
          <div className="bg-card rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Contact Information
            </h2>

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
          </div>

          {/* Skills & Services Selection */}
          <div className="bg-card rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Skills & Services
            </h2>

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
          </div>

          {/* Services Description */}
          <div className="bg-card rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Services Description
            </h2>

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
          </div>

          {/* Portfolio Images */}
          <div className="bg-card rounded-lg shadow-sm border p-6">
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
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <Link href="/profile/tradesperson">
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

const TradesPersonEdit: React.FC<TradesPersonProfilePageProps> = (props) => {
  return (
    <AppLayout title="Edit Tradesperson Profile">
      <TradesPersonEditContent {...props} />
    </AppLayout>
  );
};

export default TradesPersonEdit;
