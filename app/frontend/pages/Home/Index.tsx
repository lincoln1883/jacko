import React from 'react';
import { usePage } from '@inertiajs/react';
import Landing from './Landing';
import Dashboard from './Dashboard';
import type { PageProps } from '../../types/auth';

const Home: React.FC = () => {
  const { auth } = usePage<PageProps>().props;
  const user = auth?.user;

  // Route to appropriate component based on authentication state
  if (user) {
    return <Dashboard />;
  } else {
    return <Landing />;
  }
};

export default Home;
