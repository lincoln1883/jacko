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

  const getCategoryColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      orange: 'bg-orange-100 text-orange-800 border-orange-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      red: 'bg-red-100 text-red-800 border-red-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      pink: 'bg-pink-100 text-pink-800 border-pink-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      gray: 'bg-gray-100 text-gray-800 border-gray-200',
      amber: 'bg-amber-100 text-amber-800 border-amber-200',
      cyan: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      slate: 'bg-slate-100 text-slate-800 border-slate-200',
    };
    return colorMap[color] || colorMap.slate;
  };

  return (
    <AppLayout title="Supplier Profile">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="p-6 mb-6 shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start space-x-4">
                {/* Profile Avatar */}
                <div className="w-16 h-16 bg-gray-100 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-md">
                  {profile.has_avatar && profile.avatar_thumbnail_url ? (
                    <img
                      src={profile.avatar_thumbnail_url}
                      alt={`${profile.company_name || user.email} avatar`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-500" />
                    </div>
                  )}
                </div>

                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {profile.company_name || `${user.email}'s Profile`}
                  </h1>
                  <p className="text-lg text-gray-600 mt-1">
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

            {/* Availability Status */}
            <div className="mb-6">
              <Badge
                className={`text-sm px-2 py-1 rounded-full ${
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
          </CardHeader>
        </Card>

        {/* Location Information */}
        {(profile.parish?.name ||
          profile.street_address ||
          profile.city_town ||
          profile.postal_code ||
          profile.service_radius_km ||
          profile.service_area_notes ||
          profile.additional_parishes.length > 0) && (
          <Card className="p-6 mb-6 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 mb-4">
                Location & Service Area
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(profile.street_address ||
                  profile.city_town ||
                  profile.postal_code) && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">
                      Primary Location
                    </h3>
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 text-gray-500 mr-2 mt-1" />
                      <p className="text-gray-800">
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
                    <h3 className="text-sm font-medium text-gray-700 mb-1">
                      Parish
                    </h3>
                    <p className="text-gray-800">{profile.parish.name}</p>
                  </div>
                )}

                {profile.service_radius_km && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">
                      Service Radius
                    </h3>
                    <div className="flex items-center">
                      <Target className="w-4 h-4 text-gray-500 mr-2" />
                      <p className="text-gray-800">
                        Willing to travel up to {profile.service_radius_km} km
                      </p>
                    </div>
                  </div>
                )}

                {profile.additional_parishes.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">
                      Additional Service Parishes
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.additional_parishes.map((parishName, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-blue-50 text-blue-700"
                        >
                          {parishName}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {profile.service_area_notes && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">
                      Service Area Notes
                    </h3>
                    <p className="text-gray-800 whitespace-pre-wrap">
                      {profile.service_area_notes}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Skills & Services */}
        {profile.skills && profile.skills.length > 0 && (
          <Card className="p-6 mb-6 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 mb-4">
                Skills & Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(profile.skills_by_category).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(profile.skills_by_category).map(
                    ([category, categorySkills]) => (
                      <div key={category}>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">
                          {category}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {categorySkills.map((skill) => (
                            <span
                              key={skill.id}
                              className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium border ${getCategoryColorClasses(skill.category_color)}`}
                              title={skill.description}
                            >
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill.id}
                      className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium border ${getCategoryColorClasses(skill.category_color)}`}
                      title={skill.description}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Basic Information */}
        <Card className="p-6 mb-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900 mb-4">
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profile.bio && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </h3>
                  <p className="text-gray-800">{profile.bio}</p>
                </div>
              )}

              {profile.years_experience !== null && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">
                    Experience
                  </h3>
                  <p className="text-gray-800">{profile.display_experience}</p>
                </div>
              )}

              {profile.experience_level && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">
                    Level
                  </h3>
                  <Badge
                    variant="secondary"
                    className="bg-blue-50 text-blue-700"
                  >
                    {profile.experience_level.charAt(0).toUpperCase() +
                      profile.experience_level.slice(1)}
                  </Badge>
                </div>
              )}

              {profile.hourly_rate && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">
                    Hourly Rate
                  </h3>
                  <p className="text-gray-800 font-semibold text-lg">
                    {profile.display_hourly_rate}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="p-6 mb-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900 mb-4">
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">
                  Email
                </h3>
                <p className="text-gray-800">{user.email}</p>
              </div>

              {profile.phone && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </h3>
                  <p className="text-gray-800">{profile.phone}</p>
                </div>
              )}

              {profile.website && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">
                    Website
                  </h3>
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
                  >
                    {profile.website}
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        {profile.description && (
          <Card className="p-6 mb-6 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 mb-4">
                About My Services
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

        {/* Call-to-Action for incomplete profiles */}
        {!profile.completed && can_edit && (
          <Card className="mt-6 shadow-lg border-2 border-dashed border-blue-200 bg-blue-50 text-center">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Complete Your Profile
              </h3>
              <p className="text-blue-600 mb-4">
                Complete your profile by adding your bio, services description,
                experience, and selecting your skills to attract more clients.
              </p>
              <Link href="/profile/supplier/edit">
                <Button>Complete Profile</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default SupplierShow;
