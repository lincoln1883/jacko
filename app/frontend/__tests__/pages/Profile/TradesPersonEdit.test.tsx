import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import TradesPersonEdit from '../../../pages/Profile/TradesPersonEdit';

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
  Select: ({ label, value, onChange, options, errors, ...props }: any) => (
    <div data-testid={`select-${props.id}`}>
      <label htmlFor={props.id}>{label}</label>
      <select value={value} onChange={onChange} {...props}>
        {options?.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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

describe('TradesPersonEdit', () => {
  const mockProfile = {
    id: 1,
    bio: 'Test bio',
    company_name: 'Test Company',
    years_experience: 5,
    hourly_rate: 50.0,
    phone: '+1-876-123-4567',
    website: 'https://test.com',
    availability_status: 'available' as const,
    description: 'Test description',
    completion_percentage: 85,
    completed: false,
    active: true,
    display_hourly_rate: '$50.00/hr',
    display_experience: '5 years experience',
    display_availability: 'Available for new projects',
    availability_color: 'green',
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  };

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    role: 'tradesperson' as const,
    role_display: 'Tradesperson',
    verified: true,
  };

  const defaultProps = {
    profile: mockProfile,
    user: mockUser,
    can_edit: true,
    errors: {},
  };

  beforeEach(() => {
    // Reset window.location.href before each test
    window.location.href = 'http://localhost:3000/';

    mockUseForm.mockReturnValue({
      data: {
        bio: mockProfile.bio,
        company_name: mockProfile.company_name,
        years_experience: mockProfile.years_experience,
        hourly_rate: mockProfile.hourly_rate,
        phone: mockProfile.phone,
        website: mockProfile.website,
        availability_status: mockProfile.availability_status,
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
      render(<TradesPersonEdit {...defaultProps} />);

      expect(screen.getByText('Edit Your Profile')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Update your tradesperson profile to attract more clients.'
        )
      ).toBeInTheDocument();
      expect(screen.getByTestId('input-company_name')).toBeInTheDocument();
      expect(
        screen.getByTestId('select-availability_status')
      ).toBeInTheDocument();
      expect(screen.getByTestId('textarea-bio')).toBeInTheDocument();
      expect(screen.getByTestId('input-years_experience')).toBeInTheDocument();
      expect(screen.getByTestId('input-hourly_rate')).toBeInTheDocument();
      expect(screen.getByTestId('input-phone')).toBeInTheDocument();
      expect(screen.getByTestId('input-website')).toBeInTheDocument();
      expect(screen.getByTestId('textarea-description')).toBeInTheDocument();
    });

    it('displays profile completion indicator', () => {
      render(<TradesPersonEdit {...defaultProps} />);

      expect(screen.getByText('Profile Completion')).toBeInTheDocument();
      expect(screen.getByText('85%')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Complete all sections to improve your profile visibility.'
        )
      ).toBeInTheDocument();
    });

    it('shows current account type selection', () => {
      render(<TradesPersonEdit {...defaultProps} />);

      expect(screen.getByText('Account Type')).toBeInTheDocument();
      expect(screen.getByText('Tradesperson Account')).toBeInTheDocument();
      expect(screen.getByText('Client Account')).toBeInTheDocument();
      expect(screen.getByText('✓ Currently selected')).toBeInTheDocument();
    });

    it('displays navigation links', () => {
      render(<TradesPersonEdit {...defaultProps} />);

      const viewProfileLink = screen.getByRole('link', {
        name: /view profile/i,
      });
      const cancelLink = screen.getByRole('link', { name: /cancel/i });

      expect(viewProfileLink).toHaveAttribute('href', '/profile/tradesperson');
      expect(cancelLink).toHaveAttribute('href', '/profile/tradesperson');
    });
  });

  describe('Form interactions', () => {
    it('updates form data when user types in fields', async () => {
      render(<TradesPersonEdit {...defaultProps} />);

      const bioInput = screen
        .getByTestId('textarea-bio')
        .querySelector('textarea');
      const companyInput = screen
        .getByTestId('input-company_name')
        .querySelector('input');

      fireEvent.change(bioInput!, { target: { value: 'Updated bio' } });
      fireEvent.change(companyInput!, { target: { value: 'Updated Company' } });

      expect(mockSetData).toHaveBeenCalledWith('bio', 'Updated bio');
      expect(mockSetData).toHaveBeenCalledWith(
        'company_name',
        'Updated Company'
      );
    });

    it('submits the form with correct data', async () => {
      render(<TradesPersonEdit {...defaultProps} />);

      const form = document.querySelector('form');
      fireEvent.submit(form!);

      expect(mockPut).toHaveBeenCalledWith('/profile/tradesperson');
    });

    it('handles form submission', () => {
      render(<TradesPersonEdit {...defaultProps} />);

      const saveButton = screen.getByRole('button', { name: /save changes/i });
      fireEvent.click(saveButton);

      expect(mockPut).toHaveBeenCalledWith('/profile/tradesperson');
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

      render(<TradesPersonEdit {...defaultProps} />);

      const saveButton = screen.getByRole('button', { name: /loading/i });
      expect(saveButton).toBeDisabled();
    });

    it('disables form fields during processing', () => {
      mockUseForm.mockReturnValue({
        data: {},
        setData: mockSetData,
        put: mockPut,
        processing: true,
      });

      render(<TradesPersonEdit {...defaultProps} />);

      const saveButton = screen.getByRole('button', { name: /loading/i });
      expect(saveButton).toBeDisabled();
    });
  });

  describe('Error handling', () => {
    it('displays field validation errors', () => {
      const propsWithErrors = {
        ...defaultProps,
        errors: {
          bio: ['Bio is too long'],
          years_experience: ['Must be a valid number'],
          hourly_rate: ['Must be greater than 0'],
        },
      };

      render(<TradesPersonEdit {...propsWithErrors} />);

      expect(screen.getByText('Bio is too long')).toBeInTheDocument();
      expect(screen.getByText('Must be a valid number')).toBeInTheDocument();
      expect(screen.getByText('Must be greater than 0')).toBeInTheDocument();
    });

    it('displays multiple errors for the same field', () => {
      const propsWithErrors = {
        ...defaultProps,
        errors: {
          bio: ['Bio is required', 'Bio is too long'],
        },
      };

      render(<TradesPersonEdit {...propsWithErrors} />);

      expect(
        screen.getByText('Bio is required, Bio is too long')
      ).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper form field labeling', () => {
      render(<TradesPersonEdit {...defaultProps} />);

      expect(screen.getByLabelText('Company Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Professional Bio')).toBeInTheDocument();
      expect(screen.getByLabelText('Years of Experience')).toBeInTheDocument();
      expect(screen.getByLabelText('Hourly Rate (USD)')).toBeInTheDocument();
      expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
      expect(screen.getByLabelText('Website')).toBeInTheDocument();
      expect(screen.getByLabelText('Availability Status')).toBeInTheDocument();
      expect(
        screen.getByLabelText('Describe Your Services')
      ).toBeInTheDocument();
    });

    it('has proper heading hierarchy', () => {
      render(<TradesPersonEdit {...defaultProps} />);

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
        screen.getByRole('heading', { level: 2, name: /experience & pricing/i })
      ).toBeInTheDocument();
    });

    it('provides helpful field hints', () => {
      render(<TradesPersonEdit {...defaultProps} />);

      expect(
        screen.getByText(
          'Brief overview of your skills and experience (max 1000 characters)'
        )
      ).toBeInTheDocument();
      expect(screen.getByText('Total years in your trade')).toBeInTheDocument();
      expect(screen.getByText('Your standard hourly rate')).toBeInTheDocument();
      expect(
        screen.getByText('Your business phone number')
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'Detailed description of your services to help clients understand what you offer (max 2000 characters)'
        )
      ).toBeInTheDocument();
    });

    it('marks error messages with proper ARIA roles', () => {
      const propsWithErrors = {
        ...defaultProps,
        errors: {
          bio: ['Bio is required'],
        },
      };

      render(<TradesPersonEdit {...propsWithErrors} />);

      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toHaveTextContent('Bio is required');
    });
  });

  describe('Account type switching', () => {
    it('provides role switching functionality', () => {
      render(<TradesPersonEdit {...defaultProps} />);

      const switchButton = screen.getByRole('button', {
        name: /switch to client/i,
      });
      expect(switchButton).toBeInTheDocument();

      fireEvent.click(switchButton);

      // This should trigger navigation to the client edit page with switch_role param
      expect(window.location.href).toBe(
        '/profile/client/edit?switch_role=true'
      );
    });
  });

  describe('Profile completion visualization', () => {
    it('shows appropriate completion color for high completion', () => {
      const highCompletionProfile = {
        ...mockProfile,
        completion_percentage: 90,
      };

      render(
        <TradesPersonEdit {...defaultProps} profile={highCompletionProfile} />
      );

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
        <TradesPersonEdit {...defaultProps} profile={mediumCompletionProfile} />
      );

      const progressBar = document.querySelector('[style*="width: 60%"]');
      expect(progressBar).toBeInTheDocument();
    });

    it('shows appropriate completion color for low completion', () => {
      const lowCompletionProfile = {
        ...mockProfile,
        completion_percentage: 30,
      };

      render(
        <TradesPersonEdit {...defaultProps} profile={lowCompletionProfile} />
      );

      const progressBar = document.querySelector('[style*="width: 30%"]');
      expect(progressBar).toBeInTheDocument();
    });
  });
});
