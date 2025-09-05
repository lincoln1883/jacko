import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Textarea } from '../../../components/ui/textarea';

describe('Textarea Component', () => {
  describe('Basic rendering', () => {
    it('renders a basic textarea', () => {
      render(<Textarea />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
      expect(textarea.tagName).toBe('TEXTAREA');
    });

    it('renders with placeholder text', () => {
      render(<Textarea placeholder="Enter your message" />);

      expect(
        screen.getByPlaceholderText('Enter your message')
      ).toBeInTheDocument();
    });

    it('renders with default value', () => {
      render(<Textarea defaultValue="Default content" />);

      expect(screen.getByDisplayValue('Default content')).toBeInTheDocument();
    });

    it('renders with controlled value', () => {
      const handleChange = vi.fn();
      render(<Textarea value="Controlled content" onChange={handleChange} />);

      expect(
        screen.getByDisplayValue('Controlled content')
      ).toBeInTheDocument();
    });
  });

  describe('HTML attributes', () => {
    it('applies id attribute', () => {
      render(<Textarea id="message-textarea" />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('id', 'message-textarea');
    });

    it('applies name attribute', () => {
      render(<Textarea name="message" />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('name', 'message');
    });

    it('applies rows attribute', () => {
      render(<Textarea rows={5} />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('rows', '5');
    });

    it('applies cols attribute', () => {
      render(<Textarea cols={50} />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('cols', '50');
    });

    it('applies maxLength attribute', () => {
      render(<Textarea maxLength={100} />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('maxLength', '100');
    });

    it('applies custom data attributes', () => {
      render(<Textarea data-testid="custom-textarea" data-custom="value" />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('data-testid', 'custom-textarea');
      expect(textarea).toHaveAttribute('data-custom', 'value');
    });
  });

  describe('States', () => {
    it('can be disabled', () => {
      render(<Textarea disabled />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeDisabled();
    });

    it('can be readonly', () => {
      render(<Textarea readOnly />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('readonly');
    });

    it('can be required', () => {
      render(<Textarea required />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeRequired();
    });
  });

  describe('User interactions', () => {
    it('handles onChange events correctly', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<Textarea onChange={handleChange} />);

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Hello world');

      expect(handleChange).toHaveBeenCalled();
      expect(textarea).toHaveValue('Hello world');
    });

    it('handles onFocus events', async () => {
      const handleFocus = vi.fn();
      const user = userEvent.setup();

      render(<Textarea onFocus={handleFocus} />);

      const textarea = screen.getByRole('textbox');
      await user.click(textarea);

      expect(handleFocus).toHaveBeenCalled();
    });

    it('handles onBlur events', async () => {
      const handleBlur = vi.fn();
      const user = userEvent.setup();

      render(
        <div>
          <Textarea onBlur={handleBlur} />
          <button>Other element</button>
        </div>
      );

      const textarea = screen.getByRole('textbox');
      const button = screen.getByRole('button');

      await user.click(textarea);
      await user.click(button);

      expect(handleBlur).toHaveBeenCalled();
    });

    it('handles keyboard events', async () => {
      const handleKeyDown = vi.fn();
      const user = userEvent.setup();

      render(<Textarea onKeyDown={handleKeyDown} />);

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, '{enter}');

      expect(handleKeyDown).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA role', () => {
      render(<Textarea />);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('supports aria-label', () => {
      render(<Textarea aria-label="Message content" />);

      const textarea = screen.getByLabelText('Message content');
      expect(textarea).toBeInTheDocument();
    });

    it('supports aria-describedby', () => {
      render(
        <div>
          <Textarea aria-describedby="help-text" />
          <div id="help-text">Help text content</div>
        </div>
      );

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-describedby', 'help-text');
    });

    it('supports aria-invalid for validation states', () => {
      render(<Textarea aria-invalid="true" />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('CSS classes and styling', () => {
    it('applies default CSS classes', () => {
      render(<Textarea />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('flex', 'min-h-[60px]', 'w-full');
    });

    it('merges custom className with defaults', () => {
      render(<Textarea className="custom-class" />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('custom-class');
      expect(textarea).toHaveClass('flex', 'min-h-[60px]', 'w-full');
    });
  });

  describe('Form integration', () => {
    it('works within form context', async () => {
      const handleSubmit = vi.fn((e) => e.preventDefault());
      const user = userEvent.setup();

      render(
        <form onSubmit={handleSubmit}>
          <Textarea name="message" />
          <button type="submit">Submit</button>
        </form>
      );

      const textarea = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: /submit/i });

      await user.type(textarea, 'Form message');
      await user.click(submitButton);

      expect(handleSubmit).toHaveBeenCalled();
      expect(textarea).toHaveValue('Form message');
    });

    it('supports form validation', () => {
      render(
        <form>
          <Textarea name="message" required minLength={10} />
        </form>
      );

      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeRequired();
      expect(textarea).toHaveAttribute('minLength', '10');
    });
  });

  describe('Edge cases', () => {
    it('handles empty value', () => {
      render(<Textarea value="" onChange={vi.fn()} />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveValue('');
    });

    it('handles undefined value gracefully', () => {
      render(<Textarea value={undefined} />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
    });

    it('handles null value gracefully', () => {
      render(<Textarea value={null as any} />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('does not re-render unnecessarily with same props', () => {
      const { rerender } = render(<Textarea value="test" />);

      const textarea = screen.getByRole('textbox');
      const initialElement = textarea;

      rerender(<Textarea value="test" />);

      expect(screen.getByRole('textbox')).toBe(initialElement);
    });
  });
});
