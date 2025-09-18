/* eslint-disable no-undef */
import * as React from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { X } from 'lucide-react';

import { Badge } from './badge';
import { Command, CommandGroup, CommandItem } from './command';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { Label } from './label';

type MultiSelectProps = {
  options: { label: string; value: string }[];
  selectedOptions: { label: string; value: string }[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  label?: string;
  hint?: string;
  errors?: string[];
};

export const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
  (
    {
      options,
      selectedOptions,
      onValueChange,
      placeholder,
      label,
      hint,
      errors,
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState('');

    const handleUnselect = React.useCallback(
      (option: { label: string; value: string }) => {
        const newSelectedValues = selectedOptions
          .filter((item) => item.value !== option.value)
          .map((item) => item.value);
        onValueChange(newSelectedValues);
      },
      [onValueChange, selectedOptions]
    );

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        const input = inputRef.current;
        if (input) {
          if (e.key === 'Delete' || e.key === 'Backspace') {
            if (input.value === '') {
              const newSelected = [...selectedOptions];
              newSelected.pop();
              onValueChange(newSelected.map((item) => item.value));
            }
          }
          // This is not a default behaviour of the Combobox, so the event should be stopped.
          // keyboard navigation should be handled by translucent popover.
          if (e.key === 'Escape') {
            e.preventDefault();
          }
        }
      },
      [onValueChange, selectedOptions]
    );

    const selectables = options.filter(
      (option) =>
        !selectedOptions.some((selected) => selected.value === option.value)
    );

    return (
      <div className="grid gap-2" ref={ref}>
        {label && <Label>{label}</Label>}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={`w-full justify-between h-auto min-h-10 ${errors && errors.length > 0 ? 'border-destructive' : ''}`}
              onClick={() => inputRef.current?.focus()}
            >
              <div className="flex flex-wrap gap-1 w-full">
                {selectedOptions.map((option) => {
                  return (
                    <Badge
                      key={option.value}
                      variant="secondary"
                      className="pr-1"
                    >
                      {option.label}
                      <button
                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleUnselect(option);
                          }
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleUnselect(option);
                        }}
                      >
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </button>
                    </Badge>
                  );
                })}
                {/* Placeholder for when no options are selected */}
                {selectedOptions.length === 0 && (placeholder || 'Select...')}
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command onKeyDown={handleKeyDown} className="overflow-visible">
              <CommandPrimitive.Input
                ref={inputRef}
                value={inputValue}
                onValueChange={setInputValue}
                placeholder={
                  selectedOptions.length > 0 ? 'Add more...' : placeholder
                }
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <CommandGroup className="max-h-[300px] overflow-y-auto">
                {selectables.map((option) => {
                  return (
                    <CommandItem
                      key={option.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => {
                        setInputValue('');
                        onValueChange([
                          ...selectedOptions.map((o) => o.value),
                          option.value,
                        ]);
                      }}
                      className="cursor-pointer"
                    >
                      {option.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        {hint && <p className="text-sm text-muted-foreground mt-1">{hint}</p>}
        {errors && errors.length > 0 && (
          <p className="text-sm text-destructive mt-1">{errors[0]}</p>
        )}
      </div>
    );
  }
);

MultiSelect.displayName = 'MultiSelect';
