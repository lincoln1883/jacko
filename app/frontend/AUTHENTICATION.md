# Authentication Frontend Components

This document outlines the Inertia.js React components that handle authentication in the Jacko application.

## 🏗️ Architecture

The authentication system is built using:
- **Inertia.js** for seamless Rails-React integration
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Hooks** (`useForm`, `usePage`) for state management

## 📁 Component Structure

```
app/frontend/
├── components/
│   ├── layouts/
│   │   ├── AppLayout.tsx      # Main app layout with nav
│   │   └── AuthLayout.tsx     # Auth pages layout
│   └── ui/
│       ├── Input.tsx          # Form input with validation
│       ├── Button.tsx         # Button with loading states
│       └── FlashMessage.tsx   # Flash message notifications
├── pages/
│   ├── Auth/
│   │   ├── SignIn.tsx         # Login form
│   │   ├── SignUp.tsx         # Registration form
│   │   └── Sessions/
│   │       └── Index.tsx      # Active sessions management
│   ├── Identity/
│   │   ├── Emails/
│   │   │   └── Edit.tsx       # Change email address
│   │   ├── EmailVerifications/
│   │   │   ├── New.tsx        # Email verification prompt
│   │   │   └── Show.tsx       # Verification success
│   │   └── PasswordResets/
│   │       ├── New.tsx        # Request password reset
│   │       └── Edit.tsx       # Set new password
│   ├── Passwords/
│   │   └── Edit.tsx           # Change password
│   └── Home/
│       └── Index.tsx          # Dashboard
└── types/
    └── auth.ts                # TypeScript interfaces
```

## 🔄 Route Mapping

| Route | Component | Purpose |
|-------|-----------|---------|
| `/sign_in` | `Auth/SignIn` | User login |
| `/sign_up` | `Auth/SignUp` | User registration |
| `/sessions` | `Auth/Sessions/Index` | Manage active sessions |
| `/identity/email/edit` | `Identity/Emails/Edit` | Change email |
| `/identity/password_reset/new` | `Identity/PasswordResets/New` | Request reset |
| `/identity/password_reset/edit` | `Identity/PasswordResets/Edit` | Reset password |
| `/password/edit` | `Passwords/Edit` | Change password |
| `/` | `Home/Index` | Dashboard |

## ✨ Features

### Flash Messages
- **Types**: `notice`, `alert`, `error`
- **Auto-hide**: Automatically disappear after 5 seconds
- **Dismissible**: Users can manually close them
- **Integrated**: Available in both `AppLayout` and `AuthLayout`

### Form Handling
- **Validation**: Server-side errors displayed per field
- **Loading States**: Buttons show loading spinners
- **Auto-reset**: Password fields cleared on error
- **Preservation**: Form data preserved during navigation

### Security Features
- **Session Management**: View and logout individual sessions
- **Password Challenge**: Required for sensitive operations
- **Email Verification**: Required for account activation
- **CSRF Protection**: Built into Inertia forms

### User Experience
- **Responsive**: Mobile-friendly layouts
- **Accessibility**: Proper ARIA labels and focus management
- **Auto-focus**: Smart field focusing for better UX
- **Helpful Hints**: Contextual help text for inputs

## 🎯 Key Components

### Layouts
- **`AuthLayout`**: Centered card layout for auth pages
- **`AppLayout`**: Full app layout with navigation and flash messages

### UI Components
- **`Input`**: Validates and displays errors per field
- **`Button`**: Shows loading states and supports variants
- **`FlashMessage`**: Displays notifications with appropriate styling

### Type Safety
All components use proper TypeScript interfaces:
- `User`, `Session`, `FlashMessage`
- `PageProps` for common page data
- `SignInFormData`, `SignUpFormData`, `IdentityFormData`

## 🚀 Usage Examples

### Basic Form
```tsx
const { data, setData, post, processing } = useForm({
  email: '',
  password: '',
});

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  post('/sign_in');
};
```

### With Flash Messages
```tsx
const { flash } = usePage<PageProps>().props;

return (
  <AppLayout title="Dashboard">
    {flash && <FlashMessageComponent flash={flash} />}
    {/* page content */}
  </AppLayout>
);
```

### Error Handling
```tsx
<Input
  id="email"
  label="Email"
  value={data.email}
  onChange={(e) => setData('email', e.target.value)}
  errors={errors?.email}
  required
/>
```

## 🔧 Backend Integration

Controllers have been updated to use Inertia responses:
- `render inertia: 'ComponentName', props: { data }`
- Flash messages passed automatically through redirects
- Validation errors returned as `errors` prop

## 📱 Responsive Design

All components use Tailwind's responsive utilities:
- Mobile-first approach
- Breakpoints: `sm:`, `md:`, `lg:`
- Flexible layouts that work on all devices
