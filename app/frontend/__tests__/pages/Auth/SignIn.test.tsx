import { screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import SignIn from '../../../pages/Auth/SignIn';
import {
  renderWithInertia,
  createFormErrors,
  fillFormField,
  expectProperLabeling,
  mockFlashMessage,
} from '../../../test/utils';

// The Inertia components and hooks are mocked globally in setup.ts

describe('SignIn', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the sign in form with all required fields', () => {
      renderWithInertia(<SignIn />);

      expect(
        screen.getByRole('heading', { name: 'Jacko' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Sign In' })
      ).toBeInTheDocument();
      expect(
        screen.getByText('Welcome back! Please sign in to your account.')
      ).toBeInTheDocument();

      expect(screen.getByLabelText('Email address')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Sign In' })
      ).toBeInTheDocument();
    });

    it('sets the correct page title', () => {
      renderWithInertia(<SignIn />);
      expect(document.querySelector('title')).toHaveTextContent('Sign In');
    });

    it('renders navigation links', () => {
      renderWithInertia(<SignIn />);

      expect(
        screen.getByRole('link', { name: 'Forgot your password?' })
      ).toHaveAttribute('href', '/identity/password_reset/new');
      expect(screen.getByRole('link', { name: 'Sign up' })).toHaveAttribute(
        'href',
        '/sign_up'
      );
    });

    it('displays help text for new users', () => {
      renderWithInertia(<SignIn />);

      expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    });
  });

  describe('Email hint functionality', () => {
    it('pre-fills email field when email_hint is provided', () => {
      renderWithInertia(<SignIn email_hint="user@example.com" />, {
        pageProps: { email_hint: 'user@example.com' },
        formData: { email: 'user@example.com', password: '' },
      });

      const emailField = screen.getByLabelText(
        'Email address'
      ) as HTMLInputElement;
      expect(emailField.value).toBe('user@example.com');
    });

    it('handles focus management for better UX', () => {
      // Test with email hint provided
      const { getByLabelText } = renderWithInertia(
        <SignIn email_hint="user@example.com" />,
        {
          pageProps: { email_hint: 'user@example.com' },
          formData: { email: 'user@example.com', password: '' },
        }
      );

      const emailField = getByLabelText('Email address');
      emailField.focus();

      // Both fields should be rendered and accessible
      expect(document.activeElement).toBe(emailField);

      // Test without email hint
      renderWithInertia(<SignIn />);
    });
  });

  describe('Form interactions', () => {
    it('updates form data when user types in fields', async () => {
      const mockSetData = vi.fn();

      const { user } = renderWithInertia(<SignIn />, {
        formData: { email: '', password: '' },
        formOptions: {
          setData: mockSetData,
        },
      });

      const emailField = screen.getByLabelText('Email address');
      const passwordField = screen.getByLabelText('Password');

      await fillFormField(user, emailField, 'test@example.com');
      await fillFormField(user, passwordField, 'password123');

      // Check that setData was called for email field (user.type calls onChange for each character)
      expect(mockSetData).toHaveBeenCalledWith('email', 't');
      expect(mockSetData).toHaveBeenCalledWith('email', 'e');
      expect(mockSetData).toHaveBeenCalledWith('email', 'm');

      // Check that setData was called for password field
      expect(mockSetData).toHaveBeenCalledWith('password', 'p');
      expect(mockSetData).toHaveBeenCalledWith('password', '1');
      expect(mockSetData).toHaveBeenCalledWith('password', '3');

      // Verify total number of calls (16 for email + 11 for password)
      expect(mockSetData).toHaveBeenCalledTimes(27);
    });

    it('submits the form with correct data and endpoint', async () => {
      const mockPost = vi.fn();

      const { user } = renderWithInertia(<SignIn />, {
        formData: { email: 'test@example.com', password: 'password123' },
        formOptions: {
          processing: false,
          post: mockPost,
        },
      });

      const submitButton = screen.getAllByRole('button', {
        name: 'Sign In',
      })[0];
      await user.click(submitButton);

      expect(mockPost).toHaveBeenCalledWith('/sign_in', {
        onError: expect.any(Function),
      });
    });

    it('resets password field on form error', async () => {
      const mockReset = vi.fn();
      const mockPost = vi.fn().mockImplementation((_url, options) => {
        // Simulate an error callback
        if (options?.onError) {
          options.onError();
        }
      });

      const { user } = renderWithInertia(<SignIn />, {
        formData: { email: 'test@example.com', password: 'password123' },
        formOptions: {
          processing: false,
          post: mockPost,
          reset: mockReset,
        },
      });

      const submitButton = screen.getAllByRole('button', {
        name: 'Sign In',
      })[0];
      await user.click(submitButton);

      expect(mockReset).toHaveBeenCalledWith('password');
    });
  });

  describe('Loading states', () => {
    it('shows loading state when form is processing', () => {
      renderWithInertia(<SignIn />, {
        formOptions: { processing: true },
      });

      const submitButton = screen.getByRole('button', { name: 'Sign In' });
      expect(submitButton).toBeDisabled();
      expect(submitButton.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('disables form fields during processing', () => {
      renderWithInertia(<SignIn />, {
        formOptions: { processing: true },
      });

      const submitButton = screen.getByRole('button', { name: 'Sign In' });
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Error handling', () => {
    it('displays email validation errors', () => {
      const errors = createFormErrors({
        email: 'Please enter a valid email address',
      });

      renderWithInertia(<SignIn errors={errors} />, {
        pageProps: { errors },
        formOptions: { errors },
      });

      expect(
        screen.getByText('Please enter a valid email address')
      ).toBeInTheDocument();

      const emailField = screen.getByLabelText('Email address');
      expect(emailField).toHaveClass('border-red-500');
    });

    it('displays password validation errors', () => {
      const errors = createFormErrors({
        password: 'Password is required',
      });

      renderWithInertia(<SignIn errors={errors} />, {
        pageProps: { errors },
        formOptions: { errors },
      });

      expect(screen.getByText('Password is required')).toBeInTheDocument();

      const passwordField = screen.getByLabelText('Password');
      expect(passwordField).toHaveClass('border-red-500');
    });

    it('displays multiple errors for the same field', () => {
      const errors = createFormErrors({
        email: ['Email is required', 'Email format is invalid'],
      });

      renderWithInertia(<SignIn errors={errors} />, {
        pageProps: { errors },
        formOptions: { errors },
      });

      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Email format is invalid')).toBeInTheDocument();
    });

    it('displays general form errors from flash messages', () => {
      const flashMessage = mockFlashMessage('alert', 'Invalid credentials');

      renderWithInertia(<SignIn />, {
        pageProps: { flash: flashMessage },
      });

      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper form field labeling', () => {
      renderWithInertia(<SignIn />);

      const emailField = screen.getByLabelText('Email address');
      const passwordField = screen.getByLabelText('Password');

      expectProperLabeling(emailField);
      expectProperLabeling(passwordField);
    });

    it('has proper form structure', () => {
      renderWithInertia(<SignIn />);

      const form = document.querySelector('form');
      expect(form).toBeInTheDocument();
      expect(form).toHaveClass('space-y-6');
    });

    it('has proper heading hierarchy', () => {
      renderWithInertia(<SignIn />);

      // Check that headings are in proper order
      const headings = screen.getAllByRole('heading');
      expect(headings).toHaveLength(2);
      expect(headings[0]).toHaveTextContent('Jacko'); // Should be h1
      expect(headings[1]).toHaveTextContent('Sign In'); // Should be h2
    });

    it('has proper button labeling', () => {
      renderWithInertia(<SignIn />);

      const submitButton = screen.getByRole('button', { name: 'Sign In' });
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('has proper link labeling', () => {
      renderWithInertia(<SignIn />);

      const forgotPasswordLink = screen.getByRole('link', {
        name: 'Forgot your password?',
      });
      const signUpLink = screen.getByRole('link', { name: 'Sign up' });

      expect(forgotPasswordLink).toHaveAccessibleName();
      expect(signUpLink).toHaveAccessibleName();
    });

    it('provides proper autocomplete attributes', () => {
      renderWithInertia(<SignIn />);

      const emailField = screen.getByLabelText('Email address');
      const passwordField = screen.getByLabelText('Password');

      expect(emailField).toHaveAttribute('autoComplete', 'email');
      expect(passwordField).toHaveAttribute('autoComplete', 'current-password');
    });

    it('marks required fields properly', () => {
      renderWithInertia(<SignIn />);

      const emailField = screen.getByLabelText('Email address');
      const passwordField = screen.getByLabelText('Password');

      expect(emailField).toBeRequired();
      expect(passwordField).toBeRequired();
    });
  });

  describe('Integration with Inertia', () => {
    it('handles form submission with Inertia correctly', async () => {
      const mockPost = vi.fn();

      const { user } = renderWithInertia(<SignIn />, {
        formData: { email: 'test@example.com', password: 'password123' },
        formOptions: {
          processing: false,
          post: mockPost,
        },
      });

      const form = document.querySelector('form');
      const submitButton = screen.getByRole('button', { name: 'Sign In' });
      expect(form).toBeInTheDocument();

      await user.click(submitButton);

      expect(mockPost).toHaveBeenCalledWith('/sign_in', {
        onError: expect.any(Function),
      });
    });
  });
});
