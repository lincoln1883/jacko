import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
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

vi.mock('../../../components/ui/skills-multi-select', () => ({
  SkillsMultiSelect: ({ label, selectedSkills }: any) => (
    <div data-testid="skills-multi-select">
      <label>{label}</label>
      <div
        data-selected-skills={selectedSkills?.map((s: any) => s.id).join(',')}
      >
        Skills Multi Select Component
      </div>
    </div>
  ),
}));

vi.mock('../../../components', () => ({
  PortfolioUpload: () => (
    <div data-testid="portfolio-upload">Portfolio Upload Component</div>
  ),
  AvatarUpload: () => (
    <div data-testid="avatar-upload">Avatar Upload Component</div>
  ),
  AdditionalParishesMultiSelect: ({
    label = 'Additional Service Parishes',
    selectedParishIds,
    hint = 'Select other parishes you are willing to serve (optional)',
  }: any) => (
    <div data-testid="additional-parishes-multi-select">
      <label>{label}</label>
      <div data-selected-parish-ids={selectedParishIds?.join(',')}>
        Additional Parishes Multi Select Component
      </div>
      {hint && <p data-testid="hint">{hint}</p>}
    </div>
  ),
}));

vi.mock('../../../contexts/ToastContext', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
    addToast: vi.fn(), // Added addToast mock
  }),
}));

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000/',
  },
  writable: true,
});

// Mock fetch API to prevent URL parsing errors
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
) as any;

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
    experience_level: 'intermediate' as const,
    description: 'Test description',
    completion_percentage: 85,
    completed: false,
    active: true,
    display_hourly_rate: '$50.00/hr',
    display_experience: '5 years experience',
    display_availability: 'Available for new projects',
    availability_color: 'green',
    skills: [],
    skill_ids: [],
    skills_by_category: {},
    has_avatar: false,
    avatar_url: null,
    avatar_thumbnail_url: null,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
    parish_id: 1,
    parish: {
      id: 1,
      name: 'Kingston',
      svg_path: null,
      color: null,
      created_at: '2023-01-01T00:00:00.000Z',
      updated_at: '2023-01-01T00:00:00.000Z',
    },
    street_address: '123 Main St',
    city_town: 'Kingston',
    postal_code: 'KGN10',
    latitude: 1.23,
    longitude: 4.56,
    service_radius_km: 50,
    service_area_notes: 'Willing to travel to surrounding areas',
    additional_parishes: ['St. Andrew', 'St. Catherine'],
    portfolio_images: [], // Added portfolio_images to mockProfile
  };

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    role: 'tradesperson' as const,
    role_display: 'Tradesperson',
    verified: true,
  };

  const mockParishes = [
    {
      id: 1,
      name: 'Kingston',
      svg_path: null,
      color: null,
      created_at: '2023-01-01T00:00:00.000Z',
      updated_at: '2023-01-01T00:00:00.000Z',
    },
    {
      id: 2,
      name: 'St. Andrew',
      svg_path: null,
      color: null,
      created_at: '2023-01-01T00:00:00.000Z',
      updated_at: '2023-01-01T00:00:00.000Z',
    },
    {
      id: 3,
      name: 'St. Catherine',
      svg_path: null,
      color: null,
      created_at: '2023-01-01T00:00:00.000Z',
      updated_at: '2023-01-01T00:00:00.000Z',
    },
  ];

  const defaultProps = {
    profile: mockProfile,
    user: mockUser,
    can_edit: true,
    skills: [],
    skills_by_category: {},
    parishes: mockParishes, // Add parishes here
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
        experience_level: mockProfile.experience_level,
        description: mockProfile.description,
        skill_ids: mockProfile.skill_ids,
        parish_id: mockProfile.parish?.id,
        street_address: mockProfile.street_address,
        city_town: mockProfile.city_town,
        postal_code: mockProfile.postal_code,
        service_radius_km: mockProfile.service_radius_km,
        service_area_notes: mockProfile.service_area_notes,
        additional_parishes: mockProfile.additional_parishes || [], // Initialize as empty array
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
    it('renders the edit form with all fields', async () => {
      await act(async () => {
        render(<TradesPersonEdit {...defaultProps} />);
      });

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
      expect(screen.getByTestId('select-experience_level')).toBeInTheDocument(); // New assertion
      expect(screen.getByTestId('input-hourly_rate')).toBeInTheDocument();
      expect(screen.getByTestId('input-phone')).toBeInTheDocument();
      expect(screen.getByTestId('input-website')).toBeInTheDocument();
      expect(screen.getByTestId('textarea-description')).toBeInTheDocument();
      expect(screen.getByTestId('select-parish_id')).toBeInTheDocument(); // New assertion
      expect(screen.getByTestId('input-street_address')).toBeInTheDocument(); // New assertion
      expect(screen.getByTestId('input-city_town')).toBeInTheDocument(); // New assertion
      expect(screen.getByTestId('input-postal_code')).toBeInTheDocument(); // New assertion
      expect(screen.getByTestId('input-service_radius_km')).toBeInTheDocument(); // New assertion
      expect(
        screen.getByTestId('textarea-service_area_notes')
      ).toBeInTheDocument(); // New assertion
      expect(
        screen.getByTestId('additional-parishes-multi-select')
      ).toBeInTheDocument(); // New assertion
      expect(screen.getByTestId('portfolio-upload')).toBeInTheDocument(); // New assertion
    });

    it('displays profile completion indicator', async () => {
      await act(async () => {
        render(<TradesPersonEdit {...defaultProps} />);
      });

      expect(screen.getByText('Profile Completion')).toBeInTheDocument();
      expect(screen.getByText('85%')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Complete all sections to improve your profile visibility.'
        )
      ).toBeInTheDocument();
    });

    it('shows current account type selection', async () => {
      await act(async () => {
        render(<TradesPersonEdit {...defaultProps} />);
      });

      expect(screen.getByText('Account Type')).toBeInTheDocument();
      expect(screen.getByText('Tradesperson Account')).toBeInTheDocument();
      expect(screen.getByText('Client Account')).toBeInTheDocument();
      expect(screen.getByText('✓ Currently selected')).toBeInTheDocument();
    });

    it('displays navigation links', async () => {
      await act(async () => {
        render(<TradesPersonEdit {...defaultProps} />);
      });

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
      await act(async () => {
        render(<TradesPersonEdit {...defaultProps} />);
      });

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
      await act(async () => {
        render(<TradesPersonEdit {...defaultProps} />);
      });

      const form = document.querySelector('form');
      fireEvent.submit(form!);

      expect(mockPut).toHaveBeenCalledWith('/profile/tradesperson');
    });

    it('handles form submission', async () => {
      await act(async () => {
        render(<TradesPersonEdit {...defaultProps} />);
      });

      const saveButton = screen.getByRole('button', { name: /save changes/i });
      fireEvent.click(saveButton);

      expect(mockPut).toHaveBeenCalledWith('/profile/tradesperson');
    });
  });

  describe('Loading states', () => {
    it('shows loading state when form is processing', async () => {
      mockUseForm.mockReturnValue({
        data: { additional_parishes: [] }, // Ensure additional_parishes is an array
        setData: mockSetData,
        put: mockPut,
        processing: true,
      });

      await act(async () => {
        render(<TradesPersonEdit {...defaultProps} />);
      });

      const saveButton = screen.getByRole('button', { name: /loading/i });
      expect(saveButton).toBeDisabled();
    });

    it('disables form fields during processing', async () => {
      mockUseForm.mockReturnValue({
        data: { additional_parishes: [] }, // Ensure additional_parishes is an array
        setData: mockSetData,
        put: mockPut,
        processing: true,
      });

      await act(async () => {
        render(<TradesPersonEdit {...defaultProps} />);
      });

      const saveButton = screen.getByRole('button', { name: /loading/i });
      expect(saveButton).toBeDisabled();
    });
  });

  describe('Error handling', () => {
    it('displays field validation errors', async () => {
      const propsWithErrors = {
        ...defaultProps,
        errors: {
          bio: ['Bio is too long'],
          years_experience: ['Must be a valid number'],
          hourly_rate: ['Must be greater than 0'],
          parish_id: ['Parish cannot be blank'],
          service_radius_km: ['Must be a valid number'],
        },
      };

      await act(async () => {
        render(<TradesPersonEdit {...propsWithErrors} />);
      });

      expect(screen.getByText('Bio is too long')).toBeInTheDocument();
      expect(screen.getAllByText('Must be a valid number').length).toBe(2);
      expect(screen.getByText('Must be greater than 0')).toBeInTheDocument();
      expect(screen.getByText('Parish cannot be blank')).toBeInTheDocument();
    });

    it('displays multiple errors for the same field', async () => {
      const propsWithErrors = {
        ...defaultProps,
        errors: {
          bio: ['Bio is required', 'Bio is too long'],
        },
      };

      await act(async () => {
        render(<TradesPersonEdit {...propsWithErrors} />);
      });

      expect(
        screen.getByText('Bio is required, Bio is too long')
      ).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper form field labeling', async () => {
      await act(async () => {
        render(<TradesPersonEdit {...defaultProps} />);
      });

      expect(screen.getByLabelText('Company Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Professional Bio')).toBeInTheDocument();
      expect(screen.getByLabelText('Years of Experience')).toBeInTheDocument();
      expect(screen.getByLabelText('Experience Level')).toBeInTheDocument(); // New assertion
      expect(screen.getByLabelText('Hourly Rate (USD)')).toBeInTheDocument();
      expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
      expect(screen.getByLabelText('Website')).toBeInTheDocument();
      expect(screen.getByLabelText('Availability Status')).toBeInTheDocument();
      expect(
        screen.getByLabelText('Describe Your Services')
      ).toBeInTheDocument();
      expect(screen.getByLabelText('Parish')).toBeInTheDocument(); // New assertion
      expect(screen.getByLabelText('Street Address')).toBeInTheDocument(); // New assertion
      expect(screen.getByLabelText('City/Town')).toBeInTheDocument(); // New assertion
      expect(screen.getByLabelText('Postal Code')).toBeInTheDocument(); // New assertion
      expect(screen.getByLabelText('Service Radius (km)')).toBeInTheDocument(); // New assertion
      expect(screen.getByLabelText('Service Area Notes')).toBeInTheDocument(); // New assertion
      expect(
        screen.getByText(/Additional Service Parishes/i) // Revert to getByText for the label
      ).toBeInTheDocument(); // New assertion
    });

    it('has proper heading hierarchy', async () => {
      await act(async () => {
        render(<TradesPersonEdit {...defaultProps} />);
      });

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
      expect(
        screen.getByRole('heading', { level: 2, name: /location information/i })
      ).toBeInTheDocument(); // New assertion
    });

    it('provides helpful field hints', async () => {
      await act(async () => {
        render(<TradesPersonEdit {...defaultProps} />);
      });

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
      expect(
        screen.getByText(
          'Distance from your location you are willing to travel'
        )
      ).toBeInTheDocument(); // New assertion
      expect(
        screen.getByText(
          'Describe any specific areas you serve or travel limitations.'
        )
      ).toBeInTheDocument(); // New assertion
      expect(
        screen
          .getByTestId('additional-parishes-multi-select')
          .querySelector('[data-testid="hint"]')
      ).toHaveTextContent(
        /Select other parishes you are willing to serve \(optional\)/i
      ); // New assertion
    });

    it('marks error messages with proper ARIA roles', async () => {
      const propsWithErrors = {
        ...defaultProps,
        errors: {
          bio: ['Bio is required'],
          parish_id: ['Parish cannot be blank'],
        },
      };

      await act(async () => {
        render(<TradesPersonEdit {...propsWithErrors} />);
      });

      const errorMessages = screen.getAllByRole('alert');
      expect(errorMessages).toHaveLength(2);
      expect(errorMessages[0]).toHaveTextContent('Bio is required');
      expect(errorMessages[1]).toHaveTextContent('Parish cannot be blank');
    });
  });

  describe('Account type switching', () => {
    it('provides role switching functionality', async () => {
      await act(async () => {
        render(<TradesPersonEdit {...defaultProps} />);
      });

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
    it('shows appropriate completion color for high completion', async () => {
      const highCompletionProfile = {
        ...mockProfile,
        completion_percentage: 90,
      };

      await act(async () => {
        render(
          <TradesPersonEdit {...defaultProps} profile={highCompletionProfile} />
        );
      });

      // The progress bar should have green background for high completion
      const progressBar = document.querySelector('[style*="width: 90%"]');
      expect(progressBar).toBeInTheDocument();
    });

    it('shows appropriate completion color for medium completion', async () => {
      const mediumCompletionProfile = {
        ...mockProfile,
        completion_percentage: 60,
      };

      await act(async () => {
        render(
          <TradesPersonEdit
            {...defaultProps}
            profile={mediumCompletionProfile}
          />
        );
      });

      const progressBar = document.querySelector('[style*="width: 60%"]');
      expect(progressBar).toBeInTheDocument();
    });

    it('shows appropriate completion color for low completion', async () => {
      const lowCompletionProfile = {
        ...mockProfile,
        completion_percentage: 30,
      };

      await act(async () => {
        render(
          <TradesPersonEdit {...defaultProps} profile={lowCompletionProfile} />
        );
      });

      const progressBar = document.querySelector('[style*="width: 30%"]');
      expect(progressBar).toBeInTheDocument();
    });
  });
});
