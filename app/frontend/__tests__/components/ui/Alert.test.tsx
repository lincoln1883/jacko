import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Alert, AlertTitle, AlertDescription } from '../../../components/ui/alert';

describe('Alert Component', () => {
  describe('Basic rendering', () => {
    it('renders alert with role', () => {
      render(<Alert>Content</Alert>);
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent('Content');
    });

    it('renders with title and description', () => {
      render(
        <Alert>
          <AlertTitle>Title</AlertTitle>
          <AlertDescription>Description text</AlertDescription>
        </Alert>
      );
      expect(screen.getByText('Title').tagName).toBe('H5');
      expect(screen.getByText('Description text')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('applies default variant classes', () => {
      render(<Alert>Default</Alert>);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('bg-background', 'text-foreground');
    });

    it('applies destructive variant classes', () => {
      render(<Alert variant="destructive">Destructive</Alert>);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('border-destructive/50', 'text-destructive');
    });

    it('applies success variant classes', () => {
      render(<Alert variant="success">Success</Alert>);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('border-green-500/50', 'text-green-700');
    });
  });

  describe('Styling and structure', () => {
    it('has base layout classes', () => {
      render(<Alert>Layout</Alert>);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('relative', 'w-full', 'rounded-lg', 'border', 'px-4', 'py-3', 'text-sm');
    });

    it('supports custom className', () => {
      render(<Alert className="custom">Class Test</Alert>);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('custom');
    });
  });
});

