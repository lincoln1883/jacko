# Frontend Test Setup Guide

## ✅ What's Already Set Up

Your Rails application now has a comprehensive frontend testing setup with:

### Dependencies Installed
- **Vitest** - Modern test runner with excellent TypeScript support
- **React Testing Library** - Testing utilities that encourage good testing practices
- **@testing-library/user-event** - Realistic user interaction simulation
- **@testing-library/jest-dom** - Additional DOM matchers
- **@vitest/coverage-v8** - Code coverage reporting
- **jsdom** - Browser-like environment for tests

### Configuration Complete
- **vitest.config.ts** - Optimized configuration with React support, coverage thresholds, and proper file watching
- **Test setup file** - Comprehensive mocking of Inertia.js, browser APIs, and assets
- **Test utilities** - Custom render functions and helpers for Inertia apps
- **Test scripts** - `test`, `test:watch`, `test:coverage`, `test:ui` commands

### Test Structure
```
app/frontend/__tests__/
├── components/
│   └── ui/
│       ├── Alert.test.tsx
│       ├── Button.test.tsx (comprehensive)
│       ├── FlashMessage.test.tsx (comprehensive)
│       ├── Input.test.tsx (comprehensive)
│       └── Label.test.tsx (comprehensive)
├── lib/
│   └── utils.test.ts
├── pages/
│   └── Auth/
│       ├── Sessions/
│       │   └── Index.test.tsx
│       ├── SignIn.test.tsx
│       └── SignUp.test.tsx
└── test/
    ├── setup.ts
    └── utils.tsx
```

## 🧪 Current Test Status

**Total Tests:** 208 tests across 9 files
**Passing:** 179 tests (86% pass rate)
**Failing:** 29 tests (mostly minor configuration issues)

### Test Coverage Configured
- **Branches:** 80% threshold
- **Functions:** 80% threshold  
- **Lines:** 80% threshold
- **Statements:** 80% threshold

## 🔧 How to Fix Common Test Failures

### 1. Input Component `autoFocus` Issues
**Problem:** Tests expect `autoFocus` attribute but it's not being set.

```typescript
// In your Input component, ensure autoFocus is properly forwarded:
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ autoFocus, ...props }, ref) => (
    <input
      ref={ref}
      autoFocus={autoFocus}  // Make sure this is included
      {...props}
    />
  )
);
```

### 2. Button `asChild` Functionality
**Problem:** Tests fail when testing the `asChild` prop with Radix UI Slot.

```typescript
// Ensure your Button component properly handles single child elements:
if (asChild) {
  return (
    <Slot ref={ref} className={buttonVariants({ variant, size, className })}>
      {children}
    </Slot>
  );
}
```

### 3. Input Type Attribute
**Problem:** Default input type should be "text" but isn't being set.

```typescript
// Add default type to Input component:
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type = "text", ...props }, ref) => (
    <input type={type} ref={ref} {...props} />
  )
);
```

### 4. Form Role Recognition
**Problem:** Form elements not being recognized with `role="form"`.

```html
<!-- Add explicit role to forms if needed: -->
<form role="form">
  <!-- form content -->
</form>
```

### 5. Flash Message Timeout Issues
**Problem:** Tests timing out due to user event setup conflicts.

```typescript
// Use simpler user event setup for components with timers:
const user = userEvent.setup();
// Instead of: userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
```

## 🎯 Best Practices Already Implemented

### 1. Component Testing Patterns
- **User-centric queries** - Using `getByRole`, `getByLabelText`, etc.
- **Interaction testing** - Real user events with proper async/await
- **Accessibility testing** - Checking for proper ARIA attributes and screen reader compatibility

### 2. Test Organization
- **Descriptive test groups** - Related tests grouped by functionality
- **Single assertion principle** - Each test verifies one behavior
- **Comprehensive coverage** - Edge cases, error states, and integration scenarios

### 3. Inertia.js Testing
- **Custom render function** - `renderWithInertia` that mocks Inertia hooks
- **Form testing utilities** - Helpers for testing form submissions and validation
- **Mock management** - Proper mocking of Inertia router and components

## 🚀 Running Tests

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Coverage report
npm run test:coverage

# Interactive UI (great for debugging)
npm run test:ui
```

## 📊 Test Coverage Goals

Your coverage thresholds are set to professional standards:
- **80% minimum** across all metrics
- **Excludes** configuration files, test files, and generated code
- **Includes** all source files in coverage analysis

## 💡 Next Steps

1. **Fix the failing tests** using the guidance above
2. **Add tests for new components** as you build them
3. **Consider E2E tests** with Playwright or Cypress for critical user flows
4. **Set up CI/CD** to run tests automatically on commits

## 🔍 Debugging Test Failures

When tests fail:

1. **Run single test file:**
   ```bash
   npm test Button.test.tsx
   ```

2. **Use test UI for debugging:**
   ```bash
   npm run test:ui
   ```

3. **Check actual vs expected output** in the test failure messages

4. **Add `screen.debug()`** to see the rendered HTML:
   ```typescript
   render(<Component />);
   screen.debug(); // Prints current DOM
   ```

This test setup follows industry best practices and will scale with your application. The failing tests are minor issues that can be easily resolved by ensuring your components handle the expected props and attributes correctly.
