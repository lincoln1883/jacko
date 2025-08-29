import { screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import SessionsIndex from '../../../../pages/Auth/Sessions/Index';
import { renderWithInertia } from '../../../../test/utils';
import type { Session } from '../../../../types/auth';

// The Inertia components and hooks are mocked globally in setup.ts

// Mock window.confirm
Object.defineProperty(window, 'confirm', {
  writable: true,
  value: vi.fn(),
});

const mockSessions: Session[] = [
  {
    id: '1',
    user_agent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    ip_address: '192.168.1.100',
    created_at: 'January 15, 2025 at 10:30 AM',
  },
  {
    id: '2',
    user_agent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
    ip_address: '192.168.1.101',
    created_at: 'January 14, 2025 at 2:15 PM',
  },
  {
    id: '3',
    user_agent:
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    ip_address: '192.168.1.102',
    created_at: 'January 13, 2025 at 8:45 AM',
  },
];

describe('SessionsIndex', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (window.confirm as any).mockReturnValue(true);
  });

  describe('Rendering', () => {
    it('renders the sessions page with correct title and description', () => {
      renderWithInertia(<SessionsIndex sessions={mockSessions} />);

      expect(
        screen.getByRole('heading', { name: 'Active Sessions' })
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'Manage your active login sessions across different devices.'
        )
      ).toBeInTheDocument();
    });

    it('sets the correct page title', () => {
      renderWithInertia(<SessionsIndex sessions={mockSessions} />);
      expect(document.querySelector('title')).toHaveTextContent(
        'Active Sessions'
      );
    });

    it('renders back to home navigation link', () => {
      renderWithInertia(<SessionsIndex sessions={mockSessions} />);

      const backLink = screen.getByRole('link', { name: '← Back to Home' });
      expect(backLink).toHaveAttribute('href', '/');
    });

    it('renders security tip information', () => {
      renderWithInertia(<SessionsIndex sessions={mockSessions} />);

      expect(screen.getByText(/Security tip:/)).toBeInTheDocument();
      expect(
        screen.getByText(/If you see any sessions you don't recognize/)
      ).toBeInTheDocument();
    });
  });

  describe('Sessions list', () => {
    it('displays all sessions with correct information', () => {
      renderWithInertia(<SessionsIndex sessions={mockSessions} />);

      // Check that all sessions are displayed (using getAllByText for duplicates)
      expect(screen.getAllByText('Chrome Browser')).toHaveLength(2); // Two Chrome sessions
      expect(screen.getByText('Safari Browser')).toBeInTheDocument();

      // Check IP addresses
      expect(screen.getByText('IP Address: 192.168.1.100')).toBeInTheDocument();
      expect(screen.getByText('IP Address: 192.168.1.101')).toBeInTheDocument();
      expect(screen.getByText('IP Address: 192.168.1.102')).toBeInTheDocument();

      // Check timestamps
      expect(
        screen.getByText('Started: January 15, 2025 at 10:30 AM')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Started: January 14, 2025 at 2:15 PM')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Started: January 13, 2025 at 8:45 AM')
      ).toBeInTheDocument();
    });

    it('marks the first session as current', () => {
      renderWithInertia(<SessionsIndex sessions={mockSessions} />);

      expect(screen.getByText('Current')).toBeInTheDocument();

      // Should only have one "Current" badge
      expect(screen.getAllByText('Current')).toHaveLength(1);
    });

    it('displays log out button for each session', () => {
      renderWithInertia(<SessionsIndex sessions={mockSessions} />);

      const logoutButtons = screen.getAllByRole('button', { name: 'Log Out' });
      expect(logoutButtons).toHaveLength(3);
    });

    it('displays empty state when no sessions exist', () => {
      renderWithInertia(<SessionsIndex sessions={[]} />);

      expect(screen.getByText('No active sessions found.')).toBeInTheDocument();
      expect(screen.queryByText('Chrome Browser')).not.toBeInTheDocument();
    });
  });

  describe('User agent formatting', () => {
    it('formats Chrome user agent correctly', () => {
      const chromeSession: Session[] = [
        {
          id: '1',
          user_agent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0.4472.124',
          ip_address: '192.168.1.100',
          created_at: 'January 15, 2025 at 10:30 AM',
        },
      ];

      renderWithInertia(<SessionsIndex sessions={chromeSession} />);
      expect(screen.getByText('Chrome Browser')).toBeInTheDocument();
    });

    it('formats Firefox user agent correctly', () => {
      const firefoxSession: Session[] = [
        {
          id: '1',
          user_agent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
          ip_address: '192.168.1.100',
          created_at: 'January 15, 2025 at 10:30 AM',
        },
      ];

      renderWithInertia(<SessionsIndex sessions={firefoxSession} />);
      expect(screen.getByText('Firefox Browser')).toBeInTheDocument();
    });

    it('formats Safari user agent correctly', () => {
      const safariSession: Session[] = [
        {
          id: '1',
          user_agent:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15',
          ip_address: '192.168.1.100',
          created_at: 'January 15, 2025 at 10:30 AM',
        },
      ];

      renderWithInertia(<SessionsIndex sessions={safariSession} />);
      expect(screen.getByText('Safari Browser')).toBeInTheDocument();
    });

    it('formats mobile user agent correctly', () => {
      const mobileSession: Session[] = [
        {
          id: '1',
          user_agent:
            'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) Mobile/15E148',
          ip_address: '192.168.1.100',
          created_at: 'January 15, 2025 at 10:30 AM',
        },
      ];

      renderWithInertia(<SessionsIndex sessions={mobileSession} />);
      expect(screen.getByText('Mobile Device')).toBeInTheDocument();
    });

    it('handles unknown user agent gracefully', () => {
      const unknownSession: Session[] = [
        {
          id: '1',
          user_agent: 'SomeUnknownBrowser/1.0',
          ip_address: '192.168.1.100',
          created_at: 'January 15, 2025 at 10:30 AM',
        },
      ];

      renderWithInertia(<SessionsIndex sessions={unknownSession} />);
      expect(screen.getByText('Unknown Browser')).toBeInTheDocument();
    });

    it('handles missing user agent gracefully', () => {
      const sessionWithoutUserAgent: Session[] = [
        {
          id: '1',
          user_agent: undefined,
          ip_address: '192.168.1.100',
          created_at: 'January 15, 2025 at 10:30 AM',
        },
      ];

      renderWithInertia(<SessionsIndex sessions={sessionWithoutUserAgent} />);
      expect(screen.getByText('Unknown device')).toBeInTheDocument();
    });
  });

  describe('Session logout functionality', () => {
    it('shows confirmation dialog when logging out a session', async () => {
      const mockDelete = vi.fn();
      const { user, mockUseForm } = renderWithInertia(
        <SessionsIndex sessions={mockSessions} />
      );

      mockUseForm.mockReturnValue({
        data: {},
        setData: vi.fn(),
        post: vi.fn(),
        get: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
        delete: mockDelete,
        processing: false,
        errors: {},
        hasErrors: false,
        progress: null,
        wasSuccessful: false,
        recentlySuccessful: false,
        reset: vi.fn(),
        clearErrors: vi.fn(),
        setError: vi.fn(),
        transform: vi.fn(),
        isDirty: false,
      } as any);

      const logoutButtons = screen.getAllByRole('button', { name: 'Log Out' });
      await user.click(logoutButtons[0]);

      expect(window.confirm).toHaveBeenCalledWith(
        'Are you sure you want to log out this session?'
      );
    });

    it('calls delete endpoint when user confirms logout', async () => {
      const mockDelete = vi.fn();
      const { user } = renderWithInertia(
        <SessionsIndex sessions={mockSessions} />,
        {
          formOptions: {
            delete: mockDelete,
            processing: false,
          },
        }
      );

      (window.confirm as any).mockReturnValue(true);

      const logoutButtons = screen.getAllByRole('button', { name: 'Log Out' });
      await user.click(logoutButtons[1]); // Second session

      expect(mockDelete).toHaveBeenCalledWith('/sessions/2');
    });

    it('does not call delete endpoint when user cancels logout', async () => {
      const mockDelete = vi.fn();
      const { user, mockUseForm } = renderWithInertia(
        <SessionsIndex sessions={mockSessions} />
      );

      mockUseForm.mockReturnValue({
        data: {},
        setData: vi.fn(),
        post: vi.fn(),
        get: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
        delete: mockDelete,
        processing: false,
        errors: {},
        hasErrors: false,
        progress: null,
        wasSuccessful: false,
        recentlySuccessful: false,
        reset: vi.fn(),
        clearErrors: vi.fn(),
        setError: vi.fn(),
        transform: vi.fn(),
        isDirty: false,
      } as any);

      (window.confirm as any).mockReturnValue(false);

      const logoutButtons = screen.getAllByRole('button', { name: 'Log Out' });
      await user.click(logoutButtons[0]);

      expect(mockDelete).not.toHaveBeenCalled();
    });

    it('shows loading state when processing logout', () => {
      renderWithInertia(<SessionsIndex sessions={mockSessions} />, {
        formOptions: {
          delete: vi.fn(),
          processing: true,
        },
      });

      const logoutButtons = screen.getAllByRole('button', { name: 'Log Out' });

      logoutButtons.forEach((button) => {
        expect(button).toBeDisabled();
        expect(button.querySelector('.animate-spin')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      renderWithInertia(<SessionsIndex sessions={mockSessions} />);

      const heading = screen.getByRole('heading', { name: 'Active Sessions' });
      expect(heading).toBeInTheDocument();
    });

    it('has proper button labeling', () => {
      renderWithInertia(<SessionsIndex sessions={mockSessions} />);

      const logoutButtons = screen.getAllByRole('button', { name: 'Log Out' });
      logoutButtons.forEach((button) => {
        expect(button).toHaveAccessibleName();
      });
    });

    it('has proper link labeling', () => {
      renderWithInertia(<SessionsIndex sessions={mockSessions} />);

      const backLink = screen.getByRole('link', { name: '← Back to Home' });
      expect(backLink).toHaveAccessibleName();
    });

    it('provides meaningful session information', () => {
      renderWithInertia(<SessionsIndex sessions={mockSessions} />);

      // Each session should have identifiable information
      mockSessions.forEach((session) => {
        expect(
          screen.getByText(`IP Address: ${session.ip_address}`)
        ).toBeInTheDocument();
        expect(
          screen.getByText(`Started: ${session.created_at}`)
        ).toBeInTheDocument();
      });
    });
  });

  describe('Visual indicators', () => {
    it('displays current session badge correctly', () => {
      renderWithInertia(<SessionsIndex sessions={mockSessions} />);

      const currentBadge = screen.getByText('Current');
      expect(currentBadge).toHaveClass('bg-green-100', 'text-green-800');
    });

    it('displays session icons consistently', () => {
      renderWithInertia(<SessionsIndex sessions={mockSessions} />);

      // Check that session icons are present (SVG elements)
      const sessionIcons = document.querySelectorAll('svg');
      expect(sessionIcons.length).toBeGreaterThanOrEqual(mockSessions.length);
    });

    it('applies hover effects to session cards', () => {
      renderWithInertia(<SessionsIndex sessions={mockSessions} />);

      const sessionCards = document.querySelectorAll('.hover\\:bg-muted\\/50');
      expect(sessionCards).toHaveLength(mockSessions.length);
    });
  });

  describe('Error handling', () => {
    it('handles missing IP address gracefully', () => {
      const sessionWithoutIP: Session[] = [
        {
          id: '1',
          user_agent: 'Chrome/91.0.4472.124',
          ip_address: undefined,
          created_at: 'January 15, 2025 at 10:30 AM',
        },
      ];

      renderWithInertia(<SessionsIndex sessions={sessionWithoutIP} />);
      expect(screen.getByText('IP Address: Unknown')).toBeInTheDocument();
    });

    it('handles edge case of single session', () => {
      const singleSession: Session[] = [mockSessions[0]];

      renderWithInertia(<SessionsIndex sessions={singleSession} />);

      expect(screen.getByText('Current')).toBeInTheDocument();
      expect(screen.getAllByRole('button', { name: 'Log Out' })).toHaveLength(
        1
      );
    });
  });

  describe('Integration with Inertia', () => {
    it('uses correct Inertia delete method for session logout', async () => {
      const mockDelete = vi.fn();
      const { user } = renderWithInertia(
        <SessionsIndex sessions={mockSessions} />,
        {
          formOptions: {
            delete: mockDelete,
            processing: false,
          },
        }
      );

      const logoutButtons = screen.getAllByRole('button', { name: 'Log Out' });
      await user.click(logoutButtons[2]); // Third session

      expect(mockDelete).toHaveBeenCalledWith('/sessions/3');
    });
  });
});
