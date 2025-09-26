import React from 'react';
import { usePage } from '@inertiajs/react';
import Landing from './Landing';
import AdminDashboard from '../Admin/DashboardPage';
import ClientDashboard from '../Client/DashboardPage';
import SupplierDashboard from '../Supplier/DashboardPage';
import type { PageProps, UserRole } from '../../types/auth';

const Home: React.FC = () => {
  const { auth } = usePage<PageProps>().props;
  const user = auth?.user;

  if (!user) {
    return <Landing />;
  }

  const renderDashboard = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return (
          <AdminDashboard
            userCount={0}
            supplierCount={0}
            clientCount={0}
            pendingVerificationRequestsCount={0}
            openJobsCount={0}
            pendingDisputesCount={0}
          />
        );
      case 'client':
        return <ClientDashboard />;
      case 'supplier':
      case 'contractor':
        return <SupplierDashboard />;
      default:
        return <Landing />;
    }
  };

  return renderDashboard(user.role);
};

export default Home;
