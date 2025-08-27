# Frontend Development Setup

This document outlines the frontend development setup for the Jacko Rails application.

## Technology Stack

- **Framework**: React 19.1.1 with TypeScript
- **Build Tool**: Vite with vite-plugin-ruby for Rails integration
- **Styling**: Tailwind CSS 4.1.12
- **State Management**: Inertia.js for React
- **Testing**: Vitest with React Testing Library
- **Linting**: ESLint 9.34.0 with TypeScript support
- **Formatting**: Prettier 3.6.2

## Available Scripts

### Development
```bash
npm run build      # Build for production
npm run check      # Type checking with TypeScript
```

### Linting & Formatting
```bash
npm run lint       # Run ESLint
npm run lint:fix   # Run ESLint with auto-fix
npm run format     # Format code with Prettier
npm run format:check # Check code formatting
```

### Testing
```bash
npm run test         # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run test:ui      # Run tests with UI interface
```

## Project Structure

```
app/frontend/
├── assets/           # Static assets (images, icons)
├── entrypoints/      # Vite entry points
├── pages/           # Inertia.js page components
├── test/            # Test setup and utilities
└── vite-env.d.ts    # Vite TypeScript definitions
```

## Configuration Files

- **`vitest.config.ts`**: Vitest testing configuration
- **`eslint.config.js`**: ESLint linting rules
- **`.prettierrc`**: Prettier formatting rules
- **`vite.config.ts`**: Vite build configuration
- **`tsconfig.*.json`**: TypeScript configuration

## Testing Guidelines

### Writing Tests
- Use React Testing Library for component testing
- Focus on user behavior, not implementation details
- Test accessibility features
- Mock external dependencies properly

### Test Structure
- Tests are located alongside their components (e.g., `Component.test.tsx`)
- Shared test utilities are in `app/frontend/test/`
- Global test setup is in `app/frontend/test/setup.ts`

### Example Test
```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'

import MyComponent from './MyComponent'

describe('MyComponent', () => {
  it('renders with correct content', () => {
    render(<MyComponent title="Test" />)
    
    expect(screen.getByRole('heading')).toHaveTextContent('Test')
  })
})
```

## Linting Rules

The project follows strict TypeScript and React best practices:
- No `any` types (use `unknown` instead)
- Unused variables are errors
- React hooks rules enforced
- Accessibility rules enabled
- Prettier formatting integrated

## Code Style

- **Indentation**: 2 spaces
- **Quotes**: Single quotes
- **Semicolons**: Required
- **Line Length**: 80 characters
- **Trailing Commas**: ES5 style

## Continuous Integration

The project includes comprehensive CI/CD checks that run on every push and pull request:

### Frontend CI Jobs
- **`lint_frontend`**: Runs TypeScript compilation, ESLint, and Prettier checks
- **`test_frontend`**: Runs Vitest tests with coverage reporting

### What Runs on Every Push
1. **Type Checking**: `npm run check` - Ensures TypeScript compilation
2. **Linting**: `npm run lint` - Checks code quality and standards
3. **Formatting**: `npm run format:check` - Verifies code formatting
4. **Testing**: `npm run test:coverage` - Runs all tests with coverage
5. **Coverage Upload**: Uploads coverage reports to Codecov

### CI Requirements
All frontend checks must pass before:
- Docker image building
- Deployment to production
- Merging pull requests

### Coverage Reporting
- Coverage reports are generated in multiple formats (text, JSON, HTML, LCOV)
- LCOV reports are uploaded to Codecov for tracking
- Coverage files are located in the `coverage/` directory

## Development Workflow

1. **Code**: Write your React components with TypeScript
2. **Lint**: Run `npm run lint` to check for issues
3. **Format**: Run `npm run format` to format code
4. **Test**: Run `npm run test` to ensure functionality
5. **Build**: Run `npm run build` to verify production build

## Tips for Development

- Use TypeScript interfaces for all props
- Follow the existing component patterns
- Write tests for new components
- Use semantic HTML elements
- Ensure accessibility compliance
- Keep components small and focused
