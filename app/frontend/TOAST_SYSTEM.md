# Toast Notification System

This document describes the comprehensive toast notification system implemented for the Jamaica Skills & Trades Platform. The system provides modern, non-intrusive toast notifications that replace traditional flash messages.

## 🌟 Features

- **Multiple Toast Types**: Success, error, warning, and info notifications
- **Auto-dismiss**: Configurable auto-dismiss duration
- **Manual Dismiss**: Close button for manual dismissal
- **Action Support**: Optional action buttons in toasts
- **Animation**: Smooth slide-in/slide-out animations
- **Progress Bar**: Visual progress indicator for timed toasts
- **Positioning**: Configurable toast positioning
- **Accessibility**: Full ARIA support and keyboard navigation
- **TypeScript**: Complete type safety
- **Testing**: Comprehensive test coverage

## 📁 File Structure

```
app/frontend/
├── components/ui/
│   ├── toast.tsx                    # Individual toast component
│   └── toast-container.tsx          # Toast container and positioning
├── contexts/
│   └── ToastContext.tsx             # Toast state management
├── hooks/
│   └── useFlashToast.ts             # Flash message to toast conversion
├── __tests__/
│   ├── components/ui/
│   │   └── Toast.test.tsx           # Toast component tests
│   └── contexts/
│       └── ToastContext.test.tsx    # Context and hook tests
└── entrypoints/
    └── application.css              # Toast animations
```

## 🚀 Quick Start

### Basic Usage

```tsx
import React from 'react';
import { useToast } from '../contexts/ToastContext';

const MyComponent: React.FC = () => {
  const toast = useToast();

  const handleSuccess = () => {
    toast.success('Operation completed successfully!');
  };

  const handleError = () => {
    toast.error('Something went wrong!', {
      duration: 7000, // Keep error messages longer
    });
  };

  return (
    <div>
      <button onClick={handleSuccess}>Success Toast</button>
      <button onClick={handleError}>Error Toast</button>
    </div>
  );
};
```

### Layout Integration

The toast system is automatically integrated into all layout components:

- **AppLayout**: For authenticated users
- **GuestLayout**: For unauthenticated users  
- **AuthLayout**: For authentication pages

## 📖 API Reference

### Toast Types

```tsx
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;                    // Unique identifier
  type: ToastType;               // Toast type
  title?: string;                // Optional title
  message: string;               // Main message
  duration?: number;             // Auto-dismiss duration (0 = permanent)
  action?: {                     // Optional action button
    label: string;
    onClick: () => void;
  };
}
```

### useToast Hook

The main hook for managing toast notifications:

```tsx
const {
  // State
  toasts,              // Array of active toasts

  // Methods
  addToast,            // Add custom toast
  removeToast,         // Remove specific toast
  clearAllToasts,      // Clear all toasts

  // Convenience methods
  success,             // Add success toast
  error,               // Add error toast
  warning,             // Add warning toast
  info,                // Add info toast
} = useToast();
```

#### Method Signatures

```tsx
// Convenience methods
success(message: string, options?: Partial<Toast>): string
error(message: string, options?: Partial<Toast>): string
warning(message: string, options?: Partial<Toast>): string
info(message: string, options?: Partial<Toast>): string

// General method
addToast(toast: Omit<Toast, 'id'>): string
removeToast(id: string): void
clearAllToasts(): void
```

## 📋 Usage Examples

### Basic Toast Types

```tsx
const ExampleComponent: React.FC = () => {
  const toast = useToast();

  return (
    <div className="space-y-2">
      <button onClick={() => toast.success('Profile updated successfully!')}>
        Success Toast
      </button>
      
      <button onClick={() => toast.error('Failed to save profile')}>
        Error Toast
      </button>
      
      <button onClick={() => toast.warning('Profile is incomplete')}>
        Warning Toast
      </button>
      
      <button onClick={() => toast.info('New features available')}>
        Info Toast
      </button>
    </div>
  );
};
```

### Custom Options

```tsx
const AdvancedExamples: React.FC = () => {
  const toast = useToast();

  const showAdvancedToast = () => {
    toast.success('File uploaded successfully!', {
      title: 'Upload Complete',
      duration: 8000,
      action: {
        label: 'View File',
        onClick: () => {
          // Navigate to file
          console.log('Viewing file...');
        },
      },
    });
  };

  const showPermanentToast = () => {
    toast.error('Connection lost. Please check your internet.', {
      duration: 0, // Won't auto-dismiss
      title: 'Connection Error',
    });
  };

  return (
    <div className="space-y-2">
      <button onClick={showAdvancedToast}>
        Toast with Action
      </button>
      <button onClick={showPermanentToast}>
        Permanent Toast
      </button>
    </div>
  );
};
```

### Form Integration

```tsx
const FormExample: React.FC = () => {
  const toast = useToast();
  const { router } = useInertiajs();

  const handleSubmit = async (formData: FormData) => {
    try {
      await submitForm(formData);
      
      toast.success('Profile saved successfully!', {
        action: {
          label: 'View Profile',
          onClick: () => router.visit('/profile'),
        },
      });
    } catch (error) {
      toast.error('Failed to save profile. Please try again.', {
        duration: 7000,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit">Save Profile</button>
    </form>
  );
};
```

## ⚙️ Configuration

### ToastProvider Options

```tsx
<ToastProvider 
  maxToasts={5}           // Maximum number of visible toasts
  defaultDuration={5000}  // Default auto-dismiss duration
>
  {children}
</ToastProvider>
```

### ToastContainer Positioning

```tsx
<ToastContainer 
  position="top-right"    // Toast positioning
/>
```

Available positions:
- `top-right` (default)
- `top-left`
- `top-center`
- `bottom-right`
- `bottom-left`
- `bottom-center`

## 🎨 Customization

### Custom Toast Styles

The toast components use Tailwind CSS classes that can be customized:

```tsx
// Success toast classes
'bg-green-50 border-green-400 text-green-800'

// Error toast classes  
'bg-red-50 border-red-400 text-red-800'

// Warning toast classes
'bg-amber-50 border-amber-400 text-amber-800'

// Info toast classes
'bg-blue-50 border-blue-400 text-blue-800'
```

### Custom Animations

CSS animations are defined in `application.css`:

```css
@keyframes toast-progress {
  from { width: 100%; }
  to { width: 0%; }
}

@keyframes toast-slide-in {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes toast-slide-out {
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(100%); opacity: 0; }
}
```

## 🔄 Migration from Flash Messages

The system automatically converts Rails flash messages to toasts via the `useFlashToast` hook. This works seamlessly with existing Rails controllers:

### Controller (No Changes Required)

```ruby
class ProfileController < ApplicationController
  def update
    if @profile.update(profile_params)
      flash[:notice] = 'Profile updated successfully!'
      redirect_to profile_path
    else
      flash[:alert] = 'Failed to update profile'
      render :edit
    end
  end
end
```

### Flash Message Mapping

- `flash[:notice]` → Success toast (green)
- `flash[:alert]` → Error toast (red) 
- `flash[:error]` → Error toast (red)
- `flash[:warning]` → Warning toast (amber)
- `flash[:info]` → Info toast (blue)

## ♿ Accessibility

The toast system includes comprehensive accessibility features:

- **ARIA Attributes**: `role="alert"`, `aria-live="polite"`
- **Keyboard Navigation**: Tab navigation for close and action buttons
- **Screen Reader Support**: Proper labeling and announcements
- **Focus Management**: Non-disruptive focus handling

## 🧪 Testing

### Component Testing

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ToastProvider } from '../contexts/ToastContext';
import MyComponent from './MyComponent';

test('shows success toast', () => {
  render(
    <ToastProvider>
      <MyComponent />
    </ToastProvider>
  );

  fireEvent.click(screen.getByText('Save'));
  expect(screen.getByText('Saved successfully!')).toBeInTheDocument();
});
```

### Hook Testing

```tsx
import { renderHook, act } from '@testing-library/react';
import { useToast } from '../contexts/ToastContext';

test('adds toast', () => {
  const { result } = renderHook(() => useToast(), {
    wrapper: ToastProvider,
  });

  act(() => {
    result.current.success('Test message');
  });

  expect(result.current.toasts).toHaveLength(1);
  expect(result.current.toasts[0].message).toBe('Test message');
});
```

## 🔧 Troubleshooting

### Common Issues

**Toast not appearing**
- Ensure component is wrapped in `ToastProvider`
- Check that `ToastContainer` is rendered in layout

**useToast hook error**
- Must be used within a `ToastProvider`
- Check component hierarchy

**Animations not working**
- Ensure CSS is properly imported
- Check Tailwind CSS configuration

**Flash messages not converting**
- Verify `useFlashToast` hook is called in layout
- Check Rails controller flash message format

### Debug Mode

Add debug logging to track toast lifecycle:

```tsx
const toast = useToast();

// Add debug toast
toast.info(`Debug: ${toast.toasts.length} toasts active`, {
  duration: 2000,
});
```

## 🚀 Performance Considerations

- **Memory Management**: Toasts auto-cleanup after dismissal
- **Maximum Toasts**: Configurable limit prevents memory buildup
- **Animation Performance**: CSS transforms for smooth 60fps animations
- **Bundle Size**: Minimal impact with tree-shaking

## 🎯 Best Practices

1. **Appropriate Duration**: 
   - Success: 5 seconds
   - Error: 7 seconds  
   - Warning: 6 seconds
   - Info: 5 seconds

2. **Message Guidelines**:
   - Keep messages concise and actionable
   - Use specific language over generic terms
   - Include helpful actions when relevant

3. **Toast Limits**:
   - Limit to 3-5 visible toasts maximum
   - Stack newer toasts on top
   - Auto-dismiss older toasts when limit reached

4. **Error Handling**:
   - Always show error feedback
   - Provide recovery actions when possible
   - Use appropriate toast types

## 📝 Examples in Codebase

See these files for implementation examples:

- `app/frontend/components/layouts/AppLayout.tsx` - Layout integration
- `app/frontend/hooks/useFlashToast.ts` - Flash conversion
- `app/frontend/__tests__/components/ui/Toast.test.tsx` - Testing examples

## 🔗 Related Documentation

- [Component Library Documentation](./COMPONENTS.md)
- [Testing Guide](./TESTING.md)
- [Accessibility Guidelines](./ACCESSIBILITY.md)
