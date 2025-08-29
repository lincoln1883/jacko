import { describe, it, expect } from 'vitest';
import { cn } from '../../lib/utils';

describe('Utils', () => {
  describe('cn function (className merger)', () => {
    it('merges simple class names', () => {
      const result = cn('class1', 'class2');
      expect(result).toBe('class1 class2');
    });

    it('handles conditional classes with clsx', () => {
      const result = cn('base', { conditional: true, hidden: false });
      expect(result).toBe('base conditional');
    });

    it('resolves Tailwind CSS conflicts', () => {
      const result = cn('bg-red-500', 'bg-blue-500');
      expect(result).toBe('bg-blue-500');
    });

    it('merges complex Tailwind classes correctly', () => {
      const result = cn(
        'px-4 py-2 bg-blue-500',
        'px-6 bg-red-500',
        'hover:bg-green-500'
      );
      expect(result).toBe('py-2 px-6 bg-red-500 hover:bg-green-500');
    });

    it('handles arrays of classes', () => {
      const result = cn(['class1', 'class2'], ['class3', 'class4']);
      expect(result).toBe('class1 class2 class3 class4');
    });

    it('handles undefined and null values gracefully', () => {
      const result = cn('class1', undefined, null, 'class2');
      expect(result).toBe('class1 class2');
    });

    it('handles empty inputs', () => {
      const result = cn();
      expect(result).toBe('');
    });

    it('handles empty string inputs', () => {
      const result = cn('', 'class1', '', 'class2');
      expect(result).toBe('class1 class2');
    });

    it('handles complex conditional logic', () => {
      const variant: string = 'primary';
      const size: string = 'lg';
      const disabled = true;

      const result = cn('base-class', {
        'bg-blue-500': variant === 'primary',
        'bg-gray-500': variant === 'secondary',
        'text-sm': size === 'sm',
        'text-lg': size === 'lg',
        'opacity-50': disabled,
        'cursor-not-allowed': disabled,
      });

      expect(result).toContain('base-class');
      expect(result).toContain('bg-blue-500');
      expect(result).toContain('text-lg');
      expect(result).toContain('opacity-50');
      expect(result).toContain('cursor-not-allowed');
      expect(result).not.toContain('bg-gray-500');
      expect(result).not.toContain('text-sm');
    });

    it('resolves Tailwind responsive class conflicts', () => {
      const result = cn('w-full md:w-1/2', 'w-auto md:w-1/3');
      // tailwind-merge correctly resolves conflicts - later classes override earlier ones
      expect(result).toBe('w-auto md:w-1/3');
    });

    it('resolves Tailwind state variant conflicts', () => {
      const result = cn(
        'hover:bg-red-500 focus:bg-blue-500',
        'hover:bg-green-500'
      );
      expect(result).toBe('focus:bg-blue-500 hover:bg-green-500');
    });

    it('handles mixed input types', () => {
      const result = cn(
        'base',
        { conditional: true },
        ['array1', 'array2'],
        undefined,
        'final-class'
      );
      expect(result).toBe('base conditional array1 array2 final-class');
    });

    it('works with component variant patterns', () => {
      const getButtonClasses = (
        variant: 'primary' | 'secondary',
        size: 'sm' | 'md' | 'lg',
        disabled?: boolean
      ) => {
        return cn(
          // Base classes
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          // Variant classes
          {
            'bg-primary text-primary-foreground hover:bg-primary/90':
              variant === 'primary',
            'bg-secondary text-secondary-foreground hover:bg-secondary/80':
              variant === 'secondary',
          },
          // Size classes
          {
            'h-8 px-3 text-xs': size === 'sm',
            'h-9 px-4 py-2': size === 'md',
            'h-10 px-8': size === 'lg',
          },
          // State classes
          {
            'disabled:pointer-events-none disabled:opacity-50': disabled,
          }
        );
      };

      const primaryButton = getButtonClasses('primary', 'md', false);
      expect(primaryButton).toContain('bg-primary');
      expect(primaryButton).toContain('h-9');
      expect(primaryButton).not.toContain('disabled:pointer-events-none');

      const disabledButton = getButtonClasses('secondary', 'sm', true);
      expect(disabledButton).toContain('bg-secondary');
      expect(disabledButton).toContain('h-8');
      expect(disabledButton).toContain('disabled:pointer-events-none');
    });

    it('preserves important modifiers', () => {
      const result = cn('!important-class', 'normal-class');
      expect(result).toBe('!important-class normal-class');
    });

    it('handles complex Tailwind utility conflicts', () => {
      // Test margin conflicts
      const marginResult = cn('m-4', 'mx-2', 'mt-8');
      expect(marginResult).toBe('m-4 mx-2 mt-8');

      // Test padding conflicts
      const paddingResult = cn('p-4', 'px-2');
      expect(paddingResult).toBe('p-4 px-2');

      // Test border radius conflicts
      const borderResult = cn('rounded-md', 'rounded-t-lg');
      expect(borderResult).toBe('rounded-md rounded-t-lg');
    });

    it('handles arbitrary value classes', () => {
      const result = cn('top-[117px]', 'top-4');
      expect(result).toBe('top-4');
    });

    it('handles dark mode variants', () => {
      const result = cn(
        'bg-white dark:bg-black',
        'text-black dark:text-white',
        'dark:bg-gray-900'
      );
      expect(result).toBe(
        'bg-white text-black dark:text-white dark:bg-gray-900'
      );
    });
  });

  describe('Edge cases and error handling', () => {
    it('handles very long class strings', () => {
      const longClass = 'a'.repeat(1000);
      const result = cn(longClass, 'short');
      expect(result).toContain(longClass);
      expect(result).toContain('short');
    });

    it('handles special characters in class names', () => {
      const result = cn(
        'class-with-dashes',
        'class_with_underscores',
        'class.with.dots'
      );
      expect(result).toBe(
        'class-with-dashes class_with_underscores class.with.dots'
      );
    });

    it('handles numeric class names', () => {
      const result = cn('w-1/2', 'h-96', '2xl:w-full');
      expect(result).toBe('w-1/2 h-96 2xl:w-full');
    });

    it('handles boolean values', () => {
      const result = cn('base', true && 'conditional', false && 'hidden');
      expect(result).toBe('base conditional');
    });
  });

  describe('Real-world usage scenarios', () => {
    it('works like shadcn/ui button component', () => {
      const buttonVariants = (
        variant: 'default' | 'destructive',
        size: 'default' | 'sm'
      ) => {
        const base =
          'inline-flex items-center justify-center rounded-md text-sm font-medium';
        const variants = {
          default: 'bg-primary text-primary-foreground hover:bg-primary/90',
          destructive:
            'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        };
        const sizes = {
          default: 'h-10 px-4 py-2',
          sm: 'h-9 rounded-md px-3',
        };

        return cn(base, variants[variant], sizes[size]);
      };

      const defaultButton = buttonVariants('default', 'default');
      expect(defaultButton).toContain('bg-primary');
      expect(defaultButton).toContain('h-10');

      const smallDestructiveButton = buttonVariants('destructive', 'sm');
      expect(smallDestructiveButton).toContain('bg-destructive');
      expect(smallDestructiveButton).toContain('h-9');
    });

    it('works with form input styling', () => {
      const inputClasses = (hasError: boolean, disabled: boolean) =>
        cn(
          'flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm',
          'ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          {
            'border-destructive focus-visible:ring-destructive': hasError,
            'border-input': !hasError,
          },
          disabled && 'bg-muted'
        );

      const normalInput = inputClasses(false, false);
      expect(normalInput).toContain('border-input');
      expect(normalInput).not.toContain('border-destructive');

      const errorInput = inputClasses(true, false);
      expect(errorInput).toContain('border-destructive');
      expect(errorInput).not.toContain('border-input');

      const disabledInput = inputClasses(false, true);
      expect(disabledInput).toContain('bg-muted');
    });
  });
});
