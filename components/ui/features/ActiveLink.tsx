'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NextLink from '@/components/ui/features/NextLink';

interface ActiveLinkProps {
  href: string;
  text: string;
}

const ActiveLink: React.FC<ActiveLinkProps> = ({ href, text }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <NextLink
      href={href}
      className={isActive ? 'text-[#D9C1A3]' : 'hover:text-[#D9C1A3]'}
    >
      {text}
      
    </NextLink>
  );
};

export default ActiveLink;
