import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
  HomeIcon,
  UsersIcon,
  UserCheckIcon,
  BriefcaseIcon,
  GavelIcon,
  CalculatorIcon,
  LogOutIcon,
} from 'lucide-react';
import { User } from '../../types/auth';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { auth } = usePage().props as any; // Temporary `any`
  const user = auth?.user as User | undefined;

  const adminNavigation = [
    {
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: HomeIcon,
    },
    {
      label: 'Users',
      href: '/admin/users',
      icon: UsersIcon,
    },
    {
      label: 'Verifications',
      href: '/admin/verification_requests',
      icon: UserCheckIcon,
    },
    {
      label: 'Jobs',
      href: '/admin/jobs',
      icon: BriefcaseIcon,
    },
    {
      label: 'Disputes',
      // Assuming '/admin/disputes' is the index route, if there's a show route like /admin/disputes/:id it would be handled in the specific component.
      href: '/admin/disputes',
      icon: GavelIcon,
    },
    {
      label: 'Pricing Config',
      // Assuming '/admin/construction_services' is the index route.
      href: '/admin/construction_services',
      icon: CalculatorIcon,
    },
  ];

  return (
    <div>
      <Head title={title} />
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans antialiased text-gray-800">
        {/* Header */}
        <header className="bg-white shadow-md h-16 flex items-center justify-between px-6 lg:px-8 border-b border-gray-200">
          <div className="flex items-center">
            <Link
              href="/admin/dashboard"
              className="flex items-center space-x-2 text-blue-700 hover:text-blue-800 transition-colors duration-200"
            >
              <HomeIcon className="h-6 w-6" />
              <span className="text-xl font-bold tracking-tight">
                Admin Panel
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <span className="text-gray-700 font-medium">{user.email}</span>
            ) : (
              <Link
                href="/login"
                className="text-sm text-blue-600 hover:underline"
              >
                Log in
              </Link>
            )}
            <Link
              href="/sign_out"
              method="delete"
              as="button"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
            >
              <LogOutIcon className="h-5 w-5" />
              <span>Log Out</span>
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-grow flex">
          {/* Sidebar for larger screens */}
          <nav className="w-64 bg-white shadow-md border-r border-gray-200 p-4 hidden lg:flex flex-col gap-1">
            {adminNavigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200
                  ${
                    window.location.pathname.startsWith(item.href)
                      ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
            <Link
              href="/sign_out"
              method="delete"
              as="button"
              className="flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200 w-full justify-start mt-auto"
            >
              <LogOutIcon className="h-5 w-5" />
              <span>Log Out</span>
            </Link>
          </nav>

          {/* Page Content */}
          <main className="flex-1 p-8 overflow-auto bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
