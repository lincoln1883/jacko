/* eslint-disable no-undef */
import * as React from 'react';

import { cn } from '../../lib/utils';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  errors?: string[];
  hint?: string;
  options: SelectOption[] | [string, string][];
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, errors, hint, options, placeholder, ...props }, ref) => {
    const hasErrors = errors && errors.length > 0;
    const selectId = props.id || Math.random().toString(36);

    // Normalize options to ensure consistent format
    const normalizedOptions = options.map((option) => {
      if (Array.isArray(option)) {
        return { label: option[0], value: option[1] };
      }
      return option;
    });

    const selectElement = (
      <select
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          hasErrors && 'border-destructive focus-visible:ring-destructive',
          className
        )}
        ref={ref}
        id={selectId}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {normalizedOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );

    if (label) {
      return (
        <div className="space-y-2">
          <label
            htmlFor={selectId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
          {selectElement}
          {hint && !hasErrors && (
            <p className="text-sm text-muted-foreground">{hint}</p>
          )}
          {hasErrors && (
            <div className="space-y-1">
              {errors.map((error, index) => (
                <p key={index} className="text-sm text-destructive">
                  {error}
                </p>
              ))}
            </div>
          )}
        </div>
      );
    }

    return selectElement;
  }
);
Select.displayName = 'Select';

export { Select };
