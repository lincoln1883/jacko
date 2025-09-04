import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Select, SelectOption } from '../../../components/ui/select';

describe('Select Component', () => {
  // Test data
  const testOptions: SelectOption[] = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
  ];

  const colorOptions: SelectOption[] = [
    { label: 'Choose an option', value: '' },
    { label: 'Red', value: 'red' },
    { label: 'Green', value: 'green' },
    { label: 'Blue', value: 'blue' },
  ];

  describe('Basic rendering', () => {
    it('renders a basic select element', () => {
      render(<Select options={testOptions} />);

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      expect(select.tagName).toBe('SELECT');
    });

    it('renders with multiple options', () => {
      render(<Select options={colorOptions} />);

      const select = screen.getByRole('combobox');
      const options = screen.getAllByRole('option');

      expect(select).toBeInTheDocument();
      expect(options).toHaveLength(4);
      expect(options[0]).toHaveTextContent('Choose an option');
      expect(options[1]).toHaveTextContent('Red');
      expect(options[2]).toHaveTextContent('Green');
      expect(options[3]).toHaveTextContent('Blue');
    });

    it('renders with default selected value', () => {
      render(
        <Select
          options={[
            { label: 'Red', value: 'red' },
            { label: 'Green', value: 'green' },
            { label: 'Blue', value: 'blue' },
          ]}
          defaultValue="green"
        />
      );

      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.value).toBe('green');
      expect(
        screen.getByRole('option', { name: 'Green', selected: true })
      ).toBeInTheDocument();
    });

    it('renders with controlled value', () => {
      const handleChange = vi.fn();
      render(
        <Select
          options={[
            { label: 'Red', value: 'red' },
            { label: 'Green', value: 'green' },
            { label: 'Blue', value: 'blue' },
          ]}
          value="blue"
          onChange={handleChange}
        />
      );

      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.value).toBe('blue');
      expect(
        screen.getByRole('option', { name: 'Blue', selected: true })
      ).toBeInTheDocument();
    });
  });

  describe('HTML attributes', () => {
    it('applies id attribute', () => {
      render(
        <Select options={[{ label: 'Red', value: 'red' }]} id="color-select" />
      );

      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('id', 'color-select');
    });

    it('applies name attribute', () => {
      render(
        <Select options={[{ label: 'Red', value: 'red' }]} name="color" />
      );

      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('name', 'color');
    });

    it('applies multiple attribute', () => {
      render(
        <Select
          options={[
            { label: 'Red', value: 'red' },
            { label: 'Green', value: 'green' },
          ]}
          multiple
        />
      );

      const select = screen.getByRole('listbox');
      expect(select).toHaveAttribute('multiple');
    });

    it('applies size attribute', () => {
      render(
        <Select
          options={[
            { label: 'Red', value: 'red' },
            { label: 'Green', value: 'green' },
            { label: 'Blue', value: 'blue' },
          ]}
          size={3}
        />
      );

      const select = screen.getByRole('listbox');
      expect(select).toHaveAttribute('size', '3');
    });

    it('applies custom data attributes', () => {
      render(
        <Select
          options={[{ label: 'Red', value: 'red' }]}
          data-testid="custom-select"
          data-category="colors"
        />
      );

      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('data-testid', 'custom-select');
      expect(select).toHaveAttribute('data-category', 'colors');
    });
  });

  describe('States', () => {
    it('can be disabled', () => {
      render(<Select options={[{ label: 'Red', value: 'red' }]} disabled />);

      const select = screen.getByRole('combobox');
      expect(select).toBeDisabled();
    });

    it('can be required', () => {
      render(
        <Select
          options={[
            { label: 'Choose', value: '' },
            { label: 'Red', value: 'red' },
          ]}
          required
        />
      );

      const select = screen.getByRole('combobox');
      expect(select).toBeRequired();
    });
  });

  describe('User interactions', () => {
    it('handles onChange events correctly', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Select
          options={[
            { label: 'Choose', value: '' },
            { label: 'Red', value: 'red' },
            { label: 'Green', value: 'green' },
          ]}
          onChange={handleChange}
        />
      );

      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'red');

      expect(handleChange).toHaveBeenCalled();
      expect((select as HTMLSelectElement).value).toBe('red');
    });

    it('handles onFocus events', async () => {
      const handleFocus = vi.fn();
      const user = userEvent.setup();

      render(
        <Select
          options={[{ label: 'Red', value: 'red' }]}
          onFocus={handleFocus}
        />
      );

      const select = screen.getByRole('combobox');
      await user.click(select);

      expect(handleFocus).toHaveBeenCalled();
    });

    it('handles onBlur events', async () => {
      const handleBlur = vi.fn();
      const user = userEvent.setup();

      render(
        <div>
          <Select
            options={[{ label: 'Red', value: 'red' }]}
            onBlur={handleBlur}
          />
          <button>Other element</button>
        </div>
      );

      const select = screen.getByRole('combobox');
      const button = screen.getByRole('button');

      await user.click(select);
      await user.click(button);

      expect(handleBlur).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA role for single select', () => {
      render(<Select options={[{ label: 'Red', value: 'red' }]} />);

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('has correct ARIA role for multiple select', () => {
      render(<Select options={[{ label: 'Red', value: 'red' }]} multiple />);

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('supports aria-label', () => {
      render(
        <Select
          options={[{ label: 'Red', value: 'red' }]}
          aria-label="Color selection"
        />
      );

      const select = screen.getByLabelText('Color selection');
      expect(select).toBeInTheDocument();
    });

    it('supports aria-describedby', () => {
      render(
        <div>
          <Select
            options={[{ label: 'Red', value: 'red' }]}
            aria-describedby="help-text"
          />
          <div id="help-text">Choose your favorite color</div>
        </div>
      );

      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('aria-describedby', 'help-text');
    });

    it('supports aria-invalid for validation states', () => {
      render(
        <Select
          options={[{ label: 'Red', value: 'red' }]}
          aria-invalid="true"
        />
      );

      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('Form integration', () => {
    it('works within form context', async () => {
      const handleSubmit = vi.fn((e) => e.preventDefault());
      const user = userEvent.setup();

      render(
        <form onSubmit={handleSubmit}>
          <Select
            options={[
              { label: 'Choose', value: '' },
              { label: 'Red', value: 'red' },
              { label: 'Green', value: 'green' },
            ]}
            name="color"
          />
          <button type="submit">Submit</button>
        </form>
      );

      const select = screen.getByRole('combobox');
      const submitButton = screen.getByRole('button', { name: /submit/i });

      await user.selectOptions(select, 'red');
      await user.click(submitButton);

      expect(handleSubmit).toHaveBeenCalled();
      expect((select as HTMLSelectElement).value).toBe('red');
    });

    it('supports form validation', () => {
      render(
        <form>
          <Select
            options={[
              { label: 'Choose', value: '' },
              { label: 'Red', value: 'red' },
            ]}
            name="color"
            required
          />
        </form>
      );

      const select = screen.getByRole('combobox');
      expect(select).toBeRequired();
    });
  });

  describe('Edge cases', () => {
    it('handles empty option list', () => {
      render(<Select options={[]} />);

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      expect(screen.queryAllByRole('option')).toHaveLength(0);
    });

    it('handles undefined value gracefully', () => {
      render(
        <Select options={[{ label: 'Red', value: 'red' }]} value={undefined} />
      );

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });

    it('handles null value gracefully', () => {
      render(
        <Select
          options={[{ label: 'Red', value: 'red' }]}
          value={null as any}
        />
      );

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });

    it('handles large number of options', () => {
      const manyOptions = [
        { label: 'Red', value: 'red' },
        { label: 'Blue', value: 'blue' },
        { label: 'Green', value: 'green' },
        { label: 'Orange', value: 'orange' },
        { label: 'Yellow', value: 'yellow' },
        { label: 'Purple', value: 'purple' },
      ];

      render(<Select options={manyOptions} />);

      const select = screen.getByRole('combobox');
      const options = screen.getAllByRole('option');

      expect(select).toBeInTheDocument();
      expect(options).toHaveLength(6);
      expect(screen.getByText('Red')).toBeInTheDocument();
      expect(screen.getByText('Blue')).toBeInTheDocument();
      expect(screen.getByText('Green')).toBeInTheDocument();
      expect(screen.getByText('Orange')).toBeInTheDocument();
    });
  });
});
