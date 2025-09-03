import React, { useState, useMemo } from 'react';
import { ChevronDown, X, Search } from 'lucide-react';
import { Skill, SkillsCategory } from '../../types/profile';

interface SkillsMultiSelectProps {
  skills?: Skill[];
  skillsByCategory?: SkillsCategory;
  selectedSkillIds: number[];
  onSelectionChange: (skillIds: number[]) => void;
  label?: string;
  hint?: string;
  errors?: string[];
  maxSelections?: number;
}

export const SkillsMultiSelect: React.FC<SkillsMultiSelectProps> = ({
  skills = [],
  // skillsByCategory = {},
  selectedSkillIds = [],
  onSelectionChange,
  label = 'Skills & Services',
  hint = 'Select the skills and services you offer',
  errors = [],
  maxSelections = 10,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  // const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Get selected skills
  const selectedSkills = useMemo(() => {
    return skills.filter((skill) => selectedSkillIds.includes(skill.id));
  }, [skills, selectedSkillIds]);

  // Filter skills by search term
  const filteredSkills = useMemo(() => {
    if (!searchTerm) return skills;
    return skills.filter(
      (skill) =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [skills, searchTerm]);

  // Group filtered skills by category
  const filteredByCategory = useMemo(() => {
    const grouped: SkillsCategory = {};
    filteredSkills.forEach((skill) => {
      if (!grouped[skill.category]) {
        grouped[skill.category] = [];
      }
      grouped[skill.category].push(skill);
    });
    return grouped;
  }, [filteredSkills]);

  // Get category color classes
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

  const handleSkillToggle = (skill: Skill) => {
    const isSelected = selectedSkillIds.includes(skill.id);
    let newSelection: number[];

    if (isSelected) {
      newSelection = selectedSkillIds.filter((id) => id !== skill.id);
    } else {
      if (selectedSkillIds.length >= maxSelections) {
        return; // Don't add more than max selections
      }
      newSelection = [...selectedSkillIds, skill.id];
    }

    onSelectionChange(newSelection);
  };

  const handleRemoveSkill = (skillId: number) => {
    const newSelection = selectedSkillIds.filter((id) => id !== skillId);
    onSelectionChange(newSelection);
  };

  // const categories = Object.keys(skillsByCategory).sort();

  return (
    <div className="space-y-2">
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}

      {/* Selected Skills Display */}
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-md border">
          {selectedSkills.map((skill) => (
            <div
              key={skill.id}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs border ${getCategoryColorClasses(skill.category_color)}`}
            >
              <span>{skill.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill.id)}
                className="hover:bg-black/10 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Dropdown Trigger */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3 py-2 border border-border rounded-md bg-background hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
        >
          <span className="text-sm text-muted-foreground">
            {selectedSkills.length > 0
              ? `${selectedSkills.length} skill${selectedSkills.length !== 1 ? 's' : ''} selected`
              : 'Select your skills and services'}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Dropdown Panel */}
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-96 overflow-hidden">
            {/* Search Input */}
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Skills List */}
            <div className="max-h-80 overflow-y-auto">
              {Object.keys(filteredByCategory).length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  No skills found matching &quot;{searchTerm}&quot;
                </div>
              ) : (
                Object.entries(filteredByCategory).map(
                  ([category, categorySkills]) => (
                    <div key={category}>
                      {/* Category Header */}
                      <div className="sticky top-0 bg-muted/50 px-3 py-2 border-b border-border">
                        <h4 className="font-medium text-sm text-foreground">
                          {category}
                        </h4>
                      </div>

                      {/* Category Skills */}
                      <div className="divide-y divide-border">
                        {categorySkills.map((skill) => {
                          const isSelected = selectedSkillIds.includes(
                            skill.id
                          );
                          const isMaxReached =
                            selectedSkillIds.length >= maxSelections &&
                            !isSelected;

                          return (
                            <button
                              key={skill.id}
                              type="button"
                              onClick={() => handleSkillToggle(skill)}
                              disabled={isMaxReached}
                              className={`w-full text-left px-3 py-3 hover:bg-muted/50 focus:bg-muted/50 focus:outline-none transition-colors ${
                                isSelected
                                  ? 'bg-primary/10 border-l-2 border-primary'
                                  : ''
                              } ${isMaxReached ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="font-medium text-sm text-foreground">
                                    {skill.name}
                                  </div>
                                  {skill.description && (
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {skill.description}
                                    </div>
                                  )}
                                </div>
                                {isSelected && (
                                  <div className="ml-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )
                )
              )}
            </div>

            {/* Footer with selection count */}
            <div className="p-3 border-t border-border bg-muted/50">
              <div className="text-xs text-muted-foreground text-center">
                {selectedSkillIds.length} of {maxSelections} skills selected
                {selectedSkillIds.length >= maxSelections && (
                  <span className="text-amber-600 ml-1">(Maximum reached)</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hint */}
      {hint && <p className="text-sm text-muted-foreground">{hint}</p>}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-red-600">
              {error}
            </p>
          ))}
        </div>
      )}

      {/* Click outside handler */}
      {isOpen && (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
        <div className="fixed inset-0 z-0" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};
