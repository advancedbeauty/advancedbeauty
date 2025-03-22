'use client';

import { useSession } from 'next-auth/react';
import ActiveLink from '@/components/ui/features/ActiveLink';

const Navlinks = () => {
  const { data: session } = useSession();
  return (
    <div className="flex gap-10 font-medium text-sm uppercase">
      <ActiveLink href="/" text="Home" />
      <ActiveLink href="/services" text="Services" />
      <ActiveLink href="/offers" text="Offers" />
      <ActiveLink href="/wishlist" text="Wishlist" />
      {session?.user?.role === 'A' && (
        <ActiveLink href="/admin/dashboard" text="Dashboard" />
      )}
    </div>
  );
};

export default Navlinks;
