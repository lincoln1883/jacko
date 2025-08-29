import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { PageProps, FlashMessage, User } from '../types/auth';

// Mock Inertia's usePage hook
export const mockPageProps = (overrides: Partial<PageProps> = {}): PageProps => ({
  flash: undefined,
  errors: undefined,
  auth: undefined,
  app_name: 'Jacko',
  ...overrides,
});

// Create a mock user
export const mockUser = (overrides: Partial<User> = {}): User => ({
  id: 1,
  email: 'test@example.com',
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
  ...overrides,
});

// Create a mock flash message
export const mockFlashMessage = (
  type: FlashMessage['type'] = 'notice',
  message: string = 'Test message'
): FlashMessage => ({
  type,
  message,
});

// Import mocked hooks for testing
import { useForm, usePage, Head, Link } from '@inertiajs/react';

// Get mocked versions of Inertia hooks
const mockUseForm = vi.mocked(useForm);
const mockUsePage = vi.mocked(usePage);
const MockHead = vi.mocked(Head);
const MockLink = vi.mocked(Link);

// Mock Inertia hooks and components factory
export const mockInertiaHooks = () => {
  const mockPost = vi.fn();
  const mockGet = vi.fn();
  const mockPut = vi.fn();
  const mockDelete = vi.fn();
  const mockVisit = vi.fn();
  const mockReset = vi.fn();
  const mockSetData = vi.fn();

  const mockFormReturn = {
    data: {},
    setData: mockSetData,
    post: mockPost,
    get: mockGet,
    put: mockPut,
    patch: vi.fn(),
    delete: mockDelete,
    processing: false,
    errors: {},
    hasErrors: false,
    progress: null,
    wasSuccessful: false,
    recentlySuccessful: false,
    reset: mockReset,
    clearErrors: vi.fn(),
    setError: vi.fn(),
    transform: vi.fn(),
    isDirty: false,
  };

  const mockPageReturn = {
    component: 'TestComponent',
    props: mockPageProps(),
    url: '/test',
    version: '1',
  };

  return {
    mockPost,
    mockGet,
    mockPut,
    mockDelete,
    mockVisit,
    mockReset,
    mockSetData,
    mockFormReturn,
    mockPageReturn,
    mockUseForm,
    mockUsePage,
    MockHead,
    MockLink,
  };
};

// Enhanced render function with Inertia mocking
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  pageProps?: Partial<PageProps>;
  formData?: Record<string, any>;
  formOptions?: {
    processing?: boolean;
    errors?: Record<string, string[]>;
    wasSuccessful?: boolean;
    setData?: any;
    post?: any;
    get?: any;
    put?: any;
    patch?: any;
    delete?: any;
    reset?: any;
  };
}

export const renderWithInertia = (
  ui: React.ReactElement,
  {
    pageProps = {},
    formData = {},
    formOptions = {},
    ...renderOptions
  }: CustomRenderOptions = {}
) => {
  // Get the mocked functions from the global mocks
  const mockUseForm = vi.mocked(useForm);
  const mockUsePage = vi.mocked(usePage);

  // Configure the page mock
  mockUsePage.mockReturnValue({
    component: 'TestComponent',
    props: mockPageProps(pageProps),
    url: '/test',
    version: '1',
  });

  // Create mock functions for form actions, using provided ones if available
  const mockPost = formOptions.post || vi.fn();
  const mockGet = formOptions.get || vi.fn();
  const mockPut = formOptions.put || vi.fn();
  const mockPatch = formOptions.patch || vi.fn();
  const mockDelete = formOptions.delete || vi.fn();
  const mockReset = formOptions.reset || vi.fn();
  const mockSetData = formOptions.setData || vi.fn((key, value) => {
    if (typeof key === 'string') {
      formData[key] = value;
    } else if (typeof key === 'function') {
      Object.assign(formData, key(formData));
    } else {
      Object.assign(formData, key);
    }
  });

  // Configure the form mock
  mockUseForm.mockReturnValue({
    data: formData,
    setData: mockSetData,
    post: mockPost,
    get: mockGet,
    put: mockPut,
    patch: mockPatch,
    delete: mockDelete,
    processing: formOptions.processing || false,
    errors: formOptions.errors || {},
    hasErrors: Object.keys(formOptions.errors || {}).length > 0,
    progress: null,
    wasSuccessful: formOptions.wasSuccessful || false,
    recentlySuccessful: false,
    reset: mockReset,
    clearErrors: vi.fn(),
    setError: vi.fn(),
    transform: vi.fn(),
    isDirty: Object.keys(formData).length > 0,
  });

  const user = userEvent.setup();

  return {
    user,
    ...render(ui, renderOptions),
    mockUseForm,
    mockUsePage,
    mockPost,
    mockGet,
    mockPut,
    mockPatch,
    mockDelete,
    mockReset,
    mockSetData,
  };
};

// Helper to create form errors
export const createFormErrors = (fields: Record<string, string | string[]>) => {
  return Object.entries(fields).reduce((acc, [field, errors]) => {
    acc[field] = Array.isArray(errors) ? errors : [errors];
    return acc;
  }, {} as Record<string, string[]>);
};

// Helper to wait for form submission
export const waitForFormSubmission = async (
  user: ReturnType<typeof userEvent.setup>,
  submitButton: HTMLElement
) => {
  await user.click(submitButton);
  // Wait for any async operations
  await new Promise(resolve => setTimeout(resolve, 0));
};

// Helper to fill form fields
export const fillFormField = async (
  user: ReturnType<typeof userEvent.setup>,
  field: HTMLElement,
  value: string
) => {
  await user.clear(field);
  await user.type(field, value);
};

// Accessibility test helpers
export const expectProperLabeling = (input: HTMLElement) => {
  const label = document.querySelector(`label[for="${input.id}"]`);
  expect(label).toBeInTheDocument();
  expect(input).toHaveAccessibleName();
};

export const expectProperErrorAnnouncement = (input: HTMLElement) => {
  expect(input).toHaveAttribute('aria-invalid', 'true');
  const errorId = input.getAttribute('aria-describedby');
  if (errorId) {
    const errorElement = document.getElementById(errorId);
    expect(errorElement).toBeInTheDocument();
  }
};

// Custom matchers for better test readability
export const customMatchers = {
  toHaveFormError: (input: HTMLElement, expectedError: string) => {
    const hasError = input.getAttribute('aria-invalid') === 'true';
    const errorElement = input.closest('.space-y-2')?.querySelector('.text-destructive');
    const hasExpectedError = errorElement?.textContent?.includes(expectedError);
    
    return {
      pass: hasError && !!hasExpectedError,
      message: () => 
        hasError 
          ? `Expected input to have error "${expectedError}" but found "${errorElement?.textContent}"`
          : `Expected input to have error "${expectedError}" but input has no errors`
    };
  },
  
  toBeProcessing: (button: HTMLElement) => {
    const isDisabled = button.hasAttribute('disabled');
    const hasSpinner = button.querySelector('.animate-spin');
    
    return {
      pass: isDisabled && !!hasSpinner,
      message: () => 
        isDisabled 
          ? hasSpinner 
            ? 'Button is processing (disabled with spinner)'
            : 'Button is disabled but missing loading spinner'
          : 'Button is not in processing state'
    };
  }
};

// Type-safe event helpers
export const fireFormSubmit = (form: HTMLFormElement) => {
  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
};

export const fireInputChange = (input: HTMLInputElement, value: string) => {
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
};
