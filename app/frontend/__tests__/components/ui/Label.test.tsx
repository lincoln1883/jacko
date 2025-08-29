/* eslint-disable no-undef */
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Label } from '../../../components/ui/label';

describe('Label Component', () => {
  describe('Basic rendering', () => {
    it('renders a basic label', () => {
      render(<Label>Test Label</Label>);

      expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    it('renders with htmlFor attribute', () => {
      render(<Label htmlFor="test-input">Email Address</Label>);

      const label = screen.getByText('Email Address');
      expect(label).toHaveAttribute('for', 'test-input');
    });

    it('renders with custom className', () => {
      render(<Label className="custom-class">Custom Label</Label>);

      const label = screen.getByText('Custom Label');
      expect(label).toHaveClass('custom-class');
    });

    it('renders with all HTML label attributes', () => {
      render(
        <Label
          id="label-id"
          htmlFor="input-id"
          title="Label tooltip"
          data-testid="test-label"
        >
          Full Label
        </Label>
      );

      const label = screen.getByText('Full Label');
      expect(label).toHaveAttribute('id', 'label-id');
      expect(label).toHaveAttribute('for', 'input-id');
      expect(label).toHaveAttribute('title', 'Label tooltip');
      expect(label).toHaveAttribute('data-testid', 'test-label');
    });
  });

  describe('CSS classes and styling', () => {
    it('applies default CSS classes', () => {
      render(<Label>Default Styling</Label>);

      const label = screen.getByText('Default Styling');
      expect(label).toHaveClass(
        'text-sm',
        'font-medium',
        'leading-none',
        'peer-disabled:cursor-not-allowed',
        'peer-disabled:opacity-70'
      );
    });

    it('merges custom className with default classes', () => {
      render(<Label className="custom-color text-lg">Custom Styling</Label>);

      const label = screen.getByText('Custom Styling');
      expect(label).toHaveClass('custom-color', 'text-lg');
    });

    it('handles empty className gracefully', () => {
      render(<Label className="">Empty Class</Label>);

      const label = screen.getByText('Empty Class');
      expect(label).toHaveClass('text-sm', 'font-medium', 'leading-none');
    });

    it('handles undefined className', () => {
      render(<Label className={undefined}>Undefined Class</Label>);

      const label = screen.getByText('Undefined Class');
      expect(label).toHaveClass('text-sm', 'font-medium', 'leading-none');
    });
  });

  describe('Peer disabled styling', () => {
    it('includes peer-disabled classes for form field integration', () => {
      render(<Label>Peer Disabled Test</Label>);

      const label = screen.getByText('Peer Disabled Test');
      expect(label).toHaveClass(
        'peer-disabled:cursor-not-allowed',
        'peer-disabled:opacity-70'
      );
    });

    it('works correctly with disabled input peer', () => {
      render(
        <div>
          <input id="disabled-input" disabled className="peer" />
          <Label htmlFor="disabled-input">Disabled Input Label</Label>
        </div>
      );

      const input = screen.getByRole('textbox');
      const label = screen.getByText('Disabled Input Label');

      expect(input).toBeDisabled();
      expect(label).toHaveClass('peer-disabled:cursor-not-allowed');
    });
  });

  describe('Forward ref functionality', () => {
    it('forwards ref to label element correctly', () => {
      const ref = { current: null };

      render(<Label ref={ref as any}>Ref Test</Label>);

      expect(ref.current).toBeInstanceOf(HTMLLabelElement);
    });

    it('allows ref access to label properties', () => {
      let labelRef: HTMLLabelElement | null = null;

      render(
        <Label
          ref={(el) => {
            labelRef = el;
          }}
          htmlFor="test-input"
        >
          Reference Test
        </Label>
      );

      expect(labelRef).toBeInstanceOf(HTMLLabelElement);
      expect((labelRef as unknown as HTMLLabelElement)?.textContent).toBe(
        'Reference Test'
      );
      expect(
        (labelRef as unknown as HTMLLabelElement)?.getAttribute('for')
      ).toBe('test-input');
    });
  });

  describe('Content handling', () => {
    it('renders simple text content', () => {
      render(<Label>Simple Text</Label>);

      expect(screen.getByText('Simple Text')).toBeInTheDocument();
    });

    it('renders complex children structure', () => {
      render(
        <Label>
          <span>Required</span>
          <span className="text-red-500"> *</span>
        </Label>
      );

      expect(screen.getByText('Required')).toBeInTheDocument();
      const asterisk = screen.getByText('*');
      expect(asterisk).toHaveClass('text-red-500');
    });

    it('handles React elements as children', () => {
      const icon = <svg data-testid="label-icon" />;

      render(
        <Label>
          {icon}
          Label with Icon
        </Label>
      );

      expect(screen.getByTestId('label-icon')).toBeInTheDocument();
      expect(screen.getByText('Label with Icon')).toBeInTheDocument();
    });

    it('handles empty children gracefully', () => {
      render(<Label>{undefined}</Label>);

      const label = document.querySelector('label');
      expect(label).toBeInTheDocument();
    });

    it('handles long text content', () => {
      const longText =
        'This is a very long label text that should wrap properly and maintain readability';

      render(<Label>{longText}</Label>);

      expect(screen.getByText(longText)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('maintains proper label semantics', () => {
      render(<Label htmlFor="input-field">Accessible Label</Label>);

      const label = screen.getByText('Accessible Label');
      expect(label.tagName).toBe('LABEL');
      expect(label).toHaveAttribute('for', 'input-field');
    });

    it('associates correctly with form controls', () => {
      render(
        <div>
          <Label htmlFor="email-input">Email Address</Label>
          <input id="email-input" type="email" />
        </div>
      );

      const label = screen.getByText('Email Address');
      const input = screen.getByRole('textbox');

      expect(label).toHaveAttribute('for', 'email-input');
      expect(input).toHaveAttribute('id', 'email-input');
      expect(input).toHaveAccessibleName('Email Address');
    });

    it('supports aria attributes for enhanced accessibility', () => {
      render(
        <Label htmlFor="password-input" aria-describedby="password-help">
          Password
        </Label>
      );

      const label = screen.getByText('Password');
      expect(label).toHaveAttribute('aria-describedby', 'password-help');
    });

    it('works with screen reader requirements', () => {
      render(
        <form>
          <Label htmlFor="required-field">
            Required Field
            <span aria-label="required" role="img">
              *
            </span>
          </Label>
          <input id="required-field" required />
        </form>
      );

      const label = screen.getByText(/Required Field/);
      const asterisk = screen.getByRole('img', { name: 'required' });
      const input = screen.getByRole('textbox');

      expect(label).toBeInTheDocument();
      expect(asterisk).toBeInTheDocument();
      expect(input).toBeRequired();
    });
  });

  describe('Form integration', () => {
    it('works within form context', () => {
      render(
        <form>
          <Label htmlFor="username">Username</Label>
          <input id="username" name="username" type="text" />
          <button type="submit">Submit</button>
        </form>
      );

      const label = screen.getByText('Username');
      const input = screen.getByLabelText('Username');

      expect(label).toBeInTheDocument();
      expect(input).toHaveAttribute('name', 'username');
    });

    it('handles multiple labels in form', () => {
      render(
        <form>
          <Label htmlFor="first-name">First Name</Label>
          <input id="first-name" type="text" />

          <Label htmlFor="last-name">Last Name</Label>
          <input id="last-name" type="text" />
        </form>
      );

      expect(screen.getByLabelText('First Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    });

    it('supports fieldset and legend context', () => {
      render(
        <form>
          <fieldset>
            <legend>Personal Information</legend>
            <Label htmlFor="user-email">Email</Label>
            <input id="user-email" type="email" />
          </fieldset>
        </form>
      );

      const fieldset = screen.getByRole('group', {
        name: 'Personal Information',
      });
      const label = screen.getByText('Email');
      const input = screen.getByLabelText('Email');

      expect(fieldset).toContainElement(label);
      expect(fieldset).toContainElement(input);
    });
  });

  describe('Radix UI integration', () => {
    it('uses Radix Label primitive correctly', () => {
      render(<Label htmlFor="radix-input">Radix Label</Label>);

      const label = screen.getByText('Radix Label');
      // Verify it's using the Radix primitive (it should have the proper display name)
      expect(label.tagName).toBe('LABEL');
    });

    it('maintains Radix accessibility features', () => {
      render(
        <div>
          <Label htmlFor="radix-field">Radix Field</Label>
          <input
            id="radix-field"
            type="text"
            aria-describedby="field-description"
          />
          <div id="field-description">Field description</div>
        </div>
      );

      const input = screen.getByLabelText('Radix Field');
      expect(input).toHaveAttribute('aria-describedby', 'field-description');
    });
  });

  describe('Edge cases', () => {
    it('handles special characters in content', () => {
      const specialText = 'Label with special chars: <>&"\'';

      render(<Label>{specialText}</Label>);

      expect(screen.getByText(specialText)).toBeInTheDocument();
    });

    it('handles numeric content', () => {
      render(<Label htmlFor="quantity">Quantity: {42}</Label>);

      expect(screen.getByText(/Quantity: 42/)).toBeInTheDocument();
    });

    it('handles boolean props correctly', () => {
      render(
        <Label htmlFor="test" hidden={false} aria-hidden={false}>
          Boolean Props Test
        </Label>
      );

      const label = screen.getByText('Boolean Props Test');
      expect(label).not.toHaveAttribute('hidden');
      expect(label).toHaveAttribute('aria-hidden', 'false');
    });

    it('handles undefined and null props gracefully', () => {
      render(
        <Label htmlFor={undefined} className={undefined} id={null as any}>
          Null Props Test
        </Label>
      );

      const label = screen.getByText('Null Props Test');
      expect(label).toBeInTheDocument();
    });
  });

  describe('Performance considerations', () => {
    it('does not cause unnecessary re-renders with static props', () => {
      const { rerender } = render(<Label htmlFor="stable">Stable Label</Label>);

      // Re-render with same props
      rerender(<Label htmlFor="stable">Stable Label</Label>);

      expect(screen.getByText('Stable Label')).toBeInTheDocument();
    });

    it('handles dynamic prop updates correctly', () => {
      const { rerender } = render(
        <Label htmlFor="input-1">Original Label</Label>
      );

      expect(screen.getByText('Original Label')).toHaveAttribute(
        'for',
        'input-1'
      );

      rerender(<Label htmlFor="input-2">Updated Label</Label>);

      expect(screen.getByText('Updated Label')).toHaveAttribute(
        'for',
        'input-2'
      );
    });
  });
});
