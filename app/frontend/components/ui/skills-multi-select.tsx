import React, { useState, useMemo } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';
import { Skill, SkillsCategory } from '../../types/profile';

interface SearchSkill {
  id: number;
  name: string;
  description?: string;
}

interface SearchSkillsByCategory {
  [category: string]: SearchSkill[];
}

interface SkillsMultiSelectProps {
  // Legacy profile props
  skills?: Skill[];
  skillsByCategory?: SkillsCategory | SearchSkillsByCategory;
  selectedSkillIds?: number[];
  onSelectionChange?: (skillIds: number[]) => void;
  // New search props
  selectedSkills?: number[];
  onSkillsChange?: (skillIds: number[]) => void;
  label?: string;
  hint?: string;
  errors?: string[];
  maxSelections?: number;
  placeholder?: string;
}

export const SkillsMultiSelect: React.FC<SkillsMultiSelectProps> = ({
  skills = [],
  skillsByCategory = {},
  selectedSkillIds,
  selectedSkills,
  onSelectionChange,
  onSkillsChange,
  label = 'Skills & Services',
  hint = 'Select the skills and services you offer',
  errors = [],
  maxSelections = 10,
  placeholder = 'Select options...',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Handle different prop interfaces (legacy profile vs search)
  const currentSelectedSkillIds = useMemo(
    () => selectedSkillIds || selectedSkills || [],
    [selectedSkillIds, selectedSkills]
  );
  const currentOnSelectionChange =
    onSelectionChange || onSkillsChange || (() => {});

  // Convert skillsByCategory to skills array if needed
  const allSkills = useMemo(() => {
    if (skills.length > 0) {
      return skills;
    }
    // Convert skillsByCategory to flat skills array
    const convertedSkills: Skill[] = [];
    const categoryColors: { [key: string]: string } = {
      'Construction & Building': 'orange',
      'Electrical & Electronics': 'yellow',
      'Plumbing & HVAC': 'blue',
      'Automotive & Transportation': 'red',
      'Information Technology': 'purple',
      'Beauty & Personal Care': 'pink',
      'Food Service & Hospitality': 'green',
      'Agriculture & Landscaping': 'emerald',
      'Home Services & Maintenance': 'gray',
      'Manufacturing & Craft': 'amber',
      'Health & Wellness': 'cyan',
      'Creative & Media': 'indigo',
    };

    Object.entries(skillsByCategory).forEach(([category, categorySkills]) => {
      categorySkills.forEach((skill: SearchSkill) => {
        convertedSkills.push({
          id: skill.id,
          name: skill.name,
          description: skill.description || '',
          category: category,
          category_color: categoryColors[category] || 'blue',
        });
      });
    });
    return convertedSkills;
  }, [skills, skillsByCategory]);

  // Get selected skills
  const selectedSkillObjects = useMemo(() => {
    return allSkills.filter((skill) =>
      currentSelectedSkillIds.includes(skill.id)
    );
  }, [allSkills, currentSelectedSkillIds]);

  // Use all skills without filtering
  const filteredSkills = allSkills;

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

  const handleSkillToggle = (skill: Skill) => {
    const isSelected = currentSelectedSkillIds.includes(skill.id);
    let newSelection: number[];

    if (isSelected) {
      newSelection = currentSelectedSkillIds.filter((id) => id !== skill.id);
    } else {
      if (currentSelectedSkillIds.length >= maxSelections) {
        return; // Don't add more than max selections
      }
      newSelection = [...currentSelectedSkillIds, skill.id];
    }

    currentOnSelectionChange(newSelection);
  };

  const handleRemoveSkill = (skillId: number) => {
    const newSelection = currentSelectedSkillIds.filter((id) => id !== skillId);
    currentOnSelectionChange(newSelection);
  };

  // const categories = Object.keys(skillsByCategory).sort();

  return (
    <div className="w-full space-y-2">
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      {/* Main Container */}
      <div className="relative">
        {/* Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <div className="flex flex-wrap gap-1">
            {selectedSkillObjects.length > 0 ? (
              selectedSkillObjects.map((skill) => (
                <span
                  key={skill.id}
                  className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-900"
                >
                  {skill.name}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveSkill(skill.id);
                    }}
                    className="ml-1 h-3 w-3 rounded-full hover:bg-blue-200 flex items-center justify-center"
                  >
                    <X className="h-2 w-2" />
                  </button>
                </span>
              ))
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
          </div>
          <ChevronDown
            className={`h-4 w-4 opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
              role="presentation"
            />

            {/* Dropdown Content */}
            <div className="absolute top-full z-50 mt-1 max-h-60 w-full overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
              <div className="max-h-60 overflow-auto p-1">
                {Object.entries(filteredByCategory).map(
                  ([category, categorySkills]) => (
                    <div key={category}>
                      {/* Category Header */}
                      <div className="px-2 py-1.5 text-sm font-semibold text-gray-900">
                        {category}
                      </div>

                      {/* Skills in Category */}
                      {categorySkills.map((skill) => {
                        const isSelected = currentSelectedSkillIds.includes(
                          skill.id
                        );
                        const isDisabled =
                          !isSelected &&
                          currentSelectedSkillIds.length >= maxSelections;

                        return (
                          <div
                            key={skill.id}
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isDisabled) {
                                handleSkillToggle(skill);
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                if (!isDisabled) {
                                  handleSkillToggle(skill);
                                }
                              }
                            }}
                            className={`relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none ${
                              isDisabled
                                ? 'cursor-not-allowed opacity-50'
                                : 'cursor-pointer hover:bg-gray-100 focus:bg-gray-100'
                            } ${isSelected ? 'bg-blue-100 text-blue-900' : ''}`}
                          >
                            <div className="flex items-center space-x-2">
                              <div
                                className={`flex h-4 w-4 items-center justify-center rounded border ${
                                  isSelected
                                    ? 'border-blue-600 bg-blue-600'
                                    : 'border-gray-300'
                                }`}
                              >
                                {isSelected && (
                                  <Check className="h-3 w-3 text-white" />
                                )}
                              </div>
                              <span className="flex-1">{skill.name}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Hint */}
      {hint && <p className="text-sm text-gray-500">{hint}</p>}

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
    </div>
  );
};
