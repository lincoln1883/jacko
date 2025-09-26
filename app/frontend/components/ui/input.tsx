import * as React from 'react';

import { cn } from '../../lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errors?: string[];
  hint?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, errors, hint, ...props }, ref) => {
    const hasErrors = errors && errors.length > 0;
    const inputId = props.id || Math.random().toString(36);

    if (label) {
      return (
        <div className="space-y-2">
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
          <input
            type={type}
            className={cn(
              'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50',
              hasErrors && 'border-red-500 focus-visible:ring-red-500',
              className
            )}
            ref={ref}
            id={inputId}
            {...props}
          />
          {hint && !hasErrors && (
            <p className="text-sm text-gray-500 mt-1">{hint}</p>
          )}
          {hasErrors && (
            <div className="space-y-1 mt-1">
              {errors.map((error, index) => (
                <p key={index} className="text-sm text-red-500">
                  {error}
                </p>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50',
          hasErrors && 'border-red-500 focus-visible:ring-red-500',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
