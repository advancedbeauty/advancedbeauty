import React from 'react';
import { Suspense } from 'react';
import AuthPage from '@/components/auth';

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthPage />
    </Suspense>
  );
};

export default page;
