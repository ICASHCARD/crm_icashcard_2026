import React from 'react';
import Layout from '@/components/Layout';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Layout>{children}</Layout>;
};

export default MainLayout;
