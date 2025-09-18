import React from 'react';
import { MultiSelect } from './multi-select'; // Assuming a generic multi-select component
import { SelectOption, Parish } from '../../types/profile';

interface AdditionalParishesMultiSelectProps {
  parishes: Parish[];
  selectedParishIds: number[];
  onSelectionChange: (selectedIds: number[]) => void;
  label?: string;
  hint?: string;
  errors?: string[];
}

export const AdditionalParishesMultiSelect: React.FC<
  AdditionalParishesMultiSelectProps
> = ({
  parishes,
  selectedParishIds,
  onSelectionChange,
  label = 'Additional Service Parishes',
  hint = 'Select other parishes you are willing to serve (optional)',
  errors,
}) => {
  const options: SelectOption[] = parishes.map((parish) => ({
    label: parish.name,
    value: parish.id.toString(),
  }));

  const handleValueChange = (values: string[]) => {
    onSelectionChange(values.map(Number));
  };

  const selectedOptions = options.filter((option) =>
    selectedParishIds.includes(Number(option.value))
  );

  return (
    <MultiSelect
      label={label}
      options={options}
      selectedOptions={selectedOptions}
      onValueChange={handleValueChange}
      hint={hint}
      errors={errors}
      placeholder="Select additional parishes"
    />
  );
};
