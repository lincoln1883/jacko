import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
// import ApplicationLogo from '../../ApplicationLogo'; // Cannot find module
// import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'; // Cannot find module
// import { Button } from '../ui/button'; // Removed unused import
import {
  // MenuIcon, // Removed unused import
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
      href: window.route('admin.dashboard.show'),
      icon: HomeIcon,
    },
    {
      label: 'Users',
      href: window.route('admin.users.index'),
      icon: UsersIcon,
    },
    {
      label: 'Verifications',
      href: window.route('admin.verification_requests.index'),
      icon: UserCheckIcon,
    },
    {
      label: 'Jobs',
      href: window.route('admin.jobs.index'),
      icon: BriefcaseIcon,
    },
    {
      label: 'Disputes',
      href: window.route('admin.disputes.index'),
      icon: GavelIcon,
    },
    {
      label: 'Pricing Config',
      href: window.route('admin.construction_services.index'),
      icon: CalculatorIcon,
    },
  ];

  return (
    <div>
      <Head title={title} />
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            {/* <Sheet> */}
            {/*   <SheetTrigger asChild> */}
            {/*     <Button variant="ghost" size="icon" className="lg:hidden mr-4"> */}
            {/*       <MenuIcon className="h-6 w-6" /> */}
            {/*     </Button> */}
            {/*   </SheetTrigger> */}
            {/*   <SheetContent side="left" className="w-64"> */}
            <nav className="flex flex-col gap-2 p-4">
              <Link href="/dashboard" className="mb-4">
                {/* <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" /> */}
                <span className="block h-9 w-auto fill-current text-gray-800">
                  Admin Panel
                </span>
              </Link>
              {adminNavigation.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-2 p-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100 ${
                    // Removed route().current(item.href) check due to type issues and unnecessary complexity
                    // The active state can be managed by Inertia's active prop or other means if needed
                    window.location.pathname.startsWith(item.href)
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              ))}
              <Link
                href={window.route('logout')}
                method="post"
                as="button"
                className="flex items-center gap-2 p-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100 text-gray-600 w-full justify-start mt-4"
              >
                <LogOutIcon className="h-5 w-5" />
                Log Out
              </Link>
            </nav>
            {/*   </SheetContent> */}
            {/* </Sheet> */}
            <Link href="/admin/dashboard">
              {/* <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" /> */}
              <span className="block h-9 w-auto fill-current text-gray-800">
                Admin Panel
              </span>
            </Link>
            <span className="ml-3 text-lg font-semibold text-gray-800">
              Admin
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <span className="text-gray-800 font-medium">{user.email}</span>
            ) : (
              <Link
                href={window.route('login')}
                className="text-sm text-gray-700 underline"
              >
                Log in
              </Link>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-grow flex">
          {/* Sidebar for larger screens */}
          {/* <nav className="w-64 bg-white shadow-sm border-r p-4 hidden lg:flex flex-col gap-2"> */}
          <nav className="w-64 bg-white shadow-sm border-r p-4 hidden lg:flex flex-col gap-2">
            {adminNavigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-2 p-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100 ${
                  // Removed route().current(item.href) check due to type issues and unnecessary complexity
                  // The active state can be managed by Inertia's active prop or other means if needed
                  window.location.pathname.startsWith(item.href)
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
            <Link
              href={window.route('logout')}
              method="post"
              as="button"
              className="flex items-center gap-2 p-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100 text-gray-600 w-full justify-start mt-auto"
            >
              <LogOutIcon className="h-5 w-5" />
              Log Out
            </Link>
          </nav>

          {/* Page Content */}
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
