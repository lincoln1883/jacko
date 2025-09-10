import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MapPin, Clock } from 'lucide-react';
import { SkillsMultiSelect } from '@/components/ui/skills-multi-select';

interface Skill {
  id: number;
  name: string;
  description?: string;
}

interface SkillsByCategory {
  [category: string]: Skill[];
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

interface SearchIndexProps {
  skills_by_category: SkillsByCategory;
  availability_options: AvailabilityOption[];
  experience_options: ExperienceOption[];
}

export default function SearchIndex({
  skills_by_category,
  availability_options,
  experience_options,
}: SearchIndexProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>(
    []
  );
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
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

    router.get(`/search/tradespeople?${searchParams.toString()}`);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSkills([]);
    setSelectedAvailability([]);
    setSelectedExperience([]);
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
    selectedExperience.length > 0;

  return (
    <AppLayout title="Find Skilled Tradespeople">
      <Head title="Find Skilled Tradespeople" />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Skilled Tradespeople in Jamaica
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with verified professionals across construction, technology,
            beauty, and more. Find the right expertise for your project.
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 mb-8">
          {/* Main Search Bar */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for services, skills, or company names..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant={showFilters ? 'default' : 'outline'}
              size="lg"
              className="px-6"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <Badge className="ml-2 bg-blue-100 text-blue-800">
                  {selectedSkills.length +
                    selectedAvailability.length +
                    selectedExperience.length}
                </Badge>
              )}
            </Button>
            <Button onClick={handleSearch} size="lg" className="px-8">
              Search
            </Button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="border-t pt-6 space-y-6">
              {/* Skills Filter */}
              <div>
                <SkillsMultiSelect
                  skillsByCategory={skills_by_category}
                  selectedSkills={selectedSkills}
                  onSkillsChange={setSelectedSkills}
                  label="Skills & Services"
                  hint="Select the skills and services you need"
                />
              </div>

              {/* Availability Filter */}
              <div>
                <Label className="text-sm font-semibold mb-3 block flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Availability
                </Label>
                <div className="flex flex-wrap gap-2">
                  {availability_options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => toggleAvailability(option.value)}
                      className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                        selectedAvailability.includes(option.value)
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full inline-block mr-2 bg-${option.color}-500`}
                      ></div>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience Filter */}
              <div>
                <Label className="text-sm font-semibold mb-3 block flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Experience Level
                </Label>
                <div className="flex flex-wrap gap-2">
                  {experience_options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => toggleExperience(option.value)}
                      className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                        selectedExperience.includes(option.value)
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button onClick={handleSearch} className="flex-1">
                  Apply Filters
                </Button>
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  disabled={!hasActiveFilters}
                >
                  Clear All
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Skill Categories */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Popular Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(skills_by_category)
              .slice(0, 8)
              .map(([category, skills]) => (
                <button
                  key={category}
                  onClick={() => {
                    const categorySkillIds = skills.map((skill) => skill.id);
                    setSelectedSkills(categorySkillIds);
                    handleSearch();
                  }}
                  className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-center"
                >
                  <h3 className="font-medium text-gray-900 mb-2">{category}</h3>
                  <p className="text-sm text-gray-600">
                    {skills.length} skills
                  </p>
                </button>
              ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
