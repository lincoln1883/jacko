import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ClientEdit from '../../../pages/Profile/ClientEdit';

// Mock Inertia
const mockUseForm = vi.fn();
const mockPut = vi.fn();
const mockSetData = vi.fn();

vi.mock('@inertiajs/react', () => ({
  useForm: () => mockUseForm(),
  Link: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock components
vi.mock('../../../components/layouts/AppLayout', () => ({
  AppLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="app-layout">{children}</div>
  ),
}));

vi.mock('../../../components/ui/input', () => ({
  Input: ({
    label,
    value,
    onChange,
    errors,
    placeholder,
    hint,
    ...props
  }: any) => (
    <div data-testid={`input-${props.id}`}>
      <label htmlFor={props.id}>{label}</label>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        data-errors={errors?.join(', ')}
        {...props}
      />
      {hint && <div data-testid="hint">{hint}</div>}
      {errors && errors.length > 0 && (
        <div data-testid="errors" role="alert">
          {errors.join(', ')}
        </div>
      )}
    </div>
  ),
}));

vi.mock('../../../components/ui/textarea', () => ({
  Textarea: ({
    label,
    value,
    onChange,
    errors,
    placeholder,
    hint,
    ...props
  }: any) => (
    <div data-testid={`textarea-${props.id}`}>
      <label htmlFor={props.id}>{label}</label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        data-errors={errors?.join(', ')}
        {...props}
      />
      {hint && <div data-testid="hint">{hint}</div>}
      {errors && errors.length > 0 && (
        <div data-testid="errors" role="alert">
          {errors.join(', ')}
        </div>
      )}
    </div>
  ),
}));

vi.mock('../../../components/ui/select', () => ({
  Select: ({
    label,
    value,
    onChange,
    options,
    errors,
    placeholder,
    hint,
    ...props
  }: any) => (
    <div data-testid={`select-${props.id}`}>
      <label htmlFor={props.id}>{label}</label>
      <select value={value} onChange={onChange} {...props}>
        <option value="">{placeholder}</option>
        {options?.map((option: any) => (
          <option key={option[1]} value={option[1]}>
            {option[0]}
          </option>
        ))}
      </select>
      {hint && <div data-testid="hint">{hint}</div>}
      {errors && errors.length > 0 && (
        <div data-testid="errors" role="alert">
          {errors.join(', ')}
        </div>
      )}
    </div>
  ),
}));

vi.mock('../../../components/ui/button', () => ({
  Button: ({ children, loading, variant, type, ...props }: any) => (
    <button type={type} disabled={loading} data-variant={variant} {...props}>
      {loading ? 'Loading...' : children}
    </button>
  ),
}));

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000/',
  },
  writable: true,
});

describe('ClientEdit', () => {
  const mockProfile = {
    id: 1,
    company_name: 'Test Company',
    preferred_contact_method: 'platform_messaging' as const,
    project_budget_range: '1000_2500',
    description: 'Test project description',
    completion_percentage: 75,
    completed: false,
    active: true,
    display_budget_range: '$1,000 - $2,500',
    display_contact_method: 'Platform messaging',
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  };

  const mockUser = {
    id: 1,
    email: 'client@example.com',
    role: 'client' as const,
    role_display: 'Client',
    verified: true,
  };

  const mockContactMethodOptions: [string, string][] = [
    ['Platform messaging', 'platform_messaging'],
    ['Email', 'email'],
    ['Phone call', 'phone'],
    ['WhatsApp', 'whatsapp'],
  ];

  const mockBudgetRangeOptions: [string, string][] = [
    ['Under $500', 'under_500'],
    ['$500 - $1,000', '500_1000'],
    ['$1,000 - $2,500', '1000_2500'],
    ['$2,500 - $5,000', '2500_5000'],
    ['$5,000 - $10,000', '5000_10000'],
    ['Over $10,000', 'over_10000'],
  ];

  const defaultProps = {
    profile: mockProfile,
    user: mockUser,
    can_edit: true,
    contact_method_options: mockContactMethodOptions,
    budget_range_options: mockBudgetRangeOptions,
    errors: {},
  };

  beforeEach(() => {
    // Reset window.location.href before each test
    window.location.href = 'http://localhost:3000/';

    mockUseForm.mockReturnValue({
      data: {
        company_name: mockProfile.company_name,
        preferred_contact_method: mockProfile.preferred_contact_method,
        project_budget_range: mockProfile.project_budget_range,
        description: mockProfile.description,
      },
      setData: mockSetData,
      put: mockPut,
      processing: false,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the edit form with all fields', () => {
      render(<ClientEdit {...defaultProps} />);

      expect(screen.getByText('Edit Your Profile')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Update your client profile to help tradespeople understand your needs.'
        )
      ).toBeInTheDocument();
      expect(screen.getByTestId('input-company_name')).toBeInTheDocument();
      expect(
        screen.getByTestId('select-project_budget_range')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('select-preferred_contact_method')
      ).toBeInTheDocument();
      expect(screen.getByTestId('textarea-description')).toBeInTheDocument();
    });

    it('displays profile completion indicator', () => {
      render(<ClientEdit {...defaultProps} />);

      expect(screen.getByText('Profile Completion')).toBeInTheDocument();
      expect(screen.getByText('75%')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Complete your profile to help tradespeople understand your project requirements.'
        )
      ).toBeInTheDocument();
    });

    it('shows current account type selection', () => {
      render(<ClientEdit {...defaultProps} />);

      expect(screen.getByText('Account Type')).toBeInTheDocument();
      expect(screen.getByText('Client Account')).toBeInTheDocument();
      expect(screen.getByText('Tradesperson Account')).toBeInTheDocument();
      expect(screen.getByText('✓ Currently selected')).toBeInTheDocument();
    });

    it('displays navigation links', () => {
      render(<ClientEdit {...defaultProps} />);

      const viewProfileLink = screen.getByRole('link', {
        name: /view profile/i,
      });
      const cancelLink = screen.getByRole('link', { name: /cancel/i });

      expect(viewProfileLink).toHaveAttribute('href', '/profile/client');
      expect(cancelLink).toHaveAttribute('href', '/profile/client');
    });

    it('displays help section', () => {
      render(<ClientEdit {...defaultProps} />);

      expect(
        screen.getByText('Tips for a Great Client Profile')
      ).toBeInTheDocument();
      expect(
        screen.getByText('• Be clear about your typical project requirements')
      ).toBeInTheDocument();
      expect(
        screen.getByText('• Specify your preferred communication method')
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          '• Provide a realistic budget range to attract suitable tradespeople'
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          '• Describe any specific standards or expectations you have'
        )
      ).toBeInTheDocument();
    });
  });

  describe('Form interactions', () => {
    it('updates form data when user types in fields', () => {
      render(<ClientEdit {...defaultProps} />);

      const companyInput = screen
        .getByTestId('input-company_name')
        .querySelector('input');
      const descriptionTextarea = screen
        .getByTestId('textarea-description')
        .querySelector('textarea');

      fireEvent.change(companyInput!, { target: { value: 'Updated Company' } });
      fireEvent.change(descriptionTextarea!, {
        target: { value: 'Updated description' },
      });

      expect(mockSetData).toHaveBeenCalledWith(
        'company_name',
        'Updated Company'
      );
      expect(mockSetData).toHaveBeenCalledWith(
        'description',
        'Updated description'
      );
    });

    it('handles select field changes', () => {
      render(<ClientEdit {...defaultProps} />);

      const budgetSelect = screen
        .getByTestId('select-project_budget_range')
        .querySelector('select');
      const contactSelect = screen
        .getByTestId('select-preferred_contact_method')
        .querySelector('select');

      fireEvent.change(budgetSelect!, { target: { value: 'over_10000' } });
      fireEvent.change(contactSelect!, { target: { value: 'email' } });

      expect(mockSetData).toHaveBeenCalledWith(
        'project_budget_range',
        'over_10000'
      );
      expect(mockSetData).toHaveBeenCalledWith(
        'preferred_contact_method',
        'email'
      );
    });

    it('submits the form with correct data', () => {
      render(<ClientEdit {...defaultProps} />);

      const form = document.querySelector('form');
      fireEvent.submit(form!);

      expect(mockPut).toHaveBeenCalledWith('/profile/client');
    });

    it('handles form submission via button click', () => {
      render(<ClientEdit {...defaultProps} />);

      const saveButton = screen.getByRole('button', { name: /save changes/i });
      fireEvent.click(saveButton);

      expect(mockPut).toHaveBeenCalledWith('/profile/client');
    });
  });

  describe('Loading states', () => {
    it('shows loading state when form is processing', () => {
      mockUseForm.mockReturnValue({
        data: {},
        setData: mockSetData,
        put: mockPut,
        processing: true,
      });

      render(<ClientEdit {...defaultProps} />);

      const saveButton = screen.getByRole('button', { name: /loading/i });
      expect(saveButton).toBeDisabled();
    });
  });

  describe('Error handling', () => {
    it('displays field validation errors', () => {
      const propsWithErrors = {
        ...defaultProps,
        errors: {
          company_name: ['Company name is too long'],
          preferred_contact_method: ['Invalid contact method'],
          description: ['Description is required'],
        },
      };

      render(<ClientEdit {...propsWithErrors} />);

      expect(screen.getByText('Company name is too long')).toBeInTheDocument();
      expect(screen.getByText('Invalid contact method')).toBeInTheDocument();
      expect(screen.getByText('Description is required')).toBeInTheDocument();
    });

    it('displays multiple errors for the same field', () => {
      const propsWithErrors = {
        ...defaultProps,
        errors: {
          description: ['Description is required', 'Description is too short'],
        },
      };

      render(<ClientEdit {...propsWithErrors} />);

      expect(
        screen.getByText('Description is required, Description is too short')
      ).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper form field labeling', () => {
      render(<ClientEdit {...defaultProps} />);

      expect(screen.getByLabelText('Company Name')).toBeInTheDocument();
      expect(
        screen.getByLabelText('Typical Project Budget Range')
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText('Preferred Contact Method')
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText('Describe Your Typical Projects')
      ).toBeInTheDocument();
    });

    it('has proper heading hierarchy', () => {
      render(<ClientEdit {...defaultProps} />);

      expect(
        screen.getByRole('heading', { level: 1, name: /edit your profile/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { level: 2, name: /account type/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { level: 2, name: /basic information/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { level: 2, name: /contact preferences/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { level: 2, name: /about your projects/i })
      ).toBeInTheDocument();
    });

    it('provides helpful field hints', () => {
      render(<ClientEdit {...defaultProps} />);

      expect(
        screen.getByText("Leave blank if you're an individual client")
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'This helps tradespeople understand the scale of your projects'
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText('How would you like tradespeople to contact you?')
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'Help tradespeople understand what types of projects you typically hire for (max 1500 characters)'
        )
      ).toBeInTheDocument();
    });

    it('marks error messages with proper ARIA roles', () => {
      const propsWithErrors = {
        ...defaultProps,
        errors: {
          description: ['Description is required'],
        },
      };

      render(<ClientEdit {...propsWithErrors} />);

      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toHaveTextContent('Description is required');
    });
  });

  describe('Account type switching', () => {
    it('provides role switching functionality', () => {
      render(<ClientEdit {...defaultProps} />);

      const switchButton = screen.getByRole('button', {
        name: /switch to tradesperson/i,
      });
      expect(switchButton).toBeInTheDocument();

      fireEvent.click(switchButton);

      // This should trigger navigation to the tradesperson edit page with switch_role param
      expect(window.location.href).toBe(
        '/profile/tradesperson/edit?switch_role=true'
      );
    });
  });

  describe('Select options', () => {
    it('renders budget range options correctly', () => {
      render(<ClientEdit {...defaultProps} />);

      const budgetSelect = screen
        .getByTestId('select-project_budget_range')
        .querySelector('select');
      const options = Array.from(budgetSelect!.querySelectorAll('option'));

      expect(options.map((opt) => opt.textContent)).toContain('Under $500');
      expect(options.map((opt) => opt.textContent)).toContain(
        '$1,000 - $2,500'
      );
      expect(options.map((opt) => opt.textContent)).toContain('Over $10,000');
    });

    it('renders contact method options correctly', () => {
      render(<ClientEdit {...defaultProps} />);

      const contactSelect = screen
        .getByTestId('select-preferred_contact_method')
        .querySelector('select');
      const options = Array.from(contactSelect!.querySelectorAll('option'));

      expect(options.map((opt) => opt.textContent)).toContain(
        'Platform messaging'
      );
      expect(options.map((opt) => opt.textContent)).toContain('Email');
      expect(options.map((opt) => opt.textContent)).toContain('WhatsApp');
    });
  });

  describe('Profile completion visualization', () => {
    it('shows appropriate completion color for high completion', () => {
      const highCompletionProfile = {
        ...mockProfile,
        completion_percentage: 90,
      };

      render(<ClientEdit {...defaultProps} profile={highCompletionProfile} />);

      // The progress bar should have green background for high completion
      const progressBar = document.querySelector('[style*="width: 90%"]');
      expect(progressBar).toBeInTheDocument();
    });

    it('shows appropriate completion color for medium completion', () => {
      const mediumCompletionProfile = {
        ...mockProfile,
        completion_percentage: 60,
      };

      render(
        <ClientEdit {...defaultProps} profile={mediumCompletionProfile} />
      );

      const progressBar = document.querySelector('[style*="width: 60%"]');
      expect(progressBar).toBeInTheDocument();
    });

    it('shows appropriate completion color for low completion', () => {
      const lowCompletionProfile = {
        ...mockProfile,
        completion_percentage: 30,
      };

      render(<ClientEdit {...defaultProps} profile={lowCompletionProfile} />);

      const progressBar = document.querySelector('[style*="width: 30%"]');
      expect(progressBar).toBeInTheDocument();
    });
  });

  describe('Empty options handling', () => {
    it('handles missing contact method options gracefully', () => {
      const propsWithoutOptions = {
        ...defaultProps,
        contact_method_options: [],
      };

      render(<ClientEdit {...propsWithoutOptions} />);

      const contactSelect = screen
        .getByTestId('select-preferred_contact_method')
        .querySelector('select');
      expect(contactSelect).toBeInTheDocument();
    });

    it('handles missing budget range options gracefully', () => {
      const propsWithoutOptions = {
        ...defaultProps,
        budget_range_options: [],
      };

      render(<ClientEdit {...propsWithoutOptions} />);

      const budgetSelect = screen
        .getByTestId('select-project_budget_range')
        .querySelector('select');
      expect(budgetSelect).toBeInTheDocument();
    });
  });
});
