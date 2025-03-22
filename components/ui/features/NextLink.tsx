'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NextLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  protected?: boolean;
}

const NextLink: React.FC<NextLinkProps> = ({
  protected: isProtected,
  href,
  children,
  ...props
}) => {
  const currentPath = usePathname();
  let modifiedHref = href;
  if (isProtected && typeof href === 'string') {
    const url = new URL(href, window.location.origin);
    url.searchParams.set('callbackUrl', currentPath);
    modifiedHref = url.pathname + url.search;
  }
  return (
    <Link href={modifiedHref} {...props}>
      {children}
    </Link>
  );
};

export default NextLink;
