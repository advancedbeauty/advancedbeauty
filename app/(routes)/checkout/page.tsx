import { Suspense } from 'react';
import Checkout from '@/components/checkout';

const page: React.FC = () => {
  return (
    <Suspense>
      <Checkout />
    </Suspense>
  );
};

export default page;
