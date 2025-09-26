import { Head, Link } from '@inertiajs/react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import {
  User,
  Clock,
  Award,
  DollarSign,
  Phone,
  Globe,
  Mail,
  Star,
  Shield,
  ArrowLeft,
  MessageCircle,
  MapPin,
  Camera,
  Target,
  Share2,
} from 'lucide-react';
import type {
  SupplierProfilePageProps as BaseSupplierPublicProps,
  SupplierProfile,
  User as ProfileOwner,
} from '../../types/profile';

interface SupplierPublicProps extends BaseSupplierPublicProps {
  profile: SupplierProfile;
  profile_owner: ProfileOwner;
}

export default function SupplierPublic({
  profile,
  profile_owner,
}: SupplierPublicProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <AppLayout title={`${profile.company_name || 'Professional'} - Profile`}>
      <Head
        title={`${profile.company_name || 'Professional'} - Supplier Profile`}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Back to Search */}
        <div className="mb-6">
          <Link
            href="/search/suppliers"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search Results
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="p-8 mb-8 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="flex items-start space-x-6 mb-6 md:mb-0">
                {/* Profile Avatar */}
                <div className="w-24 h-24 bg-gray-100 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-md">
                  {profile.has_avatar && profile.avatar_thumbnail_url ? (
                    <img
                      src={profile.avatar_thumbnail_url}
                      alt={`${profile.company_name || 'Supplier'} avatar`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <User className="w-12 h-12 text-gray-500" />
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {profile.company_name || 'Professional Supplier'}
                    </h1>
                    {profile_owner.verified && (
                      <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center space-x-4 text-gray-700 mb-3">
                    <div className="flex items-center">
                      <Award className="w-4 h-4 mr-1 text-gray-500" />
                      {profile.display_experience}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1 text-gray-500" />
                      {profile.display_hourly_rate}
                    </div>
                  </div>

                  <Badge
                    className={`text-xs px-2 py-1 rounded-full ${
                      profile.availability_status === 'available'
                        ? 'bg-green-100 text-green-800'
                        : profile.availability_status === 'busy'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    {profile.display_availability}
                  </Badge>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-3 mt-6 md:mt-0">
                {profile.phone && (
                  <a href={`tel:${profile.phone}`}>
                    <Button className="w-full md:w-auto flex items-center justify-center gap-2">
                      <Phone className="w-4 h-4" />
                      Call Now
                    </Button>
                  </a>
                )}
                <Button
                  variant="outline"
                  className="w-full md:w-auto flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Send Message
                </Button>
                <Button
                  variant="outline"
                  className="w-full md:w-auto flex items-center justify-center gap-2"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: `${profile.company_name || 'Professional'} - Supplier Profile`,
                        text: `Check out this ${profile.skills.length > 0 ? profile.skills[0].name.toLowerCase() + ' specialist' : 'supplier'} on our platform!`,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      // You could add a toast notification here
                    }
                  }}
                >
                  <Share2 className="w-4 h-4" />
                  Share Profile
                </Button>
              </div>
            </div>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* About Section */}
              {profile.bio && (
                <Card className="shadow-lg p-6">
                  <CardTitle className="text-xl font-semibold text-gray-900 mb-4">
                    About
                  </CardTitle>
                  <CardContent className="p-0">
                    <p className="text-gray-700 leading-relaxed">
                      {profile.bio}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Description/Services */}
              {profile.description && (
                <Card className="shadow-lg p-6">
                  <CardTitle className="text-xl font-semibold text-gray-900 mb-4">
                    Services Offered
                  </CardTitle>
                  <CardContent className="p-0">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {profile.description}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Skills by Category */}
              {Object.keys(profile.skills_by_category).length > 0 && (
                <Card className="shadow-lg p-6">
                  <CardTitle className="text-xl font-semibold text-gray-900 mb-4">
                    Skills & Expertise
                  </CardTitle>
                  <CardContent className="p-0">
                    <div className="space-y-6">
                      {Object.entries(profile.skills_by_category).map(
                        ([category, skills]) => (
                          <div key={category}>
                            <h3 className="text-lg font-medium text-gray-800 mb-3">
                              {category}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {skills.map((skill) => (
                                <Badge
                                  key={skill.id}
                                  variant="secondary"
                                  className={`text-xs font-medium bg-${skill.category_color}-50 text-${skill.category_color}-700`}
                                >
                                  {skill.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Portfolio Gallery */}
              {profile.portfolio_images &&
                profile.portfolio_images.length > 0 && (
                  <Card className="shadow-lg p-6">
                    <CardHeader className="flex flex-row items-center justify-between p-0 mb-4">
                      <div className="flex items-center">
                        <Camera className="w-5 h-5 text-gray-600 mr-2" />
                        <CardTitle className="text-xl font-semibold text-gray-900">
                          Portfolio Gallery
                        </CardTitle>
                      </div>
                      <Badge variant="outline" className="ml-3">
                        {profile.portfolio_images.length}{' '}
                        {profile.portfolio_images.length === 1
                          ? 'image'
                          : 'images'}
                      </Badge>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {profile.portfolio_images.map((image) => (
                          <div
                            key={image.id}
                            className="group relative aspect-square overflow-hidden rounded-lg bg-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
                          >
                            <img
                              src={image.thumbnail_url || image.image_url}
                              alt={
                                image.image_alt_text ||
                                image.title ||
                                'Portfolio image'
                              }
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-200 flex items-center justify-center">
                              <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <div className="bg-white bg-opacity-20 rounded-full p-2">
                                  <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>
                            {image.title && (
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                                <p className="text-white text-sm font-medium truncate">
                                  {image.title}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {profile.portfolio_images.length > 6 && (
                        <p className="text-gray-600 text-sm text-center mt-4">
                          Click images to view full size
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Information */}
              <Card className="shadow-lg p-6">
                <CardTitle className="text-xl font-semibold text-gray-900 mb-4">
                  Contact Information
                </CardTitle>
                <CardContent className="p-0">
                  <div className="space-y-4">
                    {profile.phone && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-gray-500 mr-3" />
                        <a
                          href={`tel:${profile.phone}`}
                          className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                        >
                          {profile.phone}
                        </a>
                      </div>
                    )}

                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-500 mr-3" />
                      <span className="text-gray-700">
                        {profile_owner.email}
                      </span>
                    </div>

                    {profile.website && (
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 text-gray-500 mr-3" />
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}

                    {/* Current Availability Status */}
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600 text-sm">
                          Current Status:
                        </span>
                        <Badge
                          className={`text-xs px-2 py-1 rounded-full ${
                            profile.availability_status === 'available'
                              ? 'bg-green-100 text-green-800'
                              : profile.availability_status === 'busy'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                        >
                          <Clock className="w-3 h-3 mr-1" />
                          {profile.display_availability}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {profile.availability_status === 'available' &&
                          'Ready to take on new projects'}
                        {profile.availability_status === 'busy' &&
                          'Currently working on projects'}
                        {profile.availability_status === 'booked' &&
                          'Fully booked at the moment'}
                        {profile.availability_status === 'unavailable' &&
                          'Not taking new projects currently'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location Information */}
              {(profile.parish?.name ||
                profile.street_address ||
                profile.city_town ||
                profile.postal_code) && (
                <Card className="shadow-lg p-6">
                  <CardTitle className="text-xl font-semibold text-gray-900 mb-4">
                    Location
                  </CardTitle>
                  <CardContent className="p-0">
                    <div className="space-y-4">
                      {(profile.street_address ||
                        profile.city_town ||
                        profile.postal_code) && (
                        <div className="flex items-start">
                          <MapPin className="w-4 h-4 text-gray-500 mr-3 mt-1" />
                          <span className="text-gray-700">
                            {[
                              profile.street_address,
                              profile.city_town,
                              profile.postal_code,
                            ]
                              .filter(Boolean)
                              .join(', ')}
                          </span>
                        </div>
                      )}

                      {profile.parish && (
                        <div className="pt-3 border-t border-gray-200">
                          <div className="text-sm text-gray-600 mb-1">
                            Parish:
                          </div>
                          <div className="font-medium text-gray-800">
                            {profile.parish.name}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Service Area */}
              {(profile.service_radius_km ||
                profile.service_area_notes ||
                profile.additional_parishes?.length > 0) && (
                <Card className="shadow-lg p-6">
                  <CardTitle className="text-xl font-semibold text-gray-900 mb-4">
                    Service Area
                  </CardTitle>
                  <CardContent className="p-0">
                    <div className="space-y-4">
                      {profile.service_radius_km && (
                        <div className="flex items-start">
                          <Target className="w-4 h-4 text-gray-500 mr-3 mt-1" />
                          <span className="text-gray-700">
                            Willing to travel up to {profile.service_radius_km}{' '}
                            km from primary location.
                          </span>
                        </div>
                      )}

                      {profile.additional_parishes.length > 0 && (
                        <div className="pt-3 border-t border-gray-200">
                          <div className="text-sm text-gray-600 mb-2">
                            Additional Parishes:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {profile.additional_parishes.map(
                              (parishName, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="bg-blue-50 text-blue-700"
                                >
                                  {parishName}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {profile.service_area_notes && (
                        <div className="pt-3 border-t border-gray-200">
                          <div className="text-sm text-gray-600 mb-2">
                            Additional Notes:
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {profile.service_area_notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Profile Stats */}
              <Card className="shadow-lg p-6">
                <CardTitle className="text-xl font-semibold text-gray-900 mb-4">
                  Profile Details
                </CardTitle>
                <CardContent className="p-0">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Experience:</span>
                      <span className="font-medium text-gray-800">
                        {profile.years_experience} years
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Hourly Rate:</span>
                      <span className="font-medium text-gray-800">
                        {profile.display_hourly_rate}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Skills:</span>
                      <span className="font-medium text-gray-800">
                        {profile.skills.length} skills
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Member Since:</span>
                      <span className="font-medium text-gray-800">
                        {formatDate(profile.created_at)}
                      </span>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">
                          Profile Completeness:
                        </span>
                        <span className="font-medium text-gray-800">
                          {profile.completion_percentage}%
                        </span>
                      </div>
                      <div className="mt-2 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${profile.completion_percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews Section Placeholder */}
              <Card className="shadow-lg p-6">
                <CardTitle className="text-xl font-semibold text-gray-900 mb-4">
                  Reviews & Ratings
                </CardTitle>
                <CardContent className="p-0">
                  <div className="text-center py-8">
                    <div className="flex justify-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-6 h-6 text-gray-300" />
                      ))}
                    </div>
                    <p className="text-gray-600 font-medium mb-2">
                      No reviews yet
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      Be the first to leave a review for this supplier!
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-center mb-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                          <Star className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-blue-800 font-medium text-sm">
                          Reviews System Coming Soon
                        </span>
                      </div>
                      <p className="text-blue-700 text-xs text-center">
                        We&apos;re building a comprehensive review system to
                        help you make informed decisions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
