import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';

import InertiaExample from '../../pages/InertiaExample';

// Mock Inertia Head component
if (typeof vi !== 'undefined') {
  vi.mock('@inertiajs/react', () => ({
    Head: ({ title }: { title: string }) => <title>{title}</title>,
  }));
}

describe('InertiaExample', () => {
  it('renders with the provided name', () => {
    render(<InertiaExample name="World" />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Hello World!'
    );
  });

  it('displays the correct page title', () => {
    render(<InertiaExample name="Test" />);

    expect(document.querySelector('title')).toHaveTextContent(
      'Inertia + Vite Ruby + React Example'
    );
  });

  it('initializes counter with zero', () => {
    render(<InertiaExample name="Test" />);

    expect(screen.getByRole('button')).toHaveTextContent('count is 0');
  });

  it('increments counter when button is clicked', async () => {
    const user = userEvent.setup();
    render(<InertiaExample name="Test" />);

    const button = screen.getByRole('button', { name: /count is/i });

    await user.click(button);
    expect(button).toHaveTextContent('count is 1');

    await user.click(button);
    expect(button).toHaveTextContent('count is 2');
  });

  it('renders all logo images with correct alt text', () => {
    render(<InertiaExample name="Test" />);

    expect(screen.getByAltText('Inertia logo')).toBeInTheDocument();
    expect(screen.getByAltText('Vite Ruby logo')).toBeInTheDocument();
    expect(screen.getByAltText('React logo')).toBeInTheDocument();
  });

  it('renders logo links with correct hrefs', () => {
    render(<InertiaExample name="Test" />);

    const inertiaLink = screen.getByRole('link', { name: /inertia logo/i });
    const viteRubyLink = screen.getByRole('link', { name: /vite ruby logo/i });
    const reactLink = screen.getByRole('link', { name: /react logo/i });

    expect(inertiaLink).toHaveAttribute('href', 'https://inertia-rails.dev');
    expect(viteRubyLink).toHaveAttribute(
      'href',
      'https://vite-ruby.netlify.app'
    );
    expect(reactLink).toHaveAttribute('href', 'https://react.dev');
  });

  it('displays the main heading', () => {
    render(<InertiaExample name="Test" />);

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Inertia + Vite Ruby + React'
    );
  });

  it('displays HMR instruction text', () => {
    render(<InertiaExample name="Test" />);

    expect(
      screen.getByText((_, element) => {
        return (
          element?.textContent ===
          'Edit app/frontend/pages/InertiaExample.jsx and save to test HMR'
        );
      })
    ).toBeInTheDocument();
  });
});
