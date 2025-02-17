'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { IconType } from 'react-icons';

interface IconLinkProps {
    icon: IconType;
    activeIcon: IconType;
    href: string;
    text?: string;
}

const IconLink: React.FC<IconLinkProps> = ({ icon: Icon, activeIcon: ActiveIcon, href, text }) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link href={href} className="flex flex-col justify-center items-center">
            {isActive ? (
                <ActiveIcon size={26} className="text-[#D9C1A3]" />
            ) : (
                <Icon size={26} className="text-[#a3a3a3] hover:text-[#D9C1A3]" />
            )}
            <p className={`text-[10px] ${isActive ? 'text-[#D9C1A3] font-semibold' : 'text-[#a3a3a3] hover:text-[#D9C1A3]'}`}>
                {text}
            </p>
        </Link>
    );
};

export default IconLink;
