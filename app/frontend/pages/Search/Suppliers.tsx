import { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card'; // Removed unused CardHeader, CardTitle
import {
  Search,
  Filter,
  Award,
  DollarSign,
  Phone,
  Globe,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
  MapPin,
} from 'lucide-react';
import { SkillsMultiSelect } from '@/components/ui/skills-multi-select';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface Skill {
  id: number;
  name: string;
  category: string;
  category_color: string;
}

interface User {
  id: number;
  email: string;
}

interface SupplierProfile {
  id: number;
  user: User;
  bio: string;
  company_name: string;
  description: string;
  years_experience: number;
  hourly_rate: number;
  phone: string;
  website: string;
  availability_status: string;
  skills: Skill[];
  display_hourly_rate: string;
  display_experience: string;
  display_availability: string;
  availability_color: string;
  completion_percentage: number;
  skill_names: string[];
  primary_skills: Skill[];
  has_avatar: boolean;
  avatar_url: string | null;
  avatar_thumbnail_url: string | null;
  parish: { id: number; name: string } | null;
  street_address: string | null;
  city_town: string | null;
  postal_code: string | null;
  service_radius_km: number | null;
  service_area_notes: string | null;
  additional_parishes: string[];
}

interface SkillsByCategory {
  [category: string]: { id: number; name: string; description?: string }[];
}

interface AvailabilityOption {
  value: string;
  label: string;
  color: string;
}

interface ExperienceOption {
  value: string;
  label: string;
}

interface ParishOption {
  value: number;
  label: string;
}

interface SearchParams {
  query?: string;
  skill_ids?: string[];
  availability?: string[];
  experience_range?: string[];
  page?: string;
  per_page?: string;
  parish_id?: string;
  service_radius_km?: string;
}

interface PaginationMeta {
  current_page: number;
  next_page: number | null;
  prev_page: number | null;
  total_pages: number;
  total_count: number;
  per_page: number;
}

interface SearchSupplierProps {
  profiles: SupplierProfile[];
  search_params: SearchParams;
  skills_by_category: SkillsByCategory;
  availability_options: AvailabilityOption[];
  experience_options: ExperienceOption[];
  parish_options: ParishOption[];
  pagination: PaginationMeta;
}

export default function SearchSupplier({
  profiles,
  search_params,
  skills_by_category,
  availability_options,
  experience_options,
  parish_options,
  pagination,
}: SearchSupplierProps) {
  const [searchQuery, setSearchQuery] = useState(search_params.query || '');
  const [selectedSkills, setSelectedSkills] = useState<number[]>(
    search_params.skill_ids?.map((id) => parseInt(id)) || []
  );
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>(
    search_params.availability || []
  );
  const [selectedExperience, setSelectedExperience] = useState<string[]>(
    search_params.experience_range || []
  );
  const [selectedParishId, setSelectedParishId] = useState<string>(
    search_params.parish_id || ''
  );
  const [serviceRadiusKm, setServiceRadiusKm] = useState<string>(
    search_params.service_radius_km || ''
  );
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (page = 1) => {
    const searchParams = new URLSearchParams();

    if (searchQuery.trim()) {
      searchParams.append('query', searchQuery.trim());
    }

    if (selectedSkills.length > 0) {
      selectedSkills.forEach((skillId) => {
        searchParams.append('skill_ids[]', skillId.toString());
      });
    }

    if (selectedAvailability.length > 0) {
      selectedAvailability.forEach((availability) => {
        searchParams.append('availability[]', availability);
      });
    }

    if (selectedExperience.length > 0) {
      selectedExperience.forEach((experience) => {
        searchParams.append('experience_range[]', experience);
      });
    }

    // New: Append location filters
    if (selectedParishId) {
      searchParams.append('parish_id', selectedParishId);
    }
    if (serviceRadiusKm && parseInt(serviceRadiusKm) > 0) {
      searchParams.append('service_radius_km', serviceRadiusKm);
    }

    if (page > 1) {
      searchParams.append('page', page.toString());
    }

    router.get(`/search/tradespeople?${searchParams.toString()}`);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSkills([]);
    setSelectedAvailability([]);
    setSelectedExperience([]);
    setSelectedParishId('');
    setServiceRadiusKm('');
    handleSearch(1); // Re-run search after clearing filters to refresh results
  };

  const toggleAvailability = (value: string) => {
    setSelectedAvailability((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const toggleExperience = (value: string) => {
    setSelectedExperience((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const hasActiveFilters =
    selectedSkills.length > 0 ||
    selectedAvailability.length > 0 ||
    selectedExperience.length > 0 ||
    searchQuery.trim().length > 0 ||
    selectedParishId !== '' ||
    (serviceRadiusKm !== '' && parseInt(serviceRadiusKm) > 0);

  const goToPage = (page: number) => {
    handleSearch(page);
  };

  const ProfileCard = ({ profile }: { profile: SupplierProfile }) => (
    <Card className="shadow-md p-6 flex flex-col h-full">
      {/* Profile Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
            {profile.has_avatar && profile.avatar_thumbnail_url ? (
              <img
                src={profile.avatar_thumbnail_url}
                alt={`${profile.company_name || 'Supplier'} avatar`}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon className="w-6 h-6 text-gray-500" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900">
              {profile.company_name || 'Professional Supplier'}
            </h3>
            <p className="text-sm text-gray-600">{profile.user.email}</p>
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
          {profile.display_availability}
        </Badge>
      </div>

      {/* Bio */}
      {profile.bio && (
        <p className="text-gray-700 mb-4 line-clamp-3 flex-grow">
          {profile.bio}
        </p>
      )}

      {/* Skills */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {profile.primary_skills.slice(0, 4).map((skill) => (
            <Badge
              key={skill.id}
              variant="secondary"
              className="text-xs font-medium bg-blue-50 text-blue-700"
            >
              {skill.name}
            </Badge>
          ))}
          {profile.skills.length > 4 && (
            <Badge
              variant="secondary"
              className="text-xs font-medium bg-blue-50 text-blue-700"
            >
              +{profile.skills.length - 4} more
            </Badge>
          )}
        </div>
      </div>

      {/* Location */}
      {(profile.parish || profile.street_address || profile.city_town) && (
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <MapPin className="w-4 h-4 mr-1 text-gray-500" />
          {[profile.city_town, profile.parish?.name].filter(Boolean).join(', ')}
        </div>
      )}

      {/* Experience and Rate */}
      <div className="flex items-center justify-between text-sm text-gray-700 mb-4">
        <div className="flex items-center">
          <Award className="w-4 h-4 mr-1 text-gray-500" />
          {profile.display_experience}
        </div>
        <div className="flex items-center">
          <DollarSign className="w-4 h-4 mr-1 text-gray-500" />
          {profile.display_hourly_rate}
        </div>
      </div>

      {/* Contact Info */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-auto">
        <div className="flex space-x-4">
          {profile.phone && (
            <a
              href={`tel:${profile.phone}`}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              <Phone className="w-4 h-4 mr-1" />
              Call
            </a>
          )}
          {profile.website && (
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              <Globe className="w-4 h-4 mr-1" />
              Website
            </a>
          )}
        </div>
        <Link href={`/suppliers/${profile.id}`}>
          <Button size="sm">View Profile</Button>
        </Link>
      </div>
    </Card>
  );

  const Pagination = () => {
    const { current_page, total_pages, prev_page, next_page, total_count } =
      pagination;

    if (total_pages <= 1) return null;

    return (
      <div className="flex items-center justify-between mt-8">
        <p className="text-sm text-gray-700">
          Showing {(current_page - 1) * pagination.per_page + 1} to{' '}
          {Math.min(current_page * pagination.per_page, total_count)} of{' '}
          {total_count} results
        </p>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(prev_page!)}
            disabled={!prev_page}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          {/* Page Numbers */}
          {Array.from({ length: Math.min(5, total_pages) }, (_, i) => {
            let page;
            if (total_pages <= 5) {
              page = i + 1;
            } else if (current_page <= 3) {
              page = i + 1;
            } else if (current_page >= total_pages - 2) {
              page = total_pages - 4 + i;
            } else {
              page = current_page - 2 + i;
            }

            return (
              <Button
                key={page}
                variant={page === current_page ? 'default' : 'outline'}
                size="sm"
                onClick={() => goToPage(page)}
              >
                {page}
              </Button>
            );
          })}

          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(next_page!)}
            disabled={!next_page}
            className="flex items-center gap-1"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <AppLayout
      title={`Search Results ${searchQuery ? `for "${searchQuery}"` : ''}`}
    >
      <Head
        title={`Search Results ${searchQuery ? `for "${searchQuery}"` : ''}`}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {searchQuery
              ? `Search Results for "${searchQuery}"`
              : 'Browse Suppliers'}
          </h1>
          <p className="text-gray-600">
            Found {pagination.total_count} professional
            {pagination.total_count !== 1 ? 's' : ''}
            {hasActiveFilters && ' matching your criteria'}
          </p>
        </div>

        {/* Search and Filters Bar */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4 items-end">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search for services, skills, or company names..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant={showFilters ? 'default' : 'outline'}
                className="px-6 flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <Badge className="ml-2 bg-blue-100 text-blue-800">
                    {selectedSkills.length +
                      selectedAvailability.length +
                      selectedExperience.length +
                      (selectedParishId !== '' ? 1 : 0) +
                      (serviceRadiusKm !== '' && parseInt(serviceRadiusKm) > 0
                        ? 1
                        : 0)}
                  </Badge>
                )}
              </Button>
              <Button onClick={() => handleSearch()} className="px-6">
                Search
              </Button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="border-t border-gray-200 pt-4 mt-4 space-y-4">
                {/* Location Filter */}
                <div>
                  <Label className="text-sm font-semibold mb-3 flex items-center text-gray-700">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    Location
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      id="parish_id"
                      label="Parish"
                      value={selectedParishId}
                      onChange={(e) => setSelectedParishId(e.target.value)}
                      options={parish_options.map((p) => ({
                        label: p.label,
                        value: p.value.toString(),
                      }))}
                      placeholder="Select a parish"
                    />
                    <Input
                      id="service_radius_km"
                      label="Service Radius (km)"
                      type="number"
                      min="0"
                      max="500"
                      value={serviceRadiusKm}
                      onChange={(e) => setServiceRadiusKm(e.target.value)}
                      placeholder="E.g., 50"
                      hint="Distance from primary location"
                    />
                  </div>
                </div>

                {/* Skills Filter */}
                <div>
                  <SkillsMultiSelect
                    skillsByCategory={skills_by_category}
                    selectedSkills={selectedSkills}
                    onSkillsChange={setSelectedSkills}
                    label="Skills & Services"
                    hint="Filter by specific skills and services"
                  />
                </div>

                {/* Availability and Experience Filters */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold mb-2 flex items-center text-gray-700">
                      Availability
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {availability_options.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => toggleAvailability(option.value)}
                          className={`px-3 py-1 rounded-full border text-sm transition-colors duration-200 ${
                            selectedAvailability.includes(option.value)
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold mb-2 flex items-center text-gray-700">
                      Experience Level
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {experience_options.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => toggleExperience(option.value)}
                          className={`px-3 py-1 rounded-full border text-sm transition-colors duration-200 ${
                            selectedExperience.includes(option.value)
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Filter Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <Button onClick={() => handleSearch()} size="sm">
                    Apply Filters
                  </Button>
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    size="sm"
                    disabled={!hasActiveFilters}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {profiles.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>
            <Pagination />
          </>
        ) : (
          <Card className="text-center py-12 shadow-lg">
            <CardContent>
              <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No results found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or filters to find more
                results.
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
