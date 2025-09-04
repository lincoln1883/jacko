import { Head, Link } from '@inertiajs/react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
} from 'lucide-react';

interface Skill {
  id: number;
  name: string;
  category: string;
  description?: string;
  category_color: string;
}

interface SkillsByCategory {
  [category: string]: Skill[];
}

interface ProfileOwner {
  id: number;
  email: string;
  role: string;
  role_display: string;
  verified: boolean;
}

interface TradesPersonProfile {
  id: number;
  bio: string;
  company_name: string;
  years_experience: number;
  hourly_rate: number;
  phone: string;
  website: string;
  availability_status: string;
  description: string;
  display_hourly_rate: string;
  display_experience: string;
  display_availability: string;
  availability_color: string;
  skills: Skill[];
  skills_by_category: SkillsByCategory;
  completion_percentage: number;
  created_at: string;
  updated_at: string;
}

interface CurrentUser {
  id: number;
  email: string;
  role: string;
  role_display: string;
  verified: boolean;
}

interface TradesPersonPublicProps {
  profile: TradesPersonProfile;
  profile_owner: ProfileOwner;
  can_edit: boolean;
  current_user: CurrentUser | null;
}

export default function TradesPersonPublic({
  profile,
  profile_owner,
}: TradesPersonPublicProps) {
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
        title={`${profile.company_name || 'Professional'} - Tradesperson Profile`}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Back to Search */}
        <div className="mb-6">
          <Link
            href="/search/tradespeople"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search Results
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="flex items-start space-x-6 mb-6 md:mb-0">
                {/* Profile Avatar */}
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-12 h-12 text-blue-600" />
                </div>

                {/* Profile Info */}
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {profile.company_name || 'Professional Tradesperson'}
                    </h1>
                    {profile_owner.verified && (
                      <Badge className="bg-green-100 text-green-800">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center space-x-4 text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Award className="w-4 h-4 mr-1" />
                      {profile.display_experience}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {profile.display_hourly_rate}
                    </div>
                  </div>

                  <Badge
                    className={`bg-${profile.availability_color}-100 text-${profile.availability_color}-800`}
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    {profile.display_availability}
                  </Badge>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-3">
                {profile.phone && (
                  <a href={`tel:${profile.phone}`}>
                    <Button className="w-full md:w-auto">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </Button>
                  </a>
                )}
                <Button variant="outline" className="w-full md:w-auto">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Section */}
              {profile.bio && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    About
                  </h2>
                  <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                </div>
              )}

              {/* Description/Services */}
              {profile.description && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Services Offered
                  </h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {profile.description}
                  </p>
                </div>
              )}

              {/* Skills by Category */}
              {Object.keys(profile.skills_by_category).length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Skills & Expertise
                  </h2>
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
                                variant="outline"
                                className={`border-${skill.category_color}-300 text-${skill.category_color}-700 bg-${skill.category_color}-50`}
                              >
                                {skill.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  {profile.phone && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-400 mr-3" />
                      <a
                        href={`tel:${profile.phone}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {profile.phone}
                      </a>
                    </div>
                  )}

                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-gray-600">{profile_owner.email}</span>
                  </div>

                  {profile.website && (
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 text-gray-400 mr-3" />
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Stats */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Profile Details
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience:</span>
                    <span className="font-medium">
                      {profile.years_experience} years
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Hourly Rate:</span>
                    <span className="font-medium">
                      {profile.display_hourly_rate}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Skills:</span>
                    <span className="font-medium">
                      {profile.skills.length} skills
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Member Since:</span>
                    <span className="font-medium">
                      {formatDate(profile.created_at)}
                    </span>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        Profile Completeness:
                      </span>
                      <span className="font-medium">
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
              </div>

              {/* Reviews Section Placeholder */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Reviews
                </h2>
                <div className="text-center py-8 text-gray-500">
                  <Star className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No reviews yet</p>
                  <p className="text-sm">Reviews system coming soon!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
