import React from 'react';
import { Link } from '@inertiajs/react';
import { AppLayout } from '../../components/layouts/AppLayout';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { User, MapPin, Target } from 'lucide-react';
import type { SupplierProfilePageProps } from '../../types/profile';

const SupplierShow: React.FC<SupplierProfilePageProps> = ({
  profile,
  user,
  can_edit,
}) => {
  const completionColor =
    profile.completion_percentage >= 80
      ? 'green'
      : profile.completion_percentage >= 50
        ? 'yellow'
        : 'red';

  return (
    <AppLayout title="Tradesperson Profile">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-card rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-start space-x-4">
              {/* Profile Avatar */}
              <div className="w-16 h-16 bg-blue-100 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-lg">
                {profile.has_avatar && profile.avatar_thumbnail_url ? (
                  <img
                    src={profile.avatar_thumbnail_url}
                    alt={`${profile.company_name || user.email} avatar`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                )}
              </div>

              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {profile.company_name || `${user.email}'s Profile`}
                </h1>
                <p className="text-lg text-muted-foreground mt-1">
                  {user.role_display}
                </p>
              </div>
            </div>

            {can_edit && (
              <Link href="/profile/supplier/edit">
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

          {/* Availability Status */}
          <div className="mb-6">
            <Badge
              className={`${
                profile.availability_color === 'green'
                  ? 'bg-green-100 text-green-800'
                  : profile.availability_color === 'yellow'
                    ? 'bg-yellow-100 text-yellow-800'
                    : profile.availability_color === 'red'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
              }`}
            >
              {profile.display_availability}
            </Badge>
          </div>
        </div>

        {/* Location Information */}
        {(profile.parish?.name ||
          profile.street_address ||
          profile.city_town ||
          profile.postal_code ||
          profile.service_radius_km ||
          profile.service_area_notes ||
          profile.additional_parishes.length > 0) && (
          <div className="bg-card rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Location & Service Area
            </h2>
            <div className="space-y-4">
              {(profile.street_address ||
                profile.city_town ||
                profile.postal_code) && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Primary Location
                  </h3>
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 text-muted-foreground mr-2 mt-1" />
                    <p className="text-foreground">
                      {[
                        profile.street_address,
                        profile.city_town,
                        profile.postal_code,
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  </div>
                </div>
              )}

              {profile.parish && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Parish
                  </h3>
                  <p className="text-foreground">{profile.parish.name}</p>
                </div>
              )}

              {profile.service_radius_km && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Service Radius
                  </h3>
                  <div className="flex items-center">
                    <Target className="w-4 h-4 text-muted-foreground mr-2" />
                    <p className="text-foreground">
                      Willing to travel up to {profile.service_radius_km} km
                    </p>
                  </div>
                </div>
              )}

              {profile.additional_parishes.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Additional Service Parishes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.additional_parishes.map((parishName, index) => (
                      <Badge key={index} variant="outline">
                        {parishName}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {profile.service_area_notes && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Service Area Notes
                  </h3>
                  <p className="text-foreground whitespace-pre-wrap">
                    {profile.service_area_notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Skills & Services */}
        {profile.skills && profile.skills.length > 0 && (
          <div className="bg-card rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Skills & Services
            </h2>

            {Object.keys(profile.skills_by_category).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(profile.skills_by_category).map(
                  ([category, categorySkills]) => (
                    <div key={category}>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        {category}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {categorySkills.map((skill) => {
                          const getCategoryColorClasses = (color: string) => {
                            const colorMap: { [key: string]: string } = {
                              orange:
                                'bg-orange-100 text-orange-800 border-orange-200',
                              yellow:
                                'bg-yellow-100 text-yellow-800 border-yellow-200',
                              blue: 'bg-blue-100 text-blue-800 border-blue-200',
                              red: 'bg-red-100 text-red-800 border-red-200',
                              purple:
                                'bg-purple-100 text-purple-800 border-purple-200',
                              pink: 'bg-pink-100 text-pink-800 border-pink-200',
                              green:
                                'bg-green-100 text-green-800 border-green-200',
                              emerald:
                                'bg-emerald-100 text-emerald-800 border-emerald-200',
                              gray: 'bg-gray-100 text-gray-800 border-gray-200',
                              amber:
                                'bg-amber-100 text-amber-800 border-amber-200',
                              cyan: 'bg-cyan-100 text-cyan-800 border-cyan-200',
                              indigo:
                                'bg-indigo-100 text-indigo-800 border-indigo-200',
                              slate:
                                'bg-slate-100 text-slate-800 border-slate-200',
                            };
                            return colorMap[color] || colorMap.slate;
                          };

                          return (
                            <span
                              key={skill.id}
                              className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium border ${getCategoryColorClasses(skill.category_color)}`}
                              title={skill.description}
                            >
                              {skill.name}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => {
                  const getCategoryColorClasses = (color: string) => {
                    const colorMap: { [key: string]: string } = {
                      orange: 'bg-orange-100 text-orange-800 border-orange-200',
                      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                      blue: 'bg-blue-100 text-blue-800 border-blue-200',
                      red: 'bg-red-100 text-red-800 border-red-200',
                      purple: 'bg-purple-100 text-purple-800 border-purple-200',
                      pink: 'bg-pink-100 text-pink-800 border-pink-200',
                      green: 'bg-green-100 text-green-800 border-green-200',
                      emerald:
                        'bg-emerald-100 text-emerald-800 border-emerald-200',
                      gray: 'bg-gray-100 text-gray-800 border-gray-200',
                      amber: 'bg-amber-100 text-amber-800 border-amber-200',
                      cyan: 'bg-cyan-100 text-cyan-800 border-cyan-200',
                      indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
                      slate: 'bg-slate-100 text-slate-800 border-slate-200',
                    };
                    return colorMap[color] || colorMap.slate;
                  };

                  return (
                    <span
                      key={skill.id}
                      className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium border ${getCategoryColorClasses(skill.category_color)}`}
                      title={skill.description}
                    >
                      {skill.name}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-card rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Basic Information
            </h2>

            <div className="space-y-4">
              {profile.bio && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Bio
                  </h3>
                  <p className="text-foreground">{profile.bio}</p>
                </div>
              )}

              {profile.years_experience !== null && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Experience
                  </h3>
                  <p className="text-foreground">
                    {profile.display_experience}
                  </p>
                </div>
              )}

              {profile.experience_level && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Level
                  </h3>
                  <Badge variant="secondary">
                    {profile.experience_level.charAt(0).toUpperCase() +
                      profile.experience_level.slice(1)}
                  </Badge>
                </div>
              )}

              {profile.hourly_rate && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Hourly Rate
                  </h3>
                  <p className="text-foreground font-semibold text-lg">
                    {profile.display_hourly_rate}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-card rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Contact Information
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Email
                </h3>
                <p className="text-foreground">{user.email}</p>
              </div>

              {profile.phone && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Phone
                  </h3>
                  <p className="text-foreground">{profile.phone}</p>
                </div>
              )}

              {profile.website && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Website
                  </h3>
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 underline"
                  >
                    {profile.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {profile.description && (
          <div className="bg-card rounded-lg shadow-sm border p-6 mt-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              About My Services
            </h2>
            <div className="prose prose-sm max-w-none">
              <p className="text-foreground whitespace-pre-wrap">
                {profile.description}
              </p>
            </div>
          </div>
        )}

        {/* Call-to-Action for incomplete profiles */}
        {!profile.completed && can_edit && (
          <div className="bg-muted/50 rounded-lg border-2 border-dashed border-muted p-6 mt-6 text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Complete Your Profile
            </h3>
            <p className="text-muted-foreground mb-4">
              Complete your profile by adding your bio, services description,
              experience, and selecting your skills to attract more clients.
            </p>
            <Link href="/profile/supplier/edit">
              <Button>Complete Profile</Button>
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default SupplierShow;
